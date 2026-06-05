// ============================================================
// SIGNAL CALIBRATION — predictive accuracy by signal type
// ============================================================
// Why this exists: the Council MVP treated DESCRIPTIVE evidence
// (analyst quotes, streak length, coaching reputation) as if it
// were PREDICTIVE evidence. Per published research:
//
//   - Tipsters predict at ~42.6% accuracy (BELOW market 53.7%)
//     [Kendall, multi-sport prediction-markets vs tipsters study]
//   - Back-to-back fatigue effect is ~0.5-1 pt — modest, not 100%
//     [Data Jocks + ScienceDaily 25,000-game study]
//   - Calibration-optimized models earn +35% ROI vs -35% for
//     accuracy-optimized [Walsh & Joshi 2023, ScienceDirect]
//
// Each agent's raw edge gets multiplied by the calibration weight
// for its evidence type. Mechanical signals (line movement, minute
// load, defender ratings) score higher than narrative signals
// (analyst quotes, momentum from streak length, coaching reputation).
//
// These weights are EDUCATED PRIORS based on the cited research +
// expected sports-analytics convention. As we accumulate prediction-
// outcome pairs in our own ledger, we should re-calibrate empirically.
// ============================================================

const SIGNAL_CALIBRATION = {
  // ─── MECHANICAL SIGNALS (highest predictive value) ──────────────
  'spread-value': {
    weight: 0.75,
    rationale: 'Empirical distribution analysis. Calibrated by definition — uses actual margin frequencies from this season vs the offered line.',
  },
  'market-divergence': {
    weight: 0.70,
    rationale: 'Market lines integrate broad wisdom-of-crowds with money on the line. Divergence from market = real signal of pricing inefficiency.',
  },
  'matchup-dlebron': {
    weight: 0.60,
    rationale: 'dLEBRON is a calibrated stat with predictive value for individual matchups. But it averages across contexts and may not capture specific scheme.',
  },
  'fatigue-mechanical': {
    weight: 0.55,
    rationale: 'Minute-load + back-to-back effects are validated (~0.5-1 pt per game). Smaller effect than narrative often assumes.',
  },

  // ─── SEMI-MECHANICAL SIGNALS (moderate predictive value) ────────
  'historical-base-rate': {
    weight: 0.50,
    rationale: 'Base rates apply to GENERIC similar situations. Specific situation may differ in ways the base rate cannot capture.',
  },
  'risk-variance': {
    weight: 0.50,
    rationale: 'Variance flags don\'t predict direction; only sizing. Mechanical inputs (backup scarcity, injury) are predictive.',
  },

  // ─── NARRATIVE SIGNALS (lower predictive value) ─────────────────
  'fatigue-analyst-claim': {
    weight: 0.35,
    rationale: 'Tipster prediction accuracy is ~42.6% per multi-sport study — BELOW market. Analyst convergence on "looked tired" describes past, only weakly predicts future.',
  },
  'momentum-streak': {
    weight: 0.40,
    rationale: 'Win streaks are DESCRIPTIVE of past quality but the streak itself doesn\'t predict next game (no momentum runaway per Frontiers research). Underlying team quality IS predictive but should be measured directly.',
  },
  'coaching-resume': {
    weight: 0.35,
    rationale: 'COY trophies + résumé heuristics are descriptive of past coach quality. Don\'t reliably predict NEXT-GAME outcome relative to opposing coach.',
  },
  'qualitative-observation': {
    weight: 0.45,
    rationale: 'User-observed signals are closer to the action than analyst quotes but still descriptive. Slightly higher than analyst quotes because user has specific watching context.',
  },

  // ─── DEFAULT for uncategorized signals ──────────────────────────
  'default': {
    weight: 0.45,
    rationale: 'Conservative default for signals that don\'t fit a known calibration class.',
  },
};

// Helper: lookup calibration weight
function getCalibrationWeight(signalType) {
  return (SIGNAL_CALIBRATION[signalType] || SIGNAL_CALIBRATION['default']).weight;
}

// Helper: apply calibration to an agent's verdict
// Calibrated edge = raw_edge × calibration_weight
function calibrateEdge(rawEdge, signalType) {
  return rawEdge * getCalibrationWeight(signalType);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SIGNAL_CALIBRATION, getCalibrationWeight, calibrateEdge };
}
