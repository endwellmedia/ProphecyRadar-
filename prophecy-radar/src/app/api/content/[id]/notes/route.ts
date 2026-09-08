import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { updateContentNotes } from '@/lib/data-source';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { notes } = await req.json();

  if (isDemoMode) {
    const updated = await updateContentNotes(params.id, notes);
    return NextResponse.json({ item: updated });
  }

  // In the full multi-user schema notes live on UserContentStatus.
  // MVP: single-user upsert keyed by contentId.
  const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID ?? 'default-user';
  await prisma.userContentStatus.upsert({
    where: { userId_contentId: { userId: DEFAULT_USER_ID, contentId: params.id } },
    create: { userId: DEFAULT_USER_ID, contentId: params.id, notes },
    update: { notes }
  });

  return NextResponse.json({ ok: true });
}
