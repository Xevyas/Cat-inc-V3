const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const gameSource = fs.readFileSync(path.join(root, 'jeu.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const htmlSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const contentSource = fs.readFileSync(path.join(root, 'js', 'data', 'content.js'), 'utf8');
const configSource = fs.readFileSync(path.join(root, 'js', 'data', 'config.js'), 'utf8');
const audioSource = fs.readFileSync(path.join(root, 'js', 'ui', 'audio.js'), 'utf8');
const stateSource = fs.readFileSync(path.join(root, 'js', 'core', 'state.js'), 'utf8');
const saveSource = fs.readFileSync(path.join(root, 'js', 'core', 'save.js'), 'utf8');

function extraire(debut, fin) {
  const start = gameSource.indexOf(debut);
  const end = gameSource.indexOf(fin, start);
  assert.notEqual(start, -1, 'start marker should exist: ' + debut);
  assert.notEqual(end, -1, 'end marker should exist: ' + fin);
  return gameSource.slice(start, end);
}

test('simple resource managers expose the six-node sphere and stacked bonuses', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const grids = context.CatInc.data.content.SPHERE_GRIDS;
  const expected = { lumberjack: 'Wood', farmer: 'Food', miner: 'Rock' };
  Object.keys(expected).forEach(function(job) {
    assert.ok(grids[job], job + ' should have a sphere grid');
    assert.equal(grids[job].spheres.length, 6);
    assert.equal(Array.from(grids[job].spheres, function(s) { return s.nom; }).join('|'), 'PROD BOOST II|PROD BOOST I|PROD SPEED|SPEED BOOST I|SPEED BOOST II|NEW SLOT');
    assert.equal(grids[job].spheres[2].etat, 'learned');
    assert.equal(grids[job].spheres[0].etat, 'locked');
    assert.equal(grids[job].spheres[3].etat, 'unlocked');
    assert.equal(grids[job].spheres[4].etat, 'locked');
    assert.equal(grids[job].spheres[0].cout.cannedCatFood, 2);
    assert.equal(grids[job].spheres[1].cout.cannedCatFood, 1);
    assert.equal(grids[job].spheres[3].cout.cannedCatFood, 1);
    assert.equal(grids[job].spheres[4].cout.cannedCatFood, 2);
    assert.equal(grids[job].spheres[5].cout.cannedCatFood, 3);
    assert.match(grids[job].spheres[5].desc, /Adds one recipe slot to the/);
    assert.match(grids[job].spheres[1].desc, new RegExp('"' + expected[job] + '".*25%'));
    assert.match(grids[job].spheres[0].desc, /additional 25% \(total 50%\)/);
    assert.match(grids[job].spheres[3].desc, new RegExp('"' + expected[job] + '".*25%'));
    assert.match(grids[job].spheres[4].desc, /additional 25% \(total 50%\)/);
  });
  assert.match(gameSource, /MANAGER_SPHERE_PERKS[\s\S]*?managerSpeedMultiplier/);
  assert.match(gameSource, /function multiplicateurProductionFamille/);
  assert.match(gameSource, /gatheringProduction: multiplicateurProductionFamille\(pair\.rawAction\)/);
  assert.match(gameSource, /const GATHER_LEVEL_MULTIPLIER = 1\.05/);
  assert.match(gameSource, /basicProduction: kitty \? Math\.pow\(GATHER_LEVEL_MULTIPLIER, kitty\.niveau\) : 1/);
  assert.match(gameSource, /productionProcBonus\(k\)/);
});

test('Gang Leader sphere exposes the complete Food, Recruit, Manual and Exploration branches', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const grid = context.CatInc.data.content.SPHERE_GRIDS['gang-leader'];
  const names = Array.from(grid.spheres, function(s) { return s.nom; });
  assert.equal(names.join('|'), 'GLOBAL SPEED|QOL EXP|DAILY BOOST I|DAILY BOOST II|RECRUIT SPEED I|RECRUIT SPEED II|MANUAL BOOST|BOOST POWER|CAPACITY|CLICK POWER|EXPLORATOR|EXPLO HALVES|CHANCE DOUBLE I|EXPLO POWER|CAT FOOD I');
  const costs = {
    'gl-qol': 1, 'gl-daily-1': 3, 'gl-daily-2': 5,
    'gl-rec': 1, 'gl-rec-2': 2,
    'gl-mini': 2, 'gl-manual-power': 4, 'gl-manual-capacity': 2, 'gl-manual-click': 2,
    'gl-explo': 2, 'gl-explo-halves': 3, 'gl-explo-luck': 2,
    'gl-explo-power': 3, 'gl-explo-catfood': 2
  };
  Object.keys(costs).forEach(function(id) {
    assert.equal(grid.spheres.find(function(s) { return s.id === id; }).cout.cannedCatFood, costs[id], id);
  });
  const exploChildren = Array.from(grid.connections)
    .filter(function(conn) { return conn[0] === 'gl-explo'; })
    .map(function(conn) { return conn[1]; })
    .sort();
  assert.equal(exploChildren.join('|'), 'gl-explo-catfood|gl-explo-halves|gl-explo-luck|gl-explo-power');
  assert.match(gameSource, /function gangLeaderRecruitMultiplier\(\)[\s\S]*?1 \+ \(fullBonus - 1\) \/ 2/);
  assert.match(gameSource, /function recompenseQuetesQuotidiennes\(\)[\s\S]*?gl-daily-2[\s\S]*?return 3[\s\S]*?gl-daily-1[\s\S]*?2 : 1/);
  assert.match(gameSource, /function manualFocusMultiplier\(\)[\s\S]*?gl-manual-power[\s\S]*?\? 4 : 3/);
  assert.match(gameSource, /function manualFocusMaxSeconds\(\)[\s\S]*?gl-manual-capacity[\s\S]*?\? 60/);
  assert.match(gameSource, /function manualFocusSecondsPerClick\(\)[\s\S]*?gl-manual-click[\s\S]*?\? 2/);
  assert.match(gameSource, /function scoutingHalveTime\(kittyIndex\)[\s\S]*?gl-explo-halves/);
  assert.match(gameSource, /function gangLeaderExplorationPowerMultiplier\(kittyIndex\)[\s\S]*?gl-explo-power[\s\S]*?1\.5/);
  assert.match(gameSource, /function scoutingCatFoodMultiplier\(kittyIndex\)[\s\S]*?gl-explo-catfood[\s\S]*?1\.5/);
  assert.match(gameSource, /function scoutingDoubleChance\(kittyIndex\)[\s\S]*?gl-explo-luck[\s\S]*?0\.15/);
  assert.doesNotMatch(gameSource, /var miniPerk = [^\n]*gl-mini/);
});

test('Explorator sphere exposes two-tier food, stock, multiplier and power branches', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const grid = context.CatInc.data.content.SPHERE_GRIDS.explorator;
  const spheres = grid.spheres;
  assert.equal(spheres.length, 12);
  assert.equal(Array.from(spheres, function(s) { return s.nom; }).join('|'), 'EXPLO HALVES|QOL EXPLO|CAT FOOD I|CAT FOOD II|LUCKY FOOD I|LUCKY FOOD II|CHANCE DOUBLE I|CHANCE DOUBLE II|CHANCE TRIPLE I|CHANCE TRIPLE II|EXPLO POWER I|EXPLO POWER II');
  assert.equal(spheres.find(function(s) { return s.id === 'ex-food'; }).cout.cannedCatFood, 1);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-food-2'; }).cout.cannedCatFood, 2);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-food-lucky'; }).cout.cannedCatFood, 2);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-food-lucky-2'; }).cout.cannedCatFood, 3);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-luck'; }).cout.cannedCatFood, 1);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-luck-2'; }).cout.cannedCatFood, 2);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-triple'; }).cout.cannedCatFood, 3);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-triple-2'; }).cout.cannedCatFood, 4);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-power'; }).cout.cannedCatFood, 1);
  assert.equal(spheres.find(function(s) { return s.id === 'ex-power-2'; }).cout.cannedCatFood, 2);
  assert.match(spheres.find(function(s) { return s.id === 'ex-food-2'; }).desc, /additional 50%.*double the base chance/);
  assert.match(spheres.find(function(s) { return s.id === 'ex-food-lucky-2'; }).desc, /another 15%.*30% total/);
  assert.match(spheres.find(function(s) { return s.id === 'ex-luck-2'; }).desc, /additional 20%.*40% total/);
  assert.match(spheres.find(function(s) { return s.id === 'ex-triple-2'; }).desc, /another 15%.*30% total/);
  assert.match(spheres.find(function(s) { return s.id === 'ex-power'; }).desc, /25%/);
  assert.match(spheres.find(function(s) { return s.id === 'ex-power-2'; }).desc, /additional 25%.*total 50%/);
  assert.deepEqual(Array.from(grid.connections, function(conn) { return Array.from(conn); }), [
    ['ex-c', 'ex-qol'], ['ex-c', 'ex-food'], ['ex-c', 'ex-luck'], ['ex-c', 'ex-power'],
    ['ex-food', 'ex-food-2'],
    ['ex-food', 'ex-food-lucky'], ['ex-food-lucky', 'ex-food-lucky-2'],
    ['ex-luck', 'ex-luck-2'],
    ['ex-luck', 'ex-triple'], ['ex-triple', 'ex-triple-2'],
    ['ex-power', 'ex-power-2']
  ]);
  assert.match(gameSource, /function exploratorCatFoodMultiplier\(kittyIndex\)[\s\S]*?ex-food-2[\s\S]*?1.5/);
  assert.match(gameSource, /function exploratorDoubleChance\(kittyIndex\)[\s\S]*?ex-luck-2[\s\S]*?0.40[\s\S]*?0.20/);
  assert.match(gameSource, /function exploratorTripleChance\(kittyIndex\)[\s\S]*?ex-triple-2[\s\S]*?0\.30[\s\S]*?ex-triple[\s\S]*?0\.15/);
  assert.match(gameSource, /function exploratorLuckyFoodChance\(kittyIndex\)[\s\S]*?ex-food-lucky-2[\s\S]*?0\.30[\s\S]*?ex-food-lucky[\s\S]*?0\.15/);
  assert.match(gameSource, /function exploratorPowerMultiplier\(kittyIndex\)[\s\S]*?ex-power-2[\s\S]*?1\.5[\s\S]*?ex-power[\s\S]*?1\.25/);
  assert.match(gameSource, /function scoutingRewardMultiplier\(kittyIndex\)[\s\S]*?scoutingDoubleChance[\s\S]*?return 1[\s\S]*?scoutingTripleChance[\s\S]*?\? 3 : 2/);
  assert.match(gameSource, /function limiterRecompenseScouting\(scoutingId, recompenseId, qty, kittyIndex\)[\s\S]*?stock\.remaining <= 0[\s\S]*?scoutingLuckyFoodChance\(kittyIndex\)[\s\S]*?return desired/);
  assert.match(gameSource, /butin\.tripled \+= 1/);
  assert.match(gameSource, /scouting-tripled[\s\S]*?Tripled/);
  assert.match(gameSource, /function applyPerkCatFood\(table, kittyIndex\)[\s\S]*?scoutingCatFoodMultiplier/);

  const rewardRolls = [];
  const rewardContext = vm.createContext({
    etat: {
      kittiesData: [{ metier: 'explorator' }],
      spherePerks: { 'ex-luck': 'learned', 'ex-luck-2': 'learned', 'ex-triple': 'learned', 'ex-triple-2': 'learned' }
    },
    Math: { random: function() { return rewardRolls.shift(); } }
  });
  vm.runInContext(extraire('function exploratorCatFoodMultiplier(kittyIndex) {', 'function resoudreRecompenseTable(table) {'), rewardContext);
  rewardRolls.push(0.10, 0.10);
  assert.equal(rewardContext.tryDoubleReward(2, 0), 6);
  rewardRolls.push(0.10, 0.50);
  assert.equal(rewardContext.tryDoubleReward(2, 0), 4);
  rewardRolls.push(0.50);
  assert.equal(rewardContext.tryDoubleReward(2, 0), 2);
});

