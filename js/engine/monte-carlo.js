// ============================================================
// MONTE CARLO GAME-FLOW SIMULATOR — Phase 61 (May 16, 2026)
// ============================================================
// The existing engine outputs a single point margin per game. Reality
// has wide tails: NYK-PHI G4 was projected NYK by 6, actual NYK by 30,
// because NYK shot 25-of-44 from 3 (56.8%) — the upper variance tail.
// Our four worst margin misses (>20pt error) were ALL variance events,
// not model bias.
//
// Monte Carlo addresses this directly: sample each player's per-game
// stats N times from their volatility profile, sum to team totals, and
// compute the distribution of margins. Output is no longer a point
// estimate but a full distribution: p10/p50/p90, P(home wins), and
// per-player prop hit-rates.
//
// USES:
//   - Sim Lab tab shows margin distribution next to point estimate
//   - Prop bets get probabilistic hit-rate estimates instead of
//     hand-authored guesses
//   - Parlay math becomes joint-sample-based (proper correlation)
//
// NOT YET MODELED (deferred):
//   - Foul-out / ejection randomness within a sim (event injection)
//   - 4Q comeback dynamics (margin doesn't equal sum of player pts)
//   - Live-line shading (we sim cold, then compare to DK)
// ============================================================

const MC_CONFIG = {
  iterations: 1000,
  // Per-stat coefficient of variation (stdev / mean) for player game logs.
  // Empirically grounded: Brunson 4-game R2 had ppg=29, stdev=5.7 (CV ~0.20);
  // Wemby R2 had wide swings from ejection/injury. Default 0.28 is the
  // observed median across our 18-game ledger for high-usage scorers.
  ptsCV: 0.28,
  rebCV: 0.30,
  astCV: 0.35,
  stlCV: 0.60,   // low-mean events have higher CV
  blkCV: 0.60,
  toCV: 0.45,
  threesCV: 0.50, // 3PT volume is the variance driver
  // Team-level shocks layered on top of player sums
  teamPaceCV: 0.04,        // ±4% pace variance (10-12pt range)
  teamThreePctCV: 0.10,    // 3PT% variance — biggest single driver of margin tails
  // Random shocks: probability of an ejection/foul-out per game
  ejectionProb: 0.02,      // 1-in-50 baseline; multiplied by player.techRisk
  ejectionImpact: 0.4,     // ejected player retains only 40% of projected stats
  // HCA add-back at the margin level (already in calcGameProjection but
  // we re-apply at sim-level so MC stays self-contained)
  hcaBoost: { R1: 3, R2: 1.5, CF: 1.5, Finals: 1 },
};

// ── Truncated normal sampler ────────────────────────────────────────
// Box-Muller transform, then clip to [min, max].
function _sampleNormal(mean, stdev, min, max) {
  if (stdev <= 0) return mean;
  let u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const val = mean + z * stdev;
  return Math.max(min == null ? -Infinity : min, Math.min(max == null ? Infinity : max, val));
}

// Percentile from a sorted array
function _percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = Math.max(0, Math.min(sortedArr.length - 1, Math.floor(p * sortedArr.length)));
  return sortedArr[idx];
}

