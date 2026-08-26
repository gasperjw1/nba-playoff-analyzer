// ============================================================
// PLAYOFF RUN — GAME REGRESSION SUITE
// ============================================================
// Run: node test-game.js
// Mirrors the test-projections.js vm loader. Covers the game namespace
// only — the NBA analyzer suite (test-projections.js) is separate and
// must stay green independently (additive-namespace rule).
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON,
  parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
});
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx, { filename: rel });

// Analyzer data the game derives from (read-only)
load('js/data/constants.js');
load('js/data/series-data.js');
// Game namespace, in dependency order
load('js/game/data/game-constants.js');
load('js/game/data/coach-profiles.js');
load('js/game/data/team-db.js');
load('js/game/engine/matchup-factory.js');
load('js/game/engine/capacity.js');
load('js/game/engine/regime.js');
load('js/game/engine/trajectory.js');
load('js/game/engine/coach-ai.js');
load('js/game/engine/game-sim.js');
load('js/game/engine/injury-gen.js');
load('js/game/run-state.js');
load('js/game/ui/game-ui.js');

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.log('  FAIL: ' + msg); }
}
const T = (name) => console.log('\nTEST ' + name);

const DB = ctx.GAME_TEAM_DB;
const TEAMS = Object.keys(DB);

// ════════════════════════════════════════════════════════════
T('1: TEAM_DB — 16 teams, complete schema');
assert(TEAMS.length === 16, 'expected 16 teams, got ' + TEAMS.length);
TEAMS.forEach(abbr => {
  const t = DB[abbr];
  assert(t.players.length >= 9, abbr + ' has >=9 players (' + t.players.length + ')');
  assert(t.coach && t.coach.coach, abbr + ' has a coach profile');
  assert(t.advStats && t.advStats.ortg > 100 && t.advStats.pace > 90, abbr + ' has advStats');
  assert(typeof t.offsetO === 'number' && typeof t.offsetD === 'number', abbr + ' has calibration offsets');
  assert(['West', 'East'].includes(t.conf), abbr + ' has conference');
  assert(t.seed >= 1 && t.seed <= 8, abbr + ' has seed');
  t.players.forEach(p => {
    assert(typeof p.baseRating === 'number', abbr + '/' + p.name + ' baseRating');
    assert(['star', 'mid', 'role'].includes(p.tier), abbr + '/' + p.name + ' tier');
    assert(typeof p.oLebron === 'number' && !isNaN(p.oLebron), abbr + '/' + p.name + ' oLebron numeric');
    assert(typeof p.dLebron === 'number' && !isNaN(p.dLebron), abbr + '/' + p.name + ' dLebron numeric');
  });
});
// Memory-anchored fact: NYK coach is Mike Brown.
assert(DB.NYK.coach.coach === 'Mike Brown', 'NYK coach is Mike Brown');

// ════════════════════════════════════════════════════════════
T('2: TEAM_DB — bracket derivable from seeds');
['West', 'East'].forEach(conf => {
  const seeds = TEAMS.filter(a => DB[a].conf === conf).map(a => DB[a].seed).sort((x, y) => x - y);
  assert(JSON.stringify(seeds) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]),
    conf + ' has exactly seeds 1-8 (' + seeds + ')');
});

// ════════════════════════════════════════════════════════════
T('3: Default rotation — 240 minutes, rating-ordered, depth-respected');
TEAMS.forEach(abbr => {
  const t = DB[abbr];
  const avail = t.players.filter(p => p.initialStatus === 'available' && p.baseRating > 0);
  const rot = ctx.gameDefaultRotation(avail, t.coach.rotationDepth);
  const total = rot.reduce((a, r) => a + r.minutes, 0);
  assert(Math.abs(total - 240) < 0.01, abbr + ' rotation sums to 240 (' + total.toFixed(1) + ')');
  const withMin = rot.filter(r => r.minutes > 0);
  assert(withMin.length <= t.coach.rotationDepth, abbr + ' respects rotationDepth');
  const top = rot.reduce((a, b) => (b.minutes > a.minutes ? b : a));
  const best = avail.reduce((a, b) => (b.baseRating > a.baseRating ? b : a));
  assert(top.player.baseRating >= best.baseRating - 5, abbr + ' top minutes go to a top player');
});

