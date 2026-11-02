// ============================================================
// BASEBALL UI + SPORT SWITCHER (scaffold)
// ============================================================
// Provides the top-level sport switcher (NBA <-> Baseball) and the baseball
// section's own mini-router + pages. Additive: the NBA switchPage() router
// (js/ui/navigation.js) is untouched; switchSport('nba') simply calls the
// existing switchPage('home') to restore the NBA experience.
//
// Demonstrates that the existing sport-agnostic engine (classifyBet,
// detectMarketDisagreement, recommendStake) works on baseball bet objects
// with no NBA data present.
// ============================================================

let currentSport = 'nba';
let currentBaseballPage = 'schedule';

// ── Top-level sport switcher ────────────────────────────────
function switchSport(sport) {
  currentSport = sport;
  document.querySelectorAll('.sport-btn').forEach(b => b.classList.remove('active'));
  const toggle = document.querySelector(`.sport-btn[onclick="switchSport('${sport}')"]`);
  if (toggle) toggle.classList.add('active');

  const nbaNav = document.getElementById('pageNav');
  const mlbNav = document.getElementById('pageNavMlb');
  const tabsEl = document.getElementById('tabs');

  if (sport === 'baseball') {
    if (nbaNav) nbaNav.style.display = 'none';
    if (tabsEl) tabsEl.style.display = 'none';
    if (mlbNav) mlbNav.style.display = 'flex';
    switchBaseballPage('schedule');
  } else if (sport === 'game') {
    // Playoff Run (js/game/) — its own section with an internal flow,
    // no top page-nav. renderGameSection is the game namespace's entry.
    if (nbaNav) nbaNav.style.display = 'none';
    if (mlbNav) mlbNav.style.display = 'none';
    if (tabsEl) tabsEl.style.display = 'none';
    renderGameSection(document.getElementById('main'));
  } else {
    if (mlbNav) mlbNav.style.display = 'none';
    if (nbaNav) nbaNav.style.display = 'flex';
    switchPage('home'); // restore NBA (existing router, untouched)
  }
}