// ── Sample one player's stats for one game ──────────────────────────
// CRITICAL: this uses the ENGINE's calibrated projection (with all 14
// modifiers including matchup, fatigue, etc.) as the MEAN, then samples
// around it with variance. Falls back to raw ppg only if the engine
// projection isn't available (e.g. CHS-shadow or test contexts).
//
// expected = {pts, reb, ast, ...} computed once by caller, passed in.
function _samplePlayerGame(player, expected, opts) {
  if (!player || (player.rating || 0) === 0) return { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0, threes: 0, min: 0 };
  opts = opts || {};

  // Expected minutes: estimate from rating (rough — engine doesn't surface this)
  const baseMin = player.rating >= 80 ? 35 : player.rating >= 70 ? 30 : player.rating >= 60 ? 22 : 14;
  const minutes = Math.max(0, Math.min(48, _sampleNormal(baseMin, 3, 5, 44)));
  const minMult = minutes / baseMin;     // relative to baseline minutes
  const sqrtMinMult = Math.sqrt(minMult);

  // Use engine-projected mean, scaled by minutes
  const meanPts = (expected.pts || 0) * minMult;
  const meanReb = (expected.reb || 0) * minMult;
  const meanAst = (expected.ast || 0) * minMult;

  const pts = _sampleNormal(meanPts, meanPts * MC_CONFIG.ptsCV, 0, 70);
  const reb = _sampleNormal(meanReb, meanReb * MC_CONFIG.rebCV, 0, 25);
  const ast = _sampleNormal(meanAst, meanAst * MC_CONFIG.astCV, 0, 20);

  // Defensive stats — derive from rating tier (no engine projection for these yet)
  const baseStl = player.rating >= 75 ? 1.2 : player.rating >= 65 ? 0.9 : 0.6;
  const baseBlk = player.defRole && /Anchor|Mobile Big|Helper/.test(player.defRole) ? 1.0 : 0.4;
  const baseTo  = (player.ppg || 0) * 0.10; // ~10% of usage; not engine-projected

  const stl = _sampleNormal(baseStl * minMult, baseStl * MC_CONFIG.stlCV * sqrtMinMult, 0, 8);
  const blk = _sampleNormal(baseBlk * minMult, baseBlk * MC_CONFIG.blkCV * sqrtMinMult, 0, 10);
  const to  = _sampleNormal(baseTo * minMult, baseTo * MC_CONFIG.toCV * sqrtMinMult, 0, 12);

  const baseThrees = (expected.pts || 0) * 0.12; // 12% of expected pts on avg are 3PM
  const threes = _sampleNormal(baseThrees * minMult, baseThrees * MC_CONFIG.threesCV * sqrtMinMult, 0, 12);

  // Ejection event injection
  let stats = { pts, reb, ast, stl, blk, to, threes, min: minutes };
  const techRisk = (player.techRisk || 0);
  const ejectMult = MC_CONFIG.ejectionProb * (1 + techRisk * 4);
  if (Math.random() < ejectMult) {
    const mult = MC_CONFIG.ejectionImpact;
    stats = {
      pts: stats.pts * mult, reb: stats.reb * mult, ast: stats.ast * mult,
      stl: stats.stl * mult, blk: stats.blk * mult, to: stats.to * mult,
      threes: stats.threes * mult, min: stats.min * mult,
      ejected: true,
    };
  }

  return stats;
}

// ── Sample a full team game (sum top-10 rotation) ───────────────────
// expectedByPlayer: map of playerName -> engine-projected {pts, reb, ast}
// Pre-computed by runMonteCarlo() so each player's matchup/fatigue/etc.
// adjustments flow into the sim's MEAN.
function _sampleTeamGame(team, side, expectedByPlayer, opts) {
  if (!team || !Array.isArray(team.players)) return { pts: 0, players: {} };
  const active = team.players
    .filter(p => (p.rating || 0) > 0)
    .slice(0, 10);
  const playerSamples = {};
  let totalPts = 0;
  active.forEach(p => {
    const exp = expectedByPlayer[p.name] || { pts: p.ppg || 0, reb: p.rpg || 0, ast: p.apg || 0 };
    const s = _samplePlayerGame(p, exp, opts);
    playerSamples[p.name] = s;
    totalPts += s.pts;
  });

  // Team-level pace variance: ±4%
  const paceMult = _sampleNormal(1, MC_CONFIG.teamPaceCV, 0.85, 1.15);
  totalPts *= paceMult;

  // Team 3PT variance — when a team gets hot from 3, margin explodes.
  const threePctMult = _sampleNormal(1, MC_CONFIG.teamThreePctCV, 0.75, 1.30);
  totalPts *= threePctMult;

  return { pts: totalPts, players: playerSamples, paceMult, threePctMult };
}

