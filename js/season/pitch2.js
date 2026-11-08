// ============================================================
// PITCHED TICKETS — spec pitch-2 (PITCH2_SPEC.md): the favourites ticket
// ============================================================
// One 3-leg moneyline ticket a night: the market's three strongest
// favourites (one per game), labelled "safe" when the third is 75%+ on
// DraftKings' no-vig price and "lean" otherwise. A market recipe — the
// picks engine and trust rules are recorded beside each leg, never used to
// pick. Recorded by `fetch-slate.js --record` (js/season/data/pitch2-ledger.js),
// replaceable until its first leg tips, graded by `--settle` with cause tags
// on every leg. The rules here are the frozen spec; a change is pitch-3.
// Never a stake size.
//
// Uses (globals): seasonCleanSlate (ledger.js), projectSeasonGame (engine.js),
// projectTeamProps (props.js), SEASON_PROPS_MIN_MINUTES, _propNameKey
// (props-ledger.js), seasonTrustCheck, _impliedProb, _noVigHome (trust.js),
// parlayDecimal, parlayAmerican (parlay.js).
// ============================================================
const SEASON_PITCH2_SPEC = {
  version: 'pitch-2', frozen: '2026-11-08', firstNight: '2026-11-09',
  legs: 3, safeFloor: 0.75, topMinutes: 5, newsDrop: 0.05, closeLoss: 5,
  tags: ['news', 'starter-out', 'engine-against', 'trust-flag', 'close-loss', 'beaten'],
};

// Chance of the first side with the vig removed by the power method: find k with
// p1^k + p2^k = 1 (the vig falls mostly on the longer price).
function pitchPowerFair(ml, mlOther) {
  const x = _impliedProb(ml), y = _impliedProb(mlOther);
  if (x == null || y == null) return null;
  let lo = 0.5, hi = 3;
  for (let i = 0; i < 60; i++) { const k = (lo + hi) / 2; if (x ** k + y ** k > 1) lo = k; else hi = k; }
  return x ** ((lo + hi) / 2);
}

const _p2Ml = (a) => typeof a === 'number' && isFinite(a) && Math.abs(a) >= 100;
const _p2Tipped = (tip, now) => !!tip && new Date(tip).getTime() <= now;

// The favourite's leg for one priced game (or null), with the engine, trust and top-5 context.
function _pitch2Leg(g, clean) {
  const m = g.market || {};
  if (!_p2Ml(m.mlHome) || !_p2Ml(m.mlAway)) return null;
  const kHome = _noVigHome(m.mlHome, m.mlAway), home = kHome >= 0.5;   // a pick'em goes to the home side
  const team = home ? g.home : g.away, opp = home ? g.away : g.home;
  const odds = home ? m.mlHome : m.mlAway, oddsOther = home ? m.mlAway : m.mlHome;
  let pEngine = null, trustRule = null, top = [];
  try {
    const proj = projectSeasonGame(g, clean);
    pEngine = +(home ? proj.pHome : 1 - proj.pHome).toFixed(4);
    const t = typeof seasonTrustCheck === 'function' ? seasonTrustCheck(proj, m) : null;
    trustRule = t && t.rule ? t.rule : null;
  } catch (e) { /* a team missing from the slate: the leg stands, the engine is unknown */ }
  try {
    top = projectTeamProps(team, opp, clean).filter(p => p.min >= SEASON_PROPS_MIN_MINUTES).slice(0, SEASON_PITCH2_SPEC.topMinutes)
      .map(p => ({ id: String(p.id), name: p.name, min: +p.min.toFixed(1) }));
  } catch (e) { top = []; }
  const open = m.open && _p2Ml(m.open.mlHome) && _p2Ml(m.open.mlAway) ? { mlHome: m.open.mlHome, mlAway: m.open.mlAway } : null;
  return {
    type: 'ml', game: String(g.id), matchup: `${g.away} @ ${g.home}`, tip: g.tip || null, side: home ? 'home' : 'away', team, opp,
    odds, oddsOther, book: m.book || null, flagBook: !/^draftkings$/i.test(m.book || ''), priceSource: g.priceSource || 'slate',
    pNoVig: +(home ? kHome : 1 - kHome).toFixed(4), p: +pitchPowerFair(odds, oddsOther).toFixed(4),
    pEngine, trustRule, top, open,
  };
}

