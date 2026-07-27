# Mini-Games — Design, Rules and Variables

This document is the source of truth for every mini-game currently implemented in Cat Inc. Update it whenever a mini-game, its difficulty, its reward, or its failure rules change.

## Overview

| Mini-game | Trigger | Core interaction | Failure consequence |
|---|---|---|---|
| Catch a Cat | `Catch the Cat`, for Bernardo, Mochi and Luna | Stop a bouncing cursor inside the cat target | Restart the same cat's cooldown |
| Purrsuasion | `Recruit the Cat`, from cat 4 onward | Hold and release to manage Trust | Restart the same cat's cooldown |
| Bird | First Bernardo event after 5 minutes, then random events every 5–15 minutes | Stop a bouncing cursor inside the bird target | Work production boost; schedule another bird |
| Book lesson | `Learn` after a book's Study timer | Place every word in the correct sentence blank | Clear all blanks and retry immediately |

## Shared architecture

- Mini-games are vanilla HTML/CSS/JavaScript dialogs defined in `index.html`, styled in `style.css`, and orchestrated in `jeu.js`.
- Dialogs use `ouvrirDialogueModal()` / `fermerDialogueModal()` for focus placement, focus containment and Escape behavior.
- Every mini-game must also enter and leave the shared foreground runtime through `ouvrirSessionMiniJeu()` / `fermerSessionMiniJeu()`. The runtime allows only one active mini-game, owns every `requestAnimationFrame` loop, cancels previous loops before starting another and performs one clean UI refresh after closing.
- The normal simulation continues while a mini-game is open, but `renduDynamique()` records a pending foreground refresh instead of updating the background UI. Expensive fog/sphere animations are also suspended. Mini-game-local DOM updates remain active, and closing the mini-game performs one clean refresh when needed.
- Animated mini-games use `demarrerAnimationMiniJeu()`, whose frame delta is capped at 50 ms and whose clock/layout measurements reset after `visibilitychange`, `pageshow`, focus or resize. This is required for iOS/WebKit suspension safety.
- Moving cursors and meters must use compositor-friendly `transform` updates instead of changing layout positions every frame.
- Static mini-games such as Book lessons still use the shared foreground runtime even though they do not create an animation loop.
- Mouse, touch and keyboard controls must remain equivalent.
- Closing Catch or Purrsuasion is a gameplay failure, not a pause.
- Cache versions for `style.css` and `jeu.js` in `index.html` must be bumped whenever their mini-game UI changes.
- Catch and Purrsuasion use the persisted `prochainVisageChaton`, ensuring the portrait shown before the result is exactly the portrait assigned to the resulting cat.

### Shared visual language

Purrsuasion is the visual reference for the action mini-games: a white rounded panel, an orange left-aligned title, a compact status badge, a short instruction, a labelled game track, a full-width orange primary action and a discreet underlined abandonment action. Catch a Cat and Bird follow this presentation without changing their own target ranges, cursor speeds, timers, failure rules or rewards.

---

## 1. Catch a Cat

### Scope and cooldown

Catch applies only to the first three cats:

| Cat | Cursor speed |
|---|---:|
| Bernardo | 60% of the track per second |
| Mochi | 80% of the track per second |
| Luna | 100% of the track per second |

On a fresh game, Bernardo's cooldown starts only when the introduction is closed. Its raw duration is 5 seconds. `Start over` immediately reopens the introduction and leaves this timer stopped until the player closes it.

The passive cooldown then follows the standard recruitment formula in `dureeBrute()` and the speed bonuses in `vitesseAttrapage()`. It continues across reloads and offline time using the shared 10% AFK ratio (capped at 10 hours of real absence), but never grants a cat automatically.

### Progress UI

- The green cooldown bar is always visible.
- A 30px circular portrait follows its leading edge.
- When ready, the bar stays at 100%, the portrait remains at the far right, and `Catch the Cat` appears.
- `prochainVisageChaton` persists the upcoming portrait in the save.

### Timing game

| Variable | Value |
|---|---:|
| Track target | 40–60% |
| Attempts | 1 |
| Cursor behavior | Bounces at 0% and 100% |
| Portrait | Bernardo, Mochi or Luna fixed face |

