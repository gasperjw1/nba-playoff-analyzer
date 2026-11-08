# Pitched tickets — spec `pitch-2` (frozen 2026-11-08, judged from 2026-11-09)

A nightly 3-leg moneyline ticket of the market's strongest favourites, priced near tip-off. It is
labelled **safe** when every leg is a 75%+ favourite and **lean** otherwise. Recorded before the
first leg tips and graded, with a cause tagged on every lost leg so the misses teach us something.

It is frozen by committing this file unchanged, with its code (`js/season/pitch2.js`,
`SEASON_PITCH2_SPEC`), before the first night it runs, and never edited afterwards. A change becomes a new spec (`pitch-3`) with its own dates. `pitch-1`
(PITCH_SPEC.md) keeps running unchanged beside it. It never suggests a stake size, and it stays
labelled unproven until its own record says otherwise.

## Why this recipe (researched 2026-11-08)

The research covers three past regular seasons: 2023-24, 2024-25 and 2025-26. The first two were
used to explore and 2025-26 was held back to test once. The two pre-registered analyses were
committed before they were run; the exploratory tables (`research-favourites-explore.js`) were not. All prices are moneylines from ESPN's odds feed: DraftKings for 2023-24 and late 2025-26, ESPN
BET otherwise.

| Finding | Number | Source |
|---|---|---|
| Closing favourites are priced about right after the vig | every bucket from 50% to 90% is within ±3 pp of the no-vig chance; return betting each one at the close is −1% to −6% | `research-favourites.js` Q1, `research-favourites-explore.js` |
| No game situation adds anything at the close | home or road, either team on a back-to-back, rest advantage, early season: none passed (pre-registered: train \|z\| ≥ 2 and holdout the same sign) | `research-favourites.js` Q3 |
| The engine agreeing adds nothing at the close | agreeing favourites +1.2 pp (z 0.86) on the holdout; requiring the engine at 70%+ too: −5.9 units on the holdout | `research-favourites.js` Q2, explore |
| Nightly ticket of the 3 strongest favourites | 257 of 459 nights (56%) vs ~56% break-even, −0.6 units | explore |
| … on nights when all three are 75%+ ("safe") | **139 of 203 (68.5%)** vs 67.7% break-even, typical price ~+48, +2.0 units; 44% of nights (64, 68 and 71 a season); losses: 52 by one leg, 11 by two, 1 by three | explore (this spec's split) |
| … on the other nights ("lean") | 118 of 256 (46.1%) vs 46.5% break-even, ~+115, −2.6 units | same |
| Legs' chance: two ways to remove the vig | Safe-night legs won 87.4%. The proportional no-vig said 84.0%, which undersells favourites. The power method said 86.3% on train and 86.7% on the holdout, against 87.6% and 86.9% won (z 0.78, 0.09). Safe tickets hit 68–69% against a power product of 64–65% in both splits (1.1 SE combined). That is more likely luck than a bias in the shown chance, since the legs themselves matched it | explore and a check while drafting this spec |
| Power method by bucket | within 1.2 pp from 50 to 80%. At 80–90% it was 1.0 pp (train) and 3.5 pp (holdout) above the result; at 90%+ it was 3.7–5.3 pp below (97 of 98 won) | explore |
| Opening prices are less accurate | Over the 3,585 games with both prices, the close beat the open (Brier 0.197 vs 0.202; power method for both). | `research-favourites-open.js` (pre-registered); like-for-like check while re-checking this spec |
| Tickets picked at the open | Picking the safe ticket at the open: 110 of 176 (62.5%), −15.2 units at the opening price. Their opening chance said 65.2%, and the close moved against the legs (86.7% → 85.9%). | same |
| Tickets picked at the close, same games | 138 of 201 (68.7%) vs 64.9% at the close; the close had moved toward the legs (84.8% → 86.5%). | same |
| How much of the open-vs-close gap is real | Most of the 6 pp gap is noise: both tickets' own prices said about 65%, and each missed by about 1 SE in opposite directions. What is real is the direction: legs kept moving the way the line moved. | same |
| The engine against the open | Its edges beat fair a little (z 1.3–1.8) but lost money at the opening price and passed nothing. | same |
| Selection of the 75% floor | Chosen after seeing all three seasons (70/75/80% were compared in the exploratory tables), so the 2025-26 holdout no longer tests that choice; the live record is the first clean test. | `research-favourites-explore.js` |

What to expect, honestly:
- **Hit rate:** a safe ticket should hit about as often as its shown chance says, roughly 65%.
  The 68.5% observed ran 1.1 SE above the 64.7% its prices implied.
- **Returns:** the vig costs about 3 pp per ticket (fair ~65% vs break-even ~68%), so the
  expected return at the close is about −4%. The +2.0 units in the research came from that run
  above the price.
- "Safe" means a higher hit rate, not an edge. One safe ticket in three is expected to lose.

What follows from it:
- The ticket is a market recipe. The engine is shown on it, not used to pick.
- It is priced as late as possible, after the injury reports.
- It is honest about nights with no safe ticket instead of forcing one.

Limits of the evidence:
- The prices are past-season ESPN BET or DraftKings closes, and 2026-27 is a new season.
- The research engine is a simpler margin rating with no injury step (K 20, home court 2.0, −2.0
  on a back-to-back, σ 12.5; less accurate than the close: Brier 0.208 vs 0.197). The live
  engine's injury information is untested here.
- The research priced every leg at its close. The pitch prices legs when it is recorded, which can
  be hours before a late tip.

## Recipe — "favourites" ticket

- **Games:** tonight's games on the slate that have not tipped yet when the ticket is recorded, with
  a DraftKings moneyline for both sides. The book is recorded. A game priced by another book is used
  and flagged.
- **Legs:** the market's favourite in each game (a pick'em counts the home side), ranked by its
  proportional no-vig chance (strongest first; ties by the earlier tip, then the lower game id). The ticket is the top 3, one per game
  by construction. With fewer than 3 priced games the night records "no ticket".
