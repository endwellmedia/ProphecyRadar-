import { env } from '@/lib/env';
import { RawDiscoveredItem } from '@/lib/types';
import { Connector, DiscoveryQuery } from './types';

/**
 * The Facebook Graph API does not offer open keyword search across public
 * posts for third-party apps (this was deprecated for privacy reasons).
 * What IS available and approved: reading posts from Pages you (or the
 * user) manage or have been granted access to, via /{page-id}/posts.
 *
 * Realistic MVP approach: pair this connector with "Followed Prophets" —
 * for each followed prophet's Facebook Page URL, resolve the Page ID and
 * pull their recent posts. This respects Facebook's platform terms and
 * still surfaces new content automatically. Open-web discovery for FB
 * should rely on the creator manually adding their Page under Followed
 * Prophets rather than a keyword crawl.
 */
const GRAPH_BASE = 'https://graph.facebook.com/v19.0';

export const facebookConnector: Connector = {
  platform: 'FACEBOOK',

  async discover({ keywords }: DiscoveryQuery): Promise<RawDiscoveredItem[]> {
    // Keyword-only discovery isn't supported by the Graph API — this
    // connector is invoked per-Page from services/discovery when a
    // followed prophet has a facebookPageUrl set. See discoverForPage below.
    return [];
  }
};

/** Called by the discovery service once per followed Page ID. */
export async function discoverForPage(pageId: string, sinceISO?: string): Promise<RawDiscoveredItem[]> {
  if (!env.facebookApiKey) return [];

  const params = new URLSearchParams({
    access_token: env.facebookApiKey,
    fields: 'id,message,permalink_url,created_time,full_picture,from,shares,reactions.summary(true),comments.summary(true)'
  });
  if (sinceISO) params.set('since', String(Math.floor(new Date(sinceISO).getTime() / 1000)));

  const res = await fetch(`${GRAPH_BASE}/${pageId}/posts?${params.toString()}`);
  if (!res.ok) {
    console.error('Facebook page posts fetch failed', pageId, await res.text());
    return [];
  }

  const json = await res.json();
  return (json.data ?? []).map((post: any) => ({
    platform: 'FACEBOOK' as const,
    platformContentId: post.id,
    url: post.permalink_url,
    creatorName: post.from?.name ?? 'Unknown Page',
    creatorId: post.from?.id,
    title: (post.message ?? '').slice(0, 120) || '(no caption)',
    description: post.message,
    thumbnailUrl: post.full_picture,
    publishedAt: post.created_time,
    likeCount: post.reactions?.summary?.total_count,
    commentCount: post.comments?.summary?.total_count,
    raw: post
  }));
}
