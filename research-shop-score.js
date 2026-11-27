// shop-2 backfill scoring (SHOP2_SPEC.md). Called by research-shop-backfill.js with no flags.
// V0 recorded prices · V1 DraftKings at the bet-time snapshot · V2 the tracker's price (better of
// FanDuel and DraftKings) · V3 V2 with the skip rule · V4 the tracker's own +EV picks.
const B = require('./research-shop-backfill.js');
const { dec, powerFair } = B;
const SKIP_STRAIGHT = -0.04, SKIP_PER_LEG = -0.04, PICK_LO = 0.01, PICK_HI = 0.10;

const units = (american, hit) => (hit ? dec(american) - 1 : -1);
const american = (d) => (d >= 2 ? Math.round((d - 1) * 100) : -Math.round(100 / (d - 1)));
const hitOf = (r, side) => (r && r.result && r.result.homeScore != null ? (side === 'home') === (r.result.homeScore > r.result.awayScore) : null);

function score(C, nights) {
  const rows = new Map();
  for (const r of C.SEASON_LEDGER) rows.set(String(r.id), r);
  for (const r of C.SEASON_BACKFILL.rows) if (!rows.has(String(r.id))) rows.set(String(r.id), r);

  // A snapshot game for a ledger row: same teams, the commence time nearest the row's tip.
  const snaps = new Map();
  const snap = (iso) => { if (!snaps.has(iso)) snaps.set(iso, B.snapGames(C, iso)); return snaps.get(iso); };
  const gameAt = (iso, r) => {
    const s = snap(iso), gs = (s && s.games.get(`${r.away}@${r.home}`)) || [];
    const g = gs.slice().sort((a, b) => Math.abs(Date.parse(a.commence) - Date.parse(r.tip)) - Math.abs(Date.parse(b.commence) - Date.parse(r.tip)))[0];
    return g && Math.abs(Date.parse(g.commence) - Date.parse(r.tip)) < 6 * 36e5 ? g : null;
  };
  const closeFair = (n, r, side) => { const g = gameAt(n.close, r); const f = g && B.fairHome(g); return f ? (side === 'home' ? f.p : 1 - f.p) : null; };
  const dkClose = (r, side) => { const c = r.close || {}; if (c.mlHome == null || c.mlAway == null) return null; const p = powerFair(c.mlHome, c.mlAway); return side === 'home' ? p : 1 - p; };

  // ── the bets each tracker counts ──
  const bets = [], floors = [];
  const leg = (gameId, side, odds) => { const r = rows.get(String(gameId)); return { r, side, odds0: odds, hit: hitOf(r, side) }; };
  for (const n of nights) {
    const live = n.source === 'live';
    if (live) {
      const p1 = C.SEASON_PITCH_LEDGER.find((p) => p.date === n.date), p2 = C.SEASON_PITCH2_LEDGER.find((p) => p.date === n.date);
      for (const t of (p1 && p1.tickets) || []) {
        if (t.status !== 'pitched') continue;
        if (t.recipe === 'floor') { floors.push({ date: n.date, src: 'live', outcome: t.result && t.result.outcome, p: t.p }); continue; }
        bets.push({ tracker: 'pitch-1 edge', kind: 'parlay', n, price0: t.price, legs: t.legs.map((l) => leg(l.game, l.side, l.odds)) });
      }
      const t2 = p2 && p2.ticket;
      if (t2 && t2.status === 'pitched' && n.date >= C.SEASON_PITCH2_SPEC.firstNight && t2.result && !t2.result.legsVoid)
        bets.push({ tracker: 'pitch-2 favourites', kind: 'parlay', n, price0: t2.price, legs: t2.legs.map((l) => leg(l.game, l.side, l.odds)) });
      const dayRows = C.SEASON_LEDGER.filter((r) => r.date === n.date);
      if (n.date >= C.SEASON_PITCH3_SPEC.firstNight) {
        const p3 = C.pitch3Tonight(dayRows, n.date);
        for (const l of p3.legs) bets.push({ tracker: 'pitch-3 straights', kind: 'straight', n, legs: [leg(l.gameId, l.side, l.odds)] });
        if (p3.pair) bets.push({ tracker: 'pitch-3 pairs', kind: 'parlay', n, price0: p3.pair.odds, legs: p3.pair.legs.map((l) => leg(l.gameId, l.side, l.odds)) });
      }
      if (n.date >= C.SEASON_FLAT_SPEC.firstNight)
        for (const b of C.flatLedgerBets(dayRows).filter((b) => C.flatFavInRule(b.odds))) bets.push({ tracker: 'flat-1 favourites', kind: 'straight', n, legs: [leg(b.gameId, b.side, b.odds)] });
      if (n.date >= C.SEASON_FADE_SPEC.firstNight)
        for (const b of C.fadeTonight(dayRows, n.date)) bets.push({ tracker: 'fade-1', kind: 'straight', n, legs: [leg(b.gameId, b.side, b.odds)] });
    } else {
      const bn = C.SEASON_BACKFILL.nights.find((x) => x.date === n.date);
      for (const t of bn.pitch1) {
        if (t.status !== 'pitched') continue;
        if (t.recipe === 'floor') { floors.push({ date: n.date, src: 'backfill', outcome: t.result && t.result.outcome, p: t.p }); continue; }
        bets.push({ tracker: 'pitch-1 edge', kind: 'parlay', n, price0: t.price, legs: t.legs.map((l) => leg(l.game, l.side, l.odds)) });
      }
      if (bn.pitch2.status === 'pitched') bets.push({ tracker: 'pitch-2 favourites', kind: 'parlay', n, price0: bn.pitch2.price, legs: bn.pitch2.legs.map((l) => leg(l.game, l.side, l.odds)) });
      for (const l of bn.pitch3.legs) bets.push({ tracker: 'pitch-3 straights', kind: 'straight', n, legs: [leg(l.gameId, l.side, l.odds)] });
      if (bn.pitch3.pair) bets.push({ tracker: 'pitch-3 pairs', kind: 'parlay', n, price0: bn.pitch3.pair.odds, legs: bn.pitch3.pair.legs.map((l) => leg(l.gameId, l.side, l.odds)) });
      for (const b of bn.flat) bets.push({ tracker: 'flat-1 favourites', kind: 'straight', n, legs: [leg(b.gameId, b.side, b.odds)] });
    }
  }

  // ── price each bet four ways ──
  let unmatched = 0;
  for (const b of bets) {
    const priced = b.legs.map((l) => { const g = gameAt(b.n.bet, l.r); if (!g) unmatched++; return { ...l, sp: B.sidePrices(g, l.side) }; });
    b.hit = b.legs.some((l) => l.hit === false) ? false : b.legs.every((l) => l.hit === true) ? true : null;
    b.v0 = b.kind === 'straight' ? b.legs[0].odds0 : b.price0;
    const prod = (k) => (priced.every((l) => l.sp && l.sp[k] != null) ? priced.reduce((s, l) => s * dec(l.sp[k]), 1) : null);
    const fairAll = priced.every((l) => l.sp && l.sp.fair != null) ? priced.reduce((s, l) => s * l.sp.fair, 1) : null;
    const dDK = prod('dk'), dFD = prod('fd');
    b.v1 = dDK != null ? american(dDK) : null;
    let d2 = null, book = null;
    if (b.kind === 'straight') { const sp = priced[0].sp; if (sp && sp.best != null) { d2 = dec(sp.best); book = sp.bestBook; } }
    else if (dDK != null || dFD != null) { if (dDK == null || (dFD != null && dFD >= dDK)) { d2 = dFD; book = 'FanDuel'; } else { d2 = dDK; book = 'DraftKings'; } }
    b.v2 = d2 != null ? american(d2) : null; b.book = book;
    b.ev = d2 != null && fairAll != null ? fairAll * d2 - 1 : null;
    b.skip = b.ev != null && b.ev < (b.kind === 'straight' ? SKIP_STRAIGHT : SKIP_PER_LEG * b.legs.length);
    b.fairBet = fairAll;
    const fc = b.legs.map((l) => closeFair(b.n, l.r, l.side)), fd = b.legs.map((l) => dkClose(l.r, l.side));
    b.clvClose = fairAll != null && fc.every((x) => x != null) ? fc.reduce((s, x) => s * x, 1) - fairAll : null;
    b.clvDK = fairAll != null && fd.every((x) => x != null) ? fd.reduce((s, x) => s * x, 1) - fairAll : null;
  }

  // ── the tracker's own picks: every side on the night's ledger at EV +1% to +10% ──
  const picks = [];
  for (const n of nights) {
    const dayRows = n.source === 'live' ? C.SEASON_LEDGER.filter((r) => r.date === n.date) : C.SEASON_BACKFILL.rows.filter((r) => r.date === n.date);
    for (const r of dayRows) for (const side of ['home', 'away']) {
      const sp = B.sidePrices(gameAt(n.bet, r), side);
      if (!sp || sp.ev == null || sp.ev < PICK_LO || sp.ev > PICK_HI) continue;
      const fc = closeFair(n, r, side), fdk = dkClose(r, side);
      picks.push({ tracker: 'tracker picks', kind: 'straight', n, hit: hitOf(r, side), v2: sp.best, book: sp.bestBook, ev: sp.ev, fairBet: sp.fair,
        clvClose: fc != null ? fc - sp.fair : null, clvDK: fdk != null ? fdk - sp.fair : null, game: `${r.away}@${r.home}`, team: side === 'home' ? r.home : r.away });
    }
  }

  // ── report ──
  const graded = bets.filter((b) => b.hit != null);
  const roll = (bs, k, onlyPlayed) => {
    let n = 0, u = 0, unpriced = 0;
    for (const b of bs) { if (onlyPlayed && b.skip) continue; let p = b[k]; if (p == null) { p = b.v0; unpriced++; } if (p == null) continue; n++; u += units(p, b.hit); }
    return { n, u, roi: n ? u / n : null, unpriced };
  };
  const mean = (xs) => { const v = xs.filter((x) => x != null); if (!v.length) return null; const m = v.reduce((a, b) => a + b, 0) / v.length; const sd = v.length > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)) : 0; return { m, se: sd / Math.sqrt(v.length), n: v.length }; };
  const pct = (x, d = 1) => (x == null ? '—' : `${x >= 0 ? '+' : ''}${(100 * x).toFixed(d)}%`);
  const pm = (o) => (o ? `${pct(o.m, 2)} ± ${(100 * o.se).toFixed(2)} (n ${o.n})` : '—');
  const line = (lab, bs) => {
    const v0 = roll(bs, 'v0'), v1 = roll(bs, 'v1'), v2 = roll(bs, 'v2'), v3 = roll(bs, 'v2', true);
    const won = bs.filter((b) => b.hit).length;
    console.log(`${lab.padEnd(20)} bets ${String(v0.n).padStart(3)} won ${String(won).padStart(3)} | V0 ${pct(v0.roi).padStart(7)} (${v0.u >= 0 ? '+' : ''}${v0.u.toFixed(2)}u) | V1 DK ${pct(v1.roi).padStart(7)} | V2 tracker ${pct(v2.roi).padStart(7)} (${v2.u >= 0 ? '+' : ''}${v2.u.toFixed(2)}u) | V3 with skips ${pct(v3.roi).padStart(7)} on ${v3.n} (${v3.u >= 0 ? '+' : ''}${v3.u.toFixed(2)}u) | unpriced ${v2.unpriced}`);
  };
  console.log(`bets ${bets.length} (graded ${graded.length}), legs not found in a snapshot: ${unmatched}`);
  console.log('\n== Returns per 1-unit bet (ROI) ==');
  const groups = [...new Set(graded.map((b) => b.tracker))];
  for (const g of groups) line(g, graded.filter((b) => b.tracker === g));
  line('ALL our bets', graded);
  for (const src of ['live', 'backfill']) line(`  ${src} nights`, graded.filter((b) => b.n.source === src));
  const gp = picks.filter((p) => p.hit != null), pu = gp.reduce((s, p) => s + units(p.v2, p.hit), 0);
  console.log(`${'V4 tracker picks'.padEnd(20)} bets ${String(gp.length).padStart(3)} won ${String(gp.filter((p) => p.hit).length).padStart(3)} | ROI ${pct(gp.length ? pu / gp.length : null)} (${pu >= 0 ? '+' : ''}${pu.toFixed(2)}u)`);

  console.log('\n== What the tracker changes (same bets) ==');
  const both = graded.filter((b) => b.v1 != null && b.v2 != null);
  const gain = mean(both.map((b) => units(b.v2, true) - units(b.v1, true)));
  console.log(`price improvement when the bet wins, V2 vs V1 (units per bet): ${gain ? gain.m.toFixed(4) + ' ± ' + gain.se.toFixed(4) + ' (n ' + gain.n + ')' : '—'}`);
  const evIdx = (b, k) => (b.fairBet != null && b[k] != null ? b.fairBet * dec(b[k]) - 1 : null);
  console.log(`mean EV at bet time: V1 DraftKings ${pm(mean(graded.map((b) => evIdx(b, 'v1'))))} · V2 tracker ${pm(mean(graded.map((b) => b.ev)))} · V3 played ${pm(mean(graded.filter((b) => !b.skip).map((b) => b.ev)))} · skipped ${pm(mean(graded.filter((b) => b.skip).map((b) => b.ev)))}`);
  console.log(`book chosen by the tracker: ${JSON.stringify(graded.reduce((o, b) => { o[b.book || 'none'] = (o[b.book || 'none'] || 0) + 1; return o; }, {}))}`);
  const sk = graded.filter((b) => b.skip);
  console.log(`skipped ${sk.length}: won ${sk.filter((b) => b.hit).length}, ${sk.reduce((s, b) => s + units(b.v2, b.hit), 0).toFixed(2)}u at the tracker price`);
  for (const g of groups) { const s = graded.filter((b) => b.tracker === g); const e = mean(s.map((b) => b.ev)); console.log(`  ${g.padEnd(20)} mean EV ${pm(e)} · skipped ${s.filter((b) => b.skip).length}`); }

  console.log('\n== Line movement after bet time (fair chance of our side) ==');
  console.log(`our bets: to the close snapshot ${pm(mean(graded.map((b) => b.clvClose)))} · to DraftKings' close ${pm(mean(graded.map((b) => b.clvDK)))}`);
  console.log(`tracker picks: to the close snapshot ${pm(mean(gp.map((p) => p.clvClose)))} · to DraftKings' close ${pm(mean(gp.map((p) => p.clvDK)))} · mean EV ${pm(mean(gp.map((p) => p.ev)))}`);
  const fs = floors.filter((f) => f.outcome);
  console.log(`\nfloor tickets (unpriced, left out): ${fs.filter((f) => f.outcome === 'win').length}/${fs.length} won; shown ${fs.reduce((s, f) => s + f.p, 0).toFixed(2)} expected`);
  const fairSrc = graded.flatMap((b) => b.legs.map((l) => { const g = gameAt(b.n.bet, l.r); const f = g && B.fairHome(g); return f ? (f.src === 'pinnacle' ? 'pinnacle' : 'median') : 'none'; }));
  console.log('fair-chance source per leg:', JSON.stringify(fairSrc.reduce((o, k) => { o[k] = (o[k] || 0) + 1; return o; }, {})));
  return { bets, picks, floors };
}

module.exports = { score };
