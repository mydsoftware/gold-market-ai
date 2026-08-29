import { NextResponse } from 'next/server';
import { buildMarketPrompt, calculateIndicators, type Candle } from '@/lib/market-intelligence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json() as { symbol?: string; price?: number; history?: Candle[]; markets?: Array<{ symbol: string; price: number; changePct?: number }> };
    const url = process.env.AGENT_MANAGER_URL;
    const token = process.env.AGENT_MANAGER_TOKEN;
    if (url) {
      const history = payload.history || [];
      const indicators = typeof payload.price === 'number' ? calculateIndicators(history, payload.price) : null;
      const prompt = payload.symbol && typeof payload.price === 'number' ? buildMarketPrompt(payload.symbol, payload.price, indicators!) : 'تحلیل بازار طلا و سکه بر اساس داده‌های بازار ارائه‌شده انجام بده.';
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ task: 'gold_market_analysis', market: payload, indicators, prompt }) });
        const text = await r.text();
        return new NextResponse(text, { status: r.status, headers: { 'Content-Type': r.headers.get('content-type') || 'application/json' } });
      } catch (e) {
        return NextResponse.json({ error: `Agent Manager connection failed: ${e instanceof Error ? e.message : 'unknown'}` }, { status: 502 });
      }
    }
    const markets = payload.markets || [];
    const rising = markets.filter(m => (m.changePct ?? 0) > 0).length;
    const falling = markets.filter(m => (m.changePct ?? 0) < 0).length;
    return NextResponse.json({ mode: 'fallback', analysis: `تحلیل پایه: ${rising} بازار صعودی و ${falling} بازار نزولی هستند. برای تحلیل هوشمند کامل، AGENT_MANAGER_URL و AGENT_MANAGER_TOKEN را در Vercel تنظیم کنید.` });
  } catch {
    return NextResponse.json({ error: 'داده تحلیل نامعتبر است' }, { status: 400 });
  }
}