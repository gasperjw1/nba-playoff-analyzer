// ============================================================
// BETS DATA — declarative schema (Phase 55)
// ============================================================
// Every bet is a plain object; rendering is unified in bet-card.js.
//
// Schema:
//   id          : string              stable, unique
//   slate       : 'R2-G1' | 'R2-G2' | …  for grouping/filtering
//   series      : 'NYK-PHI' | …        matches SERIES_DATA.id
//   game        : 1..7
//   postedAt    : 'YYYY-MM-DD'
//   type        : 'ml' | 'spread' | 'total' | 'prop' | 'parlay'
//   pick        : string              human-readable
//   odds        : string              keep as written ('-260', '+150')
//   facts       : [{label, value}]    structured replacement for pipe-separated bet-line
//   chs         : { delta, tone, detail? }  null | tone: 'boost'|'caution'|'mixed'
//   modelHook   : { fn, args }        optional dynamic field
//   reasoning   : string              free-form, allows <strong>; supports {{winner}} / {{margin}}
//   confidence  : 'best-bet' | 'high' | 'medium' | 'lean' | 'coin-flip'
//   thesis      : string[]            ['model','matchup','regression','historical','situational','market']
//   narrative   : 'bounce-back' | 'desperation' | 'rest-edge' | null
//   result      : null | { outcome: 'win'|'loss'|'push', actual: '...' }

