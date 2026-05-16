// ============================================================
// AUTO-RESOLVE — Tier 1.3
// ============================================================
// Pure functions that compute a bet's outcome from box-score data,
// so a stale-result mismatch surfaces at boot and a freshly-played
// game can have its bets reconciled without hand-edits.
//
// Scope: ml, spread, total, and "Player Over/Under N stat" props.
// Out of scope: parlays, props with conditional language ("if playing"
// or "(VOID)"), and pick strings that don't match the regexes below.
// Anything we can't parse returns null — explicit "I don't know" is
// safer than guessing.

const RESOLVE_STAT_MAP = {
  pt:'pts', pts:'pts', point:'pts', points:'pts',
  reb:'reb', rebs:'reb', rebound:'reb', rebounds:'reb',
  ast:'ast', asts:'ast', assist:'ast', assists:'ast',
  stl:'stl', stls:'stl', steal:'stl', steals:'stl',
  blk:'blk', blks:'blk', block:'blk', blocks:'blk',
  three:'threes', threes:'threes', '3pm':'threes', '3pt':'threes',
  // PHASE 60 (May 14, 2026): additional safe-bet prop types.
  // Turnovers — Cade had 8 TOs in DET-CLE G3; high-usage guards
  // average 3-5 in playoff games.
  to:'to', tos:'to', turnover:'to', turnovers:'to',
  // Composite props — computed from box score fields, not raw lookups.
  // These get special handling in resolveProp below.
  pra:'pra',           // pts + reb + ast
  pr:'pr',             // pts + reb
  pa:'pa',             // pts + ast
  stocks:'stocks',     // stl + blk ("stocks")
  'stl+blk':'stocks',
};

// "SGA" / "LeBron" / "Cade" don't appear in box scores under those
// nicknames — map to a substring we can find in the canonical name.
const PLAYER_ALIAS_MAP = {
  'sga':'gilgeous',
  'lebron':'james',
  'cade':'cunningham',
  'kd':'durant',
  'ant':'edwards',
};

function _normalizeStat(s) {
  return RESOLVE_STAT_MAP[String(s || '').toLowerCase()] || null;
}

function _findGameContext(SERIES_DATA, seriesId, gameNum) {
  if (!Array.isArray(SERIES_DATA)) return null;
  const series = SERIES_DATA.find(s => s.id === seriesId);
  if (!series || !Array.isArray(series.games)) return null;
  const game = series.games[gameNum - 1];
  if (!game || !game.winner || game.homeScore == null || game.awayScore == null) return null;
  return { series, game };
}

