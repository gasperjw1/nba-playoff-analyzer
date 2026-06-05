// ============================================================
// EXTERNAL RESEARCH — web-sourced evidence for Council agents
// ============================================================
// The Fatigue / Matchup / Coaching agents in council.js read this
// file in addition to local boxScore/series-data so they can cite
// analyst quotes + beat-reporter stats they couldn't compute locally.
//
// Schema per finding:
//   series        : 'SAS-NYK'                            — series id
//   game          : 1 (lookback) or 'pre-2' (forward)    — relevance
//   subject       : 'Victor Wembanyama' | 'TEAM:SAS'     — what it's about
//   signalType    : 'fatigue' | 'coaching' | 'matchup'   — which agent uses it
//   finding       : '...'                                — extracted claim
//   quote         : 'optional quote'                     — direct citation if available
//   source        : 'Yahoo Sports'                       — outlet
//   sourceURL     : 'https://...'                        — full URL for verification
//   weight        : 0..1                                 — analyst credibility × specificity
//   collectedAt   : ISO date
//
// Process: Claude does the web research as part of the daily routine
// (or pre-game prep) and writes findings to this file. Each agent's
// research method then queries by subject + signalType.
// ============================================================

const EXTERNAL_RESEARCH = [
  // ─── WEMBY FATIGUE (multiple sources, post-G1) ─────────────────
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'Victor Wembanyama', signalType: 'fatigue',
    finding: 'Wemby looked visibly fatigued from the first quarter of G1 per ESPN analysis; system channeled all efforts through his limbs vs a physical Knicks team',
    quote: 'I felt Victor Wembanyama was low on energy from the first quarter',
    source: 'Brian Windhorst (ESPN)',
    sourceURL: 'https://www.hitc.com/he-might-deny-it-espn-reporter-highlights-victor-wembanyama-issue-that-could-cost-spurs/',
    weight: 0.85,
    collectedAt: '2026-06-04',
  },
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'Victor Wembanyama', signalType: 'fatigue',
    finding: 'Wemby tired down the stretch of G1; could not finish the comeback that the Spurs nearly mounted',
    quote: 'Wemby looked tired',
    source: 'Bill Simmons',
    sourceURL: 'https://sports.yahoo.com/nba/article/nba-finals-why-victor-wembanyama-looked-gassed-against-the-knicks-at-the-end-of-game-1-loss-045810247.html',
    weight: 0.7,
    collectedAt: '2026-06-04',
  },
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'Victor Wembanyama', signalType: 'fatigue',
    finding: 'WCF avg 37.7 min/game (heavy load Wemby was not conditioned for — regular season <30 min); Finals G1 continued the 38-min load. Multiple analysts converging on fatigue narrative.',
    source: 'Sports Illustrated / Awful Announcing aggregation',
    sourceURL: 'https://awfulannouncing.com/nba/victor-wembanyama-fatigued-finals.html',
    weight: 0.8,
    collectedAt: '2026-06-04',
  },

  // ─── KORNET / BACKUP-C LIMITATION ──────────────────────────────
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'TEAM:SAS', signalType: 'matchup',
    finding: 'Kornet averaged only 11.5 min/game in WCF vs OKC; he is the primary (and only) backup behind Wemby. SAS system has no viable C alternative if Wemby tires — forces Wemby to high minutes regardless of fatigue.',
    source: 'Fantasy Team Advice / Basketball-Reference',
    sourceURL: 'https://fantasyteamadvice.com/nba/players/252/luke-kornet/postseason',
    weight: 0.6,
    collectedAt: '2026-06-04',
  },

  // ─── NYK ROAD DOMINANCE ────────────────────────────────────────
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'TEAM:NYK', signalType: 'momentum',
    finding: 'NYK is the FIRST team in NBA history with 7 straight double-digit playoff road wins (now extended to 8 after G1). 12 consecutive playoff wins overall — only 7th club in NBA history to reach this milestone.',
    source: 'NBA.com / Newsweek',
    sourceURL: 'https://www.newsweek.com/sports/nba/jalen-brunson-knicks-make-nba-playoff-history-with-game-1-win-over-spurs-12029940',
    weight: 0.9,
    collectedAt: '2026-06-04',
  },

  // ─── BROWN ADJUSTMENT COMPETENCE (with specific G1 numbers) ────
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'COACH:Brown', signalType: 'coaching',
    finding: 'G1 specific adjustments: SAS fast-break pts 24 H1 → 9 H2. NYK turnovers 8 H1 → 1 H2. NYK 2nd-chance pts 23 vs SAS 14. Brown explicitly credited Rick Brunson (asst) for the H1 read.',
    source: 'The Athletic / NBA.com',
    sourceURL: 'https://www.nba.com/news/rick-brunson-calms-kincks-2026-nba-finals',
    weight: 0.85,
    collectedAt: '2026-06-04',
  },

  // ─── DISSENTING VOICE (important for adversarial check) ────────
  {
    series: 'SAS-NYK', game: 'pre-2',
    subject: 'Victor Wembanyama', signalType: 'fatigue',
    finding: 'COUNTER: Chris Paul publicly downplayed Wemby fatigue concerns. Spurs HC Mitch Johnson REFUSED to cite fatigue as an excuse. Wemby himself downplayed and focused on individual execution.',
    quote: 'I am not worried about him being tired or anything',
    source: 'Chris Paul (via ClutchPoints)',
    sourceURL: 'https://clutchpoints.com/nba/san-antonio-spurs/chris-paul-downplays-concerns-about-victor-wembanyama-playoff-fatigue',
    weight: 0.4, // dissenting; lower weight but should be visible in evidence
    collectedAt: '2026-06-04',
  },
];

function getExternalFindings(seriesId, subject, signalType) {
  return EXTERNAL_RESEARCH.filter(r =>
    r.series === seriesId &&
    (subject === undefined || r.subject === subject) &&
    (signalType === undefined || r.signalType === signalType)
  );
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXTERNAL_RESEARCH, getExternalFindings };
}
