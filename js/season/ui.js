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
  results: { mode: 'live', date: null, calOpen: false, calMonth: null },
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
  const parts = (typeof location !== 'undefined' ? location.hash.slice(1) : '').split('/');
  if (SEASON_TABS.some(([id]) => id === parts[0])) seasonState.tab = parts[0];
  if (parts[0] === 'results') {
    if (parts[1] === 'replay') { seasonState.results.mode = 'replay'; parts.splice(1, 1); }
    if (/^\d{4}-\d{2}-\d{2}$/.test(parts[1] || '')) seasonState.results.date = parts[1];
  }
  seasonBindKeys();
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
    case 'results': main.innerHTML = renderResultsTab(); break;
    case 'lab': main.innerHTML = renderLab(); break;
    case 'ledger': main.innerHTML = renderLedgerTab(); break;
    case 'data': main.innerHTML = renderImportPanel(false); break;
    default: main.innerHTML = renderTonight();
  }
}

function seasonSetTab(tab) {
  seasonState.tab = tab;
  seasonWriteHash();
  renderSeasonApp();
}

// #tab, or #results[/replay][/YYYY-MM-DD] on the results tab — linkable and bookmarkable.
function seasonWriteHash() {
  if (typeof history === 'undefined' || !history.replaceState) return;
  const r = seasonState.results, res = seasonState.tab === 'results';
  history.replaceState(null, '', '#' + seasonState.tab + (res && r.mode === 'replay' ? '/replay' : '') + (res && r.date ? '/' + r.date : ''));
}

// ← / → step through results days; Esc closes the calendar. Bound once.
function seasonBindKeys() {
  if (seasonState.keysBound || typeof document === 'undefined' || !document.addEventListener) return;
  seasonState.keysBound = true;
  document.addEventListener('keydown', e => {
    if (seasonState.tab !== 'results' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') { seasonResultsStep(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { seasonResultsStep(1); e.preventDefault(); }
    else if (e.key === 'Escape' && seasonState.results.calOpen) seasonResultsToggleCal(false);
  });
}

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
    ${s.injuryReport ? `<span>Injuries <b>official report ${seasonFmtTime(s.injuryReport.at)}</b> · ${s.injuryReport.changes} changes over the feed</span>` : ''}
    <span><b>${s.games.length}</b> games · <b>${teams}</b> teams</span>
    <span>League avg ORtg <b>${s.league.ortg.toFixed(1)}</b> pace <b>${s.league.pace.toFixed(1)}</b>${s.league.derived ? '' : ' <span class="muted">(fallback)</span>'}</span>`;
}

const SEASON_TABS = [['tonight', 'Tonight'], ['results', 'Results by Day'], ['lab', 'Matchup Lab'], ['ledger', 'Ledger & Scoring'], ['data', 'Data']];

function renderSeasonTabs() {
  document.getElementById('seasonTabs').innerHTML = SEASON_TABS.map(([id, label]) =>
    `<button class="season-tab${seasonState.tab === id ? ' active' : ''}" onclick="seasonSetTab('${id}')">${label}</button>`).join('');
}

// ---------- tonight ----------

function seasonGameForecast(game, opts) {
  const slate = seasonState.slate;
  const proj = projectSeasonGame(game, slate, opts);
  const m = game.market || {};
  const pFriend = game.external && game.external.nbai ? game.external.nbai.pHome : null;
  const blend = blendGameForecast({ pOurs: proj.pHome, pFriend, mlHome: m.mlHome, mlAway: m.mlAway, spreadHome: m.spreadHome });
  const cleanSlate = typeof seasonCleanSlate === 'function' ? seasonCleanSlate(slate) : null;
  const clean = cleanSlate ? projectSeasonGame(game, cleanSlate, opts) : null;
  const adjSlate = typeof seasonOppAdjSlate === 'function' ? seasonOppAdjSlate(slate) : null;
  const adj = adjSlate ? projectSeasonGame(game, adjSlate, opts) : null;
  return { proj, blend, pFriend, clean, adj };
}

function renderTonight() {
  const s = seasonState.slate;
  if (!s.games.length) return `<div class="home-empty">No games on this slate.</div>`;
  const cards = s.games.map(g => renderGameCard(g)).join('');
  return `<div class="season-grid">${cards}</div>
    <p class="muted" style="margin-top:18px">Picks come from Ours · 2025-26 — this engine on last season's ratings, the setup tested leak-free in the replay (Results by Day → Replay), where it still trails the closing line; edge flags stay "unproven" until the ledger holds ${SEASON_ENSEMBLE.stackTrustN} settled games. Ours · opp-adj = the picks engine with this season's results corrected for opponent strength (better on past seasons by a small margin; tracked side by side, not used for picks until the ledger shows it). Ours = the same engine on the feed's ratings, which already include this season (not tested). The engine = (net rating × pace + home court + rest ± roster vs rating, players valued by Box Plus/Minus ± aging of last season's rating ± roster fit (continuity, rebounding overlap); aging and fit measured on 330 team-seasons; P = Φ(margin/${SEASON_MARGIN_SIGMA})). NB.AI = your friend's 10,000-path Monte Carlo. Market = no-vig moneyline. Blend = equal log-odds average of the two models; the market is shown for comparison, not blended, until the ledger justifies a weight.</p>`;
}

