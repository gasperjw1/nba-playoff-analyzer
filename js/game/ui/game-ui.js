// ============================================================
// PLAYOFF RUN — UI (Phase 3)
// ============================================================
// The game section, rendered into #main via the sport switcher (baseball
// precedent). Existing dashboard idiom: string-building renderers + small
// global onclick handlers; game-scoped CSS injected once (styles.css is
// an analyzer file and stays untouched).
//
// Screens: Setup (equity-honest team select) → Gameplan (minutes budget,
// coverage, scratches) → Result (quarter margin trace, box scores, CVA
// chip) → looping through the bracket → Summary (CVA total, run grade).
// Design law #2 everywhere: the user sees samples and observed evidence,
// never the sim's expected values or hidden shifts.
//
// Persistence: one run at a time in localStorage (serializeRun /
// restoreRun; RNG fast-forward). Saved after every user game.
// ============================================================

const GAME_UI = {
  run: null, session: null,
  view: 'setup',            // 'setup' | 'plan' | 'result' | 'bracket' | 'summary'
  lastGame: null,
  planMinutes: {},          // name -> minutes staged for the next game
  planDouble: '',           // opponent player name or ''
  ticker: [],               // CPU series completed since last user screen
  eliminated: false,
};
const GAME_SAVE_KEY = 'playoffRunV1';

// ── Small helpers ───────────────────────────────────────────────
function gameEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
function gamePct(v) { return (100 * v).toFixed(v >= 0.1 ? 0 : 1) + '%'; }
function gameUserSide() {
  return GAME_UI.session && GAME_UI.run.userTeam === GAME_UI.session.homeAbbr ? 'home' : 'away';
}
function gameOppAbbr() {
  const s = GAME_UI.session;
  return GAME_UI.run.userTeam === s.homeAbbr ? s.awayAbbr : s.homeAbbr;
}
function gameSaveNow() {
  try { localStorage.setItem(GAME_SAVE_KEY, serializeRun(GAME_UI.run, GAME_UI.session)); } catch (_) {}
}
function gameHasSave() {
  try { return !!localStorage.getItem(GAME_SAVE_KEY); } catch (_) { return false; }
}

// ── Entry point (called by the sport switcher) ──────────────────
function renderGameSection(el) {
  gameInjectCSS();
  if (!GAME_UI.run && gameHasSave()) {
    try {
      const restored = restoreRun(GAME_TEAM_DB, localStorage.getItem(GAME_SAVE_KEY));
      GAME_UI.run = restored.run;
      GAME_UI.session = restored.session;
      GAME_UI.view = restored.session ? 'plan' : 'setup';
      if (restored.session) gameInitPlanDefaults();
      if (!restored.session) { gameResumeAdvance(); return; }
    } catch (_) { GAME_UI.run = null; GAME_UI.session = null; GAME_UI.view = 'setup'; }
  }
  gameRender(el);
}

function gameResumeAdvance() {
  // Restored between series: advance the bracket to the next decision point.
  gameAdvance();
}

function gameRender(el) {
  el = el || document.getElementById('main');
  const v = GAME_UI.view;
  if (v === 'setup') el.innerHTML = renderGameSetup();
  else if (v === 'plan') el.innerHTML = renderGameplan();
  else if (v === 'result') el.innerHTML = renderGameResult();
  else if (v === 'bracket') el.innerHTML = renderGameBracket(true);
  else if (v === 'summary') el.innerHTML = renderRunSummary();
}