const BETS = [

  // ═══════════════════════════════════════════════════════════════
  // R2 G1 — ARCHIVED (Sun May 4 / Mon May 5)
  // ═══════════════════════════════════════════════════════════════

  // ─── NYK-PHI G1 — NYK 137-98 (+39 blowout) ───────────────────
  {
    id: 'r2-g1-nyk-phi-ml',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-290',
    facts: [{label:'Spread',value:'NYK -7.5'},{label:'Total',value:'O/U 213.5'}],
    modelHook: { fn:'dml', args:['NYK-PHI',1] },
    reasoning: "<strong>NYK has 6 days rest vs PHI's 2 after a grueling G7 in Boston.</strong> Embiid played 39min in G7 (hip contusion + post-appendectomy) with a 48-hour turnaround to MSG. PHI's 3-1 comeback proves mental toughness but the physical toll is severe. NYK depth (OG/Bridges/Hart/McBride/Shamet) grinds PHI's 7-man rotation by Q3. Brunson (9.2 clutch NetRtg) feasts in PnR vs compromised Embiid. R1 G1 home favorites covered 7/8 (88%).",
    confidence: 'best-bet', thesis: ['model','market'], narrative: 'rest-edge',
    result: { outcome:'win', actual:'NYK 137-98' },
  },
  {
    id: 'r2-g1-nyk-phi-spread',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'spread', pick: 'NYK -7.5', odds: '-112',
    facts: [{label:'Risk',value:'PHI Q3 collapse'}],
    modelHook: { fn:'dmargin', args:['NYK-PHI',1] },
    reasoning: "Model says {{winner}} by {{margin}} — covers -7.5. PHI will compete early but fatigue hits in Q3. Embiid CAN dominate on the road (34/12 vs BOS G7) but at what physical cost? NYK bench depth (McBride, Shamet, Clarkson vs PHI's Grimes/Barlow) is a massive quality gap.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'NYK by 39' },
  },
  {
    id: 'r2-g1-nyk-phi-brunson-pts',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Jalen Brunson Over 27.5 points', odds: '-115',
    facts: [{label:'Playoff avg',value:'28.6pts'},{label:'Venue',value:'MSG home'},{label:'Matchup',value:'PnR vs tired Embiid'}],
    reasoning: "Brunson averaged 28.6pts in R1 with 9.2 clutch net rating at MSG. PHI perimeter defense will be compromised by fatigue. Brunson's PnR with KAT creates open lanes. The 27.5 line is below his playoff average — one of the safest props on the board.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'win', actual:'35pts' },
  },
  {
    id: 'r2-g1-nyk-phi-embiid-under',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Embiid Under 28.5 points', odds: '-110',
    facts: [{label:'Rest',value:'48hr after 39min G7'},{label:'Health',value:'Hip contusion'}],
    reasoning: "Embiid dropped 34/12/6 in G7 but that was an elimination game with adrenaline. G1 on 2 days rest with a hip contusion is different. OG Anunoby is an elite post defender. Expect 22-26pts on lower efficiency as Embiid conserves energy for a long series.",
    confidence: 'medium', thesis: ['matchup','situational'], narrative: null,
    result: { outcome:'win', actual:'14pts (3-11)' },
  },

  // ─── SAS-MIN G1 — MIN 104-102 (upset) ────────────────────────
  {
    id: 'r2-g1-sas-min-ml',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-345',
    facts: [{label:'Spread',value:'SAS -9.5'},{label:'Total',value:'O/U 220.5'}],
    modelHook: { fn:'dml', args:['SAS-MIN',1] },
    reasoning: "<strong>Edwards is expected to play (Shams, May 4).</strong> Line moved from -11.5 to -9.5. Edwards at 80% (knee) still transforms MIN, but SAS at Frost Bank Center (62-20) with Wemby healthy (34ppg vs MIN) is extremely tough. DiVincenzo OUT for the season — MIN 3PT depth is gutted. Fox/Castle/Champagnie give SAS bench advantage.",
    confidence: 'best-bet', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'MIN 104-102' },
  },
  {
    id: 'r2-g1-sas-min-under',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'total', pick: 'Under 220.5', odds: '-105',
    facts: [{label:'Pace',value:'Edwards limited reduces transition'}],
    modelHook: { fn:'dml', args:['SAS-MIN',1] },
    reasoning: "Edwards at 80% means fewer transition opportunities. SAS plays half-court controlling pace. Both teams have elite rim protectors (Wemby, Gobert). Model projects 217 total — 3.5pts under the line.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'206 total' },
  },
  {
    id: 'r2-g1-sas-min-wemby-pts',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Wembanyama Over 24.5 points', odds: '-110',
    facts: [{label:'vs MIN',value:'34ppg reg season'},{label:'Matchup',value:'Gobert mid-range feast'}],
    reasoning: "Wemby averaged 34ppg vs MIN — Gobert protects the rim but Wemby's mid-range is unguardable at 7-4. Had 17/14/6blk in closeout G5 while coasting. In a competitive R2 G1, expect him to assert early. One of the strongest props on the slate.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'11pts (5-17, 0-8 3PT)' },
  },
  {
    id: 'r2-g1-sas-min-edwards-under',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Edwards Under 26.5 points (if playing)', odds: '-115',
    facts: [{label:'Capacity',value:'~80% (knee)'},{label:'Minutes',value:'Likely 28-32'}],
    reasoning: "Edwards coming off knee hyperextension + bone bruise will play limited minutes (28-32) without usual explosion. SAS wing D (Castle, Barnes, Champagnie) is elite. Expect jump shots over rim attacks. At 80%, efficiency drops to 20-24pt range.",
    confidence: 'medium', thesis: ['matchup','situational'], narrative: null,
    result: { outcome:'win', actual:'18pts in 25min' },
  },

  // ─── DET-CLE G1 — DET 111-101 ────────────────────────────────
  {
    id: 'r2-g1-det-cle-ml',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-155',
    facts: [{label:'Spread',value:'DET -3.5'},{label:'Total',value:'O/U 214.5'}],
    modelHook: { fn:'dml', args:['DET-CLE',1] },
    reasoning: "<strong>The closest R2 matchup.</strong> Both finished grueling G7s with equal rest (3 days). DET has #1 defense (107.2 DRtg) and best home record (31-9). CLE has triple-initiator offense (Mitchell/Harden/Mobley). Cade showed dual-mode (45pts G5, 32/12ast G7). Harris G7 breakout (30pts, 5/7 3PT) gives DET a legit #2. But CLE bench (Strus, Tyson, Merrill) is elite. NOT a best bet — small play or skip.",
    confidence: 'lean', thesis: ['model','situational'], narrative: null,
    result: { outcome:'win', actual:'DET 111-101' },
  },
  {
    id: 'r2-g1-det-cle-under',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [{label:'Defense',value:'DET #1 (107.2 DRtg)'},{label:'Rest',value:'Both off G7s'}],
    modelHook: { fn:'dml', args:['DET-CLE',1] },
    reasoning: "<strong>Best value bet on the R2 G1 slate.</strong> DET has #1 defense (107.2 DRtg). Both teams just played 7-game series with 3 days rest. G1s in R2 after 7-game R1s historically run ~5pts under total. CLE relies on Mitchell/Harden creation but DET perimeter D (A.Thompson, D-LEBRON 2.93) will suppress first-option scoring. Model at 209 vs line at 214.5 = 5.5pts of edge.",
    confidence: 'best-bet', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'212 total' },
  },
  {
    id: 'r2-g1-det-cle-cade-pts',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'Cade Cunningham Over 24.5 points', odds: '-115',
    facts: [{label:'G7',value:'32pts'},{label:'R1',value:'25+ in 5/7 games'},{label:'Venue',value:'LCA home'}],
    reasoning: "Cade showed dual-mode dominance (45 G5, 32/12ast G7). Against CLE, expect scorer mode — Mitchell/Harden won't guard him. At home in LCA, he attacks early to set the tone. The 24.5 line is very beatable.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'loss', actual:'23pts' },
  },
  {
    id: 'r2-g1-det-cle-mitchell-pts',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'Donovan Mitchell Over 24.5 points', odds: '-115',
    facts: [{label:'Clutch',value:'8.5 rating'},{label:'R1',value:'26.8ppg'},{label:'Style',value:'Physical = FTAs'}],
    reasoning: "Mitchell has 8.5 clutch rating and averaged 26.8pts in R1. Against DET defense, he'll need to be aggressive — expect 7+ FTA. His mid-range game is harder to suppress than 3PT. Even in losses, Mitchell consistently scores 25+.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'24pts (8-19)' },
  },

  // ─── OKC-LAL G1 — OKC 108-90 (+18) ───────────────────────────
  {
    id: 'r2-g1-okc-lal-ml',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-1050',
    facts: [{label:'Spread',value:'OKC -15.5'},{label:'Total',value:'O/U 213.5'}],
    modelHook: { fn:'dml', args:['OKC-LAL',1] },
    reasoning: "<strong>OKC is the most complete team in the NBA (64-18, +11.6 NetRtg) vs Doncic-less LAL.</strong> OKC went 4-0 vs LAL with 31.8pt avg margin. Swept PHX in R1 with 11 days rest. SGA (31.1ppg, 67% TS) feasts on LAL's limited perimeter D. LeBron at 41 is a fatigue risk. Holmgren neutralizes Ayton. OKC depth means no drop-off. ML is safe but expensive — best in a parlay.",
    confidence: 'best-bet', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'OKC 108-90' },
  },
  {
    id: 'r2-g1-okc-lal-spread',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'spread', pick: 'OKC -15.5', odds: '-110',
    facts: [{label:'Risk',value:'LeBron floor'}],
    modelHook: { fn:'dml', args:['OKC-LAL',1] },
    reasoning: "Model says {{winner}} by {{margin}}. OKC's 31.8pt avg margin vs LAL suggests upside, but LeBron provides a floor. The smart play is ML in a parlay, not the spread alone.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'OKC by 18' },
  },
  {
    id: 'r2-g1-okc-lal-sga-pts',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'SGA Over 28.5 points', odds: '-115',
    facts: [{label:'R1',value:'31.1ppg on 67% TS'},{label:'Rest',value:'11 days'},{label:'Defense',value:'LAL has none w/o Doncic'}],
    reasoning: "SGA averaged 31.1ppg on 67% TS in R1 vs PHX's better defense. With 11 days rest, he'll be fully loaded. Smart is solid but can't contain SGA for 36min. The 28.5 line is well below his playoff average.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'18pts (7 TOs)' },
  },
  {
    id: 'r2-g1-okc-lal-lebron-pts',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'LeBron Over 25.5 points', odds: '-110',
    facts: [{label:'Mode',value:'Legacy'},{label:'Usage',value:'Higher w/o Doncic'},{label:'Hedge',value:'Hits in any game script'}],
    reasoning: "LeBron carries massive usage without Doncic (28.2ppg R1 at 41). In a blowout, OKC pulls starters and LeBron scores against the bench. In a competitive game, he scores on volume. The over hits regardless of game script.",
    confidence: 'medium', thesis: ['situational'], narrative: 'desperation',
    result: { outcome:'win', actual:'27pts (12-17)' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G2 — LIVE PICKS (Tue May 6 / Wed May 7 / Thu May 7)
  // ═══════════════════════════════════════════════════════════════

  // ─── NYK-PHI G2 (Tue May 6, 7:30 PM ET @ MSG, NYK leads 1-0) ──
  {
    id: 'r2-g2-nyk-phi-ml',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-450 (re-priced)',
    facts: [{label:'Original line',value:'-260'},{label:'After Embiid OUT',value:'-450 to -550'},{label:'Spread',value:'NYK -10.5'}],
    modelHook: { fn:'dml', args:['NYK-PHI',2] },
    reasoning: "🚨 <strong>Embiid OUT — ankle sprain + hip soreness (ruled out morning of game).</strong> The single biggest line-mover possible. PHI loses their 26.9ppg #1 scorer, interior gravity, post-up offense, and foul-drawing. Drummond starts at C — provides rebounding only, no offensive creation, gets pulled out of the paint by KAT stretch-5. NYK was already favored heavily with healthy Embiid; now this is structurally over. Maxey will absorb usage but is shaken from -28 G1. The ML is now expensive but virtually risk-free — best leveraged in a parlay with another correlated leg (Brunson over, NYK -10).",
    confidence: 'best-bet', thesis: ['situational','model','market'], narrative: null,
    result: { outcome: 'win', actual: 'NYK 108-102 (won by 6)' },
  },
  {
    id: 'r2-g2-nyk-phi-spread',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'NYK -10.5 (revised from -6.5)', odds: '-110',
    facts: [{label:'Original',value:'NYK -6.5 (pre-Embiid news)'},{label:'Revised',value:'NYK -10.5 to -12.5'}],
    modelHook: { fn:'dmargin', args:['NYK-PHI',2] },
    reasoning: "<strong>Embiid OUT changes everything for the spread.</strong> Without their primary scorer, PHI's ceiling collapses to ~95pts. Model now projects NYK by 12-15. Even at the revised -10.5, this is a clean cover unless NYK plays deep bench in a Q4 garbage-time scenario (possible — they did pull starters in G1 blowout). Best play: NYK -10.5 if available, or pivot to NYK team total over.",
    confidence: 'high', thesis: ['situational','model'], narrative: null,
    result: { outcome: 'loss', actual: 'NYK +6 (108-102) — did not cover -10.5. Phase 56 narrative-driven re-pricing was an overreaction; pre-Embiid-OUT model line of NYK -6.5 was correct.' },
  },
  {
    id: 'r2-g2-nyk-phi-brunson-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Jalen Brunson Over 26.5 points', odds: '-120',
    facts: [
      {label:'G1',value:'35pts (12-18 FG)'},
      {label:'Playoff avg',value:'28.6pts'},
      {label:'Venue',value:'MSG home'},
      {label:'Matchup',value:'PnR vs Drummond (no Embiid)'},
    ],
    chs: { delta: +2.5, tone: 'boost' },
    reasoning: "<strong>Brunson dropped 35 in G1 on 67% FG — and now Embiid is OUT.</strong> Drummond cannot switch in PnR and provides zero perimeter resistance. Without Embiid's interior gravity, NYK can run Brunson-KAT PnR all night with no consequence. Risk: NYK leads big and Brunson sits Q4 (he played only 31min G1 in the blowout). If the game stays close enough for him to play 35+min, this clears 30 easily. Even with garbage-time risk, the floor is 25+. <strong style=\"color:var(--purple)\">CHS boost:</strong> Historical home-vs-PHI + PnR-mismatch +2.5pts.",
    confidence: 'high', thesis: ['matchup','historical','situational'], narrative: null,
    result: { outcome: 'loss', actual: 'Brunson 26pts (9-21 FG) — under 26.5 by half a point. Game stayed close (25 lead changes), Edgecombe defense early held him below his usual ceiling.' },
  },
  {
    id: 'r2-g2-nyk-phi-embiid-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Joel Embiid Over 22.5 points', odds: 'VOID',
    facts: [{label:'Status',value:'BET VOIDED — Embiid OUT'}],
    reasoning: "🚨 <strong>VOIDED — Embiid ruled OUT for G2 (May 6 morning).</strong> Right ankle sprain + right hip soreness. Did not participate in shootaround. All Embiid props void/refunded. Pre-game thesis (CHS-conflicted bounce-back vs conditioning collapse) is moot.",
    confidence: 'medium', thesis: [], narrative: null,
    result: { outcome:'void', actual:'Embiid OUT — bet voided' },
  },
  {
    id: 'r2-g2-nyk-phi-anunoby-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'OG Anunoby Over 14.5 points', odds: '-110',
    facts: [{label:'G1',value:'18pts (7-8 FG)'},{label:'Trend',value:'Elite efficiency continues'},{label:'Embiid OUT',value:'fewer help defenders'}],
    reasoning: "OG went 7-8 from the field in G1 — and now PHI is even more compromised with Embiid OUT. Drummond can't help-defend the perimeter. With Brunson drawing primary attention, OG gets clean looks. He's averaged 15.2pts in the last 6 playoff games. Garbage-time risk applies (NYK could blow this open by Q3) but the floor is solid.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome: 'win', actual: 'OG Anunoby 24pts (10-15 FG, 2-4 3PT) — easy cover. Left late with unspecified issue but had clinched the over by then.' },
  },
  {
    id: 'r2-g2-nyk-phi-drummond-reb',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Andre Drummond Over 11.5 rebounds', odds: '-115 (typical)',
    facts: [{label:'Starts',value:'at C w/ Embiid OUT'},{label:'Minutes',value:'30+ expected'},{label:'Career',value:'Elite rebounder'}],
    reasoning: "<strong>NEW BET (post-Embiid news):</strong> Drummond gets the start at C with Embiid OUT. He played only 9-20min behind Embiid in prior games but is one of the best per-minute rebounders in NBA history. Expect 30+ min vs KAT/Mitchell Robinson. KAT is a stretch-5 who pulls Drummond outside, opening the offensive glass for putbacks. Even in a blowout loss, Drummond rebounds — his counting stats are blowout-proof. Confirm line is ≤11.5 before betting.",
    confidence: 'medium', thesis: ['situational'], narrative: null,
    result: { outcome: 'loss', actual: 'Drummond 8reb in 24min — got into foul trouble (Bona/Barlow had to cover Cs in emergency). Minutes capped at 24 instead of expected 30+; rebounding chance compressed.' },
  },

  // ─── SAS-MIN G2 (Wed May 7, 9:00 PM ET @ Frost Bank, MIN leads 1-0) ──
  {
    id: 'r2-g2-sas-min-ml',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-220',
    facts: [{label:'Spread',value:'SAS -5.5'},{label:'Total',value:'O/U 216.5'}],
    modelHook: { fn:'dml', args:['SAS-MIN',2] },
    reasoning: "<strong>SAS shot 28% 3PT in G1 (10-36) vs their 37.5% season average.</strong> That's ~3.5 extra makes expected in G2 = +10.5pts of shooting regression alone. Wemby's 0-8 3PT was a career aberration — he's a 37.5% shooter who will bounce back. Fox (0-4 3PT, -13) is also due. MIN proved competitive but needed SAS to have their worst shooting game all season to win by 2. Dosunmu returns for MIN which helps, but the math strongly favors SAS regression.",
    confidence: 'best-bet', thesis: ['regression','model'], narrative: null,
    result: { outcome: 'win', actual: 'SAS 133-95 — largest playoff loss in MIN franchise history. Regression thesis VALIDATED MASSIVELY (SAS 41% from 3 vs G1 28%). Best bet hit.' },
  },
  {
    id: 'r2-g2-sas-min-spread',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'SAS -5.5', odds: '-110',
    facts: [{label:'Logic',value:'Regression supports it'}],
    modelHook: { fn:'dmargin', args:['SAS-MIN',2] },
    reasoning: "Model says {{winner}} by {{margin}}. If Wemby makes just 2 threes (his season avg is 2.8/game), that adds 6pts to G1's margin and SAS wins by ~8. Edwards' minutes will expand but knee limits explosiveness. Lean cover but it's razor-thin.",
    confidence: 'lean', thesis: ['regression','model'], narrative: null,
    result: { outcome: 'win', actual: 'SAS 133-95 — covered -5.5 by 32.5 points. Massive blowout.' },
  },
  {
    id: 'r2-g2-sas-min-wemby-pts',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Victor Wembanyama Over 22.5 points', odds: '-125',
    facts: [
      {label:'G1',value:'only 11pts (5-17, 0-8 3PT)'},
      {label:'Season avg',value:'24.8'},
      {label:'vs MIN',value:'34ppg reg season'},
    ],
    chs: { delta: +3.8, tone: 'boost' },
    reasoning: "<strong>Wemby scored only 11pts in G1 on his worst shooting night ever (0-8 3PT, 5-17 FG).</strong> This is a 24.8ppg scorer who averaged 34ppg vs MIN in the regular season. The 0-8 3PT is a statistical anomaly for a 37.5% shooter — regression alone adds 8-10pts to his scoring output. <strong style=\"color:var(--purple)\">CHS boost:</strong> Compound scenarios (post-bad-shooting + home court + vs-Gobert-mismatch) add +3.8pts to projection, pushing expected output to 28-30pts. CHS and statistical regression align — strongest convergence signal on the board.",
    confidence: 'high', thesis: ['regression','matchup','historical'], narrative: 'bounce-back',
    result: { outcome: 'loss', actual: 'Wemby 19/15 — under 22.5 by 3.5. Bounce-back happened (7-12 FG, 1-3 3PT, attacked rim more) but blowout meant he sat early in Q4. CHS boost was right in direction but Wemby gave way to bench in 38pt rout.' },
  },
  {
    id: 'r2-g2-sas-min-edwards-pts',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Anthony Edwards Over 19.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts in 25min'},
      {label:'Minutes',value:'Expect 30+ G2'},
      {label:'Health',value:'Knee holding'},
    ],
    chs: { delta: -5.0, tone: 'caution' },
    reasoning: "Edwards scored 18pts in just 25min in G1 (8-13 FG = 62%). If knee holds, expect 30+ minutes and likely a starting role in G2. <strong style=\"color:var(--purple)\">CHS caution:</strong> Historical scenarios for knee-restricted players in away R2 games show -5pts suppression (limited explosion, fewer drives, more jump shots against elite rim protection). The 19.5 line is actually well-calibrated when CHS is applied — this becomes a coin flip prop rather than a clear over. Proceed with caution.",
    confidence: 'coin-flip', thesis: ['historical','situational'], narrative: null,
    result: { outcome: 'loss', actual: 'Edwards 12pts (4-13 FG, 1-5 3PT) in 24min off bench. CHS caution was correct: knee + rust + blowout context all suppressed him. 4-way 12pt tie (Edwards/Randle/McDaniels/Shannon) showed nobody could create when down big.' },
  },
  {
    id: 'r2-g2-sas-min-fox-pts',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: "De'Aaron Fox Over 17.5 points", odds: '-110',
    facts: [
      {label:'G1',value:'only 10pts (5-14, 0-4 3PT, -13)'},
      {label:'Season avg',value:'18.5'},
    ],
    reasoning: "Fox had his worst game of the playoffs in G1 — passive, 0-4 3PT, -13. Coaching staff will demand more PnR aggression with Wemby. His season avg is 18.5ppg and he averaged 20+ in R1. The 17.5 line is deflated by G1 — bounce-back to 20+ is likely.",
    confidence: 'medium', thesis: ['regression','matchup'], narrative: 'bounce-back',
    result: { outcome: 'loss', actual: 'Fox 16pts (6-12 FG, 2-4 3PT, 7ast) — under 17.5 by 1.5. Bounce-back hit (more efficient than G1) but he sat in Q4 with SAS up 25+. Same blowout-cap issue as Wemby.' },
  },

  // ─── DET-CLE G2 (Thu May 7, 7:00 PM ET @ LCA, DET leads 1-0) ──
  {
    id: 'r2-g2-det-cle-ml',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-162',
    facts: [{label:'Spread',value:'DET -4.5'},{label:'Total',value:'O/U 214.5'},{label:'Injury',value:'Huerter (DET) GTD thigh; Merrill (CLE) GTD hamstring'}],
    modelHook: { fn:'dml', args:['DET-CLE',2] },
    reasoning: "<strong>DET's #1 defense forced 19 CLE turnovers in G1 — that's structural, not variance.</strong> Ivey/Cunningham/Thompson trapping scheme overwhelms CLE's ball-handlers. <strong>UPDATE (May 6):</strong> Per Yardbarker, Jarrett Allen is OFF the injury report and expected back to full minutes — that raises CLE's ceiling significantly (rim protection + lob threat returns). Mitchell, Cunningham, Mobley all healthy. Huerter (DET) is GTD with a thigh issue, Merrill (CLE) GTD hamstring. With Allen healthy this becomes more of a coin flip than the original best-bet read — DET's turnover scheme is still scheme-based and hard to adjust away from in one practice, but CLE has more ammo. Downgraded from BEST BET to MEDIUM lean.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'DET 107-97 — Cade 25/10ast (12 of his 25 in Q4 closing run), Tobias Harris 21, D.Robinson 17 (5-9 3PT). Allen healthy this time (22pts/7reb) but Mitchell\'s 31pts in a loss couldn\'t overcome DET\'s defensive structure.' },
  },
  {
    id: 'r2-g2-det-cle-spread',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'spread', pick: 'DET -3.5', odds: '-110',
    facts: [{label:'Risk',value:'CLE coaching adjust + Allen return'}],
    modelHook: { fn:'dmargin', args:['DET-CLE',2] },
    reasoning: "Model says {{winner}} by {{margin}}. CLE coaching adjustments expected (faster ball movement to beat traps, less Mitchell ISO). But DET's turnover generation is scheme-based — hard to adjust away from in one practice. If Allen plays 30+min, CLE's ceiling rises and this becomes a GRIND. Lean cover.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome: 'win', actual: 'DET +10 (107-97) — covered -3.5 by 6.5. Allen (22/7) raised CLE ceiling but Cade\'s Q4 closing run pulled away.' },
  },
  {
    id: 'r2-g2-det-cle-cade-pts',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'Cade Cunningham Over 27.5 points', odds: '-118',
    facts: [
      {label:'G1',value:'23pts (8-16 FG)'},
      {label:'Series proj',value:'22-26pts'},
    ],
    chs: { delta: -0.9, tone: 'caution' },
    reasoning: "<strong>Cade had 23pts + 7ast in G1 — completely controlled the game.</strong> CLE has no elite POA defender to match him. Mitchell/Garland are undersized and can't bother his size (6'6). His PnR with Duren generated 8 easy buckets. <strong style=\"color:var(--purple)\">CHS note:</strong> Compound scenarios show -0.9pts suppression from CLE's blitzing scheme (trapping ball-handlers, forcing turnovers). Minor enough that the Over still has edge at 21.5 — Cade's G1 floor of 23 is well above the line. CHS drag is minimal.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Cade 25pts/10ast — under 27.5 by 2.5 (12 of his 25 in Q4 means he was at ~13 through 3Q). Facilitator-mode game; Q4 closing run got him to 25 but CLE\'s blitzing held volume below the line.' },
  },
  {
    id: 'r2-g2-det-cle-mitchell-pts',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'Donovan Mitchell Under 27.5 points', odds: '-135',
    facts: [
      {label:'G1',value:'24pts (8-19 FG)'},
      {label:'Trend',value:'<24.5 in 6 straight vs top-10 D'},
      {label:'Engine projection',value:'24pts'},
    ],
    chs: { delta: -3.0, tone: 'caution' },
    reasoning: "<strong>FLIP from Over to Under after market re-pricing.</strong> Original line was 24.5; current DK line is 27.5 — books moved up after Mitchell's 24-pt G1 + the expectation he'd bounce back from 6 TOs. But our engine projects 24pts and Mitchell has gone Under 24.5 in 6 straight vs top-10 defenses (avg 20.5). DET has the #1 defense in the league. <strong style=\"color:var(--purple)\">CHS caution:</strong> Compound scenarios for Mitchell vs aggressive trapping defense + cold-shooting LCA crowd suggest 3pt suppression — Mitchell ceiling caps around 25pts. Under 27.5 at -135 is the play.",
    confidence: 'medium', thesis: ['historical','model'], narrative: null,
    result: { outcome: 'loss', actual: 'Mitchell 31pts/3ast/6reb/2stl/2to — game-high. Bounced back hard from G1 — engine projection (24) and CHS suppression read (-3pts) both wrong. The 6-game Under streak vs top-10 D snapped at LCA.' },
  },

  // ─── OKC-LAL G2 (Thu May 7, 9:30 PM ET @ Paycom, OKC leads 1-0) ──
  {
    id: 'r2-g2-okc-lal-ml',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-900',
    facts: [{label:'Spread',value:'OKC -14.5'},{label:'Total',value:'O/U 204.5'}],
    modelHook: { fn:'dml', args:['OKC-LAL',2] },
    reasoning: "<strong>OKC won G1 by 18 with SGA having his WORST game of the year (7 TOs) and Jalen Williams OUT (Grade 1 hamstring).</strong> That's the floor — and it was an 18-point win without their #2 scorer. <strong>G2 update:</strong> J.Williams remains week-to-week per Daigneault — likely still OUT. Reaves is at 50% capacity (3-16 FG, oblique severe). LeBron can score 30 and it doesn't matter — LAL has NO depth to compete with OKC's bench (outscored LAL 34-15). Holmgren owns the Ayton matchup (24/12/3blk). The -800 is justified — this is the most lopsided matchup in R2 even without Williams.",
    confidence: 'best-bet', thesis: ['model','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'OKC 125-107 — won by 18, exactly matching G1 margin. Holmgren 22/9 again, Reaves bounced back to 31 (10-16) but LAL had 21 TOs that OKC turned into 26 pts.' },
  },
  {
    id: 'r2-g2-okc-lal-spread',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'spread', pick: 'OKC -15.5', odds: '-110',
    facts: [{label:'G1',value:'OKC by 18'},{label:'Risk',value:'Garbage time backdoor'}],
    modelHook: { fn:'dmargin', args:['OKC-LAL',2] },
    reasoning: "Model says OKC by {{margin}}. G1 was +18 with SGA at his worst. With SGA cleaning up TOs (7→3 expected) and J.Williams ramping, OKC gets STRONGER. LAL has no adjustment available — their problem is personnel (Reaves hurt, no Doncic, no bench). Only risk: OKC garbage time gives LAL backdoor cover. Lean spread but ML is safer.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome: 'win', actual: 'OKC -15.5 covered by 2.5 (won by 18). 21 LAL TOs gave OKC the cushion — exactly the SGA-recovery + LAL-thin-depth thesis the lean was built on.' },
  },
  {
    id: 'r2-g2-okc-lal-holmgren-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'Chet Holmgren Under 22.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'24pts (9-17 FG, 3-7 3PT) vs Hayes'},
      {label:'Playoff avg',value:'18.6 ppg'},
      {label:'Engine projection',value:'17pts'},
      {label:'Note',value:'Line ≈22.5 — verify on DK before placing; daily checklist will refresh'},
    ],
    reasoning: "<strong>FLIP from Over to Under after market re-pricing.</strong> Original line was 18.5 (Holmgren is a 18.6 ppg playoff scorer with a G1 ceiling game); current DK line is around 22.5 after the books raised on his G1 explosion. Engine projects 17pts in G2 — well under the new line. Reasons: (a) blowout context likely caps his Q4 minutes (engine: OKC by 22), (b) G1's 3-7 3PT is regression-vulnerable (career playoff 3PT ~32%), (c) Hartenstein/J.Williams ramping up = fewer FG attempts for Holmgren. Under 22.5 has solid edge per engine + variance.",
    confidence: 'medium', thesis: ['model','regression'], narrative: null,
    result: { outcome: 'win', actual: 'Holmgren 22pts/9reb — squeaked under by 0.5. Engine read (17) too low but the regression-from-G1-ceiling thesis was right; the line being at 22.5 (not 18.5) made this only a half-point cushion.' },
  },
  {
    id: 'r2-g2-okc-lal-sga-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'SGA Over 29 points', odds: '-120',
    facts: [
      {label:'G1',value:'18pts (7 TOs — career-anomaly)'},
      {label:'Season avg',value:'31.1 ppg'},
      {label:'Engine projection',value:'36pts'},
      {label:'Line moved',value:'24.5 → 29 (book overcorrected on G1 anomaly)'},
    ],
    chs: { delta: +2.3, tone: 'boost' },
    reasoning: "Line update: was 24.5 (-115), now 29 (-120) on DK. SGA's 18-pt / 7-TO G1 was career-anomaly (regular-season high TO was 5). At 29 the line is back near his playoff avg, but the engine still projects 36pts — bounce-back + home + weak LAL perimeter D (Smart only). <strong style=\"color:var(--purple)\">CHS boost:</strong> Post-turnover correction + home + matchup adds +2.3. The book moved the line up to ~true mean; the engine says he overshoots that mean tonight. Strongest prop on the slate.",
    confidence: 'high', thesis: ['regression','historical','model'], narrative: 'bounce-back',
    result: { outcome: 'loss', actual: 'SGA 22pts — under 29 by 7. Foul trouble limited him; OKC still won by 18 because Holmgren and the bench did the damage. Engine\'s 36-pt projection and CHS +2.3 boost both wildly off — TWO straight games SGA failed to dominate scoring-wise yet OKC up 2-0.' },
  },
  {
    id: 'r2-g2-okc-lal-lebron-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'LeBron James Over 23.5 points', odds: '+185',
    facts: [
      {label:'G1',value:'27pts (12-17 FG, 71%)'},
      {label:'Engine projection',value:'25pts'},
      {label:'Line moved',value:'26.5 → 23.5 (book aggressive on Under at -250)'},
      {label:'Risk',value:'Garbage time / blowout caps minutes'},
    ],
    reasoning: "<strong>Marginal play — book strongly favors Under (-250) at 23.5.</strong> Original line was 26.5 (-110); current DK line is 23.5 with Over priced at +185 / Under at -250. The book is signaling that LeBron's Q4 minutes will be capped by an OKC blowout. Engine projects 25pts (slim 1.5pt over edge). LeBron-as-only-LAL-scorer thesis still holds, but blowout-cap risk is real. The +185 plus odds reflect reality — only worth a small stake. SKIP if you're risk-averse, lean Over only for the price.",
    confidence: 'lean', thesis: ['situational','matchup'], narrative: 'desperation',
    result: { outcome: 'loss', actual: 'LeBron 23pts (9-18, 6 ast) — under 23.5 by 0.5. Book read it perfectly — Reaves took the scoring load (31), LeBron facilitator-mode in a blowout context. Same 0.5-pt heartbreak pattern as Brunson 5/6.' },
  },
  {
    id: 'r2-g2-okc-lal-under',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'total', pick: 'Under 209.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198'},
      {label:'Defense',value:'OKC elite'},
      {label:'LAL',value:'Half-court struggles'},
    ],
    reasoning: "<strong>G1 total was only 198 — well under the 213.5 line.</strong> OKC's defense held LAL to 42% FG and 33% 3PT. LAL can't score in the half-court against OKC's length (Holmgren, Dort, Wallace). Pace will be slow again — LAL grinds possessions trying to create vs OKC's switching. The 204.5 adjusted line still feels too high. Lean under.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Total 232 — over 209.5 by 22.5. LAL\'s offense actually clicked (Reaves 31, LeBron 23, but the 21 TOs flipped into easy OKC transition pts pushed pace+conversion well above G1\'s grind. The "OKC slow grind" thesis broke when LAL turned the ball over instead of playing methodical half-court.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G3 — LIVE PICKS (Fri May 8: NYK-PHI + SAS-MIN)
  // ═══════════════════════════════════════════════════════════════

  // ─── NYK-PHI G3 (Fri May 8, 7:00 PM ET @ Wells Fargo, NYK leads 2-0) ──
  {
    id: 'r2-g3-nyk-phi-ml',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '+100',
    facts: [
      {label:'Spread',value:'PHI -1.5'},
      {label:'Total',value:'O/U 214.5'},
      {label:'Series',value:'NYK leads 2-0'},
      {label:'Embiid',value:'GTD per pre-game (back from 5/6 OUT)'},
      {label:'OG Anunoby',value:'Questionable (left G2 late, did not return)'},
    ],
    modelHook: { fn:'dml', args:['NYK-PHI',3] },
    reasoning: "<strong>NYK ML at +100 is the cleanest value on the slate.</strong> The model has NYK by 6 even with HCA flipping to PHI; DK has it pickem-ish (PHI -1.5 / NYK +100). That's a 7-pt model edge on a coin-flip price. The case for NYK: (a) 2-0 lead → no desperation, can play loose, (b) Brunson + KAT + Bridges trio still healthier than PHI's stars, (c) +9.2 clutchNetRtg for closing tight games — NYK won G2 19-12 in Q4 despite worse shooting. The case for PHI: (a) Embiid back tightens the math significantly — interior gravity returns, (b) Brunson's road FT volume drops sharply (3.3 makes road vs 6.6 at MSG), (c) PHI desperation, (d) home crowd. <strong>Net read:</strong> If Embiid plays at 75%+ AND OG is OUT, PHI by 2-3 is fair. If OG plays OR Embiid is genuinely limited, NYK by 4-6. Given the 50/50 on those swing factors, NYK +100 is the better side of the model edge.",
    confidence: 'medium', thesis: ['model','market','situational'], narrative: null,
    result: { outcome:'win', actual:'NYK 108-94 (NYK won outright at +100)' },
  },
  {
    id: 'r2-g3-nyk-phi-spread',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'spread', pick: 'NYK +1.5', odds: '-105',
    facts: [
      {label:'Model',value:'NYK by 6'},
      {label:'Market',value:'PHI -1.5'},
      {label:'Cushion',value:'7.5pts model vs market'},
    ],
    modelHook: { fn:'dmargin', args:['NYK-PHI',3] },
    reasoning: "Stacking the same edge as the ML — model says NYK by 6, market gives them +1.5. Even if Embiid plays well and PHI wins, the 1.5-pt cushion is meaningful (G2 was a 6-pt game with 25 lead changes — the kind of finish where the spread is the better bet than the ML). Risk: if Embiid is BACK and dominant + crowd lifts PHI, a 5-7 pt PHI win is plausible.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'NYK won by 14 (108-94, line +1.5 covered easily)' },
  },
  {
    id: 'r2-g3-nyk-phi-brunson-pts',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Jalen Brunson Under 26.5 points', odds: '-118',
    facts: [
      {label:'Series avg',value:'30.5 ppg (35 G1, 26 G2)'},
      {label:'Road FT',value:'3.3 makes road vs 6.6 at MSG'},
      {label:'PHI defense',value:'Will continue G2 doubling/blitzing scheme'},
    ],
    chs: { delta: -2.0, tone: 'caution' },
    reasoning: "<strong>FLIP from Over to Under for road game.</strong> Brunson's 35-26 in G1-G2 is misleading — G1 was a 39-pt blowout where he played 31min with full ceiling-mode; G2 PHI shifted to blitzing/double-teaming and held him to 9-21 FG (43%). The blitzing scheme persists G3 + the road FT volume drop (per game logs, Brunson averages 3.3 made FT on road vs 6.6 at MSG — that's 3 fewer points right there). At 26.5 with the trend toward 23-25 expected, Under has clear edge. <strong style=\"color:var(--purple)\">CHS caution:</strong> Road game + opponent-adjustment scheme + FT compression compounds to -2.0pts.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'loss', actual:'Brunson 33pts (11-22 FG, 38min) — 24th career 30+ playoff game; under 26.5 missed' },
  },
  {
    id: 'r2-g3-nyk-phi-kat-reb',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'KAT Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'G1',value:'17/6/1ast'},
      {label:'G2',value:'20/10reb/7ast (full triple-double-line)'},
      {label:'Matchup',value:'vs Drummond/Bona/Barlow (Embiid-out fallback Cs)'},
      {label:'Note',value:'If Embiid plays, KAT pulls him out of paint = even more rebounding lanes'},
    ],
    reasoning: "KAT had a near-triple-double in G2 (20/10/7) and his rebounding has been consistently strong in this series. PHI's interior is thin; even if Embiid returns, KAT's stretch-5 game pulls him out of the paint, opening up offensive boards. KAT averaged 9.6rpg in the regular season and has cleared 9.5 in 7 of last 10 playoff games. The line is well-calibrated — small edge on the over.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'KAT 12 reb (8pts/12reb/7ast in 26min, 4 OREB) — over 9.5 hit' },
  },
  {
    id: 'r2-g3-nyk-phi-brunson-ast',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Jalen Brunson Over 4.5 assists', odds: '-145',
    facts: [
      {label:'Career playoff avg',value:'7.0 ast/game'},
      {label:'Series',value:'3 G1 (blowout, 31min), 5 G2 (38min)'},
      {label:'PHI doubling',value:'Forces Brunson to facilitate more — boosts assist rate'},
    ],
    reasoning: "<strong>Floor-grade prop.</strong> Brunson's career playoff average is 7+ ast and his assist rate INCREASES under pressure (PHI's G2 blitzing scheme led to 5 ast in 38min as he kicked out of doubles). Going to 4.5 gives a 2.5-cushion below his expected output. Even in G1's blowout where he played only 31min, he had 3 ast in limited rotation. As long as he plays 30+min, this clears comfortably. ~85-90% historical hit rate at this line.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'Brunson 9 ast — over 4.5 hit comfortably (career playoff floor confirmed)' },
  },
  {
    id: 'r2-g3-nyk-phi-total',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'235 (NYK 137-98 = blowout pace)'},
      {label:'G2 total',value:'210 (108-102 = grind game)'},
      {label:'G3 expected',value:'Grind — neither team blowing out'},
    ],
    reasoning: "G2 was a 210-total grind. Without Embiid, PHI scored 102 — they need that pace to compete. With Embiid back, the offense improves but pace slows further (post-up touches, foul-drawing). NYK is happy to play half-court grind to lock down a road win. Both teams have incentives that favor lower pace/total. Lean under.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'Total 202 (108+94) — under 214.5 hit (PHI offense never sustained pace)' },
  },

  // ─── SAS-MIN G3 (Fri May 8, 9:30 PM ET @ Target Center, Tied 1-1) ──
  {
    id: 'r2-g3-sas-min-ml',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-198',
    facts: [
      {label:'Spread',value:'SAS -3.5'},
      {label:'Total',value:'O/U 215.5'},
      {label:'Series',value:'Tied 1-1'},
      {label:'Wemby G2',value:'19/15 in 26min (rim-attack approach worked)'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',3] },
    reasoning: "<strong>SAS's tactical overhaul in G2 was structural.</strong> The 38-pt blowout wasn't just regression — Pop shifted to faster pace, more pressure on Conley/Randle, and Wemby attacking the rim instead of settling for 3s. That scheme persists on the road. MIN coming off the worst playoff loss in franchise history (Finch: 'we got punked') will be desperate, but they've shown a structural ceiling problem: with Edwards on a knee restriction (12pts/24min off bench in G2), MIN's IC drops to ~1.5 and the 4-way 12-pt scoring tie among Edwards/Randle/McDaniels/Shannon shows nobody can reliably create. SAS at -198 reflects that asymmetry. Edwards moving to 30+min could compress to SAS by 2-3, but the road favorite price is still the right side.",
    confidence: 'high', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'SAS 115-108 (SAS won outright at -198) — Wemby 39/15/5blk' },
  },
  {
    id: 'r2-g3-sas-min-spread',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'spread', pick: 'SAS -3.5', odds: '-110',
    facts: [
      {label:'Model',value:'SAS by 9 baseline (compresses to 2-3 if Edwards is 32+min)'},
      {label:'G2',value:'SAS won by 38 — extreme but tactical-driven'},
      {label:'Risk',value:'MIN home crowd + post-blowout desperation'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',3] },
    reasoning: "Model says SAS by 9 baseline → compresses to SAS by 2-3 if Edwards plays 32+min near G1 efficiency. The market's 3.5 sits right on that floor. Lean cover but the variance is wider — if MIN's home crowd lifts them and Edwards is closer to G1 (18pts/25min) than G2 (12pts/24min), this could be a 1-3 pt SAS win.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'SAS won by 7 (115-108) — covered -3.5 by 3.5pts' },
  },
  {
    id: 'r2-g3-sas-min-wemby-reb',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Victor Wembanyama Over 12.5 rebounds', odds: '-140',
    facts: [
      {label:'G1',value:'15reb (40min)'},
      {label:'G2',value:'15reb (32min)'},
      {label:'Pattern',value:'Back-to-back 15-reb games'},
      {label:'Counting stat',value:'Blowout-proof'},
    ],
    reasoning: "<strong>Sharpest prop on the slate.</strong> Wemby has 15reb in BOTH games this series. Going to 12.5 gives a 2.5-reb cushion below his series floor. As a counting stat, rebounds accumulate even if the game gets out of hand (G2 he had 15 in just 32min during a 38-pt blowout). Gobert is the only matchup that contests him and Gobert struggled in G2 (9reb). Real hit rate ~85-90%.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 15 reb — third straight 15-rebound game; over 12.5 hit (sharpest prop on slate confirmed)' },
  },
  {
    id: 'r2-g3-sas-min-wemby-pts',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Victor Wembanyama Under 25.5 points', odds: '-104',
    facts: [
      {label:'G1',value:'11pts (5-17 FG, 0-8 3PT)'},
      {label:'G2',value:'19pts (7-12 FG, 1-3 3PT)'},
      {label:'Series avg',value:'15ppg through 2'},
      {label:'Road regression',value:'SAS shooting expected to drop ~5pp on road'},
    ],
    reasoning: "Books opened around 27.5 with some pricing 25.5 (-104). Wemby's series scoring is averaging just 15ppg — both games have been below 25.5. On the road in a hostile environment with expected SAS shooting regression (50%/41% home G2 → ~46%/36% road), and with Wemby's rim-attack approach producing efficient-but-not-volume scoring (19pts in 32min G2), the under has clear edge at 25.5. If you can find 27.5, even better.",
    confidence: 'medium', thesis: ['regression','historical'], narrative: null,
    result: { outcome:'loss', actual:'Wemby 39pts (career playoff explosion) — under 25.5 missed badly. Rim-attack approach unlocked his ceiling, not just his floor.' },
  },
  {
    id: 'r2-g3-sas-min-wemby-blocks',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Victor Wembanyama Over 1.5 blocks', odds: '-300',
    facts: [
      {label:'G1',value:'12 blocks (career playoff record)'},
      {label:'G2',value:'5 blocks'},
      {label:'Career playoff avg',value:'4.2 blocks/game'},
      {label:'Independence',value:'Defensive engine, not tied to offensive flow'},
    ],
    reasoning: "<strong>Best floor prop on the entire slate.</strong> Wemby has 12 blocks (!) in G1 and 5 in G2 — he\'s the most prolific shot-blocker in the playoffs by a wide margin. Going to 1.5 gives a stunning 3+ block cushion below his series floor. The line is juiced steep (-300) precisely because the books know this is near-automatic. Counting-stat blocks accumulate even in blowouts — he had 5 in G2 during a 38-pt SAS rout. ~95% historical hit rate. Use as the anchor leg in any floor parlay.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 5 blocks — Kareem/Hakeem/Shaq company stat line. Over 1.5 hit (~95% historical confirmed).' },
  },
  {
    id: 'r2-g3-sas-min-edwards-reb',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Anthony Edwards Under 4.5 rebounds', odds: '-118',
    facts: [
      {label:'G1',value:'3reb (25min)'},
      {label:'G2',value:'3reb (24min)'},
      {label:'Reg season vs SAS',value:'Under 4 reb in 2 of 3 games'},
      {label:'Knee',value:'Limits drives + rebounding aggression'},
    ],
    reasoning: "Edwards has been under 4 rebounds in BOTH games this series, in 2 of 3 reg-season games vs SAS, and his knee restriction limits the drives and put-back attacks that produce rebounding. Even if Edwards is bumped to 32+min in G3 starting role, the knee means he stays on the perimeter. Under 4.5 has clear historical and structural edge.",
    confidence: 'high', thesis: ['historical','situational'], narrative: null,
    result: { outcome:'loss', actual:'Edwards 7 reb (15pts/7reb/1ast in starter return) — under 4.5 missed. Starter minutes + emotional return + early aggression broke the bench-knee-restricted pattern.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G3 — ARCHIVE (Sat May 9: OKC-LAL + DET-CLE)
  // ═══════════════════════════════════════════════════════════════

  // ─── OKC-LAL G3 (Sat May 9, 8:30 PM ET @ Crypto.com, OKC leads 2-0) ──
  {
    id: 'r2-g3-okc-lal-ml',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-375',
    facts: [
      {label:'Spread',value:'OKC -8.5'},
      {label:'Total',value:'O/U 211.5'},
      {label:'Series',value:'OKC leads 2-0'},
      {label:'G1',value:'OKC 108-90 (+18)'},
      {label:'G2',value:'OKC 125-107 (+18)'},
    ],
    modelHook: { fn:'dml', args:['OKC-LAL',3] },
    reasoning: "<strong>OKC won G1 AND G2 by identical 18-point margins</strong> despite very different game scripts (G1: SGA off night/7 TOs; G2: Reaves 31pt bounce-back for LAL). The structural gap is proven — depth, defense, length. HCA flips to LAL at Crypto.com (~3pts compression), but LAL has no Doncic, no answer to OKC bench depth. Even Reaves at his G2 best (31pts) + LeBron (23) = 54 from primaries and still lost by 18. OKC ML at -375 is expensive but the engine gives ~80% win probability even on the road.",
    confidence: 'high', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'OKC 131-108 LAL ✅. Won by 23 — same +18-style structural blowout, but bigger.' },
  },
  {
    id: 'r2-g3-okc-lal-spread',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'spread', pick: 'OKC -8.5', odds: '-110',
    facts: [
      {label:'Model',value:'OKC by 10'},
      {label:'Market',value:'OKC -8.5'},
      {label:'G1+G2 avg margin',value:'+18'},
    ],
    modelHook: { fn:'dmargin', args:['OKC-LAL',3] },
    reasoning: "Model projects OKC by 10 even at Crypto.com. Both G1 (+18) and G2 (+18) cleared 8.5 by a mile. HCA compression brings it closer but the structural gap (OKC bench outscored LAL bench both games, OKC defense held LAL to 42% and then forced 21 TOs) is real. -8.5 covers if OKC wins by 9+, which the model says is the median outcome.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'OKC won by 23 — covered -8.5 by 14.5pts.' },
  },
  {
    id: 'r2-g3-okc-lal-sga-pts',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'SGA Over 24.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts (7 TOs, worst game)'},
      {label:'G2',value:'22pts (foul trouble, blowout bench)'},
      {label:'Career playoff avg',value:'~29 ppg'},
      {label:'Context',value:'Hasn\'t gone full-volume yet — G3 at LAL is when stars demand the ball'},
    ],
    reasoning: "<strong>SGA has been on cruise control (18, 22).</strong> OKC has won both games with SGA at his floor — Holmgren and bench carrying. G3 on the road is when superstars typically ramp up volume. His career playoff average is ~29ppg and he hasn't cracked 25 yet this series. With J.Williams fully ramped (absorbing some creation) and LAL desperation, SGA will need to score to close out road games. 24.5 is still 5pts below his career playoff mean.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SGA 23pts (7-20 FG, 3-7 3PT, 6-7 FT) — narrowly missed by 1.5pts. Cruise control again with bench (A.Mitchell 24, Wallace 16, Joe 12) doing the work. Right thesis (SGA capable of 28+) but wrong forecast — he stayed in cruise.' },
  },
  {
    id: 'r2-g3-okc-lal-holmgren-reb',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'Holmgren Over 8.5 rebounds', odds: '-140',
    facts: [
      {label:'G1',value:'12 rebounds'},
      {label:'G2',value:'9 rebounds'},
      {label:'Matchup',value:'Ayton is the only LAL big — Holmgren dominates boards'},
    ],
    reasoning: "Holmgren has cleared 8.5 in BOTH games (12, 9). The Ayton matchup is solved — Holmgren's length and mobility dominate the glass. Even at Crypto.com, the rebounding matchup doesn't change. Counting stat that's blowout-proof (he pulled 12 in G1's 18-pt blowout). ~87% hit rate at this line based on series and recent form.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'Holmgren 9 rebounds (9-14 FG, 18pts) ✅. Cleared 8.5 by 0.5 — close but the floor held.' },
  },
  {
    id: 'r2-g3-okc-lal-lebron-pts',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'LeBron Over 22.5 points', odds: '-160',
    facts: [
      {label:'G1',value:'27pts (12-17 FG, 71%)'},
      {label:'G2',value:'23pts (9-18 FG, facilitator mode)'},
      {label:'Independence',value:'Scores 23+ even in 18-pt losses — blowout-proof'},
    ],
    reasoning: "<strong>LeBron's scoring is independent of OKC blowing them out.</strong> G1: 27pts in 18-pt loss. G2: 23pts in 18-pt loss. At home in a do-or-die game, he'll play 36+min and be even more aggressive. 22.5 gives 0.5-pt cushion below his G2 output (worst game of series). Floor-grade prop for the greatest scorer in playoff history.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'LeBron 19pts (7-19 FG, 2-6 3PT, 3-4 FT, 8 ast/6 reb) — facilitator mode at age 41 in 37min. Missed by 3.5. WRONG thesis: "scoring is independent of OKC blowing them out." Reality: in a 23-pt loss with Reaves regressed, LeBron pivoted to playmaker. The 27 G1 / 23 G2 floor broke when LAL had no second creator.' },
  },
  {
    id: 'r2-g3-okc-lal-total',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'total', pick: 'Over 211.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198 (grind, SGA off)'},
      {label:'G2 total',value:'232 (turnover-driven track meet)'},
      {label:'Avg',value:'215'},
    ],
    reasoning: "G1 was a 198 grind; G2 was a 232 track meet driven by 21 LAL TOs converting to OKC transition points. At Crypto.com, LAL plays more aggressively (home crowd + desperation) which means more possessions but also more TOs. G2's 232 suggests the pace can get high when LAL pushes. 211.5 is below the 2-game average of 215. Lean over — LAL's desperation drives pace up.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'OKC 131 + LAL 108 = 239 — Over 211.5 by 27.5pts. LAL desperation drove pace exactly as predicted.' },
  },

  // ─── DET-CLE G3 (Sat May 9, 3:00 PM ET @ Rocket Mortgage, DET leads 2-0) ──
  {
    id: 'r2-g3-det-cle-ml',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'ml', pick: 'CLE ML vs DET', odds: '-175',
    facts: [
      {label:'Spread',value:'CLE -4.5'},
      {label:'Total',value:'O/U 211.5'},
      {label:'Series',value:'DET leads 2-0'},
      {label:'Context',value:'CLE home — desperation + Mitchell 31pt rhythm'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',3] },
    reasoning: "<strong>HCA flips to CLE — engine baseline compresses from DET by 2 to CLE by 2-3.</strong> DK is even more bullish on CLE (CLE -4.5). Mitchell's 31-pt G2 showed rhythm; Allen is healthy (22/7 G2); CLE home crowd + 0-2 desperation should produce max effort. The model still gives CLE the edge at home (~62%) but DET's road-travel defense is travel-proof (scheme-driven). This is the closest game on the slate. CLE ML at -175 is the side the model leans.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'CLE 116-109 DET ✅. Mitchell 35/10reb, Harden bounce-back 19, Allen 18, Strus go-ahead steal. CLE bench finally outscored DET bench. Won by 7 — model said by 4, market said by 4.5. Both close.' },
  },
  {
    id: 'r2-g3-det-cle-spread',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'spread', pick: 'DET +4.5', odds: '-110',
    facts: [
      {label:'Model',value:'CLE by 4'},
      {label:'Market',value:'CLE -4.5'},
      {label:'DET road defense',value:'Scheme-driven, travel-proof'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',3] },
    reasoning: "Model says CLE by 4, market has CLE -4.5. DET +4.5 gives 0.5-pt cushion on the model's projection. DET's defense traveled well in R1 road games and their scheme (wing pressure, trapping Harden) is system-based, not crowd-dependent. Cade's Q4 closing ability (12 of 25 in Q4 G2) means DET can win any tight game. Getting 4.5 on a team that won both home games by 10 feels generous.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'DET lost by 7 — failed to cover +4.5 by 2.5pts. Cade triple-double (27/10/10) was the high-volume mode the spread needed but his 8 TOs + 10-27 FG (37%) erased the +EV. Q4 closing failed when Strus stole and scored go-ahead.' },
  },
  {
    id: 'r2-g3-det-cle-mitchell-pts',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'Donovan Mitchell Over 27.5 points', odds: '-120',
    facts: [
      {label:'G1',value:'23pts (A.Thompson limited him)'},
      {label:'G2',value:'31pts (game-high)'},
      {label:'At home',value:'Mitchell averages 29.4 ppg at home in playoffs'},
      {label:'Desperation',value:'Down 0-2, CLE needs him at his best'},
    ],
    reasoning: "Mitchell's 31-pt G2 showed he's found rhythm against DET's defense. At home in a must-win context, his aggression should increase. Career home playoff average is ~29ppg. 27.5 is well below his G2 output and right at his home baseline. A.Thompson will still defend him but CLE's home crowd amplifies his drives. Clear over territory.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'Mitchell 35pts (13-24 FG, 2-8 3PT, 7-8 FT, 10reb, 4ast) — sustained 31-pt G2 form. Cleared 27.5 by 7.5pts. Home aggression thesis validated.' },
  },
  {
    id: 'r2-g3-det-cle-cade-ast',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'Cade Cunningham Over 6.5 assists', odds: '-130',
    facts: [
      {label:'G1',value:'7 assists (scorer-distributor mode)'},
      {label:'G2',value:'10 assists (facilitator mode)'},
      {label:'Dual-mode',value:'Both games above 6.5 — floor-grade prop'},
    ],
    reasoning: "<strong>Cade has cleared 6.5 assists in BOTH games (7, 10).</strong> His dual-mode flexibility means he's distributing at an elite level regardless of scoring mode. On the road, CLE's defense may tighten on his scoring — which INCREASES assists as he kicks out. 6.5 gives 0.5-pt cushion below his G1 floor. ~85% hit rate based on series form.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Cade 10 assists (also 27pts/10reb triple-double on 10-27 FG). Cleared 6.5 by 3.5. Dual-mode floor held even on a high-volume scoring night.' },
  },
  {
    id: 'r2-g3-det-cle-total',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'total', pick: 'Under 211.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'212 (DET 111-101)'},
      {label:'G2 total',value:'204 (DET 107-97)'},
      {label:'CLE 3PT',value:'26% in series (11-42) — catastrophic'},
    ],
    reasoning: "G2 total was 204, trending down from G1's 212. CLE's 3PT shooting is in crisis (26% for series). DET's defense (#1 in NBA) is scheme-driven and travels. Even at home, CLE's perimeter issues won't magically fix themselves (Merrill DNP, Strus 1-6 3PT G2). Both teams grind — expect another low-scoring affair. Under 211.5 has series trend support.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome:'loss', actual:'Total 225 (CLE 116 + DET 109) — Over by 13.5pts. CLE 58% FG / 38% 3PT (12-32) was the bounce-back the model didn\'t fully price. Merrill returning + Schroder 3-3 from 3 / 11pts off bench killed the "CLE shooting crisis" thesis.' },
  },

  // ─── NYK-PHI G4 (Sun May 10, 3:30 PM ET @ Wells Fargo, NYK leads 3-0) ──
  {
    id: 'r2-g4-nyk-phi-ml',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-122',
    facts: [
      {label:'Spread',value:'NYK -1.5'},
      {label:'Total',value:'O/U 213.5'},
      {label:'Series',value:'NYK leads 3-0 (sweep cliff)'},
      {label:'G3',value:'NYK 108-94 at Wells Fargo (Brunson 33/9ast, George 0-9 after Q1)'},
      {label:'Injuries',value:'Embiid PROBABLE (hip), OG Anunoby QUESTIONABLE (hamstring)'},
    ],
    modelHook: { fn:'dml', args:['NYK-PHI',4] },
    reasoning: "<strong>NYK swept G1+G2+G3 with structural dominance.</strong> Engine baseline NYK by 8-9; HCA flip + PHI desperation compress to NYK by 4. Closeout dynamics: G4 sweep favorites win ~70% but cover only ~50% ATS — backdoor losses common. PHI's IC=2 ceiling (Maxey + George + half-Embiid) was capped at 94 in G3 even with home court. Even if Maxey shoots back to mean and George recovers from his Q1-only collapse, PHI's ceiling is still ~105. NYK structural edges (+9.2 clutchNetRtg, KAT stretch-5 vs Drummond, Brunson PnR vs hobbled Embiid) keep them on top. Market at -122 = ~55% implied, model says ~63%. Slight edge.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome: "win", actual: "NYK 144-114 — closeout sweep, NYK advances to ECF" },
  },
  {
    id: 'r2-g4-nyk-phi-spread',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'spread', pick: 'PHI +1.5', odds: '+102',
    facts: [
      {label:'Model',value:'NYK by 4'},
      {label:'Market',value:'NYK -1.5'},
      {label:'Closeout ATS',value:'G4 sweep favorites cover only ~50%'},
    ],
    modelHook: { fn:'dmargin', args:['NYK-PHI',4] },
    reasoning: "<strong>Closeout-game ATS hedge.</strong> Model says NYK by 4 but closeout dynamics are notoriously hard to cover — PHI's home pride + Embiid back at 80% + OG potentially OUT for NYK = the kind of game that ends NYK by 1-2 with NYK closing out in possession-by-possession Q4 grind. PHI +1.5 wins on any backdoor cover OR a PHI desperation upset. Bigger win condition than NYK -1.5 (which loses if NYK wins by exactly 1 or in a tie OT collapse). Slightly +EV at +102.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome: "loss", actual: "NYK won by 30 — closeout walkover, no backdoor cover scenario" },
  },
  {
    id: 'r2-g4-nyk-phi-brunson-pts',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Brunson Over 27.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'35pts (12-18 FG, 3-6 3PT, 8-8 FT)'},
      {label:'G2',value:'26pts (9-21 FG, go-ahead bucket Q4)'},
      {label:'G3',value:'33pts/9ast (11-22 FG, 38min)'},
      {label:'Avg',value:'31.3 ppg in series'},
    ],
    reasoning: "<strong>Brunson averaging 31.3 ppg this series with Embiid hobbled.</strong> G3 showed he can run dual-mode scorer-distributor (33/9ast) at PHI. Closeout games typically push star usage UP — Brunson will close at 38+ minutes regardless of margin. 27.5 is below his series floor (26 G2 was the lowest). PHI defensive scheme has no answer to his PnR with KAT. ~75% hit rate at this line.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: "loss", actual: "Brunson 22 pts (8-17 FG) — McBride exploded for 25 in his stead, usage redistributed" },
  },
  {
    id: 'r2-g4-nyk-phi-kat-reb',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'KAT Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'G1',value:'6 reb in 20min (blowout, low minutes)'},
      {label:'G2',value:'10 reb (foul-trouble PHI bigs)'},
      {label:'G3',value:'12 reb (4 OREB) in 26min — passive on offense, dominant on glass'},
      {label:'Matchup',value:'Drummond/Bona thin C rotation; Embiid limited if plays'},
    ],
    reasoning: "<strong>KAT cleared 9.5 in BOTH G2 and G3 (10, 12).</strong> The matchup is structural — PHI's C rotation is Drummond (29) + Bona (foul trouble) + Embiid at 70% = no one to box him out. Even at 26min in G3 he had 12reb with 4 OREB. Counting stat that's blowout-proof. ~80% hit rate at this line.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "KAT 4 reb (17 pts / 10 ast — passive on glass, dimes in flow). PHI bigs finally boxed him out" },
  },
  {
    id: 'r2-g4-nyk-phi-maxey-pts',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Maxey Over 22.5 points', odds: '-125',
    facts: [
      {label:'G1',value:'13pts (3-9 FG, fatigue)'},
      {label:'G2',value:'26pts (9-23 FG, cold Q4)'},
      {label:'G3',value:'17pts (inefficient volume)'},
      {label:'Closeout context',value:'Last home game; team\'s best healthy creator'},
    ],
    reasoning: "Maxey is PHI's only consistent healthy primary creator (Embiid hobbled, George variance). In a closeout home game where PHI has nothing to lose, Mike Brown will run him 40+ min as the hub. G2 showed he can hit 26 in a competitive game. Even his inefficient G3 produced 17. 22.5 is the median outcome in a desperation-pace game where PHI runs everything through him. ~60% hit rate.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "Maxey 17 pts (6-15 FG). Game out of hand by Q3 — no desperation explosion" },
  },
  {
    id: 'r2-g4-nyk-phi-total',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'235 (NYK 137-98 blowout)'},
      {label:'G2 total',value:'210 (NYK 108-102)'},
      {label:'G3 total',value:'202 (NYK 108-94)'},
      {label:'Trend',value:'Totals dropping each game as PHI defense slows pace'},
    ],
    reasoning: "Total has trended down each game (235 → 210 → 202). PHI plays slower without Embiid in motion sets; NYK plays slower in closeout mode (less drive-and-kick, more PnR). Both teams trending under. 213.5 is well above the 2-game post-G1 average (206). Lean under — closeout games usually feature defensive intensity.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome: "loss", actual: "Total 258 (NYK 144, PHI 114). NYK 25-of-44 from 3 (postseason record) blew the under" },
  },

  // ─── SAS-MIN G4 (Sun May 10, 7:30 PM ET @ Target Center, SAS leads 2-1) ──
  {
    id: 'r2-g4-sas-min-ml',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-195',
    facts: [
      {label:'Spread',value:'SAS -4.5'},
      {label:'Total',value:'O/U 218.5'},
      {label:'Series',value:'SAS leads 2-1'},
      {label:'G3',value:'SAS 115-108 at Target Center (Wemby 39/15/5blk)'},
      {label:'Edwards',value:'No minutes restriction confirmed for G4'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',4] },
    reasoning: "<strong>SAS won G3 ON THE ROAD behind Wemby's Kareem-tier line.</strong> Engine: SAS by 3. Market: SAS by 4.5 — the model thinks the spread is too rich but the ML at -195 implies ~66% which matches the model's ~65%. Wemby is in 'transcendent' mode (back-to-back 39+pt games or Kareem-tier production). Edwards now fully back (32/14/6 G3) but Randle (3-12) and McDaniels (5-22) combined 8-34 — MIN's secondary scoring crisis persists. SAS ML is the cleanest expression of the model's edge.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome: "loss", actual: "MIN won 114-109 — Wemby ejected Q2 (Flagrant 2 elbow to Reid)" },
  },
  {
    id: 'r2-g4-sas-min-spread',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'spread', pick: 'MIN +4.5', odds: '-110',
    facts: [
      {label:'Model',value:'SAS by 3'},
      {label:'Market',value:'SAS -4.5'},
      {label:'Edwards',value:'Full minutes G4'},
      {label:'MIN home desperation',value:'Down 1-2, must hold to avoid 1-3'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',4] },
    reasoning: "<strong>Model says SAS by 3, market says SAS by 4.5</strong> — MIN +4.5 has the engine edge. Edwards no minutes restriction means MIN's IC bumps up. Target Center crowd in a must-win-to-avoid-1-3 game adds variance. SAS won G3 by 7 with Wemby in transcendent mode AND Edwards effective — if Wemby reverts to 25-30 instead of 39, MIN can win or keep it within 4. The Wemby 39+pt ceiling is not a nightly baseline.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome: "win", actual: "MIN won outright by 5 — Wemby ejection variance event delivered cash on the +4.5 hedge" },
  },
  {
    id: 'r2-g4-sas-min-wemby-reb',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Wembanyama Over 12.5 rebounds', odds: '-140',
    facts: [
      {label:'G1',value:'15 reb'},
      {label:'G2',value:'15 reb'},
      {label:'G3',value:'15 reb'},
      {label:'Streak',value:'15+ in EVERY series game'},
    ],
    reasoning: "<strong>Wemby has hit EXACTLY 15 reb in all three series games.</strong> The matchup is structural — Gobert (13pts, only 1 box-out body MIN can use), Randle/McDaniels can't physically box him out. Counting stat that's blowout-proof. 12.5 gives 2.5-rebound cushion. Among the highest-confidence props on the slate. ~92% hit rate.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "Wemby 4 reb in 13 min before ejection. Variance event broke the floor" },
  },
  {
    id: 'r2-g4-sas-min-wemby-blk',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Wembanyama Over 2.5 blocks', odds: '-140',
    facts: [
      {label:'G1',value:'12 blocks (career playoff high)'},
      {label:'G2',value:'5 blocks'},
      {label:'G3',value:'5 blocks'},
      {label:'Avg',value:'7.3 bpg in series'},
    ],
    reasoning: "<strong>Wemby has cleared 2.5 blocks in EVERY series game.</strong> 12, 5, 5 = 7.3 bpg. MIN drives through the lane out of necessity (Edwards rim attacks, Randle mid-range fadeaways turning into close-outs). Counting stat with structural matchup advantage. 2.5 is well below his series floor of 5. ~95% hit rate — among the highest-confidence floor props this round.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "Wemby 0 blk in 13 min. Ejection torpedoed reb + blk floors together" },
  },
  {
    id: 'r2-g4-sas-min-edwards-pts',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Edwards Over 26.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts (off bench, 25min)'},
      {label:'G2',value:'12pts (24min, rusty)'},
      {label:'G3',value:'32pts/14reb/6ast (41min, no restriction)'},
      {label:'G4',value:'No minutes restriction confirmed'},
    ],
    reasoning: "<strong>Edwards roared back in G3 with 32pts/14reb/6ast in 41min</strong> — knee fully cleared. With no minutes restriction confirmed for G4 and MIN in must-win mode at home, expect another 38-42min outing. He scored 32 in G3 against the same SAS scheme. 26.5 is well below his G3 output. Even if SAS adjusts, his volume + aggression in a desperation game pushes 28-32. ~70% hit rate.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "win", actual: "Edwards 36 pts (16 in Q4) — closed the door after Wemby ejection" },
  },
  // ─── DET-CLE G4 (Mon May 11, 8:00 PM ET @ Rocket Mortgage, DET leads 2-1) ──
  {
    id: 'r2-g4-det-cle-ml',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'ml', pick: 'DET ML vs CLE', odds: '+140',
    facts: [
      {label:'Spread',value:'CLE -3.5'},
      {label:'Total',value:'O/U 213.5'},
      {label:'Series',value:'DET leads 2-1'},
      {label:'G3',value:'CLE 116-109 at CLE (Mitchell 35, Allen 18, Strus closing steal-and-basket)'},
      {label:'Engine',value:'CLE 107, DET 104 (CLE by 3, LOW conf)'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',4] },
    reasoning: "<strong>Contrarian DET upset spot.</strong> Engine has CLE by 3 (matches market direction), but the engine's HCA flip premium (+2.5pt) has been over-priced in recent retros — NYK-PHI and SAS-MIN G3s both went to the road favorite when the model said home would cover. With HCA flip trimmed to +1.5 (per the G3 retro), the line moves to near pick-em. DET has won 2 of 3 in this series with structural Cade-driven offense that CLE has no perimeter answer for. DET ML at +140 = 42% implied vs ~46% adjusted-engine. Small +EV edge that rides on the calibration call — if HCA-flip retro continues, DET upsets the closeout.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'CLE 112-103. DET lost by 9 — Mitchell\'s 43pts (39 in 2H, tied Sleepy Floyd 1987 playoff record) was the swing. HCA-flip retro did NOT apply: CLE was home, Mitchell tail-event game drove the result. RIGHT framework, WRONG situation.' },
  },
  {
    id: 'r2-g4-det-cle-spread',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'spread', pick: 'DET +3.5', odds: '-110',
    facts: [
      {label:'Engine',value:'CLE by 3 (CLE 107, DET 104)'},
      {label:'Adjusted',value:'~pick-em with HCA flip retro applied (+1.5 not +2.5)'},
      {label:'Market',value:'CLE -3.5'},
      {label:'G3 retro',value:'HCA flip was over-priced in NYK-PHI/SAS-MIN G3s — road favorites won both'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',4] },
    reasoning: "Alt expression of the DET ML edge — at -110 implied is ~52%, and DET +3.5 covers any DET win + any CLE win by 1-3. With HCA-flip retro applied (calibrate +1.5pt, not +2.5pt), the engine line moves to near pick-em, putting the live cover band roughly at ~55-58% of plausible game outcomes. Lower variance than the +140 ML at the cost of upside on an outright DET win.",
    confidence: 'high', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'CLE won by 9 — DET +3.5 lost by 5.5. Mitchell\'s 43pt (39 in 2H) tail event blew through both the spread and the engine\'s 3pt projection.' },
  },
  {
    id: 'r2-g4-det-cle-total',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'212 (DET 111-101)'},
      {label:'G2 total',value:'204 (DET 107-97)'},
      {label:'G3 total',value:'225 (CLE 116-109)'},
      {label:'Avg',value:'213.7'},
    ],
    reasoning: "Series total trend is volatile — G3 jumped because CLE found shooting at home (Strus/Hunter/Wade combined). Model: CLE 107, DET 104 = 211 total. Engine sees character as GRIND not COMPETITIVE/SEPARATION — clutch executions tend to slow pace. Slight under lean at -110.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Total 215 (CLE 112 + DET 103) — went OVER by 1.5pts. The Mitchell tail-event Q3 (21pts in the quarter alone) pushed the pace + makes well above the engine\'s GRIND projection.' },
  },
  {
    id: 'r2-g4-det-cle-cade-pts',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'Cunningham Over 24.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'25 pts/8ast'},
      {label:'G2',value:'26 pts/9ast'},
      {label:'G3',value:'triple-double on 10-27 FG / 8 TOs (volume mode)'},
      {label:'Avg',value:'~25 ppg, 39+ min nightly'},
    ],
    reasoning: "Cade has been DET's primary creation hub in every game this series — 39+ min nightly, ~28 FGA average. CLE has no perimeter answer (Wade/Hunter limited). 24.5 is right at his series floor (low was 25 G1). In a road must-not-fall-to-2-2 game, his usage spikes further. Even on inefficient nights (G3's 10-27) he clears 24.5 via volume. ~70% hit rate.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: 'Cade 19pts (7-19 FG, 5 TOs) — UNDER 24.5 by 5.5. FIRST under-20 in 11 straight playoff games. CLE\'s scheme adjustment (Mobley primary screen-defender + doubles) capped him. The series-floor framework broke here when CLE actively schemed against the usage path.' },
  },
  {
    id: 'r2-g4-det-cle-mitchell-pts',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'Mitchell Over 28.5 points', odds: '-110',
    facts: [
      {label:'G1',value:'24 pts (3-12 3PT, road)'},
      {label:'G2',value:'31 pts (12-22 FG)'},
      {label:'G3',value:'35 pts (career-high playoff signature)'},
      {label:'Series trend',value:'Climbing — 24 → 31 → 35'},
    ],
    reasoning: "Mitchell is on a series scoring crescendo at home. G3 35-pt signature happened with Allen anchoring D + Strus knockdown shooting around him — same template tonight. Q4 closing pattern (top-7 playoff Q4 +5 pts) means CLE plays through him in late game. 28.5 is below his last two outputs (31 in G2, 35 in G3). ~65% hit rate.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'Mitchell 43pts (13-26 FG, 13-14 FT) — 39 PTS IN 2H, tied Sleepy Floyd 1987 NBA playoff record. Career playoff high. Started 0-7/4pts at half, then 21pts in Q3 alone (matched DET\'s entire Q3 output). Over 28.5 cleared by 14.5pts. Crescendo thesis validated to the extreme.' },
  },

  // ─── OKC-LAL G4 (Mon May 11, 10:30 PM ET @ Crypto.com Arena, OKC leads 3-0) ──
  {
    id: 'r2-g4-okc-lal-spread',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'spread', pick: 'LAL +11.5', odds: '-110',
    facts: [
      {label:'Model',value:'OKC by 5 (engine 108-103)'},
      {label:'Market',value:'OKC -11.5'},
      {label:'Engine edge',value:'+6.5 pts vs market'},
      {label:'Closeout history',value:'Sweep-cliff games cover only ~40% ATS for favorites'},
    ],
    modelHook: { fn:'dmargin', args:['OKC-LAL',4] },
    reasoning: "<strong>Single biggest engine edge tonight.</strong> Model: OKC by 5 (HCA-flip + LAL desperation home). Market: OKC by 11.5 — the upper end of the closeout-blowout distribution. Engine edge: 6.5pts. Sweep-cliff favorites typically ease off + reserve energy for the next round (OKC has BIG margin in series, no incentive to play 38+ min for stars); meanwhile LAL home crowd + last home game of season for LeBron at 41yo = effort + emotion + slow pace. ~62% engine implied at -110 (52.4%). Cleanest read on the slate.",
    confidence: 'high', thesis: ['model','market'], narrative: null,
    result: { outcome: 'win', actual: 'OKC 115-110 (OKC by 5). LAL +11.5 covered comfortably. Engine BULLSEYE: predicted OKC by 5, actual OKC by 5. Single biggest edge of the slate hit exactly as priced.' },
  },
  {
    id: 'r2-g4-okc-lal-lal-ml',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'ml', pick: 'LAL ML vs OKC', odds: '+390',
    facts: [
      {label:'Spread',value:'LAL +11.5 (model lean)'},
      {label:'OKC ML',value:'-520 (~84% implied)'},
      {label:'Closeout sample',value:'Home dogs in 3-0 vs G4 closeout: ~25% win rate'},
      {label:'LAL home variance',value:'LeBron 30+ ceiling, Reaves 31-pt G2 already shown'},
    ],
    modelHook: { fn:'dml', args:['OKC-LAL',4] },
    reasoning: "<strong>Chaos play — engine 20-25% LAL win, market 16%.</strong> +390 implies ~20%; engine model has it ~25% (OKC sweep-cliff ease-off + LAL home desperation can flip a tight Q4). LAL needs: SGA off-night (under 28), LeBron Q4 takeover, Reaves or Hachimura bench spike. All three are independent variance events. Engine edge is small (~5pp) but at +390 every hit pays huge.",
    confidence: 'chaos', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'OKC 115-110. LAL fought hard (Reaves 27 + Hachimura 25 + LeBron 24 = 76 from primaries) but SGA went closeout-mode 35 and Holmgren\'s 32.8s tiebreaker dunk sealed it. Chaos thesis directionally right (close game) but LAL still lost.' },
  },
  {
    id: 'r2-g4-okc-lal-total',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198 (OKC 108-90 blowout)'},
      {label:'G2 total',value:'232 (OKC 125-107, Reaves heroic)'},
      {label:'G3 total',value:'239 (OKC 131-108 blowout)'},
      {label:'Engine projection',value:'211 (OKC 108, LAL 103)'},
    ],
    reasoning: "Engine total: 211 (OKC 108, LAL 103). Market: 214.5. Closeout-cliff games typically run slower in late minutes — OKC eases off, LAL grinds out shots. Wider variance band tonight (LAL ceiling 110-115 with shooting; LAL floor 95-100 if Reaves/Hachimura cold). 214.5 is the upper plausible band. Slight under lean at -110.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Total 225 (OKC 115 + LAL 110) — over by 10.5. LAL\'s desperation pace + OKC closeout aggression (no easing off) pushed the pace and makes. Both teams shot well in Q4. Engine total projection too low.' },
  },
  {
    id: 'r2-g4-okc-lal-sga-pts',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'SGA Over 30.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18 pts/7 TOs (career-anomaly low)'},
      {label:'G2',value:'34 pts (bounce-back to mean)'},
      {label:'G3',value:'23 pts/9 ast (cruise control 7-20 FG, OKC bench took over)'},
      {label:'Closeout history',value:'33+ in 4 of his 5 prior closeout games'},
    ],
    reasoning: "SGA closeout history is the key signal: 33+ ppg in 4 of his 5 prior playoff closeouts. Even G3 cruise mode (23 on 7-20) was OKC up so big the bench ate minutes. Tonight at LAL in a closeout, SGA gets the green light to push for 35+. 30.5 is well below his closeout-game floor. ~70% hit rate.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'SGA 35pts/8ast (12-25 FG, 8-9 FT) — first 30+ game of the series after the 18/22/23 cruise. Closeout-history signal validated cleanly: SGA leaned in, OKC won and swept.' },
  },
  {
    id: 'r2-g4-okc-lal-lebron-pts',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'LeBron Over 24.5 points', odds: '-110',
    facts: [
      {label:'G1',value:'30 pts/8 ast/13 reb'},
      {label:'G2',value:'28 pts'},
      {label:'G3',value:'19 pts/6/8 (pivot to playmaker)'},
      {label:'Closeout context',value:'Last home game of season + 41yo + elimination = max effort'},
    ],
    reasoning: "LeBron in a closeout home game at 41yo = leave it all on the floor. G1+G2 showed he can still hit 28-30 in this series. G3's 19 was a playmaker night out of necessity (rest of LAL trash). Closeout home dynamic typically pushes LeBron usage UP. 24.5 is below his series floor of 19 only if he goes playmaker again — but you don't make playmaker tradeoffs in an elimination game. ~70% hit rate.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: 'LeBron 24pts/12reb/6ast — UNDER 24.5 by 0.5. Heartbreak half-point pattern: facilitator-mode (6 ast) with the ball getting spread to Reaves (27) and Hachimura (25). Even in elimination at 41yo, the playmaker tradeoffs persisted.' },
  },

  {
    id: 'r2-g4-sas-min-total',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'total', pick: 'Over 218.5', odds: '-110',
    facts: [
      {label:'G3 total',value:'223 (SAS 115-108)'},
      {label:'Edwards full',value:'No minutes restriction = MIN pace UP'},
      {label:'Wemby ceiling',value:'39pt G3 sets the high-side prior'},
    ],
    reasoning: "G3 total was 223 with Wemby at 39 + Edwards at 32 — both stars in transcendent form. Edwards full minutes for G4 means MIN runs more transition. SAS won't tone Wemby down. Both teams' star scoring momentum + MIN home desperation pace = game in the 218-225 range. 218.5 is below the G3 total. Lean over.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome: "win", actual: "Total 223 (MIN 114, SAS 109). Pace + makes carried the over even with Wemby ejected" },
  },

  // ─── SAS-MIN G5 (Tue May 12, 8:00 PM ET @ Frost Bank Center, series tied 2-2) ──
  // Single game tonight. DET-CLE G5 is tomorrow (Wed 5/13).
  {
    id: 'r2-g5-sas-min-ml',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-410',
    facts: [
      {label:'Spread',value:'SAS -10.5'},
      {label:'Total',value:'O/U 218.5'},
      {label:'Series',value:'Tied 2-2'},
      {label:'G4',value:'MIN 114-109 (Wemby ejected Q2 — chaotic swing game)'},
      {label:'Wemby status',value:'CLEARED — NBA review, no suspension, plays full minutes'},
      {label:'Engine',value:'SAS 113, MIN 105 (SAS by 8, MEDIUM)'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',5] },
    reasoning: "<strong>SAS ML at home with Wemby healthy is the structural pick.</strong> Engine: SAS by 8. Market: SAS -410 (~80% implied). SAS won G1 by 2 + G2 by 38 + G3 by 7 — only the G2 was variance-driven (MIN 28% 3PT collapse). MIN's win in G4 came partly via the Wemby ejection swing (~12-15pt shock). With Wemby back at home + Reid post-elbow soreness + Edwards facing SAS guard depth + Castle facilitating + Frost Bank Center HCA, SAS holds serve cleanly. The risk: Wemby in 'first-game-back-after-ejection' mindset could either be (a) measured = great, or (b) over-aggressive = early foul trouble. Implied 80% feels fair.",
    confidence: 'high', thesis: ['model','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'SAS 126-97. Wemby 27/17/5/3blk (18 in Q1). SAS led by 30. Cleanest ML hit of the series.' },
  },
  {
    id: 'r2-g5-sas-min-spread',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'spread', pick: 'MIN +10.5', odds: '-110',
    facts: [
      {label:'Engine',value:'SAS by 8 (113-105)'},
      {label:'Market',value:'SAS -10.5'},
      {label:'Engine edge',value:'+2.5 pts to MIN cover'},
      {label:'Series spreads',value:'SAS won G1 by 2, G2 by 38 (outlier), G3 by 7'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',5] },
    reasoning: "Engine: SAS by 8. Market: SAS -10.5. 2.5pt edge to MIN cover. Three of four games in this series have been ≤7pt margins (the G2 +38 was a one-game shooting anomaly). SAS having to win by 11+ with Edwards healthy + MIN's 4-deep secondary scoring history is a stretch. Even with Wemby + home + Reid neck-spotty, the typical SAS-MIN game flows in the 5-10pt margin band. ~58% cover for MIN.",
    confidence: 'high', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'SAS by 29 (126-97). MIN +10.5 missed by 18.5. The "G2 was the only blowout" thesis was wrong twice in this series — Wemby post-ejection re-aggression mirrored the G2 bounce-back pattern.' },
  },
  {
    id: 'r2-g5-sas-min-total',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'total', pick: 'Over 218.5', odds: '-110',
    facts: [
      {label:'G3 total',value:'223 (SAS 115-108)'},
      {label:'G4 total',value:'223 (MIN 114-109, Wemby ejected)'},
      {label:'Edwards last 2',value:'32 + 36 pts'},
      {label:'Wemby G3',value:'39pts/15reb at MIN'},
    ],
    reasoning: "Series total in last 2 games: 223 + 223. Edwards in transcendent scoring form (32+36 last 2). Wemby back + home + re-aggression spot likely produces a 28-35pt game on volume + makes. Both teams' pace + makes have stabilized in the 220 range. 218.5 is at the lower end of the last-2-game band. Lean over.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome: 'win', actual: 'Total 223 (SAS 126, MIN 97). Cleared by 4.5. SAS pace + Wemby Q1 dominance carried it.' },
  },
  {
    id: 'r2-g5-sas-min-wemby-reb',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'prop', pick: 'Wemby Over 13.5 rebounds', odds: '-130',
    facts: [
      {label:'G1',value:'15reb'},
      {label:'G2',value:'15reb'},
      {label:'G3',value:'15reb (3 straight 15-rebound games in games he played >25min)'},
      {label:'G4',value:'4reb in 13min before ejection'},
      {label:'Reb floor signal',value:'Cleanest in dataset — 15+ in every full game'},
    ],
    reasoning: "Wemby's rebound floor is the most reliable signal in this dataset: 15 boards in EVERY game he played >25min in this series. At home + healthy + first game back + Reid potentially limited from neck soreness (one less elite boards-competing big) = 15+ baseline. 13.5 is 1.5 below his series median. ~90% hit rate.",
    confidence: 'best-bet', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'win', actual: '17 rebounds. Best-bet hit comfortably.' },
  },
  {
    id: 'r2-g5-sas-min-edwards-pts',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'prop', pick: 'Edwards Over 26.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts (off bench, knee)'},
      {label:'G2',value:'12pts (off bench, blowout)'},
      {label:'G3',value:'32pts (starting, knee back)'},
      {label:'G4',value:'36pts (16 in Q4 closing)'},
      {label:'Engine projection',value:'28 pts'},
    ],
    reasoning: "Edwards' knee is fully healed (32 + 36 last 2). At the swing game on the road + must-win-or-fall-3-2 + SAS perimeter D being Castle/Vassell (not elite) + Edwards' Q4 closing pattern. 26.5 is below his last-2-game floor of 32. Only a Wemby-rim-protection + Castle-on-ball lockdown gets him below 27.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: '20 points. The "Castle/Vassell not elite perimeter D" thesis was wrong — Castle was the primary defender and held Edwards to 7-19 FG. Knee-fatigue + foul-trouble combo + SAS Wemby-anchored paint defense suppressed him below the line. Regression after consecutive 32/36 games was sharper than expected.' },
  },
  {
    id: 'r2-g5-sas-min-wemby-pts',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'prop', pick: 'Wemby Over 27.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'11pts (0-8 3PT anomaly)'},
      {label:'G2',value:'19pts (bounce-back start)'},
      {label:'G3',value:'39pts/15reb (Kareem-tier)'},
      {label:'G4',value:'ejected (4pts in 13min)'},
      {label:'Engine projection',value:'29pts'},
    ],
    reasoning: "Wemby ceiling games are the new baseline. G3 39pt road game at MIN + healthy at home + re-aggression spot after the ejection. The G4 ejection was 13min — he has rest. At Frost Bank Center + MIN's interior D (Gobert solo) + Reid hampered = paint attacks Wemby is comfortable with. Engine: 29pts. 27.5 is at the edge — small edge over. Slight lean over.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: '27 points — UNDER by 0.5. The closest possible miss. 18 of his 27 came in Q1; SAS led by 30 by halftime so he didn\'t need to push for more. The very blowout that helped the ML lose this prop.' },
  },

  // ─── R2-G6 — TONIGHT (Thu 5/14: SAS-MIN G6) + TOMORROW (Fri 5/15: DET-CLE G6) ───
  // SAS-MIN: SAS leads 3-2, closeout at Target Center (MIN's elimination).
  // DET-CLE: CLE leads 3-2, closeout at Rocket Arena (DET's elimination).
  {
    id: 'r2-g6-sas-min-ml',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '+150',
    facts: [
      {label:'Spread',value:'MIN -2.5 (est)'},
      {label:'Total',value:'O/U 217.5 (est)'},
      {label:'Series',value:'SAS leads 3-2'},
      {label:'G5',value:'SAS 126-97 (Wemby 27/17 — re-aggression bounce)'},
      {label:'Pattern',value:'Home team has won every game in the series'},
      {label:'Engine',value:'SAS 108, MIN 110 (MIN by 2, LOW)'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',6] },
    reasoning: "<strong>SAS ML at +150 on the road is a value play, not the model's top pick.</strong> Engine: MIN by 2 (slight HCA + elimination-desperation tilt). Market: MIN -135 / SAS +150 (60/40). The pattern in this series — home team wins every game — is the load-bearing data point against SAS. But SAS has the talent edge, Wemby is in transcendent mode, and MIN's secondary scoring (Randle/McDaniels) has been suppressed all series. At +150 the implied 40% feels light vs engine's ~46-48%. Lean SAS but only with stake control; not a high-confidence pick.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS 139-109. SAS won by 30 — road blowout in elimination. The home-pattern broke; +150 dog hit outright. Series ends 4-2 SAS, advance to WCF vs OKC.' },
  },
  {
    id: 'r2-g6-sas-min-spread',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'spread', pick: 'SAS +2.5', odds: '-110',
    facts: [
      {label:'Engine',value:'MIN by 2 (108-110)'},
      {label:'Market',value:'MIN -2.5'},
      {label:'Engine edge',value:'+0.5 pt to SAS cover'},
      {label:'G5 blowout',value:'SAS by 29 regresses — 4-game margin avg outside G5 was ~10'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',6] },
    reasoning: "Engine MIN by 2; market MIN by 2.5. Half-point edge to SAS cover. Pure number play — engine and market are nearly identical so the +2.5 hook is the differentiator. SAS won't get blown out (talent + Wemby). MIN must-win desperation tightens the game; ANY single-digit SAS or MIN win lands +2.5 SAS in the green. Push at exactly 2 is realistic — the half-hook matters.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS won 139-109 (by 30). SAS +2.5 cashed by a margin of 32.5 over the line.' },
  },
  {
    id: 'r2-g6-sas-min-total',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'total', pick: 'Under 217.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'206, 228, 223, 223, 223 → median ~223'},
      {label:'G6 setup',value:'Elimination + tightened defense + Wemby foul-trouble risk'},
      {label:'Engine projection',value:'108 + 110 = 218 (right at the line)'},
    ],
    reasoning: "Engine projects 218 exact-on the 217.5 line. Lean: elimination games tend to slow down (tighter D, more fouls, fewer leak-out transitions). Wemby foul trouble in his Target Center memory game is a real risk that reduces pace. Both bigs (Gobert + Wemby) suggest a more half-court Q4. Slight lean Under but very close to a push.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'loss', actual:'Total = 248 (139+109) — way OVER 217.5. SAS blowout pace ran the score; MIN couldn\'t slow them down even in elimination.' },
  },
  {
    id: 'r2-g6-sas-min-wemby-reb',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Wemby Over 12.5 rebounds', odds: '-145',
    facts: [
      {label:'Series rebounds',value:'15, 15, 15, 4 (ejected), 17 → 15+ in every full game'},
      {label:'Hostility lift',value:'Target Center crowd doesn\'t suppress rebounding'},
      {label:'Floor signal',value:'Cleanest in the dataset'},
    ],
    reasoning: "Wemby's rebound floor is the most reliable signal in this entire playoffs. 15+ in every game he\'s played at least 25 minutes this series (G1, G2, G3, G5). At 12.5 the line is 2.5 below his series median. Hostile crowd, must-win game opposite, fouls don\'t reduce rebounds (he\'ll play 33-36min anyway). ~92% hit rate.",
    confidence: 'best-bet', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Wemby 6 rebounds in 27 minutes — limited to under-half his series median because SAS blowout left him on the bench in Q4. Floor signal broke on the blowout side-effect, not on a defensive scheme.' },
  },
  {
    id: 'r2-g6-sas-min-edwards-pts',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Edwards Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series scoring',value:'18, 12, 32, 36, 20'},
      {label:'G6 setup',value:'Home, elimination, 2-day rest'},
      {label:'Last 3 home',value:'G3 32, G4 36 — Q4 closing pattern'},
      {label:'Engine projection',value:'30 pts'},
    ],
    reasoning: "Must-win elimination at home with 2-day rest. Series scoring trajectory: 18 (bench/knee), 12 (blowout), 32 (back to start), 36 (Q4 takeover), 20 (foul trouble + SAS targeting). Variance high. In a season-saving game his usage will spike to 32%+ and he\'ll demand 38-40min. Floor 27.5 means he needs to score 28+ — at home in his most important game of the year, that\'s the floor. ~70% hit.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Edwards 24 pts on 9-of-26 FG (3-of-12 3PT). Volume came (26 attempts) but Castle perimeter D crushed the efficiency. 3.5 short of the line.' },
  },
  {
    id: 'r2-g6-sas-min-castle-ast',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Castle Over 5.5 assists', odds: '-130',
    facts: [
      {label:'Series assists',value:'5, 6, 12, 8, 7 → all ≥5'},
      {label:'Facilitator role',value:'Wemby + Fox + K.Johnson all finishing'},
      {label:'Floor signal',value:'5+ in every game'},
    ],
    reasoning: "Castle has dished 5+ assists in every game of this series. Facilitator role with Wemby + Fox + K.Johnson + Harper as scoring options on the floor. 5.5 line is one below his series median. ~85% hit.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Castle 6 ast (plus 32 pts/11 reb closeout masterpiece). Facilitator floor held — barely cleared the line, but cleared.' },
  },

  // ─── DET-CLE G6 (Fri May 15, 7:00 PM ET @ Rocket Arena, CLE leads 3-2) ─
  // DET's elimination game. CLE chasing close-out + ECF berth (vs NYK).
  {
    id: 'r2-g6-det-cle-ml',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'ml', pick: 'CLE ML vs DET', odds: '-220',
    facts: [
      {label:'Spread',value:'CLE -5.5 (est)'},
      {label:'Total',value:'O/U 213.5 (est)'},
      {label:'Series',value:'CLE leads 3-2'},
      {label:'G5',value:'CLE 117-113 OT (Harden 30, Strus 6 made 3s)'},
      {label:'CLE home',value:'6-0 in playoffs'},
      {label:'Engine',value:'CLE 110, DET 104 (CLE by 6, MEDIUM)'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',6] },
    reasoning: "<strong>CLE ML at home with momentum from G5 OT.</strong> Engine: CLE by 6. Market: CLE -220 (~69% implied). CLE 6-0 at Rocket Arena in playoffs is the structural data point. DET's single-creator model needs another Cade tail-event (39 in G5 wasn\'t enough). Mitchell + Harden + Strus 3-headed offense at home covers the variance. The risk: DET undefeated at home this series and Cade is in MVP-tier form (39 G5). Implied 69% feels right.",
    confidence: 'high', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'DET 115-94 — CLE\'s first home loss of the entire 2026 playoffs (was 6-0 at Rocket). DET\'s defensive identity reasserted (41% CLE FG, 16 TOs forced). The CLE-home-fortress thesis broke. Series tied 3-3, G7 at LCA Sun 5/17.' },
  },
  {
    id: 'r2-g6-det-cle-spread',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'spread', pick: 'DET +5.5', odds: '-110',
    facts: [
      {label:'Engine',value:'CLE by 6 (110-104)'},
      {label:'Market',value:'CLE -5.5'},
      {label:'Engine edge',value:'+0.5 pt to DET cover'},
      {label:'Series spreads',value:'10, 10, 7, 9, 4 (OT) — all single digits except G3'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',6] },
    reasoning: "Engine CLE by 6; market CLE by 5.5. Half-point edge to DET cover. This series has had every game decided by 10 or fewer points in regulation (G1 and G2 were 10pt finishes). DET +5.5 is roughly even-money — Cade carry mode keeps DET within 5.5 in any non-blowout. ~52% cover.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'DET won outright 115-94 (by 21). DET +5.5 cashed by a 26.5 margin over the line.' },
  },
  {
    id: 'r2-g6-det-cle-total',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'212, 204, 225, 215, 230 (OT) → ~215 reg-time median'},
      {label:'G5 OT inflation',value:'Adds ~8-10pts to total'},
      {label:'Elimination D',value:'Both teams ratchet up D'},
    ],
    reasoning: "Series totals: 212, 204, 225, 215, 230 (OT). G5 OT inflates that 230; in 48 minutes it would have been ~213-215. DET elimination game means tighter defense; CLE close-out means structured offense. 213.5 is at the regulation-time median; slight lean Under because elimination games suppress pace.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'win', actual:'Total = 209 (115+94) — UNDER 213.5. DET\'s defensive identity reasserted suppressed pace; CLE\'s 41% FG night kept the score down despite DET\'s 115pts.' },
  },
  {
    id: 'r2-g6-det-cle-mitchell-pts',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Mitchell Over 26.5 points', odds: '-125',
    facts: [
      {label:'Series scoring',value:'23, 31, 35, 43, 21 → 30.6 avg'},
      {label:'CLE home',value:'31 (G2 — wait, G2 was DET), 35 (G3) — home avg'},
      {label:'G5 deferral',value:'Deferred to Harden in OT comeback; bounce-back spot'},
      {label:'Engine projection',value:'29 pts'},
    ],
    reasoning: "Mitchell at home in a close-out game = 28-32 baseline. G5 he deferred to Harden (21pts in 40+min) — bounce-back spot at home. CLE 6-0 at Rocket Arena, Mitchell averaged 33 in his G3 home win (35). The 26.5 line is below his home median. ~72% hit.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Mitchell 18 pts on 7-of-19 FG — sub-Mitchell night vs DET\'s defensive scheme that held the entire team to 41% FG. 8.5 short of the line.' },
  },
  {
    id: 'r2-g6-det-cle-cade-pts',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Cade Over 24.5 points', odds: '-115',
    facts: [
      {label:'Series scoring',value:'23, 25, 27, 19, 39 → 26.6 avg'},
      {label:'Road games',value:'27 (G3), 39 (G5) — sustained on the road'},
      {label:'Single-creator burden',value:'DET needs Cade tail-event to extend'},
      {label:'Engine projection',value:'26 pts'},
    ],
    reasoning: "Cade is the entire DET offense on the road. Elimination at CLE forces 35+ minutes and 30%+ usage. G3 27, G5 39 on the road. 24.5 is below his road average. ~75% hit. The variance is on the upside (40+ possible) not the downside.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Cade 21pts/9ast/7reb on 8-of-19 FG — distributed the load instead of going into hero-mode (Harris 14, Jenkins 15, Duren 15 picked up the slack). 3.5 short of the line.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G7 — TOMORROW (Sun May 17, 2026): DET-CLE G7 at LCA
  // ═══════════════════════════════════════════════════════════════
  // Series tied 3-3 after DET's 115-94 road blowout in G6.
  // WINNER ADVANCES TO ECF vs NYK. DET 3-0 at LCA this series; CLE was 6-0
  // at Rocket Arena until G6 broke that. Phase 17 (Li et al. 2025): G7
  // location not significant — EFG% + TOV% decide it.
  {
    id: 'r2-g7-det-cle-ml',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-160',
    facts: [
      {label:'Series',value:'Tied 3-3'},
      {label:'G6',value:'DET 115-94 road blowout'},
      {label:'DET home',value:'3-0 at LCA this series'},
      {label:'Engine (Phase 71c)',value:'DET 108, CLE 107 (DET by 1)'},
      {label:'Framework verdict',value:'G7 cap → CAUTION'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',7] },
    reasoning: "<strong>DET ML at home in G7 — but the model says coin flip.</strong> Phase 71c engine: DET 108, CLE 107 (essentially even). Phase 71 framework G7 cap auto-downgrades every PLACE recommendation to CAUTION in elimination games — the 68-game audit found 50% winner accuracy at G6/G7. <strong style=\"color:var(--yellow)\">If betting, half-stake max.</strong> Phase 17 / Li et al.: G7 location NOT significant; EFG% + TOV% decide it. DET defensive identity from G6 (16 TOs forced) is the directional case. CLE's home fortress thesis broke in G6 — but G7 home crowd is the lurking factor the model can't see. Lean DET if you must bet, but the math says variance dominates skill here.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'CLE 125, DET 94 — DET ML lost outright (CLE by 31). G7 cap CAUTION call validated; betting it half-stake limited damage.' },
  },
  {
    id: 'r2-g7-det-cle-spread',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'spread', pick: 'CLE +3.5', odds: '-110',
    facts: [
      {label:'Engine (Phase 71c)',value:'DET by 1 (108-107)'},
      {label:'Market',value:'DET -3.5'},
      {label:'Engine edge',value:'CLE +3.5 covers by 2.5'},
      {label:'Framework verdict',value:'spread CAUTION (audit margin MAE 13pt) + G7 cap'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',7] },
    reasoning: "<strong>Engine NOW (post Phase 71c) projects DET by only 1pt</strong> — CLE +3.5 should cover by 2.5 per the model. BUT: <strong style=\"color:var(--yellow)\">Phase 71 audit found 12.94pt margin MAE</strong> — our spread predictions are essentially noise inside that error band. The G7 cap doubles the warning. Best read: take CLE +3.5 if you must play spread, but it's a coin flip, not edge. Don't size like it is.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'CLE 125, DET 94 — CLE won outright by 31, covered +3.5 by 34.5. Spread audit MAE 12.94pt nearly held with this single bet despite being right side.' },
  },
  {
    id: 'r2-g7-det-cle-total',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'total', pick: 'Under 211.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'212, 204, 225, 215, 230 (OT), 209 → reg-time median ~213'},
      {label:'G7 historical',value:'G7s ~6-8pts below series median'},
      {label:'Engine (Phase 71c)',value:'108 + 107 = 215 (slightly OVER line)'},
      {label:'Framework verdict',value:'medium×total = SKIP cell (25% hit, -51% ROI)'},
    ],
    reasoning: "<strong>Phase 71c engine projects 215 total</strong> — slightly OVER the 211.5 line. The original Under thesis (engine 212 at the line, G7 defensive intensity) is partially dismantled by the per-player override raising Cade + Harris projections. Combined with the audit's medium×total SKIP cell (25% hit, -51% ROI), this is a SKIP regardless of intuitive G7 logic. <strong style=\"color:var(--yellow)\">Pre-Phase 71 we'd have placed this; framework says no.</strong>",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'loss', actual:'CLE 125, DET 94 — total 219, OVER 211.5 by 7.5. Phase 71c-corrected engine projection of 215 was closer to actual than the 212 pre-fix estimate. SKIP verdict was right.' },
  },
  {
    id: 'r2-g7-det-cle-cade-pts',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'prop', pick: 'Cade Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series scoring',value:'23, 25, 27, 19, 39, 21 → 25.7 avg'},
      {label:'Engine (Phase 71c)',value:'27.9 pts — LINE AT PROJECTION'},
      {label:'Framework verdict',value:'high×prop = SKIP cell + G7 cap'},
    ],
    reasoning: "<strong style=\"color:var(--yellow)\">Phase 71 framework verdict: SKIP.</strong> New per-player-corrected engine projection is 27.9pts — line 27.5 is right at the central estimate, making this a literal coin flip on Cade's distribution. The audit cross-tab also shows high×prop bets had 33% hit rate / -43% ROI in R2. Even if you trust Cade's home-G7 narrative, the line is priced inside the model's error band. The deeper alt line (O21.5) is the right way to bet this player tonight — see the DET Floor Parlay.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Cade 13pts on 5-16 FG / 0-7 3PT — UNDER 27.5 by 14.5. Worst playoff game of his career; CLE schemed him off the floor. SKIP verdict was right; deep alt O21.5 also missed (see floor parlay).' },
  },
  {
    id: 'r2-g7-det-cle-mitchell-pts',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'prop', pick: 'Mitchell Over 24.5 points', odds: '-120',
    facts: [
      {label:'Series scoring',value:'23, 31, 35, 43, 21, 18 → 28.5 avg'},
      {label:'Engine (Phase 71c)',value:'25.3 pts — slightly over line'},
      {label:'Framework verdict',value:'medium×prop = SKIP cell + G7 cap'},
    ],
    reasoning: "Engine projects 25.3pts; line 24.5 is barely under. Audit cross-tab: medium×prop hit at 42% / -21% ROI. The line is too close to projection to call edge. Mitchell IS more likely to hit than not, but 'more likely' at -120 juice doesn't clear the framework's threshold. <strong style=\"color:var(--yellow)\">Treat as lean only at reduced stake; the deeper alt (O21.5) is the floor-parlay vehicle.</strong>",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Mitchell 26pts (10-19 FG, 3-8 3PT) in only 31min — OVER 24.5 by 1.5. Engine 25.3 projection right on. The lean was sound; line was just inside framework noise band.' },
  },
  {
    id: 'r2-g7-det-cle-duren-reb',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'prop', pick: 'Duren Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'Series rebounds',value:'8, 7, 9, 8, 8, 11 → 8.5 avg'},
      {label:'Engine (Phase 71c)',value:'8.8 reb — LINE ABOVE PROJECTION'},
      {label:'Framework verdict',value:'SKIP — Phase 71c suggests UNDER'},
    ],
    reasoning: "<strong style=\"color:var(--red)\">Phase 71c reversed the read on this bet.</strong> Pre-fix engine projected Duren ~9.8 reb (cleared 9.5). Post per-player correction (Phase 71c audit found Duren was over-predicted by +6.2pp PTS / +1.0 REB residually) the corrected projection is 8.8 — UNDER the line. Series rebs 8, 7, 9, 8, 8, 11 avg 8.5 confirms. Combined with high×prop SKIP cross-tab cell and G7 cap, this is a clear SKIP. The deeper alt (O7.5) in the floor parlay is the right way to capture his rebounding floor.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Duren 9 reb in DET blowout loss — UNDER 9.5 by 0.5. Phase 71c-corrected projection (8.8) was directionally right vs original 9.8. Reversal-call validated.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G1 — MON MAY 18: WCF SAS @ OKC at Paycom (defending champ + #1
  // seed vs Wemby-led upstart). Regular season: SAS went 4-1 vs OKC.
  // DraftKings: OKC -6.5 / total 219.5. CF tab UI is pending — these
  // bets are stored for the CF page when it lands; home page may not
  // surface them until SERIES_DATA scaffolds get full rosters.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g1-okc-sas-ml',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'ml', pick: 'OKC ML vs SAS', odds: '-260',
    facts: [
      {label:'Records',value:'OKC 64-18 (#1 W) | SAS #2 W'},
      {label:'Rest',value:'OKC 7 days | SAS 3 days'},
      {label:'Reg season',value:'SAS 4-1 vs OKC'},
      {label:'Market',value:'OKC -6.5 / 219.5'},
    ],
    reasoning: "<strong>Defending champ at home with full rest.</strong> OKC's 11.6 NetRtg vs SAS's depth at the wing positions makes OKC the talent favorite. The 4-1 regular-season record SAS holds is the lurking variable — but those games were spread across the season vs full-strength OKC playing 9-day-rest could be different. <strong style=\"color:var(--yellow)\">Reduced confidence:</strong> CF G1 historical accuracy is in the same elimination-game bucket the Phase 71 audit flagged. -260 juice is steep for a single bet; the floor parlay is the better expression.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SAS 122-115 (2OT). Wemby 41/24/3blk + game-sealing dunks in final minute. The 4-1 regular-season pattern held — SAS stole HCA. Phase 71 G6/G7 elimination caution would have downgraded this, but G1 sits outside the explicit cap.' },
  },
  {
    id: 'cf-g1-okc-sas-spread',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'spread', pick: 'OKC -6.5', odds: '-110',
    facts: [
      {label:'Market',value:'OKC -6.5'},
      {label:'WCF G1 base',value:'~67% home team covers G1 with full rest'},
    ],
    reasoning: "OKC at home with 7 days rest vs SAS's 3 — the rest gap is a 2-3pt edge in OKC's favor. Spread cell historical performance per Phase 71 audit is the cautionary note (margin MAE 13pt). Treat as lean. The SGA-vs-Castle perimeter battle + Holmgren-vs-Wemby paint chess will be the structural decider.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS won outright 122-115 in 2OT — spread didn\'t come close. The Phase 71 spread CAUTION pill was the right verdict; this should not have been placed at posted stake.' },
  },
  {
    id: 'cf-g1-okc-sas-total',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'total', pick: 'Under 219.5', odds: '-110',
    facts: [
      {label:'OKC R2 totals',value:'215, 227, 230, 237 → 227 avg'},
      {label:'SAS R2 totals',value:'209, 211, 228, 207, 223, 248 → 221 avg'},
      {label:'WCF G1 base',value:'CF openers historically ~5pts below series median'},
    ],
    reasoning: "Both teams' R2 totals averaged ~221-227 — line of 219.5 is slightly below that pool but Phase 17 finds CF G1 totals tend to settle ~5pts below the R2 median (teams play tighter Q1 D when they're newly scouted). Wemby's rim protection (3.7 blocks/g this playoffs) is the key under-driver — OKC's drive-and-kick offense crashes against length the way it doesn't vs LAL.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'237 total (SAS 122 + OKC 115, 2OT) — way over 219.5. Reg-time score was 99-99 (198) which WOULD have hit under, but Caruso\'s 8 made threes plus the 2OT pushed it 17.5 over the line.' },
  },
  {
    id: 'cf-g1-okc-sas-sga-pts',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'prop', pick: 'SGA Over 28.5 points', odds: '-115',
    facts: [
      {label:'R2 scoring vs LAL',value:'25, 22, 23, 35 → 26.3 avg'},
      {label:'2026 playoff avg',value:'27.4 ppg overall'},
      {label:'OKC home games',value:'+3 ppg vs road'},
    ],
    reasoning: "SGA at home, full rest, after closeout 35pt G4 vs LAL. Wemby is NOT his primary defender (Castle/Vassell will take the assignment), so this becomes a guard-on-guard battle SGA wins on volume. Line of 28.5 is slightly above his 26.3 R2 avg but home + rest + Castle/Vassell as POA defenders (not Wemby blocking the rim) supports the over.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SGA 24pts on 7-23 FG (30%) + 12 ast in 49+min. Even with 2OT volume he couldn\'t clear 28.5 — Castle/Harper hounded him at the POA and the looks were contested. Phase 71 SGA per-player bias correction (-6.9 PTS) absolutely predicted this; the bet contradicted the override.' },
  },
  {
    id: 'cf-g1-okc-sas-wemby-reb',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'prop', pick: 'Wembanyama Over 11.5 rebounds', odds: '-130',
    facts: [
      {label:'R2 rebounds',value:'5, 15, 15, 12, 17, 6 → 11.7 avg'},
      {label:'OKC opposing C rebs',value:'Holmgren 9.5/g, Hartenstein 9.2/g'},
      {label:'Wemby playoff avg',value:'11.5 rpg overall'},
    ],
    reasoning: "Wemby's series rebound floor was 5 (G1 limited mins) and 6 (G6 closeout blowout) — outside those two outliers, 12+ every game. OKC's smaller wings will force Wemby into more defensive rebounds. Line 11.5 is right at his series average; lean over given the matchup.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 24 rebounds — playoff career high. The OKC drive-and-kick produced exactly the miss volume thesis predicted, and Wemby cleaned both ends of the glass. Sole winning bet on the OKC-SAS G1 slate.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // ECF G1 — TUE MAY 19: CLE @ NYK at MSG (8 PM ET, ESPN)
  // NYK swept PHI 4-0 (9-day rest); CLE beat DET 4-3 (1-day rest).
  // DraftKings: NYK -7.5 / ML -265 / total 215.5.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ecf-g1-nyk-cle-ml',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'ml', pick: 'NYK ML vs CLE', odds: '-265',
    facts: [
      {label:'Records',value:'NYK 55-27 (#3 E) | CLE 57-25 (#4 E)'},
      {label:'Rest',value:'NYK 9 days | CLE 1 day'},
      {label:'R2 path',value:'NYK swept PHI 4-0 | CLE beat DET 4-3 (G7 road blowout)'},
      {label:'Market',value:'NYK -7.5 / 215.5'},
    ],
    reasoning: "NYK at home with the largest rest gap in any ECF G1 on record (9 days vs 1 day). CLE flew in from a G7 road blowout — Mitchell played 31min, Allen on chronic knee, Mobley 12reb workload. The rest disparity is worth 3-4pts in the model + the 1-day turnaround caps CLE's intensity ceiling. Rust risk for NYK is real but 9-day breaks historically produce 4-6pt Q1 dips, not full-game collapses. The PHI sweep showed NYK can score from anyone (McBride 25 G4, Shamet 12 bench, KAT 17/12/7ast distributing) — depth dilutes the rust effect.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: null,
  },
  {
    id: 'ecf-g1-nyk-cle-spread',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'spread', pick: 'NYK -7.5', odds: '-110',
    facts: [
      {label:'Market',value:'NYK -7.5 / DK opener'},
      {label:'ECF G1 home covers',value:'~64% historically with rest edge'},
      {label:'CLE one-day-rest record',value:'~38% cover on one-day turnaround playoff games'},
    ],
    reasoning: "Phase 71 spread CAUTION flag is the cautionary note (margin MAE 13pt). But the structural setup — CLE on 1-day rest after a road G7, NYK on 9-day rest at home — is the largest disparity all playoffs. Sweep team vs G7 team at home is the highest-cover edge in the historical sample. Treat as lean per audit guidance.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: null,
  },
  {
    id: 'ecf-g1-nyk-cle-total',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'total', pick: 'Under 215.5', odds: '-110',
    facts: [
      {label:'NYK pace',value:'97.5 (mid-pack)'},
      {label:'CLE pace',value:'96.8 (slow)'},
      {label:'ECF G1 base',value:'Historical ECF G1 totals ~5pts under regular line'},
      {label:'NYK R2 totals',value:'235, 210, 202, 258 → 226 avg (skewed by NYK G4 144 explosion)'},
    ],
    reasoning: "Both teams are bottom-third in pace; defense is the structural backbone of both rotations (NYK DRtg 111.8 / CLE DRtg 110.5). ECF G1 historically settles 4-6pts below regular-season line as defensive scouts intensify. NYK's G4 144pts vs PHI was a 3PT outlier (25 made threes); regression to mean is the realistic G1 path. The Brunson-Mitchell pull-up scoring is offset by Bridges/OG/Strus perimeter D — long contested possessions = lower totals.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: null,
  },
  {
    id: 'ecf-g1-nyk-cle-brunson-pts',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'prop', pick: 'Brunson Over 26.5 points', odds: '-115',
    facts: [
      {label:'R2 scoring vs PHI',value:'35, 22, 33, 26 → 29 avg'},
      {label:'NYK home games',value:'+2.4 ppg vs road'},
      {label:'Phase 71 STARTER correction',value:'-2.0 PTS applied'},
    ],
    reasoning: "Brunson averaged 29 vs PHI — line of 26.5 is 2.5 below that. Phase 71 STARTER tier correction (-2.0pp) applied: corrected projection 27 → still over 26.5 by 0.5. Tight margin but home + ECF stage + Mitchell guarding him at one end (which forces Brunson into Mitchell-mode counters) supports the over. The Phase 71 audit deemed Brunson calibrated within STARTER tier; no per-player override.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: null,
  },
  {
    id: 'ecf-g1-nyk-cle-mitchell-pts',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'prop', pick: 'Mitchell Over 25.5 points', odds: '-110',
    facts: [
      {label:'R2 scoring vs DET',value:'35, 30, 21, 43, 18, 26 → 28.8 avg'},
      {label:'G7 last night',value:'26pts in 31min (blowout cap)'},
      {label:'NYK perimeter D',value:'Bridges/OG elite POA defenders'},
    ],
    reasoning: "Mitchell averaged 28.8 vs DET — line 25.5 below that. G7 26pts in 31min on 0 TOs shows the legs are there. NYK perimeter D (Bridges/OG/Hart) is the toughest he's seen this postseason — that's a -3 to -4pp ceiling drag. Net projection ≈ 26 → lean over with caution. Phase 71 STARTER bias correction applied (-2pp); audit-corrected projection 26.8 still clears 25.5.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: null,
  },
  {
    id: 'ecf-g1-nyk-cle-kat-reb',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'prop', pick: 'KAT Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'R2 vs PHI',value:'12, 10, 12, 4 → 9.5 avg (G4 blowout-capped)'},
      {label:'Mobley/Allen presence',value:'Twin-big front court drives miss volume'},
      {label:'KAT season avg',value:'10.7 rpg'},
    ],
    reasoning: "KAT averaged 9.5 vs PHI even with G4 blowout cap. CLE runs twin-big with Mobley/Allen — that creates more contested rebounds at both rims than PHI's Drummond-solo setup. Line 9.5 is exactly at his R2 average; the structural matchup nudges over. Counting stat = blowout-stable (won't be capped by garbage time).",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: null,
  },

  // Phase 72 addition: Holmgren rebound prop (complements the
  // existing cf-g1-okc-sas-wemby-reb entry above). The two REB props
  // are the floor parlay's source legs — see FEATURED_PARLAYS.
  {
    id: 'cf-g1-okc-sas-holmgren-reb',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'prop', pick: 'Holmgren Over 8.5 rebounds', odds: '-125',
    facts: [
      {label:'R2 vs LAL',value:'12, 8, 8, 12 → 10.0 avg'},
      {label:'Engine (Phase 71c)',value:'9.2 reb'},
      {label:'Matchup',value:'vs Wemby — both fight for boards'},
    ],
    reasoning: "Holmgren projection 9.2 reb. R2 vs Ayton: 10.0 avg. Wemby matchup is brutal but Holmgren's mobility wins offensive boards. Phase 71 starter REB bias now calibrated (+0.19). Companion leg to Wemby O9.5 alt in the WCF G1 Bigs Floor parlay.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: null,
  },
];

// ============================================================
// FEATURED PARLAYS — declarative parlay schema
// ============================================================
// Schema:
//   id        : stable unique key
//   slate     : 'R2-G2' | …            which slate this parlay plays in
//   date      : 'YYYY-MM-DD'           when the parlay resolves
//   category  : 'floor' | 'traditional'  toggle group on Home page
//   type      : 'best-bet' | 'chaos' | 'value'  drives accent color
//   name      : display name
//   stake     : number (dollars)
//   odds      : string ('+110', '-120')
//   payout    : string  optional, e.g. '+$125'
//   legs      : [{ pick, odds, confidence, status?: 'hit'|'miss'|null, note }]
//   thesis    : free-form one-paragraph reasoning
//   result    : null | { outcome: 'win'|'loss'|'push', delta: '+125'|'-100' }
// ============================================================
const FEATURED_PARLAYS = [
  // ─── R2 G1 — RESOLVED ──────────────────────────────────────────
  {
    id: 'r2-g1-100-okc-det',
    slate: 'R2-G1', date: '2026-05-05',
    category: 'traditional', type: 'best-bet',
    name: '$100 Play — OKC Fortress + DET Home Court',
    stake: 100, odds: '+125', payout: '+$125',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:'hit',
        note:'OKC 108-90. Holmgren 24/12/3blk. LeBron 27 but LAL shot 37%.' },
      { pick:'DET ML vs CLE', odds:'-155', confidence:'medium-high', status:'hit',
        note:'DET 111-101. Cade 23/7ast, D.Robinson 19 (5-8 3PT). Duren clutch block.' },
    ],
    thesis:'Both home teams dominated G1. OKC\'s talent gap massive; DET\'s defense forced 19 CLE TOs (12 stl).',
    result: { outcome:'win', delta:'+125' },
  },
  {
    id: 'r2-g1-1-chaos-lebron',
    slate: 'R2-G1', date: '2026-05-05',
    category: 'traditional', type: 'chaos',
    name: '$1 Chaos Ticket — LeBron\'s Last Stand',
    stake: 1, odds: '+1800', payout: '-$1',
    legs: [
      { pick:'LAL ML @ OKC', odds:'+600', confidence:'chaos', status:'miss',
        note:'OKC 108-90. LAL shot 37% FG, never competitive.' },
      { pick:'CLE ML @ DET', odds:'+130', confidence:'chaos', status:'miss',
        note:'DET 111-101. CLE rallied to 93-93 but couldn\'t close.' },
    ],
    thesis:'No chaos tonight — favorites won both games convincingly.',
    result: { outcome:'loss', delta:'-1' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G2 — ARCHIVED (May 6: NYK-PHI + SAS-MIN)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR (80%+ hit rate per leg) ────────────────────
  {
    id: 'r2-g2-floor-iron',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'floor', type: 'best-bet',
    name: 'Iron Floor (3-Leg)',
    stake: 100, odds: '+190', payout: 'To Win: $190',
    legs: [
      { pick:'Brunson Over 19.5 pts (NYK-PHI G2)', odds:'-400', confidence:'floor', status:'hit',
        note:'26pts ✓. Game stayed close so he played 38min — exactly the scenario the floor thesis required.' },
      { pick:'Randle Over 14.5 pts (SAS-MIN G2)', odds:'-220', confidence:'floor', status:'miss',
        note:'12pts in 28min — sat early Q4 in 38pt blowout. Floor thesis assumed sub-15 only in blowouts; this WAS a blowout.' },
      { pick:'Vassell Over 9.5 pts (SAS-MIN G2)', odds:'-250', confidence:'floor', status:'hit',
        note:'12pts in 26min ✓ — held the floor as projected.' },
    ],
    thesis:'Every leg uses the FLOOR, not the ceiling. Brunson 19.5 is less than half his career avg vs PHI; he hasn\'t scored below 20 as a Knick in playoffs. Randle dipped below 15 only once all playoffs (24min game). Vassell locked into 11-16pts every game. Each leg clears 80%+ individually; combined at +190 is high-probability.',
    result: { outcome: 'loss', delta: '-100', actual: '2-of-3 legs hit. Randle\'s blowout-cap killed it — historical exception (sub-15 in blowouts) became the rule when SAS won by 38. Lesson: even "floor" props have correlated downside risk when the host team\'s blowout takes them out of the rotation.' },
  },
  {
    id: 'r2-g2-floor-home-stars',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'floor', type: 'best-bet',
    name: 'Home Stars (3-Leg)',
    stake: 100, odds: '+280', payout: 'To Win: $280',
    legs: [
      { pick:'OG Anunoby Over 12.5 pts (NYK-PHI G2)', odds:'-180', confidence:'floor', status:'hit',
        note:'24pts ✓ — cleared with massive room to spare. OG was 10-15 FG before exiting late.' },
      { pick:'Brunson Over 24.5 pts (NYK-PHI G2)', odds:'-150', confidence:'floor', status:'hit',
        note:'26pts ✓ — go-ahead bucket with 5:06 left, played 38min in tight game.' },
      { pick:'KAT Over 14.5 pts (NYK-PHI G2)', odds:'-200', confidence:'floor', status:'hit',
        note:'20pts/10reb/7ast ✓ — full triple-double-line floor performance.' },
    ],
    thesis:'All three legs are NYK home players with proven floor scoring. OG shot 87.5% G1 — midrange matchup-proof against PHI perimeter D. Brunson\'s 24.5 still 11pts below career avg vs PHI. KAT only below 15 in a sat-out blowout. Competitive G2 at MSG, all three clear comfortably.',
    result: { outcome: 'win', delta: '+280', actual: '3-of-3 legs hit ✓. Best parlay of the night. The "competitive G2" assumption was right (108-102, 25 lead changes); all three NYK starters played 30+ minutes and cleared their floors. +$280 on $100 stake.' },
  },
  {
    id: 'r2-g2-floor-spread',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'floor', type: 'best-bet',
    name: 'Spread + Floor (2-Leg)',
    stake: 100, odds: '+175', payout: 'To Win: $175',
    legs: [
      { pick:'MIN +9.5 (SAS-MIN G2)', odds:'-110', confidence:'floor', status:'miss',
        note:'SAS won by 38 — MIN didn\'t cover by 28.5. Largest playoff loss in MIN history. ATS history flag was right but G2 was the historical exception.' },
      { pick:'Brunson Over 19.5 pts (NYK-PHI G2)', odds:'-400', confidence:'floor', status:'hit',
        note:'26pts ✓.' },
    ],
    thesis:'MIN already won in San Antonio (G1, 104-102). Getting 9.5 means stay competitive — defense + Randle 21pts + Edwards expanding minutes ensures it. MIN 3-1 ATS as 9.5+ dogs, 5-1 last 6. Paired with Brunson rock-solid floor: two near-locks combined.',
    result: { outcome: 'loss', delta: '-100', actual: '1-of-2 — MIN +9.5 was the killer. The "post-upset bounce-back beatdown" pattern (favorite gets revenge at home) overwhelmed the ATS history. Lesson: angry-favorite home games can produce historical-record outcomes that no ATS pattern would predict.' },
  },

  // ─── TRADITIONAL (full range — regression / bounce-back / chaos) ─
  {
    id: 'r2-g2-trad-regression',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'traditional', type: 'best-bet',
    name: 'Regression Lock (2-Leg)',
    stake: 100, odds: '+145', payout: 'To Win: $145',
    legs: [
      { pick:'NYK ML vs PHI (G2)', odds:'-270', confidence:'high', status:'hit',
        note:'NYK 108-102 ✓ — Brunson 26 + KAT 20/10/7 led the close-out. Hart 3 + Q4 19-12 sealed it.' },
      { pick:'SAS ML vs MIN (G2)', odds:'-360', confidence:'high', status:'hit',
        note:'SAS 133-95 ✓ — regression validated MASSIVELY. SAS 41% 3PT vs G1 28%. Wemby 19/15.' },
    ],
    thesis:'Both home teams heavy favorites. SAS shot 28% 3PT G1 (season avg 37.5%) — 3.5 extra makes = +10.5pts of regression. NYK at home after dominant G1 vs tired PHI. Two strong favorites at home with bounce-back narratives.',
    result: { outcome: 'win', delta: '+145', actual: '2-of-2 ✓. Both home favorites won as projected. The regression thesis was the cleanest read of the night — when both teams shoot below their season averages and both are at home, the math is on your side. +$145 on $100.' },
  },
  {
    id: 'r2-g2-trad-bounceback',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'traditional', type: 'value',
    name: 'Bounce-Back Props (3-Leg)',
    stake: 100, odds: '+450', payout: 'To Win: $450',
    legs: [
      { pick:'Wembanyama Over 22.5 pts (G2)', odds:'-125', confidence:'medium', status:'miss',
        note:'19/15 — bounced back efficiency-wise (7-12 FG) but blowout took him out of Q4. Right thesis, wrong context (38pt rout).' },
      { pick:'Brunson Over 26.5 pts (G2)', odds:'-120', confidence:'high', status:'miss',
        note:'26pts — under by 0.5. Edgecombe defense early kept him at 9-21 (43%) below his usual ceiling.' },
      { pick:'Edwards Over 19.5 pts (G2)', odds:'-115', confidence:'medium', status:'miss',
        note:'12pts in 24min off bench — knee + blowout context killed it.' },
    ],
    thesis:'Wemby 0-8 3PT was career-worst for a 37.5% shooter — regression says 25+ G2. NOT a floor pick: Gobert + MIN defense scheme to contain him. Career avg vs MIN 22.6ppg, just clearing line. Edwards expanded minutes if knee holds. High upside at +450 but riskier than Floor parlays.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-3 ✗. All three played to their projected character but the LINES were just slightly above the deliveries — Brunson missed 26.5 by 0.5, Wemby and Edwards undermined by blowout-cap (sat in Q4). The "bounce-back happened, just not enough" loss.' },
  },
  {
    id: 'r2-g2-trad-chaos',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Double Upset (2-Leg)',
    stake: 100, odds: '+1800', payout: 'To Win: $1,800',
    legs: [
      { pick:'PHI ML vs NYK (G2)', odds:'+220', confidence:'chaos', status:'miss',
        note:'PHI lost 102-108. Played without Embiid (ruled out morning of game) so the "Embiid bounce-back" thesis was already moot. PHI did keep it close (25 lead changes) but couldn\'t close.' },
      { pick:'MIN ML vs SAS (G2)', odds:'+280', confidence:'chaos', status:'miss',
        note:'MIN lost by 38 — largest playoff loss in franchise history. Anti-chaos result.' },
    ],
    thesis:'MIN already won in San Antonio — not impossible. Dosunmu may return, Edwards 30+ min. PHI bounce-back potential real if Embiid goes nuclear. At +1800, $100 risk for $1,800 payout. Pure chaos.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-2 ✗. Embiid OUT (not in for the bounce-back) and MIN got run off the floor. Chaos didn\'t come — favorites swept. Common theme of the slate: this was a "favorites night."' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G2 — ARCHIVED (May 7: DET-CLE + OKC-LAL — bets pending manual resolution)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR ────────────────────────────────────────────
  // Restructured (May 7 PM): user pointed out that DK alternate prop lines
  // (lower line, higher juice) DO produce real floor parlays — earlier
  // mistake was treating them as unavailable. Compounding 90%+ legs with
  // juicy odds gives combined parlays at 80%+ hit rate.
  //
  // ALL ALT-LINE ODDS ARE ESTIMATES — daily checklist must verify exact
  // DK pricing before placing. The hit-rate notes are based on player's
  // last 10 games + engine projection.
  {
    id: 'r2-g2-may7-floor-star-compound',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Star Scoring Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+90', payout: 'To Win: ~$90 (verify on DK)',
    legs: [
      { pick:'SGA Over 22.5 pts (alt line — OKC-LAL G2)', odds:'~-300', confidence:'high', status:'miss',
        note:'SGA 22pts ✗ — under 22.5 by 0.5. Foul trouble + OKC blowing them out by 18 with Holmgren/bench leading. The "9 of 10 over 22.5" recent run snapped on the worst-possible heartbreak margin.' },
      { pick:'Cade Over 17.5 pts (alt line — DET-CLE G2)', odds:'~-500', confidence:'high', status:'hit',
        note:'Cade 25pts ✓ — easily cleared 17.5. Q4 closing run pushed him from ~13 through 3Q to 25.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G2)', odds:'~-200', confidence:'high', status:'hit',
        note:'LeBron 23pts ✓ — cleared 21.5 by 1.5. Reaves took the scoring load (31) so LeBron facilitated more than expected.' },
    ],
    thesis:'Three star scoring overs at ALTERNATE LINES below their main DK lines. Compounding 90-95% legs gives ~80% combined hit rate. SGA + Cade + LeBron are each 22.5/17.5/21.5 — all comfortably below their playoff averages of 31/27/24. Combined +90 estimate (with -300/-500/-200 alt juice). This is the parlay structure we should have kept all along — earlier removal was a mistake (treated alt lines as unavailable).',
    result: { outcome: 'loss', delta: '-100', actual: '2-of-3 ✗. SGA 22 was the killer — exactly 0.5 short of the alt line. Two days running of "deep alt + foul trouble" combining to bust a "floor" parlay. Lesson: when the line is ABOVE a player\'s G1 output (SGA G1 = 18; alt at 22.5), you\'re no longer betting on the floor — you\'re betting on a normal-mean game, and "normal" can break the wrong way.' },
  },
  {
    id: 'r2-g2-may7-floor-volume-compound',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Volume Floor (2-Leg, Alt Lines)',
    stake: 100, odds: '+66', payout: 'To Win: ~$66 (verify on DK)',
    legs: [
      { pick:'Cade Over 4.5 assists (deep alt line — DET-CLE G2)', odds:'~-700', confidence:'high', status:'hit',
        note:'Cade 10 ast ✓ — cleared 4.5 by a mile. Facilitator-mode game, double-digit assists for the second straight in series.' },
      { pick:'Holmgren Over 7.5 rebounds (alt line — OKC-LAL G2)', odds:'~-220', confidence:'high', status:'hit',
        note:'Holmgren 9 reb ✓ — cleared 7.5 by 1.5. Counting-stat thesis worked even though scoring under-performed.' },
    ],
    thesis:'Counting-stat 2-leg using deep alt lines to clear the 80% floor threshold. Math: 0.95 × 0.85 ≈ 81% combined. Tightened from a 3-leg version (was ~65-70% with SGA O4.5 ast as the dragging leg) by dropping the weakest leg AND pushing Cade\'s line one tick deeper to 4.5. Counting stats remain blowout-proof — even if either game gets out of hand, the primary ball-handler and the rim-running big accumulate stats by Q3. ~$66 payout is the right price for a true 80%+ floor.',
    result: { outcome: 'win', delta: '+66', actual: '2-of-2 ✓. Cleanest floor parlay of the night — counting stats DID prove blowout-proof. The lesson learned 5/6 (Randle blowout-cap) was applied: counting stats over scoring stats. +$66 on $100.' },
  },
  {
    id: 'r2-g2-may7-floor-okc-lebron-compound',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'OKC Lock + LeBron Floor (2-Leg, Alt Line)',
    stake: 100, odds: '+67', payout: 'To Win: ~$67 (verify on DK)',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:'hit',
        note:'OKC 125-107 ✓ — 18-pt win, mirror of G1 margin. Same dominant pattern: Holmgren plus bench depth.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G2)', odds:'~-200', confidence:'high', status:'hit',
        note:'LeBron 23 ✓ — cleared 21.5 by 1.5. Independence-from-blowout thesis correct (he scored 23 even though LAL lost by 18).' },
    ],
    thesis:'Two-leg parlay specifically engineered to clear the 80% floor threshold while paying meaningfully more than the solo OKC ML\'s $11. Math: 0.95 × 0.89 ≈ 85% combined. Crucial property: LeBron\'s scoring is INDEPENDENT of OKC blowing them out — he had 27pts (12-17 FG) in G1 while LAL lost by 18, so even a one-sided OKC win still produces a LeBron over. Three-leg compounds drop below 80% (0.95 × 0.85 × 0.92 = 74%), which is why this is capped at two legs.',
    result: { outcome: 'win', delta: '+67', actual: '2-of-2 ✓. The "LeBron scores independent of OKC dominating" thesis held perfectly — LAL lost by 18 and LeBron still went over. +$67 on $100.' },
  },

  // ─── TRADITIONAL (Value plays) ──────────────────────────────────
  // Demoted from Floor to Traditional: hit rates honest, +EV per engine but
  // not 75%+ combined. These are the "chase the engine edge" parlays where
  // we beat the market line per our model, but not at floor-pick reliability.
  {
    id: 'r2-g2-may7-trad-chalk-sweep',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Chalk Sweep — Both Home MLs (2-Leg)',
    stake: 100, odds: '+80', payout: 'To Win: $80',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:'hit',
        note:'OKC 125-107 ✓.' },
      { pick:'DET ML vs CLE', odds:'-162', confidence:'medium', status:'hit',
        note:'DET 107-97 ✓ — Allen healthy (22/7) but Cade\'s 12-pt Q4 sealed it. Coin-flip read was too cautious; DET\'s defensive structure carried through.' },
    ],
    thesis:'DEMOTED from Floor (combined ~57% hit rate after honest analysis). DET ML at ~60% is the dragging leg — Allen returning makes G2 a near-coin-flip per the engine, but DK still has DET as a 3.5-pt favorite. Combined +80 only makes sense if you really trust DET defense to suppress CLE again. Honest take: skip if you can\'t handle a 40% loss probability.',
    result: { outcome: 'win', delta: '+80', actual: '2-of-2 ✓. Both home favorites won. The hesitation about DET (downgraded from best-bet to medium) was overcautious — DET\'s structural advantages carried through Allen\'s return. +$80 on $100.' },
  },
  {
    id: 'r2-g2-may7-trad-star-scoring',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Star Scoring 2-Leg — SGA + Cade Overs',
    stake: 100, odds: '+240', payout: 'To Win: $240',
    legs: [
      { pick:'SGA Over 29 pts (OKC-LAL G2)', odds:'-120', confidence:'medium', status:'miss',
        note:'SGA 22 ✗ — way under 29. Foul trouble + OKC bench/Holmgren carrying.' },
      { pick:'Cade Over 27.5 pts (DET-CLE G2)', odds:'-118', confidence:'medium', status:'miss',
        note:'Cade 25 ✗ — under 27.5 by 2.5. Facilitator-mode (10 ast) capped scoring volume.' },
    ],
    thesis:'DEMOTED from Floor (combined ~40% after honest hit-rate analysis — even though both legs are +EV vs the market, neither is a 75%+ leg, so the parlay isn\'t a floor play). Engine projects clear overs on both, but recent variance makes this a value/upside play, not a floor parlay. +240 reflects the 40% combined miss probability.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-2 ✗. Both star scoring overs missed — a real value play that hit the wrong side of variance. SGA\'s 22-pt G2 (paired with G1\'s 18) suggests OKC\'s system is genuinely making him a co-equal (not a 30+ scorer) this series. Cade\'s facilitator mode caps his scoring whenever DET is up comfortably.' },
  },
  {
    id: 'r2-g2-may7-trad-star-props',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Star Props 3-Leg — SGA + Cade + LeBron',
    stake: 100, odds: '+800', payout: 'To Win: $800',
    legs: [
      { pick:'SGA Over 29 pts (OKC-LAL G2)', odds:'-120', confidence:'medium', status:'miss',
        note:'SGA 22 ✗.' },
      { pick:'Cade Over 27.5 pts (DET-CLE G2)', odds:'-118', confidence:'medium', status:'miss',
        note:'Cade 25 ✗.' },
      { pick:'LeBron Over 23.5 pts (OKC-LAL G2)', odds:'+185', confidence:'lean', status:'miss',
        note:'LeBron 23 ✗ — under by 0.5. Book pricing (Under -250) was correct on the blowout-cap thesis.' },
    ],
    thesis:'Honest combined hit rate ~25-30%. The +800 odds reflect that. This is a high-variance value play — engine likes all 3 individually but the combined probability is ~1-in-4. Use for ceiling chase, not floor.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-3 ✗. Worst-case outcome: all three missed, with LeBron the heartbreaker (0.5 under). +800 reflected a ~1-in-4 hit rate; this slate hit the 3-in-4 outcome.' },
  },
  {
    id: 'r2-g2-may7-trad-chaos',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Road Upset Double (2-Leg)',
    stake: 100, odds: '+1750', payout: 'To Win: $1,750',
    legs: [
      { pick:'CLE ML vs DET', odds:'+136', confidence:'chaos', status:'miss',
        note:'CLE lost 97-107 ✗. Mitchell 31 + Allen 22/7 wasn\'t enough — DET defense + Cade Q4 closing run.' },
      { pick:'LAL ML vs OKC', odds:'+600', confidence:'chaos', status:'miss',
        note:'LAL lost 107-125 ✗. Reaves 31 (the bounce-back leg) hit, but OKC bench + 21 LAL TOs blew it open.' },
    ],
    thesis:'Combined hit rate ~2% per engine. Pure chaos play — $100 risk for $1,750 upside. As designed.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-2 ✗. Same as 5/6 chaos — favorites swept the slate. Both home teams up 2-0 now in their respective series.' },
  },

  // ─── R2 G3 — ARCHIVED (Fri May 8: NYK-PHI + SAS-MIN) ────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  // Tonight uses 4 floor structures spanning pts / reb / blocks / assists / spread.
  {
    id: 'r2-g3-may8-floor-star-pts',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Star Triple Floor — Pts (3-Leg)',
    stake: 100, odds: '+60', payout: 'To Win: ~$60 (verify on DK)',
    legs: [
      { pick:'Brunson Over 19.5 pts (alt line — NYK-PHI G3)', odds:'~-350', confidence:'floor', status:'hit',
        note:'Brunson 33pts (11-22 FG, 38min) — over 19.5 cleared by 13.5pts. Floor confirmed.' },
      { pick:'KAT Over 14.5 pts (alt line — NYK-PHI G3)', odds:'~-300', confidence:'floor', status:'miss',
        note:'KAT 8pts in 26min — passive offensively (focused on glass: 12 reb, 4 OREB). Under 14.5 missed. The "hasn\'t scored under 15" claim broke at the worst time — when he played starter minutes but never looked for shots in PHI\'s perimeter-tight scheme.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — over 1.5 cleared comfortably. ~95% floor confirmed.' },
    ],
    thesis:'Three pts/blocks legs at deep alt lines, each ≥92% per leg. Math: 0.92 × 0.92 × 0.95 ≈ 80.4% combined. Spans both games and both Eastern stars (Brunson, KAT) plus the West\'s defensive engine (Wemby). Independent legs across different games means correlation risk is minimal.',
    result: { outcome: 'loss', delta: '-100', actual: '2-of-3 ✗. Brunson 33pts ✅, Wemby 5blk ✅, but KAT 8pts in 26min ✗. KAT-as-floor leg lesson: "hasn\'t scored under 15" pattern can break in a low-volume game where the role tilts to playmaker-rebounder rather than scorer. The KAT 4-OREB / 7-AST line shows he played the right game for NYK\'s win — just not the points-volume one the bet needed.' },
  },
  {
    id: 'r2-g3-may8-floor-wemby-twoway',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Wembanyama Two-Way (2-Leg, Same Game)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50',
    legs: [
      { pick:'Wembanyama Over 12.5 rebounds (SAS-MIN G3)', odds:'-140', confidence:'floor', status:'hit',
        note:'Wemby 15reb — third straight 15-reb game. Cushion held.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — ~95% floor confirmed across all 3 games.' },
    ],
    thesis:'Same-game compound on Wemby\'s defensive/rebounding dominance. Math: 0.87 × 0.95 ≈ 82.7% combined. Legs are positively correlated (same player, same shift) which technically tightens the joint probability around the player\'s minutes baseline — if he plays 30+min, both hit; if he gets blown out of minutes due to garbage time, both could miss. Lower payout (+50) reflects the correlation, but the floor reliability is genuine.',
    result: { outcome: 'win', delta: '+50', actual: '2-of-2 ✅. Wemby 15reb + 5blk in 39pts/15reb/5blk Kareem-tier line. Counting-stat floor played out exactly as designed.' },
  },
  {
    id: 'r2-g3-may8-floor-multistat',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Multi-Stat Floor — Ast / Reb / Blk (3-Leg)',
    stake: 100, odds: '+40', payout: 'To Win: ~$40 (verify on DK)',
    legs: [
      { pick:'Brunson Over 3.5 assists (deep alt line — NYK-PHI G3)', odds:'~-450', confidence:'floor', status:'hit',
        note:'Brunson 9 ast — over 3.5 cleared by 5.5. Floor confirmed.' },
      { pick:'Hart Over 4.5 rebounds (NYK-PHI G3)', odds:'~-280', confidence:'floor', status:'hit',
        note:'Hart 11 reb — over 4.5 cleared by 6.5. The "workhorse double-double" floor confirmed.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — over 1.5 cleared by 3.5.' },
    ],
    thesis:'NEW prop dimensions — assists, rebounds, blocks (no scoring lines). Math: 0.95 × 0.90 × 0.95 ≈ 81.2% combined. Less variance than scoring-driven parlays because counting stats accrue throughout the game and don\'t depend on hot/cold shooting nights. Lower payout (+40) reflects the deeper alt juice.',
    result: { outcome: 'win', delta: '+40', actual: '3-of-3 ✅. The cleanest counting-stat parlay possible — every leg cleared by 3.5+ over the line. The May 6 Randle blowout-cap lesson (use counting stats, not scoring) paid off explicitly.' },
  },
  {
    id: 'r2-g3-may8-floor-spread-stat',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Deep Spread + Stat Floor (3-Leg)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50 (verify on DK)',
    legs: [
      { pick:'NYK +9.5 (alt spread — NYK-PHI G3)', odds:'~-200', confidence:'floor', status:'hit',
        note:'NYK won by 14 outright — +9.5 covered by 23.5pts. The "win or lose by ≤9" thesis got the strongest possible version (outright road W).' },
      { pick:'Brunson Over 3.5 assists (deep alt — NYK-PHI G3)', odds:'~-450', confidence:'floor', status:'hit',
        note:'Brunson 9 ast — cleared comfortably.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — cleared comfortably.' },
    ],
    thesis:'Spread-driven parlay using deep alt spread (NYK +9.5) instead of player props. Math: 0.88 × 0.95 × 0.95 ≈ 79.4% combined — just under the 80% threshold but the most game-script-resilient leg structure on the slate (NYK only needs to lose by ≤9 OR win — covers most realistic outcomes). Pairs with two reliable counting-stat legs.',
    result: { outcome: 'win', delta: '+50', actual: '3-of-3 ✅. NYK won the road game outright by 14 — the model edge played out at maximum value. Stat legs cleared cleanly.' },
  },

  // TRADITIONAL (value plays — engine edge but lower floor)
  {
    id: 'r2-g3-may8-trad-nyk-edge',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'traditional', type: 'value',
    name: 'NYK Model Edge (2-Leg)',
    stake: 100, odds: '+220', payout: 'To Win: $220',
    legs: [
      { pick:'NYK ML vs PHI', odds:'+100', confidence:'medium', status:'hit',
        note:'NYK won 108-94. ML +100 cashed. Model edge validated.' },
      { pick:'Brunson Under 26.5 pts (NYK-PHI G3)', odds:'-118', confidence:'medium', status:'miss',
        note:'Brunson 33pts (11-22 FG, 38min) — went the other way. The FT-volume-drop thesis was right structurally (he had ~6 FT) but FG volume jumped (22 attempts) — Brunson hunted his shot rather than facilitating in the clincher spot. Road FT compression alone wasn\'t enough vs aggressive shot-hunting.' },
    ],
    thesis:'Honest combined ~33% hit rate. Both legs are model-edge plays where the market is mispricing — NYK at +100 when model says they\'re the better side, Brunson Under at a road game where the FT volume drop alone is worth 3 points. +220 reflects ~33% combined. Engine-edge value play, not a floor.',
    result: { outcome: 'loss', delta: '-100', actual: '1-of-2 ✗. NYK ML hit ✅, Brunson Under 26.5 missed ✗ (33pts). Cleanest example of the "right thesis, wrong leg pairing" — the ML and the Brunson Under were correlated NEGATIVELY (NYK winning a tight road game often correlates with Brunson going off, not Brunson being limited). Lesson: stacking ML + scorer-Under in the same game double-counts a single thesis.' },
  },
  {
    id: 'r2-g3-may8-trad-chaos-sweep',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Both Road Favorites (2-Leg)',
    stake: 100, odds: '+330', payout: 'To Win: $330',
    legs: [
      { pick:'NYK ML vs PHI', odds:'+100', confidence:'medium', status:'hit',
        note:'NYK 108-94 ✅. Structural edge cashed.' },
      { pick:'SAS ML vs MIN', odds:'-198', confidence:'high', status:'hit',
        note:'SAS 115-108 ✅. Wemby 39/15/5 carried.' },
    ],
    thesis:'Two road games with both road teams favored by the model (NYK by engine edge, SAS by market). Combined ~43%. Cleaner than the chaos slates of 5/6-5/7 because both legs have model conviction. Pays +330 if both road teams win — common scenario in playoff games where home crowd matters less than rest/scheme.',
    result: { outcome: 'win', delta: '+330', actual: '2-of-2 ✅. Both road favorites cashed by 7+ pts. Best return on the slate — model conviction + correlation absent (different games, different conferences) is the right "chaos" structure.' },
  },

  // ─── R2 G3 — TOMORROW (Sat May 9: OKC-LAL + DET-CLE) ─────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g3-may9-floor-okc-core',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'floor', type: 'best-bet',
    name: 'OKC Core Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+55', payout: 'To Win: ~$55 (verify on DK)',
    legs: [
      { pick:'OKC ML vs LAL (G3)', odds:'-375', confidence:'high', status:'hit',
        note:'OKC 131-108 ✅. Won by 23 — third straight blowout.' },
      { pick:'Holmgren Over 7.5 rebounds (alt line — OKC-LAL G3)', odds:'~-250', confidence:'floor', status:'hit',
        note:'9reb ✅. Cleared 7.5 by 1.5.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G3)', odds:'~-200', confidence:'floor', status:'miss',
        note:'19pts (7-19 FG, 8 ast/6 reb) — facilitator mode at 37min/age 41 in a 23-pt loss. Floor broke when LAL had no second creator (Reaves regressed to 17 from 31).' },
    ],
    thesis:'Same structure as the winning May 7 "OKC Lock + LeBron Floor" parlay (2-of-2 ✓, +$67) but expanded to 3 legs by adding Holmgren rebounds. LeBron\'s scoring independence from OKC blowouts is PROVEN (27, 23 in G1+G2 18-pt losses). Holmgren\'s rebounding is structural (Ayton matchup dominated). Math: 0.80 × 0.87 × 0.89 ≈ 61.9% — below 80% threshold due to 3-leg compound, but each leg individually is floor-grade. Lower payout (+55) reflects the compound risk.',
    result: { outcome:'loss', delta:'-$100', actual:'2-of-3 (OKC ML ✅, Holmgren O7.5 ✅, LeBron O21.5 ❌). The LeBron leg was the soft spot — facilitator-mode at age 41 in a road blowout broke the "scoring is independent" thesis.' },
  },
  {
    id: 'r2-g3-may9-floor-counting-stats',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'floor', type: 'best-bet',
    name: 'Counting Stat Floor (2-Leg)',
    stake: 100, odds: '+40', payout: 'To Win: ~$40 (verify on DK)',
    legs: [
      { pick:'Cade Over 5.5 assists (alt line — DET-CLE G3)', odds:'~-400', confidence:'floor', status:'hit',
        note:'10 ast (also 27pts/10reb triple-double). Cleared 5.5 by 4.5.' },
      { pick:'Holmgren Over 7.5 rebounds (alt line — OKC-LAL G3)', odds:'~-250', confidence:'floor', status:'hit',
        note:'9 reb. Cleared 7.5 by 1.5.' },
    ],
    thesis:'Pure counting-stat parlay — the lesson from May 6 (Randle blowout-cap killed a "floor" scoring prop) applied directly. Assists and rebounds accrue throughout the game regardless of score margin. Both legs cleared in EVERY game this series. Math: 0.93 × 0.87 ≈ 80.9% combined. Clean 80%+ floor.',
    result: { outcome:'win', delta:'+$40', actual:'2-of-2 ✅. Counting-stat thesis validated — assists and rebounds accrue regardless of game script.' },
  },
  {
    id: 'r2-g3-may9-floor-okc-lebron',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'floor', type: 'best-bet',
    name: 'OKC Lock + LeBron Floor (2-Leg)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50 (verify on DK)',
    legs: [
      { pick:'OKC ML vs LAL (G3)', odds:'-375', confidence:'high', status:'hit',
        note:'OKC 131-108 ✅. Won by 23.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G3)', odds:'~-200', confidence:'floor', status:'miss',
        note:'19pts — pivoted to playmaker (8ast/6reb in 37min) when Reaves regressed to 17. Scoring independence broke at age 41 in a 23-pt road loss.' },
    ],
    thesis:'REPEAT of the winning May 7 parlay structure (2-of-2 ✓, +$67). Same thesis: LeBron\'s scoring is INDEPENDENT of OKC blowing them out. He scored 27 and 23 in consecutive 18-pt losses. At home with desperation, he\'ll be even more aggressive. Math: 0.80 × 0.89 ≈ 71.2% — slightly below 80% threshold but proven structure.',
    result: { outcome:'loss', delta:'-$100', actual:'1-of-2 (OKC ML ✅, LeBron O21.5 ❌). Same LeBron leg failure as the 3-leg parlay — scoring independence is real for 1 game but not for 3 straight blowouts at age 41.' },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g3-may9-trad-cle-home',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'traditional', type: 'value',
    name: 'CLE Home Stand (2-Leg)',
    stake: 100, odds: '+175', payout: 'To Win: $175',
    legs: [
      { pick:'CLE ML vs DET (G3)', odds:'-175', confidence:'lean', status:'hit',
        note:'CLE 116-109 ✅. Model: CLE by 4 (actual: by 7). HCA + Mitchell rhythm cashed.' },
      { pick:'Mitchell Over 27.5 pts (DET-CLE G3)', odds:'-120', confidence:'medium', status:'hit',
        note:'35pts (13-24, 7-8 FT, 10reb, 4ast) ✅. Cleared by 7.5.' },
    ],
    thesis:'CLE at home is a different team — Mitchell\'s home splits are significantly better. Down 0-2 with maximum desperation + Allen healthy gives CLE their best shot. Combined ~42% hit rate. Engine-edge play, not a floor.',
    result: { outcome:'win', delta:'+$175', actual:'2-of-2 ✅. Best return of the slate — both legs hit cleanly. Mitchell sustained 31-pt G2 form into 35; CLE bench finally outscored DET bench.' },
  },
  {
    id: 'r2-g3-may9-trad-chalk-sweep',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'traditional', type: 'value',
    name: 'Favorites Sweep — OKC + CLE MLs (2-Leg)',
    stake: 100, odds: '+100', payout: 'To Win: $100',
    legs: [
      { pick:'OKC ML vs LAL (G3)', odds:'-375', confidence:'high', status:'hit',
        note:'OKC 131-108 ✅.' },
      { pick:'CLE ML vs DET (G3)', odds:'-175', confidence:'lean', status:'hit',
        note:'CLE 116-109 ✅.' },
    ],
    thesis:'Both favorites per model. OKC\'s structural dominance makes them ~80% even on the road; CLE at home with desperation and Mitchell rhythm is ~62%. Combined ~50% — coin flip at +100 odds. Better value than the May 7 Chalk Sweep (+80) because CLE has stronger model conviction than DET did at -162.',
    result: { outcome:'win', delta:'+$100', actual:'2-of-2 ✅. Both road favorites cashed (OKC away → won by 23; CLE home → won by 7). The 50% combined hit at +100 odds was the right value play.' },
  },
  {
    id: 'r2-g3-may9-trad-chaos',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — LAL Home + DET Road Sweep (2-Leg)',
    stake: 100, odds: '+1200', payout: 'To Win: $1,200',
    legs: [
      { pick:'LAL ML vs OKC (G3)', odds:'+295', confidence:'chaos', status:'miss',
        note:'LAL lost by 23 — Reaves regressed to 17, LeBron pivoted to playmaker, OKC bench (A.Mitchell 24, Wallace 16, Joe 12) blew it open. Worst LAL G3 of the series.' },
      { pick:'DET ML vs CLE (G3)', odds:'+145', confidence:'chaos', status:'miss',
        note:'DET lost by 7. Cade triple-double on 10-27 FG / 8 TOs wasn\'t the closer-mode game DET needed; Strus go-ahead steal sealed it for CLE.' },
    ],
    thesis:'~5% combined hit rate. Pure chaos play. LAL at home with LeBron + Reaves healthy is the best version of this team — but they still lost by 18 at their best. DET winning on the road would require Cade Q4 magic + CLE shooting staying broken. $100 for $1,200 upside.',
    result: { outcome:'loss', delta:'-$100', actual:'0-of-2. Both road faves cashed; chaos play correctly priced ~5% and missed at expected rate.' },
  },

  // ─── R2 G4 — ARCHIVED (Sun May 10: NYK-PHI G4 + SAS-MIN G4) ────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g4-may10-floor-wemby-counting',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'floor', type: 'best-bet',
    name: 'Wemby Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+45', payout: 'To Win: ~$45 (verify on DK)',
    legs: [
      { pick:'Wemby Over 11.5 rebounds (alt — SAS-MIN G4)', odds:'~-300', confidence:'floor', status:'miss',
        note:'15reb in EVERY series game. Counting stat, blowout-proof. Real hit rate ~95%.' },
      { pick:'Wemby Over 2.5 blocks (SAS-MIN G4)', odds:'-140', confidence:'floor', status:'miss',
        note:'12, 5, 5 blocks in series. MIN drives through the lane out of necessity. Real hit rate ~95%.' },
    ],
    thesis:'Pure counting-stat parlay anchored on Wemby. Both legs cleared in EVERY series game. The matchup is structural — MIN has no answer for his length. Math: 0.95 × 0.95 ≈ 90.3% combined. Highest-floor parlay on the slate.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. Wemby ejection (Flagrant 2 elbow to Reid) torpedoed BOTH counting-stat legs in one variance shock. A 95%×95% parlay went to zero on an unpredictable single-incident discipline call." },
  },
  {
    id: 'r2-g4-may10-floor-kat-brunson',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'floor', type: 'best-bet',
    name: 'NYK Star Floor (2-Leg)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50 (verify on DK)',
    legs: [
      { pick:'KAT Over 8.5 rebounds (alt — NYK-PHI G4)', odds:'~-220', confidence:'floor', status:'miss',
        note:'10reb G2, 12reb G3 — PHI C rotation thin (Drummond + Bona + hobbled Embiid). Real hit rate ~85%.' },
      { pick:'Brunson Over 24.5 points (alt — NYK-PHI G4)', odds:'~-220', confidence:'floor', status:'miss',
        note:'Series avg 31.3 ppg (35, 26, 33). Closeout games push star usage UP. Real hit rate ~88%.' },
    ],
    thesis:'NYK star counting-stat floor. KAT rebounding edge is structural (PHI thin C rotation); Brunson scoring is sustained at 31+ in series with PHI defense having no answer for his PnR. Math: 0.85 × 0.88 ≈ 74.8% combined. Slightly below 80% threshold but each leg individually ≥85%.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. NYK won 144-114 in a 3PT variance walkover (25-44 from 3, postseason record). Usage spread to shooters (McBride 7 threes) — star counting-stat legs both fail." },
  },
  {
    id: 'r2-g4-may10-floor-multi-stat',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'floor', type: 'best-bet',
    name: 'Multi-Stat Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+85', payout: 'To Win: ~$85 (verify on DK)',
    legs: [
      { pick:'Wemby Over 2.5 blocks (SAS-MIN G4)', odds:'-140', confidence:'floor', status:'miss',
        note:'12, 5, 5 blocks. ~95% hit.' },
      { pick:'Wemby Over 11.5 rebounds (alt — SAS-MIN G4)', odds:'~-300', confidence:'floor', status:'miss',
        note:'15 in every game. ~95% hit.' },
      { pick:'KAT Over 8.5 rebounds (alt — NYK-PHI G4)', odds:'~-220', confidence:'floor', status:'miss',
        note:'10, 12 in last two. ~85% hit.' },
    ],
    thesis:'Three-leg counting-stat compound. The slate\'s safest legs combined for higher payout. Math: 0.95 × 0.95 × 0.85 ≈ 76.7% combined. Below 80% combined due to 3-leg compound but each leg individually is floor-grade.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-3. Worst-case slate for counting-stat compounds — Wemby ejected AND KAT passive on glass on the same night. Independent stat lines correlated downward by two unrelated variance events." },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g4-may10-trad-sas-ml-wemby',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'traditional', type: 'best-bet',
    name: 'SAS Lock + Wemby Reb (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: $105',
    legs: [
      { pick:'SAS ML vs MIN (G4)', odds:'-195', confidence:'high', status:'miss',
        note:'Model: SAS by 3 (~65%). G3 win at MIN proved road durability with Wemby in transcendent form.' },
      { pick:'Wemby Over 12.5 rebounds (SAS-MIN G4)', odds:'-140', confidence:'floor', status:'miss',
        note:'15 in every game — 92% hit.' },
    ],
    thesis:'SAS ML at -195 is the model\'s single best edge on the slate; pair with the Wemby rebounding floor (which clears regardless of game outcome). Combined ~60% at +105 payout. Better value than the chalk sweep because SAS spread (-4.5) is too rich.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. Both legs killed by the same Wemby ejection. Model thesis (SAS by 3) was sound; the discipline shock dominated." },
  },
  {
    id: 'r2-g4-may10-trad-nyk-closeout',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'traditional', type: 'value',
    name: 'NYK Closeout — ML + Brunson (2-Leg)',
    stake: 100, odds: '+165', payout: 'To Win: $165',
    legs: [
      { pick:'NYK ML vs PHI (G4)', odds:'-122', confidence:'medium', status:'hit',
        note:'Sweep-cliff closeout. Model ~63% vs market ~55%.' },
      { pick:'Brunson Over 27.5 points (NYK-PHI G4)', odds:'-115', confidence:'high', status:'miss',
        note:'Series avg 31.3 ppg. ~75% hit.' },
    ],
    thesis:'NYK ML + Brunson scoring — both correlated to NYK structural edge. Brunson scoring 28+ usually means NYK wins. Combined ~52% at +165 — solid traditional value play. Better than NYK -1.5 spread because closeout games are notoriously hard to cover.',
    result: { outcome: "loss", delta: "-$100", actual: "1-of-2 (NYK ML hit, Brunson Over missed). Correlation thesis (NYK wins → Brunson 28+) broke because the win came via 3PT variance (McBride 7-of-9), not Brunson playmaking." },
  },
  {
    id: 'r2-g4-may10-trad-chaos',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — PHI Backdoor + MIN Home Hold (2-Leg)',
    stake: 50, odds: '+650', payout: 'To Win: $325',
    legs: [
      { pick:'PHI ML vs NYK (G4)', odds:'+102', confidence:'chaos', status:'miss',
        note:'Last home game; Embiid back; Maxey/George 40+min in desperation. Closeout backdoor scenario.' },
      { pick:'MIN ML vs SAS (G4)', odds:'+162', confidence:'chaos', status:'hit',
        note:'Home + Edwards full minutes + Wemby reverts to mean. Down 1-2 desperation game.' },
    ],
    thesis:'~13% combined hit rate. Both home dogs in must-win-or-bust spots. PHI is the more plausible backdoor (closeout games have ~50% home wins for non-sweep dogs). MIN needs a Wemby off-night. Stake reduced to $50 (chaos) for $325 upside.',
    result: { outcome: "loss", delta: "-$50", actual: "1-of-2 (MIN ML hit on the Wemby-ejection variance, PHI ML missed in a blowout). Chaos parlay only pays if BOTH home dogs hit." },
  },

  // ─── R2 G4 — ARCHIVED (Mon May 11: DET-CLE G4 CLE wins 112-103 / OKC-LAL G4 OKC wins 115-110 sweeps) ────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g4-may11-floor-sga-cade',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'floor', type: 'best-bet',
    name: 'Star Volume Floor (2-Leg)',
    stake: 100, odds: '+75', payout: 'To Win: ~$75 (verify on DK)',
    legs: [
      { pick:'SGA Over 30.5 points (OKC-LAL G4)', odds:'-115', confidence:'floor', status:'hit',
        note:'SGA 35pts — closeout mode validated (first 30+ of series after 18/22/23 cruise).' },
      { pick:'Cunningham Over 24.5 points (DET-CLE G4)', odds:'-115', confidence:'floor', status:'miss',
        note:'Cade 19pts (FIRST under-20 in 11 straight playoff games). CLE doubled aggressively, denied closing-Q4 control.' },
    ],
    thesis:'Star volume floor parlay anchored on each game\'s primary creator. SGA in closeout mode (historical 33+ ppg pattern). Cade as DET\'s only consistent shot creator in a series where DET has won 2 of 3 by leaning on his usage. Math: 0.80 × 0.80 ≈ 64.0% combined. Slightly below the strict 80% threshold combined but each leg individually ≥80% — true to the floor category definition.',
    result: { outcome: "loss", delta: "-$100", actual: "1-of-2 (SGA 35 HIT, Cade 19 MISS — first sub-20 in 11 straight playoff games)." },
  },
  {
    id: 'r2-g4-may11-floor-lebron-mitchell',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'floor', type: 'best-bet',
    name: 'Home-Star Floor (2-Leg)',
    stake: 100, odds: '+85', payout: 'To Win: ~$85 (verify on DK)',
    legs: [
      { pick:'LeBron Over 22.5 points (alt — OKC-LAL G4)', odds:'~-180', confidence:'floor', status:'hit',
        note:'LeBron 24/12reb at age 41 — final home playoff game effort, left it all on the court.' },
      { pick:'Mitchell Over 26.5 points (alt — DET-CLE G4)', odds:'~-180', confidence:'floor', status:'hit',
        note:'Mitchell 43pts — 39 in 2H, tied Sleepy Floyd 1987 NBA playoff record. Career playoff high.' },
    ],
    thesis:'Home-star floor parlay. Both stars in must-perform spots at home: LeBron elimination, Mitchell must-protect-home. Alt-line drops to ~22.5 LeBron / 26.5 Mitchell give meaningful cushion below their series median. Math: 0.88 × 0.85 ≈ 74.8% combined.',
    result: { outcome: "win", delta: "+$85", actual: "2-of-2 (LeBron 24, Mitchell 43). Best bet of the slate — Home-Star Floor delivered on both legs with margin to spare." },
  },
  {
    id: 'r2-g4-may11-floor-multi-volume',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'floor', type: 'best-bet',
    name: 'Multi-Volume Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify on DK)',
    legs: [
      { pick:'SGA Over 26.5 points (alt — OKC-LAL G4)', odds:'~-280', confidence:'floor', status:'hit',
        note:'SGA 35pts (12-25 FG, 8-9 FT) — closeout-mode volume jump validated.' },
      { pick:'Cunningham Over 22.5 points (alt — DET-CLE G4)', odds:'~-260', confidence:'floor', status:'miss',
        note:'Cade 19pts (7-19 FG, 5 TOs). CLE doubled aggressively, denied closing-Q4 control. Even the alt-22.5 cushion broke.' },
      { pick:'LeBron Over 22.5 points (alt — OKC-LAL G4)', odds:'~-180', confidence:'floor', status:'hit',
        note:'LeBron 24/12reb at age 41 in his final home playoff game of the season.' },
    ],
    thesis:'Three-leg star-volume compound at deep alt lines. Each leg is structurally pushed UP by tonight\'s game context (closeout for SGA, must-win road for Cade, elimination home for LeBron). Math: 0.92 × 0.88 × 0.88 ≈ 71.3% combined. Below 80% combined due to 3-leg compound but each leg individually ≥85% floor-grade.',
    result: { outcome: "loss", delta: "-$100", actual: "2-of-3 (SGA 35 HIT, LeBron 24 HIT, Cade 19 MISS). Cade alt-22.5 floor leg blew up — CLE\'s scheme adjustment + 7-19 FG capped him below the cushion line. Honest retro: when a star\'s usage gets actively schemed against in a closeout context, even \'deep alt floor\' lines aren\'t safe." },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g4-may11-trad-lal-cover',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'traditional', type: 'best-bet',
    name: 'LAL Cover + Under (2-Leg)',
    stake: 100, odds: '+265', payout: 'To Win: $265',
    legs: [
      { pick:'LAL +11.5 (OKC-LAL G4)', odds:'-110', confidence:'high', status:'hit',
        note:'OKC won by 5 (115-110) — LAL covered the +11.5 spread comfortably. Engine edge fully validated.' },
      { pick:'Under 214.5 (OKC-LAL G4)', odds:'-110', confidence:'lean', status:'miss',
        note:'Final 225 (OKC 115 + LAL 110) — OVER by 10.5. LAL\'s late desperation rally + OKC\'s Q4 closing pace pushed it over. Anti-correlation with the spread leg — when LAL covers, the total drops in theory; here both teams kept scoring.' },
    ],
    thesis:'<strong>Largest engine edge on the slate.</strong> LAL +11.5 is the single best read tonight — sweep-cliff favorites cover only ~40% ATS as bench rotations eat minutes. Under 214.5 is the correlated leg: if LAL covers, the game is tighter and the total drops to ~205-210 range. Both legs ride the same "OKC eases off / LAL keeps pace" thesis. Math: ~58% × ~55% ≈ 32% combined at +265 = clean +EV.',
    result: { outcome: "loss", delta: "-$100", actual: "1-of-2 (LAL +11.5 HIT comfortably with OKC by 5, Under 214.5 MISS at 225 total). The \'correlated thesis\' broke: LAL covered AND the total went over because both teams kept scoring in a fast-paced Q4. Retro: under-the-spread + LAL-covers correlation assumed slower pace; actual pace stayed high because LAL had to push to keep it close." },
  },
  {
    id: 'r2-g4-may11-trad-det-cle-edge',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'traditional', type: 'value',
    name: 'DET Upset + Cade Volume (2-Leg)',
    stake: 100, odds: '+340', payout: 'To Win: $340',
    legs: [
      { pick:'DET ML vs CLE (G4)', odds:'+140', confidence:'medium', status:'miss',
        note:'CLE 112-103. DET lost by 9 — Mitchell\'s 43pt explosion (39 in 2H, NBA playoff record-tied) was the swing.' },
      { pick:'Cunningham Over 24.5 points (DET-CLE G4)', odds:'-115', confidence:'high', status:'miss',
        note:'Cade 19pts (first under-20 in 11 straight playoffs). CLE\'s schematic adjustment (Mobley primary screen-defender + doubles) capped him.' },
    ],
    thesis:'DET ML at +140 is the second-best value on the slate IF the HCA-flip-retro calibration applies (model has been wrong-direction on home-favored picks in NYK-PHI/SAS-MIN G3s). Cade volume is correlated — if DET wins, Cade is the driver. Combined ~38% at +340 = +EV. Better than DET +3.5 spread because the edge is on outright winning, not covering.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. The HCA-flip retro lesson did NOT apply here — CLE was the home team in G4 and Mitchell\'s tail-event 43 (39 in 2H, tying Sleepy Floyd) was the swing. Both legs went down together — Cade\'s sub-20 was CLE\'s schematic adjustment doing exactly what we feared." },
  },
  {
    id: 'r2-g4-may11-trad-chaos-road-dogs',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — DET Upset + LAL Upset (2-Leg)',
    stake: 50, odds: '+1150', payout: 'To Win: $575',
    legs: [
      { pick:'DET ML vs CLE (G4)', odds:'+140', confidence:'chaos', status:'miss',
        note:'CLE 112-103 at home. DET lost by 9 — Mitchell\'s 43 + Q3 deluge sealed it.' },
      { pick:'LAL ML vs OKC (G4)', odds:'+390', confidence:'chaos', status:'miss',
        note:'OKC 115-110 — completed the sweep. LAL fought hard with Reaves 27 + Hachimura 25 + LeBron 24 but bench depth + closeout SGA prevailed.' },
    ],
    thesis:'~13% combined hit rate. Both road/home dogs in spots where the engine sees more upside than the market does. DET upset is plausible (~52% engine); LAL upset is variance (~25% engine). At +1150 a $50 chaos stake returns $575 if both hit. Stake reduced (chaos) to reflect the variance.',
    result: { outcome: "loss", delta: "-$50", actual: "0-of-2. Chaos parlay went down both legs. Both home favorites held serve. Stake was reduced ($50) to reflect the ~13% combined probability — expected outcome on a losing chaos play." },
  },

  // ─── R2 G5 — TONIGHT (Tue May 12: SAS-MIN G5 ONLY) ────────────────────
  // Single-game slate. DET-CLE G5 is tomorrow (Wed 5/13).
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g5-may12-floor-wemby-edwards',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'floor', type: 'best-bet',
    name: 'Star Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+80', payout: 'To Win: ~$80 (verify on DK)',
    legs: [
      { pick:'Wemby Over 11.5 rebounds (SAS-MIN G5)', odds:'-130', confidence:'floor', status:'hit',
        note:'17 rebounds ✓. Cleared comfortably as the cleanest floor signal in the dataset held.' },
      { pick:'Edwards Over 23.5 points (SAS-MIN G5)', odds:'-115', confidence:'floor', status:'miss',
        note:'20 points ✗. Edwards regressed sharply from G3-G4 32/36 — knee fatigue + foul trouble + Castle perimeter D. The "knee no longer a limiter" thesis was right for G3-G4 but the 5-game stretch caught up to him in a blowout he didn\'t need to play through.' },
    ],
    thesis:'Star counting-stat floor parlay anchored on each team\'s rebound leader (Wemby) and primary scorer (Edwards). Both are at career-floor lines well below their series median. Wemby\'s rebound floor is the cleanest signal in the dataset — he\'s grabbed 15 in every game he\'s played >25min this series. Edwards\' knee is no longer a limiter and the must-win road spot pushes his usage up. Math: 0.92 × 0.88 ≈ 81.0% combined — clears the strict 80% threshold.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. Edwards leg blowout-capped — same lesson as the May 7 Iron Floor retro (Randle): scoring legs in blowouts are NOT structurally floor-safe even when the player is healthy. Rebound leg held. Counting-stat floor (rebounds/assists) is safer than scoring floor in blowout-risk games.' },
  },
  {
    id: 'r2-g5-may12-floor-wemby-fox-castle',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'floor', type: 'best-bet',
    name: 'SAS Triple-Volume Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+110', payout: 'To Win: ~$110 (verify on DK)',
    legs: [
      { pick:'Wemby Over 23.5 points (alt — SAS-MIN G5)', odds:'~-200', confidence:'floor', status:'hit',
        note:'27 points ✓ (18 in Q1).' },
      { pick:'Fox Over 16.5 points (alt — SAS-MIN G5)', odds:'~-200', confidence:'floor', status:'hit',
        note:'18 points ✓ (with 5 ast). Cleared comfortably.' },
      { pick:'Castle Over 4.5 assists (alt — SAS-MIN G5)', odds:'~-170', confidence:'floor', status:'hit',
        note:'7 assists ✓. Facilitator role validated.' },
    ],
    thesis:'Three-leg SAS-side volume compound. All three players are home, healthy, and have series-long floor patterns at their respective alt lines. Wemby re-aggression after his first career ejection in a home crowd setting is the highest-EV leg. Castle facilitator volume (5+ assists every game) is structural. Math: 0.88 × 0.88 × 0.92 ≈ 71.3% combined — below 80% combined due to 3-leg compound but each leg individually ≥85% floor-grade.',
    result: { outcome: 'win', delta: '+$110', actual: '3-of-3 legs hit ✓. SAS-side volume compound was the cleanest play of the night. Wemby re-aggression thesis nailed (18 Q1 pts), Fox bounced back, Castle facilitator role held. Best parlay of the slate.' },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g5-may12-trad-min-cover',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'traditional', type: 'best-bet',
    name: 'MIN Cover + Edwards Volume (2-Leg)',
    stake: 100, odds: '+285', payout: 'To Win: $285',
    legs: [
      { pick:'MIN +10.5 (SAS-MIN G5)', odds:'-110', confidence:'high', status:'miss',
        note:'SAS won by 29. MIN +10.5 missed by 18.5. The "G2 was the only blowout" thesis was wrong — Wemby post-ejection re-aggression mirrored the G2 bounce-back pattern.' },
      { pick:'Edwards Over 26.5 points (SAS-MIN G5)', odds:'-115', confidence:'high', status:'miss',
        note:'20 points ✗. Sharp regression from G3-G4 32/36 — knee fatigue + foul trouble + SAS Wemby-anchored paint defense. Correlated parlay failed both legs together as expected.' },
    ],
    thesis:'Correlated parlay. The engine edge: market overprices SAS at -10.5 in a series where the only blowout was a G1-anomaly bounce-back (SAS 0-8 → 13-18 from Wemby was variance-driven). Edwards has scored 32 and 36 in his last two games; the line of 26.5 is asking him to regress 7pts from his series median. Combined ~38% at +285 = clean +EV. Math: ~0.58 × 0.65 ≈ 37.7% combined.',
    result: { outcome: 'loss', delta: '-$100', actual: '0-of-2. Correlated parlay went down together — same lesson as G2 retro: post-anomaly home games for top-3 favorites can produce blowouts that no ATS pattern would predict.' },
  },
  {
    id: 'r2-g5-may12-trad-chaos-min-upset',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — MIN Upset + Edwards 30+ (2-Leg)',
    stake: 50, odds: '+700', payout: 'To Win: $350',
    legs: [
      { pick:'MIN ML vs SAS (G5)', odds:'+320', confidence:'chaos', status:'miss',
        note:'SAS won 126-97. MIN lost by 29 — no chance of an upset once Wemby went 18-pt Q1.' },
      { pick:'Edwards Over 30.5 points (SAS-MIN G5)', odds:'+125', confidence:'chaos', status:'miss',
        note:'20 points ✗. Correlation held — both legs missed together.' },
    ],
    thesis:'~14% combined hit rate. Pure correlation: MIN upset requires Edwards to dominate. Stake reduced (chaos) to reflect the variance. At +700 a $50 stake returns $350 if both hit. Note: NOT a floor parlay; this is the high-variance lottery ticket.',
    result: { outcome: 'loss', delta: '-$50', actual: '0-of-2. Chaos ticket — expected outcome on a $50 lottery stake. Both legs correlated to MIN upset which never materialized.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G6 — RESOLVED (Fri May 15: SAS-MIN G6 + DET-CLE G6)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR (per-leg ≥80%) ─────────────────────────────
  {
    id: 'r2-g6-may14-floor-wemby-cade-rebs',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'floor', type: 'best-bet',
    name: 'Big Man Rebound Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'Wemby Over 12.5 rebounds (SAS-MIN G6)', odds:'-145', confidence:'floor', status:'miss',
        note:'Wemby 6 reb in 27 min — limited by SAS\'s wire-to-wire blowout (sat much of Q4). Floor signal broke on the blowout side-effect, not on a defensive scheme.' },
      { pick:'Castle Over 5.5 assists (SAS-MIN G6)', odds:'-130', confidence:'floor', status:'hit',
        note:'Castle 6 ast (plus 32 pts / 11 reb closeout masterpiece). Facilitator floor held — barely cleared the line.' },
    ],
    thesis:'Counting-stat floor parlay built off the May 12 retro: scoring legs in blowout-risk games are NOT structurally floor-safe (Edwards 20 last night). Rebound and assist floors are blowout-PROOF (Wemby and Castle play 30+ min regardless of game state). Both legs come from the same team (SAS) so correlated upside: if SAS plays comfortable, Castle racks up assists and Wemby controls boards. Math: 0.92 × 0.85 ≈ 78.2% combined — clears floor discipline once both are above the strict 85% floor individually.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. Wemby reb floor BROKE because SAS blew them out by 30 — Wemby sat much of Q4 (27 min total). The "blowout-PROOF" framing on rebounds turned out to be wrong: if the blowout is large enough, even rebound floors get capped by minutes. NEW LESSON for the retro pile: rebound floors are bench-PROOF, but they ARE blowout-proof only if minutes hold; in a 34-pt blowout, the star\'s minutes drop and the rebound rate doesn\'t scale.' },
  },
  {
    id: 'r2-g6-may14-floor-edwards-randle-pts',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'floor', type: 'best-bet',
    name: 'MIN Must-Win Volume Floor (2-Leg)',
    stake: 100, odds: '+130', payout: 'To Win: ~$130 (verify on DK)',
    legs: [
      { pick:'Edwards Over 22.5 points (alt — SAS-MIN G6)', odds:'-180', confidence:'floor', status:'hit',
        note:'Edwards 24 pts on 9-of-26 FG (3-of-12 3PT). Cleared the alt line by 1.5 — Castle perimeter D destroyed efficiency but volume came.' },
      { pick:'Randle Over 14.5 points (alt — SAS-MIN G6)', odds:'-200', confidence:'floor', status:'miss',
        note:'Randle 2 pts on 1-of-9 FG — Randle + Gobert COMBINED 3 pts on 1-of-12 in elimination. CATASTROPHIC interior collapse. Phase 59 "Randle suppressed by Wemby paint presence" compoundScenario validated yet again — sixth time in series at 12pts-or-fewer.' },
    ],
    thesis:'MIN-side scoring floor in must-win elimination. Edwards usage spikes in elimination, Randle gets his usual 12-18min stretches but at home with desperation, the volume climbs. Both lines are 2-3 pts below their series median. Math: 0.85 × 0.88 ≈ 74.8% combined — below 80% combined but each leg individually clears 85% floor-grade. Note: HONESTLY documenting the combined drop per May 7 lesson.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. Edwards floor held (24/25 against the 22.5 alt). Randle floor SHATTERED by Wemby paint defense — 2 pts on 1-of-9. The "Randle 14.5 floor in must-win at home" thesis was wrong; Wemby\'s paint gravity made interior scoring structurally unviable for the SIXTH game in a row (his floors: 21, 12, 12, 12, 17, 2). Floor parlay discipline failure: any series where one player has gone sub-12 in 4-of-5 games should not have that player as a floor leg, regardless of "home + desperation" framing.' },
  },

  // ─── DET-CLE G6 (Fri 5/15) — counted in tomorrow\'s P&L ────────
  {
    id: 'r2-g6-may15-floor-cle-volume',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'floor', type: 'best-bet',
    name: 'CLE Closeout Volume Floor (3-Leg)',
    stake: 100, odds: '+140', payout: 'To Win: ~$140 (verify on DK)',
    legs: [
      { pick:'Mobley Over 6.5 rebounds (alt — DET-CLE G6)', odds:'-200', confidence:'floor', status:'hit',
        note:'Mobley 8 reb (also 18pts/8ast — near triple-double). Floor cleared.' },
      { pick:'Mitchell Over 22.5 points (alt — DET-CLE G6)', odds:'-200', confidence:'floor', status:'miss',
        note:'Mitchell 18 pts on 7-of-19 FG — sub-Mitchell night. DET\'s defensive scheme held CLE to 41% FG team-wide; the "closeout at home" framing broke when CLE lost its home fortress status. 4.5 short of the alt line.' },
      { pick:'Allen Over 5.5 rebounds (alt — DET-CLE G6)', odds:'-220', confidence:'floor', status:'hit',
        note:'Allen 7 reb (with 10 pts). Cleared the line; Allen-rebound floor held even in the loss.' },
    ],
    thesis:'CLE structural floor parlay anchored on the three CLE players with the cleanest counting-stat floors. All home + closeout-favorable. Math: 0.9 × 0.9 × 0.92 ≈ 74.5% combined — each leg ≥90% individually clears floor discipline.',
    result: { outcome: 'loss', delta: '-$100', actual: '2-of-3. Mobley + Allen rebound floors held (the structural rebound thesis on CLE bigs is real). Mitchell pts floor SHATTERED because DET\'s defensive scheme actually held — the "Mitchell 22.5 at home in closeout" thesis assumed CLE\'s offensive ceiling would scale; instead DET held CLE to 41% FG. Floor parlay lesson: scoring floors are fragile when the OPPOSING defense locks in. Counting-stat floors (rebounds) are blowout-proof in the OTHER direction (CLE losing didn\'t affect Mobley/Allen reb production).' },
  },

  // ─── TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g6-may14-trad-sas-cover',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'traditional', type: 'best-bet',
    name: 'SAS Spread + Wemby Rebound (2-Leg)',
    stake: 100, odds: '+180', payout: 'To Win: $180',
    legs: [
      { pick:'SAS +2.5 (SAS-MIN G6)', odds:'-110', confidence:'high', status:'hit',
        note:'SAS won outright by 30 — covered the +2.5 by 32.5.' },
      { pick:'Wemby Over 12.5 rebounds (SAS-MIN G6)', odds:'-145', confidence:'high', status:'miss',
        note:'Wemby 6 reb in 27 min — limited by SAS\'s blowout. The "15+ floor" thesis broke on the blowout side-effect.' },
    ],
    thesis:'Engine + floor combination. Engine sees MIN by 2 (slight HCA lean) — SAS +2.5 is a half-pt hook play with EV. Wemby reb floor is structural. Math: ~0.52 × 0.92 ≈ 47.8% combined at +180. Clean +EV.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. SAS spread leg HIT massively (won outright by 30). Wemby reb leg MISSED because the blowout limited his Q4 minutes. Same blowout-vs-reb-floor lesson as the Big Man Rebound parlay above.' },
  },
  {
    id: 'r2-g6-may14-trad-chaos-sas-closeout',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — SAS Closeout + Wemby 25+ (2-Leg)',
    stake: 50, odds: '+450', payout: 'To Win: $225',
    legs: [
      { pick:'SAS ML vs MIN (G6)', odds:'+150', confidence:'chaos', status:'hit',
        note:'SAS won 139-109. Road dog at +150 cashed; chaos-bet structural pick proved correct.' },
      { pick:'Wemby Over 25.5 points (SAS-MIN G6)', odds:'+115', confidence:'chaos', status:'miss',
        note:'Wemby 19 pts in 27 min — limited by blowout (sat much of Q4). Castle had the closeout night (32 pts) instead.' },
    ],
    thesis:'~18% combined hit rate. SAS closeout WCF + Wemby tail-event. Stake reduced (chaos) to reflect variance. At +450 a $50 stake returns $225 if both hit.',
    result: { outcome: 'loss', delta: '-$50', actual: '1-of-2 on a chaos ticket. SAS ML hit (the structural call), Wemby 25+ missed (the variance call). At +450 the chaos return required both — the variance leg failed because Castle ate Wemby\'s minutes/usage. Expected outcome on a $50 chaos stake.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G7 — SUN MAY 17: DET-CLE G7 at LCA (winner advances to ECF vs NYK)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'r2-g7-may17-floor-cade-duren-volume',
    slate: 'R2-G7', date: '2026-05-17',
    category: 'floor', type: 'best-bet',
    name: 'DET Home G7 Volume Floor (2-Leg) — REDUCED STAKE',
    stake: 50, odds: '+115', payout: 'To Win: ~$58 (verify on DK)',
    legs: [
      { pick:'Cade Over 21.5 points (alt — DET-CLE G7)', odds:'-180', confidence:'floor', status:'miss',
        note:'Phase 71c projection: 27.9pts. Line 21.5 = proj−6.4 (DEEPER than the 70%-calibrated alt-line zone of proj−5). Audit shows deep alts clear at 70%+. Series scoring 23, 25, 27, 19, 39, 21 confirms. ACTUAL: 13pts on 5-16 FG / 0-7 3PT — career-worst playoff game. CLE switch-everything + early double on Cade collapsed his ceiling.' },
      { pick:'Duren Over 7.5 rebounds (alt — DET-CLE G7)', odds:'-200', confidence:'floor', status:'hit',
        note:'Phase 71c projection: 8.8 reb (down from pre-fix 9.8 — Duren was over-predicted residual +6.2pp post-tier). Line 7.5 = proj−1.3, just inside calibrated zone. Series rebs all in 7-11 range. ACTUAL: 9 reb — cleared by 1.5.' },
    ],
    thesis:'Two counting-stat floors. Math: 0.85 × 0.78 ≈ 66% combined (more honest with Phase 71c Duren correction). STAKE REDUCED from $100 → $50: G7 elimination context has 50% winner accuracy in audit; concentration risk on one game means a single bad outcome wipes 5% of bankroll. Pre-Phase-71 stake was bigger than the model evidence supports.',
    result: { outcome:'loss', delta:'-$50', actual:'Cade O21.5 MISSED (13pts — career-worst), Duren O7.5 HIT (9 reb). Stake reduction limited blast radius. Phase 71 G7-cap discipline validated.' },
  },
  {
    id: 'r2-g7-may17-floor-cle-veterans',
    slate: 'R2-G7', date: '2026-05-17',
    category: 'floor', type: 'best-bet',
    name: 'CLE Star Volume Floor (2-Leg) — REDUCED STAKE',
    stake: 50, odds: '+120', payout: 'To Win: ~$60 (verify on DK)',
    legs: [
      { pick:'Mitchell Over 21.5 points (alt — DET-CLE G7)', odds:'-180', confidence:'floor', status:'hit',
        note:'Engine projection: 25.3pts. Line 21.5 = proj−3.8 (well within 70%-calibrated alt-line zone). Series scoring 23, 31, 35, 43, 21, 18 supports floor. Mitchell not in per-player override table — engine projection trusted. ACTUAL: 26pts in 31min — cleared by 4.5.' },
      { pick:'Mobley Over 6.5 rebounds (alt — DET-CLE G7)', odds:'-220', confidence:'floor', status:'hit',
        note:'Engine projection: 8.0 reb. Line 6.5 = proj−1.5 (calibrated zone). Series rebs all in 6-9 range. Road G7 = 35+ min minimum. ACTUAL: 12 reb — cleared by 5.5 (double-double).' },
    ],
    thesis:'CLE-side floor at deep alt lines. Math: 0.80 × 0.85 ≈ 68% combined. STAKE REDUCED $100 → $50 per G7 discipline (50% winner accuracy in audit). Each leg individually clears floor discipline; combined isn\'t at the 80% reliable threshold so this is honest "lean reliable" not "lock."',
    result: { outcome:'win', delta:'+$60', actual:'Both legs HIT — Mitchell 26pts, Mobley 12 reb. Floor parlay payout to win ~$60 at +120 (verify on DK ticket). The CLE-road-G7-blowout was the model\'s wrong-winner call, but the deep alt floor anchored on counting stats still cashed.' },
  },
  // REMOVED Phase 71: "DET -3.5 + Cade O27.5" traditional parlay.
  // Both legs hit SKIP/coin-flip in the framework:
  //   DET -3.5: spread cell DOWNGRADED to CAUTION (Phase 71 — margin
  //     MAE 12.94pt = no real spread edge); G7 cap reinforces.
  //   Cade O27.5: high×prop = SKIP cross-tab cell. New Phase 71c
  //     projection 27.9pts = the LINE is at the engine's central
  //     estimate → coin flip, not edge.
  // Adding more legs to compensate would amplify the underlying noise,
  // not reduce it. Discipline: refuse to ship a parlay neither leg of
  // which the framework supports.
  {
    id: 'r2-g7-may17-trad-chaos-cle-road',
    slate: 'R2-G7', date: '2026-05-17',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — CLE Road G7 + Mitchell 30+ (2-Leg)',
    stake: 50, odds: '+650', payout: 'To Win: $325',
    legs: [
      { pick:'CLE ML vs DET (G7)', odds:'+150', confidence:'chaos', status:'hit',
        note:'Road dog G7 at +150 (~40% implied). Engine ~46% CLE win — slight value play. ACTUAL: CLE 125, DET 94 — road blowout, 31pt margin. Half the parlay hit; the other half (Mitchell 30+) was a tail-event ask.' },
      { pick:'Mitchell Over 29.5 points (DET-CLE G7)', odds:'+150', confidence:'chaos', status:'miss',
        note:'Series scoring high 43 (G4). Road G7 hostile-environment hero spot. Sub-Mitchell G6 (18) is the bounce-back primer. ACTUAL: 26pts (only 31min in a blowout) — UNDER 29.5 by 3.5. Mitchell didn\'t need 30+ because CLE blew it out.' },
    ],
    thesis:'~13% combined hit rate. CLE road G7 upset + Mitchell tail-event. Stake reduced (chaos) to reflect variance. At +650 a $50 stake returns $325 if both hit. Correlated: CLE road win likely requires Mitchell 30+.',
    result: { outcome:'loss', delta:'-$50', actual:'CLE ML HIT (road blowout) but Mitchell 30+ MISSED at 26pts (31min in a blowout). Correlation thesis broke — CLE won by 31 without needing Mitchell tail-event. -$50.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G1 — MON MAY 18: WCF SAS @ OKC at Paycom Center
  // OKC -6.5 / total 219.5. Defending champ vs Wemby. Reg-season: SAS 4-1.
  // CF tab UI is not yet wired — these parlays surface on the Home page
  // Featured Parlays section (the parlay renderer doesn't require a
  // SERIES_DATA lookup). Bets page R3 tab will land in a follow-up phase.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g1-may18-floor-okc-stars',
    slate: 'CF-G1', date: '2026-05-18',
    category: 'floor', type: 'best-bet',
    name: 'WCF G1 — OKC Stars Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'SGA Over 22.5 points (alt — WCF G1)', odds:'-280', confidence:'floor', status:'hit',
        note:'SGA 24pts (7-23 FG) — cleared by 1.5 in 49+min of 2OT. Cut close but held.' },
      { pick:'Holmgren Over 6.5 rebounds (alt — WCF G1)', odds:'-220', confidence:'floor', status:'hit',
        note:'Holmgren 8 reb. Wemby drew Holmgren into rebound battles all night; the alt threshold was comfortable.' },
    ],
    thesis:'OKC stars at home in G1 of a series they\'re favored to win. Math: 0.88 × 0.85 ≈ 75% combined (just below the 80% Reliable threshold so this is "lean reliable" not lock). Stake $100 reflects medium confidence (CF G1 historical accuracy ~67% per Phase 17). SGA + Holmgren are the structural pillars; both need to function for OKC to cover -6.5.',
    result: { outcome:'win', delta:'+$105', actual:'Both alts cleared despite OKC losing the game outright. SGA scored 24 (line 22.5), Holmgren 8 reb (line 6.5). The 2-leg Reliable Floor structure paid even though the OKC chalk thesis collapsed — exactly the point of the dual-pillar framing.' },
  },
  {
    id: 'cf-g1-may18-floor-wemby-anchor',
    slate: 'CF-G1', date: '2026-05-18',
    category: 'floor', type: 'best-bet',
    name: 'WCF G1 — Wemby + Castle Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+125', payout: 'To Win: ~$125 (verify on DK)',
    legs: [
      { pick:'Wembanyama Over 8.5 rebounds (alt — WCF G1)', odds:'-220', confidence:'floor', status:'hit',
        note:'Wemby 24 rebounds (playoff career high) — cleared by 15. Drive-and-kick miss volume thesis worked exactly as authored.' },
      { pick:'Castle Over 14.5 points (alt — WCF G1)', odds:'-180', confidence:'floor', status:'hit',
        note:'Castle 17pts — cleared by 2.5. Third-creator role held even in a Wemby-centric scoring night.' },
    ],
    thesis:'SAS-side floor. Math: 0.85 × 0.80 ≈ 68% combined — honest "lean reliable" tier (not 80% lock). The SAS upset path runs through Wemby controlling the glass + Castle scoring 17+ as third creator. Both legs cleared 80%+ across R2 individually. Stake $100.',
    result: { outcome:'win', delta:'+$125', actual:'Both legs hit comfortably; the SAS upset path thesis matched reality. Wemby 24 reb cleared 8.5 by 15; Castle 17 pts cleared 14.5 by 2.5. The lean-reliable framing was right.' },
  },
  {
    id: 'cf-g1-may18-trad-okc-chalk',
    slate: 'CF-G1', date: '2026-05-18',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G1 — OKC Chalk Stack (3-Leg)',
    stake: 50, odds: '+285', payout: 'To Win: ~$142',
    legs: [
      { pick:'OKC ML vs SAS (WCF G1)', odds:'-260', confidence:'high', status:'miss',
        note:'SAS 122-115 (2OT). The 4-1 reg-season pattern held — SAS stole HCA. Phase 71 prediction that "high × ml" was the better label vs "lean × ml" still has data accumulating.' },
      { pick:'SGA Over 27.5 points (WCF G1)', odds:'-130', confidence:'high', status:'miss',
        note:'SGA 24pts on 7-23 FG. Castle/Harper hounded him at POA; only 30% from the field through 49+min. The "Castle isn\'t Wemby" thesis missed that Castle himself is an elite POA defender.' },
      { pick:'OKC -6.5 (WCF G1)', odds:'-110', confidence:'medium', status:'miss',
        note:'SAS won outright by 7 — covered by 13.5. Spread cell continues to be the worst single-leg bucket per Phase 71.' },
    ],
    thesis:'Three correlated OKC legs. Math: 0.72 × 0.65 × 0.55 ≈ 26% combined (Phase 71 calibrated, raw MC would say higher). At +285 payout, 26% true hit gives positive EV. Stake $50 (chaos/traditional discipline at CF G1 unknown-territory cap).',
    result: { outcome:'loss', delta:'-$50', actual:'All three legs missed. SAS 122-115 (2OT) blew up the correlated OKC chalk thesis. The 4-1 reg-season SAS record was the lurking signal we underweighted; the season series mattered more than the playoff rest gap.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G1 — TUE MAY 19: ECF CLE @ NYK at MSG
  // NYK -7.5 / total 215.5. NYK swept PHI 4-0 (rested 9 days); CLE
  // beat DET 4-3 in G7 road blowout (1 day rest, MSG turnaround).
  // The rest gap (9 vs 1) is the dominant ECF G1 variable.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ecf-g1-may19-floor-nyk-stars',
    slate: 'CF-G1', date: '2026-05-19',
    category: 'floor', type: 'best-bet',
    name: 'ECF G1 — NYK Stars Floor (2-Leg)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify on DK)',
    legs: [
      { pick:'Brunson Over 19.5 points (alt — ECF G1)', odds:'-260', confidence:'floor', status:null,
        note:'R2 vs PHI: 35/22/26/33 → 29 avg. Line 19.5 = proj−10, deep alt zone. Brunson at home + 9 days rest + ECF spotlight = highest-floor combo on the slate.' },
      { pick:'KAT Over 7.5 rebounds (alt — ECF G1)', odds:'-200', confidence:'floor', status:null,
        note:'R2 rebounds vs PHI: 12, 10, 12, 4 → 9.5 avg (G4 capped by 30-pt blowout). Line 7.5 = proj−2 in the calibrated zone. CLE\'s twin-big (Mobley/Allen) attacks the glass — KAT will see more defensive rebound volume than in PHI series.' },
    ],
    thesis:'NYK at home with 9 days rest. Math: 0.88 × 0.82 ≈ 72% combined — honest lean-reliable. The Phase 71 STARTER tier correction (-2pp PTS) was applied to Brunson but he still cleared 19.5 easily even with the haircut — deep alt threshold absorbs the bias correction. KAT is in the calibrated bucket so no override active.',
    result: null,
  },
  {
    id: 'ecf-g1-may19-floor-mitchell-mobley',
    slate: 'CF-G1', date: '2026-05-19',
    category: 'floor', type: 'best-bet',
    name: 'ECF G1 — CLE Stars Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'Mitchell Over 19.5 points (alt — ECF G1)', odds:'-280', confidence:'floor', status:null,
        note:'R2 vs DET: 35, 30, 21, 43, 18, 26 → 28.8 avg. Line 19.5 = proj−9, deep alt. One-day rest is the concern; Mitchell only played 31min in G7 blowout so legs should be okay.' },
      { pick:'Mobley Over 7.5 rebounds (alt — ECF G1)', odds:'-220', confidence:'floor', status:null,
        note:'R2 rebounds vs DET: 5, 7, 8, 8, 12, 8, 12 → 8.6 avg. Line 7.5 = proj−1, slim cushion but reliable floor with KAT-vs-Mobley matchup driving rebound volume.' },
    ],
    thesis:'CLE side. Math: 0.84 × 0.78 ≈ 65% combined — slim-side lean reliable. The one-day rest is the structural risk (Mitchell legs after G7); 31min in a blowout mitigates that. Mobley\'s rebound floor is the more reliable of the two legs. Stake $100.',
    result: null,
  },
  {
    id: 'ecf-g1-may19-trad-nyk-rest',
    slate: 'CF-G1', date: '2026-05-19',
    category: 'traditional', type: 'best-bet',
    name: 'ECF G1 — NYK Rest Advantage Stack (3-Leg)',
    stake: 50, odds: '+340', payout: 'To Win: ~$170',
    legs: [
      { pick:'NYK ML vs CLE (ECF G1)', odds:'-265', confidence:'medium', status:null,
        note:'9-day rest vs 1-day rest + home court + sweeping a healthier PHI team. The rust risk is real but 9 days vs 1 day is the largest rest gap in any ECF G1 on record.' },
      { pick:'Brunson Over 26.5 points (ECF G1)', odds:'-115', confidence:'medium', status:null,
        note:'29 ppg vs PHI — line 26.5 below R2 avg. STARTER bias applied: 29 − 2 = 27 → still over 26.5 by 0.5. Tight but the home court + ECF stage typically lifts top scorers slightly above their R2 line.' },
      { pick:'Under 215.5 total (ECF G1)', odds:'-110', confidence:'lean', status:null,
        note:'ECF G1 historically 4-6pts below regular line (defensive scout intensity). NYK plays 97.5 pace; CLE 96.8 pace — slow-down series. Both teams rested less than CF G1 last year (OKC-MIN), which went under by 8.' },
    ],
    thesis:'Three correlated NYK-favorable legs. Math: 0.62 × 0.58 × 0.55 ≈ 20% combined (Phase 71 calibrated). At +340 payout, 20% true hit is +EV. Stake $50 (CF unknown-territory cap).',
    result: null,
  },

  // Phase 72 deduplication: my "Bigs Rebounding Floor" + "OKC + Wemby
  // Volume" parlays overlapped with the 3 cf-g1-may18-* parlays above
  // (which author both an OKC-stars floor AND a SAS-side floor AND a
  // 3-leg chalk stack). User's parlays are more comprehensive.
];

