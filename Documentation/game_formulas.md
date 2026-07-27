# Cat Inc — Game Formulas Reference

All values pulled directly from `V3/jeu.js`. Update this file whenever a formula changes.

## Global Cat action rule

Each Cat may hold one action at a time. The reservation covers recipe work,
manager slots, running zone/campaign/scouting missions, book Study timers and
Job Center/Laboratory training. Assignment and launch handlers recheck the
reservation before writing state. On load and during rendering,
`normaliserOccupationsChatons()` repairs legacy duplicate assignments by
keeping the running action and clearing later assignments; Engineers are
passive and are removed from stale action slots.

---

## Recruiting a Kitty

### Recruit duration

Three-phase formula: ×3 per cat up to cat 11, ×2 through cat 16, then ×1.5 per cat to soften late-game growth.

```
n ≤ 10  →  rawDuration = 5 × 3^n
n ≤ 15  →  rawDuration = 5 × 3^10 × 2^(n−10)
n > 15  →  rawDuration = 5 × 3^10 × 2^5 × 1.5^(n−15)

effectiveDuration = max(1, rawDuration / recruitSpeedMultiplier)
```

`n` = number of kitties already caught (`etat.clicCount`).

| Cat # | n | Raw duration | Note |
|-------|---|-------------|------|
| 1st   | 0 | 5s | |
| 2nd   | 1 | 15s | |
| 3rd   | 2 | 45s | |
| 4th   | 3 | 135s (~2min) | |
| 5th   | 4 | 405s (~7min) | |
| 6th   | 5 | 1 215s (20min) | |
| 11th  | 10 | 295 245s (3.4 days) | ← last ×3 step |
| 12th  | 11 | 590 490s (6.8 days) | first ×2 step |
| 16th  | 15 | 9 447 840s (109 days) | last ×2 step |
| 21st  | 20 | 71 744 535s (2.3 years) | first ×1.5 step |
| 26th  | 25 | 544 810 063s (17.3 years) | |
| 31st  | 30 | 4 137 151 413s (131.1 years) | |

The effective duration is divided by the recruit speed multiplier (see below). Minimum: 1 second.

### Recruit cost
No resource cost. Time only.

---

## Cathouses

Cardboard Boxes and Wood Cathouses use the same scalable formula, where `n` is the number of that specific house already built:

```
exponent = 1.7 / 1.6 / 1.55 / 1.5
exponentCost = ceil(exponent^n)
costMultiplier = 1 / 0.5 / 0.25
finalCost = max(1, ceil(exponentCost × costMultiplier))
```

The exponent comes from `EXPO REDUCED I/II/III`. `COST REDUCED I` halves the result and `COST REDUCED II` halves it again.

### Cardboard Box
```
cost = ceil(1.7^n)    Cardboard Planks
```
| Box # | Cost |
|-------|------|
| 1st   | 1 plank |
| 2nd   | 2 planks |
| 3rd   | 3 planks |
| 4th   | 5 planks |
| 5th   | 8 planks |
| 6th   | 14 planks |

Each box adds **+1 s/s** to recruit speed. `BOX SPEED` multiplies this base contribution by 3.

### Wood Cathouse
```
cost = ceil(1.7^n)    Basic Wood Planks
```
Same scaling table as Cardboard Boxes but costs Basic Wood Planks. Each Wood Cathouse adds **+5 s/s** to recruit speed. `WOOD SPEED` multiplies this base contribution by 2. With `BOX BOOST`, every Cardboard Box adds 5% to every Wood Cathouse contribution, producing the additive multiplier `1 + 0.05 × boxCount`.

### Stone Cathouse
```
cost = ceil(5 × 1.7^n) Basic Wood Planks  +  ceil(5 × 1.7^n) Pebble Bricks
```
| House # | Wood Planks | Pebble Bricks |
|---------|-------------|---------------|
| 1st     | 5           | 5             |
| 2nd     | 9           | 9             |
| 3rd     | 15          | 15            |
| 4th     | 25          | 25            |

