# Base Camp design

This document is the source of truth for the future player-customizable Base Camp and its current development prototype.

## Current prototype

- The main `Camp` tab exists only when the URL contains `?debug=1`.
- The logical camp is an **18-column by 12-row** board. Rows 0–3 form a short, immutable decorative house band; rows 4–11 form three equal 6 × 8 garden placement grids.
- `js/ui/camp.js` owns the grid dimensions, item catalog, rotated footprints, terrain zones, clearing/conquest rules, collision checks and persisted-data normalization.
- Cardboard Box, Job Center, Sawmill, Catchen and Pawsonry are illustrated Camp buildings. They are available from the Buildings menu with 2 × 1, 5 × 6, 3 × 2, 3 × 3 and 4 × 4 footprints respectively.
- Training Center (4 × 3) remains the first building placeholder.
- The first decoration placeholders are Tree (2 × 2) and Cat Toy (1 × 1). They currently have no wellbeing effect.
- Roads occupy one cell. Dragging the Road tool paints every crossed cell, including interpolated cells skipped by a fast pointer movement. Adjacent north/east/south/west road tiles connect visually.
- The road eraser removes only road tiles crossed by the pointer. Roads currently have no pathfinding, access or production effect.
- The normal Camp view is interaction-only: tapping an element can open or trigger its future gameplay action, but it cannot place, move or remove layout items.
- `Edit camp` opens the same map as a full-screen CSS overlay. This state does not use the browser Fullscreen API, so it remains reliable on iPhone browsers and can preserve the normal page lifecycle.
- Four round buttons stay at the bottom of Edit mode. Buildings, Decorations, Paths and Terrain each open only their own available-item sheet above the dock; selecting a direct map tool closes the sheet so the map is immediately usable.
- In Edit mode, players can choose a building or decoration and tap the grid to place it. An existing item requires a 450 ms press-and-hold before it becomes selected; a subsequent drag moves the selected item. This prevents ordinary map navigation gestures from accidentally rearranging the layout. Selected buildings can be rotated clockwise with `Rotate 90°` or the `R` key, moved with the arrow keys, removed, or cleared with the rest of the prototype.
- The prototype layout uses `catIncCampPrototypeLayoutV2`; land progression uses `catIncCampPrototypeTerrainV3`; camera zoom uses `catIncCampPrototypeZoomV1`. V1 layouts migrate automatically with a default 0-degree rotation. V1/V2 terrain is normalized into the equal three-garden model; valid occupied garden cells are preserved as cleared/claimed migration data, while items outside the new garden bounds are discarded.
- Camp data remains deliberately excluded from `etat`, save export/import, AFK progression and production.
- The renderer has no recurring timer or animation loop. It rebuilds only after opening the Camp tab, changing Edit/menu state, clearing/conquering land or changing the prototype layout. Zoom changes only board dimensions and scroll position.

## Land progression

- A new prototype starts in the garden behind the blue house. Its first three rows, columns 6–11 and rows 4–6, are immediately buildable; the five rows below them must be cleared.
- The initial owned `home` territory is the complete 6 × 8 blue-house garden at columns 6–11 and rows 4–11. Its blocked cells contain deterministic placeholder obstacles: tall weeds, broken pots, brambles or rubble.
- An obstacle can be removed only when its territory is already claimed and one of its four orthogonal neighbors is clear. Clearing is instant and free in the prototype; future resource costs, worker requirements and timers belong in gameplay data rather than rendering code.
- The garden area is divided into three equal data-defined territories that match the neighboring homes: red at columns 0–5, blue at columns 6–11 and green at columns 12–17. Each territory is exactly 6 columns by 8 rows.
- The top four rows show, from left to right, matching rear facades for the red, blue and green houses. Each facade shows the lower roof slope, rear wall and a porch leading directly into its garden. This band provides narrative context only: it has no terrain zone, grid, obstacles, clearing, conquest or placement hit targets.
- An unclaimed territory becomes conquerable only when one of its cells touches already cleared land. Claimed territory still starts obstructed, so conquest increases ownership while clearing increases usable building space.
- Every terrain state is a compact list of claimed zone IDs and cleared cell keys. Obstacles are derived deterministically from coordinates and are not stored individually.

## Rendering boundary

The prototype currently uses DOM items with optional optimized PNG sprites, so placement UX, artwork and data rules can be validated without adding a large rendering dependency. Gameplay and placement data must remain renderer-independent. A later PixiJS renderer may replace the DOM layer without moving production, unlock, wellbeing or save rules into the renderer.

