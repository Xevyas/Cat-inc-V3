// ════════════════════════════════════════════════════════════
// 1. CONSTANTS & CONFIG
// ════════════════════════════════════════════════════════════

const CONFIG = {
  cathouse: {
    coutBase:            5,
    croissance:          3,
    reductionParSeconde: 1
  },
  realCathouse: {
    coutBase:            5,
    croissance:          3,
    reductionParSeconde: 5
  },
  woodcatting:      { secondesParUnite: 60 },
  basicWoodcatting: { secondesParUnite: 600 },
  grasscatting:     { secondesParUnite: 60 },
  pebblegathering: { deblocageA: 7,  secondesParUnite: 60 },
  sawmill: {
    deblocageA:           10,
    secondesParPlanche:   600,
    secondesParCardboard: 60
  },
  basicSawmill: {
    secondesParPlanche:   6000,
    secondesParBasicWood: 600
  },
  brickfactory: {
    deblocageA:        10,
    secondesParBrique: 600,
    secondesParPebble: 60
  },
  catchen: {
    deblocageA:        10,
    secondesParSalad:  600,
    secondesParCatnip: 60
  },
  fishcatting:     { secondesParUnite: 600 },
  grilledAnchovy: {
    secondesParRecette: 6000,
    secondesParAnchovy: 600
  },
  scoutings: {
    searchTrashAgain: {
      id:             "searchTrashAgain",
      nom:            "Search our trash again",
      description:    "Keep digging — there's always something new in the bins.",
      difficulte:     1,
      duree:          120,
      slots:          1,
      recompense:     "humanLeftovers",
      recompenseRange: [
        { qty: 1, weight: 70 },
        { qty: 2, weight: 20 },
        { qty: 3, weight: 10 }
      ],
      zone:           "D1",
      unlockCampaign: "checkTheTrash"
    },
    searchNeighborTrashAgain: {
      id:             "searchNeighborTrashAgain",
      nom:            "Search neighbor's trash again",
      description:    "The right neighbor keeps throwing good stuff away. Worth another look.",
      difficulte:     1,
      duree:          240,
      slots:          1,
      recompense:     "humanLeftovers",
      recompenseRange: [
        { qty: 1, weight: 70 },
        { qty: 2, weight: 20 },
        { qty: 3, weight: 10 }
      ],
      zone:           "E1",
      unlockCampaign: "searchNeighborTrash"
    }
  },
  campaigns: {
    checkTheTrash: {
      id:          "checkTheTrash",
      nom:         "Search our trash",
      description: "Dig through the bins at home. You never know what's there.",
      difficulte:  1,
      duree:       60,
      slots:       1,
      recompense:  "schoolGuide",
      zone:        "D1"
    },
    searchNeighborTrash: {
      id:          "searchNeighborTrash",
      nom:         "Search Neighbor's trash",
      description: "The right neighbor throws away more than they should. Time to investigate.",
      difficulte:  15,
      duree:       600,
      slots:       2,
      recompense:  "fishingGuide",
      zone:        "E1"
    }
  }
};

const ITEMS = {
  schoolGuide: {
    id:          "schoolGuide",
    nom:         "School Guide",
    emoji:       "📚",
    description: "A human guide to a few job orientations for kids. We may learn something from it.",
    actions: [
      { id: "learn", label: "Learn" }
    ]
  },
  fishingGuide: {
    id:          "fishingGuide",
    nom:         "Fishing Guide for Dummies",
    emoji:       "🎣",
    description: "A complete beginner's guide to feline fishing. Spoiler: you don't need a rod.",
    actions: [
      { id: "learn", label: "Learn (1h)" }
    ]
  }
};

const METIERS = {
  lumberjack:    { id: "lumberjack",   nom: "Lumberjack",  emoji: "🪓", famille: "wood",    familleNom: "Wood resource family",    duree: 3600 },
  carpenter:     { id: "carpenter",   nom: "Carpenter",    emoji: "🔨", famille: "sawmill", familleNom: "Sawmill resource family", duree: 3600 },
  farmer:        { id: "farmer",      nom: "Farmer",       emoji: "🌾", famille: "food",    familleNom: "Food resource family",    duree: 3600 },
  chef:          { id: "chef",        nom: "Chef",         emoji: "🍳", famille: "catchen",    familleNom: "Catchen resource family",    duree: 3600 },
  explorator:    { id: "explorator",  nom: "Explorator",   emoji: "🧭", famille: "exploration", familleNom: "Exploration family",         duree: 3600 },
  "gang-leader": { id: "gang-leader", nom: "Gang Leader",  emoji: "👑", famille: null,          familleNom: "any resource family",        duree: 0 }
};

const ZONES_CARTE = {
  "D1": { id: "D1", nom: "Home",           col: 3, row: 1, type: "home",     icone: "🏠", difficulte: 0,  duree: 0,   slots: 0 },
  "C1": { id: "C1", nom: "Left neighbor",  col: 2, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 120, slots: 2 },
  "E1": { id: "E1", nom: "Right neighbor", col: 4, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 120, slots: 2 },
  "D2": { id: "D2", nom: "Street",         col: 3, row: 2, type: "street",   icone: "🛣️", difficulte: 20, duree: 300, slots: 2 },
};

const TIERS_KITTIES = [
  "Kitten", "Great Kitten", "Cat", "Great Cat",
  "General Cat", "Emperor Cat", "Godly Cat"
];

const NOMS_KITTIES = [
  "Bernardo", "Mochi", "Luna", "Whiskers", "Felix",
  "Cléopatra", "Biscuit", "Cosmo", "Zelda", "Napoléon",
  "Duchess", "Rascal", "Aurora", "Chester", "Pumpkin"
];

const VITESSES = [1, 2, 5, 10, 50, 100];
const KITTY_ICON = '<img src="img/interface/Gang_Final.png" class="kitty-icon" alt="kitty">';

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
    id: "buildJobCenter", label: "Build the Job Center (10 Pebble Bricks + 10 Cardboard Planks)",
    labelHtml: 'Build the Job Center (10 <img class="obj-sprite" src="img/resources/Pebble Brick_Final.png" alt="Pebble Brick"> + 10 <img class="obj-sprite" src="img/resources/Cardboard Plank_Final.png" alt="Cardboard Plank">)',
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
    id: "buildRealCathouse", label: "Build a Cathouse to boost catch speed",
    visible:  function(e) { return e.basicWood >= 1 || e.cathouseCount > 0; },
    accompli: function(e) { return e.cathouseCount >= 1; }
  }
];


// ════════════════════════════════════════════════════════════
// 2. GAME STATE
// ════════════════════════════════════════════════════════════

const etat = {
  // Resources
  chatons:              0,
  cardboardPieces:            0,  cardboardPiecesTotalRecolte: 0,
  basicWood:            0,  basicWoodTotalRecolte: 0,
  catnip:               0,  catnipTotalRecolte:    0,
  pebbles:              0,  pebblesTotalRecolte:   0,
  cardboardPlanks:      0,
  basicWoodPlanks:      0,
  pebbleBricks:         0,
  salads:               0,
  anchovy:              0,  anchovyTotalRecolte:  0,
  grilledAnchovy:       0,
  humanLeftovers:       0,

  // Catch sequence
  sequenceEnCours:         false,
  sequenceDebutTs:         0,
  sequenceDuree:           0,
  clicCount:               0,
  reductionAuMomentDuClic: 0,

  // Processing blocked flags
  scieriBloquee:              false,
  basicSawmillBloquee:        false,
  brickBloquee:               false,
  catchenBloquee:             false,
  catchenAnchovyBloquee:      false,

  // Cathouse reduction accumulator (virtual seconds)
  reductionCumulee: 0,

  // Individual kitty worker slots per action: [{ kittyIndex: null|int, progress: 0..1 }]
  // progress 0→1 = one production cycle (one unit gathered / one output produced)
  workers: {
    woodcatting:      makeWorkerSlots(2),
    basicWoodcatting: makeWorkerSlots(2),
    grasscatting:     makeWorkerSlots(2),
    fishcatting:      makeWorkerSlots(2),
    pebblegathering:  makeWorkerSlots(2),
    sawmill:          makeWorkerSlots(2),
    basicSawmill:     makeWorkerSlots(2),
    brickfactory:     makeWorkerSlots(2),
    catchen:          makeWorkerSlots(2),
    grilledAnchovy:   makeWorkerSlots(2)
  },

  cathouses:     [],
  cathouseCount: 0,
  kittiesData:   [],   // { nom, metier, niveau, tier, catchTs }
  exploEnCours:        [],   // [{ id, kittyIndices, startTs, duree }]
  campaignsCompletees: [],
  itemsAcquis:         [],
  itemsAppris:         [],
  jobCenterDebloque:   false,
  jobCenterConstruit:  false,
  formationEnCours:    null,   // { kittyIndex, metier, startTs, duree }
  zonesExplorees:      ["D1"], // D1 (home) always starts explored
  exploZoneEnCours:    null,   // { zoneId, kittyIndices, startTs, duree }
  scoutingsEnCours:    {},     // { scoutingId: { kittyIndex, startTs } }
  managers:            { wood: null, food: null, sawmill: null, catchen: null },
  managersDebloques:   false,
  objectifsComplis: [],
  logs:          [],
  learningEnCours: null,   // { itemId, startTs, duree } in ms

  // Last real-world timestamp the game state was saved (for offline progress)
  dernierTimestamp: Date.now()
};


// ════════════════════════════════════════════════════════════
// 3. DERIVED VALUES & CALCULATIONS
// ════════════════════════════════════════════════════════════

function makeWorkerSlots(n) {
  var slots = [];
  for (var i = 0; i < n; i++) slots.push({ kittyIndex: null, progress: 0 });
  return slots;
}

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

function kittyIsOnZoneExplo(kittyIdx) {
  return !!(etat.exploZoneEnCours && etat.exploZoneEnCours.kittyIndices.includes(kittyIdx));
}

