// ============================================================
// FLAT MONEYLINES — spec flat-1 (FLAT_SPEC.md): $25 straight bets
// ============================================================
// What a flat $25 straight bet on every moneyline priced above −300
// would have made, tracked three ways from data already collected:
//   ledger   every game's market favourite at −299 to −100, at the
//            DraftKings price recorded before tip (season-ledger.js),
//            and at its close; favourites at −300 or heavier beside it
//   yours    the user's own legs at the FanDuel price they took
//            (js/season/data/user-legs.js), graded from the ledger
//   pitch-2  the favourites ticket's legs as straight bets
// A tracker, not a model: nothing here picks a side. $25 is the user's
// own unit, kept as a constant; this never suggests a stake.
//
// Uses (globals): SEASON_PITCH2_SPEC (pitch2.js) when present.
// ============================================================
const SEASON_FLAT_SPEC = { version: 'flat-1', frozen: '2026-11-08', firstNight: '2026-11-09', stake: 25, above: -300 };

const _flatMl = (a) => typeof a === 'number' && isFinite(a) && Math.abs(a) >= 100;
const _flatImplied = (a) => a < 0 ? -a / (-a + 100) : 100 / (a + 100);
// Profit of one straight bet: the price's winnings on a hit, minus the stake on a miss.
function flatProfit(odds, hit, stake) {
  const s = stake == null ? SEASON_FLAT_SPEC.stake : stake;
  return hit ? s * (odds > 0 ? odds / 100 : 100 / -odds) : -s;
}
// In the rule: priced above −300 (−299 and up, plus money included).
const flatInRule = (odds) => _flatMl(odds) && odds > SEASON_FLAT_SPEC.above;
// The ledger's rule: a favourite in the rule, −299 to −100 (+100 on an even pick'em).
const flatFavInRule = (odds) => flatInRule(odds) && (odds < 0 || odds === 100);

// Totals for a list of bets {odds, hit}: hit null = not graded yet (counted as open).
// beWins = the wins the prices need to break even (sum of their implied chances, vig
// included); z = (won − beWins) / sd, the luck scale for this many bets.
function flatRecord(bets, stake) {
  const s = stake == null ? SEASON_FLAT_SPEC.stake : stake;
  let n = 0, won = 0, open = 0, be = 0, v = 0, profit = 0;
  for (const b of bets) {
    if (!_flatMl(b.odds)) continue;
    if (b.hit == null) { open++; continue; }
    const p = _flatImplied(b.odds);
    n++; won += b.hit ? 1 : 0; be += p; v += p * (1 - p); profit += flatProfit(b.odds, b.hit, s);
  }
  return { n, won, open, beWins: +be.toFixed(2), z: v > 0 ? +((won - be) / Math.sqrt(v)).toFixed(2) : null,
    staked: n * s, profit: +profit.toFixed(2), margin: n ? +(profit / (n * s)).toFixed(4) : null };
}

const _flatHit = (r, side) => !r.result || r.result.homeScore == null ? null
  : side === 'home' ? r.result.homeScore > r.result.awayScore : r.result.awayScore > r.result.homeScore;

// One bet per ledger game: the favourite at the recorded price (a pick'em counts the home
// side, as in pitch-2), with its close (same side) when the row has one.
function flatLedgerBets(rows) {
  const out = [];
  for (const r of rows || []) {
    if (!_flatMl(r.mlHome) || !_flatMl(r.mlAway)) continue;
    const side = _flatImplied(r.mlHome) >= _flatImplied(r.mlAway) ? 'home' : 'away';
    const c = r.close || {};
    const close = side === 'home' ? c.mlHome : c.mlAway;
    out.push({ date: r.date, gameId: r.id, team: side === 'home' ? r.home : r.away, side,
      odds: side === 'home' ? r.mlHome : r.mlAway, close: _flatMl(close) ? close : null, hit: _flatHit(r, side) });
  }
  return out;
}

// The user's legs graded from the ledger by game id (open until that row settles).
function flatUserBets(legs, rows) {
  const byId = new Map((rows || []).map(r => [String(r.id), r]));
  return (legs || []).map(l => { const r = byId.get(String(l.gameId)); return { ...l, hit: r ? _flatHit(r, l.side) : null }; });
}

// pitch-2 legs as straight bets, from its first judged night.
function flatPitch2Bets(rows) {
  const S = typeof SEASON_PITCH2_SPEC !== 'undefined' ? SEASON_PITCH2_SPEC : null;
  if (!S) return [];
  const out = [];
  for (const r of rows || []) {
    if (r.spec !== S.version || r.date < S.firstNight || !r.ticket || r.ticket.status !== 'pitched') continue;
    for (const l of r.ticket.legs) {
      const o = l.result && l.result.outcome;
      if (o === 'void') continue;
      out.push({ date: r.date, team: l.team, odds: l.odds, hit: o === 'hit' ? true : o === 'miss' ? false : null });
    }
  }
  return out;
}

// Everything the page and --settle show; the ledger's clean line counts from firstNight.
function seasonFlatSummary(ledgerRows, userLegs, pitch2Rows) {
  const S = SEASON_FLAT_SPEC;
  const led = flatLedgerBets(ledgerRows);
  const inRule = (b) => flatFavInRule(b.odds);
  const heavy = (b) => _flatMl(b.odds) && b.odds <= S.above;
  const atClose = (bs) => flatRecord(bs.filter(b => b.close != null).map(b => ({ odds: b.close, hit: b.hit })));
  const clean = led.filter(b => b.date >= S.firstNight);
  const yours = flatUserBets(userLegs, ledgerRows);
  const p2 = flatPitch2Bets(pitch2Rows);
  return {
    ledger: {
      clean: flatRecord(clean.filter(inRule)), cleanClose: atClose(clean.filter(inRule)),
      all: flatRecord(led.filter(inRule)), allClose: atClose(led.filter(inRule)),
      heavyClean: flatRecord(clean.filter(heavy)), heavyAll: flatRecord(led.filter(heavy)),
      first: led.length ? led.reduce((a, b) => b.date < a ? b.date : a, led[0].date) : null,
    },
    yours: {
      rule: flatRecord(yours.filter(b => flatInRule(b.odds))),
      favs: flatRecord(yours.filter(b => flatInRule(b.odds) && b.odds < 0)),
      dogs: flatRecord(yours.filter(b => _flatMl(b.odds) && b.odds > 0)),
      heavy: flatRecord(yours.filter(heavy)),
      all: flatRecord(yours),
    },
    pitch2: { rule: flatRecord(p2.filter(b => flatInRule(b.odds))), all: flatRecord(p2) },
  };
}

// Tonight's ledger-rule bets from a slate: each game's favourite priced −299 to −100.
function flatTonight(slate) {
  const out = [];
  for (const g of (slate && slate.games) || []) {
    const m = g.market || {};
    if (!_flatMl(m.mlHome) || !_flatMl(m.mlAway)) continue;
    const home = _flatImplied(m.mlHome) >= _flatImplied(m.mlAway);
    const odds = home ? m.mlHome : m.mlAway;
    if (!flatFavInRule(odds)) continue;
    out.push({ game: g.id, matchup: `${g.away} @ ${g.home}`, team: home ? g.home : g.away, opp: home ? g.away : g.home, odds, tip: g.tip || null });
  }
  return out;
}
