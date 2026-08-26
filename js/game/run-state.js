// ============================================================
// PLAYOFF RUN — RUN STATE (Phase 2, stepwise API Phase 3)
// ============================================================
// A "run" = one seeded journey through the full 2026 bracket. This module
// owns everything that persists ACROSS games and series:
//   - the bracket schedule (fixed NBA tree: (1v8 vs 4v5), (2v7 vs 3v6))
//   - per-team injury books + fatigue (the only legal cross-game carriers,
//     with coach adjustments — design law #4: no momentum)
//   - per-series hidden shifts, series edge, per-coach evidence logs
//   - rust: short prior series → long layoff → small G1 penalty next round
//     (rest-or-rust literature)
//
// STEPWISE SERIES API (Phase 3): the UI must pause between games for the
// user's plan, so a series is a SESSION — openRunSeries() → N×
// playSeriesGame() → auto-close at 4 wins. playRunSeries() is a thin loop
// over the same core (headless/CPU path and the solver audit run through
// identical code). getUpcomingGameState() is the PURE pre-game view
// (scratches, drags, rust) the UI renders the gameplan screen from.
//
// PROCESS CVA: when the user's plan drives a game, the game record carries
// cva = expected-margin delta between the user's plan and what the
// assistant (coach-AI) would have done — same latent state, same opponent
// plan. Grades the decision, not the dice (design decision, Aug 2026).
//
// PERSISTENCE: runs serialize to plain JSON (localStorage). The RNG is a
// counting stream — restore = recreate from seed + fast-forward draws.
// ============================================================

const GAME_RUN_CONFIG = {
  fatiguePerHeavyMin: 0.006,   // fatigue gained per minute above 32, per game
  fatigueDecay: 0.75,          // between games within a series
  fatigueRoundReset: 0.35,     // carry-over multiplier between rounds
  rustPenalty: 0.05,           // flat fatigue in G1 of next round after a
                               // short series (<=5 games) — rest becomes rust
};

/** R1 pairings per conference, ordered so winners meet correctly. */
function gameBracketR1(db, conf) {
  const bySeed = {};
  Object.values(db).forEach(t => { if (t.conf === conf) bySeed[t.seed] = t.abbr; });
  // Bracket tree order: [1v8, 4v5, 2v7, 3v6] → winners: (0 vs 1), (2 vs 3)
  return [
    [bySeed[1], bySeed[8]], [bySeed[4], bySeed[5]],
    [bySeed[2], bySeed[7]], [bySeed[3], bySeed[6]],
  ];
}

/** Home court between two teams: better seed; Finals: better record. */
function gameHomeCourt(db, a, b, round) {
  const ta = db[a], tb = db[b];
  if (round === 'Finals') {
    const wins = r => parseInt((r || '0-0').split('-')[0]);
    return wins(ta.record) >= wins(tb.record) ? [a, b] : [b, a];
  }
  return ta.seed <= tb.seed ? [a, b] : [b, a];
}

/**
 * Deterministic bracket scheduler: the next unplayed series given the
 * completed records, or null when a champion exists. Single source of
 * bracket structure for headless runs AND the interactive UI.
 */