function kittyIsBusy(kittyIdx) {
  return kittyIsOnExpedition(kittyIdx) || kittyIsInWorkerSlot(kittyIdx) || kittyIsInTraining(kittyIdx) || kittyIsOnZoneExplo(kittyIdx) || kittyIsOnScouting(kittyIdx) || kittyIsInScoutingStaging(kittyIdx);
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

function kittyAllocationLabel(kittyIdx) {
  // Worker slot
  var ACTION_DISPLAY = { fishcatting: "Anchovy Fishing", grilledAnchovy: "Grilled Anchovy", woodcatting: "Woodcatting", basicWoodcatting: "Basic Woodcatting", grasscatting: "Grasscatting", pebblegathering: "Pebble Gathering", sawmill: "Sawmill", basicSawmill: "Basic Sawmill", brickfactory: "Pawsonry", catchen: "Catchen" };
  var workerFamily = null;
  Object.keys(etat.workers).forEach(function(action) {
    if (etat.workers[action].some(function(s) { return s.kittyIndex === kittyIdx; })) workerFamily = action;
  });
  if (workerFamily) {
    var label = ACTION_DISPLAY[workerFamily] || workerFamily.replace(/([A-Z])/g, " $1").replace(/^./, function(c) { return c.toUpperCase(); });
    return { text: label, cls: "kitty-statut-work" };
  }
  // Training
  if (etat.formationEnCours && etat.formationEnCours.kittyIndex === kittyIdx) {
    var jobNom = etat.formationEnCours.metierId && METIERS[etat.formationEnCours.metierId] ? METIERS[etat.formationEnCours.metierId].nom : "training";
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
  var qty = tirerRecompenseScouting(def.recompenseRange);
  var kNom = (etat.kittiesData[sc.kittyIndex] ? etat.kittiesData[sc.kittyIndex].nom : "Someone");
  if (def.recompense === "humanLeftovers") {
    etat.humanLeftovers += qty;
    afficherNotification(kNom + " found " + qty + " human leftover" + (qty > 1 ? "s" : "") + "!");
    ajouterLog("event", kNom + " found " + qty + " human leftover" + (qty > 1 ? "s" : "") + " in the trash.");
  }
  // Auto-restart with same kitty, preserving the same effective duration
  var isExplorator = etat.kittiesData[sc.kittyIndex] && etat.kittiesData[sc.kittyIndex].metier === "explorator";
  var restartDuree = isExplorator ? def.duree / 2 : def.duree;
  etat.scoutingsEnCours[scoutingId] = { kittyIndex: sc.kittyIndex, startTs: Date.now(), duree: restartDuree };
  exploTabDirty = true;
}

function assignerKittyScouting(scoutingId, kittyIndex) {
  var def = CONFIG.scoutings[scoutingId];
  var isExplorator = etat.kittiesData[kittyIndex] && etat.kittiesData[kittyIndex].metier === "explorator";
  var duree = def ? (isExplorator ? def.duree / 2 : def.duree) : 120;
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

function vitesseAttrapage() {
  return 1 + etat.cathouses.length + etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde;
}

// XP / leveling
const FOOD_XP = { salads: 1, grilledAnchovy: 10, humanLeftovers: 1 };

function xpPourNiveau(n) {
  return Math.max(n + 1, Math.ceil(Math.pow(n, 1.7)));
}

function productionParChaton(action) {
  return 1;
}

// 5% bonus per level, multiplicative — amplifies every job effect
function jobLevelMultiplier(kitty) {
  return Math.pow(1.05, kitty ? kitty.niveau : 0);
}

function multiplicateurFamille(action) {
  const mapFamille = {
    woodcatting: "wood", basicWoodcatting: "wood",
    grasscatting: "food", fishcatting: "food",
    sawmill: "sawmill",
    catchen: "catchen", grilledAnchovy: "catchen"
  };
  const metierParFamille = { wood: "lumberjack", food: "farmer", sawmill: "carpenter", catchen: "chef" };
  const famille = mapFamille[action];
  if (!famille) return 1;
  const managerIdx = etat.managers[famille];
  if (managerIdx === null || managerIdx === undefined) return 1;
  const kitty = etat.kittiesData[managerIdx];
  if (!kitty || (kitty.metier !== metierParFamille[famille] && kitty.metier !== "gang-leader")) return 1;
  return (kitty.managerMult || 2) * jobLevelMultiplier(kitty);
}

function dureeBrute()     { return 5 * Math.pow(3, etat.clicCount); }
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


// ════════════════════════════════════════════════════════════
// 4. UNLOCK CONDITIONS
// ════════════════════════════════════════════════════════════

function catheringDebloquee()       { return etat.chatons >= 3; }
function grasscattingDebloquee()    { return etat.chatons >= 5; }
function pebblegatheringDebloquee() { return etat.chatons >= CONFIG.pebblegathering.deblocageA; }
function basicWoodDebloquee()       { return etat.cardboardPlanks >= 10; }
function basicSawmillDebloquee()    { return etat.basicWoodTotalRecolte >= 1; }
function catHouseDebloquee()        { return etat.basicWood >= 1 || etat.cathouseCount > 0; }
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
function jobCenterDebloquee()       { return etat.jobCenterDebloque; }


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
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
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


// ════════════════════════════════════════════════════════════
// 6. SAVE / LOAD / RESET
// ════════════════════════════════════════════════════════════

function sauvegarder() {
  etat.dernierTimestamp = Date.now();
  localStorage.setItem("chatonClicker", JSON.stringify({
    dernierTimestamp:     etat.dernierTimestamp,
    chatons:                etat.chatons,
    cardboardPieces:              etat.cardboardPieces,         cardboardPiecesTotalRecolte: etat.cardboardPiecesTotalRecolte,
    basicWood:              etat.basicWood,         basicWoodTotalRecolte: etat.basicWoodTotalRecolte,
    catnip:                 etat.catnip,            catnipTotalRecolte:    etat.catnipTotalRecolte,
    pebbles:                etat.pebbles,           pebblesTotalRecolte:   etat.pebblesTotalRecolte,
    cardboardPlanks:        etat.cardboardPlanks,
    basicWoodPlanks:        etat.basicWoodPlanks,
    pebbleBricks:           etat.pebbleBricks,
    salads:                 etat.salads,
    anchovy:                etat.anchovy,             anchovyTotalRecolte:  etat.anchovyTotalRecolte,
    grilledAnchovy:         etat.grilledAnchovy,
    humanLeftovers:         etat.humanLeftovers,
    sequenceEnCours:         etat.sequenceEnCours,
    sequenceDebutTs:         etat.sequenceDebutTs,
    sequenceDuree:           etat.sequenceDuree,
    clicCount:               etat.clicCount,
    reductionAuMomentDuClic: etat.reductionAuMomentDuClic,
    scieriBloquee:              etat.scieriBloquee,
    basicSawmillBloquee:        etat.basicSawmillBloquee,
    brickBloquee:               etat.brickBloquee,
    catchenBloquee:             etat.catchenBloquee,
    catchenAnchovyBloquee:      etat.catchenAnchovyBloquee,
    reductionCumulee: etat.reductionCumulee,
    workers:       etat.workers,
    ameliorations: etat.ameliorations,
    cathouses:     etat.cathouses,
    cathouseCount: etat.cathouseCount,
    kittiesData:         etat.kittiesData,
    exploEnCours:        etat.exploEnCours,
    campaignsCompletees: etat.campaignsCompletees,
    itemsAcquis:         etat.itemsAcquis,
    itemsAppris:         etat.itemsAppris,
    learningEnCours:     etat.learningEnCours,
    jobCenterDebloque:   etat.jobCenterDebloque,
    jobCenterConstruit:  etat.jobCenterConstruit,
    formationEnCours:    etat.formationEnCours,
    zonesExplorees:      etat.zonesExplorees,
    exploZoneEnCours:    etat.exploZoneEnCours,
    scoutingsEnCours:    etat.scoutingsEnCours,
    managers:            etat.managers,
    managersDebloques:   etat.managersDebloques,
    objectifsComplis: etat.objectifsComplis,
    logs:          etat.logs
  }));
}

function charger() {
  const raw = localStorage.getItem("chatonClicker");
  if (!raw) return false;
  const d = JSON.parse(raw);

  etat.dernierTimestamp       = d.dernierTimestamp       || Date.now();
  etat.chatons                = d.chatons                || 0;
  // Migration: wood → cardboard
  etat.cardboardPieces              = d.cardboardPieces              !== undefined ? d.cardboardPieces              : d.cardboard              !== undefined ? d.cardboard              : (d.wood || 0);
  etat.cardboardPiecesTotalRecolte  = d.cardboardPiecesTotalRecolte  !== undefined ? d.cardboardPiecesTotalRecolte  : d.cardboardTotalRecolte  !== undefined ? d.cardboardTotalRecolte  : (d.woodTotalRecolte || 0);
  etat.basicWood              = d.basicWood              || 0;
  etat.basicWoodTotalRecolte  = d.basicWoodTotalRecolte  || 0;
  etat.catnip                 = d.catnip                 || 0;
  etat.catnipTotalRecolte     = d.catnipTotalRecolte     || 0;
  etat.pebbles                = d.pebbles                || 0;
  etat.pebblesTotalRecolte    = d.pebblesTotalRecolte    || 0;
  // Migration: planks → cardboardPlanks, bricks → pebbleBricks
  etat.cardboardPlanks        = d.cardboardPlanks        !== undefined ? d.cardboardPlanks        : (d.planks || 0);
  etat.basicWoodPlanks        = d.basicWoodPlanks        || 0;
  etat.pebbleBricks           = d.pebbleBricks           !== undefined ? d.pebbleBricks           : (d.bricks || 0);
  etat.salads                 = d.salads                 || 0;
  etat.anchovy                = d.anchovy                || 0;
  etat.anchovyTotalRecolte    = d.anchovyTotalRecolte    || 0;
  etat.grilledAnchovy         = d.grilledAnchovy         || 0;
  etat.humanLeftovers         = d.humanLeftovers         || 0;

  etat.sequenceEnCours         = d.sequenceEnCours         || false;
  etat.sequenceDebutTs         = d.sequenceDebutTs         || 0;
  etat.sequenceDuree           = d.sequenceDuree           || 0;
  etat.clicCount               = d.clicCount               || 0;
  etat.reductionAuMomentDuClic = d.reductionAuMomentDuClic || 0;

  etat.scieriBloquee        = d.scieriBloquee        || false;
  etat.basicSawmillBloquee  = d.basicSawmillBloquee  || false;
  etat.brickBloquee         = d.brickBloquee         || false;
  etat.catchenBloquee             = d.catchenBloquee             || false;
  etat.catchenAnchovyBloquee      = d.catchenAnchovyBloquee      || false;
  // Migration: compute reduction from old timestamp-based saves
  etat.reductionCumulee = d.reductionCumulee !== undefined
    ? d.reductionCumulee
    : (d.cathouses || []).reduce(function(total, ts) {
        return total + Math.floor((Date.now() - ts) / 1000);
      }, 0);

  // Load worker slots — migrate from old allocation-count format
  const allActions = ["woodcatting", "basicWoodcatting", "grasscatting", "fishcatting", "pebblegathering", "sawmill", "basicSawmill", "brickfactory", "catchen", "grilledAnchovy"];
  if (d.workers) {
    etat.workers = d.workers;
    allActions.forEach(function(a) {
      if (!etat.workers[a]) etat.workers[a] = makeWorkerSlots(2);
      while (etat.workers[a].length < 2) etat.workers[a].push({ kittyIndex: null, progress: 0 });
    });
  } else {
    // Old save: allocation was just a count — discard counts (can't know which kitties were assigned)
    etat.workers = {};
    allActions.forEach(function(a) { etat.workers[a] = makeWorkerSlots(2); });
  }

  etat.cathouses       = d.cathouses       || [];
  etat.cathouseCount   = d.cathouseCount   || 0;
  etat.exploEnCours        = d.exploEnCours        || [];
  etat.campaignsCompletees = d.campaignsCompletees || [];
  etat.itemsAcquis         = d.itemsAcquis         || [];
  etat.itemsAppris         = d.itemsAppris         || [];
  etat.learningEnCours     = d.learningEnCours     || null;
  etat.jobCenterDebloque   = d.jobCenterDebloque   || false;
  etat.jobCenterConstruit  = d.jobCenterConstruit  || false;
  etat.formationEnCours    = d.formationEnCours    || null;
  etat.zonesExplorees      = d.zonesExplorees      || ["D1"];
  if (!etat.zonesExplorees.includes("D1")) etat.zonesExplorees.push("D1");
  etat.exploZoneEnCours    = d.exploZoneEnCours    || null;
  etat.scoutingsEnCours    = d.scoutingsEnCours    || {};
  etat.managers            = d.managers            || { wood: null, food: null, sawmill: null, catchen: null };
  etat.managersDebloques   = d.managersDebloques   || false;
  // Migration: backfill manager keys added in later versions
  if (etat.managers.wood    === undefined) etat.managers.wood    = null;
  if (etat.managers.food    === undefined) etat.managers.food    = null;
  if (etat.managers.sawmill === undefined) etat.managers.sawmill = null;
  if (etat.managers.catchen === undefined) etat.managers.catchen = null;
  etat.objectifsComplis = d.objectifsComplis || [];
  etat.logs            = d.logs            || [];
  etat.kittiesData     = d.kittiesData     || [];

  // Migration: rename legacy French job IDs to English
  const jobIdMigration = { bucheron: "lumberjack", charpentier: "carpenter", fermier: "farmer", cuisinier: "chef" };
  etat.kittiesData.forEach(function(k) { if (k.metier && jobIdMigration[k.metier]) k.metier = jobIdMigration[k.metier]; });
  if (etat.formationEnCours && jobIdMigration[etat.formationEnCours.metier]) {
    etat.formationEnCours.metier = jobIdMigration[etat.formationEnCours.metier];
  }

  // Migration: backfill kittiesData if save predates the feature
  while (etat.kittiesData.length < etat.chatons) {
    const nom = NOMS_KITTIES[etat.kittiesData.length] || ("Kitty #" + (etat.kittiesData.length + 1));
    etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: null });
  }
  // Migration: add xp field and reset niveau to 0-based for existing kitties
  etat.kittiesData.forEach(function(k) {
    if (k.xp === undefined) k.xp = 0;
    if (k.niveau === undefined || k.niveau === 1) { k.niveau = 0; k.xp = 0; }
    if (k.managerMult === undefined) k.managerMult = 2;
  });
  // Migration: assign Gang Leader to Bernardo if Job Center already built
  if (etat.itemsAppris.includes("schoolGuide") || etat.jobCenterConstruit) assignerGangLeader();
  return true;
}

function reset() {
  if (!confirm("Start over from scratch?")) return;
  localStorage.removeItem("chatonClicker");
  localStorage.removeItem("introVue");
  localStorage.removeItem("story1Vue");
  localStorage.removeItem("story2Vue");
  localStorage.removeItem("story3Vue");
  localStorage.removeItem("story4Vue");
  Object.assign(etat, {
    chatons: 0, cardboardPieces: 0, cardboardPiecesTotalRecolte: 0,
    basicWood: 0, basicWoodTotalRecolte: 0,
    catnip: 0, catnipTotalRecolte: 0,
    pebbles: 0, pebblesTotalRecolte: 0,
    cardboardPlanks: 0, basicWoodPlanks: 0, pebbleBricks: 0, salads: 0,
    anchovy: 0, anchovyTotalRecolte: 0, grilledAnchovy: 0, humanLeftovers: 0,
    sequenceEnCours: false, sequenceDebutTs: 0, sequenceDuree: 0,
    clicCount: 0, reductionAuMomentDuClic: 0,
    scieriBloquee: false, basicSawmillBloquee: false, brickBloquee: false, catchenBloquee: false, catchenAnchovyBloquee: false, reductionCumulee: 0,
    workers: {
      woodcatting: makeWorkerSlots(2), basicWoodcatting: makeWorkerSlots(2),
      grasscatting: makeWorkerSlots(2), fishcatting: makeWorkerSlots(2),
      pebblegathering: makeWorkerSlots(2),
      sawmill: makeWorkerSlots(2), basicSawmill: makeWorkerSlots(2),
      brickfactory: makeWorkerSlots(2), catchen: makeWorkerSlots(2), grilledAnchovy: makeWorkerSlots(2)
    },
    cathouses: [], cathouseCount: 0, kittiesData: [],
    exploEnCours: [], campaignsCompletees: [],
    itemsAcquis: [], itemsAppris: [], jobCenterDebloque: false, jobCenterConstruit: false,
    formationEnCours: null, zonesExplorees: ["D1"], exploZoneEnCours: null, scoutingsEnCours: {},
    managers: { wood: null, food: null, sawmill: null, catchen: null }, managersDebloques: false,
    objectifsComplis: [], logs: [],
    learningEnCours: null,
    dernierTimestamp: Date.now()
  });
  rendu(); renduLogs(); renduObjectifs(); renduManagement();
}


// ════════════════════════════════════════════════════════════
// 7. NOTIFICATIONS & LOGS
// ════════════════════════════════════════════════════════════

function afficherNotification(message) {
  const el = document.createElement("div");
  el.textContent = message;
  el.className   = "notification";
  document.body.appendChild(el);
  setTimeout(function() { el.classList.add("visible"); }, 10);
  setTimeout(function() {
    el.classList.remove("visible");
    setTimeout(function() { el.remove(); }, 500);
  }, 3000);
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

const logFiltres = { dialogue: true, event: true, unlock: true };

function renduLogs() {
  const conteneur = document.getElementById("logs-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  etat.logs.forEach(function(entry) {
    if (!logFiltres[entry.type]) return;
    const el    = document.createElement("div");
    el.className = "log-entry log-" + entry.type;
    const heure = document.createElement("span");
    heure.className   = "log-heure";
    heure.textContent = entry.heure;
    const bloc  = document.createElement("span");
    bloc.className = "log-texte";
    const lignes = entry.lignes || (entry.texte ? [entry.texte] : []);
    lignes.forEach(function(ligne, i) {
      if (i > 0) bloc.appendChild(document.createElement("br"));
      bloc.appendChild(document.createTextNode(ligne));
    });
    el.appendChild(heure);
    el.appendChild(bloc);
    conteneur.appendChild(el);
  });
}

function toggleFiltreLogs(type) {
  logFiltres[type] = !logFiltres[type];
  const btn = document.getElementById("filtre-" + type);
  if (btn) btn.classList.toggle("filtre-inactif", !logFiltres[type]);
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
      ajouterLog("unlock", "🎯 Objective complete: " + obj.label);
      changed = true;
    }
  });
  if (changed) { renduObjectifs(); rendu(); sauvegarder(); }
}

