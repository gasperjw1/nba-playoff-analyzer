// ============================================================
// GAME BOX SCORES — sourced from Basketball Reference
// Attached to SERIES_DATA[].games[].boxScores after load
// Format: {home:[players], away:[players]}
// Player: {name,min,pts,reb,ast,stl,blk,fgm,fga,tpm,tpa,ftm,fta,to,orb}
// ============================================================

const G1_BOX_SCORES = {
  // ---- WEST ----

  "HOU-LAL": {
    home: [ // HOU (home in data, but LAL had actual home court)
      {name:"Amen Thompson",min:43,pts:17,reb:7,ast:7,stl:3,blk:1,fgm:7,fga:18,tpm:0,tpa:1,ftm:3,fta:6,to:2,orb:4},
      {name:"Jabari Smith Jr.",min:43,pts:16,reb:12,ast:0,stl:2,blk:0,fgm:5,fga:14,tpm:3,tpa:9,ftm:3,fta:5,to:1,orb:5},
      {name:"Alperen Sengun",min:36,pts:19,reb:8,ast:6,stl:1,blk:1,fgm:6,fga:19,tpm:0,tpa:2,ftm:7,fta:9,to:3,orb:4},
      {name:"Reed Sheppard",min:36,pts:17,reb:1,ast:8,stl:1,blk:1,fgm:6,fga:20,tpm:5,tpa:14,ftm:0,fta:0,to:4,orb:0},
      {name:"Josh Okogie",min:26,pts:7,reb:0,ast:1,stl:2,blk:0,fgm:2,fga:4,tpm:1,tpa:2,ftm:2,fta:2,to:0,orb:0},
      {name:"Tari Eason",min:24,pts:16,reb:10,ast:2,stl:3,blk:0,fgm:7,fga:7,tpm:2,tpa:2,ftm:0,fta:1,to:1,orb:3},
      {name:"Clint Capela",min:11,pts:2,reb:2,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:1},
      {name:"Aaron Holiday",min:11,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:4,tpm:0,tpa:2,ftm:0,fta:0,to:1,orb:0},
      {name:"Jae'Sean Tate",min:10,pts:4,reb:4,ast:0,stl:1,blk:0,fgm:1,fga:5,tpm:0,tpa:1,ftm:2,fta:2,to:0,orb:4}
    ],
    away: [ // LAL
      {name:"Rui Hachimura",min:42,pts:14,reb:2,ast:0,stl:3,blk:2,fgm:6,fga:10,tpm:2,tpa:4,ftm:0,fta:0,to:2,orb:0},
      {name:"LeBron James",min:38,pts:19,reb:8,ast:13,stl:2,blk:1,fgm:9,fga:15,tpm:1,tpa:2,ftm:0,fta:2,to:2,orb:0},
      {name:"Luke Kennard",min:38,pts:27,reb:4,ast:3,stl:0,blk:0,fgm:9,fga:13,tpm:5,tpa:5,ftm:4,fta:6,to:3,orb:0},
      {name:"Deandre Ayton",min:35,pts:19,reb:11,ast:2,stl:0,blk:1,fgm:8,fga:10,tpm:0,tpa:0,ftm:3,fta:3,to:3,orb:3},
      {name:"Marcus Smart",min:34,pts:15,reb:2,ast:8,stl:1,blk:2,fgm:5,fga:12,tpm:1,tpa:5,ftm:4,fta:8,to:5,orb:0},
      {name:"Jarred Vanderbilt",min:18,pts:3,reb:5,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Jake LaRavia",min:18,pts:6,reb:2,ast:3,stl:1,blk:1,fgm:1,fga:3,tpm:0,tpa:1,ftm:4,fta:4,to:1,orb:0},
      {name:"Jaxson Hayes",min:13,pts:4,reb:1,ast:0,stl:0,blk:1,fgm:1,fga:1,tpm:0,tpa:0,ftm:2,fta:3,to:1,orb:0},
      {name:"Bronny James",min:4,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:0}
    ]
  },

  "OKC-PHX": {
    home: [ // OKC
      {name:"Shai Gilgeous-Alexander",min:29,pts:25,reb:4,ast:7,stl:0,blk:2,fgm:5,fga:18,tpm:0,tpa:4,ftm:15,fta:17,to:0,orb:1},
      {name:"Jalen Williams",min:29,pts:22,reb:7,ast:6,stl:1,blk:1,fgm:9,fga:15,tpm:2,tpa:5,ftm:2,fta:2,to:1,orb:2},
      {name:"Chet Holmgren",min:25,pts:16,reb:7,ast:0,stl:2,blk:2,fgm:5,fga:10,tpm:2,tpa:6,ftm:4,fta:4,to:1,orb:2},
      {name:"Lu Dort",min:24,pts:8,reb:2,ast:2,stl:1,blk:0,fgm:3,fga:8,tpm:2,tpa:6,ftm:0,fta:0,to:0,orb:0},
      {name:"Isaiah Hartenstein",min:20,pts:8,reb:8,ast:2,stl:0,blk:2,fgm:4,fga:4,tpm:0,tpa:0,ftm:0,fta:0,to:2,orb:4},
      {name:"Ajay Mitchell",min:22,pts:9,reb:5,ast:2,stl:2,blk:0,fgm:3,fga:7,tpm:3,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Cason Wallace",min:21,pts:6,reb:4,ast:2,stl:2,blk:0,fgm:3,fga:5,tpm:0,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Isaiah Joe",min:20,pts:9,reb:2,ast:1,stl:1,blk:0,fgm:3,fga:8,tpm:3,tpa:8,ftm:0,fta:0,to:0,orb:0},
      {name:"Alex Caruso",min:13,pts:2,reb:5,ast:1,stl:0,blk:0,fgm:1,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0}
    ],
    away: [ // PHX
      {name:"Devin Booker",min:33,pts:23,reb:6,ast:2,stl:0,blk:0,fgm:8,fga:17,tpm:2,tpa:5,ftm:5,fta:7,to:3,orb:4},
      {name:"Dillon Brooks",min:32,pts:18,reb:7,ast:2,stl:0,blk:0,fgm:6,fga:22,tpm:3,tpa:10,ftm:3,fta:3,to:2,orb:0},
      {name:"Jalen Green",min:32,pts:17,reb:5,ast:1,stl:1,blk:1,fgm:6,fga:16,tpm:2,tpa:7,ftm:3,fta:4,to:3,orb:0},
      {name:"Oso Ighodaro",min:26,pts:0,reb:9,ast:3,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:7},
      {name:"Jordan Goodwin",min:5,pts:2,reb:0,ast:0,stl:0,blk:0,fgm:1,fga:4,tpm:0,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Collin Gillespie",min:23,pts:8,reb:2,ast:2,stl:1,blk:0,fgm:3,fga:6,tpm:2,tpa:4,ftm:0,fta:0,to:2,orb:0},
      {name:"Royce O'Neale",min:23,pts:4,reb:3,ast:3,stl:0,blk:1,fgm:1,fga:2,tpm:1,tpa:2,ftm:1,fta:2,to:0,orb:0},
      {name:"Ryan Dunn",min:25,pts:0,reb:5,ast:1,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:3,ftm:0,fta:0,to:3,orb:0}
    ]
  },

  "DEN-MIN": {
    home: [ // DEN
      {name:"Nikola Jokic",min:40,pts:25,reb:13,ast:11,stl:1,blk:0,fgm:11,fga:19,tpm:2,tpa:7,ftm:1,fta:1,to:5,orb:1},
      {name:"Jamal Murray",min:39,pts:30,reb:5,ast:7,stl:0,blk:0,fgm:7,fga:22,tpm:0,tpa:8,ftm:16,fta:16,to:2,orb:0},
      {name:"Christian Braun",min:36,pts:12,reb:8,ast:0,stl:0,blk:0,fgm:4,fga:10,tpm:2,tpa:3,ftm:2,fta:2,to:0,orb:1},
      {name:"Cameron Johnson",min:33,pts:12,reb:0,ast:1,stl:0,blk:0,fgm:5,fga:12,tpm:2,tpa:7,ftm:0,fta:0,to:1,orb:0},
      {name:"Aaron Gordon",min:29,pts:17,reb:8,ast:3,stl:0,blk:0,fgm:5,fga:10,tpm:1,tpa:5,ftm:6,fta:8,to:1,orb:4},
      {name:"Tim Hardaway Jr.",min:24,pts:7,reb:3,ast:1,stl:1,blk:1,fgm:2,fga:6,tpm:1,tpa:3,ftm:2,fta:2,to:2,orb:0},
      {name:"Bruce Brown",min:21,pts:8,reb:7,ast:3,stl:5,blk:0,fgm:3,fga:7,tpm:1,tpa:2,ftm:1,fta:1,to:1,orb:2},
      {name:"Spencer Jones",min:9,pts:5,reb:0,ast:0,stl:0,blk:0,fgm:1,fga:1,tpm:1,tpa:1,ftm:2,fta:3,to:0,orb:0},
      {name:"Jonas Valanciunas",min:8,pts:0,reb:3,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:0}
    ],
    away: [ // MIN
      {name:"Anthony Edwards",min:38,pts:22,reb:9,ast:3,stl:0,blk:3,fgm:7,fga:19,tpm:2,tpa:9,ftm:6,fta:7,to:4,orb:0},
      {name:"Rudy Gobert",min:38,pts:17,reb:10,ast:2,stl:1,blk:1,fgm:8,fga:9,tpm:0,tpa:0,ftm:1,fta:5,to:3,orb:3},
      {name:"Jaden McDaniels",min:33,pts:16,reb:8,ast:3,stl:0,blk:0,fgm:6,fga:14,tpm:0,tpa:4,ftm:4,fta:4,to:1,orb:3},
      {name:"Donte DiVincenzo",min:31,pts:12,reb:4,ast:2,stl:1,blk:0,fgm:4,fga:9,tpm:4,tpa:7,ftm:0,fta:0,to:3,orb:0},
      {name:"Julius Randle",min:31,pts:16,reb:7,ast:0,stl:0,blk:0,fgm:7,fga:16,tpm:0,tpa:3,ftm:2,fta:2,to:1,orb:1},
      {name:"Ayo Dosunmu",min:28,pts:14,reb:0,ast:1,stl:1,blk:0,fgm:5,fga:10,tpm:3,tpa:7,ftm:1,fta:1,to:2,orb:0},
      {name:"Naz Reid",min:17,pts:5,reb:3,ast:2,stl:1,blk:0,fgm:2,fga:6,tpm:1,tpa:2,ftm:0,fta:0,to:5,orb:0},
      {name:"Mike Conley",min:11,pts:3,reb:1,ast:2,stl:1,blk:0,fgm:1,fga:1,tpm:1,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Kyle Anderson",min:7,pts:0,reb:0,ast:1,stl:0,blk:1,fgm:0,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:0},
      {name:"Bones Hyland",min:5,pts:0,reb:1,ast:0,stl:0,blk:0,fgm:0,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0}
    ]
  },

  "SAS-POR": {
    home: [ // SAS
      {name:"Victor Wembanyama",min:33,pts:35,reb:5,ast:2,stl:0,blk:4,fgm:13,fga:21,tpm:5,tpa:6,ftm:4,fta:5,to:2,orb:0},
      {name:"De'Aaron Fox",min:34,pts:17,reb:5,ast:8,stl:1,blk:0,fgm:7,fga:15,tpm:2,tpa:5,ftm:1,fta:2,to:0,orb:2},
      {name:"Devin Vassell",min:34,pts:15,reb:3,ast:2,stl:0,blk:1,fgm:5,fga:13,tpm:4,tpa:9,ftm:1,fta:2,to:2,orb:0},
      {name:"Stephon Castle",min:33,pts:17,reb:7,ast:7,stl:0,blk:0,fgm:4,fga:13,tpm:1,tpa:5,ftm:8,fta:8,to:3,orb:1},
      {name:"Julian Champagnie",min:30,pts:6,reb:5,ast:3,stl:1,blk:1,fgm:2,fga:3,tpm:2,tpa:3,ftm:0,fta:0,to:2,orb:1},
      {name:"Dylan Harper",min:23,pts:6,reb:4,ast:2,stl:0,blk:0,fgm:3,fga:7,tpm:0,tpa:2,ftm:0,fta:0,to:2,orb:0},
      {name:"Keldon Johnson",min:20,pts:3,reb:7,ast:1,stl:1,blk:0,fgm:1,fga:4,tpm:1,tpa:2,ftm:0,fta:0,to:2,orb:0},
      {name:"Harrison Barnes",min:11,pts:2,reb:1,ast:0,stl:0,blk:0,fgm:1,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Luke Kornet",min:14,pts:10,reb:6,ast:1,stl:1,blk:0,fgm:5,fga:6,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:2}
    ],
    away: [ // POR
      {name:"Deni Avdija",min:39,pts:30,reb:10,ast:5,stl:1,blk:1,fgm:12,fga:21,tpm:2,tpa:5,ftm:4,fta:6,to:2,orb:1},
      {name:"Jrue Holiday",min:36,pts:9,reb:4,ast:1,stl:1,blk:0,fgm:4,fga:15,tpm:1,tpa:7,ftm:0,fta:0,to:1,orb:0},
      {name:"Toumani Camara",min:32,pts:8,reb:2,ast:1,stl:2,blk:1,fgm:2,fga:7,tpm:2,tpa:5,ftm:2,fta:2,to:2,orb:1},
      {name:"Scoot Henderson",min:27,pts:18,reb:3,ast:3,stl:1,blk:0,fgm:7,fga:11,tpm:2,tpa:4,ftm:2,fta:2,to:3,orb:0},
      {name:"Donovan Clingan",min:22,pts:4,reb:7,ast:0,stl:0,blk:0,fgm:2,fga:7,tpm:0,tpa:3,ftm:0,fta:0,to:0,orb:1},
      {name:"Shaedon Sharpe",min:22,pts:10,reb:2,ast:1,stl:0,blk:0,fgm:4,fga:13,tpm:0,tpa:4,ftm:2,fta:2,to:0,orb:0},
      {name:"Matisse Thybulle",min:21,pts:3,reb:4,ast:1,stl:1,blk:0,fgm:1,fga:3,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Jerami Grant",min:19,pts:5,reb:0,ast:2,stl:0,blk:2,fgm:2,fga:6,tpm:1,tpa:3,ftm:0,fta:0,to:1,orb:0},
      {name:"Robert Williams",min:17,pts:11,reb:6,ast:4,stl:0,blk:0,fgm:5,fga:7,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:0}
    ]
  },

  // ---- EAST ----

  "DET-ORL": {
    home: [ // DET
      {name:"Cade Cunningham",min:40,pts:39,reb:5,ast:4,stl:0,blk:0,fgm:13,fga:27,tpm:3,tpa:8,ftm:10,fta:11,to:3,orb:0},
      {name:"Tobias Harris",min:36,pts:17,reb:6,ast:3,stl:1,blk:2,fgm:5,fga:15,tpm:1,tpa:7,ftm:6,fta:7,to:3,orb:1},
      {name:"Jalen Duren",min:33,pts:8,reb:7,ast:1,stl:0,blk:1,fgm:3,fga:4,tpm:0,tpa:0,ftm:2,fta:4,to:3,orb:1},
      {name:"Duncan Robinson",min:26,pts:9,reb:0,ast:4,stl:0,blk:0,fgm:3,fga:8,tpm:3,tpa:6,ftm:0,fta:0,to:1,orb:0},
      {name:"Ausar Thompson",min:25,pts:8,reb:7,ast:1,stl:3,blk:0,fgm:3,fga:7,tpm:0,tpa:0,ftm:2,fta:2,to:2,orb:3},
      {name:"Daniss Jenkins",min:22,pts:6,reb:2,ast:2,stl:0,blk:1,fgm:1,fga:7,tpm:1,tpa:6,ftm:3,fta:6,to:0,orb:1},
      {name:"Isaiah Stewart",min:19,pts:3,reb:4,ast:0,stl:1,blk:1,fgm:0,fga:2,tpm:0,tpa:1,ftm:3,fta:4,to:0,orb:0},
      {name:"Kevin Huerter",min:18,pts:3,reb:2,ast:1,stl:1,blk:0,fgm:1,fga:3,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Ron Holland",min:11,pts:2,reb:2,ast:1,stl:1,blk:0,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,to:2,orb:0}
    ],
    away: [ // ORL
      {name:"Paolo Banchero",min:37,pts:23,reb:9,ast:4,stl:1,blk:0,fgm:8,fga:15,tpm:2,tpa:4,ftm:5,fta:7,to:3,orb:1},
      {name:"Wendell Carter Jr.",min:37,pts:17,reb:7,ast:5,stl:2,blk:1,fgm:8,fga:9,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:1},
      {name:"Jalen Suggs",min:36,pts:16,reb:4,ast:4,stl:3,blk:1,fgm:6,fga:16,tpm:3,tpa:10,ftm:1,fta:1,to:1,orb:1},
      {name:"Desmond Bane",min:35,pts:17,reb:6,ast:5,stl:2,blk:0,fgm:7,fga:20,tpm:1,tpa:8,ftm:2,fta:2,to:2,orb:2},
      {name:"Franz Wagner",min:32,pts:19,reb:5,ast:4,stl:2,blk:0,fgm:7,fga:13,tpm:1,tpa:2,ftm:4,fta:5,to:3,orb:0},
      {name:"Anthony Black",min:22,pts:7,reb:3,ast:3,stl:1,blk:2,fgm:3,fga:7,tpm:1,tpa:4,ftm:0,fta:2,to:0,orb:1},
      {name:"Tristan da Silva",min:21,pts:7,reb:4,ast:0,stl:0,blk:0,fgm:3,fga:6,tpm:1,tpa:3,ftm:0,fta:0,to:1,orb:2},
      {name:"Goga Bitadze",min:11,pts:4,reb:6,ast:1,stl:0,blk:2,fgm:1,fga:2,tpm:0,tpa:0,ftm:2,fta:2,to:0,orb:3}
    ]
  },

  "BOS-PHI": {
    home: [ // BOS
      {name:"Jayson Tatum",min:32,pts:25,reb:11,ast:7,stl:2,blk:0,fgm:9,fga:17,tpm:1,tpa:7,ftm:6,fta:6,to:1,orb:0},
      {name:"Jaylen Brown",min:30,pts:26,reb:4,ast:3,stl:2,blk:0,fgm:11,fga:21,tpm:2,tpa:2,ftm:2,fta:2,to:2,orb:1},
      {name:"Derrick White",min:33,pts:10,reb:3,ast:6,stl:1,blk:0,fgm:4,fga:10,tpm:2,tpa:7,ftm:0,fta:1,to:1,orb:1},
      {name:"Sam Hauser",min:28,pts:12,reb:7,ast:2,stl:1,blk:0,fgm:4,fga:6,tpm:4,tpa:6,ftm:0,fta:0,to:0,orb:1},
      {name:"Neemias Queta",min:15,pts:13,reb:2,ast:1,stl:0,blk:1,fgm:5,fga:5,tpm:0,tpa:0,ftm:3,fta:4,to:0,orb:0},
      {name:"Payton Pritchard",min:34,pts:12,reb:3,ast:6,stl:1,blk:0,fgm:4,fga:12,tpm:2,tpa:9,ftm:2,fta:3,to:2,orb:0},
      {name:"Nikola Vucevic",min:18,pts:3,reb:6,ast:3,stl:0,blk:0,fgm:1,fga:3,tpm:1,tpa:2,ftm:0,fta:0,to:2,orb:0},
      {name:"Baylor Scheierman",min:15,pts:5,reb:2,ast:0,stl:0,blk:1,fgm:2,fga:5,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Jordan Walsh",min:15,pts:5,reb:2,ast:2,stl:0,blk:0,fgm:2,fga:5,tpm:1,tpa:3,ftm:0,fta:2,to:0,orb:0},
      {name:"Luka Garza",min:14,pts:7,reb:2,ast:1,stl:0,blk:0,fgm:1,fga:4,tpm:1,tpa:4,ftm:4,fta:4,to:0,orb:2}
    ],
    away: [ // PHI
      {name:"Tyrese Maxey",min:37,pts:21,reb:1,ast:8,stl:0,blk:0,fgm:8,fga:20,tpm:1,tpa:4,ftm:4,fta:5,to:3,orb:0},
      {name:"Paul George",min:28,pts:17,reb:4,ast:1,stl:0,blk:0,fgm:4,fga:8,tpm:1,tpa:2,ftm:8,fta:9,to:2,orb:0},
      {name:"VJ Edgecombe",min:34,pts:13,reb:3,ast:3,stl:2,blk:0,fgm:6,fga:16,tpm:0,tpa:5,ftm:1,fta:1,to:2,orb:3},
      {name:"Kelly Oubre Jr.",min:31,pts:10,reb:7,ast:2,stl:0,blk:0,fgm:5,fga:14,tpm:0,tpa:5,ftm:0,fta:1,to:1,orb:1},
      {name:"Adem Bona",min:14,pts:3,reb:3,ast:0,stl:0,blk:0,fgm:1,fga:3,tpm:0,tpa:0,ftm:1,fta:2,to:1,orb:2},
      {name:"Quentin Grimes",min:25,pts:7,reb:4,ast:2,stl:0,blk:0,fgm:3,fga:6,tpm:1,tpa:2,ftm:0,fta:0,to:2,orb:0},
      {name:"Andre Drummond",min:21,pts:2,reb:5,ast:2,stl:1,blk:1,fgm:1,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:3,orb:0},
      {name:"Justin Edwards",min:17,pts:7,reb:6,ast:0,stl:0,blk:0,fgm:3,fga:9,tpm:1,tpa:3,ftm:0,fta:1,to:0,orb:3},
      {name:"Dominick Barlow",min:15,pts:4,reb:3,ast:0,stl:0,blk:0,fgm:1,fga:6,tpm:0,tpa:0,ftm:2,fta:2,to:0,orb:2}
    ]
  },

  "NYK-ATL": {
    home: [ // NYK
      {name:"Jalen Brunson",min:36,pts:28,reb:5,ast:7,stl:1,blk:0,fgm:9,fga:22,tpm:3,tpa:4,ftm:7,fta:8,to:2,orb:1},
      {name:"Karl-Anthony Towns",min:33,pts:25,reb:8,ast:4,stl:1,blk:3,fgm:6,fga:13,tpm:3,tpa:4,ftm:10,fta:10,to:5,orb:2},
      {name:"OG Anunoby",min:38,pts:18,reb:8,ast:0,stl:1,blk:0,fgm:6,fga:9,tpm:2,tpa:3,ftm:4,fta:4,to:0,orb:0},
      {name:"Josh Hart",min:37,pts:11,reb:14,ast:5,stl:3,blk:0,fgm:4,fga:8,tpm:0,tpa:1,ftm:3,fta:4,to:2,orb:0},
      {name:"Mikal Bridges",min:32,pts:11,reb:2,ast:1,stl:1,blk:0,fgm:5,fga:9,tpm:1,tpa:4,ftm:0,fta:0,to:1,orb:0},
      {name:"Miles McBride",min:21,pts:6,reb:1,ast:2,stl:0,blk:0,fgm:2,fga:6,tpm:2,tpa:4,ftm:0,fta:0,to:1,orb:0},
      {name:"Mitchell Robinson",min:15,pts:3,reb:4,ast:1,stl:0,blk:2,fgm:1,fga:1,tpm:0,tpa:0,ftm:1,fta:4,to:0,orb:0},
      {name:"Jordan Clarkson",min:11,pts:8,reb:2,ast:1,stl:0,blk:0,fgm:4,fga:6,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:2},
      {name:"Landry Shamet",min:18,pts:3,reb:1,ast:1,stl:0,blk:0,fgm:1,fga:6,tpm:1,tpa:5,ftm:0,fta:0,to:0,orb:1}
    ],
    away: [ // ATL
      {name:"CJ McCollum",min:34,pts:26,reb:3,ast:1,stl:0,blk:1,fgm:11,fga:20,tpm:4,tpa:9,ftm:0,fta:2,to:5,orb:0},
      {name:"Jalen Johnson",min:39,pts:23,reb:7,ast:3,stl:0,blk:0,fgm:8,fga:19,tpm:3,tpa:7,ftm:4,fta:4,to:1,orb:0},
      {name:"Onyeka Okongwu",min:37,pts:19,reb:8,ast:2,stl:0,blk:1,fgm:6,fga:9,tpm:4,tpa:6,ftm:3,fta:4,to:2,orb:1},
      {name:"Dyson Daniels",min:36,pts:4,reb:9,ast:11,stl:3,blk:0,fgm:2,fga:7,tpm:0,tpa:2,ftm:0,fta:0,to:2,orb:1},
      {name:"Nickeil Alexander-Walker",min:39,pts:17,reb:1,ast:4,stl:0,blk:1,fgm:6,fga:17,tpm:3,tpa:8,ftm:2,fta:4,to:1,orb:0},
      {name:"Jonathan Kuminga",min:27,pts:8,reb:4,ast:1,stl:0,blk:0,fgm:3,fga:7,tpm:0,tpa:2,ftm:2,fta:3,to:0,orb:1},
      {name:"Gabe Vincent",min:15,pts:2,reb:1,ast:2,stl:1,blk:0,fgm:1,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:1,orb:1},
      {name:"Mouhamed Gueye",min:11,pts:3,reb:3,ast:1,stl:1,blk:0,fgm:1,fga:3,tpm:0,tpa:2,ftm:1,fta:2,to:0,orb:2}
    ]
  },

  "CLE-TOR": {
    home: [ // CLE — full 10-man rotation from NBA.com box score
      {name:"Donovan Mitchell",min:31,pts:32,reb:3,ast:4,stl:2,blk:0,fgm:11,fga:20,tpm:4,tpa:7,ftm:6,fta:7,to:4,orb:1},
      {name:"James Harden",min:33,pts:22,reb:2,ast:10,stl:2,blk:0,fgm:8,fga:18,tpm:4,tpa:7,ftm:2,fta:2,to:4,orb:0},
      {name:"Evan Mobley",min:33,pts:17,reb:7,ast:4,stl:0,blk:0,fgm:6,fga:9,tpm:1,tpa:2,ftm:4,fta:6,to:2,orb:2},
      {name:"Jarrett Allen",min:28,pts:10,reb:7,ast:0,stl:1,blk:0,fgm:5,fga:7,tpm:0,tpa:0,ftm:0,fta:2,to:0,orb:1},
      {name:"Max Strus",min:24,pts:24,reb:3,ast:0,stl:0,blk:0,fgm:8,fga:10,tpm:4,tpa:6,ftm:4,fta:4,to:2,orb:1},
      {name:"Dean Wade",min:23,pts:5,reb:3,ast:1,stl:2,blk:0,fgm:2,fga:3,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:1},
      {name:"Sam Merrill",min:21,pts:7,reb:4,ast:2,stl:0,blk:0,fgm:1,fga:4,tpm:1,tpa:3,ftm:4,fta:4,to:0,orb:1},
      {name:"Keon Ellis",min:15,pts:3,reb:3,ast:0,stl:1,blk:0,fgm:1,fga:1,tpm:1,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Jaylon Tyson",min:14,pts:2,reb:0,ast:1,stl:1,blk:0,fgm:0,fga:4,tpm:0,tpa:2,ftm:2,fta:2,to:0,orb:0},
      {name:"Dennis Schroder",min:13,pts:2,reb:1,ast:2,stl:0,blk:0,fgm:1,fga:4,tpm:0,tpa:2,ftm:0,fta:0,to:1,orb:0}
    ],
    away: [ // TOR — full 9-man rotation from NBA.com box score
      {name:"RJ Barrett",min:31,pts:24,reb:2,ast:3,stl:1,blk:0,fgm:7,fga:13,tpm:3,tpa:6,ftm:7,fta:9,to:4,orb:0},
      {name:"Scottie Barnes",min:32,pts:21,reb:1,ast:7,stl:0,blk:0,fgm:6,fga:14,tpm:3,tpa:4,ftm:6,fta:9,to:5,orb:0},
      {name:"Brandon Ingram",min:36,pts:17,reb:2,ast:4,stl:0,blk:1,fgm:5,fga:9,tpm:0,tpa:1,ftm:7,fta:10,to:1,orb:0},
      {name:"Jamal Shead",min:28,pts:17,reb:1,ast:2,stl:0,blk:0,fgm:6,fga:11,tpm:5,tpa:6,ftm:0,fta:1,to:2,orb:0},
      {name:"Jakob Poeltl",min:21,pts:4,reb:6,ast:2,stl:1,blk:2,fgm:1,fga:2,tpm:0,tpa:0,ftm:2,fta:2,to:2,orb:0},
      {name:"Collin Murray-Boyles",min:20,pts:14,reb:4,ast:4,stl:0,blk:0,fgm:7,fga:8,tpm:0,tpa:1,ftm:0,fta:0,to:1,orb:1},
      {name:"Ja'Kobe Walter",min:28,pts:7,reb:2,ast:2,stl:0,blk:0,fgm:2,fga:5,tpm:1,tpa:4,ftm:2,fta:2,to:0,orb:0},
      {name:"Sandro Mamukelashvili",min:20,pts:3,reb:8,ast:2,stl:1,blk:0,fgm:1,fga:3,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:3},
      {name:"A.J. Lawson",min:14,pts:2,reb:0,ast:3,stl:0,blk:1,fgm:1,fga:4,tpm:0,tpa:2,ftm:0,fta:0,to:1,orb:0}
    ]
  }
};

// ============================================================
// GAME 2 BOX SCORES
// ============================================================

const G2_BOX_SCORES = {
  "CLE-TOR": {
    home: [ // CLE
      {name:"Donovan Mitchell",min:37,pts:30,reb:7,ast:5,stl:0,blk:0,fgm:13,fga:23,tpm:4,tpa:10,ftm:0,fta:0,to:0,orb:0},
      {name:"James Harden",min:34,pts:28,reb:5,ast:4,stl:5,blk:0,fgm:9,fga:14,tpm:3,tpa:8,ftm:7,fta:10,to:5,orb:0},
      {name:"Evan Mobley",min:33,pts:25,reb:8,ast:2,stl:0,blk:0,fgm:11,fga:13,tpm:1,tpa:2,ftm:2,fta:2,to:0,orb:0},
      {name:"Jarrett Allen",min:25,pts:10,reb:3,ast:1,stl:2,blk:3,fgm:4,fga:6,tpm:0,tpa:0,ftm:2,fta:2,to:0,orb:0},
      {name:"Dean Wade",min:28,pts:3,reb:5,ast:1,stl:2,blk:0,fgm:1,fga:3,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Max Strus",min:26,pts:6,reb:3,ast:3,stl:0,blk:0,fgm:2,fga:5,tpm:2,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Dennis Schroder",min:13,pts:5,reb:1,ast:4,stl:0,blk:0,fgm:1,fga:5,tpm:0,tpa:2,ftm:3,fta:3,to:0,orb:0},
      {name:"Sam Merrill",min:20,pts:5,reb:1,ast:1,stl:0,blk:0,fgm:2,fga:6,tpm:1,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Jaylon Tyson",min:11,pts:3,reb:2,ast:1,stl:0,blk:0,fgm:1,fga:4,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Keon Ellis",min:8,pts:0,reb:0,ast:0,stl:2,blk:0,fgm:0,fga:4,tpm:0,tpa:2,ftm:0,fta:0,to:0,orb:0}
    ],
    away: [ // TOR
      {name:"Scottie Barnes",min:39,pts:26,reb:4,ast:5,stl:2,blk:1,fgm:11,fga:19,tpm:1,tpa:4,ftm:3,fta:4,to:4,orb:0},
      {name:"RJ Barrett",min:37,pts:22,reb:9,ast:5,stl:0,blk:0,fgm:10,fga:13,tpm:0,tpa:1,ftm:2,fta:3,to:4,orb:0},
      {name:"Brandon Ingram",min:35,pts:7,reb:4,ast:3,stl:0,blk:0,fgm:3,fga:15,tpm:0,tpa:3,ftm:1,fta:2,to:5,orb:0},
      {name:"Jamal Shead",min:37,pts:3,reb:3,ast:4,stl:2,blk:1,fgm:1,fga:5,tpm:0,tpa:2,ftm:1,fta:2,to:3,orb:0},
      {name:"Jakob Poeltl",min:9,pts:2,reb:4,ast:1,stl:0,blk:0,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,to:2,orb:0},
      {name:"Collin Murray-Boyles",min:25,pts:17,reb:7,ast:1,stl:1,blk:1,fgm:6,fga:10,tpm:0,tpa:1,ftm:5,fta:6,to:0,orb:0},
      {name:"Ja'Kobe Walter",min:27,pts:14,reb:1,ast:1,stl:0,blk:0,fgm:5,fga:9,tpm:3,tpa:7,ftm:1,fta:1,to:0,orb:0},
      {name:"Sandro Mamukelashvili",min:20,pts:12,reb:10,ast:2,stl:0,blk:0,fgm:5,fga:8,tpm:2,tpa:3,ftm:0,fta:0,to:0,orb:3},
      {name:"A.J. Lawson",min:5,pts:2,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:2,tpm:0,tpa:1,ftm:2,fta:2,to:0,orb:0}
    ]
  },
  "DEN-MIN": {
    home: [ // DEN
      {name:"Aaron Gordon",min:37,pts:8,reb:7,ast:4,stl:0,blk:0,fgm:3,fga:9,tpm:1,tpa:4,ftm:1,fta:2,to:0,orb:0},
      {name:"Cameron Johnson",min:28,pts:13,reb:1,ast:2,stl:0,blk:1,fgm:5,fga:10,tpm:1,tpa:6,ftm:2,fta:2,to:0,orb:0},
      {name:"Nikola Jokic",min:40,pts:24,reb:15,ast:8,stl:0,blk:1,fgm:8,fga:20,tpm:1,tpa:7,ftm:7,fta:7,to:3,orb:0},
      {name:"Jamal Murray",min:33,pts:30,reb:7,ast:7,stl:1,blk:0,fgm:11,fga:25,tpm:6,tpa:14,ftm:2,fta:2,to:4,orb:3},
      {name:"Christian Braun",min:35,pts:16,reb:3,ast:5,stl:2,blk:0,fgm:5,fga:9,tpm:1,tpa:3,ftm:5,fta:7,to:0,orb:0},
      {name:"Spencer Jones",min:10,pts:0,reb:2,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:0},
      {name:"Jonas Valanciunas",min:3,pts:0,reb:2,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:1},
      {name:"Tim Hardaway Jr.",min:27,pts:16,reb:3,ast:0,stl:1,blk:0,fgm:4,fga:9,tpm:3,tpa:3,ftm:5,fta:8,to:0,orb:1},
      {name:"Bruce Brown",min:16,pts:7,reb:3,ast:2,stl:0,blk:0,fgm:2,fga:4,tpm:2,tpa:4,ftm:1,fta:2,to:1,orb:0}
    ],
    away: [ // MIN
      {name:"Julius Randle",min:36,pts:24,reb:9,ast:6,stl:0,blk:0,fgm:7,fga:14,tpm:2,tpa:4,ftm:8,fta:10,to:1,orb:0},
      {name:"Jaden McDaniels",min:37,pts:14,reb:2,ast:3,stl:0,blk:0,fgm:7,fga:15,tpm:0,tpa:3,ftm:0,fta:1,to:3,orb:1},
      {name:"Rudy Gobert",min:28,pts:2,reb:7,ast:1,stl:2,blk:0,fgm:1,fga:4,tpm:0,tpa:0,ftm:0,fta:2,to:2,orb:3},
      {name:"Donte DiVincenzo",min:31,pts:16,reb:7,ast:6,stl:1,blk:0,fgm:6,fga:9,tpm:4,tpa:7,ftm:0,fta:2,to:2,orb:0},
      {name:"Anthony Edwards",min:40,pts:30,reb:10,ast:2,stl:1,blk:2,fgm:10,fga:25,tpm:3,tpa:11,ftm:7,fta:9,to:2,orb:1},
      {name:"Kyle Anderson",min:5,pts:0,reb:1,ast:2,stl:0,blk:1,fgm:0,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Naz Reid",min:27,pts:11,reb:9,ast:1,stl:0,blk:0,fgm:4,fga:9,tpm:1,tpa:3,ftm:2,fta:4,to:0,orb:2},
      {name:"Mike Conley",min:4,pts:0,reb:0,ast:2,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Ayo Dosunmu",min:22,pts:9,reb:4,ast:5,stl:0,blk:0,fgm:4,fga:8,tpm:1,tpa:2,ftm:0,fta:0,to:1,orb:2},
      {name:"Bones Hyland",min:10,pts:13,reb:0,ast:2,stl:1,blk:0,fgm:4,fga:5,tpm:3,tpa:4,ftm:2,fta:2,to:1,orb:0}
    ]
  },
  "NYK-ATL": {
    home: [ // NYK
      {name:"Jalen Brunson",min:35,pts:29,reb:2,ast:7,stl:0,blk:0,fgm:10,fga:26,tpm:4,tpa:10,ftm:5,fta:7,to:3,orb:0},
      {name:"Karl-Anthony Towns",min:33,pts:18,reb:8,ast:2,stl:0,blk:2,fgm:8,fga:12,tpm:0,tpa:0,ftm:2,fta:4,to:3,orb:2},
      {name:"Josh Hart",min:35,pts:15,reb:13,ast:6,stl:1,blk:0,fgm:5,fga:11,tpm:1,tpa:5,ftm:4,fta:6,to:1,orb:3},
      {name:"OG Anunoby",min:37,pts:14,reb:8,ast:2,stl:2,blk:1,fgm:4,fga:9,tpm:2,tpa:4,ftm:4,fta:8,to:1,orb:1},
      {name:"Mikal Bridges",min:37,pts:10,reb:1,ast:2,stl:1,blk:0,fgm:3,fga:10,tpm:2,tpa:6,ftm:2,fta:2,to:0,orb:0},
      {name:"Mitchell Robinson",min:18,pts:13,reb:7,ast:0,stl:1,blk:1,fgm:6,fga:6,tpm:0,tpa:0,ftm:1,fta:2,to:1,orb:4},
      {name:"Jordan Clarkson",min:11,pts:7,reb:5,ast:0,stl:0,blk:0,fgm:3,fga:6,tpm:0,tpa:1,ftm:1,fta:2,to:0,orb:1},
      {name:"Landry Shamet",min:9,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:1,ftm:0,fta:0,to:2,orb:0},
      {name:"Jose Alvarado",min:8,pts:0,reb:2,ast:3,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:1,orb:0},
      {name:"Miles McBride",min:13,pts:0,reb:1,ast:0,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:2,orb:0}
    ],
    away: [ // ATL
      {name:"CJ McCollum",min:35,pts:32,reb:3,ast:6,stl:2,blk:1,fgm:12,fga:22,tpm:3,tpa:10,ftm:5,fta:7,to:2,orb:0},
      {name:"Jalen Johnson",min:35,pts:17,reb:8,ast:3,stl:1,blk:0,fgm:6,fga:12,tpm:0,tpa:3,ftm:5,fta:5,to:3,orb:1},
      {name:"Onyeka Okongwu",min:29,pts:15,reb:8,ast:1,stl:0,blk:0,fgm:6,fga:9,tpm:2,tpa:3,ftm:1,fta:2,to:0,orb:3},
      {name:"Nickeil Alexander-Walker",min:38,pts:9,reb:5,ast:6,stl:0,blk:3,fgm:3,fga:12,tpm:2,tpa:5,ftm:1,fta:1,to:2,orb:0},
      {name:"Dyson Daniels",min:26,pts:6,reb:4,ast:2,stl:2,blk:1,fgm:2,fga:5,tpm:0,tpa:1,ftm:2,fta:2,to:0,orb:0},
      {name:"Jonathan Kuminga",min:34,pts:19,reb:4,ast:1,stl:2,blk:1,fgm:7,fga:12,tpm:1,tpa:4,ftm:4,fta:6,to:1,orb:1},
      {name:"Coby White",min:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Corey Kispert",min:8,pts:4,reb:2,ast:1,stl:1,blk:0,fgm:2,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Gabe Vincent",min:14,pts:3,reb:1,ast:1,stl:0,blk:0,fgm:1,fga:2,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Tony Bradley",min:12,pts:2,reb:1,ast:1,stl:1,blk:1,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:0},
      {name:"Bilal Coulibaly",min:4,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0}
    ]
  },
  "HOU-LAL": {
    home: [ // HOU (home in data, LAL had actual home court)
      {name:"Kevin Durant",min:41,pts:23,reb:6,ast:4,stl:1,blk:1,fgm:7,fga:12,tpm:1,tpa:4,ftm:8,fta:9,to:9,orb:2},
      {name:"Jabari Smith Jr.",min:39,pts:18,reb:6,ast:1,stl:0,blk:1,fgm:7,fga:16,tpm:3,tpa:7,ftm:1,fta:2,to:1,orb:1},
      {name:"Alperen Sengun",min:35,pts:20,reb:11,ast:5,stl:4,blk:2,fgm:9,fga:20,tpm:0,tpa:1,ftm:2,fta:3,to:1,orb:5},
      {name:"Josh Okogie",min:24,pts:7,reb:2,ast:0,stl:0,blk:0,fgm:3,fga:6,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Amen Thompson",min:42,pts:16,reb:5,ast:9,stl:1,blk:0,fgm:6,fga:10,tpm:0,tpa:1,ftm:4,fta:5,to:3,orb:1},
      {name:"Tari Eason",min:27,pts:10,reb:8,ast:1,stl:0,blk:1,fgm:4,fga:14,tpm:2,tpa:6,ftm:0,fta:0,to:1,orb:5},
      {name:"Jae'Sean Tate",min:9,pts:0,reb:1,ast:0,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Clint Capela",min:5,pts:0,reb:2,ast:0,stl:0,blk:1,fgm:0,fga:3,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:1},
      {name:"Aaron Holiday",min:7,pts:0,reb:1,ast:0,stl:1,blk:0,fgm:0,fga:3,tpm:0,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Reed Sheppard",min:11,pts:0,reb:3,ast:0,stl:0,blk:0,fgm:0,fga:4,tpm:0,tpa:3,ftm:0,fta:0,to:1,orb:0}
    ],
    away: [ // LAL
      {name:"LeBron James",min:39,pts:28,reb:8,ast:7,stl:3,blk:1,fgm:8,fga:20,tpm:2,tpa:5,ftm:10,fta:14,to:0,orb:1},
      {name:"Rui Hachimura",min:43,pts:13,reb:5,ast:2,stl:0,blk:0,fgm:5,fga:10,tpm:3,tpa:6,ftm:0,fta:0,to:0,orb:0},
      {name:"Deandre Ayton",min:30,pts:0,reb:5,ast:1,stl:1,blk:0,fgm:0,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:1},
      {name:"Marcus Smart",min:35,pts:25,reb:2,ast:7,stl:5,blk:1,fgm:8,fga:13,tpm:5,tpa:7,ftm:4,fta:5,to:3,orb:0},
      {name:"Luke Kennard",min:42,pts:23,reb:6,ast:2,stl:2,blk:0,fgm:8,fga:13,tpm:3,tpa:6,ftm:4,fta:4,to:3,orb:0},
      {name:"Jarred Vanderbilt",min:14,pts:0,reb:5,ast:1,stl:0,blk:1,fgm:0,fga:3,tpm:0,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Jake LaRavia",min:16,pts:0,reb:2,ast:0,stl:2,blk:0,fgm:0,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:1,orb:1},
      {name:"Jaxson Hayes",min:21,pts:6,reb:5,ast:1,stl:0,blk:1,fgm:1,fga:2,tpm:0,tpa:1,ftm:4,fta:5,to:0,orb:2},
      {name:"Bronny James",min:2,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0}
    ]
  },
  "OKC-PHX": {
    home: [ // OKC
      {name:"Shai Gilgeous-Alexander",min:38,pts:37,reb:5,ast:9,stl:1,blk:0,fgm:13,fga:25,tpm:2,tpa:5,ftm:9,fta:9,to:3,orb:1},
      {name:"Jalen Williams",min:23,pts:19,reb:1,ast:4,stl:1,blk:0,fgm:7,fga:11,tpm:2,tpa:3,ftm:3,fta:5,to:1,orb:0},
      {name:"Chet Holmgren",min:32,pts:19,reb:8,ast:0,stl:0,blk:4,fgm:7,fga:12,tpm:3,tpa:6,ftm:2,fta:3,to:3,orb:1},
      {name:"Isaiah Hartenstein",min:22,pts:9,reb:10,ast:2,stl:1,blk:1,fgm:3,fga:6,tpm:0,tpa:0,ftm:3,fta:4,to:1,orb:6},
      {name:"Lu Dort",min:24,pts:9,reb:1,ast:0,stl:1,blk:0,fgm:3,fga:7,tpm:3,tpa:7,ftm:0,fta:0,to:0,orb:0},
      {name:"Ajay Mitchell",min:29,pts:14,reb:5,ast:5,stl:2,blk:0,fgm:5,fga:12,tpm:1,tpa:5,ftm:3,fta:4,to:1,orb:3},
      {name:"Alex Caruso",min:23,pts:7,reb:2,ast:1,stl:3,blk:0,fgm:3,fga:7,tpm:1,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Cason Wallace",min:21,pts:0,reb:6,ast:2,stl:3,blk:0,fgm:0,fga:2,tpm:0,tpa:2,ftm:0,fta:0,to:0,orb:1},
      {name:"Isaiah Joe",min:15,pts:6,reb:1,ast:0,stl:1,blk:0,fgm:2,fga:7,tpm:2,tpa:7,ftm:0,fta:0,to:1,orb:0},
      {name:"Jaylin Williams",min:11,pts:0,reb:1,ast:1,stl:1,blk:1,fgm:0,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0}
    ],
    away: [ // PHX
      {name:"Devin Booker",min:40,pts:22,reb:7,ast:4,stl:1,blk:0,fgm:7,fga:14,tpm:0,tpa:3,ftm:8,fta:10,to:5,orb:3},
      {name:"Dillon Brooks",min:38,pts:30,reb:6,ast:1,stl:0,blk:0,fgm:12,fga:23,tpm:5,tpa:9,ftm:1,fta:1,to:1,orb:0},
      {name:"Jalen Green",min:41,pts:21,reb:5,ast:3,stl:2,blk:0,fgm:8,fga:23,tpm:1,tpa:8,ftm:4,fta:5,to:7,orb:3},
      {name:"Collin Gillespie",min:29,pts:7,reb:6,ast:6,stl:2,blk:0,fgm:3,fga:9,tpm:1,tpa:5,ftm:0,fta:0,to:2,orb:3},
      {name:"Oso Ighodaro",min:29,pts:7,reb:8,ast:5,stl:0,blk:1,fgm:3,fga:8,tpm:0,tpa:0,ftm:1,fta:2,to:2,orb:4},
      {name:"Royce O'Neale",min:34,pts:16,reb:9,ast:4,stl:2,blk:0,fgm:4,fga:5,tpm:4,tpa:5,ftm:4,fta:4,to:2,orb:2},
      {name:"Ryan Dunn",min:8,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Khaman Maluach",min:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Amir Coffey",min:19,pts:4,reb:2,ast:0,stl:0,blk:0,fgm:2,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:2,orb:0}
    ]
  },
  "DET-ORL": {
    home: [ // DET
      {name:"Cade Cunningham",min:37,pts:27,reb:6,ast:11,stl:2,blk:2,fgm:11,fga:19,tpm:1,tpa:6,ftm:4,fta:8,to:7,orb:0},
      {name:"Tobias Harris",min:33,pts:16,reb:11,ast:1,stl:2,blk:2,fgm:7,fga:17,tpm:0,tpa:3,ftm:2,fta:2,to:1,orb:4},
      {name:"Jalen Duren",min:32,pts:11,reb:9,ast:4,stl:1,blk:0,fgm:4,fga:10,tpm:0,tpa:0,ftm:3,fta:5,to:3,orb:4},
      {name:"Duncan Robinson",min:32,pts:10,reb:6,ast:3,stl:2,blk:1,fgm:3,fga:9,tpm:3,tpa:8,ftm:1,fta:2,to:2,orb:2},
      {name:"Ausar Thompson",min:28,pts:11,reb:8,ast:1,stl:2,blk:1,fgm:5,fga:9,tpm:0,tpa:0,ftm:1,fta:2,to:2,orb:3},
      {name:"Isaiah Stewart",min:16,pts:10,reb:5,ast:0,stl:0,blk:2,fgm:4,fga:4,tpm:1,tpa:1,ftm:1,fta:1,to:3,orb:2},
      {name:"Javonte Green",min:23,pts:2,reb:5,ast:0,stl:1,blk:3,fgm:0,fga:1,tpm:0,tpa:1,ftm:2,fta:2,to:1,orb:1},
      {name:"Caris LeVert",min:14,pts:4,reb:1,ast:0,stl:0,blk:0,fgm:2,fga:6,tpm:0,tpa:2,ftm:0,fta:0,to:0,orb:0},
      {name:"Kevin Huerter",min:6,pts:3,reb:1,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:1,tpa:2,ftm:0,fta:0,to:2,orb:0},
      {name:"Daniss Jenkins",min:11,pts:4,reb:2,ast:2,stl:0,blk:1,fgm:2,fga:7,tpm:0,tpa:2,ftm:0,fta:2,to:1,orb:1}
    ],
    away: [ // ORL
      {name:"Paolo Banchero",min:34,pts:18,reb:6,ast:8,stl:1,blk:1,fgm:7,fga:17,tpm:0,tpa:2,ftm:4,fta:8,to:4,orb:1},
      {name:"Franz Wagner",min:32,pts:12,reb:7,ast:1,stl:4,blk:0,fgm:4,fga:11,tpm:0,tpa:2,ftm:4,fta:4,to:2,orb:2},
      {name:"Wendell Carter Jr.",min:24,pts:3,reb:5,ast:0,stl:1,blk:2,fgm:1,fga:6,tpm:0,tpa:2,ftm:1,fta:2,to:0,orb:2},
      {name:"Desmond Bane",min:34,pts:12,reb:4,ast:2,stl:2,blk:1,fgm:2,fga:11,tpm:2,tpa:7,ftm:6,fta:7,to:3,orb:1},
      {name:"Jalen Suggs",min:32,pts:19,reb:6,ast:4,stl:0,blk:0,fgm:7,fga:18,tpm:3,tpa:10,ftm:2,fta:2,to:3,orb:0},
      {name:"Anthony Black",min:24,pts:5,reb:3,ast:1,stl:3,blk:0,fgm:1,fga:6,tpm:0,tpa:1,ftm:3,fta:4,to:1,orb:0},
      {name:"Goga Bitadze",min:21,pts:3,reb:5,ast:0,stl:2,blk:2,fgm:0,fga:0,tpm:0,tpa:0,ftm:3,fta:4,to:2,orb:2},
      {name:"Tristan da Silva",min:17,pts:3,reb:3,ast:0,stl:1,blk:0,fgm:1,fga:3,tpm:1,tpa:2,ftm:0,fta:0,to:1,orb:1},
      {name:"Jevon Carter",min:13,pts:0,reb:0,ast:1,stl:1,blk:0,fgm:0,fga:1,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Jase Richardson",min:3,pts:6,reb:0,ast:0,stl:0,blk:0,fgm:2,fga:2,tpm:2,tpa:2,ftm:0,fta:0,to:0,orb:0}
    ]
  }
};

const G3_BOX_SCORES = {

  "NYK-ATL": {
    home: [ // NYK
      {name:"OG Anunoby",min:37,pts:29,reb:9,ast:1,stl:1,blk:3,fgm:9,fga:16,tpm:4,tpa:8,ftm:7,fta:7,to:0,orb:4},
      {name:"Karl-Anthony Towns",min:34,pts:21,reb:17,ast:4,stl:2,blk:2,fgm:7,fga:12,tpm:1,tpa:3,ftm:6,fta:6,to:3,orb:4},
      {name:"Josh Hart",min:40,pts:2,reb:9,ast:6,stl:2,blk:0,fgm:1,fga:9,tpm:0,tpa:4,ftm:0,fta:0,to:2,orb:2},
      {name:"Mikal Bridges",min:21,pts:0,reb:1,ast:2,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:2,ftm:0,fta:0,to:4,orb:0},
      {name:"Jalen Brunson",min:40,pts:26,reb:3,ast:4,stl:2,blk:0,fgm:11,fga:23,tpm:0,tpa:5,ftm:4,fta:5,to:3,orb:0},
      {name:"Mitchell Robinson",min:11,pts:2,reb:4,ast:0,stl:1,blk:0,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:2},
      {name:"Jordan Clarkson",min:17,pts:8,reb:2,ast:1,stl:0,blk:0,fgm:4,fga:11,tpm:0,tpa:2,ftm:0,fta:1,to:1,orb:2},
      {name:"Miles McBride",min:31,pts:15,reb:1,ast:1,stl:2,blk:0,fgm:5,fga:14,tpm:5,tpa:10,ftm:0,fta:0,to:2,orb:0},
      {name:"Jose Alvarado",min:6,pts:5,reb:0,ast:0,stl:0,blk:0,fgm:2,fga:3,tpm:0,tpa:1,ftm:1,fta:1,to:0,orb:0}
    ],
    away: [ // ATL
      {name:"Onyeka Okongwu",min:37,pts:9,reb:7,ast:1,stl:1,blk:2,fgm:4,fga:7,tpm:1,tpa:4,ftm:0,fta:0,to:1,orb:2},
      {name:"Jalen Johnson",min:38,pts:24,reb:10,ast:8,stl:2,blk:1,fgm:8,fga:19,tpm:2,tpa:6,ftm:6,fta:10,to:2,orb:1},
      {name:"CJ McCollum",min:35,pts:23,reb:5,ast:1,stl:2,blk:2,fgm:8,fga:19,tpm:2,tpa:4,ftm:5,fta:7,to:4,orb:3},
      {name:"Nickeil Alexander-Walker",min:38,pts:14,reb:3,ast:0,stl:1,blk:1,fgm:4,fga:12,tpm:3,tpa:7,ftm:3,fta:3,to:2,orb:0},
      {name:"Dyson Daniels",min:33,pts:8,reb:13,ast:6,stl:3,blk:1,fgm:3,fga:7,tpm:1,tpa:2,ftm:1,fta:2,to:5,orb:3},
      {name:"Corey Kispert",min:5,pts:0,reb:1,ast:1,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Jonathan Kuminga",min:28,pts:21,reb:4,ast:0,stl:1,blk:1,fgm:9,fga:14,tpm:2,tpa:4,ftm:1,fta:2,to:1,orb:2},
      {name:"Mouhamed Gueye",min:11,pts:5,reb:1,ast:1,stl:0,blk:0,fgm:2,fga:4,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:1},
      {name:"Gabe Vincent",min:14,pts:5,reb:1,ast:1,stl:0,blk:0,fgm:1,fga:3,tpm:1,tpa:3,ftm:2,fta:2,to:1,orb:1}
    ]
  },

  "CLE-TOR": {
    home: [ // CLE
      {name:"Dean Wade",min:22,pts:5,reb:5,ast:0,stl:1,blk:0,fgm:2,fga:5,tpm:1,tpa:4,ftm:0,fta:2,to:0,orb:3},
      {name:"Jarrett Allen",min:26,pts:12,reb:4,ast:1,stl:2,blk:3,fgm:5,fga:7,tpm:0,tpa:0,ftm:2,fta:2,to:1,orb:1},
      {name:"Evan Mobley",min:33,pts:15,reb:6,ast:7,stl:2,blk:1,fgm:4,fga:13,tpm:0,tpa:4,ftm:7,fta:8,to:2,orb:2},
      {name:"James Harden",min:33,pts:18,reb:4,ast:4,stl:0,blk:0,fgm:5,fga:13,tpm:3,tpa:10,ftm:5,fta:6,to:8,orb:0},
      {name:"Donovan Mitchell",min:33,pts:15,reb:5,ast:3,stl:0,blk:0,fgm:7,fga:16,tpm:1,tpa:7,ftm:0,fta:0,to:3,orb:1},
      {name:"Max Strus",min:26,pts:15,reb:6,ast:3,stl:1,blk:0,fgm:5,fga:10,tpm:4,tpa:8,ftm:1,fta:2,to:2,orb:3},
      {name:"Sam Merrill",min:18,pts:3,reb:3,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:1,tpa:2,ftm:0,fta:0,to:0,orb:3},
      {name:"Jaylon Tyson",min:16,pts:13,reb:2,ast:4,stl:1,blk:0,fgm:5,fga:9,tpm:3,tpa:6,ftm:0,fta:0,to:0,orb:1},
      {name:"Dennis Schroder",min:5,pts:3,reb:1,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:1,tpa:2,ftm:0,fta:0,to:3,orb:0},
      {name:"Keon Ellis",min:15,pts:0,reb:4,ast:0,stl:0,blk:1,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:1,orb:1},
      {name:"Larry Nance Jr.",min:3,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Thomas Bryant",min:3,pts:3,reb:1,ast:0,stl:0,blk:1,fgm:1,fga:2,tpm:0,tpa:1,ftm:1,fta:1,to:0,orb:0},
      {name:"Tyrese Proctor",min:3,pts:2,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:2,fta:2,to:0,orb:0},
      {name:"Craig Porter Jr.",min:3,pts:0,reb:0,ast:1,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Nae'Qwan Tomlin",min:3,pts:0,reb:1,ast:1,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:1}
    ],
    away: [ // TOR
      {name:"Brandon Ingram",min:29,pts:12,reb:3,ast:2,stl:2,blk:0,fgm:5,fga:9,tpm:1,tpa:2,ftm:1,fta:2,to:2,orb:0},
      {name:"RJ Barrett",min:39,pts:33,reb:5,ast:5,stl:2,blk:1,fgm:12,fga:19,tpm:6,tpa:8,ftm:3,fta:7,to:2,orb:0},
      {name:"Scottie Barnes",min:35,pts:33,reb:5,ast:11,stl:1,blk:1,fgm:11,fga:17,tpm:3,tpa:5,ftm:8,fta:10,to:1,orb:1},
      {name:"Jakob Poeltl",min:18,pts:8,reb:6,ast:2,stl:0,blk:1,fgm:4,fga:6,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:3},
      {name:"Ja'Kobe Walter",min:26,pts:0,reb:2,ast:0,stl:0,blk:0,fgm:0,fga:6,tpm:0,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Jamison Battle",min:16,pts:14,reb:2,ast:0,stl:0,blk:0,fgm:5,fga:5,tpm:4,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Collin Murray-Boyles",min:28,pts:22,reb:8,ast:2,stl:1,blk:1,fgm:11,fga:15,tpm:0,tpa:0,ftm:0,fta:0,to:2,orb:5},
      {name:"Sandro Mamukelashvili",min:11,pts:0,reb:2,ast:1,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:0,ftm:0,fta:2,to:1,orb:1},
      {name:"Jamal Mogbo",min:2,pts:2,reb:0,ast:0,stl:0,blk:0,fgm:1,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0}
    ]
  },

  "DEN-MIN": {
    home: [ // DEN
      {name:"Cameron Johnson",min:24,pts:6,reb:2,ast:1,stl:1,blk:0,fgm:2,fga:6,tpm:0,tpa:3,ftm:2,fta:2,to:0,orb:0},
      {name:"Spencer Jones",min:28,pts:6,reb:1,ast:0,stl:0,blk:1,fgm:2,fga:3,tpm:2,tpa:2,ftm:0,fta:0,to:1,orb:0},
      {name:"Nikola Jokic",min:35,pts:27,reb:15,ast:3,stl:2,blk:0,fgm:7,fga:26,tpm:2,tpa:10,ftm:11,fta:11,to:4,orb:2},
      {name:"Jamal Murray",min:35,pts:16,reb:3,ast:4,stl:0,blk:0,fgm:5,fga:17,tpm:0,tpa:5,ftm:6,fta:7,to:1,orb:0},
      {name:"Christian Braun",min:24,pts:2,reb:2,ast:0,stl:0,blk:1,fgm:0,fga:4,tpm:0,tpa:1,ftm:2,fta:4,to:0,orb:1},
      {name:"Zeke Nnaji",min:16,pts:10,reb:3,ast:1,stl:1,blk:0,fgm:2,fga:2,tpm:1,tpa:1,ftm:5,fta:6,to:0,orb:1},
      {name:"Tim Hardaway Jr.",min:28,pts:11,reb:5,ast:0,stl:0,blk:0,fgm:3,fga:8,tpm:2,tpa:6,ftm:3,fta:4,to:1,orb:1},
      {name:"Bruce Brown",min:23,pts:9,reb:4,ast:2,stl:1,blk:0,fgm:4,fga:7,tpm:0,tpa:0,ftm:1,fta:2,to:1,orb:0},
      {name:"Julian Strawther",min:14,pts:6,reb:3,ast:0,stl:0,blk:0,fgm:2,fga:7,tpm:1,tpa:3,ftm:1,fta:2,to:2,orb:1},
      {name:"Tyus Jones",min:4,pts:2,reb:0,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Dayron Holmes II",min:4,pts:0,reb:2,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Julian Pickett",min:4,pts:1,reb:0,ast:1,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:1,fta:2,to:0,orb:0}
    ],
    away: [ // MIN
      {name:"Julius Randle",min:33,pts:15,reb:6,ast:4,stl:0,blk:1,fgm:6,fga:15,tpm:0,tpa:3,ftm:3,fta:6,to:1,orb:1},
      {name:"Jaden McDaniels",min:41,pts:20,reb:10,ast:3,stl:1,blk:1,fgm:9,fga:13,tpm:1,tpa:3,ftm:1,fta:1,to:0,orb:4},
      {name:"Rudy Gobert",min:36,pts:10,reb:12,ast:3,stl:0,blk:3,fgm:3,fga:7,tpm:0,tpa:0,ftm:4,fta:5,to:0,orb:3},
      {name:"Donte DiVincenzo",min:33,pts:15,reb:4,ast:7,stl:4,blk:0,fgm:6,fga:13,tpm:3,tpa:8,ftm:0,fta:0,to:1,orb:0},
      {name:"Anthony Edwards",min:24,pts:17,reb:5,ast:3,stl:0,blk:0,fgm:6,fga:15,tpm:2,tpa:8,ftm:3,fta:3,to:2,orb:0},
      {name:"Naz Reid",min:18,pts:5,reb:6,ast:2,stl:0,blk:0,fgm:2,fga:7,tpm:1,tpa:4,ftm:0,fta:0,to:2,orb:1},
      {name:"Ayo Dosunmu",min:32,pts:25,reb:3,ast:9,stl:0,blk:0,fgm:10,fga:15,tpm:0,tpa:3,ftm:5,fta:6,to:2,orb:1},
      {name:"Bones Hyland",min:15,pts:6,reb:4,ast:0,stl:0,blk:0,fgm:2,fga:5,tpm:2,tpa:4,ftm:0,fta:0,to:2,orb:0}
    ]
  }
};

const G4_BOX_SCORES = {
  "CLE-TOR": {
    homeTeam: "CLE",
    awayTeam: "TOR",
    home: [
      {name:"Dean Wade",min:28,pts:7,reb:5,ast:0,stl:0,blk:0,fgm:3,fga:5,tpm:1,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Jarrett Allen",min:27,pts:3,reb:15,ast:0,stl:1,blk:2,fgm:1,fga:5,tpm:0,tpa:0,ftm:1,fta:4,to:0,orb:6},
      {name:"Evan Mobley",min:32,pts:8,reb:9,ast:3,stl:1,blk:1,fgm:4,fga:11,tpm:0,tpa:3,ftm:0,fta:0,to:1,orb:4},
      {name:"James Harden",min:37,pts:19,reb:2,ast:8,stl:1,blk:0,fgm:6,fga:14,tpm:2,tpa:6,ftm:5,fta:6,to:7,orb:0},
      {name:"Donovan Mitchell",min:37,pts:20,reb:6,ast:3,stl:1,blk:0,fgm:6,fga:24,tpm:4,tpa:12,ftm:4,fta:4,to:4,orb:0},
      {name:"Dennis Schroder",min:13,pts:8,reb:5,ast:0,stl:1,blk:1,fgm:4,fga:7,tpm:0,tpa:2,ftm:0,fta:0,to:2,orb:0},
      {name:"Max Strus",min:21,pts:1,reb:7,ast:0,stl:0,blk:0,fgm:0,fga:5,tpm:0,tpa:5,ftm:1,fta:2,to:1,orb:3},
      {name:"Sam Merrill",min:19,pts:14,reb:0,ast:0,stl:0,blk:0,fgm:5,fga:9,tpm:3,tpa:7,ftm:1,fta:1,to:0,orb:0},
      {name:"Jaylon Tyson",min:21,pts:9,reb:5,ast:0,stl:0,blk:0,fgm:3,fga:6,tpm:0,tpa:1,ftm:3,fta:6,to:2,orb:2},
      {name:"Keon Ellis",min:14,pts:0,reb:2,ast:0,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:1}
    ],
    away: [
      {name:"Brandon Ingram",min:36,pts:23,reb:6,ast:0,stl:0,blk:2,fgm:6,fga:23,tpm:3,tpa:7,ftm:8,fta:9,to:1,orb:2},
      {name:"RJ Barrett",min:39,pts:18,reb:8,ast:1,stl:2,blk:1,fgm:8,fga:22,tpm:1,tpa:6,ftm:1,fta:4,to:4,orb:3},
      {name:"Scottie Barnes",min:42,pts:23,reb:9,ast:6,stl:1,blk:3,fgm:6,fga:15,tpm:0,tpa:2,ftm:11,fta:14,to:4,orb:4},
      {name:"Jakob Poeltl",min:21,pts:10,reb:6,ast:1,stl:1,blk:1,fgm:4,fga:7,tpm:0,tpa:0,ftm:2,fta:2,to:0,orb:3},
      {name:"Ja'Kobe Walter",min:27,pts:0,reb:7,ast:3,stl:3,blk:0,fgm:0,fga:9,tpm:0,tpa:8,ftm:0,fta:0,to:0,orb:1},
      {name:"Sandro Mamukelashvili",min:13,pts:2,reb:8,ast:1,stl:2,blk:1,fgm:1,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:3},
      {name:"Collin Murray-Boyles",min:27,pts:15,reb:10,ast:3,stl:2,blk:0,fgm:5,fga:11,tpm:0,tpa:0,ftm:5,fta:7,to:2,orb:5},
      {name:"Jamal Shead",min:26,pts:2,reb:4,ast:4,stl:0,blk:0,fgm:1,fga:6,tpm:0,tpa:5,ftm:0,fta:0,to:0,orb:0}
    ]
  },
  "SAS-POR": {
    homeTeam: "SAS",
    awayTeam: "POR",
    home: [
      {name:"Julian Champagnie",min:29,pts:8,reb:3,ast:0,stl:1,blk:0,fgm:3,fga:6,tpm:2,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Victor Wembanyama",min:34,pts:27,reb:12,ast:3,stl:4,blk:7,fgm:9,fga:17,tpm:1,tpa:4,ftm:8,fta:8,to:4,orb:1},
      {name:"De'Aaron Fox",min:39,pts:28,reb:6,ast:7,stl:1,blk:2,fgm:11,fga:17,tpm:4,tpa:8,ftm:2,fta:4,to:3,orb:1},
      {name:"Devin Vassell",min:35,pts:11,reb:6,ast:3,stl:2,blk:1,fgm:5,fga:9,tpm:1,tpa:3,ftm:0,fta:0,to:2,orb:1},
      {name:"Stephon Castle",min:26,pts:16,reb:8,ast:1,stl:0,blk:0,fgm:6,fga:14,tpm:3,tpa:6,ftm:1,fta:1,to:1,orb:1},
      {name:"Harrison Barnes",min:11,pts:2,reb:1,ast:0,stl:0,blk:0,fgm:1,fga:2,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Keldon Johnson",min:17,pts:9,reb:2,ast:1,stl:1,blk:1,fgm:3,fga:5,tpm:1,tpa:2,ftm:2,fta:2,to:0,orb:0},
      {name:"Carter Bryant",min:6,pts:6,reb:0,ast:1,stl:0,blk:0,fgm:2,fga:3,tpm:2,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Dylan Harper",min:2,pts:2,reb:0,ast:0,stl:0,blk:0,fgm:1,fga:1,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:0},
      {name:"Kelly Olynyk",min:25,pts:3,reb:7,ast:1,stl:0,blk:0,fgm:1,fga:6,tpm:0,tpa:2,ftm:1,fta:2,to:0,orb:0}
    ],
    away: [
      {name:"Toumani Camara",min:31,pts:8,reb:5,ast:1,stl:1,blk:1,fgm:3,fga:8,tpm:2,tpa:6,ftm:0,fta:0,to:2,orb:2},
      {name:"Deni Avdija",min:37,pts:26,reb:7,ast:3,stl:0,blk:0,fgm:8,fga:14,tpm:2,tpa:3,ftm:8,fta:9,to:5,orb:0},
      {name:"Donovan Clingan",min:14,pts:5,reb:6,ast:0,stl:0,blk:1,fgm:2,fga:10,tpm:1,tpa:6,ftm:0,fta:0,to:1,orb:2},
      {name:"Jrue Holiday",min:37,pts:20,reb:6,ast:4,stl:1,blk:0,fgm:6,fga:13,tpm:3,tpa:6,ftm:5,fta:6,to:6,orb:0},
      {name:"Scoot Henderson",min:27,pts:0,reb:0,ast:2,stl:1,blk:0,fgm:0,fga:7,tpm:0,tpa:3,ftm:0,fta:0,to:0,orb:0},
      {name:"Jerami Grant",min:33,pts:17,reb:5,ast:1,stl:0,blk:1,fgm:6,fga:12,tpm:1,tpa:3,ftm:4,fta:4,to:0,orb:1},
      {name:"Kris Murray",min:13,pts:4,reb:0,ast:0,stl:0,blk:0,fgm:2,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0},
      {name:"Robert Williams III",min:26,pts:4,reb:6,ast:2,stl:0,blk:0,fgm:2,fga:4,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:1},
      {name:"Shaedon Sharpe",min:13,pts:8,reb:3,ast:0,stl:0,blk:0,fgm:3,fga:6,tpm:1,tpa:2,ftm:1,fta:2,to:0,orb:0},
      {name:"Matisse Thybulle",min:4,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:3,tpm:0,tpa:1,ftm:0,fta:0,to:0,orb:0}
    ]
  },
  "BOS-PHI": {
    homeTeam: "BOS",
    awayTeam: "PHI",
    home: [
      {name:"Jayson Tatum",min:35,pts:30,reb:7,ast:11,stl:0,blk:0,fgm:8,fga:16,tpm:5,tpa:10,ftm:9,fta:9,to:5,orb:0},
      {name:"Sam Hauser",min:22,pts:6,reb:4,ast:1,stl:0,blk:0,fgm:2,fga:8,tpm:2,tpa:6,ftm:0,fta:0,to:0,orb:0},
      {name:"Neemias Queta",min:17,pts:9,reb:8,ast:1,stl:0,blk:1,fgm:3,fga:3,tpm:0,tpa:0,ftm:3,fta:4,to:0,orb:2},
      {name:"Derrick White",min:33,pts:6,reb:6,ast:3,stl:2,blk:1,fgm:2,fga:5,tpm:2,tpa:4,ftm:0,fta:0,to:2,orb:1},
      {name:"Jaylen Brown",min:31,pts:20,reb:7,ast:1,stl:1,blk:1,fgm:6,fga:15,tpm:3,tpa:7,ftm:5,fta:9,to:3,orb:0},
      {name:"Payton Pritchard",min:35,pts:32,reb:4,ast:5,stl:1,blk:0,fgm:12,fga:21,tpm:6,tpa:12,ftm:2,fta:2,to:0,orb:1},
      {name:"Ron Harper Jr.",min:14,pts:6,reb:5,ast:0,stl:0,blk:0,fgm:2,fga:5,tpm:2,tpa:5,ftm:0,fta:0,to:0,orb:2},
      {name:"Nikola Vucevic",min:19,pts:4,reb:5,ast:2,stl:0,blk:0,fgm:2,fga:6,tpm:0,tpa:2,ftm:0,fta:0,to:1,orb:2},
      {name:"Jordan Walsh",min:12,pts:3,reb:0,ast:1,stl:0,blk:0,fgm:1,fga:4,tpm:1,tpa:4,ftm:0,fta:0,to:0,orb:0},
      {name:"Luka Garza",min:11,pts:6,reb:3,ast:2,stl:0,blk:0,fgm:2,fga:2,tpm:1,tpa:1,ftm:1,fta:2,to:0,orb:0}
    ],
    away: [
      {name:"Paul George",min:31,pts:16,reb:4,ast:1,stl:3,blk:1,fgm:6,fga:13,tpm:3,tpa:3,ftm:1,fta:1,to:1,orb:3},
      {name:"Joel Embiid",min:34,pts:26,reb:10,ast:6,stl:1,blk:1,fgm:9,fga:21,tpm:1,tpa:6,ftm:7,fta:9,to:3,orb:2},
      {name:"Kelly Oubre Jr.",min:31,pts:2,reb:4,ast:1,stl:0,blk:1,fgm:0,fga:6,tpm:0,tpa:2,ftm:2,fta:2,to:0,orb:0},
      {name:"Tyrese Maxey",min:40,pts:22,reb:4,ast:2,stl:1,blk:0,fgm:7,fga:14,tpm:4,tpa:7,ftm:4,fta:4,to:6,orb:1},
      {name:"VJ Edgecombe",min:36,pts:6,reb:4,ast:1,stl:1,blk:0,fgm:2,fga:9,tpm:0,tpa:4,ftm:2,fta:2,to:1,orb:2},
      {name:"Andre Drummond",min:5,pts:2,reb:2,ast:0,stl:0,blk:0,fgm:0,fga:1,tpm:0,tpa:0,ftm:2,fta:2,to:0,orb:1},
      {name:"Quentin Grimes",min:24,pts:12,reb:2,ast:2,stl:0,blk:0,fgm:5,fga:7,tpm:1,tpa:3,ftm:1,fta:2,to:0,orb:0}
    ]
  },
  "HOU-LAL": {
    homeTeam: "HOU",
    awayTeam: "LAL",
    home: [
      {name:"Amen Thompson",min:35,pts:18,reb:8,ast:5,stl:2,blk:1,fgm:7,fga:14,tpm:1,tpa:3,ftm:3,fta:5,to:2,orb:2},
      {name:"Jabari Smith Jr.",min:32,pts:15,reb:7,ast:2,stl:1,blk:1,fgm:5,fga:12,tpm:3,tpa:7,ftm:2,fta:2,to:1,orb:1},
      {name:"Alperen Sengun",min:34,pts:22,reb:11,ast:5,stl:1,blk:2,fgm:8,fga:15,tpm:1,tpa:2,ftm:5,fta:7,to:3,orb:3},
      {name:"Reed Sheppard",min:30,pts:14,reb:3,ast:4,stl:2,blk:0,fgm:5,fga:11,tpm:3,tpa:6,ftm:1,fta:2,to:2,orb:0},
      {name:"Tari Eason",min:28,pts:20,reb:8,ast:1,stl:5,blk:0,fgm:8,fga:14,tpm:2,tpa:5,ftm:2,fta:3,to:1,orb:2},
      {name:"Kevin Durant",min:26,pts:16,reb:4,ast:3,stl:0,blk:1,fgm:6,fga:13,tpm:2,tpa:5,ftm:2,fta:2,to:4,orb:0},
      {name:"Clint Capela",min:12,pts:6,reb:5,ast:0,stl:0,blk:1,fgm:3,fga:4,tpm:0,tpa:0,ftm:0,fta:0,to:0,orb:2}
    ],
    away: [
      {name:"LeBron James",min:36,pts:18,reb:6,ast:7,stl:1,blk:0,fgm:7,fga:18,tpm:2,tpa:7,ftm:2,fta:4,to:4,orb:0},
      {name:"Marcus Smart",min:34,pts:14,reb:3,ast:5,stl:2,blk:0,fgm:5,fga:14,tpm:3,tpa:8,ftm:1,fta:2,to:3,orb:0},
      {name:"Luke Kennard",min:32,pts:12,reb:2,ast:2,stl:0,blk:0,fgm:4,fga:12,tpm:2,tpa:7,ftm:2,fta:2,to:1,orb:0},
      {name:"Deandre Ayton",min:33,pts:19,reb:10,ast:1,stl:0,blk:1,fgm:8,fga:14,tpm:0,tpa:0,ftm:3,fta:4,to:2,orb:4},
      {name:"Rui Hachimura",min:30,pts:14,reb:5,ast:1,stl:1,blk:0,fgm:5,fga:11,tpm:2,tpa:4,ftm:2,fta:2,to:1,orb:1},
      {name:"Jarred Vanderbilt",min:22,pts:8,reb:7,ast:1,stl:1,blk:1,fgm:3,fga:6,tpm:1,tpa:2,ftm:1,fta:2,to:0,orb:2},
      {name:"Jaxson Hayes",min:13,pts:6,reb:3,ast:0,stl:0,blk:1,fgm:3,fga:4,tpm:0,tpa:0,ftm:0,fta:1,to:1,orb:1}
    ]
  }
};

// Attach box scores to SERIES_DATA games[0], games[1], games[2], and games[3]
(function attachBoxScores() {
  if (typeof SERIES_DATA === 'undefined') return;
  SERIES_DATA.forEach(s => {
    const bs1 = G1_BOX_SCORES[s.id];
    if (bs1 && s.games[0]) {
      s.games[0].boxScores = bs1;
    }
    const bs2 = G2_BOX_SCORES && G2_BOX_SCORES[s.id];
    if (bs2 && s.games[1]) {
      s.games[1].boxScores = bs2;
    }
    const bs3 = G3_BOX_SCORES && G3_BOX_SCORES[s.id];
    if (bs3 && s.games[2]) {
      s.games[2].boxScores = bs3;
    }
    const bs4 = G4_BOX_SCORES && G4_BOX_SCORES[s.id];
    if (bs4 && s.games[3]) {
      s.games[3].boxScores = bs4;
    }
  });
})();
