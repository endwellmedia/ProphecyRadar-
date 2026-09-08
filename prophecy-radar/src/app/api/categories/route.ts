import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/data-source';
import { isDemoMode } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name ?? '').trim();
  const keywords = (body.keywords ?? []).map((k: string) => k.trim()).filter(Boolean);

  if (!name || keywords.length === 0) {
    return NextResponse.json({ error: 'A name and at least one keyword are required.' }, { status: 400 });
  }

  if (isDemoMode) {
    return NextResponse.json({
      category: { id: `custom-${Date.now()}`, name, emoji: '🔮', keywords, isCustom: true, active: true },
      note: 'Demo mode: custom categories are not persisted without a database.'
    });
  }

  const category = await prisma.category.create({
    data: { name, emoji: '🔮', keywords, isCustom: true }
  });
  return NextResponse.json({ category });
}
