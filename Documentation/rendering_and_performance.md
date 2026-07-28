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

The development-only Base Camp prototype is structural only. It has no tick or animation loop: its item layer rebuilds when the Camp tab opens, when Edit mode changes or when placement or rotation changes. The normal Camp view never starts placement or movement. The full-screen editor is a CSS overlay using the same board DOM; opening its Buildings, Decorations or Paths sheet does not duplicate the map or create a renderer. Illustrated buildings use dedicated game-sized alpha PNG derivatives rather than their multi-megapixel visual masters; preserve this master/optimized split for every future Camp asset to limit mobile download, decode memory and paint cost. Unselected edit items preserve vertical pan gestures, while one 450 ms timeout promotes a stationary long press to selection and is always cleared on movement, pointer completion or editor exit. Building and decoration pointer movement updates only the placement ghost; road painting interpolates crossed cells and rebuilds only the Camp item layer. Rotation remains a structural action with one collision check, one local save and one item-layer rebuild. Keep the future renderer independent from production and AFK simulation, and stop any later canvas renderer whenever Camp is hidden.

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
