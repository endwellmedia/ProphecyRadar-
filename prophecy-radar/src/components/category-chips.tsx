'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export function CategoryChips() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => setCategories(json.categories));
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto px-4 md:px-6 pb-4 -mx-1 no-scrollbar">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/categories/${c.id}`}
          className="focus-ring shrink-0 flex items-center gap-1.5 bg-base-raised border border-border rounded-full px-3.5 py-2 text-sm hover:border-signal-gold/50 transition-colors"
        >
          <span>{c.emoji}</span>
          {c.name}
        </Link>
      ))}
      <Link
        href="/categories/new"
        className="focus-ring shrink-0 flex items-center gap-1.5 border border-dashed border-border rounded-full px-3.5 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
      >
        + Custom category
      </Link>
    </div>
  );
}
