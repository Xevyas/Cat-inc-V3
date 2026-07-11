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
  stoneCathouse: {
    coutBasePlanks: 1,
    coutBaseBricks: 10,
    croissance:     1.7,
    speedBonus:     0.10
  },
  woodcatting:      { secondesParUnite: 60 },
  basicWoodcatting: { secondesParUnite: 600 },
  grasscatting:     { secondesParUnite: 120 },
  pebblegathering: { deblocageA: 7,  secondesParUnite: 240 },
  rockgathering:   { secondesParUnite: 2400 },
  rockFactory: {
    secondesParBrique: 12000,
    secondesParRock:   1200
  },
  sawmill: {
    deblocageA:           10,
    secondesParPlanche:   300,
    secondesParCardboard: 30
  },
  basicSawmill: {
    secondesParPlanche:   3000,
    secondesParBasicWood: 300
  },
  brickfactory: {
    deblocageA:        10,
    secondesParBrique: 1200,
    secondesParPebble: 120
  },
  catchen: {
    deblocageA:        10,
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
      difficulte:     1,
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
      difficulte:     1,
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
      difficulte:  30,
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
      difficulte:  25,
      duree:       900,
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
    }
  }
};

const LIVRE_ICONE = '<img class="livre-icone" src="img/resources/Books_Final.png?v=0.0024" alt="Book">';

// ── Resource info popups (Inventory tab) ─────────────────────
// Keep this in sync whenever a resource is added or changed.
const RESOURCE_INFO = {
  "inv-res-cardboard": {
    nom:     "Cardboard Pieces",
    tier:    "Tier 1 · Wood family",
    desc:    "Small patches of cardboard found lying on the ground. Might be useful.",
    produce: "Assign a kitty to Gather Cardboard Pieces in the Work tab.",
    usage:   "Crafted into Cardboard Planks (10 pieces per plank)."
  },
  "inv-res-cardboard-plank": {
    nom:     "Cardboard Planks",
    tier:    "Tier 1 · Wood family (processed)",
    desc:    "Sturdy planks pressed from cardboard. The backbone of early construction.",
    produce: "Assign a kitty to the Cardboard Sawmill in the Work tab (consumes 10 Cardboard Pieces per plank).",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-basic-wood": {
    nom:     "Basic Wood",
    tier:    "Tier 2 · Wood family",
    desc:    "Rough wooden planks salvaged from human furniture. Heavier to carry, but sturdier.",
    produce: "Assign a kitty to Gather Basic Wood in the Work tab (unlocked after crafting 10 Cardboard Planks).",
    usage:   "Crafted into Basic Wood Planks (10 logs per plank)."
  },
  "inv-res-wood-plank": {
    nom:     "Basic Wood Planks",
    tier:    "Tier 2 · Wood family (processed)",
    desc:    "Refined wooden planks, sanded and shaped. A real upgrade from cardboard.",
    produce: "Assign a kitty to the Basic Sawmill in the Work tab (consumes 10 Basic Wood per plank).",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-catnip": {
    nom:     "Catnip",
    tier:    "Tier 1 · Food family",
    desc:    "Fresh catnip from the garden. Nutritious, if you're a cat.",
    produce: "Assign a kitty to Gather Catnip in the Work tab.",
    usage:   "Crafted into Salads (10 catnip per salad)."
  },
  "inv-res-salads": {
    nom:     "Salads",
    tier:    "Tier 1 · Food family (processed)",
    desc:    "A balanced catnip salad. Even Bernardo eats his greens.",
    produce: "Assign a kitty to The Catchen in the Work tab (consumes 10 Catnip per salad).",
    usage:   "Feed to a kitty in the Gang tab to give them +1 XP."
  },
  "inv-res-anchovy": {
    nom:     "Anchovy",
    tier:    "Tier 2 · Food family",
    desc:    "Fresh anchovies fished from the nearby stream. A cat's favourite.",
    produce: "Assign a kitty to Fish Anchovies in the Work tab (unlocked via the Fishing Guide).",
    usage:   "Crafted into Grilled Anchovy (10 anchovies per serving)."
  },
  "inv-res-grilled-anchovy": {
    nom:     "Grilled Anchovy",
    tier:    "Tier 2 · Food family (processed)",
    desc:    "Golden, crispy, perfectly grilled. Worth every second of cooking.",
    produce: "Assign a kitty to the Anchovy Grill in the Work tab (consumes 10 Anchovies per serving).",
    usage:   "Not yet used — future recipes coming."
  },
  "inv-res-pebbles": {
    nom:     "Pebbles",
    tier:    "Tier 1 · Rock family",
    desc:    "Small smooth pebbles gathered from the yard. Heavy pockets, light heart.",
    produce: "Assign a kitty to Gather Pebbles in the Work tab.",
    usage:   "Crafted into Pebble Bricks (10 pebbles per brick)."
  },
  "inv-res-pebble-brick": {
    nom:     "Pebble Bricks",
    tier:    "Tier 1 · Rock family (processed)",
    desc:    "Compact bricks made from compressed pebbles. Surprisingly solid.",
    produce: "Assign a kitty to the Pawsonry in the Work tab (consumes 10 Pebbles per brick).",
    usage:   "Used to construct buildings like Facilities."
  },
  "inv-res-rocks": {
    nom:     "Rocks",
    tier:    "Tier 2 · Rock family",
    desc:    "Dense stones hauled from deeper in the yard. Much heavier than pebbles.",
    produce: "Assign a kitty to Gather Rocks in the Work tab.",
    usage:   "Crafted into Rock Bricks (10 rocks per brick)."
  },
  "inv-res-rock-brick": {
    nom:     "Rock Bricks",
    tier:    "Tier 2 · Rock family (processed)",
    desc:    "Solid bricks forged from dense rock. Built to last.",
    produce: "Assign a kitty to the Rock Forge in the Work tab (consumes 10 Rocks per brick).",
    usage:   "Used in advanced construction."
  },
  "inv-res-human-leftovers": {
    nom:     "Human Leftovers",
    tier:    null,
    desc:    "Bits and pieces left behind by humans. One human's trash is another cat's treasure.",
    produce: "Found by sending kitties on Exploration campaigns.",
    usage:   "Feed to a kitty in the Gang tab to give them +1 XP."
  }
};

