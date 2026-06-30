// ════════════════════════════════════════════════════════════
// 1. CONSTANTS & CONFIG
// ════════════════════════════════════════════════════════════

const CONFIG = {
  cathouse: {
    coutBase:            5,
    croissance:          3,
    reductionParSeconde: 1
  },
  woodcatting:     { secondesParUnite: 60 },
  grasscatting:    { secondesParUnite: 60 },
  pebblegathering: { deblocageA: 8,  secondesParUnite: 60 },
  sawmill: {
    deblocageA:         20,
    secondesParPlanche: 300,
    secondesParBois:    60
  },
  brickfactory: {
    deblocageA:        20,
    secondesParBrique: 300,
    secondesParPebble: 30   // 10 pebbles per brick
  },
  catchen: {
    deblocageA:          10,
    secondesParPurritto: 300,
    secondesParCatnip:   60,
    boostDuree:          60
  },
  ameliorations: {
    purrfectCathouse: { cout: 1, bonusParCathouse: 0.5 },
    sharpClaws:       { cout: 5, bonusParChaton:   0.5 }
  },
  purrittoMax: 1
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

const VITESSES = [1, 2, 5, 10];

const OBJECTIFS = [
  {
    id: "firstKitty",   label: "Catch your first kitty",
    visible:  function(e) { return true; },
    accompli: function(e) { return e.chatons >= 1; }
  },
  {
    id: "secondKitty",  label: "Catch a second kitty",
    visible:  function(e) { return e.chatons >= 1; },
    accompli: function(e) { return e.chatons >= 2; }
  },
  {
    id: "firstWoodcatter", label: "Put a kitty to work chopping wood",
    visible:  function(e) { return e.chatons >= 2; },
    accompli: function(e) { return e.allocation.woodcatting >= 1; }
  },
  {
    id: "unlockBuildings", label: "Collect 5 wood to unlock Buildings",
    visible:  function(e) { return e.allocation.woodcatting >= 1; },
    accompli: function(e) { return e.woodTotalRecolte >= 5; }
  },
  {
    id: "firstCathouse", label: "Build your first Cathouse",
    visible:  function(e) { return e.woodTotalRecolte >= 5; },
    accompli: function(e) { return e.cathouses.length >= 1; }
  },
  {
    id: "fiveKitties", label: "Catch 5 kitties to unlock Grasscatting",
    visible:  function(e) { return e.chatons >= 2; },
    accompli: function(e) { return e.chatons >= 5; }
  },
  {
    id: "firstGrasscatter", label: "Put a kitty to gather catnip",
    visible:  function(e) { return e.chatons >= 5; },
    accompli: function(e) { return e.allocation.grasscatting >= 1; }
  },
  {
    id: "unlockSawmill", label: "Collect 20 wood to unlock the Sawmill",
    visible:  function(e) { return e.woodTotalRecolte >= 5; },
    accompli: function(e) { return e.woodTotalRecolte >= 20; }
  },
  {
    id: "firstSawmillWorker", label: "Assign a kitty to the Sawmill",
    visible:  function(e) { return e.woodTotalRecolte >= 20; },
    accompli: function(e) { return e.allocation.sawmill >= 1; }
  },
  {
    id: "firstPlank", label: "Craft your first Plank",
    visible:  function(e) { return e.allocation.sawmill >= 1; },
    accompli: function(e) { return e.planks >= 1 || e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; }
  },
  {
    id: "unlockCatchen", label: "Collect 10 catnip to unlock The Catchen",
    visible:  function(e) { return e.allocation.grasscatting >= 1; },
    accompli: function(e) { return e.catnipTotalRecolte >= 10; }
  },
  {
    id: "firstPurritto", label: "Cook your first Purritto",
    visible:  function(e) { return e.catnipTotalRecolte >= 10; },
    accompli: function(e) { return e.purrittos >= 1 || e.boosts.woodcatting.actif || e.boosts.grasscatting.actif; }
  },
  {
    id: "firstPurrk", label: "Unlock your first Purrk",
    visible:  function(e) { return e.planks >= 1 || e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; },
    accompli: function(e) { return e.ameliorations.purrfectCathouse || e.ameliorations.sharpClaws; }
  }
];


// ════════════════════════════════════════════════════════════
// 2. GAME STATE
// ════════════════════════════════════════════════════════════

const etat = {
  // Resources
  chatons:              0,
  wood:                 0,  woodTotalRecolte:    0,
  catnip:               0,  catnipTotalRecolte:  0,
  pebbles:              0,  pebblesTotalRecolte: 0,
  planks:               0,
  bricks:               0,
  purrittos:            0,
  purrfection:          0,

  // Catch sequence
  sequenceEnCours:         false,
  sequenceDebutTs:         0,
  sequenceDuree:           0,
  clicCount:               0,
  reductionAuMomentDuClic: 0,

  // Production accumulators
  secondesWoodCumulees:     0,
  secondesGrassCumulees:    0,
  secondesPebbleCumulees:   0,
  secondesPlanCumulees:     0,
  secondesBrickCumulees:    0,
  secondesPurrittoCumulees: 0,

  // Processing blocked flags
  scieriBloquee:  false,
  brickBloquee:   false,
  catchenBloquee: false,

  // Cathouse reduction accumulator (virtual seconds)
  reductionCumulee: 0,

  // Boost timers
  boosts: {
    woodcatting:     { actif: false, finTs: 0 },
    grasscatting:    { actif: false, finTs: 0 },
    pebblegathering: { actif: false, finTs: 0 }
  },

  // Kitty allocation per job
  allocation: {
    woodcatting: 0, grasscatting: 0, pebblegathering: 0,
    sawmill: 0, brickfactory: 0, catchen: 0
  },

  ameliorations: { purrfectCathouse: false, sharpClaws: false },
  cathouses:     [],
  kittiesData:   [],   // { nom, metier, niveau, tier, catchTs }
  objectifsComplis: [],
  logs:          [],

  // Last real-world timestamp the game state was saved (for offline progress)
  dernierTimestamp: Date.now()
};


// ════════════════════════════════════════════════════════════
// 3. DERIVED VALUES & CALCULATIONS
// ════════════════════════════════════════════════════════════

function totalAlloue() {
  return Object.values(etat.allocation).reduce(function(s, n) { return s + n; }, 0);
}
function chatonsLibres() { return etat.chatons - totalAlloue(); }

function reductionParCathouse() {
  const bonus = etat.ameliorations.purrfectCathouse
    ? CONFIG.ameliorations.purrfectCathouse.bonusParCathouse : 0;
  return CONFIG.cathouse.reductionParSeconde + bonus;
}

function reductionTotale() {
  return etat.reductionCumulee;
}

function productionParChaton(action) {
  const base  = 1 + (etat.ameliorations.sharpClaws && action === "woodcatting"
    ? CONFIG.ameliorations.sharpClaws.bonusParChaton : 0);
  const boost = etat.boosts[action] && etat.boosts[action].actif ? 2 : 1;
  return base * boost;
}

function dureeBrute()     { return Math.pow(5, etat.clicCount); }
function dureeEffective() { return Math.max(1, dureeBrute() - reductionTotale()); }

function tempsRestantSequence() {
  if (!etat.sequenceEnCours) return 0;
  const reductionDepuis = reductionTotale() - etat.reductionAuMomentDuClic;
  const ecouleBrut = (Date.now() - etat.sequenceDebutTs) / 1000;
  return Math.max(0, etat.sequenceDuree - ecouleBrut - reductionDepuis);
}

function progressionSequence() {
  if (!etat.sequenceEnCours) return 0;
  const reductionDepuis = reductionTotale() - etat.reductionAuMomentDuClic;
  const ecouleBrut = (Date.now() - etat.sequenceDebutTs) / 1000;
  return Math.min(1, (ecouleBrut + reductionDepuis) / etat.sequenceDuree);
}

function coutProchaineCathouse() {
  return Math.ceil(CONFIG.cathouse.coutBase * Math.pow(CONFIG.cathouse.croissance, etat.cathouses.length));
}

function boostRestant(action) {
  if (!etat.boosts[action] || !etat.boosts[action].actif) return 0;
  return Math.max(0, Math.ceil((etat.boosts[action].finTs - Date.now()) / 1000));
}


// ════════════════════════════════════════════════════════════
// 4. UNLOCK CONDITIONS
// ════════════════════════════════════════════════════════════

function catheringDebloquee()       { return etat.chatons >= 2; }
function grasscattingDebloquee()    { return etat.chatons >= 5; }
function pebblegatheringDebloquee() { return etat.chatons >= CONFIG.pebblegathering.deblocageA; }
function buildingsDebloques()       { return etat.woodTotalRecolte >= 5; }
function scierieDebloquee()         { return etat.woodTotalRecolte >= CONFIG.sawmill.deblocageA; }
function brickfactoryDebloquee()    { return etat.pebblesTotalRecolte >= CONFIG.brickfactory.deblocageA; }
function pawcessingDebloquee()      { return scierieDebloquee(); }
function catchenDebloquee()         { return etat.catnipTotalRecolte >= CONFIG.catchen.deblocageA; }
function purrksDebloques()          { return etat.planks >= 1 || etat.ameliorations.purrfectCathouse || etat.ameliorations.sharpClaws; }


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
    chatons:              etat.chatons,
    wood:                 etat.wood,              woodTotalRecolte:    etat.woodTotalRecolte,
    catnip:               etat.catnip,            catnipTotalRecolte:  etat.catnipTotalRecolte,
    pebbles:              etat.pebbles,           pebblesTotalRecolte: etat.pebblesTotalRecolte,
    planks:               etat.planks,
    bricks:               etat.bricks,
    purrittos:            etat.purrittos,
    purrfection:          etat.purrfection,
    sequenceEnCours:         etat.sequenceEnCours,
    sequenceDebutTs:         etat.sequenceDebutTs,
    sequenceDuree:           etat.sequenceDuree,
    clicCount:               etat.clicCount,
    reductionAuMomentDuClic: etat.reductionAuMomentDuClic,
    secondesWoodCumulees:     etat.secondesWoodCumulees,
    secondesGrassCumulees:    etat.secondesGrassCumulees,
    secondesPebbleCumulees:   etat.secondesPebbleCumulees,
    secondesPlanCumulees:     etat.secondesPlanCumulees,
    secondesBrickCumulees:    etat.secondesBrickCumulees,
    secondesPurrittoCumulees: etat.secondesPurrittoCumulees,
    scieriBloquee:    etat.scieriBloquee,
    brickBloquee:     etat.brickBloquee,
    catchenBloquee:   etat.catchenBloquee,
    reductionCumulee: etat.reductionCumulee,
    boosts:        etat.boosts,
    allocation:    etat.allocation,
    ameliorations: etat.ameliorations,
    cathouses:     etat.cathouses,
    kittiesData:   etat.kittiesData,
    objectifsComplis: etat.objectifsComplis,
    logs:          etat.logs
  }));
}

