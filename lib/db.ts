import Database from 'better-sqlite3';
import path from 'node:path';

const dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'market.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS markets (symbol TEXT PRIMARY KEY, name TEXT NOT NULL, unit TEXT, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS market_snapshots (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL, price REAL NOT NULL, change_pct REAL, captured_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_snapshots_symbol_time ON market_snapshots(symbol, captured_at);
CREATE TABLE IF NOT EXISTS coin_bubbles (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL, bubble REAL, captured_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ai_analyses (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL, prompt TEXT NOT NULL, result TEXT, created_at TEXT NOT NULL);`);

export function saveSnapshots(rows: Array<{symbol:string; price:number; changePct?:number}>) {
  const now = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO market_snapshots (symbol, price, change_pct, captured_at) VALUES (?, ?, ?, ?)');
  const tx = db.transaction((items: typeof rows) => { for (const r of items) stmt.run(r.symbol, r.price, r.changePct ?? null, now); });
  tx(rows);
  return rows.length;
}

export function history(symbol: string, sinceMs = 24 * 60 * 60 * 1000) {
  const since = new Date(Date.now() - sinceMs).toISOString();
  return db.prepare('SELECT symbol, price, change_pct AS changePct, captured_at AS timestamp FROM market_snapshots WHERE symbol = ? AND captured_at >= ? ORDER BY captured_at ASC').all(symbol, since);
}
