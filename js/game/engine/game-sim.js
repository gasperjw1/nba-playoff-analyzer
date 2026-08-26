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
 * Resolve one side's marquee defensive assignment: the plan's chosen
 * stopper (a real lever — an interior body miscast onto the point of
 * attack loses most of the suppression) or the factory-derived default.
 * Returns {defender, target, suppression}.
 */
function resolveCoverage(defTeam, plan, derivedAssignment) {
  if (plan && plan.stopper && derivedAssignment) {
    const d = defTeam.players.find(p => p.name === plan.stopper);
    if (d) {
      const fit = gameRoleFitCost(d.defRole, 'Point of Attack', GAME_DEF_ROLE_FAMILY);
      return {
        defender: d.name, target: derivedAssignment.target,
        suppression: Math.max(0, Math.min(2.0, d.dLebron * 0.9 * (1 - 0.7 * fit))),
      };
    }
  }
  return {
    defender: derivedAssignment ? derivedAssignment.defender : null,
    target: derivedAssignment ? derivedAssignment.target : null,
    suppression: _assignmentSuppression(derivedAssignment),
  };
}

/** Starter set for a plan: explicit choice, else top-5 planned minutes. */
function gameStarterNames(plan, cap) {
  if (plan && Array.isArray(plan.starters) && plan.starters.length === 5) return plan.starters.slice();
  return cap.playerShares.slice().sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5).map(r => r.player.name);
}

/** Position groups: PG/SG guard, SF wing, PF/C big. */
function gamePosGroup(pos) {
  if (pos === 'PG' || pos === 'SG') return 'g';
  if (pos === 'SF') return 'w';
  return 'b';
}

/**
 * Lineup composition of a starting five: counts, label (e.g. "2G-2W-1B"),
 * and the ORtg/DRtg mods for off-shape fives (see GAME_CONFIG.composition).
 */
function gameLineupComposition(team, starterNames) {
  const five = team.players.filter(p => starterNames.includes(p.name));
  const c = { g: 0, w: 0, b: 0 };
  five.forEach(p => { c[gamePosGroup(p.pos)]++; });
  const cfg = GAME_CONFIG.composition;
  let ortgMod = 0, drtgMod = 0;
  const notes = [];
  if (c.b >= 3) { ortgMod += cfg.threeBigOrtg; notes.push('3+ bigs: spacing suffers'); }
  if (c.g === 0) { ortgMod += cfg.noGuardOrtg; notes.push('no guards: creation suffers'); }
  if (c.g >= 3) { drtgMod += cfg.threeGuardDrtg; notes.push('3+ guards: size gives up the rim and glass'); }
  if (c.b === 0) { drtgMod += cfg.noBigDrtg; notes.push('no bigs: no rim protection'); }
  if (c.w === 0 && c.g > 0 && c.b > 0) { ortgMod += cfg.noWingMixed; notes.push('wingless: switch targets'); }
  return { counts: c, label: `${c.g}G-${c.w}W-${c.b}B`, ortgMod, drtgMod, notes };
}

/**
 * Starting-five synergy vs the team's own default five (SPM chemistry,
 * reused from the analyzer). Returns {mod, score}; 0 when chemistry is
 * unavailable or the five matches the baseline by construction.
 */
