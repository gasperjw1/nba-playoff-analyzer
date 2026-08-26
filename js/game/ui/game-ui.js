// ============================================================
// PLAYOFF RUN — UI (Phase 3 + coaching-depth iteration)
// ============================================================
// The game section, rendered into #main via the sport switcher (baseball
// precedent). Existing dashboard idiom: string-building renderers + small
// global onclick handlers; game-scoped CSS injected once (styles.css is
// an analyzer file and stays untouched).
//
// Screens: Setup (equity-honest team select) → Gameplan (minutes budget,
// STARTERS, per-player role assignments, stopper assignment, coverage,
// live starting-five synergy) → Result (quarter margin trace, box scores,
// CVA chip, COACH'S REPORT — true attribution, never flavor text) →
// Bracket → Summary.
//
// PLAN PERSISTENCE: the user's rotation/starters/roles/stopper carry
// across games AND series (user feedback: resets are hostile). Each plan
// screen RECONCILES the standing plan with tonight's availability instead
// of rebuilding it. Prefs persist to localStorage beside the run save.
//
// Design law #2 everywhere: the user sees samples and observed evidence,
// never the sim's expected values or hidden shifts.
// ============================================================

const GAME_UI = {
  run: null, session: null,
  view: 'setup',            // 'setup' | 'plan' | 'live' | 'result' | 'bracket' | 'summary'
  liveGs: null,             // open game session while view === 'live'
  lastGame: null,
  planMinutes: {},          // name -> minutes (persists across games/series)
  planStarters: [],         // exactly 5 names to play
  planRoles: {},            // name -> {offRole, defRole} overrides (native default)
  planStopper: '',          // your defender on their initiator ('' = coach default)
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
function gameUserTeamObj() {
  const s = GAME_UI.session;
  return s.sctx.home.abbr === GAME_UI.run.userTeam ? s.sctx.home : s.sctx.away;
}
function gameOppTeamObj() {
  const s = GAME_UI.session;
  return s.sctx.home.abbr === GAME_UI.run.userTeam ? s.sctx.away : s.sctx.home;
}
function gameSaveNow() {
  try {
    localStorage.setItem(GAME_SAVE_KEY, serializeRun(GAME_UI.run, GAME_UI.session));
    localStorage.setItem(GAME_SAVE_KEY + '_ui', JSON.stringify({
      planMinutes: GAME_UI.planMinutes, planStarters: GAME_UI.planStarters,
      planRoles: GAME_UI.planRoles, planStopper: GAME_UI.planStopper,
    }));
  } catch (_) {}
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
      try {
        const prefs = JSON.parse(localStorage.getItem(GAME_SAVE_KEY + '_ui') || '{}');
        GAME_UI.planMinutes = prefs.planMinutes || {};
        GAME_UI.planStarters = prefs.planStarters || [];
        GAME_UI.planRoles = prefs.planRoles || {};
        GAME_UI.planStopper = prefs.planStopper || '';
      } catch (_) {}
      if (restored.session) {
        gameReconcilePlan();
        GAME_UI.view = 'plan';
      } else { gameAdvance(); return; }
    } catch (_) { GAME_UI.run = null; GAME_UI.session = null; GAME_UI.view = 'setup'; }
  }
  gameRender(el);
}

