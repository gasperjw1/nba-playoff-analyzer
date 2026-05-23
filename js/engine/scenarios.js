// ============================================================
// COMPOUND HISTORICAL SCENARIO ENGINE — Phase 52
// ============================================================
//
// Conditional-narrowing system: each player lookup carries stacked
// historical conditions (role + opponent team + venue + coach + primary
// defender + playoff context + health). The more conditions that match,
// the tighter and more evidence-backed the projection becomes.
//
// Architecture:
//   1. Each player has a `compoundScenarios` array on their data object
//      or on the series object's `scenarios` property.
//   2. Each scenario is a condition-set with a historical evidence summary:
//      { conditions: [...], sampleSize: N, historicalAvg: {pts,reb,ast,fgPct},
//        delta: {pts,reb,ast}, confidence: 0-1, source: "..." }
//   3. At projection time, we find all scenarios whose conditions ALL match
//      the current game context, rank by (# conditions matched × confidence),
//      and blend their deltas into the player's expected stats.
//   4. When multiple scenarios match, they compound — but with diminishing
//      returns (each additional scenario's weight is 70% of the previous).
//
// This is the "intertwined factors" vision: a player's role bump cascades
// to volume change, which cascades to shooting temp, which cascades to
// teammates compensating. Each scenario captures one of these cascading
// links with historical proof.
//
// Key insight: scenarios don't replace the 13-modifier pipeline — they
// ADD a 14th modifier that narrows the projection using opponent-specific
// historical context that the general modifiers can't capture.

// ============================================================
// CONDITION TYPES
// ============================================================
const SCENARIO_CONDITIONS = {
  VS_TEAM:       'vs_team',       // Playing against specific team
  VS_COACH:      'vs_coach',      // Playing against specific coach
  VS_DEFENDER:   'vs_defender',    // Guarded by specific defender
  VENUE:         'venue',         // Home or away
  ROLE:          'role',          // Primary/secondary/third option
  PLAYOFF:       'playoff',       // Playoff context (regular season doesn't count)
  HEALTH:        'health',        // Playing through injury
  REST_DAYS:     'rest_days',     // Short rest (<3 days) or long rest (>7 days)
  SERIES_DEFICIT:'series_deficit', // Down in series
  POST_BLOWOUT:  'post_blowout',  // Coming off 15+ pt loss
  MINUTES_LOAD:  'minutes_load',  // Heavy minutes (36+) or restricted (<25)
  COVERAGE_TYPE: 'coverage_type'  // Drop coverage, switch-all, blitz, etc.
};

// ============================================================
// CONDITION MATCHING
// ============================================================
// Each condition is { type, value } — we check if the current game
// context satisfies it.

function matchesCondition(condition, ctx) {
  switch (condition.type) {
    case SCENARIO_CONDITIONS.VS_TEAM:
      return ctx.oppAbbr === condition.value;
    case SCENARIO_CONDITIONS.VS_COACH:
      return ctx.oppCoach && ctx.oppCoach.toLowerCase().includes(condition.value.toLowerCase());
    case SCENARIO_CONDITIONS.VS_DEFENDER:
      return ctx.primaryDefender && ctx.primaryDefender.toLowerCase().includes(condition.value.toLowerCase());
    case SCENARIO_CONDITIONS.VENUE:
      return (condition.value === 'home' && ctx.isHome) || (condition.value === 'away' && !ctx.isHome);
    case SCENARIO_CONDITIONS.ROLE:
      // Support comma-separated role values: "secondary,third" matches either
      if (!ctx.playerRole) return false;
      const roles = condition.value.toLowerCase().split(',').map(r => r.trim());
      return roles.some(r => ctx.playerRole.toLowerCase().includes(r));
    case SCENARIO_CONDITIONS.PLAYOFF:
      return condition.value === true && ctx.isPlayoff === true;
    case SCENARIO_CONDITIONS.HEALTH:
      if (condition.value === 'injured') return ctx.hasActiveInjury === true;
      if (condition.value === 'healthy') return ctx.hasActiveInjury === false;
      return true;
    case SCENARIO_CONDITIONS.REST_DAYS:
      if (condition.value === 'short') return ctx.restDays !== undefined && ctx.restDays <= 2;
      if (condition.value === 'long') return ctx.restDays !== undefined && ctx.restDays >= 7;
      return false;
    case SCENARIO_CONDITIONS.SERIES_DEFICIT:
      return ctx.isTrailing === (condition.value === true);
    case SCENARIO_CONDITIONS.POST_BLOWOUT:
      return ctx.postBlowoutLoss === (condition.value === true);
    case SCENARIO_CONDITIONS.MINUTES_LOAD:
      if (condition.value === 'heavy') return ctx.projMinutes >= 36;
      if (condition.value === 'restricted') return ctx.projMinutes <= 25;
      return false;
    case SCENARIO_CONDITIONS.COVERAGE_TYPE:
      return ctx.coverageType && ctx.coverageType.toLowerCase().includes(condition.value.toLowerCase());
    default:
      return false;
  }
}

