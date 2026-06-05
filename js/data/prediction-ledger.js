// ============================================================
// PREDICTION OUTCOME LEDGER — the empirical calibration loop
// ============================================================
// Why this exists: every Council prediction needs to be recorded
// BEFORE the game + settled against actual outcome AFTER. Without
// this loop, our calibration weights remain educated guesses
// forever. With it, we can:
//
//   - Compute empirical hit rate per agent (which agents are right?)
//   - Compute hit rate per signal type (tipster claims vs mechanical?)
//   - Compute hit rate per edge magnitude (do "large edge" calls
//     actually win more than "small edge" calls?)
//   - Identify systematic errors (e.g., we always overweight momentum)
//   - Update SIGNAL_CALIBRATION weights from empirical data
//
// This is the LEARNING LOOP. Without it, the model never improves.
//
// Schema per entry:
//   id              : 'SAS-NYK-G2-2026-06-05'
//   predictedAt     : ISO date (BEFORE the game)
//   series, game    : game identifiers
//   councilVerdict  : { recommendedSide, aggregateEdge, convergence, ... }
//   agentVerdicts   : [{ agent, side, edge, calibratedEdge, confidence }]
//   marketAtPrediction : { spread, total, mlHome, mlAway }
//   outcome         : null (PENDING) | { homeScore, awayScore, winner, margin, totalScored, settledAt }
//   evaluation      : null (PENDING) | computed after settlement
//   notes           : optional human notes
// ============================================================

const PREDICTION_LEDGER = [
  {
    "id": "SAS-NYK-G2-2026-06-05",
    "predictedAt": "2026-06-05T05:35:01.740Z",
    "series": "SAS-NYK",
    "game": 2,
    "homeTeam": "SAS",
    "awayTeam": "NYK",
    "councilVerdict": {
      "recommendedSide": "away",
      "aggregateEdge": -0.22464707651303634,
      "convergence": {
        "agreeing": 6,
        "disagreeing": 1,
        "total": 7
      },
      "confidence": 0.95,
      "variance": 0.25
    },
    "agentVerdicts": [
      {
        "agent": "spread-value",
        "side": "away",
        "rawEdge": -0.1426666666666666,
        "calibratedEdge": -0.10699999999999996,
        "calibrationWeight": 0.75,
        "confidence": 0.9,
        "evidenceCount": 18
      },
      {
        "agent": "matchup",
        "side": "away",
        "rawEdge": -0.30599999999999994,
        "calibratedEdge": -0.18359999999999996,
        "calibrationWeight": 0.6,
        "confidence": 0.55,
        "evidenceCount": 2
      },
      {
        "agent": "fatigue",
        "side": "away",
        "rawEdge": -1,
        "calibratedEdge": -0.35,
        "calibrationWeight": 0.35,
        "confidence": 0.8,
        "evidenceCount": 45
      },
      {
        "agent": "coaching",
        "side": "away",
        "rawEdge": -0.16666666666666674,
        "calibratedEdge": -0.058333333333333355,
        "calibrationWeight": 0.35,
        "confidence": 0.4,
        "evidenceCount": 2
      },
      {
        "agent": "momentum",
        "side": "away",
        "rawEdge": -1,
        "calibratedEdge": -0.4,
        "calibrationWeight": 0.4,
        "confidence": 0.45,
        "evidenceCount": 34
      },
      {
        "agent": "market",
        "side": "away",
        "rawEdge": -0.25,
        "calibratedEdge": -0.175,
        "calibrationWeight": 0.7,
        "confidence": 0.6,
        "evidenceCount": 2
      },
      {
        "agent": "historical",
        "side": "home",
        "rawEdge": 0.13333333333333333,
        "calibratedEdge": 0.06666666666666667,
        "calibrationWeight": 0.5,
        "confidence": 0.55,
        "evidenceCount": 3
      }
    ],
    "marketAtPrediction": {
      "spread": -5.5,
      "total": 214.5
    },
    "outcome": null,
    "evaluation": null,
    "notes": ""
  }
];

// ──────────────────────────────────────────────────────────────────
// Record a prediction (called BEFORE the game, from CLI or daily routine)
// ──────────────────────────────────────────────────────────────────

