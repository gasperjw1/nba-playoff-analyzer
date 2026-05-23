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

// ── Realistic DK alt-line bounds ─────────────────────────────────────
// DK/FD don't offer infinitely deep alt lines. Empirically, alt lines
// extend to roughly:
//   PTS: 50% of player's avg (Brunson 28ppg → as low as 14.5)
//   REB: 40% of avg (Gobert 12rpg → as low as 4.5)
//   AST: 40% of avg (Brunson 7apg → as low as 2.5)
//   3PM: 30% of avg (limited alt depth — usually just 0.5, 1.5, 2.5)
//   STL/BLK/Stocks: 0.5 floor (no deeper, but always exists)
//   TO/PRA/composites: 0.5 floor
// Reject lines below these floors — they don't exist on the book.
function _realisticLineFloor(statKey, mean) {
  if (statKey === 'pts')    return Math.max(0.5, mean * 0.50);
  if (statKey === 'reb')    return Math.max(0.5, mean * 0.40);
  if (statKey === 'ast')    return Math.max(0.5, mean * 0.40);
  if (statKey === 'threes') return Math.max(0.5, mean * 0.30);
  if (statKey === 'pra')    return Math.max(0.5, mean * 0.50);
  return 0.5; // stocks, stl, blk, to
}

// ── Estimated juice for a given hit rate ─────────────────────────────
// At a "fair" market, odds match implied probability:
//   p = 90% → -900 American, payout 11¢ per $1
//   p = 85% → -567, payout 17¢
//   p = 80% → -400, payout 25¢
//   p = 75% → -300, payout 33¢
//   p = 70% → -233, payout 43¢
// Bookmakers add ~5-10% vig, but our raw MC hit-rate is the FAIR
// estimate. Use this to flag legs that pay so little they're not worth
// the slip.
function _estimateAmericanFromHitRate(p) {
  if (!isFinite(p) || p <= 0 || p >= 1) return null;
  if (p > 0.5) return Math.round(-100 * p / (1 - p));
  return Math.round(100 * (1 - p) / p);
}
function _payoutPer100(americanOdds) {
  if (!isFinite(americanOdds)) return 0;
  if (americanOdds > 0) return americanOdds;
  return Math.round(10000 / -americanOdds);
}

// ── findSafeLines ────────────────────────────────────────────────────
// Returns, for a given player + stat, the deepest OVER line where
// P(hit) >= threshold AND the line is realistic (DK actually lists it).
//
// Returns ladder { line95, line90, line85, line80 } — each entry has
// { line, hitRate, estJuice, estPayoutPer100, realistic } so callers
// can pick the right reliability tier and see the practical EV.
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
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const floor = _realisticLineFloor(key, mean);

  // For each target threshold, find the deepest line.
  // P(over X) = (count where v > X) / N.
  // To get P(over) >= threshold, X must be <= the (1-threshold) quantile.
  //
  // Phase 73g: lines are forced to HALF-INTEGERS (0.5, 1.5, 2.5...). DK
  // books only list .5 increments for prop alt lines; a leg like "ast o1"
  // that we previously generated isn't actually placeable AND created a
  // PUSH/LOSS ambiguity (Champagnie hit exactly 1 → MISS under strict-over
  // book settlement, but unclear in our hit-rate calc since `v > 1` is
  // false for v=1). Forcing half-integers makes every line settle cleanly.
  function _toHalfInteger(v) {
    // Round to nearest 0.5
    const half = Math.round(v * 2) / 2;
    // If we landed on a whole number, drop to the safer half below
    // (rounding DOWN preserves the conservative "deepest line that
    // still clears threshold" semantic — never offer a riskier line
    // than the math justifies).
    return (half === Math.floor(half)) ? half - 0.5 : half;
  }

  function deepestLineAtThreshold(threshold) {
    const idx = Math.max(0, Math.floor((1 - threshold) * sorted.length) - 1);
    const value = sorted[idx];
    // Half-integer line: never a whole number (avoids push-on-exact)
    let line = _toHalfInteger(Math.floor(value * 2) / 2);
    // Clamp UP to the realistic DK floor — refusing to recommend lines
    // the book won't list. Hit rate may dip slightly when we clamp.
    const realistic = line >= floor;
    if (!realistic) line = _toHalfInteger(Math.ceil(floor * 2) / 2);
    const hits = arr.filter(v => v > line).length;
    const hitRate = +(hits / arr.length).toFixed(3);
    const estJuice = _estimateAmericanFromHitRate(hitRate);
    const estPayout = _payoutPer100(estJuice);
    return { line, hitRate, estJuice, estPayoutPer100: estPayout, realistic };
  }

  return {
    player: resolved,
    stat: key,
    mean: +mean.toFixed(2),
    realisticFloor: +floor.toFixed(2),
    line95: deepestLineAtThreshold(0.95),
    line90: deepestLineAtThreshold(0.90),
    line85: deepestLineAtThreshold(0.85),
    line80: deepestLineAtThreshold(0.80),
  };
}

