# CHS Lab Backtest — CF games (as of 2026-05-23)

**Method:** for each settled game, mask the outcome (winner/scores/boxScores), run `runMonteCarlo` + `buildReliableParlay` + `buildTraditionalParlay` 5 times at 2000 iter, score the resulting legs against the actual box score. P&L assumes $100 stake per parlay; payout uses the MC-estimated American odds (since DK actual juice isn't logged).

**Caveats:**
- MC is stochastic; 5 trials per game smooth this but don't eliminate variance.
- Engine calibration is current (Phase 71-73k). Past games are scored with today's algorithm, not the one shipped at the time.
- Sample size is small (5 games). Treat as directional, not as a calibrated EV figure.
- Payout uses estimated American odds from MC-implied probability; real DK lines may pay a few % less due to vig.

## Aggregate totals

| Tier | Trials | Wins | W% | Total stake | Net P&L | ROI |
|---|---:|---:|---:|---:|---:|---:|
| Reliable (2-3 leg, ≥80% combined) | 0 | 0 | 0.0% | $0 | +$0 | 0.0% |
| Traditional (3-5 leg, no floor) | 25 | 8 | 32.0% | $2500 | $-624 | -25.0% |

## Per-game results

| Game | Actual | Reliable W/L (avg $) | Traditional W/L (avg $) |
|---|---|---|---|
| NYK-CLE G1 (NYK 115-104) | NYK 115-104 | no parlay | 5/5 → +$138 (legs avg 4.0, 42% combined, +138) |
| NYK-CLE G2 (NYK 109-93) | NYK 109-93 | no parlay | 0/5 → $-100 (legs avg 4.0, 42% combined, +137) |
| OKC-SAS G1 (SAS 115-122) | SAS 115-122 | no parlay | 2/5 → $-7 (legs avg 4.0, 43% combined, +133) |
| OKC-SAS G2 (OKC 122-113) | OKC 122-113 | no parlay | 1/5 → $-55 (legs avg 4.0, 43% combined, +131) |
| OKC-SAS G3 (OKC 123-108) | OKC 123-108 | no parlay | 0/5 → $-100 (legs avg 4.0, 43% combined, +131) |

## Sample leg detail (first trial per game)

### NYK-CLE G1 (NYK 115-104)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +137, MC combined 42%) → **WIN** +$137
  - Jalen Brunson pra over 33.5 (MC 80%) — ✓ HIT actual 49
  - Jarrett Allen pra over 20.5 (MC 80%) — ✓ HIT actual 22
  - Evan Mobley pra over 24.5 (MC 81%) — ✓ HIT actual 31
  - Mikal Bridges pra over 18.5 (MC 81%) — ✓ HIT actual 20

### NYK-CLE G2 (NYK 109-93)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +133, MC combined 43%) → **LOSS** $-100
  - Max Strus pts over 7.5 (MC 80%) — ✓ HIT actual 8
  - Jalen Brunson pts over 21.5 (MC 81%) — ✗ MISS actual 19
  - Mikal Bridges pts over 10.5 (MC 81%) — ✓ HIT actual 13
  - James Harden pts over 13.5 (MC 82%) — ✓ HIT actual 18

### OKC-SAS G1 (SAS 115-122)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +137, MC combined 42%) → **WIN** +$137
  - Devin Vassell pts over 11.5 (MC 81%) — ✓ HIT actual 13
  - Victor Wembanyama reb over 8.5 (MC 81%) — ✓ HIT actual 24
  - Shai Gilgeous-Alexander pra over 29.5 (MC 80%) — ✓ HIT actual 40
  - Chet Holmgren reb over 6.5 (MC 80%) — ✓ HIT actual 8

### OKC-SAS G2 (OKC 122-113)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +131, MC combined 43%) → **LOSS** $-100
  - Shai Gilgeous-Alexander pts over 19.5 (MC 80%) — ✓ HIT actual 30
  - Alex Caruso pra over 8.5 (MC 80%) — ✓ HIT actual 22
  - Stephon Castle pra over 20.5 (MC 81%) — ✓ HIT actual 37
  - Victor Wembanyama threes over 1.5 (MC 83%) — ✗ MISS actual 1

### OKC-SAS G3 (OKC 123-108)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +134, MC combined 43%) → **LOSS** $-100
  - Chet Holmgren pts over 11.5 (MC 80%) — ✗ MISS actual 8
  - Stephon Castle ast over 2.5 (MC 81%) — ✓ HIT actual 6
  - Shai Gilgeous-Alexander pts over 17.5 (MC 81%) — ✓ HIT actual 26
  - Victor Wembanyama pra over 28.5 (MC 82%) — ✓ HIT actual 33
