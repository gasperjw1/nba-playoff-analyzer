// ============================================================
// TRUST RULES — when a disagreement with DraftKings might be worth trusting
// ============================================================
// Frozen 2026-11-05, before any game they are judged on. They were drafted
// from the 121-game replay (a development set), so the replay can only
// describe them; the evidence is the live ledger from 2026-11-06 on. Do not
// edit a rule — add a new one with a new id and its own start date.
// Disclosed: the drafting numbers came from the replay's tip-time variant
// against DraftKings' opening line, i.e. with injury news the opener did not
// have. The Ledger tab describes the rules on the eve variant instead (the
// report from before 9 PM ET the evening before, data through that morning).
//
// A game's edge (in probability points): the picks engine's win probability (last season's ratings)
// minus the probability DraftKings' price implies (with the vig) on the
// side where that difference is larger. Its driver: the engine step whose
// removal would close most of the gap between the engine's margin and
// DraftKings' (−spread). A rule fires when the edge is ≥ minEdge and the
// driver matches.
//
// Judged two ways: results at the price when the prediction was recorded,
// and closing-line value — did DraftKings' no-vig probability for our side
// move toward us between the recorded price and the close? CLV shows real
// information in dozens of games; results alone need thousands.
// ============================================================
const SEASON_TRUST = {
  frozen: '2026-11-05',
  judgedFrom: '2026-11-06',
  minEdge: 0.03,
  rules: [
    { id: 'R1', driver: 'prior', label: 'Last season\'s rating', why: 'drafted from the tip-time replay (open moved our way 12 of 14); the market may overweight early results' },
    { id: 'R2', driver: 'change', label: 'Roster changes', why: 'the engine\'s historical strength on changed rosters; drafted from the tip-time replay (7 of 9)' },
    { id: 'R3', driver: 'rest', label: 'Rest', why: 'back-to-back cost measured at ~2.1 on past seasons; the market prices less' },
    { id: 'R4', driver: 'aging', label: 'Aging', why: 'the market ignores aging; past seasons support it' },
    { id: 'AVOID', driver: 'absent', label: 'Injuries tonight', why: 'the market knows minutes limits and late news', avoid: true },
  ],
  components: ['prior', 'current', 'absent', 'change', 'aging', 'fit', 'rest'],
};

function _impliedProb(ml) { return ml == null ? null : ml < 0 ? -ml / (-ml + 100) : 100 / (ml + 100); }
function _payout(ml) { return ml > 0 ? ml / 100 : 100 / -ml; }
function _noVigHome(mlHome, mlAway) {
  const h = _impliedProb(mlHome), a = _impliedProb(mlAway);
  return h == null || a == null ? null : h / (h + a);
}

// The engine's home margin split into the steps a disagreement can come from.
function seasonEdgeComponents(proj) {
  const step = (id) => proj.lineage.filter(l => l.step === id).reduce((s, l) => s + l.delta, 0);
  const hs = proj.homeStrength, as = proj.awayStrength;
  const strength = step('strength');
  const prior = ((1 - hs.currentWeight) * hs.priorNetShrunk - (1 - as.currentWeight) * as.priorNetShrunk) * proj.pace / 100;
  const split = (r) => {
    const total = r.items.reduce((s, i) => s + i.delta, 0);
    const absent = total ? r.adj * r.items.filter(i => i.kind === 'absent').reduce((s, i) => s + i.delta, 0) / total : 0;
    return { absent, change: r.adj - absent };
  };
  const h = split(proj.roster.home), a = split(proj.roster.away);
  const round = (x) => +x.toFixed(2);
  return {
    prior: round(prior), current: round(strength - prior),
    absent: round(h.absent - a.absent), change: round(h.change - a.change),
    aging: round(step('aging')), fit: round(step('fit')), rest: round(step('rest')), hca: round(step('hca')),
  };
}

// market: { mlHome, mlAway, spreadHome }. Returns null without a moneyline.
function seasonTrustCheck(proj, market, comps) {
  const m = market || {};
  if (m.mlHome == null || m.mlAway == null) return null;
  const c = comps || seasonEdgeComponents(proj);
  const pH = proj.pHome, iH = _impliedProb(m.mlHome), iA = _impliedProb(m.mlAway);
  const eH = pH - iH, eA = (1 - pH) - iA;
  const home = eH >= eA;
  const edge = home ? eH : eA;
  const mktMargin = m.spreadHome != null ? -m.spreadHome : winProbToMargin(_noVigHome(m.mlHome, m.mlAway));
  const gap = proj.margin - mktMargin;
  let driver = null, best = 0;
  for (const k of SEASON_TRUST.components) {
    const shrink = Math.abs(gap) - Math.abs(gap - c[k]);
    if (shrink > best + 1e-9) { best = shrink; driver = k; }
  }
  const rule = edge >= SEASON_TRUST.minEdge ? SEASON_TRUST.rules.find(r => r.driver === driver) || null : null;
  return {
    side: home ? 'home' : 'away', p: +(home ? pH : 1 - pH).toFixed(4),
    ml: home ? m.mlHome : m.mlAway, implied: +(home ? iH : iA).toFixed(4), edge: +edge.toFixed(4),
    gap: +gap.toFixed(2), driver, rule: rule ? rule.id : null, minEdge: SEASON_TRUST.minEdge, book: m.book || null, comps: c,
  };
}

