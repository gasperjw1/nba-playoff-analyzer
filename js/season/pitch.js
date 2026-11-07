// ============================================================
// PITCHED TICKETS — spec pitch-1 (PITCH_SPEC.md)
// ============================================================
// Two tickets a night from the slate, recorded before tip-off by
// `fetch-slate.js --record` (js/season/data/pitch-ledger.js) and graded by
// `--settle`, so each recipe earns its own record:
//   floor   3 points/PRA overs at the props model's 90% line, starters with
//           28+ projected minutes, one leg per game (the main recipe)
//   edge    2–3 moneylines 8+ pp over DraftKings' no-vig price, each shown
//           at DraftKings' chance plus 45% of the gap (an experiment)
// The rules here are the frozen spec; change them only as a new spec
// (pitch-2) with its own dates. Never a stake size.
//
// Uses (globals): seasonCleanSlate (ledger.js), projectTeamProps, probOver
// (props.js), propCheckLine, SEASON_PROPS_MIN_MINUTES, _propNameKey
// (props-ledger.js), projectSeasonGame (engine.js), seasonTrustCheck,
// _noVigHome (trust.js), parlayDecimal, parlayAmerican (parlay.js).
// ============================================================
const SEASON_PITCH_SPEC = {
  version: 'pitch-1', frozen: '2026-11-07', firstNight: '2026-11-08',
  floor: { legs: 3, maxRank: 5, minMinutes: 28, stats: ['pra', 'pts'], realisticFloor: 0.5 },
  edge: { minEdge: 0.08, share: 0.45, minLegs: 2, maxLegs: 3 },
};

function _pitchClean(slate) { return (typeof seasonCleanSlate === 'function' && seasonCleanSlate(slate)) || slate; }
const _pitchOpen = (g, now) => !g.tip || new Date(g.tip).getTime() > now;
const _pitchProduct = (legs) => legs.reduce((s, l) => s * l.p, 1);

// Every eligible floor leg on games not yet tipped at `now` (ms).
function pitchFloorCandidates(slate, now) {
  const F = SEASON_PITCH_SPEC.floor, clean = _pitchClean(slate), out = [];
  for (const g of slate.games.filter(x => _pitchOpen(x, now))) {
    for (const [team, opp] of [[g.away, g.home], [g.home, g.away]]) {
      if (!clean.teams[team] || !clean.teams[opp]) continue;
      const rot = projectTeamProps(team, opp, clean).filter(p => p.min >= SEASON_PROPS_MIN_MINUTES);
      rot.slice(0, F.maxRank).forEach((p, i) => {
        if (p.min < F.minMinutes || p.availability !== 1) return;
        for (const stat of F.stats) {
          const line = propCheckLine(p[stat], p.sd[stat], 'floor');
          if (line == null || line < F.realisticFloor * p[stat]) continue;
          out.push({ type: 'prop', game: String(g.id), matchup: `${g.away} @ ${g.home}`, tip: g.tip, team, opp, player: String(p.id), name: p.name,
            stat, dir: 'over', line, mean: p[stat], sd: p.sd[stat], min: p.min, rank: i + 1, p: +probOver(p[stat], p.sd[stat], line).toFixed(4) });
        }
      });
    }
  }
  return out;
}

function buildFloorTicket(slate, now) {
  const F = SEASON_PITCH_SPEC.floor;
  const cands = pitchFloorCandidates(slate, now).sort((a, b) => b.min - a.min || b.line - a.line);
  const legs = [], used = new Set();
  for (const c of cands) { if (used.has(c.game)) continue; legs.push(c); used.add(c.game); if (legs.length === F.legs) break; }
  if (legs.length < F.legs) return { recipe: 'floor', status: 'no ticket', reason: `${legs.length} game${legs.length === 1 ? '' : 's'} with an eligible leg (needs ${F.legs})`, legs: [] };
  const p = _pitchProduct(legs);
  return { recipe: 'floor', status: 'pitched', legs, p: +p.toFixed(4), fairAmerican: parlayAmerican(1 / p), price: null, quote: null, result: null };
}

