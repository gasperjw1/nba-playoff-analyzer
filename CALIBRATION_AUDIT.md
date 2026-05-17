# Calibration Audit — 2026 Playoffs

**Phase 71 · May 17, 2026**

Honest evaluation of the current engine against every resolved playoff
game (68 games: 48 R1, 20 R2). Run `node test-calibration-audit.js`
any time to refresh these numbers.

---

## Headline: how the model actually performs

| Level | Our number | Reference | Verdict |
|---|---|---|---|
| **Winner accuracy** | 66.2% | Vegas ~67% | ✅ COMPETITIVE |
| **Margin MAE** | 12.94pt | Vegas ~9pt | ❌ 44% WORSE |
| **Margin RMSE** | 15.39pt | n/a | ❌ wide tails |
| **Total MAE** | 13.21pt | n/a | ⚠️ noisy |
| **PTS MAE (all players)** | 5.10pt | "good" 5-6pt | ✅ ACCEPTABLE |
| **PTS MAE (elite stars)** | **7.21pt** | "good" 5-6pt | ❌ POOR |
| **PTS bias (elite stars)** | **+2.63pt** | should be 0 | ❌ SYSTEMATIC OVER-PREDICTION |
| **Big margin misses (>10pt)** | 48.5% | ~30% | ❌ NEARLY HALF |
| **Catastrophic misses (>20pt)** | 17.6% | ~5% | ❌ 1-IN-6 GAMES |

**One-line summary:** The engine picks winners at Vegas level. It
projects margins ~50% worse than Vegas. It projects role players
correctly. It systematically **over-predicts stars by 2-3pts**, which
is the entire source of our prop bleed.

---

## Level 1 — Game-level predictions

**Winner accuracy is the bright spot.** 66.2% overall, 75% in R2.
This is the engine's real skill — and it tracks with the Phase 68 P&L
finding that ml bets went +11% ROI.

**Margin is the weak spot.** 12.94pt MAE means our spread predictions
are essentially noise. The Phase 68 +35% ROI on spreads (17 bets) was
**small-sample luck, not skill**. With 13pt MAE we'd expect spread
hit rate near 50%, not the 70% we got.

### Worst margin misses (the model's actual failure modes)

| Game | Predicted | Actual | Error |
|---|---|---|---|
| NYK-ATL G6 | NYK +6 | NYK +51 | **−45pt** |
| BOS-PHI G4 | BOS +1 | BOS +32 | **−31pt** |
| DEN-MIN G2 | DEN +22 | MIN +5 | +27pt |
| DEN-MIN G3 | DEN +9 | MIN +17 | +26pt |
| DEN-MIN G4 | DEN +8 | MIN +16 | +24pt |
| CLE-TOR G3 | CLE +2 | TOR +22 | +24pt |
| NYK-PHI G4 | NYK +7 | NYK +30 | −23pt |
| DEN-MIN G1 | DEN +33 | DEN +11 | +22pt |

Three patterns visible:
1. **Blowouts are systematically under-predicted.** When a team wins by 30+, model predicted single-digit margins (NYK-ATL, BOS-PHI, NYK-PHI).
2. **DEN was over-rated all series.** The DEN-MIN R1 produced 4 of the 8 worst misses — model loved DEN, MIN won 4-2. The engine still values Jokic too highly relative to current MIN talent.
3. **Specific matchups have systematic blind spots.** CLE-TOR G3 was a +24pt swing the model couldn't see.

### By game number — does the model degrade in late series?

| Game | n | Winner % | Margin MAE | Margin bias |
|---|---|---|---|---|
| G1 | 12 | 83% | 12.5pt | +5.7 |
| G2 | 12 | 67% | 12.6pt | +4.8 |
| G3 | 12 | 67% | 9.4pt | +4.3 |
| G4 | 12 | 58% | 14.6pt | −2.4 |
| G5 | 9 | 67% | 10.2pt | −4.7 |
| **G6** | 8 | **50%** | **19.8pt** | −5.5 |
| G7 | 3 | 67% | 13.7pt | −5.7 |

**G6 is broken.** 50% winner accuracy + 19.8pt MAE means the model
has zero edge in elimination games. We've been writing bets on these
without that caveat. The bias flips from "home over-predicted" early
in series to "home under-predicted" late — the model under-weights
desperation dynamics.

---

## Level 2 — Player projections (the real source of bleed)

Run against **931 player-games** with box scores; excluding DNPs leaves
**837 player-games** for prop analysis.

### Overall (all players, all stats)

