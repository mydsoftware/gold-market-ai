import { NextResponse } from 'next/server';
import { appendSnapshots } from '@/lib/history-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = process.env.COLLECTOR_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json() as { markets?: Record<string, { price?: number; changePct?: number }> };
  const timestamp = new Date().toISOString();
  const rows = Object.entries(body.markets ?? {}).filter(([, m]) => typeof m.price === 'number').map(([symbol, m]) => ({ symbol, price: m.price as number, changePct: m.changePct, timestamp }));
  return NextResponse.json({ saved: await appendSnapshots(rows), timestamp });
}