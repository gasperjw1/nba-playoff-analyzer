// ============================================================
// REUSABLE UI COMPONENTS
// ============================================================

function renderScenarioBuilder(s) {
  // Baseline: use the default ratings (injury OUT players have rating=0 already)
  const baseProb = calcWinProb(s);
  // Scenario: use toggle state
  const scenProb = calcWinProb(s, s.id);
  const homeBasePct = baseProb.home;
  const awayBasePct = baseProb.away;
  const homeScenPct = scenProb.home;
  const awayScenPct = scenProb.away;
  const homeDelta = homeScenPct - homeBasePct;
  const awayDelta = awayScenPct - awayBasePct;

  // Collect toggled-out players that differ from baseline
  const chips = [];
  const allPlayers = [...s.homeTeam.players, ...s.awayTeam.players];
  allPlayers.forEach(p => {
    const state = scenarioState[s.id][p.name];
    const isBaselineOut = (p.injury && p.injury.includes('OUT'));
    const teamAbbr = s.homeTeam.players.includes(p) ? s.homeTeam.abbr : s.awayTeam.abbr;
    if (state === 'out' && !isBaselineOut) {
      chips.push({ name: p.name, team: teamAbbr, type: 'out', label: 'Toggled OUT' });
    } else if (state === 'in' && isBaselineOut) {
      chips.push({ name: p.name, team: teamAbbr, type: 'in', label: 'Toggled IN' });
    } else if (state === 'out' && isBaselineOut) {
      // baseline out, still out - no chip needed
    } else if (p.injury && p.injury.includes('GTD')) {
      chips.push({ name: p.name, team: teamAbbr, type: 'gtd', label: 'GTD' });
    }
  });

  const homeColor = s.homeTeam.color;
  const awayColor = s.awayTeam.color;
  const deltaColor = homeDelta > 0 ? 'var(--green)' : homeDelta < 0 ? 'var(--red)' : 'var(--text-dim)';
  const deltaSign = homeDelta > 0 ? '+' : '';

  return `<div class="scenario-builder">
    <div class="scenario-title">Scenario Builder</div>
    <div class="scenario-subtitle">Toggle players IN/OUT in the roster tables below to see how win probabilities change in real-time</div>
    <div class="scenario-comparison">
      <div class="scenario-col">
        <div class="team-name" style="color:${s.homeTeam.color2}">${s.homeTeam.name}</div>
        <div class="label">Win Probability</div>
        <div class="prob" style="color:${homeScenPct>=50?'var(--green)':'var(--red)'}">${homeScenPct}%</div>
        <div class="spread">Rating: ${scenProb.homeRating}</div>
        ${homeDelta !== 0 ? `<div class="spread" style="color:${homeDelta>0?'var(--green)':'var(--red)'}">( ${homeDelta>0?'+':''}${homeDelta}% from baseline )</div>` : '<div class="spread" style="color:var(--text-dim)">( baseline )</div>'}
      </div>
      <div class="scenario-vs">VS</div>
      <div class="scenario-col">
        <div class="team-name" style="color:${s.awayTeam.color2}">${s.awayTeam.name}</div>
        <div class="label">Win Probability</div>
        <div class="prob" style="color:${awayScenPct>=50?'var(--green)':'var(--red)'}">${awayScenPct}%</div>
        <div class="spread">Rating: ${scenProb.awayRating}</div>
        ${awayDelta !== 0 ? `<div class="spread" style="color:${awayDelta>0?'var(--green)':'var(--red)'}">( ${awayDelta>0?'+':''}${awayDelta}% from baseline )</div>` : '<div class="spread" style="color:var(--text-dim)">( baseline )</div>'}
      </div>
    </div>
    ${chips.length ? `<div class="scenario-delta">
      <div class="delta-label">Player Status Changes</div>
      <div class="delta-items">
        ${chips.map(c => `<span class="delta-chip ${c.type}">${c.team} ${c.name} — ${c.label}</span>`).join('')}
      </div>
    </div>` : ''}
  </div>`;
}


