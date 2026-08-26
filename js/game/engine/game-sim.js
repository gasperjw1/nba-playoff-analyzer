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
 * The offense's primary ballhandler on the floor — the man the Point of
 * Attack job exists for, whoever the marquee target is.
 */
function gamePrimaryBallHandler(offTeam, offRotation) {
  const names = new Set((offRotation || []).filter(r => r.minutes > 0).map(r => r.player.name));
  const pool = offTeam.players.filter(p =>
    (names.size ? names.has(p.name) : p.initialStatus !== 'dnp') && p.baseRating > 0);
  if (!pool.length) return null;
  const cands = pool.filter(p =>
    (GAME_OFF_ROLE_FAMILY[p.offRole] || '') === 'creator' || p.designation === 'guard' || p.apg >= 4);
  const from = cands.length ? cands : pool;
  const score = p => p.apg * 2 + p.usg * 0.5;
  return from.reduce((a, b) => (score(b) > score(a) ? b : a));
}

/**
 * Resolve one side's marquee defensive assignment. The JOB is typed by
 * the target (gameCoverageJob); the stopper's fit for THAT job scales the
 * suppression. SCHEME DISPLACEMENT (user design): a defense is a system —
 * if the target is NOT the primary ballhandler and you spend your best
 * point-of-attack defender on him, the PoA job falls to your next-best
 * perimeter defender, and the drop-off is a DRtg cost on your whole
 * scheme. Deep defensive rosters displace cheaply; thin ones pay.
 * Returns {defender, target, suppression, job, schemeCost}.
 */
function resolveCoverage(defTeam, plan, derivedAssignment, offTeam, offRotation, defRotation) {
  const chosenName = (plan && plan.stopper) || (derivedAssignment && derivedAssignment.defender);
  const targetName = derivedAssignment && derivedAssignment.target;
  const target = targetName && offTeam ? offTeam.players.find(p => p.name === targetName) : null;
  const d = chosenName ? defTeam.players.find(p => p.name === chosenName) : null;
  const job = (typeof gameCoverageJob === 'function') ? gameCoverageJob(target) : 'Point of Attack';
  if (!d) {
    return { defender: chosenName || null, target: targetName || null, job,
      suppression: _assignmentSuppression(derivedAssignment), schemeCost: 0 };
  }
  const fit = gameRoleFitCost(d.defRole, job, GAME_DEF_ROLE_FAMILY);
  const suppression = Math.max(0, Math.min(2.0, d.dLebron * 0.9 * (1 - 0.7 * fit)));
  let schemeCost = 0;
  const bh = offTeam ? gamePrimaryBallHandler(offTeam, offRotation) : null;
  if (bh && target && bh.name !== target.name &&
      (GAME_DEF_ROLE_FAMILY[d.defRole] || '') === 'perimeter') {
    const defNames = new Set((defRotation || []).filter(r => r.minutes > 0).map(r => r.player.name));
    const others = defTeam.players.filter(p => p.name !== d.name && p.baseRating > 0 &&
      (defNames.size ? defNames.has(p.name) : p.initialStatus !== 'dnp') &&
      (GAME_DEF_ROLE_FAMILY[p.defRole] || '') === 'perimeter');
    const nextBest = others.length ? Math.max(...others.map(p => p.dLebron)) : -0.5;
    if (d.dLebron > nextBest) {
      schemeCost = Math.max(0, Math.min(1.2, (d.dLebron - Math.max(nextBest, 0)) * 0.4));
    }
  }
  return { defender: d.name, target: targetName, job, suppression, schemeCost };
}

/** Starter set for a plan: explicit choice, else top-5 planned minutes. */
function gameStarterNames(plan, cap) {
  if (plan && Array.isArray(plan.starters) && plan.starters.length === 5) return plan.starters.slice();
  return cap.playerShares.slice().sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5).map(r => r.player.name);
}

/**
 * Lineup composition of a starting five, on DESIGNATION credits (guard /
 * guard-wing / wing / big / flex — user design). Guard-wings count half
 * toward each side; flex players count a third everywhere, which is why
 * they dodge the off-shape taxes — versatility priced as value.
 */