function recordPrediction(councilResult, series, gameNum, market, predictedAt) {
  const id = `${series.id}-G${gameNum}-${(predictedAt || new Date().toISOString()).slice(0, 10)}`;
  const entry = {
    id,
    predictedAt: predictedAt || new Date().toISOString(),
    series: series.id,
    game: gameNum,
    homeTeam: series.homeTeam.abbr,
    awayTeam: series.awayTeam.abbr,
    councilVerdict: {
      recommendedSide: councilResult.synthesis.recommendedSide,
      aggregateEdge: councilResult.synthesis.aggregateEdge,
      convergence: councilResult.synthesis.convergence,
      confidence: councilResult.synthesis.confidence,
      variance: councilResult.synthesis.variance,
    },
    agentVerdicts: (councilResult.synthesis.calibratedVerdicts || councilResult.verdicts).map(v => ({
      agent: v.agent,
      side: v.side,
      rawEdge: v.edge,
      calibratedEdge: v.calibratedEdge || v.edge,
      calibrationWeight: v.calibrationWeight || 1.0,
      confidence: v.confidence,
      evidenceCount: v.evidenceCount,
    })),
    marketAtPrediction: { ...market },
    outcome: null,
    evaluation: null,
    notes: '',
  };
  return entry;
}

// ──────────────────────────────────────────────────────────────────
// Settle a prediction (called AFTER the game, from daily routine)
// ──────────────────────────────────────────────────────────────────

function settlePrediction(entry, actualResult) {
  // actualResult = { homeScore, awayScore, winner, settledAt? }
  const margin = actualResult.homeScore - actualResult.awayScore; // + = home margin
  const totalScored = actualResult.homeScore + actualResult.awayScore;
  entry.outcome = {
    homeScore: actualResult.homeScore,
    awayScore: actualResult.awayScore,
    winner: actualResult.winner,
    margin,
    totalScored,
    settledAt: actualResult.settledAt || new Date().toISOString(),
  };

  // Spread cover evaluation
  const spread = entry.marketAtPrediction.spread; // negative = home favorite
  // home covers if margin > -spread (e.g. -5.5 → margin > 5.5)
  const homeCoverThreshold = -spread;
  const spreadCover = margin > homeCoverThreshold ? 'home'
                    : margin === homeCoverThreshold ? 'push'
                    : 'away';

  // Total over/under
  const totalLine = entry.marketAtPrediction.total;
  const overUnder = totalScored > totalLine ? 'over' : totalScored < totalLine ? 'under' : 'push';

  // Did the Council's recommended side actually win the spread?
  const recommendedSide = entry.councilVerdict.recommendedSide;
  const councilSpreadCorrect = recommendedSide === 'no-edge' ? null
    : recommendedSide === spreadCover;

  // Per-agent correctness
  const agentEvaluations = entry.agentVerdicts.map(v => {
    if (v.side === 'no-edge' || v.side === null) return { agent: v.agent, side: v.side, correct: null };
    return { agent: v.agent, side: v.side, correct: v.side === spreadCover };
  });

  entry.evaluation = {
    spreadCover, overUnder,
    councilSpreadCorrect,
    actualMarginVsExpected: margin - homeCoverThreshold, // how far did we miss the line
    agentEvaluations,
  };

  return entry;
}

// ──────────────────────────────────────────────────────────────────
// Compute hit rates per agent + signal type from settled entries
// ──────────────────────────────────────────────────────────────────

function computeCalibrationFromLedger(ledger) {
  const settled = ledger.filter(e => e.evaluation && e.evaluation.agentEvaluations);
  if (!settled.length) return { totalGames: 0, perAgent: {} };

  const perAgent = {};
  settled.forEach(entry => {
    entry.evaluation.agentEvaluations.forEach(ae => {
      if (ae.correct === null) return;
      if (!perAgent[ae.agent]) perAgent[ae.agent] = { correct: 0, total: 0 };
      perAgent[ae.agent].total++;
      if (ae.correct) perAgent[ae.agent].correct++;
    });
  });

  Object.keys(perAgent).forEach(agent => {
    const { correct, total } = perAgent[agent];
    perAgent[agent].hitRate = total ? correct / total : 0;
    perAgent[agent].sampleSize = total;
    // Bayesian shrinkage toward 0.5 (avoid overreacting to small samples)
    perAgent[agent].shrunkHitRate = (correct + 5) / (total + 10);
  });

  return {
    totalGames: settled.length,
    perAgent,
    overallCouncilHitRate: (() => {
      const valid = settled.filter(e => e.evaluation.councilSpreadCorrect !== null);
      if (!valid.length) return null;
      return valid.filter(e => e.evaluation.councilSpreadCorrect).length / valid.length;
    })(),
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PREDICTION_LEDGER, recordPrediction, settlePrediction, computeCalibrationFromLedger,
  };
}
