// ============================================================
// PLAYOFF RUN — GAME CONSTANTS (Phase 0)
// ============================================================
// Every tunable in the game sim lives here, with its empirical or
// research source. The score-realism harness (backtest-score-realism.js)
// is the authority for the calibration targets — when a constant is
// re-tuned, it is re-tuned THERE, against the 169-game 2025+2026
// distribution measurements recorded in GAME_PLAN.md.
//
// Namespace rule: every global here is GAME_-prefixed. This file loads
// after js/data/constants.js and may READ analyzer globals (HCA_BY_ROUND)
// but never writes them.
// ============================================================

// League baselines — computed over the 16 playoff-team advStats (R1 rosters).
// Playoff teams skew above league average; per-team calibration offsets in
// team-db.js absorb the skew, so these only need to be a consistent anchor.
const GAME_LEAGUE = {
  ortg: 116.0,
  drtg: 111.3,
  pace: 98.4,
  // Per-100 offensive impact assumed for a replacement body absorbing the
  // minutes of a missing player (LEBRON-scale). Standard replacement level.
  replacementOLebron: -2.0,
};

const GAME_CONFIG = {
  // ── Capacity layer ────────────────────────────────────────────
  // Playoff offense suppression: measured 92% player scoring vs season
  // (this repo, Aug 2026 analysis) + tracking-era evidence of playoff
  // shot-quality decline (Sportico 2025). Applied to team scoring rate.
  // Tuned in harness so mean simulated TOTAL matches the real playoff mean.
  playoffOffFactor: 0.995,
  playoffPaceFactor: 0.965,   // playoff games run slower than season pace
  // Playoff matchup compression: the raw capacity gap between two teams
  // overstates real playoff edges (opponents scheme, series tighten) —
  // the analyzer's PLAYOFF_UPSET_COMPRESSION lesson, validated across
  // 2025+2026: underdogs win 41.7% of playoff games. Applied to the
  // non-HCA expected-margin gap; enforced by the harness's favorite-win-
  // rate metric and the equity spread in test-game.js.
  matchupCompression: 0.42,
  // Team-level series edge: a per-series margin shift (home-positive,
  // rolled once per series) — the matchup-fit / scheme-discovery residual
  // the capacity model can't see (why real SAS beat real OKC). Sized so
  // the induced serial correlation (ICC ≈ σ²/(σ²+17²) ≈ .02) stays inside
  // the measured ~0 tolerance while series outcomes decompress.
  seriesEdgeSigma: 2.2,
  // Usage-efficiency tradeoff (Goldman & Rao 2011; Skinner 2015): ORtg
  // points lost per percentage point of usage a player absorbs ABOVE his
  // natural load, weighted by his floor share. Makes star-less teams score
  // sub-100 by accounting, not special-casing.
  usageSlope: 0.35,
  usageAbsorbCap: 8,          // max pp of extra usage one player can absorb
  usageRecapture: 0.65,       // share of a missing star's scoring that
                              // teammates recapture (rest = team decline)
  // Creation dependency: losing minutes from your primary creators
  // degrades everyone's shot quality beyond the usage-volume penalty
  // (the analyzer's initiator lesson). ORtg per minutes-weighted APG
  // below the team's baseline. TEST 21's Brunson case sized this: with
  // only usage-slope, benching an elite-offense/poor-defense engine
  // graded near-even.
  creationSlope: 1.4,
  // Role-fit penalty scale (ORtg/DRtg points per fit-cost unit for a
  // full-time slot). Miscasting Kennard as a PoA stopper should hurt.
  fitScaleOff: 3.0,
  fitScaleDef: 3.0,
  // Starting-five synergy (SPM chemistry, Maymin et al. via the analyzer's
  // calcSPMChemistry): ORtg mod per SPM point vs the team's own default
  // five (self-calibrating — default lineup = 0, same pattern as the
  // capacity offsets), capped SMALL. TEST 21 caught the first sizing
  // (±1.5): a balanced no-star five's chemistry offset most of a benched
  // star's impact — synergy is a nudge, never a star substitute.
  synergyScale: 0.04,
  synergyCap: 0.8,
  // Lineup composition — on DESIGNATION credits (guard / guard-wing /
  // wing / big / flex, stat-derived in team-db.js; guard-wings count half
  // toward each side, flex a third everywhere). Balanced ≈ 2-2-1-shaped
  // credit. Off-shape fives pay on the relevant end: spacing problems tax
  // offense, size problems tax defense. A coaching lever → passes
  // uncompressed; countered by composition-aware AI.
  composition: {
    threeBigOrtg: -0.9,     // 3+ bigs: spacing collapses
    noGuardOrtg: -0.7,      // no creator pressure
    threeGuardDrtg: +0.7,   // 3+ guards: size gives up rim/glass (DRtg up = worse)
    noBigDrtg: +0.9,        // no rim protection
    noWingMixed: -0.3,      // wingless: applied to ORtg (switch targets)
  },
  // Playing through an injury (HURT/drag games) risks AGGRAVATION —
  // scaled by minutes; resting the player instead still runs his
  // recovery clock. Load management stays a genuine gamble.
  aggravationBase: 0.05,
  // Light night (<24 min) = extra fatigue recovery — the "give him a
  // breather to freshen up" lever.
  fatigueLightDecay: 0.60,

  // ── Player tiers + variance (measured Aug 2026, 138 player-series) ──
  // tier by season ppg; CV = game-noise coefficient of variation;
  // shiftSigma = sd of the persistent hidden series-context shift
  // (multiplicative, mean 1). Chosen so total CV ≈ measured tier CV and
  // pooled ICC ≈ +0.33 serial correlation vs season baseline.
  tiers: {
    star: { minPpg: 20, noiseCV: 0.22, shiftSigma: 0.19 },
    mid:  { minPpg: 12, noiseCV: 0.30, shiftSigma: 0.22 },
    role: { minPpg: 0,  noiseCV: 0.49, shiftSigma: 0.30 },
  },
  shiftClamp: [0.55, 1.55],   // hidden shift bounds (multiplicative)
  rebCV: 0.30,                // per-tier not warranted by data for reb/ast
  astCV: 0.35,
  // Allocation rescale (forcing player pts to sum to team score) shrinks
  // realized CV; inflate configured noise to compensate. Verified in harness.
  cvInflate: 1.12,
  // Physical plausibility caps (user playtest caught Clarkson 29 pts in
  // 12 min — a 116-pt pace): a player's line cannot exceed what his
  // minutes allow. 1.3 pts/min ≈ the hottest real short stints.
  ptsPerMinCap: 1.3,
  rebPerMinCap: 0.65,
  astPerMinCap: 0.45,
  // Usage-aware scoring depth (user design: "some players should not be
  // scoring so much" — a player's SHOT DIET bounds his eruptions, not
  // just his minutes). The per-minute cap scales with usage, and
  // low-usage players get damped upside noise: a 3&D role player in 30
  // minutes can have a good night, not a 29-point one.
  usgCapPivot: 24,            // usage at which the cap multiplier = 1.0
  usgCapClamp: [0.7, 1.2],
  usgNoiseFloor: 0.75,        // noise multiplier at zero usage...
  usgNoisePivot: 20,          // ...rising to 1.0 at this usage

  // ── Regime layer (the 130-90 / 90-130 engine) ─────────────────
  // Game character sampled BEFORE trajectory. Calibrated against:
  // P(|margin|>=15/20/30) = 37/23/12%, home win margin 16.9 vs road 9.4.
  regime: {
    pRunaway: 0.30,           // P(game becomes one-sided)
    homeShare: 0.60,          // runaways break toward the home side this often
    favBias: 0.055,           // extra P(runaway favors favorite) per expected-margin pt
    driftMean: 15,            // runaway margin drift added to expectation
    driftSD: 6,
    eliminationDamp: 0.75,    // elimination games: fewer runaways (fight-or-fold
                              // compresses; real facing-team save rate ~46%
                              // — venue helps the team facing elimination)
  },

  // ── Trajectory layer (segment walk — Phase 3.1) ───────────────
  // Anti-persistent random walk with restoring force (Gabel & Redner 2012;
  // Clauset, Kogan & Redner 2015). Regulation = 8 six-minute SEGMENTS
  // (was 4 quarters; re-split so timeouts/halftime have intervention
  // points). Variance re-split to preserve the calibrated totals:
  // 8×segSD² == 4×quarterSD² (6.6/√2 ≈ 4.67); per-segment restoring is
  // halved; per-segment total noise 2.5/√2 ≈ 1.8. Harness re-gated.
  trajectory: {
    segments: 8,              // regulation segments (6 min each)
    segSD: 5.2,              // per-segment margin noise (pts)
    restoringK: 0.035,         // fraction of current margin pulled back per segment
    totalNoiseSD: 5.5,        // symmetric pace/shooting noise on the TOTAL per game
    segTotalNoise: 1.8,       // per-segment total noise
    // Capitulation: entering the final 12 minutes (segment 7) with a lead
    // beyond the safety threshold triggers bench-mode drift for the leader
    // (garbage time extends blowouts — the 30+ tail). Rolled once; the
    // drift/compression spreads over the final two segments.
    capitulationLead: 13,
    capitulationProb: 0.65,
    capitulationDrift: 9,     // mean extra pts to the leader when it fires (total)
    comebackCompress: 0.22,   // else: trailing-side run compresses the lead (total)
    otMean: 11,               // expected points per team per OT (2.3/min * 5)
    otSD: 3,
  },
  // ── Timeouts (Phase 3.1) ──────────────────────────────────────
  // Honest mapping of the timeout-momentum study (pre-timeout run
  // −3.74/min → post −1.20/min): a timeout blunts the momentum component
  // (our regime drift) running AGAINST the caller for the next segment,
  // plus a small restoring pull toward even. Called while YOU are rolling,
  // the damp hits your own drift — the study's asymmetry. Budget is the
  // usable subset of real timeouts (decision weight over bookkeeping).
  timeout: {
    budget: 4,                // callable per side per game
    driftDamp: 0.5,           // next-segment damp of drift against the caller
    restoreBoost: 0.12,       // extra restoring-force pull for that segment
    cpuRunThreshold: 8,       // CPU calls one after losing a segment by this
  },

  // ── Venue ─────────────────────────────────────────────────────
  // hcaBase comes from HCA_BY_ROUND (analyzer constants). Fortress venues
  // (MIN Target Center, PHI Wells Fargo — Phase 45 evidence) add on top.
  fortressBonus: 1.5,
  fortressTeams: ['MIN', 'PHI'],
  // Home teams win bigger (16.9 vs 9.4 avg margin measured): home side gets
  // a larger share of runaway regimes (regime.homeShare) — no extra knob.

  // ── Rotation defaults ─────────────────────────────────────────
  // Minutes template by rating rank; normalized to 240 for the coach's
  // rotationDepth. Player records carry no season MPG, so the full-strength
  // template doubles as each player's season-minutes proxy for share math.
  // PLAYOFF-WEIGHTED (solver-audit follow-up): real playoff coaches
  // shorten benches and ride starters — the audit kept preferring
  // heavy-starter statics until the adaptive baseline itself reflected
  // playoff minute distribution.
  minutesTemplate: [38, 36, 34, 32, 30, 24, 18, 14, 10, 8, 6, 4],
  defaultRotationDepth: 9,
  // Minutes physics (added by the first solver audit, which caught a
  // degenerate 48-minute-stars meta): hard per-player cap, plus an
  // overload penalty on per-minute impact above the threshold (within-
  // game fatigue — the analyzer's Q4-fatigue lesson at capacity level).
  maxPlayerMinutes: 42,
  overloadThreshold: 34,
  overloadSlope: 0.02,        // impact lost per minute above threshold
};

