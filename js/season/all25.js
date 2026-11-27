// ============================================================
// $25 ON EVERY PARLAY AND LEG WE PITCHED — spec all25-1 (ALL25_SPEC.md, frozen 2026-11-27)
// ============================================================
// An accounting view of tickets that already exist, from the first pitched night (2026-11-08):
//   parlays  pitch-1 floor and edge, pitch-2 favourites, pitch-3 pairs (from 2026-11-16)
//   legs     every distinct leg of those parlays plus pitch-3's straights, once a night
//            (moneylines by game and side, props by player, stat and line)
// $25 each at the recorded price. Floor tickets and prop legs have no recorded price (FanDuel's
// ladder doesn't reach our floor lines), so they're shown at our own fair price for reference and
// never enter the dollar totals. Voids return the stake. Recorded nights make the total; backfilled
// nights (season-backfill.js) are shown apart. flat-1 and fade-1 keep their own records.
// Never a stake size.
//
// Uses (globals): flatProfit, _flatMl (flat.js), pitch3Tonight, SEASON_PITCH3_SPEC (pitch3.js).
// ============================================================
const SEASON_ALL25_SPEC = { version: 'all25-1', frozen: '2026-11-27', firstNight: '2026-11-08', stake: 25 };

const _a25Outcome = (o) => (o === 'hit' || o === 'win' ? true : o === 'miss' || o === 'loss' ? false : null);   // void/open → null
// The market's own (DraftKings no-vig) chance for a moneyline leg, and for a parlay the product over its
// legs. Display only: the "what the market expected" line on the Profit page; it changes no count.
const _a25Pm = (l) => (typeof l.pNoVig === 'number' ? l.pNoVig : typeof l.pMarket === 'number' ? l.pMarket : null);
const _a25PmAll = (legs) => (legs.length && legs.every(l => _a25Pm(l) != null) ? legs.reduce((s, l) => s * _a25Pm(l), 1) : null);
// Each moneyline leg's game, side and market chance, so the Profit page can simulate parlays and their
// legs on shared game outcomes (display only).
const _a25Keys = (legs) => legs.map(l => ({ game: String(l.game != null ? l.game : l.gameId), side: l.side, pm: _a25Pm(l) }));

// One night's bets: { date, source, parlays: [...], legs: [...] }. A bet: { kind, recipe, label, odds
// (American or null when unpriced), p (our chance, for unpriced bets), hit (true/false/null), void }.
function all25Night(date, source, pitch1Tickets, pitch2Ticket, p3) {
  const parlays = [], legs = [], seen = new Set();
  const addLeg = (recipe, l) => {
    const prop = l.type === 'prop';
    const key = prop ? `p|${l.player}|${l.stat}|${l.line}` : `m|${l.game}|${l.side}`;
    if (seen.has(key)) return;
    seen.add(key);
    const out = l.result ? l.result.outcome : null, hit = l.hit !== undefined ? l.hit : _a25Outcome(out);
    legs.push({ kind: 'leg', recipe, label: prop ? `${l.name} ${String(l.stat).toUpperCase()} over ${l.line}` : `${l.team} ${l.odds > 0 ? '+' : ''}${l.odds}`,
      odds: prop ? null : l.odds, p: prop ? l.p : null, pm: prop ? null : _a25Pm(l), keys: prop ? null : _a25Keys([l]), hit, void: out === 'void' });
  };
  for (const t of pitch1Tickets || []) {
    if (t.status !== 'pitched') continue;
    const out = t.result ? t.result.outcome : null;
    const live = (t.legs || []).filter(l => !(l.result && l.result.outcome === 'void'));
    parlays.push({ kind: 'parlay', recipe: t.recipe === 'floor' ? 'floor' : 'edge', label: (t.legs || []).map(l => l.type === 'prop' ? l.name : l.team).join(' + '),
      odds: t.recipe === 'floor' ? null : t.price, p: t.recipe === 'floor' ? live.reduce((s, l) => s * l.p, 1) : null, pm: t.recipe === 'floor' ? null : _a25PmAll(t.legs || []),
      keys: t.recipe === 'floor' ? null : _a25Keys(t.legs || []),
      hit: _a25Outcome(out), void: out === 'void' });
    for (const l of t.legs || []) addLeg(t.recipe === 'floor' ? 'floor' : 'edge', l);
  }
  if (pitch2Ticket && pitch2Ticket.status === 'pitched') {
    const out = pitch2Ticket.result ? pitch2Ticket.result.outcome : null;
    parlays.push({ kind: 'parlay', recipe: 'favourites', label: pitch2Ticket.legs.map(l => l.team).join(' + '), odds: pitch2Ticket.price, p: null, pm: _a25PmAll(pitch2Ticket.legs),
      keys: _a25Keys(pitch2Ticket.legs),
      hit: _a25Outcome(out), void: out === 'void' });
    for (const l of pitch2Ticket.legs) addLeg('favourites', l);
  }
  if (p3) {
    if (p3.pair) parlays.push({ kind: 'parlay', recipe: 'pitch-3 pair', label: p3.pair.legs.map(l => l.team).join(' + '), odds: p3.pair.odds, p: null,
      pm: typeof p3.pair.pMarket === 'number' ? p3.pair.pMarket : null, keys: _a25Keys(p3.pair.legs), hit: p3.pair.hit, void: false });
    for (const l of p3.legs) addLeg('pitch-3', { ...l, type: 'ml', game: l.gameId });
  }
  return { date, source, parlays, legs };
}

