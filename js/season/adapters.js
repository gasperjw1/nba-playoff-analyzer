// ============================================================
// FEED ADAPTERS — external data → normalized SeasonSlate
// ============================================================
// The engine never reads a vendor shape directly. Every source is
// normalized here into:
//
// SeasonSlate = { source, date, fetchedAt, modelVersion, league:{ortg,pace},
//                 teams:{ ABBR: SeasonTeam }, games:[SeasonGame] }
// SeasonTeam  = { abbr, name, city, logo,
//                 prior:{ortg,drtg,pace,games}, current:{ppg,papg,games},
//                 rest:{restDays,backToBack,threeInFour,schedulePoints},
//                 players:[SeasonPlayer] }
// SeasonPlayer= { id,name,pos,status,availability,projMin,starter,depthRank,
//                 avg:{min,pts,reb,ast,tpm,stl,blk,to,fgm,fga,ftm,fta,tpa} (this season),
//                 seasonGames, games (this + last season),
//                 h2h:{pts,reb,ast,n}|null, recent:{lastPts,lastMin}|null }
// SeasonGame  = { id, tip, venue, home, away,
//                 market:{mlHome,mlAway,spreadHome,total,book}|null,
//                 external:{ nbai:{pHome, projHome, projAway} }|null }
//
// Conventions: spreadHome is the HOME team's spread (+7.5 = home is
// a 7.5-pt underdog). Probabilities are always P(home wins).
// ============================================================

const NBAI_STAT_KEYS = ['min','pts','reb','ast','tpm','stl','blk','to','fgm','fga','ftm','fta','tpa'];

function _nbaiStatRow(arr) {
  const out = {};
  NBAI_STAT_KEYS.forEach((k, i) => { out[k] = (arr && typeof arr[i] === 'number') ? arr[i] : 0; });
  return out;
}

function _nbaiAvailability(p) {
  if (typeof p.availability === 'number') return Math.max(0, Math.min(1, p.availability));
  if (/out|suspen/i.test(p.status || '')) return 0;
  if (/doubtful/i.test(p.status || '')) return 0.1;
  if (/questionable/i.test(p.status || '')) return 0.5;
  if (/probable/i.test(p.status || '')) return 0.9;
  return 1;
}

function adaptNbaiPlayer(p) {
  const avg = _nbaiStatRow(p.seasonAverage);
  return {
    id: String(p.id),
    name: p.name,
    pos: p.pos || '',
    status: p.status || 'Available',
    injury: p.injury || null,
    availability: _nbaiAvailability(p),
    projMin: typeof p.projectedMinutes === 'number' ? p.projectedMinutes * (p.workloadMinutesMultiplier || 1) : 0,
    starter: !!p.expectedStarter,
    depthRank: p.depthRank || 99,
    avg,                                   // this season only, per game over seasonGames
    seasonGames: p.seasonGames || 0,
    games: (p.seasonGames || 0) + (p.priorGames || 0),
    h2h: p.h2h && typeof p.h2h.n === 'number' ? { pts: p.h2h.pts, reb: p.h2h.reb, ast: p.h2h.ast, n: p.h2h.n } : null,
    recent: p.recentForm ? { lastPts: p.recentForm.lastPoints, lastMin: p.lastMinutes } : null,
  };
}

function adaptNbaiTeam(t) {
  const f = t.factors || {};
  const pace = t.pace || SEASON_LEAGUE_FALLBACK.pace;
  return {
    abbr: t.abbreviation,
    name: t.name,
    city: t.location,
    logo: t.logo || null,
    prior: {
      ortg: typeof f.offRating === 'number' ? f.offRating : (t.ppg / pace) * 100,
      drtg: typeof f.defRating === 'number' ? f.defRating : (t.papg / pace) * 100,
      pace,
      games: t.games || 82,
    },
    current: {
      ppg: typeof f.recentPPG === 'number' ? f.recentPPG : null,
      papg: typeof f.recentPAPG === 'number' ? f.recentPAPG : null,
      games: f.recentGames || 0,
    },
    rest: {
      restDays: typeof f.restDays === 'number' ? f.restDays : 1,
      backToBack: !!f.backToBack,
      threeInFour: !!f.threeInFour,
      schedulePoints: f.schedulePoints || 0,
    },
    players: (t.players || []).map(adaptNbaiPlayer),
  };
}

