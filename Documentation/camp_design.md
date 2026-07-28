# Base Camp design

This document is the source of truth for the future player-customizable Base Camp and its current development prototype.

## Current prototype

- The main `Camp` tab exists only when the URL contains `?debug=1`.
- The logical camp is an orthogonal grid with **20 columns and 30 rows**.
- `js/ui/camp.js` owns the grid dimensions, placeholder footprints, collision checks and persisted-layout normalization.
- The first building placeholders are Sawmill (4 × 4), Kitchen (3 × 4) and Training Center (4 × 3).
- The first decoration placeholders are Tree (2 × 2) and Cat Toy (1 × 1). They currently have no wellbeing effect.
- Roads occupy one cell. Dragging the Road tool paints every crossed cell, including interpolated cells skipped by a fast pointer movement. Adjacent north/east/south/west road tiles connect visually.
- The road eraser removes only road tiles crossed by the pointer. Roads currently have no pathfinding, access or production effect.
- The normal Camp view is interaction-only: tapping an element can open or trigger its future gameplay action, but it cannot place, move or remove layout items.
- `Edit camp` opens the same map as a full-screen CSS overlay. This state does not use the browser Fullscreen API, so it remains reliable on iPhone browsers and can preserve the normal page lifecycle.
- Three round buttons stay at the bottom of Edit mode. Buildings, Decorations and Paths each open only their own available-item sheet above the dock; selecting a tool closes the sheet so the map is immediately usable.
- In Edit mode, players can choose a building or decoration, tap the grid to place it, drag an existing item, move a selected item with the arrow keys, remove it or clear the prototype.
- The prototype layout uses the dedicated `catIncCampPrototypeLayoutV1` local-storage key. It is deliberately excluded from `etat`, save export/import, AFK progression and production.
- The renderer has no recurring timer or animation loop. It rebuilds only after opening the Camp tab, changing Edit/menu state or changing the prototype layout.

## Rendering boundary

The prototype currently uses DOM placeholders so placement UX and data rules can be validated without committing to final artwork or adding a large rendering dependency. Gameplay and placement data must remain renderer-independent. A later PixiJS renderer may replace the placeholder layer without moving production, unlock, wellbeing or save rules into the renderer.

## Placement rules

- Coordinates represent the top-left cell of an item's footprint.
- Every footprint must remain within columns 0–19 and rows 0–29.
- Footprints may not overlap.
- Buildings, decorations and roads currently share the same occupancy layer, so roads cannot pass underneath another item.
- A moved item is ignored by collision checks against its own previous position.
- Corrupt, unknown, duplicate, overlapping or out-of-bounds persisted prototype entries are discarded during normalization.
- Building rotation is not part of the first prototype.

## Mobile interaction

- The normal view never captures a drag for layout editing.
- `Edit camp` locks page scrolling and gives the map the full viewport, while preserving safe-area padding around the top actions and bottom category dock.
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
