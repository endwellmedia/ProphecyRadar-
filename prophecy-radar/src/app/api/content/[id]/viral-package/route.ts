import { NextResponse } from 'next/server';
import { getContentById } from '@/lib/data-source';
import { env } from '@/lib/env';
import { generateViralPackage } from '@/services/thumbnail-generator';
import { demoViralPackage } from '@/lib/ai/demo-fallback';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const content = await getContentById(params.id);
  if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const result = env.aiApiKey ? await generateViralPackage(content) : demoViralPackage(content);
    return NextResponse.json({ ...result, demo: !env.aiApiKey });
  } catch (err: any) {
    console.error('Viral package generation failed', err);
    return NextResponse.json({ error: 'Generation failed. Falling back to templates.', ...demoViralPackage(content), demo: true });
  }
}