function buildEdgeTicket(slate, now) {
  const E = SEASON_PITCH_SPEC.edge, clean = _pitchClean(slate), cands = [];
  for (const g of slate.games.filter(x => _pitchOpen(x, now))) {
    const m = g.market || {};
    if (m.mlHome == null || m.mlAway == null) continue;
    const proj = projectSeasonGame(g, clean);
    const t = typeof seasonTrustCheck === 'function' ? seasonTrustCheck(proj, m) : null;
    if (t && t.rule === 'AVOID') continue;
    const kHome = _noVigHome(m.mlHome, m.mlAway);
    for (const side of ['home', 'away']) {
      const pm = side === 'home' ? proj.pHome : 1 - proj.pHome, pk = side === 'home' ? kHome : 1 - kHome;
      if (pm - pk < E.minEdge) continue;
      cands.push({ type: 'ml', game: String(g.id), matchup: `${g.away} @ ${g.home}`, tip: g.tip, side, team: side === 'home' ? g.home : g.away,
        odds: side === 'home' ? m.mlHome : m.mlAway, pModel: +pm.toFixed(4), pMarket: +pk.toFixed(4), p: +(pk + E.share * (pm - pk)).toFixed(4) });
    }
  }
  const legs = cands.sort((a, b) => (b.pModel - b.pMarket) - (a.pModel - a.pMarket)).slice(0, E.maxLegs);
  if (legs.length < E.minLegs) return { recipe: 'edge', status: 'no ticket', reason: `${legs.length} game${legs.length === 1 ? '' : 's'} with an 8+ pp edge (needs ${E.minLegs})`, legs: [] };
  const p = _pitchProduct(legs), dec = legs.reduce((s, l) => s * parlayDecimal(l.odds), 1);
  return { recipe: 'edge', status: 'pitched', legs, p: +p.toFixed(4), fairAmerican: parlayAmerican(1 / p), price: parlayAmerican(dec), quote: null, result: null };
}

// One night's pitch row. meta: { engine, props, recordedAt, now }.
function buildPitches(slate, meta) {
  meta = meta || {};
  const now = meta.now != null ? meta.now : Date.now();
  return { id: slate.date, date: slate.date, spec: SEASON_PITCH_SPEC.version, engine: meta.engine || null, props: meta.props || null,
    source: slate.source || null, recordedAt: meta.recordedAt || null, tickets: [buildFloorTicket(slate, now), buildEdgeTicket(slate, now)] };
}

// Add tonight's row to `rows` in place. A night is final once recorded, except an ESPN-fallback row
// none of whose legs has tipped (a later NB.AI record replaces it, as for the game ledger). A row
// whose legs have already tipped is never written.
function mergePitch(rows, entry, now) {
  const legs = (e) => e.tickets.flatMap(t => t.legs);
  const tipped = (e) => legs(e).some(l => l.tip && new Date(l.tip).getTime() <= now);
  if (tipped(entry)) return 'late';
  const at = rows.findIndex(r => r.date === entry.date);
  if (at < 0) { rows.push(entry); return 'added'; }
  const old = rows[at];
  if (old.source === 'espn' && entry.source !== 'espn' && !tipped(old) && old.tickets.every(t => !t.result)) { rows[at] = entry; return 'replaced'; }
  return 'kept';
}

// Grade one leg: results: Map(gameId → { homeScore, awayScore }), boxes: Map(gameId → adaptEspnBox).
// A prop leg whose player did not play is void (DraftKings removes it).
function _pitchGradeLeg(l, results, boxes) {
  const r = results.get(l.game);
  if (!r) return null;
  if (l.type === 'ml') {
    const homeWon = r.homeScore > r.awayScore;
    return { outcome: (l.side === 'home') === homeWon ? 'hit' : 'miss' };
  }
  const box = boxes.get(l.game);
  if (!box) return null;
  const team = box[l.team] || [];
  if (!team.length) return null;
  const k = _propNameKey(l.name);
  const b = team.find(x => x.id === l.player) || team.filter(x => _propNameKey(x.name) === k).find((x, i, a) => a.length === 1);
  if (!b || !b.played) return { outcome: 'void', actual: null };
  const actual = l.stat === 'pra' ? b.line.pts + b.line.reb + b.line.ast : b.line[l.stat];
  return { outcome: actual > l.line ? 'hit' : 'miss', actual };
}