// ════════════════════════════════════════════════════════════
T('4: Role fit — native zero, families sane');
assert(ctx.gameRoleFitCost('Shot Creator', 'Shot Creator', ctx.GAME_OFF_ROLE_FAMILY) === 0, 'native role = 0 cost');
assert(ctx.gameRoleFitCost('Shot Creator', 'Primary Ball Handler', ctx.GAME_OFF_ROLE_FAMILY) === 0.15, 'same family = 0.15');
assert(ctx.gameRoleFitCost('Stationary Shooter', 'Roll + Cut Big', ctx.GAME_OFF_ROLE_FAMILY) === 0.60, 'shooter->big = 0.60');
assert(ctx.gameRoleFitCost('Point of Attack', 'Anchor Big', ctx.GAME_DEF_ROLE_FAMILY) === 0.60, 'PoA->Anchor = 0.60');
// Every labeled role in the data maps to a family (no orphan roles).
TEAMS.forEach(abbr => DB[abbr].players.forEach(p => {
  if (p.offRole) assert(ctx.GAME_OFF_ROLE_FAMILY[p.offRole], 'off role mapped: ' + p.offRole);
  if (p.defRole) assert(ctx.GAME_DEF_ROLE_FAMILY[p.defRole], 'def role mapped: ' + p.defRole);
}));

// ════════════════════════════════════════════════════════════
T('5: Matchup factory — all 120 pairings build; assignments derived');
let built = 0;
for (let i = 0; i < TEAMS.length; i++) {
  for (let j = 0; j < TEAMS.length; j++) {
    if (i === j) continue;
    const s = ctx.makeGameSeries(DB, TEAMS[i], TEAMS[j], 'R2');
    if (s && s.defAssignments.homeOnAway && s.defAssignments.awayOnHome) built++;
  }
}
assert(built === 240, 'all 240 ordered pairings build with assignments (' + built + ')');

// ════════════════════════════════════════════════════════════
T('6: Factory calibration — derived assignments vs hand-authored R1 defMatchups');
// The 8 R1 series carry hand-authored defMatchups. The derived TARGET
// (opponent's primary initiator) should agree with the hand-authored one
// in the large majority of cases; defender agreement is looser (hand
// choices weighed scheme fit, not just dLEBRON).
let targetHits = 0, targetTotal = 0;
ctx.SERIES_DATA.forEach(s => {
  if ((s.round || 'R1') !== 'R1' || !s.defMatchups) return;
  const g = ctx.makeGameSeries(DB, s.homeTeam.abbr, s.awayTeam.abbr, 'R1');
  const lastName = n => (n || '').split(' ').pop();
  [['homeDefOnAway', 'homeOnAway'], ['awayDefOnHome', 'awayOnHome']].forEach(([handKey, derivedKey]) => {
    const hand = s.defMatchups[handKey], derived = g.defAssignments[derivedKey];
    if (!hand || !derived) return;
    targetTotal++;
    if (lastName(hand.target) === lastName(derived.target)) targetHits++;
  });
});
assert(targetTotal >= 12, 'calibration sample has >=12 hand-authored assignments (' + targetTotal + ')');
assert(targetHits / targetTotal >= 0.6, 'derived target matches hand-authored >=60% (' +
  targetHits + '/' + targetTotal + ')');
console.log('  (info) target agreement: ' + targetHits + '/' + targetTotal);

// ════════════════════════════════════════════════════════════
T('7: Venue + HCA — 2-2-1-1-1, G7 override, fortress');
assert([1, 2, 5, 7].every(ctx.gameVenueIsHome) && ![3, 4, 6].some(ctx.gameVenueIsHome), '2-2-1-1-1 venue map');
const sasNyk = ctx.makeGameSeries(DB, 'SAS', 'NYK', 'Finals');
assert(ctx.gameHcaForGame(sasNyk, 1, { home: 0, away: 0 }) === 1, 'Finals HCA base 1');
const denMin = ctx.makeGameSeries(DB, 'DEN', 'MIN', 'R1');
assert(ctx.gameHcaForGame(denMin, 3, { home: 2, away: 0 }) === 3 + ctx.GAME_CONFIG.fortressBonus,
  'MIN fortress bonus applies when MIN hosts G3');
