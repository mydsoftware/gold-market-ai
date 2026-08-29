import { NextResponse } from 'next/server';
import { history } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const days = Math.min(Math.max(Number(new URL(request.url).searchParams.get('days') || 1), 1), 30);
    return NextResponse.json({ symbol: slug, days, source: 'SQLite', data: history(slug, days * 24 * 60 * 60 * 1000) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'خطا در تاریخچه' }, { status: 500 });
  }
}