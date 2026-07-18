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

// Keep navigation and log copy text-only. Resource and item cards retain their
// visual sprites; this only strips decorative emoji from interface labels and
// any legacy log entries loaded from an older save.
function retirerEmojisInterface(texte) {
  return String(texte == null ? "" : texte)
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

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

function recetteChoisieCount(recipeId) {
  return Object.values(etat.workRecipeSlots || {}).reduce(function(total, slots) {
    return total + slots.filter(function(slot) { return slot.recipeId === recipeId; }).length;
  }, 0);
}

const OBJECTIFS = [
  // ── Kitties
  {
    id: "firstKitty", label: "Catch your first cat",
    visible:  function(e) { return true; },
    accompli: function(e) { return e.chatons >= 1; }
  },
  {
    id: "secondKitty", label: "Catch a second cat",
    visible:  function(e) { return e.chatons >= 1; },
    accompli: function(e) { return e.chatons >= 2; }
  },
  {
    id: "thirdKitty", label: "Catch your third cat",
    visible:  function(e) { return e.chatons >= 2; },
    accompli: function(e) { return e.chatons >= 3; }
  },
  {
    id: "fiveKitties", label: "Recruit 5 cats to unlock Grasscatting",
    visible:  function(e) { return e.chatons >= 3; },
    accompli: function(e) { return e.chatons >= 5; }
  },
  {
    id: "sixKitties", label: "Recruit 6 cats to unlock Explorations",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function(e) { return e.chatons >= 6; }
  },
  {
    // Keep the legacy id so existing saves retain their completion state.
    id: "sevenKitties", label: "Recruit 5 cats to unlock Pebble Gathering",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function(e) { return e.chatons >= 5; }
  },

  // ── Cardboard & Buildings
  {
    id: "firstWoodcatter", label: "Choose the Cardboard Planks recipe",
    visible:  function(e) { return e.chatons >= 3; },
    accompli: function() { return recetteChoisieCount("cardboardPlanks") >= 1; }
  },
  {
    id: "firstCathouse", label: "Build your first Cardboard Box",
    visible:  function(e) { return e.cardboardPlanks >= 1; },
    accompli: function(e) { return e.cathouses.length >= 1; }
  },

  // ── Cardboard Planks recipe
  {
    id: "firstSawmillWorker", label: "Assign a cat to the Cardboard Planks recipe",
    visible:  function() { return recetteChoisieCount("cardboardPlanks") >= 1; },
    accompli: function() { return allocationCount("cardboardPlanks") >= 1; }
  },
  {
    id: "firstPlank", label: "Produce your first Cardboard Plank",
    visible:  function() { return allocationCount("cardboardPlanks") >= 1; },
    accompli: function(e) { return e.cardboardPlanks >= 1; }
  },
  {
    id: "tenPlanks", label: "Produce 10 Cardboard Planks to unlock Basic Wood",
    visible:  function(e) { return e.cardboardPlanks >= 1 || e.objectifsComplis.includes("firstPlank"); },
    accompli: function(e) { return e.cardboardPlanksTotalProduit >= 10 || storyEstVue("storyBasicWoodVue"); }
  },

  // ── Catnip & Catchen
  {
    id: "firstGrasscatter", label: "Choose the Catnip Salad recipe",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function() { return recetteChoisieCount("salads") >= 1; }
  },
  {
    id: "firstCatchenWorker", label: "Assign a cat to the Catnip Salad recipe",
    visible:  function() { return recetteChoisieCount("salads") >= 1; },
    accompli: function() { return allocationCount("salads") >= 1; }
  },
  {
    id: "firstSalad", label: "Produce your first Catnip Salad",
    visible:  function() { return allocationCount("salads") >= 1; },
    accompli: function(e) { return e.salads >= 1; }
  },
  {
    id: "feedBernardo", label: "Feed Bernardo to reach level 1",
    visible:  function(e) { return e.salads >= 1; },
    accompli: function(e) {
      return e.kittiesData.some(function(k) { return k.nom === "Bernardo" && k.niveau >= 1; });
    }
  },

  // ── Pebbles & Pawsonry
  {
    id: "firstPebbleGatherer", label: "Choose the Pebble Bricks recipe",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function() { return recetteChoisieCount("pebbleBricks") >= 1; }
  },
  {
    id: "firstPawsonryWorker", label: "Assign a cat to the Pebble Bricks recipe",
    visible:  function() { return recetteChoisieCount("pebbleBricks") >= 1; },
    accompli: function() { return allocationCount("pebbleBricks") >= 1; }
  },
  {
    id: "firstBrick", label: "Produce your first Pebble Brick",
    visible:  function() { return allocationCount("pebbleBricks") >= 1; },
    accompli: function(e) { return e.pebbleBricks >= 1; }
  },

  // ── Explorations & Job Center
  {
    id: "firstCampaign", label: "Complete the \"Search our trash\" campaign",
    visible:  function(e) { return e.chatons >= 6; },
    accompli: function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1 || e.campaignsCompletees.indexOf("checkTheTrash") !== -1; }
  },
  {
    id: "learnFromSchoolGuide", label: "Study and learn from the School Guide in Inventory",
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
    id: "firstJobTraining", label: "Train a cat as an Explorator",
    visible:  function(e) { return e.jobCenterConstruit; },
    accompli: function(e) { return e.kittiesData.some(function(k) { return k.metier === "explorator"; }); }
  },

  // ── Basic Wood
  {
    id: "firstBasicWoodGatherer", label: "Choose the Basic Wood Planks recipe",
    visible:  function() { return basicWoodDebloquee(); },
    accompli: function() { return recetteChoisieCount("basicWoodPlanks") >= 1; }
  },
  {
    id: "firstBasicSawmill", label: "Assign a cat to the Basic Wood Planks recipe",
    visible:  function() { return recetteChoisieCount("basicWoodPlanks") >= 1; },
    accompli: function() { return allocationCount("basicWoodPlanks") >= 1; }
  },
  {
    id: "firstBasicWoodPlank", label: "Produce your first Basic Wood Plank",
    visible:  function() { return allocationCount("basicWoodPlanks") >= 1; },
    accompli: function(e) { return e.basicWoodPlanks >= 1; }
  },

  // ── Cathouse (real)
  {
    id: "buildRealCathouse", label: "Build a Wood Cathouse to boost recruit speed",
    // Use lifetime gathering, not the fluctuating current stock consumed by the Sawmill.
    visible:  function(e) { return e.basicWoodTotalRecolte >= 1 || e.cathouseCount > 0; },
    accompli: function(e) { return e.cathouseCount >= 1; }
  }
];

// Presentation metadata only: this guides the player without changing unlocks,
// objective visibility or completion rules above.
const OBJECTIF_GUIDE = Object.freeze({
  firstKitty:               { ordre: 10,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 1 }; } },
  secondKitty:              { ordre: 20,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 2 }; } },
  thirdKitty:               { ordre: 30,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 3 }; } },
  firstWoodcatter:          { ordre: 40,  onglet: "work",         cible: "#recipe-slot-wood-0",    filtre: "wood", progression: function() { return { actuel: recetteChoisieCount("cardboardPlanks"), cible: 1 }; } },
  fiveKitties:              { ordre: 60,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 5 }; } },
  firstSawmillWorker:       { ordre: 80,  onglet: "work",         cible: "#recipe-slot-wood-0",    filtre: "wood", progression: function() { return { actuel: allocationCount("cardboardPlanks"), cible: 1 }; } },
  firstPlank:               { ordre: 90,  onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function(e) { return { actuel: e.cardboardPlanks, cible: 1 }; } },
  firstCathouse:            { ordre: 100, onglet: "buildings",    cible: "#bouton-cathouse",       progression: function(e) { return { actuel: e.cathouses.length, cible: 1 }; } },
  firstGrasscatter:         { ordre: 110, onglet: "work",         cible: "#recipe-slot-food-0",    filtre: "food", progression: function() { return { actuel: recetteChoisieCount("salads"), cible: 1 }; } },
  firstCatchenWorker:       { ordre: 130, onglet: "work",         cible: "#recipe-slot-food-0",    filtre: "food", progression: function() { return { actuel: allocationCount("salads"), cible: 1 }; } },
  firstSalad:               { ordre: 140, onglet: "work",         cible: "#work-recipe-slots-food", filtre: "food", progression: function(e) { return { actuel: e.salads, cible: 1 }; } },
  feedBernardo:             { ordre: 145, onglet: "gang",         cible: "#detail-experience",       action: "Open Bernardo's experience", progression: function(e) {
    const bernardo = e.kittiesData.find(function(k) { return k.nom === "Bernardo"; });
    return { actuel: bernardo ? bernardo.niveau : 0, cible: 1 };
  } },
  sixKitties:               { ordre: 150, onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 6 }; } },
  firstCampaign:            { ordre: 160, onglet: "explorations", cible: "#section-campaigns",     progression: function(e) {
    const mission = e.exploEnCours.find(function(explo) { return explo.id === "checkTheTrash"; });
    if (!mission) return { actuel: 0, cible: 1, texte: "Not started" };
    const ecoule = Math.min(mission.duree, Math.max(0, (Date.now() - mission.startTs) / 1000));
    return { actuel: ecoule, cible: mission.duree, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(mission.duree) };
  } },
  learnFromSchoolGuide:     { ordre: 170, onglet: "inventaire",   cible: "#section-items",         progression: function(e) {
    const lecture = e.learningEnCours && e.learningEnCours.itemId === "schoolGuide" ? e.learningEnCours : null;
    if (e.itemsEtudies && e.itemsEtudies.includes("schoolGuide")) return { actuel: 0.75, cible: 1, texte: "Study complete · solve the lesson" };
    if (!lecture) return { actuel: 0, cible: 1, texte: "Ready to study" };
    const ecoule = Math.min(lecture.duree / 1000, Math.max(0, (Date.now() - lecture.startTs) / 1000));
    return { actuel: ecoule, cible: lecture.duree / 1000, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(lecture.duree / 1000) };
  } },
  tenPlanks:                { ordre: 180, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function(e) { return { actuel: Math.min(10, e.cardboardPlanksTotalProduit), cible: 10 }; } },
  firstBasicWoodGatherer:   { ordre: 190, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function() { return { actuel: recetteChoisieCount("basicWoodPlanks"), cible: 1 }; } },
  sevenKitties:             { ordre: 200, onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 5 }; } },
  firstPebbleGatherer:      { ordre: 210, onglet: "work",         cible: "#recipe-slot-rock-0",    filtre: "rock", progression: function() { return { actuel: recetteChoisieCount("pebbleBricks"), cible: 1 }; } },
  firstPawsonryWorker:      { ordre: 230, onglet: "work",         cible: "#recipe-slot-rock-0",    filtre: "rock", progression: function() { return { actuel: allocationCount("pebbleBricks"), cible: 1 }; } },
  firstBrick:               { ordre: 240, onglet: "work",         cible: "#work-recipe-slots-rock", filtre: "rock", progression: function(e) { return { actuel: e.pebbleBricks, cible: 1 }; } },
  firstBasicSawmill:        { ordre: 250, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function() { return { actuel: allocationCount("basicWoodPlanks"), cible: 1 }; } },
  firstBasicWoodPlank:      { ordre: 260, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function(e) { return { actuel: e.basicWoodPlanks, cible: 1 }; } },
  buildRealCathouse:        { ordre: 270, onglet: "buildings",    cible: "#bouton-cathouse2",      progression: function(e) { return { actuel: e.cathouseCount, cible: 1 }; } },
  buildJobCenter:           { ordre: 280, onglet: "facilities",   cible: "#bouton-jobcenter",      progression: function(e) {
    const briques = Math.min(10, e.pebbleBricks);
    const planches = Math.min(1, e.basicWoodPlanks);
    return { actuel: Math.min(briques / 10, planches), cible: 1, texte: formaterNombre(briques) + "/10 bricks · " + formaterNombre(planches) + "/1 plank" };
  } },
  firstJobTraining:         { ordre: 290, onglet: "facilities",   cible: "#jc-interface",          progression: function(e) {
    if (!e.formationEnCours) return { actuel: 0, cible: 1, texte: "Choose a cat and a job" };
    const ecoule = Math.min(e.formationEnCours.duree, Math.max(0, (Date.now() - e.formationEnCours.startTs) / 1000));
    return { actuel: ecoule, cible: e.formationEnCours.duree, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(e.formationEnCours.duree) };
  } }
});


// ════════════════════════════════════════════════════════════
// 2. GAME STATE
// ════════════════════════════════════════════════════════════

// State factory lives in js/core/state.js.
const stateCore = globalThis.CatInc.state;
const creerEtatInitial = stateCore.creerEtatInitial;
const remplacerEtat = stateCore.remplacerEtat;
const etat = creerEtatInitial();

function reinitialiserEtat() {
  remplacerEtat(etat, creerEtatInitial());
  workStructureInitialisee = false;
}


// ════════════════════════════════════════════════════════════
// 3. DERIVED VALUES & CALCULATIONS
// ════════════════════════════════════════════════════════════



function allocationCount(action) {
  const pair = RESOURCE_PAIRS.find(function(candidate) {
    return candidate.rawAction === action || candidate.procAction === action || candidate.recipeId === action;
  });
  if (pair) {
    return (etat.workRecipeSlots[pair.family] || []).filter(function(slot) {
      return slot.recipeId === pair.recipeId && slot.kittyIndex !== null;
    }).length;
  }
  return 0;
}

function kittyIsInWorkerSlot(kittyIdx) {
  return Object.values(etat.workRecipeSlots || {}).some(function(slots) {
    return slots.some(function(s) { return s.kittyIndex === kittyIdx; });
  });
}

function reinitialiserProgressionRecette(slot, retirerRecette) {
  if (!slot) return;
  viderProgressionRecette(slot);
  slot.kittyIndex = null;
  if (retirerRecette) slot.recipeId = null;
}

function viderProgressionRecette(slot) {
  if (!slot) return;
  slot.phase = "idle";
  slot.phaseProgress = 0;
  slot.outputCarry = 0;
  slot.gatheredInputs = {};
  slot.reservedInputs = {};
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
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
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
var ACTION_DISPLAY = { fishcatting: "Anchovy", grilledAnchovy: "Grilled Anchovy", woodcatting: "Cardboard Pieces", basicWoodcatting: "Basic Wood", grasscatting: "Catnip", pebblegathering: "Pebbles", rockgathering: "Rocks", sawmill: "Cardboard Planks", basicSawmill: "Basic Wood Planks", brickfactory: "Pebble Bricks", rockFactory: "Rock Bricks", catchen: "Catnip Salad" };

function kittyAllocationLabel(kittyIdx) {
  // Recipe slot
  var assignedRecipe = null;
  Object.keys(etat.workRecipeSlots || {}).forEach(function(family) {
    const slot = etat.workRecipeSlots[family].find(function(candidate) { return candidate.kittyIndex === kittyIdx; });
    if (slot) assignedRecipe = RESOURCE_PAIRS.find(function(pair) { return pair.recipeId === slot.recipeId; });
  });
  if (assignedRecipe) {
    return { text: "Producing: " + assignedRecipe.procLabel, cls: "kitty-statut-work" };
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

function butinScoutingVide() {
  return { successful: 0, failed: 0, regular: 0, lucky: 0, superLucky: 0, doubled: 0, rewards: {} };
}

function obtenirButinScouting(scoutingId) {
  if (!etat.butinsScouting) etat.butinsScouting = {};
  if (!etat.butinsScouting[scoutingId]) etat.butinsScouting[scoutingId] = butinScoutingVide();
  return etat.butinsScouting[scoutingId];
}

function categorieRecompenseScouting(entries, selected) {
  if (!entries || entries.length <= 1) return "regular";
  const triees = entries.slice().sort(function(a, b) { return b.weight - a.weight; });
  const rang = triees.findIndex(function(entry) {
    return entry === selected || (entry.recompense === selected.recompense && entry.qty === selected.qty);
  });
  if (rang <= 0) return "regular";
  if (rang === triees.length - 1) return "superLucky";
  return "lucky";
}

function ajouterAuButinScouting(butin, recompenseId, qty, categorie, doubled) {
  if (!recompenseId || qty <= 0) return;
  butin[categorie] += 1;
  if (doubled) butin.doubled += 1;
  butin.rewards[recompenseId] = (butin.rewards[recompenseId] || 0) + qty;
}

function terminerScouting(scoutingId) {
  var runs = arguments[1];
  var def = CONFIG.scoutings[scoutingId];
  var sc  = etat.scoutingsEnCours[scoutingId];
  if (!def || !sc) return;
  var runCount = Math.max(1, Math.floor(runs || 1));
  var butin = obtenirButinScouting(scoutingId);
  for (var run = 0; run < runCount; run++) {
    // Success power is frozen for the active run. Later auto-repeats use the
    // cat's current power, matching the former restart behavior.
    var power = run === 0 && Number.isFinite(sc.power) ? sc.power : kittyEP(sc.kittyIndex);
    var successChance = def.difficulte > 0 ? Math.min(1, power / def.difficulte) : 1;
    var success = Math.random() < successChance;
    if (!success) {
      butin.failed += 1;
      continue;
    }
    butin.successful += 1;
    if (def.recompenseTable) {
      var table = applyPerkCatFood(def.recompenseTable, sc.kittyIndex);
      var entry = resoudreRecompenseTable(table);
      var tableQty = tryDoubleReward(entry.qty, sc.kittyIndex);
      ajouterAuButinScouting(butin, entry.recompense, tableQty, categorieRecompenseScouting(def.recompenseTable, entry), tableQty > entry.qty);
    } else if (!def.dropChance || Math.random() < def.dropChance) {
      var range = def.recompenseRange || [{ qty: 1, weight: 100 }];
      var selectedRange = resoudreRecompenseTable(range);
      var rangeQty = tryDoubleReward(selectedRange.qty, sc.kittyIndex);
      ajouterAuButinScouting(butin, def.recompense, rangeQty, categorieRecompenseScouting(range, selectedRange), rangeQty > selectedRange.qty);
    }
  }
  ajouterLog("event", runCount + " scouting run" + (runCount === 1 ? "" : "s") + " completed for " + def.nom + ". Rewards are waiting on the map.");
  // Auto-restart with the same kitty while preserving any elapsed remainder.
  var restartDuree = scoutingHalveTime(sc.kittyIndex) ? def.duree / 2 : def.duree;
  etat.scoutingsEnCours[scoutingId] = {
    kittyIndex: sc.kittyIndex,
    power: kittyEP(sc.kittyIndex),
    startTs: sc.startTs + runCount * ((sc.duree !== undefined) ? sc.duree : def.duree) * 1000,
    duree: restartDuree
  };
  carteDirty = true;
  exploTabDirty = true;
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
  etat.scoutingsEnCours[scoutingId] = { kittyIndex: kittyIndex, power: kittyEP(kittyIndex), startTs: Date.now(), duree: duree };
  // The map badge is derived from the persisted running-scouting state. Mark
  // the map dirty and refresh it immediately so the zone turns green without
  // waiting for a reload or the next game tick.
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder();
  renduCarte(unlocks());
  renderCampaignCards();
}

function retirerKittyScouting(scoutingId) {
  delete etat.scoutingsEnCours[scoutingId];
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder();
  renduCarte(unlocks());
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
  return managerSpeedMultiplier(kitty, "houses");
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

function bonusMaisonsAttrapage() {
  const builderBonus = builderManagerBonus();
  const fromWoodHouses = etat.cathouses.length * CONFIG.cathouse.reductionParSeconde
                       + etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde;
  const stoneBonus = etat.stoneCathouseCount * CONFIG.stoneCathouse.speedBonus;
  return {
    woodPerSecond: fromWoodHouses * builderBonus,
    stonePercent: stoneBonus
  };
}

function vitesseAttrapage() {
  const maisons = bonusMaisonsAttrapage();
  const recruitPerk = etat.spherePerks && etat.spherePerks['gl-rec'] === 'learned';
  const glBonus = recruitPerk ? gangLeaderBonus() : 1;
  return (1 + maisons.woodPerSecond) * (1 + maisons.stonePercent) * glBonus;
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
const avancerRecetteSlot = globalThis.CatInc.production.avancerRecetteSlot;

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
const MANAGER_SPHERE_PERKS = {
  wood: { production: 'lj-prod', speed: 'lj-speed', slot: 'lj-slot', recipeFamily: 'wood' },
  food: { production: 'farmer-prod', speed: 'farmer-speed', slot: 'farmer-slot', recipeFamily: 'food' },
  rock: { production: 'miner-prod', speed: 'miner-speed', slot: 'miner-slot', recipeFamily: 'rock' },
  sawmill: { cost: 'carpenter-cost', speed: 'carpenter-speed', slot: 'carpenter-slot', recipeFamily: 'wood' },
  catchen: { cost: 'chef-cost', speed: 'chef-speed', slot: 'chef-slot', recipeFamily: 'food' },
  pawsonry: { cost: 'stonemason-cost', speed: 'stonemason-speed', slot: 'stonemason-slot', recipeFamily: 'rock' },
  houses: { auto: 'builder-auto', formula: 'builder-cost', speed: 'builder-speed' }
};

function spherePerkLearned(perkId) {
  return !!(perkId && etat.spherePerks && etat.spherePerks[perkId] === 'learned');
}

function managerSpeedMultiplier(kitty, famille) {
  const base = (kitty.managerMult || 1.5) * jobLevelMultiplier(kitty);
  const perks = MANAGER_SPHERE_PERKS[famille];
  return perks && spherePerkLearned(perks.speed) ? base * 1.5 : base;
}

function managerProductionMultiplier(famille) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  return perks && spherePerkLearned(perks.production) ? 1.5 : 1;
}

function managerCostMultiplier(famille) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  return perks && spherePerkLearned(perks.cost) ? 0.5 : 1;
}

function managerSphereStateKey(famille) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return "";
  return (spherePerkLearned(perks.production) ? "prod" : "")
    + (spherePerkLearned(perks.speed) ? "speed" : "")
    + (spherePerkLearned(perks.cost) ? "cost" : "")
    + (spherePerkLearned(perks.slot) ? "slot" : "");
}

function managerPerksHtml(famille, className, hideHouseBuildPerks) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return "";
  const cls = className || "manager-perk-txt";
  let html = "";
  if (spherePerkLearned(perks.production)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×1.5</span> production quantity (perk)</span>';
  }
  if (spherePerkLearned(perks.cost)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×0.5</span> production cost (perk)</span>';
  }
  if (spherePerkLearned(perks.formula) && !hideHouseBuildPerks) {
    html += '<span class="' + cls + '">1.6^n house cost (perk)</span>';
  }
  if (spherePerkLearned(perks.auto) && !hideHouseBuildPerks) {
    html += '<span class="' + cls + '">Auto build Wood Houses (perk)</span>';
  }
  if (spherePerkLearned(perks.speed)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×1.5</span> manager speed (perk)</span>';
  }
  if (spherePerkLearned(perks.slot) && perks.recipeFamily) {
    const familyLabel = WORK_FAMILIES[perks.recipeFamily] ? WORK_FAMILIES[perks.recipeFamily].label : perks.recipeFamily;
    html += '<span class="' + cls + '">+1 ' + familyLabel + ' recipe slot (perk)</span>';
  }
  return html;
}

function synchroniserSlotsRecettesAvecPerks() {
  if (!etat.workRecipeSlots) etat.workRecipeSlots = {};
  let changed = false;
  Object.keys(WORK_FAMILIES).forEach(function(recipeFamily) {
    let slots = Array.isArray(etat.workRecipeSlots[recipeFamily]) ? etat.workRecipeSlots[recipeFamily] : [];
    while (slots.length < 2) {
      slots.push(stateCore.makeWorkRecipeSlot());
      changed = true;
    }
    const extraSlots = Object.keys(MANAGER_SPHERE_PERKS).reduce(function(total, managerFamily) {
      const perks = MANAGER_SPHERE_PERKS[managerFamily];
      return total + (perks.recipeFamily === recipeFamily && spherePerkLearned(perks.slot) ? 1 : 0);
    }, 0);
    const targetCount = 2 + extraSlots;
    while (slots.length < targetCount) {
      slots.push(stateCore.makeWorkRecipeSlot());
      changed = true;
    }
    etat.workRecipeSlots[recipeFamily] = slots;
  });
  return changed;
}

function managerKittyForFamily(famille) {
  if (!famille || !METIER_PAR_FAMILLE[famille]) return null;
  const managerIdx = etat.managers[famille];
  if (managerIdx === null || managerIdx === undefined) return null;
  const kitty = etat.kittiesData[managerIdx];
  return kitty && METIER_PAR_FAMILLE[famille].includes(kitty.metier) ? kitty : null;
}

function multiplicateurFamille(action) {
  const famille = MAP_FAMILLE[action];
  if (!famille) return 1;
  const kitty = managerKittyForFamily(famille);
  return kitty ? managerSpeedMultiplier(kitty, famille) : 1;
}

function multiplicateurProductionFamille(action) {
  const famille = MAP_FAMILLE[action];
  return managerKittyForFamily(famille) ? managerProductionMultiplier(famille) : 1;
}

function multiplicateurCoutFamille(action) {
  const famille = MAP_FAMILLE[action];
  return managerKittyForFamily(famille) ? managerCostMultiplier(famille) : 1;
}

function dureeBrute() {
  const n = etat.clicCount;
  return n <= 10
    ? 5 * Math.pow(3, n)
    : 5 * Math.pow(3, 10) * Math.pow(1.3, n - 10);
}
function dureeEffective() { return Math.max(1, dureeBrute() / vitesseAttrapage()); }

// Integrate the catch/recruit cooldown as a sequence of speed segments. This
// is important when a house or manager is added during an active cycle: the
// speed that was active before the change consumes only the elapsed time up
// to the change, while the new speed consumes the remaining raw time.
function vitesseSequenceEffective() {
  const devSpeed = (typeof vitesse === "number" && Number.isFinite(vitesse) && vitesse > 0) ? vitesse : 1;
  return Math.max(0.000001, vitesseAttrapage() * devSpeed);
}

function actualiserProgressionSequence(maintenant) {
  if (!etat.sequenceEnCours) return;
  const maintenantTs = Number.isFinite(maintenant) ? maintenant : Date.now();
  const duree = Math.max(0, Number(etat.sequenceDuree) || 0);

  // Saves created before segmented progress existed only have a start time.
  // Preserve their current visible progress once, then continue with the new
  // non-retroactive model from this point onward.
  if (!Number.isFinite(etat.sequenceDerniereMajTs) || etat.sequenceDerniereMajTs <= 0) {
    const debut = Number.isFinite(etat.sequenceDebutTs) && etat.sequenceDebutTs > 0
      ? etat.sequenceDebutTs
      : maintenantTs;
    const elapsed = Math.max(0, (maintenantTs - debut) / 1000);
    const currentSpeed = vitesseSequenceEffective();
    etat.sequenceProgressBrute = Math.min(duree, Math.max(0, elapsed * currentSpeed));
    etat.sequenceDerniereMajTs = maintenantTs;
    etat.sequenceVitesseDerniere = currentSpeed;
    return;
  }

  const dernierTs = etat.sequenceDerniereMajTs;
  const elapsed = Math.max(0, (maintenantTs - dernierTs) / 1000);
  const previousSpeed = Number.isFinite(etat.sequenceVitesseDerniere) && etat.sequenceVitesseDerniere > 0
    ? etat.sequenceVitesseDerniere
    : vitesseSequenceEffective();
  const progress = Number.isFinite(etat.sequenceProgressBrute) ? etat.sequenceProgressBrute : 0;
  etat.sequenceProgressBrute = Math.min(duree, Math.max(0, progress) + elapsed * previousSpeed);
  etat.sequenceDerniereMajTs = maintenantTs;
  etat.sequenceVitesseDerniere = vitesseSequenceEffective();
}

function tempsRestantSequence() {
  if (!etat.sequenceEnCours) return 0;
  actualiserProgressionSequence();
  return Math.max(0, etat.sequenceDuree - etat.sequenceProgressBrute);
}

function progressionSequence() {
  if (!etat.sequenceEnCours) return 1;
  actualiserProgressionSequence();
  return etat.sequenceDuree > 0
    ? Math.min(1, Math.max(0, etat.sequenceProgressBrute) / etat.sequenceDuree)
    : 1;
}

function recupererButinScouting(scoutingId) {
  const butin = etat.butinsScouting[scoutingId];
  if (!butin) return;
  Object.keys(butin.rewards).forEach(function(recompenseId) {
    appliquerRecompense(recompenseId, butin.rewards[recompenseId]);
  });
  const totalRuns = butin.successful + butin.failed;
  ajouterLog("event", "Scouting rewards claimed after " + totalRuns + " run" + (totalRuns === 1 ? "" : "s") + ".");
  delete etat.butinsScouting[scoutingId];
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function sequenceEstPrete() {
  return !etat.sequenceEnCours || tempsRestantSequence() <= 0;
}

function nomProchainChat() {
  return NOMS_KITTIES[etat.kittiesData.length] || ("Cat #" + (etat.kittiesData.length + 1));
}

function assurerVisageProchainChat() {
  if (!etat.prochainVisageChaton) {
    etat.prochainVisageChaton = assignerVisageChaton(nomProchainChat());
    sauvegarder();
  }
  return etat.prochainVisageChaton;
}

function demarrerRechargeCatch() {
  assurerVisageProchainChat();
  etat.sequenceEnCours = true;
  etat.sequenceDebutTs = Date.now();
  etat.sequenceDuree = dureeBrute();
  etat.sequenceProgressBrute = 0;
  etat.sequenceDerniereMajTs = etat.sequenceDebutTs;
  etat.sequenceVitesseDerniere = vitesseSequenceEffective();
}

function marquerSequencePrete() {
  if (!etat.sequenceEnCours || tempsRestantSequence() > 0) return false;
  etat.sequenceEnCours = false;
  sauvegarder();
  return true;
}

function coutProchaineCathouse() {
  const croissance = spherePerkLearned('builder-cost') ? 1.6 : 1.7;
  return Math.ceil(Math.pow(croissance, etat.cathouses.length));
}

function coutProchaineCatHouse() {
  const croissance = spherePerkLearned('builder-cost') ? 1.6 : 1.7;
  return Math.ceil(Math.pow(croissance, etat.cathouseCount));
}

function autoBuildWoodHousesIfNeeded() {
  if (!etat.autoBuildWoodHouses || !spherePerkLearned('builder-auto')) return 0;
  let construits = 0;
  while (construits < 1000) {
    let construitCettePasse = false;
    const coutCarton = coutProchaineCathouse();
    if (coutCarton * 2 < etat.cardboardPlanks) {
      etat.cardboardPlanks -= coutCarton;
      etat.cathouses.push(Date.now());
      construits += 1;
      construitCettePasse = true;
    }
    if (construits >= 1000) break;
    const coutBois = coutProchaineCatHouse();
    if (coutBois * 2 < etat.basicWoodPlanks) {
      etat.basicWoodPlanks -= coutBois;
      etat.cathouseCount += 1;
      construits += 1;
      construitCettePasse = true;
    }
    if (!construitCettePasse) break;
  }
  if (construits > 0) {
    ajouterLog("event", "Auto-built " + construits + " Wood House" + (construits > 1 ? "s." : "."));
  }
  return construits;
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
function basicWoodDebloquee()       { return etat.cardboardPlanksTotalProduit >= 10 || etat.cardboardPlanks >= 10 || etat.objectifsComplis.includes("tenPlanks") || storyEstVue("storyBasicWoodVue") || etat.basicWoodTotalRecolte >= 1; }
function basicSawmillDebloquee()    { return basicWoodDebloquee(); }
function catHouseDebloquee()        { return etat.basicWoodTotalRecolte >= 1 || etat.cathouseCount > 0; }
function stoneHousesDebloques()     { return etat.pebbleBricks >= 1 || etat.stoneCathouseCount > 0 || etat.objectifsComplis.includes("firstBrick"); }
function buildingsDebloques()       { return etat.cardboardPlanks >= 1 || etat.objectifsComplis.includes("firstPlank") || etat.cathouses.length > 0; }
function scierieDebloquee()         { return catheringDebloquee(); }
function brickfactoryDebloquee()    { return pebblegatheringDebloquee(); }
function pawcessingDebloquee()      { return scierieDebloquee(); }
function catchenDebloquee()         { return grasscattingDebloquee(); }
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

function formaterSecondesBrutes(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return "";
  return Math.max(1, Math.ceil(sec)) + "s";
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
let redemarrageMajeurRequis = false;
let preferencesAncienneSauvegarde = null;

function jouerSonAffectation() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playCatAssignment === "function") {
    audio.playCatAssignment(etat.volumeEffetsSonores);
  }
}

function jouerSonMiaulement() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playCatMeow === "function") {
    audio.playCatMeow(etat.volumeEffetsSonores);
  }
}

