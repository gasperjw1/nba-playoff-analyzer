// ============================================================
// MONTE CARLO CHAOS SIMULATION ENGINE (Phase 40 → Phase 41 Ensemble)
// ============================================================
// Quarter-by-quarter simulation with INTERDEPENDENT state variables.
// Phase 41 UNIFIED ENSEMBLE: uses the BLENDED projection (manual pick
// winner + engine margin sizing) as the simulation baseline. This
// eliminates model/sim disagreements — the chaos sim now generates
// probability distributions around the same winner the deterministic
// model picks. When engine and manual pick disagree (high uncertainty),
// chaos variance widens 20% for a more honest probability spread.
//
// Uses a "perturbation model": the blended projection provides the
// baseline, then each iteration draws correlated chaos factors that
// shift the outcome. Factors feed into each other — shooting state
// affects momentum, momentum amplifies runs, fatigue compounds and
// degrades shooting, foul trouble changes rotations which changes
// the defensive matchup which changes the opponent's shooting.
//
// CALIBRATION TARGET: ATS margin SD = 11.5 pts (28,000+ NBA games).
// The simulation must produce SD ��� 11-12 to be realistic.
//
// Key research parameters:
//   - Margin SD = 11.5 pts (BoydsBets ATS data, 28K games)
//   - Team score SD = 12 pts game-to-game
//   - Playoff HCA = +4.5 pts (Samford Sports Analytics)
//   - 3PT% SD = ~8% game-to-game (binomial on ~35 attempts)
//   - Q4 FG% penalty ~1.8% vs Q1 (fatigue decay)
//   - Clutch FG% penalty = 5-8% in final 5 min of close games
//   - Foul trouble: bench at 60% of starter efficiency, -3.5 DRtg
//   - 10-0 runs: ~1.2 per team per game, 66% timeout halt rate
//   - Garbage time compression: ~20% margin reduction at 20+ pt lead
//   - Win prob: P = 1/(1+e^(-0.14*spread))
//   - Comeback from 10 at half: 23.7% (home), 13.4% (road)
//
// Sources: FiveThirtyEight Elo, Weimer et al. (2023 momentum),
//   Schilling (2019), Cabarkapa et al. (2022), Goldman & Rao (2013),
//   BoydsBets ATS, ProfessorMJ comeback data
// ============================================================

const SIM_CONFIG = {
  iterations: 1000,
  marginSD: 11.5,            // THE calibration target
  teamScoreSD: 12.0,         // individual team score SD
  quarterScoreSD: 8.0,       // per-quarter score SD — tuned to produce ~11.5 game margin SD

  // Chaos channel weights (how much each factor can shift the margin)
  shootingSwingMax: 8,       // max points from team shooting correlation
  foulTroubleSwing: 3.5,     // points lost when key player in foul trouble
  momentumRunSwing: 5,       // max points from a momentum run
  fatigueSwing: 3,           // max points from fatigue differential
  clutchSwing: 4,            // max points from clutch performance differential
  threePtVarianceSwing: 6,   // max from 3PT variance (biggest single factor)

  // Probabilities
  earlyFoulProb: 0.08,       // 8% chance key player gets 2 fouls in Q1
  coachBenchProb: 0.67,      // 67% coaches bench foul-troubled player
  runProb: 0.15,             // probability of a significant run per quarter
  timeoutHaltProb: 0.66,     // timeout stops run
  counterRunProb: 0.35,      // counter-run after timeout

  // Fatigue
  q4FatiguePenalty: 1.8,     // points of scoring drop in Q4 from fatigue
  veteranBonus: 0.3,         // partial clutch offset for veteran teams
  seriesFatiguePerGame: 0.5, // extra fatigue points per game past G4

  // Garbage time
  garbageThreshold: 20,
  garbageCompression: 0.80,

  // Clutch
  clutchThreshold: 6,        // "close game" = within 6 pts entering Q4
  clutchFGDrop: 0.06,        // 6% FG drop in clutch

  // 3PT correlation
  team3PtSD: 0.08            // 8% SD in team 3PT% per game
};

