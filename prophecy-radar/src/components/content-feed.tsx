'use client';

import { useEffect, useState, useCallback } from 'react';
import { ContentCardData, ContentStatus } from '@/lib/types';
import { ContentCard } from './content-card';
import { Loader2, Inbox } from 'lucide-react';

interface Props {
  categoryId?: string;
  status?: ContentStatus;
  query?: string;
  emptyTitle?: string;
  emptyBody?: string;
}

export function ContentFeed({ categoryId, status, query, emptyTitle, emptyBody }: Props) {
  const [items, setItems] = useState<ContentCardData[] | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (status) params.set('status', status);
    if (query) params.set('q', query);
    const res = await fetch(`/api/content?${params.toString()}`);
    const json = await res.json();
    setItems(json.items);
  }, [categoryId, status, query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: string, newStatus: ContentStatus) => {
    // Optimistic update — the item's row is never removed from the
    // underlying database, only its status changes.
    setItems((prev) => (prev ? prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)) : prev));
    await fetch(`/api/content/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  if (items === null) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-muted">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading discoveries…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <Inbox className="text-ink-faint mb-3" size={32} />
        <p className="font-display text-lg">{emptyTitle ?? 'Nothing here yet'}</p>
        <p className="text-sm text-ink-muted mt-1 max-w-sm">
          {emptyBody ?? 'When genuinely relevant content is discovered, it will show up here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-6 pb-6">
      {items.map((item) => (
        <ContentCard key={item.id} content={item} onStatusChange={handleStatusChange} />
      ))}
    </div>
  );
}