The environment is a set of static layers below the terrain and item DOM: the matching `Camp_Red_House_Rear_Watercolor_HighAngle_v3.webp`, `Camp_Blue_House_Rear_Watercolor_HighAngle_v3.webp` and `Camp_Green_House_Rear_Watercolor_HighAngle_v3.webp` facade sprites; the reusable `Camp_Garden_Shrub_Watercolor_HighAngle_v2.webp` beside both sides of every facade; `Camp_Grass_Texture_Prototype_v1.webp` below the garden grid; and two instances of `Camp_Garden_Fence_Upright_Prototype_v2.webp` on the red/blue and blue/green boundaries. The high-angle house sprites emphasize the roof and retain only a short rear wall before the porch, bringing their camera closer to the top-down workstations. They are enlarged from the bottom edge and clipped by their plot so the roof reaches the top map edge while the porch remains connected to the garden. Shrubs use the same higher camera and are inset from both plot edges; their visible pixels must remain clear of the garden fences and central porch. The upright fence runs through both the house band and garden band, and must retain its native proportions rather than being flattened into a ground strip. These assets live in `img/Maps/Camp Prototypes/`. Keep decorative environment layers pointer-free and outside the terrain model.

The rear-house sprites define the visual direction for future Camp environment illustrations: a gentle children's-book drawing made from light watercolor washes and visible colored-pencil strokes, with pastel colors, simple rounded shapes, soft contrast and slightly irregular dark-brown pencil outlines. Keep the object fully visible and centered on a transparent canvas with breathing room. Do not bake in ground, scenery, frames, shadows, lighting effects, characters, text, complex textures or dramatic perspective. The three houses must share the same geometry and differ only through the roof and door color. The earlier `*_Rear_Prototype_v1.webp` sprites remain comparison material and are not loaded at runtime.

## Top-down building asset prototypes

- Initial transparent prototypes live in `img/Buildings/Camp Prototypes/` for the Cardboard Box and Job Center. The V4 master files are `Cardboard Box_Camp_TopDown_Prototype_v4.png` and `Job Center_Camp_TopDown_Prototype_v4.png`; V1 through V3 remain available only for visual comparison.
- The Camp renderer uses the optimized watercolor alpha PNG derivatives `Cardboard Box_Camp_TopDown_Watercolor_Game_v2.png` and `Job Center_Camp_TopDown_Watercolor_Game_v2.png`. Keep the earlier files and larger V4 sources as geometry references and visual comparisons; do not load them in the live board or palette.
- The Cardboard Box V4 has a 2-column by 1-row footprint at rotation 0. Its roof ridge runs left-to-right, perpendicular to the V2 ridge, and the roof silhouette must remain a single clean shape without overlapping side flaps or duplicated roof panels. Its near-top-down view keeps a subtle angle: the roof remains dominant while a narrow strip of the entrance-facing wall is visible at the bottom.
- The Job Center V4 has a 5-column by 6-row footprint at rotation 0. `Camp_Buildings_Footprints_Rotation_Preview_v4.png` shows both V4 sprites and their occupied grid cells at 0, 90, 180 and 270 degrees.
- Rotation 0 faces the entrance toward the bottom of the map. A building uses the same transparent source sprite for all four directions and rotates mechanically by 90-degree steps rather than requiring four separately generated directions.
- Rotations 90 and 270 swap the logical footprint width and height: Cardboard Box becomes 1 by 2, and Job Center becomes 6 by 5. Collision checks and placement bounds must use the rotated footprint, not the unrotated catalog dimensions.
- The runtime sprites use a near-vertical orthographic view, no baked directional shadow, pastel watercolor washes, visible colored-pencil texture and slightly irregular dark-brown outlines. Preserve the established shape and footprint while avoiding glossy rendering and excess detail. A future generic shadow must remain outside the rotating sprite layer.
- Building identity should come from roof shape, material, repairs and simple roof emblems rather than generated text. The Job Center prototype uses a paw-and-tools roof mark; the Cardboard Box preserves its tape and blue repair patch.
- Keep the source PNG centered with transparent padding so roof edges and entrances remain inside the canvas at every rotation.

## Production building asset prototypes

