# Base Camp design

This document is the source of truth for the future player-customizable Base Camp and its current development prototype.

## Current prototype

- The main `Camp` tab exists only when the URL contains `?debug=1`.
- The logical camp is an orthogonal grid with **20 columns and 30 rows**.
- `js/ui/camp.js` owns the grid dimensions, item catalog, rotated footprints, collision checks and persisted-layout normalization.
- Cardboard Box and Job Center are the first illustrated Camp buildings. They are available from the Buildings menu with 2 × 1 and 5 × 6 footprints respectively.
- The first building placeholders are Sawmill (4 × 4), Kitchen (3 × 4) and Training Center (4 × 3).
- The first decoration placeholders are Tree (2 × 2) and Cat Toy (1 × 1). They currently have no wellbeing effect.
- Roads occupy one cell. Dragging the Road tool paints every crossed cell, including interpolated cells skipped by a fast pointer movement. Adjacent north/east/south/west road tiles connect visually.
- The road eraser removes only road tiles crossed by the pointer. Roads currently have no pathfinding, access or production effect.
- The normal Camp view is interaction-only: tapping an element can open or trigger its future gameplay action, but it cannot place, move or remove layout items.
- `Edit camp` opens the same map as a full-screen CSS overlay. This state does not use the browser Fullscreen API, so it remains reliable on iPhone browsers and can preserve the normal page lifecycle.
- Three round buttons stay at the bottom of Edit mode. Buildings, Decorations and Paths each open only their own available-item sheet above the dock; selecting a tool closes the sheet so the map is immediately usable.
- In Edit mode, players can choose a building or decoration and tap the grid to place it. An existing item requires a 450 ms press-and-hold before it becomes selected; a subsequent drag moves the selected item. This prevents ordinary map navigation gestures from accidentally rearranging the layout. Selected buildings can be rotated clockwise with `Rotate 90°` or the `R` key, moved with the arrow keys, removed, or cleared with the rest of the prototype.
- The prototype layout uses the dedicated `catIncCampPrototypeLayoutV2` local-storage key. V1 layouts migrate automatically with a default 0-degree rotation. Camp data remains deliberately excluded from `etat`, save export/import, AFK progression and production.
- The renderer has no recurring timer or animation loop. It rebuilds only after opening the Camp tab, changing Edit/menu state or changing the prototype layout.

## Rendering boundary

The prototype currently uses DOM items with optional optimized PNG sprites, so placement UX, artwork and data rules can be validated without adding a large rendering dependency. Gameplay and placement data must remain renderer-independent. A later PixiJS renderer may replace the DOM layer without moving production, unlock, wellbeing or save rules into the renderer.

## Top-down building asset prototypes

- Initial transparent prototypes live in `img/Buildings/Camp Prototypes/` for the Cardboard Box and Job Center. The V4 master files are `Cardboard Box_Camp_TopDown_Prototype_v4.png` and `Job Center_Camp_TopDown_Prototype_v4.png`; V1 through V3 remain available only for visual comparison.
- The Camp renderer uses the optimized alpha PNG derivatives `Cardboard Box_Camp_TopDown_Game_v1.png` and `Job Center_Camp_TopDown_Game_v1.png`. Keep the larger V4 files as visual masters; do not load them in the live board or palette.
- The Cardboard Box V4 has a 2-column by 1-row footprint at rotation 0. Its roof ridge runs left-to-right, perpendicular to the V2 ridge, and the roof silhouette must remain a single clean shape without overlapping side flaps or duplicated roof panels. Its near-top-down view keeps a subtle angle: the roof remains dominant while a narrow strip of the entrance-facing wall is visible at the bottom.
- The Job Center V4 has a 5-column by 6-row footprint at rotation 0. `Camp_Buildings_Footprints_Rotation_Preview_v4.png` shows both V4 sprites and their occupied grid cells at 0, 90, 180 and 270 degrees.
- Rotation 0 faces the entrance toward the bottom of the map. A building uses the same transparent source sprite for all four directions and rotates mechanically by 90-degree steps rather than requiring four separately generated directions.
- Rotations 90 and 270 swap the logical footprint width and height: Cardboard Box becomes 1 by 2, and Job Center becomes 6 by 5. Collision checks and placement bounds must use the rotated footprint, not the unrotated catalog dimensions.
- The sprites use a near-vertical orthographic view, neutral ambient lighting and no baked directional shadow. A future generic shadow must remain outside the rotating sprite layer.
- Building identity should come from roof shape, material, repairs and simple roof emblems rather than generated text. The Job Center prototype uses a paw-and-tools roof mark; the Cardboard Box preserves its tape and blue repair patch.
- Keep the source PNG centered with transparent padding so roof edges and entrances remain inside the canvas at every rotation.

## Placement rules

- Coordinates represent the top-left cell of an item's footprint.
- Every footprint must remain within columns 0–19 and rows 0–29.
- Footprints may not overlap.
- Buildings, decorations and roads currently share the same occupancy layer, so roads cannot pass underneath another item.
- A moved item is ignored by collision checks against its own previous position.
- Corrupt, unknown, duplicate, overlapping or out-of-bounds persisted prototype entries are discarded during normalization.
- Rotatable items persist a normalized `rotation` value of 0, 90, 180 or 270 degrees. Invalid or missing values normalize to the nearest valid quarter-turn, with legacy layouts defaulting to 0.
- Rotation is accepted only when the rotated footprint remains inside the board and does not overlap another item.

## Mobile interaction

- The normal view never captures a drag for layout editing.
- `Edit camp` locks page scrolling and gives the map the full viewport, while preserving safe-area padding around the top actions and bottom category dock.
- The full-width mobile board is allowed to exceed the available editor height. Its surrounding viewport scrolls vertically, and unselected elements use `touch-action: pan-y` so a gesture that starts on them can still navigate the map.
- A movement of more than 8 px before the 450 ms selection delay cancels the hold and remains a navigation gesture. Once selected, the element uses the dedicated drag interaction.
- Tapping an empty cell places the active building or decoration.
- Dragging with the Road tool paints a continuous orthogonal/diagonal sampled path; dragging with the road eraser removes road tiles.
- The Edit board uses `touch-action: none` so road painting and item dragging cannot hand the gesture to the browser; its surrounding full-screen viewport owns any required scrolling.
- Placement snaps to the logical grid.
- The visual hit area is the complete footprint.
- No camera, zoom or free-pixel placement is included yet.

## Decisions required before production integration

- Final terrain dimensions and whether 20 × 30 remains authoritative.
- PixiJS adoption and asset-atlas pipeline.
- Building and decoration catalog, footprints, anchors and optional rotations.
- Whether rearrangement remains free once the dedicated Edit mode moves from prototype to production.
- Migration from prototype-local storage to the versioned game save.
- Wellbeing rules, decoration limits, path reservations and future Cat navigation.