function renderGameCard(g) {
  const { proj, blend, pFriend, clean, adj } = seasonGameForecast(g);
  const open = !!seasonState.expanded[g.id];
  // The pick, score line, edge and waterfall come from the replay-tested setup:
  // this engine on last season's ratings. The NB.AI-ratings engine and the
  // blend are shown, not used — neither has been tested without leakage.
  const v = clean || proj;
  const pickHome = v.pHome >= 0.5;
  const pick = pickHome ? g.home : g.away;
  const pPick = pickHome ? v.pHome : 1 - v.pHome;
  const m = g.market || {};
  const flags = [];
  if (blend.modelsAgree === true) flags.push(`<span class="flag flag-agree">MODELS AGREE</span>`);
  else if (blend.modelsAgree === false) flags.push(`<span class="flag flag-disagree">MODELS SPLIT</span>`);
  else flags.push(`<span class="flag flag-none">NB.AI N/A</span>`);
  const edge = blend.pMarket != null ? v.pHome - blend.pMarket : null;
  if (edge != null && Math.abs(edge) >= SEASON_ENSEMBLE.edgeFlagPts) {
    const n = seasonValidatedSettled();
    flags.push(`<span class="flag flag-edge">${edge > 0 ? g.home : g.away} +${(Math.abs(edge) * 100).toFixed(1)}pp vs market${n < SEASON_ENSEMBLE.stackTrustN ? ` · unproven (${n}/${SEASON_ENSEMBLE.stackTrustN} settled)` : ''}</span>`);
  }
  const trust = clean && typeof seasonTrustCheck === 'function' ? seasonTrustCheck(clean, m) : null;
  if (trust && trust.rule) {
    const rule = SEASON_TRUST.rules.find(r => r.id === trust.rule), live = seasonTrustRecord(loadSeasonLedger())[trust.rule];
    const team = trust.side === 'home' ? g.home : g.away;
    flags.push(`<span class="flag ${rule.avoid ? 'flag-none' : 'flag-edge'}" title="${rule.why}">${rule.avoid ? 'AVOID' : rule.id} · ${team} +${(trust.edge * 100).toFixed(1)}pp over the price at ${trust.ml > 0 ? '+' : ''}${trust.ml} · driven by ${rule.label.toLowerCase()} · frozen rule, ${live.n} judged</span>`);
  }
  const lateRow = typeof SEASON_LATE_FLIP !== 'undefined' ? loadSeasonLedger().find(r => r.date === seasonState.slate.date && r.home === g.home && r.away === g.away && r.late && r.late.flip) : null;
  if (lateRow) {
    const L = lateRow.late, team = L.side === 'home' ? g.home : g.away, pE = L.side === 'home' ? L.pEve : 1 - L.pEve;
    flags.push(`<span class="flag flag-edge" title="${SEASON_LATE_FLIP.why}">${SEASON_LATE_FLIP.id} · evening-before pick ${team} ${(pE * 100).toFixed(1)}%, flipped by the later report · frozen rule, ${seasonLateFlipRecord(loadSeasonLedger()).n} judged</span>`);
  }
  // The pre-tip prediction the ledger grades (pOursClean), beside the card's recalculation from the
  // current slate, which may carry later injury news (fetch-slate.js --injuries).
  const recRow = loadSeasonLedger().find(r => r.date === seasonState.slate.date && r.home === g.home && r.away === g.away && r.pOursClean != null);
  if (recRow && clean && (recRow.pOursClean >= 0.5) !== (clean.pHome >= 0.5)) {
    const rt = recRow.pOursClean >= 0.5 ? g.home : g.away, rp = recRow.pOursClean >= 0.5 ? recRow.pOursClean : 1 - recRow.pOursClean;
    flags.push(`<span class="flag flag-disagree">RECORDED PICK ${rt} ${(rp * 100).toFixed(1)}% at ${seasonFmtTime(recRow.recordedAt)} · the ledger grades that one; this recalculation (${pick}) has later news</span>`);
  }
  const absences = [...v.availability.home.missing.map(x => `${g.home}: ${x.name}`), ...v.availability.away.missing.map(x => `${g.away}: ${x.name}`)];

  return `<div class="sg-card${open ? ' open' : ''}" onclick="seasonToggleGame('${g.id}')">
    <div class="sg-head">
      <div class="sg-matchup">${g.away} @ ${g.home}</div>
      <div class="sg-when">${g.tip ? seasonFmtTime(g.tip) : ''}${g.venue ? ' · ' + g.venue : ''}</div>
    </div>
    <div class="sg-pick">${pick} <small>${(pPick * 100).toFixed(1)}% · ${clean ? 'replay-tested engine' : 'engine'}</small></div>
    <div class="sg-score">Proj ${g.home} ${v.homeScore} – ${g.away} ${v.awayScore} · ${seasonFmtMargin(g.home, v.margin)} · total ${v.total.toFixed(0)}${m.spreadHome != null ? ` · line ${g.home} ${m.spreadHome > 0 ? '+' : ''}${m.spreadHome}${m.total != null ? ' / ' + m.total : ''}` : ''}</div>
    <div class="sg-chips">
      ${recRow ? seasonChip('Recorded', recRow.pOursClean, g.home, g.away, '', `graded · ${seasonFmtTime(recRow.recordedAt)}`) : ''}
      ${clean ? seasonChip(recRow ? 'Ours · 2025-26 now' : 'Ours · 2025-26', clean.pHome, g.home, g.away, '', recRow ? 'recalculated · current slate' : 'replay-tested · picks') : ''}
      ${adj ? seasonChip('Ours · opp-adj', adj.pHome, g.home, g.away, '', 'tracked · not picks') : ''}
      ${seasonChip('Ours', proj.pHome, g.home, g.away, '', clean ? 'NB.AI ratings · untested' : '')}
      ${seasonChip('NB.AI', pFriend, g.home, g.away)}
      ${seasonChip('Market', blend.pMarket, g.home, g.away, 'market', blend.pMarketSource)}
      ${seasonChip('Blend', blend.pBlend, g.home, g.away, 'blend')}
    </div>
    <div class="sg-flags">${flags.join('')}${absences.length ? `<span class="flag flag-none">OUT/Q: ${absences.slice(0, 4).join(', ')}${absences.length > 4 ? ' +' + (absences.length - 4) : ''}</span>` : ''}</div>
    ${open ? renderGameDetail(g, v) : ''}
  </div>`;
}

