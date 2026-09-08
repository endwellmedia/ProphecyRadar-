import { env } from '@/lib/env';
import { RawDiscoveredItem } from '@/lib/types';
import { Connector, DiscoveryQuery } from './types';

const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';

/**
 * Uses YouTube Data API v3 (search.list + videos.list) — an official,
 * approved Google API. Requires YOUTUBE_API_KEY in the environment.
 * Docs: https://developers.google.com/youtube/v3/docs/search/list
 */
export const youtubeConnector: Connector = {
  platform: 'YOUTUBE',

  async discover({ keywords, sinceISO, maxResults = 15 }: DiscoveryQuery): Promise<RawDiscoveredItem[]> {
    if (!env.youtubeApiKey) return [];

    const results: RawDiscoveredItem[] = [];

    for (const keyword of keywords) {
      const params = new URLSearchParams({
        key: env.youtubeApiKey,
        part: 'snippet',
        q: keyword,
        type: 'video',
        order: 'date',
        maxResults: String(Math.min(maxResults, 25)),
        relevanceLanguage: 'en',
        regionCode: 'NG'
      });
      if (sinceISO) params.set('publishedAfter', sinceISO);

      const searchRes = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`);
      if (!searchRes.ok) {
        console.error('YouTube search failed', keyword, await searchRes.text());
        continue;
      }
      const searchJson = await searchRes.json();
      const videoIds: string[] = (searchJson.items ?? [])
        .map((item: any) => item.id?.videoId)
        .filter(Boolean);

      if (videoIds.length === 0) continue;

      // Fetch stats (views/likes/comments) in a second call — search.list doesn't include them.
      const statsParams = new URLSearchParams({
        key: env.youtubeApiKey,
        part: 'snippet,statistics',
        id: videoIds.join(',')
      });
      const statsRes = await fetch(`${VIDEOS_ENDPOINT}?${statsParams.toString()}`);
      if (!statsRes.ok) {
        console.error('YouTube videos.list failed', await statsRes.text());
        continue;
      }
      const statsJson = await statsRes.json();

      for (const video of statsJson.items ?? []) {
        results.push({
          platform: 'YOUTUBE',
          platformContentId: video.id,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          creatorName: video.snippet.channelTitle,
          creatorId: video.snippet.channelId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails?.high?.url ?? video.snippet.thumbnails?.default?.url,
          publishedAt: video.snippet.publishedAt,
          viewCount: video.statistics?.viewCount ? Number(video.statistics.viewCount) : undefined,
          likeCount: video.statistics?.likeCount ? Number(video.statistics.likeCount) : undefined,
          commentCount: video.statistics?.commentCount ? Number(video.statistics.commentCount) : undefined,
          raw: video
        });
      }
    }

    return results;
  }
};
