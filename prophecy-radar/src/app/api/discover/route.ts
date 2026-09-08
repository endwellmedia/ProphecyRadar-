import { NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/env';
import { runDiscovery } from '@/services/discovery';

/**
 * Called on dashboard load (client-side, fire-and-forget) and can also be
 * hit by an external cron service (e.g. Vercel Cron, GitHub Actions,
 * or a simple curl in crontab) for the "morning/afternoon/evening scan"
 * described in the spec, since serverless hosting doesn't keep long-running
 * background jobs alive on its own.
 */
export async function POST() {
  if (isDemoMode) {
    return NextResponse.json({
      scanned: 0,
      newItems: 0,
      skipped: 0,
      note: 'Running in demo mode (no DATABASE_URL set) — showing sample data instead of live discovery.'
    });
  }

  const summary = await runDiscovery();
  return NextResponse.json(summary);
}