// Settled live-ledger games with a prediction from the replay-tested setup.
function seasonValidatedSettled() {
  return loadSeasonLedger().filter(r => r.result && r.pOursClean != null).length;
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

// ---------- results by day ----------

// Live = the ledger (recorded before tip-off). Replay = replay-season.js's walk-forward rows,
// predicted after the fact from data published before each game; never mixed with the ledger.
const SEASON_RESULT_MODELS_LIVE = [['ours', 'Ours'], ['oursClean', 'Ours · 2025-26'], ['oursAdj', 'Ours · opp-adj'], ['nbai', 'NB.AI'], ['market', 'Market']];
const SEASON_RESULT_MODELS_REPLAY = [['ours', 'Ours'], ['oursPre', 'Ours + preseason'], ['oursAdj', 'Ours · opp-adj'], ['market', 'Market']];
function seasonResultModels() { return seasonState.results.mode === 'replay' ? SEASON_RESULT_MODELS_REPLAY : SEASON_RESULT_MODELS_LIVE; }
function seasonResultsRows() {
  if (seasonState.results.mode !== 'replay') return loadSeasonLedger();
  return typeof SEASON_REPLAY !== 'undefined' && SEASON_REPLAY && Array.isArray(SEASON_REPLAY.rows) ? SEASON_REPLAY.rows : [];
}
function seasonResultsMode(mode) {
  Object.assign(seasonState.results, { mode, date: null, calOpen: false, calMonth: null });
  seasonWriteHash();
  renderSeasonApp();
}

// Each model's call on a ledger row: { p, margin, implied } or null.
// Winner = the side its win probability favours (as on the Ledger tab).
// Margin: ours is the engine's; market is minus the home spread; NB.AI
// publishes no margin, so its margin is implied from P via the engine's σ.
function seasonModelCalls(r) {
  const num = v => typeof v === 'number' && isFinite(v);
  const call = (p, margin) => (num(p) || num(margin)) ? { p: num(p) ? p : null, margin: num(margin) ? margin : winProbToMargin(p), implied: !num(margin) } : null;
  return {
    ours: call(r.pOurs, r.marginOurs),
    oursPre: call(r.pOursPre, r.marginOursPre),
    oursClean: call(r.pOursClean, r.marginOursClean),
    oursAdj: call(r.pOursAdj, r.marginOursAdj),
    nbai: call(r.pFriend, null),
    market: call(r.pMarket, num(r.spreadHome) ? -r.spreadHome : null),
  };
}

// Settled ledger rows → { season, days:[{ date, games, pending, source, summary }] }, newest day first.
// summary[model] = { n, winners, absErr, closest }; a game's "closest" lists every model tied for the
// smallest margin miss (to 0.1 pt, as shown). Each model is scored only on games it forecast.
function seasonResultsByDay(rows) {
  const blank = () => Object.fromEntries(seasonResultModels().map(([k]) => [k, { n: 0, winners: 0, absErr: 0, closest: 0 }]));
  const add = (sum, g) => {
    seasonResultModels().forEach(([k]) => {
      const c = g.calls[k]; if (!c) return;
      const s = sum[k]; s.n++; s.winners += c.correct ? 1 : 0; s.absErr += c.err; s.closest += g.closest.includes(k) ? 1 : 0;
    });
  };
  const season = blank(), byDate = {};
  rows.forEach(r => {
    const day = byDate[r.date] || (byDate[r.date] = { date: r.date, games: [], pending: 0, sources: new Set(), summary: blank() });
    day.sources.add(r.source || 'nb.ai');
    const res = r.result;
    if (!res || typeof res.homeScore !== 'number' || typeof res.awayScore !== 'number') { day.pending++; return; }
    const actual = res.homeScore - res.awayScore;
    const calls = seasonModelCalls(r);
    Object.keys(calls).forEach(k => {
      const c = calls[k]; if (!c) return;
      c.pickHome = c.p != null ? c.p >= 0.5 : c.margin > 0;
      c.correct = c.pickHome === (actual > 0);
      c.err = Math.abs(c.margin - actual);                  // exact, for averages
      c.errShown = Math.round(c.err * 10) / 10;             // as displayed; closest compares these, so equal-looking misses tie
    });
    const best = Math.min(...Object.values(calls).filter(Boolean).map(c => c.errShown));
    const g = { row: r, actual, calls, closest: Object.keys(calls).filter(k => calls[k] && calls[k].errShown === best) };
    day.games.push(g); add(day.summary, g); add(season, g);
  });
  const days = Object.values(byDate).filter(d => d.games.length).sort((a, b) => b.date.localeCompare(a.date))
    .map(d => ({ ...d, source: d.sources.size === 1 ? [...d.sources][0] : 'mixed' }));
  const unsettledDates = Object.values(byDate).filter(d => !d.games.length).map(d => d.date);   // recorded, nothing final yet
  return { season, days, unsettledDates };
}

function renderResultsTab() {
  const { season, days, unsettledDates } = seasonResultsByDay(seasonResultsRows());
  const replay = seasonState.results.mode === 'replay';
  const spec = replay && typeof SEASON_REPLAY !== 'undefined' ? SEASON_REPLAY.spec : null;
  const modeBar = `<div class="res-mode" role="tablist" aria-label="Results source">
      <button role="tab" aria-selected="${!replay}" class="${replay ? '' : 'on'}" onclick="seasonResultsMode('live')">Live ledger</button>
      <button role="tab" aria-selected="${replay}" class="${replay ? 'on' : ''}" onclick="seasonResultsMode('replay')">Replay from opening night</button>
    </div>${replay ? `<p class="res-banner"><b>Replay</b> — predicted after the fact, game by game, from only what was published before each tip-off: 2025-26 team ratings, this season's earlier games, archived opening rosters and dated moves, and the official injury report ${spec ? spec.reportLeadMinutes : 60}+ minutes before tip. Engine frozen at ${spec ? spec.engine : '—'}. Kept apart from the live ledger and its scoring.</p>` : ''}`;
  if (!days.length) return `<div class="results">${modeBar}<div class="home-empty">${replay ? 'No replay rows yet — run <code>node replay-season.js</code>.' : 'No settled games yet. Results appear here the morning after a slate is settled (<code>./season-daily.sh</code>).'}</div></div>`;
  const d = seasonResultsSelected(days);
  const asc = days.map(x => x.date).sort(), i = asc.indexOf(d.date);
  const nGames = days.reduce((n, x) => n + x.games.length, 0);
  const tag = d.source === 'replay' ? '<span class="res-tag replay">Replay</span>' : d.source === 'espn' ? '<span class="res-tag">ESPN fallback · no NB.AI</span>' : d.source === 'mixed' ? '<span class="res-tag">partly ESPN fallback</span>' : '';
  const r = seasonState.results;
  return `<div class="results">
    ${modeBar}
    <div class="res-nav">
      <button class="res-arrow" onclick="seasonResultsStep(-1)"${i > 0 ? '' : ' disabled'} aria-label="Previous day" title="Previous day (←)">‹</button>
      <div class="res-pick">
        <button class="res-datebtn" onclick="seasonResultsToggleCal()" aria-haspopup="dialog" aria-expanded="${r.calOpen}"><span class="res-date">${seasonFmtDay(d.date, true)}</span><span class="res-caret">▾</span></button>
        ${r.calOpen ? seasonResultsCalendar(days, d.date, unsettledDates) : ''}
      </div>
      <button class="res-arrow" onclick="seasonResultsStep(1)"${i < asc.length - 1 ? '' : ' disabled'} aria-label="Next day" title="Next day (→)">›</button>
      <span class="res-meta"><span class="muted">${d.games.length} game${d.games.length === 1 ? '' : 's'}${d.pending ? ` · ${d.pending} unsettled` : ''} · day ${i + 1} of ${asc.length}</span>${tag}</span>
    </div>
    ${seasonResultsDay(d)}
    <section class="res-block res-season">
      <h3 class="res-h">Season to date <span class="muted">${nGames} games · ${days.length} day${days.length === 1 ? '' : 's'}</span></h3>
      ${seasonResultsScoreboard(season)}
      <ul class="res-legend">
        <li><b>Winner</b> ✓/✗: did the side the model gave over 50% win? The % is that side's win probability.</li>
        <li><b>Margin</b>: predicted winning margin; <i>off</i> = points from the final margin. <b>Closest</b> = the model(s) nearest the final; ties all count.</li>
        ${replay ? `<li>Market = DraftKings no-vig moneyline and closing spread — the closing line moved after our report cutoff, so it is the harder benchmark.</li>
        <li><b>Ours + preseason</b> shifts each team's prior by ${spec ? spec.preseasonCoef : 0.099} × its NBA-vs-NBA preseason margin per game (measured on 2016–2026); it fades as this season's games take over.</li>` : `<li>Market = DraftKings no-vig moneyline and closing spread. NB.AI publishes only win probabilities, so its margin (≈) is converted from them with the engine's σ = ${SEASON_MARGIN_SIGMA}.</li>
        <li><b>Ours</b> uses the feed's team ratings (NB.AI's, which already include this season's games); <b>Ours · 2025-26</b> is the same engine on last season's final ratings, recorded from Nov 5 on.</li>
        <li>Each model is scored only on games it forecast; ESPN-fallback days have no NB.AI, so those games are Ours vs Market.</li>`}
      </ul>
    </section>
  </div>`;
}

// The chosen day, or the latest one if none is chosen (or the chosen date has no results).
function seasonResultsSelected(days) { return days.find(x => x.date === seasonState.results.date) || days[0]; }

// dir -1 = the previous day with results, +1 = the next; no-op at either end.
function seasonResultsStep(dir) {
  const { days } = seasonResultsByDay(seasonResultsRows());
  if (!days.length) return;
  const asc = days.map(x => x.date).sort(), j = asc.indexOf(seasonResultsSelected(days).date) + dir;
  if (j >= 0 && j < asc.length) seasonResultsGo(asc[j]);
}

function seasonResultsGo(date) {
  seasonState.results.date = date;
  seasonState.results.calOpen = false;
  seasonWriteHash();
  renderSeasonApp();
}

function seasonResultsToggleCal(open) {
  const r = seasonState.results;
  r.calOpen = open == null ? !r.calOpen : !!open;
  if (r.calOpen) { const { days } = seasonResultsByDay(seasonResultsRows()); r.calMonth = seasonResultsSelected(days).date.slice(0, 7); }
  renderSeasonApp();
}

function seasonResultsMonth(dir) {
  const [y, m] = seasonState.results.calMonth.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + dir, 1));
  seasonState.results.calMonth = d.toISOString().slice(0, 7);
  renderSeasonApp();
}

