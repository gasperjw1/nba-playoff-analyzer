// ============================================================
// PLAYOFF RUN — GAME/SERIES ORCHESTRATOR (Phase 1)
// ============================================================
// Glues the three layers: capacity (roster → expected scores + shares),
// regime (game character), trajectory (quarter walk + box allocation).
// Also owns the hidden series-context shifts — rolled ONCE per series per
// player (design: the persistent term behind the measured +0.33 player
// serial correlation; the user never sees the roll, only noisy samples).
//
// Plans: both sides accept the SAME plan shape (symmetric coaching —
// design law; the AI and the user use identical controls):
//   { rotation, roleAssignments, unavailable, fatigue }   (all optional)
// Phase 2 adds coach-AI-generated plans + injuries; Phase 1 defaults
// exercise the full pipeline with default rotations.
// ============================================================

/** Roll hidden series-context shifts for every player in the series. */
function rollSeriesShifts(seriesCtx, rng) {
  const cfg = GAME_CONFIG;
  const shifts = {};
  [seriesCtx.home, seriesCtx.away].forEach(team => {
    team.players.forEach(p => {
      const sigma = cfg.tiers[p.tier].shiftSigma;
      const v = 1 + gameNormal(rng, 0, sigma);
      shifts[p.name] = Math.min(cfg.shiftClamp[1], Math.max(cfg.shiftClamp[0], v));
    });
  });
  return shifts;
}

/** Marquee-assignment suppression: ORtg tax on the targeted offense.
 *  Scale mirrors calcDefMatchupSuppression's effect size (analyzer). */
function _assignmentSuppression(assignment) {
  if (!assignment || assignment.dLebron == null) return 0;
  return Math.max(0, Math.min(2.0, assignment.dLebron * 0.9));
}

/**
 * Simulate one game.
 * @param {Object} seriesCtx  from makeGameSeries
 * @param {number} gameNum    1-7
 * @param {Object} opts
 *   seed        : number (fresh RNG) — or rng: continue an existing stream
 *   shifts      : {name: mult} — pass the series' rolls; fresh-rolled if absent
 *   seriesScore : {home, away} entering this game (elimination/G7 detection)
 *   homePlan / awayPlan : plan objects (see header)
 */
/**
 * Deterministic pre-noise expectation for a pair of plans — the shared
 * core of simulateGameOnce AND the process-CVA comparison (grade the
 * PLAN, not the dice: same function, different plans).
 */
function computeExpectedForPlans(seriesCtx, gameNum, seriesScore, homePlan, awayPlan) {
  homePlan = homePlan || {}; awayPlan = awayPlan || {};
  let capHome = computeTeamCapacity(seriesCtx.home, {
    ...homePlan, suppression: _assignmentSuppression(seriesCtx.defAssignments.awayOnHome),
  });
  let capAway = computeTeamCapacity(seriesCtx.away, {
    ...awayPlan, suppression: _assignmentSuppression(seriesCtx.defAssignments.homeOnAway),
  });
  // Coverage plans: each side's doubleTarget reshapes the OPPONENT's
  // offense (suppressed star, elevated others, initiator-count tradeoff).
  capAway = applyDoubleCoverage(capAway, homePlan.doubleTarget, seriesCtx.away.initiators);
  capHome = applyDoubleCoverage(capHome, awayPlan.doubleTarget, seriesCtx.home.initiators);
  // Baseline capacities: default plan under the SAME availability/fatigue
  // (injuries are physics; choices are not). The compression split in
  // expectedGameScores compresses only the baseline gap.
  const baseOf = (team, plan, suppression) => computeTeamCapacity(team, {
    unavailable: plan.unavailable, fatigue: plan.fatigue, suppression,
  });
  const baseHome = baseOf(seriesCtx.home, homePlan, _assignmentSuppression(seriesCtx.defAssignments.awayOnHome));
  const baseAway = baseOf(seriesCtx.away, awayPlan, _assignmentSuppression(seriesCtx.defAssignments.homeOnAway));
  const exp = expectedGameScores(seriesCtx, capHome, capAway, gameNum,
    seriesScore || { home: 0, away: 0 }, baseHome, baseAway);
  return { exp, capHome, capAway };
}

function simulateGameOnce(seriesCtx, gameNum, opts) {
  opts = opts || {};
  const rng = opts.rng || gameCreateRNG(opts.seed == null ? 1 : opts.seed);
  const shifts = opts.shifts || rollSeriesShifts(seriesCtx, rng);
  const score = opts.seriesScore || { home: 0, away: 0 };
  const homePlan = opts.homePlan || {}, awayPlan = opts.awayPlan || {};

  const { exp, capHome, capAway } = computeExpectedForPlans(seriesCtx, gameNum, score, homePlan, awayPlan);
  // Team-level series edge (rolled once per series by the caller): the
  // matchup-fit residual — see GAME_CONFIG.seriesEdgeSigma.
  const edge = opts.seriesEdge || 0;
  exp.home += edge / 2;
  exp.away -= edge / 2;
  exp.margin = exp.home - exp.away;
  const elimination = score.home === 3 || score.away === 3;
  const regime = sampleGameRegime(rng, exp.margin, { elimination });
  const flow = simulateGameFlow(exp, regime, rng);

  const garbage = Math.abs(flow.homeScore - flow.awayScore) >= 18;
  const otMinutes = flow.ot * 5;
  const box = {
    home: allocateBox(capHome, flow.homeScore, rng, { shifts, garbage, otMinutes }),
    away: allocateBox(capAway, flow.awayScore, rng, { shifts, garbage, otMinutes }),
  };

  return {
    gameNum,
    homeScore: flow.homeScore, awayScore: flow.awayScore,
    winner: flow.homeScore > flow.awayScore ? seriesCtx.home.abbr : seriesCtx.away.abbr,
    quarters: flow.quarters, ot: flow.ot,
    regime: regime.type, capitulated: flow.capitulated,
    expected: { home: exp.home, away: exp.away },   // the center — internal, never the display
    box,
  };
}

/**
 * Simulate a full best-of-7. One RNG stream for the whole series so a
 * single seed reproduces everything (shift rolls included).
 */
function simulateSeriesOnce(seriesCtx, opts) {
  opts = opts || {};
  const rng = opts.rng || gameCreateRNG(opts.seed == null ? 1 : opts.seed);
  const shifts = rollSeriesShifts(seriesCtx, rng);
  const seriesEdge = gameNormal(rng, 0, GAME_CONFIG.seriesEdgeSigma);
  const games = [];
  const score = { home: 0, away: 0 };
  for (let g = 1; g <= 7 && score.home < 4 && score.away < 4; g++) {
    const game = simulateGameOnce(seriesCtx, g, {
      rng, shifts, seriesEdge, seriesScore: { home: score.home, away: score.away },
      homePlan: opts.homePlan, awayPlan: opts.awayPlan,
    });
    games.push(game);
    if (game.winner === seriesCtx.home.abbr) score.home++; else score.away++;
  }
  return {
    games, score, shifts,
    winner: score.home === 4 ? seriesCtx.home.abbr : seriesCtx.away.abbr,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rollSeriesShifts, computeExpectedForPlans, simulateGameOnce, simulateSeriesOnce };
}
