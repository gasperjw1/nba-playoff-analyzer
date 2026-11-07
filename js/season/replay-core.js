// ============================================================
// SEASON REPLAY — point-in-time logic (no IO)
// ============================================================
// replay-season.js walks the season forward one day at a time and
// predicts each day from what was knowable before tip-off: last
// season's ratings, this season's games before the day, the roster as
// of that morning and the official injury report published before the
// game. Everything here takes data that the caller has already cut to
// that point in time and refuses anything that is not.
//
// Uses (globals): buildEspnTeams, deriveLeagueAverages, NBAI_STAT_KEYS
// (adapters.js); projectSeasonGame, winProbToMargin (engine.js).
// ============================================================

// Official report status → share of tonight the player is expected to play
// (the same scenario weights NB.AI and the ESPN fallback use).
const REPLAY_AVAILABILITY = { Out: 0, Doubtful: 0.1, Questionable: 0.5, Probable: 0.9, Available: 1 };

// Team names as the official report writes them → ESPN abbreviation.
const REPLAY_TEAM_BY_NAME = {
  'Atlanta Hawks': 'ATL', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN', 'Charlotte Hornets': 'CHA',
  'Chicago Bulls': 'CHI', 'Cleveland Cavaliers': 'CLE', 'Dallas Mavericks': 'DAL', 'Denver Nuggets': 'DEN',
  'Detroit Pistons': 'DET', 'Golden State Warriors': 'GS', 'Houston Rockets': 'HOU', 'Indiana Pacers': 'IND',
  'LA Clippers': 'LAC', 'Los Angeles Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'Memphis Grizzlies': 'MEM',
  'Miami Heat': 'MIA', 'Milwaukee Bucks': 'MIL', 'Minnesota Timberwolves': 'MIN', 'New Orleans Pelicans': 'NO',
  'New York Knicks': 'NY', 'Oklahoma City Thunder': 'OKC', 'Orlando Magic': 'ORL', 'Philadelphia 76ers': 'PHI',
  'Phoenix Suns': 'PHX', 'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC', 'San Antonio Spurs': 'SA',
  'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTAH', 'Washington Wizards': 'WSH',
};

// "Jaren Jackson Jr." / "Jackson Jr., Jaren" / "Nikola Jokić" → "jaren jackson" / "nikola jokic".
function replayNormName(name) {
  let s = String(name || '').trim();
  const parts = s.split(',').map(x => x.trim()).filter(Boolean);
  if (parts.length > 1) s = parts[parts.length - 1] + ' ' + parts.slice(0, -1).join(' ');   // "Last[, Jr.], First" → "First Last Jr."
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[.'’`]/g, '').replace(/-/g, ' ')
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '').replace(/\s+/g, ' ').trim();
}

// Roster as of a cutoff. events: [{ at, kind, team, id, name }], `at` a sortable key (replay-season.js
// uses "<ET date>|0..2" so captures and dated moves on one day order correctly); only events strictly
// before `cutoff` count, in key order (ties in the order given):
//   seed        last season's team (start of the offseason)
//   join        signed / claimed by the team
//   leave       waived / released by the team (no-op if he is elsewhere by then)
//   retire      off every roster
//   snapshot    a published full roster { ids: {id: name} }: exactly these players, at that time
//   appear      dressed for the team in a regular-season game (for a team that waived him: only
//               if he played, and has not joined another). Report listings move a player for that
//               day only (replay-season.js), not as lasting events.
//   appear-pre  dressed for the team in a preseason game — moves a traded player, but cannot
//               undo that team's own waiver (camp cuts still show up in late preseason boxes)
// Returns { ABBR: Map(id → name) }.
function replayRosterAsOf(events, cutoff) {
  const state = new Map();   // id → { team, name, left: Set }
  const sorted = events.map((e, i) => [e, i]).filter(([e]) => e.at < cutoff)
    .sort(([a, i], [b, j]) => (a.at < b.at ? -1 : a.at > b.at ? 1 : i - j)).map(([e]) => e);
  for (const e of sorted) {
    const s = state.get(e.id) || { team: null, name: e.name, left: new Set() };
    s.name = e.name || s.name;
    if (e.kind === 'snapshot') {             // a published full roster: exactly these players, at this time
      for (const [id, o] of state) if (o.team === e.team && !(id in e.ids)) o.team = null;
      for (const [id, name] of Object.entries(e.ids)) {
        const o = state.get(id) || { team: null, name, left: new Set() };
        o.team = e.team; o.name = o.name || name; o.left.delete(e.team); state.set(id, o);
      }
      continue;
    }
    if (e.kind === 'retire') s.team = null;
    else if (e.kind === 'leave') { if (s.team === e.team) s.team = null; s.left.add(e.team); }
    else if (e.kind === 'appear-pre') { if (!s.left.has(e.team)) s.team = e.team; }
    // A box score for a team that waived him re-adds him only if he actually played (re-signed)
    // and has not joined anyone since: ESPN keeps listing some cut players as did-not-play.
    else if (e.kind === 'appear' && s.left.has(e.team) && (e.dnp || (s.team && s.team !== e.team))) { /* stale listing */ }
    else { s.team = e.team; s.left.delete(e.team); }
    state.set(e.id, s);
  }
  const out = {};
  for (const [id, s] of state) if (s.team) (out[s.team] = out[s.team] || new Map()).set(id, s.name);
  return out;
}

