import { callAIForJSON } from '@/lib/ai/client';
import { BASE_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { ContentAnalysis, RawDiscoveredItem } from '@/lib/types';

interface AnalyzeInput {
  item: RawDiscoveredItem;
  categoryName: string;
  categoryKeywords: string[];
}

/**
 * Runs a single AI call that both scores relevance (0-100) and extracts
 * the structured prophecy fields described in section 9 of the spec.
 * Doing both in one call keeps cost down and guarantees the reason and
 * the extracted fields never contradict each other.
 */
export async function analyzeContent({ item, categoryName, categoryKeywords }: AnalyzeInput): Promise<ContentAnalysis> {
  const sourceText = [
    `Title: ${item.title}`,
    item.description ? `Description: ${item.description}` : null,
    `Creator: ${item.creatorName}`,
    `Platform: ${item.platform}`
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `
Category this item was discovered under: "${categoryName}" (keywords: ${categoryKeywords.join(', ')})

SOURCE CONTENT (title/description/metadata only — no transcript was available for this item unless included above):
${sourceText}

Task: Determine whether this is genuinely relevant Nigeria-prophecy content
(not just a video that happens to mention "Nigeria" in passing), then
extract structured fields.

Return ONLY this JSON shape:
{
  "relevanceScore": <0-100 integer>,
  "relevanceReason": "<one sentence, neutral, explaining why this score, in the voice of 'this video discusses/predicts...'>",
  "prophecyTopic": "<short topic string or null>",
  "peopleMentioned": ["<name>", ...],
  "locations": ["<place>", ...],
  "timeframe": "<e.g. '2027' or null>",
  "prophecyType": "<e.g. 'Election prediction', 'Death prophecy', 'Economic warning', or null>",
  "keyClaim": "<one neutral sentence describing the speaker's claim, attributed, or null if not a real prophecy/claim>",
  "keywords": ["<keyword>", ...],
  "summary": "<1-2 neutral sentences summarizing what the video discusses>"
}

Scoring guidance: a video that only briefly namedrops Nigeria without an
actual prophecy/prediction/warning should score below 40. A video clearly
centered on a Nigerian prophecy relevant to the given category should score
80+. Base the score only on the text provided — do not assume relevance
from the category name alone.
`.trim();

  return callAIForJSON<ContentAnalysis>(prompt, { system: BASE_SYSTEM_PROMPT, maxTokens: 800 });
}
