// ============================================================
// SEASON PAGES — the three main views: Today, Profit, Models vs market
// ============================================================
// Today: the night's tickets from the frozen pitch rules (recorded when the daily run has
// recorded them, otherwise a labelled preview) and every game in one table.
// Profit: all25-1, $25 on every parlay and leg since the first pitched night.
// Models vs market: every model against DraftKings' close on settled games.
// Everything else lives under Research (ui.js). Never a stake size.
//
// Uses (globals): seasonState, loadSeasonLedger, buildPitches, buildFavouritesTicket, pitch3Tonight,
// projectSeasonGame, seasonCleanSlate, seasonTrustCheck, seasonTrustRecord, SEASON_TRUST, _noVigHome,
// seasonAll25Summary, SEASON_ALL25_SPEC, seasonFlatSummary, seasonScoreboard, seasonCalibration,
// seasonWeekly, seasonCloseHome, parlayFmtOdds, seasonFmtDay, seasonFmtTime, seasonTodayIso.
// ============================================================

const _pgPct = (p) => (p == null ? '—' : `${(p * 100).toFixed(1)}%`);
const _pgOdds = (a) => (a == null ? '—' : typeof parlayFmtOdds === 'function' ? parlayFmtOdds(a) : (a > 0 ? '+' : '') + a);
const _pgMoney = (x) => `<span class="${x > 0 ? 'pos' : x < 0 ? 'neg' : ''}">${x >= 0 ? '+' : '−'}$${Math.abs(x).toFixed(2)}</span>`;
const _pgRoi = (r) => (r == null ? '—' : `${r >= 0 ? '+' : '−'}${Math.abs(r * 100).toFixed(1)}%`);
const _pgDay = (d) => (typeof seasonFmtDay === 'function' ? seasonFmtDay(d) : d);
const _pgDayLink = (d) => `<a href="#results/${d}" onclick="seasonState.tab='results';seasonResultsMode('live');seasonResultsGo('${d}');return false;">${_pgDay(d)}</a>`;

// ---------- Today ----------

// The night's rows: the recorded ledger rows for the slate's date, or preview rows built from the slate
// the way the daily record builds them (pOurs on the feed's ratings, trust on the 2025-26 picks engine).
function seasonTodayRows(slate) {
  const recorded = (typeof loadSeasonLedger === 'function' ? loadSeasonLedger() : []).filter(r => r.date === slate.date);
  if (recorded.length) return { rows: recorded, recorded: true };
  const clean = typeof seasonCleanSlate === 'function' ? seasonCleanSlate(slate) : null;
  const rows = slate.games.map(g => {
    const m = g.market || {}, proj = projectSeasonGame(g, slate), pc = clean ? projectSeasonGame(g, clean) : null;
    const ok = typeof m.mlHome === 'number' && typeof m.mlAway === 'number';
    return { id: String(g.id), date: slate.date, tip: g.tip, home: g.home, away: g.away, pOurs: proj.pHome, pOursClean: pc ? pc.pHome : null,
      pMarket: ok ? _noVigHome(m.mlHome, m.mlAway) : null, mlHome: m.mlHome, mlAway: m.mlAway, spreadHome: m.spreadHome, book: m.book || 'DraftKings',
      trust: ok && pc && typeof seasonTrustCheck === 'function' ? seasonTrustCheck(pc, m) : null };
  });
  return { rows, recorded: false };
}

// A trust rule's warning with its live record, e.g. "Roster changes rule — 2 of 7 live".
function seasonRuleNote(ruleId, record) {
  if (!ruleId || typeof SEASON_TRUST === 'undefined') return '';
  const rule = SEASON_TRUST.rules.find(r => r.id === ruleId), g = record && record[ruleId];
  if (!rule) return '';
  if (rule.avoid) return `<span class="pg-warn">AVOID — ${rule.label.toLowerCase()} drive the gap; those have lost</span>`;
  return `<span class="pg-warn">${rule.label} rule${g && g.n ? ` — ${g.won} of ${g.n} live` : ''}</span>`;
}

