// ════════════════════════════════════════════════════════════
// 1. CONSTANTS & CONFIG
// ════════════════════════════════════════════════════════════

// Static balance data lives in js/data/config.js.
const gameConfigData = globalThis.CatInc.data.config;
const CONFIG = gameConfigData.CONFIG;

// Static game content lives in js/data/content.js.
const gameContentData = globalThis.CatInc.data.content;
const LIVRE_ICONE = gameContentData.LIVRE_ICONE;
const RESOURCE_INFO = gameContentData.RESOURCE_INFO;
const ITEMS = gameContentData.ITEMS;
const METIERS = gameContentData.METIERS;
const SPHERE_GRIDS = gameContentData.SPHERE_GRIDS;
const ZONES_CARTE = gameContentData.ZONES_CARTE;
const REGIONS = gameContentData.REGIONS;

function zonesRegion() {
  return REGIONS[etat.regionCourante].zones;
}

const TIERS_KITTIES = gameContentData.TIERS_KITTIES;
const NOMS_KITTIES = gameContentData.NOMS_KITTIES;
const VITESSES = gameConfigData.VITESSES;
const KITTY_ICON = gameContentData.KITTY_ICON;
const CHECK_ICON = gameContentData.CHECK_ICON;
const CAT_FACES = gameContentData.CAT_FACES;
const CAT_FACES_ALEATOIRES = gameContentData.CAT_FACES_ALEATOIRES;

// Development helpers are available only through an explicit URL flag.
// Normal games always run at 1× and never expose the forced bird trigger.
const devQuery = typeof location !== "undefined" ? location.search : "";
const DEV_MODE = /(?:^|[?&])debug=1(?:&|$)/.test(devQuery);
if (typeof document !== "undefined" && document.body) {
  document.body.dataset.devMode = DEV_MODE ? "true" : "false";
}

function assignerVisageChaton(nom) {
  if (nom === "Bernardo") return CAT_FACES.bernardo;
  if (nom === "Mochi")    return CAT_FACES.mochi;
  if (nom === "Luna")     return CAT_FACES.luna;
  return CAT_FACES_ALEATOIRES[Math.floor(Math.random() * CAT_FACES_ALEATOIRES.length)];
}

function kittyIconHtml(kitty) {
  if (!kitty || !kitty.visage) return KITTY_ICON;
  return '<img src="' + kitty.visage + '" class="kitty-icon" alt="' + kitty.nom + '">';
}

const OBJECTIFS = [
  // ── Kitties
  {
    id: "firstKitty", label: "Catch your first kitty",
    visible:  function(e) { return true; },
    accompli: function(e) { return e.chatons >= 1; }
  },
  {
    id: "secondKitty", label: "Catch a second kitty",
    visible:  function(e) { return e.chatons >= 1; },
    accompli: function(e) { return e.chatons >= 2; }
  },
  {
    id: "thirdKitty", label: "Catch your third kitty",
    visible:  function(e) { return e.chatons >= 2; },
    accompli: function(e) { return e.chatons >= 3; }
  },
  {
    id: "fiveKitties", label: "Recruit 5 kitties to unlock Grasscatting",
    visible:  function(e) { return e.chatons >= 3; },
    accompli: function(e) { return e.chatons >= 5; }
  },
  {
    id: "sixKitties", label: "Recruit 6 kitties to unlock Explorations",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function(e) { return e.chatons >= 6; }
  },
  {
    id: "sevenKitties", label: "Recruit 7 kitties to unlock Pebble Gathering",
    visible:  function(e) { return e.chatons >= 6; },
    accompli: function(e) { return e.chatons >= 7; }
  },

  // ── Cardboard & Buildings
  {
    id: "firstWoodcatter", label: "Put your first kitty to work",
    visible:  function(e) { return e.chatons >= 3; },
    accompli: function(e) { return allocationCount("woodcatting") >= 1; }
  },
  {
    id: "unlockBuildings", label: "Gather 5 Cardboard Pieces to unlock Buildings",
    visible:  function(e) { return allocationCount("woodcatting") >= 1; },
    accompli: function(e) { return e.cardboardPiecesTotalRecolte >= 5; }
  },
  {
    id: "firstCathouse", label: "Build your first Cardboard Box",
    visible:  function(e) { return e.cardboardPiecesTotalRecolte >= 5; },
    accompli: function(e) { return e.cathouses.length >= 1; }
  },

  // ── Sawmill & Cardboard Planks
  {
    id: "unlockSawmill", label: "Gather 10 Cardboard Pieces to unlock the Sawmill",
    visible:  function(e) { return e.cardboardPiecesTotalRecolte >= 5; },
    accompli: function(e) { return e.cardboardPiecesTotalRecolte >= 10; }
  },
  {
    id: "firstSawmillWorker", label: "Assign a kitty to the Sawmill",
    visible:  function(e) { return e.cardboardPiecesTotalRecolte >= 10; },
    accompli: function(e) { return allocationCount("sawmill") >= 1; }
  },
  {
    id: "firstPlank", label: "Craft your first Cardboard Plank",
    visible:  function(e) { return allocationCount("sawmill") >= 1; },
    accompli: function(e) { return e.cardboardPlanks >= 1; }
  },
  {
    id: "tenPlanks", label: "Craft 10 Cardboard Planks to unlock Basic Wood",
    visible:  function(e) { return e.cardboardPlanks >= 1; },
    accompli: function(e) { return e.cardboardPlanks >= 10; }
  },

  // ── Catnip & Catchen
  {
    id: "firstGrasscatter", label: "Put a kitty to gather catnip",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function(e) { return allocationCount("grasscatting") >= 1; }
  },
  {
    id: "unlockCatchen", label: "Gather 10 catnip to unlock The Catchen",
    visible:  function(e) { return allocationCount("grasscatting") >= 1; },
    accompli: function(e) { return e.catnipTotalRecolte >= 10; }
  },
  {
    id: "firstCatchenWorker", label: "Assign a kitty to The Catchen",
    visible:  function(e) { return e.catnipTotalRecolte >= 10; },
    accompli: function(e) { return allocationCount("catchen") >= 1; }
  },
  {
    id: "firstSalad", label: "Cook your first Salad",
    visible:  function(e) { return allocationCount("catchen") >= 1; },
    accompli: function(e) { return e.salads >= 1; }
  },

  // ── Pebbles & Pawsonry
  {
    id: "firstPebbleGatherer", label: "Assign a kitty to gather pebbles",
    visible:  function(e) { return e.chatons >= 7; },
    accompli: function(e) { return allocationCount("pebblegathering") >= 1; }
  },
  {
    id: "unlockPawsonry", label: "Gather 10 pebbles to unlock Pawsonry",
    visible:  function(e) { return allocationCount("pebblegathering") >= 1; },
    accompli: function(e) { return e.pebblesTotalRecolte >= 10; }
  },
  {
    id: "firstPawsonryWorker", label: "Assign a kitty to Pawsonry",
    visible:  function(e) { return e.pebblesTotalRecolte >= 10; },
    accompli: function(e) { return allocationCount("brickfactory") >= 1; }
  },
  {
    id: "firstBrick", label: "Craft your first Pebble Brick",
    visible:  function(e) { return allocationCount("brickfactory") >= 1; },
    accompli: function(e) { return e.pebbleBricks >= 1; }
  },

  // ── Explorations & Job Center
  {
    id: "firstCampaign", label: "Complete the \"Search our trash\" campaign",
    visible:  function(e) { return e.chatons >= 6; },
    accompli: function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1 || e.campaignsCompletees.indexOf("checkTheTrash") !== -1; }
  },
  {
    id: "learnFromSchoolGuide", label: "Read the School Guide in Inventory",
    visible:  function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1; },
    accompli: function(e) { return e.itemsAppris.indexOf("schoolGuide") !== -1; }
  },
  {
    id: "buildJobCenter", label: "Build the Job Center (10 Pebble Bricks + 1 Basic Wood Plank)",
    labelHtml: 'Build the Job Center (10 <img class="obj-sprite" src="img/resources/Pebble Brick_Final.png" alt="Pebble Brick"> + 1 <img class="obj-sprite" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank">)',
    visible:  function(e) { return e.jobCenterDebloque; },
    accompli: function(e) { return e.jobCenterConstruit; }
  },
  {
    id: "firstJobTraining", label: "Train a kitty for their first job",
    visible:  function(e) { return e.jobCenterConstruit; },
    accompli: function(e) { return e.kittiesData.some(function(k) { return k.metier !== null; }); }
  },

  // ── Basic Wood
  {
    id: "firstBasicWoodGatherer", label: "Assign a kitty to gather Basic Wood",
    visible:  function(e) { return e.cardboardPlanks >= 10; },
    accompli: function(e) { return allocationCount("basicWoodcatting") >= 1; }
  },
  {
    id: "firstBasicSawmill", label: "Assign a kitty to the Basic Wood Sawmill",
    visible:  function(e) { return e.basicWoodTotalRecolte >= 1; },
    accompli: function(e) { return allocationCount("basicSawmill") >= 1; }
  },
  {
    id: "firstBasicWoodPlank", label: "Craft your first Basic Wood Plank",
    visible:  function(e) { return allocationCount("basicSawmill") >= 1; },
    accompli: function(e) { return e.basicWoodPlanks >= 1; }
  },

  // ── Cathouse (real)
  {
    id: "buildRealCathouse", label: "Build a Wood Cathouse to boost recruit speed",
    visible:  function(e) { return e.basicWood >= 1 || e.cathouseCount > 0; },
    accompli: function(e) { return e.cathouseCount >= 1; }
  }
];

// Presentation metadata only: this guides the player without changing unlocks,
// objective visibility or completion rules above.
const OBJECTIF_GUIDE = Object.freeze({
  firstKitty:               { ordre: 10,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 1 }; } },
  secondKitty:              { ordre: 20,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 2 }; } },
  thirdKitty:               { ordre: 30,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 3 }; } },
  firstWoodcatter:          { ordre: 40,  onglet: "work",         cible: "#famille-wood",          filtre: "wood", progression: function() { return { actuel: allocationCount("woodcatting"), cible: 1 }; } },
  unlockBuildings:          { ordre: 50,  onglet: "work",         cible: "#famille-wood",          filtre: "wood", progression: function(e) { return { actuel: e.cardboardPiecesTotalRecolte, cible: 5 }; } },
  fiveKitties:              { ordre: 60,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 5 }; } },
  unlockSawmill:            { ordre: 70,  onglet: "work",         cible: "#famille-wood",          filtre: "wood", progression: function(e) { return { actuel: e.cardboardPiecesTotalRecolte, cible: 10 }; } },
  firstSawmillWorker:       { ordre: 80,  onglet: "work",         cible: "#pairside-sawmill",      filtre: "wood", progression: function() { return { actuel: allocationCount("sawmill"), cible: 1 }; } },
  firstPlank:               { ordre: 90,  onglet: "work",         cible: "#pairside-sawmill",      filtre: "wood", progression: function(e) { return { actuel: e.cardboardPlanks, cible: 1 }; } },
  firstCathouse:            { ordre: 100, onglet: "buildings",    cible: "#bouton-cathouse",       progression: function(e) { return { actuel: e.cathouses.length, cible: 1 }; } },
  firstGrasscatter:         { ordre: 110, onglet: "work",         cible: "#famille-food",          filtre: "food", progression: function() { return { actuel: allocationCount("grasscatting"), cible: 1 }; } },
  unlockCatchen:            { ordre: 120, onglet: "work",         cible: "#famille-food",          filtre: "food", progression: function(e) { return { actuel: e.catnipTotalRecolte, cible: 10 }; } },
  firstCatchenWorker:       { ordre: 130, onglet: "work",         cible: "#pairside-catchen",      filtre: "food", progression: function() { return { actuel: allocationCount("catchen"), cible: 1 }; } },
  firstSalad:               { ordre: 140, onglet: "work",         cible: "#pairside-catchen",      filtre: "food", progression: function(e) { return { actuel: e.salads, cible: 1 }; } },
  sixKitties:               { ordre: 150, onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 6 }; } },
  firstCampaign:            { ordre: 160, onglet: "explorations", cible: "#section-campaigns",     progression: function(e) {
    const mission = e.exploEnCours.find(function(explo) { return explo.id === "checkTheTrash"; });
    if (!mission) return { actuel: 0, cible: 1, texte: "Not started" };
    const ecoule = Math.min(mission.duree, Math.max(0, (Date.now() - mission.startTs) / 1000));
    return { actuel: ecoule, cible: mission.duree, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(mission.duree) };
  } },
  learnFromSchoolGuide:     { ordre: 170, onglet: "inventaire",   cible: "#section-items",         progression: function(e) {
    const lecture = e.learningEnCours && e.learningEnCours.itemId === "schoolGuide" ? e.learningEnCours : null;
    if (!lecture) return { actuel: 0, cible: 1, texte: "Ready to read" };
    const ecoule = Math.min(lecture.duree / 1000, Math.max(0, (Date.now() - lecture.startTs) / 1000));
    return { actuel: ecoule, cible: lecture.duree / 1000, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(lecture.duree / 1000) };
  } },
  tenPlanks:                { ordre: 180, onglet: "work",         cible: "#pairside-sawmill",      filtre: "wood", progression: function(e) { return { actuel: e.cardboardPlanks, cible: 10 }; } },
  firstBasicWoodGatherer:   { ordre: 190, onglet: "work",         cible: "#famille-wood",          filtre: "wood", progression: function() { return { actuel: allocationCount("basicWoodcatting"), cible: 1 }; } },
  sevenKitties:             { ordre: 200, onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 7 }; } },
  firstPebbleGatherer:      { ordre: 210, onglet: "work",         cible: "#famille-rock",          filtre: "rock", progression: function() { return { actuel: allocationCount("pebblegathering"), cible: 1 }; } },
  unlockPawsonry:           { ordre: 220, onglet: "work",         cible: "#famille-rock",          filtre: "rock", progression: function(e) { return { actuel: e.pebblesTotalRecolte, cible: 10 }; } },
  firstPawsonryWorker:      { ordre: 230, onglet: "work",         cible: "#pairside-brickfactory", filtre: "rock", progression: function() { return { actuel: allocationCount("brickfactory"), cible: 1 }; } },
  firstBrick:               { ordre: 240, onglet: "work",         cible: "#pairside-brickfactory", filtre: "rock", progression: function(e) { return { actuel: e.pebbleBricks, cible: 1 }; } },
  firstBasicSawmill:        { ordre: 250, onglet: "work",         cible: "#pairside-basicSawmill", filtre: "wood", progression: function() { return { actuel: allocationCount("basicSawmill"), cible: 1 }; } },
  firstBasicWoodPlank:      { ordre: 260, onglet: "work",         cible: "#pairside-basicSawmill", filtre: "wood", progression: function(e) { return { actuel: e.basicWoodPlanks, cible: 1 }; } },
  buildRealCathouse:        { ordre: 270, onglet: "buildings",    cible: "#bouton-cathouse2",      progression: function(e) { return { actuel: e.cathouseCount, cible: 1 }; } },
  buildJobCenter:           { ordre: 280, onglet: "facilities",   cible: "#bouton-jobcenter",      progression: function(e) {
    const briques = Math.min(10, e.pebbleBricks);
    const planches = Math.min(1, e.basicWoodPlanks);
    return { actuel: Math.min(briques / 10, planches), cible: 1, texte: formaterNombre(briques) + "/10 bricks · " + formaterNombre(planches) + "/1 plank" };
  } },
  firstJobTraining:         { ordre: 290, onglet: "facilities",   cible: "#jc-interface",          progression: function(e) {
    if (!e.formationEnCours) return { actuel: 0, cible: 1, texte: "Choose a kitty and a job" };
    const ecoule = Math.min(e.formationEnCours.duree, Math.max(0, (Date.now() - e.formationEnCours.startTs) / 1000));
    return { actuel: ecoule, cible: e.formationEnCours.duree, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(e.formationEnCours.duree) };
  } }
});


// ════════════════════════════════════════════════════════════
// 2. GAME STATE
// ════════════════════════════════════════════════════════════

// State factory lives in js/core/state.js.
const stateCore = globalThis.CatInc.state;
const makeWorkerSlots = stateCore.makeWorkerSlots;
const creerEtatInitial = stateCore.creerEtatInitial;
const remplacerEtat = stateCore.remplacerEtat;
const etat = creerEtatInitial();

function reinitialiserEtat() {
  remplacerEtat(etat, creerEtatInitial());
}


// ════════════════════════════════════════════════════════════
// 3. DERIVED VALUES & CALCULATIONS
// ════════════════════════════════════════════════════════════



function allocationCount(action) {
  var slots = etat.workers[action];
  if (!slots) return 0;
  return slots.filter(function(s) { return s.kittyIndex !== null; }).length;
}

function kittyIsInWorkerSlot(kittyIdx) {
  return Object.values(etat.workers).some(function(slots) {
    return slots.some(function(s) { return s.kittyIndex === kittyIdx; });
  });
}

function kittyIsInTraining(kittyIdx) {
  return !!(etat.formationEnCours && etat.formationEnCours.kittyIndex === kittyIdx);
}

function kittyIsOnExpedition(kittyIdx) {
  return etat.exploEnCours.some(function(e) { return e.kittyIndices.includes(kittyIdx); });
}

function kittyEstManager(kittyIdx) {
  return Object.values(etat.managers).some(function(mi) { return mi === kittyIdx; });
}

function kittyIsOnZoneExplo(kittyIdx) {
  return !!(etat.exploZoneEnCours && etat.exploZoneEnCours.kittyIndices.includes(kittyIdx));
}

function kittyIsBusy(kittyIdx) {
  return kittyIsOnExpedition(kittyIdx) || kittyIsInWorkerSlot(kittyIdx) || kittyIsInTraining(kittyIdx) || kittyIsOnZoneExplo(kittyIdx) || kittyIsOnScouting(kittyIdx) || kittyIsInScoutingStaging(kittyIdx);
}

function isAvailableForAutoAssign(ki, currentSlots) {
  if (!etat.kittiesData[ki]) return false;
  if (currentSlots && currentSlots.indexOf(ki) !== -1) return false;
  if (kittyIsBusy(ki)) return false;
  if (kittyEstManager(ki)) return false;
  return true;
}

function autoAssignPickPriority(available) {
  var explo = available.find(function(i) {
    return etat.kittiesData[i] && etat.kittiesData[i].metier === 'explorator';
  });
  if (explo !== undefined) return explo;
  var bern = available.find(function(i) {
    var k = etat.kittiesData[i];
    return k && k.metier === 'gang-leader' && etat.spherePerks && etat.spherePerks['gl-explo'] === 'learned';
  });
  return bern !== undefined ? bern : null;
}

function autoAssignPickBest(available, difficulte, currentPower) {
  if (available.length === 0) return null;
  var remaining = difficulte - currentPower;
  var under = available.filter(function(i) { return kittyEP(i) <= remaining; });
  if (under.length > 0) {
    return under.reduce(function(best, i) { return kittyEP(i) > kittyEP(best) ? i : best; });
  }
  return available.reduce(function(best, i) { return kittyEP(i) < kittyEP(best) ? i : best; });
}

function exclusifyStagedKitty(ki, exceptType, exceptId) {
  Object.keys(exploKittiesSelectionnees).forEach(function(campId) {
    if (exceptType === 'campaign' && campId === exceptId) return;
    var s = exploKittiesSelectionnees[campId];
    if (s) for (var i = 0; i < s.length; i++) { if (s[i] === ki) s[i] = null; }
  });
  Object.keys(carteExploSlots).forEach(function(zoneId) {
    if (exceptType === 'zone' && zoneId === exceptId) return;
    var s = carteExploSlots[zoneId];
    if (s) for (var i = 0; i < s.length; i++) { if (s[i] === ki) s[i] = null; }
  });
  Object.keys(scoutingsStagingKitty).forEach(function(scId) {
    if (exceptType === 'scouting' && scId === exceptId) return;
    if (scoutingsStagingKitty[scId] === ki) delete scoutingsStagingKitty[scId];
  });
}

function autoAssignExplo(type, id) {
  var allKittyIndices = Object.keys(etat.kittiesData).map(Number).filter(function(i) { return !!etat.kittiesData[i]; });

  if (type === 'scouting') {
    var def = CONFIG.scoutings[id];
    if (!def || scoutingsStagingKitty[id] !== undefined) return;
    var avail = allKittyIndices.filter(function(i) { return isAvailableForAutoAssign(i, []); });
    var chosen = autoAssignPickPriority(avail);
    if (chosen === null) chosen = autoAssignPickBest(avail, def.difficulte, 0);
    if (chosen !== null && chosen !== undefined) {
      scoutingsStagingKitty[id] = chosen;
      exclusifyStagedKitty(chosen, 'scouting', id);
      exploTabDirty = true;
      renderCampaignCards();
    }
    return;
  }

  var difficulte, slots, nbSlots;
  if (type === 'campaign') {
    var camp = CONFIG.campaigns[id];
    if (!camp) return;
    difficulte = camp.difficulte; nbSlots = camp.slots;
    if (!exploKittiesSelectionnees[id]) exploKittiesSelectionnees[id] = new Array(nbSlots).fill(null);
    slots = exploKittiesSelectionnees[id];
  } else if (type === 'zone') {
    var zone = ZONES_CARTE[id];
    if (!zone) return;
    difficulte = zone.difficulte; nbSlots = zone.slots;
    if (!carteExploSlots[id]) carteExploSlots[id] = new Array(nbSlots).fill(null);
    slots = carteExploSlots[id];
  } else { return; }

  for (var si = 0; si < nbSlots; si++) {
    if (slots[si] !== null) continue;
    var avail2 = allKittyIndices.filter(function(i) { return isAvailableForAutoAssign(i, slots); });
    if (avail2.length === 0) break;
    var currentPower = slots.reduce(function(s, ki) { return s + (ki !== null ? kittyEP(ki) : 0); }, 0);
    var hasPriority = slots.some(function(ki) {
      if (ki === null) return false;
      var k = etat.kittiesData[ki];
      return k && (k.metier === 'explorator' || (k.metier === 'gang-leader' && etat.spherePerks && etat.spherePerks['gl-explo'] === 'learned'));
    });
    var pick = null;
    if (!hasPriority) pick = autoAssignPickPriority(avail2);
    if (pick === null || pick === undefined) pick = autoAssignPickBest(avail2, difficulte, currentPower);
    if (pick === null || pick === undefined) break;
    slots[si] = pick;
    exclusifyStagedKitty(pick, type, id);
  }
  exploTabDirty = true;
  renderCampaignCards();
}

function totalAlloue() {
  var total = 0;
  Object.values(etat.workers).forEach(function(slots) {
    slots.forEach(function(s) { if (s.kittyIndex !== null) total++; });
  });
  if (etat.formationEnCours) total++;
  return total;
}
function chatonsEnExplo() {
  return etat.exploEnCours.reduce(function(s, e) { return s + e.kittyIndices.length; }, 0);
}
function chatonsEnZoneExplo() {
  return etat.exploZoneEnCours ? etat.exploZoneEnCours.kittyIndices.length : 0;
}
function chatonsEnScouting() {
  return Object.keys(etat.scoutingsEnCours).length;
}
function kittyIsOnScouting(kittyIdx) {
  return Object.values(etat.scoutingsEnCours).some(function(sc) { return sc.kittyIndex === kittyIdx; });
}
function kittyIsInScoutingStaging(kittyIdx) {
  return Object.values(scoutingsStagingKitty).some(function(ki) { return ki === kittyIdx; });
}

// Maps a worker action to the exact resource it produces, e.g. "génère des Cardboard Pieces"
var ACTION_DISPLAY = { fishcatting: "Anchovy", grilledAnchovy: "Grilled Anchovy", woodcatting: "Cardboard Pieces", basicWoodcatting: "Basic Wood", grasscatting: "Catnip", pebblegathering: "Pebbles", rockgathering: "Rocks", sawmill: "Cardboard Planks", basicSawmill: "Basic Wood Planks", brickfactory: "Pebble Bricks", rockFactory: "Rock Bricks", catchen: "Salads" };

function kittyAllocationLabel(kittyIdx) {
  // Worker slot
  var workerFamily = null;
  Object.keys(etat.workers).forEach(function(action) {
    if (etat.workers[action].some(function(s) { return s.kittyIndex === kittyIdx; })) workerFamily = action;
  });
  if (workerFamily) {
    var label = ACTION_DISPLAY[workerFamily] || workerFamily.replace(/([A-Z])/g, " $1").replace(/^./, function(c) { return c.toUpperCase(); });
    return { text: "Generating: " + label, cls: "kitty-statut-work" };
  }
  // Manager
  var managerFamille = Object.keys(etat.managers).find(function(f) { return etat.managers[f] === kittyIdx; });
  if (managerFamille) {
    return { text: "Manager: " + managerFamille.charAt(0).toUpperCase() + managerFamille.slice(1), cls: "kitty-statut-work" };
  }
  // Training
  if (etat.formationEnCours && etat.formationEnCours.kittyIndex === kittyIdx) {
    var jobNom = etat.formationEnCours.metier && METIERS[etat.formationEnCours.metier] ? METIERS[etat.formationEnCours.metier].nom : "training";
    return { text: "In training: " + jobNom, cls: "kitty-statut-training" };
  }
  // Zone exploration (running)
  if (etat.exploZoneEnCours && etat.exploZoneEnCours.kittyIndices.includes(kittyIdx)) {
    var z = ZONES_CARTE[etat.exploZoneEnCours.zoneId];
    return { text: "Exploring: " + (z ? z.nom : etat.exploZoneEnCours.zoneId), cls: "kitty-statut-explo" };
  }
  // Zone exploration (staged)
  var stagedZone = Object.keys(carteExploSlots).find(function(zoneId) {
    return (carteExploSlots[zoneId] || []).includes(kittyIdx);
  });
  if (stagedZone) {
    var zs = ZONES_CARTE[stagedZone];
    return { text: "Ready: " + (zs ? zs.nom : stagedZone), cls: "kitty-statut-explo" };
  }
  // Campaign (running)
  var runningCamp = etat.exploEnCours.find(function(e) { return e.kittyIndices.includes(kittyIdx); });
  if (runningCamp) {
    var camp = CONFIG.campaigns[runningCamp.id];
    return { text: "On campaign: " + (camp ? camp.nom : runningCamp.id), cls: "kitty-statut-explo" };
  }
  // Campaign (staged)
  var stagedCamp = Object.keys(exploKittiesSelectionnees).find(function(campId) {
    return (exploKittiesSelectionnees[campId] || []).includes(kittyIdx);
  });
  if (stagedCamp) {
    var sc2 = CONFIG.campaigns[stagedCamp];
    return { text: "Ready: " + (sc2 ? sc2.nom : stagedCamp), cls: "kitty-statut-explo" };
  }
  // Scouting (running)
  var runningScouting = Object.keys(etat.scoutingsEnCours).find(function(id) {
    return etat.scoutingsEnCours[id].kittyIndex === kittyIdx;
  });
  if (runningScouting) {
    var sd = CONFIG.scoutings[runningScouting];
    return { text: "Scouting: " + (sd ? sd.nom : runningScouting), cls: "kitty-statut-explo" };
  }
  // Scouting (staged)
  var stagedScouting = Object.keys(scoutingsStagingKitty).find(function(id) {
    return scoutingsStagingKitty[id] === kittyIdx;
  });
  if (stagedScouting) {
    var sds = CONFIG.scoutings[stagedScouting];
    return { text: "Ready: " + (sds ? sds.nom : stagedScouting), cls: "kitty-statut-explo" };
  }
  return { text: "Free", cls: "kitty-statut-free" };
}
function chatonsLibres() { return etat.chatons - totalAlloue() - chatonsEnExplo() - chatonsEnZoneExplo() - chatonsEnScouting() - Object.keys(scoutingsStagingKitty).length; }

function scoutingDebloquee(scoutingDef) {
  if (scoutingDef.unlockCampaign && !etat.campaignsCompletees.includes(scoutingDef.unlockCampaign)) return false;
  if (scoutingDef.zone && !etat.zonesExplorees.includes(scoutingDef.zone)) return false;
  return true;
}

function tirerRecompenseScouting(range) {
  var roll = Math.random() * 100, cumul = 0;
  for (var i = 0; i < range.length; i++) {
    cumul += range[i].weight;
    if (roll < cumul) return range[i].qty;
  }
  return range[range.length - 1].qty;
}

function terminerScouting(scoutingId) {
  var def = CONFIG.scoutings[scoutingId];
  var sc  = etat.scoutingsEnCours[scoutingId];
  if (!def || !sc) return;
  var kitty = etat.kittiesData[sc.kittyIndex];
  var kNom  = kitty ? kitty.nom : "Someone";
  var power = kittyEP(sc.kittyIndex);
  var successChance = def.difficulte > 0 ? Math.min(1, power / def.difficulte) : 1;
  var success = Math.random() < successChance;
  if (success) {
    if (def.recompenseTable) {
      var entry = resoudreRecompenseTable(applyPerkCatFood(def.recompenseTable, sc.kittyIndex));
      var tqty = tryDoubleReward(entry.qty, sc.kittyIndex);
      if (entry.recompense === "cannedCatFood") {
        etat.cannedCatFood += tqty;
        ajouterLog("event", kNom + " found " + tqty + " canned cat food in the supermarket.");
      } else if (entry.recompense === "humanWorkersFood") {
        etat.humanWorkersFood += tqty;
        ajouterLog("event", kNom + " found " + tqty + " human workers food in the supermarket.");
      } else if (entry.recompense === "humanLeftovers") {
        etat.humanLeftovers += tqty;
        ajouterLog("event", kNom + " found " + tqty + " human leftover" + (tqty > 1 ? "s" : "") + ".");
      }
    } else if (def.dropChance && Math.random() >= def.dropChance) {
      ajouterLog("event", kNom + " searched the area but came back empty.");
    } else {
      var baseQty = tirerRecompenseScouting(def.recompenseRange);
      var qty = tryDoubleReward(baseQty, sc.kittyIndex);
      if (def.recompense === "humanLeftovers") {
        etat.humanLeftovers += qty;
        ajouterLog("event", kNom + " found " + qty + " human leftover" + (qty > 1 ? "s" : "") + " in the trash.");
      } else if (def.recompense === "humanWorkersFood") {
        etat.humanWorkersFood += qty;
        ajouterLog("event", kNom + " found " + qty + " human workers food in the basement.");
      } else if (def.recompense === "cannedCatFood") {
        etat.cannedCatFood += qty;
        ajouterLog("event", kNom + " found " + qty + " canned cat food in the supermarket.");
      }
    }
  } else {
    ajouterLog("event", kNom + " found nothing on this scouting run.");
  }
  // Auto-restart with same kitty, preserving the same effective duration
  var restartDuree = scoutingHalveTime(sc.kittyIndex) ? def.duree / 2 : def.duree;
  etat.scoutingsEnCours[scoutingId] = { kittyIndex: sc.kittyIndex, startTs: Date.now(), duree: restartDuree };
  // No exploTabDirty here: the card structure is unchanged (same kitty, same scouting).
  // Timer bar and countdown are updated each tick via direct DOM in renduExplorations().
}

function scoutingHalveTime(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k) return false;
  if (k.metier === 'explorator') return true;
  return k.metier === 'gang-leader' && etat.spherePerks && etat.spherePerks['gl-explo'] === 'learned';
}

function assignerKittyScouting(scoutingId, kittyIndex) {
  var def = CONFIG.scoutings[scoutingId];
  var duree = def ? (scoutingHalveTime(kittyIndex) ? def.duree / 2 : def.duree) : 120;
  etat.scoutingsEnCours[scoutingId] = { kittyIndex: kittyIndex, startTs: Date.now(), duree: duree };
  exploTabDirty = true;
  sauvegarder();
  renderCampaignCards();
}

function retirerKittyScouting(scoutingId) {
  delete etat.scoutingsEnCours[scoutingId];
  exploTabDirty = true;
  sauvegarder();
  renderCampaignCards();
}

function retirerScoutingStaging(scoutingId) {
  delete scoutingsStagingKitty[scoutingId];
  exploTabDirty = true;
  renderCampaignCards();
}

function lancerScouting(scoutingId) {
  var ki = scoutingsStagingKitty[scoutingId];
  if (ki === undefined) return;
  delete scoutingsStagingKitty[scoutingId];
  assignerKittyScouting(scoutingId, ki);
}

function builderManagerBonus() {
  const idx = etat.managers["houses"];
  if (idx === null || idx === undefined) return 1;
  const kitty = etat.kittiesData[idx];
  if (!kitty || kitty.metier !== "builder") return 1;
  return (kitty.managerMult || 2) * jobLevelMultiplier(kitty);
}

