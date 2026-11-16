# Price shopping on past seasons — research `shop-1` (pre-registered 2026-11-15)

Written and committed before any result is compared with a consensus price. Code:
`research-price-shop.js`, written after this commit.

## Why

Three studies (engine-close-1, engine-close-2 and injury-close-1) found no part of the engine beats
the closing line. The remaining lever is the price. The user can bet at FanDuel and DraftKings. The
question is whether the multi-book consensus is a sound yardstick for "a good price", and what taking
the better price is worth.

## Data

- **Games:** 2021-22 and 2022-23 regular seasons. ESPN's core odds list about 12 books a game
  (`.cache/espn-nba/old`, fetched for situ-1).
- **Prices:** the listed moneylines. In 2023-24, where ESPN has both a listed and a close field,
  each book's listed line equalled its close in 96–99% of games (DraftKings 99.1%, Caesars 99.0%,
  Unibet 96.2%, BetRivers/SugarHouse 95.9%). So these are effectively closing prices. FanDuel isn't
  in ESPN's data; DraftKings stands in for "your book".
- **Books, as distinct pricing sources:**
  - **One Caesars:** the Caesars Sportsbook state versions (New Jersey, Colorado, Pennsylvania,
    Tennessee and unlabelled) post identical prices up to 88% of the time. They count once, using
    the first listed.
  - **One Titanbets:** Titanbets and Holland Casino (86% identical) count once.
  - **Kept:** DraftKings, Caesars, Titanbets, Unibet, SugarHouse (BetRivers), PointsBet,
    BetfairSportsbook, Westgate.
  - **Excluded:**
    - BetMGM: 724 of its 2,457 lines have zero vig (−120/+120), which no book posts, so they
      aren't bettable prices;
    - "ESPN BET": the label predates the book's launch in November 2023, so its source is unclear;
    - live lines, consensus and tipster sites.
  - **A book's line in a game is used only if** both prices are at least ±100 and its vig is at
    least 1%.
- **Games kept:** DraftKings plus at least 3 other books.
  - The coverage check found 2,461 games, median 7 distinct books.
- **No-vig chance:** each book's implied chances normalized to sum to 1.
- **Consensus fair chance:**
  - **For the yardstick test:** the median no-vig chance across the game's books.
  - **For valuing a book's price:** the median across the *other* books (leave-one-out), so a
    price isn't judged against itself.
- **Expected value (EV)** of betting a side at a book: fair chance × decimal price − 1.

**Before this file, prices only** (no results looked at):
- 180 of 4,922 DraftKings sides had EV ≥ +1% against the leave-one-out consensus.
- Mean EV per side:

  | Where each side is bet | Mean EV |
  |---|---|
  | DraftKings alone | −3.75% |
  | better of DraftKings and one other book, averaged over the others | −2.67% |
  | best of all books | −0.64% |

- 866 sides had a best price at EV ≥ +1%.

## Questions

**P1. Is the consensus a sound yardstick? (the one decision)**

Over every game's home side:
- (a) wins against the summed consensus fair chances, as z;
- (b) the calibration slope: a logistic regression of the result on logit(consensus fair).

**Valid if** |z| < 2 and the slope is within 2 standard errors of 1. If it isn't valid, the EV
numbers below (and any live tracker built on them) measure nothing.

**Described, not decided:**
- **P2. DraftKings sides at EV ≥ +1%** against the leave-one-out consensus (about 180 bets):
  - wins against consensus-expected wins (z): are those edges real, or did the consensus miss
    something?
  - return at DraftKings' price, with its standard error.
  - **Power is low:** at about 180 bets, the standard error of the return is about ±7–8%. Only a
    shortfall against the consensus would be informative.
- **P3. The best price across books at EV ≥ +1%** (about 866 bets): the same measures.
- **P4. What shopping is worth, as arithmetic:**
  - mean EV for DraftKings alone, the better of DraftKings and each other book, and the best of
    all;
  - split by favourite and underdog;
  - realized return for "always bet the home side" at DraftKings against at the best of the two
    books, as an illustration only.
