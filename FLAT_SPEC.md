# Flat moneylines — spec `flat-1` (frozen 2026-11-08, ledger line judged from 2026-11-09)

What a flat $25 straight bet on every moneyline priced above −300 would have made. It's a tracker,
not a model: nothing here picks a side, and $25 is the user's own unit, not a suggestion. Code:
`js/season/flat.js` (`SEASON_FLAT_SPEC`). Frozen by committing this file unchanged with its code;
a change becomes `flat-2`.

## Why

On 2026-11-08 the user asked what $25 on each of their moneylines above −300 would have made.
Their Nov 4–7 legs at their own FanDuel prices did well: 15 of 22 legs priced above −300 won, for
+$58.81 on $550; 13 of 16 favourites from −299 to −100 won, for +$93.81. Every group came in
within 1.2 SD of break-even. That rule was chosen after seeing those results, so they don't test it.

On three past seasons at the closing price (`research-favourites.js` dataset, 3,678 games), every
favourite from −299 to −100:

| Season | Bets | Won | Break-even | Return |
|---|---|---|---|---|
| 2023-24 | 782 | 61.1% | 63.1% | −3.0% |
| 2024-25 | 742 | 61.5% | 63.7% | −3.6% |
| 2025-26 | 735 | 60.7% | 63.4% | −4.9% |
| All | 2,259 | 61.1% | 63.4% | −3.8% (z −2.3) |

Favourites at −300 or heavier: 1,419 bets, 82.5% won against 84.7% needed, −2.7%. Closing
favourites lose about the vig. Expect a small loss unless the prices taken beat the close.

This season's replay (`research-flat-replay.js`, pre-registered, replay-9, DraftKings closes):
- **Oct 25–31:** 24 of 40 won against 25.9 needed, −$72.97 on $1,000 (−7.3%, z −0.65).
- **Every replay game (Oct 20–Nov 6):** 59 of 97 against 61.1, −$59.58 on $2,425 (−2.5%).
- **Engine filters:** requiring the engine to agree didn't help: −4.6% for the week, −4.4% for every
  replay game. The replay is a development set for the engine, so those splits are exploratory.
- **Data checks:** all 132 replay games match ESPN on final score, DraftKings close and DraftKings open.
- **Open prices:** the same rule at DraftKings' open made +0.2% (61 of 97 against 60.7 needed). That's
  noise, not evidence that early prices help. On past seasons, tickets picked at the open did worse.

Checked after the fact (`research-flat-buckets.js`, exploratory):
- **Every bucket lost on the past seasons:** underdogs −8.9%, favourites at −300 or heavier −2.7%, and
  favourite or underdog sub-bands from −1.5% to −14.7%.
- **This season's favourites at −300 or heavier have all won:** 38 of 38 through Nov 7 (replay plus
  that night's ledger). At no-vig chances that's about a 1 in 1,800 run, longer than the longest
  such run in any of the three past seasons (20, 33 and 33).
- **Past early seasons show no such pattern:** their first 18 days went 25/28, 40/51 and 36/42.
- **The user's legs:**
  - Their FanDuel price beat DraftKings' close on 19 of 28 legs (2.2 pp of implied chance on
    average; two gaps of 7–10 pp, GS Nov 5 −270 and MIN Nov 6 −122, confirmed by the user).
  - At DraftKings' close the same 28 legs made +$66.59 instead of +$83.71. So about a fifth of
    their profit came from the price, and the rest from the results.

## What is tracked

1. **Every game's favourite, −299 to −100** (+100 on an even pick'em; a pick'em counts the home
   side), one bet per game in the season ledger. It's priced at the DraftKings moneyline the ledger
   recorded before tip, and again at that side's close.
   - **Clean line:** counted from 2026-11-09.
   - **All recorded games** (from 2026-11-02): shown, but it includes the nights the rule was
     picked on.
   - **Favourites at −300 or heavier** are shown beside it for comparison.
2. **The user's own legs** (`js/season/data/user-legs.js`): one row per leg at the FanDuel price
   taken. A team on two tickets the same night is one leg.
   - Graded from the ledger by game id.
   - Shown four ways: above −300 (the rule, underdogs included), its favourites only, underdogs
     only, and −300 or heavier.
   - Rows are added by hand when the user reports a bet with its price. Results are never typed in.
3. **pitch-2's legs as straight bets**, from its first night (2026-11-09), skipping void legs.

## Measures

- **Per group:** bets won, open bets, and break-even wins (the sum of the prices' implied chances,
  vig included).
- **Money:** staked, profit and margin (profit ÷ staked).
- **Luck scale:** z = (won − break-even) ÷ SD. Inside ±2 is within luck. No group is called
  profitable on fewer than 100 settled bets, or with |z| < 2.
- **Where:**
  - the Pitch tab, between pitch-2 and pitch-1, with tonight's rule bets at the slate price;
  - `--record` prints `Pitch flat $25: …`;
  - `--settle` prints `flat favs` (the clean ledger line) and `flat yours` (the user's legs above
    −300).
