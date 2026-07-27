# Jobs and Engineers

This document is the quick reference for every learned job, manager effect, sphere perk and passive engineer currently implemented in Cat Inc.

The gameplay data remains authoritative in `js/data/content.js`, `jeu.js` and `js/data/config.js`. Update this document whenever a job, perk, rank, cost or base effect changes.

## Shared rules

- A normal Job Center training takes 1 hour.
- The first Job Center training must be **Explorator**. Once it has been learned, the other available jobs can be trained.
- A manager is not a worker. Its bonus applies only while its Cat is assigned to the dedicated Manager slot for the matching family in Work.
- Only one Cat can hold each manager job. The same manager job cannot be trained twice.
- Engineers are passive specialists. An engineer cannot be assigned to Work, Exploration, campaigns, scoutings or manager slots.
- Canned Cat Food is the currency used to learn sphere perks. Level I side perks cost 1 Canned Cat Food, level II side perks cost 2, and every `NEW SLOT` perk costs 3.

## Normal jobs

| Job | Area affected | Base effect | Notes |
|---|---|---|---|
| Explorator | Exploration map, campaigns and scoutings | Halves all Exploration mission times | Required in the first slot of zone-reveal missions. The zone mission slot accepts an Explorator, or Bernardo with the `EXPLO` perk. |
| Lumberjack | Work, Wood Gathering | 50% increase in workers' Wood Gathering production speed | Gathering manager for the Wood family. |
| Farmer | Work, Food Gathering | 50% increase in workers' Food Gathering production speed | Gathering manager for the Food family. |
| Miner | Work, Rocks Gathering | 50% increase in workers' Rocks Gathering production speed | Gathering manager for the Rocks family. |
| Carpenter | Work, Wood Processing | 50% increase in workers' Wood Processing production speed | Processing manager for Wood recipes. |
| Chef | Work, Food Processing | 50% increase in workers' Food Processing production speed | Processing manager for Food recipes. |
| Stonemason | Work, Rocks Processing | 50% increase in workers' Rocks Processing production speed | Processing manager for Rocks recipes. |
| Wood Builder | Houses and recruitment | 50% increase in Wood Houses recruiting speed | Manager for Cardboard Boxes and Wood Cathouses. |

### Level bonuses

For a normal worker Cat:

- **Gather Production Bonus:** `1.05^level` (+5% per level).
- **Process Production Bonus:** `1.03^level` (+3% per level).
- **Exploration Power:** +1 per level, when the Cat participates in an Exploration mission.

For a manager Cat, the base manager speed is:

```text
manager speed = 1.5 x 1.05^level
```

This manager speed applies only in the manager's dedicated slot and is separate from a worker's Gathering or Processing production bonus.

## Manager spheres

The central `PROD SPEED` sphere is learned automatically with the manager job. Level I side perks cost 1 Canned Cat Food, level II side perks cost 2, and `NEW SLOT` costs 3.

### Gathering managers

Lumberjack, Farmer and Miner use the same four functional perks, applied only to their own Gathering family.

| Perk | Effect |
|---|---|
| `PROD BOOST I` | Increases production of the manager's Gathering resources by 25%. It is added on top of the worker Cat's level bonus. Costs 1 Canned Cat Food. |
| `PROD BOOST II` | Increases production of the manager's Gathering resources by an additional 25%, for a total 50% increase. Costs 2 Canned Cat Food and requires `PROD BOOST I`. |
| `SPEED BOOST I` | Increases the speed boost granted to the manager's Gathering resources by 25%. Costs 1 Canned Cat Food. |
| `SPEED BOOST II` | Increases the speed boost granted to the manager's Gathering resources by an additional 25%, for a total 50% increase. Costs 2 Canned Cat Food and requires `SPEED BOOST I`. |
| `NEW SLOT` | Adds one recipe slot to the matching Work family: Wood, Food or Rocks. Costs 3 Canned Cat Food. |