function renduObjectifs() {
  const elActifs  = document.getElementById("objectifs-actifs");
  const elComplis = document.getElementById("objectifs-complis");
  const elSection = document.getElementById("section-complis");
  if (!elActifs || !elComplis) return;

  const actifs  = [];
  const complis = [];
  OBJECTIFS.forEach(function(obj) {
    const done = etat.objectifsComplis.indexOf(obj.id) !== -1;
    if (done)                        complis.push(obj);
    else if (obj.visible(etat))      actifs.push(obj);
  });

  elActifs.innerHTML = "";
  actifs.forEach(function(obj) {
    const el = document.createElement("div");
    el.className = "obj-entry obj-actif";
    if (obj.labelHtml) { el.innerHTML = obj.labelHtml; }
    else { el.textContent = obj.label; }
    elActifs.appendChild(el);
  });

  elSection.style.display = complis.length > 0 ? "block" : "none";
  const panneau = document.getElementById("panneau-objectifs");
  if (panneau) panneau.style.display = actifs.length === 0 && OBJECTIFS.every(function(o) { return etat.objectifsComplis.indexOf(o.id) !== -1; }) ? "none" : "";
  elComplis.innerHTML = "";
  complis.slice().reverse().forEach(function(obj) {
    const el = document.createElement("div");
    el.className = "obj-entry obj-compli";
    if (obj.labelHtml) { el.innerHTML = "✓ " + obj.labelHtml; }
    else { el.textContent = "✓ " + obj.label; }
    elComplis.appendChild(el);
  });
}


// ════════════════════════════════════════════════════════════
// 9. RENDER
// ════════════════════════════════════════════════════════════

// Track previous bar values to detect resets
const _barreProgres = {};

function setBarreProgress(id, ratio) {
  const el = document.getElementById(id);
  if (!el) return;
  const pct    = Math.min(ratio * 100, 100);
  const ancien = _barreProgres[id] || 0;
  if (pct < ancien - 5) {
    // Reset: jump instantly to avoid backward animation
    el.style.transition = "none";
    el.style.width      = pct + "%";
    el.getBoundingClientRect();
    el.style.transition = "";
  } else {
    el.style.width = pct + "%";
  }
  _barreProgres[id] = pct;
}

// Helper: compute all unlock flags once per render cycle
function unlocks() {
  return {
    libres:       chatonsLibres(),
    cathering:    catheringDebloquee(),
    grasscat:     grasscattingDebloquee(),
    pebblecat:    pebblegatheringDebloquee(),
    basicWood:    basicWoodDebloquee(),
    catHouse:     catHouseDebloquee(),
    buildings:    buildingsDebloques(),
    scierie:      scierieDebloquee(),
    basicSawmill: basicSawmillDebloquee(),
    brickfact:    brickfactoryDebloquee(),
    pawcessing:   pawcessingDebloquee(),
    catchen:      catchenDebloquee(),
    exploration:  explorationDebloquee(),
    explorateurPresent: explorateurPresent(),
    inventaire:   inventaireDebloque(),
    jobCenter:    jobCenterDebloquee(),
    anchovy:      anchovyDebloquee(),
    grilledAnchovy: grilledAnchovyDebloquee()
  };
}

// ── 9a. Resources bar
function renduRessources(u) {
  document.getElementById("val-chatons").textContent     = formaterNombre(etat.chatons);
  document.getElementById("val-cardboard").textContent        = formaterNombre(etat.cardboardPieces);
  document.getElementById("val-basic-wood").textContent       = formaterNombre(etat.basicWood);
  document.getElementById("val-catnip").textContent           = formaterNombre(etat.catnip);
  document.getElementById("val-pebbles").textContent          = formaterNombre(etat.pebbles);
  document.getElementById("val-cardboard-planks").textContent  = formaterNombre(etat.cardboardPlanks);
  document.getElementById("val-basic-wood-planks").textContent = formaterNombre(etat.basicWoodPlanks);
  document.getElementById("val-pebble-bricks").textContent    = formaterNombre(etat.pebbleBricks);
  document.getElementById("val-salads").textContent           = formaterNombre(etat.salads);
  document.getElementById("val-anchovy").textContent          = formaterNombre(etat.anchovy);
  document.getElementById("val-grilled-anchovy").textContent  = formaterNombre(etat.grilledAnchovy);
  document.getElementById("val-human-leftovers").textContent  = formaterNombre(etat.humanLeftovers);

  document.getElementById("onglet-work").style.display         = u.cathering   ? "inline-block" : "none";
  document.getElementById("onglet-buildings").style.display    = u.buildings   ? "inline-block" : "none";
  document.getElementById("onglet-explorations").style.display = u.exploration ? "inline-block" : "none";
  document.getElementById("onglet-inventaire").style.display   = u.inventaire  ? "inline-block" : "none";
  document.getElementById("row-cardboard").style.display        = u.cathering  ? "flex" : "none";
  document.getElementById("row-basic-wood").style.display       = u.basicWood  ? "flex" : "none";
  document.getElementById("row-catnip").style.display           = u.grasscat   ? "flex" : "none";
  document.getElementById("row-pebbles").style.display           = u.pebblecat ? "flex" : "none";
  document.getElementById("row-cardboard-planks").style.display  = u.scierie      ? "flex" : "none";
  document.getElementById("row-basic-wood-planks").style.display = u.basicSawmill ? "flex" : "none";
  document.getElementById("row-pebble-bricks").style.display     = u.brickfact    ? "flex" : "none";
  document.getElementById("row-salads").style.display            = u.catchen   ? "flex" : "none";
  document.getElementById("row-anchovy").style.display           = u.anchovy   ? "flex" : "none";
  document.getElementById("row-grilled-anchovy").style.display   = u.grilledAnchovy ? "flex" : "none";
  document.getElementById("row-human-leftovers").style.display   = etat.humanLeftovers > 0 ? "flex" : "none";

  const prodCardboardPieces  = u.cathering ? allocationCount("woodcatting") * productionParChaton("woodcatting") / CONFIG.woodcatting.secondesParUnite : 0;
  const consCardboardPieces  = (!etat.scieriBloquee) ? allocationCount("sawmill") / CONFIG.sawmill.secondesParCardboard : 0;
  afficherTauxNet("taux-cardboard", prodCardboardPieces - consCardboardPieces);

  const prodBasicWood = u.basicWood ? allocationCount("basicWoodcatting") / CONFIG.basicWoodcatting.secondesParUnite : 0;
  const consBasicWood = (u.basicSawmill && !etat.basicSawmillBloquee) ? allocationCount("basicSawmill") / CONFIG.basicSawmill.secondesParBasicWood : 0;
  afficherTauxNet("taux-basic-wood", prodBasicWood - consBasicWood);

  const prodCatnip  = u.grasscat ? allocationCount("grasscatting") * productionParChaton("grasscatting") / CONFIG.grasscatting.secondesParUnite : 0;
  const consCatnip  = (!etat.catchenBloquee) ? allocationCount("catchen") / CONFIG.catchen.secondesParCatnip : 0;
  afficherTauxNet("taux-catnip", prodCatnip - consCatnip);

  const prodPebble  = u.pebblecat ? allocationCount("pebblegathering") * productionParChaton("pebblegathering") / CONFIG.pebblegathering.secondesParUnite : 0;
  const consPebble  = (!etat.brickBloquee) ? allocationCount("brickfactory") / CONFIG.brickfactory.secondesParPebble : 0;
  afficherTauxNet("taux-pebbles", prodPebble - consPebble);

  const prodCardboardPiecesPlanks  = (u.scierie && !etat.scieriBloquee) ? allocationCount("sawmill") / CONFIG.sawmill.secondesParPlanche : 0;
  afficherTauxNet("taux-cardboard-planks", prodCardboardPiecesPlanks);

  const prodBasicWoodPlanks = (u.basicSawmill && !etat.basicSawmillBloquee) ? allocationCount("basicSawmill") / CONFIG.basicSawmill.secondesParPlanche : 0;
  afficherTauxNet("taux-basic-wood-planks", prodBasicWoodPlanks);

  const prodPebbleBricks  = (u.brickfact && !etat.brickBloquee) ? allocationCount("brickfactory") / CONFIG.brickfactory.secondesParBrique : 0;
  afficherTauxNet("taux-pebble-bricks", prodPebbleBricks);

  const prodSalads  = (u.catchen && !etat.catchenBloquee) ? allocationCount("catchen") / CONFIG.catchen.secondesParSalad : 0;
  afficherTauxNet("taux-salads", prodSalads);

  const prodAnchovy   = u.anchovy ? allocationCount("fishcatting") * productionParChaton("fishcatting") / CONFIG.fishcatting.secondesParUnite : 0;
  const consAnchovy   = (u.anchovy && !etat.catchenAnchovyBloquee) ? allocationCount("grilledAnchovy") / CONFIG.grilledAnchovy.secondesParAnchovy : 0;
  afficherTauxNet("taux-anchovy", prodAnchovy - consAnchovy);

  const prodGrilledAnchovy = (u.grilledAnchovy && !etat.catchenAnchovyBloquee) ? allocationCount("grilledAnchovy") / CONFIG.grilledAnchovy.secondesParRecette : 0;
  afficherTauxNet("taux-grilled-anchovy", prodGrilledAnchovy);
}

function afficherTauxNet(elementId, net) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (Math.abs(net) < 0.0005) {
    el.textContent = "";
    el.classList.remove("ressource-taux-positif", "ressource-taux-negatif");
    return;
  }
  const parMin = net * 60;
  el.textContent = (parMin > 0 ? "+" : "") + parMin.toFixed(2) + "/min";
  el.classList.toggle("ressource-taux-positif", net > 0);
  el.classList.toggle("ressource-taux-negatif", net < 0);
}

// ── 9b. Catch sequence (header)
function renduSequence() {
  const enCours = etat.sequenceEnCours;
  const restant = tempsRestantSequence();
  const btnSeq   = document.getElementById("bouton-sequence");
  const recruit  = etat.chatons >= 3;
  btnSeq.disabled = enCours;
  btnSeq.classList.toggle("recruit", recruit);
  btnSeq.textContent = enCours
    ? (recruit ? "Recruiting... " : "Catching... ") + formaterTemps(restant)
    : (recruit ? "Recruit a Kitty 🐾" : "Catch a kitty 🐾");
  document.getElementById("conteneur-barre-sequence").style.display = enCours ? "block" : "none";
  setBarreProgress("barre-sequence", progressionSequence());
  document.getElementById("info-sequence").textContent   = enCours ? ""
    : ("Next: " + formaterTemps(dureeEffective()));

  renduStatsAttrapage();
}

// ── 9b-bis. Catching stats popover
let statsAttrapageOuvert = false;

function toggleStatsAttrapage() {
  statsAttrapageOuvert = !statsAttrapageOuvert;
  document.getElementById("popover-stats-attrapage").style.display = statsAttrapageOuvert ? "flex" : "none";
  if (statsAttrapageOuvert) renduStatsAttrapage();
}

function formaterTempsStat(sec) {
  return sec <= 0 ? "0s" : formaterTemps(sec);
}

function renduStatsAttrapage() {
  if (!statsAttrapageOuvert) return;

  const raw    = dureeBrute();
  const taux   = vitesseAttrapage();
  const restant = etat.sequenceEnCours ? tempsRestantSequence() / taux : raw / taux;

  document.getElementById("stat-raw").textContent      = formaterTempsStat(raw);
  document.getElementById("stat-taux").textContent      = taux.toFixed(2) + "s/s";
  document.getElementById("stat-adjusted").textContent = formaterTempsStat(restant);
}

document.addEventListener("click", function(e) {
  if (!statsAttrapageOuvert) return;
  const wrapper   = document.getElementById("stats-attrapage-wrapper");
  const catchBtn  = document.getElementById("bouton-sequence");
  if (wrapper && !wrapper.contains(e.target) && e.target !== catchBtn) {
    statsAttrapageOuvert = false;
    document.getElementById("popover-stats-attrapage").style.display = "none";
  }
});

// ── 9c. Cathering section
function renduCathering(u) {
  // Filter bar visibility — each button appears only when its family is unlocked
  const setDisplay = function(id, show) { const el = document.getElementById(id); if (el) el.style.display = show ? "" : "none"; };
  setDisplay("filtre-work-wood", u.cathering);
  setDisplay("filtre-work-food", u.grasscat);
  setDisplay("filtre-work-rock", u.pebblecat);
  setDisplay("filtre-work-all",  u.grasscat || u.pebblecat);
  const filtresBar = document.querySelector(".work-filtres");
  if (filtresBar) filtresBar.style.display = u.cathering ? "" : "none";

  if (!u.cathering) return;

  const showWood = workFiltre === null || workFiltre === "wood";
  const showFood = (workFiltre === null || workFiltre === "food") && u.grasscat;
  const showRock = (workFiltre === null || workFiltre === "rock") && u.pebblecat;

  const sectionEl = document.getElementById("section-cathering");
  if (sectionEl) sectionEl.style.display = (showWood || showFood || showRock) ? "block" : "none";

  if (showWood) renderManagerSlot("wood");
  if (showFood) renderManagerSlot("food");
  if (showRock) renderManagerSlot("rock");

  // WOOD family
  document.getElementById("famille-wood").style.display = showWood ? "block" : "none";
  if (showWood) {
    updateWorkerSlotUI("woodcatting", 0);
    updateWorkerSlotUI("woodcatting", 1);
    document.getElementById("sep-basicWoodcatting").style.display = u.basicWood ? "block" : "none";
    if (u.basicWood) {
      updateWorkerSlotUI("basicWoodcatting", 0);
      updateWorkerSlotUI("basicWoodcatting", 1);
    }
  }

  // FOOD family
  document.getElementById("famille-food").style.display = showFood ? "block" : "none";
  if (showFood) {
    updateWorkerSlotUI("grasscatting", 0);
    updateWorkerSlotUI("grasscatting", 1);
    const sepFish = document.getElementById("sep-fishcatting");
    if (sepFish) sepFish.style.display = u.anchovy ? "block" : "none";
    if (u.anchovy) {
      updateWorkerSlotUI("fishcatting", 0);
      updateWorkerSlotUI("fishcatting", 1);
    }
  }

  // ROCK family
  document.getElementById("famille-rock").style.display = showRock ? "block" : "none";
  if (showRock) {
    updateWorkerSlotUI("pebblegathering", 0);
    updateWorkerSlotUI("pebblegathering", 1);
  }
}