function charger() {
  const raw = localStorage.getItem("chatonClicker");
  if (!raw) return false;
  const d = JSON.parse(raw);

  etat.dernierTimestamp    = d.dernierTimestamp    || Date.now();
  etat.chatons             = d.chatons             || 0;
  etat.wood                = d.wood                || 0;
  etat.woodTotalRecolte    = d.woodTotalRecolte    || 0;
  etat.catnip              = d.catnip              || 0;
  etat.catnipTotalRecolte  = d.catnipTotalRecolte  || 0;
  etat.pebbles             = d.pebbles             || 0;
  etat.pebblesTotalRecolte = d.pebblesTotalRecolte || 0;
  etat.planks              = d.planks              || 0;
  etat.bricks              = d.bricks              || 0;
  etat.purrittos           = d.purrittos           || 0;
  etat.purrfection         = d.purrfection         || 0;

  etat.sequenceEnCours         = d.sequenceEnCours         || false;
  etat.sequenceDebutTs         = d.sequenceDebutTs         || 0;
  etat.sequenceDuree           = d.sequenceDuree           || 0;
  etat.clicCount               = d.clicCount               || 0;
  etat.reductionAuMomentDuClic = d.reductionAuMomentDuClic || 0;

  etat.secondesWoodCumulees     = d.secondesWoodCumulees     || 0;
  etat.secondesGrassCumulees    = d.secondesGrassCumulees    || 0;
  etat.secondesPebbleCumulees   = d.secondesPebbleCumulees   || 0;
  etat.secondesPlanCumulees     = d.secondesPlanCumulees     || 0;
  etat.secondesBrickCumulees    = d.secondesBrickCumulees    || 0;
  etat.secondesPurrittoCumulees = d.secondesPurrittoCumulees || 0;

  etat.scieriBloquee    = d.scieriBloquee    || false;
  etat.brickBloquee     = d.brickBloquee     || false;
  etat.catchenBloquee   = d.catchenBloquee   || false;
  // Migration: compute reduction from old timestamp-based saves
  etat.reductionCumulee = d.reductionCumulee !== undefined
    ? d.reductionCumulee
    : (d.cathouses || []).reduce(function(total, ts) {
        return total + Math.floor((Date.now() - ts) / 1000) * (d.ameliorations && d.ameliorations.purrfectCathouse ? 1.5 : 1);
      }, 0);

  etat.boosts = d.boosts || {
    woodcatting:     { actif: false, finTs: 0 },
    grasscatting:    { actif: false, finTs: 0 },
    pebblegathering: { actif: false, finTs: 0 }
  };
  // Migration: add boost keys added in later versions
  if (!etat.boosts.pebblegathering) etat.boosts.pebblegathering = { actif: false, finTs: 0 };

  etat.allocation = d.allocation || {
    woodcatting: 0, grasscatting: 0, pebblegathering: 0,
    sawmill: 0, brickfactory: 0, catchen: 0
  };
  // Migration: add allocation keys added in later versions
  if (etat.allocation.pebblegathering === undefined) etat.allocation.pebblegathering = 0;
  if (etat.allocation.brickfactory    === undefined) etat.allocation.brickfactory    = 0;

  etat.ameliorations   = d.ameliorations   || { purrfectCathouse: false, sharpClaws: false };
  etat.cathouses       = d.cathouses       || [];
  etat.objectifsComplis = d.objectifsComplis || [];
  etat.logs            = d.logs            || [];
  etat.kittiesData     = d.kittiesData     || [];

  // Migration: backfill kittiesData if save predates the feature
  while (etat.kittiesData.length < etat.chatons) {
    const nom = NOMS_KITTIES[etat.kittiesData.length] || ("Kitty #" + (etat.kittiesData.length + 1));
    etat.kittiesData.push({ nom: nom, metier: null, niveau: 1, tier: 0, catchTs: null });
  }
  return true;
}

