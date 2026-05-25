// ============================================================
// SPM CHEMISTRY ENGINE (Maymin, Maymin & Shen, IJCSS 2013)
// ============================================================
// Skills Plus Minus framework: 6 skill dimensions per player
// Synergy = Team performance - Sum of individual parts
// Key insight: complementary skills > redundant offensive skills
//
// Synergy coefficients (same skill with itself):
//   Offensive Scoring  × itself = -0.826 (share one ball)
//   Offensive BallHndl × itself = -0.825 (one handler enough)
//   Offensive Rebound  × itself = +0.168 (crash boards together)
//   Defensive Scoring  × itself = -0.284 (most stops end a stop)
//   Defensive BallHndl × itself = +0.307 (turnover creators feed off each other)
//   Defensive Rebound  × itself = +0.205 (boxing out helps each other)
//
// Cross-skill synergies (approximated from paper):
//   Off Scoring × Off BallHndl = +0.412 (PnR, drive-and-kick)
//   Off Scoring × Off Rebound  = +0.185 (putbacks, second chances)
//   Off BallHndl × Off Rebound = +0.092 (transition off boards)
//   Def Scoring × Def BallHndl = +0.348 (steals → fastbreaks)
//   Def Scoring × Def Rebound  = +0.221 (stops + secure possession)
//   Def BallHndl × Def Rebound = +0.156 (active hands + boards)
// ============================================================

// CURRENT_DATE — the "now" the app represents.
// Hardcoded (rather than read from Date.now()) so the landing page,
// news feed, and "today's bets" filter remain pinned to the slate
// the data reflects, instead of silently going stale next week.
// Bump this when daily data updates land.
const CURRENT_DATE = '2026-05-25';

// CHS shadow architecture (May 9, 2026 — design discussion).
// USE_CHS_IN_PROJECTIONS controls whether the Compound Historical
// Scenarios engine (Phase 52) layers its 14th modifier into the
// production player projection pipeline.
//   false (default): CHS is OFF for Home, Bets, Series Analysis pages.
//                    Production output reflects the bare 13-modifier
//                    engine. CHS predictions are computed in parallel
//                    by the CHS Lab tab and tracked against actuals
//                    in chs-ledger.js for accuracy comparison.
//   true:           CHS is layered into the main pipeline (legacy
//                    pre-shadow behavior). Only flip after CHS proves
//                    out: ≥10-game window, winner ≥ main + 10pp,
//                    margin MAE ≤ main − 1.5pts.
const USE_CHS_IN_PROJECTIONS = false;

// SPM Synergy coefficient matrix (6x6)
const SPM_COEFF = {
  oScr_oScr: -0.826, oScr_oBH: 0.412, oScr_oReb: 0.185, oScr_o3PT: 0.295, oScr_oPass: 0.180,
  oBH_oBH: -0.825,   oBH_oReb: 0.092, oBH_o3PT: 0.220, oBH_oPass: -0.650,
  oReb_oReb: 0.168,  oReb_o3PT: 0.110, oReb_oPass: 0.075,
  o3PT_o3PT: -0.420, o3PT_oPass: 0.350,
  oPass_oPass: -0.550,
  dScr_dScr: -0.284, dScr_dBH: 0.348, dScr_dReb: 0.221,
  dBH_dBH: 0.307,    dBH_dReb: 0.156,
  dReb_dReb: 0.205
};

// Infer SPM skill profile from player stats (0-10 scale)

// ============================================================
// BACKTEST-CALIBRATED MODEL CONSTANTS (2025 Playoff Backtest: 73.5% accuracy → targeting 80%+)
// ============================================================
// Lesson 1: HCA decays in later rounds. Road teams won G1 in ~75% of later-round series.
// PHASE 17 UPDATE (Barreira & Morgado 2023): Longitudinal analysis (1946-2022) shows HCA is
// declining significantly in the modern NBA. Values reduced ~15% from original calibration.
// López-García et al. (2024): team ability matters more than crowd support for HCA.
// PHASE 59 UPDATE (May 11, 2026 — promotion pass): R2 trimmed 2.0 → 1.5 based on
// three consecutive wrong-winner G3 calls (NYK-PHI G3, SAS-MIN G3, DET-CLE G3) where
// the engine's HCA-flip baseline plus "home desperation" soft factor stacked too high
// on the venue-flipped lower seed. Empirical: road favorites with clear talent edge
// + post-anomaly home-game momentum won all three despite engine pricing the home
// team. Trimming the round-level premium is the cleanest intervention; the bet logic
// has been applying this informally for the past 3 days. Source retros: series.modelLessons[]
// for NYK-PHI G3, SAS-MIN G3, and DET-CLE G3.
const HCA_BY_ROUND = { 'R1': 3.0, 'R2': 1.5, 'CF': 1.5, 'Finals': 1.0 };

