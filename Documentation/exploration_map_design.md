# Exploration Map — Zone Design

## Coordinate system

- 7 columns: **A** (left) → **G** (right), center column = **D**
- Rows increase upward: **Row 1** = house row (bottom of map), **Row 5** = top of current grid
- Coordinate = column letter + row number → `D1` = House, etc.
- Some zones span multiple cells (see layout below).

## Current layout

```
     A        B        C        D        E        F        G
5  [              Forest Entrance (full width)              ]

4  [ Gas                ] [Park ] [Comm ] [Park ] [ Super    ]
3  [ Station            ] [Left ] [Str. ] [Right] [ market   ]

2  [              Residential Bloc Street (full width)      ]

1  [CNST]  [GARD]  [L.NB]  [HOME]  [R.NB]  [GARD]  [SQUT]
```

Row 1 visibility notes:
- `GARD` = Empty Garden — B1 visible after C1 explored · F1 visible after E1 explored
- `CNST` = House under construction (A1) — visible after B1 is explored
- `SQUT` = Squatted House (G1) — visible after F1 is explored

---

## Zone type reference

| Type         | Description |
|--------------|-------------|
| home         | The house — base of operations, always visible |
| street       | Roads and paths |
| neighbor     | A neighbor's house or property |
| park         | Open green space |
| shop         | A place of interest (store, school, etc.) |
| chantier     | A construction site — abandoned or under construction |
| forest       | Dense vegetation, far from home |
| other        | Anything that doesn't fit above |

---

## Mission type reference

Each zone goes through up to three phases of missions, unlocked in order:

| Phase | Type | Description |
|-------|------|-------------|
| 1 | **Zone Exploration** | One-time mission to unlock the zone. Required before anything else is available there. |
| 2 | **Campaign** | One or more unique missions unlocked after exploration. Each campaign runs once and rewards a specific item or resource. |
| 3 | **Scouting** | Repeatable missions unlocked after a specific campaign. Auto-restart on completion. Yield random quantities of a resource. |

---

## Mobile navigation

- Mobile uses a map-to-zone master/detail flow instead of stacking every mission below the neighborhood map.
- The map panel uses a compact 6 px mobile gutter, halfway between edge-to-edge content and the standard 12 px panel gutter. Its explanatory sentence lives in the header `?` popover, keeping the map itself higher on screen without removing the context.
- Tapping a visible zone selects it and keeps the map open. A compact preview below the map shows the public zone name when explored, green completed-Campaign and active-Scouting counts, orange available-Campaign counts, grey inactive-Scouting counts, and an `Open zone` button. Zero-value optional states stay hidden; an unexplored zone keeps the single `1 Exploration mission` pill, while an explored zone with no Campaign or Scouting shows only `Empty`.
- `Open zone` replaces the map with a dedicated zone workspace. Its sticky header keeps `← Map`, the public coordinate/name/status and the `Campaigns` / `Scoutings` switch available while mission cards scroll underneath.
- Unexplored zones open directly on their one-time Zone Exploration mission and hide both their real name and internal coordinate/identifier. Explored zones and Home use the compact mission-type switch, displaying only one mission list at a time.
- Returning to the map preserves the selected zone and its preview. Repeated taps on the selected mobile zone therefore keep the preview visible instead of clearing the selection.
- Tutorial navigation to `Search our trash` opens D1 directly in its Campaigns workspace. Story actions whose purpose is to introduce or highlight the map still return to the map view.
- Desktop retains the two-column layout: large map on the left and the selected zone's mission panels on the right.

---

## Result and reward claim lifecycle