// ── Screen: run setup ───────────────────────────────────────────
function renderGameSetup() {
  const teams = Object.values(GAME_TEAM_DB).slice()
    .sort((a, b) => (GAME_EQUITY_2026[b.abbr] || 0) - (GAME_EQUITY_2026[a.abbr] || 0));
  const cards = teams.map(t => `
    <div class="pr-team-card" onclick="gameStartRun('${t.abbr}')" style="border-left:4px solid ${t.color}">
      <div class="pr-team-name">${gameEsc(t.city)} ${gameEsc(t.name)}</div>
      <div class="pr-team-meta">#${t.seed} ${t.conf} · ${gameEsc(t.record)} · ${gameEsc(t.coach.coach)}</div>
      <div class="pr-team-equity">Title equity <strong>${gamePct(GAME_EQUITY_2026[t.abbr] || 0)}</strong></div>
    </div>`).join('');
  return `
  <div class="pr-wrap">
    <div class="pr-header">
      <h2>Playoff Run</h2>
      <p>Coach one team through the 2026 bracket. AI coaches run the other 15 — every run diverges.
      Title equity shown is the honest CPU-vs-CPU baseline (4,000 brackets): your score is measured
      against it, so a deep run with a longshot outranks a ring with the favorite.</p>
      <div class="pr-seed-row">Run seed:
        <input id="prSeed" type="number" value="${Math.floor(Math.random() * 100000)}">
        <span class="pr-dim">same seed + same decisions = same run (shareable)</span>
      </div>
    </div>
    <div class="pr-team-grid">${cards}</div>
  </div>`;
}

function gameStartRun(abbr) {
  const seedEl = document.getElementById('prSeed');
  const seed = seedEl ? (parseInt(seedEl.value) || 1) : 1;
  GAME_UI.run = createGameRun(GAME_TEAM_DB, { seed, userTeam: abbr });
  GAME_UI.session = null;
  GAME_UI.ticker = [];
  GAME_UI.eliminated = false;
  gameAdvance();
}

// ── Bracket advance: play CPU series until it's the user's turn ──
function gameAdvance() {
  const run = GAME_UI.run;
  let pair;
  while ((pair = gameNextSeriesPair(run.db, run.series))) {
    const userIn = !GAME_UI.eliminated &&
      (pair.a === run.userTeam || pair.b === run.userTeam);
    if (userIn) {
      GAME_UI.session = openRunSeries(run, pair.a, pair.b, pair.round);
      gameInitPlanDefaults();
      GAME_UI.view = 'plan';
      gameSaveNow();
      gameRender();
      return;
    }
    const rec = playRunSeries(run, pair.a, pair.b, pair.round);
    GAME_UI.ticker.push(rec);
  }
  GAME_UI.view = 'summary';
  gameSaveNow();
  gameRender();
}

function gameInitPlanDefaults() {
  const run = GAME_UI.run, session = GAME_UI.session;
  const abbr = run.userTeam;
  const team = session.sctx.home.abbr === abbr ? session.sctx.home : session.sctx.away;
  const gs = getUpcomingGameState(run, session, abbr);
  const out = new Set(gs.unavailable);
  const pool = team.players.filter(p =>
    p.initialStatus === 'available' && p.baseRating > 0 && !out.has(p.name));
  GAME_UI.planMinutes = {};
  const rot = gameDefaultRotation(pool, team.coach.rotationDepth);
  rot.forEach(r => { GAME_UI.planMinutes[r.player.name] = Math.round(r.minutes); });
  // Per-player rounding can land at 239-241; settle the difference on the
  // biggest-minutes player so the staged plan starts at exactly 240.
  const total = Object.values(GAME_UI.planMinutes).reduce((a, b) => a + b, 0);
  if (total !== 240 && rot.length) {
    const top = rot.reduce((a, b) => (b.minutes > a.minutes ? b : a)).player.name;
    GAME_UI.planMinutes[top] = Math.max(0, Math.min(42, GAME_UI.planMinutes[top] + (240 - total)));
  }
  GAME_UI.planDouble = '';
}

