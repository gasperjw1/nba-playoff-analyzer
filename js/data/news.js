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
    date: '2026-05-07',
    severity: 'major',
    series: 'NYK-PHI',
    headline: 'NYK 108-102: Knicks lead series 2-0 (G2 result)',
    body: 'Tight game with 25 lead changes (most in any playoff game in 11 years), 14 ties — neither team led by more than 7 all night. Brunson 26 (go-ahead bucket 5:06 left), OG Anunoby 24 (left late, status uncertain), KAT 20/10/7. Maxey 26 but cold Q4 (PHI 3-16 / 18.8% in 4th). PHI shot 38% from 3 vs NYK 27% but lost on TOV (+5 NYK) and Q4 collapse. Hart\'s 3 with 6:52 left after PHI led 99-96 sparked the close. Pre-Phase-56 model nailed the margin (NYK by 6 exactly).',
    source: 'ESPN / NBA.com',
  },
  {
    date: '2026-05-07',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'SAS 133-95: Largest playoff loss in MIN franchise history',
    body: 'Spurs evened series 1-1 with the worst playoff defeat in Wolves franchise history (surpassed the 2003 30-pt loss to LAL). Castle 21, Wemby 19/15reb (bounce-back), Fox 16. SAS shot 50% FG, 41% 3PT (vs G1 41%/28%) — regression thesis MASSIVELY validated. MIN trailed 25 at halftime; Edwards/Randle/McDaniels/Shannon all stuck at 12pts. Finch quote: "I just told them we got punked."',
    source: 'NBA.com / KSAT',
  },
  {
    date: '2026-05-07',
    severity: 'minor',
    series: 'NYK-PHI',
    headline: 'Embiid GTD for G3 (Fri May 8 in PHI)',
    body: 'Day-to-day per ESPN heading into Friday\'s Game 3 in Philadelphia. Two days rest after sitting G2 with right ankle sprain + hip soreness. Heavy: "could be back" but "no official guarantee." Decision will hinge on the Friday morning injury report.',
    source: 'ESPN / Heavy / Inquirer',
  },
  {
    date: '2026-05-07',
    severity: 'minor',
    series: 'NYK-PHI',
    headline: 'OG Anunoby GTD G3 (left G2 late, unspecified)',
    body: 'OG had 24pts (10-15 FG) before exiting late in G2 with an unspecified issue and not returning. Status for Friday\'s G3 unclear. If he\'s out, NYK\'s wing depth (Bridges, Hart, McBride) absorbs minutes but PHI\'s scheme can hunt the gap.',
    source: 'ESPN recap',
  },
  {
    date: '2026-05-07',
    severity: 'info',
    series: 'NYK-PHI',
    headline: 'Bug found + fixed: Embiid had duplicate activeInjury keys',
    body: 'Phase 56 set Embiid to severity:1.0 (OUT) but an older severity:0.4 entry on the same player object silently overrode it (last duplicate key wins in JS). The engine never saw him as truly OUT. Fix: consolidated into single activeInjury reflecting current G3 GTD status. Pre-Phase-56 prediction (NYK by 6) was actually the correct one — narrative-driven re-pricing to NYK -10.5 was an overreaction that would have lost the spread bet by 4.5 points.',
    source: 'Internal model audit',
  },
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
