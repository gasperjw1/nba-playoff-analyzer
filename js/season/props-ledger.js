// ============================================================
// PROPS LEDGER — pre-tip player projections, graded from box scores
// ============================================================
// The moneyline ledger's counterpart for props. `fetch-slate.js --record`
// stores every rotation player's projection (props.js on the picks
// engine's slate — last season's ratings) before tip-off; `--settle`
// fills in the box score. Nothing here is judged against a price (there is
// no prop-line feed yet): it measures whether the projections and their
// spreads are calibrated at bettable lines, minutes included — a player who
// loses his minutes counts against the projection, as it would against a bet.
// Projections are conditional on playing (props.js does not scale by
// availability), matching DraftKings voiding a prop when the player sits.
//
// Rows: js/season/data/props-ledger.js (SEASON_PROPS_LEDGER). Like the
// game ledger, an ESPN-fallback game is replaced by a later pre-tip record;
// every other recorded game is final. Each row carries the props model
// version (SEASON_PROP.version); rows from before versioning are the first
// model (redistribution 0.80) — SEASON_PROPS_FIRST_VERSION.
const SEASON_PROPS_FIRST_VERSION = '2026-11-05.v1';
const propRowVersion = (r) => r.props || SEASON_PROPS_FIRST_VERSION;
// ============================================================
const SEASON_PROPS_STATS = ['pts', 'reb', 'ast', 'pra', 'tpm'];
const SEASON_PROPS_MIN_MINUTES = 8;   // the rotation the Tonight tab shows

// One game's rows. slate: the slate to project from (seasonCleanSlate for the picks engine).
function buildPropRows(game, slate, meta) {
  meta = meta || {};
  const rows = [];
  for (const [team, opp] of [[game.away, game.home], [game.home, game.away]]) {
    // rank: by projected minutes within the team (projectTeamProps sorts) — the ESPN fallback
    // slate marks no starters, so the record splits tiers on rank, not the feed's flag.
    for (const [i, p] of projectTeamProps(team, opp, slate).filter(x => x.min >= SEASON_PROPS_MIN_MINUTES).entries()) {
      const sd = {};
      SEASON_PROPS_STATS.forEach(s => { sd[s] = p.sd[s]; });
      rows.push({ id: `${game.id}:${p.id}`, game: game.id, date: slate.date, tip: game.tip, team, opp, player: p.id, name: p.name,
        starter: !!p.starter, rank: i + 1, avail: p.availability, min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, pra: p.pra, tpm: p.tpm, sd,
        source: slate.source || null, engine: meta.engine || null, props: SEASON_PROP.version, recordedAt: meta.recordedAt || null, result: null });
    }
  }
  return rows;
}

// Merge `entries` into `rows` in place, a game at a time: never after tip-off; a game already
// recorded is kept unless all its rows are an unsettled ESPN fallback.
function mergePropRows(rows, entries, now) {
  let added = 0, replaced = 0, late = 0;
  const byGame = new Map();
  entries.forEach(e => byGame.set(e.game, (byGame.get(e.game) || []).concat(e)));
  for (const [game, es] of byGame) {
    if (es[0].tip && new Date(es[0].tip) <= now) { late += es.length; continue; }
    const have = rows.filter(r => r.game === game);
    if (have.length && !have.every(r => r.source === 'espn' && !r.result)) continue;
    for (let i = rows.length - 1; i >= 0; i--) if (rows[i].game === game) rows.splice(i, 1);
    rows.push(...es);
    if (have.length) replaced += es.length; else added += es.length;
  }
  return { added, replaced, late };
}

