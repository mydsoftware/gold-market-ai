import { NextResponse } from 'next/server';
import { calculateIndicators, type Candle } from '@/lib/market-intelligence';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { history?: Candle[]; current?: number };
    if (!Array.isArray(body.history)) return NextResponse.json({ error: 'history الزامی است' }, { status: 400 });
    return NextResponse.json(calculateIndicators(body.history, body.current));
  } catch {
    return NextResponse.json({ error: 'داده نامعتبر است' }, { status: 400 });
  }
}