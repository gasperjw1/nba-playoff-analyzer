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
    result: null,
  },
  {
    id: 'r2-g2-det-cle-spread',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'spread', pick: 'DET -3.5', odds: '-110',
    facts: [{label:'Risk',value:'CLE coaching adjust + Allen return'}],
    modelHook: { fn:'dmargin', args:['DET-CLE',2] },
    reasoning: "Model says {{winner}} by {{margin}}. CLE coaching adjustments expected (faster ball movement to beat traps, less Mitchell ISO). But DET's turnover generation is scheme-based — hard to adjust away from in one practice. If Allen plays 30+min, CLE's ceiling rises and this becomes a GRIND. Lean cover.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: null,
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
    result: null,
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
    result: null,
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
    result: null,
  },
  {
    id: 'r2-g2-okc-lal-spread',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'spread', pick: 'OKC -15.5', odds: '-110',
    facts: [{label:'G1',value:'OKC by 18'},{label:'Risk',value:'Garbage time backdoor'}],
    modelHook: { fn:'dmargin', args:['OKC-LAL',2] },
    reasoning: "Model says OKC by {{margin}}. G1 was +18 with SGA at his worst. With SGA cleaning up TOs (7→3 expected) and J.Williams ramping, OKC gets STRONGER. LAL has no adjustment available — their problem is personnel (Reaves hurt, no Doncic, no bench). Only risk: OKC garbage time gives LAL backdoor cover. Lean spread but ML is safer.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: null,
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
    result: null,
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
    result: null,
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
    result: null,
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
  // R2 G2 — TONIGHT (May 6: NYK-PHI + SAS-MIN)
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
  // R2 G2 — TONIGHT (May 7: DET-CLE + OKC-LAL)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR ────────────────────────────────────────────
  // Re-priced May 7 morning to current DK lines. Each leg engine-validated.
  {
    id: 'r2-g2-may7-floor-chalk',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Chalk Sweep (2-Leg)',
    stake: 100, odds: '+80', payout: 'To Win: $80',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:null,
        note:'Won G1 by 18 with SGA at his floor (7 TOs!). J.Williams ramping. Reaves still hurt. Engine: OKC by 22.' },
      { pick:'DET ML vs CLE', odds:'-162', confidence:'high', status:null,
        note:'Won G1 by 10. Cade 23/7ast. DET #1 defense. Engine: DET by 2 (close, but home edge).' },
    ],
    thesis:'Both home teams favored at DK. Lines tightened from open (-800/-190 → -900/-162) as money moved on the chalk. Combined value dropped to +80 — still positive but no longer the standout it was on opening lines.',
    result: null,
  },
  {
    id: 'r2-g2-may7-floor-star-scoring',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Star Scoring (Floor, 2-Leg)',
    stake: 100, odds: '+240', payout: 'To Win: $240',
    legs: [
      { pick:'SGA Over 29 pts (OKC-LAL G2)', odds:'-120', confidence:'high', status:null,
        note:'Season avg 31.1; 25+ in 18 of last 20. G1 7 TOs was anomaly. Engine: 36pts. Line moved 24.5→29 — book caught up to mean, engine still says over.' },
      { pick:'Cade Over 27.5 pts (DET-CLE G2)', odds:'-118', confidence:'high', status:null,
        note:'Avg 32 over last 5 games. G1 23pts on 9-11 FT. LCA home crowd. Engine: 31pts. Line moved 21.5→27.5.' },
    ],
    thesis:'2-leg parlay (was 3-leg with LeBron — dropped LeBron leg because the line moved to 23.5 with the book pricing the Under at -250, which ATC into a coin-flip at best). SGA + Cade both have engine projections well above market lines. Combined +240 reflects current DK lines, not the easier ones from open.',
    result: null,
  },
  {
    id: 'r2-g2-may7-floor-under',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Total + Holmgren Under (2-Leg)',
    stake: 100, odds: '+265', payout: 'To Win: $265',
    legs: [
      { pick:'OKC-LAL G2 Under 209.5', odds:'-110', confidence:'medium', status:null,
        note:'G1 total was 198. Engine projects 208 in G2 (under 209.5 by 1.5pts). LAL\'s Reaves still hurt + OKC\'s elite defense → low-scoring continuation likely.' },
      { pick:'Holmgren Under 22.5 pts (OKC-LAL G2)', odds:'-115', confidence:'medium', status:null,
        note:'Playoff avg 18.6. Engine: 17pts. G1 24-pt explosion was variance (3-7 from 3 — career playoff 3PT only ~32%). Blowout context likely caps Q4 minutes.' },
    ],
    thesis:'Replaces the old "Volume Floors" parlay (which referenced lines that no longer exist on DK after market moves). Two engine-supported Unders — total and a star prop — both with regression-to-mean reasoning. Combined +265 is solid risk-adjusted return.',
    result: null,
  },

  // ─── TRADITIONAL ────────────────────────────────────────────────
  {
    id: 'r2-g2-may7-trad-star-props',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Star Props (3-Leg)',
    stake: 100, odds: '+800', payout: 'To Win: $800',
    legs: [
      { pick:'SGA Over 29 pts (OKC-LAL G2)', odds:'-120', confidence:'high', status:null,
        note:'Same leg as Floor parlay. Engine 36, line 29. Strongest prop on the slate.' },
      { pick:'Cade Over 27.5 pts (DET-CLE G2)', odds:'-118', confidence:'high', status:null,
        note:'Engine 31, line 27.5. Cade averaging 32 in last 5 games.' },
      { pick:'LeBron Over 23.5 pts (OKC-LAL G2)', odds:'+185', confidence:'lean', status:null,
        note:'Engine 25, line 23.5. Book strongly favors Under (-250). Marginal play with juicy +185 plus odds. Risk: blowout caps Q4 minutes.' },
    ],
    thesis:'Three star scoring overs at current DK lines. SGA + Cade have clear engine edges; LeBron is a lean — book is signaling Under via -250 juice but the +185 plus on the Over makes it worth the leg. Combined +800 (was +500 before line moves).',
    result: null,
  },
  {
    id: 'r2-g2-may7-trad-chaos',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Road Upset Double (2-Leg)',
    stake: 100, odds: '+1750', payout: 'To Win: $1,750',
    legs: [
      { pick:'CLE ML vs DET', odds:'+136', confidence:'chaos', status:null,
        note:'Allen back. Mitchell at 27.5 prop = book expects scoring. Mobley adjustments. CLE playoff pedigree. Engine: DET by 2 — coin flip leans home.' },
      { pick:'LAL ML vs OKC', odds:'+600', confidence:'chaos', status:null,
        note:'Requires LeBron nuclear + Reaves bounce-back + OKC complacency. Engine: OKC by 22 — long shot. +600 reflects the difficulty.' },
    ],
    thesis:'Both road dogs needed. CLE+136 is reasonable per engine; LAL+600 is a true chaos play. Combined +1750 (was +2200 before line moves — odds tightened slightly).',
    result: null,
  },
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
    label: 'Round 2 — Game 2 (Live)',
    games: [
      { series:'NYK-PHI', date:'2026-05-06', time:'7:00 PM ET', venue:'MSG', context:'NYK leads 1-0',
        recap:'<strong style="color:var(--red)">🚨 EMBIID OUT G2:</strong> Ruled out morning of May 6 with right ankle sprain + right hip soreness. Did not participate in shootaround. PHI projected lineup: Maxey/Edgecombe/Oubre/George/Drummond. <strong style="color:var(--green)">G1 Recap:</strong> NYK 137-98 blowout. Brunson 35pts (12-18 FG). NYK 63% FG, 51% 3PT. Embiid 3-11 (-24). <strong>Key G2 Factor:</strong> Without Embiid, PHI ceiling collapses entirely — Drummond cannot create offense, and KAT stretch-5 will pull him out of the paint. Mitchell Robinson (NYK) questionable with illness. Spread re-priced from -7.5 to -10.5+.' },
      { series:'SAS-MIN', date:'2026-05-06', time:'9:30 PM ET', venue:'Frost Bank Center', context:'MIN leads 1-0',
        recap:'<strong style="color:var(--yellow)">G1 Recap:</strong> MIN 104-102 upset. Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. Fox -13 (0-4 3PT). SAS shot 28% 3PT (10-36). MIN won Q4 35-30. <strong style="color:var(--yellow)">G2 Update (May 6):</strong> Edwards listed as <strong>QUESTIONABLE</strong> for G2 — knee bothered him at the end of G1. SAS rotation healthy, no new concerns. <strong>Key G2 Factor:</strong> Wemby\'s 3PT regresses to 37.5% mean. Fox must be aggressive. Dosunmu returns for MIN.' },
      { series:'DET-CLE', date:'2026-05-07', time:'7:10 PM ET', venue:'LCA', context:'DET leads 1-0',
        recap:'<strong style="color:var(--green)">G1 Recap:</strong> DET 111-101. Cade 23/7ast, D.Robinson 19pts (5-8 3PT), Duren 14/14reb/clutch block. DET forced 19 CLE TOs (12 steals). Allen limited to 18min/2pts (knee tendonitis). CLE rallied from -18 to 93-93 but DET closed on a 18-8 run. <strong style="color:var(--green)">G2 Update (May 6):</strong> Allen <em>off</em> injury report — back to full minutes. Mitchell/Cunningham/Mobley all healthy. Huerter (DET) GTD thigh; Merrill (CLE) GTD hamstring. Allen healthy raises CLE\'s ceiling vs G1 conditions.' },
      { series:'OKC-LAL', date:'2026-05-07', time:'9:30 PM ET', venue:'Paycom Center', context:'OKC leads 1-0',
        recap:'<strong style="color:var(--green)">G1 Recap:</strong> OKC 108-90 (+18) <em>without J.Williams</em> (Grade 1 hamstring, ruled out pre-game). Holmgren 24/12/3blk (9-17 FG). SGA only 18pts (7 TOs!) but OKC still dominated. Reaves catastrophic 3-16 FG (0-5 3PT) — oblique severe. OKC bench: every player +11 or better. LeBron 27pts (12-17) but zero help. <strong>Key G2 Factor:</strong> J.Williams remains week-to-week per Daigneault — likely still OUT. SGA turnover correction (career avg 2.8 TOs). Reaves still severely limited (oblique).' },
    ],
  },
};

// Auto-populate `when` on every game from structured fields, so existing
// renderers that read `g.when` keep working with no edits.
Object.values(BET_SLATES).forEach(slate => {
  slate.games.forEach(g => { if (!g.when) g.when = buildWhenLabel(g); });
});