- **Also:** the Brier score of the consensus against DraftKings' own no-vig chance; P1 by season;
  P1 by price band (favourites over 70%, 50–70%, underdogs).

## What the answers mean

- **P1 valid:**
  - The multi-book consensus is a fair yardstick, so a FanDuel or DraftKings price that beats it is
    positive expected value by construction.
  - Taking the better of the user's two books is worth about the P4 difference on every bet. That
    shortens the losses; it doesn't turn a losing rule into a winning one by itself.
  - Next step: a live tracker (spec `shop-1`) that adds 8–9 books, Pinnacle included, to the
    hour-before FanDuel line pull. The Odds API counts up to 10 bookmakers as one region, so it's
    the same 2 credits a call.
  - The tracker would record FanDuel's and DraftKings' EV against the consensus on every side. It
    would be judged by line movement to the closing consensus and by results.
  - Real pulls only when the user asks.
- **P1 not valid:** the median of these books isn't a fair price. A sharper anchor (Pinnacle alone)
  would need its own test, live.
- **P2 or P3 well below consensus expectations:** the "beats the consensus" sides are where the
  consensus was wrong. Those prices are traps, not value.

## Results (run 2026-11-15, after the pre-registration commit a37200e)

`node research-price-shop.js`: 2,461 games (one left out with no DraftKings line), median 7 distinct
books.

**Checked:**
- The logistic solver recovers known coefficients (0.202 and 0.805 against 0.2 and 0.8).
- The win-record and return functions match hand calculations.
- An independent recompute from the raw files matches P1 (z −0.19) and the P4 arithmetic exactly.

**P1. The yardstick (the decision): VALID.**

| | Home sides | Won | Consensus expected | z | Calibration slope |
|---|---|---|---|---|---|
| all | 2,461 | 1,384 | 1,388.4 | −0.19 | 0.968 ± 0.057 |
| 2021-22 | 1,230 | 670 | 694.9 | −1.56 | 1.016 ± 0.079 |
| 2022-23 | 1,231 | 714 | 693.5 | +1.26 | 0.914 ± 0.083 |
| home over 70% | 664 | 510 | 523.8 | −1.33 | |
| home 50–70% | 916 | 564 | 550.0 | +0.95 | |
| home under 50% | 881 | 310 | 314.6 | −0.33 | |

Brier: consensus 0.2126, DraftKings' own no-vig 0.2128. The consensus is calibrated, but no sharper
than DraftKings alone.

**P2. DraftKings sides that beat the consensus (described):**

| | Bets | Won | Consensus expected | z | Mean EV | Return |
|---|---|---|---|---|---|---|
| EV ≥ +1% | 180 | 42 | 45.5 | −0.62 | +4.0% | −5.4% ± 14.8% |
| EV > 0 | 278 | 78 | 78.0 | 0.00 | +2.8% | −0.6% ± 11.1% |

They won about as the consensus expected, so no sign the edges are illusory. They're far too few to
show profit (±15%).

**P3. The best price across books at EV ≥ +1% (described):**
- **1,016 bets:** won 382 against 392.0 expected (z −0.72), mean EV +6.1%, return **+5.0% ± 5.6%**.
- **Caesars** supplied 432 of them.
- **Stale or broken lines inflate the biggest "edges".** For example:
  - PointsBet +260 when every other book was +100 to +118 (CHI at DAL, 2023-04-07);
  - Titanbets +110 when the rest were −155 to −255 (GS at SA, 2022-02-01).

  106 book-sides showed edges over 15%. Prices like these are usually unavailable, limited or voided.
- **With edges over 10% dropped** (a check chosen after seeing the data): 872 bets, mean EV +3.8%,
  return +3.8% ± 6.2%, z −0.56 against the consensus. The return matches the edge, but can't be
  shown on this sample.

**P4. What shopping is worth: mean EV per side against the leave-one-out consensus:**

| | DraftKings alone | Better of DraftKings and one other | Best of all |
|---|---|---|---|
| all sides | −3.75% | −2.47% | −0.24% |
| favourites | −3.91% | −3.04% | −0.90% |
| underdogs | −3.60% | −1.91% | +0.41% |