// ── Screen: gameplan ────────────────────────────────────────────
function renderGameplan() {
  const run = GAME_UI.run, session = GAME_UI.session;
  const abbr = run.userTeam;
  const sctx = session.sctx;
  const userIsHome = sctx.home.abbr === abbr;
  const team = userIsHome ? sctx.home : sctx.away;
  const opp = userIsHome ? sctx.away : sctx.home;
  const g = session.games.length + 1;
  const gs = getUpcomingGameState(run, session, abbr);
  const out = new Set(gs.unavailable);
  const atHome = gameVenueIsHome(g) === userIsHome;
  const myWins = userIsHome ? session.score.home : session.score.away;
  const oppWins = userIsHome ? session.score.away : session.score.home;

  const total = Object.values(GAME_UI.planMinutes).reduce((a, b) => a + (+b || 0), 0);
  const totalCls = Math.abs(total - 240) < 1 ? 'pr-ok' : 'pr-warn';

  const rows = team.players
    .filter(p => p.baseRating > 0 && p.initialStatus === 'available')
    .sort((a, b) => b.baseRating - a.baseRating)
    .map(p => {
      const isOut = out.has(p.name);
      const drag = gs.drags && gs.drags[p.name];
      const fat = gs.fatigue[p.name] || 0;
      const seriesAvg = gameSeriesAvg(session, userIsHome ? 'home' : 'away', p.name);
      const badge = isOut ? '<span class="pr-badge pr-out">OUT</span>'
        : drag ? '<span class="pr-badge pr-drag">HURT</span>'
        : fat >= 0.25 ? '<span class="pr-badge pr-tired">TIRED</span>' : '';
      const minCell = isOut ? '—'
        : `<input class="pr-min" type="number" min="0" max="42" data-player="${gameEsc(p.name)}"
             value="${GAME_UI.planMinutes[p.name] || 0}" oninput="gameSetMin(this)">`;
      return `<tr class="${isOut ? 'pr-row-out' : ''}">
        <td>${gameEsc(p.name)} ${badge}</td>
        <td class="pr-dim">${gameEsc(p.pos)} · ${gameEsc(p.offRole || '')}</td>
        <td>${p.ppg.toFixed(1)}</td>
        <td>${seriesAvg == null ? '<span class="pr-dim">—</span>' : seriesAvg.toFixed(1)}</td>
        <td>${minCell}</td>
      </tr>`;
    }).join('');

  const oppOptions = opp.players
    .filter(p => p.initialStatus === 'available' && p.baseRating > 0 && p.ppg >= 14)
    .sort((a, b) => b.ppg - a.ppg)
    .map(p => `<option value="${gameEsc(p.name)}" ${GAME_UI.planDouble === p.name ? 'selected' : ''}>
      Double ${gameEsc(p.name)} (${p.ppg.toFixed(1)} ppg)</option>`).join('');

  return `
  <div class="pr-wrap">
    ${renderGameTicker()}
    <div class="pr-header">
      <h2>${gameEsc(session.round)} · Game ${g} ${atHome ? 'vs' : '@'} ${gameEsc(opp.city)} ${gameEsc(opp.name)}</h2>
      <p>Series: you ${myWins} — ${oppWins} ${gameEsc(opp.abbr)} ·
        ${atHome ? 'Home court' : 'On the road'} ·
        Opposing coach: ${gameEsc(opp.coach.coach)}</p>
      ${renderSeriesGameLog()}
    </div>
    <div class="pr-panels">
      <div class="pr-panel">
        <h3>Rotation — <span class="${totalCls}">${total}</span>/240 min <span class="pr-dim">(cap 42/player)</span></h3>
        <table class="pr-table">
          <tr><th>Player</th><th>Role</th><th>Season</th><th>This series</th><th>Min</th></tr>
          ${rows}
        </table>
      </div>
      <div class="pr-panel">
        <h3>Coverage</h3>
        <select class="pr-select" onchange="gameSetDouble(this.value)">
          <option value="">Straight coverage (no double)</option>
          ${oppOptions}
        </select>
        <p class="pr-dim">Doubling suppresses the target but frees their teammates —
          it pays against one-initiator offenses (${gameEsc(opp.abbr)}: ${opp.initiators} initiator${opp.initiators === 1 ? '' : 's'}),
          and gets punished by deep ones.</p>
        <button class="btn btn-primary pr-play" onclick="gamePlayGame()" ${Math.abs(total - 240) < 1 ? '' : 'disabled'}>
          Play Game ${g}</button>
        <button class="btn btn-secondary" onclick="gameShowBracket()">Bracket</button>
      </div>
    </div>
  </div>`;
}

