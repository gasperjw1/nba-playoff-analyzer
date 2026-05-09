// ============================================================
// NAVIGATION & TAB MANAGEMENT (Phase 42 — Multi-Round)
// ============================================================
// Navigation hierarchy: Playoff Round → Conference → Series → Game Tab
// Round values: 'R1', 'R2', 'CF', 'Finals'
// Conference values: 'West', 'East' (hidden for Finals since it's one series)
// ============================================================

// --- Round metadata ---
const ROUND_META = {
  R1:     { label: 'Round 1', seriesCount: 8, short: 'R1' },
  R2:     { label: 'Round 2', seriesCount: 4, short: 'R2' },
  CF:     { label: 'Conf Finals', seriesCount: 2, short: 'CF' },
  Finals: { label: 'Finals', seriesCount: 1, short: 'FIN' }
};

/**
 * Get all playoff rounds that have at least one series in SERIES_DATA.
 * @returns {string[]} Array of round keys, e.g. ['R1', 'R2']
 */
function getActiveRounds() {
  const rounds = new Set(SERIES_DATA.map(s => s.round || 'R1'));
  return ['R1', 'R2', 'CF', 'Finals'].filter(r => rounds.has(r));
}

/**
 * Get series filtered by round and conference.
 * For Finals, conference filter is ignored.
 * @returns {Array<{s: object, i: number}>} Filtered series with original indices
 */
function getFilteredSeries(round, conf) {
  return SERIES_DATA.map((s, i) => ({ s, i })).filter(x => {
    const seriesRound = x.s.round || 'R1';
    if (seriesRound !== round) return false;
    if (round === 'Finals') return true; // Finals has no conference split
    return x.s.conf === conf;
  });
}

/**
 * Get total series count for a given round.
 */
function getSeriesCountForRound(round) {
  return SERIES_DATA.filter(s => (s.round || 'R1') === round).length;
}

function renderTabs() {
  const activeRounds = getActiveRounds();

  // --- Playoff round tabs (only show if more than one round has data) ---
  let roundTabsHtml = '';
  if (activeRounds.length > 1) {
    roundTabsHtml = `<div class="playoff-round-tabs">${activeRounds.map(r => {
      const meta = ROUND_META[r];
      const count = getSeriesCountForRound(r);
      const isActive = r === currentPlayoffRound;
      return `<div class="playoff-round-tab ${isActive ? 'active' : ''}" onclick="switchPlayoffRound('${r}')">
        <span class="playoff-round-label">${meta.label}</span>
        <span class="playoff-round-count">${count} series</span>
      </div>`;
    }).join('')}</div>`;
  }

  // --- Conference tabs (hide for Finals) ---
  let confHtml = '';
  if (currentPlayoffRound !== 'Finals') {
    confHtml = ['West', 'East'].map(r =>
      `<div class="round-tab ${r === currentConf ? 'active' : ''}" onclick="switchConf('${r}')">${r}ern Conference</div>`
    ).join('');
  }

  // --- Series sub-tabs for current round + conference ---
  const filteredSeries = getFilteredSeries(currentPlayoffRound, currentConf);
  const seriesHtml = filteredSeries.map(x =>
    `<div class="series-tab ${x.i === currentSeriesIdx ? 'active' : ''}" onclick="switchSeries(${x.i})"><span class="series-tab-seed">#${x.s.homeTeam.seed}v#${x.s.awayTeam.seed}</span> ${x.s.homeTeam.abbr} vs ${x.s.awayTeam.abbr}</div>`
  ).join('');

  document.getElementById('tabs').innerHTML =
    `${roundTabsHtml}<div class="round-tabs">${confHtml}</div><div class="series-tabs">${seriesHtml}</div>`;
}

/**
 * Switch the active playoff round (R1, R2, CF, Finals).
 */
