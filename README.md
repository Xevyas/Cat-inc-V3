# Cat Inc

Cat Inc is a vanilla HTML/CSS/JavaScript incremental game. It has no build step and no runtime dependency.

## Run the game

Open `index.html` in a browser for the normal player experience.

For local development, start a static server from this folder:

```powershell
python -m http.server 5500
```

Then open `http://localhost:5500/`.

The development controls are intentionally hidden during normal play. Open `http://localhost:5500/?debug=1` to show the 1×–1000× speed selector and the forced Bird button. The debug flag is never stored in saves.

## Validate a change

Node.js is only required for the test suite:

```powershell
node --test --test-reporter=spec tests\*.test.js
```

The tests cover assets and filename case, CSS structure, extracted modules, production and offline equivalence, current and legacy saves, corrupted saves, rendering contracts, responsive behavior and critical accessibility rules.

Before publishing, follow [Documentation/RELEASE_VALIDATION.md](Documentation/RELEASE_VALIDATION.md). Never publish or bump cache versions unless the owner explicitly requests it.

## Project map

- `index.html`: document structure, dialogs and story screens.
- `style.css`: desktop and responsive presentation.
- `jeu.js`: game orchestration, rendering and gameplay systems.
- `js/`: extracted configuration, content, state, save, production and DOM helpers.
- `img/`: runtime visual assets.
- `tests/`: dependency-free Node.js regression suite.
- `Documentation/`: design, maintenance and release notes.

The rendering cadence and mobile performance rules are documented in [Documentation/rendering_and_performance.md](Documentation/rendering_and_performance.md). Read it before adding a recurring timer, animation or new screen.