const ITEMS = {
  schoolGuide: {
    id:           "schoolGuide",
    nom:          "School Guide",
    emoji:        LIVRE_ICONE,
    description:  "A human guide to a few job orientations for kids. We may learn something from it.",
    unlocksLabel: "Explorator, Lumberjack, Carpenter, Farmer and Chef jobs",
    actions: [
      { id: "learn", label: "Learn" }
    ]
  },
  fishingGuide: {
    id:           "fishingGuide",
    nom:          "Fishing Guide for Dummies",
    emoji:        LIVRE_ICONE,
    description:  "A complete beginner's guide to feline fishing. Spoiler: you don't need a rod.",
    unlocksLabel: "Anchovy fishing and Grilled Anchovy",
    actions: [
      { id: "learn", label: "Learn (1h)" }
    ]
  },
  constructionPlan: {
    id:           "constructionPlan",
    nom:          "Construction Plan",
    emoji:        LIVRE_ICONE,
    description:  "Blueprints for renovating the house. Someone's been busy.",
    unlocksLabel: "Wood Builder job",
    actions: [
      { id: "learn", label: "Learn (1h)" }
    ]
  },
  seminarGuide: {
    id:           "seminarGuide",
    nom:          "Corporate Seminar Booklet",
    emoji:        LIVRE_ICONE,
    description:  "A booklet about professional training seminars. Participants walk out with new skills and sharper instincts for their trade.",
    unlocksLabel: "Training Center",
    actions: [
      { id: "learn", label: "Study (2h)" }
    ]
  },
  stoneGuide: {
    id:           "stoneGuide",
    nom:          "Stone Craft Guide",
    emoji:        LIVRE_ICONE,
    description:  "A human guide to mining and stone masonry. Heavy reading, heavy lifting.",
    unlocksLabel: "Miner and Stonemason jobs",
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
  builder:       { id: "builder",     nom: "Wood Builder", emoji: "🏗️", famille: null,         familleNom: "Wood Houses",                duree: 3600, unlockItem: "constructionPlan", bonusLabel: "recruitment speed" },
  miner:         { id: "miner",       nom: "Miner",        emoji: "⛏️", famille: "rock",        familleNom: "Rock resource family",       duree: 3600, unlockItem: "stoneGuide" },
  stonemason:    { id: "stonemason",  nom: "Stonemason",   emoji: "🪨", famille: "pawsonry",    familleNom: "Pawsonry resource family",   duree: 3600, unlockItem: "stoneGuide" },
  "gang-leader": { id: "gang-leader", nom: "Gang Leader",  emoji: "👑", famille: null,          familleNom: "Work speed",                 duree: 0 }
};

const DESC_NEIGHBOR    = "Looks like our humans but nextdoor. They probably throw useful items as well.";
const DESC_GARDEN      = "Untamed grass, nobody tending it. Smells like mice have been through.";
const DESC_PARKING     = "A wide open area full of parked cars. Lots of shadows. Quiet at night.";

const ZONES_CARTE = {
  "D1": { id: "D1", nom: "Home",                    col: 3, row: 1, type: "home",     icone: "🏠", difficulte: 0,  duree: 0,   slots: 0, description: "" },
  "C1": { id: "C1", nom: "Left neighbor",            col: 2, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 120,  slots: 2, description: DESC_NEIGHBOR },
  "E1": { id: "E1", nom: "Right neighbor",           col: 4, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 120,  slots: 2, description: DESC_NEIGHBOR },
  "B1": { id: "B1", nom: "Empty Garden",             col: 1, row: 1, type: "other",    icone: "🌿", difficulte: 15, duree: 600,  slots: 2, description: DESC_GARDEN },
  "A1": { id: "A1", nom: "House under construction", col: 0, row: 1, type: "chantier", icone: "🏗️", difficulte: 20, duree: 300,  slots: 2, description: "Humans are building something here. Lots of wood and scrap material piling up. Empty at night." },
  "F1": { id: "F1", nom: "Empty Garden",             col: 5, row: 1, type: "other",    icone: "🌿", difficulte: 15, duree: 600,  slots: 2, description: DESC_GARDEN },
  "G1": { id: "G1", nom: "Squatted House",           col: 6, row: 1, type: "neighbor", icone: "🏚️", difficulte: 20, duree: 1200, slots: 2, description: "Something feels off about this place. No usual human signs. Saw a light through the boards at night once." },
  // Row 2 — full-width street
  "residentialStreet": { id: "residentialStreet", nom: "Residential Bloc Street", col: 0, row: 2, colSpan: 7, rowSpan: 1, type: "street", icone: "🛣️", difficulte: 30, duree: 1800, slots: 2, description: "The street in front of the houses. Bins come out on Thursdays. Dogs in the morning — Be careful." },
  "commercialStreet":  { id: "commercialStreet",  nom: "Commercial Street",       col: 3, row: 3, colSpan: 1, rowSpan: 2, type: "street", icone: "🛣️", difficulte: 40, duree: 2400, slots: 2, description: "A busy road. Cars and trucks, engines idling. Smells like petrol. I don't like it." },
  // Row 3-4 multi-cell zones
  "gasStation":    { id: "gasStation",    nom: "Gas Station",     col: 0, row: 3, colSpan: 2, rowSpan: 2, type: "shop",   icone: "⛽", difficulte: 30, duree: 600,  slots: 2, description: "That brightly lit corner that never closes. Cars are stopping in front and leaving a few minutes after. Weird place." },
  "parkingLeft":   { id: "parkingLeft",   nom: "Parking",         col: 2, row: 3, colSpan: 1, rowSpan: 2, type: "other",  icone: "🅿️", difficulte: 25, duree: 300,  slots: 2, description: DESC_PARKING },
  "parkingRight":  { id: "parkingRight",  nom: "Parking",         col: 4, row: 3, colSpan: 1, rowSpan: 2, type: "other",  icone: "🅿️", difficulte: 25, duree: 300,  slots: 2, description: DESC_PARKING },
  "supermarket":   { id: "supermarket",   nom: "Supermarket",     col: 5, row: 3, colSpan: 2, rowSpan: 2, type: "shop",   icone: "🛒", difficulte: 35, duree: 600,  slots: 2, description: "The glass building where humans carry out lots of plastic bags. Smells great with loads of unidentified smells. I need to get in there." },
  // Row 5 — full-width Forest Entrance
  "forestEntrance": { id: "forestEntrance", nom: "Forest Entrance", col: 0, row: 5, colSpan: 7, rowSpan: 1, type: "forest", icone: "🌲", difficulte: 40, duree: 900, slots: 2, description: "Where the street ends and the trees begin. Nature seems to have resisted human greediness. At least for now..." },
};

// ── Regions ────────────────────────────────────────────────────────────────
// Each region has its own zone grid. ZONES_CARTE is the starting neighbourhood.
// zonesRegion() resolves the active region's zones; use it for new region-aware code.
const REGIONS = {
  startingNeighbourhood: {
    id:     "startingNeighbourhood",
    nom:    "Starting Neighbourhood",
    mapImg: "img/Maps/Starting Neighbourhood.png",
    zones:  ZONES_CARTE,
  },
};

function zonesRegion() {
  return REGIONS[etat.regionCourante].zones;
}

const TIERS_KITTIES = [
  "Kitten", "Great Kitten", "Cat", "Great Cat",
  "General Cat", "Emperor Cat", "Godly Cat"
];

const NOMS_KITTIES = [
  "Bernardo", "Mochi", "Luna", "Whiskers", "Felix",
  "Cléopatra", "Biscuit", "Cosmo", "Zelda", "Napoléon",
  "Duchess", "Rascal", "Aurora", "Chester", "Pumpkin",
  "Oliver", "Mittens", "Shadow", "Simba", "Nala",
  "Tiger", "Max", "Lily", "Charlie", "Bella",
  "Jasper", "Ruby", "Oscar", "Daisy", "Leo",
  "Misty", "Ginger", "Oreo", "Salem", "Pixel",
  "Storm", "Amber", "Pepper", "Socks", "Fluffy",
  "Mocha", "Hazel", "Maple", "Fudge", "Cookie",
  "Olive", "Peaches", "Honey", "Caramel", "Clover",
  "Sage", "Willow", "Ivy", "Basil", "Rusty",
  "Smoky", "Patches", "Boots", "Whiskey", "Marmalade",
  "Pickles", "Waffles", "Muffin", "Snickers", "Cinnamon",
  "Vanilla", "Cocoa", "Espresso", "Latte", "Chai",
  "Nugget", "Peanut", "Walnut", "Acorn", "Chestnut",
  "Sprout", "Turnip", "Parsley", "Thyme", "Rosemary",
  "Juniper", "Birch", "Cedar", "Finch", "Robin",
  "Sparrow", "Wren", "Cricket", "Ripple", "Flint",
  "Copper", "Bronze", "Silver", "Goldie", "Indigo",
  "Violet", "Dune", "Cobble", "Toffee", "Pretzel"
];

const VITESSES = [1, 2, 5, 10, 50, 100, 500, 1000];
const KITTY_ICON = '<img src="img/interface/Gang_Final.png?v=0.0024" class="kitty-icon" alt="kitty">';
const CHECK_ICON = '<img src="img/interface/✅_Final.png?v=0.0024" class="check-icon" alt="done">';

// ── Per-kitty face icons ────────────────────────────────────
const CAT_FACES = {
  bernardo: "img/Cat faces/Bernardo.png?v=0.0024",
  mochi:    "img/Cat faces/Mochi_Final.png?v=0.0024",
  luna:     "img/Cat faces/Luna_Final.png?v=0.0024",
  alt1:     "img/Cat faces/Alternative Kitty face 1_Final.png?v=0.0024",
  alt2:     "img/Cat faces/Alternative Kitty face 2_Final.png?v=0.0024"
};
const CAT_FACES_ALEATOIRES = [CAT_FACES.mochi, CAT_FACES.luna, CAT_FACES.alt1, CAT_FACES.alt2];

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
  rocks:                0,  rocksTotalRecolte:     0,
  cardboardPlanks:      0,
  basicWoodPlanks:      0,
  pebbleBricks:         0,
  rockBricks:           0,
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

function kittyEstManager(kittyIdx) {
  return Object.values(etat.managers).some(function(mi) { return mi === kittyIdx; });
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
  // No exploTabDirty here: the card structure is unchanged (same kitty, same scouting).
  // Timer bar and countdown are updated each tick via direct DOM in renduExplorations().
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
  return (1 + fromWoodHouses * builderBonus) * (1 + stoneBonus);
}

// XP / leveling
const FOOD_XP = { salads: 1, grilledAnchovy: 10, humanLeftovers: 1 };

function xpPourNiveau(n) {
  return Math.max(n + 1, Math.ceil(Math.pow(n, 1.7)));
}

function productionParChaton(action) {
  return 1;
}

// Processed Resources Production bonus — scales at 1.05^level (half the rate of basic gathering bonus)
function productionProcBonus(kitty) {
  return kitty ? Math.pow(1.05, kitty.niveau) : 1;
}

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
  return n <= 13
    ? 5 * Math.pow(3, n)
    : 5 * Math.pow(3, 13) * Math.pow(1.3, n - 13);
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
function basicWoodDebloquee()       { return etat.cardboardPlanks >= 10; }
function basicSawmillDebloquee()    { return etat.basicWoodTotalRecolte >= 1; }
function catHouseDebloquee()        { return etat.basicWood >= 1 || etat.cathouseCount > 0; }
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


// ════════════════════════════════════════════════════════════
// 6. SAVE / LOAD / RESET
// ════════════════════════════════════════════════════════════

let sauvegardeVerrouillee = false; // set right before a reload we must not let a stale autosave clobber

function sauvegarder() {
  if (sauvegardeVerrouillee) return;
  etat.dernierTimestamp = Date.now();
  localStorage.setItem("chatonClicker", JSON.stringify({
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
    ameliorations: etat.ameliorations,
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
        return total + Math.floor((Date.now() - ts) / 1000);
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
    etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: null, visage: assignerVisageChaton(nom) });
  }
  // Migration: add xp field and reset niveau to 0-based for existing kitties
  etat.kittiesData.forEach(function(k) {
    if (k.xp === undefined) k.xp = 0;
    if (k.niveau === undefined || k.niveau === 1) { k.niveau = 0; k.xp = 0; }
    if (k.managerMult === undefined) k.managerMult = 2;
    if (!k.visage) k.visage = assignerVisageChaton(k.nom);
  });
  // Migration: assign Gang Leader to Bernardo if Job Center already built
  if (etat.itemsAppris.includes("schoolGuide") || etat.jobCenterConstruit) assignerGangLeader();
  return true;
}

function reset() {
  if (!confirm("Start over from scratch?")) return;
  fermerModalSettings();
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
    rocks: 0, rocksTotalRecolte: 0,
    cardboardPlanks: 0, basicWoodPlanks: 0, pebbleBricks: 0, rockBricks: 0, salads: 0,
    anchovy: 0, anchovyTotalRecolte: 0, grilledAnchovy: 0, humanLeftovers: 0,
    sequenceEnCours: false, sequenceDebutTs: 0, sequenceDuree: 0,
    clicCount: 0, reductionAuMomentDuClic: 0,
    scieriBloquee: false, basicSawmillBloquee: false, brickBloquee: false, rockFactoryBloquee: false, catchenBloquee: false, catchenAnchovyBloquee: false, premiereSaladeFaite: false, reductionCumulee: 0,
    workers: {
      woodcatting: makeWorkerSlots(2), basicWoodcatting: makeWorkerSlots(2),
      grasscatting: makeWorkerSlots(2), fishcatting: makeWorkerSlots(2),
      pebblegathering: makeWorkerSlots(2), rockgathering: makeWorkerSlots(2),
      sawmill: makeWorkerSlots(2), basicSawmill: makeWorkerSlots(2),
      brickfactory: makeWorkerSlots(2), rockFactory: makeWorkerSlots(2), catchen: makeWorkerSlots(2), grilledAnchovy: makeWorkerSlots(2)
    },
    cathouses: [], cathouseCount: 0, stoneCathouseCount: 0, kittiesData: [],
    exploEnCours: [], campaignsCompletees: [],
    itemsAcquis: [], itemsAppris: [], jobCenterDebloque: false, jobCenterConstruit: false,
    trainingCenterDebloque: false, trainingCenterConstruit: false,
    formationEnCours: null, zonesExplorees: ["D1"], exploZoneEnCours: null, scoutingsEnCours: {},
    managers: { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null, houses: null }, managersDebloques: false,
    objectifsComplis: [], logs: [],
    learningEnCours: null,
    dernierTimestamp: Date.now()
  });
  rendu(); renduLogs(); renduObjectifs(); renduManagement();
}

