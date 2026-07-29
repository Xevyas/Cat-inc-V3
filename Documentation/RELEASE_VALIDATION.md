# Cat Inc — Release validation

## Current status

The published v0.0038 build plus the current development-only Camp work were validated on 2026-07-29 against the working copy `V3 - ChatGPT`.

- Release status: public game version remains v0.0038; the latest Camp interaction fixes are not yet published or listed in the public changelog.
- Interface references: CSS `0.0145`, JavaScript `0.0153`, Camp module `0.0014`, production module `0.0036`, save module `0.0042`, state module `0.0040`, audio module `0.0007`, config data `0.0043`, content data `0.0052`.
- Automated suite: 192/192 tests passing.
- Browser load: no JavaScript exception and no missing runtime asset. Brave mobile emulation at 390 × 844 validated debris selection, first-touch demolition action, Cat assignment, countdown display, Work exclusion, completion, full-footprint clearing, reload persistence, first-touch Sawmill navigation to Work/Wood, 250% one-finger two-axis map panning, vertical scroll chaining into the Camp page, full-speed active simulation during Camp Edit, no AFK on an in-page focus event and normal 10% AFK catch-up after a real suspension from Edit. Chrome mobile emulation at 390 × 844 additionally validated the icon-only placement toolbar above the pending footprint, live repositioning after rotation and movement, disabled Confirm over invalid land, exact Cancel restoration, silent accessible image icons and native pre-rotated PNG selection at 90°, 180° and 270° with no CSS raster rotation. The five-button Edit dock fits at 390 px; Junk lists all six illustrated props, commits a valid persisted layout item, rejects overlap and leaves terrain-clearing state unchanged.

This file is the release gate for future changes. A release is ready only when every automated gate passes and the relevant manual journeys have been replayed.

## Automated gate

From the game folder, run:

```powershell
node --test --test-reporter=spec tests\*.test.js
```

Required result: zero failed, cancelled, skipped or todo tests (192 tests currently).

The suite currently validates:

- every runtime image path, exact filename case and image signature;
- CSS blocks, duplicate rules, custom properties and local assets;
- module load order and immutable public APIs;
- private Gathering followed by Processing, the 10:1, REDUCED COST I 8:1 or REDUCED COST II 6:1 target, level bonuses, two slots using the same recipe, fractional output and active/offline equivalence;
- current saves, the intentional version 0/1 restart boundary, reset, corrupt JSON, unsafe structures and future versions;
- recipe-card render caching, visible-tab rendering and the absence of the retired independent-worker engine;
- simulation/rendering separation: `tick()` keeps its 100 ms cadence, dynamic progress updates avoid structural rebuilds, and tab renders are coalesced;
- debug-only controls, notification queue and silent scouting completion;
- keyboard controls, modal focus, tab semantics, names, image alternatives, contrast contracts and responsive safeguards.

## Browser acceptance matrix

Validated in headless Chrome with fresh storage and an advanced seeded state.

| Journey | Expected result | 2026-07-17 |
|---|---|---|
| Fresh game | Introduction and empty initial state load without error | Pass |
| First recruit | First kitty story and populated Gang profile | Pass |
| Third recruit | Work and the Cardboard Planks recipe become available | Pass |
| Fifth recruit | Food and the Catnip Salad recipe become available | Pass |
| Eighth recruit | Explorations threshold remains consistent | Pass |
| Early production | Choose Cardboard Planks, assign one Cat, gather private Cardboard Pieces, then process the plank | Pass |
| First recipe cycle | The slot gathers exactly 10 private pieces, or 8/6 with REDUCED COST I/II, then produces finished output | Pass |
| Slot Cat replacement | Removing or moving a Cat preserves that slot's private input and phase progress; changing or clearing the recipe discards them without a refund | Pass |
| Managers | Gathering and Processing manager slots appear only after the Job Center is built | Pass |
| Old save | A recognizable version 0/1 save stays untouched and opens the mandatory restart screen | Pass |
| Advanced state | All main screens render and remain navigable | Pass |
| Normal mode | Speed and forced Bird controls hidden; speed remains 1× | Pass |
| Debug mode | Speed selector and forced Bird control visible | Pass |
| Offline return | 10-minute absence applies 10% simulated time consistently, returns a finite summary and respects the 10-hour cap | Pass |
| Exploration probability | Zones, campaigns and scoutings can both succeed and fail at the displayed probability boundary | Pass |
| Tutorial navigation | Desktop stacks all active goals; mobile shows one goal with previous/next navigation; completion acknowledgement is independent from Daily Quests | Pass |
| Mobile render path | A tab tap paints the selected panel before the coalesced structural render; Work and exploration timers keep updating without full DOM replacement | Pending |
| Mini-game foreground | Catch, Recruit, Bird and Book lesson remain smooth while the background simulation continues, then refresh once after closing | Pending |