// ── safeLinesForAllPlayers ──────────────────────────────────────────
// Walks every player in the sim, finds safe lines across the standard
// stat panel (pts/reb/ast/stocks/threes/pra). Filters out:
//   - Unrealistic lines (below DK's listing floor)
//   - Hit rates below the threshold (default 80% per user spec)
//   - Lines where estimated juice exceeds -500 (payout < $20/$100 stake)
//   - Deep-bench players (Phase 73k) — DK rarely lists props for
//     players projected under 18 minutes. Pass opts.series so the
//     filter can look up each player's actual rotation role via
//     estimateProjectedMinutes (boxscore-derived when available).
//
// Returns flat list sorted DESC by (hitRate × payout) — a rough
// "expected return" ranking that balances reliability with payout size.
// User wanted to avoid -2000 juice props; this scoring naturally
// deprioritizes them.
function safeLinesForAllPlayers(simResult, opts) {
  if (!simResult || !simResult._raw || !simResult._raw.players) return [];
  opts = opts || {};
  const stats = opts.stats || ['pts', 'reb', 'ast', 'stocks', 'threes', 'pra'];
  const threshold = opts.threshold || 0.80;          // 80% per user spec
  const maxJuice = opts.maxJuice != null ? opts.maxJuice : -500;  // reject deeper than -500
  const minProjectedMinutes = opts.minProjectedMinutes != null ? opts.minProjectedMinutes : 18;
  const series = opts.series || null;
  // Phase 73m: script-signal filtering also applies here (default on
  // when series is passed) so UI candidate panels show the same
  // filtered list the parlay builder would actually use. Pass
  // applyScriptSignals: false to see the raw pool.
  const applyScriptSignals = opts.applyScriptSignals !== false && series != null;
  // Build a name → { player, team } lookup once so we don't re-scan
  // both rosters per stat per player.
  const playerLookup = {};
  if (series && series.homeTeam && Array.isArray(series.homeTeam.players)) {
    series.homeTeam.players.forEach(p => { if (p && p.name) playerLookup[p.name] = { player: p, team: series.homeTeam }; });
  }
  if (series && series.awayTeam && Array.isArray(series.awayTeam.players)) {
    series.awayTeam.players.forEach(p => { if (p && p.name) playerLookup[p.name] = { player: p, team: series.awayTeam }; });
  }
  const minutesEstimator = (typeof estimateProjectedMinutes === 'function') ? estimateProjectedMinutes : null;

  // Phase 73m: precompute blowout side + facilitator cache for this call.
  const blowoutSide = applyScriptSignals ? _blowoutRiskSide(simResult, series) : null;
  const facilitatorCache = {};
  function _facRiskCached(name) {
    if (facilitatorCache[name] !== undefined) return facilitatorCache[name];
    const lookup = playerLookup[name];
    facilitatorCache[name] = (lookup && lookup.player) ? _detectFacilitatorRisk(lookup.player, series) : 0;
    return facilitatorCache[name];
  }

  const rows = [];
  Object.keys(simResult._raw.players).forEach(name => {
    // Phase 73k rotation-tier filter: drop deep-bench players who don't
    // have real DK prop markets. When series isn't passed, skip the
    // filter (backward-compatible).
    if (series && minutesEstimator) {
      const lookup = playerLookup[name];
      if (lookup) {
        const projMin = minutesEstimator(lookup.player, lookup.team, series);
        if (projMin < minProjectedMinutes) return;
      }
    }
    stats.forEach(stat => {
      // Phase 73m: script-signal filters before tier search.
      if (applyScriptSignals) {
        const lookup = playerLookup[name];
        const pos = lookup && lookup.player && lookup.player.pos;
        // Signal 1: stat-position fit
        if (_statPositionFit(stat, pos) < 0.5) return;
        // Signal 2: facilitator risk on PTS
        if (stat === 'pts' && _facRiskCached(name) >= 0.4) return;
        // Signal 3: blowout suppression on PTS for favored team
        if (stat === 'pts' && blowoutSide && lookup && lookup.team && lookup.team.abbr === blowoutSide) return;
      }
      const sl = findSafeLines(simResult, name, stat, {});
      if (!sl) return;
      // Pick the deepest tier whose hit rate still clears threshold.
      // Prefer line80 (deepest, most reliable BUT might be too deep).
      // Fall back to line85, line90, line95 if line80 isn't realistic.
      const candidates = [sl.line80, sl.line85, sl.line90, sl.line95];
      let chosen = null;
      for (const c of candidates) {
        if (!c || !c.realistic) continue;
        if (c.hitRate < threshold) continue;
        // Reject if juice deeper than maxJuice (e.g., -800 < -500)
        if (c.estJuice != null && c.estJuice < maxJuice) continue;
        chosen = c;
        break;
      }
      if (!chosen) return;
      rows.push({
        player: sl.player,
        stat,
        line: chosen.line,
        hitRate: chosen.hitRate,
        estJuice: chosen.estJuice,
        estPayoutPer100: chosen.estPayoutPer100,
        mean: sl.mean,
      });
    });
  });
  // Sort by expected $ return: hitRate × payout
  return rows.sort((a, b) => (b.hitRate * b.estPayoutPer100) - (a.hitRate * a.estPayoutPer100));
}

