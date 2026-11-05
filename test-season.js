// ============================================================
// Tests for the 2026-27 regular-season model
// Run: node test-season.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) passed++; else { failed++; console.error('  ✗ ' + msg); } }
function near(a, b, tol, msg) { assert(Math.abs(a - b) <= tol, `${msg} (got ${a}, want ${b} ± ${tol})`); }

function loadCtx(withSnapshot, withUi) {
  const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');
  const store = {};
  const ctx = vm.createContext({
    console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error, Intl,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  });
  const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx);
  load('js/season/data/season-constants.js');
  load('js/season/data/player-priors.js');
  load('js/season/data/chemistry-fit.js');
  load('js/season/data/aging-fit.js');
  load('js/season/data/season-ledger.js');
  if (withSnapshot && fs.existsSync(path.join(__dirname, 'js/season/data/slate-snapshot.js'))) load('js/season/data/slate-snapshot.js');
  load('js/season/adapters.js');
  load('js/season/engine.js');
  load('js/season/props.js');
  load('js/season/ensemble.js');
  load('js/season/ledger.js');
  if (withUi) {
    const el = () => ({ style: {}, innerHTML: '', value: '', textContent: '', className: '', appendChild: () => {}, querySelector: () => null, querySelectorAll: () => [], classList: { add() {}, remove() {} } });
    ctx.document = { getElementById: el, createElement: el, querySelector: () => null, querySelectorAll: () => [] };
    ctx.navigator = { clipboard: null };
    ctx.alert = () => {}; ctx.prompt = () => {}; ctx.confirm = () => false;
    load('js/season/ui.js');
  }
  return ctx;
}

// A two-team synthetic slate with controllable inputs. Synthetic players
// have no games this season (the teams have none either); seedPriors gives
// each a full 2025-26 season with his team, so the team ratings "contain"
// the whole roster the way a real team's rating does.
function makePlayer(id, name, min, pts, reb, ast, extra) {
  return { id, name, pos: 'G', status: 'Available', availability: 1, projMin: min, starter: min >= 28, depthRank: 1,
    avg: { min, pts, reb, ast, tpm: pts * 0.08, stl: 1, blk: 0.5, to: 2, fgm: pts * 0.36, fga: pts * 0.78, ftm: pts * 0.15, fta: pts * 0.18, tpa: pts * 0.22 },
    seasonGames: 0, games: 60, h2h: null, recent: null, ...(extra || {}) };
}
function priorEntry(c, p, tm) {
  return { n: p.name, s26: [82, ...c.NBAI_STAT_KEYS.map(k => p.avg[k])],
    a26: [c.boxToBpm(p.avg), null, null, 82 * p.avg.min, null, null, null, null, null, null], tm };
}
function seedPriors(c, slate) {
  for (const t of Object.values(slate.teams)) for (const p of t.players) c.SEASON_PLAYER_PRIORS.players[p.id] = priorEntry(c, p, { [t.abbr]: 82 });
  c._priorsByTeamCache = null;
  return slate;
}
function makeTeam(abbr, ortg, drtg, pace, players, rest) {
  return { abbr, name: abbr, city: abbr, logo: null, prior: { ortg, drtg, pace, games: 82 }, current: { ppg: null, papg: null, games: 0 },
    rest: { restDays: 1, backToBack: false, threeInFour: false, schedulePoints: 0, ...(rest || {}) }, players };
}
function rotation(prefix) {
  const mins = [34, 33, 32, 30, 28, 22, 20, 16, 14, 11];
  const pts = [24, 19, 16, 13, 11, 10, 8, 6, 5, 3];
  return mins.map((m, i) => makePlayer(`${prefix}${i}`, `${prefix} Player ${i}`, m, pts[i], 5, 3));
}
function makeSlate(c) {
  const A = makeTeam('AAA', 114.5, 114.5, 99, rotation('a'));
  const B = makeTeam('BBB', 114.5, 114.5, 99, rotation('b'));
  const slate = { source: 'test', date: '2026-11-01', fetchedAt: null, modelVersion: 't', league: { ortg: 114.5, pace: 99, derived: false },
    teams: { AAA: A, BBB: B }, games: [{ id: 'g1', tip: '2099-01-01T00:00Z', venue: null, home: 'AAA', away: 'BBB', market: { mlHome: -150, mlAway: 130, spreadHome: -3, total: 228, book: 'T' }, external: { nbai: { pHome: 0.62 } } }] };
  return c ? seedPriors(c, slate) : slate;
}

console.log('TEST 1: probability math');
{
  const c = loadCtx(false);
  near(c.normalCdf(0), 0.5, 1e-6, 'Φ(0)');
  near(c.normalCdf(1.96), 0.975, 1e-3, 'Φ(1.96)');
  near(c.marginToWinProb(7), 0.712, 0.01, '7-pt favourite ≈ 71%');
  near(c.marginToWinProb(10), 0.788, 0.01, '10-pt favourite ≈ 79%');
  near(c.winProbToMargin(c.marginToWinProb(4.3)), 4.3, 0.01, 'margin ↔ prob round trip');
  near(c.americanToProb(-150), 0.6, 1e-6, 'american −150');
  near(c.americanToProb(130), 100 / 230, 1e-6, 'american +130');
  near(c.noVigHomeProb(-110, -110), 0.5, 1e-9, 'no-vig pick-em');
  const nv = c.noVigHomeProb(-150, 130); assert(nv > 0.57 && nv < 0.59, 'no-vig −150/+130 ≈ 58%');
  assert(c.probToAmerican(0.6) === -150, 'prob → american');
  near(c.invLogit(c.logit(0.37)), 0.37, 1e-9, 'logit round trip');
}

console.log('TEST 2: team strength shrinkage');
{
  const c = loadCtx(false);
  const league = { ortg: 114.5, pace: 99 };
  const t = makeTeam('X', 120.5, 110.5, 100, []);                // +10 last season
  const s0 = c.calcSeasonTeamStrength(t, league);
  near(s0.net, 10 * c.SEASON_PRIOR_RETENTION, 0.01, 'no current games → prior × retention');
  assert(s0.currentWeight === 0, 'weight 0 with no games');
  t.current = { ppg: 100, papg: 110, games: 20 };                 // −10 per game this season
  const s20 = c.calcSeasonTeamStrength(t, league);
  near(s20.currentWeight, 0.5, 1e-6, 'K=20 → half weight at 20 games');
  near(s20.net, 0.5 * (-10) + 0.5 * 10 * c.SEASON_PRIOR_RETENTION, 0.05, 'blend of current and prior');
  t.current = { ppg: 100, papg: 110, games: 82 };
  assert(c.calcSeasonTeamStrength(t, league).currentWeight > 0.8, 'full season dominates');
}

