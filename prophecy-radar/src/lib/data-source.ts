import { isDemoMode } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { ContentCardData, ContentStatus } from '@/lib/types';
import { DEFAULT_CATEGORIES } from '@/lib/default-categories';
import { MOCK_CONTENT } from '@/lib/mock-data';
import { computeIntelligenceScore } from '@/services/scoring';

// In-memory mutable copy so status/notes changes persist for the session
// in demo mode, without needing a database. This resets on server restart.
const demoStore: ContentCardData[] = MOCK_CONTENT.map((c) => ({ ...c }));

export interface ContentFilters {
  categoryId?: string;
  status?: ContentStatus;
  platform?: string;
  query?: string;
  sinceDays?: number;
}

export async function getCategories() {
  if (isDemoMode) {
    return DEFAULT_CATEGORIES.map((c) => ({ ...c, active: true, description: null }));
  }
  return prisma.category.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
}

export async function getContentFeed(filters: ContentFilters = {}): Promise<ContentCardData[]> {
  if (isDemoMode) {
    let items = [...demoStore];
    if (filters.categoryId) items = items.filter((i) => i.categoryId === filters.categoryId);
    if (filters.status) items = items.filter((i) => i.status === filters.status);
    if (filters.platform) items = items.filter((i) => i.platform === filters.platform);
    if (filters.sinceDays) {
      const cutoff = Date.now() - filters.sinceDays * 24 * 3600 * 1000;
      items = items.filter((i) => !i.publishedAt || new Date(i.publishedAt).getTime() >= cutoff);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter((i) =>
        [i.title, i.creatorName, i.prophecyTopic ?? '', ...(i.peopleMentioned ?? []), ...(i.keywords ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }
    return items.sort(
      (a, b) =>
        computeIntelligenceScore({ relevanceScore: b.relevanceScore, publishedAt: b.publishedAt, viewCount: b.viewCount }) -
        computeIntelligenceScore({ relevanceScore: a.relevanceScore, publishedAt: a.publishedAt, viewCount: a.viewCount })
    );
  }

  const dbItems = await prisma.contentItem.findMany({
    where: {
      categoryId: filters.categoryId,
      status: filters.status,
      source: {
        platform: filters.platform as any,
        publishedAt: filters.sinceDays ? { gte: new Date(Date.now() - filters.sinceDays * 24 * 3600 * 1000) } : undefined
      }
    },
    include: { source: true, category: true },
    orderBy: { createdAt: 'desc' }
  });

  const mapped = dbItems.map(mapDbItemToCard);
  const filtered = filters.query
    ? mapped.filter((i) =>
        [i.title, i.creatorName, i.prophecyTopic ?? '', ...(i.peopleMentioned ?? []), ...(i.keywords ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(filters.query!.toLowerCase())
      )
    : mapped;

  return filtered.sort(
    (a, b) =>
      computeIntelligenceScore({ relevanceScore: b.relevanceScore, publishedAt: b.publishedAt, viewCount: b.viewCount }) -
      computeIntelligenceScore({ relevanceScore: a.relevanceScore, publishedAt: a.publishedAt, viewCount: a.viewCount })
  );
}

export async function getContentById(id: string): Promise<ContentCardData | null> {
  if (isDemoMode) return demoStore.find((i) => i.id === id) ?? null;
  const item = await prisma.contentItem.findUnique({ where: { id }, include: { source: true, category: true } });
  return item ? mapDbItemToCard(item) : null;
}

export async function updateContentStatus(id: string, status: ContentStatus, notes?: string) {
  if (isDemoMode) {
    const item = demoStore.find((i) => i.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
    }
    return item ?? null;
  }

  await prisma.contentItem.update({ where: { id }, data: { status } });
  // In a full multi-user build this would upsert UserContentStatus per-user;
  // MVP assumes a single primary user (the YouTuber running the tool).
  return getContentById(id);
}

export async function updateContentNotes(id: string, notes: string) {
  if (isDemoMode) {
    const item = demoStore.find((i) => i.id === id);
    if (item) item.notes = notes;
    return item ?? null;
  }
  return getContentById(id);
}

export async function getTodayStats() {
  const items = await getContentFeed({ sinceDays: 1 });
  const all = await getContentFeed();
  return {
    freshToday: items.filter((i) => i.status === 'NEW').length,
    alreadyReviewed: all.filter((i) => i.status === 'REVIEWED').length,
    completed: all.filter((i) => i.status === 'DONE').length,
    remaining: all.filter((i) => i.status === 'NEW' || i.status === 'REVIEWED').length
  };
}

function mapDbItemToCard(item: any): ContentCardData {
  return {
    id: item.id,
    platform: item.source.platform,
    title: item.source.title,
    creatorName: item.source.creatorName,
    url: item.source.url,
    thumbnailUrl: item.source.thumbnailUrl ?? undefined,
    publishedAt: item.source.publishedAt ? item.source.publishedAt.toISOString() : null,
    viewCount: item.source.viewCount ?? null,
    categoryId: item.categoryId,
    categoryName: item.category.name,
    categoryEmoji: item.category.emoji,
    status: item.status,
    relevanceScore: item.relevanceScore,
    relevanceReason: item.relevanceReason ?? '',
    prophecyTopic: item.prophecyTopic,
    peopleMentioned: item.peopleMentioned,
    locations: item.locations,
    timeframe: item.timeframe,
    prophecyType: item.prophecyType,
    keyClaim: item.keyClaim,
    keywords: item.keywords,
    summary: item.summary ?? '',
    notes: null
  };
}
