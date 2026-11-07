// ============================================================
// PARLAY CHECKER — a ticket's legs against the models and the price
// ============================================================
// Each leg gets the model's probability, DraftKings' (no-vig when both
// sides of the price are known, else the price's own implied chance, vig
// included), and flags drawn only from what the ledger, the replay and the
// props backtests have measured. The ticket gets the combined probability,
// fair odds and the expected return of the offered price per unit staked —
// never a stake size. Legs from the same game are correlated; the combined
// probability treats every leg as independent and flags those legs.
//
// leg = { type: 'ml', game, side: 'home' | 'away', odds? }
//     | { type: 'prop', game, player, stat: 'pts' | 'reb' | 'ast' | 'pra' | 'tpm',
//         dir: 'over' | 'under', line, odds, oddsOther? }
// odds: American; a moneyline leg defaults to DraftKings' price on the slate.
// The picks engine reads the slate through seasonCleanSlate (last season's
// ratings), as the ledger's picks do.
// ============================================================
const PARLAY_STATS = { pts: 'points', reb: 'rebounds', ast: 'assists', pra: 'PRA', tpm: '3-pointers' };

function parlayDecimal(american) {
  const a = Number(american);
  if (!isFinite(a) || Math.abs(a) < 100) throw new Error(`American odds must be ≤ −100 or ≥ +100 (got ${american})`);
  return a > 0 ? 1 + a / 100 : 1 + 100 / -a;
}
function parlayAmerican(decimal) {
  if (!(decimal > 1)) throw new Error(`decimal odds must be above 1 (got ${decimal})`);
  return decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1));
}
const parlayFmtOdds = (a) => (a > 0 ? '+' : '') + a;

function _parlaySlates(slate) {
  return { slate, clean: (typeof seasonCleanSlate === 'function' && seasonCleanSlate(slate)) || slate };
}