function renderBacktestPanel(s) {
  const round = s.round || 'R1';
  const hcaVal = HCA_BY_ROUND[round] || 2.5;
  const bbProb = calcBounceBackProb(s);
  const homeSys = s.homeTeam.systemBonus || 0;
  const awaySys = s.awayTeam.systemBonus || 0;
  const homePed = s.homeTeam.playoffPedigree || 0;
  const awayPed = s.awayTeam.playoffPedigree || 0;

  // Count star ceiling and injury risk players
  const homeStars = s.homeTeam.players.filter(p => p.starCeiling && p.starCeiling >= 1 && p.rating > 0);
  const awayStars = s.awayTeam.players.filter(p => p.starCeiling && p.starCeiling >= 1 && p.rating > 0);
  const injuryRisks = [...s.homeTeam.players, ...s.awayTeam.players].filter(p => p.injuryRisk && p.injuryRisk > 0);

  return `<div class="backtest-panel">
    <div class="backtest-title">&#128202; Backtest-Calibrated Model <span class="backtest-accuracy">2025 Backtest: 73.5% → 7 lessons applied</span></div>
    <div class="backtest-subtitle">Model calibrated against 49 games across the entire 2025 NBA Playoffs (R1 through Finals)</div>
    <div class="backtest-stats">
      <div class="backtest-stat"><div class="bs-val" style="color:var(--purple)">${round}</div><div class="bs-label">Round</div></div>
      <div class="backtest-stat"><div class="bs-val" style="color:var(--accent)">±${hcaVal.toFixed(1)}</div><div class="bs-label">HCA (round-adj)</div></div>
      <div class="backtest-stat"><div class="bs-val" style="color:var(--yellow)">${Math.round(bbProb*100)}%</div><div class="bs-label">Bounce-back prob</div></div>
      <div class="backtest-stat"><div class="bs-val" style="color:${homeSys>=1?'var(--green)':'var(--text-dim)'}">${homeSys>0?'+':''}${homeSys}</div><div class="bs-label">${s.homeTeam.abbr} System</div></div>
      <div class="backtest-stat"><div class="bs-val" style="color:${awaySys>=1?'var(--green)':'var(--text-dim)'}">${awaySys>0?'+':''}${awaySys}</div><div class="bs-label">${s.awayTeam.abbr} System</div></div>
      <div class="backtest-stat"><div class="bs-val" style="color:${homePed>=2?'var(--green)':homePed>=1?'var(--yellow)':'var(--text-dim)'}">${homePed}</div><div class="bs-label">${s.homeTeam.abbr} Pedigree</div></div>
      <div class="backtest-stat"><div class="bs-val" style="color:${awayPed>=2?'var(--green)':awayPed>=1?'var(--yellow)':'var(--text-dim)'}">${awayPed}</div><div class="bs-label">${s.awayTeam.abbr} Pedigree</div></div>
    </div>
    <div class="model-factors">
      <div class="model-factor-chip">HCA: R1=${HCA_BY_ROUND.R1} → Finals=${HCA_BY_ROUND.Finals}</div>
      <div class="model-factor-chip">G7 Override: +${HCA_GAME7_OVERRIDE}</div>
      ${homeStars.length > 0 ? `<div class="model-factor-chip">${s.homeTeam.abbr} Ceiling Stars: ${homeStars.map(p=>p.name.split(' ').pop()).join(', ')}</div>` : ''}
      ${awayStars.length > 0 ? `<div class="model-factor-chip">${s.awayTeam.abbr} Ceiling Stars: ${awayStars.map(p=>p.name.split(' ').pop()).join(', ')}</div>` : ''}
      ${injuryRisks.length > 0 ? `<div class="model-factor-chip" style="border-color:rgba(255,79,94,0.3);color:var(--red);background:rgba(255,79,94,0.1)">Injury Watch: ${injuryRisks.map(p=>p.name.split(' ').pop()+' ('+p.injuryRisk+')').join(', ')}</div>` : ''}
    </div>
  </div>`;
}


function renderStatBar(label, value, min, max, color) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const valColor = value > (max+min)/2 ? color : (value > min + (max-min)*0.3 ? 'var(--yellow)' : 'var(--red)');
  return `<div class="stat-bar-container"><span class="stat-bar-label">${label}</span><div class="stat-bar"><div class="stat-bar-fill" style="width:${pct}%;background:${color}"></div></div><span class="stat-bar-val" style="color:${valColor}">${typeof value==='number'?value.toFixed(1):value}</span></div>`;
}