function _pgTicket(title, t, sub) {
  if (!t || t.status !== 'pitched') return `<div class="pg-ticket muted"><div class="pg-ticket-h"><b>${title}</b></div><div>No ticket tonight${t && t.reason ? `: ${t.reason}` : ''}.</div></div>`;
  const res = t.result ? ` · <b class="${t.result.outcome === 'win' ? 'pos' : t.result.outcome === 'loss' ? 'neg' : ''}">${t.result.outcome === 'win' ? 'WON' : t.result.outcome === 'loss' ? 'LOST' : 'VOID'}</b>` : '';
  const mark = (l) => !l.result ? '' : l.result.outcome === 'hit' ? ' <span class="pos">✓</span>' : l.result.outcome === 'miss' ? ' <span class="neg">✗</span>' : ' <span class="muted">void</span>';
  const legs = t.legs.map(l => `<li><b>${l.type === 'prop' ? `${l.name} over ${l.line} PRA` : `${l.team} to win ${_pgOdds(l.odds)}`}</b>${mark(l)}
    <span class="muted">${l.matchup || `${l.team} vs ${l.opp}`} · ${l.type === 'prop' ? `projection ${l.mean.toFixed(1)}, ${l.min.toFixed(0)} min · ${_pgPct(l.p)}` : `ours ${_pgPct(l.pModel != null ? l.pModel : l.pEngine)} · market ${_pgPct(l.pMarket != null ? l.pMarket : l.pNoVig)}`}</span></li>`).join('');
  const price = t.price != null ? `price ${_pgOdds(t.price)}` : t.fairAmerican != null ? `fair ${_pgOdds(t.fairAmerican)} (check your book's price)` : '';
  return `<div class="pg-ticket"><div class="pg-ticket-h"><b>${title}</b>${t.label ? ` <span class="res-tag">${t.label}</span>` : ''}</div>
    <ul class="pg-legs">${legs}</ul><div class="pg-ticket-f">Chance ${_pgPct(t.p)} · ${price}${res}</div>${sub ? `<div class="muted pg-small">${sub}</div>` : ''}</div>`;
}