function gameSeriesAvg(session, sideKey, name) {
  const pts = [];
  session.games.forEach(gm => gm.box[sideKey].forEach(r => { if (r.name === name) pts.push(r.pts); }));
  return pts.length ? pts.reduce((a, b) => a + b, 0) / pts.length : null;
}

function renderSeriesGameLog() {
  const session = GAME_UI.session;
  if (!session || !session.games.length) return '';
  const abbr = GAME_UI.run.userTeam;
  const rows = session.games.map(gm => {
    const won = gm.winner === abbr;
    return `<span class="pr-log ${won ? 'pr-w' : 'pr-l'}">G${gm.gameNum} ${won ? 'W' : 'L'} ${gm.homeScore}-${gm.awayScore}${gm.ot ? ' OT' : ''}</span>`;
  }).join(' ');
  return `<div class="pr-loglist">${rows}</div>`;
}

function renderGameTicker() {
  if (!GAME_UI.ticker.length) return '';
  const items = GAME_UI.ticker.map(r =>
    `<span class="pr-tick">${gameEsc(r.round)}: ${gameEsc(r.winner)} def. ${gameEsc(r.winner === r.home ? r.away : r.home)} in ${r.games.length}</span>`).join(' · ');
  GAME_UI.ticker = [];
  return `<div class="pr-ticker">Elsewhere: ${items}</div>`;
}

function gameSetMin(input) {
  const v = Math.max(0, Math.min(42, parseInt(input.value) || 0));
  GAME_UI.planMinutes[input.dataset.player] = v;
  // live-update the total without a full re-render (keeps focus)
  const total = Object.values(GAME_UI.planMinutes).reduce((a, b) => a + (+b || 0), 0);
  const el = document.querySelector('.pr-panel h3 span');
  if (el) { el.textContent = total; el.className = Math.abs(total - 240) < 1 ? 'pr-ok' : 'pr-warn'; }
  const btn = document.querySelector('.pr-play');
  if (btn) btn.disabled = Math.abs(total - 240) >= 1;
}
function gameSetDouble(v) { GAME_UI.planDouble = v; }

function gamePlayGame() {
  const run = GAME_UI.run, session = GAME_UI.session;
  const abbr = run.userTeam;
  const team = session.sctx.home.abbr === abbr ? session.sctx.home : session.sctx.away;
  const byName = {};
  team.players.forEach(p => { byName[p.name] = p; });
  const rotation = Object.entries(GAME_UI.planMinutes)
    .filter(([n, m]) => byName[n] && m > 0)
    .map(([n, m]) => ({ player: byName[n], minutes: +m }));
  const plan = { rotation, doubleTarget: GAME_UI.planDouble || null };
  GAME_UI.lastGame = playSeriesGame(run, session, plan);
  gameSaveNow();
  GAME_UI.view = 'result';
  gameRender();
}

