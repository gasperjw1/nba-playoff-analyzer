// ============================================================
// SEASON UI — tonight's slate, matchup lab, props, ledger
// ============================================================
// Same conventions as the playoff UI: template strings, globals,
// inline handlers, no framework. State lives in `seasonState`.
// ============================================================

const seasonState = {
  slate: null,
  slateOrigin: 'snapshot',
  tab: 'tonight',
  expanded: {},
  lab: { home: null, away: null, rest: { home: {}, away: {} }, avail: {} },
  propCache: {},
};

function seasonBoot() {
  let slate = null, origin = 'snapshot';
  try {
    const raw = localStorage.getItem(SEASON_SLATE_STORAGE_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (parsed && parsed.games && parsed.teams) { slate = parsed; origin = 'imported'; } }
  } catch (e) { /* storage unavailable */ }
  if (!slate && typeof SEASON_SLATE_SNAPSHOT !== 'undefined') slate = SEASON_SLATE_SNAPSHOT;
  seasonState.slate = slate;
  seasonState.slateOrigin = origin;
  if (slate && slate.games.length) {
    seasonState.lab.home = slate.games[0].home;
    seasonState.lab.away = slate.games[0].away;
  }
  renderSeasonApp();
}

function renderSeasonApp() {
  renderSeasonStatus();
  renderSeasonTabs();
  const main = document.getElementById('seasonMain');
  if (!seasonState.slate) { main.innerHTML = renderImportPanel(true); return; }
  switch (seasonState.tab) {
    case 'lab': main.innerHTML = renderLab(); break;
    case 'ledger': main.innerHTML = renderLedgerTab(); break;
    case 'data': main.innerHTML = renderImportPanel(false); break;
    default: main.innerHTML = renderTonight();
  }
}

function seasonSetTab(tab) { seasonState.tab = tab; renderSeasonApp(); }

// ---------- status + tabs ----------

function renderSeasonStatus() {
  const el = document.getElementById('seasonStatus');
  const s = seasonState.slate;
  if (!s) { el.innerHTML = `<span class="warn">No slate loaded — run <code>node fetch-slate.js</code> or paste the NB.AI feed under Data.</span>`; return; }
  const teams = Object.keys(s.teams).length;
  const stale = s.date && s.date !== seasonTodayIso();
  el.innerHTML = `
    <span>Feed ${s.source === 'espn' ? '<b>ESPN fallback</b> <span class="warn">(NB.AI not refreshed — no NB.AI probabilities)</span>' : `<b>NB.AI</b> ${s.modelVersion ? 'v' + s.modelVersion : ''}`} · ${seasonState.slateOrigin === 'imported' ? 'pasted import' : 'committed snapshot'}</span>
    <span>Slate <b>${s.date || '?'}</b>${stale ? ' <span class="warn">(not today — re-run fetch-slate.js)</span>' : ''}</span>
    <span>Fetched <b>${s.fetchedAt ? seasonFmtTime(s.fetchedAt) : '?'}</b></span>
    <span><b>${s.games.length}</b> games · <b>${teams}</b> teams</span>
    <span>League avg ORtg <b>${s.league.ortg.toFixed(1)}</b> pace <b>${s.league.pace.toFixed(1)}</b>${s.league.derived ? '' : ' <span class="muted">(fallback)</span>'}</span>`;
}

function renderSeasonTabs() {
  const tabs = [['tonight', 'Tonight'], ['lab', 'Matchup Lab'], ['ledger', 'Ledger & Scoring'], ['data', 'Data']];
  document.getElementById('seasonTabs').innerHTML = tabs.map(([id, label]) =>
    `<button class="season-tab${seasonState.tab === id ? ' active' : ''}" onclick="seasonSetTab('${id}')">${label}</button>`).join('');
}

// ---------- tonight ----------

function seasonGameForecast(game, opts) {
  const slate = seasonState.slate;
  const proj = projectSeasonGame(game, slate, opts);
  const m = game.market || {};
  const pFriend = game.external && game.external.nbai ? game.external.nbai.pHome : null;
  const blend = blendGameForecast({ pOurs: proj.pHome, pFriend, mlHome: m.mlHome, mlAway: m.mlAway, spreadHome: m.spreadHome });
  return { proj, blend, pFriend };
}