test('all sphere perk labels use the game typography and uppercase naming', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const grids = context.CatInc.data.content.SPHERE_GRIDS;
  Object.keys(grids).forEach(function(job) {
    grids[job].spheres.forEach(function(sphere) {
      assert.equal(sphere.nom, sphere.nom.toUpperCase(), job + ' perk labels should be uppercase');
    });
  });
  assert.match(gameSource, /w\.toUpperCase\(\)/);
  assert.match(cssSource, /\.sphere-detail-nom\s*\{[\s\S]*?font-family:\s*inherit;/);
  assert.match(cssSource, /\.sphere-detail-desc\s*\{[\s\S]*?font-family:\s*inherit;/);
  assert.match(cssSource, /\.sphere-detail-panel\s*\{[\s\S]*?height:\s*150px;[\s\S]*?max-height:\s*150px;[\s\S]*?overflow-y:\s*auto;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.sphere-detail-panel\s*\{[\s\S]*?height:\s*158px;/);
  assert.doesNotMatch(cssSource, /\.sphere-detail-nom\s*\{[\s\S]*?Courier New/);
});

test('Training Center spheres use the same seamless two-layer fog motion', function() {
  assert.match(gameSource, /const SPHERE_FOG_MOTION_ENABLED = true/);
  assert.match(gameSource, /class="sphere-svg' \+ sphereFogClass[\s\S]*?sphere-fog-primary-track[\s\S]*?Perks fog\.png/);
  assert.match(gameSource, /sphere-fog-secondary-track[\s\S]*?height="650"/);
  assert.match(gameSource, /sphere-fog-seam-softener[\s\S]*?stdDeviation="1\.8 0"/);
  assert.match(cssSource, /\.sphere-fog-secondary-track\s*\{[\s\S]*?opacity:\s*0\.25;[\s\S]*?translateX\(-42%\)/);
  assert.match(cssSource, /\.sphere-svg\.sphere-fog-motion \.sphere-fog-primary-track\s*\{[\s\S]*?carte-fog-global-scroll 90s linear infinite/);
  assert.match(cssSource, /\.sphere-svg\.sphere-fog-motion \.sphere-fog-secondary-track\s*\{[\s\S]*?carte-fog-global-scroll 140s linear infinite/);
  assert.doesNotMatch(cssSource, /background:\s*url\('img\/Maps\/Perks fog\.png'\)/);
});

test('sphere connectors stay visually behind opaque locked perk circles', function() {
  const renderer = extraire('function renduSphereGrid(jobId) {', 'function clickerSphere(sphereId) {');
  assert.ok(renderer.indexOf('// Connections') < renderer.indexOf('// Spheres'));
  assert.match(renderer, /fill = '#e8e8e8'; strokeColor = '#bbbbbb'; textColor = '#a0a0a0'; opacity = 1;/);
  assert.doesNotMatch(renderer, /textColor = '#a0a0a0'; opacity = 0\.6;/);
});

test('learning an adjacent perk cannot downgrade a central learned sphere', function() {
  const resolver = extraire('function sphereEtatEffectif(sphere) {', 'function renduTrainingCenter() {');
  const context = vm.createContext({
    etat: {
      spherePerks: {
        'carpenter-c': 'unlocked',
        'carpenter-cost-2': 'unlocked'
      }
    }
  });
  vm.runInContext(resolver + '\nthis.resolveSphere = sphereEtatEffectif;', context);
  assert.equal(context.resolveSphere({ id: 'carpenter-c', etat: 'learned' }), 'learned');
  assert.equal(context.resolveSphere({ id: 'carpenter-cost-2', etat: 'locked' }), 'unlocked');
  assert.match(gameSource, /var enfant = def\.spheres\.find[\s\S]*?sphereEtatEffectif\(enfant\) === 'locked'[\s\S]*?etat\.spherePerks\[conn\[1\]\] = 'unlocked'/);
  assert.doesNotMatch(gameSource, /conn\[0\] === sphereId && !etat\.spherePerks\[conn\[1\]\]/);
});

test('simple manager perks remain visible in Gang and Work recipe managers', function() {
  assert.match(gameSource, /function managerPerksHtml\(famille, className, hideHouseBuildPerks\)/);
  assert.match(gameSource, /function managerSpeedMultiplier\(kitty, famille\)[\s\S]*?kitty\.managerMult \|\| 1\.5/);
  assert.match(gameSource, /<span class="bonus-var">×1\.5<\/span> production quantity \(perk\)/);
  assert.match(gameSource, /<span class="bonus-var">×1\.5<\/span> manager speed \(perk\)/);
  assert.doesNotMatch(gameSource, /production quantity · PROD BOOST|manager speed · SPEED BOOST/);
  assert.match(gameSource, /managerPerksHtml\(METIERS\[k\.metier\]\.famille, "detail-job-perk"\)/);
  assert.match(gameSource, /managerPerksHtml\(famille, null, famille === "houses"\)/);
  assert.match(gameSource, /spherePerkLearned\(perks\.formula\) && !hideHouseBuildPerks/);
  assert.match(gameSource, /spherePerkLearned\(perks\.auto\) && !hideHouseBuildPerks/);
  assert.match(gameSource, /function renderManagerSlot\(famille\)[\s\S]*?managerPerksHtml\(famille, null, famille === "houses"\)/);
  assert.match(gameSource, /function modificateursRecette\(pair, kitty\)[\s\S]*?gatheringProduction: multiplicateurProductionFamille\(pair\.rawAction\)/);
  assert.match(gameSource, /processingSpeed: multiplicateurFamille\(pair\.procMultAction\)/);
  assert.match(gameSource, /managerSphereStateKey\(famille\)/);
  assert.match(cssSource, /\.detail-job-perk\s*\{[\s\S]*?font-size:\s*0\.8rem[\s\S]*?color:\s*var\(--couleur-texte\)/);
  assert.match(cssSource, /\.manager-perk-txt\s*\{[\s\S]*?color:\s*inherit[\s\S]*?font-size:\s*inherit/);
});

test('chat detail only shows Manager Speed Bonus for cats with a learned job', function() {
  assert.match(gameSource, /const managerSpeedBonusLine = !isEngineer && k\.metier[\s\S]*?Manager Speed Bonus/);
  assert.match(gameSource, /managerSpeedBonusLine \+\s*"<span class='xp-bonus-ligne'>/);
  assert.match(gameSource, /const managerSpeedBonusLine = !isEngineer && k\.metier[\s\S]*?:\s*""/);
  assert.match(gameSource, /const isEngineer = k\.metier === ENGINEER_JOB_ID/);
  assert.match(gameSource, /AFK Timer Bonus by 6 minutes per level/);
});

test('chat experience details explain the per-level bonus multipliers', function() {
  assert.match(gameSource, /id='experience-bonus-help-button'[^>]*aria-controls='experience-bonus-help'/);
  assert.match(gameSource, /Each additional level increases these bonuses:/);
  assert.match(gameSource, /Gather Production Bonus by " \+ gatherLevelPercent \+ "%/);
  assert.match(gameSource, /Process Production Bonus by " \+ processLevelPercent \+ "%/);
  assert.match(gameSource, /Exploration Power by 1/);
  assert.match(gameSource, /Manager Speed Bonus by " \+ managerLevelPercent \+ "%/);
  assert.match(gameSource, /function toggleExperienceHelp\(event\)[\s\S]*?aria-expanded/);
  assert.match(cssSource, /\.detail-help-popover\s*\{[\s\S]*?max-width:\s*calc\(100vw - 48px\)/);
});

test('all cats use the level 100 ceiling and Camp Engineer rank 2 adds half a percentage point', function() {
  assert.match(gameSource, /const MAX_CAT_LEVEL\s*=\s*100/);
  assert.match(gameSource, /2:\s*Object\.freeze\(\{ maxLevel:\s*100, help:\s*"Increase AFK Ratio by 0\.5% per level"[\s\S]*?value:\s*0\.5/);
  assert.match(gameSource, /function niveauMaxChat\(kitty\)[\s\S]*?Math\.min\(MAX_CAT_LEVEL, info\.maxLevel\)[\s\S]*?: MAX_CAT_LEVEL/);
  assert.match(gameSource, /function ratioAfkHorsLigne\(\)[\s\S]*?niveau \* info\.value/);
});

test('cat detail keeps identity and job on the left and hides legacy tier/date fields', function() {
  assert.doesNotMatch(gameSource, /<div class=\\"detail-catch-info\\">\" \+ formaterCatchTime/);
  assert.doesNotMatch(gameSource, /detail-tier-badge\\">T\" \+ tierIdx/);
  assert.match(gameSource, /if \(!k\.metier\)[\s\S]*?detail-stray-cat kitty-vagabond'>STRAY CAT/);
  assert.match(gameSource, /gauche\.innerHTML \+=\s*\n?\s*"<div class='detail-section detail-job-left' id='detail-job'>/);
  assert.match(cssSource, /\.detail-corps\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 1fr\)/);
  assert.match(cssSource, /\.detail-job-left\s*\{[\s\S]*?width:\s*100%/);
  assert.match(cssSource, /\.detail-stray-cat\s*\{[\s\S]*?justify-content:\s*center/);
});

test('complex resource managers expose cost and speed spheres', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const grids = context.CatInc.data.content.SPHERE_GRIDS;
  ['carpenter', 'chef', 'stonemason'].forEach(function(job) {
    assert.ok(grids[job], job + ' should have a sphere grid');
    assert.equal(Array.from(grids[job].spheres, function(s) { return s.nom; }).join('|'), 'REDUCED COST I|REDUCED COST II|PROD SPEED|SPEED BOOST I|SPEED BOOST II|NEW SLOT');
    assert.equal(grids[job].spheres[0].etat, 'unlocked');
    assert.equal(grids[job].spheres[1].etat, 'locked');
    assert.equal(grids[job].spheres[2].etat, 'learned');
    assert.equal(grids[job].spheres[3].etat, 'unlocked');
    assert.equal(grids[job].spheres[4].etat, 'locked');
    assert.equal(grids[job].spheres[4].cout.cannedCatFood, 2);
    assert.equal(grids[job].spheres[5].cout.cannedCatFood, 3);
    assert.match(grids[job].spheres[5].desc, /Adds one recipe slot to the (Wood|Food|Rocks) family/);
    assert.match(grids[job].spheres[0].desc, /Changes the Gathering target for the matching Processing recipe from 10 gather resources to 8/);
    assert.match(grids[job].spheres[1].desc, /from 10 gather resources to 6/);
    assert.match(grids[job].spheres[3].desc, /by 25%/);
    assert.match(grids[job].spheres[4].desc, /additional 25% \(total 50%\)/);
  });
  assert.match(gameSource, /sawmill: \{ cost: 'carpenter-cost', cost2: 'carpenter-cost-2', speed: 'carpenter-speed', speed2: 'carpenter-speed-2'/);
  assert.match(gameSource, /catchen: \{ cost: 'chef-cost', cost2: 'chef-cost-2', speed: 'chef-speed', speed2: 'chef-speed-2'/);
  assert.match(gameSource, /pawsonry: \{ cost: 'stonemason-cost', cost2: 'stonemason-cost-2', speed: 'stonemason-speed', speed2: 'stonemason-speed-2'/);
  assert.match(gameSource, /multiplicateurCoutFamille\(pair\.procMultAction\)/);
  assert.match(gameSource, /managerCostMultiplier\(famille\)[\s\S]*?spherePerkLearned\(perks\.cost2\)[\s\S]*?0\.6/);
  assert.match(gameSource, /const boost = \(spherePerkLearned\(perks\.speed\) \? 0\.25/);
  assert.match(gameSource, /costMultiplier: multiplicateurCoutFamille\(pair\.procMultAction\)/);
  assert.match(gameSource, /const modifiers = Object\.assign\([\s\S]*?modificateursRecette\(pair, kitty\)[\s\S]*?modificateursManualFocus\(family, slotIdx, slot\)[\s\S]*?avancerRecetteSlot\(etat, definitionMoteurRecette\(pair\), slot, dt, modifiers\)/);
});

test('Wood Builder sphere controls scalable costs, perfect auto-builds and house speed branches', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const grid = context.CatInc.data.content.SPHERE_GRIDS.builder;
  const spheres = grid.spheres;
  const costs = {};
  spheres.forEach(function(s) { costs[s.id] = s.cout ? s.cout.cannedCatFood : 0; });
  assert.equal(spheres.length, 15);
  assert.deepEqual(costs, {
    'builder-c': 0,
    'builder-auto': 1, 'builder-perfect-1': 2, 'builder-perfect-2': 3,
    'builder-cost': 2, 'builder-expo-2': 3, 'builder-expo-3': 4,
    'builder-cost-half-1': 2, 'builder-cost-half-2': 3, 'builder-box-boost': 5,
    'builder-speed': 1, 'builder-speed-2': 2, 'builder-speed-3': 4,
    'builder-box-speed': 2, 'builder-wood-speed': 4
  });
  assert.deepEqual(Array.from(grid.connections, function(conn) { return Array.from(conn); }), [
    ['builder-c', 'builder-auto'], ['builder-auto', 'builder-perfect-1'], ['builder-perfect-1', 'builder-perfect-2'],
    ['builder-c', 'builder-cost'], ['builder-cost', 'builder-expo-2'], ['builder-expo-2', 'builder-expo-3'],
    ['builder-cost', 'builder-cost-half-1'], ['builder-cost-half-1', 'builder-cost-half-2'],
    ['builder-cost', 'builder-box-boost'],
    ['builder-c', 'builder-speed'], ['builder-speed', 'builder-speed-2'], ['builder-speed-2', 'builder-speed-3'],
    ['builder-speed', 'builder-box-speed'], ['builder-box-speed', 'builder-wood-speed']
  ]);
  assert.match(gameSource, /function woodHouseCostExponent\(\)[\s\S]*?builder-expo-3[\s\S]*?1\.5[\s\S]*?builder-expo-2[\s\S]*?1\.55[\s\S]*?builder-cost[\s\S]*?1\.6 : 1\.7/);
  assert.match(gameSource, /function woodHouseCostMultiplier\(\)[\s\S]*?builder-cost-half-2[\s\S]*?0\.25[\s\S]*?builder-cost-half-1[\s\S]*?0\.5 : 1/);
  assert.match(gameSource, /function woodHouseCostForCount\(count\)[\s\S]*?Math\.ceil\(exponentCost \* woodHouseCostMultiplier\(\)\)/);
  const autoBuildSource = extraire('function autoBuildWoodHousesIfNeeded()', 'function coutProchaineStoneCathouse()');
  assert.match(autoBuildSource, /coutCarton \* 2 < etat\.cardboardPlanks/);
  assert.match(autoBuildSource, /coutBois \* 2 < etat\.basicWoodPlanks/);
  assert.match(autoBuildSource, /!spherePerkLearned\('builder-perfect-1'\)[\s\S]*?etat\.cardboardPlanks -= coutCarton/);
  assert.match(autoBuildSource, /!spherePerkLearned\('builder-perfect-2'\)[\s\S]*?etat\.basicWoodPlanks -= coutBois/);
  assert.match(gameSource, /function acheterCathouse\(\)[\s\S]*?etat\.cardboardPlanks -= cout/);
  assert.match(gameSource, /function acheterCatHouse\(\)[\s\S]*?etat\.basicWoodPlanks -= cout/);
  assert.match(gameSource, /function woodHouseGlobalSpeedMultiplier\(\)[\s\S]*?builder-speed-3[\s\S]*?0\.25/);
  assert.match(gameSource, /function cardboardBoxBaseSpeed\(\)[\s\S]*?builder-box-speed[\s\S]*?\? 3 : 1/);
  assert.match(gameSource, /function woodCathouseBaseSpeed\(\)[\s\S]*?builder-wood-speed[\s\S]*?\? 2 : 1/);
  assert.match(gameSource, /function woodCathouseBoxBoostMultiplier\(\)[\s\S]*?1 \+ 0\.05 \* etat\.cathouses\.length/);
  assert.match(htmlSource, /id="builder-auto-toggle"[\s\S]*?id="bloc-wood-cathouse"/);
  assert.match(gameSource, /function builderManagerBonus\(\)[\s\S]*?managerSpeedMultiplier\(kitty, "houses"\)/);
  assert.match(htmlSource, /id="toggle-auto-build-wood-houses"/);
  assert.match(htmlSource, /basculerAutoBuildWoodHouses\(this\.checked\)/);
});

test('Training Center opens directly and uses a compact mobile cat picker', function() {
  assert.match(htmlSource, /id="facilities-grid"/);
  assert.match(htmlSource, /id="section-job-center"/);
  assert.doesNotMatch(htmlSource, /id="tc-entry"|id="btn-enter-training-center"/);
  assert.match(htmlSource, /id="training-center-intro-copy"/);
  assert.match(htmlSource, /id="tc-interface"/);
  assert.doesNotMatch(gameSource, /function ouvrirTrainingCenter\(|function fermerTrainingCenter\(|tcTrainingOuvert/);
  assert.match(gameSource, /ecrireStyle\(tcIface, "display", etat\.trainingCenterConstruit \? "block" : "none"\)/);
  assert.match(gameSource, /function renduTrainingCenter\(\)[\s\S]*?tc-mobile-picker[\s\S]*?ouvrirModalJC\(\\'spec\\'\)[\s\S]*?tc-roster-desktop[\s\S]*?selectionnerTrainingCat/);
  assert.match(gameSource, /jcModalOuvert\.mode === "spec"[\s\S]*?selectionnerKittySpec/);
  assert.match(cssSource, /\.tc-workspace-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(220px, 0\.34fr\) minmax\(0, 0\.66fr\)/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.tc-roster-desktop\s*\{\s*display:\s*none/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.tc-mobile-picker\s*\{[\s\S]*?display:\s*flex/);

  const trainingCode = extraire('function trainingCenterKitties() {', 'function renduTrainingCenter() {');
  const context = vm.createContext({
    METIERS: { lumberjack: {}, carpenter: {}, farmer: {}, chef: {} },
    etat: { kittiesData: [
      { nom: 'Alice', metier: 'farmer' },
      { nom: 'Bernardo', metier: 'chef' },
      { nom: 'Charlie', metier: 'lumberjack' },
      { nom: 'Stray', metier: null },
      { nom: 'Diana', metier: 'carpenter' }
    ] }
  });
  vm.runInContext(trainingCode + '\nthis.order = trainingCenterKitties().map(function(entry) { return entry.k.nom; });', context);
  assert.deepEqual(Array.from(context.order), ['Bernardo', 'Charlie', 'Diana', 'Alice']);
});

test('the first Job Center training must be an Explorator', function() {
  assert.match(gameSource, /id: "firstJobTraining", label: "Train a cat as an Explorator"[\s\S]*?k\.metier === "explorator"/);
  assert.match(gameSource, /function selectionnerMetierJC\(metierId\) \{[\s\S]*?!explorateurPresent\(\) && metierId !== "explorator"/);
  assert.match(gameSource, /const premierExploratorRequis = !explorateurPresent\(\);[\s\S]*?const verrouille = premierExploratorRequis && m\.id !== "explorator";[\s\S]*?Train an Explorator first/);
  assert.match(gameSource, /function lancerFormation\(\)[\s\S]*?!explorateurPresent\(\) && jcMetierSelectionne !== "explorator"/);
});

test('Job Center job buttons explain their impact and base bonus responsively', function() {
  assert.match(gameSource, /const JOB_CENTER_JOB_INFO = Object\.freeze\(/);
  assert.match(gameSource, /lumberjack:[\s\S]*?description: "Improve workers’ wood-gathering production\."[\s\S]*?bonus: "50% increase in wood gathering production speed"/);
  assert.match(gameSource, /carpenter:[\s\S]*?description: "Improve workers’ processing of wood into planks\."[\s\S]*?bonus: "50% increase in wood processing production speed"/);
  assert.match(gameSource, /farmer:[\s\S]*?bonus: "50% increase in food gathering production speed"/);
  assert.match(gameSource, /chef:[\s\S]*?bonus: "50% increase in food processing production speed"/);
  assert.match(gameSource, /miner:[\s\S]*?bonus: "50% increase in rock gathering production speed"/);
  assert.match(gameSource, /stonemason:[\s\S]*?bonus: "50% increase in rock processing production speed"/);
  assert.match(gameSource, /builder:[\s\S]*?description: "Improve the recruiting speed provided by Wood Houses\."[\s\S]*?impact: "Houses · Wood Houses recruitment speed"[\s\S]*?bonus: "50% increase in Wood Houses recruiting speed"/);
  assert.match(gameSource, /explorator:[\s\S]*?impact: "Exploration · Map, Campaigns and Scoutings"[\s\S]*?bonus: "Halves all mission times in Exploration"/);
  assert.match(gameSource, /function afficherInfoMetierJC\(jobId, anchor\)[\s\S]*?jc-job-info-popup[\s\S]*?Base bonus/);
  assert.match(gameSource, /function selectionnerMetierJC\(metierId\)[\s\S]*?renduJobCenter\(unlocks\(\)\)[\s\S]*?afficherInfoMetierJC/);
  assert.match(gameSource, /class="jc-metier-info-wrap"[\s\S]*?onmouseenter="afficherInfoMetierJC/);
  assert.match(gameSource, /data-jc-job-id="' \+ m\.id \+ '"/);
  assert.match(cssSource, /\.jc-job-info-popup\s*\{[\s\S]*?position: fixed[\s\S]*?pointer-events: none/);
  assert.match(cssSource, /\.jc-metier-info-wrap\s*\{[\s\S]*?display: inline-flex/);
});

test('the first Explorator receives a persistent story leading to the map', function() {
  assert.match(htmlSource, /id="ecran-story-explorator"[\s\S]*?story-explorator-speaker[\s\S]*?story-explorator-unlock-copy[\s\S]*?ouvrirCarteDepuisStoryExplorator\(\)/);
  assert.doesNotMatch(htmlSource, /very first Explorator\. Well done,[\s\S]*?story-explorator-name/);
  assert.match(gameSource, /id: "ecran-story-explorator", nom: "A New Horizon", flag: "storyExploratorVue"/);
  assert.match(gameSource, /function terminerFormation\(\)[\s\S]*?metierId === "explorator"[\s\S]*?preparerStoryExplorator\(kittyIndex\)[\s\S]*?marquerStoryVue\("storyExploratorVue"\)[\s\S]*?afficherModal\("ecran-story-explorator"\)/);
  assert.match(gameSource, /function preparerStoryExplorator\(kittyIndex\)[\s\S]*?kitty\.nom[\s\S]*?kitty\.visage/);
  assert.match(gameSource, /function ouvrirCarteExplorationsDepuisStory\(storyId\)[\s\S]*?changerOnglet\("explorations"\)[\s\S]*?section-explo-map[\s\S]*?objectif-cible-highlight/);
  assert.match(gameSource, /function ouvrirCarteDepuisStoryExplorator\(\)[\s\S]*?ouvrirCarteExplorationsDepuisStory\("ecran-story-explorator"\)/);
});

test('Gang on the rise leads directly to the highlighted exploration map', function() {
  assert.match(htmlSource, /id="ecran-story-5"[\s\S]*?onclick="ouvrirCarteDepuisStoryGangRise\(\)"[\s\S]*?>Let's explore!<\/button>/);
  assert.match(gameSource, /function ouvrirCarteDepuisStoryGangRise\(\)[\s\S]*?ouvrirCarteExplorationsDepuisStory\("ecran-story-5"\)/);
});

test('the 15-cat evacuation story unlocks the D1 house search', function() {
  assert.match(htmlSource, /id="ecran-story-house-evacuation"[\s\S]*?fifteen of them[\s\S]*?onclick="ouvrirMaisonDepuisStory\(\)"/);
  assert.match(gameSource, /id: "ecran-story-house-evacuation", nom: "They Built a Camp", flag: "storyHouseEvacuationVue"/);
  assert.match(gameSource, /if \(etat\.chatons >= 15 && !storyEstVue\("storyHouseEvacuationVue"\)\)[\s\S]*?marquerStoryVue\("storyHouseEvacuationVue"\)[\s\S]*?afficherModal\("ecran-story-house-evacuation"\)/);
  assert.match(gameSource, /function ouvrirMaisonDepuisStory\(\)[\s\S]*?ouvrirCarteExplorationsDepuisStory\("ecran-story-house-evacuation"\)/);
});

test('The adventure begins hands recruitment over to Bernardo', function() {
  assert.match(htmlSource, /id="ecran-story-3"[\s\S]*?onclick="fermerStoryAdventure\(\)"/);
  assert.match(htmlSource, /id="recruiting-transition-modal"[\s\S]*?A new way to get more cats[\s\S]*?taking matters into his own paws[\s\S]*?recruiting new cats/);
  assert.match(gameSource, /function fermerStoryAdventure\(\)[\s\S]*?storyEstVue\("story3TransitionVue"\)[\s\S]*?marquerStoryVue\("story3TransitionVue"\)[\s\S]*?ouvrirDialogueModal\("recruiting-transition-modal"/);
});

test("What's that thing leads to the School Guide Study action", function() {
  assert.match(htmlSource, /id="ecran-story-6a"[\s\S]*?onclick="allerEtudierSchoolGuideDepuisStory\(\)"[\s\S]*?>Have a read, Bernardo<\/button>/);
  assert.match(gameSource, /id="inv-item-action-' \+ itemId \+ '-' \+ action\.id \+ '"/);
  assert.match(gameSource, /function allerEtudierSchoolGuideDepuisStory\(\)[\s\S]*?resCategorieFiltree = "books"[\s\S]*?itemSelectionne = "schoolGuide"[\s\S]*?changerOnglet\("inventaire"\)[\s\S]*?inv-item-action-schoolGuide-study[\s\S]*?objectif-cible-highlight/);
});

test('the map waits for the built Job Center before suggesting Explorator training', function() {
  assert.match(gameSource, /etat\.jobCenterConstruit && \(!u \|\| !u\.explorateurPresent\)[\s\S]*?Train an <strong>Explorator<\/strong> in the Job Center/);
});

test('zone exploration aligns the required slot and only offers valid Explorators there', function() {
  assert.match(gameSource, /const requiredExploratorSlot = !!\(exploModalOuvert\.zoneId && slotIndex === 0\);[\s\S]*?return !requiredExploratorSlot \|\| estExplorateurDeZone\(entry\.i\)/);
  assert.match(gameSource, /explo-slot-required-label[\s\S]*?slotRequiredLabel[\s\S]*?explo-slot-required-label/);
  assert.match(cssSource, /\.explo-slots\s*\{[\s\S]*?align-items:\s*flex-start/);
  assert.match(cssSource, /\.explo-slot-required-wrap\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column/);
  assert.match(cssSource, /\.explo-slot-required-label\s*\{[\s\S]*?order:\s*2;[\s\S]*?line-height:\s*16px/);
});

test('developer controls require the explicit debug URL flag', function() {
  assert.match(gameSource, /const devQuery = typeof location !== "undefined" \? location\.search : ""/);
  assert.match(gameSource, /const DEV_MODE = \/\(\?:\^\|\[\?&\]\)debug=1\(\?:&\|\$\)\/\.test\(devQuery\)/);
  assert.match(gameSource, /document\.body\.dataset\.devMode = DEV_MODE \? "true" : "false"/);

  assert.match(cssSource, /\.bird-debug-btn\s*\{[\s\S]*?display:\s*none;/);
  assert.match(cssSource, /#bouton-vitesse\s*\{[\s\S]*?display:\s*none;/);
  assert.match(cssSource, /body\[data-dev-mode="true"\] #bouton-vitesse,[\s\S]*?body\[data-dev-mode="true"\] \.bird-debug-btn\s*\{\s*display:\s*inline-flex;/);

  const speedControl = extraire('function cyclerVitesse() {', 'function toggleObjectifs() {');
  assert.match(speedControl, /if \(!DEV_MODE\)\s*\{\s*vitesse = 1;\s*return;/);

  const afterBird = extraire('function _apresMinijeuOiseau() {', 'function clickerBird() {');
  assert.match(afterBird, /DEV_MODE \? "inline-flex" : "none"/);

  assert.match(stateSource, /birdPremierSpawnTs:\s+Date\.now\(\) \+ 5 \* 60 \* 1000/);
  assert.match(stateSource, /birdPremiereReussie:\s+false/);
  assert.match(stateSource, /birdPityEchecs:\s+0/);
  assert.match(saveSource, /birdPityEchecs/);
  const birdSchedule = extraire('function planifierOiseau() {', 'function montrerOiseau() {');
  assert.match(birdSchedule, /if \(!catheringDebloquee\(\)\)/);
  assert.match(birdSchedule, /!etat\.birdPremiereReussie/);
  assert.match(birdSchedule, /etat\.birdPremierSpawnTs/);
  assert.match(gameSource, /etat\.chatons === 3[\s\S]*?Work unlocked![\s\S]*?planifierOiseau\(\)/);
  const birdStart = extraire('function demarrerBirdMiniJeu() {', 'function ouvrirBirdMiniJeu() {');
  assert.match(birdStart, /bird-premiere/);
  assert.match(birdStart, /var speed = premiere \? 35/);
  assert.match(birdStart, /multiplicateurPityOiseau\(\)/);
  assert.match(birdStart, /bird-pity[\s\S]*?fails[\s\S]*?speed reduced/);
  const birdClick = extraire('function clickerBird() {', 'function fermerBirdSuccessPopup() {');
  assert.match(birdClick, /if \(premiere && !success\)[\s\S]*?return;/);
  assert.match(birdClick, /Other bird types may appear in the future/);
  assert.match(birdClick, /workBoostFinTs = Date\.now\(\) \+ 60000/);
  assert.match(birdClick, /etat\.birdPityEchecs = 0/);
  assert.match(birdClick, /etat\.birdPityEchecs = \(Number\.isInteger\(etat\.birdPityEchecs\)/);
  assert.match(gameSource, /const BIRD_PITY_REDUCTION_PER_FAIL = 0\.05[\s\S]*?const BIRD_PITY_MAX_REDUCTION = 0\.35[\s\S]*?function multiplicateurPityOiseau\(\)[\s\S]*?Math\.min\(BIRD_PITY_MAX_REDUCTION, echecs \* BIRD_PITY_REDUCTION_PER_FAIL\)/);
  assert.match(htmlSource, /id="bird-pity"[^>]*>0 fails : 0% speed reduced/);
  assert.match(htmlSource, /class="ressources-fixes"[\s\S]*?id="bird-btn"[\s\S]*?class="ressources-liste"/);
  assert.match(gameSource, /function montrerOiseau\(\)[\s\S]*?fixed part of the resource rail/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.ressources\s*\{[\s\S]*?height:\s*78px;[\s\S]*?overflow:\s*hidden;[\s\S]*?\.ressources-liste\s*\{[\s\S]*?grid-template-rows:\s*repeat\(2,[\s\S]*?touch-action:\s*pan-x;/);
  assert.match(cssSource, /\.ressources-fixes #bird-btn,[\s\S]*?align-items:\s*center;[\s\S]*?justify-content:\s*center;[\s\S]*?width:\s*44px;[\s\S]*?min-width:\s*44px;/);
  assert.match(cssSource, /@keyframes bird-wiggle-mobile\s*\{[\s\S]*?translateY\(2px\)[\s\S]*?translateY\(-2px\)/);
  assert.match(cssSource, /\.bird-premiere \.bird-skip-btn\s*\{\s*display:\s*none;/);
});

test('catch and recruit use a passive saved cooldown with an active claim action', function() {
  assert.match(gameSource, /function sequenceEstPrete\(\)[\s\S]*?!etat\.sequenceEnCours \|\| tempsRestantSequence\(\) <= 0/);
  assert.match(gameSource, /function demarrerRechargeCatch\(\)[\s\S]*?sequenceDebutTs = Date\.now\(\)[\s\S]*?sequenceDuree = dureeBrute\(\)/);
  assert.match(gameSource, /bouton-sequence[\s\S]*?if \(!sequenceEstPrete\(\)\) return;[\s\S]*?etat\.chatons < 3[\s\S]*?ouvrirMiniJeuCatch\(\)[\s\S]*?ouvrirMiniJeuRecruit\(\)/);
  const completion = extraire('function terminerSequence() {', '// ── 10b. Worker deallocation');
  assert.match(completion, /etat\.clicCount\s*\+= 1[\s\S]*?demarrerRechargeCatch\(\)/);
  const tickCode = extraire('function tick() {', 'setInterval(tick, 100);');
  assert.match(tickCode, /completed cooldown stays ready[\s\S]*?marquerSequencePrete\(\)/);
  assert.doesNotMatch(tickCode, /terminerSequence\(\)/);
  const offline = extraire('function appliquerProgressionHorsLigne() {', 'function afficherResumeAbsence');
  assert.doesNotMatch(offline, /etat\.chatons\s*\+=/);
  assert.match(offline, /a cat is never granted automatically while offline/);
  assert.match(gameSource, /const VITESSE_HORS_LIGNE\s*=\s*0\.1/);
  assert.match(gameSource, /const MAX_AFK_SECONDS\s*=\s*10\s*\*\s*60\s*\*\s*60/);
  assert.match(gameSource, /function tempsSimuleHorsLigne\([\s\S]*?MAX_AFK_SECONDS[\s\S]*?VITESSE_HORS_LIGNE/);
  assert.match(gameSource, /function afficherResumeAbsence[\s\S]*?MAX_AFK_SECONDS[\s\S]*?VITESSE_HORS_LIGNE[\s\S]*?absence-regles[\s\S]*?of real time/);
  const offlineSummary = extraire('function afficherResumeAbsence(resume) {', 'let releaseNotesTimer');
  assert.match(offlineSummary, /absence-icone[\s\S]*?Cardboard Plank_Final\.png[\s\S]*?Basic Wood Plank_Final\.png[\s\S]*?Catnip Salad_Final\.png/);
  assert.doesNotMatch(offlineSummary, /⏱|⚙|📋|🪵|🪨|🧱|🥗|🐟|🐾|🐱/u);
  assert.match(cssSource, /\.absence-icone\s*\{[\s\S]*?width:\s*30px;[\s\S]*?object-fit:\s*contain/);
  assert.match(offline, /appliquerDecalageTimersHorsLigne\(decalageMs\)/);
  assert.match(offline, /terminerExplo\(explo\)[\s\S]*?terminerExploZone\(\)[\s\S]*?terminerScouting\(scoutingId, runs\)/);
  assert.match(offline, /terminerApprentissage\(etat\.learningEnCours\.itemId\)[\s\S]*?terminerFormation\(\)/);
  assert.match(gameSource, /function rattraperProgressionAfk\(\)[\s\S]*?appliquerProgressionHorsLigne\(\)[\s\S]*?renduManagement\(\)/);
  assert.match(gameSource, /visibilitychange[\s\S]*?sauvegarderAvantSuspension\(\)[\s\S]*?rattraperProgressionAfk\(\)/);
  assert.match(gameSource, /pageshow[\s\S]*?rattraperProgressionAfk\(\)/);
  assert.match(gameSource, /pagehide[\s\S]*?sauvegarderAvantSuspension/);
  assert.match(gameSource, /bouton-intro"\)\.addEventListener\("click"[\s\S]*?etat\.chatons === 0 && !etat\.sequenceEnCours[\s\S]*?demarrerRechargeCatch\(\)[\s\S]*?sauvegarder\(\)/);
  assert.match(gameSource, /function reset\(\)[\s\S]*?reinitialiserEtat\(\)[\s\S]*?renduManagement\(\)[\s\S]*?afficherModal\("ecran-intro"\)/);
});

test('catch cooldown speed changes apply only to the remaining raw time', function() {
  assert.match(gameSource, /function actualiserProgressionSequence\(maintenant\)[\s\S]*?previousSpeed[\s\S]*?sequenceProgressBrute[\s\S]*?sequenceVitesseDerniere = vitesseSequenceEffective\(\)/);
  assert.match(gameSource, /function demarrerRechargeCatch\(\)[\s\S]*?sequenceProgressBrute = 0[\s\S]*?sequenceDerniereMajTs = etat\.sequenceDebutTs[\s\S]*?sequenceVitesseDerniere = vitesseSequenceEffective\(\)/);
  const tickCode = extraire('function tick() {', 'setInterval(tick, 100);');
  assert.doesNotMatch(tickCode, /etat\.sequenceDebutTs\s*-=/);
});

test('the catch progress bar follows the exact upcoming cat portrait', function() {
  assert.match(htmlSource, /id="barre-sequence"[\s\S]*?id="sequence-chat-marker"[\s\S]*?Bernardo\.png/);
  assert.match(htmlSource, /id="info-sequence"[^>]*aria-live="polite"[\s\S]*?class="info-sequence-label">Next Cat<[\s\S]*?id="info-sequence-timer"/);
  assert.match(gameSource, /function assurerVisageProchainChat\(\)[\s\S]*?etat\.prochainVisageChaton = assignerVisageChaton\(nomProchainChat\(\)\)/);
  assert.match(gameSource, /function renduSequence\(\)[\s\S]*?sequence-chat-marker[\s\S]*?marker\.setAttribute\("src", prochainVisage\)[\s\S]*?marker\.setAttribute\("alt", prochainNom\)/);
  assert.match(gameSource, /ecrireTexte\(domParId\("info-sequence-timer"\), enCours \? formaterTemps\(restant\) : "Ready"\)/);
  assert.match(gameSource, /ecrireTexte\(btnSeq, recruit \? "Recruit the Cat" : "Catch the Cat"\)[\s\S]*?ecrireStyle\(domParId\("conteneur-barre-sequence"\), "display", "block"\)/);
  const completion = extraire('function terminerSequence() {', '// ── 10b. Worker deallocation');
  assert.match(completion, /const visage = assurerVisageProchainChat\(\)[\s\S]*?visage: visage[\s\S]*?prochainVisageChaton = null[\s\S]*?demarrerRechargeCatch\(\)/);
  assert.match(cssSource, /\.sequence-chat-marker\s*\{[\s\S]*?right:\s*-15px;[\s\S]*?width:\s*30px;[\s\S]*?border-radius:\s*50%;/);
  assert.match(cssSource, /@media \(min-width:\s*769px\)[\s\S]*?#conteneur-barre-sequence\s*\{[\s\S]*?flex:\s*1 1 auto;[\s\S]*?#info-sequence\s*\{[\s\S]*?flex:\s*0 0 132px;[\s\S]*?width:\s*132px;/);
});

test('circular Cat portraits keep a safe centered inset', function() {
  assert.match(cssSource, /\.sequence-chat-marker\s*\{[\s\S]*?padding:\s*4px;[\s\S]*?object-position:\s*center;/);
  assert.match(cssSource, /\.inv-learning-marker\s*\{[\s\S]*?padding:\s*4px;[\s\S]*?object-position:\s*center;/);
  assert.match(cssSource, /\.work-recipe-cat-face \.kitty-icon\s*\{[\s\S]*?width:\s*86%;[\s\S]*?height:\s*86%;[\s\S]*?object-position:\s*center;/);
  assert.match(cssSource, /\.tc-cat-icon img,[\s\S]*?\.tc-selected-icon img\s*\{[\s\S]*?width:\s*86%;[\s\S]*?height:\s*86%;[\s\S]*?object-position:\s*center;/);
});

test('the first three catches use one-attempt portrait mini-games', function() {
  assert.match(gameSource, /const CAT_CATCH_SPEEDS = \[60, 80, 100\]/);
  assert.match(gameSource, /const visage = assurerVisageProchainChat\(\)[\s\S]*?icone\.src = visage/);
  assert.match(gameSource, /function clickerCatCatch\(\)[\s\S]*?_catCatchCursorPct >= 40 && _catCatchCursorPct <= 60[\s\S]*?echouerMiniJeuCatch\(\)[\s\S]*?terminerSequence\(\)/);
  assert.match(gameSource, /function echouerMiniJeuCatch\(\)[\s\S]*?fermerDialogueModal\("cat-catch-minijeu"\)[\s\S]*?demarrerRechargeCatch\(\)[\s\S]*?sauvegarder\(\)/);
  assert.match(gameSource, /ouvrirDialogueModal\("cat-catch-minijeu"[\s\S]*?dismissible: true[\s\S]*?fermer: echouerMiniJeuCatch/);
  assert.match(htmlSource, /id="cat-catch-minijeu"[\s\S]*?onclick="echouerMiniJeuCatch\(\)"[\s\S]*?id="cat-catch-target-icone"[\s\S]*?clickerCatCatch/);
  assert.match(cssSource, /\.cat-catch-target\s*\{[\s\S]*?left:\s*40%;[\s\S]*?width:\s*20%;/);
});

test('Purrsuasion recruits later cats through a hold-and-release trust game', function() {
  assert.match(htmlSource, /id="recruit-minijeu"[\s\S]*?id="recruit-difficulty"[\s\S]*?id="recruit-target-portrait"[\s\S]*?id="recruit-trust-track"[\s\S]*?HOLD TO START YOUR PITCH/);
  assert.match(gameSource, /const RECRUIT_GAME_DURATION = 10[\s\S]*?const RECRUIT_GOOD_MIN = 42[\s\S]*?const RECRUIT_GOOD_MAX = 68[\s\S]*?const RECRUIT_HOLD_TARGET = 2/);
  assert.match(gameSource, /function commencerPitchRecruit\(event\)[\s\S]*?demarrerTimerMiniJeuRecruit\(\)[\s\S]*?definirPitchRecruitActif\(true\)/);
  assert.match(gameSource, /function demarrerTimerMiniJeuRecruit\(\)[\s\S]*?_recruitTimeLeft -= dt[\s\S]*?_recruitSpeedMultiplier[\s\S]*?_recruitGoodTime \+= dt/);
  assert.match(gameSource, /_recruitTrust >= RECRUIT_GOOD_MAX[\s\S]*?echouerMiniJeuRecruit\("too-pushy"\)[\s\S]*?_recruitGoodTime >= RECRUIT_HOLD_TARGET[\s\S]*?reussirMiniJeuRecruit\(\)[\s\S]*?_recruitTimeLeft <= 0[\s\S]*?echouerMiniJeuRecruit\("timeout"\)/);
  assert.match(gameSource, /_recruitDifficulty = Math\.max\(1, etat\.chatons - 2\)[\s\S]*?_recruitSpeedMultiplier = 1 \+ \(_recruitDifficulty - 1\) \* 0\.1[\s\S]*?Cursor speed ×/);
  const opening = extraire('function ouvrirMiniJeuRecruit() {', 'function echouerMiniJeuRecruit(raison) {');
  assert.doesNotMatch(opening, /demarrerRechargeCatch\(\)/);
  assert.match(opening, /ouvrirDialogueModal\("recruit-minijeu"[\s\S]*?dismissible: true/);
  assert.match(gameSource, /function echouerMiniJeuRecruit\(raison\)[\s\S]*?demarrerRechargeCatch\(\)[\s\S]*?Failed to recruit[\s\S]*?sauvegarder\(\)/);
  assert.match(gameSource, /function reussirMiniJeuRecruit\(\)[\s\S]*?terminerSequence\(\)/);
  assert.match(cssSource, /\.recruit-zone-good\s*\{[\s\S]*?left:\s*42%;[\s\S]*?width:\s*26%;/);
  assert.match(cssSource, /\.recruit-pitch-btn\s*\{[\s\S]*?touch-action:\s*none;/);
});

test('Purrsuasion pairs varied visitor lines with pointed Bernardo replies', function() {
  const dialogues = extraire('const RECRUIT_DIALOGUES = [', 'var _recruitMiniJeuActif');
  assert.equal((dialogues.match(/visitor:/g) || []).length, 10);
  assert.equal((dialogues.match(/bernardo:/g) || []).length, 10);
  assert.match(dialogues, /I'm alone[\s\S]*?never go hungry again/);
  assert.match(dialogues, /I don't trust gangs[\s\S]*?organization\. With snacks/);
  assert.match(gameSource, /function choisirDialogueRecruit\(\)[\s\S]*?index === _recruitDialoguePrecedent[\s\S]*?_recruitDialoguePrecedent = index/);
  assert.match(gameSource, /const dialogue = choisirDialogueRecruit\(\)[\s\S]*?visitorSpeech\.textContent = dialogue\.visitor[\s\S]*?bernardoSpeech\.textContent = dialogue\.bernardo/);
  assert.match(htmlSource, /id="recruit-visitor-speech"[\s\S]*?recruit-portrait-visitor[\s\S]*?recruit-portrait-bernardo[\s\S]*?id="recruit-bernardo-speech"/);
  assert.match(cssSource, /\.recruit-speech-visitor::after[\s\S]*?right:\s*-11px;[\s\S]*?border-left:/);
  assert.match(cssSource, /\.recruit-speech-bernardo::before[\s\S]*?left:\s*-11px;[\s\S]*?border-right:/);
});

test('all mini-games use one mobile-safe foreground runtime', function() {
  assert.match(gameSource, /const MINI_JEU_FRAME_DT_MAX = 0\.05[\s\S]*?const miniJeuRuntime = \{/);
  assert.match(gameSource, /function ouvrirSessionMiniJeu\(id\)[\s\S]*?if \(!id \|\| miniJeuRuntime\.actif\) return false/);
  assert.match(gameSource, /function demarrerAnimationMiniJeu\(id, callback\)[\s\S]*?arreterAnimationMiniJeu\(id\)[\s\S]*?Math\.min\(MINI_JEU_FRAME_DT_MAX/);
  assert.match(gameSource, /function fermerSessionMiniJeu\(id\)[\s\S]*?arreterAnimationMiniJeu\(id\)[\s\S]*?classList\.remove\("mini-game-runtime-active"\)/);
  assert.match(gameSource, /visibilitychange[\s\S]*?reinitialiserHorlogesMiniJeux/);
  assert.match(gameSource, /function rendu\(\) \{[\s\S]*?miniJeuRuntimeActif\(\)[\s\S]*?renduEnAttente = true/);
  assert.match(gameSource, /ouvrirSessionMiniJeu\("catch-cat"\)[\s\S]*?demarrerAnimationMiniJeu\("catch-cat"/);
  assert.match(gameSource, /function ouvrirMiniJeuRecruit\(\)[\s\S]*?ouvrirSessionMiniJeu\("recruit"\)/);
  assert.match(gameSource, /function demarrerTimerMiniJeuRecruit\(\)[\s\S]*?demarrerAnimationMiniJeu\("recruit"/);
  assert.match(gameSource, /ouvrirSessionMiniJeu\("bird"\)[\s\S]*?demarrerAnimationMiniJeu\("bird"/);
  assert.match(gameSource, /function ouvrirMiniJeuLivre\(itemId\)[\s\S]*?ouvrirSessionMiniJeu\("book"\)/);
  assert.match(gameSource, /function positionnerCurseurMiniJeu[\s\S]*?translate3d/);
  assert.match(cssSource, /\.bird-cursor\s*\{[\s\S]*?will-change:\s*transform/);
  assert.match(cssSource, /\.recruit-trust-fill\s*\{[\s\S]*?transform-origin:\s*left center[\s\S]*?will-change:\s*transform/);
  assert.match(cssSource, /body\.mini-game-runtime-active \.carte-fog-global-track[\s\S]*?animation-play-state:\s*paused !important/);
});

test('mobile game sprites cannot be selected or open the native context menu', function() {
  assert.match(cssSource, /html, body\s*\{[\s\S]*?-webkit-user-select:\s*none;[\s\S]*?-webkit-touch-callout:\s*none;/);
  assert.match(cssSource, /img, button, svg, \[role="button"\]\s*\{[\s\S]*?-webkit-user-drag:\s*none;[\s\S]*?user-select:\s*none;/);
  assert.match(gameSource, /document\.addEventListener\("contextmenu"[\s\S]*?closest\("img, button, svg, \[role='button'\]"\)[\s\S]*?event\.preventDefault\(\)/);
});

test('Purrsuasion shows portrait result popups for success and failure', function() {
  assert.match(htmlSource, /id="recruit-result-popup"[\s\S]*?id="recruit-result-title"[\s\S]*?id="recruit-result-portrait"[\s\S]*?id="recruit-result-badge"[\s\S]*?id="recruit-result-message"[\s\S]*?fermerPopupRecruitResult/);
  assert.match(gameSource, /function terminerSequence\(\)[\s\S]*?return \{ nom: nom, visage: visage, recruit: etaitRecruit \}/);
  assert.match(gameSource, /function reussirMiniJeuRecruit\(\)[\s\S]*?const resultat = terminerSequence\(\)[\s\S]*?ouvrirPopupRecruitResult\(true, resultat\.nom, resultat\.visage\)/);
  assert.match(gameSource, /function echouerMiniJeuRecruit\(raison\)[\s\S]*?const visage = assurerVisageProchainChat\(\)[\s\S]*?ouvrirPopupRecruitResult\(false, _recruitNom, visage\)/);
  assert.match(gameSource, /function ouvrirPopupRecruitResult\(reussi, nom, visage\)[\s\S]*?nom \+ " is convinced and agrees to join the Gang!"[\s\S]*?nom \+ " wasn't convinced\. Try again later\."/);
  assert.match(cssSource, /\.recruit-result-portrait-wrap\s*\{[\s\S]*?width:\s*108px;[\s\S]*?height:\s*108px;[\s\S]*?border-radius:\s*50%;[\s\S]*?overflow:\s*visible;/);
  assert.match(cssSource, /\.recruit-result-portrait\s*\{[\s\S]*?width:\s*84px;[\s\S]*?height:\s*84px;[\s\S]*?object-fit:\s*contain;/);
  assert.match(cssSource, /\.recruit-result-badge\s*\{[\s\S]*?right:\s*-5px;[\s\S]*?bottom:\s*-3px;[\s\S]*?width:\s*34px;/);
  assert.match(gameSource, /badge\.src = reussi \? "img\/interface\/✅_Final\.png[\s\S]*?Red Cross_Final\.png/);
});

test('automatic scouting results accumulate without creating toasts', function() {
  const scouting = extraire('function terminerScouting(scoutingId) {', 'function scoutingHalveTime(kittyIndex) {');
  assert.doesNotMatch(scouting, /afficherNotification\s*\(/);
  assert.match(scouting, /ajouterLog\("event"/);
  assert.match(scouting, /obtenirButinScouting\(scoutingId\)/);
  assert.match(scouting, /ajouterAuButinScouting/);
  assert.match(scouting, /startTs: sc\.startTs \+ runCount[\s\S]*?\* 1000/);
});

test('notifications are deduplicated and displayed sequentially', function() {
  const notificationCode = extraire('const notificationsEnAttente = [];', 'const LOG_MAX = 60;');
  const timers = [];
  const appended = [];

  function creerElement() {
    const classes = new Set();
    return {
      textContent: '',
      className: '',
      attributes: {},
      removed: false,
      classList: {
        add: function(name) { classes.add(name); },
        remove: function(name) { classes.delete(name); },
        contains: function(name) { return classes.has(name); }
      },
      setAttribute: function(name, value) { this.attributes[name] = value; },
      remove: function() { this.removed = true; }
    };
  }

  const context = vm.createContext({
    document: {
      createElement: creerElement,
      body: { appendChild: function(element) { appended.push(element); } }
    },
    setTimeout: function(callback, delay) {
      timers.push({ callback: callback, delay: delay });
      return timers.length;
    }
  });
  vm.runInContext(notificationCode + '\nthis.notify = afficherNotification; this.pending = notificationsEnAttente; this.getActive = function() { return notificationActive; };', context);

  context.notify('First');
  context.notify('Second');
  context.notify('Second');
  assert.equal(appended.length, 1);
  assert.equal(context.getActive().message, 'First');
  assert.deepEqual(Array.from(context.pending), ['Second']);
  assert.equal(appended[0].attributes.role, 'status');
  assert.equal(appended[0].attributes['aria-live'], 'polite');

  timers.splice(timers.findIndex(function(timer) { return timer.delay === 10; }), 1)[0].callback();
  assert.equal(appended[0].classList.contains('visible'), true);
  timers.splice(timers.findIndex(function(timer) { return timer.delay === 2600; }), 1)[0].callback();
  assert.equal(appended[0].classList.contains('visible'), false);
  timers.splice(timers.findIndex(function(timer) { return timer.delay === 400; }), 1)[0].callback();

  assert.equal(appended[0].removed, true);
  assert.equal(appended.length, 2);
  assert.equal(context.getActive().message, 'Second');
  assert.deepEqual(Array.from(context.pending), []);
});

test('story overlays scroll safely on short and landscape screens', function() {
  assert.match(cssSource, /\.ecran-intro\s*\{[\s\S]*?align-items:\s*flex-start;[\s\S]*?overflow-y:\s*auto;/);
  assert.match(cssSource, /\.intro-boite\s*\{[\s\S]*?flex-shrink:\s*0;[\s\S]*?margin-block:\s*auto;/);
  assert.match(cssSource, /@media \(max-height:\s*700px\)[\s\S]*?\.story-image\s*\{\s*max-height:\s*min\(180px, 34vh\);/);
});

test('story copy never uses em dashes', function() {
  const storyLines = htmlSource.match(/<p\b[^>]*class="[^"]*intro-ligne[^"]*"[^>]*>[\s\S]*?<\/p>/g) || [];
  assert.ok(storyLines.length > 0);
  storyLines.forEach(function(line) { assert.doesNotMatch(line, /\u2014/); });
  const exploratorStory = extraire('function preparerStoryExplorator(kittyIndex) {', 'function ouvrirCarteDepuisStoryExplorator() {');
  assert.doesNotMatch(exploratorStory, /\u2014/);
});

test('tabs expose full desktop names, compact mobile names and a persistent new state', function() {
  ['Gang', 'Work', 'Houses', 'Jobs', 'Explore', 'Bag', 'Logs'].forEach(function(label) {
    assert.match(htmlSource, new RegExp('data-mobile-label="' + label + '"'));
  });
  assert.match(cssSource, /\.onglet-label\s*\{[\s\S]*?display:\s*block;/);
  assert.match(cssSource, /\.onglet-label::after\s*\{[\s\S]*?content:\s*attr\(data-mobile-label\)/);
  assert.match(cssSource, /\.onglet-nouveau::after\s*\{/);
  assert.match(gameSource, /function actualiserBadgeOnglet\(id, visible\)/);
  assert.match(gameSource, /function marquerOngletVisite\(id\)[\s\S]*?etat\.ongletsVisites\.push\(id\);[\s\S]*?sauvegarder\(\);/);
});

test('Logs unlocks only when the gang reaches three cats', function() {
  assert.match(htmlSource, /id="onglet-logs"[^>]*style="display:none"/);
  assert.match(gameSource, /const logsVisible = etat\.chatons >= 3;[\s\S]*?onglet-logs[\s\S]*?logsVisible \? "inline-flex" : "none"/);
  assert.match(gameSource, /function changerOnglet\(id\)[\s\S]*?id === "logs" && etat\.chatons < 3/);
});

test('resource names can be opened by touch and keyboard without relying on hover', function() {
  assert.match(gameSource, /function initialiserRessourcesAccessibles\(\)/);
  assert.match(gameSource, /ressource\.tabIndex = 0;/);
  assert.match(gameSource, /ressource\.setAttribute\("role", "button"\)/);
  assert.match(gameSource, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(gameSource, /tooltip\.setAttribute\("role", "tooltip"\)/);
  assert.match(cssSource, /\.ressource-tooltip-flottant\s*\{[\s\S]*?position:\s*fixed;/);
});

test('every tutorial objective has guide metadata with a unique teaching order', function() {
  const modelStart = gameSource.indexOf('const OBJECTIFS = [');
  const guideStart = gameSource.indexOf('const OBJECTIF_GUIDE = Object.freeze({', modelStart);
  const stateStart = gameSource.indexOf('// 2. GAME STATE', guideStart);
  assert.notEqual(modelStart, -1);
  assert.notEqual(guideStart, -1);
  assert.notEqual(stateStart, -1);

  const objectiveIds = Array.from(gameSource.slice(modelStart, guideStart).matchAll(/\bid:\s*"([^"]+)"/g), function(match) { return match[1]; });
  const guideEntries = Array.from(gameSource.slice(guideStart, stateStart).matchAll(/^\s{2}([A-Za-z0-9]+):\s*\{\s*ordre:\s*(\d+)/gm));
  const guideIds = guideEntries.map(function(match) { return match[1]; });
  const orders = guideEntries.map(function(match) { return Number(match[2]); });

  assert.deepEqual(guideIds.slice().sort(), objectiveIds.slice().sort());
  assert.equal(new Set(orders).size, orders.length);
  assert.ok(orders.every(function(order) { return Number.isFinite(order); }));
});

test('the contextual guide lists desktop goals and exposes mobile previous/next navigation', function() {
  assert.match(htmlSource, /id="objectif-guide-precedent"[\s\S]*?changerObjectifGuide\(-1\)/);
  assert.match(htmlSource, /id="objectif-guide-compteur"[\s\S]*?id="objectif-guide-suivant"[\s\S]*?changerObjectifGuide\(1\)/);
  assert.match(htmlSource, /id="objectif-guide-liste"/);
  assert.match(htmlSource, /id="objectifs-titre"[^>]*data-clavier-clic="true"[^>]*onclick="toggleObjectifs\(\)"/);
  assert.match(htmlSource, /id="objectifs-toggle"[^>]*onclick="event\.stopPropagation\(\); toggleObjectifs\(\)"/);
  assert.doesNotMatch(htmlSource, /id="section-complis"|id="objectifs-complis"/);
  assert.match(htmlSource, /id="filtre-objective"[\s\S]*?filtre-inactif[\s\S]*?toggleFiltreLogs\('objective'\)/);
  assert.match(gameSource, /const logFiltres = \{ event: true, unlock: true, objective: false \}/);
  assert.match(gameSource, /ajouterLog\("objective", "Objective complete: " \+ obj\.label\)/);
  assert.match(gameSource, /actifs\.map\(objectifGuideCarteHtml\)\.join\(""\)/);
  assert.match(gameSource, /function changerObjectifGuide\(delta\)[\s\S]*?objectifGuideSelectionneId = actifs\[index\]\.id;[\s\S]*?renduObjectifs\(\)/);
  assert.match(gameSource, /function allerObjectif\(objectifId\)[\s\S]*?changerOnglet\(guide\.onglet\)[\s\S]*?filtrerWork\(guide\.filtre\)[\s\S]*?scrollIntoView/);
  assert.match(cssSource, /#panneau-objectifs\s*\{[\s\S]*?width:\s*380px;[\s\S]*?max-height:\s*min\(72vh, 680px\);/);
  assert.match(cssSource, /\.obj-guide-liste\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#contenu-principal\s*\{[\s\S]*?overflow-y:\s*auto;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#panneau-objectifs\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*var\(--hauteur-navigation-mobile\);[\s\S]*?height:\s*var\(--hauteur-tutorial-mobile\);/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#panneau-objectifs:not\(\.reduit\)\s*\{[\s\S]*?max-height:\s*min\(62vh, 360px\);[\s\S]*?bottom:\s*calc\(var\(--hauteur-navigation-mobile\) \+ 8px\);/);
  assert.match(cssSource, /@supports \(height:\s*100dvh\)[\s\S]*?#panneau-objectifs:not\(\.reduit\)\s*\{\s*max-height:\s*min\(62dvh, 360px\);/);
  assert.match(cssSource, /body\.objectifs-disponibles #contenu-principal\s*\{[\s\S]*?padding-bottom:\s*var\(--hauteur-tutorial-mobile\);/);
  assert.match(gameSource, /const actifs = objectifsActifsTries\(\);[\s\S]*?classList\.toggle\("objectifs-disponibles", actifs\.length > 0\)/);
  assert.match(gameSource, /function changerOnglet\(id\)[\s\S]*?definirObjectifsReduits\(true\);[\s\S]*?contenuPrincipal\.scrollTop = 0/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.obj-guide-navigation\s*\{\s*display:\s*grid;[\s\S]*?\.obj-guide-action\.obj-guide-selectionne\s*\{\s*display:\s*flex;/);
  assert.match(cssSource, /\.obj-guide-fleche\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/);
});

test('non-native game cards share safe Enter and Space activation', function() {
  const keyboardCode = extraire('function gererActivationClavier(event) {', 'if (typeof document !== "undefined") document.addEventListener("keydown", gererActivationClavier);');
  const context = vm.createContext({});
  vm.runInContext(keyboardCode + '\nthis.activate = gererActivationClavier;', context);

  let clicks = 0;
  let prevented = 0;
  const target = {
    matches: function(selector) { return selector === '[data-clavier-clic]'; },
    click: function() { clicks++; }
  };
  function event(key, repeat) {
    return {
      key: key,
      repeat: !!repeat,
      target: target,
      preventDefault: function() { prevented++; }
    };
  }

  context.activate(event('Enter'));
  context.activate(event(' '));
  context.activate(event('ArrowDown'));
  context.activate(event('Enter', true));
  assert.equal(clicks, 2);
  assert.equal(prevented, 2);

  const nestedButton = {
    matches: function() { return false; },
    click: function() { throw new Error('nested button must not activate its parent card'); }
  };
  context.activate({ key: 'Enter', repeat: false, target: nestedButton, preventDefault: function() {} });
});

test('Gang, Work, Inventory and Exploration expose their custom controls to keyboard users', function() {
  assert.match(gameSource, /rendreActivableClavier\(carte,[\s\S]*?carte\.dataset\.kittyIndex[\s\S]*?aria-pressed/);
  assert.match(gameSource, /section\.querySelectorAll\("\.pair-icon"\)[\s\S]*?aria-expanded/);
  assert.match(gameSource, /class="inv-res-cell"[\s\S]*?attributsActivationClavier\("Show details for " \+ r\.label\)[\s\S]*?aria-expanded="false"/);
  assert.match(gameSource, /class="inv-item-carte[\s\S]*?attributsActivationClavier[\s\S]*?aria-expanded/);
  assert.match(gameSource, /isPrimary[\s\S]*?attributsActivationClavier\(zone\.nom \+ ", " \+ zoneEtatLabel\)[\s\S]*?data-zone-id/);
  assert.match(gameSource, /class="explo-slot explo-slot-empty"[^\n]*attributsActivationClavier/);
  assert.match(gameSource, /requestAnimationFrame\(function\(\) \{[\s\S]*?\.kitty-carte\[data-kitty-index/);
  assert.match(cssSource, /\[data-clavier-clic\]:focus-visible\s*\{[\s\S]*?outline:/);
  assert.match(cssSource, /\.carte-cellule\[data-clavier-clic\]:focus-visible\s*\{[\s\S]*?outline-offset:\s*-3px;/);
});

test('every custom modal exposes dialog semantics and an accessible name', function() {
  const dialogs = htmlSource.match(/role="dialog"/g) || [];
  const modalFlags = htmlSource.match(/aria-modal="true"/g) || [];
  assert.equal(dialogs.length, 39);
  assert.equal(modalFlags.length, dialogs.length);
  assert.match(htmlSource, /id="settings-modal"[\s\S]*?aria-labelledby="settings-modal-titre"/);
  assert.match(htmlSource, /id="jc-modal"[\s\S]*?aria-labelledby="jc-modal-titre"/);
  assert.match(htmlSource, /id="worker-modal"[\s\S]*?aria-labelledby="worker-modal-titre"/);
  assert.match(htmlSource, /id="recipe-modal"[\s\S]*?aria-labelledby="recipe-modal-title"/);
  assert.match(htmlSource, /id="explo-modal"[\s\S]*?aria-labelledby="explo-modal-titre"/);
  assert.match(htmlSource, /id="scouting-reward-summary-modal"[\s\S]*?aria-labelledby="scouting-reward-summary-title"/);
  assert.match(htmlSource, /id="book-learning-modal"[\s\S]*?aria-labelledby="book-learning-title"[\s\S]*?aria-describedby="book-learning-instructions"/);
  assert.match(htmlSource, /id="gang-leader-unlock-modal"[\s\S]*?aria-labelledby="gang-leader-unlock-title"/);
  assert.match(htmlSource, /id="recruiting-transition-modal"[\s\S]*?aria-labelledby="recruiting-transition-title"[\s\S]*?aria-describedby="recruiting-transition-copy"/);
  assert.match(htmlSource, /id="tutorial-complete-modal"[\s\S]*?aria-labelledby="tutorial-complete-title"[\s\S]*?aria-describedby="tutorial-complete-copy"/);
  assert.match(htmlSource, /id="manager-role-tutorial-modal"[\s\S]*?aria-labelledby="manager-role-tutorial-title"[\s\S]*?aria-describedby="manager-role-tutorial-copy"/);
  assert.match(htmlSource, /id="save-upgrade-modal"[\s\S]*?aria-labelledby="save-upgrade-title"[\s\S]*?aria-describedby="save-upgrade-copy"/);
  assert.match(htmlSource, /id="ecran-release-notes"[\s\S]*?aria-labelledby="release-notes-title"[\s\S]*?aria-describedby="release-notes-copy"/);
  assert.match(htmlSource, /id="changelog-modal"[\s\S]*?aria-labelledby="changelog-modal-title"/);
  assert.match(htmlSource, /id="bird-minijeu"[\s\S]*?aria-describedby="bird-minijeu-desc"/);
  assert.match(htmlSource, /id="cat-catch-minijeu"[\s\S]*?aria-labelledby="cat-catch-minijeu-titre"[\s\S]*?aria-describedby="cat-catch-minijeu-desc"/);
  assert.match(htmlSource, /id="recruit-minijeu"[\s\S]*?aria-labelledby="recruit-minijeu-titre"[\s\S]*?aria-describedby="recruit-minijeu-desc"/);
  assert.match(htmlSource, /id="recruit-result-popup"[\s\S]*?aria-labelledby="recruit-result-title"[\s\S]*?aria-describedby="recruit-result-message"/);
  assert.match(htmlSource, /id="food-distribution-modal"[\s\S]*?aria-labelledby="food-distribution-title"[\s\S]*?aria-describedby="food-distribution-copy"/);
  assert.match(htmlSource, /class="explo-modal-close" aria-label="Close/);
});

test('completed Job Center training stays pending until validated and alerts Facilities', function() {
  assert.match(gameSource, /formationTermineeEnAttente/);
  assert.match(gameSource, /function validerFormation\(\)[\s\S]*?formationTermineeEnAttente = null/);
  assert.match(gameSource, /function validerFormation\(\)[\s\S]*?const managerValide = estMetierManager\(\{ metier: formationValidee\.metier \}\)[\s\S]*?if \(managerValide\) afficherTutorielRoleManager\(\)/);
  assert.match(gameSource, /if \(etat\.formationEnCours \|\| etat\.formationTermineeEnAttente\) return/);
  assert.match(gameSource, /onglet-formation-alerte/);
  assert.match(htmlSource, /id="onglet-facilities"/);
  assert.match(gameSource, /btn-jc-validate[\s\S]*?Validate formation/);
  assert.match(cssSource, /\.onglet-formation-alerte::after[\s\S]*?content:\s*"!"/);
  assert.match(gameSource, /formationIngenieurTermineeEnAttente/);
  assert.match(gameSource, /function validerFormationIngenieur\(\)[\s\S]*?formationIngenieurTermineeEnAttente = null/);
  assert.match(gameSource, /lancerFormationIngenieur\(\)[\s\S]*?formationIngenieurTermineeEnAttente/);
  assert.match(gameSource, /id="lab-training-marker"/);
  assert.match(gameSource, /id="jc-training-marker"/);
});

test('modal lifecycle manages initial focus, Tab containment, Escape and focus return', function() {
  const modalCode = extraire('const configurationsDialogues = new WeakMap();', '// 6. SAVE / LOAD / RESET');
  assert.match(modalCode, /dialogue\.setAttribute\("aria-hidden", "false"\)/);
  assert.match(modalCode, /config\.focusSelector[\s\S]*?elementsFocusablesDialogue\(dialogue\)\[0\]/);
  assert.match(modalCode, /event\.key === "Escape" && config\.dismissible/);
  assert.match(modalCode, /event\.key !== "Tab"/);
  assert.match(modalCode, /document\.activeElement === premier/);
  assert.match(modalCode, /document\.activeElement === dernier/);
  assert.match(modalCode, /config\.returnFocusSelector[\s\S]*?config\.elementRetour/);
  assert.match(gameSource, /ouvrirModalSettings\(\)[\s\S]*?dismissible: true[\s\S]*?fermer: fermerModalSettings/);
  assert.match(gameSource, /afficherModal\(id\)[\s\S]*?ouvrirDialogueModal\(el, \{ focusSelector: "\.bouton-intro" \}\)/);
  assert.doesNotMatch(gameSource, /const modals = document\.querySelectorAll\("\.ecran-intro"\)/);
});

test('modal kitty pickers are keyboard operable without nesting force or remove actions', function() {
  assert.match(gameSource, /explo-modal-kitty[\s\S]*?attributsActivationClavier\("Select " \+ k\.nom/);
  assert.match(gameSource, /jc-modal-kitty[\s\S]*?attributsActivationClavier\("Select " \+ k\.nom/);
  assert.match(gameSource, /worker-modal-kitty[\s\S]*?attributsActivationClavier\("Assign " \+ k\.nom/);
  assert.match(gameSource, /aria-disabled="true"/);
  assert.match(gameSource, /class="jc-slot-wrap"/);
  assert.match(gameSource, /data-jc-modal-trigger="formation"/);
  assert.match(gameSource, /data-explo-trigger="zone:/);
  assert.match(cssSource, /\[role="dialog"\] button:focus-visible/);
  assert.match(gameSource, /e\.target\.closest\("button, input, select, textarea, \[role=button\]"\)/);
});

test('a Cat studying a book cannot be assigned to Work or Exploration', function() {
  assert.match(gameSource, /const isLearning\s+= kittyIsLearningBook\(i\);[\s\S]*?const disabled\s+= onExplo[\s\S]*?isLearning/);
  assert.match(gameSource, /const isLearning\s+= kittyIsLearningBook\(i\);[\s\S]*?const forcable\s+= !isLearning/);
  assert.match(gameSource, /function selectionnerKittySlot\(kittyIndex\)[\s\S]*?if \(kittyIsBusy\(kittyIndex\)\) return;/);
  assert.match(gameSource, /function assignerWorkerSlot\(kittyIndex\)[\s\S]*?if \(kittyIsBusy\(kittyIndex\)\) return;/);
});

test('long Work kitty lists scroll inside their modal while its header stays visible', function() {
  assert.match(cssSource, /\.explo-modal-header\s*\{[\s\S]*?flex-shrink:\s*0;/);
  assert.match(cssSource, /#explo-modal-kitties,\s*#worker-modal-kitties\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?min-height:\s*0;[\s\S]*?overscroll-behavior:\s*contain;[\s\S]*?scrollbar-gutter:\s*stable;/);
  assert.match(cssSource, /#worker-modal-kitties::\-webkit-scrollbar-thumb\s*\{[\s\S]*?background:\s*#cbb9a5;/);
});

test('expedition assignment modal has a little more room without resizing other pickers', function() {
  assert.match(cssSource, /#explo-modal \.explo-modal-panneau\s*\{[\s\S]*?min-width:\s*280px;[\s\S]*?max-width:\s*390px;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#explo-modal \.explo-modal-panneau\s*\{[\s\S]*?width:\s*94vw;[\s\S]*?max-height:\s*84vh;/);
});

test('Work recipe Cat remove buttons stay compact around the phase ring', function() {
  assert.match(cssSource, /\.work-recipe-cat-remove\s*\{[\s\S]*?width:\s*20px;[\s\S]*?height:\s*20px;[\s\S]*?padding:\s*3px;/);
  assert.match(cssSource, /\.work-recipe-cat-remove img\s*\{\s*width:\s*100%;\s*height:\s*100%;/);
});

test('the main UI palette keeps informative text above WCAG AA contrast', function() {
  function rgb(hex) {
    const value = hex.replace('#', '');
    return [0, 2, 4].map(function(offset) { return parseInt(value.slice(offset, offset + 2), 16); });
  }
  function luminance(hex) {
    const channels = rgb(hex).map(function(channel) {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }
  function contrast(foreground, background) {
    const a = luminance(foreground);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  function cssVariable(name) {
    const match = cssSource.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{6})'));
    assert.ok(match, 'missing CSS variable --' + name);
    return match[1];
  }

  const panel = '#ffffff';
  const page = cssVariable('couleur-fond');
  ['couleur-accent', 'couleur-bouton', 'couleur-verte', 'couleur-discrete'].forEach(function(name) {
    const color = cssVariable(name);
    assert.ok(contrast(color, panel) >= 4.5, '--' + name + ' must be readable on panels');
    assert.ok(contrast(color, page) >= 4.5, '--' + name + ' must be readable on the page background');
  });
  assert.match(cssSource, /#objectifs-entete\s*\{[\s\S]*?background:\s*#956b00;/);
  assert.ok(contrast('#ffffff', '#956b00') >= 4.5, 'tutorial header text must remain readable');
});

test('primary and compact controls expose reinforced pointer targets', function() {
  assert.match(cssSource, /#bouton-sequence\s*\{[\s\S]*?min-height:\s*44px;/);
  assert.match(cssSource, /\.settings-btn\s*\{[\s\S]*?min-height:\s*44px;/);
  assert.match(cssSource, /\.btn-inv-action\s*\{[\s\S]*?min-height:\s*44px;/);
  assert.match(cssSource, /\.btn-lancer-explo\s*\{[\s\S]*?min-height:\s*44px;/);
  assert.match(cssSource, /\.btn-jc-train\s*\{[\s\S]*?min-height:\s*44px;/);
  assert.match(cssSource, /\.bouton-settings\s*\{[\s\S]*?min-width:\s*40px;[\s\S]*?min-height:\s*40px;/);
  assert.match(cssSource, /\.work-recipe-cat-remove\s*\{[\s\S]*?width:\s*20px;[\s\S]*?height:\s*20px;/);
  assert.match(cssSource, /\.jc-slot-remove\s*\{[\s\S]*?min-width:\s*28px;[\s\S]*?min-height:\s*28px;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.ressources-liste \.ressource\s*\{[^}]*min-width:\s*56px;/);
});

test('every fixed and generated image declares an alternative-text policy', function() {
  const fixedImages = htmlSource.match(/<img\b[^>]*>/g) || [];
  const generatedImages = gameSource.match(/<img\b[^>]*>/g) || [];
  assert.ok(fixedImages.length > 0);
  assert.ok(generatedImages.length > 0);
  fixedImages.forEach(function(tag) {
    assert.match(tag, /\balt="[^"]*"/, 'fixed image missing alt: ' + tag);
  });
  generatedImages.forEach(function(tag) {
    assert.match(tag, /\balt=/, 'generated image missing alt: ' + tag);
  });

  const storyAssets = extraire('const STORY_ASSETS = {', 'const STORIES = [');
  const entries = storyAssets.match(/^\s*"ecran-[^"]+":\s*\{[^\n]+\}/gm) || [];
  assert.equal(entries.length, 14);
  entries.forEach(function(entry) {
    assert.match(entry, /\balt:\s*"[^"]+"/, 'story asset missing a useful description: ' + entry);
  });
  assert.match(gameSource, /img\.alt = "";[\s\S]*?carte\.appendChild\(img\)/);
  assert.match(gameSource, /img\.src = asset\.src;\s*img\.alt = asset\.alt;/);
});

test('the Laboratory uses its dedicated building artwork', function() {
  assert.match(htmlSource, /id="section-laboratory"[\s\S]*?src="img\/Buildings\/Laboratory_Final\.png\?v=0\.0034" alt="Laboratory"/);
});

test('icon-only controls use explicit names while redundant icons stay silent', function() {
  assert.match(htmlSource, /class="bouton-settings"[^>]*aria-label="Open Settings"[^>]*>[\s\S]*?<img[^>]*alt=""/);
  assert.match(htmlSource, /id="bird-btn"[^>]*aria-label="Open the bird mini-game"[^>]*>[\s\S]*?<img[^>]*alt=""/);
  assert.match(htmlSource, /id="bird-debug-btn"[^>]*aria-label="Force a bird spawn for testing"[^>]*>[\s\S]*?<img[^>]*alt=""/);
  assert.match(gameSource, /class="manager-slot-remove" aria-label="Remove /);
  assert.match(gameSource, /class="work-recipe-cat-remove" aria-label="Remove /);
  assert.match(gameSource, /class="work-recipe-cat-empty"[\s\S]*?aria-label="Assign a Cat to /);
  assert.match(gameSource, /class="manager-slot-btn" aria-label="Assign a /);
});

test('the mobile exploration map fits its panel without horizontal overflow', function() {
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?:root\s*\{\s*--map-cell:\s*calc\(\(100vw - 64px\) \/ 7\);\s*\}/);
  [360, 390, 430].forEach(function(viewportWidth) {
    const panelContentWidth = viewportWidth - 12 - 34;
    const mapCellWidth = (viewportWidth - 64) / 7;
    const gridWidth = 18 + 7 * mapCellWidth;
    assert.ok(Math.abs(gridWidth - panelContentWidth) < 0.001, 'map should fit at ' + viewportWidth + 'px');
  });
});

test('mobile Exploration previews a zone before opening its dedicated mission workspace', function() {
  assert.match(htmlSource, /id="exploration-mobile-zone-header"[\s\S]*?onclick="retourCarteExplorationMobile\(\)"[\s\S]*?id="exploration-mobile-campaigns-tab"[\s\S]*?id="exploration-mobile-scoutings-tab"/);
  assert.match(gameSource, /function ouvrirZoneExplorationMobile\(\)[\s\S]*?explorationMobileVue = "zone"[\s\S]*?renderCampaignCards\(\)/);
  assert.match(gameSource, /function retourCarteExplorationMobile\(\)[\s\S]*?explorationMobileVue = "map"/);
  assert.match(gameSource, /ecrireTexte\(coordonnee, exploree \? zone\.id : ""\)/);
  assert.match(gameSource, /zone-info-mobile-done[\s\S]*?Campaign[\s\S]*?done/);
  assert.match(gameSource, /zone-info-mobile-available[\s\S]*?Campaign[\s\S]*?avail/);
  assert.match(gameSource, /zone-info-mobile-inactive[\s\S]*?Scouting[\s\S]*?inactive/);
  assert.match(gameSource, /campagnesZone\.length === 0 && scoutingsZone\.length === 0[\s\S]*?zone-info-mobile-empty">Empty/);
  assert.doesNotMatch(gameSource, /zone-info-mobile-ready/);
  assert.match(gameSource, /class="zone-info-mobile-summary"[\s\S]*?class="zone-info-open-btn" onclick="ouvrirZoneExplorationMobile\(\)">Open zone/);
  assert.match(cssSource, /#contenu-explorations:not\(\.exploration-mobile-zone-open\) > #section-explo-mission,[\s\S]*?#grille-campaigns-scoutings\s*\{[\s\S]*?display:\s*none !important/);
  assert.match(cssSource, /#contenu-explorations\.exploration-mobile-zone-open > #section-explo-map\s*\{\s*display:\s*none !important/);
  assert.match(cssSource, /\.exploration-mobile-zone-header\s*\{[\s\S]*?position:\s*sticky/);
});

test('navigation tabs use a stable flat rail with readable desktop icons', function() {
  assert.match(cssSource, /\.barre-onglets\s*\{[\s\S]*?gap:\s*0;[\s\S]*?background:\s*white;[\s\S]*?border-top:/);
  assert.match(cssSource, /\.onglet-icone\s*\{[\s\S]*?width:\s*54px;[\s\S]*?height:\s*54px;/);
  assert.match(cssSource, /\.onglet\s*\{[\s\S]*?height:\s*66px;[\s\S]*?border-bottom:\s*3px solid transparent;[\s\S]*?border-radius:\s*0;/);
  assert.match(cssSource, /\.onglet:active\s*\{\s*transform:\s*none;\s*\}/);
  assert.match(cssSource, /\.onglet-actif\s*\{[\s\S]*?border-bottom-color:\s*var\(--couleur-accent\);/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.onglet-icone\s*\{\s*width:\s*36px;\s*height:\s*36px;/);
});

test('desktop exploration enlarges the map and moves campaigns and scoutings to the right', function() {
  assert.match(cssSource, /@media \(min-width:\s*769px\)[\s\S]*?:root\s*\{\s*--map-cell:\s*clamp\(50px,[\s\S]*?100px\);\s*\}/);
  assert.match(cssSource, /#contenu-explorations\[aria-hidden="false"\]\s*\{[\s\S]*?display:\s*grid\s*!important;[\s\S]*?grid-template-columns:\s*minmax\(0, 1\.55fr\) minmax\(320px, 0\.85fr\)/);
  assert.match(cssSource, /#section-explo-map\s*\{[\s\S]*?grid-column:\s*1;/);
  assert.match(cssSource, /#grille-campaigns-scoutings\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?grid-template-columns:\s*1fr;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#explo-map-section\s*\{\s*flex-direction:\s*column;/);
});

test('map fog stays above the artwork and its optional drift remains safe to disable', function() {
  assert.doesNotMatch(cssSource, /\.carte-fog-overlay/);
  assert.doesNotMatch(gameSource, /function fogStyle\(p\)/);
  assert.doesNotMatch(gameSource, /function bgStyle\(p\)/);
  assert.match(gameSource, /class="carte-map-artwork"[\s\S]*?background-image:url/);
  assert.match(cssSource, /\.carte-map-artwork\s*\{[\s\S]*?background-size:\s*100% 100%/);
  assert.match(cssSource, /\.carte-avec-image\s*\{[\s\S]*?background-image:\s*none !important/);
  assert.match(gameSource, /const MAP_FOG_MOTION_ENABLED = true/);
  assert.match(gameSource, /classList\.toggle\("carte-fog-motion", MAP_FOG_MOTION_ENABLED\)/);
  assert.match(gameSource, /function renduFogGlobal\(\)[\s\S]*?class="carte-fog-global"[\s\S]*?mask id="carte-fog-global-mask"/);
  assert.match(gameSource, /renduFogGlobal\(\)[\s\S]*?fill="white" shape-rendering="crispEdges"[\s\S]*?fill="black" shape-rendering="crispEdges"/);
  assert.match(gameSource, /scale\(-1 1\)/);
  assert.match(gameSource, /filter id="carte-fog-seam-softener"[\s\S]*?feGaussianBlur[\s\S]*?stdDeviation="1\.8 0"/);
  assert.match(cssSource, /\.carte-fog-global\s*\{[\s\S]*?grid-column:\s*2 \/ 9;[\s\S]*?grid-row:\s*1 \/ 6;[\s\S]*?z-index:\s*4/);
  assert.match(cssSource, /\.carte-grille\.carte-fog-motion \.carte-fog-global-track\s*\{[\s\S]*?animation:\s*carte-fog-global-scroll 90s linear infinite;[\s\S]*?animation-delay:\s*var\(--fog-animation-delay, 0ms\)/);
  assert.match(cssSource, /\.carte-fog-secondary-track\s*\{[\s\S]*?opacity:\s*0\.25;[\s\S]*?transform:\s*translateX\(-42%\)/);
  assert.match(cssSource, /\.carte-grille\.carte-fog-motion \.carte-fog-secondary-track\s*\{[\s\S]*?animation:\s*carte-fog-global-scroll 140s linear infinite;[\s\S]*?animation-delay:\s*var\(--fog-secondary-animation-delay, 0ms\)/);
  assert.match(cssSource, /@keyframes carte-fog-global-scroll\s*\{[\s\S]*?translateX\(-66\.6666667%\)[\s\S]*?translateX\(0\)/);
  assert.match(gameSource, /const MAP_FOG_ANIMATION_DURATION_MS = 90000/);
  assert.match(gameSource, /const MAP_FOG_SECONDARY_DURATION_MS = 140000/);
  assert.match(gameSource, /setProperty\('--fog-animation-delay', '-' \+ phaseMs \+ 'ms'\)/);
  assert.match(gameSource, /setProperty\('--fog-secondary-animation-delay', '-' \+ secondaryPhaseMs \+ 'ms'\)/);
  assert.match(gameSource, /function actualiserSelectionCarte\(\)[\s\S]*?data-zone-part-id[\s\S]*?carte-selectionnee/);
  const mapClickSource = gameSource.slice(
    gameSource.indexOf('function clicZoneCarte(zoneId) {'),
    gameSource.indexOf('function retirerKittyExploZone(', gameSource.indexOf('function clicZoneCarte(zoneId) {'))
  );
  assert.match(mapClickSource, /actualiserSelectionCarte\(\);[\s\S]*?renduZoneInfo\(\);/);
  assert.doesNotMatch(mapClickSource, /carteDirty\s*=\s*true|renduCarte\(/);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.carte-fog-global-track/);
  assert.doesNotMatch(cssSource, /\.carte-verrouillee\s*\{[^}]*filter:\s*grayscale/);
  assert.match(cssSource, /\.carte-badge-inconnu\s*\{[\s\S]*?z-index:\s*5/);
  assert.match(cssSource, /\.carte-forest\.carte-multicel\.carte-inexploree \.carte-badge-inconnu[\s\S]*?left:\s*50%[\s\S]*?transform:\s*translate\(-50%, -50%\)/);
});

test('D1 and E1 retain their human-blocked house campaign placeholders', function() {
  ['searchLeftHouse', 'searchHomeHouse', 'searchRightHouse'].forEach(function(id) {
    assert.match(configSource, new RegExp(id + ':'));
  });
  assert.equal((configSource.match(/nom:\s*"Search the house"/g) || []).length, 2);
  assert.equal((configSource.match(/lockedReason:\s*"Human inside the house/g) || []).length, 3);
  assert.match(configSource, /searchLeftHouse:[\s\S]*?zone:\s*"C1"/);
  assert.match(configSource, /searchHomeHouse:[\s\S]*?zone:\s*"D1"/);
  assert.match(configSource, /searchRightHouse:[\s\S]*?zone:\s*"E1"/);
});

test('exploration map scouting status dots are highly visible', function() {
  const badge = cssSource.slice(cssSource.indexOf('.carte-badge-scout {'), cssSource.indexOf('.carte-badge-scout-actif'));
  assert.match(badge, /width:\s*24px/);
  assert.match(badge, /height:\s*24px/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.carte-badge-scout\s*\{[\s\S]*?width:\s*14px[\s\S]*?height:\s*14px/);
  assert.match(cssSource, /\.carte-badge-scout-actif\s*\{\s*background:\s*#48c774/);
  assert.match(cssSource, /\.carte-badge-scout-idle\s*\{\s*background:\s*#999/);
});

test('main sections expose one selected tab and one associated visible panel', function() {
  assert.match(htmlSource, /class="barre-onglets"[^>]*role="tablist"[^>]*aria-label="Main sections"/);
  assert.equal((htmlSource.match(/class="onglet(?: [^"]*)?" role="tab"/g) || []).length, 7);
  assert.equal((htmlSource.match(/id="contenu-(?:gang|work|buildings|facilities|explorations|inventaire|logs)" role="tabpanel"/g) || []).length, 7);
  ['gang', 'work', 'buildings', 'facilities', 'explorations', 'inventaire', 'logs'].forEach(function(id) {
    assert.match(htmlSource, new RegExp('id="onglet-' + id + '"[^>]*aria-controls="contenu-' + id + '"'));
    assert.match(htmlSource, new RegExp('id="contenu-' + id + '"[^>]*aria-labelledby="onglet-' + id + '"'));
  });
  assert.match(gameSource, /function changerOnglet\(id\)[\s\S]*?panneau\.setAttribute\("aria-hidden", actif \? "false" : "true"\)[\s\S]*?bouton\.setAttribute\("aria-selected", actif \? "true" : "false"\)[\s\S]*?bouton\.tabIndex = actif \? 0 : -1/);
  assert.match(gameSource, /function gererNavigationOnglets\(e\)[\s\S]*?ArrowRight[\s\S]*?ArrowLeft[\s\S]*?Home[\s\S]*?End[\s\S]*?changerOnglet/);
});

test('Gang refreshes kitty allocation labels when returning from Work', function() {
  assert.match(gameSource, /function changerOnglet\(id\)[\s\S]*?rendu\(\); \/\/ render the newly visible tab immediately instead of waiting for the next 100 ms tick[\s\S]*?if \(id === "gang"\) renduManagement\(\);/);
});

test('Food Management shows a per-Cat distribution recap', function() {
  assert.match(htmlSource, /id="food-distribution-modal"[\s\S]*?id="food-distribution-summary"/);
  assert.match(gameSource, /function afficherFoodDistributionRecap\(recap\)[\s\S]*?entry\.foodUnits[\s\S]*?entry\.levelUps/);
  assert.match(gameSource, /food-distribution-stats[\s\S]*?totalXp \+ ' XP distributed[\s\S]*?catsFedLabel/);
  assert.match(gameSource, /entry\.niveauAvant \+ " => " \+ entry\.kitty\.niveau/);
  assert.match(gameSource, /function distribuerFood\(mode\)[\s\S]*?var distributionRecap = etat\.kittiesData\.map/);
  assert.match(gameSource, /function consommerXp\(cible, forceSingle, recap\)[\s\S]*?recap\.foodUnits \+= units/);
  assert.match(gameSource, /function donnerXp\(k, xp, recap\)[\s\S]*?recap\.levelUps\+\+/);
  assert.match(gameSource, /renduManagement\(\);[\s\S]*?afficherFoodDistributionRecap\(distributionRecap\)/);
  assert.match(cssSource, /\.food-distribution-row\s*\{[\s\S]*?grid-template-columns:/);
});

test('Food Management keeps distribution explanations behind compact help buttons', function() {
  assert.match(gameSource, /function toggleFoodManagementHelp\(mode\)[\s\S]*?_foodMgmtHelp/);
  assert.match(gameSource, /class="fm-help-btn"[^>]*aria-label="Explain distribute evenly"/);
  assert.match(gameSource, /class="fm-help-btn"[^>]*aria-label="Explain prioritize low-level cats"/);
  assert.match(gameSource, /fm-help-detail[\s\S]*?Food is consumed in whole units/);
  assert.doesNotMatch(gameSource, /class="fm-rules"/);
  assert.doesNotMatch(cssSource, /\.fm-rules\s*\{/);
  assert.match(cssSource, /\.fm-action-option\s*\{[\s\S]*?display:\s*flex/);
  assert.match(cssSource, /\.fm-help-btn\s*\{[\s\S]*?flex:\s*0 0 30px/);
});

test('Auto-feed chooses the closest food combination and warns before overfeeding', function() {
  assert.match(gameSource, /function calculerPlanNourritureAuto\(xpCible\)/);
  assert.match(gameSource, /candidate\.units < nextPlans\[newTotal\]\.units/);
  assert.match(gameSource, /if \(plan\.surplus > 0 && etat\.avertirSurplusNourriture !== false\)/);
  assert.match(gameSource, /This will provide " \+ plan\.xpTotal/);
  assert.match(htmlSource, /id="toggle-overfood-warning"/);
  assert.match(gameSource, /function basculerAvertissementSurplusNourriture\(checked\)/);
  assert.match(saveSource, /avertirSurplusNourriture/);
});

test('Log views expose tab semantics and keyboard selection', function() {
  assert.match(htmlSource, /id="logs-souscontenu"[^>]*role="tablist"[^>]*aria-label="Log views"/);
  assert.match(htmlSource, /id="logs-subtab-log"[^>]*role="tab"[^>]*aria-controls="logs-vue-log"/);
  assert.match(htmlSource, /id="logs-subtab-stories"[^>]*role="tab"[^>]*aria-controls="logs-vue-stories"/);
  assert.match(htmlSource, /id="logs-vue-log"[^>]*role="tabpanel"[^>]*aria-labelledby="logs-subtab-log"/);
  assert.match(htmlSource, /id="logs-vue-stories"[^>]*role="tabpanel"[^>]*aria-labelledby="logs-subtab-stories"/);
  assert.match(gameSource, /function changerSousOngletLogs\(vue\)[\s\S]*?aria-hidden[\s\S]*?aria-selected[\s\S]*?tabIndex/);
  assert.match(gameSource, /function gererNavigationSousOngletsLogs\(e\)[\s\S]*?ArrowRight[\s\S]*?ArrowLeft[\s\S]*?Home[\s\S]*?End/);
  assert.match(htmlSource, />Log<[^\n]*>[\s\S]*?>Stories<|>Stories<[^\n]*>[\s\S]*?>Log</);
  assert.doesNotMatch(htmlSource, /class="logs-subtab[^\"]*"[^>]*>[^<]*[📜📖🐾🔓🎯]/);
  assert.doesNotMatch(htmlSource, /id="filtre-(?:event|unlock|objective)"[^>]*>[^<]*[📜📖🐾🔓🎯]/);
  assert.doesNotMatch(gameSource, /inv-learning-label[^\n]*[📖]/);
  assert.match(gameSource, /function retirerEmojisInterface\(texte\)[\s\S]*?replace\(\/\[\\u\{1F000\}-\\u\{1FAFF\}/);
  assert.match(gameSource, /createTextNode\(retirerEmojisInterface\(ligne\)\)/);
});

test('expandable stats and filter buttons expose their current state', function() {
  assert.match(htmlSource, /id="bouton-stats-attrapage"[^>]*aria-expanded="false"[^>]*aria-controls="popover-stats-attrapage"/);
  assert.match(htmlSource, /id="popover-stats-attrapage"[^>]*role="region"[^>]*aria-label="Recruiting stats"[^>]*aria-hidden="true"/);
  assert.match(htmlSource, /Raw recruiting time for this cat[\s\S]*Base time per second[\s\S]*1s\/s/);
  assert.match(htmlSource, /id="stat-wood-row"[\s\S]*Recruiting time per second from WOOD Houses[\s\S]*id="stat-wood"/);
  assert.match(htmlSource, /id="stat-stone-row"[\s\S]*Recruiting time increase from STONE Houses[\s\S]*id="stat-stone"/);
  assert.match(gameSource, /woodRow\.style\.display = catHouseDebloquee\(\) \? "" : "none"/);
  assert.match(gameSource, /stoneRow\.style\.display = stoneHousesDebloques\(\) \? "" : "none"/);
  assert.match(gameSource, /function definirStatsAttrapageOuvert\(ouvert\)[\s\S]*?aria-hidden[\s\S]*?aria-expanded[\s\S]*?Hide recruiting stats/);
  assert.match(gameSource, /const statsWrapper = domParId\("stats-attrapage-wrapper"\);[\s\S]*?ecrireStyle\(statsWrapper, "display", recruit \? "" : "none"\)/);
  assert.match(gameSource, /e\.key !== "Escape" \|\| !statsAttrapageOuvert[\s\S]*?definirStatsAttrapageOuvert\(false\)[\s\S]*?\.focus\(\)/);
  assert.match(gameSource, /function filtrerWork\(filtre\)[\s\S]*?setAttribute\("aria-pressed"/);
  assert.match(gameSource, /function toggleFiltreLogs\(type\)[\s\S]*?setAttribute\("aria-pressed"/);
  assert.match(gameSource, /class="inv-res-tabs" role="group" aria-label="Inventory categories"/);
  assert.match(gameSource, /availableTabs\.push\(\{\s*id: "books", label: "Books"\s*\}\)/);
  assert.match(gameSource, /availableTabs\.push\(\{\s*id: "unique", label: "Unique"\s*\}\)/);
});

test('Settings exposes the published game version separately from save and cache versions', function() {
  assert.match(htmlSource, /class="settings-version"[^>]*aria-label="Game version"[^>]*>Version <strong>v0\.0036<\/strong>/);
  assert.match(cssSource, /\.settings-version\s*\{[\s\S]*?text-align: center/);
  assert.doesNotMatch(gameSource, /SAVE_VERSION\s*=\s*['"]0\.0028/);
});

test('release notes are versioned, persisted and shown before the AFK summary', function() {
  assert.match(htmlSource, /id="ecran-release-notes"[\s\S]*?id="release-notes-list"/);
  assert.match(htmlSource, /js\/data\/changelog\.js\?v=0\.0036/);
  assert.match(gameSource, /const changelogData = globalThis\.CatInc\.data\.changelog/);
  assert.match(gameSource, /const GAME_RELEASE_VERSION = changelogData\.currentVersion/);
  assert.match(gameSource, /const GAME_RELEASE_NOTES = changelogData\.releases\[0\]\.categories/);
  assert.match(gameSource, /const GAME_CHANGELOG = changelogData\.releases/);
  assert.match(fs.readFileSync(path.join(root, 'js/data/changelog.js'), 'utf8'), /version: "0\.0035"/);
  const changelogSource = fs.readFileSync(path.join(root, 'js/data/changelog.js'), 'utf8');
  assert.match(changelogSource, /date: "2026-07-26"/);
  assert.match(changelogSource, /label: "New Features"[\s\S]*label: "Balancing"[\s\S]*label: "Quality of Life"[\s\S]*label: "Other"/);
  assert.match(changelogSource, /label: "Balancing"[\s\S]*Exploration missions now require an Explorator/);
  assert.match(changelogSource, /label: "Other"[\s\S]*D1 house description[\s\S]*Undiscovered zone names/);
  assert.match(changelogSource, /const pendingRelease = Object\.freeze\(\{[\s\S]*baseVersion: "0\.0036"/);
  assert.match(changelogSource, /pendingRelease: pendingRelease/);
  assert.match(changelogSource, /label: "Bug Fixes"[\s\S]*A Cat can no longer be assigned to more than one action/);
  const pendingSection = changelogSource.slice(changelogSource.indexOf('const pendingRelease = Object.freeze({'), changelogSource.indexOf('// Keep the newest release first.'));
  assert.doesNotMatch(pendingSection, /Story dialogue now gives Bernardo, Mochi and Luna clearer personalities/);
  assert.doesNotMatch(pendingSection, /Manual Focus power upgrades now cost 2 and 4/);
  assert.match(gameSource, /const changes = category\.changes \|\| \[\];[\s\S]*?if \(changes\.length === 0\) return/);
  assert.match(gameSource, /const formaterDateRelease = function\(date\)/);
  assert.match(gameSource, /What's new in v" \+ GAME_RELEASE_VERSION[\s\S]*?currentReleaseDate/);
  assert.match(gameSource, /releaseNotesSeenVersion/);
  assert.match(gameSource, /releaseNotesDeadline = Date\.now\(\) \+ 5000/);
  assert.match(gameSource, /else if \(releaseNotesNecessaires\(\)\)\s*\{\s*afficherNotesVersion\(lancerOuvertureInitiale\)/);
  assert.match(gameSource, /if \(resumeAbsence\) afficherResumeAbsence\(resumeAbsence\);/);
});

test('assignment audio and persistent volume controls are wired', function() {
  assert.match(htmlSource, /js\/ui\/audio\.js\?v=/);
  assert.match(htmlSource, /type="range"[^>]*id="settings-sfx-volume"/);
  assert.match(htmlSource, /type="range"[^>]*id="settings-music-volume"/);
  assert.match(htmlSource, /gererVolumeAudio\('sfx', this\.value\)/);
  assert.match(htmlSource, /gererVolumeAudio\('music', this\.value\)/);
  assert.match(cssSource, /\.settings-volume-row input\[type="range"\][\s\S]*?accent-color/);
  assert.match(audioSource, /Sounds\/Meows\/Meow Normal\.mp3/);
  assert.match(audioSource, /Sounds\/Meows\/Meow Purr\.mp3/);
  assert.match(audioSource, /Sounds\/Meows\/Meow Strong\.mp3/);
  assert.match(audioSource, /Sounds\/Bird\/Bird Wing Flaps\.mp3/);
  assert.match(audioSource, /Sounds\/Other\/Exploration Reveal\.mp3/);
  assert.match(audioSource, /Sounds\/Other\/Reward Chest\.mp3/);
  assert.match(audioSource, /music: "Sounds\/Music\/Base Music Test\.ogg"/);
  assert.match(audioSource, /musicAudio\.loop = true/);
  assert.match(audioSource, /startMusic: function\(volume\)/);
  assert.match(audioSource, /setMusicVolume: function\(volume\)/);
  assert.match(audioSource, /assignmentMeowIndex === 0 \? SOURCES\.meowNormal : SOURCES\.meowStrong/);
  assert.match(audioSource, /play\(SOURCES\.meowPurr, volume\)/);
  assert.match(gameSource, /function jouerSonAffectation\(\)[\s\S]*?volumeEffetsSonores/);
  assert.match(gameSource, /function jouerSonMiaulement\(\)[\s\S]*?playCatMeow/);
  assert.match(gameSource, /function jouerSonAilesOiseau\(\)[\s\S]*?playBirdWingFlaps/);
  assert.match(gameSource, /function jouerSonRevelationExploration\(\)[\s\S]*?playExplorationReveal/);
  assert.match(gameSource, /function jouerSonRewardChest\(\)[\s\S]*?playRewardChest/);
  assert.match(gameSource, /function recupererButinScouting\(scoutingId\)[\s\S]*?jouerSonRewardChest\(\)/);
  assert.match(gameSource, /function recupererRecompenseCampaign\(campaignId\)[\s\S]*?jouerSonRewardChest\(\)/);
  assert.match(gameSource, /function revelerZoneExploree\(zoneId\)[\s\S]*?jouerSonRevelationExploration\(\)/);
  assert.match(gameSource, /function demarrerMusiqueAmbiante\(\)[\s\S]*?startMusic\(etat\.volumeMusique\)/);
  assert.match(gameSource, /if \(canal === "music"\)[\s\S]*?setMusicVolume\(value\)/);
  assert.match(gameSource, /function terminerSequence\(\)[\s\S]*?jouerSonMiaulement\(\)/);
  assert.match(gameSource, /function montrerOiseau\(\)[\s\S]*?jouerSonAilesOiseau\(\)/);
  assert.match(gameSource, /function gererVolumeAudio\(canal, rawValue\)[\s\S]*?sauvegarder\(\)/);
  assert.match(gameSource, /function assignerWorkerSlot\(kittyIndex\)[\s\S]*?jouerSonAffectation\(\)/);
  assert.match(gameSource, /function selectionnerKittySlot\(kittyIndex\)[\s\S]*?jouerSonAffectation\(\)/);
  assert.match(gameSource, /function assignerManager\(famille, kittyIndex\)[\s\S]*?jouerSonAffectation\(\)/);
  assert.match(gameSource, /function selectionnerKittyFormation\(kittyIndex\)[\s\S]*?jouerSonAffectation\(\)/);
  assert.match(gameSource, /function selectionnerKittySpec\(kittyIndex\)[\s\S]*?jouerSonAffectation\(\)/);
});

test('mobile recruiting stats stay inside the viewport', function() {
  assert.match(gameSource, /function positionnerStatsAttrapagePopover\(\)[\s\S]*?window\.innerWidth <= 768[\s\S]*?popover\.style\.left = "8px"[\s\S]*?popover\.style\.right = "8px"/);
  assert.match(gameSource, /function definirStatsAttrapageOuvert\(ouvert\)[\s\S]*?positionnerStatsAttrapagePopover\(\)/);
  assert.match(cssSource, /\.popover-stats\s*\{[\s\S]*?min-width:\s*390px;[\s\S]*?max-width:\s*430px;/);
  assert.match(cssSource, /\.popover-ligne span:first-child\s*\{[\s\S]*?white-space:\s*nowrap;/);
});

test('scouting cards explain reward luck in a compact responsive block', function() {
  assert.match(gameSource, /function renduRecompensesLuckScouting\(sc, kittyIndex\)/);
  assert.match(gameSource, /sc\.recompenseRange\.map\(function\(entry\)[\s\S]*?recompense: sc\.recompense/);
  assert.match(gameSource, /Regular Reward[\s\S]*?chance \+ '%<\/span>/);
  assert.doesNotMatch(gameSource, /chance \+ '% chance'/);
  assert.match(gameSource, /renduRecompensesLuckScouting\(sc, scKiDisp\)/);
  assert.match(gameSource, /data-res-id="inv-res-canned-cat-food"/);
  assert.match(gameSource, /scouting-reward-stock-icon[\s\S]*?toggleResPopup\(this,event\)/);
  assert.match(gameSource, /var rewardQuantity = isCannedCatFood \? ''/);
  assert.doesNotMatch(gameSource, /rewardLabel = dispTable\.map/);
  assert.match(cssSource, /\.scouting-reward-table\s*\{[\s\S]*?grid-template-columns: repeat\(3/);
  assert.match(cssSource, /\.scouting-reward-option \+ \.scouting-reward-option\s*\{\s*border-left/);
  assert.match(cssSource, /\.scouting-reward-heading\s*\{[\s\S]*?justify-content: space-between/);
  assert.match(cssSource, /\.scouting-reward-quantity\s*\{[\s\S]*?overflow-wrap: anywhere/);
  assert.match(cssSource, /\.scouting-reward-quantity\s*\{[\s\S]*?color: var\(--couleur-texte\)/);
  assert.match(cssSource, /\.scouting-reward-option strong\s*\{[\s\S]*?white-space: nowrap/);
  assert.match(cssSource, /@media \(max-width: 600px\)[\s\S]*?scouting-reward-table[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(cssSource, /\.scouting-reward-stock-icon\s*\{[\s\S]*?background: transparent/);
  assert.match(cssSource, /\.scouting-reward-stock img\s*\{[\s\S]*?width: 36px[\s\S]*?height: 36px/);
  assert.doesNotMatch(cssSource, /\.scouting-reward-stock\s*\{[^}]*border-left:/);
  assert.match(cssSource, /\.scouting-luck\s*\{[\s\S]*?border-top: 1px solid/);
  const rewardCode = extraire('function appliquerRecompense(recompenseId, recompenseQty)', 'let itemSelectionne');
  assert.doesNotMatch(rewardCode, /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
});

test('Gang selects the first valid kitty without forcing open the mobile detail view', function() {
  assert.match(gameSource, /let kittySelectionnee = null;\s*let detailKittyMobileOuvert = false;/);
  assert.match(gameSource, /if \(kittySelectionnee === null \|\| !etat\.kittiesData\[kittySelectionnee\]\) \{\s*kittySelectionnee = 0;\s*detailKittyMobileOuvert = false;/);
  assert.match(gameSource, /layout\.classList\.toggle\("affiche-detail-mobile", detailKittyMobileOuvert\)/);
  assert.match(gameSource, /function deselectionnerKitty\(\) \{\s*detailKittyMobileOuvert = false;[\s\S]*?\.kitty-carte\[data-kitty-index/);
  assert.match(gameSource, /function etatVideHtml\(titre, description\)/);
  assert.match(gameSource, /No profile yet/);
  assert.match(gameSource, /if \(jobCenterDebloquee\(\)\) \{[\s\S]*?entete\.textContent = "JOBLESS"/);
  assert.doesNotMatch(gameSource, /entete\.textContent = "Unassigned"/);
});

test('returning to Gang on mobile always opens the global roster view', function() {
  assert.match(gameSource, /function changerOnglet\(id\)[\s\S]*?const estMobile = window\.matchMedia\("\(max-width: 768px\)"\)\.matches[\s\S]*?id === "gang" && estMobile[\s\S]*?detailKittyMobileOuvert = false/);
  assert.match(gameSource, /function changerOnglet\(id\)[\s\S]*?if \(id === "gang"\) renduManagement\(\)/);
});

test('Work teaches resource details and states each early workshop requirement', function() {
  assert.match(htmlSource, /id="work-discovery-hint"[^>]*role="note"[\s\S]*?How Work works[\s\S]*?select a recipe[\s\S]*?gathers the ingredients[\s\S]*?processes the finished resource/);
  assert.match(htmlSource, /id="work-discovery-hint"[\s\S]*?class="work-discovery-hint-close"[^>]*aria-label="Dismiss Work help"/);
  assert.match(gameSource, /function fermerWorkDiscoveryHint\(\)[\s\S]*?localStorage\.setItem\("workDetailsHintSeen", "1"\)[\s\S]*?work-discovery-hint/);
  assert.match(gameSource, /function ouvrirModalRecette\(familyId, slotIdx\)/);
  assert.match(gameSource, /Changing this recipe will discard its gathered input and current progress/);
  assert.match(htmlSource, /id="work-confirm-modal"[^>]*role="dialog"[\s\S]*?id="work-confirm-copy"[\s\S]*?id="work-confirm-cancel"[\s\S]*?id="work-confirm-accept"/);
  assert.match(gameSource, /function ouvrirConfirmationTravail\(titre, message, action, libelleAction\)[\s\S]*?ouvrirDialogueModal\("work-confirm-modal"/);
  assert.match(gameSource, /function ouvrirConfirmationTravail\(titre, message, action, libelleAction\)[\s\S]*?fermerDialogueModal\("recipe-modal"\)[\s\S]*?ouvrirDialogueModal\("work-confirm-modal"/);
  assert.match(gameSource, /function annulerConfirmationTravail\(\)[\s\S]*?confirmation\.restaurerRecette[\s\S]*?requestAnimationFrame\(afficherDialogueRecette\)/);
  assert.doesNotMatch(gameSource, /slot\.recipeId && slot\.kittyIndex !== null && !confirm\(/);
  assert.match(gameSource, /ouvrirConfirmationTravail\([\s\S]*?"Change recipe\?"[\s\S]*?appliquerSelectionRecette\(familyId, slotIdx, recipeId\)/);
  assert.match(cssSource, /\.work-confirm-modal \.explo-modal-panneau\s*\{[\s\S]*?width:\s*min\(420px, 90vw\)/);
  assert.match(cssSource, /\.work-confirm-modal\s*\{\s*z-index:\s*2100;/);
  assert.match(cssSource, /\.explo-modal-panneau\s*\{[\s\S]*?z-index:\s*1;/);
  assert.match(gameSource, /const proposeWorker = slot\.kittyIndex === null;[\s\S]*?fermerModalRecette\(\);[\s\S]*?if \(proposeWorker\) ouvrirModalWorkerRecette\(familyId, slotIdx\)/);
  assert.match(gameSource, /<button type="button" class="work-recipe-selected" aria-label="Change recipe in slot/);
  assert.match(cssSource, /\.work-recipe-selected > \*\s*\{\s*pointer-events:\s*none;/);
  assert.match(cssSource, /\.recipe-modal-clear\s*\{[^}]*min-height:\s*44px;[^}]*touch-action:\s*manipulation;/);
  assert.match(gameSource, /localStorage\.setItem\("workDetailsHintSeen", "1"\)/);
  assert.match(cssSource, /\.work-recipe-flow\s*\{[\s\S]*?grid-template-columns:/);
});

test('changing a recipe Cat preserves the slot cycle until the recipe changes', function() {
  const assign = extraire('function assignerWorkerSlot(kittyIndex)', 'function retirerWorkerRecette');
  assert.match(assign, /slot\.kittyIndex = kittyIndex/);
  assert.doesNotMatch(assign, /viderProgressionRecette\(slot\)/);

  const remove = extraire('function retirerWorkerRecette(familyId, slotIdx)', 'function renduJobCenter');
  assert.match(remove, /slot\.kittyIndex = null/);
  assert.doesNotMatch(remove, /reinitialiserProgressionRecette\(slot, false\)/);

  const move = extraire('function retirerKittyDeSesRoles(kittyIdx)', 'function forcerWorkerRecette');
  assert.match(move, /if \(slot\.kittyIndex === kittyIdx\) slot\.kittyIndex = null/);
  assert.doesNotMatch(move, /reinitialiserProgressionRecette\(slot, false\)/);

  const change = extraire('function appliquerSelectionRecette(familyId, slotIdx, recipeId)', 'function retirerRecetteSelectionnee');
  assert.match(change, /viderProgressionRecette\(slot\)/);
});

test('removing a recipe Cat keeps the paused Processing percentage visible', function() {
  assert.match(gameSource, /function progressionsSlotRecette\(slot, pair\)[\s\S]*?if \(!slot \|\| !pair\) return empty/);
  assert.match(gameSource, /function retirerWorkerRecette\(familyId, slotIdx\)[\s\S]*?slot\.kittyIndex = null[\s\S]*?sauvegarder\(\); rendu\(\)/);
  assert.doesNotMatch(gameSource, /function progressionsSlotRecette\(slot, pair\)[\s\S]*?slot\.kittyIndex === null\) return empty/);
});

test('early production milestones match the current tutorial sequence', function() {
  assert.match(gameSource, /id: "firstWoodcatter", label: "Choose the Cardboard Planks recipe"[\s\S]*?recetteChoisieCount\("cardboardPlanks"\) >= 1/);
  assert.match(gameSource, /function scierieDebloquee\(\)\s*\{ return catheringDebloquee\(\); \}/);
  assert.match(gameSource, /function catchenDebloquee\(\)\s*\{ return grasscattingDebloquee\(\); \}/);
  assert.match(gameSource, /function brickfactoryDebloquee\(\)\s*\{ return pebblegatheringDebloquee\(\); \}/);
  assert.match(configSource, /pebblegathering: \{ deblocageA: 6,/);
  assert.match(configSource, /pebblegathering: \{ deblocageA: 6,\s+secondesParUnite: 180 \}/);
  assert.match(configSource, /brickfactory: \{[\s\S]*?secondesParBrique: 900,/);
  assert.match(configSource, /secondesParPebble: 90/);
  assert.match(configSource, /basicWoodcatting: \{ secondesParUnite: 300 \}/);
  assert.match(configSource, /rockgathering:\s+\{ secondesParUnite: 900 \}/);
  assert.match(configSource, /secondesParBrique: 4500/);
  assert.match(configSource, /secondesParPlanche:\s+1500/);
  assert.match(configSource, /fishcatting:\s+\{ secondesParUnite: 600 \}/);
  assert.match(configSource, /secondesParRecette: 3000/);
  assert.match(gameSource, /id: "sevenKitties", label: "Recruit 6 cats to unlock Pebble Gathering"[\s\S]*?accompli: function\(e\) \{ return e\.chatons >= 6; \}/);
  assert.match(gameSource, /id: "firstPebbleGatherer", label: "Choose the Pebble Bricks recipe"[\s\S]*?visible:\s*function\(e\) \{ return e\.chatons >= 6; \}/);
  assert.match(gameSource, /function buildingsDebloques\(\)[\s\S]*?objectifsComplis\.includes\("firstPlank"\)/);
  assert.match(gameSource, /id: "feedBernardo", label: "Feed Bernardo to reach level 1"[\s\S]*?k\.nom === "Bernardo" && k\.niveau >= 1/);
  assert.match(gameSource, /feedBernardo:\s*\{ ordre:\s*145,\s*onglet:\s*"gang",\s*cible:\s*"#detail-experience"/);
  assert.match(gameSource, /objectifId === "feedBernardo"[\s\S]*?kittySelectionnee = bernardoIndex[\s\S]*?detailKittyMobileOuvert = true/);
  assert.match(gameSource, /if \(guide\.onglet === "gang"\) renduManagement\(\);/);
  assert.match(gameSource, /<div class='detail-section' id='detail-experience'>/);
  assert.match(gameSource, /id: "firstPebbleGatherer", label: "Choose the Pebble Bricks recipe"/);
  assert.match(gameSource, /function explorationDebloquee\(\)\s*\{ return etat\.chatons >= 8; \}/);
  assert.match(gameSource, /id: "sixKitties", label: "Recruit 8 cats to unlock Explorations"[\s\S]*?accompli: function\(e\) \{ return e\.chatons >= 8; \}/);
  assert.match(gameSource, /if \(etat\.chatons === 8\) \{[\s\S]*?Explorations unlocked!/);
  assert.match(htmlSource, /There are eight of us[\s\S]*?a proper crew\./);
});

test('unlock notifications stay one-shot after their persistent milestones', function() {
  assert.match(gameSource, /cardboardPlanksAvant < 1 && etat\.cardboardPlanks >= 1[\s\S]*?&&\s*!etat\.objectifsComplis\.includes\("firstPlank"\)/);
});

test('Wood Cathouse objective remains visible while Basic Wood is consumed', function() {
  assert.match(gameSource, /id: "buildRealCathouse", label: "Build a Wood Cathouse to boost recruit speed"[\s\S]*?visible:\s*function\(e\) \{ return e\.basicWoodTotalRecolte >= 1 \|\| e\.cathouseCount > 0; \}/);
  assert.doesNotMatch(gameSource, /id: "buildRealCathouse"[\s\S]{0,220}?visible:\s*function\(e\) \{ return e\.basicWood >= 1/);
});

test('Basic Wood unlock receives a persistent tier-introduction story', function() {
  assert.match(htmlSource, /id="ecran-story-basic-wood"[\s\S]*?Resources have multiple tiers[\s\S]*?Put that wood to work!/);
  assert.match(gameSource, /"ecran-story-basic-wood":\s*\{ type: "icon",\s*src: "img\/resources\/Basic Wood_Final\.png/);
  assert.match(gameSource, /id: "ecran-story-basic-wood", nom: "Beyond Cardboard", flag: "storyBasicWoodVue"/);
  assert.match(gameSource, /cardboardPlanksTotalAvant < 10 && etat\.cardboardPlanksTotalProduit >= 10[\s\S]*?marquerStoryVue\("storyBasicWoodVue"\)[\s\S]*?afficherModal\("ecran-story-basic-wood"\)/);
  assert.match(gameSource, /id: "tenPlanks", label: "Produce 10 Cardboard Planks to unlock Basic Wood"[\s\S]*?accompli: function\(e\) \{ return e\.cardboardPlanksTotalProduit >= 10/);
});

test('mobile sub-navigation stays above the main tab bar', function() {
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?--hauteur-onglets-principaux-mobile:\s*61px;[\s\S]*?--hauteur-sous-onglets-mobile:\s*48px;[\s\S]*?--hauteur-work-sous-onglets-mobile:\s*48px;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.barre-onglets\s*\{[\s\S]*?height:\s*var\(--hauteur-navigation-mobile\);/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.work-subnav\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*var\(--hauteur-navigation-mobile\);[\s\S]*?height:\s*var\(--hauteur-work-sous-onglets-mobile\);/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.work-filtres-btns\s*\{\s*grid-template-columns:\s*repeat\(4,/);
  assert.match(gameSource, /class=\"gang-subtab btn-filtre-work[\s\S]*?btn-filtre-work-actif/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.gang-subtabs\[data-has-tabs=\"true\"\]\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*var\(--hauteur-navigation-mobile\);/);
  assert.match(htmlSource, /id="facilities-subtabs"[\s\S]*?>Jobs<\/button>[\s\S]*?>Train<\/button>[\s\S]*?>Lab<\/button>/);
  assert.match(gameSource, /function actualiserSousOngletsFacilities\(u\)[\s\S]*?const sousOngletsVisibles = !!u\.trainingCenter[\s\S]*?u\.laboratory \? "3" : "2"/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.facilities-subtabs\[data-has-tabs="true"\]\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*var\(--hauteur-navigation-mobile\);/);
  assert.doesNotMatch(htmlSource, /id="filtre-work-(?:gathering|processing)"/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.inv-res-tabs\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*var\(--hauteur-navigation-mobile\);/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#logs-souscontenu\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?bottom:\s*var\(--hauteur-navigation-mobile\);/);
  assert.match(cssSource, /body\[data-onglet-actif="work"\] #panneau-objectifs[\s\S]*?bottom:\s*calc\(var\(--hauteur-navigation-mobile\) \+ var\(--hauteur-work-sous-onglets-mobile\)/);
  assert.match(htmlSource, /class="barre-onglets"[\s\S]*?id="work-boost-indicator"/);
  assert.match(htmlSource, /id="work-boost-indicator"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(cssSource, /#work-boost-indicator\s*\{[\s\S]*?width:\s*100%;[\s\S]*?text-align:\s*center;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#work-boost-indicator\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?top:\s*var\(--hauteur-top-bar\);/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?body\.work-boost-actif #top-bar\s*\{\s*margin-bottom:\s*var\(--hauteur-work-boost-mobile\);/);
  assert.match(gameSource, /var boostActif = !!\(etat\.workBoostFinTs && Date\.now\(\) < etat\.workBoostFinTs\);[\s\S]*?classList\.toggle\("work-boost-actif", boostActif\)/);
  assert.match(gameSource, /function actualiserHauteurTopBar\(\)[\s\S]*?ResizeObserver\(actualiserHauteurTopBar\)/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.titre\s*\{\s*display:\s*none;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.settings-logo-mobile\s*\{[\s\S]*?display:\s*block;/);
  assert.match(htmlSource, /class="settings-logo-mobile"[^>]*alt="Cat Inc"/);
  assert.match(htmlSource, />Save now<\/button>[\s\S]*?>Export save \(\.txt\)<\/button>[\s\S]*?>Import save \(\.txt\)<\/button>/);
  assert.match(cssSource, /body\.interface-compacte \.titre\s*\{\s*display:\s*none;/);
  assert.match(cssSource, /body\.interface-compacte \.info-subtile\s*\{\s*display:\s*none;/);
  assert.match(gameSource, /SEUIL_COMPACTAGE_ENTETE_MOBILE = 48[\s\S]*?SEUIL_DECOMPACTAGE_ENTETE_MOBILE = 8/);
  assert.match(gameSource, /function gererDensiteMobileAuScroll\(\)[\s\S]*?contenuPrincipal\.scrollTop[\s\S]*?!estCompacte && position > SEUIL_COMPACTAGE_ENTETE_MOBILE[\s\S]*?estCompacte && position < SEUIL_DECOMPACTAGE_ENTETE_MOBILE/);
  assert.doesNotMatch(gameSource, /classList\.toggle\("interface-compacte", position > 32\)/);
  assert.match(gameSource, /document\.addEventListener\("scroll", gererDensiteMobileAuScroll, true\)/);
});

test('mobile Work and recruitment controls use the compact family-aware layout', function() {
  assert.match(htmlSource, /id="onglet-buildings"[\s\S]*?data-mobile-label="Houses"[\s\S]*?>Houses<\/span>/);
  assert.match(htmlSource, /id="btn-unaffect-all"/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.stats-attrapage-wrapper\s*\{\s*order:\s*1;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#bouton-sequence\s*\{\s*order:\s*2;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?body #conteneur-barre-sequence\s*\{\s*order:\s*3;[\s\S]*?width:\s*auto;[\s\S]*?margin-inline:\s*0;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.bouton-settings\s*\{\s*order:\s*4;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?#gang-leader-banner\s*\{\s*display:\s*none\s*!important;/);
  assert.match(cssSource, /body\[data-work-filter="wood"\] #famille-wood \.work-recipe-family-header > div:first-child/);
  assert.match(gameSource, /const summaryVisible = workFiltre === "all";[\s\S]*?btn-unaffect-all[\s\S]*?summaryVisible/);
  assert.match(gameSource, /document\.body\.dataset\.workFilter = workFiltre/);
  assert.match(gameSource, /procLabel: "Catnip Salad"/);
  assert.match(gameSource, /catchen: "Catnip Salad"/);
  assert.match(contentSource, /"inv-res-salads":\s*\{[\s\S]*?nom:\s*"Catnip Salad"/);
});

test('Work recipes expose private Gathering then Processing slots', function() {
  assert.match(htmlSource, /id="filtre-work-all"[\s\S]*?id="filtre-work-wood"[\s\S]*?id="filtre-work-food"[\s\S]*?id="filtre-work-rock"/);
  assert.match(gameSource, /const slots = etat\.workRecipeSlots\[familyId\] \|\| \[\][\s\S]*?const slotsHtml = slots\.map\(function\(slot, slotIdx\)[\s\S]*?recipe-slot-' \+ familyId \+ '-' \+ slotIdx/);
  assert.match(gameSource, /pair-family-kicker">Production family<\/span><h2>' \+ family\.label \+ '<\/h2><\/div>/);
  assert.doesNotMatch(gameSource, /Select what each Cat should produce/);
  assert.match(gameSource, /class="work-recipe-resource work-recipe-resource-input'[\s\S]*?class="work-recipe-cat"[\s\S]*?class="work-recipe-resource work-recipe-resource-output'/);
  assert.match(gameSource, /work-recipe-node-kicker">GATHERING<\/span>/);
  assert.match(gameSource, /work-recipe-node-kicker">PROCESSING<\/span>/);
  assert.match(gameSource, /Gather Production Bonus/);
  assert.match(gameSource, /Process Production Bonus/);
  assert.match(gameSource, /function tickWorkRecipes\(dt, manualFocusAutorise\)[\s\S]*?avancerRecetteSlot/);
  assert.match(gameSource, /function reinitialiserProgressionRecette\(slot, retirerRecette\)[\s\S]*?viderProgressionRecette\(slot\)[\s\S]*?slot\.kittyIndex = null/);
  assert.match(gameSource, /function tauxProductionSlotRecette\(pair, slot\)[\s\S]*?productionProcBonus\(kitty\) \/ cycleDuration/);
  assert.match(gameSource, /function tauxConsommationRessource\(\) \{ return 0; \}/);
  assert.match(gameSource, /ouvrirModalWorkerRecette\(source\.family, slotIdx\)/);
  assert.match(gameSource, /work-recipe-resource-input'[\s\S]*?style="--fill:' \+ Math\.round\(progress\.gathering \* 100\)/);
  assert.match(gameSource, /work-recipe-resource-output'[\s\S]*?style="--fill:' \+ Math\.round\(progress\.processing \* 100\)/);
  assert.match(gameSource, /kitty \? formaterTemps\(gatherDuration\) \+ ' \(1 every ' \+ formaterTemps\(gatherUnitDuration\)/);
  assert.match(gameSource, /: 'Input'/);
  assert.match(gameSource, /work-recipe-output-progress">' \+ Math\.round\(progress\.processing \* 100\) \+ '%<\/span>/);
  assert.match(gameSource, /formaterTemps\(processingDuration\) \+ ' for ' \+ libelleNombreDecimal\(outputPerCycle, 2\)/);
  assert.match(gameSource, /work-recipe-cat-rate">' \+ libelleNombreDecimal\(outputRate \* 60, 2\) \+ '\/min/);
  assert.match(gameSource, /const fullCycleDuration = durations \? durations\.cycle : Infinity/);
  assert.match(gameSource, /work-recipe-cat-cycle">Cycle: ' \+ formaterTemps\(fullCycleDuration\)/);
  assert.match(gameSource, /data-work-phase="gather" aria-controls="inv-res-popup" aria-expanded="false" onclick="toggleWorkResourcePopup\(this,event\)"/);
  assert.match(gameSource, /data-work-phase="process" aria-controls="inv-res-popup" aria-expanded="false" onclick="toggleWorkResourcePopup\(this,event\)"/);
  assert.match(gameSource, /function workResourceDetails\(pair, slot, phase, familyId, slotIdx\)[\s\S]*?Current speed bonus/);
  assert.match(gameSource, /function workResourceDetailsHtml\(details, spriteSrc\)[\s\S]*?Adjusted time for one cycle/);
  assert.doesNotMatch(gameSource, /Adjusted production/);
  assert.match(gameSource, /function toggleWorkResourcePopup\(el, evt\)[\s\S]*?showWorkResourcePopup\(el\)/);
  assert.doesNotMatch(gameSource, /A Work resource popup is tied to the rendered slot card[\s\S]*?hideResPopup\(\)/);
  assert.match(cssSource, /\.work-production-popup\s*\{[\s\S]*?max-height:/);
  assert.doesNotMatch(gameSource, /work-recipe-phase-track/);
  assert.doesNotMatch(gameSource, /work-recipe-phase/);
  assert.match(cssSource, /\.work-recipe-cat-rate\s*\{[^}]*font-size:\s*\.7rem;/);
  assert.match(cssSource, /\.work-recipe-cat-cycle\s*\{[^}]*font-size:\s*\.56rem;/);
  assert.doesNotMatch(gameSource, /Production [/] cycle/);
  assert.match(gameSource, /class="work-recipe-cat-ring"[\s\S]*?--prog:' \+ progress\.overall/);
  assert.match(gameSource, /class="work-recipe-cat-face"' \+ attributsActivationClavier\("Change " \+ kitty\.nom \+ " assigned to this recipe"\)/);
  assert.match(gameSource, /class="work-recipe-cat-face"[\s\S]*?onclick="ouvrirModalWorkerRecette/);
  assert.match(cssSource, /\.work-recipe-cat-face\[data-clavier-clic\]\s*\{[\s\S]*?cursor:\s*pointer/);
  assert.match(cssSource, /\.work-recipe-resource::before\s*\{[\s\S]*?clip-path:\s*inset\(calc\(100% - var\(--fill, 0%\)\) 0 0\);/);
  assert.match(cssSource, /\.work-recipe-resource-input::before\s*\{\s*background:\s*#dcebcf;/);
  assert.match(cssSource, /\.work-recipe-resource-output::before\s*\{\s*background:\s*#f4d4b8;/);
});

test('Manual Focus follows one recipe cycle and resets when another recipe is focused', function() {
  assert.match(htmlSource, /id="ecran-story-manual-focus"[\s\S]*?stores 0\.8 seconds of ×2 speed, up to 30 seconds[\s\S]*?ouvrirManualFocusDepuisStory\(\)/);
  assert.match(gameSource, /const WORK_MANUAL_FOCUS_BASE_MULTIPLIER = 2;[\s\S]*?const WORK_MANUAL_FOCUS_BASE_SECONDS_PER_CLICK = 0\.8;[\s\S]*?const WORK_MANUAL_FOCUS_BASE_MAX_SECONDS = 30;/);
  assert.match(gameSource, /function manualFocusDebloque\(\) \{\s*return etat\.chatons >= 4;/);
  assert.match(gameSource, /reserveSeconds:\s*Math\.min\([\s\S]*?manualFocusMaxSeconds\(\),[\s\S]*?reserve \+ manualFocusSecondsPerClick\(\)/);
  assert.match(gameSource, /const memeRecette = !!workManualFocus[\s\S]*?const reserve = memeRecette \? synchroniserReserveManualFocus\(now\) : 0;/);
  assert.match(gameSource, /function synchroniserReserveManualFocus\(now\)[\s\S]*?workManualFocus\.phase = phaseActiveRecette\(slot\);[\s\S]*?workManualFocus\.lastDrainTs = now;/);
  assert.match(gameSource, /const gatherTrigger = gatherFocusable[\s\S]*?Apply Manual Focus to Gathering/);
  assert.match(gameSource, /const produceTrigger = processFocusable[\s\S]*?Apply Manual Focus to Processing/);
  assert.match(gameSource, /class="work-recipe-info-btn"[\s\S]*?data-work-phase="gather"/);
  assert.match(gameSource, /class="work-recipe-info-btn"[\s\S]*?data-work-phase="process"/);
  assert.match(gameSource, /function tickWorkRecipes\(dt, manualFocusAutorise\)[\s\S]*?manualFocusAutorise[\s\S]*?gatheringManualSpeed:\s*1,\s*processingManualSpeed:\s*1/);
  assert.match(gameSource, /phaseActiveRecette\(slot\) !== phaseAvant \|\| result\.completedCycles > 0[\s\S]*?poursuivreFocusManuelWork/);
  assert.match(gameSource, /tickWorkRecipes\(vitesse \* TICK_DT \* workBoostMult\(\), true\)/);
  assert.doesNotMatch(gameSource, /function changerOnglet\(id\)[\s\S]*?if \(id !== "work"\) annulerFocusManuelWork\(\)/);
  assert.match(gameSource, /const resultatsRecettes = tickWorkRecipes\(dt\);/);
  assert.match(gameSource, /function manualFocusBadgeHtml\(actif, reserve\)[\s\S]*?work-manual-focus-track[\s\S]*?work-manual-focus-fill/);
  assert.match(cssSource, /\.work-manual-focus-active\s*\{[\s\S]*?overflow:\s*visible/);
  assert.match(cssSource, /\.work-manual-focus-active::after\s*\{[\s\S]*?inset:\s*-2px[\s\S]*?animation:\s*work-manual-focus-pulse/);
  assert.match(cssSource, /@keyframes work-manual-focus-pulse\s*\{[\s\S]*?0%, 100% \{ opacity: \.56; \}[\s\S]*?50% \{ opacity: 1; \}/);
  assert.match(cssSource, /\.work-manual-focus-low \.work-manual-focus-fill\s*\{\s*background:/);
  assert.match(cssSource, /\.work-manual-focus-badge\s*\{[\s\S]*?font-size:\s*\.47rem !important;[\s\S]*?line-height:\s*1\.05/);
  assert.match(cssSource, /@media \(max-width: 600px\)[\s\S]*?body \.work-manual-focus-badge[\s\S]*?font-size:\s*\.43rem !important/);
  assert.match(cssSource, /\.work-recipe-info-btn\s*\{[\s\S]*?position:\s*absolute/);
  assert.match(gameSource, /function manualFocusRecetteActif\(familyId, slotIdx\)[\s\S]*?workManualFocus\.familyId === familyId[\s\S]*?workManualFocus\.slotIdx === slotIdx/);
  assert.match(gameSource, /function vitessesManualFocusRecette\(familyId, slotIdx\)[\s\S]*?gathering: focused \? multiplier : 1,[\s\S]*?processing: focused \? multiplier : 1/);
  assert.match(gameSource, /function dureesAffichageRecette\(pair, kitty, familyId, slotIdx\)[\s\S]*?dureeGatheringRecette\(pair, kitty\) \/ manualSpeeds\.gathering[\s\S]*?dureeProcessingRecette\(pair, kitty\) \/ manualSpeeds\.processing/);
  assert.match(gameSource, /const outputRate = kitty && durations && durations\.cycle > 0 \? outputPerCycle \/ durations\.cycle/);
});

test('Work All summarizes active recipe cycles by family without phase detail', function() {
  const summarySource = extraire('function renduWorkSummary(unlockedFamilies)', 'function ouvrirSlotDepuisResume');
  assert.match(gameSource, /let workFiltre = "all"/);
  assert.match(gameSource, /id="work-summary-all" class="work-summary-all"/);
  assert.match(summarySource, /unlockedFamilies\.map\(function\(familyId\)/);
  assert.match(summarySource, /progressionsSlotRecette\(slot, pair\)\.overall/);
  assert.match(summarySource, /class="work-summary-ring"[^>]*--prog:' \+ item\.progress/);
  assert.match(summarySource, /class="work-summary-worker"[\s\S]*?kittyIconHtml\(item\.kitty\)[\s\S]*?item\.kitty\.nom/);
  assert.match(summarySource, /dureesAffichageRecette\(pair, kitty, familyId, slotIdx\)[\s\S]*?productionProcBonus\(kitty\) \/ durations\.cycle \* 60/);
  assert.match(summarySource, /workSummaryManagerHtml\("Gathering Manager"[\s\S]*?workSummaryManagerHtml\("Processing Manager"/);
  assert.doesNotMatch(summarySource, /managerSpeedMultiplier\(kitty, managerFamily\)/);
  assert.match(summarySource, /item\.kitty\.nom[\s\S]*?\(lvl ' \+ item\.kitty\.niveau \+ '\)/);
    assert.match(summarySource, /recipe[\s\S]*?waiting for a Cat/);
    assert.match(summarySource, /active\.length === 0[\s\S]*?work-summary-go[\s\S]*?ouvrirFamilleDepuisResume/);
    assert.match(summarySource, /Go to ' \+ echapperAttributHtml\(family\.label\)/);
    assert.match(summarySource, /availableSlotCount = slots\.length/);
  assert.match(summarySource, /active\.length[\s\S]*?availableSlotCount[\s\S]*?ACTIVE/);
  assert.match(summarySource, /stateParts\.push\(familyId \+ "-slots", availableSlotCount\)/);
  assert.doesNotMatch(summarySource, /slot\.phase|progress\.gathering|progress\.processing/);
  assert.match(gameSource, /function ouvrirSlotDepuisResume\(familyId, slotIdx\)[\s\S]*?filtrerWork\(familyId\)[\s\S]*?objectif-cible-highlight/);
  assert.match(cssSource, /\.work-summary-all\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3/);
    assert.match(cssSource, /@media \(max-width:\s*900px\)[\s\S]*?work-summary-all[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
    assert.match(cssSource, /\.work-summary-go\s*\{/);
  });

test('Work displays higher resource tiers first with readable assignment controls', function() {
  assert.match(gameSource, /RESOURCE_PAIRS\s*\.filter\(function\(pair\)[\s\S]*?\.sort\(function\(a, b\) \{ return b\.tier - a\.tier; \}\)/);
  assert.match(cssSource, /\.work-recipe-cat-empty\s*\{[\s\S]*?color:\s*#fff;[\s\S]*?background:\s*#2d2722;/);
  assert.match(gameSource, /work-tier-badge work-tier-badge-tier-' \+ pair\.tier \+ '.*Tier ' \+ pair\.tier/);
  assert.doesNotMatch(gameSource, /work-tier-badge-processing/);
  assert.match(cssSource, /\.work-tier-badge-tier-1\s*\{[^}]*color:\s*#416a3f;[^}]*background:\s*#e2efdc;/);
  assert.match(cssSource, /\.work-tier-badge-tier-2\s*\{[^}]*color:\s*#8a5415;[^}]*background:\s*#f8e2bf;/);
});

test('Work family manager headers keep only the useful labels', function() {
  assert.match(gameSource, /pair-manager-role">Gathering Manager<\/span><\/div>/);
  assert.match(gameSource, /pair-manager-role">Processing Manager<\/span><\/div>/);
  assert.doesNotMatch(gameSource, /pair-manager-scope/);
});

test('Work manager cards use a compact left-right mobile rail with top-right removal controls', function() {
  assert.match(cssSource, /@media \(max-width:\s*600px\)[\s\S]*?body \.work-recipe-family-header > \.work-recipe-managers\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(cssSource, /@media \(max-width:\s*600px\)[\s\S]*?body \.work-recipe-manager-card\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(cssSource, /@media \(max-width:\s*600px\)[\s\S]*?body \.work-recipe-manager-card \.manager-slot-remove\s*\{[\s\S]*?position:\s*absolute[\s\S]*?top:\s*2px/);
  assert.match(cssSource, /@media \(max-width:\s*600px\)[\s\S]*?body \.work-recipe-manager-card \.manager-bonus-txt\s*\{[\s\S]*?white-space:\s*normal/);
});

test('selected recipes and the top resource rail expose compact tier labels', function() {
  assert.match(htmlSource, /id="row-cardboard-planks"[^>]*data-tier="T1"/);
  assert.match(htmlSource, /id="row-basic-wood-planks"[^>]*data-tier="T2"/);
  assert.match(htmlSource, /id="row-pebble-bricks"[^>]*data-tier="T1"/);
  assert.match(htmlSource, /id="row-rock-bricks"[^>]*data-tier="T2"/);
  assert.match(htmlSource, /id="row-salads"[^>]*data-tier="T1"/);
  assert.match(htmlSource, /id="row-grilled-anchovy"[^>]*data-tier="T2"/);
  assert.match(gameSource, /class="work-recipe-tier work-tier-badge work-tier-badge-tier-' \+ pair\.tier \+ '"[^>]*>T' \+ pair\.tier \+ '<\/span>/);
  assert.match(gameSource, /currently Tier ' \+ pair\.tier \+ '/);
  assert.match(gameSource, /class="work-summary-recipe"><span class="work-summary-tier work-tier-badge work-tier-badge-tier-' \+ item\.pair\.tier \+ '"[^>]*>T' \+ item\.pair\.tier \+ '<\/span><img/);
  assert.match(cssSource, /\.work-recipe-selected\s*\{[\s\S]*?grid-template-columns:\s*24px 38px minmax\(0, 1fr\) auto/);
  assert.match(cssSource, /\.work-recipe-tier\s*\{[\s\S]*?justify-self:\s*center[\s\S]*?width:\s*24px[\s\S]*?height:\s*20px/);
  assert.match(cssSource, /\.ressource\[data-tier\]::before\s*\{[\s\S]*?content:\s*attr\(data-tier\)[\s\S]*?left:\s*3px[\s\S]*?border-radius:\s*999px/);
  assert.match(cssSource, /\.ressource\[data-tier="T1"\]::before\s*\{[^}]*color:\s*#416a3f;[^}]*background:\s*#e2efdc;/);
  assert.match(cssSource, /\.ressource\[data-tier="T2"\]::before\s*\{[^}]*color:\s*#8a5415;[^}]*background:\s*#f8e2bf;/);
  assert.match(cssSource, /\.work-summary-tier\s*\{[\s\S]*?flex:\s*0 0 24px[\s\S]*?height:\s*20px/);
});

test('the compact resource rail supports persistent favorites and tier presets', function() {
  assert.match(stateSource, /resourceBarHidden:\s*\[\]/);
  assert.match(saveSource, /resourceBarHidden:\s+etat\.resourceBarHidden/);
  assert.match(htmlSource, /class="ressources-fixes"[\s\S]*?class="ressources-liste" id="ressources-liste"[\s\S]*?class="ressources-gerer"/);
  assert.match(htmlSource, /id="resource-bar-modal"[\s\S]*?Resource favorites[\s\S]*?Show all[\s\S]*?Show T2\+/);
  assert.match(gameSource, /const RESOURCE_BAR_ITEMS = Object\.freeze\(\[[\s\S]*?function appliquerPreferencesRessourcesBandeau\(\)/);
  assert.match(gameSource, /function basculerRessourceFavorite\(key\)[\s\S]*?masquees\.(?:splice|push)[\s\S]*?sauvegarder\(\)/);
  assert.match(gameSource, /function afficherRessourcesTierDeuxPlus\(\)[\s\S]*?item\.tier === "T1"[\s\S]*?sauvegarder\(\)/);
  assert.match(cssSource, /\.ressources-liste\s*\{[\s\S]*?overflow-x:\s*auto/);
  assert.match(cssSource, /@media \(min-width:\s*769px\)[\s\S]*?\.ressources\s*\{[\s\S]*?height:\s*70px;[\s\S]*?\.ressource\s*\{[\s\S]*?flex-direction:\s*column;[\s\S]*?\.ressource-icone\[src\]\s*\{[\s\S]*?width:\s*42px;[\s\S]*?height:\s*42px;[\s\S]*?\.ressource-chiffres\s*\{[\s\S]*?flex-direction:\s*row;/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.ressources-liste\s*\{[\s\S]*?grid-template-rows:\s*repeat\(2,/);
  assert.doesNotMatch(htmlSource, /ressource-debut-famille/);
  assert.doesNotMatch(cssSource, /\.ressource-debut-famille/);
});

test('building cost resources expose their tier badges', function() {
  assert.match(htmlSource, /id="cout-cathouse"[\s\S]*?cout-tier-badge work-tier-badge-tier-1[\s\S]*?Cardboard Plank_Final/);
  assert.match(htmlSource, /id="cout-cathouse2"[\s\S]*?cout-tier-badge work-tier-badge-tier-2[\s\S]*?Basic Wood Plank_Final/);
  assert.match(htmlSource, /id="cout-stone-planks">5<\/span>[\s\S]*?work-tier-badge-tier-2[\s\S]*?Basic Wood Plank_Final[\s\S]*?id="cout-stone-bricks">5<\/span>[\s\S]*?work-tier-badge-tier-1[\s\S]*?Pebble Brick_Final/);
  assert.match(htmlSource, /id="bouton-stone-cathouse" class="btn-achat btn-achat-cout-multiple"[\s\S]*?cout-groupe[\s\S]*?cout-groupe cout-groupe-suite/);
  assert.match(htmlSource, /id="bouton-jobcenter" class="btn-achat btn-achat-cout-multiple"/);
  assert.match(configSource, /stoneCathouse:\s*\{[\s\S]*?coutBasePlanks:\s*5,[\s\S]*?coutBaseBricks:\s*5,[\s\S]*?croissance:\s*1\.7/);
  assert.match(gameSource, /function badgeTierCout\(tier\)/);
  assert.match(gameSource, /badgeTierCout\(1\)[\s\S]*?Pebble Brick_Final/);
  assert.match(gameSource, /badgeTierCout\(2\)[\s\S]*?Rock Brick_Final/);
  assert.match(gameSource, /bouton-jobcenter[\s\S]*?cout-groupe[\s\S]*?cout-groupe cout-groupe-suite/);
  assert.match(cssSource, /\.cout-tier-badge\s*\{[\s\S]*?border-radius:\s*999px/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.btn-achat-cout-multiple\s*\{[\s\S]*?flex-wrap:\s*wrap/);
});

test('Sturdy House Plans unlock the scalable Solid Stone Cathouse', function() {
  assert.match(contentSource, /sturdyHousePlans:[\s\S]*?nom:\s*"Sturdy House Plans"[\s\S]*?answers:\s*\["foundations",\s*"blocks",\s*"walls",\s*"loads",\s*"drainage",\s*"roof"\]/);
  assert.match(configSource, /solidStoneCathouse:\s*\{[\s\S]*?coutBasePlanks:\s*10,[\s\S]*?coutBaseBricks:\s*5,[\s\S]*?croissance:\s*1\.7,[\s\S]*?speedBonus:\s*0\.40/);
  assert.match(htmlSource, /Solid Stone Cathouse_Final\.png/);
  assert.match(htmlSource, /id="cout-solid-stone-planks">10[\s\S]*?Basic Wood Plank_Final\.png[\s\S]*?id="cout-solid-stone-bricks">5[\s\S]*?Rock Brick_Final\.png/);
  assert.match(gameSource, /stoneCathouseCount \* CONFIG\.stoneCathouse\.speedBonus[\s\S]*?solidStoneCathouseCount \* CONFIG\.solidStoneCathouse\.speedBonus/);
  assert.match(gameSource, /function acheterSolidStoneCathouse\(\)[\s\S]*?etat\.basicWoodPlanks -= cout\.planks;[\s\S]*?etat\.rockBricks\s+-= cout\.bricks;[\s\S]*?etat\.solidStoneCathouseCount\+\+/);
  assert.match(saveSource, /solidStoneCathouseCount/);
});

test('Work recipe cards stay responsive and managers wait for the Job Center', function() {
  assert.match(cssSource, /\.work-recipe-slots\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2/);
  assert.match(cssSource, /@media \(max-width:\s*900px\)[\s\S]*?work-recipe-slots[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(cssSource, /@media \(max-width:\s*600px\)[\s\S]*?work-recipe-flow[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) 80px minmax\(0, 1fr\)/);
  assert.match(gameSource, /work-recipe-slot-top work-recipe-slot-top-empty[\s\S]*?work-recipe-slot-number[\s\S]*?aria-label="Recipe slot/);
  assert.match(cssSource, /\.work-recipe-slot-number\s*\{[\s\S]*?width:\s*52px;[\s\S]*?height:\s*52px;[\s\S]*?border-radius:\s*50%/);
  assert.match(cssSource, /\.work-recipe-choose-empty\s*\{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;/);
  assert.doesNotMatch(cssSource, /\.work-recipe-choose-empty\s*\{[^}]*border:\s*2px dashed/);
  assert.match(gameSource, /work-managers-" \+ familyId[\s\S]*?etat\.jobCenterConstruit \? "grid" : "none"/);
  assert.match(gameSource, /if \(currentFamily && etat\.jobCenterConstruit\)[\s\S]*?renderManagerSlot\(currentFamily\.gatheringManager\)[\s\S]*?renderManagerSlot\(currentFamily\.processingManager\)/);
  assert.match(cssSource, /\.work-recipe-slot\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;/);
  assert.match(cssSource, /\.work-recipe-slot-top-empty\s*\{[\s\S]*?min-height:\s*76px;[\s\S]*?padding-bottom:\s*0;/);
  assert.match(cssSource, /\.work-recipe-choose-empty\s*\{[\s\S]*?flex:\s*1 1 auto;[\s\S]*?min-height:\s*175px;/);
  assert.match(cssSource, /@media \(max-width:\s*600px\)[\s\S]*?work-recipe-slot-top-empty\s*\{\s*min-height:\s*67px;[\s\S]*?work-recipe-choose-empty\s*\{\s*min-height:\s*142px;/);
});

test('visible English copy uses consistent punctuation and assignment wording', function() {
  assert.doesNotMatch(htmlSource, /Unaffect all workers|GO BERNARDO !|Yes Boss !|Well done Bernardo !|Great !|Remember this moment !/);
  assert.match(htmlSource, /Unassign all Cats/);
  assert.match(gameSource, /Work unlocked! Choose a Cardboard Planks recipe and assign a Cat/);
  assert.match(gameSource, /Food recipes unlocked! Catnip Salad can now be produced in Work/);
  const contentSource = fs.readFileSync(path.join(root, 'js', 'data', 'content.js'), 'utf8');
  assert.doesNotMatch(contentSource, /Cléopatra|Napoléon/);
  assert.match(contentSource, /"Cleopatra"[\s\S]*?"Napoleon"/);
});

test('every book separates Study from its configured sentence-completion Learn mini-game', function() {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', 'cat-inc.js'), 'utf8'), context);
  vm.runInContext(contentSource, context);
  const items = context.CatInc.data.content.ITEMS;
  const expectedAnswers = {
    schoolGuide: ['learn', 'explorer', 'builder', 'chef'],
    fishingGuide: ['fisher', 'water', 'anchovy', 'Catchen'],
    constructionPlan: ['house', 'plan', 'planks', 'builder'],
    stoneGuide: ['miner', 'rocks', 'stonemason', 'bricks'],
    seminarGuide: ['values', 'potential', 'collaboration', 'synergy', 'growth', 'opportunity'],
    dailyPurpose: ['purpose', 'routine', 'best', 'version', 'yourself', 'step'],
    engineerGuide: ['problem', 'design', 'prototype', 'failure', 'solution', 'everyone'],
    teamworkGuide: ['minds', 'challenge', 'perspectives', 'unexpected', 'person', 'find']
  };
  Object.keys(expectedAnswers).forEach(function(itemId) {
    const item = items[itemId];
    assert.ok(item.studyDuration > 0, itemId + ' should define a study duration');
    assert.deepEqual(Array.from(item.learningGame.answers), expectedAnswers[itemId]);
    assert.equal(item.learningGame.phraseParts.length, item.learningGame.answers.length + 1);
    assert.equal(item.actions[0].id, 'study');
    assert.match(item.actions[0].label, /^Study/);
  });
  assert.match(gameSource, /function preparerEtudeLivre\(itemId\)[\s\S]*?bernardoIndex\(\)[\s\S]*?ouvrirConfirmationTravail/);
  assert.match(gameSource, /function demarrerEtudeLivre\(itemId, kittyIdx\)[\s\S]*?etat\.learningEnCours = \{ itemId: itemId, kittyIndex: kittyIdx/);
  assert.match(gameSource, /actionId === "study" && item\.learningGame[\s\S]*?preparerEtudeLivre\(itemId\)/);
  assert.match(gameSource, /function bernardoEstEnExploration\(kittyIdx\)[\s\S]*?kittyIsOnExpedition\(kittyIdx\)[\s\S]*?kittyIsOnScouting\(kittyIdx\)/);
  assert.match(gameSource, /function kittyIsLearningBook\(kittyIdx\)[\s\S]*?learningEnCours\.kittyIndex/);
  assert.match(gameSource, /inv-learning-marker[\s\S]*?CAT_FACES\.bernardo/);
  assert.match(gameSource, /inv-learning-progres[\s\S]*?markerEl\.style\.left/);
  assert.match(gameSource, /function terminerApprentissage\(itemId\)[\s\S]*?etat\.itemsEtudies\.push\(itemId\)[\s\S]*?lesson is ready in Inventory/);
  assert.match(gameSource, /actionId === "learn" && item\.learningGame[\s\S]*?ouvrirMiniJeuLivre\(itemId\)/);
  assert.match(htmlSource, /id="book-learning-modal"[\s\S]*?id="book-learning-phrase"[\s\S]*?id="book-learning-words"[\s\S]*?Check answer/);
  assert.match(cssSource, /\.book-learning-panel\s*\{[\s\S]*?Open Book\.png/);
  assert.match(cssSource, /@media \(max-width:\s*768px\)[\s\S]*?\.book-learning-panel\s*\{[\s\S]*?background-size:\s*contain;/);
  assert.match(gameSource, /if \(!correcte\)[\s\S]*?livreMiniJeuTrous = jeu\.answers\.map[\s\S]*?Incorrect\. Try again\./);
  assert.match(gameSource, /function apprendreLivre\(itemId\)[\s\S]*?if \(!ITEMS\[itemId\]\) return;[\s\S]*?etat\.itemsAppris\.push\(itemId\)[\s\S]*?etat\.jobCenterDebloque = true/);
  assert.match(contentSource, /dailyPurpose:\s*\{[\s\S]*?nom:\s*"The Daily Purpose"[\s\S]*?description:[\s\S]*?human self-help book/);
  assert.match(contentSource, /engineerGuide:\s*\{[\s\S]*?nom:\s*"The Engineer's Path"[\s\S]*?unlocksLabel:\s*"Laboratory"/);
  assert.match(contentSource, /teamworkGuide:\s*\{[\s\S]*?nom:\s*"The Teamwork Advantage"[\s\S]*?unlocksLabel:\s*"Engineer rank upgrades"/);
  assert.match(gameSource, /dailyPurpose:\s*\{\s*emoji:\s*LIVRE_ICONE,\s*nom:\s*"The Daily Purpose"/);
  assert.match(gameSource, /recompenseId === "engineerGuide"[\s\S]*?etat\.itemsAcquis\.push\("engineerGuide"\)/);
  assert.match(gameSource, /if \(itemId === "engineerGuide"\)[\s\S]*?etat\.laboratoryDebloque = true/);
  assert.match(gameSource, /recompenseId === "teamworkGuide"[\s\S]*?etat\.itemsAcquis\.push\("teamworkGuide"\)/);
  assert.match(gameSource, /if \(itemId === "teamworkGuide"\)[\s\S]*?engineerRankUpgradesDebloques = true/);
  assert.match(htmlSource, /id="section-laboratory"[\s\S]*?id="bouton-laboratory"[\s\S]*?100/);
  assert.match(gameSource, /recompenseId === "dailyPurpose"[\s\S]*?etat\.itemsAcquis\.push\("dailyPurpose"\)/);
});

test('Compass is a unique non-learning item grouped separately from books', function() {
  assert.match(contentSource, /compass:\s*\{[\s\S]*?type:\s*"unique"[\s\S]*?nom:\s*"Compass"[\s\S]*?Compass_Final\.png[\s\S]*?produce:[\s\S]*?usage:[\s\S]*?actions:\s*\[\]/);
  assert.match(gameSource, /recompenseId === "compass"[\s\S]*?etat\.itemsAcquis\.push\("compass"\)[\s\S]*?etat\.itemsAppris/);
  assert.match(gameSource, /const uniqueIds = itemIdsConnus\.filter[\s\S]*?ITEMS\[itemId\]\.type === "unique"/);
  assert.match(gameSource, /inv-items-section-titre[^>]*>BOOKS/);
  assert.match(gameSource, /inv-items-section-titre[^>]*>UNIQUE ITEMS/);
  assert.match(gameSource, /function showUniqueItemPopup\(el\)[\s\S]*?item\.description[\s\S]*?item\.produce[\s\S]*?item\.usage[\s\S]*?inv-res-popup/);
  assert.match(gameSource, /function carteUniqueItemHtml\(itemId\)[\s\S]*?inv-unique-carte[\s\S]*?toggleUniqueItemPopup/);
  assert.match(cssSource, /\.inv-unique-grille\s*\{[\s\S]*?grid-template-columns/);
  assert.match(cssSource, /\.inv-unique-carte\s*\{[\s\S]*?min-height:\s*104px;[\s\S]*?background:\s*#fdf8f3[\s\S]*?flex-direction:\s*column/);
  assert.match(cssSource, /\.inv-unique-icone \.inv-item-sprite\s*\{[\s\S]*?width:\s*56px;[\s\S]*?height:\s*56px/);
  assert.match(cssSource, /\.explo-complete \.inv-item-sprite\s*\{[\s\S]*?display:\s*inline-block[\s\S]*?width:\s*22px;[\s\S]*?height:\s*22px/);
});

test('The Daily Purpose unlocks persistent daily quests with an explicit claim action', function() {
  assert.match(stateSource, /dailyQuests:\s*\{[\s\S]*?scoutingSuccesses:[\s\S]*?recipesCompleted:[\s\S]*?rewardClaimed/);
  assert.match(saveSource, /dailyQuests:\s+etat\.dailyQuests/);
  const dailyUnlockFunction = extraire('function dailyQuetesDebloquees()', 'function cleDateParis');
  assert.match(dailyUnlockFunction, /itemsAppris[\s\S]*?dailyPurpose/);
  assert.doesNotMatch(dailyUnlockFunction, /itemsEtudies/);
  assert.match(gameSource, /function initialiserQuetesQuotidiennes\(\)[\s\S]*?if \(!dailyQuetesDebloquees\(\)\) return false/);
  assert.match(gameSource, /if \(itemId === "dailyPurpose"\) \{[\s\S]*?Daily quests unlocked![\s\S]*?The Daily Purpose learned/);
  assert.match(contentSource, /dailyPurpose:\s*\{[\s\S]*?unlocksLabel:\s*"Daily Quests"/);
  assert.match(gameSource, /function familleRecetteQuotidienne\([\s\S]*?DAILY_RECIPE_FAMILIES/);
  assert.match(gameSource, /function renduQuetesQuotidiennes\([\s\S]*?familleRecette[\s\S]*?Complete 10 \" \+ familleRecette \+ \" recipes/);
  assert.match(gameSource, /const tutorielTermine = dailyAvailable && !dailyRewardClaimed && actifs\.length === 0[\s\S]*?objectifVueActive = "daily"/);
  assert.match(gameSource, /modeButton\.style\.display = dailyAvailable && !tutorielTermine/);
  assert.match(gameSource, /function recompenseQuetesQuotidiennes\([\s\S]*?gl-daily-2[\s\S]*?gl-daily-1/);
  assert.match(gameSource, /function reclamerRecompenseQuotidienne\([\s\S]*?rewardQty = recompenseQuetesQuotidiennes\(\)[\s\S]*?cannedCatFood \+= rewardQty/);
  assert.match(htmlSource, /id="objectifs-vue-toggle"[\s\S]*?Daily/);
  assert.match(gameSource, /daily-claim-reward[\s\S]*?Claim reward/);
  assert.match(gameSource, /const visible = actifs\.length > 0 \|\| \(dailyAvailable && !dailyRewardClaimed\)/);
  assert.match(gameSource, /function stockCannedCatFoodScouting[\s\S]*?dailyCannedCatFoodStock/);
  assert.match(gameSource, /scouting-reward-stock[\s\S]*?stock\.remaining[\s\S]*?stock\.total/);
  assert.match(gameSource, /const resetLabel = stock[\s\S]*?millisecondesAvantMinuitParis[\s\S]*?scouting-reward-stock-reset[\s\S]*?reset in/);
  assert.match(configSource, /raidSupermarketAgain:[\s\S]*?dailyCannedCatFoodStock: 3/);
  assert.match(configSource, /stealGasStationAgain:[\s\S]*?dailyCannedCatFoodStock: 2/);
});

test('secondary screens expose concise headings, context and named resources', function() {
  assert.match(htmlSource, /<h2 class="panneau-titre">Neighborhood map<\/h2>[\s\S]*?Select a zone to review its status/);
  assert.match(htmlSource, /class="logs-heading"[\s\S]*?<h2>Gang history<\/h2>/);
  assert.match(htmlSource, /<h2 class="panneau-titre panneau-titre-aide">Items[\s\S]*?Guides and discoveries/);
  assert.match(htmlSource, /<h2 class="panneau-titre panneau-titre-aide">Resources[\s\S]*?Everything gathered and crafted/);
  assert.match(gameSource, /class="inv-res-name">' \+ r\.label/);
  assert.match(gameSource, /No matching entries[\s\S]*?Enable another filter/);
  assert.match(gameSource, /No stories unlocked[\s\S]*?memorable scenes/);
});

test('panel explanations move behind compact help buttons', function() {
  assert.match(htmlSource, /Wood Houses[\s\S]*?aria-label="Explain Wood Houses"[\s\S]*?Increases raw recruit speed/);
  assert.match(htmlSource, /Stone Houses[\s\S]*?aria-label="Explain Stone Houses"[\s\S]*?Multiplies recruit speed/);
  ['Job Center', 'Training Center', 'Laboratory', 'Items', 'Resources'].forEach(function(label) {
    assert.match(htmlSource, new RegExp(label + '[\\s\\S]*?class="detail-help-btn panneau-aide-btn"'));
  });
  assert.match(gameSource, /function togglePanneauAide\(event\)[\s\S]*?fermerPanneauAides\(\)[\s\S]*?aria-expanded/);
  assert.match(cssSource, /\.panneau-titre-aide\s*\{[\s\S]*?display:\s*flex[\s\S]*?align-items:\s*center/);
  assert.doesNotMatch(htmlSource, /<p class="panneau-desc">Increases recruit speed<\/p>/);
});

test('the job story hands off Bernardo role discovery to a focused second popup', function() {
  const story = htmlSource.slice(htmlSource.indexOf('id="ecran-story-6b"'), htmlSource.indexOf('</div>\n  </div>', htmlSource.indexOf('id="ecran-story-6b"')));
  assert.doesNotMatch(story, /Bernardo has just become the Gang Leader/);
  assert.match(story, /onclick="validerStoryJob\(\)"/);
  assert.match(htmlSource, /id="gang-leader-unlock-modal"[\s\S]*?Bernardo has just become the Gang Leader[\s\S]*?Go check Bernardo's job/);
  assert.match(gameSource, /function validerStoryJob\(\)[\s\S]*?fermerModal\("ecran-story-6b"\)[\s\S]*?ouvrirDialogueModal\("gang-leader-unlock-modal"/);
  assert.match(gameSource, /function allerVoirJobBernardo\(\)[\s\S]*?kittySelectionnee = bernardoIndex[\s\S]*?detailKittyMobileOuvert = true[\s\S]*?changerOnglet\("gang"\)[\s\S]*?renduManagement\(\)[\s\S]*?getElementById\("detail-job"\)[\s\S]*?objectif-cible-highlight/);
  assert.match(gameSource, /<div class='detail-section detail-job-left' id='detail-job'>/);
});

test('story history is saved with the game instead of leaking across imported saves', function() {
  assert.match(gameSource, /function storyEstVue\(flag\)[\s\S]*?etat\.storiesVues\.includes\(flag\)/);
  assert.match(gameSource, /function marquerStoryVue\(flag\)[\s\S]*?etat\.storiesVues\.push\(flag\)[\s\S]*?sauvegarder\(\)/);
  assert.match(gameSource, /function renduStories\(\)[\s\S]*?storyEstVue\(story\.flag\)/);
  assert.doesNotMatch(gameSource, /localStorage\.(?:getItem|setItem)\("(?:introVue|story[^"\)]*Vue)"/);
});

test('the recipe save era requires a deliberate restart for old local saves', function() {
  assert.match(htmlSource, /id="save-upgrade-modal"[\s\S]*?Work has been completely rebuilt around recipes[\s\S]*?id="save-upgrade-restart"[\s\S]*?Start a new game/);
  assert.match(cssSource, /\.save-upgrade-modal\s*\{[^}]*z-index:\s*260;/);
  assert.match(gameSource, /if \(analyse\.incompatible\)[\s\S]*?redemarrageMajeurRequis = true;[\s\S]*?sauvegardeVerrouillee = true;/);
  assert.match(gameSource, /function confirmerRedemarrageMajeur\(\)[\s\S]*?reinitialiserEtat\(\)[\s\S]*?volumeEffetsSonores[\s\S]*?volumeMusique[\s\S]*?sauvegarder\(\)[\s\S]*?afficherModal\("ecran-intro"\)/);
  assert.match(gameSource, /if \(redemarrageMajeurRequis\)[\s\S]*?ouvrirDialogueModal\("save-upgrade-modal"/);
});
