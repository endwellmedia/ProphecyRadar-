'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { TodayStats } from '@/components/today-stats';
import { CategoryChips } from '@/components/category-chips';
import { ContentFeed } from '@/components/content-feed';
import { DemoModeBanner } from '@/components/demo-mode-banner';

export default function DashboardPage() {
  useEffect(() => {
    // Kick off a discovery scan whenever the dashboard is opened, per
    // spec section 17 — no manual "search" step required from the user.
    fetch('/api/discover', { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="PROPHECY RADAR" subtitle="Your daily source for fresh Nigeria prophecy content." />
      <DemoModeBanner />
      <TodayStats />
      <CategoryChips />
      <div className="px-4 md:px-6 mb-2">
        <h2 className="text-sm font-medium text-ink-muted uppercase tracking-wide">Today's best discoveries</h2>
      </div>
      <ContentFeed emptyTitle="No discoveries yet" emptyBody="Run a scan or check back after your next scheduled discovery pass." />
    </div>
  );
}
