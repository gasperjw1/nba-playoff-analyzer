// ============================================================
// MLB SCHEDULE — the baseball data model (scaffold)
// ============================================================
// Baseball is GAME-CENTRIC, not series-centric: a daily schedule of
// independent games. Each game is the atomic prediction unit, and the
// starting-pitcher matchup is the dominant variable. This replaces the
// NBA SERIES_DATA (best-of-7 series) shape entirely.
//
// GAME OBJECT SCHEMA:
// {
//   id:        'NYY-BOS-2026-06-16',         // {away}-{home}-{date}
//   date:      'YYYY-MM-DD',
//   time:      '7:10 PM ET',
//   homeTeam:  'BOS', awayTeam: 'NYY',        // keys into MLB_TEAMS
//   park:      'fenway',                       // key into MLB_PARKS
//   weather:   { tempF, windMph, windDir } | null,
//   homePitcher: { name, throws:'L'|'R', era, fip, k9, bb9 },
//   awayPitcher: { name, throws:'L'|'R', era, fip, k9, bb9 },
//   lineups:   { home: [], away: [] },         // optional; empty in scaffold
//   markets: {                                 // sportsbook lines (American odds)
//     ml:      { home, away },                 // moneyline (the primary MLB market)
//     runLine: { home:{ line:-1.5, odds }, away:{ line:+1.5, odds } },  // baseball "spread"
//     total:   { line, over, under },          // total runs O/U (park+weather driven)
//     f5:      { ml:{ home, away }, total:{ line, over, under } } | null, // first-5-innings
//     kProps:  [ { pitcher, line, over, under } ]   // pitcher strikeout props
//   },
//   prediction: {},     // populated by the FUTURE mlb-projection engine (projectGame)
//   result: null        // { homeScore, awayScore, winner } once the game is final
// }
//
// SCAFFOLD: two placeholder games conforming to the schema above. Numbers
// are illustrative, not researched — the real ingestion is future work.
// ============================================================

const MLB_SCHEDULE = [
  {
    id: 'NYY-BOS-2026-06-16',
    date: '2026-06-16',
    time: '7:10 PM ET',
    homeTeam: 'BOS', awayTeam: 'NYY',
    park: 'fenway',
    weather: { tempF: 72, windMph: 8, windDir: 'out-to-RF' },
    homePitcher: { name: 'Brayan Bello',  throws: 'R', era: 3.85, fip: 3.90, k9: 8.1, bb9: 2.6 },
    awayPitcher: { name: 'Gerrit Cole',   throws: 'R', era: 3.10, fip: 3.05, k9: 10.4, bb9: 2.1 },
    lineups: { home: [], away: [] },
    markets: {
      ml:      { home: +120, away: -135 },
      runLine: { home: { line: +1.5, odds: -160 }, away: { line: -1.5, odds: +140 } },
      total:   { line: 8.5, over: -110, under: -110 },
      f5:      { ml: { home: +115, away: -125 }, total: { line: 4.5, over: -115, under: -105 } },
      kProps:  [
        { pitcher: 'Gerrit Cole', line: 6.5, over: -115, under: -105 },
        { pitcher: 'Brayan Bello', line: 4.5, over: -120, under: +100 },
      ],
    },
    prediction: {},
    result: null,
  },
  {
    id: 'LAD-SF-2026-06-16',
    date: '2026-06-16',
    time: '9:45 PM ET',
    homeTeam: 'SF', awayTeam: 'LAD',
    park: 'oraclepark',
    weather: { tempF: 61, windMph: 14, windDir: 'in-from-CF' },
    homePitcher: { name: 'Logan Webb',     throws: 'R', era: 3.25, fip: 3.30, k9: 8.8, bb9: 1.9 },
    awayPitcher: { name: 'Yoshinobu Yamamoto', throws: 'R', era: 2.95, fip: 3.10, k9: 9.6, bb9: 2.3 },
    lineups: { home: [], away: [] },
    markets: {
      ml:      { home: +105, away: -118 },
      runLine: { home: { line: +1.5, odds: -175 }, away: { line: -1.5, odds: +150 } },
      total:   { line: 7.0, over: -105, under: -115 },
      f5:      { ml: { home: +100, away: -110 }, total: { line: 3.5, over: -120, under: +100 } },
      kProps:  [
        { pitcher: 'Yoshinobu Yamamoto', line: 6.5, over: -110, under: -110 },
        { pitcher: 'Logan Webb', line: 5.5, over: -125, under: +105 },
      ],
    },
    prediction: {},
    result: null,
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MLB_SCHEDULE };
}
