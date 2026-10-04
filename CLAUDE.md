# Grid Runner

(Formerly Druglane / Pit Lane Dealer. Save keys keep the old `druglane_` prefix on purpose so existing saves still load.)

A single-file browser game: motorsport parts trading (Drug Wars style arbitrage) plus
team and race management (Motorsport Manager style). No build step, no dependencies.

## Files

| Path | What it is |
|---|---|
| `index.html` | Base game. Everything in one file: `<style>`, markup, `<script>`. ~1,200 lines. |
| `index_v2.html` | Same game plus 11 optional rule modules the player can toggle. Frozen; fixes only. |
| `index_v3.html` | v2 reworked plus 5 new rules, Sprint mode, achievements. Frozen; fixes only. |
| `index_v4.html` | v3 plus race breakdown, pre-race checklist, return trip and 6 rules (`cover`, `route`, `nemesis`, `news`, `bulk`, `dev`), 40 parts, weekly stock, black market, Rules & guide. Frozen; fixes only. |
| `index_v5.html` | v4 plus the animated skin (FX), synthesised sound, race sequence, and serverless online multiplayer (NET). **Primary file** — new work goes here. Own autosave `druglane_save_v5`; a v4 autosave carries over once. |
| `README.md` | Player-facing documentation. Keep in sync when rules or numbers change. |
| `assets/vectors/` | Illustrations (jpg/png). Loaded by file name; missing files hide themselves. |
| `logo-*.svg`, `favicon.svg` | Brand: `logo-full` (dark) / `logo-full-light` lockups, `logo-mark` (boxed) / `logo-mark-transparent` (header + title screen), favicon. Colours `#0D0E10`, `#8A8F98`, `#FF5C1A`. |
| `bot.js` | Headless balance simulator — loads the game's own `<script>` and plays it with a bot. |
| `run.js` | CLI for the simulator. |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installable app (PWA) for Android and desktop: manifest, offline service worker, app icons (`node tools/build-icons.js`). |

Run the game by opening the HTML file in a browser, or `python -m http.server 8000`.

## Architecture

Everything lives in the one `<script>` block, in this order:

1. `V_ICONS` / `partSvg()` — inline SVG icon registry.
2. Data tables — `PARTS` (18; v4 has 40 legal, 5 per category, plus `grey_aero`), `CITIES` (16), `RACES` (32), `LENDERS`, `EVT_TEMPLATES`,
   `DISC` (per-discipline race weighting), `SLOT` (one part per slot), `CFG` (balance constants),
   and in v2: `FEATS`, `DIFF`, `PERKS`, `HQB`, `STAFF`, `DRIVERS`, `TRAITS`, `DISASTERS`;
   in v3 also `TIERS`, `CALLS`, `ACH`; in v4 also `NEM_DISC`, `STORIES`, and `DISASTERS` entries carry
   a weight `w()` and an `ins` (insurable) flag.
3. `G` — the entire game state, one global object.
4. Pure helpers — `carStats()`, `perfScore()`, `getPrice()`, `getSell()`, `wcap()`, `titleNeed()`.
5. Actions — `buyPart`, `sellWh`, `sellQty`, `sellStack`, `installPart`, `travelTo`,
   `enterRace`, `repairPart`, `upgradePart`, `takeLoan`, `endWeek`.
6. UI — `openModal`, `toast`, then one `renderX()` per tab, dispatched by `render()`.
7. Init at the bottom: `loadGame()` or `beginGame()`, then `render()`.

### Conventions

- **Vanilla JS, no modules.** Functions are global and called from inline `onclick` in
  template strings. Keep it that way: `type="module"` breaks `file://` loading, which is
  how players open the game.
- **Rendering is full-redraw.** Each `renderX()` rebuilds its tab's `innerHTML` from `G`.
  No virtual DOM, no partial updates. `render()` also auto-saves.
- **State goes in `G`, nowhere else.** Anything not in `G` is lost on save/load.
  Adding a field means adding it to `PERS` too (the per-player key list used by leagues).
- **Balance numbers go in `CFG`** or the data tables, never inline in logic.
- **Optional rules are gated by `F('name')`** in `index_v2.html`/`index_v3.html`/`index_v4.html` and listed in `FEATS`.
  A new rule must work with the flag off.
- **Pop-ups the player must answer** (customs, ambush, v3 race calls) go through
  `showForced(f)`: `f` is plain data stored in `G.forced`, so a reload reopens the pop-up.
- **v4 world state**: `G.sat` (route fatigue per hub and category) and `G.news` are shared by a league, so they
  are not in `PERS`; `prev`, `ins`, `dev`, `devB`, `goal` are per player and are.
- **v4 market stock**: `G.stock[city][part]` = units left this week, rerolled by `rollStock()` in `worldWeek()`
  (`CFG.stockChance` per part, at least one per category, units from `CFG.stockQty` by price tier). `stocked()` = listed this week,
  `stockQty()`/`inStock()` = units left. `G.bmStock[city][part]` is the black market's (grey hubs only, every legal part, `CFG.bmQty` of the units).
  Both are shared world state, so not in `PERS`. Selling is allowed anywhere. The bot filters and clamps its buys with `a.inStock`/`a.stockQty`/`a.bmQty`.
