import { NextResponse } from 'next/server';
import { getContentById } from '@/lib/data-source';
import { env } from '@/lib/env';
import { generateThumbnailCaptions } from '@/services/thumbnail-generator';
import { demoThumbnailCaptions } from '@/lib/ai/demo-fallback';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const content = await getContentById(params.id);
  if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const result = env.aiApiKey ? await generateThumbnailCaptions(content) : demoThumbnailCaptions(content);
    return NextResponse.json({ ...result, demo: !env.aiApiKey });
  } catch (err: any) {
    console.error('Thumbnail caption generation failed', err);
    return NextResponse.json({ error: 'Generation failed. Falling back to templates.', ...demoThumbnailCaptions(content), demo: true });
  }
}