- **Zone Exploration:** completing the timer frees the assigned cats and stores a pending result. A success does not reveal the zone immediately; the player must select the zone and press `Reveal the explored zone`. A failure exposes `Try again`, returning to setup with the former party preselected when those cats are still available.
- Zone Exploration setup always reserves the left slot for an **Explorator**. Bernardo can fill that slot only after learning the `EXPLO` perk; the slot is highlighted in gold and labelled `Explorator`.
- **Campaign:** completing the timer frees the party and stores both the result and the exact rolled reward. A successful campaign is marked complete only when the player presses `Claim campaign reward`; this is also when its resources/items are granted and dependent content unlocks. A failure exposes `Try again` with the same safe preselection behavior.
- **Scouting:** runs continue automatically with the assigned cat. Successful and failed run totals are accumulated per scouting, together with Regular, Lucky, Super Lucky, Doubled and Tripled counters and the combined pending loot. `Claim scouting rewards` transfers the whole pool without interrupting or resetting the current run. Removing the assigned cat also preserves the accumulated pool. Each scouting card explains its reward table in a compact Regular/Lucky/Super Lucky block with the chance and quantity; on mobile the entries stack with thin separators. The accumulated `Rewards Luck` row remains a separate result summary.
- **Explorator reward perks:** `CAT FOOD I/II` modifies the weighted chance of selecting Canned Cat Food. `CHANCE DOUBLE I/II` grants 20% per level and rolls first; only a successful Double can trigger the conditional 15%/30% `CHANCE TRIPLE I/II` roll. At maximum levels this produces 60% normal, 28% doubled and 12% tripled outcomes. `LUCKY FOOD I/II` then gives a 15%/30% chance to award the full multiplied Canned Cat Food quantity without consuming its daily scouting stock. At least one stock must remain; an empty stock cannot be preserved or used.
- Pending results and scouting pools are persisted in saves. No pending claim is rerolled after reload or import.
- The neighborhood map shows a magnifying-glass badge for a successful zone waiting to be revealed, a gift badge for claimable campaign or scouting loot, and a red-cross badge for a failed zone or campaign waiting for retry.
- The main Explorations tab shows a magnifying glass when any zone can be revealed and a gift when any campaign reward can be claimed. Whenever either alert is present, the tab also reuses the small red notification dot used for newly unlocked tabs. Scouting loot intentionally has no main-tab indicator for now.
- Scouting tier labels are derived from the configured outcomes. For the two-reward `Infiltrate the Supermarket again` scouting, Workers Food is **Regular** and Canned Cat Food is **Super Lucky**.

---

## Fog of war rendering

- Unrevealed zones keep the original opaque fog texture as the authoritative gameplay layer. This static layer prevents the map artwork from flashing through while assets load or the Exploration tab rerenders.
- When `MAP_FOG_MOTION_ENABLED` is enabled in `jeu.js`, one global SVG mask covers the complete map and removes the fog over Home and explored zones. A main original + mirrored + original texture strip moves continuously to the right on a 90-second loop. A second vertically offset strip uses the same seamless construction, moves right over 140 seconds and stays at 25% opacity, creating the impression of cloud layers passing one another. Matching mirrored edges and identical start/end frames remove zone and loop seams. The mask rectangles use SVG `shape-rendering="crispEdges"`: keep it on both the white base and every black revealed-zone cutout, otherwise fractional mobile cell widths create faint anti-aliased grid lines even over fully explored artwork. A very light horizontal SVG blur flattens each strip before it moves, hiding subpixel sampling lines without visibly softening the fog vertically. Both phases use the shared clock. Selecting a zone updates only its outline and information panels without rebuilding the map SVG, so clicking after a tab change cannot restart or jump either fog layer.
- Explorable and locked unrevealed zones keep the same fog color as the rest of the covered map; lock state must not desaturate an entire map slice.
- Once an Explorator is available, visible but unrevealed zones show their `?` badge above the fog overlay. Transparent clickable map cells stay at `z-index: 5`, above the global fog at `z-index: 4`, so selection outlines, locks, `?` markers and mission-status badges remain readable while the zone artwork stays covered. The first zone-exploration slot is labeled `Explorator` below its button, keeping all assignment buttons aligned; its picker only offers an Explorator or Bernardo with the `EXPLO` perk.
- Revealing a zone removes its complete fog overlay, so the static and animated layers disappear together and never move independently over an explored zone.
- The animation is disabled automatically for players using `prefers-reduced-motion`.
- **Rollback:** set `MAP_FOG_MOTION_ENABLED` to `false`. No CSS removal is required; the original static fog remains active.

---

## Zones

### D1 — Home 🏠
**Type:** home · Base of operations, always available.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | — | — | — | — | Always unlocked |
| Campaign | **Search our trash** (`checkTheTrash`) | 1 | 5 min | 1 | School Guide (item) |
| Campaign | **Search the house** (`searchHomeHouse`) | 70 | 60 min | 2 | The Engineer's Path (item) |
| Scouting | **Search our trash again** (`searchTrashAgain`) | 1 | 10 min | 1 | Human Leftovers ×1–3 (70/20/10%) |

> Scouting unlocks after: `checkTheTrash` campaign completed.
>
> Before the evacuation story, the locked campaign description says `There may be useful things inside, but a human is still home.` Once `storyHouseEvacuationVue` triggers at 15 cats, the description changes to `The house is empty now. Search quickly before the humans come back.` and the campaign becomes available.
>
> Undiscovered zone names remain hidden outside the map: Gang action labels use `Exploring: Unknown zone`, and zone exploration completion notifications stay generic until the player reveals the zone.

---