function renderPlayerViz(team, series) {
  const active = team.players.filter(p => p.rating > 0).slice(0, 8);
  return active.map(p => {
    return `<div class="player-viz-card">
      <div class="pv-name"><span class="pv-rating ${getRatingClass(p.rating)}" style="display:inline-block">${p.rating}</span>${p.name}<span class="pos-badge">${p.pos}</span>${p.offRole ? '<span style="font-size:9px;color:var(--text-dim);margin-left:auto">'+p.offRole+'</span>':''}</div>
      ${renderStatBar('LEBRON', p.lebron||0, -3, 5, 'var(--accent)')}
      ${renderStatBar('O-LEB', p.oLebron||0, -3, 4, 'var(--green)')}
      ${renderStatBar('D-LEB', p.dLebron||0, -2, 2, 'var(--purple)')}
      ${renderStatBar('WAR', p.war||0, -1, 12, 'var(--yellow)')}
      ${renderStatBar('VORP', p.vorp||0, -1, 8, 'var(--accent2)')}
      ${renderStatBar('EPM', p.epm||0, -3, 10, 'var(--accent)')}
    </div>`;
  }).join('');
}


function renderFatigueMonitor(series) {
  const homeFatigue = calcTeamFatigue(series.homeTeam, series, series.id);
  const awayFatigue = calcTeamFatigue(series.awayTeam, series, series.id);
  
  function fatigueColor(v) { return v >= 0.3 ? 'var(--red)' : v >= 0.15 ? 'var(--yellow)' : v >= 0.05 ? 'var(--accent)' : 'var(--green)'; }
  
  function renderTeamFatigue(team, fatData) {
    const idxColor = fatigueColor(fatData.index);
    return `<div class="fatigue-team-card">
      <div class="fatigue-team-name">
        <span style="width:4px;height:14px;border-radius:2px;background:${team.color};display:inline-block"></span>
        ${team.name}
        <span class="fatigue-team-index" style="background:${idxColor}20;color:${idxColor};margin-left:auto">${(fatData.index*100).toFixed(0)}%</span>
      </div>
      ${fatData.players.slice(0, 8).map(pf => {
        const p = team.players.find(x => x.name === pf.name);
        const barPct = Math.min(100, pf.fatigue * 200);
        const fc = fatigueColor(pf.fatigue);
        // Determine fatigue tags
        let tags = '';
        if (p && p.age && p.age >= 33) tags += '<span class="fatigue-tag age">AGE '+p.age+'</span>';
        if (p && p.activeInjury) tags += '<span class="fatigue-tag injury" title="'+((p.activeInjury.note||'').replace(/"/g,'&quot;'))+'">🩹 '+p.activeInjury.type+' ('+p.activeInjury.severity+')</span>';
        else if (p && p.injuryRisk && p.injuryRisk > 0) tags += '<span class="fatigue-tag injury">INJ '+p.injuryRisk+'</span>';
        if (p && (p.offRole === 'Primary Ball Handler' || p.offRole === 'Shot Creator')) tags += '<span class="fatigue-tag role">'+p.offRole.split(' ')[0]+'</span>';
        if (p && p.usg && p.usg > 27) tags += '<span class="fatigue-tag minutes">USG '+p.usg+'%</span>';
        return `<div class="fatigue-player-row">
          <span class="fatigue-player-name">${pf.name.split(' ').pop()}</span>
          <div class="fatigue-bar"><div class="fatigue-bar-fill" style="width:${barPct}%;background:${fc}"></div></div>
          <span class="fatigue-val" style="color:${fc}">${(pf.fatigue*100).toFixed(0)}%</span>
          <div class="fatigue-tags">${tags}</div>
        </div>`;
      }).join('')}
    </div>`;
  }
  
  return `<div class="fatigue-monitor">
    <div class="fatigue-title">Fatigue & Injury Monitor <span class="fatigue-badge">MEDIUM CONFIDENCE</span></div>
    <div class="fatigue-subtitle">Cumulative physical + mental fatigue estimate. Age 33+, high minutes, injury history, and role load compound across series.</div>
    <div class="fatigue-grid">
      ${renderTeamFatigue(series.homeTeam, homeFatigue)}
      ${renderTeamFatigue(series.awayTeam, awayFatigue)}
    </div>
  </div>`;
}