// ============================================================
// SCENARIO MATCHING & COMPOUNDING
// ============================================================
// Given a player's scenarios and the current game context, find all
// matching scenarios, rank them, and compute a compound delta.

function buildGameContext(player, series, gameIdx, side) {
  const isHome = side === 'home';
  const team = isHome ? series.homeTeam : series.awayTeam;
  const opp = isHome ? series.awayTeam : series.homeTeam;
  const gameNum = gameIdx + 1;

  // Determine primary defender from defMatchups
  let primaryDefender = null;
  if (series.defMatchups) {
    const matchup = isHome
      ? series.defMatchups.awayDefOnHome
      : series.defMatchups.homeDefOnAway;
    if (matchup && matchup.target === player.name) {
      primaryDefender = matchup.defender;
    }
  }

  // Determine player role rank
  const sorted = [...team.players].sort((a, b) => (b.baseRating || b.rating || 0) - (a.baseRating || a.rating || 0));
  const rank = sorted.findIndex(p => p.name === player.name);
  let playerRole = rank <= 0 ? 'primary' : rank <= 1 ? 'secondary' : rank <= 2 ? 'third' : 'role';

  // Check coaching role changes that override natural ranking
  if (series.coaching && series.coaching.roleChanges) {
    const rc = series.coaching.roleChanges.find(r => {
      const rcName = r.player.toLowerCase();
      const playerLast = player.name.split(' ').pop().toLowerCase();
      return rcName === playerLast || player.name.toLowerCase().includes(rcName);
    });
    if (rc && rc.playoff) playerRole = rc.playoff.toLowerCase().includes('primary') ? 'primary' : rc.playoff.toLowerCase().includes('second') ? 'secondary' : playerRole;
  }

  // Series score context
  const score = typeof getSeriesScore === 'function' ? getSeriesScore(series) : { home: 0, away: 0 };
  const teamWins = isHome ? score.home : score.away;
  const oppWins = isHome ? score.away : score.home;
  const isTrailing = oppWins > teamWins;

  // Post-blowout check (lost by 15+ in prior game)
  let postBlowoutLoss = false;
  if (series.games && gameIdx > 0) {
    const priorGame = series.games[gameIdx - 1];
    if (priorGame && priorGame.winner) {
      const priorMargin = Math.abs((priorGame.homeScore || 0) - (priorGame.awayScore || 0));
      const teamWonPrior = priorGame.winner === team.abbr;
      postBlowoutLoss = !teamWonPrior && priorMargin >= 15;
    }
  }

  // Rest days
  const restDays = series.priorRound
    ? (isHome ? series.priorRound.home?.restDays : series.priorRound.away?.restDays) || undefined
    : undefined;

  // Projected minutes (rough estimate by rank, reduced for injured players)
  let projMinutes = rank <= 1 ? 37 : rank <= 3 ? 32 : rank <= 5 ? 25 : 18;
  const injSeverity = player.activeInjury ? player.activeInjury.severity : (player.injuryRisk || 0);
  if (injSeverity >= 0.3) {
    projMinutes = Math.min(projMinutes, 25); // Cap at 25min for significantly injured players
  }

  // Coverage type from series coaching data
  const coverageType = series.coaching
    ? (isHome ? series.coaching.away?.coverageVsPrimary : series.coaching.home?.coverageVsPrimary) || null
    : null;

  // Opponent coach
  const oppCoach = series.coaching
    ? (isHome ? series.coaching.away?.name : series.coaching.home?.name) || null
    : null;

  return {
    oppAbbr: opp.abbr,
    oppCoach,
    primaryDefender,
    isHome,
    playerRole,
    isPlayoff: true,
    hasActiveInjury: !!(player.activeInjury && player.activeInjury.severity > 0) ||
                     (!player.activeInjury && player.injury && !player.injury.startsWith('null') &&
                      (player.injury.includes('LIMITED') || player.injury.includes('QUESTIONABLE') ||
                       player.injury.includes('GTD') || /\bACTIVE\b/.test(player.injury) ||
                       player.injury.includes('Returning') || player.injury.includes('Monitoring') ||
                       (player.injuryRisk !== undefined && player.injuryRisk > 0))),
    restDays,
    isTrailing,
    postBlowoutLoss,
    projMinutes: injSeverity >= 0.3 ? 25 : projMinutes,
    coverageType,
    gameNum,
    seriesId: series.id
  };
}

