'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Plus, User } from 'lucide-react';

interface Prophet {
  id: string;
  name: string;
  youtubeChannelUrl?: string;
  tiktokProfileUrl?: string;
  facebookPageUrl?: string;
  keywords: string[];
}

export default function ProphetsPage() {
  const [prophets, setProphets] = useState<Prophet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', youtubeChannelUrl: '', keywords: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    fetch('/api/prophets')
      .then((r) => r.json())
      .then((json) => setProphets(json.prophets));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/prophets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      })
    });
    setSubmitting(false);
    setShowForm(false);
    setForm({ name: '', youtubeChannelUrl: '', keywords: '' });
    load();
  };

  return (
    <div>
      <PageHeader title="Followed Prophets" subtitle="New content from these creators is prioritized in discovery." />

      <div className="px-4 md:px-6 mb-4">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="focus-ring flex items-center gap-1.5 bg-base-raised border border-border rounded-card px-3.5 py-2 text-sm hover:border-signal-gold/50 transition-colors"
        >
          <Plus size={15} /> Add prophet
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="px-4 md:px-6 mb-6 max-w-lg flex flex-col gap-3">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="focus-ring bg-base-raised border border-border rounded-card px-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
          <input
            placeholder="YouTube channel URL"
            value={form.youtubeChannelUrl}
            onChange={(e) => setForm({ ...form, youtubeChannelUrl: e.target.value })}
            className="focus-ring bg-base-raised border border-border rounded-card px-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
          <input
            placeholder="Keywords, comma separated"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            className="focus-ring bg-base-raised border border-border rounded-card px-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring self-start bg-signal-gold text-base font-medium px-4 py-2.5 rounded-card disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save prophet'}
          </button>
        </form>
      )}

      <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {prophets.map((p) => (
          <div key={p.id} className="bg-base-raised border border-border rounded-card p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-base-overlay flex items-center justify-center shrink-0">
              <User size={18} className="text-ink-muted" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-ink-muted mt-0.5 truncate">
                {[p.youtubeChannelUrl, p.tiktokProfileUrl, p.facebookPageUrl].filter(Boolean).join(' · ') || 'No linked profiles'}
              </p>
              {p.keywords.length > 0 && <p className="text-xs text-ink-faint mt-1">{p.keywords.join(', ')}</p>}
            </div>
          </div>
        ))}
        {prophets.length === 0 && <p className="text-sm text-ink-muted col-span-full">No prophets followed yet.</p>}
      </div>
    </div>
  );
}