function renderMarginProfile(s) {
  // Calculate projections for G1 and G2 (and any future games)
  const g1Proj = calcGameProjection(s, s.id, 1);
  const g2Proj = calcGameProjection(s, s.id, 2);

  function marginDot(proj, label) {
    const x = Math.min(95, Math.max(5, (proj.absMargin / 30) * 100));
    const dotColor = proj.absMargin >= 18 ? 'var(--red)' : proj.absMargin >= 12 ? 'var(--yellow)' : proj.absMargin >= 7 ? 'var(--accent)' : 'var(--green)';
    const charClass = proj.character === 'BLOWOUT RISK' ? 'blowout' : proj.character === 'SEPARATION' ? 'separation' : proj.character === 'COMPETITIVE' ? 'competitive' : proj.character === 'GRIND' ? 'grind' : 'coinflip';
    return `<div style="display:flex;align-items:center;gap:10px;margin:8px 0">
      <span style="font-size:11px;font-weight:700;min-width:28px;color:var(--text-dim)">${label}</span>
      <div style="flex:1;position:relative;height:20px">
        <div style="position:absolute;top:9px;left:0;right:0;height:2px;background:var(--border);border-radius:1px"></div>
        <div style="position:absolute;left:${x}%;top:2px;transform:translateX(-50%)">
          <div style="width:16px;height:16px;border-radius:50%;background:${dotColor};border:2px solid var(--bg);box-shadow:0 0 6px ${dotColor}"></div>
        </div>
        <div style="position:absolute;top:-1px;left:0;font-size:8px;color:var(--text-dim)">0</div>
        <div style="position:absolute;top:-1px;left:33%;font-size:8px;color:var(--text-dim)">10</div>
        <div style="position:absolute;top:-1px;left:66%;font-size:8px;color:var(--text-dim)">20</div>
        <div style="position:absolute;top:-1px;right:0;font-size:8px;color:var(--text-dim)">30+</div>
      </div>
      <span style="font-size:11px;font-weight:700;min-width:70px">${proj.favTeam} +${proj.absMargin}</span>
      <span class="game-character ${charClass}" style="font-size:8px;padding:2px 6px">${proj.character}</span>
    </div>`;
  }

  return `<div style="background:var(--card);border-radius:12px;padding:16px;border:1px solid var(--border);margin-top:16px">
    <div style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--accent)">Series Margin Profile</div>
    <div style="font-size:10px;color:var(--text-dim);margin-bottom:12px">Dynamic margin projections — talent gap, depth, injuries, coaching adjustments, and pace</div>
    ${marginDot(g1Proj, 'G1')}
    ${marginDot(g2Proj, 'G2')}
    ${(s.games[1] && s.games[1].winner) ? marginDot(calcGameProjection(s, s.id, 3), 'G3') : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px;font-size:10px;text-align:center">
      <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px">
        <div style="color:var(--text-dim)">Talent Gap</div>
        <div style="font-weight:700;font-size:14px;margin-top:2px;color:${g1Proj.talentMultiplier>1.2?'var(--red)':g1Proj.talentMultiplier>1.05?'var(--yellow)':'var(--green)'}">${g1Proj.talentMultiplier}x</div>
      </div>
      <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px">
        <div style="color:var(--text-dim)">Blowout Risk</div>
        <div style="font-weight:700;font-size:14px;margin-top:2px;color:${g1Proj.blowoutProb>25?'var(--red)':g1Proj.blowoutProb>15?'var(--yellow)':'var(--green)'}">${g1Proj.blowoutProb}%</div>
      </div>
      <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px">
        <div style="color:var(--text-dim)">Close Game</div>
        <div style="font-weight:700;font-size:14px;margin-top:2px;color:${g1Proj.closeProb>35?'var(--green)':g1Proj.closeProb>20?'var(--yellow)':'var(--text-dim)'}">${g1Proj.closeProb}%</div>
      </div>
    </div>
  </div>`;
}


// ============================================================
// BOX SCORE RENDERING
// ============================================================