function findMatchingScenarios(player, series, gameIdx, side) {
  // Collect scenarios from player object and series-level scenarios
  const playerScenarios = player.compoundScenarios || [];
  const seriesScenarios = (series.compoundScenarios || {})[player.name] || [];
  const allScenarios = [...playerScenarios, ...seriesScenarios];

  if (allScenarios.length === 0) return { matches: [], ctx: null };

  const ctx = buildGameContext(player, series, gameIdx, side);
  const matches = [];

  for (const scenario of allScenarios) {
    const conditions = scenario.conditions || [];
    if (conditions.length === 0) continue;

    let matchedCount = 0;
    for (const cond of conditions) {
      if (matchesCondition(cond, ctx)) matchedCount++;
    }

    // Require ALL conditions to match for the scenario to apply
    if (matchedCount === conditions.length) {
      matches.push({
        ...scenario,
        conditionsMatched: matchedCount,
        // Score: more conditions = more specific = higher weight
        // Confidence scales the weight (low sample = low confidence)
        score: matchedCount * (scenario.confidence || 0.5) * Math.min(1, (scenario.sampleSize || 1) / 5)
      });
    }
  }

  // Sort by score descending (most specific + highest confidence first)
  matches.sort((a, b) => b.score - a.score);

  return { matches, ctx };
}

// ============================================================
// COMPOUND SCENARIO DELTA CALCULATION
// ============================================================
// Blend matching scenarios with diminishing returns.
// First match gets full weight, each subsequent gets 70% of previous.
// This prevents over-correction when many scenarios stack.

function calcCompoundScenarioDelta(player, series, gameIdx, side) {
  const { matches, ctx } = findMatchingScenarios(player, series, gameIdx, side);

  if (matches.length === 0) return null;

  let ptsDelta = 0, rebDelta = 0, astDelta = 0;
  let currentWeight = 1.0;
  const DECAY = 0.7; // each subsequent scenario carries 70% of previous weight
  let totalWeight = 0;
  const appliedScenarios = [];

  for (const match of matches) {
    const d = match.delta || {};
    const w = currentWeight * (match.confidence || 0.5);

    ptsDelta += (d.pts || 0) * w;
    rebDelta += (d.reb || 0) * w;
    astDelta += (d.ast || 0) * w;
    totalWeight += w;

    appliedScenarios.push({
      label: match.label || match.source || 'Scenario',
      conditions: match.conditions.length,
      sampleSize: match.sampleSize || 0,
      ptsDelta: (d.pts || 0) * w,
      rebDelta: (d.reb || 0) * w,
      astDelta: (d.ast || 0) * w,
      weight: w
    });

    currentWeight *= DECAY;

    // Cap at 4 compounding scenarios to prevent runaway adjustments
    if (appliedScenarios.length >= 4) break;
  }

  // Safety cap: compound adjustments can't swing more than ±35% of base stats
  const capPct = 0.35;
  const basePts = player.ppg || 20;
  const baseReb = player.rpg || 5;
  const baseAst = player.apg || 3;
  ptsDelta = Math.max(-basePts * capPct, Math.min(basePts * capPct, ptsDelta));
  rebDelta = Math.max(-baseReb * capPct, Math.min(baseReb * capPct, rebDelta));
  astDelta = Math.max(-baseAst * capPct, Math.min(baseAst * capPct, astDelta));

  return {
    ptsDelta: +ptsDelta.toFixed(1),
    rebDelta: +rebDelta.toFixed(1),
    astDelta: +astDelta.toFixed(1),
    scenariosApplied: appliedScenarios,
    totalWeight: +totalWeight.toFixed(2),
    ctx
  };
}

// ============================================================
// CASCADE INTERACTION MODEL
// ============================================================
// When one player's scenario delta is large enough, it creates
// cascading effects on teammates. For example:
//   - Star scores -8pts due to defensive matchup → teammates must
//     compensate → secondary scorer gets +3pts bump, role players +1pts each
//   - Star's role expands (+5pts) → role players lose touches (-1pts each)
//
// This captures the "everything affects everything" intertwined model.

