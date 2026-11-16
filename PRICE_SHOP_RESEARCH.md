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
