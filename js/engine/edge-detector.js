// ============================================================
// EDGE DETECTOR — Phase 68 (May 16, 2026)
// ============================================================
// Born from the R2 P&L retro: at $25/bet across 99 R2 straight bets we
// netted -$203 with a 52.0% hit rate. The original hypothesis (coin-
// flip MC bucket is inverted) turned out to be only partly right —
// the actual cross-tab is far more damning. See backtest-pl-with-filters.js.
//
//   R2 BREAKDOWN BY TYPE (the actual signal):
//     ml:     19 bets, 73.7% hit, +$54   (+11% ROI)
//     spread: 17 bets, 70.6% hit, +$148  (+35% ROI) — best
//     total:  13 bets, 53.8% hit, +$10   (+3%  ROI)
//     prop:   50 bets, 36.7% hit, -$416  (-33% ROI) — KILL ZONE
//
//   R2 BREAKDOWN BY CONFIDENCE LABEL (also a surprise):
//     best-bet:  77.8% hit, +$17   (n=9)
//     high:      37.9% hit, -$280  (n=29) — the inverted label
//     medium:    45.9% hit, -$128  (n=38)
//     lean:      76.2% hit, +$238  (n=21) — best calibrated
//     coin-flip: 0%   hit, -$25    (n=1, ignore)
//
//   THE COMBINED FILTER ("no props" + "no high-confidence anything")
//   would have moved the R2 slate from -$203 to roughly break-even
//   or modestly positive. Just "no props" alone is +$213 net.
//
// This module exposes four pure functions:
//
//   1. classifyBet(bet) — given a {type, confidence} pair, returns
//      'PLACE' | 'CAUTION' | 'SKIP' with the historical hit-rate basis.
//
//   2. shouldSkipCoinFlip(modelProb) — original MC-band check, kept
//      because it remains the right tool for live MC output (which the
//      historical retro couldn't test — no stored MC for past bets).
//
//   3. detectMarketDisagreement(modelProb, americanOdds) — calibrated
//      probability vs implied probability check.
//
//   4. scoreBet(bet, modelProb, americanOdds) — combined verdict that
//      runs classification + skip-zone + disagreement in sequence.
//
// All functions are pure (no globals, no state) and idempotent.
// ============================================================

// ── Empirical edge table — derived from 99-bet R2 retro ──────────────
// Each cell is { hitRate, roi, n, recommendation }.
// recommendation values:
//   PLACE   — historically profitable, keep betting
//   CAUTION — break-even or small sample, proceed with reduced stake
//   SKIP    — historically -EV, do not bet
//
// IMPORTANT: when the sample grows or a new playoff round opens, these
// numbers must be recomputed by running backtest-pl-with-filters.js and
// updating this table. The whole point of building this as data is so
// the engine isn't married to outdated thresholds.
const HISTORICAL_R2 = {
  byType: {
    ml:     { n: 19, hitRate: 0.737, roi:  0.114, recommendation: 'PLACE' },
    // Phase 71 audit downgrade: 12.94pt margin MAE → spread bets are
    // priced INSIDE our error band. The +35% ROI on 17 bets was
    // small-sample luck, not skill. Downgrade PLACE → CAUTION until
    // margin MAE drops below 10pt.
    spread: { n: 17, hitRate: 0.706, roi:  0.349, recommendation: 'CAUTION',
              note: 'Phase 71 calibration audit: 12.94pt margin MAE — model has no real edge on spread. Historical hit rate was lucky.' },
    total:  { n: 13, hitRate: 0.538, roi:  0.031, recommendation: 'CAUTION' },
    prop:   { n: 50, hitRate: 0.367, roi: -0.333, recommendation: 'SKIP' },
  },
  byConfidence: {
    'best-bet':  { n:  9, hitRate: 0.778, roi:  0.076, recommendation: 'PLACE' },
    'high':      { n: 29, hitRate: 0.379, roi: -0.387, recommendation: 'SKIP' },
    'medium':    { n: 38, hitRate: 0.459, roi: -0.135, recommendation: 'CAUTION' },
    'lean':      { n: 21, hitRate: 0.762, roi:  0.454, recommendation: 'PLACE' },
    'coin-flip': { n:  1, hitRate: 0.000, roi: -1.000, recommendation: 'SKIP' },
  },
  // Cross-tab of confidence × type. Cells with n<3 are flagged 'INSUFFICIENT'.
  // Numbers from R2 retro (backtest-pl-with-filters.js output, May 16).
  byCross: {
    'best-bet|ml':     { n: 6,  hitRate: 0.833, roi:  0.001, recommendation: 'PLACE' },
    'best-bet|total':  { n: 1,  hitRate: 1.000, roi:  0.909, recommendation: 'INSUFFICIENT' },
    'best-bet|prop':   { n: 2,  hitRate: 0.500, roi: -0.115, recommendation: 'INSUFFICIENT' },
    'high|ml':         { n: 4,  hitRate: 0.750, roi:  0.004, recommendation: 'CAUTION' },
    'high|spread':     { n: 4,  hitRate: 0.250, roi: -0.523, recommendation: 'SKIP' },
    'high|prop':       { n: 21, hitRate: 0.333, roi: -0.435, recommendation: 'SKIP' },     // worst cell
    'medium|ml':       { n: 5,  hitRate: 0.600, roi:  0.087, recommendation: 'CAUTION' },
    'medium|spread':   { n: 4,  hitRate: 0.750, roi:  0.439, recommendation: 'CAUTION' },
    'medium|total':    { n: 4,  hitRate: 0.250, roi: -0.512, recommendation: 'SKIP' },
    'medium|prop':     { n: 25, hitRate: 0.417, roi: -0.211, recommendation: 'SKIP' },
    'lean|ml':         { n: 3,  hitRate: 1.000, roi:  0.906, recommendation: 'PLACE' },
    // Phase 71 audit downgrade: even the "best" spread cell can't
    // overcome 12.94pt margin MAE. Treat as CAUTION until margin
    // MAE drops below 10pt OR sample grows to n≥20.
    'lean|spread':     { n: 9,  hitRate: 0.889, roi:  0.697, recommendation: 'CAUTION',
                         note: 'Was PLACE on hit rate alone. Audit shows margin MAE 13pt — no real spread edge. Downgraded by Phase 71.' },
    'lean|total':      { n: 8,  hitRate: 0.625, roi:  0.193, recommendation: 'PLACE' },
    'lean|prop':       { n: 1,  hitRate: 0.000, roi: -1.000, recommendation: 'INSUFFICIENT' },
    'coin-flip|prop':  { n: 1,  hitRate: 0.000, roi: -1.000, recommendation: 'INSUFFICIENT' },
  },
};