function calcCascadeEffects(allPlayerDeltas, team) {
  const active = team.players.filter(p => p.rating > 0).slice(0, 8);
  if (active.length < 3 || allPlayerDeltas.length === 0) return {};

  const cascadeMap = {}; // playerName → { ptsDelta, rebDelta, astDelta }

  for (const pd of allPlayerDeltas) {
    if (!pd.result || Math.abs(pd.result.ptsDelta) < 2) continue;

    // Large negative delta on a star → teammates compensate
    // Large positive delta on a star → teammates lose touches
    const ptsDelta = pd.result.ptsDelta;
    const cascadeDirection = ptsDelta < 0 ? 1 : -1; // compensate vs lose touches

    // Distribute cascade among other active players proportional to their rating
    const others = active.filter(p => p.name !== pd.playerName);
    const totalRating = others.reduce((s, p) => s + (p.rating || 50), 0);

    for (const other of others) {
      const share = (other.rating || 50) / totalRating;
      // Cascade is ~30% of the original delta, distributed proportionally
      const cascadePts = ptsDelta * -0.3 * share * cascadeDirection;
      const cascadeAst = ptsDelta * -0.08 * share * cascadeDirection;

      if (!cascadeMap[other.name]) cascadeMap[other.name] = { ptsDelta: 0, rebDelta: 0, astDelta: 0 };
      cascadeMap[other.name].ptsDelta += cascadePts;
      cascadeMap[other.name].astDelta += cascadeAst;
    }
  }

  return cascadeMap;
}

// ============================================================
// MAIN ENTRY POINT — applies compound scenarios + cascades
// ============================================================
// Called from calcExpectedPlayerStats as modifier #14

function applyCompoundScenarios(player, series, gameIdx, side, currentPts, currentReb, currentAst) {
  const result = calcCompoundScenarioDelta(player, series, gameIdx, side);
  if (!result) return { pts: 0, reb: 0, ast: 0, modifier: null };

  return {
    pts: result.ptsDelta,
    reb: result.rebDelta,
    ast: result.astDelta,
    modifier: {
      label: 'Compound Scenarios (' + result.scenariosApplied.length + ')',
      ptsDelta: result.ptsDelta,
      rebDelta: result.rebDelta,
      astDelta: result.astDelta,
      pct: +((result.ptsDelta / (currentPts || 1)) * 100).toFixed(1),
      details: result.scenariosApplied
    }
  };
}

// ============================================================
// TEAM-LEVEL COMPOUND SCENARIO SUMMARY
// ============================================================
// For the UI: show which scenarios are active for a given team/game

function getTeamScenarioSummary(series, gameIdx, side) {
  const isHome = side === 'home';
  const team = isHome ? series.homeTeam : series.awayTeam;
  const active = team.players.filter(p => p.rating > 0).slice(0, 8);
  const summaries = [];

  // First pass: get individual scenario deltas
  const allDeltas = [];
  for (const player of active) {
    const result = calcCompoundScenarioDelta(player, series, gameIdx, side);
    if (result && result.scenariosApplied.length > 0) {
      allDeltas.push({ playerName: player.name, result });
      summaries.push({
        player: player.name.split(' ').pop(),
        scenarios: result.scenariosApplied.length,
        ptsDelta: result.ptsDelta,
        rebDelta: result.rebDelta,
        astDelta: result.astDelta,
        topScenario: result.scenariosApplied[0]?.label || 'N/A'
      });
    }
  }

  // Second pass: cascading effects
  const cascades = calcCascadeEffects(allDeltas, team);
  const cascadeSummaries = [];
  for (const [name, delta] of Object.entries(cascades)) {
    if (Math.abs(delta.ptsDelta) >= 0.5) {
      cascadeSummaries.push({
        player: name.split(' ').pop(),
        ptsDelta: +delta.ptsDelta.toFixed(1),
        astDelta: +delta.astDelta.toFixed(1),
        type: 'cascade'
      });
    }
  }

  return {
    directScenarios: summaries,
    cascadeEffects: cascadeSummaries,
    totalPtsDelta: +(summaries.reduce((s, x) => s + x.ptsDelta, 0) + cascadeSummaries.reduce((s, x) => s + x.ptsDelta, 0)).toFixed(1)
  };
}
