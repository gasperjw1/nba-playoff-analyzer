# R1 Backtest Report — 2026 NBA Playoffs

## Executive Summary
**Overall Record: 28/48 (58%) correct winner picks** across all 8 R1 series.
Average margin error: 9.6 points per game.

Including R2 G1 results: **29/50 (58%)** overall.

## Key Findings

### 1. The Model Gets Better as Series Progress
- **Early games (G1-3): 50% accuracy** — effectively a coin flip
- **Late games (G4-7): 67% accuracy** — significantly better
- **Game 4 was our best: 88% (7/8)**

This makes sense: early in a series, the model lacks game-specific context (coaching adjustments, matchup data, shooting variance). By G4+, the model has integrated prior-game lessons, fatigue data, and injury updates.

### 2. When We're Wrong, We Usually Knew It Was Close
- Of 20 wrong predictions, **13 (65%) had predicted margins ≤ 5 points** — meaning the model correctly flagged these as toss-ups
- Only **5 confident wrong picks (margin ≥ 8)**: DEN-MIN G3 & G6, HOU-LAL G1, NYK-ATL G2, SAS-POR G2
- The model's calibration is reasonable — it's not confidently wrong very often

### 3. Series-Level Accuracy Varies Widely
| Series | Record | Accuracy | Avg Margin Error |
|--------|--------|----------|-----------------|
| OKC-PHX | 4/4 | 100% | 6.0 |
| DET-ORL | 5/7 | 71% | 10.4 |
| CLE-TOR | 5/7 | 71% | 5.1 |
| SAS-POR | 3/5 | 60% | 10.6 |
| DEN-MIN | 3/6 | 50% | 7.7 |
| NYK-ATL | 3/6 | 50% | 17.3 |
| BOS-PHI | 3/7 | 43% | 13.1 |
| HOU-LAL | 2/6 | 33% | 5.8 |

**Best**: OKC-PHX (perfect 4/4 — model correctly identified dominant team)
**Worst**: HOU-LAL (2/6 — model consistently favored HOU but LAL won 4 games, model had low margin error though)

### 4. Blowout Blindspot
The model consistently underestimates blowout margins. Top 5 worst margin errors were all correct-winner picks where the actual margin was 20-51 points but the model predicted 1-12:
- NYK-ATL G6: Predicted NYK by 6, actual NYK by 51 (+45 error)
- BOS-PHI G4: Predicted BOS by 3, actual BOS by 32 (+29 error)
- NYK-ATL G5: Predicted NYK by 7, actual NYK by 29 (+22 error)

The model's "regression to the mean" approach caps margins around 7-12, missing genuine talent separation in closeout and elimination games.

### 5. Home Court Prediction Bias
- Predicted home team to win: 39 times → **23 correct (59%)**
- Predicted away team to win: 9 times → **5 correct (56%)**

The model slightly overweights home court advantage. When it does predict away wins, it's about equally accurate.

### 6. HOU-LAL: The Model's Worst Series
Only 33% accuracy, but interestingly the **lowest average margin error (5.8pts)**. The model was consistently close on the margin but wrong on the winner — suggesting it correctly identified competitive dynamics but misassigned the favorite. Key lesson: the model underestimated LeBron's "legacy mode" motivation.

## Conclusions

### Model Strengths
1. **Dominant team identification**: Perfect on OKC-PHX, strong on DET-ORL and CLE-TOR
2. **Calibration**: When the model says it's close (margin ≤ 5), it usually is
3. **Improvement over time**: G4-7 accuracy (67%) is significantly better than G1-3 (50%)

### Model Weaknesses
1. **Blowout suppression**: Consistently underestimates margins in lopsided games
2. **Motivation/legacy factors**: Underweighted LeBron's playoff motivation, PHI's resilience
3. **Early-series uncertainty**: Too confident in G1-G3 before enough data exists
4. **Home court overweight**: Slight bias toward home teams, especially in later rounds

### Recommendations for R2+
1. Widen confidence intervals in early games of new series
2. Add a "blowout multiplier" for series with large talent gaps
3. Reduce HCA weight, especially when road team has championship DNA
4. Give more weight to prior-round momentum and form