// Passive bonus from the Gang Leader: scales with total cat count + leader's own level.
// Applies as a global multiplier to all Work tab worker progress.
function gangLeaderBonus() {
  const gl = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
  if (!gl) return 1;
  const n = etat.kittiesData.length;
  if (n <= 1) return 1;
  const catBonus = Math.pow(n - 1, 1.3) * 0.015;
  return 1 + catBonus * (1 + gl.niveau * 0.12);
}

function vitesseAttrapage() {
  const builderBonus = builderManagerBonus();
  const fromWoodHouses = etat.cathouses.length * CONFIG.cathouse.reductionParSeconde
                       + etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde;
  const stoneBonus = etat.stoneCathouseCount * CONFIG.stoneCathouse.speedBonus;
  const recruitPerk = etat.spherePerks && etat.spherePerks['gl-rec'] === 'learned';
  const glBonus = recruitPerk ? gangLeaderBonus() : 1;
  return (1 + fromWoodHouses * builderBonus) * (1 + stoneBonus) * glBonus;
}

// XP / leveling
const FOOD_XP = { salads: 1, grilledAnchovy: 10, humanLeftovers: 1, humanWorkersFood: 15 };

function xpPourNiveau(n) {
  return Math.max(n + 1, Math.ceil(Math.pow(n, 1.7)));
}

function productionParChaton(action) {
  return 1;
}

// Production engine lives in js/core/production.js.
const productionProcBonus = globalThis.CatInc.production.productionProcBonus;
const avancerTransformation = globalThis.CatInc.production.avancerTransformation;

// 5% bonus per level, multiplicative — amplifies every job effect
function jobLevelMultiplier(kitty) {
  return Math.pow(1.05, kitty ? kitty.niveau : 0);
}

// Each family (raw gathering OR its processed output) has its own independent manager
const MAP_FAMILLE = {
  woodcatting: "wood", basicWoodcatting: "wood",
  grasscatting: "food", fishcatting: "food",
  sawmill: "sawmill",
  catchen: "catchen", grilledAnchovy: "catchen",
  pebblegathering: "rock", rockgathering: "rock",
  brickfactory: "pawsonry", rockFactory: "pawsonry"
};
const METIER_PAR_FAMILLE = { wood: ["lumberjack"], food: ["farmer"], sawmill: ["carpenter"], catchen: ["chef"], rock: ["miner"], pawsonry: ["stonemason"], houses: ["builder"] };

function multiplicateurFamille(action) {
  const famille = MAP_FAMILLE[action];
  if (!famille) return 1;
  const managerIdx = etat.managers[famille];
  if (managerIdx === null || managerIdx === undefined) return 1;
  const kitty = etat.kittiesData[managerIdx];
  if (!kitty || !METIER_PAR_FAMILLE[famille].includes(kitty.metier)) return 1;
  return (kitty.managerMult || 2) * jobLevelMultiplier(kitty);
}

function dureeBrute() {
  const n = etat.clicCount;
  return n <= 10
    ? 5 * Math.pow(3, n)
    : 5 * Math.pow(3, 10) * Math.pow(1.3, n - 10);
}
function dureeEffective() { return Math.max(1, dureeBrute() / vitesseAttrapage()); }

function tempsRestantSequence() {
  if (!etat.sequenceEnCours) return 0;
  const ecouleBrut = (Date.now() - etat.sequenceDebutTs) / 1000;
  return Math.max(0, etat.sequenceDuree - ecouleBrut * vitesseAttrapage());
}

function progressionSequence() {
  if (!etat.sequenceEnCours) return 0;
  const ecouleBrut = (Date.now() - etat.sequenceDebutTs) / 1000;
  return Math.min(1, (ecouleBrut * vitesseAttrapage()) / etat.sequenceDuree);
}

function coutProchaineCathouse() {
  return Math.ceil(Math.pow(1.7, etat.cathouses.length));
}

function coutProchaineCatHouse() {
  return Math.ceil(Math.pow(1.7, etat.cathouseCount));
}

function coutProchaineStoneCathouse() {
  const n = etat.stoneCathouseCount;
  const f = Math.pow(CONFIG.stoneCathouse.croissance, n);
  return {
    planks: Math.ceil(CONFIG.stoneCathouse.coutBasePlanks * f),
    bricks: Math.ceil(CONFIG.stoneCathouse.coutBaseBricks * f)
  };
}


// ════════════════════════════════════════════════════════════
// 4. UNLOCK CONDITIONS
// ════════════════════════════════════════════════════════════

function catheringDebloquee()       { return etat.chatons >= 3; }
function grasscattingDebloquee()    { return etat.chatons >= 5; }
function pebblegatheringDebloquee() { return etat.chatons >= CONFIG.pebblegathering.deblocageA; }
function rockgatheringDebloquee()   { return etat.itemsAppris.includes("stoneGuide"); }
function rockfactoryDebloquee()     { return etat.itemsAppris.includes("stoneGuide"); }
function basicWoodDebloquee()       { return etat.cardboardPlanks >= 10 || etat.basicWoodTotalRecolte >= 1; }
function basicSawmillDebloquee()    { return etat.basicWoodTotalRecolte >= 1; }
function catHouseDebloquee()        { return etat.basicWoodTotalRecolte >= 1 || etat.cathouseCount > 0; }
function stoneHousesDebloques()     { return etat.pebbleBricks >= 1 || etat.stoneCathouseCount > 0 || etat.objectifsComplis.includes("firstBrick"); }
function buildingsDebloques()       { return etat.cardboardPiecesTotalRecolte >= 5; }
function scierieDebloquee()         { return etat.cardboardPiecesTotalRecolte >= CONFIG.sawmill.deblocageA; }
function brickfactoryDebloquee()    { return etat.pebblesTotalRecolte >= CONFIG.brickfactory.deblocageA; }
function pawcessingDebloquee()      { return scierieDebloquee(); }
function catchenDebloquee()         { return etat.catnipTotalRecolte >= CONFIG.catchen.deblocageA; }
function anchovyDebloquee()         { return etat.itemsAppris.includes("fishingGuide"); }
function grilledAnchovyDebloquee()  { return anchovyDebloquee(); }
function explorationDebloquee()     { return etat.chatons >= 6; }
function explorateurPresent()       { return etat.kittiesData.some(function(k) { return k.metier === "explorator"; }); }
function inventaireDebloque()       { return etat.cardboardPiecesTotalRecolte >= 1; }
function jobCenterDebloquee()        { return etat.jobCenterDebloque; }
function trainingCenterDebloquee()   { return etat.trainingCenterDebloque; }


// ════════════════════════════════════════════════════════════
// 5. FORMATTING HELPERS
// ════════════════════════════════════════════════════════════

function formaterNombre(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.floor(n).toString();
}

