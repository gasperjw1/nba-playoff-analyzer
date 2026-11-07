#!/usr/bin/env node
// ============================================================
// backtest-props.js — prop projections on the walk-forward replay
// ============================================================
// Every past game's rotation, projected the way the props ledger records
// it (js/season/props-ledger.js buildPropRows on props.js), from the
// replay's leak-free teams (replay-season.js predictDay: this season's box
// scores before the day, rosters as of that morning, the official injury
// report 60+ minutes before tip). Box scores are attached after, for
// scoring only, and graded with the ledger's own seasonPropsRecord.
//
// Minutes are each player's average this season before the day (as the
// ESPN fallback slate projects them) — NB.AI's minutes cannot be replayed —
// so a player's first game of the season is never projected.
//
//   node backtest-props.js            coverage only (rows, games, players; no accuracy)
//   node backtest-props.js --check    leak checks: later box scores scrambled → identical rows
//   node backtest-props.js --score    calibration per variant — refuses to run unless this
//                                     file and the files it projects with are committed
//   [--to YYYY-MM-DD]                 last day (default: yesterday, ET)
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const R = require('./replay-season.js');

// ── Pre-registered spec (frozen before the first scored run) ─────────
// Variants were chosen after reconstructing one night (Nov 6, NB.AI's pre-tip snapshot): stars ran
// high — Gilgeous-Alexander's points +24% from the absent-teammate step (redistribution), Embiid's
// baseline above his season. Not blind to that night; Nov 6 is inside this backtest.
const SPEC = {
  version: 'props-1',
  replay: R.SPEC.version, engine: R.SPEC.engine,
  variants: {
    base: 'props.js as recorded (redistribution 0.80, absent players weighted by rating share)',
    redist40: 'redistribution 0.40',
    redist0: 'no redistribution',
    curShare: 'redistribution 0.80, absent players weighted by this season\'s share only (out since before the season frees nothing)',
  },
  diagnostic: { actualMinutes: 'base at each player\'s actual minutes — rate error alone, not bettable' },
  // Judged on PRA (the floor stat) and PTS: bias, MAE, and over-rates at the ledger's three check
  // lines against the model's own probability; tiers by projected-minutes rank (1–2, 3–5, 6+).
  primary: 'PRA over the 90% floor vs the model\'s probability, all players and rank 1–2',
};
const SPEC_FILES = ['backtest-props.js', 'replay-season.js', 'js/season/replay-core.js', 'js/season/props.js', 'js/season/props-ledger.js',
  'js/season/engine.js', 'js/season/data/season-constants.js', 'js/season/adapters.js', 'js/season/data/player-priors.js', 'js/season/data/team-ratings.js'];

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const todayEt = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