function ouvrirModalSettings() {
  document.getElementById("settings-modal").style.display = "flex";
  document.getElementById("toggle-adjusted-time").checked = etat.afficherTempsAjusteRecrutement;
}
function basculerAffichageTempsAjuste(checked) {
  etat.afficherTempsAjusteRecrutement = checked;
  sauvegarder();
  renduSequence();
}
function fermerModalSettings() {
  document.getElementById("settings-modal").style.display = "none";
}

function sauvegarderManuel() {
  sauvegarder();
  afficherNotification("💾 Game saved!");
}

function exporterSauvegarde() {
  sauvegarder();
  const raw = localStorage.getItem("chatonClicker");
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
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch (e) {
      alert("This file isn't a valid save file.");
      event.target.value = "";
      return;
    }
    if (!parsed || typeof parsed !== "object") {
      alert("This file isn't a valid save file.");
      event.target.value = "";
      return;
    }
    if (!confirm("Import this save? Your current progress will be replaced.")) {
      event.target.value = "";
      return;
    }
    sauvegardeVerrouillee = true; // block the visibilitychange autosave from clobbering the import during reload
    localStorage.setItem("chatonClicker", reader.result);
    // An imported save is never a fresh start — skip the intro overlay on reload.
    localStorage.setItem("introVue", "1");
    location.reload();
  };
  reader.readAsText(file);
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

const logFiltres = { event: true, unlock: true };

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
      ajouterLog("unlock", "Objective complete: " + obj.label);
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