Each Stone Cathouse adds **+10%** to recruit speed (multiplicative with the wood/cardboard bonus).

### Solid Stone Cathouse
```
cost = ceil(10 × 1.7^n) Basic Wood Planks  +  ceil(5 × 1.7^n) Rock Bricks
```
| House # | Basic Wood Planks | Rock Bricks |
|---------|-------------------|-------------|
| 1st     | 10                | 5           |
| 2nd     | 17                | 9           |
| 3rd     | 29                | 15          |
| 4th     | 50                | 25          |

Each Solid Stone Cathouse adds **+40%** to recruit speed. Its percentage is added to the Basic Stone Cathouse percentage before the combined Stone Houses multiplier is applied.

### Recruit speed multiplier (full formula)
```
boxBase    = 1 × (BOX SPEED learned ? 3 : 1)
woodBase   = 5 × (WOOD SPEED learned ? 2 : 1)
boxBoost   = BOX BOOST learned ? 1 + 0.05 × boxes : 1
woodBonus  = (boxes × boxBase) + (woodHouses × woodBase × boxBoost)
adjusted   = woodBonus × builderManagerBonus
stoneBonus = (basicStoneCathouses × 0.10) + (solidStoneCathouses × 0.40)
houseMult  = (1 + adjusted) × (1 + stoneBonus)
glBonus    = gangLeaderBonus()   ← only if gl-rec sphere perk is learned, else 1
speedMult  = houseMult × glBonus
```

`gangLeaderBonus() = 1 + (n−1)^1.3 × 0.015 × (1 + Bernardo.level × 0.12)` where `n` = total cat count.

---

## Buildings

| Building | Cost |
|----------|------|
| Job Center | 10 Pebble Bricks + 1 Basic Wood Plank |
| Training Center | 10 Rock Bricks + 20 Basic Wood Planks |

No scaling — fixed one-time cost.

---

## XP & Leveling

### XP from food
| Food | XP |
|------|----|
| Catnip Salad | 1 |
| Grilled Anchovy | 10 |
| Human Leftovers | 1 |

No passive XP. XP is earned only by feeding.

Food Management (the `gl-qol` perk in Gang) can distribute a selected percentage of the available food XP either evenly or by prioritizing the lowest-level Cats. Food is consumed in whole units, so floor division can leave part of the selected XP budget unused. A completed distribution opens an in-game summary showing global XP/level/Cat totals, then each recipient's food-item count, XP received and old-to-new level progression.

### XP needed per level
```
xpNeeded(n) = max(n + 1, ceil(n^1.7))
```
`n` = current level (level 0 → 1 needs `xpNeeded(0)`, etc.).

| Current level | XP to next level |
|--------------|-----------------|
| 0            | 1               |
| 1            | 2               |
| 2            | 3               |
| 3            | 7               |
| 4            | 13              |
| 5            | 21              |
| 6            | 31              |
| 8            | 57              |
| 10           | 79              |
| 15           | 167             |
| 20           | 287             |

Growth is slightly super-linear (exponent 1.7). The `n+1` floor keeps early levels reachable quickly.

---

## Jobs

### Training time
All trainable jobs: **fixed 3600 seconds (1 hour)**. No scaling by level or number of kitties.

Gang Leader: 0 seconds (auto-assigned to Bernardo, not trained).

---

## Production

Each Work slot owns one selected recipe and, optionally, one assigned Cat. The Cat completes two phases in order and loops automatically:

1. **Gathering** fills the recipe's private simple input.
2. **Processing** converts that private input into a globally stored finished resource.

Simple inputs never enter the shared inventory and cannot be used by another slot. Removing or replacing the Cat leaves the slot's private input, current phase progress and fractional output carry intact so another Cat can resume it. Changing or clearing the recipe discards those values; nothing is refunded.