function renderBoxScore(series, gameIdx) {
  const game = series.games[gameIdx];
  if (!game || !game.boxScores) return '';

  const bs = game.boxScores;

  function pctStr(m, a) { return a > 0 ? (m/a*100).toFixed(1) + '%' : '-'; }

  function renderTeamBoxTable(players, team) {
    // Calculate team totals
    const totals = players.reduce((t, p) => {
      t.min += p.min; t.pts += p.pts; t.reb += p.reb; t.ast += p.ast;
      t.stl += p.stl; t.blk += p.blk; t.fgm += p.fgm; t.fga += p.fga;
      t.tpm += p.tpm; t.tpa += p.tpa; t.ftm += p.ftm; t.fta += p.fta;
      t.to += p.to; return t;
    }, {min:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0});

    return `<div class="box-team-section">
      <div class="box-team-name"><span style="width:4px;height:14px;border-radius:2px;background:${team.color};display:inline-block"></span>${team.city} ${team.name}</div>
      <div style="overflow-x:auto"><table class="box-table">
        <tr><th>Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG</th><th>3PT</th><th>FT</th><th>TO</th></tr>
        ${players.map(p => {
          const ptsColor = p.pts >= 25 ? 'var(--green)' : p.pts >= 15 ? 'var(--accent)' : 'var(--text)';
          return `<tr>
            <td class="box-player-name">${p.name}</td>
            <td>${p.min}</td>
            <td style="font-weight:700;color:${ptsColor}">${p.pts}</td>
            <td>${p.reb}</td><td>${p.ast}</td><td>${p.stl}</td><td>${p.blk}</td>
            <td>${p.fgm}-${p.fga} <span class="box-pct">${pctStr(p.fgm,p.fga)}</span></td>
            <td>${p.tpm}-${p.tpa} <span class="box-pct">${pctStr(p.tpm,p.tpa)}</span></td>
            <td>${p.ftm}-${p.fta}</td>
            <td>${p.to}</td>
          </tr>`;
        }).join('')}
        <tr class="box-totals-row">
          <td style="font-weight:700">TOTALS</td>
          <td>${totals.min}</td>
          <td style="font-weight:700">${totals.pts}</td>
          <td>${totals.reb}</td><td>${totals.ast}</td><td>${totals.stl}</td><td>${totals.blk}</td>
          <td>${totals.fgm}-${totals.fga} <span class="box-pct">${pctStr(totals.fgm,totals.fga)}</span></td>
          <td>${totals.tpm}-${totals.tpa} <span class="box-pct">${pctStr(totals.tpm,totals.tpa)}</span></td>
          <td>${totals.ftm}-${totals.fta}</td>
          <td>${totals.to}</td>
        </tr>
      </table></div>
    </div>`;
  }

  return `<div class="box-score-section">
    <div class="box-score-title">Game ${gameIdx+1} Box Score</div>
    ${renderTeamBoxTable(bs.home, series.homeTeam)}
    ${renderTeamBoxTable(bs.away, series.awayTeam)}
  </div>`;
}


// ============================================================
// ADVANCED STATS: ACTUAL vs EXPECTED COMPARISON (Multi-Factor)
// ============================================================

function renderAdvancedComparison(series, gameIdx) {
  const game = series.games[gameIdx];
  if (!game || !game.boxScores) return '';
  const bs = game.boxScores;

  function findPlayerData(name, team) {
    return team.players.find(p => p.name === name);
  }

  function diffCell(diff) {
    const color = diff > 3 ? 'var(--green)' : diff > 0 ? 'var(--accent)' : diff > -3 ? 'var(--yellow)' : 'var(--red)';
    const sign = diff > 0 ? '+' : '';
    return `<span style="color:${color};font-weight:700">${sign}${diff.toFixed(1)}</span>`;
  }

  function renderModifierPills(mods) {
    if (!mods.length) return '';
    // Show top 3 modifiers by absolute PTS impact
    const sorted = [...mods].sort((a, b) => Math.abs(b.ptsDelta) - Math.abs(a.ptsDelta)).slice(0, 3);
    return sorted.map(m => {
      const sign = m.pct > 0 ? '+' : '';
      const color = m.pct > 0 ? 'rgba(61,214,140,0.15)' : 'rgba(255,79,94,0.15)';
      const textColor = m.pct > 0 ? 'var(--green)' : 'var(--red)';
      return `<span class="exp-modifier-pill" style="background:${color};color:${textColor}">${m.label} ${sign}${m.pct}%</span>`;
    }).join('');
  }

  function renderTeamComparison(boxPlayers, team, side) {
    const rows = boxPlayers.filter(bp => bp.min >= 10).map(bp => {
      const pd = findPlayerData(bp.name, team);
      if (!pd) return null;

      // Use the full multi-factor projection engine
      const exp = calcExpectedPlayerStats(pd, series, gameIdx, side);

      const ptsDiff = bp.pts - exp.pts;
      const rebDiff = bp.reb - exp.reb;
      const astDiff = bp.ast - exp.ast;

      return `<tr>
        <td class="box-player-name">${bp.name}</td>
        <td>${bp.pts}</td><td style="color:var(--text-dim)">${exp.pts}</td><td>${diffCell(ptsDiff)}</td>
        <td>${bp.reb}</td><td style="color:var(--text-dim)">${exp.reb}</td><td>${diffCell(rebDiff)}</td>
        <td>${bp.ast}</td><td style="color:var(--text-dim)">${exp.ast}</td><td>${diffCell(astDiff)}</td>
        <td class="exp-modifiers-cell">${renderModifierPills(exp.modifiers)}</td>
      </tr>`;
    }).filter(Boolean);

    if (!rows.length) return '';

    return `<div class="adv-comp-team">
      <div class="box-team-name"><span style="width:4px;height:14px;border-radius:2px;background:${team.color};display:inline-block"></span>${team.name} — Actual vs Expected</div>
      <div style="overflow-x:auto"><table class="box-table adv-comp-table">
        <tr><th>Player</th><th colspan="3">PTS (Act / Exp / Diff)</th><th colspan="3">REB (Act / Exp / Diff)</th><th colspan="3">AST (Act / Exp / Diff)</th><th>Key Modifiers</th></tr>
        ${rows.join('')}
      </table></div>
    </div>`;
  }

  return `<div class="adv-comp-section">
    <div class="adv-comp-title">Performance vs Expectations</div>
    <div class="adv-comp-subtitle">Multi-factor projection: reg season avg + playoff ascension, pace adjustment (Cabarkapa), fatigue model, opponent D quality, defensive matchup suppression, coaching role changes, home court, lineup chemistry, on/off impact, and external factors</div>
    ${renderTeamComparison(bs.home, series.homeTeam, 'home')}
    ${renderTeamComparison(bs.away, series.awayTeam, 'away')}
  </div>`;
}