The player presses `CATCH!` once. A cursor inside 40–60% succeeds; any other position fails.

### Failure conditions

- Missing the target.
- Clicking `Give up`.
- Clicking the modal backdrop.
- Pressing Escape.

Failure closes the game and calls `demarrerRechargeCatch()` without incrementing `clicCount`, so the same cat's cooldown restarts. Success calls `terminerSequence()`, adds the cat, increments `clicCount`, and starts the next cat's cooldown.

Main functions: `ouvrirMiniJeuCatch()`, `clickerCatCatch()`, `echouerMiniJeuCatch()`.

---

## 2. Purrsuasion Recruit

### Scope

Purrsuasion replaces direct recruitment from cat 4 onward. When the passive bar is ready, `Recruit the Cat` opens `#recruit-minijeu`. Opening the modal does not restart or reset the visible cooldown behind it; only the result starts a new cooldown.

### Dialogue presentation

Every attempt chooses one of ten visitor/Bernardo pairs from `RECRUIT_DIALOGUES`:

- the visitor speaks first in the upper grey bubble, pointing right;
- Bernardo answers on the same subject in the lower cream bubble, pointing left;
- `choisirDialogueRecruit()` prevents the same pair from appearing twice consecutively;
- both bubbles receive speaker-aware ARIA labels;
- future dialogue additions must remain short enough for the mobile two-row layout and must always be visitor/reply pairs.

### Trust controls

The 10-second timer and cursor movement are paused until the first press on `HOLD TO START YOUR PITCH`.

| Variable | Value |
|---|---:|
| Starting Trust | 18 |
| Interested zone | 42–68 |
| Base rise while holding | 42 points/s |
| Base fall while released | 20 points/s |
| Required time in Interested | 2 cumulative seconds |
| Time limit | 10 seconds |

Holding the button raises Trust; releasing it lowers Trust. Mouse/pointer, touch and Space/Enter use the same state through `definirPitchRecruitActif()`.

### Difficulty

Cat 4 starts at Difficulty 1. Every recruited cat increases difficulty by 1 and speeds up both cursor directions by 10%.

```text
difficulty = max(1, etat.chatons - 2)
speed multiplier = 1 + (difficulty - 1) × 0.1
```

Examples:

| Incoming cat | Difficulty | Cursor speed |
|---:|---:|---:|
| 4 | 1 | ×1.00 |
| 5 | 2 | ×1.10 |
| 6 | 3 | ×1.20 |

The difficulty and multiplier are displayed at the top of the modal.

### Outcomes

Success requires 2 cumulative seconds inside `INTERESTED`. Touching 68 and entering the red `TOO PUSHY` zone fails immediately. Timing out, `Give up`, backdrop click or Escape also fails.

Only the outcome starts the cooldown:

- success calls `terminerSequence()` and starts the next cat's cooldown;
- failure calls `demarrerRechargeCatch()` without incrementing `clicCount`, restarting the missed cat's cooldown.

Both outcomes open `#recruit-result-popup` with the relevant persisted portrait:

- success: `<Name> is convinced and agrees to join the Gang!` with `✅_Final.png`;
- failure: `<Name> wasn't convinced. Try again later.` with `Red Cross_Final.png`.

The portrait sits at 84px inside a 108px circular wrapper, preventing ears from being clipped or extending outside the frame. A 34px outcome badge overlaps the bottom-right corner.

Main functions: `ouvrirMiniJeuRecruit()`, `demarrerTimerMiniJeuRecruit()`, `echouerMiniJeuRecruit()`, `reussirMiniJeuRecruit()`, `ouvrirPopupRecruitResult()`.

---

## 3. Bird

### Trigger

| Variable | Value | Function |
|---|---:|---|
| First delay | Exactly 5 minutes | persisted `birdPremierSpawnTs` / `planifierOiseau()` |
| Maximum delay | 15 minutes | `planifierOiseau()` |
| Formula | `Math.random() * 600 + 300` seconds | `planifierOiseau()` |

