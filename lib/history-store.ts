import { promises as fs } from 'node:fs';
import path from 'node:path';

export type MarketSnapshot = { symbol: string; price: number; changePct?: number; timestamp: string };
const file = path.join('/tmp', 'gold-market-history.json');

async function readAll(): Promise<MarketSnapshot[]> {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) as MarketSnapshot[]; } catch { return []; }
}

export async function appendSnapshots(rows: MarketSnapshot[]) {
  const current = await readAll();
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const merged = [...current, ...rows].filter(x => Date.parse(x.timestamp) >= cutoff).slice(-20000);
  await fs.writeFile(file, JSON.stringify(merged), 'utf8');
  return merged.length;
}

export async function getHistory(symbol: string, sinceMs = 24 * 60 * 60 * 1000) {
  const all = await readAll();
  const cutoff = Date.now() - sinceMs;
  return all.filter(x => x.symbol === symbol && Date.parse(x.timestamp) >= cutoff);
}