// ── Screen: game result ─────────────────────────────────────────
function renderGameResult() {
  const run = GAME_UI.run, session = GAME_UI.session, gm = GAME_UI.lastGame;
  const abbr = run.userTeam;
  const sctx = session.sctx;
  const userIsHome = sctx.home.abbr === abbr;
  const won = gm.winner === abbr;
  const my = userIsHome ? gm.homeScore : gm.awayScore;
  const their = userIsHome ? gm.awayScore : gm.homeScore;
  const opp = userIsHome ? sctx.away : sctx.home;
  const myWins = userIsHome ? session.score.home : session.score.away;
  const oppWins = userIsHome ? session.score.away : session.score.home;

  const cvaChip = gm.cva
    ? `<span class="pr-cva ${gm.cva.delta >= 0 ? 'pr-w' : 'pr-l'}"
         title="Your plan vs your assistant's, in expected margin — graded on the decision, not the dice">
         Coaching: ${gm.cva.delta >= 0 ? '+' : ''}${gm.cva.delta.toFixed(1)} exp pts vs assistant</span>`
    : '';

  let next;
  if (session.done) {
    const wonSeries = (session.score.home === 4) === userIsHome;
    next = `<div class="pr-seriesend ${wonSeries ? 'pr-w' : 'pr-l'}">
        ${wonSeries ? 'SERIES WON' : 'ELIMINATED'} ${Math.max(session.score.home, session.score.away)}-${Math.min(session.score.home, session.score.away)}
      </div>
      <button class="btn btn-primary" onclick="gameSeriesDone(${wonSeries})">
        ${wonSeries ? 'Continue the run →' : 'See how it ends →'}</button>`;
  } else {
    next = `<button class="btn btn-primary" onclick="gameNextGame()">Plan Game ${session.games.length + 1} →</button>`;
  }

  return `
  <div class="pr-wrap">
    <div class="pr-header">
      <h2 class="${won ? 'pr-w' : 'pr-l'}">${won ? 'W' : 'L'} ${my}–${their}${gm.ot ? ' (OT)' : ''} ${gameEsc(userIsHome ? 'vs' : '@')} ${gameEsc(opp.abbr)}</h2>
      <p>Series: you ${myWins} — ${oppWins} · ${cvaChip}</p>
    </div>
    <div class="pr-panels">
      <div class="pr-panel">
        <h3>Game flow <span class="pr-dim">(your margin by quarter)</span></h3>
        ${renderMarginTrace(gm, userIsHome)}
        <div class="pr-quarters">${gm.quarters.map((q, i) =>
          `<span>${i >= 4 ? 'OT' + (i - 3) : 'Q' + (i + 1)}: ${userIsHome ? q.home + '-' + q.away : q.away + '-' + q.home}</span>`).join(' ')}</div>
      </div>
      <div class="pr-panel">${renderBoxTable(gm, userIsHome ? 'home' : 'away', 'Your box score')}</div>
      <div class="pr-panel">${renderBoxTable(gm, userIsHome ? 'away' : 'home', gameEsc(opp.abbr) + ' box score')}</div>
    </div>
    <div class="pr-actions">${next}</div>
  </div>`;
}

function renderMarginTrace(gm, userIsHome) {
  let m = 0;
  const pts = [[0, 0]];
  gm.quarters.forEach((q, i) => {
    m += userIsHome ? q.home - q.away : q.away - q.home;
    pts.push([i + 1, m]);
  });
  const maxAbs = Math.max(10, ...pts.map(p => Math.abs(p[1])));
  const W = 320, H = 120, n = pts.length - 1;
  const x = i => 10 + i * (W - 20) / n;
  const y = v => H / 2 - v * (H / 2 - 12) / maxAbs;
  const line = pts.map((p, i) => (i ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1)).join(' ');
  const final = pts[pts.length - 1][1];
  return `<svg viewBox="0 0 ${W} ${H}" class="pr-trace">
    <line x1="10" y1="${H / 2}" x2="${W - 10}" y2="${H / 2}" class="pr-zero"/>
    <path d="${line}" class="${final >= 0 ? 'pr-line-w' : 'pr-line-l'}"/>
    ${pts.slice(1).map(p => `<circle cx="${x(p[0]).toFixed(1)}" cy="${y(p[1]).toFixed(1)}" r="3"/>`).join('')}
  </svg>`;
}

function renderBoxTable(gm, side, title) {
  const rows = gm.box[side].slice().sort((a, b) => b.pts - a.pts).map(r =>
    `<tr><td>${gameEsc(r.name)}</td><td>${r.min}</td><td><strong>${r.pts}</strong></td><td>${r.reb}</td><td>${r.ast}</td></tr>`).join('');
  return `<h3>${title}</h3>
    <table class="pr-table pr-box"><tr><th>Player</th><th>Min</th><th>Pts</th><th>Reb</th><th>Ast</th></tr>${rows}</table>`;
}

function gameNextGame() {
  gameInitPlanDefaults();
  GAME_UI.view = 'plan';
  gameRender();
}

function gameSeriesDone(wonSeries) {
  GAME_UI.session = null;
  if (!wonSeries) GAME_UI.eliminated = true;
  gameAdvance();
}

