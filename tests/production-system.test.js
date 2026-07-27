const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const GAME_PATH = path.resolve(__dirname, '..', 'jeu.js');
const NAMESPACE_PATH = path.resolve(__dirname, '..', 'js', 'cat-inc.js');
const PRODUCTION_PATH = path.resolve(__dirname, '..', 'js', 'core', 'production.js');

function loadProductionCore() {
  const context = vm.createContext({ console });
  vm.runInContext(fs.readFileSync(NAMESPACE_PATH, 'utf8'), context, { filename: NAMESPACE_PATH });
  vm.runInContext(fs.readFileSync(PRODUCTION_PATH, 'utf8'), context, { filename: PRODUCTION_PATH });
  return context.CatInc.production;
}

const PAIR = {
  rawRes: 'raw',
  rawTotalKey: 'rawTotal',
  rawSeconds: 1,
  rawQuantity: 10,
  processingSeconds: 10,
  outputRes: 'processed',
  procTotalKey: 'processedTotal'
};

function makeSlot() {
  return {
    recipeId: 'processed', kittyIndex: 0, phase: 'idle', phaseProgress: 0,
    outputCarry: 0, gatheredInputs: {}, reservedInputs: {}
  };
}

function makeState(level = 0) {
  return { raw: 0, rawTotal: 0, processed: 0, processedTotal: 0, kittiesData: [{ niveau: level }] };
}

function modifiers(overrides = {}) {
  return Object.assign({
    gatheringSpeed: 1,
    gatheringProduction: 1,
    processingSpeed: 1,
    costMultiplier: 1,
    basicProduction: 1,
    complexProduction: 1,
    gatheringManualSpeed: 1,
    processingManualSpeed: 1,
    globalSpeed: 1
  }, overrides);
}

function closeTo(actual, expected, epsilon = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} should be close to ${expected}`);
}

test('a recipe slot gathers privately before processing one finished resource', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const slot = makeSlot();

  avancerRecetteSlot(state, PAIR, slot, 9, modifiers());
  assert.equal(slot.phase, 'gathering');
  closeTo(slot.gatheredInputs.raw, 9);
  assert.equal(state.raw, 0, 'simple input must never enter shared inventory');
  assert.equal(state.processed, 0);

  avancerRecetteSlot(state, PAIR, slot, 11, modifiers());
  assert.equal(state.processed, 1);
  assert.equal(state.processedTotal, 1);
  closeTo(state.rawTotal, 10);
  assert.equal(slot.phase, 'gathering');
  assert.deepEqual(Object.keys(slot.gatheredInputs), []);
});

test('REDUCED COST changes the private gathering target from 10 to 8', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const slot = makeSlot();
  avancerRecetteSlot(state, PAIR, slot, 8, modifiers({ costMultiplier: 0.8 }));
  assert.equal(slot.phase, 'processing');
  closeTo(state.rawTotal, 8);
  assert.equal(state.raw, 0);
});

test('REDUCED COST II changes the private gathering target from 10 to 6', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const slot = makeSlot();
  avancerRecetteSlot(state, PAIR, slot, 6, modifiers({ costMultiplier: 0.6 }));
  assert.equal(slot.phase, 'processing');
  closeTo(state.rawTotal, 6);
  assert.equal(state.raw, 0);
});

test('Gather Production Bonus only accelerates the gathering phase', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState(4);
  const slot = makeSlot();
  const basic = Math.pow(1.05, 4);
  avancerRecetteSlot(state, PAIR, slot, 10 / basic, modifiers({ basicProduction: basic }));
  assert.equal(slot.phase, 'processing');
  closeTo(state.rawTotal, 10);
  assert.equal(state.processed, 0);
});

test('Process Production Bonus is retained through fractional output carry', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState(4);
  const slot = makeSlot();
  const complex = Math.pow(1.03, 4);
  avancerRecetteSlot(state, PAIR, slot, 40, modifiers({ complexProduction: complex }));
  assert.equal(state.processed, 2);
  closeTo(slot.outputCarry, complex * 2 - 2);
});

test('manager and global speed modifiers affect only their intended phases', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const slot = makeSlot();
  avancerRecetteSlot(state, PAIR, slot, 2.5, modifiers({ gatheringSpeed: 2, gatheringProduction: 2 }));
  assert.equal(slot.phase, 'processing');
  avancerRecetteSlot(state, PAIR, slot, 2.5, modifiers({ processingSpeed: 2, globalSpeed: 2 }));
  assert.equal(state.processed, 1);
});

test('Manual Focus accelerates only its selected recipe phase', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const slot = makeSlot();

  avancerRecetteSlot(state, PAIR, slot, 10 / 3, modifiers({ gatheringManualSpeed: 3 }));
  assert.equal(slot.phase, 'processing');
  assert.equal(state.processed, 0);

  avancerRecetteSlot(state, PAIR, slot, 10 / 3, modifiers({ processingManualSpeed: 3 }));
  assert.equal(state.processed, 1);
  assert.equal(slot.phase, 'gathering');
});

test('Gathering Manual Focus does not spill into Processing after a phase transition', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const slot = makeSlot();

  avancerRecetteSlot(state, PAIR, slot, 4, modifiers({ gatheringManualSpeed: 3 }));
  assert.equal(slot.phase, 'processing');
  closeTo(slot.phaseProgress, 0.06666666666666667);
  assert.equal(state.processed, 0);
});

test('two slots can run the same recipe independently', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const state = makeState();
  const first = makeSlot();
  const second = makeSlot();
  avancerRecetteSlot(state, PAIR, first, 20, modifiers());
  avancerRecetteSlot(state, PAIR, second, 20, modifiers());
  assert.equal(state.processed, 2);
  closeTo(state.rawTotal, 20);
});

test('chunked offline simulation matches one active step', () => {
  const { avancerRecetteSlot } = loadProductionCore();
  const activeState = makeState();
  const offlineState = makeState();
  const activeSlot = makeSlot();
  const offlineSlot = makeSlot();
  const mods = modifiers({ gatheringSpeed: 1.4, processingSpeed: 1.5, complexProduction: 1.2 });
  avancerRecetteSlot(activeState, PAIR, activeSlot, 1000, mods);
  for (let i = 0; i < 100; i++) avancerRecetteSlot(offlineState, PAIR, offlineSlot, 10, mods);
  assert.equal(offlineState.processed, activeState.processed);
  closeTo(offlineState.rawTotal, activeState.rawTotal, 1e-7);
  closeTo(offlineSlot.phaseProgress, activeSlot.phaseProgress, 1e-7);
  closeTo(offlineSlot.outputCarry, activeSlot.outputCarry, 1e-7);
  assert.equal(offlineSlot.phase, activeSlot.phase);
});

test('active and offline paths share the recipe engine and no longer use the legacy Work ticks', () => {
  const source = fs.readFileSync(GAME_PATH, 'utf8');
  const calls = source.match(/tickWorkRecipes\(/g) || [];
  assert.equal(calls.length, 3, 'one definition plus active and offline calls are expected');
  assert.doesNotMatch(source, /\btickWorkers\(/);
  assert.doesNotMatch(source, /\btickTransformations\(/);
});
