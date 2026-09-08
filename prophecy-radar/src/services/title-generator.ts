import { callAIForJSON } from '@/lib/ai/client';
import { BASE_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { ContentCardData, TitleIdeas } from '@/lib/types';

export async function generateTitles(content: ContentCardData): Promise<TitleIdeas> {
  const prompt = `
Generate YouTube reaction-video titles for the creator's OWN commentary
video ABOUT the following discovered prophecy content — not a title for
the original video itself.

Source video title: "${content.title}"
Creator being reacted to: ${content.creatorName}
Prophecy topic: ${content.prophecyTopic ?? 'unspecified'}
People mentioned: ${content.peopleMentioned.join(', ') || 'none specified'}
Timeframe: ${content.timeframe ?? 'unspecified'}
Key claim (attributed to the speaker, not fact): ${content.keyClaim ?? 'not specified'}

Generate exactly 10 title ideas for the reaction video. They must be:
- Curiosity-driven, emotional, short enough for YouTube, aimed at a Nigerian audience
- Grounded ONLY in the key claim / topic / people above — never invent a
  claim, statistic, or outcome that isn't in the source fields
- Free to use high-curiosity words like WARNING, SHOCKING, PROPHECY,
  REVELATION, JUST IN, but never presenting the prophecy as a confirmed fact

Return ONLY this JSON shape:
{ "bestTitle": "<the strongest one>", "titles": ["<10 titles, bestTitle included>"] }
`.trim();

  return callAIForJSON<TitleIdeas>(prompt, { system: BASE_SYSTEM_PROMPT, maxTokens: 700 });
}