// ── 9d. Buildings section
function renduBuildings(u) {
  if (!u.buildings) return;
  const cout = coutProchaineCathouse();
  document.getElementById("possede-cathouse").textContent = etat.cathouses.length;
  document.getElementById("cout-cathouse").textContent    = cout;
  document.getElementById("bouton-cathouse").disabled     = etat.cardboardPlanks < cout;
  const speedBox = etat.cathouses.length;
  document.getElementById("reduction-active").textContent = speedBox > 0
    ? "Catch speed: +" + speedBox + "s/s" : "";

  document.getElementById("bloc-cathouse").style.display = u.catHouse ? "flex" : "none";
  if (u.catHouse) {
    const cout2 = coutProchaineCatHouse();
    document.getElementById("possede-cathouse2").textContent = etat.cathouseCount;
    document.getElementById("cout-cathouse2").textContent    = cout2;
    document.getElementById("bouton-cathouse2").disabled     = etat.basicWoodPlanks < cout2;
    const speedCat = etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde;
    document.getElementById("reduction-cathouse").textContent = speedCat > 0
      ? "Catch speed: +" + speedCat + "s/s" : "";
  }

  document.getElementById("section-facilities").style.display = u.jobCenter ? "block" : "none";
  if (u.jobCenter) {
    const btnJC = document.getElementById("bouton-jobcenter");
    btnJC.disabled = etat.jobCenterConstruit || etat.pebbleBricks < 10 || etat.cardboardPlanks < 10;
    btnJC.textContent = etat.jobCenterConstruit ? "✅ Built" : "10 🧱 + 10 📋";
    const jcIface = document.getElementById("jc-interface");
    if (jcIface) jcIface.style.display = etat.jobCenterConstruit ? "block" : "none";
    if (etat.jobCenterConstruit) renduJobCenter(u);
  }
}

// ── 9e. Paw-cessing section
function renduPawcessing(u) {
  if (!u.pawcessing) {
    document.getElementById("section-pawcessing").style.display = "none";
    return;
  }

  const showSawmill  = workFiltre === null || workFiltre === "wood";
  const showCatchen  = (workFiltre === null || workFiltre === "food") && u.catchen;
  const showPawsonry = (workFiltre === null || workFiltre === "rock") && u.brickfact;

  document.getElementById("section-pawcessing").style.display = (showSawmill || showCatchen || showPawsonry) ? "flex" : "none";

  if (showSawmill)  renderManagerSlot("sawmill");
  if (showCatchen)  renderManagerSlot("catchen");
  if (showPawsonry) renderManagerSlot("pawsonry");

  // Sawmill
  document.getElementById("famille-sawmill").style.display = showSawmill ? "block" : "none";
  if (showSawmill) {
    updateWorkerSlotUI("sawmill", 0);
    updateWorkerSlotUI("sawmill", 1);
    const statutSaw = document.getElementById("statut-sawmill");
    if (statutSaw) statutSaw.textContent = etat.scieriBloquee ? "⏸ Waiting for Cardboard Pieces..." : "";

    const sepBasicSaw = document.getElementById("sep-basicSawmill");
    if (sepBasicSaw) sepBasicSaw.style.display = u.basicSawmill ? "block" : "none";
    if (u.basicSawmill) {
      updateWorkerSlotUI("basicSawmill", 0);
      updateWorkerSlotUI("basicSawmill", 1);
      const statutBasic = document.getElementById("statut-basicSawmill");
      if (statutBasic) statutBasic.textContent = etat.basicSawmillBloquee ? "⏸ Waiting for basic wood..." : "";
    }
  }

  // Catchen
  document.getElementById("famille-catchen").style.display = showCatchen ? "block" : "none";
  if (showCatchen) {
    updateWorkerSlotUI("catchen", 0);
    updateWorkerSlotUI("catchen", 1);
    const statutCat = document.getElementById("statut-catchen");
    if (statutCat) statutCat.textContent = etat.catchenBloquee ? "⏸ Waiting for catnip..." : "";
    const sepAnchovy = document.getElementById("sep-grilled-anchovy");
    if (sepAnchovy) sepAnchovy.style.display = u.grilledAnchovy ? "block" : "none";
    if (u.grilledAnchovy) {
      updateWorkerSlotUI("grilledAnchovy", 0);
      updateWorkerSlotUI("grilledAnchovy", 1);
      const statutAnchovy = document.getElementById("statut-grilled-anchovy");
      if (statutAnchovy) statutAnchovy.textContent = etat.catchenAnchovyBloquee ? "⏸ Waiting for anchovy..." : "";
    }
  }

  // Pawsonry
  document.getElementById("famille-pawsonry").style.display = showPawsonry ? "block" : "none";
  if (showPawsonry) {
    updateWorkerSlotUI("brickfactory", 0);
    updateWorkerSlotUI("brickfactory", 1);
    const statutBrick = document.getElementById("statut-brickfactory");
    if (statutBrick) statutBrick.textContent = etat.brickBloquee ? "⏸ Waiting for pebbles..." : "";
  }
}

// ── 9g. Management tab
let kittySelectionnee = null;

function selectionnerKitty(index) {
  kittySelectionnee = index;
  renduManagement();
}

function deselectionnerKitty() {
  kittySelectionnee = null;
  renduManagement();
}

function renduManagement() {
  const liste  = document.getElementById("liste-kitties");
  const detail = document.getElementById("detail-kitty");
  const layout = document.getElementById("management-layout");
  if (!liste || !detail) return;

  if (layout) layout.classList.toggle("affiche-detail-mobile", kittySelectionnee !== null);

  // Left: kitty list
  liste.innerHTML = "";
  if (etat.kittiesData.length === 0) {
    const vide = document.createElement("p");
    vide.className   = "management-vide";
    vide.textContent = "No kitties yet... go catch some! 🐾";
    liste.appendChild(vide);
    detail.innerHTML = "<p class=\"management-vide\">No kitty selected.</p>";
    return;
  }

  etat.kittiesData.forEach(function(kitty, i) {
    const carte  = document.createElement("div");
    carte.className = "kitty-carte" + (kittySelectionnee === i ? " kitty-carte-active" : "");
    carte.onclick   = function() { selectionnerKitty(i); };

    const photo = document.createElement("div");
    photo.className   = "kitty-photo kitty-photo-tier-" + (kitty.tier || 0);
    photo.innerHTML = KITTY_ICON;

    const infos = document.createElement("div");
    infos.className = "kitty-infos";

    const tierIdx = kitty.tier || 0;

    const metierLabel = kitty.metier
      ? (METIERS[kitty.metier] ? METIERS[kitty.metier].emoji + " " + TIERS_KITTIES[tierIdx] + " " + METIERS[kitty.metier].nom : kitty.metier)
      : "Stray Cat";
    const alloc = kittyAllocationLabel(i);
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
    liste.appendChild(carte);
  });

  // Right: detail panel
  if (kittySelectionnee === null || !etat.kittiesData[kittySelectionnee]) {
    detail.innerHTML = "<p class=\"management-vide\">Select a kitty to see details.</p>";
    return;
  }

  const k       = etat.kittiesData[kittySelectionnee];
  const tierIdx = k.tier || 0;
  detail.innerHTML = "";

  const retour = document.createElement("button");
  retour.className   = "bouton-retour-mobile";
  retour.textContent = "← Back";
  retour.onclick      = deselectionnerKitty;
  detail.appendChild(retour);

  // Left third: General Info
  const gauche = document.createElement("div");
  gauche.className = "detail-gauche";
  gauche.innerHTML =
    "<h3 class=\"detail-titre\">General Info</h3>" +
    "<div class=\"kitty-photo detail-photo kitty-photo-tier-" + tierIdx + "\">" + KITTY_ICON + "</div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Name</span><span class=\"detail-val\">" + k.nom + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Caught</span><span class=\"detail-val\">" + formaterCatchTime(k.catchTs) + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Level</span><span class=\"detail-val\">Level " + k.niveau + " <span class='detail-xp-sub'>(" + k.xp + "/" + xpPourNiveau(k.niveau) + " XP)</span></span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Tier</span><span class=\"detail-val kitty-tier kitty-tier-" + tierIdx + "\">T" + tierIdx + " · " + TIERS_KITTIES[tierIdx] + "</span></div>";

  // Right two-thirds: Job Details
  const droite = document.createElement("div");
  droite.className = "detail-droite";
  const xpNext = xpPourNiveau(k.niveau);
  const xpPct  = Math.min(100, Math.floor((k.xp / xpNext) * 100));
  const FOOD_LABELS = { salads: "🥗 Salad", grilledAnchovy: "🐟 Grilled Anchovy", humanLeftovers: "🗑️ Human Leftovers" };
  const feedBtns = Object.keys(FOOD_XP).filter(function(f) { return etat[f] > 0; }).map(function(f) {
    const label = FOOD_LABELS[f] || f;
    return "<button class='btn-xp-feed' onclick='nourrir(" + kittySelectionnee + ",\"" + f + "\")'>"+label+" <span class='xp-gain'>+"+FOOD_XP[f]+" XP</span> <span class='xp-stock'>×"+etat[f]+"</span></button>";
  }).join("");

  droite.innerHTML =
    "<h3 class=\"detail-titre\">Job Details</h3>" +
    "<div class=\"detail-job-nom" + (k.metier ? "" : " kitty-vagabond") + "\">" + (k.metier ? (METIERS[k.metier] ? METIERS[k.metier].emoji + " " + (TIERS_KITTIES[k.tier || 0] || "") + " " + METIERS[k.metier].nom : k.metier) : "Stray Cat") + "</div>" +
    (k.metier && METIERS[k.metier] ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + ((k.managerMult || 2) * jobLevelMultiplier(k)).toFixed(2) + "</span> production speed on " + METIERS[k.metier].familleNom + " when assigned as manager</div>" : "") +
    "<div class='xp-section'>" +
      "<div class='xp-header'><span class='xp-label'>Experience</span><span class='xp-val'>" + k.xp + " / " + xpNext + " XP</span></div>" +
      "<div class='conteneur-barre'><div class='barre barre-verte' style='width:" + xpPct + "%'></div></div>" +
      (k.niveau > 0 ? "<div class='xp-bonus-actifs'><span class='xp-bonus-ligne'>📦 Production ×" + Math.pow(1.1, k.niveau).toFixed(2) + "</span>" + (k.metier ? "<span class='xp-bonus-ligne'>🐱 Manager bonuses ×" + jobLevelMultiplier(k).toFixed(2) + "</span>" : "") + "<span class='xp-bonus-ligne'>⚡ Exploration Power +" + k.niveau + "</span></div>" : (k.metier ? "<div class='xp-bonus-actifs'><span class='xp-bonus-ligne'>🐱 Manager bonuses ×" + jobLevelMultiplier(k).toFixed(2) + "</span></div>" : "<div class='xp-bonus-actifs xp-bonus-vide'>No bonuses yet — feed your kitty!</div>")) +
      (feedBtns ? "<div class='xp-aliments'>" + feedBtns + "</div>" : "<div class='xp-aliments-vide'>No food available.</div>") +
    "</div>";

  const corps = document.createElement("div");
  corps.className = "detail-corps";
  corps.appendChild(gauche);
  corps.appendChild(droite);
  detail.appendChild(corps);
}

