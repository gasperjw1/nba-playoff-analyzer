// User Bet Ledger — auto-maintained by test-user-bet-log.js
// Schema docs at top of js/data/user-bet-ledger.js. Add entries via
// the CLI (--add <bet.json>) so id-collision + schema checks run.

const USER_BET_LEDGER = [
  {
    "id": "user-2026-05-21-001",
    "date": "2026-05-21",
    "loggedAt": "2026-05-25T06:32:58.108Z",
    "series": "NYK-CLE",
    "game": 2,
    "type": "parlay",
    "source": "chs-lab-modified",
    "inspiredBy": null,
    "stake": 50,
    "americanOdds": 414,
    "legs": [
      {
        "player": "Jalen Brunson",
        "stat": "pts",
        "line": 16.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": "placed at halftime — re-priced live",
        "hit": true,
        "actualValue": 19
      },
      {
        "player": "Donovan Mitchell",
        "stat": "pts",
        "line": 19.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": "placed at halftime",
        "hit": true,
        "actualValue": 26
      },
      {
        "player": "Mitchell Robinson",
        "stat": "pts",
        "line": 3.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "manual add — Robinson isn't in CHS Lab rotation filter (sub-18min)",
        "hit": true,
        "actualValue": 6
      }
    ],
    "notes": "placed at halftime, both NYK + CLE primary scorers + Robinson as deep-bench scoring leg",
    "result": {
      "outcome": "win",
      "pnl": 207,
      "settledAt": "2026-05-25T06:33:19.059Z"
    }
  },
  {
    "id": "user-2026-05-22-001",
    "date": "2026-05-22",
    "loggedAt": "2026-05-25T06:32:58.113Z",
    "series": "OKC-SAS",
    "game": 3,
    "type": "parlay",
    "source": "chs-lab-modified",
    "inspiredBy": null,
    "stake": 50,
    "americanOdds": -102,
    "legs": [
      {
        "player": "Victor Wembanyama",
        "stat": "pra",
        "line": 29.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": "deep alt above CHS Lab's safer line",
        "hit": true,
        "actualValue": 33
      },
      {
        "player": "Devin Vassell",
        "stat": "pra",
        "line": 14.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": null,
        "hit": true,
        "actualValue": 28
      },
      {
        "player": "Julian Champagnie",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": null,
        "hit": true,
        "actualValue": 10
      },
      {
        "player": "Dylan Harper",
        "stat": "pts",
        "line": 4.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "bench starter — sub-18min so not in CHS Lab pool",
        "hit": true,
        "actualValue": 6
      },
      {
        "player": "De'Aaron Fox",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": null,
        "hit": true,
        "actualValue": 15
      }
    ],
    "notes": "5-leg SAS-heavy stack — starter-only thesis, both teams",
    "result": {
      "outcome": "win",
      "pnl": 49.02,
      "settledAt": "2026-05-25T06:33:19.059Z"
    }
  },
  {
    "id": "user-2026-05-22-002",
    "date": "2026-05-22",
    "loggedAt": "2026-05-25T06:32:58.113Z",
    "series": "OKC-SAS",
    "game": 3,
    "type": "parlay",
    "source": "chs-lab-modified",
    "inspiredBy": null,
    "stake": 50,
    "americanOdds": -128,
    "legs": [
      {
        "player": "Victor Wembanyama",
        "stat": "pra",
        "line": 29.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": null,
        "hit": true,
        "actualValue": 33
      },
      {
        "player": "Chet Holmgren",
        "stat": "pts",
        "line": 18.5,
        "direction": "under",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "UNDER — Wemby suppresses Holmgren scoring",
        "hit": true,
        "actualValue": 8
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pts",
        "line": 17.5,
        "direction": "under",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "UNDER — A.Mitchell quiet 2pts off bench (boxScore corrected 5/24 pass 2)",
        "hit": true,
        "actualValue": 2
      }
    ],
    "notes": "hedge: Wemby OVER + two OKC scoring suppressions. UNDERs are pure manual-thesis",
    "result": {
      "outcome": "win",
      "pnl": 39.06,
      "settledAt": "2026-05-25T07:07:09.224Z"
    }
  },
  {
    "id": "user-2026-05-23-001",
    "date": "2026-05-23",
    "loggedAt": "2026-05-25T06:32:58.113Z",
    "series": "NYK-CLE",
    "game": 3,
    "type": "parlay",
    "source": "chs-lab-modified",
    "inspiredBy": "NYK-CLE-G3-2026-05-23",
    "stake": 50,
    "americanOdds": 100,
    "legs": [
      {
        "player": "OG Anunoby",
        "stat": "pra",
        "line": 19.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": null,
        "hit": true,
        "actualValue": 32
      },
      {
        "player": "Jalen Brunson",
        "stat": "pra",
        "line": 24.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": "deeper alt than CHS Lab's 28.5 candidate",
        "hit": true,
        "actualValue": 39
      },
      {
        "player": "Jarrett Allen",
        "stat": "pra",
        "line": 14.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": null,
        "hit": true,
        "actualValue": 24
      },
      {
        "player": "Karl-Anthony Towns",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": null,
        "note": "deep alt below CHS Lab's 25.5 PRA line",
        "hit": true,
        "actualValue": 13
      },
      {
        "player": "Jalen Brunson",
        "stat": "pts",
        "line": 14.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "second Brunson leg — SGP same-player double prop",
        "hit": true,
        "actualValue": 30
      }
    ],
    "notes": "NYK-stack closeout-game thesis. Brunson twice (PRA + PTS) — SGP-style",
    "result": {
      "outcome": "win",
      "pnl": 50,
      "settledAt": "2026-05-25T06:33:19.059Z"
    }
  },
  {
    "id": "user-2026-05-26-001",
    "date": "2026-05-26",
    "loggedAt": "2026-05-28T21:24:05.428Z",
    "series": "OKC-SAS",
    "game": 5,
    "type": "parlay",
    "source": "chs-lab",
    "inspiredBy": "OKC-SAS-G5-2026-05-26",
    "stake": 50,
    "americanOdds": 250,
    "legs": [
      {
        "player": "Julian Champagnie",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "odds": -350,
        "fromCandidate": true,
        "candidateHitRate": 0.9,
        "note": "CHS Lab reliable candidate — role-player PRA floor",
        "hit": true,
        "actualValue": 28
      },
      {
        "player": "Keldon Johnson",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "odds": -350,
        "fromCandidate": true,
        "candidateHitRate": 0.9,
        "note": "CHS Lab reliable candidate — role-player PRA floor",
        "hit": true,
        "actualValue": 15
      },
      {
        "player": "Dylan Harper",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "odds": -350,
        "fromCandidate": true,
        "candidateHitRate": 0.88,
        "note": "CHS Lab reliable candidate — rookie role-player PRA floor",
        "hit": true,
        "actualValue": 14
      },
      {
        "player": "Dylan Harper",
        "stat": "threes",
        "line": 0.5,
        "direction": "over",
        "odds": -160,
        "fromCandidate": true,
        "candidateHitRate": 0.78,
        "note": "CHS Lab candidate — at least one make",
        "hit": true,
        "actualValue": 1
      }
    ],
    "notes": "All 4 legs taken directly from CHS Lab reliable candidates. SAS role-player PRA floor stack — hit despite SAS losing G5 by 13 (role-player counting-stat floors are blowout-resilient). Stake + odds estimated (user reported the win but not the slip $/price).",
    "result": {
      "outcome": "win",
      "pnl": 125,
      "settledAt": "2026-05-28T21:24:05.586Z"
    }
  },
  {
    "id": "user-2026-06-03-001",
    "date": "2026-06-03",
    "loggedAt": "2026-06-03T20:23:04.008Z",
    "series": "SAS-NYK",
    "game": 1,
    "type": "parlay",
    "source": "chs-lab-modified",
    "inspiredBy": "SAS-NYK-G1-2026-06-03",
    "stake": 50,
    "americanOdds": 130,
    "legs": [
      {
        "player": "Jalen Brunson",
        "stat": "pts",
        "line": 19.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "OPPOSITE-DIRECTION to model's Brunson U26.5 PTS lean — user pivoted to the OVER at a deep-alt threshold 7pts below the standard line. Brunson ECF avg 25.5 PPG; getting to 20 even vs Castle suppression is very likely. Classic Phase 65 reliable floor — deep alt below central projection.",
        "hit": null,
        "actualValue": null
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pts",
        "line": 31.5,
        "direction": "under",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "Inverse of model's Wemby OVER lean (PRA O32.5, PTS O27.5). U31.5 PTS is a much higher line than O27.5 — gives more cushion. Wemby's WCF PTS avg 25; Finals G1 layoff rust caveat. Statistically safer UNDER than the model's OVER side at 27.5.",
        "hit": null,
        "actualValue": null
      },
      {
        "player": "Julian Champagnie",
        "stat": "pra",
        "line": 14.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": true,
        "candidateHitRate": 0.74,
        "note": "FanDuel's minimum Champagnie PRA line — the model's 9.5 alt was NOT available. Champagnie WCF last 3 games: 28/18/26 PRA → 14.5 still clears comfortably. LINE-AVAILABILITY GAP: book floor is 14.5 vs model floor 9.5 — meaningful calibration note for Phase 73 (the +5pt jump from candidate-to-book makes book lines lower hit-rate than model candidate hit-rates).",
        "hit": null,
        "actualValue": null
      }
    ],
    "notes": "FanDuel 3-leg parlay (~+130). Adapts the model's role-player PRA + market-line discipline to AVAILABLE FD alt lines (model candidate Champagnie 9.5 was not offered — minimum 14.5). Cross-team scoring stack with Brunson floor + Wemby ceiling-cap + Champagnie role-player floor. Hedges direction on the two stars.",
    "result": null
  },
  {
    "id": "user-2026-06-03-002",
    "date": "2026-06-03",
    "loggedAt": "2026-06-03T20:23:04.013Z",
    "series": "SAS-NYK",
    "game": 1,
    "type": "parlay",
    "source": "chs-lab-modified",
    "inspiredBy": "SAS-NYK-G1-2026-06-03",
    "stake": 50,
    "americanOdds": 125,
    "legs": [
      {
        "player": "Dylan Harper",
        "stat": "threes",
        "line": 0.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "Rookie Harper made at least one three in WCF G5/G7. Series 3PT trajectory rising; bench scoring role secure. The 'at least one make' bet is a statistical floor on a 24-min bench guard.",
        "hit": null,
        "actualValue": null
      },
      {
        "player": "Keldon Johnson",
        "stat": "threes",
        "line": 0.5,
        "direction": "over",
        "odds": null,
        "fromCandidate": false,
        "candidateHitRate": null,
        "note": "Keldon ~36% from 3 across WCF; 18-24 min bench wing role. Same 'at least one make' statistical floor — even modest minutes + average shooting hits 0.5 makes consistently.",
        "hit": null,
        "actualValue": null
      }
    ],
    "notes": "FanDuel 2-leg role-player 3PT-make floor (~+125). Same diversified-role-player-floor thesis as the PRA stack but on a different stat dimension — 'at least one make from 3' is statistically floor-like for any 36%+ shooter in 20+min. Phase 73x candidate: validate this dimension across the playoffs (currently undocumented).",
    "result": null
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_BET_LEDGER };
}