// ── Screen: bracket ─────────────────────────────────────────────
function renderBracketCols(run) {
  const byRound = { R1: [], R2: [], CF: [], Finals: [] };
  run.series.forEach(s => byRound[s.round].push(s));
  const col = (round, label) => `
    <div class="pr-bracket-col"><h3>${label}</h3>
      ${byRound[round].map(s => `<div class="pr-bracket-cell ${s.home === run.userTeam || s.away === run.userTeam ? 'pr-user' : ''}">
        ${gameEsc(s.home)} v ${gameEsc(s.away)}<br><strong>${gameEsc(s.winner)}</strong> in ${s.games.length}</div>`).join('')
      || '<div class="pr-dim">—</div>'}
    </div>`;
  return `<div class="pr-bracket">
    ${col('R1', 'Round 1')}${col('R2', 'Semis')}${col('CF', 'Conf Finals')}${col('Finals', 'Finals')}
  </div>`;
}

function renderGameBracket(withBack) {
  return `
  <div class="pr-wrap">
    <div class="pr-header"><h2>Bracket</h2></div>
    ${renderBracketCols(GAME_UI.run)}
    ${withBack ? '<button class="btn btn-secondary" onclick="gameBackFromBracket()">← Back</button>' : ''}
  </div>`;
}
function gameShowBracket() { GAME_UI.view = 'bracket'; gameRender(); }
function gameBackFromBracket() { GAME_UI.view = GAME_UI.session ? 'plan' : 'summary'; gameRender(); }

// ── Screen: run summary ─────────────────────────────────────────
function renderRunSummary() {
  const run = GAME_UI.run;
  const champ = gameRunChampion(run.series);
  const userChamp = champ === run.userTeam;
  const equity = GAME_EQUITY_2026[run.userTeam] || 0;
  const userSeries = run.series.filter(s => s.home === run.userTeam || s.away === run.userTeam);
  const lastRound = userSeries.length ? userSeries[userSeries.length - 1].round : '—';
  const roundLabel = userChamp ? 'NBA CHAMPIONS' :
    ({ R1: 'Eliminated in Round 1', R2: 'Eliminated in the Semis', CF: 'Eliminated in the Conference Finals', Finals: 'Lost the Finals' })[lastRound] || '—';
  const injuries = run.injuryLog.filter(ev => ev.team === run.userTeam);
  const games = userSeries.flatMap(s => s.games).filter(g => g.cva);
  return `
  <div class="pr-wrap">
    <div class="pr-header">
      <h2 class="${userChamp ? 'pr-w' : ''}">${roundLabel}</h2>
      <p>Champion: <strong>${gameEsc(champ || '—')}</strong> · Your team: ${gameEsc(run.userTeam)}
        (baseline equity ${gamePct(equity)}) · Seed ${run.seed}</p>
    </div>
    <div class="pr-panels">
      <div class="pr-panel">
        <h3>Coaching Value Added</h3>
        <p class="${run.cvaTotal >= 0 ? 'pr-w' : 'pr-l'}"><strong>${run.cvaTotal >= 0 ? '+' : ''}${run.cvaTotal.toFixed(1)} expected pts</strong>
          vs your assistant coach, across ${games.length} games — graded on decisions, not dice.</p>
        <h3>Injuries (your team)</h3>
        ${injuries.length ? injuries.map(ev =>
          `<div class="pr-dim">${gameEsc(ev.round)} G${ev.game}: ${gameEsc(ev.name)} — ${gameEsc(ev.type)}</div>`).join('') : '<p class="pr-dim">A clean run.</p>'}
        <div class="pr-actions"><button class="btn btn-primary" onclick="gameNewRun()">New Run</button></div>
      </div>
      <div class="pr-panel"><h3>Bracket</h3>${renderBracketCols(run)}</div>
    </div>
  </div>`;
}