assert(ctx.gameHcaForGame(denMin, 7, { home: 3, away: 3 }) === 2.5, 'G7 override at DEN (no fortress)');

// ════════════════════════════════════════════════════════════
// Phase 1 blocks (capacity / regime / trajectory / game-sim)
// ════════════════════════════════════════════════════════════

T('8: Capacity — full-strength fidelity (self-calibration)');
TEAMS.forEach(abbr => {
  const cap = ctx.computeTeamCapacity(DB[abbr], {});
  assert(Math.abs(cap.ortg - DB[abbr].advStats.ortg) < 0.5,
    abbr + ' full-strength ORtg reproduces advStats (' + cap.ortg.toFixed(1) + ' vs ' + DB[abbr].advStats.ortg + ')');
  assert(Math.abs(cap.drtg - DB[abbr].advStats.drtg) < 0.5,
    abbr + ' full-strength DRtg reproduces advStats (' + cap.drtg.toFixed(1) + ' vs ' + DB[abbr].advStats.drtg + ')');
  assert(cap.playerShares.length > 0 && Math.abs(cap.playerShares.reduce((a, s) => a + s.ptsShare, 0) - 1) < 1e-6,
    abbr + ' pts shares sum to 1');
});

T('9: Capacity — roster sensitivity (the LAL test)');
{
  const lal = DB.LAL;
  const full = ctx.computeTeamCapacity(lal, {});
  const gutted = ctx.computeTeamCapacity(lal, { unavailable: ['LeBron James', 'Luka Doncic', 'Austin Reaves'] });
  assert(gutted.ortg < full.ortg - 4, 'LAL minus 3 stars loses >4 ORtg (' + full.ortg.toFixed(1) + ' -> ' + gutted.ortg.toFixed(1) + ')');
  const okc = ctx.computeTeamCapacity(DB.OKC, {});
  const guttedScore = ctx.expectedGameScores(ctx.makeGameSeries(DB, 'OKC', 'LAL', 'R2'), okc, gutted, 1).away;
  assert(guttedScore < 103, 'gutted LAL projects sub-103 vs OKC (' + guttedScore.toFixed(1) + ')');
  // Removing a bench body must hurt less than removing the best player
  const noBench = ctx.computeTeamCapacity(lal, { unavailable: ['Bronny James'] });
  const noStar = ctx.computeTeamCapacity(lal, { unavailable: ['LeBron James'] });
  assert(noBench.ortg > noStar.ortg, 'losing LeBron hurts more than losing Bronny');
}

T('10: Capacity — miscast roles are penalized');
{
  const nyk = DB.NYK;
  const base = ctx.computeTeamCapacity(nyk, {});
  const roles = {};
  nyk.players.filter(p => p.initialStatus === 'available' && p.tier !== 'star').slice(0, 3)
    .forEach(p => { roles[p.name] = { offRole: 'Roll + Cut Big', defRole: 'Anchor Big' }; });
  const miscast = ctx.computeTeamCapacity(nyk, { roleAssignments: roles });
  assert(miscast.ortg < base.ortg, 'miscasting reduces ORtg (' + base.ortg.toFixed(1) + ' -> ' + miscast.ortg.toFixed(1) + ')');
}

T('10b: Minutes physics — 42-min cap + overload penalty (solver-audit fix)');
{
  const okc = DB.OKC;
  const star = okc.players.reduce((a, b) => (b.baseRating > a.baseRating ? b : a));
  const others = okc.players.filter(p => p !== star && p.initialStatus === 'available' && p.baseRating > 0).slice(0, 6);
  const greedy = [{ player: star, minutes: 48 }, ...others.map(p => ({ player: p, minutes: 32 }))];
  const cap = ctx.computeTeamCapacity(okc, { rotation: greedy });
  const starRow = cap.playerShares.find(s => s.player.name === star.name);
  assert(starRow.minutes <= ctx.GAME_CONFIG.maxPlayerMinutes + 0.01,
    'star minutes capped at ' + ctx.GAME_CONFIG.maxPlayerMinutes + ' (' + starRow.minutes.toFixed(1) + ')');
  assert(Math.abs(cap.playerShares.reduce((a, s) => a + s.minutes, 0) - 240) < 0.5, 'still 240 total');
  assert(ctx.gameOverloadMult(30) === 1 && ctx.gameOverloadMult(40) < 1, 'overload penalty above threshold only');
}

