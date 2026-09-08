'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { CheckCircle2, XCircle, Check } from 'lucide-react';

interface Status {
  youtube: boolean;
  tiktok: boolean;
  facebook: boolean;
  ai: boolean;
  database: boolean;
  isDemoMode: boolean;
}

interface DiscoverySettings {
  scanFrequencyMinutes: number;
  minimumRelevanceScore: number;
  recommendationsPerCategory: number;
  dailyBriefingEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="focus-ring flex items-center justify-between w-full py-2.5 text-sm"
    >
      <span>{label}</span>
      <span
        className={`w-9 h-5 rounded-full relative transition-colors ${checked ? 'bg-signal-gold' : 'bg-base-overlay border border-border'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-base transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </span>
    </button>
  );
}

function IntegrationRow({ label, connected, envVar, note }: { label: string; connected: boolean; envVar: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-ink-faint mt-0.5">
          Set <code className="bg-base-overlay px-1 py-0.5 rounded">{envVar}</code> in your environment
        </p>
        {note && <p className="text-xs text-ink-muted mt-1 max-w-md">{note}</p>}
      </div>
      {connected ? (
        <span className="flex items-center gap-1 text-signal-done text-xs font-medium shrink-0 pt-0.5">
          <CheckCircle2 size={14} /> Connected
        </span>
      ) : (
        <span className="flex items-center gap-1 text-ink-faint text-xs font-medium shrink-0 pt-0.5">
          <XCircle size={14} /> Not configured
        </span>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [settings, setSettings] = useState<DiscoverySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then(setStatus);
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => setSettings(json.settings));
  }, []);

  const saveSettings = async (next: DiscoverySettings) => {
    setSettings(next);
    setSaving(true);
    setSaved(false);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next)
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure discovery, platform connections, and notifications." />

      <div className="px-4 md:px-6 space-y-8 max-w-2xl">
        <section>
          <h2 className="font-display text-lg mb-2">Platforms</h2>
          <div className="bg-base-raised border border-border rounded-card px-4">
            <IntegrationRow label="YouTube" connected={!!status?.youtube} envVar="YOUTUBE_API_KEY" note="YouTube Data API v3 key from Google Cloud Console." />
          </div>
          <p className="text-xs text-ink-faint mt-2">
            Discovery is currently scoped to YouTube only. TikTok and Facebook connector code still exists in the project for a future re-enable.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">AI</h2>
          <div className="bg-base-raised border border-border rounded-card px-4">
            <IntegrationRow label="AI provider" connected={!!status?.ai} envVar="AI_API_KEY" note="Powers relevance scoring, analysis, titles, and thumbnail captions." />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Database</h2>
          <div className="bg-base-raised border border-border rounded-card px-4">
            <IntegrationRow
              label="PostgreSQL"
              connected={!!status?.database}
              envVar="DATABASE_URL"
              note={status?.isDemoMode ? 'Running on sample data until this is set.' : 'Connected — using live data.'}
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2 flex items-center gap-2">
            Discovery
            {saved && <span className="text-signal-done text-xs font-normal flex items-center gap-1"><Check size={13} /> Saved</span>}
          </h2>
          {settings ? (
            <div className="bg-base-raised border border-border rounded-card px-4 py-1 divide-y divide-border">
              <div className="py-3">
                <label className="text-sm flex items-center justify-between">
                  Scan frequency
                  <select
                    value={settings.scanFrequencyMinutes}
                    onChange={(e) => saveSettings({ ...settings, scanFrequencyMinutes: Number(e.target.value) })}
                    className="focus-ring bg-base-overlay border border-border rounded-card px-2 py-1.5 text-sm"
                  >
                    <option value={120}>Every 2 hours</option>
                    <option value={360}>Every 6 hours</option>
                    <option value={720}>Every 12 hours</option>
                    <option value={1440}>Once a day</option>
                  </select>
                </label>
              </div>
              <div className="py-3">
                <label className="text-sm flex items-center justify-between">
                  Minimum relevance score
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={settings.minimumRelevanceScore}
                      onChange={(e) => setSettings({ ...settings, minimumRelevanceScore: Number(e.target.value) })}
                      onMouseUp={(e) => saveSettings({ ...settings, minimumRelevanceScore: Number((e.target as HTMLInputElement).value) })}
                      onTouchEnd={(e) => saveSettings({ ...settings, minimumRelevanceScore: Number((e.target as HTMLInputElement).value) })}
                      className="w-32 accent-[#D4A73D]"
                    />
                    <span className="text-signal-gold w-10 text-right">{settings.minimumRelevanceScore}%</span>
                  </div>
                </label>
              </div>
              <div className="py-3">
                <label className="text-sm flex items-center justify-between">
                  Results per category
                  <select
                    value={settings.recommendationsPerCategory}
                    onChange={(e) => saveSettings({ ...settings, recommendationsPerCategory: Number(e.target.value) })}
                    className="focus-ring bg-base-overlay border border-border rounded-card px-2 py-1.5 text-sm"
                  >
                    {[4, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Loading…</p>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Notifications</h2>
          {settings ? (
            <div className="bg-base-raised border border-border rounded-card px-4 divide-y divide-border">
              <Toggle
                label="Daily morning briefing"
                checked={settings.dailyBriefingEnabled}
                onChange={(v) => saveSettings({ ...settings, dailyBriefingEnabled: v })}
              />
              <Toggle
                label="Email delivery"
                checked={settings.emailEnabled}
                onChange={(v) => saveSettings({ ...settings, emailEnabled: v })}
              />
              <Toggle
                label="Push notifications"
                checked={settings.pushEnabled}
                onChange={(v) => saveSettings({ ...settings, pushEnabled: v })}
              />
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Loading…</p>
          )}
          <p className="text-xs text-ink-faint mt-2">
            Email delivery uses Resend when <code className="bg-base-overlay px-1 py-0.5 rounded">RESEND_API_KEY</code> and{' '}
            <code className="bg-base-overlay px-1 py-0.5 rounded">BRIEFING_EMAIL_TO</code> are set. Push notifications aren't wired to a provider yet.
          </p>
        </section>
      </div>
    </div>
  );
}