function formaterTemps(sec) {
  if (sec <= 0) return "";
  sec = Math.ceil(sec);
  const y = Math.floor(sec / 31536000);
  const d = Math.floor((sec % 31536000) / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (y > 0) return y + "y " + d + "d " + h + "h " + m + "m " + s + "s";
  if (d > 0) return d + "d " + h + "h " + m + "m " + s + "s";
  if (h > 0) return h + "h " + m + "m " + s + "s";
  if (m > 0) return m + "m " + s + "s";
  return s + "s";
}

function formaterCatchTime(ts) {
  if (!ts) return "Unknown";
  const d    = new Date(ts);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const h    = String(d.getHours()).padStart(2, "0");
  const m    = String(d.getMinutes()).padStart(2, "0");
  return date + " · " + h + ":" + m;
}

// Shared keyboard behavior for non-native interactive surfaces.
// Only the element carrying data-clavier-clic reacts: nested native buttons
// keep their own behavior without activating the parent card.
function echapperAttributHtml(valeur) {
  return String(valeur)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function etatVideHtml(titre, description) {
  return '<div class="etat-vide"><strong>' + echapperAttributHtml(titre) + '</strong><span>' + echapperAttributHtml(description) + '</span></div>';
}

function attributsActivationClavier(label) {
  return ' tabindex="0" role="button" data-clavier-clic="true" aria-label="' + echapperAttributHtml(label) + '"';
}

function rendreActivableClavier(element, label) {
  element.tabIndex = 0;
  element.setAttribute("role", "button");
  element.dataset.clavierClic = "true";
  element.setAttribute("aria-label", label);
}

function gererActivationClavier(event) {
  const cible = event.target;
  if (!cible || typeof cible.matches !== "function" || !cible.matches("[data-clavier-clic]")) return;
  if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  cible.click();
}

if (typeof document !== "undefined") document.addEventListener("keydown", gererActivationClavier);

// Accessible modal lifecycle: initial focus, Tab containment, optional Escape,
// and focus return to the control that opened the dialog.
const configurationsDialogues = new WeakMap();

function elementsFocusablesDialogue(dialogue) {
  return Array.from(dialogue.querySelectorAll(
    'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )).filter(function(element) {
    if (element.getAttribute("aria-disabled") === "true") return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

function ouvrirDialogueModal(id, options) {
  const dialogue = typeof id === "string" ? document.getElementById(id) : id;
  if (!dialogue) return;
  const config = Object.assign({ dismissible: false }, options || {});
  config.elementRetour = document.activeElement && document.activeElement !== document.body
    ? document.activeElement
    : null;
  configurationsDialogues.set(dialogue, config);
  dialogue.style.display = "flex";
  dialogue.setAttribute("aria-hidden", "false");
  requestAnimationFrame(function() {
    const cible = (config.focusSelector && dialogue.querySelector(config.focusSelector))
      || elementsFocusablesDialogue(dialogue)[0]
      || dialogue.querySelector('[role="document"]')
      || dialogue;
    if (!cible.hasAttribute("tabindex") && cible === dialogue) cible.tabIndex = -1;
    cible.focus();
  });
}

function fermerDialogueModal(id) {
  const dialogue = typeof id === "string" ? document.getElementById(id) : id;
  if (!dialogue) return;
  const config = configurationsDialogues.get(dialogue) || {};
  dialogue.style.display = "none";
  dialogue.setAttribute("aria-hidden", "true");
  configurationsDialogues.delete(dialogue);
  requestAnimationFrame(function() {
    const cible = (config.returnFocusSelector && document.querySelector(config.returnFocusSelector))
      || (config.elementRetour && config.elementRetour.isConnected ? config.elementRetour : null);
    if (cible && typeof cible.focus === "function") cible.focus();
  });
}

function dialogueOuvertAuPremierPlan() {
  const ouverts = Array.from(document.querySelectorAll('[role="dialog"][aria-hidden="false"]'));
  return ouverts.length ? ouverts[ouverts.length - 1] : null;
}

function gererClavierDialogue(event) {
  const dialogue = dialogueOuvertAuPremierPlan();
  if (!dialogue) return;
  const config = configurationsDialogues.get(dialogue) || {};

  if (event.key === "Escape" && config.dismissible && typeof config.fermer === "function") {
    event.preventDefault();
    config.fermer();
    return;
  }
  if (event.key !== "Tab") return;

  const focusables = elementsFocusablesDialogue(dialogue);
  if (focusables.length === 0) {
    event.preventDefault();
    dialogue.focus();
    return;
  }
  const premier = focusables[0];
  const dernier = focusables[focusables.length - 1];
  if (event.shiftKey && (document.activeElement === premier || !dialogue.contains(document.activeElement))) {
    event.preventDefault();
    dernier.focus();
  } else if (!event.shiftKey && (document.activeElement === dernier || !dialogue.contains(document.activeElement))) {
    event.preventDefault();
    premier.focus();
  }
}

if (typeof document !== "undefined") document.addEventListener("keydown", gererClavierDialogue, true);


// ════════════════════════════════════════════════════════════
// 6. SAVE / LOAD / RESET
// ════════════════════════════════════════════════════════════

const saveCore = globalThis.CatInc.save;
const SAVE_KEY = saveCore.SAVE_KEY;
const SAVE_RECOVERY_KEY = saveCore.SAVE_RECOVERY_KEY;
const SAVE_VERSION = saveCore.SAVE_VERSION;
const validerStructureSauvegarde = saveCore.validerStructureSauvegarde;
const analyserSauvegardeBrute = saveCore.analyserSauvegardeBrute;

let sauvegardeVerrouillee = false; // set right before a reload we must not let a stale autosave clobber

function conserverSauvegardeRecuperation(raw, raison) {
  try {
    localStorage.setItem(SAVE_RECOVERY_KEY, JSON.stringify({
      savedAt: Date.now(),
      reason: raison,
      raw: raw
    }));
    return true;
  } catch (e) {
    // If localStorage is full or unavailable, the original save remains untouched under SAVE_KEY.
    return false;
  }
}

function sauvegarder() {
  if (sauvegardeVerrouillee) return;
  etat.dernierTimestamp = Date.now();
  localStorage.setItem(SAVE_KEY, saveCore.serialiserEtat(etat));
}

function charger() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  const analyse = analyserSauvegardeBrute(raw);
  if (!analyse.ok) {
    const copieRecuperationCreee = conserverSauvegardeRecuperation(raw, analyse.erreur);
    sauvegardeVerrouillee = true;
    alert("Your save could not be loaded safely. It was left untouched"
      + (copieRecuperationCreee ? " and a recovery copy was stored. " : ". ")
      + "Import a valid save or use Start over to begin again.\n\nReason: " + analyse.erreur);
    return false;
  }

  const nouvelEtat = saveCore.migrerDonneesSauvegarde(analyse.data, {
    maintenant: Date.now(),
    nomsKitties: NOMS_KITTIES,
    assignerVisageChaton: assignerVisageChaton
  });
  remplacerEtat(etat, nouvelEtat);

  // Promotion remains in the browser layer because it creates a notification and a log.
  if (etat.itemsAppris.includes("schoolGuide") || etat.jobCenterConstruit) assignerGangLeader();
  return true;
}

function reset() {
  if (!confirm("Start over from scratch?")) return;
  fermerModalSettings();
  localStorage.removeItem(SAVE_KEY);
  STORIES.forEach(function(s) { localStorage.removeItem(s.flag); });
  localStorage.removeItem("workDetailsHintSeen");
  sauvegardeVerrouillee = false;
  reinitialiserEtat();
  rendu(); renduLogs(); renduObjectifs(); renduManagement();
}

function ouvrirModalSettings() {
  document.getElementById("toggle-adjusted-time").checked = etat.afficherTempsAjusteRecrutement;
  ouvrirDialogueModal("settings-modal", {
    dismissible: true,
    fermer: fermerModalSettings,
    focusSelector: ".explo-modal-close",
    returnFocusSelector: ".bouton-settings"
  });
}
function basculerAffichageTempsAjuste(checked) {
  etat.afficherTempsAjusteRecrutement = checked;
  sauvegarder();
  renduSequence();
}
function fermerModalSettings() {
  fermerDialogueModal("settings-modal");
}

function sauvegarderManuel() {
  sauvegarder();
  afficherNotification("💾 Game saved!");
}

function exporterSauvegarde() {
  sauvegarder();
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([raw], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "cat-inc-save-" + date + ".txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  afficherNotification("⬇️ Save exported!");
}

function importerSauvegarde(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    const analyse = analyserSauvegardeBrute(reader.result);
    if (!analyse.ok) {
      alert("This file isn't a valid Cat Inc save.\n\nReason: " + analyse.erreur);
      event.target.value = "";
      return;
    }
    if (!confirm("Import this save? Your current progress will be replaced.")) {
      event.target.value = "";
      return;
    }
    sauvegardeVerrouillee = true; // block the visibilitychange autosave from clobbering the import during reload
    localStorage.setItem(SAVE_KEY, reader.result);
    // An imported save is never a fresh start — skip the intro overlay on reload.
    localStorage.setItem("introVue", "1");
    location.reload();
  };
  reader.readAsText(file);
}


// ════════════════════════════════════════════════════════════
// 7. NOTIFICATIONS & LOGS
// ════════════════════════════════════════════════════════════

const notificationsEnAttente = [];
let notificationActive = null;
const DUREE_NOTIFICATION_MS = 2600;
const DUREE_FONDU_NOTIFICATION_MS = 400;

function afficherNotification(message) {
  const texte = String(message || "").trim();
  if (!texte) return;
  if (notificationActive && notificationActive.message === texte) return;
  if (notificationsEnAttente.includes(texte)) return;
  notificationsEnAttente.push(texte);
  afficherNotificationSuivante();
}

function afficherNotificationSuivante() {
  if (notificationActive || notificationsEnAttente.length === 0) return;
  const message = notificationsEnAttente.shift();
  const el = document.createElement("div");
  el.textContent = message;
  el.className   = "notification";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  document.body.appendChild(el);
  notificationActive = { message: message, element: el };
  setTimeout(function() { el.classList.add("visible"); }, 10);
  setTimeout(function() {
    el.classList.remove("visible");
    setTimeout(function() {
      el.remove();
      notificationActive = null;
      afficherNotificationSuivante();
    }, DUREE_FONDU_NOTIFICATION_MS);
  }, DUREE_NOTIFICATION_MS);
}

const LOG_MAX = 60;

function ajouterLog(type, lignes) {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, "0");
  const m   = String(now.getMinutes()).padStart(2, "0");
  etat.logs.unshift({ type: type, lignes: Array.isArray(lignes) ? lignes : [lignes], heure: h + ":" + m });
  if (etat.logs.length > LOG_MAX) etat.logs.pop();
  renduLogs();
}

const logFiltres = { event: true, unlock: true, objective: false };

function renduLogs() {
  const conteneur = document.getElementById("logs-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  let affiches = 0;
  etat.logs.forEach(function(entry) {
    const lignes = entry.lignes || (entry.texte ? [entry.texte] : []);
    const typeEffectif = entry.type === "unlock" && lignes.some(function(ligne) {
      return ligne.indexOf("Objective complete:") === 0;
    }) ? "objective" : entry.type;
    if (!logFiltres[typeEffectif]) return;
    affiches++;
    const el    = document.createElement("div");
    el.className = "log-entry log-" + typeEffectif;
    const heure = document.createElement("span");
    heure.className   = "log-heure";
    heure.textContent = entry.heure;
    const bloc  = document.createElement("span");
    bloc.className = "log-texte";
    lignes.forEach(function(ligne, i) {
      if (i > 0) bloc.appendChild(document.createElement("br"));
      bloc.appendChild(document.createTextNode(ligne));
    });
    el.appendChild(heure);
    el.appendChild(bloc);
    conteneur.appendChild(el);
  });
  if (affiches === 0) {
    conteneur.innerHTML = etatVideHtml(
      etat.logs.length === 0 ? "No activity yet" : "No matching entries",
      etat.logs.length === 0 ? "Your gang's important events will appear here." : "Enable another filter to reveal more of the gang's history."
    );
  }
}

function toggleFiltreLogs(type) {
  logFiltres[type] = !logFiltres[type];
  const btn = document.getElementById("filtre-" + type);
  if (btn) {
    btn.classList.toggle("filtre-inactif", !logFiltres[type]);
    btn.setAttribute("aria-pressed", logFiltres[type] ? "true" : "false");
  }
  renduLogs();
}


// ════════════════════════════════════════════════════════════
// 8. OBJECTIVES
// ════════════════════════════════════════════════════════════

function verifierObjectifs() {
  let changed = false;
  OBJECTIFS.forEach(function(obj) {
    if (etat.objectifsComplis.indexOf(obj.id) === -1 && obj.accompli(etat)) {
      etat.objectifsComplis.push(obj.id);
      ajouterLog("objective", "Objective complete: " + obj.label);
      changed = true;
    }
  });
  if (changed) { rendu(); sauvegarder(); }
  renduObjectifs();
}

let objectifPrincipalId = null;
let objectifGuideSelectionneId = null;
let objectifsGuideStructureKey = "";
const NOMS_DESTINATIONS_GUIDE = {
  gang: "Recruitment",
  work: "Work",
  buildings: "Buildings",
  facilities: "Facilities",
  explorations: "Explorations",
  inventaire: "Inventory",
  logs: "Logs"
};

function objectifsActifsTries() {
  return OBJECTIFS.filter(function(obj) {
    return etat.objectifsComplis.indexOf(obj.id) === -1 && obj.visible(etat);
  }).sort(function(a, b) {
    const ordreA = OBJECTIF_GUIDE[a.id] ? OBJECTIF_GUIDE[a.id].ordre : Number.MAX_SAFE_INTEGER;
    const ordreB = OBJECTIF_GUIDE[b.id] ? OBJECTIF_GUIDE[b.id].ordre : Number.MAX_SAFE_INTEGER;
    return ordreA - ordreB;
  });
}

function valeurProgressionGuide(valeur) {
  if (!Number.isFinite(valeur)) return "0";
  if (Math.abs(valeur - Math.round(valeur)) < 0.001) return String(Math.round(valeur));
  return formaterNombre(valeur);
}

function ordreObjectifGuide(objectifId) {
  return OBJECTIF_GUIDE[objectifId] ? OBJECTIF_GUIDE[objectifId].ordre : Number.MAX_SAFE_INTEGER;
}

function normaliserObjectifGuideSelectionne(actifs) {
  if (actifs.some(function(obj) { return obj.id === objectifGuideSelectionneId; })) return;
  const ancienOrdre = objectifGuideSelectionneId ? ordreObjectifGuide(objectifGuideSelectionneId) : -1;
  const suivant = actifs.find(function(obj) { return ordreObjectifGuide(obj.id) >= ancienOrdre; });
  objectifGuideSelectionneId = (suivant || actifs[0]).id;
}

function objectifGuideCarteHtml(obj) {
  const id = echapperAttributHtml(obj.id);
  const label = obj.labelHtml || echapperAttributHtml(obj.label);
  return '<button id="objectif-guide-action-' + id + '" class="obj-guide-action" type="button" data-objectif-id="' + id + '" onclick="allerObjectif(\'' + id + '\')">' +
    '<span class="obj-guide-destination"></span>' +
    '<span class="obj-guide-label">' + label + '</span>' +
    '<span class="obj-guide-progression" role="progressbar" aria-label="' + echapperAttributHtml(obj.label) + ' progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
      '<span class="obj-guide-barre"></span>' +
    '</span>' +
    '<span class="obj-guide-pied">' +
      '<span class="obj-guide-valeur"></span>' +
      '<span class="obj-guide-lien"></span>' +
    '</span>' +
  '</button>';
}

function mettreAJourProgressionObjectif(obj, bouton, guide) {
  const progression = typeof guide.progression === "function" ? guide.progression(etat) : null;
  const progressionEl = bouton.querySelector(".obj-guide-progression");
  const barre = bouton.querySelector(".obj-guide-barre");
  const valeur = bouton.querySelector(".obj-guide-valeur");
  if (progression && Number.isFinite(progression.actuel) && Number.isFinite(progression.cible) && progression.cible > 0) {
    const ratio = Math.max(0, Math.min(1, progression.actuel / progression.cible));
    ecrireStyle(progressionEl, "display", "block");
    const largeur = (ratio * 100).toFixed(1) + "%";
    if (barre.style.width !== largeur) barre.style.width = largeur;
    const ariaNow = String(Math.round(ratio * 100));
    if (progressionEl.getAttribute("aria-valuenow") !== ariaNow) progressionEl.setAttribute("aria-valuenow", ariaNow);
    ecrireTexte(valeur, progression.texte || (valeurProgressionGuide(progression.actuel) + " / " + valeurProgressionGuide(progression.cible)));
  } else {
    ecrireStyle(progressionEl, "display", "none");
    ecrireTexte(valeur, "");
  }
}

function renduObjectifs() {
  const panneau = document.getElementById("panneau-objectifs");
  const liste = document.getElementById("objectif-guide-liste");
  if (!panneau || !liste) return;

  const actifs = objectifsActifsTries();
  if (actifs.length === 0) {
    ecrireStyle(panneau, "display", "none");
    objectifPrincipalId = null;
    objectifGuideSelectionneId = null;
    objectifsGuideStructureKey = "";
    ecrireHTML(liste, "");
    return;
  }
  ecrireStyle(panneau, "display", "");

  normaliserObjectifGuideSelectionne(actifs);
  objectifPrincipalId = objectifGuideSelectionneId;
  const selectedIndex = Math.max(0, actifs.findIndex(function(obj) { return obj.id === objectifGuideSelectionneId; }));
  const selected = actifs[selectedIndex];
  const structureKey = actifs.map(function(obj) { return obj.id; }).join("|");
  if (structureKey !== objectifsGuideStructureKey) {
    ecrireHTML(liste, actifs.map(objectifGuideCarteHtml).join(""));
    objectifsGuideStructureKey = structureKey;
  }

  actifs.forEach(function(obj, index) {
    const guide = OBJECTIF_GUIDE[obj.id] || {};
    const destination = NOMS_DESTINATIONS_GUIDE[guide.onglet] || "Game";
    const bouton = liste.querySelector('[data-objectif-id="' + obj.id + '"]');
    if (!bouton) return;
    bouton.classList.toggle("obj-guide-recommande", index === 0);
    bouton.classList.toggle("obj-guide-selectionne", obj.id === objectifGuideSelectionneId);
    if (obj.id === objectifGuideSelectionneId) bouton.setAttribute("aria-current", "step");
    else bouton.removeAttribute("aria-current");
    ecrireTexte(bouton.querySelector(".obj-guide-destination"), (index === 0 ? "Recommended · " : "") + destination);
    ecrireTexte(bouton.querySelector(".obj-guide-lien"), guide.action || ("Open " + destination + " →"));
    const ariaLabel = "Go to objective: " + obj.label + ". " + (guide.action || ("Open " + destination));
    if (bouton.getAttribute("aria-label") !== ariaLabel) bouton.setAttribute("aria-label", ariaLabel);
    mettreAJourProgressionObjectif(obj, bouton, guide);
  });

  const estMobile = window.matchMedia("(max-width: 768px)").matches;
  ecrireTexte(document.getElementById("objectifs-titre"), estMobile
    ? "Goal " + (selectedIndex + 1) + "/" + actifs.length + ": " + selected.label
    : "Current goals · " + actifs.length);
  ecrireTexte(document.getElementById("objectif-guide-compteur"), (selectedIndex + 1) + " / " + actifs.length);
  const precedent = document.getElementById("objectif-guide-precedent");
  const suivant = document.getElementById("objectif-guide-suivant");
  if (precedent) precedent.disabled = actifs.length < 2;
  if (suivant) suivant.disabled = actifs.length < 2;
  ecrireTexte(document.getElementById("objectif-guide-secondaires"), "Completed goals are saved in Logs");
}

function changerObjectifGuide(delta) {
  const actifs = objectifsActifsTries();
  if (actifs.length < 2) return;
  let index = actifs.findIndex(function(obj) { return obj.id === objectifGuideSelectionneId; });
  if (index < 0) index = 0;
  index = (index + delta + actifs.length) % actifs.length;
  objectifGuideSelectionneId = actifs[index].id;
  objectifPrincipalId = objectifGuideSelectionneId;
  renduObjectifs();
}

function allerObjectif(objectifId) {
  if (!objectifId) return;
  const guide = OBJECTIF_GUIDE[objectifId];
  if (!guide) return;

  objectifGuideSelectionneId = objectifId;
  objectifPrincipalId = objectifId;
  if (objectifId === "firstCampaign") {
    carteZoneSelectionnee = "D1";
    carteDirty = true;
    exploTabDirty = true;
  }
  if (guide.onglet) changerOnglet(guide.onglet);
  if (guide.filtre !== undefined) filtrerWork(guide.filtre);

  if (window.matchMedia("(max-width: 768px)").matches) definirObjectifsReduits(true);
  setTimeout(function() {
    const cible = guide.cible ? document.querySelector(guide.cible) : null;
    if (!cible) return;
    if (!cible.closest("#top-bar")) cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function allerObjectifPrincipal() {
  allerObjectif(objectifPrincipalId);
}


// ════════════════════════════════════════════════════════════
// 9. RENDER
// ════════════════════════════════════════════════════════════

// DOM helpers live in js/ui/dom.js.
const domUtils = globalThis.CatInc.dom;
const domParId = domUtils.domParId;
const ecrireTexte = domUtils.ecrireTexte;
const ecrireHTML = domUtils.ecrireHTML;
const ecrireStyle = domUtils.ecrireStyle;
const ecrirePropriete = domUtils.ecrirePropriete;
const ecrireVariableStyle = domUtils.ecrireVariableStyle;
const basculerClasse = domUtils.basculerClasse;
const setBarreProgress = domUtils.setBarreProgress;

// Helper: compute all unlock flags once per render cycle
function unlocks() {
  return {
    libres:       chatonsLibres(),
    cathering:    catheringDebloquee(),
    grasscat:     grasscattingDebloquee(),
    pebblecat:    pebblegatheringDebloquee(),
    rockcat:      rockgatheringDebloquee(),
    rockfact:     rockfactoryDebloquee(),
    basicWood:    basicWoodDebloquee(),
    catHouse:     catHouseDebloquee(),
    stoneHouses:  stoneHousesDebloques(),
    buildings:    buildingsDebloques(),
    scierie:      scierieDebloquee(),
    basicSawmill: basicSawmillDebloquee(),
    brickfact:    brickfactoryDebloquee(),
    pawcessing:   pawcessingDebloquee(),
    catchen:      catchenDebloquee(),
    exploration:  explorationDebloquee(),
    explorateurPresent: explorateurPresent(),
    inventaire:   inventaireDebloque(),
    jobCenter:       jobCenterDebloquee(),
    trainingCenter:  trainingCenterDebloquee(),
    anchovy:         anchovyDebloquee(),
    grilledAnchovy: grilledAnchovyDebloquee()
  };
}

const IDS_ONGLETS = ["gang", "work", "buildings", "facilities", "explorations", "inventaire", "logs"];

function ongletDejaVisite(id) {
  return Array.isArray(etat.ongletsVisites) && etat.ongletsVisites.includes(id);
}

function actualiserBadgeOnglet(id, visible) {
  const bouton = domParId("onglet-" + id);
  if (!bouton) return;
  const nouveau = visible && !ongletDejaVisite(id);
  basculerClasse(bouton, "onglet-nouveau", nouveau);

  const labelElement = bouton.querySelector(".onglet-label");
  const label = labelElement ? labelElement.textContent.trim() : id;
  const labelAccessible = label + (nouveau ? " (new)" : "");
  if (bouton.getAttribute("aria-label") !== labelAccessible) bouton.setAttribute("aria-label", labelAccessible);
  if (nouveau) {
    const titre = label + " — New";
    if (bouton.title !== titre) bouton.title = titre;
  } else if (bouton.hasAttribute("title")) {
    bouton.removeAttribute("title");
  }
}

function marquerOngletVisite(id) {
  if (!Array.isArray(etat.ongletsVisites)) etat.ongletsVisites = ["gang", "logs"];
  if (!etat.ongletsVisites.includes(id)) {
    etat.ongletsVisites.push(id);
    sauvegarder();
  }
  actualiserBadgeOnglet(id, true);
}

// ── 9a. Resources bar
function renduRessources(u) {
  [
    ["val-chatons", etat.chatons],
    ["val-cardboard-planks", etat.cardboardPlanks],
    ["val-basic-wood-planks", etat.basicWoodPlanks],
    ["val-pebble-bricks", etat.pebbleBricks],
    ["val-rock-bricks", etat.rockBricks],
    ["val-salads", etat.salads],
    ["val-grilled-anchovy", etat.grilledAnchovy],
    ["val-human-leftovers", etat.humanLeftovers],
    ["val-human-workers-food", etat.humanWorkersFood],
    ["val-canned-cat-food", etat.cannedCatFood]
  ].forEach(function(entry) {
    ecrireTexte(domParId(entry[0]), formaterNombre(entry[1]));
  });

  [
    ["work", u.cathering],
    ["buildings", u.buildings],
    ["facilities", u.jobCenter],
    ["explorations", u.exploration],
    ["inventaire", u.inventaire]
  ].forEach(function(entry) {
    ecrireStyle(domParId("onglet-" + entry[0]), "display", entry[1] ? "inline-flex" : "none");
    actualiserBadgeOnglet(entry[0], entry[1]);
  });
  actualiserBadgeOnglet("gang", true);
  actualiserBadgeOnglet("logs", true);

  [
    ["row-cardboard-planks", u.scierie, "flex"],
    ["row-basic-wood-planks", u.basicSawmill, "flex"],
    ["row-pebble-bricks", u.brickfact, "flex"],
    ["row-rock-bricks", u.rockfact, "flex"],
    ["row-salads", u.catchen, "flex"],
    ["row-grilled-anchovy", u.grilledAnchovy, "flex"],
    ["row-human-leftovers", etat.humanLeftovers > 0, "flex"],
    ["row-human-workers-food", etat.humanWorkersFood > 0, "flex"],
    ["row-canned-cat-food", etat.cannedCatFood > 0, "flex"]
  ].forEach(function(entry) {
    ecrireStyle(domParId(entry[0]), "display", entry[1] ? entry[2] : "none");
  });

  var boostEl = domParId("work-boost-indicator");
  if (boostEl) {
    if (etat.workBoostFinTs && Date.now() < etat.workBoostFinTs) {
      var boostRestant = Math.ceil((etat.workBoostFinTs - Date.now()) / 1000);
      ecrireTexte(boostEl, "⚡ Work ×10 — " + formaterTemps(boostRestant));
      ecrireStyle(boostEl, "display", "block");
    } else {
      ecrireStyle(boostEl, "display", "none");
    }
  }

  RESOURCE_PAIRS.forEach(function(pair) {
    var resKey = pair.procRes.replace(/([A-Z])/g, '-$1').toLowerCase();
    afficherTauxNet("taux-" + resKey, pair.procUnlocked(u) ? tauxProductionTransformee(pair) : 0);
  });
}

function afficherTauxNet(elementId, net) {
  const el = domParId(elementId);
  if (!el) return;
  if (Math.abs(net) < 0.0005) {
    ecrireTexte(el, "");
    basculerClasse(el, "ressource-taux-positif", false);
    basculerClasse(el, "ressource-taux-negatif", false);
    return;
  }
  const parMin = net * 60;
  ecrireTexte(el, (parMin > 0 ? "+" : "") + parMin.toFixed(2) + "/m");
  basculerClasse(el, "ressource-taux-positif", net > 0);
  basculerClasse(el, "ressource-taux-negatif", net < 0);
}

// ── 9b. Catch sequence (header)
function renduSequence() {
  const enCours = etat.sequenceEnCours;
  const restant = etat.afficherTempsAjusteRecrutement
    ? tempsRestantSequence() / vitesseAttrapage()
    : tempsRestantSequence();
  const btnSeq   = domParId("bouton-sequence");
  const recruit  = etat.chatons >= 3;
  ecrirePropriete(btnSeq, "disabled", enCours);
  basculerClasse(btnSeq, "recruit", recruit);
  ecrireTexte(btnSeq, enCours
    ? (recruit ? formaterTemps(restant) : "Catching... " + formaterTemps(restant))
    : (recruit ? "Recruit a Kitty" : "Catch a kitty"));
  ecrireStyle(domParId("conteneur-barre-sequence"), "display", enCours ? "block" : "none");
  setBarreProgress("barre-sequence", progressionSequence());
  ecrireTexte(domParId("info-sequence"), enCours ? ""
    : ("Next: " + formaterTemps(dureeEffective())));

  renduStatsAttrapage();
}

// ── 9b-bis. Catching stats popover
let statsAttrapageOuvert = false;

function definirStatsAttrapageOuvert(ouvert) {
  statsAttrapageOuvert = Boolean(ouvert);
  const popover = document.getElementById("popover-stats-attrapage");
  const bouton  = document.getElementById("bouton-stats-attrapage");
  popover.style.display = statsAttrapageOuvert ? "flex" : "none";
  popover.setAttribute("aria-hidden", statsAttrapageOuvert ? "false" : "true");
  bouton.setAttribute("aria-expanded", statsAttrapageOuvert ? "true" : "false");
  bouton.setAttribute("aria-label", statsAttrapageOuvert ? "Hide catching stats" : "Show catching stats");
  if (statsAttrapageOuvert) renduStatsAttrapage();
}

function toggleStatsAttrapage() {
  definirStatsAttrapageOuvert(!statsAttrapageOuvert);
}

function formaterTempsStat(sec) {
  return sec <= 0 ? "0s" : formaterTemps(sec);
}

function renduStatsAttrapage() {
  if (!statsAttrapageOuvert) return;

  const raw         = dureeBrute();
  const taux        = vitesseAttrapage();
  const recruitPerk = etat.spherePerks && etat.spherePerks['gl-rec'] === 'learned';
  const tauxHouses  = recruitPerk ? taux / gangLeaderBonus() : taux;
  const restant     = etat.sequenceEnCours ? tempsRestantSequence() / taux : raw / taux;

  document.getElementById("stat-raw").textContent     = formaterTempsStat(raw);
  document.getElementById("stat-taux").textContent    = tauxHouses.toFixed(2) + "s/s";
  const glRow = document.getElementById("stat-gl-row");
  if (glRow) {
    glRow.style.display = recruitPerk ? "" : "none";
    document.getElementById("stat-gl-bonus").textContent = "×" + gangLeaderBonus().toFixed(2);
  }
  document.getElementById("stat-taux-total").textContent = taux.toFixed(2) + "s/s";
  document.getElementById("stat-adjusted").textContent   = formaterTempsStat(restant);
}

document.addEventListener("click", function(e) {
  if (!statsAttrapageOuvert) return;
  const wrapper   = document.getElementById("stats-attrapage-wrapper");
  const catchBtn  = document.getElementById("bouton-sequence");
  if (wrapper && !wrapper.contains(e.target) && e.target !== catchBtn) {
    definirStatsAttrapageOuvert(false);
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape" || !statsAttrapageOuvert) return;
  definirStatsAttrapageOuvert(false);
  document.getElementById("bouton-stats-attrapage").focus();
});

// ── 9c. Work pairs (raw resource ➜ its processed output, shown as one linked card)
const RESOURCE_PAIRS = [
  {
    rawAction: "woodcatting", rawRes: "cardboardPieces", rawCfg: CONFIG.woodcatting,
    rawUnlocked: function(u) { return u.cathering; },
    procAction: "sawmill", procRes: "cardboardPlanks", procCfg: CONFIG.sawmill,
    procSecUnite: "secondesParPlanche", procSecRaw: "secondesParCardboard",
    procMultAction: "sawmill", procUnlocked: function(u) { return u.scierie; },
    bloqueeKey: "scieriBloquee"
  },
  {
    rawAction: "basicWoodcatting", rawRes: "basicWood", rawCfg: CONFIG.basicWoodcatting,
    rawUnlocked: function(u) { return u.basicWood; },
    procAction: "basicSawmill", procRes: "basicWoodPlanks", procCfg: CONFIG.basicSawmill,
    procSecUnite: "secondesParPlanche", procSecRaw: "secondesParBasicWood",
    procMultAction: "sawmill", procUnlocked: function(u) { return u.basicSawmill; },
    bloqueeKey: "basicSawmillBloquee"
  },
  {
    rawAction: "grasscatting", rawRes: "catnip", rawCfg: CONFIG.grasscatting,
    rawUnlocked: function(u) { return u.grasscat; },
    procAction: "catchen", procRes: "salads", procCfg: CONFIG.catchen,
    procSecUnite: "secondesParSalad", procSecRaw: "secondesParCatnip",
    procMultAction: "catchen", procUnlocked: function(u) { return u.catchen; },
    bloqueeKey: "catchenBloquee"
  },
  {
    rawAction: "fishcatting", rawRes: "anchovy", rawCfg: CONFIG.fishcatting,
    rawUnlocked: function(u) { return u.anchovy; },
    procAction: "grilledAnchovy", procRes: "grilledAnchovy", procCfg: CONFIG.grilledAnchovy,
    procSecUnite: "secondesParRecette", procSecRaw: "secondesParAnchovy",
    procMultAction: "grilledAnchovy", procUnlocked: function(u) { return u.grilledAnchovy; },
    bloqueeKey: "catchenAnchovyBloquee"
  },
  {
    rawAction: "pebblegathering", rawRes: "pebbles", rawCfg: CONFIG.pebblegathering,
    rawUnlocked: function(u) { return u.pebblecat; },
    procAction: "brickfactory", procRes: "pebbleBricks", procCfg: CONFIG.brickfactory,
    procSecUnite: "secondesParBrique", procSecRaw: "secondesParPebble",
    procMultAction: "brickfactory", procUnlocked: function(u) { return u.brickfact; },
    bloqueeKey: "brickBloquee"
  },
  {
    rawAction: "rockgathering", rawRes: "rocks", rawCfg: CONFIG.rockgathering,
    rawUnlocked: function(u) { return u.rockcat; },
    procAction: "rockFactory", procRes: "rockBricks", procCfg: CONFIG.rockFactory,
    procSecUnite: "secondesParBrique", procSecRaw: "secondesParRock",
    procMultAction: "rockFactory", procUnlocked: function(u) { return u.rockfact; },
    bloqueeKey: "rockFactoryBloquee"
  }
];

// Units/second produced by every filled raw-gathering slot (matches tickWorkers exactly)
function tauxProductionBrute(action, cfg) {
  const slots = etat.workers[action];
  if (!slots) return 0;
  const mult = multiplicateurFamille(action);
  const gl   = gangLeaderBonus();
  let rate = 0;
  slots.forEach(function(s) {
    if (s.kittyIndex === null) return;
    const k = etat.kittiesData[s.kittyIndex];
    const levelBonus = k ? Math.pow(1.1, k.niveau) : 1;
    rate += mult * gl * levelBonus / cfg.secondesParUnite;
  });
  return rate;
}

// Units/second of processed output — sums per-kitty Processed Resources Production bonus
function tauxProductionTransformee(pair) {
  const slots = etat.workers[pair.procAction];
  if (!slots) return 0;
  const mult = multiplicateurFamille(pair.procMultAction);
  const gl   = gangLeaderBonus();
  let rate = 0;
  slots.forEach(function(s) {
    if (s.kittyIndex === null) return;
    rate += mult * gl * productionProcBonus(etat.kittiesData[s.kittyIndex]) / pair.procCfg[pair.procSecUnite];
  });
  return rate;
}

function buildPairDetail(baseTime, managerAction, workerAction, isProc) {
  // Manager info
  const famille = MAP_FAMILLE[managerAction];
  const managerIdx = famille ? etat.managers[famille] : undefined;
  const managerKitty = (managerIdx !== null && managerIdx !== undefined) ? etat.kittiesData[managerIdx] : null;
  const mgrValid = managerKitty && METIER_PAR_FAMILLE[famille] && METIER_PAR_FAMILLE[famille].includes(managerKitty.metier);
  const mgrMult = mgrValid ? (managerKitty.managerMult || 2) * jobLevelMultiplier(managerKitty) : 1;

  // Gang leader info
  const glKitty = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
  const glMult = gangLeaderBonus();

  const totalMult = mgrMult * glMult;
  const adjTime = Math.round(baseTime / totalMult);

  // Active workers
  const slots = etat.workers[workerAction] || [];
  const activeSlots = slots.filter(function(s) { return s.kittyIndex !== null; });
  const activeCount = activeSlots.length;

  var html = '<div class="pinfo-sep"></div>';
  html += '<div class="pinfo-row"><span class="pinfo-lbl">Base time</span><span class="pinfo-val">' + formaterTemps(baseTime) + '</span></div>';

  if (mgrValid) {
    html += '<div class="pinfo-row pinfo-bonus"><span class="pinfo-lbl">Manager · ' + managerKitty.nom + '</span><span class="pinfo-val">×' + mgrMult.toFixed(2) + '</span></div>';
  } else if (etat.managersDebloques) {
    html += '<div class="pinfo-row pinfo-bonus-none"><span class="pinfo-lbl">No manager</span></div>';
  }
  if (glKitty) {
    html += '<div class="pinfo-row pinfo-bonus"><span class="pinfo-lbl">Gang Leader · ' + glKitty.nom + '</span><span class="pinfo-val">×' + glMult.toFixed(2) + '</span></div>';
  }

  if (totalMult > 1.005) {
    html += '<div class="pinfo-row pinfo-row-adj"><span class="pinfo-lbl">Adjusted time</span><span class="pinfo-val">' + formaterTemps(adjTime) + '</span></div>';
  }

  if (activeCount > 0) {
    activeSlots.forEach(function(s) {
      const k = etat.kittiesData[s.kittyIndex];
      const lvl        = k ? k.niveau : 0;
      const bonus      = isProc ? Math.pow(1.05, lvl) : Math.pow(1.1, lvl);
      const ratePerMin = mgrMult * glMult * bonus / baseTime * 60;
      const name       = k ? k.nom : '?';
      const boostStr   = lvl > 0 ? ' (×' + bonus.toFixed(2) + ')' : '';
      html += '<div class="pinfo-row"><span class="pinfo-lbl">' + name + boostStr + '</span><span class="pinfo-val">' + ratePerMin.toFixed(2) + '/min</span></div>';
    });
  }

  return html;
}

const _pairDetailCache = new Map();

function buildPairDetailCache(baseTime, managerAction, workerAction, isProc) {
  const famille = MAP_FAMILLE[managerAction];
  const managerIdx = famille ? etat.managers[famille] : null;
  const managerKitty = managerIdx !== null && managerIdx !== undefined ? etat.kittiesData[managerIdx] : null;
  const glIdx = etat.kittiesData.findIndex(function(k) { return k.metier === "gang-leader"; });
  const glKitty = glIdx >= 0 ? etat.kittiesData[glIdx] : null;
  const workerKey = (etat.workers[workerAction] || []).map(function(slot) {
    if (slot.kittyIndex === null) return "-";
    const kitty = etat.kittiesData[slot.kittyIndex];
    return slot.kittyIndex + ":" + (kitty ? kitty.nom + ":" + kitty.niveau : "?");
  }).join(",");
  const cacheId = baseTime + "|" + managerAction + "|" + workerAction + "|" + (isProc ? 1 : 0);
  const stateKey = [
    etat.managersDebloques ? 1 : 0,
    managerIdx,
    managerKitty ? managerKitty.nom : "",
    managerKitty ? managerKitty.metier : "",
    managerKitty ? managerKitty.managerMult : "",
    managerKitty ? managerKitty.niveau : "",
    glIdx,
    glKitty ? glKitty.nom : "",
    glKitty ? glKitty.niveau : "",
    etat.kittiesData.length,
    workerKey
  ].join("|");
  const precedent = _pairDetailCache.get(cacheId);
  if (precedent && precedent.stateKey === stateKey) return precedent.html;
  const html = buildPairDetail(baseTime, managerAction, workerAction, isProc);
  _pairDetailCache.set(cacheId, { stateKey: stateKey, html: html });
  return html;
}

function raisonVerrouillageTransformation(pair) {
  const progressions = {
    sawmill:      { label: "Cardboard Pieces", actuel: etat.cardboardPiecesTotalRecolte, cible: CONFIG.sawmill.deblocageA },
    catchen:      { label: "Catnip", actuel: etat.catnipTotalRecolte, cible: CONFIG.catchen.deblocageA },
    brickfactory: { label: "Pebbles", actuel: etat.pebblesTotalRecolte, cible: CONFIG.brickfactory.deblocageA }
  };
  const progression = progressions[pair.procAction];
  if (!progression) return "Continue progressing to unlock this workshop";
  return "Gather " + progression.cible + " " + progression.label + " (" + Math.min(Math.floor(progression.actuel), progression.cible) + "/" + progression.cible + ")";
}

function renduPaireRessource(pair, u) {
  const qtyRawEl = domParId("pqty-" + pair.rawRes);
  ecrireTexte(qtyRawEl, formaterNombre(etat[pair.rawRes]));
  const qtyProcEl = domParId("pqty-" + pair.procRes);
  ecrireTexte(qtyProcEl, formaterNombre(etat[pair.procRes]));

  // Adjusted production times + tooltip detail sections
  const gl = gangLeaderBonus();
  const rawAdj  = Math.round(pair.rawCfg.secondesParUnite / (multiplicateurFamille(pair.rawAction) * gl));
  const procAdj = Math.round(pair.procCfg[pair.procSecUnite] / (multiplicateurFamille(pair.procMultAction) * gl));
  const rawAdjStr  = formaterTemps(rawAdj);
  const procAdjStr = formaterTemps(procAdj);
  var el;
  el = domParId("ptadj-" + pair.rawRes);  ecrireTexte(el, rawAdjStr);
  el = domParId("ptime-" + pair.rawRes);  ecrireTexte(el, rawAdjStr);
  el = domParId("ptadj-" + pair.procRes); ecrireTexte(el, procAdjStr);
  el = domParId("ptime-" + pair.procRes); ecrireTexte(el, procAdjStr);
  el = domParId("pdetail-" + pair.rawRes);
  ecrireHTML(el, buildPairDetailCache(pair.rawCfg.secondesParUnite, pair.rawAction, pair.rawAction, false));
  el = domParId("pdetail-" + pair.procRes);
  ecrireHTML(el, buildPairDetailCache(pair.procCfg[pair.procSecUnite], pair.procMultAction, pair.procAction, true));

  updateWorkerSlotUI(pair.rawAction, 0);
  updateWorkerSlotUI(pair.rawAction, 1);

  const rawRate  = tauxProductionBrute(pair.rawAction, pair.rawCfg);
  const procUnlocked = pair.procUnlocked(u);

  const sideProcEl = domParId("pairside-" + pair.procAction);
  basculerClasse(sideProcEl, "pair-side-verrouille", !procUnlocked);
  if (!procUnlocked) {
    const raison = raisonVerrouillageTransformation(pair);
    sideProcEl.dataset.lockReason = raison;
    sideProcEl.setAttribute("aria-label", "Locked. " + raison);
  } else {
    delete sideProcEl.dataset.lockReason;
    sideProcEl.removeAttribute("aria-label");
  }

  const feedEl = domParId("pfeed-" + pair.procAction);

  if (!procUnlocked) {
    afficherTauxNet("prate-" + pair.rawRes, rawRate);
    const rateProcEl = domParId("prate-" + pair.procRes);
    ecrireTexte(rateProcEl, "");
    ecrireHTML(feedEl, "");
    ecrirePropriete(feedEl, "title", "");
    return;
  }

  updateWorkerSlotUI(pair.procAction, 0);
  updateWorkerSlotUI(pair.procAction, 1);

  const procOutRate  = tauxProductionTransformee(pair);
  const procConsRate = procOutRate * (pair.procCfg[pair.procSecUnite] / pair.procCfg[pair.procSecRaw]);

  afficherTauxNet("prate-" + pair.rawRes,  rawRate - procConsRate);
  afficherTauxNet("prate-" + pair.procRes, procOutRate);

  if (feedEl) {
    const consommateurActif = allocationCount(pair.procAction) > 0;
    if (!consommateurActif) {
      ecrireHTML(feedEl, "");
      ecrirePropriete(feedEl, "title", "");
    } else if (etat[pair.bloqueeKey]) {
      ecrireHTML(feedEl, "⏸");
      ecrirePropriete(feedEl, "title", "Out of stock");
    } else if (rawRate - procConsRate < -0.0005) {
      ecrireHTML(feedEl, "⚠️");
      ecrirePropriete(feedEl, "title", "Running low — raw production can't keep up");
    } else {
      ecrireHTML(feedEl, CHECK_ICON);
      ecrirePropriete(feedEl, "title", "Well fed");
    }
  }
}

function renduWorkPairs(u) {
  // Filter bar visibility — each button appears only when its family is unlocked
  const setDisplay = function(id, show) { ecrireStyle(domParId(id), "display", show ? "" : "none"); };
  setDisplay("filtre-work-wood", u.cathering);
  setDisplay("filtre-work-food", u.grasscat);
  setDisplay("filtre-work-rock", u.pebblecat || u.rockcat);
  setDisplay("filtre-work-all",  u.grasscat || u.pebblecat || u.rockcat);
  const filtresBar = document.querySelector(".work-filtres");
  ecrireStyle(filtresBar, "display", u.cathering ? "" : "none");

  const sectionEl = domParId("section-work-pairs");
  if (!u.cathering) { ecrireStyle(sectionEl, "display", "none"); return; }
  ecrireStyle(sectionEl, "display", "");
  const indiceEl = domParId("work-discovery-hint");
  if (indiceEl) ecrireStyle(indiceEl, "display", localStorage.getItem("workDetailsHintSeen") ? "none" : "flex");

  // Gang Leader passive speed banner
  const banner = domParId("gang-leader-banner");
  if (banner) {
    const gl = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
    if (gl) {
      const mult = gangLeaderBonus();
      ecrireStyle(banner, "display", "");
      ecrireHTML(banner, "👑 <strong>" + gl.nom + "</strong> is leading the gang — ×" + mult.toFixed(2) + " work speed (" + etat.kittiesData.length + " cats · " + gl.nom + " Lvl " + gl.niveau + ")");
    } else {
      ecrireStyle(banner, "display", "none");
    }
  }

  const showWood = workFiltre === null || workFiltre === "wood";
  const showFood = (workFiltre === null || workFiltre === "food") && u.grasscat;
  const showRock = (workFiltre === null || workFiltre === "rock") && (u.pebblecat || u.rockcat);

  ecrireStyle(domParId("famille-wood"), "display", showWood ? "block" : "none");
  ecrireStyle(domParId("famille-food"), "display", showFood ? "block" : "none");
  ecrireStyle(domParId("famille-rock"), "display", showRock ? "block" : "none");

  if (showWood) { renderManagerSlot("wood"); renderManagerSlot("sawmill"); }
  if (showFood) { renderManagerSlot("food"); renderManagerSlot("catchen"); }
  if (showRock) { renderManagerSlot("rock"); renderManagerSlot("pawsonry"); }

  const setRowDisplay = function(id, show) { ecrireStyle(domParId(id), "display", show ? "flex" : "none"); };
  setRowDisplay("sep-basicWoodcatting", u.basicWood);
  setRowDisplay("pairside-basicSawmill", u.basicWood);
  setRowDisplay("sep-fishcatting", u.anchovy);
  setRowDisplay("pairside-grilledAnchovy", u.anchovy);
  setRowDisplay("sep-rockgathering", u.rockcat);
  setRowDisplay("pairside-rockFactory", u.rockcat);

  if (showWood)               renduPaireRessource(RESOURCE_PAIRS[0], u);
  if (showWood && u.basicWood) renduPaireRessource(RESOURCE_PAIRS[1], u);
  if (showFood)               renduPaireRessource(RESOURCE_PAIRS[2], u);
  if (showFood && u.anchovy)  renduPaireRessource(RESOURCE_PAIRS[3], u);
  if (showRock)               renduPaireRessource(RESOURCE_PAIRS[4], u);
  if (showRock && u.rockcat)  renduPaireRessource(RESOURCE_PAIRS[5], u);
}

// Mobile: tapping a resource icon reveals its name/time/cost tooltip (.pair-info).
// Desktop is unaffected — that info is already shown inline there.
(function() {
  const section = document.getElementById("section-work-pairs");
  if (!section) return;
  section.querySelectorAll(".pair-icon").forEach(function(icon) {
    rendreActivableClavier(icon, "Show details for " + (icon.alt || "this resource"));
    icon.setAttribute("aria-expanded", "false");
  });

  function fermerInfosPaires() {
    document.querySelectorAll(".pair-row.pair-info-ouverte").forEach(function(r) {
      r.classList.remove("pair-info-ouverte");
      const trigger = r.querySelector(".pair-icon[data-clavier-clic]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  section.addEventListener("click", function(e) {
    const icon = e.target.closest(".pair-icon");
    if (!icon) return;
    const row = icon.closest(".pair-row");
    if (!row) return;
    const dejaOuverte = row.classList.contains("pair-info-ouverte");
    fermerInfosPaires();
    if (!dejaOuverte) {
      row.classList.add("pair-info-ouverte");
      icon.setAttribute("aria-expanded", "true");
    }
    localStorage.setItem("workDetailsHintSeen", "1");
    const indice = document.getElementById("work-discovery-hint");
    if (indice) indice.style.display = "none";
    e.stopPropagation();
  });
  document.addEventListener("click", function() {
    fermerInfosPaires();
  });
  // Desktop: position fixed tooltip so it appears below the hovered row without clipping.
  section.addEventListener("mouseover", function(e) {
    const row = e.target.closest(".pair-row");
    if (!row) return;
    const info = row.querySelector(".pair-info");
    if (!info) return;
    const rect = row.getBoundingClientRect();
    info.style.top   = rect.bottom + "px";
    info.style.left  = rect.left + "px";
    info.style.width = rect.width + "px";
  });
})();

// ── 9d. Buildings section
function renduBuildings(u) {
  if (!u.buildings) return;

  // ── Wood Houses
  const cout = coutProchaineCathouse();
  ecrireTexte(domParId("possede-cathouse"), etat.cathouses.length);
  ecrireTexte(domParId("cout-cathouse"), cout);
  ecrirePropriete(domParId("bouton-cathouse"), "disabled", etat.cardboardPlanks < cout);
  const builderBonus = builderManagerBonus();
  const speedBox = etat.cathouses.length * CONFIG.cathouse.reductionParSeconde * builderBonus;
  ecrireTexte(domParId("reduction-active"), etat.cathouses.length > 0
    ? "+" + (Number.isInteger(speedBox) ? speedBox : speedBox.toFixed(2)) + "s/s recruit speed" : "");

  ecrireStyle(domParId("bloc-wood-cathouse"), "display", u.catHouse ? "flex" : "none");
  if (u.catHouse) {
    const cout2 = coutProchaineCatHouse();
    ecrireTexte(domParId("possede-cathouse2"), etat.cathouseCount);
    ecrireTexte(domParId("cout-cathouse2"), cout2);
    ecrirePropriete(domParId("bouton-cathouse2"), "disabled", etat.basicWoodPlanks < cout2);
    const speedCat = etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde * builderBonus;
    ecrireTexte(domParId("reduction-wood-cathouse"), etat.cathouseCount > 0
      ? "+" + (Number.isInteger(speedCat) ? speedCat : speedCat.toFixed(2)) + "s/s recruit speed" : "");
  }

  renderManagerSlot("houses");

  // ── Stone Houses
  const secStone = domParId("section-stone-houses");
  ecrireStyle(secStone, "display", u.stoneHouses ? "" : "none");
  if (u.stoneHouses) {
    const sc = coutProchaineStoneCathouse();
    const btnSC = domParId("bouton-stone-cathouse");
    ecrirePropriete(btnSC, "disabled", etat.basicWoodPlanks < sc.planks || etat.pebbleBricks < sc.bricks);
    ecrireTexte(domParId("cout-stone-planks"), sc.planks);
    ecrireTexte(domParId("cout-stone-bricks"), sc.bricks);
    ecrireTexte(domParId("possede-stone-cathouse"), etat.stoneCathouseCount);
    const stoneSpeed = Math.round(etat.stoneCathouseCount * CONFIG.stoneCathouse.speedBonus * 100);
    ecrireTexte(domParId("reduction-stone-cathouse"), etat.stoneCathouseCount > 0
      ? "+" + stoneSpeed + "% recruit speed" : "");
  }
}

// ── 9e. Facilities section
function renduFacilities(u) {
  if (!u.jobCenter) return;
  const btnJC = domParId("bouton-jobcenter");
  ecrirePropriete(btnJC, "disabled", etat.jobCenterConstruit || etat.pebbleBricks < 10 || etat.basicWoodPlanks < 1);
  ecrireHTML(btnJC, etat.jobCenterConstruit ? CHECK_ICON + " Built" :
    '10 <img class="cout-icone" src="img/resources/Pebble Brick_Final.png" alt="Pebble Brick"> + 1 <img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank">');
  const jcIface = domParId("jc-interface");
  ecrireStyle(jcIface, "display", etat.jobCenterConstruit ? "block" : "none");
  if (etat.jobCenterConstruit) renduJobCenter(u);

  const secTC = domParId("section-training-center");
  if (secTC) {
    ecrireStyle(secTC, "display", u.trainingCenter ? "" : "none");
    if (u.trainingCenter) {
      const btnTC = domParId("bouton-training-center");
      if (btnTC) {
        ecrirePropriete(btnTC, "disabled", etat.trainingCenterConstruit || etat.rockBricks < 10 || etat.basicWoodPlanks < 20);
        ecrireHTML(btnTC, etat.trainingCenterConstruit ? CHECK_ICON + " Built" :
          '10 <img class="cout-icone" src="img/resources/Rock Brick_Final.png" alt="Rock Brick"> + 20 <img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank">');
      }
      const tcIface = domParId("tc-interface");
      ecrireStyle(tcIface, "display", etat.trainingCenterConstruit ? "block" : "none");
      if (etat.trainingCenterConstruit) renduTrainingCenter();
    }
  }
}

// ── 9f-ii. Training Center specialization
function renduTrainingCenter() {
  const el = document.getElementById("tc-interface");
  if (!el || !etat.trainingCenterConstruit) return;

  const k = tcSpecKittySelectionne !== null ? etat.kittiesData[tcSpecKittySelectionne] : null;
  const key = (tcSpecKittySelectionne ?? '') + '|' + (k ? k.metier + '|' + k.jobNiveau : '');
  if (key === _tcKey) return;
  _tcKey = key;

  let html = '<div class="jc-section-titre">Job Specialization</div>';

  if (tcSpecKittySelectionne !== null) {
    const kitty = etat.kittiesData[tcSpecKittySelectionne];
    const m   = kitty && kitty.metier ? METIERS[kitty.metier] : null;
    const _tlvl = kitty && kitty.metier ? jobLevelInfo(kitty.metier) : { cur: 1, max: 1 };
    html += '<div class="jc-slot-wrap">';
    html += '<div class="jc-slot-filled" data-jc-modal-trigger="spec"' + attributsActivationClavier("Change the cat selected for specialization") + ' onclick="ouvrirModalJC(\'spec\')">';
    html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
    html += '<div class="jc-slot-info">';
    html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
    html += '<span class="jc-slot-metier">' + (m ? m.emoji + ' ' + m.nom : '?') + ' — Lv. ' + _tlvl.cur + ' / ' + _tlvl.max + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<button class="jc-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty ? kitty.nom : "cat") + ' from specialization" onclick="tcSpecKittySelectionne=null;renduTrainingCenter()"><img src="img/interface/Red Cross_Final.png?v=0.0028" alt=""></button>';
    html += '</div>';
    // Placeholder for sphere grid (populated after innerHTML is set)
    if (kitty && kitty.metier && SPHERE_GRIDS[kitty.metier]) {
      html += '<div id="sphere-grid-container" class="sphere-grid-wrapper"></div>';
    }
  } else {
    html += '<div class="jc-slot-empty" data-jc-modal-trigger="spec"' + attributsActivationClavier("Select a kitty to specialize") + ' onclick="ouvrirModalJC(\'spec\')">';
    html += '<span class="jc-slot-plus">+</span>';
    html += '<span class="jc-slot-label">Select a kitty</span>';
    html += '</div>';
  }

  el.innerHTML = html;

  // Render sphere grid after setting innerHTML (grid container was just created)
  if (k && k.metier && SPHERE_GRIDS[k.metier]) {
    renduSphereGrid(k.metier);
  }
}

function renduSphereGrid(jobId) {
  var containerEl = document.getElementById('sphere-grid-container');
  if (!containerEl) return;
  _sphereGridJob      = jobId;
  _sphereSelectionnee = null;

  var def = SPHERE_GRIDS[jobId];
  if (!def) { containerEl.innerHTML = ''; return; }

  var sphereMap = {};
  def.spheres.forEach(function(s) { sphereMap[s.id] = s; });

  // Resolve actual state: etat.spherePerks overrides the default s.etat
  function sphereEtat(s) {
    return (etat.spherePerks && etat.spherePerks[s.id]) || s.etat;
  }

  var parts = [];
  parts.push('<svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg" class="sphere-svg">');

  // Connections
  def.connections.forEach(function(conn) {
    var a = sphereMap[conn[0]], b = sphereMap[conn[1]];
    if (!a || !b) return;
    var learned = sphereEtat(a) === 'learned';
    parts.push(
      '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"'
      + ' stroke="' + (learned ? a.couleur : '#cccccc') + '" stroke-width="2"'
      + (learned ? '' : ' stroke-dasharray="6 4"') + '/>'
    );
  });

  // Spheres
  def.spheres.forEach(function(s) {
    var actualEtat = sphereEtat(s);
    var isLearned  = actualEtat === 'learned';
    var isUnlocked = actualEtat === 'unlocked';
    var fill, strokeColor, textColor, opacity;
    if (isLearned) {
      fill = s.couleur; strokeColor = 'rgba(255,255,255,0.5)'; textColor = '#ffffff'; opacity = 1;
    } else if (isUnlocked) {
      fill = '#ffffff'; strokeColor = s.couleur; textColor = s.couleur; opacity = 1;
    } else {
      fill = '#e8e8e8'; strokeColor = '#bbbbbb'; textColor = '#a0a0a0'; opacity = 0.6;
    }

    parts.push(
      '<g id="sphere-node-' + s.id + '"'
      + ((isLearned || isUnlocked) ? ' onclick="clickerSphere(\'' + s.id + '\')" style="cursor:pointer"' : '')
      + ' opacity="' + opacity + '">'
    );
    // Selection ring (hidden by default)
    parts.push(
      '<circle id="sphere-ring-' + s.id + '" cx="' + s.x + '" cy="' + s.y + '" r="' + (s.r + 7) + '"'
      + ' fill="none" stroke="#ffc940" stroke-width="2.5" opacity="0"/>'
    );
    parts.push(
      '<circle cx="' + s.x + '" cy="' + s.y + '" r="' + s.r + '"'
      + ' fill="' + fill + '" stroke="' + strokeColor + '" stroke-width="' + (isLearned ? 2.5 : 2) + '"/>'
    );
    // Label (split on spaces, one tspan per word)
    var words = s.nom.split(' ');
    var fontSize = s.r >= 32 ? 10 : (s.r >= 28 ? 9 : 8);
    var lineH    = fontSize + 2.5;
    var baseY    = s.y - (words.length - 1) * lineH / 2;
    words.forEach(function(w, i) {
      parts.push(
        '<text x="' + s.x + '" y="' + (baseY + i * lineH + fontSize * 0.38).toFixed(1) + '"'
        + ' text-anchor="middle" font-size="' + fontSize + 'px" font-weight="900"'
        + ' font-family="\'Nunito\',sans-serif" fill="' + textColor + '" pointer-events="none">'
        + w + '</text>'
      );
    });
    parts.push('</g>');
  });

  parts.push('</svg>');

  containerEl.innerHTML = parts.join('')
    + '<div class="sphere-detail-panel" id="sphere-detail-panel">'
    + '<div class="sphere-detail-nom" id="sphere-detail-nom">Select a perk to see its description.</div>'
    + '<div class="sphere-detail-desc" id="sphere-detail-desc"></div>'
    + '</div>';
}

function clickerSphere(sphereId) {
  // Deselect previous
  if (_sphereSelectionnee) {
    var prevRing = document.getElementById('sphere-ring-' + _sphereSelectionnee);
    if (prevRing) prevRing.setAttribute('opacity', '0');
  }
  // Toggle: click same sphere again to deselect
  if (_sphereSelectionnee === sphereId) {
    _sphereSelectionnee = null;
    var nomEl  = document.getElementById('sphere-detail-nom');
    var descEl = document.getElementById('sphere-detail-desc');
    if (nomEl)  nomEl.textContent  = 'Select a perk to see its description.';
    if (descEl) descEl.textContent = '';
    return;
  }
  _sphereSelectionnee = sphereId;
  var ring = document.getElementById('sphere-ring-' + sphereId);
  if (ring) ring.setAttribute('opacity', '1');
  // Find sphere data
  var def    = _sphereGridJob ? SPHERE_GRIDS[_sphereGridJob] : null;
  var sphere = def ? def.spheres.find(function(s) { return s.id === sphereId; }) : null;
  var actualEtat = sphere ? ((etat.spherePerks && etat.spherePerks[sphere.id]) || sphere.etat) : null;
  var nomEl  = document.getElementById('sphere-detail-nom');
  var descEl = document.getElementById('sphere-detail-desc');
  if (nomEl)  nomEl.textContent = sphere ? sphere.nom : '';
  if (descEl) {
    var learnHtml = '';
    if (actualEtat === 'unlocked' && sphere && sphere.cout) {
      var cout = sphere.cout;
      var canAfford = Object.keys(cout).every(function(res) { return (etat[res] || 0) >= cout[res]; });
      var coutLabel = Object.keys(cout).map(function(res) {
        var noms = { cannedCatFood: 'Canned Cat Food' };
        return cout[res] + ' ' + (noms[res] || res);
      }).join(', ');
      learnHtml = '<div class="sphere-cout">'
        + '<span class="sphere-cout-label">Cost: ' + coutLabel + '</span>'
        + (canAfford
            ? '<button class="sphere-learn-btn" onclick="apprendrePerk(\'' + sphereId + '\')">Learn</button>'
            : '<button class="sphere-learn-btn sphere-learn-disabled" disabled>Not enough resources</button>')
        + '</div>';
    }
    descEl.innerHTML = (sphere ? '<p class="sphere-desc-texte">' + sphere.desc + '</p>' : '') + learnHtml;
  }
}

function apprendrePerk(sphereId) {
  if (!etat.spherePerks) etat.spherePerks = {};
  var def    = _sphereGridJob ? SPHERE_GRIDS[_sphereGridJob] : null;
  var sphere = def ? def.spheres.find(function(s) { return s.id === sphereId; }) : null;
  // Check and deduct cost
  if (sphere && sphere.cout) {
    var canAfford = Object.keys(sphere.cout).every(function(res) { return (etat[res] || 0) >= sphere.cout[res]; });
    if (!canAfford) { afficherNotification("Not enough resources to learn this perk."); return; }
    Object.keys(sphere.cout).forEach(function(res) { etat[res] -= sphere.cout[res]; });
  }
  etat.spherePerks[sphereId] = 'learned';
  // Unlock children of this sphere
  if (def) {
    def.connections.forEach(function(conn) {
      if (conn[0] === sphereId && !etat.spherePerks[conn[1]]) {
        etat.spherePerks[conn[1]] = 'unlocked';
      }
    });
  }
  // Retroactively halve active scouting duration if Bernardo just learned gl-explo
  if (sphereId === 'gl-explo') {
    var glIdx = etat.kittiesData.findIndex(function(k) { return k.metier === 'gang-leader'; });
    if (glIdx !== -1) {
      Object.keys(etat.scoutingsEnCours).forEach(function(sid) {
        var sc = etat.scoutingsEnCours[sid];
        if (sc.kittyIndex === glIdx) sc.duree = Math.ceil(sc.duree / 2);
      });
    }
  }
  sauvegarder();
  _tcKey = null; // force TC re-render so sphere grid rebuilds
  renduTrainingCenter();
  renduGangTools();
}

function specialiserJobKitty(index) {
  const kitty = etat.kittiesData[index];
  if (!kitty || !kitty.metier) return;
  kitty.jobNiveau = (kitty.jobNiveau || 0) + 1;
  const jobNom = METIERS[kitty.metier] ? METIERS[kitty.metier].nom : kitty.metier;
  afficherNotification(kitty.nom + "'s " + jobNom + " reached level " + kitty.jobNiveau + "!");
  ajouterLog("event", kitty.nom + " specialized in " + jobNom + " — now Lv. " + kitty.jobNiveau + ".");
  renduTrainingCenter();
  sauvegarder();
}

function jobLevelInfo(metier) {
  var grid = SPHERE_GRIDS[metier];
  if (!grid) return { cur: 1, max: 1 };
  var cur = grid.spheres.filter(function(s) {
    return (etat.spherePerks && etat.spherePerks[s.id] === 'learned') || s.etat === 'learned';
  }).length;
  return { cur: cur, max: grid.spheres.length };
}

// ── 9g. Management tab
let kittySelectionnee = null;
let detailKittyMobileOuvert = false;

function selectionnerKitty(index) {
  const conserverFocus = document.activeElement && document.activeElement.dataset.kittyIndex === String(index);
  kittySelectionnee = index;
  detailKittyMobileOuvert = true;
  renduManagement();
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const vueMobile = matchMedia("(max-width: 768px)").matches;
      const cible = vueMobile
        ? document.querySelector("#detail-kitty .bouton-retour-mobile")
        : document.querySelector('.kitty-carte[data-kitty-index="' + index + '"]');
      if (cible) cible.focus();
    });
  }
}

function deselectionnerKitty() {
  detailKittyMobileOuvert = false;
  renduManagement();
  requestAnimationFrame(function() {
    const carte = document.querySelector('.kitty-carte[data-kitty-index="' + kittySelectionnee + '"]');
    if (carte) carte.focus();
  });
}

function renduGangTools() {
  var el = document.getElementById('gang-tools');
  if (!el) return;
  var qolLearned = etat.spherePerks && etat.spherePerks['gl-qol'] === 'learned';
  if (qolLearned) {
    el.style.display = 'block';
    el.innerHTML = '<button class="gang-tool-btn' + (_foodMgmtOuvert ? ' gang-tool-btn-actif' : '') + '" onclick="toggleFoodManagement()">Food Management</button>';
  } else {
    el.style.display = 'none';
  }
}

// ── Food Management ──────────────────────────────────────────────────────────
var _foodMgmtOuvert = false;
var _foodMgmtPct    = 50;

const FOOD_DISPLAY = {
  salads:           { nom: 'Catnip Salad',    sprite: 'img/resources/Catnip Salad_Final.png' },
  grilledAnchovy:   { nom: 'Grilled Anchovy', sprite: 'img/resources/Grilled Anchovy_Final.png' },
  humanLeftovers:   { nom: 'Human Leftovers', sprite: 'img/resources/Human Leftovers_Final.png' },
  humanWorkersFood: { nom: 'Workers Food',    sprite: 'img/resources/Human Workers Food_Final.png' }
};

function totalFoodXp() {
  return Object.keys(FOOD_XP).reduce(function(s, f) { return s + (etat[f] || 0) * FOOD_XP[f]; }, 0);
}

function toggleFoodManagement() {
  _foodMgmtOuvert = !_foodMgmtOuvert;
  var panel = document.getElementById('food-management-panel');
  if (panel) panel.style.display = _foodMgmtOuvert ? 'block' : 'none';
  if (_foodMgmtOuvert) renduFoodManagement();
  renduGangTools(); // update button active state
}

function setFoodMgmtPct(p) {
  _foodMgmtPct = p;
  renduFoodManagement();
}

function renduFoodManagement() {
  var panel = document.getElementById('food-management-panel');
  if (!panel) return;

  var totalXp = totalFoodXp();
  var xpPreview = Math.floor(totalXp * _foodMgmtPct / 100);

  var foodItems = Object.keys(FOOD_XP).filter(function(f) { return (etat[f] || 0) > 0; });
  var tableHtml;
  if (foodItems.length === 0) {
    tableHtml = '<div class="fm-empty">No food available.</div>';
  } else {
    tableHtml = '<div class="fm-grid">';
    foodItems.forEach(function(f) {
      var qty  = etat[f] || 0;
      var info = FOOD_DISPLAY[f] || { nom: f };
      var icone = info.sprite ? '<img class="fm-food-icone" src="' + info.sprite + '" alt="">' : '';
      tableHtml += '<div class="fm-cell">'
        + icone
        + '<span class="fm-cell-nom">' + info.nom + '</span>'
        + '<span class="fm-cell-detail">x' + qty + ' &middot; ' + FOOD_XP[f] + ' XP</span>'
        + '<span class="fm-cell-total">' + (qty * FOOD_XP[f]) + ' XP</span>'
        + '</div>';
    });
    tableHtml += '</div>';
    tableHtml += '<div class="fm-total">Total: <strong>' + totalXp + ' XP</strong></div>';
  }

  var pctBtns = [10, 25, 50, 100].map(function(p) {
    return '<button class="fm-pct-btn' + (_foodMgmtPct === p ? ' fm-pct-actif' : '') + '" onclick="setFoodMgmtPct(' + p + ')">' + p + '%</button>';
  }).join('');

  var noFood = totalXp === 0;

  panel.innerHTML = '<div class="fm-carte">'
    + '<div class="fm-titre">Food Management <button class="fm-fermer" onclick="toggleFoodManagement()">x</button></div>'
    + '<div class="fm-section-titre">Available food</div>'
    + tableHtml
    + '<div class="fm-section-titre">Amount to distribute</div>'
    + '<div class="fm-pct-btns">' + pctBtns + '</div>'
    + '<div class="fm-xp-preview">' + xpPreview + ' XP will be distributed (' + _foodMgmtPct + '%)</div>'
    + '<div class="fm-actions">'
    + '<button class="fm-action-btn" onclick="distribuerFood(\'egal\')"' + (noFood ? ' disabled' : '') + '>Distribute evenly</button>'
    + '<button class="fm-action-btn" onclick="distribuerFood(\'basniveau\')"' + (noFood ? ' disabled' : '') + '>Prioritize low-level cats</button>'
    + '</div>'
    + '<div class="fm-rules">'
    + '<div class="fm-rule"><span class="fm-rule-titre">Distribute evenly</span> Each cat receives the same amount of XP. Food is consumed in whole units — the actual percentage used may be slightly below the selected value if the XP does not divide evenly.</div>'
    + '<div class="fm-rule"><span class="fm-rule-titre">Prioritize low-level cats</span> Levels up the lowest-level cat first, then moves to the next, until the budget runs out. If a cat needs less XP than the smallest available food unit, one unit is consumed anyway — the excess XP is banked toward the cat\'s next level.</div>'
    + '</div>'
    + '</div>';
}

function distribuerFood(mode) {
  var totalXp  = totalFoodXp();
  var xpBudget = Math.floor(totalXp * _foodMgmtPct / 100);
  var nbChats  = etat.kittiesData.length;
  if (!xpBudget || !nbChats) { afficherNotification("No food to distribute."); return; }

  var foods = Object.keys(FOOD_XP).sort(function(a, b) { return FOOD_XP[a] - FOOD_XP[b]; });
  var totalLevelUps = 0;

  // Consume at most `cible` XP using floor division per food type (never overshoots).
  // If floor division yields 0 units for every type but stock exists and forceSingle is true,
  // consume exactly 1 unit of the smallest available food (handles "need 1 XP, only have 15-XP items").
  function consommerXp(cible, forceSingle) {
    var consomme = 0;
    foods.forEach(function(f) {
      var stock = etat[f] || 0;
      if (!stock) return;
      var reste  = cible - consomme;
      var units  = Math.min(Math.floor(reste / FOOD_XP[f]), stock);
      etat[f]   -= units;
      consomme  += units * FOOD_XP[f];
    });
    // If nothing was consumed but forced (e.g. needed=1, smallest unit=15), consume 1 of the smallest
    if (consomme === 0 && forceSingle) {
      for (var fi = 0; fi < foods.length; fi++) {
        if ((etat[foods[fi]] || 0) > 0) {
          etat[foods[fi]] -= 1;
          consomme = FOOD_XP[foods[fi]];
          break;
        }
      }
    }
    return consomme;
  }

  function donnerXp(k, xp) {
    k.xp += xp;
    while (k.xp >= xpPourNiveau(k.niveau)) {
      k.xp -= xpPourNiveau(k.niveau);
      k.niveau++;
      totalLevelUps++;
      ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
    }
  }

  if (mode === 'egal') {
    var xpParChat = Math.floor(xpBudget / nbChats);
    if (!xpParChat) { afficherNotification("Not enough XP to distribute evenly."); return; }
    // floor division: each cat gets at most xpParChat XP, no overshoot
    etat.kittiesData.forEach(function(k) { donnerXp(k, consommerXp(xpParChat, false)); });

  } else { // basniveau — level up lowest cats first (Option A)
    var budget = xpBudget;
    while (budget > 0) {
      var best = null, bestScore = Infinity;
      etat.kittiesData.forEach(function(k) {
        var needed = xpPourNiveau(k.niveau) - k.xp;
        var score  = k.niveau * 100000 + needed;
        if (score < bestScore) { bestScore = score; best = k; }
      });
      if (!best) break;
      var needed = xpPourNiveau(best.niveau) - best.xp;
      if (needed > budget) break;
      // forceSingle=true: if needed < smallest unit, consume 1 unit anyway (XP overflow goes to cat's bank)
      var gained = consommerXp(needed, true);
      if (gained === 0) break; // no food left at all
      budget -= gained;
      donnerXp(best, gained);
    }
  }

  verifierObjectifs();
  sauvegarder();
  var msg = totalLevelUps > 0
    ? totalLevelUps + " level-up" + (totalLevelUps > 1 ? "s" : "") + "!"
    : "XP distributed — no level-ups yet.";
  afficherNotification(msg);
  renduManagement();
  if (_foodMgmtOuvert) renduFoodManagement();
}

function renduManagement() {
  const liste  = document.getElementById("liste-kitties");
  const detail = document.getElementById("detail-kitty");
  const layout = document.getElementById("management-layout");
  if (!liste || !detail) return;

  renduGangTools();

  // Left: kitty list
  liste.innerHTML = "";
  if (etat.kittiesData.length === 0) {
    kittySelectionnee = null;
    detailKittyMobileOuvert = false;
    if (layout) layout.classList.remove("affiche-detail-mobile");
    liste.innerHTML = etatVideHtml("Your gang is waiting", "Catch your first kitty using the button above.");
    detail.innerHTML = etatVideHtml("No profile yet", "Your first recruit's details will appear here.");
    return;
  }

  if (kittySelectionnee === null || !etat.kittiesData[kittySelectionnee]) {
    kittySelectionnee = 0;
    detailKittyMobileOuvert = false;
  }
  if (layout) layout.classList.toggle("affiche-detail-mobile", detailKittyMobileOuvert);

  function creerCarteKitty(kitty, i) {
    const carte  = document.createElement("div");
    carte.className = "kitty-carte" + (kittySelectionnee === i ? " kitty-carte-active" : "");
    carte.onclick   = function() { selectionnerKitty(i); };

    const photo = document.createElement("div");
    photo.className   = "kitty-photo kitty-photo-tier-" + (kitty.tier || 0);
    photo.innerHTML = kittyIconHtml(kitty);

    const infos = document.createElement("div");
    infos.className = "kitty-infos";

    const tierIdx = kitty.tier || 0;

    const metierLabel = kitty.metier
      ? (METIERS[kitty.metier] ? METIERS[kitty.metier].emoji + " " + TIERS_KITTIES[tierIdx] + " " + METIERS[kitty.metier].nom : kitty.metier)
      : "Stray Cat";
    const alloc = kittyAllocationLabel(i);
    rendreActivableClavier(carte, kitty.nom + ", " + metierLabel + ", level " + kitty.niveau + ", " + alloc.text);
    carte.dataset.kittyIndex = String(i);
    carte.setAttribute("aria-pressed", kittySelectionnee === i ? "true" : "false");
    const spans = [
      { cls: "kitty-nom",    txt: kitty.nom },
      { cls: "kitty-metier" + (kitty.metier ? "" : " kitty-vagabond"), txt: metierLabel },
      { cls: "kitty-niveau", txt: "Lvl " + kitty.niveau },
      { cls: "kitty-statut " + alloc.cls, txt: alloc.text }
    ];
    spans.forEach(function(s) {
      const el = document.createElement("span");
      el.className   = s.cls;
      el.textContent = s.txt;
      infos.appendChild(el);
    });

    carte.appendChild(photo);
    carte.appendChild(infos);
    return carte;
  }

  const parNiveauDesc = function(a, b) { return b.kitty.niveau - a.kitty.niveau; };
  const entrees   = etat.kittiesData.map(function(kitty, i) { return { kitty: kitty, i: i }; });
  const avecJob   = entrees.filter(function(e) { return e.kitty.metier; }).sort(parNiveauDesc);
  const sansJob   = entrees.filter(function(e) { return !e.kitty.metier; }).sort(parNiveauDesc);

  avecJob.forEach(function(e) { liste.appendChild(creerCarteKitty(e.kitty, e.i)); });
  if (sansJob.length > 0) {
    const entete = document.createElement("div");
    entete.className   = "kitty-section-titre";
    entete.textContent = "JOBLESS";
    liste.appendChild(entete);
    sansJob.forEach(function(e) { liste.appendChild(creerCarteKitty(e.kitty, e.i)); });
  }

  // Right: detail panel
  const k       = etat.kittiesData[kittySelectionnee];
  const tierIdx = k.tier || 0;
  detail.innerHTML = "";

  const retour = document.createElement("button");
  retour.className   = "bouton-retour-mobile";
  retour.textContent = "← Back";
  retour.onclick      = deselectionnerKitty;
  detail.appendChild(retour);

  // Left: identity card
  const gauche = document.createElement("div");
  gauche.className = "detail-gauche";
  gauche.innerHTML =
    "<div class=\"kitty-photo detail-photo kitty-photo-tier-" + tierIdx + "\">" + kittyIconHtml(k) + "</div>" +
    "<div class=\"detail-nom\">" + k.nom + "</div>" +
    "<div class=\"detail-catch-info\">" + formaterCatchTime(k.catchTs) + "</div>" +
    "<div class=\"kitty-tier kitty-tier-" + tierIdx + " detail-tier-badge\">T" + tierIdx + " · " + TIERS_KITTIES[tierIdx] + "</div>";

  // Right: conditional sections
  const droite = document.createElement("div");
  droite.className = "detail-droite";
  let hasContent = false;

  // Experience section — only shown after first Catnip Salad ever crafted
  if (etat.premiereSaladeFaite) {
    hasContent = true;
    const xpNext = xpPourNiveau(k.niveau);
    const xpPct  = Math.min(100, Math.floor((k.xp / xpNext) * 100));
    const FOOD_LABELS = {
      salads:         { sprite: "img/resources/Catnip Salad_Final.png",    nom: "Salad" },
      grilledAnchovy: { sprite: "img/resources/Grilled Anchovy_Final.png", nom: "Grilled Anchovy" },
      humanLeftovers:   { sprite: "img/resources/Human Leftovers_Final.png",     nom: "Human Leftovers" },
      humanWorkersFood: { sprite: "img/resources/Human Workers Food_Final.png",  nom: "Workers Food" }
    };
    const feedBtns = Object.keys(FOOD_XP).filter(function(f) { return etat[f] > 0; }).map(function(f) {
      const info  = FOOD_LABELS[f] || { nom: f };
      const icone = info.sprite ? '<img class="cout-icone" src="' + info.sprite + '" alt="' + info.nom + '">' : "";
      return "<button class='btn-xp-feed' onclick='nourrir(" + kittySelectionnee + ",\"" + f + "\")'>" + icone + "<span class='xp-gain'>+" + FOOD_XP[f] + " XP</span><span class='xp-stock'>×" + etat[f] + "</span></button>";
    }).join("");
    const xpManquant   = xpNext - k.xp;
    const xpDisponible = Object.keys(FOOD_XP).reduce(function(s, f) { return s + etat[f] * FOOD_XP[f]; }, 0);
    const autoBtnDisabled = xpDisponible < xpManquant;
    const autoLevelBtn = "<button class='btn-xp-auto'" + (autoBtnDisabled ? " disabled" : "") + " onclick='nourrirAutoNiveau(" + kittySelectionnee + ")'>Auto-feed to next level <span class='xp-gain'>-" + xpManquant + " XP needed</span></button>";
    const levelBonuses = k.niveau > 0
      ? "<div class='xp-bonus-actifs'>" +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + Math.pow(1.1, k.niveau).toFixed(2) + "</span> Basic Production Bonus</span>" +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + Math.pow(1.05, k.niveau).toFixed(2) + "</span> Complex Production Bonus</span>" +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + ((k.managerMult || 2) * Math.pow(1.05, k.niveau)).toFixed(2) + "</span> Manager Speed Bonus</span>" +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>+" + k.niveau + "</span> Exploration Power</span>" +
        "</div>"
      : "";
    droite.innerHTML +=
      "<div class='detail-section'>" +
      "<div class='detail-section-titre'>Experience</div>" +
      "<div class='detail-level-row'><span class='detail-level-num'>Level " + k.niveau + "</span><span class='detail-xp-counter'>" + k.xp + " / " + xpNext + " XP</span></div>" +
      "<div class='conteneur-barre'><div class='barre barre-verte' style='width:" + xpPct + "%'></div></div>" +
      levelBonuses +
      autoLevelBtn +
      (feedBtns ? "<div class='xp-aliments'>" + feedBtns + "</div>" : "<div class='xp-aliments-vide'>No food available.</div>") +
      "</div>";
  }

  // Job section — only shown after Job Center is built
  if (etat.jobCenterDebloque) {
    hasContent = true;
    const jobName = k.metier ? (METIERS[k.metier] ? (TIERS_KITTIES[k.tier || 0] || "") + " " + METIERS[k.metier].nom : k.metier) : "Stray Cat";
    const jobBonus = k.metier ? (
      k.metier === "gang-leader"
        ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + gangLeaderBonus().toFixed(2) + "</span> Work speed for all workers<div class='bonus-sub'>Scales with gang size · own level amplifies</div></div>"
          + (etat.spherePerks && etat.spherePerks['gl-rec'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + gangLeaderBonus().toFixed(2) + "</span> Recruit speed (perk)</div>" : "")
          + (etat.spherePerks && etat.spherePerks['gl-explo'] === 'learned' ? "<div class='detail-job-bonus'>Halves scouting mission time (perk)</div>" : "")
        : k.metier === "explorator"
          ? "<div class='detail-job-bonus'>Halves scouting mission time</div>"
            + (etat.spherePerks && etat.spherePerks['ex-power'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>×1.5</span> Exploration Power (perk)</div>" : "")
            + (etat.spherePerks && etat.spherePerks['ex-food'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>×2</span> Canned Cat Food chance in scoutings (perk)</div>" : "")
            + (etat.spherePerks && etat.spherePerks['ex-luck'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>25%</span> chance to double scouting reward (perk)</div>" : "")
          : (METIERS[k.metier] ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + ((k.managerMult || 2) * jobLevelMultiplier(k)).toFixed(2) + "</span> production speed on " + METIERS[k.metier].familleNom + " when assigned as manager</div>" : "")
    ) : "";
    const _jlvl = jobLevelInfo(k.metier);
    const tcJobLvl = etat.trainingCenterConstruit && k.metier
      ? "<div class='detail-level-row'><span class='detail-level-num'>Level " + _jlvl.cur + " / " + _jlvl.max + "</span></div>"
      : "";
    droite.innerHTML +=
      "<div class='detail-section'>" +
      "<div class='detail-job-header'>" +
      "<span class='detail-section-titre'>Job</span>" +
      "<span class='detail-job-nom" + (k.metier ? "" : " kitty-vagabond") + "'>" + jobName + "</span>" +
      "</div>" +
      tcJobLvl +
      (jobBonus ? "<div>" + jobBonus + "</div>" : "") +
      "</div>";
  }

  const corps = document.createElement("div");
  corps.className = "detail-corps" + (hasContent ? "" : " detail-corps-solo");
  corps.appendChild(gauche);
  if (hasContent) corps.appendChild(droite);
  detail.appendChild(corps);
}

// ── 9h. Master render dispatcher
function rendu() {
  const u = unlocks();
  renduRessources(u);
  renduSequence();
  const ongletActif = document.body.dataset.ongletActif || "gang";
  if (ongletActif === "work")         renduWorkPairs(u);
  if (ongletActif === "buildings")    renduBuildings(u);
  if (ongletActif === "facilities")   renduFacilities(u);
  if (ongletActif === "explorations") renduExplorations(u);
  if (ongletActif === "inventaire")   renduInventaire(u);
}


// ════════════════════════════════════════════════════════════
// 9b. EXPLORATIONS RENDER
// ════════════════════════════════════════════════════════════

let workFiltre = null;  // null | "wood" | "food" | "rock"

function filtrerWork(filtre) {
  workFiltre = filtre;
  const cle = filtre || "all";
  ["all", "wood", "food", "rock"].forEach(function(f) {
    const el = document.getElementById("filtre-work-" + f);
    if (el) {
      el.classList.toggle("btn-filtre-work-actif", f === cle);
      el.setAttribute("aria-pressed", f === cle ? "true" : "false");
    }
  });
  rendu();
}

function deallouerTous() {
  Object.values(etat.workers).forEach(function(slots) {
    slots.forEach(function(s) { s.kittyIndex = null; s.progress = 0; });
  });
  sauvegarder(); rendu();
}

let exploKittiesSelectionnees = {};  // { campaignId: Array<kittyIndex|null> }
let scoutingsStagingKitty    = {};  // { scoutingId: kittyIndex } — staged but not yet sent
let exploTabDirty  = true;
let exploModalOuvert = null;  // { campId?, zoneId?, slotIndex } or null

let carteDirty            = true;
let carteZoneSelectionnee = "D1"; // Home is always accessible — show its missions right away
let carteExploSlots       = {};  // { zoneId: Array<kittyIndex|null> }
let _zoneInfoKey          = null; // cache key to skip innerHTML rebuild when nothing changed
let _tcKey                = null; // same pattern for Training Center

function totalKittiesSelectionnees() {
  return Object.values(exploKittiesSelectionnees).reduce(function(s, slots) {
    return s + (slots ? slots.filter(function(x) { return x !== null; }).length : 0);
  }, 0);
}

function kittyDejaSelectionnee(kittyIndex, excludeCampId, excludeSlotIndex) {
  return Object.keys(exploKittiesSelectionnees).some(function(campId) {
    const slots = exploKittiesSelectionnees[campId];
    if (!slots) return false;
    return slots.some(function(ki, si) {
      if (campId === excludeCampId && si === excludeSlotIndex) return false;
      return ki === kittyIndex;
    });
  });
}

const RECOMPENSE_LIVRES = {
  schoolGuide:      { emoji: LIVRE_ICONE, nom: "School guide on jobs" },
  fishingGuide:     { emoji: LIVRE_ICONE, nom: "Fishing Guide for Dummies" },
  constructionPlan: { emoji: LIVRE_ICONE, nom: "Construction Plan" },
  stoneGuide:       { emoji: LIVRE_ICONE, nom: "Stone Craft Guide" },
  seminarGuide:     { emoji: LIVRE_ICONE, nom: "Corporate Seminar Booklet" }
};

const RESOURCE_DISPLAY_NAMES = {
  humanLeftovers:   "Human Leftovers",
  cannedCatFood:    "Canned Cat Food",
  humanWorkersFood: "Human Workers Food",
};

function recompenseLabel(camp) {
  const id = camp.recompense;
  const livre = id && RECOMPENSE_LIVRES[id];
  if (livre) {
    const hint = etat.itemsAppris.includes(id) ? "Learned" : "go to Inventory to learn it";
    return livre.emoji + " " + livre.nom + " received <span class='recompense-hint'>(" + hint + ")</span>";
  }
  if (camp.recompenseTable) {
    return camp.recompenseTable.map(function(e) {
      return e.weight + '% ' + (RESOURCE_DISPLAY_NAMES[e.recompense] || e.recompense);
    }).join(' / ') + ' received';
  }
  const name = RESOURCE_DISPLAY_NAMES[id];
  if (name) return (camp.recompenseQty ? camp.recompenseQty + "x " : "") + name + " received";
  return (id || "reward") + " received";
}

function renderCampaignCards() {
  const listeEl   = document.getElementById("liste-campaigns");
  const scoutEl   = document.getElementById("liste-scoutings");
  const missionEl = document.getElementById("liste-explo-mission");
  const missionSection = document.getElementById("section-explo-mission");
  const campScoutGrid  = document.getElementById("grille-campaigns-scoutings");
  if (!listeEl) return;

  const zoneId = carteZoneSelectionnee;

  // No zone selected
  if (!zoneId) {
    if (missionSection) missionSection.style.display = "none";
    if (campScoutGrid)  campScoutGrid.style.display  = "none";
    return;
  }

  const zone     = ZONES_CARTE[zoneId];
  const exploree = etat.zonesExplorees.includes(zoneId);
  let html = "";

  // ── Zone exploration mission (shown in its own panel when zone is not yet explored, non-home) ──
  if (zone && zone.type !== "home" && !exploree) {
    if (campScoutGrid)  campScoutGrid.style.display  = "none";
    if (missionSection) missionSection.style.display = "";
    const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
    html += '<div class="explo-card">';
    html += '<div class="explo-nom">&#x1F50D; Explore this zone</div>';
    if (zone.description) html += '<div class="explo-description zone-description">' + zone.description + '</div>';
    html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + zone.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(zone.duree) + ' &nbsp;&middot;&nbsp; &#x1F431; ' + zone.slots + ' slot(s)</div>';
    if (inProgress) {
      const ez        = etat.exploZoneEnCours;
      const elapsed   = (Date.now() - ez.startTs) / 1000;
      const remaining = Math.max(0, ez.duree - elapsed);
      const prog      = Math.min(1, elapsed / ez.duree);
      const names     = ez.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
      html += '<p class="carte-detail-desc">&#x1F431; ' + names + ' are exploring...</p>';
      html += '<div class="conteneur-barre"><div class="barre barre-explo" id="barre-explo-zone" style="width:' + Math.round(prog * 100) + '%"></div></div>';
      html += '<div class="explo-timer" id="timer-explo-zone">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
    } else {
      if (!carteExploSlots[zoneId]) carteExploSlots[zoneId] = new Array(zone.slots).fill(null);
      const slots     = carteExploSlots[zoneId];
      const power     = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? kittyEP(ki) : 0); }, 0);
      const allFilled = slots.every(function(k) { return k !== null; });
      const chance    = power > 0 ? Math.min(100, Math.round(power / zone.difficulte * 100)) : 0;
      html += '<div class="explo-slots">';
      for (let si = 0; si < zone.slots; si++) {
        const ki = slots[si];
        if (ki === null) {
          html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Assign a kitty to " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
        } else {
          const k = etat.kittiesData[ki];
          html += '<div class="explo-slot-wrap">';
          html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "kitty") + " in " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
          html += '<div class="explo-slot-kitty-info">';
          html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
          html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kittyEP(ki) + '</span>';
          html += '</div>';
          html += '</div>';
          html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "kitty") + ' from ' + echapperAttributHtml(zone.nom) + '" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ')">&#x2715;</button>';
          html += '</div>';
        }
      }
      html += '</div>';
      if (power > 0) {
        var zoneHalves = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
        var zoneHalvesLabel = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === 'explorator'; }) ? 'Explorator' : 'Exploration perk';
        var zoneEffDuree = zoneHalves ? zone.duree / 2 : zone.duree;
        var zoneTimeNote = zoneHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(zoneEffDuree) + '</strong> (' + zoneHalvesLabel + ')' : '';
        html += '<div class="explo-power-display">Exploration Power: ' + power + ' / ' + zone.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + zoneTimeNote + '</div>';
      } else {
        html += '<div class="explo-power-display explo-power-hint">Assign kitties to start the exploration.</div>';
      }
      const canLaunch = allFilled && !etat.exploZoneEnCours;
      if (!etat.exploZoneEnCours && etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
        html += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'zone\',\'' + zoneId + '\')">Auto Assign</button>';
      }
      html += '<button class="btn-lancer-explo"' + (canLaunch ? '' : ' disabled') + ' onclick="lancerExploZone()">Explore &#x27A4;</button>';
    }
    html += '</div>';
    if (missionEl) missionEl.innerHTML = html;
  return;
  }

  if (campScoutGrid)  campScoutGrid.style.display  = "";
  if (missionSection) missionSection.style.display = "none";

  // ── Campaigns for explored zone (or home) ──
  const campDefs = Object.values(CONFIG.campaigns).filter(function(c) {
    if (c.zone !== zoneId) return false;
    if (c.unlockAfterCampaign) return etat.campaignsCompletees.includes(c.unlockAfterCampaign);
    return true;
  });

  if (campDefs.length === 0) {
    listeEl.innerHTML = '<p class="explo-vide">No campaigns available for this zone yet.</p>';
  } else {
    campDefs.forEach(function(camp) {
      const completed  = etat.campaignsCompletees.includes(camp.id);
      const inProgress = etat.exploEnCours.find(function(e) { return e.id === camp.id; });

      if (!exploKittiesSelectionnees[camp.id]) {
        exploKittiesSelectionnees[camp.id] = new Array(camp.slots).fill(null);
      }
      const slots = exploKittiesSelectionnees[camp.id];

      html += '<div class="explo-card' + (camp.lockedReason && !completed ? ' explo-card-locked' : '') + '">';
      html += '<div class="explo-nom">' + camp.nom + '</div>';
      html += '<div class="explo-description">' + camp.description + '</div>';

      if (completed) {
        html += '<div class="explo-complete">' + CHECK_ICON + ' Completed &#x2014; ' + recompenseLabel(camp) + '</div>';
      } else if (camp.lockedReason) {
        html += '<div class="explo-locked-reason">' + camp.lockedReason + '</div>';
      } else if (inProgress) {
        const elapsed   = (Date.now() - inProgress.startTs) / 1000;
        const remaining = Math.max(0, inProgress.duree - elapsed);
        const progress  = Math.min(1, elapsed / inProgress.duree);
        const names     = inProgress.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
        const power     = inProgress.kittyIndices.reduce(function(s, i) { return s + kittyEP(i); }, 0);
        const chance    = Math.min(100, Math.round(power / camp.difficulte * 100));
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x1F431; ' + names + ' &nbsp;&middot;&nbsp; ' + chance + '% success</div>';
        html += '<div class="conteneur-barre"><div class="barre barre-explo" id="explo-barre-' + camp.id + '" style="width:' + Math.round(progress * 100) + '%"></div></div>';
        html += '<div class="explo-timer" id="explo-timer-' + camp.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
      } else {
        const selPower  = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? kittyEP(ki) : 0); }, 0);
        const allFilled = slots.every(function(x) { return x !== null; });
        const chance    = selPower > 0 ? Math.min(100, Math.round(selPower / camp.difficulte * 100)) : 0;
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(camp.duree) + ' &nbsp;&middot;&nbsp; &#x1F381; To be discovered</div>';
        html += '<div class="explo-slots">';
        for (let si = 0; si < camp.slots; si++) {
          const ki = slots[si];
          if (ki === null) {
            html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="campaign:' + camp.id + ':' + si + '"' + attributsActivationClavier("Assign a kitty to " + camp.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
          } else {
            const k = etat.kittiesData[ki];
            html += '<div class="explo-slot-wrap">';
            html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="campaign:' + camp.id + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "kitty") + " in " + camp.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
            html += '<div class="explo-slot-kitty-info">';
            html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
            html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kittyEP(ki) + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "kitty") + ' from ' + echapperAttributHtml(camp.nom) + '" onclick="retirerKittySlot(\'' + camp.id + '\',' + si + ')">&#x2715;</button>';
            html += '</div>';
          }
        }
        html += '</div>';
        if (selPower > 0) {
          var campHalves = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
          var campHalvesLabel = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === 'explorator'; }) ? 'Explorator' : 'Exploration perk';
          var campEffDuree = campHalves ? camp.duree / 2 : camp.duree;
          var campTimeNote = campHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(campEffDuree) + '</strong> (' + campHalvesLabel + ')' : '';
          html += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + camp.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + campTimeNote + '</div>';
        } else {
          html += '<div class="explo-power-display explo-power-hint">Click a slot to assign a kitty.</div>';
        }
        if (etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
          html += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'campaign\',\'' + camp.id + '\')">Auto Assign</button>';
        }
        html += '<button class="btn-lancer-explo"' + (allFilled ? '' : ' disabled') + ' onclick="lancerExplo(\'' + camp.id + '\')">Send on campaign &#x27A4;</button>';
      }
      html += '</div>';
    });
    listeEl.innerHTML = html;
  }

  // ── Scoutings for explored zone ──
  if (scoutEl) {
    var scoutDefs = Object.values(CONFIG.scoutings).filter(function(s) {
      return s.zone === zoneId && scoutingDebloquee(s);
    });
    if (scoutDefs.length === 0) {
      scoutEl.innerHTML = '<p class="explo-vide">No scouting missions available yet.</p>';
    } else {
      var scoutHtml = "";
      scoutDefs.forEach(function(sc) {
        var running = etat.scoutingsEnCours[sc.id];
        var SCOUTING_REWARD_NOMS = { humanLeftovers: "Human leftovers", humanWorkersFood: "Workers Food", cannedCatFood: "Canned Cat Food" };
        var scKiDisp = running ? running.kittyIndex : scoutingsStagingKitty[sc.id];
        var rewardLabel;
        if (sc.recompenseTable) {
          var dispTable = (scKiDisp !== undefined)
            ? applyPerkCatFood(sc.recompenseTable, scKiDisp)
            : sc.recompenseTable;
          var dispTotal = dispTable.reduce(function(s, e) { return s + e.weight; }, 0);
          rewardLabel = dispTable.map(function(e) {
            return Math.round(e.weight / dispTotal * 100) + '% ' + (RESOURCE_DISPLAY_NAMES[e.recompense] || e.recompense);
          }).join(' / ');
        } else if (sc.dropChance) {
          var rewardNom = SCOUTING_REWARD_NOMS[sc.recompense] || sc.recompense;
          var dropPct = Math.round(sc.dropChance * 100);
          var qty = sc.recompenseRange[0] ? sc.recompenseRange[0].qty : 1;
          rewardLabel = rewardNom + ' &#xd7;' + qty + ' &mdash; ' + dropPct + '% drop chance';
        } else {
          var rewardNom = SCOUTING_REWARD_NOMS[sc.recompense] || sc.recompense;
          var rangeLabel = sc.recompenseRange.map(function(r) { return r.qty + "&#xd7;" + r.weight + "%" ; }).join(" / ");
          rewardLabel = rewardNom + ' (' + rangeLabel + ')';
        }
        if (scKiDisp !== undefined && etat.spherePerks && etat.spherePerks['ex-luck'] === 'learned') {
          var kDisp = etat.kittiesData[scKiDisp];
          if (kDisp && kDisp.metier === 'explorator') rewardLabel += ' &nbsp;&middot;&nbsp; 25% double';
        }
        scoutHtml += '<div class="explo-card">';
        scoutHtml += '<div class="explo-nom">' + sc.nom + '</div>';
        scoutHtml += '<div class="explo-description">' + sc.description + '</div>';
        scoutHtml += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + sc.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(sc.duree) + ' &nbsp;&middot;&nbsp; &#x1F381; ' + rewardLabel + '</div>';
        if (running) {
          var effectiveDuree = (running.duree !== undefined) ? running.duree : sc.duree;
          var elapsed   = (Date.now() - running.startTs) / 1000;
          var remaining = Math.max(0, effectiveDuree - elapsed);
          var prog      = Math.min(1, elapsed / effectiveDuree);
          var k         = etat.kittiesData[running.kittyIndex];
          var kNom      = k ? k.nom : "?";
          var kPower    = kittyEP(running.kittyIndex);
          scoutHtml += '<div class="explo-slots">';
          scoutHtml += '<div class="explo-slot-wrap">';
          scoutHtml += '<div class="explo-slot explo-slot-filled">';
          scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
          scoutHtml += '<div class="explo-slot-kitty-info">';
          scoutHtml += '<span class="explo-slot-kitty-nom">' + kNom + '</span>';
          scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kPower + '</span>';
          scoutHtml += '</div>';
          scoutHtml += '</div>';
          scoutHtml += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(kNom) + ' from ' + echapperAttributHtml(sc.nom) + '" onclick="retirerKittyScouting(\'' + sc.id + '\')">&#x2715;</button>';
          scoutHtml += '</div>';
          scoutHtml += '</div>';
          scoutHtml += '<div class="conteneur-barre"><div class="barre barre-explo" id="scout-barre-' + sc.id + '" style="width:' + Math.round(prog * 100) + '%"></div></div>';
          scoutHtml += '<div class="explo-timer" id="scout-timer-' + sc.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining &#x21BA; auto-repeats</div>';
        } else {
          var stagedKi  = scoutingsStagingKitty[sc.id];
          var stagedK   = (stagedKi !== undefined) ? etat.kittiesData[stagedKi] : null;
          var selPower  = stagedKi !== undefined ? kittyEP(stagedKi) : 0;
          var chance    = selPower > 0 ? Math.min(100, Math.round(selPower / sc.difficulte * 100)) : 0;
          scoutHtml += '<div class="explo-slots">';
          if (stagedKi !== undefined) {
            scoutHtml += '<div class="explo-slot-wrap">';
            scoutHtml += '<div class="explo-slot explo-slot-filled" data-explo-trigger="scouting:' + sc.id + '"' + attributsActivationClavier("Change " + (stagedK ? stagedK.nom : "kitty") + " in " + sc.nom) + ' onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(stagedK) + '</span>';
            scoutHtml += '<div class="explo-slot-kitty-info">';
            scoutHtml += '<span class="explo-slot-kitty-nom">' + (stagedK ? stagedK.nom : "?") + '</span>';
            scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + selPower + '</span>';
            scoutHtml += '</div>';
            scoutHtml += '</div>';
            scoutHtml += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(stagedK ? stagedK.nom : "kitty") + ' from ' + echapperAttributHtml(sc.nom) + '" onclick="retirerScoutingStaging(\'' + sc.id + '\')">&#x2715;</button>';
            scoutHtml += '</div>';
          } else {
            scoutHtml += '<div class="explo-slot explo-slot-empty" data-explo-trigger="scouting:' + sc.id + '"' + attributsActivationClavier("Assign a kitty to " + sc.nom) + ' onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
          }
          scoutHtml += '</div>';
          if (selPower > 0) {
            var scoutHalves = stagedKi !== undefined && scoutingHalveTime(stagedKi);
            var scoutEffDuree = scoutHalves ? sc.duree / 2 : sc.duree;
            var scoutHalvesLabel = stagedK && stagedK.metier === 'explorator' ? 'Explorator' : 'Exploration perk';
            var scoutTimeNote = scoutHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(scoutEffDuree) + '</strong> (' + scoutHalvesLabel + ')' : '';
            scoutHtml += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + sc.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + scoutTimeNote + '</div>';
          } else {
            scoutHtml += '<div class="explo-power-display explo-power-hint">Click a slot to assign a kitty.</div>';
          }
          if (etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
            scoutHtml += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'scouting\',\'' + sc.id + '\')">Auto Assign</button>';
          }
          scoutHtml += '<button class="btn-lancer-explo"' + (stagedKi !== undefined ? '' : ' disabled') + ' onclick="lancerScouting(\'' + sc.id + '\')">Send to scout &#x27A4;</button>';
        }
        scoutHtml += '</div>';
      });
      scoutEl.innerHTML = scoutHtml;
    }
  }
}

