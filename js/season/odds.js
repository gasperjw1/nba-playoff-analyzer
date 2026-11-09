// ============================================================
// FANDUEL ODDS — spec odds-1: one pull per game, after its injury report
// ============================================================
// The Odds API (paid plan, 20,000 credits a month) priced once per game, in
// the hour before tip (after the last injury report the replay's model
// reads, ~60 min out). `node fetch-slate.js --odds` does the IO
// (odds-pull.js); this file is the pure part, so the guards are testable:
//   - a market is requested only while it is missing for that game, and a
//     stored market is never overwritten — no game is paid for twice
//   - lines (moneyline, spread) come from one slate-wide call (cost = markets,
//     however many games); props from one call per game (cost = markets the
//     reply holds; an empty reply is free)
//   - at most SEASON_ODDS_SPEC.tries requests per market, so a market FanDuel
//     never posts stops costing
//   - at most SEASON_ODDS_SPEC.maxPerGame credits per game: a request that could
//     go past it is trimmed (alternate PRA first) or left out
//   - the model's chance at the same moment is stored beside each price
// A tracker of prices, not a picker. The key lives in ODDS_API_KEY only.
//
// Uses (globals): REPLAY_TEAM_BY_NAME (replay-core.js), probOver (props.js),
// _propNameKey (props-ledger.js).
// ============================================================
const SEASON_ODDS_SPEC = {
  version: 'odds-1', frozen: '2026-11-08', sport: 'basketball_nba', book: 'fanduel',
  windowMin: 60,          // a game is due once its tip is at most this many minutes away
  tries: 3,               // requests per market before it is left missing
  maxPerGame: 10,         // credits one game may ever be charged (a shared line call counts in full for each game in it)
  minRemaining: 5000,     // credits never spent below this floor (a quarter of the plan, kept in reserve)
  lines: ['h2h', 'spreads'],
  props: ['player_points', 'player_rebounds', 'player_assists', 'player_points_rebounds_assists',
    'player_threes', 'player_points_rebounds_assists_alternate'],
};
// The once-a-day ladder pull (`--record`, approved 2026-11-09): FanDuel's alternate PRA ladder for
// every game still to tip, so each game's ladder is collected whether or not its hour-before run
// happens. Same ledger, caps and floor; the hour-before pull then skips the stored market. A
// missing ladder counts no try here (an empty reply is free), so an early record cannot use up
// the hour-before pull's tries.
const SEASON_ODDS_LADDER_SPEC = { ...SEASON_ODDS_SPEC, windowMin: 24 * 60, lines: [], props: ['player_points_rebounds_assists_alternate'], ladder: true };
const SEASON_ODDS_STAT = {
  player_points: 'pts', player_rebounds: 'reb', player_assists: 'ast', player_points_rebounds_assists: 'pra',
  player_points_rebounds_assists_alternate: 'pra', player_threes: 'tpm',
};

const _oddsTip = (g) => new Date(g.tip).getTime();
const _oddsMissing = (row, keys, S) => keys.filter(k => !(row && row.markets && row.markets[k]) && ((row && row.tries && row.tries[k]) || 0) < S.tries);

// games: [{id, tip, home, away}] (tonight, not yet tipped); ledger: {games: {id: row}}.
// → [{game, lines: [missing line markets], props: [missing prop markets]}] for games
// tipping in (now, now + windowMin] with anything still to request, within the game's credit
// cap: each market costs at most 1, the lines (one call) go in whole or not at all, then props
// in spec order until the cap (alternate PRA, last, is the first left out).
function oddsDueGames(games, ledger, now, spec) {
  const S = spec || SEASON_ODDS_SPEC;
  const out = [];
  for (const g of games || []) {
    const t = _oddsTip(g);
    if (!(t > now && t <= now + S.windowMin * 60e3)) continue;
    const row = ledger && ledger.games ? ledger.games[String(g.id)] : null;
    let budget = S.maxPerGame - ((row && row.credits) || 0);
    let lines = _oddsMissing(row, S.lines, S);
    if (lines.length > budget) lines = [];
    budget -= lines.length;
    const props = _oddsMissing(row, S.props, S).slice(0, Math.max(0, budget));
    if (lines.length || props.length) out.push({ game: g, lines, props });
  }
  return out;
}

// When to run for the rest of tonight, fewest runs first: a run covers a group of pending tips
// when some moment is inside every one of their windows — from the last tip's window opening
// to the first tip. → [{from, to, games: [{id, home, away, tip}]}] (run at any time in [from, to)).
function oddsRunPlan(games, ledger, now, spec) {
  const S = spec || SEASON_ODDS_SPEC, w = S.windowMin * 60e3;
  const pending = (games || []).filter(g => _oddsTip(g) > now && oddsDueGames([g], ledger, _oddsTip(g) - 1, S).length)
    .sort((a, b) => _oddsTip(a) - _oddsTip(b));
  const runs = [];
  for (const g of pending) {
    const last = runs[runs.length - 1];
    if (last && _oddsTip(g) - w < last.to) { last.games.push(g); last.from = Math.max(now, _oddsTip(g) - w); continue; }
    runs.push({ from: Math.max(now, _oddsTip(g) - w), to: _oddsTip(g), games: [g] });
  }
  return runs;
}

