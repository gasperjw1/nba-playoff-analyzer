# Fade NB.AI on moderate favourites — spec `fade-1` (frozen 2026-11-09, judged from 2026-11-10)

A tracked rule, not a pick. Code: `js/season/fade.js` (`SEASON_FADE_SPEC`). Frozen by committing
this file unchanged with its code; a change becomes `fade-2`.

## Why

`research-nbai-record.js` was pre-registered (commit db14542) and run on 2026-11-09, over the 33
ledger games that carry NB.AI's chance.

- NB.AI is very compressed toward 50%: its Brier score is 0.225, against the market's 0.173.
- Every one of its 8-point-plus gaps leans toward the underdog.
- Betting the market's side in those gaps went 20/22, +4.6u at the close. But favourites beat their
  prices all season, including 16/21 on nights with no NB.AI number, so most of that is the
  favourites run.
- Found after the fact: among market favourites priced 50–70%, the favourite won 8 of 8 when NB.AI
  leaned 8+ points toward the underdog, and 5 of 11 when it didn't. The 8 favourites priced 70–80% all
  had an NB.AI gap and won 6 of 8, as their prices expected (6.0), so there the gap added nothing.

That split is tiny and was chosen after seeing it, so it's only tracked from here.

## Rule

- **NB.AI nights only:** ledger rows with NB.AI's chance (`pFriend`), the market's no-vig chance as
  recorded (`pMarket`) and both DraftKings moneylines.
- **Fade bet:** the market favourite, priced from over 50% to under 70%, when NB.AI's chance for that
  side is at least 8 points lower.
- **Control:** every other 50–70% favourite on NB.AI nights: NB.AI less than 8 points lower, or
  higher than the market.
- **Price:** the DraftKings moneyline the ledger recorded before tip, and that side's close. The stake
  is flat-1's $25 unit, the user's own.
- **Clean line:** from 2026-11-10. Earlier games are shown as "all", and they include the 19 the
  split was found on.

## Judging

- **What it has to show:** fade has to beat control as well as its price. Beating the price alone
  could just be the favourites run.
- **Same measures as flat-1:** won, break-even wins, profit, margin and z.
- **Threshold:** no group is called real under 100 settled bets or with |z| < 2. The first five NB.AI
  nights had 9 fade bets, about 2 a night. Nights recorded from ESPN have no NB.AI number and add
  none, so expect 1–2 a night: 100 settled bets is two to three months away.
- **Where it shows:** the Pitch tab, the `--record` line `Pitch fade NB.AI`, and the `--settle` line
  `fade`.
