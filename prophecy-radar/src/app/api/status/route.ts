import { NextResponse } from 'next/server';
import { integrationStatus, isDemoMode } from '@/lib/env';

export async function GET() {
  return NextResponse.json({ ...integrationStatus, isDemoMode });
}
