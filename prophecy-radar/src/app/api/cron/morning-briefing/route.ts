import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/env';
import { runDiscovery } from '@/services/discovery';
import { runMorningBriefingIfDue } from '@/services/notifications';

/**
 * Meant to be hit once a day (e.g. 6am) by Vercel Cron — see vercel.json.
 * Runs a discovery pass and, only if Settings has both "Daily morning
 * briefing" and "Email delivery" turned on, emails a summary via Resend.
 *
 * Protected by CRON_SECRET so this can't be triggered by anyone who finds
 * the URL — Vercel Cron sends this automatically as a bearer token.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (isDemoMode) {
    return NextResponse.json({ ok: true, note: 'Demo mode — nothing to do.' });
  }

  const summary = await runDiscovery();
  await runMorningBriefingIfDue();

  return NextResponse.json({ ok: true, ...summary });
}