// ── 9a. Resources bar
function renduRessources(u) {
  document.getElementById("val-chatons").textContent     = formaterNombre(etat.chatons);
  document.getElementById("val-cardboard-planks").textContent  = formaterNombre(etat.cardboardPlanks);
  document.getElementById("val-basic-wood-planks").textContent = formaterNombre(etat.basicWoodPlanks);
  document.getElementById("val-pebble-bricks").textContent    = formaterNombre(etat.pebbleBricks);
  document.getElementById("val-rock-bricks").textContent      = formaterNombre(etat.rockBricks);
  document.getElementById("val-salads").textContent           = formaterNombre(etat.salads);
  document.getElementById("val-grilled-anchovy").textContent  = formaterNombre(etat.grilledAnchovy);
  document.getElementById("val-human-leftovers").textContent  = formaterNombre(etat.humanLeftovers);

  document.getElementById("onglet-work").style.display         = u.cathering   ? "inline-block" : "none";
  document.getElementById("onglet-buildings").style.display    = u.buildings   ? "inline-block" : "none";
  document.getElementById("onglet-facilities").style.display   = u.jobCenter   ? "inline-block" : "none";
  document.getElementById("onglet-explorations").style.display = u.exploration ? "inline-block" : "none";
  document.getElementById("onglet-inventaire").style.display   = u.inventaire  ? "inline-block" : "none";
  document.getElementById("row-cardboard-planks").style.display  = u.scierie      ? "flex" : "none";
  document.getElementById("row-basic-wood-planks").style.display = u.basicSawmill ? "flex" : "none";
  document.getElementById("row-pebble-bricks").style.display     = u.brickfact    ? "flex" : "none";
  document.getElementById("row-rock-bricks").style.display       = u.rockfact     ? "flex" : "none";
  document.getElementById("row-salads").style.display            = u.catchen   ? "flex" : "none";
  document.getElementById("row-grilled-anchovy").style.display   = u.grilledAnchovy ? "flex" : "none";
  document.getElementById("row-human-leftovers").style.display   = etat.humanLeftovers > 0 ? "flex" : "none";

  RESOURCE_PAIRS.forEach(function(pair) {
    var resKey = pair.procRes.replace(/([A-Z])/g, '-$1').toLowerCase();
    afficherTauxNet("taux-" + resKey, pair.procUnlocked(u) ? tauxProductionTransformee(pair) : 0);
  });
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
  el.textContent = (parMin > 0 ? "+" : "") + parMin.toFixed(2) + "/m";
  el.classList.toggle("ressource-taux-positif", net > 0);
  el.classList.toggle("ressource-taux-negatif", net < 0);
}

// ── 9b. Catch sequence (header)
function renduSequence() {
  const enCours = etat.sequenceEnCours;
  const restant = etat.afficherTempsAjusteRecrutement
    ? tempsRestantSequence() / vitesseAttrapage()
    : tempsRestantSequence();
  const btnSeq   = document.getElementById("bouton-sequence");
  const recruit  = etat.chatons >= 3;
  btnSeq.disabled = enCours;
  btnSeq.classList.toggle("recruit", recruit);
  btnSeq.textContent = enCours
    ? (recruit ? formaterTemps(restant) : "Catching... " + formaterTemps(restant))
    : (recruit ? "Recruit a Kitty" : "Catch a kitty");
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

function renduPaireRessource(pair, u) {
  const qtyRawEl = document.getElementById("pqty-" + pair.rawRes);
  if (qtyRawEl) qtyRawEl.textContent = formaterNombre(etat[pair.rawRes]);
  const qtyProcEl = document.getElementById("pqty-" + pair.procRes);
  if (qtyProcEl) qtyProcEl.textContent = formaterNombre(etat[pair.procRes]);

  // Adjusted production times + tooltip detail sections
  const gl = gangLeaderBonus();
  const rawAdj  = Math.round(pair.rawCfg.secondesParUnite / (multiplicateurFamille(pair.rawAction) * gl));
  const procAdj = Math.round(pair.procCfg[pair.procSecUnite] / (multiplicateurFamille(pair.procMultAction) * gl));
  const rawAdjStr  = formaterTemps(rawAdj);
  const procAdjStr = formaterTemps(procAdj);
  var el;
  el = document.getElementById("ptadj-" + pair.rawRes);  if (el) el.textContent = rawAdjStr;
  el = document.getElementById("ptime-" + pair.rawRes);  if (el) el.textContent = rawAdjStr;
  el = document.getElementById("ptadj-" + pair.procRes); if (el) el.textContent = procAdjStr;
  el = document.getElementById("ptime-" + pair.procRes); if (el) el.textContent = procAdjStr;
  el = document.getElementById("pdetail-" + pair.rawRes);
  if (el) el.innerHTML = buildPairDetail(pair.rawCfg.secondesParUnite, pair.rawAction, pair.rawAction, false);
  el = document.getElementById("pdetail-" + pair.procRes);
  if (el) el.innerHTML = buildPairDetail(pair.procCfg[pair.procSecUnite], pair.procMultAction, pair.procAction, true);

  updateWorkerSlotUI(pair.rawAction, 0);
  updateWorkerSlotUI(pair.rawAction, 1);

  const rawRate  = tauxProductionBrute(pair.rawAction, pair.rawCfg);
  const procUnlocked = pair.procUnlocked(u);

  const sideProcEl = document.getElementById("pairside-" + pair.procAction);
  if (sideProcEl) sideProcEl.classList.toggle("pair-side-verrouille", !procUnlocked);

  const feedEl = document.getElementById("pfeed-" + pair.procAction);

  if (!procUnlocked) {
    afficherTauxNet("prate-" + pair.rawRes, rawRate);
    const rateProcEl = document.getElementById("prate-" + pair.procRes);
    if (rateProcEl) rateProcEl.textContent = "";
    if (feedEl) feedEl.textContent = "";
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
      feedEl.textContent = "";
    } else if (etat[pair.bloqueeKey]) {
      feedEl.textContent = "⏸";
      feedEl.title = "Out of stock";
    } else if (rawRate - procConsRate < -0.0005) {
      feedEl.textContent = "⚠️";
      feedEl.title = "Running low — raw production can't keep up";
    } else {
      feedEl.innerHTML = CHECK_ICON;
      feedEl.title = "Well fed";
    }
  }
}

function renduWorkPairs(u) {
  // Filter bar visibility — each button appears only when its family is unlocked
  const setDisplay = function(id, show) { const el = document.getElementById(id); if (el) el.style.display = show ? "" : "none"; };
  setDisplay("filtre-work-wood", u.cathering);
  setDisplay("filtre-work-food", u.grasscat);
  setDisplay("filtre-work-rock", u.pebblecat || u.rockcat);
  setDisplay("filtre-work-all",  u.grasscat || u.pebblecat || u.rockcat);
  const filtresBar = document.querySelector(".work-filtres");
  if (filtresBar) filtresBar.style.display = u.cathering ? "" : "none";

  const sectionEl = document.getElementById("section-work-pairs");
  if (!u.cathering) { if (sectionEl) sectionEl.style.display = "none"; return; }
  if (sectionEl) sectionEl.style.display = "";

  // Gang Leader passive speed banner
  const banner = document.getElementById("gang-leader-banner");
  if (banner) {
    const gl = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
    if (gl) {
      const mult = gangLeaderBonus();
      banner.style.display = "";
      banner.innerHTML = "👑 <strong>" + gl.nom + "</strong> is leading the gang — ×" + mult.toFixed(2) + " work speed (" + etat.kittiesData.length + " cats · " + gl.nom + " Lvl " + gl.niveau + ")";
    } else {
      banner.style.display = "none";
    }
  }

  const showWood = workFiltre === null || workFiltre === "wood";
  const showFood = (workFiltre === null || workFiltre === "food") && u.grasscat;
  const showRock = (workFiltre === null || workFiltre === "rock") && (u.pebblecat || u.rockcat);

  document.getElementById("famille-wood").style.display = showWood ? "block" : "none";
  document.getElementById("famille-food").style.display = showFood ? "block" : "none";
  document.getElementById("famille-rock").style.display = showRock ? "block" : "none";

  if (showWood) { renderManagerSlot("wood"); renderManagerSlot("sawmill"); }
  if (showFood) { renderManagerSlot("food"); renderManagerSlot("catchen"); }
  if (showRock) { renderManagerSlot("rock"); renderManagerSlot("pawsonry"); }

  const setRowDisplay = function(id, show) { const el = document.getElementById(id); if (el) el.style.display = show ? "flex" : "none"; };
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
  section.addEventListener("click", function(e) {
    const icon = e.target.closest(".pair-icon");
    if (!icon) return;
    const row = icon.closest(".pair-row");
    if (!row) return;
    const dejaOuverte = row.classList.contains("pair-info-ouverte");
    document.querySelectorAll(".pair-row.pair-info-ouverte").forEach(function(r) {
      r.classList.remove("pair-info-ouverte");
    });
    if (!dejaOuverte) row.classList.add("pair-info-ouverte");
    e.stopPropagation();
  });
  document.addEventListener("click", function() {
    document.querySelectorAll(".pair-row.pair-info-ouverte").forEach(function(r) {
      r.classList.remove("pair-info-ouverte");
    });
  });
})();