// ============================================================
// SERIES AVERAGES (for Player Stats tab)
// ============================================================

function renderSeriesAverages(series, side) {
  // Collect all completed games with box scores
  const gamesWithBS = series.games.filter(g => g.winner && g.boxScores);
  if (!gamesWithBS.length) return '';
  const numGames = gamesWithBS.length;

  // Show only the selected team (side = 'home' or 'away')
  const team = side === 'home' ? series.homeTeam : series.awayTeam;

  // Aggregate player stats across all box-scored games
  const playerMap = {};
  gamesWithBS.forEach(g => {
    const players = g.boxScores[side];
    if (!players) return;
    players.forEach(p => {
      if (!playerMap[p.name]) playerMap[p.name] = {name:p.name,gp:0,min:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,to:0};
      const a = playerMap[p.name];
      a.gp++; a.min+=p.min; a.pts+=p.pts; a.reb+=p.reb; a.ast+=p.ast;
      a.stl+=p.stl; a.blk+=p.blk; a.fgm+=p.fgm; a.fga+=p.fga;
      a.tpm+=p.tpm; a.tpa+=p.tpa; a.ftm+=p.ftm; a.fta+=p.fta; a.to+=p.to;
    });
  });

  const averaged = Object.values(playerMap).map(a => {
    const gp = a.gp;
    return {
      name:a.name, gp,
      min:(a.min/gp).toFixed(1), pts:(a.pts/gp).toFixed(1), reb:(a.reb/gp).toFixed(1),
      ast:(a.ast/gp).toFixed(1), stl:(a.stl/gp).toFixed(1), blk:(a.blk/gp).toFixed(1),
      fgm:(a.fgm/gp).toFixed(1), fga:(a.fga/gp).toFixed(1),
      tpm:(a.tpm/gp).toFixed(1), tpa:(a.tpa/gp).toFixed(1),
      ftm:(a.ftm/gp).toFixed(1), fta:(a.fta/gp).toFixed(1),
      to:(a.to/gp).toFixed(1),
      fgPct: a.fga > 0 ? (a.fgm/a.fga*100).toFixed(1) : '-',
      tpPct: a.tpa > 0 ? (a.tpm/a.tpa*100).toFixed(1) : '-'
    };
  }).sort((a,b) => parseFloat(b.pts) - parseFloat(a.pts));

  if (!averaged.length) return '';

  return `<div class="series-avg-section">
    <div class="box-score-title">${team.name} — Series Box Score Averages (${numGames} game${numGames>1?'s':''})</div>
    <div style="overflow-x:auto"><table class="box-table">
      <tr><th>Player</th><th>GP</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG</th><th>FG%</th><th>3PT</th><th>3P%</th><th>FT</th><th>TO</th></tr>
      ${averaged.map(p => {
        const ptsColor = parseFloat(p.pts) >= 25 ? 'var(--green)' : parseFloat(p.pts) >= 15 ? 'var(--accent)' : 'var(--text)';
        return `<tr>
          <td class="box-player-name">${p.name}</td>
          <td>${p.gp}</td><td>${p.min}</td>
          <td style="font-weight:700;color:${ptsColor}">${p.pts}</td>
          <td>${p.reb}</td><td>${p.ast}</td><td>${p.stl}</td><td>${p.blk}</td>
          <td>${p.fgm}-${p.fga}</td><td>${p.fgPct}%</td>
          <td>${p.tpm}-${p.tpa}</td><td>${p.tpPct}%</td>
          <td>${p.ftm}-${p.fta}</td><td>${p.to}</td>
        </tr>`;
      }).join('')}
    </table></div>
  </div>`;
}


