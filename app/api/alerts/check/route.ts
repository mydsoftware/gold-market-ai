import { NextResponse } from 'next/server';
import { checkAlerts, type AlertRule } from '@/lib/alerts';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const body = await request.json() as { rules?: AlertRule[]; prices?: Record<string, number | null> };
    return NextResponse.json({ triggered: checkAlerts(body.rules ?? [], body.prices ?? {}) });
  } catch { return NextResponse.json({ error: 'داده نامعتبر است' }, { status: 400 }); }
}
