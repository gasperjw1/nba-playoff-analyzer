// ============================================================
// RESEARCH — do big line moves overreact? (move-1, LINE_MOVE_RESEARCH.md)
// ============================================================
// Pre-registered in LINE_MOVE_RESEARCH.md (commit d2d5ea8) before this file was written.
// Reads ESPN caches only; nothing is fetched and no API credits are used.
//
//   Set A  2023-24..2025-26  .cache/espn-nba/hist-odds, one book per game (ESPN BET with open and
//          close, else DraftKings), results from .cache/espn-nba/hist box scores
//   Set B  2015-16..2016-17  .cache/espn-nba/early, ESPN "Opening" moneyline vs the median no-vig
//          chance across listed books (engine-close-2's exclusions, 2+ books), results from sb-*.json
//   Q4     this season: season-replay.js, season-ledger.js, season-backfill.js (DraftKings open/close)
//
// Usage:
//   node research-line-move.js --dry   joins and counts only; reads no scores
//   node research-line-move.js         scores Q1–Q4 (run once)
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DRY = process.argv.includes('--dry');
const C = path.join(__dirname, '.cache/espn-nba');
const MAX_MOVE = 0.30, T_MAIN = 0.08, GRID = [0.05, 0.08, 0.12];
const EXCLUDED_BOOK = /opening|live|consensus|accuscore|teamrankings|numberfire/i;

const dec = (a) => (a < 0 ? 1 + 100 / -a : 1 + a / 100);
const imp = (a) => 1 / dec(a);
const noVig = (a, b) => imp(a) / (imp(a) + imp(b));
function powerFair(a, b) {
  const x = imp(a), y = imp(b); let lo = 1, hi = 3;
  for (let i = 0; i < 60; i++) { const k = (lo + hi) / 2; if (x ** k + y ** k > 1) lo = k; else hi = k; }
  return x ** ((lo + hi) / 2);
}
const ok = (a) => a != null && isFinite(a) && Math.abs(a) >= 100;
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// A game: { set, season, id, pOpen, pClose (home, proportional), pwOpen, pwClose (home, power),
// closeHome, closeAway (American, for Q3), res: () => 1/0 home won }. Scores are read only via res().
function game(set, season, id, open, close, res) {
  const pOpen = noVig(open[0], open[1]), pClose = noVig(close[0], close[1]);
  return { set, season, id: String(id), pOpen, pClose, move: pClose - pOpen,
    pwOpen: powerFair(open[0], open[1]), pwClose: powerFair(close[0], close[1]), closeHome: close[0], closeAway: close[1], res };
}

function setA() {
  const box = new Map();
  for (const f of fs.readdirSync(path.join(C, 'hist')).filter((f) => f.startsWith('box-'))) {
    const b = readJson(path.join(C, 'hist', f));
    box.set(String(b.id), { season: b.date < '2024-07-01' ? '2023-24' : b.date < '2025-07-01' ? '2024-25' : '2025-26', b });
  }
  const out = [], skip = { noBox: 0, noBook: 0, bigMove: 0 }, books = {};
  for (const f of fs.readdirSync(path.join(C, 'hist-odds'))) {
    const o = readJson(path.join(C, 'hist-odds', f)), j = box.get(String(o.id));
    if (!j) { skip.noBox++; continue; }
    const full = (p) => p && [p.openHome, p.openAway, p.closeHome, p.closeAway].every(ok);
    const p = [o.providers.find((x) => /^espn bet$/i.test(x.name || '')), o.providers.find((x) => /^draftkings$/i.test(x.name || ''))].find(full);
    if (!p) { skip.noBook++; continue; }
    const g = game('A', j.season, o.id, [p.openHome, p.openAway], [p.closeHome, p.closeAway], () => (j.b.hs > j.b.as ? 1 : 0));
    if (Math.abs(g.move) > MAX_MOVE) { skip.bigMove++; continue; }
    g.book = p.name; books[`${j.season} ${p.name}`] = (books[`${j.season} ${p.name}`] || 0) + 1;
    out.push(g);
  }
  return { games: out, skip, books };
}