// ── Carte d'exploration ──────────────────────────────────────

// Returns all [col, row] pairs occupied by a zone (handles colSpan/rowSpan and multi-part zones).
function getZoneCells(zone) {
  function partCells(p) {
    const cs = p.colSpan || 1, rs = p.rowSpan || 1;
    const out = [];
    for (let dc = 0; dc < cs; dc++)
      for (let dr = 0; dr < rs; dr++)
        out.push([p.col + dc, p.row + dr]);
    return out;
  }
  if (zone.parts) {
    const all = [];
    zone.parts.forEach(function(p) { partCells(p).forEach(function(c) { all.push(c); }); });
    return all;
  }
  return partCells(zone);
}

// Returns the CSS grid-column/row placement string for one rectangular part.
// topGameRow is the highest-numbered game row the part occupies (= part.row + rowSpan - 1).
function getPartGridStyle(part, ROWS) {
  const cs = part.colSpan || 1, rs = part.rowSpan || 1;
  const topGameRow  = part.row + rs - 1;
  const cssRowStart = ROWS - topGameRow + 1;
  const cssColStart = part.col + 2; // column 1 is the row-label
  return 'grid-column:' + cssColStart + '/' + (cssColStart + cs)
       + ';grid-row:'   + cssRowStart + '/' + (cssRowStart + rs);
}

