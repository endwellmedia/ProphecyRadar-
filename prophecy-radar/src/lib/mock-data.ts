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
    platform: 'YOUTUBE',
    title: 'Prophecy clip: "Nigeria will not remain the same after this year"',
    creatorName: 'Demo Watchman Channel',
    url: 'https://www.youtube.com/watch?v=demo3',
    thumbnailUrl: undefined,
    publishedAt: daysAgoISO(0, 14),
    viewCount: 302000,
    categoryId: 'cat-general',
    categoryName: cat('cat-general').name,
    categoryEmoji: cat('cat-general').emoji,
    status: 'NEW',
