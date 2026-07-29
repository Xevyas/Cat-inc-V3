# Rendering and Performance Architecture

This document is the source of truth for the game's simulation/rendering split. Keep it aligned with `jeu.js` whenever a new screen, timer, animation or recurring gameplay system is added.

## Goals

- Keep the simulation cadence and gameplay timing stable.
- Keep mobile taps responsive, especially on the main tab rail.
- Update visible timers and progress without rebuilding unrelated DOM.
- Preserve the shared mini-game foreground lifecycle.

## Two rendering paths

### Simulation

`tick()` remains scheduled every 100 ms. It owns gameplay progression: recruitment cooldowns, Work recipes, missions, scouting, Study and training completion, daily checks and persistence triggers. Do not slow this loop to improve rendering, because that would change game timing and offline equivalence.

### Dynamic rendering

`renduDynamique()` runs after each simulation tick. It updates cheap, time-varying values in place:

- the resource rail and recruitment sequence;
- Work phase fills, recipe quantities, output stock and cycle rings;
- Manual Focus charge;
- exploration, campaign and scouting timers;
- cached Buildings, Facilities and Inventory values.

This path must not introduce a new broad `innerHTML` rebuild. If a new dynamic value needs a DOM node, add a stable class or data attribute and update that node with the guarded DOM helpers.

### Structural rendering

`rendu()` remains the full dispatcher for structural changes. It is used after actions that change controls, assignments, unlocks, result cards, modal contents or section layout. Existing dirty flags and state keys decide when a section needs to rebuild its HTML.

The main tab switch updates visibility and accessibility state synchronously, then schedules one structural render with `requestAnimationFrame`. Rapid tab taps are coalesced and the last selected tab wins. This lets the browser paint the new tab state before the heavier section work runs. Gang is special because its kitty list lives outside the master dispatcher; the deferred tab callback must refresh it explicitly.

The development-only Base Camp prototype remains structurally rendered. Its item and terrain layers rebuild when the Camp tab opens, when Edit mode changes, when a demolition or conquest completes, or when the prototype layout changes. The normal Camp view never starts placement or movement. Active demolition completion is checked from real timestamps by the existing shared simulation tick; while Camp is visible, only countdown text and accessibility labels are updated in place, throttled to one update per second. Do not add a separate Camp interval or rebuild terrain at the 100 ms tick cadence. The full-screen editor is a CSS overlay using the same board DOM; opening its Buildings, Decorations, Paths or Terrain sheet does not duplicate the map or create a renderer. Illustrated buildings, decorations and clearing obstacles use dedicated game-sized alpha PNG derivatives rather than their multi-megapixel generation sources; preserve this source/optimized split for every future Camp asset to limit mobile download, decode memory and paint cost. The seven illustrated placeable sprites use game canvases no larger than 640 × 600, Basic Trail uses one shared 256 × 256 opaque woodchip texture across all connected segments, and the six obstacle sprites use 256 px or 512 px canvases matching their logical aspect ratios. The three optimized rear-house sprites, repeating grass texture and one shared 20 KB shrub sprite are static CSS/HTML layers below terrain and never rebuild. The two upright fence sprites are equally static but use a dedicated pointer-free overlay above terrain, items and the placement ghost, preserving correct boundary occlusion without intercepting map input. A terrain render only toggles each fence's `hidden` state from the claimed-zone `Set`; conquest does not create another sprite or persisted fence field. The shrub is reused by CSS on both sides of every house, so the browser downloads and decodes only one decorative source instead of six separate images. Obstacle packing is deterministic and computed once when the renderer-independent Camp module loads. Terrain rendering builds claimed-zone and cleared-cell `Set` indexes once per structural render, then creates one button/image per remaining obstacle footprint rather than one node per occupied cell; do not normalize the complete terrain independently for each of the 144 garden cells. Camera zoom changes only the board width, one obstacle-size custom property and native viewport scroll offsets, without rebuilding terrain, items or simulation state. Its unzoomed board width is cached between structural renders: item or terrain updates preserve `scrollLeft` and `scrollTop` and must never remove the runtime width long enough for the browser to clamp the horizontal camera back to zero. Resize and Edit-mode transitions invalidate that cache, measure once and restore offsets within the new bounds. In normal view, CSS contains horizontal camera overscroll but allows vertical overscroll to chain into the main page after the inner map reaches a boundary, so dragging over the zoomed map never traps vertical navigation. Edit mode keeps both axes contained because it owns the full screen. Two-finger pinch uses touch handlers only inside the Camp viewport, snaps to the existing zoom levels and anchors the map beneath the gesture center; it does not add an animation loop or affect simulation, mini-games or production progress. Unselected edit items preserve two-axis pan gestures, while one 450 ms timeout promotes a stationary long press to selection and is always cleared on movement, pointer completion or editor exit. Building and decoration pointer movement updates only the placement ghost; Basic Trail painting interpolates crossed cells and rebuilds only the Camp item layer. Rotation updates a transient preview; only explicit confirmation of a valid footprint writes local storage. Keep the future renderer independent from production and AFK simulation, and stop any later canvas renderer whenever Camp is hidden.

