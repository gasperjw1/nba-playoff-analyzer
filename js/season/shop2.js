// ============================================================
// PRICE TRACKER FOR OUR TICKETS — spec shop-2 (SHOP2_SPEC.md, frozen 2026-11-26)
// ============================================================
// Each night's tickets and legs (pitch-1 edge, pitch-2, pitch-3 straights and pair,
// flat-1, fade-1) checked against the ten books the odds-2 line call stores:
//   fair      Pinnacle's no-vig chance (power method) when its line is usable, else the
//             median power no-vig of ≥3 usable books other than FanDuel and DraftKings
//   price     the better of FanDuel and DraftKings (a parlay: the one book that pays more
//             for every leg); EV = fair × decimal − 1
//   skip      a straight under −4% EV; a parlay under −4% a leg
//   picks     any side on the night's ledger at +1% to +10% EV (shop-1's flag band)
// Usable lines follow shop-1 (_shopNoVig). A tracker of prices, not a picker; never a
// stake size. The odds ledger stays local; only aggregate records leave this file.
//
// Uses (globals): shopBooks, _shopNoVig, _shopDecimal, _shopImplied, _shopMedian (shop.js),
// pitch3Tonight, SEASON_PITCH3_SPEC (pitch3.js), flatLedgerBets, flatFavInRule,
// SEASON_FLAT_SPEC (flat.js), fadeTonight, SEASON_FADE_SPEC (fade.js), parlayAmerican (parlay.js).
// ============================================================
const SEASON_SHOP2_SPEC = { version: 'shop-2', frozen: '2026-11-26', firstNight: '2026-11-27', yours: ['fanduel', 'draftkings'],
  minOthers: 3, skipStraight: -0.04, skipPerLeg: -0.04, pickLo: 0.01, pickHi: 0.10, readAt: 150 };

// The chance of the first side, power de-vig (the vig falls mostly on the underdog).
function _shop2Power(a, b) {
  const x = _shopImplied(a), y = _shopImplied(b); let lo = 1, hi = 3;
  for (let i = 0; i < 60; i++) { const k = (lo + hi) / 2; if (x ** k + y ** k > 1) lo = k; else hi = k; }
  return x ** ((lo + hi) / 2);
}

// A priced game's fair home chance → {p, src} or null.
function shop2Fair(row) {
  const S = SEASON_SHOP2_SPEC, all = shopBooks(row), ok = (k) => all[k] && _shopNoVig(all[k]) != null;
  if (ok('pinnacle')) return { p: _shop2Power(all.pinnacle.home, all.pinnacle.away), src: 'pinnacle' };
  const others = Object.keys(all).filter(k => !S.yours.includes(k) && ok(k));
  if (others.length < S.minOthers) return null;
  return { p: _shopMedian(others.map(k => _shop2Power(all[k].home, all[k].away))), src: `median of ${others.length}` };
}

// One side of a priced game: FanDuel's and DraftKings' usable prices, the tracker's (better of the two;
// a tie goes to FanDuel), the fair chance and the EV at the tracker's price.
function shop2Side(row, side) {
  if (!row) return null;
  const all = shopBooks(row), at = (k) => (all[k] && _shopNoVig(all[k]) != null ? all[k][side] : null);
  const fd = at('fanduel'), dk = at('draftkings'), f = shop2Fair(row);
  let best = null, book = null;
  if (fd != null || dk != null) {
    if (dk == null || (fd != null && _shopDecimal(fd) >= _shopDecimal(dk))) { best = fd; book = 'fanduel'; } else { best = dk; book = 'draftkings'; }
  }
  const fair = f ? (side === 'home' ? f.p : 1 - f.p) : null;
  return { fd, dk, best, book, fair, fairSrc: f ? f.src : null, ev: fair != null && best != null ? fair * _shopDecimal(best) - 1 : null };
}

