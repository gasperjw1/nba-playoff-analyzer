// ============================================================
// PRICE CHECK — spec shop-1 (ODDS2_SPEC.md)
// ============================================================
// FanDuel's and DraftKings' moneylines against the consensus of the other
// books the odds-2 line call stores (row.books), from the research
// PRICE_SHOP_RESEARCH.md (the median no-vig price across books was calibrated
// on 2021-23 closes):
//   consensus  for a book's price, the median no-vig chance of the OTHER books
//              (leave-one-out), at least minOthers of them with usable lines
//   EV         fair chance × decimal price − 1
//   flag       the better of FanDuel and DraftKings at EV +1% to +10% (bigger
//              "edges" were mostly stale or broken lines in the research)
//   stale      a book's line last updated more than maxAgeMin before the pull
//              isn't used (Pinnacle's feed "may incur a delay")
// Graded from the game ledger's results and closes. A tracker of prices, not a
// picker; never a stake size.
//
// Uses (globals): oddsGameLines (odds.js).
// ============================================================
const SEASON_SHOP_SPEC = { version: 'shop-1', frozen: '2026-11-16', yours: ['fanduel', 'draftkings'], minOthers: 3, minHold: 0.01, maxAgeMin: 30, edge: 0.01, maxEdge: 0.10, readAt: 150 };
const SHOP_BOOK_LABEL = { fanduel: 'FanDuel', draftkings: 'DraftKings', williamhill_us: 'Caesars', betmgm: 'BetMGM', betrivers: 'BetRivers',
  espnbet: 'theScore', fanatics: 'Fanatics', hardrockbet: 'Hard Rock', lowvig: 'LowVig', pinnacle: 'Pinnacle' };

const _shopImplied = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100));
const _shopDecimal = (a) => (a > 0 ? 1 + a / 100 : 1 + 100 / -a);
const _shopMedian = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
// A book's home no-vig chance, or null when its line isn't usable: a price under ±100, vig under minHold,
// or (when both times are known) last updated more than maxAgeMin before the pull.
function _shopNoVig(h2h) {
  const S = SEASON_SHOP_SPEC;
  if (!h2h || typeof h2h.home !== 'number' || typeof h2h.away !== 'number' || Math.abs(h2h.home) < 100 || Math.abs(h2h.away) < 100) return null;
  if (h2h.at && h2h.lastUpdate && (Date.parse(h2h.at) - Date.parse(h2h.lastUpdate)) / 60e3 > S.maxAgeMin) return null;
  const h = _shopImplied(h2h.home), a = _shopImplied(h2h.away);
  return h + a - 1 < S.minHold ? null : h / (h + a);
}

// Every book's moneyline on a priced game: FanDuel from row.markets, the rest from row.books.
function shopBooks(row) {
  const out = {}, l = row && row.markets ? oddsGameLines(row) : null;
  const m = row && row.markets && row.markets.h2h;
  if (l && l.mlHome != null && l.mlAway != null) out.fanduel = { home: l.mlHome, away: l.mlAway, at: m.at || null, lastUpdate: m.lastUpdate || null };
  for (const [k, b] of Object.entries((row && row.books) || {})) if (b && b.h2h) out[k] = { home: b.h2h.home, away: b.h2h.away, at: b.at || null, lastUpdate: b.lastUpdate || null };
  return out;
}

// One game's price check → { books, fair, pinnacle, sides: { home|away: { fanduel, draftkings, best } }, flags },
// or null with fewer than minOthers + 1 usable books.
function shopPrices(row) {
  const S = SEASON_SHOP_SPEC, all = shopBooks(row), nv = {};
  for (const [k, b] of Object.entries(all)) { const p = _shopNoVig(b); if (p != null) nv[k] = p; }
  const usable = Object.keys(nv);
  if (usable.length < S.minOthers + 1) return null;
  const sides = {}, flags = [];
  for (const side of ['home', 'away']) {
    const at = {};
    for (const k of S.yours) {
      if (nv[k] == null) { at[k] = null; continue; }
      const others = usable.filter(x => x !== k).map(x => nv[x]);
      if (others.length < S.minOthers) { at[k] = null; continue; }
      const pf = _shopMedian(others), p = side === 'home' ? pf : 1 - pf, ml = all[k][side], ev = p * _shopDecimal(ml) - 1;
      at[k] = { ml, p: +p.toFixed(4), ev: +ev.toFixed(4), evRaw: ev };
    }
    const cands = S.yours.filter(k => at[k]).map(k => ({ book: k, ...at[k] })).sort((a, b) => b.evRaw - a.evRaw);
    at.best = cands[0] || null;
    sides[side] = at;
    // The flag is decided on the unrounded EV; the stored ev is rounded to 4 decimals for display.
    if (at.best && at.best.evRaw >= S.edge && at.best.evRaw <= S.maxEdge) { const { evRaw, ...b } = at.best; flags.push({ side, team: side === 'home' ? row.home : row.away, ...b }); }
  }
  const fair = _shopMedian(usable.map(k => nv[k]));
  return { books: usable.length, fair: +fair.toFixed(4), pinnacle: nv.pinnacle != null ? +nv.pinnacle.toFixed(4) : null, sides, flags };
}