// ── American-odds helpers ────────────────────────────────────────────
// Converts American odds to implied probability and decimal multiplier.
//   +150 → impliedP=0.40, decMult=2.50 (bet $100, win $150 + stake back)
//   -200 → impliedP=0.667, decMult=1.50
// Phase 73 hygiene: aligned with edge-detector's defensive n===0 guard.
// Pre-fix this returned NaN/Infinity on odds=0; now returns null.
function _americanToImplied(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
  if (n > 0) return 100 / (n + 100);
  return -n / (-n + 100);
}
function _americanToMult(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
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

// ────────────────────────────────────────────────────────────────────
// PHASE 73m: GAME-SCRIPT AWARENESS SIGNALS (May 23, 2026)
// ────────────────────────────────────────────────────────────────────
// The CF backtest exposed a "single-leg-killer" pattern: 4-leg
// starter parlays where 3 legs hit cleanly but 1 leg dies in a
// game-script that the engine doesn't model. Three concrete failures:
//
//   1. Brunson PTS 19 under 21.5 — facilitator night (14 ast)
//   2. Holmgren PTS 8 under 11.5 — blowout, OKC bench took over Q4
//   3. Wemby threes 1 under 1.5 — physical-paint game, no perimeter
//
// These aren't random misses — they're detectable scripts. Three
// signals to flag candidate legs that should be downweighted or
// excluded.

// ── Signal 1: Stat-position fit ─────────────────────────────────────
// Some stats don't fit some positions. Centers attempting 3PT is rare;
// guards generating blocks is rare. The MC engine projects threes for
// EVERY player (calibrated to their season rate), but books don't list
// "Hartenstein O0.5 threes" or "Olynyk O0.5 threes" as actual props.
// Fit table: 1.0 = listed/sensible, 0.0 = never listed, 0.5 = depends
// on player (stretch-5s sometimes get 3PT props).
//
// The position field on player objects is 'PG' | 'SG' | 'SF' | 'PF' | 'C'.
const STAT_POSITION_FIT = {
  threes: { PG: 1.0, SG: 1.0, SF: 1.0, PF: 0.5, C: 0.1 },
  blk:    { PG: 0.1, SG: 0.2, SF: 0.5, PF: 0.8, C: 1.0 },
  stl:    { PG: 1.0, SG: 0.9, SF: 0.7, PF: 0.4, C: 0.2 },
  // pts/reb/ast/pra/stocks/to: every position is fair game (no fit penalty)
};
function _statPositionFit(stat, position) {
  const table = STAT_POSITION_FIT[stat];
  if (!table) return 1.0;                    // stats without a fit table → always fit
  if (!position) return 0.5;                 // unknown position → middle of road
  return table[position] != null ? table[position] : 0.5;
}

// ── Signal 2: Facilitator risk ──────────────────────────────────────
// A player has "facilitator risk" on their PTS prop when recent box
// scores show AST/PTS ratio > 0.4 (i.e., they pivoted to playmaking
// over scoring) AND their PTS was below their season avg.
//
// Brunson G2 ECF: 19pts / 14ast → ratio 0.74 → flagged. The PTS leg
// would have been downweighted; AST leg (which would have hit easily)
// not affected.
//
// Returns: facilitator probability ∈ [0,1] — fraction of recent games
// where the facilitator script appeared.
function _detectFacilitatorRisk(player, series) {
  if (!player || !series || !Array.isArray(series.games)) return 0;
  const teamSide = (series.homeTeam && series.homeTeam.players.some(p => p && p.name === player.name)) ? 'home'
                : (series.awayTeam && series.awayTeam.players.some(p => p && p.name === player.name)) ? 'away'
                : null;
  if (!teamSide) return 0;
  let total = 0, facilitator = 0;
  series.games.forEach(g => {
    if (!g || !g.winner || !g.boxScores) return;
    const bs = g.boxScores[teamSide];
    if (!Array.isArray(bs)) return;
    const me = bs.find(p => p && p.name === player.name);
    if (!me || typeof me.pts !== 'number' || typeof me.ast !== 'number') return;
    if (me.min == null || me.min < 18) return;        // DNP-CD doesn't count
    total++;
    const ratio = me.ast / Math.max(1, me.pts);
    const seasonPts = player.ppg || 0;
    const ptsLow = seasonPts > 0 && me.pts < seasonPts * 0.85;
    if (ratio > 0.4 && ptsLow) facilitator++;
  });
  return total > 0 ? facilitator / total : 0;
}

// ── Signal 3: Blowout suppression ───────────────────────────────────
// In blowout games (MC blowoutRisk > 0.25), the EXPECTED-winner's
// starters get pulled Q3 and their stat lines compress. This isn't a
// problem for REB/AST props (counting-stat distributions are robust)
// but it kills PTS props for the favored side. Return the team abbr
// whose PTS props should be downweighted (null if no blowout risk).
function _blowoutRiskSide(simResult, series) {
  if (!simResult || typeof simResult.blowoutRisk !== 'number') return null;
  if (simResult.blowoutRisk < 0.25) return null;
  // Determine favored side from MC homeWinProb (>0.55 = home favored).
  if (typeof simResult.homeWinProb !== 'number') return null;
  if (simResult.homeWinProb > 0.55 && series.homeTeam) return series.homeTeam.abbr;
  if (simResult.homeWinProb < 0.45 && series.awayTeam) return series.awayTeam.abbr;
  return null;
}

// ── Player → team map (Phase 69 anti-correlation) ────────────────────
// Given a series, build a name → team-abbr lookup so candidate legs
// can be tagged with which team they belong to. This drives the
// per-team cap below.
function _buildPlayerTeamMap(series) {
  const map = {};
  if (!series) return map;
  if (series.homeTeam && Array.isArray(series.homeTeam.players)) {
    series.homeTeam.players.forEach(p => { if (p && p.name) map[p.name] = series.homeTeam.abbr; });
  }
  if (series.awayTeam && Array.isArray(series.awayTeam.players)) {
    series.awayTeam.players.forEach(p => { if (p && p.name) map[p.name] = series.awayTeam.abbr; });
  }
  return map;
}

// ── Shared candidate-pool builder (Phase 69 anti-correlation) ───────
// Both Reliable and Traditional draw from the SAME pool of model-
// confident legs (≥80% MC, realistic line, payable juice). Phase 69
// adds anti-correlation diversification:
//
//   - Max 1 leg per player (dedupe by name)
//   - Max maxPerTeam legs per team (default 2) — prevents "4 NYK legs
//     all bust if NYK blows the game" scenarios
//   - Penalize same-game-script stacking implicitly via the team cap
//
// Returns candidates sorted by expected $ return (hitRate × payout) so
// the highest-EV legs are preferred when the team cap forces a trim.
function _candidatePool(simResult, series, opts) {
  opts = opts || {};
  const maxPerTeam = opts.maxPerTeam != null ? opts.maxPerTeam : 2;
  // Phase 73m: script signals applied inside safeLinesForAllPlayers
  // (default-on when series is passed). Pass applyScriptSignals: false
  // here to disable for both layers — caller still gets rotation filter.
  const rows = safeLinesForAllPlayers(simResult, {
    threshold: 0.80,
    maxJuice: opts.maxJuice || -500,
    series: series,
    minProjectedMinutes: opts.minProjectedMinutes != null ? opts.minProjectedMinutes : 18,
    applyScriptSignals: opts.applyScriptSignals,
  });
  const playerTeam = _buildPlayerTeamMap(series);
  const seenPlayers = new Set();
  const perTeamCount = {};
  const candidates = [];
  for (const r of rows) {
    if (seenPlayers.has(r.player)) continue;
    const team = playerTeam[r.player] || 'UNK';
    perTeamCount[team] = perTeamCount[team] || 0;
    // Anti-correlation: refuse a 3rd+ leg on the same team. UNK falls
    // through (unidentified players don't cap — should be rare).
    if (team !== 'UNK' && perTeamCount[team] >= maxPerTeam) continue;
    seenPlayers.add(r.player);
    perTeamCount[team] += 1;
    candidates.push({
      type: 'prop', player: r.player, stat: r.stat,
      line: r.line, direction: 'over',
      hitRate: r.hitRate, estJuice: r.estJuice,
      team,
    });
  }
  return candidates;
}

// ── _scoreConfig: helper that scores a specific leg combination ──────
function _scoreConfig(simResult, series, legs) {
  // Guard legs with bad juice — estJuice === 0 (or NaN) breaks the decimal
  // formula. American odds always have magnitude ≥ 100 in practice; bail
  // out cleanly rather than emitting Infinity into the parlay sim.
  if (legs.some(l => !l || !isFinite(l.estJuice) || l.estJuice === 0)) return null;
  const dec = legs.map(l => l.estJuice > 0 ? 1 + l.estJuice / 100 : 1 + 100 / -l.estJuice);
  const combinedDec = dec.reduce((a, b) => a * b, 1);
  if (!isFinite(combinedDec) || combinedDec <= 1) return null;
  const american = combinedDec > 2 ? Math.round((combinedDec - 1) * 100)
                                   : Math.round(-100 / (combinedDec - 1));
  const score = scoreParlay(simResult, series, legs, american);
  if (!score) return null;
  return { legs, score, parlayJuice: american };
}

// ── buildReliableParlay ──────────────────────────────────────────────
// 2 or 3 legs, combined ≥80% required. Prefers fewer legs (lower
// variance). Returns null if combined floor unreachable from available
// pool — don't force a parlay.
function buildReliableParlay(simResult, series, opts) {
  opts = opts || {};
  const combinedThreshold = opts.combinedThreshold || 0.80;
  const candidates = _candidatePool(simResult, series, opts);
  if (candidates.length < 2) return null;

  // Try 2 legs first (easier to clear, less variance)
  const two = _scoreConfig(simResult, series, candidates.slice(0, 2));
  if (two && two.score.combined >= combinedThreshold) {
    return { ...two, tier: 'reliable', legCount: 2 };
  }
  // Fall back to 3 legs
  if (candidates.length >= 3) {
    const three = _scoreConfig(simResult, series, candidates.slice(0, 3));
    if (three && three.score.combined >= combinedThreshold) {
      return { ...three, tier: 'reliable', legCount: 3 };
    }
  }
  return null;
}

// ── buildTraditionalParlay ───────────────────────────────────────────
// "Value swing" parlay: SAME pool of model-confident legs (≥80% MC)
// but stacked DEEPER (4-5 legs) so combined payout grows large. NO
// combined-hit floor — accept lower hit rate (~40-55% for 4 legs, 30-
// 45% for 5 legs) in exchange for +300 to +800 American payout.
//
// Surfaces both raw MC combined AND historically-calibrated combined
// so the user sees the honest probability. The calibration table from
// the 93-bet historical run shows the 80-95% raw bucket actually
// delivers ~67%; this gets applied per-leg and re-compounded.
//
// Strategy: try 3, 4, 5 legs and pick the config with the highest EV
// per $100 stake. Tie-breaker: higher combined hit rate.
function buildTraditionalParlay(simResult, series, opts) {
  opts = opts || {};
  const candidates = _candidatePool(simResult, series, opts);
  if (candidates.length < 3) return null;

  // Traditional is the "win big money" tier — prefer LONGEST viable
  // config (5 legs if pool allows, else 4, else 3). User picks the
  // shorter form by tuning opts.legCount.
  const targetLegs = opts.legCount || Math.min(5, candidates.length);
  const configs = [];
  if (candidates.length >= Math.max(3, targetLegs)) {
    configs.push(_scoreConfig(simResult, series, candidates.slice(0, targetLegs)));
  } else if (candidates.length >= 3) {
    configs.push(_scoreConfig(simResult, series, candidates.slice(0, candidates.length)));
  }
  const valid = configs.filter(c => c !== null);
  if (!valid.length) return null;
  const best = valid[0];

  // Compound the per-leg calibrated probability for an honest combined
  // estimate. Per-leg 80-95% raw → ~67% calibrated. Apply per-leg then
  // multiply (assuming independence — this is a UPPER bound, real joint
  // is slightly higher due to correlation).
  const calibratedLegs = best.legs.map(l => {
    const c = calibrateHitRate(l.hitRate);
    return c ? c.calibrated : l.hitRate;
  });
  const calibratedCombined = calibratedLegs.reduce((a, b) => a * b, 1);
  const cal = calibrateHitRate(best.score.combined);

  return {
    ...best,
    tier: 'traditional',
    legCount: best.legs.length,
    calibrated: cal,
    calibratedCombined: +calibratedCombined.toFixed(3),
    calibratedLegHitRates: calibratedLegs.map(x => +x.toFixed(3)),
    note: 'High MC confidence but historical 80-95% bucket only delivered 67%. Bigger payout, accept lower hit rate. The calibrated combined is the honest estimate; raw is what the model says.',
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    findSafeLines,
    safeLinesForAllPlayers,
    scoreParlay,
    calibrateHitRate,
    buildReliableParlay,
    buildTraditionalParlay,
    _americanToImplied,
    _americanToMult,
    // Phase 73m: game-script signals exported for tests + snapshot CLI
    STAT_POSITION_FIT,
    _statPositionFit,
    _detectFacilitatorRisk,
    _blowoutRiskSide,
  };
}