function renderTodayTab() {
  const s = seasonState.slate;
  if (!s || !s.games.length) return `<div class="home-empty">No games on this slate.</div>`;
  const now = Date.now(), stale = typeof seasonTodayIso === 'function' && s.date !== seasonTodayIso();
  const p1 = (typeof SEASON_PITCH_LEDGER !== 'undefined' ? SEASON_PITCH_LEDGER : []).find(r => r.date === s.date);
  const p2 = (typeof SEASON_PITCH2_LEDGER !== 'undefined' ? SEASON_PITCH2_LEDGER : []).find(r => r.date === s.date);
  // A slate from an earlier day that the daily run never recorded has nothing left to bet: say so plainly
  // instead of mixing tipped games into a preview.
  if (stale && s.date < seasonTodayIso() && !p1) {
    return `<div class="ledger pg"><div class="pg-head"><h2>Today's bets</h2></div>
      <div class="pg-note"><b>Today's slate isn't loaded yet.</b> The site still holds ${_pgDay(s.date)}'s slate, which was never recorded. Run <code>./season-daily.sh</code> to fetch and record today — if NB.AI hasn't refreshed, it switches to the ESPN slate automatically from 5 PM ET. Then commit the data files and this page shows tonight's tickets.</div>
      <p class="muted">Meanwhile: <a href="#profit" onclick="seasonSetTab('profit');return false;">Profit</a> has the running total, <a href="#models" onclick="seasonSetTab('models');return false;">Models vs market</a> the scoreboard.</p></div>`;
  }
  const pitch = p1 || buildPitches(s, { now }), fav = p2 ? p2.ticket : buildFavouritesTicket(s, now);
  const { rows, recorded } = seasonTodayRows(s);
  const p3 = pitch3Tonight(rows, s.date);
  const trustRec = typeof seasonTrustRecord === 'function' ? seasonTrustRecord(loadSeasonLedger()) : {};
  const floor = pitch.tickets.find(t => t.recipe === 'floor'), edge = pitch.tickets.find(t => t.recipe === 'edge');
  const straights = p3.legs.length ? `<div class="pg-ticket"><div class="pg-ticket-h"><b>Single picks</b> <span class="muted">model 5+ points off the market (pitch-3)</span></div><ul class="pg-legs">${p3.legs.map(l => {
    const r = rows.find(x => String(x.id) === String(l.gameId));
    return `<li><b>${l.team} to win ${_pgOdds(l.odds)}</b> <span class="muted">${l.matchup} · ours ${_pgPct(l.pModel)} · market ${_pgPct(l.pMarket)}</span> ${r && r.trust ? seasonRuleNote(r.trust.rule, trustRec) : ''}</li>`; }).join('')}</ul>
    ${p3.pair ? `<div class="pg-ticket-f">Pair: ${p3.pair.legs.map(l => l.team).join(' + ')} ${_pgOdds(p3.pair.odds)}</div>` : ''}</div>` : '';
  const games = rows.slice().sort((a, b) => String(a.tip).localeCompare(String(b.tip))).map(r => {
    const pm = r.pMarket, po = r.pOursReport != null ? r.pOursReport : r.pOurs, homeFav = pm != null ? pm >= 0.5 : po >= 0.5;
    const fav = homeFav ? r.home : r.away, favP = (p) => (p == null ? null : homeFav ? p : 1 - p), odds = homeFav ? r.mlHome : r.mlAway;
    const gap = po != null && pm != null ? po - pm : null, agrees = po == null || (po >= 0.5) === homeFav;
    const tipped = r.tip && Date.parse(r.tip) <= now;
    const flag = r.trust && r.trust.rule ? seasonRuleNote(r.trust.rule, trustRec) : gap != null && Math.abs(gap) >= 0.05 ? `<span class="pg-warn">model ${gap > 0 ? r.home : r.away} by ${(Math.abs(gap) * 100).toFixed(0)} pts</span>` : '';
    const both = r.pOursReport != null && r.pOurs != null && Math.abs(r.pOursReport - r.pOurs) >= 0.01 ? ` <span class="muted">(feed only ${_pgPct(favP(r.pOurs))})</span>` : '';
    return `<tr${tipped ? ' class="muted"' : ''}><td>${r.away} @ ${r.home}<div class="muted pg-small">${r.tip ? seasonFmtTime(r.tip) : ''}${tipped ? ' · tipped' : ''}</div></td>
      <td><b>${fav}</b> ${_pgOdds(odds)}</td><td class="num">${_pgPct(favP(pm))}</td><td class="num">${_pgPct(favP(po))}${both}${agrees ? '' : ' <span class="pg-warn">disagrees</span>'}</td><td>${flag}</td></tr>`;
  }).join('');
  return `<div class="ledger pg">
    <div class="pg-head"><h2>Today's bets — ${_pgDay(s.date)}</h2>
      <p class="muted">${p1 ? `Recorded ${p1.recordedAt ? seasonFmtTime(p1.recordedAt) : ''} by the daily run.` : '<span class="warn">Preview from the current slate — the daily run hasn\'t recorded tonight yet.</span>'}${stale ? ` <span class="warn">This slate is ${_pgDay(s.date)}, not today — run your daily routine.</span>` : ''}
      From the frozen pitch rules; no proven edge, never a stake size. Before placing anything, run the hour-before odds pull: it checks each leg against Pinnacle's fair price and names the better of FanDuel and DraftKings.</p></div>
    <div class="pg-tickets">
      ${_pgTicket('Floor ticket', floor, 'Three props at the model\'s 90% line. Calibrated so far; FanDuel rarely offers these exact lines, so price it at your book.')}
      ${_pgTicket('Favourites ticket', fav, fav && fav.label === 'safe' ? 'All three legs 75%+ by the market. It still pays the book\'s margin on every leg.' : 'Not all three legs reach 75% by the market.')}
      ${edge && edge.status === 'pitched' ? _pgTicket('Edge ticket', edge, 'Moneylines 8+ points off the market — an experiment; no edge against the closing line so far.') : ''}
      ${straights}
    </div>
    <h3>Every game</h3>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Game</th><th>Market favourite</th><th class="num">Market</th><th class="num">Our model${recorded ? '' : ' <span class="muted">(preview)</span>'}</th><th>Notes</th></tr>${games}</table></div>
    <p class="muted pg-small">Market = DraftKings' no-vig chance. Our model uses the official injury report when the daily run recorded it (the feed-only number shows beside it when they differ). Season so far, our model is level with the closing line, not ahead of it — see Models vs market.</p>
  </div>`;
}

