<p align="center"><img src="logo-full.svg" alt="Grid Runner — Pit Lane Trading" width="560"></p>

# 🏁 Grid Runner

> **A motorsport trading & racing strategy game.**
> Buy-low / sell-high arbitrage in the spirit of *Drug Wars*, mixed with the car-building and race management of *Motorsport Manager*.

[![Code: MIT](https://img.shields.io/badge/Code-MIT-yellow.svg)](LICENSE)
[![HTML5 / Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue)](index.html)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen)](#)

---

## 🎮 Quick Start

No installation or build step. Open [`index.html`](index.html) in a modern browser (Chrome, Edge or Firefox), or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

Keep the `assets/vectors/` folder next to `index.html` so the images load. Progress is **saved automatically** in your browser (`localStorage`); use **↺ New Game** in the sidebar to reset.

---

## 🏎️ Gameplay

You run an independent racing syndicate. Each week you have **5 Action Points (AP)**; buying, selling, travelling, repairing, borrowing and racing each cost AP. When they run out, click **END WEEK**.

### 1. Parts arbitrage
- **16 hubs**, each with its own price multipliers per category. Buy where a category is cheap, sell where it is expensive (sell price is 86% of market price, scaled by part condition).
- Prices drift randomly but **pull back toward each hub's base level**. Random events (supplier strikes, factory fires, rival teams folding, regulation changes…) temporarily shift them.
- **18 parts in 8 categories**: engines, gearboxes, aero, suspension, brakes, electronics, tyres, fuel systems. The warehouse has limited slots (grows with reputation).
- **Market impact**: every unit you buy raises that hub's price ~4% (bulk orders cost progressively more); every unit you sell lowers it ~5%. Prices recover over the following weeks.
- **Delivery contracts** (Market tab): up to 3 open offers, each asking for parts at a hub with a deadline. Delivering pays 35–60% over market price and +3 reputation (1 AP).
- Sell straight from the market table: **Sell 1** offloads your worst-condition unit, **Sell…** opens a quantity picker showing the total and profit before you commit (1 AP either way). **Sell all** also remains on warehouse stacks.
- Every market column sorts: click a heading to sort by part, category, buy price, change against base, sell price, units in stock at the hub, units in your warehouse or unrealised profit; click again to reverse it.

### 2. Building the car
- Each part adds **Speed**, **Reliability** and **Aero**, scaled by its condition. Speed and Aero above 100 count at half value (diminishing returns).
- **One part per slot**: for example one suspension and one set of tyres at a time. Uninstall the old part first.
- **Upgrade** installed parts up to Lv 3 (+10% stats per level, costs cash + 1 AP).
- **Staff**: a Mechanic (cheaper repairs, slower maximum-condition loss) and an Engineer (more pace), each with junior/senior tiers and weekly wages.
- **Repair** parts in the Garage for cash + 1 AP. Each repair lowers that part's maximum condition by 5 points (down to 40%), so old parts eventually need replacing.

### 3. Racing
- **32 races across 6 disciplines**: Formula, Endurance, Rally, Touring, Drag, GT.
- **Entry fee**: 6% of the winner's prize, plus 1 AP. **One race per week.**
- **Each discipline values different things**:

| Discipline | Speed | Aero | Finish chance | Parts that help |
|---|---|---|---|---|
| Formula | ×1.0 | ×0.6 | normal | ECU, data logger, wings, diffuser, MGU-K |
| Endurance | ×0.8 | ×0.3 | −10 | LMP fuel cell, carbon brakes, data logger, gearbox |
| Rally | ×0.8 | ×0.1 | −5 | WRC suspension (road suspension is penalised), turbo, brake ducts |
| Touring | ×0.9 | ×0.3 | +5 | Gearbox, carbon brakes, C3 tyres |
| Drag | ×1.2 | ×0.05 | +10 | Turbo, formula engine, gearbox, C3 tyres |
| GT | ×0.9 | ×0.5 | normal | Road suspension, carbon brakes, diffuser, C3 tyres |

- **Weather**: each race is rolled dry or wet when the week starts (never for drag). Wet tyres give +10 in the wet; slicks lose 12; wet tyres in the dry lose 8. The race list shows weather, your finish chance and the odds before you commit.
- Rivals get stronger every season. Low reliability means a DNF and heavy wear.

### 4. Modes, calendar & goals
- **Career**: win **2 championships** (title needs 100 points in season 1, +20 each season; a win is 25 pts). **Endless**: no finish line; pick it at the start or after finishing Career.
- **Season calendar**: a season has 30 weeks by default (configurable, or endless — then there are no seasons, no championship and no title target) and every race runs every 3rd week. Plan your travel and trade routes around race dates.
- **Drivers**: sign a driver in the Garage; skill improves pace and finish chance, wages are paid weekly.
- **Sponsors**: from reputation 55 you earn weekly sponsor money (nothing after a DNF week).

### 5. New manager, leagues & saves
- **New Manager**: choose name, team name and a **perk** (Negotiator, Hustler, Banker, Celebrity, Mechanic's kid, Lucky), plus **difficulty** (Easy/Normal/Hard), **season length** (12–60 weeks, or endless with no seasons at all) and mode.
- **Local league (hot-seat)**: up to **10 managers on one device**. Each plays their Action Points, then passes the device; the week advances automatically once everyone has used all their AP (or ended their turn). The market, events, weather and contracts are shared, so your trades affect rivals' prices. Online multiplayer needs a server and is not included.
- **Random disasters**: garage fires, tax audits, injuries, theft, recalls, sponsor scandals (and the odd windfall) strike without warning; frequency depends on difficulty.
- **Save / Load**: 3 manual slots, export/import as a `.json` file, plus automatic saving in the browser.
- **Responsive layout**: works on phones and tablets (navigation moves to the bottom).

### 6. Advanced rules (`index_v2.html` and `index_v3.html`)
`index_v2.html` adds optional rule modules. **All of them are on by default**; untick any in the New Manager screen or switch them on and off any time with **⚙ Rules**: customs scans with per-hub law and bribes, setup & race strategy, HQ buildings, logistics trucks, AI rival teams, vault, sponsor objectives, driver traits, season regulations, travel ambushes and a debt start.

### 7. Version 3 (`index_v3.html`)
The newest version. It keeps everything above and adds:

- **Title screen**: opens with a race-start lights intro (click or press any key to skip), then **Continue**, **New game**, **Load a save** and **How to play**. Return to it any time with **⏏ Title screen** in the sidebar.
- **New Manager presets**: **Full** (every rule) or **Classic** (trading and racing only), with the individual rules under *Advanced*.
- **⏱ Sprint mode**: one season, then a final score: net worth + 500 per championship point + $50,000 for the title. Your best five scores are kept on this device.
- **🏅 Achievements** carry over between games and unlock new perks: *First victory* (win a race) → **Veteran** (start with a Club Racer); *Champion* (win a title) → **Insider** (know every hub's prices at the start, half-price tips); *Tycoon* (reach $250,000 net worth) → **Heir** (+$12,000).
- **📻 Race-day calls**: every race brings one pit-wall decision (rain coming, safety car, hot brakes, a rival alongside, marginal fuel). Each choice trades pace against finish chance; with telemetry (Data Logger or Telemetry Centre) you see the odds.
- **💀 Loan-shark deadlines**: a Consortium loan must be repaid in full within 6 weeks. After that, enforcers visit every week: they take any cash you have, add a 10% late fee, then seize parts, smash the car, and finally put your driver in hospital.
- **🏆 Promotion ladder**: Club → National → International → World Championship. Win the title to move up (bigger prizes, faster rivals, higher running costs); score under 35% of the title target and you drop a tier. Replaces the automatic rise in rivals and prizes each season.
- **🕵 Price memory & informants**: the market shows the best sale price you've seen in other hubs and how old it is. Pick a category and buy a tip ($1,500, 1 AP) for today's prices everywhere.
- **✍ Driver contracts**: paid drivers sign for 12 weeks; signing costs two weeks' wages, and leaving early pays half the wages left on the contract.
- **Changes from v2**: the Vault is gone (any savings return to cash); trucks are now part of HQ and replace the warehouse extension; the debt start is now part of Hard; the Angel investors take 5% of race prizes while you owe them.

v3 keeps its own autosave, so a v2 game in progress isn't overwritten. The three save slots are shared, and older saves load into v3.

### 7b. Version 4 (`index_v4.html`)
Everything in v3, plus:

- **40 parts, 5 in every category** (plus the grey-market aero kit). New parts replace an existing slot, so a car still fits one engine, one gearbox, one set of tyres and so on. Examples: GT V8 and drag big-block engines, H-pattern, dual-clutch, rally and drag gearboxes, a ground-effect floor (diffuser slot), active and GT suspension, steel and carbon-ceramic brakes, traction and launch control (ECU slot), hard and soft tyres, gravel tyres, and methanol and endurance fuel systems. Many of them help in a specific discipline.
- **Changing stock**: each hub sells only some of the parts, rerolled every week. Every category always has at least one part on sale, and about half the catalogue is on sale in a typical hub. Parts you own still show in the market so you can sell them anywhere.
- **Limited quantities**: every store holds a limited number of each part, shown in the market's "In stock" column. Cheap parts come in larger batches (up to 8), expensive ones in ones and twos. What you buy is gone until the hub restocks next week.
- **🏴 Black market**: after your first win, grey-market hubs also run a black market with every legal part, whatever the week's stock, at about 40% under the legal price and in small quantities. The catch:
  - Copies arrive at 70–92% condition, which is also as far as they can be repaired, so they give fewer stats and sell for less.
  - Each copy fitted to the car adds an 8% chance per race of disqualification: the part is confiscated, you pay 20% of its base price as a fine, lose 10 reputation and get no prize. The pre-race checklist shows the total risk.
  - Each copy you sell or deliver risks a fine of 60% of its sale price: a 20% chance in legal hubs, 6% in grey-market hubs. A 🏴 marks copies in the market, warehouse, garage and sell window.
  - With customs inspections on, copies count as illegal cargo.
- **📖 Rules & guide** (sidebar, or *How to play* on the title screen): a full in-game manual in tabs — a step-by-step start, a glossary of terms, trading, every part with its stats and the disciplines it helps, how races are decided, every race and hub, all market events, disasters and story events, team and money, and the optional rule switches. The tables come from the game's own data, so they always match the current numbers.
- **Default order**: parts are listed by category (engines, gearboxes, aero, suspension, brakes, electronics, tyres, fuel), cheapest first within each category — in the market, black market, warehouse and garage. Click a market heading to sort differently.
- **Race breakdown**: the result screen explains the finish — car, driver and staff, part fit, tyres, setup and calls, your pace against the field, and how much luck swung it. A DNF shows the finish chance you raced with.
- **Pre-race checklist**: each race you can enter this week warns about wet races on slicks, wet tyres in the dry, a low finish chance, badly worn parts, the fee, an injured driver or no AP left.
- **↩ Return trip**: the Travel tab has a one-click button back to the hub you just left.
- **🛡 Insurance & risk report** (rule): disasters follow how you play — holding lots of cash invites a tax audit, a full warehouse invites theft, worn parts invite a recall. The Finance tab shows each disaster's weekly odds. An insurance policy ($200 + 0.4% of your parts' value per week) pays 75% of parts lost to fire, theft or recall.
- **📉 Route fatigue** (rule): every part you sell in a hub lowers that hub's price for the category (up to 30%), fading over a few weeks. Sell too much in one place and a rival team copies your route, cutting prices there by a further 20% for 4 weeks.
- **⚔ Nemesis teams** (rule): each AI team specialises in one discipline (Formula, Endurance, Rally, Touring, GT). Beat them there for +2 reputation — and they invest to hit back, making that discipline's field a little stronger (up to +3).
- **📰 Paddock news** (rule): a weekly headline, and now and then a choice: a sponsor ultimatum (podium within 3 races for a bonus, or lose reputation), a rival poaching your driver, a paid magazine feature, or a supplier selling surplus parts cheap.
- **📦 Bulk selling** (rule): sell every stack that shows a profit in this hub in one order for 2 AP. Parts an open contract wants are kept.
- **🔬 Next-season R&D** (rule): in the Garage, spend $12,000 and 1 AP (scaled by your series) for +2 pace next season, up to 4 steps. The package lasts one season, so money spent on it isn't helping this year's car.

v4 has its own autosave; save slots are shared and v3 saves load into v4.

### 7c. Version 5 (`index_v5.html`) — newest
Everything in v4, plus:

- **A livelier interface**: money counts up and down, gains and costs float up from where you clicked with a burst of coins, AP pips flash when spent, tabs slide in with their cards and rows staggered, prices flash red or green when they change, cards lift on hover, toasts slide in with a countdown bar, and badges on the Warehouse and Race tabs show what's waiting.
- **Race day**: every race plays out — five start lights, eight cars on track, the running order shuffling live, then the result with confetti for a podium. *Skip* jumps to the end.
- **New week and travel**: a full-screen "WEEK N" card with your cash and net-worth change, and a split-flap departures board when you travel. Click to dismiss.
- **Sound**: short synthesised effects (clicks, cash, start lights, wins). Switch off with **🔊 Sound** in the sidebar. All animation respects your system's *reduce motion* setting.
- **🌐 Online multiplayer**: *Host online game* on the title screen opens the same season setup as single player (mode, difficulty, season length, every rule). Invite each friend with a code over any chat app; they paste it in *Join online game* and send back a reply code. Turns run in order and everyone watches the active manager live; the bottom bar shows whose turn it is, a chat, and a skip button for the host if a player drops out. No account or server needed. Some strict office or mobile networks block direct connections.

- **Race art** (`assets/cars.png`, `assets/tracks/`): every race uses car models of its own category, drawn fresh from a pool each time — F1 cars for Formula, 4x4s, minis and liveried hatchbacks for Rally, saloons for Touring, sports and supercars for GT and Endurance, muscle cars and a hot rod for Drag. Every race is different: your car and every rival are drawn at random from the right category, the rival teams and lane order are shuffled, overtakes follow fresh speed curves, the lights go out after a random pause, and the scenery varies (endurance runs at dusk or at night). Your car glows orange. Tracks use the asphalt or dirt road tiles with grass or sand verges; endurance races run at night and snow stages are tinted white. Cars only ever move forward and cross the line in the real finishing order. If the art is missing, drawn cars stand in.

- **Real race grids and official points**: every race is a 10-car grid (you, the five AI teams, guest teams). You finish where your pace plus luck ranks you and score 25-18-15-12-10-8-6-4-2-1 for P1–P10. **Drag** races are head-to-head duels: 20 points for the win, nothing for the loss.
- **AI teams fight for the title**: they race most weeks (in your race when they are on its grid, otherwise in their own) and score the same points. The champion is whoever tops the standings at the end of the season, AI teams included.
- **Title-race options** (new-game screen, next to difficulty): *Promotion* — champion only (default) or the top 3 move up a series (faster climb, but tougher rivals and higher costs arrive sooner); *AI title rivals* — standard (default, AI teams race about one week in three) or relaxed (they race less often, so titles are easier).
- **League Grand Prix (multiplayer)**: in a hot-seat or online league, every manager races the League GP automatically at the end of each week (or every 2–3 weeks), wherever they are: free, no AP. It is the only race that scores championship points in a league; other races pay prize money.
- **League rules**: a league can use **vanilla** rules (career: first to 2 titles) or **custom** goals: titles, race wins, net worth or reputation to win (first to reach any goal wins), a game length in seasons, and how often the League GP runs.
- **15 avatars**: pick a racing-helmet avatar for each manager; it appears in the header, standings, race results, stats and the online lobby.
- **📊 Stats tab**: your numbers for *this season* and *all seasons* — peak cash and net worth, trading profit, prize money, races, wins, podiums, DNFs, win rate, best finish and trips — plus highlights (most traded part, most profitable part, best single sale, most won race, most raced event, best discipline, favourite hub, black-market buys), where your money came from and went, win rate by discipline, a season-by-season table and, in a league, the league leaders in each category. *Device records* keeps the best marks ever set on this computer across all games.
- **Random start**: every new game puts your team in a random hub (each manager in a league gets their own), so the opening prices, races and routes differ every time.

v5 has its own autosave; a v4 game in progress carries over the first time you open v5. **Keep the `assets/` folder next to `index_v5.html`** when sharing or uploading the game.

#### Art credits
The race cars are one sprite sheet made for this game (`assets/cars.png`: only the cars used, rotated and trimmed) and the track tiles are in `assets/tracks/`. Full credits and licence texts: [`assets/CREDITS.md`](assets/CREDITS.md).
- **Formula cars**: Justinas0192, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (rotated, trimmed, combined into a sprite sheet).
- **Rally, touring and GT sprites**: [Top-Down Pixel Cars 64x64](https://it2000-the-original.itch.io/pixelcars) by **it2000**.
- **Other cars**: [100+ Cars & Vehicles Pixel Art Pack](https://sevenevesai.itch.io/100-cars-vehicles-pixel-art-pack) by **Seveneves.ai**.
- **Track tiles**: [Racing Pack](https://kenney.nl/assets/racing-pack) by **Kenney** (www.kenney.nl), CC0.

The original packs are not in this repository. To rebuild the art after adding a car, put the packs in `cars/` and `tracks/` and run `node tools/build-assets.js`.

### 8. Finance & grey market
- Three lenders: **Sport Finance Corp** (0.15%/week), **Angel Investor Syndicate** (0.30%/week; in v3 it also takes 5% of race prizes while you owe it) and **The Consortium** (1.8%/week; two missed payments and they seize about 35% of your warehouse).
- Weekly running costs apply. Net worth below −$50,000 means bankruptcy.
- **Grey market**: win your first race to unlock contraband parts with strong stats. They are sold only in hubs marked "Grey market available". **FIA scrutineering**: each race has a 35% chance of inspecting illegal parts: the part is confiscated, you get fined and disqualified, and lose 15 reputation.

---

## 🌍 World Hubs

Discounts are the two cheapest categories at that hub, "Expensive" is its most expensive one. Travel costs 1 AP plus the fare.

| Hub | Country | Scene | Cheap | Expensive | Fare | Races |
|---|---|---|---|---|---|---|
| **Portimão** | Portugal | Rally | Suspension (−32%), Tyres (−25%) | Engines (+15%) | $800 | IRC Rally Algarve · Portimão GT Enduro |
| **Nürburgring** | Germany | Endurance | Engines (−28%), Gearboxes (−25%) | Tyres (+5%) | $1,200 | Nürburgring 24H · CTC Nordschleife Round |
| **Silverstone** | England | Formula | Aero (−28%), Electronics (−22%) | Suspension (+5%) | $1,200 | FAWS Grand Prix — Silverstone · Silverstone GT Challenge |
| **Sydney** | Australia | Touring | Tyres (−30%), Fuel systems (−28%) | Aero (+15%) | $4,000 | V8 Supercars Sydney 500 · Sydney Dragway Invitational |
| **Maranello** | Italy | Formula | Aero (−35%), Engines (−10%) | Electronics (+15%) | $1,000 | FAWS Grand Prix — Monza · Italian GT Championship R2 |
| **Brackley** | England | Formula | Electronics (−32%), Aero (−15%) | Suspension (+10%) | $1,200 | FAWS Pre-Season Test · CTC Brands Hatch |
| **Stuttgart** | Germany | GT | Engines (−30%), Gearboxes (−25%) | Tyres (+10%) | $1,200 | GT Masters Stuttgart · CTC Germany |
| **Monaco** | Monaco | Formula | Electronics (−10%), Aero (−8%) | — | $900 | FAWS Monaco Grand Prix · Monaco GT Classic |
| **Le Mans** | France | Endurance | Brakes (−38%), Fuel systems (−20%) | Electronics (+10%) | $1,000 | 24 Heures de la Côte · GEA 6 Hours of France |
| **Dakar** | Senegal | Rally | Suspension (−40%), Fuel systems (−25%) | Aero (+30%) | $2,500 | Dakar Rally Prologue · Africa Rally Trophy |
| **Las Vegas** | USA | Drag | Fuel systems (−30%), Engines (−15%) | Aero (+15%) | $3,500 | Apex Drag Invitational · ADI Bracket Racing |
| **São Paulo** | Brazil | Touring | Fuel systems (−28%), Tyres (−25%) | Aero (+10%) | $3,800 | FAWS Grand Prix — Brazil · Brazilian Touring Cup |
| **Tokyo** | Japan | GT | Tyres (−28%), Aero (−25%) | Fuel systems (+10%) | $4,500 | Super GT Tokyo Round · Tokyo Drag Battle |
| **Melbourne** | Australia | Formula | Fuel systems (−28%), Engines (−12%) | Suspension (+5%) | $4,000 | FAWS Season Opener — Melbourne · Bathurst 12 Hour |
| **Dubai** | UAE | Multi | Neutral prices | — | $3,000 | Dubai 24 Hour · Gulf Touring Cup |
| **Novosibirsk** | Russia | Rally | Suspension (−35%), Gearboxes (−22%) | Electronics (+25%) | $2,800 | IRC Siberian Snow Rally · Novosibirsk Gravel Sprint |

---

## 🛠️ Tech & Assets

- Pure **HTML5 / CSS3 / JavaScript (ES6+)** in a single `index.html`. No frameworks, no build tools.
- **Visual style**: flat dark graphite surfaces, square corners, 1px hairline rules, a single signal-orange accent, tabular numerals for all money and timing figures, and a checkered strip under the header. Discipline colours are the only other colour in the interface.
- UI icons are inline SVG written by hand; no icon library.
- Illustrations live in `assets/vectors/` and are loaded by file name:

| File | Used for |
|---|---|
| `race_car_badge.jpg` | no longer used (the header now shows `logo-mark-transparent.svg`) |
| `racing_flag.jpg` | market and race page banners |
| `pit_stop_crew.jpg` | garage banner |
| `formula_vintage.jpg` | banner at Monaco, Nürburgring and Le Mans |
| `flag_crossed.jpg` | race result dialog |
| `trophy_gold.jpg` | podium result |

Missing images are hidden automatically, so the game still looks right without them.

### Adding artwork from Vecteezy

Free Vecteezy downloads may be used in personal and commercial projects, but **attribution to Vecteezy and the creator is required** unless you hold a Pro subscription. To add or replace art:

1. Download the vector or photo from [pt.vecteezy.com](https://pt.vecteezy.com/) while signed in.
2. Save it into `assets/vectors/` using one of the file names above (JPG or PNG; SVG also works for the banners).
3. Copy the attribution HTML from the licence pop-up on the download page and paste it into the `#credit` strip at the bottom of `index.html`, replacing the generic credit that is there now.

For a clean result, pick flat vector art with straight edges and few colours. The banners are desaturated and darkened in CSS, so busy or very bright images lose detail.

---

## 🗺️ Roadmap

Not implemented yet:
- Balance was tuned with a headless bot over 50 sessions × 50 weeks per difficulty; expect further tweaks once humans play it.
- Online play needs a direct connection between players; strict networks would need a relay (TURN) server. Real equity mechanic for the Angel lender.

---

## 📜 License

The **source code** is MIT-licensed — see [`LICENSE`](LICENSE). The **art** in `assets/` is not: each pack is under its authors' own licence ([`assets/CREDITS.md`](assets/CREDITS.md)). The Grid Runner name and logos are all rights reserved.
