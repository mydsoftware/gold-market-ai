export type Candle = { time: string; price: number };

export type Indicators = {
  change: number;
  changePercent: number;
  high: number;
  low: number;
  sma7: number | null;
  sma30: number | null;
  trend: 'صعودی' | 'نزولی' | 'خنثی';
  support: number | null;
  resistance: number | null;
};

const avg = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

const sma = (values: number[], period: number) => values.length >= period ? avg(values.slice(-period)) : null;

export function calculateIndicators(history: Candle[], current?: number): Indicators {
  const values = history.map(x => x.price).filter(Number.isFinite);
  const latest = current ?? values.at(-1) ?? 0;
  const previous = values.at(-2) ?? latest;
  const change = latest - previous;
  const changePercent = previous ? (change / previous) * 100 : 0;
  const high = values.length ? Math.max(...values) : latest;
  const low = values.length ? Math.min(...values) : latest;
  const sma7 = sma(values, 7);
  const sma30 = sma(values, 30);
  const trend = sma7 == null || sma30 == null ? 'خنثی' : sma7 > sma30 * 1.002 ? 'صعودی' : sma7 < sma30 * 0.998 ? 'نزولی' : 'خنثی';
  return { change, changePercent, high, low, sma7, sma30, trend, support: low || null, resistance: high || null };
}

export function buildMarketPrompt(symbol: string, price: number, indicators: Indicators) {
  return `تو تحلیلگر بازار طلا و سکه هستی. فقط بر اساس داده‌های ارائه‌شده تحلیل کن و عددی را حدس نزن.\nنماد: ${symbol}\nقیمت: ${price}\nتغییر: ${indicators.change}\nدرصد تغییر: ${indicators.changePercent.toFixed(2)}%\nSMA7: ${indicators.sma7 ?? 'ناموجود'}\nSMA30: ${indicators.sma30 ?? 'ناموجود'}\nروند: ${indicators.trend}\nحمایت: ${indicators.support ?? 'ناموجود'}\nمقاومت: ${indicators.resistance ?? 'ناموجود'}\n\nخروجی فارسی و ساختاریافته شامل وضعیت بازار، شواهد، سناریوی صعودی، سناریوی نزولی و ریسک‌ها ارائه کن. این تحلیل توصیه قطعی خرید یا فروش نیست.`;
}