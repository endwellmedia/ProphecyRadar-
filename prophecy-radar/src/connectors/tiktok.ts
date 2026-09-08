import { env } from '@/lib/env';
import { RawDiscoveredItem } from '@/lib/types';
import { Connector, DiscoveryQuery } from './types';

/**
 * TikTok access for this use case (searching public content by keyword)
 * requires the TikTok Research API, which is gated to approved academic/
 * research applicants, or the Content Posting/Display APIs which only
 * cover a connected creator's own content, not open keyword search.
 *
 * This connector is written against the Research API's query.videos
 * shape (https://developers.tiktok.com/doc/research-api-specs-query-videos/)
 * so it's ready to activate the moment you have approved credentials —
 * it intentionally does nothing (returns []) until TIKTOK_API_KEY is set,
 * rather than scraping or bypassing any access control.
 */
const RESEARCH_QUERY_ENDPOINT = 'https://open.tiktokapis.com/v2/research/video/query/';

export const tiktokConnector: Connector = {
  platform: 'TIKTOK',

  async discover({ keywords, sinceISO, maxResults = 15 }: DiscoveryQuery): Promise<RawDiscoveredItem[]> {
    if (!env.tiktokApiKey) return [];

    const results: RawDiscoveredItem[] = [];
    const startDate = sinceISO ? sinceISO.slice(0, 10).replace(/-/g, '') : undefined;

    for (const keyword of keywords) {
      const body = {
        query: {
          and: [{ operation: 'IN', field_name: 'keyword', field_values: [keyword] }]
        },
        max_count: Math.min(maxResults, 20),
        ...(startDate ? { start_date: startDate } : {})
      };

      const res = await fetch(`${RESEARCH_QUERY_ENDPOINT}?fields=id,video_description,create_time,username,view_count,like_count,comment_count,share_url`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.tiktokApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        console.error('TikTok research query failed', keyword, await res.text());
        continue;
      }

      const json = await res.json();
      for (const video of json?.data?.videos ?? []) {
        results.push({
          platform: 'TIKTOK',
          platformContentId: String(video.id),
          url: video.share_url,
          creatorName: video.username,
          title: video.video_description ?? '(no caption)',
          publishedAt: video.create_time ? new Date(video.create_time * 1000).toISOString() : undefined,
          viewCount: video.view_count,
          likeCount: video.like_count,
          commentCount: video.comment_count,
          raw: video
        });
      }
    }

    return results;
  }
};
