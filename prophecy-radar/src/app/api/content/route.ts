import { NextRequest, NextResponse } from 'next/server';
import { getContentFeed } from '@/lib/data-source';
import { ContentStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const items = await getContentFeed({
    categoryId: params.get('category') ?? undefined,
    status: (params.get('status') as ContentStatus) ?? undefined,
    platform: params.get('platform') ?? undefined,
    query: params.get('q') ?? undefined,
    sinceDays: params.get('sinceDays') ? Number(params.get('sinceDays')) : undefined
  });
  return NextResponse.json({ items });
}