- **Label:** **safe** if the third leg is 75%+ on the proportional no-vig chance, the floor the
  research used. Otherwise **lean**. Both are recorded and judged separately; the page leads with
  "No safe ticket tonight" on lean nights.
- **Shown chance per leg:** DraftKings' power de-vig chance (the vig comes off mostly on the
  underdog). Ticket chance = product of the three. Price = the three legs' prices multiplied (they
  are different games), unless the user enters a quote.
- **Shown, not used:**
  - the picks engine's chance for each leg;
  - whether a trust rule (AVOID or R1–R4) fires in that game;
  - each leg's open price, when the slate has one.
  These feed the cause tags and later comparisons.

## Timing (the research priced at the close)

`fetch-slate.js --record` writes tonight's ticket, priced at that moment from ESPN's pickcenter
(DraftKings) for every untipped game. An NB.AI slate's own odds are only as fresh as its last
refresh, so they are used only for a game whose pickcenter cannot be read; each leg stores which
(`priceSource`). Until its first leg tips, a later `--record`
replaces it, so running the daily script again after the late-afternoon injury report re-prices the
ticket nearer tip. The last recording before the first leg's tip is the one that counts. Earlier
versions are kept on the row (`superseded`: their legs, prices and recordedAt) so changes are
visible. A recording with the same legs and prices leaves the row unchanged. A quote entered for
the old legs is not carried to new ones (kept as `quotePrev`). Once a leg has tipped, the ticket is
never rewritten. Each leg stores its minutes to tip
at recording.

Two consequences:
- **Price for units:** units are scored at the last recorded prices, so they describe a bet placed
  at that recording.
- **Early tips:** the research chose from every game of the night. A recording made after some
  games have tipped chooses only from the rest, and the row stores how many games were excluded
  that way.

## What is recorded (pitch ledger, `js/season/data/pitch-ledger.js`, rows with `spec: 'pitch-2'`)

**Per night:**
- date, spec, engine version, slate source, recordedAt;
- label (safe, lean or no ticket);
- the ticket's shown chance, the price from its legs, the user's quote if entered, and fair
  American odds.

**Per leg:**
- game, matchup, tip, side and team;
- the DraftKings price on each side and the book;
- the proportional and power no-vig chances;
- the engine's chance, any trust rule firing, and the open price if known;
- the top 5 by projected minutes for that team, as player ids. A later injury, or a starter who
  sat, can then be detected at settle.

## Grading (`--settle`)

- **Leg result:** hit or miss from the final score. A game ESPN marks postponed or cancelled is void.
- **Ticket result:**
  - win if every remaining leg hit;
  - loss if any leg missed;
  - void if every leg was void.
- **Units:** only at a known price with no void. A void reprices the ticket, which neither the
  recorded price nor a quote can show.
- **Close:** each leg's closing price from the game ledger (same book only), so the pitch price can
  be placed against the close.

### Cause tag on every lost leg (the learning loop)

Every tag that applies is stored. They are computed at settle from data already collected, with no
judgement. A tag that cannot be computed (no same-book close, no box score, no engine chance) is
listed as unknown on the leg rather than counted as absent:

| Tag | Rule |
|---|---|
| `news` | the leg's closing power chance (same book) is 5+ pp below its power chance at pitch time (the market learned something after the pitch); left unset when there is no same-book close |
| `starter-out` | one of the team's recorded top 5 by projected minutes did not play (box score; matched by id, else by a unique name; a player missing from the box counts as not playing, as in `pitch-1`) |
| `engine-against` | the engine had this side below 50% at pitch time |
| `trust-flag` | a trust rule fired in this game at pitch time |
| `close-loss` | lost by 1–5 points (variance) |
| `beaten` | lost by 6+ |

Hit legs get the same tags too, so every tag's loss rate can be compared with its hit rate. A tag
becomes a filter only through a new spec, after it is measured against hits.

## How it is judged

- **Calibration:** legs' hit rate vs the shown (power) chance, per label, with its z.
  - First look: whether the safe legs land within ±5 pp of the shown chance over 60+ legs (about
    20 safe nights, roughly 6–7 weeks at 44% of nights). That is only a sanity bound: at 60 legs
    one standard error is about 4 pp.
  - "Calibrated" also needs |z| < 2 at 150+ legs.
- **Tickets:**
  - safe tickets' hit rate vs their shown chance (expected about 65%);
  - the research's 68.5% for reference only;
  - lean tickets reported separately.
- **Ticket counts** leave out a ticket with a void leg: its shown chance was for three legs. It is
  counted separately.
- **Value:**
  - units at recorded prices;
  - each leg's pitch price vs the close;
  - no recipe is called profitable on fewer than 30 priced tickets per label.
- **Comparison:** against `pitch-1`'s tickets and the user's own tickets on the same nights.
- **Where:** the Pitch tab, above `pitch-1`, and the `pitch fav-safe` / `pitch fav-lean` lines of
  `--settle`. Rows live in `js/season/data/pitch2-ledger.js`.

## Not in this spec (open questions)

- A safe floor other than 75%. The 80% floor hit 76 of 100 but on only 22% of nights; that's
  unmeasured beyond the research.
- Same-game parlays, and spreads or alternate lines. Safer legs on nights without three 75%
  favourites would need alternate spreads, which have no price data yet.
- Using the engine or tags to drop legs. That only happens through a new spec, once the tags are
  measured.
- Prices: DraftKings via ESPN's pickcenter at record time, the same feed as the game ledger. A
  paid odds feed is still tabled (TODO.md).
