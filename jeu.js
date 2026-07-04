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
  ameliorations: {
    purrfectCathouse: { cout: 1, bonusParCathouse: 0.5 },
    sharpClaws:       { cout: 5, bonusParChaton:   0.5 }
  },
  campaigns: {
    checkTheTrash: {
      id:          "checkTheTrash",
      nom:         "Check the trash",
      description: "Sniff around the neighborhood bins.",
      difficulte:  1,
      duree:       60,
      slots:       1,
      recompense:  "schoolGuide"
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
      { id: "learn", label: "Learn", cout: { purrfection: 10 } }
    ]
  }
};

const METIERS = {
  lumberjack:    { id: "lumberjack",   nom: "Lumberjack",  emoji: "🪓", famille: "wood",    familleNom: "Wood resource family",    duree: 3600 },
  carpenter:     { id: "carpenter",   nom: "Carpenter",    emoji: "🔨", famille: "sawmill", familleNom: "Sawmill resource family", duree: 3600 },
  farmer:        { id: "farmer",      nom: "Farmer",       emoji: "🌾", famille: "food",    familleNom: "Food resource family",    duree: 3600 },
  chef:          { id: "chef",        nom: "Chef",         emoji: "🍳", famille: "catchen", familleNom: "Catchen resource family", duree: 3600 },
  "gang-leader": { id: "gang-leader", nom: "Gang Leader",  emoji: "👑", famille: null,      familleNom: "any resource family",     duree: 0 }
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
    accompli: function(e) { return e.cardboardPlanks >= 1 || e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; }
  },
  {
    id: "tenPlanks", label: "Craft 10 Cardboard Planks to unlock Basic Wood",
    visible:  function(e) { return e.cardboardPlanks >= 1 || e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; },
    accompli: function(e) { return e.cardboardPlanks >= 10; }
  },

  // ── Purrks
  {
    id: "firstPurrk", label: "Unlock your first Purrk",
    visible:  function(e) { return e.cardboardPlanks >= 1 || e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; },
    accompli: function(e) { return e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; }
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
    id: "firstCampaign", label: "Complete the \"Check the trash\" campaign",
    visible:  function(e) { return e.chatons >= 6; },
    accompli: function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1 || e.campaignsCompletees.indexOf("checkTheTrash") !== -1; }
  },
  {
    id: "learnFromSchoolGuide", label: "Use 10 ✨ to study the School Guide",
    visible:  function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1; },
    accompli: function(e) { return e.jobCenterDebloque; }
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
  purrfection:          0,

  // Catch sequence
  sequenceEnCours:         false,
  sequenceDebutTs:         0,
  sequenceDuree:           0,
  clicCount:               0,
  reductionAuMomentDuClic: 0,

  // Processing blocked flags
  scieriBloquee:        false,
  basicSawmillBloquee:  false,
  brickBloquee:         false,
  catchenBloquee:       false,

  // Cathouse reduction accumulator (virtual seconds)
  reductionCumulee: 0,

  // Individual kitty worker slots per action: [{ kittyIndex: null|int, progress: 0..1 }]
  // progress 0→1 = one production cycle (one unit gathered / one output produced)
  workers: {
    woodcatting:      makeWorkerSlots(2),
    basicWoodcatting: makeWorkerSlots(2),
    grasscatting:     makeWorkerSlots(2),
    pebblegathering:  makeWorkerSlots(2),
    sawmill:          makeWorkerSlots(2),
    basicSawmill:     makeWorkerSlots(2),
    brickfactory:     makeWorkerSlots(2),
    catchen:          makeWorkerSlots(2)
  },

  ameliorations: { purrfectCathouse: false, sharpClaws: false },
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
  managers:            { wood: null, food: null, sawmill: null, catchen: null },
  managersDebloques:   false,
  objectifsComplis: [],
  logs:          [],

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