- **The better of DraftKings and each book:**

  | Second book | Mean EV |
  |---|---|
  | Caesars | **−1.75%** |
  | Westgate | −2.33% |
  | SugarHouse | −2.47% |
  | Unibet | −2.52% |
  | PointsBet | −2.52% |
  | Titanbets | −2.79% |
  | BetfairSportsbook | −2.87% |

- **Without stale outliers** (Caesars edges over 10% ignored), the better of DraftKings and Caesars
  is −2.16% mean and −2.73% median, against −3.75% and −3.87% for DraftKings alone.
- **Illustration**, every home side: at DraftKings −3.9% ± 2.0%; at the better of DraftKings and
  Caesars −2.2% ± 2.1%.

## Conclusion

- **The multi-book consensus is a fair price.** It's calibrated across price bands and both seasons,
  so it's a sound yardstick for judging a FanDuel or DraftKings price, live.
- **Taking the better of two books is worth about 1–1.6 points per bet.** Typical cost per bet
  falls from about −3.8% to about −2.2 to −2.7%. That makes losses smaller, not profits: picking
  sides at random still loses after the vig.
- **Positive expected value needs a filter:** bet only when one of your books beats the consensus.
  - That happened on about 3.7% of DraftKings sides (+1% or more), averaging about +3–4%.
  - With two books, expect a few such bets a week.
  - Results can't prove an edge that small for years (about ±15% on 180 bets), so line movement
    to the closing consensus is the realistic live judge.
- **The very largest "edges" are stale or broken lines.** A live rule should ignore them.

## Second round of checks (2026-11-15, after the results)

Run at the user's ask. One conclusion is corrected.

- **One game hand-checked end to end** (Christmas 2022, PHI at NY, a real 119–112 Philadelphia win):
  - **Exclusions:** BetMGM, the Caesars live line, Westgate's empty line and the tipster sites.
  - **Groups:** Caesars uses its first-listed version; Holland Casino stands for Titanbets.
  - **DraftKings:** +110/−130, 4.14% vig, no-vig home chance 0.4573.
  - **The others:** six books' no-vig chances (0.4509–0.4675), median 0.4574.
  - **EV:** −3.94% by hand, the same as the script.
- **Sensitivity to the data rules:**

  | Rule changed | P1 z | Slope | DraftKings alone | Better of DraftKings and Caesars |
  |---|---|---|---|---|
  | none (pre-registered) | −0.19 | 0.968 | −3.75% | −1.75% |
  | Caesars = New Jersey version | −0.19 | 0.966 | −3.78% | **−2.75%** |
  | Caesars = Colorado version | −0.19 | 0.966 | −3.78% | **−2.52%** |
  | no minimum vig / 2% minimum | −0.19 | 0.968 | −3.75% | −1.75% |
  | BetMGM added (lines with vig ≥ 1%) | −0.19 | 0.967 | −3.73% | −1.74% |
  | at least 5 other books (2,432 games) | −0.25 | 0.968 | −3.75% | −1.75% |

  P1 and DraftKings' own cost don't move. **The Caesars two-book figure depends on which Caesars
  feed stands for the book:** 2.0 points from the unlabelled feed, but 1.0 (New Jersey) and 1.3
  (Colorado) from the state books.
- **The counts reconcile:** the pre-file coverage figures (866 best-price sides, −0.64%) used a fair
  price that included the book itself. The scored run's leave-one-out rule (as pre-registered) gives
  1,016 and −0.24%. Both reproduce exactly.

**Corrected conclusion:**
- A second book is worth about **1.0–1.3 points per bet**, not 1–1.6.
  - The average over all second books is −2.47% against −3.75%, a gain of 1.3 points.
  - The 2-point Caesars figure came partly from one unlabelled feed.
- FanDuel isn't in this data, so the across-books average is the best estimate for it.
- Everything else stands:
  - the consensus is a calibrated yardstick;
  - positive-value sides are about 4% of a book's sides;
  - the biggest "edges" are stale lines.