// Month grid: days with settled games are buttons; everything else is inert.
function seasonResultsCalendar(days, selected, unsettledDates) {
  const month = seasonState.results.calMonth || selected.slice(0, 7);
  const [y, m] = month.split('-').map(Number);
  const byDate = Object.fromEntries(days.map(d => [d.date, d]));
  const unsettled = new Set(unsettledDates || []);
  const months = days.map(d => d.date.slice(0, 7)).sort();
  const lead = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(), len = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [];
  for (let k = 0; k < lead; k++) cells.push('<span></span>');
  for (let day = 1; day <= len; day++) {
    const iso = `${month}-${String(day).padStart(2, '0')}`, d = byDate[iso];
    if (d) cells.push(`<button class="res-cal-day has${iso === selected ? ' sel' : ''}" onclick="seasonResultsGo('${iso}')" title="${d.games.length} game${d.games.length === 1 ? '' : 's'} · Ours ${d.summary.ours.winners}/${d.summary.ours.n}">${day}</button>`);
    else cells.push(`<span class="res-cal-day${unsettled.has(iso) ? ' wait' : ''}"${unsettled.has(iso) ? ' title="Recorded — not settled yet"' : ''}>${day}</span>`);
  }
  const label = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(Date.UTC(y, m - 1, 1)));
  return `<div class="res-cal-backdrop" onclick="seasonResultsToggleCal(false)"></div>
    <div class="res-cal" role="dialog" aria-label="Choose a day">
      <div class="res-cal-head">
        <button class="res-arrow sm" onclick="seasonResultsMonth(-1)"${month > months[0] ? '' : ' disabled'} aria-label="Previous month">‹</button>
        <b>${label}</b>
        <button class="res-arrow sm" onclick="seasonResultsMonth(1)"${month < months[months.length - 1] ? '' : ' disabled'} aria-label="Next month">›</button>
      </div>
      <div class="res-cal-grid">${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => `<span class="res-cal-wd">${w}</span>`).join('')}${cells.join('')}</div>
      <div class="res-cal-foot"><span class="res-cal-key has"></span> results <span class="res-cal-key wait"></span> awaiting results</div>
    </div>`;
}

