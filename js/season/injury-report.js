// ============================================================
// OFFICIAL INJURY REPORT over a slate — fetch-slate.js --injuries
// ============================================================
// NB.AI is refreshed by hand, so its player statuses can lag the league's
// half-hourly injury report by hours. This lays the latest official report
// (parse-injury-report.py entries) over a slate's statuses, matched with the
// replay's name rules (replay-core.js). A team changes only if the report
// lists it for the slate date: listed players take the report's status;
// players the feed has as not fully available but the report omits become
// Available. The ledger is untouched: a recorded row stays as recorded.
//
// Uses (globals): REPLAY_TEAM_BY_NAME, REPLAY_AVAILABILITY, replayMatchReport (replay-core.js).
// ============================================================

// report: { name, at, entries }. Returns { slate, changes: [{ team, name, from, to }], unmatched: [entry] }.
function seasonApplyInjuryReport(slate, report) {
  const day = `${slate.date.slice(5, 7)}/${slate.date.slice(8, 10)}/${slate.date.slice(0, 4)}`;
  const tonight = new Set(slate.games.flatMap(g => [g.home, g.away]));
  const teams = {}, changes = [], unmatched = [];
  for (const [abbr, t] of Object.entries(slate.teams)) {
    const entries = report.entries.filter(e => e.gameDate === day && REPLAY_TEAM_BY_NAME[e.team] === abbr);
    if (!tonight.has(abbr) || !entries.length) { teams[abbr] = t; continue; }
    const m = replayMatchReport(entries, new Map(t.players.map(p => [p.id, p.name])), new Map());
    unmatched.push(...m.unmatched);
    teams[abbr] = { ...t, players: t.players.map(p => {
      const listed = p.id in m.availability;
      if (!listed && p.availability >= 1) return p;
      const [status, ...why] = listed ? m.notes[p.id].split(' — ') : ['Available'];
      const q = { ...p, status, availability: listed ? m.availability[p.id] : 1, injury: listed ? why.join(' — ') || null : null };
      if (q.status !== p.status || q.availability !== p.availability) changes.push({ team: abbr, name: p.name, from: p.status, to: q.status });
      return q;
    }) };
  }
  return { slate: { ...slate, teams, injuryReport: { name: report.name, at: new Date(report.at).toISOString(), changes: changes.length } }, changes, unmatched };
}