// PHASE 49: Win Probability Recalibration (2025 + 2026 cross-year validation)
// The logistic scale factor converts rating differentials into win probabilities.
// Old value (15) produced extreme probabilities: 15pt diff → 90.9%, 20pt diff → 96.8%.
// 2025 validation: underdogs won 41.7% of all playoff games. 2026 R1: also 41.7%.
// Seed-based probabilities (57-87%) predicted series lengths accurately (5.4 avg vs 5.6 actual).
// Our old model: predicted 4.2 avg series length vs 5.9 actual (+1.7 error).
// Backtest v1 (scale=25, compression=0.12): avg fav WP 83.1%, series length 4.8 — still too extreme.
// Backtest v2 (scale=35, compression=0.18): model rating diffs are large (6-30pts), so the
// logistic needs a wider scale to convert them into competitive probabilities.
// 30pt diff → raw 87.8% → compressed 81.0%. 16pt diff → raw 74.1% → compressed 69.8%.
// 6pt diff → raw 59.7% → compressed 58.0%. Range ≈ 58-81%, matching 55-82% target.
// Expected series length rises to ~5.2, much closer to the 5.4-5.6 actual.
const WIN_PROB_SCALE = 35; // v1=25 still too extreme, v2=35 matches cross-year validation

// PHASE 49: Playoff Upset Compression
// Cross-year validation: underdogs win 42% of games regardless of seed differential.
// This means even the strongest favorites only win ~75-80% of individual games.
// PLAYOFF_UPSET_COMPRESSION pulls all win probabilities toward 50% by this fraction.
// A value of 0.18 means: 90% → 82.8%. 80% → 74.6%. 60% → 58.2%.
// Combined with WIN_PROB_SCALE=35, this produces a realistic 55-82% probability range.
const PLAYOFF_UPSET_COMPRESSION = 0.18;

// PHASE 49: Resilience Modifier
// Teams with proven ability to overcome adversity (playoff pedigree, elite coaching,
// post-blowout bounce-back history) should have their opponent's win probability compressed.
// The resilience score (0-1) represents how much to further compress the favorite's probability.
// 0.0 = no resilience (expansion draft team), 1.0 = maximum resilience (proven champion).
// Applied as: adjustedProb = prob * (1 - resilience * 0.10) + 0.50 * resilience * 0.10
// This pulls the probability toward 50% by up to 10% for maximum-resilience underdogs.
const RESILIENCE_MAX_COMPRESSION = 0.10;
// PHASE 45: Fortress Venue Bonus — some arenas provide HCA far above league average.
// Evidence: MIN Target Center +17 and +16 in home games; PHI Wells Fargo +13 in G6.
// Applied on top of HCA_BY_ROUND when series has fortressVenue flag.
const FORTRESS_VENUE_BONUS = 1.5; // additional pts for elite home environments
// PHASE 17 UPDATE (Li et al. 2025): 10-year Game-7 analysis shows game location does NOT
// significantly affect Game 7 outcomes. EFG% and TOV% are the decisive factors, not venue.
// Reduced from +5.0 to +2.5 — still acknowledges crowd energy but no longer overweights it.
const HCA_GAME7_OVERRIDE = 2.5; // Li et al.: location non-significant in G7 outcomes

// PHASE 17: Playoff Adjustment Factor (Cabarkapa et al. 2022, PLOS ONE, 81 citations)
// Playoff basketball is MORE CONSERVATIVE than regular season: fewer FGA, assists, steals,
// turnovers, and total points. FG% and DRB are the top two discriminators (23-26% of variance).
// Discriminant model achieves 87.2% classification accuracy in playoffs vs 82.8% regular season.
// Applied in calcGameProjection() to reduce expected scoring output.
const PLAYOFF_ADJUSTMENT = {
  paceReduction: 0.95,      // playoffs slow down ~5% (was 3%, updated per Cabarkapa)
  fgWeightBoost: 1.15,      // FG% matters 15% more in playoffs than regular season
  drbWeightBoost: 1.20      // DRB matters 20% more in playoffs (2nd-half defensive boards decisive) — wired into ratings.js
};

// PHASE 17: Clutch Weight Adjustment (Sarlis et al. 2024, 31 citations; Iatropoulos et al. 2025)
// Clutch performance is MORE predictive in playoffs than regular season.
// Defensive metrics become critical in late-game playoff situations.
// Player composite clutch weight increased from 10% to 13% for playoff contexts.
const PLAYOFF_CLUTCH_WEIGHT = 0.13; // up from 0.10 in regular season composite