// ============================================================
// PSEUDORANDOM NUMBER GENERATOR (Mulberry32)
// ============================================================
function createRNG(seed) {
  let s = seed | 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller for normal distribution
function normalRandom(rng, mean, sd) {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
  return mean + sd * z;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ============================================================
// SINGLE GAME SIMULATION
// ============================================================
// Each game is simulated quarter-by-quarter. The state carries
// forward: Q1 foul trouble affects Q2 shooting which affects
// Q3 momentum which affects Q4 clutch performance.
function simulateGame(engineMargin, homeExpScore, awayExpScore, teamContext, rng, config) {
  // Quarter baselines (expected points per quarter)
  const homeQBase = homeExpScore / 4;
  const awayQBase = awayExpScore / 4;

  // ============================================
  // DRAW GAME-LEVEL CHAOS FACTORS
  // These are drawn ONCE per game and affect all quarters
  // ============================================

  // 1. TEAM SHOOTING TEMPERATURE
  // One draw per team per game — the "whole team is hot/cold" effect
  // This is the #1 source of game-to-game variance (3PT% SD = 8%)
  const homeShootingTemp = normalRandom(rng, 0, 1); // standard normal
  const awayShootingTemp = normalRandom(rng, 0, 1);
  // Convert to point swing: each SD of shooting temp = ~3 points
  // (8% 3PT swing × 35 attempts × 3pts × 0.35 = ~2.9 pts per SD)
  const homeShootingSwing = homeShootingTemp * 3.0;
  const awayShootingSwing = awayShootingTemp * 3.0;

  // ============================================
  // QUARTER-BY-QUARTER SIMULATION
  // ============================================
  let homeScore = 0;
  let awayScore = 0;
  const quarterScores = [];

  // Carry-forward state
  let homeFoulTrouble = false;
  let awayFoulTrouble = false;
  let homeBenchMode = false;  // key player benched
  let awayBenchMode = false;
  let momentum = 0;           // -1 (away), 0 (neutral), +1 (home)
  let momentumStrength = 0;   // 0-1
  let cumulativeFatigue = 0;  // builds through quarters

  for (let q = 1; q <= 4; q++) {
    let homeQScore = homeQBase;
    let awayQScore = awayQBase;

    // --- SHOOTING TEMPERATURE EFFECT ---
    // The game-level temperature creates a correlated baseline,
    // but each quarter has additional noise on top of it
    const qShootingNoise = normalRandom(rng, 0, 1.5); // quarter-level noise
    homeQScore += (homeShootingSwing + qShootingNoise * 0.3) * 0.25; // spread across quarters
    awayQScore += (awayShootingSwing - qShootingNoise * 0.3) * 0.25; // anti-correlated noise

    // --- FOUL TROUBLE CASCADE (Q1) ---
    // If key player gets early fouls → bench mode → scoring drops → opponent gains confidence
    if (q === 1) {
      if (rng() < config.earlyFoulProb) {
        homeFoulTrouble = true;
        if (rng() < config.coachBenchProb) {
          homeBenchMode = true;
          // Bench mode: scoring drops, defense weakens
          homeQScore -= config.foulTroubleSwing * 0.4;
          awayQScore += config.foulTroubleSwing * 0.3; // opponent benefits
          // THIS TRIGGERS MOMENTUM — opponent smells blood
          if (rng() < 0.4) {
            momentum = -1; // away gains momentum
            momentumStrength = 0.3;
          }
        }
      }
      if (rng() < config.earlyFoulProb) {
        awayFoulTrouble = true;
        if (rng() < config.coachBenchProb) {
          awayBenchMode = true;
          awayQScore -= config.foulTroubleSwing * 0.4;
          homeQScore += config.foulTroubleSwing * 0.3;
          if (rng() < 0.4) {
            momentum = 1;
            momentumStrength = 0.3;
          }
        }
      }
    }

    // --- FOUL TROUBLE CARRYOVER (Q2) ---
    // Player returns but plays passively — partial penalty
    if (q === 2) {
      if (homeFoulTrouble) {
        homeQScore -= config.foulTroubleSwing * 0.15; // lingering effect
        homeBenchMode = false; // player returns
      }
      if (awayFoulTrouble) {
        awayQScore -= config.foulTroubleSwing * 0.15;
        awayBenchMode = false;
      }
    }

    // --- MOMENTUM & SCORING RUNS ---
    // Momentum from previous quarter carries forward but decays.
    // Each quarter has a chance of a new run developing.
    // A run by one team means: they score MORE and the opponent scores LESS.
    // This is the interconnected cascade: cold shooting → opponent run →
    // timeout → counter-run (or not) → new momentum state.

    // Decay existing momentum
    momentumStrength *= 0.6;
    if (momentumStrength < 0.1) { momentum = 0; momentumStrength = 0; }

    // New run check
    if (rng() < config.runProb) {
      // Who goes on the run? Team with better shooting temp + momentum
      const homeRunChance = 0.5
        + (homeShootingTemp > 0 ? 0.1 : -0.1)
        + momentum * 0.1
        + (awayBenchMode ? 0.15 : 0)    // opponent weakness triggers runs
        - (homeBenchMode ? 0.15 : 0);
      const runIsHome = rng() < homeRunChance;

      // Run magnitude: 7-15 point swing
      const runMag = 3 + rng() * 4; // 3-7 point quarter swing
      if (runIsHome) {
        homeQScore += runMag * 0.6;
        awayQScore -= runMag * 0.4; // opponent's offense disrupted too
        momentum = 1;
        momentumStrength = 0.5 + rng() * 0.3;
      } else {
        awayQScore += runMag * 0.6;
        homeQScore -= runMag * 0.4;
        momentum = -1;
        momentumStrength = 0.5 + rng() * 0.3;
      }

      // Timeout response (66% chance)
      if (rng() < config.timeoutHaltProb) {
        // Timeout reduces the run's impact
        if (runIsHome) {
          homeQScore -= runMag * 0.2;
          awayQScore += runMag * 0.15;
        } else {
          awayQScore -= runMag * 0.2;
          homeQScore += runMag * 0.15;
        }
        momentumStrength *= 0.5;

        // Counter-run (35% chance after timeout)
        if (rng() < config.counterRunProb) {
          momentum = -momentum;
          momentumStrength = 0.3;
          const counterMag = 1.5 + rng() * 2;
          if (momentum > 0) { homeQScore += counterMag; awayQScore -= counterMag * 0.5; }
          else { awayQScore += counterMag; homeQScore -= counterMag * 0.5; }
        }
      }
    }

    // Apply lingering momentum effect
    if (momentum !== 0 && momentumStrength > 0.1) {
      const momPts = momentumStrength * 1.5;
      if (momentum > 0) { homeQScore += momPts * 0.3; awayQScore -= momPts * 0.2; }
      else { awayQScore += momPts * 0.3; homeQScore -= momPts * 0.2; }
    }

    // --- FATIGUE DECAY ---
    // Scoring drops in later quarters. This compounds with everything else:
    // a fatigued team is MORE vulnerable to runs, LESS likely to hit clutch shots.
    cumulativeFatigue += 0.25;
    if (q >= 3) {
      const fatiguePts = config.q4FatiguePenalty * (q === 3 ? 0.4 : 1.0);
      // Both teams get fatigued, but unevenly
      const homeFatigueShare = 0.5 + (teamContext.homeVeteran ? 0.05 : -0.05);
      homeQScore -= fatiguePts * homeFatigueShare;
      awayQScore -= fatiguePts * (1 - homeFatigueShare);

      // Fatigued teams turn the ball over more — this FEEDS the opponent's scoring
      const fatigueTOBonus = fatiguePts * 0.15;
      homeQScore += fatigueTOBonus * (1 - homeFatigueShare); // opponent's fatigue = your gain
      awayQScore += fatigueTOBonus * homeFatigueShare;
    }

    // --- Q4 CLUTCH PRESSURE ---
    // In close games, Q4 shooting drops 5-8%. But veteran teams handle it better.
    // The MARGIN between the teams determines if it's "close" — this depends on
    // all the accumulated chaos from Q1-Q3.
    if (q === 4) {
      const marginEnteringQ4 = Math.abs(homeScore - awayScore);
      if (marginEnteringQ4 <= config.clutchThreshold * 4) { // scale threshold to total score
        // Close game clutch penalty
        const clutchDrop = config.clutchSwing * (1 - marginEnteringQ4 / (config.clutchThreshold * 8));
        homeQScore -= clutchDrop * 0.5;
        awayQScore -= clutchDrop * 0.5;

        // Veteran clutch bonus
        if (teamContext.homeVeteran) homeQScore += clutchDrop * config.veteranBonus;
        if (teamContext.awayVeteran) awayQScore += clutchDrop * config.veteranBonus;

        // Random clutch hero — one team's star has a big Q4
        if (rng() < 0.25) {
          const heroBonus = 2 + rng() * 3;
          if (rng() < 0.5) homeQScore += heroBonus;
          else awayQScore += heroBonus;
        }
      }
    }

    // --- QUARTER NOISE ---
    // After all the structured chaos, add calibrated random noise.
    // This represents the thousands of micro-events we can't model.
    // The noise is the primary variance driver — calibrated to produce
    // game-level margin SD ≈ 11.5 when combined with the structured chaos.
    const qNoise = normalRandom(rng, 0, config.quarterScoreSD * 0.55);
    homeQScore += qNoise;
    awayQScore -= qNoise * 0.4; // partially anti-correlated (shared pace)

    // Ensure non-negative quarter scores and round
    homeQScore = Math.max(12, Math.round(homeQScore));
    awayQScore = Math.max(12, Math.round(awayQScore));

    homeScore += homeQScore;
    awayScore += awayQScore;
    quarterScores.push({ home: homeQScore, away: awayQScore });
  }

  // --- GARBAGE TIME COMPRESSION ---
  const rawMargin = homeScore - awayScore;
  if (Math.abs(rawMargin) >= config.garbageThreshold) {
    const compressed = rawMargin * config.garbageCompression;
    const adj = Math.round((compressed - rawMargin) / 2);
    homeScore += adj;
    awayScore -= adj;
  }

  // --- OVERTIME ---
  let wentToOT = false;
  if (homeScore === awayScore) {
    wentToOT = true;
    // OT: reduced scoring, extreme fatigue, veteran advantage
    const otHome = Math.round(6 + normalRandom(rng, 0, 3));
    const otAway = Math.round(6 + normalRandom(rng, 0, 3));
    homeScore += Math.max(2, otHome);
    awayScore += Math.max(2, otAway);
    // Still tied — coin flip with slight home edge
    if (homeScore === awayScore) {
      if (rng() < 0.6) homeScore += 2; else awayScore += 2;
    }
  }

  return {
    homeScore, awayScore,
    margin: homeScore - awayScore,
    quarterScores,
    wentToOT
  };
}

// ============================================================
// EXTRACT TEAM CONTEXT FROM SERIES DATA
// ============================================================
// Phase 41: Uses BLENDED projection as baseline (not raw engine).
// The blended system picks winners at 72.7% accuracy; the engine
// sizes margins at 8.8 avg error. By starting from the blended
// baseline, the sim's probability distribution centers on the
// most accurate winner call. When the engine and manual pick
// disagree, we widen the chaos variance — an honest signal that
// the outcome is genuinely uncertain.
function extractTeamContext(series, seriesId, gameNum) {
  const blended = calcBlendedProjection(series, seriesId, gameNum);

  // Veteran presence
  const homeVet = series.homeTeam.players.some(p =>
    (p.baseRating || p.rating || 0) >= 80 && (p.playoffAscension || 0) >= 1
  );
  const awayVet = series.awayTeam.players.some(p =>
    (p.baseRating || p.rating || 0) >= 80 && (p.playoffAscension || 0) >= 1
  );

  // Series fatigue adjustment
  const score = getSeriesScore(series);
  const gamesPlayed = score.home + score.away;
  const seriesFatigueAdj = gamesPlayed >= 4
    ? (gamesPlayed - 4) * SIM_CONFIG.seriesFatiguePerGame
    : 0;

  return {
    engineProjection: blended,  // Phase 41: blended baseline
    rawEngineMargin: blended.margin,       // original engine margin (pre-blend)
    blendedMargin: blended.blendedMargin,  // blended margin (engine + manual pick)
    blendedHomeScore: blended.blendedHomeScore,
    blendedAwayScore: blended.blendedAwayScore,
    consensus: blended.consensus || 'engine-only',
    homeVeteran: homeVet,
    awayVeteran: awayVet,
    seriesFatigue: seriesFatigueAdj,
    isElimination: score.home === 3 || score.away === 3,
    seriesScore: score
  };
}

// ============================================================
// MAIN MONTE CARLO ENTRY POINT
// ============================================================
function runMonteCarloSimulation(series, seriesId, gameNum, iterations) {
  const n = iterations || SIM_CONFIG.iterations;
  const config = { ...SIM_CONFIG };
  const ctx = extractTeamContext(series, seriesId, gameNum);

  // Phase 41: Use BLENDED projection as simulation baseline
  // The blended system combines the manual pick winner (72.7% accuracy)
  // with the engine's margin sizing (8.8 avg error). The sim then
  // generates the probability distribution around this unified baseline.
  const simMargin = ctx.blendedMargin;
  const simHomeScore = ctx.blendedHomeScore;
  const simAwayScore = ctx.blendedAwayScore;

  // Series context adjustments
  if (ctx.isElimination) {
    config.runProb *= 0.7;       // fewer unchecked runs
    config.clutchSwing *= 1.3;   // more pressure
    config.quarterScoreSD *= 0.9; // tighter games
  }
  if (ctx.seriesFatigue > 0) {
    config.q4FatiguePenalty += ctx.seriesFatigue;
  }

  // Phase 41: DISAGREEMENT VARIANCE SCALING
  // When the engine and manual pick disagree on the winner, that's a
  // genuine signal of uncertainty. Widen the chaos distribution so the
  // sim produces a flatter, more honest probability spread.
  // When they agree, tighten slightly — both systems are confident.
  if (ctx.consensus === 'disagree') {
    config.quarterScoreSD *= 1.20;  // 20% more chaos — wider distribution
    config.shootingSwingMax *= 1.15; // shooting swings amplified
  } else if (ctx.consensus === 'strong-agree') {
    config.quarterScoreSD *= 0.95;  // 5% tighter — both systems confident
  }

  // Run simulations
  const margins = [];
  const homeScores = [];
  const awayScores = [];
  let homeWins = 0;
  let otGames = 0;
  const marginBuckets = {};

  for (let i = 0; i < n; i++) {
    const rng = createRNG(42 + i * 7919);
    const result = simulateGame(
      simMargin, simHomeScore, simAwayScore, ctx, rng, config
    );

    margins.push(result.margin);
    homeScores.push(result.homeScore);
    awayScores.push(result.awayScore);
    if (result.margin > 0) homeWins++;
    if (result.wentToOT) otGames++;

    const bucket = Math.round(result.margin / 2) * 2;
    marginBuckets[bucket] = (marginBuckets[bucket] || 0) + 1;
  }

  // Aggregate statistics
  const homeWinPct = homeWins / n;
  const awayWinPct = 1 - homeWinPct;
  const meanMargin = margins.reduce((a, b) => a + b, 0) / n;
  const marginVariance = margins.reduce((a, b) => a + (b - meanMargin) ** 2, 0) / n;
  const marginStdDev = Math.sqrt(marginVariance);
  const meanHome = homeScores.reduce((a, b) => a + b, 0) / n;
  const meanAway = awayScores.reduce((a, b) => a + b, 0) / n;

  // Percentiles
  const sorted = [...margins].sort((a, b) => a - b);
  const p5 = sorted[Math.floor(n * 0.05)];
  const p25 = sorted[Math.floor(n * 0.25)];
  const p50 = sorted[Math.floor(n * 0.50)];
  const p75 = sorted[Math.floor(n * 0.75)];
  const p95 = sorted[Math.floor(n * 0.95)];

  const sortedHome = [...homeScores].sort((a, b) => a - b);
  const sortedAway = [...awayScores].sort((a, b) => a - b);

  // Game character rates from actual sim
  const blowouts = margins.filter(m => Math.abs(m) >= 18).length;
  const closeGames = margins.filter(m => Math.abs(m) <= 5).length;

  // Histogram
  const histogram = Object.entries(marginBuckets)
    .map(([margin, count]) => ({ margin: +margin, count, pct: count / n }))
    .sort((a, b) => a.margin - b.margin);

  // Cross-check vs logistic (uses blended margin now)
  const logisticWinProb = 1 / (1 + Math.exp(-0.14 * simMargin));

  const homeFavored = homeWinPct >= 0.5;
  const favTeam = homeFavored ? series.homeTeam.abbr : series.awayTeam.abbr;
  const dogTeam = homeFavored ? series.awayTeam.abbr : series.homeTeam.abbr;

  return {
    homeWinPct: +(homeWinPct * 100).toFixed(1),
    awayWinPct: +(awayWinPct * 100).toFixed(1),
    favTeam, dogTeam,
    favWinPct: +((homeFavored ? homeWinPct : awayWinPct) * 100).toFixed(1),
    meanHomeScore: Math.round(meanHome),
    meanAwayScore: Math.round(meanAway),
    meanMargin: +meanMargin.toFixed(1),
    marginSD: +marginStdDev.toFixed(1),
    homeScoreRange: [sortedHome[Math.floor(n * 0.05)], sortedHome[Math.floor(n * 0.95)]],
    awayScoreRange: [sortedAway[Math.floor(n * 0.05)], sortedAway[Math.floor(n * 0.95)]],
    marginRange: [p5, p95],
    percentiles: { p5, p25, p50, p75, p95 },
    blowoutRate: +((blowouts / n) * 100).toFixed(1),
    closeGameRate: +((closeGames / n) * 100).toFixed(1),
    overtimeRate: +((otGames / n) * 100).toFixed(1),
    histogram,
    engineSpread: +simMargin.toFixed(1),
    rawEngineSpread: +(ctx.rawEngineMargin).toFixed(1),  // Phase 41: pre-blend engine margin
    logisticWinProb: +(logisticWinProb * 100).toFixed(1),
    simVsLogisticDiff: +((homeWinPct - logisticWinProb) * 100).toFixed(1),
    engineProjection: ctx.engineProjection,
    consensus: ctx.consensus,  // Phase 41: expose agreement signal
    iterations: n,
    isElimination: ctx.isElimination,
    seriesScore: `${ctx.seriesScore.home}-${ctx.seriesScore.away}`
  };
}

// ============================================================
// SERIES OUTCOME SIMULATION
// ============================================================
function simulateSeriesOutcome(series, seriesId, iterations) {
  const n = iterations || 500;
  const score = getSeriesScore(series);

  if (score.home >= 4 || score.away >= 4) {
    return {
      homeSeriesWinPct: score.home >= 4 ? 100 : 0,
      awaySeriesWinPct: score.away >= 4 ? 100 : 0,
      expectedGames: score.home + score.away,
      gamesDistribution: {},
      winner: score.home >= 4 ? series.homeTeam.abbr : series.awayTeam.abbr
    };
  }

  let homeSeriesWins = 0;
  const gamesDistribution = { 4: 0, 5: 0, 6: 0, 7: 0 };

  for (let i = 0; i < n; i++) {
    let hWins = score.home;
    let aWins = score.away;
    let gameNum = hWins + aWins + 1;

    while (hWins < 4 && aWins < 4 && gameNum <= 7) {
      const rng = createRNG(42 + i * 7919 + gameNum * 1013);
      const ctx = extractTeamContext(series, seriesId, gameNum);
      const config = { ...SIM_CONFIG };
      if (ctx.isElimination || hWins === 3 || aWins === 3) {
        config.runProb *= 0.7;
        config.clutchSwing *= 1.3;
      }
      // Phase 41: use blended baseline for series simulation too
      if (ctx.consensus === 'disagree') {
        config.quarterScoreSD *= 1.20;
        config.shootingSwingMax *= 1.15;
      } else if (ctx.consensus === 'strong-agree') {
        config.quarterScoreSD *= 0.95;
      }
      const result = simulateGame(ctx.blendedMargin, ctx.blendedHomeScore, ctx.blendedAwayScore, ctx, rng, config);
      if (result.margin > 0) hWins++; else aWins++;
      gameNum++;
    }

    const total = hWins + aWins;
    if (hWins >= 4) {
      homeSeriesWins++;
      gamesDistribution[total] = (gamesDistribution[total] || 0) + 1;
    } else {
      gamesDistribution[total] = (gamesDistribution[total] || 0) + 1;
    }
  }

  const pct = (homeSeriesWins / n) * 100;
  const expectedGames = Object.entries(gamesDistribution)
    .reduce((sum, [g, c]) => sum + (+g * c), 0) / n;

  return {
    homeSeriesWinPct: +pct.toFixed(1),
    awaySeriesWinPct: +(100 - pct).toFixed(1),
    expectedGames: +expectedGames.toFixed(1),
    gamesDistribution: Object.fromEntries(
      Object.entries(gamesDistribution).map(([k, v]) => [k, +((v / n) * 100).toFixed(1)])
    ),
    winner: pct > 50 ? series.homeTeam.abbr : series.awayTeam.abbr,
    iterations: n
  };
}
