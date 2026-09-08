'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const keywords = keywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, keywords })
    });

    setSubmitting(false);

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? 'Something went wrong.');
      return;
    }

    router.push('/categories');
  };

  return (
    <div>
      <PageHeader title="Create Custom Category" subtitle="Enter a name and the keywords the system should watch for." />
      <form onSubmit={handleSubmit} className="px-4 md:px-6 max-w-lg flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Category name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tinubu Health Prophecies"
            className="focus-ring w-full bg-base-raised border border-border rounded-card px-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Keywords (one per line)</label>
          <textarea
            required
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
            rows={5}
            placeholder={'Peter Obi 2027 prophecy\nBiafra prophecy\nTinubu death prophecy'}
            className="focus-ring w-full bg-base-raised border border-border rounded-card px-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
        </div>
        {error && <p className="text-sm text-signal-alert">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring self-start bg-signal-gold text-base font-medium px-4 py-2.5 rounded-card disabled:opacity-60"
        >
          {submitting ? 'Creating…' : 'Create category'}
        </button>
      </form>
    </div>
  );
}
