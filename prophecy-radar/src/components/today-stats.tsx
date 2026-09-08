'use client';

import { useEffect, useState } from 'react';

interface Stats {
  freshToday: number;
  alreadyReviewed: number;
  completed: number;
  remaining: number;
}

export function TodayStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/today')
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const entries: { label: string; value: number | string; color: string }[] = [
    { label: 'Fresh today', value: stats?.freshToday ?? '—', color: 'text-signal-gold' },
    { label: 'Reviewed', value: stats?.alreadyReviewed ?? '—', color: 'text-signal-info' },
    { label: 'Completed', value: stats?.completed ?? '—', color: 'text-signal-done' },
    { label: 'Remaining', value: stats?.remaining ?? '—', color: 'text-ink' }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-4 md:px-6 mb-4">
      {entries.map((e) => (
        <div key={e.label} className="bg-base-raised border border-border rounded-card px-3 py-3 text-center">
          <p className={`font-display text-xl ${e.color}`}>{e.value}</p>
          <p className="text-[11px] text-ink-muted mt-0.5 leading-tight">{e.label}</p>
        </div>
      ))}
    </div>
  );
}