function gameRender(el) {
  el = el || document.getElementById('main');
  const v = GAME_UI.view;
  if (v === 'setup') el.innerHTML = renderGameSetup();
  else if (v === 'plan') el.innerHTML = renderGameplan();
  else if (v === 'live') el.innerHTML = renderLiveGame();
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
  GAME_UI.planMinutes = {}; GAME_UI.planStarters = [];
  GAME_UI.planRoles = {}; GAME_UI.planStopper = '';
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
      gameReconcilePlan();
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

/**
 * Reconcile the STANDING plan with tonight's availability — never rebuild
 * it from scratch (the user's allocations are theirs). Only first-ever
 * plan of a run initializes from the coach defaults.
 */
function gameReconcilePlan() {
  const run = GAME_UI.run, session = GAME_UI.session;
  const team = gameUserTeamObj();
  const gs = getUpcomingGameState(run, session, run.userTeam);
  const out = new Set(gs.unavailable);
  const available = team.players.filter(p =>
    p.initialStatus !== 'dnp' && p.baseRating > 0 && !out.has(p.name));
  const availNames = new Set(available.map(p => p.name));

  if (!Object.keys(GAME_UI.planMinutes).length) {
    const rot = gameDefaultRotation(available, team.coach.rotationDepth);
    rot.forEach(r => { GAME_UI.planMinutes[r.player.name] = Math.round(r.minutes); });
    const total = Object.values(GAME_UI.planMinutes).reduce((a, b) => a + b, 0);
    if (total !== 240 && rot.length) {
      const top = rot.reduce((a, b) => (b.minutes > a.minutes ? b : a)).player.name;
      GAME_UI.planMinutes[top] = Math.max(0, Math.min(42, GAME_UI.planMinutes[top] + (240 - total)));
    }
  } else {
    Object.keys(GAME_UI.planMinutes).forEach(n => {
      if (!availNames.has(n)) GAME_UI.planMinutes[n] = 0;
    });
  }
  // Starters: drop unavailable, backfill to 5 from highest-minute non-starters.
  GAME_UI.planStarters = (GAME_UI.planStarters || []).filter(n => availNames.has(n));
  if (GAME_UI.planStarters.length < 5) {
    Object.entries(GAME_UI.planMinutes)
      .filter(([n, m]) => availNames.has(n) && m > 0 && !GAME_UI.planStarters.includes(n))
      .sort((a, b) => b[1] - a[1])
      .forEach(([n]) => { if (GAME_UI.planStarters.length < 5) GAME_UI.planStarters.push(n); });
  }
  if (GAME_UI.planStopper && !availNames.has(GAME_UI.planStopper)) GAME_UI.planStopper = '';
  if (GAME_UI.planDouble) {
    const opp = gameOppTeamObj();
    if (!opp.players.some(p => p.name === GAME_UI.planDouble)) GAME_UI.planDouble = '';
  }
}

// ── Screen: gameplan ────────────────────────────────────────────
function renderGameplan() {
  const run = GAME_UI.run, session = GAME_UI.session;
  const sctx = session.sctx;
  const userIsHome = sctx.home.abbr === run.userTeam;
  const team = gameUserTeamObj(), opp = gameOppTeamObj();
  const g = session.games.length + 1;
  const gs = getUpcomingGameState(run, session, run.userTeam);
  const out = new Set(gs.unavailable);
  const atHome = gameVenueIsHome(g) === userIsHome;
  const myWins = userIsHome ? session.score.home : session.score.away;
  const oppWins = userIsHome ? session.score.away : session.score.home;

  // Marquee assignments both ways — derived from TONIGHT'S availability
  // (a returning star out this game can't be the target), stopper overridable.
  const oppGs = getUpcomingGameState(run, session, opp.abbr);
  const oppOut = new Set(oppGs.unavailable);
  const oppAvail = opp.players.filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0 && !oppOut.has(p.name));
  const oppRotation = gameDefaultRotation(oppAvail, opp.coach.rotationDepth);
  const myAvail = team.players.filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0 && !out.has(p.name));
  const myRotation = myAvail.map(p => ({ player: p, minutes: GAME_UI.planMinutes[p.name] || 0 }));
  const myCoverage = gameDeriveAssignment(team, opp, oppRotation, myRotation)
    || (userIsHome ? sctx.defAssignments.homeOnAway : sctx.defAssignments.awayOnHome);
  const theirCoverage = gameDeriveAssignment(opp, team, myRotation, oppRotation)
    || (userIsHome ? sctx.defAssignments.awayOnHome : sctx.defAssignments.homeOnAway);

  const offRoles = Object.keys(GAME_OFF_ROLE_FAMILY);
  const defRoles = Object.keys(GAME_DEF_ROLE_FAMILY);
  const roleSel = (p, kind, options) => {
    const assigned = (GAME_UI.planRoles[p.name] || {})[kind] || p[kind] || '';
    const native = p[kind] || '';
    const fit = kind === 'offRole'
      ? gameRoleFitCost(native, assigned, GAME_OFF_ROLE_FAMILY)
      : gameRoleFitCost(native, assigned, GAME_DEF_ROLE_FAMILY);
    const cls = fit === 0 ? '' : fit <= 0.15 ? 'pr-fit-mild' : fit <= 0.35 ? 'pr-fit-warn' : 'pr-fit-bad';
    return `<select class="pr-role ${cls}" data-player="${gameEsc(p.name)}" data-kind="${kind}"
      onchange="gameSetRole(this)" title="native: ${gameEsc(native)}">
      ${options.map(r => `<option ${r === assigned ? 'selected' : ''}>${gameEsc(r)}</option>`).join('')}
    </select>`;
  };

  const rows = team.players
    .filter(p => p.baseRating > 0 && p.initialStatus !== 'dnp')
    .sort((a, b) => b.baseRating - a.baseRating)
    .map(p => {
      const isOut = out.has(p.name);
      const drag = gs.drags && gs.drags[p.name];
      const fat = gs.fatigue[p.name] || 0;
      const seriesAvg = gameSeriesAvg(session, userIsHome ? 'home' : 'away', p.name);
      const badge = isOut ? '<span class="pr-badge pr-out">OUT</span>'
        : drag ? `<span class="pr-badge pr-drag" title="Playing hurt: performance drag, and minutes played risk AGGRAVATING the injury (a few % per heavy game). Resting him still runs the recovery clock.">HURT</span>` : '';
      const desig = ({ guard: 'G', 'guard-wing': 'GW', wing: 'W', big: 'B', flex: 'F' })[p.designation] || '?';
      const desigChip = `<span class="pr-desig" title="Designation: ${gameEsc(p.designation)} — derived from his actual profile (stats + roles), not listed position. Guard-wings count half toward each group; flex players count everywhere (that's their value).">${desig}</span>`;
      const fresh = Math.round((1 - fat) * 100);
      const freshCls = fresh >= 85 ? 'pr-ok' : fresh >= 60 ? 'pr-mid' : 'pr-warn';
      const freshCell = `<span class="${freshCls}" title="Freshness: fatigue reduces on-court impact and raises injury risk. Recovers between games; heavy minutes drain it.">${fresh}%</span>`;
      if (isOut) {
        const book = run.teamState[run.userTeam].injuries[p.name];
        const eta = book && book.gamesOut < 90 ? `<span class="pr-dim">~${book.gamesOut} game${book.gamesOut === 1 ? '' : 's'}</span>` : '<span class="pr-dim">—</span>';
        return `<tr class="pr-row-out"><td>${gameEsc(p.name)} ${badge}</td>
          <td class="pr-dim" colspan="2">${gameEsc(p.pos)} · ${gameEsc(p.offRole || '')} · returns ${eta}</td>
          <td>${p.ppg.toFixed(1)}</td><td>—</td><td>—</td><td>—</td><td></td></tr>`;
      }
      return `<tr>
        <td>${desigChip} ${gameEsc(p.name)} ${badge}</td>
        <td>${roleSel(p, 'offRole', offRoles)}</td>
        <td>${roleSel(p, 'defRole', defRoles)}</td>
        <td>${p.ppg.toFixed(1)}</td>
        <td>${seriesAvg == null ? '<span class="pr-dim">—</span>' : seriesAvg.toFixed(1)}</td>
        <td>${freshCell}</td>
        <td><input class="pr-min" type="number" min="0" max="42" data-player="${gameEsc(p.name)}"
             value="${GAME_UI.planMinutes[p.name] || 0}" oninput="gameSetMin(this)"></td>
        <td><input type="checkbox" class="pr-start" data-player="${gameEsc(p.name)}"
             ${GAME_UI.planStarters.includes(p.name) ? 'checked' : ''} onchange="gameToggleStarter(this)"></td>
      </tr>`;
    }).join('');

  const stopperOptions = team.players
    .filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0 && !out.has(p.name))
    .sort((a, b) => b.dLebron - a.dLebron)
    .map(p => `<option value="${gameEsc(p.name)}" ${GAME_UI.planStopper === p.name ? 'selected' : ''}>
      ${gameEsc(p.name)} (${gameEsc(p.defRole || '?')}, dLEBRON ${p.dLebron > 0 ? '+' : ''}${p.dLebron.toFixed(2)})</option>`).join('');
  const oppOptions = opp.players
    .filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0 && p.ppg >= 14)
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
        Opposing coach: ${gameEsc(opp.coach.coach)} (${gameEsc(opp.coach.style || '')})</p>
      ${renderSeriesGameLog()}
    </div>
    <div class="pr-panels pr-panels-wide">
      <div class="pr-panel pr-panel-roster">
        <h3>Rotation — <span id="prTot" class="pr-ok">240</span>/240 min
          <span class="pr-dim">· starters <span id="prStartCt">${GAME_UI.planStarters.length}</span>/5 · cap 42</span></h3>
        <table class="pr-table">
          <tr><th>Player</th><th>Off role</th><th>Def role</th><th>Season</th><th>Series</th><th>Fresh</th><th>Min</th><th>Start</th></tr>
          ${rows}
        </table>
        <p class="pr-dim">Roles default to each player's natural game — reassigning is a real lever with a real
          miscast cost (tinted = out of position). <strong>Fresh</strong> is fatigue: it drains with heavy
          minutes, recovers between games, cuts on-court impact, and raises injury risk. Injured players
          show a return estimate.</p>
      </div>
      <div class="pr-panel">
        <h3>Matchups</h3>
        <p class="pr-dim">Your primary defender on <strong>${gameEsc((myCoverage && myCoverage.target) || '?')}</strong>
          <span class="pr-desig" title="The job this target demands: creators/guards demand Point of Attack, bigs demand an Anchor Big, non-creating wings a Wing Stopper. Your stopper's fit for THIS job scales the suppression.">${gameEsc((myCoverage && myCoverage.job) || '')}</span>:</p>
        <select class="pr-select" onchange="gameSetStopper(this.value); gameUpdatePlanMeta()">${stopperOptions}</select>
        <p id="prScheme" class="pr-dim">${gameSchemeLine(team, opp, myCoverage, myRotation, oppRotation)}</p>
        <p class="pr-dim">They'll likely send <strong>${gameEsc((theirCoverage && theirCoverage.defender) || '?')}</strong>
          at <strong>${gameEsc((theirCoverage && theirCoverage.target) || '?')}</strong>.</p>
        <h3>Coverage</h3>
        <select class="pr-select" onchange="gameSetDouble(this.value)">
          <option value="">Straight coverage (no double)</option>
          ${oppOptions}
        </select>
        <p class="pr-dim">Doubling suppresses the target but frees teammates — pays vs one-initiator offenses
          (${gameEsc(opp.abbr)}: ${opp.initiators}), punished by deep ones.</p>
        <h3>Starting five</h3>
        <p id="prSyn">${gameSynergyLine()}</p>
        <button class="btn btn-primary pr-play" onclick="gamePlayGame()">Play Game ${g}</button>
        <button class="btn btn-secondary" onclick="gameShowBracket()">Bracket</button>
        <p id="prGate" class="pr-dim"></p>
      </div>
    </div>
  </div>`;
}

/**
 * Live scheme-displacement readout: assigning your best point-of-attack
 * defender to a NON-ballhandler vacates the PoA job — the whole scheme
 * pays the drop-off to your next perimeter defender.
 */
function gameSchemeLine(team, opp, derived, myRotation, oppRotation) {
  if (!derived) return '';
  const cov = resolveCoverage(team, { stopper: GAME_UI.planStopper || null }, derived,
    opp, oppRotation, myRotation);
  if (!cov.schemeCost || cov.schemeCost < 0.15) return '';
  return `<span class="pr-warn">⚠ ${gameEsc(cov.defender)} chasing ${gameEsc(cov.target)} vacates your
    point-of-attack coverage — their ballhandler gets your next-best perimeter defender
    (scheme cost ~${cov.schemeCost.toFixed(1)} DRtg).</span>`;
}

function gameSynergyLine() {
  if (GAME_UI.planStarters.length !== 5) return '<span class="pr-warn">Pick exactly 5 starters</span>';
  const team = gameUserTeamObj();
  const syn = gameSynergyMod(team, GAME_UI.planStarters);
  const comp = gameLineupComposition(team, GAME_UI.planStarters);
  const parts = [];
  if (syn.score != null) {
    const sign = syn.mod >= 0 ? '+' : '';
    const cls = syn.mod > 0.05 ? 'pr-ok' : syn.mod < -0.05 ? 'pr-warn' : 'pr-dim';
    parts.push(`SPM chemistry <strong>${syn.score}</strong>
      <span class="${cls}">(${sign}${syn.mod.toFixed(1)} ORtg)</span>`);
  }
  const balanced = !comp.notes.length;
  parts.push(`Shape <strong class="${balanced ? 'pr-ok' : 'pr-warn'}">${comp.label}</strong>` +
    (balanced ? '' : ` <span class="pr-warn">${comp.notes.join('; ')}</span>`));
  return parts.join(' · ');
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

// ── Plan-screen handlers (live meta update, no full re-render) ──
function gameUpdatePlanMeta() {
  const total = Object.values(GAME_UI.planMinutes).reduce((a, b) => a + (+b || 0), 0);
  const okMin = Math.abs(total - 240) < 1;
  const okStart = GAME_UI.planStarters.length === 5;
  const totEl = document.getElementById('prTot');
  if (totEl) { totEl.textContent = total; totEl.className = okMin ? 'pr-ok' : 'pr-warn'; }
  const ctEl = document.getElementById('prStartCt');
  if (ctEl) ctEl.textContent = GAME_UI.planStarters.length;
  const synEl = document.getElementById('prSyn');
  if (synEl) synEl.innerHTML = gameSynergyLine();
  const btn = document.querySelector('.pr-play');
  if (btn) btn.disabled = !(okMin && okStart);
  const gate = document.getElementById('prGate');
  if (gate) gate.textContent = okMin && okStart ? '' :
    (!okMin ? 'Minutes must total exactly 240. ' : '') + (!okStart ? 'Pick exactly 5 starters.' : '');
}
function gameSetMin(input) {
  GAME_UI.planMinutes[input.dataset.player] = Math.max(0, Math.min(42, parseInt(input.value) || 0));
  gameUpdatePlanMeta();
}
function gameToggleStarter(box) {
  const name = box.dataset.player;
  if (box.checked) {
    if (GAME_UI.planStarters.length >= 5) { box.checked = false; return; }
    GAME_UI.planStarters.push(name);
  } else {
    GAME_UI.planStarters = GAME_UI.planStarters.filter(n => n !== name);
  }
  gameUpdatePlanMeta();
}
function gameSetRole(sel) {
  const name = sel.dataset.player, kind = sel.dataset.kind;
  const team = gameUserTeamObj();
  const p = team.players.find(x => x.name === name);
  GAME_UI.planRoles[name] = GAME_UI.planRoles[name] || {};
  GAME_UI.planRoles[name][kind] = sel.value;
  const fit = kind === 'offRole'
    ? gameRoleFitCost(p.offRole, sel.value, GAME_OFF_ROLE_FAMILY)
    : gameRoleFitCost(p.defRole, sel.value, GAME_DEF_ROLE_FAMILY);
  sel.className = 'pr-role ' + (fit === 0 ? '' : fit <= 0.15 ? 'pr-fit-mild' : fit <= 0.35 ? 'pr-fit-warn' : 'pr-fit-bad');
}
function gameSetStopper(v) { GAME_UI.planStopper = v; }
function gameSetDouble(v) { GAME_UI.planDouble = v; }

function gamePlayGame() {
  const run = GAME_UI.run, session = GAME_UI.session;
  const team = gameUserTeamObj();
  const byName = {};
  team.players.forEach(p => { byName[p.name] = p; });
  const rotation = Object.entries(GAME_UI.planMinutes)
    .filter(([n, m]) => byName[n] && m > 0)
    .map(([n, m]) => ({ player: byName[n], minutes: +m }));
  const plan = {
    rotation,
    roleAssignments: GAME_UI.planRoles,
    doubleTarget: GAME_UI.planDouble || null,
    stopper: GAME_UI.planStopper || null,
    starters: GAME_UI.planStarters.length === 5 ? GAME_UI.planStarters.slice() : null,
  };
  // Live game (Phase 3.1): open a steppable session — the game plays
  // segment by segment with your timeout budget and one halftime
  // adjustment. NO save until the game commits (mid-game reloads replay
  // cleanly from the pre-game state).
  GAME_UI.liveGs = openSeriesGame(run, session, plan, true);
  GAME_UI.view = 'live';
  gameRender();
}

// ── Screen: live game ───────────────────────────────────────────
function renderLiveGame() {
  const run = GAME_UI.run, session = GAME_UI.session, gs = GAME_UI.liveGs;
  const sctx = session.sctx;
  const userIsHome = gs.userSide === 'home';
  const opp = gameOppTeamObj();
  const segs = gs.flow.segments;
  const my = segs.reduce((a, x) => a + (userIsHome ? x.home : x.away), 0);
  const their = segs.reduce((a, x) => a + (userIsHome ? x.away : x.home), 0);
  const atHalf = gameSessionAtHalftime(gs);
  const S = GAME_CONFIG.trajectory.segments;
  const label = gs.flow.segIdx >= S ? 'OT' + (gs.flow.segIdx - S + 1)
    : 'Q' + (Math.floor(gs.flow.segIdx / 2) + 1) + (gs.flow.segIdx % 2 ? 'b' : 'a');
  const budget = gs.flow.budgets[gs.userSide] || 0;
  const segRows = segs.map((x, i) => {
    const m = userIsHome ? x.home - x.away : x.away - x.home;
    const tag = i >= S ? 'OT' + (i - S + 1) : 'Q' + (Math.floor(i / 2) + 1) + (i % 2 ? 'b' : 'a');
    return `<span class="pr-log ${m >= 0 ? 'pr-w' : 'pr-l'}">${tag} ${userIsHome ? x.home + '-' + x.away : x.away + '-' + x.home}${x.timeout ? ' ⏱' : ''}</span>`;
  }).join(' ');

  let controls;
  if (atHalf) {
    controls = renderHalftimePanel();
  } else {
    controls = `
      <button class="btn btn-primary" onclick="gameLiveStep()">▶ Play next 6 min</button>
      <button class="btn btn-secondary" onclick="gameLiveTimeout()" ${budget > 0 && !gs.flow.timeoutPending[gs.userSide] ? '' : 'disabled'}>
        ⏱ Timeout (${budget} left)</button>
      <button class="btn btn-secondary" onclick="gameLiveSimRest()">⏩ Sim to final</button>
      ${gs.flow.timeoutPending[gs.userSide] ? '<p class="pr-ok">Timeout called — it blunts a run against you in the next stretch.</p>' : ''}
      <p class="pr-dim">Timeouts damp the momentum running against you for the next stretch
        (and damp YOUR run if you call one while rolling). At halftime you get one adjustment.</p>`;
  }

  return `
  <div class="pr-wrap">
    <div class="pr-header">
      <h2>LIVE · ${gameEsc(session.round)} G${gs.gameNum}: you ${my} — ${their} ${gameEsc(opp.abbr)}
        <span class="pr-dim">${atHalf ? '· HALFTIME' : segs.length ? '· next: ' + label : '· tip-off'}</span></h2>
      ${renderMarginTrace({ segments: segs, quarters: [] }, userIsHome, true)}
      <div class="pr-loglist">${segRows}</div>
    </div>
    <div class="pr-panel">${controls}</div>
  </div>`;
}

function renderHalftimePanel() {
  const gs = GAME_UI.liveGs;
  const team = gameUserTeamObj(), opp = gameOppTeamObj();
  const plan = gs.userSide === 'home' ? gs.homePlan : gs.awayPlan;
  const stopperOptions = team.players
    .filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0 && !(plan.unavailable || []).includes(p.name))
    .sort((a, b) => b.dLebron - a.dLebron)
    .map(p => `<option value="${gameEsc(p.name)}" ${(GAME_UI.planStopper || '') === p.name ? 'selected' : ''}>
      ${gameEsc(p.name)} (${gameEsc(p.defRole || '?')})</option>`).join('');
  const oppOptions = opp.players
    .filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0 && p.ppg >= 14)
    .sort((a, b) => b.ppg - a.ppg)
    .map(p => `<option value="${gameEsc(p.name)}" ${GAME_UI.planDouble === p.name ? 'selected' : ''}>
      Double ${gameEsc(p.name)}</option>`).join('');
  const rows = (plan.rotation || []).filter(r => r.minutes > 0)
    .map(r => `<tr><td>${gameEsc(r.player.name)}</td>
      <td><input class="pr-min" type="number" min="0" max="21" data-player="${gameEsc(r.player.name)}"
        value="${Math.round(r.minutes / 2)}" oninput="gameHalfMeta()"></td></tr>`).join('');
  return `
    <h3>Halftime adjustment <span class="pr-dim">(one shot — coverage and second-half minutes)</span></h3>
    <div class="pr-panels">
      <div>
        <table class="pr-table"><tr><th>Player</th><th>H2 min</th></tr>${rows}</table>
        <p class="pr-dim">Second-half budget: <span id="prH2Tot" class="pr-ok">120</span>/120</p>
      </div>
      <div>
        <p class="pr-dim">Stopper:</p>
        <select id="prH2Stopper" class="pr-select">${stopperOptions}</select>
        <p class="pr-dim">Coverage:</p>
        <select id="prH2Double" class="pr-select">
          <option value="">Straight coverage</option>${oppOptions}</select>
        <button class="btn btn-primary" onclick="gameLiveHalftime(true)" id="prH2Apply">Apply & play on</button>
        <button class="btn btn-secondary" onclick="gameLiveHalftime(false)">No changes — play on</button>
      </div>
    </div>`;
}

function gameHalfMeta() {
  let tot = 0;
  document.querySelectorAll('#main .pr-min').forEach(i => { tot += Math.max(0, parseInt(i.value) || 0); });
  const el = document.getElementById('prH2Tot');
  if (el) { el.textContent = tot; el.className = tot === 120 ? 'pr-ok' : 'pr-warn'; }
  const btn = document.getElementById('prH2Apply');
  if (btn) btn.disabled = tot !== 120;
}

function gameLiveHalftime(apply) {
  const gs = GAME_UI.liveGs;
  let revision = null;
  if (apply) {
    const team = gameUserTeamObj();
    const byName = {};
    team.players.forEach(p => { byName[p.name] = p; });
    const rotation = [];
    document.querySelectorAll('#main .pr-min').forEach(i => {
      const m = Math.max(0, parseInt(i.value) || 0);
      if (m > 0 && byName[i.dataset.player]) {
        // H2 minutes ×2 → full-game-normalized rotation (capacity halves it)
        rotation.push({ player: byName[i.dataset.player], minutes: m * 2 });
      }
    });
    const stopper = document.getElementById('prH2Stopper');
    const dbl = document.getElementById('prH2Double');
    revision = {
      rotation: rotation.length ? rotation : undefined,
      stopper: stopper ? stopper.value : null,
      doubleTarget: dbl && dbl.value ? dbl.value : null,
    };
  }
  gameSessionHalftime(gs, revision);
  gameRender();
}

function gameLiveStep() {
  const gs = GAME_UI.liveGs;
  gameSessionStep(gs);
  if (gs.flow.done) return gameLiveFinish();
  gameRender();
}
function gameLiveTimeout() {
  if (gameSessionTimeout(GAME_UI.liveGs)) gameRender();
}
function gameLiveSimRest() {
  const gs = GAME_UI.liveGs;
  while (!gs.flow.done) gameSessionStep(gs);
  gameLiveFinish();
}
function gameLiveFinish() {
  const run = GAME_UI.run, session = GAME_UI.session;
  GAME_UI.lastGame = commitSeriesGame(run, session, GAME_UI.liveGs);
  GAME_UI.liveGs = null;
  gameSaveNow();
  GAME_UI.view = 'result';
  gameRender();
}

// ── Screen: game result + coach's report ────────────────────────
function renderGameResult() {
  const run = GAME_UI.run, session = GAME_UI.session, gm = GAME_UI.lastGame;
  const abbr = run.userTeam;
  const sctx = session.sctx;
  const userIsHome = sctx.home.abbr === abbr;
  const won = gm.winner === abbr;
  const my = userIsHome ? gm.homeScore : gm.awayScore;
  const their = userIsHome ? gm.awayScore : gm.homeScore;
  const opp = gameOppTeamObj();
  const myWins = userIsHome ? session.score.home : session.score.away;
  const oppWins = userIsHome ? session.score.away : session.score.home;

  const cvaChip = gm.cva
    ? `<span class="pr-cva ${gm.cva.delta >= 0 ? 'pr-w' : 'pr-l'}"
         title="Your plan vs your assistant's, in expected margin — graded on the decision, not the dice">
         Coaching: ${gm.cva.delta >= 0 ? '+' : ''}${gm.cva.delta.toFixed(1)} exp pts vs assistant</span>`
    : '';
  const halfChip = gm.cvaHalf
    ? `<span class="pr-cva ${gm.cvaHalf.delta >= 0 ? 'pr-w' : 'pr-l'}"
         title="Your halftime adjustment vs standing pat, in expected second-half margin">
         Halftime: ${gm.cvaHalf.delta >= 0 ? '+' : ''}${gm.cvaHalf.delta.toFixed(1)} exp pts</span>`
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
      <p>Series: you ${myWins} — ${oppWins} · ${cvaChip} ${halfChip}</p>
    </div>
    <div class="pr-panels">
      <div class="pr-panel">
        <h3>Game flow <span class="pr-dim">(your margin by quarter)</span></h3>
        ${renderMarginTrace(gm, userIsHome)}
        <div class="pr-quarters">${gm.quarters.map((q, i) =>
          `<span>${i >= 4 ? 'OT' + (i - 3) : 'Q' + (i + 1)}: ${userIsHome ? q.home + '-' + q.away : q.away + '-' + q.home}</span>`).join(' ')}</div>
        ${renderCoachReport(gm, userIsHome)}
      </div>
      <div class="pr-panel">${renderBoxTable(gm, userIsHome ? 'home' : 'away', 'Your box score')}</div>
      <div class="pr-panel">${renderBoxTable(gm, userIsHome ? 'away' : 'home', gameEsc(opp.abbr) + ' box score')}</div>
    </div>
    <div class="pr-actions">${next}</div>
  </div>`;
}

