// ============================================================
// BETS DATA — declarative schema (Phase 55 PoC)
// ============================================================
// Every bet is a plain object; rendering is unified in bet-card.js.
//
// Schema:
//   id          : string              stable, unique
//   slate       : 'R2-G2' | …          for grouping/filtering
//   series      : 'NYK-PHI' | …        matches SERIES_DATA.id
//   game        : 1..7
//   postedAt    : 'YYYY-MM-DD'
//   type        : 'ml' | 'spread' | 'total' | 'prop' | 'parlay'
//   pick        : string              human-readable
//   odds        : string              keep as written ('-260', '+150')
//   facts       : [{label, value}]    structured replacement for pipe-separated bet-line
//   chs         : { delta, tone }     null | tone: 'boost'|'caution'|'mixed'
//   modelHook   : { fn, args }        optional dynamic field (resolved at render time)
//   reasoning   : string              free-form, allows <strong>
//   confidence  : 'best-bet' | 'high' | 'medium' | 'lean' | 'coin-flip'
//   thesis      : string[]            ['model','matchup','regression','historical','situational','market']
//   narrative   : 'bounce-back' | 'desperation' | 'rest-edge' | null
//   result      : null | { outcome, actual, pl }

const BETS = [
  // ─── R2 G2 NYK-PHI (Tue May 6, 7:30 PM ET @ MSG, NYK leads 1-0) ──────
  {
    id: 'r2-g2-nyk-phi-ml',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'ml',
    pick: 'NYK ML vs PHI',
    odds: '-260',
    facts: [
      { label: 'Spread', value: 'NYK -6.5' },
      { label: 'Total', value: 'O/U 214.5' },
    ],
    modelHook: { fn: 'dml', args: ['NYK-PHI', 2] },
    reasoning: "<strong>NYK won G1 by 39 — most lopsided R2 game in a decade.</strong> PHI gets 2 extra days rest which helps, and Embiid historically bounces back after bad games. But NYK's systemic advantages remain: MSG home court (9.2 clutch NetRtg), Brunson locked in (35pts on 67% FG), depth that suffocated PHI's 7-man rotation. NYK shooting will regress from 63%/51% — but even at normal efficiency they win by 6+. Embiid's conditioning post-appendectomy remains a Q3/Q4 concern.",
    confidence: 'best-bet',
    thesis: ['model', 'situational'],
    narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-spread',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'spread',
    pick: 'NYK -6.5',
    odds: '-110',
    facts: [{ label: 'Edge', value: 'vs spread' }],
    modelHook: { fn: 'dmargin', args: ['NYK-PHI', 2] },
    reasoning: "Model says {{winner}} by {{margin}}. PHI's rest helps but bench depth remains a fatal flaw. If Embiid has bounce-back (28+ pts), PHI covers. If not, NYK wins by 8-12. Lean NYK but this is the riskier play vs ML.",
    confidence: 'lean',
    thesis: ['model'],
    narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-brunson-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop',
    pick: 'Jalen Brunson Over 26.5 points',
    odds: '-120',
    facts: [
      { label: 'G1', value: '35pts (12-18 FG)' },
      { label: 'Playoff avg', value: '28.6pts' },
      { label: 'Venue', value: 'MSG home' },
      { label: 'Matchup', value: 'PnR vs Embiid/Drummond' },
    ],
    chs: { delta: +2.5, tone: 'boost' },
    reasoning: "<strong>Brunson dropped 35 in G1 on 67% FG — and the line is only 26.5.</strong> PHI has no answer for the Brunson-KAT PnR. Embiid can't switch at speed post-appendectomy. Drummond is BBQ chicken. Brunson has hit O27.5 in 6 of his last 8 playoff games. At MSG, he's virtually guaranteed 25+ floor with 35+ ceiling. <strong style=\"color:var(--purple)\">CHS boost:</strong> Historical home-vs-PHI + PnR-mismatch scenarios add +2.5pts to projection (27→29.5).",
    confidence: 'high',
    thesis: ['matchup', 'historical'],
    narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-embiid-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop',
    pick: 'Joel Embiid Over 22.5 points',
    odds: '-115',
    facts: [
      { label: 'G1', value: 'only 14pts (3-11)' },
      { label: 'Spot', value: 'Bounce-back' },
      { label: 'Rest', value: '2 extra days' },
    ],
    chs: { delta: 'mixed', tone: 'mixed', detail: '-8 / +4' },
    reasoning: "Embiid's 14pts in G1 was his worst playoff game in 3 years. With 2 extra days rest, his hip settles and conditioning improves. Historically bounces back hard after bad games (avg 32pts in bounce-back games). <strong style=\"color:var(--purple)\">CHS tension:</strong> Two competing scenarios — post-appendectomy + blowout loss historically correlates with -8pts (conditioning collapse), BUT pride bounce-back after bad games correlates with +4pts. Higher variance than Brunson prop.",
    confidence: 'coin-flip',
    thesis: ['regression', 'historical'],
    narrative: 'bounce-back',
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-anunoby-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop',
    pick: 'OG Anunoby Over 14.5 points',
    odds: '-110',
    facts: [
      { label: 'G1', value: '18pts (7-8 FG)' },
      { label: 'Trend', value: 'Elite efficiency continues' },
    ],
    reasoning: "OG went 7-8 from the field in G1 — PHI has no one who can match his combination of size and skill. With Brunson drawing doubles, OG gets clean looks. He's averaged 15.2pts in the last 6 playoff games. The 14.5 line undervalues his current hot streak.",
    confidence: 'medium',
    thesis: ['matchup'],
    narrative: null,
    result: null,
  },
];

// Slate metadata (header info)
const BET_SLATES = {
  'R2-G2': {
    label: 'Round 2 — Game 2',
    games: [
      { series: 'NYK-PHI', when: 'Tue May 6, 7:30 PM ET @ MSG', context: 'NYK leads 1-0',
        recap: "<strong style=\"color:var(--green)\">G1 Recap:</strong> NYK 137-98 blowout. Brunson 35pts (12-18 FG). NYK shot 63% FG, 51% 3PT. Embiid was a shell (3-11, -24). Maxey 3-9, 4TO. PHI fatigue from 48hr turnaround was catastrophic. <strong>Key G2 Factor:</strong> PHI has 2 extra days rest now. Shooting regression expected for NYK. Embiid's pride bounce-back is the variable." },
    ],
  },
};
