const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const GAME_PATH = path.resolve(__dirname, '..', 'jeu.js');
const NAMESPACE_PATH = path.resolve(__dirname, '..', 'js', 'cat-inc.js');
const CONFIG_PATH = path.resolve(__dirname, '..', 'js', 'data', 'config.js');
const CONTENT_PATH = path.resolve(__dirname, '..', 'js', 'data', 'content.js');
const CHANGELOG_PATH = path.resolve(__dirname, '..', 'js', 'data', 'changelog.js');
const STATE_PATH = path.resolve(__dirname, '..', 'js', 'core', 'state.js');
const SAVE_PATH = path.resolve(__dirname, '..', 'js', 'core', 'save.js');
const PRODUCTION_PATH = path.resolve(__dirname, '..', 'js', 'core', 'production.js');
const SAVE_SECTION_END = '// 7. NOTIFICATIONS & LOGS';

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

function loadSaveApi() {
  const source = fs.readFileSync(GAME_PATH, 'utf8');
  const endIndex = source.indexOf(SAVE_SECTION_END);
  assert.notEqual(endIndex, -1, 'save section marker must exist');

  const alerts = [];
  const localStorage = new MemoryStorage();
  const context = vm.createContext({
    console,
    localStorage,
    alert(message) { alerts.push(message); },
    confirm() { return true; },
    assignerGangLeader() {},
  });

  const exportsSource = `
    globalThis.__saveTestApi = {
      SAVE_KEY,
      SAVE_RECOVERY_KEY,
      SAVE_VERSION,
      analyserSauvegardeBrute,
      charger,
      sauvegarder,
      normaliserOccupationsChatons,
      reinitialiserEtat,
      getEtat: function() { return etat; },
      isSaveLocked: function() { return sauvegardeVerrouillee; },
      isMajorRestartRequired: function() { return redemarrageMajeurRequis; },
      getLegacyPreferences: function() { return preferencesAncienneSauvegarde; }
    };
  `;

  vm.runInContext(fs.readFileSync(NAMESPACE_PATH, 'utf8'), context, { filename: NAMESPACE_PATH });
  vm.runInContext(fs.readFileSync(CONFIG_PATH, 'utf8'), context, { filename: CONFIG_PATH });
  vm.runInContext(fs.readFileSync(CONTENT_PATH, 'utf8'), context, { filename: CONTENT_PATH });
  vm.runInContext(fs.readFileSync(CHANGELOG_PATH, 'utf8'), context, { filename: CHANGELOG_PATH });
  vm.runInContext(fs.readFileSync(STATE_PATH, 'utf8'), context, { filename: STATE_PATH });
  vm.runInContext(fs.readFileSync(SAVE_PATH, 'utf8'), context, { filename: SAVE_PATH });
  vm.runInContext(fs.readFileSync(PRODUCTION_PATH, 'utf8'), context, { filename: PRODUCTION_PATH });
  vm.runInContext(source.slice(0, endIndex) + exportsSource, context, { filename: GAME_PATH });
  return { api: context.__saveTestApi, localStorage, alerts };
}

test('a current save round-trips with an explicit version', () => {
  const { api, localStorage } = loadSaveApi();
  const state = api.getEtat();
  state.chatons = 2;
  state.kittiesData = [
    { nom: 'Bernardo', metier: 'gang-leader', niveau: 1, xp: 1, tier: 0, managerMult: 2, jobNiveau: 0 },
    { nom: 'Mochi', metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, jobNiveau: 0 }
  ];
  state.cardboardPieces = 17;
  state.spherePerks = { 'gl-rec': 'learned' };
  state.afficherTempsAjusteRecrutement = true;
  state.regionCourante = 'startingNeighbourhood';
  state.storiesVues.push('introVue', 'story1Vue');
  state.resourceBarHidden.push('cardboardPlanks', 'salads');
  state.ameliorations = { obsolete: true };

  api.sauvegarder();
  const serialized = JSON.parse(localStorage.getItem(api.SAVE_KEY));
  assert.equal(serialized.saveVersion, api.SAVE_VERSION);
  assert.equal(serialized.cardboardPieces, 17);
  assert.equal(serialized.regionCourante, 'startingNeighbourhood');
  assert.deepEqual(serialized.storiesVues, ['introVue', 'story1Vue']);
  assert.deepEqual(serialized.resourceBarHidden, ['cardboardPlanks', 'salads']);
  assert.equal(Object.hasOwn(serialized, 'ameliorations'), false);
  const missingStateKeys = Object.keys(state).filter(function(key) {
    return key !== 'ameliorations' && !Object.hasOwn(serialized, key);
  });
  assert.equal(missingStateKeys.join(','), '', 'every state field must be serialized');

  api.reinitialiserEtat();
  assert.equal(api.charger(), true);
  assert.equal(api.getEtat().chatons, 2);
  assert.equal(api.getEtat().cardboardPieces, 17);
  assert.equal(api.getEtat().spherePerks['gl-rec'], 'learned');
  assert.equal(api.getEtat().afficherTempsAjusteRecrutement, true);
  assert.equal(api.getEtat().kittiesData[0].niveau, 1);
  assert.equal(api.getEtat().kittiesData[0].xp, 1);
  assert.equal(api.getEtat().kittiesData[0].managerMult, 1.5);
  assert.deepEqual(Array.from(api.getEtat().storiesVues), ['introVue', 'story1Vue']);
  assert.deepEqual(Array.from(api.getEtat().resourceBarHidden), ['cardboardPlanks', 'salads']);
});