## Responsive and interaction matrix

| Surface | Coverage | 2026-07-17 |
|---|---|---|
| Desktop | 1440 × 900, Work recipe slots and manager layout | Pass |
| Mobile | 390 × 844, every main tab, compact header and dialogs | Pass |
| Short mobile | 390 × 667 introduction and guide | Pass |
| Landscape mobile | 844 × 390 introduction remains scrollable and its action reachable | Pass |
| Exploration | Map and page do not create document-level horizontal overflow; mobile returns to the map landing view when reopening the tab or launching a zone mission | Pass |
| Camp (`?debug=1`) | 390 px and 1200 px views: three matching rear facades; upright full-height fences above map elements but below Edit UI and removed persistently with their adjacent zone; three equal 6 × 8 gardens; illustrated 1 × 1, 2 × 1 and 2 × 2 debris; normal-view demolition menu and accessible Cat picker; 10/20/80-minute persisted timers; globally busy demolition Cats; full-footprint completion after reload; deterministic terrain debris disabled in Edit; separate Junk palette copies placeable, persistent and collision-safe without changing clearing state; Basic Trail at 250% with broad connected edges; transactional building placement with a floating icon-only Rotate/Confirm/Cancel toolbar, invalid rotation preview, disabled invalid confirmation, unchanged storage before confirmation and exact existing-item restoration on cancellation; and normal-view Sawmill/Catchen/Pawsonry navigation to Work | Pass |
| Accessibility tree | No unnamed interactive control | Pass |

Compact desktop controls below 44 px are intentional secondary controls. They remain above the WCAG 2.2 pointer-target minimum or have sufficient surrounding spacing. Automated contrast reports on tab labels must be visually checked because their painted pseudo-element background is not represented correctly by a simple DOM color sampler.

## Historical endurance result

The following lot 6F result predates the recipe Work refactor. It remains a useful baseline, but must be rerun before the next publication because `tick()` and production state changed:

- 18,000 ticks, representing 1,800 seconds (30 minutes) of simulated game time;
- 379.6 ms total on the validation machine, 0.0211 ms average per tick;
- every monitored resource remained finite;
- Logs stayed at 35 entries and completed objectives at 23;
- DOM delta: +5 nodes after the first newly activated interface state, then stable;
- collected JavaScript heap: 1.44 MB before and 1.69 MB after all batches (+0.25 MB).

This is a regression smoke test, not a mathematical proof that a multi-day browser session can never leak. Re-run it after changes to `tick()`, notification lifecycles, render functions or recurring timers.

## Save compatibility gate

Never publish a state/schema change unless all save tests pass. In particular:

- unknown future save versions must be rejected;
- corrupt or unsafe data must not overwrite the preserved save;
- recognizable version 0/1 saves must remain untouched, lock autosave and require the recipe-system restart screen;
- the mandatory restart must preserve sound volumes and the adjusted-recruit-time preference;
- reset must remove stale properties and return a complete independent state;
- debug state must never enter the saved payload.

## Final manual release checklist

- Start once with empty storage and recruit at least three kitties.
- Load one real player save copied from the currently published version.
- Check Gang, Work, Houses, Facilities, Explorations, Inventory and Logs.
- Check recipe selection, assignment, forced reassignment, removal, both phases of one cycle and two slots running the same recipe.
- Confirm simple-resource Inventory cards show icons without quantities and simple resources never enter the top bar.
- Check Settings, story replay, resource tooltip and the Bird flow.
- On a real iPhone/Brave session, switch repeatedly between tabs and confirm the selected panel responds immediately; verify Work rings, recruitment progress, exploration/scouting timers and training bars continue updating.
- Open each mini-game during active production and confirm its animation remains smooth, its result is preserved, and the underlying screen refreshes correctly after closing.
- Check normal and `?debug=1` URLs separately.
- Check desktop, 390 px portrait and short landscape.
- Run the Node suite and a Chrome load smoke test.
- Bump cache-busting references only when publishing is explicitly requested.
- Stage files explicitly; never include `img/Backupo/` or `Perso - pas pour github/`.