function renderTonight() {
  const s = seasonState.slate;
  if (!s.games.length) return `<div class="home-empty">No games on this slate.</div>`;
  const cards = s.games.map(g => renderGameCard(g)).join('');
  return `<div class="season-grid">${cards}</div>
    <p class="muted" style="margin-top:18px">Ours = this engine (net rating × pace + home court + rest ± roster vs rating, players valued by Box Plus/Minus ± aging of last season's rating ± roster fit (continuity, rebounding overlap); aging and fit measured on 330 team-seasons; P = Φ(margin/${SEASON_MARGIN_SIGMA})). NB.AI = your friend's 10,000-path Monte Carlo. Market = no-vig moneyline. Blend = equal log-odds average of the two models; the market is shown for comparison, not blended, until the ledger justifies a weight.</p>`;
}

function renderGameCard(g) {
  const { proj, blend, pFriend } = seasonGameForecast(g);
  const open = !!seasonState.expanded[g.id];
  const pickHome = (blend.pBlend != null ? blend.pBlend : proj.pHome) >= 0.5;
  const pick = pickHome ? g.home : g.away;
  const pPick = blend.pBlend != null ? (pickHome ? blend.pBlend : 1 - blend.pBlend) : (pickHome ? proj.pHome : 1 - proj.pHome);
  const m = g.market || {};
  const flags = [];
  if (blend.modelsAgree === true) flags.push(`<span class="flag flag-agree">MODELS AGREE</span>`);
  else if (blend.modelsAgree === false) flags.push(`<span class="flag flag-disagree">MODELS SPLIT</span>`);
  else flags.push(`<span class="flag flag-none">NB.AI N/A</span>`);
  if (blend.flagged) flags.push(`<span class="flag flag-edge">${blend.edge > 0 ? g.home : g.away} +${(Math.abs(blend.edge) * 100).toFixed(1)}pp vs market</span>`);
  const absences = [...proj.availability.home.missing.map(x => `${g.home}: ${x.name}`), ...proj.availability.away.missing.map(x => `${g.away}: ${x.name}`)];

  return `<div class="sg-card${open ? ' open' : ''}" onclick="seasonToggleGame('${g.id}')">
    <div class="sg-head">
      <div class="sg-matchup">${g.away} @ ${g.home}</div>
      <div class="sg-when">${g.tip ? seasonFmtTime(g.tip) : ''}${g.venue ? ' · ' + g.venue : ''}</div>
    </div>
    <div class="sg-pick">${pick} <small>${(pPick * 100).toFixed(1)}% blended</small></div>
    <div class="sg-score">Proj ${g.home} ${proj.homeScore} – ${g.away} ${proj.awayScore} · ${seasonFmtMargin(g.home, proj.margin)} · total ${proj.total.toFixed(0)}${m.spreadHome != null ? ` · line ${g.home} ${m.spreadHome > 0 ? '+' : ''}${m.spreadHome}${m.total != null ? ' / ' + m.total : ''}` : ''}</div>
    <div class="sg-chips">
      ${seasonChip('Ours', proj.pHome, g.home, g.away)}
      ${seasonChip('NB.AI', pFriend, g.home, g.away)}
      ${seasonChip('Market', blend.pMarket, g.home, g.away, 'market', blend.pMarketSource)}
      ${seasonChip('Blend', blend.pBlend, g.home, g.away, 'blend')}
    </div>
    <div class="sg-flags">${flags.join('')}${absences.length ? `<span class="flag flag-none">OUT/Q: ${absences.slice(0, 4).join(', ')}${absences.length > 4 ? ' +' + (absences.length - 4) : ''}</span>` : ''}</div>
    ${open ? renderGameDetail(g, proj) : ''}
  </div>`;
}

function seasonChip(label, pHome, homeAbbr, awayAbbr, cls, sub) {
  if (pHome == null) return `<div class="chip missing ${cls || ''}"><span class="chip-label">${label}</span><span class="chip-value">—</span></div>`;
  const home = pHome >= 0.5;
  return `<div class="chip ${cls || ''}"><span class="chip-label">${label}</span><span class="chip-value">${home ? homeAbbr : awayAbbr} ${((home ? pHome : 1 - pHome) * 100).toFixed(1)}%</span><span class="chip-sub">${homeAbbr} ${(pHome * 100).toFixed(1)}%${sub ? ' · ' + sub : ''}</span></div>`;
}

