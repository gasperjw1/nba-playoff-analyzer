// ============================================================
// TEAM PRIORS — last season per team (2026-27 season model)
// ============================================================
// Fixed for the season: per-100-possession offense/defense and pace
// from NB.AI's Nov 2, 2026 feed (a 15-game day, so all 30 teams).
// NB.AI's later feeds revise these ratings and carry
// only the teams playing that day, so the ESPN fallback
// (fetch-slate.js --espn) and backtest-season.js read this table instead
// of whatever snapshot is on disk. Do not hand-edit.
// ============================================================
const SEASON_TEAM_PRIORS = {
 "ATL": {
  "abbr": "ATL",
  "name": "Hawks",
  "city": "Atlanta",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/atl.png",
  "prior": {
   "ortg": 113.11195218826131,
   "drtg": 111.13312782748133,
   "pace": 104.25814278518519,
   "games": 82
  }
 },
 "BKN": {
  "abbr": "BKN",
  "name": "Nets",
  "city": "Brooklyn",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/bkn.png",
  "prior": {
   "ortg": 105.76938646666073,
   "drtg": 115.17256219465564,
   "pace": 100.64472750769231,
   "games": 82
  }
 },
 "BOS": {
  "abbr": "BOS",
  "name": "Celtics",
  "city": "Boston",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/bos.png",
  "prior": {
   "ortg": 117.43645879950971,
   "drtg": 108.64851471636284,
   "pace": 98.64218358400001,
   "games": 82
  }
 },
 "CHA": {
  "abbr": "CHA",
  "name": "Hornets",
  "city": "Charlotte",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/cha.png",
  "prior": {
   "ortg": 111.74746053747133,
   "drtg": 110.29445287870892,
   "pace": 99.68710035555556,
   "games": 82
  }
 },
 "CHI": {
  "abbr": "CHI",
  "name": "Bulls",
  "city": "Chicago",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/chi.png",
  "prior": {
   "ortg": 109.4669627379665,
   "drtg": 116.61225665903308,
   "pace": 105.73924990769231,
   "games": 82
  }
 },
 "CLE": {
  "abbr": "CLE",
  "name": "Cavaliers",
  "city": "Cleveland",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/cle.png",
  "prior": {
   "ortg": 116.42495097944051,
   "drtg": 112.20867169729004,
   "pace": 103.03650643076925,
   "games": 82
  }
 },
 "DAL": {
  "abbr": "DAL",
  "name": "Mavericks",
  "city": "Dallas",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/dal.png",
  "prior": {
   "ortg": 109.58342973145372,
   "drtg": 113.06038989346067,
   "pace": 104.21056378461539,
   "games": 82
  }
 },
 "DEN": {
  "abbr": "DEN",
  "name": "Nuggets",
  "city": "Denver",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/den.png",
  "prior": {
   "ortg": 118.45332714368506,
   "drtg": 114.71759803987241,
   "pace": 101.622945856,
   "games": 82
  }
 },
 "DET": {
  "abbr": "DET",
  "name": "Pistons",
  "city": "Detroit",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/det.png",
  "prior": {
   "ortg": 113.56509576343896,
   "drtg": 105.64037332295473,
   "pace": 101.85211283200002,
   "games": 82
  }
 },
 "GS": {
  "abbr": "GS",
  "name": "Warriors",
  "city": "Golden State",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/gs.png",
  "prior": {
   "ortg": 113.61364028783784,
   "drtg": 113.22595855656631,
   "pace": 101.6459999111111,
   "games": 82
  }
 },
 "HOU": {
  "abbr": "HOU",
  "name": "Rockets",
  "city": "Houston",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/hou.png",
  "prior": {
   "ortg": 116.6751401188514,
   "drtg": 109.60042142726954,
   "pace": 99.98258453333334,
   "games": 82
  }
 },
 "IND": {
  "abbr": "IND",
  "name": "Pacers",
  "city": "Indiana",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/ind.png",
  "prior": {
   "ortg": 109.18382928419406,
   "drtg": 115.94761227779958,
   "pace": 103.00316118518519,
   "games": 82
  }
 },
 "LAC": {
  "abbr": "LAC",
  "name": "Clippers",
  "city": "LA",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/lac.png",
  "prior": {
   "ortg": 113.03578858684092,
   "drtg": 113.85840663855836,
   "pace": 99.20200590769231,
   "games": 82
  }
 },
 "LAL": {
  "abbr": "LAL",
  "name": "Lakers",
  "city": "Los Angeles",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/lal.png",
  "prior": {
   "ortg": 116.57446316960565,
   "drtg": 113.95989041610784,
   "pace": 100.62019786666667,
   "games": 82
  }
 },
 "MEM": {
  "abbr": "MEM",
  "name": "Grizzlies",
  "city": "Memphis",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/mem.png",
  "prior": {
   "ortg": 111.7258437065422,
   "drtg": 112.83017373504259,
   "pace": 103.96185686153846,
   "games": 82
  }
 },
 "MIA": {
  "abbr": "MIA",
  "name": "Heat",
  "city": "Miami",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/mia.png",
  "prior": {
   "ortg": 113.78004691682901,
   "drtg": 112.74788933312084,
   "pace": 105.73872633846153,
   "games": 82
  }
 },
 "MIL": {
  "abbr": "MIL",
  "name": "Bucks",
  "city": "Milwaukee",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/mil.png",
  "prior": {
   "ortg": 110.10849921309965,
   "drtg": 117.78085614589223,
   "pace": 101.01089667692307,
   "games": 82
  }
 },
 "MIN": {
  "abbr": "MIN",
  "name": "Timberwolves",
  "city": "Minnesota",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/min.png",
  "prior": {
   "ortg": 114.63299141471418,
   "drtg": 109.36609422384511,
   "pace": 103.41896586666665,
   "games": 82
  }
 },
 "NO": {
  "abbr": "NO",
  "name": "Pelicans",
  "city": "New Orleans",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/no.png",
  "prior": {
   "ortg": 111.7700402288922,
   "drtg": 114.76671429775053,
   "pace": 104.16559559999999,
   "games": 82
  }
 },
 "NY": {
  "abbr": "NY",
  "name": "Knicks",
  "city": "New York",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/ny.png",
  "prior": {
   "ortg": 115.96926358737,
   "drtg": 110.74112563846018,
   "pace": 99.06485529599999,
   "games": 83
  }
 },
 "OKC": {
  "abbr": "OKC",
  "name": "Thunder",
  "city": "Oklahoma City",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/okc.png",
  "prior": {
   "ortg": 114.52628156692182,
   "drtg": 106.40319476711161,
   "pace": 101.349231264,
   "games": 82
  }
 },
 "ORL": {
  "abbr": "ORL",
  "name": "Magic",
  "city": "Orlando",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/orl.png",
  "prior": {
   "ortg": 110.76260562336127,
   "drtg": 112.28285117285084,
   "pace": 102.87453753846154,
   "games": 82
  }
 },
 "PHI": {
  "abbr": "PHI",
  "name": "76ers",
  "city": "Philadelphia",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/phi.png",
  "prior": {
   "ortg": 111.88152307788188,
   "drtg": 111.2482277428213,
   "pace": 102.21240735384616,
   "games": 82
  }
 },
 "PHX": {
  "abbr": "PHX",
  "name": "Suns",
  "city": "Phoenix",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/phx.png",
  "prior": {
   "ortg": 112.60467190963864,
   "drtg": 113.46619448787119,
   "pace": 99.88262523333333,
   "games": 82
  }
 },
 "POR": {
  "abbr": "POR",
  "name": "Trail Blazers",
  "city": "Portland",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/por.png",
  "prior": {
   "ortg": 112.51318477683617,
   "drtg": 110.48073618753722,
   "pace": 103.55965126400001,
   "games": 82
  }
 },
 "SA": {
  "abbr": "SA",
  "name": "Spurs",
  "city": "San Antonio",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/sa.png",
  "prior": {
   "ortg": 117.16135177073662,
   "drtg": 108.70000224721531,
   "pace": 102.26056208,
   "games": 83
  }
 },
 "SAC": {
  "abbr": "SAC",
  "name": "Kings",
  "city": "Sacramento",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/sac.png",
  "prior": {
   "ortg": 108.10141440148593,
   "drtg": 119.86081818902267,
   "pace": 102.36834486153846,
   "games": 82
  }
 },
 "TOR": {
  "abbr": "TOR",
  "name": "Raptors",
  "city": "Toronto",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/tor.png",
  "prior": {
   "ortg": 113.46848315371737,
   "drtg": 109.76104372040254,
   "pace": 101.78463427692307,
   "games": 82
  }
 },
 "UTAH": {
  "abbr": "UTAH",
  "name": "Jazz",
  "city": "Utah",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/utah.png",
  "prior": {
   "ortg": 110.08781058407611,
   "drtg": 118.50916738958264,
   "pace": 104.9232647076923,
   "games": 82
  }
 },
 "WSH": {
  "abbr": "WSH",
  "name": "Wizards",
  "city": "Washington",
  "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/wsh.png",
  "prior": {
   "ortg": 108.54914491194928,
   "drtg": 117.23202253023251,
   "pace": 103.5048036,
   "games": 82
  }
 }
};
