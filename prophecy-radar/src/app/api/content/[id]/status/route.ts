import { NextRequest, NextResponse } from 'next/server';
import { updateContentStatus } from '@/lib/data-source';
import { ContentStatus } from '@/lib/types';

const VALID: ContentStatus[] = ['NEW', 'REVIEWED', 'DONE', 'IGNORED'];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const status = body.status as ContentStatus;

  if (!VALID.includes(status)) {
    return NextResponse.json({ error: `status must be one of ${VALID.join(', ')}` }, { status: 400 });
  }

  const updated = await updateContentStatus(params.id, status);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Per spec section 6: this NEVER deletes the row — it only flips status,
  // so it can never be recommended as "new" again but stays in history.
  return NextResponse.json({ item: updated });
}