function jouerSonAilesOiseau() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playBirdWingFlaps === "function") {
    audio.playBirdWingFlaps(etat.volumeEffetsSonores);
  }
}

function demarrerMusiqueAmbiante() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.startMusic === "function") {
    audio.startMusic(etat.volumeMusique);
  }
}

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
    if (analyse.incompatible) {
      const ancienneSauvegarde = analyse.data || {};
      preferencesAncienneSauvegarde = {
        volumeEffetsSonores: Number.isFinite(ancienneSauvegarde.volumeEffetsSonores)
          ? Math.max(0, Math.min(1, ancienneSauvegarde.volumeEffetsSonores))
          : 0.3,
        volumeMusique: Number.isFinite(ancienneSauvegarde.volumeMusique)
          ? Math.max(0, Math.min(1, ancienneSauvegarde.volumeMusique))
          : 0.5,
        afficherTempsAjusteRecrutement: ancienneSauvegarde.afficherTempsAjusteRecrutement === true
      };
      redemarrageMajeurRequis = true;
      sauvegardeVerrouillee = true;
      return false;
    }
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
  workStructureInitialisee = false;

  // Promotion remains in the browser layer because it creates a notification and a log.
  if (etat.itemsAppris.includes("schoolGuide") || etat.jobCenterConstruit) assignerGangLeader();
  return true;
}

function confirmerRedemarrageMajeur() {
  const preferences = preferencesAncienneSauvegarde || {};
  localStorage.removeItem(SAVE_KEY);
  STORIES.forEach(function(story) { localStorage.removeItem(story.flag); });
  localStorage.removeItem("workDetailsHintSeen");
  reinitialiserEtat();
  etat.volumeEffetsSonores = Number.isFinite(preferences.volumeEffetsSonores) ? preferences.volumeEffetsSonores : 0.3;
  etat.volumeMusique = Number.isFinite(preferences.volumeMusique) ? preferences.volumeMusique : 0.5;
  etat.afficherTempsAjusteRecrutement = preferences.afficherTempsAjusteRecrutement === true;
  preferencesAncienneSauvegarde = null;
  redemarrageMajeurRequis = false;
  sauvegardeVerrouillee = false;
  sauvegarder();
  fermerDialogueModal("save-upgrade-modal");
  rendu();
  renduLogs();
  renduStories();
  renduObjectifs();
  renduManagement();
  afficherModal("ecran-intro");
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
  afficherModal("ecran-intro");
}

