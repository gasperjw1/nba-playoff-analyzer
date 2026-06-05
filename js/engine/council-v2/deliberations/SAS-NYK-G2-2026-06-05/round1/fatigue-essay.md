# FATIGUE AGENT — Round 1 Essay

**Game:** SAS-NYK Finals G2 — Fri 6/5/2026, 8:30 PM ET at Frost Bank Center
**Market:** SAS -5.5 / O/U 214.5

---

## THESIS

NYK +5.5 is the mechanical play. SAS gets a sit-down day of rest (Wed→Fri = 1 day off) and a "must-win at home" emotion bump that should produce a Q1/Q2 SAS lead, but the same backup-C scarcity that forced Wemby to 38 min in G1 is unchanged, while NYK's rested legs only get fresher. I project SAS by 1-4 with a wide variance band — NYK covering 5.5 is +EV at roughly 56-58% vs the implied 47.6%.

---

## EVIDENCE CHAIN (mechanical → narrative)

1. **Wemby G1 minute load was 38 — at the absolute top of his playoff load and well above his regular-season baseline.** [Local: `js/data/series-data.js` line 7258, Tier 1 — `V. Wembanyama, min:38, pts:26, ... fg:"6-21", to:6`]. Awful Announcing aggregation noted his WCF average was 37.7 min/game vs a regular-season norm of <30 min ["WCF avg 37.7 min/game (heavy load Wemby was not conditioned for — regular season <30 min)", `js/data/external-research.js` entry 3, Tier 1]. The mechanical pattern is unambiguous: 38 min on a 1-day turnaround is not a fatigue reset — it's a continuation.

2. **Backup-C scarcity is structural and unfixable in one day.** Kornet averaged only 11.5 min/game in WCF vs OKC and is "the primary (and only) backup behind Wemby" — "SAS system has no viable C alternative if Wemby tires — forces Wemby to high minutes regardless of fatigue" [`js/data/external-research.js` entry 4, Tier 1, Fantasy Team Advice / Basketball-Reference]. The user's prompt notes Kornet has played 0-15 min in 12 of 15 SAS playoff games — directionally consistent with the 11.5 WCF average. There is no Tyson-Chandler-grade reliever waiting on the bench; Olynyk is a stretch-spacing option, not a Wemby workload absorber.

3. **The G1 user-observed Q4 fatigue signal is real and severity-rated 0.85.** "Three back-to-back-to-back missed shots when score was 94-89 (NYK +5). Only Q4 make after that stretch was a pair of free throws. Costly turnover at 99-95." [`js/data/qualitative-signals.js`, Tier 1, `nextGameImplication: 'wemby-clutch-cap'`]. Per `signal-calibration.js`, qualitative-observation carries weight 0.45 (above analyst quotes at 0.35 because the user had specific watching context). This is the strongest single-game predictor that the same Q4 cliff returns on a 1-day turn — there is no medical reason a tired player gets sharper on minimal rest.

4. **The rest-gap math STILL favors NYK going into G2.** G1 lesson explicitly stated: "the rest-gap nuance was framed as a NYK NEGATIVE (sluggish Q1); it was actually a NYK POSITIVE (4th-quarter conditioning edge)" [`js/data/series-data.js` modelLessons line 6788, Tier 1]. NYK outscored SAS 57-40 in the second half and closed on an 11-0 run. With both teams now on 1-day rest, NYK's accumulated rest debt remains lower (4 games × ~33-37 min/starter vs SAS's 7-game WCF grind + 3 days then G1).

5. **Analyst convergence is descriptive evidence, weighted accordingly.** Windhorst (ESPN): "I felt Victor Wembanyama was low on energy from the first quarter" [`external-research.js` entry 1, weight 0.85, Tier 1]. Simmons: "Wemby looked tired" [entry 2, weight 0.7]. Per signal-calibration, `fatigue-analyst-claim` weight = 0.35 — tipsters predict at 42.6% (below market). I cite these for completeness but do NOT lean on them; the mechanical case stands alone.

