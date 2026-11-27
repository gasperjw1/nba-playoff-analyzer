// ============================================================
// MODELS VS MARKET — the scoreboard behind the "Models vs market" page
// ============================================================
// Settled ledger rows only (recorded before tip). Every model is scored against DraftKings'
// closing no-vig chance on the same games (the benchmark every research file uses), falling
// back to the recorded market price when a row has no close. Differences carry a standard
// error so a gap inside the noise reads as "level", not as a win.
//
// Uses (globals): _noVigHome (trust.js).
// ============================================================
const SEASON_SCOREBOARD_MODELS = [
  { key: 'ours', label: 'Our model', get: (r) => r.pOurs },
  { key: 'report', label: 'Our model + injury report', get: (r) => r.pOursReport },
  { key: 'clean', label: 'Our model · 2025-26 ratings', get: (r) => r.pOursClean },
  { key: 'nbai', label: 'NB.AI', get: (r) => r.pFriend },
  { key: 'recorded', label: 'Market when we recorded', get: (r) => r.pMarket },
];

const _sbHomeWon = (r) => (r.result.homeScore > r.result.awayScore ? 1 : 0);
// The benchmark: DraftKings' close (no-vig), else the recorded market price.
function seasonCloseHome(r) {
  const c = r.close;
  if (c && typeof c.mlHome === 'number' && typeof c.mlAway === 'number' && Math.abs(c.mlHome) >= 100 && Math.abs(c.mlAway) >= 100) return _noVigHome(c.mlHome, c.mlAway);
  return typeof r.pMarket === 'number' ? r.pMarket : null;
}
const _sbSettled = (rows) => (rows || []).filter(r => r.result && r.result.homeScore != null && seasonCloseHome(r) != null);

// One model against the close on the games it forecast: winners, Brier, the paired Brier difference
// (model − close) with its standard error, and a verdict at 2 SE.
function seasonModelVsClose(rows, get) {
  const g = _sbSettled(rows).filter(r => typeof get(r) === 'number');
  const n = g.length;
  if (!n) return { n: 0 };
  let win = 0, winC = 0, b = 0, bc = 0; const d = [];
  for (const r of g) {
    const y = _sbHomeWon(r), p = get(r), c = seasonCloseHome(r);
    if ((p >= 0.5) === (y === 1)) win++;
    if ((c >= 0.5) === (y === 1)) winC++;
    b += (p - y) ** 2; bc += (c - y) ** 2; d.push((p - y) ** 2 - (c - y) ** 2);
  }
  const m = d.reduce((s, x) => s + x, 0) / n, sd = n > 1 ? Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1)) : 0, se = sd / Math.sqrt(n);
  const verdict = n < 30 ? 'too few games' : m > 2 * se ? 'worse than the market' : m < -2 * se ? 'better than the market' : 'level with the market (inside the noise)';
  return { n, winners: win / n, winnersClose: winC / n, brier: b / n, brierClose: bc / n, diff: m, se, verdict };
}

function seasonScoreboard(rows) {
  const close = (() => { const g = _sbSettled(rows); if (!g.length) return { n: 0 };
    let w = 0, b = 0; for (const r of g) { const y = _sbHomeWon(r), c = seasonCloseHome(r); if ((c >= 0.5) === (y === 1)) w++; b += (c - y) ** 2; }
    return { n: g.length, winners: w / g.length, brier: b / g.length }; })();
  return { close, models: SEASON_SCOREBOARD_MODELS.map(M => ({ key: M.key, label: M.label, ...seasonModelVsClose(rows, M.get) })) };
}

// Calibration: games bucketed by the favourite's chance under one forecast; how often the favourite won.
function seasonCalibration(rows, get, edges) {
  const E = edges || [0.5, 0.6, 0.7, 0.8, 0.9, 1.0001];
  const out = E.slice(0, -1).map((lo, i) => ({ lo, hi: Math.min(1, E[i + 1]), n: 0, said: 0, won: 0 }));
  for (const r of _sbSettled(rows)) {
    const p = get(r); if (typeof p !== 'number') continue;
    const fav = Math.max(p, 1 - p), y = _sbHomeWon(r), favWon = (p >= 0.5) === (y === 1) ? 1 : 0;
    const b = out.find(x => fav >= x.lo && fav < (x.hi === 1 ? 1.0001 : x.hi)); if (!b) continue;
    b.n++; b.said += fav; b.won += favWon;
  }
  return out.map(b => ({ ...b, said: b.n ? b.said / b.n : null, won: b.n ? b.won / b.n : null, wins: b.won }));
}

// The paired difference against the close, week by week (weeks start Monday, by game date).
function seasonWeekly(rows, get) {
  const wk = (d) => { const t = new Date(d + 'T12:00:00Z'), dow = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - dow); return t.toISOString().slice(0, 10); };
  const by = new Map();
  for (const r of _sbSettled(rows)) { if (typeof get(r) !== 'number') continue; const k = wk(r.date); if (!by.has(k)) by.set(k, []); by.get(k).push(r); }
  return [...by.keys()].sort().map(k => ({ week: k, ...seasonModelVsClose(by.get(k), get) }));
}