// rows: ledger-like rows { date, home, away, trust, result, close:{mlHome,mlAway,book}, mlHome, mlAway, book }.
// opts.from: first date counted (default judgedFrom). Returns per rule and for every edge ≥ the
// threshold stored with the check: { n, won, units, clvN, toward, against, move, clvSkipped } —
// units at the recorded price; move = mean change in the book's no-vig probability for our side
// from the recorded price to the close, in probability points (+ = toward us). Judged with what was
// stored at record time (rule, edge, threshold), so later edits cannot re-judge past games; CLV
// counts only when the close comes from the same book as the recorded price.
function seasonTrustRecord(rows, opts) {
  const from = (opts && opts.from) || SEASON_TRUST.judgedFrom;
  const groups = Object.fromEntries([['ALL', null], ...SEASON_TRUST.rules.map(r => [r.id, r])].map(([id, r]) => [id, { id, rule: r, n: 0, won: 0, units: 0, clvN: 0, toward: 0, against: 0, moveSum: 0, clvSkipped: 0 }]));
  for (const r of rows || []) {
    const t = r.trust;
    if (!t || r.date < from || t.edge < (t.minEdge != null ? t.minEdge : SEASON_TRUST.minEdge)) continue;
    const add = (g) => {
      if (r.result) {
        const homeWon = r.result.homeScore > r.result.awayScore;
        const won = t.side === 'home' ? homeWon : !homeWon;
        g.n++; g.won += won ? 1 : 0; g.units += won ? _payout(t.ml) : -1;
      }
      const book = r.book || t.book, sameBook = !!(r.close && book && r.close.book && String(r.close.book).toLowerCase() === String(book).toLowerCase());
      const at = _noVigHome(r.mlHome, r.mlAway), cl = r.close && sameBook ? _noVigHome(r.close.mlHome, r.close.mlAway) : null;
      if (r.close && !sameBook) g.clvSkipped++;
      if (at != null && cl != null) {
        const mv = t.side === 'home' ? cl - at : at - cl;
        g.clvN++; g.moveSum += mv; if (mv > 0.005) g.toward++; else if (mv < -0.005) g.against++;
      }
    };
    add(groups.ALL);
    if (t.rule) add(groups[t.rule] = groups[t.rule] || { id: t.rule, rule: null, n: 0, won: 0, units: 0, clvN: 0, toward: 0, against: 0, moveSum: 0, clvSkipped: 0 });
  }
  for (const g of Object.values(groups)) { g.units = +g.units.toFixed(2); g.move = g.clvN ? +(g.moveSum / g.clvN).toFixed(4) : null; delete g.moveSum; }
  return groups;
}

// ============================================================
// ENGINE ERAS — each row judged with the engine that recorded it (added 2026-11-07)
// ============================================================
// The rules are defined on "the picks engine". Engine 2026-11-07.rotcap (minutes capped in
// rotation order, research-minutes-cap.js) changes what they see, so the rules are not re-judged:
// each ledger row counts only in its own engine's era (row.engine), from that era's start. Rows
// recorded by engines before the rules existed are never judged. A new engine must be added here,
// with its own start date, before its rows count (test-season.js checks the live engine is listed).
const SEASON_TRUST_ENGINES = [
  { engine: '2026-11-05.b2b2', judgedFrom: '2026-11-06', label: 'proportional minutes cap' },
  { engine: '2026-11-07.rotcap', judgedFrom: '2026-11-08', label: 'rotation-order minutes cap' },
];
// { engine: seasonTrustRecord groups } — each era's own rows, from its own start.
function seasonTrustRecordByEngine(rows) {
  return Object.fromEntries(SEASON_TRUST_ENGINES.map(e => [e.engine, seasonTrustRecord((rows || []).filter(r => r.engine === e.engine), { from: e.judgedFrom })]));
}

