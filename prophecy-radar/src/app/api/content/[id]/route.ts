import { NextRequest, NextResponse } from 'next/server';
import { getContentById } from '@/lib/data-source';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await getContentById(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item });
}