Family mapping:

| Manager | Gathering family |
|---|---|
| Lumberjack | Wood |
| Farmer | Food |
| Miner | Rocks |

### Processing managers

Carpenter, Chef and Stonemason use the same processing sphere structure. Their perks affect only Processing in their own family.

| Perk | Effect |
|---|---|
| `REDUCED COST I` | Changes the Gathering target for the matching Processing recipe from 10 gather resources to 8. Costs 1 Canned Cat Food. |
| `REDUCED COST II` | Changes the Gathering target for the matching Processing recipe from 10 gather resources to 6. Costs 2 Canned Cat Food and requires `REDUCED COST I`. |
| `SPEED BOOST I` | Increases the manager's granted Processing speed boost by 25%. Costs 1 Canned Cat Food. |
| `SPEED BOOST II` | Increases the manager's granted Processing speed boost by an additional 25%, for a total 50% increase. Costs 2 Canned Cat Food and requires `SPEED BOOST I`. |
| `NEW SLOT` | Adds one recipe slot to the matching Work family: Wood, Food or Rocks. Costs 3 Canned Cat Food. |

Family mapping:

| Manager | Processing family | Recipes affected |
|---|---|---|
| Carpenter | Wood | Cardboard Planks and Basic Wood Planks |
| Chef | Food | Catnip Salad and Grilled Anchovy |
| Stonemason | Rocks | Pebble Bricks and Rock Bricks |

### Wood Builder sphere

| Perk | Effect |
|---|---|
| `AUTO BUILD` | Adds an On/Off toggle in Houses and automatically builds a Wood House while its theoretical cost is strictly below 50% of the matching available Planks. Costs 1 Canned Cat Food. |
| `PERFECT BUILD I` | Auto-built Cardboard Boxes no longer consume materials. The theoretical cost is still used to decide whether Auto Build can trigger. Costs 2. |
| `PERFECT BUILD II` | Auto-built Wood Cathouses no longer consume materials. Manual construction still consumes materials. Costs 3. |
| `EXPO REDUCED I` | Changes both Wood House cost exponents from `1.7` to `1.6`. Costs 2. |
| `EXPO REDUCED II` | Changes the exponent from `1.6` to `1.55`. Costs 3. |
| `EXPO REDUCED III` | Changes the exponent from `1.55` to `1.5`. Costs 4. |
| `COST REDUCED I` | Halves the exponent-derived Wood House cost, rounded up. Costs 2. |
| `COST REDUCED II` | Halves that cost again, producing one quarter of the exponent-derived cost, rounded up. Costs 3. |
| `BOX BOOST` | Each Cardboard Box adds 5% to every Wood Cathouse's recruiting-speed effect. The bonuses are additive: the multiplier is `1 + 0.05 × boxCount`. Costs 5. |
| `GLOBAL SPEED I` | Increases the Wood Builder's speed boost granted to Wood Houses by 25%. Costs 1. |
| `GLOBAL SPEED II` | Adds another 25%, for a total 50% increase. Costs 2. |
| `GLOBAL SPEED III` | Adds another 25%, for a total 75% increase. Costs 4. |
| `BOX SPEED` | Multiplies the base Cardboard Box recruiting speed by 3. Costs 2. |
| `WOOD SPEED` | Multiplies the base Wood Cathouse recruiting speed by 2. Costs 4. |

The Builder does not receive a Work recipe-slot perk.

For save compatibility, the former `builder-cost` id now represents `EXPO REDUCED I`, while the former `builder-speed` id represents `GLOBAL SPEED I`. Previously learned perks therefore keep only their corresponding first level.

## Bernardo, the Gang Leader

Bernardo receives the Gang Leader role automatically. It is not trained in the Job Center and has no normal manager slot.

The central `GLOBAL SPEED` effect is active by default.