// ── MC inverted-bucket config — unchanged from Phase 62 calibration ──
// The Phase 62 buckets remain the right tool for LIVE MC output (where
// we have a real probability number, not a curated label). The R2 retro
// couldn't test these because we never stored historical MC output —
// only the curated confidence labels. So the bucket-based skip is the
// theoretical-best filter and the cross-tab is the empirical filter.
// Use both. They agree more often than they disagree.
const EDGE_CONFIG = {
  SKIP_MIN: 0.50,
  SKIP_MAX: 0.65,
  MIN_EDGE: 0.04,
  FADE_EDGE: 0.04,
  KELLY_FRACTION: 0.25,
};

// ── American-odds helpers ────────────────────────────────────────────
function _americanToImplied(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
  if (n > 0) return 100 / (n + 100);
  return -n / (-n + 100);
}
function _americanToDecimalMult(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
  if (n > 0) return 1 + n / 100;
  return 1 + 100 / -n;
}

// ── Calibrated probability (Phase 62 table) ──────────────────────────
function _calibrate(rawProb) {
  if (rawProb == null || !isFinite(rawProb)) return null;
  // Floor: parlay-builder.calibrateHitRate maps <0.30 → 0.30 (the lowest
  // bucket has thin evidence — don't trust an extreme low-prob estimate).
  if (rawProb < 0.30)      return 0.30;
  if (rawProb < 0.50)      return Math.min(0.95, rawProb + 0.18);   // underconfident → boost
  if (rawProb < 0.65)      return Math.max(0.05, rawProb - 0.16);   // INVERTED — fade
  if (rawProb < 0.80)      return rawProb;                          // well-calibrated
  if (rawProb < 0.95)      return Math.max(0.50, rawProb - 0.21);   // overconfident → discount
  return rawProb;
}

// ── Un-projected prop stats (Phase 71) ───────────────────────────────
// The May 17 calibration audit found calcExpectedPlayerStats returns
// 0 for THREES / STL / BLK across every player. Every prop bet we've
// authored on these stats was hand-guessed, not model-supported. Until
// the engine grows projections for these stats, ANY bet keyed off them
// gets a hard CAUTION flag from classifyBet, regardless of cross-tab
// cell. Authors should think twice before placing bets the engine
// can't actually evaluate.
const UNPROJECTED_STAT_TOKENS = ['3PM', 'three', 'threes', '3PT', 'steal', 'block', 'STL', 'BLK'];
function _isUnprojectedStatPick(pick) {
  if (typeof pick !== 'string') return false;
  const p = pick.toLowerCase();
  // Quick token match — case-insensitive substring
  return UNPROJECTED_STAT_TOKENS.some(tok => p.includes(tok.toLowerCase()));
}