function ouvrirModalSettings() {
  document.getElementById("toggle-adjusted-time").checked = etat.afficherTempsAjusteRecrutement;
  const sfxInput = document.getElementById("settings-sfx-volume");
  const musicInput = document.getElementById("settings-music-volume");
  if (sfxInput) {
    sfxInput.value = Math.round(etat.volumeEffetsSonores * 100);
    actualiserVolumeAudioUI("sfx", sfxInput.value);
  }
  if (musicInput) {
    musicInput.value = Math.round(etat.volumeMusique * 100);
    actualiserVolumeAudioUI("music", musicInput.value);
  }
  ouvrirDialogueModal("settings-modal", {
    dismissible: true,
    fermer: fermerModalSettings,
    focusSelector: ".explo-modal-close",
    returnFocusSelector: ".bouton-settings"
  });
}
function actualiserVolumeAudioUI(canal, rawValue) {
  const value = Math.max(0, Math.min(100, Number(rawValue) || 0));
  const output = document.getElementById(canal === "sfx" ? "settings-sfx-volume-value" : "settings-music-volume-value");
  if (output) output.value = Math.round(value) + "%";
  if (output) output.textContent = Math.round(value) + "%";
}
function gererVolumeAudio(canal, rawValue) {
  const value = Math.max(0, Math.min(100, Number(rawValue) || 0)) / 100;
  if (canal === "sfx") etat.volumeEffetsSonores = value;
  if (canal === "music") {
    etat.volumeMusique = value;
    const audio = globalThis.CatInc && globalThis.CatInc.audio;
    if (audio && typeof audio.setMusicVolume === "function") audio.setMusicVolume(value);
  }
  actualiserVolumeAudioUI(canal, value * 100);
  sauvegarder();
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
      if (analyse.incompatible) {
        alert("This save uses the previous Work system and cannot be imported into this version. Start a new game to use recipe-based production.");
        event.target.value = "";
        return;
      }
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
      bloc.appendChild(document.createTextNode(retirerEmojisInterface(ligne)));
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
  buildings: "Houses",
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
  document.body.classList.toggle("objectifs-disponibles", actifs.length > 0);
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
  if (objectifId === "feedBernardo") {
    const bernardoIndex = etat.kittiesData.findIndex(function(k) { return k.nom === "Bernardo"; });
    if (bernardoIndex >= 0) {
      kittySelectionnee = bernardoIndex;
      detailKittyMobileOuvert = true;
    }
  }
  if (guide.onglet) changerOnglet(guide.onglet);
  // changerOnglet() rerenders the selected tab's content, but Gang is kept
  // outside the master dispatcher. Rebuild it after setting the tutorial's
  // kitty selection so Bernardo's detail panel is actually opened.
  if (guide.onglet === "gang") renduManagement();
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
  const logsVisible = etat.chatons >= 3;
  ecrireStyle(domParId("onglet-logs"), "display", logsVisible ? "inline-flex" : "none");
  actualiserBadgeOnglet("gang", true);
  actualiserBadgeOnglet("logs", logsVisible);
  actualiserIndicateursExploration();

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
  var boostActif = !!(etat.workBoostFinTs && Date.now() < etat.workBoostFinTs);
  if (document.body) document.body.classList.toggle("work-boost-actif", boostActif);
  if (boostEl) {
    if (boostActif) {
      var boostRestant = Math.ceil((etat.workBoostFinTs - Date.now()) / 1000);
      ecrireTexte(boostEl, "⚡ Work ×10 — " + formaterTemps(boostRestant));
      ecrireStyle(boostEl, "display", "block");
    } else {
      ecrireStyle(boostEl, "display", "none");
    }
  }

  RESOURCE_PAIRS.forEach(function(pair) {
    var resKey = pair.procRes.replace(/([A-Z])/g, '-$1').toLowerCase();
    afficherTauxNet("taux-" + resKey, pair.procUnlocked(u) ? tauxNetRessource(pair.procRes, u) : 0);
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
  const enCours = etat.sequenceEnCours && tempsRestantSequence() > 0;
  const pret = !enCours;
  const restant = etat.afficherTempsAjusteRecrutement
    ? tempsRestantSequence() / vitesseAttrapage()
    : tempsRestantSequence();
  const btnSeq   = domParId("bouton-sequence");
  const marker   = domParId("sequence-chat-marker");
  const recruit  = etat.chatons >= 3;
  const tentativeOuverte = _catCatchActif || _recruitMiniJeuActif;
  const prochainNom = nomProchainChat();
  const prochainVisage = assurerVisageProchainChat();
  ecrirePropriete(btnSeq, "disabled", false);
  const statsWrapper = domParId("stats-attrapage-wrapper");
  ecrireStyle(statsWrapper, "display", recruit ? "" : "none");
  if (!recruit && statsAttrapageOuvert) definirStatsAttrapageOuvert(false);
  ecrireStyle(btnSeq, "display", pret && !tentativeOuverte ? "" : "none");
  basculerClasse(btnSeq, "recruit", recruit);
  ecrireTexte(btnSeq, recruit ? "Recruit the Cat" : "Catch the Cat");
  ecrireStyle(domParId("conteneur-barre-sequence"), "display", "block");
  setBarreProgress("barre-sequence", progressionSequence());
  if (marker && marker.getAttribute("src") !== prochainVisage) marker.setAttribute("src", prochainVisage);
  if (marker && marker.getAttribute("alt") !== prochainNom) marker.setAttribute("alt", prochainNom);
  ecrireTexte(domParId("info-sequence-timer"), enCours ? formaterTemps(restant) : "Ready");

  renduStatsAttrapage();
}

// ── 9b-bis. Recruiting stats popover
let statsAttrapageOuvert = false;

function positionnerStatsAttrapagePopover() {
  const popover = document.getElementById("popover-stats-attrapage");
  const bouton = document.getElementById("bouton-stats-attrapage");
  if (!popover || !bouton) return;
  if (statsAttrapageOuvert && window.innerWidth <= 768) {
    const rect = bouton.getBoundingClientRect();
    popover.style.position = "fixed";
    popover.style.left = "8px";
    popover.style.right = "8px";
    popover.style.top = (rect.bottom + 10) + "px";
    popover.style.minWidth = "0";
    popover.style.maxWidth = "none";
  } else {
    ["position", "left", "right", "top", "minWidth", "maxWidth"].forEach(function(property) {
      popover.style[property] = "";
    });
  }
}

function definirStatsAttrapageOuvert(ouvert) {
  statsAttrapageOuvert = Boolean(ouvert);
  const popover = document.getElementById("popover-stats-attrapage");
  const bouton  = document.getElementById("bouton-stats-attrapage");
  popover.style.display = statsAttrapageOuvert ? "flex" : "none";
  popover.setAttribute("aria-hidden", statsAttrapageOuvert ? "false" : "true");
  bouton.setAttribute("aria-expanded", statsAttrapageOuvert ? "true" : "false");
  bouton.setAttribute("aria-label", statsAttrapageOuvert ? "Hide recruiting stats" : "Show recruiting stats");
  if (statsAttrapageOuvert) renduStatsAttrapage();
  positionnerStatsAttrapagePopover();
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
  const maisons     = bonusMaisonsAttrapage();
  const recruitPerk = etat.spherePerks && etat.spherePerks['gl-rec'] === 'learned';
  const restant     = sequenceEstPrete() ? 0 : tempsRestantSequence() / taux;

  document.getElementById("stat-raw").textContent     = formaterTempsStat(raw);
  document.getElementById("stat-wood").textContent    = "+" + maisons.woodPerSecond.toFixed(2) + "s/s";
  document.getElementById("stat-stone").textContent   = "+" + (maisons.stonePercent * 100).toFixed(0) + "%";
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
window.addEventListener("resize", positionnerStatsAttrapagePopover);
document.addEventListener("scroll", positionnerStatsAttrapagePopover, true);

// ── 9c. Work resources (separate Gathering and Processing views)
const RESOURCE_PAIRS = [
  {
    recipeId: "cardboardPlanks", family: "wood", tier: 1, rawTotalKey: "cardboardPiecesTotalRecolte", procTotalKey: "cardboardPlanksTotalProduit",
    rawAction: "woodcatting", rawRes: "cardboardPieces", rawCfg: CONFIG.woodcatting,
    rawLabel: "Cardboard Pieces", rawIcon: "img/resources/Cardboard Pieces_Final.png",
    rawUnlocked: function(u) { return u.cathering; },
    procAction: "sawmill", procRes: "cardboardPlanks", procCfg: CONFIG.sawmill,
    procLabel: "Cardboard Planks", procIcon: "img/resources/Cardboard Plank_Final.png",
    procSecUnite: "secondesParPlanche", procSecRaw: "secondesParCardboard",
    procMultAction: "sawmill", procUnlocked: function(u) { return u.scierie; },
    bloqueeKey: "scieriBloquee",
    inputs: [{ res: "cardboardPieces", label: "Cardboard Pieces", icon: "img/resources/Cardboard Pieces_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "basicWoodPlanks", family: "wood", tier: 2, rawTotalKey: "basicWoodTotalRecolte",
    rawAction: "basicWoodcatting", rawRes: "basicWood", rawCfg: CONFIG.basicWoodcatting,
    rawLabel: "Basic Wood", rawIcon: "img/resources/Basic Wood_Final.png",
    rawUnlocked: function(u) { return u.basicWood; },
    procAction: "basicSawmill", procRes: "basicWoodPlanks", procCfg: CONFIG.basicSawmill,
    procLabel: "Basic Wood Planks", procIcon: "img/resources/Basic Wood Plank_Final.png",
    procSecUnite: "secondesParPlanche", procSecRaw: "secondesParBasicWood",
    procMultAction: "sawmill", procUnlocked: function(u) { return u.basicSawmill; },
    bloqueeKey: "basicSawmillBloquee",
    inputs: [{ res: "basicWood", label: "Basic Wood", icon: "img/resources/Basic Wood_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "salads", family: "food", tier: 1, rawTotalKey: "catnipTotalRecolte",
    rawAction: "grasscatting", rawRes: "catnip", rawCfg: CONFIG.grasscatting,
    rawLabel: "Catnip", rawIcon: "img/resources/Catnip_Final.png",
    rawUnlocked: function(u) { return u.grasscat; },
    procAction: "catchen", procRes: "salads", procCfg: CONFIG.catchen,
    procLabel: "Catnip Salad", procIcon: "img/resources/Catnip Salad_Final.png",
    procSecUnite: "secondesParSalad", procSecRaw: "secondesParCatnip",
    procMultAction: "catchen", procUnlocked: function(u) { return u.catchen; },
    bloqueeKey: "catchenBloquee",
    inputs: [{ res: "catnip", label: "Catnip", icon: "img/resources/Catnip_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "grilledAnchovy", family: "food", tier: 2, rawTotalKey: "anchovyTotalRecolte",
    rawAction: "fishcatting", rawRes: "anchovy", rawCfg: CONFIG.fishcatting,
    rawLabel: "Anchovy", rawIcon: "img/resources/Anchovy_Final.png?v=0.0029",
    rawUnlocked: function(u) { return u.anchovy; },
    procAction: "grilledAnchovy", procRes: "grilledAnchovy", procCfg: CONFIG.grilledAnchovy,
    procLabel: "Grilled Anchovy", procIcon: "img/resources/Grilled Anchovy_Final.png?v=0.0029",
    procSecUnite: "secondesParRecette", procSecRaw: "secondesParAnchovy",
    procMultAction: "grilledAnchovy", procUnlocked: function(u) { return u.grilledAnchovy; },
    bloqueeKey: "catchenAnchovyBloquee",
    inputs: [{ res: "anchovy", label: "Anchovy", icon: "img/resources/Anchovy_Final.png?v=0.0029", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "pebbleBricks", family: "rock", tier: 1, rawTotalKey: "pebblesTotalRecolte",
    rawAction: "pebblegathering", rawRes: "pebbles", rawCfg: CONFIG.pebblegathering,
    rawLabel: "Pebbles", rawIcon: "img/resources/Pebbles_Final.png",
    rawUnlocked: function(u) { return u.pebblecat; },
    procAction: "brickfactory", procRes: "pebbleBricks", procCfg: CONFIG.brickfactory,
    procLabel: "Pebble Bricks", procIcon: "img/resources/Pebble Brick_Final.png",
    procSecUnite: "secondesParBrique", procSecRaw: "secondesParPebble",
    procMultAction: "brickfactory", procUnlocked: function(u) { return u.brickfact; },
    bloqueeKey: "brickBloquee",
    inputs: [{ res: "pebbles", label: "Pebbles", icon: "img/resources/Pebbles_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "rockBricks", family: "rock", tier: 2, rawTotalKey: "rocksTotalRecolte",
    rawAction: "rockgathering", rawRes: "rocks", rawCfg: CONFIG.rockgathering,
    rawLabel: "Rocks", rawIcon: "img/resources/Rock_Final.png",
    rawUnlocked: function(u) { return u.rockcat; },
    procAction: "rockFactory", procRes: "rockBricks", procCfg: CONFIG.rockFactory,
    procLabel: "Rock Bricks", procIcon: "img/resources/Rock Brick_Final.png",
    procSecUnite: "secondesParBrique", procSecRaw: "secondesParRock",
    procMultAction: "rockFactory", procUnlocked: function(u) { return u.rockfact; },
    bloqueeKey: "rockFactoryBloquee",
    inputs: [{ res: "rocks", label: "Rocks", icon: "img/resources/Rock_Final.png", baseQuantity: 10, costAdjusted: true }]
  }
];

const WORK_FAMILIES = {
  wood: { label: "Wood", gatheringScope: "Wood resources", gatheringManager: "wood", processingScope: "Sawmill and planks", processingManager: "sawmill" },
  food: { label: "Food", gatheringScope: "Raw food", gatheringManager: "food", processingScope: "Catchen and prepared food", processingManager: "catchen" },
  rock: { label: "Rocks", gatheringScope: "Raw stone", gatheringManager: "rock", processingScope: "Pawsonry and bricks", processingManager: "pawsonry" }
};

let workStructureInitialisee = false;

function initialiserWorkStructure() {
  if (workStructureInitialisee) return;
  synchroniserSlotsRecettesAvecPerks();
  const section = domParId("section-work-pairs");
  if (!section) return;
  const familyHtml = Object.keys(WORK_FAMILIES).map(function(familyId) {
    const family = WORK_FAMILIES[familyId];
    const slots = etat.workRecipeSlots[familyId] || [];
    const slotsHtml = slots.map(function(slot, slotIdx) {
      return '<article class="work-recipe-slot" id="recipe-slot-' + familyId + '-' + slotIdx + '"></article>';
    }).join("");
    return '<div id="famille-' + familyId + '" class="work-recipe-family">'
      + '<header class="work-recipe-family-header">'
      +   '<div><span class="pair-family-kicker">Production family</span><h2>' + family.label + '</h2></div>'
      +   '<section id="work-managers-' + familyId + '" class="work-recipe-managers" aria-label="' + family.label + ' managers" style="display:none">'
      +     '<div class="work-recipe-manager-card"><div class="pair-manager-copy"><span class="pair-manager-role">Gathering Manager</span><span class="pair-manager-scope">Basic resources to gather</span></div><div id="manager-slot-' + family.gatheringManager + '" class="manager-slot-conteneur"></div></div>'
      +     '<div class="work-recipe-manager-card"><div class="pair-manager-copy"><span class="pair-manager-role">Processing Manager</span><span class="pair-manager-scope">Finished ' + family.label.toLowerCase() + ' resources</span></div><div id="manager-slot-' + family.processingManager + '" class="manager-slot-conteneur"></div></div>'
      +   '</section>'
      + '</header>'
      + '<div class="work-recipe-slots" id="work-recipe-slots-' + familyId + '">'
      +   slotsHtml
      + '</div>'
      + '</div>';
  }).join("");
  section.innerHTML = '<div id="work-summary-all" class="work-summary-all" aria-label="Current production summary"></div>' + familyHtml;
  workStructureInitialisee = true;
}

function paireRecette(recipeId) {
  return RESOURCE_PAIRS.find(function(pair) { return pair.recipeId === recipeId; }) || null;
}

function slotRecette(familyId, slotIdx) {
  const slots = etat.workRecipeSlots && etat.workRecipeSlots[familyId];
  return slots && slots[slotIdx] ? slots[slotIdx] : null;
}

function recettesDisponiblesFamille(familyId, u) {
  return RESOURCE_PAIRS.filter(function(pair) {
    return pair.family === familyId && pair.rawUnlocked(u);
  }).sort(function(a, b) { return b.tier - a.tier; });
}

function libelleNombreDecimal(value, digits) {
  const number = Math.max(0, Number(value) || 0);
  if (Math.abs(number - Math.round(number)) < 0.005) return String(Math.round(number));
  return number.toFixed(digits === undefined ? 1 : digits);
}

function progressionsSlotRecette(slot, pair) {
  const empty = { gathering: 0, processing: 0, phase: 0, overall: 0 };
  if (!slot || !pair || slot.kittyIndex === null) return empty;
  const gathered = Math.max(0, Number(slot.gatheredInputs && slot.gatheredInputs[pair.rawRes]) || 0);
  const target = quantiteInputEffective(pair, pair.inputs[0]);
  const gathering = slot.phase === "processing"
    ? 1
    : (target > 0 ? Math.max(0, Math.min(1, gathered / target)) : 0);
  const processing = slot.phase === "processing"
    ? Math.max(0, Math.min(1, Number(slot.phaseProgress) || 0))
    : 0;
  return {
    gathering: gathering,
    processing: processing,
    phase: slot.phase === "processing" ? processing : gathering,
    overall: (gathering + processing) / 2
  };
}

function workSummaryManagerHtml(label, managerFamily) {
  const kitty = managerKittyForFamily(managerFamily);
  const managerValue = kitty
    ? '<strong>' + echapperAttributHtml(kitty.nom) + '</strong>'
    : '<strong class="work-summary-manager-empty">None</strong>';
  return '<span class="work-summary-manager"><small>' + label + '</small>' + managerValue + '</span>';
}

function renduWorkSummary(unlockedFamilies) {
  const summary = domParId("work-summary-all");
  if (!summary) return;
  const stateParts = [etat.jobCenterConstruit ? 1 : 0];
  const cards = unlockedFamilies.map(function(familyId) {
    const family = WORK_FAMILIES[familyId];
    const slots = etat.workRecipeSlots[familyId] || [];
    const availableSlotCount = slots.length;
    const active = [];
    const waiting = [];
    // Include the capacity in the render key so unlocking an additional empty
    // slot immediately refreshes the summary counter.
    stateParts.push(familyId + "-slots", availableSlotCount);

    slots.forEach(function(slot, slotIdx) {
      const pair = paireRecette(slot.recipeId);
      if (!pair) return;
      const kitty = slot.kittyIndex === null ? null : etat.kittiesData[slot.kittyIndex];
      if (!kitty) {
        waiting.push({ pair: pair, slotIdx: slotIdx });
        stateParts.push(familyId, slotIdx, pair.recipeId, "waiting");
        return;
      }
      const progress = progressionsSlotRecette(slot, pair).overall;
      const ratePerMinute = tauxProductionSlotRecette(pair, slot) * 60;
      active.push({ pair: pair, slotIdx: slotIdx, kitty: kitty, progress: progress, ratePerMinute: ratePerMinute });
      stateParts.push(familyId, slotIdx, pair.recipeId, slot.kittyIndex, kitty.niveau,
        Math.floor(progress * 100), ratePerMinute.toFixed(3));
    });

    let managerHtml = "";
    if (etat.jobCenterConstruit) {
      const gatherManager = managerKittyForFamily(family.gatheringManager);
      const processManager = managerKittyForFamily(family.processingManager);
      stateParts.push(familyId + "-managers",
        gatherManager ? gatherManager.nom + ":" + managerSpeedMultiplier(gatherManager, family.gatheringManager).toFixed(2) : "none",
        processManager ? processManager.nom + ":" + managerSpeedMultiplier(processManager, family.processingManager).toFixed(2) : "none");
      managerHtml = '<div class="work-summary-managers">'
        + workSummaryManagerHtml("Gathering Manager", family.gatheringManager)
        + workSummaryManagerHtml("Processing Manager", family.processingManager)
        + '</div>';
    }

    const rowsHtml = active.map(function(item) {
      const progressPct = Math.round(item.progress * 100);
      const rateLabel = libelleNombreDecimal(item.ratePerMinute, 2) + "/min";
      return '<button type="button" class="work-summary-row" onclick="ouvrirSlotDepuisResume(\'' + familyId + '\',' + item.slotIdx + ')" aria-label="Open ' + echapperAttributHtml(item.pair.procLabel) + ' produced by ' + echapperAttributHtml(item.kitty.nom) + ', ' + rateLabel + '">'
        + '<span class="work-summary-recipe"><img src="' + item.pair.procIcon + '" alt=""><strong>' + item.pair.procLabel + '</strong></span>'
        + '<span class="work-summary-worker">'
        +   '<span class="work-summary-ring" style="--prog:' + item.progress + '" role="progressbar" aria-label="Full recipe cycle progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progressPct + '"><span class="work-summary-face">' + kittyIconHtml(item.kitty) + '</span></span>'
        +   '<span>' + echapperAttributHtml(item.kitty.nom) + ' (lvl ' + item.kitty.niveau + ')</span>'
        + '</span>'
        + '<strong class="work-summary-rate">' + rateLabel + '</strong>'
        + '<span class="work-summary-open" aria-hidden="true">›</span>'
        + '</button>';
    }).join("");

    const emptyHtml = active.length === 0
      ? '<div class="work-summary-empty">No active production</div>'
      : "";
    const goToFamilyHtml = active.length === 0
      ? '<button type="button" class="work-summary-go" onclick="ouvrirFamilleDepuisResume(\'' + familyId + '\')" aria-label="Go to ' + echapperAttributHtml(family.label) + ' production">Go to ' + echapperAttributHtml(family.label) + '</button>'
      : "";
    const waitingHtml = waiting.length > 0
      ? '<button type="button" class="work-summary-waiting" onclick="ouvrirRecetteEnAttenteDepuisResume(\'' + familyId + '\',' + waiting[0].slotIdx + ')">' + waiting.length + ' recipe' + (waiting.length > 1 ? 's' : '') + ' waiting for a Cat</button>'
      : "";

    return '<section class="work-summary-family work-summary-family-' + familyId + '">'
      + '<header class="work-summary-header"><div><span>Production family</span><h2>' + family.label + '</h2></div><strong' + (active.length ? '' : ' class="is-empty"') + '>' + active.length + '/' + availableSlotCount + ' ACTIVE</strong></header>'
      + managerHtml
      + '<div class="work-summary-list">' + rowsHtml + emptyHtml + goToFamilyHtml + waitingHtml + '</div>'
      + '</section>';
  }).join("");

  const stateKey = stateParts.join("|");
  if (summary.dataset.summaryState === stateKey) return;
  summary.dataset.summaryState = stateKey;
  summary.innerHTML = cards;
}

function ouvrirFamilleDepuisResume(familyId) {
  filtrerWork(familyId);
}

function ouvrirSlotDepuisResume(familyId, slotIdx) {
  filtrerWork(familyId);
  setTimeout(function() {
    const slot = domParId("recipe-slot-" + familyId + "-" + slotIdx);
    if (!slot) return;
    slot.scrollIntoView({ behavior: "smooth", block: "center" });
    slot.classList.remove("objectif-cible-highlight");
    void slot.offsetWidth;
    slot.classList.add("objectif-cible-highlight");
    const focusTarget = slot.querySelector(".work-recipe-selected");
    if (focusTarget) focusTarget.focus({ preventScroll: true });
    setTimeout(function() { slot.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function ouvrirRecetteEnAttenteDepuisResume(familyId, slotIdx) {
  filtrerWork(familyId);
  setTimeout(function() { ouvrirModalWorkerRecette(familyId, slotIdx); }, 80);
}

function renduSlotRecette(familyId, slotIdx) {
  const el = domParId("recipe-slot-" + familyId + "-" + slotIdx);
  const slot = slotRecette(familyId, slotIdx);
  if (!el || !slot) return;
  const pair = paireRecette(slot.recipeId);
  const kitty = slot.kittyIndex === null ? null : etat.kittiesData[slot.kittyIndex];
  const progress = progressionsSlotRecette(slot, pair);
  const stateKey = [slot.recipeId || "-", slot.kittyIndex, slot.phase,
    Math.floor(progress.gathering * 100), Math.floor(progress.processing * 100), Math.floor(progress.overall * 100),
    pair ? Math.floor((Number(slot.gatheredInputs[pair.rawRes]) || 0) * 10) : 0,
    kitty ? kitty.niveau : -1, etat.jobCenterConstruit ? 1 : 0,
    pair ? Math.floor((Number(etat[pair.procRes]) || 0) * 100) : 0,
    pair ? multiplicateurCoutFamille(pair.procMultAction) : 1,
    pair ? multiplicateurFamille(pair.rawAction) : 1,
    pair ? multiplicateurFamille(pair.procMultAction) : 1,
    workBoostMult(), gangLeaderBonus()].join("|");
  if (el.dataset.recipeState === stateKey) return;
  el.dataset.recipeState = stateKey;

  if (!pair) {
    el.innerHTML = '<div class="work-recipe-slot-top work-recipe-slot-top-empty"><span class="work-recipe-slot-number">RECIPE SLOT ' + (slotIdx + 1) + '</span></div>'
      + '<button class="work-recipe-choose-empty" onclick="ouvrirModalRecette(\'' + familyId + '\',' + slotIdx + ')">'
      + '<span class="work-recipe-choose-plus">+</span><strong>Choose a recipe</strong><small>Then assign a Cat to produce it</small></button>';
    if (_workPopupContext && _workPopupContext.familyId === familyId && _workPopupContext.slotIdx === slotIdx) hideResPopup();
    return;
  }

  const input = pair.inputs[0];
  const target = quantiteInputEffective(pair, input);
  const gathered = Math.min(target, Math.max(0, Number(slot.gatheredInputs[pair.rawRes]) || 0));
  const gatherRate = kitty ? tauxGatheringRecette(pair, kitty) : 0;
  const gatherDuration = kitty ? dureeGatheringRecette(pair, kitty) : Infinity;
  const gatherUnitDuration = kitty && gatherRate > 0 ? 1 / gatherRate : Infinity;
  const outputPerCycle = kitty ? productionProcBonus(kitty) : 1;
  const outputRate = kitty ? tauxProductionSlotRecette(pair, slot) : 0;
  const processingDuration = kitty ? dureeProcessingRecette(pair, kitty) : Infinity;
  const catHtml = kitty
    ? '<div class="work-recipe-cat-ring" style="--prog:' + progress.overall + '" role="progressbar" aria-label="Full recipe progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(progress.overall * 100) + '"><div class="work-recipe-cat-face"' + attributsActivationClavier("Change " + kitty.nom + " assigned to this recipe") + ' onclick="ouvrirModalWorkerRecette(\'' + familyId + '\',' + slotIdx + ')">' + kittyIconHtml(kitty) + '</div>'
      + '<button class="work-recipe-cat-remove" aria-label="Remove ' + echapperAttributHtml(kitty.nom) + ' from this recipe" onclick="retirerWorkerRecette(\'' + familyId + '\',' + slotIdx + ');event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button></div>'
      + '<strong class="work-recipe-cat-name">' + echapperAttributHtml(kitty.nom) + '</strong>'
      + '<span class="work-recipe-cat-rate">' + libelleNombreDecimal(outputRate * 60, 2) + '/min</span>'
    : '<button class="work-recipe-cat-empty" onclick="ouvrirModalWorkerRecette(\'' + familyId + '\',' + slotIdx + ')" aria-label="Assign a Cat to ' + echapperAttributHtml(pair.procLabel) + '">+</button><strong class="work-recipe-cat-name">Assign a Cat</strong>';

  const gatherTrigger = attributsActivationClavier("Show production details for " + pair.rawLabel)
    + ' data-work-family="' + familyId + '" data-work-slot="' + slotIdx + '" data-work-phase="gather" aria-controls="inv-res-popup" aria-expanded="false" onclick="toggleWorkResourcePopup(this,event)"';
  const produceTrigger = attributsActivationClavier("Show production details for " + pair.procLabel)
    + ' data-work-family="' + familyId + '" data-work-slot="' + slotIdx + '" data-work-phase="process" aria-controls="inv-res-popup" aria-expanded="false" onclick="toggleWorkResourcePopup(this,event)"';

  el.innerHTML = '<div class="work-recipe-slot-top">'
    + '<span class="work-recipe-slot-number">RECIPE SLOT ' + (slotIdx + 1) + '</span>'
    + '<button type="button" class="work-recipe-selected" aria-label="Change recipe in slot ' + (slotIdx + 1) + ', currently ' + echapperAttributHtml(pair.procLabel) + '" onclick="ouvrirModalRecette(\'' + familyId + '\',' + slotIdx + ')"><img src="' + pair.procIcon + '" alt=""><span><small>RECIPE</small><strong>' + pair.procLabel + '</strong></span><span class="work-recipe-change">Change</span></button>'
    + '</div>'
    + '<div class="work-recipe-flow">'
    + '<section class="work-recipe-resource work-recipe-resource-input"' + gatherTrigger + ' style="--fill:' + Math.round(progress.gathering * 100) + '%"><span class="work-recipe-node-kicker">GATHERING</span><img src="' + pair.rawIcon + '" alt=""><strong>' + pair.rawLabel + '</strong><span>' + libelleNombreDecimal(gathered, 1) + ' / ' + libelleNombreDecimal(target, 1) + '</span><small>' + (kitty ? formaterSecondesBrutes(gatherDuration) + ' (1 every ' + formaterSecondesBrutes(gatherUnitDuration) + ')' : 'Input') + '</small></section>'
    + '<section class="work-recipe-cat">' + catHtml + '</section>'
    + '<section class="work-recipe-resource work-recipe-resource-output"' + produceTrigger + ' style="--fill:' + Math.round(progress.processing * 100) + '%"><span class="work-recipe-node-kicker">PROCESSING</span><img src="' + pair.procIcon + '" alt=""><strong>' + pair.procLabel + '</strong><span class="work-recipe-output-progress">' + Math.round(progress.processing * 100) + '%</span>' + (kitty ? '<small>' + formaterSecondesBrutes(processingDuration) + ' for ' + libelleNombreDecimal(outputPerCycle, 2) + ' · Stock ' + formaterNombre(etat[pair.procRes]) + '</small>' : '<small>Output</small>') + '</section>'
    + '</div>';
  if (_workPopupContext && _workPopupContext.familyId === familyId && _workPopupContext.slotIdx === slotIdx) {
    const trigger = el.querySelector('[data-work-phase="' + _workPopupContext.phase + '"]');
    if (trigger) showWorkResourcePopup(trigger);
    else hideResPopup();
  }
}

function actualiserIndicateursExploration() {
  const indicateur = document.getElementById("exploration-tab-alerts");
  if (!indicateur) return;
  const campaignReady = Object.values(etat.resultatsCampaigns).some(function(resultat) { return resultat.success; });
  const revealReady = Object.values(etat.resultatsExplorationZones).some(function(resultat) { return resultat.success; });
  const emojis = (revealReady ? "🔍" : "") + (campaignReady ? "🎁" : "");
  const labels = [];
  if (revealReady) labels.push("zone ready to reveal");
  if (campaignReady) labels.push("campaign reward ready");
  ecrireTexte(indicateur, emojis);
  ecrireStyle(indicateur, "display", emojis ? "inline-flex" : "none");
  ecrirePropriete(indicateur, "aria-label", labels.join(", "));
  basculerClasse(document.getElementById("onglet-explorations"), "onglet-alerte", !!emojis);
}

function quantiteInputEffective(pair, input) {
  const baseQuantity = Number.isFinite(input.baseQuantity)
    ? input.baseQuantity
    : pair.procCfg[pair.procSecUnite] / pair.procCfg[pair.procSecRaw];
  const costMultiplier = input.costAdjusted === false ? 1 : multiplicateurCoutFamille(pair.procMultAction);
  return baseQuantity * costMultiplier;
}

function tauxGatheringRecette(pair, kitty) {
  if (!pair || !kitty) return 0;
  return multiplicateurFamille(pair.rawAction)
    * multiplicateurProductionFamille(pair.rawAction)
    * Math.pow(1.1, kitty.niveau)
    * gangLeaderBonus()
    * workBoostMult()
    / pair.rawCfg.secondesParUnite;
}

function dureeGatheringRecette(pair, kitty) {
  if (!pair || !kitty) return Infinity;
  const rawRate = tauxGatheringRecette(pair, kitty);
  const input = pair.inputs[0];
  const target = quantiteInputEffective(pair, input);
  return rawRate > 0 && target > 0 ? target / rawRate : Infinity;
}

function dureeProcessingRecette(pair, kitty) {
  if (!pair || !kitty) return Infinity;
  const processingSpeed = multiplicateurFamille(pair.procMultAction) * gangLeaderBonus() * workBoostMult();
  const processingSeconds = Number(pair.procCfg[pair.procSecUnite]);
  return processingSpeed > 0 && processingSeconds > 0 ? processingSeconds / processingSpeed : Infinity;
}

function dureeCycleRecette(pair, kitty) {
  if (!pair || !kitty) return Infinity;
  const gatheringDuration = dureeGatheringRecette(pair, kitty);
  const processingDuration = dureeProcessingRecette(pair, kitty);
  if (!Number.isFinite(gatheringDuration) || !Number.isFinite(processingDuration)) return Infinity;
  return gatheringDuration + processingDuration;
}

function tauxProductionSlotRecette(pair, slot) {
  if (!slot || slot.kittyIndex === null || slot.recipeId !== pair.recipeId) return 0;
  const kitty = etat.kittiesData[slot.kittyIndex];
  const cycleDuration = dureeCycleRecette(pair, kitty);
  return Number.isFinite(cycleDuration) && cycleDuration > 0 ? productionProcBonus(kitty) / cycleDuration : 0;
}

function tauxProductionBrute(action) {
  const pair = RESOURCE_PAIRS.find(function(candidate) { return candidate.rawAction === action; });
  if (!pair) return 0;
  return (etat.workRecipeSlots[pair.family] || []).reduce(function(total, slot) {
    if (slot.recipeId !== pair.recipeId || slot.kittyIndex === null) return total;
    return total + tauxGatheringRecette(pair, etat.kittiesData[slot.kittyIndex]);
  }, 0);
}

function tauxProductionTransformee(pair) {
  return (etat.workRecipeSlots[pair.family] || []).reduce(function(total, slot) {
    return total + tauxProductionSlotRecette(pair, slot);
  }, 0);
}

// Simple resources are private slot inputs, so only processed outputs expose a
// shared production rate.
function tauxProductionRessource(resourceKey, u) {
  let rate = 0;
  RESOURCE_PAIRS.forEach(function(pair) {
    if (pair.procRes === resourceKey && pair.rawUnlocked(u)) rate += tauxProductionTransformee(pair);
  });
  return rate;
}

function tauxConsommationRessource() { return 0; }

function tauxNetRessource(resourceKey, u) {
  return tauxProductionRessource(resourceKey, u) - tauxConsommationRessource(resourceKey, u);
}

function libelleTauxNetCourt(net) {
  const parMin = net * 60;
  if (Math.abs(parMin) < 0.005) return "0.00/m";
  return (parMin > 0 ? "+" : "") + parMin.toFixed(2) + "/m";
}

function sourceProductionRessource(resourceKey) {
  for (let i = 0; i < RESOURCE_PAIRS.length; i++) {
    const pair = RESOURCE_PAIRS[i];
    if (pair.rawRes === resourceKey) {
      return { family: pair.family, action: pair.rawAction, recipeId: pair.recipeId, targetId: "work-recipe-slots-" + pair.family, label: pair.rawLabel };
    }
    if (pair.procRes === resourceKey) {
      return { family: pair.family, action: pair.procAction, recipeId: pair.recipeId, targetId: "work-recipe-slots-" + pair.family, label: pair.procLabel };
    }
  }
  return null;
}

function mettreEnEvidenceRessourceWork(source) {
  if (!source) return;
  setTimeout(function() {
    const cible = domParId(source.targetId);
    if (!cible) return;
    cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function allerRessourceWork(resourceKey) {
  const source = sourceProductionRessource(resourceKey);
  if (!source) return;
  filtrerWork(source.family);
  mettreEnEvidenceRessourceWork(source);
}

function ouvrirAllocationRessource(resourceKey) {
  const source = sourceProductionRessource(resourceKey);
  if (!source) return;
  filtrerWork(source.family);
  const slots = etat.workRecipeSlots[source.family] || [];
  let slotIdx = slots.findIndex(function(slot) { return slot.recipeId === source.recipeId && slot.kittyIndex === null; });
  if (slotIdx < 0) slotIdx = slots.findIndex(function(slot) { return !slot.recipeId; });
  if (slotIdx < 0) { mettreEnEvidenceRessourceWork(source); return; }
  if (!slots[slotIdx].recipeId) slots[slotIdx].recipeId = source.recipeId;
  ouvrirModalWorkerRecette(source.family, slotIdx);
}

function renduWorkPairs(u) {
  if (synchroniserSlotsRecettesAvecPerks()) workStructureInitialisee = false;
  initialiserWorkStructure();

  // Each family button appears only when at least one gathering tier is unlocked.
  const setDisplay = function(id, show) { ecrireStyle(domParId(id), "display", show ? "" : "none"); };
  setDisplay("filtre-work-all", u.cathering);
  setDisplay("filtre-work-wood", u.cathering);
  setDisplay("filtre-work-food", u.grasscat);
  setDisplay("filtre-work-rock", u.pebblecat || u.rockcat);
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
      ecrireHTML(banner, "👑 <strong>" + gl.nom + "</strong> is leading the gang: ×" + mult.toFixed(2) + " work speed (" + etat.kittiesData.length + " cats · " + gl.nom + " Lvl " + gl.niveau + ")");
    } else {
      ecrireStyle(banner, "display", "none");
    }
  }

  const unlockedFamilies = ["wood"];
  if (u.grasscat) unlockedFamilies.push("food");
  if (u.pebblecat || u.rockcat) unlockedFamilies.push("rock");
  const availableFilters = ["all"].concat(unlockedFamilies);
  if (!availableFilters.includes(workFiltre)) workFiltre = "all";
  document.body.dataset.workFilter = workFiltre;
  ["all", "wood", "food", "rock"].forEach(function(familyId) {
    const button = domParId("filtre-work-" + familyId);
    if (!button) return;
    const active = familyId === workFiltre;
    basculerClasse(button, "btn-filtre-work-actif", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const summaryVisible = workFiltre === "all";
  ecrireStyle(domParId("btn-unaffect-all"), "display", summaryVisible ? "" : "none");
  ecrireStyle(domParId("work-summary-all"), "display", summaryVisible ? "grid" : "none");
  ["wood", "food", "rock"].forEach(function(familyId) {
    const familyEl = domParId("famille-" + familyId);
    const visible = familyId === workFiltre && unlockedFamilies.includes(familyId);
    const familyHeader = familyEl && familyEl.querySelector(".work-recipe-family-header");
    ecrireStyle(familyEl, "display", visible ? "grid" : "none");
    ecrireStyle(domParId("work-managers-" + familyId), "display", visible && etat.jobCenterConstruit ? "grid" : "none");
    basculerClasse(familyHeader, "work-recipe-family-header-no-manager", !visible || !etat.jobCenterConstruit);
  });

  unlockedFamilies.forEach(function(familyId) {
    const available = recettesDisponiblesFamille(familyId, u);
    (etat.workRecipeSlots[familyId] || []).forEach(function(slot) {
      if (slot.recipeId && !available.some(function(pair) { return pair.recipeId === slot.recipeId; })) {
        reinitialiserProgressionRecette(slot, true);
      }
    });
  });

  if (summaryVisible) {
    renduWorkSummary(unlockedFamilies);
  } else {
    const currentFamily = WORK_FAMILIES[workFiltre];
    if (currentFamily && etat.jobCenterConstruit) {
      renderManagerSlot(currentFamily.gatheringManager);
      renderManagerSlot(currentFamily.processingManager);
    }
    (etat.workRecipeSlots[workFiltre] || []).forEach(function(slot, slotIdx) {
      renduSlotRecette(workFiltre, slotIdx);
    });
  }

  ["wood", "food", "rock"].forEach(function(familyId) {
    const badge = domParId("work-warning-" + familyId);
    if (badge) { ecrireTexte(badge, ""); badge.hidden = true; }
    const button = domParId("filtre-work-" + familyId);
    if (button) button.setAttribute("aria-label", WORK_FAMILIES[familyId].label + " recipes");
  });
  const allButton = domParId("filtre-work-all");
  if (allButton) allButton.setAttribute("aria-label", "All active production");
}

function fermerWorkDiscoveryHint() {
  localStorage.setItem("workDetailsHintSeen", "1");
  const indiceEl = document.getElementById("work-discovery-hint");
  if (indiceEl) ecrireStyle(indiceEl, "display", "none");
}

// Tapping or keyboard-activating a resource icon opens its detailed tooltip.
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
    fermerWorkDiscoveryHint();
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
  const autoBuildDisponible = spherePerkLearned('builder-auto');
  const autoBuildToggle = domParId("builder-auto-toggle");
  ecrireStyle(autoBuildToggle, "display", autoBuildDisponible ? "flex" : "none");
  const autoBuildInput = domParId("toggle-auto-build-wood-houses");
  if (autoBuildInput) autoBuildInput.checked = !!etat.autoBuildWoodHouses;
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
      const tcOverview = domParId("tc-overview");
      const tcEntry = domParId("tc-entry");
      const tcIface = domParId("tc-interface");
      const facilities = domParId("contenu-facilities");
      if (!etat.trainingCenterConstruit) tcTrainingOuvert = false;
      if (facilities) facilities.classList.toggle("training-center-open", !!(etat.trainingCenterConstruit && tcTrainingOuvert));
      ecrireStyle(tcOverview, "display", tcTrainingOuvert && etat.trainingCenterConstruit ? "none" : "block");
      ecrireStyle(tcEntry, "display", etat.trainingCenterConstruit && !tcTrainingOuvert ? "block" : "none");
      ecrireStyle(tcIface, "display", etat.trainingCenterConstruit && tcTrainingOuvert ? "block" : "none");
      if (etat.trainingCenterConstruit && tcTrainingOuvert) renduTrainingCenter();
    }
  }
}

function ouvrirTrainingCenter() {
  if (!etat.trainingCenterConstruit) return;
  tcTrainingOuvert = true;
  _tcKey = null;
  rendu();
  requestAnimationFrame(function() {
    const section = document.getElementById("section-training-center");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function fermerTrainingCenter() {
  tcTrainingOuvert = false;
  _tcKey = null;
  rendu();
}

// ── 9f-ii. Training Center specialization
function trainingCenterKitties() {
  const metierOrder = Object.keys(METIERS);
  const roster = etat.kittiesData.reduce(function(acc, k, i) {
    if (k && k.metier && METIERS[k.metier]) acc.push({ k: k, i: i });
    return acc;
  }, []);
  roster.sort(function(a, b) {
    const aBernardo = a.k.nom === "Bernardo";
    const bBernardo = b.k.nom === "Bernardo";
    if (aBernardo !== bBernardo) return aBernardo ? -1 : 1;
    const aOrder = metierOrder.indexOf(a.k.metier);
    const bOrder = metierOrder.indexOf(b.k.metier);
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.i - b.i;
  });
  return roster;
}

function renduTrainingCenter() {
  const el = document.getElementById("tc-interface");
  if (!el || !etat.trainingCenterConstruit || !tcTrainingOuvert) return;

  const roster = trainingCenterKitties();
  const rosterKey = roster.map(function(entry) {
    return entry.i + ":" + entry.k.metier + ":" + (entry.k.jobNiveau || 0);
  }).join(",");
  const selectedExists = roster.some(function(entry) { return entry.i === tcSpecKittySelectionne; });
  if (!selectedExists) tcSpecKittySelectionne = roster.length > 0 ? roster[0].i : null;
  const k = tcSpecKittySelectionne !== null ? etat.kittiesData[tcSpecKittySelectionne] : null;
  const selectedGrid = k && SPHERE_GRIDS[k.metier];
  const sphereKey = selectedGrid ? selectedGrid.spheres.map(function(s) {
    return s.id + ":" + ((etat.spherePerks && etat.spherePerks[s.id]) || s.etat);
  }).join(",") : "";
  const key = rosterKey + '|' + (tcSpecKittySelectionne ?? '') + '|' + (k ? k.metier + '|' + k.jobNiveau : '') + '|' + sphereKey;
  if (key === _tcKey) return;
  _tcKey = key;

  let html = '<div class="tc-workspace">';
  html += '<div class="tc-workspace-header">';
  html += '<button type="button" class="tc-back-btn" onclick="fermerTrainingCenter()">← Back to Facilities</button>';
  html += '<div><div class="tc-workspace-title">Job Specialization</div><div class="tc-workspace-desc">Select a cat to review its specialization sphere.</div></div>';
  html += '</div>';
  html += '<div class="tc-workspace-grid">';
  html += '<aside class="tc-roster" aria-label="Cats with jobs">';
  html += '<div class="tc-roster-title">Cats with jobs</div>';
  html += '<div class="tc-roster-list" role="group" aria-label="Cats with jobs">';
  if (roster.length === 0) {
    html += '<p class="tc-empty">Train a cat in the Job Center first.</p>';
  } else {
    roster.forEach(function(entry) {
      const kitty = entry.k;
      const metier = METIERS[kitty.metier];
      const level = jobLevelInfo(kitty.metier);
      const active = entry.i === tcSpecKittySelectionne;
      html += '<button type="button" class="tc-cat-card' + (active ? ' tc-cat-card-active' : '') + '" aria-pressed="' + (active ? 'true' : 'false') + '" onclick="selectionnerTrainingCat(' + entry.i + ')">';
      html += '<span class="tc-cat-icon">' + kittyIconHtml(kitty) + '</span>';
      html += '<span class="tc-cat-info"><span class="tc-cat-name">' + echapperAttributHtml(kitty.nom) + '</span><span class="tc-cat-job">' + (metier ? metier.emoji + ' ' + metier.nom : kitty.metier) + '</span></span>';
      html += '<span class="tc-cat-level">Lv. ' + level.cur + '/' + level.max + '</span>';
      html += '</button>';
    });
  }
  html += '</div></aside>';
  html += '<section class="tc-sphere-column" aria-label="Selected cat specialization">';
  if (k) {
    const metier = METIERS[k.metier];
    const level = jobLevelInfo(k.metier);
    html += '<div class="tc-selected-cat">';
    html += '<div class="tc-selected-icon">' + kittyIconHtml(k) + '</div>';
    html += '<div><div class="tc-selected-name">' + echapperAttributHtml(k.nom) + '</div><div class="tc-selected-job">' + (metier ? metier.emoji + ' ' + metier.nom : k.metier) + ' · Specialization Lv. ' + level.cur + ' / ' + level.max + '</div></div>';
    html += '</div>';
    if (selectedGrid) html += '<div id="sphere-grid-container" class="sphere-grid-wrapper"></div>';
    else html += '<p class="tc-empty">This job does not have a specialization sphere yet.</p>';
  } else {
    html += '<div class="tc-empty tc-empty-large">Select a cat to view its sphere.</div>';
  }
  html += '</section></div></div>';
  el.innerHTML = html;
  if (k && selectedGrid) renduSphereGrid(k.metier);
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
        + w.toUpperCase() + '</text>'
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
  if (nomEl)  nomEl.textContent = sphere ? String(sphere.nom).toUpperCase() : '';
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
  if (sphere && /-slot$/.test(sphereId)) {
    if (synchroniserSlotsRecettesAvecPerks()) workStructureInitialisee = false;
  }
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
let experienceHelpOuvert = false;

function fermerExperienceHelp() {
  experienceHelpOuvert = false;
  const popup = document.getElementById("experience-bonus-help");
  const button = document.getElementById("experience-bonus-help-button");
  if (popup) {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  }
  if (button) button.setAttribute("aria-expanded", "false");
}

function toggleExperienceHelp(event) {
  if (event) event.stopPropagation();
  const popup = document.getElementById("experience-bonus-help");
  const button = document.getElementById("experience-bonus-help-button");
  if (!popup || !button) return;
  experienceHelpOuvert = !experienceHelpOuvert;
  popup.style.display = experienceHelpOuvert ? "block" : "none";
  popup.setAttribute("aria-hidden", experienceHelpOuvert ? "false" : "true");
  button.setAttribute("aria-expanded", experienceHelpOuvert ? "true" : "false");
}

document.addEventListener("click", function(event) {
  if (!experienceHelpOuvert) return;
  const wrapper = document.getElementById("experience-help-wrap");
  if (wrapper && !wrapper.contains(event.target)) fermerExperienceHelp();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && experienceHelpOuvert) fermerExperienceHelp();
});

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

function fermerFoodDistributionModal() {
  fermerDialogueModal("food-distribution-modal");
}

function afficherFoodDistributionRecap(recap) {
  const summary = document.getElementById("food-distribution-summary");
  if (!summary) return;
  const recipients = recap.filter(function(entry) { return entry.foodUnits > 0; });
  if (!recipients.length) return;

  const totalFoodUnits = recipients.reduce(function(total, entry) { return total + entry.foodUnits; }, 0);
  const totalXp = recipients.reduce(function(total, entry) { return total + entry.xp; }, 0);
  const totalLevelUps = recipients.reduce(function(total, entry) { return total + entry.levelUps; }, 0);
  const catsFedLabel = recipients.length + (recipients.length === 1 ? " Cat fed" : " Cats fed");
  const levelLabel = totalLevelUps + (totalLevelUps === 1 ? " level gained" : " levels gained");
  summary.innerHTML = '<div class="food-distribution-stats">' + totalXp + ' XP distributed · ' + levelLabel + ' · ' + catsFedLabel + '</div>'
    + '<div class="food-distribution-summary">'
    + recipients.map(function(entry) {
      const foodLabel = entry.foodUnits + (entry.foodUnits === 1 ? " food item" : " food items");
      const levelLabel = entry.niveauAvant + " => " + entry.kitty.niveau + " (+" + entry.levelUps + (entry.levelUps === 1 ? " level" : " levels") + ")";
      return '<div class="food-distribution-row">'
        + '<span class="food-distribution-portrait">' + kittyIconHtml(entry.kitty) + '</span>'
        + '<span><strong class="food-distribution-name">' + echapperAttributHtml(entry.kitty.nom) + '</strong>'
        + '<span class="food-distribution-details"><span>' + foodLabel + '</span><span>+' + entry.xp + ' XP</span></span></span>'
        + '<strong class="food-distribution-level' + (entry.levelUps ? "" : " none") + '">' + levelLabel + '</strong>'
        + '</div>';
    }).join("")
    + '<div class="food-distribution-total">Total: ' + totalFoodUnits + (totalFoodUnits === 1 ? " food item" : " food items")
    + ' · +' + totalXp + ' XP · +' + totalLevelUps + (totalLevelUps === 1 ? " level" : " levels") + '</div>'
    + '</div>';

  ouvrirDialogueModal("food-distribution-modal", {
    dismissible: true,
    fermer: fermerFoodDistributionModal,
    focusSelector: ".food-distribution-continue",
    returnFocusSelector: "#gang-tools .gang-tool-btn"
  });
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
  var distributionRecap = etat.kittiesData.map(function(k) {
    return { kitty: k, niveauAvant: k.niveau, foodUnits: 0, xp: 0, levelUps: 0 };
  });
  function recapPour(k) {
    var index = etat.kittiesData.indexOf(k);
    return index >= 0 ? distributionRecap[index] : null;
  }

  // Consume at most `cible` XP using floor division per food type (never overshoots).
  // If floor division yields 0 units for every type but stock exists and forceSingle is true,
  // consume exactly 1 unit of the smallest available food (handles "need 1 XP, only have 15-XP items").
  function consommerXp(cible, forceSingle, recap) {
    var consomme = 0;
    foods.forEach(function(f) {
      var stock = etat[f] || 0;
      if (!stock) return;
      var reste  = cible - consomme;
      var units  = Math.min(Math.floor(reste / FOOD_XP[f]), stock);
      etat[f]   -= units;
      consomme  += units * FOOD_XP[f];
      if (recap) recap.foodUnits += units;
    });
    // If nothing was consumed but forced (e.g. needed=1, smallest unit=15), consume 1 of the smallest
    if (consomme === 0 && forceSingle) {
      for (var fi = 0; fi < foods.length; fi++) {
        if ((etat[foods[fi]] || 0) > 0) {
          etat[foods[fi]] -= 1;
          consomme = FOOD_XP[foods[fi]];
          if (recap) recap.foodUnits += 1;
          break;
        }
      }
    }
    return consomme;
  }

  function donnerXp(k, xp, recap) {
    k.xp += xp;
    if (recap) recap.xp += xp;
    while (k.xp >= xpPourNiveau(k.niveau)) {
      k.xp -= xpPourNiveau(k.niveau);
      k.niveau++;
      totalLevelUps++;
      if (recap) recap.levelUps++;
      ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
    }
  }

  if (mode === 'egal') {
    var xpParChat = Math.floor(xpBudget / nbChats);
    if (!xpParChat) { afficherNotification("Not enough XP to distribute evenly."); return; }
    // floor division: each cat gets at most xpParChat XP, no overshoot
    etat.kittiesData.forEach(function(k) {
      var recap = recapPour(k);
      donnerXp(k, consommerXp(xpParChat, false, recap), recap);
    });

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
      var recap = recapPour(best);
      var gained = consommerXp(needed, true, recap);
      if (gained === 0) break; // no food left at all
      budget -= gained;
      donnerXp(best, gained, recap);
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
  afficherFoodDistributionRecap(distributionRecap);
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
    liste.innerHTML = etatVideHtml("Your gang is waiting", "Catch your first cat using the button above.");
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
    "<div class=\"detail-nom\">" + k.nom + "</div>";

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
    const autoLevelBtn = "<button class='btn-xp-auto'" + (autoBtnDisabled ? " disabled" : "") + " onclick='nourrirAutoNiveau(" + kittySelectionnee + ")'>Auto-feed to next level (<span class='xp-gain'>" + xpManquant + " XP needed</span>)</button>";
    // Keep these derived values aligned with the level multipliers used by
    // Gathering, Processing and manager speed calculations below.
    const gatherLevelPercent = Math.round((Math.pow(1.1, 1) - 1) * 100);
    const processLevelPercent = Math.round((Math.pow(1.05, 1) - 1) * 100);
    const managerLevelPercent = Math.round((jobLevelMultiplier({ niveau: 1 }) - 1) * 100);
    const experienceHelp =
      "<span class='detail-section-titre-label'>Experience</span>" +
      "<span id='experience-help-wrap' class='detail-help-wrap'>" +
      "<button type='button' id='experience-bonus-help-button' class='detail-help-btn' aria-label='Explain experience bonuses' aria-expanded='" + (experienceHelpOuvert ? "true" : "false") + "' aria-controls='experience-bonus-help' onclick='toggleExperienceHelp(event)'>?</button>" +
      "<span id='experience-bonus-help' class='detail-help-popover' role='note' aria-hidden='" + (experienceHelpOuvert ? "false" : "true") + "' style='display:" + (experienceHelpOuvert ? "block" : "none") + "'>" +
      "<strong>Each additional level increases these bonuses:</strong>" +
      "<span>Gather Production Bonus by " + gatherLevelPercent + "%</span>" +
      "<span>Process Production Bonus by " + processLevelPercent + "%</span>" +
      "<span>Exploration Power by 1</span>" +
      "<span>(If applicable) Manager Speed Bonus by " + managerLevelPercent + "%</span>" +
      "</span></span>";
    const managerSpeedBonusLine = k.metier
      ? "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + managerSpeedMultiplier(k, METIERS[k.metier] ? METIERS[k.metier].famille : null).toFixed(2) + "</span> Manager Speed Bonus</span>"
      : "";
    const levelBonuses = k.niveau > 0
      ? "<div class='xp-bonus-actifs'>" +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + Math.pow(1.1, k.niveau).toFixed(2) + "</span> Gather Production Bonus</span>" +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + Math.pow(1.05, k.niveau).toFixed(2) + "</span> Process Production Bonus</span>" +
        managerSpeedBonusLine +
        "<span class='xp-bonus-ligne'><span class='bonus-var'>+" + k.niveau + "</span> Exploration Power</span>" +
        "</div>"
      : "";
    droite.innerHTML +=
      "<div class='detail-section' id='detail-experience'>" +
      "<div class='detail-section-titre detail-section-titre-with-help'>" + experienceHelp + "</div>" +
      "<div class='detail-level-row'><span class='detail-level-num'>Level " + k.niveau + "</span><span class='detail-xp-counter'>" + k.xp + " / " + xpNext + " XP</span></div>" +
      "<div class='conteneur-barre'><div class='barre barre-verte' style='width:" + xpPct + "%'></div></div>" +
      levelBonuses +
      autoLevelBtn +
      (feedBtns ? "<div class='xp-aliments'>" + feedBtns + "</div>" : "<div class='xp-aliments-vide'>No food available.</div>") +
      "</div>";
  }

  // Job section — shown under the kitty identity once the Job Center is built.
  // Tier and acquisition date stay hidden here until their future dedicated UI.
  if (etat.jobCenterDebloque) {
    hasContent = true;
    if (!k.metier) {
      gauche.innerHTML += "<div class='detail-stray-cat kitty-vagabond'>STRAY CAT</div>";
    } else {
      const jobName = METIERS[k.metier] ? METIERS[k.metier].nom : k.metier;
      const jobBonus = k.metier ? (
        k.metier === "gang-leader"
          ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + gangLeaderBonus().toFixed(2) + "</span> Work speed for all workers<div class='bonus-sub'>Scales with gang size · own level amplifies</div></div>"
            + (etat.spherePerks && etat.spherePerks['gl-rec'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + gangLeaderBonus().toFixed(2) + "</span> Recruit speed (perk)</div>" : "")
            + (etat.spherePerks && etat.spherePerks['gl-explo'] === 'learned' ? "<div class='detail-job-bonus'>Halves scouting mission time (perk)</div>" : "")
          : k.metier === "explorator"
            ? "<div class='detail-job-bonus'>Halves all missions type times in Exploration</div>"
              + (etat.spherePerks && etat.spherePerks['ex-power'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>×1.5</span> Exploration Power (perk)</div>" : "")
              + (etat.spherePerks && etat.spherePerks['ex-food'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>×2</span> Canned Cat Food chance in scoutings (perk)</div>" : "")
              + (etat.spherePerks && etat.spherePerks['ex-luck'] === 'learned' ? "<div class='detail-job-bonus'><span class='bonus-var'>25%</span> chance to double scouting reward (perk)</div>" : "")
            : (METIERS[k.metier] ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + managerSpeedMultiplier(k, METIERS[k.metier].famille).toFixed(2) + "</span> production speed on " + METIERS[k.metier].familleNom + " when assigned as manager</div>" + managerPerksHtml(METIERS[k.metier].famille, "detail-job-perk") : "")
      ) : "";
      const _jlvl = jobLevelInfo(k.metier);
      const tcJobLvl = etat.trainingCenterConstruit && k.metier
        ? "<div class='detail-level-row'><span class='detail-level-num'>Level " + _jlvl.cur + " / " + _jlvl.max + "</span></div>"
        : "";
      gauche.innerHTML +=
        "<div class='detail-section detail-job-left' id='detail-job'>" +
        "<div class='detail-job-header'>" +
        "<span class='detail-section-titre'>Job</span>" +
        "<span class='detail-job-nom'>" + jobName + "</span>" +
        "</div>" +
        tcJobLvl +
        (jobBonus ? "<div>" + jobBonus + "</div>" : "") +
        "</div>";
    }
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

let workFiltre = "all";  // "all" | "wood" | "food" | "rock"

function filtrerWork(filtre) {
  workFiltre = filtre || "all";
  document.body.dataset.workFilter = workFiltre;
  ["all", "wood", "food", "rock"].forEach(function(f) {
    const el = document.getElementById("filtre-work-" + f);
    if (el) {
      el.classList.toggle("btn-filtre-work-actif", f === workFiltre);
      el.setAttribute("aria-pressed", f === workFiltre ? "true" : "false");
    }
  });
  rendu();
}

function deallouerTous() {
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
    slots.forEach(function(slot) { reinitialiserProgressionRecette(slot, false); });
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
  basicWoodPlanks:  "Basic Wood Planks",
  humanLeftovers:   "Human Leftovers",
  cannedCatFood:    "Canned Cat Food",
  humanWorkersFood: "Workers Food",
};

function renduRecompensesLuckScouting(sc, kittyIndex) {
  var entries;
  if (sc.recompenseTable) {
    entries = applyPerkCatFood(sc.recompenseTable, kittyIndex);
  } else if (sc.recompenseRange) {
    entries = sc.recompenseRange.map(function(entry) {
      return Object.assign({ recompense: sc.recompense }, entry);
    });
  } else if (sc.dropChance) {
    entries = [{ recompense: sc.recompense, qty: (sc.recompenseRange && sc.recompenseRange[0] ? sc.recompenseRange[0].qty : 1), weight: sc.dropChance * 100 }];
  } else {
    entries = [];
  }
  if (!entries.length) return '<div class="scouting-reward-table"><div class="scouting-reward-option scouting-reward-regular">Reward details unavailable</div></div>';
  var total = entries.reduce(function(sum, entry) { return sum + Number(entry.weight || 0); }, 0) || 100;
  var ordered = entries.slice().sort(function(a, b) { return b.weight - a.weight; });
  return '<div class="scouting-reward-table" aria-label="Scouting reward chances">' + ordered.map(function(entry, index) {
    var category = index === 0 ? "regular" : (index === ordered.length - 1 ? "super-lucky" : "lucky");
    var categoryLabel = category === "regular" ? "Regular Reward" : (category === "lucky" ? "Lucky Reward" : "Super Lucky Reward");
    var chance = Math.round(Number(entry.weight || 0) / total * 100);
    var rewardName = RESOURCE_DISPLAY_NAMES[entry.recompense] || entry.recompense;
    return '<div class="scouting-reward-option scouting-reward-' + category + '"><div class="scouting-reward-heading"><strong>' + categoryLabel + '</strong><span>' + chance + '%</span></div><span class="scouting-reward-quantity">' + entry.qty + ' ' + rewardName + '</span></div>';
  }).join('') + '</div>';
}

function recompenseLabel(camp) {
  if (camp.recompenses) {
    return camp.recompenses.map(function(entry) {
      return entry.qty + "x " + (RESOURCE_DISPLAY_NAMES[entry.recompense] || entry.recompense);
    }).join(' · ') + ' received';
  }
  const id = camp.recompense;
  if (id === "worldMap") return "Unlock the World Map";
  const livre = id && RECOMPENSE_LIVRES[id];
  if (livre) {
    const hint = etat.itemsAppris.includes(id) ? "Learned" : "go to Inventory to learn it";
    return livre.emoji + " " + livre.nom + " received <span class='recompense-hint'>(" + hint + ")</span>";
  }
  const item = id && ITEMS[id];
  if (item) return item.emoji + " " + item.nom + " received";
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
    const resultatZone = etat.resultatsExplorationZones[zoneId];
    html += '<div class="explo-card">';
    html += '<div class="explo-nom">&#x1F50D; Explore this zone</div>';
    if (zone.description) html += '<div class="explo-description zone-description">' + zone.description + '</div>';
    html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + zone.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(zone.duree) + ' &nbsp;&middot;&nbsp; &#x1F431; ' + zone.slots + ' slot(s)</div>';
    if (resultatZone) {
      if (resultatZone.success) {
        html += '<button class="explo-result-action explo-result-reveal" onclick="revelerZoneExploree(\'' + zoneId + '\')">🔍 Reveal the explored zone</button>';
      } else {
        html += '<button class="explo-result-action explo-result-failure" onclick="reessayerExploZone(\'' + zoneId + '\')"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt="">Try again</button>';
      }
    } else if (inProgress) {
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
          html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Assign a cat to " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
        } else {
          const k = etat.kittiesData[ki];
          html += '<div class="explo-slot-wrap">';
          html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "cat") + " in " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
          html += '<div class="explo-slot-kitty-info">';
          html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
          html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kittyEP(ki) + '</span>';
          html += '</div>';
          html += '</div>';
          html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "cat") + ' from ' + echapperAttributHtml(zone.nom) + '" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ')">&#x2715;</button>';
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
        html += '<div class="explo-power-display explo-power-hint">Assign cats to start the exploration.</div>';
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
      const resultatCampaign = etat.resultatsCampaigns[camp.id];

      if (!exploKittiesSelectionnees[camp.id]) {
        exploKittiesSelectionnees[camp.id] = new Array(camp.slots).fill(null);
      }
      const slots = exploKittiesSelectionnees[camp.id];

      const requiredItemMissing = camp.requiredItem && !etat.itemsAcquis.includes(camp.requiredItem);
      html += '<div class="explo-card' + ((camp.lockedReason || requiredItemMissing) && !completed ? ' explo-card-locked' : '') + '">';
      html += '<div class="explo-nom">' + camp.nom + '</div>';
      html += '<div class="explo-description">' + camp.description + '</div>';

      if (resultatCampaign) {
        if (resultatCampaign.success) {
          html += '<button class="explo-result-action explo-result-reward" onclick="recupererRecompenseCampaign(\'' + camp.id + '\')">🎁 Claim campaign reward</button>';
        } else {
          html += '<button class="explo-result-action explo-result-failure" onclick="reessayerCampaign(\'' + camp.id + '\')"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt="">Try again</button>';
        }
      } else if (completed) {
        html += '<div class="explo-complete">' + CHECK_ICON + ' Completed &#x2014; ' + recompenseLabel(camp) + '</div>';
      } else if (camp.lockedReason || requiredItemMissing) {
        html += '<div class="explo-locked-reason">' + (camp.lockedReason || ('Requires ' + (ITEMS[camp.requiredItem] ? ITEMS[camp.requiredItem].nom : camp.requiredItem) + '.')) + '</div>';
      } else if (inProgress) {
        const elapsed   = (Date.now() - inProgress.startTs) / 1000;
        const remaining = Math.max(0, inProgress.duree - elapsed);
        const progress  = Math.min(1, elapsed / inProgress.duree);
        const names     = inProgress.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
        const power     = Number.isFinite(inProgress.power) ? inProgress.power : inProgress.kittyIndices.reduce(function(s, i) { return s + kittyEP(i); }, 0);
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
            html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="campaign:' + camp.id + ':' + si + '"' + attributsActivationClavier("Assign a cat to " + camp.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
          } else {
            const k = etat.kittiesData[ki];
            html += '<div class="explo-slot-wrap">';
            html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="campaign:' + camp.id + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "cat") + " in " + camp.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
            html += '<div class="explo-slot-kitty-info">';
            html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
            html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kittyEP(ki) + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "cat") + ' from ' + echapperAttributHtml(camp.nom) + '" onclick="retirerKittySlot(\'' + camp.id + '\',' + si + ')">&#x2715;</button>';
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
          html += '<div class="explo-power-display explo-power-hint">Click a slot to assign a cat.</div>';
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
        var scKiDisp = running ? running.kittyIndex : scoutingsStagingKitty[sc.id];
        scoutHtml += '<div class="explo-card">';
        scoutHtml += '<div class="explo-nom">' + sc.nom + '</div>';
        scoutHtml += '<div class="explo-description">' + sc.description + '</div>';
        scoutHtml += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + sc.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(sc.duree) + '</div>';
        scoutHtml += renduRecompensesLuckScouting(sc, scKiDisp);
        if (scKiDisp !== undefined && etat.spherePerks && etat.spherePerks['ex-luck'] === 'learned') {
          var kDisp = etat.kittiesData[scKiDisp];
          if (kDisp && kDisp.metier === 'explorator') scoutHtml += '<div class="scouting-reward-perk">Explorator perk: 25% chance to double the reward</div>';
        }
        if (running) {
          var effectiveDuree = (running.duree !== undefined) ? running.duree : sc.duree;
          var elapsed   = (Date.now() - running.startTs) / 1000;
          var remaining = Math.max(0, effectiveDuree - elapsed);
          var prog      = Math.min(1, elapsed / effectiveDuree);
          var k         = etat.kittiesData[running.kittyIndex];
          var kNom      = k ? k.nom : "?";
          var kPower    = Number.isFinite(running.power) ? running.power : kittyEP(running.kittyIndex);
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
            scoutHtml += '<div class="explo-slot explo-slot-filled" data-explo-trigger="scouting:' + sc.id + '"' + attributsActivationClavier("Change " + (stagedK ? stagedK.nom : "cat") + " in " + sc.nom) + ' onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(stagedK) + '</span>';
            scoutHtml += '<div class="explo-slot-kitty-info">';
            scoutHtml += '<span class="explo-slot-kitty-nom">' + (stagedK ? stagedK.nom : "?") + '</span>';
            scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + selPower + '</span>';
            scoutHtml += '</div>';
            scoutHtml += '</div>';
            scoutHtml += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(stagedK ? stagedK.nom : "cat") + ' from ' + echapperAttributHtml(sc.nom) + '" onclick="retirerScoutingStaging(\'' + sc.id + '\')">&#x2715;</button>';
            scoutHtml += '</div>';
          } else {
            scoutHtml += '<div class="explo-slot explo-slot-empty" data-explo-trigger="scouting:' + sc.id + '"' + attributsActivationClavier("Assign a cat to " + sc.nom) + ' onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
          }
          scoutHtml += '</div>';
          if (selPower > 0) {
            var scoutHalves = stagedKi !== undefined && scoutingHalveTime(stagedKi);
            var scoutEffDuree = scoutHalves ? sc.duree / 2 : sc.duree;
            var scoutHalvesLabel = stagedK && stagedK.metier === 'explorator' ? 'Explorator' : 'Exploration perk';
            var scoutTimeNote = scoutHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(scoutEffDuree) + '</strong> (' + scoutHalvesLabel + ')' : '';
            scoutHtml += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + sc.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + scoutTimeNote + '</div>';
          } else {
            scoutHtml += '<div class="explo-power-display explo-power-hint">Click a slot to assign a cat.</div>';
          }
          if (etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
            scoutHtml += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'scouting\',\'' + sc.id + '\')">Auto Assign</button>';
          }
          scoutHtml += '<button class="btn-lancer-explo"' + (stagedKi !== undefined ? '' : ' disabled') + ' onclick="lancerScouting(\'' + sc.id + '\')">Send to scout &#x27A4;</button>';
        }
        var butin = etat.butinsScouting[sc.id];
        if (butin && butin.successful + butin.failed > 0) {
          var rewardsText = Object.keys(butin.rewards).map(function(recompenseId) {
            return (RESOURCE_DISPLAY_NAMES[recompenseId] || recompenseId) + ' ×' + formaterNombre(butin.rewards[recompenseId]);
          }).join(' · ');
          var doubledVisible = false;
          if (running && etat.spherePerks && etat.spherePerks['ex-luck'] === 'learned') {
            var runningKitty = etat.kittiesData[running.kittyIndex];
            doubledVisible = !!(runningKitty && runningKitty.metier === 'explorator');
          }
          scoutHtml += '<div class="scouting-accumulator">';
          scoutHtml += '<div class="scouting-runs"><span class="scouting-metric-label">Scouting Runs:</span><strong class="scouting-successful">Successful ' + butin.successful + '</strong><span class="scouting-failed">Failed ' + butin.failed + '</span></div>';
          scoutHtml += '<div class="scouting-luck"><span class="scouting-metric-label">Rewards Luck:</span><span>Regular ' + butin.regular + '</span><span class="scouting-lucky">Lucky ' + butin.lucky + '</span><strong class="scouting-super-lucky">Super Lucky ' + butin.superLucky + '</strong>' + (doubledVisible ? '<strong class="scouting-doubled">Doubled ' + butin.doubled + '</strong>' : '') + '</div>';
          scoutHtml += '<div class="scouting-rewards">' + (rewardsText || 'No rewards collected yet') + '</div>';
          scoutHtml += '<button class="explo-result-action explo-result-reward" onclick="recupererButinScouting(\'' + sc.id + '\')">🎁 Claim scouting rewards</button>';
          scoutHtml += '</div>';
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
      const revealReady = !!(etat.resultatsExplorationZones[zoneId] && etat.resultatsExplorationZones[zoneId].success);
      const campaignRewardReady = Object.keys(etat.resultatsCampaigns).some(function(campaignId) {
        const camp = CONFIG.campaigns[campaignId];
        return camp && camp.zone === zoneId && etat.resultatsCampaigns[campaignId].success;
      });
      const failedResultReady = !!(etat.resultatsExplorationZones[zoneId] && !etat.resultatsExplorationZones[zoneId].success)
        || Object.keys(etat.resultatsCampaigns).some(function(campaignId) {
          const camp = CONFIG.campaigns[campaignId];
          return camp && camp.zone === zoneId && !etat.resultatsCampaigns[campaignId].success;
        });
      const scoutingRewardReady = Object.keys(etat.butinsScouting).some(function(scoutingId) {
        const scouting = CONFIG.scoutings[scoutingId];
        const butin = etat.butinsScouting[scoutingId];
        return scouting && scouting.zone === zoneId && butin && Object.keys(butin.rewards).some(function(rewardId) {
          return butin.rewards[rewardId] > 0;
        });
      });
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
          if (revealReady) html += '<span class="carte-badge-result carte-badge-reveal" title="Zone ready to reveal">🔍</span>';
          if (campaignRewardReady || scoutingRewardReady) html += '<span class="carte-badge-result carte-badge-reward" title="Rewards ready to claim">🎁</span>';
          if (failedResultReady) html += '<span class="carte-badge-result carte-badge-failure" title="Mission ready to retry">❌</span>';
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
        html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Assign a cat to " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
      } else {
        const k = etat.kittiesData[ki];
        html += '<div class="explo-slot-wrap">';
        html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "cat") + " in " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
        html += '<div class="explo-slot-kitty-info">';
        html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
        html += '<span class="explo-slot-kitty-power">⚡ EP ' + kittyEP(ki) + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "cat") + ' from ' + echapperAttributHtml(zone.nom) + '" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ')"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button>';
        html += '</div>';
      }
    }
    html += '</div>';
    if (power > 0) {
      html += '<div class="explo-power-display">Exploration Power: ' + power + ' / ' + zone.difficulte + ' — <strong>' + chance + '%</strong> success</div>';
    } else {
      html += '<div class="explo-power-display explo-power-hint">Assign cats to start the exploration.</div>';
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
    // The detail panel is recreated below, so its content cache must not
    // suppress the first render when the selected zone stays unchanged.
    _zoneInfoKey = null;
    el.innerHTML =
      '<div class="carte-grille-conteneur">' +
        (etat.jobCenterConstruit && (!u || !u.explorateurPresent) ? '<p class="explo-map-hint">Train an <strong>Explorator</strong> in the Job Center to unlock other zones.</p>' : '') +
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

  html += '<div class="zone-info-ligne"><span>Exploration Status ' + (exploree ? CHECK_ICON : '<img class="icon-close-inline" src="img/interface/Red Cross_Final.png?v=0.0029" alt="not explored">') + '</span></div>';

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
    html += '<div class="zone-info-item">—</div>';
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

  conteneurEl.innerHTML = html || '<p class="explo-vide">No cats available.</p>';
}

function selectionnerKittySlot(kittyIndex) {
  if (!exploModalOuvert) return;

  if (exploModalOuvert.scoutingId) {
    const scoutingId = exploModalOuvert.scoutingId;
    const alreadyStaged = scoutingsStagingKitty[scoutingId] !== undefined;
    if (!alreadyStaged && chatonsLibres() <= 0) {
      fermerModalExplo();
      afficherNotification("⚠️ Not enough free cats!");
      return;
    }
    scoutingsStagingKitty[scoutingId] = kittyIndex;
    exclusifyStagedKitty(kittyIndex, 'scouting', scoutingId);
    jouerSonAffectation();
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
    jouerSonAffectation();
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
    afficherNotification("⚠️ Not enough free cats!");
    return;
  }

  exploKittiesSelectionnees[campId][slotIndex] = kittyIndex;
  exclusifyStagedKitty(kittyIndex, 'campaign', campId);
  jouerSonAffectation();
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
  if (!zoneId || etat.exploZoneEnCours || etat.resultatsExplorationZones[zoneId]) return;
  const z = ZONES_CARTE[zoneId];
  if (!z || etat.zonesExplorees.includes(zoneId)) return;
  const slots = carteExploSlots[zoneId] || [];
  if (!slots.every(function(k) { return k !== null; })) return;
  var hasHalvesTime = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
  var launchPower = slots.reduce(function(s, ki) { return s + kittyEP(ki); }, 0);
  etat.exploZoneEnCours = { zoneId: zoneId, kittyIndices: slots.slice(), power: launchPower, startTs: Date.now(), duree: hasHalvesTime ? z.duree / 2 : z.duree };
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExploZone() {
  if (!etat.exploZoneEnCours) return;
  const mission = etat.exploZoneEnCours;
  const zoneId = mission.zoneId;
  const z = ZONES_CARTE[zoneId];
  const power = Number.isFinite(mission.power) ? mission.power : mission.kittyIndices.reduce(function(s, i) {
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
  if (!etat.resultatsExplorationZones) etat.resultatsExplorationZones = {};
  etat.resultatsExplorationZones[zoneId] = { success: success, kittyIndices: mission.kittyIndices.slice() };
  afficherNotification(success ? "🔍 " + zoneName + " is ready to be revealed!" : "❌ " + zoneName + " exploration failed. Check the map to try again.");
  ajouterLog("event", success
    ? "Zone exploration completed: " + zoneName + " is ready to reveal."
    : "Zone exploration failed: " + zoneName + ". " + names + " returned safely.");
}

function kittyDisponiblePourNouvelleMission(kittyIndex) {
  return !!etat.kittiesData[kittyIndex] && !kittyIsBusy(kittyIndex) && !kittyEstManager(kittyIndex);
}

function revelerZoneExploree(zoneId) {
  const resultat = etat.resultatsExplorationZones[zoneId];
  const zone = ZONES_CARTE[zoneId];
  if (!resultat || !resultat.success || !zone) return;
  delete etat.resultatsExplorationZones[zoneId];
  if (!etat.zonesExplorees.includes(zoneId)) etat.zonesExplorees.push(zoneId);
  afficherNotification("✅ " + zone.nom + " explored!");
  ajouterLog("unlock", "Zone explored: " + zone.nom + ".");
  carteDirty = true;
  exploTabDirty = true;
  verifierObjectifs(); sauvegarder(); rendu();
}

function reessayerExploZone(zoneId) {
  const resultat = etat.resultatsExplorationZones[zoneId];
  const zone = ZONES_CARTE[zoneId];
  if (!resultat || resultat.success || !zone) return;
  delete etat.resultatsExplorationZones[zoneId];
  carteExploSlots[zoneId] = new Array(zone.slots).fill(null);
  resultat.kittyIndices.slice(0, zone.slots).forEach(function(kittyIndex, slotIndex) {
    if (kittyDisponiblePourNouvelleMission(kittyIndex)) {
      carteExploSlots[zoneId][slotIndex] = kittyIndex;
      exclusifyStagedKitty(kittyIndex, "zone", zoneId);
    }
  });
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function lancerExplo(id) {
  const slots = exploKittiesSelectionnees[id];
  const camp  = CONFIG.campaigns[id];
  if (!camp || !slots || etat.resultatsCampaigns[id]) return;
  if (camp.requiredItem && !etat.itemsAcquis.includes(camp.requiredItem)) return;
  const kittyIndices = slots.filter(function(x) { return x !== null; });
  if (kittyIndices.length < camp.slots) return;
  if (kittyIndices.length > chatonsLibres()) {
    afficherNotification("⚠️ Not enough free cats!");
    return;
  }
  var hasHalvesTime = kittyIndices.some(function(ki) { return scoutingHalveTime(ki); });
  var launchPower = kittyIndices.reduce(function(s, ki) { return s + kittyEP(ki); }, 0);
  etat.exploEnCours.push({ id: id, kittyIndices: kittyIndices, power: launchPower, startTs: Date.now(), duree: hasHalvesTime ? camp.duree / 2 : camp.duree });
  exploKittiesSelectionnees[id] = new Array(camp.slots).fill(null);
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExplo(explo) {
  const camp = CONFIG.campaigns[explo.id];
  if (!camp) return;

  const power   = Number.isFinite(explo.power) ? explo.power : explo.kittyIndices.reduce(function(s, i) {
    return s + kittyEP(i);
  }, 0);
  const success = Math.random() < Math.min(1, power / camp.difficulte);
  const names   = explo.kittyIndices.map(function(i) {
    return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
  }).join(", ");

  var recompenses = [];
  if (success && camp.recompenses) {
    recompenses = camp.recompenses.map(function(entry) { return { recompense: entry.recompense, qty: entry.qty }; });
  } else if (success && camp.recompenseTable) {
    var rewardEntry = resoudreRecompenseTable(camp.recompenseTable);
    recompenses = [{ recompense: rewardEntry.recompense, qty: rewardEntry.qty }];
  } else if (success) {
    recompenses = [{ recompense: camp.recompense, qty: camp.recompenseQty || 1 }];
  }
  if (!etat.resultatsCampaigns) etat.resultatsCampaigns = {};
  etat.resultatsCampaigns[explo.id] = { success: success, kittyIndices: explo.kittyIndices.slice(), recompenses: recompenses };
  ajouterLog("event", success
    ? "Campaign '" + camp.nom + "' succeeded. Its reward is waiting to be claimed."
    : "Campaign '" + camp.nom + "' failed. " + names + " returned empty-pawed.");
  afficherNotification(success ? "🎁 " + camp.nom + " reward ready!" : "❌ " + camp.nom + " failed. Open the zone to try again.");
  carteDirty = true;
  exploTabDirty = true;
}

function recupererRecompenseCampaign(campaignId) {
  const resultat = etat.resultatsCampaigns[campaignId];
  const camp = CONFIG.campaigns[campaignId];
  if (!resultat || !resultat.success || !camp) return;
  resultat.recompenses.forEach(function(entry) { appliquerRecompense(entry.recompense, entry.qty); });
  if (!etat.campaignsCompletees.includes(campaignId)) etat.campaignsCompletees.push(campaignId);
  delete etat.resultatsCampaigns[campaignId];
  ajouterLog("unlock", "Campaign completed: " + camp.nom + ". Reward claimed.");
  carteDirty = true;
  exploTabDirty = true;
  verifierObjectifs(); sauvegarder(); rendu();
}

function reessayerCampaign(campaignId) {
  const resultat = etat.resultatsCampaigns[campaignId];
  const camp = CONFIG.campaigns[campaignId];
  if (!resultat || resultat.success || !camp) return;
  delete etat.resultatsCampaigns[campaignId];
  exploKittiesSelectionnees[campaignId] = new Array(camp.slots).fill(null);
  resultat.kittyIndices.slice(0, camp.slots).forEach(function(kittyIndex, slotIndex) {
    if (kittyDisponiblePourNouvelleMission(kittyIndex)) {
      exploKittiesSelectionnees[campaignId][slotIndex] = kittyIndex;
      exclusifyStagedKitty(kittyIndex, "campaign", campaignId);
    }
  });
  exploTabDirty = true;
  sauvegarder(); rendu();
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
  if (recompenseId === "compass") {
    if (!etat.itemsAcquis.includes("compass")) {
      etat.itemsAcquis.push("compass");
      inventaireDirty = true;
      afficherNotification("Compass obtained! A path beyond the neighbourhood may be opening.");
      ajouterLog("unlock", "Compass added to your Inventory.");
    }
  }
  if (recompenseId === "basicWoodPlanks") {
    const qty = recompenseQty || 1;
    etat.basicWoodPlanks += qty;
    afficherNotification(qty + " Basic Wood Planks found!");
    ajouterLog("event", qty + " Basic Wood Planks added to inventory.");
  }
  if (recompenseId === "humanLeftovers") {
    const qty = recompenseQty || 1;
    etat.humanLeftovers += qty;
    afficherNotification(qty + " Human Leftovers found!");
    ajouterLog("event", qty + " Human Leftovers found in the neighbor's trash.");
  }
  if (recompenseId === "schoolGuide") {
    if (!etat.itemsAcquis.includes("schoolGuide")) {
      etat.itemsAcquis.push("schoolGuide");
      inventaireDirty = true;
    }
    afficherNotification("School Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "School Guide added to your Inventory.");
    if (!storyEstVue("story6aVue")) {
      marquerStoryVue("story6aVue");
      afficherModal("ecran-story-6a");
      renduStories();
    }
  }
  if (recompenseId === "fishingGuide") {
    if (!etat.itemsAcquis.includes("fishingGuide")) {
      etat.itemsAcquis.push("fishingGuide");
      inventaireDirty = true;
    }
    afficherNotification("Fishing Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "Fishing Guide for Dummies added to your Inventory.");
  }
  if (recompenseId === "constructionPlan") {
    if (!etat.itemsAcquis.includes("constructionPlan")) {
      etat.itemsAcquis.push("constructionPlan");
      inventaireDirty = true;
    }
    afficherNotification("Construction Plan obtained! Check your Inventory.");
    ajouterLog("unlock", "Construction Plan added to your Inventory.");
  }
  if (recompenseId === "stoneGuide") {
    if (!etat.itemsAcquis.includes("stoneGuide")) {
      etat.itemsAcquis.push("stoneGuide");
      inventaireDirty = true;
    }
    afficherNotification("Stone Craft Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "Stone Craft Guide added to your Inventory.");
  }
  if (recompenseId === "seminarGuide") {
    if (!etat.itemsAcquis.includes("seminarGuide")) {
      etat.itemsAcquis.push("seminarGuide");
      inventaireDirty = true;
    }
    afficherNotification("Corporate Seminar Booklet obtained! Check your Inventory.");
    ajouterLog("unlock", "Corporate Seminar Booklet added to your Inventory.");
  }
  if (recompenseId === "cannedCatFood") {
    etat.cannedCatFood += (recompenseQty || 1);
    afficherNotification("Canned Cat Food obtained!");
    ajouterLog("event", "Canned Cat Food added to inventory.");
  }
  if (recompenseId === "humanWorkersFood") {
    const qty = recompenseQty || 1;
    etat.humanWorkersFood += qty;
    afficherNotification(qty + " Human Workers Food found!");
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
let _workPopupContext = null;

function workResourcePair(resource, phase) {
  return RESOURCE_PAIRS.find(function(pair) {
    return phase === "gather" ? pair.rawRes === resource : pair.procRes === resource;
  }) || null;
}

function workMultiplierLabel(value) {
  return "×" + Number(value).toFixed(2);
}

function workResourceDetails(pair, slot, phase) {
  const gather = phase === "gather";
  const kitty = slot && slot.kittyIndex !== null ? etat.kittiesData[slot.kittyIndex] : null;
  const managerFamily = MAP_FAMILLE[gather ? pair.rawAction : pair.procMultAction];
  const manager = managerKittyForFamily(managerFamily);
  const gangLeader = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
  const speedBonuses = [];
  const productionBonuses = [];
  let speedMultiplier = 1;
  let productionMultiplier = 1;
  const gangSpeed = gangLeaderBonus();

  if (gangLeader && gangSpeed > 1) {
    speedBonuses.push({ label: gangLeader.nom + " Gang Leader", value: gangSpeed });
    speedMultiplier *= gangSpeed;
  }
  if (manager) {
    const managerSpeed = managerSpeedMultiplier(manager, managerFamily);
    speedBonuses.push({ label: manager.nom + " Manager", value: managerSpeed });
    speedMultiplier *= managerSpeed;
  }
  const devWorkSpeed = workBoostMult();
  if (devWorkSpeed > 1) {
    speedBonuses.push({ label: "Dev Work Boost", value: devWorkSpeed });
    speedMultiplier *= devWorkSpeed;
  }

  if (kitty && kitty.niveau > 0) {
    const workerProduction = gather ? Math.pow(1.1, kitty.niveau) : productionProcBonus(kitty);
    productionBonuses.push({ label: kitty.nom + " worker", value: workerProduction });
    productionMultiplier *= workerProduction;
  }
  if (gather && manager && managerProductionMultiplier(managerFamily) > 1) {
    const managerProduction = managerProductionMultiplier(managerFamily);
    productionBonuses.push({ label: manager.nom + " Manager (perk)", value: managerProduction });
    productionMultiplier *= managerProduction;
  }

  const rawTime = gather ? Number(pair.rawCfg.secondesParUnite) : Number(pair.procCfg[pair.procSecUnite]);
  const adjustedTime = rawTime / (speedMultiplier * (gather ? productionMultiplier : 1));
  const target = quantiteInputEffective(pair, pair.inputs[0]);
  const outputPerCycle = kitty ? productionProcBonus(kitty) : 1;
  return {
    pair: pair,
    kitty: kitty,
    gather: gather,
    rawTime: rawTime,
    adjustedTime: adjustedTime,
    target: target,
    speedBonuses: speedBonuses,
    productionBonuses: productionBonuses,
    outputPerCycle: outputPerCycle
  };
}

function workResourceDetailsHtml(details, spriteSrc) {
  const pair = details.pair;
  let html = '<div class="irp-header">';
  if (spriteSrc) html += '<img class="irp-icon" src="' + spriteSrc + '" alt="">';
  html += '<div class="irp-header-text"><div class="irp-nom">' + echapperAttributHtml(details.gather ? pair.rawLabel : pair.procLabel) + '</div><div class="irp-tier">' + (details.gather ? "Gathering" : "Processing") + '</div></div></div>';
  html += '<div class="irp-production-details">';
  html += '<div class="irp-detail-line"><span class="irp-detail-label">' + (details.gather ? "Raw time for one" : "Raw time for one cycle") + '</span><strong>' + formaterSecondesBrutes(details.rawTime) + '</strong></div>';
  if (details.speedBonuses.length) {
    html += '<div class="irp-detail-section"><span class="irp-detail-section-title">Current speed bonus</span>';
    details.speedBonuses.forEach(function(bonus) {
      html += '<div class="irp-detail-line"><span>' + echapperAttributHtml(bonus.label) + '</span><strong>' + workMultiplierLabel(bonus.value) + '</strong></div>';
    });
    html += '</div>';
  }
  if (details.productionBonuses.length) {
    html += '<div class="irp-detail-section"><span class="irp-detail-section-title">Current production bonus</span>';
    details.productionBonuses.forEach(function(bonus) {
      html += '<div class="irp-detail-line"><span>' + echapperAttributHtml(bonus.label) + '</span><strong>' + workMultiplierLabel(bonus.value) + '</strong></div>';
    });
    html += '</div>';
  }
  if (details.gather) {
    html += '<div class="irp-detail-line irp-detail-result"><span class="irp-detail-label">Adjusted time for 1</span><strong>' + formaterSecondesBrutes(details.adjustedTime) + '</strong></div>';
    html += '<div class="irp-detail-line irp-detail-result"><span class="irp-detail-label">Adjusted time for ' + libelleNombreDecimal(details.target, 1) + '</span><strong>' + formaterSecondesBrutes(details.adjustedTime * details.target) + '</strong></div>';
  } else {
    html += '<div class="irp-detail-line irp-detail-result"><span class="irp-detail-label">Adjusted time for one cycle</span><strong>' + formaterSecondesBrutes(details.adjustedTime) + '</strong></div>';
    if (details.kitty) {
      html += '<div class="irp-detail-line"><span class="irp-detail-label">Output per cycle</span><strong>' + libelleNombreDecimal(details.outputPerCycle, 2) + '</strong></div>';
    }
  }
  return html + '</div>';
}

function positionnerWorkResourcePopup(el, popup) {
  const rect = el.getBoundingClientRect();
  const pw = popup.offsetWidth || 300;
  const ph = popup.offsetHeight || 220;
  const mg = 8;
  let left = rect.left;
  let top = rect.bottom + mg;
  if (left + pw > window.innerWidth - mg) left = window.innerWidth - pw - mg;
  if (left < mg) left = mg;
  if (top + ph > window.innerHeight - mg) top = rect.top - ph - mg;
  if (top < mg) top = mg;
  popup.style.left = left + "px";
  popup.style.top = top + "px";
}

function showWorkResourcePopup(el) {
  const familyId = el.dataset.workFamily;
  const slotIdx = Number(el.dataset.workSlot);
  const phase = el.dataset.workPhase;
  const slot = slotRecette(familyId, slotIdx);
  const pair = slot && paireRecette(slot.recipeId);
  if (!pair || !phase) return;
  const details = workResourceDetails(pair, slot, phase);
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  _workPopupContext = { familyId: familyId, slotIdx: slotIdx, phase: phase };
  el.setAttribute("aria-expanded", "true");
  const popup = document.getElementById("inv-res-popup");
  popup.classList.add("work-production-popup");
  popup.setAttribute("aria-hidden", "false");
  const sprite = el.querySelector("img");
  popup.innerHTML = workResourceDetailsHtml(details, sprite && sprite.src);
  popup.style.display = "block";
  positionnerWorkResourcePopup(el, popup);
}

function toggleWorkResourcePopup(el, evt) {
  if (evt) evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showWorkResourcePopup(el);
}

function showResPopup(el) {
  var id   = el.dataset.resId;
  var info = RESOURCE_INFO[id];
  if (!info) return;
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  _workPopupContext = null;
  el.setAttribute("aria-expanded", "true");
  var popup  = document.getElementById("inv-res-popup");
  popup.classList.remove("work-production-popup");
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
  popup.classList.remove("work-production-popup");
  popup.setAttribute("aria-hidden", "true");
  if (_resPopupTarget) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = null;
  _workPopupContext = null;
}

function toggleResPopup(el, evt) {
  evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showResPopup(el);
}

function showUniqueItemPopup(el) {
  var item = ITEMS[el.dataset.uniqueItemId];
  if (!item) return;
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  _workPopupContext = null;
  el.setAttribute("aria-expanded", "true");
  var popup = document.getElementById("inv-res-popup");
  popup.classList.remove("work-production-popup");
  popup.setAttribute("aria-hidden", "false");
  popup.innerHTML = '<div class="irp-header"><span class="irp-icon irp-icon-html">' + item.emoji + '</span><div class="irp-header-text"><div class="irp-nom">' + item.nom + '</div><div class="irp-tier">Unique item</div></div></div>' +
    '<p class="irp-desc">' + item.description + '</p>' +
    (item.produce ? '<div class="irp-ligne"><span class="irp-label">How to get</span>' + item.produce + '</div>' : '') +
    (item.usage ? '<div class="irp-ligne"><span class="irp-label">Used for</span>' + item.usage + '</div>' : '');
  popup.style.display = "block";
  var rect = el.getBoundingClientRect();
  var pw = popup.offsetWidth || 260;
  var ph = popup.offsetHeight || 140;
  var mg = 8;
  var left = rect.left;
  var top = rect.bottom + mg;
  if (left + pw > window.innerWidth - mg) left = window.innerWidth - pw - mg;
  if (left < mg) left = mg;
  if (top + ph > window.innerHeight - mg) top = rect.top - ph - mg;
  if (top < mg) top = mg;
  popup.style.left = left + "px";
  popup.style.top = top + "px";
}

function toggleUniqueItemPopup(el, evt) {
  evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showUniqueItemPopup(el);
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
  inventaireDirty = true;
  var resEl  = document.getElementById("inv-resources");
  if (resEl) resEl.dataset.visibleKey = "";  // force rebuild
  renduInventaire(unlocks());
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
  const item = ITEMS[itemId];
  if (!item) return;

  if (actionId === "study" && item.learningGame) {
    if (etat.itemsAppris.includes(itemId)) return;
    if (etat.itemsEtudies.includes(itemId)) return;
    if (etat.learningEnCours) return;
    const duree = item.studyDuration || 60000;
    etat.learningEnCours = { itemId: itemId, startTs: Date.now(), duree: duree };
    inventaireDirty = true;
    afficherNotification("📖 Studying " + item.nom + "... " + formaterTemps(duree / 1000) + " remaining.");
    sauvegarder(); renduInventaire(unlocks());
    return;
  }

  if (actionId === "learn" && item.learningGame) {
    if (etat.itemsAppris.includes(itemId)) return;
    if (!etat.itemsEtudies.includes(itemId)) return;
    ouvrirMiniJeuLivre(itemId);
    return;
  }
}

function terminerApprentissage(itemId) {
  const item = ITEMS[itemId];
  if (item && item.learningGame && !etat.itemsAppris.includes(itemId)) {
    if (!etat.itemsEtudies.includes(itemId)) etat.itemsEtudies.push(itemId);
    etat.learningEnCours = null;
    inventaireDirty = true;
    afficherNotification("📖 " + item.nom + " studied! Complete its lesson to learn it.");
    ajouterLog("event", item.nom + " study complete — its lesson is ready in Inventory.");
    sauvegarder(); rendu();
    return;
  }

  apprendreLivre(itemId);
}

function apprendreLivre(itemId) {
  if (etat.itemsAppris.includes(itemId)) return;
  if (itemId === "schoolGuide") {
    etat.itemsAppris.push("schoolGuide");
    etat.jobCenterDebloque = true;
    assignerGangLeader();
    afficherNotification("🏫 Job Center unlocked! Build it in the Facilities tab.");
    ajouterLog("unlock", "Job Center unlocked — build it from the Facilities tab.");
    if (!storyEstVue("story6bVue")) {
      marquerStoryVue("story6bVue");
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
    if (!storyEstVue("storySeminarVue")) {
      marquerStoryVue("storySeminarVue");
      afficherModal("ecran-story-seminar");
      renduStories();
    }
  }
  etat.learningEnCours = null;
  inventaireDirty = true;
  verifierObjectifs();
  sauvegarder(); rendu();
}

let livreMiniJeuItemId = null;
let livreMiniJeuMots = [];
let livreMiniJeuTrous = [];
let livreMiniJeuMessage = "";

function melangerMotsLivre(mots) {
  const melanges = mots.map(function(mot, index) { return { id: index, mot: mot }; });
  for (let i = melanges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporaire = melanges[i];
    melanges[i] = melanges[j];
    melanges[j] = temporaire;
  }
  return melanges;
}

function ouvrirMiniJeuLivre(itemId) {
  const item = ITEMS[itemId];
  const jeu = item && item.learningGame;
  if (!jeu || etat.itemsAppris.includes(itemId) || !etat.itemsEtudies.includes(itemId)) return;

  livreMiniJeuItemId = itemId;
  livreMiniJeuMots = melangerMotsLivre(jeu.answers);
  livreMiniJeuTrous = jeu.answers.map(function() { return null; });
  livreMiniJeuMessage = "";
  renduMiniJeuLivre();
  ouvrirDialogueModal("book-learning-modal", {
    dismissible: true,
    fermer: fermerMiniJeuLivre,
    focusSelector: ".book-learning-word",
    returnFocusSelector: '#inv-item-card-' + itemId
  });
}

function fermerMiniJeuLivre() {
  fermerDialogueModal("book-learning-modal");
  livreMiniJeuItemId = null;
  livreMiniJeuMots = [];
  livreMiniJeuTrous = [];
  livreMiniJeuMessage = "";
}

function placerMotMiniJeuLivre(motId) {
  if (livreMiniJeuTrous.includes(motId)) return;
  const premierTrou = livreMiniJeuTrous.indexOf(null);
  if (premierTrou < 0) return;
  livreMiniJeuTrous[premierTrou] = motId;
  livreMiniJeuMessage = "";
  renduMiniJeuLivre();
}

function retirerMotMiniJeuLivre(trouIndex) {
  if (trouIndex < 0 || trouIndex >= livreMiniJeuTrous.length) return;
  livreMiniJeuTrous[trouIndex] = null;
  livreMiniJeuMessage = "";
  renduMiniJeuLivre();
}

function motMiniJeuLivre(motId) {
  const entree = livreMiniJeuMots.find(function(mot) { return mot.id === motId; });
  return entree ? entree.mot : "";
}

function renduMiniJeuLivre() {
  const item = ITEMS[livreMiniJeuItemId];
  const jeu = item && item.learningGame;
  const phraseEl = document.getElementById("book-learning-phrase");
  const motsEl = document.getElementById("book-learning-words");
  const feedbackEl = document.getElementById("book-learning-feedback");
  const checkEl = document.getElementById("book-learning-check");
  const titreEl = document.getElementById("book-learning-title");
  if (!jeu || !phraseEl || !motsEl || !feedbackEl || !checkEl) return;

  if (titreEl) titreEl.textContent = "Learn from the " + item.nom;
  let phraseHtml = "";
  jeu.phraseParts.forEach(function(partie, index) {
    phraseHtml += '<span>' + echapperAttributHtml(partie) + '</span>';
    if (index >= jeu.answers.length) return;
    const motId = livreMiniJeuTrous[index];
    const mot = motId === null ? "" : motMiniJeuLivre(motId);
    phraseHtml += '<button class="book-learning-blank' + (mot ? " book-learning-blank-filled" : "") + '"' +
      ' aria-label="Blank ' + (index + 1) + (mot ? ": " + echapperAttributHtml(mot) + ". Click to remove." : ": empty") + '"' +
      (mot ? ' onclick="retirerMotMiniJeuLivre(' + index + ')"' : ' disabled') + '>' +
      (mot ? echapperAttributHtml(mot) : "___") + '</button>';
  });
  phraseEl.innerHTML = phraseHtml;

  motsEl.innerHTML = livreMiniJeuMots.filter(function(entree) {
    return !livreMiniJeuTrous.includes(entree.id);
  }).map(function(entree) {
    return '<button class="book-learning-word" onclick="placerMotMiniJeuLivre(' + entree.id + ')">' + echapperAttributHtml(entree.mot) + '</button>';
  }).join("");

  feedbackEl.textContent = livreMiniJeuMessage;
  checkEl.disabled = livreMiniJeuTrous.some(function(motId) { return motId === null; });
}

function verifierMiniJeuLivre() {
  const itemId = livreMiniJeuItemId;
  const item = ITEMS[itemId];
  const jeu = item && item.learningGame;
  if (!jeu || livreMiniJeuTrous.some(function(motId) { return motId === null; })) return;

  const correcte = livreMiniJeuTrous.every(function(motId, index) {
    return motMiniJeuLivre(motId) === jeu.answers[index];
  });
  if (!correcte) {
    livreMiniJeuTrous = jeu.answers.map(function() { return null; });
    livreMiniJeuMessage = "Incorrect. Try again.";
    renduMiniJeuLivre();
    return;
  }

  fermerMiniJeuLivre();
  apprendreLivre(itemId);
}

function renduInventaire(u) {
  // Items list — only rebuild when dirty (avoids killing click events every 100ms)
  if (inventaireDirty) {
    renderItemsList();
    inventaireDirty = false;
  }

  renderInventoryTabs(u);
  actualiserVisibiliteInventaire();
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
    { id: "inv-res-cardboard",       label: "Cardboard Pieces",  category: "wood",  sprite: "img/resources/Cardboard Pieces_Final.png",  val: function() { return 0; }, simple: true, visible: u.cathering    },
    { id: "inv-res-cardboard-plank", label: "Cardboard Planks",  category: "wood",  sprite: "img/resources/Cardboard Plank_Final.png",   val: function() { return etat.cardboardPlanks;  }, visible: u.scierie      },
    { id: "inv-res-basic-wood",      label: "Basic Wood",        category: "wood",  sprite: "img/resources/Basic Wood_Final.png",        val: function() { return 0; }, simple: true, visible: u.basicWood    },
    { id: "inv-res-wood-plank",      label: "Basic Wood Planks", category: "wood",  sprite: "img/resources/Basic Wood Plank_Final.png",  val: function() { return etat.basicWoodPlanks;  }, visible: u.basicSawmill },
    { id: "inv-res-catnip",          label: "Catnip",            category: "food",  sprite: "img/resources/Catnip_Final.png",            val: function() { return 0; }, simple: true, visible: u.grasscat     },
    { id: "inv-res-salads",          label: "Catnip Salad",       category: "food",  sprite: "img/resources/Catnip Salad_Final.png",      val: function() { return etat.salads;           }, visible: u.catchen      },
    { id: "inv-res-anchovy",         label: "Anchovy",           category: "food",  sprite: "img/resources/Anchovy_Final.png",           val: function() { return 0; }, simple: true, visible: u.anchovy      },
    { id: "inv-res-grilled-anchovy", label: "Grilled Anchovy",   category: "food",  sprite: "img/resources/Grilled Anchovy_Final.png",   val: function() { return etat.grilledAnchovy;   }, visible: u.grilledAnchovy },
    { id: "inv-res-human-leftovers",   label: "Human Leftovers",  category: "food",  sprite: "img/resources/Human Leftovers_Final.png",    val: function() { return etat.humanLeftovers;    }, visible: etat.humanLeftovers > 0    },
    { id: "inv-res-human-workers-food", label: "Workers Food",    category: "food",  sprite: "img/resources/Human Workers Food_Final.png", val: function() { return etat.humanWorkersFood;  }, visible: etat.humanWorkersFood > 0  },
    { id: "inv-res-canned-cat-food",   label: "Canned Cat Food", category: "training", sprite: "img/resources/Canned Cat Food_Final.png",   val: function() { return etat.cannedCatFood;     }, visible: etat.cannedCatFood > 0     },
    { id: "inv-res-pebbles",         label: "Pebbles",           category: "stone", sprite: "img/resources/Pebbles_Final.png",           val: function() { return 0; }, simple: true, visible: u.pebblecat    },
    { id: "inv-res-pebble-brick",    label: "Pebble Bricks",     category: "stone", sprite: "img/resources/Pebble Brick_Final.png",      val: function() { return etat.pebbleBricks;     }, visible: u.brickfact    },
    { id: "inv-res-rocks",           label: "Rocks",             category: "stone", sprite: "img/resources/Rock_Final.png",              val: function() { return 0; }, simple: true, visible: u.rockcat      },
    { id: "inv-res-rock-brick",      label: "Rock Bricks",       category: "stone", sprite: "img/resources/Rock Brick_Final.png",        val: function() { return etat.rockBricks;       }, visible: u.rockfact     },
    // metal: add here when metal resources are implemented
  ];
}

function renderInventoryTabs(u) {
  const tabsEl = document.getElementById("inv-res-tabs");
  if (!tabsEl) return;

  const allVisible = buildRessourcesList(u).filter(function(r) { return r.visible; });
  const itemIds = etat.itemsAcquis.filter(function(itemId) { return !!ITEMS[itemId]; });
  const hasBooks = itemIds.some(function(itemId) { return ITEMS[itemId].type !== "unique"; });
  const hasUnique = itemIds.some(function(itemId) { return ITEMS[itemId].type === "unique"; });
  const availableCats = RES_CATEGORIES.filter(function(cat) {
    return allVisible.some(function(r) { return r.category === cat.id; });
  });
  const availableTabs = [{ id: "all", label: "All" }];
  if (hasBooks) availableTabs.push({ id: "books", label: "Books" });
  if (hasUnique) availableTabs.push({ id: "unique", label: "Unique" });
  availableCats.forEach(function(cat) { availableTabs.push(cat); });

  const validFilter = availableTabs.some(function(tab) { return tab.id === resCategorieFiltree; });
  if (!validFilter) resCategorieFiltree = "all";

  const tabsKey = availableTabs.map(function(tab) { return tab.id; }).join(",") + "|" + resCategorieFiltree;
  if (tabsEl.dataset.tabsKey === tabsKey) return;
  tabsEl.dataset.tabsKey = tabsKey;

  if (availableTabs.length <= 1) {
    tabsEl.innerHTML = "";
    delete tabsEl.dataset.hasTabs;
    return;
  }

  let tabsHtml = '<div class="inv-res-tabs" role="group" aria-label="Inventory categories">';
  availableTabs.forEach(function(tab) {
    const actif = resCategorieFiltree === tab.id;
    tabsHtml += '<button class="inv-res-tab' + (actif ? " inv-res-tab-actif" : "") + '" aria-pressed="' + (actif ? "true" : "false") + '" onclick="filtrerResources(\'' + tab.id + '\')">' + retirerEmojisInterface(tab.label) + '</button>';
  });
  tabsHtml += '</div>';
  tabsEl.innerHTML = tabsHtml;
  tabsEl.dataset.hasTabs = "true";
}

function actualiserVisibiliteInventaire() {
  const afficheItems = resCategorieFiltree === "all" || resCategorieFiltree === "books" || resCategorieFiltree === "unique";
  const afficheResources = resCategorieFiltree !== "books" && resCategorieFiltree !== "unique";
  const itemsSection = document.getElementById("section-items");
  const resourcesSection = document.getElementById("section-inv-resources");
  if (itemsSection) {
    itemsSection.style.display = afficheItems ? "" : "none";
    itemsSection.setAttribute("aria-hidden", afficheItems ? "false" : "true");
  }
  if (resourcesSection) {
    resourcesSection.style.display = afficheResources ? "" : "none";
    resourcesSection.setAttribute("aria-hidden", afficheResources ? "false" : "true");
  }
}

function renderResourcesSection(u) {
  const resEl  = document.getElementById("inv-resources");
  if (!resEl) return;

  const ressources = buildRessourcesList(u);
  const allVisible = ressources.filter(function(r) { return r.visible; });

  // Rebuild when visible set or active filter changes
  const visibleKey = allVisible.map(function(r) { return r.id; }).join(",") + "|" + resCategorieFiltree;
  if (resEl.dataset.visibleKey !== visibleKey) {
    resEl.dataset.visibleKey = visibleKey;

    if (allVisible.length === 0) {
      resEl.innerHTML = etatVideHtml("No resources yet", "Unlock Work and assign a cat to begin gathering materials.");
      return;
    }

    const availableCats = RES_CATEGORIES.filter(function(cat) {
      return allVisible.some(function(r) { return r.category === cat.id; });
    });
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
        if (!r.simple) resHtml += '<span class="inv-res-qty" id="' + r.id + '-qty"></span>';
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
    if (r.simple) return;
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

  function carteItemHtml(itemId) {
    const item   = ITEMS[itemId];
    if (!item) return "";
    const appris = etat.itemsAppris.includes(itemId);
    const etudie = etat.itemsEtudies.includes(itemId);
    const actif  = itemSelectionne === itemId;
    let html = '';

    html += '<div id="inv-item-card-' + itemId + '" class="inv-item-carte' + (actif ? " inv-item-actif" : "") +
            '" data-item-id="' + itemId + '"' + attributsActivationClavier((actif ? "Hide " : "Show ") + item.nom + " details") +
            ' aria-expanded="' + (actif ? "true" : "false") + '" aria-controls="inv-item-detail-' + itemId + '" onclick="selectionnerItem(\'' + itemId + '\')">';
    html += '<span class="inv-item-emoji">' + item.emoji + '</span>';
    html += '<div class="inv-item-entete">';
    html += '<span class="inv-item-nom">' + item.nom + '</span>';
    if (appris) html += '<span class="inv-item-tag">' + CHECK_ICON + ' Learned</span>';
    else if (etudie) html += '<span class="inv-item-tag inv-item-tag-studied">Studied</span>';
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
        const actionLabel = item.learningGame ? "Studying" : "Learning";
        html += '<div class="inv-action-row">';
        html += '<div id="inv-learning-label" class="inv-learning-label">' + actionLabel + '... ' + remaining + 's</div>';
        html += '<div class="inv-learning-barre"><div id="inv-learning-progres" class="inv-learning-progres" style="width:' + pct + '%"></div></div>';
        html += '</div>';
      } else if (etudie && item.learningGame) {
        html += '<div class="inv-action-row">';
        html += '<button class="btn-inv-action" onclick="actionItem(\'' + itemId + '\',\'learn\');event.stopPropagation()">Learn</button>';
        html += '</div>';
      } else if (item.actions && item.actions.length > 0) {
        item.actions.forEach(function(action) {
          html += '<div class="inv-action-row">';
          html += '<button id="inv-item-action-' + itemId + '-' + action.id + '" class="btn-inv-action"' +
                  ' onclick="actionItem(\'' + itemId + '\',\'' + action.id + '\');event.stopPropagation()">';
          html += action.label;
          html += '</button>';
          html += '</div>';
        });
      }
      html += '</div>';
    }
    return html;
  }

  function carteUniqueItemHtml(itemId) {
    const item = ITEMS[itemId];
    if (!item) return "";
    return '<div id="inv-item-card-' + itemId + '" class="inv-unique-carte" data-unique-item-id="' + itemId + '"' +
      attributsActivationClavier("Show details for " + item.nom) +
      ' aria-expanded="false" aria-controls="inv-res-popup" onmouseenter="if(matchMedia(\'(hover:hover)\').matches)showUniqueItemPopup(this)" onmouseleave="if(matchMedia(\'(hover:hover)\').matches)hideResPopup()" onclick="toggleUniqueItemPopup(this,event)">' +
      '<span class="inv-unique-icone">' + item.emoji + '</span>' +
      '<span class="inv-unique-nom">' + item.nom + '</span>' +
      '</div>';
  }

  const itemIdsConnus = etat.itemsAcquis.filter(function(itemId) { return !!ITEMS[itemId]; });
  const uniqueIds = itemIdsConnus.filter(function(itemId) { return ITEMS[itemId].type === "unique"; });
  const bookIds = itemIdsConnus.filter(function(itemId) { return ITEMS[itemId].type !== "unique"; });
  const afficheBooks = resCategorieFiltree === "all" || resCategorieFiltree === "books";
  const afficheUnique = resCategorieFiltree === "all" || resCategorieFiltree === "unique";
  let html = "";
  if (afficheBooks) {
    html += '<div class="inv-items-section-titre">BOOKS</div>';
    html += bookIds.length > 0 ? bookIds.map(carteItemHtml).join("") : '<p class="inv-vide inv-items-section-vide">No books yet.</p>';
  }
  if (afficheUnique) {
    html += '<div class="inv-items-section-titre">UNIQUE ITEMS</div>';
    html += uniqueIds.length > 0
      ? '<div class="inv-unique-grille">' + uniqueIds.map(carteUniqueItemHtml).join("") + '</div>'
      : '<p class="inv-vide inv-items-section-vide">No unique items yet.</p>';
  }
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
let tcTrainingOuvert       = false;
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
        html = '<p class="jc-modal-vide">No cat with the required job.</p>';
      } else {
        eligibles.forEach(function(idx) {
          const k = etat.kittiesData[idx];
          const m = METIERS[k.metier];
          const bonus = managerSpeedMultiplier(k, famille).toFixed(2);
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
    if (titreEl) titreEl.textContent = "🎓 Select a cat to specialize";
    const avecMetier = etat.kittiesData.reduce(function(acc, k, i) {
      if (k.metier !== null) acc.push(i);
      return acc;
    }, []);
    if (avecMetier.length === 0) {
      html = '<p class="jc-modal-vide">No cats have a job yet.</p>';
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
  jouerSonAffectation();
  fermerModalJC();
  jcDirty = true;
  renduJobCenter(unlocks());
}

function selectionnerTrainingCat(kittyIndex) {
  const kitty = etat.kittiesData[kittyIndex];
  if (!kitty || !kitty.metier || !METIERS[kitty.metier]) return;
  tcSpecKittySelectionne = kittyIndex;
  _tcKey = null;
  renduTrainingCenter();
}

function selectionnerKittySpec(kittyIndex) {
  selectionnerTrainingCat(kittyIndex);
  jouerSonAffectation();
  fermerModalJC();
}

function forcerKittyFormation(kittyIndex) {
  retirerKittyDeSesRoles(kittyIndex);
  selectionnerKittyFormation(kittyIndex);
}

function selectionnerMetierJC(metierId) {
  if (!explorateurPresent() && metierId !== "explorator") return;
  jcMetierSelectionne = jcMetierSelectionne === metierId ? null : metierId;
  jcDirty = true;
}

function lancerFormation() {
  if (etat.formationEnCours) return;
  if (jcFormationKittySelectionne === null || !jcMetierSelectionne) return;
  if (!explorateurPresent() && jcMetierSelectionne !== "explorator") return;
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
      if (!storyEstVue("storyExploratorVue")) {
        preparerStoryExplorator(kittyIndex);
        marquerStoryVue("storyExploratorVue");
        afficherModal("ecran-story-explorator");
        renduStories();
      }
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
  jouerSonAffectation();
  fermerModalJC();
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

// Pulls a kitty out of whatever worker slot or manager role it currently holds, then assigns it
// to the new target — used by the "Force" button on busy kitties in the selection modals.
function retirerKittyDeSesRoles(kittyIdx) {
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
    slots.forEach(function(slot) {
      // A recipe's cycle belongs to the slot, not to the Cat assigned to it.
      // Moving a Cat away therefore leaves the selected recipe, gathered input
      // and current phase ready for the next Cat. Only changing/clearing the
      // recipe itself should discard that progress.
      if (slot.kittyIndex === kittyIdx) slot.kittyIndex = null;
    });
  });
  Object.keys(etat.managers).forEach(function(f) {
    if (etat.managers[f] === kittyIdx) etat.managers[f] = null;
  });
}

function forcerWorkerRecette(kittyIdx, familyId, slotIdx) {
  retirerKittyDeSesRoles(kittyIdx);
  const slot = slotRecette(familyId, slotIdx);
  if (!slot || !slot.recipeId) return;
  slot.kittyIndex = kittyIdx;
  jouerSonAffectation();
  fermerModalWorker();
  jcDirty = true;
  verifierObjectifs(); sauvegarder(); rendu();
}

function forcerManager(famille, kittyIdx) {
  retirerKittyDeSesRoles(kittyIdx);
  etat.managers[famille] = kittyIdx;
  jouerSonAffectation();
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
    : etat.jobCenterConstruit;
  if (!debloque) {
    if (famille === "houses") {
      ecrireStyle(el, "display", "none");
      return;
    }
    ecrireStyle(el, "display", "flex");
    if (el.dataset.slotState !== "locked") {
      el.dataset.slotState = "locked";
      el.innerHTML = '<span class="manager-slot-locked">Available after building the Job Center</span>';
    }
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
  const newState = kitty ? "filled:" + managerIdx + ":" + managerSpeedMultiplier(kitty, famille).toFixed(2) + ":" + managerSphereStateKey(famille) : "empty";
  if (currentState === newState) return;
  el.dataset.slotState = newState;

  if (kitty) {
    const tierIdx = kitty.tier || 0;
    const m = METIERS[kitty.metier];
    const bonusTxt = m ? '<span class="manager-speed-line"><span class="bonus-var">×' + managerSpeedMultiplier(kitty, famille).toFixed(2) + '</span> ' + (m.bonusLabel || "production speed") + '</span>' + managerPerksHtml(famille, null, famille === "houses") : '';
    el.innerHTML = '<div class="manager-slot-filled">'
      + '<div class="manager-cercle kitty-photo-tier-' + tierIdx + '">' + kittyIconHtml(kitty) + '</div>'
      + '<div class="manager-info">'
      +   '<span class="manager-kitty-nom">' + kitty.nom + '</span>'
      +   '<span class="manager-bonus-txt">' + bonusTxt + '</span>'
      + '</div>'
      + '<button class="manager-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty.nom) + ' as ' + echapperAttributHtml(famille) + ' manager" onclick="retirerManager(\'' + famille + '\');event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button>'
      + '</div>';
  } else {
    el.innerHTML = '<button class="manager-slot-btn" aria-label="Assign a ' + echapperAttributHtml(famille) + ' manager" onclick="ouvrirModalJC(\'manager\',\'' + famille + '\')">+ Manager</button>';
  }
}

// Recipe selection keeps the chosen recipe in the slot. Changing it only
// discards that slot's private inputs and current cycle.
let recipeModalOuvert = null; // { familyId, slotIdx }
let travailConfirmationEnAttente = null;

function afficherDialogueRecette() {
  if (!recipeModalOuvert) return;
  ouvrirDialogueModal("recipe-modal", {
    dismissible: true,
    fermer: fermerModalRecette,
    focusSelector: ".recipe-modal-choice",
    returnFocusSelector: "#recipe-slot-" + recipeModalOuvert.familyId + "-" + recipeModalOuvert.slotIdx + " .work-recipe-selected"
  });
}

function ouvrirModalRecette(familyId, slotIdx) {
  recipeModalOuvert = { familyId: familyId, slotIdx: slotIdx };
  renduModalRecette();
  afficherDialogueRecette();
}

function fermerModalRecette() {
  recipeModalOuvert = null;
  fermerDialogueModal("recipe-modal");
}

function renduModalRecette() {
  const conteneur = domParId("recipe-modal-list");
  if (!conteneur || !recipeModalOuvert) return;
  const familyId = recipeModalOuvert.familyId;
  const slot = slotRecette(familyId, recipeModalOuvert.slotIdx);
  const choices = recettesDisponiblesFamille(familyId, unlocks());
  ecrireTexte(domParId("recipe-modal-title"), "Choose a " + WORK_FAMILIES[familyId].label + " recipe");
  let html = choices.map(function(pair) {
    const selected = slot && slot.recipeId === pair.recipeId;
    const cost = quantiteInputEffective(pair, pair.inputs[0]);
    return '<button type="button" class="recipe-modal-choice' + (selected ? ' is-selected' : '') + '" onclick="selectionnerRecette(\'' + pair.recipeId + '\')"' + (selected ? ' aria-current="true"' : '') + '>'
      + '<span class="work-tier-badge work-tier-badge-tier-' + pair.tier + '">Tier ' + pair.tier + '</span>'
      + '<span class="recipe-modal-formula"><span><img src="' + pair.rawIcon + '" alt=""><strong>' + libelleNombreDecimal(cost, 1) + ' ' + pair.rawLabel + '</strong></span><b>→</b><span><img src="' + pair.procIcon + '" alt=""><strong>' + pair.procLabel + '</strong></span></span>'
      + '<small>The assigned Cat gathers the input, then processes the result.</small></button>';
  }).join("");
  if (slot && slot.recipeId) html += '<button type="button" class="recipe-modal-clear" onclick="retirerRecetteSelectionnee()">Clear this recipe slot</button>';
  conteneur.innerHTML = html || '<p class="worker-modal-vide">No recipe available in this family yet.</p>';
}

function ouvrirConfirmationTravail(titre, message, action, libelleAction) {
  const recetteSuspendue = !!recipeModalOuvert;
  travailConfirmationEnAttente = { action: action, restaurerRecette: recetteSuspendue };
  ecrireTexte(domParId("work-confirm-title"), titre);
  ecrireTexte(domParId("work-confirm-copy"), message);
  ecrireTexte(domParId("work-confirm-accept"), libelleAction || "Continue");
  // Avoid stacking two aria-modal dialogs. Some mobile browsers leave the
  // first dialog's overlay above the confirmation and swallow every tap.
  if (recetteSuspendue) fermerDialogueModal("recipe-modal");
  ouvrirDialogueModal("work-confirm-modal", {
    dismissible: true,
    fermer: annulerConfirmationTravail,
    focusSelector: "#work-confirm-cancel"
  });
}

function annulerConfirmationTravail() {
  const confirmation = travailConfirmationEnAttente;
  travailConfirmationEnAttente = null;
  fermerDialogueModal("work-confirm-modal");
  if (confirmation && confirmation.restaurerRecette && recipeModalOuvert) {
    requestAnimationFrame(afficherDialogueRecette);
  }
}

function confirmerActionTravail() {
  const confirmation = travailConfirmationEnAttente;
  travailConfirmationEnAttente = null;
  fermerDialogueModal("work-confirm-modal");
  if (confirmation && typeof confirmation.action === "function") confirmation.action();
}

function selectionnerRecette(recipeId) {
  if (!recipeModalOuvert) return;
  const familyId = recipeModalOuvert.familyId;
  const slotIdx = recipeModalOuvert.slotIdx;
  const slot = slotRecette(familyId, slotIdx);
  const pair = paireRecette(recipeId);
  if (!slot || !pair || pair.family !== familyId) return;
  if (slot.recipeId === recipeId) { fermerModalRecette(); return; }
  if (slot.recipeId && slot.kittyIndex !== null) {
    ouvrirConfirmationTravail(
      "Change recipe?",
      "Changing this recipe will discard its gathered input and current progress.",
      function() { appliquerSelectionRecette(familyId, slotIdx, recipeId); },
      "Change recipe"
    );
    return;
  }
  appliquerSelectionRecette(familyId, slotIdx, recipeId);
}

function appliquerSelectionRecette(familyId, slotIdx, recipeId) {
  const slot = slotRecette(familyId, slotIdx);
  const pair = paireRecette(recipeId);
  if (!slot || !pair || pair.family !== familyId) return;
  if (slot.recipeId === recipeId) { fermerModalRecette(); return; }
  const proposeWorker = slot.kittyIndex === null;
  viderProgressionRecette(slot);
  slot.recipeId = recipeId;
  fermerModalRecette();
  verifierObjectifs(); sauvegarder(); rendu();
  // A newly chosen recipe is not useful until a Cat is assigned. Keep the
  // existing selection flow for occupied slots, but chain directly to the
  // Cat picker when this slot had no Cat yet.
  if (proposeWorker) ouvrirModalWorkerRecette(familyId, slotIdx);
}

function retirerRecetteSelectionnee() {
  if (!recipeModalOuvert) return;
  const slot = slotRecette(recipeModalOuvert.familyId, recipeModalOuvert.slotIdx);
  if (!slot) return;
  if (slot.kittyIndex !== null) {
    ouvrirConfirmationTravail(
      "Clear recipe slot?",
      "Clearing this slot removes its Cat and discards all gathered input and progress.",
      retirerRecetteSelectionneeConfirme,
      "Clear slot"
    );
    return;
  }
  retirerRecetteSelectionneeConfirme();
}

function retirerRecetteSelectionneeConfirme() {
  if (!recipeModalOuvert) return;
  const slot = slotRecette(recipeModalOuvert.familyId, recipeModalOuvert.slotIdx);
  if (!slot) return;
  reinitialiserProgressionRecette(slot, true);
  fermerModalRecette();
  sauvegarder(); rendu();
}

// ── Recipe Cat selection modal ───────────────────────────────
let workerModalOuvert = null; // { familyId, slotIdx }

function ouvrirModalWorkerRecette(familyId, slotIdx) {
  const slot = slotRecette(familyId, slotIdx);
  if (!slot || !slot.recipeId) { ouvrirModalRecette(familyId, slotIdx); return; }
  workerModalOuvert = { familyId: familyId, slotIdx: slotIdx };
  renduModalWorker();
  ouvrirDialogueModal("worker-modal", {
    dismissible: true,
    fermer: fermerModalWorker,
    focusSelector: ".worker-modal-kitty[data-clavier-clic]",
    returnFocusSelector: "#recipe-slot-" + familyId + "-" + slotIdx + " button"
  });
}

function fermerModalWorker() {
  workerModalOuvert = null;
  fermerDialogueModal("worker-modal");
}

function renduModalWorker() {
  const conteneur = document.getElementById("worker-modal-kitties");
  if (!conteneur || !workerModalOuvert) return;
  const slot = slotRecette(workerModalOuvert.familyId, workerModalOuvert.slotIdx);
  const pair = slot && paireRecette(slot.recipeId);
  if (!pair) return;
  ecrireTexte(domParId("worker-modal-titre"), "Assign a Cat to " + pair.procLabel);
  const bonusFn = function(niveau) { return Math.pow(1.1, niveau) * Math.pow(1.05, niveau); };
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
    html += '<div class="worker-modal-kitty' + (disabled ? ' worker-modal-kitty-disabled' : '') + '"' +
            (disabled ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + k.nom + " to this work slot") + ' onclick="assignerWorkerSlot(' + i + ')"') + '>';
    html += '<span class="worker-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="worker-modal-kitty-info">';
    html += '<span class="worker-modal-kitty-nom">' + k.nom + '</span>';
    if (status) html += '<span class="worker-modal-kitty-status">' + status + '</span>';
    html += '</div>';
    html += '<div class="worker-modal-kitty-bonus">';
    html += '<div class="worker-modal-kitty-bonus-ligne"><span>×' + Math.pow(1.1, k.niveau).toFixed(2) + ' <span class="worker-modal-kitty-bonus-label">Gather Prod</span></span><span>×' + Math.pow(1.05, k.niveau).toFixed(2) + ' <span class="worker-modal-kitty-bonus-label">Process Prod</span></span></div>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerWorkerRecette(' + i + ',\'' + workerModalOuvert.familyId + '\',' + workerModalOuvert.slotIdx + ');event.stopPropagation()">Force</button>';
    else html += '<div></div>';
    html += '</div>';
  });
  conteneur.innerHTML = html || '<p class="worker-modal-vide">No free cats available.</p>';
}

function assignerWorkerSlot(kittyIndex) {
  if (!workerModalOuvert) return;
  const slot = slotRecette(workerModalOuvert.familyId, workerModalOuvert.slotIdx);
  if (!slot || !slot.recipeId) return;
  // Replacing the Cat does not restart the recipe. Gathering/processing
  // progress and private inputs are reset only when the recipe changes or is
  // cleared (see appliquerSelectionRecette / retirerRecetteSelectionneeConfirme).
  slot.kittyIndex = kittyIndex;
  jouerSonAffectation();
  fermerModalWorker();
  verifierObjectifs(); sauvegarder(); rendu();
}

function retirerWorkerRecette(familyId, slotIdx) {
  const slot = slotRecette(familyId, slotIdx);
  if (!slot) return;
  // Keep the recipe cycle intact while the slot waits for another Cat.
  slot.kittyIndex = null;
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
        html += '<button class="jc-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty ? kitty.nom : "cat") + ' from job training" onclick="jcFormationKittySelectionne=null;jcDirty=true"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button>';
        html += '</div>';
      } else {
        html += '<div class="jc-slot-empty" data-jc-modal-trigger="formation"' + attributsActivationClavier("Select an unassigned cat for job training") + ' onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-plus">+</span>';
        html += '<span class="jc-slot-label">Select an unassigned cat</span>';
        html += '</div>';
      }

      // Job selection
      html += '<div class="jc-metiers">';
      const premierExploratorRequis = !explorateurPresent();
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
        const verrouille = premierExploratorRequis && m.id !== "explorator";
        html += '<button class="jc-metier-btn' + (sel ? ' jc-metier-actif' : '') + (recommande ? ' jc-metier-recommande' : '') + '"';
        if (pris || verrouille) {
          html += ' disabled title="' + (pris ? 'Already trained' : 'Train an Explorator first') + '"';
        } else {
          html += ' onclick="selectionnerMetierJC(\'' + m.id + '\')"';
        }
        html += '>' + m.emoji + ' ' + m.nom + (pris ? ' ✓' : '') + (recommande && !pris ? ' ⭐' : '') + '</button>';
      });
      html += '</div>';

      const peutLancer = jcFormationKittySelectionne !== null && jcMetierSelectionne !== null &&
        (!premierExploratorRequis || jcMetierSelectionne === "explorator");
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
  if (!sequenceEstPrete()) return;
  marquerSequencePrete();
  if (etat.chatons < 3) ouvrirMiniJeuCatch();
  else ouvrirMiniJeuRecruit();
});

function terminerSequence() {
  const etaitRecruit = etat.chatons >= 3;
  etat.sequenceEnCours = false;
  const visage = assurerVisageProchainChat();
  etat.chatons        += 1;
  etat.clicCount      += 1;
  const nom = nomProchainChat();
  etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 1.5, catchTs: Date.now(), visage: visage, jobNiveau: 0 });
  etat.prochainVisageChaton = null;
  jouerSonMiaulement();
  if (!etaitRecruit) afficherNotification("🐱 " + nom + " joined the gang!");
  ajouterLog("event", nom + (etaitRecruit ? " recruited!" : " caught!"));
  demarrerRechargeCatch();
  renduManagement();
  if (etat.chatons === 3) {
    afficherNotification("🐾 Work unlocked! Choose a Cardboard Planks recipe and assign a Cat.");
    ajouterLog("unlock", "Work unlocked. Cardboard Planks can now be produced from a recipe slot.");
    // Bird events are unavailable before Work exists. Start its persisted
    // first-event timer as soon as the Work tab becomes usable.
    planifierOiseau();
  }
  if (etat.chatons === 5) {
    afficherNotification("🌿 Food recipes unlocked! Catnip Salad can now be produced in Work.");
    ajouterLog("unlock", "Food recipes unlocked. Catnip Salad is now available in Work.");
  }
  if (etat.chatons === 6) {
    afficherNotification("🗺️ Explorations unlocked! Send your cats on expeditions.");
    ajouterLog("unlock", "Explorations unlocked — send cats on campaigns and scoutings.");
  }
  exploTabDirty = true;
  verifierStoryModals();
  sauvegarder(); rendu();
  return { nom: nom, visage: visage, recruit: etaitRecruit };
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
  if (etat.cathouses.length === 1 && !storyEstVue("story4Vue")) {
    marquerStoryVue("story4Vue");
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

function basculerAutoBuildWoodHouses(checked) {
  etat.autoBuildWoodHouses = !!checked && spherePerkLearned('builder-auto');
  sauvegarder();
  rendu();
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
  etat.managersDebloques = true;
  jcDirty = true;
  afficherNotification("🏫 Job Center built!");
  ajouterLog("event", "Job Center built — ready to assign jobs to cats.");
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

function definitionMoteurRecette(pair) {
  const input = pair.inputs && pair.inputs[0];
  return {
    rawRes: pair.rawRes,
    rawTotalKey: pair.rawTotalKey,
    procTotalKey: pair.procTotalKey,
    rawSeconds: pair.rawCfg.secondesParUnite,
    rawQuantity: input && Number.isFinite(input.baseQuantity)
      ? input.baseQuantity
      : pair.procCfg[pair.procSecUnite] / pair.procCfg[pair.procSecRaw],
    processingSeconds: pair.procCfg[pair.procSecUnite],
    outputRes: pair.procRes
  };
}

function modificateursRecette(pair, kitty) {
  return {
    gatheringSpeed: multiplicateurFamille(pair.rawAction),
    gatheringProduction: multiplicateurProductionFamille(pair.rawAction),
    processingSpeed: multiplicateurFamille(pair.procMultAction),
    costMultiplier: multiplicateurCoutFamille(pair.procMultAction),
    basicProduction: kitty ? Math.pow(1.1, kitty.niveau) : 1,
    complexProduction: productionProcBonus(kitty),
    globalSpeed: gangLeaderBonus()
  };
}

function tickWorkRecipes(dt) {
  const resultats = {};
  RESOURCE_PAIRS.forEach(function(pair) { etat[pair.rawRes] = 0; });
  Object.keys(etat.workRecipeSlots || {}).forEach(function(family) {
    (etat.workRecipeSlots[family] || []).forEach(function(slot) {
      if (!slot || slot.kittyIndex === null || !slot.recipeId) return;
      const pair = RESOURCE_PAIRS.find(function(candidate) {
        return candidate.family === family && candidate.recipeId === slot.recipeId;
      });
      const kitty = etat.kittiesData[slot.kittyIndex];
      if (!pair || !kitty) return;
      const result = avancerRecetteSlot(etat, definitionMoteurRecette(pair), slot, dt, modificateursRecette(pair, kitty));
      if (!resultats[pair.recipeId]) {
        resultats[pair.recipeId] = { active: false, gathered: 0, produced: 0, completedCycles: 0, firstProducerIndex: null };
      }
      const aggregate = resultats[pair.recipeId];
      aggregate.active = aggregate.active || result.active;
      aggregate.gathered += result.gathered;
      aggregate.produced += result.produced;
      aggregate.completedCycles += result.completedCycles;
      if (aggregate.firstProducerIndex === null && result.firstProducerIndex !== null) {
        aggregate.firstProducerIndex = result.firstProducerIndex;
      }
    });
  });
  return resultats;
}

function tick() {
  // Cathouse reduction accumulation (speed-aware)
  if (etat.cathouses.length > 0) {
  }

  // Speed-up: advance timestamps so exploration timers consume real-time faster.
  // The catch/recruit sequence integrates its own effective speed segments in
  // actualiserProgressionSequence(), so it must not also be shifted here.
  if (vitesse > 1) {
    const avance = (vitesse - 1) * 100;
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
      const actionLabel = ITEMS[lc.itemId] && ITEMS[lc.itemId].learningGame ? "Studying" : "Learning";
      if (labelEl) labelEl.textContent = actionLabel + "... " + remaining + "s";
      if (progEl)  progEl.style.width  = pct + "%";
    }
  }

  // A completed cooldown stays ready until the player actively catches/recruits.
  marquerSequencePrete();

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
      var completedRuns = Math.floor((maintenant - sc.startTs) / 1000 / effectiveDuree);
      terminerScouting(scoutingId, completedRuns);
      scoutsDirty = true;
    }
  });
  if (scoutsDirty) sauvegarder();

  // Every assigned cat now runs a complete private Gathering then Processing cycle.
  const cardboardPlanksAvant = etat.cardboardPlanks;
  const cardboardPlanksTotalAvant = etat.cardboardPlanksTotalProduit;
  const resultatsRecettes = tickWorkRecipes(vitesse * TICK_DT * workBoostMult());
  if (cardboardPlanksTotalAvant < 10 && etat.cardboardPlanksTotalProduit >= 10 && !storyEstVue("storyBasicWoodVue")) {
    marquerStoryVue("storyBasicWoodVue");
    afficherModal("ecran-story-basic-wood");
    renduStories();
  }
  if (cardboardPlanksAvant < 1 && etat.cardboardPlanks >= 1) {
    afficherNotification("🏗️ Houses unlocked! Build your first Cardboard Box.");
    ajouterLog("unlock", "Houses unlocked. Build your first Cardboard Box.");
  }
  const resultatSalade = resultatsRecettes.salads;
  if (resultatSalade && resultatSalade.produced > 0 && !etat.premiereSaladeFaite) {
    etat.premiereSaladeFaite = true;
    const cookIndex = resultatSalade.firstProducerIndex;
    const cookName = etat.kittiesData[cookIndex] ? etat.kittiesData[cookIndex].nom : "a Cat";
    const el1 = document.getElementById("story-salad-cook-name");
    const el2 = document.getElementById("story-salad-cook-name-2");
    const tag = document.getElementById("story-salad-cook-tag");
    if (el1) el1.textContent = cookName;
    if (el2) el2.textContent = cookName;
    if (tag) tag.textContent = cookName;
    marquerStoryVue("storySaladVue");
    afficherModal("ecran-story-salad");
    renduStories();
  }

  if (autoBuildWoodHousesIfNeeded() > 0) {
    verifierObjectifs();
    sauvegarder();
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

// Offline progression is deliberately centralised here so the balance can be
// tuned later without changing each individual timer. The cap applies to
// real time away from the game; only the configured ratio is simulated.
const VITESSE_HORS_LIGNE  = 0.1;
const MAX_AFK_SECONDS     = 10 * 60 * 60;
const ABSENCE_MIN_MS      = 60000; // ignore gaps shorter than 1 minute

function tempsSimuleHorsLigne(ecouleReelMs) {
  const secondesReelles = Math.min(
    MAX_AFK_SECONDS,
    Math.max(0, Number(ecouleReelMs) || 0) / 1000
  );
  return secondesReelles * VITESSE_HORS_LIGNE;
}

// Timers use wall-clock timestamps while the game is open. During an AFK
// period, move every active timer forward by the discarded part of the gap;
// the remaining elapsed time is therefore exactly the reduced simulated time.
function appliquerDecalageTimersHorsLigne(decalageMs) {
  if (!Number.isFinite(decalageMs) || decalageMs === 0) return;
  etat.exploEnCours.forEach(function(explo) { explo.startTs += decalageMs; });
  if (etat.exploZoneEnCours) etat.exploZoneEnCours.startTs += decalageMs;
  Object.values(etat.scoutingsEnCours || {}).forEach(function(sc) {
    if (sc) sc.startTs += decalageMs;
  });
  if (etat.formationEnCours) etat.formationEnCours.startTs += decalageMs;
  if (etat.learningEnCours) etat.learningEnCours.startTs += decalageMs;
}

// The catch/recruit sequence has segmented speed bonuses, so advance it in
// the same chunks as Work. This lets an auto-built house change only the
// remaining simulated time, just like it does during normal play.
function simulerSequenceHorsLigne(dt) {
  if (!etat.sequenceEnCours || !(dt > 0)) return;
  const duree = Math.max(0, Number(etat.sequenceDuree) || 0);
  const vitesseSegment = Number.isFinite(etat.sequenceVitesseDerniere) && etat.sequenceVitesseDerniere > 0
    ? etat.sequenceVitesseDerniere
    : vitesseSequenceEffective();
  const progress = Number.isFinite(etat.sequenceProgressBrute) ? etat.sequenceProgressBrute : 0;
  etat.sequenceProgressBrute = Math.min(duree, Math.max(0, progress) + dt * vitesseSegment);
  etat.sequenceVitesseDerniere = vitesseSequenceEffective();
}

// One simulated step of gathering/processing, no notifications/logs (used for offline catch-up)
function simulerTickHorsLigne(dt) {
  const resultatsRecettes = tickWorkRecipes(dt);
  autoBuildWoodHousesIfNeeded();
  if (resultatsRecettes.salads && resultatsRecettes.salads.produced > 0) {
    etat.premiereSaladeFaite = true;
  }
}

// Applies offline progress since the last save. Returns a summary object, or null if nothing to report.
function appliquerProgressionHorsLigne() {
  const maintenant   = Date.now();
  const dernierTimestamp = Number.isFinite(etat.dernierTimestamp) ? etat.dernierTimestamp : maintenant;
  const ecouleReelMs = Math.max(0, maintenant - dernierTimestamp);
  if (ecouleReelMs < ABSENCE_MIN_MS) {
    etat.dernierTimestamp = maintenant;
    return null;
  }

  const avant = {
    cardboardPlanks: etat.cardboardPlanks,
    basicWoodPlanks: etat.basicWoodPlanks,
    pebbleBricks: etat.pebbleBricks,
    rockBricks: etat.rockBricks,
    salads: etat.salads,
    grilledAnchovy: etat.grilledAnchovy
  };

  const dtSimTotal = tempsSimuleHorsLigne(ecouleReelMs);
  const ecouleReelPrisEnCompteMs = Math.min(ecouleReelMs, MAX_AFK_SECONDS * 1000);
  const decalageMs = ecouleReelPrisEnCompteMs - (dtSimTotal * 1000);

  // Work is advanced directly through its shared engine. All other systems
  // retain their own timestamps, so shift them before checking completions.
  appliquerDecalageTimersHorsLigne(decalageMs);
  // Include the small interval between the last sequence update and the save
  // at full active speed, then apply the reduced AFK interval in chunks.
  if (etat.sequenceEnCours) {
    const sauvegardeTs = Number(etat.dernierTimestamp) || maintenant;
    actualiserProgressionSequence(sauvegardeTs);
    etat.sequenceDerniereMajTs = sauvegardeTs;
    etat.sequenceVitesseDerniere = vitesseSequenceEffective();
  }
  const nbChunks    = Math.min(2000, Math.max(1, Math.ceil(dtSimTotal)));
  const tailleChunk = dtSimTotal / nbChunks;
  for (let i = 0; i < nbChunks; i++) {
    simulerTickHorsLigne(tailleChunk);
    simulerSequenceHorsLigne(tailleChunk);
  }
  if (etat.sequenceEnCours) etat.sequenceDerniereMajTs = maintenant;

  // Catch/Recruit uses the same reduced simulated time as every other timer.
  // Returning players only find the action ready: a cat is never granted automatically while offline.
  if (etat.sequenceEnCours && tempsRestantSequence() <= 0) etat.sequenceEnCours = false;

  // Resolve every timer that became complete during the simulated period.
  // These functions freeze mission power at launch and keep their normal
  // reward-pending behavior; only the elapsed time is reduced while AFK.
  const maintenantApresDecalage = Date.now();
  etat.exploEnCours = etat.exploEnCours.filter(function(explo) {
    if ((maintenantApresDecalage - explo.startTs) / 1000 >= explo.duree) {
      terminerExplo(explo);
      return false;
    }
    return true;
  });
  if (etat.exploZoneEnCours
      && (maintenantApresDecalage - etat.exploZoneEnCours.startTs) / 1000 >= etat.exploZoneEnCours.duree) {
    terminerExploZone();
  }
  Object.keys(etat.scoutingsEnCours || {}).forEach(function(scoutingId) {
    const sc = etat.scoutingsEnCours[scoutingId];
    const def = CONFIG.scoutings[scoutingId];
    const duree = sc && sc.duree !== undefined ? sc.duree : (def ? def.duree : 120);
    if (!sc || !def || duree <= 0) return;
    const runs = Math.floor(Math.max(0, (maintenantApresDecalage - sc.startTs) / 1000) / duree);
    if (runs > 0) terminerScouting(scoutingId, runs);
  });
  if (etat.learningEnCours
      && maintenantApresDecalage - etat.learningEnCours.startTs >= etat.learningEnCours.duree) {
    terminerApprentissage(etat.learningEnCours.itemId);
  }
  if (etat.formationEnCours
      && (maintenantApresDecalage - etat.formationEnCours.startTs) / 1000 >= etat.formationEnCours.duree) {
    terminerFormation();
  }

  etat.dernierTimestamp = maintenant;
  verifierObjectifs();
  sauvegarder();

  return {
    dureeReelleSec: ecouleReelMs / 1000,
    dureeSimuleeSec: dtSimTotal,
    cardboardPlanks: etat.cardboardPlanks - avant.cardboardPlanks,
    basicWoodPlanks: etat.basicWoodPlanks - avant.basicWoodPlanks,
    pebbleBricks:    etat.pebbleBricks   - avant.pebbleBricks,
    rockBricks:      etat.rockBricks     - avant.rockBricks,
    salads:          etat.salads         - avant.salads,
    grilledAnchovy:  etat.grilledAnchovy - avant.grilledAnchovy,
    kittyAttrape:    null
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
  ligne("⚙ Game time applied", formaterTemps(resume.dureeSimuleeSec));

  const ressources = [
    ["📋 Cardboard Planks", resume.cardboardPlanks],
    ["🪵 Basic Wood Planks", resume.basicWoodPlanks],
    ["🪨 Pebble Bricks",    resume.pebbleBricks],
    ["🧱 Rock Bricks",      resume.rockBricks],
    ["🥗 Catnip Salad",      resume.salads],
    ["🐟 Grilled Anchovy",  resume.grilledAnchovy]
  ];
  let produit = false;
  ressources.forEach(function(r) {
    if (r[1] > 0) { ligne(r[0], "+" + formaterNombre(r[1])); produit = true; }
  });
  if (!produit) ligne("🐾 Production", "Nothing produced");

  if (resume.kittyAttrape) {
    ligne("🐱 New cat", resume.kittyAttrape + " joined the gang!");
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
  "ecran-story-basic-wood": { type: "icon",      src: "img/resources/Basic Wood_Final.png?v=0.0029", alt: "A stack of sturdy Basic Wood logs." },
  "ecran-story-5":      { type: "icon",         src: "img/Cat faces/Bernardo.png", alt: "Portrait of Bernardo." },
  "ecran-story-6a":     { type: "icon",         src: "img/resources/Books_Final.png", alt: "A mysterious book found during scouting." },
  "ecran-story-6b":     { type: "illustration", src: "img/Story scenes/Story 6b.png", alt: "Bernardo studies charts and diagrams in an open book." },
  "ecran-story-salad":  { type: "icon",         src: "img/resources/Catnip Salad_Final.png", alt: "A freshly prepared Catnip Salad." },
  "ecran-story-seminar":{ type: "icon",         src: "img/resources/Books_Final.png", alt: "A corporate seminar booklet." },
  "ecran-story-explorator": { type: "icon",      src: "img/Cat faces/Bernardo.png", alt: "Portrait of the gang's first Explorator." },
  "ecran-story-bird":   { type: "illustration", src: "img/Story scenes/Bernardo caught bird.png?v=0.0029", alt: "Bernardo leaps toward a bird perched on a tree branch." },
};

const STORIES = [
  { id: "ecran-intro",    nom: "Introduction",    flag: "introVue" },
  { id: "ecran-story-1",  nom: "Bernardo's plan begins", flag: "story1Vue" },
  { id: "ecran-story-2",  nom: "Mochi joins the gang", flag: "story2Vue" },
  { id: "ecran-story-3",  nom: "The adventure begins",  flag: "story3Vue" },
  { id: "ecran-story-4",  nom: "Our first creation",    flag: "story4Vue" },
  { id: "ecran-story-basic-wood", nom: "Beyond Cardboard", flag: "storyBasicWoodVue" },
  { id: "ecran-story-5",  nom: "Gang on the rise",      flag: "story5Vue" },
  { id: "ecran-story-6a", nom: "What's that thing?",    flag: "story6aVue" },
  { id: "ecran-story-6b", nom: "A job for everyone",    flag: "story6bVue" },
  { id: "ecran-story-salad", nom: "Chef's kiss", flag: "storySaladVue" },
  { id: "ecran-story-seminar", nom: "Everybody loves seminars, right?", flag: "storySeminarVue" },
  { id: "ecran-story-explorator", nom: "A New Horizon", flag: "storyExploratorVue" },
  { id: "ecran-story-bird",    nom: "The bird",                         flag: "storyBirdVue" }
];

function storyEstVue(flag) {
  return Array.isArray(etat.storiesVues) && etat.storiesVues.includes(flag);
}

function marquerStoryVue(flag) {
  if (!Array.isArray(etat.storiesVues)) etat.storiesVues = [];
  if (etat.storiesVues.includes(flag)) return false;
  etat.storiesVues.push(flag);
  sauvegarder();
  return true;
}

function renduStories() {
  const conteneur = document.getElementById("stories-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  let affichees = 0;
  STORIES.forEach(function(story) {
    if (!storyEstVue(story.flag)) return;
    if (story.id === "ecran-story-explorator") preparerStoryExplorator();
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

function fermerStoryAdventure() {
  fermerModal("ecran-story-3");
  if (storyEstVue("story3TransitionVue")) return;
  marquerStoryVue("story3TransitionVue");
  ouvrirDialogueModal("recruiting-transition-modal", {
    focusSelector: ".recruiting-transition-action",
    returnFocusSelector: "#bouton-sequence"
  });
}

function validerStoryJob() {
  fermerModal("ecran-story-6b");
  ouvrirDialogueModal("gang-leader-unlock-modal", {
    focusSelector: ".gang-leader-unlock-action"
  });
}

function allerVoirJobBernardo() {
  fermerDialogueModal("gang-leader-unlock-modal");
  const bernardoIndex = etat.kittiesData.findIndex(function(k) { return k.nom === "Bernardo"; });
  if (bernardoIndex < 0) return;

  kittySelectionnee = bernardoIndex;
  detailKittyMobileOuvert = true;
  changerOnglet("gang");
  renduManagement();

  setTimeout(function() {
    const job = document.getElementById("detail-job");
    if (!job) return;
    job.scrollIntoView({ behavior: "smooth", block: "center" });
    job.classList.remove("objectif-cible-highlight");
    void job.offsetWidth;
    job.classList.add("objectif-cible-highlight");
    setTimeout(function() { job.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function preparerStoryExplorator(kittyIndex) {
  let index = Number.isInteger(kittyIndex) ? kittyIndex : -1;
  if (!etat.kittiesData[index] || etat.kittiesData[index].metier !== "explorator") {
    index = etat.kittiesData.findIndex(function(k) { return k.metier === "explorator"; });
  }
  if (index < 0) return;
  const kitty = etat.kittiesData[index];
  document.querySelectorAll("#ecran-story-explorator .story-explorator-speaker").forEach(function(el) {
    el.textContent = kitty.nom;
  });
  ecrireTexte(
    document.getElementById("story-explorator-unlock-copy"),
    kitty.nom + " is now an Explorator. You can explore the neighborhood using the map in the Explorations tab."
  );
  const asset = STORY_ASSETS["ecran-story-explorator"];
  asset.src = kitty.visage || CAT_FACES.bernardo;
  asset.alt = "Portrait of " + kitty.nom + ", the gang's first Explorator.";
}

function ouvrirCarteExplorationsDepuisStory(storyId) {
  fermerModal(storyId);
  carteDirty = true;
  exploTabDirty = true;
  changerOnglet("explorations");
  setTimeout(function() {
    const carte = document.getElementById("section-explo-map");
    if (!carte) return;
    carte.scrollIntoView({ behavior: "smooth", block: "start" });
    carte.classList.remove("objectif-cible-highlight");
    void carte.offsetWidth;
    carte.classList.add("objectif-cible-highlight");
    setTimeout(function() { carte.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function ouvrirCarteDepuisStoryExplorator() {
  ouvrirCarteExplorationsDepuisStory("ecran-story-explorator");
}

function ouvrirCarteDepuisStoryGangRise() {
  ouvrirCarteExplorationsDepuisStory("ecran-story-5");
}

function allerEtudierSchoolGuideDepuisStory() {
  fermerModal("ecran-story-6a");
  resCategorieFiltree = "books";
  itemSelectionne = "schoolGuide";
  inventaireDirty = true;
  changerOnglet("inventaire");
  setTimeout(function() {
    const cible = document.getElementById("inv-item-action-schoolGuide-study") ||
      document.getElementById("inv-item-card-schoolGuide");
    if (!cible) return;
    cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function fermerStoryBird() {
  fermerModal("ecran-story-bird");
  if (!_birdMiniJeuPending) return;
  _birdMiniJeuPending = false;
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "none";
  demarrerBirdMiniJeu();
}
function afficherModal(id) {
  if (id === "ecran-story-explorator") preparerStoryExplorator();
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
  if (etat.chatons === 1 && !storyEstVue("story1Vue")) {
    marquerStoryVue("story1Vue");
    afficherModal("ecran-story-1");
    renduStories();
  }
  if (etat.chatons === 2 && !storyEstVue("story2Vue")) {
    marquerStoryVue("story2Vue");
    afficherModal("ecran-story-2");
    renduStories();
  }
  if (etat.chatons === 3 && !storyEstVue("story3Vue")) {
    marquerStoryVue("story3Vue");
    afficherModal("ecran-story-3");
    renduStories();
  }
  if (etat.chatons === 6 && !storyEstVue("story5Vue")) {
    marquerStoryVue("story5Vue");
    afficherModal("ecran-story-5");
    renduStories();
  }
}

document.getElementById("bouton-intro").addEventListener("click", function() {
  fermerModal("ecran-intro");
  marquerStoryVue("introVue");
  if (etat.chatons === 0 && !etat.sequenceEnCours) {
    demarrerRechargeCatch();
    sauvegarder();
    rendu();
  }
  renduStories();
});


// ════════════════════════════════════════════════════════════
// 13. UI CONTROLS  (tabs · speed · panel toggles)
// ════════════════════════════════════════════════════════════

function changerOnglet(id) {
  if (!IDS_ONGLETS.includes(id)) return;
  if (id === "logs" && etat.chatons < 3) return;
  const estMobile = window.matchMedia("(max-width: 768px)").matches;
  // On mobile, the Gang tab is the list landing view. Returning to it from
  // another tab must not reopen the kitty profile that was previously open.
  if (id === "gang" && estMobile) {
    detailKittyMobileOuvert = false;
  }
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
  if (id === "gang") renduManagement();
  if (estMobile) {
    // Every tab opens from its own top. The guide is collapsed into its fixed
    // dock so it cannot retain an overlay or move the new section off-screen.
    definirObjectifsReduits(true);
    const contenuPrincipal = document.getElementById("contenu-principal");
    const panneauActif = document.getElementById("contenu-" + id);
    if (contenuPrincipal) contenuPrincipal.scrollTop = 0;
    if (panneauActif) panneauActif.scrollTop = 0;
  }
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

const SEUIL_COMPACTAGE_ENTETE_MOBILE = 48;
const SEUIL_DECOMPACTAGE_ENTETE_MOBILE = 8;

function gererDensiteMobileAuScroll() {
  if (window.innerWidth > 768) {
    document.body.classList.remove("interface-compacte");
    return;
  }
  const contenuPrincipal = document.getElementById("contenu-principal");
  const position = contenuPrincipal ? contenuPrincipal.scrollTop : window.scrollY;
  const estCompacte = document.body.classList.contains("interface-compacte");

  // Deux seuils evitent la boucle produite quand le bandeau raccourci modifie
  // instantanement la position de scroll autour du point de bascule.
  if (!estCompacte && position > SEUIL_COMPACTAGE_ENTETE_MOBILE) {
    document.body.classList.add("interface-compacte");
  } else if (estCompacte && position < SEUIL_DECOMPACTAGE_ENTETE_MOBILE) {
    document.body.classList.remove("interface-compacte");
  }
}

document.addEventListener("scroll", gererDensiteMobileAuScroll, true);
function actualiserHauteurTopBar() {
  const topBar = document.getElementById("top-bar");
  if (!topBar) return;
  document.documentElement.style.setProperty("--hauteur-top-bar", topBar.getBoundingClientRect().height + "px");
}
const topBarPourResize = document.getElementById("top-bar");
if (topBarPourResize && typeof ResizeObserver === "function") {
  new ResizeObserver(actualiserHauteurTopBar).observe(topBarPourResize);
}
actualiserHauteurTopBar();
window.addEventListener("resize", function() {
  if (window.innerWidth > 768) document.body.classList.remove("interface-compacte");
  actualiserHauteurTopBar();
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
  const titre   = document.getElementById("objectifs-titre");
  panneau.classList.toggle("reduit", reduit);
  btn.textContent = reduit ? "+" : "−";
  btn.setAttribute("aria-expanded", reduit ? "false" : "true");
  btn.title = reduit ? "Expand guide" : "Collapse guide";
  titre.setAttribute("aria-expanded", reduit ? "false" : "true");
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
// 13b. FIRST THREE CATS CATCH MINI-GAME
// ════════════════════════════════════════════════════════════

var _catCatchMiniJeuRaf = null;
var _catCatchCursorPct = 0;
var _catCatchDir = 1;
var _catCatchActif = false;
var _catCatchNom = "";
const CAT_CATCH_SPEEDS = [60, 80, 100];

function arreterAnimationMiniJeuCatch() {
  if (!_catCatchMiniJeuRaf) return;
  cancelAnimationFrame(_catCatchMiniJeuRaf);
  _catCatchMiniJeuRaf = null;
}

function ouvrirMiniJeuCatch() {
  if (etat.chatons >= 3 || !sequenceEstPrete() || _catCatchActif) return;
  _catCatchNom = nomProchainChat();
  const vitesseCatch = CAT_CATCH_SPEEDS[etat.chatons] || 100;
  const visage = assurerVisageProchainChat();
  const titre = document.getElementById("cat-catch-minijeu-titre");
  const icone = document.getElementById("cat-catch-target-icone");
  if (titre) titre.textContent = "Catch " + _catCatchNom + "!";
  if (icone) {
    icone.src = visage;
    icone.alt = _catCatchNom + " target";
  }

  _catCatchActif = true;
  renduSequence();
  _catCatchCursorPct = 0;
  _catCatchDir = 1;
  ouvrirDialogueModal("cat-catch-minijeu", {
    dismissible: true,
    fermer: echouerMiniJeuCatch,
    focusSelector: ".cat-catch-action",
    returnFocusSelector: "#bouton-sequence"
  });

  var last = performance.now();
  function frame(ts) {
    if (!_catCatchActif) return;
    var dt = (ts - last) / 1000;
    last = ts;
    _catCatchCursorPct += _catCatchDir * vitesseCatch * dt;
    if (_catCatchCursorPct >= 100) { _catCatchCursorPct = 100; _catCatchDir = -1; }
    if (_catCatchCursorPct <= 0)   { _catCatchCursorPct = 0;   _catCatchDir =  1; }
    var cursor = document.getElementById("cat-catch-cursor");
    if (cursor) cursor.style.left = _catCatchCursorPct + "%";
    _catCatchMiniJeuRaf = requestAnimationFrame(frame);
  }
  _catCatchMiniJeuRaf = requestAnimationFrame(frame);
}

function echouerMiniJeuCatch() {
  if (!_catCatchActif) return;
  _catCatchActif = false;
  arreterAnimationMiniJeuCatch();
  fermerDialogueModal("cat-catch-minijeu");
  demarrerRechargeCatch();
  afficherNotification("" + _catCatchNom + " got away. Try again when the timer is ready!");
  ajouterLog("event", "Failed to catch " + _catCatchNom + ".");
  sauvegarder();
  rendu();
}

function clickerCatCatch() {
  if (!_catCatchActif) return;
  const success = _catCatchCursorPct >= 40 && _catCatchCursorPct <= 60;
  if (!success) {
    echouerMiniJeuCatch();
    return;
  }
  _catCatchActif = false;
  arreterAnimationMiniJeuCatch();
  fermerDialogueModal("cat-catch-minijeu");
  terminerSequence();
}

document.addEventListener("keydown", function(e) {
  if (e.key !== " " && e.key !== "Enter") return;
  var modal = document.getElementById("cat-catch-minijeu");
  if (!modal || modal.style.display === "none") return;
  if (e.target && e.target.closest && e.target.closest("button, input, select, textarea, [role=button]")) return;
  e.preventDefault();
  clickerCatCatch();
});

// ════════════════════════════════════════════════════════════
// 13c. RECRUITMENT MINI-GAME: PURRSUASION
// ════════════════════════════════════════════════════════════

const RECRUIT_GAME_DURATION = 10;
const RECRUIT_GOOD_MIN = 42;
const RECRUIT_GOOD_MAX = 68;
const RECRUIT_HOLD_TARGET = 2;
const RECRUIT_RISE_SPEED = 42;
const RECRUIT_FALL_SPEED = 20;
const RECRUIT_DIALOGUES = [
  {
    visitor: "I'm alone... and I haven't eaten in days.",
    bernardo: "We have plenty of food. Join us, and you'll never go hungry again."
  },
  {
    visitor: "I don't have anywhere safe to sleep.",
    bernardo: "We have shelter, warm beds, and cats watching each other's backs."
  },
  {
    visitor: "The humans keep chasing me away.",
    bernardo: "Then you need protection. Nobody messes with a member of my gang."
  },
  {
    visitor: "I don't trust gangs.",
    bernardo: "Good instinct. This isn't just a gang - it's an organization. With snacks."
  },
  {
    visitor: "What exactly do I get if I join?",
    bernardo: "Food, shelter, purpose, and the privilege of exceptional leadership."
  },
  {
    visitor: "I've always managed perfectly well on my own.",
    bernardo: "So did I. Then I realized being alone means nobody brings you dinner."
  },
  {
    visitor: "Why should I follow you?",
    bernardo: "Because I have a plan, a camp, and several cats who already pretend to agree with me."
  },
  {
    visitor: "I'm not much of a fighter.",
    bernardo: "Perfect. We need builders, cooks, explorers... Everyone has a place here."
  },
  {
    visitor: "The humans own everything around here.",
    bernardo: "Not for long. We're building something of our own, one cardboard box at a time."
  },
  {
    visitor: "This sounds suspiciously like work.",
    bernardo: "It is - but organized work, with meals, shelter, and promotion opportunities."
  }
];
var _recruitMiniJeuRaf = null;
var _recruitMiniJeuActif = false;
var _recruitPitchActif = false;
var _recruitTimerDemarre = false;
var _recruitTrust = 18;
var _recruitGoodTime = 0;
var _recruitTimeLeft = RECRUIT_GAME_DURATION;
var _recruitNom = "";
var _recruitDifficulty = 1;
var _recruitSpeedMultiplier = 1;
var _recruitDialoguePrecedent = -1;

function choisirDialogueRecruit() {
  var index = Math.floor(Math.random() * RECRUIT_DIALOGUES.length);
  if (index === _recruitDialoguePrecedent && RECRUIT_DIALOGUES.length > 1) {
    index = (index + 1 + Math.floor(Math.random() * (RECRUIT_DIALOGUES.length - 1))) % RECRUIT_DIALOGUES.length;
  }
  _recruitDialoguePrecedent = index;
  return RECRUIT_DIALOGUES[index];
}

function arreterAnimationMiniJeuRecruit() {
  if (!_recruitMiniJeuRaf) return;
  cancelAnimationFrame(_recruitMiniJeuRaf);
  _recruitMiniJeuRaf = null;
}

function mettreAJourMiniJeuRecruit() {
  const track = document.getElementById("recruit-trust-track");
  const fill = document.getElementById("recruit-trust-fill");
  const marker = document.getElementById("recruit-trust-marker");
  const time = document.getElementById("recruit-time-left");
  const progress = document.getElementById("recruit-hold-progress");
  const pct = Math.max(0, Math.min(100, _recruitTrust));
  if (fill) fill.style.width = pct.toFixed(2) + "%";
  if (marker) marker.style.left = pct.toFixed(2) + "%";
  if (track) track.setAttribute("aria-valuenow", Math.round(pct));
  if (time) time.textContent = Math.max(0, _recruitTimeLeft).toFixed(1) + "s";
  if (progress) progress.textContent = "Keep their interest: " + Math.min(RECRUIT_HOLD_TARGET, _recruitGoodTime).toFixed(1) + " / " + RECRUIT_HOLD_TARGET.toFixed(1) + "s";
}

function definirPitchRecruitActif(actif) {
  _recruitPitchActif = Boolean(actif) && _recruitMiniJeuActif;
  const bouton = document.getElementById("recruit-pitch-btn");
  if (bouton) bouton.classList.toggle("pitch-active", _recruitPitchActif);
}

function demarrerTimerMiniJeuRecruit() {
  if (_recruitTimerDemarre || !_recruitMiniJeuActif) return;
  _recruitTimerDemarre = true;
  const bouton = document.getElementById("recruit-pitch-btn");
  if (bouton) bouton.textContent = "HOLD TO MAKE YOUR PITCH";
  var last = performance.now();
  function frame(ts) {
    if (!_recruitMiniJeuActif) return;
    var dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    _recruitTimeLeft -= dt;
    const vitesse = (_recruitPitchActif ? RECRUIT_RISE_SPEED : -RECRUIT_FALL_SPEED) * _recruitSpeedMultiplier;
    _recruitTrust += vitesse * dt;
    _recruitTrust = Math.max(0, _recruitTrust);
    if (_recruitTrust >= RECRUIT_GOOD_MIN && _recruitTrust < RECRUIT_GOOD_MAX) _recruitGoodTime += dt;
    mettreAJourMiniJeuRecruit();

    if (_recruitTrust >= RECRUIT_GOOD_MAX) {
      echouerMiniJeuRecruit("too-pushy");
      return;
    }
    if (_recruitGoodTime >= RECRUIT_HOLD_TARGET) {
      reussirMiniJeuRecruit();
      return;
    }
    if (_recruitTimeLeft <= 0) {
      echouerMiniJeuRecruit("timeout");
      return;
    }
    _recruitMiniJeuRaf = requestAnimationFrame(frame);
  }
  _recruitMiniJeuRaf = requestAnimationFrame(frame);
}

function commencerPitchRecruit(event) {
  if (event) event.preventDefault();
  demarrerTimerMiniJeuRecruit();
  definirPitchRecruitActif(true);
}

function arreterPitchRecruit(event) {
  if (event) event.preventDefault();
  definirPitchRecruitActif(false);
}

function gererClavierPitchRecruit(event, actif) {
  if (event.key !== " " && event.key !== "Enter") return;
  event.preventDefault();
  definirPitchRecruitActif(actif);
}

function ouvrirMiniJeuRecruit() {
  if (etat.chatons < 3 || !sequenceEstPrete() || _recruitMiniJeuActif) return;
  _recruitNom = nomProchainChat();
  const portrait = document.getElementById("recruit-target-portrait");
  const nom = document.getElementById("recruit-target-name");
  const visitorSpeech = document.getElementById("recruit-visitor-speech");
  const bernardoSpeech = document.getElementById("recruit-bernardo-speech");
  const dialogue = choisirDialogueRecruit();
  if (portrait) portrait.src = assurerVisageProchainChat();
  if (nom) nom.textContent = _recruitNom;
  if (visitorSpeech) {
    visitorSpeech.textContent = dialogue.visitor;
    visitorSpeech.setAttribute("aria-label", _recruitNom + " says: " + dialogue.visitor);
  }
  if (bernardoSpeech) {
    bernardoSpeech.textContent = dialogue.bernardo;
    bernardoSpeech.setAttribute("aria-label", "Bernardo says: " + dialogue.bernardo);
  }

  _recruitMiniJeuActif = true;
  renduSequence();
  _recruitPitchActif = false;
  _recruitTimerDemarre = false;
  _recruitTrust = 18;
  _recruitGoodTime = 0;
  _recruitTimeLeft = RECRUIT_GAME_DURATION;
  _recruitDifficulty = Math.max(1, etat.chatons - 2);
  _recruitSpeedMultiplier = 1 + (_recruitDifficulty - 1) * 0.1;
  const difficulty = document.getElementById("recruit-difficulty");
  const bouton = document.getElementById("recruit-pitch-btn");
  if (difficulty) difficulty.textContent = "Difficulty " + _recruitDifficulty + " · Cursor speed ×" + _recruitSpeedMultiplier.toFixed(2);
  if (bouton) bouton.textContent = "HOLD TO START YOUR PITCH";
  mettreAJourMiniJeuRecruit();
  ouvrirDialogueModal("recruit-minijeu", {
    dismissible: true,
    fermer: function() { echouerMiniJeuRecruit("closed"); },
    focusSelector: "#recruit-pitch-btn",
    returnFocusSelector: "#bouton-sequence"
  });

}

function echouerMiniJeuRecruit(raison) {
  if (!_recruitMiniJeuActif) return;
  _recruitMiniJeuActif = false;
  definirPitchRecruitActif(false);
  arreterAnimationMiniJeuRecruit();
  fermerDialogueModal("recruit-minijeu");
  const visage = assurerVisageProchainChat();
  demarrerRechargeCatch();
  ajouterLog("event", "Failed to recruit " + _recruitNom + ".");
  sauvegarder();
  rendu();
  ouvrirPopupRecruitResult(false, _recruitNom, visage);
}

function reussirMiniJeuRecruit() {
  if (!_recruitMiniJeuActif) return;
  _recruitMiniJeuActif = false;
  definirPitchRecruitActif(false);
  arreterAnimationMiniJeuRecruit();
  fermerDialogueModal("recruit-minijeu");
  const resultat = terminerSequence();
  ouvrirPopupRecruitResult(true, resultat.nom, resultat.visage);
}

function ouvrirPopupRecruitResult(reussi, nom, visage) {
  const card = document.getElementById("recruit-result-card");
  const title = document.getElementById("recruit-result-title");
  const portrait = document.getElementById("recruit-result-portrait");
  const badge = document.getElementById("recruit-result-badge");
  const message = document.getElementById("recruit-result-message");
  if (card) card.classList.toggle("recruit-result-failed", !reussi);
  if (title) title.textContent = reussi ? "Recruitment successful!" : "Recruitment failed";
  if (portrait) {
    portrait.src = visage;
    portrait.alt = nom + " portrait";
  }
  if (badge) {
    badge.src = reussi ? "img/interface/✅_Final.png?v=0.0026" : "img/interface/Red Cross_Final.png?v=0.0029";
    badge.alt = reussi ? "Success" : "Failed";
  }
  if (message) message.textContent = reussi
    ? nom + " is convinced and agrees to join the Gang!"
    : nom + " wasn't convinced. Try again later.";
  ouvrirDialogueModal("recruit-result-popup", {
    focusSelector: "#recruit-result-action",
    returnFocusSelector: "#bouton-sequence"
  });
}

function fermerPopupRecruitResult() {
  fermerDialogueModal("recruit-result-popup");
}

document.addEventListener("pointerup", function() { definirPitchRecruitActif(false); });
window.addEventListener("blur", function() { definirPitchRecruitActif(false); });
document.addEventListener("selectstart", function(event) {
  var target = event.target;
  if (target && target.closest && target.closest(".recruit-minijeu-carte")) event.preventDefault();
});

// ════════════════════════════════════════════════════════════
// 13d. BIRD MINI-GAME
// ════════════════════════════════════════════════════════════

var _birdTimerId        = null;
var _birdMiniJeuRaf     = null;
var _birdCursorPct      = 0;
var _birdDir            = 1;
var _birdMiniJeuPending = false;

function planifierOiseau() {
  if (!catheringDebloquee()) {
    if (_birdTimerId) clearTimeout(_birdTimerId);
    _birdTimerId = null;
    return;
  }
  if (_birdTimerId) clearTimeout(_birdTimerId);
  var premiere = !etat.birdPremiereReussie;
  var delai;
  if (premiere) {
    if (!Number.isFinite(etat.birdPremierSpawnTs) || etat.birdPremierSpawnTs <= 0) {
      etat.birdPremierSpawnTs = Date.now() + 5 * 60 * 1000;
      sauvegarder();
    }
    delai = Math.max(0, etat.birdPremierSpawnTs - Date.now());
  } else {
    delai = (Math.random() * 600 + 300) * 1000; // 5 à 15 min
  }
  _birdTimerId = setTimeout(montrerOiseau, delai);
}

function montrerOiseau() {
  if (!catheringDebloquee()) return;
  jouerSonAilesOiseau();
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "inline-flex";
  var dbg = document.getElementById("bird-debug-btn");
  if (dbg) dbg.style.display = "none";
}

function demarrerBirdMiniJeu() {
  var premiere = !etat.birdPremiereReussie;
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "none";
  _birdCursorPct = 0;
  _birdDir = 1;
  ouvrirDialogueModal("bird-minijeu", {
    focusSelector: ".bird-catch-btn",
    returnFocusSelector: "#bouton-sequence"
  });
  var miniPerk = !premiere && etat.spherePerks && etat.spherePerks['gl-mini'] === 'learned';
  var carte = document.querySelector('.bird-minijeu-carte');
  if (carte) {
    carte.classList.toggle('bird-premiere', premiere);
    carte.classList.toggle('bird-facile', !premiere && miniPerk);
  }
  var desc = document.getElementById("bird-minijeu-desc");
  if (desc) desc.textContent = premiere
    ? "Take your time. Click CATCH! when the cursor reaches the bird. You can try again if you miss."
    : "Click CATCH! when the cursor reaches the bird.";
  var speed = premiere ? 35 : (miniPerk ? 75 : 150);
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

function ouvrirBirdMiniJeu() {
  if (!catheringDebloquee()) return;
  if (!storyEstVue("storyBirdVue")) {
    marquerStoryVue("storyBirdVue");
    var birdBtn = document.getElementById("bird-btn");
    if (birdBtn) birdBtn.style.display = "none";
    _birdMiniJeuPending = true;
    afficherModal("ecran-story-bird");
    renduStories();
    return;
  }
  demarrerBirdMiniJeu();
}

function _apresMinijeuOiseau() {
  var dbg = document.getElementById("bird-debug-btn");
  if (dbg) dbg.style.display = DEV_MODE ? "inline-flex" : "none";
  planifierOiseau();
}

function clickerBird() {
  var premiere = !etat.birdPremiereReussie;
  var miniPerk = etat.spherePerks && etat.spherePerks['gl-mini'] === 'learned';
  var success = premiere
    ? (_birdCursorPct >= 20 && _birdCursorPct <= 80)
    : miniPerk
    ? (_birdCursorPct >= 38 && _birdCursorPct <= 62)
    : (_birdCursorPct >= 45 && _birdCursorPct <= 55);
  if (premiere && !success) {
    var desc = document.getElementById("bird-minijeu-desc");
    if (desc) desc.textContent = "Almost! The first lesson is forgiving. Try CATCH! again when the cursor is closer.";
    return;
  }
  if (_birdMiniJeuRaf) { cancelAnimationFrame(_birdMiniJeuRaf); _birdMiniJeuRaf = null; }
  fermerDialogueModal("bird-minijeu");
  if (success) {
    if (premiere) etat.birdPremiereReussie = true;
    etat.workBoostFinTs = Date.now() + 120000;
    ajouterLog("event", "Bernardo caught a bird, boosting worker production x10 for 2 minutes!");
    var successMessage = document.getElementById("bird-success-titre");
    if (successMessage) successMessage.textContent = premiere
      ? "Great catch! This mini-game boosts worker production for a short time. Other bird types may appear in the future, and it will be harder from now on."
      : "Well done, Bernardo! That graceful move has motivated the gang. They will work faster for a short time.";
    sauvegarder();
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
  if (!etat.birdPremiereReussie) return;
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
if (redemarrageMajeurRequis) {
  ouvrirDialogueModal("save-upgrade-modal", { focusSelector: "#save-upgrade-restart" });
} else if (!storyEstVue("introVue")) {
  afficherModal("ecran-intro");
}
rendu();
renduLogs();
renduStories();
renduObjectifs();
verifierObjectifs();
renduManagement();
if (!storyEstVue("storyExploratorVue")) {
  const exploratorExistant = etat.kittiesData.findIndex(function(k) { return k.metier === "explorator"; });
  if (exploratorExistant >= 0) {
    preparerStoryExplorator(exploratorExistant);
    marquerStoryVue("storyExploratorVue");
    afficherModal("ecran-story-explorator");
    renduStories();
  }
}
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

// Browsers block autoplay until the player interacts with the page. Start the
// loop on the first pointer or keyboard action, then keep its volume synced
// through Settings.
document.addEventListener("pointerdown", demarrerMusiqueAmbiante, { passive: true });
document.addEventListener("keydown", demarrerMusiqueAmbiante, { passive: true });