| Perk | Effect |
|---|---|
| `QOL EXP` | Unlocks Food Management in the Gang tab. Costs 1 Canned Cat Food. |
| `DAILY BOOST I` | Raises the Daily Quests reward from 1 to 2 Canned Cat Food. Costs 3. |
| `DAILY BOOST II` | Raises the Daily Quests reward from 2 to 3 Canned Cat Food. Requires `DAILY BOOST I`. Costs 5. |
| `RECRUIT SPEED I` | Applies half of Bernardo's leadership bonus above ×1 to global recruitment speed. Costs 1. |
| `RECRUIT SPEED II` | Applies Bernardo's full leadership bonus to global recruitment speed. Requires `RECRUIT SPEED I`. Costs 2. |
| `MANUAL BOOST` | Raises Manual Focus power from ×2 to ×3. Costs 2. |
| `BOOST POWER` | Raises Manual Focus power from ×3 to ×4. Requires `MANUAL BOOST`. Costs 4. |
| `CAPACITY` | Raises Manual Focus capacity from 30 to 60 seconds. Requires `MANUAL BOOST`. Costs 2. |
| `CLICK POWER` | Raises Manual Focus charge from 0.8 to 2 seconds per click. Requires `MANUAL BOOST`. Costs 2. |
| `EXPLORATOR` | Lets Bernardo replace an Explorator in the required zone-exploration slot. Costs 2. |
| `EXPLO HALVES` | Bernardo halves zone exploration, campaign and scouting durations when included. Requires `EXPLORATOR`. Costs 3. |
| `CHANCE DOUBLE I` | Gives a 15% chance to double scouting rewards when Bernardo is assigned. Requires `EXPLORATOR`. Costs 2. |
| `EXPLO POWER` | Raises Bernardo's Exploration Power by 50%. Requires `EXPLORATOR`. Costs 3. |
| `CAT FOOD I` | Raises Canned Cat Food scouting chances by 50% when Bernardo is assigned. Requires `EXPLORATOR`. Costs 2. |

For save compatibility, the former `gl-rec`, `gl-mini` and `gl-explo` identifiers are retained by `RECRUIT SPEED I`, `MANUAL BOOST` and `EXPLORATOR`. Existing learned perks therefore convert automatically, while their new children become available to learn.

## Explorator sphere

The central `EXPLO HALVES` effect is learned with the Explorator job and halves the duration of all scouting, zone and campaign missions the Explorator joins.

| Perk | Effect |
|---|---|
| `QOL EXPLO` | Unlocks Auto Assign for Exploration missions. Costs 1 Canned Cat Food. |
| `CAT FOOD I` | Increases the chance of receiving Canned Cat Food from scouting rewards by 50% when the Explorator is included. Costs 1 Canned Cat Food. |
| `CAT FOOD II` | Adds another 50% to the base chance, for double the base chance in total. Requires `CAT FOOD I`. Costs 2 Canned Cat Food. |
| `LUCKY FOOD I` | Gives a 15% chance not to consume the daily scouting Canned Cat Food stock when Canned Cat Food is found. Requires `CAT FOOD I`. Costs 2 Canned Cat Food. |
| `LUCKY FOOD II` | Adds another 15%, for a 30% total stock-preservation chance. Requires `LUCKY FOOD I`. Costs 3 Canned Cat Food. |
| `CHANCE DOUBLE I` | Gives a 20% chance to double a scouting reward when the Explorator is included. Costs 1 Canned Cat Food. |
| `CHANCE DOUBLE II` | Adds another 20%, for a 40% total chance to double a scouting reward. Requires `CHANCE DOUBLE I`. Costs 2 Canned Cat Food. |
| `CHANCE TRIPLE I` | After CHANCE DOUBLE succeeds, gives a 15% chance to replace the doubled reward with a tripled reward. Requires `CHANCE DOUBLE I`. Costs 3 Canned Cat Food. |
| `CHANCE TRIPLE II` | Adds another 15%, for a 30% conditional Triple chance. Requires `CHANCE TRIPLE I`. Costs 4 Canned Cat Food. |
| `EXPLO POWER I` | Increases Exploration Power by 25%. Costs 1 Canned Cat Food. |
| `EXPLO POWER II` | Adds another 25%, for a 50% total increase. Requires `EXPLO POWER I`. Costs 2 Canned Cat Food. |

