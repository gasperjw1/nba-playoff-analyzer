// ============================================================
// NEWS FEED — curated injury/availability/correction notes
// ============================================================
// Each entry is a manual write-up sourced from beat reporters
// (ESPN/NBC/CBS/etc.). Newest first.
//
// Schema:
//   date     : 'YYYY-MM-DD'         when the news broke
//   severity : 'major' | 'minor' | 'info'
//   series   : SERIES_DATA.id slug   (links to series tab)
//   headline : short bold line
//   body     : 1-3 sentences of context
//   source   : reporter / outlet
// ============================================================

const NEWS = [
  {
    date: '2026-05-06',
    severity: 'major',
    series: 'NYK-PHI',
    headline: '🚨 Embiid OUT for tonight\'s G2',
    body: 'Right ankle sprain + right hip soreness. Ruled out morning of May 6 after he could not participate in shootaround. PHI starts: Maxey / Edgecombe / Oubre / George / Drummond. NYK ML re-priced -260 → -450; spread -6.5 → -10.5; Embiid Over 22.5 prop voided.',
    source: 'ESPN / NBC Sports Philadelphia',
  },
  {
    date: '2026-05-06',
    severity: 'minor',
    series: 'DET-CLE',
    headline: 'Allen back to full minutes',
    body: 'Reportedly off the injury report — knee tendonitis cleared. His return raises CLE\'s ceiling vs G1 conditions, and downgrades DET ML from BEST BET to a MEDIUM lean. Huerter (DET) GTD thigh; Merrill (CLE) GTD hamstring.',
    source: 'Yardbarker',
  },
  {
    date: '2026-05-06',
    severity: 'minor',
    series: 'SAS-MIN',
    headline: 'Edwards questionable for G2',
    body: 'Knee bothered him at the end of G1 — listed as QUESTIONABLE per latest reports. He played G1 on restricted minutes. Bet reasoning was already factoring his limited capacity.',
    source: 'ClutchPoints',
  },
  {
    date: '2026-05-06',
    severity: 'info',
    series: 'OKC-LAL',
    headline: 'Correction: J.Williams was OUT for G1',
    body: 'Prior G1 recap incorrectly stated J.Williams played 20 minutes. Per NBA.com he was OUT (Grade 1 hamstring), week-to-week. Recap and ML reasoning corrected: OKC won G1 by 18 *without* Williams — a more impressive signal for OKC, not less.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-05',
    severity: 'minor',
    series: 'OKC-LAL',
    headline: 'Reaves still severely limited (oblique)',
    body: 'R2 G1: 3-16 FG (19%), 0-5 3PT, 4 TOs, -10 in 36min. Cannot drive, explode, or finish. Model downgraded from 80% to 50-55% capacity — major LAL liability heading into G2.',
    source: 'ESPN box score',
  },
  {
    date: '2026-05-04',
    severity: 'major',
    series: 'OKC-LAL',
    headline: 'Doncic OUT — Grade 2 hamstring',
    body: 'No return timeline. Expected out at least through May 9 per CBS Sports. LAL proved they can win without him in R1 (4-2 vs HOU), but OKC is a different tier.',
    source: 'CBS Sports',
  },
];
