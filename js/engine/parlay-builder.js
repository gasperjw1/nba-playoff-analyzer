// ============================================================
// PARLAY BUILDER — Phase 63 (May 16, 2026)
// ============================================================
// Turns the Monte Carlo simulator into a recommender for reliable
// parlays by leveraging the depth of DK/FD's prop catalog:
//
//   1. findSafeLines() — for each top player, scan their MC stat
//      distribution and report the DEEPEST alt line that still
//      clears a target hit-rate threshold. Mirrors how a sharp
//      bettor builds: "I want 90%+ each leg" → scan deep alts.
//
//   2. scoreParlay() — given a set of legs + American odds payout,
//      report joint hit rate (correlation-preserving), expected
//      value (EV per $100 stake), and a verdict label.
//
//   3. calibrateHitRate() — applies the empirical correction from
//      our 93-bet historical calibration (TEST 15 retro). MC's raw
//      probabilities are overconfident in some buckets; this
//      function returns the "calibrated" view. Use sparingly — 93
//      bets is a small sample and we're better trusting raw MC than
//      over-correcting it for now.
//
// DESIGN NOTE: this module DOES NOT pull from DK/FD APIs (no scraping,
// auth, or rate-limiting infrastructure). The daily task hand-enters
// DK odds; this module quantifies whether those bets are worth taking.
// ============================================================

// ── findSafeLines ────────────────────────────────────────────────────
// Returns, for a given player + stat, the deepest OVER line where
// P(hit) >= threshold. Threshold defaults to 0.85 (typical alt-line
// confidence target). Stat granularity is 0.5 (matches DK/FD half-pt
// alt-line spacing).
//
// Returns { line, hitRate, line95, line85, line75 } so callers can see
// the full ladder.
function findSafeLines(simResult, playerName, statType, opts) {
  if (!simResult || !simResult._raw || !simResult._raw.players) return null;
  opts = opts || {};
  const resolved = _resolvePlayerName(simResult, playerName);
  if (!resolved) return null;
  const samples = simResult._raw.players[resolved];
  if (!samples) return null;

  const statMap = { pt:'pts', pts:'pts', points:'pts',
    reb:'reb', rebs:'reb', rebounds:'reb',
    ast:'ast', asts:'ast', assists:'ast',
    stl:'stl', stls:'stl', steals:'stl',
    blk:'blk', blks:'blk', blocks:'blk',
    three:'threes', threes:'threes', '3pm':'threes',
    to:'to', turnovers:'to',
    pra:'pra', pr:'pr', pa:'pa', stocks:'stocks' };
  const key = statMap[String(statType).toLowerCase()];
  if (!key || !Array.isArray(samples[key])) return null;

  const arr = samples[key];
  const sorted = [...arr].sort((a, b) => a - b);

  // For each target threshold, find the deepest line.
  // P(over X) = (count where v > X) / N.
  // To get P(over) >= threshold, X must be <= the (1-threshold) quantile.
  // e.g., for threshold 0.85, X = 15th percentile; over that line hits 85% of the time.
  function deepestLineAtThreshold(threshold) {
    const idx = Math.max(0, Math.floor((1 - threshold) * sorted.length) - 1);
    const value = sorted[idx];
    // Round DOWN to nearest 0.5 (alt lines are .5 increments)
    const line = Math.floor(value * 2) / 2;
    // Recompute exact hit rate at this rounded line
    const hits = arr.filter(v => v > line).length;
    return { line, hitRate: +(hits / arr.length).toFixed(3) };
  }

  return {
    player: resolved,
    stat: key,
    mean: +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
    line95: deepestLineAtThreshold(0.95),
    line90: deepestLineAtThreshold(0.90),
    line85: deepestLineAtThreshold(0.85),
    line75: deepestLineAtThreshold(0.75),
  };
}

// ── safeLinesForAllPlayers ──────────────────────────────────────────
// Convenience: walks every player in the sim and finds safe lines
// across the standard stat panel (pts, reb, ast, stocks, threes).
// Returns a flat list of { player, stat, level, line, hitRate } rows
// sorted by hit rate desc.
function safeLinesForAllPlayers(simResult, opts) {
  if (!simResult || !simResult._raw || !simResult._raw.players) return [];
  opts = opts || {};
  const stats = opts.stats || ['pts', 'reb', 'ast', 'stocks', 'threes', 'pra'];
  const threshold = opts.threshold || 0.85;
  const rows = [];
  Object.keys(simResult._raw.players).forEach(name => {
    stats.forEach(stat => {
      const sl = findSafeLines(simResult, name, stat, {});
      if (!sl) return;
      const tierKey = threshold >= 0.95 ? 'line95'
                    : threshold >= 0.90 ? 'line90'
                    : threshold >= 0.85 ? 'line85'
                    : 'line75';
      const lineInfo = sl[tierKey];
      if (lineInfo && lineInfo.line > 0) {
        rows.push({
          player: sl.player,
          stat,
          line: lineInfo.line,
          hitRate: lineInfo.hitRate,
          mean: sl.mean,
        });
      }
    });
  });
  return rows.sort((a, b) => b.hitRate - a.hitRate);
}