// The most a run can cost: the slate-wide line call (its markets, once) plus each game's props.
function oddsEstimate(due) {
  const lines = new Set((due || []).flatMap(d => d.lines));
  return lines.size + (due || []).reduce((s, d) => s + d.props.length, 0);
}

// Odds API events → our games, by team names (REPLAY_TEAM_BY_NAME) and a tip within 6 hours.
// → Map(gameId → event).
function oddsMatchEvents(games, events) {
  const out = new Map();
  for (const g of games || []) {
    const e = (events || []).find(x => REPLAY_TEAM_BY_NAME[x.home_team] === g.home && REPLAY_TEAM_BY_NAME[x.away_team] === g.away &&
      Math.abs(new Date(x.commence_time).getTime() - _oddsTip(g)) <= 6 * 3600e3);
    if (e) out.set(String(g.id), e);
  }
  return out;
}

// One event's markets at one bookmaker → {key: {lastUpdate, outcomes}}.
function oddsBookMarkets(event, book) {
  const b = ((event && event.bookmakers) || []).find(x => x.key === book);
  const out = {};
  for (const m of (b && b.markets) || []) {
    out[m.key] = { lastUpdate: m.last_update || b.last_update || null,
      outcomes: (m.outcomes || []).map(o => ({ name: o.name, description: o.description == null ? null : o.description, point: o.point == null ? null : o.point, price: o.price })) };
  }
  return out;
}

// The model's chance of each outcome at pull time. model: {pHome, props: [prop rows]}.
// Lines: h2h by team; a spread is left unpriced (the engine's margin has no calibrated sd here).
// Props: Over / Under at the outcome's point, by player name; unmatched players stay null.
function _oddsPriceOutcomes(key, outcomes, g, model) {
  if (key === 'h2h' || key === 'spreads') {
    return outcomes.map(o => {
      const team = REPLAY_TEAM_BY_NAME[o.name] || null;
      const p = key === 'h2h' && model && model.pHome != null && team ? (team === g.home ? model.pHome : team === g.away ? 1 - model.pHome : null) : null;
      return { ...o, team, p: p == null ? null : +p.toFixed(4) };
    });
  }
  const stat = SEASON_ODDS_STAT[key];
  const byName = new Map(((model && model.props) || []).map(r => [_propNameKey(r.name), r]));
  return outcomes.map(o => {
    const r = o.description ? byName.get(_propNameKey(o.description)) : null;
    if (!r || o.point == null || !(o.name === 'Over' || o.name === 'Under')) return { ...o, player: r ? r.player : null, p: null };
    const pOver = probOver(r[stat], r.sd[stat], o.point);
    return { ...o, player: r.player, mean: r[stat], sd: r.sd[stat], p: +(o.name === 'Over' ? pOver : 1 - pOver).toFixed(4) };
  });
}

// Store the requested markets a reply holds, never overwriting one already stored; a requested
// market the reply lacks counts a try. model: the game's snapshot (see _oddsPriceOutcomes).
// → keys stored.
function oddsRecord(ledger, g, event, requested, markets, at, model, countTries) {
  ledger.games = ledger.games || {};
  const id = String(g.id);
  const row = ledger.games[id] = ledger.games[id] || { game: id, date: g.date || null, tip: g.tip, home: g.home, away: g.away, event: event ? event.id : null, markets: {}, tries: {} };
  const stored = [];
  for (const k of requested) {
    if (row.markets[k]) continue;
    const m = markets[k];
    if (countTries !== false || (m && m.outcomes.length)) row.tries[k] = (row.tries[k] || 0) + 1;
    if (!m || !m.outcomes.length) continue;
    row.markets[k] = { at, lastUpdate: m.lastUpdate, outcomes: _oddsPriceOutcomes(k, m.outcomes, g, model),
      model: model ? { pHome: model.pHome == null ? null : model.pHome, report: model.report || null, source: model.source || null, engine: model.engine || null } : null };
    stored.push(k);
  }
  return stored;
}

// Credits charged to a game (row.credits); a call without a cost header counts what it asked for.
function oddsCharge(ledger, gameId, credits) {
  const row = ledger.games && ledger.games[String(gameId)];
  if (row) row.credits = (row.credits || 0) + (credits || 0);
}

// Usage headers → {cost, used, remaining} (numbers, or null when absent).
function oddsUsage(headers) {
  const h = (k) => { const v = headers && (typeof headers.get === 'function' ? headers.get(k) : headers[k]); return v == null || v === '' ? null : +v; };
  return { cost: h('x-requests-last'), used: h('x-requests-used'), remaining: h('x-requests-remaining') };
}

// Never print the key: a URL or error message with apiKey=… is shown redacted.
const oddsRedact = (s) => String(s).replace(/apiKey=[^&\s]+/g, 'apiKey=REDACTED');

// A stored game's lines in our terms: {mlHome, mlAway, spreadHome, spreadPriceHome, spreadPriceAway}.
function oddsGameLines(row) {
  const h2h = row && row.markets && row.markets.h2h, sp = row && row.markets && row.markets.spreads;
  const side = (m, team) => m && m.outcomes.find(o => o.team === team);
  const hh = side(h2h, row.home), ha = side(h2h, row.away), sh = side(sp, row.home), sa = side(sp, row.away);
  return { mlHome: hh ? hh.price : null, mlAway: ha ? ha.price : null, spreadHome: sh ? sh.point : null,
    spreadPriceHome: sh ? sh.price : null, spreadPriceAway: sa ? sa.price : null };
}
