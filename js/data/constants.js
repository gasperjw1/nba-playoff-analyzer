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
const HCA_BY_ROUND = { 'R1': 3.0, 'R2': 2.0, 'CF': 1.5, 'Finals': 1.0 };
const HCA_GAME7_OVERRIDE = 5.0; // Game 7 home team wins ~78% historically

// Lesson 3: System coherence — teams with elite systems outperform individual talent ratings
// Applied per-team as systemBonus in SERIES_DATA (range: -2 to +3)

// Lesson 4: Championship DNA — recent playoff/championship experience in elimination games
// playoffPedigree per team (0 = no recent playoff success, 1 = deep run, 2 = recent champion)

// Lesson 5: Health degradation — players with injury risk degrade over long series
// injuryRisk per player (0 = healthy, 0.5 = minor concern, 1.0 = significant risk)

// Lesson 7: Star ceiling variance — elite stars produce games far above baseline ~1x per series
// starCeiling per player (0 = normal, 1 = occasional explosion, 2 = historic ceiling games)

// Lesson 2 & 5 (combined): Bounce-back qualifier