// ── 9d. Buildings section
function renduBuildings(u) {
  if (!u.buildings) return;

  // ── Wood Houses
  const cout = coutProchaineCathouse();
  document.getElementById("possede-cathouse").textContent = etat.cathouses.length;
  document.getElementById("cout-cathouse").textContent    = cout;
  document.getElementById("bouton-cathouse").disabled     = etat.cardboardPlanks < cout;
  const builderBonus = builderManagerBonus();
  const speedBox = etat.cathouses.length * CONFIG.cathouse.reductionParSeconde * builderBonus;
  document.getElementById("reduction-active").textContent = etat.cathouses.length > 0
    ? "+" + (Number.isInteger(speedBox) ? speedBox : speedBox.toFixed(2)) + "s/s recruit speed" : "";

  document.getElementById("bloc-wood-cathouse").style.display = u.catHouse ? "flex" : "none";
  if (u.catHouse) {
    const cout2 = coutProchaineCatHouse();
    document.getElementById("possede-cathouse2").textContent = etat.cathouseCount;
    document.getElementById("cout-cathouse2").textContent    = cout2;
    document.getElementById("bouton-cathouse2").disabled     = etat.basicWoodPlanks < cout2;
    const speedCat = etat.cathouseCount * CONFIG.realCathouse.reductionParSeconde * builderBonus;
    document.getElementById("reduction-wood-cathouse").textContent = etat.cathouseCount > 0
      ? "+" + (Number.isInteger(speedCat) ? speedCat : speedCat.toFixed(2)) + "s/s recruit speed" : "";
  }

  renderManagerSlot("houses");

  // ── Stone Houses
  const secStone = document.getElementById("section-stone-houses");
  if (secStone) secStone.style.display = u.stoneHouses ? "" : "none";
  if (u.stoneHouses) {
    const sc = coutProchaineStoneCathouse();
    const btnSC = document.getElementById("bouton-stone-cathouse");
    btnSC.disabled = etat.basicWoodPlanks < sc.planks || etat.pebbleBricks < sc.bricks;
    document.getElementById("cout-stone-planks").textContent = sc.planks;
    document.getElementById("cout-stone-bricks").textContent = sc.bricks;
    document.getElementById("possede-stone-cathouse").textContent = etat.stoneCathouseCount;
    const stoneSpeed = Math.round(etat.stoneCathouseCount * CONFIG.stoneCathouse.speedBonus * 100);
    document.getElementById("reduction-stone-cathouse").textContent = etat.stoneCathouseCount > 0
      ? "+" + stoneSpeed + "% recruit speed" : "";
  }
}

// ── 9e. Facilities section
function renduFacilities(u) {
  if (!u.jobCenter) return;
  const btnJC = document.getElementById("bouton-jobcenter");
  btnJC.disabled = etat.jobCenterConstruit || etat.pebbleBricks < 10 || etat.basicWoodPlanks < 1;
  btnJC.innerHTML = etat.jobCenterConstruit ? CHECK_ICON + " Built" :
    '10 <img class="cout-icone" src="img/resources/Pebble Brick_Final.png" alt="Pebble Brick"> + 1 <img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank">';
  const jcIface = document.getElementById("jc-interface");
  if (jcIface) jcIface.style.display = etat.jobCenterConstruit ? "block" : "none";
  if (etat.jobCenterConstruit) renduJobCenter(u);

  const secTC = document.getElementById("section-training-center");
  if (secTC) {
    secTC.style.display = u.trainingCenter ? "" : "none";
    if (u.trainingCenter) {
      const btnTC = document.getElementById("bouton-training-center");
      if (btnTC) {
        btnTC.disabled = etat.trainingCenterConstruit || etat.rockBricks < 10 || etat.basicWoodPlanks < 20;
        btnTC.innerHTML = etat.trainingCenterConstruit ? CHECK_ICON + " Built" :
          '10 <img class="cout-icone" src="img/resources/Rock Brick_Final.png" alt="Rock Brick"> + 20 <img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank">';
      }
    }
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
    entete.textContent = "Jobless";
    liste.appendChild(entete);
    sansJob.forEach(function(e) { liste.appendChild(creerCarteKitty(e.kitty, e.i)); });
  }

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
      humanLeftovers: { sprite: "img/resources/Human Leftovers_Final.png", nom: "Human Leftovers" }
    };
    const feedBtns = Object.keys(FOOD_XP).filter(function(f) { return etat[f] > 0; }).map(function(f) {
      const info  = FOOD_LABELS[f] || { nom: f };
      const icone = info.sprite ? '<img class="cout-icone" src="' + info.sprite + '" alt="' + info.nom + '">' : "";
      return "<button class='btn-xp-feed' onclick='nourrir(" + kittySelectionnee + ",\"" + f + "\")'>" + icone + " " + info.nom + " <span class='xp-gain'>+" + FOOD_XP[f] + " XP</span> <span class='xp-stock'>×" + etat[f] + "</span></button>";
    }).join("");
    const xpManquant   = xpNext - k.xp;
    const xpDisponible = Object.keys(FOOD_XP).reduce(function(s, f) { return s + etat[f] * FOOD_XP[f]; }, 0);
    const autoBtnDisabled = xpDisponible < xpManquant;
    const autoLevelBtn = "<button class='btn-xp-auto'" + (autoBtnDisabled ? " disabled" : "") + " onclick='nourrirAutoNiveau(" + kittySelectionnee + ")'>Auto-feed to next level <span class='xp-gain'>-" + xpManquant + " XP needed</span></button>";
    const levelBonuses = k.niveau > 0
      ? "<div class='xp-bonus-actifs'>" +
        "<span class='xp-bonus-ligne'>Basic Production Bonus x" + Math.pow(1.1, k.niveau).toFixed(2) + "</span>" +
        "<span class='xp-bonus-ligne'>Complex Production Bonus x" + Math.pow(1.05, k.niveau).toFixed(2) + "</span>" +
        "<span class='xp-bonus-ligne'>Exploration Power +" + k.niveau + "</span>" +
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
    const jobName = k.metier ? (METIERS[k.metier] ? METIERS[k.metier].emoji + " " + (TIERS_KITTIES[k.tier || 0] || "") + " " + METIERS[k.metier].nom : k.metier) : "Stray Cat";
    const jobBonus = k.metier ? (
      k.metier === "gang-leader"
        ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + gangLeaderBonus().toFixed(2) + "</span> Work speed for all workers<div class='bonus-sub'>Scales with gang size · own level amplifies</div></div>"
        : (METIERS[k.metier] ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + ((k.managerMult || 2) * jobLevelMultiplier(k)).toFixed(2) + "</span> production speed on " + METIERS[k.metier].familleNom + " when assigned as manager</div>" : "")
    ) : "";
    droite.innerHTML +=
      "<div class='detail-section'>" +
      "<div class='detail-section-titre'>Job</div>" +
      "<div class='detail-job-nom" + (k.metier ? "" : " kitty-vagabond") + "'>" + jobName + "</div>" +
      jobBonus +
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
  renduWorkPairs(u);
  renduBuildings(u);
  renduFacilities(u);
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
let carteZoneSelectionnee = "D1"; // Home is always accessible — show its missions right away
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

