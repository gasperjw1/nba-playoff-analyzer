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
| Traditional (3-5 leg, no floor) | 25 | 10 | 40.0% | $2500 | $-119 | -4.8% |

## Per-game results

| Game | Actual | Reliable W/L (avg $) | Traditional W/L (avg $) |
|---|---|---|---|
| NYK-CLE G1 (NYK 115-104) | NYK 115-104 | no parlay | 4/5 → +$90 (legs avg 4.0, 42% combined, +138) |
| NYK-CLE G2 (NYK 109-93) | NYK 109-93 | no parlay | 1/5 → $-52 (legs avg 4.0, 42% combined, +141) |
| OKC-SAS G1 (SAS 115-122) | SAS 115-122 | no parlay | 0/5 → $-100 (legs avg 4.0, 43% combined, +135) |
| OKC-SAS G2 (OKC 122-113) | OKC 122-113 | no parlay | 4/5 → +$90 (legs avg 4.0, 42% combined, +138) |
| OKC-SAS G3 (OKC 123-108) | OKC 123-108 | no parlay | 1/5 → $-52 (legs avg 4.0, 42% combined, +138) |

## Sample leg detail (first trial per game)

### NYK-CLE G1 (NYK 115-104)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +137, MC combined 42%) → **LOSS** $-100
  - Jarrett Allen pra over 20.5 (MC 80%) — ✓ HIT actual 22
  - OG Anunoby pra over 25.5 (MC 81%) — ✗ MISS actual 14
  - Josh Hart pra over 19.5 (MC 81%) — ✓ HIT actual 35
  - Evan Mobley reb over 6.5 (MC 81%) — ✓ HIT actual 14

### NYK-CLE G2 (NYK 109-93)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +142, MC combined 41%) → **WIN** +$142
  - Mikal Bridges pts over 10.5 (MC 80%) — ✓ HIT actual 13
  - Josh Hart pra over 18.5 (MC 80%) — ✓ HIT actual 38
  - James Harden pra over 25.5 (MC 80%) — ✓ HIT actual 28
  - Max Strus pts over 7.5 (MC 80%) — ✓ HIT actual 8

### OKC-SAS G1 (SAS 115-122)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +134, MC combined 43%) → **LOSS** $-100
  - Chet Holmgren reb over 6.5 (MC 80%) — ✓ HIT actual 8
  - Ajay Mitchell pra over 15.5 (MC 80%) — ✗ MISS actual 9
  - De'Aaron Fox pra over 23.5 (MC 81%) — ✗ MISS actual 9
  - Victor Wembanyama reb over 8.5 (MC 82%) — ✓ HIT actual 24

### OKC-SAS G2 (OKC 122-113)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +140, MC combined 41%) → **WIN** +$140
  - Ajay Mitchell pra over 14.5 (MC 80%) — ✓ HIT actual 17
  - Cason Wallace ast over 1.5 (MC 80%) — ✓ HIT actual 2
  - Stephon Castle pra over 20.5 (MC 80%) — ✓ HIT actual 37
  - Victor Wembanyama pts over 17.5 (MC 81%) — ✓ HIT actual 21

### OKC-SAS G3 (OKC 123-108)

- **reliable**: no parlay assembled
- **traditional** (legs=4, odds +141, MC combined 43%) → **LOSS** $-100
  - Isaiah Hartenstein pra over 17.5 (MC 80%) — ✗ MISS actual 16
  - Julian Champagnie pra over 12.5 (MC 80%) — ✗ MISS actual 10
  - Ajay Mitchell pra over 13.5 (MC 80%) — ✓ HIT actual 30
  - Victor Wembanyama threes over 1.5 (MC 80%) — ✗ MISS actual 1