// saved: the NB.AI `saved.json` document; rankings: the NB.AI
// `/api/rankings` document (optional — supplies the friend's model
// probabilities and the book lines).
function adaptNbaiSlate(saved, rankings) {
  const d = saved && saved.data ? saved.data : saved;
  if (!d || !d.games || !d.teams) throw new Error('NB.AI feed: missing games/teams');

  const teams = {};
  const idToAbbr = {};
  Object.keys(d.teams).forEach(id => {
    const team = adaptNbaiTeam(d.teams[id]);
    teams[team.abbr] = team;
    idToAbbr[id] = team.abbr;
  });

  // Friend's model output: rankings.markets entries of kind 'ml'.
  const friendByGame = {};
  const markets = rankings && Array.isArray(rankings.markets) ? rankings.markets : [];
  markets.forEach(m => {
    if (m.kind !== 'ml' || typeof m.p !== 'number') return;
    const slot = friendByGame[m.gameId] || (friendByGame[m.gameId] = {});
    slot[m.side] = m.p;
  });

  const games = d.games.map(g => {
    const home = idToAbbr[g.home], away = idToAbbr[g.away];
    const o = g.odds || null;
    const market = o && (typeof o.home === 'number' || typeof o.spread === 'number') ? {
      mlHome: typeof o.home === 'number' ? o.home : null,
      mlAway: typeof o.away === 'number' ? o.away : null,
      spreadHome: typeof o.spread === 'number' ? o.spread : null,
      total: typeof o.total === 'number' ? o.total : null,
      book: o.provider || null,
    } : null;
    const fr = friendByGame[g.id];
    let pHome = null;
    if (fr) {
      if (typeof fr.home === 'number') pHome = fr.home;
      else if (typeof fr.away === 'number') pHome = 1 - fr.away;
    }
    return {
      id: String(g.id),
      tip: g.date,
      venue: g.venue || null,
      home, away,
      market,
      external: pHome != null ? { nbai: { pHome } } : null,
    };
  }).filter(g => g.home && g.away);

  const league = deriveLeagueAverages(teams);
  return {
    source: 'nb.ai',
    date: d.date,
    fetchedAt: d.fetchedAt || saved.generatedAt || null,
    modelVersion: d.modelVersion != null ? String(d.modelVersion) : null,
    league,
    teams,
    games,
  };
}

// League averages from the feed when it covers enough teams, else fallback.
function deriveLeagueAverages(teams) {
  const list = Object.values(teams || {});
  if (list.length < SEASON_LEAGUE_MIN_TEAMS) return { ...SEASON_LEAGUE_FALLBACK, derived: false, teams: list.length };
  const ortg = list.reduce((s, t) => s + t.prior.ortg, 0) / list.length;
  const pace = list.reduce((s, t) => s + t.prior.pace, 0) / list.length;
  return { ortg, pace, derived: true, teams: list.length };
}

// ESPN scoreboard document → [{id, home, away, homeScore, awayScore, final}]
function adaptEspnScoreboard(doc) {
  const events = (doc && doc.events) || [];
  return events.map(e => {
    const c = e.competitions && e.competitions[0];
    if (!c) return null;
    const home = c.competitors.find(x => x.homeAway === 'home');
    const away = c.competitors.find(x => x.homeAway === 'away');
    const status = c.status && c.status.type ? c.status.type.name : null;
    const final = status === 'STATUS_FINAL';
    return {
      id: String(e.id),
      date: e.date,
      home: home && home.team.abbreviation,
      away: away && away.team.abbreviation,
      homeScore: home && home.score != null ? Number(home.score) : null,
      awayScore: away && away.score != null ? Number(away.score) : null,
      final,
      postponed: status === 'STATUS_POSTPONED' || status === 'STATUS_CANCELED',
    };
  }).filter(Boolean);
}