From four Cats onward, active play can add a `2x` Manual Focus multiplier to one recipe slot. The gauge follows that slot's current phase, so the multiplier affects Gathering while Gathering is active and Processing while Processing is active. The recipe card reflects the active multiplier in that phase's displayed time, the complete cycle time and the projected production per minute; the top resource rate uses the same adjusted cycle.

### Gathering phase

```text
privateInputPerSecond = gatheringManagerSpeed
                      × gatheringManagerProdPerk
                      × 1.05^catLevel
                      × gangLeaderBonus
                      × temporaryWorkBoost
                      / secondsPerSimpleUnit
```

The default target is 10 private simple units. A qualified processing manager with `REDUCED COST I` changes the Gathering target to 8; `REDUCED COST II` changes it to 6. The latter requires the first level.

### Processing phase

```text
processingProgressPerSecond = processingManagerSpeed
                            × gangLeaderBonus
                            × temporaryWorkBoost
                            / secondsPerFinishedResource

finishedOutputPerCycle = 1.03^catLevel
```

Fractional finished output is stored in the slot's `outputCarry`; only whole units are added to the global inventory. Gathering and Processing therefore use the same Cat but retain their distinct level bonuses.

### Projected finished-resource rate

```text
gatheringDuration = effectivePrivateInputTarget / privateInputPerSecond
processingDuration = secondsPerFinishedResource
                   / (processingManagerSpeed × gangLeaderBonus × temporaryWorkBoost)

finishedOutputPerSecond = (1.03^catLevel) / (gatheringDuration + processingDuration)
```

Each family starts with two recipe slots. A learned manager `NEW SLOT` perk adds one persistent slot to its mapped Wood, Food or Rocks family. Rates from multiple slots assigned to the same recipe are additive. Active and offline production both call the same recipe engine.

### Manual Focus

Manual Focus unlocks at four Cats. Each click or tap on the currently active phase adds 0.8 seconds to a reserve capped at 30 seconds. While that reserve drains, the focused recipe receives the `2x` speed multiplier across both Gathering and Processing, so both displayed phase durations and the complete cycle time are reduced and its projected production per minute is doubled. The Gang Leader sphere can raise the power to `3x` (`MANUAL BOOST`) and then `4x` (`BOOST POWER`), raise capacity to 60 seconds (`CAPACITY`), and raise the charge to 2 seconds per click (`CLICK POWER`). The reserve is tied to one recipe slot and automatically follows its phase transitions and new cycles, even while another game tab is displayed. Clicking another recipe discards the previous reserve and starts the newly focused slot with that click's 0.8 seconds. It is transient runtime state, is not saved and never applies to offline production.

### Resource timings reference
| Recipe | Gathering timer | Processing timer | Private input target |
|--------|------------------|------------------|----------------------|
| Cardboard Planks | 60s / Cardboard Piece | 300s | 10 Cardboard Pieces |
| Basic Wood Planks | 300s / Basic Wood | 1500s | 10 Basic Wood |
| Catnip Salad | 120s / Catnip | 600s | 10 Catnip |
| Grilled Anchovy | 600s / Anchovy | 3000s | 10 Anchovy |
| Pebble Bricks | 180s / Pebble | 900s | 10 Pebbles |
| Rock Bricks | 900s / Rock | 4500s | 10 Rocks |

---

## Manager Bonus

```
managerBonus = managerMult × 1.05^managerLevel
```
Default `managerMult = 1.5` for all manager job families.

For the simple resource families, each learned `SPEED BOOST` level adds 25% after the manager's level bonus:
```
effectiveManagerBonus = managerBonus × 1.5   (perk learned)
```

The three simple resource spheres are available for Lumberjack (`Wood`), Farmer (`Food`) and Miner (`Rock`). Each has a learned `PROD SPEED` center, `PROD BOOST I/II` and `SPEED BOOST I/II`. Each level adds 25%, so level II brings the corresponding total to 50%; these perks affect only the raw family (`wood`, `food`, `rock`), not the processed families managed by Carpenter, Chef or Stonemason. In formula form, `effectiveManagerBonus = managerBonus x (1 + 0.25 x speedBoostLevels)`, and each learned production level multiplies the Gathering rate by the same 1.25 increment.