// "Jaren Jackson Jr." / "Nikola Jokić" → "jaren jackson" / "nikola jokic" (for a box score whose ids differ).
function _propNameKey(name) {
  return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[.'’`]/g, '').replace(/-/g, ' ').replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '').replace(/\s+/g, ' ').trim();
}

// box: adaptEspnBox(summary) for the final game. Matched by player id, else by name within the
// team (matchedBy: 'name'). A player missing from the box or who did not play is settled as such
// (min 0) — DraftKings voids those props, so the record counts them apart. A team with no box
// score yet is left open (a later --settle retries), so a missing box never reads as did-not-play.
function settlePropRows(rows, game, box, settledAt) {
  let n = 0;
  for (const r of rows.filter(x => x.game === game && !x.result)) {
    const team = box[r.team] || [];
    if (!team.length) continue;
    let b = team.find(x => x.id === r.player), by = 'id';
    if (!b) { const k = _propNameKey(r.name), m = team.filter(x => _propNameKey(x.name) === k); if (m.length === 1) { b = m[0]; by = 'name'; } }
    const l = b && b.played ? b.line : null;
    r.result = l ? { played: true, min: l.min, pts: l.pts, reb: l.reb, ast: l.ast, pra: l.pts + l.reb + l.ast, tpm: l.tpm, settledAt }
      : { played: false, min: 0, reason: b ? b.reason : 'not in box score', settledAt };
    if (b && by === 'name') r.result.matchedBy = 'name';
    n++;
  }
  return n;
}

// The bettable half-point lines each projection is checked at (probOver, props.js):
//   proj    the half-point line nearest the projection        (model ~50% over)
//   p75     the highest half-point line the model has ≥ 75% over
//   floor   the highest half-point line the model has ≥ 90% over — a floor leg's deep alternate
// A line below 0.5 is not offered, so a projection without one is left out of that check.
const SEASON_PROPS_LINES = { proj: null, p75: 0.6745, floor: 1.2816 };
function propCheckLine(mean, sd, kind) {
  const z = SEASON_PROPS_LINES[kind];
  const line = z == null ? Math.round(mean - 0.5) + 0.5 : Math.floor(mean - z * sd - 0.5) + 0.5;   // highest half-point ≤ mean − z·sd
  return line >= 0.5 ? line : null;
}

// Calibration of the settled rows, over players who played. Per stat: MAE and bias (actual −
// projection), and at each check line (propCheckLine) the share that went over against the
// model's own average probability of over at those lines — calibrated when they match, which
// holds for whole-number stats too (the probability carries the same half-point correction).
// Minutes: MAE, did-not-play share against the share the listed availability implied, and the
// share playing under 70% of projected minutes. opts.filter: row predicate.
function seasonPropsRecord(rows, opts) {
  const keep = (opts && opts.filter) || (() => true);
  const settled = (rows || []).filter(r => r.result && keep(r)), played = settled.filter(r => r.result.played);
  const r3 = (x) => +x.toFixed(3);
  const stats = {};
  for (const s of SEASON_PROPS_STATS) {
    const ok = played.filter(r => r[s] != null && r.sd && r.sd[s] > 0);
    if (!ok.length) { stats[s] = { n: 0 }; continue; }
    const st = { n: ok.length, mae: +(ok.reduce((a, r) => a + Math.abs(r.result[s] - r[s]), 0) / ok.length).toFixed(2),
      bias: +(ok.reduce((a, r) => a + r.result[s] - r[s], 0) / ok.length).toFixed(2) };
    for (const kind of Object.keys(SEASON_PROPS_LINES)) {
      let n = 0, over = 0, exp = 0;
      for (const r of ok) {
        const line = propCheckLine(r[s], r.sd[s], kind);
        if (line == null) continue;
        n++; exp += probOver(r[s], r.sd[s], line); if (r.result[s] > line) over++;
      }
      st[kind] = n ? { n, over: r3(over / n), expected: r3(exp / n) } : { n: 0 };
    }
    stats[s] = st;
  }
  const minErr = played.map(r => Math.abs(r.result.min - r.min));
  return {
    n: settled.length, played: played.length, games: new Set(settled.map(r => r.game)).size, stats,
    minutes: {
      mae: minErr.length ? +(minErr.reduce((a, b) => a + b, 0) / minErr.length).toFixed(1) : null,
      dnp: settled.length ? r3((settled.length - played.length) / settled.length) : null,
      dnpExpected: settled.length ? r3(settled.reduce((a, r) => a + (1 - (r.avail != null ? r.avail : 1)), 0) / settled.length) : null,
      short: played.length ? r3(played.filter(r => r.result.min < 0.7 * r.min).length / played.length) : null,
    },
  };
}
