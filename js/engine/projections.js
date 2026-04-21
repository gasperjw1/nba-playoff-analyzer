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
    // UPGRADED: 15-30% range (was 10-18%) — elite coaches make bigger adjustments
    const adjustmentRate = 0.15 + (trailingCoach / 10) * 0.15; // 15-30% per game depending on coach quality
    const compression = 1 - Math.min(0.55, adjustmentRate * (gameNum - 1));
    baseMargin *= compression;
  }

  // --- STEP 7b: G1 Result Impact / Momentum Shift ---
  // After G1 results are known, adjust G2+ margins based on what ACTUALLY happened.
  // This creates meaningful game-to-game differentiation.
  // Key factors:
  //   - Upsets (road team wins G1) trigger strong home bounce-back in G2
  //   - Blowouts signal talent gap OR variance; moderate regression to mean
  //   - G1 loser's coaching adjustments compress expected margin
  //   - G1 overperformance/underperformance vs model prediction informs G2 shift
  if (gamesPlayed > 0 && gameNum > 1) {
    const g1 = series.games[0];
    if (g1 && g1.winner) {
      const g1Margin = (g1.homeScore || 0) - (g1.awayScore || 0); // positive = home won
      const homeWonG1 = g1.winner === series.homeTeam.abbr;
      const g1AbsMargin = Math.abs(g1Margin);

      // Factor A: Upset bounce-back
      // Road teams winning G1 is historically a strong predictor of home team
      // responding aggressively in G2. Home teams that lose G1 win G2 ~62% of the time.
      // If the home team lost G1, shift margin toward home by 2-4 pts
      if (!homeWonG1) {
        // Home lost G1 → bounce-back factor shifts margin toward home
        const homeCoachRating = series.coaching?.home?.adjustmentRating || 6;
        const bounceBackPts = 2.0 + (homeCoachRating / 10) * 2.0; // 2-4 pts based on coach
        baseMargin += bounceBackPts; // positive = more home-favored
      } else {
        // Home won G1 → road team gets a smaller bounce-back (film adjustments)
        const awayCoachRating = series.coaching?.away?.adjustmentRating || 6;
        const roadBounce = 1.0 + (awayCoachRating / 10) * 1.5; // 1-2.5 pts
        baseMargin -= roadBounce; // shift slightly toward away
      }

      // Factor B: Blowout regression / close-game persistence
      // Blowouts (20+) rarely repeat consecutively — regression is strong
      // Close games (< 6) suggest evenly matched teams → minimal shift
      if (g1AbsMargin >= 25) {
        // Massive blowout → strong regression (blowouts overstate true talent gap)
        // Reduce expected margin by 25-35% toward zero
        const blowoutRegression = 0.25 + Math.min(0.10, (g1AbsMargin - 25) * 0.005);
        baseMargin *= (1 - blowoutRegression);
      } else if (g1AbsMargin >= 15) {
        // Solid win → moderate regression
        const solidRegression = 0.12 + (g1AbsMargin - 15) * 0.013;
        baseMargin *= (1 - solidRegression);
      } else if (g1AbsMargin <= 5) {
        // Very close game → both teams stay near baseline, add slight variance
        // Coin-flip games don't create much G2 shift
        baseMargin *= 0.97; // minimal compression
      }

      // Factor C: G1 Outcome vs Model Prediction feedback
      // If G1 result significantly deviated from model prediction, G2 regresses
      // toward the model (the "surprised" direction). This handles scenarios like
      // HOU-LAL where LAL upset but model had HOU favored — G2 should still lean HOU
      // but less than G1 prediction did.
      // Use the sign of g1Margin vs sign of baseMargin to detect "surprise" results
      const modelPredictedHomeFav = baseMargin > 0;
      const g1HomeFav = g1Margin > 0;
      if (modelPredictedHomeFav !== g1HomeFav && g1AbsMargin >= 5) {
        // G1 result contradicted model → model adjusts 30% toward G1 reality
        // This creates meaningful swing: e.g., model said HOU by 5, but LAL won by 9
        // → G2 model shifts from HOU by 5 to roughly HOU by 1-2
        const surpriseShift = g1Margin * 0.30;
        baseMargin += surpriseShift;
      }
    }
  }

  // --- STEP 8: Elimination Game Intensity ---
  // In a best-of-7, any game where one team is at 3 wins IS a must-win for the trailing team
  const isElimination = score.home === 3 || score.away === 3;
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

  // Playoff games average ~95-98 possessions (slower than reg season)
  // PHASE 17 (Cabarkapa et al. 2022): Playoff play is MORE CONSERVATIVE — fewer FGA,
  // assists, steals, turnovers, and total points due to increased defensive pressure.
  // Pace reduction updated from 3% to 5% based on research (PLAYOFF_ADJUSTMENT.paceReduction).
  const avgPace = (homePace + awayPace) / 2;
  const playoffPaceFactor = (typeof PLAYOFF_ADJUSTMENT !== 'undefined') ? PLAYOFF_ADJUSTMENT.paceReduction : 0.95;
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

// ============================================================
// EXPECTED PLAYER STATS ENGINE (Multi-Factor Projection)
// ============================================================
// Derives per-player expected stats for a specific game using ALL model variables:
//   1. Playoff Ascension — stars elevate beyond regular season
//   2. Pace Adjustment — playoffs are ~5% slower (Cabarkapa et al.)
//   3. Minutes Projection — stars play more MPG in playoffs
//   4. Opponent Defensive Quality — opponent DRtg vs league average
//   5. Fatigue — age, cumulative minutes, active injury compounding
//   6. Active Injury Drag — playing hurt reduces output
//   7. Defensive Matchup Suppression — elite D on primary target
//   8. Role Change — coaching-driven role elevation/reduction
//   9. Home Court Advantage — slight boost for home players
//  10. Coaching Compression — margins shrink as series progresses
//  11. Synergy / Chemistry — lineup complementarity affects all stats
//  12. On/Off Context — player's impact magnitude scales expectations
//  13. External Factors — off-court issues reduce/boost performance
//
// Returns: { pts, reb, ast, modifiers[] } where each modifier has
//   { label, ptsDelta, rebDelta, astDelta, pct }