T('11: Determinism — same seed, identical outcome');
{
  const s = ctx.makeGameSeries(DB, 'OKC', 'SAS', 'CF');
  const g1 = ctx.simulateGameOnce(s, 1, { seed: 4417 });
  const g2 = ctx.simulateGameOnce(s, 1, { seed: 4417 });
  const g3 = ctx.simulateGameOnce(s, 1, { seed: 4418 });
  assert(g1.homeScore === g2.homeScore && g1.awayScore === g2.awayScore, 'same seed → same score');
  assert(JSON.stringify(g1.box.home) === JSON.stringify(g2.box.home), 'same seed → same box score');
  assert(g1.homeScore !== g3.homeScore || g1.awayScore !== g3.awayScore, 'different seed → different game');
}

T('12: Game invariants — scores, quarters, box coherence');
{
  const s = ctx.makeGameSeries(DB, 'DET', 'ORL', 'R1');
  for (let seed = 1; seed <= 40; seed++) {
    const g = ctx.simulateGameOnce(s, 1 + (seed % 7), { seed });
    assert(g.homeScore !== g.awayScore, 'no ties (seed ' + seed + ')');
    assert(g.homeScore >= 60 && g.homeScore <= 175 && g.awayScore >= 60 && g.awayScore <= 175,
      'scores in sane range (seed ' + seed + ': ' + g.homeScore + '-' + g.awayScore + ')');
    const qh = g.quarters.reduce((a, q) => a + q.home, 0);
    const qa = g.quarters.reduce((a, q) => a + q.away, 0);
    assert(qh === g.homeScore && qa === g.awayScore, 'quarters sum to final (seed ' + seed + ')');
    assert(g.quarters.length === 4 + (g.ot || 0), 'quarter count matches OT (seed ' + seed + ')');
    ['home', 'away'].forEach(side => {
      const box = g.box[side];
      const pts = box.reduce((a, p) => a + p.pts, 0);
      assert(pts === (side === 'home' ? g.homeScore : g.awayScore), side + ' box pts sum to team score (seed ' + seed + ')');
      box.forEach(p => assert(p.pts >= 0 && p.reb >= 0 && p.ast >= 0 && p.min >= 0, 'non-negative lines'));
    });
  }
}

T('13: Series invariants — first to 4, venue alternation, shifts persist');
{
  const s = ctx.makeGameSeries(DB, 'BOS', 'PHI', 'R1');
  for (let seed = 100; seed < 110; seed++) {
    const ser = ctx.simulateSeriesOnce(s, { seed });
    const wins = { home: 0, away: 0 };
    ser.games.forEach(g => wins[g.winner === s.home.abbr ? 'home' : 'away']++);
    assert(Math.max(wins.home, wins.away) === 4, 'winner has exactly 4 (seed ' + seed + ')');
    assert(Math.min(wins.home, wins.away) <= 3, 'loser has <=3');
    assert(ser.games.length >= 4 && ser.games.length <= 7, 'series length 4-7');
    assert(ser.winner === (wins.home === 4 ? s.home.abbr : s.away.abbr), 'winner field consistent');
  }
}

// ════════════════════════════════════════════════════════════
// Phase 2 blocks (injuries / coach AI / run structure)
// ════════════════════════════════════════════════════════════