Bird scheduling is inactive until the Work tab is unlocked at three cats. The first event then uses the persisted five-minute timestamp. The first mini-game is a forgiving tutorial: its cursor is slow, its target is wide, a badly timed `CATCH!` keeps the game open for another try, and the skip control is hidden. After the first success, `_apresMinijeuOiseau()` schedules another random event. A normal-game miss increments the persisted Bird pity counter and reduces the next cursor speed by 5%, up to a maximum total reduction of 35%. A successful catch resets that counter to zero. The forced Bird button is a development tool and appears only with `?debug=1`.

For post-tutorial events, the header displays the current pity as `X fails : Y% speed reduced`; the indicator is hidden during the forgiving first tutorial.

The first Bird event displays its Story before launching the game. Later events open the game directly.

### Slider

| Variable | Normal |
|---|---:|
| Card width | 620px |
| Cursor speed | 150%/s before pity |
| JS success range | 45–55% |
| Green target width | 60px fixed |

The cursor starts at 0% and bounces at both ends. The target is centered at `left: calc(50% - 30px)`. Bernardo no longer has a sphere perk that changes Bird difficulty; future mini-game improvements are reserved for Engineers.

For the first tutorial attempt, the card uses a 560px layout, a 35%/s cursor, a 60% target and a 20-80% success range. A miss never closes the modal.

### Controls and result

| Input | Result |
|---|---|
| `CATCH!`, Space or Enter | Resolve the current cursor position |
| `Let it fly away` | Skip with no reward |

Success sets `etat.workBoostFinTs = Date.now() + 60000`, granting Work production ×10 for 1 minute. The boost applies to Work gathering and processing, but not to exploration or offline catch-up. `#work-boost-indicator` shows the remaining duration below Resources on mobile and below the main tab rail on desktop.

The success popup must close before `_apresMinijeuOiseau()` schedules the next bird.

The first success popup reads: “Great catch! This mini-game boosts worker production for a short time. Other bird types may appear in the future, and it will be harder from now on.”

Main functions: `planifierOiseau()`, `ouvrirBirdMiniJeu()`, `clickerBird()`, `skipBird()`, `_apresMinijeuOiseau()`.

---

## 4. Book sentence lessons

### Learning flow

Every learnable book follows:

```text
Study timer → Studied → Learn → sentence mini-game → content unlock
```

Study completion stores the item id in persisted `etat.itemsEtudies` but does not apply the book's main gameplay unlock. `Learn` opens `#book-learning-modal` over `img/resources/Open Book.png`; only a correct sentence unlocks the book. The Daily Purpose therefore unlocks the persisted daily quest panel only after its Learn mini-game is solved.

### Interaction

- All answer words are shuffled.
- Selecting a word places it in the first empty blank.
- Selecting a filled blank removes its word.
- `Check answer` becomes available only when every blank is filled.
- An incorrect order shows `Incorrect. Try again.`, clears every blank, and gives no hint or penalty.
- A correct order calls `apprendreLivre(itemId)` and applies the existing unlock.

Current lessons:

| Book | Blanks | Study duration |
|---|---:|---:|
| School Guide | 4 | 60 seconds |
| Fishing Guide for Dummies | 4 | 1 hour |
| Construction Plan | 4 | 1 hour |
| Stone Craft Guide | 4 | 1 hour |
| Corporate Seminar Booklet | 6 | 2 hours |
| The Daily Purpose | 6 | 1 hour |

### Adding a future book

Define all lesson data in `ITEMS[itemId]` inside `js/data/content.js`:

```js
studyDuration: 3600000,
learningGame: {
  phraseParts: ["Text before ", ", text after ", "."],
  answers: ["first", "second"]
},
actions: [{ id: "study", label: "Study (1h)" }]
```

`phraseParts.length` must equal `answers.length + 1`. Do not create a separate modal or timer for a new book.

Main functions: `actionItem()`, `terminerApprentissage()`, `ouvrirMiniJeuLivre()`, `renduMiniJeuLivre()`, `verifierMiniJeuLivre()`.

---

## Maintenance checklist

Whenever a mini-game changes:

1. Update its constants and behavior in this document.
2. Update or add a structural regression test in `tests/ux-critical.test.js`.
3. Preserve mouse, touch and keyboard parity.
4. Verify failure paths restart the correct timer or event.
5. Verify dialog focus and Escape behavior.
6. Verify desktop and mobile layouts.
7. Bump the relevant browser cache version in `index.html`.