function calcExpectedPlayerStats(player, series, gameIdx, side) {
  const gameNum = gameIdx + 1;
  const isHome = (side === 'home');
  const team = isHome ? series.homeTeam : series.awayTeam;
  const opp = isHome ? series.awayTeam : series.homeTeam;

  let pts = player.ppg || 0;
  let reb = player.rpg || 0;
  let ast = player.apg || 0;
  const modifiers = [];

  if (pts === 0 && reb === 0 && ast === 0) return { pts: 0, reb: 0, ast: 0, modifiers: [] };

  // ---- 1. PLAYOFF ASCENSION ----
  // Stars with playoff track record elevate (Brunson +4.6 PPG 2024, Luka +3.2 PPG 2024)
  const asc = player.playoffAscension || 0;
  if (asc > 0) {
    const ptsMod = pts * asc * 0.12;
    const rebMod = reb * asc * 0.06;
    const astMod = ast * asc * 0.06;
    pts += ptsMod; reb += rebMod; ast += astMod;
    modifiers.push({ label: 'Playoff Ascension', ptsDelta: ptsMod, rebDelta: rebMod, astDelta: astMod, pct: +(asc * 12).toFixed(0) });
  }

  // ---- 2. PACE ADJUSTMENT (Cabarkapa et al. 2022) ----
  // Playoffs are 5% slower → fewer possessions → lower counting stats
  // Rebounds less affected (boards per possession roughly constant)
  const paceRed = PLAYOFF_ADJUSTMENT.paceReduction; // 0.95
  const ptsPace = pts * (paceRed - 1);
  const astPace = ast * (paceRed - 1);
  const rebPace = reb * (1 - 0.02) - reb; // rebounds only ~2% reduced
  pts += ptsPace; ast += astPace; reb += rebPace;
  modifiers.push({ label: 'Playoff Pace', ptsDelta: ptsPace, rebDelta: rebPace, astDelta: astPace, pct: -5 });

  // ---- 3. MINUTES PROJECTION ----
  // Stars play 3-6 more MPG in playoffs. Scale stats proportionally.
  // Top 1-3 players get bigger minutes bump; bench players may see less.
  const sortedByRating = [...team.players].sort((a, b) => (b.baseRating || b.rating || 0) - (a.baseRating || a.rating || 0));
  const playerRank = sortedByRating.findIndex(p => p.name === player.name);
  let minutesBump = 0;
  if (playerRank <= 1) minutesBump = 0.12;       // star: ~12% more minutes
  else if (playerRank <= 3) minutesBump = 0.08;   // starter: ~8% more
  else if (playerRank <= 5) minutesBump = 0.03;   // rotation: ~3% more
  else minutesBump = -0.05;                        // deep bench: fewer minutes

  const ptsMin = pts * minutesBump;
  const rebMin = reb * minutesBump;
  const astMin = ast * minutesBump;
  pts += ptsMin; reb += rebMin; ast += astMin;
  if (Math.abs(minutesBump) > 0.01) {
    modifiers.push({ label: 'Playoff Minutes', ptsDelta: ptsMin, rebDelta: rebMin, astDelta: astMin, pct: +(minutesBump * 100).toFixed(0) });
  }

  // ---- 4. OPPONENT DEFENSIVE QUALITY ----
  // Compare opponent DRtg to league average (~113). Better D = lower scoring.
  // Rebounds affected by opponent ORB/DRB tendencies; assists by defensive disruption.
  const leagueAvgDRtg = 113;
  const oppDRtg = opp.advStats.drtg || leagueAvgDRtg;
  const defQualityMod = (leagueAvgDRtg - oppDRtg) * 0.015; // positive if opp is better D (lower DRtg)
  const ptsOppD = pts * defQualityMod;
  const astOppD = ast * defQualityMod * 0.5; // assists less directly suppressed
  pts += ptsOppD; ast += astOppD;
  if (Math.abs(defQualityMod) > 0.005) {
    modifiers.push({ label: 'Opp Defense (' + oppDRtg.toFixed(1) + ' DRtg)', ptsDelta: ptsOppD, rebDelta: 0, astDelta: astOppD, pct: +(defQualityMod * 100).toFixed(1) });
  }

  // ---- 5. FATIGUE (Medium Confidence) ----
  // Uses the full fatigue engine: age, minutes load, active injury compounding,
  // mental fatigue, role-based load, rest recovery curve
  const fatigue = calcPlayerFatigue(player, series);
  if (fatigue > 0.02) {
    // Fatigue primarily reduces scoring efficiency and assists (decision-making)
    // Rebounds less affected (effort-based, not skill-degradation)
    const ptsFat = -pts * fatigue * 0.18;
    const astFat = -ast * fatigue * 0.15;
    const rebFat = -reb * fatigue * 0.05;
    pts += ptsFat; ast += astFat; reb += rebFat;
    modifiers.push({ label: 'Fatigue (' + (fatigue * 100).toFixed(0) + '%)', ptsDelta: ptsFat, rebDelta: rebFat, astDelta: astFat, pct: -(fatigue * 18).toFixed(1) });
  }

  // ---- 6. ACTIVE INJURY DRAG ----
  // Players playing through injuries have reduced output beyond fatigue
  // Edwards at 0.7 severity shot 7-19 in G1 — direct efficiency impact
  if (player.activeInjury && player.activeInjury.severity > 0) {
    const sev = player.activeInjury.severity;
    const ptsInj = -pts * sev * 0.12;
    const rebInj = -reb * sev * 0.06;
    const astInj = -ast * sev * 0.08;
    pts += ptsInj; reb += rebInj; ast += astInj;
    modifiers.push({ label: 'Active Injury (' + player.activeInjury.type + ')', ptsDelta: ptsInj, rebDelta: rebInj, astDelta: astInj, pct: -(sev * 12).toFixed(0) });
  }

  // ---- 7. DEFENSIVE MATCHUP SUPPRESSION ----
  // If this player is the primary defensive target, elite D-LEBRON defender
  // suppresses their output. Uses the same engine as calcDefMatchupSuppression().
  if (series.defMatchups) {
    const dm = series.defMatchups;
    // Check if THIS player is the target of a defensive matchup
    const matchup = isHome
      ? dm.awayDefOnHome   // away team's defender is on home player
      : dm.homeDefOnAway;  // home team's defender is on away player
    if (matchup && matchup.target === player.name && matchup.dLebron > 0) {
      const initiators = team.initiators || 2;
      const suppression = calcDefMatchupSuppression(matchup, initiators);
      // Suppression reduces scoring most, assists moderately
      const ptsDef = -pts * suppression * 0.12;
      const astDef = -ast * suppression * 0.08;
      pts += ptsDef; ast += astDef;
      modifiers.push({ label: 'Def Matchup (' + matchup.defender.split(' ').pop() + ')', ptsDelta: ptsDef, rebDelta: 0, astDelta: astDef, pct: -(suppression * 12).toFixed(1) });
    }
  }

  // ---- 8. COACHING ROLE CHANGE ----
  // Explicit role changes from coaching data (e.g., LeBron: third option → primary)
  if (series.coaching && series.coaching.roleChanges) {
    const rc = series.coaching.roleChanges.find(r => {
      // Match by last name since roleChanges uses short names
      const rcName = r.player.toLowerCase();
      const playerLast = player.name.split(' ').pop().toLowerCase();
      const playerFirst = player.name.split(' ')[0].toLowerCase();
      return rcName === playerLast || rcName === playerFirst || player.name.toLowerCase().includes(rcName);
    });
    if (rc) {
      let roleMod = 0;
      if (rc.impact === 'up') roleMod = 0.08;       // expanded role: +8%
      else if (rc.impact === 'down') roleMod = -0.10; // reduced role: -10%
      // Primary option elevation gets bigger bump
      if (rc.impact === 'up' && (rc.playoff || '').toLowerCase().includes('primary')) roleMod = 0.14;
      const ptsRole = pts * roleMod;
      const rebRole = reb * roleMod * 0.4;
      const astRole = ast * roleMod * 0.6;
      pts += ptsRole; reb += rebRole; ast += astRole;
      modifiers.push({ label: 'Role: ' + rc.impact.toUpperCase(), ptsDelta: ptsRole, rebDelta: rebRole, astDelta: astRole, pct: +(roleMod * 100).toFixed(0) });
    }
  }

  // ---- 9. HOME COURT ADVANTAGE ----
  // Home players get slight boost from crowd energy (HCA already in team ratings,
  // but individual performance also benefits — ~1-2% scoring boost historically)
  const round = series.round || 'R1';
  const hcaVal = HCA_BY_ROUND[round] || 2.5;
  const gameIsHome = (gameIdx < 2 || gameIdx === 4 || gameIdx === 6);
  const playerAtHome = (isHome && gameIsHome) || (!isHome && !gameIsHome);
  // homeCourtOverride flips which team actually has HCA
  const actualHome = series.homeCourtOverride === 'away'
    ? ((!isHome && gameIsHome) || (isHome && !gameIsHome))
    : playerAtHome;
  if (actualHome) {
    const hcaPct = hcaVal * 0.006; // ~1.5% for R1
    const ptsHCA = pts * hcaPct;
    pts += ptsHCA;
    modifiers.push({ label: 'Home Court', ptsDelta: ptsHCA, rebDelta: 0, astDelta: 0, pct: +(hcaPct * 100).toFixed(1) });
  }

  // ---- 10. COACHING COMPRESSION (Games 2+) ----
  // Losing coaches adjust → stats regress toward mean as series progresses
  // OKC-MEM 2025: margins went 51→19→6→2. Individual stat variance compresses similarly.
  // UPGRADED: Stronger compression (4-6% per game, was 3%) with coach quality factor
  const score = getSeriesScore(series);
  const gamesPlayed = score.home + score.away;
  if (gamesPlayed > 0 && gameNum > 1) {
    const compressionGames = Math.min(gamesPlayed, gameNum - 1);
    // Base rate increased from 3% to 5% per game; coach quality adds 0-2% more
    const oppCoachRating = isHome
      ? (series.coaching?.away?.adjustmentRating || 6)
      : (series.coaching?.home?.adjustmentRating || 6);
    const baseRate = 0.05 + (oppCoachRating / 10) * 0.02; // 5-7% per game
    const compression = 1 - Math.min(0.20, baseRate * compressionGames);
    const deviationScale = (compression - 1);
    const ptsCoach = pts * deviationScale;
    const astCoach = ast * deviationScale;
    const rebCoach = reb * deviationScale * 0.5; // rebounds compress less
    pts += ptsCoach; ast += astCoach; reb += rebCoach;
    if (Math.abs(deviationScale) > 0.005) {
      modifiers.push({ label: 'G' + gameNum + ' Coaching Adj', ptsDelta: ptsCoach, rebDelta: rebCoach, astDelta: astCoach, pct: +(deviationScale * 100).toFixed(1) });
    }
  }

  // ---- 11. SYNERGY / CHEMISTRY CONTEXT ----
  // High-chemistry lineups boost efficiency → lifts scoring for good fits,
  // low-chemistry lineups create redundancy → mild stat suppression
  const spmChem = getCachedSPM(team, series.id);
  const chemDeviation = (spmChem.score - 55) / 100; // centered at 55 (average)
  if (Math.abs(chemDeviation) > 0.02) {
    const ptsChem = pts * chemDeviation * 0.08;
    const astChem = ast * chemDeviation * 0.12; // chemistry most affects ball movement
    pts += ptsChem; ast += astChem;
    modifiers.push({ label: 'Team Chemistry (' + spmChem.score + ')', ptsDelta: ptsChem, rebDelta: 0, astDelta: astChem, pct: +(chemDeviation * 8).toFixed(1) });
  }

  // ---- 12. ON/OFF CONTEXT ----
  // Players with high on/off are more impactful → their stats scale with team success
  // Players with negative on/off tend to underperform their raw averages in big games
  const onOff = player.onOff || 0;
  if (Math.abs(onOff) > 2) {
    const onOffMod = onOff * 0.004; // +0.4% per point of on/off
    const ptsOO = pts * onOffMod;
    pts += ptsOO;
    modifiers.push({ label: 'On/Off (' + (onOff > 0 ? '+' : '') + onOff + ')', ptsDelta: ptsOO, rebDelta: 0, astDelta: 0, pct: +(onOffMod * 100).toFixed(1) });
  }

  // ---- 13. EXTERNAL FACTORS ----
  // Off-court issues (chemistry problems, motivation, etc.) affect individual performance
  const playerFactors = (series.externalFactors || []).filter(f =>
    f.player && player.name.toLowerCase().includes((f.player || '').split(' ').pop().toLowerCase())
  );
  if (playerFactors.length > 0) {
    const totalImpact = playerFactors.reduce((s, f) => s + f.impact, 0);
    if (totalImpact !== 0) {
      const extMod = totalImpact * 0.008; // ~0.8% per impact point
      const ptsExt = pts * extMod;
      pts += ptsExt;
      modifiers.push({ label: 'External Factors', ptsDelta: ptsExt, rebDelta: 0, astDelta: 0, pct: +(extMod * 100).toFixed(1) });
    }
  }

  return {
    pts: +Math.max(0, pts).toFixed(1),
    reb: +Math.max(0, reb).toFixed(1),
    ast: +Math.max(0, ast).toFixed(1),
    modifiers: modifiers.filter(m => Math.abs(m.ptsDelta) >= 0.1 || Math.abs(m.rebDelta) >= 0.1 || Math.abs(m.astDelta) >= 0.1)
  };
}