function gameNextSeriesPair(db, seriesRecords) {
  const findRec = (a, b) => seriesRecords.find(s =>
    (s.home === a && s.away === b) || (s.home === b && s.away === a));
  // ROUND-MAJOR: every R1 series (both conferences) completes before any
  // R2 starts, and so on — first browser playtest caught the depth-first
  // version resolving the whole West CF before an East team's R1 G1.
  const byRound = { R1: [], R2: [], CF: [] };
  const confWinner = {};
  ['West', 'East'].forEach(conf => {
    const r1 = gameBracketR1(db, conf);
    const r1w = r1.map(p => { const r = findRec(p[0], p[1]); return r ? r.winner : null; });
    r1.forEach((p, i) => { if (!r1w[i]) byRound.R1.push({ a: p[0], b: p[1], round: 'R1' }); });
    if (r1w.some(w => !w)) return;
    const r2 = [[r1w[0], r1w[1]], [r1w[2], r1w[3]]];
    const r2w = r2.map(p => { const r = findRec(p[0], p[1]); return r ? r.winner : null; });
    r2.forEach((p, i) => { if (!r2w[i]) byRound.R2.push({ a: p[0], b: p[1], round: 'R2' }); });
    if (r2w.some(w => !w)) return;
    const cfRec = findRec(r2w[0], r2w[1]);
    if (!cfRec) byRound.CF.push({ a: r2w[0], b: r2w[1], round: 'CF' });
    else confWinner[conf] = cfRec.winner;
  });
  for (const round of ['R1', 'R2', 'CF']) {
    if (byRound[round].length) return byRound[round][0];
  }
  if (confWinner.West && confWinner.East) {
    return findRec(confWinner.West, confWinner.East)
      ? null
      : { a: confWinner.West, b: confWinner.East, round: 'Finals' };
  }
  return null;
}

/** Champion of a completed run's records, else null. */
function gameRunChampion(seriesRecords) {
  const f = seriesRecords.find(s => s.round === 'Finals');
  return f ? f.winner : null;
}

/** Create a run shell. userTeam null = fully CPU (headless mode). */
function createGameRun(db, opts) {
  opts = opts || {};
  const seed = opts.seed == null ? 1 : opts.seed;
  // Counting RNG: .draws makes the stream restorable (serialize seed +
  // draws; restore = recreate + fast-forward).
  const base = gameCreateRNG(seed);
  const rng = function () { rng.draws++; return base(); };
  rng.draws = 0;
  const run = {
    db, seed, rng,
    userTeam: opts.userTeam || null,
    cvaTotal: 0,
    teamState: {}, series: [], injuryLog: [],
  };
  Object.keys(db).forEach(abbr => {
    run.teamState[abbr] = { fatigue: {}, injuries: {}, rusty: false };
  });
  return run;
}

/** Open a series session. Rolls hidden shifts + series edge. */
function openRunSeries(run, aAbbr, bAbbr, round) {
  const [homeAbbr, awayAbbr] = gameHomeCourt(run.db, aAbbr, bAbbr, round);
  const sctx = makeGameSeries(run.db, homeAbbr, awayAbbr, round);
  const session = {
    homeAbbr, awayAbbr, round,
    shifts: rollSeriesShifts(sctx, run.rng),
    seriesEdge: gameNormal(run.rng, 0, GAME_CONFIG.seriesEdgeSigma),
    evidence: {
      [homeAbbr]: { own: initCoachEvidence(), opp: initCoachEvidence() },
      [awayAbbr]: { own: initCoachEvidence(), opp: initCoachEvidence() },
    },
    score: { home: 0, away: 0 },
    games: [],
    done: false,
  };
  session.sctx = sctx;   // object refs — rebuilt on restore, never serialized
  return session;
}

/**
 * PURE pre-game view for one side of the upcoming game: who is out, who
 * plays compromised, effective fatigue (incl. rust). The UI renders the
 * gameplan screen from this; playSeriesGame recomputes it identically.
 */
function getUpcomingGameState(run, session, abbr) {
  const st = run.teamState[abbr];
  const { unavailable, drags } = peekInjuryBook(st.injuries);
  const fatigue = { ...st.fatigue };
  Object.entries(drags).forEach(([n, d]) => { fatigue[n] = Math.min(1, (fatigue[n] || 0) + d); });
  if (session.games.length === 0 && st.rusty) {
    const team = session.sctx.home.abbr === abbr ? session.sctx.home : session.sctx.away;
    team.players.forEach(p => {
      fatigue[p.name] = Math.min(1, (fatigue[p.name] || 0) + GAME_RUN_CONFIG.rustPenalty);
    });
  }
  return { unavailable, fatigue, drags };
}