Camp building navigation follows the same structural rule. Sawmill, Catchen and Pawsonry share one reusable board-level action menu that is repositioned above the selected footprint and routes to the matching Work family. The popup itself remains pointer-enabled so its padding cannot become a dead first-touch area. Touch actions resolve once on `pointerup` with synthetic-click suppression; mouse and keyboard use the ordinary `click` fallback. This event handling adds no timer, frame callback or structural render. Do not create one popup per item or add a Camp animation/render loop for these interactions. In Edit mode the scrollable map viewport is an isolated stacking context below the controls, category sheet and dock; this contains the fence overlay without adding DOM nodes, paint loops or pointer interception. Building and decoration movement uses one transient placement object outside the persisted layout. Dragging and rotation rebuild only the Camp item layer; they do not save. Confirm performs one collision check, one layout mutation and one save, while Cancel drops the transient object because the original layout entry was never changed. Invalid rotations are structural previews, not simulation state.

The Camp Edit overlay must remain invisible to gameplay timing. It does not pause, reduce or replace `tick()`, and an in-page focus transition must not run offline catch-up. AFK resume is armed only by a real lifecycle suspension (`visibilitychange` to hidden, `pagehide` or `freeze`); the following visible `visibilitychange`, `pageshow` or `focus` consumes that one marker. This preserves 100% active progression while editing and still applies normal AFK balance when the browser or application is genuinely backgrounded from the editor.

## Mini-games

The shared mini-game runtime remains authoritative. While a mini-game is active:

- the normal simulation continues;
- `renduDynamique()` records that a foreground refresh is pending and does not compete with the mini-game;
- mini-game animation uses the shared `requestAnimationFrame` lifecycle;
- closing the mini-game performs one clean refresh when needed.

Do not add an unmanaged animation loop, call the full `rendu()` from a mini-game frame, or keep background map/sphere animation work in front of the active mini-game.

## Rules for future features

When adding a feature, classify every visual update before coding it:

1. **Structural state**: new/removed controls, changed assignments, unlocks, result cards, modal content or layout. Mark the relevant section dirty and use `rendu()` once.
2. **Dynamic state**: a timer, percentage, quantity or charge that changes while the structure is unchanged. Add a targeted updater to `renduDynamique()`.
3. **Animation state**: a player-controlled visual loop. Use the shared mini-game runtime or a CSS transform animation that can be paused when off-screen.

Additional constraints:

- Never add a second full-page render to `tick()`.
- Keep state progression independent from whether a tab is visible.
- Use deterministic render keys for any section whose HTML can be rebuilt repeatedly.
- Update progress bars and text with `ecrireStyle`, `ecrireVariableStyle`, `ecrireTexte` and `ecrirePropriete` so identical values do not trigger layout work.
- When a completion changes the available actions, set a dirty flag and let the next safe structural render rebuild the section.
- Preserve interaction protection around pointer/click resolution; do not trade away target stability to gain a small render shortcut.
- If a feature affects a mini-game, update `Documentation/mini_games.md` and verify the foreground runtime before changing the shared dispatcher.
- Keep `version.json` synchronized with the player-facing release version. AFK resume checks must fetch it with `cache: "no-store"` and reload only when the published version is newer; never restore unconditional reloads on every AFK panel.

## Validation checklist

After changing rendering or recurring timers, run the Node test suite and check at least:

- main tab switching on a 390 px portrait viewport;
- Work Gathering and Processing progress, including a phase transition;
- recruitment cooldown and its marker;
- exploration and scouting timers;
- training and learning completion states;
- Inventory quantities and item-study progress;
- all current mini-games, including returning from a suspended/background tab;
- AFK/reconnection handling and a fresh page load.

Use a performance trace on a real iPhone/Brave session when possible. The expected result is that a tab tap produces one short structural render after the paint, while normal 100 ms ticks update only the active dynamic values.
