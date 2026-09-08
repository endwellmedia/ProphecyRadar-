import { ContentCardData, ThumbnailIdeas, TitleIdeas, ViralPackage } from '@/lib/types';

/** Used only when AI_API_KEY is not configured, so the buttons in the UI
 * remain demonstrable. Clearly templated, not claimed as AI-generated. */
export function demoTitles(content: ContentCardData): TitleIdeas {
  const topic = content.prophecyTopic ?? 'Nigeria';
  const person = content.peopleMentioned[0];
  const titles = [
    `PROPHECY ALERT: What Was Just Said About ${topic}`,
    person ? `${person.toUpperCase()}: This New Prophecy Is Getting Attention` : `NIGERIA: This New Prophecy Is Getting Attention`,
    `WARNING FOR NIGERIA: Prophet Speaks on ${topic}`,
    `THIS IS SERIOUS: New Prophecy About ${topic}`,
    `${content.timeframe ?? 'NIGERIA'}: The Prophecy Everyone's Reacting To`,
    `JUST IN: Prophet's Claim About ${topic} Explained`,
    `NIGERIANS MUST WATCH: New Word On ${topic}`,
    `REVELATION: What This Prophet Really Said`,
    `SHOCKING CLAIM About ${topic} — My Honest Reaction`,
    `Breaking Down the New ${topic} Prophecy`
  ];
  return { bestTitle: titles[0], titles };
}

export function demoThumbnailCaptions(content: ContentCardData): ThumbnailIdeas {
  const captions = [
    'NIGERIA, BE READY!',
    'SHOCKING PROPHECY!',
    'THIS IS SERIOUS!',
    'THEY SAW THIS COMING!',
    'WATCH BEFORE ITS GONE!',
    'IS THIS REAL?',
    'PROPHET SPEAKS!',
    'MAJOR WARNING!',
    'NIGERIA ON ALERT!',
    'WORD FOR THE NATION!'
  ];
  return { bestCaption: captions[0], captions };
}

export function demoViralPackage(content: ContentCardData): ViralPackage {
  const titles = demoTitles(content);
  const captions = demoThumbnailCaptions(content);
  return {
    bestTitle: titles.bestTitle,
    bestCaption: captions.bestCaption,
    altTitles: titles.titles.slice(1, 4),
    altCaptions: captions.captions.slice(1, 4),
    thumbnailConcept: `Feature ${content.peopleMentioned[0] ?? 'the prophet'} prominently against a dramatic Nigeria-themed background, with the caption placed top or bottom in bold white/red text.`,
    peopleToFeature: content.peopleMentioned.length > 0 ? content.peopleMentioned : ['The speaker'],
    emotion: 'urgency',
    visualHierarchy: "Eye lands on the featured person's face first, then the bold caption text, then any supporting graphic."
  };
}
