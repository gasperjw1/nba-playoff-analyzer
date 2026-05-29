// ============================================================
// GARBAGE-TIME PRA BACKTEST — Phase 73z candidate validation
// ============================================================
// Hypothesis (from user-bet pattern analysis): in BLOWOUT games
// (margin >= 15), bench/role players (rank 5-9 by team rating) get
// garbage-time minutes and accrue MORE PRA than their prior-games
// average. Specifically tested on the LOSING side — the user's
// winning role-player PRA legs (Champagnie, Harper, Keldon) all came
// from teams that LOST by double digits (SAS in WCF G3 + G5), where
// role players soak up garbage minutes.
//
// This is the MIRROR of Phase 73o (winning-side STARTERS get capped):
//   - Phase 73o: blowout → winning starters' minutes/stats DOWN
//   - Phase 73z?: blowout → role players' minutes/stats UP (garbage)
//
// If confirmed, we'd add a "garbage-time role-player boost" factor:
// in projected blowouts, rank 5-9 players get a PRA bump.
//
// Method:
//   1. Walk all settled 2026 games with boxScores.
//   2. Filter to BLOWOUTS (final margin >= 15).
//   3. For each blowout, split players into:
//        - top-5 by rating (starters)
//        - rank 5-9 (role/bench rotation)
//      on BOTH the winning and losing side.
//   4. For each player who appeared in the blowout AND has prior-games
//      data in the same series, compute blowout PRA + minutes vs their
//      prior-games average.
//   5. Aggregate by (side × tier): did role players' PRA/minutes rise?
//
// Output: side × tier ratios + verdict on whether the boost is real
// + whether it's losing-side specific.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const sb = { console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error };
vm.createContext(sb);
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), sb);
['js/data/constants.js', 'js/data/historical.js', 'js/data/news.js',
 'js/data/series-data.js', 'js/data/boxscores.js', 'js/utils.js'].forEach(load);
const { SERIES_DATA } = sb;

function priorAvg(series, playerName, beforeGameIdx, side, statFn) {
  const arr = [];
  for (let i = 0; i < beforeGameIdx; i++) {
    const g = series.games[i];
    if (!g || !g.boxScores) continue;
    const bs = g.boxScores[side];
    if (!Array.isArray(bs)) continue;
    const p = bs.find(x => x && x.name === playerName);
    if (!p || typeof p.min !== 'number' || p.min <= 0) continue;
    arr.push(statFn(p));
  }
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}
const praOf = (p) => (p.pts || 0) + (p.reb || 0) + (p.ast || 0);
const median = (a) => { if (!a.length) return null; const s=[...a].sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; };
const mean = (a) => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;

// Buckets: side (win/loss) × tier (starter/role)
const buckets = {
  'win-starter': [], 'win-role': [],
  'loss-starter': [], 'loss-role': [],
};

SERIES_DATA.forEach(series => {
  if (!series.games || !Array.isArray(series.games)) return;
  series.games.forEach((g, gi) => {
    if (!g || !g.winner || !g.boxScores) return;
    const margin = Math.abs((g.homeScore || 0) - (g.awayScore || 0));
    if (margin < 15) return;  // blowouts only

    const homeAbbr = series.homeTeam.abbr, awayAbbr = series.awayTeam.abbr;
    const winSide = g.winner === homeAbbr ? 'home' : 'away';
    const loseSide = winSide === 'home' ? 'away' : 'home';

    [['win', winSide], ['loss', loseSide]].forEach(([result, side]) => {
      const team = side === 'home' ? series.homeTeam : series.awayTeam;
      // rank players by baseRating
      const ranked = [...team.players]
        .filter(p => p && p.name)
        .sort((a, b) => (b.baseRating || b.rating || 0) - (a.baseRating || a.rating || 0));
      const box = g.boxScores[side] || [];
      ranked.forEach((p, rank) => {
        const bp = box.find(x => x && x.name === p.name);
        if (!bp || typeof bp.min !== 'number' || bp.min <= 0) return;
        const priorPra = priorAvg(series, p.name, gi, side, praOf);
        const priorMin = priorAvg(series, p.name, gi, side, x => x.min || 0);
        if (priorPra == null || priorMin == null || priorPra <= 0 || priorMin <= 0) return;
        const tier = rank < 5 ? 'starter' : 'role';
        const key = `${result}-${tier}`;
        buckets[key].push({
          series: series.id, game: g.num, player: p.name, rank,
          margin, blowoutPra: praOf(bp), priorPra: +priorPra.toFixed(1),
          praRatio: praOf(bp) / priorPra,
          blowoutMin: bp.min, priorMin: +priorMin.toFixed(1),
          minRatio: bp.min / priorMin,
        });
      });
    });
  });
});

console.log('\n=== GARBAGE-TIME PRA BACKTEST — 2026 blowouts (margin >= 15) ===\n');

Object.entries(buckets).forEach(([key, recs]) => {
  if (!recs.length) { console.log(`${key}: no records`); return; }
  const praRatios = recs.map(r => r.praRatio);
  const minRatios = recs.map(r => r.minRatio);
  console.log(`${key.padEnd(14)} n=${recs.length} | median PRA ratio ${(median(praRatios)*100).toFixed(0)}% | mean ${(mean(praRatios)*100).toFixed(0)}% | median MIN ratio ${(median(minRatios)*100).toFixed(0)}%`);
});

// Detail on the key bucket: loss-role (the hypothesized boost)
console.log('\n=== loss-role detail (the hypothesized garbage-PRA boost) ===');
buckets['loss-role'].sort((a,b) => b.praRatio - a.praRatio).forEach(r => {
  console.log(`  ${r.series.padEnd(10)} G${r.game} ${r.player.padEnd(22)} (rank ${r.rank}) | PRA ${r.blowoutPra}/${r.priorPra} (${(r.praRatio*100).toFixed(0)}%) | min ${r.blowoutMin}/${r.priorMin} (${(r.minRatio*100).toFixed(0)}%)`);
});

// Verdict
console.log('\n=== VERDICT ===');
const lr = buckets['loss-role'], wr = buckets['win-role'], ws = buckets['win-starter'];
const lrPraMed = lr.length ? median(lr.map(r => r.praRatio)) : null;
const wsMed = ws.length ? median(ws.map(r => r.praRatio)) : null;

if (lrPraMed != null) {
  if (lrPraMed > 1.10) {
    console.log(`✓ LOSING-SIDE ROLE PLAYERS GET A PRA BOOST in blowouts: median ${(lrPraMed*100).toFixed(0)}% of prior PRA.`);
    console.log(`  → "garbage-time role-player boost" factor is data-supported.`);
  } else if (lrPraMed >= 0.95) {
    console.log(`~ Losing-side role players roughly FLAT in blowouts (${(lrPraMed*100).toFixed(0)}% of prior PRA).`);
    console.log(`  → Boost is NOT clearly present; the user's wins may reflect line looseness, not garbage-time.`);
  } else {
    console.log(`✗ Losing-side role players' PRA DROPS in blowouts (${(lrPraMed*100).toFixed(0)}%).`);
    console.log(`  → Hypothesis rejected — don't code the boost.`);
  }
}
if (wsMed != null) {
  console.log(`\nCross-check (Phase 73o): winning-side STARTERS median PRA ${(wsMed*100).toFixed(0)}% of prior — should be <100% (cap).`);
}
console.log(`\nCAVEAT: blowout sample is small. Only counts players with prior-games boxScore data in the same series.`);
console.log('');