function seasonResultsScoreboard(sum) {
  const present = seasonResultModels().filter(([k]) => sum[k].n);
  // Compare what is shown: whole-number win %, one-decimal margin miss, share of games closest.
  const pct = k => Math.round(sum[k].winners / sum[k].n * 100);
  const mae = k => (sum[k].absErr / sum[k].n).toFixed(1);
  const share = k => sum[k].closest / sum[k].n;
  const best = (f, pick) => pick(...present.map(([k]) => +f(k)));
  const top = { pct: best(pct, Math.max), mae: best(mae, Math.min), share: best(share, Math.max) };
  const lead = (on, html) => present.length > 1 && on ? `<b class="res-best">${html}</b>` : html;
  return `<table class="res-score">
    <tr><th>Model</th><th>Winners picked</th><th>Avg margin miss</th><th>Closest on margin</th></tr>
    ${seasonResultModels().map(([k, label]) => {
      const s = sum[k];
      if (!s.n) return `<tr class="res-none"><td>${label}</td><td colspan="3">no forecasts</td></tr>`;
      return `<tr><td>${label}</td>
        <td>${lead(pct(k) === top.pct, `${s.winners} of ${s.n}`)} <span class="muted">${pct(k)}%</span></td>
        <td>${lead(+mae(k) === top.mae, `${k === 'nbai' ? '≈' : ''}${mae(k)} pts`)}</td>
        <td>${lead(share(k) === top.share, `${s.closest} of ${s.n}`)} <span class="muted">${Math.round(share(k) * 100)}%</span></td></tr>`;
    }).join('')}
  </table>`;
}