// ============================================================
// PROJECTED BOX SCORE (for upcoming games)
// ============================================================

function renderProjectedBoxScore(series, gameIdx) {
  // Only render for games that haven't been played yet
  const game = series.games[gameIdx];
  if (game && game.winner) return ''; // already played, use actual box score
  if (game && game.boxScores) return ''; // has actual data

  const projected = calcProjectedBoxScore(series, gameIdx);
  if (!projected) return '';

  const gameNum = gameIdx + 1;
  const priorGame = gameIdx > 0 ? series.games[gameIdx - 1] : null;
  const hasPrior = priorGame && priorGame.boxScores;

  function renderTeamProjection(players, team, teamScore) {
    const total = players.reduce((t, p) => {
      t.pts += p.pts; t.reb += p.reb; t.ast += p.ast; t.min += p.min; return t;
    }, {pts:0, reb:0, ast:0, min:0});

    return `<div class="box-team-section">
      <div class="box-team-name">
        <span style="width:4px;height:14px;border-radius:2px;background:${team.color};display:inline-block"></span>
        ${team.name} — Projected ${teamScore} pts
      </div>
      <div style="overflow-x:auto"><table class="box-table proj-box-table">
        <tr><th>Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>FG</th><th>3PT</th><th>FT</th><th>TO</th><th>Key Factors</th></tr>
        ${players.map(p => {
          const ptsColor = p.pts >= 25 ? 'var(--green)' : p.pts >= 15 ? 'var(--accent)' : 'var(--text)';
          // Show top 2 modifiers as pills
          const topMods = (p.modifiers || []).sort((a, b) => Math.abs(b.ptsDelta) - Math.abs(a.ptsDelta)).slice(0, 2);
          const modPills = topMods.map(m => {
            const sign = m.pct > 0 ? '+' : '';
            const color = m.pct > 0 ? 'rgba(61,214,140,0.15)' : 'rgba(255,79,94,0.15)';
            const tc = m.pct > 0 ? 'var(--green)' : 'var(--red)';
            return `<span class="exp-modifier-pill" style="background:${color};color:${tc}">${m.label} ${sign}${m.pct}%</span>`;
          }).join('');

          // G1 comparison arrow
          const prior = hasPrior ? (priorGame.boxScores.home.find(x => x.name === p.name) || priorGame.boxScores.away.find(x => x.name === p.name)) : null;
          let g1Arrow = '';
          if (prior) {
            const diff = p.pts - prior.pts;
            if (Math.abs(diff) >= 2) {
              const arrowColor = diff > 0 ? 'var(--green)' : 'var(--red)';
              const arrow = diff > 0 ? '\u2191' : '\u2193';
              g1Arrow = `<span style="font-size:9px;color:${arrowColor};margin-left:3px" title="vs G1 actual ${prior.pts}pts">${arrow}${Math.abs(diff).toFixed(0)}</span>`;
            }
          }

          return `<tr>
            <td class="box-player-name">${p.name}</td>
            <td>${p.min}</td>
            <td style="font-weight:700;color:${ptsColor}">${p.pts}${g1Arrow}</td>
            <td>${p.reb}</td><td>${p.ast}</td>
            <td>${p.fgm}-${p.fga}</td>
            <td>${p.tpm}-${p.tpa}</td>
            <td>${p.ftm}-${p.fta}</td>
            <td>${p.to}</td>
            <td class="exp-modifiers-cell">${modPills}</td>
          </tr>`;
        }).join('')}
        <tr class="box-totals-row">
          <td style="font-weight:700">PROJECTED</td>
          <td>${total.min}</td>
          <td style="font-weight:700">${total.pts.toFixed(0)}</td>
          <td>${total.reb.toFixed(0)}</td><td>${total.ast.toFixed(0)}</td>
          <td colspan="3"></td><td></td><td></td>
        </tr>
      </table></div>
    </div>`;
  }

  return `<div class="box-score-section" style="border-color:rgba(167,139,250,0.3)">
    <div class="box-score-title" style="color:var(--purple)">Game ${gameNum} Projected Box Score</div>
    <div class="adv-comp-subtitle">Multi-factor projection: 13-variable model${hasPrior ? ' + G'+(gameIdx)+' Bayesian update (30% actual / 70% model) + coaching regression adjustments' : ''}. Normalized to match predicted score: ${projected.homeScore}-${projected.awayScore} (${projected.character})</div>
    ${renderTeamProjection(projected.home, series.homeTeam, projected.homeScore)}
    ${renderTeamProjection(projected.away, series.awayTeam, projected.awayScore)}
  </div>`;
}