/**
 * Coach's report: true attribution from the sim's own record — coverage
 * outcomes, doubles, synergy, overloads, and honest small-sample notes.
 */
function renderCoachReport(gm, userIsHome) {
  if (!gm.report) return '';
  const mySide = userIsHome ? 'home' : 'away';
  const oppSide = userIsHome ? 'away' : 'home';
  const mine = gm.report[mySide], theirs = gm.report[oppSide];
  const team = gameUserTeamObj();
  const lines = [];

  const covLine = (cov, who) => {
    if (!cov || !cov.target || cov.targetPts == null || !cov.targetSeason) return null;
    const ratio = cov.targetPts / cov.targetSeason;
    const verdict = ratio <= 0.8 ? ['held', 'pr-w'] : ratio >= 1.2 ? ['torched for', 'pr-l'] : ['allowed', 'pr-dim'];
    const scheme = cov.schemeCost >= 0.2
      ? ` <span class="pr-warn">(scheme stretched −${cov.schemeCost.toFixed(1)} DRtg — the point of attack fell to a lesser defender)</span>` : '';
    return `<li>${who} <strong>${gameEsc(cov.defender || '?')}</strong> on <strong>${gameEsc(cov.target)}</strong>
      <span class="pr-dim">(${gameEsc(cov.job || '')})</span>:
      <span class="${verdict[1]}">${verdict[0]} ${cov.targetPts}</span> (season ${cov.targetSeason.toFixed(1)})${scheme}</li>`;
  };
  const l1 = covLine(mine.coverage, 'Your stopper');
  if (l1) lines.push(l1);
  const l2 = covLine(theirs.coverage, 'Their stopper');
  if (l2) lines.push(l2);

  if (mine.double && mine.double.pts != null && mine.double.season) {
    const r = mine.double.pts / mine.double.season;
    lines.push(`<li>Your double on <strong>${gameEsc(mine.double.target)}</strong>:
      <span class="${r <= 0.85 ? 'pr-w' : 'pr-l'}">${mine.double.pts} pts</span> (season ${mine.double.season.toFixed(1)})
      — watch whether their other scorers ate.</li>`);
  }
  if (mine.synergy && mine.synergy.score != null) {
    const s = mine.synergy;
    lines.push(`<li>Starting five chemistry <strong>${s.score}</strong>
      (${s.mod >= 0 ? '+' : ''}${s.mod.toFixed(1)} ORtg vs your usual five).</li>`);
  }
  if (mine.composition && theirs.composition) {
    const mc = mine.composition, tc = theirs.composition;
    if (mc.notes.length) {
      lines.push(`<li>Your <strong>${mc.label}</strong> shape: <span class="pr-warn">${mc.notes.join('; ')}</span></li>`);
    }
    if (tc.notes.length) {
      lines.push(`<li>They went <strong>${tc.label}</strong> — ${tc.notes.join('; ')}. A sharp
        counter attacks the weakness.</li>`);
    } else if (mc.notes.length === 0) {
      lines.push(`<li class="pr-dim">Shapes: you ${mc.label}, them ${tc.label} — both balanced.</li>`);
    }
  }
  const overloads = gm.box[mySide].filter(r => r.min >= 38 - (gm.ot ? 0 : 0) && r.min >= 38).map(r => r.name);
  if (overloads.length) {
    lines.push(`<li class="pr-dim">Heavy minutes: ${overloads.map(gameEsc).join(', ')} —
      overload costs efficiency late and raises injury risk.</li>`);
  }
  const swings = gm.box[mySide]
    .map(r => ({ r, p: team.players.find(x => x.name === r.name) }))
    .filter(x => x.p && x.p.ppg >= 8 && x.r.min >= 15)
    .map(x => ({ ...x, ratio: x.r.pts / x.p.ppg }))
    .filter(x => x.ratio >= 1.35 || x.ratio <= 0.6);
  swings.forEach(x => {
    lines.push(`<li>${gameEsc(x.r.name)}: <span class="${x.ratio > 1 ? 'pr-w' : 'pr-l'}">${x.r.pts} pts</span>
      vs ${x.p.ppg.toFixed(1)} season — <span class="pr-dim">one game; cold nights are ~2x more predictive
      than hot ones</span>.</li>`);
  });

  if (!lines.length) return '';
  return `<h3>Coach's report</h3><ul class="pr-report">${lines.join('')}</ul>`;
}

