# FATIGUE AGENT — Round 1 Essay (v3 — targeted partial-fix revision of v2)

**Game:** SAS-NYK Finals G2 — Fri 6/5/2026, 8:30 PM ET at Frost Bank Center
**Market:** SAS -5.5 / O/U 214.5

---

## THESIS

From a pure FATIGUE / DURABILITY lens, the structural picture from G1 is unchanged on a 1-day turnaround: Wemby's mechanical workload is unsustainable (38 min on a back of 37.7 WCF avg, no viable backup-C reliever), and his shot quality already collapsed deep in the game (12-of-16 misses across Q2-Q4, six TOs). On the other side, Brunson played 37 min through two visible in-game lower-body injuries and STILL closed strong — that is a high-grade durability observation that says Brunson tired ≠ Brunson useless. My lane supports NYK +5.5 at modest conviction (0.55-0.58); higher-conviction calls would require Momentum/Matchup/Coaching to connect their evidence to mine in Round 2.

---

## EVIDENCE CHAIN (mechanical → narrative)

1. **Wemby G1 minute load = 38, on top of WCF avg 37.7.** [Local: `js/data/series-data.js` line 7258, Tier 1 — `V. Wembanyama, min:38, pts:26, fg:6-21, to:6`]. AA aggregation: "WCF avg 37.7 min/game (heavy load Wemby was not conditioned for — regular season <30 min)" [`js/data/external-research.js` entry 3, weight 0.8, Tier 1]. On a Wed→Fri 1-day turn, there is no mechanical reset — this is continuation of an out-of-baseline load.

2. **Wemby's G1 shot-quality decay pattern is NOT generic "off night" — it has a fatigue signature.** Yahoo Sports / Sports Illustrated post-G1 analysis: Wemby "missed 12 of 16 attempts over the final three quarters" [WebSearch + sourced; Yahoo Sports URL: https://sports.yahoo.com/nba/article/nba-finals-why-victor-wembanyama-looked-gassed-against-the-knicks-at-the-end-of-game-1-loss-045810247.html, Tier 2 verified]. The Q4 result reinforces the decay direction: per `js/data/series-data.js` G1 notes (line 7279), NYK outscored SAS **29-19 in Q4** — SAS scored just 14 points off the floor (excluding FT) in the closing frame, and NYK closed on an 11-0 run. ESPN's G1 takeaways column independently flagged SAS's Game 1 total as its lowest scoring output this postseason [WebSearch Tier 2 — https://www.espn.com/nba/story/_/id/48940704/]. The qualitative-signal database confirms the Q4 mechanism: "Three back-to-back-to-back missed shots when score was 94-89... Costly turnover at 99-95. WORST stretch came in clutch minutes when fatigue compounds with pressure." [`js/data/qualitative-signals.js`, severity 0.85, Tier 1, `nextGameImplication: 'wemby-clutch-cap'`]. Per `signal-calibration.js`, qualitative-observation weight = 0.45.

3. **Backup-C scarcity is structural and one day fixes nothing.** Kornet WCF avg 11.5 min/game; he is "the primary (and only) backup behind Wemby. SAS system has no viable C alternative if Wemby tires — forces Wemby to high minutes regardless of fatigue." [`js/data/external-research.js` entry 4, weight 0.6, Tier 1]. Per the user's prompt, Kornet has played 0-15 min in 12 of 15 SAS playoff games — directionally consistent with the cited 11.5 WCF average. Mitch Johnson cannot manufacture additional rest for Wemby without burning lineup quality.

4. **Wemby's defensive load compounds the fatigue mechanism.** Yahoo Sports: "the Spurs' overall reliance on Wembanyama defensively, asking him to cover copious amounts of space possession after possession, ultimately appeared to drain the 22-year-old" [Tier 2, same source as claim 2]. This is a fatigue-mechanism observation — Wemby's WCF/Finals workload is two-way (defensive coverage area on every possession), which is not equivalent to a high-scoring offensive load. Conditioning was for a <30-min regular-season role; G2 demands repeating the 38-min two-way grind.

