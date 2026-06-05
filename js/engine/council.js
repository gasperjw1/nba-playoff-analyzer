// ============================================================
// THE COUNCIL — multi-agent deliberation framework (Phase 75)
// ============================================================
// Each agent runs a DEFINED METHOD on raw data and emits a STRUCTURED
// VERDICT. Agents do not see each other's output. The synthesizer
// aggregates verdicts (not narratives). The adversarial pass tries
// to break the consensus before stake sizing.
//
// Why this exists: a single LLM analyzing a game pulls toward the
// middle ("balanced averaging trap"). Separate method-driven agents
// each running on raw data, output structured numbers, prevent that.
//
// Verdict schema (all agents must conform):
//   {
//     agent          : 'spread-value',
//     side           : 'home' | 'away' | 'no-edge',  // who has the edge
//     edge           : -1..+1,                       // signed magnitude (+ = home)
//     confidence     : 0..1,                         // how sure the agent is
//     evidenceCount  : integer,                      // how many data points used
//     evidence       : [{type, finding}]             // specific findings
//     method         : 'short description'           // for audit trail
//   }
//
// Convention: line is offered as `spread` (home side, e.g. SAS -5.5).
// Positive edge = home covers / wins by more.
// Negative edge = away covers / wins outright.
// ============================================================

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function getTeamPlayoffGames(SERIES_DATA, abbr) {
  // Returns all completed playoff games involving this team, with
  // venue tagged (home/away by VENUE not series-home convention).
  const games = [];
  SERIES_DATA.forEach(s => {
    if (!s.games) return;
    const isSeriesHome = s.id.startsWith(abbr + '-');
    const isSeriesAway = s.id.endsWith('-' + abbr);
    if (!isSeriesHome && !isSeriesAway) return;
    s.games.forEach(g => {
      if (!g.winner || g.homeScore == null) return;
      // Venue convention: games 1,2,5,7 at series-home, 3,4,6 at series-away
      const venueAtSeriesHome = [1, 2, 5, 7].includes(g.num);
      const isHomeVenue = (isSeriesHome && venueAtSeriesHome) || (isSeriesAway && !venueAtSeriesHome);
      const teamScore = isSeriesHome ? g.homeScore : g.awayScore;
      const oppScore = isSeriesHome ? g.awayScore : g.homeScore;
      games.push({
        seriesId: s.id, gameNum: g.num, round: s.round || 'R1',
        venue: isHomeVenue ? 'home' : 'road',
        teamScore, oppScore, margin: teamScore - oppScore,
        won: g.winner === abbr,
      });
    });
  });
  return games;
}

function getPlayerMinutesHistory(SERIES_DATA, abbr, playerName, lookback) {
  // Returns last N minute-loads for a player across the playoffs.
  const minutes = [];
  SERIES_DATA.forEach(s => {
    if (!s.games) return;
    s.games.forEach(g => {
      if (!g.boxScores) return;
      const isSeriesHome = s.id.startsWith(abbr + '-');
      const isSeriesAway = s.id.endsWith('-' + abbr);
      if (!isSeriesHome && !isSeriesAway) return;
      const box = isSeriesHome ? g.boxScores.home : g.boxScores.away;
      const player = box.find(p => p.name && (
        p.name === playerName ||
        p.name.includes(playerName.split(' ').slice(-1)[0])
      ));
      if (player) {
        minutes.push({
          seriesId: s.id, gameNum: g.num,
          min: player.min || 0,
          pts: player.pts || 0,
          fg: player.fg || null,
          to: player.to || 0,
        });
      }
    });
  });
  return lookback ? minutes.slice(-lookback) : minutes;
}

// ──────────────────────────────────────────────────────────────────
// AGENT 1 — Spread Value Agent
// Method: compute home margin distribution + road opponent margin
// distribution from this playoff run, project hit rate vs the line.
// ──────────────────────────────────────────────────────────────────