function reset() {
  if (!confirm("Start over from scratch?")) return;
  localStorage.removeItem("chatonClicker");
  localStorage.removeItem("introVue");
  localStorage.removeItem("story1Vue");
  localStorage.removeItem("story2Vue");
  Object.assign(etat, {
    chatons: 0, wood: 0, woodTotalRecolte: 0,
    catnip: 0, catnipTotalRecolte: 0,
    pebbles: 0, pebblesTotalRecolte: 0,
    planks: 0, bricks: 0, purrittos: 0, purrfection: 0,
    sequenceEnCours: false, sequenceDebutTs: 0, sequenceDuree: 0,
    clicCount: 0, reductionAuMomentDuClic: 0,
    secondesWoodCumulees: 0, secondesGrassCumulees: 0, secondesPebbleCumulees: 0,
    secondesPlanCumulees: 0, secondesBrickCumulees: 0, secondesPurrittoCumulees: 0,
    scieriBloquee: false, brickBloquee: false, catchenBloquee: false, reductionCumulee: 0,
    boosts: {
      woodcatting:     { actif: false, finTs: 0 },
      grasscatting:    { actif: false, finTs: 0 },
      pebblegathering: { actif: false, finTs: 0 }
    },
    allocation: { woodcatting: 0, grasscatting: 0, pebblegathering: 0, sawmill: 0, brickfactory: 0, catchen: 0 },
    ameliorations: { purrfectCathouse: false, sharpClaws: false },
    cathouses: [], kittiesData: [], objectifsComplis: [], logs: [],
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
    el.className   = "obj-entry obj-actif";
    el.textContent = obj.label;
    elActifs.appendChild(el);
  });

  elSection.style.display = complis.length > 0 ? "block" : "none";
  elComplis.innerHTML = "";
  complis.slice().reverse().forEach(function(obj) {
    const el = document.createElement("div");
    el.className   = "obj-entry obj-compli";
    el.textContent = "✓ " + obj.label;
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
    libres:     chatonsLibres(),
    cathering:  catheringDebloquee(),
    grasscat:   grasscattingDebloquee(),
    pebblecat:  pebblegatheringDebloquee(),
    buildings:  buildingsDebloques(),
    scierie:    scierieDebloquee(),
    brickfact:  brickfactoryDebloquee(),
    pawcessing: pawcessingDebloquee(),
    catchen:    catchenDebloquee(),
    purrks:     purrksDebloques()
  };
}

// ── 9a. Resources bar
function renduRessources(u) {
  document.getElementById("val-purrfection").textContent = etat.purrfection;
  document.getElementById("val-chatons").textContent     = formaterNombre(etat.chatons);
  document.getElementById("val-wood").textContent        = formaterNombre(etat.wood);
  document.getElementById("val-catnip").textContent      = formaterNombre(etat.catnip);
  document.getElementById("val-pebbles").textContent     = formaterNombre(etat.pebbles);
  document.getElementById("val-planks").textContent      = formaterNombre(etat.planks);
  document.getElementById("val-bricks").textContent      = formaterNombre(etat.bricks);
  document.getElementById("val-purrittos").textContent   = etat.purrittos + "/" + CONFIG.purrittoMax;

  document.getElementById("onglet-work").style.display      = u.cathering  ? "inline-block" : "none";
  document.getElementById("onglet-buildings").style.display = u.buildings  ? "inline-block" : "none";
  document.getElementById("onglet-purrks").style.display    = u.purrks     ? "inline-block" : "none";
  document.getElementById("row-wood").style.display       = u.cathering ? "flex" : "none";
  document.getElementById("row-catnip").style.display    = u.grasscat  ? "flex" : "none";
  document.getElementById("row-pebbles").style.display   = u.pebblecat ? "flex" : "none";
  document.getElementById("row-planks").style.display    = u.scierie   ? "flex" : "none";
  document.getElementById("row-bricks").style.display    = u.brickfact ? "flex" : "none";
  document.getElementById("row-purrittos").style.display = u.catchen   ? "flex" : "none";

  const prodWood    = u.cathering ? etat.allocation.woodcatting * productionParChaton("woodcatting") / CONFIG.woodcatting.secondesParUnite : 0;
  const consWood    = (!etat.scieriBloquee) ? etat.allocation.sawmill / CONFIG.sawmill.secondesParBois : 0;
  afficherTauxNet("taux-wood", prodWood - consWood);

  const prodCatnip  = u.grasscat ? etat.allocation.grasscatting * productionParChaton("grasscatting") / CONFIG.grasscatting.secondesParUnite : 0;
  const consCatnip  = (!etat.catchenBloquee && etat.purrittos < CONFIG.purrittoMax) ? etat.allocation.catchen / CONFIG.catchen.secondesParCatnip : 0;
  afficherTauxNet("taux-catnip", prodCatnip - consCatnip);

  const prodPebble  = u.pebblecat ? etat.allocation.pebblegathering * productionParChaton("pebblegathering") / CONFIG.pebblegathering.secondesParUnite : 0;
  const consPebble  = (!etat.brickBloquee) ? etat.allocation.brickfactory / CONFIG.brickfactory.secondesParPebble : 0;
  afficherTauxNet("taux-pebbles", prodPebble - consPebble);

  const prodPlanks  = (u.scierie && !etat.scieriBloquee) ? etat.allocation.sawmill / CONFIG.sawmill.secondesParPlanche : 0;
  afficherTauxNet("taux-planks", prodPlanks);

  const prodBricks  = (u.brickfact && !etat.brickBloquee) ? etat.allocation.brickfactory / CONFIG.brickfactory.secondesParBrique : 0;
  afficherTauxNet("taux-bricks", prodBricks);
}

function afficherTauxNet(elementId, net) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (Math.abs(net) < 0.0005) {
    el.textContent = "";
    el.classList.remove("ressource-taux-positif", "ressource-taux-negatif");
    return;
  }
  el.textContent = (net > 0 ? "+" : "") + net.toFixed(2) + "/s";
  el.classList.toggle("ressource-taux-positif", net > 0);
  el.classList.toggle("ressource-taux-negatif", net < 0);
}