### C1 — Left Neighbor 🏡
**Type:** neighbor · The left neighbor's house and yard. Visible from start.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore Left Neighbor** | 10 | 10 min | 2 | Zone unlocked |
| Campaign | **Search Left Neighbor's Trash** (`searchLeftNeighborTrash`) | 15 | 10 min | 2 | Human Leftovers ×10 |
| Campaign | **Search Left Neighbor's House** (`searchLeftHouse`) | 80 | 80 min | 2 | The Teamwork Advantage (item) |
| Scouting | **Search left neighbor's trash again** (`searchLeftNeighborTrashAgain`) | 15 | 20 min | 1 | Human Leftovers ×1–3 (70/20/10%) |

> Scouting unlocks after: `searchLeftNeighborTrash` campaign completed.
>
> The left-neighbor house campaign remains locked by `Human inside the house` until the `storyLeftHouseEvacuationVue` story triggers when the gang reaches 17 cats.

---

### E1 — Right Neighbor 🏡
**Type:** neighbor · The right neighbor's house and yard. Visible from start.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore Right Neighbor** | 10 | 10 min | 2 | Zone unlocked |
| Campaign | **Search Neighbor's Trash** (`searchNeighborTrash`) | 15 | 10 min | 2 | Fishing Guide (item) |
| Campaign | **Search the house** (`searchRightHouse`) | — | — | 2 | 🔒 Locked — human inside the house |
| Scouting | **Search neighbor's trash again** (`searchNeighborTrashAgain`) | 15 | 20 min | 1 | Human Leftovers ×1–3 (70/20/10%) |

> Scouting unlocks after: `searchNeighborTrash` campaign completed.

---

### residentialStreet — Residential Bloc Street 🛣️
**Type:** street · Full-width zone spanning all 7 columns on row 2. Unlocks after exploring any row 1 zone (visible from start).

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Street** | 30 | 30 min | 2 | Zone unlocked |
| Campaign | *(none yet)* | — | — | — | — |
| Scouting | *(none yet)* | — | — | — | — |

---

### B1 — Empty Garden 🌿
**Type:** other · A small empty garden next to the left neighbor's yard. Visible after C1 is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Empty Garden** | 20 | 20 min | 2 | Zone unlocked (reveals A1) |
| Campaign | **Search the garden** (`searchLeftGarden`) | 15 | 20 min | 2 | Human Leftovers x10 |
| Scouting | *(none)* | — | — | — | — |

---

### F1 — Empty Garden 🌿
**Type:** other · A small empty garden next to the right neighbor's yard. Visible after E1 is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Empty Garden** | 20 | 20 min | 2 | Zone unlocked (reveals G1) |
| Campaign | **Search the garden** (`searchRightGarden`) | 15 | 20 min | 2 | Human Leftovers x10 |
| Scouting | *(none)* | — | — | — | — |

---

### G1 — Squatted House 🏚️
**Type:** neighbor · A house occupied by humans. Visible after F1 is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Squatted House** | 30 | 25 min | 2 | Zone unlocked |
| Campaign 1 | **Explore the Garden** (`exploreSquattedGarden`) | 40 | 30 min | 2 | Stone Craft Guide (item) |
| Campaign 2 | **Search the House** (`searchSquattedHouse`) | — | — | 2 | 🔒 Locked — threats detected inside |

> Campaign 2 unlocks after `exploreSquattedGarden` is completed, but remains locked until combat is implemented.
> Stone Craft Guide unlocks the **Miner** (Rock family) and **Stonemason** (Pawsonry family) jobs.

---

### A1 — House under construction 🏗️
**Type:** chantier · An abandoned construction site. Visible after B1 is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore Construction Site** | 30 | 25 min | 2 | Zone unlocked |
| Campaign 1 | **Explore the Ground Floor** (`exploreGroundFloor`) | 35 | 30 min | 2 | Construction Plan (item) |
| Campaign 2 | **Explore the Basement** (`exploreBasement`) | 50 | 1 hour | 2 | Corporate Seminar Booklet (item) |
| Campaign 3 | **Search the upper floor** (`searchUpperFloor`) | 80 | 1 hour | 2 | Sturdy House Plans (item) |
| Scouting | **Search Basement again** (`searchBasementAgain`) | 30 | 50 min | 1 | Workers Food ×1–3 (70/20/10%) |

> Campaigns 2 and 3 unlock after `exploreGroundFloor` is completed.
> Construction Plan unlocks the **Builder** job and Wood Cathouses in the Houses tab.
> Corporate Seminar Booklet unlocks the **Training Center** in the Facilities tab (after studying it).
> Sturdy House Plans unlock the **Solid Stone Cathouse** in the Houses tab after the book is studied and learned.

---