// ── ESPN ────────────────────────────────────────────────────
// ESPN documents → the same SeasonSlate. backtest-season.js replays past
// games with these; `fetch-slate.js --espn` builds tonight's slate when the
// NB.AI feed is stale. Team priors come from the last committed snapshot;
// this season's results and player lines from ESPN box scores; lines from
// ESPN pickcenter (DraftKings); availability from the injury report.
//
// EspnGame = { id, date (ET), home, away, homeScore, awayScore,
//              box:{ ABBR:[EspnBoxPlayer] }, market }
// EspnBoxPlayer = { id, name, starter, played, reason, line:{min,pts,...} }

function _espnMade(s) { const [m, a] = String(s || '0-0').split('-').map(Number); return [m || 0, a || 0]; }

// summary document → { ABBR: [EspnBoxPlayer] }
function adaptEspnBox(summary) {
  const out = {};
  for (const team of (summary && summary.boxscore && summary.boxscore.players) || []) {
    const st = team.statistics[0];
    const idx = {};
    st.names.forEach((n, i) => { idx[n] = i; });
    out[team.team.abbreviation] = st.athletes.map(a => {
      const s = a.stats || [];
      const min = parseFloat(s[idx.MIN]) || 0;
      const [fgm, fga] = _espnMade(s[idx.FG]), [tpm, tpa] = _espnMade(s[idx['3PT']]), [ftm, fta] = _espnMade(s[idx.FT]);
      return {
        id: String(a.athlete.id), name: a.athlete.displayName, starter: !!a.starter,
        played: !a.didNotPlay && min > 0, reason: a.reason || null,
        line: { min, pts: +s[idx.PTS] || 0, reb: +s[idx.REB] || 0, ast: +s[idx.AST] || 0, tpm, stl: +s[idx.STL] || 0,
          blk: +s[idx.BLK] || 0, to: +s[idx.TO] || 0, fgm, fga, ftm, fta, tpa },
      };
    });
  }
  return out;
}

// summary document → market (current line; after tip-off it is the close).
function adaptEspnPickcenter(summary, home, away) {
  const pc = ((summary && summary.pickcenter) || []).find(p => p.provider) || null;
  if (!pc) return null;
  const mlHome = pc.homeTeamOdds && pc.homeTeamOdds.moneyLine, mlAway = pc.awayTeamOdds && pc.awayTeamOdds.moneyLine;
  // Read the spread from "ABBR -x.5" so the sign cannot be misread.
  let spreadHome = null;
  const m = /^([A-Z]+)\s+([-+]?\d+(?:\.\d+)?)$/.exec((pc.details || '').trim());
  if (m) spreadHome = m[1] === home ? +m[2] : m[1] === away ? -m[2] : null;
  else if (/^EVEN|PK/i.test(pc.details || '')) spreadHome = 0;
  const num = (s) => { if (s == null) return null; const v = parseFloat(String(s).replace(/^[ou]/, '')); return isNaN(v) ? null : v; };
  const at = (o, ...keys) => keys.reduce((x, k) => (x && x[k] != null ? x[k] : null), o);
  const open = {
    mlHome: num(at(pc, 'moneyline', 'home', 'open', 'odds')),
    mlAway: num(at(pc, 'moneyline', 'away', 'open', 'odds')),
    spreadHome: num(at(pc, 'pointSpread', 'home', 'open', 'line')),
    total: num(at(pc, 'total', 'over', 'open', 'line')),
  };
  return { mlHome: mlHome != null ? mlHome : null, mlAway: mlAway != null ? mlAway : null, spreadHome,
    total: pc.overUnder != null ? pc.overUnder : null, book: pc.provider.name, open };
}

