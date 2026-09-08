import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/env';
import { prisma } from '@/lib/prisma';

const DEMO_SETTINGS = {
  scanFrequencyMinutes: 360,
  minimumRelevanceScore: 50,
  recommendationsPerCategory: 6,
  dailyBriefingEnabled: true,
  emailEnabled: false,
  pushEnabled: false
};

export async function GET() {
  if (isDemoMode) return NextResponse.json({ settings: DEMO_SETTINGS });

  const settings = await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton' },
    update: {}
  });
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isDemoMode) {
    // Nothing to persist without a database — echo back what was submitted
    // so the UI can still confirm the change was "saved" for this session.
    return NextResponse.json({ settings: { ...DEMO_SETTINGS, ...body }, note: 'Demo mode: settings are not persisted without a database.' });
  }

  const settings = await prisma.appSetting.update({
    where: { id: 'singleton' },
    data: {
      scanFrequencyMinutes: body.scanFrequencyMinutes,
      minimumRelevanceScore: body.minimumRelevanceScore,
      recommendationsPerCategory: body.recommendationsPerCategory,
      dailyBriefingEnabled: body.dailyBriefingEnabled,
      emailEnabled: body.emailEnabled,
      pushEnabled: body.pushEnabled
    }
  });
  return NextResponse.json({ settings });
}
