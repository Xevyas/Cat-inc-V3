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

test('Camp prototype exposes an 18 by 12 collision-safe placement model', function() {
  const camp = chargerCampApi();
  assert.equal(camp.GRID_WIDTH, 18);
  assert.equal(camp.GRID_HEIGHT, 12);
  assert.equal(Object.isFrozen(camp), true);
  assert.equal(Object.isFrozen(camp.ITEM_TYPES), true);
  assert.deepEqual(
    Array.from(Object.keys(camp.ITEM_TYPES)),
    [
      'cardboardBox', 'jobCenter', 'sawmill', 'catchen', 'pawsonry', 'trainingCenter',
      'tree', 'catToy', 'junkGreenBush', 'junkThornBush', 'junkFlowerBush',
      'junkPebblePile', 'junkStoneBlockPile', 'junkTallGrass', 'road'
    ]
  );
  assert.deepEqual(
    Array.from(Object.values(camp.ITEM_TYPES)
      .filter(function(type) { return type.category === 'junk'; })
      .map(function(type) { return [type.label, type.width, type.height]; })),
    [
      ['Green Bush', 2, 1],
      ['Thorny Bramble Bush', 2, 1],
      ['Flowering Bush', 2, 1],
      ['Pile of Pebbles', 1, 1],
      ['Pile of Stone Blocks', 2, 2],
      ['Tall Green Grass', 1, 1]
    ]
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.dimensionsType('cardboardBox', 90))),
    { width: 1, height: 2, rotation: 90 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.dimensionsType('jobCenter', 270))),
    { width: 4, height: 3, rotation: 270 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.dimensionsType('sawmill', 90))),
    { width: 2, height: 3, rotation: 90 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.dimensionsType('catchen', 90))),
    { width: 3, height: 3, rotation: 90 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.dimensionsType('pawsonry', 270))),
    { width: 3, height: 3, rotation: 270 }
  );
  assert.equal(camp.testerPlacement([], 'jobCenter', 13, 6, null, 0).valide, true);
  assert.equal(camp.testerPlacement([], 'jobCenter', 15, 7, null, 90).valide, false);

  const layout = [{ uid: 'one', type: 'sawmill', x: 2, y: 3 }];
  assert.equal(camp.testerPlacement(layout, 'catchen', 8, 3).valide, true);
  assert.equal(camp.testerPlacement(layout, 'catchen', 4, 4).valide, false);
  assert.equal(camp.testerPlacement(layout, 'sawmill', 16, 4).valide, false);
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
    { uid: 'outside', type: 'trainingCenter', x: 14, y: 11 },
    { uid: 'unknown', type: 'pond', x: 10, y: 10 },
    { uid: 'second', type: 'kitchen', x: 8, y: 8 },
    { uid: 'rotated', type: 'jobCenter', x: 12, y: 7, rotation: 90 },
    { uid: 'junk', type: 'junkTallGrass', x: 17, y: 11 }
  ]);
  assert.deepEqual(
    Array.from(normalized, function(item) { return item.uid; }),
    ['valid', 'second', 'rotated', 'junk']
  );
  assert.equal(normalized[0].rotation, 0);
  assert.equal(normalized[1].type, 'catchen');
  assert.equal(normalized[2].rotation, 90);
  assert.equal(normalized[3].type, 'junkTallGrass');
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.rectangleItem(normalized[2]))),
    { x: 12, y: 7, width: 4, height: 3 }
  );
});

