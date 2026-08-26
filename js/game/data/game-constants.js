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
  // Role-fit penalty scale (ORtg/DRtg points per fit-cost unit for a
  // full-time slot). Miscasting Kennard as a PoA stopper should hurt.
  fitScaleOff: 3.0,
  fitScaleDef: 3.0,

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

  // ── Trajectory layer (quarter walk) ───────────────────────────
  // Anti-persistent random walk with restoring force (Gabel & Redner 2012;
  // Clauset, Kogan & Redner 2015). quarterSD sets the walk's contribution
  // to total margin variance (target total sigma ≈ 17 incl. regime).
  trajectory: {
    quarterSD: 6.6,           // per-quarter margin noise (pts)
    restoringK: 0.10,         // fraction of current margin pulled back per quarter
    totalNoiseSD: 5.5,        // symmetric pace/shooting noise on the TOTAL per game
    // Capitulation: leads beyond the safety threshold trigger bench-mode
    // drift for the leader (garbage time extends blowouts — the 30+ tail).
    // Threshold shape from lead-safety scaling: L_safe ~ c*sqrt(t_remaining).
    capitulationLead: 13,     // Q4-entry lead that triggers capitulation check
    capitulationProb: 0.65,
    capitulationDrift: 9,     // mean extra pts to the leader when it fires
    comebackCompress: 0.22,   // else: trailing-side run compresses the lead
    otMean: 11,               // expected points per team per OT (2.3/min * 5)
    otSD: 3,
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
  minutesTemplate: [36, 34, 33, 31, 29, 24, 20, 16, 12, 8, 6, 4],
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
function gameRoleFitCost(nativeRole, assignedRole, familyMap) {
  if (!assignedRole || assignedRole === nativeRole) return 0;
  const nf = familyMap[nativeRole], af = familyMap[assignedRole];
  if (!nf || !af) return 0.35;                       // unknown role: moderate cost
  if (nf === af) return 0.15;
  if ((GAME_ROLE_FAMILY_RELATED[nf] || []).includes(af)) return 0.35;
  return 0.60;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_LEAGUE, GAME_CONFIG, GAME_OFF_ROLE_FAMILY, GAME_DEF_ROLE_FAMILY, gameRoleFitCost, gameOverloadMult };
}
