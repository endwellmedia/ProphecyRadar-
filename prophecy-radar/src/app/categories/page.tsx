'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => setCategories(json.categories));
  }, []);

  return (
    <div>
      <PageHeader title="Categories" subtitle="Browse discoveries by topic, or create your own." />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 md:px-6">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
            className="focus-ring bg-base-raised border border-border rounded-card p-4 hover:border-signal-gold/50 transition-colors"
          >
            <span className="text-2xl">{c.emoji}</span>
            <p className="mt-2 text-sm font-medium leading-snug">{c.name}</p>
          </Link>
        ))}
        <Link
          href="/categories/new"
          className="focus-ring border border-dashed border-border rounded-card p-4 flex flex-col items-center justify-center text-center text-ink-muted hover:text-ink transition-colors"
        >
          <span className="text-2xl">+</span>
          <p className="mt-2 text-sm font-medium">Create custom category</p>
        </Link>
      </div>
    </div>
  );
}
