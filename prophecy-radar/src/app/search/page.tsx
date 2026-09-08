'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { ContentFeed } from '@/components/content-feed';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 350);
    return () => clearTimeout(t);
  }, [input]);

  return (
    <div>
      <PageHeader title="Search" subtitle="Search by person, prophet, topic, keyword, date, platform, or category." />
      <div className="px-4 md:px-6 mb-4">
        <div className="relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search prophecy content…"
            className="focus-ring w-full bg-base-raised border border-border rounded-card pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
        </div>
      </div>
      {query ? (
        <ContentFeed query={query} emptyTitle="No matches" emptyBody={`Nothing found for "${query}".`} />
      ) : (
        <p className="px-4 md:px-6 text-sm text-ink-muted">Start typing to search discovered content.</p>
      )}
    </div>
  );
}
