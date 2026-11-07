#!/usr/bin/env node
// ============================================================
// parlay-check.js — check a ticket from the command line (js/season/parlay.js)
// ============================================================
// The same checker as the site's Parlay tab, on the committed slate
// (js/season/data/slate-snapshot.js), for tickets reported in chat.
//
//   node parlay-check.js "NY" "POR +171" "Harper pra o15.5 -400" [--odds +450]
//
// A leg is either a team — abbreviation, nickname or full name: NY, NYK, Knicks,
// "New York Knicks" — (its moneyline; DraftKings' price unless odds follow)
// or a player: name words, a stat (pts, reb, ast, pra, 3pm), o/u + line, the
// odds, and optionally the other side's odds. --odds is the parlay price as
// quoted; without it the legs' prices are multiplied. Never a stake size.
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadContext() {
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error, Intl });
  const load = (rel) => vm.runInContext(fs.readFileSync(path.join(__dirname, rel), 'utf8').replace(/^(const|let) /gm, 'var '), ctx, { filename: rel });
  for (const f of ['js/season/data/season-constants.js', 'js/season/data/player-priors.js', 'js/season/data/chemistry-fit.js', 'js/season/data/aging-fit.js',
    'js/season/data/team-ratings.js', 'js/season/adapters.js', 'js/season/engine.js', 'js/season/props.js', 'js/season/ensemble.js', 'js/season/trust.js',
    'js/season/ledger.js', 'js/season/props-ledger.js', 'js/season/parlay.js', 'js/season/replay-core.js', 'js/season/data/season-ledger.js', 'js/season/data/slate-snapshot.js']) load(f);
  return ctx;
}

