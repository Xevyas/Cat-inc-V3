const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gameSource = fs.readFileSync(path.join(root, 'jeu.js'), 'utf8');
const namespacePath = path.join(root, 'js', 'cat-inc.js');
const configPath = path.join(root, 'js', 'data', 'config.js');
const contentPath = path.join(root, 'js', 'data', 'content.js');
const changelogPath = path.join(root, 'js', 'data', 'changelog.js');
const statePath = path.join(root, 'js', 'core', 'state.js');
const savePath = path.join(root, 'js', 'core', 'save.js');
const productionPath = path.join(root, 'js', 'core', 'production.js');
const domPath = path.join(root, 'js', 'ui', 'dom.js');
const audioPath = path.join(root, 'js', 'ui', 'audio.js');
const campPath = path.join(root, 'js', 'ui', 'camp.js');

test('classic modules load in dependency order before the game', function() {
  const scripts = Array.from(indexSource.matchAll(/<script\s+src="([^"]+)"/g), function(match) {
    return match[1].split('?')[0];
  });
  assert.deepEqual(scripts.slice(-11), [
    'js/cat-inc.js',
    'js/data/config.js',
    'js/data/content.js',
    'js/data/changelog.js',
    'js/core/state.js',
    'js/core/save.js',
    'js/core/production.js',
    'js/ui/dom.js',
    'js/ui/audio.js',
    'js/ui/camp.js',
    'jeu.js'
  ]);
  assert.doesNotMatch(indexSource, /<script[^>]+type="module"/);
});

test('extracted modules expose only namespaced frozen APIs', function() {
  const context = vm.createContext({ document: { getElementById: function() { return null; } } });
  [namespacePath, configPath, contentPath, changelogPath, statePath, savePath, productionPath, domPath, audioPath, campPath].forEach(function(filePath) {
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });

  assert.deepEqual(Array.from(Object.keys(context.CatInc)).sort(), ['audio', 'camp', 'data', 'dom', 'production', 'save', 'state']);
  assert.equal(Object.isFrozen(context.CatInc.data.config), true);
  assert.equal(Object.isFrozen(context.CatInc.data.content), true);
  assert.equal(Object.isFrozen(context.CatInc.state), true);
  assert.equal(Object.isFrozen(context.CatInc.save), true);
  assert.equal(Object.isFrozen(context.CatInc.production), true);
  assert.equal(Object.isFrozen(context.CatInc.dom), true);
  assert.equal(Object.isFrozen(context.CatInc.audio), true);
  assert.equal(Object.isFrozen(context.CatInc.camp), true);
  assert.equal(context.CONFIG, undefined);
  assert.equal(context.RESOURCE_INFO, undefined);
  assert.equal(context.NOMS_KITTIES, undefined);
  assert.equal(context.creerEtatInitial, undefined);
  assert.equal(context.analyserSauvegardeBrute, undefined);
  assert.equal(context.productionProcBonus, undefined);
  assert.equal(context.avancerRecetteSlot, undefined);
  assert.equal(context.domParId, undefined);
  assert.equal(context.ecrireTexte, undefined);
});

test('jeu.js consumes extracted APIs instead of redeclaring them', function() {
  assert.match(gameSource, /globalThis\.CatInc\.data\.config/);
  assert.match(gameSource, /globalThis\.CatInc\.data\.content/);
  assert.match(gameSource, /globalThis\.CatInc\.production\.productionProcBonus/);
  assert.match(gameSource, /globalThis\.CatInc\.state/);
  assert.match(gameSource, /globalThis\.CatInc\.save/);
  assert.match(gameSource, /globalThis\.CatInc\.production\.avancerRecetteSlot/);
  assert.match(gameSource, /const domUtils = globalThis\.CatInc\.dom/);
  assert.doesNotMatch(gameSource, /function productionProcBonus\s*\(/);
  assert.doesNotMatch(gameSource, /function avancerRecetteSlot\s*\(/);
  assert.doesNotMatch(gameSource, /function domParId\s*\(/);
  assert.doesNotMatch(gameSource, /function ecrireTexte\s*\(/);
  assert.doesNotMatch(gameSource, /function creerEtatInitial\s*\(/);
  assert.doesNotMatch(gameSource, /function validerStructureSauvegarde\s*\(/);
  assert.doesNotMatch(gameSource, /function analyserSauvegardeBrute\s*\(/);
  assert.doesNotMatch(gameSource, /const CONFIG\s*=\s*\{/);
  assert.doesNotMatch(gameSource, /const RESOURCE_INFO\s*=\s*\{/);
  assert.doesNotMatch(gameSource, /const NOMS_KITTIES\s*=\s*\[/);
});

test('all extracted balance and content data match the pre-extraction snapshot', function() {
  const context = vm.createContext({});
  [namespacePath, configPath, contentPath].forEach(function(filePath) {
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  const config = context.CatInc.data.config;
  const content = context.CatInc.data.content;
  const snapshot = {
    CONFIG: config.CONFIG,
    LIVRE_ICONE: content.LIVRE_ICONE,
    RESOURCE_INFO: content.RESOURCE_INFO,
    ITEMS: content.ITEMS,
    METIERS: content.METIERS,
    SPHERE_GRIDS: content.SPHERE_GRIDS,
    ZONES_CARTE: content.ZONES_CARTE,
    REGIONS: content.REGIONS,
    TIERS_KITTIES: content.TIERS_KITTIES,
    NOMS_KITTIES: content.NOMS_KITTIES,
    VITESSES: config.VITESSES,
    KITTY_ICON: content.KITTY_ICON,
    CHECK_ICON: content.CHECK_ICON,
    CAT_FACES: content.CAT_FACES,
    CAT_FACES_ALEATOIRES: content.CAT_FACES_ALEATOIRES
  };
  const json = JSON.stringify(snapshot);
  assert.equal(Buffer.byteLength(json), 50863);
  assert.equal(
    crypto.createHash('sha256').update(json).digest('hex'),
    'cbfb7f7f90d754575df8f4c007c94cccb3b07822ff85b0d7909997803e1afa3b'
  );
  assert.equal(content.CAT_FACES_ALEATOIRES.includes(content.CAT_FACES.alt3), true);
  assert.equal(content.CAT_FACES_ALEATOIRES.includes(content.CAT_FACES.alt4), true);
});