- The current production-workstation masters are `Sawmill_Camp_TopDown_Prototype_v1.png`, `Catchen_Camp_TopDown_Prototype_v2.png` and `Pawsonry_Camp_TopDown_Prototype_v2.png` in `img/Buildings/Camp Prototypes/`. Keep the earlier Catchen and Pawsonry V1 files for visual comparison.
- The Camp board and Buildings menu load only the optimized watercolor alpha derivatives `Sawmill_Camp_TopDown_Watercolor_Game_v2.png`, `Catchen_Camp_TopDown_Watercolor_Game_v3.png` and `Pawsonry_Camp_TopDown_Watercolor_Game_v3.png`. Their earlier game files remain geometry references and are not loaded at runtime.
- Sawmill uses a 3-column by 2-row footprint at rotation 0. Its compact rail, wood pieces and mounted saw form one wide workstation; rotations 90 and 270 use a 2 by 3 footprint.
- Catchen uses a square 3 by 3 footprint. Its central cooking pot, contained firepit, catnip preparation board, ingredient bowl, spoon and cloth remain one coherent workstation at every quarter-turn. V2 gives all four perimeter-stone rows the same width and visual weight.
- Pawsonry uses a square 4 by 4 footprint. Its visual flow is raw rocks, stonecutting bench and tools, then finished bricks. The pale rocky ground pad defines the complete occupied area. V2 uses equal borders on every side and shows the finished bricks mostly from above, with only a minimal visible side face.
- `Camp_Production_Buildings_Rotation_Preview_v1.png` is the historical review sheet for the initial assets. Catchen and Pawsonry V2 rotation quality must be assessed from their current game derivatives rather than that V1 sheet.
- Persisted prototype layouts that still contain the former `kitchen` type are normalized to `catchen`, preserving position and quarter-turn rotation whenever the placement remains valid.
- Rotatable ground pads and perimeter borders must use strict top-down orthographic geometry: equal thickness on all sides, parallel opposite edges and no front-to-back taper. A subtle angle is reserved for a few internal objects such as a pot or workbench. Finished materials placed on the pad should remain top-dominant rather than showing large vertical faces.

## Placement rules

- Coordinates represent the top-left cell of an item's footprint.
- Every footprint must remain within columns 0–17 and garden rows 4–11. Rows 0–3 are decorative and always fail terrain-aware placement.
- Every cell under a building, decoration or road must belong to claimed territory and be cleared.
- Footprints may not overlap.
- Buildings, decorations and roads currently share the same occupancy layer, so roads cannot pass underneath another item.
- A moved item is ignored by collision checks against its own previous position.
- Corrupt, unknown, duplicate, overlapping or out-of-bounds persisted prototype entries are discarded during normalization.
- Rotatable items persist a normalized `rotation` value of 0, 90, 180 or 270 degrees. Invalid or missing values normalize to the nearest valid quarter-turn, with legacy layouts defaulting to 0.
- Rotation is accepted only when the rotated footprint remains inside the board and does not overlap another item.

## Mobile interaction

- The normal view never captures a drag for layout editing.
- `Edit camp` locks page scrolling and gives the map the full viewport, while preserving safe-area padding around the top actions and bottom category dock.
- The zoom range is 75%–250% in 25% steps. The central percentage button resets to 100%, and the first camera position is centered on the initially cleared first three rows of the blue garden.
- The board can exceed the viewport in either direction. Its surrounding viewport scrolls horizontally and vertically, and unselected elements use `touch-action: pan-x pan-y` so a gesture that starts on them can still navigate the map.
- A movement of more than 8 px before the 450 ms selection delay cancels the hold and remains a navigation gesture. Once selected, the element uses the dedicated drag interaction.
- Tapping an empty cell places the active building or decoration.
- Dragging with the Road tool paints a continuous orthogonal/diagonal sampled path; dragging with the road eraser removes road tiles.
- Continuous road painting and active item dragging use `touch-action: none`; ordinary map navigation, terrain inspection and unselected items retain two-axis panning.
- Placement snaps to the logical grid.
- The visual hit area is the complete footprint.
- No free-pixel placement is included; zoom changes the camera scale without changing logical coordinates or collision geometry.

## Decisions required before production integration

- Whether the current three equal 6 × 8 gardens remain authoritative after later territory expansion is added.
- PixiJS adoption and asset-atlas pipeline.
- Building and decoration catalog, footprints, anchors and optional rotations.
- Whether rearrangement remains free once the dedicated Edit mode moves from prototype to production.
- Migration from prototype-local storage to the versioned game save.
- Final clearing/conquest costs, durations, Cat assignments, unlock conditions and zone rewards.
- Wellbeing rules, decoration limits, path reservations and future Cat navigation.
