# shop-2: the price tracker for our tickets (frozen 2026-11-26)

Written and committed before any past price from other books is pulled. Never edited. A change is a
new version (`shop-3`).

## Why

The user's playoff approach was to compare prices between books and judge each bet's risk against
its price, and it worked reasonably well. `PRICE_SHOP_RESEARCH.md` found:
- the median no-vig price across books is calibrated;
- taking the better of two books saves about 1.0–1.3 pts a bet;
- about 4% of sides are priced above fair somewhere.

shop-1 flags those sides. shop-2 aims the same check at **our own tickets**:
- for each leg, which of the user's books (FanDuel, DraftKings) pays more;
- whether the leg or ticket is priced so far below fair that it should be skipped;
- the +EV sides the tracker would take on its own.

It's a tracker of prices, not a picker, and it never sizes a stake.

## Prices

**Books:** odds-2's ten:
- FanDuel, DraftKings, Caesars, BetMGM, BetRivers, theScore, Fanatics, Hard Rock, LowVig;
- Pinnacle.

**A usable line** (shop-1's rules):
- both moneylines at least ±100;
- a hold of at least 1%;
- the book updated within 30 minutes of the snapshot or pull.

**The fair chance for a game,** in order:
1. **Pinnacle's no-vig chance,** power method, when its line is usable. Pinnacle takes sharp action
   and moves first.
2. **Otherwise,** the median power no-vig chance across the usable books other than FanDuel and
   DraftKings, at least 3 of them.
3. **Otherwise,** no fair chance, and the leg isn't checked.

The power method is used because the proportional one undersells favourites (`PITCH2_SPEC.md`), and
most of our legs are favourites.

**The tracker's price for a side:** the better (higher decimal) of FanDuel's and DraftKings' usable
prices. A tie goes to FanDuel.

**EV** = fair chance × decimal price − 1.

## The rules

**Straight bets** (flat-1, pitch-3 straights, fade-1's fade side):
- **Best price:** bet the side at the tracker's price.
- **Skip:** if EV < −4% at that price. A typical US moneyline costs about −2.5% a side, so −4% means
  paying close to the whole two-sided hold on one side.

**Parlays** (pitch-1 edge, pitch-2 favourites, pitch-3 pairs):
- A parlay is placed at one book, so it goes to whichever of FanDuel and DraftKings has the larger
  product of leg decimals, among books that price every leg.
- **Ticket EV** = Π fair chances × Π decimals − 1. The legs are in different games and treated as
  independent, as in the pitch specs.
- **Skip:** if ticket EV < −4% × the number of legs.

**The tracker's own picks:** every side on that night's ledger with EV from +1% to +10% at the
tracker's price (shop-1's flag band; bigger "edges" were mostly stale lines).

## The backfill (Nov 8–25, the 16 nights with tickets)

**Prices:** The Odds API's historical moneylines (h2h) for the ten books.
- Two snapshots a night, at 10 credits each: 32 snapshots, 320 credits, approved by the user on
  2026-11-26.
- This one-off pull sits outside odds-1's 10-credit cap per game, which governs the nightly pulls.
  It works out to about 2.7 credits a game, and the 5,000-credit floor still holds.

**Snapshots:**
- **Bet time:**
  - recorded nights (Nov 8–18): the pitch ledger's `recordedAt`;
  - backfilled nights (Nov 19–25): the backfill's `recordedAt` (an hour before the first tip).
- **Close:** 5 minutes before the night's first tip, so every game is still pre-match.
  - Later games' "close" is up to about 3 hours early.
  - So every bet is also graded against DraftKings' real close (ESPN), as everywhere else in this
    project.
- The API returns the latest snapshot at or before the time asked.

**The bets:** exactly what each tracker counts.
- Recorded nights:
  - pitch-2 tickets;
  - pitch-1 edge tickets;
  - pitch-3's clean straights and pairs;
  - flat-1's clean ledger favourites;
  - fade-1's clean fade side.
- Backfilled nights: the rebuilt tickets in `season-backfill.js` (no fade-1 there).
- Floor tickets are left out, because no prop price was recorded. Their hit rate is shown.

**Five versions of the same nights:**

| Version | Prices |
|---|---|
| V0 recorded | the price each tracker counts (DraftKings via ESPN, or FanDuel where the ledger recorded it) |
| V1 DraftKings, same moment | DraftKings at the bet-time snapshot, the like-for-like baseline |
| V2 tracker price | the better of FanDuel and DraftKings at the snapshot |
| V3 tracker with skips | V2 without the bets the skip rule drops |
| V4 tracker's own picks | the +EV sides, at the tracker's price |

**Missing prices:**
- A bet with no usable FanDuel or DraftKings price at the snapshot keeps its recorded price in every
  version and is counted as unpriced, so the sets stay equal.
- A parlay that neither book prices in full is handled the same way.

**Reported for each tracker and in total:**
- bets, units staked, profit and ROI %;
- for V2–V4, the mean EV at bet time;
- line movement against the fair chance at the close snapshot, and against DraftKings' close (power
  no-vig).

V2 − V1 is what the better of the two books added; V3 − V1 adds the skip rule.