// Fog of war: a zone is revealed if it's Home, already explored, or any of its
// cells is orthogonally adjacent to any cell of an already-explored zone.
function zoneEstVisible(zoneId) {
  const zone = ZONES_CARTE[zoneId];
  if (!zone) return false;
  if (zone.type === "home") return true;
  if (etat.zonesExplorees.includes(zoneId)) return true;
  const myCells = getZoneCells(zone);
  return Object.values(ZONES_CARTE).some(function(z) {
    if (!etat.zonesExplorees.includes(z.id)) return false;
    const expCells = getZoneCells(z);
    return myCells.some(function(mc) {
      return expCells.some(function(ec) {
        return Math.abs(ec[0] - mc[0]) + Math.abs(ec[1] - mc[1]) === 1;
      });
    });
  });
}

function renduCarteGrille() {
  const el = document.getElementById("carte-grille");
  if (!el) return;
  const ROWS = 5, COLS = 7, LETTERS = "ABCDEFG";
  const explorateurOk = explorateurPresent();

  const region = REGIONS[etat.regionCourante] || {};
  const mapImg = region.mapImg || null;

  function bgStyle(p) {
    if (!mapImg) return '';
    const colIdx = p.col;
    const rowIdx = ROWS + 1 - p.row - (p.rowSpan || 1);
    return ';background-image:url(\'' + mapImg + '\');'
      + 'background-size:calc(var(--map-cell) * ' + COLS + ') calc(var(--map-cell) * ' + ROWS + ');'
      + 'background-position:calc(var(--map-cell) * ' + (-colIdx) + ') calc(var(--map-cell) * ' + (-rowIdx) + ');';
  }

  function fogStyle(p) {
    const colIdx = p.col;
    const rowIdx = ROWS + 1 - p.row - (p.rowSpan || 1);
    return 'background-image:url(\'img/Maps/Fog of War.png\');'
      + 'background-size:calc(var(--map-cell) * ' + COLS + ') calc(var(--map-cell) * ' + ROWS + ');'
      + 'background-position:calc(var(--map-cell) * ' + (-colIdx) + ') calc(var(--map-cell) * ' + (-rowIdx) + ');';
  }

  // Build cell → zone map (supports multi-part zones).
  const cellMap = {};
  Object.values(ZONES_CARTE).forEach(function(z) {
    getZoneCells(z).forEach(function(c) { cellMap[c[0] + ',' + c[1]] = z.id; });
  });

  const rendered = new Set();
  let html = "";

  for (let row = ROWS; row >= 1; row--) {
    const cssRow = ROWS - row + 1; // grid row 1 = game row 5 (top)
    html += '<div class="carte-row-lbl" style="grid-column:1;grid-row:' + cssRow + '">' + row + '</div>';

    for (let ci = 0; ci < COLS; ci++) {
      const zoneId = cellMap[ci + ',' + row];
      const cssCol  = ci + 2;

      if (!zoneId) {
        const fp = { col: ci, row: row, rowSpan: 1 };
        html += '<div class="carte-cellule carte-fog" style="grid-column:' + cssCol + ';grid-row:' + cssRow + '">'
          + '<div class="carte-fog-overlay" style="' + fogStyle(fp) + '"></div></div>';
        continue;
      }
      if (rendered.has(zoneId)) continue;
      rendered.add(zoneId);

      const zone  = ZONES_CARTE[zoneId];
      const parts = zone.parts || [zone]; // single-rect zones act as their own part
      const isMulti = getZoneCells(zone).length > 1;

      if (!zoneEstVisible(zoneId)) {
        parts.forEach(function(p) {
          html += '<div class="carte-cellule carte-fog" style="' + getPartGridStyle(p, ROWS) + '"><div class="carte-fog-overlay" style="' + fogStyle(p) + '"></div></div>';
        });
        continue;
      }

      const exploree   = etat.zonesExplorees.includes(zoneId);
      const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
      const selected   = carteZoneSelectionnee === zoneId;
      const locked     = zone.type !== "home" && !explorateurOk;
      const zoneEtatLabel = locked ? "locked" : (inProgress ? "exploration in progress" : (exploree ? "explored" : "unexplored"));

      parts.forEach(function(p, pi) {
        const isPrimary = pi === 0;
        let cls = "carte-cellule carte-" + zone.type;
        if (mapImg)     cls += " carte-avec-image";
        if (isMulti)    cls += " carte-multicel";
        if (!isPrimary) cls += " carte-part-secondary";
        if (!exploree)  cls += " carte-inexploree";
        if (selected)   cls += " carte-selectionnee";
        if (locked)     cls += " carte-verrouillee";

        html += '<div class="' + cls + '" style="' + getPartGridStyle(p, ROWS) + bgStyle(p) + '"'
          + (isPrimary
            ? attributsActivationClavier(zone.nom + ", " + zoneEtatLabel) + ' data-zone-id="' + zoneId + '" aria-pressed="' + (selected ? "true" : "false") + '"'
            : ' aria-hidden="true"')
          + ' onclick="clicZoneCarte(\'' + zoneId + '\')"'
          + ' title="' + (locked ? "Train an Explorator to unlock" : "") + '">';
        if (isPrimary) {
          if (!exploree) {
            html += '<div class="carte-fog-overlay" style="' + fogStyle(p) + '"></div>';
            html += locked
              ? '<span class="carte-icone">🔒</span>'
              : '<span class="carte-badge-inconnu">?</span>';
          }
          if (inProgress) html += '<span class="carte-badge-encours">⏳</span>';
          if (exploree) {
            var zoneScouts = Object.values(CONFIG.scoutings).filter(function(s) {
              return s.zone === zoneId && scoutingDebloquee(s);
            });
            if (zoneScouts.length > 0) {
              var anyActive = zoneScouts.some(function(s) { return !!etat.scoutingsEnCours[s.id]; });
              html += '<span class="carte-badge-scout ' + (anyActive ? 'carte-badge-scout-actif' : 'carte-badge-scout-idle') + '"></span>';
            }
          }
        }
        html += '</div>';
      });
    }
  }

  el.innerHTML = html;
}

function renduCarteDetail() {
  const el = document.getElementById("carte-zone-detail");
  if (!el) return;
  const zoneId = carteZoneSelectionnee;
  if (!zoneId) {
    el.innerHTML = '<p class="carte-hint">Click a zone to see details.</p>';
    return;
  }
  const zone    = ZONES_CARTE[zoneId];
  if (!zone) { el.innerHTML = ""; return; }
  const exploree   = etat.zonesExplorees.includes(zoneId);
  const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
  let html = '<div class="carte-detail-panneau">';
  html += '<div class="carte-detail-titre">' + zone.icone + ' ' + zone.nom + '</div>';
  if (zone.type === "home") {
    html += '<p class="carte-detail-statut exploree">' + CHECK_ICON + ' Home — always accessible.</p>';
    html += '</div>'; el.innerHTML = html; return;
  }
  html += '<div class="carte-detail-stats">';
  html += '<span>⚔️ Difficulty: ' + zone.difficulte + '</span>';
  html += '<span>⏱ Duration: ' + formaterTempsStat(zone.duree) + '</span>';
  html += '<span>' + KITTY_ICON + ' ' + zone.slots + ' slot' + (zone.slots > 1 ? 's' : '') + '</span>';
  html += '</div>';
  if (exploree) {
    html += '<p class="carte-detail-statut exploree">' + CHECK_ICON + ' Explored — missions coming soon.</p>';
  } else if (inProgress) {
    const ez = etat.exploZoneEnCours;
    const elapsed   = (Date.now() - ez.startTs) / 1000;
    const remaining = Math.max(0, ez.duree - elapsed);
    const prog      = Math.min(1, elapsed / ez.duree);
    const names     = ez.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
    html += '<p class="carte-detail-desc">' + KITTY_ICON + ' ' + names + ' are exploring...</p>';
    html += '<div class="conteneur-barre"><div class="barre barre-explo" id="barre-explo-zone" style="width:' + Math.round(prog * 100) + '%"></div></div>';
    html += '<div class="explo-timer" id="timer-explo-zone">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
  } else {
    if (!carteExploSlots[zoneId]) carteExploSlots[zoneId] = new Array(zone.slots).fill(null);
    const slots    = carteExploSlots[zoneId];
    const power    = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? kittyEP(ki) : 0); }, 0);
    const allFilled = slots.every(function(k) { return k !== null; });
    const chance   = power > 0 ? Math.min(100, Math.round(power / zone.difficulte * 100)) : 0;
    html += '<div class="explo-slots">';
    for (let si = 0; si < zone.slots; si++) {
      const ki = slots[si];
      if (ki === null) {
        html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Assign a kitty to " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
      } else {
        const k = etat.kittiesData[ki];
        html += '<div class="explo-slot-wrap">';
        html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "kitty") + " in " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
        html += '<div class="explo-slot-kitty-info">';
        html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
        html += '<span class="explo-slot-kitty-power">⚡ EP ' + kittyEP(ki) + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "kitty") + ' from ' + echapperAttributHtml(zone.nom) + '" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ')"><img src="img/interface/Red Cross_Final.png?v=0.0028" alt=""></button>';
        html += '</div>';
      }
    }
    html += '</div>';
    if (power > 0) {
      html += '<div class="explo-power-display">Exploration Power: ' + power + ' / ' + zone.difficulte + ' — <strong>' + chance + '%</strong> success</div>';
    } else {
      html += '<div class="explo-power-display explo-power-hint">Assign kitties to start the exploration.</div>';
    }
    const canLaunch = allFilled && !etat.exploZoneEnCours;
    if (!etat.exploZoneEnCours && etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
      html += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'zone\',\'' + zoneId + '\')">Auto Assign</button>';
    }
    html += '<button class="btn-lancer-explo"' + (canLaunch ? '' : ' disabled') + ' onclick="lancerExploZone()">Explore ➤</button>';
  }
  html += '</div>';
  el.innerHTML = html;
}

function renduCarte(u) {
  const el = document.getElementById("explo-map-section");
  if (!el) return;
  if (carteDirty || !document.getElementById("carte-grille")) {
    el.innerHTML =
      '<div class="carte-grille-conteneur">' +
        (!u || !u.explorateurPresent ? '<p class="explo-map-hint">Train an <strong>Explorator</strong> in the Job Center to unlock other zones.</p>' : '') +
        '<div class="carte-grille" id="carte-grille"></div>' +
        '<div class="carte-col-lbls" id="carte-col-lbls"></div>' +
      '</div>' +
      '<div class="carte-zone-info" id="carte-zone-info"></div>';
    const clEl = document.getElementById("carte-col-lbls");
    if (clEl) {
      let h = '<div></div>';
      "ABCDEFG".split("").forEach(function(l) { h += '<div class="carte-col-lbl">' + l + '</div>'; });
      clEl.innerHTML = h;
    }
    carteDirty = false;
    renduCarteGrille();
  }
  renduZoneInfo();
}

function renduZoneInfo() {
  const el = document.getElementById("carte-zone-info");
  if (!el) return;
  const zoneId = carteZoneSelectionnee;

  // Build a cache key covering everything that affects this panel's content.
  // Timer elements (barre-explo-zone, timer-explo-zone) are updated via direct DOM — they
  // don't need a full rebuild, so we intentionally exclude running timers from the key.
  const exploree = zoneId ? etat.zonesExplorees.includes(zoneId) : false;
  const completedCamps = zoneId
    ? Object.keys(CONFIG.campaigns).filter(function(id) {
        return CONFIG.campaigns[id].zone === zoneId && etat.campaignsCompletees.includes(id);
      }).sort().join(',')
    : '';
  const activeScouts = zoneId
    ? Object.keys(etat.scoutingsEnCours).filter(function(id) {
        return CONFIG.scoutings[id] && CONFIG.scoutings[id].zone === zoneId;
      }).sort().join(',')
    : '';
  const key = (zoneId || '') + '|' + exploree + '|' + completedCamps + '|' + activeScouts;
  if (key === _zoneInfoKey) return;
  _zoneInfoKey = key;

  if (!zoneId) { el.innerHTML = '<p class="explo-vide">Select a zone to see its details.</p>'; return; }
  const zone = ZONES_CARTE[zoneId];
  if (!zone) { el.innerHTML = ""; return; }

  let html = '<div class="zone-info-titre">' + (exploree ? zone.nom : 'Unknown zone') + '</div>';
  if (zone.description) html += '<div class="zone-description">' + zone.description + '</div>';

  html += '<div class="zone-info-ligne"><span>Exploration Status ' + (exploree ? CHECK_ICON : '<img class="icon-close-inline" src="img/interface/Red Cross_Final.png?v=0.0028" alt="not explored">') + '</span></div>';

  html += '<div class="zone-info-bloc"><span class="zone-info-label">Campaign completion</span>';
  if (!exploree) {
    html += '<div class="zone-info-item">?</div>';
  } else {
    const camps     = Object.values(CONFIG.campaigns).filter(function(c) { return c.zone === zoneId; });
    const completed = camps.filter(function(c) { return etat.campaignsCompletees.includes(c.id); });
    const pending   = camps.filter(function(c) { return !etat.campaignsCompletees.includes(c.id); });
    if (completed.length > 0) {
      html += completed.map(function(c) { return '<div class="zone-info-item">' + CHECK_ICON + ' ' + c.nom + '</div>'; }).join('');
    } else if (pending.length > 0) {
      html += pending.map(function(c) { return '<div class="zone-info-item">⏳ ' + c.nom + '</div>'; }).join('');
    } else {
      html += '<div class="zone-info-item">—</div>';
    }
  }
  html += '</div>';

  html += '<div class="zone-info-bloc"><span class="zone-info-label">Scoutings</span>';
  const scouts   = Object.values(CONFIG.scoutings).filter(function(s) { return s.zone === zoneId; });
  const unlocked = scouts.filter(function(s) { return scoutingDebloquee(s); });
  if (unlocked.length === 0) {
    html += '<div class="zone-info-item">?</div>';
  } else {
    html += unlocked.map(function(s) {
      const active = !!etat.scoutingsEnCours[s.id];
      return '<div class="zone-info-item">' + (active ? '🟢' : '⚪') + ' ' + s.nom + (active ? ' — active' : ' — idle') + '</div>';
    }).join('');
  }
  html += '</div>';

  el.innerHTML = html;
}

function renduExplorations(u) {
  if (!u || !u.exploration) return;

  renduCarte(u);

  if (exploTabDirty) {
    renderCampaignCards();
    exploTabDirty = false;
  }

  // Campaign timers
  etat.exploEnCours.forEach(function(explo) {
    const elapsed   = (Date.now() - explo.startTs) / 1000;
    const remaining = Math.max(0, explo.duree - elapsed);
    const progress  = Math.min(1, elapsed / explo.duree);
    const timerEl   = domParId("explo-timer-" + explo.id);
    const barEl     = domParId("explo-barre-" + explo.id);
    ecrireTexte(timerEl, formaterTempsStat(Math.ceil(remaining)) + " remaining");
    ecrireStyle(barEl, "width", Math.round(progress * 100) + "%");
  });

  // Zone exploration timer (direct DOM update)
  if (etat.exploZoneEnCours) {
    const ez        = etat.exploZoneEnCours;
    const elapsed   = (Date.now() - ez.startTs) / 1000;
    const remaining = Math.max(0, ez.duree - elapsed);
    const progress  = Math.min(1, elapsed / ez.duree);
    const barEl     = domParId("barre-explo-zone");
    const timerEl   = domParId("timer-explo-zone");
    ecrireStyle(barEl, "width", Math.round(progress * 100) + "%");
    ecrireTexte(timerEl, formaterTempsStat(Math.ceil(remaining)) + " remaining");
  }

  // Scouting timers (direct DOM update)
  Object.keys(etat.scoutingsEnCours).forEach(function(scoutingId) {
    const def = CONFIG.scoutings[scoutingId];
    const sc  = etat.scoutingsEnCours[scoutingId];
    if (!def || !sc) return;
    const effectiveDuree = (sc.duree !== undefined) ? sc.duree : def.duree;
    const elapsed   = (Date.now() - sc.startTs) / 1000;
    const remaining = Math.max(0, effectiveDuree - elapsed);
    const progress  = Math.min(1, elapsed / effectiveDuree);
    const barEl     = domParId("scout-barre-" + scoutingId);
    const timerEl   = domParId("scout-timer-" + scoutingId);
    ecrireStyle(barEl, "width", Math.round(progress * 100) + "%");
    ecrireTexte(timerEl, formaterTempsStat(Math.ceil(remaining)) + " remaining ↺ auto-repeats");
  });
}

function ouvrirModalExplo(campId, slotIndex) {
  exploModalOuvert = { campId: campId, slotIndex: slotIndex };
  renduModalExplo();
  ouvrirDialogueModal("explo-modal", {
    dismissible: true,
    fermer: fermerModalExplo,
    focusSelector: ".explo-modal-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-explo-trigger="campaign:' + campId + ':' + slotIndex + '"]'
  });
}

function ouvrirModalExploZone(zoneId, slotIndex) {
  exploModalOuvert = { zoneId: zoneId, slotIndex: slotIndex };
  renduModalExplo();
  ouvrirDialogueModal("explo-modal", {
    dismissible: true,
    fermer: fermerModalExplo,
    focusSelector: ".explo-modal-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-explo-trigger="zone:' + zoneId + ':' + slotIndex + '"]'
  });
}

function ouvrirModalScouting(scoutingId) {
  exploModalOuvert = { scoutingId: scoutingId };
  renduModalExplo();
  ouvrirDialogueModal("explo-modal", {
    dismissible: true,
    fermer: fermerModalExplo,
    focusSelector: ".explo-modal-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-explo-trigger="scouting:' + scoutingId + '"]'
  });
}

function fermerModalExplo() {
  exploModalOuvert = null;
  fermerDialogueModal("explo-modal");
}

