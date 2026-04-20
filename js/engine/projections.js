// ============================================================
// GAME PROJECTION ENGINE (2025 Playoff Research-Backed)
// ============================================================
// 2025 NBA Playoffs showed massive margin variance:
// - 1v8 seeds: avg margins 20-30+ (CLE-MIA +30.5 avg, OKC-MEM +19.5 avg)
// - Even series: avg margins 4-11 (NYK-DET +4.3, DEN-LAC +11.7)
// - Within-series: OKC-MEM went 51→19→6→2 as coaches adjusted
// - Elimination games compress margins (fight-or-fold)
// - Blowout cascades: early runs compound via bench garbage time
// - 2025 set record with 4 games decided by 40+ pts

function calcGameProjection(series, seriesId, gameNum) {
  const prob = calcWinProb(series, seriesId);
  const hr = prob.homeRating || calcTeamRating(series.homeTeam, series, seriesId);
  const ar = prob.awayRating || calcTeamRating(series.awayTeam, series, seriesId);
  const diff = hr - ar;
  const hca = prob.hcaUsed || 3.0;
  const totalDiff = diff + hca;

  // --- STEP 1: Base Expected Margin ---
  // Team ratings are on a 20-100 scale (not 0-10 Net Rating), so diff can be large.
  // Use win probability to derive margin: logit-based conversion.
  // NBA research: P(win) maps to expected margin via ~30pt logistic scale.
  // margin ≈ 15 * log10(P/(1-P)) — inverse of our win prob formula, gives points.
  const winP = Math.max(0.02, Math.min(0.98, prob.home / 100));
  let baseMargin = 15 * Math.log10(winP / (1 - winP)); // exact inverse of the logistic
  // This naturally produces: 50% → 0pts, 60% → 2.6pts, 70% → 5.6pts, 80% → 9.1pts, 90% → 14.3pts

  // --- STEP 2: Talent Gap Amplifier ---
  // 2025 evidence: OKC (68-14) beat MEM by 51 in G1; CLE beat MIA by 55 in G4
  // When the gap is massive, blowouts become likely because:
  // 1. Bench depth disparity compounds (garbage time widens margin)
  // 2. Better team controls pace and shot quality
  // 3. Weaker team's secondary players can't compensate
  const absMarginBase = Math.abs(baseMargin);
  const absDiff = Math.abs(totalDiff);
  // Talent multiplier is intentionally gentle — big blowouts come from variance, not expectation
  // NBA spreads rarely exceed -14 even for dominant matchups
  let talentMultiplier = 1.0;
  if (absMarginBase > 8) talentMultiplier = 1.0 + (absMarginBase - 8) * 0.02;
  talentMultiplier = Math.min(talentMultiplier, 1.25);
  baseMargin *= talentMultiplier;

  // --- STEP 3: Depth Disparity Factor ---
  // 2025 evidence: CLE's 138-83 blowout used 10+ players effectively; MIA had 5
  // Teams with deeper rotations extend leads via fresh legs in Q3/Q4
  const homeActive = series.homeTeam.players.filter(p => {
    const r = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return r >= 55;
  }).length;
  const awayActive = series.awayTeam.players.filter(p => {
    const r = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return r >= 55;
  }).length;
  const depthEdge = (homeActive - awayActive) * 0.6;
  baseMargin += depthEdge;

  // --- STEP 4: Star Absence Blowout Boost ---
  // 2025 evidence: LAL without Doncic+Reaves lost G1 by 22; MIL without Lillard lost G4 by 26
  // When a team is missing a star, the MARGIN widens (not just win probability)
  const homeStarsOut = series.homeTeam.players.filter(p => {
    const br = p.baseRating || p.rating || 0;
    const eff = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return br >= 75 && eff === 0;
  }).length;
  const awayStarsOut = series.awayTeam.players.filter(p => {
    const br = p.baseRating || p.rating || 0;
    const eff = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return br >= 75 && eff === 0;
  }).length;
  baseMargin += (awayStarsOut - homeStarsOut) * 2.0; // Each star absence widens margin ~2 pts

  // --- STEP 5: activeInjury Drag ---
  // 2025 evidence: Edwards at 0.7 severity shot 7-19; partially hurt stars reduce efficiency
  // and tire faster, leading to Q3/Q4 collapses that widen margins
  let homeInjuryDrag = 0, awayInjuryDrag = 0;
  series.homeTeam.players.forEach(p => {
    if (p.activeInjury && p.activeInjury.severity > 0.3) {
      const br = p.baseRating || p.rating || 0;
      homeInjuryDrag += p.activeInjury.severity * (br / 100) * 1.0;
    }
  });
  series.awayTeam.players.forEach(p => {
    if (p.activeInjury && p.activeInjury.severity > 0.3) {
      const br = p.baseRating || p.rating || 0;
      awayInjuryDrag += p.activeInjury.severity * (br / 100) * 1.0;
    }
  });
  baseMargin += (awayInjuryDrag - homeInjuryDrag);

  // --- STEP 5b: Fatigue Differential (MEDIUM CONFIDENCE) ---
  // Teams with higher cumulative fatigue lose margin points.
  // G1 validation: altitude fatigue (MIN@DEN), age fatigue (LeBron),
  // injury-compounded fatigue (Sharpe fibula, Tatum Achilles).
  // Fatigue differentials widen margins when one team is significantly more rested.
  const homeFat = calcTeamFatigue(series.homeTeam, series, seriesId || series.id);
  const awayFat = calcTeamFatigue(series.awayTeam, series, seriesId || series.id);
  const fatigueDiff = (awayFat.index - homeFat.index) * 4.0; // max ~0.5 index → 2.0 pts
  baseMargin += fatigueDiff;

  // --- STEP 6: Pre-compression cap ---
  // Cap the "raw talent edge" margin before applying game-context adjustments.
  // This ensures coaching adjustments, clutch compression, and elimination intensity
  // can still REDUCE the margin below the cap for G2+, creating game-to-game variety.
  baseMargin = Math.max(-18, Math.min(18, baseMargin));

  // --- STEP 7: Coaching Adjustment Compression (applied AFTER cap) ---
  // 2025 evidence: OKC-MEM margins went 51→19→6→2 as Taylor adjusted
  // Losing coaches study film and counter; margins shrink each game
  const score = getSeriesScore(series);
  const gamesPlayed = score.home + score.away;
  if (gamesPlayed > 0 && gameNum > 1) {
    const homeTrailing = score.away > score.home;
    const trailingCoach = homeTrailing ? (series.coaching?.home?.adjustmentRating || 6) : (series.coaching?.away?.adjustmentRating || 6);
    const adjustmentRate = 0.10 + (trailingCoach / 10) * 0.08; // 10-18% per game depending on coach quality
    const compression = 1 - Math.min(0.50, adjustmentRate * (gameNum - 1));
    baseMargin *= compression;
  }

  // --- STEP 8: Elimination Game Intensity ---
  const isElimination = score.home === 3 || score.away === 3;
  const isMustWin = (score.home === 3 && score.away < 3) || (score.away === 3 && score.home < 3);
  if (isElimination) {
    baseMargin *= 0.65; // 35% compression for elimination games
  }
  const seriesDiff = Math.abs(score.home - score.away);
  if (gamesPlayed >= 3 && seriesDiff <= 1) {
    baseMargin *= 0.8; // tight series = tight games
  }

  // --- STEP 9: Clutch Team Compression ---
  const homeClutch = series.homeTeam.advStats.clutchNetRtg || 0;
  const awayClutch = series.awayTeam.advStats.clutchNetRtg || 0;
  if (homeClutch > 3 && awayClutch > 3) {
    baseMargin *= 0.85; // Two clutch teams → games stay close
  }

  // --- STEP 10: Pace-Based Score Projection ---
  // Use team pace and efficiency to generate realistic total points
  const homePace = series.homeTeam.advStats.pace || 99;
  const awayPace = series.awayTeam.advStats.pace || 99;
  const homeOrtg = series.homeTeam.advStats.ortg || 114;
  const awayOrtg = series.awayTeam.advStats.ortg || 114;
  const homeDrtg = series.homeTeam.advStats.drtg || 113;
  const awayDrtg = series.awayTeam.advStats.drtg || 113;

  // Playoff games average ~96-99 possessions (slightly slower than reg season)
  const avgPace = (homePace + awayPace) / 2;
  const playoffPaceFactor = 0.97; // playoffs slow down ~3%
  const possessions = avgPace * playoffPaceFactor;

  // Each team's expected efficiency against the other's defense
  // Home team offense vs away defense, with HCA boost
  const homeEfficiency = (homeOrtg * 0.6 + awayDrtg * 0.4) / 100; // blend of own offense and opponent D
  const awayEfficiency = (awayOrtg * 0.6 + homeDrtg * 0.4) / 100;

  // Raw expected scores (per 100 possessions → actual)
  let homeExpected = possessions * homeEfficiency;
  let awayExpected = possessions * awayEfficiency;

  // Adjust to match our predicted margin
  const rawMargin = homeExpected - awayExpected;
  const marginAdj = (baseMargin - rawMargin) / 2;
  homeExpected += marginAdj;
  awayExpected -= marginAdj;

  // Round to realistic scores
  const homeScore = Math.round(homeExpected);
  const awayScore = Math.round(awayExpected);
  const margin = homeScore - awayScore;

  // --- STEP 11: Variance Profile ---
  // Calculate probability of different game characters
  const absMargin = Math.abs(margin);
  let blowoutProb, closeProb, character;

  // Blowout probability based on predicted margin and historical 2025 data
  // 2025 had ~15% of games decided by 20+, ~8% by 30+
  if (absMargin >= 18) {
    blowoutProb = Math.min(50, 25 + (absMargin - 18) * 2);
    closeProb = Math.max(5, 12 - (absMargin - 18));
  } else if (absMargin >= 10) {
    blowoutProb = Math.min(30, 10 + (absMargin - 10) * 2);
    closeProb = Math.max(15, 25 - (absMargin - 10) * 1.5);
  } else if (absMargin >= 5) {
    blowoutProb = Math.max(5, 5 + (absMargin - 5));
    closeProb = Math.min(40, 30 + (10 - absMargin) * 2);
  } else {
    blowoutProb = 5;
    closeProb = Math.min(50, 40 + (5 - absMargin) * 3);
  }

  // Elimination games shift distribution
  if (isElimination) {
    blowoutProb = Math.max(5, blowoutProb * 0.6);
    closeProb = Math.min(55, closeProb * 1.4);
  }

  // Determine game character label
  if (absMargin >= 18) character = 'BLOWOUT RISK';
  else if (absMargin >= 12) character = 'SEPARATION';
  else if (absMargin >= 7) character = 'COMPETITIVE';
  else if (absMargin >= 4) character = 'GRIND';
  else character = 'COIN FLIP';

  // Margin range (±30% for realistic spread)
  const spreadFactor = Math.max(3, absMargin * 0.35 + 2);
  const lowMargin = Math.max(1, absMargin - Math.round(spreadFactor));
  const highMargin = absMargin + Math.round(spreadFactor * 1.2);

  const favTeam = margin >= 0 ? series.homeTeam : series.awayTeam;
  const dogTeam = margin >= 0 ? series.awayTeam : series.homeTeam;

  return {
    homeScore, awayScore, margin,
    absMargin, favTeam: favTeam.abbr, dogTeam: dogTeam.abbr,
    blowoutProb: Math.round(blowoutProb),
    closeProb: Math.round(closeProb),
    character,
    marginRange: `${favTeam.abbr} by ${lowMargin}-${highMargin}`,
    talentMultiplier: +talentMultiplier.toFixed(2),
    depthEdge: +depthEdge.toFixed(1)
  };
}