function renderMarginTrace(gm, userIsHome, live) {
  const steps = (gm.segments && gm.segments.length) ? gm.segments : gm.quarters;
  const S = GAME_CONFIG.trajectory.segments;
  let m = 0;
  const pts = [[0, 0]];
  const marks = [];
  steps.forEach((q, i) => {
    m += userIsHome ? q.home - q.away : q.away - q.home;
    pts.push([i + 1, m]);
    if (q.timeout) marks.push(i + 1);
  });
  const span = live ? Math.max(S, steps.length) : Math.max(1, steps.length);
  const maxAbs = Math.max(10, ...pts.map(p => Math.abs(p[1])));
  const W = 320, H = 120;
  const x = i => 10 + i * (W - 20) / span;
  const y = v => H / 2 - v * (H / 2 - 12) / maxAbs;
  const line = pts.map((p, i) => (i ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1)).join(' ');
  const final = pts[pts.length - 1][1];
  const halfX = x(S / 2).toFixed(1);
  return `<svg viewBox="0 0 ${W} ${H}" class="pr-trace">
    <line x1="10" y1="${H / 2}" x2="${W - 10}" y2="${H / 2}" class="pr-zero"/>
    ${steps === gm.segments ? `<line x1="${halfX}" y1="8" x2="${halfX}" y2="${H - 8}" class="pr-halfline"/>` : ''}
    <path d="${line}" class="${final >= 0 ? 'pr-line-w' : 'pr-line-l'}"/>
    ${pts.slice(1).map(p => `<circle cx="${x(p[0]).toFixed(1)}" cy="${y(p[1]).toFixed(1)}" r="2.5"/>`).join('')}
    ${marks.map(i => `<text x="${x(i)}" y="12" class="pr-tomark">⏱</text>`).join('')}
  </svg>`;
}