T('14: Injury hazard — realistic run-level rates, book mechanics');
{
  // A full 4-round run ≈ 20 team-games; expect ~1-3 meaningful events.
  const rng = ctx.gameCreateRNG(777);
  const team = DB.OKC;
  const rot = ctx.gameDefaultRotation(
    team.players.filter(p => p.initialStatus === 'available' && p.baseRating > 0),
    team.coach.rotationDepth);
  let events = 0;
  const RUNS = 400, GAMES = 20;
  for (let r = 0; r < RUNS; r++) {
    for (let g = 0; g < GAMES; g++) events += ctx.sampleGameInjuries(rot, {}, rng).length;
  }
  const perRun = events / RUNS;
  assert(perRun >= 0.8 && perRun <= 3.2, 'injuries per 20-game run in [0.8, 3.2] (' + perRun.toFixed(2) + ')');
  // Fatigue raises hazard
  const fat = {}; rot.forEach(r => { fat[r.player.name] = 0.8; });
  let fatEvents = 0;
  for (let r = 0; r < RUNS; r++) {
    for (let g = 0; g < GAMES; g++) fatEvents += ctx.sampleGameInjuries(rot, fat, rng).length;
  }
  assert(fatEvents > events * 1.2, 'fatigue raises hazard (' + events + ' -> ' + fatEvents + ')');
  // Book mechanics: peek is pure; advance moves time forward
  const book = { X: { gamesOut: 1, drag: 0.3, dragGames: 1 } };
  let t1 = ctx.peekInjuryBook(book);
  assert(t1.unavailable.includes('X'), 'game 1: out');
  assert(JSON.stringify(ctx.peekInjuryBook(book)) === JSON.stringify(t1), 'peek is pure (no mutation)');
  ctx.advanceInjuryBook(book);
  t1 = ctx.peekInjuryBook(book);
  assert(!t1.unavailable.includes('X') && t1.drags.X === 0.3, 'game 2: plays with drag');
  ctx.advanceInjuryBook(book);
  t1 = ctx.peekInjuryBook(book);
  assert(!t1.unavailable.includes('X') && !t1.drags.X, 'game 3: clear view');
  ctx.advanceInjuryBook(book);
  assert(!book.X, 'book entry removed after drag expires');
}

T('15: Coach AI — evidence asymmetry (duds > spikes), bait resistance scales with adjust');
{
  const nyk = DB.NYK, okc = DB.OKC;
  const star = okc.players.reduce((a, b) => (b.ppg > a.ppg ? b : a));
  const mkBox = ratio => [{ name: star.name, pts: Math.round(star.ppg * ratio), min: 36 }];
  // One spike vs one dud of equal magnitude: the dud must move the
  // asymmetric estimate FURTHER from 1 (measured: duds 2x stickier).
  const evSpike = ctx.initCoachEvidence(), evDud = ctx.initCoachEvidence();
  ctx.updateCoachEvidence(evSpike, mkBox(1.5), okc);
  ctx.updateCoachEvidence(evDud, mkBox(0.5), okc);
  const upMove = Math.abs(ctx.coachShiftBelief(evSpike, star.name, 10) - 1);
  const downMove = Math.abs(ctx.coachShiftBelief(evDud, star.name, 10) - 1);
  assert(downMove > upMove * 1.5, 'dud moves belief >1.5x more than equal spike (' +
    downMove.toFixed(3) + ' vs ' + upMove.toFixed(3) + ')');
  // Bait resistance: after spike-then-normal games, the low-adjust coach
  // (recency-weighted) believes the spike more than the high-adjust coach.
  const ev2 = ctx.initCoachEvidence();
  ctx.updateCoachEvidence(ev2, mkBox(1.6), okc);
  const naive = ctx.coachShiftBelief(ev2, star.name, 2);
  const sharp = ctx.coachShiftBelief(ev2, star.name, 10);
  assert(naive > sharp, 'low-adjust coach buys the one-game spike more (' +
    naive.toFixed(3) + ' vs ' + sharp.toFixed(3) + ')');
  // Plan validity: 240 minutes, only available players
  const rng = ctx.gameCreateRNG(5);
  const plan = ctx.makeCoachPlan(nyk, okc, ctx.initCoachEvidence(), ev2, { unavailable: [], fatigue: {} }, rng);
  const tot = plan.rotation.reduce((a, r) => a + r.minutes, 0);
  assert(Math.abs(tot - 240) < 1, 'coach plan minutes ~240 (' + tot.toFixed(1) + ')');
}