// ── 9b. Catch sequence (header)
function renduSequence() {
  const enCours = etat.sequenceEnCours;
  const restant = tempsRestantSequence();
  document.getElementById("bouton-sequence").disabled    = enCours;
  document.getElementById("bouton-sequence").textContent = enCours
    ? "Catching... " + formaterTemps(restant) : "Catch a kitty 🐾";
  document.getElementById("conteneur-barre-sequence").style.display = enCours ? "block" : "none";
  setBarreProgress("barre-sequence", progressionSequence());
  document.getElementById("info-sequence").textContent   = enCours ? ""
    : (etat.clicCount === 0 ? "First kitty: 1s" : "Next cooldown: " + formaterTemps(dureeEffective()));
}

// ── 9c. Cathering section
function renduCathering(u) {
  if (!u.cathering) return;

  const lib = u.libres;

  // Woodcatting
  setBarreProgress("barre-woodcatting", etat.secondesWoodCumulees / CONFIG.woodcatting.secondesParUnite);
  document.getElementById("alloues-woodcatting").textContent    = etat.allocation.woodcatting;
  document.getElementById("libres-woodcatting").textContent     = lib;
  document.getElementById("btn-allouer-woodcatting").disabled   = lib <= 0;
  document.getElementById("btn-deallouer-woodcatting").disabled = etat.allocation.woodcatting <= 0;
  const bwc = boostRestant("woodcatting");
  document.getElementById("boost-woodcatting").textContent      = bwc > 0 ? "🔥 Boosted (" + formaterTemps(bwc) + ")" : "";
  document.getElementById("btn-boost-woodcatting").disabled     = etat.purrittos < 1 || etat.boosts.woodcatting.actif || etat.allocation.woodcatting === 0;

  // Grasscatting
  document.getElementById("sep-grasscatting").style.display     = u.grasscat ? "block" : "none";
  if (u.grasscat) {
    setBarreProgress("barre-grasscatting", etat.secondesGrassCumulees / CONFIG.grasscatting.secondesParUnite);
    document.getElementById("alloues-grasscatting").textContent    = etat.allocation.grasscatting;
    document.getElementById("libres-grasscatting").textContent     = lib;
    document.getElementById("btn-allouer-grasscatting").disabled   = lib <= 0;
    document.getElementById("btn-deallouer-grasscatting").disabled = etat.allocation.grasscatting <= 0;
    const bgc = boostRestant("grasscatting");
    document.getElementById("boost-grasscatting").textContent      = bgc > 0 ? "🔥 Boosted (" + formaterTemps(bgc) + ")" : "";
    document.getElementById("btn-boost-grasscatting").disabled     = etat.purrittos < 1 || etat.boosts.grasscatting.actif || etat.allocation.grasscatting === 0;
  }

  // Pebblegathering
  document.getElementById("sep-pebblegathering").style.display  = u.pebblecat ? "block" : "none";
  if (u.pebblecat) {
    setBarreProgress("barre-pebblegathering", etat.secondesPebbleCumulees / CONFIG.pebblegathering.secondesParUnite);
    document.getElementById("alloues-pebblegathering").textContent    = etat.allocation.pebblegathering;
    document.getElementById("libres-pebblegathering").textContent     = lib;
    document.getElementById("btn-allouer-pebblegathering").disabled   = lib <= 0;
    document.getElementById("btn-deallouer-pebblegathering").disabled = etat.allocation.pebblegathering <= 0;
    const bpc = boostRestant("pebblegathering");
    document.getElementById("boost-pebblegathering").textContent      = bpc > 0 ? "🔥 Boosted (" + formaterTemps(bpc) + ")" : "";
    document.getElementById("btn-boost-pebblegathering").disabled     = etat.purrittos < 1 || etat.boosts.pebblegathering.actif || etat.allocation.pebblegathering === 0;
  }
}

// ── 9d. Buildings section
function renduBuildings(u) {
  if (!u.buildings) return;
  const cout = coutProchaineCathouse();
  document.getElementById("possede-cathouse").textContent = etat.cathouses.length;
  document.getElementById("cout-cathouse").textContent    = cout;
  document.getElementById("bouton-cathouse").disabled     = etat.wood < cout;
  document.getElementById("reduction-active").textContent = etat.cathouses.length > 0
    ? "Reduction: " + formaterTemps(reductionTotale()) : "";
}