const RECOMPENSE_LIVRES = {
  schoolGuide:      { emoji: LIVRE_ICONE, nom: "School guide on jobs" },
  fishingGuide:     { emoji: LIVRE_ICONE, nom: "Fishing Guide for Dummies" },
  constructionPlan: { emoji: LIVRE_ICONE, nom: "Construction Plan" },
  stoneGuide:       { emoji: LIVRE_ICONE, nom: "Stone Craft Guide" },
  seminarGuide:     { emoji: LIVRE_ICONE, nom: "Corporate Seminar Booklet" }
};

function recompenseLabel(camp) {
  const id = camp.recompense;
  const livre = RECOMPENSE_LIVRES[id];
  if (livre) {
    const hint = etat.itemsAppris.includes(id) ? "Learned" : "go to Inventory to learn it";
    return livre.emoji + " " + livre.nom + " received <span class='recompense-hint'>(" + hint + ")</span>";
  }
  if (id === "humanLeftovers" && camp.recompenseQty) return "&#x1F5D1;&#xFE0F; " + camp.recompenseQty + "x Human Leftovers received";
  return id + " received";
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
          html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
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
        const power     = inProgress.kittyIndices.reduce(function(s, i) { return s + (etat.kittiesData[i] ? etat.kittiesData[i].niveau + 1 : 1); }, 0);
        const chance    = Math.min(100, Math.round(power / camp.difficulte * 100));
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x1F431; ' + names + ' &nbsp;&middot;&nbsp; ' + chance + '% success</div>';
        html += '<div class="conteneur-barre"><div class="barre barre-explo" id="explo-barre-' + camp.id + '" style="width:' + Math.round(progress * 100) + '%"></div></div>';
        html += '<div class="explo-timer" id="explo-timer-' + camp.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
      } else {
        const selPower  = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? etat.kittiesData[ki].niveau + 1 : 0); }, 0);
        const allFilled = slots.every(function(x) { return x !== null; });
        const chance    = selPower > 0 ? Math.min(100, Math.round(selPower / camp.difficulte * 100)) : 0;
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(camp.duree) + ' &nbsp;&middot;&nbsp; &#x1F381; To be discovered</div>';
        html += '<div class="explo-slots">';
        for (let si = 0; si < camp.slots; si++) {
          const ki = slots[si];
          if (ki === null) {
            html += '<div class="explo-slot explo-slot-empty" onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add kitty</div></div>';
          } else {
            const k = etat.kittiesData[ki];
            html += '<div class="explo-slot explo-slot-filled" onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
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
          scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
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
            scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(stagedK) + '</span>';
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
        html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
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
  if (!zoneId) { el.innerHTML = '<p class="explo-vide">Select a zone to see its details.</p>'; return; }
  const zone = ZONES_CARTE[zoneId];
  if (!zone) { el.innerHTML = ""; return; }
  const exploree = etat.zonesExplorees.includes(zoneId);

  let html = '<div class="zone-info-titre">' + (exploree ? zone.nom : 'Unknown zone') + '</div>';
  if (zone.description) html += '<div class="zone-description">' + zone.description + '</div>';

  html += '<div class="zone-info-ligne"><span>Exploration Status ' + (exploree ? CHECK_ICON : '❌') + '</span></div>';

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
            (disabled ? '' : ' onclick="selectionnerKittySlot(' + i + ')"') + '>';
    html += '<span class="explo-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="explo-modal-kitty-info">';
    html += '<span class="explo-modal-kitty-nom">' + k.nom + '</span>';
    html += '<span class="explo-modal-kitty-power">&#x26A1; Exploration Power ' + (k.niveau + 1) + '</span>';
    if (k.metier === "explorator") html += '<span class="explo-modal-kitty-effect">&#x23F1; Halves mission time</span>';
    if (statusLabel) html += '<span class="explo-modal-kitty-status">' + statusLabel + '</span>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" onclick="forcerKittySlot(' + i + ');event.stopPropagation()">Force</button>';
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
  exploTabDirty = true;
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
  ajouterLog("unlock", "Zone explored: " + (z ? z.nom : zoneId) + ".");
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
    appliquerRecompense(camp.recompense, camp.recompenseQty);
    ajouterLog("event", "Campaign '" + camp.nom + "' completed! " + names + " returned with the reward.");
  } else {
    ajouterLog("event", "Campaign '" + camp.nom + "' failed — " + names + " returned empty-pawed.");
    afficherNotification("❌ " + camp.nom + " failed — try with more power!");
  }
  exploTabDirty = true;
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
  _resPopupTarget = el;
  var popup  = document.getElementById("inv-res-popup");
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
  document.getElementById("inv-res-popup").style.display = "none";
  _resPopupTarget = null;
}

function toggleResPopup(el, evt) {
  evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showResPopup(el);
}

function selectionnerItem(itemId) {
  itemSelectionne = (itemSelectionne === itemId) ? null : itemId;
  inventaireDirty = true;
  renduInventaire(unlocks());
}