console.log('TEST 3: player value (BPM) and roster adjustment');
{
  const c = loadCtx(false);
  // Real 2025-26 priors (ESPN ids), valued at pace 100.
  const val = (id) => c.playerImpactPts({ id, avg: null, seasonGames: 0 }, 100);
  const sga = val('4278073'), jokic = val('3112335'), curry = val('3975'), caruso = val('2991350');
  assert(sga > 7 && sga < 10, `SGA worth 7-10 pts (got ${sga.toFixed(2)})`);
  assert(jokic > 9 && jokic < 12.5 && jokic > sga, `Jokić 9-12.5 and above SGA (got ${jokic.toFixed(2)})`);
  assert(curry > 3 && curry < 5.5, `Curry 3-5.5 (got ${curry.toFixed(2)})`);
  assert(caruso > 0.5 && caruso < 2.5, `Caruso's defense valued, 0.5-2.5 (got ${caruso.toFixed(2)})`);
  assert(val('4396993') > 2, 'Haliburton valued from 2024-25 though he missed 2025-26');

  // Profile blending.
  const prior = c.playerProfile({ id: '4278073', avg: null, seasonGames: 0 });
  assert(prior.source === 'prior' && prior.mpg > 30 && prior.mpg < 36 && prior.priorBpm > 9 && prior.priorBpm < 13, 'prior-only profile');
  const hot = c.playerProfile({ id: '4278073', seasonGames: 10, avg: { min: 34, pts: 40, reb: 6, ast: 7, tpm: 3, stl: 2, blk: 1, to: 2, fgm: 14, fga: 24, ftm: 9, fta: 10, tpa: 7 } });
  assert(hot.source === 'prior+current' && hot.currentBpm > prior.priorBpm && hot.bpm > prior.priorBpm && hot.bpm < hot.currentBpm, 'hot start pulls BPM partway');
  near(hot.bpm, (prior.priorBpm * 1000 + hot.currentBpm * 340) / 1340, 1e-6, '1000 prior minutes vs 340 current');
  const rookieAvg = { min: 30, pts: 20, reb: 5, ast: 4, tpm: 2, stl: 1, blk: 0.5, to: 2.5, fgm: 7, fga: 16, ftm: 4, fta: 5, tpa: 6 };
  const rookie = c.playerProfile({ id: 'no-history', seasonGames: 5, avg: rookieAvg });
  assert(rookie.source === 'current' && rookie.bpm < rookie.currentBpm && rookie.bpm > c.SEASON_IMPACT.replacementBpm, 'rookie regressed toward replacement');
  near(rookie.avg.pts, 20, 1e-9, 'rookie rates = his sample');
  assert(c.playerImpactPts({ id: 'deep', seasonGames: 20, avg: { ...rookieAvg, min: 6 } }) === 0, 'sub-8-minute players ignored');
  assert(c.playerProfile({ id: 'nobody', seasonGames: 0, avg: null }).source === 'none', 'no data → none');
  const avgLine = { min: 30, pts: 14, reb: 5, ast: 3, tpm: 1.5, stl: 0.9, blk: 0.5, to: 1.5, fgm: 5.2, fga: 11.5, ftm: 2.1, fta: 2.7, tpa: 4.2 };
  const b = c.boxToBpm(avgLine);
  assert(b > -2.5 && b < 2.5, `ordinary starter line → BPM near 0 (got ${b.toFixed(2)})`);

  // Roster vs rating.
  const slate = makeSlate(c);
  const A = slate.teams.AAA, s = c.calcSeasonTeamStrength(A, slate.league), pace = A.prior.pace;
  const adj = (team) => c.calcRosterAdjustment(team, s).adj;
  near(adj(A), 0, 1e-9, 'healthy roster that earned the rating → 0');
  const star = A.players[0], v = c.playerImpactPts(star, pace);
  assert(v > 1, `synthetic star has real value (got ${v.toFixed(2)})`);
  const swap = (pl, id, ch) => pl.map(p => p.id === id ? { ...p, ...ch } : p);
  near(adj({ ...A, players: swap(A.players, star.id, { availability: 0 }) }), -v, 0.006, 'star out → −value');
  near(adj({ ...A, players: swap(A.players, star.id, { availability: 0.5 }) }), -0.5 * v, 0.006, 'questionable → half');
  const r = c.calcRosterAdjustment({ ...A, players: swap(A.players, star.id, { availability: 0 }) }, s);
  assert(r.missing.length === 1 && r.missing[0].name === star.name, 'missing lists the absent star');

  const newcomer = makePlayer('n1', 'Newcomer', 30, 18, 6, 4);
  c.SEASON_PLAYER_PRIORS.players.n1 = priorEntry(c, newcomer, { ZZZ: 82 });
  const vn = c.playerImpactPts(newcomer, pace);
  near(adj({ ...A, players: [...A.players, newcomer] }), vn, 0.006, 'arrival adds his full value');
  near(adj({ ...A, players: [...A.players, { ...newcomer, availability: 0 }] }), 0, 1e-9, 'arrival who is out costs nothing — never in the rating');

  c.SEASON_PLAYER_PRIORS.players.d1 = priorEntry(c, makePlayer('d1', 'Departed', 30, 18, 6, 4), { AAA: 41 });
  c._priorsByTeamCache = null;
  const dep = c.calcRosterAdjustment(A, s);
  near(dep.adj, -vn * 0.5, 0.006, 'departed player removes his share of the rating (41/82)');
  assert(dep.items.some(i => i.kind === 'departed' && i.name === 'Departed'), 'departure itemised');
  delete c.SEASON_PLAYER_PRIORS.players.d1; c._priorsByTeamCache = null;

  const stars = Array.from({ length: 6 }, (_, i) => { const p = makePlayer('x' + i, 'X' + i, 34, 30, 8, 7); c.SEASON_PLAYER_PRIORS.players['x' + i] = priorEntry(c, p, { ZZZ: 82 }); return p; });
  assert(adj({ ...A, players: [...A.players, ...stars] }) === c.SEASON_IMPACT.teamCap, 'team cap applies');
}

console.log('TEST 4: rest adjustment');
{
  const c = loadCtx(false);
  assert(c.calcRestAdjustment({ restDays: 1 }) === 0, 'normal rest = 0');
  assert(c.calcRestAdjustment({ restDays: 0, backToBack: true }) === c.SEASON_REST.backToBack, 'b2b');
  assert(c.calcRestAdjustment({ restDays: 1, threeInFour: true }) === c.SEASON_REST.threeInFour, '3-in-4');
  assert(c.calcRestAdjustment({ restDays: 3 }) === c.SEASON_REST.longRestBonus, 'long rest');
  assert(c.calcRestAdjustment({ restDays: 0, backToBack: true, threeInFour: true }) === c.SEASON_REST.backToBack, 'b2b dominates 3-in-4');
}

console.log('TEST 5: game projection');
{
  const c = loadCtx(false);
  const slate = makeSlate(c);
  const p = c.projectSeasonGame(slate.games[0], slate);
  near(p.margin, c.SEASON_HCA, 1e-6, 'equal teams → margin = HCA');
  near(p.pHome, c.marginToWinProb(c.SEASON_HCA), 1e-4, 'pHome from margin');
  assert(p.homeScore - p.awayScore === Math.round(p.margin) || Math.abs((p.homeScore - p.awayScore) - p.margin) <= 1, 'score reproduces margin');
  // Each team's roster-fit adj moves its own scoring by offShare and the
  // opponent's by (1 − offShare): total shifts by (2·offShare − 1)·Σ adj.
  near(p.total, 2 * 114.5 * 99 / 100 + (2 * c.SEASON_IMPACT.offShare - 1) * (p.fit.home.adj + p.fit.away.adj), 0.1, 'league-average teams → league-average total (+ fit term)');
  assert(p.lineage.length >= 2 && p.lineage[0].step === 'strength', 'lineage recorded');

  slate.teams.AAA.prior.ortg = 119.5;  // +5 net home
  const p2 = c.projectSeasonGame(slate.games[0], slate);
  near(p2.margin, c.SEASON_HCA + 5 * c.SEASON_PRIOR_RETENTION * 99 / 100, 0.01, 'net rating gap × pace, prior shrunk');
  assert(p2.total > p.total, 'better offense raises total');

  slate.teams.AAA.prior.ortg = 114.5;
  const p3 = c.projectSeasonGame(slate.games[0], slate, { restOverride: { home: { backToBack: true, restDays: 0 } } });
  near(p3.margin, c.SEASON_HCA + c.SEASON_REST.backToBack, 1e-6, 'home b2b override');

  const star = slate.teams.AAA.players[0];
  const p4 = c.projectSeasonGame(slate.games[0], slate, { availabilityOverride: { [star.id]: 0 } });
  assert(p4.margin < p.margin && p4.pHome < p.pHome, 'home star out lowers margin and probability');
  assert(p4.availability.home.missing[0].name === star.name, 'absence attributed');
  assert(p4.total < p.total, 'absence lowers total');
  let threw = false; try { c.projectSeasonGame({ home: 'ZZZ', away: 'AAA' }, slate); } catch (e) { threw = true; }
  assert(threw, 'unknown team throws');
}