// Grade every pitched ticket whose legs are all final. Returns the number of tickets graded.
function settlePitches(rows, results, boxes, settledAt) {
  let n = 0;
  for (const row of rows) for (const t of row.tickets) {
    if (t.status !== 'pitched' || t.result) continue;
    const g = t.legs.map(l => _pitchGradeLeg(l, results, boxes));
    if (g.some(x => x == null)) continue;
    t.legs.forEach((l, i) => { l.result = g[i]; });
    const live = g.filter(x => x.outcome !== 'void');
    const outcome = live.some(x => x.outcome === 'miss') ? 'loss' : live.length ? 'win' : 'void';
    // Units only at a known price with nothing voided (a void reprices the ticket, which a quote cannot show).
    const price = t.quote != null ? t.quote : t.price;
    const units = price == null || live.length < g.length || outcome === 'void' ? null : outcome === 'win' ? +(parlayDecimal(price) - 1).toFixed(4) : -1;
    t.result = { outcome, legsHit: live.filter(x => x.outcome === 'hit').length, legsVoid: g.length - live.length, units, settledAt };
    n++;
  }
  return n;
}

// Per recipe, nights from the spec's first night: { nights, tickets, noTicket, settled, won, legs,
// legsHit, legsShown (sum of shown chances over graded legs), units, priced, clvN, clvToward, clvMove }.
// ledger: game-ledger rows, for the edge legs' closing prices (same book only).
function seasonPitchRecord(rows, ledger, opts) {
  const from = (opts && opts.from) || SEASON_PITCH_SPEC.firstNight;
  const byId = new Map((ledger || []).map(r => [String(r.id), r]));
  const out = {};
  for (const recipe of ['floor', 'edge']) {
    const g = { nights: 0, tickets: 0, noTicket: 0, settled: 0, won: 0, legs: 0, legsHit: 0, legsShown: 0, units: 0, priced: 0, clvN: 0, clvToward: 0, clvMoveSum: 0 };
    for (const row of (rows || []).filter(r => r.date >= from && r.spec === SEASON_PITCH_SPEC.version)) {
      const t = row.tickets.find(x => x.recipe === recipe);
      if (!t) continue;
      g.nights++;
      if (t.status !== 'pitched') { g.noTicket++; continue; }
      g.tickets++;
      for (const l of t.legs) {
        if (l.type === 'ml') {
          const r = byId.get(l.game);
          if (r && r.close && r.close.mlHome != null && r.close.mlAway != null && r.close.book && r.book && String(r.close.book).toLowerCase() === String(r.book).toLowerCase()) {
            const closeSide = l.side === 'home' ? _noVigHome(r.close.mlHome, r.close.mlAway) : 1 - _noVigHome(r.close.mlHome, r.close.mlAway);
            const mv = closeSide - l.pMarket;
            g.clvN++; g.clvMoveSum += mv; if (mv > 0.005) g.clvToward++;
          }
        }
        if (!l.result || l.result.outcome === 'void') continue;
        g.legs++; g.legsShown += l.p; if (l.result.outcome === 'hit') g.legsHit++;
      }
      if (!t.result) continue;
      g.settled++; if (t.result.outcome === 'win') g.won++;
      if (t.result.units != null) { g.priced++; g.units += t.result.units; }
    }
    g.units = +g.units.toFixed(2);
    g.clvMove = g.clvN ? +(g.clvMoveSum / g.clvN).toFixed(4) : null;
    delete g.clvMoveSum;
    out[recipe] = g;
  }
  return out;
}
