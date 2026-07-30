# V3 Legacy freeze

## Final baseline

V3 Legacy restores the complete tree from commit `b81dfc2`, the published
v0.0037 release before the development-only Camp prototype was introduced.
The freeze is committed as a normal descendant of the previous V3 `main`
branch, so Git history remains linear and no force-push is required.

The only intentional differences from the original v0.0037 tree are:

- a permanent top-of-game Legacy announcement;
- CSS and JavaScript cache-busting increments for those changes;
- a monotonic technical update version;
- documentation and regression coverage for the freeze.

No Camp source, interface, assets or tests belong in V3 Legacy.

## Player and update versions

The player-facing game version remains `v0.0037` in Settings, release notes and
the changelog.

`version.json` uses technical version `0.0039`. `GAME_UPDATE_VERSION` in
`jeu.js` uses the same value. This is required because players may still have
the previously published v0.0038 page open:

1. the v0.0038 client sees manifest `0.0039` and reloads once after an AFK return;
2. the final Legacy client compares `0.0039` with `0.0039` and does not reload again;
3. the interface continues to display v0.0037.

Never reduce the manifest to `0.0037`: clients already on v0.0038 would treat
it as older and could remain on the Camp-containing build indefinitely.

Release-note startup is downgrade-safe. A save that already recorded a newer
displayed version does not reopen older v0.0037 notes after the technical
reload. Save format version 2 and the `chatonClicker` key remain unchanged.

## Permanent banner

The non-dismissible `#legacy-version-banner` is the first visible element in
the body and reads:

> This version will no longer be updated - a new one is coming shortly with hard reset via a new link.

Do not add a V4 URL until the owner explicitly declares the V4 Playtest mature
enough for existing players.

## Repository boundary

- V3 Legacy: `Xevyas/Cat-inc-V3`
- private V4 source: `Xevyas/Cat-Inc-V4-DEV`
- public V4 deployment target: `Xevyas/Cat-Inc-V4-Playtest`

V3 Legacy must not receive V4 commits. Future emergency fixes require explicit
owner approval and must preserve the displayed v0.0037 Legacy identity unless
the owner decides otherwise.