const _ESPN_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const _ESPN_DESIGNATION = { out: 0, doubtful: 0.1, questionable: 0.5, probable: 0.9, available: 1 };

// A Day-To-Day note's designation for tonight, or null. A note that names
// only other days ("ruled out for Monday's game") says nothing about
// tonight; "upgraded/downgraded (from X) to Y" means Y; otherwise the
// first designation in the note is the current one.
function _espnNoteAvailability(note, weekday) {
  const txt = (note || '').toLowerCase();
  const days = _ESPN_DAYS.filter(d => txt.includes(d));
  if (weekday && days.length && !days.includes(weekday)) return null;
  const moved = /\b(?:upgraded|downgraded)\b(?:\s+from\s+[a-z-]+)?\s+to\s+([a-z]+)/.exec(txt);
  if (moved && moved[1] in _ESPN_DESIGNATION) return _ESPN_DESIGNATION[moved[1]];
  const patterns = [[0, /\b(ruled out|is out|will miss|won't play|will not play|will sit|will be rested)\b/], [0.1, /\bdoubtful\b/],
    [0.5, /\bquestionable\b/], [0.9, /\bprobable\b/], [1, /\b(will play|is available|cleared to play)\b/]];
  let best = null;
  patterns.forEach(([a, re]) => { const m = re.exec(txt); if (m && (!best || m.index < best.at)) best = { a, at: m.index }; });
  return best ? best.a : null;
}

// injuries document → { playerId: { availability, status, note, name } }.
// "Out" is final; "Day-To-Day" reads tonight's designation from the note
// (0.5 when it has none). date: tonight (ET, YYYY-MM-DD).
function adaptEspnInjuries(doc, date) {
  const weekday = date ? _ESPN_DAYS[new Date(date + 'T12:00:00Z').getUTCDay()] : null;
  const out = {};
  for (const t of (doc && doc.injuries) || []) {
    for (const i of t.injuries || []) {
      const href = ((i.athlete && i.athlete.links) || []).map(l => l.href || '').find(h => /\/id\/\d+/.test(h)) || '';
      const id = (/\/id\/(\d+)/.exec(href) || [])[1];
      if (!id) continue;
      const note = i.shortComment || '';
      const fromNote = _espnNoteAvailability(note, weekday);
      const availability = /out|suspen/i.test(i.status || '') ? 0 : fromNote != null ? fromNote : 0.5;
      out[id] = { availability, status: i.status || null, note, name: i.athlete.displayName };
    }
  }
  return out;
}

function espnRest(abbr, date, games) {
  const prev = games.filter(g => g.date < date && (g.home === abbr || g.away === abbr)).map(g => g.date).sort();
  const last = prev[prev.length - 1];
  const restDays = last ? Math.round((new Date(date) - new Date(last)) / 864e5) - 1 : 3;
  const in4 = prev.filter(d => (new Date(date) - new Date(d)) / 864e5 <= 3).length;   // games in the 3 days before → with today, N in 4
  return { restDays, backToBack: restDays === 0, threeInFour: in4 >= 2, schedulePoints: 0 };
}

// Teams as of the morning of `date`: priors from `priorTeams` (SEASON_TEAM_PRIORS
// in team-priors.js), results and player lines from games before `date`.
// Roster = everyone in the team's box scores up to and including `date`;
// every player starts available (callers set tonight's availability).
function buildEspnTeams(priorTeams, date, games) {
  const before = games.filter(g => g.date < date);
  const teams = {};
  for (const [abbr, snapTeam] of Object.entries(priorTeams)) {
    const tg = before.filter(g => g.home === abbr || g.away === abbr);
    const pf = tg.reduce((s, g) => s + (g.home === abbr ? g.homeScore : g.awayScore), 0);
    const pa = tg.reduce((s, g) => s + (g.home === abbr ? g.awayScore : g.homeScore), 0);
    const seen = new Map();
    for (const g of games.filter(x => x.date <= date && (x.home === abbr || x.away === abbr))) {
      for (const p of (g.box && g.box[abbr]) || []) if (!seen.has(p.id)) seen.set(p.id, p.name);
    }
    const players = [...seen.entries()].map(([id, name]) => {
      const rows = tg.map(g => ((g.box && g.box[abbr]) || []).find(p => p.id === id)).filter(p => p && p.played);
      const n = rows.length;
      const avg = {};
      NBAI_STAT_KEYS.forEach(k => { avg[k] = n ? rows.reduce((s, r) => s + r.line[k], 0) / n : 0; });
      return { id, name, pos: '', status: 'Available', injury: null, availability: 1, projMin: avg.min, starter: false,
        depthRank: 99, avg, seasonGames: n, games: n, h2h: null, recent: null };
    });
    teams[abbr] = {
      abbr: snapTeam.abbr, name: snapTeam.name, city: snapTeam.city, logo: snapTeam.logo, prior: snapTeam.prior,
      current: { ppg: tg.length ? pf / tg.length : null, papg: tg.length ? pa / tg.length : null, games: tg.length },
      rest: espnRest(abbr, date, games),
      players,
    };
  }
  return teams;
}

// Tonight's slate from ESPN. Availability follows tonight's injury report,
// as the NB.AI slate does: a listed player gets the report's designation,
// everyone else on the team's current ESPN roster is in. Players no longer
// on the roster (traded, waived) are dropped; without a roster for a team,
// a player counts for the team he appeared for most recently. A roster
// player with no game for this team yet (an arrival, or back from injury)
// is added only if the report lists him; the engine values him from his
// prior seasons. Unlisted, he is presumed out of the rotation.
// games: completed EspnGames before `date`; tonight: [{id, tip, venue,
// home, away, market}]; injuries: adaptEspnInjuries output; rosters:
// { ABBR: [{id, name}] } (optional).
function adaptEspnSlate({ priorTeams, games, tonight, injuries, rosters, date, fetchedAt }) {
  const teams = buildEspnTeams(priorTeams, date, games);
  const lastTeam = {};
  for (const g of [...games].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))) {
    for (const abbr of [g.home, g.away]) for (const p of (g.box && g.box[abbr]) || []) lastTeam[p.id] = abbr;
  }
  for (const [abbr, team] of Object.entries(teams)) {
    const rosterList = rosters && rosters[abbr] ? rosters[abbr] : null;
    const roster = rosterList ? new Set(rosterList.map(r => String(r.id))) : null;
    const players = team.players.filter(p => (roster ? roster.has(p.id) : lastTeam[p.id] === abbr));
    const have = new Set(players.map(p => p.id));
    for (const r of rosterList || []) {
      const id = String(r.id);
      if (have.has(id) || !(injuries && injuries[id])) continue;
      const avg = {};
      NBAI_STAT_KEYS.forEach(k => { avg[k] = 0; });
      players.push({ id, name: r.name, pos: '', status: 'Available', injury: null, availability: 1, projMin: 0, starter: false,
        depthRank: 99, avg, seasonGames: 0, games: 0, h2h: null, recent: null });
    }
    team.players = players.map(p => {
      const inj = injuries && injuries[p.id];
      const availability = inj ? inj.availability : 1;
      return { ...p, availability, status: inj ? (availability === 0 ? 'Out' : inj.status) : 'Available', injury: inj ? inj.note : null };
    });
  }
  return {
    source: 'espn',
    date,
    fetchedAt: fetchedAt || null,
    modelVersion: null,
    league: deriveLeagueAverages(teams),
    teams,
    games: tonight.filter(g => teams[g.home] && teams[g.away])
      .map(g => ({ id: String(g.id), tip: g.tip, venue: g.venue || null, home: g.home, away: g.away, market: g.market || null, external: null })),
  };
}