function seasonToggleGame(id) { seasonState.expanded[id] = !seasonState.expanded[id]; renderSeasonApp(); }

function renderGameDetail(g, proj) {
  const s = seasonState.slate;
  const hs = proj.homeStrength, as = proj.awayStrength;
  return `<div class="sg-detail" onclick="event.stopPropagation()">
    <h4>Margin waterfall (${g.home} perspective)</h4>
    <table class="lineage">
      ${proj.lineage.map(l => `<tr><td>${l.label}</td><td class="num ${l.delta >= 0 ? 'pos' : 'neg'}">${l.delta >= 0 ? '+' : ''}${l.delta.toFixed(1)}</td><td class="num">${l.running >= 0 ? '+' : ''}${l.running.toFixed(1)}</td><td class="detail">${l.detail || ''}</td></tr>`).join('')}
      <tr><td><b>Win probability</b></td><td class="num"></td><td class="num"><b>${(proj.pHome * 100).toFixed(1)}%</b></td><td class="detail">Φ(${proj.margin.toFixed(1)} / ${SEASON_MARGIN_SIGMA})</td></tr>
    </table>
    ${seasonUnmodeledNote(g, proj)}
    <h4>Team strength (per 100 poss.)</h4>
    <table class="lineage">
      <tr><td></td><td class="num">ORtg</td><td class="num">DRtg</td><td class="num">Net</td><td class="detail">blend</td></tr>
      ${[[g.home, hs], [g.away, as]].map(([ab, t]) => `<tr><td><b>${ab}</b></td><td class="num">${t.ortg.toFixed(1)}</td><td class="num">${t.drtg.toFixed(1)}</td><td class="num ${t.net >= 0 ? 'pos' : 'neg'}">${t.net >= 0 ? '+' : ''}${t.net.toFixed(1)}</td><td class="detail">${t.currentGames ? `${Math.round(t.currentWeight * 100)}% this season (${t.currentGames} g, net ${t.currentNet >= 0 ? '+' : ''}${t.currentNet}) · ${100 - Math.round(t.currentWeight * 100)}% last season (${t.priorNet >= 0 ? '+' : ''}${t.priorNet} → shrunk ${t.priorNetShrunk >= 0 ? '+' : ''}${t.priorNetShrunk})` : `last season only (${t.priorNet >= 0 ? '+' : ''}${t.priorNet} → shrunk ${t.priorNetShrunk >= 0 ? '+' : ''}${t.priorNetShrunk})`}</td></tr>`).join('')}
    </table>
    <h4>${g.away} props</h4>${renderPropsTable(g.away, g.home)}
    <h4>${g.home} props</h4>${renderPropsTable(g.home, g.away)}
  </div>`;
}

function seasonUnmodeledNote(g, proj) {
  const parts = [];
  if (proj.availability.home.unmodeled.length) parts.push(`${g.home}: ${proj.availability.home.unmodeled.join(', ')}`);
  if (proj.availability.away.unmodeled.length) parts.push(`${g.away}: ${proj.availability.away.unmodeled.join(', ')}`);
  if (!parts.length) return '';
  return `<p class="muted" style="margin-top:8px">Out but <b>not valued</b> (no NBA minutes in 2024-25, 2025-26 or this season — rookies and two-ways): ${parts.join(' · ')}</p>`;
}

// ---------- props ----------

