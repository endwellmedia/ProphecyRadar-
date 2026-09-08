'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';

export function DemoModeBanner() {
  const [isDemoMode, setIsDemoMode] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((s) => setIsDemoMode(s.isDemoMode));
  }, []);

  if (!isDemoMode) return null;

  return (
    <div className="mx-4 md:mx-6 mb-4 flex items-start gap-2 bg-signal-info/10 border border-signal-info/30 rounded-card px-3.5 py-2.5 text-sm">
      <Info size={16} className="text-signal-info shrink-0 mt-0.5" />
      <p className="text-ink-muted">
        Showing sample data — no database or platform API keys are configured yet.{' '}
        <Link href="/settings" className="text-signal-info underline underline-offset-2">
          Connect your integrations in Settings
        </Link>{' '}
        to start live discovery.
      </p>
    </div>
  );
}
