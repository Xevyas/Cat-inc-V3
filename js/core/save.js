(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const stateCore = CatInc.state;
  if (!stateCore) throw new Error("CatInc.state must be loaded before CatInc.save.");

  const SAVE_KEY = "chatonClicker";
  const SAVE_RECOVERY_KEY = "chatonClickerRecovery";
  const SAVE_VERSION = 1;
  const ONGLETS_VALIDES = ["gang", "work", "buildings", "facilities", "explorations", "inventaire", "logs"];

function estObjetSauvegarde(valeur) {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function validerStructureSauvegarde(d) {
  if (!estObjetSauvegarde(d)) return "The save root must be an object.";

  const champsConnus = ["chatons", "wood", "cardboard", "cardboardPieces", "kittiesData", "workers"];
  if (!champsConnus.some(function(cle) { return d[cle] !== undefined; })) {
    return "This file does not contain recognizable Cat Inc save data.";
  }

  if (d.saveVersion !== undefined) {
    if (!Number.isInteger(d.saveVersion) || d.saveVersion < 0) return "Invalid save version.";
    if (d.saveVersion > SAVE_VERSION) return "This save was created by a newer version of Cat Inc.";
  }

  const champsTableaux = [
    "cathouses", "kittiesData", "exploEnCours", "campaignsCompletees", "itemsAcquis", "itemsAppris",
    "zonesExplorees", "objectifsComplis", "logs", "ongletsVisites"
  ];
  for (const cle of champsTableaux) {
    if (d[cle] !== undefined && !Array.isArray(d[cle])) return "Invalid field: " + cle + " must be an array.";
  }

  const champsObjets = ["workers", "spherePerks", "scoutingsEnCours", "managers"];
  for (const cle of champsObjets) {
    if (d[cle] !== undefined && !estObjetSauvegarde(d[cle])) return "Invalid field: " + cle + " must be an object.";
  }

  const champsObjetsOuNuls = ["learningEnCours", "formationEnCours", "exploZoneEnCours"];
  for (const cle of champsObjetsOuNuls) {
    if (d[cle] !== undefined && d[cle] !== null && !estObjetSauvegarde(d[cle])) {
      return "Invalid field: " + cle + " must be an object or null.";
    }
  }

  const champsNumeriques = [
    "dernierTimestamp", "chatons", "wood", "woodTotalRecolte", "cardboard", "cardboardTotalRecolte",
    "cardboardPieces", "cardboardPiecesTotalRecolte", "basicWood", "basicWoodTotalRecolte", "catnip",
    "catnipTotalRecolte", "pebbles", "pebblesTotalRecolte", "rocks", "rocksTotalRecolte", "planks",
    "cardboardPlanks", "basicWoodPlanks", "bricks", "pebbleBricks", "rockBricks", "salads", "anchovy",
    "anchovyTotalRecolte", "grilledAnchovy", "humanLeftovers", "humanWorkersFood", "cannedCatFood",
    "workBoostFinTs", "sequenceDebutTs", "sequenceDuree", "clicCount", "reductionAuMomentDuClic",
    "reductionCumulee", "cathouseCount", "stoneCathouseCount"
  ];
  for (const cle of champsNumeriques) {
    if (d[cle] !== undefined && (typeof d[cle] !== "number" || !Number.isFinite(d[cle]) || d[cle] < 0)) {
      return "Invalid numeric field: " + cle + ".";
    }
  }

  const champsBooleens = [
    "sequenceEnCours", "afficherTempsAjusteRecrutement", "scieriBloquee", "basicSawmillBloquee",
    "brickBloquee", "rockFactoryBloquee", "catchenBloquee", "catchenAnchovyBloquee", "premiereSaladeFaite",
    "jobCenterDebloque", "jobCenterConstruit", "trainingCenterDebloque", "trainingCenterConstruit",
    "managersDebloques"
  ];
  for (const cle of champsBooleens) {
    if (d[cle] !== undefined && typeof d[cle] !== "boolean") return "Invalid boolean field: " + cle + ".";
  }

  if (d.cathouses && !d.cathouses.every(function(ts) { return typeof ts === "number" && Number.isFinite(ts) && ts >= 0; })) {
    return "Invalid cathouse history.";
  }

  const champsTableauxDeChaines = ["campaignsCompletees", "itemsAcquis", "itemsAppris", "zonesExplorees", "objectifsComplis", "ongletsVisites"];
  for (const cle of champsTableauxDeChaines) {
    if (d[cle] && !d[cle].every(function(valeur) { return typeof valeur === "string"; })) {
      return "Invalid entries in field: " + cle + ".";
    }
  }

  if (d.ongletsVisites && !d.ongletsVisites.every(function(id) { return ONGLETS_VALIDES.includes(id); })) {
    return "Invalid visited tab data.";
  }

  if (d.kittiesData) {
    const kittiesValides = d.kittiesData.every(function(k) {
      if (!estObjetSauvegarde(k)) return false;
      if (k.nom !== undefined && (typeof k.nom !== "string" || k.nom.length > 100 || /[<>]/.test(k.nom))) return false;
      return ["niveau", "xp", "tier", "managerMult", "jobNiveau"].every(function(cle) {
        return k[cle] === undefined || (typeof k[cle] === "number" && Number.isFinite(k[cle]) && k[cle] >= 0);
      });
    });
    if (!kittiesValides) return "Invalid kitty data.";
  }

  const nombreKitties = Math.max(
    Number.isInteger(d.chatons) ? d.chatons : 0,
    Array.isArray(d.kittiesData) ? d.kittiesData.length : 0
  );
  function indexKittyValide(kittyIndex, nullable) {
    if (nullable && kittyIndex === null) return true;
    return Number.isInteger(kittyIndex) && kittyIndex >= 0 && kittyIndex < nombreKitties;
  }

  if (d.workers) {
    const workersValides = Object.values(d.workers).every(function(slots) {
      return Array.isArray(slots) && slots.every(function(slot) {
        return estObjetSauvegarde(slot)
          && indexKittyValide(slot.kittyIndex, true)
          && (slot.progress === undefined || (typeof slot.progress === "number" && Number.isFinite(slot.progress) && slot.progress >= 0))
          && (slot.prodFrac === undefined || (typeof slot.prodFrac === "number" && Number.isFinite(slot.prodFrac) && slot.prodFrac >= 0));
      });
    });
    if (!workersValides) return "Invalid worker slot data.";
  }

  if (d.managers) {
    const managersValides = Object.values(d.managers).every(function(kittyIndex) {
      return indexKittyValide(kittyIndex, true);
    });
    if (!managersValides) return "Invalid manager data.";
  }

  if (d.exploEnCours && !d.exploEnCours.every(function(explo) {
    return estObjetSauvegarde(explo)
      && typeof explo.id === "string"
      && Array.isArray(explo.kittyIndices)
      && explo.kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); })
      && typeof explo.startTs === "number" && Number.isFinite(explo.startTs)
      && typeof explo.duree === "number" && Number.isFinite(explo.duree) && explo.duree >= 0;
  })) return "Invalid campaign data.";

  if (d.exploZoneEnCours) {
    const zoneValide = typeof d.exploZoneEnCours.zoneId === "string"
      && Array.isArray(d.exploZoneEnCours.kittyIndices)
      && d.exploZoneEnCours.kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); })
      && typeof d.exploZoneEnCours.startTs === "number" && Number.isFinite(d.exploZoneEnCours.startTs)
      && typeof d.exploZoneEnCours.duree === "number" && Number.isFinite(d.exploZoneEnCours.duree) && d.exploZoneEnCours.duree >= 0;
    if (!zoneValide) return "Invalid zone exploration data.";
  }

  if (d.scoutingsEnCours) {
    const scoutingsValides = Object.values(d.scoutingsEnCours).every(function(scouting) {
      return estObjetSauvegarde(scouting)
        && indexKittyValide(scouting.kittyIndex, false)
        && typeof scouting.startTs === "number" && Number.isFinite(scouting.startTs)
        && (scouting.duree === undefined || (typeof scouting.duree === "number" && Number.isFinite(scouting.duree) && scouting.duree >= 0));
    });
    if (!scoutingsValides) return "Invalid scouting data.";
  }

  if (d.learningEnCours) {
    const learningValide = typeof d.learningEnCours.itemId === "string"
      && typeof d.learningEnCours.startTs === "number" && Number.isFinite(d.learningEnCours.startTs)
      && typeof d.learningEnCours.duree === "number" && Number.isFinite(d.learningEnCours.duree) && d.learningEnCours.duree >= 0;
    if (!learningValide) return "Invalid learning data.";
  }

  if (d.formationEnCours) {
    const formationValide = indexKittyValide(d.formationEnCours.kittyIndex, false)
      && typeof d.formationEnCours.metier === "string"
      && typeof d.formationEnCours.startTs === "number" && Number.isFinite(d.formationEnCours.startTs)
      && typeof d.formationEnCours.duree === "number" && Number.isFinite(d.formationEnCours.duree) && d.formationEnCours.duree >= 0;
    if (!formationValide) return "Invalid training data.";
  }

  if (d.regionCourante !== undefined && typeof d.regionCourante !== "string") return "Invalid current region.";

  if (d.logs) {
    const logsValides = d.logs.every(function(entry) {
      if (!estObjetSauvegarde(entry) || typeof entry.type !== "string") return false;
      if (entry.heure !== undefined && typeof entry.heure !== "string") return false;
      if (entry.texte !== undefined && typeof entry.texte !== "string") return false;
      return entry.lignes === undefined || (Array.isArray(entry.lignes) && entry.lignes.every(function(ligne) { return typeof ligne === "string"; }));
    });
    if (!logsValides) return "Invalid log data.";
  }

  return null;
}