function setB() {
  const out = [], skip = { notFinal: 0, noOdds: 0, noOpening: 0, fewBooks: 0, bigMove: 0 };
  for (const f of fs.readdirSync(path.join(C, 'early')).filter((f) => f.startsWith('sb-'))) {
    const d = f.slice(3, 13), y = +d.slice(0, 4), m = +d.slice(5, 7);
    const start = m >= 9 ? y : y - 1;   // season label by start year (2015-16, 2016-17 only)
    if (start !== 2015 && start !== 2016) continue;
    const season = `${start}-${String(start + 1).slice(2)}`;
    for (const e of readJson(path.join(C, 'early', f))) {
      if (e.type !== 2) continue;
      if (!e.done) { skip.notFinal++; continue; }
      const of = path.join(C, 'early', `odds-${e.id}.json`);
      if (!fs.existsSync(of)) { skip.noOdds++; continue; }
      const o = readJson(of);
      const op = o.providers.find((x) => /^opening$/i.test(x.name || ''));
      if (!op || !ok(op.home) || !ok(op.away)) { skip.noOpening++; continue; }
      const bk = o.providers.filter((x) => x.name && !EXCLUDED_BOOK.test(x.name) && ok(x.home) && ok(x.away));
      if (bk.length < 2) { skip.fewBooks++; continue; }
      const pClose = median(bk.map((x) => noVig(x.home, x.away)));
      const g = game('B', season, e.id, [op.home, op.away], [median(bk.map((x) => x.home)), median(bk.map((x) => x.away))], () => (e.hs > e.as ? 1 : 0));
      // The close is the median of the books' no-vig chances (as pre-registered); the median American
      // odds are kept only for Q3's prices.
      g.pClose = pClose; g.move = pClose - g.pOpen;
      g.pwClose = median(bk.map((x) => powerFair(x.home, x.away)));
      if (Math.abs(g.move) > MAX_MOVE) { skip.bigMove++; continue; }
      g.books = bk.length;
      out.push(g);
    }
  }
  return { games: out, skip };
}

