import { ContentCardData } from '@/lib/types';
import { DEFAULT_CATEGORIES } from './default-categories';

/**
 * Clearly-fictional demo content so the interface is fully explorable
 * before real API keys/database are configured. Titles, creators, and
 * claims below are illustrative placeholders, not real broadcasts.
 * Swap DATABASE_URL + platform keys in .env to replace this with live data.
 */
function cat(id: string) {
  const found = DEFAULT_CATEGORIES.find((c) => c.id === id)!;
  return { id: found.id, name: found.name, emoji: found.emoji };
}

let idCounter = 1;
function nextId() {
  return `demo-${idCounter++}`;
}

function daysAgoISO(days: number, hours = 0) {
  return new Date(Date.now() - (days * 24 + hours) * 3600 * 1000).toISOString();
}

export const MOCK_CONTENT: ContentCardData[] = [
  {
    id: nextId(),
    platform: 'YOUTUBE',
    title: "Prophet Speaks on What He Says Will Happen Before Nigeria's 2027 Election",
    creatorName: 'Demo Prophetic Voice TV',
    url: 'https://www.youtube.com/watch?v=demo1',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(0, 6),
    viewCount: 118500,
    ...cat('cat-2027-election'),
    categoryId: 'cat-2027-election',
    categoryName: cat('cat-2027-election').name,
    categoryEmoji: cat('cat-2027-election').emoji,
    status: 'NEW',
    relevanceScore: 94,
    relevanceReason: "This video was recommended because it discusses Nigeria's 2027 presidential election and includes a prediction the speaker attributes to a prophetic vision.",
    prophecyTopic: "2027 Nigeria Presidential Election",
    peopleMentioned: ['Peter Obi', 'Bola Tinubu'],
    locations: ['Nigeria'],
    timeframe: '2027',
    prophecyType: 'Election prediction',
    keyClaim: 'The speaker predicts a major political shift during the 2027 election cycle, without naming a specific winner.',
    keywords: ['Nigeria', '2027 election', 'Peter Obi', 'prophecy', 'president'],
    summary: 'The video discusses the speaker\'s claimed prophetic insight into the 2027 Nigerian presidential race, mentioning Peter Obi and Bola Tinubu by name.',
    notes: null
  },
  {
    id: nextId(),
    platform: 'YOUTUBE',
    title: 'Man of God Warns of Coming Economic Shift in Nigeria',
    creatorName: 'Demo Kingdom Watch',
    url: 'https://www.youtube.com/watch?v=demo2',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(1, 2),
    viewCount: 54200,
    categoryId: 'cat-economic',
    categoryName: cat('cat-economic').name,
    categoryEmoji: cat('cat-economic').emoji,
    status: 'NEW',
    relevanceScore: 87,
    relevanceReason: 'This video was recommended because it discusses an economic warning the speaker frames as a prophetic revelation for Nigeria.',
    prophecyTopic: 'Economic conditions in Nigeria',
    peopleMentioned: [],
    locations: ['Nigeria'],
    timeframe: 'Unspecified',
    prophecyType: 'Economic warning',
    keyClaim: 'The speaker claims to have received a warning about a coming shift in the Nigerian economy and urges viewers to prepare.',
    keywords: ['Nigeria', 'economy', 'prophecy', 'warning'],
    summary: "The video discusses the speaker's claimed revelation concerning Nigeria's economic outlook, without citing a specific date.",
    notes: null
  },
  {
    id: nextId(),
    platform: 'TIKTOK',
    title: 'Prophecy clip: "Nigeria will not remain the same after this year"',
    creatorName: '@demo.watchman',
    url: 'https://www.tiktok.com/@demo.watchman/video/demo3',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(0, 14),
    viewCount: 302000,
    categoryId: 'cat-general',
    categoryName: cat('cat-general').name,
    categoryEmoji: cat('cat-general').emoji,
    status: 'NEW',
    relevanceScore: 76,
    relevanceReason: 'This clip was recommended because it presents a general prediction about change in Nigeria framed as a prophetic word.',
    prophecyTopic: 'General national outlook',
    peopleMentioned: [],
    locations: ['Nigeria'],
    timeframe: 'This year',
    prophecyType: 'General prediction',
    keyClaim: 'The speaker claims Nigeria is entering a period of significant change, without specifying details.',
    keywords: ['Nigeria', 'prophecy', 'change'],
    summary: 'A short clip in which the speaker predicts broad change for Nigeria without elaborating on specifics.',
    notes: null
  },
  {
    id: nextId(),
    platform: 'YOUTUBE',
    title: 'Prophetic Alert: Prophet Speaks on Security Situation Across Nigerian States',
    creatorName: 'Demo Watchman Ministries',
    url: 'https://www.youtube.com/watch?v=demo4',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(2, 0),
    viewCount: 41230,
    categoryId: 'cat-crisis',
    categoryName: cat('cat-crisis').name,
    categoryEmoji: cat('cat-crisis').emoji,
    status: 'REVIEWED',
    relevanceScore: 81,
    relevanceReason: 'This video was recommended because it discusses insecurity across Nigerian states and frames it as part of a prophetic warning.',
    prophecyTopic: 'Insecurity across Nigerian states',
    peopleMentioned: [],
    locations: ['Nigeria'],
    timeframe: 'Unspecified',
    prophecyType: 'Warning',
    keyClaim: 'The speaker claims to have foreseen a rise in insecurity in specific Nigerian regions and calls for prayer.',
    keywords: ['Nigeria', 'insecurity', 'crisis', 'prophecy'],
    summary: 'The video discusses a claimed prophetic warning about insecurity in named Nigerian states, urging viewers to pray.',
    notes: 'Compare with last month\'s similar warning from the same channel.'
  },
  {
    id: nextId(),
    platform: 'YOUTUBE',
    title: 'Prophet Reacts to Political Tension, Says Change Is Coming to Government House',
    creatorName: 'Demo National Prophetic Network',
    url: 'https://www.youtube.com/watch?v=demo5',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(3, 0),
    viewCount: 28900,
    categoryId: 'cat-political',
    categoryName: cat('cat-political').name,
    categoryEmoji: cat('cat-political').emoji,
    status: 'DONE',
    relevanceScore: 72,
    relevanceReason: 'This video was recommended because it discusses political tension and includes a claimed prediction of change in government.',
    prophecyTopic: 'Government and political tension',
    peopleMentioned: ['Bola Tinubu'],
    locations: ['Nigeria'],
    timeframe: 'Unspecified',
    prophecyType: 'Political prediction',
    keyClaim: 'The speaker predicts unspecified change within the government without naming a mechanism or date.',
    keywords: ['Nigeria', 'politics', 'government', 'prophecy'],
    summary: 'The video discusses the speaker\'s claimed prediction of political change, referencing the current administration.',
    notes: 'Already reacted — used for the Sept 3 video.'
  },
  {
    id: nextId(),
    platform: 'FACEBOOK',
    title: "Post: 'A Word for Biafra Land This Season'",
    creatorName: 'Demo Eastern Prophetic Voice',
    url: 'https://www.facebook.com/demoeasternprophetic/posts/demo6',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(1, 10),
    viewCount: 9600,
    categoryId: 'cat-biafra',
    categoryName: cat('cat-biafra').name,
    categoryEmoji: cat('cat-biafra').emoji,
    status: 'NEW',
    relevanceScore: 68,
    relevanceReason: 'This post was recommended because it addresses Biafra directly and frames its message as a prophetic word for the region.',
    prophecyTopic: 'Biafra',
    peopleMentioned: [],
    locations: ['Biafra', 'South East Nigeria'],
    timeframe: 'This season',
    prophecyType: 'Regional word',
    keyClaim: 'The post claims to deliver a prophetic word specifically addressed to people identifying with Biafra.',
    keywords: ['Biafra', 'prophecy', 'word'],
    summary: 'A Facebook post presenting a claimed prophetic message directed at the Biafra region.',
    notes: null
  }
];

/** A namedmentions-only, low-relevance example to demonstrate that the
 * system correctly excludes weak matches rather than padding results. */
export const MOCK_LOW_RELEVANCE_EXAMPLE: ContentCardData = {
  id: 'demo-low-1',
  platform: 'YOUTUBE',
  title: 'Top 10 Countries to Visit in Africa in 2026',
  creatorName: 'Demo Travel Channel',
  url: 'https://www.youtube.com/watch?v=demolow1',
  thumbnailUrl: undefined,
  publishedAt: daysAgoISO(1, 0),
  viewCount: 500000,
  categoryId: 'cat-general',
  categoryName: cat('cat-general').name,
  categoryEmoji: cat('cat-general').emoji,
  status: 'IGNORED',
  relevanceScore: 12,
  relevanceReason: 'Nigeria is mentioned only briefly in a travel list; the video contains no prophecy, prediction, or warning.',
  prophecyTopic: null,
  peopleMentioned: [],
  locations: ['Nigeria'],
  timeframe: null,
  prophecyType: null,
  keyClaim: null,
  keywords: ['Nigeria', 'travel'],
  summary: 'A general travel video that briefly lists Nigeria among other countries; not prophecy-related.',
  notes: null
};
