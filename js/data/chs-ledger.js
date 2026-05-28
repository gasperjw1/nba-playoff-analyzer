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
  },
  {
    "date": "2026-05-09",
    "series": "OKC-LAL",
    "game": 3,
    "retroactive": true,
    "actual": {
      "winner": "OKC",
      "margin": 23,
      "homeScore": 131,
      "awayScore": 108
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 10,
      "homeScore": 114,
      "awayScore": 104
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 9,
      "homeScore": 112,
      "awayScore": 103,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-09",
    "series": "DET-CLE",
    "game": 3,
    "retroactive": true,
    "actual": {
      "winner": "CLE",
      "margin": 7,
      "homeScore": 109,
      "awayScore": 116
    },
    "mainPred": {
      "winner": "CLE",
      "margin": 4,
      "homeScore": 108,
      "awayScore": 104
    },
    "chsPred": {
      "winner": "DET",
      "margin": 1,
      "homeScore": 106,
      "awayScore": 105,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-10",
    "series": "NYK-PHI",
    "game": 4,
    "retroactive": false,
    "actual": {
      "winner": "NYK",
      "margin": 30,
      "homeScore": 144,
      "awayScore": 114
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 110,
      "awayScore": 104
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 110,
      "awayScore": 104,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-10",
    "series": "SAS-MIN",
    "game": 4,
    "retroactive": false,
    "actual": {
      "winner": "MIN",
      "margin": 5,
      "homeScore": 109,
      "awayScore": 114
    },
    "mainPred": {
      "winner": "SAS",
      "margin": 7,
      "homeScore": 111,
      "awayScore": 104
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 7,
      "homeScore": 111,
      "awayScore": 104,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-11",
    "series": "DET-CLE",
    "game": 4,
    "retroactive": false,
    "actual": {
      "winner": "CLE",
      "margin": 9,
      "homeScore": 103,
      "awayScore": 112
    },
    "mainPred": {
      "winner": "CLE",
      "margin": 3,
      "homeScore": 104,
      "awayScore": 107
    },
    "chsPred": {
      "winner": "CLE",
      "margin": 3,
      "homeScore": 104,
      "awayScore": 107,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-11",
    "series": "OKC-LAL",
    "game": 4,
    "retroactive": false,
    "actual": {
      "winner": "OKC",
      "margin": 5,
      "homeScore": 115,
      "awayScore": 110
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 5,
      "homeScore": 108,
      "awayScore": 103
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 5,
      "homeScore": 108,
      "awayScore": 103,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-12",
    "series": "SAS-MIN",
    "game": 5,
    "retroactive": false,
    "actual": {
      "winner": "SAS",
      "margin": 29,
      "homeScore": 126,
      "awayScore": 97
    },
    "mainPred": {
      "winner": "SAS",
      "margin": 8,
      "homeScore": 113,
      "awayScore": 105
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 9,
      "homeScore": 114,
      "awayScore": 105,
      "marginDeltaVsMain": 1
    }
  },
  {
    "date": "2026-05-13",
    "series": "DET-CLE",
    "game": 5,
    "retroactive": false,
    "actual": {
      "winner": "CLE",
      "margin": 4,
      "homeScore": 113,
      "awayScore": 117
    },
    "mainPred": {
      "winner": "DET",
      "margin": 5,
      "homeScore": 108,
      "awayScore": 103
    },
    "chsPred": {
      "winner": "DET",
      "margin": 5,
      "homeScore": 108,
      "awayScore": 103,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-15",
    "series": "SAS-MIN",
    "game": 6,
    "retroactive": false,
    "actual": {
      "winner": "SAS",
      "margin": 30,
      "homeScore": 139,
      "awayScore": 109
    },
    "mainPred": {
      "winner": "MIN",
      "margin": 2,
      "homeScore": 108,
      "awayScore": 110
    },
    "chsPred": {
      "winner": "MIN",
      "margin": 2,
      "homeScore": 108,
      "awayScore": 110,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-15",
    "series": "DET-CLE",
    "game": 6,
    "retroactive": false,
    "actual": {
      "winner": "DET",
      "margin": 21,
      "homeScore": 115,
      "awayScore": 94
    },
    "mainPred": {
      "winner": "DET",
      "margin": 6,
      "homeScore": 110,
      "awayScore": 104
    },
    "chsPred": {
      "winner": "DET",
      "margin": 6,
      "homeScore": 110,
      "awayScore": 104,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-18",
    "series": "DET-CLE",
    "game": 7,
    "retroactive": false,
    "actual": {
      "winner": "CLE",
      "margin": 31,
      "homeScore": 94,
      "awayScore": 125
    },
    "mainPred": {
      "winner": "DET",
      "margin": 4,
      "homeScore": 108,
      "awayScore": 104
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
    "date": "2026-05-18",
    "series": "OKC-SAS",
    "game": 1,
    "retroactive": true,
    "actual": {
      "winner": "SAS",
      "margin": 7,
      "homeScore": 115,
      "awayScore": 122
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 4,
      "homeScore": 112,
      "awayScore": 108
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 4,
      "homeScore": 112,
      "awayScore": 108,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-19",
    "series": "NYK-CLE",
    "game": 1,
    "retroactive": false,
    "actual": {
      "winner": "NYK",
      "margin": 11,
      "homeScore": 115,
      "awayScore": 104
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 110,
      "awayScore": 104
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 8,
      "homeScore": 112,
      "awayScore": 104,
      "marginDeltaVsMain": 2
    }
  },
  {
    "date": "2026-05-20",
    "series": "OKC-SAS",
    "game": 2,
    "retroactive": true,
    "actual": {
      "winner": "OKC",
      "margin": 9,
      "homeScore": 122,
      "awayScore": 113
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 7,
      "homeScore": 112,
      "awayScore": 105
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 7,
      "homeScore": 112,
      "awayScore": 105,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-21",
    "series": "NYK-CLE",
    "game": 2,
    "retroactive": true,
    "actual": {
      "winner": "NYK",
      "margin": 16,
      "homeScore": 109,
      "awayScore": 93
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 10,
      "homeScore": 109,
      "awayScore": 99
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 10,
      "homeScore": 109,
      "awayScore": 99,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-22",
    "series": "OKC-SAS",
    "game": 3,
    "retroactive": false,
    "actual": {
      "winner": "OKC",
      "margin": 15,
      "homeScore": 123,
      "awayScore": 108
    },
    "mainPred": {
      "winner": "SAS",
      "margin": 4,
      "homeScore": 112,
      "awayScore": 116
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 4,
      "homeScore": 112,
      "awayScore": 116,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-23",
    "series": "NYK-CLE",
    "game": 3,
    "retroactive": false,
    "actual": {
      "winner": "NYK",
      "margin": 13,
      "homeScore": 121,
      "awayScore": 108
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 113,
      "awayScore": 107
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 6,
      "homeScore": 113,
      "awayScore": 107,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-24",
    "series": "OKC-SAS",
    "game": 4,
    "retroactive": false,
    "actual": {
      "winner": "SAS",
      "margin": 21,
      "homeScore": 82,
      "awayScore": 103
    },
    "mainPred": {
      "winner": "SAS",
      "margin": 4,
      "homeScore": 109,
      "awayScore": 113
    },
    "chsPred": {
      "winner": "SAS",
      "margin": 4,
      "homeScore": 109,
      "awayScore": 113,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-25",
    "series": "NYK-CLE",
    "game": 4,
    "retroactive": false,
    "actual": {
      "winner": "NYK",
      "margin": 37,
      "homeScore": 130,
      "awayScore": 93
    },
    "mainPred": {
      "winner": "NYK",
      "margin": 7,
      "homeScore": 112,
      "awayScore": 105
    },
    "chsPred": {
      "winner": "NYK",
      "margin": 7,
      "homeScore": 112,
      "awayScore": 105,
      "marginDeltaVsMain": 0
    }
  },
  {
    "date": "2026-05-26",
    "series": "OKC-SAS",
    "game": 5,
    "retroactive": false,
    "actual": {
      "winner": "OKC",
      "margin": 13,
      "homeScore": 127,
      "awayScore": 114
    },
    "mainPred": {
      "winner": "OKC",
      "margin": 4,
      "homeScore": 114,
      "awayScore": 110
    },
    "chsPred": {
      "winner": "OKC",
      "margin": 4,
      "homeScore": 114,
      "awayScore": 110,
      "marginDeltaVsMain": 0
    }
  }
];
