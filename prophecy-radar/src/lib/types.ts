export type Platform = 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK';
export type ContentStatus = 'NEW' | 'REVIEWED' | 'DONE' | 'IGNORED';

/** Raw item returned by a connector before dedup/analysis. */
export interface RawDiscoveredItem {
  platform: Platform;
  platformContentId: string;
  url: string;
  creatorName: string;
  creatorId?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: string; // ISO date
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  raw?: unknown;
}

/** Output of AI analysis for a single item. */
export interface ContentAnalysis {
  relevanceScore: number; // 0-100
  relevanceReason: string;
  prophecyTopic: string | null;
  peopleMentioned: string[];
  locations: string[];
  timeframe: string | null;
  prophecyType: string | null;
  keyClaim: string | null;
  keywords: string[];
  summary: string;
}

/** Fully assembled item as shown in the UI. */
export interface ContentCardData {
  id: string;
  platform: Platform;
  title: string;
  creatorName: string;
  url: string;
  thumbnailUrl?: string;
  publishedAt: string | null;
  viewCount: number | null;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  status: ContentStatus;
  relevanceScore: number;
  relevanceReason: string;
  prophecyTopic: string | null;
  peopleMentioned: string[];
  locations: string[];
  timeframe: string | null;
  prophecyType: string | null;
  keyClaim: string | null;
  keywords: string[];
  summary: string;
  notes?: string | null;
}

export interface TitleIdeas {
  bestTitle: string;
  titles: string[]; // ~10 alternatives, bestTitle included
}

export interface ThumbnailIdeas {
  bestCaption: string;
  captions: string[]; // ~10 alternatives, bestCaption included
}

export interface ViralPackage {
  bestTitle: string;
  bestCaption: string;
  altTitles: string[]; // 3
  altCaptions: string[]; // 3
  thumbnailConcept: string;
  peopleToFeature: string[];
  emotion: string;
  visualHierarchy: string;
}