T('16: Double coverage — suppresses target, punished vs multi-initiator');
{
  const sctx = ctx.makeGameSeries(DB, 'DET', 'BOS', 'R2');   // DET 1 initiator, BOS 3
  const capDET = ctx.computeTeamCapacity(DB.DET, {});
  const capBOS = ctx.computeTeamCapacity(DB.BOS, {});
  const detStar = capDET.playerShares.reduce((a, b) => (b.ptsShare > a.ptsShare ? b : a));
  const doubledDET = ctx.applyDoubleCoverage(capDET, detStar.player.name, DB.DET.initiators);
  const newStar = doubledDET.playerShares.find(s => s.player.name === detStar.player.name);
  assert(newStar.ptsShare < detStar.ptsShare, 'doubled star share drops');
  assert(Math.abs(doubledDET.playerShares.reduce((a, s) => a + s.ptsShare, 0) - 1) < 1e-6, 'shares renormalized');
  assert(doubledDET.ortg < capDET.ortg, 'doubling a 1-initiator offense reduces its ORtg');
  const bosStar = capBOS.playerShares.reduce((a, b) => (b.ptsShare > a.ptsShare ? b : a));
  const doubledBOS = ctx.applyDoubleCoverage(capBOS, bosStar.player.name, DB.BOS.initiators);
  assert(doubledBOS.ortg > capBOS.ortg, 'doubling a 3-initiator offense gets punished');
}

T('17: Full bracket — completes, deterministic, structurally valid');
{
  const res1 = ctx.runFullBracket(DB, { seed: 42 });
  const res2 = ctx.runFullBracket(DB, { seed: 42 });
  assert(res1.series.length === 15, 'exactly 15 series (' + res1.series.length + ')');
  assert(TEAMS.includes(res1.champion), 'champion is a real team (' + res1.champion + ')');
  assert(res1.champion === res2.champion &&
    JSON.stringify(res1.series.map(s => s.winner)) === JSON.stringify(res2.series.map(s => s.winner)),
    'same seed → identical bracket');
  const rounds = res1.series.map(s => s.round);
  assert(rounds.filter(r => r === 'R1').length === 8 && rounds.filter(r => r === 'R2').length === 4 &&
    rounds.filter(r => r === 'CF').length === 2 && rounds.filter(r => r === 'Finals').length === 1,
    'round structure 8/4/2/1');
  // Winners advance: every R2 participant won in R1, etc.
  const wonR1 = new Set(res1.series.filter(s => s.round === 'R1').map(s => s.winner));
  res1.series.filter(s => s.round === 'R2').forEach(s => {
    assert(wonR1.has(s.home) && wonR1.has(s.away), 'R2 participants won R1 (' + s.id + ')');
  });
  const finals = res1.series.find(s => s.round === 'Finals');
  assert(DB[finals.home].conf !== DB[finals.away].conf, 'Finals is cross-conference');
  assert(Array.isArray(res1.injuryLog), 'injury log present');
}

T('18: Equity table — sums to 1, seeds matter, everyone can win');
{
  const N = 300;
  const eq = ctx.computeEquityTable(DB, N, 20000);
  const sum = Object.values(eq).reduce((a, b) => a + b, 0);
  assert(Math.abs(sum - 1) < 1e-9, 'equity sums to 1');
  const topSeeds = TEAMS.filter(a => DB[a].seed <= 2).reduce((a, t) => a + eq[t], 0);
  const bottomSeeds = TEAMS.filter(a => DB[a].seed >= 7).reduce((a, t) => a + eq[t], 0);
  assert(topSeeds > bottomSeeds, 'top-2 seeds hold more equity than 7-8 seeds (' +
    (100 * topSeeds).toFixed(0) + '% vs ' + (100 * bottomSeeds).toFixed(0) + '%)');
  console.log('  (info) equity: ' + Object.entries(eq).sort((a, b) => b[1] - a[1])
    .map(([t, v]) => t + ' ' + (100 * v).toFixed(0) + '%').join(', '));
}

