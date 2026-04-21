function inferSPMSkills(p) {
  if (p.rating <= 0) return { oScr:0, oBH:0, oReb:0, o3PT:0, oPass:0, dScr:0, dBH:0, dReb:0 };
  // Offensive Scoring: PPG-driven, TS% adjusted
  const oScr = Math.min(10, (p.ppg / 3.2) * (p.ts / 57));
  // Offensive Ball-Handling: APG-driven, turnover awareness
  const oBH = Math.min(10, (p.apg / 1.2) + (p.epm > 3 ? 1.5 : 0));
  // Offensive Rebounding: RPG for non-guards, position-adjusted
  const isGuard = p.pos === 'PG' || p.pos === 'SG';
  const oReb = Math.min(10, isGuard ? p.rpg * 0.6 : p.rpg * 0.8);
  // NEW: 3-Point Shooting dimension (Mateus et al. — shooting balance matters)
  const o3PT = Math.min(10, ((p.fgp > 48 ? 3 : 0) + (p.ts - 54) * 0.8 + (isGuard ? 1.5 : 0)));
  // NEW: Ball Distribution / Passing dimension (touches & passes — strongest discriminator per Mateus)
  const oPass = Math.min(10, (p.apg / 1.5) + ((p.usg || 20) > 28 ? 1.5 : 0) + (p.epm > 5 ? 1.0 : 0));
  // Defensive Scoring: BPM + on/off driven (ability to get stops)
  const dScr = Math.min(10, 3 + p.bpm * 0.6 + (p.onOff > 5 ? 1.5 : p.onOff > 2 ? 0.8 : 0));
  // Defensive Ball-Handling: steals proxy from clutch + defensive reputation
  const dBH = Math.min(10, 2 + p.clutch * 0.35 + (p.bpm > 3 ? 1.5 : p.bpm > 1 ? 0.8 : 0));
  // Defensive Rebounding: RPG for bigs, reduced for guards
  const dReb = Math.min(10, isGuard ? p.rpg * 0.5 : p.rpg * 0.7);
  return { oScr: +oScr.toFixed(1), oBH: +oBH.toFixed(1), oReb: +oReb.toFixed(1),
           o3PT: +o3PT.toFixed(1), oPass: +oPass.toFixed(1),
           dScr: +dScr.toFixed(1), dBH: +dBH.toFixed(1), dReb: +dReb.toFixed(1) };
}

// SPM Chemistry cache — avoids recalculating identical lineups
const _spmCache = new Map();
function getCachedSPM(team, seriesId) {
  const key = seriesId + '_' + team.abbr;
  if (_spmCache.has(key)) return _spmCache.get(key);
  // Use getEffectiveRating to respect scenario toggles (player toggled OUT → effR = 0)
  const activePlayers = team.players.filter(p => {
    const effR = (typeof getEffectiveRating === 'function' && seriesId) ? getEffectiveRating(p, seriesId) : p.rating;
    return effR > 0;
  }).slice(0, 8);
  const result = calcSPMChemistry(activePlayers);
  _spmCache.set(key, result);
  return result;
}
function clearSPMCache() { _spmCache.clear(); }