// ── 9h. Master render dispatcher
function rendu() {
  const u = unlocks();
  renduRessources(u);
  renduSequence();
  renduCathering(u);
  renduBuildings(u);
  renduPawcessing(u);
  renduExplorations(u);
  renduInventaire(u);
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
    if (el) el.classList.toggle("btn-filtre-work-actif", f === cle);
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
let carteZoneSelectionnee = null;
let carteExploSlots       = {};  // { zoneId: Array<kittyIndex|null> }

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

function recompenseLabel(id) {
  if (id === "schoolGuide")  return "&#x1F4DA; School guide on jobs";
  if (id === "fishingGuide") return "&#x1F3A3; Fishing Guide for Dummies";
  return id;
}

function renderCampaignCards() {
  const listeEl = document.getElementById("liste-campaigns");
  const scoutEl = document.getElementById("liste-scoutings");
  if (!listeEl) return;

  const zoneId = carteZoneSelectionnee;

  // No zone selected
  if (!zoneId) {
    listeEl.innerHTML = '<p class="explo-vide">Select a zone on the map to see its missions.</p>';
    if (scoutEl) scoutEl.innerHTML = '<p class="explo-vide">Select a zone on the map to see its missions.</p>';
    return;
  }

  const zone     = ZONES_CARTE[zoneId];
  const exploree = etat.zonesExplorees.includes(zoneId);
  let html = "";

  // ── Zone exploration card (shown when zone is not yet explored, non-home) ──
  if (zone && zone.type !== "home" && !exploree) {
    const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
    html += '<div class="explo-card">';
    html += '<div class="explo-nom">&#x1F50D; Explore ' + zone.nom + '</div>';
    html += '<div class="explo-description">Send cats to explore this zone and unlock its missions.</div>';
    html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + zone.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(zone.duree) + ' &nbsp;&middot;&nbsp; &#x1F431; ' + zone.slots + ' slot(s) &nbsp;&middot;&nbsp; &#x1F381; Unlock: ' + zone.nom + '</div>';
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
      const power     = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? etat.kittiesData[ki].niveau + 1 : 0); }, 0);
      const allFilled = slots.every(function(k) { return k !== null; });
      const chance    = power > 0 ? Math.min(100, Math.round(power / zone.difficulte * 100)) : 0;
      html += '<div class="explo-slots">';
      for (let si = 0; si < zone.slots; si++) {
        const ki = slots[si];
        if (ki === null) {
          html += '<div class="explo-slot explo-slot-empty" onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
        } else {
          const k = etat.kittiesData[ki];
          html += '<div class="explo-slot explo-slot-filled" onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<span class="explo-slot-emoji">' + KITTY_ICON + '</span>';
          html += '<div class="explo-slot-kitty-info">';
          html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
          html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + (k ? k.niveau + 1 : 1) + '</span>';
          html += '</div>';
          html += '<button class="explo-slot-remove" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ');event.stopPropagation()">&#x2715;</button>';
          html += '</div>';
        }
      }
      html += '</div>';
      if (power > 0) {
        var zoneHasExplorator = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === "explorator"; });
        var zoneEffDuree = zoneHasExplorator ? zone.duree / 2 : zone.duree;
        var zoneTimeNote = zoneHasExplorator ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(zoneEffDuree) + '</strong> (&#x1F9ED; Explorator)' : '';
        html += '<div class="explo-power-display">Exploration Power: ' + power + ' / ' + zone.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + zoneTimeNote + '</div>';
      } else {
        html += '<div class="explo-power-display explo-power-hint">Assign kitties to start the exploration.</div>';
      }
      const canLaunch = allFilled && !etat.exploZoneEnCours;
      html += '<button class="btn-lancer-explo"' + (canLaunch ? '' : ' disabled') + ' onclick="lancerExploZone()">Explore &#x27A4;</button>';
    }
    html += '</div>';
    listeEl.innerHTML = html;
    if (scoutEl) scoutEl.innerHTML = '<p class="explo-vide">Explore this zone first to unlock missions.</p>';
  return;
  }

  // ── Campaigns for explored zone (or home) ──
  const campDefs = Object.values(CONFIG.campaigns).filter(function(c) { return c.zone === zoneId; });

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

      html += '<div class="explo-card">';
      html += '<div class="explo-nom">' + camp.nom + '</div>';
      html += '<div class="explo-description">' + camp.description + '</div>';

      if (completed) {
        html += '<div class="explo-complete">&#x2705; Completed &#x2014; ' + recompenseLabel(camp.recompense) + ' received</div>';
      } else if (inProgress) {
        const elapsed   = (Date.now() - inProgress.startTs) / 1000;
        const remaining = Math.max(0, inProgress.duree - elapsed);
        const progress  = Math.min(1, elapsed / inProgress.duree);
        const names     = inProgress.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
        const power     = inProgress.kittyIndices.reduce(function(s, i) { return s + (etat.kittiesData[i] ? etat.kittiesData[i].niveau + 1 : 1); }, 0);
        const chance    = Math.min(100, Math.round(power / camp.difficulte * 100));
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x1F431; ' + names + ' &nbsp;&middot;&nbsp; ' + chance + '% success</div>';
        html += '<div class="conteneur-barre"><div class="barre barre-explo" id="explo-barre-' + camp.id + '" style="width:' + Math.round(progress * 100) + '%"></div></div>';
        html += '<div class="explo-timer" id="explo-timer-' + camp.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
      } else {
        const selPower  = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? etat.kittiesData[ki].niveau + 1 : 0); }, 0);
        const allFilled = slots.every(function(x) { return x !== null; });
        const chance    = selPower > 0 ? Math.min(100, Math.round(selPower / camp.difficulte * 100)) : 0;
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(camp.duree) + ' &nbsp;&middot;&nbsp; &#x1F381; ' + recompenseLabel(camp.recompense) + '</div>';
        html += '<div class="explo-slots">';
        for (let si = 0; si < camp.slots; si++) {
          const ki = slots[si];
          if (ki === null) {
            html += '<div class="explo-slot explo-slot-empty" onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
          } else {
            const k = etat.kittiesData[ki];
            html += '<div class="explo-slot explo-slot-filled" onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<span class="explo-slot-emoji">' + KITTY_ICON + '</span>';
            html += '<div class="explo-slot-kitty-info">';
            html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
            html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + (k ? k.niveau + 1 : 1) + '</span>';
            html += '</div>';
            html += '<button class="explo-slot-remove" onclick="retirerKittySlot(\'' + camp.id + '\',' + si + ');event.stopPropagation()">&#x2715;</button>';
            html += '</div>';
          }
        }
        html += '</div>';
        if (selPower > 0) {
          var campHasExplorator = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === "explorator"; });
          var campEffDuree = campHasExplorator ? camp.duree / 2 : camp.duree;
          var campTimeNote = campHasExplorator ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(campEffDuree) + '</strong> (&#x1F9ED; Explorator)' : '';
          html += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + camp.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + campTimeNote + '</div>';
        } else {
          html += '<div class="explo-power-display explo-power-hint">Click a slot to assign a kitty.</div>';
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
        var rangeLabel = sc.recompenseRange.map(function(r) { return r.qty + "&#xd7;" + r.weight + "%" ; }).join(" / ");
        scoutHtml += '<div class="explo-card">';
        scoutHtml += '<div class="explo-nom">' + sc.nom + '</div>';
        scoutHtml += '<div class="explo-description">' + sc.description + '</div>';
        scoutHtml += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + sc.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(sc.duree) + ' &nbsp;&middot;&nbsp; &#x1F381; Human leftovers (' + rangeLabel + ')</div>';
        if (running) {
          var effectiveDuree = (running.duree !== undefined) ? running.duree : sc.duree;
          var elapsed   = (Date.now() - running.startTs) / 1000;
          var remaining = Math.max(0, effectiveDuree - elapsed);
          var prog      = Math.min(1, elapsed / effectiveDuree);
          var k         = etat.kittiesData[running.kittyIndex];
          var kNom      = k ? k.nom : "?";
          var kPower    = k ? k.niveau + 1 : 1;
          scoutHtml += '<div class="explo-slots">';
          scoutHtml += '<div class="explo-slot explo-slot-filled">';
          scoutHtml += '<span class="explo-slot-emoji">' + KITTY_ICON + '</span>';
          scoutHtml += '<div class="explo-slot-kitty-info">';
          scoutHtml += '<span class="explo-slot-kitty-nom">' + kNom + '</span>';
          scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kPower + '</span>';
          scoutHtml += '</div>';
          scoutHtml += '<button class="explo-slot-remove" onclick="retirerKittyScouting(\'' + sc.id + '\');event.stopPropagation()">&#x2715;</button>';
          scoutHtml += '</div>';
          scoutHtml += '</div>';
          scoutHtml += '<div class="conteneur-barre"><div class="barre barre-explo" id="scout-barre-' + sc.id + '" style="width:' + Math.round(prog * 100) + '%"></div></div>';
          scoutHtml += '<div class="explo-timer" id="scout-timer-' + sc.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining &#x21BA; auto-repeats</div>';
        } else {
          var stagedKi  = scoutingsStagingKitty[sc.id];
          var stagedK   = (stagedKi !== undefined) ? etat.kittiesData[stagedKi] : null;
          var selPower  = stagedK ? stagedK.niveau + 1 : 0;
          var chance    = selPower > 0 ? Math.min(100, Math.round(selPower / sc.difficulte * 100)) : 0;
          scoutHtml += '<div class="explo-slots">';
          if (stagedKi !== undefined) {
            scoutHtml += '<div class="explo-slot explo-slot-filled" onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<span class="explo-slot-emoji">' + KITTY_ICON + '</span>';
            scoutHtml += '<div class="explo-slot-kitty-info">';
            scoutHtml += '<span class="explo-slot-kitty-nom">' + (stagedK ? stagedK.nom : "?") + '</span>';
            scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + selPower + '</span>';
            scoutHtml += '</div>';
            scoutHtml += '<button class="explo-slot-remove" onclick="retirerScoutingStaging(\'' + sc.id + '\');event.stopPropagation()">&#x2715;</button>';
            scoutHtml += '</div>';
          } else {
            scoutHtml += '<div class="explo-slot explo-slot-empty" onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
          }
          scoutHtml += '</div>';
          if (selPower > 0) {
            var scoutIsExplorator = stagedK && stagedK.metier === "explorator";
            var scoutEffDuree = scoutIsExplorator ? sc.duree / 2 : sc.duree;
            var scoutTimeNote = scoutIsExplorator ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(scoutEffDuree) + '</strong> (&#x1F9ED; Explorator)' : '';
            scoutHtml += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + sc.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + scoutTimeNote + '</div>';
          } else {
            scoutHtml += '<div class="explo-power-display explo-power-hint">Click a slot to assign a kitty.</div>';
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

function renduCarteGrille() {
  const el = document.getElementById("carte-grille");
  if (!el) return;
  const ROWS = 5, COLS = 7, LETTERS = "ABCDEFG";
  let html = "";
  for (let row = ROWS; row >= 1; row--) {
    html += '<div class="carte-row-lbl">' + row + '</div>';
    for (let ci = 0; ci < COLS; ci++) {
      const zoneId = LETTERS[ci] + row;
      const zone   = ZONES_CARTE[zoneId];
      if (!zone) {
        html += '<div class="carte-cellule carte-fog"><span class="carte-fog-coord">' + zoneId + '</span></div>';
      } else {
        const exploree    = etat.zonesExplorees.includes(zoneId);
        const inProgress  = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
        const selected    = carteZoneSelectionnee === zoneId;
        let cls = "carte-cellule carte-" + zone.type;
        if (!exploree) cls += " carte-inexploree";
        if (selected)  cls += " carte-selectionnee";
        html += '<div class="' + cls + '" onclick="clicZoneCarte(\'' + zoneId + '\')">';
        html += '<span class="carte-icone">' + zone.icone + '</span>';
        html += '<span class="carte-nom">' + zone.nom + '</span>';
        if (inProgress) html += '<span class="carte-badge-encours">⏳</span>';
        html += '</div>';
      }
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
    html += '<p class="carte-detail-statut exploree">✅ Home — always accessible.</p>';
    html += '</div>'; el.innerHTML = html; return;
  }
  html += '<div class="carte-detail-stats">';
  html += '<span>⚔️ Difficulty: ' + zone.difficulte + '</span>';
  html += '<span>⏱ Duration: ' + formaterTempsStat(zone.duree) + '</span>';
  html += '<span>' + KITTY_ICON + ' ' + zone.slots + ' slot' + (zone.slots > 1 ? 's' : '') + '</span>';
  html += '</div>';
  if (exploree) {
    html += '<p class="carte-detail-statut exploree">✅ Explored — missions coming soon.</p>';
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
    const power    = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? etat.kittiesData[ki].niveau + 1 : 0); }, 0);
    const allFilled = slots.every(function(k) { return k !== null; });
    const chance   = power > 0 ? Math.min(100, Math.round(power / zone.difficulte * 100)) : 0;
    html += '<div class="explo-slots">';
    for (let si = 0; si < zone.slots; si++) {
      const ki = slots[si];
      if (ki === null) {
        html += '<div class="explo-slot explo-slot-empty" onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
      } else {
        const k = etat.kittiesData[ki];
        html += '<div class="explo-slot explo-slot-filled" onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<span class="explo-slot-emoji">' + KITTY_ICON + '</span>';
        html += '<div class="explo-slot-kitty-info">';
        html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
        html += '<span class="explo-slot-kitty-power">⚡ EP ' + (k ? k.niveau + 1 : 1) + '</span>';
        html += '</div>';
        html += '<button class="explo-slot-remove" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ');event.stopPropagation()">✕</button>';
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
    html += '<button class="btn-lancer-explo"' + (canLaunch ? '' : ' disabled') + ' onclick="lancerExploZone()">Explore ➤</button>';
  }
  html += '</div>';
  el.innerHTML = html;
}

function renduCarte(u) {
  const el = document.getElementById("explo-map-section");
  if (!el) return;
  if (!u || !u.explorateurPresent) {
    el.innerHTML = '<p class="explo-map-hint">Train an <strong>Explorator</strong> in the Job Center to unlock the map.</p>';
    return;
  }
  if (carteDirty || !document.getElementById("carte-grille")) {
    el.innerHTML =
      '<div class="carte-grille" id="carte-grille"></div>' +
      '<div class="carte-col-lbls" id="carte-col-lbls"></div>';
    const clEl = document.getElementById("carte-col-lbls");
    if (clEl) {
      let h = '<div></div>';
      "ABCDEFG".split("").forEach(function(l) { h += '<div class="carte-col-lbl">' + l + '</div>'; });
      clEl.innerHTML = h;
    }
    carteDirty = false;
    renduCarteGrille();
  }
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
    const timerEl   = document.getElementById("explo-timer-" + explo.id);
    const barEl     = document.getElementById("explo-barre-" + explo.id);
    if (timerEl) timerEl.textContent = formaterTempsStat(Math.ceil(remaining)) + " remaining";
    if (barEl)   barEl.style.width   = Math.round(progress * 100) + "%";
  });

  // Zone exploration timer (direct DOM update)
  if (etat.exploZoneEnCours) {
    const ez        = etat.exploZoneEnCours;
    const elapsed   = (Date.now() - ez.startTs) / 1000;
    const remaining = Math.max(0, ez.duree - elapsed);
    const progress  = Math.min(1, elapsed / ez.duree);
    const barEl     = document.getElementById("barre-explo-zone");
    const timerEl   = document.getElementById("timer-explo-zone");
    if (barEl)   barEl.style.width   = Math.round(progress * 100) + "%";
    if (timerEl) timerEl.textContent = formaterTempsStat(Math.ceil(remaining)) + " remaining";
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
    const barEl     = document.getElementById("scout-barre-" + scoutingId);
    const timerEl   = document.getElementById("scout-timer-" + scoutingId);
    if (barEl)   barEl.style.width   = Math.round(progress * 100) + "%";
    if (timerEl) timerEl.textContent = formaterTempsStat(Math.ceil(remaining)) + " remaining ↺ auto-repeats";
  });
}

function ouvrirModalExplo(campId, slotIndex) {
  exploModalOuvert = { campId: campId, slotIndex: slotIndex };
  renduModalExplo();
  document.getElementById("explo-modal").style.display = "flex";
}

function ouvrirModalExploZone(zoneId, slotIndex) {
  exploModalOuvert = { zoneId: zoneId, slotIndex: slotIndex };
  renduModalExplo();
  document.getElementById("explo-modal").style.display = "flex";
}

function ouvrirModalScouting(scoutingId) {
  exploModalOuvert = { scoutingId: scoutingId };
  renduModalExplo();
  document.getElementById("explo-modal").style.display = "flex";
}