- **v4 black market**: `buyBM()` makes items with `bm:1` and `cond = max` in `CFG.bmCond..bmCondMax`. `hot(item)` = grey or bm.
  Every sale path (`sellWh`, `sellQty`, `sellStack`, `sellAllProfit`, `deliverContract`) must call `bmSale(items)`; `enterRace()` rolls `bmDsq()`.
- **v4 part order**: lists use `partOrder` / `itemOrder` (category order `CATS`, then local price). New part lists should too.
- **v4 Rules & guide**: `showGuide(tab)` / `GUIDE_TXT` (near `showHowTo`). Tables are generated from the data tables; the prose quotes `CFG`
  where it can, but some mechanics are described in words — when you change a mechanic, update its guide text too.
- **v4 story events** run only in single player (`maybeStory()` after `endWeek`), through `showForced` like the others.
- **v3 removed rules** (`vault`, `logi`, `debt`) are migrated in `migrate()` when a v2 save loads.
- **v5 FX** (`FX`, `fx*()`): purely visual. Game logic stays synchronous; FX only decorate what already happened, and wrap actions
  (`showRaceResult`, `endWeek`, `travelTo`) without changing them. Everything is skipped when `FX.on` is false (the headless bot has
  no window) and when the player prefers reduced motion. Never make a game outcome wait on an animation or `setTimeout` — the bot stubs `setTimeout` out.
- **v5 race art**: cars are slices of one sprite sheet, `assets/cars.png`, with coordinates in `CAR_SHEET` (between `/*ATLAS*/` markers).
  Both are generated by `node tools/build-assets.js` from the original packs in `/cars/` and `/tracks/`, which stay local (git-ignored, licence
  terms). The builder rotates every sprite to face right — nose-down originals are listed in its `DOWN_O` / `down` entries (checked one by one:
  headlights mark the front, the small red tail lights the back) — trims it, and copies the 7 used track tiles to `assets/tracks/`.
  To add a car: add it to `MODELS` in the builder and to a `CAR_POOLS` entry by key (`o12`, `sDB9`, `fred`), then rerun the builder.
  `CAR_POOLS` maps each discipline to its models; a race only draws from its own discipline. Every race draws all models at random, the
  player's too (marked by an orange glow), plus shuffled rival names (`rivalNames`), lane order, speed curves, lights-out delay and scenery
  variants — keep races randomised. A missing sheet falls back to the drawn `carSvg()`. Car motion must stay monotonic (only forward) and cross
  the line in result order. Credits: `assets/CREDITS.md`; keep the in-game `#credit` line for the CC BY Formula cars.
- **v5 championship**: races run a grid (`rivalGrid` + `runGrid`, `CFG.grid` cars); points from `PTS` via `racePts` (drag duel `CFG.dragWinPts`/0),
  prizes via `racePrize`. AI teams score with `awardAI`; `aiRaceWeek()` (in `worldWeek`) races the AI teams that didn't race with you
  (`CFG.aiRaceChance`). Title = P1 in `standings()` (players + AI); `worldWeek` snapshots `G.final` before resetting AI points, and `seasonEnd` reads it.
  Leagues: `runLeagueGP()` runs first in the league `endWeek`; only the GP scores points (local races `champ=false`). `G.settings.win` (null = vanilla) and
  `G.settings.gp` come from the setup; `leagueWinCheck()` ends the game. Calibrated with the bot: `CFG.fieldPace` 2, 7th–8th neutral for reputation.
  Titles are now contested, so fewer promotions with the promotion ladder on: bankruptcy rose (100 weeks, Easy/Normal/Hard ≈ 48/73/81%).
- **v5 title-race options**: `G.settings.promo` (`champ` default | `top3`) and `G.settings.aiRace` (`standard` default, `CFG.aiRaceChance` | `relaxed`, `CFG.aiRaceRelaxed`), chosen in setup.
  Bot, Normal 100 weeks: default 73%, relaxed 69%, top3 76% bankrupt (top3 is harder: promotion brings faster rivals and upkeep early).
- **v5 installable app**: `manifest.webmanifest` + `sw.js` (registered only over http/https) + `icons/`. The worker fetches HTML
  network-first and art cache-first: **bump `VERSION` in sw.js whenever art, icons or its cached file list change.** Online play checks
  `NET_VER` in the hello; bump it when network messages or the shape of `G` change, so mixed versions refuse to join each other.
  The Android APK/AAB comes from PWABuilder (see README); there is no native Android project in this repo.
- **v5 avatars**: `AVATARS` (15 helmet SVGs), `avatarSvg`, `avatarImg`, `avatarPicker`; `avatar` is in `PERS`.
- **v5 stats**: `G.st` (in `PERS`, per manager) = {season, career, past[]}. Actions call the `st*()` hooks (`stBuy`, `stSale`, `stRace`,
  `stTravel`, `stCtr`, `stAdd`); `stPeak()` runs in `render()`; `stSeasonEnd()` archives a season row before `G.champ` resets. Hooks only record.
  A new sale path must call `stSale(item, price)` per unit. Device records live in `meta().rec` via `recBeat()` (saved only when beaten).