function renderPropsTable(teamAbbr, oppAbbr, opts) {
  const rows = projectTeamProps(teamAbbr, oppAbbr, seasonState.slate, opts).filter(p => p.min >= 8);
  if (!rows.length) return `<div class="muted">No projectable rotation.</div>`;
  rows.forEach(p => { seasonState.propCache[p.id] = p; });
  return `<table class="props">
    <tr><th>Player</th><th>Min</th><th>Pts</th><th>Reb</th><th>Ast</th><th>PRA</th><th>3PM</th><th>Line (stat)</th><th>P(over)</th></tr>
    ${rows.map(p => `<tr class="${p.availability < 1 ? 'doubt' : ''}">
      <td class="name">${p.name}<small>${p.pos}${p.starter ? ' · S' : ''}${p.availability < 1 ? ' · ' + Math.round(p.availability * 100) + '%' : ''}</small></td>
      <td>${p.min.toFixed(0)}</td><td>${p.pts.toFixed(1)}</td><td>${p.reb.toFixed(1)}</td><td>${p.ast.toFixed(1)}</td><td>${p.pra.toFixed(1)}</td><td>${p.tpm.toFixed(1)}</td>
      <td class="linecell"><input class="line" type="number" step="0.5" placeholder="${p.pts.toFixed(1)}" oninput="seasonPropLine('${p.id}', this)">
          <select onchange="seasonPropLine('${p.id}', this.previousElementSibling)" style="font-size:11px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:5px">
            <option value="pts">pts</option><option value="reb">reb</option><option value="ast">ast</option><option value="pra">pra</option><option value="tpm">3pm</option></select></td>
      <td><span class="pov" id="pov-${p.id}">—</span></td>
    </tr>`).join('')}
  </table>`;
}

function seasonPropLine(playerId, input) {
  const p = seasonState.propCache[playerId];
  const out = document.getElementById('pov-' + playerId);
  if (!p || !out) return;
  const stat = input.nextElementSibling ? input.nextElementSibling.value : 'pts';
  const line = parseFloat(input.value);
  if (!isFinite(line)) { out.textContent = '—'; out.className = 'pov'; return; }
  const pOver = probOver(p[stat], p.sd[stat], line);
  out.textContent = `${(pOver * 100).toFixed(0)}% o`;
  out.className = 'pov ' + (pOver >= 0.58 ? 'pos' : pOver <= 0.42 ? 'neg' : '');
  out.title = `${stat} proj ${p[stat]} ± ${p.sd[stat]}`;
}

// ---------- matchup lab ----------

