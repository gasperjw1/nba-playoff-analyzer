// ============================================================
// EDGE STRAIGHTS AND PAIR — spec pitch-3 (PITCH3_SPEC.md)
// ============================================================
// Moneylines where the model is 5+ points above DraftKings' no-vig price, as
// the ledger recorded them before tip:
//   straights  every such side, one bet each, in two tiers: 5–8 and 8+ points
//   pair       a 2-leg ticket of the night's two largest gaps (different games)
// pitch-1's edge ticket needed 2–3 legs of 8+ points; this asks whether the
// smaller gaps and simpler bets (bettable at FanDuel) hold up. A tracker over
// the game ledger's rows, like fade-1: nothing new is recorded. Graded at the
// DraftKings price recorded and at the close; the user's FanDuel prices go in
// user-legs.js (flat-1). Unproven; never a stake size.
//
// Uses (globals): flatRecord, _flatMl, _flatImplied (flat.js), _noVigHome
// (trust.js), parlayDecimal, parlayAmerican (parlay.js).
// ============================================================
const SEASON_PITCH3_SPEC = { version: 'pitch-3', frozen: '2026-11-15', firstNight: '2026-11-16', minEdge: 0.05, tier: 0.08, pairLegs: 2, readAt: 100 };

// The model's chance for the home side: with the official report when the row has it, else feed only.
const _p3Model = (r) => r.pOursReport != null ? r.pOursReport : r.pOurs;
const _p3Hit = (r, side) => !r.result || r.result.homeScore == null ? null
  : side === 'home' ? r.result.homeScore > r.result.awayScore : r.result.awayScore > r.result.homeScore;

// One ledger row → its edge leg, or null: no model or market chance, no prices, an AVOID game, or a gap
// under minEdge. Only one side of a game can be 5+ points over the market.
function pitch3Leg(r) {
  const S = SEASON_PITCH3_SPEC;
  const pm = r ? _p3Model(r) : null;
  if (pm == null || r.pMarket == null || !_flatMl(r.mlHome) || !_flatMl(r.mlAway)) return null;
  if (r.trust && r.trust.rule === 'AVOID') return null;
  const side = pm - r.pMarket >= S.minEdge - 1e-9 ? 'home' : r.pMarket - pm >= S.minEdge - 1e-9 ? 'away' : null;
  if (!side) return null;
  const h = side === 'home', c = r.close || {};
  const pModel = h ? pm : 1 - pm, pMarket = h ? r.pMarket : 1 - r.pMarket, edge = pModel - pMarket;
  const close = h ? c.mlHome : c.mlAway;
  const pClose = _flatMl(c.mlHome) && _flatMl(c.mlAway) && (!c.book || !r.book || String(c.book).toLowerCase() === String(r.book).toLowerCase())
    ? (h ? _noVigHome(c.mlHome, c.mlAway) : 1 - _noVigHome(c.mlHome, c.mlAway)) : null;
  const hours = r.tip && r.recordedAt ? (Date.parse(r.tip) - Date.parse(r.recordedAt)) / 36e5 : null;
  return { date: r.date, gameId: String(r.id), matchup: `${r.away} @ ${r.home}`, tip: r.tip || null, team: h ? r.home : r.away, opp: h ? r.away : r.home, side,
    tier: edge >= S.tier - 1e-9 ? '8+' : '5–8', pModel: +pModel.toFixed(4), pFeed: r.pOurs == null ? null : +(h ? r.pOurs : 1 - r.pOurs).toFixed(4),
    pMarket: +pMarket.toFixed(4), edge: +edge.toFixed(4), odds: h ? r.mlHome : r.mlAway, close: _flatMl(close) ? close : null,
    pClose: pClose == null ? null : +pClose.toFixed(4), hours: hours == null ? null : +hours.toFixed(1), source: r.source || null, hit: _p3Hit(r, side) };
}

