import { NextResponse } from 'next/server';
import { buildMorningBriefing } from '@/services/notifications';

export async function GET() {
  const briefing = await buildMorningBriefing();
  return NextResponse.json(briefing);
}