// Tonight's ticket from the games not yet tipped at `now` (ms). fetch-slate.js passes games re-priced
// from ESPN's pickcenter at record time (priceSource 'espn'); otherwise the slate's own odds ('slate').
function buildFavouritesTicket(slate, now) {
  const S = SEASON_PITCH2_SPEC, clean = (typeof seasonCleanSlate === 'function' && seasonCleanSlate(slate)) || slate;
  const games = slate.games || [];
  const tipped = games.filter(g => _p2Tipped(g.tip, now)).length;
  const legsAll = games.filter(g => !_p2Tipped(g.tip, now)).map(g => _pitch2Leg(g, clean)).filter(Boolean);
  const tipMs = (l) => (l.tip ? new Date(l.tip).getTime() : Infinity);
  const nv = (l) => _noVigHome(l.odds, l.oddsOther);   // unrounded, for ranking and the safe floor
  legsAll.sort((a, b) => nv(b) - nv(a) || tipMs(a) - tipMs(b) || (a.game < b.game ? -1 : a.game > b.game ? 1 : 0));
  const base = { recipe: 'favourites', gamesTipped: tipped, gamesPriced: legsAll.length };
  if (legsAll.length < S.legs) return { ...base, status: 'no ticket', label: null, reason: `${legsAll.length} untipped game${legsAll.length === 1 ? '' : 's'} with a moneyline (needs ${S.legs})`, legs: [] };
  const legs = legsAll.slice(0, S.legs).map(l => ({ ...l, minToTip: l.tip ? Math.round((new Date(l.tip).getTime() - now) / 60000) : null }));
  const p = legs.reduce((s, l) => s * l.p, 1), dec = legs.reduce((s, l) => s * parlayDecimal(l.odds), 1);
  return { ...base, status: 'pitched', label: nv(legs[S.legs - 1]) >= S.safeFloor ? 'safe' : 'lean', legs,
    p: +p.toFixed(4), fairAmerican: parlayAmerican(1 / p), price: parlayAmerican(dec), quote: null, result: null };
}

// One night's pitch-2 row. meta: { engine, recordedAt, now }.
function buildPitch2(slate, meta) {
  meta = meta || {};
  const now = meta.now != null ? meta.now : Date.now();
  return { id: slate.date, date: slate.date, spec: SEASON_PITCH2_SPEC.version, engine: meta.engine || null, source: slate.source || null,
    recordedAt: meta.recordedAt || null, ticket: buildFavouritesTicket(slate, now), superseded: [] };
}

// Add tonight's row to `rows` in place. A row is replaced by a later recording until one of its legs
// has tipped (the last recording before the first leg's tip counts); the replaced version is kept in
// `superseded`. Returns 'added' | 'replaced' | 'unchanged' | 'kept' (a leg has tipped or it is graded)
// | 'late' (the new recording has a tipped leg).
function mergePitch2(rows, entry, now) {
  const legsTipped = (t) => (t.legs || []).some(l => _p2Tipped(l.tip, now));
  if (legsTipped(entry.ticket)) return 'late';
  const at = rows.findIndex(r => r.date === entry.date && r.spec === entry.spec);
  if (at < 0) { rows.push(entry); return 'added'; }
  const old = rows[at];
  if (old.ticket.result || legsTipped(old.ticket)) return 'kept';
  const sig = (t) => JSON.stringify([t.status, t.label, (t.legs || []).map(l => [l.game, l.side, l.odds, l.oddsOther])]);
  if (sig(old.ticket) === sig(entry.ticket)) return 'unchanged';
  const t = old.ticket;
  entry.superseded = (old.superseded || []).concat([{ recordedAt: old.recordedAt, source: old.source, status: t.status, label: t.label, p: t.p || null, price: t.price || null,
    legs: (t.legs || []).map(l => ({ game: l.game, team: l.team, odds: l.odds, p: l.p })) }]);
  if (t.quote != null && entry.ticket.status === 'pitched') entry.ticket.quotePrev = t.quote;   // a quote belongs to the old legs
  rows[at] = entry;
  return 'replaced';
}

// Tags for one leg. close: the game-ledger row's close ({ mlHome, mlAway, book }) or null; box: adaptEspnBox or null.
function pitch2Tags(l, r, close, box) {
  const S = SEASON_PITCH2_SPEC, tags = [], unknown = [];
  const us = l.side === 'home' ? r.homeScore : r.awayScore, them = l.side === 'home' ? r.awayScore : r.homeScore, margin = us - them;
  if (close && _p2Ml(close.mlHome) && _p2Ml(close.mlAway) && close.book && l.book && String(close.book).toLowerCase() === String(l.book).toLowerCase()) {
    const pc = l.side === 'home' ? pitchPowerFair(close.mlHome, close.mlAway) : pitchPowerFair(close.mlAway, close.mlHome);
    l.pClose = +pc.toFixed(4);
    if (l.p - pc >= S.newsDrop - 1e-9) tags.push('news');
  } else unknown.push('news');
  const team = box && box[l.team];
  if (team && team.length && l.top && l.top.length) {
    const sat = l.top.filter(p => { const k = _propNameKey(p.name); const b = team.find(x => x.id === p.id) || team.filter(x => _propNameKey(x.name) === k).find((x, i, a) => a.length === 1); return !b || !b.played; });
    if (sat.length) { tags.push('starter-out'); l.sat = sat.map(p => p.name); }
  } else unknown.push('starter-out');
  if (l.pEngine == null) unknown.push('engine-against'); else if (l.pEngine < 0.5) tags.push('engine-against');
  if (l.trustRule) tags.push('trust-flag');
  if (margin < 0 && -margin <= S.closeLoss) tags.push('close-loss');
  if (margin < -S.closeLoss) tags.push('beaten');
  return { tags, unknown, margin };
}

