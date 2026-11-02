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
    const final = !!(c.status && c.status.type && c.status.type.name === 'STATUS_FINAL');
    return {
      id: String(e.id),
      date: e.date,
      home: home && home.team.abbreviation,
      away: away && away.team.abbreviation,
      homeScore: home && home.score != null ? Number(home.score) : null,
      awayScore: away && away.score != null ? Number(away.score) : null,
      final,
    };
  }).filter(Boolean);
}
