// ============================================================
// NAVIGATION & TAB MANAGEMENT
// ============================================================

function renderTabs() {
  // Round tabs (West / East)
  const roundHtml = ['West','East'].map(r =>
    `<div class="round-tab ${r===currentRound?'active':''}" onclick="switchRound('${r}')">${r}ern Conference</div>`
  ).join('');

  // Series sub-tabs for current round
  const roundSeries = SERIES_DATA.map((s,i) => ({s,i})).filter(x => x.s.conf === currentRound);
  const seriesHtml = roundSeries.map(x =>
    `<div class="series-tab ${x.i===currentSeriesIdx?'active':''}" onclick="switchSeries(${x.i})"><span class="series-tab-seed">#${x.s.homeTeam.seed}v#${x.s.awayTeam.seed}</span> ${x.s.homeTeam.abbr} vs ${x.s.awayTeam.abbr}</div>`
  ).join('');

  document.getElementById('tabs').innerHTML =
    `<div class="round-tabs">${roundHtml}</div><div class="series-tabs">${seriesHtml}</div>`;
}

function switchRound(r) {
  currentRound = r;
  // Jump to first series in that round
  const first = SERIES_DATA.findIndex(s => s.conf === r);
  if (first >= 0) currentSeriesIdx = first;
  currentGameTab = 'overview';
  renderTabs();
  renderSeries();
}

function switchSeries(i) {
  currentSeriesIdx = i;
  currentRound = SERIES_DATA[i].conf;
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
  ['parlays','g1','g2'].forEach(t => {
    const content = document.getElementById('betContent-'+t);
    const tabEl = document.getElementById('betTab-'+t);
    if(content) content.style.display = t===tab ? 'block' : 'none';
    if(tabEl) {
      tabEl.style.background = t===tab ? 'var(--accent)' : 'var(--card)';
      tabEl.style.color = t===tab ? '#fff' : 'var(--text-dim)';
      tabEl.style.borderColor = t===tab ? 'var(--accent)' : 'var(--border)';
    }
  });
}

function switchDefTab(tab) {
  document.querySelectorAll('.def-tab-content').forEach(el => el.style.display='none');
  document.querySelectorAll('.def-tab-btn').forEach(el => {
    el.style.background = 'var(--card)';
    el.style.color = 'var(--text-dim)';
    el.style.borderColor = 'var(--border)';
  });
  const content = document.getElementById('defContent-'+tab);
  const tabBtn = document.getElementById('defTab-'+tab);
  if(content) content.style.display = 'block';
  if(tabBtn) {
    tabBtn.style.background = 'var(--accent)';
    tabBtn.style.color = '#fff';
    tabBtn.style.borderColor = 'var(--accent)';
  }
}

function switchRosterTeam(team) {
  currentRosterTeam = team;
  renderSeries();
}


// ============================================================
// PAGE NAVIGATION
// ============================================================
let currentPage = 'series';

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
    if (page === 'learnings') renderLearningsPage(mainEl);
    else if (page === 'definitions') renderDefinitionsPage(mainEl);
    else if (page === 'bets') renderBetsPage(mainEl);
  }
}