function fermerModalExplo() {
  exploModalOuvert = null;
  document.getElementById("explo-modal").style.display = "none";
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
    return aExp - bExp;
  });
  kittyList.forEach(function(entry) {
    var k = entry.k, i = entry.i;
    const onExplo      = kittyIsOnExpedition(i);
    const inOtherSlot  = exploModalOuvert.campId ? kittyDejaSelectionnee(i, exploModalOuvert.campId, exploModalOuvert.slotIndex) : false;
    const inWorker     = kittyIsInWorkerSlot(i);
    const inTraining   = kittyIsInTraining(i);
    const onZoneExplo  = kittyIsOnZoneExplo(i);
    const onScouting   = kittyIsOnScouting(i) || (kittyIsInScoutingStaging(i) && scoutingsStagingKitty[exploModalOuvert.scoutingId] !== i);
    const inZoneSlot   = exploModalOuvert.zoneId
      ? (carteExploSlots[exploModalOuvert.zoneId] || []).some(function(ki, si) { return ki === i && si !== exploModalOuvert.slotIndex; })
      : false;
    const disabled     = onExplo || inOtherSlot || inWorker || inTraining || onZoneExplo || inZoneSlot || onScouting;
    let statusLabel    = onExplo ? "on expedition" : onZoneExplo ? "exploring a zone" : onScouting ? "on scouting" : inTraining ? "in training" : inWorker ? "assigned to work" : (inOtherSlot || inZoneSlot) ? "in another slot" : "";

    html += '<div class="explo-modal-kitty' + (disabled ? ' explo-modal-kitty-disabled' : '') + '"' +
            (disabled ? '' : ' onclick="selectionnerKittySlot(' + i + ')"') + '>';
    html += '<span class="explo-modal-kitty-emoji">' + KITTY_ICON + '</span>';
    html += '<div class="explo-modal-kitty-info">';
    html += '<span class="explo-modal-kitty-nom">' + k.nom + '</span>';
    html += '<span class="explo-modal-kitty-power">&#x26A1; Exploration Power ' + (k.niveau + 1) + '</span>';
    if (k.metier === "explorator") html += '<span class="explo-modal-kitty-effect">&#x23F1; Halves mission time</span>';
    if (statusLabel) html += '<span class="explo-modal-kitty-status">' + statusLabel + '</span>';
    html += '</div>';
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
  fermerModalExplo();
  exploTabDirty = true;
  renduExplorations(unlocks());
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
  carteZoneSelectionnee = (carteZoneSelectionnee === zoneId) ? null : zoneId;
  if (carteZoneSelectionnee && !carteExploSlots[zoneId]) {
    carteExploSlots[zoneId] = new Array(z.slots).fill(null);
  }
  carteDirty = true;
  exploTabDirty = true;
  renduCarte(unlocks());
  renderCampaignCards();
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
  var hasExplorator = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === "explorator"; });
  etat.exploZoneEnCours = { zoneId: zoneId, kittyIndices: slots.slice(), startTs: Date.now(), duree: hasExplorator ? z.duree / 2 : z.duree };
  carteDirty = true;
  sauvegarder(); rendu();
}