test('Camp starts with the first three blue-garden rows and expands through clearing and conquest', function() {
  const camp = chargerCampApi();
  let terrain = camp.creerTerrainInitial();
  assert.deepEqual(
    JSON.parse(JSON.stringify(camp.INITIAL_BUILDABLE_RECT)),
    { x: 6, y: 4, width: 6, height: 3 }
  );
  assert.equal(camp.HOUSE_DECOR_HEIGHT, 4);
  assert.equal(camp.TERRAIN_CELL_COUNT, 144);
  assert.deepEqual(Array.from(Object.keys(camp.TERRITORY_ZONES)), ['redGarden', 'home', 'greenGarden']);
  assert.deepEqual(
    Array.from(Object.values(camp.TERRITORY_ZONES), function(zone) {
      return { x: zone.x, y: zone.y, width: zone.width, height: zone.height };
    }),
    [
      { x: 0, y: 4, width: 6, height: 8 },
      { x: 6, y: 4, width: 6, height: 8 },
      { x: 12, y: 4, width: 6, height: 8 }
    ]
  );
  assert.equal(terrain.clearedCells.length, 18);
  assert.deepEqual(Array.from(terrain.claimedZoneIds), ['home']);
  assert.equal(camp.zoneTerrainPourCellule(9, 2), null);
  assert.equal(camp.estCelluleConstructible(terrain, 6, 4), true);
  assert.equal(camp.estCelluleConstructible(terrain, 6, 7), false);
  const premierObstacle = camp.obstacleCellule(terrain, 6, 7);
  assert.equal(premierObstacle.label.length > 0, true);
  assert.deepEqual(
    Array.from(premierObstacle.cells, function(cell) { return cell.x + ':' + cell.y; }),
    ['6:7', '7:7']
  );
  assert.equal(camp.peutDebroussailler(terrain, 6, 7).valide, true);
  assert.equal(camp.peutConquerirZone(terrain, 'redGarden').valide, true);

  terrain = camp.debroussaillerTerrain(terrain, 6, 7).terrain;
  premierObstacle.cells.forEach(function(cell) {
    assert.equal(camp.estCelluleConstructible(terrain, cell.x, cell.y), true);
  });
  assert.equal(terrain.clearedCells.length, 18 + premierObstacle.cells.length);
  assert.equal(camp.obstacleCellule(terrain, 7, 7), null);
  terrain = camp.conquerirZoneTerrain(terrain, 'redGarden').terrain;
  assert.equal(camp.estZoneConquise(terrain, 'redGarden'), true);
  assert.equal(camp.estCelluleConstructible(terrain, 5, 4), false);
  assert.equal(camp.peutDebroussailler(terrain, 5, 4).valide, true);

  const initial = camp.creerTerrainInitial();
  assert.equal(camp.testerPlacement([], 'cardboardBox', 6, 4, null, 0, initial).valide, true);
  assert.equal(camp.testerPlacement([], 'cardboardBox', 6, 3, null, 0, initial).valide, false);
  assert.equal(camp.testerPlacement([], 'sawmill', 5, 4, null, 0, initial).valide, false);
  const migrated = camp.adapterTerrainAuLayout(initial, [
    { uid: 'old', type: 'cardboardBox', x: 0, y: 4, rotation: 0 }
  ]);
  assert.equal(camp.estZoneConquise(migrated, 'redGarden'), true);
  assert.equal(camp.estCelluleConstructible(migrated, 0, 4), true);
});

test('Camp clearing obstacles have stable multi-cell footprints and illustrated assets', function() {
  const camp = chargerCampApi();
  const expectedTypes = [
    ['greenBush', 2, 1],
    ['thornBush', 2, 1],
    ['flowerBush', 2, 1],
    ['pebblePile', 1, 1],
    ['stoneBlockPile', 2, 2],
    ['tallGrass', 1, 1]
  ];
  assert.deepEqual(
    Array.from(camp.OBSTACLE_TYPES, function(type) {
      return [type.id, type.width, type.height];
    }),
    expectedTypes
  );
  assert.equal(camp.creerTerrainInitial().version, 4);
  const initialKeys = new Set(camp.creerTerrainInitial().clearedCells);
  const occupiedKeys = new Set();
  camp.OBSTACLE_LAYOUT.forEach(function(obstacle) {
    const zone = camp.TERRITORY_ZONES[obstacle.zoneId];
    assert.equal(obstacle.cells.length, obstacle.width * obstacle.height);
    assert.match(obstacle.asset, /Camp_Obstacle_Watercolor_Game_v1\.png\?v=0\.0001$/);
    obstacle.cells.forEach(function(cell) {
      const key = camp.cleCellule(cell.x, cell.y);
      assert.equal(initialKeys.has(key), false);
      assert.equal(occupiedKeys.has(key), false);
      assert.equal(cell.x >= zone.x && cell.x < zone.x + zone.width, true);
      assert.equal(cell.y >= zone.y && cell.y < zone.y + zone.height, true);
      occupiedKeys.add(key);
    });
  });
  assert.equal(occupiedKeys.size + initialKeys.size, camp.TERRAIN_CELL_COUNT);

  const partialLegacyTerrain = {
    version: 3,
    claimedZoneIds: ['home'],
    clearedCells: initialKeys.size ? Array.from(initialKeys).concat('6:7') : ['6:7']
  };
  const migrated = camp.normaliserTerrain(partialLegacyTerrain);
  assert.equal(migrated.version, 4);
  assert.equal(migrated.clearedCells.includes('6:7'), true);
  assert.equal(migrated.clearedCells.includes('7:7'), true);
});

test('Camp obstacle demolition duration doubles for every occupied cell', function() {
  const camp = chargerCampApi();
  assert.equal(camp.DEMOLITION_BASE_DURATION_SECONDS, 600);
  assert.equal(camp.dureeDemolitionObstacle({ cells: [{}] }), 600);
  assert.equal(camp.dureeDemolitionObstacle({ cells: [{}, {}] }), 1200);
  assert.equal(camp.dureeDemolitionObstacle({ cells: [{}, {}, {}, {}] }), 4800);
  assert.equal(camp.dureeDemolitionObstacle(null), 0);
});