function renduModalExplo() {
  const conteneurEl = document.getElementById("explo-modal-kitties");
  if (!conteneurEl || !exploModalOuvert) return;
  const { slotIndex } = exploModalOuvert;
  let html = "";

  var kittyList = etat.kittiesData.map(function(k, i) { return { k: k, i: i }; });
  kittyList.sort(function(a, b) {
    var aExp = a.k.metier === "explorator" ? 0 : 1;
    var bExp = b.k.metier === "explorator" ? 0 : 1;
    if (aExp !== bExp) return aExp - bExp;
    return b.k.niveau - a.k.niveau;
  });
  kittyList.forEach(function(entry) {
    var k = entry.k, i = entry.i;
    const onExplo      = kittyIsOnExpedition(i);
    const inOtherSlot  = exploModalOuvert.campId ? kittyDejaSelectionnee(i, exploModalOuvert.campId, exploModalOuvert.slotIndex) : false;
    const inWorker     = kittyIsInWorkerSlot(i);
    const isManager    = kittyEstManager(i);
    const inTraining   = kittyIsInTraining(i);
    const onZoneExplo  = kittyIsOnZoneExplo(i);
    const onScouting   = kittyIsOnScouting(i) || (kittyIsInScoutingStaging(i) && scoutingsStagingKitty[exploModalOuvert.scoutingId] !== i);
    const inZoneSlot   = exploModalOuvert.zoneId
      ? (carteExploSlots[exploModalOuvert.zoneId] || []).some(function(ki, si) { return ki === i && si !== exploModalOuvert.slotIndex; })
      : false;
    const disabled     = onExplo || inOtherSlot || inWorker || isManager || inTraining || onZoneExplo || inZoneSlot || onScouting;
    const forcable     = !onExplo && !inOtherSlot && !inTraining && !onZoneExplo && !inZoneSlot && !onScouting && (inWorker || isManager);
    let statusLabel    = (onExplo || onZoneExplo || onScouting || inTraining || isManager || inWorker) ? kittyAllocationLabel(i).text : (inOtherSlot || inZoneSlot) ? "in another slot" : "";

    html += '<div class="explo-modal-kitty' + (disabled ? ' explo-modal-kitty-disabled' : '') + '"' +
            (disabled ? ' aria-disabled="true"' : attributsActivationClavier("Select " + k.nom + " for this exploration") + ' onclick="selectionnerKittySlot(' + i + ')"') + '>';
    html += '<span class="explo-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="explo-modal-kitty-info">';
    html += '<span class="explo-modal-kitty-nom">' + k.nom + '</span>';
    html += '<span class="explo-modal-kitty-power">&#x26A1; Exploration Power ' + kittyEP(i) + '</span>';
    var halvesTime = k.metier === "explorator" || (k.metier === "gang-leader" && etat.spherePerks && etat.spherePerks['gl-explo'] === 'learned');
    if (halvesTime) html += '<span class="explo-modal-kitty-effect">&#x23F1; Halves mission time</span>';
    if (statusLabel) html += '<span class="explo-modal-kitty-status">' + statusLabel + '</span>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerKittySlot(' + i + ');event.stopPropagation()">Force</button>';
    html += '</div>';
  });

  conteneurEl.innerHTML = html || '<p class="explo-vide">No kitties available.</p>';
}

function selectionnerKittySlot(kittyIndex) {
  if (!exploModalOuvert) return;

  if (exploModalOuvert.scoutingId) {
    const scoutingId = exploModalOuvert.scoutingId;
    const alreadyStaged = scoutingsStagingKitty[scoutingId] !== undefined;
    if (!alreadyStaged && chatonsLibres() <= 0) {
      fermerModalExplo();
      afficherNotification("⚠️ Not enough free kitties!");
      return;
    }
    scoutingsStagingKitty[scoutingId] = kittyIndex;
    exclusifyStagedKitty(kittyIndex, 'scouting', scoutingId);
    fermerModalExplo();
    exploTabDirty = true;
    renderCampaignCards();
    return;
  }

  if (exploModalOuvert.zoneId) {
    const { zoneId, slotIndex } = exploModalOuvert;
    const z = ZONES_CARTE[zoneId];
    if (!z) { fermerModalExplo(); return; }
    if (!carteExploSlots[zoneId]) carteExploSlots[zoneId] = new Array(z.slots).fill(null);
    carteExploSlots[zoneId][slotIndex] = kittyIndex;
    exclusifyStagedKitty(kittyIndex, 'zone', zoneId);
    fermerModalExplo();
    exploTabDirty = true;
    renderCampaignCards();
    return;
  }

  const { campId, slotIndex } = exploModalOuvert;
  const camp = CONFIG.campaigns[campId];
  if (!camp) return;

  if (!exploKittiesSelectionnees[campId]) {
    exploKittiesSelectionnees[campId] = new Array(camp.slots).fill(null);
  }

  // If replacing an empty slot, check the capacity cap
  const wasEmpty = exploKittiesSelectionnees[campId][slotIndex] === null;
  if (wasEmpty && totalKittiesSelectionnees() >= chatonsLibres()) {
    fermerModalExplo();
    afficherNotification("⚠️ Not enough free kitties!");
    return;
  }

  exploKittiesSelectionnees[campId][slotIndex] = kittyIndex;
  exclusifyStagedKitty(kittyIndex, 'campaign', campId);
  fermerModalExplo();
  exploTabDirty = true;
  renduExplorations(unlocks());
}

// Pulls a busy kitty (worker or manager) out of its current role, then assigns it to the
// exploration slot/campaign/scouting currently open in the modal.
function forcerKittySlot(kittyIndex) {
  retirerKittyDeSesRoles(kittyIndex);
  selectionnerKittySlot(kittyIndex);
}

function retirerKittySlot(campId, slotIndex) {
  if (!exploKittiesSelectionnees[campId]) return;
  exploKittiesSelectionnees[campId][slotIndex] = null;
  exploTabDirty = true;
  renduExplorations(unlocks());
}

// ── Zone exploration ─────────────────────────────────────────

function clicZoneCarte(zoneId) {
  const z = ZONES_CARTE[zoneId];
  if (!z) return;
  if (z.type !== "home" && !explorateurPresent()) {
    afficherNotification("🧭 Train an Explorator in the Job Center to unlock this zone.");
    return;
  }
  const conserverFocus = document.activeElement && document.activeElement.dataset.zoneId === zoneId;
  carteZoneSelectionnee = (carteZoneSelectionnee === zoneId) ? null : zoneId;
  if (carteZoneSelectionnee && !carteExploSlots[zoneId]) {
    carteExploSlots[zoneId] = new Array(z.slots).fill(null);
  }
  carteDirty = true;
  exploTabDirty = true;
  renduCarte(unlocks());
  renderCampaignCards();
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const cellule = document.querySelector('.carte-cellule[data-zone-id="' + zoneId + '"]');
      if (cellule) cellule.focus();
    });
  }
}

function retirerKittyExploZone(zoneId, slotIdx) {
  if (carteExploSlots[zoneId]) carteExploSlots[zoneId][slotIdx] = null;
  exploTabDirty = true;
  renderCampaignCards();
}

function lancerExploZone() {
  const zoneId = carteZoneSelectionnee;
  if (!zoneId || etat.exploZoneEnCours) return;
  const z = ZONES_CARTE[zoneId];
  if (!z || etat.zonesExplorees.includes(zoneId)) return;
  const slots = carteExploSlots[zoneId] || [];
  if (!slots.every(function(k) { return k !== null; })) return;
  var hasHalvesTime = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
  etat.exploZoneEnCours = { zoneId: zoneId, kittyIndices: slots.slice(), startTs: Date.now(), duree: hasHalvesTime ? z.duree / 2 : z.duree };
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExploZone() {
  if (!etat.exploZoneEnCours) return;
  const mission = etat.exploZoneEnCours;
  const zoneId = mission.zoneId;
  const z = ZONES_CARTE[zoneId];
  const power = mission.kittyIndices.reduce(function(s, i) {
    return s + kittyEP(i);
  }, 0);
  const success = Boolean(z) && Math.random() < Math.min(1, power / z.difficulte);
  const names = mission.kittyIndices.map(function(i) {
    return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
  }).join(", ");

  etat.exploZoneEnCours = null;
  carteDirty = true;
  exploTabDirty = true;
  if (carteExploSlots[zoneId]) carteExploSlots[zoneId] = carteExploSlots[zoneId].map(function() { return null; });

  const zoneName = z ? z.nom : zoneId;
  if (success) {
    if (!etat.zonesExplorees.includes(zoneId)) etat.zonesExplorees.push(zoneId);
    afficherNotification("✅ " + zoneName + " explored!");
    ajouterLog("unlock", "Zone explored: " + zoneName + ".");
    verifierObjectifs();
  } else {
    afficherNotification(zoneName + " exploration failed — try again with more power!");
    ajouterLog("event", "Zone exploration failed: " + zoneName + " — " + names + " returned safely.");
  }
}

function lancerExplo(id) {
  const slots = exploKittiesSelectionnees[id];
  const camp  = CONFIG.campaigns[id];
  if (!camp || !slots) return;
  const kittyIndices = slots.filter(function(x) { return x !== null; });
  if (kittyIndices.length < camp.slots) return;
  if (kittyIndices.length > chatonsLibres()) {
    afficherNotification("⚠️ Not enough free kitties!");
    return;
  }
  var hasHalvesTime = kittyIndices.some(function(ki) { return scoutingHalveTime(ki); });
  etat.exploEnCours.push({ id: id, kittyIndices: kittyIndices, startTs: Date.now(), duree: hasHalvesTime ? camp.duree / 2 : camp.duree });
  exploKittiesSelectionnees[id] = new Array(camp.slots).fill(null);
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExplo(explo) {
  const camp = CONFIG.campaigns[explo.id];
  if (!camp) return;

  const power   = explo.kittyIndices.reduce(function(s, i) {
    return s + kittyEP(i);
  }, 0);
  const success = Math.random() < Math.min(1, power / camp.difficulte);
  const names   = explo.kittyIndices.map(function(i) {
    return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
  }).join(", ");

  if (success) {
    etat.campaignsCompletees.push(explo.id);
    if (camp.recompenseTable) {
      var entry = resoudreRecompenseTable(camp.recompenseTable);
      appliquerRecompense(entry.recompense, entry.qty);
    } else {
      appliquerRecompense(camp.recompense, camp.recompenseQty);
    }
    ajouterLog("event", "Campaign '" + camp.nom + "' completed! " + names + " returned with the reward.");
  } else {
    ajouterLog("event", "Campaign '" + camp.nom + "' failed — " + names + " returned empty-pawed.");
    afficherNotification(camp.nom + " failed — try with more power!");
  }
  exploTabDirty = true;
}

// Returns the effective Exploration Power for a kitty, applying ex-power perk if applicable.
function kittyEP(ki) {
  var k = etat.kittiesData[ki];
  if (!k) return 1;
  var base = k.niveau + 1;
  if (k.metier === 'explorator' && etat.spherePerks && etat.spherePerks['ex-power'] === 'learned') {
    return Math.ceil(base * 1.5);
  }
  return base;
}

// Returns qty * 2 with 25% chance if the kitty is an explorator with ex-luck learned.
function tryDoubleReward(qty, kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator') return qty;
  if (!etat.spherePerks || etat.spherePerks['ex-luck'] !== 'learned') return qty;
  return Math.random() < 0.25 ? qty * 2 : qty;
}

function resoudreRecompenseTable(table) {
  var total = table.reduce(function(s, e) { return s + e.weight; }, 0);
  var roll  = Math.random() * total;
  var cumul = 0;
  for (var i = 0; i < table.length; i++) {
    cumul += table[i].weight;
    if (roll < cumul) return table[i];
  }
  return table[table.length - 1];
}

// Returns a modified loot table where cannedCatFood chance is doubled (probability math).
// Only applies if the kitty is an explorator with ex-food learned.
function applyPerkCatFood(table, kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator') return table;
  if (!etat.spherePerks || etat.spherePerks['ex-food'] !== 'learned') return table;
  var cfEntry = table.find(function(e) { return e.recompense === 'cannedCatFood'; });
  if (!cfEntry) return table;
  var total    = table.reduce(function(s, e) { return s + e.weight; }, 0);
  var cfPct    = cfEntry.weight / total;
  var newCfPct = Math.min(0.99, cfPct * 2);
  var wOthers  = total - cfEntry.weight;
  var newCfW   = Math.round(newCfPct * wOthers / (1 - newCfPct));
  return table.map(function(e) {
    return e.recompense === 'cannedCatFood' ? Object.assign({}, e, { weight: newCfW }) : e;
  });
}

function appliquerRecompense(recompenseId, recompenseQty) {
  if (recompenseId === "humanLeftovers") {
    const qty = recompenseQty || 1;
    etat.humanLeftovers += qty;
    afficherNotification("🗑️ " + qty + " Human Leftovers found!");
    ajouterLog("event", qty + " Human Leftovers found in the neighbor's trash.");
  }
  if (recompenseId === "schoolGuide") {
    if (!etat.itemsAcquis.includes("schoolGuide")) {
      etat.itemsAcquis.push("schoolGuide");
      inventaireDirty = true;
    }
    afficherNotification("📚 School Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "School Guide added to your Inventory.");
    if (!localStorage.getItem("story6aVue")) {
      localStorage.setItem("story6aVue", "1");
      afficherModal("ecran-story-6a");
      renduStories();
    }
  }
  if (recompenseId === "fishingGuide") {
    if (!etat.itemsAcquis.includes("fishingGuide")) {
      etat.itemsAcquis.push("fishingGuide");
      inventaireDirty = true;
    }
    afficherNotification("🎣 Fishing Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "Fishing Guide for Dummies added to your Inventory.");
  }
  if (recompenseId === "constructionPlan") {
    if (!etat.itemsAcquis.includes("constructionPlan")) {
      etat.itemsAcquis.push("constructionPlan");
      inventaireDirty = true;
    }
    afficherNotification("📐 Construction Plan obtained! Check your Inventory.");
    ajouterLog("unlock", "Construction Plan added to your Inventory.");
  }
  if (recompenseId === "stoneGuide") {
    if (!etat.itemsAcquis.includes("stoneGuide")) {
      etat.itemsAcquis.push("stoneGuide");
      inventaireDirty = true;
    }
    afficherNotification("⛏️ Stone Craft Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "Stone Craft Guide added to your Inventory.");
  }
  if (recompenseId === "seminarGuide") {
    if (!etat.itemsAcquis.includes("seminarGuide")) {
      etat.itemsAcquis.push("seminarGuide");
      inventaireDirty = true;
    }
    afficherNotification("📋 Corporate Seminar Booklet obtained! Check your Inventory.");
    ajouterLog("unlock", "Corporate Seminar Booklet added to your Inventory.");
  }
  if (recompenseId === "cannedCatFood") {
    etat.cannedCatFood += (recompenseQty || 1);
    afficherNotification("🥫 Canned Cat Food obtained!");
    ajouterLog("event", "Canned Cat Food added to inventory.");
  }
  if (recompenseId === "humanWorkersFood") {
    const qty = recompenseQty || 1;
    etat.humanWorkersFood += qty;
    afficherNotification("🍖 " + qty + " Human Workers Food found!");
    ajouterLog("event", qty + " Human Workers Food added to inventory.");
  }
}

// ════════════════════════════════════════════════════════════
// 9c. INVENTORY RENDER
// ════════════════════════════════════════════════════════════

let itemSelectionne      = null;
let inventaireDirty      = true;
let resCategorieFiltree  = "all";

// ── Resource info popup ───────────────────────────────────────
let _resPopupTarget = null;

function showResPopup(el) {
  var id   = el.dataset.resId;
  var info = RESOURCE_INFO[id];
  if (!info) return;
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  el.setAttribute("aria-expanded", "true");
  var popup  = document.getElementById("inv-res-popup");
  popup.setAttribute("aria-hidden", "false");
  var sprite = el.querySelector("img");
  var html   = '<div class="irp-header">';
  if (sprite) html += '<img class="irp-icon" src="' + sprite.src + '" alt="">';
  html += '<div class="irp-header-text"><div class="irp-nom">' + info.nom + '</div>';
  if (info.tier) html += '<div class="irp-tier">' + info.tier + '</div>';
  html += '</div></div>';
  html += '<p class="irp-desc">' + info.desc + '</p>';
  html += '<div class="irp-ligne"><span class="irp-label">How to get</span>' + info.produce + '</div>';
  html += '<div class="irp-ligne"><span class="irp-label">Used for</span>' + info.usage + '</div>';
  popup.innerHTML = html;
  popup.style.display = "block";
  var rect = el.getBoundingClientRect();
  var pw   = popup.offsetWidth  || 260;
  var ph   = popup.offsetHeight || 160;
  var mg   = 8;
  var left = rect.left;
  var top  = rect.bottom + mg;
  if (left + pw > window.innerWidth  - mg) left = window.innerWidth  - pw - mg;
  if (left < mg) left = mg;
  if (top  + ph > window.innerHeight - mg) top  = rect.top - ph - mg;
  if (top  < mg) top  = mg;
  popup.style.left = left + "px";
  popup.style.top  = top  + "px";
}

function hideResPopup() {
  const popup = document.getElementById("inv-res-popup");
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
  if (_resPopupTarget) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = null;
}

function toggleResPopup(el, evt) {
  evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showResPopup(el);
}

function selectionnerItem(itemId) {
  const conserverFocus = document.activeElement && document.activeElement.dataset.itemId === itemId;
  itemSelectionne = (itemSelectionne === itemId) ? null : itemId;
  inventaireDirty = true;
  renduInventaire(unlocks());
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const carte = document.getElementById("inv-item-card-" + itemId);
      if (carte) carte.focus();
    });
  }
}

function filtrerResources(cat) {
  const conserverFocus = document.activeElement && document.activeElement.classList.contains("inv-res-tab");
  resCategorieFiltree = cat;
  var resEl  = document.getElementById("inv-resources");
  if (resEl) resEl.dataset.visibleKey = "";  // force rebuild
  renderResourcesSection(unlocks());
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const onglet = document.querySelector(".inv-res-tab-actif");
      if (onglet) onglet.focus();
    });
  }
}

function actionCoutLabel(cout) {
  return "";
}

function peutPayerAction(cout) {
  return true;
}

function actionItem(itemId, actionId) {
  if (itemId === "schoolGuide" && actionId === "learn") {
    if (etat.itemsAppris.includes("schoolGuide")) return;
    if (etat.learningEnCours) return;
    etat.learningEnCours = { itemId: "schoolGuide", startTs: Date.now(), duree: 60000 };
    inventaireDirty = true;
    afficherNotification("📖 Learning... 60s remaining.");
    sauvegarder(); renduInventaire(unlocks());
  }
  if (itemId === "fishingGuide" && actionId === "learn") {
    if (etat.itemsAppris.includes("fishingGuide")) return;
    if (etat.learningEnCours) return;
    etat.learningEnCours = { itemId: "fishingGuide", startTs: Date.now(), duree: 3600000 };
    inventaireDirty = true;
    afficherNotification("📖 Learning Fishing Guide... 1h remaining.");
    sauvegarder(); renduInventaire(unlocks());
  }
  if (itemId === "constructionPlan" && actionId === "learn") {
    if (etat.itemsAppris.includes("constructionPlan")) return;
    if (etat.learningEnCours) return;
    etat.learningEnCours = { itemId: "constructionPlan", startTs: Date.now(), duree: 3600000 };
    inventaireDirty = true;
    afficherNotification("📖 Learning Construction Plan... 1h remaining.");
    sauvegarder(); renduInventaire(unlocks());
  }
  if (itemId === "stoneGuide" && actionId === "learn") {
    if (etat.itemsAppris.includes("stoneGuide")) return;
    if (etat.learningEnCours) return;
    etat.learningEnCours = { itemId: "stoneGuide", startTs: Date.now(), duree: 3600000 };
    inventaireDirty = true;
    afficherNotification("📖 Learning Stone Craft Guide... 1h remaining.");
    sauvegarder(); renduInventaire(unlocks());
  }
  if (itemId === "seminarGuide" && actionId === "learn") {
    if (etat.itemsAppris.includes("seminarGuide")) return;
    if (etat.learningEnCours) return;
    etat.learningEnCours = { itemId: "seminarGuide", startTs: Date.now(), duree: 7200000 };
    inventaireDirty = true;
    afficherNotification("📖 Studying Corporate Seminar Booklet... 2h remaining.");
    sauvegarder(); renduInventaire(unlocks());
  }
}

function terminerApprentissage(itemId) {
  if (itemId === "schoolGuide") {
    etat.itemsAppris.push("schoolGuide");
    etat.jobCenterDebloque = true;
    assignerGangLeader();
    afficherNotification("🏫 Job Center unlocked! Build it in the Facilities tab.");
    ajouterLog("unlock", "Job Center unlocked — build it from the Facilities tab.");
    if (!localStorage.getItem("story6bVue")) {
      localStorage.setItem("story6bVue", "1");
      afficherModal("ecran-story-6b");
      renduStories();
    }
  }
  if (itemId === "fishingGuide") {
    etat.itemsAppris.push("fishingGuide");
    afficherNotification("🎣 Fishing unlocked! Anchovy available in Food, Grilled Anchovy in the Catchen.");
    ajouterLog("unlock", "Fishing Guide learned — Anchovy gathering and Grilled Anchovy recipe unlocked.");
  }
  if (itemId === "constructionPlan") {
    etat.itemsAppris.push("constructionPlan");
    afficherNotification("🏗️ Construction Plan learned! Wood Builder job unlocked in the Job Center.");
    ajouterLog("unlock", "Construction Plan learned — the Wood Builder job is now available in the Job Center.");
  }
  if (itemId === "stoneGuide") {
    etat.itemsAppris.push("stoneGuide");
    afficherNotification("⛏️ Stone Craft Guide learned! Miner and Stonemason jobs unlocked in the Job Center.");
    ajouterLog("unlock", "Stone Craft Guide learned — Miner and Stonemason jobs are now available in the Job Center.");
  }
  if (itemId === "seminarGuide") {
    etat.itemsAppris.push("seminarGuide");
    etat.trainingCenterDebloque = true;
    afficherNotification("🏋️ Seminar Booklet mastered! Training Center unlocked — build it in Facilities.");
    ajouterLog("unlock", "Corporate Seminar Booklet studied — Training Center is now available in the Facilities tab.");
    if (!localStorage.getItem("storySeminarVue")) {
      localStorage.setItem("storySeminarVue", "1");
      afficherModal("ecran-story-seminar");
      renduStories();
    }
  }
  etat.learningEnCours = null;
  inventaireDirty = true;
  sauvegarder(); rendu();
}

function renduInventaire(u) {
  // Items list — only rebuild when dirty (avoids killing click events every 100ms)
  if (inventaireDirty) {
    renderItemsList();
    inventaireDirty = false;
  }

  renderResourcesSection(u);
}

const RES_CATEGORIES = [
  { id: "wood",     label: "Woods"             },
  { id: "food",     label: "Food"              },
  { id: "stone",    label: "Stone"             },
  { id: "training", label: "Training Materials"},
  // metal: { id: "metal", label: "Metal" }
];

function buildRessourcesList(u) {
  return [
    { id: "inv-res-cardboard",       label: "Cardboard Pieces",  category: "wood",  sprite: "img/resources/Cardboard Pieces_Final.png",  val: function() { return etat.cardboardPieces;  }, visible: u.cathering    },
    { id: "inv-res-cardboard-plank", label: "Cardboard Planks",  category: "wood",  sprite: "img/resources/Cardboard Plank_Final.png",   val: function() { return etat.cardboardPlanks;  }, visible: u.scierie      },
    { id: "inv-res-basic-wood",      label: "Basic Wood",        category: "wood",  sprite: "img/resources/Basic Wood_Final.png",        val: function() { return etat.basicWood;        }, visible: u.basicWood    },
    { id: "inv-res-wood-plank",      label: "Basic Wood Planks", category: "wood",  sprite: "img/resources/Basic Wood Plank_Final.png",  val: function() { return etat.basicWoodPlanks;  }, visible: u.basicSawmill },
    { id: "inv-res-catnip",          label: "Catnip",            category: "food",  sprite: "img/resources/Catnip_Final.png",            val: function() { return etat.catnip;           }, visible: u.grasscat     },
    { id: "inv-res-salads",          label: "Salads",            category: "food",  sprite: "img/resources/Catnip Salad_Final.png",      val: function() { return etat.salads;           }, visible: u.catchen      },
    { id: "inv-res-anchovy",         label: "Anchovy",           category: "food",  sprite: "img/resources/Anchovy_Final.png",           val: function() { return etat.anchovy;          }, visible: u.anchovy      },
    { id: "inv-res-grilled-anchovy", label: "Grilled Anchovy",   category: "food",  sprite: "img/resources/Grilled Anchovy_Final.png",   val: function() { return etat.grilledAnchovy;   }, visible: u.grilledAnchovy },
    { id: "inv-res-human-leftovers",   label: "Human Leftovers",  category: "food",  sprite: "img/resources/Human Leftovers_Final.png",    val: function() { return etat.humanLeftovers;    }, visible: etat.humanLeftovers > 0    },
    { id: "inv-res-human-workers-food", label: "Workers Food",    category: "food",  sprite: "img/resources/Human Workers Food_Final.png", val: function() { return etat.humanWorkersFood;  }, visible: etat.humanWorkersFood > 0  },
    { id: "inv-res-canned-cat-food",   label: "Canned Cat Food", category: "training", sprite: "img/resources/Canned Cat Food_Final.png",   val: function() { return etat.cannedCatFood;     }, visible: etat.cannedCatFood > 0     },
    { id: "inv-res-pebbles",         label: "Pebbles",           category: "stone", sprite: "img/resources/Pebbles_Final.png",           val: function() { return etat.pebbles;          }, visible: u.pebblecat    },
    { id: "inv-res-pebble-brick",    label: "Pebble Bricks",     category: "stone", sprite: "img/resources/Pebble Brick_Final.png",      val: function() { return etat.pebbleBricks;     }, visible: u.brickfact    },
    { id: "inv-res-rocks",           label: "Rocks",             category: "stone", sprite: "img/resources/Rock_Final.png",              val: function() { return etat.rocks;            }, visible: u.rockcat      },
    { id: "inv-res-rock-brick",      label: "Rock Bricks",       category: "stone", sprite: "img/resources/Rock Brick_Final.png",        val: function() { return etat.rockBricks;       }, visible: u.rockfact     },
    // metal: add here when metal resources are implemented
  ];
}

function renderResourcesSection(u) {
  const resEl  = document.getElementById("inv-resources");
  const tabsEl = document.getElementById("inv-res-tabs");
  if (!resEl) return;

  const ressources = buildRessourcesList(u);
  const allVisible = ressources.filter(function(r) { return r.visible; });

  // Rebuild when visible set or active filter changes
  const visibleKey = allVisible.map(function(r) { return r.id; }).join(",") + "|" + resCategorieFiltree;
  if (resEl.dataset.visibleKey !== visibleKey) {
    resEl.dataset.visibleKey = visibleKey;

    if (allVisible.length === 0) {
      if (tabsEl) tabsEl.innerHTML = "";
      resEl.innerHTML = etatVideHtml("No resources yet", "Unlock Work and assign a kitty to begin gathering materials.");
      return;
    }

    // Show tabs only when more than one category has visible resources
    const availableCats = RES_CATEGORIES.filter(function(cat) {
      return allVisible.some(function(r) { return r.category === cat.id; });
    });
    if (tabsEl) {
      if (availableCats.length > 1) {
        let tabsHtml = '<div class="inv-res-tabs" role="group" aria-label="Resource categories">';
        tabsHtml += '<button class="inv-res-tab' + (resCategorieFiltree === "all" ? " inv-res-tab-actif" : "") + '" aria-pressed="' + (resCategorieFiltree === "all" ? "true" : "false") + '" onclick="filtrerResources(\'all\')">All</button>';
        availableCats.forEach(function(cat) {
          tabsHtml += '<button class="inv-res-tab' + (resCategorieFiltree === cat.id ? " inv-res-tab-actif" : "") + '" aria-pressed="' + (resCategorieFiltree === cat.id ? "true" : "false") + '" onclick="filtrerResources(\'' + cat.id + '\')">' + cat.label + '</button>';
        });
        tabsHtml += '</div>';
        tabsEl.innerHTML = tabsHtml;
      } else {
        tabsEl.innerHTML = "";
      }
    }

    // Resources grid — filtered or all
    const showAll = resCategorieFiltree === "all";
    const catsToShow = showAll ? availableCats : availableCats.filter(function(c) { return c.id === resCategorieFiltree; });
    let resHtml = "";
    catsToShow.forEach(function(cat) {
      const catRes = allVisible.filter(function(r) { return r.category === cat.id; });
      if (catRes.length === 0) return;
      if (showAll) resHtml += '<div class="inv-res-categorie">' + cat.label + '</div>';
      resHtml += '<div class="inv-res-grille">';
      catRes.forEach(function(r) {
        resHtml += '<div class="inv-res-cell" data-res-id="' + r.id + '" id="' + r.id + '"'
                 + attributsActivationClavier("Show details for " + r.label)
                 + ' aria-expanded="false" aria-controls="inv-res-popup"'
                 + ' onmouseenter="if(matchMedia(\'(hover:hover)\').matches)showResPopup(this)"'
                 + ' onmouseleave="if(matchMedia(\'(hover:hover)\').matches)hideResPopup()"'
                 + ' onclick="toggleResPopup(this,event)">';
        resHtml += '<img class="inv-res-sprite" src="' + r.sprite + '" alt="' + r.label + '">';
        resHtml += '<span class="inv-res-name">' + r.label + '</span>';
        resHtml += '<span class="inv-res-qty" id="' + r.id + '-qty"></span>';
        resHtml += '</div>';
      });
      resHtml += '</div>';
    });
    resEl.innerHTML = resHtml;
  }

  // Update quantities in-place every tick
  const displayed = allVisible.filter(function(r) {
    return resCategorieFiltree === "all" || r.category === resCategorieFiltree;
  });
  displayed.forEach(function(r) {
    const qtyEl = domParId(r.id + "-qty");
    ecrireTexte(qtyEl, formaterNombre(Math.floor(r.val())));
  });
}