// A night's pair from its legs: the two largest gaps (ties by the earlier tip). Null under two legs.
function pitch3Pair(legs) {
  const S = SEASON_PITCH3_SPEC;
  const top = [...legs].sort((a, b) => b.edge - a.edge || String(a.tip).localeCompare(String(b.tip))).slice(0, S.pairLegs);
  if (top.length < S.pairLegs) return null;
  const dec = top.reduce((s, l) => s * parlayDecimal(l.odds), 1);
  const decClose = top.every(l => l.close != null) ? top.reduce((s, l) => s * parlayDecimal(l.close), 1) : null;
  const hit = top.some(l => l.hit === false) ? false : top.every(l => l.hit === true) ? true : null;
  return { date: top[0].date, legs: top, pModel: +top.reduce((s, l) => s * l.pModel, 1).toFixed(4), pMarket: +top.reduce((s, l) => s * l.pMarket, 1).toFixed(4),
    odds: parlayAmerican(dec), close: decClose == null ? null : parlayAmerican(decClose), hit };
}

// Every leg in the ledger, in row order.
const pitch3Legs = (rows) => (rows || []).map(pitch3Leg).filter(Boolean);

// A night's legs and pair, from the rows recorded for it.
function pitch3Tonight(rows, date) {
  const legs = pitch3Legs((rows || []).filter(r => r.date === date));
  return { legs, pair: pitch3Pair(legs) };
}

// Against the market's own no-vig chances (are the gaps real at all, before the vig?): won vs the
// sum of pMarket, z on that scale. Graded bets only.
function _p3VsMarket(legs) {
  const g = legs.filter(l => l.hit != null);
  const exp = g.reduce((s, l) => s + l.pMarket, 0), v = g.reduce((s, l) => s + l.pMarket * (1 - l.pMarket), 0);
  const won = g.filter(l => l.hit).length;
  return { n: g.length, won, expected: +exp.toFixed(2), z: v > 0 ? +((won - exp) / Math.sqrt(v)).toFixed(2) : null };
}

// Line movement: the close's no-vig chance minus the recorded one, for legs with a same-book close.
function _p3Clv(legs) {
  const xs = legs.filter(l => l.pClose != null).map(l => l.pClose - l.pMarket);
  if (!xs.length) return { n: 0, mean: null, se: null };
  const m = xs.reduce((a, x) => a + x, 0) / xs.length;
  const se = xs.length > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1) / xs.length) : null;
  return { n: xs.length, mean: +m.toFixed(4), se: se == null ? null : +se.toFixed(4) };
}

// The record for the page and --settle. clean: from firstNight; before: the earlier ledger games (seen
// when the spec was written). Straights per tier and together: at the recorded price (flatRecord, z vs
// the vig's break-even), at the close, vs the market's no-vig chances, and line movement. Pairs: at the
// recorded price and the close, with the market's expected wins.
function seasonPitch3Summary(rows) {
  const S = SEASON_PITCH3_SPEC;
  const all = pitch3Legs(rows);
  const block = (legs) => {
    const one = (ls) => ({ price: flatRecord(ls), close: flatRecord(ls.filter(l => l.close != null).map(l => ({ odds: l.close, hit: l.hit }))),
      market: _p3VsMarket(ls), clv: _p3Clv(ls) });
    const dates = [...new Set(legs.map(l => l.date))];
    const pairs = dates.map(d => pitch3Pair(legs.filter(l => l.date === d))).filter(Boolean);
    const graded = pairs.filter(p => p.hit != null);
    return { all: one(legs), big: one(legs.filter(l => l.tier === '8+')), small: one(legs.filter(l => l.tier === '5–8')),
      pairs: { price: flatRecord(pairs), close: flatRecord(pairs.filter(p => p.close != null).map(p => ({ odds: p.close, hit: p.hit }))),
        expected: +graded.reduce((s, p) => s + p.pMarket, 0).toFixed(2) }, nights: dates.length };
  };
  const clean = block(all.filter(l => l.date >= S.firstNight));
  const n = clean.all.price.n, z = clean.all.market.z, zBe = clean.all.price.z;
  const read = n < S.readAt ? `${n} of ${S.readAt} settled straights`
    : z != null && z <= 0 ? 'retire: the straights did no better than the market expected'
    : zBe != null && zBe >= 2 ? 'edge: the straights beat the vig (z ≥ 2)' : 'keep logging: above the market, not yet past the vig';
  return { clean, before: block(all.filter(l => l.date < S.firstNight)), read };
}
