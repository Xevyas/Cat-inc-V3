const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'jeu.js'), 'utf8').replace(/\r\n/g, '\n');
const namespacePath = path.join(__dirname, '..', 'js', 'cat-inc.js');
const domPath = path.join(__dirname, '..', 'js', 'ui', 'dom.js');

function extraire(debut, fin) {
  const start = source.indexOf(debut);
  const end = source.indexOf(fin, start);
  assert.notEqual(start, -1, 'start marker should exist: ' + debut);
  assert.notEqual(end, -1, 'end marker should exist: ' + fin);
  return source.slice(start, end);
}

test('DOM helpers skip identical writes and cache stable nodes', function() {
  let lookups = 0;
  let currentNode = { isConnected: true };
  const context = vm.createContext({
    document: {
      getElementById: function() {
        lookups += 1;
        return currentNode;
      }
    }
  });
  vm.runInContext(fs.readFileSync(namespacePath, 'utf8'), context, { filename: namespacePath });
  vm.runInContext(fs.readFileSync(domPath, 'utf8'), context, { filename: domPath });
  const api = context.CatInc.dom;

  assert.equal(api.domParId('stable'), currentNode);
  assert.equal(api.domParId('stable'), currentNode);
  assert.equal(lookups, 1);

  currentNode.isConnected = false;
  currentNode = { isConnected: true };
  assert.equal(api.domParId('stable'), currentNode);
  assert.equal(lookups, 2);

  let text = 'unchanged';
  let textWrites = 0;
  const textEl = {};
  Object.defineProperty(textEl, 'textContent', {
    get: function() { return text; },
    set: function(value) { textWrites += 1; text = value; }
  });
  assert.equal(api.ecrireTexte(textEl, 'unchanged'), false);
  assert.equal(api.ecrireTexte(textEl, 'changed'), true);
  assert.equal(api.ecrireTexte(textEl, 'changed'), false);
  assert.equal(textWrites, 1);

  let html = '<b>same</b>';
  let htmlWrites = 0;
  const htmlEl = {};
  Object.defineProperty(htmlEl, 'innerHTML', {
    get: function() { return html; },
    set: function(value) { htmlWrites += 1; html = value; }
  });
  assert.equal(api.ecrireHTML(htmlEl, '<b>same</b>'), false);
  assert.equal(api.ecrireHTML(htmlEl, '<b>new</b>'), true);
  assert.equal(api.ecrireHTML(htmlEl, '<b>new</b>'), false);
  assert.equal(htmlWrites, 1);

  let display = 'none';
  let styleWrites = 0;
  const styleEl = { style: {} };
  Object.defineProperty(styleEl.style, 'display', {
    get: function() { return display; },
    set: function(value) { styleWrites += 1; display = value; }
  });
  assert.equal(api.ecrireStyle(styleEl, 'display', 'none'), false);
  assert.equal(api.ecrireStyle(styleEl, 'display', 'block'), true);
  assert.equal(api.ecrireStyle(styleEl, 'display', 'block'), false);
  assert.equal(styleWrites, 1);

  const propertyEl = { disabled: false };
  assert.equal(api.ecrirePropriete(propertyEl, 'disabled', false), false);
  assert.equal(api.ecrirePropriete(propertyEl, 'disabled', true), true);
  assert.equal(propertyEl.disabled, true);

  const classes = new Set();
  let toggles = 0;
  const classEl = {
    classList: {
      contains: function(name) { return classes.has(name); },
      toggle: function(name, active) {
        toggles += 1;
        if (active) classes.add(name); else classes.delete(name);
      }
    }
  };
  assert.equal(api.basculerClasse(classEl, 'active', false), false);
  assert.equal(api.basculerClasse(classEl, 'active', true), true);
  assert.equal(api.basculerClasse(classEl, 'active', true), false);
  assert.equal(toggles, 1);
});

test('master render updates the header and only the visible tab', function() {
  const tabs = {
    gang: null,
    work: 'renduWorkPairs',
    buildings: 'renduBuildings',
    facilities: 'renduFacilities',
    explorations: 'renduExplorations',
    inventaire: 'renduInventaire',
    logs: null
  };
  const dispatcher = extraire('function rendu() {', '// ════════════════════════════════════════════════════════════\n// 9b. EXPLORATIONS RENDER');

  Object.entries(tabs).forEach(function(entry) {
    const activeTab = entry[0];
    const expectedSection = entry[1];
    const calls = {};
    const names = [
      'renduRessources', 'renduSequence', 'renduWorkPairs', 'renduBuildings',
      'renduFacilities', 'renduExplorations', 'renduInventaire'
    ];
    const context = {
      document: { body: { dataset: { ongletActif: activeTab } } },
      unlocks: function() { return {}; },
      renduVerrouilleParInteraction: function() { return false; }
    };
    names.forEach(function(name) {
      calls[name] = 0;
      context[name] = function() { calls[name] += 1; };
    });
    vm.createContext(context);
    vm.runInContext(dispatcher + '\nthis.runRender = rendu;', context);
    context.runRender();

    assert.equal(calls.renduRessources, 1, activeTab + ' should update resources');
    assert.equal(calls.renduSequence, 1, activeTab + ' should update catch sequence');
    names.slice(2).forEach(function(name) {
      assert.equal(calls[name], name === expectedSection ? 1 : 0, activeTab + ': ' + name);
    });
  });
});

