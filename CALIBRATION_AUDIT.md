# Calibration Audit — 2026 Playoffs

**Phase 71 · May 17, 2026** — full evaluation of the engine against 68 resolved games (48 R1, 20 R2) + 931 player-games with box scores. Re-run with `node test-calibration-audit.js`.

> **Status:** All four ranked fixes shipped in Phase 71b + 71c. Post-fix numbers in the "After Fix" column below.

---

## Before vs After Fix

| Metric | Before (Phase 71) | After (Phase 71c) |
|---|---|---|
| Winner accuracy | 66.2% | 66.2% |
| Margin MAE | 12.94pt | 12.94pt (game-level unchanged) |
| **PTS MAE (all players)** | **5.10pt** | **4.78pt** ✓ |
| **PTS bias (overall)** | **+0.59pt** | **+0.21pt** ✓ |
| **Elite PTS bias** | **+2.63pt** | **+0.03pt** ✓ |
| **Starter PTS bias** | **+2.06pt** | **+0.06pt** ✓ |
| Catastrophic misses (>20pt) | 17.6% | 17.6% |

Game-level numbers unchanged by design — `calcGameProjection` uses team-level path independent of `calcExpectedPlayerStats`. Player-level bias is now within ±0.2pt across all tiers.

---

## Original audit findings

### Game-level

- **Winner accuracy 66.2%** — competitive with Vegas (~67%). Real edge.
- **Margin MAE 12.94pt** — 44% worse than Vegas (~9pt). Spread predictions are noise inside this error band.
- **17.6% catastrophic misses** (margin err > 20pt). Worst: NYK-ATL G6 predicted +6, actual +51.
- **G6 broken:** 50% winner accuracy, 19.8pt MAE. No edge in elimination games.

By game number:
| G# | n | Winner % | Margin MAE |
|---|---|---|---|
| G1 | 12 | 83% | 12.5 |
| G2-G5 | ~12 each | 58-67% | 9.4-14.6 |
| **G6** | 8 | **50%** | **19.8** |
| G7 | 3 | 67% | 13.7 |

### Player-level (the source of bleed)

Pre-fix tier biases:

| Tier | n | PTS MAE | PTS bias |
|---|---|---|---|
| **Elite (85+)** | 66 | **7.21** | **+2.63** |
| **Starter (75-84)** | 118 | **5.59** | **+2.06** |
| Rotation (65-74) | 258 | 4.97 | +0.08 (calibrated) |
| Bench (<65) | 395 | 4.69 | +0.13 (calibrated) |

**Engine projects 0 for threes / STL / BLK** across every player.

**DNPs not modeled** — 10% of player-games are DNPs but engine assumes everyone plays.

**Per-player outliers** (n≥7, bias ≥5pp pre-fix):
- Under-predicted: Cade −8.6, Tobias Harris −9.4, RJ Barrett −7.1, OG Anunoby −5.5
- Over-predicted: Duren +8.2, SGA +6.9, Ingram +8.1, Stewart +5.6

### Alt-line bright spot

Deep alt lines clear at expected rates — distribution shape is correct, only the center was off:

| Stat | Line offset | Cleared |
|---|---|---|
| PTS | proj − 5 | **70.7%** |
| REB | proj − 2 | **76.8%** |
| AST | proj − 2 | **75.3%** |

---

## Ranked recommendations (impact)

### Shipped ✓
1. **Stop authoring prop bets on stars at-the-line** — Phase 68 SKIP filter routes around this.
2. **Star-specific projection adjustment** — Phase 71b `STAR_BIAS_CONFIG` tier deltas + Phase 71c `PLAYER_BIAS_OVERRIDE` for 8 named outliers.
3. **Stop authoring spread bets** — Phase 71b downgraded all spread cells to CAUTION.
4. **Refuse bets on un-projected stats** — Phase 71b `_isUnprojectedStatPick` guard returns CAUTION for any threes/STL/BLK prop.
6. **Fix G6/elimination-game blind spot** — Phase 71b auto-caps PLACE → CAUTION on `bet.game === 6 || 7`.

### Deferred
5. **DNP modeling** — substantial work; defer until prop slate needs it. Audit found 10%, not 30%.
6. **Build threes/STL/BLK projections** — CAUTION guard prevents harm; build only if needed.
7. **Per-player calibration table** — partly shipped in Phase 71c with 8 named players. Don't expand without n≥7 evidence per player.

---

## Re-tune trigger

Re-run `node test-calibration-audit.js` after every 3 settled CF games. If any of these drift >1pp from post-fix baseline:
- Elite PTS bias > ±0.5 → consider `STAR_BIAS_CONFIG.elitePtsDelta`
- Starter PTS bias > ±0.5 → consider `STAR_BIAS_CONFIG.starterPtsDelta`
- Specific player MAE > 8pt with n≥4 → consider `PLAYER_BIAS_OVERRIDE[name]`

**Don't re-tune on a single audit run.** Want at least 5 new resolved games of out-of-sample evidence before changing constants.

---

## What NOT to do

- **Don't add more risk overlays.** Phase 68-70 routed around the broken projection layer. The fix was at the projection layer. More dashboards don't help.
- **Don't trust the Phase 68 spread ROI.** +35% on 17 bets was small-sample luck given 13pt margin MAE. Spreads are CAUTION until margin MAE drops < 10pt.
- **Don't expand `PLAYER_BIAS_OVERRIDE` without n≥7 per player.** The audit warned this is band-aid; the tier fix is structural.
- **Don't fit constants to R3 numbers until R3 finishes.** Out-of-sample evidence accumulates slowly. Patience over precision.

---

## Honest framing

The model is a Vegas-level winner-picker (66% ML accuracy) with a now-fixed star projection bias. Phase 71 took the model from "destroying capital" (Sharpe −0.28, 57% drawdown, 69% P(ruin)) to "positive risk-adjusted return" (Sharpe +0.39, 22% drawdown, 0% P(ruin)) on the same historical sample.

Whether the fixes hold on R3 out-of-sample data is the only thing that matters now. Everything else is window dressing.
