function calcTeamRating(team, series, seriesId) {
  // REPLACEMENT-LEVEL SLOT SYSTEM
  // Instead of filtering out inactive players and re-averaging (which self-heals),
  // we keep every roster slot fixed and substitute replacement-level for missing players.
  // This means losing a star (87 rating) costs ~39 weighted points in their slot,
  // rather than just promoting bench players to higher weights.
  // 2024 BACKTEST LESSON: Raised from 42 to 48 — playoff-context 7-10th men are coached up
  // and produce above generic replacement value due to shorter rotations and matchup optimization.
  // NYK 2024 competed in R2 missing 3 starters because their replacements played at ~50 level, not 42.
  const REPLACEMENT_LEVEL = 48;

  // Sort ALL players by baseRating to establish fixed role hierarchy
  const sorted = [...team.players].sort((a, b) => {
    const ra = a.baseRating || a.rating || 0;
    const rb = b.baseRating || b.rating || 0;
    return rb - ra;
  });

  let totalWeight = 0, weightedSum = 0;
  sorted.forEach((p, i) => {
    // Determine if this player is active (not injured AND not toggled out)
    const effectiveR = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    const isActive = effectiveR > 0;
    // Use their actual rating if active, replacement-level if not
    const r = isActive ? (p.baseRating || p.rating) : REPLACEMENT_LEVEL;
    const w = Math.max(1, 5 - i);
    weightedSum += r * w;
    totalWeight += w;
  });

  if (!totalWeight) return 20;
  let base = weightedSum / totalWeight;

  // RESEARCH: VORP & USG% integration (Ylä-Autio 2022 — most predictive advanced metrics)
  // VORP captures cumulative value; USG-adjusted efficiency rewards high-usage efficient players
  const activeForVorp = team.players.filter(p => {
    const r = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return r > 0;
  });
  if (activeForVorp.length > 0) {
    const totalVorp = activeForVorp.reduce((s, p) => s + (p.vorp || 0), 0);
    const avgUsg = activeForVorp.reduce((s, p) => s + (p.usg || 20), 0) / activeForVorp.length;
    // Teams with higher cumulative VORP have more valuable players
    base += (totalVorp - 15) / 8; // 15 is roughly average team VORP for active players
    // Usage efficiency: high average USG with good team TS% means efficient volume
    const usgEfficiency = (avgUsg - 20) * (team.advStats.ts - 57) / 50;
    base += Math.max(-1.5, Math.min(1.5, usgEfficiency));
  }

  // RESEARCH: LEBRON WAR integration (BBall Index — Luck-adjusted player Estimate using Box prior Regularized ON-off)
  // WAR (Wins Above Replacement) is LEBRON's cumulative value metric — complementary to VORP
  // WAR captures lineup-adjusted impact that box-score VORP misses; D-LEBRON isolates defensive value
  if (activeForVorp.length > 0) {
    const playersWithWar = activeForVorp.filter(p => p.war != null);
    if (playersWithWar.length >= 3) {
      const totalWar = playersWithWar.reduce((s, p) => s + p.war, 0);
      // Average playoff team WAR for active rotation is ~35; elite teams reach 50+
      // GHOST FIX: reduced from /12 to /20 because WAR correlates with VORP (avoids double-dipping)
      base += (totalWar - 35) / 20; // ~0.75 bonus for elite WAR teams, captures lineup-adjusted signal VORP misses

      // D-LEBRON team aggregate — defensive identity bonus
      // Teams with strong collective D-LEBRON outperform their individual defensive stats
      const avgDLebron = playersWithWar.reduce((s, p) => s + (p.dLebron || 0), 0) / playersWithWar.length;
      if (avgDLebron > 0.3) {
        base += (avgDLebron - 0.3) * 0.8; // reward teams with multiple positive defensive contributors
      } else if (avgDLebron < -0.5) {
        base -= (-0.5 - avgDLebron) * 0.5; // penalize teams with collectively poor D-LEBRON
      }

      // LEBRON role diversity bonus — teams with complementary offensive/defensive roles
      // Research: diverse role composition creates harder-to-scout playoff matchups
      const offRoles = new Set(playersWithWar.slice(0, 7).map(p => p.offRole).filter(Boolean));
      const defRoles = new Set(playersWithWar.slice(0, 7).map(p => p.defRole).filter(Boolean));
      const roleDiversity = (offRoles.size + defRoles.size) / 2;
      if (roleDiversity >= 5) base += 0.3; // meaningful tactical diversity

      // PARTNOW OFFENSIVE STYLE RESEARCH: Initiator redundancy bonus/penalty
      // Teams with multiple active on-ball creators (Shot Creator / Primary Ball Handler) are more
      // resilient and harder to scout (Partnow 2020 — offensive variety via Euclidean distance).
      // Teams that have lost their primary initiator suffer beyond the rating-slot drop because
      // the ENTIRE offense loses its ability to generate efficient off-ball opportunities.
      // This is NOT a ghost of the replacement-level system: slots capture production loss,
      // this captures SYSTEMIC coherence loss (the offense can't create quality shots for anyone).
      const initiatorRoles = new Set(["Shot Creator", "Primary Ball Handler"]);
      const activeInitiators = playersWithWar.filter(p =>
        initiatorRoles.has(p.offRole) && (seriesId ? getEffectiveRating(p, seriesId) : p.rating) > 0
      );
      const expectedInitiators = team.initiators || 2;
      if (activeInitiators.length >= 3) base += 0.5; // elite initiator redundancy (CLE, OKC, BOS)
      else if (activeInitiators.length <= 1 && expectedInitiators >= 2) base -= 0.8; // lost primary creator — offense collapses (Partnow initiator-loss cascade)

      // 2024 BACKTEST LESSON: Star-Pair Synergy Bonus
      // When 2+ elite shot creators (rated 85+) share the floor, they create a multiplicative
      // offensive advantage: if one is doubled, the other operates in space. Luka+Kyrie 2024 WCF,
      // Tatum+Brown 2024 Finals — these pairings exceed sum-of-parts. Distinct from initiator
      // redundancy (which counts breadth of creation); this rewards QUALITY of the top two creators.
      const eliteCreators = playersWithWar.filter(p => {
        const eff = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
        return eff >= 85 && initiatorRoles.has(p.offRole);
      });
      if (eliteCreators.length >= 2) {
        base += 1.0; // significant two-star synergy (BOS Tatum+Brown, CLE Mitchell+Harden)
      }

      // 2024 BACKTEST LESSON: Playoff Ascension Modifier
      // Some players consistently elevate beyond regular-season ceilings in playoffs.
      // Brunson +4.6 PPG (2024), Butler +5 PPG (2023), Luka +3.2 PPG (2024).
      // playoffAscension field (0-1.5) represents this sustained elevation.
      // Distinct from starCeiling (which models single-game variance); this is per-series elevation.
      const ascensionBonus = playersWithWar
        .filter(p => p.playoffAscension && (seriesId ? getEffectiveRating(p, seriesId) : p.rating) > 0)
        .reduce((s, p) => s + (p.playoffAscension || 0), 0);
      if (ascensionBonus > 0) {
        base += ascensionBonus * 0.6; // scaled to avoid overpowering other signals
      }
    }
  }

  // RESEARCH: Non-linear interaction bonuses (Yeung 2020 — Random Forest > linear models)
  // Teams with BOTH high 3PT% AND strong defense get compounding bonus
  // This captures non-linear feature interactions that linear models miss
  const ts = team.advStats.ts || 57;
  const threePct = team.advStats.threePct || 35;
  const drtg = team.advStats.drtg || 113;
  // Shooting + Defense synergy: elite on both ends compounds
  if (threePct > 37 && drtg < 110) {
    base += (threePct - 37) * (110 - drtg) * 0.05; // max ~0.75 for elite teams
  }
  // Pace + Depth interaction — REMOVED from calcTeamRating (ghost fix)
  // Pace-based advantage is now handled in calcWinProb() via paceMatchup differential,
  // which is the better signal (relative pace gap matters more than absolute pace).
  // Having both created a double-count where fast teams got +0.3 in rating AND +1.0 in win prob.

  // SYNERGY: only count lineups where ALL players are currently active
  // BUG FIX: synergy arrays use nicknames ("SGA", "LeBron", "NAW", "PG") but p.name uses full names.
  // Build a fuzzy lookup that maps both full names and last names to active status.
  const activeNameSet = new Set();
  team.players.filter(p => {
    const r = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return r > 0;
  }).forEach(p => {
    activeNameSet.add(p.name); // full name: "Shai Gilgeous-Alexander"
    const parts = p.name.split(' ');
    if (parts.length >= 2) activeNameSet.add(parts[parts.length - 1]); // last name: "Gilgeous-Alexander"
    if (parts.length >= 2) activeNameSet.add(parts[0]); // first name: "Shai"
  });
  // Common nickname map (synergy shorthand → full roster name)
  const NICK_MAP = {"SGA":"Shai Gilgeous-Alexander","LeBron":"LeBron James","KD":"Kevin Durant","AD":"Anthony Davis","Wemby":"Victor Wembanyama","NAW":"Nickeil Alexander-Walker","PG":"Paul George","KAT":"Karl-Anthony Towns","OG":"OG Anunoby","Cade":"Cade Cunningham","Ant":"Anthony Edwards","DLo":"D'Angelo Russell","Jokic":"Nikola Jokic","Giannis":"Giannis Antetokounmpo","Dame":"Damian Lillard","Mobley":"Evan Mobley"};
  const isPlayerActive = (shortName) => {
    if (activeNameSet.has(shortName)) return true;
    if (NICK_MAP[shortName] && activeNameSet.has(NICK_MAP[shortName])) return true;
    // Fuzzy: check if shortName matches any part of a full name
    for (const n of activeNameSet) { if (n.includes(shortName) || shortName.includes(n)) return true; }
    return false;
  };
  const validSynergies = team.synergy.filter(s => s.players.every(n => isPlayerActive(n)));
  const bestSynergy = validSynergies.length > 0 ? Math.max(...validSynergies.map(s => s.score)) : 50;
  base += (bestSynergy - 70) / 5;

  // External factors
  const teamFactors = series.externalFactors.filter(f => f.team === team.abbr);
  base += teamFactors.reduce((s, f) => s + f.impact, 0) / 3;

  // SPM Chemistry bonus (Maymin et al.) — only active players
  const activePlayers = team.players.filter(p => {
    const r = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return r > 0;
  });
  const spmChem = calcSPMChemistry(activePlayers.slice(0, 8));
  base += (spmChem.score - 50) / 10;

  // On/Off aggregate bonus — REMOVED (ghost fix)
  // On/Off data is already baked into each player's composite rating (10% weight).
  // Re-aggregating it at the team level double-counts the signal.
  // Kept as comment for audit trail.

  // Helper: is a player BASELINE injured (already OUT before any user toggles)?
  // vs SCENARIO-TOGGLED (user clicked them out via scenario builder)
  // Baseline injured = rating === 0 AND has an injury containing 'OUT'
  // Scenario-toggled = rating > 0 (or baseRating > 0 with no baseline injury) AND user set to 'out'
  const isBaselineInjured = (p) => p.rating === 0 && p.injury && p.injury.includes('OUT');
  const isScenarioToggled = (p) => {
    if (isBaselineInjured(p)) return false; // already injured at baseline — not a scenario toggle
    return seriesId && scenarioState[seriesId] && scenarioState[seriesId][p.name] === 'out';
  };

  // Advanced stats bonus — scale down only for SCENARIO-TOGGLED players (not baseline injuries)
  // Baseline injuries are already reflected in the team's regular season advStats
  const scenarioOutCount = team.players.filter(p => {
    const br = p.baseRating || 0;
    return isScenarioToggled(p) && br >= 65; // significant rotation player toggled out by user
  }).length;
  const advScale = Math.max(0.3, 1 - scenarioOutCount * 0.15);
  base += ((team.advStats.netRtg - 3) / 3) * advScale;
  base += ((team.advStats.clutchNetRtg - 3) / 4) * advScale;

  // Compounding penalty for multiple SCENARIO-TOGGLED star absences
  // Only counts stars the USER removed — not already-injured players
  const scenarioOutStars = team.players.filter(p => {
    const br = p.baseRating || 0;
    return isScenarioToggled(p) && br >= 75;
  });
  if (scenarioOutStars.length >= 2) {
    base -= scenarioOutStars.length * 2.5;
  }

  // HISTORICAL CALIBRATION (2025-26 regular season without-star data)
  // ONLY for scenario-toggled players — not baseline injuries (already baked in)
  const histTeamData = HISTORICAL_WITHOUT[team.abbr];
  if (seriesId && histTeamData) {
    team.players.forEach(p => {
      if (isScenarioToggled(p) && histTeamData[p.name]) {
        const h = histTeamData[p.name];
        base += h.netRtgSwing / 4;
      }
    });
  }

  // BACKTEST LESSON 3: System Coherence Bonus
  // Teams with elite offensive/defensive systems outperform individual ratings
  if (team.systemBonus != null) {
    base += team.systemBonus;
  }

  // BACKTEST LESSON 4: Championship DNA / Playoff Pedigree
  // Teams with recent deep runs perform ~3-5% above baseline in high-leverage moments
  if (team.playoffPedigree != null && team.playoffPedigree > 0) {
    base += team.playoffPedigree * 0.8; // 0.8 per pedigree point (max ~1.6)
  }

  // BACKTEST LESSON 5: Health Degradation Curve
  // Players with injuryRisk > 0 get progressively reduced ratings in later rounds
  const round = series.round || 'R1';
  const roundDepth = { 'R1': 0, 'R2': 1, 'CF': 2, 'Finals': 3 };
  const depth = roundDepth[round] || 0;
  if (depth > 0) {
    team.players.forEach(p => {
      const effR = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
      if (p.injuryRisk && p.injuryRisk > 0 && effR > 0) {
        // Reduce effective contribution by injuryRisk * depth * 0.4
        // This is a team-level penalty (star playing hurt drags team down)
        // GHOST FIX: only penalize players who are actually active (not scenario-toggled out)
        base -= p.injuryRisk * depth * 0.4;
      }
    });
  }

  // FATIGUE MONITOR (MEDIUM CONFIDENCE) — applies cumulative fatigue penalty
  // Upgraded from LOW to MEDIUM based on G1 validation:
  // - LeBron (41) shifted to facilitator mode — fatigue-driven role change
  // - Edwards admitted altitude fatigue in DEN G1 — compounded with knee
  // - Sharpe's fibula return showed conditioning limits (foul trouble as proxy)
  // - Tatum's Achilles return: 25/11/7 but conditioning monitor across series
  const teamFatigue = calcTeamFatigue(team, series, seriesId);
  if (teamFatigue.index > 0.03) {
    // Scale penalty: max ~2.5 points for heavily fatigued teams (up from 1.5)
    base -= teamFatigue.index * 3.5;
  }

  return Math.min(99, Math.max(20, Math.round(base)));
}