function filtrerResources(cat) {
  resCategorieFiltree = cat;
  var resEl  = document.getElementById("inv-resources");
  var tabsEl = document.getElementById("inv-res-tabs");
  if (resEl) resEl.dataset.visibleKey = "";  // force rebuild
  renderResourcesSection(unlocks());
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
  { id: "wood",  label: "Woods" },
  { id: "food",  label: "Food"  },
  { id: "stone", label: "Stone" },
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
    { id: "inv-res-human-leftovers", label: "Human Leftovers",   category: "food",  sprite: "img/resources/Human Leftovers_Final.png",   val: function() { return etat.humanLeftovers;   }, visible: etat.humanLeftovers > 0 },
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
      resEl.innerHTML = '<p class="inv-vide">No resources yet.</p>';
      return;
    }

    // Show tabs only when more than one category has visible resources
    const availableCats = RES_CATEGORIES.filter(function(cat) {
      return allVisible.some(function(r) { return r.category === cat.id; });
    });
    if (tabsEl) {
      if (availableCats.length > 1) {
        let tabsHtml = '<div class="inv-res-tabs">';
        tabsHtml += '<button class="inv-res-tab' + (resCategorieFiltree === "all" ? " inv-res-tab-actif" : "") + '" onclick="filtrerResources(\'all\')">All</button>';
        availableCats.forEach(function(cat) {
          tabsHtml += '<button class="inv-res-tab' + (resCategorieFiltree === cat.id ? " inv-res-tab-actif" : "") + '" onclick="filtrerResources(\'' + cat.id + '\')">' + cat.label + '</button>';
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
                 + ' onmouseenter="if(matchMedia(\'(hover:hover)\').matches)showResPopup(this)"'
                 + ' onmouseleave="if(matchMedia(\'(hover:hover)\').matches)hideResPopup()"'
                 + ' onclick="toggleResPopup(this,event)">';
        resHtml += '<img class="inv-res-sprite" src="' + r.sprite + '" alt="' + r.label + '">';
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
    const qtyEl = document.getElementById(r.id + "-qty");
    if (qtyEl) qtyEl.textContent = formaterNombre(Math.floor(r.val()));
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
    if (appris) html += '<span class="inv-item-tag">' + CHECK_ICON + ' Learned</span>';
    html += '</div>';
    html += '</div>';

    if (actif) {
      html += '<div class="inv-item-detail">';
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
        const k        = etat.kittiesData[idx];
        const tier     = TIERS_KITTIES[k.tier] || "Kitty";
        const busy     = kittyIsBusy(idx);
        const enWorker = kittyIsInWorkerSlot(idx);
        const forcable = busy && enWorker && !kittyIsOnExpedition(idx) && !kittyIsOnZoneExplo(idx) &&
                         !kittyIsOnScouting(idx) && !kittyIsInScoutingStaging(idx) && !kittyIsInTraining(idx);
        const busyLbl  = busy ? kittyAllocationLabel(idx).text : "";
        html += '<div class="jc-modal-kitty' + (busy ? ' jc-modal-kitty-disabled' : '') + '"' +
                (busy ? '' : ' onclick="selectionnerKittyFormation(' + idx + ')"') + '>';
        html += '<div class="jc-modal-kitty-info">';
        html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
        html += '<span class="jc-modal-kitty-tier">' + tier + (busyLbl ? ' — ' + busyLbl : '') + '</span>';
        html += '</div>';
        if (forcable) html += '<button class="btn-forcer" onclick="forcerKittyFormation(' + idx + ');event.stopPropagation()">Force</button>';
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
                  (occupe ? '' : ' onclick="assignerManager(\'' + famille + '\',' + idx + ')"') + '>';
          html += '<div class="jc-modal-kitty-info">';
          html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
          html += '<span class="jc-modal-kitty-tier">' + (m ? m.emoji + " " + m.nom : k.metier) + statutTxt + '</span>';
          html += '</div>';
          html += '<div class="jc-modal-kitty-bonus">';
          html += '<div class="jc-modal-kitty-bonus-ligne">×' + bonus + ' <span class="jc-modal-kitty-bonus-label">production speed</span></div>';
          html += '</div>';
          if (forcable) html += '<button class="btn-forcer" onclick="forcerManager(\'' + famille + '\',' + idx + ');event.stopPropagation()">Force</button>';
          html += '</div>';
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
  const el = document.getElementById("manager-slot-" + famille);
  if (!el) return;
  const debloque = famille === "houses"
    ? etat.itemsAppris.includes("constructionPlan")
    : etat.managersDebloques;
  if (!debloque) {
    el.style.display = "none";
    return;
  }
  el.style.display = "flex";
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
          '<div class="worker-ring-inner">' + kittyIconHtml(kitty) + '</div>' +
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
            (disabled ? '' : ' onclick="assignerWorkerSlot(' + i + ')"') + '>';
    html += '<span class="worker-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="worker-modal-kitty-info">';
    html += '<span class="worker-modal-kitty-nom">' + k.nom + '</span>';
    if (status) html += '<span class="worker-modal-kitty-status">' + status + '</span>';
    html += '</div>';
    html += '<div class="worker-modal-kitty-bonus">';
    html += '<div class="worker-modal-kitty-bonus-ligne">×' + prodMult.toFixed(2) + ' <span class="worker-modal-kitty-bonus-label">' + prodLabel + '</span></div>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" onclick="forcerWorkerSlot(' + i + ',\'' + workerModalOuvert.action + '\',' + workerModalOuvert.slotIdx + ');event.stopPropagation()">Force</button>';
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
        html += '<div class="jc-slot-filled" onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
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
  etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: Date.now(), visage: assignerVisageChaton(nom) });
  afficherNotification("🐱 " + nom + " joined the gang!");
  ajouterLog("event", nom + " caught!");
  renduManagement();
  if (etat.chatons === 3) {
    afficherNotification("🐾 Cathering unlocked! Put your kitties to work.");
    ajouterLog("unlock", "Cathering unlocked — put your kitties to work.");
  }
  if (etat.chatons === 5) {
    afficherNotification("🌿 Grasscatting unlocked!");
    ajouterLog("unlock", "Grasscatting unlocked!");
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

function tickWorkers(action, stockKey, totalKey, cfg, onUnlockCheck, dt, glBonus) {
  const slots = etat.workers[action];
  if (!slots) return;
  if (dt      === undefined) dt      = vitesse * TICK_DT;
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

  // Processing: Sawmill (cardboard → cardboard planks)
  if (allocationCount("sawmill") > 0) {
    if (etat.cardboardPieces >= 1) {
      etat.scieriBloquee = false;
      const dt_saw = vitesse * TICK_DT * gl;
      const mult   = multiplicateurFamille("sawmill");
      etat.workers.sawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dt_saw / CONFIG.sawmill.secondesParPlanche;
        etat.cardboardPieces = Math.max(0, etat.cardboardPieces - (slot.progress - prev) * (CONFIG.sawmill.secondesParPlanche / CONFIG.sawmill.secondesParCardboard));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const p = Math.floor(slot.prodFrac); slot.prodFrac -= p; etat.cardboardPlanks += p;
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
      const dt_bsw = vitesse * TICK_DT * gl;
      const mult   = multiplicateurFamille("sawmill");
      etat.workers.basicSawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dt_bsw / CONFIG.basicSawmill.secondesParPlanche;
        etat.basicWood = Math.max(0, etat.basicWood - (slot.progress - prev) * (CONFIG.basicSawmill.secondesParPlanche / CONFIG.basicSawmill.secondesParBasicWood));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const p = Math.floor(slot.prodFrac); slot.prodFrac -= p; etat.basicWoodPlanks += p;
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
      const dt_bf = vitesse * TICK_DT * gl;
      const mult   = multiplicateurFamille("brickfactory");
      etat.workers.brickfactory.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dt_bf / CONFIG.brickfactory.secondesParBrique;
        etat.pebbles = Math.max(0, etat.pebbles - (slot.progress - prev) * (CONFIG.brickfactory.secondesParBrique / CONFIG.brickfactory.secondesParPebble));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const b = Math.floor(slot.prodFrac); slot.prodFrac -= b; etat.pebbleBricks += b;
        }
      });
    } else {
      etat.brickBloquee = true;
    }
  }

  // Processing: Rock Forge (rocks → rock bricks)
  if (allocationCount("rockFactory") > 0) {
    if (etat.rocks >= 1) {
      etat.rockFactoryBloquee = false;
      const dt_rf = vitesse * TICK_DT * gl;
      const mult   = multiplicateurFamille("rockFactory");
      etat.workers.rockFactory.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dt_rf / CONFIG.rockFactory.secondesParBrique;
        etat.rocks = Math.max(0, etat.rocks - (slot.progress - prev) * (CONFIG.rockFactory.secondesParBrique / CONFIG.rockFactory.secondesParRock));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const b = Math.floor(slot.prodFrac); slot.prodFrac -= b; etat.rockBricks += b;
        }
      });
    } else {
      etat.rockFactoryBloquee = true;
    }
  }

  // Processing: Catchen (catnip → salads)
  if (allocationCount("catchen") > 0) {
    if (etat.catnip >= 1) {
      etat.catchenBloquee = false;
      const dt_cat = vitesse * TICK_DT * gl;
      const mult   = multiplicateurFamille("catchen");
      etat.workers.catchen.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dt_cat / CONFIG.catchen.secondesParSalad;
        etat.catnip = Math.max(0, etat.catnip - (slot.progress - prev) * (CONFIG.catchen.secondesParSalad / CONFIG.catchen.secondesParCatnip));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const s = Math.floor(slot.prodFrac); slot.prodFrac -= s; etat.salads += s;
          if (s > 0 && !etat.premiereSaladeFaite) {
            etat.premiereSaladeFaite = true;
            const cookName = etat.kittiesData[slot.kittyIndex] ? etat.kittiesData[slot.kittyIndex].nom : "a kitty";
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
      const dt_anch = vitesse * TICK_DT * gl;
      const mult    = multiplicateurFamille("grilledAnchovy");
      etat.workers.grilledAnchovy.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dt_anch / CONFIG.grilledAnchovy.secondesParRecette;
        etat.anchovy = Math.max(0, etat.anchovy - (slot.progress - prev) * (CONFIG.grilledAnchovy.secondesParRecette / CONFIG.grilledAnchovy.secondesParAnchovy));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const g = Math.floor(slot.prodFrac); slot.prodFrac -= g; etat.grilledAnchovy += g;
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

  const dtgl = dt * gl;

  if (allocationCount("sawmill") > 0) {
    if (etat.cardboardPieces >= 1) {
      etat.scieriBloquee = false;
      const mult = multiplicateurFamille("sawmill");
      etat.workers.sawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dtgl / CONFIG.sawmill.secondesParPlanche;
        etat.cardboardPieces = Math.max(0, etat.cardboardPieces - (slot.progress - prev) * (CONFIG.sawmill.secondesParPlanche / CONFIG.sawmill.secondesParCardboard));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const p = Math.floor(slot.prodFrac); slot.prodFrac -= p; etat.cardboardPlanks += p;
        }
      });
    } else { etat.scieriBloquee = true; }
  }

  if (allocationCount("basicSawmill") > 0) {
    if (etat.basicWood >= 1) {
      etat.basicSawmillBloquee = false;
      const mult = multiplicateurFamille("sawmill");
      etat.workers.basicSawmill.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dtgl / CONFIG.basicSawmill.secondesParPlanche;
        etat.basicWood = Math.max(0, etat.basicWood - (slot.progress - prev) * (CONFIG.basicSawmill.secondesParPlanche / CONFIG.basicSawmill.secondesParBasicWood));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const p = Math.floor(slot.prodFrac); slot.prodFrac -= p; etat.basicWoodPlanks += p;
        }
      });
    } else { etat.basicSawmillBloquee = true; }
  }

  if (allocationCount("brickfactory") > 0) {
    if (etat.pebbles >= 1) {
      etat.brickBloquee = false;
      const mult = multiplicateurFamille("brickfactory");
      etat.workers.brickfactory.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dtgl / CONFIG.brickfactory.secondesParBrique;
        etat.pebbles = Math.max(0, etat.pebbles - (slot.progress - prev) * (CONFIG.brickfactory.secondesParBrique / CONFIG.brickfactory.secondesParPebble));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const b = Math.floor(slot.prodFrac); slot.prodFrac -= b; etat.pebbleBricks += b;
        }
      });
    } else { etat.brickBloquee = true; }
  }

  if (allocationCount("rockFactory") > 0) {
    if (etat.rocks >= 1) {
      etat.rockFactoryBloquee = false;
      const mult = multiplicateurFamille("rockFactory");
      etat.workers.rockFactory.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dtgl / CONFIG.rockFactory.secondesParBrique;
        etat.rocks = Math.max(0, etat.rocks - (slot.progress - prev) * (CONFIG.rockFactory.secondesParBrique / CONFIG.rockFactory.secondesParRock));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const b = Math.floor(slot.prodFrac); slot.prodFrac -= b; etat.rockBricks += b;
        }
      });
    } else { etat.rockFactoryBloquee = true; }
  }

  if (allocationCount("catchen") > 0) {
    if (etat.catnip >= 1) {
      etat.catchenBloquee = false;
      const mult = multiplicateurFamille("catchen");
      etat.workers.catchen.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dtgl / CONFIG.catchen.secondesParSalad;
        etat.catnip = Math.max(0, etat.catnip - (slot.progress - prev) * (CONFIG.catchen.secondesParSalad / CONFIG.catchen.secondesParCatnip));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const s = Math.floor(slot.prodFrac); slot.prodFrac -= s; etat.salads += s;
          if (s > 0 && !etat.premiereSaladeFaite) etat.premiereSaladeFaite = true;
        }
      });
    } else { etat.catchenBloquee = true; }
  }

  if (grilledAnchovyDebloquee() && allocationCount("grilledAnchovy") > 0) {
    if (etat.anchovy >= 1) {
      etat.catchenAnchovyBloquee = false;
      const mult = multiplicateurFamille("grilledAnchovy");
      etat.workers.grilledAnchovy.forEach(function(slot) {
        if (slot.kittyIndex === null) return;
        const procBonus = productionProcBonus(etat.kittiesData[slot.kittyIndex]);
        const prev = slot.progress;
        slot.progress += mult * dtgl / CONFIG.grilledAnchovy.secondesParRecette;
        etat.anchovy = Math.max(0, etat.anchovy - (slot.progress - prev) * (CONFIG.grilledAnchovy.secondesParRecette / CONFIG.grilledAnchovy.secondesParAnchovy));
        if (slot.progress >= 1) {
          const cycles = Math.floor(slot.progress); slot.progress -= cycles;
          slot.prodFrac = (slot.prodFrac || 0) + cycles * procBonus;
          const g = Math.floor(slot.prodFrac); slot.prodFrac -= g; etat.grilledAnchovy += g;
        }
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
    etat.kittiesData.push({ nom: kittyAttrapeNom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 2, catchTs: maintenant, visage: assignerVisageChaton(kittyAttrapeNom) });
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

const STORY_IMAGES = {
  "ecran-intro":    "Intro.png",
  "ecran-story-3":  "Story 3.png",
  "ecran-story-4":  "Story 4.png",
  "ecran-story-6b": "Story 6b.png"
};

const STORIES = [
  { id: "ecran-intro",    nom: "Intro",    flag: "introVue" },
  { id: "ecran-story-1",  nom: "Bernardo plan begins", flag: "story1Vue" },
  { id: "ecran-story-2",  nom: "Mochi joins the gang", flag: "story2Vue" },
  { id: "ecran-story-3",  nom: "The adventure begins",  flag: "story3Vue" },
  { id: "ecran-story-4",  nom: "Our first creation",    flag: "story4Vue" },
  { id: "ecran-story-5",  nom: "Gang on the rise",      flag: "story5Vue" },
  { id: "ecran-story-6a", nom: "What's that thing?",    flag: "story6aVue" },
  { id: "ecran-story-6b", nom: "A job for everyone",    flag: "story6bVue" },
  { id: "ecran-story-salad", nom: "Story Salad", flag: "storySaladVue" },
  { id: "ecran-story-seminar", nom: "Story Seminar", flag: "storySeminarVue" }
];

function renduStories() {
  const conteneur = document.getElementById("stories-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  STORIES.forEach(function(story) {
    if (!localStorage.getItem(story.flag)) return;
    const carte = document.createElement("button");
    carte.className = "story-carte";
    carte.onclick = function() { afficherModal(story.id); };
    const src = STORY_IMAGES[story.id];
    if (src) {
      const img = document.createElement("img");
      img.className = "story-carte-image";
      img.src = "img/Story scenes/" + src;
      carte.appendChild(img);
    }
    const nom = document.createElement("span");
    nom.className   = "story-carte-nom";
    nom.textContent = story.nom;
    carte.appendChild(nom);
    conteneur.appendChild(carte);
  });
}

function changerSousOngletLogs(vue) {
  ["log", "stories"].forEach(function(v) {
    document.getElementById("logs-vue-" + v).style.display = v === vue ? "flex" : "none";
    document.getElementById("logs-subtab-" + v).classList.toggle("logs-subtab-actif", v === vue);
  });
  if (vue === "stories") renduStories();
}

function fermerModal(id) { document.getElementById(id).style.display = "none"; }
function afficherModal(id) {
  const el = document.getElementById(id);
  el.style.display = "flex";
  const boite = el.querySelector(".intro-boite");
  const src = STORY_IMAGES[id];
  if (boite) {
    let img = boite.querySelector(".story-image");
    if (src) {
      if (!img) {
        img = document.createElement("img");
        img.className = "story-image";
        boite.insertBefore(img, boite.firstChild);
      }
      img.src = "img/Story scenes/" + src;
    } else if (img) {
      img.remove();
    }
  }
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
  ["gang", "work", "buildings", "facilities", "explorations", "inventaire", "logs"].forEach(function(tab) {
    document.getElementById("contenu-" + tab).style.display  = id === tab ? "block" : "none";
    document.getElementById("onglet-" + tab).classList.toggle("onglet-actif", id === tab);
  });
  document.body.dataset.ongletActif = id;
  if (id === "explorations") { exploTabDirty  = true; }
  if (id === "inventaire")  { inventaireDirty = true; }
  if (id === "facilities")  { jcDirty = true; }
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
renduStories();
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
