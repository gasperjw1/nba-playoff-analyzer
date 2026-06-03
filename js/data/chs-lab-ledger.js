// CHS Lab Ledger — auto-maintained by test-chs-lab-ledger-update.js
// To regenerate manually, edit this file directly. Comments at the top of
// js/data/chs-lab-ledger.js explain the schema.

const CHS_LAB_LEDGER = [
  {
    "date": "2026-05-23",
    "series": "NYK-CLE",
    "game": 3,
    "capturedAt": "2026-05-23T22:36:14.741Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.518,
      "blowoutRisk": 0.206,
      "marginP50": 0.7
    },
    "candidates": [
      {
        "player": "Jalen Brunson",
        "stat": "pra",
        "line": 28.5,
        "direction": "over",
        "hitRate": 0.803,
        "estJuice": -408,
        "team": "NYK",
        "position": "PG",
        "projMinutes": 39
      },
      {
        "player": "Miles McBride",
        "stat": "ast",
        "line": 1.5,
        "direction": "over",
        "hitRate": 0.802,
        "estJuice": -405,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 24
      },
      {
        "player": "Evan Mobley",
        "stat": "pra",
        "line": 21.5,
        "direction": "over",
        "hitRate": 0.809,
        "estJuice": -424,
        "team": "CLE",
        "position": "PF",
        "projMinutes": 37
      },
      {
        "player": "Karl-Anthony Towns",
        "stat": "pra",
        "line": 25.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "NYK",
        "position": "C",
        "projMinutes": 37
      },
      {
        "player": "Mikal Bridges",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.806,
        "estJuice": -415,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 34
      },
      {
        "player": "Miles McBride",
        "stat": "pts",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.805,
        "estJuice": -413,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 24
      },
      {
        "player": "Dennis Schroder",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "CLE",
        "position": "PG",
        "projMinutes": 18
      },
      {
        "player": "OG Anunoby",
        "stat": "reb",
        "line": 4.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 22
      },
      {
        "player": "Josh Hart",
        "stat": "pts",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 38
      },
      {
        "player": "James Harden",
        "stat": "pra",
        "line": 23.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "CLE",
        "position": "PG",
        "projMinutes": 38
      },
      {
        "player": "Miles McBride",
        "stat": "pra",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 24
      },
      {
        "player": "Donovan Mitchell",
        "stat": "pra",
        "line": 28.5,
        "direction": "over",
        "hitRate": 0.811,
        "estJuice": -429,
        "team": "CLE",
        "position": "SG",
        "projMinutes": 39
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.426,
      "calibratedCombined": 0.127,
      "americanOdds": 135,
      "stake": 100,
      "legs": [
        {
          "player": "Jalen Brunson",
          "stat": "pra",
          "line": 28.5,
          "direction": "over",
          "hitRate": 0.803,
          "estJuice": -408,
          "team": "NYK",
          "position": "PG",
          "projMinutes": 39
        },
        {
          "player": "Miles McBride",
          "stat": "ast",
          "line": 1.5,
          "direction": "over",
          "hitRate": 0.802,
          "estJuice": -405,
          "team": "NYK",
          "position": "SG",
          "projMinutes": 24
        },
        {
          "player": "Evan Mobley",
          "stat": "pra",
          "line": 21.5,
          "direction": "over",
          "hitRate": 0.809,
          "estJuice": -424,
          "team": "CLE",
          "position": "PF",
          "projMinutes": 37
        },
        {
          "player": "Dennis Schroder",
          "stat": "pra",
          "line": 9.5,
          "direction": "over",
          "hitRate": 0.815,
          "estJuice": -441,
          "team": "CLE",
          "position": "PG",
          "projMinutes": 18
        }
      ]
    },
    "actual": {
      "winner": "NYK",
      "homeScore": 121,
      "awayScore": 108,
      "margin": 13
    },
    "settlement": {
      "reliable": null,
      "traditional": {
        "outcome": "loss",
        "legResults": [
          {
            "player": "Jalen Brunson",
            "stat": "pra",
            "line": 28.5,
            "hit": true,
            "actualValue": 39
          },
          {
            "player": "Miles McBride",
            "stat": "ast",
            "line": 1.5,
            "hit": false,
            "actualValue": 0
          },
          {
            "player": "Evan Mobley",
            "stat": "pra",
            "line": 21.5,
            "hit": true,
            "actualValue": 32
          },
          {
            "player": "Dennis Schroder",
            "stat": "pra",
            "line": 9.5,
            "hit": false,
            "actualValue": 5
          }
        ],
        "pnl": -100
      },
      "settledAt": "2026-05-24T22:35:24.757Z"
    }
  },
  {
    "date": "2026-05-24",
    "series": "OKC-SAS",
    "game": 4,
    "capturedAt": "2026-05-24T22:50:48.772Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.534,
      "blowoutRisk": 0.254,
      "marginP50": 1.4
    },
    "candidates": [
      {
        "player": "Keldon Johnson",
        "stat": "pts",
        "line": 5.5,
        "direction": "over",
        "hitRate": 0.801,
        "estJuice": -403,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 24
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pts",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 21.3
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pra",
        "line": 12.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 21.3
      },
      {
        "player": "Devin Vassell",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 33.3
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pra",
        "line": 26.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "C",
        "projMinutes": 38.3
      },
      {
        "player": "Alex Caruso",
        "stat": "pra",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.81,
        "estJuice": -426,
        "team": "OKC",
        "position": "SG",
        "projMinutes": 28.7
      },
      {
        "player": "Victor Wembanyama",
        "stat": "reb",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.82,
        "estJuice": -456,
        "team": "SAS",
        "position": "C",
        "projMinutes": 38.3
      },
      {
        "player": "Julian Champagnie",
        "stat": "pra",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.82,
        "estJuice": -456,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 21.3
      },
      {
        "player": "Julian Champagnie",
        "stat": "pts",
        "line": 6.5,
        "direction": "over",
        "hitRate": 0.819,
        "estJuice": -452,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 21.3
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pra",
        "line": 21.5,
        "direction": "over",
        "hitRate": 0.829,
        "estJuice": -485,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 39.3
      },
      {
        "player": "Keldon Johnson",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.828,
        "estJuice": -481,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 24
      },
      {
        "player": "Stephon Castle",
        "stat": "pts",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.826,
        "estJuice": -475,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 37.3
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.425,
      "calibratedCombined": 0.128,
      "americanOdds": 134,
      "stake": 100,
      "legs": [
        {
          "player": "Keldon Johnson",
          "stat": "pts",
          "line": 5.5,
          "direction": "over",
          "hitRate": 0.801,
          "estJuice": -403,
          "team": "SAS",
          "position": "SF",
          "projMinutes": 24
        },
        {
          "player": "Ajay Mitchell",
          "stat": "pts",
          "line": 7.5,
          "direction": "over",
          "hitRate": 0.807,
          "estJuice": -418,
          "team": "OKC",
          "position": "PG",
          "projMinutes": 21.3
        },
        {
          "player": "Devin Vassell",
          "stat": "pts",
          "line": 9.5,
          "direction": "over",
          "hitRate": 0.815,
          "estJuice": -441,
          "team": "SAS",
          "position": "SG",
          "projMinutes": 33.3
        },
        {
          "player": "Alex Caruso",
          "stat": "pra",
          "line": 7.5,
          "direction": "over",
          "hitRate": 0.81,
          "estJuice": -426,
          "team": "OKC",
          "position": "SG",
          "projMinutes": 28.7
        }
      ]
    },
    "actual": {
      "winner": "SAS",
      "homeScore": 82,
      "awayScore": 103,
      "margin": 21
    },
    "settlement": {
      "reliable": null,
      "traditional": {
        "outcome": "win",
        "legResults": [
          {
            "player": "Keldon Johnson",
            "stat": "pts",
            "line": 5.5,
            "hit": true,
            "actualValue": 9
          },
          {
            "player": "Ajay Mitchell",
            "stat": "pts",
            "line": 7.5,
            "hit": true,
            "actualValue": 8
          },
          {
            "player": "Devin Vassell",
            "stat": "pts",
            "line": 9.5,
            "hit": true,
            "actualValue": 13
          },
          {
            "player": "Alex Caruso",
            "stat": "pra",
            "line": 7.5,
            "hit": true,
            "actualValue": 12
          }
        ],
        "pnl": 134
      },
      "settledAt": "2026-05-25T17:57:41.538Z"
    }
  },
  {
    "date": "2026-05-25",
    "series": "NYK-CLE",
    "game": 4,
    "capturedAt": "2026-05-25T17:57:42.327Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.467,
      "blowoutRisk": 0.211,
      "marginP50": -1.1
    },
    "candidates": [
      {
        "player": "OG Anunoby",
        "stat": "reb",
        "line": 4.5,
        "direction": "over",
        "hitRate": 0.802,
        "estJuice": -405,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 25
      },
      {
        "player": "Karl-Anthony Towns",
        "stat": "pts",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.809,
        "estJuice": -424,
        "team": "NYK",
        "position": "C",
        "projMinutes": 36.7
      },
      {
        "player": "Josh Hart",
        "stat": "ast",
        "line": 2.5,
        "direction": "over",
        "hitRate": 0.809,
        "estJuice": -424,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 37
      },
      {
        "player": "Jarrett Allen",
        "stat": "reb",
        "line": 5.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "CLE",
        "position": "C",
        "projMinutes": 32.7
      },
      {
        "player": "OG Anunoby",
        "stat": "pts",
        "line": 14.5,
        "direction": "over",
        "hitRate": 0.804,
        "estJuice": -410,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 25
      },
      {
        "player": "Jalen Brunson",
        "stat": "pra",
        "line": 25.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "NYK",
        "position": "PG",
        "projMinutes": 39.7
      },
      {
        "player": "Jalen Brunson",
        "stat": "ast",
        "line": 3.5,
        "direction": "over",
        "hitRate": 0.814,
        "estJuice": -438,
        "team": "NYK",
        "position": "PG",
        "projMinutes": 39.7
      },
      {
        "player": "Mikal Bridges",
        "stat": "reb",
        "line": 2.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 35.7
      },
      {
        "player": "Miles McBride",
        "stat": "reb",
        "line": 1.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 20.7
      },
      {
        "player": "Max Strus",
        "stat": "pts",
        "line": 6.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "CLE",
        "position": "SG",
        "projMinutes": 28.3
      },
      {
        "player": "Jalen Brunson",
        "stat": "pts",
        "line": 17.5,
        "direction": "over",
        "hitRate": 0.823,
        "estJuice": -465,
        "team": "NYK",
        "position": "PG",
        "projMinutes": 39.7
      },
      {
        "player": "Josh Hart",
        "stat": "reb",
        "line": 4.5,
        "direction": "over",
        "hitRate": 0.823,
        "estJuice": -465,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 37
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.428,
      "calibratedCombined": 0.127,
      "americanOdds": 135,
      "stake": 100,
      "legs": [
        {
          "player": "OG Anunoby",
          "stat": "reb",
          "line": 4.5,
          "direction": "over",
          "hitRate": 0.802,
          "estJuice": -405,
          "team": "NYK",
          "position": "SF",
          "projMinutes": 25
        },
        {
          "player": "Karl-Anthony Towns",
          "stat": "pts",
          "line": 11.5,
          "direction": "over",
          "hitRate": 0.809,
          "estJuice": -424,
          "team": "NYK",
          "position": "C",
          "projMinutes": 36.7
        },
        {
          "player": "Jarrett Allen",
          "stat": "reb",
          "line": 5.5,
          "direction": "over",
          "hitRate": 0.807,
          "estJuice": -418,
          "team": "CLE",
          "position": "C",
          "projMinutes": 32.7
        },
        {
          "player": "Max Strus",
          "stat": "pts",
          "line": 6.5,
          "direction": "over",
          "hitRate": 0.812,
          "estJuice": -432,
          "team": "CLE",
          "position": "SG",
          "projMinutes": 28.3
        }
      ]
    },
    "actual": {
      "winner": "NYK",
      "homeScore": 130,
      "awayScore": 93,
      "margin": 37
    },
    "settlement": {
      "reliable": null,
      "traditional": {
        "outcome": "win",
        "legResults": [
          {
            "player": "OG Anunoby",
            "stat": "reb",
            "line": 4.5,
            "hit": true,
            "actualValue": 5
          },
          {
            "player": "Karl-Anthony Towns",
            "stat": "pts",
            "line": 11.5,
            "hit": true,
            "actualValue": 19
          },
          {
            "player": "Jarrett Allen",
            "stat": "reb",
            "line": 5.5,
            "hit": true,
            "actualValue": 6
          },
          {
            "player": "Max Strus",
            "stat": "pts",
            "line": 6.5,
            "hit": true,
            "actualValue": 8
          }
        ],
        "pnl": 135
      },
      "settledAt": "2026-05-26T15:25:01.426Z"
    }
  },
  {
    "date": "2026-05-26",
    "series": "OKC-SAS",
    "game": 5,
    "capturedAt": "2026-05-26T15:25:02.261Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.555,
      "blowoutRisk": 0.233,
      "marginP50": 1.9
    },
    "candidates": [
      {
        "player": "Keldon Johnson",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.806,
        "estJuice": -415,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 23.5
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pra",
        "line": 21.5,
        "direction": "over",
        "hitRate": 0.805,
        "estJuice": -413,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 38.5
      },
      {
        "player": "Devin Vassell",
        "stat": "pra",
        "line": 15.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 32.8
      },
      {
        "player": "De'Aaron Fox",
        "stat": "pra",
        "line": 18.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 29.3
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pts",
        "line": 14.5,
        "direction": "over",
        "hitRate": 0.811,
        "estJuice": -429,
        "team": "SAS",
        "position": "C",
        "projMinutes": 37.8
      },
      {
        "player": "Stephon Castle",
        "stat": "pts",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.81,
        "estJuice": -426,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 36.5
      },
      {
        "player": "Stephon Castle",
        "stat": "pra",
        "line": 17.5,
        "direction": "over",
        "hitRate": 0.819,
        "estJuice": -452,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 36.5
      },
      {
        "player": "Isaiah Hartenstein",
        "stat": "pra",
        "line": 15.5,
        "direction": "over",
        "hitRate": 0.829,
        "estJuice": -485,
        "team": "OKC",
        "position": "C",
        "projMinutes": 23.5
      },
      {
        "player": "Dylan Harper",
        "stat": "pra",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.827,
        "estJuice": -478,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 25.5
      },
      {
        "player": "Lu Dort",
        "stat": "pra",
        "line": 8.5,
        "direction": "over",
        "hitRate": 0.831,
        "estJuice": -492,
        "team": "OKC",
        "position": "SG",
        "projMinutes": 27
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.424,
      "calibratedCombined": 0.132,
      "americanOdds": 129,
      "stake": 100,
      "legs": [
        {
          "player": "Keldon Johnson",
          "stat": "pra",
          "line": 9.5,
          "direction": "over",
          "hitRate": 0.806,
          "estJuice": -415,
          "team": "SAS",
          "position": "SF",
          "projMinutes": 23.5
        },
        {
          "player": "Shai Gilgeous-Alexander",
          "stat": "pra",
          "line": 21.5,
          "direction": "over",
          "hitRate": 0.805,
          "estJuice": -413,
          "team": "OKC",
          "position": "PG",
          "projMinutes": 38.5
        },
        {
          "player": "Devin Vassell",
          "stat": "pra",
          "line": 15.5,
          "direction": "over",
          "hitRate": 0.813,
          "estJuice": -435,
          "team": "SAS",
          "position": "SG",
          "projMinutes": 32.8
        },
        {
          "player": "Isaiah Hartenstein",
          "stat": "pra",
          "line": 15.5,
          "direction": "over",
          "hitRate": 0.829,
          "estJuice": -485,
          "team": "OKC",
          "position": "C",
          "projMinutes": 23.5
        }
      ]
    },
    "actual": {
      "winner": "OKC",
      "homeScore": 127,
      "awayScore": 114,
      "margin": 13
    },
    "settlement": {
      "reliable": null,
      "traditional": {
        "outcome": "win",
        "legResults": [
          {
            "player": "Keldon Johnson",
            "stat": "pra",
            "line": 9.5,
            "hit": true,
            "actualValue": 15
          },
          {
            "player": "Shai Gilgeous-Alexander",
            "stat": "pra",
            "line": 21.5,
            "hit": true,
            "actualValue": 46
          },
          {
            "player": "Devin Vassell",
            "stat": "pra",
            "line": 15.5,
            "hit": true,
            "actualValue": 20
          },
          {
            "player": "Isaiah Hartenstein",
            "stat": "pra",
            "line": 15.5,
            "hit": true,
            "actualValue": 30
          }
        ],
        "pnl": 129
      },
      "settledAt": "2026-05-28T20:44:44.743Z"
    }
  },
  {
    "date": "2026-05-28",
    "series": "OKC-SAS",
    "game": 6,
    "capturedAt": "2026-05-28T20:44:45.713Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.491,
      "blowoutRisk": 0.406,
      "marginP50": -0.4
    },
    "candidates": [
      {
        "player": "De'Aaron Fox",
        "stat": "pra",
        "line": 18.5,
        "direction": "over",
        "hitRate": 0.801,
        "estJuice": -403,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 30.2
      },
      {
        "player": "Victor Wembanyama",
        "stat": "reb",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.805,
        "estJuice": -413,
        "team": "SAS",
        "position": "C",
        "projMinutes": 37.8
      },
      {
        "player": "Keldon Johnson",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.805,
        "estJuice": -413,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 23.2
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pra",
        "line": 25.5,
        "direction": "over",
        "hitRate": 0.814,
        "estJuice": -438,
        "team": "SAS",
        "position": "C",
        "projMinutes": 37.8
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pts",
        "line": 14.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "C",
        "projMinutes": 37.8
      },
      {
        "player": "Julian Champagnie",
        "stat": "pts",
        "line": 6.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 22
      },
      {
        "player": "Stephon Castle",
        "stat": "pts",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 36.8
      },
      {
        "player": "Stephon Castle",
        "stat": "pra",
        "line": 17.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 36.8
      },
      {
        "player": "Dylan Harper",
        "stat": "pra",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.811,
        "estJuice": -429,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 24
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pts",
        "line": 14.5,
        "direction": "over",
        "hitRate": 0.81,
        "estJuice": -426,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 38.6
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pra",
        "line": 20.5,
        "direction": "over",
        "hitRate": 0.821,
        "estJuice": -459,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 38.6
      },
      {
        "player": "Devin Vassell",
        "stat": "pra",
        "line": 15.5,
        "direction": "over",
        "hitRate": 0.818,
        "estJuice": -449,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 32.8
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.432,
      "calibratedCombined": 0.131,
      "americanOdds": 131,
      "stake": 100,
      "legs": [
        {
          "player": "De'Aaron Fox",
          "stat": "pra",
          "line": 18.5,
          "direction": "over",
          "hitRate": 0.801,
          "estJuice": -403,
          "team": "SAS",
          "position": "PG",
          "projMinutes": 30.2
        },
        {
          "player": "Victor Wembanyama",
          "stat": "reb",
          "line": 7.5,
          "direction": "over",
          "hitRate": 0.805,
          "estJuice": -413,
          "team": "SAS",
          "position": "C",
          "projMinutes": 37.8
        },
        {
          "player": "Shai Gilgeous-Alexander",
          "stat": "pts",
          "line": 14.5,
          "direction": "over",
          "hitRate": 0.81,
          "estJuice": -426,
          "team": "OKC",
          "position": "PG",
          "projMinutes": 38.6
        },
        {
          "player": "Cason Wallace",
          "stat": "pra",
          "line": 8.5,
          "direction": "over",
          "hitRate": 0.829,
          "estJuice": -485,
          "team": "OKC",
          "position": "SG",
          "projMinutes": 26.4
        }
      ]
    },
    "actual": {
      "winner": "SAS",
      "homeScore": 91,
      "awayScore": 118,
      "margin": 27
    },
    "settlement": {
      "reliable": null,
      "traditional": {
        "outcome": "loss",
        "legResults": [
          {
            "player": "De'Aaron Fox",
            "stat": "pra",
            "line": 18.5,
            "hit": false,
            "actualValue": 17
          },
          {
            "player": "Victor Wembanyama",
            "stat": "reb",
            "line": 7.5,
            "hit": true,
            "actualValue": 10
          },
          {
            "player": "Shai Gilgeous-Alexander",
            "stat": "pts",
            "line": 14.5,
            "hit": true,
            "actualValue": 15
          },
          {
            "player": "Cason Wallace",
            "stat": "pra",
            "line": 8.5,
            "hit": true,
            "actualValue": 13
          }
        ],
        "pnl": -100
      },
      "settledAt": "2026-05-29T16:23:15.691Z"
    }
  },
  {
    "date": "2026-05-30",
    "series": "OKC-SAS",
    "game": 7,
    "capturedAt": "2026-05-29T16:23:16.561Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.534,
      "blowoutRisk": 0.366,
      "marginP50": 2
    },
    "candidates": [
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pts",
        "line": 14.5,
        "direction": "over",
        "hitRate": 0.808,
        "estJuice": -421,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 36.8
      },
      {
        "player": "Victor Wembanyama",
        "stat": "reb",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.806,
        "estJuice": -415,
        "team": "SAS",
        "position": "C",
        "projMinutes": 36.2
      },
      {
        "player": "Stephon Castle",
        "stat": "pra",
        "line": 17.5,
        "direction": "over",
        "hitRate": 0.806,
        "estJuice": -415,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 36
      },
      {
        "player": "Julian Champagnie",
        "stat": "pts",
        "line": 6.5,
        "direction": "over",
        "hitRate": 0.804,
        "estJuice": -410,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 22.5
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pra",
        "line": 20.5,
        "direction": "over",
        "hitRate": 0.816,
        "estJuice": -443,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 36.8
      },
      {
        "player": "Dylan Harper",
        "stat": "pra",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.816,
        "estJuice": -443,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 23.7
      },
      {
        "player": "Keldon Johnson",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 23.3
      },
      {
        "player": "Dylan Harper",
        "stat": "threes",
        "line": 0.5,
        "direction": "over",
        "hitRate": 0.817,
        "estJuice": -446,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 23.7
      },
      {
        "player": "Chet Holmgren",
        "stat": "pra",
        "line": 18.5,
        "direction": "over",
        "hitRate": 0.829,
        "estJuice": -485,
        "team": "OKC",
        "position": "C",
        "projMinutes": 31
      },
      {
        "player": "Lu Dort",
        "stat": "pra",
        "line": 8.5,
        "direction": "over",
        "hitRate": 0.832,
        "estJuice": -495,
        "team": "OKC",
        "position": "SG",
        "projMinutes": 27
      },
      {
        "player": "Julian Champagnie",
        "stat": "threes",
        "line": 0.5,
        "direction": "over",
        "hitRate": 0.831,
        "estJuice": -492,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 22.5
      },
      {
        "player": "Alex Caruso",
        "stat": "reb",
        "line": 1.5,
        "direction": "over",
        "hitRate": 0.83,
        "estJuice": -488,
        "team": "OKC",
        "position": "SG",
        "projMinutes": 26.8
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.437,
      "calibratedCombined": 0.131,
      "americanOdds": 130,
      "stake": 100,
      "legs": [
        {
          "player": "Shai Gilgeous-Alexander",
          "stat": "pts",
          "line": 14.5,
          "direction": "over",
          "hitRate": 0.808,
          "estJuice": -421,
          "team": "OKC",
          "position": "PG",
          "projMinutes": 36.8
        },
        {
          "player": "Victor Wembanyama",
          "stat": "reb",
          "line": 7.5,
          "direction": "over",
          "hitRate": 0.806,
          "estJuice": -415,
          "team": "SAS",
          "position": "C",
          "projMinutes": 36.2
        },
        {
          "player": "Stephon Castle",
          "stat": "pra",
          "line": 17.5,
          "direction": "over",
          "hitRate": 0.806,
          "estJuice": -415,
          "team": "SAS",
          "position": "SG",
          "projMinutes": 36
        },
        {
          "player": "Chet Holmgren",
          "stat": "pra",
          "line": 18.5,
          "direction": "over",
          "hitRate": 0.829,
          "estJuice": -485,
          "team": "OKC",
          "position": "C",
          "projMinutes": 31
        }
      ]
    },
    "actual": {
      "winner": "SAS",
      "homeScore": 103,
      "awayScore": 111,
      "margin": 8
    },
    "settlement": {
      "reliable": null,
      "traditional": {
        "outcome": "loss",
        "legResults": [
          {
            "player": "Shai Gilgeous-Alexander",
            "stat": "pts",
            "line": 14.5,
            "hit": true,
            "actualValue": 35,
            "note": "Manually resolved — boxScore uses 'SGA' shorthand; auto-resolver couldn't match."
          },
          {
            "player": "Victor Wembanyama",
            "stat": "reb",
            "line": 7.5,
            "hit": false,
            "actualValue": 7
          },
          {
            "player": "Stephon Castle",
            "stat": "pra",
            "line": 17.5,
            "hit": true,
            "actualValue": 29
          },
          {
            "player": "Chet Holmgren",
            "stat": "pra",
            "line": 18.5,
            "hit": true,
            "actualValue": 22
          }
        ],
        "pnl": -100
      },
      "settledAt": "2026-06-03T20:11:02.689Z"
    }
  },
  {
    "date": "2026-06-03",
    "series": "SAS-NYK",
    "game": 1,
    "capturedAt": "2026-06-03T20:11:47.351Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.532,
      "blowoutRisk": 0.214,
      "marginP50": 1.2
    },
    "candidates": [
      {
        "player": "De'Aaron Fox",
        "stat": "pra",
        "line": 23.5,
        "direction": "over",
        "hitRate": 0.802,
        "estJuice": -405,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 32
      },
      {
        "player": "Josh Hart",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.802,
        "estJuice": -405,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 22
      },
      {
        "player": "Devin Vassell",
        "stat": "ast",
        "line": 2.5,
        "direction": "over",
        "hitRate": 0.809,
        "estJuice": -424,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 28
      },
      {
        "player": "Stephon Castle",
        "stat": "pts",
        "line": 13.5,
        "direction": "over",
        "hitRate": 0.808,
        "estJuice": -421,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 28
      },
      {
        "player": "Karl-Anthony Towns",
        "stat": "pra",
        "line": 30.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "NYK",
        "position": "C",
        "projMinutes": 32
      },
      {
        "player": "OG Anunoby",
        "stat": "pra",
        "line": 26.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 28
      },
      {
        "player": "Josh Hart",
        "stat": "pra",
        "line": 20.5,
        "direction": "over",
        "hitRate": 0.806,
        "estJuice": -415,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 22
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pts",
        "line": 18.5,
        "direction": "over",
        "hitRate": 0.816,
        "estJuice": -443,
        "team": "SAS",
        "position": "C",
        "projMinutes": 35
      },
      {
        "player": "Victor Wembanyama",
        "stat": "ast",
        "line": 1.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "SAS",
        "position": "C",
        "projMinutes": 35
      },
      {
        "player": "Victor Wembanyama",
        "stat": "reb",
        "line": 8.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "C",
        "projMinutes": 35
      },
      {
        "player": "Devin Vassell",
        "stat": "pts",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 28
      },
      {
        "player": "Julian Champagnie",
        "stat": "reb",
        "line": 3.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 22
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.41,
      "calibratedCombined": 0.125,
      "americanOdds": 138,
      "stake": 100,
      "legs": [
        {
          "player": "De'Aaron Fox",
          "stat": "pra",
          "line": 23.5,
          "direction": "over",
          "hitRate": 0.802,
          "estJuice": -405,
          "team": "SAS",
          "position": "PG",
          "projMinutes": 32
        },
        {
          "player": "Josh Hart",
          "stat": "pts",
          "line": 9.5,
          "direction": "over",
          "hitRate": 0.802,
          "estJuice": -405,
          "team": "NYK",
          "position": "SG",
          "projMinutes": 22
        },
        {
          "player": "Devin Vassell",
          "stat": "ast",
          "line": 2.5,
          "direction": "over",
          "hitRate": 0.809,
          "estJuice": -424,
          "team": "SAS",
          "position": "SG",
          "projMinutes": 28
        },
        {
          "player": "Karl-Anthony Towns",
          "stat": "pra",
          "line": 30.5,
          "direction": "over",
          "hitRate": 0.807,
          "estJuice": -418,
          "team": "NYK",
          "position": "C",
          "projMinutes": 32
        }
      ]
    },
    "actual": null,
    "settlement": null
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHS_LAB_LEDGER };
}
