// ============================================================
// SEASON USER LEGS — every moneyline the user placed, at their own price (2026-27)
// ============================================================
// One row per leg the user bet (FanDuel), at the price they took, as they
// reported it in chat; a team on two tickets the same night is one leg.
// Graded at runtime from season-ledger.js by gameId (js/season/flat.js) and
// tracked as flat straight bets under spec flat-1 (FLAT_SPEC.md). Tickets,
// with DraftKings prices and the models' chances, stay in user-bets.js.
// Hand-maintained: add a row per leg the user reports, never a result.
// ============================================================
const SEASON_USER_LEGS = [
 {"date":"2026-11-04","gameId":"401909922","team":"PHI","opponent":"DET","side":"away","odds":118,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909923","team":"WSH","opponent":"ATL","side":"home","odds":132,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909925","team":"BKN","opponent":"CHA","side":"home","odds":142,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909926","team":"NY","opponent":"CHI","side":"home","odds":-438,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909924","team":"BOS","opponent":"MIL","side":"home","odds":-384,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909927","team":"MEM","opponent":"IND","side":"home","odds":-198,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909928","team":"NO","opponent":"UTAH","side":"home","odds":-174,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909930","team":"HOU","opponent":"MIN","side":"home","odds":-228,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909933","team":"SA","opponent":"DAL","side":"home","odds":-438,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909934","team":"LAL","opponent":"SAC","side":"away","odds":-455,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909932","team":"POR","opponent":"PHX","side":"away","odds":-142,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909931","team":"DEN","opponent":"TOR","side":"home","odds":-190,"book":"FanDuel"},
 {"date":"2026-11-04","gameId":"401909935","team":"MIA","opponent":"LAC","side":"away","odds":-215,"book":"FanDuel"},
 {"date":"2026-11-05","gameId":"401909936","team":"PHX","opponent":"ORL","side":"home","odds":-108,"book":"FanDuel"},
 {"date":"2026-11-05","gameId":"401909937","team":"GS","opponent":"MIA","side":"home","odds":-270,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909291","team":"MEM","opponent":"OKC","side":"home","odds":182,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909293","team":"MIN","opponent":"NO","side":"away","odds":-122,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909294","team":"POR","opponent":"LAL","side":"away","odds":160,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909288","team":"BOS","opponent":"CHA","side":"away","odds":-400,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909287","team":"ATL","opponent":"WSH","side":"home","odds":-280,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909290","team":"DAL","opponent":"UTAH","side":"home","odds":-270,"book":"FanDuel"},
 {"date":"2026-11-06","gameId":"401909295","team":"SA","opponent":"SAC","side":"away","odds":-1400,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909940","team":"CLE","opponent":"NY","side":"home","odds":180,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909938","team":"DEN","opponent":"IND","side":"away","odds":-290,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909939","team":"ATL","opponent":"BKN","side":"home","odds":-260,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909944","team":"SA","opponent":"POR","side":"away","odds":-220,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909941","team":"OKC","opponent":"WSH","side":"home","odds":-520,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909942","team":"GS","opponent":"ORL","side":"home","odds":-220,"book":"FanDuel"},
 {"date":"2026-11-07","gameId":"401909943","team":"HOU","opponent":"PHX","side":"away","odds":-270,"book":"FanDuel"}
];
