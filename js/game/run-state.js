// ============================================================
// PLAYOFF RUN — RUN STATE (Phase 2)
// ============================================================
// A "run" = one seeded journey through the full 2026 bracket. This module
// owns everything that persists ACROSS games and series:
//   - the bracket tree (fixed NBA structure: (1v8 vs 4v5), (2v7 vs 3v6))
//   - per-team injury books + fatigue (the only legal cross-game carriers,
//     with coach adjustments — design law #4: no momentum)
//   - per-series hidden shifts + per-coach evidence logs
//   - rust: a team coming off a short series waits longer between rounds
//     (rest-or-rust literature: 3+ idle days shows a small RUST effect)
//
// Phase 2 scope: headless CPU-vs-CPU runs (every team coached by coach-ai)
// + the championship-equity table. Phase 3 swaps the user's team's plans
// in through the identical plan interface. The run object is plain JSON
// (localStorage-ready).
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
  const teams = Object.values(db).filter(t => t.conf === conf);
  const bySeed = {};
  teams.forEach(t => { bySeed[t.seed] = t.abbr; });
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
 * Play one series inside a run: coach-AI plans each game for both sides
 * (or a caller-supplied planFn for the user's team), injuries + fatigue
 * evolve, evidence accumulates.
 *
 * @param {Object} run     run object (teamState mutated)
 * @param {string} aAbbr   first team, @param {string} bAbbr second
 * @param {string} round
 * @param {Object} opts    { planFn: (abbr, ctx, gameState, evidence) => plan }
 * @returns series record {id, round, home, away, games, winner}
 */
function playRunSeries(run, aAbbr, bAbbr, round, opts) {
  const db = run.db, rng = run.rng;
  const [homeAbbr, awayAbbr] = gameHomeCourt(db, aAbbr, bAbbr, round);
  const sctx = makeGameSeries(db, homeAbbr, awayAbbr, round);
  const shifts = rollSeriesShifts(sctx, rng);
  const seriesEdge = gameNormal(rng, 0, GAME_CONFIG.seriesEdgeSigma);
  const sides = {
    [homeAbbr]: { team: sctx.home, opp: sctx.away, key: 'home' },
    [awayAbbr]: { team: sctx.away, opp: sctx.home, key: 'away' },
  };
  // Evidence: each coach tracks BOTH rosters (own form + opponent form).
  const evidence = {
    [homeAbbr]: { own: initCoachEvidence(), opp: initCoachEvidence() },
    [awayAbbr]: { own: initCoachEvidence(), opp: initCoachEvidence() },
  };

  const games = [];
  const score = { home: 0, away: 0 };
  for (let g = 1; g <= 7 && score.home < 4 && score.away < 4; g++) {
    const plans = {};
    [homeAbbr, awayAbbr].forEach(abbr => {
      const st = run.teamState[abbr];
      const { unavailable, drags } = tickInjuryBook(st.injuries);
      const fatigue = { ...st.fatigue };
      Object.entries(drags).forEach(([n, d]) => { fatigue[n] = Math.min(1, (fatigue[n] || 0) + d); });
      // Rust: first game of a round after a short prior series.
      if (g === 1 && st.rusty) {
        sides[abbr].team.players.forEach(p => {
          fatigue[p.name] = Math.min(1, (fatigue[p.name] || 0) + GAME_RUN_CONFIG.rustPenalty);
        });
      }
      const gameState = { unavailable, fatigue };
      const planFn = (opts && opts.planFn && abbr === run.userTeam) ? opts.planFn : null;
      plans[abbr] = planFn
        ? planFn(abbr, sctx, gameState, evidence[abbr])
        : makeCoachPlan(sides[abbr].team, sides[abbr].opp, evidence[abbr].own, evidence[abbr].opp, gameState, rng);
    });

    const game = simulateGameOnce(sctx, g, {
      rng, shifts, seriesEdge,
      seriesScore: { home: score.home, away: score.away },
      homePlan: plans[homeAbbr], awayPlan: plans[awayAbbr],
    });
    games.push(game);
    if (game.winner === homeAbbr) score.home++; else score.away++;

    // Post-game bookkeeping per side: evidence, fatigue, injuries.
    [homeAbbr, awayAbbr].forEach(abbr => {
      const side = sides[abbr], st = run.teamState[abbr];
      st.rusty = false;
      updateCoachEvidence(evidence[abbr].own, game.box[side.key], side.team);
      updateCoachEvidence(evidence[abbr].opp, game.box[side.key === 'home' ? 'away' : 'home'], side.opp);
      game.box[side.key].forEach(row => {
        const gain = Math.max(0, row.min - 32) * GAME_RUN_CONFIG.fatiguePerHeavyMin;
        st.fatigue[row.name] = Math.min(1, (st.fatigue[row.name] || 0) * GAME_RUN_CONFIG.fatigueDecay + gain);
      });
      const rot = plans[abbr].rotation || [];
      sampleGameInjuries(rot, st.fatigue, rng).forEach(ev => {
        st.injuries[ev.name] = { gamesOut: ev.gamesOut, drag: ev.drag, dragGames: ev.dragGames };
        run.injuryLog.push({ round, series: sctx.id, game: g, team: abbr, ...ev });
      });
    });
  }

  const winner = score.home === 4 ? homeAbbr : awayAbbr;
  const loser = winner === homeAbbr ? awayAbbr : homeAbbr;
  // Between rounds: partial fatigue recovery; short series → rust next round.
  [winner, loser].forEach(abbr => {
    const st = run.teamState[abbr];
    Object.keys(st.fatigue).forEach(n => { st.fatigue[n] *= GAME_RUN_CONFIG.fatigueRoundReset; });
  });
  run.teamState[winner].rusty = games.length <= 5;

  const rec = { id: sctx.id, round, home: homeAbbr, away: awayAbbr, winner, games };
  run.series.push(rec);
  return rec;
}

/** Create a run shell. userTeam null = fully CPU (headless mode). */
function createGameRun(db, opts) {
  opts = opts || {};
  const run = {
    db,
    seed: opts.seed == null ? 1 : opts.seed,
    rng: gameCreateRNG(opts.seed == null ? 1 : opts.seed),
    userTeam: opts.userTeam || null,
    teamState: {}, series: [], injuryLog: [],
  };
  Object.keys(db).forEach(abbr => {
    run.teamState[abbr] = { fatigue: {}, injuries: {}, rusty: false };
  });
  return run;
}

/**
 * Play the full bracket. Returns {champion, series, injuryLog}.
 */
function runFullBracket(db, opts) {
  const run = createGameRun(db, opts);
  const confWinners = {};
  ['West', 'East'].forEach(conf => {
    let field = gameBracketR1(db, conf).slice();  // 4 pairs
    const r2 = [];
    field.forEach(pair => r2.push(playRunSeries(run, pair[0], pair[1], 'R1', opts).winner));
    const cf = [
      playRunSeries(run, r2[0], r2[1], 'R2', opts).winner,
      playRunSeries(run, r2[2], r2[3], 'R2', opts).winner,
    ];
    confWinners[conf] = playRunSeries(run, cf[0], cf[1], 'CF', opts).winner;
  });
  const finals = playRunSeries(run, confWinners.West, confWinners.East, 'Finals', opts);
  return { champion: finals.winner, series: run.series, injuryLog: run.injuryLog, run };
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GAME_RUN_CONFIG, gameBracketR1, gameHomeCourt,
    createGameRun, playRunSeries, runFullBracket, computeEquityTable,
  };
}
