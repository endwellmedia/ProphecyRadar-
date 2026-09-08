import { NextResponse } from 'next/server';
import { getTodayStats } from '@/lib/data-source';

export async function GET() {
  const stats = await getTodayStats();
  return NextResponse.json(stats);
}