function gameLineupComposition(team, starterNames) {
  const five = team.players.filter(p => starterNames.includes(p.name));
  const c = { g: 0, w: 0, b: 0 };
  const desigCounts = {};
  five.forEach(p => {
    const cr = GAME_DESIGNATION_CREDIT[p.designation] || GAME_DESIGNATION_CREDIT.wing;
    c.g += cr[0]; c.w += cr[1]; c.b += cr[2];
    desigCounts[p.designation] = (desigCounts[p.designation] || 0) + 1;
  });
  c.g = +c.g.toFixed(2); c.w = +c.w.toFixed(2); c.b = +c.b.toFixed(2);
  const label = ['guard', 'guard-wing', 'wing', 'big', 'flex']
    .filter(d => desigCounts[d])
    .map(d => desigCounts[d] + ({ guard: 'G', 'guard-wing': 'GW', wing: 'W', big: 'B', flex: 'F' })[d])
    .join('-');
  const cfg = GAME_CONFIG.composition;
  let ortgMod = 0, drtgMod = 0;
  const notes = [];
  if (c.b >= 2.7) { ortgMod += cfg.threeBigOrtg; notes.push('big-heavy: spacing suffers'); }
  if (c.g <= 0.4) { ortgMod += cfg.noGuardOrtg; notes.push('no guards: creation suffers'); }
  if (c.g >= 2.7) { drtgMod += cfg.threeGuardDrtg; notes.push('guard-heavy: size gives up the rim and glass'); }
  if (c.b <= 0.4) { drtgMod += cfg.noBigDrtg; notes.push('no bigs: no rim protection'); }
  if (c.w <= 0.4 && c.g > 0.4 && c.b > 0.4) { ortgMod += cfg.noWingMixed; notes.push('wingless: switch targets'); }
  return { counts: c, label, ortgMod, drtgMod, notes };
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
  const covOnHome = resolveCoverage(seriesCtx.away, awayPlan, derOnHome,
    seriesCtx.home, homePlan.rotation || null, awayPlan.rotation || null);
  const covOnAway = resolveCoverage(seriesCtx.home, homePlan, derOnAway,
    seriesCtx.away, awayPlan.rotation || null, homePlan.rotation || null);
  let capHome = computeTeamCapacity(seriesCtx.home, { ...homePlan, suppression: covOnHome.suppression });
  let capAway = computeTeamCapacity(seriesCtx.away, { ...awayPlan, suppression: covOnAway.suppression });
  // Scheme displacement lands on the DEFENDING team's whole scheme.
  if (covOnAway.schemeCost) capHome = { ...capHome, drtg: capHome.drtg + covOnAway.schemeCost };
  if (covOnHome.schemeCost) capAway = { ...capAway, drtg: capAway.drtg + covOnHome.schemeCost };
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

/**
 * Open a steppable game session (Phase 3.1). The interactive UI and every
 * headless path drive the SAME session: open → [step | timeout |
 * halftime] → finish. simulateGameOnce wraps it.
 *
 * opts: seed|rng, shifts, seriesEdge, seriesScore, homePlan/awayPlan,
 *       userSide ('home'|'away'|null — whose timeouts are manual)
 */
function openGameSession(seriesCtx, gameNum, opts) {
  opts = opts || {};
  const rng = opts.rng || gameCreateRNG(opts.seed == null ? 1 : opts.seed);
  const shifts = opts.shifts || rollSeriesShifts(seriesCtx, rng);
  const score = opts.seriesScore || { home: 0, away: 0 };
  const homePlan = opts.homePlan || {}, awayPlan = opts.awayPlan || {};

  const pre = computeExpectedForPlans(seriesCtx, gameNum, score, homePlan, awayPlan);
  // Team-level series edge (rolled once per series by the caller).
  const edge = opts.seriesEdge || 0;
  pre.exp.home += edge / 2;
  pre.exp.away -= edge / 2;
  pre.exp.margin = pre.exp.home - pre.exp.away;

  const elimination = score.home === 3 || score.away === 3;
  const regime = sampleGameRegime(rng, pre.exp.margin, { elimination });

  const gs = {
    seriesCtx, gameNum, rng, shifts,
    seriesScore: score, seriesEdge: edge,
    homePlan, awayPlan,
    userSide: opts.userSide || null,
    pre, regime,
    flow: openGameFlow(pre.exp, regime, rng),
    form: { home: {}, away: {} },
    h2: null,                       // set by gameSessionHalftime(revision)
    cvaHalf: null,
    finished: null,
  };
  // Per-game form for tonight's rotations (halftime additions draw later).
  drawGameForm(pre.capHome.playerShares, rng, shifts, gs.form.home);
  drawGameForm(pre.capAway.playerShares, rng, shifts, gs.form.away);
  return gs;
}

/** True when the session is waiting on the halftime decision. */
function gameSessionAtHalftime(gs) {
  return !gs.flow.done && atHalftime(gs.flow);
}

/**
 * Resolve halftime. revisedUserPlan (or null to stand pat) applies to
 * gs.userSide only; H2 capacities + expectation recompute, and the
 * halftime CVA grades the revision vs standing pat (half-game weight).
 * CPU coaches stand pat in v1 (GAME_PLAN documents the asymmetry).
 */
function gameSessionHalftime(gs, revisedUserPlan) {
  if (!gameSessionAtHalftime(gs)) return false;
  gs.flow.halftimePassed = true;
  if (revisedUserPlan && gs.userSide) {
    const base = gs.userSide === 'home' ? gs.homePlan : gs.awayPlan;
    const revised = { ...base, ...revisedUserPlan,
      unavailable: base.unavailable, fatigue: base.fatigue };
    const homePlan = gs.userSide === 'home' ? revised : gs.homePlan;
    const awayPlan = gs.userSide === 'away' ? revised : gs.awayPlan;
    const h2 = computeExpectedForPlans(gs.seriesCtx, gs.gameNum, gs.seriesScore, homePlan, awayPlan);
    h2.exp.home += gs.seriesEdge / 2;
    h2.exp.away -= gs.seriesEdge / 2;
    h2.exp.margin = h2.exp.home - h2.exp.away;
    gs.h2 = h2;
    gs.h2Plans = { homePlan, awayPlan };
    gs.flow.expH2 = h2.exp;
    drawGameForm(h2.capHome.playerShares, gs.rng, gs.shifts, gs.form.home);
    drawGameForm(h2.capAway.playerShares, gs.rng, gs.shifts, gs.form.away);
    const sign = gs.userSide === 'home' ? 1 : -1;
    gs.cvaHalf = { delta: +(((h2.exp.margin - gs.pre.exp.margin) * sign) / 2).toFixed(2) };
  }
  return true;
}

/** User timeout (their side only; CPU sides are automatic in stepping). */
function gameSessionTimeout(gs) {
  if (!gs.userSide || gs.flow.done || gameSessionAtHalftime(gs)) return false;
  return callGameTimeout(gs.flow, gs.userSide);
}

/**
 * Play the next segment. Auto-resolves a stand-pat halftime when stepped
 * through it (headless paths); the UI checks gameSessionAtHalftime first.
 * CPU timeouts fire for every non-user side. Returns the segment row.
 */
function gameSessionStep(gs) {
  if (gs.flow.done) return null;
  if (gameSessionAtHalftime(gs)) gameSessionHalftime(gs, null);
  gameCpuTimeouts(gs.flow, gs.userSide);
  return stepGameFlow(gs.flow, gs.rng);
}

/** Finish: totals, per-half box allocation, coach's report, game record. */
function finishGameSession(gs) {
  if (gs.finished) return gs.finished;
  const flow = closeGameFlow(gs.flow);
  const seriesCtx = gs.seriesCtx;
  const h2Score = {
    home: flow.homeScore - flow.h1.home,
    away: flow.awayScore - flow.h1.away,
  };
  const garbage = Math.abs(flow.homeScore - flow.awayScore) >= 18;
  const otMinutes = flow.ot * 5;

  const capH1 = { home: gs.pre.capHome, away: gs.pre.capAway };
  const capH2 = gs.h2 ? { home: gs.h2.capHome, away: gs.h2.capAway } : capH1;
  const plansH2 = gs.h2Plans || { homePlan: gs.homePlan, awayPlan: gs.awayPlan };
  const startersH1 = {
    home: gameStarterNames(gs.homePlan, capH1.home),
    away: gameStarterNames(gs.awayPlan, capH1.away),
  };
  const startersH2 = {
    home: gameStarterNames(plansH2.homePlan, capH2.home),
    away: gameStarterNames(plansH2.awayPlan, capH2.away),
  };

  // Team rebound/assist totals drawn per game, split by half playing time.
  const rng = gs.rng;
  const box = {};
  ['home', 'away'].forEach(side => {
    const teamScore = side === 'home' ? flow.homeScore : flow.awayScore;
    const h1Pts = flow.h1[side];
    const rebTotal = Math.max(28, Math.round(gameNormal(rng, 43, 4)));
    const astTotal = Math.max(12, Math.round(teamScore * 0.25 + gameNormal(rng, 0, 2.5)));
    // Defensive/handle team totals ~ NBA playoff norms.
    const toTotal = Math.max(6, Math.round(gameNormal(rng, 13.5, 2.8)));
    const stlTotal = Math.max(2, Math.round(gameNormal(rng, 7.5, 2.2)));
    const blkTotal = Math.max(1, Math.round(gameNormal(rng, 4.8, 1.8)));
    const h1Frac = 120 / (240 + 25 * flow.ot);
    const rebH1 = Math.round(rebTotal * h1Frac), astH1 = Math.round(astTotal * h1Frac);
    const toH1 = Math.round(toTotal * h1Frac), stlH1 = Math.round(stlTotal * h1Frac),
      blkH1 = Math.round(blkTotal * h1Frac);
    const b1 = allocateHalfBox(capH1[side], gs.form[side], h1Pts, rebH1, astH1,
      { starters: startersH1[side], toHalf: toH1, stlHalf: stlH1, blkHalf: blkH1 });
    const b2 = allocateHalfBox(capH2[side], gs.form[side], teamScore - h1Pts,
      rebTotal - rebH1, astTotal - astH1,
      { starters: startersH2[side], garbage, otMinutes,
        toHalf: toTotal - toH1, stlHalf: stlTotal - stlH1, blkHalf: blkTotal - blkH1 });
    box[side] = mergeHalfBoxes(b1, b2);
  });

  // Coach's report from the H2 (final) scheme state — coverage, doubles,
  // synergy, composition; halftime revision noted when present.
  const state = gs.h2 || gs.pre;
  const findPts = (side, name) => {
    const r = box[side].find(x => x.name === name);
    return r ? r.pts : null;
  };
  const ppgOf = (team, name) => {
    const p = team.players.find(x => x.name === name);
    return p ? p.ppg : null;
  };
  const sideReport = (side) => {
    const oppSide = side === 'home' ? 'away' : 'home';
    const oppTeam = side === 'home' ? seriesCtx.away : seriesCtx.home;
    const cov = side === 'home' ? state.covOnAway : state.covOnHome;
    const syn = side === 'home' ? state.synHome : state.synAway;
    const comp = side === 'home' ? state.compHome : state.compAway;
    const plan = side === 'home' ? plansH2.homePlan : plansH2.awayPlan;
    return {
      starters: startersH2[side], synergy: syn, composition: comp,
      coverage: { ...cov, targetPts: findPts(oppSide, cov.target), targetSeason: ppgOf(oppTeam, cov.target) },
      double: plan.doubleTarget
        ? { target: plan.doubleTarget, pts: findPts(oppSide, plan.doubleTarget), season: ppgOf(oppTeam, plan.doubleTarget) }
        : null,
      timeoutsUsed: GAME_CONFIG.timeout.budget - gs.flow.budgets[side],
    };
  };

  gs.finished = {
    gameNum: gs.gameNum,
    homeScore: flow.homeScore, awayScore: flow.awayScore,
    winner: flow.homeScore > flow.awayScore ? seriesCtx.home.abbr : seriesCtx.away.abbr,
    quarters: flow.quarters, segments: flow.segments, ot: flow.ot,
    regime: gs.regime.type, capitulated: flow.capitulated,
    expected: { home: gs.pre.exp.home, away: gs.pre.exp.away },   // internal, never displayed
    halftimeAdjusted: !!gs.h2,
    box, report: { home: sideReport('home'), away: sideReport('away') },
  };
  if (gs.cvaHalf) gs.finished.cvaHalf = gs.cvaHalf;
  return gs.finished;
}

/** Headless single game: open → auto-step → finish (all-CPU timeouts). */
function simulateGameOnce(seriesCtx, gameNum, opts) {
  const gs = openGameSession(seriesCtx, gameNum, opts);
  while (!gs.flow.done) gameSessionStep(gs);
  return finishGameSession(gs);
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
  module.exports = { rollSeriesShifts, computeExpectedForPlans, resolveCoverage, gamePrimaryBallHandler, gameStarterNames, gameSynergyMod, gameLineupComposition, openGameSession, gameSessionAtHalftime, gameSessionHalftime, gameSessionTimeout, gameSessionStep, finishGameSession, simulateGameOnce, simulateSeriesOnce };
}
