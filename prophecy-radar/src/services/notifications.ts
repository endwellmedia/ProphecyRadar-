import { prisma } from '@/lib/prisma';
import { isDemoMode } from '@/lib/env';

export interface MorningBriefing {
  newCount: number;
  topDiscoveries: { id: string; title: string; categoryName: string }[];
}

/**
 * Builds the "Good morning" briefing data described in spec section 16.
 * Returning structured data here (rather than sending anything) keeps
 * this service provider-agnostic — call sites (a cron job, an API route)
 * decide whether to render it in-app, email it via Resend/SendGrid, or
 * push it via a mobile push provider.
 */
export async function buildMorningBriefing(): Promise<MorningBriefing> {
  if (isDemoMode) {
    return { newCount: 0, topDiscoveries: [] };
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 16); // overnight window
  const items = await prisma.contentItem.findMany({
    where: { status: 'NEW', createdAt: { gte: since } },
    include: { category: true },
    orderBy: { relevanceScore: 'desc' },
    take: 6
  });

  return {
    newCount: items.length,
    topDiscoveries: items.map((i) => ({ id: i.id, title: i.summary ?? i.prophecyTopic ?? 'New discovery', categoryName: i.category.name }))
  };
}

/** Builds the briefing and sends it by email if both the daily-briefing
 * and email toggles are on in Settings. Safe to call after every
 * discovery run — it no-ops quietly if notifications aren't configured. */
export async function runMorningBriefingIfDue() {
  if (isDemoMode) return;

  const settings = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  if (!settings?.dailyBriefingEnabled || !settings?.emailEnabled) return;

  const briefing = await buildMorningBriefing();
  if (briefing.newCount > 0) await sendMorningEmail(briefing);
}

/**
 * Sends the morning briefing via Resend (https://resend.com) when
 * RESEND_API_KEY and BRIEFING_EMAIL_TO are set. Falls back to a console
 * log so the discovery/cron flow never throws just because email isn't
 * configured yet.
 */
export async function sendMorningEmail(briefing: MorningBriefing) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEFING_EMAIL_TO;

  if (!apiKey || !to) {
    console.log('[notifications] Email not configured (RESEND_API_KEY / BRIEFING_EMAIL_TO missing) — skipping send.');
    return { sent: false };
  }

  if (briefing.newCount === 0) {
    return { sent: false, reason: 'nothing new to report' };
  }

  const listHtml = briefing.topDiscoveries
    .map((d, i) => `<li>${i + 1}. <strong>${escapeHtml(d.categoryName)}</strong> — ${escapeHtml(d.title)}</li>`)
    .join('');

  const html = `
    <div style="font-family:sans-serif;background:#0E0F11;color:#EDEDEC;padding:24px;">
      <h2 style="margin:0 0 4px;">Good morning 👋</h2>
      <p style="color:#8B8D93;margin:0 0 16px;">Your Prophecy Radar</p>
      <p>${briefing.newCount} new relevant videos were discovered overnight.</p>
      <p style="margin:16px 0 8px;font-weight:bold;">Top discoveries:</p>
      <ol style="padding-left:18px;">${listHtml}</ol>
      <p style="margin-top:20px;">
        <a href="${process.env.APP_URL ?? 'http://localhost:3000'}" style="color:#D4A73D;">View today's discoveries →</a>
      </p>
    </div>
  `.trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.BRIEFING_EMAIL_FROM ?? 'Prophecy Radar <[email protected]>',
      to,
      subject: `${briefing.newCount} new prophecy videos found overnight`,
      html
    })
  });

  if (!res.ok) {
    console.error('[notifications] Resend send failed', await res.text());
    return { sent: false };
  }

  return { sent: true };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