function renderLab() {
  const s = seasonState.slate, lab = seasonState.lab;
  const abbrs = Object.keys(s.teams).sort();
  if (!lab.home || !s.teams[lab.home]) lab.home = abbrs[0];
  if (!lab.away || !s.teams[lab.away]) lab.away = abbrs.find(a => a !== lab.home) || abbrs[0];
  const game = makeCustomGame(lab.home, lab.away);
  const opts = { restOverride: lab.rest, availabilityOverride: lab.avail };
  const proj = projectSeasonGame(game, s, opts);
  const friendInput = lab.friendP != null ? lab.friendP : '';
  const blend = blendGameForecast({ pOurs: proj.pHome, pFriend: lab.friendP != null ? lab.friendP / 100 : null, mlHome: lab.mlHome, mlAway: lab.mlAway, spreadHome: null });

  const teamSel = (side) => `<select onchange="seasonLabSet('${side}', this.value)">${abbrs.map(a => `<option value="${a}"${lab[side] === a ? ' selected' : ''}>${a} — ${s.teams[a].city} ${s.teams[a].name}</option>`).join('')}</select>`;
  const restSel = (side) => {
    const r = { ...s.teams[lab[side]].rest, ...(lab.rest[side] || {}) };
    const v = r.backToBack ? 'b2b' : r.threeInFour ? '3in4' : r.restDays >= SEASON_REST.longRestDays ? 'long' : 'normal';
    return `<select onchange="seasonLabRest('${side}', this.value)">
      <option value="normal"${v === 'normal' ? ' selected' : ''}>1-2 days rest</option>
      <option value="b2b"${v === 'b2b' ? ' selected' : ''}>back-to-back</option>
      <option value="3in4"${v === '3in4' ? ' selected' : ''}>3 in 4 nights</option>
      <option value="long"${v === 'long' ? ' selected' : ''}>3+ days rest</option></select>`;
  };
  const playerList = (side) => s.teams[lab[side]].players.filter(p => p.avg && p.avg.min >= 8).sort((a, b) => b.avg.min - a.avg.min).map(p => {
    const av = p.id in lab.avail ? lab.avail[p.id] : p.availability;
    return `<div class="lab-player"><span>${p.name} <span class="muted">${p.pos}</span></span>
      <select onchange="seasonLabAvail('${p.id}', this.value)">
        ${[[1, 'in'], [0.9, 'probable'], [0.5, 'questionable'], [0.1, 'doubtful'], [0, 'OUT']].map(([v, l]) => `<option value="${v}"${Math.abs(av - v) < 0.01 ? ' selected' : ''}>${l}</option>`).join('')}
      </select><span class="mins">${p.avg.min.toFixed(0)} min · ${p.avg.pts.toFixed(1)} pts</span></div>`;
  }).join('');

  return `<div class="lab">
    <div class="lab-col"><h3>Home</h3><div class="lab-row"><label>Team</label>${teamSel('home')}</div><div class="lab-row"><label>Rest</label>${restSel('home')}</div><div class="lab-players">${playerList('home')}</div></div>
    <div class="lab-col"><h3>Away</h3><div class="lab-row"><label>Team</label>${teamSel('away')}</div><div class="lab-row"><label>Rest</label>${restSel('away')}</div><div class="lab-players">${playerList('away')}</div></div>
    <div class="lab-col lab-result">
      <div class="sg-pick">${proj.pHome >= 0.5 ? lab.home : lab.away} <small>${((proj.pHome >= 0.5 ? proj.pHome : 1 - proj.pHome) * 100).toFixed(1)}% · ${seasonFmtMargin(lab.home, proj.margin)} · ${lab.home} ${proj.homeScore} – ${lab.away} ${proj.awayScore} · total ${proj.total.toFixed(0)}</small></div>
      <div class="lab-row"><label>NB.AI %</label><input type="number" min="1" max="99" step="0.1" value="${friendInput}" placeholder="${lab.home} win %" oninput="seasonLabFriend(this.value)">
        <label>ML</label><input type="number" step="5" value="${lab.mlHome ?? ''}" placeholder="${lab.home}" oninput="seasonLabMl('mlHome', this.value)"><input type="number" step="5" value="${lab.mlAway ?? ''}" placeholder="${lab.away}" oninput="seasonLabMl('mlAway', this.value)"></div>
      <div class="sg-chips" style="margin:10px 0">${seasonChip('Ours', proj.pHome, lab.home, lab.away)}${seasonChip('NB.AI', lab.friendP != null ? lab.friendP / 100 : null, lab.home, lab.away)}${seasonChip('Market', blend.pMarket, lab.home, lab.away, 'market')}${seasonChip('Blend', blend.pBlend, lab.home, lab.away, 'blend')}</div>
      <table class="lineage">${proj.lineage.map(l => `<tr><td>${l.label}</td><td class="num ${l.delta >= 0 ? 'pos' : 'neg'}">${l.delta >= 0 ? '+' : ''}${l.delta.toFixed(1)}</td><td class="num">${l.running >= 0 ? '+' : ''}${l.running.toFixed(1)}</td><td class="detail">${l.detail || ''}</td></tr>`).join('')}</table>
      <h4 style="margin-top:14px;font-size:11px;text-transform:uppercase;color:var(--text-dim)">${lab.away} props</h4>${renderPropsTable(lab.away, lab.home, opts)}
      <h4 style="margin-top:14px;font-size:11px;text-transform:uppercase;color:var(--text-dim)">${lab.home} props</h4>${renderPropsTable(lab.home, lab.away, opts)}
    </div>
  </div>`;
}

function seasonLabSet(side, abbr) { seasonState.lab[side] = abbr; seasonState.lab.rest[side] = {}; renderSeasonApp(); }
function seasonLabRest(side, v) {
  seasonState.lab.rest[side] = v === 'b2b' ? { backToBack: true, threeInFour: false, restDays: 0 }
    : v === '3in4' ? { backToBack: false, threeInFour: true, restDays: 1 }
    : v === 'long' ? { backToBack: false, threeInFour: false, restDays: 3 }
    : { backToBack: false, threeInFour: false, restDays: 1 };
  renderSeasonApp();
}
function seasonLabAvail(id, v) { seasonState.lab.avail[id] = parseFloat(v); renderSeasonApp(); }
function seasonLabFriend(v) { const n = parseFloat(v); seasonState.lab.friendP = isFinite(n) && n > 0 && n < 100 ? n : null; seasonLabRefreshResult(); }
function seasonLabMl(key, v) { const n = parseFloat(v); seasonState.lab[key] = isFinite(n) && n !== 0 ? n : null; seasonLabRefreshResult(); }
function seasonLabRefreshResult() {
  // Re-render only the result column so the number inputs keep focus.
  const main = document.getElementById('seasonMain');
  const tmp = document.createElement('div'); tmp.innerHTML = renderLab();
  const fresh = tmp.querySelector('.lab-result .sg-chips');
  const cur = main.querySelector('.lab-result .sg-chips');
  if (fresh && cur) cur.innerHTML = fresh.innerHTML;
}

