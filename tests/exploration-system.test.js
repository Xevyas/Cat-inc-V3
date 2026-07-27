const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'jeu.js'), 'utf8');
const configSource = fs.readFileSync(path.join(__dirname, '..', 'js', 'data', 'config.js'), 'utf8');

function extraire(debut, fin) {
  const start = source.indexOf(debut);
  const end = source.indexOf(fin, start);
  assert.notEqual(start, -1, 'start marker should exist: ' + debut);
  assert.notEqual(end, -1, 'end marker should exist: ' + fin);
  return source.slice(start, end);
}

const zoneSource = extraire('function terminerExploZone() {', 'function lancerExplo(id) {');
const campaignSource = extraire('function terminerExplo(explo) {', '// Returns the effective Exploration Power');
const scoutingSource = extraire('function butinScoutingVide() {', 'function scoutingHalveTime(kittyIndex) {');
const mapRenderSource = extraire('function renduCarte(u) {', 'function renduZoneInfo() {');
const allocationSource = extraire('function kittyAllocationLabel(kittyIdx) {', 'function chatonsLibres() {');
const zoneLaunchSource = extraire('function lancerExploZone() {', 'function terminerExploZone() {');

function chargerFonction(functionSource, contextValues) {
  const context = vm.createContext(contextValues);
  vm.runInContext(functionSource, context);
  return context;
}

function contexteZone(randomValue) {
  const notifications = [];
  const logs = [];
  const context = chargerFonction(zoneSource, {
    Math: { min: Math.min, random: function() { return randomValue; } },
    etat: {
      exploZoneEnCours: { zoneId: 'B2', kittyIndices: [0] },
      zonesExplorees: [],
      resultatsExplorationZones: {},
      kittiesData: [{ nom: 'Mochi' }]
    },
    ZONES_CARTE: { B2: { nom: 'Back Alley', difficulte: 10 } },
    carteExploSlots: { B2: [0] },
    carteDirty: false,
    exploTabDirty: false,
    kittyEP: function() { return 2; },
    afficherNotification: function(message) { notifications.push(message); },
    ajouterLog: function(type, message) { logs.push({ type: type, message: message }); },
    verifierObjectifs: function() { context.objectiveChecks += 1; },
    sauvegarder: function() {},
    rendu: function() {},
    objectiveChecks: 0
  });
  return { context: context, notifications: notifications, logs: logs };
}