// ── American-odds helpers ────────────────────────────────────────────
// Converts American odds to implied probability and decimal multiplier.
//   +150 → impliedP=0.40, decMult=2.50 (bet $100, win $150 + stake back)
//   -200 → impliedP=0.667, decMult=1.50
function _americanToImplied(odds) {
  const n = Number(odds);
  if (!isFinite(n)) return null;
  if (n > 0) return 100 / (n + 100);
  return -n / (-n + 100);
}
function _americanToMult(odds) {
  const n = Number(odds);
  if (!isFinite(n)) return null;
  if (n > 0) return 1 + n / 100;
  return 1 + 100 / -n;
}

// ── scoreParlay ──────────────────────────────────────────────────────
// Given a parlay's legs + the listed American odds (or estimated),
// computes joint hit rate via MC, implied probability from the line,
// edge (MC − implied), and EV per $100 stake.
//
// Legs use the same format as calcParlayHitRate.
// americanOdds: e.g. +150 or -200.
// stake: defaults to 100 for EV display.
//
// Verdict:
//   STRONG +EV  if edge >= 0.08 AND combined >= 0.50
//   POSITIVE    if edge >= 0.03
//   FLAT        if abs(edge) < 0.03
//   NEGATIVE    if edge <= -0.03 (book has the edge — skip)
function scoreParlay(simResult, series, legs, americanOdds, opts) {
  const result = (typeof calcParlayHitRate === 'function')
    ? calcParlayHitRate(simResult, series, legs)
    : null;
  if (!result) return null;
  opts = opts || {};
  const stake = opts.stake || 100;
  const implied = _americanToImplied(americanOdds);
  const mult = _americanToMult(americanOdds);
  if (implied == null || mult == null) return { ...result, error: 'invalid odds' };

  const combined = result.combined;
  const edge = +(combined - implied).toFixed(3);
  const profit = (mult - 1) * stake;          // payout above stake
  const ev = +(combined * profit - (1 - combined) * stake).toFixed(2);

  let verdict;
  if (edge >= 0.08 && combined >= 0.50) verdict = 'STRONG +EV';
  else if (edge >= 0.03) verdict = 'POSITIVE';
  else if (Math.abs(edge) < 0.03) verdict = 'FLAT';
  else verdict = 'NEGATIVE';

  return {
    ...result,
    americanOdds: Number(americanOdds),
    impliedProb: +implied.toFixed(3),
    decimalMult: +mult.toFixed(3),
    edge,
    evPer100: ev,
    stake,
    payoutIfHit: +((mult - 1) * stake).toFixed(2),
    verdict,
  };
}

// ── calibrateHitRate ─────────────────────────────────────────────────
// Applies the empirical correction from the 93-bet TEST 15 calibration
// run (May 16). Use sparingly — small sample; current advice is to
// trust raw MC and only flag highly-miscalibrated buckets.
//
// Returns an object with both raw and calibrated values for inspection.
function calibrateHitRate(rawProb) {
  if (rawProb == null) return null;
  let calibrated;
  let bucket;
  if (rawProb < 0.30)        { bucket = '0-30%';   calibrated = 0.30; }
  else if (rawProb < 0.50)   { bucket = '30-50%';  calibrated = Math.min(0.95, rawProb + 0.18); }
  else if (rawProb < 0.65)   { bucket = '50-65%';  calibrated = Math.max(0.05, rawProb - 0.16); }
  else if (rawProb < 0.80)   { bucket = '65-80%';  calibrated = rawProb; }
  else if (rawProb < 0.95)   { bucket = '80-95%';  calibrated = Math.max(0.50, rawProb - 0.21); }
  else                       { bucket = '95-100%'; calibrated = rawProb; }
  return {
    raw: +rawProb.toFixed(3),
    calibrated: +calibrated.toFixed(3),
    bucket,
    correction: +(calibrated - rawProb).toFixed(3),
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    findSafeLines,
    safeLinesForAllPlayers,
    scoreParlay,
    calibrateHitRate,
    _americanToImplied,
    _americanToMult,
  };
}
