import { callAIForJSON } from '@/lib/ai/client';
import { BASE_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { ContentCardData, ThumbnailIdeas, ViralPackage } from '@/lib/types';

export async function generateThumbnailCaptions(content: ContentCardData): Promise<ThumbnailIdeas> {
  const prompt = `
Generate YouTube thumbnail captions (the short bold text overlaid on the
thumbnail image, NOT the video title) for a reaction video about:

Prophecy topic: ${content.prophecyTopic ?? 'unspecified'}
People mentioned: ${content.peopleMentioned.join(', ') || 'none specified'}
Key claim (attributed, not fact): ${content.keyClaim ?? 'not specified'}

Generate exactly 10 caption ideas, each 2-7 words, bold and emotional,
easy to read at thumbnail size, and DIFFERENT from a title (don't just
shorten a headline — captions should punch, like "NIGERIA, BE READY!" or
"THEY SAW THIS COMING!"). Ground them only in the fields above.

Return ONLY this JSON shape:
{ "bestCaption": "<strongest one>", "captions": ["<10 captions, bestCaption included>"] }
`.trim();

  return callAIForJSON<ThumbnailIdeas>(prompt, { system: BASE_SYSTEM_PROMPT, maxTokens: 500 });
}

export async function generateViralPackage(content: ContentCardData): Promise<ViralPackage> {
  const prompt = `
Build a complete "viral package" for a YouTube reaction video about:

Prophecy topic: ${content.prophecyTopic ?? 'unspecified'}
People mentioned: ${content.peopleMentioned.join(', ') || 'none specified'}
Timeframe: ${content.timeframe ?? 'unspecified'}
Key claim (attributed, not fact): ${content.keyClaim ?? 'not specified'}

Return ONLY this JSON shape:
{
  "bestTitle": "<best YouTube title>",
  "bestCaption": "<best thumbnail caption, 2-7 words>",
  "altTitles": ["<3 alternative titles>"],
  "altCaptions": ["<3 alternative captions>"],
  "thumbnailConcept": "<1-2 sentences describing a thumbnail layout: who to feature, background mood, what text placement>",
  "peopleToFeature": ["<name(s) that should visually appear>"],
  "emotion": "<the single dominant emotion the thumbnail/title should communicate, e.g. 'urgency', 'shock', 'concern'>",
  "visualHierarchy": "<1 sentence on what the viewer's eye should land on first, second, third>"
}

Ground everything only in the fields provided — never invent a claim, name, or outcome not given above.
`.trim();

  return callAIForJSON<ViralPackage>(prompt, { system: BASE_SYSTEM_PROMPT, maxTokens: 700 });
}
