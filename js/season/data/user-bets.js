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
 },
 {
  "id": "season-2026-11-08-001",
  "date": "2026-11-08",
  "loggedAt": "2026-11-09T06:54:24.212Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 209,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN)",
  "note": "each leg was also bet straight (user-legs.js)",
  "legs": [
   {
    "gameId": "401909945",
    "team": "PHI",
    "opponent": "CHI",
    "side": "away",
    "market": "moneyline",
    "odds": -390,
    "dkClose": -423,
    "pOurs": 0.851,
    "pMarket": 0.7921,
    "hit": true,
    "final": "PHI 127 – CHI 121"
   },
   {
    "gameId": "401909946",
    "team": "DET",
    "opponent": "LAL",
    "side": "home",
    "market": "moneyline",
    "odds": -255,
    "dkClose": -277,
    "pOurs": 0.7452,
    "pMarket": 0.7,
    "hit": false,
    "final": "LAL 121 – DET 116"
   },
   {
    "gameId": "401909947",
    "team": "MIN",
    "opponent": "UTAH",
    "side": "home",
    "market": "moneyline",
    "odds": -650,
    "dkClose": -700,
    "pOurs": 0.868,
    "pMarket": 0.8316,
    "hit": true,
    "final": "UTAH 100 – MIN 115"
   },
   {
    "gameId": "401909948",
    "team": "DAL",
    "opponent": "BKN",
    "side": "home",
    "market": "moneyline",
    "odds": -290,
    "dkClose": -305,
    "pOurs": 0.8034,
    "pMarket": 0.7249,
    "hit": true,
    "final": "BKN 93 – DAL 130"
   },
   {
    "gameId": "401909949",
    "team": "BOS",
    "opponent": "MIL",
    "side": "away",
    "market": "moneyline",
    "odds": -720,
    "dkClose": -790,
    "pOurs": 0.8597,
    "pMarket": 0.8475,
    "hit": true,
    "final": "BOS 117 – MIL 97"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 4,
   "settledAt": "2026-11-09T06:54:24.212Z"
  }
 },
 {
  "id": "season-2026-11-08-002",
  "date": "2026-11-08",
  "loggedAt": "2026-11-09T06:54:24.212Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 129,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN)",
  "note": "each leg was also bet straight (user-legs.js)",
  "legs": [
   {
    "gameId": "401909951",
    "team": "MIA",
    "opponent": "SAC",
    "side": "away",
    "market": "moneyline",
    "odds": -405,
    "dkClose": -574,
    "pOurs": 0.7112,
    "pMarket": 0.7846,
    "hit": true,
    "final": "MIA 114 – SAC 108"
   },
   {
    "gameId": "401909950",
    "team": "NO",
    "opponent": "LAC",
    "side": "away",
    "market": "moneyline",
    "odds": -120,
    "dkClose": -129,
    "pOurs": 0.6331,
    "pMarket": 0.5264,
    "hit": false,
    "final": "NO 123 – LAC 139"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 1,
   "settledAt": "2026-11-09T06:54:24.212Z"
  }
 },
 {
  "id": "season-2026-11-09-001",
  "date": "2026-11-09",
  "loggedAt": "2026-11-10T19:59:47.847Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 100,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN)",
  "note": "placed earlier than the others, at better prices; the same three legs as pitch-2's ticket",
  "legs": [
   {
    "gameId": "401909959",
    "team": "GS",
    "opponent": "NO",
    "side": "home",
    "market": "moneyline",
    "odds": -474,
    "dkClose": -542,
    "pOurs": 0.7497,
    "pMarket": 0.7616,
    "hit": true,
    "final": "NO 87 – GS 138"
   },
   {
    "gameId": "401909954",
    "team": "DET",
    "opponent": "WSH",
    "side": "home",
    "market": "moneyline",
    "odds": -383,
    "dkClose": -411,
    "pOurs": 0.7934,
    "pMarket": 0.7981,
    "hit": true,
    "final": "WSH 111 – DET 122"
   },
   {
    "gameId": "401909958",
    "team": "SA",
    "opponent": "PHX",
    "side": "away",
    "market": "moneyline",
    "odds": -321,
    "dkClose": -396,
    "pOurs": 0.7903,
    "pMarket": 0.7574,
    "hit": true,
    "final": "SA 122 – PHX 96"
   }
  ],
  "result": {
   "outcome": "win",
   "legsHit": 3,
   "settledAt": "2026-11-10T19:59:47.847Z"
  }
 },
 {
  "id": "season-2026-11-09-002",
  "date": "2026-11-09",
  "loggedAt": "2026-11-10T19:59:47.847Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 133,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN)",
  "note": "CLE was in this parlay only, not bet straight",
  "legs": [
   {
    "gameId": "401909959",
    "team": "GS",
    "opponent": "NO",
    "side": "home",
    "market": "moneyline",
    "odds": -590,
    "dkClose": -542,
    "pOurs": 0.7497,
    "pMarket": 0.7616,
    "hit": true,
    "final": "NO 87 – GS 138"
   },
   {
    "gameId": "401909954",
    "team": "DET",
    "opponent": "WSH",
    "side": "home",
    "market": "moneyline",
    "odds": -460,
    "dkClose": -411,
    "pOurs": 0.7934,
    "pMarket": 0.7981,
    "hit": true,
    "final": "WSH 111 – DET 122"
   },
   {
    "gameId": "401909958",
    "team": "SA",
    "opponent": "PHX",
    "side": "away",
    "market": "moneyline",
    "odds": -375,
    "dkClose": -396,
    "pOurs": 0.7903,
    "pMarket": 0.7574,
    "hit": true,
    "final": "SA 122 – PHX 96"
   },
   {
    "gameId": "401909953",
    "team": "CLE",
    "opponent": "CHA",
    "side": "away",
    "market": "moneyline",
    "odds": -340,
    "dkClose": -324,
    "pOurs": 0.7852,
    "pMarket": 0.7405,
    "hit": false,
    "final": "CLE 112 – CHA 124"
   }
  ],
  "result": {
   "outcome": "loss",
   "legsHit": 3,
   "settledAt": "2026-11-10T19:59:47.847Z"
  }
 },
 {
  "id": "season-2026-11-09-003",
  "date": "2026-11-09",
  "loggedAt": "2026-11-10T19:59:47.847Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": -236,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN)",
  "note": "GS, DET and SA were also bet straight at these prices (user-legs.js)",
  "legs": [
   {
    "gameId": "401909959",
    "team": "GS",
    "opponent": "NO",
    "side": "home",
    "market": "moneyline",
    "odds": -590,
    "dkClose": -542,
    "pOurs": 0.7497,
    "pMarket": 0.7616,
    "hit": true,
    "final": "NO 87 – GS 138"
   },
   {
    "gameId": "401909954",
    "team": "DET",
    "opponent": "WSH",
    "side": "home",
    "market": "moneyline",
    "odds": -460,
    "dkClose": -411,
    "pOurs": 0.7934,
    "pMarket": 0.7981,
    "hit": true,
    "final": "WSH 111 – DET 122"
   }
  ],
  "result": {
   "outcome": "win",
   "legsHit": 2,
   "settledAt": "2026-11-10T19:59:47.847Z"
  }
 },
 {
  "id": "season-2026-11-11-001",
  "date": "2026-11-11",
  "loggedAt": "2026-11-13T18:13:08.379Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 116,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN); a prop leg's pOurs is the props ledger's recorded projection",
  "note": "ORL was also bet straight (user-legs.js)",
  "legs": [
   {
    "gameId": "401909973",
    "team": "ORL",
    "opponent": "UTAH",
    "side": "away",
    "market": "moneyline",
    "odds": -168,
    "dkClose": -179,
    "pOurs": 0.6068,
    "pMarket": 0.616,
    "hit": true,
    "final": "ORL 123 – UTAH 108"
   },
   {
    "gameId": "401909974",
    "team": "HOU",
    "opponent": "GS",
    "side": "home",
    "market": "prop",
    "player": "4432639",
    "name": "Jabari Smith Jr.",
    "stat": "pra",
    "dir": "over",
    "line": 19.5,
    "odds": -280,
    "pOurs": 0.7698,
    "projection": 26.6,
    "sd": 9.62,
    "actual": 22,
    "hit": true,
    "final": "GS 108 – HOU 115"
   }
  ],
  "result": {
   "outcome": "win",
   "legsHit": 2,
   "settledAt": "2026-11-13T18:13:08.379Z"
  }
 },
 {
  "id": "season-2026-11-12-001",
  "date": "2026-11-12",
  "loggedAt": "2026-11-13T17:42:45.657Z",
  "type": "parlay",
  "stake": null,
  "americanOdds": 169,
  "oddsSource": "FanDuel prices the user took (reported in chat); dkClose is DraftKings' close (ESPN)",
  "note": "each leg was also bet straight (user-legs.js)",
  "legs": [
   {
    "gameId": "401909976",
    "team": "PHI",
    "opponent": "TOR",
    "side": "home",
    "market": "moneyline",
    "odds": -335,
    "dkClose": -277,
    "pOurs": 0.6542,
    "pMarket": 0.7008,
    "hit": true,
    "final": "TOR 112 – PHI 123"
   },
   {
    "gameId": "401909978",
    "team": "MIN",
    "opponent": "DAL",
    "side": "home",
    "market": "moneyline",
    "odds": -230,
    "dkClose": -223,
    "pOurs": 0.6018,
    "pMarket": 0.663,
    "hit": true,
    "final": "DAL 94 – MIN 133"
   },
   {
    "gameId": "401909979",
    "team": "PHX",
    "opponent": "CHA",
    "side": "home",
    "market": "moneyline",
    "odds": -225,
    "dkClose": -217,
    "pOurs": 0.6806,
    "pMarket": 0.6687,
    "hit": true,
    "final": "CHA 96 – PHX 101"
   }
  ],
  "result": {
   "outcome": "win",
   "legsHit": 3,
   "settledAt": "2026-11-13T17:42:45.657Z"
  }
 }
];
