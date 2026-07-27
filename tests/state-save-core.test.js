const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const namespacePath = path.join(root, 'js', 'cat-inc.js');
const statePath = path.join(root, 'js', 'core', 'state.js');
const savePath = path.join(root, 'js', 'core', 'save.js');

function loadCore() {
  const context = vm.createContext({});
  [namespacePath, statePath, savePath].forEach(function(filePath) {
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  return context.CatInc;
}

test('initial states are complete, independent and replaceable', function() {
  const core = loadCore();
  const first = core.state.creerEtatInitial();
  const second = core.state.creerEtatInitial();

  assert.notEqual(first, second);
  assert.equal(first.cardboardPlanksTotalProduit, 0);
  assert.notEqual(first.workRecipeSlots, second.workRecipeSlots);
  assert.notEqual(first.workRecipeSlots.wood, second.workRecipeSlots.wood);
  assert.notEqual(first.workRecipeSlots.wood[0], second.workRecipeSlots.wood[0]);
  assert.notEqual(first.managers, second.managers);
  assert.notEqual(first.zonesExplorees, second.zonesExplorees);
  assert.notEqual(first.ongletsVisites, second.ongletsVisites);
  assert.notEqual(first.itemsEtudies, second.itemsEtudies);
  assert.notEqual(first.storiesVues, second.storiesVues);
  assert.deepEqual(Array.from(first.ongletsVisites), ['gang', 'logs']);
  assert.equal(Object.hasOwn(first, 'workers'), false);
  assert.deepEqual(Object.keys(first.workRecipeSlots), ['wood', 'food', 'rock']);
  Object.values(first.workRecipeSlots).forEach(function(slots) {
    assert.equal(slots.length, 2);
    assert.equal(slots.every(function(slot) {
      return slot.recipeId === null
        && slot.kittyIndex === null
        && slot.phase === 'idle'
        && slot.phaseProgress === 0
        && slot.outputCarry === 0
        && Object.keys(slot.gatheredInputs).length === 0
        && Object.keys(slot.reservedInputs).length === 0;
    }), true);
  });

  first.staleProperty = true;
  core.state.remplacerEtat(first, second);
  assert.equal(Object.hasOwn(first, 'staleProperty'), false);
  assert.equal(first.chatons, 0);
});

test('serialization preserves every state field and excludes stale properties', function() {
  const core = loadCore();
  const state = core.state.creerEtatInitial();
  state.dernierTimestamp = 1_700_000_000_000;
  state.chatons = 3;
  state.cardboardPieces = 42;
  state.spherePerks = { 'gl-rec': 'learned' };
  state.itemsEtudies.push('schoolGuide');
  state.prochainVisageChaton = 'img/Cat faces/Luna_Final.png?v=test';
  state.storiesVues.push('introVue', 'story1Vue');
  state.formationTermineeEnAttente = { kittyIndex: 0, metier: 'explorator', finishedTs: 1_700_000_000_000 };
  state.formationIngenieurTermineeEnAttente = { kittyIndex: 1, metier: 'camp-engineer', engineerRank: 1, finishedTs: 1_700_000_001_000 };
  state.ongletsVisites.push('work');
  state.workRecipeSlots.wood[0].recipeId = 'cardboardPlanks';
  state.staleProperty = 'must not be saved';

  const data = core.save.creerDonneesSauvegarde(state);
  const parsed = JSON.parse(core.save.serialiserEtat(state));
  assert.equal(data.saveVersion, core.save.SAVE_VERSION);
  assert.equal(data.dernierTimestamp, 1_700_000_000_000);
  assert.equal(data.cardboardPieces, 42);
  assert.deepEqual(Array.from(data.ongletsVisites), ['gang', 'logs', 'work']);
  assert.deepEqual(Array.from(data.itemsEtudies), ['schoolGuide']);
  assert.equal(data.prochainVisageChaton, 'img/Cat faces/Luna_Final.png?v=test');
  assert.deepEqual(Array.from(data.storiesVues), ['introVue', 'story1Vue']);
  assert.deepEqual(data.formationTermineeEnAttente, { kittyIndex: 0, metier: 'explorator', finishedTs: 1_700_000_000_000 });
  assert.deepEqual(data.formationIngenieurTermineeEnAttente, { kittyIndex: 1, metier: 'camp-engineer', engineerRank: 1, finishedTs: 1_700_000_001_000 });
  assert.equal(data.workRecipeSlots.wood[0].recipeId, 'cardboardPlanks');
  assert.equal(Object.hasOwn(data, 'staleProperty'), false);
  assert.deepEqual(parsed, JSON.parse(JSON.stringify(data)));

  const missing = Object.keys(state).filter(function(key) {
    return key !== 'staleProperty' && !Object.hasOwn(data, key);
  });
  assert.deepEqual(missing, []);
});

test('legacy migration is deterministic and does not mutate parsed input', function() {
  const core = loadCore();
  const now = 1_700_000_010_000;
  const legacy = {
    chatons: 2,
    wood: 7,
    woodTotalRecolte: 9,
    planks: 3,
    bricks: 4,
    cathouses: [now - 5_000],
    zonesExplorees: [],
    managers: { wood: 0 },
    workers: { woodcatting: [{ kittyIndex: 0, progress: 0.25 }] },
    itemsAppris: ['schoolGuide'],
    kittiesData: [{ nom: 'Bernardo', metier: 'bucheron', niveau: 1 }]
  };
  const before = JSON.stringify(legacy);
  const migrated = core.save.migrerDonneesSauvegarde(legacy, {
    maintenant: now,
    nomsKitties: ['Bernardo', 'Mochi'],
    assignerVisageChaton: function(name) { return 'face:' + name; }
  });

  assert.equal(JSON.stringify(legacy), before);
  assert.equal(migrated.cardboardPieces, 7);
  assert.equal(migrated.cardboardPiecesTotalRecolte, 9);
  assert.equal(migrated.cardboardPlanks, 3);
  assert.equal(migrated.cardboardPlanksTotalProduit, 3);
  assert.equal(migrated.pebbleBricks, 4);
  assert.equal(migrated.reductionCumulee, 5);
  assert.equal(Object.hasOwn(migrated, 'workers'), false);
  assert.deepEqual(Object.keys(migrated.workRecipeSlots), ['wood', 'food', 'rock']);
  assert.equal(migrated.managers.houses, null);
  assert.equal(migrated.zonesExplorees.includes('D1'), true);
  assert.equal(migrated.kittiesData.length, 2);
  assert.equal(migrated.kittiesData[0].metier, 'lumberjack');
  assert.equal(migrated.kittiesData[0].niveau, 0);
  assert.equal(migrated.kittiesData[0].visage, 'face:Bernardo');
  assert.equal(migrated.kittiesData[1].nom, 'Mochi');
  assert.equal(migrated.kittiesData[1].visage, 'face:Mochi');
  assert.equal(migrated.prochainVisageChaton, null);
  assert.deepEqual(Array.from(migrated.itemsAppris), ['schoolGuide']);
  assert.deepEqual(Array.from(migrated.itemsEtudies), []);
  assert.equal(migrated.storiesVues.includes('story6bVue'), true);
  assert.deepEqual(Array.from(migrated.ongletsVisites), ['gang', 'logs', 'buildings', 'inventaire']);
});

test('save analysis rejects malformed, unsafe and future saves', function() {
  const core = loadCore();
  const currentSave = core.save.creerDonneesSauvegarde(core.state.creerEtatInitial());
  assert.equal(core.save.analyserSauvegardeBrute('{bad json').ok, false);
  assert.match(
    core.save.analyserSauvegardeBrute(JSON.stringify({ saveVersion: 999, chatons: 0 })).erreur,
    /newer version/
  );
  currentSave.chatons = 1;
  currentSave.kittiesData = [{ nom: '<script>' }];
  assert.match(core.save.analyserSauvegardeBrute(JSON.stringify(currentSave)).erreur, /Invalid cat data/);
  const obsolete = core.save.analyserSauvegardeBrute(JSON.stringify({ chatons: 0 }));
  assert.equal(obsolete.ok, false);
  assert.equal(obsolete.incompatible, true);
  assert.equal(obsolete.ancienneVersion, 0);
  const invalidTabs = core.save.creerDonneesSauvegarde(core.state.creerEtatInitial());
  invalidTabs.ongletsVisites = ['unknown'];
  assert.match(
    core.save.analyserSauvegardeBrute(JSON.stringify(invalidTabs)).erreur,
    /Invalid visited tab data/
  );
  const invalidStudiedItems = core.save.creerDonneesSauvegarde(core.state.creerEtatInitial());
  invalidStudiedItems.itemsEtudies = [42];
  assert.match(
    core.save.analyserSauvegardeBrute(JSON.stringify(invalidStudiedItems)).erreur,
    /Invalid entries in field: itemsEtudies/
  );
  const invalidStories = core.save.creerDonneesSauvegarde(core.state.creerEtatInitial());
  invalidStories.storiesVues = [42];
  assert.match(
    core.save.analyserSauvegardeBrute(JSON.stringify(invalidStories)).erreur,
    /Invalid entries in field: storiesVues/
  );
});

test('state and save APIs are frozen and namespaced', function() {
  const core = loadCore();
  assert.equal(Object.isFrozen(core.state), true);
  assert.equal(Object.isFrozen(core.save), true);
  assert.equal(core.save.SAVE_KEY, 'chatonClicker');
  assert.equal(core.save.SAVE_RECOVERY_KEY, 'chatonClickerRecovery');
  assert.equal(core.save.SAVE_VERSION, 2);
});