function gameNewRun() {
  try { localStorage.removeItem(GAME_SAVE_KEY); } catch (_) {}
  GAME_UI.run = null; GAME_UI.session = null; GAME_UI.lastGame = null;
  GAME_UI.eliminated = false; GAME_UI.view = 'setup';
  gameRender();
}

// ── Game-scoped CSS (injected once; styles.css untouched) ───────
function gameInjectCSS() {
  if (document.getElementById('prCSS')) return;
  const css = `
  .pr-wrap{max-width:1100px;margin:0 auto;padding:12px}
  .pr-header h2{margin:4px 0}.pr-header p{color:var(--text-dim,#9aa4b2)}
  .pr-seed-row{margin:8px 0;color:var(--text-dim,#9aa4b2)}
  .pr-seed-row input{width:110px;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:4px 6px}
  .pr-team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-top:12px}
  .pr-team-card{background:#161d29;border:1px solid #2a3342;border-radius:8px;padding:10px 12px;cursor:pointer}
  .pr-team-card:hover{background:#1d2635}
  .pr-team-name{font-weight:600}.pr-team-meta{font-size:12px;color:#9aa4b2;margin:2px 0}
  .pr-team-equity{font-size:13px}
  .pr-panels{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin-top:12px}
  .pr-panel{background:#161d29;border:1px solid #2a3342;border-radius:8px;padding:12px}
  .pr-table{width:100%;border-collapse:collapse;font-size:13px}
  .pr-table th{text-align:left;color:#9aa4b2;font-weight:500;padding:3px 6px;border-bottom:1px solid #2a3342}
  .pr-table td{padding:3px 6px;border-bottom:1px solid #1d2635}
  .pr-min{width:52px;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:2px 4px}
  .pr-select{width:100%;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:6px;margin-bottom:8px}
  .pr-badge{font-size:10px;border-radius:3px;padding:1px 4px;margin-left:4px}
  .pr-out{background:#5c1a1a;color:#ff8181}.pr-drag{background:#5c451a;color:#ffc861}.pr-tired{background:#3a3a1a;color:#e0d060}
  .pr-row-out td{opacity:.45}
  .pr-ok{color:#4caf7d}.pr-warn{color:#ff8181}
  .pr-w{color:#4caf7d}.pr-l{color:#ff8181}.pr-dim{color:#9aa4b2;font-size:12px}
  .pr-play{margin:8px 6px 0 0}
  .pr-actions{margin:14px 0}
  .pr-trace{width:100%;max-width:420px;background:#10161f;border-radius:6px}
  .pr-trace .pr-zero{stroke:#2a3342;stroke-width:1}
  .pr-trace path{fill:none;stroke-width:2.5}.pr-line-w{stroke:#4caf7d}.pr-line-l{stroke:#ff8181}
  .pr-trace circle{fill:#e6edf3}
  .pr-quarters span{margin-right:10px;color:#9aa4b2;font-size:12px}
  .pr-loglist{margin-top:6px}.pr-log{margin-right:8px;font-size:12px;padding:2px 6px;border-radius:4px;background:#1a2230}
  .pr-ticker{background:#131a26;border:1px solid #2a3342;border-radius:6px;padding:6px 10px;font-size:12px;color:#9aa4b2;margin-bottom:10px}
  .pr-cva{font-size:12px;padding:2px 8px;border-radius:10px;background:#1a2230}
  .pr-seriesend{font-size:20px;font-weight:700;margin:8px 0}
  .pr-bracket{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .pr-bracket-col h3{font-size:13px;color:#9aa4b2}
  .pr-bracket-cell{background:#161d29;border:1px solid #2a3342;border-radius:6px;padding:6px 8px;font-size:12px;margin-bottom:8px}
  .pr-bracket-cell.pr-user{border-color:#4caf7d}
  @media(max-width:700px){.pr-bracket{grid-template-columns:repeat(2,1fr)}}`;
  const tag = document.createElement('style');
  tag.id = 'prCSS';
  tag.textContent = css;
  document.head.appendChild(tag);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderGameSetup, renderGameplan, renderGameResult, renderBracketCols, renderRunSummary, GAME_UI };
}