### gasStation — Gas Station ⛽
**Type:** shop · Spans columns A–B, rows 3–4. Unlocks after `residentialStreet` is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Gas Station** | 50 | 50 min | 2 | Zone unlocked |
| Campaign 1 | **Explore the outside** (`exploreOutside`) | 50 | 40 min | 2 | Basic Wood Planks ×10 + Human Leftovers ×20 + Workers Food ×1 |
| Campaign 2 | **Sneak through the back entrance** (`sneakBackEntrance`) | 80 | 90 min | 2 | Compass (unique item) |
| Scouting | **Let's try stealing more** (`stealGasStationAgain`) | 50 | 50 min | 2 | Workers Food ×2 (50%) / ×4 (45%) / Canned Cat Food ×1 (5%) |

The Gas Station scouting has a daily Canned Cat Food stock of 2. The reward row shows only a large clickable Canned Cat Food icon, its remaining/total stock and a two-line `reset in` countdown; clicking the icon opens the standard resource detail popup. The stock resets independently at Paris midnight, even before Daily Quests have been unlocked.

> Campaign 2 unlocks after `exploreOutside` is completed. The Compass is one of the two future conditions for opening the worldwide map.

---

### parkingLeft — Parking 🅿️
**Type:** other · Column C, rows 3–4. Unlocks after `residentialStreet` is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Parking** | 40 | 40 min | 2 | Zone unlocked |
| Campaign | **Search the parking** (`searchLeftParking`) | 35 | 40 min | 2 | Rock Bricks x2 |
| Scouting | *(none yet)* | — | — | — | — |

---

### commercialStreet — Commercial Street 🛣️
**Type:** street · Column D, rows 3–4. Unlocks after `residentialStreet` is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Commercial Street** | 40 | 40 min | 2 | Zone unlocked |
| Campaign | *(none yet)* | — | — | — | — |
| Scouting | *(none yet)* | — | — | — | — |

---

### parkingRight — Parking 🅿️
**Type:** other · Column E, rows 3–4. Unlocks after `residentialStreet` is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Parking** | 40 | 40 min | 2 | Zone unlocked |
| Campaign | **Search the parking** (`searchRightParking`) | 35 | 40 min | 2 | Rock Bricks x1 + Basic Wood Planks x5 |
| Scouting | *(none yet)* | — | — | — | — |

---

### supermarket — Supermarket 🛒
**Type:** shop · Spans columns F–G, rows 3–4. Unlocks after `residentialStreet` is explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Supermarket** | 50 | 50 min | 2 | Zone unlocked |
| Campaign | **Infiltrate the Supermarket** (`infiltrateSupermarket`) | 60 | 60 min | 2 | Canned Cat Food ×2 |
| Campaign | **Check the book section** (`checkSupermarketBookSection`) | 65 | 60 min | 2 | The Daily Purpose (book) |
| Scouting | **Raid the Supermarket again** (`raidSupermarketAgain`) | 60 | 60 min | 1 | Canned Cat Food ×1 (25% drop on success) |

The Supermarket scouting has a daily Canned Cat Food stock of 3. The reward row shows only a large clickable Canned Cat Food icon, its remaining/total stock and a two-line `reset in` countdown; clicking the icon opens the standard resource detail popup. The stock resets independently at Paris midnight, even before Daily Quests have been unlocked.

> The **Check the book section** campaign unlocks after `infiltrateSupermarket` is completed. The scouting unlocks after the same first campaign.
> Canned Cat Food is a Training Material used in the Training Center to improve job levels.
> Drop mechanic: difficulty check (success based on power/60) **then** 25% drop chance — so rare at low levels.

---

### forestEntrance — Forest Entrance 🌲
**Type:** forest · Full-width zone spanning all 7 columns on row 5. Unlocks after the row 3-4 zones are explored.

| Phase | Mission | Difficulty | Duration | Slots | Reward |
|-------|---------|-----------|----------|-------|--------|
| Zone Exploration | **Explore the Forest Entrance** | 60 | 60 min | 2 | Zone unlocked |
| Campaign | **Navigate through the woods** (`navigateThroughWoods`) | 100 | 90 min | 2 | Unlock the World Map (future feature) |
| Scouting | *(none yet)* | — | — | — | — |

> The campaign requires the unique `compass` item. Its completion is the second future condition for opening the World Map; the map itself is not implemented yet.

---

## Expansion notes

- To add a zone: add an entry to `ZONES_CARTE` in `V3/jeu.js` and update this file.
- To add a campaign: add it to `CONFIG.campaigns` in `V3/jeu.js` and add a row in the relevant zone section above.
- To add a scouting: add it to `CONFIG.scoutings` in `V3/jeu.js` with the correct `zone` and `unlockCampaign` fields, then update above.
- If the map needs to grow beyond Row 5, add rows 6, 7, etc. following the same convention.
- If the map needs to grow sideways (beyond A or G), prepend or append columns and update the letter range.
- **Always keep this file in sync** when adding/modifying zones or campaigns.
