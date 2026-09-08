import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/env';
import { prisma } from '@/lib/prisma';

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID ?? 'default-user';

const demoProphets: { id: string; name: string; youtubeChannelUrl?: string; tiktokProfileUrl?: string; facebookPageUrl?: string; keywords: string[] }[] = [
  { id: 'demo-prophet-1', name: 'Demo Prophetic Voice TV', youtubeChannelUrl: 'https://youtube.com/@demoprophetictv', keywords: ['2027', 'election'] }
];

export async function GET() {
  if (isDemoMode) return NextResponse.json({ prophets: demoProphets });
  const prophets = await prisma.followedProphet.findMany({ where: { userId: DEFAULT_USER_ID } });
  return NextResponse.json({ prophets });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isDemoMode) {
    const newProphet = { id: `demo-prophet-${demoProphets.length + 1}`, ...body };
    demoProphets.push(newProphet);
    return NextResponse.json({ prophet: newProphet });
  }

  const prophet = await prisma.followedProphet.create({
    data: {
      userId: DEFAULT_USER_ID,
      name: body.name,
      youtubeChannelUrl: body.youtubeChannelUrl || null,
      tiktokProfileUrl: body.tiktokProfileUrl || null,
      facebookPageUrl: body.facebookPageUrl || null,
      keywords: body.keywords ?? []
    }
  });
  return NextResponse.json({ prophet });
}
