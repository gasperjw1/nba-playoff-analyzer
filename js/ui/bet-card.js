// ============================================================
// BET CARD RENDERER (Phase 55 PoC)
// ============================================================
// One function consumes the BETS schema (js/data/bets-data.js)
// and produces the unified card HTML.

const _BET_TYPE_META = {
  ml:     { label: 'ML',     color: 'var(--accent)' },
  spread: { label: 'SPR',    color: 'var(--blue)' },
  total:  { label: 'TOT',    color: 'var(--purple)' },
  prop:   { label: 'PROP',   color: 'var(--yellow)' },
  parlay: { label: 'PARLAY', color: 'var(--red)' },
};

const _CONFIDENCE_META = {
  'best-bet':  { label: 'BEST BET',  star: true,  badge: 'rgba(61,214,140,0.18)', text: 'var(--green)' },
  'high':      { label: 'HIGH CONF', star: true,  badge: 'rgba(61,214,140,0.12)', text: 'var(--green)' },
  'medium':    { label: 'MEDIUM',    star: false, badge: 'rgba(96,165,250,0.12)', text: 'var(--accent)' },
  'lean':      { label: 'LEAN',      star: false, badge: 'rgba(245,158,11,0.12)', text: 'var(--yellow)' },
  'coin-flip': { label: 'COIN FLIP', star: false, badge: 'rgba(245,158,11,0.15)', text: 'var(--yellow)' },
};

const _THESIS_META = {
  model:       { label: 'Model',       icon: '⚙' },
  matchup:     { label: 'Matchup',     icon: '◇' },
  regression:  { label: 'Regression',  icon: '↻' },
  historical:  { label: 'Historical',  icon: '☷' },
  situational: { label: 'Situational', icon: '⚑' },
  market:      { label: 'Market',      icon: '$' },
};

const _NARRATIVE_META = {
  'bounce-back': { label: 'Bounce-back', color: 'var(--accent)' },
  'desperation': { label: 'Desperation', color: 'var(--red)' },
  'rest-edge':   { label: 'Rest edge',   color: 'var(--green)' },
};

// Resolve `${dml('NYK-PHI', 2)}` etc. — caller passes a `dynamics` map
// of { fnName: function } so the renderer doesn't need to know about bets.js internals.
function _resolveModelHook(hook, dynamics) {
  if (!hook || !dynamics || !dynamics[hook.fn]) return null;
  try { return dynamics[hook.fn](...(hook.args || [])); } catch(e) { return null; }
}

// Replace {{winner}} / {{margin}} placeholders in reasoning text.
function _interpolate(text, series, game, dynamics) {
  if (!text) return '';
  return text
    .replace(/\{\{winner\}\}/g, dynamics?.dwinner ? dynamics.dwinner(series, game) : '?')
    .replace(/\{\{margin\}\}/g, dynamics?.dmargin ? dynamics.dmargin(series, game) : '?');
}

function _renderCHSPill(chs) {
  if (!chs) return '';
  const tone = chs.tone || (typeof chs.delta === 'number' && chs.delta > 0 ? 'boost' : 'caution');
  const color = tone === 'boost' ? 'var(--green)' : tone === 'mixed' ? 'var(--yellow)' : 'var(--red)';
  let valueStr;
  if (typeof chs.delta === 'number') {
    const sign = chs.delta > 0 ? '+' : '';
    valueStr = `${sign}${chs.delta}pts`;
  } else {
    valueStr = chs.detail ? `${chs.delta} (${chs.detail})` : String(chs.delta);
  }
  return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:10px;background:rgba(167,139,250,0.12);color:${color};font-size:10px;font-weight:600;border:1px solid rgba(167,139,250,0.25)" title="Compound Historical Scenarios delta">CHS ${valueStr}</span>`;
}

function _renderTypeBadge(type, confidenceMeta) {
  const tm = _BET_TYPE_META[type] || { label: type.toUpperCase(), color: 'var(--text-dim)' };
  const star = confidenceMeta.star ? ' ★' : '';
  return `<span class="bet-type" style="color:${tm.color};font-weight:700;font-size:10px;letter-spacing:0.5px">${tm.label}${star} ${confidenceMeta.label}</span>`;
}

function _renderTheses(theses) {
  if (!theses || theses.length === 0) return '';
  return theses.map(t => {
    const m = _THESIS_META[t];
    if (!m) return '';
    return `<span style="font-size:10px;color:var(--text-dim);padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.04)" title="${m.label} thesis">${m.icon} ${m.label}</span>`;
  }).join(' ');
}

function _renderNarrative(narrative) {
  if (!narrative) return '';
  const m = _NARRATIVE_META[narrative];
  if (!m) return '';
  return `<span style="font-size:10px;color:${m.color};font-weight:600;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.04)">${m.label}</span>`;
}