Complex resource managers use the same level-adjusted speed formula. Carpenter, Chef and Stonemason have two `REDUCED COST` levels that change the input ratio from `10:1` to `8:1`, then `6:1`, for their families (`sawmill`, `catchen`, `pawsonry`). Their two `SPEED BOOST` levels add 25% each to the manager's granted speed boost, for a total 50% increase.

### Wood Builder sphere

The Builder's three `EXPO REDUCED` levels progressively change both Wood House exponents from `1.7` to `1.6`, `1.55` and `1.5`. `COST REDUCED I/II` then multiply the rounded exponent cost by `0.5` or `0.25`, with a minimum final cost of 1.

`GLOBAL SPEED I/II/III` add 25% each to the Wood Builder's granted manager speed, for totals of 25%, 50% and 75%. `BOX SPEED` triples the base Cardboard Box contribution, `WOOD SPEED` doubles the base Wood Cathouse contribution, and `BOX BOOST` applies the additive multiplier `1 + 0.05 × boxCount` to Wood Cathouse output.

`AUTO BUILD` is persisted as a toggle and builds each eligible Wood House only when its theoretical cost is strictly below half of the corresponding available Planks pool (`cardboardPlanks` for Cardboard Boxes, `basicWoodPlanks` for Wood Cathouses). `PERFECT BUILD I/II` prevent material consumption for automatically built Cardboard Boxes or Wood Cathouses respectively; the theoretical cost still controls eligibility and manual construction always consumes materials.

- Gathering managers apply to the private Gathering phase of every recipe slot in their family. Processing managers apply to the Processing phase; their `REDUCED COST` levels change only the private input target, while their `SPEED BOOST` levels change only processing speed.
- Builder manager: amplifies wood/cardboard house recruit speed bonus (not additive with other managers).

| Manager level | Bonus multiplier |
|--------------|-----------------|
| 0            | 1.50×           |
| 1            | 1.58×           |
| 5            | 1.91×           |
| 10           | 2.44×           |
| 20           | 3.98×           |

---

## Gang Leader Bonus

```
catBonus   = (totalCats - 1)^1.3 × 0.015
glBonus    = 1 + catBonus × (1 + leaderLevel × 0.12)
```

Applied multiplicatively to both phases of every active recipe slot globally.

| Total cats | Leader lv 0 | Leader lv 5 | Leader lv 10 |
|-----------|------------|------------|-------------|
| 2         | 1.015      | 1.024      | 1.033       |
| 5         | 1.077      | 1.123      | 1.169       |
| 10        | 1.188      | 1.300      | 1.413       |
| 20        | 1.436      | 1.697      | 1.959       |

---

## Exploration & Campaigns

### Success chance
```
explorationPower = sum of (kittyLevel + 1) for each kitty in party
successChance    = min(1, explorationPower / difficulty)
```

- Each kitty contributes `level + 1` EP (a level-0 kitty counts as 1 EP).
- If total EP ≥ difficulty: guaranteed success.
- Zone explorations, campaigns, and scoutings all resolve with this same probability.
- Mission power and success chance are frozen at launch; feeding or leveling a cat during the timer does not alter the active roll.
- Zone and campaign parties are released when their timer ends. Results then wait for player confirmation.
- A successful zone becomes explored only after `Reveal the explored zone` is pressed.
- A successful campaign grants its stored reward and becomes completed only after `Claim campaign reward` is pressed.
- Failed zones and campaigns expose `Try again`; the former party is preselected when its cats are still available.
- A failed scouting run adds to the pending failed counter, writes the completion to Logs, and automatically starts the next run without a toast notification.

### Explorator job effect
Having an Explorator in the party **halves the duration** of zone explorations, campaigns, and scoutings.