// A bet ({kind: 'straight'|'parlay', legs: [{row, side}]}) → its tracker price, book, EV and verdict.
// A leg without a priced odds row leaves the bet unchecked (verdict 'unpriced').
function shop2Check(bet) {
  const S = SEASON_SHOP2_SPEC;
  const sides = bet.legs.map(l => shop2Side(l.row, l.side));
  if (sides.some(s => !s || s.fair == null)) return { verdict: 'unpriced', price: null, book: null, ev: null, fair: null };
  const fair = sides.reduce((s, x) => s * x.fair, 1);
  let dec = null, book = null;
  if (bet.kind === 'straight') { if (sides[0].best != null) { dec = _shopDecimal(sides[0].best); book = sides[0].book; } }
  else {
    const prod = (k) => (sides.every(x => x[k] != null) ? sides.reduce((s, x) => s * _shopDecimal(x[k]), 1) : null);
    const dFd = prod('fd'), dDk = prod('dk');
    if (dFd != null || dDk != null) { if (dDk == null || (dFd != null && dFd >= dDk)) { dec = dFd; book = 'fanduel'; } else { dec = dDk; book = 'draftkings'; } }
  }
  if (dec == null) return { verdict: 'unpriced', price: null, book: null, ev: null, fair: +fair.toFixed(4) };
  const ev = fair * dec - 1, floor = bet.kind === 'straight' ? S.skipStraight : S.skipPerLeg * bet.legs.length;
  return { verdict: ev < floor ? 'skip' : 'play', price: parlayAmerican(dec), book, ev: +ev.toFixed(4), evRaw: ev, fair: +fair.toFixed(4) };
}

// Our bets for one night, from the ledgers (the same sets the trackers count).
function shop2NightBets(date, rows, pitchRows, pitch2Rows) {
  const day = (rows || []).filter(r => r.date === date), byId = new Map(day.map(r => [String(r.id), r]));
  const leg = (game, side, odds) => { const row = byId.get(String(game)) || null; return { game: String(game), side, odds, team: row ? (side === 'home' ? row.home : row.away) : String(game), row }; };
  const out = [];
  const p1 = (pitchRows || []).find(p => p.date === date), p2 = (pitch2Rows || []).find(p => p.date === date);
  for (const t of (p1 && p1.tickets) || []) if (t.recipe === 'edge' && t.status === 'pitched')
    out.push({ tracker: 'pitch-1 edge', kind: 'parlay', price0: t.price, legs: t.legs.map(l => leg(l.game, l.side, l.odds)) });
  if (p2 && p2.ticket && p2.ticket.status === 'pitched')
    out.push({ tracker: 'pitch-2 favourites', kind: 'parlay', price0: p2.ticket.price, legs: p2.ticket.legs.map(l => leg(l.game, l.side, l.odds)) });
  if (date >= SEASON_PITCH3_SPEC.firstNight) {
    const p3 = pitch3Tonight(day, date);
    for (const l of p3.legs) out.push({ tracker: 'pitch-3 straights', kind: 'straight', price0: l.odds, legs: [leg(l.gameId, l.side, l.odds)] });
    if (p3.pair) out.push({ tracker: 'pitch-3 pairs', kind: 'parlay', price0: p3.pair.odds, legs: p3.pair.legs.map(l => leg(l.gameId, l.side, l.odds)) });
  }
  if (date >= SEASON_FLAT_SPEC.firstNight)
    for (const b of flatLedgerBets(day).filter(b => flatFavInRule(b.odds))) out.push({ tracker: 'flat-1 favourites', kind: 'straight', price0: b.odds, legs: [leg(b.gameId, b.side, b.odds)] });
  if (date >= SEASON_FADE_SPEC.firstNight)
    for (const b of fadeTonight(day, date)) out.push({ tracker: 'fade-1', kind: 'straight', price0: b.odds, legs: [leg(b.gameId, b.side, b.odds)] });
  return out;
}

const _shop2Hit = (r, side) => (r && r.result && r.result.homeScore != null ? (side === 'home') === (r.result.homeScore > r.result.awayScore) : null);