| Stat | n | Predicted | Actual | MAE | Bias | Within tolerance |
|---|---|---|---|---|---|---|
| PTS | 837 | 12.7 | 12.1 | 5.10 | +0.59 | 59.9% (±5pt) |
| REB | 837 | 4.9 | 4.8 | 2.04 | +0.13 | 59.3% (±2) |
| AST | 837 | 2.8 | 2.6 | 1.43 | +0.19 | 78.0% (±2) |
| **THREES** | 837 | **0.0** | 0.9 | 0.92 | **−0.92** | 87% |
| **STL** | 837 | **0.0** | 0.8 | 0.83 | **−0.83** | 93% |
| **BLK** | 837 | **0.0** | 0.5 | 0.52 | **−0.52** | 97% |

**The engine projects 0 for threes, steals, and blocks.** Every prop
we've written on these stats has been based on hand-authored guesses,
not the model. This is a data-quality issue, not a model issue —
we have prop bets on stats the engine doesn't actually project.

### By tier — where the over-prediction lives

| Tier | n | PTS MAE | PTS bias | REB bias | AST bias |
|---|---|---|---|---|---|
| **Elite (85+)** | **66** | **7.21** | **+2.63** | +0.48 | +0.97 |
| **Starter (75-84)** | **118** | **5.59** | **+2.06** | +0.69 | +0.18 |
| Rotation (65-74) | 258 | 4.97 | +0.08 | −0.22 | +0.11 |
| Bench (<65) | 395 | 4.69 | +0.13 | +0.14 | +0.11 |

**This is the find.** The engine is:
- **Well-calibrated for rotation + bench players** (bias near 0, MAE acceptable)
- **Systematically over-predicting elite players by +2.63pt** and starters by **+2.06pt**

In a prop market where lines are tight, a +2pt over-projection on every
star prop = systematically picking the wrong side of the line. **This
single bias explains the −33% ROI on props.**

### By round

| Round | n | PTS MAE | PTS bias |
|---|---|---|---|
| R1 | 658 | 5.15 | +0.20 (calibrated) |
| R2 | 179 | 4.92 | **+1.98 (over-predicting)** |

Bias gets WORSE in R2 — playoff defense intensifies on stars and the
model doesn't compensate. The Phase 17 "playoff escalation" multiplier
is probably pushing stars UP when reality pushes them DOWN.

### Player-specific bias (worst offenders, n≥4)

**Over-predicted (model says more than reality):**
- Jalen Duren: +8.21 PTS / +1.52 REB (n=9) — model loves the boost-from-Cade narrative
- Shai Gilgeous-Alexander: +6.86 PTS (n=5) — playoff defenses target him
- Brandon Ingram: +8.06 PTS (n=5) — small sample but extreme
- Isaiah Stewart: +5.57 PTS / +2.49 REB (n=9) — overweighted hustle
- Landry Shamet, Miles McBride: +5pp each — bench players who don't get the role we project

**Under-predicted (model says less than reality):**
- Tobias Harris: **−9.42 PTS** (n=9) — model materially under-rates him
- Cade Cunningham: **−8.61 PTS** (n=9) — superstar emergence not yet in ratings
- RJ Barrett: −7.06 PTS (n=7) — TOR series engine missed his role
- OG Anunoby: −5.47 PTS (n=6) — engine under-weights his NYK role

**Both lists have n≥4** — these are patterns, not noise. The engine
has 20+ individual players where it's systematically wrong by 5-10pts.

### Alt-line hit rate (the rare bright spot)

When we treat the line as **"projection minus 5pts"** (typical floor
alt line), hit rates are reasonable:

| Stat | Line offset | n | Cleared |
|---|---|---|---|
| PTS | proj − 5 | 457 | **70.7%** |
| REB | proj − 2 | 456 | **76.8%** |
| AST | proj − 2 | 296 | **75.3%** |

A well-calibrated 70%-confidence prop should hit ~70% — this is
actually right. So the engine is OK at projecting **distribution
centers**, just bad at projecting **levels**. Deep alt lines beat the
projected line.

---

## What this means

### Where we are RIGHT

1. **Winner predictions are at Vegas-level (66% vs 67%).** ML bets are real edge.
2. **Rotation + bench player projections are well-calibrated.** Bias ≈ 0, MAE ≈ 5pt.
3. **Deep alt lines clear at expected rates** (70%+). The distribution shape is OK; the center is off.
4. **REB, AST projections are decently calibrated** across all tiers (1-2pt MAE).

### Where we are WRONG