function renderItemsList() {
  const listeEl = document.getElementById("inv-liste-items");
  if (!listeEl) return;

  if (etat.itemsAcquis.length === 0) {
    listeEl.innerHTML = etatVideHtml("Your backpack is empty", "Explorations and discoveries will add useful guides here.");
    return;
  }

  let html = "";
  etat.itemsAcquis.forEach(function(itemId) {
    const item   = ITEMS[itemId];
    if (!item) return;
    const appris = etat.itemsAppris.includes(itemId);
    const actif  = itemSelectionne === itemId;

    html += '<div id="inv-item-card-' + itemId + '" class="inv-item-carte' + (actif ? " inv-item-actif" : "") +
            '" data-item-id="' + itemId + '"' + attributsActivationClavier((actif ? "Hide " : "Show ") + item.nom + " details") +
            ' aria-expanded="' + (actif ? "true" : "false") + '" aria-controls="inv-item-detail-' + itemId + '" onclick="selectionnerItem(\'' + itemId + '\')">';
    html += '<span class="inv-item-emoji">' + item.emoji + '</span>';
    html += '<div class="inv-item-entete">';
    html += '<span class="inv-item-nom">' + item.nom + '</span>';
    if (appris) html += '<span class="inv-item-tag">' + CHECK_ICON + ' Learned</span>';
    html += '</div>';
    html += '</div>';

    if (actif) {
      html += '<div class="inv-item-detail" id="inv-item-detail-' + itemId + '">';
      html += '<p class="inv-item-desc">' + item.description + '</p>';
      if (appris) {
        var unlocksTxt = item.unlocksLabel ? ' — ' + item.unlocksLabel : '';
        html += '<div class="inv-item-appris">' + CHECK_ICON + ' Learned' + unlocksTxt + '</div>';
      } else if (etat.learningEnCours && etat.learningEnCours.itemId === itemId) {
        const elapsed = Date.now() - etat.learningEnCours.startTs;
        const pct = Math.min(100, Math.floor(elapsed / etat.learningEnCours.duree * 100));
        const remaining = Math.max(0, Math.ceil((etat.learningEnCours.duree - elapsed) / 1000));
        html += '<div class="inv-action-row">';
        html += '<div id="inv-learning-label" class="inv-learning-label">📖 Learning... ' + remaining + 's</div>';
        html += '<div class="inv-learning-barre"><div id="inv-learning-progres" class="inv-learning-progres" style="width:' + pct + '%"></div></div>';
        html += '</div>';
      } else if (item.actions && item.actions.length > 0) {
        item.actions.forEach(function(action) {
          html += '<div class="inv-action-row">';
          html += '<button class="btn-inv-action"' +
                  ' onclick="actionItem(\'' + itemId + '\',\'' + action.id + '\');event.stopPropagation()">';
          html += action.label;
          html += '</button>';
          html += '</div>';
        });
      }
      html += '</div>';
    }
  });
  listeEl.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
// 9c. JOB CENTER RENDER
// ════════════════════════════════════════════════════════════

let jcDirty = true;
let jcModalOuvert  = null;   // { mode: "formation"|"manager"|"spec", famille?: string }
let jcFormationKittySelectionne = null;
let jcMetierSelectionne = null;

let tcSpecKittySelectionne = null;
let _sphereGridJob        = null;  // job id of the currently rendered sphere grid
let _sphereSelectionnee   = null;  // id of the selected sphere node

function kittysSansMetier() {
  return etat.kittiesData.reduce(function(acc, k, i) {
    if (k.metier === null) acc.push(i);
    return acc;
  }, []);
}

function metierDejaAttribue(metierId) {
  return etat.kittiesData.some(function(k) { return k.metier === metierId; });
}

function ouvrirModalJC(mode, famille) {
  jcModalOuvert = { mode: mode, famille: famille || null };
  renduModalJC();
  const retour = mode === "manager"
    ? "#manager-slot-" + famille + " button"
    : '[data-jc-modal-trigger="' + mode + '"]';
  ouvrirDialogueModal("jc-modal", {
    dismissible: true,
    fermer: fermerModalJC,
    focusSelector: ".jc-modal-kitty[data-clavier-clic]",
    returnFocusSelector: retour
  });
}

function fermerModalJC() {
  jcModalOuvert = null;
  fermerDialogueModal("jc-modal");
}

function renduModalJC() {
  if (!jcModalOuvert) return;
  const titreEl = document.getElementById("jc-modal-titre");
  const contenuEl = document.getElementById("jc-modal-contenu");
  if (!contenuEl) return;
  let html = "";

  if (jcModalOuvert.mode === "formation") {
    if (titreEl) titreEl.innerHTML = KITTY_ICON + " Choose a Stray Cat";
    const stray = kittysSansMetier();
    if (stray.length === 0) {
      html = '<p class="jc-modal-vide">No Stray Cats available.</p>';
    } else {
      stray.forEach(function(idx) {
        const k        = etat.kittiesData[idx];
        const tier     = TIERS_KITTIES[k.tier] || "Kitty";
        const busy     = kittyIsBusy(idx);
        const enWorker = kittyIsInWorkerSlot(idx);
        const forcable = busy && enWorker && !kittyIsOnExpedition(idx) && !kittyIsOnZoneExplo(idx) &&
                         !kittyIsOnScouting(idx) && !kittyIsInScoutingStaging(idx) && !kittyIsInTraining(idx);
        const busyLbl  = busy ? kittyAllocationLabel(idx).text : "";
        html += '<div class="jc-modal-kitty' + (busy ? ' jc-modal-kitty-disabled' : '') + '"' +
                (busy ? ' aria-disabled="true"' : attributsActivationClavier("Select " + k.nom + " for job training") + ' onclick="selectionnerKittyFormation(' + idx + ')"') + '>';
        html += '<div class="jc-modal-kitty-info">';
        html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
        html += '<span class="jc-modal-kitty-tier">' + tier + (busyLbl ? ' — ' + busyLbl : '') + '</span>';
        html += '</div>';
        if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerKittyFormation(' + idx + ');event.stopPropagation()">Force</button>';
        html += '</div>';
      });
    }
  } else if (jcModalOuvert.mode === "manager") {
    const famille = jcModalOuvert.famille;
    const metiersEligibles = METIER_PAR_FAMILLE[famille] || [];
    if (titreEl) titreEl.textContent = "👤 Assign a Manager";
    const dejaMgr = {};
    Object.keys(etat.managers).forEach(function(f) {
      if (etat.managers[f] !== null && etat.managers[f] !== undefined) dejaMgr[etat.managers[f]] = f;
    });
    {
      const eligibles = etat.kittiesData.reduce(function(acc, k, i) {
        if (metiersEligibles.includes(k.metier)) acc.push(i);
        return acc;
      }, []);
      if (eligibles.length === 0) {
        html = '<p class="jc-modal-vide">No kitty with the required job.</p>';
      } else {
        eligibles.forEach(function(idx) {
          const k = etat.kittiesData[idx];
          const m = METIERS[k.metier];
          const bonus = ((k.managerMult || 2) * jobLevelMultiplier(k)).toFixed(2);
          const autreFamille = dejaMgr[idx];
          const enWorker    = kittyIsInWorkerSlot(idx);
          const onExplo     = kittyIsOnExpedition(idx);
          const onZoneExplo = kittyIsOnZoneExplo(idx);
          const onScouting  = kittyIsOnScouting(idx) || kittyIsInScoutingStaging(idx);
          const inTraining  = kittyIsInTraining(idx);
          const forcable = (enWorker || !!autreFamille) && !onExplo && !onZoneExplo && !onScouting && !inTraining;
          const occupe   = enWorker || !!autreFamille || onExplo || onZoneExplo || onScouting || inTraining;
          const statutTxt = occupe ? " — " + kittyAllocationLabel(idx).text : "";
          html += '<div class="jc-modal-kitty' + (occupe ? ' jc-modal-kitty-disabled' : '') + '"' +
                  (occupe ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + k.nom + " as manager") + ' onclick="assignerManager(\'' + famille + '\',' + idx + ')"') + '>';
          html += '<div class="jc-modal-kitty-info">';
          html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
          html += '<span class="jc-modal-kitty-tier">' + (m ? m.emoji + " " + m.nom : k.metier) + statutTxt + '</span>';
          html += '</div>';
          html += '<div class="jc-modal-kitty-bonus">';
          html += '<div class="jc-modal-kitty-bonus-ligne">×' + bonus + ' <span class="jc-modal-kitty-bonus-label">production speed</span></div>';
          html += '</div>';
          if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + ' as manager" onclick="forcerManager(\'' + famille + '\',' + idx + ');event.stopPropagation()">Force</button>';
          html += '</div>';
        });
      }
    }
  } else if (jcModalOuvert.mode === "spec") {
    if (titreEl) titreEl.textContent = "🎓 Select a kitty to specialize";
    const avecMetier = etat.kittiesData.reduce(function(acc, k, i) {
      if (k.metier !== null) acc.push(i);
      return acc;
    }, []);
    if (avecMetier.length === 0) {
      html = '<p class="jc-modal-vide">No kitties have a job yet.</p>';
    } else {
      avecMetier.forEach(function(idx) {
        const k = etat.kittiesData[idx];
        const m = METIERS[k.metier];
        const _mlvl = jobLevelInfo(k.metier);
        html += '<div class="jc-modal-kitty"' + attributsActivationClavier("Select " + k.nom + " to specialize") + ' onclick="selectionnerKittySpec(' + idx + ')">';
        html += '<div class="jc-modal-kitty-info">';
        html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
        html += '<span class="jc-modal-kitty-tier">' + (m ? m.emoji + ' ' + m.nom : k.metier) + '</span>';
        html += '</div>';
        html += '<div class="jc-modal-kitty-bonus">';
        html += '<div class="jc-modal-kitty-bonus-ligne">Lv. <span class="jc-modal-kitty-bonus-label">' + _mlvl.cur + ' / ' + _mlvl.max + '</span></div>';
        html += '</div>';
        html += '</div>';
      });
    }
  }

  contenuEl.innerHTML = html;
}

function selectionnerKittyFormation(kittyIndex) {
  jcFormationKittySelectionne = kittyIndex;
  fermerModalJC();
  jcDirty = true;
  renduJobCenter(unlocks());
}

function selectionnerKittySpec(kittyIndex) {
  tcSpecKittySelectionne = kittyIndex;
  fermerModalJC();
  renduTrainingCenter();
}

function forcerKittyFormation(kittyIndex) {
  retirerKittyDeSesRoles(kittyIndex);
  selectionnerKittyFormation(kittyIndex);
}

function selectionnerMetierJC(metierId) {
  jcMetierSelectionne = jcMetierSelectionne === metierId ? null : metierId;
  jcDirty = true;
}

function lancerFormation() {
  if (etat.formationEnCours) return;
  if (jcFormationKittySelectionne === null || !jcMetierSelectionne) return;
  if (metierDejaAttribue(jcMetierSelectionne)) return;
  if (kittyIsBusy(jcFormationKittySelectionne)) return;
  const metier = METIERS[jcMetierSelectionne];
  etat.formationEnCours = {
    kittyIndex: jcFormationKittySelectionne,
    metier:     jcMetierSelectionne,
    startTs:    Date.now(),
    duree:      metier.duree
  };
  jcFormationKittySelectionne = null;
  jcMetierSelectionne = null;
  jcDirty = true;
  sauvegarder(); rendu();
}