6. **Counter-evidence I honestly acknowledge:** Chris Paul "downplayed concerns about Victor Wembanyama playoff fatigue"; Mitch Johnson "REFUSED to cite fatigue as an excuse" [entry 7, weight 0.4, Tier 1]. Players/coaches always downplay pre-game fatigue — this is near-zero predictive value but it belongs in the record. The "angry-superstar bounce-back" pattern is also real (see SAS-MIN R2 G2 +38 after a G1 0-8 3PT collapse, `series-data.js` line 3802). That's why my confidence is 0.58, not 0.75.

---

## PLAYER-SPECIFIC PROJECTIONS

**SAS side (fatigue tax applies):**

- **Wemby:** pts 22-30 (proj 25), reb 11-15 (proj 12), ast 2-4 (proj 3). **PRA 35-47.** Lean OVER any line ≤ 41.5 (FT volume and rebounds carry composite even on inefficient nights — confirmed G1: 40 PRA on 6-21 FG). Lean UNDER any pts-only line of 28+. Mechanical reasoning: 38-min load repeats; the Q4 cliff is the failure mode, not the volume.
- **Fox:** pts 12-22 (proj 17), reb 3-5 (proj 4), ast 5-8 (proj 6). **PRA 22-32.** Lean OVER on PRA 20.5 (3-13 FG floor was a 1-std outlier; mean-reverts). Castle/Brunson POA pressure persists but Fox gets a shooting variance reset.
- **Castle:** pts 14-22 (proj 18), reb 5-8 (proj 6), ast 3-6 (proj 4). **PRA 24-34.** Castle played 34 min G1 — heaviest WCF role-player load + a Finals-G2 home spot suggests sustained engagement. The matchup defending Brunson is energy-expensive though; flag for late-game efficiency dip.
- **Champagnie:** pts 10-18 (proj 13), reb 5-9 (proj 7), ast 0-2 (proj 1). **PRA 16-26.** Bench legs are the cleanest minutes available to SAS. Lean OVER PRA 14.5.

**NYK side (rest dividend applies):**

- **Brunson:** pts 24-32 (proj 28), reb 2-4 (proj 3), ast 5-8 (proj 6). **PRA 32-42.** Castle's 0.91 dLEBRON suppresses FG% (G1: 12-31 = 38.7%) but not volume — same pattern, similar line. Lean OVER PRA 33.5.
- **KAT:** pts 16-24 (proj 19), reb 9-13 (proj 11), ast 2-5 (proj 4). **PRA 30-40.** G1: 18/12. Wemby's drop-pull dynamic favors KAT pop attempts. Lean OVER PRA 28.5.
- **OG:** pts 12-20 (proj 16), reb 3-6 (proj 4), ast 1-3 (proj 2). **PRA 18-28.** Rested-wing 3PT spike: 3-6 from 3 in G1. Sustainable.
- **Hart:** pts 6-14 (proj 9), reb 9-15 (proj 11), ast 4-7 (proj 5). **PRA 22-32.** Hart's REB+AST floor is workload-independent — he's the guy whose engine grows when others tire. Lean OVER PRA 22.5.

---

## TEAM EXECUTION NARRATIVE

**Q1:** SAS comes out aggressive at home — emotional response to the G1 loss + Frost Bank crowd. Expect an early SAS lead of 4-9 by the end of Q1. Wemby attacks the rim early (lesson from MIN R2 G2: after a 0-8 3PT G1, he stopped settling). Fox bounces back from 3-13 with a more aggressive PnR diet. NYK starts slow as is typical for road-favored road teams on short rest after a comeback win — Brunson plays controlled.