// ============================================================
// Slate metadata — header info for each slate's series
// ============================================================
// Tier 1.2: each game uses STRUCTURED date/time/venue fields. The
// `when` string is auto-derived by buildWhenLabel() below; SLATE_GAME_DATES
// in home.js is auto-derived from these dates. This is now the single
// source of truth for game scheduling — no parallel maps to keep in sync.
//
// Schema per game:
//   series  : 'NYK-PHI'           → matches SERIES_DATA.id suffix
//   date    : 'YYYY-MM-DD'        → drives Home page Tonight/Tomorrow detection
//   time    : '7:00 PM ET'        → display only
//   venue   : 'MSG'               → display only
//   context : 'NYK leads 1-0'     → series state at time of slate
//   recap   : '<strong>...'        → HTML-rich slate-header narrative
//
// Backward compat: if a future entry omits date/time/venue but includes
// `when`, the parser in `buildWhenLabel` returns it as-is.
// ============================================================
function buildWhenLabel(g) {
  if (g.date && g.time && g.venue) {
    const [y, m, d] = g.date.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    const wd = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const md = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return `${wd} ${md}, ${g.time} @ ${g.venue}`;
  }
  return g.when || '';
}

const BET_SLATES = {
  'R2-G1': {
    label: 'Round 2 — Game 1 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-04', time:'8:00 PM ET', venue:'MSG', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 137-98 — most lopsided R2 G1 in a decade. Brunson 35pts (12-18 FG). Embiid 14pts (3-11). PHI 48hr turnaround was catastrophic.' },
      { series:'SAS-MIN', date:'2026-05-04', time:'9:30 PM ET', venue:'Frost Bank Center', context:'Series 0-0',
        recap:'<strong style="color:var(--red)">Result:</strong> MIN 104-102 (UPSET). Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. SAS shot 28% 3PT (10-36).' },
      { series:'DET-CLE', date:'2026-05-05', time:'7:00 PM ET', venue:'LCA', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 111-101. Cade 23/7ast, D.Robinson 19pts (5-8 3PT). DET forced 19 CLE TOs. Allen limited to 18min (knee).' },
      { series:'OKC-LAL', date:'2026-05-05', time:'8:30 PM ET', venue:'Paycom Center', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 108-90 (+18). Holmgren 24/12/3blk. SGA only 18pts (7 TOs!) but OKC still dominated. Reaves catastrophic 3-16 FG.' },
    ],
  },
  'R2-G2': {
    label: 'Round 2 — Game 2 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-06', time:'7:00 PM ET', venue:'MSG', context:'NYK leads 1-0',
        recap:'<strong style="color:var(--red)">🚨 EMBIID OUT G2:</strong> Ruled out morning of May 6 with right ankle sprain + right hip soreness. Did not participate in shootaround. PHI projected lineup: Maxey/Edgecombe/Oubre/George/Drummond. <strong style="color:var(--green)">G1 Recap:</strong> NYK 137-98 blowout. Brunson 35pts (12-18 FG). NYK 63% FG, 51% 3PT. Embiid 3-11 (-24). <strong>Key G2 Factor:</strong> Without Embiid, PHI ceiling collapses entirely — Drummond cannot create offense, and KAT stretch-5 will pull him out of the paint. Mitchell Robinson (NYK) questionable with illness. Spread re-priced from -7.5 to -10.5+.' },
      { series:'SAS-MIN', date:'2026-05-06', time:'9:30 PM ET', venue:'Frost Bank Center', context:'MIN leads 1-0',
        recap:'<strong style="color:var(--yellow)">G1 Recap:</strong> MIN 104-102 upset. Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. Fox -13 (0-4 3PT). SAS shot 28% 3PT (10-36). MIN won Q4 35-30. <strong style="color:var(--yellow)">G2 Update (May 6):</strong> Edwards listed as <strong>QUESTIONABLE</strong> for G2 — knee bothered him at the end of G1. SAS rotation healthy, no new concerns. <strong>Key G2 Factor:</strong> Wemby\'s 3PT regresses to 37.5% mean. Fox must be aggressive. Dosunmu returns for MIN.' },
      { series:'DET-CLE', date:'2026-05-07', time:'7:10 PM ET', venue:'LCA', context:'DET leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 107-97 — DET leads 2-0. Cade 25/10ast (12 of 25 in Q4 closing run), Tobias Harris 21, D.Robinson 17 (5-9 3PT), Jenkins 14 off bench (3rd straight bench DD-figures). Allen healthy this time (22/7) but Mitchell\'s game-high 31pts couldn\'t carry — DET\'s structural defense + Cade\'s Q4 run sealed it. DET ML hit -162; spread (DET -3.5) covered by 6.5; total 204 stayed under 214.5.' },
      { series:'OKC-LAL', date:'2026-05-07', time:'9:30 PM ET', venue:'Paycom Center', context:'OKC leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 125-107 — OKC leads 2-0. Same +18 margin as G1 in a totally different style. Holmgren 22/9/3ast/4stl/2blk (steady), SGA limited to 22 (foul trouble). Reaves bounced back hard for LAL: game-high 31 (10-16, 6 ast) with the oblique evidently improved. LeBron 23 (9-18, 6 ast) facilitator-mode. Game flipped on 21 LAL TOs that OKC turned into 26 transition points. OKC ML hit; OKC -15.5 covered by 2.5; total 232 went OVER 209.5 by 22.5 (turnover-driven track meet).' },
    ],
  },
  'R2-G3': {
    label: 'Round 2 — Game 3 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-08', time:'7:00 PM ET', venue:'Wells Fargo Center', context:'NYK leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 108-94 — NYK leads 3-0 (sweep cliff). Brunson 33pts/5reb/9ast (11-22 FG, 38min) — 24th career 30+ playoff game (most in Knicks history). Bridges 23pts (8-14 FG). Hart 12pts/11reb (workhorse double-double). KAT 8pts/12reb/7ast in 26min (passive on offense, dominant on glass — 4 OREB). Shamet bench spark: 15pts. NYK shot 23-of-32 FT. Oubre 22pts (PHI team-high), Embiid back from ankle/hip OUT for 18pts in 35min (rusty but functional), Maxey 17pts, George 15pts (all in Q1, then 0-of-9 the rest of the way). OG Anunoby OUT (left hamstring strain). NYK turned back repeated PHI rallies — Wells Fargo crowd never got the run that flips momentum.' },
      { series:'SAS-MIN', date:'2026-05-08', time:'9:30 PM ET', venue:'Target Center', context:'Series tied 1-1',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 115-108 — SAS leads 2-1. Wembanyama 39pts/15reb/5blk (3 made 3PT, 10 FT made, 5 fouls) — joined Kareem/Hakeem/Shaq company with the stat line. Edwards returned to the starting lineup for the first time since 4/26 hyperextension (15pts/7reb/1ast) — knee held up but rust + SAS rotations limited his usual rim aggression. SAS led 18-3 to start; halftime tied 51-51; SAS up 86-79 entering Q4. Castle 8/2/7ast, Vassell 8/4. Carter Bryant, K.Johnson, Champagnie each made 2 threes. Wemby\'s rebounding floor (15 in BOTH G2 and G3) was the structural anchor. Model: predicted SAS by 9, actual SAS by 7 — within 2 pts.' },
      { series:'OKC-LAL', date:'2026-05-09', time:'8:30 PM ET', venue:'Crypto.com Arena', context:'OKC leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 131-108 — OKC leads 3-0 (sweep cliff, 7-0 in playoffs overall). Ajay Mitchell career-high 24pts/10ast (10-17 FG) led OKC; SGA cruise control again with 23pts/9ast on 7-20 FG. Holmgren 18/9/1blk. Cason Wallace 16pts (4-6 3PT). Hartenstein 12/9 (+26). LAL: Hachimura 21 (5-8 3PT), LeBron 19/6/8 in 37min/age 41 facilitator mode, Reaves regression to 17 (5-13 from 31 G2), Kennard 18 off bench. OKC bench outscored LAL bench 59-31. Third straight blowout +23 — same script, bigger margin.' },
      { series:'DET-CLE', date:'2026-05-09', time:'3:00 PM ET', venue:'Rocket Mortgage FieldHouse', context:'DET leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> CLE 116-109 — DET leads 2-1 (5-game playoff win streak snapped). Mitchell 35/10reb/4ast (13-24 FG) sustained G2 form; Harden bounce-back 19pts (8-14, 3-7 3PT) hit three big shots late; Allen 18/4/2blk (7-9 FG); Strus 7pts/5reb but came up with the steal and go-ahead basket; Mobley 13/8/4ast; Schroder 11pts (3-3 3PT) bench spark; Merrill returned (7pts in 14min). DET: Cade triple-double 27/10/10 on 10-27 FG / 8 TOs (high-volume mode), Harris 21pts (5-5 FT), D.Robinson 15pts (5 STL!), Reed 11pts in 10min off bench. CLE bench finally outscored DET bench (28-24). Model: CLE by 4 predicted, CLE by 7 actual — within 3pts.' },
    ],
  },
  'R2-G4': {
    label: 'Round 2 — Game 4 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-10', time:'3:30 PM ET', venue:'Wells Fargo Center', context:'NYK leads 3-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 144-114 — series-clinching closeout, NYK SWEEPS 4-0, advances to ECF. McBride 25pts (7-9 3PT, started for OG out), Brunson 22, Hart 17, KAT 17/4/10ast, Shamet 12 (4 threes off bench). NYK tied NBA postseason record with 25 made 3s (25-44, 56.8%); set new playoff record with 11 made threes in Q1. PHI 8-35 3PT (22%), 35-51 2PT (68%) — Embiid 24, Maxey 17 not enough to keep up with the 3PT barrage. Model predicted NYK by 4; actual NYK by 30 — RIGHT WINNER, magnitude missed by 26pts via 3PT variance.' },
      { series:'SAS-MIN', date:'2026-05-10', time:'7:30 PM ET', venue:'Target Center', context:'SAS leads 2-1',
        recap:'<strong style="color:var(--green)">Result:</strong> MIN 114-109 — series TIED 2-2. WEMBANYAMA EJECTED early Q2 (Flagrant 2 elbow to Naz Reid\'s neck on a double-team) — first career ejection. Wemby line: 4pts/4reb/0blk in 13min. Edwards 36 (16 in Q4 closing 4pt swing) — knee fully back. Reid 15/9 (took the elbow, finished the game). McDaniels 14, Randle 12, Gobert 11/13. SAS guards Harper 24, Fox 24, Castle 20 (68 combined without Wemby) — nearly stole it at 102-99 with 4min left before Edwards\' Q4. NBA review cleared Wemby — no suspension, plays G5. Model: SAS by 3 with Wemby; the ejection swing produced MIN by 5 — wrong winner but within 8pts via the variance shock.' },
      { series:'DET-CLE', date:'2026-05-11', time:'8:00 PM ET', venue:'Rocket Mortgage FieldHouse', context:'DET leads 2-1',
        recap:'<strong style="color:var(--green)">Result:</strong> CLE 112-103 — series TIED 2-2. Donovan Mitchell 43pts (13-26 FG, 13-14 FT) — 39 PTS IN 2H tied Sleepy Floyd\'s 1987 NBA playoff record for most points in a half; career playoff scoring high. Started 0-7 with 4pts at halftime (CLE down 56-52), then erupted for 21pts in Q3 alone matching DET\'s entire Q3 total (CLE 38-21 Q3). Harden 24pts/11ast (40th career playoff DD). Mobley 17/8/5ast/5blk/3stl. Allen 14/8/2blk. DET: Caris LeVert SEASON-HIGH 24pts off the bench; Cade 19pts (FIRST under-20 in 11 straight playoff games) as CLE doubled aggressively. Harris 16, D.Robinson 12. Model predicted CLE by 3, actual CLE by 9 — RIGHT WINNER, Mitchell tail-event accounted for the margin miss. Series shifts to LCA for G5 Wednesday May 13.' },
      { series:'OKC-LAL', date:'2026-05-11', time:'10:30 PM ET', venue:'Crypto.com Arena', context:'OKC leads 3-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 115-110 — OKC SWEEPS 4-0, advances to Western Conference Finals (8-0 in playoffs overall — ties 5th-best start in NBA history). Toughest playoff win of OKC\'s postseason — first single-digit margin after three straight blowouts. SGA 35pts/8ast — first 30+ of the series after 18/22/23 cruise. Holmgren tiebreaking dunk off Hartenstein assist with 32.8s left; 8 of his 16 pts came in final 5:10 of Q4. Ajay Mitchell 28pts (10 in Q4). Hartenstein 5/10/5ast/5stl in 28min. LAL fought hard in elimination at home: Reaves 27 (team-high), Hachimura 25, LeBron 24/12reb at age 41 in his final home playoff game. Model predicted OKC by 5, actual OKC by 5 — BULLSEYE.' },
    ],
  },
  'R2-G5': {
    label: 'Round 2 — Game 5 (Archive)',
    games: [
      { series:'SAS-MIN', date:'2026-05-12', time:'8:00 PM ET', venue:'Frost Bank Center', context:'Series tied 2-2',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 126-97 — SAS leads 3-2. Wembanyama historic return from ejection: 27pts/17reb/5ast/3blk + 2 made 3s (first player in NBA postseason history with that stat line since 3PT line introduced in 1979-80). 18 of his 27 came in Q1. SAS led by 30 at peak; 68-36 paint advantage. K.Johnson 21 (8-11 FG) bench spark. Fox 18/5ast. Castle 17/7ast. Harper 12/10 (5 OREB). MIN: Randle 17/10 DD, Edwards 20 (sharp regression from G3-G4 32/36), Dosunmu 16 off bench. Model: predicted SAS by 8; actual SAS by 29 — RIGHT WINNER, +21 margin underestimate.' },
      { series:'DET-CLE', date:'2026-05-13', time:'8:00 PM ET', venue:'Little Caesars Arena', context:'Series tied 2-2',
        recap:'<strong style="color:var(--red)">Result:</strong> CLE 117-113 OT — CLE leads 3-2. Home-team-wins pattern FINALLY broken. DET led 103-94 with 2min left; CLE 9-0 closing run to force OT, then 13-0 over the late-Q4-to-mid-OT stretch. Harden CAREER PLAYOFF HIGH 30/8/6. Mitchell 21 (deferred to Harden in comeback). Mobley 19 (tying FTs). Strus 20 on 6 made 3s. Allen 16/9. DET: Cade CAREER PLAYOFF HIGH 39/7/9 (bounce-back from G4 sub-20). Jenkins 19 off bench. Model: predicted DET by 5; actual CLE by 4 (OT) — WRONG WINNER, 9pt swing.' },
    ],
  },
  'R2-G6': {
    label: 'Round 2 — Game 6 (Archive)',
    games: [
      { series:'SAS-MIN', date:'2026-05-15', time:'7:00 PM ET', venue:'Target Center', context:'SAS leads 3-2',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 139-109 — SAS WINS SERIES 4-2, advances to WCF vs OKC. Castle MASTERPIECE 32pts/11reb/6ast (11-of-16 FG, 5-of-7 3PT) in the closeout. Wemby quieter than usual (19/6/6ast/3blk in 27min, capped by blowout). Fox 21/9ast. All five SAS starters in double figures. SAS led wire-to-wire, by as many as 34; 20-0 SAS run early Q2. MIN: Edwards 24 on 9-of-26 FG (volume came, efficiency didn\'t — Castle perimeter D). Randle + Gobert COMBINED 3 PTS on 1-of-12 FG (catastrophic). The home-team-wins-every-game pattern broke in the elimination spot. Model: predicted MIN by 2 (LOW), actual SAS by 30 — WRONG WINNER, +32 margin miss.' },
      { series:'DET-CLE', date:'2026-05-15', time:'7:00 PM ET', venue:'Rocket Arena', context:'CLE leads 3-2',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 115-94 — series TIED 3-3, G7 at LCA Sun 5/17. DET\'s 21-pt road win tied a 66-year-old NBA playoff record for largest G6 road win by a team trailing 3-2. CLE\'s first home loss of the entire 2026 playoffs (6-0 → 6-1 at Rocket). Cade 21/9/7 distributing (not hero-mode); Jenkins 15 bench spark; Duren 15/11/3blk dominated the paint; Harris 14, D.Robinson 11 (3-7 3PT). DET held CLE to 41% FG, forced 16 TOs. CLE: Harden 23, Mitchell 18 (sub-Mitchell night), Mobley 18/8/8 (near triple-double), Allen passive 10/7, Strus regressed to 9 (from G5\'s 20). Model: predicted CLE by 6 (MEDIUM), actual DET by 21 — WRONG WINNER, +27 margin miss.' },
    ],
  },
  'R2-G7': {
    label: 'Round 2 — Game 7 (Archive)',
    games: [
      { series:'DET-CLE', date:'2026-05-17', time:'TBD ET', venue:'Little Caesars Arena', context:'Series tied 3-3',
        recap:'<strong style="color:var(--green)">Result:</strong> CLE 125-94 — CLE WINS SERIES 4-3, ADVANCES TO ECF VS NYK. Cavs road blowout in DET — Mitchell 26pts (15 in Q3 dagger run, only 31min, 0 TOs), Allen 23/7reb (knee held up), Merrill 23 off bench (5-8 3PT, bench game of the playoffs), Mobley 21/12reb (2blk/2stl), Harden 9/6ast (gravity-game). CLE shot 50.6% FG, 50-41 rebound edge, forced 14 DET TOs. <strong style="color:var(--red)">DET COLLAPSED at home:</strong> Cade career-low 13pts on 5-16 FG / 0-7 3PT (CLE schemed him off the floor). Harris 0-6 FG (5pts, biggest no-show). Duren 7/9 with 3 TOs vs Allen/Mobley. Jenkins led DET with 17 off bench but inefficient (4-12). <strong>MODEL: DET by 4 LOW; ACTUAL CLE by 31</strong> — wrong-winner G7 (third straight wrong call in this series). Phase 71 audit\'s G6/G7 50%-accuracy / 19.8pt-MAE banner held. ECF G1 is Tue 5/19 at MSG (CLE on 1 day rest vs NYK on 9 days rest).' },
    ],
  },
  'CF-G1': {
    label: 'Conference Finals — Game 1 (Live)',
    games: [
      { series:'OKC-SAS', date:'2026-05-18', time:'8:30 PM ET', venue:'Paycom Center', context:'WCF G1',
        recap:'<strong style="color:var(--red)">Result:</strong> SAS 122-115 (2OT) — SAS leads WCF 1-0. <strong>Instant classic</strong>: Wemby 41pts/24reb/3blk in 49+min, joined Wilt as the only players with 40+pts and 20+reb in their Conference Finals debut. Harper 24pts/11reb/6ast/7stl (first rookie with 15+/5+/5stl in a playoff game since Magic Johnson 1980). SGA 24/12ast on 7-23 FG — Castle/Harper hounded him at the POA. Caruso 31pts off bench (8 made threes) was OKC\'s offensive lifeline. Wemby hit a Curry-range logo three to send to 2OT. The 4-1 reg-season SAS pattern held — they stole HCA on the road. <strong>G2:</strong> Wed 5/20 at Paycom.' },
      { series:'NYK-CLE', date:'2026-05-19', time:'8:00 PM ET', venue:'Madison Square Garden', context:'ECF G1',
        recap:'<strong style="color:var(--purple)">ECF G1 Preview (Tue 5/19):</strong> CLE @ NYK. NYK #3 seed swept PHI 4-0, rested 9 days. CLE #4 seed won DET-CLE in 7, traveled back from a road blowout — 1 day rest. <strong>The rest gap (9 days vs 1 day) is the dominant variable.</strong> NYK has the layoff-rust risk (longer breaks historically depress Q1 efficiency by 4-6 pts); CLE has the legs-tired risk (Mitchell 31min G7, Allen 28min on knee). KAT-vs-Mobley + Brunson-vs-Mitchell are the marquee matchups. Lines TBD morning of game.' },
    ],
  },
};

// Auto-populate `when` on every game from structured fields, so existing
// renderers that read `g.when` keep working with no edits.
Object.values(BET_SLATES).forEach(slate => {
  slate.games.forEach(g => { if (!g.when) g.when = buildWhenLabel(g); });
});
