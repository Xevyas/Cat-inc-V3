(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

const LIVRE_ICONE = '<img class="livre-icone" src="img/resources/Books_Final.png?v=0.0025" alt="Book">';

// ── Resource info popups (Inventory tab) ─────────────────────
// Keep this in sync whenever a resource is added or changed.
const RESOURCE_INFO = {
  "inv-res-cardboard": {
    nom:     "Cardboard Pieces",
    tier:    "Tier 1 · Wood family",
    desc:    "Small patches of cardboard found lying on the ground. Might be useful.",
    produce: "Gathered privately by a Cat assigned to a Cardboard Planks recipe.",
    usage:   "Used inside that recipe slot (10 pieces per plank). It is never stored globally."
  },
  "inv-res-cardboard-plank": {
    nom:     "Cardboard Planks",
    tier:    "Tier 1 · Wood family (processed)",
    desc:    "Sturdy planks pressed from cardboard. The backbone of early construction.",
    produce: "Assign a Cat to a Cardboard Planks recipe in Work. The slot privately gathers 10 Cardboard Pieces first.",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-basic-wood": {
    nom:     "Basic Wood",
    tier:    "Tier 2 · Wood family",
    desc:    "Rough wooden planks salvaged from human furniture. Heavier to carry, but sturdier.",
    produce: "Gathered privately by a Cat assigned to a Basic Wood Planks recipe.",
    usage:   "Used inside that recipe slot (10 logs per plank). It is never stored globally."
  },
  "inv-res-wood-plank": {
    nom:     "Basic Wood Planks",
    tier:    "Tier 2 · Wood family (processed)",
    desc:    "Refined wooden planks, sanded and shaped. A real upgrade from cardboard.",
    produce: "Assign a Cat to a Basic Wood Planks recipe in Work. The slot privately gathers 10 Basic Wood first.",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-catnip": {
    nom:     "Catnip",
    tier:    "Tier 1 · Food family",
    desc:    "Fresh catnip from the garden. Nutritious, if you're a cat.",
    produce: "Gathered privately by a Cat assigned to a Catnip Salads recipe.",
    usage:   "Used inside that recipe slot (10 catnip per salad). It is never stored globally."
  },
  "inv-res-salads": {
    nom:     "Salads",
    tier:    "Tier 1 · Food family (processed)",
    desc:    "A balanced catnip salad. Even Bernardo eats his greens.",
    produce: "Assign a Cat to a Catnip Salads recipe in Work. The slot privately gathers 10 Catnip first.",
    usage:   "Feed to a cat in the Gang tab to give them +1 XP."
  },
  "inv-res-anchovy": {
    nom:     "Anchovy",
    tier:    "Tier 2 · Food family",
    desc:    "Fresh anchovies fished from the nearby stream. A cat's favourite.",
    produce: "Gathered privately by a Cat assigned to a Grilled Anchovy recipe.",
    usage:   "Used inside that recipe slot (10 anchovies per serving). It is never stored globally."
  },
  "inv-res-grilled-anchovy": {
    nom:     "Grilled Anchovy",
    tier:    "Tier 2 · Food family (processed)",
    desc:    "Golden, crispy, perfectly grilled. Worth every second of cooking.",
    produce: "Assign a Cat to a Grilled Anchovy recipe in Work. The slot privately gathers 10 Anchovies first.",
    usage:   "Not yet used — future recipes coming."
  },
  "inv-res-pebbles": {
    nom:     "Pebbles",
    tier:    "Tier 1 · Rock family",
    desc:    "Small smooth pebbles gathered from the yard. Heavy pockets, light heart.",
    produce: "Gathered privately by a Cat assigned to a Pebble Bricks recipe.",
    usage:   "Used inside that recipe slot (10 pebbles per brick). It is never stored globally."
  },
  "inv-res-pebble-brick": {
    nom:     "Pebble Bricks",
    tier:    "Tier 1 · Rock family (processed)",
    desc:    "Compact bricks made from compressed pebbles. Surprisingly solid.",
    produce: "Assign a Cat to a Pebble Bricks recipe in Work. The slot privately gathers 10 Pebbles first.",
    usage:   "Used to construct buildings like Facilities."
  },
  "inv-res-rocks": {
    nom:     "Rocks",
    tier:    "Tier 2 · Rock family",
    desc:    "Dense stones hauled from deeper in the yard. Much heavier than pebbles.",
    produce: "Gathered privately by a Cat assigned to a Rock Bricks recipe.",
    usage:   "Used inside that recipe slot (10 rocks per brick). It is never stored globally."
  },
  "inv-res-rock-brick": {
    nom:     "Rock Bricks",
    tier:    "Tier 2 · Rock family (processed)",
    desc:    "Solid bricks forged from dense rock. Built to last.",
    produce: "Assign a Cat to a Rock Bricks recipe in Work. The slot privately gathers 10 Rocks first.",
    usage:   "Used in advanced construction."
  },
  "inv-res-human-leftovers": {
    nom:     "Human Leftovers",
    tier:    null,
    desc:    "Bits and pieces left behind by humans. One human's trash is another cat's treasure.",
    produce: "Found by sending cats on Exploration campaigns.",
    usage:   "Feed to a cat in the Gang tab to give them +1 XP."
  },
  "inv-res-human-workers-food": {
    nom:     "Workers Food",
    tier:    null,
    desc:    "Packed lunches left behind by the construction workers. Still good.",
    produce: "Found by scouting the basement in A1 (unlocks after both A1 campaigns).",
    usage:   "Feed to a cat in the Gang tab to give them +15 XP."
  },
  "inv-res-canned-cat-food": {
    nom:     "Canned Cat Food",
    tier:    "Training Materials",
    desc:    "A sealed can of premium cat food found in the supermarket. This is the good stuff.",
    produce: "Complete or scout the Supermarket in the Exploration tab.",
    usage:   "Used in the Training Center to improve job levels."
  }
};

const ITEMS = {
  compass: {
    id:           "compass",
    type:         "unique",
    nom:          "Compass",
    emoji:        '<img class="inv-item-sprite" src="img/resources/Compass_Final.png?v=0.0039" alt="Compass">',
    description:  "A battered compass recovered from the Gas Station. Its needle points beyond the neighbourhood, toward somewhere none of us have explored yet.",
    produce:      "Found in the Gas Station after sneaking through the back entrance.",
    usage:        "Useful for navigating through the woods and finding the way to the wider world.",
    actions:      []
  },
  schoolGuide: {
    id:           "schoolGuide",
    nom:          "School Guide",
    emoji:        LIVRE_ICONE,
    description:  "A human guide to a few job orientations for kids. We may learn something from it.",
    unlocksLabel: "Explorator, Lumberjack, Carpenter, Farmer and Chef jobs",
    studyDuration: 60000,
    learningGame: {
      phraseParts: [
        "You can ",
        " to be anything: a brave ",
        ", a skilled ",
        ", or even a great ",
        "!"
      ],
      answers: ["learn", "explorer", "builder", "chef"]
    },
    actions: [
      { id: "study", label: "Study" }
    ]
  },
  fishingGuide: {
    id:           "fishingGuide",
    nom:          "Fishing Guide for Dummies",
    emoji:        LIVRE_ICONE,
    description:  "A complete beginner's guide to feline fishing. Spoiler: you don't need a rod.",
    unlocksLabel: "Anchovy fishing and Grilled Anchovy",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "A patient ",
        " watches the ",
        ", catches an ",
        ", then grills it in the ",
        "!"
      ],
      answers: ["fisher", "water", "anchovy", "Catchen"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  constructionPlan: {
    id:           "constructionPlan",
    nom:          "Construction Plan",
    emoji:        LIVRE_ICONE,
    description:  "Blueprints for renovating the house. Someone's been busy.",
    unlocksLabel: "Wood Builder job",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "Every sturdy ",
        " begins with a careful ",
        ": measure the ",
        ", then let the ",
        " start working!"
      ],
      answers: ["house", "plan", "planks", "builder"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  seminarGuide: {
    id:           "seminarGuide",
    nom:          "Corporate Seminar Booklet",
    emoji:        LIVRE_ICONE,
    description:  "A booklet about professional training seminars. Participants walk out with new skills and sharper instincts for their trade.",
    unlocksLabel: "Training Center",
    studyDuration: 7200000,
    learningGame: {
      phraseParts: [
        "An effective seminar aligns our ",
        ", unlocks collective ",
        ", fosters meaningful ",
        ", strengthens team ",
        ", accelerates sustainable ",
        ", and transforms every challenge into an ",
        "!"
      ],
      answers: ["values", "potential", "collaboration", "synergy", "growth", "opportunity"]
    },
    actions: [
      { id: "study", label: "Study (2h)" }
    ]
  },
  stoneGuide: {
    id:           "stoneGuide",
    nom:          "Stone Craft Guide",
    emoji:        LIVRE_ICONE,
    description:  "A human guide to mining and stone masonry. Heavy reading, heavy lifting.",
    unlocksLabel: "Miner and Stonemason jobs",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "A skilled ",
        " breaks through ",
        " like butter, while a careful ",
        " shapes them into solid ",
        "!"
      ],
      answers: ["miner", "rocks", "stonemason", "bricks"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
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

// ── Sphere grids (one per job, UX-only for now) ─────────────────────────────
function simpleResourceSphereGrid(prefix, resourceLabel) {
  return {
    spheres: [
      { id: prefix + '-prod', x: 120, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'PROD BOOST',
        desc: 'Increases the production of "' + resourceLabel + '" by 50%. This adds to the worker\'s level bonus.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: prefix + '-c', x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'PROD SPEED',
        desc: 'The manager increases the production speed of the "' + resourceLabel + '" family. The base manager bonus is already active when the job is learned.',
        etat: 'learned' },
      { id: prefix + '-speed', x: 460, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST',
        desc: 'Increases the speed boost granted to the "' + resourceLabel + '" by 50%. This adds to the manager\'s level bonus.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
    ],
    connections: [
      [prefix + '-prod', prefix + '-c'],
      [prefix + '-c', prefix + '-speed'],
    ]
  };
}

function complexResourceSphereGrid(prefix, resourceLabel, rawLabel) {
  return {
    spheres: [
      { id: prefix + '-cost', x: 120, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'HALVES COST',
        desc: 'Halves the cost of ' + resourceLabel + ' from 10 to 5 ' + rawLabel + '.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: prefix + '-c', x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'PROD SPEED',
        desc: 'The manager increases the production speed of the ' + resourceLabel + ' family. The base manager bonus is already active when the job is learned.',
        etat: 'learned' },
      { id: prefix + '-speed', x: 460, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST',
        desc: 'Increases the speed boost granted to ' + resourceLabel + ' by 50%. This adds to the manager\'s level bonus.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
    ],
    connections: [
      [prefix + '-cost', prefix + '-c'],
      [prefix + '-c', prefix + '-speed'],
    ]
  };
}

function builderSphereGrid() {
  return {
    spheres: [
      { id: 'builder-auto', x: 290, y: 90, r: 36, couleur: '#3aaecf',
        nom: 'AUTO BUILD',
        desc: 'Automatically builds Wood Houses when the next house costs less than 50% of the available Planks. Adds an On/Off toggle in the Buildings tab.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'builder-cost', x: 135, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'COST REDUCED',
        desc: 'Changes the Wood Houses cost formula from 1.7^n to 1.6^n.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'builder-c', x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'PROD SPEED',
        desc: 'Wood Houses grant their base recruit-speed bonus. The builder manager bonus is already active when the job is learned.',
        etat: 'learned' },
      { id: 'builder-speed', x: 445, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST',
        desc: 'Increases the speed boost granted by Wood Houses by 50%.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'builder-l1', x: 55, y: 165, r: 26, couleur: '#ffbf00', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'builder-l2', x: 40, y: 290, r: 26, couleur: '#ffbf00', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'builder-l3', x: 55, y: 415, r: 26, couleur: '#ffbf00', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'builder-r1', x: 525, y: 165, r: 26, couleur: '#85d46e', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'builder-r2', x: 540, y: 290, r: 26, couleur: '#85d46e', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'builder-r3', x: 525, y: 415, r: 26, couleur: '#85d46e', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
    ],
    connections: [
      ['builder-c', 'builder-auto'], ['builder-c', 'builder-cost'], ['builder-c', 'builder-speed'],
      ['builder-cost', 'builder-l1'], ['builder-cost', 'builder-l2'], ['builder-cost', 'builder-l3'],
      ['builder-speed', 'builder-r1'], ['builder-speed', 'builder-r2'], ['builder-speed', 'builder-r3'],
    ]
  };
}

const SPHERE_GRIDS = {
  'gang-leader': {
    spheres: [
      // ── Center ──────────────────────────────────────────────────────────────
      { id: 'gl-c',     x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'GLOBAL SPEED',
        desc: "Bernardo's leadership bonus applies to all workers' production speed.",
        etat: 'learned' },
      // ── Mid nodes ───────────────────────────────────────────────────────────
      { id: 'gl-qol',   x: 290, y: 155, r: 30, couleur: '#3aaecf',
        nom: 'QOL EXP',
        desc: "Bernardo can now manage the Food for the gang. Unlocks QoL for the food management. Also unlocks the Blue perks section.",
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'gl-rec',   x: 155, y: 290, r: 30, couleur: '#d4a820',
        nom: 'RECRUIT SPEED',
        desc: "Applies Bernardo's bonus to the Houses section. Also unlocks the Orange perks section.",
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'gl-mini',  x: 425, y: 290, r: 30, couleur: '#4db84d',
        nom: 'MINI GAME',
        desc: "Reduces Mini game speed and size by 2. Also unlocks the Green perks section.",
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'gl-explo', x: 290, y: 425, r: 30, couleur: '#b85dd4',
        nom: 'EXPLO',
        desc: "Bernardo gets the same bonus as the exploration basic bonus. Also unlocks the Violet perks section.",
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      // ── Blue branch (top) ───────────────────────────────────────────────────
      { id: 'gl-b1', x: 205, y: 68,  r: 26, couleur: '#3aaecf', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-b2', x: 290, y: 50,  r: 26, couleur: '#3aaecf', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-b3', x: 375, y: 68,  r: 26, couleur: '#3aaecf', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      // ── Yellow branch (left) ────────────────────────────────────────────────
      { id: 'gl-y1', x: 68,  y: 205, r: 26, couleur: '#d4a820', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-y2', x: 50,  y: 290, r: 26, couleur: '#d4a820', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-y3', x: 68,  y: 375, r: 26, couleur: '#d4a820', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      // ── Green branch (right) ────────────────────────────────────────────────
      { id: 'gl-g1', x: 512, y: 205, r: 26, couleur: '#4db84d', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-g2', x: 530, y: 290, r: 26, couleur: '#4db84d', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-g3', x: 512, y: 375, r: 26, couleur: '#4db84d', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      // ── Violet branch (bottom) ──────────────────────────────────────────────
      { id: 'gl-p1', x: 205, y: 512, r: 26, couleur: '#b85dd4', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-p2', x: 290, y: 530, r: 26, couleur: '#b85dd4', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'gl-p3', x: 375, y: 512, r: 26, couleur: '#b85dd4', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
    ],
    connections: [
      ['gl-c', 'gl-qol'], ['gl-c', 'gl-rec'], ['gl-c', 'gl-mini'], ['gl-c', 'gl-explo'],
      ['gl-qol',   'gl-b1'], ['gl-qol',   'gl-b2'], ['gl-qol',   'gl-b3'],
      ['gl-rec',   'gl-y1'], ['gl-rec',   'gl-y2'], ['gl-rec',   'gl-y3'],
      ['gl-mini',  'gl-g1'], ['gl-mini',  'gl-g2'], ['gl-mini',  'gl-g3'],
      ['gl-explo', 'gl-p1'], ['gl-explo', 'gl-p2'], ['gl-explo', 'gl-p3'],
    ]
  },

  'explorator': {
    spheres: [
      // ── Center ──────────────────────────────────────────────────────────────
      { id: 'ex-c',     x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'EXPLO HALVES',
        desc: 'Explorers halve the duration of all scouting, zone, and campaign missions they join.',
        etat: 'learned' },
      // ── Mid nodes ───────────────────────────────────────────────────────────
      { id: 'ex-qol',   x: 290, y: 155, r: 30, couleur: '#3aaecf',
        nom: 'QOL EXP',
        desc: 'Unlocks "Auto Assign" function. Will automatically select the units to send on missions. Units need to be available, and will try to match the difficulty of the mission. Always includes an explorator if available (or Bernardo if he has the Exploration perk).',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-food',  x: 155, y: 290, r: 30, couleur: '#d4a820',
        nom: 'CAT FOOD',
        desc: 'Doubles the chance to get Canned Cat Food as reward of scouting missions.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-luck',  x: 425, y: 290, r: 30, couleur: '#4db84d',
        nom: 'CHANCE DOUBLE',
        desc: '25% chance to double the reward received in scouting missions only.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-power', x: 290, y: 425, r: 30, couleur: '#b85dd4',
        nom: 'EXPLO POWER',
        desc: 'Increases Exploration Power by 50%.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      // ── Blue branch (top) ───────────────────────────────────────────────────
      { id: 'ex-b1', x: 205, y: 68,  r: 26, couleur: '#3aaecf', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-b2', x: 290, y: 50,  r: 26, couleur: '#3aaecf', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-b3', x: 375, y: 68,  r: 26, couleur: '#3aaecf', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      // ── Yellow branch (left) ────────────────────────────────────────────────
      { id: 'ex-y1', x: 68,  y: 205, r: 26, couleur: '#d4a820', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-y2', x: 50,  y: 290, r: 26, couleur: '#d4a820', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-y3', x: 68,  y: 375, r: 26, couleur: '#d4a820', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      // ── Green branch (right) ────────────────────────────────────────────────
      { id: 'ex-g1', x: 512, y: 205, r: 26, couleur: '#4db84d', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-g2', x: 530, y: 290, r: 26, couleur: '#4db84d', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-g3', x: 512, y: 375, r: 26, couleur: '#4db84d', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      // ── Violet branch (bottom) ──────────────────────────────────────────────
      { id: 'ex-p1', x: 205, y: 512, r: 26, couleur: '#b85dd4', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-p2', x: 290, y: 530, r: 26, couleur: '#b85dd4', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
      { id: 'ex-p3', x: 375, y: 512, r: 26, couleur: '#b85dd4', nom: 'WIP', desc: 'Coming soon.', etat: 'locked' },
    ],
    connections: [
      ['ex-c', 'ex-qol'], ['ex-c', 'ex-food'], ['ex-c', 'ex-luck'], ['ex-c', 'ex-power'],
      ['ex-qol',   'ex-b1'], ['ex-qol',   'ex-b2'], ['ex-qol',   'ex-b3'],
      ['ex-food',  'ex-y1'], ['ex-food',  'ex-y2'], ['ex-food',  'ex-y3'],
      ['ex-luck',  'ex-g1'], ['ex-luck',  'ex-g2'], ['ex-luck',  'ex-g3'],
      ['ex-power', 'ex-p1'], ['ex-power', 'ex-p2'], ['ex-power', 'ex-p3'],
    ]
  },

  'lumberjack': simpleResourceSphereGrid('lj', 'Wood'),
  'farmer': simpleResourceSphereGrid('farmer', 'Food'),
  'miner': simpleResourceSphereGrid('miner', 'Rock'),
  'carpenter': complexResourceSphereGrid('carpenter', 'planks', 'wood'),
  'chef': complexResourceSphereGrid('chef', 'prepared food', 'food'),
  'stonemason': complexResourceSphereGrid('stonemason', 'bricks', 'rocks'),
  'builder': builderSphereGrid()
};

const DESC_NEIGHBOR    = "Looks like our humans but nextdoor. They probably throw useful items as well.";
const DESC_GARDEN      = "Untamed grass, nobody tending it. Smells like mice have been through.";
const DESC_PARKING     = "A wide open area full of parked cars. Lots of shadows. Quiet at night.";

const ZONES_CARTE = {
  "D1": { id: "D1", nom: "Home",                    col: 3, row: 1, type: "home",     icone: "🏠", difficulte: 0,  duree: 0,   slots: 0, description: "" },
  "C1": { id: "C1", nom: "Left neighbor",            col: 2, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 600,  slots: 2, description: DESC_NEIGHBOR },
  "E1": { id: "E1", nom: "Right neighbor",           col: 4, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 600,  slots: 2, description: DESC_NEIGHBOR },
  "B1": { id: "B1", nom: "Empty Garden",             col: 1, row: 1, type: "other",    icone: "🌿", difficulte: 20, duree: 1200, slots: 2, description: DESC_GARDEN },
  "A1": { id: "A1", nom: "House under construction", col: 0, row: 1, type: "chantier", icone: "🏗️", difficulte: 30, duree: 1500, slots: 2, description: "Humans are building something here. Lots of wood and scrap material piling up. Empty at night." },
  "F1": { id: "F1", nom: "Empty Garden",             col: 5, row: 1, type: "other",    icone: "🌿", difficulte: 20, duree: 1200, slots: 2, description: DESC_GARDEN },
  "G1": { id: "G1", nom: "Squatted House",           col: 6, row: 1, type: "neighbor", icone: "🏚️", difficulte: 30, duree: 1500, slots: 2, description: "Something feels off about this place. No usual human signs. Saw a light through the boards at night once." },
  // Row 2 — full-width street
  "residentialStreet": { id: "residentialStreet", nom: "Residential Bloc Street", col: 0, row: 2, colSpan: 7, rowSpan: 1, type: "street", icone: "🛣️", difficulte: 30, duree: 1800, slots: 2, description: "The street in front of the houses. Bins come out on Thursdays. Dogs in the morning — Be careful." },
  "commercialStreet":  { id: "commercialStreet",  nom: "Commercial Street",       col: 3, row: 3, colSpan: 1, rowSpan: 2, type: "street", icone: "🛣️", difficulte: 40, duree: 2400, slots: 2, description: "A busy road. Cars and trucks, engines idling. Smells like petrol. I don't like it." },
  // Row 3-4 multi-cell zones
  "gasStation":    { id: "gasStation",    nom: "Gas Station",     col: 0, row: 3, colSpan: 2, rowSpan: 2, type: "shop",   icone: "⛽", difficulte: 50, duree: 3000, slots: 2, description: "That brightly lit corner that never closes. Cars are stopping in front and leaving a few minutes after. Weird place." },
  "parkingLeft":   { id: "parkingLeft",   nom: "Parking",         col: 2, row: 3, colSpan: 1, rowSpan: 2, type: "other",  icone: "🅿️", difficulte: 40, duree: 2400, slots: 2, description: DESC_PARKING },
  "parkingRight":  { id: "parkingRight",  nom: "Parking",         col: 4, row: 3, colSpan: 1, rowSpan: 2, type: "other",  icone: "🅿️", difficulte: 40, duree: 2400, slots: 2, description: DESC_PARKING },
  "supermarket":   { id: "supermarket",   nom: "Supermarket",     col: 5, row: 3, colSpan: 2, rowSpan: 2, type: "shop",   icone: "🛒", difficulte: 50, duree: 3000, slots: 2, description: "The glass building where humans carry out lots of plastic bags. Smells great with loads of unidentified smells. I need to get in there." },
  // Row 5 — full-width Forest Entrance
  "forestEntrance": { id: "forestEntrance", nom: "Forest Entrance", col: 0, row: 5, colSpan: 7, rowSpan: 1, type: "forest", icone: "🌲", difficulte: 60, duree: 3600, slots: 2, description: "Where the street ends and the trees begin. Nature seems to have resisted human greediness. At least for now..." },
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

const TIERS_KITTIES = [
  "Kitten", "Great Kitten", "Cat", "Great Cat",
  "General Cat", "Emperor Cat", "Godly Cat"
];

const NOMS_KITTIES = [
  "Bernardo", "Mochi", "Luna", "Whiskers", "Felix",
  "Cleopatra", "Biscuit", "Cosmo", "Zelda", "Napoleon",
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

const KITTY_ICON = '<img src="img/interface/Gang_Final.png?v=0.0025" class="kitty-icon" alt="cat">';
const CHECK_ICON = '<img src="img/interface/✅_Final.png?v=0.0025" class="check-icon" alt="done">';

// ── Per-kitty face icons ────────────────────────────────────
const CAT_FACES = {
  bernardo: "img/Cat faces/Bernardo.png?v=0.0025",
  mochi:    "img/Cat faces/Mochi_Final.png?v=0.0025",
  luna:     "img/Cat faces/Luna_Final.png?v=0.0025",
  alt1:     "img/Cat faces/Alternative Kitty face 1_Final.png?v=0.0025",
  alt2:     "img/Cat faces/Alternative Kitty face 2_Final.png?v=0.0025"
};
const CAT_FACES_ALEATOIRES = [CAT_FACES.mochi, CAT_FACES.luna, CAT_FACES.alt1, CAT_FACES.alt2];

  CatInc.data.content = Object.freeze({
    LIVRE_ICONE: LIVRE_ICONE,
    RESOURCE_INFO: RESOURCE_INFO,
    ITEMS: ITEMS,
    METIERS: METIERS,
    SPHERE_GRIDS: SPHERE_GRIDS,
    ZONES_CARTE: ZONES_CARTE,
    REGIONS: REGIONS,
    TIERS_KITTIES: TIERS_KITTIES,
    NOMS_KITTIES: NOMS_KITTIES,
    KITTY_ICON: KITTY_ICON,
    CHECK_ICON: CHECK_ICON,
    CAT_FACES: CAT_FACES,
    CAT_FACES_ALEATOIRES: CAT_FACES_ALEATOIRES
  });
})(typeof window !== "undefined" ? window : globalThis);