console.log('TEST 6: props');
{
  const c = loadCtx(false);
  const slate = makeSlate(c);
  const A = slate.teams.AAA, B = slate.teams.BBB;
  const star = A.players[0];
  const pr = c.projectPlayerProps(star, A, B, slate);
  near(pr.pts, star.avg.pts, 0.15, 'neutral matchup → season average points');
  near(pr.min, star.projMin, 1e-6, 'uses projected minutes');
  near(pr.pra, pr.pts + pr.reb + pr.ast, 0.11, 'PRA sums');
  assert(pr.sd.pts > 5 && pr.sd.pts < 12, 'points sd plausible');
  const teammateOut = { availabilityOverride: { [A.players[1].id]: 0 } };
  const pr2 = c.projectPlayerProps(star, A, B, slate, teammateOut);
  assert(pr2.pts > pr.pts, 'teammate out → usage redistribution raises points');
  assert(pr2.factors.redistPts > 1, 'redistribution factor > 1');
  B.prior.drtg = 108;                       // elite defense
  const pr3 = c.projectPlayerProps(star, A, B, slate);
  assert(pr3.pts < pr.pts && pr3.reb === pr.reb, 'elite defense suppresses points, not boards');
  B.prior.drtg = 114.5;
  assert(c.projectPlayerProps({ ...star, availability: 0 }, A, B, slate) === null, 'out player → null');
  const withH2h = { ...star, h2h: { pts: 40, reb: 5, ast: 3, n: 12 } };
  assert(c.projectPlayerProps(withH2h, A, B, slate).pts > pr.pts, 'h2h blends in with n ≥ 5');
  const list = c.projectTeamProps('AAA', 'BBB', slate);
  assert(list.length === 10 && list[0].min >= list[1].min, 'team props sorted by minutes');
  near(c.probOver(20, 6, 19.5), 1 - c.normalCdf((19.5 - 20) / 6), 1e-9, 'half-point line');
  assert(c.probOver(20, 6, 25.5) < 0.2 && c.probOver(20, 6, 14.5) > 0.8, 'over probabilities move the right way');
  const p20 = c.probOver(20, 6, 20); near(p20, 0.5, 1e-9, 'integer line at the mean → 50% with push credit');
}

console.log('TEST 7: ensemble');
{
  const c = loadCtx(false);
  near(c.combineLogOdds([{ p: 0.6 }, { p: 0.6 }]), 0.6, 1e-9, 'identical members → same p');
  const avg = c.combineLogOdds([{ p: 0.7 }, { p: 0.5 }]);
  assert(avg > 0.5 && avg < 0.7, 'log-odds mean between members');
  assert(c.combineLogOdds([{ p: 0.7 }, { p: 0.5 }], 1.3) > avg, 'extremizing pushes away from 50%');
  assert(c.combineLogOdds([{ p: 0.3 }, { p: 0.4 }], 1.3) < c.combineLogOdds([{ p: 0.3 }, { p: 0.4 }]), 'extremizing below 50% pushes down');
  near(c.combineLogOdds([{ p: 0.7, w: 1 }, { p: 0.5, w: 0 }]), 0.7, 1e-9, 'zero weight ignored');
  assert(c.combineLogOdds([]) === null, 'empty → null');
  const b = c.blendGameForecast({ pOurs: 0.60, pFriend: 0.70, mlHome: -150, mlAway: 130 });
  assert(b.pMarketSource === 'moneyline' && b.pMarket > 0.57 && b.pMarket < 0.59, 'market from moneyline');
  assert(b.members.length === 2 && b.modelsAgree === true, 'two members, agree');
  near(b.pBlend, c.combineLogOdds([{ p: 0.6 }, { p: 0.7 }]), 1e-4, 'blend = log-odds mean');
  assert(b.flagged === true && b.edge > 0, 'edge vs market flagged');
  const b2 = c.blendGameForecast({ pOurs: 0.55, pFriend: null, mlHome: null, mlAway: null, spreadHome: -3 });
  assert(b2.pMarketSource === 'spread' && b2.members.length === 1 && b2.modelsAgree === null, 'spread fallback, single member');
  const b3 = c.blendGameForecast({ pOurs: 0.55, pFriend: 0.45 });
  assert(b3.modelsAgree === false && b3.pMarket === null && b3.flagged === false, 'disagreement, no market');
  const b4 = c.blendGameForecast({ pOurs: 0.6, pFriend: 0.6, mlHome: -150, mlAway: 130 }, { marketWeight: 1 });
  assert(b4.members.length === 3 && b4.pBlend < 0.6, 'market included when weighted');
}

console.log('TEST 8: scoring + stacking');
{
  const c = loadCtx(false);
  const rows = [];
  // ours is informative, friend is noise, market is sharp
  let seed = 12345; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  for (let i = 0; i < 400; i++) {
    const truth = 0.3 + 0.4 * rnd();
    const y = rnd() < truth ? 1 : 0;
    rows.push({ id: 'r' + i, pOurs: Math.max(0.05, Math.min(0.95, truth + (rnd() - 0.5) * 0.2)), pFriend: 0.35 + 0.3 * rnd(), pMarket: Math.max(0.05, Math.min(0.95, truth + (rnd() - 0.5) * 0.06)), pBlend: 0.5, marginOurs: c.winProbToMargin(truth), spreadHome: -c.winProbToMargin(truth), result: { homeScore: y ? 110 : 100, awayScore: 105 } });
  }
  const sc = c.scoreForecasts(rows);
  assert(sc.ours.n === 400 && sc.market.n === 400 && sc.baseline.n === 400, 'all sources scored');
  assert(sc.market.brier < sc.ours.brier && sc.ours.brier < sc.friend.brier, 'sharp < informative < noise on Brier');
  assert(sc.ours.marginMae != null && sc.market.marginMae != null, 'margin MAE where margins exist');
  assert(sc.friend.marginMae === null, 'no margin for friend');
  const st = c.stackWeightsFromLedger(rows);
  assert(st.status === 'usable' && st.n === 400, 'enough rows to stack');
  assert(st.weights[2] > st.weights[0] && st.weights[2] > st.weights[1] && st.weights[2] > 0.5, `stacking loads most on the sharp market (got ${st.weights})`);
  const few = c.stackWeightsFromLedger(rows.slice(0, 10));
  assert(few.status === 'insufficient' && few.needed === c.SEASON_ENSEMBLE.stackMinN, 'insufficient below minimum');
  assert(c.scoreForecasts([]).ours.n === 0 && !c.scoreForecasts([]).baseline, 'empty ledger scores to zero');
}

console.log('TEST 9: ledger (stubbed localStorage)');
{
  const c = loadCtx(false);
  c.SEASON_LEDGER = [];                       // isolate from the committed rows
  const slate = makeSlate(c);
  const g = slate.games[0];
  const proj = c.projectSeasonGame(g, slate);
  const blend = c.blendGameForecast({ pOurs: proj.pHome, pFriend: 0.62, mlHome: -150, mlAway: 130 });
  const e = c.buildLedgerEntry(g, proj, blend, slate);
  assert(e.id === 'g1' && e.pFriend === 0.62 && e.spreadHome === -3 && e.result === null && e.recordedAt, 'entry built');
  assert(e.engine === c.SEASON_ENGINE_VERSION, 'entry stamped with engine version');
  const r1 = c.recordSeasonEntries([e]); assert(r1.added === 1, 'recorded');
  const r2 = c.recordSeasonEntries([e]); assert(r2.added === 0 && r2.skipped === 1, 'duplicate skipped');
  assert(c.loadSeasonLedger().length === 1 && c.loadSeasonLedger()[0].origin === 'local', 'loaded from local');
  assert(c.settleSeasonEntry('g1', 112, 104) === true, 'settled');
  const row = c.loadSeasonLedger()[0];
  assert(row.result.homeScore === 112 && row.result.awayScore === 104, 'result stored');
  assert(c.settleSeasonEntry('nope', 1, 2) === false, 'unknown id');
  assert(JSON.parse(c.exportSeasonLedgerJson())[0].origin === undefined, 'export strips origin');
  c.clearLocalSeasonLedger(); assert(c.loadSeasonLedger().length === 0, 'cleared');
}