function renderBoxTable(gm, side, title) {
  const starters = new Set((gm.report && gm.report[side] && gm.report[side].starters) || []);
  const rows = gm.box[side].slice().sort((a, b) => b.pts - a.pts).map(r =>
    `<tr><td>${starters.has(r.name) ? '⭐ ' : ''}${gameEsc(r.name)}</td><td>${r.min}</td><td><strong>${r.pts}</strong></td><td>${r.reb}</td><td>${r.ast}</td><td>${r.stl != null ? r.stl : '—'}</td><td>${r.blk != null ? r.blk : '—'}</td><td>${r.to != null ? r.to : '—'}</td></tr>`).join('');
  return `<h3>${title}</h3>
    <table class="pr-table pr-box"><tr><th>Player</th><th>Min</th><th>Pts</th><th>Reb</th><th>Ast</th><th>Stl</th><th>Blk</th><th>TO</th></tr>${rows}</table>`;
}

function gameNextGame() {
  gameReconcilePlan();   // carry the standing plan; only availability changes
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
  try {
    localStorage.removeItem(GAME_SAVE_KEY);
    localStorage.removeItem(GAME_SAVE_KEY + '_ui');
  } catch (_) {}
  GAME_UI.run = null; GAME_UI.session = null; GAME_UI.lastGame = null;
  GAME_UI.eliminated = false; GAME_UI.view = 'setup';
  GAME_UI.planMinutes = {}; GAME_UI.planStarters = [];
  GAME_UI.planRoles = {}; GAME_UI.planStopper = ''; GAME_UI.planDouble = '';
  gameRender();
}