// ── classifyBet (NEW — the empirical filter) ────────────────────────
// Given a {type, confidence}, look up the historical performance and
// return the recommendation. The cross-tab is consulted first (most
// specific); falls back to type-only if the cross-cell has n<3.
//
// Returns { recommendation, basis, hitRate, roi, n, explain }.
function classifyBet(bet) {
  if (!bet || !bet.type) return { recommendation: 'CAUTION', basis: 'no-type', explain: 'Missing bet.type' };
  const t = bet.type;
  const c = bet.confidence;

  // Phase 71 guardrail: hard CAUTION for props on stats the engine
  // doesn't actually project (threes/STL/BLK return 0 in audit).
  // Overrides PLACE recommendations from the cross-tab so authors
  // see a forced warning. SKIP cells stay SKIP (worst of both wins).
  if (t === 'prop' && _isUnprojectedStatPick(bet.pick || '')) {
    return {
      recommendation: 'CAUTION',
      basis: 'unprojected-stat',
      explain: `Prop is on an un-projected stat (threes/STL/BLK). Engine returns 0 for these in calibration audit — line is hand-authored, not model-supported. CAUTION applies regardless of cross-tab cell.`,
    };
  }

  // Phase 71 guardrail: elimination-game (G6 / G7) warning.
  // Audit found G6 winner accuracy was 50% with 19.8pt margin MAE
  // (the worst game-number cell). The model has no demonstrable edge
  // in elimination games. Downgrade everything to at-most CAUTION.
  // G7 has only n=3 in audit so we apply the same caution.
  if (bet.game === 6 || bet.game === 7) {
    // Compute the would-be classification first; cap it at CAUTION.
    const baseClass = _classifyByCrossTab(t, c);
    if (baseClass.recommendation === 'PLACE') {
      return {
        ...baseClass,
        recommendation: 'CAUTION',
        basis: 'elimination-game-cap',
        explain: `G${bet.game} elimination context: audit shows 50% winner accuracy, 19.8pt margin MAE. PLACE downgraded to CAUTION regardless of cross-tab.`,
      };
    }
    return baseClass;
  }

  return _classifyByCrossTab(t, c);
}

// Extracted cross-tab lookup so guardrails (elimination-game cap, etc.)
// can call it without recursing through the full classifyBet pipeline.
function _classifyByCrossTab(t, c) {
  const crossKey = `${c}|${t}`;
  const cross = HISTORICAL_R2.byCross[crossKey];
  if (cross && cross.recommendation !== 'INSUFFICIENT') {
    return {
      recommendation: cross.recommendation,
      basis: 'cross-tab',
      crossKey,
      n: cross.n,
      hitRate: cross.hitRate,
      roi: cross.roi,
      explain: `${crossKey}: n=${cross.n}, hit ${(cross.hitRate*100).toFixed(0)}%, ROI ${(cross.roi*100).toFixed(0)}%`,
    };
  }
  // Fall back to type-only (always has n≥9 in R2)
  const tEntry = HISTORICAL_R2.byType[t];
  if (tEntry) {
    return {
      recommendation: tEntry.recommendation,
      basis: 'type-only',
      n: tEntry.n,
      hitRate: tEntry.hitRate,
      roi: tEntry.roi,
      explain: `type=${t}: n=${tEntry.n}, hit ${(tEntry.hitRate*100).toFixed(0)}%, ROI ${(tEntry.roi*100).toFixed(0)}%`,
    };
  }
  return { recommendation: 'CAUTION', basis: 'no-data', explain: 'Type not in historical table' };
}

// ── shouldSkipCoinFlip (MC-bucket gate, unchanged) ───────────────────
function shouldSkipCoinFlip(modelProb, opts) {
  const o = opts || {};
  const lo = o.skipMin != null ? o.skipMin : EDGE_CONFIG.SKIP_MIN;
  const hi = o.skipMax != null ? o.skipMax : EDGE_CONFIG.SKIP_MAX;
  if (modelProb == null || !isFinite(modelProb)) {
    return { skip: true, reason: 'no-model-prob', range: [lo, hi] };
  }
  if (modelProb >= lo && modelProb <= hi) {
    return {
      skip: true,
      reason: 'coin-flip-zone',
      modelProb: +modelProb.toFixed(3),
      range: [lo, hi],
      note: 'Raw MC in inverted bucket — Phase 62 retro shows 41% actual vs 57% predicted. SKIP.',
    };
  }
  return { skip: false, modelProb: +modelProb.toFixed(3), range: [lo, hi] };
}