function analyserSauvegardeBrute(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, erreur: "The file does not contain valid JSON." };
  }
  const erreur = validerStructureSauvegarde(data);
  return erreur ? { ok: false, erreur: erreur } : { ok: true, data: data };
}

  function creerDonneesSauvegarde(etat) {
    return {
    saveVersion:          SAVE_VERSION,
    dernierTimestamp:     etat.dernierTimestamp,
    chatons:                etat.chatons,
    cardboardPieces:              etat.cardboardPieces,         cardboardPiecesTotalRecolte: etat.cardboardPiecesTotalRecolte,
    basicWood:              etat.basicWood,         basicWoodTotalRecolte: etat.basicWoodTotalRecolte,
    catnip:                 etat.catnip,            catnipTotalRecolte:    etat.catnipTotalRecolte,
    pebbles:                etat.pebbles,           pebblesTotalRecolte:   etat.pebblesTotalRecolte,
    rocks:                  etat.rocks,             rocksTotalRecolte:     etat.rocksTotalRecolte,
    cardboardPlanks:        etat.cardboardPlanks,
    basicWoodPlanks:        etat.basicWoodPlanks,
    pebbleBricks:           etat.pebbleBricks,
    rockBricks:             etat.rockBricks,
    salads:                 etat.salads,
    anchovy:                etat.anchovy,             anchovyTotalRecolte:  etat.anchovyTotalRecolte,
    grilledAnchovy:         etat.grilledAnchovy,
    humanLeftovers:         etat.humanLeftovers,
    humanWorkersFood:       etat.humanWorkersFood,
    cannedCatFood:          etat.cannedCatFood,
    spherePerks:            etat.spherePerks,
    workBoostFinTs:         etat.workBoostFinTs,
    sequenceEnCours:         etat.sequenceEnCours,
    sequenceDebutTs:         etat.sequenceDebutTs,
    sequenceDuree:           etat.sequenceDuree,
    clicCount:               etat.clicCount,
    reductionAuMomentDuClic: etat.reductionAuMomentDuClic,
    afficherTempsAjusteRecrutement: etat.afficherTempsAjusteRecrutement,
    scieriBloquee:              etat.scieriBloquee,
    basicSawmillBloquee:        etat.basicSawmillBloquee,
    brickBloquee:               etat.brickBloquee,
    rockFactoryBloquee:         etat.rockFactoryBloquee,
    catchenBloquee:             etat.catchenBloquee,
    catchenAnchovyBloquee:      etat.catchenAnchovyBloquee,
    premiereSaladeFaite:        etat.premiereSaladeFaite,
    reductionCumulee: etat.reductionCumulee,
    workers:       etat.workers,
    cathouses:          etat.cathouses,
    cathouseCount:      etat.cathouseCount,
    stoneCathouseCount: etat.stoneCathouseCount,
    kittiesData:         etat.kittiesData,
    exploEnCours:        etat.exploEnCours,
    campaignsCompletees: etat.campaignsCompletees,
    itemsAcquis:         etat.itemsAcquis,
    itemsAppris:         etat.itemsAppris,
    learningEnCours:     etat.learningEnCours,
    jobCenterDebloque:        etat.jobCenterDebloque,
    jobCenterConstruit:       etat.jobCenterConstruit,
    trainingCenterDebloque:   etat.trainingCenterDebloque,
    trainingCenterConstruit:  etat.trainingCenterConstruit,
    formationEnCours:         etat.formationEnCours,
    regionCourante:           etat.regionCourante,
    zonesExplorees:      etat.zonesExplorees,
    exploZoneEnCours:    etat.exploZoneEnCours,
    scoutingsEnCours:    etat.scoutingsEnCours,
    managers:            etat.managers,
    managersDebloques:   etat.managersDebloques,
    objectifsComplis: etat.objectifsComplis,
    logs:          etat.logs,
    ongletsVisites: etat.ongletsVisites
  };
  }

  function serialiserEtat(etat) {
    return JSON.stringify(creerDonneesSauvegarde(etat));
  }

  function migrerDonneesSauvegarde(data, options) {
    options = options || {};
    const maintenant = Number.isFinite(options.maintenant) ? options.maintenant : Date.now();
    const NOMS_KITTIES = options.nomsKitties || [];
    const assignerVisageChaton = typeof options.assignerVisageChaton === "function"
      ? options.assignerVisageChaton
      : function() { return null; };
    const makeWorkerSlots = stateCore.makeWorkerSlots;
    const d = JSON.parse(JSON.stringify(data));
    const etat = stateCore.creerEtatInitial(maintenant);


  etat.dernierTimestamp       = d.dernierTimestamp       || maintenant;
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
  etat.rocks                  = d.rocks                  || 0;
  etat.rocksTotalRecolte      = d.rocksTotalRecolte      || 0;
  // Migration: planks → cardboardPlanks, bricks → pebbleBricks
  etat.cardboardPlanks        = d.cardboardPlanks        !== undefined ? d.cardboardPlanks        : (d.planks || 0);
  etat.basicWoodPlanks        = d.basicWoodPlanks        || 0;
  etat.pebbleBricks           = d.pebbleBricks           !== undefined ? d.pebbleBricks           : (d.bricks || 0);
  etat.rockBricks             = d.rockBricks             || 0;
  etat.salads                 = d.salads                 || 0;
  etat.anchovy                = d.anchovy                || 0;
  etat.anchovyTotalRecolte    = d.anchovyTotalRecolte    || 0;
  etat.grilledAnchovy         = d.grilledAnchovy         || 0;
  etat.humanLeftovers         = d.humanLeftovers         || 0;
  etat.humanWorkersFood       = d.humanWorkersFood       || 0;
  etat.cannedCatFood          = d.cannedCatFood          || 0;
  etat.spherePerks            = d.spherePerks            || {};
  etat.workBoostFinTs         = d.workBoostFinTs         || 0;

  etat.sequenceEnCours         = d.sequenceEnCours         || false;
  etat.sequenceDebutTs         = d.sequenceDebutTs         || 0;
  etat.sequenceDuree           = d.sequenceDuree           || 0;
  etat.clicCount               = d.clicCount               || 0;
  etat.reductionAuMomentDuClic = d.reductionAuMomentDuClic || 0;
  etat.afficherTempsAjusteRecrutement = d.afficherTempsAjusteRecrutement || false;

  etat.scieriBloquee        = d.scieriBloquee        || false;
  etat.basicSawmillBloquee  = d.basicSawmillBloquee  || false;
  etat.brickBloquee         = d.brickBloquee         || false;
  etat.rockFactoryBloquee   = d.rockFactoryBloquee   || false;
  etat.catchenBloquee             = d.catchenBloquee             || false;
  etat.catchenAnchovyBloquee      = d.catchenAnchovyBloquee      || false;
  etat.premiereSaladeFaite        = d.premiereSaladeFaite        || false;
  // Migration: compute reduction from old timestamp-based saves
  etat.reductionCumulee = d.reductionCumulee !== undefined
    ? d.reductionCumulee
    : (d.cathouses || []).reduce(function(total, ts) {
        return total + Math.floor((maintenant - ts) / 1000);
      }, 0);

  // Load worker slots — migrate from old allocation-count format
  const allActions = ["woodcatting", "basicWoodcatting", "grasscatting", "fishcatting", "pebblegathering", "rockgathering", "sawmill", "basicSawmill", "brickfactory", "rockFactory", "catchen", "grilledAnchovy"];
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

  etat.cathouses          = d.cathouses          || [];
  etat.cathouseCount      = d.cathouseCount      || 0;
  etat.stoneCathouseCount = d.stoneCathouseCount || 0;
  etat.exploEnCours        = d.exploEnCours        || [];
  etat.campaignsCompletees = d.campaignsCompletees || [];
  etat.itemsAcquis         = d.itemsAcquis         || [];
  etat.itemsAppris         = d.itemsAppris         || [];
  etat.learningEnCours     = d.learningEnCours     || null;
  etat.jobCenterDebloque        = d.jobCenterDebloque        || false;
  etat.jobCenterConstruit       = d.jobCenterConstruit       || false;
  etat.trainingCenterDebloque   = d.trainingCenterDebloque   || false;
  etat.trainingCenterConstruit  = d.trainingCenterConstruit  || false;
  etat.formationEnCours         = d.formationEnCours         || null;
  etat.regionCourante      = d.regionCourante      || "startingNeighbourhood";
  etat.zonesExplorees      = d.zonesExplorees      || ["D1"];
  if (!etat.zonesExplorees.includes("D1")) etat.zonesExplorees.push("D1");
  etat.exploZoneEnCours    = d.exploZoneEnCours    || null;
  etat.scoutingsEnCours    = d.scoutingsEnCours    || {};
  etat.managers            = d.managers            || { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null };
  etat.managersDebloques   = d.managersDebloques   || false;
  // Migration: backfill manager keys added in later versions
  if (etat.managers.wood     === undefined) etat.managers.wood     = null;
  if (etat.managers.food     === undefined) etat.managers.food     = null;
  if (etat.managers.sawmill  === undefined) etat.managers.sawmill  = null;
  if (etat.managers.catchen  === undefined) etat.managers.catchen  = null;
  if (etat.managers.rock     === undefined) etat.managers.rock     = null;
  if (etat.managers.pawsonry === undefined) etat.managers.pawsonry = null;
  if (etat.managers.houses   === undefined) etat.managers.houses   = null;
  etat.objectifsComplis = d.objectifsComplis || [];
  etat.logs            = d.logs            || [];
  if (Array.isArray(d.ongletsVisites)) {
    etat.ongletsVisites = Array.from(new Set(d.ongletsVisites.filter(function(id) {
      return ONGLETS_VALIDES.includes(id);
    })));
  } else {
    // Saves created before tab visits were tracked should not show old unlocks as new.
    etat.ongletsVisites = ["gang", "logs"];
    if (etat.chatons >= 3) etat.ongletsVisites.push("work");
    if (etat.cardboardPiecesTotalRecolte >= 5) etat.ongletsVisites.push("buildings");
    if (etat.jobCenterDebloque) etat.ongletsVisites.push("facilities");
    if (etat.chatons >= 6) etat.ongletsVisites.push("explorations");
    if (etat.cardboardPiecesTotalRecolte >= 1) etat.ongletsVisites.push("inventaire");
  }
  ["gang", "logs"].forEach(function(id) {
    if (!etat.ongletsVisites.includes(id)) etat.ongletsVisites.push(id);
  });
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
    etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: null, visage: assignerVisageChaton(nom), jobNiveau: 0 });
  }
  // Migration: add xp field and reset niveau to 0-based for existing kitties
  etat.kittiesData.forEach(function(k) {
    if (k.xp === undefined) k.xp = 0;
    if (k.niveau === undefined || k.niveau === 1) { k.niveau = 0; k.xp = 0; }
    if (k.managerMult === undefined) k.managerMult = 2;
    if (!k.visage) k.visage = assignerVisageChaton(k.nom);
    if (k.jobNiveau === undefined) k.jobNiveau = 0;
  });

    return etat;
  }

  CatInc.save = Object.freeze({
    SAVE_KEY: SAVE_KEY,
    SAVE_RECOVERY_KEY: SAVE_RECOVERY_KEY,
    SAVE_VERSION: SAVE_VERSION,
    estObjetSauvegarde: estObjetSauvegarde,
    validerStructureSauvegarde: validerStructureSauvegarde,
    analyserSauvegardeBrute: analyserSauvegardeBrute,
    creerDonneesSauvegarde: creerDonneesSauvegarde,
    serialiserEtat: serialiserEtat,
    migrerDonneesSauvegarde: migrerDonneesSauvegarde
  });
})(typeof window !== "undefined" ? window : globalThis);
