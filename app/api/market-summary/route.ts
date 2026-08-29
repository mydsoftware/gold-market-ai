import { NextResponse } from 'next/server';
import { calculateIndicators, type Candle } from '@/lib/market-intelligence';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const { history, current } = await request.json() as { history: Candle[]; current?: number };
    if (!Array.isArray(history)) return NextResponse.json({ error: 'history الزامی است' }, { status: 400 });
    const indicators = calculateIndicators(history, current);
    const signal = indicators.trend === 'صعودی' ? 'مثبت' : indicators.trend === 'نزولی' ? 'منفی' : 'خنثی';
    return NextResponse.json({ signal, indicators, disclaimer: 'این خروجی تحلیل داده است و توصیه قطعی سرمایه‌گذاری نیست.' });
  } catch { return NextResponse.json({ error: 'داده نامعتبر است' }, { status: 400 }); }
}
