# Morning information test — spec `morning-1` (frozen 2026-11-16, judged from 2026-11-17)

A tracked test, not a model in use. It never changes the engine, our probabilities, the picks or
the tickets. Code: `js/season/morning.js` (`SEASON_MORNING_SPEC`), recorded by
`node fetch-slate.js --record` into `js/season/data/morning-ledger.js`. Frozen by committing this
file with its code before the first morning row exists. A change becomes `morning-2`.

## The question

Does our engine, run with the official injury report in the late morning, know anything about
who wins that DraftKings' price at that same moment doesn't?

The only target is winners: the win probability, scored by results. No spreads.

## Why, and what was already seen

- **Against the opening price, the engine core adds a little** (2023-24 to 2025-26, 3,568 games).
  This is the core alone: team ratings, home court and rest, with no injury information.
  - A logistic regression of results on the open and the engine's disagreement gives +0.248 ±
    0.097 (t 2.56). The best blend weight is 0.17, and the gain is small: log loss 0.5884 →
    0.5880 per game, leave one season out.
  - Much of it is in each team's first 10 games (without them, t 1.77) and in games with a rest
    adjustment.
- **It disappears as the price moves toward the close.** On prices rebuilt partway from open to
  close:

  | Price | Engine's disagreement (t) | Best weight |
  |---|---|---|
  | The open | 2.56 | 0.17 |
  | 10% of the way to the close | 1.91 | 0.11 |
  | 25% | 1.11 | 0.03 |
  | 54% | 0.17 | −0.06 |
  | The close | 0.34 | −0.04 |

- **By late morning, the price has moved about halfway.** In the 16 ledger games recorded before
  1 PM ET, the price had covered 54% of its open-to-close move. Those were feed-time prices on NB.AI
  rows, so this is approximate.
- **So the core alone would add nothing at a morning price.** The open question is whether the
  live engine changes that. It adds rosters and the official injury report as of the morning,
  which the historical core never had.
- **Seen before this spec, disclosed:** on the 91 settled ledger games (Nov 2–15), the feed-only
  engine's Brier score was 0.1710 against 0.1646 for the market price stored on the row (+0.0065 ±
  0.0084). Those prices were feed-time on NB.AI rows and record-time on ESPN rows. None of those
  games is in this test.

## What is recorded

Each morning, on the first `--record` run between **11:00 AM and 1:00 PM ET** on the game's date
(ET), one row per game that hasn't tipped. A row is written once and never replaced. Runs outside
the window write no morning rows. The window starts when `season-daily.sh` first records, and
ends early enough to stay well ahead of the 7 PM tips.

Each row stores:
- `recordedAt`, the slate's source (`nb.ai` or `espn`), the engine version;
- `ours.pReport`: the engine with the latest official injury report laid over the feed (the
  ledger's `pOursReport`), with the report's name and how many statuses it changed;
- `ours.pFeed`: the feed-only engine (the ledger's `pOurs`);
- `market`: DraftKings' moneyline from ESPN's pickcenter, fetched in the same run, with its
  no-vig home chance, the time it was fetched, and DraftKings' opening moneyline from the same
  reply.

At `--settle`, each row takes its result and DraftKings' close from the season ledger row with the
same game id.

## Judged

**Sample:** rows from 2026-11-17 through the last day of the regular season with a result, a
DraftKings morning moneyline for both teams, and an engine number, where `recordedAt` is inside
the window and before tip. `seasonMorningRecord` counts every row; the final read keeps
regular-season dates only.

**Our number:** `ours.pReport`, or `ours.pFeed` on mornings the report couldn't be read. This is
counted and reported.

**The test:** a logistic regression of the home team winning (1/0) on
- an intercept;
- Lm = logit(the morning market's no-vig home chance);
- D = logit(our number) − Lm, the engine's disagreement with the morning price.

Probabilities are clipped to 1–99% before the logit. Standard errors come from the fitted
information matrix (one row per game).

The coefficient on D is the result:
- **0:** our number adds nothing to the morning price.
- **Above 0:** where we disagree with the price, results lean our way.

**Retire check at 300 games:** retire if the coefficient on D is ≤ 0.

**Final read at the end of the regular season:**
- **Holds:** coefficient on D > 0 with t ≥ 2. Then `morning-2` freezes the fitted model from
  this sample, logit P = a + b1·Lm + b2·D. That's a scale b1 and a weight b2 / b1 on our number,
  since the market's coefficient needn't be 1. It is judged on later games only. Nothing becomes
  our headline number before that holds.
- **Otherwise it doesn't hold.** A positive coefficient with t below 2 is reported as such.

**Described, not decided:**
- Brier and log loss of the morning market, our number, the feed-only number and the close, on the
  same rows;
- the same test with the feed-only number;
- how far the price had moved by the morning: the share of DraftKings' open-to-close move done at
  record time;
- the counts left out (no market, no engine number, no result, outside the window).

## Checked before the freeze (no morning row exists yet)

- **The regression code** (`seasonMorningRecord`) run on the historical opening-line sample
  reproduces the Python fit exactly. The disagreement is 0.2482 ± 0.0971 and the market's
  coefficient 1.108 ± 0.049, so the implied weight b2 / b1 is 0.22. The 0.17 above is the
  log-loss-optimal weight with the market's coefficient held at 1. The 1–99% clip touches none of
  those games.
- **Synthetic data:** on 3,000 games built with a true coefficient of 0.5, the fit recovers it
  within its standard error and solves the score equations. On games built with no information,
  t is near 0 (`test-season.js`, TEST 39).
- **A dry run on the Nov 16 slate** at a simulated 11:30 AM wrote 8 rows to a scratch file. Each
  had both of our numbers, the report's name, and DraftKings' current and opening prices. At the
  real (evening) time, it wrote none.
- **DraftKings' open** from ESPN's pickcenter matches its open in ESPN's odds service in 91 of 91
  ledger games.
- **The season ledger's own market price** comes from the NB.AI feed on NB.AI rows. That's why
  this test fetches its price at record time.

## Power

- **About 7–8 games a night.** A morning row every day from Nov 17 to mid-April would be about
  1,000 games. Missed mornings lower that.
- **The coefficient's standard error** scales from the historical 0.097 at 3,568 games: about 0.33
  at 300 games and 0.18 at 1,000.
- **To reach t 2 at 1,000 games,** the coefficient has to be about 0.37 or more. That's larger
  than the engine core showed even against the open (0.25). So the season can confirm a clearly
  useful engine, but a miss won't show there's nothing there.

## Rules

- Never a bet on it, never a stake size.
- The morning row only adds a fetch of ESPN's pickcenter per game. It's free, and it spends no
  Odds API credits.
- A missed morning is simply missing. It's never backfilled from a later run.
