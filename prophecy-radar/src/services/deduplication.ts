import { prisma } from '@/lib/prisma';
import { RawDiscoveredItem } from '@/lib/types';

/** Strips protocol, www, and tracking params so the same video isn't
 * treated as different content just because of a shared link's ?si= tag. */
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hostname = u.hostname.replace(/^www\./, '');
    const stripParams = ['si', 'utm_source', 'utm_medium', 'utm_campaign', 'feature', 'ab_channel'];
    stripParams.forEach((p) => u.searchParams.delete(p));
    u.hash = '';
    // YouTube short vs long form both resolve to the same video id param order-independent
    return `${u.hostname}${u.pathname}?${u.searchParams.toString()}`.replace(/\?$/, '').toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/** Cheap title similarity (word overlap) used as a last-resort signal
 * when IDs/URLs don't match but the same clip may have been reposted
 * under a slightly different title by the same creator. */
function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  const wordsB = new Set(b.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union; // Jaccard similarity, 0-1
}

export interface DedupResult {
  isDuplicate: boolean;
  existingSourceId?: string;
  reason?: string;
}

/**
 * Checks a freshly-discovered item against everything already stored.
 * Order of checks follows the brief: platform content ID -> canonical URL
 * -> normalized URL -> creator+title similarity -> publication date.
 */
export async function checkForDuplicate(item: RawDiscoveredItem): Promise<DedupResult> {
  // 1 & 2. Exact platform ID (also covers canonical URL, since it's derived from the ID)
  const byPlatformId = await prisma.source.findUnique({
    where: { platform_platformContentId: { platform: item.platform, platformContentId: item.platformContentId } }
  });
  if (byPlatformId) return { isDuplicate: true, existingSourceId: byPlatformId.id, reason: 'same platform content ID' };

  // 3. Normalized URL match (catches tracking-param variants of the same link)
  const normalized = normalizeUrl(item.url);
  const byUrl = await prisma.source.findFirst({ where: { normalizedUrl: normalized } });
  if (byUrl) return { isDuplicate: true, existingSourceId: byUrl.id, reason: 'matching normalized URL' };

  // 4 & 5. Same creator + highly similar title + published within 48h of each other
  const sameCreatorRecent = await prisma.source.findMany({
    where: {
      creatorName: item.creatorName,
      platform: item.platform,
      ...(item.publishedAt
        ? {
            publishedAt: {
              gte: new Date(new Date(item.publishedAt).getTime() - 1000 * 60 * 60 * 48),
              lte: new Date(new Date(item.publishedAt).getTime() + 1000 * 60 * 60 * 48)
            }
          }
        : {})
    },
    take: 25
  });

  for (const candidate of sameCreatorRecent) {
    // 6. Fuzzy title similarity as the final signal
    if (titleSimilarity(candidate.title, item.title) >= 0.6) {
      return { isDuplicate: true, existingSourceId: candidate.id, reason: 'same creator + highly similar title' };
    }
  }

  return { isDuplicate: false };
}

/** If newer metadata is available for an existing item (higher view count,
 * a description that was previously missing, etc.), update rather than
 * insert a duplicate row. */
export async function refreshExistingSource(sourceId: string, item: RawDiscoveredItem) {
  await prisma.source.update({
    where: { id: sourceId },
    data: {
      viewCount: item.viewCount ?? undefined,
      likeCount: item.likeCount ?? undefined,
      commentCount: item.commentCount ?? undefined,
      description: item.description ?? undefined,
      thumbnailUrl: item.thumbnailUrl ?? undefined
    }
  });
}