### Scouting rewards
Weighted random roll (current scoutings):

| Outcome | Weight |
|---------|--------|
| 1× reward | 70%  |
| 2× reward | 20%  |
| 3× reward | 10%  |

Scouting rewards are not added to resources after each run. Every scouting owns a persisted pending pool with successful, failed, Regular, Lucky, Super Lucky, Doubled and Tripled counters plus aggregated resource quantities. Claiming transfers the complete pool and clears its counters without interrupting the active scouting timer. For a two-outcome table, the common outcome is Regular and the rare outcome is Super Lucky.

Explorator reward perks resolve in this order:

```
rewardEntry = weightedRoll(table after CAT FOOD weight multiplier)

if random() < doubleChance:
    multiplier = random() < conditionalTripleChance ? 3 : 2
else:
    multiplier = 1

wantedQuantity = rewardEntry.quantity × multiplier
```

`doubleChance` is 0%, 20% or 40%. `conditionalTripleChance` is 0%, 15% or 30% and is rolled only after Double succeeds. With both branches maximized, the final probabilities are therefore 60% at `×1`, 28% at `×2`, and 12% at `×3`.

For a Canned Cat Food reward with a daily scouting stock:

```
if remainingStock == 0:
    awarded = 0
else if random() < luckyFoodChance:
    awarded = wantedQuantity
    remainingStock is unchanged
else:
    awarded = min(wantedQuantity, remainingStock)
    remainingStock -= awarded
```

`luckyFoodChance` is 0%, 15% or 30%. It does not make an empty stock available again. `CAT FOOD I/II` changes only the chance of selecting the Canned Cat Food entry; `LUCKY FOOD I/II` changes only whether a selected reward consumes its daily stock. The Doubled and Tripled counters are based on the final awarded quantity after stock limiting, not merely on the multiplier that was rolled.

---

## Offline Progression

```
effectiveAfkCap = MAX_AFK_SECONDS + (sum of Rank 1 Camp Engineer cat levels × 6 minutes)
realTimeCounted = min(realElapsedSeconds, effectiveAfkCap)
afkRatio = min(1, 0.10 + (sum of Rank 2 Camp Engineer cat levels × 0.005))
simulatedTime = realTimeCounted × afkRatio
```

- Minimum gap before offline progress applies: **60 seconds**.
- Simulated time is split into up to 2000 simulation chunks.
- `MAX_AFK_SECONDS` is currently **10 hours**. Only Rank 1 Camp Engineers add 6 minutes per cat level to this cap. Time away beyond the resulting cap is ignored.
- `VITESSE_HORS_LIGNE` is currently **0.10**. Rank 2 Camp Engineers add 0.5 percentage point per cat level to that base ratio, capped at 100%; the resulting ratio is used for all AFK progression.
- Every Cat has a global level cap of **100**, including engineers. Rank 2 Camp Engineers therefore contribute at most 50 percentage points each to the base AFK ratio.
- The same simulated time advances Work gathering/processing, catch/recruit cooldowns, campaigns, zone explorations, scoutings, Study/Learn timers, Job Center training and Laboratory engineer training.
- Catch/recruit never grants a cat automatically while away; it only becomes ready for the player's action.
- Mission power and success rates remain frozen at launch. AFK processing only advances their timers and resolves completed missions into their normal pending reward state.

---

## Summary: Level Scaling at a Glance

| Effect | Formula | Per level |
|--------|---------|-----------|
| Gathering output qty | `1.05^level` | +5% |
| Processing output qty | `1.03^level` | +3% |
| Manager speed bonus | `1.5 × 1.05^level` | +5% on base 1.5× |
| Builder manager (recruit speed) | `1.5 × 1.05^level` | +5% on base 1.5× |
| Gang Leader gang bonus | `× (1 + leaderLevel × 0.12)` | +12% on gang bonus |
| XP to next level | `ceil(n^1.7)` | super-linear |