// ---------- ledger ----------

function renderLedgerTab() {
  const rows = loadSeasonLedger();
  const score = scoreForecasts(rows);
  const stack = stackWeightsFromLedger(rows);
  const settled = rows.filter(r => r.result).length;
  const tile = (name, label) => { const sc = score[name]; return sc && sc.n ? `<div class="score-tile"><div class="t">${label}</div><div class="v">${(sc.accuracy * 100).toFixed(1)}%</div><div class="s">Brier ${sc.brier}${sc.logLoss != null ? ' · log loss ' + sc.logLoss : ''}${sc.marginMae != null ? ' · MAE ' + sc.marginMae : ''}${sc.note ? ' · ' + sc.note : ''} · n=${sc.n}</div></div>` : `<div class="score-tile"><div class="t">${label}</div><div class="v">—</div><div class="s">no settled games</div></div>`; };
  return `<div class="ledger">
    <div class="lab-row"><button class="btn btn-primary btn-sm" onclick="seasonRecordTonight()">Record tonight's slate</button>
      <button class="btn btn-secondary btn-sm" onclick="seasonExportLedger()">Copy ledger JSON</button>
      <span class="muted">${rows.length} rows · ${settled} settled · recorded before tip-off only counts</span></div>
    <div class="scorecard">${tile('ours', 'Ours')}${tile('friend', 'NB.AI')}${tile('market', 'Market')}${tile('blend', 'Blend')}${tile('baseline', 'Always home')}</div>
    <p class="muted">Targets: no-vig closing line runs ≈ 67.8% / Brier 0.205 / margin MAE ≈ 10 over 13k+ games. ${stack.status === 'insufficient' ? `Stacking weights need ${stack.needed} settled games with all three forecasts (have ${stack.n}).` : `Stacking (${stack.status}, n=${stack.n}): logit P = ${stack.bias} + ${stack.weights.map((w, i) => `${w}·${stack.labels[i]}`).join(' + ')}. ${stack.note}`}</p>
    <table><tr><th>Date</th><th>Game</th><th>Ours</th><th>NB.AI</th><th>Market</th><th>Blend</th><th>Line</th><th>Result</th><th></th></tr>
    ${rows.slice().reverse().map(r => `<tr>
      <td>${r.date}${r.source === 'espn' ? ' <span class="muted" title="Recorded from the ESPN fallback slate (no NB.AI)">ESPN</span>' : ''}</td><td>${r.away} @ ${r.home}</td>
      <td>${seasonPct(r.pOurs)}<span class="muted"> ${seasonFmtMargin(r.home, r.marginOurs)}</span></td><td>${seasonPct(r.pFriend)}</td><td>${seasonPct(r.pMarket)}</td><td>${seasonPct(r.pBlend)}</td>
      <td>${r.spreadHome != null ? `${r.home} ${r.spreadHome > 0 ? '+' : ''}${r.spreadHome}` : '—'}${r.totalMarket != null ? ' / ' + r.totalMarket : ''}</td>
      <td>${r.result ? `${r.away} ${r.result.awayScore} – ${r.home} ${r.result.homeScore} ${seasonResultMark(r)}` : `<input id="aw-${r.id}" placeholder="${r.away}"> <input id="hm-${r.id}" placeholder="${r.home}">`}</td>
      <td>${r.result ? '' : `<button class="btn btn-secondary btn-sm" onclick="seasonSettle('${r.id}')">Settle</button>`}</td>
    </tr>`).join('')}
    </table>
    ${rows.length ? `<p class="muted" style="margin-top:10px"><a href="#" onclick="if(confirm('Clear browser-local ledger rows? Committed rows stay.')){clearLocalSeasonLedger();renderSeasonApp();}return false;">Clear local rows</a></p>` : ''}
  </div>`;
}