// One night checked: our bets with verdicts, and the tracker's own picks. oddsLedger: {games: {espnId: row}}.
function shop2Night(date, rows, pitchRows, pitch2Rows, oddsLedger) {
  const S = SEASON_SHOP2_SPEC, odds = (oddsLedger && oddsLedger.games) || {};
  const priced = (id) => { const o = odds[String(id)]; return o && o.books ? o : null; };
  const bets = shop2NightBets(date, rows, pitchRows, pitch2Rows).map(b => {
    const c = shop2Check({ kind: b.kind, legs: b.legs.map(l => ({ row: priced(l.game), side: l.side })) });
    const hits = b.legs.map(l => _shop2Hit(l.row, l.side));
    return { ...b, legs: b.legs.map(({ row, ...l }) => l), ...c, hit: hits.some(h => h === false) ? false : hits.every(h => h === true) ? true : null };
  });
  const picks = [];
  for (const r of (rows || []).filter(x => x.date === date)) {
    const o = priced(r.id); if (!o) continue;
    for (const side of ['home', 'away']) {
      const s = shop2Side(o, side);
      if (s && s.ev != null && s.ev >= S.pickLo && s.ev <= S.pickHi)
        picks.push({ game: String(r.id), side, team: side === 'home' ? r.home : r.away, price: s.best, book: s.book, ev: +s.ev.toFixed(4), fair: +s.fair.toFixed(4), hit: _shop2Hit(r, side) });
    }
  }
  return { date, bets, picks };
}

// The record for --settle and the page, from firstNight: our bets at the recorded price, at the tracker's
// price, and with the skip rule; the picks; mean EV; the read at readAt checked bets.
function seasonShop2Summary(rows, pitchRows, pitch2Rows, oddsLedger, opts) {
  const S = SEASON_SHOP2_SPEC, from = (opts && opts.from) || S.firstNight;
  const dates = [...new Set((rows || []).map(r => r.date))].filter(d => d >= from).sort();
  const nights = dates.map(d => shop2Night(d, rows, pitchRows, pitch2Rows, oddsLedger));
  const u = (american, hit) => (hit ? _shopDecimal(american) - 1 : -1);
  const all = nights.flatMap(n => n.bets.map(b => ({ ...b, date: n.date })));
  const g = all.filter(b => b.hit != null), checked = g.filter(b => b.verdict !== 'unpriced');
  const sum = (bs, k) => bs.reduce((s, b) => s + u(b[k] != null ? b[k] : b.price0, b.hit), 0);
  const rec = (bs, k) => ({ n: bs.length, units: +sum(bs, k).toFixed(2), roi: bs.length ? +(sum(bs, k) / bs.length).toFixed(4) : null });
  const played = checked.filter(b => b.verdict === 'play'), mean = (xs) => (xs.length ? +(xs.reduce((s, x) => s + x, 0) / xs.length).toFixed(4) : null);
  const pk = nights.flatMap(n => n.picks).filter(p => p.hit != null);
  return {
    nights: nights.length, bets: all.length, graded: g.length, checked: checked.length,
    recorded: rec(checked, 'price0'), tracker: rec(checked, 'price'), withSkips: rec(played, 'price'),
    skipped: { n: checked.length - played.length, won: checked.filter(b => b.verdict === 'skip' && b.hit).length },
    ev: { tracker: mean(checked.map(b => b.ev)), played: mean(played.map(b => b.ev)) },
    picks: { n: pk.length, won: pk.filter(p => p.hit).length, units: +pk.reduce((s, p) => s + u(p.price, p.hit), 0).toFixed(2) },
    read: checked.length < S.readAt ? `${checked.length} of ${S.readAt} checked bets` : 'read: compare the tracker price with the recorded one and the skip rule\'s EV',
  };
}

// The --odds block: tonight's bets with the tracker's book, price, EV and verdict.
function shop2Lines(date, rows, pitchRows, pitch2Rows, oddsLedger) {
  const n = shop2Night(date, rows, pitchRows, pitch2Rows, oddsLedger), ev = (x) => (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%';
  const lab = (k) => (k === 'fanduel' ? 'FanDuel' : k === 'draftkings' ? 'DraftKings' : '—');
  const sg = (x) => (x > 0 ? '+' : '') + x;
  const out = n.bets.map(b => `  shop-2 ${b.tracker}: ${b.legs.map(l => l.team).join(' + ')} recorded ${b.price0 != null ? sg(b.price0) : '—'} · ` +
    (b.verdict === 'unpriced' ? 'not checked (no multi-book line yet)' : `${lab(b.book)} ${sg(b.price)} · EV ${ev(b.ev)} · ${b.verdict.toUpperCase()}`));
  for (const p of n.picks) out.push(`  shop-2 pick: ${p.team} ${sg(p.price)} at ${lab(p.book)} (EV ${ev(p.ev)}, fair ${(p.fair * 100).toFixed(1)}%)`);
  return out;
}