**What to expect, stated now:**
- V2 should beat V1 by about 1–1.3 pts a bet (shop-1's research).
- About 150 bets carry roughly ±8 pts of noise on ROI, so the money differences between versions are
  mostly luck.
- The readable numbers are the mean EV and the line movement. No version is called profitable on the
  backfill.

## Live (from the first night after this is built)

- The odds-2 hour-before line call already stores the ten books. shop-2 checks that night's tickets
  and legs at that pull, and prints them in `--odds` and `--settle`.
- It's graded like shop-1: results against the fair chances, units at the price, and line movement
  to the close. It's read at 150 bets.
- The odds ledger stays local: The Odds API's terms on republishing are unchecked. Only aggregate
  records go on the site.

---

## Backfill results (scored 2026-11-26, after the freeze; appended, method unchanged)

`node research-shop-backfill.js`.
- **The pull:** 32 snapshots, 320 credits, 16,731 left. The snapshots are local in `.odds/hist/`.
- **Checks:**
  - All 144 legs had a usable Pinnacle price. Pinnacle's line was at most 11 minutes old at any snapshot, and every matched event tipped within 20 minutes of our tip time.
  - V0 reproduces every tracker's recorded record exactly: flat-1 −11.3%, pitch-3 straights +48.7%,
    pairs +14.6%, pitch-2 +3.73u, edge +2.58u.
- Floor tickets went 13 of 16 against 11.9 shown; they're unpriced, so left out.

**ROI per 1-unit bet, by tracker:**

| Tracker | Bets | Won | V0 recorded | V1 DraftKings | V2 tracker | V3 with skips |
|---|---|---|---|---|---|---|
| pitch-2 favourites | 15 | 9 | +24.8% | +23.9% | +26.4% | +26.4% (15) |
| flat-1 favourites | 65 | 37 | −11.3% | −11.2% | −10.6% | −6.5% (52) |
| fade-1 | 8 | 4 | −21.9% | −21.6% | −21.2% | −33.1% (7) |
| pitch-3 straights | 14 | 11 | +48.7% | +45.6% | +46.0% | +20.7% (10) |
| pitch-3 pairs | 4 | 2 | +14.6% | +19.8% | +20.0% | +20.0% (4) |
| pitch-1 edge | 2 | 2 | +129.2% | +139.5% | +140.0% | +140.0% (2) |

**ROI per 1-unit bet, in total:**

| | Bets | Won | V0 recorded | V1 DraftKings | V2 tracker | V3 with skips |
|---|---|---|---|---|---|---|
| **All** | 108 | 65 | **+4.3%** (+4.59u) | +4.2% | **+5.0%** (+5.42u) | +4.4% on 90 (+3.94u) |
| Recorded nights | 60 | 35 | +1.8% | +1.6% | +2.4% | −1.9% (48) |
| Backfilled nights | 48 | 30 | +7.3% | +7.5% | +8.2% | +11.5% (42) |

**The tracker's own picks:**
- 1 side in 16 nights was +1% to +10% at FanDuel or DraftKings against Pinnacle (EV +1.1%), and it
  lost.
- With only two books, the tracker almost never finds a bet worth taking on its own. Its value is
  choosing the book.

**What the tracker changed on the same bets:**
- **Mean EV at bet time** went from −4.05% ± 0.19 (DraftKings) to −3.40% ± 0.19 (the better of the
  two books), +0.65 pts.
  - That's about half of what `PRICE_SHOP_RESEARCH.md` found ("about 1–1.6 points per bet" for DraftKings plus one other book). FanDuel and DraftKings track each other more closely than DraftKings does a random book.
  - A winning bet paid +0.0123 ± 0.0027 units more.
  - FanDuel was the better book on 70 bets, DraftKings on 38.
- **The skip rule** dropped the 18 worst-priced bets (EV −4.92% vs −3.10% for the rest).
  - They went 11 of 18 (+1.48u), so skipping cost money on results while it improved the price.
    Eighteen bets is noise.
- **Line movement** of our sides' fair chance:
  - +0.08% ± 0.26 to the close snapshot;
  - +0.35% ± 0.33 to DraftKings' close.

  No sign our bets beat the close.
- **The profit is luck, not price.**
  - At the tracker's prices and Pinnacle's fair chances, 108 bets expected −3.67u (sd 9.02u). They
    returned +5.43u (z +1.01).
  - pitch-3 straights alone ran z +2.10 (expected −0.43u, actual +6.43u).
- **The "recorded" price on backfilled nights** is DraftKings' close, which `season-backfill.js` used
  in place of a record-time price. On recorded nights it's the price actually recorded.
- **The tracker's own picks:** 224 sides were priced at bet time.
  - 1 was at +1% EV or better, and 2 at 0% or better; the median was −3.41%.
  - The research found +1% sides on about 3.7% of DraftKings sides. It used the median of the other
    books, with proportional de-vig, as the fair price, and that's noisier than Pinnacle.

**Correction, 2026-11-27 re-check.** An independent re-pricing from the raw snapshots, with new code,
agreed with the script to 4e-16 on EV. It found one bug: a snapshot holding OKC at POR twice (Nov 10
and Nov 11) left that leg unpriced. Fixing it priced the leg, which the skip rule then drops. The
numbers above are the corrected run. The first version said 143/144 legs, 17 skipped (+2.48u), V3
+3.2% on 91, FanDuel 69, and z ≈ 0.8.
