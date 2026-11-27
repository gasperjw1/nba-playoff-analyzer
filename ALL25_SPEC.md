# all25-1: $25 on every parlay and leg we pitched (frozen 2026-11-27)

The user's ask: track every parlay and leg the pitch rules have produced, and what the profit would be
with $25 on each, from the first night bets were generated. It's an accounting view of tickets that
already exist, not a new strategy, and nothing is recommended from it. This file is never edited; a
change is `all25-2`.

## What counts

**From the first pitched night, 2026-11-08.**

**Parlays ($25 each):**
- pitch-1 floor and edge tickets;
- pitch-2 favourites tickets, including the Nov 8 ticket from before pitch-2's own record started;
- pitch-3 pairs, from pitch-3's first night (2026-11-16).

**Legs ($25 each, as straight bets):**
- every distinct leg of those parlays, plus pitch-3's straights;
- one bet per distinct leg a night:
  - (game, side) for moneylines;
  - (player, stat, line) for props.
- A pitch-3 pair's legs are already pitch-3 straights, so they aren't counted twice.

**Left out:**
- flat-1 and fade-1. They're benchmarks with their own $25 records, and adding them would count most
  favourites twice.
- The user's own legs.

## Prices

**The price each ledger recorded:**
- DraftKings (via ESPN) at record time on recorded nights;
- DraftKings' close on backfilled nights;
- for parlays, the ticket's recorded price, the product of its legs' prices.

**Profit:** $25 × (decimal − 1) on a win, −$25 on a loss.

**Floor tickets and prop legs have no recorded price.** FanDuel's alternate PRA ladder doesn't reach
our floor lines: 4 of 48 legs had an exact line, and no ticket had all three.
- They're shown as won/lost, plus their profit **at our own fair price**, for reference only.
- They never enter the dollar totals. A real book would pay less than our fair price by its margin.

**Void:** a void leg or ticket returns the stake and isn't counted.

## Nights

- **Recorded nights** come from the pitch ledgers and the season ledger. They make up the total.
- **Backfilled nights** (`season-backfill.js`, Nov 19–25) are shown on their own line and never added
  to the total, the same as everywhere else on the site.

## Shown

- On the Pitch tab and in `--settle`:
  - parlays and legs, by recipe;
  - bets, won, staked, profit and ROI;
  - the unpriced floor line;
  - each night with the running profit.
- The tracker never gives a stake size and isn't a recommendation.
