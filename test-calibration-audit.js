// ============================================================
// CALIBRATION AUDIT — Phase 71 (May 17, 2026)
// ============================================================
// Honest evaluation of the current engine against every resolved
// 2026 playoff game. Separates "did predictions track reality?" from
// "did the bets win money?" — two different questions that we've been
// conflating.
//
// LEVELS:
//   1. GAME LEVEL — predicted margin/winner/total vs actual.
//      Metrics: MAE, RMSE, bias, winner accuracy.
//
//   2. PLAYER LEVEL — predicted pts/reb/ast vs actual box-score line,
//      for every player who logged minutes in resolved games.
//      Metrics: MAE, bias, hit rate at ±X% threshold, by stat + tier.
//
//   3. STRATIFIED — round (R1/R2), game number (G1..G7), series, home
//      vs away. Reveals where the model is good vs broken.
//
// IMPORTANT CAVEAT: this runs the CURRENT engine against PAST games.
// It measures whether today's engine state correctly predicts what
// already happened. It does NOT recreate the engine state at the time
// of each bet (player ratings have been updated since). So it's a
// "would the current model have called this game correctly?" test,
// not a strict retroactive audit. That's fine — what we want to know
// is whether the CURRENT model is fit to make CURRENT predictions.
//
// Run: node test-calibration-audit.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeCtx() {
  const stubDoc = {
    getElementById: () => null,
    addEventListener: () => {},
  };
  const ctx = vm.createContext({
    console, Math, Array, Object, Set, Map, JSON,
    parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
    document: stubDoc, window: { addEventListener: () => {}, location: {} },
    localStorage: { getItem: () => null, setItem: () => {} },
  });
  function load(rel) {
    const code = fs.readFileSync(path.join(__dirname, rel), 'utf8');
    vm.runInContext(code.replace(/^(const|let) /gm, 'var '), ctx);
  }
  load('js/data/constants.js');
  load('js/data/series-data.js');
  load('js/data/boxscores.js');
  load('js/data/historical.js');
  load('js/utils.js');
  load('js/state.js');
  load('js/engine/fatigue.js');
  load('js/engine/chemistry.js');
  load('js/engine/matchups.js');
  load('js/engine/ratings.js');
  load('js/engine/scenarios.js');
  load('js/engine/projections.js');
  load('js/engine/auto-resolve.js');
  return ctx;
}

// ── Stat helpers ────────────────────────────────────────────────────
function mean(arr)  { return arr.length ? arr.reduce((a,b)=>a+b,0) / arr.length : 0; }
function mae(arr)   { return arr.length ? mean(arr.map(Math.abs)) : 0; }
function rmse(arr)  { return arr.length ? Math.sqrt(mean(arr.map(x => x*x))) : 0; }
function bias(arr)  { return mean(arr); }
function pct(n, d)  { return d === 0 ? 0 : +(100 * n / d).toFixed(1); }