- **v5 online** (`NET`, `net*()`): WebRTC data channels, no server. Host and guest swap an invite and a reply code (deflated SDP).
  Star topology: guests talk only to the host, which relays. Turns are sequential like the hot-seat league; only the device that owns
  `G.netSeats[G.cur]` may act (`myTurn()`), and it sends the whole `G` after each render. Receivers keep their own view keys (`tab`, `fcat`, `msort`, `mdesc`).
  `G.net` / `G.netSeats` are world state, not in `PERS`. `queuePass()` refuses on a watching device. PeerJS (room codes) was considered but
  needs third-party code — the transport is isolated in `netInvite`/`netAnswer`/`netTx` if that changes.
- **CSS:** the clean-line skin is an override block at the end of `<style>`. Square corners
  (`border-radius:0`), 1px hairlines, one accent (`--accent`, signal orange), tabular numerals.
  Don't reintroduce rounded corners, glows or shadows in v1–v4. v5 layers a motion skin on top (end of `<style>`): square corners stay,
  but soft shadows, gradients, entrance animations and an accent glow on primary buttons are intended. Keep animations 100–400ms, ease-out.

## Core loop

A week gives 5 action points. Buying, selling, travelling, racing, repairing, upgrading
and borrowing each cost 1 AP. `endWeek()` charges running costs and wages, pays sponsors,
accrues loan interest, rolls disasters, moves prices, rolls weather, advances the calendar
and may end a season.

- Races run every `CFG.raceEvery` (3) weeks per event, one race per week, entry fee
  `CFG.raceFeePct` (6%) of the winner's prize.
- Each discipline weights Speed/Aero/finish-chance differently (`DISC`) and rewards specific parts.
- Market prices drift toward a per-hub base; player buys push a price up ~4% per unit,
  sells push it down ~5%.

## Simulator

The balance harness loads the real `<script>` with a stubbed DOM and plays the game.
Use it before and after any balance change.

```bash
node run.js index_v3.html 100 100 normal all greedy
#           file           runs weeks diff  rules style
```

`rules` is `none`, `all`, or a comma list (`customs,staged`). `all` sets every v2, v3 and v4 flag;
a file ignores flags it doesn't have. `style` is `greedy` or `safe`.
It reports bankruptcy rate, net worth percentiles, race/win/DNF rates, income split,
titles, AP usage, and which mechanics actually triggered (`coverage:`).

**Noise is large.** Identical configs vary by tens of thousands in median net worth at
60 runs. Use 200 runs before trusting a difference, and ignore gaps under ~50%.

### Current balance targets (100 sessions x 100 weeks)

| Config | Bankruptcy | Net worth median |
|---|---|---|
| base, easy | ~16% | ~155k |
| base, normal | ~28% | ~50k |
| base, hard | ~53% | negative |
| all rules, normal | ~50% | around breakeven |
| v3 all rules, normal | ~48% | around breakeven |
| v3 all rules, easy | ~25% | ~400k |
| v3 all rules, hard | ~75% (v2 is the same) | negative |
| v4 all rules, easy | ~28–34% | ~100k |
| v4 all rules, normal | ~60% (deliberately harder since the 40-part catalogue, weekly stock and black market) | negative |
| v4 all rules, hard | ~83% | negative |

A fail state should always be a real risk. If a change pushes normal bankruptcy below
~15% or above ~60%, it went too far. v4 sits at that ceiling by choice (the owner wants it harder):
don't tune it back down unasked, and don't push v4 normal further above ~60%.

### Known balance traps (learned the hard way)

- **Unbounded rival growth kills every long game.** Rival strength is capped at
  `CFG.rivalCap`; prizes grow `CFG.prizeGrowth` per season to compensate. Don't uncap either.
  In v3 the `tiers` rule replaces both with `TIERS` (top tier rival +18 = the cap).
- **The bot must value prizes the same way in both versions.** It uses `prizeMul()` only
  when `tiers` is on; using it always made v3 look 10 points riskier than v2 when nothing differed.
- **Measure at 100 weeks, not 50.** The 50-week numbers looked healthy while the long game
  was unwinnable.
- Flat pace bonuses with no cost (driver traits, HQ buildings) compound badly — pair any
  pace gain with a reliability or money cost.
- Grey-market parts must not face both a customs scan and a full-strength FIA check.

## Not implemented

Online multiplayer (needs a server; the league is local hot-seat only), audio, price
forecasts (v3 informants sell today's prices, not tomorrow's), rare one-off prototype parts.

## Don't

- Don't add a build step, framework, bundler or npm dependency.
- Don't split into ES modules (breaks `file://`).
- Don't use `localStorage` keys other than `CFG.saveKey`, `druglane_slot_N`, (v3) `CFG.metaKey`, and in v5 `druglane_prefs` (sound) and `druglane_net` (this device's online id)
  (`druglane_meta`: achievements and sprint scores, deliberately outside any save).
- Don't change balance constants without running the simulator before and after.
- Don't edit `README.md` into developer docs — it's for players.