// replay-8: what a team that has not filed for the day yet ("NOT YET SUBMITTED" — typically the
// second night of a back-to-back, until after the first night's game) last filed: its entries for
// its previous game day `prevDay`, from the newest of `reports` that covers it. A report covers a
// team's day if it has entries for it, or lists the day's games without the team among the
// unfiled (filed with nobody to list → no entries, all healthy). Each report must already be
// published before the game's cutoff (the caller filters). Returns { entries, from } or null.
function replayCarriedEntries(reports, ab, prevDay) {
  if (!prevDay) return null;
  const day = `${prevDay.slice(5, 7)}/${prevDay.slice(8, 10)}/${prevDay.slice(0, 4)}`;
  for (const r of reports.filter(Boolean).sort((a, b) => b.at - a.at)) {
    if ((r.notSubmitted || []).some(x => x.gameDate === day && REPLAY_TEAM_BY_NAME[x.team] === ab)) continue;
    const entries = r.entries.filter(e => e.gameDate === day && REPLAY_TEAM_BY_NAME[e.team] === ab);
    const covers = entries.length || r.entries.some(e => e.gameDate === day) || (r.notSubmitted || []).some(x => x.gameDate === day);
    if (covers) return { entries, from: r.name };
  }
  return null;
}

// Match one team's report entries to player ids. teamRoster: Map(id → name) for that team;
// league: Map(normalized name → [ids]) of every player we know. Returns
// { availability: {id: 0..1}, notes: {id: 'Status — reason'}, unmatched: [entry] }.
function replayMatchReport(entries, teamRoster, league) {
  const onTeam = new Map();
  for (const [id, name] of teamRoster || []) {
    const k = replayNormName(name);
    onTeam.set(k, (onTeam.get(k) || []).concat(id));
  }
  const availability = {}, notes = {}, unmatched = [];
  for (const e of entries) {
    // Some names are written family-name first by one source and not the other ("Yang Hansen").
    const k = replayNormName(e.player), rev = k.split(' ').reverse().join(' ');
    let ids = onTeam.get(k) || onTeam.get(rev) || [k, rev].map(x => league.get(x) || []).find(x => x.length === 1) || null;
    // replay-8: a shortened first name ("Christopher" in the report, "Chris" at ESPN) — same family
    // name and first initial, on this team's roster, and only one such player.
    if (!ids) {
      const fam = k.split(' ').pop(), ini = k[0];
      const hits = [...onTeam.entries()].filter(([n]) => n.split(' ').pop() === fam && n[0] === ini).flatMap(([, v]) => v);
      if (hits.length === 1) ids = hits;
    }
    if (!ids || ids.length !== 1 || !(e.status in REPLAY_AVAILABILITY)) { unmatched.push(e); continue; }
    availability[ids[0]] = REPLAY_AVAILABILITY[e.status];
    notes[ids[0]] = `${e.status}${e.reason ? ' — ' + e.reason : ''}`;
  }
  return { availability, notes, unmatched };
}

// Teams for day `date`. regGames must hold only regular-season games before `date`
// (asserted); rosters: { ABBR: Map(id → name) } as of that morning; availability/notes from
// the report. Players on the roster with no game yet get zero lines (the engine then uses
// their prior seasons); players not on the roster are dropped.
function replayBuildTeams(priorTeams, date, regGames, rosters, availability, notes) {
  const late = regGames.filter(g => g.date >= date);
  if (late.length) throw new Error(`replayBuildTeams(${date}): ${late.length} game(s) on or after the day were passed in`);
  const teams = buildEspnTeams(priorTeams, date, regGames);
  for (const [abbr, team] of Object.entries(teams)) {
    const roster = rosters[abbr] || new Map();
    const have = new Map(team.players.map(p => [p.id, p]));
    team.players = [...roster.entries()].map(([id, name]) => {
      const base = have.get(id) || (() => {
        const avg = {};
        NBAI_STAT_KEYS.forEach(k => { avg[k] = 0; });
        return { id, name, pos: '', status: 'Available', injury: null, availability: 1, projMin: 0, starter: false,
          depthRank: 99, avg, seasonGames: 0, games: 0, h2h: null, recent: null };
      })();
      const a = availability && id in availability ? availability[id] : 1;
      return { ...base, name: base.name || name, availability: a, status: a === 0 ? 'Out' : a < 1 ? 'Questionable' : 'Available',
        injury: notes && notes[id] ? notes[id] : null };
    });
  }
  return teams;
}

// Preseason: shift each team's prior net rating by coef × (preseason margin per game) after
// retention, half to offense and half to defense, so it fades with the prior as this season's
// games take over. preseason: { ABBR: { n, diff } } over NBA-vs-NBA preseason games.
function replayPreseasonShift(teams, preseason, coef) {
  const out = {};
  for (const [abbr, t] of Object.entries(teams)) {
    const p = preseason[abbr];
    const shift = p && p.n ? coef * (p.diff / p.n) / SEASON_PRIOR_RETENTION / 2 : 0;
    out[abbr] = { ...t, prior: { ...t.prior, ortg: t.prior.ortg + shift, drtg: t.prior.drtg - shift }, preseasonShift: 2 * shift * SEASON_PRIOR_RETENTION };
  }
  return out;
}

// One day's predictions. day = { date, games: [{ id, tip, home, away }], teams, league } with
// teams already built as of that morning. Returns one row per game; no results, no market.
function replayPredictDay(day) {
  const slate = { source: 'replay', date: day.date, league: day.league, teams: day.teams, games: day.games };
  return day.games.map(g => {
    const p = projectSeasonGame(g, slate);
    return { id: String(g.id), date: day.date, tip: g.tip, home: g.home, away: g.away,
      pHome: p.pHome, margin: p.margin, total: p.total, comps: seasonEdgeComponents(p) };
  });
}