const _gameSynergyCache = new Map();   // teamAbbr|sorted-five -> result
function gameSynergyMod(team, starterNames) {
  if (typeof calcSPMChemistry !== 'function' || team.synergyBase == null) return { mod: 0, score: null };
  if (starterNames.length < 5) return { mod: 0, score: null };
  // Memoized: lineups repeat across the hundreds of thousands of sim
  // games in the backtests (CPU fives rarely change), and SPM is the
  // priciest per-game computation.
  const key = team.abbr + '|' + starterNames.slice().sort().join('|');
  const hit = _gameSynergyCache.get(key);
  if (hit) return hit;
  const five = team.players.filter(p => starterNames.includes(p.name))
    .map(p => ({ ...p, rating: p.baseRating }));
  if (five.length < 5) return { mod: 0, score: null };
  const score = calcSPMChemistry(five).score;
  const cfg = GAME_CONFIG;
  const mod = Math.max(-cfg.synergyCap, Math.min(cfg.synergyCap, (score - team.synergyBase) * cfg.synergyScale));
  const out = { mod, score };
  if (_gameSynergyCache.size < 20000) _gameSynergyCache.set(key, out);
  return out;
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
  // Coverage: derived PER GAME from the actual rotations (a returning or
  // injured star can't be a ghost target), then the plan's stopper
  // override applies. Falls back to the series-level derivation.
  const derOnAway = gameDeriveAssignment(seriesCtx.home, seriesCtx.away,
    awayPlan.rotation || null, homePlan.rotation || null) || seriesCtx.defAssignments.homeOnAway;
  const derOnHome = gameDeriveAssignment(seriesCtx.away, seriesCtx.home,
    homePlan.rotation || null, awayPlan.rotation || null) || seriesCtx.defAssignments.awayOnHome;
  const covOnHome = resolveCoverage(seriesCtx.away, awayPlan, derOnHome);
  const covOnAway = resolveCoverage(seriesCtx.home, homePlan, derOnAway);
  let capHome = computeTeamCapacity(seriesCtx.home, { ...homePlan, suppression: covOnHome.suppression });
  let capAway = computeTeamCapacity(seriesCtx.away, { ...awayPlan, suppression: covOnAway.suppression });
  const startersHome = gameStarterNames(homePlan, capHome);
  const startersAway = gameStarterNames(awayPlan, capAway);
  const synHome = gameSynergyMod(seriesCtx.home, startersHome);
  const synAway = gameSynergyMod(seriesCtx.away, startersAway);
  const compHome = gameLineupComposition(seriesCtx.home, startersHome);
  const compAway = gameLineupComposition(seriesCtx.away, startersAway);
  capHome = { ...capHome, ortg: capHome.ortg + synHome.mod + compHome.ortgMod, drtg: capHome.drtg + compHome.drtgMod };
  capAway = { ...capAway, ortg: capAway.ortg + synAway.mod + compAway.ortgMod, drtg: capAway.drtg + compAway.drtgMod };
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
  return { exp, capHome, capAway, covOnHome, covOnAway, synHome, synAway, compHome, compAway };
}

function simulateGameOnce(seriesCtx, gameNum, opts) {
  opts = opts || {};
  const rng = opts.rng || gameCreateRNG(opts.seed == null ? 1 : opts.seed);
  const shifts = opts.shifts || rollSeriesShifts(seriesCtx, rng);
  const score = opts.seriesScore || { home: 0, away: 0 };
  const homePlan = opts.homePlan || {}, awayPlan = opts.awayPlan || {};

  const { exp, capHome, capAway, covOnHome, covOnAway, synHome, synAway, compHome, compAway } =
    computeExpectedForPlans(seriesCtx, gameNum, score, homePlan, awayPlan);
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
  const homeStarters = gameStarterNames(homePlan, capHome);
  const awayStarters = gameStarterNames(awayPlan, capAway);
  const box = {
    home: allocateBox(capHome, flow.homeScore, rng, { shifts, garbage, otMinutes, starters: homeStarters }),
    away: allocateBox(capAway, flow.awayScore, rng, { shifts, garbage, otMinutes, starters: awayStarters }),
  };

  // Coach's report: what the sim actually did with the plans — coverage
  // outcomes, doubles, synergy. Derived data only (design law: the report
  // is true attribution, never flavor text).
  const findPts = (side, name) => {
    const r = box[side].find(x => x.name === name);
    return r ? r.pts : null;
  };
  const ppgOf = (team, name) => {
    const p = team.players.find(x => x.name === name);
    return p ? p.ppg : null;
  };
  const report = {
    home: {
      starters: homeStarters, synergy: synHome, composition: compHome,
      coverage: { ...covOnAway, targetPts: findPts('away', covOnAway.target), targetSeason: ppgOf(seriesCtx.away, covOnAway.target) },
      double: homePlan.doubleTarget
        ? { target: homePlan.doubleTarget, pts: findPts('away', homePlan.doubleTarget), season: ppgOf(seriesCtx.away, homePlan.doubleTarget) }
        : null,
    },
    away: {
      starters: awayStarters, synergy: synAway, composition: compAway,
      coverage: { ...covOnHome, targetPts: findPts('home', covOnHome.target), targetSeason: ppgOf(seriesCtx.home, covOnHome.target) },
      double: awayPlan.doubleTarget
        ? { target: awayPlan.doubleTarget, pts: findPts('home', awayPlan.doubleTarget), season: ppgOf(seriesCtx.home, awayPlan.doubleTarget) }
        : null,
    },
  };

  return {
    gameNum,
    homeScore: flow.homeScore, awayScore: flow.awayScore,
    winner: flow.homeScore > flow.awayScore ? seriesCtx.home.abbr : seriesCtx.away.abbr,
    quarters: flow.quarters, ot: flow.ot,
    regime: regime.type, capitulated: flow.capitulated,
    expected: { home: exp.home, away: exp.away },   // the center — internal, never the display
    box, report,
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
  module.exports = { rollSeriesShifts, computeExpectedForPlans, resolveCoverage, gameStarterNames, gameSynergyMod, gamePosGroup, gameLineupComposition, simulateGameOnce, simulateSeriesOnce };
}