// ── Run the full sim ────────────────────────────────────────────────
// ARCHITECTURE: decouples team-level (margin/winner) from player-level
// (props) so they don't fight each other (the bug surfaced 5/13 where
// per-player sum diverged from team-level engine projection).
//
//   TEAM LEVEL: sample homeScore + awayScore around the engine's
//   calcGameProjection output, using its variance bands. This gives
//   margin distribution and winner probability — anchored to the engine.
//
//   PLAYER LEVEL: independently sample each player's stats around their
//   calcExpectedPlayerStats projection, for prop hit-rate. These don't
//   need to sum to the team total (they're a separate calibration).
function runMonteCarlo(series, gameNum, opts = {}) {
  const N = opts.iterations || MC_CONFIG.iterations;
  if (!series || !series.homeTeam || !series.awayTeam) return null;
  if (!Array.isArray(series.homeTeam.players) || series.homeTeam.players.length === 0) return null;

  const gameIdx = gameNum - 1;

  // ─── TEAM-LEVEL anchor: engine projection + variance bands ───
  if (typeof calcGameProjection !== 'function') return null;
  const eng = calcGameProjection(series, series.id, gameNum);
  if (!eng) return null;

  // Engine returns homeScoreRange/awayScoreRange as [low, high] arrays.
  // Treat the range as ~p10/p90 → stdev ≈ (p90 - p10) / 2.56 (normal approx).
  const homeRange = eng.homeScoreRange || [eng.homeScore - 8, eng.homeScore + 8];
  const awayRange = eng.awayScoreRange || [eng.awayScore - 8, eng.awayScore + 8];
  const homeStd = (homeRange[1] - homeRange[0]) / 2.56;
  const awayStd = (awayRange[1] - awayRange[0]) / 2.56;

  // ─── PLAYER-LEVEL anchors: engine projections for prop sampling ───
  const expectedHome = {};
  const expectedAway = {};
  if (typeof calcExpectedPlayerStats === 'function') {
    series.homeTeam.players.forEach(p => {
      if ((p.rating || 0) > 0) {
        try {
          const exp = calcExpectedPlayerStats(p, series, gameIdx, 'home');
          expectedHome[p.name] = { pts: exp.pts, reb: exp.reb, ast: exp.ast };
        } catch (e) {}
      }
    });
    series.awayTeam.players.forEach(p => {
      if ((p.rating || 0) > 0) {
        try {
          const exp = calcExpectedPlayerStats(p, series, gameIdx, 'away');
          expectedAway[p.name] = { pts: exp.pts, reb: exp.reb, ast: exp.ast };
        } catch (e) {}
      }
    });
  }

  // ─── Sample N games at team + player level INDEPENDENTLY ───
  const margins = [];
  const homeScores = [];
  const awayScores = [];
  const homeWins = [];
  const playerDist = {};

  function trackPlayer(name, s) {
    if (!playerDist[name]) playerDist[name] = { pts: [], reb: [], ast: [], stl: [], blk: [], to: [], threes: [], pra: [], stocks: [], min: [] };
    const d = playerDist[name];
    d.pts.push(s.pts); d.reb.push(s.reb); d.ast.push(s.ast);
    d.stl.push(s.stl); d.blk.push(s.blk); d.to.push(s.to);
    d.threes.push(s.threes); d.min.push(s.min);
    d.pra.push(s.pts + s.reb + s.ast);
    d.stocks.push(s.stl + s.blk);
  }

  // Pre-fetch player rosters so we don't refilter every iteration
  const homePlayers = series.homeTeam.players.filter(p => (p.rating || 0) > 0).slice(0, 10);
  const awayPlayers = series.awayTeam.players.filter(p => (p.rating || 0) > 0).slice(0, 10);

  for (let i = 0; i < N; i++) {
    // TEAM-LEVEL: sample around engine projection
    const homeScore = _sampleNormal(eng.homeScore, homeStd, 60, 180);
    const awayScore = _sampleNormal(eng.awayScore, awayStd, 60, 180);
    margins.push(homeScore - awayScore);
    homeScores.push(homeScore);
    awayScores.push(awayScore);
    homeWins.push(homeScore > awayScore ? 1 : 0);

    // PLAYER-LEVEL: sample each player's stat line independently
    homePlayers.forEach(p => {
      const exp = expectedHome[p.name] || { pts: p.ppg || 0, reb: p.rpg || 0, ast: p.apg || 0 };
      trackPlayer(p.name, _samplePlayerGame(p, exp, {}));
    });
    awayPlayers.forEach(p => {
      const exp = expectedAway[p.name] || { pts: p.ppg || 0, reb: p.rpg || 0, ast: p.apg || 0 };
      trackPlayer(p.name, _samplePlayerGame(p, exp, {}));
    });
  }

  // Aggregate
  const sortedMargins = [...margins].sort((a, b) => a - b);
  const sortedHome = [...homeScores].sort((a, b) => a - b);
  const sortedAway = [...awayScores].sort((a, b) => a - b);

  const homeWinPct = homeWins.reduce((a, b) => a + b, 0) / N;

  function statDist(name, arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    return {
      p5:  +_percentile(sorted, 0.05).toFixed(1),
      p10: +_percentile(sorted, 0.10).toFixed(1),
      p25: +_percentile(sorted, 0.25).toFixed(1),
      p50: +_percentile(sorted, 0.50).toFixed(1),
      p75: +_percentile(sorted, 0.75).toFixed(1),
      p90: +_percentile(sorted, 0.90).toFixed(1),
      p95: +_percentile(sorted, 0.95).toFixed(1),
      mean: +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1),
    };
  }

  // Per-player distribution summary
  const players = {};
  Object.entries(playerDist).forEach(([name, samples]) => {
    players[name] = {
      pts: statDist('pts', samples.pts),
      reb: statDist('reb', samples.reb),
      ast: statDist('ast', samples.ast),
      stl: statDist('stl', samples.stl),
      blk: statDist('blk', samples.blk),
      to: statDist('to', samples.to),
      threes: statDist('threes', samples.threes),
      pra: statDist('pra', samples.pra),
      stocks: statDist('stocks', samples.stocks),
      min: statDist('min', samples.min),
    };
  });

  // Re-derive venue (G3, G4, G6 at lower seed) for output meta
  const gameAtAwayVenue = (gameNum === 3 || gameNum === 4 || gameNum === 6);

  return {
    iterations: N,
    seriesId: series.id,
    gameNum,
    venue: gameAtAwayVenue ? series.awayTeam.abbr : series.homeTeam.abbr,
    homeWinProb: +homeWinPct.toFixed(3),
    margin: statDist('margin', margins),
    homeScore: statDist('home', homeScores),
    awayScore: statDist('away', awayScores),
    total: statDist('total', margins.map((_, i) => homeScores[i] + awayScores[i])),
    players,
  };
}

// ── Helper: hit rate for a specific prop line ──────────────────────
// Given a player + stat + line + over/under, returns the empirical
// probability from the sim that the prop hits.
function calcPropHitRate(simResult, playerName, statType, line, direction) {
  if (!simResult || !simResult.players) return null;
  const playerData = simResult.players[playerName];
  if (!playerData) {
    // Try fuzzy match — sample names may have "L. James" vs "LeBron James"
    const match = Object.keys(simResult.players).find(n => n.toLowerCase().includes(playerName.toLowerCase()) || playerName.toLowerCase().includes(n.toLowerCase()));
    if (!match) return null;
  }
  // We need the raw samples, not just percentiles — re-walk? Or we
  // can approximate from percentiles. For now return null and document
  // that this helper needs the sim to retain raw samples to be useful.
  // (Next iteration: have runMonteCarlo retain raw arrays under
  // simResult._raw for hit-rate lookup.)
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runMonteCarlo,
    calcPropHitRate,
    _sampleNormal,
    _samplePlayerGame,
    _sampleTeamGame,
    MC_CONFIG,
  };
}