// One leg → { ...leg, label, p, pMarket, pImplied, odds, flags: [{ level: 'good' | 'info' | 'warn', text }] } or { ...leg, error }.
function parlayLeg(leg, slate) {
  const { clean } = _parlaySlates(slate);
  const g = slate.games.find(x => String(x.id) === String(leg.game));
  if (!g) return { ...leg, error: `game ${leg.game} is not on the ${slate.date} slate` };
  const flags = [], m = g.market || {};
  const out = { ...leg, matchup: `${g.away} @ ${g.home}`, tip: g.tip };
  if (leg.type === 'ml') {
    if (leg.side !== 'home' && leg.side !== 'away') return { ...out, error: 'side must be home or away' };
    const proj = projectSeasonGame(g, clean);
    const team = leg.side === 'home' ? g.home : g.away;
    const odds = leg.odds != null && leg.odds !== '' ? Number(leg.odds) : (leg.side === 'home' ? m.mlHome : m.mlAway);
    if (odds == null) return { ...out, error: `no price for ${team}: enter the odds` };
    const p = leg.side === 'home' ? proj.pHome : 1 - proj.pHome;
    const pMarket = m.mlHome != null && m.mlAway != null ? (leg.side === 'home' ? _noVigHome(m.mlHome, m.mlAway) : 1 - _noVigHome(m.mlHome, m.mlAway)) : null;
    const t = typeof seasonTrustCheck === 'function' ? seasonTrustCheck(proj, m) : null;
    if (t && t.rule) {
      const R = SEASON_TRUST.rules.find(r => r.id === t.rule);
      const era = typeof seasonTrustRecordByEngine === 'function' && typeof loadSeasonLedger === 'function' ? seasonTrustRecordByEngine(loadSeasonLedger())[SEASON_ENGINE_VERSION] : null;
      const n = era && era[t.rule] ? era[t.rule].n : 0;
      if (t.side !== leg.side) flags.push({ level: 'warn', text: `${t.rule} fires on the other side (${t.side === 'home' ? g.home : g.away})` });
      else if (R.avoid) flags.push({ level: 'warn', text: `AVOID: injuries drive our edge here — the market knows minutes limits and late news` });
      else flags.push({ level: 'info', text: `${t.rule} (${R.label.toLowerCase()}) fires on this side — frozen rule, ${n} judged on this engine: unproven` });
    }
    if (pMarket != null && p - pMarket >= 0.10) flags.push({ level: 'warn', text: `${((p - pMarket) * 100).toFixed(0)} pp above DraftKings' no-vig price — edges this large are unproven on the ledger` });
    const rec = typeof loadSeasonLedger === 'function' ? loadSeasonLedger().find(r => r.date === slate.date && r.home === g.home && r.away === g.away && r.pOursClean != null) : null;
    if (rec) {
      const pr = leg.side === 'home' ? rec.pOursClean : 1 - rec.pOursClean;
      if ((pr >= 0.5) !== (p >= 0.5)) flags.push({ level: 'warn', text: `the recorded pick (${(pr * 100).toFixed(1)}%) had the other side — later news moved it` });
    }
    return { ...out, label: `${team} to win`, team, p, pMarket, pImplied: 1 / parlayDecimal(odds), odds, flags };
  }
  if (leg.type === 'prop') {
    if (!PARLAY_STATS[leg.stat]) return { ...out, error: `stat must be one of ${Object.keys(PARLAY_STATS).join(', ')}` };
    if (leg.dir !== 'over' && leg.dir !== 'under') return { ...out, error: 'direction must be over or under' };
    const line = Number(leg.line);
    if (!isFinite(line) || line < 0) return { ...out, error: `line must be a number ≥ 0 (got ${leg.line})` };
    if (leg.odds == null || leg.odds === '') return { ...out, error: 'enter the odds for this prop' };
    const side = [g.home, g.away].find(ab => (clean.teams[ab].players || []).some(p => String(p.id) === String(leg.player)));
    if (!side) return { ...out, error: `player ${leg.player} is not on either roster` };
    const opp = side === g.home ? g.away : g.home;
    const player = clean.teams[side].players.find(p => String(p.id) === String(leg.player));
    const pr = projectPlayerProps(player, clean.teams[side], clean.teams[opp], clean);
    if (!pr) return { ...out, error: `${player.name} is projected not to play` };
    const mean = pr[leg.stat], sd = pr.sd[leg.stat];
    const pOver = probOver(mean, sd, line);
    const p = leg.dir === 'over' ? pOver : 1 - pOver;
    const odds = Number(leg.odds), pImplied = 1 / parlayDecimal(odds);
    const pMarket = leg.oddsOther != null && leg.oddsOther !== '' ? pImplied / (pImplied + 1 / parlayDecimal(leg.oddsOther)) : null;
    // Flags: each from a measured result (props-2 holdout, props-1 replay, live ledger).
    if (p >= 0.40 && p <= 0.60) {
      flags.push(leg.dir === 'over'
        ? { level: 'warn', text: 'near the projection: on the replay, overs at the line nearest the projection went over 42–45% where the model said ~50% (stat lines skew low)' }
        : { level: 'info', text: 'near the projection: on the replay, unders there won ~55–58% where the model said ~50% (stat lines skew low)' });
    }
    if (leg.dir === 'over' && p > 0.60 && p < 0.85 && (leg.stat === 'pts' || leg.stat === 'pra'))
      flags.push({ level: 'info', text: 'mid line: on the replay the model\'s 75% lines for points and PRA cleared 73–74% vs 77–78% shown' });
    if (leg.dir === 'over' && p >= 0.85) {
      if (leg.stat === 'pts' || leg.stat === 'pra') flags.push({ level: 'good', text: 'deep line: the model\'s 90% lines held on the replay for points and PRA (90–91% cleared vs 91% shown)' });
      else if (leg.stat === 'reb' || leg.stat === 'ast') flags.push({ level: 'good', text: 'deep line: rebound and assist floors ran safe on the replay (96% cleared vs 92% shown)' });
      else flags.push({ level: 'warn', text: '3-pointers: few deep lines exist and the replay has little evidence on them' });
    }
    const vs = pMarket != null ? pMarket : pImplied;
    if (p - vs >= 0.10) flags.push({ level: 'warn', text: `${((p - vs) * 100).toFixed(0)} pp above the price's ${pMarket != null ? 'no-vig' : 'implied'} chance — prop edges are unproven: no prop prices have been tracked yet` });
    if (Math.abs(line - Math.round(line)) < 1e-9) flags.push({ level: 'warn', text: `whole-number line: landing on exactly ${line} voids this leg in a parlay (the rest pays at a lower price); the chance here counts that push as half a win` });
    if (player.availability < 1) flags.push({ level: 'warn', text: `listed ${player.status || 'questionable'} (${Math.round(player.availability * 100)}%): if he sits, DraftKings voids the leg` });
    if (pr.min < 24) flags.push({ level: 'warn', text: `projected ${pr.min.toFixed(0)} minutes — on the replay 12% of players played under 70% of their projected minutes, bench roles most` });
    if (slate.source === 'espn') flags.push({ level: 'info', text: 'ESPN fallback slate: minutes are season averages, not a rotation projection' });
    const label = `${player.name} ${leg.dir} ${line} ${PARLAY_STATS[leg.stat]}`;
    return { ...out, label, team: side, playerName: player.name, mean, sd, min: pr.min, p, pMarket, pImplied, odds, flags };
  }
  return { ...out, error: `unknown leg type ${leg.type}` };
}

// legs → { legs, ok, p, pMarket, pBook, decimal, american, offered, fairAmerican, ev, sameGame }.
// offered: the parlay's American price as quoted (same-game parlays are priced on their own);
// without it, the price of the legs' odds multiplied.
function evaluateParlay(legs, slate, offered) {
  const out = (legs || []).map(l => parlayLeg(l, slate));
  const ok = out.length > 0 && out.every(l => !l.error);
  const byGame = new Map();
  out.forEach((l, i) => { if (!l.error) byGame.set(String(l.game), (byGame.get(String(l.game)) || []).concat(i)); });
  const sameGame = [...byGame.values()].filter(ix => ix.length > 1);
  for (const ix of sameGame) for (const i of ix) out[i].flags.push({ level: 'warn',
    text: `same game as leg ${ix.filter(j => j !== i).map(j => j + 1).join(', ')}: outcomes move together, so the combined chance below (which treats legs as independent) is only approximate` });
  if (!ok) return { legs: out, ok, sameGame };
  const p = out.reduce((s, l) => s * l.p, 1);
  const pMarket = out.every(l => l.pMarket != null) ? out.reduce((s, l) => s * l.pMarket, 1) : null;
  const legsDecimal = out.reduce((s, l) => s * parlayDecimal(l.odds), 1);
  const decimal = offered != null && offered !== '' ? parlayDecimal(offered) : legsDecimal;
  return {
    legs: out, ok, sameGame, p, pMarket, pBook: 1 / decimal,
    decimal, american: parlayAmerican(decimal), offered: offered != null && offered !== '' ? Number(offered) : null,
    legsAmerican: parlayAmerican(legsDecimal), fairAmerican: p > 0 && p < 1 ? parlayAmerican(1 / p) : null,
    ev: p * decimal - 1,
  };
}