function terminerExploZone() {
  if (!etat.exploZoneEnCours) return;
  const zoneId = etat.exploZoneEnCours.zoneId;
  const z = ZONES_CARTE[zoneId];
  etat.zonesExplorees.push(zoneId);
  etat.exploZoneEnCours = null;
  carteDirty = true;
  exploTabDirty = true;
  if (carteExploSlots[zoneId]) carteExploSlots[zoneId] = carteExploSlots[zoneId].map(function() { return null; });
  afficherNotification("✅ " + (z ? z.nom : zoneId) + " explored!");
  ajouterLog("unlock", "🗺️ Zone explored: " + (z ? z.nom : zoneId) + ".");
  verifierObjectifs();
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
  var hasExplorator = kittyIndices.some(function(ki) { return etat.kittiesData[ki] && etat.kittiesData[ki].metier === "explorator"; });
  etat.exploEnCours.push({ id: id, kittyIndices: kittyIndices, startTs: Date.now(), duree: hasExplorator ? camp.duree / 2 : camp.duree });
  exploKittiesSelectionnees[id] = new Array(camp.slots).fill(null);
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExplo(explo) {
  const camp = CONFIG.campaigns[explo.id];
  if (!camp) return;

  const power   = explo.kittyIndices.reduce(function(s, i) {
    return s + (etat.kittiesData[i] ? etat.kittiesData[i].niveau + 1 : 1);
  }, 0);
  const success = Math.random() < Math.min(1, power / camp.difficulte);
  const names   = explo.kittyIndices.map(function(i) {
    return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
  }).join(", ");

  if (success) {
    etat.campaignsCompletees.push(explo.id);
    appliquerRecompense(camp.recompense);
    ajouterLog("event", "📜 Campaign '" + camp.nom + "' completed! " + names + " returned with the reward.");
  } else {
    ajouterLog("event", "📜 Campaign '" + camp.nom + "' failed — " + names + " returned empty-pawed.");
    afficherNotification("❌ " + camp.nom + " failed — try with more power!");
  }
  exploTabDirty = true;
}

function appliquerRecompense(recompenseId) {
  if (recompenseId === "schoolGuide") {
    if (!etat.itemsAcquis.includes("schoolGuide")) {
      etat.itemsAcquis.push("schoolGuide");
      inventaireDirty = true;
    }
    afficherNotification("📚 School Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "📚 School Guide added to your Inventory.");
    if (!localStorage.getItem("story6aVue")) {
      localStorage.setItem("story6aVue", "1");
      afficherModal("ecran-story-6a");
      ajouterLog("dialogue", [
        "— The squad returns from the trash run —",
        "Bernardo: Miaou? (Hold on. What's this doing here?)",
        "Bernardo: Miaou miaou miaou... (A school guide. Mostly human stuff... but look at these diagrams. Work structures, job assignments, efficiency charts. This is interesting.)",
        "Bernardo: Miaou miaou. (Give me some time with this. I want to go through it properly.)",
        "Bernardo: Miaou miaou miaou. (If there's anything useful in here, I'll find it. Count on me.)"
      ]);
    }
  }
  if (recompenseId === "fishingGuide") {
    if (!etat.itemsAcquis.includes("fishingGuide")) {
      etat.itemsAcquis.push("fishingGuide");
      inventaireDirty = true;
    }
    afficherNotification("🎣 Fishing Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "🎣 Fishing Guide for Dummies added to your Inventory.");
  }
}

// ════════════════════════════════════════════════════════════
// 9c. INVENTORY RENDER
// ════════════════════════════════════════════════════════════

let itemSelectionne   = null;
let inventaireDirty   = true;

function selectionnerItem(itemId) {
  itemSelectionne = (itemSelectionne === itemId) ? null : itemId;
  inventaireDirty = true;
  renduInventaire(unlocks());
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
}

function terminerApprentissage(itemId) {
  if (itemId === "schoolGuide") {
    etat.itemsAppris.push("schoolGuide");
    etat.jobCenterDebloque = true;
    assignerGangLeader();
    afficherNotification("🏫 Job Center unlocked! Build it in Buildings.");
    ajouterLog("unlock", "🏫 Job Center unlocked — build it from the Buildings tab.");
    if (!localStorage.getItem("story6bVue")) {
      localStorage.setItem("story6bVue", "1");
      afficherModal("ecran-story-6b");
      ajouterLog("dialogue", [
        "Bernardo: Miaou miaou. (Alright, I've been through it all. Fascinating stuff, honestly.)",
        "— Bernardo sets aside one page with a thoughtful look —",
        "Bernardo: Miaou miaou. (This page — CEO, Chief Executive Officer. That's the one that speaks to me. I'll be keeping it.)",
        "Bernardo: Miaou miaou miaou. (The guide talks about giving everyone a proper role — a job that plays to their strengths. If we do that, we could be twice as efficient. Maybe more.)",
        "Bernardo: Miaou! Miaou miaou. (I have an idea. We build a Job Center — a place where everyone trains and gets assigned properly. What do you say?)"
      ]);
    }
  }
  if (itemId === "fishingGuide") {
    etat.itemsAppris.push("fishingGuide");
    afficherNotification("🎣 Fishing unlocked! Anchovy available in Food, Grilled Anchovy in the Catchen.");
    ajouterLog("unlock", "🎣 Fishing Guide learned — Anchovy gathering and Grilled Anchovy recipe unlocked.");
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

  const resEl = document.getElementById("inv-resources");
  if (!resEl) return;

  const ressources = [
    { id: "inv-res-cardboard",       label: "Cardboard Pieces",  sprite: "img/resources/Cardboard Pieces_Final.png",  val: etat.cardboardPieces,   visible: u.cathering    },
    { id: "inv-res-basic-wood",      label: "Basic Wood",        sprite: "img/resources/Basic Wood_Final.png",        val: etat.basicWood,         visible: u.basicWood    },
    { id: "inv-res-catnip",          label: "Catnip",            sprite: "img/resources/Catnip_Final.png",            val: etat.catnip,            visible: u.grasscat     },
    { id: "inv-res-pebbles",         label: "Pebbles",           sprite: "img/resources/Pebbles_Final.png",           val: etat.pebbles,           visible: u.pebblecat    },
    { id: "inv-res-cardboard-plank", label: "Cardboard Planks",  sprite: "img/resources/Cardboard Plank_Final.png",   val: etat.cardboardPlanks,   visible: u.scierie      },
    { id: "inv-res-wood-plank",      label: "Basic Wood Planks", sprite: "img/resources/Basic Wood Plank_Final.png",  val: etat.basicWoodPlanks,   visible: u.basicSawmill },
    { id: "inv-res-pebble-brick",    label: "Pebble Bricks",     sprite: "img/resources/Pebble Brick_Final.png",      val: etat.pebbleBricks,      visible: u.brickfact    },
    { id: "inv-res-salads",          label: "Salads",            sprite: "img/resources/Catnip Salad_Final.png",      val: etat.salads,            visible: u.catchen      },
    { id: "inv-res-anchovy",         label: "Anchovy",           sprite: "img/resources/Catnip Salad_Final.png",      val: etat.anchovy,           visible: u.anchovy      },
    { id: "inv-res-grilled-anchovy", label: "Grilled Anchovy",   sprite: "img/resources/Catnip Salad_Final.png",      val: etat.grilledAnchovy,    visible: u.grilledAnchovy },
    { id: "inv-res-human-leftovers", label: "Human Leftovers",   sprite: "img/resources/Catnip Salad_Final.png",      val: etat.humanLeftovers,    visible: etat.humanLeftovers > 0 },
  ];

  const visible = ressources.filter(function(r) { return r.visible; });

  // Rebuild only when the set of visible resources changes
  const visibleKey = visible.map(function(r) { return r.id; }).join(",");
  if (resEl.dataset.visibleKey !== visibleKey) {
    resEl.dataset.visibleKey = visibleKey;
    if (visible.length === 0) {
      resEl.innerHTML = '<p class="inv-vide">No resources yet.</p>';
      return;
    }
    let resHtml = '<div class="inv-res-grille">';
    visible.forEach(function(r) {
      resHtml += '<div class="inv-res-cell" data-tooltip="' + r.label + '" id="' + r.id + '">';
      resHtml += '<img class="inv-res-sprite" src="' + r.sprite + '" alt="' + r.label + '">';
      resHtml += '<span class="inv-res-qty" id="' + r.id + '-qty"></span>';
      resHtml += '</div>';
    });
    resHtml += '</div>';
    resEl.innerHTML = resHtml;
  }

  // Update quantities in-place every tick
  visible.forEach(function(r) {
    const qtyEl = document.getElementById(r.id + "-qty");
    if (qtyEl) qtyEl.textContent = formaterNombre(Math.floor(r.val));
  });
}

function renderItemsList() {
  const listeEl = document.getElementById("inv-liste-items");
  if (!listeEl) return;

  if (etat.itemsAcquis.length === 0) {
    listeEl.innerHTML = '<p class="inv-vide">Your backpack is empty.</p>';
    return;
  }

  let html = "";
  etat.itemsAcquis.forEach(function(itemId) {
    const item   = ITEMS[itemId];
    if (!item) return;
    const appris = etat.itemsAppris.includes(itemId);
    const actif  = itemSelectionne === itemId;

    html += '<div class="inv-item-carte' + (actif ? " inv-item-actif" : "") +
            '" onclick="selectionnerItem(\'' + itemId + '\')">';
    html += '<span class="inv-item-emoji">' + item.emoji + '</span>';
    html += '<div class="inv-item-entete">';
    html += '<span class="inv-item-nom">' + item.nom + '</span>';
    if (appris) html += '<span class="inv-item-tag">✅ Learned</span>';
    html += '</div>';
    html += '</div>';

    if (actif) {
      html += '<div class="inv-item-detail">';
      html += '<p class="inv-item-desc">' + item.description + '</p>';
      if (appris) {
        html += '<div class="inv-item-appris">✅ Already learned</div>';
      } else if (etat.learningEnCours && etat.learningEnCours.itemId === itemId) {
        const elapsed = Date.now() - etat.learningEnCours.startTs;
        const pct = Math.min(100, Math.floor(elapsed / etat.learningEnCours.duree * 100));
        const remaining = Math.max(0, Math.ceil((etat.learningEnCours.duree - elapsed) / 1000));
        html += '<div class="inv-action-row">';
        html += '<div class="inv-learning-label">📖 Learning... ' + remaining + 's</div>';
        html += '<div class="inv-learning-barre"><div class="inv-learning-progres" style="width:' + pct + '%"></div></div>';
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
let jcModalOuvert  = null;   // { mode: "formation"|"manager", famille?: string }
let jcFormationKittySelectionne = null;
let jcMetierSelectionne = null;

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
  document.getElementById("jc-modal").style.display = "flex";
}

function fermerModalJC() {
  jcModalOuvert = null;
  document.getElementById("jc-modal").style.display = "none";
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
        const k       = etat.kittiesData[idx];
        const tier    = TIERS_KITTIES[k.tier] || "Kitty";
        const busy    = kittyIsBusy(idx);
        const busyLbl = kittyIsOnExpedition(idx) ? "on expedition"
                      : kittyIsInWorkerSlot(idx) ? "assigned to work" : "";
        html += '<div class="jc-modal-kitty' + (busy ? ' jc-modal-kitty-disabled' : '') + '"' +
                (busy ? '' : ' onclick="selectionnerKittyFormation(' + idx + ')"') + '>';
        html += '<div class="jc-modal-kitty-info">';
        html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
        html += '<span class="jc-modal-kitty-tier">' + tier + (busyLbl ? ' — ' + busyLbl : '') + '</span>';
        html += '</div></div>';
      });
    }
  } else if (jcModalOuvert.mode === "manager") {
    const famille = jcModalOuvert.famille;
    const metierParFamille = { wood: "lumberjack", food: "farmer", sawmill: "carpenter", catchen: "chef" };
    const metierId = metierParFamille[famille];
    if (titreEl) titreEl.textContent = "👤 Assign a Manager";
    const dejaMgr = new Set(Object.values(etat.managers).filter(function(v) { return v !== null && v !== undefined; }));
    {
      const eligibles = etat.kittiesData.reduce(function(acc, k, i) {
        if ((k.metier === metierId || k.metier === "gang-leader") && !dejaMgr.has(i)) acc.push(i);
        return acc;
      }, []);
      if (eligibles.length === 0) {
        html = '<p class="jc-modal-vide">No kitty with the required job.</p>';
      } else {
        eligibles.forEach(function(idx) {
          const k = etat.kittiesData[idx];
          const m = METIERS[k.metier];
          html += '<div class="jc-modal-kitty" onclick="assignerManager(\'' + famille + '\',' + idx + ')">';
          html += '<div class="jc-modal-kitty-info">';
          html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
          html += '<span class="jc-modal-kitty-tier">' + (m ? m.emoji + " " + m.nom : k.metier) + '</span>';
          html += '</div></div>';
        });
      }
    }
  }

  contenuEl.innerHTML = html;
}

function selectionnerKittyFormation(kittyIndex) {
  jcFormationKittySelectionne = kittyIndex;
  fermerModalJC();
  jcDirty = true;
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
    ajouterLog("unlock", (m ? m.emoji + " " : "") + kitty.nom + " trained as " + (m ? m.nom : metierId) + ".");
    if (metierId === "explorator") {
      afficherNotification("🗺️ Exploration map unlocked!");
      ajouterLog("unlock", "🗺️ The exploration map is now available in the Explorations tab.");
    }
  }
  if (!etat.managersDebloques) {
    etat.managersDebloques = true;
    afficherNotification("🏢 Manager slots unlocked in the Work tab!");
    ajouterLog("unlock", "🏢 Manager slots are now available in Work families.");
  }
  jcDirty = true;
  sauvegarder(); rendu();
}

function assignerManager(famille, kittyIndex) {
  etat.managers[famille] = kittyIndex;
  fermerModalJC();
  jcDirty = true;
  sauvegarder(); rendu();
}

function retirerManager(famille) {
  etat.managers[famille] = null;
  jcDirty = true;
  sauvegarder(); rendu();
}

function renderManagerSlot(famille) {
  const el = document.getElementById("manager-slot-" + famille);
  if (!el) return;
  if (!etat.managersDebloques) {
    el.style.display = "none";
    return;
  }
  el.style.display = "flex";
  const managerIdx = etat.managers[famille];
  const metierParFamille = { wood: "lumberjack", food: "farmer", sawmill: "carpenter", catchen: "chef" };
  const metierAttendu = metierParFamille[famille];

  // Resolve actual state: filled (valid manager) or empty
  let kitty = null;
  if (managerIdx !== null && managerIdx !== undefined) {
    const k = etat.kittiesData[managerIdx];
    if (k && (k.metier === metierAttendu || k.metier === "gang-leader")) kitty = k;
    else etat.managers[famille] = null;
  }

  // Only rebuild DOM when state changes — prevents destroying the button mid-click
  const currentState = el.dataset.slotState || "";
  const newState = kitty ? "filled:" + managerIdx : "empty";
  if (currentState === newState) return;
  el.dataset.slotState = newState;

  if (kitty) {
    const tierIdx = kitty.tier || 0;
    const m = METIERS[kitty.metier];
    const bonusTxt = m ? '<span class="bonus-var">×' + ((kitty.managerMult || 2) * jobLevelMultiplier(kitty)).toFixed(2) + '</span> production speed on ' + m.familleNom : '';
    el.innerHTML = '<div class="manager-slot-filled">'
      + '<div class="manager-cercle kitty-photo-tier-' + tierIdx + '">' + KITTY_ICON + '</div>'
      + '<div class="manager-info">'
      +   '<span class="manager-kitty-nom">' + kitty.nom + '</span>'
      +   '<span class="manager-bonus-txt">' + bonusTxt + '</span>'
      + '</div>'
      + '<button class="manager-slot-remove" onclick="retirerManager(\'' + famille + '\');event.stopPropagation()">✕</button>'
      + '</div>';
  } else {
    el.innerHTML = '<button class="manager-slot-btn" onclick="ouvrirModalJC(\'manager\',\'' + famille + '\')">+ Manager</button>';
  }
}

// ── Worker slot UI (ring progress per kitty) ─────────────────
function updateWorkerSlotUI(action, slotIdx) {
  const el = document.getElementById("worker-slot-" + action + "-" + slotIdx);
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
          '<div class="worker-ring-inner">' + KITTY_ICON + '</div>' +
          '<button class="worker-ring-remove" onclick="retirerWorker(\'' + action + '\',' + slotIdx + ');event.stopPropagation()">✕</button>' +
        '</div>' +
        '<div class="worker-slot-name">' + (kitty ? kitty.nom : "?") + '</div>';
    } else {
      el.innerHTML =
        '<button class="worker-slot-empty" onclick="ouvrirModalWorker(\'' + action + '\',' + slotIdx + ')">' +
          '+' +
        '</button>' +
        '<div class="worker-slot-name-placeholder"></div>';
    }
  }

  // Update ring progress directly (no DOM rebuild needed)
  if (slot.kittyIndex !== null) {
    const ring = document.getElementById("worker-ring-" + action + "-" + slotIdx);
    if (ring) ring.style.setProperty("--prog", slot.progress || 0);
  }
}

// ── Worker selection modal ────────────────────────────────────
let workerModalOuvert = null; // { action, slotIdx }

function ouvrirModalWorker(action, slotIdx) {
  workerModalOuvert = { action: action, slotIdx: slotIdx };
  renduModalWorker();
  document.getElementById("worker-modal").style.display = "flex";
}

function fermerModalWorker() {
  workerModalOuvert = null;
  document.getElementById("worker-modal").style.display = "none";
}

function renduModalWorker() {
  const conteneur = document.getElementById("worker-modal-kitties");
  if (!conteneur || !workerModalOuvert) return;
  let html = "";
  etat.kittiesData.forEach(function(k, i) {
    const onExplo    = kittyIsOnExpedition(i);
    const inWorker   = kittyIsInWorkerSlot(i);
    const inTraining = kittyIsInTraining(i);
    const disabled   = onExplo || inWorker || inTraining;
    const status     = onExplo ? "on expedition" : inTraining ? "in training" : (inWorker ? "assigned to work" : "");
    html += '<div class="worker-modal-kitty' + (disabled ? ' worker-modal-kitty-disabled' : '') + '"' +
            (disabled ? '' : ' onclick="assignerWorkerSlot(' + i + ')"') + '>';
    html += '<span class="worker-modal-kitty-emoji">' + KITTY_ICON + '</span>';
    html += '<div class="worker-modal-kitty-info">';
    html += '<span class="worker-modal-kitty-nom">' + k.nom + '</span>';
    if (status) html += '<span class="worker-modal-kitty-status">' + status + '</span>';
    html += '</div></div>';
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
    let html = '<div class="jc-section-titre">📚 Training</div>';

    if (etat.formationEnCours) {
      const f = etat.formationEnCours;
      const m = METIERS[f.metier];
      const kitty = etat.kittiesData[f.kittyIndex];
      const elapsed = Math.min(f.duree, (Date.now() - f.startTs) / 1000);
      const prog    = elapsed / f.duree;
      const restant = Math.max(0, f.duree - elapsed);
      html += '<div class="jc-formation-en-cours">';
      html += '<div class="jc-slot-filled">';
      html += '<span class="jc-slot-emoji">' + (m ? m.emoji : KITTY_ICON) + '</span>';
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
        html += '<div class="jc-slot-filled" onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-emoji">' + KITTY_ICON + '</span>';
        html += '<div class="jc-slot-info">';
        html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
        html += '<span class="jc-slot-metier">Stray Cat</span>';
        html += '</div>';
        html += '<button class="jc-slot-remove" onclick="jcFormationKittySelectionne=null;jcDirty=true;event.stopPropagation()">✕</button>';
        html += '</div>';
      } else {
        html += '<div class="jc-slot-empty" onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-plus">+</span>';
        html += '<span class="jc-slot-label">Select a Stray Cat</span>';
        html += '</div>';
      }

      // Job selection
      html += '<div class="jc-metiers">';
      Object.values(METIERS).filter(function(m) { return m.id !== "gang-leader"; }).forEach(function(m) {
        const pris = metierDejaAttribue(m.id);
        const sel  = jcMetierSelectionne === m.id;
        html += '<button class="jc-metier-btn' + (sel ? ' jc-metier-actif' : '') + '"';
        if (pris) {
          html += ' disabled title="Already trained"';
        } else {
          html += ' onclick="selectionnerMetierJC(\'' + m.id + '\')"';
        }
        html += '>' + m.emoji + ' ' + m.nom + (pris ? ' ✓' : '') + '</button>';
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
    const barre = document.getElementById("barre-jc-formation");
    if (barre) barre.style.width = Math.round(prog * 100) + "%";
    const timer = el.querySelector(".jc-timer");
    if (timer) timer.textContent = formaterTemps(restant);
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
  etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: Date.now() });
  afficherNotification("🐱 " + nom + " joined the gang!");
  ajouterLog("event", "🐱 " + nom + " caught!");
  renduManagement();
  if (etat.chatons === 3) {
    afficherNotification("🐾 Cathering unlocked! Put your kitties to work.");
    ajouterLog("unlock", "🐾 Cathering unlocked — put your kitties to work.");
  }
  if (etat.chatons === 5) {
    afficherNotification("🌿 Grasscatting unlocked!");
    ajouterLog("unlock", "🌿 Grasscatting unlocked!");
  }
  if (etat.chatons === 6) {
    afficherNotification("🗺️ Explorations unlocked! Send your kitties on expeditions.");
    ajouterLog("unlock", "🗺️ Explorations unlocked — send kitties on campaigns and scoutings.");
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
  ajouterLog("event", "📦 Cardboard Box #" + etat.cathouses.length + " built!");
  if (etat.cathouses.length === 1 && !localStorage.getItem("story4Vue")) {
    localStorage.setItem("story4Vue", "1");
    afficherModal("ecran-story-4");
    ajouterLog("dialogue", [
      "Bernardo: \"Great job pals, our first own construction. That's only the beginning.\"",
      "Bernardo: \"We need to build more to recruit more of us — the more we are, the stronger we'll be.\""
    ]);
  }
  verifierObjectifs(); sauvegarder(); rendu();
}

function acheterCatHouse() {
  const cout = coutProchaineCatHouse();
  if (etat.basicWoodPlanks < cout) return;
  etat.basicWoodPlanks -= cout;
  etat.cathouseCount += 1;
  afficherNotification("🏠 Cathouse built!");
  ajouterLog("event", "🏠 Cathouse #" + etat.cathouseCount + " built!");
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
    ajouterLog("event", "🎉 " + k.nom + " reached Level " + k.niveau + "!");
    afficherNotification("🎉 " + k.nom + " is now Level " + k.niveau + "!");
  }
  verifierObjectifs(); sauvegarder(); renduManagement();
}

function assignerGangLeader() {
  const bernardo = etat.kittiesData.find(function(k) { return k.nom === "Bernardo"; });
  if (bernardo && bernardo.metier !== "gang-leader") {
    bernardo.metier = "gang-leader";
    afficherNotification("👑 Bernardo is now the Gang Leader!");
    ajouterLog("event", "👑 Bernardo has been promoted to Gang Leader. Assign him as manager to boost any family ×2.");
  }
}

function acheterJobCenter() {
  if (etat.jobCenterConstruit) return;
  if (etat.pebbleBricks < 10 || etat.cardboardPlanks < 10) return;
  etat.pebbleBricks   -= 10;
  etat.cardboardPlanks -= 10;
  etat.jobCenterConstruit = true;
  jcDirty = true;
  afficherNotification("🏫 Job Center built!");
  ajouterLog("event", "🏫 Job Center built — ready to assign jobs to kitties.");
  sauvegarder(); rendu();
}



// ════════════════════════════════════════════════════════════
// 11. GAME LOOP (TICK)
// ════════════════════════════════════════════════════════════

let vitesse  = 1;
const TICK_DT = 0.1; // seconds per tick

function tickWorkers(action, stockKey, totalKey, cfg, onUnlockCheck, dt) {
  const slots = etat.workers[action];
  if (!slots) return;
  if (dt === undefined) dt = vitesse * TICK_DT;
  let totalProd = 0;
  slots.forEach(function(slot) {
    if (slot.kittyIndex === null) return;
    const slotKitty = etat.kittiesData[slot.kittyIndex];
    const levelBonus = slotKitty ? Math.pow(1.1, slotKitty.niveau) : 1;
    slot.progress += productionParChaton(action) * multiplicateurFamille(action) * levelBonus * dt / cfg.secondesParUnite;
    if (slot.progress >= 1) {
      const units = Math.floor(slot.progress);
      slot.progress -= units;
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
      inventaireDirty = true;
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

  // Gathering
  tickWorkers("woodcatting", "cardboardPieces", "cardboardPiecesTotalRecolte", CONFIG.woodcatting, function(prod) {
    const avant = etat.cardboardPiecesTotalRecolte - prod;
    if (avant < 5 && etat.cardboardPiecesTotalRecolte >= 5) {
      afficherNotification("🏗️ Buildings unlocked! Build your first Cardboard Box.");
      ajouterLog("unlock", "🏗️ Buildings unlocked — build your first Cardboard Box.");
    }
    if (avant < CONFIG.sawmill.deblocageA && etat.cardboardPiecesTotalRecolte >= CONFIG.sawmill.deblocageA) {
      afficherNotification("🪚 Sawmill unlocked! Paw-cessing is now available.");
      ajouterLog("unlock", "🪚 Sawmill unlocked — Paw-cessing is now available.");
    }
  });

  tickWorkers("basicWoodcatting", "basicWood", "basicWoodTotalRecolte", CONFIG.basicWoodcatting, null);

  tickWorkers("grasscatting", "catnip", "catnipTotalRecolte", CONFIG.grasscatting, function(prod) {
    const avant = etat.catnipTotalRecolte - prod;
    if (avant < CONFIG.catchen.deblocageA && etat.catnipTotalRecolte >= CONFIG.catchen.deblocageA) {
      afficherNotification("🍳 The Catchen is open!");
      ajouterLog("unlock", "🍳 The Catchen is open — cook your first salad!");
    }
  });

  tickWorkers("pebblegathering", "pebbles", "pebblesTotalRecolte", CONFIG.pebblegathering, function(prod) {
    const avant = etat.pebblesTotalRecolte - prod;
    if (avant < CONFIG.brickfactory.deblocageA && etat.pebblesTotalRecolte >= CONFIG.brickfactory.deblocageA) {
      afficherNotification("🪨 Pawsonry unlocked!");
      ajouterLog("unlock", "🪨 Pawsonry unlocked — process pebbles into bricks.");
    }
  });

  if (anchovyDebloquee()) {
    tickWorkers("fishcatting", "anchovy", "anchovyTotalRecolte", CONFIG.fishcatting, null);
  }

  // Processing: Sawmill (cardboard → cardboard planks)
  if (allocationCount("sawmill") > 0) {
    if (etat.cardboardPieces >= 1) {
      etat.scieriBloquee = false;
      const dt_saw = vitesse * TICK_DT;
      const mult   = multiplicateurFamille("sawmill");
      etat.workers.sawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt_saw / CONFIG.sawmill.secondesParPlanche;
        etat.cardboardPieces = Math.max(0, etat.cardboardPieces - (slot.progress - prev) * (CONFIG.sawmill.secondesParPlanche / CONFIG.sawmill.secondesParCardboard));
        if (slot.progress >= 1) {
          const planks = Math.floor(slot.progress);
          slot.progress -= planks;
          const first = etat.cardboardPlanks === 0;
          etat.cardboardPlanks += planks;
          afficherNotification("📋 " + planks + " cardboard plank(s) produced!");
          ajouterLog("event", "📋 " + planks + " cardboard plank(s) produced by the Sawmill.");
        }
      });
    } else {
      etat.scieriBloquee = true;
    }
  }

  // Processing: Basic Sawmill (basic wood → basic wood planks)
  if (allocationCount("basicSawmill") > 0) {
    if (etat.basicWood >= 1) {
      etat.basicSawmillBloquee = false;
      const dt_bsw = vitesse * TICK_DT;
      const mult   = multiplicateurFamille("sawmill");
      etat.workers.basicSawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt_bsw / CONFIG.basicSawmill.secondesParPlanche;
        etat.basicWood = Math.max(0, etat.basicWood - (slot.progress - prev) * (CONFIG.basicSawmill.secondesParPlanche / CONFIG.basicSawmill.secondesParBasicWood));
        if (slot.progress >= 1) {
          const planks = Math.floor(slot.progress);
          slot.progress -= planks;
          etat.basicWoodPlanks += planks;
          afficherNotification("🪵 " + planks + " basic wood plank(s) produced!");
          ajouterLog("event", "🪵 " + planks + " basic wood plank(s) produced by the Sawmill.");
        }
      });
    } else {
      etat.basicSawmillBloquee = true;
    }
  }

  // Processing: Pawsonry (pebbles → pebble bricks)
  if (allocationCount("brickfactory") > 0) {
    if (etat.pebbles >= 1) {
      etat.brickBloquee = false;
      const dt_bf = vitesse * TICK_DT;
      etat.workers.brickfactory.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += dt_bf / CONFIG.brickfactory.secondesParBrique;
        etat.pebbles = Math.max(0, etat.pebbles - (slot.progress - prev) * (CONFIG.brickfactory.secondesParBrique / CONFIG.brickfactory.secondesParPebble));
        if (slot.progress >= 1) {
          const bricks = Math.floor(slot.progress);
          slot.progress -= bricks;
          etat.pebbleBricks += bricks;
          afficherNotification("🪨 " + bricks + " pebble brick(s) produced!");
          ajouterLog("event", "🪨 " + bricks + " pebble brick(s) produced by the Pawsonry.");
        }
      });
    } else {
      etat.brickBloquee = true;
    }
  }

  // Processing: Catchen (catnip → salads)
  if (allocationCount("catchen") > 0) {
    if (etat.catnip >= 1) {
      etat.catchenBloquee = false;
      const dt_cat = vitesse * TICK_DT;
      const mult   = multiplicateurFamille("catchen");
      etat.workers.catchen.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt_cat / CONFIG.catchen.secondesParSalad;
        etat.catnip = Math.max(0, etat.catnip - (slot.progress - prev) * (CONFIG.catchen.secondesParSalad / CONFIG.catchen.secondesParCatnip));
        if (slot.progress >= 1) {
          const salads = Math.floor(slot.progress);
          slot.progress -= salads;
          etat.salads += salads;
          afficherNotification("🥗 Salad ready!");
          ajouterLog("event", "🥗 Salad served by the Catchen.");
        }
      });
    } else {
      etat.catchenBloquee = true;
    }
  }

  // Processing: Catchen — anchovy → grilled anchovy
  if (grilledAnchovyDebloquee() && allocationCount("grilledAnchovy") > 0) {
    if (etat.anchovy >= 1) {
      etat.catchenAnchovyBloquee = false;
      const dt_anch = vitesse * TICK_DT;
      const mult    = multiplicateurFamille("grilledAnchovy");
      etat.workers.grilledAnchovy.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt_anch / CONFIG.grilledAnchovy.secondesParRecette;
        etat.anchovy = Math.max(0, etat.anchovy - (slot.progress - prev) * (CONFIG.grilledAnchovy.secondesParRecette / CONFIG.grilledAnchovy.secondesParAnchovy));
        if (slot.progress >= 1) {
          const grilled = Math.floor(slot.progress);
          slot.progress -= grilled;
          etat.grilledAnchovy += grilled;
          afficherNotification("🐟 Grilled Anchovy ready!");
          ajouterLog("event", "🐟 Grilled Anchovy served by the Catchen.");
        }
      });
    } else {
      etat.catchenAnchovyBloquee = true;
    }
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
  tickWorkers("woodcatting",      "cardboardPieces", "cardboardPiecesTotalRecolte", CONFIG.woodcatting,      null, dt);
  tickWorkers("basicWoodcatting", "basicWood", "basicWoodTotalRecolte", CONFIG.basicWoodcatting, null, dt);
  tickWorkers("grasscatting",     "catnip",    "catnipTotalRecolte",    CONFIG.grasscatting,     null, dt);
  tickWorkers("pebblegathering",  "pebbles",   "pebblesTotalRecolte",   CONFIG.pebblegathering,  null, dt);
  if (anchovyDebloquee()) {
    tickWorkers("fishcatting", "anchovy", "anchovyTotalRecolte", CONFIG.fishcatting, null, dt);
  }

  if (allocationCount("sawmill") > 0) {
    if (etat.cardboardPieces >= 1) {
      etat.scieriBloquee = false;
      const mult = multiplicateurFamille("sawmill");
      etat.workers.sawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt / CONFIG.sawmill.secondesParPlanche;
        etat.cardboardPieces = Math.max(0, etat.cardboardPieces - (slot.progress - prev) * (CONFIG.sawmill.secondesParPlanche / CONFIG.sawmill.secondesParCardboard));
        if (slot.progress >= 1) { const p = Math.floor(slot.progress); slot.progress -= p; etat.cardboardPlanks += p; }
      });
    } else { etat.scieriBloquee = true; }
  }

  if (allocationCount("basicSawmill") > 0) {
    if (etat.basicWood >= 1) {
      etat.basicSawmillBloquee = false;
      const mult = multiplicateurFamille("sawmill");
      etat.workers.basicSawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt / CONFIG.basicSawmill.secondesParPlanche;
        etat.basicWood = Math.max(0, etat.basicWood - (slot.progress - prev) * (CONFIG.basicSawmill.secondesParPlanche / CONFIG.basicSawmill.secondesParBasicWood));
        if (slot.progress >= 1) { const p = Math.floor(slot.progress); slot.progress -= p; etat.basicWoodPlanks += p; }
      });
    } else { etat.basicSawmillBloquee = true; }
  }

  if (allocationCount("brickfactory") > 0) {
    if (etat.pebbles >= 1) {
      etat.brickBloquee = false;
      etat.workers.brickfactory.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += dt / CONFIG.brickfactory.secondesParBrique;
        etat.pebbles = Math.max(0, etat.pebbles - (slot.progress - prev) * (CONFIG.brickfactory.secondesParBrique / CONFIG.brickfactory.secondesParPebble));
        if (slot.progress >= 1) { const b = Math.floor(slot.progress); slot.progress -= b; etat.pebbleBricks += b; }
      });
    } else { etat.brickBloquee = true; }
  }

  if (allocationCount("catchen") > 0) {
    if (etat.catnip >= 1) {
      etat.catchenBloquee = false;
      const mult = multiplicateurFamille("catchen");
      etat.workers.catchen.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt / CONFIG.catchen.secondesParSalad;
        etat.catnip = Math.max(0, etat.catnip - (slot.progress - prev) * (CONFIG.catchen.secondesParSalad / CONFIG.catchen.secondesParCatnip));
        if (slot.progress >= 1) { const s = Math.floor(slot.progress); slot.progress -= s; etat.salads += s; }
      });
    } else { etat.catchenBloquee = true; }
  }

  if (grilledAnchovyDebloquee() && allocationCount("grilledAnchovy") > 0) {
    if (etat.anchovy >= 1) {
      etat.catchenAnchovyBloquee = false;
      const mult = multiplicateurFamille("grilledAnchovy");
      etat.workers.grilledAnchovy.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const prev = slot.progress;
        slot.progress += mult * dt / CONFIG.grilledAnchovy.secondesParRecette;
        etat.anchovy = Math.max(0, etat.anchovy - (slot.progress - prev) * (CONFIG.grilledAnchovy.secondesParRecette / CONFIG.grilledAnchovy.secondesParAnchovy));
        if (slot.progress >= 1) { const g = Math.floor(slot.progress); slot.progress -= g; etat.grilledAnchovy += g; }
      });
    } else { etat.catchenAnchovyBloquee = true; }
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
    etat.kittiesData.push({ nom: kittyAttrapeNom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: maintenant });
    ajouterLog("event", "🐱 " + kittyAttrapeNom + " was caught while you were away!");
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

