(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

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
  stoneCathouse: {
    coutBasePlanks: 1,
    coutBaseBricks: 10,
    croissance:     1.7,
    speedBonus:     0.10
  },
  woodcatting:      { secondesParUnite: 60 },
  basicWoodcatting: { secondesParUnite: 600 },
  grasscatting:     { secondesParUnite: 120 },
  pebblegathering: { deblocageA: 5,  secondesParUnite: 240 },
  rockgathering:   { secondesParUnite: 2400 },
  rockFactory: {
    secondesParBrique: 12000,
    secondesParRock:   1200
  },
  sawmill: {
    deblocageA:           5,
    secondesParPlanche:   300,
    secondesParCardboard: 30
  },
  basicSawmill: {
    secondesParPlanche:   3000,
    secondesParBasicWood: 300
  },
  brickfactory: {
    deblocageA:        5,
    secondesParBrique: 1200,
    secondesParPebble: 120
  },
  catchen: {
    deblocageA:        5,
    secondesParSalad:  600,
    secondesParCatnip: 60
  },
  fishcatting:     { secondesParUnite: 1200 },
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
      duree:          600,
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
      difficulte:     15,
      duree:          1200,
      slots:          1,
      recompense:     "humanLeftovers",
      recompenseRange: [
        { qty: 1, weight: 70 },
        { qty: 2, weight: 20 },
        { qty: 3, weight: 10 }
      ],
      zone:           "E1",
      unlockCampaign: "searchNeighborTrash"
    },
    searchLeftNeighborTrashAgain: {
      id:             "searchLeftNeighborTrashAgain",
      nom:            "Search left neighbor's trash again",
      description:    "The left neighbor keeps throwing good stuff away. Worth another look.",
      difficulte:     15,
      duree:          1200,
      slots:          1,
      recompense:     "humanLeftovers",
      recompenseRange: [
        { qty: 1, weight: 70 },
        { qty: 2, weight: 20 },
        { qty: 3, weight: 10 }
      ],
      zone:           "C1",
      unlockCampaign: "searchLeftNeighborTrash"
    },
    searchBasementAgain: {
      id:             "searchBasementAgain",
      nom:            "Search Basement again",
      description:    "We may have missed a few things down there. Let's take another look.",
      difficulte:     30,
      duree:          3000,
      slots:          1,
      recompense:     "humanWorkersFood",
      recompenseRange: [
        { qty: 1, weight: 70 },
        { qty: 2, weight: 20 },
        { qty: 3, weight: 10 }
      ],
      zone:           "A1",
      unlockCampaign: "exploreBasement"
    },
    raidSupermarketAgain: {
      id:             "raidSupermarketAgain",
      nom:            "Infiltrate the Supermarket again",
      description:    "We got something last time. Let's push our luck.",
      difficulte:     60,
      duree:          3600,
      slots:          1,
      // 25% Canned Cat Food / 75% Human Workers Food
      // Future explorator perk (explo-loot) will switch to recompenseTablePerk: 50/50
      recompenseTable: [
        { recompense: "cannedCatFood",    qty: 1, weight: 25 },
        { recompense: "humanWorkersFood", qty: 1, weight: 75 },
      ],
      zone:           "supermarket",
      unlockCampaign: "infiltrateSupermarket"
    },
    stealGasStationAgain: {
      id:             "stealGasStationAgain",
      nom:            "Let's try stealing more",
      description:    "Now that we know the way in, let's try to bring back a few more useful things without being noticed.",
      difficulte:     50,
      duree:          3000,
      slots:          2,
      recompenseTable: [
        { recompense: "humanWorkersFood", qty: 2, weight: 50 },
        { recompense: "humanWorkersFood", qty: 4, weight: 45 },
        { recompense: "cannedCatFood",    qty: 1, weight: 5 }
      ],
      zone:           "gasStation",
      unlockCampaign: "sneakBackEntrance"
    }
  },
  campaigns: {
    checkTheTrash: {
      id:          "checkTheTrash",
      nom:         "Search our trash",
      description: "Dig through the bins at home. You never know what's there.",
      difficulte:  1,
      duree:       300,
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
    },
    searchLeftNeighborTrash: {
      id:            "searchLeftNeighborTrash",
      nom:           "Search Left Neighbor's Trash",
      description:   "The left neighbor throws away more than they should. Time to investigate.",
      difficulte:    15,
      duree:         600,
      slots:         2,
      recompense:    "humanLeftovers",
      recompenseQty: 10,
      zone:          "C1"
    },
    exploreSquattedGarden: {
      id:          "exploreSquattedGarden",
      nom:         "Explore the Garden",
      description: "The garden outside the squatted house looks abandoned. Something might be hidden in there.",
      difficulte:  40,
      duree:       1800,
      slots:       2,
      recompense:  "stoneGuide",
      zone:        "G1"
    },
    searchSquattedHouse: {
      id:               "searchSquattedHouse",
      nom:              "Search the House",
      description:      "The house itself hides more secrets — but dangerous threats lurk inside.",
      difficulte:       0,
      duree:            0,
      slots:            2,
      recompense:       null,
      zone:             "G1",
      unlockAfterCampaign: "exploreSquattedGarden",
      lockedReason:     "⚠️ Threats detected inside — your cats can't fight them yet."
    },
    exploreGroundFloor: {
      id:          "exploreGroundFloor",
      nom:         "Explore the Ground Floor",
      description: "The ground floor is being renovated. Time to take a look around.",
      difficulte:  35,
      duree:       1800,
      slots:       2,
      recompense:  "constructionPlan",
      zone:        "A1"
    },
    exploreBasement: {
      id:                  "exploreBasement",
      nom:                 "Explore the Basement",
      description:         "Below the ground floor lies a basement no one seems to have touched in years. Might be worth a look.",
      difficulte:          50,
      duree:               3600,
      slots:               2,
      recompense:          "seminarGuide",
      zone:                "A1",
      unlockAfterCampaign: "exploreGroundFloor"
    },
    infiltrateSupermarket: {
      id:          "infiltrateSupermarket",
      nom:         "Infiltrate the Supermarket",
      description: "The supermarket is full of things we need. We just need to get in there without being noticed.",
      difficulte:  60,
      duree:       3600,
      slots:       2,
      recompense:  "cannedCatFood",
      zone:        "supermarket"
    },
    exploreOutside: {
      id:          "exploreOutside",
      nom:         "Explore the outside",
      description: "Have a look around this strange structure, I also spotted a potential back entrance we could use",
      difficulte:  50,
      duree:       2400,
      slots:       2,
      recompenses: [
        { recompense: "basicWoodPlanks",  qty: 10 },
        { recompense: "humanLeftovers",   qty: 20 },
        { recompense: "humanWorkersFood", qty: 1 }
      ],
      zone:        "gasStation"
    },
    sneakBackEntrance: {
      id:                  "sneakBackEntrance",
      nom:                 "Sneak through the back entrance",
      description:         "Slip through the back door while the humans are busy out front. Search quickly, keep quiet, and leave no pawprints behind.",
      difficulte:          80,
      duree:               5400,
      slots:               2,
      recompense:          "compass",
      zone:                "gasStation",
      unlockAfterCampaign: "exploreOutside"
    },
    navigateThroughWoods: {
      id:            "navigateThroughWoods",
      nom:           "Navigate through the woods",
      description:   "With the Compass in paw, follow the trail through the woods and see what lies beyond our neighbourhood.",
      difficulte:    100,
      duree:         5400,
      slots:         2,
      recompense:    "worldMap",
      requiredItem:  "compass",
      zone:          "forestEntrance"
    }
  }
};

const VITESSES = [1, 2, 5, 10, 50, 100, 500, 1000];

  CatInc.data.config = Object.freeze({
    CONFIG: CONFIG,
    VITESSES: VITESSES
  });
})(typeof window !== "undefined" ? window : globalThis);