1. **Margin predictions are 44% worse than Vegas.** Spreads are noise. The Phase 68 +35% ROI on spreads was luck.
2. **The engine over-predicts ELITE players by +2.6pt and STARTERS by +2.0pt.** This is the entire source of prop bleed.
3. **Threes/STL/BLK projections don't exist** (engine returns 0). Every prop bet on these stats is hand-authored, not model-supported.
4. **DNPs aren't modeled.** 10% of player-games are DNPs; engine assumes all rated players play.
5. **G6 / elimination games are broken** (50% winner accuracy, 19.8pt MAE).
6. **R2 over-prediction is worse than R1** for stars (+1.98pt bias vs +0.20). Playoff defensive intensity not modeled.
7. **17.6% of games have >20pt margin errors.** The variance is huge.

---

## Recommendations (ranked by impact)

### 1. Stop authoring prop bets on stars (immediate)

The +2.6pt elite bias × 4-6 star props per slate = systematic −EV. The
Phase 68 SKIP filter already routes around this in practice. Make it
**explicit**: refuse to author over-side props on rating-85+ players
until the projection function is reworked. Rotation players are fair
game (calibrated).

### 2. Build a star-specific projection adjustment

The bias isn't random — it's tier-specific. The fix is either:

  **Option A** (cheap): apply a flat −2pt PTS adjustment for elite,
  −2pt for starter, in `calcExpectedPlayerStats`. Crude but correct in
  expectation. Estimated impact: prop MAE drops to ~4.5pt for stars,
  bias drops to ~0.

  **Option B** (correct): figure out WHY the engine over-predicts
  stars. Suspect causes: Phase 17 playoff escalation multiplier
  (rewards stars too much); usage rate × rating compounding;
  no defensive-intensity penalty in R2+.

### 3. Stop authoring spread bets entirely (or treat them as coin flips)

12.94pt margin MAE means spread bets have no model edge — they're
priced inside our error band. The Phase 68 P&L showing +35% ROI on
spreads was 17 bets of luck. Either delete spread authoring or
explicitly mark spread bets as "coin flip · entertainment only."

### 4. Project the missing stats (threes / STL / BLK) or stop betting on them

Right now the engine returns 0 for these. Either:
  - Build per-player projections for these stats (need historical
    rate data — 3PA × 3P% for threes; STL+BLK rate per minute)
  - Or refuse to author prop bets on stats the engine can't project

The current "hand-author a Wemby blocks O/U" approach is bias risk.

### 5. Add DNP modeling

10% of player-games are DNPs. The engine should output:
  - P(plays at all)
  - E[minutes | plays]
  - E[pts | plays, minutes]

This is non-trivial but the data exists in box scores. A simple
rule: rating × (game_competitiveness) → minutes; bench players in
blowouts get cut.

### 6. Fix the G6/elimination-game blind spot

50% winner accuracy in G6 is no edge. Either gather more data (8
games isn't much) or model elimination-game dynamics explicitly
(road team desperation premium; survivor-bias home team).

### 7. Per-player calibration table (low priority)

20 players have ≥5pt systematic bias. A per-player adjustment table
indexed by name + stat would mechanically fix the worst cases
(Tobias +9, Cade +8, SGA −7). But this is band-aid; the structural
fix is #2.

---

## What NOT to do

- **Don't ship more risk overlays.** Phase 68/69/70 routed around the
  model's prop weakness. The actual fix is at the projection layer.
  Adding a fifth dashboard doesn't help.

- **Don't trust the Phase 68 P&L extrapolation.** +17% ROI on ml/spread/
  total was 49 bets. The audit shows ml is real (+winner accuracy);
  spread was luck (margin MAE too high). Bet differently per type.

- **Don't extrapolate the Phase 62 calibration table to R3.** Those
  buckets were fit to 93 R2 bets. With R3 reaching 50+ bets the buckets
  will shift. Re-fit, don't trust frozen numbers.

- **Don't fix everything at once.** Pick one (probably #2 — star
  projection fix), measure impact in R3, then move on. The model has
  ONE big problem (star over-prediction), not seven.

---

## The honest framing for the user

The application has been measuring "did the bet win?" all along. This
audit measures **"did the prediction track reality?"** — and the answer
is mixed.

The model is genuinely a Vegas-level winner-picker for moneylines. It
is **systematically broken at predicting elite player scoring** by
+2-3pts. That's a fixable problem, not a "the whole thing is broken"
problem.

The path forward:
1. Pause all prop authoring on stars until #2 ships (1 day of work)
2. Validate the star adjustment in R3 (10-15 games)
3. If confirmed, expand to the missing-stats build (#4)
4. Return to bet-strategy work only after the projection layer is fixed

Anything else is window dressing on a fixable upstream problem.
