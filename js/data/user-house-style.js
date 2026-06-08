// ============================================================
// USER HOUSE STYLE — encoded patterns from the user's 9-1 record
// ============================================================
// What this is: structured config encoding the SPECIFIC bet shapes
// that have been winning for the user. The user-aligned synthesizer
// reads this to filter Council recommendations down to parlays in
// the user's winning archetypes.
//
// Source data: USER_BET_LEDGER through Finals G2 (10 settled, 9-1).
// PRA = 13/13, PTS = 13/13, threes = 4/5 (one loss = bench minutes).
//
// Update protocol: as each new bet settles, re-run the pattern
// analysis and update this file. Archetypes may evolve.
// ============================================================

const USER_HOUSE_STYLE = {
  // ─── DIMENSION PREFERENCES (per stat) ──────────────────────
  // Weights derived from empirical hit rate × sample size
  dimensionWeights: {
    'pra':    1.00, // 13/13 — premier reliable-tier dimension
    'pts':    1.00, // 13/13 — premier
    'threes': 0.65, // 4/5 — single loss was minutes-insecure bench
    'reb':    0.50, // untested in user's record; default mid
    'ast':    0.40, // 0/1 (McBride O1.5 ast = 0 actual)
    'stl':    0.30,
    'blk':    0.30,
  },

  // ─── WINNING ARCHETYPES ────────────────────────────────────
  // Each archetype is a parlay TEMPLATE that historical data
  // shows the user wins on. The synthesizer constructs candidates
  // matching these templates.
  archetypes: [
    {
      id: 'A-role-player-pra-stack',
      description: '2-4 leg OVER stack on role players with secure minutes',
      legCount: { min: 2, max: 4 },
      direction: 'over',
      stats: ['pra'],
      playerRoles: ['starter', 'role-player'],
      minMinutesSecurity: 0.80,
      crossTeamPref: 'preferred',  // not strict
      observedWins: 3,
      avgPnL: 75,
      examples: [
        'G5 OKC-SAS: Champagnie/Keldon/Harper O9.5 PRA + Harper O0.5 threes = +$125',
        'G3 NYK-CLE: OG/Brunson/J.Allen PRA + KAT pts + Brunson pts = +$50',
      ],
    },
    {
      id: 'B-cross-team-star-direction-hedge',
      description: 'One OVER + one UNDER on stars across opposing teams (low-scoring grind script)',
      legCount: 2,
      direction: 'mixed',
      stats: ['pts', 'pra'],
      playerRoles: ['star'],
      crossTeamPref: 'required',
      observedWins: 4,
      avgPnL: 95,
      examples: [
        'G1 Finals Bet 1: Brunson O19.5 + Wemby U31.5 + Champagnie O14.5 PRA = +$65',
        'G2 Finals Bet 2: Wemby U31.5 + Brunson O18.5 = +$125 (est)',
        'G3 OKC-SAS Bet 2: Wemby O29.5 PRA + Holmgren U18.5 + A.Mitchell U17.5 = +$39',
      ],
      typicalThesis: 'Low-scoring grind — neither star explodes, hedge captures both directions',
    },
    {
      id: 'C-cross-team-role-player-hedge',
      description: 'Cross-team role-player parlay (PRA double or threes hedge)',
      legCount: 2,
      direction: 'mixed',
      stats: ['pra', 'threes', 'pts'],
      playerRoles: ['starter', 'role-player'],
      crossTeamPref: 'required',
      minMinutesSecurity: 0.75,
      observedWins: 2,
      avgPnL: 105,
      examples: [
        'G2 Finals Bet 1: Harper O14.5 PRA + KAT O29.5 PRA = +$85 (est)',
        'G2 Finals Bet 3: Champagnie U2.5 threes + Shamet O1.5 threes = +$125 (est)',
      ],
      typicalThesis: 'Cross-team diversification reduces correlation risk',
    },
  ],

  // ─── META-RULES (apply to all archetypes) ──────────────────
  metaRules: {
    minutesSecurity: {
      threshold: 0.75,  // ratio of min_floor / min_avg over last 3 games
      formula: 'min_last3_floor / min_last3_avg',
      enforcement: 'hard',  // legs failing this are EXCLUDED from candidates
      rationale: 'Only documented loss came from Keldon Johnson O0.5 threes when he played 8min playoff-low. Minutes security is the kill switch.',
    },
    crossTeamPreference: {
      weight: 0.78,  // 7 of 9 wins were cross-team
      rationale: 'Reduces correlation risk — both stars hot OR both cold is less likely than mixed outcomes',
    },
    oddsRange: {
      min: -200,         // hard floor
      max: 414,          // observed highest
      sweetSpot: { min: 100, max: 250 },  // 5 of 9 wins
    },
    stakeSize: 50,       // observed consistent
    legCountPreference: { min: 2, max: 4, sweetSpot: { min: 2, max: 3 } },
  },

  // ─── RED FLAGS (auto-reject) ───────────────────────────────
  redFlags: [
    {
      id: 'bench-threes-low-minutes',
      description: 'Bench player threes prop where last-game minutes < 15',
      example: 'Keldon O0.5 threes in G1 (got 8 min)',
      rationale: 'Bench rotation can be cut in tight starter-heavy games',
    },
    {
      id: 'same-team-3plus-leg',
      description: 'All-same-team 3+ leg parlay (high correlation risk)',
      rationale: 'If team has bad night, all legs broken together',
    },
    {
      id: 'star-under-vs-soft-paint',
      description: 'Star UNDER on rim attacker vs soft paint defense',
      rationale: 'Rim attackers can pile FT volume even on inefficient nights',
    },
    {
      id: 'deep-alt-juice',
      description: 'Leg with juice steeper than -350',
      rationale: 'Deep-alt territory — book has priced the floor; thin edge',
    },
  ],

  // ─── BOOK LINE FLOORS (observed minimums from FanDuel/DraftKings) ───
  // Populated as user reports specific line availability.
  // Used to filter projections to lines that actually exist at books.
  bookLineFloors: {
    'Julian Champagnie': { 'pra': 14.5 },  // FD minimum per user (G1 Finals)
    // Future: KAT, Brunson, etc. as user reports
  },

  // ─── HISTORICAL EMPIRICAL CONTEXT ──────────────────────────
  // Used for confidence calibration of recommendations
  empiricalContext: {
    totalBets: 10,
    winRate: 0.90,
    netPnL: 820,
    stakedTotal: 500,
    roi: 1.64,
    perStatHitRate: {
      'pra':    { hit: 13, total: 13, rate: 1.00, sampleSize: 13 },
      'pts':    { hit: 13, total: 13, rate: 1.00, sampleSize: 13 },
      'threes': { hit: 4,  total: 5,  rate: 0.80, sampleSize: 5  },
      'ast':    { hit: 0,  total: 1,  rate: 0.00, sampleSize: 1  },
    },
    perArchetypeWinRate: {
      'A-role-player-pra-stack':           { wins: 3, losses: 0 },
      'B-cross-team-star-direction-hedge': { wins: 4, losses: 0 },
      'C-cross-team-role-player-hedge':    { wins: 2, losses: 0 },
      'D-uncategorized-bench-threes':      { wins: 0, losses: 1 },  // the one loss
    },
    lastUpdated: '2026-06-08',
  },

  // ─── PLAYER ROLE CLASSIFICATION RULES ──────────────────────
  // Used by the synthesizer to bucket players for archetype matching
  roleClassification: {
    star:        { minRating: 85 },
    starter:     { minRating: 70, maxRating: 84, minAvgMin: 25 },
    'role-player': { minRating: 55, maxRating: 69, minAvgMin: 18 },
    bench:       { maxRating: 54,   maxAvgMin: 18 },
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_HOUSE_STYLE };
}
