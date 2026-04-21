// ============================================================
// FATIGUE MONITOR (MEDIUM CONFIDENCE — upgraded from LOW after G1 validation)
// ============================================================
// Research basis:
// - Mental fatigue reduces FT accuracy ~5%, decision-making ~6% (Pageaux et al., Smith et al.)
// - Back-to-back games cause 1-3 point performance drop (Huyghe et al. 2018)
// - Severe physical fatigue hits 3PT accuracy hardest (Oudejans et al.)
// - Travel distance increases turnovers (p=0.038, Steenland & Deddens)
// - Players 33+ show accelerated fatigue compounding across playoff series
// PHASE 17 ADDITIONS (Google Scholar research):
// - Esteves et al. (2021, 95 citations): Schedule congestion impacts NBA performance via non-linear
//   recovery curve. 1 day rest = significant fatigue, 2 days = moderate, 3+ = full recovery.
// - Jewell et al. (2025): End-of-season performance declines as function of cumulative minutes.
//   Heavy-minute players show measurable decline into playoffs beyond game-to-game rest.
// - Singh et al. (2021, 51 citations): Sleep/recovery deficits compound across the postseason.
// NOTE: Upgraded to MEDIUM CONFIDENCE after G1 validation (age, altitude, injury-compounded fatigue).

function calcPlayerFatigue(player, series) {
  let fatigue = 0;
  const round = series.round || 'R1';
  const roundDepth = { 'R1': 0, 'R2': 1, 'CF': 2, 'Finals': 3 };
  const depth = roundDepth[round] || 0;
  const gamesPlayed = series.games.filter(g => g.winner).length;

  // 1. AGE FACTOR — players 33+ accumulate fatigue faster
  // Research: older athletes show reduced recovery rates and cumulative performance decline
  const age = player.age || 0;
  if (age >= 33) {
    const agePenalty = (age - 32) * 0.08; // 0.08 per year over 32
    fatigue += agePenalty * (1 + depth * 0.3); // compounds in later rounds
  }

  // 2. MINUTES LOAD — high-minute players degrade across a series
  // Research: back-to-back and extended minutes cause 1-3pt drop
  // PHASE 17 (Jewell et al. 2025): Cumulative season minutes compound into playoff fatigue.
  // Players averaging 36+ MPG over 82 games carry ~2400+ total minutes into postseason.
  // This cumulative load is ADDITIONAL to game-to-game rest — it's a baseline fatigue floor.
  const mpg = player.ppg ? (player.usg ? Math.min(40, 48 * (player.usg / 100) * 2.4) : 32) : 0;
  // Approximate MPG from usage if not explicitly stored
  if (mpg > 36) {
    fatigue += (mpg - 36) * 0.04 * (1 + gamesPlayed * 0.15);
  }
  // PHASE 17: Cumulative Season Minutes Load (Jewell et al. 2025)
  // Players with high regular-season minutes carry a baseline fatigue into playoffs.
  // Estimated season minutes = mpg * 75 (avg games played for playoff-caliber players)
  const estSeasonMin = mpg * 75;
  if (estSeasonMin > 2400) {
    // Each 100 minutes above 2400 adds a small baseline fatigue
    fatigue += (estSeasonMin - 2400) * 0.0003 * (1 + depth * 0.2);
  }

  // PHASE 17: Non-Linear Rest Recovery (Esteves et al. 2021, 95 citations)
  // Recovery between games follows a non-linear curve:
  // 1 day rest = 0.6x recovery, 2 days = 0.85x, 3+ days = 1.0x (full)
  // In R1, games are every 2 days; later rounds may have 1-day gaps.
  // We model this as an additional fatigue penalty for later rounds where
  // rest days between games are shorter.
  const restPenalty = depth >= 2 ? 0.04 : (depth >= 1 ? 0.02 : 0);

  // 3. INJURY HISTORY — removed to avoid ghosting with Health Degradation Curve
  // (injuryRisk is already penalized via base -= injuryRisk * depth * 0.4 in calcTeamRating)

  // 3b. ACTIVE INJURY FACTOR — players playing through injuries fatigue faster
  // This is NOT the same as injuryRisk (which affects Health Degradation Curve).
  // activeInjury models the compounding physical toll of playing through a known injury:
  // - severity sets the base fatigue contribution
  // - compounds with games played (each game worsens the toll)
  // - compounds with round depth (cumulative playoff wear)
  if (player.activeInjury && player.activeInjury.severity > 0) {
    const injSeverity = player.activeInjury.severity;
    // Base contribution from injury + compounds with games and depth
    const injFatigue = injSeverity * 0.15 * (1 + gamesPlayed * 0.2) * (1 + depth * 0.25);
    fatigue += injFatigue;
  }

  // 4. MENTAL FATIGUE COMPONENT — cumulative across series
  // Research: mental fatigue reduces FT accuracy ~5%, decision-making ~6%
  // We model this as a small penalty that grows with games played and series depth
  const mentalFatigue = gamesPlayed * 0.03 * (1 + depth * 0.15);
  fatigue += mentalFatigue;

  // 4b. REST RECOVERY PENALTY (Esteves et al. 2021) — later rounds have less rest
  fatigue += restPenalty;

  // 5. ROLE-BASED FATIGUE — primary ball handlers and shot creators fatigue more
  // These roles require constant decision-making (mental) and carry heavier physical load
  if (player.offRole === 'Primary Ball Handler' || player.offRole === 'Shot Creator') {
    fatigue += 0.05 * (1 + gamesPlayed * 0.1);
  }

  // Cap fatigue at a reasonable maximum (0 to 1.0 scale)
  // Apply MEDIUM CONFIDENCE weight: 0.75 (upgraded from 0.5 LOW)
  // Validation: G1 results showed fatigue factors were predictive —
  // LeBron (age 41) facilitated instead of scoring, Edwards admitted altitude fatigue,
  // Sharpe's fibula return showed conditioning limits, Tatum's Achilles return was a factor.
  return Math.min(1.0, Math.max(0, fatigue * 0.75));
}

function calcTeamFatigue(team, series, seriesId) {
  // GHOST FIX: use getEffectiveRating to respect scenario toggles
  const activePlayers = team.players.filter(p => {
    const effR = seriesId ? getEffectiveRating(p, seriesId) : p.rating;
    return effR > 0;
  });
  if (activePlayers.length === 0) return { index: 0, players: [] };

  const playerFatigues = activePlayers.map(p => ({
    name: p.name,
    fatigue: calcPlayerFatigue(p, series),
    rating: p.rating
  }));

  // Sort by rating descending so highest-rated players get highest weight
  playerFatigues.sort((a, b) => b.rating - a.rating);

  // Team fatigue index is a weighted average (stars count more)
  let wSum = 0, wTot = 0;
  playerFatigues.forEach((pf, i) => {
    const w = Math.max(1, 5 - i);
    wSum += pf.fatigue * w;
    wTot += w;
  });

  return {
    index: wTot > 0 ? wSum / wTot : 0,
    players: playerFatigues.sort((a, b) => b.fatigue - a.fatigue)
  };
}