// ── Baseball mini-router ────────────────────────────────────
function switchBaseballPage(page) {
  currentBaseballPage = page;
  document.querySelectorAll('#pageNavMlb .mlb-nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.mlb-nav-btn[onclick="switchBaseballPage('${page}')"]`);
  if (btn) btn.classList.add('active');

  const mainEl = document.getElementById('main');
  const tabsEl = document.getElementById('tabs');
  if (tabsEl) tabsEl.style.display = 'none';

  if (page === 'schedule') renderBaseballSchedulePage(mainEl);
  else if (page === 'bets') renderBaseballBetsPage(mainEl);
}

// ── Helpers ─────────────────────────────────────────────────
function mlbFmtOdds(n) {
  if (n == null || isNaN(n)) return '—';
  return n > 0 ? `+${n}` : `${n}`;
}

function mlbTeamName(abbr) {
  return (typeof MLB_TEAMS !== 'undefined' && MLB_TEAMS[abbr]) ? MLB_TEAMS[abbr].name : abbr;
}

function mlbPanel(inner, accent) {
  const border = accent || 'var(--border)';
  return `<div style="background:rgba(0,0,0,0.25);border:1px solid ${border};border-radius:10px;padding:14px;margin-bottom:14px;">${inner}</div>`;
}

// Render one game card: matchup, starting pitchers, ML + total.
function renderMlbGameCard(g) {
  const m = g.markets || {};
  const ml = m.ml || {};
  const tot = m.total || {};
  return mlbPanel(`
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
      <span style="font-size:15px;font-weight:700;color:var(--text);">${mlbTeamName(g.awayTeam)} @ ${mlbTeamName(g.homeTeam)}</span>
      <span style="font-size:11px;color:var(--text-dim);">${g.time || ''} &middot; ${(typeof MLB_PARKS !== 'undefined' && MLB_PARKS[g.park]) ? MLB_PARKS[g.park].name : g.park}</span>
    </div>
    <div style="font-size:12px;color:var(--text-dim);line-height:1.7;">
      <div>${g.awayTeam} SP: <strong style="color:var(--text);">${g.awayPitcher ? g.awayPitcher.name : 'TBD'}</strong>${g.awayPitcher ? ` (${g.awayPitcher.throws}, ${g.awayPitcher.era} ERA, ${g.awayPitcher.k9} K/9)` : ''}</div>
      <div>${g.homeTeam} SP: <strong style="color:var(--text);">${g.homePitcher ? g.homePitcher.name : 'TBD'}</strong>${g.homePitcher ? ` (${g.homePitcher.throws}, ${g.homePitcher.era} ERA, ${g.homePitcher.k9} K/9)` : ''}</div>
    </div>
    <div style="margin-top:8px;font-size:12px;color:var(--text);">
      <span style="margin-right:14px;">ML: ${g.awayTeam} ${mlbFmtOdds(ml.away)} / ${g.homeTeam} ${mlbFmtOdds(ml.home)}</span>
      <span>Total: ${tot.line != null ? tot.line : '—'} (O ${mlbFmtOdds(tot.over)} / U ${mlbFmtOdds(tot.under)})</span>
    </div>`);
}

// Cross-sport REUSE DEMO: run a baseball bet through the NBA-era engine.
function mlbReuseDemoHtml() {
  if (typeof MLB_BETS === 'undefined' || !MLB_BETS.length) return '';
  if (typeof classifyBet !== 'function') return '';
  const bet = MLB_BETS[0];
  const cls = classifyBet(bet);
  // Illustrative model probability (the real MLB model is coming soon).
  const illustrativeProb = 0.66;
  let stakeLine = '';
  if (typeof detectMarketDisagreement === 'function' && typeof recommendStake === 'function') {
    const dis = detectMarketDisagreement(illustrativeProb, bet.americanOdds);
    const stake = recommendStake(1000, dis);
    stakeLine = `<div style="margin-top:6px;">recommendStake($1000 bankroll) &rarr; <strong style="color:var(--green);">$${stake.recommendedStake}</strong> <span style="color:var(--text-dim);">(${stake.explain || ''})</span></div>`;
  }
  return mlbPanel(`
    <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:6px;">Cross-sport engine check</div>
    <div style="font-size:12px;color:var(--text);line-height:1.6;">
      <div>Bet: <strong>${bet.pick}</strong> (${bet.type}, ${bet.confidence}, ${mlbFmtOdds(bet.americanOdds)})</div>
      <div style="margin-top:6px;">classifyBet() &rarr; <strong style="color:var(--text);">${cls.recommendation}</strong> <span style="color:var(--text-dim);">(${cls.explain || cls.basis || ''})</span></div>
      ${stakeLine}
      <div style="margin-top:8px;font-size:11px;color:var(--text-dim);">The existing edge-detector + risk-controls (built for NBA) run unchanged on a baseball bet object — proving the betting/risk layer is sport-agnostic. Model probability above is illustrative until the MLB engine ships.</div>
    </div>`, 'var(--accent)');
}

function mlbBetPillHtml(bet) {
  let rec = 'CAUTION';
  if (typeof classifyBet === 'function') rec = classifyBet(bet).recommendation || 'CAUTION';
  const color = rec === 'PLACE' ? 'var(--green)' : rec === 'SKIP' ? 'var(--red, #ef4444)' : '#f59e0b';
  return mlbPanel(`
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:13px;font-weight:700;color:var(--text);">${bet.pick}</span>
      <span style="font-size:11px;font-weight:700;color:${color};border:1px solid ${color};border-radius:6px;padding:2px 8px;">${rec}</span>
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${bet.type} &middot; ${bet.confidence} &middot; ${mlbFmtOdds(bet.americanOdds)}</div>`);
}

// ── Pages ───────────────────────────────────────────────────
function renderBaseballSchedulePage(el) {
  if (!el) return;
  const today = (typeof MLB_CURRENT_DATE !== 'undefined') ? MLB_CURRENT_DATE : '2026-06-16';
  const all = (typeof MLB_SCHEDULE !== 'undefined') ? MLB_SCHEDULE : [];
  const games = all.filter(g => g.date === today);

  // Optional additive validation (does not touch the NBA banner).
  if (typeof validateMlbSchedule === 'function') {
    const errs = validateMlbSchedule(all);
    if (errs.length) console.warn('[mlb-validators]', errs);
  }

  el.innerHTML = `
    <div style="padding:4px 0 12px;">
      <div style="font-size:20px;font-weight:800;color:var(--text);">⚾ Baseball — ${today}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">Scaffold: game-centric schedule + sport-agnostic engine reuse. Projection model coming soon.</div>
    </div>
    ${games.length ? games.map(renderMlbGameCard).join('') : mlbPanel('<span style="color:var(--text-dim);">No games scheduled today.</span>')}
    ${mlbPanel('<span style="color:var(--text-dim);">MLB projection model — <strong style="color:var(--text);">coming soon</strong>. The pitcher-vs-batter engine (log5 / run-expectancy / FIP·xwOBA, park + weather, times-through-order) plugs in here.</span>')}
    ${mlbReuseDemoHtml()}
  `;
}

function renderBaseballBetsPage(el) {
  if (!el) return;
  const bets = (typeof MLB_BETS !== 'undefined') ? MLB_BETS : [];
  el.innerHTML = `
    <div style="padding:4px 0 12px;">
      <div style="font-size:20px;font-weight:800;color:var(--text);">⚾ Baseball Bets</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">Each pick auto-classified by the existing (NBA-era) edge-detector — no baseball-specific bet logic needed.</div>
    </div>
    ${bets.length ? bets.map(mlbBetPillHtml).join('') : mlbPanel('<span style="color:var(--text-dim);">No baseball bets yet.</span>')}
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    switchSport, switchBaseballPage,
    renderBaseballSchedulePage, renderBaseballBetsPage, renderMlbGameCard,
  };
}