function calcWinProb(series, seriesId) {
  const hr = calcTeamRating(series.homeTeam, series, seriesId);
  const ar = calcTeamRating(series.awayTeam, series, seriesId);

  // BACKTEST LESSON 1: Round-adjusted HCA (replaces flat +3)
  // R1=3.0, R2=2.0, CF=1.5, Finals=1.0 — road teams steal more games in later rounds
  const round = series.round || 'R1';
  let baseHCA = HCA_BY_ROUND[round] || 3.0;

  // BACKTEST LESSON 6: Game 7 override — home teams win ~78% of Game 7s
  // Check if we're in a potential Game 7 scenario (series tied 3-3)
  const score = getSeriesScore(series);
  if (score.home === 3 && score.away === 3) {
    baseHCA = HCA_GAME7_OVERRIDE;
  }

  // homeCourtOverride: 'away' means the away team in data structure actually has home court
  const hca = series.homeCourtOverride === 'away' ? -baseHCA : baseHCA;

  // BACKTEST LESSON 7: Star ceiling variance factor
  // Elite stars add a small "upside variance" that slightly favors the team with higher-ceiling stars
  // GHOST FIX: use getEffectiveRating to respect scenario toggles
  let homeCeiling = 0, awayCeiling = 0;
  series.homeTeam.players.forEach(p => { const effR = seriesId ? getEffectiveRating(p, seriesId) : p.rating; if (p.starCeiling && effR > 0) homeCeiling += p.starCeiling * 0.3; });
  series.awayTeam.players.forEach(p => { const effR = seriesId ? getEffectiveRating(p, seriesId) : p.rating; if (p.starCeiling && effR > 0) awayCeiling += p.starCeiling * 0.3; });
  const ceilingDiff = homeCeiling - awayCeiling;

  // RESEARCH: Team stat differentials (Jones & Magel 2016 — 91.45% variance explained)
  let statDiffBonus = 0;
  const hAdv = series.homeTeam.advStats;
  const aAdv = series.awayTeam.advStats;
  if (hAdv.fgPct && aAdv.fgPct) {
    const fgDiff = (hAdv.fgPct - aAdv.fgPct) * 0.4;
    const threeDiff = ((hAdv.threePct||35) - (aAdv.threePct||35)) * 0.25;
    const orbDiff = ((hAdv.orbPct||25) - (aAdv.orbPct||25)) * 0.15;
    const tovDiff = ((aAdv.tov||13) - (hAdv.tov||13)) * 0.2;
    statDiffBonus = Math.max(-3, Math.min(3, fgDiff + threeDiff + orbDiff + tovDiff));
  }

  // D-LEBRON matchup differential — REMOVED (ghost fix)
  // D-LEBRON is already factored into both team ratings via calcTeamRating()'s D-LEBRON aggregate.
  // Adding it again here would triple-count defense (DRtg via netRtg + D-LEBRON in team rating + here).
  const dLebronEdge = 0;

  // 2024 BACKTEST LESSON: Matchup-Specific Pace/System Differential
  // IND's pace-and-space (103.2 pace) structurally countered MIL's half-court offense.
  // When a fast-paced team faces a slow-paced team, the fast team benefits IF they have depth
  // (more possessions = more rotation minutes = depth advantage matters more).
  // This captures system matchup dynamics beyond the flat systemBonus.
  let paceMatchup = 0;
  const homePace = hAdv.pace || 99;
  const awayPace = aAdv.pace || 99;
  const paceDiff = Math.abs(homePace - awayPace);
  if (paceDiff >= 2) {
    const fasterTeam = homePace > awayPace ? 'home' : 'away';
    const fasterPlayers = fasterTeam === 'home' ? series.homeTeam.players : series.awayTeam.players;
    const activeCount = fasterPlayers.filter(p => {
      const r = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
      return r > 0;
    }).length;
    // Fast team with deep rotation gets matchup bonus (capped at ±1.0)
    if (activeCount >= 8) {
      const paceBonus = Math.min(1.0, paceDiff * 0.15);
      paceMatchup = fasterTeam === 'home' ? paceBonus : -paceBonus;
    }
  }

  // Series-stage pressure modifier
  const pressureMod = getSeriesPressureMod(series);
  const homePedigree = series.homeTeam.playoffPedigree || 0;
  const awayPedigree = series.awayTeam.playoffPedigree || 0;
  const pedigreeEdge = (homePedigree - awayPedigree) * pressureMod * 0.3;

  // PHASE 14: Defensive Matchup Suppression
  // When an elite defender locks onto the opponent's sole initiator, the suppression is amplified.
  // homeSupp = home team's defender suppressing away team's #1 (positive = helps home)
  // awaySupp = away team's defender suppressing home team's #1 (positive = helps away)
  let defMatchupAdj = 0;
  if (series.defMatchups) {
    const dm = series.defMatchups;
    const awayInit = series.awayTeam.initiators || 2;
    const homeInit = series.homeTeam.initiators || 2;
    const homeSupp = calcDefMatchupSuppression(dm.homeDefOnAway, awayInit);
    const awaySupp = calcDefMatchupSuppression(dm.awayDefOnHome, homeInit);
    defMatchupAdj = Math.max(-1.5, Math.min(1.5, homeSupp - awaySupp));
  }

  // PHASE 14 G1 LESSON: Single-Initiator vs Multi-Initiator Penalty
  // DET-ORL G1 proved: Cade's 39pts (sole initiator) lost to ORL's 5 players in double figures.
  // When a single-initiator team faces a multi-initiator team, apply additional penalty.
  let initiatorAdj = 0;
  const homeInit2 = series.homeTeam.initiators || 2;
  const awayInit2 = series.awayTeam.initiators || 2;
  if (homeInit2 === 1 && awayInit2 >= 2) initiatorAdj = -1.5;
  else if (awayInit2 === 1 && homeInit2 >= 2) initiatorAdj = 1.5;

  // PHASE 14 G1 LESSON: Playoff Pedigree Floor
  // DET's 11-game home playoff losing streak shows franchise playoff culture deficit.
  // Teams with pedigree=0 get additional penalty vs teams with pedigree>0.
  let pedigreeFloorAdj = 0;
  if (homePedigree === 0 && awayPedigree > 0) pedigreeFloorAdj = -0.5;
  else if (awayPedigree === 0 && homePedigree > 0) pedigreeFloorAdj = 0.5;

  const diff = (hr + hca + ceilingDiff + statDiffBonus + dLebronEdge + pedigreeEdge + paceMatchup + defMatchupAdj + initiatorAdj + pedigreeFloorAdj) - ar;
  const prob = 1 / (1 + Math.pow(10, -diff / 15));
  return {
    home: Math.round(prob * 100), away: Math.round((1 - prob) * 100),
    homeRating: hr, awayRating: ar,
    hcaUsed: +hca.toFixed(1), round: round
  };
}

function getSeriesScore(series) {
  let home = 0, away = 0;
  series.games.forEach(g => { if (g.winner === series.homeTeam.abbr) home++; else if (g.winner === series.awayTeam.abbr) away++; });
  return { home, away };
}

