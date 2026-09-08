import { RawDiscoveredItem } from '@/lib/types';

export interface DiscoveryQuery {
  keywords: string[]; // category keywords, e.g. ["Nigeria 2027 prophecy", "Tinubu prophecy"]
  sinceISO?: string; // only return content published after this date
  maxResults?: number;
}

export interface Connector {
  platform: 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK';
  /** Returns candidate content for the given keywords. Never throws on
   *  missing credentials — returns an empty array and lets the caller
   *  decide whether to fall back to mock data. */
  discover(query: DiscoveryQuery): Promise<RawDiscoveredItem[]>;
}