// ── Game-scoped CSS (injected once; styles.css untouched) ───────
function gameInjectCSS() {
  if (document.getElementById('prCSS')) return;
  const css = `
  .pr-wrap{max-width:1180px;margin:0 auto;padding:12px}
  .pr-header h2{margin:4px 0}.pr-header p{color:var(--text-dim,#9aa4b2)}
  .pr-seed-row{margin:8px 0;color:var(--text-dim,#9aa4b2)}
  .pr-seed-row input{width:110px;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:4px 6px}
  .pr-team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-top:12px}
  .pr-team-card{background:#161d29;border:1px solid #2a3342;border-radius:8px;padding:10px 12px;cursor:pointer}
  .pr-team-card:hover{background:#1d2635}
  .pr-team-name{font-weight:600}.pr-team-meta{font-size:12px;color:#9aa4b2;margin:2px 0}
  .pr-team-equity{font-size:13px}
  .pr-panels{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin-top:12px}
  .pr-panels-wide{grid-template-columns:minmax(560px,2fr) minmax(280px,1fr)}
  .pr-panel{background:#161d29;border:1px solid #2a3342;border-radius:8px;padding:12px}
  .pr-table{width:100%;border-collapse:collapse;font-size:13px}
  .pr-table th{text-align:left;color:#9aa4b2;font-weight:500;padding:3px 6px;border-bottom:1px solid #2a3342}
  .pr-table td{padding:3px 6px;border-bottom:1px solid #1d2635}
  .pr-min{width:52px;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:2px 4px}
  .pr-select{width:100%;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:6px;margin-bottom:8px}
  .pr-role{max-width:130px;background:#1a2230;color:#e6edf3;border:1px solid #30363d;border-radius:4px;padding:1px 2px;font-size:11px}
  .pr-fit-mild{border-color:#8a7a30}.pr-fit-warn{border-color:#b07a20;color:#ffc861}.pr-fit-bad{border-color:#a03030;color:#ff8181}
  .pr-start{accent-color:#4caf7d;width:15px;height:15px}
  .pr-badge{font-size:10px;border-radius:3px;padding:1px 4px;margin-left:4px}
  .pr-desig{display:inline-block;min-width:20px;text-align:center;font-size:10px;font-weight:600;border-radius:3px;padding:1px 3px;background:#232d3f;color:#9fb6d8;margin-right:2px}
  .pr-out{background:#5c1a1a;color:#ff8181}.pr-drag{background:#5c451a;color:#ffc861}.pr-tired{background:#3a3a1a;color:#e0d060}
  .pr-row-out td{opacity:.45}
  .pr-ok{color:#4caf7d}.pr-warn{color:#ff8181}.pr-mid{color:#e0d060}
  .pr-w{color:#4caf7d}.pr-l{color:#ff8181}.pr-dim{color:#9aa4b2;font-size:12px}
  .pr-play{margin:8px 6px 0 0}
  .pr-actions{margin:14px 0}
  .pr-trace{width:100%;max-width:420px;background:#10161f;border-radius:6px}
  .pr-trace .pr-zero{stroke:#2a3342;stroke-width:1}
  .pr-trace path{fill:none;stroke-width:2.5}.pr-line-w{stroke:#4caf7d}.pr-line-l{stroke:#ff8181}
  .pr-trace circle{fill:#e6edf3}
  .pr-trace .pr-halfline{stroke:#3a4658;stroke-width:1;stroke-dasharray:3 3}
  .pr-trace .pr-tomark{font-size:9px;fill:#ffc861}
  .pr-quarters span{margin-right:10px;color:#9aa4b2;font-size:12px}
  .pr-report{margin:6px 0 0 16px;padding:0;font-size:13px}
  .pr-report li{margin-bottom:5px}
  .pr-loglist{margin-top:6px}.pr-log{margin-right:8px;font-size:12px;padding:2px 6px;border-radius:4px;background:#1a2230}
  .pr-ticker{background:#131a26;border:1px solid #2a3342;border-radius:6px;padding:6px 10px;font-size:12px;color:#9aa4b2;margin-bottom:10px}
  .pr-cva{font-size:12px;padding:2px 8px;border-radius:10px;background:#1a2230}
  .pr-seriesend{font-size:20px;font-weight:700;margin:8px 0}
  .pr-bracket{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .pr-bracket-col h3{font-size:13px;color:#9aa4b2}
  .pr-bracket-cell{background:#161d29;border:1px solid #2a3342;border-radius:6px;padding:6px 8px;font-size:12px;margin-bottom:8px}
  .pr-bracket-cell.pr-user{border-color:#4caf7d}
  @media(max-width:900px){.pr-panels-wide{grid-template-columns:1fr}}
  @media(max-width:700px){.pr-bracket{grid-template-columns:repeat(2,1fr)}}`;
  const tag = document.createElement('style');
  tag.id = 'prCSS';
  tag.textContent = css;
  document.head.appendChild(tag);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderGameSetup, renderGameplan, renderGameResult, renderCoachReport,
    renderBracketCols, renderRunSummary, gameReconcilePlan, GAME_UI,
  };
}