console.log('TEST 10: NB.AI adapter on a minimal fixture');
{
  const c = loadCtx(false);
  const saved = { data: { date: '2026-11-01', fetchedAt: 'x', modelVersion: 0.4, games: [{ id: '1', home: '19', away: '2', date: '2026-11-01T20:30Z', venue: 'V', odds: { home: 220, away: -270, provider: 'DK', total: 221.5, spread: 7.5 } }],
    teams: {
      '19': { id: '19', abbreviation: 'ORL', name: 'Magic', location: 'Orlando', ppg: 114.65, papg: 115.8, games: 82, pace: 103.2, factors: { restDays: 1, backToBack: false, threeInFour: false, schedulePoints: 0, offRating: 111.08, defRating: 112.2, recentGames: 5, recentPPG: 109.8, recentPAPG: 118.4 },
        players: [{ id: '4432573', name: 'Paolo Banchero', pos: 'F', status: 'Out', seasonAverage: [34, 25, 7, 5, 1.5, 0.8, 0.6, 3, 9, 20, 6, 8, 5], projectedMinutes: 0.6, availability: 0, expectedStarter: false, depthRank: 6, h2h: { pts: 22.7, reb: 6.3, ast: 4.4, n: 12 }, seasonGames: 2, priorGames: 72 },
          { id: '4066320', name: 'Desmond Bane', pos: 'G', status: 'Available', seasonAverage: [33.6, 17.2, 4, 2.8, 3.2, 0.8, 1, 2.4, 4.8, 14.2, 4.4, 5.2, 9.6], projectedMinutes: 37.3, availability: 1, expectedStarter: true, depthRank: 1, seasonGames: 5 }] },
      '2': { id: '2', abbreviation: 'BOS', name: 'Celtics', location: 'Boston', ppg: 116.2, papg: 107.6, games: 82, pace: 98.8, factors: { restDays: 2, recentGames: 5, recentPPG: 118, recentPAPG: 110 },
        players: [{ id: '4065648', name: 'Jayson Tatum', pos: 'F', status: 'Questionable', seasonAverage: [36, 27, 8.5, 5, 3, 1, 0.5, 2.8, 9, 20, 6, 7, 9], projectedMinutes: 35, expectedStarter: true, depthRank: 1, seasonGames: 5 }] } } } };
  const rankings = { markets: [{ kind: 'ml', gameId: '1', side: 'away', p: 0.5628 }, { kind: 'ml', gameId: '1', side: 'home', p: 0.4372 }, { kind: 'spread', gameId: '1', side: 'home', p: 0.5 }] };
  const s = c.adaptNbaiSlate(saved, rankings);
  assert(s.games.length === 1 && s.games[0].home === 'ORL' && s.games[0].away === 'BOS', 'ids mapped to abbreviations');
  assert(s.games[0].market.spreadHome === 7.5 && s.games[0].market.mlHome === 220 && s.games[0].market.total === 221.5, 'market mapped');
  near(s.games[0].external.nbai.pHome, 0.4372, 1e-6, 'friend home prob');
  near(s.teams.ORL.prior.ortg, 111.08, 1e-6, 'offRating used as prior ORtg');
  near(s.teams.BOS.prior.ortg, 116.2 / 98.8 * 100, 1e-6, 'ppg/pace fallback');
  assert(s.teams.ORL.current.games === 5 && s.teams.ORL.current.ppg === 109.8, 'current season from recent factors');
  assert(s.teams.ORL.players[0].availability === 0 && s.teams.ORL.players[0].avg.pts === 25, 'player normalized');
  assert(s.teams.ORL.players[0].seasonGames === 2 && s.teams.ORL.players[0].games === 74, 'this-season games kept apart from the total');
  assert(s.teams.BOS.players[0].availability === 0.5, 'questionable → 50% when availability missing');
  assert(s.league.derived === false, 'fallback league averages with 2 teams');
  const proj = c.projectSeasonGame(s.games[0], s);
  assert(proj.pHome > 0 && proj.pHome < 1 && proj.availability.home.missing[0].name === 'Paolo Banchero', 'projects the fixture');
  let threw = false; try { c.adaptNbaiSlate({}); } catch (e) { threw = true; } assert(threw, 'bad feed throws');
  const espn = c.adaptEspnScoreboard({ events: [{ id: '9', date: 'd', competitions: [{ status: { type: { name: 'STATUS_FINAL' } }, competitors: [{ homeAway: 'home', team: { abbreviation: 'UTAH' }, score: '90' }, { homeAway: 'away', team: { abbreviation: 'POR' }, score: '112' }] }] }] });
  assert(espn[0].final && espn[0].homeScore === 90 && espn[0].away === 'POR', 'espn scoreboard adapted');
}

console.log('TEST 11: committed snapshot projects cleanly');
{
  const c = loadCtx(true);
  if (typeof c.SEASON_SLATE_SNAPSHOT === 'undefined') {
    console.log('  (no snapshot yet — run node fetch-slate.js)');
  } else {
    const s = c.SEASON_SLATE_SNAPSHOT;
    assert(s.games.length > 0, 'snapshot has games');
    s.games.forEach(g => {
      const p = c.projectSeasonGame(g, s);
      assert(p.pHome > 0.02 && p.pHome < 0.98 && isFinite(p.total) && p.total > 180 && p.total < 280, `${g.away}@${g.home} sane projection`);
      const props = c.projectTeamProps(g.home, g.away, s);
      assert(props.length >= 8 && props.every(x => x.pts >= 0 && x.pra >= x.pts), `${g.home} props`);
      const m = g.market || {};
      const b = c.blendGameForecast({ pOurs: p.pHome, pFriend: g.external && g.external.nbai ? g.external.nbai.pHome : null, mlHome: m.mlHome, mlAway: m.mlAway, spreadHome: m.spreadHome });
      assert(b.pBlend != null, `${g.home} blend`);
    });
  }
}

console.log('TEST 12: UI boots under a stub DOM');
{
  const c = loadCtx(true, true);
  let ok = true;
  try {
    c.seasonBoot();
    ['tonight', 'results', 'lab', 'ledger', 'data'].forEach(t => c.seasonSetTab(t));
    if (c.seasonState.slate && c.seasonState.slate.games.length) {
      c.seasonToggleGame(c.seasonState.slate.games[0].id);
      c.seasonSetTab('tonight');
      c.seasonRecordTonight();
    }
  } catch (e) { ok = false; console.error('  boot error:', e.stack); }
  assert(ok, 'season UI boots and renders every tab');
}