function kittyIsBusy(kittyIdx) {
  return kittyIsOnExpedition(kittyIdx) || kittyIsInWorkerSlot(kittyIdx) || kittyIsInTraining(kittyIdx);
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
function chatonsLibres() { return etat.chatons - totalAlloue() - chatonsEnExplo(); }

function vitesseAttrapage() {
  const bonusBox = etat.ameliorations.purrfectCathouse
    ? 1 + CONFIG.ameliorations.purrfectCathouse.bonusParCathouse : 1;
  return 1 + etat.cathouses.length * bonusBox + etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde;
}

// XP / leveling
const FOOD_XP = { salads: 1 };

function xpPourNiveau(n) {
  return Math.max(1, Math.floor(Math.pow(n, 1.7)));
}

function productionParChaton(action) {
  return 1 + (etat.ameliorations.sharpClaws && action === "woodcatting"
    ? CONFIG.ameliorations.sharpClaws.bonusParChaton : 0);
}

function multiplicateurFamille(action) {
  const mapFamille = {
    woodcatting: "wood", basicWoodcatting: "wood",
    grasscatting: "food",
    sawmill: "sawmill",
    catchen: "catchen"
  };
  const metierParFamille = { wood: "lumberjack", food: "farmer", sawmill: "carpenter", catchen: "chef" };
  const famille = mapFamille[action];
  if (!famille) return 1;
  const managerIdx = etat.managers[famille];
  if (managerIdx === null || managerIdx === undefined) return 1;
  const kitty = etat.kittiesData[managerIdx];
  if (!kitty || (kitty.metier !== metierParFamille[famille] && kitty.metier !== "gang-leader")) return 1;
  return kitty.managerMult || 2;
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
  return Math.ceil(CONFIG.cathouse.coutBase * Math.pow(CONFIG.cathouse.croissance, etat.cathouses.length));
}

function coutProchaineCatHouse() {
  return Math.ceil(CONFIG.realCathouse.coutBase * Math.pow(CONFIG.realCathouse.croissance, etat.cathouseCount));
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
function purrksDebloques()          { return etat.cardboardPlanks >= 1 || etat.ameliorations.purrfectCathouse || etat.ameliorations.sharpClaws; }
function explorationDebloquee()     { return etat.chatons >= 6; }
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
    purrfection:          etat.purrfection,
    sequenceEnCours:         etat.sequenceEnCours,
    sequenceDebutTs:         etat.sequenceDebutTs,
    sequenceDuree:           etat.sequenceDuree,
    clicCount:               etat.clicCount,
    reductionAuMomentDuClic: etat.reductionAuMomentDuClic,
    scieriBloquee:        etat.scieriBloquee,
    basicSawmillBloquee:  etat.basicSawmillBloquee,
    brickBloquee:         etat.brickBloquee,
    catchenBloquee:       etat.catchenBloquee,
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
    jobCenterDebloque:   etat.jobCenterDebloque,
    jobCenterConstruit:  etat.jobCenterConstruit,
    formationEnCours:    etat.formationEnCours,
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
  etat.purrfection         = d.purrfection         || 0;

  etat.sequenceEnCours         = d.sequenceEnCours         || false;
  etat.sequenceDebutTs         = d.sequenceDebutTs         || 0;
  etat.sequenceDuree           = d.sequenceDuree           || 0;
  etat.clicCount               = d.clicCount               || 0;
  etat.reductionAuMomentDuClic = d.reductionAuMomentDuClic || 0;

  etat.scieriBloquee        = d.scieriBloquee        || false;
  etat.basicSawmillBloquee  = d.basicSawmillBloquee  || false;
  etat.brickBloquee         = d.brickBloquee         || false;
  etat.catchenBloquee       = d.catchenBloquee       || false;
  // Migration: compute reduction from old timestamp-based saves
  etat.reductionCumulee = d.reductionCumulee !== undefined
    ? d.reductionCumulee
    : (d.cathouses || []).reduce(function(total, ts) {
        return total + Math.floor((Date.now() - ts) / 1000) * (d.ameliorations && d.ameliorations.purrfectCathouse ? 1.5 : 1);
      }, 0);

  // Load worker slots — migrate from old allocation-count format
  const allActions = ["woodcatting", "basicWoodcatting", "grasscatting", "pebblegathering", "sawmill", "basicSawmill", "brickfactory", "catchen"];
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

  etat.ameliorations   = d.ameliorations   || { purrfectCathouse: false, sharpClaws: false };
  etat.cathouses       = d.cathouses       || [];
  etat.cathouseCount   = d.cathouseCount   || 0;
  etat.exploEnCours        = d.exploEnCours        || [];
  etat.campaignsCompletees = d.campaignsCompletees || [];
  etat.itemsAcquis         = d.itemsAcquis         || [];
  etat.itemsAppris         = d.itemsAppris         || [];
  etat.jobCenterDebloque   = d.jobCenterDebloque   || false;
  etat.jobCenterConstruit  = d.jobCenterConstruit  || false;
  etat.formationEnCours    = d.formationEnCours    || null;
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
  if (etat.jobCenterConstruit) assignerGangLeader();
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
    cardboardPlanks: 0, basicWoodPlanks: 0, pebbleBricks: 0, salads: 0, purrfection: 0,
    sequenceEnCours: false, sequenceDebutTs: 0, sequenceDuree: 0,
    clicCount: 0, reductionAuMomentDuClic: 0,
    scieriBloquee: false, basicSawmillBloquee: false, brickBloquee: false, catchenBloquee: false, reductionCumulee: 0,
    workers: {
      woodcatting: makeWorkerSlots(2), basicWoodcatting: makeWorkerSlots(2),
      grasscatting: makeWorkerSlots(2), pebblegathering: makeWorkerSlots(2),
      sawmill: makeWorkerSlots(2), basicSawmill: makeWorkerSlots(2),
      brickfactory: makeWorkerSlots(2), catchen: makeWorkerSlots(2)
    },
    ameliorations: { purrfectCathouse: false, sharpClaws: false },
    cathouses: [], cathouseCount: 0, kittiesData: [],
    exploEnCours: [], campaignsCompletees: [],
    itemsAcquis: [], itemsAppris: [], jobCenterDebloque: false, jobCenterConstruit: false,
    formationEnCours: null, managers: { wood: null, food: null, sawmill: null, catchen: null }, managersDebloques: false,
    objectifsComplis: [], logs: [],
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
      etat.purrfection += 1;
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
    purrks:       purrksDebloques(),
    exploration:  explorationDebloquee(),
    inventaire:   inventaireDebloque(),
    jobCenter:    jobCenterDebloquee()
  };
}