T('19: Bracket scheduler — 15 series, valid sequencing, champion detection');
{
  const records = [];
  let pair, count = 0;
  const winners = {};
  while ((pair = ctx.gameNextSeriesPair(DB, records)) && count < 20) {
    count++;
    // scheduler must never repeat a pairing
    assert(!records.some(r => (r.home === pair.a && r.away === pair.b) || (r.home === pair.b && r.away === pair.a)),
      'no repeated pairing (' + pair.a + '-' + pair.b + ')');
    const [h, a] = ctx.gameHomeCourt(DB, pair.a, pair.b, pair.round);
    const winner = DB[h].seed <= DB[a].seed ? h : a;   // scripted: better seed wins
    records.push({ home: h, away: a, round: pair.round, winner });
  }
  assert(count === 15, 'scheduler yields exactly 15 series (' + count + ')');
  // Round-major ordering: no series of a later round before ALL series of
  // the earlier round exist (the depth-first bug the browser playtest caught).
  const order = records.map(r => r.round);
  const firstIdx = {}, lastIdx = {};
  order.forEach((r, i) => { if (!(r in firstIdx)) firstIdx[r] = i; lastIdx[r] = i; });
  assert(lastIdx.R1 < firstIdx.R2 && lastIdx.R2 < firstIdx.CF && lastIdx.CF < firstIdx.Finals,
    'strictly round-major schedule (' + order.join(',') + ')');
  assert(ctx.gameRunChampion(records) !== null, 'champion detected when bracket completes');
  assert(ctx.gameNextSeriesPair(DB, records) === null, 'scheduler returns null after Finals');
}

T('20: Stepwise session — parity with headless loop semantics');
{
  const run = ctx.createGameRun(DB, { seed: 314 });
  const session = ctx.openRunSeries(run, 'BOS', 'PHI', 'R1');
  let guard = 0;
  while (!session.done && guard++ < 8) {
    const pre = ctx.getUpcomingGameState(run, session, 'BOS');
    assert(pre && pre.fatigue && Array.isArray(pre.unavailable), 'pre-game state well-formed');
    const before = JSON.stringify(pre);
    ctx.getUpcomingGameState(run, session, 'BOS');
    assert(JSON.stringify(ctx.getUpcomingGameState(run, session, 'BOS')) === before, 'pre-game view is pure');
    ctx.playSeriesGame(run, session, null);
  }
  assert(session.done && Math.max(session.score.home, session.score.away) === 4, 'session closes at 4 wins');
  assert(run.series.length === 1 && run.series[0].games.length === session.games.length, 'series recorded');
  assert(run.rng.draws > 0, 'counting rng tracked draws (' + run.rng.draws + ')');
}

T('21: Process CVA — assistant-identical plan ≈ 0, bench-the-star < 0');
{
  const run = ctx.createGameRun(DB, { seed: 555, userTeam: 'NYK' });
  const session = ctx.openRunSeries(run, 'NYK', 'ATL', 'R1');
  // User plan = exactly what the assistant would do → delta ≈ 0 modulo
  // belief noise; then a deliberately bad plan → clearly negative.
  const gs = ctx.getUpcomingGameState(run, session, 'NYK');
  const aiLike = ctx.makeCoachPlan(DB.NYK, DB.ATL,
    session.evidence.NYK.own, session.evidence.NYK.opp, gs,
    ctx.gameCreateRNG((run.seed * 31 + run.rng.draws + 1) >>> 0));
  const g1 = ctx.playSeriesGame(run, session, aiLike);
  assert(g1.cva && Math.abs(g1.cva.delta) < 1.0, 'assistant-identical plan CVA ~0 (' + g1.cva.delta + ')');
  // Bench the star: NYK's best player gets 0 minutes.
  const star = DB.NYK.players.reduce((a, b) => (b.baseRating > a.baseRating ? b : a));
  const pool = DB.NYK.players.filter(p => p.initialStatus === 'available' && p.baseRating > 0 && p.name !== star.name);
  const badPlan = { rotation: ctx.gameDefaultRotation(pool, 9), doubleTarget: null };
  const g2 = ctx.playSeriesGame(run, session, badPlan);
  assert(g2.cva && g2.cva.delta < -0.75, 'benching the star grades clearly negative (' + g2.cva.delta + ')');
  assert(run.cvaTotal === +(g1.cva.delta + g2.cva.delta).toFixed(2), 'run cvaTotal accumulates');
}