test('rebuilding the exploration map invalidates its detail-panel cache', function() {
  assert.match(mapRenderSource, /if \(carteDirty \|\| !document\.getElementById\("carte-grille"\)\) \{[\s\S]*?_zoneInfoKey = null;/);
});

test('successful zone exploration waits for the player to reveal the zone', function() {
  const run = contexteZone(0.19);
  run.context.terminerExploZone();

  assert.deepEqual(Array.from(run.context.etat.zonesExplorees), []);
  assert.equal(run.context.etat.resultatsExplorationZones.B2.success, true);
  assert.equal(run.context.etat.exploZoneEnCours, null);
  assert.deepEqual(Array.from(run.context.carteExploSlots.B2), [null]);
  assert.equal(run.context.objectiveChecks, 0);
  assert.match(run.notifications[0], /ready to be revealed/);
  assert.doesNotMatch(run.notifications[0], /Back Alley/);
  assert.equal(run.logs[0].type, 'event');

  run.context.revelerZoneExploree('B2');
  assert.doesNotMatch(run.notifications[1], /Back Alley/);
  assert.deepEqual(Array.from(run.context.etat.zonesExplorees), ['B2']);
  assert.equal(run.context.etat.resultatsExplorationZones.B2, undefined);
  assert.equal(run.context.objectiveChecks, 1);
});

test('failed zone exploration keeps the zone locked and releases its kitties', function() {
  const run = contexteZone(0.20);
  run.context.terminerExploZone();

  assert.deepEqual(Array.from(run.context.etat.zonesExplorees), []);
  assert.equal(run.context.etat.resultatsExplorationZones.B2.success, false);
  assert.equal(run.context.etat.exploZoneEnCours, null);
  assert.deepEqual(Array.from(run.context.carteExploSlots.B2), [null]);
  assert.equal(run.context.objectiveChecks, 0);
  assert.match(run.notifications[0], /failed/);
  assert.doesNotMatch(run.notifications[0], /Back Alley/);
  assert.equal(run.logs[0].type, 'event');
  assert.match(run.logs[0].message, /Mochi returned safely/);
});

test('undiscovered zone exploration stays anonymous in Gang actions', function() {
  assert.match(allocationSource, /missionZoneLabel[\s\S]*?Unknown zone/);
  assert.match(zoneLaunchSource, /if \(!estExplorateurDeZone\(slots\[0\]\)\)/);
});

function contexteAllocation(overrides) {
  const etat = {
    kittiesData: [{ nom: 'Mochi' }],
    learningEnCours: null,
    formationIngenieurEnCours: null,
    formationEnCours: null,
    exploZoneEnCours: null,
    zonesExplorees: ['D1'],
    workRecipeSlots: {},
    managers: {},
    exploEnCours: [],
    scoutingsEnCours: {}
  };
  Object.assign(etat, overrides.etat || {});
  return chargerFonction(allocationSource, {
    etat: etat,
    CONFIG: {
      campaigns: { checkTheTrash: { nom: 'Search our trash', zone: 'D1' } },
      scoutings: { searchTrashAgain: { nom: 'Search our trash again', zone: 'D1' } }
    },
    ZONES_CARTE: { D1: { nom: 'Home' } },
    METIERS: {},
    RESOURCE_PAIRS: [],
    carteExploSlots: {},
    exploKittiesSelectionnees: {},
    scoutingsStagingKitty: {},
    estIngenieur: function() { return false; },
    kittyIsLearningBook: function() { return false; }
  });
}

test('Gang activity labels include the zone for exploration, campaigns and scoutings', function() {
  const exploration = contexteAllocation({
    etat: { exploZoneEnCours: { zoneId: 'D1', kittyIndices: [0] } }
  });
  assert.equal(exploration.kittyAllocationLabel(0).text, 'Exploration: D1');

  const campaign = contexteAllocation({
    etat: { exploEnCours: [{ id: 'checkTheTrash', kittyIndices: [0] }] }
  });
  assert.equal(campaign.kittyAllocationLabel(0).text, 'Campaign: D1');

  const scouting = contexteAllocation({
    etat: { scoutingsEnCours: { searchTrashAgain: { kittyIndex: 0 } } }
  });
  assert.equal(scouting.kittyAllocationLabel(0).text, 'Scouting: D1');
});

test('campaign success and failure use the same strict probability boundary', function() {
  function run(randomValue) {
    const logs = [];
    const notifications = [];
    const rewards = [];
    const context = chargerFonction(campaignSource, {
      Math: { min: Math.min, random: function() { return randomValue; } },
      CONFIG: { campaigns: { firstTrip: { nom: 'First Trip', difficulte: 10, recompense: 'catnip', recompenseQty: 2 } } },
      etat: { campaignsCompletees: [], resultatsCampaigns: {}, kittiesData: [{ nom: 'Mochi' }] },
      kittyEP: function() { return 2; },
      appliquerRecompense: function(resource, quantity) { rewards.push([resource, quantity]); },
      resoudreRecompenseTable: function() { throw new Error('unexpected reward table'); },
      ajouterLog: function(type, message) { logs.push({ type: type, message: message }); },
      afficherNotification: function(message) { notifications.push(message); },
      verifierObjectifs: function() {}, sauvegarder: function() {}, rendu: function() {},
      carteDirty: false, exploTabDirty: false
    });
    context.terminerExplo({ id: 'firstTrip', kittyIndices: [0] });
    return { context: context, logs: logs, notifications: notifications, rewards: rewards };
  }

  const success = run(0.19);
  assert.deepEqual(Array.from(success.context.etat.campaignsCompletees), []);
  assert.deepEqual(success.rewards, []);
  assert.equal(success.context.etat.resultatsCampaigns.firstTrip.success, true);
  success.context.recupererRecompenseCampaign('firstTrip');
  assert.deepEqual(Array.from(success.context.etat.campaignsCompletees), ['firstTrip']);
  assert.deepEqual(success.rewards, [['catnip', 2]]);

  const failure = run(0.20);
  assert.deepEqual(Array.from(failure.context.etat.campaignsCompletees), []);
  assert.deepEqual(failure.rewards, []);
  assert.equal(failure.context.etat.resultatsCampaigns.firstTrip.success, false);
  assert.match(failure.notifications[0], /failed/);
});

test('campaign success uses the Exploration Power captured at launch', function() {
  const context = chargerFonction(campaignSource, {
    Math: { min: Math.min, random: function() { return 0.15; } },
    CONFIG: { campaigns: { firstTrip: { nom: 'First Trip', difficulte: 10, recompense: 'catnip', recompenseQty: 2 } } },
    etat: { campaignsCompletees: [], resultatsCampaigns: {}, kittiesData: [{ nom: 'Mochi' }] },
    kittyEP: function() { return 2; },
    appliquerRecompense: function() { throw new Error('stored launch power should fail before reward'); },
    resoudreRecompenseTable: function() { throw new Error('unexpected reward table'); },
    ajouterLog: function() {},
    afficherNotification: function() {},
    carteDirty: false, exploTabDirty: false
  });
  context.terminerExplo({ id: 'firstTrip', kittyIndices: [0], power: 1 });
  assert.deepEqual(Array.from(context.etat.campaignsCompletees), []);
  assert.equal(context.etat.resultatsCampaigns.firstTrip.success, false);
});

test('campaigns can grant a fixed bundle of multiple resources', function() {
  const rewards = [];
  const context = chargerFonction(campaignSource, {
    Math: { min: Math.min, random: function() { return 0; } },
    CONFIG: { campaigns: {
      gas: {
        nom: 'Explore the outside', difficulte: 50, recompenses: [
          { recompense: 'basicWoodPlanks', qty: 10 },
          { recompense: 'humanLeftovers', qty: 20 },
          { recompense: 'humanWorkersFood', qty: 1 }
        ]
      }
    } },
    etat: { campaignsCompletees: [], resultatsCampaigns: {}, kittiesData: [{ nom: 'Bernardo' }] },
    kittyEP: function() { return 50; },
    appliquerRecompense: function(resource, quantity) { rewards.push([resource, quantity]); },
    resoudreRecompenseTable: function() { throw new Error('unexpected reward table'); },
    ajouterLog: function() {},
    afficherNotification: function() {},
    verifierObjectifs: function() {}, sauvegarder: function() {}, rendu: function() {},
    carteDirty: false, exploTabDirty: false
  });
  context.terminerExplo({ id: 'gas', kittyIndices: [0] });
  assert.deepEqual(Array.from(rewards), []);
  assert.deepEqual(Array.from(context.etat.resultatsCampaigns.gas.recompenses, function(entry) {
    return [entry.recompense, entry.qty];
  }), [
    ['basicWoodPlanks', 10],
    ['humanLeftovers', 20],
    ['humanWorkersFood', 1]
  ]);
  context.recupererRecompenseCampaign('gas');
  assert.deepEqual(Array.from(rewards), [
    ['basicWoodPlanks', 10],
    ['humanLeftovers', 20],
    ['humanWorkersFood', 1]
  ]);
});

test('Gas Station campaign has the requested mission and rewards', function() {
  const definition = configSource.slice(configSource.indexOf('exploreOutside:'), configSource.indexOf('\n    }', configSource.indexOf('exploreOutside:')));
  assert.match(definition, /nom:\s+"Explore the outside"/);
  assert.match(definition, /description:\s+"Have a look around this strange structure, I also spotted a potential back entrance we could use"/);
  assert.match(definition, /difficulte:\s+50/);
  assert.match(definition, /duree:\s+2400/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /basicWoodPlanks"\s*,\s*qty:\s*10/);
  assert.match(definition, /humanLeftovers"\s*,\s*qty:\s*20/);
  assert.match(definition, /humanWorkersFood"\s*,\s*qty:\s*1/);
  assert.match(definition, /zone:\s+"gasStation"/);
});

test('Gas Station back entrance campaign unlocks after the first campaign and rewards the Compass', function() {
  const definition = configSource.slice(configSource.indexOf('sneakBackEntrance:'), configSource.indexOf('\n    }', configSource.indexOf('sneakBackEntrance:')));
  assert.match(definition, /nom:\s+"Sneak through the back entrance"/);
  assert.match(definition, /difficulte:\s+80/);
  assert.match(definition, /duree:\s+5400/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /recompense:\s+"compass"/);
  assert.match(definition, /zone:\s+"gasStation"/);
  assert.match(definition, /unlockAfterCampaign:\s+"exploreOutside"/);
});

test('Forest Entrance campaign is Compass-gated and records the future World Map reward', function() {
  const definition = configSource.slice(configSource.indexOf('navigateThroughWoods:'), configSource.indexOf('\n    }', configSource.indexOf('navigateThroughWoods:')));
  assert.match(definition, /nom:\s+"Navigate through the woods"/);
  assert.match(definition, /difficulte:\s+100/);
  assert.match(definition, /duree:\s+5400/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /recompense:\s+"worldMap"/);
  assert.match(definition, /requiredItem:\s+"compass"/);
  assert.doesNotMatch(definition, /lockedReason:/);
  assert.match(definition, /zone:\s+"forestEntrance"/);
  assert.match(source, /if \(camp\.requiredItem && !etat\.itemsAcquis\.includes\(camp\.requiredItem\)\) return;/);
  assert.match(source, /const requiredItemMissing = camp\.requiredItem && !etat\.itemsAcquis\.includes\(camp\.requiredItem\);/);
});

test('Gas Station scouting unlocks after both campaigns with weighted food rewards', function() {
  const definition = configSource.slice(configSource.indexOf('stealGasStationAgain:'), configSource.indexOf('\n    }', configSource.indexOf('stealGasStationAgain:')));
  assert.match(definition, /nom:\s+"Let's try stealing more"/);
  assert.match(definition, /description:\s+"Now that we know the way in, let's try to bring back a few more useful things without being noticed\."/);
  assert.match(definition, /difficulte:\s+50/);
  assert.match(definition, /duree:\s+3000/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /humanWorkersFood", qty: 2, weight: 50/);
  assert.match(definition, /humanWorkersFood", qty: 4, weight: 45/);
  assert.match(definition, /cannedCatFood",    qty: 1, weight: 5/);
  assert.match(definition, /unlockCampaign:\s+"sneakBackEntrance"/);
  const basement = configSource.slice(configSource.indexOf('searchBasementAgain:'), configSource.indexOf('\n    }', configSource.indexOf('searchBasementAgain:')));
  assert.match(basement, /difficulte:\s+30/);
});

test('Supermarket book campaign unlocks after infiltration and rewards The Daily Purpose', function() {
  const definition = configSource.slice(configSource.indexOf('checkSupermarketBookSection:'), configSource.indexOf('\n    }', configSource.indexOf('checkSupermarketBookSection:')));
  assert.match(definition, /nom:\s+"Check the book section"/);
  assert.match(definition, /difficulte:\s+65/);
  assert.match(definition, /duree:\s+3600/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /recompense:\s+"dailyPurpose"/);
  assert.match(definition, /zone:\s+"supermarket"/);
  assert.match(definition, /unlockAfterCampaign:\s+"infiltrateSupermarket"/);
});

test('D1 house campaign unlocks after the 15-cat evacuation story and rewards the engineering guide', function() {
  const definition = configSource.slice(configSource.indexOf('searchHomeHouse:'), configSource.indexOf('\n    }', configSource.indexOf('searchHomeHouse:')));
  assert.match(definition, /nom:\s+"Search the house"/);
  assert.match(definition, /difficulte:\s+70/);
  assert.match(definition, /duree:\s+3600/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /recompense:\s+"engineerGuide"/);
  assert.match(definition, /unlockAfterStory:\s+"storyHouseEvacuationVue"/);
  assert.match(definition, /lockedDescription:\s+"There may be useful things inside, but a human is still home\."/);
  assert.match(definition, /lockedReason:\s+"Human inside the house/);
  assert.match(definition, /zone:\s+"D1"/);
  assert.match(source, /if \(camp\.unlockAfterStory && !storyEstVue\(camp\.unlockAfterStory\)\) return;/);
  assert.match(source, /const storyLock = camp\.unlockAfterStory && !storyEstVue\(camp\.unlockAfterStory\)/);
  assert.match(source, /const campaignDescription = campaignLocked && camp\.lockedDescription \? camp\.lockedDescription : camp\.description/);
});

test('C1 house campaign unlocks after the 17-cat evacuation story and rewards the teamwork guide', function() {
  const definition = configSource.slice(configSource.indexOf('searchLeftHouse:'), configSource.indexOf('\n    }', configSource.indexOf('searchLeftHouse:')));
  assert.match(definition, /nom:\s+"Search Left Neighbor's House"/);
  assert.match(definition, /difficulte:\s+80/);
  assert.match(definition, /duree:\s+4800/);
  assert.match(definition, /slots:\s+2/);
  assert.match(definition, /recompense:\s+"teamworkGuide"/);
  assert.match(definition, /unlockAfterStory:\s+"storyLeftHouseEvacuationVue"/);
  assert.match(definition, /zone:\s+"C1"/);
  assert.match(source, /etat\.chatons >= 17[\s\S]*?storyLeftHouseEvacuationVue/);
});

test('A1 upper-floor campaign branches from the ground floor and rewards Sturdy House Plans', function() {
  const start = configSource.indexOf('searchUpperFloor:');
  const definition = configSource.slice(start, configSource.indexOf('\n    }', start));
  assert.notEqual(start, -1);
  assert.match(definition, /nom:\s*"Search the upper floor"/);
  assert.match(definition, /difficulte:\s*80/);
  assert.match(definition, /duree:\s*3600/);
  assert.match(definition, /slots:\s*2/);
  assert.match(definition, /recompense:\s*"sturdyHousePlans"/);
  assert.match(definition, /zone:\s*"A1"/);
  assert.match(definition, /unlockAfterCampaign:\s*"exploreGroundFloor"/);
  assert.match(source, /camp\.unlockAfterCampaign && !etat\.campaignsCompletees\.includes\(camp\.unlockAfterCampaign\)/);
});

test('B1 and F1 gardens offer the same trash campaign without scoutings', function() {
  const leftGarden = configSource.slice(configSource.indexOf('searchLeftGarden:'), configSource.indexOf('\n    }', configSource.indexOf('searchLeftGarden:')));
  const rightGarden = configSource.slice(configSource.indexOf('searchRightGarden:'), configSource.indexOf('\n    }', configSource.indexOf('searchRightGarden:')));
  [leftGarden, rightGarden].forEach(function(definition) {
    assert.match(definition, /nom:\s+"Search the garden"/);
    assert.match(definition, /description:\s+"A few scraps are visible in a corner of the garden, as if people have been tossing their trash over the fence\."/);
    assert.match(definition, /difficulte:\s+15/);
    assert.match(definition, /duree:\s+1200/);
    assert.match(definition, /slots:\s+2/);
    assert.match(definition, /recompense:\s+"humanLeftovers"/);
    assert.match(definition, /recompenseQty:\s+10/);
  });
  assert.match(leftGarden, /zone:\s+"B1"/);
  assert.match(rightGarden, /zone:\s+"F1"/);
  assert.doesNotMatch(leftGarden, /scouting/i);
  assert.doesNotMatch(rightGarden, /scouting/i);
});

test('parking campaigns provide their distinct building-material rewards without scoutings', function() {
  const leftParking = configSource.slice(configSource.indexOf('searchLeftParking:'), configSource.indexOf('\n    }', configSource.indexOf('searchLeftParking:')));
  const rightParking = configSource.slice(configSource.indexOf('searchRightParking:'), configSource.indexOf('\n    }', configSource.indexOf('searchRightParking:')));
  [leftParking, rightParking].forEach(function(definition) {
    assert.match(definition, /nom:\s+"Search the parking"/);
    assert.match(definition, /description:\s+"A pile of materials used by humans seems to be piling up in one corner of the parking lot\."/);
    assert.match(definition, /difficulte:\s+35/);
    assert.match(definition, /duree:\s+2400/);
    assert.match(definition, /slots:\s+2/);
    assert.doesNotMatch(definition, /scouting/i);
  });
  assert.match(leftParking, /zone:\s+"parkingLeft"/);
  assert.match(leftParking, /recompense:\s+"rockBricks", qty:\s+2/);
  assert.match(rightParking, /zone:\s+"parkingRight"/);
  assert.match(rightParking, /recompense:\s+"rockBricks", qty:\s+1/);
  assert.match(rightParking, /recompense:\s+"basicWoodPlanks", qty:\s+5/);
  assert.match(source, /rockBricks:\s+"Rock Bricks"/);
  assert.match(source, /if \(recompenseId === "rockBricks"\)[\s\S]*?etat\.rockBricks \+= qty/);
  assert.match(source, /inv-res-rock-brick[\s\S]*?visible: u\.rockfact \|\| etat\.rockBricks > 0/);
});

test('scouting runs accumulate rewards and failures while auto-restarting', function() {
  function run(randomValue) {
    const logs = [];
    const context = chargerFonction(scoutingSource, {
      Math: { min: Math.min, max: Math.max, floor: Math.floor, random: function() { return randomValue; } },
      Date: Date,
      CONFIG: {
        scoutings: {
          search: {
            nom: 'Search', difficulte: 10, duree: 60,
            recompense: 'humanLeftovers', recompenseRange: [{ qty: 1, weight: 100 }]
          }
        }
      },
      etat: {
        scoutingsEnCours: { search: { kittyIndex: 0, startTs: 0, duree: 60 } },
        butinsScouting: {},
        kittiesData: [{ nom: 'Mochi' }],
        humanLeftovers: 0,
        humanWorkersFood: 0,
        cannedCatFood: 0
      },
      kittyEP: function() { return 2; },
      resoudreRecompenseTable: function(entries) { return entries[0]; },
      tryDoubleReward: function(quantity) { return quantity; },
      scoutingHalveTime: function() { return false; },
      ajouterLog: function(type, message) { logs.push({ type: type, message: message }); }
    });
    context.terminerScouting('search');
    return { context: context, logs: logs };
  }

  const success = run(0.19);
  assert.equal(success.context.etat.humanLeftovers, 0);
  assert.equal(success.context.etat.butinsScouting.search.successful, 1);
  assert.equal(success.context.etat.butinsScouting.search.rewards.humanLeftovers, 1);
  assert.match(success.logs[0].message, /Rewards are waiting on the map/);
  assert.equal(success.context.etat.scoutingsEnCours.search.startTs, 60000);

  const failure = run(0.20);
  assert.equal(failure.context.etat.humanLeftovers, 0);
  assert.equal(failure.context.etat.butinsScouting.search.failed, 1);
  assert.equal(failure.context.etat.scoutingsEnCours.search.kittyIndex, 0);
  assert.equal(failure.context.etat.scoutingsEnCours.search.startTs, 60000);
});

test('Lucky Food preserves a multiplied Canned Cat Food reward while still requiring stock', function() {
  function makeContext(randomValue, remaining) {
    return chargerFonction(scoutingSource, {
      Math: { min: Math.min, max: Math.max, floor: Math.floor, random: function() { return randomValue; } },
      CONFIG: { scoutings: { search: { dailyCannedCatFoodStock: 3 } } },
      etat: {
        dailyScoutingStocks: { dateKey: '2026-07-26', remaining: { search: remaining } },
        butinsScouting: {}
      },
      Date: Date,
      cleDateParis: function() { return '2026-07-26'; },
      scoutingLuckyFoodChance: function() { return 0.30; }
    });
  }

  const preserved = makeContext(0.10, 1);
  assert.equal(preserved.limiterRecompenseScouting('search', 'cannedCatFood', 3, 0), 3);
  assert.equal(preserved.etat.dailyScoutingStocks.remaining.search, 1);

  const consumed = makeContext(0.90, 1);
  assert.equal(consumed.limiterRecompenseScouting('search', 'cannedCatFood', 3, 0), 1);
  assert.equal(consumed.etat.dailyScoutingStocks.remaining.search, 0);

  const empty = makeContext(0.10, 0);
  assert.equal(empty.limiterRecompenseScouting('search', 'cannedCatFood', 3, 0), 0);
  assert.equal(empty.etat.dailyScoutingStocks.remaining.search, 0);
});

test('daily scouting stock resets independently from Daily Purpose and Daily Quests', function() {
  const context = chargerFonction(scoutingSource, {
    Math: Math,
    Date: Date,
    CONFIG: { scoutings: { search: { dailyCannedCatFoodStock: 3 } } },
    etat: {
      dailyQuests: null,
      dailyScoutingStocks: { dateKey: '2026-07-25', remaining: { search: 0 } },
      butinsScouting: {}
    },
    cleDateParis: function() { return '2026-07-26'; },
    scoutingLuckyFoodChance: function() { return 0; }
  });

  const stock = context.stockCannedCatFoodScouting('search');
  assert.equal(stock.remaining, 3);
  assert.equal(context.etat.dailyScoutingStocks.dateKey, '2026-07-26');
  assert.equal(context.etat.dailyScoutingStocks.remaining.search, 3);
});

test('scouting success uses the Exploration Power captured at launch', function() {
  const logs = [];
  const context = chargerFonction(scoutingSource, {
    Math: { min: Math.min, max: Math.max, floor: Math.floor, random: function() { return 0.15; } },
    Date: Date,
    CONFIG: {
      scoutings: {
        search: {
          nom: 'Search', difficulte: 10, duree: 60,
          recompense: 'humanLeftovers', recompenseRange: [{ qty: 1, weight: 100 }]
        }
      }
    },
    etat: {
      scoutingsEnCours: { search: { kittyIndex: 0, power: 1, startTs: 0, duree: 60 } },
      butinsScouting: {},
      kittiesData: [{ nom: 'Mochi' }],
      humanLeftovers: 0,
      humanWorkersFood: 0,
      cannedCatFood: 0
    },
    kittyEP: function() { return 2; },
    resoudreRecompenseTable: function() { throw new Error('stored launch power should fail before reward'); },
    tryDoubleReward: function(quantity) { return quantity; },
    scoutingHalveTime: function() { return false; },
    ajouterLog: function(type, message) { logs.push({ type: type, message: message }); }
  });
  context.terminerScouting('search');
  assert.equal(context.etat.humanLeftovers, 0);
  assert.equal(context.etat.butinsScouting.search.failed, 1);
});

test('all exploration mission types persist launch power for their final roll', function() {
  assert.match(source, /function lancerExploZone\(\)[\s\S]*?power:\s*launchPower/);
  assert.match(source, /function terminerExploZone\(\)[\s\S]*?Number\.isFinite\(mission\.power\)/);
  assert.match(source, /function lancerExplo\(id\)[\s\S]*?power:\s*launchPower/);
  assert.match(source, /function terminerExplo\(explo\)[\s\S]*?Number\.isFinite\(explo\.power\)/);
  assert.match(source, /function assignerKittyScouting\(scoutingId, kittyIndex\)[\s\S]*?power:\s*kittyEP\(kittyIndex\)/);
  assert.match(source, /function terminerScouting\(scoutingId\)[\s\S]*?Number\.isFinite\(sc\.power\)/);
});

test('scouting assignment refreshes the zone status badge immediately', function() {
  assert.match(source, /function assignerKittyScouting\(scoutingId, kittyIndex\)[\s\S]*?carteDirty = true[\s\S]*?renduCarte\(unlocks\(\)\)[\s\S]*?renderCampaignCards\(\)/);
  assert.match(source, /function retirerKittyScouting\(scoutingId\)[\s\S]*?carteDirty = true[\s\S]*?renduCarte\(unlocks\(\)\)[\s\S]*?renderCampaignCards\(\)/);
});
