// ============================================================
// SEASON USER BETS — bets the user placed (2026-27 regular season)
// ============================================================
// One entry per ticket. Each leg names the ledger game (gameId), the
// side taken, DraftKings' closing moneyline, and the model's and the
// market's win probability for that side as recorded before tip-off,
// so the user's picks can later be compared with both. stake is null
// when not given; americanOdds is the parlay price from the legs' odds.
// A ticket logged before its games are final has result null and each
// leg's hit and final null until it is graded; pPicks is the picks
// engine's chance when the ticket was checked (parlay checker).
// ============================================================
const SEASON_USER_BETS = [
 {
  "id": "season-2026-11-04-001",
  "date": "2026-11-04",
  "loggedAt": "2026-11-05T15:51:25.606Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 1007,
  "oddsSource": "DraftKings closing moneylines (ESPN); the price actually taken may differ",
  "legs": [
   {
    "gameId": "401909922",
    "team": "PHI",
    "opponent": "DET",
    "side": "away",
    "market": "moneyline",
    "odds": 120,
    "pOurs": 0.5102,
    "pMarket": 0.4365,
    "hit": true,
    "final": "PHI 112 – DET 106"
   },
   {
    "gameId": "401909923",
    "team": "WSH",
    "opponent": "ATL",
    "side": "home",
    "market": "moneyline",
    "odds": 107,
    "pOurs": 0.5143,
    "pMarket": 0.4176,
    "hit": false,
    "final": "ATL 120 – WSH 105"
   },
   {
    "gameId": "401909925",
    "team": "BKN",
    "opponent": "CHA",
    "side": "home",
    "market": "moneyline",
    "odds": 143,
    "pOurs": 0.5796,
    "pMarket": 0.3953,
    "hit": true,
    "final": "CHA 104 – BKN 114"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 2,
   "settledAt": "2026-11-05T15:51:25.607Z"
  }
 },
 {
  "id": "season-2026-11-04-002",
  "date": "2026-11-04",
  "loggedAt": "2026-11-05T15:51:25.627Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 443,
  "oddsSource": "DraftKings closing moneylines (ESPN); the price actually taken may differ",
  "legs": [
   {
    "gameId": "401909926",
    "team": "NY",
    "opponent": "CHI",
    "side": "home",
    "market": "moneyline",
    "odds": -570,
    "pOurs": 0.8064,
    "pMarket": 0.823,
    "hit": true,
    "final": "CHI 105 – NY 135"
   },
   {
    "gameId": "401909924",
    "team": "BOS",
    "opponent": "MIL",
    "side": "home",
    "market": "moneyline",
    "odds": -567,
    "pOurs": 0.8462,
    "pMarket": 0.8055,
    "hit": true,
    "final": "MIL 102 – BOS 109"
   },
   {
    "gameId": "401909927",
    "team": "MEM",
    "opponent": "IND",
    "side": "home",
    "market": "moneyline",
    "odds": -228,
    "pOurs": 0.8795,
    "pMarket": 0.6755,
    "hit": false,
    "final": "IND 107 – MEM 103"
   },
   {
    "gameId": "401909928",
    "team": "NO",
    "opponent": "UTAH",
    "side": "home",
    "market": "moneyline",
    "odds": -201,
    "pOurs": 0.755,
    "pMarket": 0.6431,
    "hit": true,
    "final": "UTAH 113 – NO 120"
   },
   {
    "gameId": "401909930",
    "team": "HOU",
    "opponent": "MIN",
    "side": "home",
    "market": "moneyline",
    "odds": -278,
    "pOurs": 0.7803,
    "pMarket": 0.7063,
    "hit": false,
    "final": "MIN 117 – HOU 107"
   },
   {
    "gameId": "401909933",
    "team": "SA",
    "opponent": "DAL",
    "side": "home",
    "market": "moneyline",
    "odds": -620,
    "pOurs": 0.8444,
    "pMarket": 0.823,
    "hit": true,
    "final": "DAL 111 – SA 112"
   },
   {
    "gameId": "401909934",
    "team": "LAL",
    "opponent": "SAC",
    "side": "away",
    "market": "moneyline",
    "odds": -650,
    "pOurs": 0.8646,
    "pMarket": 0.8267,
    "hit": true,
    "final": "LAL 116 – SAC 103"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 5,
   "settledAt": "2026-11-05T15:51:25.628Z"
  }
 },
 {
  "id": "season-2026-11-04-003",
  "date": "2026-11-04",
  "loggedAt": "2026-11-05T15:51:25.638Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 808,
  "oddsSource": "DraftKings closing moneylines (ESPN); the price actually taken may differ",
  "legs": [
   {
    "gameId": "401909925",
    "team": "BKN",
    "opponent": "CHA",
    "side": "home",
    "market": "moneyline",
    "odds": 143,
    "pOurs": 0.5796,
    "pMarket": 0.3953,
    "hit": true,
    "final": "CHA 104 – BKN 114"
   },
   {
    "gameId": "401909932",
    "team": "POR",
    "opponent": "PHX",
    "side": "away",
    "market": "moneyline",
    "odds": -148,
    "pOurs": 0.6978,
    "pMarket": 0.5731,
    "hit": true,
    "final": "POR 132 – PHX 119"
   },
   {
    "gameId": "401909931",
    "team": "DEN",
    "opponent": "TOR",
    "side": "home",
    "market": "moneyline",
    "odds": -191,
    "pOurs": 0.6096,
    "pMarket": 0.6305,
    "hit": true,
    "final": "TOR 109 – DEN 128"
   },
   {
    "gameId": "401909935",
    "team": "MIA",
    "opponent": "LAC",
    "side": "away",
    "market": "moneyline",
    "odds": -216,
    "pOurs": 0.6589,
    "pMarket": 0.6568,
    "hit": true,
    "final": "MIA 117 – LAC 116"
   }
  ],
  "result": {
   "outcome": "win",
   "legsHit": 4,
   "settledAt": "2026-11-05T15:51:25.638Z"
  }
 },
 {
  "id": "season-2026-11-07-001",
  "date": "2026-11-07",
  "loggedAt": "2026-11-07T21:49:02.504Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 618,
  "oddsSource": "DraftKings moneylines on the site's slate at 12:20 PM ET (ESPN pickcenter), from the Parlay tab's Copy ticket; the price actually taken may differ",
  "checker": {
   "engine": "2026-11-07.rotcap",
   "props": "2026-11-07.sdscale",
   "pModel": 0.184,
   "note": "pPicks = picks engine on the 12:20 PM slate as the ticket was built; pOurs = the ledger's recorded Ours, as for earlier tickets"
  },
  "legs": [
   {
    "gameId": "401909938",
    "team": "DEN",
    "opponent": "IND",
    "side": "away",
    "market": "moneyline",
    "odds": -305,
    "pOurs": 0.6147,
    "pMarket": 0.7238,
    "pPicks": 0.7262,
    "hit": true,
    "final": "DEN 114 – IND 102"
   },
   {
    "gameId": "401909939",
    "team": "ATL",
    "opponent": "BKN",
    "side": "home",
    "market": "moneyline",
    "odds": -269,
    "pOurs": 0.6443,
    "pMarket": 0.7006,
    "pPicks": 0.6898,
    "hit": true,
    "final": "BKN 121 – ATL 124"
   },
   {
    "gameId": "401909940",
    "team": "CLE",
    "opponent": "NY",
    "side": "home",
    "market": "moneyline",
    "odds": 170,
    "pOurs": 0.552,
    "pMarket": 0.3556,
    "pPicks": 0.5081,
    "hit": false,
    "final": "NY 109 – CLE 97"
   },
   {
    "gameId": "401909942",
    "team": "GS",
    "opponent": "ORL",
    "side": "home",
    "market": "moneyline",
    "odds": -217,
    "pOurs": 0.7539,
    "pMarket": 0.6571,
    "pPicks": 0.7229,
    "hit": true,
    "final": "ORL 119 – GS 126"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 3,
   "settledAt": "2026-11-08T09:01:20.943Z"
  }
 },
 {
  "id": "season-2026-11-07-002",
  "date": "2026-11-07",
  "loggedAt": "2026-11-07T21:49:50.127Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 326,
  "oddsSource": "DraftKings moneylines on the site's slate at 12:20 PM ET (ESPN pickcenter), from the Parlay tab's Copy ticket; the price actually taken may differ",
  "checker": {
   "engine": "2026-11-07.rotcap",
   "props": "2026-11-07.sdscale",
   "pModel": 0.2099,
   "note": "pPicks = picks engine on the 12:20 PM slate as the ticket was built; pOurs = the ledger's recorded Ours, as for earlier tickets"
  },
  "legs": [
   {
    "gameId": "401909942",
    "team": "GS",
    "opponent": "ORL",
    "side": "home",
    "market": "moneyline",
    "odds": -217,
    "pOurs": 0.7539,
    "pMarket": 0.6571,
    "pPicks": 0.7229,
    "hit": true,
    "final": "ORL 119 – GS 126"
   },
   {
    "gameId": "401909938",
    "team": "DEN",
    "opponent": "IND",
    "side": "away",
    "market": "moneyline",
    "odds": -305,
    "pOurs": 0.6147,
    "pMarket": 0.7238,
    "pPicks": 0.7262,
    "hit": true,
    "final": "DEN 114 – IND 102"
   },
   {
    "gameId": "401909939",
    "team": "ATL",
    "opponent": "BKN",
    "side": "home",
    "market": "moneyline",
    "odds": -269,
    "pOurs": 0.6443,
    "pMarket": 0.7006,
    "pPicks": 0.6898,
    "hit": true,
    "final": "BKN 121 – ATL 124"
   },
   {
    "gameId": "401909941",
    "team": "OKC",
    "opponent": "WSH",
    "side": "home",
    "market": "moneyline",
    "odds": -597,
    "pOurs": 0.7503,
    "pMarket": 0.823,
    "pPicks": 0.8066,
    "hit": true,
    "final": "WSH 75 – OKC 114"
   },
   {
    "gameId": "401909943",
    "team": "HOU",
    "opponent": "PHX",
    "side": "away",
    "market": "moneyline",
    "odds": -269,
    "pOurs": 0.7416,
    "pMarket": 0.7006,
    "pPicks": 0.7186,
    "hit": false,
    "final": "HOU 99 – PHX 102"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 4,
   "settledAt": "2026-11-08T09:01:20.943Z"
  }
 }
];