The central `EXPLO HALVES` sphere is learned automatically with the job. `QOL EXPLO`, `CAT FOOD I`, `CHANCE DOUBLE I` and `EXPLO POWER I` are its direct children. `LUCKY FOOD I` branches from `CAT FOOD I`, while `CHANCE TRIPLE I` branches from `CHANCE DOUBLE I`.

### Scouting reward resolution with Explorator perks

The scouting reward pipeline is deliberately ordered:

1. The weighted reward entry is selected. `CAT FOOD I/II` changes the weight of Canned Cat Food before this roll; it does not directly add quantity.
2. `CHANCE DOUBLE` rolls once. On failure, the reward remains at `×1`.
3. Only when Double succeeds, `CHANCE TRIPLE` rolls independently. On success the result becomes `×3`; otherwise it remains `×2`.
4. For Canned Cat Food, at least one unit must remain in that scouting's daily stock.
5. `LUCKY FOOD` then rolls once. On success, the complete multiplied quantity is granted and the stock remains unchanged. On failure, the reward is capped by the remaining stock and the awarded quantity is deducted from it.

At maximum Double and Triple levels, the effective outcomes are 60% normal, 28% doubled and 12% tripled: the 30% Triple chance is conditional on first passing the 40% Double roll.

Example: the scouting has `1/3` Canned Cat Food remaining and produces a tripled reward. If `LUCKY FOOD` succeeds, the player receives 3 and the stock stays at `1/3`. If it fails, the reward is capped at 1 and the stock falls to `0/3`. Once the stock is already zero, no Canned Cat Food can be awarded or preserved.

The pending scouting summary stores `Doubled` and `Tripled` as separate counters. These counters reflect the final quantity actually awarded after the daily-stock cap: a rolled triple that is capped back to the base quantity is not counted as Tripled. `Tripled` is displayed only while the assigned Explorator has learned a CHANCE TRIPLE perk.

## Engineers

Engineers are trained in the Laboratory after the engineering guide has been studied and the Laboratory has been built. They are passive specialists and do not inherit normal worker or manager effects.

### Camp Engineer

| Rank | Training duration | Passive effect | Level cap |
|---|---:|---|---:|
| Rank 1 | 2 hours for the first engineer | Adds 6 minutes to the AFK cap per Cat level | Level 100 |
| Rank 2 | 4 hours for the second engineer | Adds 0.5 percentage point to the AFK ratio per Cat level | Level 100 |

The next Laboratory training durations are currently **8h, 12h, 16h, 20h and 24h**, with 24 hours as the maximum duration. Rank 2 does not inherit Rank 1's AFK-cap bonus; each rank has its own effect.

Current AFK baseline:

```text
maximum AFK cap = 10 hours + Rank 1 level bonuses
AFK ratio = 10% + (Rank 2 level × 0.5 percentage point), capped at 100%
```

All Cats share a global level cap of **100**. Engineer ranks use that same cap;
their rank-specific passive effect determines what each level contributes.

The first trained Camp Engineer is Rank 1. After the Teamwork Advantage book has been learned, the next Camp Engineer rank becomes available. Gang engineer subtabs appear after the first engineer is trained.

## Maintenance checklist

When adding or changing a job or engineer:

1. Update the job definition and Job Center/Laboratory tooltip in code.
2. Update the relevant sphere grid and perk effect.
3. Update this document's table and the formula reference in `game_formulas.md` if a formula changed.
4. Add or update a focused test for the effect, cost, duration or unlock condition.
5. Add the change to the unreleased changelog category before publishing.