function switchPlayoffRound(round) {
  currentPlayoffRound = round;
  // For Finals, conference doesn't matter
  if (round === 'Finals') {
    const first = SERIES_DATA.findIndex(s => (s.round || 'R1') === round);
    if (first >= 0) currentSeriesIdx = first;
  } else {
    // Jump to first series in this round + current conference
    const filtered = getFilteredSeries(round, currentConf);
    if (filtered.length > 0) {
      currentSeriesIdx = filtered[0].i;
    } else {
      // No series in this conf for this round — try the other conference
      const otherConf = currentConf === 'West' ? 'East' : 'West';
      const otherFiltered = getFilteredSeries(round, otherConf);
      if (otherFiltered.length > 0) {
        currentConf = otherConf;
        currentSeriesIdx = otherFiltered[0].i;
      }
    }
  }
  currentGameTab = 'overview';
  renderTabs();
  renderSeries();
  // Update bets page nav label
  updateBetsNavLabel();
}

/**
 * Switch the active conference (West/East). Renamed from switchRound.
 */
function switchConf(conf) {
  currentConf = conf;
  const filtered = getFilteredSeries(currentPlayoffRound, conf);
  if (filtered.length > 0) {
    currentSeriesIdx = filtered[0].i;
  }
  currentGameTab = 'overview';
  renderTabs();
  renderSeries();
}

// Keep backward-compatible alias
function switchRound(r) { switchConf(r); }

function switchSeries(i) {
  currentSeriesIdx = i;
  const s = SERIES_DATA[i];
  currentConf = s.conf;
  currentPlayoffRound = s.round || 'R1';
  currentGameTab = 'overview';
  renderTabs();
  renderSeries();
}

function switchGameTab(tab) {
  currentGameTab = tab;
  currentRosterTeam = 'home';
  renderSeries();
}

function switchBetTab(tab) {
  // Dynamically find all bet content/tab elements instead of hardcoded list
  document.querySelectorAll('[id^="betContent-"]').forEach(el => el.style.display = 'none');
  document.querySelectorAll('[id^="betTab-"]').forEach(el => {
    el.style.background = 'var(--card)';
    el.style.color = 'var(--text-dim)';
    el.style.borderColor = 'var(--border)';
  });
  const content = document.getElementById('betContent-' + tab);
  const tabEl = document.getElementById('betTab-' + tab);
  if (content) content.style.display = 'block';
  if (tabEl) {
    tabEl.style.background = 'var(--accent)';
    tabEl.style.color = '#fff';
    tabEl.style.borderColor = 'var(--accent)';
  }
}

function switchDefTab(tab) {
  document.querySelectorAll('.def-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.def-tab-btn').forEach(el => {
    el.style.background = 'var(--card)';
    el.style.color = 'var(--text-dim)';
    el.style.borderColor = 'var(--border)';
  });
  const content = document.getElementById('defContent-' + tab);
  const tabBtn = document.getElementById('defTab-' + tab);
  if (content) content.style.display = 'block';
  if (tabBtn) {
    tabBtn.style.background = 'var(--accent)';
    tabBtn.style.color = '#fff';
    tabBtn.style.borderColor = 'var(--accent)';
  }
}

function switchRosterTeam(team) {
  currentRosterTeam = team;
  renderSeries();
}

/**
 * Update the Bets page nav button label to show the count for the current round.
 */
function updateBetsNavLabel() {
  const count = getSeriesCountForRound(currentPlayoffRound);
  const btn = document.querySelector('.page-nav-btn[onclick="switchPage(\'bets\')"]');
  if (btn) btn.textContent = `Bets (${count} Series)`;
}


// ============================================================
// PAGE NAVIGATION
// ============================================================
let currentPage = 'home';

function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.page-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.page-nav-btn[onclick="switchPage('${page}')"]`).classList.add('active');

  const tabsEl = document.getElementById('tabs');
  const mainEl = document.getElementById('main');

  if (page === 'series') {
    tabsEl.style.display = 'flex';
    tabsEl.style.flexDirection = 'column';
    renderTabs();
    renderSeries();
  } else {
    tabsEl.style.display = 'none';
    if (page === 'home') renderHomePage(mainEl);
    else if (page === 'learnings') renderLearningsPage(mainEl);
    else if (page === 'definitions') renderDefinitionsPage(mainEl);
    else if (page === 'bets') renderBetsPage(mainEl);
    else if (page === 'chs-lab') renderCHSLabPage(mainEl);
  }
}
