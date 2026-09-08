import { prisma } from '@/lib/prisma';
import { youtubeConnector } from '@/connectors/youtube';
import { tiktokConnector } from '@/connectors/tiktok';
import { discoverForPage } from '@/connectors/facebook';
import { checkForDuplicate, refreshExistingSource, normalizeUrl } from './deduplication';
import { analyzeContent } from './ai-analysis';
import { RawDiscoveredItem } from '@/lib/types';

/**
 * Runs one full discovery pass across all active categories and all
 * configured connectors. Safe to call repeatedly (e.g. on every dashboard
 * load, or from a cron job) — dedup ensures no duplicate rows are created.
 *
 * Returns a summary so callers (API routes, cron scripts) can report
 * how many genuinely new items were found.
 */
interface ProcessResult {
  scanned: number;
  inserted: boolean;
}

/**
 * Shared pipeline for a single discovered item, regardless of which
 * connector found it: dedup check -> AI analysis -> relevance gate ->
 * persist. Used by both the keyword-based YouTube/TikTok loop and the
 * per-Page Facebook loop so nothing gets a second, divergent code path.
 */
async function processDiscoveredItem(
  item: RawDiscoveredItem,
  categoryId: string,
  categoryName: string,
  categoryKeywords: string[],
  minRelevance: number
): Promise<'inserted' | 'duplicate' | 'below-threshold'> {
  const dedup = await checkForDuplicate(item);
  if (dedup.isDuplicate) {
    if (dedup.existingSourceId) await refreshExistingSource(dedup.existingSourceId, item);
    return 'duplicate';
  }

  const analysis = await analyzeContent({ item, categoryName, categoryKeywords });

  if (analysis.relevanceScore < minRelevance) {
    // Genuinely not relevant enough — do not fabricate a slot for it.
    return 'below-threshold';
  }

  const source = await prisma.source.create({
    data: {
      platform: item.platform,
      platformContentId: item.platformContentId,
      url: item.url,
      normalizedUrl: normalizeUrl(item.url),
      creatorName: item.creatorName,
      creatorId: item.creatorId,
      title: item.title,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
      viewCount: item.viewCount,
      likeCount: item.likeCount,
      commentCount: item.commentCount,
      metadata: (item.raw as any) ?? undefined
    }
  });

  await prisma.contentItem.create({
    data: {
      sourceId: source.id,
      categoryId,
      relevanceScore: analysis.relevanceScore,
      relevanceReason: analysis.relevanceReason,
      prophecyTopic: analysis.prophecyTopic,
      peopleMentioned: analysis.peopleMentioned,
      locations: analysis.locations,
      timeframe: analysis.timeframe,
      prophecyType: analysis.prophecyType,
      keyClaim: analysis.keyClaim,
      keywords: analysis.keywords,
      summary: analysis.summary,
      status: 'NEW'
    }
  });

  return 'inserted';
}

export async function runDiscovery(): Promise<{ scanned: number; newItems: number; skipped: number }> {
  const categories = await prisma.category.findMany({ where: { active: true } });
  const settings = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  const minRelevance = settings?.minimumRelevanceScore ?? 50;

  const sinceISO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(); // look back 7 days

  let scanned = 0;
  let newItems = 0;
  let skipped = 0;

  for (const category of categories) {
    const keywords = category.keywords.length > 0 ? category.keywords : [category.name];

    const [youtubeItems, tiktokItems] = await Promise.all([
      youtubeConnector.discover({ keywords, sinceISO, maxResults: 10 }),
      tiktokConnector.discover({ keywords, sinceISO, maxResults: 10 })
    ]);

    const allItems: RawDiscoveredItem[] = [...youtubeItems, ...tiktokItems];
    scanned += allItems.length;

    for (const item of allItems) {
      const outcome = await processDiscoveredItem(item, category.id, category.name, keywords, minRelevance);
      if (outcome === 'inserted') newItems += 1;
      else skipped += 1;
    }
  }

  // Followed prophets' Facebook Pages are scanned separately since FB
  // discovery is per-Page, not keyword based (see connectors/facebook.ts).
  // Each post is categorized against the "General Nigeria Prophecies"
  // category by default, since a Page isn't tied to one topic the way a
  // keyword search is — the AI relevance gate still filters out anything
  // that isn't genuinely prophecy-related.
  const generalCategory = categories.find((c) => c.id === 'cat-general') ?? categories[0];
  const prophets = await prisma.followedProphet.findMany({ where: { facebookPageUrl: { not: null } } });

  for (const prophet of prophets) {
    const pageId = extractFacebookPageId(prophet.facebookPageUrl!);
    if (!pageId || !generalCategory) continue;

    const fbItems = await discoverForPage(pageId, sinceISO);
    scanned += fbItems.length;

    for (const item of fbItems) {
      const outcome = await processDiscoveredItem(
        item,
        generalCategory.id,
        generalCategory.name,
        [...generalCategory.keywords, prophet.name, ...prophet.keywords],
        minRelevance
      );
      if (outcome === 'inserted') newItems += 1;
      else skipped += 1;
    }
  }

  return { scanned, newItems, skipped };
}

function extractFacebookPageId(url: string): string | null {
  const match = url.match(/facebook\.com\/([^/?]+)/);
  return match ? match[1] : null;
}