function setSeason() {
  const ctx = vm.createContext({});
  const load = (rel) => { const f = path.join(__dirname, rel); if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8').replace(/^(const|let) /gm, 'var '), ctx); };
  ['js/season/data/season-replay.js', 'js/season/data/season-ledger.js', 'js/season/data/season-backfill.js'].forEach(load);
  const byId = new Map(), skip = { noOpen: 0, noResult: 0, bigMove: 0 };
  const take = (src, r, close, open) => {
    if (byId.has(String(r.id))) return;
    if (!open || ![open.mlHome, open.mlAway, close.mlHome, close.mlAway].every(ok)) { skip.noOpen++; return; }
    if (!r.result || r.result.homeScore == null) { skip.noResult++; return; }
    const g = game('season', src, r.id, [open.mlHome, open.mlAway], [close.mlHome, close.mlAway], () => (r.result.homeScore > r.result.awayScore ? 1 : 0));
    if (Math.abs(g.move) > MAX_MOVE) { skip.bigMove++; return; }
    byId.set(String(r.id), g);
  };
  for (const r of ctx.SEASON_LEDGER || []) if (r.close) take('ledger', r, r.close, r.close.open);
  for (const r of (ctx.SEASON_BACKFILL && ctx.SEASON_BACKFILL.rows) || []) if (r.close) take('backfill', r, r.close, r.close.open);
  for (const r of (ctx.SEASON_REPLAY && ctx.SEASON_REPLAY.rows) || []) take('replay', r, r, r.open);
  return { games: [...byId.values()], skip };
}

// ── scoring ─────────────────────────────────────────────────────────
function q1(games, T, pw = false) {
  let W = 0, Ec = 0, Eo = 0, V = 0, n = 0;
  for (const g of games) {
    const pc = pw ? g.pwClose : g.pClose, po = pw ? g.pwOpen : g.pOpen, mv = pc - po;
    if (mv === 0 || Math.abs(mv) < T) continue;
    const home = mv > 0, y = g.res();
    n++; W += home ? y : 1 - y; Ec += home ? pc : 1 - pc; Eo += home ? po : 1 - po; V += pc * (1 - pc);
  }
  const z = V ? (W - Ec) / Math.sqrt(V) : null, k = Ec !== Eo ? (W - Eo) / (Ec - Eo) : null, kse = Ec !== Eo ? Math.sqrt(V) / (Ec - Eo) : null;
  return { n, W, Ec, Eo, z, k, kse };
}
const f2 = (x, d = 2) => (x == null ? '—' : x.toFixed(d));
const row = (label, r) => `${label.padEnd(34)} n ${String(r.n).padStart(4)}  moved-to side won ${String(r.W).padStart(4)}  close said ${f2(r.Ec, 1).padStart(6)}  open said ${f2(r.Eo, 1).padStart(6)}  z(close) ${f2(r.z).padStart(5)}  k ${f2(r.k)} ± ${f2(r.kse)}`;

function slope(games) {   // OLS of (y_home − p_close) on move, every game
  const xs = games.map((g) => g.move), ys = games.map((g) => g.res() - g.pClose), n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  const b = sxy / sxx, a = my - b * mx; let sse = 0; for (let i = 0; i < n; i++) sse += (ys[i] - a - b * xs[i]) ** 2;
  return { n, b, se: Math.sqrt(sse / (n - 2) / sxx) };
}

function direction(g) {
  const favOpenHome = g.pOpen >= 0.5, favCloseHome = g.pClose >= 0.5;
  if (favOpenHome !== favCloseHome) return 'flipped the favourite';
  return (g.move > 0) === favOpenHome ? 'toward the favourite' : 'toward the underdog';
}

function q3(games, T) {   // 1 unit on the side the line moved away from, at its closing price
  let n = 0, won = 0, units = 0, be = 0;
  for (const g of games) {
    if (g.move === 0 || Math.abs(g.move) < T) continue;
    const fadeHome = g.move < 0, odds = fadeHome ? g.closeHome : g.closeAway, y = g.res(), hit = fadeHome ? y === 1 : y === 0;
    n++; be += 1 / dec(odds); if (hit) { won++; units += dec(odds) - 1; } else units -= 1;
  }
  return { n, won, units, roi: n ? units / n : null, be: n ? be / n : null };
}

function main() {
  const A = setA(), B = setB(), S = setSeason();
  const cnt = (gs, T) => gs.filter((g) => g.move !== 0 && Math.abs(g.move) >= T).length;
  console.log('Set A (2023-26, one book):', A.games.length, 'games; skipped', JSON.stringify(A.skip), '; books', JSON.stringify(A.books));
  console.log('Set B (2015-17, Opening vs median):', B.games.length, 'games; skipped', JSON.stringify(B.skip));
  console.log('This season:', S.games.length, 'games; skipped', JSON.stringify(S.skip));
  for (const [lab, gs] of [['A', A.games], ['B', B.games], ['season', S.games]]) console.log(`  ${lab}: |move| ≥ 5/8/12 pts: ${GRID.map((T) => cnt(gs, T)).join(' / ')}`);
  if (DRY) { console.log('\n--dry: no scores read.'); return; }

  console.log('\n== Q1 (decided): 8+ pt moves ==');
  const a = q1(A.games, T_MAIN), b = q1(B.games, T_MAIN);
  console.log(row('Set A 2023-26', a)); console.log(row('Set B 2015-17', b));
  const pass = a.z != null && b.z != null && a.z <= -2 && b.z <= -1;
  console.log(`Decision: ${pass ? 'PASS — overreaction (A z ≤ −2 and B z ≤ −1)' : 'FAIL'}${!pass && a.k != null && b.k != null && a.k >= 1 && b.k >= 1 ? ' — both k ≥ 1: the close was right or under-moved' : ''}`);

  console.log('\n== Q2 (described) ==');
  for (const [lab, gs] of [['A', A.games], ['B', B.games]]) {
    for (const T of GRID) console.log(row(`${lab} |move| ≥ ${T * 100}`, q1(gs, T)));
    console.log(row(`${lab} 8+, power no-vig`, q1(gs, T_MAIN, true)));
    for (const s of [...new Set(gs.map((g) => g.season))].sort()) console.log(row(`${lab} ${s} 8+`, q1(gs.filter((g) => g.season === s), T_MAIN)));
    for (const d of ['toward the favourite', 'toward the underdog', 'flipped the favourite']) console.log(row(`${lab} 8+ ${d}`, q1(gs.filter((g) => direction(g) === d), T_MAIN)));
    const s = slope(gs); console.log(`${lab} all games: slope of (y − close) on move ${f2(s.b, 3)} ± ${f2(s.se, 3)} (n ${s.n}; < 0 = overreaction)`);
  }

  console.log('\n== Q3 (described): fade 8+ moves at the closing price ==');
  for (const [lab, gs] of [['A', A.games], ['B', B.games]]) { const r = q3(gs, T_MAIN); console.log(`${lab}: n ${r.n}, won ${r.won} (${f2(100 * r.won / r.n, 1)}% vs break-even ${f2(100 * r.be, 1)}%), ${r.units >= 0 ? '+' : ''}${f2(r.units)} units, return ${f2(100 * r.roi, 1)}%`); }

  console.log('\n== Q4 (described, never decided): this season ==');
  for (const T of GRID) console.log(row(`season |move| ≥ ${T * 100}`, q1(S.games, T)));
  const r3 = q3(S.games, T_MAIN); console.log(`season fade 8+: n ${r3.n}, won ${r3.won}, ${f2(r3.units)} units`);
}

main();