function seasonResultMark(r) {
  const y = r.result.homeScore > r.result.awayScore;
  const mark = (p) => p == null ? '' : ((p >= 0.5) === y ? '✓' : '✗');
  return `<span class="muted">ours ${mark(r.pOurs)} nb.ai ${mark(r.pFriend)} mkt ${mark(r.pMarket)}</span>`;
}

function seasonRecordTonight() {
  const s = seasonState.slate;
  const now = new Date();
  const entries = s.games.filter(g => !g.tip || new Date(g.tip) > now).map(g => {
    const { proj, blend } = seasonGameForecast(g);
    return buildLedgerEntry(g, proj, blend, s);
  });
  const res = recordSeasonEntries(entries);
  const skippedTip = s.games.length - entries.length;
  alert(`Recorded ${res.added} game(s); ${res.skipped} already on the ledger${skippedTip ? `; ${skippedTip} skipped (already tipped off)` : ''}.`);
  renderSeasonApp();
}

function seasonSettle(id) {
  const aw = parseInt(document.getElementById('aw-' + id).value, 10);
  const hm = parseInt(document.getElementById('hm-' + id).value, 10);
  if (!isFinite(aw) || !isFinite(hm)) { alert('Enter both scores.'); return; }
  settleSeasonEntry(id, hm, aw);
  renderSeasonApp();
}

function seasonExportLedger() {
  const json = exportSeasonLedgerJson();
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(json).then(() => alert('Ledger JSON copied.'));
  else prompt('Ledger JSON', json);
}

// ---------- data / import ----------

function renderImportPanel(noSlate) {
  return `<div class="import-box">
    ${noSlate ? '<p class="warn" style="color:var(--yellow);margin-bottom:10px">No slate is loaded.</p>' : ''}
    <p class="muted" style="margin-bottom:10px">Daily: <code>./season-daily.sh</code> (any time settles yesterday; from 11 AM ET also records tonight — once per day each), then commit <code>js/season/data/slate-snapshot.js</code> + <code>season-ledger.js</code>. <code>./season-daily.sh --status</code> shows what has run. If NB.AI has not refreshed, <code>./season-daily.sh --espn</code> (automatic from 5 PM ET) records from ESPN instead. Browser-only fallback: paste the NB.AI <code>saved.json</code> below, and optionally the <code>/api/rankings</code> document, then import. The import stays in this browser only.</p>
    <textarea id="importSaved" placeholder="saved.json contents"></textarea>
    <textarea id="importRankings" placeholder="/api/rankings contents (optional — supplies NB.AI win probabilities and lines)" style="min-height:80px;margin-top:8px"></textarea>
    <div class="lab-row" style="margin-top:10px"><button class="btn btn-primary btn-sm" onclick="seasonImport()">Import</button>
      ${seasonState.slateOrigin === 'imported' ? `<button class="btn btn-secondary btn-sm" onclick="localStorage.removeItem(SEASON_SLATE_STORAGE_KEY);seasonBoot()">Revert to committed snapshot</button>` : ''}
      <span id="importMsg" class="muted"></span></div>
  </div>`;
}

function seasonImport() {
  const msg = document.getElementById('importMsg');
  try {
    const saved = JSON.parse(document.getElementById('importSaved').value);
    const rkRaw = document.getElementById('importRankings').value.trim();
    const rankings = rkRaw ? JSON.parse(rkRaw) : null;
    const slate = adaptNbaiSlate(saved, rankings);
    localStorage.setItem(SEASON_SLATE_STORAGE_KEY, JSON.stringify(slate));
    seasonState.tab = 'tonight';
    seasonBoot();
  } catch (e) {
    msg.textContent = 'Import failed: ' + e.message;
  }
}

// ---------- formatting ----------

function seasonFmtTime(iso) {
  try { return new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)) + ' ET'; }
  catch (e) { return iso; }
}
function seasonTodayIso() {
  try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  catch (e) { return new Date().toISOString().slice(0, 10); }
}
function seasonFmtMargin(home, m) { if (m == null) return ''; return m >= 0 ? `${home} by ${Math.abs(m).toFixed(1)}` : `${home} −${Math.abs(m).toFixed(1)}`; }
function seasonPct(p) { return p == null ? '—' : (p * 100).toFixed(1) + '%'; }
