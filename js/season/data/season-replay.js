// ============================================================
// SEASON REPLAY — walk-forward predictions (replay-5)
// ============================================================
// Written by `node replay-season.js`. Each row was predicted from data
// published before its game (see the header of replay-season.js and each
// row's provenance), with engine 2026-11-05.b2b2 frozen. These are NOT
// ledger rows: they were generated after the fact and are scored apart
// from the live ledger. Do not hand-edit.
// ============================================================
const SEASON_REPLAY = {
 "spec": {
  "version": "replay-5",
  "engine": "2026-11-05.b2b2",
  "firstDay": "2026-10-20",
  "rosterSnapshotBefore": "2026-10-20T12:00:00Z",
  "reportLeadMinutes": 60,
  "preseasonCoef": 0.099,
  "preseasonWindow": [
   "2026-09-25",
   "2026-10-19"
  ],
  "variants": {
   "ours": "engine",
   "oursPre": "engine + preseason"
  }
 },
 "generatedAt": "2026-11-05T21:24:53.607Z",
 "rows": [
  {
   "id": "401909088",
   "date": "2026-10-20",
   "tip": "2026-10-20T19:00Z",
   "home": "DET",
   "away": "BOS",
   "pOurs": 0.5882,
   "marginOurs": 2.79,
   "totalOurs": 223.2,
   "pOursPre": 0.548,
   "marginOursPre": 1.51,
   "totalOursPre": 223.2,
   "pFriend": null,
   "pMarket": 0.4675,
   "mlHome": 105,
   "mlAway": -125,
   "spreadHome": 1.5,
   "totalMarket": 220.5,
   "open": {
    "mlHome": -125,
    "mlAway": 105,
    "spreadHome": -2.5,
    "total": 224.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 121,
    "awayScore": 113
   },
   "provenance": {
    "report": "Injury-Report_2026-10-20_02_00PM.pdf",
    "reportAt": "2026-10-20T18:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-20",
    "inputsHash": "1f81fcad5420538a",
    "rosterSizes": {
     "DET": 18,
     "BOS": 17
    }
   }
  },
  {
   "id": "401909089",
   "date": "2026-10-20",
   "tip": "2026-10-20T23:00Z",
   "home": "NY",
   "away": "PHI",
   "pOurs": 0.4744,
   "marginOurs": -0.8,
   "totalOurs": 228.9,
   "pOursPre": 0.438,
   "marginOursPre": -1.95,
   "totalOursPre": 228.8,
   "pFriend": null,
   "pMarket": 0.6092,
   "mlHome": -175,
   "mlAway": 145,
   "spreadHome": -4.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": -170,
    "mlAway": 142,
    "spreadHome": -3.5,
    "total": 229.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 100,
    "awayScore": 106
   },
   "provenance": {
    "report": "Injury-Report_2026-10-20_06_00PM.pdf",
    "reportAt": "2026-10-20T22:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-20",
    "inputsHash": "fea5da664ce08761",
    "rosterSizes": {
     "NY": 17,
     "PHI": 17
    }
   }
  },
  {
   "id": "401909090",
   "date": "2026-10-20",
   "tip": "2026-10-21T01:50Z",
   "home": "SA",
   "away": "OKC",
   "pOurs": 0.4408,
   "marginOurs": -1.86,
   "totalOurs": 228.4,
   "pOursPre": 0.4807,
   "marginOursPre": -0.61,
   "totalOursPre": 228.4,
   "pFriend": null,
   "pMarket": 0.4826,
   "mlHome": -102,
   "mlAway": -118,
   "spreadHome": 1.5,
   "totalMarket": 229.5,
   "open": {
    "mlHome": -125,
    "mlAway": 105,
    "spreadHome": -1.5,
    "total": 228.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 104,
    "awayScore": 116
   },
   "provenance": {
    "report": "Injury-Report_2026-10-20_08_30PM.pdf",
    "reportAt": "2026-10-21T00:30:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-20",
    "inputsHash": "804d6038e241f42f",
    "rosterSizes": {
     "SA": 20,
     "OKC": 17
    }
   }
  },
  {
   "id": "401909834",
   "date": "2026-10-21",
   "tip": "2026-10-21T23:00Z",
   "home": "ORL",
   "away": "ATL",
   "pOurs": 0.5908,
   "marginOurs": 2.87,
   "totalOurs": 231,
   "pOursPre": 0.5951,
   "marginOursPre": 3.01,
   "totalOursPre": 231,
   "pFriend": null,
   "pMarket": 0.5514,
   "mlHome": -135,
   "mlAway": 114,
   "spreadHome": -2.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": -135,
    "mlAway": 114,
    "spreadHome": -2.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 132
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_06_00PM.pdf",
    "reportAt": "2026-10-21T22:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "190e00e3bf4aa2ea",
    "rosterSizes": {
     "ORL": 18,
     "ATL": 19
    }
   }
  },
  {
   "id": "401909835",
   "date": "2026-10-21",
   "tip": "2026-10-21T23:00Z",
   "home": "WSH",
   "away": "MIL",
   "pOurs": 0.5344,
   "marginOurs": 1.08,
   "totalOurs": 233.7,
   "pOursPre": 0.5656,
   "marginOursPre": 2.06,
   "totalOursPre": 233.7,
   "pFriend": null,
   "pMarket": 0.6092,
   "mlHome": -175,
   "mlAway": 145,
   "spreadHome": -4.5,
   "totalMarket": 239.5,
   "open": {
    "mlHome": -238,
    "mlAway": 195,
    "spreadHome": -6.5,
    "total": 238.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 128,
    "awayScore": 116
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_06_00PM.pdf",
    "reportAt": "2026-10-21T22:00:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "d43004cee0e5cb1d",
    "rosterSizes": {
     "WSH": 18,
     "MIL": 18
    }
   }
  },
  {
   "id": "401909091",
   "date": "2026-10-21",
   "tip": "2026-10-21T23:30Z",
   "home": "MIA",
   "away": "MIN",
   "pOurs": 0.5694,
   "marginOurs": 2.18,
   "totalOurs": 234.1,
   "pOursPre": 0.5929,
   "marginOursPre": 2.94,
   "totalOursPre": 234.1,
   "pFriend": null,
   "pMarket": 0.5174,
   "mlHome": -118,
   "mlAway": -102,
   "spreadHome": -1.5,
   "totalMarket": 240.5,
   "open": {
    "mlHome": -155,
    "mlAway": 130,
    "spreadHome": -3.5,
    "total": 236.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 106,
    "awayScore": 131
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_06_30PM.pdf",
    "reportAt": "2026-10-21T22:30:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "b3a1c84d301cd192",
    "rosterSizes": {
     "MIA": 17,
     "MIN": 16
    }
   }
  },
  {
   "id": "401909836",
   "date": "2026-10-21",
   "tip": "2026-10-21T23:30Z",
   "home": "BKN",
   "away": "CHA",
   "pOurs": 0.4036,
   "marginOurs": -3.05,
   "totalOurs": 223.1,
   "pOursPre": 0.4723,
   "marginOursPre": -0.87,
   "totalOursPre": 223.1,
   "pFriend": null,
   "pMarket": 0.4783,
   "mlHome": 100,
   "mlAway": -120,
   "spreadHome": 1.5,
   "totalMarket": 220.5,
   "open": {
    "mlHome": 142,
    "mlAway": -170,
    "spreadHome": 4.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 103,
    "awayScore": 110
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_06_30PM.pdf",
    "reportAt": "2026-10-21T22:30:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "bae599f3fc32c7d7",
    "rosterSizes": {
     "BKN": 18,
     "CHA": 18
    }
   }
  },
  {
   "id": "401909837",
   "date": "2026-10-21",
   "tip": "2026-10-21T23:30Z",
   "home": "TOR",
   "away": "CHI",
   "pOurs": 0.7414,
   "marginOurs": 8.1,
   "totalOurs": 232,
   "pOursPre": 0.7373,
   "marginOursPre": 7.94,
   "totalOursPre": 232,
   "pFriend": null,
   "pMarket": 0.7914,
   "mlHome": -470,
   "mlAway": 360,
   "spreadHome": -10.5,
   "totalMarket": 237.5,
   "open": {
    "mlHome": -345,
    "mlAway": 275,
    "spreadHome": -8.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 135,
    "awayScore": 92
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_06_30PM.pdf",
    "reportAt": "2026-10-21T22:30:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "8be5f13db32155ea",
    "rosterSizes": {
     "TOR": 19,
     "CHI": 18
    }
   }
  },
  {
   "id": "401909838",
   "date": "2026-10-21",
   "tip": "2026-10-22T00:00Z",
   "home": "MEM",
   "away": "UTAH",
   "pOurs": 0.5859,
   "marginOurs": 2.71,
   "totalOurs": 241,
   "pOursPre": 0.5957,
   "marginOursPre": 3.03,
   "totalOursPre": 241,
   "pFriend": null,
   "pMarket": 0.5325,
   "mlHome": -125,
   "mlAway": 105,
   "spreadHome": -1.5,
   "totalMarket": 240.5,
   "open": {
    "mlHome": 124,
    "mlAway": -148,
    "spreadHome": 2.5,
    "total": 241.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 123,
    "awayScore": 103
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_07_00PM.pdf",
    "reportAt": "2026-10-21T23:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "65da1f6157b07bff",
    "rosterSizes": {
     "MEM": 18,
     "UTAH": 18
    }
   }
  },
  {
   "id": "401909839",
   "date": "2026-10-21",
   "tip": "2026-10-22T00:00Z",
   "home": "NO",
   "away": "IND",
   "pOurs": 0.4989,
   "marginOurs": -0.03,
   "totalOurs": 234,
   "pOursPre": 0.4954,
   "marginOursPre": -0.14,
   "totalOursPre": 234,
   "pFriend": null,
   "pMarket": 0.4365,
   "mlHome": 120,
   "mlAway": -142,
   "spreadHome": 2.5,
   "totalMarket": 238.5,
   "open": {
    "mlHome": 145,
    "mlAway": -175,
    "spreadHome": 4.5,
    "total": 240.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 123
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_07_00PM.pdf",
    "reportAt": "2026-10-21T23:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "9b9cf5c71d315059",
    "rosterSizes": {
     "NO": 19,
     "IND": 17
    }
   }
  },
  {
   "id": "401909840",
   "date": "2026-10-21",
   "tip": "2026-10-22T00:30Z",
   "home": "HOU",
   "away": "DAL",
   "pOurs": 0.6616,
   "marginOurs": 5.21,
   "totalOurs": 225.9,
   "pOursPre": 0.7077,
   "marginOursPre": 6.83,
   "totalOursPre": 225.9,
   "pFriend": null,
   "pMarket": 0.7768,
   "mlHome": -425,
   "mlAway": 330,
   "spreadHome": -9.5,
   "totalMarket": 230.5,
   "open": {
    "mlHome": -340,
    "mlAway": 270,
    "spreadHome": -8.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 128,
    "awayScore": 110
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_07_30PM.pdf",
    "reportAt": "2026-10-21T23:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "686966db136525fc",
    "rosterSizes": {
     "HOU": 18,
     "DAL": 18
    }
   }
  },
  {
   "id": "401909092",
   "date": "2026-10-21",
   "tip": "2026-10-22T02:00Z",
   "home": "LAL",
   "away": "GS",
   "pOurs": 0.6494,
   "marginOurs": 4.8,
   "totalOurs": 230,
   "pOursPre": 0.6128,
   "marginOursPre": 3.58,
   "totalOursPre": 229.9,
   "pFriend": null,
   "pMarket": 0.669,
   "mlHome": -230,
   "mlAway": 190,
   "spreadHome": -6.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": -205,
    "mlAway": 170,
    "spreadHome": -5.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 127,
    "awayScore": 105
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_09_00PM.pdf",
    "reportAt": "2026-10-22T01:00:00.000Z",
    "matched": 10,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "aec20db0590d1a5d",
    "rosterSizes": {
     "LAL": 19,
     "GS": 18
    }
   }
  },
  {
   "id": "401909841",
   "date": "2026-10-21",
   "tip": "2026-10-22T02:00Z",
   "home": "POR",
   "away": "PHX",
   "pOurs": 0.5816,
   "marginOurs": 2.58,
   "totalOurs": 225.6,
   "pOursPre": 0.6062,
   "marginOursPre": 3.37,
   "totalOursPre": 225.6,
   "pFriend": null,
   "pMarket": 0.583,
   "mlHome": -155,
   "mlAway": 130,
   "spreadHome": -3.5,
   "totalMarket": 232.5,
   "open": {
    "mlHome": -170,
    "mlAway": 142,
    "spreadHome": -4.5,
    "total": 236.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 124,
    "awayScore": 83
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_09_00PM.pdf",
    "reportAt": "2026-10-22T01:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "3db24de55a5a2781",
    "rosterSizes": {
     "POR": 18,
     "PHX": 17
    }
   }
  },
  {
   "id": "401909842",
   "date": "2026-10-21",
   "tip": "2026-10-22T02:30Z",
   "home": "LAC",
   "away": "SAC",
   "pOurs": 0.6345,
   "marginOurs": 4.3,
   "totalOurs": 226.8,
   "pOursPre": 0.683,
   "marginOursPre": 5.95,
   "totalOursPre": 226.8,
   "pFriend": null,
   "pMarket": 0.6225,
   "mlHome": -185,
   "mlAway": 154,
   "spreadHome": -5.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": -155,
    "mlAway": 130,
    "spreadHome": -4.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 121,
    "awayScore": 96
   },
   "provenance": {
    "report": "Injury-Report_2026-10-21_09_30PM.pdf",
    "reportAt": "2026-10-22T01:30:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-21",
    "inputsHash": "4e836bb2e4be97cd",
    "rosterSizes": {
     "LAC": 18,
     "SAC": 16
    }
   }
  },
  {
   "id": "401909093",
   "date": "2026-10-22",
   "tip": "2026-10-22T23:00Z",
   "home": "PHI",
   "away": "CLE",
   "pOurs": 0.5761,
   "marginOurs": 2.4,
   "totalOurs": 233.2,
   "pOursPre": 0.5702,
   "marginOursPre": 2.21,
   "totalOursPre": 233.1,
   "pFriend": null,
   "pMarket": 0.5514,
   "mlHome": -135,
   "mlAway": 114,
   "spreadHome": -2.5,
   "totalMarket": 237.5,
   "open": {
    "mlHome": -175,
    "mlAway": 145,
    "spreadHome": -4.5,
    "total": 233.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 106
   },
   "provenance": {
    "report": "Injury-Report_2026-10-22_06_00PM.pdf",
    "reportAt": "2026-10-22T22:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-22",
    "inputsHash": "7235e816bb1143ef",
    "rosterSizes": {
     "PHI": 17,
     "CLE": 19
    }
   }
  },
  {
   "id": "401909094",
   "date": "2026-10-22",
   "tip": "2026-10-23T01:30Z",
   "home": "OKC",
   "away": "DEN",
   "pOurs": 0.7346,
   "marginOurs": 7.84,
   "totalOurs": 232.3,
   "pOursPre": 0.713,
   "marginOursPre": 7.03,
   "totalOursPre": 232.3,
   "pFriend": null,
   "pMarket": 0.7409,
   "mlHome": -340,
   "mlAway": 270,
   "spreadHome": -7.5,
   "totalMarket": 236.5,
   "open": {
    "mlHome": -278,
    "mlAway": 225,
    "spreadHome": -7.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 96,
    "awayScore": 84
   },
   "provenance": {
    "report": "Injury-Report_2026-10-22_08_30PM.pdf",
    "reportAt": "2026-10-23T00:30:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "OKC Josh Dix"
    ],
    "boxCutoff": "2026-10-22",
    "inputsHash": "f6347b6868d24e21",
    "rosterSizes": {
     "OKC": 17,
     "DEN": 19
    }
   }
  },
  {
   "id": "401909848",
   "date": "2026-10-23",
   "tip": "2026-10-23T20:00Z",
   "home": "MIL",
   "away": "CHI",
   "pOurs": 0.5973,
   "marginOurs": 3.08,
   "totalOurs": 232.3,
   "pOursPre": 0.5452,
   "marginOursPre": 1.42,
   "totalOursPre": 232.3,
   "pFriend": null,
   "pMarket": 0.5174,
   "mlHome": -118,
   "mlAway": -102,
   "spreadHome": -1.5,
   "totalMarket": 241.5,
   "open": {
    "mlHome": -110,
    "mlAway": -110,
    "spreadHome": -1.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 132
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_03_00PM.pdf",
    "reportAt": "2026-10-23T19:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIL Pete Nance",
     "MIL Kam Jones",
     "MIL Cormac Ryan",
     "CHI Isaiah Stevens"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "f727c7df75117649",
    "rosterSizes": {
     "MIL": 18,
     "CHI": 18
    }
   }
  },
  {
   "id": "401909095",
   "date": "2026-10-23",
   "tip": "2026-10-23T23:00Z",
   "home": "BOS",
   "away": "NY",
   "pOurs": 0.6609,
   "marginOurs": 5.19,
   "totalOurs": 223.1,
   "pOursPre": 0.7525,
   "marginOursPre": 8.53,
   "totalOursPre": 223.1,
   "pFriend": null,
   "pMarket": 0.5721,
   "mlHome": -148,
   "mlAway": 124,
   "spreadHome": -2.5,
   "totalMarket": 220.5,
   "open": {
    "mlHome": -135,
    "mlAway": 114,
    "spreadHome": -2.5,
    "total": 223.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 107,
    "awayScore": 103
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_06_00PM.pdf",
    "reportAt": "2026-10-23T22:00:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "BOS Amari Williams",
     "BOS Dillon Mitchell"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "28a497650e47b96b",
    "rosterSizes": {
     "BOS": 17,
     "NY": 17
    }
   }
  },
  {
   "id": "401909843",
   "date": "2026-10-23",
   "tip": "2026-10-23T23:00Z",
   "home": "CHA",
   "away": "ATL",
   "pOurs": 0.5448,
   "marginOurs": 1.41,
   "totalOurs": 228.7,
   "pOursPre": 0.4853,
   "marginOursPre": -0.46,
   "totalOursPre": 228.7,
   "pFriend": null,
   "pMarket": 0.4365,
   "mlHome": 120,
   "mlAway": -142,
   "spreadHome": 2.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": 114,
    "mlAway": -135,
    "spreadHome": 2.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 81,
    "awayScore": 128
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_06_00PM.pdf",
    "reportAt": "2026-10-23T22:00:00.000Z",
    "matched": 10,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CHA Michael Ajayi",
     "ATL Cameron Corhen"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "9089030410447094",
    "rosterSizes": {
     "CHA": 18,
     "ATL": 19
    }
   }
  },
  {
   "id": "401909844",
   "date": "2026-10-23",
   "tip": "2026-10-23T23:00Z",
   "home": "IND",
   "away": "DAL",
   "pOurs": 0.6154,
   "marginOurs": 3.67,
   "totalOurs": 232.8,
   "pOursPre": 0.6406,
   "marginOursPre": 4.5,
   "totalOursPre": 232.8,
   "pFriend": null,
   "pMarket": 0.6958,
   "mlHome": -265,
   "mlAway": 215,
   "spreadHome": -7.5,
   "totalMarket": 241.5,
   "open": {
    "mlHome": -205,
    "mlAway": 170,
    "spreadHome": -5.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 105,
    "awayScore": 121
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_06_00PM.pdf",
    "reportAt": "2026-10-23T22:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DAL Quincy Acy"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "95b32e0c41e1687a",
    "rosterSizes": {
     "IND": 17,
     "DAL": 19
    }
   }
  },
  {
   "id": "401909845",
   "date": "2026-10-23",
   "tip": "2026-10-23T23:00Z",
   "home": "ORL",
   "away": "MIN",
   "pOurs": 0.5576,
   "marginOurs": 1.81,
   "totalOurs": 230.9,
   "pOursPre": 0.5834,
   "marginOursPre": 2.63,
   "totalOursPre": 230.9,
   "pFriend": null,
   "pMarket": 0.5261,
   "mlHome": -122,
   "mlAway": 102,
   "spreadHome": -1.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": -102,
    "mlAway": -118,
    "spreadHome": 1.5,
    "total": 237.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 93,
    "awayScore": 115
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_06_00PM.pdf",
    "reportAt": "2026-10-23T22:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ORL Mike Sharavjamts"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "ddca9690f27cf28e",
    "rosterSizes": {
     "ORL": 18,
     "MIN": 16
    }
   }
  },
  {
   "id": "401909846",
   "date": "2026-10-23",
   "tip": "2026-10-23T23:00Z",
   "home": "WSH",
   "away": "TOR",
   "pOurs": 0.2351,
   "marginOurs": -9.03,
   "totalOurs": 233.6,
   "pOursPre": 0.2211,
   "marginOursPre": -9.61,
   "totalOursPre": 233.6,
   "pFriend": null,
   "pMarket": 0.2591,
   "mlHome": 270,
   "mlAway": -340,
   "spreadHome": 9.5,
   "totalMarket": 236.5,
   "open": {
    "mlHome": 154,
    "mlAway": -185,
    "spreadHome": 4.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 102,
    "awayScore": 112
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_06_00PM.pdf",
    "reportAt": "2026-10-23T22:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "a2b1d970cd88608e",
    "rosterSizes": {
     "WSH": 18,
     "TOR": 19
    }
   }
  },
  {
   "id": "401909847",
   "date": "2026-10-23",
   "tip": "2026-10-24T00:00Z",
   "home": "MIA",
   "away": "DET",
   "pOurs": 0.3987,
   "marginOurs": -3.21,
   "totalOurs": 231.2,
   "pOursPre": 0.399,
   "marginOursPre": -3.2,
   "totalOursPre": 231.1,
   "pFriend": null,
   "pMarket": 0.4573,
   "mlHome": 110,
   "mlAway": -130,
   "spreadHome": 2.5,
   "totalMarket": 235.5,
   "open": {
    "mlHome": -125,
    "mlAway": 105,
    "spreadHome": -1.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 111,
    "awayScore": 128
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_07_00PM.pdf",
    "reportAt": "2026-10-23T23:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIA Keshad Johnson",
     "MIA Tre Donaldson"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "e95eaadffc97a4d3",
    "rosterSizes": {
     "MIA": 17,
     "DET": 18
    }
   }
  },
  {
   "id": "401909096",
   "date": "2026-10-23",
   "tip": "2026-10-24T01:30Z",
   "home": "SA",
   "away": "HOU",
   "pOurs": 0.707,
   "marginOurs": 6.81,
   "totalOurs": 226.4,
   "pOursPre": 0.6972,
   "marginOursPre": 6.46,
   "totalOursPre": 226.4,
   "pFriend": null,
   "pMarket": 0.6225,
   "mlHome": -185,
   "mlAway": 154,
   "spreadHome": -4.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": -225,
    "mlAway": 185,
    "spreadHome": -5.5,
    "total": 225.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 110,
    "awayScore": 114
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_08_30PM.pdf",
    "reportAt": "2026-10-24T00:30:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor",
     "HOU Oscar Tshiebwe",
     "HOU Sean Pedulla",
     "HOU Quadir Copeland"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "4e756af1cd76fd7b",
    "rosterSizes": {
     "SA": 20,
     "HOU": 18
    }
   }
  },
  {
   "id": "401909849",
   "date": "2026-10-23",
   "tip": "2026-10-24T01:30Z",
   "home": "UTAH",
   "away": "NO",
   "pOurs": 0.496,
   "marginOurs": -0.12,
   "totalOurs": 239.9,
   "pOursPre": 0.5057,
   "marginOursPre": 0.18,
   "totalOursPre": 239.9,
   "pFriend": null,
   "pMarket": 0.5043,
   "mlHome": -112,
   "mlAway": -108,
   "spreadHome": -1.5,
   "totalMarket": 238.5,
   "open": {
    "mlHome": -205,
    "mlAway": 170,
    "spreadHome": -5.5,
    "total": 241.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 119
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_08_30PM.pdf",
    "reportAt": "2026-10-24T00:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NO Christian Koloko"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "b36d24a41e6c306a",
    "rosterSizes": {
     "UTAH": 17,
     "NO": 19
    }
   }
  },
  {
   "id": "401909850",
   "date": "2026-10-23",
   "tip": "2026-10-24T02:00Z",
   "home": "GS",
   "away": "MEM",
   "pOurs": 0.579,
   "marginOurs": 2.49,
   "totalOurs": 230.6,
   "pOursPre": 0.5815,
   "marginOursPre": 2.57,
   "totalOursPre": 230.6,
   "pFriend": null,
   "pMarket": 0.5934,
   "mlHome": -162,
   "mlAway": 136,
   "spreadHome": -4.5,
   "totalMarket": 236.5,
   "open": {
    "mlHome": -155,
    "mlAway": 130,
    "spreadHome": -3.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 108,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_09_00PM.pdf",
    "reportAt": "2026-10-24T01:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MEM Javon Small",
     "MEM Carson Cooper"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "3258251542115ad7",
    "rosterSizes": {
     "GS": 18,
     "MEM": 18
    }
   }
  },
  {
   "id": "401909851",
   "date": "2026-10-23",
   "tip": "2026-10-24T02:00Z",
   "home": "LAL",
   "away": "LAC",
   "pOurs": 0.7513,
   "marginOurs": 8.48,
   "totalOurs": 226.9,
   "pOursPre": 0.734,
   "marginOursPre": 7.81,
   "totalOursPre": 226.9,
   "pFriend": null,
   "pMarket": 0.7508,
   "mlHome": -360,
   "mlAway": 285,
   "spreadHome": -8.5,
   "totalMarket": 225.5,
   "open": {
    "mlHome": -380,
    "mlAway": 300,
    "spreadHome": -9.5,
    "total": 229.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 117
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_09_00PM.pdf",
    "reportAt": "2026-10-24T01:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL AK Okereke",
     "LAL Arthur Kaluma",
     "LAL William Kyle III"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "455871aeb10f4e3c",
    "rosterSizes": {
     "LAL": 19,
     "LAC": 18
    }
   }
  },
  {
   "id": "401909852",
   "date": "2026-10-23",
   "tip": "2026-10-24T02:00Z",
   "home": "SAC",
   "away": "POR",
   "pOurs": 0.1825,
   "marginOurs": -11.32,
   "totalOurs": 229.5,
   "pOursPre": 0.1502,
   "marginOursPre": -12.94,
   "totalOursPre": 229.5,
   "pFriend": null,
   "pMarket": 0.2086,
   "mlHome": 360,
   "mlAway": -470,
   "spreadHome": 9.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": 190,
    "mlAway": -230,
    "spreadHome": 6.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 128
   },
   "provenance": {
    "report": "Injury-Report_2026-10-23_09_00PM.pdf",
    "reportAt": "2026-10-24T01:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "POR John Tonje",
     "POR Jaylen Martin"
    ],
    "boxCutoff": "2026-10-23",
    "inputsHash": "5f99a23ae4882b87",
    "rosterSizes": {
     "SAC": 16,
     "POR": 18
    }
   }
  },
  {
   "id": "401909853",
   "date": "2026-10-24",
   "tip": "2026-10-24T22:00Z",
   "home": "CHA",
   "away": "MIA",
   "pOurs": 0.4981,
   "marginOurs": -0.06,
   "totalOurs": 230,
   "pOursPre": 0.4405,
   "marginOursPre": -1.87,
   "totalOursPre": 230,
   "pFriend": null,
   "pMarket": 0.3836,
   "mlHome": 150,
   "mlAway": -180,
   "spreadHome": 4.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": 124,
    "mlAway": -148,
    "spreadHome": 3.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 115,
    "awayScore": 110
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_05_00PM.pdf",
    "reportAt": "2026-10-24T21:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIA Keshad Johnson",
     "MIA Tre Donaldson"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "2b0275dd66ba1d4e",
    "rosterSizes": {
     "CHA": 18,
     "MIA": 17
    }
   }
  },
  {
   "id": "401909854",
   "date": "2026-10-24",
   "tip": "2026-10-24T23:30Z",
   "home": "CLE",
   "away": "BKN",
   "pOurs": 0.8021,
   "marginOurs": 10.62,
   "totalOurs": 227.3,
   "pOursPre": 0.775,
   "marginOursPre": 9.44,
   "totalOursPre": 227.3,
   "pFriend": null,
   "pMarket": 0.8,
   "mlHome": -500,
   "mlAway": 380,
   "spreadHome": -11.5,
   "totalMarket": 228.5,
   "open": {
    "mlHome": -455,
    "mlAway": 350,
    "spreadHome": -11.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 121
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_06_30PM.pdf",
    "reportAt": "2026-10-24T22:30:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CLE Curtis Jones",
     "CLE Kadary Richmond",
     "BKN Grant Nelson",
     "BKN Joshua Jefferson"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "58258b315e90f60d",
    "rosterSizes": {
     "CLE": 19,
     "BKN": 18
    }
   }
  },
  {
   "id": "401909855",
   "date": "2026-10-24",
   "tip": "2026-10-24T23:30Z",
   "home": "PHI",
   "away": "MIL",
   "pOurs": 0.825,
   "marginOurs": 11.68,
   "totalOurs": 230,
   "pOursPre": 0.832,
   "marginOursPre": 12.03,
   "totalOursPre": 230,
   "pFriend": null,
   "pMarket": 0.8316,
   "mlHome": -650,
   "mlAway": 470,
   "spreadHome": -12.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": -625,
    "mlAway": 455,
    "spreadHome": -12.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 127,
    "awayScore": 116
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_06_30PM.pdf",
    "reportAt": "2026-10-24T22:30:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIL Pete Nance",
     "MIL Kam Jones",
     "MIL Cormac Ryan"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "b1894121aefac464",
    "rosterSizes": {
     "PHI": 17,
     "MIL": 18
    }
   }
  },
  {
   "id": "401909857",
   "date": "2026-10-24",
   "tip": "2026-10-25T00:00Z",
   "home": "CHI",
   "away": "WSH",
   "pOurs": 0.5625,
   "marginOurs": 1.96,
   "totalOurs": 238.4,
   "pOursPre": 0.5842,
   "marginOursPre": 2.66,
   "totalOursPre": 238.4,
   "pFriend": null,
   "pMarket": 0.5325,
   "mlHome": -125,
   "mlAway": 105,
   "spreadHome": -1.5,
   "totalMarket": 244.5,
   "open": {
    "mlHome": -110,
    "mlAway": -110,
    "spreadHome": 1.5,
    "total": 243.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 124
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_07_00PM.pdf",
    "reportAt": "2026-10-24T23:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CHI Isaiah Stevens"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "6934dbc7b114476f",
    "rosterSizes": {
     "CHI": 18,
     "WSH": 18
    }
   }
  },
  {
   "id": "401909858",
   "date": "2026-10-24",
   "tip": "2026-10-25T00:00Z",
   "home": "DAL",
   "away": "SA",
   "pOurs": 0.1585,
   "marginOurs": -12.51,
   "totalOurs": 228.4,
   "pOursPre": 0.1367,
   "marginOursPre": -13.69,
   "totalOursPre": 228.4,
   "pFriend": null,
   "pMarket": 0.137,
   "mlHome": 600,
   "mlAway": -900,
   "spreadHome": 14.5,
   "totalMarket": 229.5,
   "open": {
    "mlHome": 360,
    "mlAway": -470,
    "spreadHome": 11.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 106,
    "awayScore": 122
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_07_00PM.pdf",
    "reportAt": "2026-10-24T23:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DAL Quincy Acy",
     "SA David Jones Garcia",
     "SA Ja'Kobi Gillespie",
     "SA Maliq Brown",
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "4f8da7cd64b5e22a",
    "rosterSizes": {
     "DAL": 19,
     "SA": 20
    }
   }
  },
  {
   "id": "401909856",
   "date": "2026-10-24",
   "tip": "2026-10-25T00:30Z",
   "home": "ATL",
   "away": "HOU",
   "pOurs": 0.5318,
   "marginOurs": 1,
   "totalOurs": 227.6,
   "pOursPre": 0.5208,
   "marginOursPre": 0.65,
   "totalOursPre": 227.6,
   "pFriend": null,
   "pMarket": 0.4957,
   "mlHome": -108,
   "mlAway": -112,
   "spreadHome": 1.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": -115,
    "mlAway": -105,
    "spreadHome": -1.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 121
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_07_30PM.pdf",
    "reportAt": "2026-10-24T23:30:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ATL Cameron Corhen",
     "HOU Oscar Tshiebwe",
     "HOU Julian Phillips",
     "HOU Quadir Copeland"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "8a12812cd294df0e",
    "rosterSizes": {
     "ATL": 19,
     "HOU": 17
    }
   }
  },
  {
   "id": "401909859",
   "date": "2026-10-24",
   "tip": "2026-10-25T01:00Z",
   "home": "DEN",
   "away": "NO",
   "pOurs": 0.8429,
   "marginOurs": 12.58,
   "totalOurs": 236.1,
   "pOursPre": 0.8451,
   "marginOursPre": 12.7,
   "totalOursPre": 236.1,
   "pFriend": null,
   "pMarket": 0.7958,
   "mlHome": -485,
   "mlAway": 370,
   "spreadHome": -11.5,
   "totalMarket": 239.5,
   "open": {
    "mlHome": -485,
    "mlAway": 370,
    "spreadHome": -11.5,
    "total": 237.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 141,
    "awayScore": 135
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_08_00PM.pdf",
    "reportAt": "2026-10-25T00:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DEN Cam Whitmore",
     "DEN Lonnie Walker IV",
     "DEN Steven Crowl",
     "NO Christian Koloko"
    ],
    "boxCutoff": "2026-10-24",
    "inputsHash": "29e2894d0381cd33",
    "rosterSizes": {
     "DEN": 19,
     "NO": 19
    }
   }
  },
  {
   "id": "401909860",
   "date": "2026-10-24",
   "tip": "2026-10-25T02:00Z",
   "home": "PHX",
   "away": "GS",
   "pOurs": 0.7647,
   "marginOurs": 9.02,
   "totalOurs": 220.9,
   "pOursPre": 0.7345,
   "marginOursPre": 7.83,
   "totalOursPre": 220.9,
   "pFriend": null,
   "pMarket": 0.7715,
   "mlHome": -410,
   "mlAway": 320,
   "spreadHome": -9.5,
   "totalMarket": 221.5,
   "open": {
    "mlHome": -205,
    "mlAway": 170,
    "spreadHome": -6.5,
    "total": 224.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 131,
    "awayScore": 122
   },
   "provenance": {
    "report": "Injury-Report_2026-10-24_09_00PM.pdf",
    "reportAt": "2026-10-25T01:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-24",
    "inputsHash": "c4babbcb30a325f6",
    "rosterSizes": {
     "PHX": 17,
     "GS": 18
    }
   }
  },
  {
   "id": "401909861",
   "date": "2026-10-25",
   "tip": "2026-10-25T21:00Z",
   "home": "UTAH",
   "away": "LAL",
   "pOurs": 0.3052,
   "marginOurs": -6.37,
   "totalOurs": 239,
   "pOursPre": 0.3272,
   "marginOursPre": -5.59,
   "totalOursPre": 239,
   "pFriend": null,
   "pMarket": 0.3146,
   "mlHome": 205,
   "mlAway": -250,
   "spreadHome": 6.5,
   "totalMarket": 237.5,
   "open": {
    "mlHome": 210,
    "mlAway": -258,
    "spreadHome": 6.5,
    "total": 236.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 123,
    "awayScore": 132
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_04_00PM.pdf",
    "reportAt": "2026-10-25T20:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL Chris Manon",
     "LAL William Kyle III"
    ],
    "boxCutoff": "2026-10-25",
    "inputsHash": "ef2cca087fae374a",
    "rosterSizes": {
     "UTAH": 18,
     "LAL": 19
    }
   }
  },
  {
   "id": "401909862",
   "date": "2026-10-25",
   "tip": "2026-10-25T22:00Z",
   "home": "BKN",
   "away": "IND",
   "pOurs": 0.4171,
   "marginOurs": -2.62,
   "totalOurs": 228.2,
   "pOursPre": 0.4361,
   "marginOursPre": -2.01,
   "totalOursPre": 228.2,
   "pFriend": null,
   "pMarket": 0.3425,
   "mlHome": 180,
   "mlAway": -218,
   "spreadHome": 5.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": 180,
    "mlAway": -218,
    "spreadHome": 5.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 109,
    "awayScore": 136
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_05_00PM.pdf",
    "reportAt": "2026-10-25T21:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "BKN Grant Nelson",
     "BKN Joshua Jefferson"
    ],
    "boxCutoff": "2026-10-25",
    "inputsHash": "32b2194aac540166",
    "rosterSizes": {
     "BKN": 18,
     "IND": 17
    }
   }
  },
  {
   "id": "401909863",
   "date": "2026-10-25",
   "tip": "2026-10-25T23:00Z",
   "home": "NY",
   "away": "ORL",
   "pOurs": 0.6412,
   "marginOurs": 4.52,
   "totalOurs": 225.2,
   "pOursPre": 0.5732,
   "marginOursPre": 2.31,
   "totalOursPre": 225.2,
   "pFriend": null,
   "pMarket": 0.7002,
   "mlHome": -270,
   "mlAway": 220,
   "spreadHome": -6.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": -310,
    "mlAway": 250,
    "spreadHome": -7.5,
    "total": 225.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 102,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_06_00PM.pdf",
    "reportAt": "2026-10-25T22:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ORL Mike Sharavjamts"
    ],
    "boxCutoff": "2026-10-25",
    "inputsHash": "0739eb5de83868c9",
    "rosterSizes": {
     "NY": 17,
     "ORL": 18
    }
   }
  },
  {
   "id": "401909864",
   "date": "2026-10-25",
   "tip": "2026-10-25T23:00Z",
   "home": "MIN",
   "away": "TOR",
   "pOurs": 0.5278,
   "marginOurs": 0.87,
   "totalOurs": 225.7,
   "pOursPre": 0.5062,
   "marginOursPre": 0.19,
   "totalOursPre": 225.7,
   "pFriend": null,
   "pMarket": 0.5996,
   "mlHome": -166,
   "mlAway": 140,
   "spreadHome": -3.5,
   "totalMarket": 228.5,
   "open": {
    "mlHome": -130,
    "mlAway": 110,
    "spreadHome": -2.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 117,
    "awayScore": 94
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_06_00PM.pdf",
    "reportAt": "2026-10-25T22:00:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIN Zyon Pullin",
     "MIN Rocco Zikarsky",
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn"
    ],
    "boxCutoff": "2026-10-25",
    "inputsHash": "91396ed1a71f10fe",
    "rosterSizes": {
     "MIN": 16,
     "TOR": 19
    }
   }
  },
  {
   "id": "401909865",
   "date": "2026-10-25",
   "tip": "2026-10-25T23:00Z",
   "home": "OKC",
   "away": "LAC",
   "pOurs": 0.8906,
   "marginOurs": 15.37,
   "totalOurs": 220.7,
   "pOursPre": 0.8776,
   "marginOursPre": 14.54,
   "totalOursPre": 220.7,
   "pFriend": null,
   "pMarket": 0.8934,
   "mlHome": -1350,
   "mlAway": 800,
   "spreadHome": -16.5,
   "totalMarket": 223.5,
   "open": {
    "mlHome": -950,
    "mlAway": 625,
    "spreadHome": -14.5,
    "total": 221.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 108,
    "awayScore": 101
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_06_00PM.pdf",
    "reportAt": "2026-10-25T22:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "OKC Josh Dix"
    ],
    "boxCutoff": "2026-10-25",
    "inputsHash": "100a923e778ef961",
    "rosterSizes": {
     "OKC": 17,
     "LAC": 18
    }
   }
  },
  {
   "id": "401909866",
   "date": "2026-10-25",
   "tip": "2026-10-25T23:30Z",
   "home": "PHI",
   "away": "DET",
   "pOurs": 0.5308,
   "marginOurs": 0.97,
   "totalOurs": 226.2,
   "pOursPre": 0.4976,
   "marginOursPre": -0.08,
   "totalOursPre": 226.2,
   "pFriend": null,
   "pMarket": 0.4573,
   "mlHome": 110,
   "mlAway": -130,
   "spreadHome": 1.5,
   "totalMarket": 228.5,
   "open": {
    "mlHome": -130,
    "mlAway": 110,
    "spreadHome": -2.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 93,
    "awayScore": 106
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_06_30PM.pdf",
    "reportAt": "2026-10-25T22:30:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-25",
    "inputsHash": "487537e11e3de8d2",
    "rosterSizes": {
     "PHI": 17,
     "DET": 18
    }
   }
  },
  {
   "id": "401909867",
   "date": "2026-10-25",
   "tip": "2026-10-26T01:00Z",
   "home": "SAC",
   "away": "MEM",
   "pOurs": 0.3906,
   "marginOurs": -3.47,
   "totalOurs": 232.3,
   "pOursPre": 0.3323,
   "marginOursPre": -5.42,
   "totalOursPre": 232.3,
   "pFriend": null,
   "pMarket": 0.3836,
   "mlHome": 150,
   "mlAway": -180,
   "spreadHome": 3.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": 136,
    "mlAway": -162,
    "spreadHome": 3.5,
    "total": 236.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 112,
    "awayScore": 123
   },
   "provenance": {
    "report": "Injury-Report_2026-10-25_08_00PM.pdf",
    "reportAt": "2026-10-26T00:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MEM Javon Small",
     "MEM Carson Cooper"
    ],
    "boxCutoff": "2026-10-25",
    "inputsHash": "633c6c578c0a2f92",
    "rosterSizes": {
     "SAC": 17,
     "MEM": 18
    }
   }
  },
  {
   "id": "401909868",
   "date": "2026-10-26",
   "tip": "2026-10-26T23:00Z",
   "home": "CHA",
   "away": "WSH",
   "pOurs": 0.6318,
   "marginOurs": 4.21,
   "totalOurs": 230.8,
   "pOursPre": 0.5954,
   "marginOursPre": 3.02,
   "totalOursPre": 230.8,
   "pFriend": null,
   "pMarket": 0.5635,
   "mlHome": -142,
   "mlAway": 120,
   "spreadHome": -2.5,
   "totalMarket": 225.5,
   "open": {
    "mlHome": -142,
    "mlAway": 120,
    "spreadHome": -2.5,
    "total": 228.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 110,
    "awayScore": 103
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_06_00PM.pdf",
    "reportAt": "2026-10-26T22:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CHA Michael Ajayi"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "7e82c5c8e0038e73",
    "rosterSizes": {
     "CHA": 18,
     "WSH": 18
    }
   }
  },
  {
   "id": "401909869",
   "date": "2026-10-26",
   "tip": "2026-10-26T23:00Z",
   "home": "CLE",
   "away": "MIN",
   "pOurs": 0.5947,
   "marginOurs": 2.99,
   "totalOurs": 231.1,
   "pOursPre": 0.5878,
   "marginOursPre": 2.77,
   "totalOursPre": 231.1,
   "pFriend": null,
   "pMarket": 0.583,
   "mlHome": -155,
   "mlAway": 130,
   "spreadHome": -3.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": -170,
    "mlAway": 142,
    "spreadHome": -4.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 127,
    "awayScore": 125
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_06_00PM.pdf",
    "reportAt": "2026-10-26T22:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CLE Curtis Jones",
     "CLE Kadary Richmond",
     "MIN Rocco Zikarsky"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "2fa460104fdd8df2",
    "rosterSizes": {
     "CLE": 19,
     "MIN": 16
    }
   }
  },
  {
   "id": "401909870",
   "date": "2026-10-26",
   "tip": "2026-10-26T23:30Z",
   "home": "BOS",
   "away": "CHI",
   "pOurs": 0.8492,
   "marginOurs": 12.91,
   "totalOurs": 230.3,
   "pOursPre": 0.8681,
   "marginOursPre": 13.97,
   "totalOursPre": 230.3,
   "pFriend": null,
   "pMarket": 0.8465,
   "mlHome": -750,
   "mlAway": 525,
   "spreadHome": -14.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": -850,
    "mlAway": 575,
    "spreadHome": -13.5,
    "total": 233.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 134,
    "awayScore": 99
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_06_30PM.pdf",
    "reportAt": "2026-10-26T22:30:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "BOS Amari Williams",
     "BOS Dillon Mitchell",
     "CHI Isaiah Stevens"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "20de028fbfad1c87",
    "rosterSizes": {
     "BOS": 17,
     "CHI": 18
    }
   }
  },
  {
   "id": "401909871",
   "date": "2026-10-26",
   "tip": "2026-10-26T23:30Z",
   "home": "MIA",
   "away": "DAL",
   "pOurs": 0.6614,
   "marginOurs": 5.2,
   "totalOurs": 233.2,
   "pOursPre": 0.6938,
   "marginOursPre": 6.33,
   "totalOursPre": 233.2,
   "pFriend": null,
   "pMarket": 0.7002,
   "mlHome": -270,
   "mlAway": 220,
   "spreadHome": -7.5,
   "totalMarket": 240.5,
   "open": {
    "mlHome": -290,
    "mlAway": 235,
    "spreadHome": -7.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 109,
    "awayScore": 113
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_06_30PM.pdf",
    "reportAt": "2026-10-26T22:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIA Keshad Johnson",
     "MIA Vladislav Goldin",
     "MIA Tre Donaldson",
     "DAL Quincy Acy"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "4da8517030a7cdaa",
    "rosterSizes": {
     "MIA": 17,
     "DAL": 19
    }
   }
  },
  {
   "id": "401909872",
   "date": "2026-10-26",
   "tip": "2026-10-27T00:00Z",
   "home": "MIL",
   "away": "IND",
   "pOurs": 0.4811,
   "marginOurs": -0.59,
   "totalOurs": 234,
   "pOursPre": 0.4486,
   "marginOursPre": -1.62,
   "totalOursPre": 234,
   "pFriend": null,
   "pMarket": 0.417,
   "mlHome": 130,
   "mlAway": -155,
   "spreadHome": 3.5,
   "totalMarket": 239.5,
   "open": {
    "mlHome": 145,
    "mlAway": -175,
    "spreadHome": 4.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 110,
    "awayScore": 102
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_07_00PM.pdf",
    "reportAt": "2026-10-26T23:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIL Pete Nance",
     "MIL Kam Jones",
     "MIL Cormac Ryan"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "0b0f29af45893858",
    "rosterSizes": {
     "MIL": 18,
     "IND": 17
    }
   }
  },
  {
   "id": "401909873",
   "date": "2026-10-26",
   "tip": "2026-10-27T00:00Z",
   "home": "OKC",
   "away": "PHX",
   "pOurs": 0.6982,
   "marginOurs": 6.49,
   "totalOurs": 218,
   "pOursPre": 0.6952,
   "marginOursPre": 6.38,
   "totalOursPre": 218,
   "pFriend": null,
   "pMarket": 0.7335,
   "mlHome": -325,
   "mlAway": 260,
   "spreadHome": -8.5,
   "totalMarket": 221.5,
   "open": {
    "mlHome": -380,
    "mlAway": 300,
    "spreadHome": -9.5,
    "total": 218.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 114
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_07_00PM.pdf",
    "reportAt": "2026-10-26T23:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "OKC Micah Peavy"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "0a6ac79b4b69ce04",
    "rosterSizes": {
     "OKC": 17,
     "PHX": 17
    }
   }
  },
  {
   "id": "401909874",
   "date": "2026-10-26",
   "tip": "2026-10-27T00:30Z",
   "home": "HOU",
   "away": "ATL",
   "pOurs": 0.6196,
   "marginOurs": 3.81,
   "totalOurs": 228.3,
   "pOursPre": 0.6298,
   "marginOursPre": 4.14,
   "totalOursPre": 228.2,
   "pFriend": null,
   "pMarket": 0.6309,
   "mlHome": -192,
   "mlAway": 160,
   "spreadHome": -4.5,
   "totalMarket": 228.5,
   "open": {
    "mlHome": -218,
    "mlAway": 180,
    "spreadHome": -5.5,
    "total": 229.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 110
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_07_30PM.pdf",
    "reportAt": "2026-10-26T23:30:00.000Z",
    "matched": 10,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ATL Cameron Corhen"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "e40fa520a51fb7d0",
    "rosterSizes": {
     "HOU": 17,
     "ATL": 19
    }
   }
  },
  {
   "id": "401909875",
   "date": "2026-10-26",
   "tip": "2026-10-27T01:00Z",
   "home": "UTAH",
   "away": "MEM",
   "pOurs": 0.4578,
   "marginOurs": -1.32,
   "totalOurs": 238.8,
   "pOursPre": 0.4488,
   "marginOursPre": -1.61,
   "totalOursPre": 238.8,
   "pFriend": null,
   "pMarket": 0.4957,
   "mlHome": -108,
   "mlAway": -112,
   "spreadHome": 1.5,
   "totalMarket": 237.5,
   "open": {
    "mlHome": -115,
    "mlAway": -105,
    "spreadHome": -1.5,
    "total": 237.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 105,
    "awayScore": 110
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_08_00PM.pdf",
    "reportAt": "2026-10-27T00:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MEM Javon Small"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "4ad99d679863102c",
    "rosterSizes": {
     "UTAH": 18,
     "MEM": 18
    }
   }
  },
  {
   "id": "401909876",
   "date": "2026-10-26",
   "tip": "2026-10-27T02:00Z",
   "home": "DEN",
   "away": "GS",
   "pOurs": 0.7518,
   "marginOurs": 8.5,
   "totalOurs": 234,
   "pOursPre": 0.7386,
   "marginOursPre": 7.99,
   "totalOursPre": 234,
   "pFriend": null,
   "pMarket": 0.7002,
   "mlHome": -270,
   "mlAway": 220,
   "spreadHome": -6.5,
   "totalMarket": 236.5,
   "open": {
    "mlHome": -290,
    "mlAway": 235,
    "spreadHome": -7.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 134
   },
   "provenance": {
    "report": "Injury-Report_2026-10-26_09_00PM.pdf",
    "reportAt": "2026-10-27T01:00:00.000Z",
    "matched": 10,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DEN Lonnie Walker IV",
     "DEN Steven Crowl"
    ],
    "boxCutoff": "2026-10-26",
    "inputsHash": "d4d1267841027c91",
    "rosterSizes": {
     "DEN": 19,
     "GS": 18
    }
   }
  },
  {
   "id": "401909877",
   "date": "2026-10-27",
   "tip": "2026-10-27T23:30Z",
   "home": "BOS",
   "away": "BKN",
   "pOurs": 0.8403,
   "marginOurs": 12.45,
   "totalOurs": 223.8,
   "pOursPre": 0.8567,
   "marginOursPre": 13.32,
   "totalOursPre": 223.8,
   "pFriend": null,
   "pMarket": 0.8465,
   "mlHome": -750,
   "mlAway": 525,
   "spreadHome": -13.5,
   "totalMarket": 223.5,
   "open": {
    "mlHome": -575,
    "mlAway": 425,
    "spreadHome": -11.5,
    "total": 222.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 124
   },
   "provenance": {
    "report": "Injury-Report_2026-10-27_06_30PM.pdf",
    "reportAt": "2026-10-27T22:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "BOS Amari Williams",
     "BOS Dillon Mitchell"
    ],
    "boxCutoff": "2026-10-27",
    "inputsHash": "fbc41de2032577c0",
    "rosterSizes": {
     "BOS": 17,
     "BKN": 18
    }
   }
  },
  {
   "id": "401909878",
   "date": "2026-10-27",
   "tip": "2026-10-28T00:00Z",
   "home": "NY",
   "away": "DET",
   "pOurs": 0.516,
   "marginOurs": 0.5,
   "totalOurs": 221,
   "pOursPre": 0.4519,
   "marginOursPre": -1.51,
   "totalOursPre": 221,
   "pFriend": null,
   "pMarket": 0.6092,
   "mlHome": -175,
   "mlAway": 145,
   "spreadHome": -4.5,
   "totalMarket": 220.5,
   "open": {
    "mlHome": -162,
    "mlAway": 136,
    "spreadHome": -3.5,
    "total": 218.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 111,
    "awayScore": 97
   },
   "provenance": {
    "report": "Injury-Report_2026-10-27_07_00PM.pdf",
    "reportAt": "2026-10-27T23:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NY Dalton Knecht",
     "NY Tyler Nickel"
    ],
    "boxCutoff": "2026-10-27",
    "inputsHash": "0bf2137379ac2fd1",
    "rosterSizes": {
     "NY": 17,
     "DET": 18
    }
   }
  },
  {
   "id": "401909879",
   "date": "2026-10-27",
   "tip": "2026-10-28T00:00Z",
   "home": "SA",
   "away": "SAC",
   "pOurs": 0.9205,
   "marginOurs": 17.61,
   "totalOurs": 231.1,
   "pOursPre": 0.9393,
   "marginOursPre": 19.36,
   "totalOursPre": 231.1,
   "pFriend": null,
   "pMarket": 0.9124,
   "mlHome": -1800,
   "mlAway": 1000,
   "spreadHome": -19.5,
   "totalMarket": 232.5,
   "open": {
    "mlHome": -1800,
    "mlAway": 1000,
    "spreadHome": -18.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 130,
    "awayScore": 103
   },
   "provenance": {
    "report": "Injury-Report_2026-10-27_07_00PM.pdf",
    "reportAt": "2026-10-27T23:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "SA David Jones Garcia",
     "SA Maliq Brown",
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor"
    ],
    "boxCutoff": "2026-10-27",
    "inputsHash": "c7e7eca67c122dd7",
    "rosterSizes": {
     "SA": 20,
     "SAC": 17
    }
   }
  },
  {
   "id": "401909880",
   "date": "2026-10-27",
   "tip": "2026-10-28T03:00Z",
   "home": "LAL",
   "away": "POR",
   "pOurs": 0.4995,
   "marginOurs": -0.02,
   "totalOurs": 233.3,
   "pOursPre": 0.4792,
   "marginOursPre": -0.65,
   "totalOursPre": 233.3,
   "pFriend": null,
   "pMarket": 0.5174,
   "mlHome": -118,
   "mlAway": -102,
   "spreadHome": -1.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": -142,
    "mlAway": 120,
    "spreadHome": -2.5,
    "total": 236.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 129,
    "awayScore": 136
   },
   "provenance": {
    "report": "Injury-Report_2026-10-27_10_00PM.pdf",
    "reportAt": "2026-10-28T02:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL AK Okereke",
     "LAL William Kyle III",
     "POR Jaylen Martin"
    ],
    "boxCutoff": "2026-10-27",
    "inputsHash": "3ac37a0684d9201b",
    "rosterSizes": {
     "LAL": 19,
     "POR": 18
    }
   }
  },
  {
   "id": "401909881",
   "date": "2026-10-28",
   "tip": "2026-10-28T23:00Z",
   "home": "ATL",
   "away": "MIA",
   "pOurs": 0.6567,
   "marginOurs": 5.04,
   "totalOurs": 233.7,
   "pOursPre": 0.6561,
   "marginOursPre": 5.02,
   "totalOursPre": 233.7,
   "pFriend": null,
   "pMarket": 0.5635,
   "mlHome": -142,
   "mlAway": 120,
   "spreadHome": -2.5,
   "totalMarket": 243.5,
   "open": {
    "mlHome": -162,
    "mlAway": 136,
    "spreadHome": -3.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 117,
    "awayScore": 129
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_06_00PM.pdf",
    "reportAt": "2026-10-28T22:00:00.000Z",
    "matched": 10,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ATL Cameron Corhen",
     "MIA Keshad Johnson",
     "MIA Vladislav Goldin",
     "MIA Tre Donaldson"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "e71df5dfdd90d53c",
    "rosterSizes": {
     "ATL": 19,
     "MIA": 17
    }
   }
  },
  {
   "id": "401909882",
   "date": "2026-10-28",
   "tip": "2026-10-28T23:00Z",
   "home": "CLE",
   "away": "WSH",
   "pOurs": 0.7591,
   "marginOurs": 8.79,
   "totalOurs": 237.2,
   "pOursPre": 0.7505,
   "marginOursPre": 8.45,
   "totalOursPre": 237.2,
   "pFriend": null,
   "pMarket": 0.7659,
   "mlHome": -395,
   "mlAway": 310,
   "spreadHome": -9.5,
   "totalMarket": 240.5,
   "open": {
    "mlHome": -380,
    "mlAway": 300,
    "spreadHome": -10.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 121,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_06_00PM.pdf",
    "reportAt": "2026-10-28T22:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CLE Curtis Jones",
     "CLE Kadary Richmond"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "559cc451ad065ec8",
    "rosterSizes": {
     "CLE": 19,
     "WSH": 18
    }
   }
  },
  {
   "id": "401909883",
   "date": "2026-10-28",
   "tip": "2026-10-28T23:00Z",
   "home": "DET",
   "away": "CHA",
   "pOurs": 0.6477,
   "marginOurs": 4.74,
   "totalOurs": 220,
   "pOursPre": 0.6947,
   "marginOursPre": 6.37,
   "totalOursPre": 220,
   "pFriend": null,
   "pMarket": 0.7136,
   "mlHome": -290,
   "mlAway": 235,
   "spreadHome": -7.5,
   "totalMarket": 212.5,
   "open": {
    "mlHome": -305,
    "mlAway": 245,
    "spreadHome": -7.5,
    "total": 216.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 97,
    "awayScore": 89
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_06_00PM.pdf",
    "reportAt": "2026-10-28T22:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-28",
    "inputsHash": "73b975cf2cb3e81e",
    "rosterSizes": {
     "DET": 18,
     "CHA": 18
    }
   }
  },
  {
   "id": "401909884",
   "date": "2026-10-28",
   "tip": "2026-10-28T23:00Z",
   "home": "IND",
   "away": "PHI",
   "pOurs": 0.2968,
   "marginOurs": -6.67,
   "totalOurs": 229.1,
   "pOursPre": 0.3154,
   "marginOursPre": -6.01,
   "totalOursPre": 229.1,
   "pFriend": null,
   "pMarket": 0.295,
   "mlHome": 225,
   "mlAway": -278,
   "spreadHome": 7.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": 105,
    "mlAway": -125,
    "spreadHome": 1.5,
    "total": 237.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 109,
    "awayScore": 114
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_06_00PM.pdf",
    "reportAt": "2026-10-28T22:00:00.000Z",
    "matched": 15,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-28",
    "inputsHash": "3b1b753552950868",
    "rosterSizes": {
     "IND": 17,
     "PHI": 17
    }
   }
  },
  {
   "id": "401909885",
   "date": "2026-10-28",
   "tip": "2026-10-28T23:30Z",
   "home": "TOR",
   "away": "ORL",
   "pOurs": 0.687,
   "marginOurs": 6.09,
   "totalOurs": 224.2,
   "pOursPre": 0.6841,
   "marginOursPre": 5.99,
   "totalOursPre": 224.2,
   "pFriend": null,
   "pMarket": 0.6309,
   "mlHome": -192,
   "mlAway": 160,
   "spreadHome": -5.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": -175,
    "mlAway": 145,
    "spreadHome": -4.5,
    "total": 223.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 129,
    "awayScore": 99
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_06_30PM.pdf",
    "reportAt": "2026-10-28T22:30:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn",
     "ORL Mike Sharavjamts"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "774cb902db8d66f5",
    "rosterSizes": {
     "TOR": 19,
     "ORL": 18
    }
   }
  },
  {
   "id": "401909886",
   "date": "2026-10-28",
   "tip": "2026-10-29T00:00Z",
   "home": "CHI",
   "away": "NY",
   "pOurs": 0.3498,
   "marginOurs": -4.82,
   "totalOurs": 228.8,
   "pOursPre": 0.4135,
   "marginOursPre": -2.73,
   "totalOursPre": 228.8,
   "pFriend": null,
   "pMarket": 0.295,
   "mlHome": 225,
   "mlAway": -278,
   "spreadHome": 7.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": 210,
    "mlAway": -258,
    "spreadHome": 7.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 127,
    "awayScore": 133
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_07_00PM.pdf",
    "reportAt": "2026-10-28T23:00:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CHI Isaiah Stevens",
     "NY Dalton Knecht",
     "NY Tyler Nickel"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "f8b6e1952fd04fb7",
    "rosterSizes": {
     "CHI": 18,
     "NY": 17
    }
   }
  },
  {
   "id": "401909887",
   "date": "2026-10-28",
   "tip": "2026-10-29T00:00Z",
   "home": "MIL",
   "away": "HOU",
   "pOurs": 0.3278,
   "marginOurs": -5.57,
   "totalOurs": 227.8,
   "pOursPre": 0.2836,
   "marginOursPre": -7.15,
   "totalOursPre": 227.8,
   "pFriend": null,
   "pMarket": 0.2591,
   "mlHome": 270,
   "mlAway": -340,
   "spreadHome": 8.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": 250,
    "mlAway": -310,
    "spreadHome": 8.5,
    "total": 227.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 100,
    "awayScore": 132
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_07_00PM.pdf",
    "reportAt": "2026-10-28T23:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIL Pete Nance",
     "MIL Kam Jones",
     "MIL Cormac Ryan",
     "HOU Oscar Tshiebwe"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "b6193bd3b5c0745a",
    "rosterSizes": {
     "MIL": 18,
     "HOU": 18
    }
   }
  },
  {
   "id": "401909888",
   "date": "2026-10-28",
   "tip": "2026-10-29T00:00Z",
   "home": "MIN",
   "away": "GS",
   "pOurs": 0.6037,
   "marginOurs": 3.29,
   "totalOurs": 228.2,
   "pOursPre": 0.5798,
   "marginOursPre": 2.52,
   "totalOursPre": 228.2,
   "pFriend": null,
   "pMarket": 0.583,
   "mlHome": -155,
   "mlAway": 130,
   "spreadHome": -3.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": -230,
    "mlAway": 190,
    "spreadHome": -6.5,
    "total": 227.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 119
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_07_00PM.pdf",
    "reportAt": "2026-10-28T23:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIN Rocco Zikarsky"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "9c21cbda7d98496e",
    "rosterSizes": {
     "MIN": 17,
     "GS": 18
    }
   }
  },
  {
   "id": "401909889",
   "date": "2026-10-28",
   "tip": "2026-10-29T00:00Z",
   "home": "NO",
   "away": "DEN",
   "pOurs": 0.3847,
   "marginOurs": -3.66,
   "totalOurs": 240,
   "pOursPre": 0.3817,
   "marginOursPre": -3.76,
   "totalOursPre": 240,
   "pFriend": null,
   "pMarket": 0.3836,
   "mlHome": 150,
   "mlAway": -180,
   "spreadHome": 4.5,
   "totalMarket": 241.5,
   "open": {
    "mlHome": 154,
    "mlAway": -185,
    "spreadHome": 4.5,
    "total": 238.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 91,
    "awayScore": 104
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_07_00PM.pdf",
    "reportAt": "2026-10-28T23:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NO Christian Koloko",
     "DEN Lonnie Walker IV",
     "DEN Steven Crowl"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "3835a33d02e887dc",
    "rosterSizes": {
     "NO": 19,
     "DEN": 19
    }
   }
  },
  {
   "id": "401909890",
   "date": "2026-10-28",
   "tip": "2026-10-29T01:00Z",
   "home": "UTAH",
   "away": "SA",
   "pOurs": 0.1862,
   "marginOurs": -11.15,
   "totalOurs": 236,
   "pOursPre": 0.1823,
   "marginOursPre": -11.33,
   "totalOursPre": 236,
   "pFriend": null,
   "pMarket": 0.1535,
   "mlHome": 525,
   "mlAway": -750,
   "spreadHome": 13.5,
   "totalMarket": 232.5,
   "open": {
    "mlHome": 425,
    "mlAway": -575,
    "spreadHome": 12.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 111,
    "awayScore": 117
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_08_00PM.pdf",
    "reportAt": "2026-10-29T00:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "SA David Jones Garcia",
     "SA Ja'Kobi Gillespie",
     "SA Maliq Brown",
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "c924033e0f259398",
    "rosterSizes": {
     "UTAH": 18,
     "SA": 20
    }
   }
  },
  {
   "id": "401909891",
   "date": "2026-10-28",
   "tip": "2026-10-29T01:30Z",
   "home": "DAL",
   "away": "OKC",
   "pOurs": 0.3371,
   "marginOurs": -5.25,
   "totalOurs": 220.8,
   "pOursPre": 0.3371,
   "marginOursPre": -5.25,
   "totalOursPre": 220.8,
   "pFriend": null,
   "pMarket": 0.3691,
   "mlHome": 160,
   "mlAway": -192,
   "spreadHome": 4.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": 170,
    "mlAway": -205,
    "spreadHome": 5.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 96
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_08_30PM.pdf",
    "reportAt": "2026-10-29T00:30:00.000Z",
    "matched": 14,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DAL Quincy Acy",
     "OKC Micah Peavy"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "e3dca5cffce0657a",
    "rosterSizes": {
     "DAL": 19,
     "OKC": 17
    }
   }
  },
  {
   "id": "401909892",
   "date": "2026-10-28",
   "tip": "2026-10-29T02:30Z",
   "home": "LAC",
   "away": "LAL",
   "pOurs": 0.5409,
   "marginOurs": 1.28,
   "totalOurs": 228.5,
   "pOursPre": 0.5597,
   "marginOursPre": 1.88,
   "totalOursPre": 228.5,
   "pFriend": null,
   "pMarket": 0.5043,
   "mlHome": -112,
   "mlAway": -108,
   "spreadHome": -1.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": 164,
    "mlAway": -198,
    "spreadHome": 5.5,
    "total": 228.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 87,
    "awayScore": 103
   },
   "provenance": {
    "report": "Injury-Report_2026-10-28_09_30PM.pdf",
    "reportAt": "2026-10-29T01:30:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL Chris Manon",
     "LAL AK Okereke",
     "LAL William Kyle III"
    ],
    "boxCutoff": "2026-10-28",
    "inputsHash": "c47b25c31a45b181",
    "rosterSizes": {
     "LAC": 18,
     "LAL": 19
    }
   }
  },
  {
   "id": "401909893",
   "date": "2026-10-29",
   "tip": "2026-10-30T00:00Z",
   "home": "ATL",
   "away": "CLE",
   "pOurs": 0.4858,
   "marginOurs": -0.44,
   "totalOurs": 234.4,
   "pOursPre": 0.5112,
   "marginOursPre": 0.35,
   "totalOursPre": 234.4,
   "pFriend": null,
   "pMarket": 0.5174,
   "mlHome": -118,
   "mlAway": -102,
   "spreadHome": -1.5,
   "totalMarket": 237.5,
   "open": {
    "mlHome": -110,
    "mlAway": -110,
    "spreadHome": -1.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-29_07_00PM.pdf",
    "reportAt": "2026-10-29T23:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ATL Cameron Corhen",
     "CLE Curtis Jones",
     "CLE Kadary Richmond"
    ],
    "boxCutoff": "2026-10-29",
    "inputsHash": "d392a69d08251ba7",
    "rosterSizes": {
     "ATL": 19,
     "CLE": 19
    }
   }
  },
  {
   "id": "401909894",
   "date": "2026-10-29",
   "tip": "2026-10-30T00:00Z",
   "home": "NO",
   "away": "SAC",
   "pOurs": 0.6524,
   "marginOurs": 4.9,
   "totalOurs": 234.2,
   "pOursPre": 0.6884,
   "marginOursPre": 6.14,
   "totalOursPre": 234.2,
   "pFriend": null,
   "pMarket": 0.675,
   "mlHome": -238,
   "mlAway": 195,
   "spreadHome": -6.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": -192,
    "mlAway": 160,
    "spreadHome": -5.5,
    "total": 237.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 132,
    "awayScore": 120
   },
   "provenance": {
    "report": "Injury-Report_2026-10-29_07_00PM.pdf",
    "reportAt": "2026-10-29T23:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NO Christian Koloko"
    ],
    "boxCutoff": "2026-10-29",
    "inputsHash": "f4ec518edde80db3",
    "rosterSizes": {
     "NO": 19,
     "SAC": 17
    }
   }
  },
  {
   "id": "401909895",
   "date": "2026-10-29",
   "tip": "2026-10-30T02:00Z",
   "home": "POR",
   "away": "MEM",
   "pOurs": 0.7308,
   "marginOurs": 7.69,
   "totalOurs": 232,
   "pOursPre": 0.7213,
   "marginOursPre": 7.34,
   "totalOursPre": 232,
   "pFriend": null,
   "pMarket": 0.7095,
   "mlHome": -285,
   "mlAway": 230,
   "spreadHome": -7.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": -285,
    "mlAway": 230,
    "spreadHome": -7.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 103,
    "awayScore": 124
   },
   "provenance": {
    "report": "Injury-Report_2026-10-29_09_00PM.pdf",
    "reportAt": "2026-10-30T01:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "POR Jaylen Martin"
    ],
    "boxCutoff": "2026-10-29",
    "inputsHash": "7e31bfb566831429",
    "rosterSizes": {
     "POR": 18,
     "MEM": 18
    }
   }
  },
  {
   "id": "401909277",
   "date": "2026-10-30",
   "tip": "2026-10-30T23:00Z",
   "home": "WSH",
   "away": "CHA",
   "pOurs": 0.47,
   "marginOurs": -0.94,
   "totalOurs": 227.3,
   "pOursPre": 0.5051,
   "marginOursPre": 0.16,
   "totalOursPre": 227.3,
   "pFriend": null,
   "pMarket": 0.4892,
   "mlHome": -105,
   "mlAway": -115,
   "spreadHome": 1.5,
   "totalMarket": 218.5,
   "open": {
    "mlHome": -105,
    "mlAway": -115,
    "spreadHome": 1.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 95,
    "awayScore": 79
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_06_00PM.pdf",
    "reportAt": "2026-10-30T22:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-30",
    "inputsHash": "486823f41ca364a1",
    "rosterSizes": {
     "WSH": 18,
     "CHA": 18
    }
   }
  },
  {
   "id": "401909278",
   "date": "2026-10-30",
   "tip": "2026-10-30T23:30Z",
   "home": "BOS",
   "away": "CHI",
   "pOurs": 0.8776,
   "marginOurs": 14.54,
   "totalOurs": 232.5,
   "pOursPre": 0.8926,
   "marginOursPre": 15.51,
   "totalOursPre": 232.6,
   "pFriend": null,
   "pMarket": 0.8525,
   "mlHome": -800,
   "mlAway": 550,
   "spreadHome": -14.5,
   "totalMarket": 236.5,
   "open": {
    "mlHome": -575,
    "mlAway": 425,
    "spreadHome": -11.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 125,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_06_30PM.pdf",
    "reportAt": "2026-10-30T22:30:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "BOS Amari Williams",
     "BOS Dillon Mitchell",
     "CHI Isaiah Stevens"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "4dabddb23039fec2",
    "rosterSizes": {
     "BOS": 17,
     "CHI": 18
    }
   }
  },
  {
   "id": "401909279",
   "date": "2026-10-30",
   "tip": "2026-10-30T23:30Z",
   "home": "BKN",
   "away": "DET",
   "pOurs": 0.2959,
   "marginOurs": -6.7,
   "totalOurs": 221.2,
   "pOursPre": 0.3027,
   "marginOursPre": -6.46,
   "totalOursPre": 221.2,
   "pFriend": null,
   "pMarket": 0.2742,
   "mlHome": 250,
   "mlAway": -310,
   "spreadHome": 8.5,
   "totalMarket": 222.5,
   "open": {
    "mlHome": 250,
    "mlAway": -310,
    "spreadHome": 7.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 94,
    "awayScore": 110
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_06_30PM.pdf",
    "reportAt": "2026-10-30T22:30:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-30",
    "inputsHash": "bbb2a51d45658263",
    "rosterSizes": {
     "BKN": 18,
     "DET": 18
    }
   }
  },
  {
   "id": "401909280",
   "date": "2026-10-30",
   "tip": "2026-10-30T23:30Z",
   "home": "PHI",
   "away": "NY",
   "pOurs": 0.6232,
   "marginOurs": 3.92,
   "totalOurs": 225.2,
   "pOursPre": 0.6506,
   "marginOursPre": 4.84,
   "totalOursPre": 225.2,
   "pFriend": null,
   "pMarket": 0.417,
   "mlHome": 130,
   "mlAway": -155,
   "spreadHome": 3.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": -125,
    "mlAway": 105,
    "spreadHome": -1.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 98,
    "awayScore": 93
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_06_30PM.pdf",
    "reportAt": "2026-10-30T22:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "PHI Caleb Love",
     "NY Dalton Knecht",
     "NY Tyler Nickel"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "75a59aba999f328e",
    "rosterSizes": {
     "PHI": 17,
     "NY": 17
    }
   }
  },
  {
   "id": "401909281",
   "date": "2026-10-30",
   "tip": "2026-10-30T23:30Z",
   "home": "TOR",
   "away": "ORL",
   "pOurs": 0.7518,
   "marginOurs": 8.5,
   "totalOurs": 224.2,
   "pOursPre": 0.7495,
   "marginOursPre": 8.41,
   "totalOursPre": 224.2,
   "pFriend": null,
   "pMarket": 0.6575,
   "mlHome": -218,
   "mlAway": 180,
   "spreadHome": -5.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": -155,
    "mlAway": 130,
    "spreadHome": -3.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 121
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_06_30PM.pdf",
    "reportAt": "2026-10-30T22:30:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn",
     "ORL Mike Sharavjamts"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "8c26aeb613a522ef",
    "rosterSizes": {
     "TOR": 19,
     "ORL": 18
    }
   }
  },
  {
   "id": "401909282",
   "date": "2026-10-30",
   "tip": "2026-10-31T00:00Z",
   "home": "MIA",
   "away": "IND",
   "pOurs": 0.7265,
   "marginOurs": 7.53,
   "totalOurs": 232.6,
   "pOursPre": 0.7352,
   "marginOursPre": 7.86,
   "totalOursPre": 232.6,
   "pFriend": null,
   "pMarket": 0.7335,
   "mlHome": -325,
   "mlAway": 260,
   "spreadHome": -8.5,
   "totalMarket": 236.5,
   "open": {
    "mlHome": -155,
    "mlAway": 130,
    "spreadHome": 3.5,
    "total": 240.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 145,
    "awayScore": 125
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_07_00PM.pdf",
    "reportAt": "2026-10-30T23:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIA Keshad Johnson",
     "MIA Vladislav Goldin",
     "MIA Tre Donaldson"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "6cb1603d6f6f88ae",
    "rosterSizes": {
     "MIA": 17,
     "IND": 17
    }
   }
  },
  {
   "id": "401909283",
   "date": "2026-10-30",
   "tip": "2026-10-31T00:00Z",
   "home": "DAL",
   "away": "HOU",
   "pOurs": 0.4179,
   "marginOurs": -2.59,
   "totalOurs": 225.5,
   "pOursPre": 0.3782,
   "marginOursPre": -3.88,
   "totalOursPre": 225.5,
   "pFriend": null,
   "pMarket": 0.3631,
   "mlHome": 164,
   "mlAway": -198,
   "spreadHome": 5.5,
   "totalMarket": 223.5,
   "open": {
    "mlHome": 145,
    "mlAway": -175,
    "spreadHome": -4.5,
    "total": 225.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 116,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_07_00PM.pdf",
    "reportAt": "2026-10-30T23:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DAL Quincy Acy",
     "HOU Sean Pedulla"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "b31563567539e314",
    "rosterSizes": {
     "DAL": 19,
     "HOU": 18
    }
   }
  },
  {
   "id": "401909284",
   "date": "2026-10-30",
   "tip": "2026-10-31T00:00Z",
   "home": "MIN",
   "away": "LAC",
   "pOurs": 0.7268,
   "marginOurs": 7.54,
   "totalOurs": 222.2,
   "pOursPre": 0.7176,
   "marginOursPre": 7.2,
   "totalOursPre": 222.2,
   "pFriend": null,
   "pMarket": 0.6958,
   "mlHome": -265,
   "mlAway": 215,
   "spreadHome": -6.5,
   "totalMarket": 222.5,
   "open": {
    "mlHome": -360,
    "mlAway": 285,
    "spreadHome": -9.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 127,
    "awayScore": 101
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_07_00PM.pdf",
    "reportAt": "2026-10-30T23:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIN Zyon Pullin",
     "MIN Rocco Zikarsky",
     "MIN Enrique Freeman"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "68514222b72f91fd",
    "rosterSizes": {
     "MIN": 17,
     "LAC": 19
    }
   }
  },
  {
   "id": "401909285",
   "date": "2026-10-30",
   "tip": "2026-10-31T02:00Z",
   "home": "GS",
   "away": "LAL",
   "pOurs": 0.4431,
   "marginOurs": -1.79,
   "totalOurs": 232.8,
   "pOursPre": 0.4738,
   "marginOursPre": -0.82,
   "totalOursPre": 232.8,
   "pFriend": null,
   "pMarket": 0.4279,
   "mlHome": 124,
   "mlAway": -148,
   "spreadHome": 2.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": -105,
    "mlAway": -115,
    "spreadHome": 1.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 112,
    "awayScore": 95
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_09_00PM.pdf",
    "reportAt": "2026-10-31T01:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL Arthur Kaluma",
     "LAL William Kyle III"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "c3839cb4337b1628",
    "rosterSizes": {
     "GS": 18,
     "LAL": 19
    }
   }
  },
  {
   "id": "401909286",
   "date": "2026-10-30",
   "tip": "2026-10-31T02:00Z",
   "home": "PHX",
   "away": "DEN",
   "pOurs": 0.4542,
   "marginOurs": -1.44,
   "totalOurs": 230.3,
   "pOursPre": 0.4356,
   "marginOursPre": -2.03,
   "totalOursPre": 230.3,
   "pFriend": null,
   "pMarket": 0.3836,
   "mlHome": 150,
   "mlAway": -180,
   "spreadHome": 4.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": 114,
    "mlAway": -135,
    "spreadHome": 2.5,
    "total": 233.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 127
   },
   "provenance": {
    "report": "Injury-Report_2026-10-30_09_00PM.pdf",
    "reportAt": "2026-10-31T01:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "PHX Pat Spencer",
     "DEN Lonnie Walker IV",
     "DEN Steven Crowl"
    ],
    "boxCutoff": "2026-10-30",
    "inputsHash": "cf1b748fc3adc97b",
    "rosterSizes": {
     "PHX": 17,
     "DEN": 19
    }
   }
  },
  {
   "id": "401909896",
   "date": "2026-10-31",
   "tip": "2026-10-31T19:00Z",
   "home": "UTAH",
   "away": "POR",
   "pOurs": 0.2764,
   "marginOurs": -7.42,
   "totalOurs": 236.8,
   "pOursPre": 0.2784,
   "marginOursPre": -7.35,
   "totalOursPre": 236.8,
   "pFriend": null,
   "pMarket": 0.3092,
   "mlHome": 210,
   "mlAway": -258,
   "spreadHome": 6.5,
   "totalMarket": 232.5,
   "open": {
    "mlHome": 185,
    "mlAway": -225,
    "spreadHome": 6.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 90,
    "awayScore": 112
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_02_00PM.pdf",
    "reportAt": "2026-10-31T18:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "POR Jaylen Martin"
    ],
    "boxCutoff": "2026-10-31",
    "inputsHash": "cdbdbdb6670679ec",
    "rosterSizes": {
     "UTAH": 18,
     "POR": 18
    }
   }
  },
  {
   "id": "401909897",
   "date": "2026-10-31",
   "tip": "2026-10-31T22:00Z",
   "home": "CHA",
   "away": "PHI",
   "pOurs": 0.4522,
   "marginOurs": -1.5,
   "totalOurs": 217.8,
   "pOursPre": 0.433,
   "marginOursPre": -2.11,
   "totalOursPre": 217.8,
   "pFriend": null,
   "pMarket": 0.4826,
   "mlHome": -102,
   "mlAway": -118,
   "spreadHome": 1.5,
   "totalMarket": 211.5,
   "open": {
    "mlHome": 100,
    "mlAway": -120,
    "spreadHome": 1.5,
    "total": 216.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 104,
    "awayScore": 109
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_05_00PM.pdf",
    "reportAt": "2026-10-31T21:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-31",
    "inputsHash": "b7b3e8aa81935f36",
    "rosterSizes": {
     "CHA": 18,
     "PHI": 17
    }
   }
  },
  {
   "id": "401909898",
   "date": "2026-10-31",
   "tip": "2026-10-31T23:00Z",
   "home": "NO",
   "away": "ATL",
   "pOurs": 0.3948,
   "marginOurs": -3.34,
   "totalOurs": 234.6,
   "pOursPre": 0.3827,
   "marginOursPre": -3.73,
   "totalOursPre": 234.6,
   "pFriend": null,
   "pMarket": 0.3631,
   "mlHome": 164,
   "mlAway": -198,
   "spreadHome": 5.5,
   "totalMarket": 239.5,
   "open": {
    "mlHome": 130,
    "mlAway": -155,
    "spreadHome": 3.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 121,
    "awayScore": 99
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_06_00PM.pdf",
    "reportAt": "2026-10-31T22:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NO Christian Koloko",
     "ATL Cameron Corhen"
    ],
    "boxCutoff": "2026-10-31",
    "inputsHash": "cabea5ea84b86b80",
    "rosterSizes": {
     "NO": 19,
     "ATL": 19
    }
   }
  },
  {
   "id": "401909899",
   "date": "2026-10-31",
   "tip": "2026-11-01T00:00Z",
   "home": "MEM",
   "away": "SAC",
   "pOurs": 0.7905,
   "marginOurs": 10.1,
   "totalOurs": 232.2,
   "pOursPre": 0.8275,
   "marginOursPre": 11.8,
   "totalOursPre": 232.3,
   "pFriend": null,
   "pMarket": 0.718,
   "mlHome": -298,
   "mlAway": 240,
   "spreadHome": -7.5,
   "totalMarket": 229.5,
   "open": {
    "mlHome": -440,
    "mlAway": 340,
    "spreadHome": -10.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 136,
    "awayScore": 105
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_07_00PM.pdf",
    "reportAt": "2026-10-31T23:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-10-31",
    "inputsHash": "4ac847dc931bcdc4",
    "rosterSizes": {
     "MEM": 18,
     "SAC": 17
    }
   }
  },
  {
   "id": "401909900",
   "date": "2026-10-31",
   "tip": "2026-11-01T00:00Z",
   "home": "MIL",
   "away": "CLE",
   "pOurs": 0.3029,
   "marginOurs": -6.45,
   "totalOurs": 233.9,
   "pOursPre": 0.2895,
   "marginOursPre": -6.93,
   "totalOursPre": 233.9,
   "pFriend": null,
   "pMarket": 0.2864,
   "mlHome": 235,
   "mlAway": -290,
   "spreadHome": 8.5,
   "totalMarket": 234.5,
   "open": {
    "mlHome": 285,
    "mlAway": -360,
    "spreadHome": 9.5,
    "total": 236.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 111,
    "awayScore": 136
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_07_00PM.pdf",
    "reportAt": "2026-10-31T23:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIL Pete Nance",
     "MIL Kam Jones",
     "MIL Cormac Ryan",
     "CLE Tristan Enaruna",
     "CLE Curtis Jones",
     "CLE Kadary Richmond"
    ],
    "boxCutoff": "2026-10-31",
    "inputsHash": "c3b04851e4c90937",
    "rosterSizes": {
     "MIL": 18,
     "CLE": 19
    }
   }
  },
  {
   "id": "401909901",
   "date": "2026-10-31",
   "tip": "2026-11-01T00:00Z",
   "home": "SA",
   "away": "MIN",
   "pOurs": 0.8014,
   "marginOurs": 10.58,
   "totalOurs": 227.8,
   "pOursPre": 0.8143,
   "marginOursPre": 11.17,
   "totalOursPre": 227.8,
   "pFriend": null,
   "pMarket": 0.8173,
   "mlHome": -575,
   "mlAway": 425,
   "spreadHome": -12.5,
   "totalMarket": 230.5,
   "open": {
    "mlHome": -520,
    "mlAway": 390,
    "spreadHome": -11.5,
    "total": 227.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 121,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_07_00PM.pdf",
    "reportAt": "2026-10-31T23:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "SA Ja'Kobi Gillespie",
     "SA Maliq Brown",
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor",
     "MIN Rocco Zikarsky",
     "MIN Enrique Freeman"
    ],
    "boxCutoff": "2026-10-31",
    "inputsHash": "354a9e3ae938504b",
    "rosterSizes": {
     "SA": 20,
     "MIN": 17
    }
   }
  },
  {
   "id": "401909902",
   "date": "2026-10-31",
   "tip": "2026-11-01T00:30Z",
   "home": "HOU",
   "away": "OKC",
   "pOurs": 0.5363,
   "marginOurs": 1.14,
   "totalOurs": 219.1,
   "pOursPre": 0.5761,
   "marginOursPre": 2.4,
   "totalOursPre": 219.1,
   "pFriend": null,
   "pMarket": 0.5635,
   "mlHome": -142,
   "mlAway": 120,
   "spreadHome": -2.5,
   "totalMarket": 219.5,
   "open": {
    "mlHome": -166,
    "mlAway": 140,
    "spreadHome": -4.5,
    "total": 218.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 119,
    "awayScore": 98
   },
   "provenance": {
    "report": "Injury-Report_2026-10-31_07_30PM.pdf",
    "reportAt": "2026-10-31T23:30:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "HOU Sean Pedulla"
    ],
    "boxCutoff": "2026-10-31",
    "inputsHash": "f412309aa6943cb2",
    "rosterSizes": {
     "HOU": 17,
     "OKC": 17
    }
   }
  },
  {
   "id": "401909903",
   "date": "2026-11-01",
   "tip": "2026-11-01T20:30Z",
   "home": "ORL",
   "away": "BOS",
   "pOurs": 0.2994,
   "marginOurs": -6.58,
   "totalOurs": 227.1,
   "pOursPre": 0.2739,
   "marginOursPre": -7.51,
   "totalOursPre": 227.1,
   "pFriend": null,
   "pMarket": 0.2905,
   "mlHome": 230,
   "mlAway": -285,
   "spreadHome": 6.5,
   "totalMarket": 221.5,
   "open": {
    "mlHome": 210,
    "mlAway": -258,
    "spreadHome": 6.5,
    "total": 222.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 97,
    "awayScore": 108
   },
   "provenance": {
    "report": "Injury-Report_2026-11-01_02_30PM.pdf",
    "reportAt": "2026-11-01T19:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ORL Mike Sharavjamts",
     "BOS Amari Williams",
     "BOS Dillon Mitchell"
    ],
    "boxCutoff": "2026-11-01",
    "inputsHash": "9d4e4938f699a17e",
    "rosterSizes": {
     "ORL": 18,
     "BOS": 17
    }
   }
  },
  {
   "id": "401909904",
   "date": "2026-11-01",
   "tip": "2026-11-01T22:00Z",
   "home": "IND",
   "away": "BKN",
   "pOurs": 0.5506,
   "marginOurs": 1.59,
   "totalOurs": 228.3,
   "pOursPre": 0.5333,
   "marginOursPre": 1.05,
   "totalOursPre": 228.3,
   "pFriend": null,
   "pMarket": 0.583,
   "mlHome": -155,
   "mlAway": 130,
   "spreadHome": -3.5,
   "totalMarket": 230.5,
   "open": {
    "mlHome": -162,
    "mlAway": 136,
    "spreadHome": -4.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 90,
    "awayScore": 98
   },
   "provenance": {
    "report": "Injury-Report_2026-11-01_04_00PM.pdf",
    "reportAt": "2026-11-01T21:00:00.000Z",
    "matched": 13,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-11-01",
    "inputsHash": "390bb56322440f00",
    "rosterSizes": {
     "IND": 17,
     "BKN": 18
    }
   }
  },
  {
   "id": "401909905",
   "date": "2026-11-01",
   "tip": "2026-11-02T01:30Z",
   "home": "GS",
   "away": "LAC",
   "pOurs": 0.6357,
   "marginOurs": 4.34,
   "totalOurs": 222.6,
   "pOursPre": 0.6471,
   "marginOursPre": 4.72,
   "totalOursPre": 222.6,
   "pFriend": null,
   "pMarket": 0.5427,
   "mlHome": -130,
   "mlAway": 110,
   "spreadHome": -1.5,
   "totalMarket": 220.5,
   "open": {
    "mlHome": -130,
    "mlAway": 110,
    "spreadHome": -2.5,
    "total": 219.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 124,
    "awayScore": 112
   },
   "provenance": {
    "report": "Injury-Report_2026-11-01_07_30PM.pdf",
    "reportAt": "2026-11-02T00:30:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "GS Graham Ike"
    ],
    "boxCutoff": "2026-11-01",
    "inputsHash": "b214e5125c5ccb2a",
    "rosterSizes": {
     "GS": 18,
     "LAC": 19
    }
   }
  },
  {
   "id": "401909906",
   "date": "2026-11-01",
   "tip": "2026-11-02T02:00Z",
   "home": "LAL",
   "away": "TOR",
   "pOurs": 0.5473,
   "marginOurs": 1.49,
   "totalOurs": 228.4,
   "pOursPre": 0.5214,
   "marginOursPre": 0.67,
   "totalOursPre": 228.4,
   "pFriend": null,
   "pMarket": 0.6038,
   "mlHome": -170,
   "mlAway": 142,
   "spreadHome": -3.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": -175,
    "mlAway": 145,
    "spreadHome": -4.5,
    "total": 227.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 131,
    "awayScore": 125
   },
   "provenance": {
    "report": "Injury-Report_2026-11-01_08_00PM.pdf",
    "reportAt": "2026-11-02T01:00:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL Lawson Lovering",
     "LAL Arthur Kaluma",
     "LAL William Kyle III",
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn"
    ],
    "boxCutoff": "2026-11-01",
    "inputsHash": "02d49a2fadc739a3",
    "rosterSizes": {
     "LAL": 19,
     "TOR": 19
    }
   }
  },
  {
   "id": "401909907",
   "date": "2026-11-02",
   "tip": "2026-11-03T00:00Z",
   "home": "CLE",
   "away": "OKC",
   "pOurs": 0.6507,
   "marginOurs": 4.84,
   "totalOurs": 225.2,
   "pOursPre": 0.6572,
   "marginOursPre": 5.06,
   "totalOursPre": 225.2,
   "pFriend": null,
   "pMarket": 0.6092,
   "mlHome": -173,
   "mlAway": 146,
   "spreadHome": -4.5,
   "totalMarket": 229.5,
   "open": {
    "mlHome": -185,
    "mlAway": 154,
    "spreadHome": -4.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 112,
    "awayScore": 117
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_06_00PM.pdf",
    "reportAt": "2026-11-02T23:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CLE Curtis Jones",
     "CLE Kadary Richmond"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "6b315c732b898c09",
    "rosterSizes": {
     "CLE": 19,
     "OKC": 17
    }
   }
  },
  {
   "id": "401909908",
   "date": "2026-11-02",
   "tip": "2026-11-03T00:30Z",
   "home": "CHA",
   "away": "DET",
   "pOurs": 0.3264,
   "marginOurs": -5.62,
   "totalOurs": 214.4,
   "pOursPre": 0.2854,
   "marginOursPre": -7.08,
   "totalOursPre": 214.4,
   "pFriend": null,
   "pMarket": 0.337,
   "mlHome": 185,
   "mlAway": -223,
   "spreadHome": 5.5,
   "totalMarket": 209.5,
   "open": {
    "mlHome": 150,
    "mlAway": -180,
    "spreadHome": 4.5,
    "total": 208.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 91,
    "awayScore": 124
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_06_30PM.pdf",
    "reportAt": "2026-11-02T23:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-11-02",
    "inputsHash": "608e623f490894f0",
    "rosterSizes": {
     "CHA": 18,
     "DET": 18
    }
   }
  },
  {
   "id": "401909909",
   "date": "2026-11-02",
   "tip": "2026-11-03T00:30Z",
   "home": "IND",
   "away": "ATL",
   "pOurs": 0.2641,
   "marginOurs": -7.88,
   "totalOurs": 228.1,
   "pOursPre": 0.2565,
   "marginOursPre": -8.18,
   "totalOursPre": 228.2,
   "pFriend": null,
   "pMarket": 0.2088,
   "mlHome": 360,
   "mlAway": -467,
   "spreadHome": 10.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": 240,
    "mlAway": -298,
    "spreadHome": 7.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 104,
    "awayScore": 108
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_06_30PM.pdf",
    "reportAt": "2026-11-02T23:30:00.000Z",
    "matched": 17,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ATL Cameron Corhen"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "664c393fb4219edf",
    "rosterSizes": {
     "IND": 17,
     "ATL": 19
    }
   }
  },
  {
   "id": "401909910",
   "date": "2026-11-02",
   "tip": "2026-11-03T00:30Z",
   "home": "NY",
   "away": "BKN",
   "pOurs": 0.8293,
   "marginOurs": 11.89,
   "totalOurs": 220.8,
   "pOursPre": 0.7871,
   "marginOursPre": 9.95,
   "totalOursPre": 220.8,
   "pFriend": null,
   "pMarket": 0.8738,
   "mlHome": -1020,
   "mlAway": 660,
   "spreadHome": -14.5,
   "totalMarket": 218.5,
   "open": {
    "mlHome": -850,
    "mlAway": 575,
    "spreadHome": -14.5,
    "total": 222.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 103,
    "awayScore": 90
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_06_30PM.pdf",
    "reportAt": "2026-11-02T23:30:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NY Dalton Knecht",
     "NY Tyler Nickel"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "01e5ce61d475e54b",
    "rosterSizes": {
     "NY": 17,
     "BKN": 18
    }
   }
  },
  {
   "id": "401909911",
   "date": "2026-11-02",
   "tip": "2026-11-03T00:30Z",
   "home": "ORL",
   "away": "WSH",
   "pOurs": 0.5358,
   "marginOurs": 1.12,
   "totalOurs": 228.2,
   "pOursPre": 0.5534,
   "marginOursPre": 1.68,
   "totalOursPre": 228.2,
   "pFriend": null,
   "pMarket": 0.5824,
   "mlHome": -154,
   "mlAway": 130,
   "spreadHome": -2.5,
   "totalMarket": 224.5,
   "open": {
    "mlHome": -120,
    "mlAway": 100,
    "spreadHome": -1.5,
    "total": 226.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 94,
    "awayScore": 103
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_06_30PM.pdf",
    "reportAt": "2026-11-02T23:30:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ORL Mike Sharavjamts"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "9abf3d521fb11068",
    "rosterSizes": {
     "ORL": 18,
     "WSH": 18
    }
   }
  },
  {
   "id": "401909912",
   "date": "2026-11-02",
   "tip": "2026-11-03T00:30Z",
   "home": "PHI",
   "away": "CHI",
   "pOurs": 0.8219,
   "marginOurs": 11.53,
   "totalOurs": 230.7,
   "pOursPre": 0.7993,
   "marginOursPre": 10.49,
   "totalOursPre": 230.7,
   "pFriend": null,
   "pMarket": 0.8055,
   "mlHome": -518,
   "mlAway": 394,
   "spreadHome": -10.5,
   "totalMarket": 240.5,
   "open": {
    "mlHome": -650,
    "mlAway": 470,
    "spreadHome": -11.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 126,
    "awayScore": 107
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_06_30PM.pdf",
    "reportAt": "2026-11-02T23:30:00.000Z",
    "matched": 6,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CHI Isaiah Stevens"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "1ef0b0ad5341953c",
    "rosterSizes": {
     "PHI": 17,
     "CHI": 18
    }
   }
  },
  {
   "id": "401909913",
   "date": "2026-11-02",
   "tip": "2026-11-03T01:00Z",
   "home": "DAL",
   "away": "SAC",
   "pOurs": 0.7606,
   "marginOurs": 8.85,
   "totalOurs": 230.3,
   "pOursPre": 0.7746,
   "marginOursPre": 9.43,
   "totalOursPre": 230.3,
   "pFriend": null,
   "pMarket": 0.7184,
   "mlHome": -297,
   "mlAway": 241,
   "spreadHome": -7.5,
   "totalMarket": 232.5,
   "open": {
    "mlHome": -395,
    "mlAway": 310,
    "spreadHome": -9.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 100,
    "awayScore": 115
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_07_00PM.pdf",
    "reportAt": "2026-11-03T00:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DAL Quincy Acy"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "e8f1e2d8b121cc14",
    "rosterSizes": {
     "DAL": 19,
     "SAC": 17
    }
   }
  },
  {
   "id": "401909914",
   "date": "2026-11-02",
   "tip": "2026-11-03T01:00Z",
   "home": "MEM",
   "away": "NO",
   "pOurs": 0.6598,
   "marginOurs": 5.15,
   "totalOurs": 234,
   "pOursPre": 0.6747,
   "marginOursPre": 5.66,
   "totalOursPre": 234,
   "pFriend": null,
   "pMarket": 0.6545,
   "mlHome": -214,
   "mlAway": 178,
   "spreadHome": -5.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": -250,
    "mlAway": 205,
    "spreadHome": -6.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 134,
    "awayScore": 135
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_07_00PM.pdf",
    "reportAt": "2026-11-03T00:00:00.000Z",
    "matched": 9,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NO Christian Koloko"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "5c984d1a6cde44ec",
    "rosterSizes": {
     "MEM": 18,
     "NO": 19
    }
   }
  },
  {
   "id": "401909915",
   "date": "2026-11-02",
   "tip": "2026-11-03T01:00Z",
   "home": "MIN",
   "away": "MIL",
   "pOurs": 0.7379,
   "marginOurs": 7.96,
   "totalOurs": 229.1,
   "pOursPre": 0.7544,
   "marginOursPre": 8.6,
   "totalOursPre": 229.1,
   "pFriend": null,
   "pMarket": 0.7998,
   "mlHome": -497,
   "mlAway": 380,
   "spreadHome": -11.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": -345,
    "mlAway": 275,
    "spreadHome": -10.5,
    "total": 233.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 112,
    "awayScore": 100
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_07_00PM.pdf",
    "reportAt": "2026-11-03T00:00:00.000Z",
    "matched": 4,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIN Rocco Zikarsky",
     "MIN Enrique Freeman",
     "MIL Pete Nance",
     "MIL Kam Jones",
     "MIL Cormac Ryan"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "6c411962bfc02176",
    "rosterSizes": {
     "MIN": 17,
     "MIL": 18
    }
   }
  },
  {
   "id": "401909916",
   "date": "2026-11-02",
   "tip": "2026-11-03T01:30Z",
   "home": "HOU",
   "away": "BOS",
   "pOurs": 0.578,
   "marginOurs": 2.46,
   "totalOurs": 225.3,
   "pOursPre": 0.5561,
   "marginOursPre": 1.76,
   "totalOursPre": 225.3,
   "pFriend": null,
   "pMarket": 0.616,
   "mlHome": -179,
   "mlAway": 150,
   "spreadHome": -4.5,
   "totalMarket": 215.5,
   "open": {
    "mlHome": -185,
    "mlAway": 154,
    "spreadHome": -5.5,
    "total": 218.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 109,
    "awayScore": 93
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_07_30PM.pdf",
    "reportAt": "2026-11-03T00:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "HOU Sean Pedulla",
     "BOS Dillon Mitchell"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "a904b689f37b28f5",
    "rosterSizes": {
     "HOU": 17,
     "BOS": 17
    }
   }
  },
  {
   "id": "401909917",
   "date": "2026-11-02",
   "tip": "2026-11-03T01:30Z",
   "home": "SA",
   "away": "UTAH",
   "pOurs": 0.9051,
   "marginOurs": 16.39,
   "totalOurs": 234.2,
   "pOursPre": 0.9074,
   "marginOursPre": 16.56,
   "totalOursPre": 234.2,
   "pFriend": null,
   "pMarket": 0.8856,
   "mlHome": -1180,
   "mlAway": 740,
   "spreadHome": -16.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": -800,
    "mlAway": 550,
    "spreadHome": -15.5,
    "total": 229.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 119,
    "awayScore": 97
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_07_30PM.pdf",
    "reportAt": "2026-11-03T00:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "SA Ja'Kobi Gillespie",
     "SA Maliq Brown",
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "8e79d1dd6ad97a57",
    "rosterSizes": {
     "SA": 20,
     "UTAH": 18
    }
   }
  },
  {
   "id": "401909918",
   "date": "2026-11-02",
   "tip": "2026-11-03T02:00Z",
   "home": "DEN",
   "away": "POR",
   "pOurs": 0.526,
   "marginOurs": 0.82,
   "totalOurs": 234.1,
   "pOursPre": 0.5238,
   "marginOursPre": 0.75,
   "totalOursPre": 234.1,
   "pFriend": null,
   "pMarket": 0.6097,
   "mlHome": -174,
   "mlAway": 146,
   "spreadHome": -4.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": -162,
    "mlAway": 136,
    "spreadHome": -4.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 110,
    "awayScore": 118
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_08_00PM.pdf",
    "reportAt": "2026-11-03T01:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DEN Cam Whitmore",
     "DEN Lonnie Walker IV",
     "DEN Steven Crowl",
     "POR Jaylen Martin"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "dd7ceb6387f6bee2",
    "rosterSizes": {
     "DEN": 19,
     "POR": 18
    }
   }
  },
  {
   "id": "401909919",
   "date": "2026-11-02",
   "tip": "2026-11-03T03:00Z",
   "home": "GS",
   "away": "PHX",
   "pOurs": 0.5648,
   "marginOurs": 2.04,
   "totalOurs": 227.7,
   "pOursPre": 0.5958,
   "marginOursPre": 3.03,
   "totalOursPre": 227.7,
   "pFriend": null,
   "pMarket": 0.5534,
   "mlHome": -136,
   "mlAway": 115,
   "spreadHome": -2.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": -180,
    "mlAway": 150,
    "spreadHome": -4.5,
    "total": 227.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 116,
    "awayScore": 113
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_09_00PM.pdf",
    "reportAt": "2026-11-03T02:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "PHX Pat Spencer"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "71afe14f7a6cfa75",
    "rosterSizes": {
     "GS": 18,
     "PHX": 17
    }
   }
  },
  {
   "id": "401909920",
   "date": "2026-11-02",
   "tip": "2026-11-03T03:00Z",
   "home": "LAC",
   "away": "TOR",
   "pOurs": 0.3207,
   "marginOurs": -5.82,
   "totalOurs": 222,
   "pOursPre": 0.3137,
   "marginOursPre": -6.07,
   "totalOursPre": 222,
   "pFriend": null,
   "pMarket": 0.3321,
   "mlHome": 189,
   "mlAway": -229,
   "spreadHome": 6.5,
   "totalMarket": 220.5,
   "open": {
    "mlHome": 164,
    "mlAway": -198,
    "spreadHome": 5.5,
    "total": 220.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 118,
    "awayScore": 125
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_09_00PM.pdf",
    "reportAt": "2026-11-03T02:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "23104a40c7bc561d",
    "rosterSizes": {
     "LAC": 19,
     "TOR": 19
    }
   }
  },
  {
   "id": "401909921",
   "date": "2026-11-02",
   "tip": "2026-11-03T03:00Z",
   "home": "LAL",
   "away": "MIA",
   "pOurs": 0.5754,
   "marginOurs": 2.38,
   "totalOurs": 237.1,
   "pOursPre": 0.5503,
   "marginOursPre": 1.58,
   "totalOursPre": 237.1,
   "pFriend": null,
   "pMarket": 0.5427,
   "mlHome": -130,
   "mlAway": 110,
   "spreadHome": -1.5,
   "totalMarket": 237.5,
   "open": {
    "mlHome": -120,
    "mlAway": 100,
    "spreadHome": -1.5,
    "total": 239.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 138,
    "awayScore": 117
   },
   "provenance": {
    "report": "Injury-Report_2026-11-02_09_00PM.pdf",
    "reportAt": "2026-11-03T02:00:00.000Z",
    "matched": 5,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL Lawson Lovering",
     "LAL Chris Manon",
     "LAL Arthur Kaluma",
     "LAL William Kyle III",
     "MIA Keshad Johnson"
    ],
    "boxCutoff": "2026-11-02",
    "inputsHash": "08760bf7a268850a",
    "rosterSizes": {
     "LAL": 19,
     "MIA": 17
    }
   }
  },
  {
   "id": "401909922",
   "date": "2026-11-04",
   "tip": "2026-11-05T00:00Z",
   "home": "DET",
   "away": "PHI",
   "pOurs": 0.5793,
   "marginOurs": 2.5,
   "totalOurs": 219.2,
   "pOursPre": 0.6058,
   "marginOursPre": 3.36,
   "totalOursPre": 219.2,
   "pFriend": null,
   "pMarket": 0.5635,
   "mlHome": -142,
   "mlAway": 120,
   "spreadHome": -2.5,
   "totalMarket": 219.5,
   "open": {
    "mlHome": -119,
    "mlAway": 101,
    "spreadHome": -1.5,
    "total": 219.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 106,
    "awayScore": 112
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_06_00PM.pdf",
    "reportAt": "2026-11-04T23:00:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "PHI Caleb Love",
     "PHI Tacko Fall"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "f250d46051e1dffa",
    "rosterSizes": {
     "DET": 18,
     "PHI": 17
    }
   }
  },
  {
   "id": "401909923",
   "date": "2026-11-04",
   "tip": "2026-11-05T00:00Z",
   "home": "WSH",
   "away": "ATL",
   "pOurs": 0.4679,
   "marginOurs": -1.01,
   "totalOurs": 228.7,
   "pOursPre": 0.4543,
   "marginOursPre": -1.43,
   "totalOursPre": 228.7,
   "pFriend": null,
   "pMarket": 0.4634,
   "mlHome": 107,
   "mlAway": -127,
   "spreadHome": 1.5,
   "totalMarket": 229.5,
   "open": {
    "mlHome": 105,
    "mlAway": -124,
    "spreadHome": 1.5,
    "total": 234.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 105,
    "awayScore": 120
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_06_00PM.pdf",
    "reportAt": "2026-11-04T23:00:00.000Z",
    "matched": 14,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "ATL Cameron Corhen"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "d89d893cb04acc4c",
    "rosterSizes": {
     "WSH": 18,
     "ATL": 19
    }
   }
  },
  {
   "id": "401909924",
   "date": "2026-11-04",
   "tip": "2026-11-05T00:30Z",
   "home": "BOS",
   "away": "MIL",
   "pOurs": 0.845,
   "marginOurs": 12.69,
   "totalOurs": 226.9,
   "pOursPre": 0.881,
   "marginOursPre": 14.75,
   "totalOursPre": 226.9,
   "pFriend": null,
   "pMarket": 0.8167,
   "mlHome": -567,
   "mlAway": 424,
   "spreadHome": -12.5,
   "totalMarket": 222.5,
   "open": {
    "mlHome": -1000,
    "mlAway": 660,
    "spreadHome": -14.5,
    "total": 225.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 109,
    "awayScore": 102
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_06_30PM.pdf",
    "reportAt": "2026-11-04T23:30:00.000Z",
    "matched": 6,
    "unmatched": [
     "BOS Cenac Jr., Christopher (Available)"
    ],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIL Pete Nance",
     "MIL Cormac Ryan"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "78813878cf532e97",
    "rosterSizes": {
     "BOS": 17,
     "MIL": 18
    }
   }
  },
  {
   "id": "401909925",
   "date": "2026-11-04",
   "tip": "2026-11-05T00:30Z",
   "home": "BKN",
   "away": "CHA",
   "pOurs": 0.4231,
   "marginOurs": -2.43,
   "totalOurs": 216.9,
   "pOursPre": 0.4731,
   "marginOursPre": -0.84,
   "totalOursPre": 216.9,
   "pFriend": null,
   "pMarket": 0.3953,
   "mlHome": 143,
   "mlAway": -170,
   "spreadHome": 3.5,
   "totalMarket": 213.5,
   "open": {
    "mlHome": 115,
    "mlAway": -136,
    "spreadHome": 2.5,
    "total": 214.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 114,
    "awayScore": 104
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_06_30PM.pdf",
    "reportAt": "2026-11-04T23:30:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [],
    "boxCutoff": "2026-11-04",
    "inputsHash": "7a87289d8f1e68aa",
    "rosterSizes": {
     "BKN": 18,
     "CHA": 18
    }
   }
  },
  {
   "id": "401909926",
   "date": "2026-11-04",
   "tip": "2026-11-05T00:30Z",
   "home": "NY",
   "away": "CHI",
   "pOurs": 0.8023,
   "marginOurs": 10.62,
   "totalOurs": 228.3,
   "pOursPre": 0.7582,
   "marginOursPre": 8.76,
   "totalOursPre": 228.3,
   "pFriend": null,
   "pMarket": 0.8176,
   "mlHome": -570,
   "mlAway": 427,
   "spreadHome": -11.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": -640,
    "mlAway": 466,
    "spreadHome": -12.5,
    "total": 232.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 135,
    "awayScore": 105
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_06_30PM.pdf",
    "reportAt": "2026-11-04T23:30:00.000Z",
    "matched": 3,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NY Dalton Knecht",
     "NY Jaden Akins",
     "NY Tyler Nickel",
     "CHI Isaiah Stevens",
     "CHI Dailyn Swain"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "637bf32ba15cb67b",
    "rosterSizes": {
     "NY": 17,
     "CHI": 18
    }
   }
  },
  {
   "id": "401909927",
   "date": "2026-11-04",
   "tip": "2026-11-05T01:00Z",
   "home": "MEM",
   "away": "IND",
   "pOurs": 0.74,
   "marginOurs": 8.04,
   "totalOurs": 231.1,
   "pOursPre": 0.7501,
   "marginOursPre": 8.44,
   "totalOursPre": 231.1,
   "pFriend": null,
   "pMarket": 0.6677,
   "mlHome": -228,
   "mlAway": 189,
   "spreadHome": -5.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": -258,
    "mlAway": 212,
    "spreadHome": -6.5,
    "total": 230.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 103,
    "awayScore": 107
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_07_00PM.pdf",
    "reportAt": "2026-11-05T00:00:00.000Z",
    "matched": 12,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MEM Javon Small"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "c04bb063579646fd",
    "rosterSizes": {
     "MEM": 18,
     "IND": 17
    }
   }
  },
  {
   "id": "401909928",
   "date": "2026-11-04",
   "tip": "2026-11-05T01:00Z",
   "home": "NO",
   "away": "UTAH",
   "pOurs": 0.6701,
   "marginOurs": 5.5,
   "totalOurs": 237.6,
   "pOursPre": 0.663,
   "marginOursPre": 5.26,
   "totalOursPre": 237.6,
   "pFriend": null,
   "pMarket": 0.6415,
   "mlHome": -201,
   "mlAway": 168,
   "spreadHome": -5.5,
   "totalMarket": 231.5,
   "open": {
    "mlHome": -207,
    "mlAway": 172,
    "spreadHome": -5.5,
    "total": 235.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 120,
    "awayScore": 113
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_07_00PM.pdf",
    "reportAt": "2026-11-05T00:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "NO Christian Koloko"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "c3772b537305d752",
    "rosterSizes": {
     "NO": 19,
     "UTAH": 18
    }
   }
  },
  {
   "id": "401909929",
   "date": "2026-11-04",
   "tip": "2026-11-05T01:00Z",
   "home": "OKC",
   "away": "CLE",
   "pOurs": 0.4833,
   "marginOurs": -0.52,
   "totalOurs": 225.9,
   "pOursPre": 0.4763,
   "marginOursPre": -0.74,
   "totalOursPre": 225.9,
   "pFriend": null,
   "pMarket": 0.5928,
   "mlHome": -161,
   "mlAway": 136,
   "spreadHome": -3.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": -137,
    "mlAway": 116,
    "spreadHome": -2.5,
    "total": 227.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 124,
    "awayScore": 116
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_07_00PM.pdf",
    "reportAt": "2026-11-05T00:00:00.000Z",
    "matched": 11,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "CLE Curtis Jones",
     "CLE Kadary Richmond"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "3de5e1c97f18b9e7",
    "rosterSizes": {
     "OKC": 17,
     "CLE": 19
    }
   }
  },
  {
   "id": "401909930",
   "date": "2026-11-04",
   "tip": "2026-11-05T01:30Z",
   "home": "HOU",
   "away": "MIN",
   "pOurs": 0.6996,
   "marginOurs": 6.54,
   "totalOurs": 224.6,
   "pOursPre": 0.7211,
   "marginOursPre": 7.33,
   "totalOursPre": 224.6,
   "pFriend": null,
   "pMarket": 0.7063,
   "mlHome": -278,
   "mlAway": 227,
   "spreadHome": -7.5,
   "totalMarket": 219.5,
   "open": {
    "mlHome": -348,
    "mlAway": 279,
    "spreadHome": -8.5,
    "total": 223.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 107,
    "awayScore": 117
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_07_30PM.pdf",
    "reportAt": "2026-11-05T00:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "HOU Sean Pedulla"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "c558de851f6b7e92",
    "rosterSizes": {
     "HOU": 18,
     "MIN": 16
    }
   }
  },
  {
   "id": "401909931",
   "date": "2026-11-04",
   "tip": "2026-11-05T02:00Z",
   "home": "DEN",
   "away": "TOR",
   "pOurs": 0.5528,
   "marginOurs": 1.66,
   "totalOurs": 232.2,
   "pOursPre": 0.5434,
   "marginOursPre": 1.36,
   "totalOursPre": 232.2,
   "pFriend": null,
   "pMarket": 0.6305,
   "mlHome": -191,
   "mlAway": 160,
   "spreadHome": -4.5,
   "totalMarket": 230.5,
   "open": {
    "mlHome": -217,
    "mlAway": 180,
    "spreadHome": -5.5,
    "total": 231.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 128,
    "awayScore": 109
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_08_00PM.pdf",
    "reportAt": "2026-11-05T01:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "DEN Ryan Nembhard",
     "DEN Cam Whitmore",
     "DEN Lonnie Walker IV",
     "DEN Steven Crowl",
     "TOR Andre Jackson Jr.",
     "TOR Trey Jemison",
     "TOR Chucky Hepburn"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "fe7d9d5c83b53ab1",
    "rosterSizes": {
     "DEN": 19,
     "TOR": 19
    }
   }
  },
  {
   "id": "401909932",
   "date": "2026-11-04",
   "tip": "2026-11-05T02:00Z",
   "home": "PHX",
   "away": "POR",
   "pOurs": 0.3867,
   "marginOurs": -3.6,
   "totalOurs": 227.9,
   "pOursPre": 0.3681,
   "marginOursPre": -4.21,
   "totalOursPre": 227.9,
   "pFriend": null,
   "pMarket": 0.4279,
   "mlHome": 124,
   "mlAway": -148,
   "spreadHome": 2.5,
   "totalMarket": 227.5,
   "open": {
    "mlHome": 118,
    "mlAway": -140,
    "spreadHome": 3.5,
    "total": 228.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 119,
    "awayScore": 132
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_08_00PM.pdf",
    "reportAt": "2026-11-05T01:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "PHX Pat Spencer",
     "PHX Duop Reath",
     "POR Jaylen Martin"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "cfc83a0d3397ef61",
    "rosterSizes": {
     "PHX": 17,
     "POR": 18
    }
   }
  },
  {
   "id": "401909933",
   "date": "2026-11-04",
   "tip": "2026-11-05T02:30Z",
   "home": "SA",
   "away": "DAL",
   "pOurs": 0.8427,
   "marginOurs": 12.57,
   "totalOurs": 227.5,
   "pOursPre": 0.8604,
   "marginOursPre": 13.53,
   "totalOursPre": 227.5,
   "pFriend": null,
   "pMarket": 0.8277,
   "mlHome": -620,
   "mlAway": 458,
   "spreadHome": -12.5,
   "totalMarket": 226.5,
   "open": {
    "mlHome": 503,
    "mlAway": -700,
    "spreadHome": 12.5,
    "total": 229.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 112,
    "awayScore": 111
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_08_30PM.pdf",
    "reportAt": "2026-11-05T01:30:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "SA David Jones Garcia",
     "SA Ja'Kobi Gillespie",
     "SA Maliq Brown",
     "SA Jon Elmore",
     "SA RJ Davis",
     "SA Terry Taylor",
     "DAL Quincy Acy"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "c70fcc57ea1adccd",
    "rosterSizes": {
     "SA": 20,
     "DAL": 19
    }
   }
  },
  {
   "id": "401909934",
   "date": "2026-11-04",
   "tip": "2026-11-05T03:00Z",
   "home": "SAC",
   "away": "LAL",
   "pOurs": 0.2143,
   "marginOurs": -9.9,
   "totalOurs": 234.6,
   "pOursPre": 0.1979,
   "marginOursPre": -10.62,
   "totalOursPre": 234.6,
   "pFriend": null,
   "pMarket": 0.1684,
   "mlHome": 470,
   "mlAway": -650,
   "spreadHome": 12.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": 450,
    "mlAway": -610,
    "spreadHome": 11.5,
    "total": 238.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 103,
    "awayScore": 116
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_09_00PM.pdf",
    "reportAt": "2026-11-05T02:00:00.000Z",
    "matched": 8,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "LAL Chris Manon",
     "LAL Arthur Kaluma",
     "LAL William Kyle III"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "c68c26b0a44c63f6",
    "rosterSizes": {
     "SAC": 17,
     "LAL": 19
    }
   }
  },
  {
   "id": "401909935",
   "date": "2026-11-04",
   "tip": "2026-11-05T03:30Z",
   "home": "LAC",
   "away": "MIA",
   "pOurs": 0.3678,
   "marginOurs": -4.22,
   "totalOurs": 230.9,
   "pOursPre": 0.3606,
   "marginOursPre": -4.46,
   "totalOursPre": 230.9,
   "pFriend": null,
   "pMarket": 0.3432,
   "mlHome": 180,
   "mlAway": -216,
   "spreadHome": 6.5,
   "totalMarket": 233.5,
   "open": {
    "mlHome": 164,
    "mlAway": -196,
    "spreadHome": 4.5,
    "total": 233.5
   },
   "source": "replay",
   "engine": "2026-11-05.b2b2",
   "spec": "replay-5",
   "result": {
    "homeScore": 116,
    "awayScore": 117
   },
   "provenance": {
    "report": "Injury-Report_2026-11-04_09_30PM.pdf",
    "reportAt": "2026-11-05T02:30:00.000Z",
    "matched": 7,
    "unmatched": [],
    "notSubmitted": [],
    "unmatchedRisk": [],
    "inactive": [
     "MIA Keshad Johnson"
    ],
    "boxCutoff": "2026-11-04",
    "inputsHash": "4ad4329dcf6ccff6",
    "rosterSizes": {
     "LAC": 19,
     "MIA": 17
    }
   }
  }
 ]
};
