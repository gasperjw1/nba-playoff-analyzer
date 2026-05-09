// ============================================================
// CHS ACCURACY LEDGER (CHS shadow architecture, May 9, 2026)
// ============================================================
// Append-only record of CHS predictions vs actuals for each resolved
// game. The CHS Lab tab (js/ui/chs-lab.js) reads this for the
// accuracy panel and computes live for upcoming games.
//
// Schema:
//   date         : 'YYYY-MM-DD'
//   series       : 'NYK-PHI' (matches SERIES_DATA.id)
//   game         : 1..7
//   retroactive  : true if computed AFTER the game (initial seed);
//                  false if captured pre-game by the daily task.
//                  Retroactive entries can shift if historical.js
//                  is refined later — they're a baseline, not a
//                  pre-game commitment.
//   actual       : { winner, margin, homeScore, awayScore }
//   mainPred     : main engine prediction (from series.games[N].prediction)
//   chsPred      : CHS-adjusted prediction (calcBlendedProjectionWithCHS)
//
// Promote criterion (10-game window):
//   winner hit rate: CHS ≥ main + 10pp
//   margin MAE:     CHS ≤ main − 1.5
// Both must clear to flip USE_CHS_IN_PROJECTIONS to true in
// constants.js.
// ============================================================

const CHS_LEDGER = [
  {
    "date": "2026-05-05",
    "series": "OKC-LAL",
    "game": 1,
    "retroactive": true,
    "actual": {
      "winner": "OKC",
      "margin": 18,
      "homeScore": 108,
      "awayScore": 90
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 15,
      "homeScore": 116,
      "awayScore": 101
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 38,
      "homeScore": 126,
      "awayScore": 88,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-07",
    "series": "OKC-LAL",
    "game": 2,
    "retroactive": true,
    "actual": {
      "winner": "OKC",
      "margin": 18,
      "homeScore": 125,
      "awayScore": 107
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 18,
      "homeScore": 112,
      "awayScore": 94
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 23,
      "homeScore": 115,
      "awayScore": 92,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-04",
    "series": "SAS-MIN",
    "game": 1,
    "retroactive": true,
    "actual": {
      "winner": "MIN",
      "margin": 2,
      "homeScore": 102,
      "awayScore": 104
    },
    "mainPred": {
      "winner": "SAS",
      "margin": 7,
      "homeScore": 112,
      "awayScore": 105
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 16,
      "homeScore": 113,
      "awayScore": 97,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-06",
    "series": "SAS-MIN",
    "game": 2,
    "retroactive": true,
    "actual": {
      "winner": "SAS",
      "margin": 38,
      "homeScore": 133,
      "awayScore": 95
    },
    "mainPred": {
      "winner": "SAS",
      "margin": 5,
      "homeScore": 111,
      "awayScore": 106
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 13,
      "homeScore": 111,
      "awayScore": 98,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-08",
    "series": "SAS-MIN",
    "game": 3,
    "retroactive": true,
    "actual": {
      "winner": "SAS",
      "margin": 7,
      "homeScore": 115,
      "awayScore": 108
    },
    "mainPred": {
      "winner": "MIN",
      "margin": 9,
      "homeScore": 102,
      "awayScore": 111
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 7,
      "homeScore": 110,
      "awayScore": 103,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-05",
    "series": "DET-CLE",
    "game": 1,
    "retroactive": true,
    "actual": {
      "winner": "DET",
      "margin": 10,
      "homeScore": 111,
      "awayScore": 101
    },
    "mainPred": {
      "winner": "DET",
      "margin": 3,
      "homeScore": 108,
      "awayScore": 105
    },
    "chsPred": {
      "winner": "DET",
      "margin": 4,
      "homeScore": 108,
      "awayScore": 104,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-07",
    "series": "DET-CLE",
    "game": 2,
    "retroactive": true,
    "actual": {
      "winner": "DET",
      "margin": 10,
      "homeScore": 107,
      "awayScore": 97
    },
    "mainPred": {
      "winner": "DET",
      "margin": 2,
      "homeScore": 107,
      "awayScore": 105
    },
    "chsPred": {
      "winner": "DET",
      "margin": 2,
      "homeScore": 107,
      "awayScore": 105,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-04",
    "series": "NYK-PHI",
    "game": 1,
    "retroactive": true,
    "actual": {
      "winner": "NYK",
      "margin": 39,
      "homeScore": 137,
      "awayScore": 98
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 9,
      "homeScore": 110,
      "awayScore": 101
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 21,
      "homeScore": 116,
      "awayScore": 95,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-06",
    "series": "NYK-PHI",
    "game": 2,
    "retroactive": true,
    "actual": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 108,
      "awayScore": 102
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 112,
      "awayScore": 106
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 10,
      "homeScore": 115,
      "awayScore": 105,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-08",
    "series": "NYK-PHI",
    "game": 3,
    "retroactive": true,
    "actual": {
      "winner": "NYK",
      "margin": 14,
      "homeScore": 108,
      "awayScore": 94
    },
    "mainPred": {
      "winner": "PHI",
      "margin": 6,
      "homeScore": 105,
      "awayScore": 111
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 4,
      "homeScore": 110,
      "awayScore": 106,
      "marginDeltaVsMain": 0
    }
  }
];