// ============================================================
// PROJECTED BOX SCORE ENGINE (G2+ with G1 Bayesian Update)
// ============================================================
// For upcoming games, projects per-player stats that:
//   1. Start from the multi-factor expected stats engine
//   2. Bayesian-update with prior game actuals (30% G1 weight, 70% model)
//   3. Apply coaching-specific G2 adjustments (from modelLessons/g1Adjustments)
//   4. Normalize all players to match the game projection's team totals
//   5. Apply minutes distribution based on role + G1 actual minutes

function calcProjectedBoxScore(series, gameIdx) {
  const gameNum = gameIdx + 1;
  const proj = calcGameProjection(series, series.id, gameNum);

  // Get prior game box scores for Bayesian update
  const priorGame = gameIdx > 0 ? series.games[gameIdx - 1] : null;
  const hasPriorBS = priorGame && priorGame.boxScores;

  function projectTeam(side) {
    const team = side === 'home' ? series.homeTeam : series.awayTeam;
    const teamScore = side === 'home' ? proj.homeScore : proj.awayScore;

    // Get active players (rated > 0 or appeared in prior box score)
    const priorBS = hasPriorBS ? priorGame.boxScores[side] : null;
    const priorMap = {};
    if (priorBS) priorBS.forEach(p => { priorMap[p.name] = p; });

    // Build player list: use prior game participants if available, else use roster
    // Also include roster players returning from injury who have a research outlook
    // (e.g. Quickley returning G3 after missing G1-G2)
    let activePlayers;
    if (priorBS) {
      const fromBS = priorBS.filter(p => p.min >= 5).map(bp => {
        const rosterP = team.players.find(rp => rp.name === bp.name);
        return rosterP || null;
      }).filter(Boolean);
      const bsNames = new Set(fromBS.map(p => p.name));
      // Check if there's a research outlook for this game that includes returning players
      const outlookKey = 'g' + (gameIdx + 1) + 'PlayerOutlook';
      const outlooks = series[outlookKey];
      const sideOutlooks = outlooks ? (side === 'home' ? outlooks.home : outlooks.away) : null;
      if (sideOutlooks) {
        const returning = team.players.filter(p =>
          p.rating > 0 && !bsNames.has(p.name) &&
          sideOutlooks.some(o => o.player === p.name)
        );
        activePlayers = [...fromBS, ...returning];
      } else {
        activePlayers = fromBS;
      }
    } else {
      activePlayers = team.players.filter(p => p.rating > 0).slice(0, 9);
    }

    // Calculate raw expected stats per player
    const rawProjections = activePlayers.map(player => {
      const exp = calcExpectedPlayerStats(player, series, gameIdx, side);
      const prior = priorMap[player.name];

      let projPts = exp.pts;
      let projReb = exp.reb;
      let projAst = exp.ast;
      let projMin = 0;

      // Bayesian update with G1 actuals
      // UPGRADED: Tiered weighting based on minutes played in G1
      //   - 15+ min: 55% model / 45% G1 actual (strong signal from significant playing time)
      //   - 10-14 min: 65% model / 35% G1 actual (moderate signal)
      // This gives G1 performance substantially more influence on G2 projections,
      // creating meaningful differentiation from pre-series (G1) projections.
      if (prior && prior.min >= 15) {
        projPts = exp.pts * 0.55 + prior.pts * 0.45;
        projReb = exp.reb * 0.55 + prior.reb * 0.45;
        projAst = exp.ast * 0.55 + prior.ast * 0.45;
        // Minutes: 40% model / 60% G1 actual (minutes are most stable; lean on actuals)
        const estMin = player.usg ? Math.min(42, 48 * (player.usg / 100) * 2.4) : 28;
        projMin = estMin * 0.4 + prior.min * 0.6;
      } else if (prior && prior.min >= 10) {
        projPts = exp.pts * 0.65 + prior.pts * 0.35;
        projReb = exp.reb * 0.65 + prior.reb * 0.35;
        projAst = exp.ast * 0.65 + prior.ast * 0.35;
        const estMin = player.usg ? Math.min(42, 48 * (player.usg / 100) * 2.4) : 28;
        projMin = estMin * 0.45 + prior.min * 0.55;
      } else if (prior) {
        projMin = prior.min;
      } else {
        projMin = player.usg ? Math.min(38, 48 * (player.usg / 100) * 2.4) : 24;
      }

      // G2+ Coaching adjustment: unsustainable performances regress harder
      // Players who shot way above their norm in G1 will be schemed against
      // UPGRADED: Lower thresholds (6pts, -5pts) and stronger effects to create
      // visible differentiation between G1 and G2 player projections
      if (prior && prior.min >= 15) {
        const g1PtsDev = prior.pts - (player.ppg || 15);

        // Overperformance regression (threshold lowered from 10 to 6)
        // Rationale: even moderate overperformance (+6-10) is partially unsustainable
        // in playoffs as opposing coaches adjust defensive schemes
        if (g1PtsDev > 6) {
          // SCHEME-DRIVEN VOLUME CHECK: If the player is the primary/sole initiator
          // on a team with few creators, the opposing defense may be FUNNELING scoring
          // to them deliberately (e.g. "let Cade score, shut down everyone else").
          // In this case, the high output is structural, not random — regress less.
          const teamObj = side === 'home' ? series.homeTeam : series.awayTeam;
          const initiators = teamObj.initiators || 2;
          const isHighUsg = (player.usg || 0) >= 27;
          const isSoleCreator = initiators <= 1 && isHighUsg;
          const isLowInitiatorStar = initiators <= 2 && isHighUsg && (player.rating || 0) >= 80;
          const schemeMultiplier = isSoleCreator ? 0.35 : isLowInitiatorStar ? 0.6 : 1.0;

          // Tiered regression: gentle for +6-10, strong for +10+
          let regressionPenalty;
          if (g1PtsDev > 10) {
            regressionPenalty = Math.min(0.35, 0.08 + (g1PtsDev - 10) * 0.04);
          } else {
            regressionPenalty = Math.min(0.12, (g1PtsDev - 6) * 0.03);
          }
          // Apply scheme dampening — sole creators keep more of their volume
          regressionPenalty *= schemeMultiplier;
          projPts *= (1 - regressionPenalty);

          // Coaching counter-targeting: elite opposing coaches scheme harder
          const oppCoach = side === 'home' ? series.coaching?.away : series.coaching?.home;
          if (oppCoach && oppCoach.adjustmentRating >= 7) {
            const coachPenalty = 0.04 + (oppCoach.adjustmentRating - 7) * 0.02; // 4-10%
            projPts *= (1 - coachPenalty);
          }
        }

        // Underperformance bounce-back (threshold lowered from -8 to -5)
        // Stars who underperformed G1 typically bounce back as they adjust
        // to defensive schemes and get more comfortable
        //
        // CRITICAL: Three categories of "underperformance" are actually DELIBERATE
        // and should NOT bounce back because the cause is repeatable:
        //   1. Facilitator mode — player chose to pass instead of score (high ast surge)
        //   2. Elite defensive scheme lock — elite defender on sole initiator is repeatable
        //   3. Paint-packing suppression — bigs on spacing-poor teams get schemed out
        if (g1PtsDev < -5) {
          let suppressBounceBack = false;
          let suppressReason = '';

          // FIX 1: FACILITATOR MODE DETECTION
          // When a player's assists surge well above their season average while
          // scoring drops, they CHOSE to facilitate — this is a coaching decision,
          // not underperformance. LeBron G1: 19pts/13ast (apg 8.4) = facilitator mode.
          const g1AstSurge = prior.ast - (player.apg || 3);
          if (g1AstSurge >= 4 && g1PtsDev < -3) {
            suppressBounceBack = true;
            suppressReason = 'facilitator-mode';
          }

          // FIX 2: ELITE DEFENSIVE SCHEME SUPPRESSION
          // When an elite defender (dLebron >= 2.0) is assigned to this player
          // AND the player's team has ≤1 initiator, the defensive scheme is
          // structural and repeatable — the opponent WILL run it again.
          // Maxey G1: White (2.324 dLebron) held him to 21pts on 8/20 FG.
          // PHI has 1 initiator — BOS can fully commit White to Maxey every game.
          if (!suppressBounceBack) {
            const defMatchup = side === 'home'
              ? series.defMatchups?.awayDefOnHome
              : series.defMatchups?.homeDefOnAway;
            if (defMatchup && defMatchup.target === player.name && defMatchup.dLebron >= 2.0) {
              const teamObj2 = side === 'home' ? series.homeTeam : series.awayTeam;
              const teamInitiators = teamObj2.initiators || 2;
              if (teamInitiators <= 1) {
                suppressBounceBack = true;
                suppressReason = 'elite-defender-on-sole-initiator';
              }
            }
          }

          // FIX 3: PAINT-PACKING SUPPRESSION FOR BIGS
          // When a center/PF on a spacing-poor team (≤1 initiator) gets schemed
          // out by paint-packing defense, the suppression is structural — it exploits
          // the team's lack of floor spacing, which doesn't change game-to-game.
          // Duren G1: 8pts (ppg 19.5) because ORL packed the paint knowing DET
          // has only Cade as a creator and limited shooting around him.
          if (!suppressBounceBack) {
            const isBigMan = ['C', 'PF'].includes(player.pos) && (player.rpg || 0) >= 7;
            if (isBigMan) {
              const teamObj3 = side === 'home' ? series.homeTeam : series.awayTeam;
              const teamInit = teamObj3.initiators || 2;
              // Big on a team with ≤1 initiator AND big underperformance (>8pts below ppg)
              // = paint-packing scheme exploiting structural spacing weakness
              if (teamInit <= 1 && g1PtsDev < -8) {
                suppressBounceBack = true;
                suppressReason = 'paint-packing-vs-spacing-poor';
              }
            }
          }

          if (!suppressBounceBack) {
            const severity = -g1PtsDev - 5;
            // Stronger bounce-back for bigger underperformance, capped at 20%
            const bounceBack = Math.min(0.20, severity * 0.03);
            projPts *= (1 + bounceBack);

            // Additional bounce for established stars (high ppg = more likely to regress to mean)
            if ((player.ppg || 0) >= 22) {
              projPts *= 1.04; // extra 4% for proven scorers
            }
          } else {
            // ACTIVE DAMPENING: When suppression is detected, the cause is structural
            // and repeatable. The Bayesian blend still pulls toward the inflated model
            // (e.g. LeBron's exp.pts is 29.1 because Doncic/Reaves are OUT), so we need
            // to actively pull the projection TOWARD the G1 actual, not just skip bounce-back.
            //
            // Dampening formula: blend projPts toward G1 actual by the suppression strength
            // NOTE: Dampening factors are set higher than the raw target because
            // the team-total normalization step (below) re-inflates individual
            // projections proportionally. A player with a large share of raw pts
            // gets ~15-20% inflation from normalization, so we pre-compensate.
            if (suppressReason === 'facilitator-mode') {
              // Facilitator mode: player CHOSE to pass. Stronger ast surge = more deliberate.
              // Pull 45-65% toward G1 actual scoring based on assist surge magnitude.
              // LeBron example: 19pts/13ast (apg 8.4) — 4.6 ast surge = very deliberate.
              const astSurgeMag = Math.min(8, g1AstSurge); // cap at +8 surge
              const facilitatorDampen = Math.min(0.70, 0.50 + (astSurgeMag - 4) * 0.05);
              projPts = projPts * (1 - facilitatorDampen) + prior.pts * facilitatorDampen;
              // Also boost assists toward G1 level since facilitator role persists
              projAst = projAst * 0.4 + prior.ast * 0.6;
            } else if (suppressReason === 'elite-defender-on-sole-initiator') {
              // Elite defender on sole initiator: the defensive scheme is PROVEN and repeatable.
              // Pull 40-55% toward G1 actual based on defender's dLebron rating.
              // Maxey example: White (2.324 dLebron) on him, PHI has 1 initiator.
              const defMatchup2 = side === 'home'
                ? series.defMatchups?.awayDefOnHome
                : series.defMatchups?.homeDefOnAway;
              const dLebVal = defMatchup2 ? defMatchup2.dLebron : 2.0;
              const defDampen = Math.min(0.55, 0.30 + (dLebVal - 1.5) * 0.12);
              projPts = projPts * (1 - defDampen) + prior.pts * defDampen;
            } else if (suppressReason === 'paint-packing-vs-spacing-poor') {
              // Paint-packing: structural weakness (team lacks spacing). Pull 35-55%
              // toward G1 actual based on severity of underperformance.
              const paintDampen = Math.min(0.55, 0.30 + (-g1PtsDev - 8) * 0.06);
              projPts = projPts * (1 - paintDampen) + prior.pts * paintDampen;
            }
          }
        }

        // COACHING COUNTER-ADJUSTMENT: High-Output Winner Suppression
        // Historical evidence (Giannis Wall 2020, Splitter on Wemby 2026, etc.):
        // When a player scores 28+ in a WIN, the opposing coaching staff has 48 hours
        // of film study to scheme against that specific player. The suppression strength
        // depends on: (1) the opposing coach's adjustmentRating, (2) whether the
        // scoring method is sustainable (3PT hot shooting regresses more than FT trips),
        // and (3) whether the team has enough initiators to redistribute if doubled.
        //
        // ALSO: The LOSING team's underperforming players get an additional coaching
        // bounce-back — their coach adjusts offensive schemes between games.
        if (prior.pts >= 28) {
          // Determine if this player's team WON the prior game
          const priorGameResult = series.games[gameIdx - 1];
          const playerTeamAbbr = side === 'home'
            ? (series.id || '').split('-')[0]
            : (series.id || '').split('-')[1];
          const teamWon = priorGameResult && priorGameResult.winner === playerTeamAbbr;

          if (teamWon) {
            // WINNING TEAM'S HIGH SCORER: Opposing coach will scheme against them
            const oppCoachAdj = side === 'home'
              ? (series.coaching?.away?.adjustmentRating || 5)
              : (series.coaching?.home?.adjustmentRating || 5);

            // Base counter: scales with coach's adjustment ability
            // adj=4: 2% penalty, adj=7: 5%, adj=9: 7%
            let coachCounter = Math.max(0, (oppCoachAdj - 3) * 0.01 + 0.01);

            // 3PT regression amplifier: unsustainably hot 3PT shooting is MORE
            // suppressible because it regresses naturally + coaching can take away looks.
            // Wemby 5/6 3PT = 83.3%, Murray 0/8 3PT but 16/16 FT.
            if (prior.tpa && prior.tpa >= 4) {
              const g1ThreePct = prior.tpm / prior.tpa;
              if (g1ThreePct > 0.50) {
                // Hot 3PT: additional 2-5% suppression (the looks WILL be harder to get)
                const threeBonus = Math.min(0.05, (g1ThreePct - 0.50) * 0.10);
                coachCounter += threeBonus;
              }
            }

            // Multi-initiator dampening: if the winning team has 3+ initiators,
            // the coach can't just focus on one player — suppression is weaker
            const winTeam = side === 'home' ? series.homeTeam : series.awayTeam;
            const winInit = winTeam.initiators || 2;
            if (winInit >= 3) {
              coachCounter *= 0.5; // much harder to target one player on deep teams
            }

            // Apply the coaching counter penalty
            if (coachCounter > 0.01) {
              projPts *= (1 - coachCounter);
            }
          }
        }

        // LOSING TEAM COACHING BOUNCE-BACK
        // When the team LOST the prior game, the coach makes offensive adjustments.
        // Underperforming players on losing teams get an extra coaching-driven boost
        // beyond the standard bounce-back, because the coaching staff specifically
        // addresses what went wrong (e.g., TOR adjusting after CLE G1 loss).
        if (g1PtsDev < -5) {
          const priorGameResult2 = series.games[gameIdx - 1];
          const playerTeamAbbr2 = side === 'home'
            ? (series.id || '').split('-')[0]
            : (series.id || '').split('-')[1];
          const teamLost = priorGameResult2 && priorGameResult2.winner !== playerTeamAbbr2;

          if (teamLost) {
            // Own coach's adjustment ability determines bounce-back strength
            const ownCoachAdj = side === 'home'
              ? (series.coaching?.home?.adjustmentRating || 5)
              : (series.coaching?.away?.adjustmentRating || 5);

            // adj=4: 1% boost, adj=7: 3%, adj=9: 5%
            const coachBoost = Math.max(0, (ownCoachAdj - 3) * 0.008);
            if (coachBoost > 0) {
              projPts *= (1 + coachBoost);
            }
          }
        }

        // PHASE 21 LEARNING: Defensive Scheme Lock
        // When a player underperforms in BOTH G1 and G2 (e.g. Ingram 17→7pts),
        // the defensive scheme is proven repeatable. Compound the suppression for G3+.
        // Also handles G2→G3 where we check games[0] and games[1] results.
        if (gameIdx >= 2 && series.games) {
          const g1Box = series.games[0]?.boxScores;
          const g2Box = series.games[1]?.boxScores;
          if (g1Box && g2Box) {
            const sideKey = side === 'home' ? 'home' : 'away';
            const g1Player = g1Box[sideKey]?.find(p => p.name === player.name);
            const g2Player = g2Box[sideKey]?.find(p => p.name === player.name);
            if (g1Player && g2Player) {
              const ppg = player.ppg || 15;
              const g1Under = g1Player.pts < ppg * 0.75; // >25% below avg
              const g2Under = g2Player.pts < ppg * 0.75;
              if (g1Under && g2Under) {
                // Scheme lock: suppression compounds — additional 8-15% penalty
                const avgPtsInSeries = (g1Player.pts + g2Player.pts) / 2;
                const schemeLock = Math.min(0.15, 0.08 + (ppg - avgPtsInSeries) / ppg * 0.1);
                projPts *= (1 - schemeLock);
              }
            }
          }
        }

        // PHASE 21 LEARNING: Minutes Reallocation
        // When a player's minutes dropped significantly G1→G2, project continued reduction
        if (gameIdx >= 2 && series.games) {
          const g1Box = series.games[0]?.boxScores;
          const g2Box = series.games[1]?.boxScores;
          if (g1Box && g2Box) {
            const sideKey = side === 'home' ? 'home' : 'away';
            const g1Player = g1Box[sideKey]?.find(p => p.name === player.name);
            const g2Player = g2Box[sideKey]?.find(p => p.name === player.name);
            if (g1Player && g2Player && g1Player.min >= 15 && g2Player.min < g1Player.min * 0.6) {
              // Major minutes drop (>40%): project further reduction
              const minRatio = g2Player.min / g1Player.min;
              const scaleFactor = 0.7 + minRatio * 0.3; // scale output proportionally
              projPts *= scaleFactor;
              projReb *= scaleFactor;
              projAst *= scaleFactor;
              projMin *= scaleFactor;
            }
          }
        }

        // X-FACTOR STAR TREATMENT
        // When a non-star role player overperforms in the first 2 games,
        // their coach leans into them more — giving usage/minutes bumps.
        // The boost scales with series progression (coach trusts them more each game).
        if (series.xFactors) {
          const teamXF = side === 'home' ? series.xFactors.home : series.xFactors.away;
          const oppXF = side === 'home' ? series.xFactors.away : series.xFactors.home;
          if (teamXF) {
            // Offensive x-factor: usage and scoring bump
            // Boost scales with actual overperformance magnitude — a player averaging
            // +10 over ppg needs a much bigger boost than +2 over ppg
            if (teamXF.offense && teamXF.offense.player === player.name) {
              const ppgBase = player.ppg || 10;
              const overPerf = teamXF.offense.avgOverPerformance || 3;
              // Scale boost by overperformance ratio, capped at 20%
              const baseBoost = Math.min(0.20, (overPerf / ppgBase) * 0.30);
              // Scale with game progression: G3 = 1.0x, G4 = 1.15x, G5+ = 1.3x
              const gameScale = gameIdx >= 4 ? 1.3 : gameIdx >= 3 ? 1.15 : 1.0;
              const xfBoost = baseBoost * gameScale;
              projPts *= (1 + xfBoost);
              projMin = Math.min(48, projMin + 2 * gameScale); // +2-3 min bump
              // Small rebounds/assists bump from increased minutes
              projReb *= (1 + xfBoost * 0.3);
              projAst *= (1 + xfBoost * 0.3);
            }
            // Secondary offensive x-factor (bench): smaller boost, same scaling logic
            if (teamXF.offenseBench && teamXF.offenseBench.player === player.name) {
              const ppgBase = player.ppg || 10;
              const overPerf = teamXF.offenseBench.avgOverPerformance || 2;
              const baseBoost = Math.min(0.12, (overPerf / ppgBase) * 0.20);
              const gameScale = gameIdx >= 4 ? 1.3 : gameIdx >= 3 ? 1.15 : 1.0;
              const xfBoost = baseBoost * gameScale;
              projPts *= (1 + xfBoost);
              projMin = Math.min(48, projMin + 1.5 * gameScale);
              projReb *= (1 + xfBoost * 0.3);
              projAst *= (1 + xfBoost * 0.3);
            }
            // Defensive x-factor: increase their suppressive impact
            // (handled via existing defensive matchup system — the x-factor tag
            // ensures the engine recognizes their defensive minutes bump)
            if (teamXF.defense && teamXF.defense.player === player.name) {
              projMin = Math.min(48, projMin + 1.5); // defensive x-factors get more minutes
              // Small steals/blocks presence boost via rebounds proxy
              projReb *= 1.04;
            }
          }
          // Opposing team's defensive x-factor suppresses this player slightly
          // if they are a primary target
          if (oppXF && oppXF.defense && oppXF.defense.player) {
            const defMatchup = side === 'home'
              ? series.defMatchups?.awayDefOnHome
              : series.defMatchups?.homeDefOnAway;
            if (defMatchup && defMatchup.target === player.name) {
              // If the opposing defensive x-factor is the one guarding this player,
              // apply a small additional suppression (x-factor earns more trust → tighter D)
              const oppDefXFName = oppXF.defense.player;
              if (defMatchup.defender === oppDefXFName) {
                const xfDefSuppress = 0.03 * (gameIdx >= 3 ? 1.2 : 1.0);
                projPts *= (1 - xfDefSuppress);
              }
            }
          }
        }

        // Rebounds and assists also regress/bounce (new)
        const g1RebDev = prior.reb - (player.rpg || 5);
        if (g1RebDev > 4) {
          projReb *= (1 - Math.min(0.15, (g1RebDev - 4) * 0.025));
        } else if (g1RebDev < -3) {
          projReb *= (1 + Math.min(0.12, (-g1RebDev - 3) * 0.02));
        }

        const g1AstDev = prior.ast - (player.apg || 3);
        if (g1AstDev > 3) {
          projAst *= (1 - Math.min(0.15, (g1AstDev - 3) * 0.03));
        } else if (g1AstDev < -2) {
          projAst *= (1 + Math.min(0.12, (-g1AstDev - 2) * 0.025));
        }
      }

      // RESEARCH-BASED PER-PLAYER OFFENSIVE OUTLOOK
      // When g3PlayerOutlook (or gNPlayerOutlook) exists, adjust scoring based on
      // deep research into matchups, trends, coaching tactics, and historical data.
      // outlook: "good" = boost, "bad" = suppress, "neutral" = no change
      const gameOutlookKey = 'g' + (gameIdx + 1) + 'PlayerOutlook';
      const playerOutlooks = series[gameOutlookKey];
      let researchFgPct = null; // overrides FG%/3PT% in shooting stat line (FGM/FGA/TPM/TPA), NOT point total
      if (playerOutlooks) {
        const sideOutlooks = side === 'home' ? playerOutlooks.home : playerOutlooks.away;
        if (sideOutlooks) {
          const outlook = sideOutlooks.find(o => o.player === player.name);
          if (outlook) {
            researchFgPct = outlook.projFgPct; // store for later FG% estimation
            if (outlook.outlook === 'good') {
              // Good game expected: boost 8-12% based on confidence
              const boost = outlook.confidence === 'high' ? 0.12 : 0.08;
              projPts *= (1 + boost);
            } else if (outlook.outlook === 'bad') {
              // Bad game expected: suppress 8-12%
              const suppress = outlook.confidence === 'high' ? 0.12 : 0.08;
              projPts *= (1 - suppress);
            }
            // "neutral-good" = slight uplift
            if (outlook.outlook === 'neutral-good') {
              projPts *= 1.04;
            }
          }
        }
      }

      // Estimate other stats — use research-based FG% when available
      const effectiveFgPct = researchFgPct || (player.fgp || 45) / 100;
      const fga = projPts > 0 ? projPts / (effectiveFgPct * 2 + 0.3) : 0;
      const fgm = fga * effectiveFgPct;
      // 3PT% derived from research FG% context or TS%
      const base3Pct = researchFgPct
        ? (researchFgPct >= 0.55 ? 0.40 : researchFgPct >= 0.45 ? 0.36 : researchFgPct >= 0.35 ? 0.30 : 0.25)
        : ((player.ts || 55) > 60 ? 0.38 : (player.ts || 55) > 57 ? 0.35 : 0.32);
      const tpa = fga * 0.38; // ~38% of FGA are 3PA in modern NBA
      const tpm = tpa * base3Pct;
      const fta = projPts * 0.22; // ~22% of points come from FT
      const ftm = fta * (((player.ts || 55) > 58 ? 0.82 : 0.76));
      const stl = prior ? (prior.stl * 0.5 + 1.0 * 0.5) : 0.8;
      const blk = prior ? (prior.blk * 0.5 + 0.5 * 0.5) : 0.5;
      const to = prior ? (prior.to * 0.5 + (player.usg > 25 ? 2.5 : 1.5) * 0.5) : (player.usg > 25 ? 2.5 : 1.5);

      return {
        name: player.name, player,
        pts: Math.max(0, projPts),
        reb: Math.max(0, projReb),
        ast: Math.max(0, projAst),
        min: Math.round(projMin),
        fgm, fga, tpm, tpa, ftm, fta, stl, blk, to,
        modifiers: exp.modifiers
      };
    });

    // Normalize points to match projected team total
    // Two-pass: scale proportionally, then cap individuals and redistribute excess
    const rawTotal = rawProjections.reduce((s, p) => s + p.pts, 0);
    const scale = rawTotal > 0 ? teamScore / rawTotal : 1;
    let excess = 0;
    rawProjections.forEach(p => {
      let scaledPts = p.pts * scale;
      // Cap: no player exceeds max(ppg*1.35, G1 actual, 38) after normalization
      const prior = priorMap[p.player.name];
      const ptsCap = Math.max((p.player.ppg || 20) * 1.35, prior ? prior.pts : 0, 38);
      if (scaledPts > ptsCap) {
        excess += scaledPts - ptsCap;
        scaledPts = ptsCap;
      }
      p.pts = scaledPts;
    });
    // Redistribute excess proportionally among uncapped players
    if (excess > 0) {
      const uncapped = rawProjections.filter(p => {
        const prior = priorMap[p.player.name];
        const ptsCap = Math.max((p.player.ppg || 20) * 1.35, prior ? prior.pts : 0, 38);
        return p.pts < ptsCap;
      });
      const uncappedTotal = uncapped.reduce((s, p) => s + p.pts, 0);
      if (uncappedTotal > 0) {
        uncapped.forEach(p => { p.pts += excess * (p.pts / uncappedTotal); });
      }
    }
    rawProjections.forEach(p => {
      // Use per-player pts ratio so shooting stats stay consistent with capped/redistributed pts
      const rawPts = rawTotal > 0 ? p.pts / scale : p.pts; // what pts was before team-level scale
      const effScale = rawPts > 0 ? p.pts / rawPts : scale; // individual player's actual scale factor
      p.pts = +p.pts.toFixed(1);
      p.fgm = +(p.fgm * effScale).toFixed(1);
      p.fga = +(p.fga * effScale).toFixed(1);
      p.tpm = +(p.tpm * effScale).toFixed(1);
      p.tpa = +(p.tpa * effScale).toFixed(1);
      p.ftm = +(p.ftm * effScale).toFixed(1);
      p.fta = +(p.fta * effScale).toFixed(1);
      p.reb = +p.reb.toFixed(1);
      p.ast = +p.ast.toFixed(1);
      p.stl = +p.stl.toFixed(1);
      p.blk = +p.blk.toFixed(1);
      p.to = +p.to.toFixed(1);
    });

    return rawProjections.sort((a, b) => b.pts - a.pts);
  }

  return {
    home: projectTeam('home'),
    away: projectTeam('away'),
    homeScore: proj.homeScore,
    awayScore: proj.awayScore,
    character: proj.character,
    margin: proj.margin
  };
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