// ── 9a. Resources bar
function renduRessources(u) {
  document.getElementById("val-purrfection").textContent = etat.purrfection;
  document.getElementById("val-chatons").textContent     = formaterNombre(etat.chatons);
  document.getElementById("val-cardboard").textContent        = formaterNombre(etat.cardboardPieces);
  document.getElementById("val-basic-wood").textContent       = formaterNombre(etat.basicWood);
  document.getElementById("val-catnip").textContent           = formaterNombre(etat.catnip);
  document.getElementById("val-pebbles").textContent          = formaterNombre(etat.pebbles);
  document.getElementById("val-cardboard-planks").textContent  = formaterNombre(etat.cardboardPlanks);
  document.getElementById("val-basic-wood-planks").textContent = formaterNombre(etat.basicWoodPlanks);
  document.getElementById("val-pebble-bricks").textContent    = formaterNombre(etat.pebbleBricks);
  document.getElementById("val-salads").textContent           = formaterNombre(etat.salads);

  document.getElementById("onglet-work").style.display         = u.cathering   ? "inline-block" : "none";
  document.getElementById("onglet-buildings").style.display    = u.buildings   ? "inline-block" : "none";
  document.getElementById("onglet-purrks").style.display       = u.purrks      ? "inline-block" : "none";
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
  document.getElementById("bouton-cathouse").disabled     = etat.cardboardPieces < cout;
  const bonusBox = etat.ameliorations.purrfectCathouse ? 1.5 : 1;
  const speedBox = etat.cathouses.length * bonusBox;
  document.getElementById("reduction-active").textContent = speedBox > 0
    ? "Catch speed: +" + speedBox + "s/s" : "";

  document.getElementById("bloc-cathouse").style.display = u.catHouse ? "block" : "none";
  if (u.catHouse) {
    const cout2 = coutProchaineCatHouse();
    document.getElementById("possede-cathouse2").textContent = etat.cathouseCount;
    document.getElementById("cout-cathouse2").textContent    = cout2;
    document.getElementById("bouton-cathouse2").disabled     = etat.basicWood < cout2;
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

// ── 9f. Purrks section
function renduPurrks(u) {
  if (!u.purrks) return;
  const am    = etat.ameliorations;
  const btnPC = document.getElementById("bouton-purrfect-cathouse");
  btnPC.disabled    = am.purrfectCathouse || etat.cardboardPlanks < CONFIG.ameliorations.purrfectCathouse.cout;
  btnPC.textContent = am.purrfectCathouse ? "✓ Unlocked" : "1 📦";
  const btnSC = document.getElementById("bouton-sharp-claws");
  btnSC.disabled    = am.sharpClaws || etat.cardboardPlanks < CONFIG.ameliorations.sharpClaws.cout;
  btnSC.textContent = am.sharpClaws ? "✓ Unlocked" : "5 📦";
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
    photo.textContent = "🐱";

    const infos = document.createElement("div");
    infos.className = "kitty-infos";

    const tierIdx = kitty.tier || 0;

    const metierLabel = kitty.metier
      ? (METIERS[kitty.metier] ? METIERS[kitty.metier].emoji + " " + TIERS_KITTIES[tierIdx] + " " + METIERS[kitty.metier].nom : kitty.metier)
      : "Stray Cat";
    const spans = [
      { cls: "kitty-nom",    txt: kitty.nom },
      { cls: "kitty-metier" + (kitty.metier ? "" : " kitty-vagabond"), txt: metierLabel },
      { cls: "kitty-niveau", txt: "Lvl " + kitty.niveau }
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
    "<div class=\"kitty-photo detail-photo kitty-photo-tier-" + tierIdx + "\">🐱</div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Name</span><span class=\"detail-val\">" + k.nom + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Caught</span><span class=\"detail-val\">" + formaterCatchTime(k.catchTs) + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Level</span><span class=\"detail-val\">Level " + k.niveau + " <span class='detail-xp-sub'>(" + k.xp + "/" + xpPourNiveau(k.niveau) + " XP)</span></span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Tier</span><span class=\"detail-val kitty-tier kitty-tier-" + tierIdx + "\">T" + tierIdx + " · " + TIERS_KITTIES[tierIdx] + "</span></div>";

  // Right two-thirds: Job Details
  const droite = document.createElement("div");
  droite.className = "detail-droite";
  const xpNext = xpPourNiveau(k.niveau);
  const xpPct  = Math.min(100, Math.floor((k.xp / xpNext) * 100));
  const feedBtns = Object.keys(FOOD_XP).filter(function(f) { return etat[f] > 0; }).map(function(f) {
    const label = f === "salads" ? "🥗 Salad" : f;
    return "<button class='btn-xp-feed' onclick='nourrir(" + kittySelectionnee + ",\"" + f + "\")'>"+label+" <span class='xp-gain'>+"+FOOD_XP[f]+" XP</span> <span class='xp-stock'>×"+etat[f]+"</span></button>";
  }).join("");

  droite.innerHTML =
    "<h3 class=\"detail-titre\">Job Details</h3>" +
    "<div class=\"detail-job-nom" + (k.metier ? "" : " kitty-vagabond") + "\">" + (k.metier ? (METIERS[k.metier] ? METIERS[k.metier].emoji + " " + (TIERS_KITTIES[k.tier || 0] || "") + " " + METIERS[k.metier].nom : k.metier) : "Stray Cat") + "</div>" +
    (k.metier && METIERS[k.metier] ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + k.managerMult + "</span> production speed on " + METIERS[k.metier].familleNom + " when assigned as manager</div>" : "") +
    "<div class='xp-section'>" +
      "<div class='xp-header'><span class='xp-label'>Experience</span><span class='xp-val'>" + k.xp + " / " + xpNext + " XP</span></div>" +
      "<div class='conteneur-barre'><div class='barre barre-verte' style='width:" + xpPct + "%'></div></div>" +
      (k.niveau > 0 ? "<div class='xp-bonus-actifs'><span class='xp-bonus-ligne'>📦 Production ×" + Math.pow(1.1, k.niveau).toFixed(2) + "</span><span class='xp-bonus-ligne'>⚡ Raw Power +" + k.niveau + "</span></div>" : "<div class='xp-bonus-actifs xp-bonus-vide'>No bonuses yet — feed your kitty!</div>") +
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
  renduPurrks(u);
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
let exploTabDirty  = true;
let exploModalOuvert = null;  // { campId, slotIndex } or null

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
  if (id === "schoolGuide") return "📚 School guide on jobs";
  return id;
}

function renderCampaignCards() {
  const listeEl = document.getElementById("liste-campaigns");
  if (!listeEl) return;

  const campDefs = Object.values(CONFIG.campaigns);
  let html = "";

  campDefs.forEach(function(camp) {
    const completed  = etat.campaignsCompletees.includes(camp.id);
    const inProgress = etat.exploEnCours.find(function(e) { return e.id === camp.id; });

    // Ensure slot array is initialised
    if (!exploKittiesSelectionnees[camp.id]) {
      exploKittiesSelectionnees[camp.id] = new Array(camp.slots).fill(null);
    }
    const slots = exploKittiesSelectionnees[camp.id];

    html += '<div class="explo-card">';
    html += '<div class="explo-nom">' + camp.nom + '</div>';
    html += '<div class="explo-description">' + camp.description + '</div>';

    if (completed) {
      html += '<div class="explo-complete">✅ Completed — ' + recompenseLabel(camp.recompense) + ' received</div>';

    } else if (inProgress) {
      const elapsed   = (Date.now() - inProgress.startTs) / 1000;
      const remaining = Math.max(0, inProgress.duree - elapsed);
      const progress  = Math.min(1, elapsed / inProgress.duree);
      const names     = inProgress.kittyIndices.map(function(i) {
        return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
      }).join(", ");
      const power  = inProgress.kittyIndices.reduce(function(s, i) {
        return s + (etat.kittiesData[i] ? etat.kittiesData[i].niveau : 1);
      }, 0);
      const chance = Math.min(100, Math.round(power / camp.difficulte * 100));

      html += '<div class="explo-meta">⚔️ Difficulty ' + camp.difficulte + ' &nbsp;·&nbsp; 🐱 ' + names + ' &nbsp;·&nbsp; ' + chance + '% success</div>';
      html += '<div class="conteneur-barre"><div class="barre barre-explo" id="explo-barre-' + camp.id + '" style="width:' + Math.round(progress * 100) + '%"></div></div>';
      html += '<div class="explo-timer" id="explo-timer-' + camp.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';

    } else {
      // Available — show slot buttons
      const selPower = slots.reduce(function(s, ki) {
        return s + (ki !== null && etat.kittiesData[ki] ? etat.kittiesData[ki].niveau : 0);
      }, 0);
      const allFilled = slots.every(function(x) { return x !== null; });
      const chance    = selPower > 0 ? Math.min(100, Math.round(selPower / camp.difficulte * 100)) : 0;

      html += '<div class="explo-meta">⚔️ Difficulty ' + camp.difficulte + ' &nbsp;·&nbsp; ⏱ ' + camp.duree + 's &nbsp;·&nbsp; 🎁 ' + recompenseLabel(camp.recompense) + '</div>';

      html += '<div class="explo-slots">';
      for (let si = 0; si < camp.slots; si++) {
        const ki = slots[si];
        if (ki === null) {
          html += '<div class="explo-slot explo-slot-empty" onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
          html += '<div class="explo-slot-plus">+</div>';
          html += '<div class="explo-slot-label">Add kitty</div>';
          html += '</div>';
        } else {
          const k = etat.kittiesData[ki];
          html += '<div class="explo-slot explo-slot-filled" onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
          html += '<span class="explo-slot-emoji">🐱</span>';
          html += '<div class="explo-slot-kitty-info">';
          html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
          html += '<span class="explo-slot-kitty-power">⚡ ' + (k ? k.niveau : 1) + '</span>';
          html += '</div>';
          html += '<button class="explo-slot-remove" onclick="retirerKittySlot(\'' + camp.id + '\',' + si + ');event.stopPropagation()">✕</button>';
          html += '</div>';
        }
      }
      html += '</div>';

      if (selPower > 0) {
        html += '<div class="explo-power-display">Power: ' + selPower + ' / ' + camp.difficulte + ' — <strong>' + chance + '%</strong> success</div>';
      } else {
        html += '<div class="explo-power-display explo-power-hint">Click a slot to assign a kitty.</div>';
      }

      html += '<button class="btn-lancer-explo"' + (allFilled ? '' : ' disabled') +
              ' onclick="lancerExplo(\'' + camp.id + '\')">Send on campaign ➤</button>';
    }

    html += '</div>';
  });

  listeEl.innerHTML = html;
}

function renduExplorations(u) {
  if (!u || !u.exploration) return;

  if (exploTabDirty) {
    renderCampaignCards();
    exploTabDirty = false;
  }

  // Update timers for in-progress explorations
  etat.exploEnCours.forEach(function(explo) {
    const elapsed   = (Date.now() - explo.startTs) / 1000;
    const remaining = Math.max(0, explo.duree - elapsed);
    const progress  = Math.min(1, elapsed / explo.duree);
    const timerEl   = document.getElementById("explo-timer-" + explo.id);
    const barEl     = document.getElementById("explo-barre-" + explo.id);
    if (timerEl) timerEl.textContent = formaterTempsStat(Math.ceil(remaining)) + " remaining";
    if (barEl)   barEl.style.width   = Math.round(progress * 100) + "%";
  });
}

function ouvrirModalExplo(campId, slotIndex) {
  exploModalOuvert = { campId: campId, slotIndex: slotIndex };
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
  const { campId, slotIndex } = exploModalOuvert;
  let html = "";

  etat.kittiesData.forEach(function(k, i) {
    const onExplo      = kittyIsOnExpedition(i);
    const inOtherSlot  = kittyDejaSelectionnee(i, campId, slotIndex);
    const inWorker     = kittyIsInWorkerSlot(i);
    const inTraining   = kittyIsInTraining(i);
    const disabled     = onExplo || inOtherSlot || inWorker || inTraining;
    let statusLabel    = onExplo ? "on expedition" : inTraining ? "in training" : inWorker ? "assigned to work" : inOtherSlot ? "in another slot" : "";

    html += '<div class="explo-modal-kitty' + (disabled ? ' explo-modal-kitty-disabled' : '') + '"' +
            (disabled ? '' : ' onclick="selectionnerKittySlot(' + i + ')"') + '>';
    html += '<span class="explo-modal-kitty-emoji">🐱</span>';
    html += '<div class="explo-modal-kitty-info">';
    html += '<span class="explo-modal-kitty-nom">' + k.nom + '</span>';
    html += '<span class="explo-modal-kitty-power">⚡ Power ' + k.niveau + '</span>';
    if (statusLabel) html += '<span class="explo-modal-kitty-status">' + statusLabel + '</span>';
    html += '</div>';
    html += '</div>';
  });

  conteneurEl.innerHTML = html || '<p class="explo-vide">No kitties available.</p>';
}

function selectionnerKittySlot(kittyIndex) {
  if (!exploModalOuvert) return;
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
  etat.exploEnCours.push({ id: id, kittyIndices: kittyIndices, startTs: Date.now(), duree: camp.duree });
  exploKittiesSelectionnees[id] = new Array(camp.slots).fill(null);
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExplo(explo) {
  const camp = CONFIG.campaigns[explo.id];
  if (!camp) return;

  const power   = explo.kittyIndices.reduce(function(s, i) {
    return s + (etat.kittiesData[i] ? etat.kittiesData[i].niveau : 1);
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
  if (!cout) return "";
  const parts = [];
  if (cout.purrfection) parts.push(cout.purrfection + " ✨");
  return parts.join(", ");
}

function peutPayerAction(cout) {
  if (!cout) return true;
  if (cout.purrfection && etat.purrfection < cout.purrfection) return false;
  return true;
}

function actionItem(itemId, actionId) {
  if (itemId === "schoolGuide" && actionId === "learn") {
    if (etat.itemsAppris.includes("schoolGuide")) return;
    if (etat.purrfection < 10) { afficherNotification("⚠️ Need 10 ✨ Purrfection!"); return; }
    etat.purrfection -= 10;
    etat.itemsAppris.push("schoolGuide");
    etat.jobCenterDebloque = true;
    inventaireDirty = true;
    afficherNotification("🏫 Job Center unlocked! Build it in Buildings.");
    ajouterLog("unlock", "🏫 Job Center unlocked — build it from the Buildings tab.");
    sauvegarder(); rendu();
  }
}

function renduInventaire(u) {
  // Items list — only rebuild when dirty (avoids killing click events every 100ms)
  if (inventaireDirty) {
    renderItemsList();
    inventaireDirty = false;
  }

  // Resources — no interactive elements, safe to update every tick
  const resEl = document.getElementById("inv-resources");
  if (!resEl) return;

  const ressources = [
    { label: "Cardboard Pieces", sprite: "img/resources/Cardboard Pieces_Final.png", val: etat.cardboardPieces,   visible: u.cathering    },
    { label: "Basic Wood",       sprite: "img/resources/Basic Wood_Final.png",        val: etat.basicWood,         visible: u.basicWood    },
    { label: "Catnip",           sprite: "img/resources/Catnip_Final.png",            val: etat.catnip,            visible: u.grasscat     },
    { label: "Pebbles",          sprite: "img/resources/Pebbles_Final.png",           val: etat.pebbles,           visible: u.pebblecat    },
    { label: "Cardboard Planks", sprite: "img/resources/Cardboard Plank_Final.png",   val: etat.cardboardPlanks,   visible: u.scierie      },
    { label: "Basic Wood Planks",sprite: "img/resources/Basic Wood Plank_Final.png",  val: etat.basicWoodPlanks,   visible: u.basicSawmill },
    { label: "Pebble Bricks",    sprite: "img/resources/Pebble Brick_Final.png",      val: etat.pebbleBricks,      visible: u.brickfact    },
    { label: "Salads",           sprite: "img/resources/Catnip Salad_Final.png",      val: etat.salads,            visible: u.catchen      },
    { label: "Purrfection",      sprite: "img/resources/Purrfection_Final.png",       val: etat.purrfection,       visible: true           }
  ];

  let resHtml = '<div class="inv-res-grille">';
  let anyVisible = false;
  ressources.forEach(function(r) {
    if (!r.visible) return;
    anyVisible = true;
    resHtml += '<div class="inv-res-cell" data-tooltip="' + r.label + '">';
    resHtml += '<img class="inv-res-sprite" src="' + r.sprite + '" alt="' + r.label + '">';
    resHtml += '<span class="inv-res-qty">' + formaterNombre(Math.floor(r.val)) + '</span>';
    resHtml += '</div>';
  });
  resHtml += '</div>';
  resEl.innerHTML = anyVisible ? resHtml : '<p class="inv-vide">No resources yet.</p>';
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
      } else if (item.actions && item.actions.length > 0) {
        item.actions.forEach(function(action) {
          const coutLabel = actionCoutLabel(action.cout);
          const peutPayer = peutPayerAction(action.cout);
          html += '<div class="inv-action-row">';
          html += '<button class="btn-inv-action"' + (peutPayer ? "" : " disabled") +
                  ' onclick="actionItem(\'' + itemId + '\',\'' + action.id + '\');event.stopPropagation()">';
          html += action.label;
          if (coutLabel) html += ' <span class="inv-action-cout">(' + coutLabel + ')</span>';
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
    if (titreEl) titreEl.textContent = "🐱 Choose a Stray Cat";
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
    const bonusTxt = m ? '<span class="bonus-var">×' + kitty.managerMult + '</span> production speed on ' + m.familleNom : '';
    el.innerHTML = '<div class="manager-slot-filled">'
      + '<div class="manager-cercle kitty-photo-tier-' + tierIdx + '">🐱</div>'
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
          '<div class="worker-ring-inner">🐱</div>' +
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
    html += '<span class="worker-modal-kitty-emoji">🐱</span>';
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
      html += '<span class="jc-slot-emoji">' + (m ? m.emoji : "🐱") + '</span>';
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
        html += '<span class="jc-slot-emoji">🐱</span>';
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
  if (etat.cardboardPieces < cout) return;
  etat.cardboardPieces -= cout;
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
  if (etat.basicWood < cout) return;
  etat.basicWood -= cout;
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
  assignerGangLeader();
  jcDirty = true;
  afficherNotification("🏫 Job Center built!");
  ajouterLog("event", "🏫 Job Center built — ready to assign jobs to kitties.");
  sauvegarder(); rendu();
}

function acheterPurrk(id) {
  const cfg = CONFIG.ameliorations[id];
  if (etat.ameliorations[id] || etat.cardboardPlanks < cfg.cout) return;
  etat.cardboardPlanks -= cfg.cout;
  etat.ameliorations[id] = true;
  afficherNotification("✨ Purrk unlocked!");
  ajouterLog("unlock", "✨ Purrk unlocked: " + id + ".");
  verifierObjectifs(); sauvegarder(); rendu();
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
    if (etat.formationEnCours) {
      etat.formationEnCours.startTs -= avance;
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
          if (first) {
            afficherNotification("✨ Purrks unlocked! Spend your planks wisely.");
            ajouterLog("unlock", "✨ Purrks unlocked — spend your planks wisely.");
          }
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
    cardboardPlanks: etat.cardboardPlanks, pebbleBricks: etat.pebbleBricks, salads: etat.salads
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
    ["🥗 Salads",           resume.salads]
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
      "Bernardo: *Miaou miaou.* (Don't mention the claw marks. Act natural, Mochi.)",
      "Mochi: *Miaou.* (He said act natural, not look smug.)",
      "Kid: \"I'm pretty sure I saw another one near the park earlier...\"",
      "Bernardo: *Miaou miaou miaou.* (That's Luna. The plan is coming together faster than expected.)"
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
  ["gang", "work", "buildings", "purrks", "explorations", "inventaire", "logs"].forEach(function(tab) {
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
