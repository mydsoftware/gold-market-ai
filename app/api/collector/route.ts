import { NextResponse } from 'next/server';
import { getMarkets } from '@/lib/market';
import { saveSnapshots } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function collect(request: Request) {
  const secret = process.env.COLLECTOR_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const markets = await getMarkets();
  const rows = markets.filter(m => typeof m.price === 'number').map(m => ({ symbol: m.slug, price: m.price as number, changePct: m.changePct ?? undefined }));
  const saved = saveSnapshots(rows);
  return NextResponse.json({ source: 'TGJU', saved, timestamp: new Date().toISOString(), markets: rows });
}

export async function GET(request: Request) {
  try { return await collect(request); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'خطای collector' }, { status: 502 }); }
}

export async function POST(request: Request) {
  try { return await collect(request); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'خطای collector' }, { status: 502 }); }
}