// ── 9e. Paw-cessing section
function renduPawcessing(u) {
  document.getElementById("section-pawcessing").style.display = u.pawcessing ? "flex" : "none";
  if (!u.pawcessing) return;

  const lib = u.libres;

  // Sawmill
  const barreSaw = document.getElementById("barre-sawmill");
  setBarreProgress("barre-sawmill", etat.secondesPlanCumulees / CONFIG.sawmill.secondesParPlanche);
  barreSaw.classList.toggle("barre-bloquee", etat.scieriBloquee);
  barreSaw.classList.toggle("barre-marron",  !etat.scieriBloquee);
  document.getElementById("statut-sawmill").textContent      = etat.scieriBloquee ? "⏸ Waiting for wood..." : "";
  document.getElementById("alloues-sawmill").textContent     = etat.allocation.sawmill;
  document.getElementById("libres-sawmill").textContent      = lib;
  document.getElementById("btn-allouer-sawmill").disabled    = lib <= 0;
  document.getElementById("btn-deallouer-sawmill").disabled  = etat.allocation.sawmill <= 0;

  // Brick Factory
  document.getElementById("sep-brickfactory").style.display = u.brickfact ? "block" : "none";
  if (u.brickfact) {
    const barreBrick = document.getElementById("barre-brickfactory");
    setBarreProgress("barre-brickfactory", etat.secondesBrickCumulees / CONFIG.brickfactory.secondesParBrique);
    barreBrick.classList.toggle("barre-bloquee", etat.brickBloquee);
    barreBrick.classList.toggle("barre-bleue",   !etat.brickBloquee);
    document.getElementById("statut-brickfactory").textContent     = etat.brickBloquee ? "⏸ Waiting for pebbles..." : "";
    document.getElementById("alloues-brickfactory").textContent    = etat.allocation.brickfactory;
    document.getElementById("libres-brickfactory").textContent     = lib;
    document.getElementById("btn-allouer-brickfactory").disabled   = lib <= 0;
    document.getElementById("btn-deallouer-brickfactory").disabled = etat.allocation.brickfactory <= 0;
  }

  // Catchen
  document.getElementById("sep-catchen").style.display = u.catchen ? "block" : "none";
  if (u.catchen) {
    const plein    = etat.purrittos >= CONFIG.purrittoMax;
    const barreCat = document.getElementById("barre-catchen");
    setBarreProgress("barre-catchen", etat.secondesPurrittoCumulees / CONFIG.catchen.secondesParPurritto);
    barreCat.classList.toggle("barre-bloquee", etat.catchenBloquee);
    barreCat.classList.toggle("barre-verte",   !etat.catchenBloquee);
    document.getElementById("statut-catchen").textContent     = plein ? "⏸ Purritto bag full!" : etat.catchenBloquee ? "⏸ Waiting for catnip..." : "";
    document.getElementById("alloues-catchen").textContent    = etat.allocation.catchen;
    document.getElementById("libres-catchen").textContent     = lib;
    document.getElementById("btn-allouer-catchen").disabled   = lib <= 0;
    document.getElementById("btn-deallouer-catchen").disabled = etat.allocation.catchen <= 0;
  }
}