**Q2-Q3:** This is where the fatigue cascade starts. By the second half of Q2, Wemby has already played 16-18 min and the bench rotation forces Mitch Johnson into the Kornet-or-no-rest dilemma. If Kornet plays 8+ min, the lineup downgrades (per the user's note: 0-15 min in 12 of 15 playoff games — Kornet is barely viable). If Wemby stays on the floor, the Q4 cliff loads earlier. SAS's lead peaks in Q2 around +8-12, then Brown counter-adjusts — same H1→H2 pattern as G1, where Brown's adjustments delivered SAS fast-break pts 24 H1 → 9 H2 and NYK TOs 8 H1 → 1 H2 [`external-research.js` entry 5, Tier 1, The Athletic / NBA.com]. Shamet plays 30+ min again as the spacing release valve.

**Q4:** This is the bet. NYK's role players have fresher legs (NYK's deepest player in G1 was Shamet at 33 min; SAS's deepest were Wemby and Fox at 38). The Wemby Q4 cliff returns on a 1-day turn — three-misses-in-a-row pattern is the templated failure mode the user observed at severity 0.85. If SAS leads by 4-8 entering Q4, NYK closes within 2-3 by the 4:00 mark and the game is a coin flip from there. NYK's clutch-NetRtg of 9.2 (best on the floor) cashes in close-game windows. The most likely score: SAS 108-NYK 105 or NYK 106-SAS 104 — within the 5.5 cover either way.

---

## CONFIDENCE: 0.58

Calibration logic: My mechanical case (minute load, backup-C scarcity, Q4 cliff severity 0.85) is strong and gets weight ~0.55 per `signal-calibration.js` `fatigue-mechanical`. My analyst-convergence case (Windhorst/Simmons/SI) gets weight 0.35 per `fatigue-analyst-claim` and I'm NOT leaning on it. There is real angry-superstar bounce-back variance (SAS-MIN R2 G2 +38) and Mitch Johnson WILL try a Kornet experiment — both of those cap upside. 0.58 reflects "more likely than not NYK covers" not "high conviction."

---

## BET RECOMMENDATION

- **Spread: NYK +5.5 — MEDIUM** (mechanical case clean; angry-Wemby variance caps conviction)
- **Total: lean UNDER 214.5 — WEAK** (G1 went UNDER at 200; both teams tired = lower pace; but G2 home bounce-backs historically run hot — pass if not at -110)
- **Player props:**
  - **Wemby UNDER pts-line at 28.5+ — MEDIUM** (Q4 cliff is the mechanical bet; FT volume floors the line at ~22)
  - **Hart OVER PRA 22.5 — MEDIUM** (workload-independent floor; he absorbs the freshness dividend best)
  - **Champagnie OVER PRA 14.5 — WEAK** (bench-legs play; correlates with NYK cover)
- **Parlay-suitable legs (under my scenario):** NYK +5.5 + Hart OVER PRA 22.5 + Wemby UNDER 28.5 pts. These correlate positively under the "NYK rest dividend → tight game won late" thesis.

---

## WHAT WOULD CHANGE MY MIND

1. **Pre-game news that Kornet is scratched or that an additional SAS big enters the rotation** — would tighten Wemby's load and weaken the Q4 cliff thesis.
2. **NYK injury report: KAT or Brunson listed questionable for any reason** — flips the structural balance; the rest dividend means nothing if a primary is compromised.
3. **Sharp line movement to SAS -3.5 or NYK +3.5 (market agreeing with fatigue thesis pre-tip)** — value disappears; I'd downgrade to PASS at -3.
4. **Mitch Johnson telegraphs a Wemby minute cap (e.g., "we're going to manage his minutes tonight") in pre-game pressers** — eliminates the Q4 cliff but introduces a "Wemby on bench during clutch" risk that flips the bet from NYK +5.5 to SAS ML.

---

**Sources cited (tier summary):**
- Tier 1 (local): `js/data/series-data.js` G1 box scores + modelLessons; `js/data/external-research.js` entries 1-7; `js/data/qualitative-signals.js` Wemby Q4 cliff; `js/data/signal-calibration.js` weights.
- Tier 2-5: NONE used. All claims back-stopped by local verified-research files. No fabrication risk.

**NEEDS_USER_APPROVAL flags:** NONE.