console.log('TEST 13: season.html cache-busting matches the engine version');
{
  const c = loadCtx(false);
  const html = fs.readFileSync(path.join(__dirname, 'season.html'), 'utf8');
  const versions = [...html.matchAll(/src="js\/season\/[^"?]+\?v=([^"]+)"/g)].map(m => m[1]);
  assert(versions.length >= 8, `code scripts carry ?v= (found ${versions.length})`);
  assert(versions.every(v => v === c.SEASON_ENGINE_VERSION), `every ?v= equals SEASON_ENGINE_VERSION (${c.SEASON_ENGINE_VERSION}); found ${[...new Set(versions)].join(', ')}`);
}

console.log('TEST 14: roster fit (continuity, rebounding overlap)');
{
  const c = loadCtx(false);
  const F = c.SEASON_CHEMISTRY_FIT;
  // The generated file: signs as fitted, magnitudes plausible, provenance kept.
  assert(F.continuity.perUnit > 0 && F.continuity.perUnit < 6, `continuity coefficient positive and modest (${F.continuity.perUnit})`);
  assert(F.rebounding.perPoint < 0 && F.rebounding.perPoint > -0.4, `rebounding overlap coefficient negative and modest (${F.rebounding.perPoint})`);
  assert(F.continuity.mean > 0.5 && F.continuity.mean < 0.85, 'league continuity mean plausible');
  assert(F.rebounding.mean > 45 && F.rebounding.mean < 55, 'on-floor TRB% sum mean ≈ 50');
  assert(F.meta.teamSeasons >= 300 && F.meta.cvRmse.withFit < F.meta.cvRmse.playerValueOnly, 'fit improved cross-validated error on 300+ team-seasons');

  // Rebound-rate prior: none → league rookie rate; long history → close to raw; seasons weighted 1.0 / 0.5.
  const P = c.SEASON_PLAYER_PRIORS.players;
  P.rb0 = { n: 'x', tm: {} };
  near(c._priorReboundRate('rb0'), F.rebounding.rookieTrb, 1e-9, 'no history → rookie rebound rate');
  P.rb1 = { n: 'x', a26: [0, 0, 0, 2400, 0, 0, 20, 0, 0, 0], a25: [0, 0, 0, 2400, 0, 0, 14, 0, 0, 0], tm: {} };
  const raw = (20 * 2400 + 14 * 1200) / 3600, k = 3600 / (3600 + F.rebounding.regressMinutes);
  near(c._priorReboundRate('rb1'), raw * k + F.rebounding.rookieTrb * (1 - k), 1e-9, 'season-weighted, regressed rebound rate');

  const slate = makeSlate(c);
  const A = slate.teams.AAA;
  const hs = c.calcSeasonTeamStrength(A, slate.league);
  const base = c.calcRosterFit(A, hs);
  near(base.continuity, 1, 1e-9, 'everyone played for the team last season → continuity 1');
  near(base.rebounding, 5 * F.rebounding.rookieTrb, 0.05, 'no rebound history → five rookie rates on the floor');
  const pace = A.prior.pace;
  near(base.parts.continuity, F.continuity.perUnit * (1 - F.continuity.mean) * pace / 100, 0.006, 'continuity part = coef × (share − mean) × pace');
  near(base.parts.rebounding, F.rebounding.perPoint * (base.rebounding - F.rebounding.mean) * pace / 100, 0.006, 'rebounding part = coef × (sum − mean) × pace');
  near(base.adj, base.parts.continuity + base.parts.rebounding, 0.011, 'adj = sum of parts');

  // Turn the whole roster over: continuity 0, adjustment falls by exactly the continuity coefficient.
  const moved = { ...A, players: A.players.map(p => ({ ...p })) };
  A.players.forEach(p => { P[p.id].tm = { ZZZ: 82 }; });
  const turned = c.calcRosterFit(moved, hs);
  near(turned.continuity, 0, 1e-9, 'all new → continuity 0');
  near(base.adj - turned.adj, F.continuity.perUnit * pace / 100, 0.011, 'full turnover costs perUnit × pace/100');
  A.players.forEach(p => { P[p.id].tm = { AAA: 82 }; });

  // A returning starter out → continuity drops (minutes weights follow availability).
  const out = c.calcRosterFit({ ...A, players: A.players.map((p, i) => i === 0 ? { ...p, availability: 0 } : p) }, hs);
  near(out.continuity, 1, 1e-9, 'a returning player out leaves only returning players → still 1');
  P[A.players[1].id].tm = { ZZZ: 82 };
  const oneNew = c.calcRosterFit(A, hs);
  assert(oneNew.continuity < 1 && oneNew.continuity > 0.8, `one new rotation player → continuity just under 1 (${oneNew.continuity})`);
  P[A.players[1].id].tm = { AAA: 82 };

  // Two heavy rebounders: overlap penalty.
  const reb = { ...A, players: A.players.map(p => ({ ...p })) };
  [0, 1].forEach(i => { P[A.players[i].id].a26 = [0, 0, 0, 2800, 0, 0, 22, 0, 0, 0]; });
  const glass = c.calcRosterFit(reb, hs);
  assert(glass.rebounding > base.rebounding + 3, 'two 22% rebounders raise the on-floor rebound sum');
  assert(glass.parts.rebounding < base.parts.rebounding, 'more rebounding overlap → lower fit');
  [0, 1].forEach(i => { P[A.players[i].id].a26 = priorEntry(c, A.players[i], {}).a26; });

  // Fades with this season's weight; cap; switch-off.
  const half = c.calcRosterFit(A, { ...hs, currentWeight: 0.5 });
  near(half.adj, base.adj / 2, 0.011, 'half this-season weight → half the adjustment');
  const saved = F.continuity.perUnit;
  F.continuity.perUnit = 100;
  near(c.calcRosterFit(A, hs).adj, c.SEASON_IMPACT.fitCap, 1e-9, 'capped at fitCap');
  F.continuity.perUnit = saved;
  c.SEASON_IMPACT.fitCap = 0;
  const off = c.projectSeasonGame(slate.games[0], slate);
  assert(off.fit.home.adj === 0 && !off.lineage.some(l => l.step === 'fit'), 'fitCap 0 → no fit step');
  c.SEASON_IMPACT.fitCap = 2.0;

  // In the game: the fit step is the home-minus-away difference.
  A.players.forEach(p => { P[p.id].tm = { ZZZ: 82 }; });
  const g = c.projectSeasonGame(slate.games[0], slate);
  const step = g.lineage.find(l => l.step === 'fit');
  assert(step && step.delta < 0, 'home roster turned over → negative fit step for home');
  near(step.delta, g.fit.home.adj - g.fit.away.adj, 0.011, 'fit step = home adj − away adj');
}

console.log('TEST 15: aging');
{
  const c = loadCtx(false);
  const A = c.SEASON_AGING_FIT.byAge;
  // Generated curve: young players improve, veterans decline, centred near zero.
  assert(Object.keys(A).length === 17 && A[20] != null && A[36] != null, 'curve covers ages 20–36');
  assert(A[21] > 0.4 && A[26] > -0.2 && A[26] < 0.2 && A[30] < -0.2 && A[35] < -0.5, `shape: +young, ~0 at 26, −veteran (21 ${A[21]}, 26 ${A[26]}, 30 ${A[30]}, 35 ${A[35]})`);
  for (let a = 22; a <= 34; a++) assert(A[a + 1] <= A[a] + 1e-9, `non-increasing 22–35 (${a}→${a + 1})`);
  near(c.seasonAgeCurve(42), A[36], 1e-12, 'ages past 36 use the 36 value');
  near(c.seasonAgeCurve(18), A[20], 1e-12, 'ages under 20 use the 20 value');
  assert(c.SEASON_AGING_FIT.meta.replay.after.rmse < c.SEASON_AGING_FIT.meta.replay.before.rmse, 'replay improved with aging + retention');

  // Real priors carry 2026-27 ages (Basketball-Reference age on Feb 1, 2027).
  const P = c.SEASON_PLAYER_PRIORS.players;
  near(P['3975'].age, 38, 0, 'Curry 38 in 2026-27');
  near(P['1966'].age, 42, 0, 'LeBron 42 in 2026-27');
  const withBpm = Object.values(P).filter(e => e.a26 || e.a25);
  assert(withBpm.every(e => e.age >= 18 && e.age <= 45), 'every player with BPM has a plausible age');
  const curry = c.playerProfile({ id: '3975', avg: null, seasonGames: 0 });
  near(curry.ageShift, A[36], 1e-9, 'prior-only profile ages by the full curve');

  // Profile: the full curve value whenever there is a prior; fading is by the
  // team's current-season weight in calcRosterAdjustment, not per player.
  const slate = makeSlate(c);
  const T = slate.teams.AAA;
  T.players.forEach(p => { P[p.id].age = 22; });
  const p0 = T.players[0];
  const prof0 = c.playerProfile(p0);
  near(prof0.ageShift, A[22], 1e-9, 'no games this season → full shift');
  const prof10 = c.playerProfile({ ...p0, seasonGames: 10 });
  near(prof10.ageShift, A[22], 1e-9, 'games this season do not shrink the shift (no double fade)');
  near(prof10.priorBpm, prof0.priorBpm, 1e-12, 'prior BPM unaffected by this season\'s games');
  delete P[p0.id].age;
  near(c.playerProfile(p0).ageShift, 0, 0, 'no age → no shift');
  P[p0.id].age = 22;

  // Roster aging: exact for a full-share, available player.
  const hs = c.calcSeasonTeamStrength(T, slate.league);
  const pace = T.prior.pace;
  const r = c.calcRosterAdjustment(T, hs);
  const atPrior = { ...prof0, bpm: prof0.priorBpm };
  const expect0 = c.playerImpactPts(p0, pace, { ...atPrior, bpm: prof0.priorBpm + prof0.ageShift }) - c.playerImpactPts(p0, pace, atPrior);
  const item0 = r.agingItems.find(i => i.id === p0.id);
  near(item0.pts, expect0, 0.006, 'player aging = value(aged) − value(prior) at full share');
  assert(r.aging > 0, 'young returning roster → positive aging');
  const ages = T.players.map(p => P[p.id].age);
  T.players.forEach(p => { delete P[p.id].age; });
  const noAge = c.calcRosterAdjustment(T, hs);
  near(noAge.aging, 0, 0, 'no ages → no aging');
  near(r.adj, noAge.adj, 1e-12, 'aging does not leak into the roster adjustment');
  T.players.forEach((p, i) => { P[p.id].age = ages[i]; });
  // A player 10 games into this season: same aging at w = 0 (the rating's prior part is unchanged).
  const r10 = c.calcRosterAdjustment({ ...T, players: T.players.map((p, i) => i === 0 ? { ...p, seasonGames: 10 } : p) }, hs);
  near(r10.agingItems.find(i => i.id === p0.id).pts, item0.pts, 0.02, 'aging of a player with games this season matches at w = 0');

  // Out tonight → no aging for him; arrival → none; fades with this season's weight.
  const out = c.calcRosterAdjustment({ ...T, players: T.players.map((p, i) => i === 0 ? { ...p, availability: 0 } : p) }, hs);
  assert(!out.agingItems.some(i => i.id === p0.id), 'unavailable player contributes no aging');
  near(out.aging, r.aging - item0.pts, 0.02, 'team aging drops by his share');
  P[p0.id].tm = { ZZZ: 82 };
  assert(!c.calcRosterAdjustment(T, hs).agingItems.some(i => i.id === p0.id), 'new arrival is not aged (keeps prior value)');
  P[p0.id].tm = { AAA: 82 };
  near(c.calcRosterAdjustment(T, { ...hs, currentWeight: 0.5 }).aging, r.aging / 2, 0.02, 'half this-season weight → half the aging');

  // Cap, switch-off, lineage and totals.
  c.SEASON_IMPACT.agingCap = 0.5;
  near(c.calcRosterAdjustment(T, hs).aging, 0.5, 1e-9, 'capped at agingCap');
  c.SEASON_IMPACT.agingCap = 0;
  const off = c.projectSeasonGame(slate.games[0], slate);
  assert(!off.lineage.some(l => l.step === 'aging'), 'agingCap 0 → no aging step');
  c.SEASON_IMPACT.agingCap = 4;
  slate.teams.BBB.players.forEach(p => { P[p.id].age = 34; });
  const g = c.projectSeasonGame(slate.games[0], slate);
  const step = g.lineage.find(l => l.step === 'aging');
  assert(step && step.delta > 0, 'young home roster vs old away roster → positive aging step');
  near(step.delta, g.roster.home.aging - g.roster.away.aging, 0.011, 'aging step = home − away');
  assert(g.margin > off.margin, 'aging moves the margin toward the younger team');
}

// ── TEST 16: ESPN adapters + fallback slate ─────────────────
console.log('TEST 16: ESPN adapters + fallback slate');
{
  const c = loadCtx(false);
  const names = ['MIN', 'FG', '3PT', 'FT', 'REB', 'AST', 'STL', 'BLK', 'TO', 'PTS'];
  const line = (min, pts) => [String(min), '5-10', '1-3', '2-2', '4', '3', '1', '0', '2', String(pts)];
  const box = (abbr, players) => ({ team: { abbreviation: abbr }, statistics: [{ names, athletes: players.map(([id, name, min, pts]) =>
    min == null ? { athlete: { id, displayName: name }, didNotPlay: true, reason: 'REST', stats: [] }
                : { athlete: { id, displayName: name }, starter: true, stats: line(min, pts) }) }] });
  const summary = (home, away, hp, ap) => ({ boxscore: { players: [box(away, ap), box(home, hp)] },
    pickcenter: [{ provider: { name: 'DraftKings' }, details: `${home} -4.5`, overUnder: 221.5,
      homeTeamOdds: { moneyLine: -190 }, awayTeamOdds: { moneyLine: 160 },
      total: { over: { open: { line: 'o224.5' }, close: { line: 'o221.5' } } },
      pointSpread: { home: { open: { line: '-3.5' } } }, moneyline: { home: { open: { odds: '-160' } }, away: { open: { odds: '+135' } } } }] });

  const b = c.adaptEspnBox(summary('AAA', 'BBB', [['1', 'Ann', 30, 20], ['2', 'Bo', null]], [['5', 'Eve', 32, 25]]));
  assert(b.AAA.length === 2 && b.BBB.length === 1, 'box: one list per team');
  const ann = b.AAA.find(p => p.id === '1');
  assert(ann.played && ann.line.min === 30 && ann.line.pts === 20 && ann.line.fgm === 5 && ann.line.fga === 10 && ann.line.tpa === 3, 'box: stat line parsed');
  assert(!b.AAA.find(p => p.id === '2').played, 'box: DNP is not played');

  const m = c.adaptEspnPickcenter(summary('AAA', 'BBB', [], []), 'AAA', 'BBB');
  assert(m.spreadHome === -4.5 && m.total === 221.5 && m.mlHome === -190 && m.book === 'DraftKings', 'pickcenter: closing line, home favourite sign');
  assert(m.open.total === 224.5 && m.open.spreadHome === -3.5 && m.open.mlAway === 135, 'pickcenter: opening line');
  const mAway = c.adaptEspnPickcenter({ pickcenter: [{ provider: { name: 'DK' }, details: 'BBB -2' }] }, 'AAA', 'BBB');
  assert(mAway.spreadHome === 2, 'pickcenter: away favourite → home spread positive');
  assert(c.adaptEspnPickcenter({}, 'AAA', 'BBB') === null, 'pickcenter: none → null');

  const inj = (id, status, note) => ({ status, shortComment: note, athlete: { displayName: 'P' + id, links: [{ href: `https://www.espn.com/nba/player/_/id/${id}/p` }] } });
  const I = c.adaptEspnInjuries({ injuries: [{ injuries: [
    inj('10', 'Out', 'Was questionable earlier in the week.'), inj('11', 'Day-To-Day', 'X is questionable for Wednesday.'),
    inj('12', 'Day-To-Day', 'X is probable for Wednesday.'), inj('13', 'Day-To-Day', 'X has been ruled out for Wednesday.'),
    inj('14', 'Day-To-Day', 'X is doubtful.'), inj('15', 'Day-To-Day', 'Day-to-day with soreness.'),
    inj('16', 'Day-To-Day', "X has been ruled out for Monday's game against the Suns."),
    inj('17', 'Day-To-Day', "X was upgraded from doubtful to questionable for Wednesday's game."),
    inj('18', 'Day-To-Day', "X is questionable for Wednesday's game after being listed as doubtful Monday."),
    inj('19', 'Day-To-Day', 'X will be rested Wednesday against the Hawks.'),
    { status: 'Out', athlete: { displayName: 'NoLink', links: [] } }] }] }, '2026-11-04');
  assert(I['10'].availability === 0, 'injuries: Out status wins over the note');
  assert(I['11'].availability === 0.5 && I['12'].availability === 0.9 && I['13'].availability === 0 && I['14'].availability === 0.1, 'injuries: Day-To-Day reads tonight\'s designation');
  assert(I['15'].availability === 0.5, 'injuries: undesignated Day-To-Day → 0.5');
  assert(I['16'].availability === 0.5, "injuries: a note about another day's game is ignored");
  assert(I['17'].availability === 0.5, 'injuries: "upgraded from doubtful to questionable" → questionable');
  assert(I['18'].availability === 0.5, "injuries: tonight's designation wins over an earlier one in the note");
  assert(I['19'].availability === 0, 'injuries: resting tonight → out');
  assert(Object.keys(I).length === 10, 'injuries: entries without a player id are skipped');

  // Fallback slate: three teams; player 7 moved from CCC to AAA.
  const prior = (abbr) => ({ abbr, name: abbr, city: abbr, logo: null, prior: { ortg: 115, drtg: 112, pace: 100, games: 82 },
    current: { ppg: 1, papg: 1, games: 99 }, rest: {}, players: [{ id: 'nb' }] });
  const priorTeams = { AAA: prior('AAA'), BBB: prior('BBB'), CCC: prior('CCC') };
  const G = (id, date, home, away, hs, as, hb, ab) => ({ id, date, home, away, homeScore: hs, awayScore: as, box: { [home]: hb, [away]: ab } });
  const P = (id, min, pts) => ({ id, name: 'P' + id, played: min > 0, line: { min, pts, reb: 4, ast: 2, tpm: 1, stl: 1, blk: 0, to: 1, fgm: 5, fga: 10, ftm: 2, fta: 2, tpa: 3 } });
  const games = [
    G('g1', '2026-10-28', 'AAA', 'BBB', 110, 100, [P('1', 30, 20), P('2', 20, 10)], [P('5', 32, 25)]),
    G('g2', '2026-10-29', 'CCC', 'BBB', 105, 108, [P('7', 28, 18)], [P('5', 30, 22)]),
    G('g3', '2026-10-31', 'AAA', 'CCC', 120, 101, [P('1', 34, 30), P('2', 0, 0), P('7', 25, 15)], [P('8', 30, 20)]),
  ];
  const tonight = [{ id: 'g9', tip: '2026-11-01T23:00Z', venue: 'Arena', home: 'AAA', away: 'BBB', market: m }, { id: 'gX', home: 'AAA', away: 'ZZZ' }];
  const s = c.adaptEspnSlate({ priorTeams, games, tonight, injuries: { '1': { availability: 0.5, status: 'Day-To-Day', note: 'Q' } }, date: '2026-11-01', fetchedAt: 'now' });
  assert(s.source === 'espn' && s.date === '2026-11-01' && s.modelVersion === null, 'slate: source espn, date, no feed version');
  assert(s.games.length === 1 && s.games[0].id === 'g9' && s.games[0].external === null && s.games[0].market === m, 'slate: tonight mapped, unknown team dropped, no NB.AI');
  assert(s.teams.AAA.prior === priorTeams.AAA.prior, 'slate: priors carried from the snapshot');
  near(s.teams.AAA.current.ppg, 115, 1e-9, 'slate: current ppg from this season\'s results');
  assert(s.teams.AAA.current.games === 2, 'slate: current games counted');
  const a = Object.fromEntries(s.teams.AAA.players.map(p => [p.id, p]));
  assert(a['7'] && !s.teams.CCC.players.find(p => p.id === '7'), 'slate: moved player counts only for his latest team');
  assert(a['1'].availability === 0.5 && a['1'].injury === 'Q', 'slate: injury report sets availability');
  assert(a['2'].availability === 1, 'slate: unlisted player is in even after a DNP');
  near(a['1'].avg.pts, 25, 1e-9, 'slate: season averages over games played');
  assert(a['2'].seasonGames === 1, 'slate: DNP does not count as a game played');
  assert(s.teams.AAA.rest.restDays === 0 && s.teams.AAA.rest.backToBack, 'slate: rest from the schedule');
  const s2 = c.adaptEspnSlate({ priorTeams, games, tonight, injuries: {}, rosters: { AAA: [{ id: '1', name: 'P1' }] }, date: '2026-11-01' });
  assert(s2.teams.AAA.players.map(p => p.id).join() === '1', 'slate: ESPN roster drops players no longer on the team');
  const s3 = c.adaptEspnSlate({ priorTeams, games, tonight, date: '2026-11-01',
    rosters: { AAA: [{ id: '1', name: 'P1' }, { id: '30', name: 'Returner' }, { id: '31', name: 'Benched' }] },
    injuries: { '30': { availability: 0.9, status: 'Day-To-Day', note: 'probable' } } });
  const ret = s3.teams.AAA.players.find(p => p.id === '30');
  assert(ret && ret.availability === 0.9 && ret.seasonGames === 0 && ret.avg.min === 0 && ret.name === 'Returner', 'slate: listed roster player with no games yet is added at his designation');
  assert(!s3.teams.AAA.players.find(p => p.id === '31'), 'slate: unlisted roster player with no games stays out');
  const proj = c.projectSeasonGame(s.games[0], s);
  assert(isFinite(proj.margin) && proj.pHome > 0 && proj.pHome < 1, 'slate: projects through the engine');

  // Ledger: source recorded; fallback rows replaceable before tip-off only.
  const blend = c.blendGameForecast({ pOurs: proj.pHome, mlHome: m.mlHome, mlAway: m.mlAway });
  const espnRow = c.buildLedgerEntry(s.games[0], proj, blend, s);
  assert(espnRow.source === 'espn' && espnRow.pFriend === null, 'ledger: fallback row marked espn, no NB.AI');
  const nb = { ...espnRow, source: 'nb.ai', pFriend: 0.6 };
  const before = new Date('2026-11-01T20:00Z'), after = new Date('2026-11-02T01:00Z');
  let rows = [espnRow];
  let r = c.mergeLedgerEntries(rows, [nb], before);
  assert(r.replaced === 1 && rows.length === 1 && rows[0].source === 'nb.ai', 'ledger: NB.AI replaces a fallback row before tip-off');
  r = c.mergeLedgerEntries(rows, [{ ...espnRow }], before);
  assert(r.replaced === 0 && rows[0].source === 'nb.ai', 'ledger: an NB.AI row is never replaced');
  rows = [{ ...espnRow }];
  r = c.mergeLedgerEntries(rows, [nb], after);
  assert(r.replaced === 0 && rows[0].source === 'espn', 'ledger: nothing replaced after tip-off');
  rows = [{ ...espnRow, result: { homeScore: 1, awayScore: 0 } }];
  r = c.mergeLedgerEntries(rows, [nb], before);
  assert(r.replaced === 0, 'ledger: a settled row is never replaced');
  rows = [];
  r = c.mergeLedgerEntries(rows, [nb, { ...nb, id: 'late', tip: '2026-11-01T19:00Z' }], before);
  assert(r.added === 1 && r.late === 1 && rows.length === 1, 'ledger: new rows added, tipped games skipped');

  // Browser: never replaces a committed row; a local row never erases a committed result.
  c.localStorage.removeItem(c.SEASON_LEDGER_STORAGE_KEY);
  const committedRow = { ...espnRow, id: 'c1' };
  c.SEASON_LEDGER = [committedRow];
  let br = c.recordSeasonEntries([{ ...nb, id: 'c1' }, { ...espnRow, id: 'l1' }]);
  assert(br.added === 1 && c.loadSeasonLedger().find(x => x.id === 'c1').source === 'espn', 'browser: committed fallback row is left for fetch-slate.js');
  br = c.recordSeasonEntries([{ ...nb, id: 'l1' }]);
  assert(br.added === 1 && c.loadSeasonLedger().find(x => x.id === 'l1').source === 'nb.ai', 'browser: its own fallback row is replaceable');
  br = c.recordSeasonEntries([{ ...espnRow, id: 'l1' }]);
  assert(br.added === 0, 'browser: an NB.AI row is final');
  c.localStorage.setItem(c.SEASON_LEDGER_STORAGE_KEY, JSON.stringify([{ ...committedRow, result: null }]));
  c.SEASON_LEDGER = [{ ...committedRow, result: { homeScore: 100, awayScore: 90 } }];
  assert((c.loadSeasonLedger().find(x => x.id === 'c1').result || {}).homeScore === 100, 'browser: a local null result never hides a committed result');
  c.localStorage.removeItem(c.SEASON_LEDGER_STORAGE_KEY);
}

// ── TEST 17: results by day ────────────────────────────────
console.log('TEST 17: results by day');
{
  const c = loadCtx(false, true);
  const row = (id, date, o) => ({ id, date, tip: date + 'T23:00Z', home: 'BOS', away: 'NY', pOurs: 0.6, marginOurs: 3, pFriend: null, pMarket: 0.55, spreadHome: -2, source: 'nb.ai', result: { homeScore: 104, awayScore: 100 }, ...o });
  const rows = [
    row('a', '2026-11-02', { pFriend: 0.4 }),                                                   // home by 4: ours off 1, market off 2, NB.AI wrong
    row('b', '2026-11-02', { result: { homeScore: 98, awayScore: 102 }, marginOurs: 2, spreadHome: -2, pFriend: 0.7 }), // away by 4: ours and market tie at off 6
    row('c', '2026-11-04', { source: 'espn', spreadHome: null, pMarket: 0.3 }),                // market margin implied from P
    row('d', '2026-11-04', { source: 'espn', result: null }),                                  // unsettled
  ];
  const R = c.seasonResultsByDay(rows);
  assert(R.days.length === 2 && R.days[0].date === '2026-11-04', 'days are newest first');
  const nov2 = R.days[1], nov4 = R.days[0];
  const [ga, gb] = nov2.games;
  assert(ga.calls.ours.correct && ga.calls.market.correct && !ga.calls.nbai.correct, 'winner checks follow each model\'s probability');
  near(ga.calls.ours.err, 1, 1e-9, 'ours margin miss');
  near(ga.calls.market.err, 2, 1e-9, 'market margin = minus the home spread');
  assert(ga.calls.nbai.implied && !ga.calls.ours.implied && !ga.calls.market.implied, 'only NB.AI margin is implied when a spread exists');
  near(ga.calls.nbai.margin, c.winProbToMargin(0.4), 1e-9, 'NB.AI margin implied from its P with the engine σ');
  assert(ga.closest.length === 1 && ga.closest[0] === 'ours', 'closest = smallest miss');
  assert(gb.closest.join() === 'ours,market', 'ties all count as closest');
  assert(!gb.calls.ours.correct && !gb.calls.market.correct && gb.calls.nbai.err === Math.abs(c.winProbToMargin(0.7) + 4), 'away win scored against every model');
  const s2 = nov2.summary;
  assert(s2.ours.n === 2 && s2.ours.winners === 1 && s2.ours.closest === 2 && s2.market.closest === 1 && s2.nbai.closest === 0, 'day summary tallies');
  assert(nov4.games.length === 1 && nov4.pending === 1 && nov4.source === 'espn', 'unsettled rows are counted, not scored');
  const gc = nov4.games[0];
  assert(gc.calls.nbai === null, 'no NB.AI call on a fallback row');
  assert(gc.calls.market.implied && gc.calls.market.margin < 0 && !gc.calls.market.correct, 'market without a spread: margin implied from P');
  assert(R.season.ours.n === 3 && R.season.nbai.n === 2 && R.season.market.n === 3, 'season counts only games each model forecast');
  near(R.season.ours.absErr / 3, (1 + 6 + Math.abs(3 - 4)) / 3, 1e-9, 'season margin miss');
  assert(c.seasonResultsByDay([row('x', '2026-11-05', { result: null })]).days.length === 0, 'a day with nothing settled is not shown');
  // Closest compares misses as displayed (0.1 pt): home won by 4; ours 8.04 (off 4.04) ties market 8 (off 4.0).
  const t = c.seasonResultsByDay([row('t', '2026-11-06', { marginOurs: 8.04, spreadHome: -8 })]).days[0].games[0];
  assert(t.calls.ours.errShown === 4 && t.calls.market.errShown === 4 && Math.abs(t.calls.ours.err - 4.04) < 1e-9 && t.closest.join() === 'ours,market', 'misses that display the same tie for closest');
  // A cell names the pick from P; if the margin favours the other side, the margin line names that team.
  const odd = c.seasonResultsByDay([row('o', '2026-11-06', { pMarket: 0.52, spreadHome: 0.5 })]).days[0].games[0];
  const oddHtml = c.seasonResultsGameRow(odd);
  assert(odd.calls.market.pickHome && odd.calls.market.correct, 'winner check uses the moneyline P even when the spread disagrees');
  assert(/<b>BOS<\/b> <span class="res-pct">52%<\/span>/.test(oddHtml) && /NY by 0\.5 · off 4\.5/.test(oddHtml), 'pick and margin are labelled separately when they disagree');
  const awayHtml = c.seasonResultsGameRow(gb);
  const flip = c.seasonResultsByDay([row('f', '2026-11-06', { pOurs: 0.5026, marginOurs: 0.08 })]).days[0].games[0];
  assert(/<b>BOS<\/b> <span class="res-pct">50\.3%<\/span>/.test(c.seasonResultsGameRow(flip)), 'a near coin-flip shows one decimal');
  assert(/<b>BOS<\/b> <span class="res-pct">70%<\/span>/.test(awayHtml) && /by ≈/.test(awayHtml) && /<b>NY by 4<\/b>/.test(awayHtml) && /NY 102 – BOS 98/.test(awayHtml), 'row shows the final, each pick with its %, and NB.AI\'s implied margin');
  // Rendering: one day at a time, arrows and a calendar to move between days.
  c.SEASON_LEDGER = rows.concat([row('e', '2026-11-05', { source: 'espn', result: null })]);   // recorded, not settled
  c.seasonState.tab = 'results';
  c.seasonState.results = { date: null, calOpen: false, calMonth: null };
  let hash = null;
  c.history = { replaceState: (a, b, u) => { hash = u; } };
  const games = h => (h.match(/class="res-game"/g) || []).length;
  const dayHtml = h => h.slice(h.indexOf('<section class="res-day">'), h.indexOf('</section>'));
  let html = c.renderResultsTab();
  assert(/Wednesday, Nov 4/.test(html) && games(html) === 1 && /ESPN fallback · no NB\.AI/.test(html) && /1 unsettled/.test(html) && /day 2 of 2/.test(html), 'opens on the latest day, showing only that day');
  assert(!/<th>NB\.AI<\/th>/.test(dayHtml(html)) && /<th>Market<\/th>/.test(dayHtml(html)), 'a day without NB.AI forecasts has no NB.AI column');
  assert(/seasonResultsStep\(1\)" disabled/.test(html) && !/seasonResultsStep\(-1\)" disabled/.test(html), 'next is disabled on the latest day, previous is not');
  assert(/Season to date/.test(html) && html.indexOf('Season to date') > html.indexOf('<section class="res-day">'), 'season totals sit below the day');
  c.seasonResultsStep(1);
  assert(c.seasonState.results.date === null && hash === null, 'next at the last day does nothing');
  c.seasonResultsStep(-1);
  html = c.renderResultsTab();
  assert(c.seasonState.results.date === '2026-11-02' && hash === '#results/2026-11-02', 'previous moves to the prior results day and updates the link');
  assert(/Monday, Nov 2/.test(html) && games(html) === 2 && /<th>NB\.AI<\/th>/.test(dayHtml(html)) && /seasonResultsStep\(-1\)" disabled/.test(html) && /day 1 of 2/.test(html), 'the earlier day shows its own games and NB.AI column');
  c.seasonResultsStep(-1);
  assert(c.seasonState.results.date === '2026-11-02', 'previous at the first day does nothing');
  c.seasonResultsStep(1);
  assert(c.seasonState.results.date === '2026-11-04', 'next moves to the following results day');
  c.seasonResultsToggleCal(true);
  html = c.renderResultsTab();
  assert(c.seasonState.results.calOpen && /November 2026/.test(html) && (html.match(/<button class="res-cal-day has/g) || []).length === 2, 'calendar lists the month with only results days clickable');
  assert(/res-cal-day has sel" onclick="seasonResultsGo\('2026-11-04'\)"/.test(html) && /<span class="res-cal-day wait"[^>]*>5</.test(html) && /<span class="res-cal-day">3</.test(html), 'calendar marks the selected day, an unsettled day and an off day');
  assert(/seasonResultsMonth\(-1\)" disabled/.test(html) && /seasonResultsMonth\(1\)" disabled/.test(html), 'month arrows stay inside the months with results');
  c.seasonResultsGo('2026-11-02');
  assert(!c.seasonState.results.calOpen && c.seasonState.results.date === '2026-11-02' && hash === '#results/2026-11-02', 'picking a calendar day selects it and closes the calendar');
  c.seasonState.results.date = '2026-11-03';
  assert(/Wednesday, Nov 4/.test(c.renderResultsTab()), 'a date without results falls back to the latest day');
  c.location = { hash: '#results/2026-11-02' };
  c.seasonState.results.date = null; c.seasonState.tab = 'tonight';
  c.seasonBoot();
  assert(c.seasonState.tab === 'results' && c.seasonState.results.date === '2026-11-02', 'a #results/<date> link opens that day');
  delete c.location; c.history = undefined;
  const sc = c.scoreForecasts(rows);
  assert(Math.round(sc.ours.accuracy * sc.ours.n) === R.season.ours.winners && Math.round(sc.market.accuracy * sc.market.n) === R.season.market.winners, 'winner tallies match the Ledger tab');
  c.SEASON_LEDGER = [];
  assert(/No settled games yet/.test(c.renderResultsTab()), 'empty ledger shows a note');
}

// ── TEST 18: committed season data files ───────────────────
console.log('TEST 18: team priors + user bet log');
{
  const c = loadCtx(false);
  const load = (rel) => vm.runInContext(fs.readFileSync(path.join(__dirname, rel), 'utf8').replace(/^(const|let) /gm, 'var '), c);
  load('js/season/data/team-priors.js');
  const pri = c.SEASON_TEAM_PRIORS;
  assert(Object.keys(pri).length === 30, 'team-priors.js has all 30 teams');
  assert(Object.entries(pri).every(([k, t]) => t.abbr === k && t.prior.ortg > 95 && t.prior.ortg < 130 && t.prior.drtg > 95 && t.prior.drtg < 130 && t.prior.pace > 90 && t.prior.pace < 110), 'every prior is a sane rating');
  const lg = c.deriveLeagueAverages(pri);
  assert(lg.derived && lg.teams === 30, 'league averages derive from the priors table');
  load('js/season/data/user-bets.js');
  const byId = Object.fromEntries(c.SEASON_LEDGER.map(r => [r.id, r]));
  const dec = a => a > 0 ? 1 + a / 100 : 1 + 100 / -a;
  c.SEASON_USER_BETS.forEach(b => {
    const legsOk = b.legs.every(l => {
      const r = byId[l.gameId];
      if (!r || !r.result || ![r.home, r.away].includes(l.team) || (l.side === 'home') !== (r.home === l.team)) return false;
      const won = l.side === 'home' ? r.result.homeScore > r.result.awayScore : r.result.awayScore > r.result.homeScore;
      return won === l.hit && Math.abs(l.pOurs - (l.side === 'home' ? r.pOurs : 1 - r.pOurs)) < 1e-3;
    });
    assert(legsOk, `${b.id}: every leg matches its ledger game, side, result and model P`);
    assert((b.result.outcome === 'win') === b.legs.every(l => l.hit) && b.result.legsHit === b.legs.filter(l => l.hit).length, `${b.id}: outcome follows its legs`);
    const d = b.legs.reduce((p, l) => p * dec(l.odds), 1);
    assert(Math.abs(dec(b.americanOdds) - d) / d < 0.01, `${b.id}: parlay odds are the product of the legs`);
  });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
