// ============================================================
// SERIES GRADUATION UTILITY (Phase 42 — Multi-Round Scalability)
// ============================================================
// When a team advances from one round to the next, this utility
// scaffolds the new series entry with carried-forward state:
//   - Cumulative fatigue from games played
//   - Injury timeline progression
//   - Per-player outlook baselines from prior round performance
//   - Model lesson inheritance
//   - Updated seeding / home court assignment
//
// Usage:
//   const r2Series = graduateSeries(r1Winner, r1Loser, {
//     opponent: opponentWinnerSeries,
//     round: 'R2',
//     homeTeamId: 'OKC'  // which team gets home court
//   });
//   SERIES_DATA.push(r2Series);
// ============================================================

/**
 * Build a new series object from a completed prior-round series.
 * Carries forward fatigue, injuries, player data, and model context.
 *
 * @param {Object} winnerSeries - The completed series the winner came from
 * @param {string} winnerId - Abbreviation of the winning team (e.g., 'OKC')
 * @param {Object} opponentSeries - The completed series the opponent came from
 * @param {string} opponentId - Abbreviation of the opponent (e.g., 'DEN')
 * @param {Object} config - Configuration for the new series
 * @param {string} config.round - 'R2', 'CF', or 'Finals'
 * @param {string} config.homeTeamId - Which team gets home court
 * @param {string} [config.conf] - Conference ('West'/'East'), auto-detected if omitted
 * @returns {Object} New series object ready to push into SERIES_DATA
 */
function graduateSeries(winnerSeries, winnerId, opponentSeries, opponentId, config) {
  const round = config.round;
  const homeTeamId = config.homeTeamId;

  // Extract the winning team's data from their prior series
  const winnerTeam = extractTeamData(winnerSeries, winnerId);
  const opponentTeam = extractTeamData(opponentSeries, opponentId);

  // Determine home/away assignment
  const isWinnerHome = homeTeamId === winnerId;
  const homeTeam = isWinnerHome ? winnerTeam : opponentTeam;
  const awayTeam = isWinnerHome ? opponentTeam : winnerTeam;
  const homePriorSeries = isWinnerHome ? winnerSeries : opponentSeries;
  const awayPriorSeries = isWinnerHome ? opponentSeries : winnerSeries;

  // Auto-detect conference
  const conf = config.conf || winnerSeries.conf || 'West';

  // Build new series ID
  const seriesId = `${homeTeam.abbr}-${awayTeam.abbr}`;

  // Calculate carried-forward fatigue
  const homeGamesPlayed = homePriorSeries.games.filter(g => g.winner).length;
  const awayGamesPlayed = awayPriorSeries.games.filter(g => g.winner).length;

  // Apply fatigue aging to players
  applyCarriedFatigue(homeTeam, homeGamesPlayed, round);
  applyCarriedFatigue(awayTeam, awayGamesPlayed, round);

  // Progress injury timelines
  progressInjuries(homeTeam, round);
  progressInjuries(awayTeam, round);

  // Build the new series object
  return {
    id: seriesId,
    conf: conf,
    round: round,
    priorRound: {
      home: { seriesId: homePriorSeries.id, gamesPlayed: homeGamesPlayed, round: homePriorSeries.round || 'R1' },
      away: { seriesId: awayPriorSeries.id, gamesPlayed: awayGamesPlayed, round: awayPriorSeries.round || 'R1' }
    },
    defMatchups: {
      homeDefOnAway: { defender: 'TBD', target: 'TBD', dLebron: 0, targetUsg: 0, note: 'To be scouted after R1 completion' },
      awayDefOnHome: { defender: 'TBD', target: 'TBD', dLebron: 0, targetUsg: 0, note: 'To be scouted after R1 completion' }
    },
    homeTeam: homeTeam,
    awayTeam: awayTeam,
    externalFactors: buildCarriedFactors(homePriorSeries, awayPriorSeries, homeTeam, awayTeam),
    games: [],
    modelLessons: []
  };
}

/**
 * Extract a team's data from a completed series.
 * Returns a deep copy of the team object with graduation metadata.
 */
function extractTeamData(series, teamId) {
  const isHome = series.homeTeam.abbr === teamId;
  const team = isHome ? series.homeTeam : series.awayTeam;

  // Deep clone to avoid mutating the prior round's data
  const cloned = JSON.parse(JSON.stringify(team));

  // Add graduation metadata
  cloned._graduatedFrom = {
    seriesId: series.id,
    round: series.round || 'R1',
    wasHome: isHome,
    gamesPlayed: series.games.filter(g => g.winner).length
  };

  return cloned;
}

