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
    "date": "2026-05-23",
    "series": "OKC-SAS",
    "game": 4,
    "capturedAt": "2026-05-23T22:36:15.606Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.525,
      "blowoutRisk": 0.243,
      "marginP50": 1
    },
    "candidates": [
      {
        "player": "Chet Holmgren",
        "stat": "pts",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.803,
        "estJuice": -408,
        "team": "OKC",
        "position": "C",
        "projMinutes": 33
      },
      {
        "player": "Devin Vassell",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.807,
        "estJuice": -418,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 33.3
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pts",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.816,
        "estJuice": -443,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 21.3
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pra",
        "line": 12.5,
        "direction": "over",
        "hitRate": 0.814,
        "estJuice": -438,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 21.3
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pra",
        "line": 26.5,
        "direction": "over",
        "hitRate": 0.814,
        "estJuice": -438,
        "team": "SAS",
        "position": "C",
        "projMinutes": 38.3
      },
      {
        "player": "Victor Wembanyama",
        "stat": "reb",
        "line": 7.5,
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
        "hitRate": 0.811,
        "estJuice": -429,
        "team": "OKC",
        "position": "SG",
        "projMinutes": 28.7
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pra",
        "line": 21.5,
        "direction": "over",
        "hitRate": 0.828,
        "estJuice": -481,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 39.3
      },
      {
        "player": "Julian Champagnie",
        "stat": "pra",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.827,
        "estJuice": -478,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 21.3
      },
      {
        "player": "Keldon Johnson",
        "stat": "pra",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.825,
        "estJuice": -471,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 24
      },
      {
        "player": "Stephon Castle",
        "stat": "pts",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.833,
        "estJuice": -499,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 37.3
      },
      {
        "player": "Julian Champagnie",
        "stat": "pts",
        "line": 6.5,
        "direction": "over",
        "hitRate": 0.831,
        "estJuice": -492,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 21.3
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.428,
      "calibratedCombined": 0.13,
      "americanOdds": 132,
      "stake": 100,
      "legs": [
        {
          "player": "Chet Holmgren",
          "stat": "pts",
          "line": 10.5,
          "direction": "over",
          "hitRate": 0.803,
          "estJuice": -408,
          "team": "OKC",
          "position": "C",
          "projMinutes": 33
        },
        {
          "player": "Devin Vassell",
          "stat": "pts",
          "line": 9.5,
          "direction": "over",
          "hitRate": 0.807,
          "estJuice": -418,
          "team": "SAS",
          "position": "SG",
          "projMinutes": 33.3
        },
        {
          "player": "Ajay Mitchell",
          "stat": "pts",
          "line": 7.5,
          "direction": "over",
          "hitRate": 0.816,
          "estJuice": -443,
          "team": "OKC",
          "position": "PG",
          "projMinutes": 21.3
        },
        {
          "player": "Victor Wembanyama",
          "stat": "pra",
          "line": 26.5,
          "direction": "over",
          "hitRate": 0.814,
          "estJuice": -438,
          "team": "SAS",
          "position": "C",
          "projMinutes": 38.3
        }
      ]
    },
    "actual": null,
    "settlement": null
  },
  {
    "date": "2026-05-25",
    "series": "NYK-CLE",
    "game": 4,
    "capturedAt": "2026-05-24T22:35:25.564Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.471,
      "blowoutRisk": 0.216,
      "marginP50": -1.1
    },
    "candidates": [
      {
        "player": "Mikal Bridges",
        "stat": "reb",
        "line": 2.5,
        "direction": "over",
        "hitRate": 0.806,
        "estJuice": -415,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 35.7
      },
      {
        "player": "Josh Hart",
        "stat": "ast",
        "line": 2.5,
        "direction": "over",
        "hitRate": 0.804,
        "estJuice": -410,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 37
      },
      {
        "player": "Jarrett Allen",
        "stat": "reb",
        "line": 5.5,
        "direction": "over",
        "hitRate": 0.804,
        "estJuice": -410,
        "team": "CLE",
        "position": "C",
        "projMinutes": 32.7
      },
      {
        "player": "Josh Hart",
        "stat": "reb",
        "line": 4.5,
        "direction": "over",
        "hitRate": 0.814,
        "estJuice": -438,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 37
      },
      {
        "player": "Miles McBride",
        "stat": "pra",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.814,
        "estJuice": -438,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 20.7
      },
      {
        "player": "Karl-Anthony Towns",
        "stat": "pts",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "NYK",
        "position": "C",
        "projMinutes": 36.7
      },
      {
        "player": "Jalen Brunson",
        "stat": "pts",
        "line": 17.5,
        "direction": "over",
        "hitRate": 0.822,
        "estJuice": -462,
        "team": "NYK",
        "position": "PG",
        "projMinutes": 39.7
      },
      {
        "player": "Donovan Mitchell",
        "stat": "pra",
        "line": 25.5,
        "direction": "over",
        "hitRate": 0.822,
        "estJuice": -462,
        "team": "CLE",
        "position": "SG",
        "projMinutes": 38.7
      },
      {
        "player": "Miles McBride",
        "stat": "reb",
        "line": 1.5,
        "direction": "over",
        "hitRate": 0.821,
        "estJuice": -459,
        "team": "NYK",
        "position": "SG",
        "projMinutes": 20.7
      },
      {
        "player": "Donovan Mitchell",
        "stat": "threes",
        "line": 1.5,
        "direction": "over",
        "hitRate": 0.821,
        "estJuice": -459,
        "team": "CLE",
        "position": "SG",
        "projMinutes": 38.7
      },
      {
        "player": "Jalen Brunson",
        "stat": "pra",
        "line": 25.5,
        "direction": "over",
        "hitRate": 0.818,
        "estJuice": -449,
        "team": "NYK",
        "position": "PG",
        "projMinutes": 39.7
      },
      {
        "player": "OG Anunoby",
        "stat": "pra",
        "line": 21.5,
        "direction": "over",
        "hitRate": 0.829,
        "estJuice": -485,
        "team": "NYK",
        "position": "SF",
        "projMinutes": 25
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.427,
      "calibratedCombined": 0.129,
      "americanOdds": 134,
      "stake": 100,
      "legs": [
        {
          "player": "Mikal Bridges",
          "stat": "reb",
          "line": 2.5,
          "direction": "over",
          "hitRate": 0.806,
          "estJuice": -415,
          "team": "NYK",
          "position": "SF",
          "projMinutes": 35.7
        },
        {
          "player": "Josh Hart",
          "stat": "ast",
          "line": 2.5,
          "direction": "over",
          "hitRate": 0.804,
          "estJuice": -410,
          "team": "NYK",
          "position": "SG",
          "projMinutes": 37
        },
        {
          "player": "Jarrett Allen",
          "stat": "reb",
          "line": 5.5,
          "direction": "over",
          "hitRate": 0.804,
          "estJuice": -410,
          "team": "CLE",
          "position": "C",
          "projMinutes": 32.7
        },
        {
          "player": "Donovan Mitchell",
          "stat": "pra",
          "line": 25.5,
          "direction": "over",
          "hitRate": 0.822,
          "estJuice": -462,
          "team": "CLE",
          "position": "SG",
          "projMinutes": 38.7
        }
      ]
    },
    "actual": null,
    "settlement": null
  },
  {
    "date": "2026-05-24",
    "series": "OKC-SAS",
    "game": 4,
    "capturedAt": "2026-05-24T22:35:26.345Z",
    "iterations": 3000,
    "mc": {
      "homeWinProb": 0.523,
      "blowoutRisk": 0.239,
      "marginP50": 1
    },
    "candidates": [
      {
        "player": "Keldon Johnson",
        "stat": "pts",
        "line": 5.5,
        "direction": "over",
        "hitRate": 0.809,
        "estJuice": -424,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 24
      },
      {
        "player": "Alex Caruso",
        "stat": "pra",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.808,
        "estJuice": -421,
        "team": "OKC",
        "position": "SG",
        "projMinutes": 28.7
      },
      {
        "player": "Shai Gilgeous-Alexander",
        "stat": "pra",
        "line": 21.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 39.3
      },
      {
        "player": "Julian Champagnie",
        "stat": "pra",
        "line": 11.5,
        "direction": "over",
        "hitRate": 0.815,
        "estJuice": -441,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 21.3
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pts",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.813,
        "estJuice": -435,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 21.3
      },
      {
        "player": "Ajay Mitchell",
        "stat": "pra",
        "line": 12.5,
        "direction": "over",
        "hitRate": 0.812,
        "estJuice": -432,
        "team": "OKC",
        "position": "PG",
        "projMinutes": 21.3
      },
      {
        "player": "Victor Wembanyama",
        "stat": "pra",
        "line": 26.5,
        "direction": "over",
        "hitRate": 0.81,
        "estJuice": -426,
        "team": "SAS",
        "position": "C",
        "projMinutes": 38.3
      },
      {
        "player": "Devin Vassell",
        "stat": "pts",
        "line": 9.5,
        "direction": "over",
        "hitRate": 0.821,
        "estJuice": -459,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 33.3
      },
      {
        "player": "Stephon Castle",
        "stat": "pts",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.82,
        "estJuice": -456,
        "team": "SAS",
        "position": "SG",
        "projMinutes": 37.3
      },
      {
        "player": "Victor Wembanyama",
        "stat": "reb",
        "line": 7.5,
        "direction": "over",
        "hitRate": 0.818,
        "estJuice": -449,
        "team": "SAS",
        "position": "C",
        "projMinutes": 38.3
      },
      {
        "player": "Julian Champagnie",
        "stat": "pts",
        "line": 6.5,
        "direction": "over",
        "hitRate": 0.825,
        "estJuice": -471,
        "team": "SAS",
        "position": "SF",
        "projMinutes": 21.3
      },
      {
        "player": "Dylan Harper",
        "stat": "pra",
        "line": 10.5,
        "direction": "over",
        "hitRate": 0.83,
        "estJuice": -488,
        "team": "SAS",
        "position": "PG",
        "projMinutes": 28
      }
    ],
    "reliable": null,
    "traditional": {
      "legCount": 4,
      "combinedMC": 0.434,
      "calibratedCombined": 0.131,
      "americanOdds": 130,
      "stake": 100,
      "legs": [
        {
          "player": "Keldon Johnson",
          "stat": "pts",
          "line": 5.5,
          "direction": "over",
          "hitRate": 0.809,
          "estJuice": -424,
          "team": "SAS",
          "position": "SF",
          "projMinutes": 24
        },
        {
          "player": "Alex Caruso",
          "stat": "pra",
          "line": 7.5,
          "direction": "over",
          "hitRate": 0.808,
          "estJuice": -421,
          "team": "OKC",
          "position": "SG",
          "projMinutes": 28.7
        },
        {
          "player": "Shai Gilgeous-Alexander",
          "stat": "pra",
          "line": 21.5,
          "direction": "over",
          "hitRate": 0.815,
          "estJuice": -441,
          "team": "OKC",
          "position": "PG",
          "projMinutes": 39.3
        },
        {
          "player": "Julian Champagnie",
          "stat": "pra",
          "line": 11.5,
          "direction": "over",
          "hitRate": 0.815,
          "estJuice": -441,
          "team": "SAS",
          "position": "SF",
          "projMinutes": 21.3
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