function _findPlayer(boxScores, displayName) {
  if (!boxScores) return null;
  const all = []
    .concat(Array.isArray(boxScores.home) ? boxScores.home : [])
    .concat(Array.isArray(boxScores.away) ? boxScores.away : []);
  if (!all.length) return null;

  const cleaned = displayName.toLowerCase().replace(/[.'\-]/g, '').trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  // Try alias replacement first (SGA -> gilgeous, LeBron -> james, etc.)
  const aliased = tokens.map(t => PLAYER_ALIAS_MAP[t] || t);

  const matchScore = (player) => {
    const pn = String(player.name || '').toLowerCase().replace(/[.'\-]/g, '');
    let hits = 0;
    aliased.forEach(t => { if (t.length >= 3 && pn.includes(t)) hits++; });
    return hits;
  };

  let best = null;
  let bestScore = 0;
  all.forEach(p => {
    const s = matchScore(p);
    if (s > bestScore) { best = p; bestScore = s; }
  });
  return bestScore > 0 ? best : null;
}

function resolveML(bet, series, game) {
  // pick like "NYK ML vs PHI"
  const m = String(bet.pick || '').match(/^([A-Z]{2,4})\s+ML\b/i);
  if (!m) return null;
  const pickedAbbr = m[1].toUpperCase();
  const homeAbbr = series.homeTeam && series.homeTeam.abbr;
  const awayAbbr = series.awayTeam && series.awayTeam.abbr;
  if (pickedAbbr !== homeAbbr && pickedAbbr !== awayAbbr) return null;
  const winnerAbbr = String(game.winner).toUpperCase();
  const summary = `${winnerAbbr} ${Math.max(game.homeScore, game.awayScore)}-${Math.min(game.homeScore, game.awayScore)}`;
  return pickedAbbr === winnerAbbr
    ? { outcome:'win', actual:summary }
    : { outcome:'loss', actual:summary };
}

function resolveSpread(bet, series, game) {
  // pick like "NYK -7.5" or "PHI +7.5" — strip parenthetical context
  const cleaned = String(bet.pick || '').replace(/\(.*?\)/g, '').trim();
  const m = cleaned.match(/^([A-Z]{2,4})\s+([-+]?\d+(?:\.\d+)?)\b/i);
  if (!m) return null;
  const pickedAbbr = m[1].toUpperCase();
  const line = parseFloat(m[2]);
  const homeAbbr = series.homeTeam && series.homeTeam.abbr;
  const awayAbbr = series.awayTeam && series.awayTeam.abbr;
  if (pickedAbbr !== homeAbbr && pickedAbbr !== awayAbbr) return null;
  const isHome = pickedAbbr === homeAbbr;
  const teamScore = isHome ? game.homeScore : game.awayScore;
  const oppScore = isHome ? game.awayScore : game.homeScore;
  const margin = teamScore - oppScore;
  const adjusted = margin + line;
  const verb = margin > 0 ? 'won' : (margin < 0 ? 'lost' : 'tied');
  const actual = `${pickedAbbr} ${verb} by ${Math.abs(margin)} (line ${line >= 0 ? '+' : ''}${line})`;
  if (adjusted > 0) return { outcome:'win', actual };
  if (adjusted < 0) return { outcome:'loss', actual };
  return { outcome:'push', actual };
}

function resolveTotal(bet, series, game) {
  const m = String(bet.pick || '').match(/^(Over|Under)\s+(\d+(?:\.\d+)?)/i);
  if (!m) return null;
  const dir = m[1].toLowerCase();
  const line = parseFloat(m[2]);
  const total = game.homeScore + game.awayScore;
  const actual = `${total} total (line ${dir} ${line})`;
  if (total === line) return { outcome:'push', actual };
  const overHit = total > line;
  if ((dir === 'over' && overHit) || (dir === 'under' && !overHit)) return { outcome:'win', actual };
  return { outcome:'loss', actual };
}

function resolveProp(bet, series, game) {
  if (!game.boxScores) return null;
  const raw = String(bet.pick || '').trim();
  // Skip props with conditional/voided language.
  if (/\bvoid\b|\(if\b/i.test(raw)) return null;
  // "Player Name Over/Under N stat"
  const m = raw.match(/^(.+?)\s+(Over|Under)\s+(\d+(?:\.\d+)?)\s+([A-Za-z3]+)\b/i);
  if (!m) return null;
  const [, namePart, dir, lineStr, statRaw] = m;
  const stat = _normalizeStat(statRaw);
  if (!stat) return null;
  const line = parseFloat(lineStr);
  const player = _findPlayer(game.boxScores, namePart);
  if (!player) return null;

  let value = player[stat];
  if (stat === 'threes') {
    const made = parseInt(String(value || '').split('-')[0], 10);
    if (Number.isFinite(made)) value = made; else return null;
  }
  // PHASE 60: Composite stats — sum component fields from the box score.
  // Box scores include pts/reb/ast/stl/blk/to as numbers, so summing is direct.
  if (stat === 'pra')    value = (player.pts||0) + (player.reb||0) + (player.ast||0);
  if (stat === 'pr')     value = (player.pts||0) + (player.reb||0);
  if (stat === 'pa')     value = (player.pts||0) + (player.ast||0);
  if (stat === 'stocks') value = (player.stl||0) + (player.blk||0);
  if (typeof value !== 'number') return null;

  const actual = `${player.name} ${value} ${stat}`;
  if (value === line) return { outcome:'push', actual };
  const overHit = value > line;
  if ((dir.toLowerCase() === 'over' && overHit) || (dir.toLowerCase() === 'under' && !overHit)) {
    return { outcome:'win', actual };
  }
  return { outcome:'loss', actual };
}

function resolveBetAgainstData(bet, SERIES_DATA) {
  if (!bet || !bet.type) return null;
  const ctx = _findGameContext(SERIES_DATA, bet.series, bet.game);
  if (!ctx) return null;
  switch (bet.type) {
    case 'ml':     return resolveML(bet, ctx.series, ctx.game);
    case 'spread': return resolveSpread(bet, ctx.series, ctx.game);
    case 'total':  return resolveTotal(bet, ctx.series, ctx.game);
    case 'prop':   return resolveProp(bet, ctx.series, ctx.game);
    default:       return null;
  }
}

// Returns one of:
//   { status:'pending', reason:'game-unresolved' | 'unparseable' | 'no-boxscore' }
//   { status:'auto-fillable', computed }
//   { status:'agree',         declared, computed }
//   { status:'disagree',      declared, computed }
function reconcileBet(bet, SERIES_DATA) {
  const computed = resolveBetAgainstData(bet, SERIES_DATA);
  const declared = bet.result || null;

  if (!computed) {
    // Distinguish "we can't compute yet" vs "we don't know how to parse this"
    const ctx = _findGameContext(SERIES_DATA, bet.series, bet.game);
    if (!ctx) return { betId: bet.id, status:'pending', reason:'game-unresolved' };
    if (bet.type === 'prop' && (!ctx.game.boxScores)) {
      return { betId: bet.id, status:'pending', reason:'no-boxscore' };
    }
    return { betId: bet.id, status:'pending', reason:'unparseable' };
  }
  if (!declared) return { betId: bet.id, status:'auto-fillable', computed };
  // 'void' is a valid manual override — never flag as disagree.
  if (declared.outcome === 'void') return { betId: bet.id, status:'agree', declared, computed };
  if (declared.outcome === computed.outcome) return { betId: bet.id, status:'agree', declared, computed };
  return { betId: bet.id, status:'disagree', declared, computed };
}

function reconcileAllBets(BETS, SERIES_DATA) {
  if (!Array.isArray(BETS)) return [];
  return BETS.map(bet => reconcileBet(bet, SERIES_DATA));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    resolveBetAgainstData,
    reconcileBet,
    reconcileAllBets,
    resolveML, resolveSpread, resolveTotal, resolveProp,
  };
}