// ---------- Profit ----------

// One series: the running profit over recorded nights, zero line, native hover titles per night.
function _pgRunningChart(perNight) {
  const pts = perNight.filter(n => n.running != null);
  if (pts.length < 2) return '';
  const W = 640, H = 200, L = 52, R = 12, T = 12, B = 28;
  const ys = pts.map(n => n.running).concat(0), lo = Math.min(...ys), hi = Math.max(...ys), pad = (hi - lo) * 0.1 || 10;
  const y0 = lo - pad, y1 = hi + pad, x = (i) => L + (i * (W - L - R)) / (pts.length - 1), y = (v) => T + ((y1 - v) * (H - T - B)) / (y1 - y0);
  const path = pts.map((n, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(n.running).toFixed(1)}`).join(' ');
  const ticks = [y0 + pad, (y0 + y1) / 2, y1 - pad].map(v => Math.round(v / 10) * 10);
  const col = (W - L - R) / (pts.length - 1);
  return `<svg class="pg-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Running profit by night">
    ${[...new Set(ticks)].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="pg-grid"/><text x="${L - 6}" y="${(y(v) + 4).toFixed(1)}" class="pg-axis" text-anchor="end">${v < 0 ? '−' : ''}$${Math.abs(v)}</text>`).join('')}
    <line x1="${L}" x2="${W - R}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}" class="pg-zero"/>
    <path d="${path}" class="pg-line"/>
    ${pts.map((n, i) => `<g class="pg-pt"><rect x="${(x(i) - col / 2).toFixed(1)}" y="${T}" width="${col.toFixed(1)}" height="${H - T - B}" fill="transparent"><title>${_pgDay(n.date)}: night ${n.profit >= 0 ? '+' : '−'}$${Math.abs(n.profit).toFixed(2)}, running ${n.running >= 0 ? '+' : '−'}$${Math.abs(n.running).toFixed(2)}</title></rect><circle cx="${x(i).toFixed(1)}" cy="${y(n.running).toFixed(1)}" r="4"/></g>`).join('')}
    <text x="${L}" y="${H - 8}" class="pg-axis">${_pgDay(pts[0].date)}</text><text x="${W - R}" y="${H - 8}" class="pg-axis" text-anchor="end">${_pgDay(pts[pts.length - 1].date)}</text>
  </svg>`;
}

function renderProfitTab() {
  const S = SEASON_ALL25_SPEC, rows = loadSeasonLedger();
  const sum = seasonAll25Summary(rows, typeof SEASON_PITCH_LEDGER !== 'undefined' ? SEASON_PITCH_LEDGER : [], typeof SEASON_PITCH2_LEDGER !== 'undefined' ? SEASON_PITCH2_LEDGER : [],
    typeof SEASON_BACKFILL !== 'undefined' ? SEASON_BACKFILL : null);
  const L = sum.live, B = sum.backfill, A = L.all;
  if (!L.nights) return '<div class="home-empty">No pitched nights yet.</div>';
  const NAME = { floor: 'Floor', edge: 'Edge', favourites: 'Favourites', 'pitch-3 pair': 'pitch-3 pairs', 'pitch-3': 'pitch-3 single picks' };
  const row = (label, t, bold) => `<tr><td>${bold ? `<b>${label}</b>` : label}</td><td class="num">${t.n ? `${t.won}/${t.n}` : '—'}</td><td class="num">${t.staked ? '$' + t.staked : '—'}</td><td class="num">${t.n ? _pgMoney(t.profit) : '—'}</td><td class="num">${_pgRoi(t.roi)}</td></tr>`;
  const by = (o) => Object.entries(o).filter(([, t]) => t.n).map(([k, t]) => row(`&nbsp;&nbsp;${NAME[k] || k}`, t)).join('');
  const flat = typeof seasonFlatSummary === 'function' ? seasonFlatSummary(rows, typeof SEASON_USER_LEGS !== 'undefined' ? SEASON_USER_LEGS : [], typeof SEASON_PITCH2_LEDGER !== 'undefined' ? SEASON_PITCH2_LEDGER : []).ledger.clean : null;
  const nights = sum.perNight.filter(n => n.source === 'live').map(n => `<tr><td>${_pgDayLink(n.date)}</td>
    <td class="num">${n.parlays.n ? `${n.parlays.won}/${n.parlays.n}` : '—'}</td><td class="num">${n.legs.n ? `${n.legs.won}/${n.legs.n}` : '—'}</td><td class="num">${_pgMoney(n.profit)}</td><td class="num">${n.running == null ? '—' : _pgMoney(n.running)}</td></tr>`).join('');
  const expPct = A.expN && A.staked ? A.expected / (A.expN * S.stake) : null;
  const luck = all25Luck(sum.nights.filter(n => n.source === 'live'), 5000, 7);
  const odds1in = luck.share > 0 ? Math.round(1 / luck.share) : null;
  const luckLine = luck.n ? (luck.z >= 1.5
      ? ` Simulating every game at those same chances (parlays and their legs share results), a run this good came up in ${(luck.share * 100).toFixed(1)}% of trials${odds1in ? ` — about 1 in ${odds1in}` : ''}, ${luck.z.toFixed(1)} standard errors above expectation. That is a lucky stretch, not evidence of an edge: heavy favourites have won more often than their prices said this season, and past seasons don't show that lasting.`
      : ` Simulating every game at those same chances, the result is ${luck.z >= 0 ? luck.z.toFixed(1) + ' standard errors above' : Math.abs(luck.z).toFixed(1) + ' standard errors below'} expectation — inside ordinary luck.`)
    : '';
  return `<div class="ledger pg">
    <div class="pg-hero"><div class="pg-hero-t">$${S.stake} on every parlay and leg since ${_pgDay(S.firstNight)}</div>
      <div class="pg-hero-v">${_pgMoney(A.profit)}</div>
      <div class="pg-hero-s">${A.won} of ${A.n} bets won · $${A.staked} staked · ROI ${_pgRoi(A.roi)} · ${L.nights} recorded nights</div></div>
    ${_pgRunningChart(sum.perNight)}
    <div class="pg-note"><b>Read this before the number.</b> At the prices we took, the market's own chances expected ${_pgMoney(A.expected)}${expPct != null ? ` (${_pgRoi(expPct)})` : ''} on these bets, and the price check against Pinnacle's sharper line (shop-2, Nov 8–18) put the same bets about 4% below fair.${luckLine}</div>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Recorded nights</th><th class="num">Won</th><th class="num">Staked</th><th class="num">Profit</th><th class="num">ROI</th></tr>
      ${row('Parlays', L.parlays, true)}${by(L.parlaysBy)}${row('Legs', L.legs, true)}${by(L.legsBy)}${row('All', A, true)}</table></div>
    <p class="muted pg-small">Floor tickets and prop legs aren't in the dollars — no price was recorded (FanDuel's ladder doesn't reach our floor lines): ${A.unpriced.won} of ${A.unpriced.n} won${A.unpriced.n ? `, ${_pgMoney(A.unpriced.atFair)} at our own fair price` : ''}; a real book would pay less.
      ${flat && flat.n ? ` Benchmark — $${S.stake} on every favourite (flat-1): ${flat.won}/${flat.n}, ${_pgMoney(flat.profit)} on $${flat.staked}.` : ''}
      ${B.nights ? ' The backfilled nights have their own section below.' : ''}
      A leg on two tickets counts once. Spec ${S.version}; never a stake size.</p>
    <details class="pg-details"><summary>Night by night</summary>
      <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Night</th><th class="num">Parlays won</th><th class="num">Legs won</th><th class="num">Night</th><th class="num">Running</th></tr>${nights}</table></div></details>
    ${B.nights ? _pgBackfillSection(sum, row, by) : ''}
  </div>`;
}

// The nights the daily run missed, rebuilt afterwards by the same frozen rules (season-backfill.js):
// their own table and running total, kept out of the recorded total, plus the two combined.
function _pgBackfillSection(sum, row, by) {
  const S = SEASON_ALL25_SPEC, B = sum.backfill, A = sum.live.all;
  const bn = sum.perNight.filter(n => n.source === 'backfill');
  let run = 0;
  const nights = bn.map(n => { run += n.profit; return `<tr><td>${_pgDayLink(n.date)}</td><td class="num">${n.parlays.n ? `${n.parlays.won}/${n.parlays.n}` : '—'}</td>
    <td class="num">${n.legs.n ? `${n.legs.won}/${n.legs.n}` : '—'}</td><td class="num">${_pgMoney(n.profit)}</td><td class="num">${_pgMoney(+run.toFixed(2))}</td></tr>`; }).join('');
  const tp = +(A.profit + B.all.profit).toFixed(2), ts = A.staked + B.all.staked, tw = A.won + B.all.won, tn = A.n + B.all.n;
  return `<h3>Backfilled nights — ${_pgDay(bn[0].date)} to ${_pgDay(bn[bn.length - 1].date)} <span class="res-tag replay">not in the total above</span></h3>
    <p class="muted">The daily run didn't record these nights. Their tickets were rebuilt afterwards by the same frozen rules, from information available before each game (box scores from earlier days, the official injury report 60+ minutes before tip), priced at DraftKings' closing line and graded from the finals. Not recorded before tip, so they stay out of the recorded total.</p>
    <div class="scorecard"><div class="score-tile"><div class="t">Backfilled week</div><div class="v">${_pgMoney(B.all.profit)}</div><div class="s">${B.all.won} of ${B.all.n} bets won · $${B.all.staked} staked · ROI ${_pgRoi(B.all.roi)} · ${B.nights} nights</div></div>
      <div class="score-tile"><div class="t">Including the backfilled week</div><div class="v">${_pgMoney(tp)}</div><div class="s">${tw} of ${tn} bets won · $${ts} staked · ROI ${_pgRoi(ts ? tp / ts : null)} since ${_pgDay(S.firstNight)}</div></div></div>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Backfilled nights</th><th class="num">Won</th><th class="num">Staked</th><th class="num">Profit</th><th class="num">ROI</th></tr>
      ${row('Parlays', B.parlays, true)}${by(B.parlaysBy)}${row('Legs', B.legs, true)}${by(B.legsBy)}${row('All', B.all, true)}</table></div>
    <p class="muted pg-small">Floor tickets and prop legs (unpriced): ${B.all.unpriced.won} of ${B.all.unpriced.n} won${B.all.unpriced.n ? `, ${_pgMoney(B.all.unpriced.atFair)} at our own fair price` : ''}. Click a night for its games and tickets on Results by Day.</p>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Night</th><th class="num">Parlays won</th><th class="num">Legs won</th><th class="num">Night</th><th class="num">Running (backfilled)</th></tr>${nights}</table></div>`;
}

// ---------- Models vs market ----------

function renderModelsTab() {
  const rows = loadSeasonLedger(), sb = seasonScoreboard(rows), C = sb.close;
  if (!C.n) return '<div class="home-empty">No settled games yet.</div>';
  const diff = (m) => (m.n ? `${m.diff >= 0 ? '+' : '−'}${Math.abs(m.diff).toFixed(4)} <span class="muted">± ${m.se.toFixed(4)}</span>` : '—');
  const tone = (m) => (/worse/.test(m.verdict) ? 'neg' : /better/.test(m.verdict) ? 'pos' : '');
  const models = sb.models.filter(m => m.n).map(m => `<tr><td><b>${m.label}</b></td><td class="num">${m.n}</td>
    <td class="num">${_pgPct(m.winners)} <span class="muted">vs ${_pgPct(m.winnersClose)}</span></td><td class="num">${m.brier.toFixed(4)} <span class="muted">vs ${m.brierClose.toFixed(4)}</span></td>
    <td class="num">${diff(m)}</td><td class="${tone(m)}">${m.verdict}</td></tr>`).join('');
  const calM = seasonCalibration(rows, seasonCloseHome), calO = seasonCalibration(rows, r => r.pOurs);
  const cal = calM.map((b, i) => { const o = calO[i]; return `<tr><td>${Math.round(b.lo * 100)}–${Math.round(b.hi * 100)}%</td>
    <td class="num">${b.n ? `${_pgPct(b.won)} <span class="muted">said ${_pgPct(b.said)} · ${b.n}</span>` : '—'}</td><td class="num">${o.n ? `${_pgPct(o.won)} <span class="muted">said ${_pgPct(o.said)} · ${o.n}</span>` : '—'}</td></tr>`; }).join('');
  const wO = seasonWeekly(rows, r => r.pOurs), wN = seasonWeekly(rows, r => r.pFriend);
  const weeks = wO.map(w => { const n = wN.find(x => x.week === w.week); return `<tr><td>Week of ${_pgDay(w.week)}</td><td class="num">${w.n}</td><td class="num">${diff(w)}</td><td class="num">${n && n.n ? diff(n) : '—'}</td></tr>`; }).join('');
  return `<div class="ledger pg">
    <div class="pg-head"><h2>Models vs market</h2>
      <p class="muted">Every settled game recorded before tip, scored against DraftKings' closing line (no-vig) on the same games. Brier is the squared error of the win chance — lower is better. A difference inside about two standard errors is noise, so it reads "level".</p></div>
    <div class="scorecard"><div class="score-tile"><div class="t">Market (closing line)</div><div class="v">${_pgPct(C.winners)}</div><div class="s">winners picked · Brier ${C.brier.toFixed(4)} · ${C.n} games</div></div></div>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Model</th><th class="num">Games</th><th class="num">Winners · close</th><th class="num">Brier · close</th><th class="num">Model − close</th><th>Verdict</th></tr>${models}</table></div>
    <h3>When a side was favoured, how often did it win?</h3>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Favourite's chance</th><th class="num">Market (close)</th><th class="num">Our model</th></tr>${cal}</table></div>
    <h3>Week by week: Brier, model − close</h3>
    <div style="overflow-x:auto"><table class="parlay-legs"><tr><th>Week</th><th class="num">Games</th><th class="num">Our model</th><th class="num">NB.AI</th></tr>${weeks}</table></div>
    <p class="muted pg-small">The leak-free replay of the whole season (Research → Results by Day → Replay) tells the same story: the model is level with the close. It often agrees early with where the line ends up, but most of that comes from seeing injury news the opening price didn't have, not from knowing more than the market.</p>
  </div>`;
}