// ============================================================
// LATE INJURY FLIP — frozen 2026-11-06, judged from 2026-11-07
// ============================================================
// A separate rule: it compares two of our own picks, not our pick with the
// price. Both come from the replay pipeline (replay-season.js — the setup
// tested leak-free), recorded by late-flip.js when the slate is recorded:
//   earlier  the injury report from before 9 PM ET the evening before,
//            results through that morning (the replay's eve variant)
//   later    the latest report at record time (at most 60 minutes before
//            tip), results through this morning
// When the two pick different winners, the rule takes the earlier side, at
// the DraftKings price recorded with the row. Drafted from the replay — a
// development set, so it describes the rule and proves nothing: 8 games
// where the tip-time report flipped the evening-before pick; the earlier
// pick won 7, DraftKings' favourite 5. Do not edit; add a new rule instead.
// ============================================================
const SEASON_LATE_FLIP = {
  id: 'LATE', frozen: '2026-11-06', judgedFrom: '2026-11-07',
  label: 'Late injury flip',
  why: 'the report closer to tip flipped our evening-before pick: take the earlier side (replay, a development set: earlier pick 7 of 8, DraftKings 5 of 8)',
};

// ============================================================
// LATE2 — the same rule on the fixed pipeline, frozen 2026-11-07, judged from 2026-11-08
// ============================================================
// LATE's two picks come from the replay pipeline as it stood (replay-7), which counted a team
// that had not filed its injury report yet as fully healthy — the six teams on the second night
// of a back-to-back, at 8:30 PM the evening before and into game day. replay-8 carries forward
// what such a team last filed. That changes LATE's inputs, so LATE is not edited: it keeps
// judging only rows recorded on replay-7 (Nov 7), and LATE2 judges rows recorded on its own
// pipeline (spec below). Each row stores the pipeline it was checked on (late.spec); a row checked
// on any other pipeline (e.g. replay-8, live for a few hours on Nov 7) counts for neither.
// Re-pinned the same day, before its first judged game: replay-8 → replay-9, the pipeline on
// engine 2026-11-07.rotcap that live rows are checked on from Nov 8 (pinned to replay-8, LATE2
// would have matched no row). On replay-8 the earlier pick won 7 of 10 flips in 132 games; on
// replay-9 there are 6 flips and it won 3 — the later pick 3, DraftKings' opening favourite 5.
// The replay no longer supports the rule; it stays frozen and tracked, as pre-registered.
// ============================================================
const SEASON_LATE_FLIP2 = {
  id: 'LATE2', frozen: '2026-11-07', judgedFrom: '2026-11-08', spec: 'replay-9',
  label: 'Late injury flip, unfiled reports carried',
  why: 'LATE on the fixed pipeline: a team that has not filed its injury report keeps its previous filing; engine with the rotation-order minutes cap (replay-9, a development set: 6 flips in 132 games, earlier pick 3 of 6, later 3, DraftKings 5 of 6 — no support)',
};
// The pipeline each rule judges (rows recorded before late.spec existed are replay-7).
const SEASON_LATE_RULES = [{ ...SEASON_LATE_FLIP, spec: 'replay-7' }, SEASON_LATE_FLIP2];
const lateRowSpec = (r) => (r.late && r.late.spec) || 'replay-7';
function seasonLateRuleFor(row) { return SEASON_LATE_RULES.find(x => x.spec === lateRowSpec(row)) || null; }

// rows: ledger-like rows with late: { flip, side, spec } (side = the earlier pick, 'home' | 'away').
// Judged like the trust rules (seasonTrustRecord): results and units at the recorded price,
// line movement to the close from the same book. opts.rule: 'LATE' (default) or 'LATE2' — only
// rows checked on that rule's pipeline count; opts.from (default the rule's judgedFrom);
// opts.side 'later' scores the other side of the same flips, for comparison.
function seasonLateFlipRecord(rows, opts) {
  const rule = SEASON_LATE_RULES.find(x => x.id === ((opts && opts.rule) || SEASON_LATE_FLIP.id));
  const from = (opts && opts.from) || rule.judgedFrom, later = opts && opts.side === 'later';
  const all = (rows || []).filter(r => r.late && r.date >= from && lateRowSpec(r) === rule.spec);
  const flips = all.filter(r => r.late.flip && r.mlHome != null && r.mlAway != null).map(r => {
    const side = later ? (r.late.side === 'home' ? 'away' : 'home') : r.late.side;
    return { ...r, trust: { side, ml: side === 'home' ? r.mlHome : r.mlAway, edge: 1, minEdge: 0, rule: SEASON_LATE_FLIP.id, book: r.book || null } };
  });
  const g = seasonTrustRecord(flips, { from })[SEASON_LATE_FLIP.id];   // grouped under the shared id slot
  return { ...g, id: rule.id, checked: all.length, flips: all.filter(r => r.late.flip).length };
}
