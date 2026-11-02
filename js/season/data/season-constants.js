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

// Last season's net rating is itself regressed toward league average.
// 0.75 is the out-of-sample choice from research-team-fit.js's replay of
// the engine on 330 team-seasons (roster changes and aging are separate
// steps, so this covers only what they don't: luck, coaching, health).
// Was 0.80 before aging became its own step.
const SEASON_PRIOR_RETENTION = 0.75;

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

// Player value. Box Plus/Minus (Basketball-Reference) is points per
// 100 possessions relative to a league-average player, built so a
// team's minutes-weighted BPM sums to its net rating. Value per game
// above a replacement-level substitute:
//
//   (BPM − replacementBpm) × min/48 × pace/100 × bpmToPoints
//
// Both constants are re-measured on every `node fetch-priors.js` run:
//   replacementBpm −2.0   VORP's definition; 2025-26 players ranked
//                         301-450 by minutes averaged −2.2.
//   bpmToPoints    0.885  slope of team point differential on Σ BPM ×
//                         minutes share — 2025-26 R² 0.998, 2024-25
//                         slope 0.892 R² 0.996.
// For scale: SGA ≈ 8.4 pts/game, Jokić ≈ 10.4, Curry ≈ 4.2, Brunson ≈ 3.3.
// (Replaced Game Score/36 with replacement 6.0: the measured fringe
// level is 13.7, so role players were overvalued; GmSc also rated
// Duren above Curry and Caruso at zero.)
//
// Roster adjustment: a team's rating already contains whoever played
// the games behind it. Tonight's margin moves by
//   Σ value × (availability tonight − share of the rating he is in)
// over the current roster, minus departed players' share — so an
// injury that predates the rating, or an off-season arrival, is not
// double-counted or missed.
const SEASON_IMPACT = {
  replacementBpm: -2.0,
  bpmToPoints: 0.885,
  teamCap: 12.0,          // max |roster adjustment| per team, points
  minMinutesForImpact: 8, // ignore deep bench noise
  offShare: 0.70,         // share of a player's value that is his own team's scoring (totals only)
  fitCap: 2.0,            // max |roster fit adjustment| per team, points (see below)
  agingCap: 4.0,          // max |aging adjustment| per team, points (see below)
};

// Aging: js/season/data/aging-fit.js holds the expected BPM change from a
// player's prior to this season by age (+0.8 at 20-22, ~0 at 26, −0.4 at
// 30, −0.8 at 35), measured on 3,318 player-seasons. The engine ages last
// season's part of the rating: Σ (1 − w) × share of last season's games ×
// availability tonight × value change. Arrivals keep their prior value —
// in the replay, aging them made projections worse (the curve comes from
// players who kept their minutes, which flatters young players).
// Replay at opening night, 330 team-seasons: RMSE 3.066 → 3.010 per 100
// with retention 0.80 → 0.75 (out of sample 3.019).

// Roster fit ("chemistry"): coefficients in js/season/data/chemistry-fit.js,
// fitted by research-team-fit.js on 330 team-seasons (2015-16 … 2025-26)
// as the miss of summed player BPM on actual net rating. Of seven
// pre-registered fit features, two held up out of sample:
//   continuity  share of minutes from players on the team last season
//               (teams that stay together beat their summed BPM)
//   rebounding  on-floor rebound-rate sum (rebounders overlap: the
//               second big's boards come partly out of the first's)
// Usage, playmaking and spacing overlap and stacked non-shooting bigs
// were not detectable beyond what BPM already prices. The adjustment
// fades by (1 − current-season weight): this season's results already
// contain whatever fit the roster has.

// Player baselines: two prior seasons blended with this season.
//  - Seasons weighted 1.0 / 0.5 per minute (Basketball-Reference's
//    Simple Projection System weights the last three seasons 6/3/1).
//  - Prior BPM is regressed toward replacement with 300 phantom
//    minutes, so a 6-game season cannot price a player as a starter.
//  - This season counts against at most `…CurrentK` minutes of prior:
//    BPM 1000 (impact metrics stabilize slowly), box rates 600 (props),
//    minutes per game 4 games (roles change fast).
//  - Current-season BPM is estimated from the box line with the fit
//    fetch-priors.js stores (R² 0.88 in-sample, 0.88 out-of-sample).
//  - No NBA history: this season's estimate regressed toward
//    replacement with 400 phantom minutes.
// All heuristics until the backtest says otherwise.
const SEASON_PLAYER_PRIOR = {
  seasonWeights: { 26: 1.0, 25: 0.5 },
  bpmRegressMinutes: 300,
  bpmCurrentK: 1000,
  rateCurrentK: 600,
  minutesCurrentGames: 4,
  rookieRegressMinutes: 400,
  teamGames: 82,
};

// Bumped whenever the projection logic changes, and stored on every
// ledger row so the scorecard never mixes model versions silently.
const SEASON_ENGINE_VERSION = '2026-11-02.aging-v2';

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