function _closeRunSeries(run, session) {
  session.done = true;
  const winner = session.score.home === 4 ? session.homeAbbr : session.awayAbbr;
  const loser = winner === session.homeAbbr ? session.awayAbbr : session.homeAbbr;
  [winner, loser].forEach(abbr => {
    const st = run.teamState[abbr];
    Object.keys(st.fatigue).forEach(n => { st.fatigue[n] *= GAME_RUN_CONFIG.fatigueRoundReset; });
  });
  run.teamState[winner].rusty = session.games.length <= 5;
  run.series.push({
    id: session.sctx.id, round: session.round,
    home: session.homeAbbr, away: session.awayAbbr,
    winner, games: session.games,
  });
}

/**
 * Play ONE game of an open session. userPlan (optional) drives run.userTeam
 * if that team is in this series; availability/fatigue are enforced from
 * game state regardless (physics, not preference). Auto-closes at 4 wins.
 */
function playSeriesGame(run, session, userPlan) {
  const rng = run.rng, sctx = session.sctx;
  const g = session.games.length + 1;
  const sides = {
    [session.homeAbbr]: { team: sctx.home, opp: sctx.away, key: 'home' },
    [session.awayAbbr]: { team: sctx.away, opp: sctx.home, key: 'away' },
  };

  const plans = {}, states = {};
  [session.homeAbbr, session.awayAbbr].forEach(abbr => {
    const gameState = getUpcomingGameState(run, session, abbr);
    states[abbr] = gameState;
    const isUser = userPlan && abbr === run.userTeam;
    plans[abbr] = isUser
      ? { ...userPlan, unavailable: gameState.unavailable, fatigue: gameState.fatigue }
      : makeCoachPlan(sides[abbr].team, sides[abbr].opp,
          session.evidence[abbr].own, session.evidence[abbr].opp, gameState, rng);
  });

  // Process CVA: user plan vs what the assistant would have done, same
  // latent state and same opponent plan. Throwaway RNG (seeded from the
  // stream position) so the main stream is untouched and it's replayable.
  let cva = null;
  const userInSeries = run.userTeam && sides[run.userTeam];
  if (userPlan && userInSeries) {
    const u = run.userTeam;
    const oppAbbr = u === session.homeAbbr ? session.awayAbbr : session.homeAbbr;
    const aiPlan = makeCoachPlan(sides[u].team, sides[u].opp,
      session.evidence[u].own, session.evidence[u].opp, states[u],
      gameCreateRNG((run.seed * 31 + run.rng.draws + g) >>> 0));
    const userIsHome = u === session.homeAbbr;
    const mk = plan => computeExpectedForPlans(sctx, g, session.score,
      userIsHome ? plan : plans[oppAbbr], userIsHome ? plans[oppAbbr] : plan).exp.margin;
    const mUser = userIsHome ? mk(plans[u]) : -mk(plans[u]);
    const mAI = userIsHome ? mk(aiPlan) : -mk(aiPlan);
    cva = { user: +mUser.toFixed(2), assistant: +mAI.toFixed(2), delta: +(mUser - mAI).toFixed(2) };
    run.cvaTotal = +(run.cvaTotal + cva.delta).toFixed(2);
  }

  const game = simulateGameOnce(sctx, g, {
    rng, shifts: session.shifts, seriesEdge: session.seriesEdge,
    seriesScore: { home: session.score.home, away: session.score.away },
    homePlan: plans[session.homeAbbr], awayPlan: plans[session.awayAbbr],
  });
  if (cva) game.cva = cva;
  session.games.push(game);
  if (game.winner === session.homeAbbr) session.score.home++; else session.score.away++;

  // Post-game bookkeeping per side: evidence, fatigue, injury book.
  [session.homeAbbr, session.awayAbbr].forEach(abbr => {
    const side = sides[abbr], st = run.teamState[abbr];
    st.rusty = false;
    updateCoachEvidence(session.evidence[abbr].own, game.box[side.key], side.team);
    updateCoachEvidence(session.evidence[abbr].opp, game.box[side.key === 'home' ? 'away' : 'home'], side.opp);
    game.box[side.key].forEach(row => {
      const gain = Math.max(0, row.min - 32) * GAME_RUN_CONFIG.fatiguePerHeavyMin;
      st.fatigue[row.name] = Math.min(1, (st.fatigue[row.name] || 0) * GAME_RUN_CONFIG.fatigueDecay + gain);
    });
    advanceInjuryBook(st.injuries);
    sampleGameInjuries(plans[abbr].rotation || [], st.fatigue, rng).forEach(ev => {
      st.injuries[ev.name] = { gamesOut: ev.gamesOut, drag: ev.drag, dragGames: ev.dragGames };
      run.injuryLog.push({ round: session.round, series: sctx.id, game: g, team: abbr, ...ev });
    });
  });

  if (session.score.home === 4 || session.score.away === 4) _closeRunSeries(run, session);
  return game;
}

