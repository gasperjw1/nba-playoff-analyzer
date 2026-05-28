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
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_BET_LEDGER };
}
