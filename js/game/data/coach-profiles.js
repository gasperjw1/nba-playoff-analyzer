// ============================================================
// PLAYOFF RUN — TYPED COACH PROFILES (Phase 0)
// ============================================================
// The 16 coaching blocks in series-data.js, converted from prose to
// parameters the coach AI can act on. Each numeric trait is sourced from
// the hand-authored block (adjustmentRating / schemeCreativity / urgency)
// and each behavioral flag from the tendency/rotationPlan prose — the
// per-game g1Performance/g2Performance grades are the validation record
// for these numbers.
//
// Trait semantics (all 0-10 unless noted):
//   adjust      : between-game counter-adjustment quality. ALSO the coach's
//                 Bayesian discipline — high-adjust coaches discount
//                 one-game spikes (duds are 2x more informative, measured),
//                 which is what makes them hard to bait.
//   creativity  : scheme variety (zone/double/switch toggling range).
//   urgency     : how quickly they deviate from plan when losing.
//   rotationDepth: playoff rotation size (bodies with real minutes).
//   doublesStars: propensity to commit hard coverage to the opposing star.
//   benchLeash  : how quickly cold starters lose minutes (0=never, 10=fast).
// ============================================================

const GAME_COACH_PROFILES = {
  HOU: { coach: 'Ime Udoka',        adjust: 8, creativity: 5, urgency: 7, rotationDepth: 8,  doublesStars: 5, benchLeash: 7,
         style: 'Defense-first; shortens to 7-8 in playoffs; benches weak defenders.' },
  LAL: { coach: 'JJ Redick',        adjust: 8, creativity: 9, urgency: 6, rotationDepth: 8,  doublesStars: 8, benchLeash: 5,
         style: 'Offensive innovator; pre-planned star doubling; toggles zone/man.' },
  OKC: { coach: 'Mark Daigneault',  adjust: 9, creativity: 8, urgency: 5, rotationDepth: 10, doublesStars: 4, benchLeash: 4,
         style: 'Matchup chameleon; trusts depth; self-focused philosophy.' },
  PHX: { coach: 'Jordan Ott',       adjust: 4, creativity: 4, urgency: 8, rotationDepth: 9,  doublesStars: 3, benchLeash: 3,
         style: 'First-year; 9-man rotation locked; rides Booker.' },
  DEN: { coach: 'David Adelman',    adjust: 6, creativity: 6, urgency: 5, rotationDepth: 9,  doublesStars: 3, benchLeash: 5,
         style: 'Jokic-centric; willing small-ball; creative bench units.' },
  MIN: { coach: 'Chris Finch',      adjust: 7, creativity: 7, urgency: 7, rotationDepth: 9,  doublesStars: 5, benchLeash: 6,
         style: 'Gobert-anchored defense; pulls Gobert late for offense.' },
  SAS: { coach: 'Mitch Johnson',    adjust: 5, creativity: 6, urgency: 5, rotationDepth: 9,  doublesStars: 4, benchLeash: 5,
         style: 'Pop tree; defense-first with offensive freedom; lineup experiments.' },
  POR: { coach: 'Tiago Splitter',   adjust: 4, creativity: 6, urgency: 9, rotationDepth: 9,  doublesStars: 4, benchLeash: 6,
         style: 'Interim; continuity system; young squad plays fast.' },
  DET: { coach: 'JB Bickerstaff',   adjust: 5, creativity: 7, urgency: 8, rotationDepth: 9,  doublesStars: 4, benchLeash: 6,
         style: 'Defense-first possession game; COTY season.' },
  ORL: { coach: 'Jamahl Mosley',    adjust: 7, creativity: 7, urgency: 9, rotationDepth: 8,  doublesStars: 5, benchLeash: 5,
         style: 'Defensive identity; switchable lineups; methodical halfcourt.' },
  BOS: { coach: 'Joe Mazzulla',     adjust: 8, creativity: 5, urgency: 5, rotationDepth: 8,  doublesStars: 4, benchLeash: 5,
         style: 'Five-out; champion pedigree; adaptive in-series.' },
  PHI: { coach: 'Nick Nurse',       adjust: 8, creativity: 9, urgency: 8, rotationDepth: 8,  doublesStars: 7, benchLeash: 7,
         style: 'Aggressive usage; janky defenses; wing defense always on floor.' },
  NYK: { coach: 'Mike Brown',       adjust: 6, creativity: 6, urgency: 5, rotationDepth: 9,  doublesStars: 5, benchLeash: 5,
         style: 'Motion offense; 9-man rotation; multi-scheme adjustments.' },
  ATL: { coach: 'Quin Snyder',      adjust: 7, creativity: 9, urgency: 7, rotationDepth: 8,  doublesStars: 5, benchLeash: 6,
         style: 'Motion offense; tight playoff rotation; dual initiators.' },
  CLE: { coach: 'Kenny Atkinson',   adjust: 7, creativity: 7, urgency: 5, rotationDepth: 9,  doublesStars: 5, benchLeash: 6,
         style: 'Defense-drives-rotation; extreme lineup adaptability (41 starting lineups).' },
  TOR: { coach: 'Darko Rajakovic',  adjust: 5, creativity: 5, urgency: 9, rotationDepth: 9,  doublesStars: 3, benchLeash: 4,
         style: 'Defense-first; switchable; transition identity.' },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_COACH_PROFILES };
}