function renderGamePrediction(s, gameKey, gameNum, color, label) {
  const g = s[gameKey];
  if (!g) return '';

  // Dynamic projection from the new engine
  const proj = calcGameProjection(s, s.id, gameNum);
  const charClass = proj.character === 'BLOWOUT RISK' ? 'blowout' : proj.character === 'SEPARATION' ? 'separation' : proj.character === 'COMPETITIVE' ? 'competitive' : proj.character === 'GRIND' ? 'grind' : 'coinflip';

  // Margin bar width (0-50 scale)
  const barPct = Math.min(100, (proj.absMargin / 30) * 100);
  const barColor = proj.absMargin >= 18 ? 'var(--red)' : proj.absMargin >= 12 ? 'var(--yellow)' : proj.absMargin >= 7 ? 'var(--accent)' : 'var(--green)';

  // Dynamic score string
  const dynScore = proj.margin >= 0
    ? `${s.homeTeam.abbr} ${proj.homeScore} — ${s.awayTeam.abbr} ${proj.awayScore}`
    : `${s.awayTeam.abbr} ${proj.awayScore} — ${s.homeTeam.abbr} ${proj.homeScore}`;

  return `<div class="game-panel" style="border-color:${color}40">
    <div class="game-panel-header">
      <div class="game-panel-title" style="color:${color}">${label} Prediction</div>
      <span class="game-character ${charClass}">${proj.character}</span>
      <span class="g1-confidence ${g.confidence}">${g.confidence.toUpperCase()}</span>
    </div>
    <div class="game-panel-grid">
      <div class="gp-stat"><div class="label">Spread</div><div class="val">${g.spread}</div></div>
      <div class="gp-stat"><div class="label">ML</div><div class="val" style="font-size:14px">${g.moneyline}</div></div>
      <div class="gp-stat"><div class="label">O/U</div><div class="val">${g.ou}</div></div>
    </div>

    <div class="proj-score-dynamic">${g.pick} — ${dynScore}</div>
    <div class="margin-bar-container">
      <div class="margin-bar"><div class="margin-bar-fill" style="width:${barPct}%;background:${barColor}"></div></div>
      <span class="margin-range">${proj.marginRange}</span>
    </div>
    <div class="variance-pills">
      <div class="variance-pill">Blowout ${proj.blowoutProb}%</div>
      <div class="variance-pill">Close game ${proj.closeProb}%</div>
      ${proj.talentMultiplier > 1.1 ? '<div class="variance-pill" style="color:var(--red);border-color:rgba(239,68,68,0.3)">Talent gap ×'+proj.talentMultiplier+'</div>' : ''}
      ${Math.abs(proj.depthEdge) >= 1.5 ? '<div class="variance-pill" style="color:var(--yellow);border-color:rgba(245,158,11,0.3)">Depth edge '+(proj.depthEdge>0?s.homeTeam.abbr:s.awayTeam.abbr)+'</div>' : ''}
    </div>

    <div style="font-size:12px;color:var(--text-dim);line-height:1.6">${g.reasoning}</div>
    ${g.prosHome ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px;font-size:11px">
      ${g.prosHome.map(p=>'<div style="color:var(--green);padding:4px 8px;border-radius:6px;background:rgba(0,0,0,0.2)">+ '+s.homeTeam.abbr+': '+p+'</div>').join('')}
      ${g.consHome.map(p=>'<div style="color:var(--red);padding:4px 8px;border-radius:6px;background:rgba(0,0,0,0.2)">- '+s.homeTeam.abbr+': '+p+'</div>').join('')}
      ${g.prosAway.map(p=>'<div style="color:var(--green);padding:4px 8px;border-radius:6px;background:rgba(0,0,0,0.2)">+ '+s.awayTeam.abbr+': '+p+'</div>').join('')}
      ${g.consAway.map(p=>'<div style="color:var(--red);padding:4px 8px;border-radius:6px;background:rgba(0,0,0,0.2)">- '+s.awayTeam.abbr+': '+p+'</div>').join('')}
    </div>` : ''}
  </div>`;
}