// Grade every pitch-2 ticket whose legs are all final or postponed.
// results: Map(gameId → { homeScore, awayScore }); postponed: Set(gameId); closes: Map(gameId → close);
// boxes: Map(gameId → adaptEspnBox). Returns the number of tickets graded.
function settlePitch2(rows, results, postponed, closes, boxes, settledAt) {
  let n = 0;
  for (const row of rows) {
    const t = row.ticket;
    if (!t || t.status !== 'pitched' || t.result) continue;
    if (t.legs.some(l => !results.has(l.game) && !(postponed && postponed.has(l.game)))) continue;
    for (const l of t.legs) {
      if (!results.has(l.game)) { l.result = { outcome: 'void' }; continue; }
      const r = results.get(l.game), homeWon = r.homeScore > r.awayScore;
      const g = pitch2Tags(l, r, closes ? closes.get(l.game) : null, boxes ? boxes.get(l.game) : null);
      l.result = { outcome: (l.side === 'home') === homeWon ? 'hit' : 'miss', margin: g.margin, tags: g.tags, unknown: g.unknown };
    }
    const live = t.legs.filter(l => l.result.outcome !== 'void');
    const outcome = live.some(l => l.result.outcome === 'miss') ? 'loss' : live.length ? 'win' : 'void';
    const price = t.quote != null ? t.quote : t.price;
    const units = price == null || live.length < t.legs.length || outcome === 'void' ? null : outcome === 'win' ? +(parlayDecimal(price) - 1).toFixed(4) : -1;
    t.result = { outcome, legsHit: live.filter(l => l.result.outcome === 'hit').length, legsVoid: t.legs.length - live.length, units, settledAt };
    n++;
  }
  return n;
}

// Per label (safe, lean), nights from the spec's first night: { nights, settled, won, shown (sum of
// graded tickets' shown chances), voidLeg (graded with a void leg: left out of the ticket counts, since
// its shown chance was for three legs), legs, legsHit, legsShown, units, priced, clvN, clvToward,
// clvMove, tags: { tag: { hit, miss } } }, plus noTicket nights.
function seasonPitch2Record(rows, opts) {
  const S = SEASON_PITCH2_SPEC, from = (opts && opts.from) || S.firstNight;
  const blank = () => ({ nights: 0, settled: 0, won: 0, shown: 0, voidLeg: 0, legs: 0, legsHit: 0, legsShown: 0, units: 0, priced: 0, clvN: 0, clvToward: 0, clvMoveSum: 0,
    tags: Object.fromEntries(S.tags.map(k => [k, { hit: 0, miss: 0 }])) });
  const out = { safe: blank(), lean: blank(), noTicket: 0 };
  for (const row of (rows || []).filter(r => r.spec === S.version && r.date >= from)) {
    const t = row.ticket;
    if (!t || t.status !== 'pitched') { out.noTicket++; continue; }
    const g = out[t.label];
    g.nights++;
    for (const l of t.legs) {
      if (l.pClose != null) { const mv = l.pClose - l.p; g.clvN++; g.clvMoveSum += mv; if (mv > 0.005) g.clvToward++; }
      if (!l.result || l.result.outcome === 'void') continue;
      g.legs++; g.legsShown += l.p; if (l.result.outcome === 'hit') g.legsHit++;
      for (const k of l.result.tags || []) g.tags[k][l.result.outcome]++;
    }
    if (!t.result) continue;
    if (t.result.legsVoid) { g.voidLeg++; continue; }
    g.settled++; g.shown += t.p; if (t.result.outcome === 'win') g.won++;
    if (t.result.units != null) { g.priced++; g.units += t.result.units; }
  }
  for (const k of ['safe', 'lean']) {
    const g = out[k];
    g.units = +g.units.toFixed(2); g.shown = +g.shown.toFixed(4);
    g.clvMove = g.clvN ? +(g.clvMoveSum / g.clvN).toFixed(4) : null;
    delete g.clvMoveSum;
  }
  return out;
}