// Lesson 3: System coherence — teams with elite systems outperform individual talent ratings
// Applied per-team as systemBonus in SERIES_DATA (range: -2 to +3)

// Lesson 4: Championship DNA — recent playoff/championship experience in elimination games
// playoffPedigree per team (0 = no recent playoff success, 1 = deep run, 2 = recent champion)

// Lesson 5: Health degradation — players with injury risk degrade over long series
// injuryRisk per player (0 = healthy, 0.5 = minor concern, 1.0 = significant risk)

// Lesson 7: Star ceiling variance — elite stars produce games far above baseline ~1x per series
// starCeiling per player (0 = normal, 1 = occasional explosion, 2 = historic ceiling games)

// Lesson 2 & 5 (combined): Bounce-back qualifier

// PHASE 71: Star Bias Correction (May 17, 2026)
// The 68-game 2026-playoffs calibration audit found systematic
// over-prediction for high-rated players (CALIBRATION_AUDIT.md):
//   rating 85+:    PTS +2.63 / REB +0.48 / AST +0.97 (over-predicted)
//   rating 75-84:  PTS +2.06 / REB +0.69 / AST +0.18 (over-predicted)
//   rating 65-74:  +0.08 / -0.22 / +0.11 (calibrated)
//   rating <65:    +0.13 / +0.14 / +0.11 (calibrated)
// Applied as the LAST modifier in calcExpectedPlayerStats. Set
// `enabled: false` to disable (regression-test the unfixed engine).
// Re-tune the deltas after R3 ships ~30 more games.
// PHASE 73: Elimination-game variance amplifier (May 18, 2026)
// Post DET-CLE G7 miss (predicted DET+4, actual CLE+31 — 35pt margin
// miss). Calibration audit's G6 cell shows MAE 19.8pt vs overall
// 12.94pt — elimination contexts produce ~1.5x wider distributions.
// We widen scoring-range bands for G6/G7. Doesn't shift the central
// estimate; just produces honestly wider tails for MC sim.
const ELIMINATION_VARIANCE_MULT = 1.4;

const STAR_BIAS_CONFIG = {
  enabled: true,
  elitePtsDelta:   -2.6,  // matches observed +2.63 over-prediction
  eliteRebDelta:   -0.5,
  eliteAstDelta:   -1.0,
  starterPtsDelta: -2.0,
  starterRebDelta: -0.5,
  starterAstDelta:  0,    // observed +0.18 is within noise
};

// PHASE 71c: Per-Player Bias Override (May 17, 2026)
// Players whose individual bias contradicts their tier adjustment.
// The tier-based fix (Phase 71b) corrects the population average but
// LEAVES residual error on specific outliers — and in some cases
// MAKES them worse (e.g. Cade was -8.6pp under-predicted; tier
// correction subtracted 2.6 → now -11.2pp).
//
// Applied AFTER STAR_BIAS_CONFIG as the 16th modifier. Each delta is
// an ADDITIONAL adjustment on top of tier correction; positive = boost
// the player up from where engine currently lands them.
//
// CRITICAL: only includes players with n≥7 in the audit (statistically
// stable). All values traced to CALIBRATION_AUDIT.md "BIAS BY PLAYER"
// section. Re-evaluate after R3 ships 6+ more games per player.
//
// Names use the exact roster spelling in SERIES_DATA so the lookup is
// case-sensitive equality. If a roster name changes, this table breaks
// silently for that player (NOT for the whole engine).
const PLAYER_BIAS_OVERRIDE = {
  enabled: true,
  table: {
    // Under-predicted (audit shows engine projects LESS than reality)
    'Cade Cunningham':   { pts: +11.0, reb:  0,   ast:  0    },  // resid -11.2pp after tier
    'Tobias Harris':     { pts:  +9.5, reb: +3.0, ast:  0    },  // resid -9.4 PTS / -3 REB
    'RJ Barrett':        { pts:  +7.0, reb: +1.8, ast:  0    },
    'OG Anunoby':        { pts:  +5.5, reb: +1.7, ast:  0    },
    // Over-predicted beyond tier (audit shows engine projects MORE than reality)
    'Jalen Duren':       { pts:  -6.2, reb: -1.0, ast:  0    },  // resid +6.2 PTS after tier
    'Brandon Ingram':    { pts:  -6.1, reb: -2.0, ast: -1.2  },
    'Isaiah Stewart':    { pts:  -5.5, reb: -2.5, ast:  0    },
    'Shai Gilgeous-Alexander': { pts: -6.9, reb: -1.8, ast: 0 }, // resid +6.9 PTS
  },
};
