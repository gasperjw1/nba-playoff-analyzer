# Multi-book lines and the price check — specs `odds-2` and `shop-1` (frozen 2026-11-16)

Code: `js/season/odds.js` (`SEASON_ODDS2_SPEC`), `odds-pull.js`, `js/season/shop.js`
(`SEASON_SHOP_SPEC`). Tests: `test-odds.js` TESTS 7–9. Frozen by committing this file unchanged with
its code; a change becomes `odds-3` or `shop-2`. A tracker of prices, not a picker. Never a stake
size.

## Why

shop-1's research (PRICE_SHOP_RESEARCH.md) found three things on 2021-23 closing prices:
- **The yardstick holds:** the median no-vig price across books is calibrated (z −0.19, slope 0.97).
- **A second book helps:** taking the better of two books is worth about 1.0–1.3 points per bet.
- **Edges are rare:** a book beats the consensus by 1%+ on about 4% of its sides.

The user bets at FanDuel and DraftKings. odds-1 pulls FanDuel only.

## odds-2: what changes in the pull

- **The hour-before line call** (`h2h`, `spreads`, one slate-wide call) names ten books instead of
  one:

      fanduel, draftkings, williamhill_us (Caesars), betmgm, betrivers, espnbet (theScore Bet),
      fanatics, hardrockbet, lowvig, pinnacle

- **The cost is the same:** The Odds API docs say "Every group of 10 bookmakers is the equivalent of
  1 region" and "Bookmakers can be from any region". So the call still costs 1 credit per market,
  2 for the pair. Pinnacle is in the EU list; its odds "may incur a delay".
- **Storage:**
  - FanDuel's markets are stored exactly as before (`markets.h2h`, `markets.spreads`), so
    everything reading them is unchanged.
  - The other books go in `books[key]`: moneyline and spread by team, with the time. They're
    stored from the same reply, never overwritten, and cost nothing extra.
- **Cost guard:**
  - If a multi-book line call reports a cost above its markets × ⌈books / 10⌉, the run logs it and
    sets `multiBookOff` in the local ledger.
  - Every later run then pulls FanDuel only, until the flag is removed by hand.
  - The first real reply's `x-requests-last` is the check.
- **Unchanged:**
  - props (FanDuel only) and the once-a-day ladder pull;
  - every odds-1 guard: the 5,000-credit floor, the 10-credit cap per game, never re-requesting
    a stored market, 3 tries, the lock file;
  - the key living in `ODDS_API_KEY` only.
- **Games already priced under odds-1** keep FanDuel-only lines. Their line markets are stored, so
  they're never re-requested.

## shop-1: the price check

For each game priced under odds-2, from the stored moneylines:

- **Usable lines:** both prices are at least ±100 and the line's vig is at least 1%, as in the
  research. A book's line last updated more than 30 minutes before the pull isn't used either
  (stale prices make false edges; Pinnacle's feed "may incur a delay").
- **No-vig chance:** a book's two implied chances, normalized.
- **Consensus fair chance for a book's price:** the median no-vig chance across the *other* books
  with usable lines (leave-one-out). At least 3 other books are needed, or there's no check.
- **EV** of a side at a book: fair chance × decimal price − 1.
- **Your books:** FanDuel and DraftKings. For each side, the better of the two is the one with the
  higher EV.
- **Flag:** the better of your books has EV from +1% to +10%, judged on the unrounded EV.
  - Above +10% isn't flagged: in the research, edges that big were mostly stale or broken lines.
  - A flag shows the price, the book, the consensus and Pinnacle's no-vig chance (shown, not used).
- **Where it shows:**
  - each priced game's line in the `--odds` output;
  - the `shop-1` line in `--settle`.
  - The odds ledger stays local (The Odds API's terms on republishing are still unchecked), so
    none of this goes on the public site.

## Judged

Flagged sides, graded from the game ledger's result (by ESPN game id):

1. **Against the consensus:** wins against the summed consensus fair chances, with z. Are the
   edges real?
2. **At the price:** flat 1-unit return at the flagged price, with its standard error.
3. **Line movement:** the game ledger's closing no-vig chance for the side (DraftKings, else ESPN
   BET) minus the consensus fair chance at pull, as a mean with its standard error.

Also shown:
- **What the better of your two books saved:** mean EV against FanDuel alone, over every side with
  both prices.

**Decision at 150 flagged sides** (about two months at a few a week):
- **Retire the flag** if wins fall short of the consensus with z ≤ −2. The "edges" would be where
  the consensus was wrong, not value.
- **Otherwise keep it.** It's a price discipline, and its return can't be proven at this size:
  about ±8% at 150 bets.