function seasonResultsDay(d) {
  const cols = seasonResultModels().filter(([k]) => d.summary[k].n);   // a model with no forecasts that day gets no column
  return `<section class="res-day">
    ${seasonResultsScoreboard(d.summary)}
    <div class="res-scroll"><table class="res-games">
      <tr><th>Game</th><th>Final</th>${cols.map(([, label]) => `<th>${label}</th>`).join('')}<th>Closest</th></tr>
      ${d.games.map(g => seasonResultsGameRow(g, cols)).join('')}
    </table></div>
  </section>`;
}

function seasonResultsGameRow(g, cols) {
  cols = cols || seasonResultModels();
  const r = g.row, res = r.result;
  const winner = g.actual > 0 ? r.home : r.away;
  const cell = k => {
    const c = g.calls[k];
    if (!c) return `<td class="res-cell res-na" title="${k === 'nbai' && r.source === 'espn' ? 'ESPN fallback slate — no NB.AI forecast' : 'No forecast recorded'}">—</td>`;
    const pick = c.pickHome ? r.home : r.away;
    const pp = c.p == null ? null : (c.pickHome ? c.p : 1 - c.p) * 100;
    const pPick = pp == null ? null : Math.round(pp) === 50 ? pp.toFixed(1) : Math.round(pp);   // a decimal near a coin flip
    const v = Math.abs(c.margin).toFixed(1), lead = c.margin > 0 ? r.home : r.away;
    const margin = v === '0.0' ? 'even' : `${lead === pick ? '' : lead + ' '}by ${c.implied ? '≈' : ''}${v}`;
    return `<td class="res-cell${g.closest.includes(k) ? ' res-closest' : ''}">
      <span class="res-mark ${c.correct ? 'ok' : 'bad'}">${c.correct ? '✓' : '✗'}</span><b>${pick}</b>${pPick != null ? ` <span class="res-pct">${pPick}%</span>` : ''}
      <span class="res-sub">${margin} · off ${c.errShown.toFixed(1)}</span></td>`;
  };
  const names = Object.fromEntries(seasonResultModels());
  return `<tr>
    <td class="res-game"${r.provenance ? ` title="Injury report ${seasonReportLabel(r.provenance.report)} · inputs ${r.provenance.inputsHash}"` : ''}>${r.away} @ ${r.home}${r.provenance ? `<span class="res-sub">report ${seasonReportLabel(r.provenance.report)}</span>` : ''}</td>
    <td class="res-final"><b>${winner} by ${Math.abs(g.actual)}</b><span class="res-sub">${r.away} ${res.awayScore} – ${r.home} ${res.homeScore}</span></td>
    ${cols.map(([k]) => cell(k)).join('')}
    <td class="res-who">${g.closest.map(k => names[k]).join(', ')}</td>
  </tr>`;
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
    ${typeof SEASON_TRUST !== 'undefined' ? renderTrustRules(rows) : ''}
    ${typeof SEASON_PROPS_LEDGER !== 'undefined' ? renderPropsRecord(SEASON_PROPS_LEDGER) : ''}
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

// Frozen trust rules: the live record (judged from SEASON_TRUST.judgedFrom), beside the replay's
// description of the same rules (eve variant — report from before 9 PM ET the evening before —
// against DraftKings' opening line; a development set, shown for context, never as evidence).
function seasonReplayTrustRows() {
  if (typeof SEASON_REPLAY === 'undefined' || !SEASON_REPLAY) return [];
  return SEASON_REPLAY.rows.filter(r => r.open && r.open.mlHome != null && r.open.mlAway != null && r.compsEve && r.pOursEve != null).map(r => ({
    date: r.date, home: r.home, away: r.away, result: r.result, mlHome: r.open.mlHome, mlAway: r.open.mlAway, book: 'DraftKings',
    close: r.mlHome != null && r.mlAway != null ? { mlHome: r.mlHome, mlAway: r.mlAway, book: 'DraftKings' } : null,
    trust: seasonTrustCheck({ pHome: r.pOursEve, margin: r.marginOursEve }, { mlHome: r.open.mlHome, mlAway: r.open.mlAway, spreadHome: r.open.spreadHome }, r.compsEve),
  }));
}
function renderTrustRules(rows) {
  const live = seasonTrustRecord(rows), rep = seasonTrustRecord(seasonReplayTrustRows(), { from: '0000' });
  const cell = (g) => g.n || g.clvN ? `${g.n ? `${g.won}–${g.n - g.won} · ${g.units >= 0 ? '+' : ''}${g.units}u` : '—'}${g.clvN ? ` · line moved our way ${g.toward}/${g.clvN} (avg ${g.move >= 0 ? '+' : ''}${(g.move * 100).toFixed(1)} pp)` : ''}${g.clvSkipped ? ` · ${g.clvSkipped} close from another book skipped` : ''}` : '<span class="muted">none yet</span>';
  const line = (id, label, why, avoid) => `<tr><td><b>${id}</b></td><td>${label}${avoid ? ' <span class="muted">(fade our side)</span>' : ''}<div class="muted">${why}</div></td><td>${cell(live[id])}</td><td class="muted">${cell(rep[id])}</td></tr>`;
  return `<h4 style="margin-top:4px">Trust rules — frozen ${SEASON_TRUST.frozen}, judged from ${SEASON_TRUST.judgedFrom}</h4>
    <p class="muted">A rule fires when the picks engine's win probability beats the probability DraftKings' price implies by ${SEASON_TRUST.minEdge * 100}+ percentage points (pp) and one engine step drives the gap. Live: record at the price when recorded, and whether the line then moved toward our side by the close (same book only). Replay: the same rules on the eve variant — injury report from before 9 PM ET the evening before, results through that morning — against DraftKings' opening line. It is the development set the rules were drafted from (drafted on the tip-time variant, which had later news than the open), so it describes them and proves nothing; DraftKings' opening time is not recorded.</p>
    <table><tr><th>Rule</th><th>When the gap is driven by</th><th>Live</th><th>Replay (description only)</th></tr>
    ${line('ALL', 'Any edge', 'every game with an edge of ' + SEASON_TRUST.minEdge * 100 + '+ pp')}
    ${SEASON_TRUST.rules.map(r => line(r.id, r.label, r.why, r.avoid)).join('')}
    </table>
    ${typeof SEASON_LATE_FLIP !== 'undefined' ? renderLateFlipRule(rows) : ''}`;
}

// The late-injury-flip rule: live from its own judgedFrom; the replay row compares its eve
// variant with its tip-time variant at DraftKings' opening price (description only).
function seasonReplayLateRows() {
  if (typeof SEASON_REPLAY === 'undefined' || !SEASON_REPLAY) return [];
  return SEASON_REPLAY.rows.filter(r => r.pOursEve != null && r.open && r.open.mlHome != null && r.open.mlAway != null).map(r => ({
    date: r.date, home: r.home, away: r.away, result: r.result, mlHome: r.open.mlHome, mlAway: r.open.mlAway, book: 'DraftKings',
    close: r.mlHome != null && r.mlAway != null ? { mlHome: r.mlHome, mlAway: r.mlAway, book: 'DraftKings' } : null,
    late: { flip: (r.pOursEve >= 0.5) !== (r.pOurs >= 0.5), side: r.pOursEve >= 0.5 ? 'home' : 'away' },
  }));
}
// Props ledger (props-ledger.js): calibration of the recorded projections at bettable lines, no prices yet.
function renderPropsRecord(allRows) {
  // One props model at a time: the current version's rows; earlier models are counted, not mixed in.
  const rows = allRows.filter(r => propRowVersion(r) === SEASON_PROP.version), older = allRows.length - rows.length;
  const all = seasonPropsRecord(rows), open = rows.filter(r => !r.result).length;
  const pc = (x) => x == null ? '—' : `${(x * 100).toFixed(0)}%`;
  const at = (c) => c && c.n ? `${pc(c.over)} <span class="muted">vs ${pc(c.expected)} · n=${c.n}</span>` : '—';
  const line = (label, st) => st && st.n ? `<tr><td>${label}</td><td class="num">${st.n}</td><td class="num">${st.mae}</td><td class="num">${st.bias >= 0 ? '+' : ''}${st.bias}</td><td class="num">${at(st.proj)}</td><td class="num">${at(st.p75)}</td><td class="num">${at(st.floor)}</td></tr>` : `<tr><td>${label}</td><td class="num">0</td><td colspan="5" class="muted">nothing settled yet</td></tr>`;
  const tier = (f) => seasonPropsRecord(rows, { filter: f }).stats.pra;
  return `<h4 style="margin-top:14px">Props ledger — pre-tip projections graded from box scores</h4>
    <p class="muted">Every rotation player's projection (${SEASON_PROPS_MIN_MINUTES}+ projected minutes) on the picks engine's slate, recorded with the slate and graded from ESPN box scores. No prop prices yet, so this measures calibration, not edge. Each projection is checked at three half-point lines: the one nearest the projection, the highest the model gives a 75% chance of going over, and the highest it gives 90% — a floor leg's deep alternate line. Each cell is the share that went over <span class="muted">vs the model's average chance at those lines</span>; calibrated when they match. Projections assume the player plays (DraftKings voids a prop when he sits), so players who did not play are counted apart. Players in one game move together (pace, blowouts), so a night or two says little — read it over dozens of games. Model ${SEASON_PROP.version}: ${all.n} settled (${all.games} games, ${all.played} played), ${open} open${older ? ` · ${older} rows from earlier props models not counted` : ''}.</p>
    <table><tr><th>Stat</th><th class="num">n</th><th class="num">MAE</th><th class="num">Bias</th><th class="num">Over the projection line</th><th class="num">Over the 75% line</th><th class="num">Over the 90% floor</th></tr>
      ${SEASON_PROPS_STATS.map(s => line(s === 'tpm' ? '3PM' : s.toUpperCase(), all.stats[s])).join('')}
      ${line('PRA · top 5 minutes', tier(r => r.rank <= 5))}${line('PRA · rest of rotation', tier(r => r.rank > 5))}
    </table>
    <p class="muted">Minutes: MAE ${all.minutes.mae != null ? all.minutes.mae : '—'} · did not play ${pc(all.minutes.dnp)} (listed availability implied ${pc(all.minutes.dnpExpected)}) · played under 70% of projected minutes ${pc(all.minutes.short)}. Bias = actual − projection.</p>`;
}

function renderLateFlipRule(rows) {
  const L = SEASON_LATE_FLIP, rep = seasonReplayLateRows();
  const cell = (g) => `${g.flips} flip${g.flips === 1 ? '' : 's'} in ${g.checked} checked${g.n ? ` · ${g.won}–${g.n - g.won} · ${g.units >= 0 ? '+' : ''}${g.units}u` : ''}${g.clvN ? ` · line moved our way ${g.toward}/${g.clvN} (avg ${g.move >= 0 ? '+' : ''}${(g.move * 100).toFixed(1)} pp)` : ''}`;
  const both = (src, from) => `${cell(seasonLateFlipRecord(src, { from }))}<div class="muted">later side: ${cell(seasonLateFlipRecord(src, { from, side: 'later' })).replace(/^.*? checked( · )?/, '') || '—'}</div>`;
  return `<h4 style="margin-top:14px">${L.label} (${L.id}) — frozen ${L.frozen}, judged from ${L.judgedFrom}</h4>
    <p class="muted">Compares two of our own picks from the replay-tested pipeline, recorded with each row: one from the injury report before 9 PM ET the evening before, one from the latest report at record time. When they pick different winners the rule takes the earlier side, at the price recorded. ${L.why}. Replay: eve variant against the tip-time variant at DraftKings' opening price — the development set the rule was drafted from.</p>
    <table><tr><th>Rule</th><th>Live</th><th>Replay (description only)</th></tr>
    <tr><td><b>${L.id}</b></td><td>${both(rows, L.judgedFrom)}</td><td class="muted">${both(rep, '0000')}</td></tr></table>`;
}

function seasonRecordTonight() {
  const s = seasonState.slate;
  const now = new Date();
  const entries = s.games.filter(g => !g.tip || new Date(g.tip) > now).map(g => {
    const { proj, blend, clean, adj } = seasonGameForecast(g);
    return buildLedgerEntry(g, proj, blend, s, clean, adj);
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
    seasonBoot();
    seasonSetTab('tonight');
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
function seasonFmtDay(iso, long) {
  try { return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: long ? 'long' : 'short', month: 'short', day: 'numeric' }).format(new Date(iso + 'T12:00:00Z')); }
  catch (e) { return iso; }
}
// "Injury-Report_2026-10-20_05_00PM.pdf" → "5:00 PM ET".
function seasonReportLabel(name) { const m = /_(\d{2})_(\d{2})([AP]M)\.pdf$/.exec(name || ''); return m ? `${+m[1]}:${m[2]} ${m[3]} ET` : (name || ''); }
function seasonPct(p) { return p == null ? '—' : (p * 100).toFixed(1) + '%'; }