/**
 * Headless series: thin loop over the session API. opts.planFn (audit /
 * scripted policies) is called per game with (abbr, sctx, gameState,
 * evidence) for run.userTeam.
 */
function playRunSeries(run, aAbbr, bAbbr, round, opts) {
  const session = openRunSeries(run, aAbbr, bAbbr, round);
  const userInSeries = run.userTeam &&
    (run.userTeam === session.homeAbbr || run.userTeam === session.awayAbbr);
  while (!session.done) {
    let userPlan = null;
    if (userInSeries && opts && opts.planFn) {
      userPlan = opts.planFn(run.userTeam, session.sctx,
        getUpcomingGameState(run, session, run.userTeam), session.evidence[run.userTeam]);
    }
    playSeriesGame(run, session, userPlan);
  }
  return run.series[run.series.length - 1];
}

/** Play the full bracket headlessly via the scheduler. */
function runFullBracket(db, opts) {
  const run = createGameRun(db, opts);
  let pair;
  while ((pair = gameNextSeriesPair(db, run.series))) {
    playRunSeries(run, pair.a, pair.b, pair.round, opts);
  }
  return { champion: gameRunChampion(run.series), series: run.series, injuryLog: run.injuryLog, run };
}

/**
 * Championship equity per team over N CPU-vs-CPU brackets. This is the
 * run-setup difficulty display AND the anti-solvability baseline.
 */
function computeEquityTable(db, nRuns, baseSeed) {
  const titles = {};
  Object.keys(db).forEach(a => { titles[a] = 0; });
  for (let i = 0; i < nRuns; i++) {
    titles[runFullBracket(db, { seed: (baseSeed || 10000) + i }).champion]++;
  }
  const equity = {};
  Object.entries(titles).forEach(([a, n]) => { equity[a] = n / nRuns; });
  return equity;
}

// ── Persistence (plain JSON; localStorage-ready) ────────────────
function serializeRun(run, session) {
  return JSON.stringify({
    v: 1, seed: run.seed, draws: run.rng.draws,
    userTeam: run.userTeam, cvaTotal: run.cvaTotal,
    teamState: run.teamState, series: run.series, injuryLog: run.injuryLog,
    session: (session && !session.done) ? {
      homeAbbr: session.homeAbbr, awayAbbr: session.awayAbbr, round: session.round,
      shifts: session.shifts, seriesEdge: session.seriesEdge,
      evidence: session.evidence, score: session.score, games: session.games,
      done: false,
    } : null,
  });
}

function restoreRun(db, json) {
  const d = JSON.parse(json);
  const run = createGameRun(db, { seed: d.seed, userTeam: d.userTeam });
  while (run.rng.draws < d.draws) run.rng();   // fast-forward the stream
  run.cvaTotal = d.cvaTotal || 0;
  run.teamState = d.teamState;
  run.series = d.series;
  run.injuryLog = d.injuryLog;
  let session = null;
  if (d.session) {
    session = d.session;
    session.sctx = makeGameSeries(db, session.homeAbbr, session.awayAbbr, session.round);
  }
  return { run, session };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GAME_RUN_CONFIG, gameBracketR1, gameHomeCourt, gameNextSeriesPair, gameRunChampion,
    createGameRun, openRunSeries, getUpcomingGameState, playSeriesGame, playRunSeries,
    runFullBracket, computeEquityTable, serializeRun, restoreRun,
  };
}
