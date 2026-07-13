(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

function makeWorkerSlots(n) {
  var slots = [];
  for (var i = 0; i < n; i++) slots.push({ kittyIndex: null, progress: 0 });
  return slots;
}

function creerEtatInitial() {
  return {
  // Resources
  chatons:              0,
  cardboardPieces:            0,  cardboardPiecesTotalRecolte: 0,
  basicWood:            0,  basicWoodTotalRecolte: 0,
  catnip:               0,  catnipTotalRecolte:    0,
  pebbles:              0,  pebblesTotalRecolte:   0,
  rocks:                0,  rocksTotalRecolte:     0,
  cardboardPlanks:      0,
  basicWoodPlanks:      0,
  pebbleBricks:         0,
  rockBricks:           0,
  salads:               0,
  anchovy:              0,  anchovyTotalRecolte:  0,
  grilledAnchovy:       0,
  humanLeftovers:       0,
  humanWorkersFood:     0,
  cannedCatFood:        0,
  spherePerks:          {},
  workBoostFinTs:       0,

  // Catch sequence
  sequenceEnCours:         false,
  sequenceDebutTs:         0,
  sequenceDuree:           0,
  clicCount:               0,
  reductionAuMomentDuClic: 0,
  afficherTempsAjusteRecrutement: false,

  // Processing blocked flags
  scieriBloquee:              false,
  basicSawmillBloquee:        false,
  brickBloquee:               false,
  rockFactoryBloquee:         false,
  catchenBloquee:             false,
  catchenAnchovyBloquee:      false,
  premiereSaladeFaite:        false,

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
    rockgathering:    makeWorkerSlots(2),
    sawmill:          makeWorkerSlots(2),
    basicSawmill:     makeWorkerSlots(2),
    brickfactory:     makeWorkerSlots(2),
    rockFactory:      makeWorkerSlots(2),
    catchen:          makeWorkerSlots(2),
    grilledAnchovy:   makeWorkerSlots(2)
  },

  cathouses:          [],
  cathouseCount:      0,
  stoneCathouseCount: 0,
  kittiesData:   [],   // { nom, metier, niveau, tier, catchTs }
  exploEnCours:        [],   // [{ id, kittyIndices, startTs, duree }]
  campaignsCompletees: [],
  itemsAcquis:         [],
  itemsAppris:         [],
  jobCenterDebloque:        false,
  jobCenterConstruit:       false,
  trainingCenterDebloque:   false,
  trainingCenterConstruit:  false,
  formationEnCours:    null,   // { kittyIndex, metier, startTs, duree }
  regionCourante:      "startingNeighbourhood",
  zonesExplorees:      ["D1"], // D1 (home) always starts explored
  exploZoneEnCours:    null,   // { zoneId, kittyIndices, startTs, duree }
  scoutingsEnCours:    {},     // { scoutingId: { kittyIndex, startTs } }
  managers:            { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null, houses: null },
  managersDebloques:   false,
  objectifsComplis: [],
  logs:          [],
  ongletsVisites: ["gang", "logs"],
  learningEnCours: null,   // { itemId, startTs, duree } in ms

  // Last real-world timestamp the game state was saved (for offline progress)
    dernierTimestamp: Date.now()
  };
}

  function remplacerEtat(cible, nouvelEtat) {
    Object.keys(cible).forEach(function(cle) { delete cible[cle]; });
    Object.assign(cible, nouvelEtat);
    return cible;
  }

  CatInc.state = Object.freeze({
    makeWorkerSlots: makeWorkerSlots,
    creerEtatInitial: creerEtatInitial,
    remplacerEtat: remplacerEtat
  });
})(typeof window !== "undefined" ? window : globalThis);