// Calculate SPM chemistry score for a lineup (array of player objects)
function calcSPMChemistry(players) {
  const active = players.filter(p => p.rating > 0);
  if (active.length < 3) return { score: 50, synergies: [], verdict: "Insufficient data" };

  const skills = active.map(p => inferSPMSkills(p));
  let totalSynergy = 0;
  const synergies = [];

  // For each pair of players, calculate pairwise synergies
  for (let i = 0; i < skills.length; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      const a = skills[i], b = skills[j];
      let pairSyn = 0;

      // Same-skill overlaps (redundancy penalties / complementarity bonuses)
      pairSyn += a.oScr * b.oScr * SPM_COEFF.oScr_oScr / 25; // normalized by max product
      pairSyn += a.oBH * b.oBH * SPM_COEFF.oBH_oBH / 25;
      pairSyn += a.oReb * b.oReb * SPM_COEFF.oReb_oReb / 25;
      pairSyn += a.dScr * b.dScr * SPM_COEFF.dScr_dScr / 25;
      pairSyn += a.dBH * b.dBH * SPM_COEFF.dBH_dBH / 25;
      pairSyn += a.dReb * b.dReb * SPM_COEFF.dReb_dReb / 25;
      // New dimensions: 3PT and Ball Distribution
      pairSyn += (a.o3PT||0) * (b.o3PT||0) * SPM_COEFF.o3PT_o3PT / 25;
      pairSyn += (a.oPass||0) * (b.oPass||0) * SPM_COEFF.oPass_oPass / 25;

      // Cross-skill synergies (complementary boosts)
      pairSyn += (a.oScr * b.oBH + a.oBH * b.oScr) * SPM_COEFF.oScr_oBH / 50;
      pairSyn += (a.oScr * b.oReb + a.oReb * b.oScr) * SPM_COEFF.oScr_oReb / 50;
      pairSyn += (a.oBH * b.oReb + a.oReb * b.oBH) * SPM_COEFF.oBH_oReb / 50;
      pairSyn += (a.dScr * b.dBH + a.dBH * b.dScr) * SPM_COEFF.dScr_dBH / 50;
      pairSyn += (a.dScr * b.dReb + a.dReb * b.dScr) * SPM_COEFF.dScr_dReb / 50;
      pairSyn += (a.dBH * b.dReb + a.dReb * b.dBH) * SPM_COEFF.dBH_dReb / 50;
      // New cross-skill synergies
      pairSyn += ((a.oScr||0) * (b.o3PT||0) + (a.o3PT||0) * (b.oScr||0)) * SPM_COEFF.oScr_o3PT / 50;
      pairSyn += ((a.oScr||0) * (b.oPass||0) + (a.oPass||0) * (b.oScr||0)) * SPM_COEFF.oScr_oPass / 50;
      pairSyn += ((a.oBH||0) * (b.o3PT||0) + (a.o3PT||0) * (b.oBH||0)) * SPM_COEFF.oBH_o3PT / 50;
      pairSyn += ((a.oBH||0) * (b.oPass||0) + (a.oPass||0) * (b.oBH||0)) * SPM_COEFF.oBH_oPass / 50;
      pairSyn += ((a.oReb||0) * (b.o3PT||0) + (a.o3PT||0) * (b.oReb||0)) * SPM_COEFF.oReb_o3PT / 50;
      pairSyn += ((a.oReb||0) * (b.oPass||0) + (a.oPass||0) * (b.oReb||0)) * SPM_COEFF.oReb_oPass / 50;
      pairSyn += ((a.o3PT||0) * (b.oPass||0) + (a.oPass||0) * (b.o3PT||0)) * SPM_COEFF.o3PT_oPass / 50;

      totalSynergy += pairSyn;
      if (Math.abs(pairSyn) > 0.15) {
        synergies.push({
          pair: `${active[i].name.split(' ').pop()}-${active[j].name.split(' ').pop()}`,
          value: +pairSyn.toFixed(2),
          type: pairSyn > 0.1 ? 'positive' : pairSyn < -0.1 ? 'negative' : 'neutral'
        });
      }
    }
  }

  // Normalize to 0-100 scale (centered at 50)
  const rawScore = 50 + totalSynergy * 8;
  const score = Math.min(95, Math.max(15, Math.round(rawScore)));

  // Sort synergies by absolute value
  synergies.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  let verdict;
  if (score >= 75) verdict = "Elite chemistry — complementary skills amplify each other";
  else if (score >= 65) verdict = "Strong chemistry — diverse skill profiles with minor overlaps";
  else if (score >= 50) verdict = "Adequate chemistry — some redundancy but functional fit";
  else if (score >= 40) verdict = "Concerning chemistry — significant skill redundancy on offense";
  else verdict = "Poor chemistry — too many overlapping roles create diminishing returns";

  return { score, synergies: synergies.slice(0, 5), verdict, rawSynergy: +totalSynergy.toFixed(2) };
}

// Calculate team-level on/off impact summary
function calcOnOffSummary(team) {
  const active = team.players.filter(p => p.rating > 0);
  if (active.length === 0) return { avg: 0, top: null, worst: null, swing: 0, players: [] };
  const sorted = [...active].sort((a, b) => b.onOff - a.onOff);
  const avgOnOff = active.reduce((s, p) => s + (p.onOff || 0), 0) / active.length;
  const topOnOff = sorted[0];
  const worstOnOff = sorted[sorted.length - 1];
  const swing = topOnOff.onOff - worstOnOff.onOff;
  return { avg: +avgOnOff.toFixed(1), top: topOnOff, worst: worstOnOff, swing: +swing.toFixed(1), players: sorted };
}