// One line for the --odds output.
function shopLine(row) {
  const c = shopPrices(row), pc = (p) => (p * 100).toFixed(1) + '%', sg = (x) => (x > 0 ? '+' : '') + x, ev = (x) => (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%';
  if (!c) return `price check (shop-1): fewer than ${SEASON_SHOP_SPEC.minOthers + 1} books with usable lines`;
  const side = (s) => { const a = c.sides[s], t = s === 'home' ? row.home : row.away;
    return `${t} ${['fanduel', 'draftkings'].map(k => a[k] ? `${k === 'fanduel' ? 'FD' : 'DK'} ${sg(a[k].ml)} ${ev(a[k].ev)}` : `${k === 'fanduel' ? 'FD' : 'DK'} —`).join(', ')}`; };
  return `price check (shop-1): consensus ${row.home} ${pc(c.fair)} over ${c.books} books${c.pinnacle != null ? ` (Pinnacle ${pc(c.pinnacle)})` : ''} · ${side('away')} · ${side('home')} · ` +
    (c.flags.length ? `FLAG ${c.flags.map(f => `${f.team} ${sg(f.ml)} at ${SHOP_BOOK_LABEL[f.book]} (EV ${ev(f.ev)}, fair ${pc(f.p)})`).join('; ')}` : 'no flag');
}

// Flagged sides across the odds ledger, graded from the game ledger (by ESPN game id): hit, and the
// line's move = closing no-vig chance for the side (the ledger's close) − the consensus fair at pull.
function shopLegs(oddsLedger, rows) {
  const byId = new Map((rows || []).map(r => [String(r.id), r]));
  const out = [];
  for (const row of Object.values((oddsLedger && oddsLedger.games) || {})) {
    if (!row.books) continue;
    const c = shopPrices(row);
    if (!c) continue;
    const r = byId.get(String(row.game)), res = r && r.result && r.result.homeScore != null ? r.result : null, cl = r && r.close;
    const closeHome = cl && typeof cl.mlHome === 'number' && typeof cl.mlAway === 'number' ? _shopNoVig({ home: cl.mlHome, away: cl.mlAway }) : null;
    for (const f of c.flags) {
      const hit = res ? (f.side === 'home' ? res.homeScore > res.awayScore : res.awayScore > res.homeScore) : null;
      const pClose = closeHome == null ? null : f.side === 'home' ? closeHome : 1 - closeHome;
      out.push({ game: String(row.game), date: row.date, matchup: `${row.away} @ ${row.home}`, ...f, pClose: pClose == null ? null : +pClose.toFixed(4),
        move: pClose == null ? null : +(pClose - f.p).toFixed(4), closeBook: cl ? cl.book || null : null, hit });
    }
  }
  return out;
}

// The record for --settle: flagged sides against the consensus and at the price, the line's move, what the
// better of the two books saved over FanDuel alone, and the read at readAt graded flags.
function seasonShopSummary(oddsLedger, rows) {
  const S = SEASON_SHOP_SPEC, legs = shopLegs(oddsLedger, rows), g = legs.filter(l => l.hit != null);
  const won = g.filter(l => l.hit).length, exp = g.reduce((s, l) => s + l.p, 0), v = g.reduce((s, l) => s + l.p * (1 - l.p), 0);
  const ret = g.map(l => (l.hit ? _shopDecimal(l.ml) - 1 : -1)), m = ret.length ? ret.reduce((s, x) => s + x, 0) / ret.length : null;
  const se = ret.length > 1 ? Math.sqrt(ret.reduce((s, x) => s + (x - m) ** 2, 0) / (ret.length - 1) / ret.length) : null;
  const mv = legs.filter(l => l.move != null).map(l => l.move), mm = mv.length ? mv.reduce((s, x) => s + x, 0) / mv.length : null;
  const mse = mv.length > 1 ? Math.sqrt(mv.reduce((s, x) => s + (x - mm) ** 2, 0) / (mv.length - 1) / mv.length) : null;
  // Saving: every side with both books' EV, the better of the two against FanDuel alone.
  let fd = 0, best = 0, n = 0;
  for (const row of Object.values((oddsLedger && oddsLedger.games) || {})) {
    if (!row.books) continue;
    const c = shopPrices(row);
    if (!c) continue;
    for (const s of ['home', 'away']) { const a = c.sides[s]; if (a.fanduel && a.draftkings) { n++; fd += a.fanduel.ev; best += Math.max(a.fanduel.ev, a.draftkings.ev); } }
  }
  const z = v > 0 ? (won - exp) / Math.sqrt(v) : null;
  const read = g.length < S.readAt ? `${g.length} of ${S.readAt} graded flags`
    : z != null && z <= -2 ? 'retire: flagged sides fell short of the consensus (z ≤ −2)' : 'keep: no sign the flagged prices were traps';
  return { flags: legs.length, graded: g.length, won, expected: +exp.toFixed(2), z: z == null ? null : +z.toFixed(2),
    roi: m == null ? null : +m.toFixed(4), se: se == null ? null : +se.toFixed(4),
    move: { n: mv.length, mean: mm == null ? null : +mm.toFixed(4), se: mse == null ? null : +mse.toFixed(4) },
    saved: { n, fanduel: n ? +(fd / n).toFixed(4) : null, best: n ? +(best / n).toFixed(4) : null }, read };
}