/**
 * Apply carried-forward fatigue adjustments to player data.
 * Teams that played 7 games carry more fatigue than teams that swept.
 * Later rounds compound this further.
 */
function applyCarriedFatigue(team, gamesPlayed, newRound) {
  const roundDepth = { R2: 1, CF: 2, Finals: 3 };
  const depth = roundDepth[newRound] || 0;

  // Fatigue factor: 0.5% per game played in prior round, compounded by round depth
  const baseFatiguePct = gamesPlayed * 0.005 * (1 + depth * 0.15);

  team.players.forEach(p => {
    if (!p.rating || p.rating === 0) return; // Skip OUT players

    // Age-based fatigue multiplier: older players accumulate fatigue faster
    const ageMult = p.age >= 35 ? 1.4 : (p.age >= 30 ? 1.15 : 1.0);

    // Injury-risk players get extra fatigue
    const injuryMult = (p.injuryRisk && p.injuryRisk > 0) ? 1.2 : 1.0;

    const fatigueDeduction = baseFatiguePct * ageMult * injuryMult * p.rating;

    // Store the carried fatigue for lineage tracking
    p._carriedFatigue = {
      fromRound: newRound === 'R2' ? 'R1' : (newRound === 'CF' ? 'R2' : 'CF'),
      gamesPlayed: gamesPlayed,
      deduction: +fatigueDeduction.toFixed(2),
      ageMult: ageMult,
      injuryMult: injuryMult
    };

    // Apply a small injuryRisk increment for players who played heavy minutes
    if (p.injuryRisk != null) {
      p.injuryRisk = +(p.injuryRisk + (gamesPlayed >= 6 ? 0.5 : 0.2)).toFixed(1);
    }
  });

  // Add team-level graduation note
  team._fatigueCarried = {
    gamesPlayed: gamesPlayed,
    newRound: newRound,
    baseFatiguePct: +(baseFatiguePct * 100).toFixed(2)
  };
}

/**
 * Progress injury timelines between rounds.
 * Players who were OUT with a return date may be upgraded.
 * Players with active injuries get their status reassessed.
 */
function progressInjuries(team, newRound) {
  // Approximate days between rounds: R1→R2 ~3-5 days, R2→CF ~3-5 days
  const restDays = { R2: 4, CF: 4, Finals: 5 };
  const days = restDays[newRound] || 4;

  team.players.forEach(p => {
    if (!p.injury) return;

    // Tag with progression metadata
    p._injuryProgression = {
      priorStatus: p.injury,
      restDays: days,
      newRound: newRound
    };

    // Note: actual injury status updates should be done manually based on
    // real-world reports. This just adds the metadata framework for tracking.
  });
}

/**
 * Build carried-forward external factors from prior round series.
 */
function buildCarriedFactors(homePriorSeries, awayPriorSeries, homeTeam, awayTeam) {
  const factors = [];

  // Carry fatigue factor
  const homeGP = homePriorSeries.games.filter(g => g.winner).length;
  const awayGP = awayPriorSeries.games.filter(g => g.winner).length;

  if (homeGP >= 6) {
    factors.push({
      team: homeTeam.abbr,
      player: null,
      desc: `Played ${homeGP} games in ${homePriorSeries.round || 'R1'} — elevated fatigue`,
      impact: homeGP === 7 ? -3 : -2,
      category: 'fatigue',
      evidence: `${homePriorSeries.id} went ${homeGP} games`,
      verdict: 'Carried from prior round'
    });
  }

  if (awayGP >= 6) {
    factors.push({
      team: awayTeam.abbr,
      player: null,
      desc: `Played ${awayGP} games in ${awayPriorSeries.round || 'R1'} — elevated fatigue`,
      impact: awayGP === 7 ? -3 : -2,
      category: 'fatigue',
      evidence: `${awayPriorSeries.id} went ${awayGP} games`,
      verdict: 'Carried from prior round'
    });
  }

  // Sweep momentum bonus
  if (homeGP <= 4) {
    factors.push({
      team: homeTeam.abbr, player: null,
      desc: 'Swept prior round — maximum rest + confidence',
      impact: 3, category: 'motivation',
      evidence: `${homePriorSeries.id} sweep`, verdict: 'Carried from prior round'
    });
  }
  if (awayGP <= 4) {
    factors.push({
      team: awayTeam.abbr, player: null,
      desc: 'Swept prior round — maximum rest + confidence',
      impact: 3, category: 'motivation',
      evidence: `${awayPriorSeries.id} sweep`, verdict: 'Carried from prior round'
    });
  }

  return factors;
}