const STAT = { pts: 'pts', points: 'pts', reb: 'reb', rebounds: 'reb', ast: 'ast', assists: 'ast', pra: 'pra', '3pm': 'tpm', tpm: 'tpm', threes: 'tpm' };
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[.'’]/g, '');

// Team names → ESPN abbreviation: full names, nicknames and unambiguous cities from the official
// report's names (replay-core.js REPLAY_TEAM_BY_NAME), plus other sites' abbreviations.
const ALT_ABBR = { NYK: 'NY', GSW: 'GS', SAS: 'SA', NOP: 'NO', UTA: 'UTAH', WAS: 'WSH', PHO: 'PHX', BRK: 'BKN', CHO: 'CHA', SIXERS: 'PHI', BLAZERS: 'POR', CAVS: 'CLE', MAVS: 'DAL', WOLVES: 'MIN', PELS: 'NO' };
function teamAliases(byName) {
  const a = {}, cities = {};
  for (const [name, ab] of Object.entries(byName || {})) {
    const words = norm(name).split(' ');
    a[words.join(' ')] = ab;
    a[words[words.length - 1]] = ab;                          // "knicks", "76ers"
    if (words.length > 2) a[words.slice(-2).join(' ')] = ab;   // "trail blazers"
    const city = words.slice(0, -1).join(' ');
    (cities[city] = cities[city] || new Set()).add(ab);
  }
  for (const [city, abs] of Object.entries(cities)) if (abs.size === 1 && !(city in a)) a[city] = [...abs][0];   // "new york"; not "los angeles"
  for (const [k, ab] of Object.entries(ALT_ABBR)) a[k.toLowerCase()] = ab;
  return a;
}

// One leg's text → a parlay.js leg (throws with a reason on anything ambiguous).
function parseLeg(text, slate, clean, aliases) {
  const tok = text.trim().split(/\s+/);
  const isOdds = (t) => /^[+-]\d{3,}$/.test(t);
  const si = tok.findIndex(t => STAT[t.toLowerCase()]);
  // Team moneyline: "NY", "Knicks -204", "ml New York Knicks" — no stat in the text.
  if (si < 0) {
    const t = tok.slice(tok[0].toLowerCase() === 'ml' ? 1 : 0);
    const odds = t.length > 1 && isOdds(t[t.length - 1]) ? Number(t.pop()) : null;
    const key = norm(t.join(' ')), ab = (aliases || {})[key] || t.join('').toUpperCase();
    const g = slate.games.find(x => x.home === ab || x.away === ab);
    if (g) return { type: 'ml', game: g.id, side: g.home === ab ? 'home' : 'away', odds };
    const isTeam = Object.values(aliases || {}).includes(ab);
    throw new Error(`"${text}": ${isTeam ? `${ab} is not playing on the ${slate.date} slate` : 'expected a team, or "<player> <stat> o|u<line> <odds>"'}`);
  }
  if (si < 1) throw new Error(`"${text}": name the player before the stat`);
  const m = /^([ou])(\d+(?:\.\d+)?)$/i.exec(tok[si + 1] || '');
  if (!m) throw new Error(`"${text}": after the stat, write o or u and the line (e.g. o21.5)`);
  const odds = tok[si + 2], other = tok[si + 3];
  if (!isOdds(odds || '')) throw new Error(`"${text}": the odds for the prop are missing (e.g. -110)`);
  const words = tok.slice(0, si).map(norm);
  const hits = [];
  for (const g of slate.games) for (const ab of [g.home, g.away]) for (const p of clean.teams[ab].players)
    if (words.every(w => norm(p.name).split(/\s+/).some(part => part.startsWith(w)))) hits.push({ g, p });
  if (hits.length !== 1) throw new Error(`"${text}": ${hits.length ? `${hits.length} players match (${hits.map(h => h.p.name).join(', ')}) — add more of the name` : 'no player on tonight\'s slate matches'}`);
  return { type: 'prop', game: hits[0].g.id, player: hits[0].p.id, stat: STAT[tok[si].toLowerCase()], dir: m[1].toLowerCase() === 'o' ? 'over' : 'under',
    line: Number(m[2]), odds: Number(odds), oddsOther: other && isOdds(other) ? Number(other) : null };
}

function main() {
  const args = process.argv.slice(2);
  const oi = args.indexOf('--odds');
  const offered = oi >= 0 ? args[oi + 1] : null;
  const legsText = oi >= 0 ? args.filter((a, i) => i !== oi && i !== oi + 1) : args;
  if (!legsText.length) { console.log('usage: node parlay-check.js "NY" "POR +171" "Harper pra o15.5 -400" [--odds +450]'); process.exitCode = 1; return; }
  const ctx = loadContext();
  const slate = ctx.SEASON_SLATE_SNAPSHOT, clean = ctx.seasonCleanSlate(slate) || slate;
  let legs;
  const aliases = teamAliases(ctx.REPLAY_TEAM_BY_NAME);
  try { legs = legsText.map(t => parseLeg(t, slate, clean, aliases)); } catch (e) { console.error(e.message); process.exitCode = 1; return; }
  const t = ctx.evaluateParlay(legs, slate, offered);
  const pct = (x) => x == null ? '—' : (x * 100).toFixed(1) + '%';
  console.log(`Slate ${slate.date} (${slate.source}), picks engine ${ctx.SEASON_ENGINE_VERSION}, props model ${ctx.SEASON_PROP.version}`);
  t.legs.forEach((l, i) => {
    if (l.error) { console.log(`  ${i + 1}. ERROR ${l.error}`); return; }
    console.log(`  ${i + 1}. ${l.label} (${l.matchup}) ${ctx.parlayFmtOdds(l.odds)}  model ${pct(l.p)}  DraftKings ${l.pMarket != null ? pct(l.pMarket) + ' no-vig' : pct(l.pImplied) + ' vig in'}` +
      (l.mean != null ? `  [projection ${l.mean.toFixed(1)} ± ${l.sd.toFixed(1)}, ${l.min.toFixed(0)} min]` : ''));
    for (const f of l.flags) console.log(`       ${f.level === 'warn' ? '!' : f.level === 'good' ? '+' : '·'} ${f.text}`);
  });
  if (!t.ok) { process.exitCode = 1; return; }
  console.log(`  Ticket: model ${pct(t.p)} (fair ${t.fairAmerican != null ? ctx.parlayFmtOdds(t.fairAmerican) : '—'}${t.sameGame.length ? ', same-game legs: approximate' : ''}) · price ${ctx.parlayFmtOdds(t.american)} ${t.offered != null ? 'as quoted' : 'from the legs'} (break-even ${pct(t.pBook)})` +
    ` · DraftKings no-vig ${pct(t.pMarket)} · expected return ${t.ev >= 0 ? '+' : ''}${(t.ev * 100).toFixed(1)}% per unit if the model is right (unproven)`);
}

if (require.main === module) main();
module.exports = { parseLeg, teamAliases };