test('Camp prototype uses pointer controls and separate debug-only persistence', function() {
  assert.match(gameSource, /const CAMP_PROTOTYPE_STORAGE_KEY = "catIncCampPrototypeLayoutV2"/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_LEGACY_STORAGE_KEY = "catIncCampPrototypeLayoutV1"/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_TERRAIN_STORAGE_KEY = "catIncCampPrototypeTerrainV4"/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_DEMOLITIONS_STORAGE_KEY = "catIncCampPrototypeDemolitionsV1"/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_TERRAIN_LEGACY_STORAGE_KEYS = \[[\s\S]*?catIncCampPrototypeTerrainV3[\s\S]*?catIncCampPrototypeTerrainV2[\s\S]*?catIncCampPrototypeTerrainV1/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_ZOOM_STORAGE_KEY = "catIncCampPrototypeZoomV1"/);
  assert.match(gameSource, /localStorage\.setItem\(CAMP_PROTOTYPE_STORAGE_KEY, JSON\.stringify\(campPrototypeLayout\)\)/);
  assert.match(gameSource, /localStorage\.setItem\(CAMP_PROTOTYPE_TERRAIN_STORAGE_KEY, JSON\.stringify\(campPrototypeTerrain\)\)/);
  assert.match(gameSource, /pointerdown[\s\S]*?pointermove[\s\S]*?pointerup[\s\S]*?pointercancel/);
  assert.match(gameSource, /mode: effacer \? "erase-road" : "paint-road"/);
  assert.match(gameSource, /campPrototypeApi\.cellulesLigne/);
  assert.match(gameSource, /campPrototypeApi\.connexionsRoute/);
  assert.match(gameSource, /function gererClavierCampPrototype\(event\)[\s\S]*?ArrowLeft[\s\S]*?ArrowRight[\s\S]*?ArrowUp[\s\S]*?ArrowDown/);
  assert.match(cssSource, /\.camp-prototype-board\s*\{[\s\S]*?aspect-ratio:\s*3\s*\/\s*2/);
  assert.match(cssSource, /\.camp-prototype-grid\s*\{[\s\S]*?inset:\s*33\.333333% 0 0[\s\S]*?background-size:\s*5\.555556% 12\.5%/);
});

test('Camp uses optimized building sprites with rotatable footprints', function() {
  assert.match(campSource, /cardboardBox:[\s\S]*?width:\s*2[\s\S]*?height:\s*1[\s\S]*?Cardboard%20Box_Camp_TopDown_Watercolor_Game_v2\.png/);
  assert.match(campSource, /jobCenter:[\s\S]*?width:\s*3[\s\S]*?height:\s*4[\s\S]*?Job%20Center_Camp_TopDown_Watercolor_Game_v2\.png/);
  assert.match(campSource, /sawmill:[\s\S]*?width:\s*3[\s\S]*?height:\s*2[\s\S]*?Sawmill_Camp_TopDown_Watercolor_Game_v2\.png/);
  assert.match(campSource, /catchen:[\s\S]*?width:\s*3[\s\S]*?height:\s*3[\s\S]*?Catchen_Camp_TopDown_Watercolor_Game_v3\.png/);
  assert.match(campSource, /pawsonry:[\s\S]*?width:\s*3[\s\S]*?height:\s*3[\s\S]*?Pawsonry_Camp_TopDown_Watercolor_Game_v3\.png/);
  assert.match(campSource, /trainingCenter:[\s\S]*?width:\s*3[\s\S]*?height:\s*4[\s\S]*?Training%20Center_Camp_TopDown_Watercolor_Game_v1\.png/);
  assert.match(campSource, /tree:[\s\S]*?width:\s*2[\s\S]*?height:\s*2[\s\S]*?Tree_Camp_TopDown_Watercolor_Game_v1\.png/);
  assert.match(campSource, /road:[\s\S]*?label:\s*"Basic Trail"[\s\S]*?Basic%20Trail_Camp_TopDown_Watercolor_Game_v1\.png/);
  [
    'Cardboard Box_Camp_TopDown_Watercolor_Game_v2.png',
    'Job Center_Camp_TopDown_Watercolor_Game_v2.png',
    'Sawmill_Camp_TopDown_Watercolor_Game_v2.png',
    'Catchen_Camp_TopDown_Watercolor_Game_v3.png',
    'Pawsonry_Camp_TopDown_Watercolor_Game_v3.png',
    'Training Center_Camp_TopDown_Watercolor_Game_v1.png',
    'Tree_Camp_TopDown_Watercolor_Game_v1.png'
  ].forEach(function(filename) {
    assert.equal(fs.existsSync(path.join(
      root,
      'img',
      'Buildings',
      'Camp Prototypes',
      filename
    )), true);
  });
  assert.equal(fs.existsSync(path.join(
    root,
    'img',
    'Maps',
    'Camp Prototypes',
    'Basic Trail_Camp_TopDown_Watercolor_Game_v1.png'
  )), true);
  [
    'Green Bush_Camp_Obstacle_Watercolor_Game_v1.png',
    'Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png',
    'Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png',
    'Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png',
    'Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png',
    'Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png'
  ].forEach(function(filename) {
    assert.equal(fs.existsSync(path.join(
      root,
      'img',
      'Maps',
      'Camp Prototypes',
      'Obstacles',
      filename
    )), true);
  });
  assert.match(cssSource, /\.camp-prototype-road-center,[\s\S]*?Basic Trail_Camp_TopDown_Watercolor_Game_v1\.png/);
  assert.match(cssSource, /\.camp-prototype-road-center\s*\{[\s\S]*?left:\s*9%[\s\S]*?width:\s*82%[\s\S]*?height:\s*82%[\s\S]*?clip-path:\s*polygon/);
  assert.match(cssSource, /\.camp-prototype-road-segment-north,[\s\S]*?width:\s*82%[\s\S]*?height:\s*55%[\s\S]*?clip-path:\s*polygon/);
  assert.match(cssSource, /\.camp-prototype-road-segment-east,[\s\S]*?width:\s*55%[\s\S]*?height:\s*82%[\s\S]*?clip-path:\s*polygon/);
  assert.match(cssSource, /\.camp-prototype-road-center,[\s\S]*?background-size:\s*170% 170%/);
  assert.match(campSource, /const LEGACY_TYPE_ALIASES[\s\S]*?kitchen:\s*"catchen"/);
  assert.match(htmlSource, /id="camp-prototype-rotate"[\s\S]*?tournerSelectionCampPrototype\(\)/);
  assert.match(gameSource, /function tournerSelectionCampPrototype\(\)[\s\S]*?placement\.rotation = campPrototypeApi\.normaliserRotation[\s\S]*?actualiserValiditePlacementCampPrototype\(\)[\s\S]*?return true/);
  assert.match(gameSource, /function assetCampPrototypePourRotation\(type, rotation\)[\s\S]*?_r" \+ rotationNormalisee[\s\S]*?function remplirItemCampPrototype\([\s\S]*?image\.src = assetCampPrototypePourRotation\(type, dimensions\.rotation\)[\s\S]*?image\.style\.transform = "translate\(-50%, -50%\)"/);
  assert.doesNotMatch(gameSource, /image\.style\.transform = [^\n]*rotate\(/);
  assert.match(gameSource, /function prechargerRotationSuivanteCampPrototype\(type, rotation\)[\s\S]*?new Image\(\)[\s\S]*?campPrototypeAssetsRotationPrecharges\.set/);
  assert.match(gameSource, /function commencerPlacementExistantCampPrototype\([\s\S]*?prechargerRotationSuivanteCampPrototype\([\s\S]*?function commencerNouveauPlacementCampPrototype\([\s\S]*?prechargerRotationSuivanteCampPrototype\(type, 0\)/);
  assert.match(gameSource, /function tournerSelectionCampPrototype\(\)[\s\S]*?prechargerRotationSuivanteCampPrototype\(type, placement\.rotation\)/);
  assert.match(cssSource, /\.camp-prototype-building-sprite\s*\{[\s\S]*?object-fit:\s*contain[\s\S]*?pointer-events:\s*none/);
  const camp = chargerCampApi();
  Object.values(camp.ITEM_TYPES).filter(function(type) {
    return type.rotatable && type.asset;
  }).forEach(function(type) {
    const assetPath = decodeURIComponent(type.asset.split("?")[0]);
    const extension = path.extname(assetPath);
    const base = assetPath.slice(0, -extension.length);
    const basePng = fs.readFileSync(path.join(root, assetPath));
    const baseWidth = basePng.readUInt32BE(16);
    const baseHeight = basePng.readUInt32BE(20);
    [90, 180, 270].forEach(function(rotation) {
      const variantPath = path.join(root, base + "_r" + rotation + extension);
      assert.equal(fs.existsSync(variantPath), true,
        type.label + " must provide a native " + rotation + " degree sprite");
      const variantPng = fs.readFileSync(variantPath);
      assert.equal(variantPng.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(
        variantPng.readUInt32BE(16),
        rotation === 90 || rotation === 270 ? baseHeight : baseWidth
      );
      assert.equal(
        variantPng.readUInt32BE(20),
        rotation === 90 || rotation === 270 ? baseWidth : baseHeight
      );
    });
  });
});

test('Camp layout editing is isolated in a full-screen mode with category menus', function() {
  assert.match(htmlSource, /id="camp-prototype-edit-open"[\s\S]*?entrerEditionCampPrototype\(\)/);
  assert.match(htmlSource, /id="camp-prototype-edit-done"[\s\S]*?quitterEditionCampPrototype\(\)/);
  assert.equal((htmlSource.match(/data-camp-category="(?:building|decoration|road|junk|terrain)"/g) || []).length, 5);
  assert.match(htmlSource, /data-camp-category="junk"[\s\S]*?camp-prototype-category-icon-junk[\s\S]*?<span>Junk<\/span>/);
  assert.match(htmlSource, /id="camp-prototype-category-sheet"[^>]*hidden/);
  assert.match(htmlSource, /id="camp-prototype-ghost"[\s\S]*?id="camp-prototype-placement-actions"[^>]*hidden[\s\S]*?id="camp-prototype-rotate"[^>]*tournerSelectionCampPrototype\(\)[\s\S]*?Rotate_Final\.png[\s\S]*?id="camp-prototype-placement-confirm"[^>]*validerPlacementCampPrototype\(\)[\s\S]*?✅_Final\.png[\s\S]*?id="camp-prototype-placement-cancel"[^>]*annulerPlacementCampPrototype\(\)[\s\S]*?Red Cross_Final\.png/);
  assert.match(gameSource, /let campPrototypeModeEdition = false/);
  assert.match(gameSource, /let campPrototypePlacementEnCours = null/);
  assert.match(gameSource, /function entrerEditionCampPrototype\(\)[\s\S]*?campPrototypeModeEdition = true[\s\S]*?renduCampPrototype\(\)/);
  assert.match(gameSource, /function quitterEditionCampPrototype\(restaurerFocus\)[\s\S]*?campPrototypeModeEdition = false[\s\S]*?campPrototypeTypeAPlacer = null[\s\S]*?campPrototypeGommeRoutes = false/);
  assert.match(gameSource, /function demarrerInteractionCampPrototype\(event\)\s*\{\s*if \(!DEV_MODE \|\| !campPrototypeModeEdition/);
  assert.match(gameSource, /function ouvrirCategorieCampPrototype\(categorie\)[\s\S]*?\["building", "decoration", "road", "junk", "terrain"\]/);
  assert.match(gameSource, /const labels = \{[\s\S]*?junk:\s*"Junk"/);
  assert.match(cssSource, /\.camp-prototype-category-icon-junk::before[\s\S]*?\.camp-prototype-category-icon-junk::after/);
  assert.match(gameSource, /function validerPlacementCampPrototype\(\)[\s\S]*?actualiserValiditePlacementCampPrototype\(\)[\s\S]*?if \(!type \|\| !resultat\.valide\)[\s\S]*?item\.x = placement\.x[\s\S]*?campPrototypeLayout\.push\(item\)[\s\S]*?sauvegarderCampPrototype\(\)/);
  assert.match(gameSource, /function annulerPlacementCampPrototype\(\)[\s\S]*?campPrototypePlacementEnCours = null[\s\S]*?returned to its original position/);
  assert.match(gameSource, /function placerItemCampPrototype\(typeId, x, y, rotation\)[\s\S]*?definirPositionPlacementCampPrototype\(typeId, x, y, rotation, null\)/);
  assert.match(gameSource, /function deplacerItemCampPrototype\(uid, x, y\)[\s\S]*?definirPositionPlacementCampPrototype\([\s\S]*?uid/);
  assert.match(cssSource, /\.camp-prototype-placement-actions\[hidden\]\s*\{[\s\S]*?display:\s*none !important/);
  assert.match(cssSource, /\.camp-prototype-placement-actions\s*\{[\s\S]*?position:\s*absolute[\s\S]*?left:\s*clamp\([\s\S]*?z-index:\s*8[\s\S]*?transform:\s*translate\(-50%, calc\(-100% - 8px\)\)[\s\S]*?pointer-events:\s*auto/);
  assert.match(cssSource, /\.camp-prototype-placement-action img\s*\{[\s\S]*?width:\s*29px[\s\S]*?pointer-events:\s*none/);
  assert.match(cssSource, /\.camp-prototype-item-placement-valid\s*\{[\s\S]*?rgba\(47, 138, 80/);
  assert.match(cssSource, /\.camp-prototype-item-placement-invalid\s*\{[\s\S]*?rgba\(185, 70, 57/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-placement-confirm\s*\{[\s\S]*?background:\s*#f7fff3/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-placement-cancel\s*\{[\s\S]*?background:\s*#fff7f3/);
  assert.match(gameSource, /function positionnerActionsPlacementCampPrototype\(typeId, x, y, rotation\)[\s\S]*?--camp-placement-center-x[\s\S]*?--camp-placement-top/);
  assert.match(gameSource, /function afficherApercuCampPrototype\([\s\S]*?positionnerActionsPlacementCampPrototype\(typeId, x, y, rotation\)/);
  assert.match(gameSource, /actionsPlacement\.addEventListener\("pointerdown"[\s\S]*?event\.stopPropagation\(\)[\s\S]*?actionsPlacement\.addEventListener\("click"/);
  assert.match(gameSource, /Its gameplay interaction will be connected later/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE = Object\.freeze\(\{[\s\S]*?sawmill:\s*"wood"[\s\S]*?catchen:\s*"food"[\s\S]*?pawsonry:\s*"rock"/);
  assert.match(htmlSource, /id="camp-prototype-interaction-menu"[^>]*role="menu"[^>]*hidden/);
  assert.match(gameSource, /menu\.innerHTML = '<button[\s\S]*?data-camp-menu-action="work"/);
  assert.match(gameSource, /function ouvrirMenuInteractionCampPrototype\(uid\)[\s\S]*?menu\.style\.left[\s\S]*?menu\.style\.top[\s\S]*?menu\.dataset\.workFamily/);
  assert.match(gameSource, /function ouvrirWorkDepuisCamp\(event\)[\s\S]*?changerOnglet\("work"\)[\s\S]*?appliquerFiltreWork\(famille\)/);
  assert.match(gameSource, /if \(type && CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE\[type\.id\]\)[\s\S]*?ouvrirMenuInteractionCampPrototype\(item\.uid\)/);
  assert.match(gameSource, /bouton\.setAttribute\("aria-haspopup", "menu"\)[\s\S]*?bouton\.setAttribute\("aria-controls", "camp-prototype-interaction-menu"\)/);
  assert.match(cssSource, /\.camp-prototype-interaction-menu\s*\{[\s\S]*?z-index:\s*7[\s\S]*?transform:\s*translate\(-50%, calc\(-100% - 7px\)\)/);
  assert.match(cssSource, /\.camp-prototype-interaction-menu button\s*\{[\s\S]*?width:\s*46px[\s\S]*?color:\s*#27834f[\s\S]*?border:\s*3px solid #27834f[\s\S]*?border-radius:\s*50%/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-panel\s*\{[\s\S]*?position:\s*fixed[\s\S]*?inset:\s*0[\s\S]*?height:\s*100dvh/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-edit-dock\s*\{[\s\S]*?position:\s*absolute[\s\S]*?bottom:/);
  assert.match(cssSource, /\.camp-prototype-edit-dock > button\s*\{[\s\S]*?width:\s*70px[\s\S]*?height:\s*70px[\s\S]*?border-radius:\s*50%/);
});

test('Camp floating actions activate on the first touch across the complete popup', function() {
  assert.match(gameSource, /data-camp-menu-action="work"/);
  assert.match(gameSource, /data-camp-menu-action="demolition"/);
  assert.match(gameSource, /function gererPointeurActionMenuCampPrototype\(event\)[\s\S]*?event\.pointerType !== "touch"[\s\S]*?executerActionMenuCampPrototype\(action, event\)/);
  assert.match(gameSource, /function gererClicActionMenuCampPrototype\(event\)[\s\S]*?campPrototypeDerniereActivationTactile < 700/);
  assert.match(gameSource, /menuInteraction\.addEventListener\("pointerup", gererPointeurActionMenuCampPrototype\)[\s\S]*?menuInteraction\.addEventListener\("click", gererClicActionMenuCampPrototype\)/);
  assert.match(cssSource, /\.camp-prototype-interaction-menu\s*\{[\s\S]*?pointer-events:\s*auto[\s\S]*?touch-action:\s*manipulation/);
  assert.match(cssSource, /\.camp-prototype-interaction-menu::after\s*\{[\s\S]*?pointer-events:\s*none/);
});

test('Camp grid is visible only while editing', function() {
  assert.match(cssSource, /body:not\(\.camp-prototype-editing\) \.camp-prototype-grid,\s*body:not\(\.camp-prototype-editing\) \.camp-prototype-terrain-cleared\s*\{[\s\S]*?opacity:\s*0/);
  assert.match(cssSource, /\.camp-prototype-grid\s*\{[\s\S]*?background-image:[\s\S]*?linear-gradient\(to right[\s\S]*?linear-gradient\(to bottom/);
  assert.match(cssSource, /\.camp-prototype-terrain-cleared\s*\{[\s\S]*?border:\s*1px solid[\s\S]*?background:/);
  assert.doesNotMatch(cssSource, /body\.camp-prototype-editing \.camp-prototype-grid\s*\{[\s\S]*?opacity:\s*0/);
  assert.doesNotMatch(cssSource, /body\.camp-prototype-editing \.camp-prototype-terrain-cleared\s*\{[\s\S]*?opacity:\s*0/);
});

test('Camp normal view chains vertical touch scrolling while containing horizontal camera movement', function() {
  assert.match(cssSource, /\.camp-prototype-viewport\s*\{[\s\S]*?overflow:\s*auto[\s\S]*?overscroll-behavior-x:\s*contain[\s\S]*?overscroll-behavior-y:\s*auto[\s\S]*?touch-action:\s*pan-x pan-y/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-viewport\s*\{[\s\S]*?overscroll-behavior:\s*contain/);
});

test('Camp Edit keeps full active simulation and only real app suspension enables AFK', function() {
  const tickCode = gameSource.slice(
    gameSource.indexOf('function tick() {'),
    gameSource.indexOf('setInterval(tick, 100);')
  );
  const editCode = gameSource.slice(
    gameSource.indexOf('function entrerEditionCampPrototype() {'),
    gameSource.indexOf('function quitterEditionCampPrototype(')
  );
  assert.doesNotMatch(tickCode, /campPrototypeModeEdition/);
  assert.doesNotMatch(editCode, /(?:Afk|AFK|HorsLigne|Suspension)/);
  assert.match(gameSource, /function rattraperApresSuspensionAfk\(\)[\s\S]*?!suspensionAfkConfirmee[\s\S]*?return null/);
  assert.match(gameSource, /visibilitychange[\s\S]*?visibilityState === "hidden"[\s\S]*?marquerSuspensionAfk\(\)[\s\S]*?visibilityState === "visible"[\s\S]*?rattraperApresSuspensionAfk\(\)/);
});

test('Camp edit navigation keeps vertical scrolling and requires a long press to select items', function() {
  assert.match(gameSource, /const CAMP_PROTOTYPE_LONG_PRESS_MS = 450/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_LONG_PRESS_MOVE_TOLERANCE = 8/);
  assert.match(gameSource, /mode: "hold-select"[\s\S]*?setTimeout\(function\(\)[\s\S]*?selectionnerItemParAppuiProlongeCampPrototype\(item\.uid\)[\s\S]*?CAMP_PROTOTYPE_LONG_PRESS_MS/);
  assert.match(gameSource, /function selectionnerItemParAppuiProlongeCampPrototype\(uid\)[\s\S]*?commencerPlacementExistantCampPrototype\(item\)[\s\S]*?interaction\.mode = "hold-selected"[\s\S]*?confirm or cancel the placement/);
  assert.match(gameSource, /campPrototypePointeur\.mode === "hold-select"[\s\S]*?Math\.hypot[\s\S]*?CAMP_PROTOTYPE_LONG_PRESS_MOVE_TOLERANCE[\s\S]*?annulerAppuiProlongeCampPrototype\(\)/);
  assert.match(gameSource, /if \(item\.uid !== campPrototypeSelectionUid\)[\s\S]*?mode: "hold-select"[\s\S]*?return;[\s\S]*?campPrototypeSelectionUid = item\.uid/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-item:not\(\.camp-prototype-item-selected\)\s*\{\s*touch-action:\s*pan-x pan-y/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-board\.camp-prototype-tool-continuous[\s\S]*?touch-action:\s*none/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-board\s*\{[\s\S]*?touch-action:\s*pan-x pan-y/);
  assert.match(cssSource, /@media \(max-width: 768px\)[\s\S]*?body\.camp-prototype-editing \.camp-prototype-board\s*\{[\s\S]*?width:\s*100%/);
});

test('Camp camera zoom and terrain interactions stay renderer-independent and mobile-safe', function() {
  assert.match(htmlSource, /id="camp-prototype-title">Base Camp<\/h2>[\s\S]*?aria-label="Explain Base Camp"[\s\S]*?id="base-camp-help"/);
  assert.match(htmlSource, /id="base-camp-help"[\s\S]*?Tap a camp element to interact with it[\s\S]*?Natural clearing debris cannot be moved[\s\S]*?Junk menu/);
  assert.doesNotMatch(htmlSource, /class="camp-prototype-(?:view|edit)-copy"/);
  assert.match(htmlSource, /id="camp-prototype-status"[^>]*><\/p>/);
  assert.match(cssSource, /\.camp-prototype-status:empty\s*\{\s*display:\s*none/);
  assert.match(htmlSource, /id="camp-prototype-zoom-out"[\s\S]*?ajusterZoomCampPrototype\(-0\.25\)/);
  assert.match(htmlSource, /id="camp-prototype-zoom-value"[\s\S]*?definirZoomCampPrototype\(1\)/);
  assert.match(htmlSource, /id="camp-prototype-zoom-in"[\s\S]*?ajusterZoomCampPrototype\(0\.25\)/);
  assert.equal((htmlSource.match(/Camp_(?:Red|Blue|Green)_House_Rear_Watercolor_HighAngle_v3\.webp/g) || []).length, 3);
  assert.equal((htmlSource.match(/class="camp-prototype-shrub camp-prototype-shrub-(?:left|right)"/g) || []).length, 6);
  assert.equal((htmlSource.match(/Camp_Garden_Fence_Upright_Prototype_v2\.webp/g) || []).length, 2);
  assert.match(htmlSource, /camp-prototype-fence-west[^>]*data-camp-boundary-zone="redGarden"/);
  assert.match(htmlSource, /camp-prototype-fence-east[^>]*data-camp-boundary-zone="greenGarden"/);
  assert.match(htmlSource, /id="camp-prototype-territory-zones"[\s\S]*?id="camp-prototype-terrain"/);
  assert.match(htmlSource, /id="camp-prototype-items"[\s\S]*?class="camp-prototype-fences"[\s\S]*?id="camp-prototype-ghost"/);
  assert.match(gameSource, /const CAMP_PROTOTYPE_ZOOM_MIN = 0\.75[\s\S]*?const CAMP_PROTOTYPE_ZOOM_MAX = 2\.5/);
  assert.match(gameSource, /function appliquerZoomCampPrototype\(conserverCentre, ancrageClient\)[\s\S]*?ancienScrollLeft[\s\S]*?dataset\.campBaseWidth[\s\S]*?viewport\.scrollLeft[\s\S]*?viewport\.scrollTop/);
  assert.match(gameSource, /function demarrerPincementCampPrototype\(event\)[\s\S]*?event\.touches\.length !== 2[\s\S]*?distanceInitiale/);
  assert.match(gameSource, /function deplacerPincementCampPrototype\(event\)[\s\S]*?zoomInitial[\s\S]*?centrePincementCampPrototype\(event\.touches\)/);
  assert.match(gameSource, /viewport\.addEventListener\("touchstart", demarrerPincementCampPrototype, \{ passive: false \}\)[\s\S]*?viewport\.addEventListener\("touchmove", deplacerPincementCampPrototype, \{ passive: false \}\)/);
  assert.match(gameSource, /window\.addEventListener\("resize"[\s\S]*?invaliderLargeurBaseCampPrototype\(\)[\s\S]*?appliquerZoomCampPrototype\(false\)/);
  assert.match(gameSource, /function rendreTerrainCampPrototype\(\)[\s\S]*?TERRITORY_ZONES[\s\S]*?obstaclesTerrain[\s\S]*?camp-prototype-obstacle-sprite/);
  assert.match(gameSource, /function actualiserCloturesCampPrototype\(zonesConquises\)[\s\S]*?data-camp-boundary-zone[\s\S]*?cloture\.hidden = zones\.has/);
  assert.match(gameSource, /function rendreTerrainCampPrototype\(\)[\s\S]*?actualiserCloturesCampPrototype\(zonesConquises\)/);
  assert.doesNotMatch(gameSource, /Clear obstacles/);
  assert.doesNotMatch(gameSource, /function debroussaillerCelluleCampPrototype/);
  assert.match(gameSource, /if \(campPrototypeModeEdition\)[\s\S]*?Debris cannot be changed in Edit mode/);
  assert.match(gameSource, /function conquerirZoneCampPrototype\(zoneId\)[\s\S]*?conquerirZoneTerrain/);
  assert.match(cssSource, /\.camp-prototype-viewport\s*\{[\s\S]*?overflow:\s*auto[\s\S]*?touch-action:\s*pan-x pan-y/);
  assert.match(cssSource, /\.camp-prototype-board\s*\{[\s\S]*?touch-action:\s*pan-x pan-y/);
  assert.match(cssSource, /\.camp-prototype-houses\s*\{[\s\S]*?height:\s*33\.333333%/);
  assert.match(cssSource, /\.camp-prototype-house\s*\{[\s\S]*?transform:\s*scale\(1\.04\)[\s\S]*?transform-origin:\s*center bottom/);
  assert.match(cssSource, /\.camp-prototype-shrub\s*\{[\s\S]*?Camp_Garden_Shrub_Watercolor_HighAngle_v2\.webp/);
  assert.match(cssSource, /\.camp-prototype-shrub-left\s*\{\s*left:\s*8%/);
  assert.match(cssSource, /\.camp-prototype-shrub-right\s*\{\s*right:\s*8%/);
  assert.match(cssSource, /\.camp-prototype-gardens\s*\{[\s\S]*?Camp_Grass_Texture_Prototype_v1\.webp/);
  assert.match(cssSource, /\.camp-prototype-items\s*\{[\s\S]*?z-index:\s*4/);
  assert.match(cssSource, /\.camp-prototype-ghost\s*\{[\s\S]*?z-index:\s*5/);
  assert.match(cssSource, /\.camp-prototype-fences\s*\{[\s\S]*?z-index:\s*6[\s\S]*?pointer-events:\s*none/);
  assert.match(cssSource, /\.camp-prototype-fence\[hidden\]\s*\{\s*display:\s*none/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-viewport\s*\{[\s\S]*?position:\s*relative[\s\S]*?z-index:\s*1[\s\S]*?isolation:\s*isolate/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-category-sheet\s*\{[\s\S]*?z-index:\s*4/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-edit-dock\s*\{[\s\S]*?z-index:\s*5/);
});

test('Camp debris demolition is persistent, timed and globally occupies one Cat', function() {
  assert.match(htmlSource, /id="camp-demolition-modal"[\s\S]*?id="camp-demolition-modal-kitties"/);
  assert.match(gameSource, /function ouvrirMenuDemolitionCampPrototype\(obstacleUid\)[\s\S]*?ouvrirModalDemolitionCamp/);
  assert.match(gameSource, /function selectionnerKittyDemolitionCamp\(kittyIndex\)[\s\S]*?kittyIsBusy\(kittyIndex\)[\s\S]*?dureeDemolitionObstacle[\s\S]*?startTs:\s*Date\.now\(\)/);
  assert.match(gameSource, /function terminerDemolitionsCampPrototype\(maintenant\)[\s\S]*?debroussaillerTerrain[\s\S]*?sauvegarderCampPrototype\(\)/);
  assert.match(gameSource, /function kittyIsBusy\(kittyIdx\)[\s\S]*?kittyIsDemolishingCamp\(kittyIdx\)/);
  assert.match(gameSource, /function kittyHasNonReplaceableAction\(kittyIdx\)[\s\S]*?kittyIsDemolishingCamp\(kittyIdx\)/);
  assert.match(gameSource, /function kittyAllocationLabel\(kittyIdx\)[\s\S]*?Demolition: Camp/);
  assert.match(gameSource, /function normaliserOccupationsChatons\(\)[\s\S]*?normaliserDemolitionsCampPrototype\(claim\)/);
  assert.match(gameSource, /function renduCampPrototypeDynamique\(maintenant\)[\s\S]*?data-camp-demolition-timer/);
  assert.match(gameSource, /function tick\(\)[\s\S]*?terminerDemolitionsCampPrototype\(maintenant\)/);
  assert.match(cssSource, /body\.camp-prototype-editing \.camp-prototype-obstacle\s*\{\s*pointer-events:\s*none/);
});
