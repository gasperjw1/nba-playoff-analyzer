// ============================================================
// b2b-shadow.js — team back-to-back splits at record time (spec b2b-1, B2B_SPEC.md)
// ============================================================
// For tonight's games: each team's back-to-back net rating minus its rested
// net rating (matchup-1 Q3b, research-matchup.js's profiles), from this
// season's ESPN box scores before tonight, and whether it played yesterday.
// fetch-slate.js --record turns them into the ledger's `b2b` entry with
// js/season/b2b.js. Read-only apart from the ESPN cache.
// ============================================================
const { seasonGames, profiles, situational } = require('./research-matchup.js');

const addDays = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);

// One team's split before `date` from a list of completed games: { b2b, split, nB2b, nRest, n }, or null
// without prior games. `prof` is profiles(games, date), shared across a night's teams.
function teamSplit(games, prof, date, team) {
  const T = prof.P[team];
  if (!T) return null;
  const s = situational(prof, team, { home: true, b2b: true, opp: team });
  const b2b = games.some(g => g.date === addDays(date, -1) && (g.home === team || g.away === team));
  return { b2b, split: +s.rest.toFixed(3), nB2b: s.b2bGames, nRest: T.n - s.b2bGames, n: T.n };
}

// Tonight's games [{ id, home, away }] on `date` → Map id → { home, away } splits.
async function b2bSplits(date, tonight) {
  const games = await seasonGames(addDays(date, -1));
  return splitsFromGames(games, date, tonight);
}

function splitsFromGames(games, date, tonight) {
  const prof = profiles(games, date);
  const out = new Map();
  for (const g of tonight) out.set(String(g.id), { home: teamSplit(games, prof, date, g.home), away: teamSplit(games, prof, date, g.away) });
  return out;
}

module.exports = { b2bSplits, splitsFromGames, teamSplit };