function loadContext() {
  const ctx = R.loadContext();
  for (const f of ['js/season/props.js', 'js/season/props-ledger.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx, { filename: f });
  ctx._origRedistribution = ctx.calcRedistribution;
  ctx._origRedist = ctx.SEASON_PROP.redistribution;
  return ctx;
}
function setVariant(ctx, v) {
  ctx.SEASON_PROP.redistribution = v === 'redist40' ? 0.40 : v === 'redist0' ? 0 : ctx._origRedist;
  ctx.calcRedistribution = v === 'curShare' ? (team, ov, cw, cg) => ctx._origRedistribution(team, ov, 1, cg) : ctx._origRedistribution;
}

// One day's rows for one variant: the replay's teams for the day (built once per store and day;
// the variants change only the projection), the ledger's row builder.
const teamsCache = new WeakMap();
function dayTeams(ctx, store, date) {
  const m = teamsCache.get(store) || new Map();
  teamsCache.set(store, m);
  if (!m.has(date)) m.set(date, R.predictDay(ctx, store, date, true).teams);
  return m.get(date);
}
function dayRows(ctx, store, date, variant, actualMinutes) {
  setVariant(ctx, variant);
  const teams = dayTeams(ctx, store, date);
  const slate = { date, source: 'replay', teams, league: ctx.deriveLeagueAverages(ctx.SEASON_TEAM_RATINGS.teams) };
  const rows = [];
  for (const g of store.schedule[date] || []) {
    if (!teams[g.home] || !teams[g.away]) continue;
    if (!actualMinutes) { rows.push(...ctx.buildPropRows(g, slate, { engine: SPEC.engine, recordedAt: 'replay' })); continue; }
    // Diagnostic: the same players, each at the minutes he actually played (rate error alone).
    // A player under 5 actual minutes has no projection there (props.js) and drops out.
    const night = store.regGames.find(x => x.id === g.id);
    for (const r of ctx.buildPropRows(g, slate, {})) {
      const b = night && (night.box[r.team] || []).find(x => x.id === r.player);
      if (!b || !b.played) { rows.push(r); continue; }
      const p = ctx.projectPlayerProps(teams[r.team].players.find(x => x.id === r.player), teams[r.team], teams[r.opp], slate, { minutesOverride: { [r.player]: b.line.min } });
      if (p) rows.push({ ...r, min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, pra: p.pra, tpm: p.tpm, sd: { pts: p.sd.pts, reb: p.sd.reb, ast: p.sd.ast, pra: p.sd.pra, tpm: p.sd.tpm } });
    }
  }
  setVariant(ctx, 'base');
  return rows;
}

function settle(ctx, store, rows) {
  const byId = new Map(store.regGames.map(g => [g.id, g]));
  for (const id of new Set(rows.map(r => r.game))) { const g = byId.get(id); if (g) ctx.settlePropRows(rows, id, g.box, 'replay'); }
  return rows;
}

function specCommitted() {
  try {
    execFileSync('git', ['diff', '--quiet', 'HEAD', '--', ...SPEC_FILES], { cwd: __dirname });
    return execFileSync('git', ['ls-files', '--', ...SPEC_FILES], { cwd: __dirname }).toString().trim().split('\n').filter(Boolean).length === SPEC_FILES.length;
  } catch (e) { return false; }
}

const pct = (x) => x == null ? '  — ' : `${(x * 100).toFixed(0).padStart(3)}%`;
function lineCell(c) { return c && c.n ? `${pct(c.over)} vs ${pct(c.expected)} (${c.n})` : '—'; }
function report(ctx, label, rows) {
  const tiers = [['all', () => true], ['rank 1–2', r => r.rank <= 2], ['rank 3–5', r => r.rank >= 3 && r.rank <= 5], ['rank 6+', r => r.rank >= 6]];
  console.log(`\n${label}`);
  for (const [t, f] of tiers) {
    const rec = ctx.seasonPropsRecord(rows, { filter: f });
    for (const s of ['pra', 'pts']) {
      const st = rec.stats[s];
      if (!st.n) continue;
      console.log(`  ${t.padEnd(9)} ${s.toUpperCase().padEnd(3)} n ${String(st.n).padStart(5)}  bias ${(st.bias >= 0 ? '+' : '') + st.bias.toFixed(2)}  MAE ${st.mae.toFixed(2)}  proj-line ${lineCell(st.proj)}  75% ${lineCell(st.p75)}  floor ${lineCell(st.floor)}`);
    }
  }
  const m = ctx.seasonPropsRecord(rows).minutes;
  console.log(`  minutes MAE ${m.mae}  did not play ${pct(m.dnp)} (availability implied ${pct(m.dnpExpected)})  under 70% of projected ${pct(m.short)}`);
}

async function main() {
  const ctx = loadContext();
  const lastDay = opt('--to', R.addDays(todayEt(), -1));
  const store = await R.buildStore(ctx, lastDay);
  await R.loadReports(store);
  const dayList = R.days(R.SPEC.firstDay, lastDay).filter(d => (store.schedule[d] || []).length);
  console.log(`Props backtest ${SPEC.version} on replay ${SPEC.replay} (engine ${SPEC.engine}): ${dayList[0]} → ${lastDay}, ${dayList.length} days`);

  if (has('--check')) {
    // Later results must not reach a day's projections: scramble every box score and score on or
    // after the day; the rows must be identical. Control: scrambling earlier box scores changes them.
    const scramble = (s, test) => ({ ...s, regGames: s.regGames.map(g => test(g) ? { ...g, homeScore: 1, awayScore: 2,
      box: Object.fromEntries(Object.entries(g.box).map(([ab, ps]) => [ab, ps.map(p => ({ ...p, line: Object.fromEntries(Object.keys(p.line || {}).map(k => [k, 7])) }))])) } : g) });
    const sample = [dayList[3], dayList[Math.floor(dayList.length / 2)], dayList[dayList.length - 1]];
    let ok = true;
    for (const d of sample) for (const v of Object.keys(SPEC.variants)) {
      const full = JSON.stringify(dayRows(ctx, store, d, v)), later = JSON.stringify(dayRows(ctx, scramble(store, g => g.date >= d), d, v));
      ok = ok && full === later;
      if (v === 'base') console.log(`  ${d}: later box scores scrambled → ${full === later ? 'identical' : 'DIFFERENT'}`);
    }
    const d = dayList[dayList.length - 1];
    const control = JSON.stringify(dayRows(ctx, store, d, 'base')) !== JSON.stringify(dayRows(ctx, scramble(store, g => g.date < d), d, 'base'));
    console.log(`  control: scrambling earlier box scores ${control ? 'changes' : 'DOES NOT change'} the rows`);
    console.log(ok && control ? 'Leak checks passed.' : 'LEAK CHECK FAILED');
    process.exitCode = ok && control ? 0 : 1;
    return;
  }

  const rows = {};
  for (const v of Object.keys(SPEC.variants)) rows[v] = settle(ctx, store, dayList.flatMap(d => dayRows(ctx, store, d, v)));
  const base = rows.base, settled = base.filter(r => r.result);
  console.log(`  ${base.length} player-games projected in ${new Set(base.map(r => r.game)).size} games (${settled.length} settled, ${settled.filter(r => r.result.played).length} played); per day: ${dayList.map(d => base.filter(r => r.date === d).length).join(' ')}`);
  if (!has('--score')) { console.log('Coverage only. Commit the spec, then run --score.'); return; }
  if (!specCommitted()) { console.error(`--score refused: commit ${SPEC_FILES.join(', ')} first (the spec must be frozen before scoring)`); process.exitCode = 1; return; }

  for (const [v, label] of Object.entries(SPEC.variants)) report(ctx, `${v} — ${label}`, rows[v]);
  report(ctx, `diagnostic actualMinutes — ${SPEC.diagnostic.actualMinutes}`, settle(ctx, store, dayList.flatMap(d => dayRows(ctx, store, d, 'base', true))));
  const out = path.join(__dirname, '.cache', 'props-backtest.json');
  fs.writeFileSync(out, JSON.stringify({ spec: SPEC, rows }, null, 0));
  console.log(`\nRows written to ${path.relative(__dirname, out)} (gitignored cache).`);
}

module.exports = { SPEC, loadContext, dayRows };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