// Phase 68: render the edge-detector verdict pill. Pulls historical
// (cross-tab) classification from edge-detector.js. Renders nothing if
// the module isn't loaded (graceful degradation in unit tests).
function _renderEdgePill(bet) {
  if (typeof classifyBet !== 'function') return '';
  if (!bet || bet.result) return '';   // settled bets don't need a forward-looking pill
  const c = classifyBet(bet);
  if (!c || !c.recommendation || c.recommendation === 'INSUFFICIENT') return '';
  const palette = {
    PLACE:   { color: 'var(--green)',  bg: 'rgba(61,214,140,0.12)',  label: 'PLACE',   icon: '✓' },
    CAUTION: { color: 'var(--yellow)', bg: 'rgba(255,209,102,0.12)', label: 'CAUTION', icon: '⚠' },
    SKIP:    { color: 'var(--red)',    bg: 'rgba(255,107,107,0.12)', label: 'SKIP',    icon: '✗' },
  };
  const p = palette[c.recommendation] || palette.CAUTION;
  const tooltip = `Empirical: ${c.explain}`.replace(/"/g, '&quot;');
  return `<span title="${tooltip}" style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:10px;background:${p.bg};color:${p.color};font-size:10px;font-weight:700;border:1px solid ${p.color}33">${p.icon} ${p.label}</span>`;
}

function _renderResult(result) {
  if (!result) return '';
  const palette = {
    win:  { color:'var(--green)',    icon:'✓' },
    loss: { color:'var(--red)',      icon:'✗' },
    push: { color:'var(--text-dim)', icon:'—' },
    void: { color:'var(--yellow)',   icon:'⊘' },
  };
  const p = palette[result.outcome] || { color:'var(--text-dim)', icon:'—' };
  const pl = typeof result.pl === 'number' ? ` (${result.pl >= 0 ? '+' : ''}$${result.pl})` : '';
  return `<span style="color:${p.color};font-weight:700;margin-left:6px">${p.icon} ${result.actual || ''}${pl}</span>`;
}

// Main render function — pure data → HTML, no globals beyond _BET_*.
function renderBetCard(bet, dynamics) {
  const cm = _CONFIDENCE_META[bet.confidence] || _CONFIDENCE_META['medium'];
  const cardClass = bet.confidence === 'best-bet' || bet.confidence === 'high' ? 'bet-card best-bet' : 'bet-card';

  const modelLine = _resolveModelHook(bet.modelHook, dynamics);
  const factsHtml = (bet.facts || []).map(f =>
    `<span style="color:var(--text-dim)"><span style="color:var(--text)">${f.value}</span><span style="font-size:10px;margin-left:3px;opacity:0.7">${f.label}</span></span>`
  ).join('<span style="color:#444;margin:0 6px">·</span>');

  const factsRow = [
    `<span style="color:var(--text);font-weight:600">${bet.odds}</span>`,
    factsHtml,
    modelLine ? `<span style="color:var(--accent);font-size:10px">${modelLine}</span>` : '',
    bet.chs ? _renderCHSPill(bet.chs) : '',
  ].filter(Boolean).join('<span style="color:#444;margin:0 6px">·</span>');

  const reasoning = _interpolate(bet.reasoning, bet.series, bet.game, dynamics);

  const edgePill = _renderEdgePill(bet);
  return `<div class="${cardClass}" data-bet-id="${bet.id}">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;flex-wrap:wrap">
      ${_renderTypeBadge(bet.type, cm)}
      <div style="display:flex;gap:4px;align-items:center">${edgePill}${_renderTheses(bet.thesis)} ${_renderNarrative(bet.narrative)}</div>
    </div>
    <div class="bet-pick">${bet.pick}${_renderResult(bet.result)}</div>
    <div class="bet-line" style="display:flex;align-items:center;flex-wrap:wrap;gap:2px">${factsRow}</div>
    <div class="bet-reasoning">${reasoning}</div>
  </div>`;
}

// Render all bets for a slate+series, with header.
function renderBetSlateSeries(slateId, seriesId, dynamics) {
  if (typeof BETS === 'undefined') return '';
  const slate = (typeof BET_SLATES !== 'undefined') ? BET_SLATES[slateId] : null;
  const game = slate && slate.games.find(g => g.series === seriesId);
  const bets = BETS.filter(b => b.slate === slateId && b.series === seriesId);
  if (bets.length === 0) return '';

  const headerColor = 'var(--green)';
  const header = game ? `
    <h4 style="color:${headerColor};margin:0 0 12px;font-size:15px;border-bottom:1px solid ${headerColor};padding-bottom:6px">
      ${seriesId} &mdash; ${game.when} | ${game.context}
    </h4>
    ${game.recap ? `<div style="background:rgba(61,214,140,0.06);border:1px solid rgba(61,214,140,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:var(--text-dim)">${game.recap}</div>` : ''}
  ` : '';

  return `<div class="bet-section">
    ${header}
    ${bets.map(b => renderBetCard(b, dynamics)).join('')}
  </div>`;
}