// RESEARCH: Series-stage pressure modifier (Mateus et al. 2024)
// Player behavior changes significantly between first and last games of series
// Later games: more perimeter shooting, conservative play, increased fouls, ball movement shifts
// Favorites become MORE favored in later games (experience + depth)
function getSeriesPressureMod(series) {
  const score = getSeriesScore(series);
  const totalGames = score.home + score.away;
  if (totalGames <= 1) return 0; // No modifier for G1-G2
  const isElimination = score.home === 3 || score.away === 3;
  const isTied = score.home === score.away;
  let mod = 0;
  // Later games slightly favor experienced teams (pedigree matters more)
  mod += totalGames * 0.1;
  // Elimination games add pressure that hurts less experienced teams
  if (isElimination) mod += 0.5;
  // Tied series add variance (favors higher-ceiling team)
  if (isTied && totalGames >= 4) mod += 0.3;
  return mod;
}

// Derive display string from games array (replaces duplicated actualResult strings)
function getGameResultDisplay(series, gameNum) {
  const g = series.games[gameNum - 1];
  if (!g || !g.winner) return null;
  const winnerIsHome = g.winner === series.homeTeam.abbr;
  const wScore = winnerIsHome ? g.homeScore : g.awayScore;
  const lScore = winnerIsHome ? g.awayScore : g.homeScore;
  const loser = winnerIsHome ? series.awayTeam.abbr : series.homeTeam.abbr;
  return `${g.winner} ${wScore} — ${loser} ${lScore}${g.notes ? '. ' + g.notes.split('.')[0] : ''}`;
}