function terminerFormation() {
  if (!etat.formationEnCours) return;
  const kittyIndex = etat.formationEnCours.kittyIndex;
  const metierId   = etat.formationEnCours.metier;
  const kitty      = etat.kittiesData[kittyIndex];
  const m          = METIERS[metierId];
  etat.formationEnCours = null;
  if (kitty) {
    kitty.metier = metierId;
    afficherNotification((m ? m.emoji + " " : "") + kitty.nom + " is now a " + (m ? m.nom : metierId) + "!");
    ajouterLog("unlock", kitty.nom + " trained as " + (m ? m.nom : metierId) + ".");
    if (metierId === "explorator") {
      afficherNotification("🗺️ Exploration map unlocked!");
      ajouterLog("unlock", "The exploration map is now available in the Explorations tab.");
      carteDirty = true;
    }
  }
  if (!etat.managersDebloques) {
    etat.managersDebloques = true;
    afficherNotification("🏢 Manager slots unlocked in the Work tab!");
    ajouterLog("unlock", "Manager slots are now available in Work families.");
  }
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function assignerManager(famille, kittyIndex) {
  etat.managers[famille] = kittyIndex;
  fermerModalJC();
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

// Pulls a kitty out of whatever worker slot or manager role it currently holds, then assigns it
// to the new target — used by the "Force" button on busy kitties in the selection modals.
function retirerKittyDeSesRoles(kittyIdx) {
  Object.keys(etat.workers).forEach(function(action) {
    etat.workers[action].forEach(function(s) {
      if (s.kittyIndex === kittyIdx) { s.kittyIndex = null; s.progress = 0; }
    });
  });
  Object.keys(etat.managers).forEach(function(f) {
    if (etat.managers[f] === kittyIdx) etat.managers[f] = null;
  });
}

function forcerWorkerSlot(kittyIdx, action, slotIdx) {
  retirerKittyDeSesRoles(kittyIdx);
  etat.workers[action][slotIdx].kittyIndex = kittyIdx;
  etat.workers[action][slotIdx].progress   = 0;
  fermerModalWorker();
  jcDirty = true;
  sauvegarder(); rendu();
}

function forcerManager(famille, kittyIdx) {
  retirerKittyDeSesRoles(kittyIdx);
  etat.managers[famille] = kittyIdx;
  fermerModalJC();
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function retirerManager(famille) {
  etat.managers[famille] = null;
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function renderManagerSlot(famille) {
  const el = domParId("manager-slot-" + famille);
  if (!el) return;
  const debloque = famille === "houses"
    ? etat.itemsAppris.includes("constructionPlan")
    : etat.managersDebloques;
  if (!debloque) {
    ecrireStyle(el, "display", "none");
    return;
  }
  ecrireStyle(el, "display", "flex");
  const managerIdx = etat.managers[famille];
  const metiersEligibles = METIER_PAR_FAMILLE[famille] || [];

  // Resolve actual state: filled (valid manager) or empty
  let kitty = null;
  if (managerIdx !== null && managerIdx !== undefined) {
    const k = etat.kittiesData[managerIdx];
    if (k && metiersEligibles.includes(k.metier)) kitty = k;
    else etat.managers[famille] = null;
  }

  // Only rebuild DOM when state changes — prevents destroying the button mid-click
  const currentState = el.dataset.slotState || "";
  const newState = kitty ? "filled:" + managerIdx + ":" + ((kitty.managerMult || 2) * jobLevelMultiplier(kitty)).toFixed(2) : "empty";
  if (currentState === newState) return;
  el.dataset.slotState = newState;

  if (kitty) {
    const tierIdx = kitty.tier || 0;
    const m = METIERS[kitty.metier];
    const bonusTxt = m ? '<span class="bonus-var">×' + ((kitty.managerMult || 2) * jobLevelMultiplier(kitty)).toFixed(2) + '</span> ' + (m.bonusLabel || "production speed") : '';
    el.innerHTML = '<div class="manager-slot-filled">'
      + '<div class="manager-cercle kitty-photo-tier-' + tierIdx + '">' + kittyIconHtml(kitty) + '</div>'
      + '<div class="manager-info">'
      +   '<span class="manager-kitty-nom">' + kitty.nom + '</span>'
      +   '<span class="manager-bonus-txt">' + bonusTxt + '</span>'
      + '</div>'
      + '<button class="manager-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty.nom) + ' as ' + echapperAttributHtml(famille) + ' manager" onclick="retirerManager(\'' + famille + '\');event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0028" alt=""></button>'
      + '</div>';
  } else {
    el.innerHTML = '<button class="manager-slot-btn" aria-label="Assign a ' + echapperAttributHtml(famille) + ' manager" onclick="ouvrirModalJC(\'manager\',\'' + famille + '\')">+ Manager</button>';
  }
}

// ── Worker slot UI (ring progress per kitty) ─────────────────
function updateWorkerSlotUI(action, slotIdx) {
  const el = domParId("worker-slot-" + action + "-" + slotIdx);
  if (!el) return;
  const slots = etat.workers[action];
  if (!slots) return;
  const slot = slots[slotIdx];
  if (!slot) return;

  const newState = slot.kittyIndex !== null ? "filled:" + slot.kittyIndex : "empty";
  if (el.dataset.slotState !== newState) {
    el.dataset.slotState = newState;
    if (slot.kittyIndex !== null) {
      const kitty = etat.kittiesData[slot.kittyIndex];
      el.innerHTML =
        '<div class="worker-ring" id="worker-ring-' + action + '-' + slotIdx + '" style="--prog:' + (slot.progress || 0) + '">' +
          '<div class="worker-ring-inner">' + kittyIconHtml(kitty) + '</div>' +
          '<button class="worker-ring-remove" aria-label="Remove ' + echapperAttributHtml(kitty ? kitty.nom : "kitty") + ' from ' + echapperAttributHtml(ACTION_DISPLAY[action] || "work") + ' production" onclick="retirerWorker(\'' + action + '\',' + slotIdx + ');event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0028" alt=""></button>' +
        '</div>' +
        '<div class="worker-slot-name">' + (kitty ? kitty.nom : "?") + '</div>';
    } else {
      el.innerHTML =
        '<button class="worker-slot-empty" aria-label="Assign a kitty to ' + echapperAttributHtml(ACTION_DISPLAY[action] || "work") + ' production" onclick="ouvrirModalWorker(\'' + action + '\',' + slotIdx + ')">' +
          '+' +
        '</button>' +
        '<div class="worker-slot-name-placeholder"></div>';
    }
  }

  // Update ring progress directly (no DOM rebuild needed)
  if (slot.kittyIndex !== null) {
    const ring = domParId("worker-ring-" + action + "-" + slotIdx);
    ecrireVariableStyle(ring, "--prog", slot.progress || 0);
  }
}

// ── Worker selection modal ────────────────────────────────────
let workerModalOuvert = null; // { action, slotIdx }

function ouvrirModalWorker(action, slotIdx) {
  workerModalOuvert = { action: action, slotIdx: slotIdx };
  renduModalWorker();
  ouvrirDialogueModal("worker-modal", {
    dismissible: true,
    fermer: fermerModalWorker,
    focusSelector: ".worker-modal-kitty[data-clavier-clic]",
    returnFocusSelector: "#worker-slot-" + action + "-" + slotIdx + " button"
  });
}

function fermerModalWorker() {
  workerModalOuvert = null;
  fermerDialogueModal("worker-modal");
}

function renduModalWorker() {
  const conteneur = document.getElementById("worker-modal-kitties");
  if (!conteneur || !workerModalOuvert) return;
  const PROC_ACTIONS = ["sawmill", "basicSawmill", "catchen", "grilledAnchovy", "brickfactory", "rockFactory"];
  const isProc    = PROC_ACTIONS.indexOf(workerModalOuvert.action) !== -1;
  const prodLabel = isProc ? "Complex Prod" : "Basic Prod";
  const bonusFn   = function(niveau) { return isProc ? Math.pow(1.05, niveau) : Math.pow(1.1, niveau); };
  let html = "";
  const ordre = etat.kittiesData.map(function(k, i) { return { k: k, i: i }; });
  ordre.sort(function(a, b) { return bonusFn(b.k.niveau) - bonusFn(a.k.niveau); });
  ordre.forEach(function(entry) {
    const k = entry.k, i = entry.i;
    const onExplo     = kittyIsOnExpedition(i);
    const onZoneExplo = kittyIsOnZoneExplo(i);
    const onScouting  = kittyIsOnScouting(i) || kittyIsInScoutingStaging(i);
    const inWorker    = kittyIsInWorkerSlot(i);
    const inTraining  = kittyIsInTraining(i);
    const isManager   = kittyEstManager(i);
    const disabled    = onExplo || onZoneExplo || onScouting || inWorker || inTraining || isManager;
    const forcable    = inWorker || isManager;
    const status      = disabled ? kittyAllocationLabel(i).text : "";
    const prodMult    = bonusFn(k.niveau);
    html += '<div class="worker-modal-kitty' + (disabled ? ' worker-modal-kitty-disabled' : '') + '"' +
            (disabled ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + k.nom + " to this work slot") + ' onclick="assignerWorkerSlot(' + i + ')"') + '>';
    html += '<span class="worker-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="worker-modal-kitty-info">';
    html += '<span class="worker-modal-kitty-nom">' + k.nom + '</span>';
    if (status) html += '<span class="worker-modal-kitty-status">' + status + '</span>';
    html += '</div>';
    html += '<div class="worker-modal-kitty-bonus">';
    html += '<div class="worker-modal-kitty-bonus-ligne">×' + prodMult.toFixed(2) + ' <span class="worker-modal-kitty-bonus-label">' + prodLabel + '</span></div>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerWorkerSlot(' + i + ',\'' + workerModalOuvert.action + '\',' + workerModalOuvert.slotIdx + ');event.stopPropagation()">Force</button>';
    else html += '<div></div>';
    html += '</div>';
  });
  conteneur.innerHTML = html || '<p class="worker-modal-vide">No free kitties available.</p>';
}

function assignerWorkerSlot(kittyIndex) {
  if (!workerModalOuvert) return;
  const { action, slotIdx } = workerModalOuvert;
  etat.workers[action][slotIdx].kittyIndex = kittyIndex;
  etat.workers[action][slotIdx].progress   = 0;
  fermerModalWorker();
  verifierObjectifs(); sauvegarder(); rendu();
}

function retirerWorker(action, slotIdx) {
  etat.workers[action][slotIdx].kittyIndex = null;
  etat.workers[action][slotIdx].progress   = 0;
  sauvegarder(); rendu();
}

function renduJobCenter(u) {
  const el = document.getElementById("jc-interface");
  if (!el) return;

  if (jcDirty) {
    let html = '<div class="jc-section-titre">Training</div>';

    if (etat.formationEnCours) {
      const f = etat.formationEnCours;
      const m = METIERS[f.metier];
      const kitty = etat.kittiesData[f.kittyIndex];
      const elapsed = Math.min(f.duree, (Date.now() - f.startTs) / 1000);
      const prog    = elapsed / f.duree;
      const restant = Math.max(0, f.duree - elapsed);
      html += '<div class="jc-formation-en-cours">';
      html += '<div class="jc-slot-filled">';
      html += '<span class="jc-slot-emoji">' + (m ? m.emoji : kittyIconHtml(kitty)) + '</span>';
      html += '<div class="jc-slot-info">';
      html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
      html += '<span class="jc-slot-metier">Becoming ' + (m ? m.nom : f.metier) + '...</span>';
      html += '</div></div>';
      html += '<div class="barre-conteneur-jc"><div class="barre barre-explo" id="barre-jc-formation" style="width:' + Math.round(prog * 100) + '%"></div></div>';
      html += '<div class="jc-timer">' + formaterTemps(restant) + '</div>';
      html += '</div>';
    } else {
      // Auto-clear if selected kitty went on expedition or into a worker slot
      if (jcFormationKittySelectionne !== null && kittyIsBusy(jcFormationKittySelectionne)) {
        jcFormationKittySelectionne = null;
      }
      // Kitty slot
      if (jcFormationKittySelectionne !== null) {
        const kitty = etat.kittiesData[jcFormationKittySelectionne];
        html += '<div class="jc-slot-wrap">';
        html += '<div class="jc-slot-filled" data-jc-modal-trigger="formation"' + attributsActivationClavier("Change the Stray Cat selected for job training") + ' onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
        html += '<div class="jc-slot-info">';
        html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
        html += '<span class="jc-slot-metier">Stray Cat</span>';
        html += '</div>';
        html += '</div>';
        html += '<button class="jc-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty ? kitty.nom : "cat") + ' from job training" onclick="jcFormationKittySelectionne=null;jcDirty=true"><img src="img/interface/Red Cross_Final.png?v=0.0028" alt=""></button>';
        html += '</div>';
      } else {
        html += '<div class="jc-slot-empty" data-jc-modal-trigger="formation"' + attributsActivationClavier("Select an unassigned kitty for job training") + ' onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-plus">+</span>';
        html += '<span class="jc-slot-label">Select an unassigned kitty</span>';
        html += '</div>';
      }

      // Job selection
      html += '<div class="jc-metiers">';
      Object.values(METIERS).filter(function(m) {
        return m.id !== "gang-leader" && (!m.unlockItem || etat.itemsAppris.includes(m.unlockItem));
      }).sort(function(a, b) {
        if (a.id === "explorator") return -1;
        if (b.id === "explorator") return 1;
        return 0;
      }).forEach(function(m) {
        const pris      = metierDejaAttribue(m.id);
        const sel       = jcMetierSelectionne === m.id;
        const recommande = m.id === "explorator";
        html += '<button class="jc-metier-btn' + (sel ? ' jc-metier-actif' : '') + (recommande ? ' jc-metier-recommande' : '') + '"';
        if (pris) {
          html += ' disabled title="Already trained"';
        } else {
          html += ' onclick="selectionnerMetierJC(\'' + m.id + '\')"';
        }
        html += '>' + m.emoji + ' ' + m.nom + (pris ? ' ✓' : '') + (recommande && !pris ? ' ⭐' : '') + '</button>';
      });
      html += '</div>';

      const peutLancer = jcFormationKittySelectionne !== null && jcMetierSelectionne !== null;
      html += '<button class="btn-jc-train"' + (peutLancer ? '' : ' disabled') + ' onclick="lancerFormation()">⏱ Train (1h)</button>';
    }

    el.innerHTML = html;
    jcDirty = false;
  } else if (etat.formationEnCours) {
    const f = etat.formationEnCours;
    const elapsed = Math.min(f.duree, (Date.now() - f.startTs) / 1000);
    const prog    = elapsed / f.duree;
    const restant = Math.max(0, f.duree - elapsed);
    const barre = domParId("barre-jc-formation");
    ecrireStyle(barre, "width", Math.round(prog * 100) + "%");
    const timer = el.querySelector(".jc-timer");
    ecrireTexte(timer, formaterTemps(restant));
  }
}


// ════════════════════════════════════════════════════════════
// 10. ACTIONS
// ════════════════════════════════════════════════════════════

// ── 10a. Catch sequence
document.getElementById("bouton-sequence").addEventListener("click", function() {
  if (etat.sequenceEnCours) return;
  etat.sequenceEnCours         = true;
  etat.sequenceDebutTs         = Date.now();
  etat.sequenceDuree           = dureeBrute();
  sauvegarder(); rendu();
});

function terminerSequence() {
  etat.sequenceEnCours = false;
  etat.chatons        += 1;
  etat.clicCount      += 1;
  const nom = NOMS_KITTIES[etat.kittiesData.length] || ("Kitty #" + (etat.kittiesData.length + 1));
  etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: Date.now(), visage: assignerVisageChaton(nom), jobNiveau: 0 });
  afficherNotification("🐱 " + nom + " joined the gang!");
  ajouterLog("event", nom + " caught!");
  renduManagement();
  if (etat.chatons === 3) {
    afficherNotification("🐾 Cathering unlocked — gather Cardboard Pieces in Work!");
    ajouterLog("unlock", "Cathering unlocked — gather Cardboard Pieces in Work.");
  }
  if (etat.chatons === 5) {
    afficherNotification("🌿 Grasscatting unlocked — gather Catnip in Work!");
    ajouterLog("unlock", "Grasscatting unlocked — gather Catnip in Work.");
  }
  if (etat.chatons === 6) {
    afficherNotification("🗺️ Explorations unlocked! Send your kitties on expeditions.");
    ajouterLog("unlock", "Explorations unlocked — send kitties on campaigns and scoutings.");
  }
  exploTabDirty = true;
  verifierStoryModals();
  sauvegarder(); rendu();
}

// ── 10b. Worker deallocation (bulk unassign)

// ── 10c. Buildings, Purrks, Boosts
function acheterCathouse() {
  const cout = coutProchaineCathouse();
  if (etat.cardboardPlanks < cout) return;
  etat.cardboardPlanks -= cout;
  etat.cathouses.push(Date.now());
  afficherNotification("📦 Cardboard Box built!");
  ajouterLog("event", "Cardboard Box #" + etat.cathouses.length + " built!");
  if (etat.cathouses.length === 1 && !localStorage.getItem("story4Vue")) {
    localStorage.setItem("story4Vue", "1");
    afficherModal("ecran-story-4");
    renduStories();
  }
  verifierObjectifs(); sauvegarder(); rendu();
}

function acheterCatHouse() {
  const cout = coutProchaineCatHouse();
  if (etat.basicWoodPlanks < cout) return;
  etat.basicWoodPlanks -= cout;
  etat.cathouseCount += 1;
  afficherNotification("🏠 Wood Cathouse built!");
  ajouterLog("event", "Wood Cathouse #" + etat.cathouseCount + " built!");
  verifierObjectifs(); sauvegarder(); rendu();
}

function acheterStoneCathouse() {
  const cout = coutProchaineStoneCathouse();
  if (etat.basicWoodPlanks < cout.planks || etat.pebbleBricks < cout.bricks) return;
  etat.basicWoodPlanks -= cout.planks;
  etat.pebbleBricks    -= cout.bricks;
  etat.stoneCathouseCount++;
  afficherNotification("🪨 Basic Stone Cathouse built!");
  ajouterLog("event", "Basic Stone Cathouse #" + etat.stoneCathouseCount + " built!");
  verifierObjectifs(); sauvegarder(); rendu();
}

function nourrir(kittyIdx, foodType) {
  const xpGain = FOOD_XP[foodType];
  if (!xpGain || etat[foodType] < 1) return;
  const k = etat.kittiesData[kittyIdx];
  if (!k) return;
  etat[foodType] -= 1;
  k.xp += xpGain;
  while (k.xp >= xpPourNiveau(k.niveau)) {
    k.xp -= xpPourNiveau(k.niveau);
    k.niveau++;
    ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
    afficherNotification("🎉 " + k.nom + " is now Level " + k.niveau + "!");
  }
  verifierObjectifs(); sauvegarder(); renduManagement();
}

function nourrirAutoNiveau(kittyIdx) {
  const k = etat.kittiesData[kittyIdx];
  if (!k) return;
  let xpManquant = xpPourNiveau(k.niveau) - k.xp;
  if (xpManquant <= 0) return;
  // Use the smallest food units first to land as close as possible to the exact amount needed
  const foodsParValeur = Object.keys(FOOD_XP).sort(function(a, b) { return FOOD_XP[a] - FOOD_XP[b]; });
  let consomme = false;
  foodsParValeur.forEach(function(foodType) {
    while (xpManquant > 0 && etat[foodType] > 0) {
      etat[foodType] -= 1;
      k.xp += FOOD_XP[foodType];
      xpManquant -= FOOD_XP[foodType];
      consomme = true;
    }
  });
  if (!consomme) return;
  while (k.xp >= xpPourNiveau(k.niveau)) {
    k.xp -= xpPourNiveau(k.niveau);
    k.niveau++;
    ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
    afficherNotification("🎉 " + k.nom + " is now Level " + k.niveau + "!");
  }
  verifierObjectifs(); sauvegarder(); renduManagement();
}

function assignerGangLeader() {
  const bernardo = etat.kittiesData.find(function(k) { return k.nom === "Bernardo"; });
  if (bernardo && bernardo.metier !== "gang-leader") {
    bernardo.metier = "gang-leader";
    afficherNotification("👑 Bernardo is now the Gang Leader!");
    ajouterLog("event", "Bernardo has been promoted to Gang Leader. His strength grows with every cat you recruit.");
  }
}

function acheterJobCenter() {
  if (etat.jobCenterConstruit) return;
  if (etat.pebbleBricks < 10 || etat.basicWoodPlanks < 1) return;
  etat.pebbleBricks   -= 10;
  etat.basicWoodPlanks -= 1;
  etat.jobCenterConstruit = true;
  jcDirty = true;
  afficherNotification("🏫 Job Center built!");
  ajouterLog("event", "Job Center built — ready to assign jobs to kitties.");
  sauvegarder(); rendu();
}

function acheterTrainingCenter() {
  if (etat.trainingCenterConstruit) return;
  if (etat.rockBricks < 10 || etat.basicWoodPlanks < 20) return;
  etat.rockBricks      -= 10;
  etat.basicWoodPlanks -= 20;
  etat.trainingCenterConstruit = true;
  afficherNotification("🏋️ Training Center built!");
  ajouterLog("event", "Training Center built — specialization will soon be available.");
  sauvegarder(); rendu();
}



// ════════════════════════════════════════════════════════════
// 11. GAME LOOP (TICK)
// ════════════════════════════════════════════════════════════

let vitesse  = 1;
const TICK_DT = 0.1; // seconds per tick

function workBoostMult() {
  return (etat.workBoostFinTs && Date.now() < etat.workBoostFinTs) ? 10 : 1;
}

const PROCESSING_ACTION_ORDER = ["sawmill", "basicSawmill", "brickfactory", "rockFactory", "catchen", "grilledAnchovy"];
const PROCESSING_PAIRS = PROCESSING_ACTION_ORDER.map(function(action) {
  return RESOURCE_PAIRS.find(function(pair) { return pair.procAction === action; });
}).filter(Boolean);

function tickTransformations(dt) {
  const resultats = {};
  PROCESSING_PAIRS.forEach(function(pair) {
    if (pair.procAction === "grilledAnchovy" && !grilledAnchovyDebloquee()) return;
    const resultat = avancerTransformation(etat, pair, dt, multiplicateurFamille(pair.procMultAction));
    resultats[pair.procAction] = resultat;
    if (resultat.actif) etat[pair.bloqueeKey] = resultat.bloque;
  });
  return resultats;
}

function tickWorkers(action, stockKey, totalKey, cfg, onUnlockCheck, dt, glBonus) {
  const slots = etat.workers[action];
  if (!slots) return;
  if (dt      === undefined) dt = vitesse * TICK_DT * workBoostMult();
  if (glBonus === undefined) glBonus = 1;
  let totalProd = 0;
  slots.forEach(function(slot) {
    if (slot.kittyIndex === null) return;
    const slotKitty  = etat.kittiesData[slot.kittyIndex];
    const levelBonus = slotKitty ? Math.pow(1.1, slotKitty.niveau) : 1;
    // Ring fills at uniform base speed — level bonus applies to output quantity, not cycle speed
    slot.progress += productionParChaton(action) * multiplicateurFamille(action) * glBonus * dt / cfg.secondesParUnite;
    if (slot.progress >= 1) {
      const cycles = Math.floor(slot.progress);
      slot.progress -= cycles;
      slot.prodFrac = (slot.prodFrac || 0) + cycles * levelBonus;
      const units = Math.floor(slot.prodFrac);
      slot.prodFrac -= units;
      totalProd += units;
    }
  });
  if (totalProd > 0) {
    etat[stockKey] += totalProd;
    etat[totalKey] += totalProd;
    if (onUnlockCheck) onUnlockCheck(totalProd);
  }
}

function tick() {
  // Cathouse reduction accumulation (speed-aware)
  if (etat.cathouses.length > 0) {
  }

  // Speed-up: advance timestamps so timers consume real-time faster
  if (vitesse > 1) {
    const avance = (vitesse - 1) * 100;
    if (etat.sequenceEnCours) {
      etat.sequenceDebutTs -= avance;
    }
    etat.exploEnCours.forEach(function(explo) {
      explo.startTs -= avance;
    });
    if (etat.exploZoneEnCours) {
      etat.exploZoneEnCours.startTs -= avance;
    }
    Object.values(etat.scoutingsEnCours).forEach(function(sc) {
      sc.startTs -= avance;
    });
    if (etat.formationEnCours) {
      etat.formationEnCours.startTs -= avance;
    }
    if (etat.learningEnCours) {
      etat.learningEnCours.startTs -= avance;
    }
  }

  // Check learning completion
  if (etat.learningEnCours) {
    const lc = etat.learningEnCours;
    if (Date.now() - lc.startTs >= lc.duree) {
      terminerApprentissage(lc.itemId);
    } else {
      const elapsed   = Date.now() - lc.startTs;
      const pct       = Math.min(100, Math.floor(elapsed / lc.duree * 100));
      const remaining = Math.max(0, Math.ceil((lc.duree - elapsed) / 1000));
      const labelEl   = document.getElementById("inv-learning-label");
      const progEl    = document.getElementById("inv-learning-progres");
      if (labelEl) labelEl.textContent = "📖 Learning... " + remaining + "s";
      if (progEl)  progEl.style.width  = pct + "%";
    }
  }

  // Check sequence completion
  if (etat.sequenceEnCours && tempsRestantSequence() <= 0) {
    terminerSequence(); return;
  }

  // Check exploration completion
  const maintenant = Date.now();
  let exploTerminees = false;
  etat.exploEnCours = etat.exploEnCours.filter(function(explo) {
    if ((maintenant - explo.startTs) / 1000 >= explo.duree) {
      terminerExplo(explo);
      exploTerminees = true;
      return false;
    }
    return true;
  });
  if (exploTerminees) { sauvegarder(); }

  // Check zone exploration completion
  if (etat.exploZoneEnCours && (maintenant - etat.exploZoneEnCours.startTs) / 1000 >= etat.exploZoneEnCours.duree) {
    terminerExploZone();
    sauvegarder();
  }

  // Check scouting completions
  var scoutsDirty = false;
  Object.keys(etat.scoutingsEnCours).forEach(function(scoutingId) {
    var sc  = etat.scoutingsEnCours[scoutingId];
    var def = CONFIG.scoutings[scoutingId];
    var effectiveDuree = (sc.duree !== undefined) ? sc.duree : (def ? def.duree : 120);
    if (def && sc && (maintenant - sc.startTs) / 1000 >= effectiveDuree) {
      terminerScouting(scoutingId);
      scoutsDirty = true;
    }
  });
  if (scoutsDirty) sauvegarder();

  // Gang Leader passive speed bonus (Work tab only)
  const gl = gangLeaderBonus();

  // Gathering
  tickWorkers("woodcatting", "cardboardPieces", "cardboardPiecesTotalRecolte", CONFIG.woodcatting, function(prod) {
    const avant = etat.cardboardPiecesTotalRecolte - prod;
    if (avant < 5 && etat.cardboardPiecesTotalRecolte >= 5) {
      afficherNotification("🏗️ Buildings unlocked! Build your first Cardboard Box.");
      ajouterLog("unlock", "Buildings unlocked — build your first Cardboard Box.");
    }
    if (avant < CONFIG.sawmill.deblocageA && etat.cardboardPiecesTotalRecolte >= CONFIG.sawmill.deblocageA) {
      afficherNotification("🪚 Sawmill unlocked! Paw-cessing is now available.");
      ajouterLog("unlock", "Sawmill unlocked — Paw-cessing is now available.");
    }
  }, undefined, gl);

  tickWorkers("basicWoodcatting", "basicWood", "basicWoodTotalRecolte", CONFIG.basicWoodcatting, null, undefined, gl);

  tickWorkers("grasscatting", "catnip", "catnipTotalRecolte", CONFIG.grasscatting, function(prod) {
    const avant = etat.catnipTotalRecolte - prod;
    if (avant < CONFIG.catchen.deblocageA && etat.catnipTotalRecolte >= CONFIG.catchen.deblocageA) {
      afficherNotification("🍳 The Catchen is open!");
      ajouterLog("unlock", "The Catchen is open — cook your first salad!");
    }
  }, undefined, gl);

  tickWorkers("pebblegathering", "pebbles", "pebblesTotalRecolte", CONFIG.pebblegathering, function(prod) {
    const avant = etat.pebblesTotalRecolte - prod;
    if (avant < CONFIG.brickfactory.deblocageA && etat.pebblesTotalRecolte >= CONFIG.brickfactory.deblocageA) {
      afficherNotification("🪨 Pawsonry unlocked!");
      ajouterLog("unlock", "Pawsonry unlocked — process pebbles into bricks.");
    }
  }, undefined, gl);

  if (rockgatheringDebloquee()) {
    tickWorkers("rockgathering", "rocks", "rocksTotalRecolte", CONFIG.rockgathering, null, undefined, gl);
  }

  if (anchovyDebloquee()) {
    tickWorkers("fishcatting", "anchovy", "anchovyTotalRecolte", CONFIG.fishcatting, null, undefined, gl);
  }

  // Processing — shared by active and offline simulation.
  const resultatsTransformation = tickTransformations(vitesse * TICK_DT * gl * workBoostMult());
  const resultatCatchen = resultatsTransformation.catchen;
  if (resultatCatchen && resultatCatchen.produit > 0 && !etat.premiereSaladeFaite) {
    etat.premiereSaladeFaite = true;
    const cookIndex = resultatCatchen.premierProducteurIndex;
    const cookName = etat.kittiesData[cookIndex] ? etat.kittiesData[cookIndex].nom : "a kitty";
    const el1 = document.getElementById("story-salad-cook-name");
    const el2 = document.getElementById("story-salad-cook-name-2");
    const tag = document.getElementById("story-salad-cook-tag");
    if (el1) el1.textContent = cookName;
    if (el2) el2.textContent = cookName;
    if (tag) tag.textContent = cookName;
    localStorage.setItem("storySaladVue", "1");
    afficherModal("ecran-story-salad");
    renduStories();
  }

  // Job Center training completion
  if (etat.formationEnCours) {
    const elapsed = (Date.now() - etat.formationEnCours.startTs) / 1000;
    if (elapsed >= etat.formationEnCours.duree) terminerFormation();
  }

  verifierObjectifs();
  rendu();
}

setInterval(tick, 100);
setInterval(sauvegarder, 30000);


// ════════════════════════════════════════════════════════════
// 11b. OFFLINE PROGRESS
// ════════════════════════════════════════════════════════════

const VITESSE_HORS_LIGNE  = 0.1;  // production catches up at 10% of real elapsed time
const ABSENCE_MIN_MS      = 60000; // ignore gaps shorter than 1 minute

// One simulated step of gathering/processing, no notifications/logs (used for offline catch-up)
function simulerTickHorsLigne(dt) {
  const gl = gangLeaderBonus();

  tickWorkers("woodcatting",      "cardboardPieces", "cardboardPiecesTotalRecolte", CONFIG.woodcatting,      null, dt, gl);
  tickWorkers("basicWoodcatting", "basicWood", "basicWoodTotalRecolte", CONFIG.basicWoodcatting, null, dt, gl);
  tickWorkers("grasscatting",     "catnip",    "catnipTotalRecolte",    CONFIG.grasscatting,     null, dt, gl);
  tickWorkers("pebblegathering",  "pebbles",   "pebblesTotalRecolte",   CONFIG.pebblegathering,  null, dt, gl);
  if (rockgatheringDebloquee()) {
    tickWorkers("rockgathering", "rocks", "rocksTotalRecolte", CONFIG.rockgathering, null, dt, gl);
  }
  if (anchovyDebloquee()) {
    tickWorkers("fishcatting", "anchovy", "anchovyTotalRecolte", CONFIG.fishcatting, null, dt, gl);
  }

  const resultatsTransformation = tickTransformations(dt * gl);
  if (resultatsTransformation.catchen && resultatsTransformation.catchen.produit > 0) {
    etat.premiereSaladeFaite = true;
  }
}

// Applies offline progress since the last save. Returns a summary object, or null if nothing to report.
function appliquerProgressionHorsLigne() {
  const maintenant   = Date.now();
  const ecouleReelMs = maintenant - (etat.dernierTimestamp || maintenant);
  if (ecouleReelMs < ABSENCE_MIN_MS) {
    etat.dernierTimestamp = maintenant;
    return null;
  }

  const avant = {
    cardboardPieces: etat.cardboardPieces, basicWood: etat.basicWood, catnip: etat.catnip, pebbles: etat.pebbles,
    cardboardPlanks: etat.cardboardPlanks, pebbleBricks: etat.pebbleBricks, salads: etat.salads,
    anchovy: etat.anchovy, grilledAnchovy: etat.grilledAnchovy
  };

  const dtSimTotal = (ecouleReelMs / 1000) * VITESSE_HORS_LIGNE;
  const nbChunks    = Math.min(2000, Math.max(1, Math.ceil(dtSimTotal)));
  const tailleChunk = dtSimTotal / nbChunks;
  for (let i = 0; i < nbChunks; i++) simulerTickHorsLigne(tailleChunk);

  // The catch sequence cooldown runs on real wall-clock time already (tempsRestantSequence
  // reads Date.now() directly), now also benefiting from the cathouse reduction caught up above.
  let kittyAttrapeNom = null;
  if (etat.sequenceEnCours && tempsRestantSequence() <= 0) {
    kittyAttrapeNom = NOMS_KITTIES[etat.kittiesData.length] || ("Kitty #" + (etat.kittiesData.length + 1));
    etat.sequenceEnCours = false;
    etat.chatons        += 1;
    etat.clicCount      += 1;
    etat.kittiesData.push({ nom: kittyAttrapeNom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: maintenant, visage: assignerVisageChaton(kittyAttrapeNom), jobNiveau: 0 });
    ajouterLog("event", kittyAttrapeNom + " was caught while you were away!");
    verifierStoryModals();
  }

  etat.dernierTimestamp = maintenant;
  verifierObjectifs();
  sauvegarder();

  return {
    dureeReelleSec: ecouleReelMs / 1000,
    cardboardPieces:       etat.cardboardPieces      - avant.cardboardPieces,
    basicWood:       etat.basicWood      - avant.basicWood,
    catnip:          etat.catnip         - avant.catnip,
    pebbles:         etat.pebbles        - avant.pebbles,
    cardboardPlanks: etat.cardboardPlanks - avant.cardboardPlanks,
    pebbleBricks:    etat.pebbleBricks   - avant.pebbleBricks,
    salads:          etat.salads         - avant.salads,
    anchovy:         etat.anchovy        - avant.anchovy,
    grilledAnchovy:  etat.grilledAnchovy - avant.grilledAnchovy,
    kittyAttrape:    kittyAttrapeNom
  };
}

function afficherResumeAbsence(resume) {
  const conteneur = document.getElementById("absence-contenu");
  if (!conteneur) return;
  conteneur.innerHTML = "";

  function ligne(label, valeur) {
    const el = document.createElement("div");
    el.className = "absence-ligne";
    const lbl = document.createElement("span");
    lbl.textContent = label;
    const val = document.createElement("span");
    val.className   = "absence-val";
    val.textContent = valeur;
    el.appendChild(lbl);
    el.appendChild(val);
    conteneur.appendChild(el);
  }

  ligne("⏱ Time away", formaterTemps(resume.dureeReelleSec));

  const ressources = [
    ["📦 Cardboard Pieces", resume.cardboardPieces],
    ["🪵 Basic Wood",       resume.basicWood],
    ["🌿 Catnip",           resume.catnip],
    ["🪨 Pebbles",          resume.pebbles],
    ["📋 Cardboard Planks", resume.cardboardPlanks],
    ["🪨 Pebble Bricks",    resume.pebbleBricks],
    ["🥗 Salads",           resume.salads],
    ["🐟 Anchovy",          resume.anchovy],
    ["🐟 Grilled Anchovy",  resume.grilledAnchovy]
  ];
  let produit = false;
  ressources.forEach(function(r) {
    if (r[1] > 0) { ligne(r[0], "+" + formaterNombre(r[1])); produit = true; }
  });
  if (!produit) ligne("🐾 Production", "Nothing produced");

  if (resume.kittyAttrape) {
    ligne("🐱 New kitty", resume.kittyAttrape + " joined the gang!");
  }

  afficherModal("ecran-absence");
}


// ════════════════════════════════════════════════════════════
// 12. STORY MODALS
// ════════════════════════════════════════════════════════════

const STORY_ASSETS = {
  "ecran-intro":        { type: "illustration", src: "img/Story scenes/Intro.png", alt: "A child reaches toward Bernardo while their mother holds their hand." },
  "ecran-story-1":      { type: "icon",         src: "img/Cat faces/Bernardo.png", alt: "Portrait of Bernardo." },
  "ecran-story-2":      { type: "icon",         src: "img/Cat faces/Mochi_Final.png", alt: "Portrait of Mochi." },
  "ecran-story-3":      { type: "illustration", src: "img/Story scenes/Story 3.png", alt: "Bernardo addresses two other kittens in the garden." },
  "ecran-story-4":      { type: "illustration", src: "img/Story scenes/Story 4.png", alt: "Three kittens admire their first cardboard shelter." },
  "ecran-story-5":      { type: "icon",         src: "img/Cat faces/Bernardo.png", alt: "Portrait of Bernardo." },
  "ecran-story-6a":     { type: "icon",         src: "img/resources/Books_Final.png", alt: "A mysterious book found during scouting." },
  "ecran-story-6b":     { type: "illustration", src: "img/Story scenes/Story 6b.png", alt: "Bernardo studies charts and diagrams in an open book." },
  "ecran-story-salad":  { type: "icon",         src: "img/resources/Catnip Salad_Final.png", alt: "A freshly prepared Catnip Salad." },
  "ecran-story-seminar":{ type: "icon",         src: "img/resources/Books_Final.png", alt: "A corporate seminar booklet." },
  "ecran-story-bird":   { type: "illustration", src: "img/Story scenes/Bernardo caught bird.png?v=0.0028", alt: "Bernardo leaps toward a bird perched on a tree branch." },
};

const STORIES = [
  { id: "ecran-intro",    nom: "Introduction",    flag: "introVue" },
  { id: "ecran-story-1",  nom: "Bernardo plan begins", flag: "story1Vue" },
  { id: "ecran-story-2",  nom: "Mochi joins the gang", flag: "story2Vue" },
  { id: "ecran-story-3",  nom: "The adventure begins",  flag: "story3Vue" },
  { id: "ecran-story-4",  nom: "Our first creation",    flag: "story4Vue" },
  { id: "ecran-story-5",  nom: "Gang on the rise",      flag: "story5Vue" },
  { id: "ecran-story-6a", nom: "What's that thing?",    flag: "story6aVue" },
  { id: "ecran-story-6b", nom: "A job for everyone",    flag: "story6bVue" },
  { id: "ecran-story-salad", nom: "Chef's kiss", flag: "storySaladVue" },
  { id: "ecran-story-seminar", nom: "Everybody loves seminars, right?", flag: "storySeminarVue" },
  { id: "ecran-story-bird",    nom: "The bird",                         flag: "storyBirdVue" }
];

function renduStories() {
  const conteneur = document.getElementById("stories-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  let affichees = 0;
  STORIES.forEach(function(story) {
    if (!localStorage.getItem(story.flag)) return;
    affichees++;
    const carte = document.createElement("button");
    carte.className = "story-carte";
    carte.onclick = function() { afficherModal(story.id); };
    const asset = STORY_ASSETS[story.id];
    if (asset) {
      const img = document.createElement("img");
      img.className = asset.type === "icon" ? "story-carte-image story-carte-image-icon" : "story-carte-image";
      img.src = asset.src;
      img.alt = "";
      carte.appendChild(img);
    }
    const nom = document.createElement("span");
    nom.className   = "story-carte-nom";
    nom.textContent = story.nom;
    carte.appendChild(nom);
    conteneur.appendChild(carte);
  });
  if (affichees === 0) {
    conteneur.innerHTML = etatVideHtml("No stories unlocked", "Progress through the adventure to replay memorable scenes here.");
  }
}

function changerSousOngletLogs(vue) {
  ["log", "stories"].forEach(function(v) {
    const actif = v === vue;
    const panneau = document.getElementById("logs-vue-" + v);
    const bouton = document.getElementById("logs-subtab-" + v);
    panneau.style.display = actif ? "flex" : "none";
    panneau.setAttribute("aria-hidden", actif ? "false" : "true");
    bouton.classList.toggle("logs-subtab-actif", actif);
    bouton.setAttribute("aria-selected", actif ? "true" : "false");
    bouton.tabIndex = actif ? 0 : -1;
  });
  if (vue === "stories") renduStories();
}

function gererNavigationSousOngletsLogs(e) {
  if (!e.target.matches(".logs-subtab[role='tab']")) return;
  const onglets = Array.from(document.querySelectorAll("#logs-souscontenu .logs-subtab"));
  const index = onglets.indexOf(e.target);
  let suivant = null;
  if (e.key === "ArrowRight") suivant = (index + 1) % onglets.length;
  if (e.key === "ArrowLeft")  suivant = (index - 1 + onglets.length) % onglets.length;
  if (e.key === "Home") suivant = 0;
  if (e.key === "End")  suivant = onglets.length - 1;
  if (suivant === null) return;
  e.preventDefault();
  const cible = onglets[suivant];
  cible.focus();
  changerSousOngletLogs(cible.id.replace("logs-subtab-", ""));
}

document.getElementById("logs-souscontenu").addEventListener("keydown", gererNavigationSousOngletsLogs);

function fermerModal(id) { fermerDialogueModal(id); }

function fermerStoryBird() {
  fermerModal("ecran-story-bird");
  if (!_birdMiniJeuPending) return;
  _birdMiniJeuPending = false;
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "none";
  _birdCursorPct = 0; _birdDir = 1;
  ouvrirDialogueModal("bird-minijeu", {
    focusSelector: ".bird-catch-btn",
    returnFocusSelector: "#bouton-sequence"
  });
  var miniPerk = etat.spherePerks && etat.spherePerks['gl-mini'] === 'learned';
  var carte = document.querySelector('.bird-minijeu-carte');
  if (carte) carte.classList.toggle('bird-facile', miniPerk);
  var speed = miniPerk ? 75 : 150;
  var last = performance.now();
  function frame(ts) {
    var dt = (ts - last) / 1000; last = ts;
    _birdCursorPct += _birdDir * speed * dt;
    if (_birdCursorPct >= 100) { _birdCursorPct = 100; _birdDir = -1; }
    if (_birdCursorPct <= 0)   { _birdCursorPct = 0;   _birdDir =  1; }
    var cursor = document.getElementById("bird-cursor");
    if (cursor) cursor.style.left = _birdCursorPct + "%";
    _birdMiniJeuRaf = requestAnimationFrame(frame);
  }
  _birdMiniJeuRaf = requestAnimationFrame(frame);
}
function afficherModal(id) {
  const el = document.getElementById(id);
  const boite = el.querySelector(".intro-boite");
  const asset = STORY_ASSETS[id];
  const storyData = STORIES.find(function(s) { return s.id === id; });
  if (boite) {
    boite.setAttribute("role", "document");
    boite.tabIndex = -1;
    let img = boite.querySelector(".story-image, .story-image-icon");
    if (asset) {
      const cls = asset.type === "icon" ? "story-image-icon" : "story-image";
      if (!img || img.className !== cls) {
        if (img) img.remove();
        img = document.createElement("img");
        img.className = cls;
        boite.insertBefore(img, boite.firstChild);
      }
      img.src = asset.src;
      img.alt = asset.alt;
    } else if (img) {
      img.remove();
    }
    let titre = boite.querySelector(".story-modal-titre");
    if (storyData) {
      if (!titre) {
        titre = document.createElement("p");
        titre.className = "story-modal-titre";
        boite.insertBefore(titre, img ? img.nextSibling : boite.firstChild);
      }
      titre.id = id + "-titre";
      titre.textContent = storyData.nom;
      el.setAttribute("aria-labelledby", titre.id);
      el.removeAttribute("aria-label");
    } else if (titre) {
      titre.remove();
    }
  }
  if (!storyData) el.setAttribute("aria-label", id === "ecran-absence" ? "While you were away" : "Cat Inc story");
  ouvrirDialogueModal(el, { focusSelector: ".bouton-intro" });
}

function verifierStoryModals() {
  if (etat.chatons === 1 && !localStorage.getItem("story1Vue")) {
    localStorage.setItem("story1Vue", "1");
    afficherModal("ecran-story-1");
    renduStories();
  }
  if (etat.chatons === 2 && !localStorage.getItem("story2Vue")) {
    localStorage.setItem("story2Vue", "1");
    afficherModal("ecran-story-2");
    renduStories();
  }
  if (etat.chatons === 3 && !localStorage.getItem("story3Vue")) {
    localStorage.setItem("story3Vue", "1");
    afficherModal("ecran-story-3");
    renduStories();
  }
  if (etat.chatons === 6 && !localStorage.getItem("story5Vue")) {
    localStorage.setItem("story5Vue", "1");
    afficherModal("ecran-story-5");
    renduStories();
  }
}

document.getElementById("bouton-intro").addEventListener("click", function() {
  fermerModal("ecran-intro");
  localStorage.setItem("introVue", "1");
  renduStories();
});

if (!localStorage.getItem("introVue")) afficherModal("ecran-intro");


// ════════════════════════════════════════════════════════════
// 13. UI CONTROLS  (tabs · speed · panel toggles)
// ════════════════════════════════════════════════════════════

function changerOnglet(id) {
  if (!IDS_ONGLETS.includes(id)) return;
  document.body.classList.remove("interface-compacte");
  marquerOngletVisite(id);
  IDS_ONGLETS.forEach(function(tab) {
    const actif = id === tab;
    const panneau = document.getElementById("contenu-" + tab);
    const bouton = document.getElementById("onglet-" + tab);
    panneau.style.display = actif ? "block" : "none";
    panneau.setAttribute("aria-hidden", actif ? "false" : "true");
    bouton.classList.toggle("onglet-actif", actif);
    bouton.setAttribute("aria-selected", actif ? "true" : "false");
    bouton.tabIndex = actif ? 0 : -1;
  });
  document.body.dataset.ongletActif = id;
  if (id === "explorations") { exploTabDirty  = true; }
  if (id === "inventaire")  { inventaireDirty = true; }
  if (id === "facilities")  { jcDirty = true; }
  rendu(); // render the newly visible tab immediately instead of waiting for the next 100 ms tick
}

function gererNavigationOnglets(e) {
  if (!e.target.matches(".onglet[role='tab']")) return;
  const onglets = Array.from(document.querySelectorAll(".barre-onglets .onglet")).filter(function(onglet) {
    return !onglet.disabled && getComputedStyle(onglet).display !== "none";
  });
  const index = onglets.indexOf(e.target);
  let suivant = null;
  if (e.key === "ArrowRight") suivant = (index + 1) % onglets.length;
  if (e.key === "ArrowLeft")  suivant = (index - 1 + onglets.length) % onglets.length;
  if (e.key === "Home") suivant = 0;
  if (e.key === "End")  suivant = onglets.length - 1;
  if (suivant === null) return;
  e.preventDefault();
  const cible = onglets[suivant];
  cible.focus();
  changerOnglet(cible.id.replace("onglet-", ""));
}

document.querySelector(".barre-onglets").addEventListener("keydown", gererNavigationOnglets);

function gererDensiteMobileAuScroll(event) {
  if (window.innerWidth > 768) {
    document.body.classList.remove("interface-compacte");
    return;
  }
  const idActif = document.body.dataset.ongletActif || "gang";
  const panneauActif = document.getElementById("contenu-" + idActif);
  const contenuPrincipal = document.getElementById("contenu-principal");
  const cible = event.target;
  const defilementDocument = cible === document || cible === document.documentElement || cible === document.body;
  if (!panneauActif || !cible || (!defilementDocument && cible !== contenuPrincipal && cible !== panneauActif && !panneauActif.contains(cible))) return;
  const position = defilementDocument ? document.scrollingElement.scrollTop : cible.scrollTop;
  document.body.classList.toggle("interface-compacte", position > 32);
}

document.addEventListener("scroll", gererDensiteMobileAuScroll, true);
window.addEventListener("resize", function() {
  if (window.innerWidth > 768) document.body.classList.remove("interface-compacte");
  renduObjectifs();
});

function cyclerVitesse() {
  if (!DEV_MODE) {
    vitesse = 1;
    return;
  }
  const idx = VITESSES.indexOf(vitesse);
  vitesse = VITESSES[(idx + 1) % VITESSES.length];
  const btn = document.getElementById("bouton-vitesse");
  btn.textContent = vitesse === 1 ? "1×" : "⚡ " + vitesse + "×";
  btn.classList.toggle("vitesse-active", vitesse > 1);
}

function definirObjectifsReduits(reduit) {
  const panneau = document.getElementById("panneau-objectifs");
  const btn     = document.getElementById("objectifs-toggle");
  panneau.classList.toggle("reduit", reduit);
  btn.textContent = reduit ? "+" : "−";
  btn.setAttribute("aria-expanded", reduit ? "false" : "true");
  btn.title = reduit ? "Expand guide" : "Collapse guide";
}

function toggleObjectifs() {
  const panneau = document.getElementById("panneau-objectifs");
  definirObjectifsReduits(!panneau.classList.contains("reduit"));
}

var ressourceTooltipFlottant = null;
var ressourceTooltipSource = null;

function fermerTooltipRessource() {
  if (ressourceTooltipSource) {
    ressourceTooltipSource.setAttribute("aria-expanded", "false");
    const descriptions = ressourceTooltipSource.dataset.descriptionIds || "";
    if (descriptions) ressourceTooltipSource.setAttribute("aria-describedby", descriptions);
    else ressourceTooltipSource.removeAttribute("aria-describedby");
  }
  if (ressourceTooltipFlottant) ressourceTooltipFlottant.remove();
  ressourceTooltipFlottant = null;
  ressourceTooltipSource = null;
}

function ouvrirTooltipRessource(ressource) {
  if (!ressource || !ressource.dataset.tooltip) return;
  if (ressourceTooltipSource === ressource) {
    fermerTooltipRessource();
    return;
  }
  fermerTooltipRessource();

  const tooltip = document.createElement("div");
  tooltip.id = "ressource-tooltip";
  tooltip.className = "ressource-tooltip-flottant";
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = ressource.dataset.tooltip;
  document.body.appendChild(tooltip);

  const rect = ressource.getBoundingClientRect();
  const demiLargeur = tooltip.offsetWidth / 2;
  const marge = 8;
  const centre = Math.min(
    window.innerWidth - demiLargeur - marge,
    Math.max(demiLargeur + marge, rect.left + rect.width / 2)
  );
  let top = rect.bottom + 6;
  if (top + tooltip.offsetHeight > window.innerHeight - marge) top = rect.top - tooltip.offsetHeight - 6;
  tooltip.style.left = centre + "px";
  tooltip.style.top = Math.max(marge, top) + "px";

  ressourceTooltipFlottant = tooltip;
  ressourceTooltipSource = ressource;
  ressource.setAttribute("aria-expanded", "true");
  const descriptions = [ressource.dataset.descriptionIds, tooltip.id].filter(Boolean).join(" ");
  ressource.setAttribute("aria-describedby", descriptions);
}

function initialiserRessourcesAccessibles() {
  document.querySelectorAll(".ressource[data-tooltip]").forEach(function(ressource) {
    ressource.tabIndex = 0;
    ressource.setAttribute("role", "button");
    ressource.setAttribute("aria-label", ressource.dataset.tooltip);
    ressource.setAttribute("aria-expanded", "false");
    ressource.setAttribute("aria-controls", "ressource-tooltip");
    const descriptions = Array.from(ressource.querySelectorAll(".ressource-valeur[id], .ressource-taux[id]"))
      .map(function(element) { return element.id; })
      .join(" ");
    ressource.dataset.descriptionIds = descriptions;
    if (descriptions) ressource.setAttribute("aria-describedby", descriptions);
  });

  document.addEventListener("click", function(event) {
    const ressource = event.target.closest ? event.target.closest(".ressource[data-tooltip]") : null;
    if (ressource) ouvrirTooltipRessource(ressource);
    else fermerTooltipRessource();
  });
  document.addEventListener("keydown", function(event) {
    const ressource = event.target.closest ? event.target.closest(".ressource[data-tooltip]") : null;
    if (ressource && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      ouvrirTooltipRessource(ressource);
    } else if (event.key === "Escape") {
      fermerTooltipRessource();
    }
  });
  const barreRessources = document.querySelector(".ressources");
  if (barreRessources) barreRessources.addEventListener("scroll", fermerTooltipRessource, { passive: true });
  window.addEventListener("resize", fermerTooltipRessource);
}


// ════════════════════════════════════════════════════════════
// 13b. BIRD MINI-GAME
// ════════════════════════════════════════════════════════════

var _birdTimerId        = null;
var _birdMiniJeuRaf     = null;
var _birdCursorPct      = 0;
var _birdDir            = 1;
var _birdMiniJeuPending = false;

function planifierOiseau() {
  var delai = (Math.random() * 600 + 300) * 1000; // 5 à 15 min
  _birdTimerId = setTimeout(montrerOiseau, delai);
}

function montrerOiseau() {
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "inline-flex";
  var dbg = document.getElementById("bird-debug-btn");
  if (dbg) dbg.style.display = "none";
}

function ouvrirBirdMiniJeu() {
  if (!localStorage.getItem("storyBirdVue")) {
    localStorage.setItem("storyBirdVue", "1");
    var birdBtn = document.getElementById("bird-btn");
    if (birdBtn) birdBtn.style.display = "none";
    _birdMiniJeuPending = true;
    afficherModal("ecran-story-bird");
    renduStories();
    return;
  }
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "none";
  _birdCursorPct = 0;
  _birdDir = 1;
  ouvrirDialogueModal("bird-minijeu", {
    focusSelector: ".bird-catch-btn",
    returnFocusSelector: "#bouton-sequence"
  });
  var miniPerk = etat.spherePerks && etat.spherePerks['gl-mini'] === 'learned';
  var carte = document.querySelector('.bird-minijeu-carte');
  if (carte) carte.classList.toggle('bird-facile', miniPerk);
  var speed = miniPerk ? 75 : 150;
  var last = performance.now();
  function frame(ts) {
    var dt = (ts - last) / 1000;
    last = ts;
    _birdCursorPct += _birdDir * speed * dt;
    if (_birdCursorPct >= 100) { _birdCursorPct = 100; _birdDir = -1; }
    if (_birdCursorPct <= 0)   { _birdCursorPct = 0;   _birdDir =  1; }
    var cursor = document.getElementById("bird-cursor");
    if (cursor) cursor.style.left = _birdCursorPct + "%";
    _birdMiniJeuRaf = requestAnimationFrame(frame);
  }
  _birdMiniJeuRaf = requestAnimationFrame(frame);
}

function _apresMinijeuOiseau() {
  var dbg = document.getElementById("bird-debug-btn");
  if (dbg) dbg.style.display = DEV_MODE ? "inline-flex" : "none";
  planifierOiseau();
}

function clickerBird() {
  if (_birdMiniJeuRaf) { cancelAnimationFrame(_birdMiniJeuRaf); _birdMiniJeuRaf = null; }
  fermerDialogueModal("bird-minijeu");
  var miniPerk = etat.spherePerks && etat.spherePerks['gl-mini'] === 'learned';
  var success = miniPerk
    ? (_birdCursorPct >= 38 && _birdCursorPct <= 62)
    : (_birdCursorPct >= 45 && _birdCursorPct <= 55);
  if (success) {
    etat.workBoostFinTs = Date.now() + 120000;
    ajouterLog("event", "Bernardo caught a bird — work production x10 for 2 minutes!");
    ouvrirDialogueModal("bird-success-popup", {
      focusSelector: ".bird-success-btn",
      returnFocusSelector: "#bouton-sequence"
    });
  } else {
    afficherNotification("The bird got away...");
    ajouterLog("event", "Bernardo missed the bird.");
    _apresMinijeuOiseau();
  }
}

function fermerBirdSuccessPopup() {
  fermerDialogueModal("bird-success-popup");
  _apresMinijeuOiseau();
}

function skipBird() {
  if (_birdMiniJeuRaf) { cancelAnimationFrame(_birdMiniJeuRaf); _birdMiniJeuRaf = null; }
  fermerDialogueModal("bird-minijeu");
  ajouterLog("event", "A bird flew past... and nobody noticed.");
  _apresMinijeuOiseau();
}

document.addEventListener("keydown", function(e) {
  if (e.key !== " " && e.key !== "Enter") return;
  var modal = document.getElementById("bird-minijeu");
  if (modal && modal.style.display !== "none") {
    if (e.target && e.target.closest && e.target.closest("button, input, select, textarea, [role=button]")) return;
    e.preventDefault();
    clickerBird();
  }
});

// ════════════════════════════════════════════════════════════
// 14. INITIALIZATION
// ════════════════════════════════════════════════════════════

initialiserRessourcesAccessibles();
const partieExistante = charger();
const resumeAbsence    = partieExistante ? appliquerProgressionHorsLigne() : null;
rendu();
renduLogs();
renduStories();
renduObjectifs();
verifierObjectifs();
renduManagement();
if (resumeAbsence) afficherResumeAbsence(resumeAbsence);

planifierOiseau();

if (window.matchMedia("(max-width: 768px)").matches) {
  definirObjectifsReduits(true);
}

// Mobile browsers suspend timers (and even unload the tab) when backgrounded —
// catch up offline progress as soon as the tab becomes visible again, not just on full reload.
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "hidden") {
    sauvegarder();
  } else if (document.visibilityState === "visible") {
    const resume = appliquerProgressionHorsLigne();
    rendu(); renduLogs(); renduObjectifs(); renduManagement();
    if (resume) afficherResumeAbsence(resume);
  }
});