// ── detectMarketDisagreement (Kelly-sized edge check) ────────────────
function detectMarketDisagreement(modelProb, americanOdds, opts) {
  const o = opts || {};
  const minEdge = o.minEdge != null ? o.minEdge : EDGE_CONFIG.MIN_EDGE;
  const fadeEdge = o.fadeEdge != null ? o.fadeEdge : EDGE_CONFIG.FADE_EDGE;

  const implied = _americanToImplied(americanOdds);
  const calibrated = _calibrate(modelProb);
  if (implied == null || calibrated == null) {
    return { hasEdge: false, reason: 'invalid-input', implied, calibrated };
  }

  const edge = +(calibrated - implied).toFixed(3);
  const decMult = _americanToDecimalMult(americanOdds);
  const b = decMult - 1;
  const rawKelly = b > 0 ? (b * calibrated - (1 - calibrated)) / b : 0;
  const kelly = Math.max(0, Math.min(EDGE_CONFIG.KELLY_FRACTION, rawKelly));

  return {
    hasEdge: edge >= minEdge,
    shouldFade: edge <= -fadeEdge,
    edge,
    calibrated: +calibrated.toFixed(3),
    implied: +implied.toFixed(3),
    rawModelProb: +modelProb.toFixed(3),
    kellyFraction: +kelly.toFixed(3),
    decimalMult: +decMult.toFixed(3),
  };
}

// ── scoreBet (combined verdict) ──────────────────────────────────────
// Sequence: empirical classify → MC-bucket gate → market-disagreement.
// First filter that says SKIP wins. Empirical takes priority because
// it's grounded in 99 actual outcomes, not 1000 hypothetical sims.
function scoreBet(bet, modelProb, americanOdds, opts) {
  const empirical = classifyBet(bet);

  // Hard SKIP from cross-tab — refuse no matter what MC says
  if (empirical.recommendation === 'SKIP') {
    return {
      verdict: 'SKIP',
      reason: 'historical-bleed',
      explain: `Historical: ${empirical.explain}. SKIP regardless of MC.`,
      empirical,
    };
  }

  // If we have an MC prob, run the bucket + disagreement gates
  if (modelProb != null) {
    const skip = shouldSkipCoinFlip(modelProb, opts);
    if (skip.skip) {
      return {
        verdict: 'SKIP',
        reason: skip.reason,
        explain: skip.note || `Model prob ${modelProb} outside usable range.`,
        empirical,
        modelProb: skip.modelProb,
      };
    }
    if (americanOdds != null) {
      const dis = detectMarketDisagreement(modelProb, americanOdds, opts);
      if (dis.shouldFade) {
        return {
          verdict: 'FADE',
          reason: 'market-disagreement-reversed',
          explain: `Calibrated ${dis.calibrated} vs implied ${dis.implied} — book has ${(-dis.edge).toFixed(2)}pp edge. Consider OPPOSITE side.`,
          empirical, ...dis,
        };
      }
      if (dis.hasEdge) {
        return {
          verdict: empirical.recommendation === 'PLACE' ? 'STRONG PLACE' : 'PLACE',
          reason: 'positive-edge',
          explain: `Empirical: ${empirical.explain}. Calibrated ${dis.calibrated} > implied ${dis.implied} (+${dis.edge.toFixed(2)}pp). Kelly ${(dis.kellyFraction*100).toFixed(1)}%.`,
          empirical, ...dis,
        };
      }
      // No edge but empirical is positive → still proceed, no MC override
      if (empirical.recommendation === 'PLACE') {
        return {
          verdict: 'PLACE',
          reason: 'historical-positive',
          explain: `Empirical: ${empirical.explain}. No MC edge but empirically +EV.`,
          empirical, ...dis,
        };
      }
      return {
        verdict: 'PASS',
        reason: 'no-edge-and-only-caution',
        explain: `Empirical CAUTION + no MC edge. Sit out.`,
        empirical, ...dis,
      };
    }
  }

  // No MC data — go on empirical alone
  return {
    verdict: empirical.recommendation === 'PLACE' ? 'PLACE' :
             empirical.recommendation === 'CAUTION' ? 'PASS' : 'SKIP',
    reason: 'empirical-only',
    explain: empirical.explain,
    empirical,
  };
}

// ── confidenceToModelProb (for historical bet retro analysis) ────────
function confidenceToModelProb(label) {
  const m = {
    'best-bet':  0.86,
    'high':      0.85,
    'medium':    0.62,
    'lean':      0.58,
    'coin-flip': 0.50,
  };
  return m[label] != null ? m[label] : null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EDGE_CONFIG,
    HISTORICAL_R2,
    classifyBet,
    shouldSkipCoinFlip,
    detectMarketDisagreement,
    scoreBet,
    confidenceToModelProb,
    _americanToImplied,
    _americanToDecimalMult,
    _calibrate,
  };
}