5. **Brunson DURABILITY observation (the piece v1 missed).** Per Bleacher Report and Yahoo Sports: Brunson sustained TWO visible in-game injuries in G1 — (a) apparent right knee injury in Q1 when Harrison Barnes fell into his knee on a rebound jostle (Brunson "grabbed at his knee and limped to the locker room" before returning), and (b) apparent left ankle injury when Luke Kornet landed on him after a drive. Final line: 30 pts on 12-of-31 FG, 37 min. Brown post-game: "Jalen's tough as nails... he didn't seem like he had any effect afterwards... I think he's okay." [WebSearch Tier 2 — https://sports.yahoo.com/nba/article/knicks-star-jalen-brunson-playing-despite-sustaining-apparent-knee-and-ankle-injuries-in-nba-finals-game-1-013925600.html, https://bleacherreport.com/articles/25433762-jalen-brunson-injured-nba-finals-game-1-latest-updates-knicks-stars-status-vs-spurs]. **From a fatigue-mechanics standpoint, this is a high-grade durability-under-stress observation.** A player who plays 37 min through two lower-body injuries and still ends the game with the team's primary closing usage is demonstrating the mechanical engine that withstands a 1-day turnaround. I do NOT make any clutch-performance claim here — that's the Momentum agent's lane. I report only: durability is structurally intact.

6. **Mitchell Robinson injury status is a SECOND durability observation worth flagging.** Per NBC Sports / NBA.com / Heavy and the local boxScore [`js/data/series-data.js` line 7275, Tier 1]: Robinson played G1 12 min, 2-3 FG / 4 pts / 6 reb / 3 blk post-surgery (right fifth metacarpal, surgery less than two weeks before G1 per Heavy). Listed PROBABLE for G2. [WebSearch Tier 2 — https://heavy.com/sports/nba/new-york-knicks/mitchell-robinson-injury-update-game-2/]. In fatigue terms: Robinson is a 12-min role player whose hand surgery limits him to short bursts — meaning KAT absorbs most of the C-minute load. KAT played 34 min G1; expect 32-36 min G2. This compresses NYK's frontcourt rotation. Net effect on fatigue cliff: small relative to SAS's backup-C scarcity but worth flagging as a sub-thesis risk.

7. **Counter-evidence (acknowledged honestly).** Chris Paul "downplayed concerns about Victor Wembanyama playoff fatigue"; Mitch Johnson "REFUSED to cite fatigue as an excuse"; Wemby himself: "I am not worried about him being tired or anything" [`js/data/external-research.js` entry 7, weight 0.4, Tier 1]. Pre-game downplay is standard and near-zero predictive. Stronger counter — the "angry-superstar bounce-back" pattern (SAS-MIN R2 G2: Wemby +38 win after a G1 0-8 3PT collapse) [`js/data/series-data.js` line 3802, Tier 1] — is real variance that caps confidence here.

---

## PLAYER-SPECIFIC PROJECTIONS

**SAS side (fatigue tax applies):**

- **Wemby:** pts 22-30 (proj 25), reb 11-15 (proj 12), ast 2-4 (proj 3). **PRA 35-47.** Lean OVER any composite line ≤ 41.5 — FT volume and rebound floor carry composite even on inefficient shooting nights (G1 confirmed: 40 PRA on 6-21 FG). Lean UNDER any pts-only line of 28+. Mechanical reasoning: 38-min load repeats; the Q4 shot-quality cliff is the failure mode, not volume.
- **Fox:** pts 12-22 (proj 17), reb 3-5 (proj 4), ast 5-8 (proj 6). **PRA 22-32.** Fox played 38 min G1 as well (line 7259). Same minute-load class as Wemby; variance reset on 3-13 FG floor is mean-reversion, but his Q4 conditioning ceiling is comparable to Wemby's.
- **Castle:** pts 14-22 (proj 18), reb 5-8 (proj 6), ast 3-6 (proj 4). **PRA 24-34.** 34 min G1 (verified line 7260). Defensive load on Brunson is energy-expensive; flag for late-game efficiency dip but not a workload-cliff candidate.
- **Champagnie:** pts 10-18 (proj 13), reb 5-9 (proj 7), ast 0-2 (proj 1). **PRA 16-26.** Bench legs = the cleanest minutes available to SAS. Lean OVER PRA 14.5.

**NYK side (rest dividend applies; Brunson durability confirmed):**

- **Brunson:** pts 24-32 (proj 28), reb 2-4 (proj 3), ast 5-8 (proj 6). **PRA 32-42.** G1 line: 37 min, 30 pts on 12-31 through two injuries. Knee + ankle are short-term tweak risks, not structural — Brown's "tough as nails" + "I think he's okay" + the demonstrated G1 close. Lean OVER PRA 33.5. **NOTE:** durability ≠ clutch performance — I am reporting only that Brunson's engine clears the 37-min bar; Momentum/Matchup agents will connect this to closing-window performance.
- **KAT:** pts 16-24 (proj 19), reb 9-13 (proj 11), ast 2-5 (proj 4). **PRA 30-40.** G1: 34 min, 18/12. With Robinson minutes capped by hand injury (12 min G1 likely-repeats), KAT absorbs the structural C-load. Lean OVER PRA 28.5.
- **OG:** pts 12-20 (proj 16), reb 3-6 (proj 4), ast 1-3 (proj 2). **PRA 18-28.** Rested-wing 3PT spike: 3-6 from 3 G1.
- **Hart:** pts 6-14 (proj 9), reb 9-15 (proj 11), ast 4-7 (proj 5). **PRA 22-32.** Hart's REB+AST floor is workload-independent — his engine doesn't fade with minutes. Lean OVER PRA 22.5.

---

## TEAM EXECUTION NARRATIVE

**Q1:** Both sides should come out energetic — SAS at home post-G1 loss, NYK on 1-day rest. From a pure FATIGUE standpoint, Q1 is the cleanest quarter of any back-to-2-day game; expect normal shot quality, normal pace. The fatigue signal does not surface here.

**Q2-Q3:** This is where Wemby's minute math becomes visible. By the second half of Q2, he's already played 16-18 min and Mitch Johnson is back in the Kornet-or-no-rest dilemma. Wemby's defensive coverage area (Yahoo Sports observation: "covering copious amounts of space possession after possession") starts compounding — the same physical Knicks pressure that drained him in G1 is identical in personnel and scheme on the 1-day turn. NYK's frontcourt rotation is also compressed (Robinson capped at ~12 min by hand recovery), so KAT absorbs heavy load — but KAT's WCF baseline of 32-34 min is closer to his regular-season norm than Wemby's 38 min is to his.

**Q4:** The fatigue case lives or dies here. The G1 pattern was specifically Q2-Q4 shot decay (12-of-16 missed over the last 3 quarters) compounded by Q4 clutch-window collapse (3-straight misses at 94-89, costly TO at 99-95). I project the same shot-quality curve on a 1-day turn, with the qualitative-signal severity 0.85 explicitly flagging this as the highest-confidence in-lane signal I have. **What I do NOT claim here:** I do not claim NYK wins clutch windows by some clutch-NetRtg or comeback DNA. Those belong to the Momentum agent. What I claim is purely mechanical — Wemby's legs in Q4 should be at or below the same fatigue floor that produced 12-of-21 inefficient FG and 6 TO in G1. Brunson's confirmed durability (G1 played 37 min through two injuries) suggests NYK's closing engine is intact.

---

## CONFIDENCE: 0.57

Calibration logic: My mechanical case (Wemby 38-min load, backup-C scarcity, Q2-Q4 shot-quality decay pattern, defensive coverage compounding) carries weight 0.55 per `signal-calibration.js` `fatigue-mechanical`. My durability observation on Brunson (verified Tier 2) carries weight ~0.5 — it is fresher evidence than the analyst-quote case but I am scoping it strictly to "engine intact," not extending to clutch performance. My analyst-quote convergence (Windhorst/Simmons/AA) carries weight 0.35 and I am not leaning on it. Counter-evidence (angry-superstar bounce-back; CP3/Johnson public denial; Wemby's own framing) caps upside. **0.57 reflects "more likely than not NYK covers on fatigue grounds alone."** Higher conviction (0.65+) would require Momentum/Matchup to connect their evidence to my durability and Q4-cliff observations in Round 2.

---

## BET RECOMMENDATION

- **Spread: NYK +5.5 — MEDIUM** (mechanical fatigue case + Brunson durability case clean; angry-Wemby variance and home emotional bump cap conviction)
- **Total: lean UNDER 214.5 — WEAK** (Wemby Q2-Q4 shot quality should remain inefficient; pace doesn't accelerate on 1-day rest; but G2 home bounce-backs historically run hot — pass if not at -110)
- **Player props:**
  - **Wemby UNDER pts-line at 28.5+ — MEDIUM** (Q4 shot-quality cliff is the mechanical bet; FT volume floors line at ~22)
  - **Hart OVER PRA 22.5 — MEDIUM** (workload-independent engine; absorbs freshness dividend best)
  - **Brunson OVER PRA 33.5 — WEAK** (durability confirmed; conviction lower because injury news is fresh — flag if either knee or ankle changes pre-game)
- **Parlay-suitable legs:** NYK +5.5 + Hart OVER PRA 22.5 + Wemby UNDER 28.5 pts. These correlate positively under the "Wemby Q4 cliff returns + NYK closing engine intact" thesis.

---

## WHAT WOULD CHANGE MY MIND

1. **Brunson downgraded to questionable/out for either G1 knee or ankle injury** — fatigue case still holds on the Wemby side, but the Brunson durability sub-thesis flips. Would downgrade NYK +5.5 to WEAK.
2. **Mitch Johnson telegraphs Wemby minute management ("we're going to limit him tonight")** — eliminates the Q4 cliff but introduces "Wemby on bench during clutch" risk. Flips the bet to PASS or SAS-ML.
3. **Sharp line movement to SAS -3.5 or NYK +3.5** — market has already priced the fatigue thesis; downgrade to PASS at -3 or shorter.
4. **Mitchell Robinson scratched (NOT just hand-limited) for G2** — compresses NYK frontcourt further; KAT to 38+ min territory; alters my KAT/Hart projections downward.

---

**Sources cited (tier summary):**
- Tier 1 (local): `js/data/series-data.js` G1 box scores + modelLessons + line 7279 Q4 notes; `js/data/external-research.js` entries 1, 3, 4, 7; `js/data/qualitative-signals.js` Wemby Q4 cliff; `js/data/signal-calibration.js` weights.
- Tier 2 (WebSearch verified): Yahoo Sports Wemby Q4 analysis URL; ESPN G1 takeaways URL (SAS lowest postseason scoring total); Yahoo Sports + Bleacher Report Brunson injury URLs; Heavy.com Mitchell Robinson G2 status URL.
- Tier 3-5: not used.

**NEEDS_USER_APPROVAL flags:** NONE.

---

## CHANGED FROM v1 (lane discipline correction)

- **REMOVED** the "NYK's clutch-NetRtg of 9.2 cashes in close-game windows" claim from Q4 narrative — this was an out-of-lane Momentum/Matchup reach AND was mislabeled (9.2 is Brunson's individual clutch rating, not team NetRtg).
- **ADDED** Brunson G1 dual-injury durability observation (knee + ankle, played 37 min, 30 pts) — sourced via Tier 2 WebSearch. This is the central piece v1 missed.
- **ADDED** Wemby's specific Q2-Q4 shot decay pattern ("12-of-16 missed over the final three quarters") — a fatigue-mechanism signature, not generic "off night."
- **ADDED** Wemby defensive coverage load (Yahoo Sports observation) as a compounding fatigue mechanism on top of offensive load.
- **ADDED** Mitchell Robinson hand-injury status (probable, ~12 min G1) as a secondary durability observation affecting NYK frontcourt rotation.
- **TIGHTENED** the Q4 narrative to make zero clutch-performance claims; explicitly defers clutch-connection to Momentum agent for Round 2.
- **CLARIFIED** Brunson durability ≠ Brunson clutch — "engine intact" is the in-lane claim; clutch is the Momentum agent's connection to make in Round 2.

---

## CHANGED FROM v2 (targeted partial-fix revision)

Only two surgical edits, per fact-check v2 partial findings. No other claims, projections, confidence, or recommendations changed.

- **FIX 1 (evidence chain point 2):** SOFTENED the "40.9% vs 28.6% Q4 shooting" claim — those specific percentages could not be located at the cited Yahoo URL or via follow-up WebSearch. Replaced with directional Q4 facts that ARE verifiable: (a) NYK outscored SAS **29-19 in Q4** [local `js/data/series-data.js` line 7279, Tier 1] and (b) ESPN G1 takeaways column flagging SAS's G1 as its **lowest scoring output this postseason** [Tier 2]. Direction of the original claim (NYK outshot SAS heavily in Q4) is preserved; only the unsourced specific percentages were removed.
- **FIX 2 (evidence chain point 6 + KAT projection + Q2-Q3 narrative):** CORRECTED Mitchell Robinson G1 stat line — boxScore [`js/data/series-data.js` line 7275] is `min:12, pts:4, reb:6, fg:"2-3"` (v2 said "13 min, 1-2 FG, 2 pts"). Updated to 12 min / 2-3 FG / 4 pts / 6 reb / 3 blk. Removed the unsourced "June 3 surgery" date and replaced with the Heavy-confirmed phrasing "less than two weeks before G1." Knock-on edit: "Robinson capped at ~13 min" → "Robinson capped at ~12 min" in the KAT projection and Q2-Q3 narrative for consistency.