// Normalize player names for matching boxscore lines to roster entries.
// Some boxscores use last-name-only ("Cunningham") and rosters use full names.
function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[.'\-]/g, '')
    .replace(/\b(jr|sr|iii|iv|ii)\b/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
function matchPlayer(rosterPlayer, boxName) {
  const r = normName(rosterPlayer.name);
  const b = normName(boxName);
  if (!r.length || !b.length) return false;
  // Full match (any order)
  if (r.join(' ') === b.join(' ')) return true;
  // Last-name match
  if (r[r.length - 1] === b[b.length - 1]) return true;
  // First-token equality (handles "S.Castle" vs "Stephon Castle")
  if (r[0] === b[0] && r.length === 1) return true;
  return false;
}

function main() {
  const ctx = makeCtx();
  const SERIES_DATA = ctx.SERIES_DATA;

  console.log('═══════════════════════════════════════════════════════════');
  console.log('CALIBRATION AUDIT · 2026 NBA PLAYOFFS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Runs the CURRENT engine against every RESOLVED playoff game.');
  console.log('Two levels: game (margin/winner/total) + player (pts/reb/ast).');
  console.log('');

  // ── COLLECT RESOLVED GAMES ─────────────────────────────────────
  const games = [];
  SERIES_DATA.forEach(s => {
    if (!s.games) return;
    s.games.forEach((g, idx) => {
      if (!g || !g.winner || g.homeScore == null || g.awayScore == null) return;
      games.push({
        seriesId: s.id, series: s, game: g, gameNum: idx + 1,
        round: s.round || (s.id === 'NYK-PHI' || s.id === 'SAS-MIN' || s.id === 'DET-CLE' || s.id === 'OKC-LAL' ? 'R2' : 'R1'),
      });
    });
  });

  console.log(`Total resolved playoff games: ${games.length}`);
  const byRound = {};
  games.forEach(x => { byRound[x.round] = (byRound[x.round] || 0) + 1; });
  Object.entries(byRound).forEach(([r, n]) => console.log(`  ${r}: ${n} games`));
  console.log('');

  // ── GAME-LEVEL CALIBRATION ──────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════');
  console.log('LEVEL 1 — GAME PREDICTIONS (margin / winner / total)');
  console.log('═══════════════════════════════════════════════════════════');

  const gameRecords = [];
  games.forEach(({ seriesId, series, game, gameNum, round }) => {
    let proj;
    try { proj = ctx.calcGameProjection(series, seriesId, gameNum); }
    catch (e) { return; }
    if (!proj || proj.homeScore == null) return;

    const actualMargin = game.homeScore - game.awayScore;
    const predMargin = proj.homeScore - proj.awayScore;
    const actualTotal = game.homeScore + game.awayScore;
    const predTotal = proj.homeScore + proj.awayScore;
    const actualHomeWin = game.winner === series.homeTeam.abbr;
    const predHomeWin = predMargin > 0;

    gameRecords.push({
      seriesId, gameNum, round,
      pred: { home: proj.homeScore, away: proj.awayScore, margin: predMargin, total: predTotal },
      actual: { home: game.homeScore, away: game.awayScore, margin: actualMargin, total: actualTotal },
      marginErr: predMargin - actualMargin,
      totalErr: predTotal - actualTotal,
      homeScoreErr: proj.homeScore - game.homeScore,
      awayScoreErr: proj.awayScore - game.awayScore,
      winnerCorrect: actualHomeWin === predHomeWin,
    });
  });

  function summarize(records, label) {
    if (!records.length) return;
    const marginErrs = records.map(r => r.marginErr);
    const totalErrs = records.map(r => r.totalErr);
    const winnerHits = records.filter(r => r.winnerCorrect).length;
    console.log(`\n── ${label} (n=${records.length}) ──`);
    console.log(`  Winner accuracy:      ${pct(winnerHits, records.length)}%  (${winnerHits}/${records.length})`);
    console.log(`  Margin MAE:           ${mae(marginErrs).toFixed(2)}pts`);
    console.log(`  Margin RMSE:          ${rmse(marginErrs).toFixed(2)}pts`);
    console.log(`  Margin bias:          ${bias(marginErrs).toFixed(2)}pts  ${bias(marginErrs) > 1 ? '(home over-predicted)' : bias(marginErrs) < -1 ? '(home under-predicted)' : '(neutral)'}`);
    console.log(`  Total MAE:            ${mae(totalErrs).toFixed(2)}pts`);
    console.log(`  Total bias:           ${bias(totalErrs).toFixed(2)}pts  ${bias(totalErrs) > 2 ? '(too high)' : bias(totalErrs) < -2 ? '(too low)' : '(neutral)'}`);
    // |error| > 10 = bad miss; |error| > 20 = catastrophic
    const bigMiss = records.filter(r => Math.abs(r.marginErr) > 10).length;
    const catMiss = records.filter(r => Math.abs(r.marginErr) > 20).length;
    console.log(`  Big misses (>10pt):   ${bigMiss}/${records.length} (${pct(bigMiss, records.length)}%)`);
    console.log(`  Catastrophic (>20pt): ${catMiss}/${records.length} (${pct(catMiss, records.length)}%)`);
  }

  summarize(gameRecords, 'OVERALL');
  summarize(gameRecords.filter(r => r.round === 'R1'), 'ROUND 1');
  summarize(gameRecords.filter(r => r.round === 'R2'), 'ROUND 2');

  // Per-game-number stratification (G1, G2, ..., G7)
  console.log('\n── By game number (does later-in-series degrade?) ──');
  console.log('GN | n  | Winner % | Margin MAE | Margin bias');
  console.log('---|----|----------|------------|------------');
  for (let gn = 1; gn <= 7; gn++) {
    const r = gameRecords.filter(x => x.gameNum === gn);
    if (!r.length) continue;
    const winners = r.filter(x => x.winnerCorrect).length;
    const marginErrs = r.map(x => x.marginErr);
    console.log(`G${gn} | ${String(r.length).padEnd(2)} | ${(pct(winners, r.length)+'%').padEnd(7)} | ${mae(marginErrs).toFixed(2).padStart(10)} | ${bias(marginErrs).toFixed(2).padStart(11)}`);
  }

  // Worst single-game predictions
  console.log('\n── WORST MARGIN PREDICTIONS ──');
  const sortedByMiss = [...gameRecords].sort((a,b) => Math.abs(b.marginErr) - Math.abs(a.marginErr));
  sortedByMiss.slice(0, 8).forEach(r => {
    const pp = r.pred, ac = r.actual;
    console.log(`  ${r.seriesId} G${r.gameNum} (${r.round}): predicted ${pp.home}-${pp.away} (margin ${pp.margin}), actual ${ac.home}-${ac.away} (margin ${ac.margin}). Error ${r.marginErr > 0 ? '+' : ''}${r.marginErr}pt.`);
  });

  // ── LEVEL 2: PLAYER-PROP CALIBRATION ─────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('LEVEL 2 — PLAYER PROJECTIONS (pts / reb / ast)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('For every player who logged minutes in a resolved game, compare');
  console.log('calcExpectedPlayerStats() to actual box-score line.\n');

  const playerRecords = [];
  let attempted = 0, matched = 0, unmatched = 0;
  games.forEach(({ seriesId, series, game, gameNum, round }) => {
    if (!game.boxScores) return;
    const gameIdx = gameNum - 1;

    // For each side, walk roster + boxscore, compute expected vs actual.
    function processSide(rosterPlayers, boxPlayers, side) {
      if (!Array.isArray(rosterPlayers) || !Array.isArray(boxPlayers)) return;
      rosterPlayers.forEach(p => {
        if ((p.rating || 0) === 0) return;     // injured/excluded
        attempted++;
        const box = boxPlayers.find(b => matchPlayer(p, b.name));
        if (!box) { unmatched++; return; }
        // Compute expected stats from CURRENT engine
        let exp;
        try { exp = ctx.calcExpectedPlayerStats(p, series, gameIdx, side); }
        catch (e) { return; }
        if (!exp) return;
        matched++;
        const tier = p.rating >= 85 ? 'elite' : p.rating >= 75 ? 'starter' : p.rating >= 65 ? 'rotation' : 'bench';
        // Convert box "fgm-fga" → not needed; use direct stat fields where available.
        // boxscores have: pts, reb, ast, stl, blk, tpm (threes for some), to
        const actualPts = Number(box.pts) || 0;
        const actualReb = Number(box.reb) || 0;
        const actualAst = Number(box.ast) || 0;
        const actualThrees = Number(box.tpm) || 0;
        const actualStl = Number(box.stl) || 0;
        const actualBlk = Number(box.blk) || 0;
        const actualMin = Number(box.min) || 0;

        playerRecords.push({
          seriesId, gameNum, round, side, player: p.name, tier, rating: p.rating,
          actualMin,
          pts: { pred: exp.pts || 0, actual: actualPts, err: (exp.pts || 0) - actualPts },
          reb: { pred: exp.reb || 0, actual: actualReb, err: (exp.reb || 0) - actualReb },
          ast: { pred: exp.ast || 0, actual: actualAst, err: (exp.ast || 0) - actualAst },
          threes: { pred: exp.threes || 0, actual: actualThrees, err: (exp.threes || 0) - actualThrees },
          stl: { pred: exp.stl || 0, actual: actualStl, err: (exp.stl || 0) - actualStl },
          blk: { pred: exp.blk || 0, actual: actualBlk, err: (exp.blk || 0) - actualBlk },
          dnp: actualMin < 5,
        });
      });
    }
    processSide(series.homeTeam.players, game.boxScores.home, 'home');
    processSide(series.awayTeam.players, game.boxScores.away, 'away');
  });

  console.log(`Player-game records: ${matched} matched, ${unmatched} unmatched roster entries / ${attempted} attempted.`);
  // Drop DNPs from prop analysis — no prop bet exists on a non-player
  const propRecords = playerRecords.filter(r => !r.dnp);
  console.log(`Excluding DNPs (< 5 min): ${propRecords.length} player-games.\n`);

  function reportStat(records, statKey) {
    const errs = records.map(r => r[statKey].err);
    const meanPred = mean(records.map(r => r[statKey].pred));
    const meanActual = mean(records.map(r => r[statKey].actual));
    return {
      n: records.length,
      meanPred: +meanPred.toFixed(2),
      meanActual: +meanActual.toFixed(2),
      mae: +mae(errs).toFixed(2),
      rmse: +rmse(errs).toFixed(2),
      bias: +bias(errs).toFixed(2),
      // % of predictions within ±3 units (a "close" pred for pts; reb/ast use ±2)
      withinTol: pct(errs.filter(e => Math.abs(e) <= (statKey === 'pts' ? 5 : 2)).length, records.length),
    };
  }

  function reportLine(label, r) {
    if (!r || !r.n) return;
    const biasStr = r.bias >= 0 ? '+' + r.bias.toFixed(2) : r.bias.toFixed(2);
    console.log(`  ${label.padEnd(25)} n=${String(r.n).padStart(4)} | pred ${r.meanPred.toFixed(1).padStart(5)} vs actual ${r.meanActual.toFixed(1).padStart(5)} | MAE ${r.mae.toFixed(2).padStart(5)} | bias ${biasStr.padStart(7)} | within tol ${r.withinTol}%`);
  }

  console.log('── OVERALL PROP CALIBRATION (excluding DNPs) ──');
  ['pts', 'reb', 'ast', 'threes', 'stl', 'blk'].forEach(stat => {
    reportLine(stat.toUpperCase(), reportStat(propRecords, stat));
  });

  console.log('\n── BY TIER (elite=85+, starter=75-84, rotation=65-74) ──');
  ['elite', 'starter', 'rotation', 'bench'].forEach(tier => {
    const tr = propRecords.filter(r => r.tier === tier);
    if (!tr.length) return;
    console.log(`\n  ${tier.toUpperCase()} (n=${tr.length}):`);
    ['pts', 'reb', 'ast', 'threes'].forEach(stat => {
      reportLine(stat, reportStat(tr, stat));
    });
  });

  console.log('\n── BY ROUND ──');
  ['R1', 'R2'].forEach(rnd => {
    const rr = propRecords.filter(r => r.round === rnd);
    if (!rr.length) return;
    console.log(`\n  ${rnd} (n=${rr.length}):`);
    ['pts', 'reb', 'ast'].forEach(stat => {
      reportLine(stat, reportStat(rr, stat));
    });
  });

  // ── BIAS HEATMAP: top 10 over/under-predicted players ──
  console.log('\n── BIAS BY PLAYER (where the model is systematically wrong) ──');
  console.log('Top 10 PTS over-predicted (model says more than actual):');
  const byPlayer = {};
  propRecords.forEach(r => {
    if (!byPlayer[r.player]) byPlayer[r.player] = { player: r.player, tier: r.tier, n: 0, pts: [], reb: [], ast: [] };
    byPlayer[r.player].n++;
    byPlayer[r.player].pts.push(r.pts.err);
    byPlayer[r.player].reb.push(r.reb.err);
    byPlayer[r.player].ast.push(r.ast.err);
  });
  const playerSummaries = Object.values(byPlayer)
    .filter(p => p.n >= 4)  // need at least 4 games to call it a pattern
    .map(p => ({
      player: p.player, tier: p.tier, n: p.n,
      ptsBias: +bias(p.pts).toFixed(2),
      rebBias: +bias(p.reb).toFixed(2),
      astBias: +bias(p.ast).toFixed(2),
      ptsMae: +mae(p.pts).toFixed(2),
    }));

  playerSummaries.sort((a, b) => b.ptsBias - a.ptsBias);
  playerSummaries.slice(0, 10).forEach(p => {
    console.log(`  ${p.player.padEnd(28)} n=${p.n}  PTS bias ${p.ptsBias > 0 ? '+' : ''}${p.ptsBias}pp  (MAE ${p.ptsMae})  REB ${p.rebBias > 0 ? '+' : ''}${p.rebBias}  AST ${p.astBias > 0 ? '+' : ''}${p.astBias}`);
  });

  console.log('\nTop 10 PTS under-predicted (model says less than actual):');
  playerSummaries.sort((a, b) => a.ptsBias - b.ptsBias);
  playerSummaries.slice(0, 10).forEach(p => {
    console.log(`  ${p.player.padEnd(28)} n=${p.n}  PTS bias ${p.ptsBias > 0 ? '+' : ''}${p.ptsBias}pp  (MAE ${p.ptsMae})  REB ${p.rebBias > 0 ? '+' : ''}${p.rebBias}  AST ${p.astBias > 0 ? '+' : ''}${p.astBias}`);
  });

  // ── Hit-rate at a typical alt-line offset (5 pts low of mean prediction) ──
  console.log('\n── PROP HIT RATE AT "ALT-LINE-DEPTH" (line = prediction - 5pts) ──');
  console.log('Simulates a typical floor prop where the line is 5pts below our projection.');
  console.log('A well-calibrated model should clear this line ~70% of the time.');
  const altLineHit = propRecords.filter(r => r.actualMin >= 15 && r.pts.pred >= 10);
  const hits5pts = altLineHit.filter(r => r.pts.actual >= (r.pts.pred - 5)).length;
  console.log(`  PTS line 5pts below projection (n=${altLineHit.length}): ${pct(hits5pts, altLineHit.length)}% cleared`);
  const altReb = propRecords.filter(r => r.actualMin >= 15 && r.reb.pred >= 4);
  const rebHits = altReb.filter(r => r.reb.actual >= (r.reb.pred - 2)).length;
  console.log(`  REB line 2pts below projection (n=${altReb.length}): ${pct(rebHits, altReb.length)}% cleared`);
  const altAst = propRecords.filter(r => r.actualMin >= 15 && r.ast.pred >= 3);
  const astHits = altAst.filter(r => r.ast.actual >= (r.ast.pred - 2)).length;
  console.log(`  AST line 2pts below projection (n=${altAst.length}): ${pct(astHits, altAst.length)}% cleared`);

  // ── DNP / minutes prediction quality ──
  console.log('\n── MINUTES / DNP CALIBRATION ──');
  const allRecords = playerRecords;
  const actualDNPs = allRecords.filter(r => r.dnp).length;
  console.log(`  Actual DNPs (≤5 min): ${actualDNPs}/${allRecords.length} player-games (${pct(actualDNPs, allRecords.length)}%)`);
  console.log(`  Engine doesn't currently predict DNPs — every rated player is included in the projection.`);
  console.log(`  This is a known gap: DNPs from blowouts, injuries, and rotation cuts aren't modeled.`);

  // ── Final verdict ───────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('AUDIT VERDICT');
  console.log('═══════════════════════════════════════════════════════════');
  const overall = {
    winnerAcc: pct(gameRecords.filter(r => r.winnerCorrect).length, gameRecords.length),
    marginMae: +mae(gameRecords.map(r => r.marginErr)).toFixed(2),
    marginBias: +bias(gameRecords.map(r => r.marginErr)).toFixed(2),
    ptsMae: +mae(propRecords.map(r => r.pts.err)).toFixed(2),
    ptsBias: +bias(propRecords.map(r => r.pts.err)).toFixed(2),
  };
  console.log(`GAME LEVEL: ${overall.winnerAcc}% winner accuracy, ${overall.marginMae}pt margin MAE, ${overall.marginBias > 0 ? '+' : ''}${overall.marginBias}pt bias`);
  console.log(`PROP LEVEL: ${overall.ptsMae}pt PTS MAE, ${overall.ptsBias > 0 ? '+' : ''}${overall.ptsBias}pt PTS bias`);
  console.log('');
  console.log('Reference points:');
  console.log('  Vegas margin MAE in playoffs: ~9pt. Our model:', overall.marginMae + 'pt');
  console.log('  Vegas winner accuracy:        ~67%.  Our model:', overall.winnerAcc + '%');
  console.log('  A "good" prop projection has PTS MAE around 5-6pts. Our model:', overall.ptsMae + 'pt');
}

main();
