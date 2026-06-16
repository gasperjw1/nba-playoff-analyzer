// ============================================================
// MLB CONSTANTS — baseball namespace (scaffold)
// ============================================================
// All baseball globals are prefixed MLB_ so they never collide with the
// NBA globals (CURRENT_DATE, SERIES_DATA, BETS, …). This file is additive:
// it does not touch any NBA data or behavior.
//
// This is SCAFFOLD data. The real schedule/odds/park-factor ingestion and
// the projection model are future work — see the plan + mlb-projection.js.
// ============================================================

// The "now" the baseball section represents (mirrors NBA CURRENT_DATE).
const MLB_CURRENT_DATE = '2026-06-16';

// Minimal team reference (abbr -> meta). Stub — fill out to 30 teams later.
const MLB_TEAMS = {
  NYY: { name: 'Yankees',   city: 'New York',     league: 'AL', division: 'AL East' },
  BOS: { name: 'Red Sox',   city: 'Boston',       league: 'AL', division: 'AL East' },
  LAD: { name: 'Dodgers',   city: 'Los Angeles',  league: 'NL', division: 'NL West' },
  SF:  { name: 'Giants',    city: 'San Francisco', league: 'NL', division: 'NL West' },
};

// Park factors drive totals/run environment (run factor: 1.0 = neutral).
// Stub values — replace with real multi-year park factors later.
const MLB_PARKS = {
  fenway:        { name: 'Fenway Park',        team: 'BOS', runFactor: 1.08 },
  oraclepark:    { name: 'Oracle Park',        team: 'SF',  runFactor: 0.90 },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MLB_CURRENT_DATE, MLB_TEAMS, MLB_PARKS };
}
