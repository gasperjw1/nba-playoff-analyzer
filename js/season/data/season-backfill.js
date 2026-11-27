// ============================================================
// SEASON BACKFILL — the days the daily record did not run (Nov 19–25)
// ============================================================
// Written by a one-off script on 2026-11-26. Reconstructed AFTER the games,
// from the leak-free replay (replay-9) and DraftKings' close, with each
// night's tickets rebuilt by the frozen ticket code and graded. Shown on the
// results page tagged "Backfilled"; never counted in any live score, ticket
// record or tracker (those read season-ledger.js and the pitch ledgers only).
// Do not hand-edit.
// ============================================================
const SEASON_BACKFILL = {
 "note": "Reconstructed after the fact on 2026-11-26 for the days the daily record did not run. Display only: no live score, ticket record or tracker counts these rows.",
 "method": "Model: replay-9 (engine 2026-11-07.rotcap), box scores before the day and the official injury report 60+ minutes before tip. Price: DraftKings close, standing in for the record-time price. Tickets: the frozen pitch-1/pitch-2/pitch-3/flat-1 code on that slate, \"recorded\" one hour before the first tip. pWalk: Claude's day-by-day pick, written before each day's results were fetched (WALK_2026-11-19_25.md).",
 "generatedAt": "2026-11-26T22:01:00.241Z",
 "from": "2026-11-19",
 "to": "2026-11-25",
 "rows": [
  {
   "id": "401910019",
   "date": "2026-11-19",
   "tip": "2026-11-20T01:00Z",
   "home": "MEM",
   "away": "GS",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.6787,
   "marginOursClean": 5.8,
   "totalOurs": 228.6,
   "pOursReport": 0.6787,
   "pOursMorning": 0.6949,
   "pOursEve": 0.6648,
   "pMarket": 0.6456,
   "mlHome": -205,
   "mlAway": 171,
   "spreadHome": -5.5,
   "totalMarket": 225.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0066,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.68,
   "walkNote": "GS 0-4 without Curry, losing by 38/21/22 against closes near -5; now Green out too, both on B2B. Market moved 9 pts toward GS on MEM injuries (Edey, Jerome). Lean MEM above the close.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T00:00:00.000Z",
   "report": "Injury-Report_2026-11-19_07_00PM.pdf",
   "result": {
    "homeScore": 126,
    "awayScore": 98
   },
   "close": {
    "mlHome": -205,
    "mlAway": 171,
    "spreadHome": -5.5,
    "total": 225.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -334,
     "mlAway": 268,
     "spreadHome": -8.5,
     "total": 225.5
    }
   }
  },
  {
   "id": "401910020",
   "date": "2026-11-19",
   "tip": "2026-11-20T01:00Z",
   "home": "MIL",
   "away": "POR",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2672,
   "marginOursClean": -7.77,
   "totalOurs": 227.6,
   "pOursReport": 0.2672,
   "pOursMorning": 0.2445,
   "pOursEve": 0.2413,
   "pMarket": 0.2395,
   "mlHome": 301,
   "mlAway": -380,
   "spreadHome": 9.5,
   "totalMarket": 230.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0178,
    "driver": "absent",
    "rule": null
   },
   "pWalk": 0.25,
   "walkNote": "MIL 1-14 on a B2B without Kuzma and Turner; POR Avdija/Camara questionable. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T00:00:00.000Z",
   "report": "Injury-Report_2026-11-19_07_00PM.pdf",
   "result": {
    "homeScore": 114,
    "awayScore": 124
   },
   "close": {
    "mlHome": 301,
    "mlAway": -380,
    "spreadHome": 9.5,
    "total": 230.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 293,
     "mlAway": -369,
     "spreadHome": 9.5,
     "total": 225.5
    }
   }
  },
  {
   "id": "401910021",
   "date": "2026-11-19",
   "tip": "2026-11-20T01:00Z",
   "home": "MIN",
   "away": "NY",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.459,
   "marginOursClean": -1.29,
   "totalOurs": 219,
   "pOursReport": 0.459,
   "pOursMorning": 0.4587,
   "pOursEve": 0.4587,
   "pMarket": 0.49,
   "mlHome": -104,
   "mlAway": -113,
   "spreadHome": 1.5,
   "totalMarket": 216.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0105,
    "driver": null,
    "rule": null
   },
   "pWalk": 0.45,
   "walkNote": "MIN rating still carries Edwards' games (and a +39 vs DAL); Kuminga Q. NY rested, defence 2nd in East. Lean NY a little past the pick'em.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T00:00:00.000Z",
   "report": "Injury-Report_2026-11-19_07_00PM.pdf",
   "result": {
    "homeScore": 99,
    "awayScore": 102
   },
   "close": {
    "mlHome": -104,
    "mlAway": -113,
    "spreadHome": 1.5,
    "total": 216.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 104,
     "mlAway": -123,
     "spreadHome": 1.5,
     "total": 217.5
    }
   }
  },
  {
   "id": "401910022",
   "date": "2026-11-19",
   "tip": "2026-11-20T01:00Z",
   "home": "SA",
   "away": "LAC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.8863,
   "marginOursClean": 15.09,
   "totalOurs": 225.7,
   "pOursReport": 0.8863,
   "pOursMorning": 0.8863,
   "pOursEve": 0.8863,
   "pMarket": 0.8738,
   "mlHome": -1020,
   "mlAway": 660,
   "spreadHome": -15.5,
   "totalMarket": 224.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0179,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.87,
   "walkNote": "SA without Harper; LAC just lost by 25 to Utah. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T00:00:00.000Z",
   "report": "Injury-Report_2026-11-19_07_00PM.pdf",
   "result": {
    "homeScore": 124,
    "awayScore": 112
   },
   "close": {
    "mlHome": -1020,
    "mlAway": 660,
    "spreadHome": -15.5,
    "total": 224.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -1140,
     "mlAway": 720,
     "spreadHome": -16.5,
     "total": 225.5
    }
   }
  },
  {
   "id": "401909305",
   "date": "2026-11-20",
   "tip": "2026-11-21T00:00Z",
   "home": "ATL",
   "away": "CHA",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7783,
   "marginOursClean": 9.58,
   "totalOurs": 221.8,
   "pOursReport": 0.7783,
   "pOursMorning": 0.7771,
   "pOursEve": 0.7771,
   "pMarket": 0.6969,
   "mlHome": -264,
   "mlAway": 217,
   "spreadHome": -7.5,
   "totalMarket": 219.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.053,
    "driver": "change",
    "rule": "R2"
   },
   "pWalk": 0.72,
   "walkNote": "CHA without Allen, Schroder, G. Williams; ATL off a road win at OKC. Model 78, close 70; small lean ATL.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_06_00PM.pdf",
   "result": {
    "homeScore": 111,
    "awayScore": 97
   },
   "close": {
    "mlHome": -264,
    "mlAway": 217,
    "spreadHome": -7.5,
    "total": 219.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -212,
     "mlAway": 177,
     "spreadHome": -5.5,
     "total": 218.5
    }
   }
  },
  {
   "id": "401909306",
   "date": "2026-11-20",
   "tip": "2026-11-21T00:30Z",
   "home": "BKN",
   "away": "ORL",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.3633,
   "marginOursClean": -4.37,
   "totalOurs": 224.4,
   "pOursReport": 0.3633,
   "pOursMorning": 0.3633,
   "pOursEve": 0.3633,
   "pMarket": 0.3141,
   "mlHome": 206,
   "mlAway": -249,
   "spreadHome": 6.5,
   "totalMarket": 224.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0365,
    "driver": "absent",
    "rule": "AVOID"
   },
   "pWalk": 0.31,
   "walkNote": "BKN just lost by 30 at home to CHI; ORL 4-1 last five. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_06_30PM.pdf",
   "result": {
    "homeScore": 111,
    "awayScore": 113
   },
   "close": {
    "mlHome": 206,
    "mlAway": -249,
    "spreadHome": 6.5,
    "total": 224.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 168,
     "mlAway": -201,
     "spreadHome": 5.5,
     "total": 222.5
    }
   }
  },
  {
   "id": "401909307",
   "date": "2026-11-20",
   "tip": "2026-11-21T00:30Z",
   "home": "CLE",
   "away": "IND",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7653,
   "marginOursClean": 9.04,
   "totalOurs": 231.5,
   "pOursReport": 0.7653,
   "pOursMorning": 0.7569,
   "pOursEve": 0.7569,
   "pMarket": 0.681,
   "mlHome": -244,
   "mlAway": 201,
   "spreadHome": -6.5,
   "totalMarket": 235.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.056,
    "driver": "current",
    "rule": null
   },
   "pWalk": 0.69,
   "walkNote": "CLE without Mobley and Tyson, Watson Q; volatile with absences. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_06_30PM.pdf",
   "result": {
    "homeScore": 128,
    "awayScore": 119
   },
   "close": {
    "mlHome": -244,
    "mlAway": 201,
    "spreadHome": -6.5,
    "total": 235.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -246,
     "mlAway": 203,
     "spreadHome": -7.5,
     "total": 234.5
    }
   }
  },
  {
   "id": "401909308",
   "date": "2026-11-20",
   "tip": "2026-11-21T00:30Z",
   "home": "DET",
   "away": "TOR",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.6904,
   "marginOursClean": 6.21,
   "totalOurs": 221.1,
   "pOursReport": 0.6904,
   "pOursMorning": 0.6901,
   "pOursEve": 0.6901,
   "pMarket": 0.7061,
   "mlHome": -277,
   "mlAway": 227,
   "spreadHome": -6.5,
   "totalMarket": 215.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0038,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.72,
   "walkNote": "TOR 6 straight losses, without Barrett, Kawhi, Murray-Boyles; DET 5 of 6 and deep (won at NO without Cade). Slight DET.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_06_30PM.pdf",
   "result": {
    "homeScore": 102,
    "awayScore": 105
   },
   "close": {
    "mlHome": -277,
    "mlAway": 227,
    "spreadHome": -6.5,
    "total": 215.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -115,
     "mlAway": -105,
     "spreadHome": -1.5,
     "total": 227.5
    }
   }
  },
  {
   "id": "401909309",
   "date": "2026-11-20",
   "tip": "2026-11-21T01:00Z",
   "home": "CHI",
   "away": "WSH",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5957,
   "marginOursClean": 3.03,
   "totalOurs": 236.7,
   "pOursReport": 0.5957,
   "pOursMorning": 0.6282,
   "pOursEve": 0.6282,
   "pMarket": 0.5514,
   "mlHome": -135,
   "mlAway": 114,
   "spreadHome": -2.5,
   "totalMarket": 237.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0212,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.55,
   "walkNote": "Two bad defences; CHI hot from three (21 at BKN) but variance team. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_07_00PM.pdf",
   "result": {
    "homeScore": 94,
    "awayScore": 98
   },
   "close": {
    "mlHome": -135,
    "mlAway": 114,
    "spreadHome": -2.5,
    "total": 237.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -138,
     "mlAway": 117,
     "spreadHome": -2.5,
     "total": 240.5
    }
   }
  },
  {
   "id": "401909310",
   "date": "2026-11-20",
   "tip": "2026-11-21T01:00Z",
   "home": "OKC",
   "away": "NO",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7612,
   "marginOursClean": 8.88,
   "totalOurs": 227.3,
   "pOursReport": 0.7612,
   "pOursMorning": 0.7974,
   "pOursEve": 0.7974,
   "pMarket": 0.7947,
   "mlHome": -479,
   "mlAway": 368,
   "spreadHome": -11.5,
   "totalMarket": 229.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0251,
    "driver": "absent",
    "rule": null
   },
   "pWalk": 0.78,
   "walkNote": "OKC 1-4 last five, now Caruso out too; NO lost by 34 to BKN and 31 to MEM. Market, a hair under.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_07_00PM.pdf",
   "result": {
    "homeScore": 126,
    "awayScore": 120
   },
   "close": {
    "mlHome": -479,
    "mlAway": 368,
    "spreadHome": -11.5,
    "total": 229.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -499,
     "mlAway": 382,
     "spreadHome": -11.5,
     "total": 228.5
    }
   }
  },
  {
   "id": "401909311",
   "date": "2026-11-20",
   "tip": "2026-11-21T02:30Z",
   "home": "UTAH",
   "away": "PHX",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.3433,
   "marginOursClean": -5.04,
   "totalOurs": 229.1,
   "pOursReport": 0.3433,
   "pOursMorning": 0.3456,
   "pOursEve": 0.3456,
   "pMarket": 0.3691,
   "mlHome": 160,
   "mlAway": -192,
   "spreadHome": 4.5,
   "totalMarket": 226.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0008,
    "driver": "rest",
    "rule": null
   },
   "pWalk": 0.39,
   "walkNote": "Utah five-out without bigs has just won at LAC by 25 and at LAL by 12; high-variance dog at home. Shade Utah 2 pts.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_08_30PM.pdf",
   "result": {
    "homeScore": 101,
    "awayScore": 111
   },
   "close": {
    "mlHome": 160,
    "mlAway": -192,
    "spreadHome": 4.5,
    "total": 226.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 151,
     "mlAway": -180,
     "spreadHome": 4.5,
     "total": 226.5
    }
   }
  },
  {
   "id": "401909312",
   "date": "2026-11-20",
   "tip": "2026-11-21T03:00Z",
   "home": "DEN",
   "away": "HOU",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.4798,
   "marginOursClean": -0.63,
   "totalOurs": 231.3,
   "pOursReport": 0.4798,
   "pOursMorning": 0.534,
   "pOursEve": 0.534,
   "pMarket": 0.4748,
   "mlHome": 102,
   "mlAway": -121,
   "spreadHome": 1.5,
   "totalMarket": 227.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0152,
    "driver": "change",
    "rule": null
   },
   "pWalk": 0.475,
   "walkNote": "Line moved 10 pts to HOU for reasons the card doesn't show (Sengun took a face hit 11-18 yet the move went toward HOU). Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_09_00PM.pdf",
   "result": {
    "homeScore": 133,
    "awayScore": 124
   },
   "close": {
    "mlHome": 102,
    "mlAway": -121,
    "spreadHome": 1.5,
    "total": 227.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -148,
     "mlAway": 124,
     "spreadHome": -3.5,
     "total": 227.5
    }
   }
  },
  {
   "id": "401909313",
   "date": "2026-11-20",
   "tip": "2026-11-21T03:00Z",
   "home": "LAL",
   "away": "SAC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.8927,
   "marginOursClean": 15.52,
   "totalOurs": 234,
   "pOursReport": 0.8927,
   "pOursMorning": 0.8939,
   "pOursEve": 0.8939,
   "pMarket": 0.8587,
   "mlHome": -840,
   "mlAway": 580,
   "spreadHome": -14.5,
   "totalMarket": 229.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0009,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.86,
   "walkNote": "LAL off the Utah loss (Doncic 9 TOs); SAC 1-13 without Achiuwa. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "report": "Injury-Report_2026-11-20_09_00PM.pdf",
   "result": {
    "homeScore": 106,
    "awayScore": 104
   },
   "close": {
    "mlHome": -840,
    "mlAway": 580,
    "spreadHome": -14.5,
    "total": 229.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -1040,
     "mlAway": 670,
     "spreadHome": -14.5,
     "total": 230.5
    }
   }
  },
  {
   "id": "401910023",
   "date": "2026-11-21",
   "tip": "2026-11-21T18:00Z",
   "home": "PHI",
   "away": "MIL",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.8264,
   "marginOursClean": 11.75,
   "totalOurs": 227.9,
   "pOursReport": 0.8264,
   "pOursMorning": 0.8264,
   "pOursEve": 0.8264,
   "pMarket": 0.827,
   "mlHome": -620,
   "mlAway": 455,
   "spreadHome": -11.5,
   "totalMarket": 231.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0066,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.82,
   "walkNote": "PHI without Brown and Wade, Maxey Q, but just won at ORL without Maxey and Brown; MIL 1-15. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "report": "Injury-Report_2026-11-21_12_00PM.pdf",
   "result": {
    "homeScore": 132,
    "awayScore": 129
   },
   "close": {
    "mlHome": -620,
    "mlAway": 455,
    "spreadHome": -11.5,
    "total": 231.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -446,
     "mlAway": 346,
     "spreadHome": -11.5,
     "total": 228.5
    }
   }
  },
  {
   "id": "401910024",
   "date": "2026-11-21",
   "tip": "2026-11-22T00:30Z",
   "home": "NY",
   "away": "POR",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.4806,
   "marginOursClean": -0.61,
   "totalOurs": 220.8,
   "pOursReport": 0.4806,
   "pOursMorning": 0.6298,
   "pOursEve": 0.6298,
   "pMarket": 0.4748,
   "mlHome": 102,
   "mlAway": -121,
   "spreadHome": 1.5,
   "totalMarket": 213.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0144,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.47,
   "walkNote": "NY without Towns and Anunoby; line moved 17 pts. POR 10-5 and Avdija not listed. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "report": "Injury-Report_2026-11-21_06_30PM.pdf",
   "result": {
    "homeScore": 97,
    "awayScore": 96
   },
   "close": {
    "mlHome": 102,
    "mlAway": -121,
    "spreadHome": 1.5,
    "total": 213.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -201,
     "mlAway": 168,
     "spreadHome": -5.5,
     "total": 218.5
    }
   }
  },
  {
   "id": "401910025",
   "date": "2026-11-21",
   "tip": "2026-11-22T01:00Z",
   "home": "DAL",
   "away": "LAC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7033,
   "marginOursClean": 6.67,
   "totalOurs": 227,
   "pOursReport": 0.7033,
   "pOursMorning": 0.7047,
   "pOursEve": 0.7047,
   "pMarket": 0.6305,
   "mlHome": -191,
   "mlAway": 160,
   "spreadHome": -4.5,
   "totalMarket": 230.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0469,
    "driver": "current",
    "rule": null
   },
   "pWalk": 0.65,
   "walkNote": "DAL without P.J. Washington; LAC 4-10, lost the glass to everyone. Model 70, close 63; lean DAL 2.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "report": "Injury-Report_2026-11-21_07_00PM.pdf",
   "result": {
    "homeScore": 110,
    "awayScore": 100
   },
   "close": {
    "mlHome": -191,
    "mlAway": 160,
    "spreadHome": -4.5,
    "total": 230.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -201,
     "mlAway": 168,
     "spreadHome": -5.5,
     "total": 229.5
    }
   }
  },
  {
   "id": "401910026",
   "date": "2026-11-21",
   "tip": "2026-11-22T01:00Z",
   "home": "MIN",
   "away": "MEM",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5865,
   "marginOursClean": 2.73,
   "totalOurs": 227,
   "pOursReport": 0.5865,
   "pOursMorning": 0.5959,
   "pOursEve": 0.5959,
   "pMarket": 0.6583,
   "mlHome": -218,
   "mlAway": 181,
   "spreadHome": -5.5,
   "totalMarket": 227.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0576,
    "driver": "absent",
    "rule": "AVOID"
   },
   "pWalk": 0.62,
   "walkNote": "MEM without Boozer, Grant, Small, Jackson, Pippen but 9-0 on the road with real depth (8 in double figures some nights); MIN still without Edwards. Shade MEM 4 off the close.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "report": "Injury-Report_2026-11-21_07_00PM.pdf",
   "result": {
    "homeScore": 104,
    "awayScore": 95
   },
   "close": {
    "mlHome": -218,
    "mlAway": 181,
    "spreadHome": -5.5,
    "total": 227.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -191,
     "mlAway": 160,
     "spreadHome": -5.5,
     "total": 227.5
    }
   }
  },
  {
   "id": "401910027",
   "date": "2026-11-21",
   "tip": "2026-11-22T01:00Z",
   "home": "SA",
   "away": "NO",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.926,
   "marginOursClean": 18.08,
   "totalOurs": 231.7,
   "pOursReport": 0.926,
   "pOursMorning": 0.9005,
   "pOursEve": 0.9015,
   "pMarket": 0.9076,
   "mlHome": -1700,
   "mlAway": 940,
   "spreadHome": -19.5,
   "totalMarket": 226.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0184,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.91,
   "walkNote": "NO on a B2B without Murphy, Murray, Mathurin; SA rested. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "report": "Injury-Report_2026-11-21_07_00PM.pdf",
   "result": {
    "homeScore": 114,
    "awayScore": 91
   },
   "close": {
    "mlHome": -1700,
    "mlAway": 940,
    "spreadHome": -19.5,
    "total": 226.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -1440,
     "mlAway": 850,
     "spreadHome": -16.5,
     "total": 226.5
    }
   }
  },
  {
   "id": "401910028",
   "date": "2026-11-21",
   "tip": "2026-11-22T03:00Z",
   "home": "SAC",
   "away": "BOS",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.1487,
   "marginOursClean": -13.02,
   "totalOurs": 222.5,
   "pOursReport": 0.1487,
   "pOursMorning": 0.0935,
   "pOursEve": 0.0899,
   "pMarket": 0.1736,
   "mlHome": 453,
   "mlAway": -620,
   "spreadHome": 12.5,
   "totalMarket": 217.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0098,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.17,
   "walkNote": "BOS without Tatum, White, Robinson; SAC on a B2B, 0-9 at home. Depth lesson says BOS absorbs. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "report": "Injury-Report_2026-11-21_09_00PM.pdf",
   "result": {
    "homeScore": 97,
    "awayScore": 96
   },
   "close": {
    "mlHome": 453,
    "mlAway": -620,
    "spreadHome": 12.5,
    "total": 217.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 359,
     "mlAway": -465,
     "spreadHome": 12.5,
     "total": 217.5
    }
   }
  },
  {
   "id": "401910029",
   "date": "2026-11-22",
   "tip": "2026-11-22T20:30Z",
   "home": "ATL",
   "away": "DET",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.4815,
   "marginOursClean": -0.58,
   "totalOurs": 225,
   "pOursReport": 0.4815,
   "pOursMorning": 0.4831,
   "pOursEve": 0.4831,
   "pMarket": 0.4486,
   "mlHome": 114,
   "mlAway": -135,
   "spreadHome": 2.5,
   "totalMarket": 224.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0142,
    "driver": "absent",
    "rule": null
   },
   "pWalk": 0.45,
   "walkNote": "Cade back for DET; ATL three straight wins without McCollum. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_02_30PM.pdf",
   "result": {
    "homeScore": 107,
    "awayScore": 97
   },
   "close": {
    "mlHome": 114,
    "mlAway": -135,
    "spreadHome": 2.5,
    "total": 224.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 101,
     "mlAway": -120,
     "spreadHome": 1.5,
     "total": 227.5
    }
   }
  },
  {
   "id": "401910030",
   "date": "2026-11-22",
   "tip": "2026-11-22T23:00Z",
   "home": "MIA",
   "away": "OKC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.6058,
   "marginOursClean": 3.36,
   "totalOurs": 223.1,
   "pOursReport": 0.6058,
   "pOursMorning": 0.5798,
   "pOursEve": 0.5798,
   "pMarket": 0.622,
   "mlHome": -184,
   "mlAway": 154,
   "spreadHome": -4.5,
   "totalMarket": 225.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0005,
    "driver": "change",
    "rule": null
   },
   "pWalk": 0.63,
   "walkNote": "OKC without SGA plus five others; MIA without Giannis but six straight wins. Market, +1 MIA.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_05_00PM.pdf",
   "result": {
    "homeScore": 123,
    "awayScore": 113
   },
   "close": {
    "mlHome": -184,
    "mlAway": 154,
    "spreadHome": -4.5,
    "total": 225.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -139,
     "mlAway": 117,
     "spreadHome": -2.5,
     "total": 231.5
    }
   }
  },
  {
   "id": "401910031",
   "date": "2026-11-22",
   "tip": "2026-11-23T00:00Z",
   "home": "WSH",
   "away": "ORL",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.4084,
   "marginOursClean": -2.9,
   "totalOurs": 226.2,
   "pOursReport": 0.4084,
   "pOursMorning": 0.4084,
   "pOursEve": 0.4084,
   "pMarket": 0.3639,
   "mlHome": 164,
   "mlAway": -196,
   "spreadHome": 4.5,
   "totalMarket": 220.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0296,
    "driver": "absent",
    "rule": null
   },
   "pWalk": 0.38,
   "walkNote": "WSH 2 straight with Davis carrying (36, 25); ORL 4 of 5. Small WSH shade (model 41).",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_06_00PM.pdf",
   "result": {
    "homeScore": 116,
    "awayScore": 96
   },
   "close": {
    "mlHome": 164,
    "mlAway": -196,
    "spreadHome": 4.5,
    "total": 220.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 172,
     "mlAway": -206,
     "spreadHome": 5.5,
     "total": 222.5
    }
   }
  },
  {
   "id": "401910032",
   "date": "2026-11-22",
   "tip": "2026-11-23T00:00Z",
   "home": "CHI",
   "away": "DEN",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2215,
   "marginOursClean": -9.59,
   "totalOurs": 236.5,
   "pOursReport": 0.2215,
   "pOursMorning": 0.2547,
   "pOursEve": 0.2547,
   "pMarket": 0.2244,
   "mlHome": 328,
   "mlAway": -419,
   "spreadHome": 9.5,
   "totalMarket": 237.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0121,
    "driver": null,
    "rule": null
   },
   "pWalk": 0.22,
   "walkNote": "CHI without Powell, Claxton, Wilson. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_06_00PM.pdf",
   "result": {
    "homeScore": 145,
    "awayScore": 151
   },
   "close": {
    "mlHome": 328,
    "mlAway": -419,
    "spreadHome": 9.5,
    "total": 237.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 268,
     "mlAway": -333,
     "spreadHome": 8.5,
     "total": 237.5
    }
   }
  },
  {
   "id": "401910033",
   "date": "2026-11-22",
   "tip": "2026-11-23T00:00Z",
   "home": "UTAH",
   "away": "DAL",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.4284,
   "marginOursClean": -2.26,
   "totalOurs": 226.8,
   "pOursReport": 0.4284,
   "pOursMorning": 0.4284,
   "pOursEve": 0.4345,
   "pMarket": 0.4486,
   "mlHome": 114,
   "mlAway": -135,
   "spreadHome": 2.5,
   "totalMarket": 225.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0029,
    "driver": "absent",
    "rule": null
   },
   "pWalk": 0.45,
   "walkNote": "DAL on a B2B without Washington; Utah home, back to losing form. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_06_00PM.pdf",
   "result": {
    "homeScore": 114,
    "awayScore": 116
   },
   "close": {
    "mlHome": 114,
    "mlAway": -135,
    "spreadHome": 2.5,
    "total": 225.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 101,
     "mlAway": -119,
     "spreadHome": 1.5,
     "total": 225.5
    }
   }
  },
  {
   "id": "401910034",
   "date": "2026-11-22",
   "tip": "2026-11-23T01:00Z",
   "home": "NY",
   "away": "IND",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7106,
   "marginOursClean": 6.94,
   "totalOurs": 219.3,
   "pOursReport": 0.7106,
   "pOursMorning": 0.7001,
   "pOursEve": 0.7028,
   "pMarket": 0.6755,
   "mlHome": -237,
   "mlAway": 196,
   "spreadHome": -6.5,
   "totalMarket": 215.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0073,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.67,
   "walkNote": "Both depleted (NY: Anunoby, McBride out, Towns Q, B2B; IND: Haliburton, McConnell out, Siakam Q). Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_07_00PM.pdf",
   "result": {
    "homeScore": 113,
    "awayScore": 106
   },
   "close": {
    "mlHome": -237,
    "mlAway": 196,
    "spreadHome": -6.5,
    "total": 215.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -373,
     "mlAway": 296,
     "spreadHome": -9.5,
     "total": 217.5
    }
   }
  },
  {
   "id": "401910035",
   "date": "2026-11-22",
   "tip": "2026-11-23T01:30Z",
   "home": "GS",
   "away": "BOS",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2937,
   "marginOursClean": -6.78,
   "totalOurs": 220.2,
   "pOursReport": 0.2937,
   "pOursMorning": 0.3989,
   "pOursEve": 0.3982,
   "pMarket": 0.2596,
   "mlHome": 270,
   "mlAway": -336,
   "spreadHome": 8.5,
   "totalMarket": 211.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0234,
    "driver": "rest",
    "rule": null
   },
   "pWalk": 0.22,
   "walkNote": "GS without Curry has missed the close by 16-38 pts in five straight; now home but no Curry. BOS on a B2B without George, three straight losses. Keep the GS fade: BOS 4 over the close.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "report": "Injury-Report_2026-11-22_07_30PM.pdf",
   "result": {
    "homeScore": 88,
    "awayScore": 87
   },
   "close": {
    "mlHome": 270,
    "mlAway": -336,
    "spreadHome": 8.5,
    "total": 211.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 299,
     "mlAway": -378,
     "spreadHome": 8.5,
     "total": 212.5
    }
   }
  },
  {
   "id": "401910036",
   "date": "2026-11-23",
   "tip": "2026-11-24T00:00Z",
   "home": "CHA",
   "away": "MEM",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2705,
   "marginOursClean": -7.64,
   "totalOurs": 222.3,
   "pOursReport": 0.2705,
   "pOursMorning": 0.2682,
   "pOursEve": 0.2682,
   "pMarket": 0.4269,
   "mlHome": 125,
   "mlAway": -148,
   "spreadHome": 2.5,
   "totalMarket": 213.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.1327,
    "driver": "change",
    "rule": "R2"
   },
   "pWalk": 0.4,
   "walkNote": "Model has MEM 73% vs close 57%: the gap is last season's CHA rating vs this season's MEM form. MEM still without Boozer, Grant, Jackson, Pippen and just lost depleted at MIN. Engine-vs-close research says such gaps carry no info; shade 3 toward the model only.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_06_00PM.pdf",
   "result": {
    "homeScore": 111,
    "awayScore": 117
   },
   "close": {
    "mlHome": 125,
    "mlAway": -148,
    "spreadHome": 2.5,
    "total": 213.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 132,
     "mlAway": -157,
     "spreadHome": 3.5,
     "total": 218.5
    }
   }
  },
  {
   "id": "401910037",
   "date": "2026-11-23",
   "tip": "2026-11-24T00:00Z",
   "home": "PHI",
   "away": "POR",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5516,
   "marginOursClean": 1.62,
   "totalOurs": 228.2,
   "pOursReport": 0.5516,
   "pOursMorning": 0.6137,
   "pOursEve": 0.6137,
   "pMarket": 0.4978,
   "mlHome": -108,
   "mlAway": -110,
   "spreadHome": 1.5,
   "totalMarket": 230.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0324,
    "driver": "absent",
    "rule": "AVOID"
   },
   "pWalk": 0.5,
   "walkNote": "PHI without Embiid; pick'em. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_06_00PM.pdf",
   "result": {
    "homeScore": 111,
    "awayScore": 128
   },
   "close": {
    "mlHome": -108,
    "mlAway": -110,
    "spreadHome": 1.5,
    "total": 230.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -144,
     "mlAway": 121,
     "spreadHome": -2.5,
     "total": 228.5
    }
   }
  },
  {
   "id": "401910038",
   "date": "2026-11-23",
   "tip": "2026-11-24T00:30Z",
   "home": "IND",
   "away": "OKC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.3315,
   "marginOursClean": -5.45,
   "totalOurs": 221,
   "pOursReport": 0.3315,
   "pOursMorning": 0.5307,
   "pOursEve": 0.5583,
   "pMarket": 0.3695,
   "mlHome": 160,
   "mlAway": -191,
   "spreadHome": 4.5,
   "totalMarket": 226.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0121,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.37,
   "walkNote": "Both on B2Bs; SGA back; IND without Haliburton, McConnell, Nesmith, Siakam Q. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_06_30PM.pdf",
   "result": {
    "homeScore": 125,
    "awayScore": 120
   },
   "close": {
    "mlHome": 160,
    "mlAway": -191,
    "spreadHome": 4.5,
    "total": 226.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 161,
     "mlAway": -193,
     "spreadHome": 4.5,
     "total": 222.5
    }
   }
  },
  {
   "id": "401910039",
   "date": "2026-11-23",
   "tip": "2026-11-24T00:30Z",
   "home": "TOR",
   "away": "MIL",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.8059,
   "marginOursClean": 10.79,
   "totalOurs": 226.4,
   "pOursReport": 0.8059,
   "pOursMorning": 0.807,
   "pOursEve": 0.807,
   "pMarket": 0.7765,
   "mlHome": -421,
   "mlAway": 330,
   "spreadHome": -10.5,
   "totalMarket": 222.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0022,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.75,
   "walkNote": "MIL has lost its last four by 3-10 (covering); Herro 50 last time out. Shade MIL 3.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_06_30PM.pdf",
   "result": {
    "homeScore": 111,
    "awayScore": 116
   },
   "close": {
    "mlHome": -421,
    "mlAway": 330,
    "spreadHome": -10.5,
    "total": 222.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -479,
     "mlAway": 368,
     "spreadHome": -11.5,
     "total": 224.5
    }
   }
  },
  {
   "id": "401910040",
   "date": "2026-11-23",
   "tip": "2026-11-24T00:30Z",
   "home": "MIN",
   "away": "BKN",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.81,
   "marginOursClean": 10.98,
   "totalOurs": 222.5,
   "pOursReport": 0.81,
   "pOursMorning": 0.81,
   "pOursEve": 0.81,
   "pMarket": 0.8062,
   "mlHome": -521,
   "mlAway": 396,
   "spreadHome": -10.5,
   "totalMarket": 223.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0116,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.8,
   "walkNote": "Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_06_30PM.pdf",
   "result": {
    "homeScore": 142,
    "awayScore": 116
   },
   "close": {
    "mlHome": -521,
    "mlAway": 396,
    "spreadHome": -10.5,
    "total": 223.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -578,
     "mlAway": 431,
     "spreadHome": -11.5,
     "total": 225.5
    }
   }
  },
  {
   "id": "401910041",
   "date": "2026-11-23",
   "tip": "2026-11-24T01:00Z",
   "home": "CHI",
   "away": "CLE",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2727,
   "marginOursClean": -7.56,
   "totalOurs": 238.5,
   "pOursReport": 0.2727,
   "pOursMorning": 0.2475,
   "pOursEve": 0.2425,
   "pMarket": 0.2516,
   "mlHome": 282,
   "mlAway": -352,
   "spreadHome": 8.5,
   "totalMarket": 240.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0109,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.24,
   "walkNote": "CHI on a B2B after an OT 151-145; Powell, Wilson out. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_07_00PM.pdf",
   "result": {
    "homeScore": 122,
    "awayScore": 108
   },
   "close": {
    "mlHome": 282,
    "mlAway": -352,
    "spreadHome": 8.5,
    "total": 240.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 284,
     "mlAway": -356,
     "spreadHome": 9.5,
     "total": 241.5
    }
   }
  },
  {
   "id": "401910042",
   "date": "2026-11-23",
   "tip": "2026-11-24T01:00Z",
   "home": "NO",
   "away": "PHX",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.3963,
   "marginOursClean": -3.29,
   "totalOurs": 232.8,
   "pOursReport": 0.3963,
   "pOursMorning": 0.3908,
   "pOursEve": 0.3908,
   "pMarket": 0.416,
   "mlHome": 131,
   "mlAway": -155,
   "spreadHome": 3.5,
   "totalMarket": 232.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0041,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.41,
   "walkNote": "Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_07_00PM.pdf",
   "result": {
    "homeScore": 119,
    "awayScore": 123
   },
   "close": {
    "mlHome": 131,
    "mlAway": -155,
    "spreadHome": 3.5,
    "total": 232.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 125,
     "mlAway": -149,
     "spreadHome": 3.5,
     "total": 232.5
    }
   }
  },
  {
   "id": "401910043",
   "date": "2026-11-23",
   "tip": "2026-11-24T01:30Z",
   "home": "HOU",
   "away": "LAC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.8498,
   "marginOursClean": 12.95,
   "totalOurs": 228.5,
   "pOursReport": 0.8498,
   "pOursMorning": 0.8498,
   "pOursEve": 0.8498,
   "pMarket": 0.8409,
   "mlHome": -700,
   "mlAway": 504,
   "spreadHome": -13.5,
   "totalMarket": 222.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0154,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.84,
   "walkNote": "Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_07_30PM.pdf",
   "result": {
    "homeScore": 116,
    "awayScore": 104
   },
   "close": {
    "mlHome": -700,
    "mlAway": 504,
    "spreadHome": -13.5,
    "total": 222.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -610,
     "mlAway": 448,
     "spreadHome": -13.5,
     "total": 225.5
    }
   }
  },
  {
   "id": "401910044",
   "date": "2026-11-23",
   "tip": "2026-11-24T03:00Z",
   "home": "LAL",
   "away": "UTAH",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.8906,
   "marginOursClean": 15.37,
   "totalOurs": 232.2,
   "pOursReport": 0.8906,
   "pOursMorning": 0.8767,
   "pOursEve": 0.8734,
   "pMarket": 0.8475,
   "mlHome": -750,
   "mlAway": 530,
   "spreadHome": -13.5,
   "totalMarket": 224.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0082,
    "driver": "rest",
    "rule": null
   },
   "pWalk": 0.82,
   "walkNote": "LAL without Reaves has run under the close three straight and lost to Utah 11-18; Utah on a B2B without Hayes. Shade Utah 3.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_09_00PM.pdf",
   "result": {
    "homeScore": 109,
    "awayScore": 94
   },
   "close": {
    "mlHome": -750,
    "mlAway": 530,
    "spreadHome": -13.5,
    "total": 224.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -700,
     "mlAway": 501,
     "spreadHome": -12.5,
     "total": 230.5
    }
   }
  },
  {
   "id": "401910045",
   "date": "2026-11-23",
   "tip": "2026-11-24T03:00Z",
   "home": "SAC",
   "away": "SA",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2356,
   "marginOursClean": -9.01,
   "totalOurs": 221.9,
   "pOursReport": 0.2356,
   "pOursMorning": 0.1504,
   "pOursEve": 0.1504,
   "pMarket": 0.2751,
   "mlHome": 249,
   "mlAway": -308,
   "spreadHome": 8.5,
   "totalMarket": 222.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0095,
    "driver": "rest",
    "rule": null
   },
   "pWalk": 0.28,
   "walkNote": "SA without Wembanyama, Fox, Harper; SAC just beat BOS. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "report": "Injury-Report_2026-11-23_09_00PM.pdf",
   "result": {
    "homeScore": 107,
    "awayScore": 123
   },
   "close": {
    "mlHome": 249,
    "mlAway": -308,
    "spreadHome": 8.5,
    "total": 222.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 348,
     "mlAway": -448,
     "spreadHome": 10.5,
     "total": 224.5
    }
   }
  },
  {
   "id": "401909314",
   "date": "2026-11-24",
   "tip": "2026-11-25T00:00Z",
   "home": "ORL",
   "away": "DET",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.3927,
   "marginOursClean": -3.4,
   "totalOurs": 219.7,
   "pOursReport": 0.3927,
   "pOursMorning": 0.3927,
   "pOursEve": 0.3927,
   "pMarket": 0.5756,
   "mlHome": -150,
   "mlAway": 126,
   "spreadHome": -3.5,
   "totalMarket": 210.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.1648,
    "driver": "current",
    "rule": null
   },
   "pWalk": 0.57,
   "walkNote": "Line moved 11 pts to ORL after open for reasons the card can't see (likely a late DET absence; Cade's knee). Model 39 doesn't have it. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-24T23:00:00.000Z",
   "report": "Injury-Report_2026-11-24_06_00PM.pdf",
   "result": {
    "homeScore": 86,
    "awayScore": 104
   },
   "close": {
    "mlHome": -150,
    "mlAway": 126,
    "spreadHome": -3.5,
    "total": 210.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 106,
     "mlAway": -125,
     "spreadHome": 1.5,
     "total": 214.5
    }
   }
  },
  {
   "id": "401909315",
   "date": "2026-11-24",
   "tip": "2026-11-25T01:00Z",
   "home": "WSH",
   "away": "BOS",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.2104,
   "marginOursClean": -10.06,
   "totalOurs": 222.6,
   "pOursReport": 0.2104,
   "pOursMorning": 0.2104,
   "pOursEve": 0.2104,
   "pMarket": 0.2131,
   "mlHome": 351,
   "mlAway": -452,
   "spreadHome": 10.5,
   "totalMarket": 218.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0113,
    "driver": "rest",
    "rule": null
   },
   "pWalk": 0.22,
   "walkNote": "Line moved 15 pts to BOS; my WSH-with-Davis lean needs Davis, and a move that size suggests he or Young sits. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-24T23:00:00.000Z",
   "report": "Injury-Report_2026-11-24_07_00PM.pdf",
   "result": {
    "homeScore": 116,
    "awayScore": 131
   },
   "close": {
    "mlHome": 351,
    "mlAway": -452,
    "spreadHome": 10.5,
    "total": 218.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 164,
     "mlAway": -198,
     "spreadHome": 5.5,
     "total": 230.5
    }
   }
  },
  {
   "id": "401909316",
   "date": "2026-11-24",
   "tip": "2026-11-25T03:00Z",
   "home": "DEN",
   "away": "DAL",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7123,
   "marginOursClean": 7,
   "totalOurs": 232.3,
   "pOursReport": 0.7123,
   "pOursMorning": 0.7123,
   "pOursEve": 0.7123,
   "pMarket": 0.7061,
   "mlHome": -277,
   "mlAway": 227,
   "spreadHome": -7.5,
   "totalMarket": 234.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0181,
    "driver": "change",
    "rule": null
   },
   "pWalk": 0.7,
   "walkNote": "Washington questionable; DEN four straight. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-24T23:00:00.000Z",
   "report": "Injury-Report_2026-11-24_09_00PM.pdf",
   "result": {
    "homeScore": 101,
    "awayScore": 120
   },
   "close": {
    "mlHome": -277,
    "mlAway": 227,
    "spreadHome": -7.5,
    "total": 234.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -345,
     "mlAway": 275,
     "spreadHome": -8.5,
     "total": 236.5
    }
   }
  },
  {
   "id": "401909317",
   "date": "2026-11-25",
   "tip": "2026-11-25T22:00Z",
   "home": "PHI",
   "away": "MIA",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.6155,
   "marginOursClean": 3.67,
   "totalOurs": 235.2,
   "pOursReport": 0.6155,
   "pOursMorning": 0.6873,
   "pOursEve": 0.6873,
   "pMarket": 0.4989,
   "mlHome": -108,
   "mlAway": -109,
   "spreadHome": 1.5,
   "totalMarket": 237.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0963,
    "driver": "change",
    "rule": "R2"
   },
   "pWalk": 0.48,
   "walkNote": "PHI without Embiid, just lost by 17 to POR; MIA seven straight and Giannis not on the report. Lean MIA 2.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_04_00PM.pdf",
   "result": {
    "homeScore": 111,
    "awayScore": 104
   },
   "close": {
    "mlHome": -108,
    "mlAway": -109,
    "spreadHome": 1.5,
    "total": 237.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -162,
     "mlAway": 136,
     "spreadHome": -3.5,
     "total": 238.5
    }
   }
  },
  {
   "id": "401909318",
   "date": "2026-11-25",
   "tip": "2026-11-26T00:00Z",
   "home": "CHA",
   "away": "CHI",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5712,
   "marginOursClean": 2.24,
   "totalOurs": 225.1,
   "pOursReport": 0.5712,
   "pOursMorning": 0.5755,
   "pOursEve": 0.5755,
   "pMarket": 0.6174,
   "mlHome": -180,
   "mlAway": 151,
   "spreadHome": -4.5,
   "totalMarket": 217.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0304,
    "driver": "current",
    "rule": null
   },
   "pWalk": 0.61,
   "walkNote": "CHI without Powell, Smith, Wilson but the bench just beat CLE; CHA five straight losses. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_06_00PM.pdf",
   "result": {
    "homeScore": 105,
    "awayScore": 107
   },
   "close": {
    "mlHome": -180,
    "mlAway": 151,
    "spreadHome": -4.5,
    "total": 217.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -163,
     "mlAway": 137,
     "spreadHome": -3.5,
     "total": 222.5
    }
   }
  },
  {
   "id": "401909319",
   "date": "2026-11-25",
   "tip": "2026-11-26T00:30Z",
   "home": "NY",
   "away": "CLE",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.6069,
   "marginOursClean": 3.39,
   "totalOurs": 224.2,
   "pOursReport": 0.6069,
   "pOursMorning": 0.5783,
   "pOursEve": 0.5783,
   "pMarket": 0.6174,
   "mlHome": -180,
   "mlAway": 151,
   "spreadHome": -4.5,
   "totalMarket": 221.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0053,
    "driver": "change",
    "rule": null
   },
   "pWalk": 0.62,
   "walkNote": "NY five straight with Towns back; CLE without Mobley. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_06_30PM.pdf",
   "result": {
    "homeScore": 121,
    "awayScore": 102
   },
   "close": {
    "mlHome": -180,
    "mlAway": 151,
    "spreadHome": -4.5,
    "total": 221.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -224,
     "mlAway": 186,
     "spreadHome": -5.5,
     "total": 220.5
    }
   }
  },
  {
   "id": "401909320",
   "date": "2026-11-25",
   "tip": "2026-11-26T00:30Z",
   "home": "OKC",
   "away": "MIN",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5522,
   "marginOursClean": 1.64,
   "totalOurs": 218.9,
   "pOursReport": 0.5522,
   "pOursMorning": 0.5522,
   "pOursEve": 0.5522,
   "pMarket": 0.5514,
   "mlHome": -135,
   "mlAway": 114,
   "spreadHome": -2.5,
   "totalMarket": 223.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": -0.0195,
    "driver": "absent",
    "rule": null
   },
   "pWalk": 0.55,
   "walkNote": "SGA on, the rest of the rotation still out; DK open on the card is inconsistent (74% with +9.5), ignored. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_06_30PM.pdf",
   "result": {
    "homeScore": 106,
    "awayScore": 113
   },
   "close": {
    "mlHome": -135,
    "mlAway": 114,
    "spreadHome": -2.5,
    "total": 223.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -345,
     "mlAway": 275,
     "spreadHome": 9.5,
     "total": 232.5
    }
   }
  },
  {
   "id": "401909321",
   "date": "2026-11-25",
   "tip": "2026-11-26T01:00Z",
   "home": "MEM",
   "away": "LAC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7919,
   "marginOursClean": 10.16,
   "totalOurs": 230.4,
   "pOursReport": 0.7919,
   "pOursMorning": 0.7921,
   "pOursEve": 0.7921,
   "pMarket": 0.7,
   "mlHome": -269,
   "mlAway": 220,
   "spreadHome": -7.5,
   "totalMarket": 227.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0629,
    "driver": "change",
    "rule": "R2"
   },
   "pWalk": 0.72,
   "walkNote": "LAC 4-12 and has lost the glass and the game everywhere; MEM depleted but won at CHA with Jerome back. Model 79. Lean MEM 2.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_07_00PM.pdf",
   "result": {
    "homeScore": 115,
    "awayScore": 97
   },
   "close": {
    "mlHome": -269,
    "mlAway": 220,
    "spreadHome": -7.5,
    "total": 227.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -276,
     "mlAway": 226,
     "spreadHome": -6.5,
     "total": 229.5
    }
   }
  },
  {
   "id": "401909322",
   "date": "2026-11-25",
   "tip": "2026-11-26T01:00Z",
   "home": "MIL",
   "away": "BKN",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5385,
   "marginOursClean": 1.21,
   "totalOurs": 230.1,
   "pOursReport": 0.5385,
   "pOursMorning": 0.5385,
   "pOursEve": 0.5385,
   "pMarket": 0.5176,
   "mlHome": -117,
   "mlAway": -101,
   "spreadHome": -1.5,
   "totalMarket": 233.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": -0.0007,
    "driver": "aging",
    "rule": null
   },
   "pWalk": 0.56,
   "walkNote": "MIL with Herro, Turner and Kuzma just won at TOR after four close losses; BKN lost by 26 and 30 lately. Lean MIL 4 (notes: MIL better than 2-16).",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_07_00PM.pdf",
   "result": {
    "homeScore": 97,
    "awayScore": 104
   },
   "close": {
    "mlHome": -117,
    "mlAway": -101,
    "spreadHome": -1.5,
    "total": 233.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -119,
     "mlAway": 101,
     "spreadHome": -1.5,
     "total": 229.5
    }
   }
  },
  {
   "id": "401909323",
   "date": "2026-11-25",
   "tip": "2026-11-26T01:30Z",
   "home": "HOU",
   "away": "PHX",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7371,
   "marginOursClean": 7.93,
   "totalOurs": 228.2,
   "pOursReport": 0.7371,
   "pOursMorning": 0.7389,
   "pOursEve": 0.7389,
   "pMarket": 0.7598,
   "mlHome": -378,
   "mlAway": 300,
   "spreadHome": -8.5,
   "totalMarket": 222.5,
   "book": "DraftKings",
   "trust": {
    "side": "away",
    "edge": 0.0129,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.75,
   "walkNote": "PHX five straight on the trip; HOU at home. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_07_30PM.pdf",
   "result": {
    "homeScore": 116,
    "awayScore": 104
   },
   "close": {
    "mlHome": -378,
    "mlAway": 300,
    "spreadHome": -8.5,
    "total": 222.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -369,
     "mlAway": 294,
     "spreadHome": -10.5,
     "total": 223.5
    }
   }
  },
  {
   "id": "401909324",
   "date": "2026-11-25",
   "tip": "2026-11-26T03:00Z",
   "home": "GS",
   "away": "SAC",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.7678,
   "marginOursClean": 9.15,
   "totalOurs": 223.7,
   "pOursReport": 0.7678,
   "pOursMorning": 0.7396,
   "pOursEve": 0.7396,
   "pMarket": 0.7339,
   "mlHome": -324,
   "mlAway": 261,
   "spreadHome": -8.5,
   "totalMarket": 216.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.0036,
    "driver": "fit",
    "rule": null
   },
   "pWalk": 0.73,
   "walkNote": "GS at home (won vs BOS), SAC without LaVine. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_09_00PM.pdf",
   "result": {
    "homeScore": 129,
    "awayScore": 110
   },
   "close": {
    "mlHome": -324,
    "mlAway": 261,
    "spreadHome": -8.5,
    "total": 216.5,
    "book": "DraftKings",
    "open": {
     "mlHome": -241,
     "mlAway": 199,
     "spreadHome": -5.5,
     "total": 218.5
    }
   }
  },
  {
   "id": "401909325",
   "date": "2026-11-25",
   "tip": "2026-11-26T03:00Z",
   "home": "POR",
   "away": "SA",
   "pOurs": null,
   "marginOurs": null,
   "pOursClean": 0.5401,
   "marginOursClean": 1.26,
   "totalOurs": 223.5,
   "pOursReport": 0.5401,
   "pOursMorning": 0.5401,
   "pOursEve": 0.5401,
   "pMarket": 0.4066,
   "mlHome": 136,
   "mlAway": -162,
   "spreadHome": 3.5,
   "totalMarket": 224.5,
   "book": "DraftKings",
   "trust": {
    "side": "home",
    "edge": 0.1164,
    "driver": "absent",
    "rule": "AVOID"
   },
   "pWalk": 0.41,
   "walkNote": "Wembanyama and Fox questionable; the close (SA -3.5) says they play. Market.",
   "source": "backfill",
   "engine": "2026-11-07.rotcap",
   "replaySpec": "replay-9",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "report": "Injury-Report_2026-11-25_09_00PM.pdf",
   "result": {
    "homeScore": 116,
    "awayScore": 111
   },
   "close": {
    "mlHome": 136,
    "mlAway": -162,
    "spreadHome": 3.5,
    "total": 224.5,
    "book": "DraftKings",
    "open": {
     "mlHome": 142,
     "mlAway": -170,
     "spreadHome": 4.5,
     "total": 237.5
    }
   }
  }
 ],
 "nights": [
  {
   "date": "2026-11-19",
   "recordedAt": "2026-11-20T00:00:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401910021",
       "matchup": "NY @ MIN",
       "tip": "2026-11-20T01:00Z",
       "team": "NY",
       "opp": "MIN",
       "player": "3934672",
       "name": "Jalen Brunson",
       "stat": "pra",
       "dir": "over",
       "line": 20.5,
       "mean": 35.6,
       "sd": 11.56,
       "min": 34.2,
       "rank": 1,
       "p": 0.9043,
       "result": {
        "outcome": "hit",
        "actual": 30
       }
      },
      {
       "type": "prop",
       "game": "401910022",
       "matchup": "LAC @ SA",
       "tip": "2026-11-20T01:00Z",
       "team": "LAC",
       "opp": "SA",
       "player": "4396907",
       "name": "Darius Garland",
       "stat": "pra",
       "dir": "over",
       "line": 16.5,
       "mean": 31.1,
       "sd": 10.75,
       "min": 33,
       "rank": 1,
       "p": 0.9128,
       "result": {
        "outcome": "hit",
        "actual": 28
       }
      },
      {
       "type": "prop",
       "game": "401910019",
       "matchup": "GS @ MEM",
       "tip": "2026-11-20T01:00Z",
       "team": "GS",
       "opp": "MEM",
       "player": "5175737",
       "name": "Yaxel Lendeborg",
       "stat": "pra",
       "dir": "over",
       "line": 17.5,
       "mean": 31.4,
       "sd": 10.7,
       "min": 31.5,
       "rank": 2,
       "p": 0.903,
       "result": {
        "outcome": "hit",
        "actual": 26
       }
      }
     ],
     "p": 0.7454,
     "fairAmerican": -293,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 3,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "no ticket",
     "reason": "0 games with an 8+ pp edge (needs 2)",
     "legs": []
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 4,
    "status": "pitched",
    "label": "lean",
    "legs": [
     {
      "type": "ml",
      "game": "401910022",
      "matchup": "LAC @ SA",
      "tip": "2026-11-20T01:00Z",
      "side": "home",
      "team": "SA",
      "opp": "LAC",
      "odds": -1020,
      "oddsOther": 660,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.8738,
      "p": 0.8995,
      "pEngine": 0.8863,
      "trustRule": null,
      "top": [
       {
        "id": "4395630",
        "name": "Devin Vassell",
        "min": 30.2
       },
       {
        "id": "5104157",
        "name": "Victor Wembanyama",
        "min": 30
       },
       {
        "id": "4845367",
        "name": "Stephon Castle",
        "min": 29.3
       },
       {
        "id": "4066259",
        "name": "De'Aaron Fox",
        "min": 29
       },
       {
        "id": "4592479",
        "name": "Julian Champagnie",
        "min": 26.3
       }
      ],
      "open": {
       "mlHome": -1140,
       "mlAway": 720
      },
      "minToTip": 60,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910020",
      "matchup": "POR @ MIL",
      "tip": "2026-11-20T01:00Z",
      "side": "away",
      "team": "POR",
      "opp": "MIL",
      "odds": -380,
      "oddsOther": 301,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7605,
      "p": 0.7769,
      "pEngine": 0.7328,
      "trustRule": null,
      "top": [
       {
        "id": "4683021",
        "name": "Deni Avdija",
        "min": 32.5
       },
       {
        "id": "6606",
        "name": "Damian Lillard",
        "min": 29.2
       },
       {
        "id": "4431736",
        "name": "Toumani Camara",
        "min": 29.1
       },
       {
        "id": "3995",
        "name": "Jrue Holiday",
        "min": 26.5
       },
       {
        "id": "5105565",
        "name": "Donovan Clingan",
        "min": 25.7
       }
      ],
      "open": {
       "mlHome": 293,
       "mlAway": -369
      },
      "minToTip": 60,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910019",
      "matchup": "GS @ MEM",
      "tip": "2026-11-20T01:00Z",
      "side": "home",
      "team": "MEM",
      "opp": "GS",
      "odds": -205,
      "oddsOther": 171,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.6456,
      "p": 0.6546,
      "pEngine": 0.6787,
      "trustRule": null,
      "top": [
       {
        "id": "5041935",
        "name": "Cameron Boozer",
        "min": 31
       },
       {
        "id": "4903027",
        "name": "Cedric Coward",
        "min": 29
       },
       {
        "id": "5112087",
        "name": "Jaylen Wells",
        "min": 27
       },
       {
        "id": "2991070",
        "name": "Jerami Grant",
        "min": 23.4
       },
       {
        "id": "4433083",
        "name": "Cam Spencer",
        "min": 22.2
       }
      ],
      "open": {
       "mlHome": -334,
       "mlAway": 268
      },
      "minToTip": 60,
      "result": {
       "outcome": "hit"
      }
     }
    ],
    "p": 0.4574,
    "fairAmerican": 119,
    "price": 106,
    "quote": null,
    "result": {
     "outcome": "win",
     "legsHit": 3,
     "units": 1.06
    }
   },
   "pitch3": {
    "legs": [],
    "pair": null
   },
   "flat": [
    {
     "date": "2026-11-19",
     "gameId": "401910019",
     "team": "MEM",
     "side": "home",
     "odds": -205,
     "close": -205,
     "hit": true
    },
    {
     "date": "2026-11-19",
     "gameId": "401910021",
     "team": "NY",
     "side": "away",
     "odds": -113,
     "close": -113,
     "hit": true
    }
   ]
  },
  {
   "date": "2026-11-20",
   "recordedAt": "2026-11-20T23:00:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401909306",
       "matchup": "ORL @ BKN",
       "tip": "2026-11-21T00:30Z",
       "team": "ORL",
       "opp": "BKN",
       "player": "4566434",
       "name": "Franz Wagner",
       "stat": "pra",
       "dir": "over",
       "line": 21.5,
       "mean": 38,
       "sd": 12.26,
       "min": 36.8,
       "rank": 1,
       "p": 0.9108,
       "result": {
        "outcome": "hit",
        "actual": 47
       }
      },
      {
       "type": "prop",
       "game": "401909312",
       "matchup": "HOU @ DEN",
       "tip": "2026-11-21T03:00Z",
       "team": "DEN",
       "opp": "HOU",
       "player": "3112335",
       "name": "Nikola Jokic",
       "stat": "pra",
       "dir": "over",
       "line": 28.5,
       "mean": 48.3,
       "sd": 15.02,
       "min": 36.7,
       "rank": 1,
       "p": 0.9063,
       "result": {
        "outcome": "hit",
        "actual": 44
       }
      },
      {
       "type": "prop",
       "game": "401909313",
       "matchup": "SAC @ LAL",
       "tip": "2026-11-21T03:00Z",
       "team": "SAC",
       "opp": "LAL",
       "player": "5142620",
       "name": "Darius Acuff Jr.",
       "stat": "pra",
       "dir": "over",
       "line": 21.5,
       "mean": 36.8,
       "sd": 11.86,
       "min": 36.6,
       "rank": 1,
       "p": 0.9015,
       "result": {
        "outcome": "hit",
        "actual": 31
       }
      }
     ],
     "p": 0.7442,
     "fairAmerican": -291,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 3,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "pitched",
     "legs": [
      {
       "type": "ml",
       "game": "401909307",
       "matchup": "IND @ CLE",
       "tip": "2026-11-21T00:30Z",
       "side": "home",
       "team": "CLE",
       "odds": -244,
       "pModel": 0.7653,
       "pMarket": 0.681,
       "p": 0.7189,
       "result": {
        "outcome": "hit"
       }
      },
      {
       "type": "ml",
       "game": "401909305",
       "matchup": "CHA @ ATL",
       "tip": "2026-11-21T00:00Z",
       "side": "home",
       "team": "ATL",
       "odds": -264,
       "pModel": 0.7783,
       "pMarket": 0.6969,
       "p": 0.7335,
       "result": {
        "outcome": "hit"
       }
      }
     ],
     "p": 0.5273,
     "fairAmerican": -112,
     "price": -106,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 2,
      "legsVoid": 0,
      "units": 0.9434,
      "settledAt": "backfill"
     }
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 9,
    "status": "pitched",
    "label": "lean",
    "legs": [
     {
      "type": "ml",
      "game": "401909313",
      "matchup": "SAC @ LAL",
      "tip": "2026-11-21T03:00Z",
      "side": "home",
      "team": "LAL",
      "opp": "SAC",
      "odds": -840,
      "oddsOther": 580,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.8587,
      "p": 0.8821,
      "pEngine": 0.8927,
      "trustRule": null,
      "top": [
       {
        "id": "3945274",
        "name": "Luka Doncic",
        "min": 36.4
       },
       {
        "id": "4433136",
        "name": "Walker Kessler",
        "min": 30.9
       },
       {
        "id": "4397014",
        "name": "Quentin Grimes",
        "min": 28.6
       },
       {
        "id": "4592691",
        "name": "Jake LaRavia",
        "min": 25.3
       },
       {
        "id": "3907498",
        "name": "Matisse Thybulle",
        "min": 24.6
       }
      ],
      "open": {
       "mlHome": -1040,
       "mlAway": 670
      },
      "minToTip": 240,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401909310",
      "matchup": "NO @ OKC",
      "tip": "2026-11-21T01:00Z",
      "side": "home",
      "team": "OKC",
      "opp": "NO",
      "odds": -479,
      "oddsOther": 368,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7947,
      "p": 0.8136,
      "pEngine": 0.7612,
      "trustRule": null,
      "top": [
       {
        "id": "4278073",
        "name": "Shai Gilgeous-Alexander",
        "min": 33.3
       },
       {
        "id": "4900671",
        "name": "Ajay Mitchell",
        "min": 27.8
       },
       {
        "id": "4683778",
        "name": "Jared McCain",
        "min": 27.2
       },
       {
        "id": "4222252",
        "name": "Isaiah Hartenstein",
        "min": 25
       },
       {
        "id": "5174983",
        "name": "Aday Mara",
        "min": 22
       }
      ],
      "open": {
       "mlHome": -499,
       "mlAway": 382
      },
      "minToTip": 120,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401909308",
      "matchup": "TOR @ DET",
      "tip": "2026-11-21T00:30Z",
      "side": "home",
      "team": "DET",
      "opp": "TOR",
      "odds": -277,
      "oddsOther": 227,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7061,
      "p": 0.7189,
      "pEngine": 0.6904,
      "trustRule": null,
      "top": [
       {
        "id": "4432166",
        "name": "Cade Cunningham",
        "min": 35
       },
       {
        "id": "5107199",
        "name": "Daniss Jenkins",
        "min": 29.3
       },
       {
        "id": "4684742",
        "name": "Ausar Thompson",
        "min": 28.3
       },
       {
        "id": "3908845",
        "name": "John Collins",
        "min": 26.3
       },
       {
        "id": "4066372",
        "name": "Kevin Huerter",
        "min": 26.1
       }
      ],
      "open": {
       "mlHome": -115,
       "mlAway": -105
      },
      "minToTip": 90,
      "result": {
       "outcome": "miss"
      }
     }
    ],
    "p": 0.5159,
    "fairAmerican": -107,
    "price": -119,
    "quote": null,
    "result": {
     "outcome": "loss",
     "legsHit": 2,
     "units": -1
    }
   },
   "pitch3": {
    "legs": [
     {
      "date": "2026-11-20",
      "gameId": "401909305",
      "matchup": "CHA @ ATL",
      "tip": "2026-11-21T00:00Z",
      "team": "ATL",
      "opp": "CHA",
      "side": "home",
      "tier": "8+",
      "pModel": 0.7783,
      "pFeed": null,
      "pMarket": 0.6969,
      "edge": 0.0814,
      "odds": -264,
      "close": -264,
      "pClose": 0.6969,
      "hours": 1,
      "source": "backfill",
      "hit": true
     },
     {
      "date": "2026-11-20",
      "gameId": "401909307",
      "matchup": "IND @ CLE",
      "tip": "2026-11-21T00:30Z",
      "team": "CLE",
      "opp": "IND",
      "side": "home",
      "tier": "8+",
      "pModel": 0.7653,
      "pFeed": null,
      "pMarket": 0.681,
      "edge": 0.0843,
      "odds": -244,
      "close": -244,
      "pClose": 0.681,
      "hours": 1.5,
      "source": "backfill",
      "hit": true
     }
    ],
    "pair": {
     "date": "2026-11-20",
     "legs": [
      {
       "date": "2026-11-20",
       "gameId": "401909307",
       "matchup": "IND @ CLE",
       "tip": "2026-11-21T00:30Z",
       "team": "CLE",
       "opp": "IND",
       "side": "home",
       "tier": "8+",
       "pModel": 0.7653,
       "pFeed": null,
       "pMarket": 0.681,
       "edge": 0.0843,
       "odds": -244,
       "close": -244,
       "pClose": 0.681,
       "hours": 1.5,
       "source": "backfill",
       "hit": true
      },
      {
       "date": "2026-11-20",
       "gameId": "401909305",
       "matchup": "CHA @ ATL",
       "tip": "2026-11-21T00:00Z",
       "team": "ATL",
       "opp": "CHA",
       "side": "home",
       "tier": "8+",
       "pModel": 0.7783,
       "pFeed": null,
       "pMarket": 0.6969,
       "edge": 0.0814,
       "odds": -264,
       "close": -264,
       "pClose": 0.6969,
       "hours": 1,
       "source": "backfill",
       "hit": true
      }
     ],
     "pModel": 0.5956,
     "pMarket": 0.4746,
     "odds": -106,
     "close": -106,
     "hit": true
    }
   },
   "flat": [
    {
     "date": "2026-11-20",
     "gameId": "401909305",
     "team": "ATL",
     "side": "home",
     "odds": -264,
     "close": -264,
     "hit": true
    },
    {
     "date": "2026-11-20",
     "gameId": "401909306",
     "team": "ORL",
     "side": "away",
     "odds": -249,
     "close": -249,
     "hit": true
    },
    {
     "date": "2026-11-20",
     "gameId": "401909307",
     "team": "CLE",
     "side": "home",
     "odds": -244,
     "close": -244,
     "hit": true
    },
    {
     "date": "2026-11-20",
     "gameId": "401909308",
     "team": "DET",
     "side": "home",
     "odds": -277,
     "close": -277,
     "hit": false
    },
    {
     "date": "2026-11-20",
     "gameId": "401909309",
     "team": "CHI",
     "side": "home",
     "odds": -135,
     "close": -135,
     "hit": false
    },
    {
     "date": "2026-11-20",
     "gameId": "401909311",
     "team": "PHX",
     "side": "away",
     "odds": -192,
     "close": -192,
     "hit": true
    },
    {
     "date": "2026-11-20",
     "gameId": "401909312",
     "team": "HOU",
     "side": "away",
     "odds": -121,
     "close": -121,
     "hit": false
    }
   ]
  },
  {
   "date": "2026-11-21",
   "recordedAt": "2026-11-21T17:00:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401910028",
       "matchup": "BOS @ SAC",
       "tip": "2026-11-22T03:00Z",
       "team": "SAC",
       "opp": "BOS",
       "player": "5142620",
       "name": "Darius Acuff Jr.",
       "stat": "pra",
       "dir": "over",
       "line": 19.5,
       "mean": 35.1,
       "sd": 11.58,
       "min": 36.6,
       "rank": 1,
       "p": 0.911,
       "result": {
        "outcome": "hit",
        "actual": 35
       }
      },
      {
       "type": "prop",
       "game": "401910024",
       "matchup": "POR @ NY",
       "tip": "2026-11-22T00:30Z",
       "team": "NY",
       "opp": "POR",
       "player": "3934672",
       "name": "Jalen Brunson",
       "stat": "pra",
       "dir": "over",
       "line": 20.5,
       "mean": 35.7,
       "sd": 11.59,
       "min": 34.3,
       "rank": 1,
       "p": 0.9052,
       "result": {
        "outcome": "hit",
        "actual": 42
       }
      },
      {
       "type": "prop",
       "game": "401910023",
       "matchup": "MIL @ PHI",
       "tip": "2026-11-21T18:00Z",
       "team": "PHI",
       "opp": "MIL",
       "player": "5124612",
       "name": "VJ Edgecombe",
       "stat": "pra",
       "dir": "over",
       "line": 12.5,
       "mean": 24.6,
       "sd": 9.37,
       "min": 34,
       "rank": 2,
       "p": 0.9017,
       "result": {
        "outcome": "hit",
        "actual": 25
       }
      }
     ],
     "p": 0.7436,
     "fairAmerican": -290,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 3,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "no ticket",
     "reason": "0 games with an 8+ pp edge (needs 2)",
     "legs": []
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 6,
    "status": "pitched",
    "label": "safe",
    "legs": [
     {
      "type": "ml",
      "game": "401910027",
      "matchup": "NO @ SA",
      "tip": "2026-11-22T01:00Z",
      "side": "home",
      "team": "SA",
      "opp": "NO",
      "odds": -1700,
      "oddsOther": 940,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.9076,
      "p": 0.9353,
      "pEngine": 0.926,
      "trustRule": null,
      "top": [
       {
        "id": "4395630",
        "name": "Devin Vassell",
        "min": 30.4
       },
       {
        "id": "5104157",
        "name": "Victor Wembanyama",
        "min": 30.2
       },
       {
        "id": "4845367",
        "name": "Stephon Castle",
        "min": 29.5
       },
       {
        "id": "4066259",
        "name": "De'Aaron Fox",
        "min": 29.2
       },
       {
        "id": "4592479",
        "name": "Julian Champagnie",
        "min": 26.4
       }
      ],
      "open": {
       "mlHome": -1440,
       "mlAway": 850
      },
      "minToTip": 480,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910023",
      "matchup": "MIL @ PHI",
      "tip": "2026-11-21T18:00Z",
      "side": "home",
      "team": "PHI",
      "opp": "MIL",
      "odds": -620,
      "oddsOther": 455,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.827,
      "p": 0.8483,
      "pEngine": 0.8264,
      "trustRule": null,
      "top": [
       {
        "id": "4431678",
        "name": "Tyrese Maxey",
        "min": 36.1
       },
       {
        "id": "5124612",
        "name": "VJ Edgecombe",
        "min": 34
       },
       {
        "id": "1966",
        "name": "LeBron James",
        "min": 32.4
       },
       {
        "id": "3059318",
        "name": "Joel Embiid",
        "min": 31.8
       },
       {
        "id": "2581018",
        "name": "Kentavious Caldwell-Pope",
        "min": 23.1
       }
      ],
      "open": {
       "mlHome": -446,
       "mlAway": 346
      },
      "minToTip": 60,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910028",
      "matchup": "BOS @ SAC",
      "tip": "2026-11-22T03:00Z",
      "side": "away",
      "team": "BOS",
      "opp": "SAC",
      "odds": -620,
      "oddsOther": 453,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.8264,
      "p": 0.8481,
      "pEngine": 0.8513,
      "trustRule": null,
      "top": [
       {
        "id": "4251",
        "name": "Paul George",
        "min": 29.6
       },
       {
        "id": "4066354",
        "name": "Payton Pritchard",
        "min": 27.2
       },
       {
        "id": "4397424",
        "name": "Neemias Queta",
        "min": 22.3
       },
       {
        "id": "4065804",
        "name": "Sam Hauser",
        "min": 20.3
       },
       {
        "id": "4593841",
        "name": "Baylor Scheierman",
        "min": 19.3
       }
      ],
      "open": {
       "mlHome": 359,
       "mlAway": -465
      },
      "minToTip": 600,
      "result": {
       "outcome": "miss"
      }
     }
    ],
    "p": 0.6729,
    "fairAmerican": -206,
    "price": -234,
    "quote": null,
    "result": {
     "outcome": "loss",
     "legsHit": 2,
     "units": -1
    }
   },
   "pitch3": {
    "legs": [
     {
      "date": "2026-11-21",
      "gameId": "401910025",
      "matchup": "LAC @ DAL",
      "tip": "2026-11-22T01:00Z",
      "team": "DAL",
      "opp": "LAC",
      "side": "home",
      "tier": "5–8",
      "pModel": 0.7033,
      "pFeed": null,
      "pMarket": 0.6305,
      "edge": 0.0728,
      "odds": -191,
      "close": -191,
      "pClose": 0.6305,
      "hours": 8,
      "source": "backfill",
      "hit": true
     }
    ],
    "pair": null
   },
   "flat": [
    {
     "date": "2026-11-21",
     "gameId": "401910024",
     "team": "POR",
     "side": "away",
     "odds": -121,
     "close": -121,
     "hit": false
    },
    {
     "date": "2026-11-21",
     "gameId": "401910025",
     "team": "DAL",
     "side": "home",
     "odds": -191,
     "close": -191,
     "hit": true
    },
    {
     "date": "2026-11-21",
     "gameId": "401910026",
     "team": "MIN",
     "side": "home",
     "odds": -218,
     "close": -218,
     "hit": true
    }
   ]
  },
  {
   "date": "2026-11-22",
   "recordedAt": "2026-11-22T19:30:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401910032",
       "matchup": "DEN @ CHI",
       "tip": "2026-11-23T00:00Z",
       "team": "DEN",
       "opp": "CHI",
       "player": "3112335",
       "name": "Nikola Jokic",
       "stat": "pra",
       "dir": "over",
       "line": 30.5,
       "mean": 50.4,
       "sd": 15.48,
       "min": 36.8,
       "rank": 1,
       "p": 0.9007,
       "result": {
        "outcome": "hit",
        "actual": 66
       }
      },
      {
       "type": "prop",
       "game": "401910031",
       "matchup": "ORL @ WSH",
       "tip": "2026-11-23T00:00Z",
       "team": "ORL",
       "opp": "WSH",
       "player": "4566434",
       "name": "Franz Wagner",
       "stat": "pra",
       "dir": "over",
       "line": 22.5,
       "mean": 39,
       "sd": 12.45,
       "min": 36.7,
       "rank": 1,
       "p": 0.9075,
       "result": {
        "outcome": "hit",
        "actual": 30
       }
      },
      {
       "type": "prop",
       "game": "401910029",
       "matchup": "DET @ ATL",
       "tip": "2026-11-22T20:30Z",
       "team": "ATL",
       "opp": "DET",
       "player": "4701230",
       "name": "Jalen Johnson",
       "stat": "pra",
       "dir": "over",
       "line": 20.5,
       "mean": 36.6,
       "sd": 12.28,
       "min": 34.5,
       "rank": 1,
       "p": 0.9051,
       "result": {
        "outcome": "hit",
        "actual": 23
       }
      }
     ],
     "p": 0.7398,
     "fairAmerican": -284,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 3,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "no ticket",
     "reason": "0 games with an 8+ pp edge (needs 2)",
     "legs": []
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 7,
    "status": "pitched",
    "label": "lean",
    "legs": [
     {
      "type": "ml",
      "game": "401910032",
      "matchup": "DEN @ CHI",
      "tip": "2026-11-23T00:00Z",
      "side": "away",
      "team": "DEN",
      "opp": "CHI",
      "odds": -419,
      "oddsOther": 328,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7756,
      "p": 0.793,
      "pEngine": 0.7785,
      "trustRule": null,
      "top": [
       {
        "id": "3112335",
        "name": "Nikola Jokic",
        "min": 36.8
       },
       {
        "id": "3936299",
        "name": "Jamal Murray",
        "min": 36.4
       },
       {
        "id": "4431767",
        "name": "Christian Braun",
        "min": 33.6
       },
       {
        "id": "3064290",
        "name": "Aaron Gordon",
        "min": 29.2
       },
       {
        "id": "3138196",
        "name": "Cameron Johnson",
        "min": 28.4
       }
      ],
      "open": {
       "mlHome": 268,
       "mlAway": -333
      },
      "minToTip": 270,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910035",
      "matchup": "BOS @ GS",
      "tip": "2026-11-23T01:30Z",
      "side": "away",
      "team": "BOS",
      "opp": "GS",
      "odds": -336,
      "oddsOther": 270,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7404,
      "p": 0.7554,
      "pEngine": 0.7063,
      "trustRule": null,
      "top": [
       {
        "id": "4065648",
        "name": "Jayson Tatum",
        "min": 34.1
       },
       {
        "id": "3078576",
        "name": "Derrick White",
        "min": 29.9
       },
       {
        "id": "4066354",
        "name": "Payton Pritchard",
        "min": 27.6
       },
       {
        "id": "4397424",
        "name": "Neemias Queta",
        "min": 22.8
       },
       {
        "id": "4065804",
        "name": "Sam Hauser",
        "min": 21
       }
      ],
      "open": {
       "mlHome": 299,
       "mlAway": -378
      },
      "minToTip": 360,
      "result": {
       "outcome": "miss"
      }
     },
     {
      "type": "ml",
      "game": "401910034",
      "matchup": "IND @ NY",
      "tip": "2026-11-23T01:00Z",
      "side": "home",
      "team": "NY",
      "opp": "IND",
      "odds": -237,
      "oddsOther": 196,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.6755,
      "p": 0.6864,
      "pEngine": 0.7106,
      "trustRule": null,
      "top": [
       {
        "id": "3934672",
        "name": "Jalen Brunson",
        "min": 34.4
       },
       {
        "id": "3136195",
        "name": "Karl-Anthony Towns",
        "min": 32.7
       },
       {
        "id": "3062679",
        "name": "Josh Hart",
        "min": 30.1
       },
       {
        "id": "3914044",
        "name": "Landry Shamet",
        "min": 26.6
       },
       {
        "id": "3147657",
        "name": "Mikal Bridges",
        "min": 26.1
       }
      ],
      "open": {
       "mlHome": -373,
       "mlAway": 296
      },
      "minToTip": 330,
      "result": {
       "outcome": "hit"
      }
     }
    ],
    "p": 0.4112,
    "fairAmerican": 143,
    "price": 129,
    "quote": null,
    "result": {
     "outcome": "loss",
     "legsHit": 2,
     "units": -1
    }
   },
   "pitch3": {
    "legs": [],
    "pair": null
   },
   "flat": [
    {
     "date": "2026-11-22",
     "gameId": "401910029",
     "team": "DET",
     "side": "away",
     "odds": -135,
     "close": -135,
     "hit": false
    },
    {
     "date": "2026-11-22",
     "gameId": "401910030",
     "team": "MIA",
     "side": "home",
     "odds": -184,
     "close": -184,
     "hit": true
    },
    {
     "date": "2026-11-22",
     "gameId": "401910031",
     "team": "ORL",
     "side": "away",
     "odds": -196,
     "close": -196,
     "hit": false
    },
    {
     "date": "2026-11-22",
     "gameId": "401910033",
     "team": "DAL",
     "side": "away",
     "odds": -135,
     "close": -135,
     "hit": true
    },
    {
     "date": "2026-11-22",
     "gameId": "401910034",
     "team": "NY",
     "side": "home",
     "odds": -237,
     "close": -237,
     "hit": true
    }
   ]
  },
  {
   "date": "2026-11-23",
   "recordedAt": "2026-11-23T23:00:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401910045",
       "matchup": "SA @ SAC",
       "tip": "2026-11-24T03:00Z",
       "team": "SAC",
       "opp": "SA",
       "player": "5142620",
       "name": "Darius Acuff Jr.",
       "stat": "pra",
       "dir": "over",
       "line": 20.5,
       "mean": 35.7,
       "sd": 11.72,
       "min": 36.8,
       "rank": 1,
       "p": 0.9027,
       "result": {
        "outcome": "miss",
        "actual": 17
       }
      },
      {
       "type": "prop",
       "game": "401910044",
       "matchup": "UTAH @ LAL",
       "tip": "2026-11-24T03:00Z",
       "team": "LAL",
       "opp": "UTAH",
       "player": "3945274",
       "name": "Luka Doncic",
       "stat": "pra",
       "dir": "over",
       "line": 31.5,
       "mean": 51.4,
       "sd": 15.11,
       "min": 36.3,
       "rank": 1,
       "p": 0.9061,
       "result": {
        "outcome": "hit",
        "actual": 40
       }
      },
      {
       "type": "prop",
       "game": "401910037",
       "matchup": "POR @ PHI",
       "tip": "2026-11-24T00:00Z",
       "team": "PHI",
       "opp": "POR",
       "player": "4431678",
       "name": "Tyrese Maxey",
       "stat": "pra",
       "dir": "over",
       "line": 20.5,
       "mean": 35.5,
       "sd": 11.51,
       "min": 36.1,
       "rank": 1,
       "p": 0.9037,
       "result": {
        "outcome": "hit",
        "actual": 29
       }
      }
     ],
     "p": 0.7392,
     "fairAmerican": -283,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "loss",
      "legsHit": 2,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "no ticket",
     "reason": "1 game with an 8+ pp edge (needs 2)",
     "legs": []
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 10,
    "status": "pitched",
    "label": "safe",
    "legs": [
     {
      "type": "ml",
      "game": "401910044",
      "matchup": "UTAH @ LAL",
      "tip": "2026-11-24T03:00Z",
      "side": "home",
      "team": "LAL",
      "opp": "UTAH",
      "odds": -750,
      "oddsOther": 530,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.8475,
      "p": 0.8703,
      "pEngine": 0.8906,
      "trustRule": null,
      "top": [
       {
        "id": "3945274",
        "name": "Luka Doncic",
        "min": 36.3
       },
       {
        "id": "4433136",
        "name": "Walker Kessler",
        "min": 30.8
       },
       {
        "id": "4397014",
        "name": "Quentin Grimes",
        "min": 29.1
       },
       {
        "id": "4592691",
        "name": "Jake LaRavia",
        "min": 25.2
       },
       {
        "id": "3907498",
        "name": "Matisse Thybulle",
        "min": 24.8
       }
      ],
      "open": {
       "mlHome": -700,
       "mlAway": 501
      },
      "minToTip": 240,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910043",
      "matchup": "LAC @ HOU",
      "tip": "2026-11-24T01:30Z",
      "side": "home",
      "team": "HOU",
      "opp": "LAC",
      "odds": -700,
      "oddsOther": 504,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.8409,
      "p": 0.8629,
      "pEngine": 0.8498,
      "trustRule": null,
      "top": [
       {
        "id": "3202",
        "name": "Kevin Durant",
        "min": 33.6
       },
       {
        "id": "4432639",
        "name": "Jabari Smith Jr.",
        "min": 33.2
       },
       {
        "id": "4871144",
        "name": "Alperen Sengun",
        "min": 33
       },
       {
        "id": "4684740",
        "name": "Amen Thompson",
        "min": 32.7
       },
       {
        "id": "2991230",
        "name": "Fred VanVleet",
        "min": 30.1
       }
      ],
      "open": {
       "mlHome": -610,
       "mlAway": 448
      },
      "minToTip": 150,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401910040",
      "matchup": "BKN @ MIN",
      "tip": "2026-11-24T00:30Z",
      "side": "home",
      "team": "MIN",
      "opp": "BKN",
      "odds": -521,
      "oddsOther": 396,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.8062,
      "p": 0.8257,
      "pEngine": 0.81,
      "trustRule": null,
      "top": [
       {
        "id": "4431671",
        "name": "Jaden McDaniels",
        "min": 34
       },
       {
        "id": "4397002",
        "name": "Ayo Dosunmu",
        "min": 31.8
       },
       {
        "id": "4433247",
        "name": "Jonathan Kuminga",
        "min": 31.1
       },
       {
        "id": "3032976",
        "name": "Rudy Gobert",
        "min": 29.4
       },
       {
        "id": "4432816",
        "name": "LaMelo Ball",
        "min": 28.4
       }
      ],
      "open": {
       "mlHome": -578,
       "mlAway": 431
      },
      "minToTip": 90,
      "result": {
       "outcome": "hit"
      }
     }
    ],
    "p": 0.6201,
    "fairAmerican": -163,
    "price": -184,
    "quote": null,
    "result": {
     "outcome": "win",
     "legsHit": 3,
     "units": 0.5435
    }
   },
   "pitch3": {
    "legs": [
     {
      "date": "2026-11-23",
      "gameId": "401910036",
      "matchup": "MEM @ CHA",
      "tip": "2026-11-24T00:00Z",
      "team": "MEM",
      "opp": "CHA",
      "side": "away",
      "tier": "8+",
      "pModel": 0.7295,
      "pFeed": null,
      "pMarket": 0.5731,
      "edge": 0.1564,
      "odds": -148,
      "close": -148,
      "pClose": 0.5731,
      "hours": 1,
      "source": "backfill",
      "hit": true
     }
    ],
    "pair": null
   },
   "flat": [
    {
     "date": "2026-11-23",
     "gameId": "401910036",
     "team": "MEM",
     "side": "away",
     "odds": -148,
     "close": -148,
     "hit": true
    },
    {
     "date": "2026-11-23",
     "gameId": "401910037",
     "team": "POR",
     "side": "away",
     "odds": -110,
     "close": -110,
     "hit": true
    },
    {
     "date": "2026-11-23",
     "gameId": "401910038",
     "team": "OKC",
     "side": "away",
     "odds": -191,
     "close": -191,
     "hit": false
    },
    {
     "date": "2026-11-23",
     "gameId": "401910042",
     "team": "PHX",
     "side": "away",
     "odds": -155,
     "close": -155,
     "hit": true
    }
   ]
  },
  {
   "date": "2026-11-24",
   "recordedAt": "2026-11-24T23:00:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401909316",
       "matchup": "DAL @ DEN",
       "tip": "2026-11-25T03:00Z",
       "team": "DEN",
       "opp": "DAL",
       "player": "3112335",
       "name": "Nikola Jokic",
       "stat": "pra",
       "dir": "over",
       "line": 29.5,
       "mean": 50.3,
       "sd": 15.5,
       "min": 37.1,
       "rank": 1,
       "p": 0.9102,
       "result": {
        "outcome": "hit",
        "actual": 34
       }
      },
      {
       "type": "prop",
       "game": "401909314",
       "matchup": "DET @ ORL",
       "tip": "2026-11-25T00:00Z",
       "team": "ORL",
       "opp": "DET",
       "player": "4566434",
       "name": "Franz Wagner",
       "stat": "pra",
       "dir": "over",
       "line": 21.5,
       "mean": 37.3,
       "sd": 12.11,
       "min": 36.4,
       "rank": 1,
       "p": 0.904,
       "result": {
        "outcome": "hit",
        "actual": 35
       }
      },
      {
       "type": "prop",
       "game": "401909315",
       "matchup": "BOS @ WSH",
       "tip": "2026-11-25T01:00Z",
       "team": "WSH",
       "opp": "BOS",
       "player": "4277905",
       "name": "Trae Young",
       "stat": "pra",
       "dir": "over",
       "line": 16.5,
       "mean": 31.5,
       "sd": 11.1,
       "min": 34.6,
       "rank": 1,
       "p": 0.9117,
       "result": {
        "outcome": "hit",
        "actual": 29
       }
      }
     ],
     "p": 0.7502,
     "fairAmerican": -300,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 3,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "no ticket",
     "reason": "1 game with an 8+ pp edge (needs 2)",
     "legs": []
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 3,
    "status": "pitched",
    "label": "lean",
    "legs": [
     {
      "type": "ml",
      "game": "401909315",
      "matchup": "BOS @ WSH",
      "tip": "2026-11-25T01:00Z",
      "side": "away",
      "team": "BOS",
      "opp": "WSH",
      "odds": -452,
      "oddsOther": 351,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7869,
      "p": 0.805,
      "pEngine": 0.7896,
      "trustRule": null,
      "top": [
       {
        "id": "4065648",
        "name": "Jayson Tatum",
        "min": 34.3
       },
       {
        "id": "4251",
        "name": "Paul George",
        "min": 30.1
       },
       {
        "id": "3078576",
        "name": "Derrick White",
        "min": 30
       },
       {
        "id": "4066354",
        "name": "Payton Pritchard",
        "min": 27.6
       },
       {
        "id": "4397424",
        "name": "Neemias Queta",
        "min": 23.3
       }
      ],
      "open": {
       "mlHome": 164,
       "mlAway": -198
      },
      "minToTip": 120,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401909316",
      "matchup": "DAL @ DEN",
      "tip": "2026-11-25T03:00Z",
      "side": "home",
      "team": "DEN",
      "opp": "DAL",
      "odds": -277,
      "oddsOther": 227,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7061,
      "p": 0.7189,
      "pEngine": 0.7123,
      "trustRule": null,
      "top": [
       {
        "id": "3112335",
        "name": "Nikola Jokic",
        "min": 37.1
       },
       {
        "id": "3936299",
        "name": "Jamal Murray",
        "min": 37
       },
       {
        "id": "4431767",
        "name": "Christian Braun",
        "min": 33.9
       },
       {
        "id": "3064290",
        "name": "Aaron Gordon",
        "min": 29.5
       },
       {
        "id": "3138196",
        "name": "Cameron Johnson",
        "min": 29
       }
      ],
      "open": {
       "mlHome": -345,
       "mlAway": 275
      },
      "minToTip": 240,
      "result": {
       "outcome": "miss"
      }
     },
     {
      "type": "ml",
      "game": "401909314",
      "matchup": "DET @ ORL",
      "tip": "2026-11-25T00:00Z",
      "side": "home",
      "team": "ORL",
      "opp": "DET",
      "odds": -150,
      "oddsOther": 126,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.5756,
      "p": 0.5804,
      "pEngine": 0.3927,
      "trustRule": null,
      "top": [
       {
        "id": "4566434",
        "name": "Franz Wagner",
        "min": 36.4
       },
       {
        "id": "4066320",
        "name": "Desmond Bane",
        "min": 34.8
       },
       {
        "id": "4712849",
        "name": "Anthony Black",
        "min": 33.2
       },
       {
        "id": "4277847",
        "name": "Wendell Carter Jr.",
        "min": 32.1
       },
       {
        "id": "4702382",
        "name": "Tristan da Silva",
        "min": 29.6
       }
      ],
      "open": {
       "mlHome": 106,
       "mlAway": -125
      },
      "minToTip": 60,
      "result": {
       "outcome": "miss"
      }
     }
    ],
    "p": 0.3359,
    "fairAmerican": 198,
    "price": 177,
    "quote": null,
    "result": {
     "outcome": "loss",
     "legsHit": 1,
     "units": -1
    }
   },
   "pitch3": {
    "legs": [
     {
      "date": "2026-11-24",
      "gameId": "401909314",
      "matchup": "DET @ ORL",
      "tip": "2026-11-25T00:00Z",
      "team": "DET",
      "opp": "ORL",
      "side": "away",
      "tier": "8+",
      "pModel": 0.6073,
      "pFeed": null,
      "pMarket": 0.4244,
      "edge": 0.1829,
      "odds": 126,
      "close": 126,
      "pClose": 0.4244,
      "hours": 1,
      "source": "backfill",
      "hit": true
     }
    ],
    "pair": null
   },
   "flat": [
    {
     "date": "2026-11-24",
     "gameId": "401909314",
     "team": "ORL",
     "side": "home",
     "odds": -150,
     "close": -150,
     "hit": false
    },
    {
     "date": "2026-11-24",
     "gameId": "401909316",
     "team": "DEN",
     "side": "home",
     "odds": -277,
     "close": -277,
     "hit": false
    }
   ]
  },
  {
   "date": "2026-11-25",
   "recordedAt": "2026-11-25T21:00:00.000Z",
   "pitch1": [
    {
     "recipe": "floor",
     "status": "pitched",
     "legs": [
      {
       "type": "prop",
       "game": "401909324",
       "matchup": "SAC @ GS",
       "tip": "2026-11-26T03:00Z",
       "team": "SAC",
       "opp": "GS",
       "player": "5142620",
       "name": "Darius Acuff Jr.",
       "stat": "pra",
       "dir": "over",
       "line": 19.5,
       "mean": 35,
       "sd": 11.55,
       "min": 36.6,
       "rank": 1,
       "p": 0.9102,
       "result": {
        "outcome": "hit",
        "actual": 35
       }
      },
      {
       "type": "prop",
       "game": "401909317",
       "matchup": "MIA @ PHI",
       "tip": "2026-11-25T22:00Z",
       "team": "PHI",
       "opp": "MIA",
       "player": "4431678",
       "name": "Tyrese Maxey",
       "stat": "pra",
       "dir": "over",
       "line": 20.5,
       "mean": 36.1,
       "sd": 11.63,
       "min": 36.1,
       "rank": 1,
       "p": 0.9101,
       "result": {
        "outcome": "hit",
        "actual": 40
       }
      },
      {
       "type": "prop",
       "game": "401909323",
       "matchup": "PHX @ HOU",
       "tip": "2026-11-26T01:30Z",
       "team": "PHX",
       "opp": "HOU",
       "player": "3136193",
       "name": "Devin Booker",
       "stat": "pra",
       "dir": "over",
       "line": 19.5,
       "mean": 34,
       "sd": 11.2,
       "min": 34.4,
       "rank": 1,
       "p": 0.9023,
       "result": {
        "outcome": "hit",
        "actual": 30
       }
      }
     ],
     "p": 0.7474,
     "fairAmerican": -296,
     "price": null,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 3,
      "legsVoid": 0,
      "units": null,
      "settledAt": "backfill"
     }
    },
    {
     "recipe": "edge",
     "status": "pitched",
     "legs": [
      {
       "type": "ml",
       "game": "401909317",
       "matchup": "MIA @ PHI",
       "tip": "2026-11-25T22:00Z",
       "side": "home",
       "team": "PHI",
       "odds": -108,
       "pModel": 0.6155,
       "pMarket": 0.4989,
       "p": 0.5514,
       "result": {
        "outcome": "hit"
       }
      },
      {
       "type": "ml",
       "game": "401909321",
       "matchup": "LAC @ MEM",
       "tip": "2026-11-26T01:00Z",
       "side": "home",
       "team": "MEM",
       "odds": -269,
       "pModel": 0.7919,
       "pMarket": 0.7,
       "p": 0.7413,
       "result": {
        "outcome": "hit"
       }
      }
     ],
     "p": 0.4088,
     "fairAmerican": 145,
     "price": 164,
     "quote": null,
     "result": {
      "outcome": "win",
      "legsHit": 2,
      "legsVoid": 0,
      "units": 1.64,
      "settledAt": "backfill"
     }
    }
   ],
   "pitch2": {
    "recipe": "favourites",
    "gamesTipped": 0,
    "gamesPriced": 9,
    "status": "pitched",
    "label": "lean",
    "legs": [
     {
      "type": "ml",
      "game": "401909323",
      "matchup": "PHX @ HOU",
      "tip": "2026-11-26T01:30Z",
      "side": "home",
      "team": "HOU",
      "opp": "PHX",
      "odds": -378,
      "oddsOther": 300,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7598,
      "p": 0.7761,
      "pEngine": 0.7371,
      "trustRule": null,
      "top": [
       {
        "id": "3202",
        "name": "Kevin Durant",
        "min": 33.6
       },
       {
        "id": "4871144",
        "name": "Alperen Sengun",
        "min": 32.9
       },
       {
        "id": "4432639",
        "name": "Jabari Smith Jr.",
        "min": 32.9
       },
       {
        "id": "4684740",
        "name": "Amen Thompson",
        "min": 32.4
       },
       {
        "id": "2991230",
        "name": "Fred VanVleet",
        "min": 30.1
       }
      ],
      "open": {
       "mlHome": -369,
       "mlAway": 294
      },
      "minToTip": 270,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401909324",
      "matchup": "SAC @ GS",
      "tip": "2026-11-26T03:00Z",
      "side": "home",
      "team": "GS",
      "opp": "SAC",
      "odds": -324,
      "oddsOther": 261,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7339,
      "p": 0.7487,
      "pEngine": 0.7678,
      "trustRule": null,
      "top": [
       {
        "id": "4709138",
        "name": "Brandin Podziemski",
        "min": 32.4
       },
       {
        "id": "5175737",
        "name": "Yaxel Lendeborg",
        "min": 31.7
       },
       {
        "id": "6589",
        "name": "Draymond Green",
        "min": 25.7
       },
       {
        "id": "4066436",
        "name": "De'Anthony Melton",
        "min": 22.3
       },
       {
        "id": "4897262",
        "name": "Will Richard",
        "min": 19.6
       }
      ],
      "open": {
       "mlHome": -241,
       "mlAway": 199
      },
      "minToTip": 360,
      "result": {
       "outcome": "hit"
      }
     },
     {
      "type": "ml",
      "game": "401909321",
      "matchup": "LAC @ MEM",
      "tip": "2026-11-26T01:00Z",
      "side": "home",
      "team": "MEM",
      "opp": "LAC",
      "odds": -269,
      "oddsOther": 220,
      "book": "DraftKings",
      "flagBook": false,
      "priceSource": "slate",
      "pNoVig": 0.7,
      "p": 0.7126,
      "pEngine": 0.7919,
      "trustRule": "R2",
      "top": [
       {
        "id": "4065733",
        "name": "Ty Jerome",
        "min": 30.2
       },
       {
        "id": "4903027",
        "name": "Cedric Coward",
        "min": 28.9
       },
       {
        "id": "5112087",
        "name": "Jaylen Wells",
        "min": 26.3
       },
       {
        "id": "4433083",
        "name": "Cam Spencer",
        "min": 22.8
       },
       {
        "id": "4781746",
        "name": "Javon Small",
        "min": 21.9
       }
      ],
      "open": {
       "mlHome": -276,
       "mlAway": 226
      },
      "minToTip": 240,
      "result": {
       "outcome": "hit"
      }
     }
    ],
    "p": 0.4141,
    "fairAmerican": 142,
    "price": 127,
    "quote": null,
    "result": {
     "outcome": "win",
     "legsHit": 3,
     "units": 1.27
    }
   },
   "pitch3": {
    "legs": [
     {
      "date": "2026-11-25",
      "gameId": "401909317",
      "matchup": "MIA @ PHI",
      "tip": "2026-11-25T22:00Z",
      "team": "PHI",
      "opp": "MIA",
      "side": "home",
      "tier": "8+",
      "pModel": 0.6155,
      "pFeed": null,
      "pMarket": 0.4989,
      "edge": 0.1166,
      "odds": -108,
      "close": -108,
      "pClose": 0.4989,
      "hours": 1,
      "source": "backfill",
      "hit": true
     },
     {
      "date": "2026-11-25",
      "gameId": "401909321",
      "matchup": "LAC @ MEM",
      "tip": "2026-11-26T01:00Z",
      "team": "MEM",
      "opp": "LAC",
      "side": "home",
      "tier": "8+",
      "pModel": 0.7919,
      "pFeed": null,
      "pMarket": 0.7,
      "edge": 0.0919,
      "odds": -269,
      "close": -269,
      "pClose": 0.7,
      "hours": 4,
      "source": "backfill",
      "hit": true
     }
    ],
    "pair": {
     "date": "2026-11-25",
     "legs": [
      {
       "date": "2026-11-25",
       "gameId": "401909317",
       "matchup": "MIA @ PHI",
       "tip": "2026-11-25T22:00Z",
       "team": "PHI",
       "opp": "MIA",
       "side": "home",
       "tier": "8+",
       "pModel": 0.6155,
       "pFeed": null,
       "pMarket": 0.4989,
       "edge": 0.1166,
       "odds": -108,
       "close": -108,
       "pClose": 0.4989,
       "hours": 1,
       "source": "backfill",
       "hit": true
      },
      {
       "date": "2026-11-25",
       "gameId": "401909321",
       "matchup": "LAC @ MEM",
       "tip": "2026-11-26T01:00Z",
       "team": "MEM",
       "opp": "LAC",
       "side": "home",
       "tier": "8+",
       "pModel": 0.7919,
       "pFeed": null,
       "pMarket": 0.7,
       "edge": 0.0919,
       "odds": -269,
       "close": -269,
       "pClose": 0.7,
       "hours": 4,
       "source": "backfill",
       "hit": true
      }
     ],
     "pModel": 0.4874,
     "pMarket": 0.3492,
     "odds": 164,
     "close": 164,
     "hit": true
    }
   },
   "flat": [
    {
     "date": "2026-11-25",
     "gameId": "401909317",
     "team": "MIA",
     "side": "away",
     "odds": -109,
     "close": -109,
     "hit": false
    },
    {
     "date": "2026-11-25",
     "gameId": "401909318",
     "team": "CHA",
     "side": "home",
     "odds": -180,
     "close": -180,
     "hit": false
    },
    {
     "date": "2026-11-25",
     "gameId": "401909319",
     "team": "NY",
     "side": "home",
     "odds": -180,
     "close": -180,
     "hit": true
    },
    {
     "date": "2026-11-25",
     "gameId": "401909320",
     "team": "OKC",
     "side": "home",
     "odds": -135,
     "close": -135,
     "hit": false
    },
    {
     "date": "2026-11-25",
     "gameId": "401909321",
     "team": "MEM",
     "side": "home",
     "odds": -269,
     "close": -269,
     "hit": true
    },
    {
     "date": "2026-11-25",
     "gameId": "401909322",
     "team": "MIL",
     "side": "home",
     "odds": -117,
     "close": -117,
     "hit": false
    },
    {
     "date": "2026-11-25",
     "gameId": "401909325",
     "team": "SA",
     "side": "away",
     "odds": -162,
     "close": -162,
     "hit": false
    }
   ]
  }
 ],
 "summary": {
  "floor": {
   "n": 7,
   "won": 6
  },
  "edge": {
   "n": 2,
   "won": 2,
   "units": 2.58
  },
  "favourites": {
   "n": 7,
   "won": 3,
   "units": -1.13
  },
  "pitch3Straights": {
   "n": 7,
   "won": 7,
   "open": 0,
   "beWins": 4.38,
   "z": 2.1,
   "staked": 175,
   "profit": 113.64,
   "margin": 0.6494
  },
  "pitch3Pairs": {
   "n": 2,
   "won": 2,
   "open": 0,
   "beWins": 0.89,
   "z": 1.59,
   "staked": 50,
   "profit": 64.58,
   "margin": 1.2917
  },
  "flat": {
   "n": 30,
   "won": 16,
   "open": 0,
   "beWins": 18.9,
   "z": -1.11,
   "staked": 750,
   "profit": -126.76,
   "margin": -0.169
  }
 }
};
