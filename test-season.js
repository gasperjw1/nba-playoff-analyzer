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

// A two-team synthetic slate with controllable inputs.
function makePlayer(id, name, min, pts, reb, ast, extra) {
  return { id, name, pos: 'G', status: 'Available', availability: 1, projMin: min, starter: min >= 28, depthRank: 1,
    avg: { min, pts, reb, ast, tpm: pts * 0.08, stl: 1, blk: 0.5, to: 2, fgm: pts * 0.36, fga: pts * 0.78, ftm: pts * 0.15, fta: pts * 0.18, tpa: pts * 0.22 },
    games: 60, h2h: null, recent: null, ...(extra || {}) };
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
function makeSlate() {
  const A = makeTeam('AAA', 114.5, 114.5, 99, rotation('a'));
  const B = makeTeam('BBB', 114.5, 114.5, 99, rotation('b'));
  return { source: 'test', date: '2026-11-01', fetchedAt: null, modelVersion: 't', league: { ortg: 114.5, pace: 99, derived: false },
    teams: { AAA: A, BBB: B }, games: [{ id: 'g1', tip: '2099-01-01T00:00Z', venue: null, home: 'AAA', away: 'BBB', market: { mlHome: -150, mlAway: 130, spreadHome: -3, total: 228, book: 'T' }, external: { nbai: { pHome: 0.62 } } }] };
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
  near(s0.net, 8, 0.01, 'no current games → prior × retention (10 × 0.8)');
  assert(s0.currentWeight === 0, 'weight 0 with no games');
  t.current = { ppg: 100, papg: 110, games: 20 };                 // −10 per game this season
  const s20 = c.calcSeasonTeamStrength(t, league);
  near(s20.currentWeight, 0.5, 1e-6, 'K=20 → half weight at 20 games');
  near(s20.net, 0.5 * (-10) + 0.5 * 8, 0.05, 'blend of current and prior');
  t.current = { ppg: 100, papg: 110, games: 82 };
  assert(c.calcSeasonTeamStrength(t, league).currentWeight > 0.8, 'full season dominates');
}

console.log('TEST 3: availability impact scale');
{
  const c = loadCtx(false);
  const mvp = makePlayer('m', 'MVP', 34, 32, 5, 6, { avg: { min: 34, pts: 32, reb: 5, ast: 6, tpm: 2, stl: 1.5, blk: 1, to: 2.5, fgm: 11, fga: 22, ftm: 8, fta: 9, tpa: 6 } });
  const imp = c.playerImpactPts(mvp);
  assert(imp > 6 && imp < 10, `MVP-level absence worth 6-10 pts (got ${imp.toFixed(2)})`);
  const role = makePlayer('r', 'Role', 28, 12, 4, 2, { avg: { min: 28, pts: 12, reb: 4, ast: 2, tpm: 1.5, stl: 0.8, blk: 0.4, to: 1.2, fgm: 4.5, fga: 10, ftm: 1.6, fta: 2, tpa: 4 } });
  const ri = c.playerImpactPts(role);
  assert(ri > 1 && ri < 3.5, `solid starter 1-3.5 pts (got ${ri.toFixed(2)})`);
  const bench = makePlayer('b', 'Bench', 6, 2, 1, 0.5);
  assert(c.playerImpactPts(bench) === 0, 'sub-8-minute players ignored');
  const team = makeTeam('T', 114, 114, 99, [{ ...mvp, availability: 0 }, { ...role, availability: 0.5 }, bench]);
  const a = c.calcAvailabilityImpact(team);
  near(a.loss, imp + 0.5 * ri, 0.01, 'team loss sums (1 − availability) × impact');
  assert(a.missing[0].name === 'MVP', 'missing list sorted by loss');
  const many = makeTeam('T', 114, 114, 99, Array.from({ length: 6 }, (_, i) => ({ ...mvp, id: 'm' + i, availability: 0 })));
  assert(c.calcAvailabilityImpact(many).loss === c.SEASON_IMPACT.teamCap, 'team cap applies');
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
  const slate = makeSlate();
  const p = c.projectSeasonGame(slate.games[0], slate);
  near(p.margin, c.SEASON_HCA, 1e-6, 'equal teams → margin = HCA');
  near(p.pHome, c.marginToWinProb(c.SEASON_HCA), 1e-4, 'pHome from margin');
  assert(p.homeScore - p.awayScore === Math.round(p.margin) || Math.abs((p.homeScore - p.awayScore) - p.margin) <= 1, 'score reproduces margin');
  near(p.total, 2 * 114.5 * 99 / 100, 0.5, 'league-average teams → league-average total');
  assert(p.lineage.length >= 2 && p.lineage[0].step === 'strength', 'lineage recorded');

  slate.teams.AAA.prior.ortg = 119.5;  // +5 net home
  const p2 = c.projectSeasonGame(slate.games[0], slate);
  near(p2.margin, c.SEASON_HCA + 5 * 0.8 * 99 / 100, 0.01, 'net rating gap × pace, prior shrunk');
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
  const slate = makeSlate();
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
  const slate = makeSlate();
  const g = slate.games[0];
  const proj = c.projectSeasonGame(g, slate);
  const blend = c.blendGameForecast({ pOurs: proj.pHome, pFriend: 0.62, mlHome: -150, mlAway: 130 });
  const e = c.buildLedgerEntry(g, proj, blend, slate);
  assert(e.id === 'g1' && e.pFriend === 0.62 && e.spreadHome === -3 && e.result === null && e.recordedAt, 'entry built');
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
        players: [{ id: 'p1', name: 'Paolo Banchero', pos: 'F', status: 'Out', seasonAverage: [34, 25, 7, 5, 1.5, 0.8, 0.6, 3, 9, 20, 6, 8, 5], projectedMinutes: 0.6, availability: 0, expectedStarter: false, depthRank: 6, h2h: { pts: 22.7, reb: 6.3, ast: 4.4, n: 12 }, seasonGames: 2, priorGames: 72 },
          { id: 'p2', name: 'Desmond Bane', pos: 'G', status: 'Available', seasonAverage: [33.6, 17.2, 4, 2.8, 3.2, 0.8, 1, 2.4, 4.8, 14.2, 4.4, 5.2, 9.6], projectedMinutes: 37.3, availability: 1, expectedStarter: true, depthRank: 1 }] },
      '2': { id: '2', abbreviation: 'BOS', name: 'Celtics', location: 'Boston', ppg: 116.2, papg: 107.6, games: 82, pace: 98.8, factors: { restDays: 2, recentGames: 5, recentPPG: 118, recentPAPG: 110 },
        players: [{ id: 'p3', name: 'Jayson Tatum', pos: 'F', status: 'Questionable', seasonAverage: [36, 27, 8.5, 5, 3, 1, 0.5, 2.8, 9, 20, 6, 7, 9], projectedMinutes: 35, expectedStarter: true, depthRank: 1 }] } } } };
  const rankings = { markets: [{ kind: 'ml', gameId: '1', side: 'away', p: 0.5628 }, { kind: 'ml', gameId: '1', side: 'home', p: 0.4372 }, { kind: 'spread', gameId: '1', side: 'home', p: 0.5 }] };
  const s = c.adaptNbaiSlate(saved, rankings);
  assert(s.games.length === 1 && s.games[0].home === 'ORL' && s.games[0].away === 'BOS', 'ids mapped to abbreviations');
  assert(s.games[0].market.spreadHome === 7.5 && s.games[0].market.mlHome === 220 && s.games[0].market.total === 221.5, 'market mapped');
  near(s.games[0].external.nbai.pHome, 0.4372, 1e-6, 'friend home prob');
  near(s.teams.ORL.prior.ortg, 111.08, 1e-6, 'offRating used as prior ORtg');
  near(s.teams.BOS.prior.ortg, 116.2 / 98.8 * 100, 1e-6, 'ppg/pace fallback');
  assert(s.teams.ORL.current.games === 5 && s.teams.ORL.current.ppg === 109.8, 'current season from recent factors');
  assert(s.teams.ORL.players[0].availability === 0 && s.teams.ORL.players[0].avg.pts === 25, 'player normalized');
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
    ['tonight', 'lab', 'ledger', 'data'].forEach(t => c.seasonSetTab(t));
    if (c.seasonState.slate && c.seasonState.slate.games.length) {
      c.seasonToggleGame(c.seasonState.slate.games[0].id);
      c.seasonSetTab('tonight');
      c.seasonRecordTonight();
    }
  } catch (e) { ok = false; console.error('  boot error:', e.stack); }
  assert(ok, 'season UI boots and renders every tab');
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