// ── 9f. Purrks section
function renduPurrks(u) {
  if (!u.purrks) return;
  const am    = etat.ameliorations;
  const btnPC = document.getElementById("bouton-purrfect-cathouse");
  btnPC.disabled    = am.purrfectCathouse || etat.planks < CONFIG.ameliorations.purrfectCathouse.cout;
  btnPC.textContent = am.purrfectCathouse ? "✓ Unlocked" : "1 📋";
  const btnSC = document.getElementById("bouton-sharp-claws");
  btnSC.disabled    = am.sharpClaws || etat.planks < CONFIG.ameliorations.sharpClaws.cout;
  btnSC.textContent = am.sharpClaws ? "✓ Unlocked" : "5 📋";
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
    photo.className   = "kitty-photo";
    photo.textContent = "🐱";

    const infos = document.createElement("div");
    infos.className = "kitty-infos";

    const tierIdx = kitty.tier || 0;

    const spans = [
      { cls: "kitty-nom",    txt: kitty.nom },
      { cls: "kitty-metier" + (kitty.metier ? "" : " kitty-vagabond"), txt: kitty.metier || "Stray Cat" },
      { cls: "kitty-niveau" + (kitty.metier ? "" : " kitty-niveau-bloque"), txt: kitty.metier ? "Lvl " + kitty.niveau : "Lvl — 🔒" },
      { cls: "kitty-tier kitty-tier-" + tierIdx, txt: "T" + tierIdx + " · " + TIERS_KITTIES[tierIdx] }
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
    "<div class=\"kitty-photo detail-photo\">🐱</div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Name</span><span class=\"detail-val\">" + k.nom + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Caught</span><span class=\"detail-val\">" + formaterCatchTime(k.catchTs) + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Level</span><span class=\"detail-val" + (k.metier ? "" : " detail-bloque") + "\">" + (k.metier ? "Level " + k.niveau : "— 🔒") + "</span></div>" +
    "<div class=\"detail-champ\"><span class=\"detail-label\">Tier</span><span class=\"detail-val kitty-tier kitty-tier-" + tierIdx + "\">T" + tierIdx + " · " + TIERS_KITTIES[tierIdx] + "</span></div>";

  // Right two-thirds: Job Details
  const droite = document.createElement("div");
  droite.className = "detail-droite";
  droite.innerHTML =
    "<h3 class=\"detail-titre\">Job Details</h3>" +
    "<div class=\"detail-job-nom" + (k.metier ? "" : " kitty-vagabond") + "\">" + (k.metier || "Stray Cat") + "</div>";

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
}


// ════════════════════════════════════════════════════════════
// 10. ACTIONS
// ════════════════════════════════════════════════════════════

// ── 10a. Catch sequence
document.getElementById("bouton-sequence").addEventListener("click", function() {
  if (etat.sequenceEnCours) return;
  etat.sequenceEnCours         = true;
  etat.sequenceDebutTs         = Date.now();
  etat.sequenceDuree           = etat.clicCount === 0 ? 1 : dureeEffective();
  etat.reductionAuMomentDuClic = reductionTotale();
  sauvegarder(); rendu();
});

function terminerSequence() {
  etat.sequenceEnCours = false;
  etat.chatons        += 1;
  etat.clicCount      += 1;
  const nom = NOMS_KITTIES[etat.kittiesData.length] || ("Kitty #" + (etat.kittiesData.length + 1));
  etat.kittiesData.push({ nom: nom, metier: null, niveau: 1, tier: 0, catchTs: Date.now() });
  afficherNotification("🐱 " + nom + " joined the gang!");
  ajouterLog("event", "🐱 " + nom + " caught!");
  renduManagement();
  if (etat.chatons === 2) {
    afficherNotification("🐾 Cathering unlocked! Put your kitties to work.");
    ajouterLog("unlock", "🐾 Cathering unlocked — put your kitties to work.");
  }
  if (etat.chatons === 5) {
    afficherNotification("🌿 Grasscatting unlocked!");
    ajouterLog("unlock", "🌿 Grasscatting unlocked!");
  }
  verifierStoryModals();
  sauvegarder(); rendu();
}

// ── 10b. Allocation
function makeAllocHandlers(action, btnPlusId, btnMinusId) {
  document.getElementById(btnPlusId).addEventListener("click", function() {
    if (chatonsLibres() <= 0) return;
    etat.allocation[action] += 1;
    verifierObjectifs(); sauvegarder(); rendu();
  });
  document.getElementById(btnMinusId).addEventListener("click", function() {
    if (etat.allocation[action] <= 0) return;
    etat.allocation[action] -= 1;
    sauvegarder(); rendu();
  });
}

makeAllocHandlers("woodcatting",     "btn-allouer-woodcatting",     "btn-deallouer-woodcatting");
makeAllocHandlers("grasscatting",    "btn-allouer-grasscatting",    "btn-deallouer-grasscatting");
makeAllocHandlers("pebblegathering", "btn-allouer-pebblegathering", "btn-deallouer-pebblegathering");
makeAllocHandlers("sawmill",         "btn-allouer-sawmill",         "btn-deallouer-sawmill");
makeAllocHandlers("brickfactory",    "btn-allouer-brickfactory",    "btn-deallouer-brickfactory");
makeAllocHandlers("catchen",         "btn-allouer-catchen",         "btn-deallouer-catchen");

// ── 10c. Buildings, Purrks, Boosts
function acheterCathouse() {
  const cout = coutProchaineCathouse();
  if (etat.wood < cout) return;
  etat.wood -= cout;
  etat.cathouses.push(Date.now());
  afficherNotification("🏠 Cathouse built!");
  ajouterLog("event", "🏠 Cathouse #" + etat.cathouses.length + " built!");
  verifierObjectifs(); sauvegarder(); rendu();
}

function acheterPurrk(id) {
  const cfg = CONFIG.ameliorations[id];
  if (etat.ameliorations[id] || etat.planks < cfg.cout) return;
  etat.planks -= cfg.cout;
  etat.ameliorations[id] = true;
  afficherNotification("✨ Purrk unlocked!");
  ajouterLog("unlock", "✨ Purrk unlocked: " + id + ".");
  verifierObjectifs(); sauvegarder(); rendu();
}

function activerBoost(action) {
  if (etat.purrittos < 1 || etat.boosts[action].actif || etat.allocation[action] === 0) return;
  etat.purrittos -= 1;
  etat.boosts[action].actif = true;
  etat.boosts[action].finTs = Date.now() + CONFIG.catchen.boostDuree * 1000;
  afficherNotification("🔥 " + action + " boosted for 60s!");
  sauvegarder(); rendu();
}

document.getElementById("btn-boost-woodcatting").addEventListener("click",     function() { activerBoost("woodcatting");     });
document.getElementById("btn-boost-grasscatting").addEventListener("click",    function() { activerBoost("grasscatting");    });
document.getElementById("btn-boost-pebblegathering").addEventListener("click", function() { activerBoost("pebblegathering"); });


// ════════════════════════════════════════════════════════════
// 11. GAME LOOP (TICK)
// ════════════════════════════════════════════════════════════

let vitesse  = 1;
const TICK_DT = 0.1; // seconds per tick

function tickGathering(action, stockKey, totalKey, cumulKey, cfg, onUnlockCheck, dt) {
  if (etat.allocation[action] <= 0) return;
  if (dt === undefined) dt = vitesse * TICK_DT;
  etat[cumulKey] += etat.allocation[action] * productionParChaton(action) * dt;
  const prod = Math.floor(etat[cumulKey] / cfg.secondesParUnite);
  if (prod <= 0) return;
  etat[stockKey] += prod;
  etat[totalKey] += prod;
  etat[cumulKey] -= prod * cfg.secondesParUnite;
  if (onUnlockCheck) onUnlockCheck(prod);
}

function tick() {
  // Cathouse reduction accumulation (speed-aware)
  if (etat.cathouses.length > 0) {
    etat.reductionCumulee += etat.cathouses.length * reductionParCathouse() * vitesse * TICK_DT;
  }

  // Speed-up: advance sequence timestamp
  if (vitesse > 1 && etat.sequenceEnCours) {
    etat.sequenceDebutTs -= (vitesse - 1) * 100;
  }

  // Check sequence completion
  if (etat.sequenceEnCours && tempsRestantSequence() <= 0) {
    terminerSequence(); return;
  }

  // Expire boosts
  ["woodcatting", "grasscatting", "pebblegathering"].forEach(function(action) {
    if (etat.boosts[action].actif && Date.now() >= etat.boosts[action].finTs) {
      etat.boosts[action].actif = false;
      afficherNotification("💨 " + action + " boost expired.");
    }
  });

  // Gathering
  tickGathering("woodcatting", "wood", "woodTotalRecolte", "secondesWoodCumulees", CONFIG.woodcatting, function(prod) {
    const avant = etat.woodTotalRecolte - prod;
    if (avant < 5 && etat.woodTotalRecolte >= 5) {
      afficherNotification("🏗️ Buildings unlocked! Build your first Cathouse.");
      ajouterLog("unlock", "🏗️ Buildings unlocked — build your first Cathouse.");
    }
    if (avant < CONFIG.sawmill.deblocageA && etat.woodTotalRecolte >= CONFIG.sawmill.deblocageA) {
      afficherNotification("🪚 Sawmill unlocked! Paw-cessing is now available.");
      ajouterLog("unlock", "🪚 Sawmill unlocked — Paw-cessing is now available.");
    }
  });

  tickGathering("grasscatting", "catnip", "catnipTotalRecolte", "secondesGrassCumulees", CONFIG.grasscatting, function(prod) {
    const avant = etat.catnipTotalRecolte - prod;
    if (avant < CONFIG.catchen.deblocageA && etat.catnipTotalRecolte >= CONFIG.catchen.deblocageA) {
      afficherNotification("🍳 The Catchen is open!");
      ajouterLog("unlock", "🍳 The Catchen is open — cook your first purritto!");
    }
  });

  tickGathering("pebblegathering", "pebbles", "pebblesTotalRecolte", "secondesPebbleCumulees", CONFIG.pebblegathering, function(prod) {
    const avant = etat.pebblesTotalRecolte - prod;
    if (avant < CONFIG.brickfactory.deblocageA && etat.pebblesTotalRecolte >= CONFIG.brickfactory.deblocageA) {
      afficherNotification("🧱 Brick Factory unlocked!");
      ajouterLog("unlock", "🧱 Brick Factory unlocked — process pebbles into bricks.");
    }
  });

  // Processing: Sawmill (wood → planks)
  if (etat.allocation.sawmill > 0) {
    if (etat.wood >= 1) {
      etat.scieriBloquee = false;
      const avant = etat.secondesPlanCumulees;
      etat.secondesPlanCumulees += etat.allocation.sawmill * vitesse * TICK_DT;
      const boisCons = Math.floor(etat.secondesPlanCumulees / CONFIG.sawmill.secondesParBois)
                     - Math.floor(avant / CONFIG.sawmill.secondesParBois);
      if (boisCons > 0) etat.wood = Math.max(0, etat.wood - boisCons);
      const planks = Math.floor(etat.secondesPlanCumulees / CONFIG.sawmill.secondesParPlanche);
      if (planks > 0) {
        const first = etat.planks === 0;
        etat.planks               += planks;
        etat.secondesPlanCumulees -= planks * CONFIG.sawmill.secondesParPlanche;
        afficherNotification("📋 " + planks + " plank(s) produced!");
        ajouterLog("event", "📋 " + planks + " plank(s) produced by the Sawmill.");
        if (first) {
          afficherNotification("✨ Purrks unlocked! Spend your planks wisely.");
          ajouterLog("unlock", "✨ Purrks unlocked — spend your planks wisely.");
        }
      }
    } else {
      etat.scieriBloquee = true;
    }
  }

  // Processing: Brick Factory (pebbles → bricks)
  if (etat.allocation.brickfactory > 0) {
    if (etat.pebbles >= 1) {
      etat.brickBloquee = false;
      const avant = etat.secondesBrickCumulees;
      etat.secondesBrickCumulees += etat.allocation.brickfactory * vitesse * TICK_DT;
      const pebblesCons = Math.floor(etat.secondesBrickCumulees / CONFIG.brickfactory.secondesParPebble)
                        - Math.floor(avant / CONFIG.brickfactory.secondesParPebble);
      if (pebblesCons > 0) etat.pebbles = Math.max(0, etat.pebbles - pebblesCons);
      const bricks = Math.floor(etat.secondesBrickCumulees / CONFIG.brickfactory.secondesParBrique);
      if (bricks > 0) {
        etat.bricks               += bricks;
        etat.secondesBrickCumulees -= bricks * CONFIG.brickfactory.secondesParBrique;
        afficherNotification("🧱 " + bricks + " brick(s) produced!");
        ajouterLog("event", "🧱 " + bricks + " brick(s) produced by the Brick Factory.");
      }
    } else {
      etat.brickBloquee = true;
    }
  }

  // Processing: Catchen (catnip → purrittos)
  if (etat.allocation.catchen > 0) {
    const plein = etat.purrittos >= CONFIG.purrittoMax;
    if (etat.catnip >= 1 && !plein) {
      etat.catchenBloquee = false;
      const avant = etat.secondesPurrittoCumulees;
      etat.secondesPurrittoCumulees += etat.allocation.catchen * vitesse * TICK_DT;
      const catnipCons = Math.floor(etat.secondesPurrittoCumulees / CONFIG.catchen.secondesParCatnip)
                       - Math.floor(avant / CONFIG.catchen.secondesParCatnip);
      if (catnipCons > 0) etat.catnip = Math.max(0, etat.catnip - catnipCons);
      const purrs = Math.floor(etat.secondesPurrittoCumulees / CONFIG.catchen.secondesParPurritto);
      if (purrs > 0) {
        const ajout = Math.min(purrs, CONFIG.purrittoMax - etat.purrittos);
        etat.purrittos                += ajout;
        etat.secondesPurrittoCumulees -= purrs * CONFIG.catchen.secondesParPurritto;
        if (ajout > 0) {
          afficherNotification("🌯 Purritto ready!");
          ajouterLog("event", "🌯 Purritto is ready — use it to boost a gathering job.");
        }
      }
    } else {
      etat.catchenBloquee = true;
    }
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
  if (etat.cathouses.length > 0) {
    etat.reductionCumulee += etat.cathouses.length * reductionParCathouse() * dt;
  }

  tickGathering("woodcatting",     "wood",    "woodTotalRecolte",    "secondesWoodCumulees",   CONFIG.woodcatting,     null, dt);
  tickGathering("grasscatting",    "catnip",  "catnipTotalRecolte",  "secondesGrassCumulees",  CONFIG.grasscatting,    null, dt);
  tickGathering("pebblegathering", "pebbles", "pebblesTotalRecolte", "secondesPebbleCumulees", CONFIG.pebblegathering, null, dt);

  if (etat.allocation.sawmill > 0) {
    if (etat.wood >= 1) {
      etat.scieriBloquee = false;
      const avant = etat.secondesPlanCumulees;
      etat.secondesPlanCumulees += etat.allocation.sawmill * dt;
      const boisCons = Math.floor(etat.secondesPlanCumulees / CONFIG.sawmill.secondesParBois)
                     - Math.floor(avant / CONFIG.sawmill.secondesParBois);
      if (boisCons > 0) etat.wood = Math.max(0, etat.wood - boisCons);
      const planks = Math.floor(etat.secondesPlanCumulees / CONFIG.sawmill.secondesParPlanche);
      if (planks > 0) {
        etat.planks               += planks;
        etat.secondesPlanCumulees -= planks * CONFIG.sawmill.secondesParPlanche;
      }
    } else {
      etat.scieriBloquee = true;
    }
  }

  if (etat.allocation.brickfactory > 0) {
    if (etat.pebbles >= 1) {
      etat.brickBloquee = false;
      const avant = etat.secondesBrickCumulees;
      etat.secondesBrickCumulees += etat.allocation.brickfactory * dt;
      const pebblesCons = Math.floor(etat.secondesBrickCumulees / CONFIG.brickfactory.secondesParPebble)
                        - Math.floor(avant / CONFIG.brickfactory.secondesParPebble);
      if (pebblesCons > 0) etat.pebbles = Math.max(0, etat.pebbles - pebblesCons);
      const bricks = Math.floor(etat.secondesBrickCumulees / CONFIG.brickfactory.secondesParBrique);
      if (bricks > 0) {
        etat.bricks                += bricks;
        etat.secondesBrickCumulees -= bricks * CONFIG.brickfactory.secondesParBrique;
      }
    } else {
      etat.brickBloquee = true;
    }
  }

  if (etat.allocation.catchen > 0) {
    const plein = etat.purrittos >= CONFIG.purrittoMax;
    if (etat.catnip >= 1 && !plein) {
      etat.catchenBloquee = false;
      const avant = etat.secondesPurrittoCumulees;
      etat.secondesPurrittoCumulees += etat.allocation.catchen * dt;
      const catnipCons = Math.floor(etat.secondesPurrittoCumulees / CONFIG.catchen.secondesParCatnip)
                       - Math.floor(avant / CONFIG.catchen.secondesParCatnip);
      if (catnipCons > 0) etat.catnip = Math.max(0, etat.catnip - catnipCons);
      const purrs = Math.floor(etat.secondesPurrittoCumulees / CONFIG.catchen.secondesParPurritto);
      if (purrs > 0) {
        const ajout = Math.min(purrs, CONFIG.purrittoMax - etat.purrittos);
        etat.purrittos                += ajout;
        etat.secondesPurrittoCumulees -= purrs * CONFIG.catchen.secondesParPurritto;
      }
    } else {
      etat.catchenBloquee = true;
    }
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

  // Boosts that ran out during the absence
  ["woodcatting", "grasscatting", "pebblegathering"].forEach(function(action) {
    if (etat.boosts[action].actif && maintenant >= etat.boosts[action].finTs) {
      etat.boosts[action].actif = false;
    }
  });

  const avant = {
    wood: etat.wood, catnip: etat.catnip, pebbles: etat.pebbles,
    planks: etat.planks, bricks: etat.bricks, purrittos: etat.purrittos,
    reductionCumulee: etat.reductionCumulee
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
    etat.kittiesData.push({ nom: kittyAttrapeNom, metier: null, niveau: 1, tier: 0, catchTs: maintenant });
    ajouterLog("event", "🐱 " + kittyAttrapeNom + " was caught while you were away!");
    verifierStoryModals();
  }

  etat.dernierTimestamp = maintenant;
  verifierObjectifs();
  sauvegarder();

  return {
    dureeReelleSec: ecouleReelMs / 1000,
    wood:             etat.wood     - avant.wood,
    catnip:           etat.catnip   - avant.catnip,
    pebbles:          etat.pebbles  - avant.pebbles,
    planks:           etat.planks   - avant.planks,
    bricks:           etat.bricks   - avant.bricks,
    purrittos:        etat.purrittos - avant.purrittos,
    kittyAttrape:     kittyAttrapeNom,
    reductionGagnee:  etat.reductionCumulee - avant.reductionCumulee
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
    ["🪵 Wood",      resume.wood],
    ["🌿 Catnip",    resume.catnip],
    ["🪨 Pebbles",   resume.pebbles],
    ["📋 Planks",    resume.planks],
    ["🧱 Bricks",    resume.bricks],
    ["🌯 Purrittos", resume.purrittos]
  ];
  let produit = false;
  ressources.forEach(function(r) {
    if (r[1] > 0) { ligne(r[0], "+" + formaterNombre(r[1])); produit = true; }
  });
  if (!produit) ligne("🐾 Production", "Nothing produced");

  if (resume.kittyAttrape) {
    ligne("🐱 New kitty", resume.kittyAttrape + " joined the gang!");
  } else if (resume.reductionGagnee > 0.5) {
    ligne("⏱ Cooldown reduced", "-" + formaterTemps(resume.reductionGagnee) + " (Cathouses)");
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
      "Kid: \"Caught you kitty! Let's put you in our garden, you'll sure have lots of fun there!\"",
      "Kid: \"Another kitty in front of the house! Two won't make a lot of difference!\""
    ]);
  }
  if (etat.chatons === 2 && !localStorage.getItem("story2Vue")) {
    localStorage.setItem("story2Vue", "1");
    afficherModal("ecran-story-2");
    ajouterLog("dialogue", [
      "Kid: \"Phew, this one was harder to catch, but it seems there's another kitty across the street.\"",
      "Kid: \"I'll go get it as well — we can never have enough KITTIES!\""
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
  ["gang", "work", "buildings", "purrks"].forEach(function(tab) {
    document.getElementById("contenu-" + tab).style.display  = id === tab ? "block" : "none";
    document.getElementById("onglet-" + tab).classList.toggle("onglet-actif", id === tab);
  });
}

function cyclerVitesse() {
  const idx = VITESSES.indexOf(vitesse);
  vitesse = VITESSES[(idx + 1) % VITESSES.length];
  const btn = document.getElementById("bouton-vitesse");
  btn.textContent = vitesse === 1 ? "1×" : "⚡ " + vitesse + "×";
  btn.classList.toggle("vitesse-active", vitesse > 1);
}

function toggleLogs() {
  const panneau = document.getElementById("panneau-logs");
  const btn     = document.getElementById("logs-toggle");
  btn.textContent = panneau.classList.toggle("reduit") ? "+" : "−";
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
  document.getElementById("panneau-logs").classList.add("reduit");
  document.getElementById("logs-toggle").textContent = "+";
}
