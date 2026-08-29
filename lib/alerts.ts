export type AlertRule = { symbol: string; target: number; direction: 'above' | 'below' };
export function checkAlerts(rules: AlertRule[], prices: Record<string, number | null>) {
  return rules.filter(r => { const p = prices[r.symbol]; return typeof p === 'number' && (r.direction === 'above' ? p >= r.target : p <= r.target); });
}
