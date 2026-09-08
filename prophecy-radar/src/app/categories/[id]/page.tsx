'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { ContentFeed } from '@/components/content-feed';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => setCategory(json.categories.find((c: Category) => c.id === id) ?? null));
  }, [id]);

  return (
    <div>
      <PageHeader
        title={category ? `${category.emoji} ${category.name}` : 'Category'}
        subtitle="Best recent discoveries in this category."
      />
      <ContentFeed
        categoryId={id}
        emptyTitle="No qualifying content yet"
        emptyBody="We only show genuinely relevant results — if fewer than six exist right now, we won't pad the list with weak matches."
      />
    </div>
  );
}
