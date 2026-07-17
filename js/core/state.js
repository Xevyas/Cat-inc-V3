(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

function makeWorkRecipeSlot() {
  return {
    recipeId: null,
    kittyIndex: null,
    phase: "idle",
    phaseProgress: 0,
    outputCarry: 0,
    gatheredInputs: {},
    reservedInputs: {}
  };
}

function makeWorkRecipeSlots(n) {
  var slots = [];
  for (var i = 0; i < n; i++) slots.push(makeWorkRecipeSlot());
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

  // Passive Catch/Recruit cooldown. false means the current cat is ready.
  sequenceEnCours:         false,
  sequenceDebutTs:         0,
  sequenceDuree:           0,
  prochainVisageChaton:    null,
  clicCount:               0,
  reductionAuMomentDuClic: 0,
  afficherTempsAjusteRecrutement: false,
  volumeEffetsSonores:     0.3,
  volumeMusique:           0.5,
  autoBuildWoodHouses:       false,

  // First-production story state
  premiereSaladeFaite:        false,

  // Cathouse reduction accumulator (virtual seconds)
  reductionCumulee: 0,

  // Two recipe slots per family replace the former independent workers.
  workRecipeSlots: {
    wood: makeWorkRecipeSlots(2),
    food: makeWorkRecipeSlots(2),
    rock: makeWorkRecipeSlots(2)
  },

  cathouses:          [],
  cathouseCount:      0,
  stoneCathouseCount: 0,
  kittiesData:   [],   // { nom, metier, niveau, tier, catchTs }
  exploEnCours:        [],   // [{ id, kittyIndices, startTs, duree }]
  campaignsCompletees: [],
  itemsAcquis:         [],
  itemsAppris:         [],
  itemsEtudies:        [],
  jobCenterDebloque:        false,
  jobCenterConstruit:       false,
  trainingCenterDebloque:   false,
  trainingCenterConstruit:  false,
  formationEnCours:    null,   // { kittyIndex, metier, startTs, duree }
  regionCourante:      "startingNeighbourhood",
  zonesExplorees:      ["D1"], // D1 (home) always starts explored
  exploZoneEnCours:    null,   // { zoneId, kittyIndices, startTs, duree }
  resultatsExplorationZones: {}, // { zoneId: { success, kittyIndices } }
  resultatsCampaigns:  {},     // { campaignId: { success, kittyIndices, recompenses[] } }
  scoutingsEnCours:    {},     // { scoutingId: { kittyIndex, startTs } }
  butinsScouting:      {},     // { scoutingId: { successful, failed, regular, lucky, superLucky, doubled, rewards } }
  managers:            { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null, houses: null },
  managersDebloques:   false,
  objectifsComplis: [],
  logs:          [],
  storiesVues:  [],
  ongletsVisites: ["gang", "logs"],
  learningEnCours: null,   // { itemId, startTs, duree } in ms (Study or legacy direct learning)

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
    makeWorkRecipeSlot: makeWorkRecipeSlot,
    makeWorkRecipeSlots: makeWorkRecipeSlots,
    creerEtatInitial: creerEtatInitial,
    remplacerEtat: remplacerEtat
  });
})(typeof window !== "undefined" ? window : globalThis);