function fermerModal(id) { document.getElementById(id).style.display = "none"; }
function afficherModal(id) { document.getElementById(id).style.display = "flex"; }

function verifierStoryModals() {
  if (etat.chatons === 1 && !localStorage.getItem("story1Vue")) {
    localStorage.setItem("story1Vue", "1");
    afficherModal("ecran-story-1");
    ajouterLog("dialogue", [
      "Kid: \"Got you! Welcome home, buddy. The garden's all yours!\"",
      "Bernardo: *Miaou miaou.* (Now look across the street, kid. Keep looking.)",
      "Kid: \"There's another kitty at the end of the street! I should go get her!\"",
      "Bernardo: *Miaou.* (That's Mochi. She's been waiting there since noon. Right on schedule.)"
    ]);
  }
  if (etat.chatons === 2 && !localStorage.getItem("story2Vue")) {
    localStorage.setItem("story2Vue", "1");
    afficherModal("ecran-story-2");
    ajouterLog("dialogue", [
      "Kid: \"Two kitties — this is the best day ever!\"",
      "Mochi: Miaou. (Here I am)",
      "Kid: \"I'm pretty sure I saw another one near the park earlier...\"",
      "Bernardo: Miaou miaou miaou. (That's Luna. The plan is coming together faster than expected.)"
    ]);
  }
  if (etat.chatons === 3 && !localStorage.getItem("story3Vue")) {
    localStorage.setItem("story3Vue", "1");
    afficherModal("ecran-story-3");
    ajouterLog("dialogue", [
      "Kid: \"Three kitties in one day... I'm completely wiped out. I'll go watch some TV. They'll be fine!\"",
      "Bernardo: *Miaou miaou miaaaou...* (Finally. That kid has no idea what he's just done.)",
      "Bernardo: *MIAOU. MIAOU.* (Mochi! Luna! On your paws, both of you — we have a neighborhood to take over. It starts RIGHT NOW.)",
      "🪓 Cathering unlocked!"
    ]);
  }
  if (etat.chatons === 6 && !localStorage.getItem("story5Vue")) {
    localStorage.setItem("story5Vue", "1");
    afficherModal("ecran-story-5");
    ajouterLog("dialogue", [
      "— Six kitties gathered in the garden —",
      "Bernardo: Miaou miaou. (Look at us. Six strong. We're not just a handful anymore — we're a crew.)",
      "Bernardo: Miaou miaou miaou. (I've been thinking. We've been working this garden long enough. It's time we start looking further out.)",
      "Bernardo: Miaou! Miaou miaou miaou. (Let's start with what's right here. Our own trash bins — we walk past them every day without a second look. Could be something useful sitting right there.)",
      "🗺️ Explorations unlocked!"
    ]);
  }
}

document.getElementById("bouton-intro").addEventListener("click", function() {
  fermerModal("ecran-intro");
  localStorage.setItem("introVue", "1");
  ajouterLog("dialogue", [
    "Kid: \"Mom, look at that cute little cat. Can we keep it?\"",
    "Mom: \"Come on, the groceries won't put themselves away!\"",
    "Kid: \"I want a cat, I want a cat, I WANT A CAT.\"",
    "Mom: \"Fine, but you'll be the one taking care of it.\""
  ]);
});

if (!localStorage.getItem("introVue")) afficherModal("ecran-intro");


// ════════════════════════════════════════════════════════════
// 13. UI CONTROLS  (tabs · speed · panel toggles)
// ════════════════════════════════════════════════════════════

function changerOnglet(id) {
  ["gang", "work", "buildings", "explorations", "inventaire", "logs"].forEach(function(tab) {
    document.getElementById("contenu-" + tab).style.display  = id === tab ? "block" : "none";
    document.getElementById("onglet-" + tab).classList.toggle("onglet-actif", id === tab);
  });
  if (id === "explorations") { exploTabDirty  = true; }
  if (id === "inventaire")  { inventaireDirty = true; }
  if (id === "buildings")   { jcDirty = true; }
}

function cyclerVitesse() {
  const idx = VITESSES.indexOf(vitesse);
  vitesse = VITESSES[(idx + 1) % VITESSES.length];
  const btn = document.getElementById("bouton-vitesse");
  btn.textContent = vitesse === 1 ? "1×" : "⚡ " + vitesse + "×";
  btn.classList.toggle("vitesse-active", vitesse > 1);
}

function toggleObjectifs() {
  const panneau = document.getElementById("panneau-objectifs");
  const btn     = document.getElementById("objectifs-toggle");
  btn.textContent = panneau.classList.toggle("reduit") ? "+" : "−";
}


// ════════════════════════════════════════════════════════════
// 14. INITIALIZATION
// ════════════════════════════════════════════════════════════

const partieExistante = charger();
const resumeAbsence    = partieExistante ? appliquerProgressionHorsLigne() : null;
rendu();
renduLogs();
renduObjectifs();
verifierObjectifs();
renduManagement();
if (resumeAbsence) afficherResumeAbsence(resumeAbsence);

if (window.matchMedia("(max-width: 768px)").matches) {
  document.getElementById("panneau-objectifs").classList.add("reduit");
  document.getElementById("objectifs-toggle").textContent = "+";
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