/** Within-game overload: impact multiplier for a player's minutes load.
 *  Used by BOTH capacity and team-db's calibration so full-strength
 *  fidelity stays exact. */
function gameOverloadMult(minutes) {
  const over = Math.max(0, minutes - GAME_CONFIG.overloadThreshold);
  return Math.max(0.6, 1 - GAME_CONFIG.overloadSlope * over);
}

// ── Championship equity (run-setup display) ─────────────────────
// CPU-vs-CPU baseline: 4,000 seeded brackets (computeEquityTable, seeds
// 300000+, Aug 26 2026 tuning). Regenerate after any sim re-tune:
//   node -e "...computeEquityTable(GAME_TEAM_DB, 4000, 300000)"
// (exact command in GAME_PLAN.md). Displayed odds are honest: this is the
// difficulty select, and run scoring is measured against it.
const GAME_EQUITY_2026 = {
  OKC: 0.288, SAS: 0.18, DET: 0.131, BOS: 0.127, DEN: 0.069, NYK: 0.043,
  CLE: 0.041, ATL: 0.037, HOU: 0.035, TOR: 0.02, LAL: 0.01, MIN: 0.007,
  PHI: 0.004, POR: 0.004, ORL: 0.003, PHX: 0.003,
};

// ── Role taxonomy + fit costs ───────────────────────────────────
// The 13 offensive / 7 defensive roles hand-labeled across the 2026
// dataset. Fit cost between roles is computed from role FAMILIES rather
// than a 13x13 matrix: same role 0, same family 0.15, related family 0.35,
// big<->perimeter mismatch 0.60. Scalable to new roles by assigning a family.
const GAME_OFF_ROLE_FAMILY = {
  'Shot Creator': 'creator', 'Primary Ball Handler': 'creator', 'Secondary Ball Handler': 'creator',
  'Movement Shooter': 'shooter', 'Stationary Shooter': 'shooter', 'Off Screen Shooter': 'shooter',
  'Roll + Cut Big': 'big', 'Stretch Big': 'big', 'Versatile Big': 'big', 'Post Scorer': 'big',
  'Cutter': 'finisher', 'Athletic Finisher': 'finisher', 'Versatile Wing': 'finisher',
};
const GAME_DEF_ROLE_FAMILY = {
  'Point of Attack': 'perimeter', 'Chaser': 'perimeter', 'Wing Stopper': 'perimeter',
  'Mobile Big': 'interior', 'Anchor Big': 'interior',
  'Helper': 'connective', 'Low Activity': 'connective',
};
// Families whose members can cover for each other at moderate cost.
const GAME_ROLE_FAMILY_RELATED = {
  creator: ['shooter', 'finisher'], shooter: ['creator', 'finisher'],
  finisher: ['creator', 'shooter', 'big'], big: ['finisher'],
  perimeter: ['connective'], connective: ['perimeter', 'interior'],
  interior: ['connective'],
};

/**
 * Fit cost (0 = native, 1 = maximal miscast) for playing a role that is
 * not the player's labeled one.
 */
function gameRoleFitCost(nativeRole, assignedRole, familyMap, naturalRoles) {
  if (!assignedRole || assignedRole === nativeRole) return 0;
  // A derived NATURAL secondary role (see gameNaturalOffRoles) is nearly
  // free — the stats say he already plays this way (the Hart-Cutter fix).
  if (naturalRoles && naturalRoles.includes(assignedRole)) return 0.05;
  const nf = familyMap[nativeRole], af = familyMap[assignedRole];
  if (!nf || !af) return 0.35;                       // unknown role: moderate cost
  if (nf === af) return 0.15;
  if ((GAME_ROLE_FAMILY_RELATED[nf] || []).includes(af)) return 0.35;
  return 0.60;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_LEAGUE, GAME_CONFIG, GAME_EQUITY_2026, GAME_OFF_ROLE_FAMILY, GAME_DEF_ROLE_FAMILY, gameRoleFitCost, gameOverloadMult };
}
