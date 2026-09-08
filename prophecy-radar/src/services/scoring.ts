/**
 * The "intelligent score" used to sort the Today page and category
 * views. Distinct from relevanceScore (which is purely an AI judgment
 * of topical relevance) — this blends in recency and engagement so a
 * highly relevant but week-old video doesn't permanently outrank fresh
 * discoveries.
 */
export function computeIntelligenceScore(params: {
  relevanceScore: number; // 0-100
  publishedAt: string | null;
  viewCount: number | null;
}): number {
  const { relevanceScore, publishedAt, viewCount } = params;

  const ageHours = publishedAt ? (Date.now() - new Date(publishedAt).getTime()) / 36e5 : 24 * 30;
  // Recency: full marks under 24h, decaying to ~0 by 14 days
  const recencyScore = Math.max(0, 1 - ageHours / (24 * 14)) * 100;

  // Engagement: log-scaled so viral outliers don't totally dominate
  const engagementScore = viewCount ? Math.min(100, Math.log10(viewCount + 1) * 14) : 20;

  return Math.round(relevanceScore * 0.55 + recencyScore * 0.3 + engagementScore * 0.15);
}
