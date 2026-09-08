import { NextResponse } from 'next/server';
import { getContentById } from '@/lib/data-source';
import { env } from '@/lib/env';
import { generateTitles } from '@/services/title-generator';
import { demoTitles } from '@/lib/ai/demo-fallback';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const content = await getContentById(params.id);
  if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const result = env.aiApiKey ? await generateTitles(content) : demoTitles(content);
    return NextResponse.json({ ...result, demo: !env.aiApiKey });
  } catch (err: any) {
    console.error('Title generation failed', err);
    return NextResponse.json({ error: 'Title generation failed. Falling back to templates.', ...demoTitles(content), demo: true });
  }
}