test('one Cat cannot remain assigned to a running mission and a recipe after save repair', () => {
  const { api } = loadSaveApi();
  const state = api.getEtat();
  state.kittiesData = [
    { nom: 'Bernardo', metier: 'gang-leader', niveau: 0, xp: 0, tier: 0 },
    { nom: 'Mochi', metier: null, niveau: 0, xp: 0, tier: 0 }
  ];
  state.exploEnCours = [{ id: 'test', kittyIndices: [0], power: 1, startTs: 0, duree: 10 }];
  state.workRecipeSlots.wood[0].recipeId = 'cardboardPlanks';
  state.workRecipeSlots.wood[0].kittyIndex = 0;

  assert.equal(api.normaliserOccupationsChatons(), true);
  assert.deepEqual(Array.from(state.exploEnCours[0].kittyIndices), [0]);
  assert.equal(state.workRecipeSlots.wood[0].kittyIndex, null);
});

test('loading an old save requires a restart without overwriting it', () => {
  const { api, localStorage } = loadSaveApi();
  const oldSave = JSON.stringify({
    saveVersion: 1,
    chatons: 6,
    itemsAcquis: ['schoolGuide'],
    itemsAppris: [],
    itemsEtudies: ['schoolGuide'],
    kittiesData: [],
    volumeEffetsSonores: 0.18,
    volumeMusique: 0.42,
    afficherTempsAjusteRecrutement: true
  });
  localStorage.setItem(api.SAVE_KEY, oldSave);

  assert.equal(api.charger(), false);
  assert.equal(api.isMajorRestartRequired(), true);
  assert.equal(api.isSaveLocked(), true);
  assert.equal(localStorage.getItem(api.SAVE_KEY), oldSave);
  assert.deepEqual(JSON.parse(JSON.stringify(api.getLegacyPreferences())), {
    volumeEffetsSonores: 0.18,
    volumeMusique: 0.42,
    afficherTempsAjusteRecrutement: true,
    avertirSurplusNourriture: true
  });
  api.getEtat().chatons = 99;
  api.sauvegarder();
  assert.equal(localStorage.getItem(api.SAVE_KEY), oldSave);
});

test('resetting the state clears perks, settings and stale properties', () => {
  const { api } = loadSaveApi();
  const state = api.getEtat();
  state.spherePerks = { 'gl-mini': 'learned' };
  state.afficherTempsAjusteRecrutement = true;
  state.workBoostFinTs = Date.now() + 60_000;
  state.resourceBarHidden = ['cardboardPlanks'];
  state.staleProperty = 'remove me';

  api.reinitialiserEtat();
  const resetState = api.getEtat();
  assert.equal(Object.keys(resetState.spherePerks).length, 0);
  assert.equal(resetState.afficherTempsAjusteRecrutement, false);
  assert.equal(resetState.workBoostFinTs, 0);
  assert.deepEqual(Array.from(resetState.resourceBarHidden), []);
  assert.equal(Object.hasOwn(resetState, 'staleProperty'), false);
  assert.equal(resetState.zonesExplorees.join(','), 'D1');
});

test('corrupted JSON is preserved and cannot be overwritten by autosave', () => {
  const { api, localStorage, alerts } = loadSaveApi();
  const corrupted = '{ definitely not valid JSON';
  localStorage.setItem(api.SAVE_KEY, corrupted);

  assert.equal(api.charger(), false);
  assert.equal(api.isSaveLocked(), true);
  assert.equal(localStorage.getItem(api.SAVE_KEY), corrupted);
  const recovery = JSON.parse(localStorage.getItem(api.SAVE_RECOVERY_KEY));
  assert.equal(recovery.raw, corrupted);
  assert.match(recovery.reason, /valid JSON/);
  assert.equal(alerts.length, 1);

  api.getEtat().chatons = 99;
  api.sauvegarder();
  assert.equal(localStorage.getItem(api.SAVE_KEY), corrupted);
});

test('invalid and unsafe save structures are rejected', () => {
  const { api } = loadSaveApi();
  const invalidCases = [
    JSON.stringify({}),
    JSON.stringify({ saveVersion: api.SAVE_VERSION }),
    JSON.stringify({ chatons: 'many' }),
    JSON.stringify({ chatons: 1, kittiesData: {} }),
    JSON.stringify({ chatons: 1, workers: { sawmill: 2 } }),
    JSON.stringify({ chatons: 1, workers: { sawmill: [{ kittyIndex: 9, progress: 0 }] } }),
    JSON.stringify({ chatons: 1, scoutingsEnCours: { searchTrashAgain: null } }),
    JSON.stringify({ chatons: 1, exploEnCours: [{ id: 'bad', kittyIndices: null }] }),
    JSON.stringify({ chatons: 1, logs: [null] }),
    JSON.stringify({ chatons: 1, learningEnCours: {} }),
    JSON.stringify({ chatons: 1, kittiesData: [{ nom: '<img onerror=alert(1)>' }] }),
    JSON.stringify({ saveVersion: api.SAVE_VERSION + 1, chatons: 1 }),
  ];

  for (const raw of invalidCases) {
    assert.equal(api.analyserSauvegardeBrute(raw).ok, false, raw);
  }
});

test('partial but recognizable legacy saves are identified as incompatible', () => {
  const { api } = loadSaveApi();
  const result = api.analyserSauvegardeBrute(JSON.stringify({ chatons: 0 }));
  assert.equal(result.ok, false);
  assert.equal(result.incompatible, true);
  assert.equal(result.ancienneVersion, 0);
});