// Every night from firstNight: recorded nights from the ledgers, backfilled nights from SEASON_BACKFILL.
function all25Nights(rows, pitchRows, pitch2Rows, backfill) {
  const S = SEASON_ALL25_SPEC, out = [];
  const dates = [...new Set([...(pitchRows || []), ...(pitch2Rows || [])].map(p => p.date))].filter(d => d >= S.firstNight).sort();
  for (const d of dates) {
    const p1 = (pitchRows || []).find(p => p.date === d), p2 = (pitch2Rows || []).find(p => p.date === d);
    const p3 = d >= SEASON_PITCH3_SPEC.firstNight ? pitch3Tonight((rows || []).filter(r => r.date === d), d) : null;
    out.push(all25Night(d, 'live', p1 ? p1.tickets : [], p2 ? p2.ticket : null, p3));
  }
  for (const n of (backfill && backfill.nights) || []) {
    if (n.date < S.firstNight || dates.includes(n.date)) continue;
    out.push(all25Night(n.date, 'backfill', n.pitch1, n.pitch2, n.pitch3));
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

// Totals for a list of bets: priced bets in dollars; unpriced ones at our fair price, kept apart.
function all25Tally(bets) {
  const stake = SEASON_ALL25_SPEC.stake, t = { n: 0, won: 0, staked: 0, profit: 0, open: 0, expected: 0, expN: 0, unpriced: { n: 0, won: 0, atFair: 0 } };
  for (const b of bets) {
    if (b.void) continue;
    if (b.hit == null) { t.open++; continue; }
    if (b.odds == null || !_flatMl(b.odds)) {
      t.unpriced.n++; if (b.hit) t.unpriced.won++;
      if (b.p) t.unpriced.atFair += b.hit ? stake * (1 / b.p - 1) : -stake;
      continue;
    }
    t.n++; if (b.hit) t.won++; t.staked += stake; t.profit += flatProfit(b.odds, b.hit, stake);
    // What the market's own chances expected at the price taken (display only).
    if (b.pm != null) { t.expN++; t.expected += stake * (b.pm * (b.odds > 0 ? 1 + b.odds / 100 : 1 + 100 / -b.odds) - 1); }
  }
  t.profit = +t.profit.toFixed(2); t.unpriced.atFair = +t.unpriced.atFair.toFixed(2); t.expected = +t.expected.toFixed(2);
  t.roi = t.staked ? +(t.profit / t.staked).toFixed(4) : null;
  return t;
}

// How lucky the priced bets have been, if the market's own chances were right: simulate every game once
// (parlays and the legs inside them share outcomes), seeded so the page shows a stable number.
// → { n, games, actual, mean, sd, z, share } where share = the fraction of runs at or above the actual.
function all25Luck(nights, runs, seed) {
  const stake = SEASON_ALL25_SPEC.stake, bets = [], pHome = new Map();
  for (const n of nights) for (const b of n.parlays.concat(n.legs)) {
    if (b.void || b.hit == null || b.odds == null || !_flatMl(b.odds) || !b.keys || !b.keys.length || b.keys.some(k => k.pm == null)) continue;
    for (const k of b.keys) if (!pHome.has(k.game)) pHome.set(k.game, k.side === 'home' ? k.pm : 1 - k.pm);
    bets.push(b);
  }
  if (!bets.length) return { n: 0 };
  const dec = (a) => (a > 0 ? 1 + a / 100 : 1 + 100 / -a), pay = (b, won) => (won ? stake * (dec(b.odds) - 1) : -stake);
  const actual = bets.reduce((s, b) => s + pay(b, b.hit), 0);
  let st = (seed || 7) >>> 0; const rnd = () => ((st = (Math.imul(st, 1664525) + 1013904223) >>> 0) / 4294967296);
  const games = [...pHome.entries()], N = runs || 5000, totals = new Array(N);
  for (let i = 0; i < N; i++) {
    const homeWon = new Map(games.map(([g, p]) => [g, rnd() < p]));
    totals[i] = bets.reduce((s, b) => s + pay(b, b.keys.every(k => (k.side === 'home') === homeWon.get(k.game))), 0);
  }
  const mean = totals.reduce((s, x) => s + x, 0) / N, sd = Math.sqrt(totals.reduce((s, x) => s + (x - mean) ** 2, 0) / N);
  return { n: bets.length, games: games.length, actual: +actual.toFixed(2), mean: +mean.toFixed(2), sd: +sd.toFixed(2),
    z: sd ? +((actual - mean) / sd).toFixed(2) : null, share: totals.filter(x => x >= actual - 1e-9).length / N };
}

// The record: totals for recorded nights and backfilled nights, by kind and recipe, plus each night
// with its profit and the running profit over recorded nights.
function seasonAll25Summary(rows, pitchRows, pitch2Rows, backfill) {
  const nights = all25Nights(rows, pitchRows, pitch2Rows, backfill);
  const block = (ns) => {
    const parlays = ns.flatMap(n => n.parlays), legs = ns.flatMap(n => n.legs);
    const by = (bs) => Object.fromEntries([...new Set(bs.map(b => b.recipe))].map(r => [r, all25Tally(bs.filter(b => b.recipe === r))]));
    return { nights: ns.length, parlays: all25Tally(parlays), legs: all25Tally(legs), all: all25Tally(parlays.concat(legs)), parlaysBy: by(parlays), legsBy: by(legs) };
  };
  let run = 0;
  const perNight = nights.map(n => {
    const p = all25Tally(n.parlays), l = all25Tally(n.legs), profit = +(p.profit + l.profit).toFixed(2);
    if (n.source === 'live') run += profit;
    return { date: n.date, source: n.source, parlays: p, legs: l, profit, running: n.source === 'live' ? +run.toFixed(2) : null };
  });
  return { live: block(nights.filter(n => n.source === 'live')), backfill: block(nights.filter(n => n.source === 'backfill')), perNight, nights };
}
