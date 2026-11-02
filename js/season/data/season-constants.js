// ============================================================
// REGULAR-SEASON MODEL CONSTANTS (2026-27)
// ============================================================
// Every number here is a PRIOR, not a fitted value. The season
// ledger (js/season/ledger.js) accumulates out-of-sample
// predictions against results and the closing line; re-fit these
// once it holds 150+ settled games. Until then, prefer the
// published research value over anything tuned on a handful of
// games — that is the lesson of the playoff engine's 18.8%
// catastrophic-miss rate (CALIBRATION_AUDIT.md).

// Home-court advantage in points. Modern NBA HCA has declined to
// roughly 2-3 points (Barreira & Morgado 2023 longitudinal study;
// 2023-24 through 2025-26 seasons ran ~2.3-2.8).
const SEASON_HCA = 2.5;

// Standard deviation of (actual margin − expected margin). Closing
// spreads miss by ~10 pts MAE / ~13 RMSE in the modern era, so a
// 12.5-pt normal maps spread → win probability: 7-pt favourite ≈
// 71%, 10-pt ≈ 79%, which matches the money-line market.
const SEASON_MARGIN_SIGMA = 12.5;

// Early-season shrinkage. Current-season net rating gets weight
// g / (g + K); the rest comes from last season's rating. K = 20
// means current form is half-weighted after 20 games.
const SEASON_SHRINK_K = 20;

// Last season's net rating is itself regressed toward league
// average to account for roster turnover and aging.
const SEASON_PRIOR_RETENTION = 0.80;

// Fallback league averages (used when the feed covers too few
// teams to derive them). Approximate 2025-26 values — ORtg equals
// DRtg by definition at the league level.
const SEASON_LEAGUE_FALLBACK = { ortg: 114.5, pace: 99.0 };
const SEASON_LEAGUE_MIN_TEAMS = 20;   // derive from feed only with this many teams

// Rest / schedule effects in points. Back-to-back costs ~0.5-1 pt
// (25,000-game study cited in signal-calibration.js); three-in-four
// is smaller; 3+ days rest is a small positive.
const SEASON_REST = {
  backToBack: -1.0,
  threeInFour: -0.5,
  longRestBonus: 0.5,     // restDays >= 3
  longRestDays: 3,
};

// Availability impact. A player's value above replacement is
// measured with Hollinger Game Score per 36 (box-score only —
// the NB.AI feed carries no plus-minus metrics). Replacement
// level ≈ 6 GmSc/36 (a typical 10th man). The scale converts
// (GmSc/36 above replacement × minutes share) into points of
// margin. 0.40 prices Curry/Haliburton-class absences at ~5-6 pts
// and a solid starter at ~1.5-2, which is roughly how the line
// moved on the Nov 1 2026 slate (0.50 ran ~1.4× the market).
// Below replacement-level contributors (and the usage their
// teammates absorb) are what keep this from being 1:1.
//
// Known gap: the NB.AI feed's seasonAverage is CURRENT season only,
// so a player who is out before his first game has no sample and
// is reported as `unmodeled` rather than valued.
const SEASON_IMPACT = {
  replacementGmSc36: 6.0,
  scale: 0.40,
  teamCap: 12.0,          // max margin swing from absences
  minMinutesForImpact: 8, // ignore deep bench noise
  offShare: 0.70,         // share of a lost player's impact that reduces own scoring
};

// Player prop projection shape. Standard deviations are linear in
// the mean (playoff audit: PTS MAE 4.8 at mean 12 → sd ≈ 6).
const SEASON_PROP = {
  redistribution: 0.80,   // share of absent teammates' production redistributed
  oppDefenseWeight: 0.50, // how much opponent DRtg deviation moves scoring
  h2hWeight: 0.10,        // weight on career head-to-head averages (n >= 5)
  h2hMinGames: 5,
  sd: {
    pts: [2.5, 0.22],     // sd = a + b × mean: 12 → 5.1, 20 → 6.9, 27 → 8.4
    reb: [1.0, 0.30],
    ast: [0.8, 0.35],
    tpm: [0.6, 0.40],
    stl: [0.5, 0.40],
    blk: [0.4, 0.45],
  },
};

// Ensemble defaults. Equal log-odds averaging of the two models;
// extremizing factor 1.0 until the ledger says otherwise
// (Satopää et al. 2014 found ~1.1-1.3 optimal when forecasters'
// information is mostly non-overlapping).
const SEASON_ENSEMBLE = {
  weights: { ours: 1.0, friend: 1.0 },
  extremize: 1.0,
  marketWeight: 0.0,      // 0 = market shown for comparison only, not blended
  stackMinN: 30,          // show provisional stacking weights from here
  stackTrustN: 150,       // treat stacking weights as usable from here
  edgeFlagPts: 0.05,      // |p_blend − p_market| that gets a visible flag
};

const SEASON_LEDGER_STORAGE_KEY = 'seasonLedgerV1';
const SEASON_SLATE_STORAGE_KEY = 'seasonSlateImportV1';
