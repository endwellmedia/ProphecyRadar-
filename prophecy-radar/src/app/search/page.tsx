'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { ContentFeed } from '@/components/content-feed';
import { Search as SearchIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function SearchPage() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 350);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => setCategories(json.categories));
  }, []);

  const hasFilter = Boolean(query) || Boolean(categoryId);

  return (
    <div>
      <PageHeader title="Search" subtitle="Search by person, prophet, topic, or keyword — optionally narrowed to a category." />
      <div className="px-4 md:px-6 mb-4 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search prophecy content…"
            className="focus-ring w-full bg-base-raised border border-border rounded-card pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="focus-ring bg-base-raised border border-border rounded-card px-3 py-2.5 text-sm md:w-56"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
      </div>
      {hasFilter ? (
        <ContentFeed
          query={query || undefined}
          categoryId={categoryId || undefined}
          emptyTitle="No matches"
          emptyBody={
            query && categoryId
              ? `Nothing found for "${query}" in this category.`
              : query
              ? `Nothing found for "${query}".`
              : 'No content in this category yet.'
          }
        />
      ) : (
        <p className="px-4 md:px-6 text-sm text-ink-muted">Start typing, or pick a category, to search discovered content.</p>
      )}
    </div>
  );
}
