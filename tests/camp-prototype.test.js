const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const namespaceSource = fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8');
const campSource = fs.readFileSync(path.join(root, 'js', 'ui', 'camp.js'), 'utf8');
const gameSource = fs.readFileSync(path.join(root, 'jeu.js'), 'utf8');
const htmlSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

function chargerCampApi() {
  const context = vm.createContext({});
  vm.runInContext(namespaceSource, context);
  vm.runInContext(campSource, context);
  return context.CatInc.camp;
}

test('development Camp tab is isolated behind debug=1', function() {
  assert.match(htmlSource, /id="onglet-camp"[\s\S]*?style="display:none"[\s\S]*?changerOnglet\('camp'\)/);
  assert.match(htmlSource, /id="contenu-camp"[^>]*role="tabpanel"[^>]*aria-labelledby="onglet-camp"/);
  assert.match(gameSource, /if \(id === "camp" && !DEV_MODE\) return/);
  assert.match(gameSource, /ecrireStyle\(domParId\("onglet-camp"\), "display", DEV_MODE \? "inline-flex" : "none"\)/);
  assert.match(cssSource, /body:not\(\[data-dev-mode="true"\]\) \.onglet-camp-dev\s*\{\s*display:\s*none !important/);
  assert.doesNotMatch(gameSource, /etat\.campPrototype/);
});

test('Camp prototype exposes a 20 by 30 collision-safe placement model', function() {
  const camp = chargerCampApi();
  assert.equal(camp.GRID_WIDTH, 20);
  assert.equal(camp.GRID_HEIGHT, 30);
  assert.equal(Object.isFrozen(camp), true);
  assert.equal(Object.isFrozen(camp.ITEM_TYPES), true);
  assert.deepEqual(
    Array.from(Object.keys(camp.ITEM_TYPES)),
    ['sawmill', 'kitchen', 'trainingCenter', 'tree', 'catToy', 'road']
  );

  const layout = [{ uid: 'one', type: 'sawmill', x: 2, y: 3 }];
  assert.equal(camp.testerPlacement(layout, 'kitchen', 8, 3).valide, true);
  assert.equal(camp.testerPlacement(layout, 'kitchen', 5, 4).valide, false);
  assert.equal(camp.testerPlacement(layout, 'sawmill', 17, 4).valide, false);
  assert.equal(camp.testerPlacement(layout, 'sawmill', 2, 3, 'one').valide, true);
  assert.equal(camp.testerPlacement(layout, 'road', 0, 0).valide, true);

  const roadLayout = [
    { uid: 'r1', type: 'road', x: 5, y: 5 },
    { uid: 'r2', type: 'road', x: 6, y: 5 },
    { uid: 'r3', type: 'road', x: 6, y: 6 }
  ];
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.connexionsRoute(roadLayout, 6, 5))),
    { north: false, east: false, south: true, west: true, mask: 12 }
  );
  assert.deepEqual(
    Array.from(camp.cellulesLigne(1, 1, 4, 1), function(cell) { return cell.x + ':' + cell.y; }),
    ['1:1', '2:1', '3:1', '4:1']
  );
  const diagonal = Array.from(camp.cellulesLigne(0, 0, 3, 3));
  diagonal.slice(1).forEach(function(cell, index) {
    const previous = diagonal[index];
    assert.equal(Math.abs(cell.x - previous.x) + Math.abs(cell.y - previous.y), 1);
  });
});

test('Camp prototype normalizes persisted layouts without overlaps or invalid items', function() {
  const camp = chargerCampApi();
  const normalized = camp.normaliserLayout([
    { uid: 'valid', type: 'sawmill', x: 1, y: 1 },
    { uid: 'overlap', type: 'kitchen', x: 2, y: 2 },
    { uid: 'outside', type: 'trainingCenter', x: 19, y: 29 },
    { uid: 'unknown', type: 'pond', x: 10, y: 10 },
    { uid: 'second', type: 'kitchen', x: 10, y: 10 }
  ]);
  assert.deepEqual(
    Array.from(normalized, function(item) { return item.uid; }),
    ['valid', 'second']
  );
});

test('Camp prototype uses pointer controls and separate debug-only persistence', function() {
  assert.match(gameSource, /const CAMP_PROTOTYPE_STORAGE_KEY = "catIncCampPrototypeLayoutV1"/);
  assert.match(gameSource, /localStorage\.setItem\(CAMP_PROTOTYPE_STORAGE_KEY, JSON\.stringify\(campPrototypeLayout\)\)/);
  assert.match(gameSource, /pointerdown[\s\S]*?pointermove[\s\S]*?pointerup[\s\S]*?pointercancel/);
  assert.match(gameSource, /mode: effacer \? "erase-road" : "paint-road"/);
  assert.match(gameSource, /campPrototypeApi\.cellulesLigne/);
  assert.match(gameSource, /campPrototypeApi\.connexionsRoute/);
  assert.match(gameSource, /function gererClavierCampPrototype\(event\)[\s\S]*?ArrowLeft[\s\S]*?ArrowRight[\s\S]*?ArrowUp[\s\S]*?ArrowDown/);
  assert.match(cssSource, /\.camp-prototype-board\s*\{[\s\S]*?aspect-ratio:\s*2\s*\/\s*3/);
  assert.match(cssSource, /\.camp-prototype-grid\s*\{[\s\S]*?background-size:\s*5% 3\.333333%/);
});

test('Camp layout editing is isolated in a full-screen mode with category menus', function() {
  assert.match(htmlSource, /id="camp-prototype-edit-open"[\s\S]*?entrerEditionCampPrototype\(\)/);
  assert.match(htmlSource, /id="camp-prototype-edit-done"[\s\S]*?quitterEditionCampPrototype\(\)/);
  assert.equal((htmlSource.match(/data-camp-category="(?:building|decoration|road)"/g) || []).length, 3);
  assert.match(htmlSource, /id="camp-prototype-category-sheet"[^>]*hidden/);
  assert.match(gameSource, /let campPrototypeModeEdition = false/);
  assert.match(gameSource, /function entrerEditionCampPrototype\(\)[\s\S]*?campPrototypeModeEdition = true[\s\S]*?renduCampPrototype\(\)/);
  assert.match(gameSource, /function quitterEditionCampPrototype\(restaurerFocus\)[\s\S]*?campPrototypeModeEdition = false[\s\S]*?campPrototypeTypeAPlacer = null[\s\S]*?campPrototypeGommeRoutes = false/);
  assert.match(gameSource, /function demarrerInteractionCampPrototype\(event\)\s*\{\s*if \(!DEV_MODE \|\| !campPrototypeModeEdition/);
  assert.match(gameSource, /function ouvrirCategorieCampPrototype\(categorie\)[\s\S]*?\["building", "decoration", "road"\]/);
  assert.match(gameSource, /Its gameplay interaction will be connected later/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-panel\s*\{[\s\S]*?position:\s*fixed[\s\S]*?inset:\s*0[\s\S]*?height:\s*100dvh/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-edit-dock\s*\{[\s\S]*?position:\s*absolute[\s\S]*?bottom:/);
  assert.match(cssSource, /\.camp-prototype-edit-dock > button\s*\{[\s\S]*?width:\s*70px[\s\S]*?height:\s*70px[\s\S]*?border-radius:\s*50%/);
});