test('pointer interactions defer structural rendering without pausing simulation', function() {
  assert.match(source, /const RENDER_INTERACTION_GRACE_MS = 120;/);
  assert.match(source, /document\.addEventListener\("pointerdown"[\s\S]*?pointeursInteractionActifs\.add\(event\.pointerId\)/);
  assert.match(source, /document\.addEventListener\("pointerup"[\s\S]*?terminerProtectionInteraction\(event\.pointerId\)/);
  assert.match(source, /document\.addEventListener\("click"[\s\S]*?renduInteractionVerrouJusqua = 0;[\s\S]*?queueMicrotask/);
  assert.match(source, /function rendu\(\) \{\s*if \(renduVerrouilleParInteraction\(\)\) \{[\s\S]*?renduInteractionEnAttente = true;[\s\S]*?return;/);
  assert.match(source, /function planifierRenduApresInteraction\(\)[\s\S]*?renduInteractionEnAttente = false;\s*rendu\(\);/);
  assert.match(source, /function tick\(\)[\s\S]*?tickWorkRecipes\(vitesse \* TICK_DT \* workBoostMult\(\), true\)[\s\S]*?rendu\(\);/);
});

test('simulation ticks use lightweight rendering and tab switches coalesce structural work', function() {
  assert.ok(source.includes('function renduDynamique()'));
  assert.ok(source.includes('renduWorkDynamique();'));
  assert.ok(source.includes('function actualiserTimersExplorations()'));
  assert.ok(source.includes('function planifierRenduOnglet(callback)'));
  assert.ok(source.includes('data-work-family='));
  assert.ok(source.includes('data-work-slot='));
  assert.match(source, /function tick\(\)[\s\S]*?renduDynamique\(\);/);
});

test('hot Work render caches recipe cards and uses guarded DOM writes', function() {
  const recipeRender = extraire('function renduSlotRecette(familyId, slotIdx) {', 'function actualiserIndicateursExploration() {');
  assert.match(recipeRender, /el\.dataset\.recipeState === stateKey/);
  assert.match(recipeRender, /el\.dataset\.recipeState = stateKey/);
  const familyRender = extraire('function renduWorkPairs(u) {', '// Tapping or keyboard-activating a resource icon');
  assert.match(familyRender, /ecrireHTML\(banner,/);
  assert.doesNotMatch(familyRender, /banner\.innerHTML\s*=/);
});

test('recipe progress combines Gathering and Processing into one Cat-ring rotation', function() {
  const context = vm.createContext({
    quantiteInputEffective: function() { return 10; }
  });
  const progressCode = extraire('function progressionsSlotRecette(slot, pair) {', 'function renduSlotRecette(familyId, slotIdx) {');
  vm.runInContext(progressCode + '\nthis.progressFor = progressionsSlotRecette;', context);
  const pair = { rawRes: 'pieces', inputs: [{}] };

  const gathering = context.progressFor({
    kittyIndex: 0,
    phase: 'gathering',
    phaseProgress: 0,
    gatheredInputs: { pieces: 4 }
  }, pair);
  assert.equal(gathering.gathering, 0.4);
  assert.equal(gathering.processing, 0);
  assert.equal(gathering.phase, 0.4);
  assert.equal(gathering.overall, 0.2);

  const processing = context.progressFor({
    kittyIndex: 0,
    phase: 'processing',
    phaseProgress: 0.3,
    gatheredInputs: { pieces: 10 }
  }, pair);
  assert.equal(processing.gathering, 1);
  assert.equal(processing.processing, 0.3);
  assert.equal(processing.phase, 0.3);
  assert.equal(processing.overall, 0.65);
});

test('recipe timing labels use the private Gather duration and full cycle duration', function() {
  const context = vm.createContext({
    multiplicateurFamille: function() { return 1; },
    multiplicateurProductionFamille: function() { return 1; },
    gangLeaderBonus: function() { return 1; },
    workBoostMult: function() { return 1; },
    multiplicateurCoutFamille: function() { return 1; },
    quantiteInputEffective: function() { return 10; }
  });
  const timingCode = extraire('function tauxGatheringRecette(pair, kitty) {', 'function tauxProductionSlotRecette(pair, slot) {');
  vm.runInContext(timingCode + '\nthis.gatherDuration = dureeGatheringRecette;\nthis.processingDuration = dureeProcessingRecette;\nthis.cycleDuration = dureeCycleRecette;', context);
  const pair = {
    rawAction: 'woodcatting',
    rawCfg: { secondesParUnite: 60 },
    procMultAction: 'sawmill',
    procCfg: { secondesParPlanche: 300 },
    procSecUnite: 'secondesParPlanche',
    inputs: [{}]
  };
  const kitty = { niveau: 0 };
  assert.equal(context.gatherDuration(pair, kitty), 600);
  assert.equal(context.processingDuration(pair, kitty), 300);
  assert.equal(context.cycleDuration(pair, kitty), 900);
});