T('22: Persistence — save/restore round-trip continues identically');
{
  // Copy A: play 2 games, serialize, keep playing to series end.
  const runA = ctx.createGameRun(DB, { seed: 777, userTeam: 'DEN' });
  const sesA = ctx.openRunSeries(runA, 'DEN', 'MIN', 'R1');
  ctx.playSeriesGame(runA, sesA, null);
  ctx.playSeriesGame(runA, sesA, null);
  const saved = ctx.serializeRun(runA, sesA);
  const contA = [];
  while (!sesA.done) contA.push(ctx.playSeriesGame(runA, sesA, null));
  // Copy B: restore from the snapshot and continue.
  const { run: runB, session: sesB } = ctx.restoreRun(DB, saved);
  assert(sesB && sesB.games.length === 2 && sesB.sctx, 'session restored mid-series');
  const contB = [];
  while (!sesB.done) contB.push(ctx.playSeriesGame(runB, sesB, null));
  assert(contA.length === contB.length, 'same number of remaining games');
  contA.forEach((g, i) => {
    assert(g.homeScore === contB[i].homeScore && g.awayScore === contB[i].awayScore,
      'restored game ' + (i + 1) + ' identical (' + g.homeScore + '-' + g.awayScore + ' vs ' +
      contB[i].homeScore + '-' + contB[i].awayScore + ')');
  });
  assert(runA.series[0].winner === runB.series[0].winner, 'same series winner after restore');
}

T('23: UI renderers — pure strings, key content, no leaks of hidden state');
{
  const setup = ctx.renderGameSetup();
  assert(setup.includes('Playoff Run') && setup.includes('Title equity'), 'setup renders with equity');
  assert((setup.match(/pr-team-card/g) || []).length === 16, 'setup shows 16 team cards');
  // drive a run far enough to render every screen
  ctx.GAME_UI.run = ctx.createGameRun(DB, { seed: 4417, userTeam: 'DEN' });
  ctx.GAME_UI.eliminated = false;
  let pair;
  while ((pair = ctx.gameNextSeriesPair(DB, ctx.GAME_UI.run.series))) {
    if (pair.a === 'DEN' || pair.b === 'DEN') break;
    ctx.playRunSeries(ctx.GAME_UI.run, pair.a, pair.b, pair.round);
  }
  ctx.GAME_UI.session = ctx.openRunSeries(ctx.GAME_UI.run, pair.a, pair.b, pair.round);
  ctx.GAME_UI.planMinutes = {};
  DB.DEN.players.filter(p => p.initialStatus === 'available' && p.baseRating > 0).slice(0, 9)
    .forEach((p, i) => { ctx.GAME_UI.planMinutes[p.name] = [36,34,33,31,29,24,20,18,15][i]; });
  ctx.GAME_UI.planDouble = '';
  const plan = ctx.renderGameplan();
  assert(plan.includes('Rotation') && plan.includes('Coverage') && plan.includes('Game 1'), 'gameplan renders');
  assert(!plan.includes('expected') && !plan.includes('shift'), 'gameplan leaks no hidden sim state');
  const byName = {}; DB.DEN.players.forEach(p => { byName[p.name] = p; });
  const rotation = Object.entries(ctx.GAME_UI.planMinutes).map(([n, m]) => ({ player: byName[n], minutes: m }));
  ctx.GAME_UI.lastGame = ctx.playSeriesGame(ctx.GAME_UI.run, ctx.GAME_UI.session, { rotation, doubleTarget: null });
  const result = ctx.renderGameResult();
  assert(result.includes('pr-trace') && result.includes('box score') && result.includes('Coaching:'), 'result renders trace + boxes + CVA');
  while (!ctx.GAME_UI.session.done) ctx.playSeriesGame(ctx.GAME_UI.run, ctx.GAME_UI.session, null);
  ctx.GAME_UI.session = null;
  let p2;
  while ((p2 = ctx.gameNextSeriesPair(DB, ctx.GAME_UI.run.series))) {
    ctx.playRunSeries(ctx.GAME_UI.run, p2.a, p2.b, p2.round);
  }
  const summary = ctx.renderRunSummary();
  assert(summary.includes('Coaching Value Added') && summary.includes('Champion'), 'summary renders');
  const bracket = ctx.renderBracketCols(ctx.GAME_UI.run);
  assert((bracket.match(/pr-bracket-cell/g) || []).length === 15, 'bracket shows 15 series');
  ctx.GAME_UI.run = null; ctx.GAME_UI.session = null;
}

// ════════════════════════════════════════════════════════════
console.log('\n' + '='.repeat(60));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(60));
process.exit(failed ? 1 : 0);
