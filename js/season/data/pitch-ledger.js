// ============================================================
// PITCH LEDGER — pitched tickets (2026-27), js/season/pitch.js, spec in PITCH_SPEC.md
// ============================================================
// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit:
// a pitch is only evidence if recorded before its legs tip off.
// ============================================================
const SEASON_PITCH_LEDGER = [
{"id":"2026-11-08","date":"2026-11-08","spec":"pitch-1","engine":"2026-11-07.rotcap","props":"2026-11-07.sdscale","source":"nb.ai","recordedAt":"2026-11-08T20:14:38.270Z","tickets":[{"recipe":"floor","status":"pitched","legs":[{"type":"prop","game":"401909947","matchup":"UTAH @ MIN","tip":"2026-11-09T00:00Z","team":"MIN","opp":"UTAH","player":"4431671","name":"Jaden McDaniels","stat":"pra","dir":"over","line":13.5,"mean":26.6,"sd":9.67,"min":37.4,"rank":1,"p":0.9122},{"type":"prop","game":"401909946","matchup":"LAL @ DET","tip":"2026-11-08T23:00Z","team":"LAL","opp":"DET","player":"4066457","name":"Austin Reaves","stat":"pra","dir":"over","line":17.5,"mean":31.7,"sd":10.78,"min":37,"rank":1,"p":0.9061},{"type":"prop","game":"401909950","matchup":"NO @ LAC","tip":"2026-11-09T02:00Z","team":"LAC","opp":"NO","player":"4396907","name":"Darius Garland","stat":"pra","dir":"over","line":19.5,"mean":34.9,"sd":11.57,"min":36.6,"rank":1,"p":0.9084}],"p":0.7508,"fairAmerican":-301,"price":null,"quote":null,"result":null},{"recipe":"edge","status":"no ticket","reason":"0 games with an 8+ pp edge (needs 2)","legs":[]}]}
];