function spreadValueAgent(series, gameNum, market, SERIES_DATA) {
  const homeAbbr = series.homeTeam.abbr;
  const awayAbbr = series.awayTeam.abbr;
  const spread = market.spread; // negative number = home favorite

  const homeGames = getTeamPlayoffGames(SERIES_DATA, homeAbbr).filter(g => g.venue === 'home');
  const awayGames = getTeamPlayoffGames(SERIES_DATA, awayAbbr).filter(g => g.venue === 'road');

  // For each home game, simulate: would the home team have covered `spread`?
  // home covers if home margin > -spread (e.g. -5.5 line, need margin > 5.5)
  const homeCoverThreshold = -spread; // e.g. 5.5
  const homeCovers = homeGames.filter(g => g.margin > homeCoverThreshold).length;
  const homePushes = homeGames.filter(g => g.margin === homeCoverThreshold).length;
  const homeCoverRate = homeGames.length ? homeCovers / homeGames.length : 0;

  // For away team road games, would they have covered +spread?
  const awayCovers = awayGames.filter(g => g.margin > spread).length;
  const awayCoverRate = awayGames.length ? awayCovers / awayGames.length : 0;

  // Combined estimate: weight by sample sizes
  const totalSample = homeGames.length + awayGames.length;
  const estimatedAwayCoverRate = totalSample
    ? (awayGames.length * awayCoverRate + homeGames.length * (1 - homeCoverRate)) / totalSample
    : 0.5;

  // Market implied at -110 = 52.4%
  const marketImplied = 0.524;
  const edge = estimatedAwayCoverRate - marketImplied; // positive = away covers > market
  const side = edge > 0.05 ? 'away' : edge < -0.05 ? 'home' : 'no-edge';
  const confidence = Math.min(0.95, totalSample / 20); // saturates at 20 games

  return {
    agent: 'spread-value',
    side, edge: -edge, // sign convention: + = home (here we computed away-cover edge, so flip)
    confidence,
    evidenceCount: totalSample,
    method: 'Home margin distribution vs road-team margin distribution, applied to current line',
    evidence: [
      { type: 'home-cover-rate', finding: `${homeAbbr} home cover rate at this line: ${(homeCoverRate * 100).toFixed(0)}% (${homeCovers}/${homeGames.length})` },
      { type: 'away-cover-rate', finding: `${awayAbbr} road cover rate at this line: ${(awayCoverRate * 100).toFixed(0)}% (${awayCovers}/${awayGames.length})` },
      { type: 'estimated-line-hit', finding: `${awayAbbr} +${Math.abs(spread)} estimated cover rate: ${(estimatedAwayCoverRate * 100).toFixed(1)}%` },
      { type: 'market-implied', finding: `Market implied (at -110): 52.4%` },
      { type: 'edge', finding: `Edge ${edge >= 0 ? 'toward ' + awayAbbr : 'toward ' + homeAbbr}: ${(Math.abs(edge) * 100).toFixed(1)}pp` },
    ],
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 2 — Matchup Agent
// Method: use defMatchups (dLEBRON of top defender on top scorer)
// to estimate expected efficiency tax on the home offense.
// ──────────────────────────────────────────────────────────────────

function matchupAgent(series, gameNum, market, SERIES_DATA) {
  const dm = series.defMatchups;
  if (!dm) {
    return {
      agent: 'matchup', side: 'no-edge', edge: 0, confidence: 0.1,
      evidenceCount: 0, method: 'defMatchups data', evidence: [{ type: 'missing', finding: 'No defMatchups data available' }],
    };
  }
  // Higher dLEBRON on home star = home offense more suppressed = away edge
  const homeStarDDef = dm.awayDefOnHome ? (dm.awayDefOnHome.dLebron || 0) : 0;
  const awayStarDDef = dm.homeDefOnAway ? (dm.homeDefOnAway.dLebron || 0) : 0;

  // Convert to expected point impact: rough conversion ~3 pts per dLEBRON unit
  // applied to high-USG star (usg > 28%)
  const homeOffenseSuppression = homeStarDDef * 3.0; // how much home offense is pressured (by away's defender)
  const awayOffenseSuppression = awayStarDDef * 3.0; // how much away offense is pressured (by home's defender)
  // If home offense is MORE pressured (homeOffenseSuppression > awayOffenseSuppression),
  // away has the matchup edge → negative edge.
  const netHomeAdvantage = awayOffenseSuppression - homeOffenseSuppression; // positive = home has the better defender
  const edge = netHomeAdvantage / 8; // + = home edge, - = away edge
  const side = edge > 0.05 ? 'home' : edge < -0.05 ? 'away' : 'no-edge';

  return {
    agent: 'matchup',
    side, edge: Math.max(-1, Math.min(1, edge)),
    confidence: 0.55,
    evidenceCount: 2,
    method: 'dLEBRON × usage → expected efficiency tax on primary scorers',
    evidence: [
      { type: 'home-star-defender', finding: `${dm.awayDefOnHome.defender} (dLEBRON ${homeStarDDef.toFixed(2)}) on ${dm.awayDefOnHome.target} — home star pressured ${homeOffenseSuppression.toFixed(1)} pts` },
      { type: 'away-star-defender', finding: `${dm.homeDefOnAway.defender} (dLEBRON ${awayStarDDef.toFixed(2)}) on ${dm.homeDefOnAway.target} — away star pressured ${awayOffenseSuppression.toFixed(1)} pts` },
      { type: 'net', finding: `Net matchup edge: ${netHomeAdvantage > 0 ? 'home' : 'away'} team's defender more impactful by ${Math.abs(netHomeAdvantage).toFixed(1)} pts` },
    ],
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 3 — Fatigue Agent
// Method: per-team key player minute-load over last 5 games. Backup
// scarcity multiplier. Qualitative signals from prior game.
// ──────────────────────────────────────────────────────────────────

function fatigueAgent(series, gameNum, market, SERIES_DATA, qualSignals, externalResearch) {
  const homeAbbr = series.homeTeam.abbr;
  const awayAbbr = series.awayTeam.abbr;
  externalResearch = externalResearch || [];

  // Pull top-3 scorers/starters by rating for each team
  const homeTopPlayers = (series.homeTeam.players || []).filter(p => p.rating >= 70).slice(0, 4).map(p => p.name);
  const awayTopPlayers = (series.awayTeam.players || []).filter(p => p.rating >= 70).slice(0, 4).map(p => p.name);

  function teamFatigueIndex(abbr, players) {
    let totalMin = 0, count = 0, highMinFlag = 0;
    players.forEach(name => {
      const history = getPlayerMinutesHistory(SERIES_DATA, abbr, name, 5);
      history.forEach(g => {
        totalMin += g.min;
        count++;
        if (g.min >= 38) highMinFlag++;
      });
    });
    const avgMin = count ? totalMin / count : 0;
    const heavyLoad = highMinFlag / Math.max(1, count); // % of recent appearances over 38min
    return { avgMin, heavyLoad, sampleSize: count };
  }

  const homeFatigue = teamFatigueIndex(homeAbbr, homeTopPlayers);
  const awayFatigue = teamFatigueIndex(awayAbbr, awayTopPlayers);

  // Qualitative signal lookup: last-game fatigue flag for either team
  const lastGameSignals = (qualSignals || []).filter(s =>
    s.series === series.id && s.game === gameNum - 1 && s.signal === 'q4-fatigue'
  );
  const qualHomeFatigue = lastGameSignals.filter(s => {
    const subj = s.subject;
    return (series.homeTeam.players || []).some(p => p.name === subj || subj.includes(p.name.split(' ').slice(-1)[0]));
  });
  const qualAwayFatigue = lastGameSignals.filter(s => {
    const subj = s.subject;
    return (series.awayTeam.players || []).some(p => p.name === subj || subj.includes(p.name.split(' ').slice(-1)[0]));
  });

  // Pull EXTERNAL RESEARCH findings (web-sourced analyst evidence)
  const externalHomeFatigue = externalResearch.filter(r =>
    r.signalType === 'fatigue' && r.series === series.id &&
    (series.homeTeam.players || []).some(p => p.name === r.subject || r.subject === 'TEAM:' + homeAbbr)
  );
  const externalAwayFatigue = externalResearch.filter(r =>
    r.signalType === 'fatigue' && r.series === series.id &&
    (series.awayTeam.players || []).some(p => p.name === r.subject || r.subject === 'TEAM:' + awayAbbr)
  );

  // External evidence weight: sum of finding weights (each weighted by source credibility)
  const externalHomeWeight = externalHomeFatigue.reduce((a, r) => a + r.weight, 0);
  const externalAwayWeight = externalAwayFatigue.reduce((a, r) => a + r.weight, 0);

  // Compute fatigue index: avg min + heavy-load fraction + qualitative weight + EXTERNAL evidence
  const homeIndex = homeFatigue.avgMin / 40
    + homeFatigue.heavyLoad * 0.3
    + qualHomeFatigue.reduce((a, s) => a + s.severity, 0) * 0.2
    + externalHomeWeight * 0.15;
  const awayIndex = awayFatigue.avgMin / 40
    + awayFatigue.heavyLoad * 0.3
    + qualAwayFatigue.reduce((a, s) => a + s.severity, 0) * 0.2
    + externalAwayWeight * 0.15;
  const netFatigueImpact = homeIndex - awayIndex; // positive = home is more fatigued = away edge

  const edge = -netFatigueImpact / 0.5; // scale to [-1,+1]
  const side = edge > 0.05 ? 'home' : edge < -0.05 ? 'away' : 'no-edge';

  return {
    agent: 'fatigue',
    side, edge: Math.max(-1, Math.min(1, edge)),
    confidence: 0.5 + 0.1 * lastGameSignals.length + 0.05 * (externalHomeFatigue.length + externalAwayFatigue.length),
    evidenceCount: homeFatigue.sampleSize + awayFatigue.sampleSize + lastGameSignals.length + externalHomeFatigue.length + externalAwayFatigue.length,
    method: 'Last-5-game minute load + user qualitative signals + web-sourced analyst evidence',
    evidence: [
      { type: 'home-team-load', finding: `${homeAbbr} top players avg ${homeFatigue.avgMin.toFixed(1)} min/game, ${(homeFatigue.heavyLoad * 100).toFixed(0)}% of appearances over 38min` },
      { type: 'away-team-load', finding: `${awayAbbr} top players avg ${awayFatigue.avgMin.toFixed(1)} min/game, ${(awayFatigue.heavyLoad * 100).toFixed(0)}% of appearances over 38min` },
      ...lastGameSignals.map(s => ({ type: 'qual-signal', finding: `[USER] ${s.subject}: ${s.signal} (sev ${s.severity}) — ${s.evidence.slice(0, 100)}...` })),
      ...externalHomeFatigue.concat(externalAwayFatigue).map(r => ({
        type: 'external',
        finding: `[${r.source}] ${r.finding.slice(0, 140)}${r.quote ? ' "' + r.quote + '"' : ''}`
      })),
      { type: 'fatigue-net', finding: `Net fatigue impact: ${netFatigueImpact > 0 ? homeAbbr : awayAbbr} more fatigued by index ${Math.abs(netFatigueImpact).toFixed(2)}` },
    ],
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 4 — Coaching Agent
// Method: known coach attributes (career playoff record, COY status,
// documented H2 swing). Currently rule-based on coach.playoffRecord.
// ──────────────────────────────────────────────────────────────────

function coachingAgent(series, gameNum, market, SERIES_DATA) {
  const homeCoach = series.coaching && series.coaching.home;
  const awayCoach = series.coaching && series.coaching.away;
  if (!homeCoach || !awayCoach) {
    return {
      agent: 'coaching', side: 'no-edge', edge: 0, confidence: 0.1,
      evidenceCount: 0, method: 'series.coaching data', evidence: [{ type: 'missing', finding: 'No coaching data' }],
    };
  }

  // Heuristic coaching strength score:
  // +0.3 for 2x COY ; +0.2 for prior Finals as HC ; +0.1 for Pop tree
  function score(record) {
    let s = 0;
    if (/coach of the year|COY/i.test(record || '')) s += /2-time|2x|two-time/i.test(record) ? 0.4 : 0.2;
    if (/NBA finals|Finals as HC/i.test(record || '')) s += 0.2;
    if (/Popovich|Pop tree|Spurs assistant/i.test((record + ' ' + (homeCoach.tendency || awayCoach.tendency || ''))) ) s += 0.1;
    if (/first finals|1st finals|first year/i.test(record || '')) s -= 0.1;
    return s;
  }
  const homeScore = score(homeCoach.playoffRecord);
  const awayScore = score(awayCoach.playoffRecord);
  const netCoachingEdge = awayScore - homeScore;

  const edge = -netCoachingEdge / 0.6;
  const side = edge > 0.05 ? 'home' : edge < -0.05 ? 'away' : 'no-edge';

  return {
    agent: 'coaching',
    side, edge: Math.max(-1, Math.min(1, edge)),
    confidence: 0.4,
    evidenceCount: 2,
    method: 'Heuristic coaching résumé scoring: COY trophies × prior Finals × Pop-tree',
    evidence: [
      { type: 'home-coach', finding: `${homeCoach.coach}: ${homeCoach.playoffRecord || 'no record string'} (score ${homeScore.toFixed(2)})` },
      { type: 'away-coach', finding: `${awayCoach.coach}: ${awayCoach.playoffRecord || 'no record string'} (score ${awayScore.toFixed(2)})` },
      { type: 'net', finding: `Net coaching edge to ${netCoachingEdge > 0 ? awayCoach.coach : homeCoach.coach}: ${Math.abs(netCoachingEdge).toFixed(2)}` },
    ],
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 5 — Momentum Agent
// Method: last-N record, streak length, comeback wins, last-game result.
// ──────────────────────────────────────────────────────────────────

function momentumAgent(series, gameNum, market, SERIES_DATA) {
  const homeAbbr = series.homeTeam.abbr;
  const awayAbbr = series.awayTeam.abbr;
  const homeGames = getTeamPlayoffGames(SERIES_DATA, homeAbbr);
  const awayGames = getTeamPlayoffGames(SERIES_DATA, awayAbbr);

  function streak(games) {
    // Current winning streak (consecutive wins at the end)
    let s = 0;
    for (let i = games.length - 1; i >= 0; i--) {
      if (games[i].won) s++; else break;
    }
    return s;
  }
  const homeStreak = streak(homeGames);
  const awayStreak = streak(awayGames);
  const homeLastResult = homeGames.length ? homeGames[homeGames.length - 1].won : null;
  const awayLastResult = awayGames.length ? awayGames[awayGames.length - 1].won : null;

  // Net momentum: streak difference + last-game result asymmetry
  // Convention: + edge = home team has momentum, - edge = away team has momentum.
  const streakDelta = homeStreak - awayStreak; // positive = home has bigger streak
  const lastResultDelta = (homeLastResult ? 1 : -1) - (awayLastResult ? 1 : -1);
  const momentumNet = streakDelta * 0.5 + lastResultDelta * 0.5; // + = home momentum

  const edge = momentumNet / 6; // 6-game streak diff = max edge
  const side = edge > 0.05 ? 'home' : edge < -0.05 ? 'away' : 'no-edge';

  return {
    agent: 'momentum',
    side, edge: Math.max(-1, Math.min(1, edge)),
    confidence: 0.45,
    evidenceCount: homeGames.length + awayGames.length,
    method: 'Winning streak length + last-game result delta',
    evidence: [
      { type: 'home-streak', finding: `${homeAbbr} current streak: ${homeStreak} (last: ${homeLastResult ? 'W' : 'L'})` },
      { type: 'away-streak', finding: `${awayAbbr} current streak: ${awayStreak} (last: ${awayLastResult ? 'W' : 'L'})` },
      { type: 'home-overall', finding: `${homeAbbr} playoff record: ${homeGames.filter(g => g.won).length}-${homeGames.filter(g => !g.won).length}` },
      { type: 'away-overall', finding: `${awayAbbr} playoff record: ${awayGames.filter(g => g.won).length}-${awayGames.filter(g => !g.won).length}` },
    ],
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 6 — Market Agent
// Method: compare prediction (hand-authored game.prediction.margin)
// vs market spread. Divergence = edge.
// ──────────────────────────────────────────────────────────────────

function marketAgent(series, gameNum, market, SERIES_DATA) {
  const game = series.games && series.games[gameNum - 1];
  const pred = game && game.prediction;
  if (!pred || typeof pred.margin !== 'number') {
    return {
      agent: 'market', side: 'no-edge', edge: 0, confidence: 0.1,
      evidenceCount: 0, method: 'engine projection vs market spread',
      evidence: [{ type: 'missing', finding: 'No engine prediction available for this game' }],
    };
  }
  const engineHomeMargin = pred.homeWin ? pred.margin : -pred.margin;
  const marketHomeMargin = -market.spread; // -spread is home expected margin
  const divergence = engineHomeMargin - marketHomeMargin; // + = engine more bullish on home
  const edge = divergence / 6; // 6-pt divergence = full edge
  const side = edge > 0.1 ? 'home' : edge < -0.1 ? 'away' : 'no-edge';

  return {
    agent: 'market',
    side, edge: Math.max(-1, Math.min(1, edge)),
    confidence: 0.6,
    evidenceCount: 2,
    method: 'Engine prediction vs market line divergence',
    evidence: [
      { type: 'engine-margin', finding: `Engine prediction: home margin ${engineHomeMargin >= 0 ? '+' : ''}${engineHomeMargin}` },
      { type: 'market-margin', finding: `Market implied home margin: ${marketHomeMargin >= 0 ? '+' : ''}${marketHomeMargin} (spread ${market.spread})` },
      { type: 'divergence', finding: `Divergence: ${divergence.toFixed(1)} pts toward ${divergence > 0 ? 'home' : 'away'}` },
    ],
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 7 — Historical Agent
// Method: hard-coded base rates from research, applied to the
// situation type (G1 winner road vs home; G2 home after loss; etc.)
// ──────────────────────────────────────────────────────────────────

function historicalAgent(series, gameNum, market, SERIES_DATA) {
  const evidence = [];
  let netEdge = 0, weight = 0;

  // Rule 1: home team after losing G1 wins G2 at ~77% historically
  const prevGame = gameNum > 1 && series.games[gameNum - 2];
  const prevWinner = prevGame && prevGame.winner;
  const homeAbbr = series.homeTeam.abbr;
  if (gameNum === 2 && prevWinner && prevWinner !== homeAbbr) {
    evidence.push({ type: 'g2-home-bounce', finding: 'Historical: home team loses G1 → wins G2 ~77% of the time' });
    netEdge += 0.30; // edge toward home
    weight += 1;
  }
  // Rule 2: away team is up 1-0 on the road → road team Finals series win rate is high (~67%)
  if (gameNum === 2 && prevWinner && prevWinner !== homeAbbr) {
    evidence.push({ type: 'g1-road-win', finding: 'Historical: G1 road winner takes the series ~67% of the time' });
    // This is a series-level signal, not a G2 single-game signal; small weight
    netEdge -= 0.1; // small away series-edge
    weight += 0.5;
  }
  // Rule 3: research shows momentum runaway NOT supported in close playoff games (50.1%)
  evidence.push({ type: 'no-runaway', finding: 'Research: comeback team wins 50.1% of OT games — no momentum runaway effect; close games are 50/50 even with late deficit' });

  const edge = weight ? netEdge / weight : 0;
  const side = edge > 0.05 ? 'home' : edge < -0.05 ? 'away' : 'no-edge';
  return {
    agent: 'historical', side, edge,
    confidence: 0.55, evidenceCount: evidence.length,
    method: 'Hard-coded base rates from published research applied to situation type',
    evidence,
  };
}

// ──────────────────────────────────────────────────────────────────
// AGENT 8 — Risk / Variance Agent
// Method: scan for asymmetric variance — backup scarcity, injury risk,
// blowout-tail probability. Output: flag variance + recommend sizing.
// ──────────────────────────────────────────────────────────────────

function riskAgent(series, gameNum, market, SERIES_DATA) {
  const evidence = [];
  let variance = 0;

  // Check 1: injury flags in player records
  const allPlayers = [...(series.homeTeam.players || []), ...(series.awayTeam.players || [])];
  const injured = allPlayers.filter(p => p.injury && p.injury.length);
  injured.forEach(p => {
    evidence.push({ type: 'injury', finding: `${p.name}: ${p.injury.slice(0, 120)}...` });
    variance += 0.05;
  });

  // Check 2: backup scarcity — center position especially
  const homeC = (series.homeTeam.players || []).filter(p => p.pos === 'C');
  const awayC = (series.awayTeam.players || []).filter(p => p.pos === 'C');
  if (homeC.length < 2 || (homeC[1] && homeC[1].rating < 60)) {
    evidence.push({ type: 'backup-scarcity', finding: `${series.homeTeam.abbr} only viable C is ${homeC[0].name} (backup rating ${homeC[1] ? homeC[1].rating : 'n/a'}) — fatigue risk + foul-trouble risk amplifies variance` });
    variance += 0.15;
  }
  if (awayC.length < 2 || (awayC[1] && awayC[1].rating < 60)) {
    evidence.push({ type: 'backup-scarcity', finding: `${series.awayTeam.abbr} only viable C is ${awayC[0].name}` });
    variance += 0.1;
  }

  // Check 3: blowout tail probability — if team has bimodal margin distribution, higher variance
  const homeAbbr = series.homeTeam.abbr;
  const homeGames = getTeamPlayoffGames(SERIES_DATA, homeAbbr).filter(g => g.venue === 'home');
  const homeWinsBlowout = homeGames.filter(g => g.margin >= 15).length;
  const homeWinsClose = homeGames.filter(g => g.margin > 0 && g.margin < 15).length;
  const bimodal = homeWinsBlowout > 0 && homeWinsClose === 0;
  if (bimodal) {
    evidence.push({ type: 'bimodal-home', finding: `${homeAbbr} home wins are exclusively blowouts (${homeWinsBlowout} wins, all by 15+) — line at -5.5 sits in dead-zone, high variance` });
    variance += 0.1;
  }

  // Risk agent emits NO directional edge — only variance flag + sizing rec
  return {
    agent: 'risk', side: 'no-edge', edge: 0,
    confidence: 0.5, evidenceCount: evidence.length,
    method: 'Asymmetric variance scan: backup scarcity, injury, distribution shape',
    variance,
    sizingRecommendation: variance > 0.3 ? 'half-stake (high variance)' : variance > 0.15 ? 'standard stake' : 'full stake (low variance)',
    evidence,
  };
}

// ──────────────────────────────────────────────────────────────────
// SYNTHESIZER — aggregates verdicts (not narratives)
// Phase 75c: applies SIGNAL CALIBRATION — multiplies each agent's
// raw edge by the calibration weight for its evidence type.
// Mechanical signals (line/distribution) > narrative signals (analyst quotes).
// See js/data/signal-calibration.js for the calibration table + rationale.
// ──────────────────────────────────────────────────────────────────

// Map agent name → primary signal type for calibration lookup
const AGENT_TO_SIGNAL_TYPE = {
  'spread-value': 'spread-value',
  'matchup': 'matchup-dlebron',
  'fatigue': 'fatigue-analyst-claim', // worst-case for fatigue — actually has mix of mechanical + analyst
  'coaching': 'coaching-resume',
  'momentum': 'momentum-streak',
  'market': 'market-divergence',
  'historical': 'historical-base-rate',
  'risk': 'risk-variance',
};

function synthesizeCouncil(verdicts, calibrationFn) {
  // Apply per-agent calibration weight (defaults to 1.0 if no calibration fn provided)
  const cal = typeof calibrationFn === 'function' ? calibrationFn : () => 1.0;

  let totalEdge = 0, totalWeight = 0;
  const directional = verdicts.filter(v => v.agent !== 'risk');
  const calibratedVerdicts = directional.map(v => {
    const signalType = AGENT_TO_SIGNAL_TYPE[v.agent] || 'default';
    const calWeight = cal(signalType);
    return { ...v, calibrationWeight: calWeight, calibratedEdge: v.edge * calWeight };
  });
  calibratedVerdicts.forEach(v => {
    const w = v.confidence * Math.log(1 + v.evidenceCount);
    totalEdge += v.calibratedEdge * w;
    totalWeight += w;
  });
  const aggregateEdge = totalWeight ? totalEdge / totalWeight : 0;
  const recommendedSide = aggregateEdge > 0.05 ? 'home' : aggregateEdge < -0.05 ? 'away' : 'no-edge';

  // Convergence check: how many agents agree with the aggregate?
  const aggSide = recommendedSide === 'no-edge' ? null : recommendedSide;
  const agreeCount = directional.filter(v => v.side === aggSide).length;
  const disagreeCount = directional.filter(v => v.side && v.side !== 'no-edge' && v.side !== aggSide).length;

  // Risk agent's variance flag
  const risk = verdicts.find(v => v.agent === 'risk') || {};
  const sizingRec = risk.sizingRecommendation || 'standard stake';

  return {
    aggregateEdge,
    recommendedSide,
    convergence: { agreeing: agreeCount, disagreeing: disagreeCount, total: directional.length },
    confidence: Math.min(0.95, totalWeight / 5),
    variance: risk.variance || 0,
    sizing: sizingRec,
    calibratedVerdicts, // include for transparency: shows pre-cal vs post-cal edge per agent
  };
}

// ──────────────────────────────────────────────────────────────────
// ADVERSARIAL CHECK — try to break the synthesized verdict
// ──────────────────────────────────────────────────────────────────

function adversarialCheck(verdicts, synthesis, series, gameNum) {
  // Identify the strongest dissenting verdict and report it as the
  // "could break the consensus if it's right" pass.
  const aggSide = synthesis.recommendedSide;
  const dissenters = verdicts.filter(v =>
    v.side && v.side !== 'no-edge' && v.side !== aggSide && v.agent !== 'risk'
  ).sort((a, b) => Math.abs(b.edge) * b.confidence - Math.abs(a.edge) * a.confidence);
  const strongestDissent = dissenters[0];
  return {
    strongestDissent: strongestDissent ? {
      agent: strongestDissent.agent,
      argument: `${strongestDissent.agent} thinks ${strongestDissent.side} has the edge (${(Math.abs(strongestDissent.edge) * 100).toFixed(0)}%) — could break consensus if this signal is the real driver`,
      keyEvidence: strongestDissent.evidence.slice(0, 2),
    } : null,
    consensusFragility: dissenters.length / Math.max(1, verdicts.length - 1),
  };
}

// ──────────────────────────────────────────────────────────────────
// RUN THE COUNCIL
// ──────────────────────────────────────────────────────────────────

function runCouncil(series, gameNum, market, SERIES_DATA, qualitativeSignals, externalResearch, calibrationFn) {
  const verdicts = [
    spreadValueAgent(series, gameNum, market, SERIES_DATA),
    matchupAgent(series, gameNum, market, SERIES_DATA),
    fatigueAgent(series, gameNum, market, SERIES_DATA, qualitativeSignals, externalResearch),
    coachingAgent(series, gameNum, market, SERIES_DATA),
    momentumAgent(series, gameNum, market, SERIES_DATA),
    marketAgent(series, gameNum, market, SERIES_DATA),
    historicalAgent(series, gameNum, market, SERIES_DATA),
    riskAgent(series, gameNum, market, SERIES_DATA),
  ];
  const synthesis = synthesizeCouncil(verdicts, calibrationFn);
  const adversarial = adversarialCheck(verdicts, synthesis, series, gameNum);
  return { verdicts, synthesis, adversarial };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    spreadValueAgent, matchupAgent, fatigueAgent, coachingAgent,
    momentumAgent, marketAgent, historicalAgent, riskAgent,
    synthesizeCouncil, adversarialCheck, runCouncil,
  };
}
