(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

const LIVRE_ICONE = '<img class="livre-icone" src="img/resources/Books_Final.png?v=0.0026" alt="Book">';

// ── Resource info popups (Inventory tab) ─────────────────────
// Keep this in sync whenever a resource is added or changed.
const RESOURCE_INFO = {
  "inv-res-cardboard": {
    nom:     "Cardboard Pieces",
    tier:    "Tier 1 · Wood family",
    desc:    "Small patches of cardboard found lying on the ground. Might be useful.",
    produce: "Gathered by a Cat assigned to a Cardboard Planks recipe.",
    usage:   "Used inside that recipe slot (10 pieces per plank). It is never stored globally."
  },
  "inv-res-cardboard-plank": {
    nom:     "Cardboard Planks",
    tier:    "Tier 1 · Wood family (processed)",
    desc:    "Sturdy planks pressed from cardboard. The backbone of early construction.",
    produce: "Assign a Cat to a Cardboard Planks recipe in Work. The slot gathers 10 Cardboard Pieces first.",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-basic-wood": {
    nom:     "Basic Wood",
    tier:    "Tier 2 · Wood family",
    desc:    "Rough wooden planks salvaged from human furniture. Heavier to carry, but sturdier.",
    produce: "Gathered by a Cat assigned to a Basic Wood Planks recipe.",
    usage:   "Used inside that recipe slot (10 logs per plank). It is never stored globally."
  },
  "inv-res-wood-plank": {
    nom:     "Basic Wood Planks",
    tier:    "Tier 2 · Wood family (processed)",
    desc:    "Refined wooden planks, sanded and shaped. A real upgrade from cardboard.",
    produce: "Assign a Cat to a Basic Wood Planks recipe in Work. The slot gathers 10 Basic Wood first.",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-catnip": {
    nom:     "Catnip",
    tier:    "Tier 1 · Food family",
    desc:    "Fresh catnip from the garden. Nutritious, if you're a cat.",
    produce: "Gathered by a Cat assigned to a Catnip Salad recipe.",
    usage:   "Used as the input for that recipe (10 Catnip per salad). It is never stored globally."
  },
  "inv-res-salads": {
    nom:     "Catnip Salad",
    tier:    "Tier 1 · Food family (processed)",
    desc:    "A balanced catnip salad. Even Bernardo eats his greens.",
    produce: "Assign a Cat to a Catnip Salad recipe in Work. The slot gathers 10 Catnip first.",
    usage:   "Feed to a Cat in the Gang tab to give them +1 XP."
  },
  "inv-res-anchovy": {
    nom:     "Anchovy",
    tier:    "Tier 2 · Food family",
    desc:    "Fresh anchovies fished from the nearby stream. A cat's favourite.",
    produce: "Gathered by a Cat assigned to a Grilled Anchovy recipe.",
    usage:   "Used as the input for that recipe (10 Anchovies per serving). It is never stored globally."
  },
  "inv-res-grilled-anchovy": {
    nom:     "Grilled Anchovy",
    tier:    "Tier 2 · Food family (processed)",
    desc:    "Golden, crispy, perfectly grilled. Worth every second of cooking.",
    produce: "Assign a Cat to a Grilled Anchovy recipe in Work. The slot gathers 10 Anchovies first.",
    usage:   "Feed to a Cat in the Gang tab to give them +10 XP."
  },
  "inv-res-pebbles": {
    nom:     "Pebbles",
    tier:    "Tier 1 · Rock family",
    desc:    "Small smooth pebbles gathered from the yard. Heavy pockets, light heart.",
    produce: "Gathered by a Cat assigned to a Pebble Bricks recipe.",
    usage:   "Used inside that recipe slot (10 pebbles per brick). It is never stored globally."
  },
  "inv-res-pebble-brick": {
    nom:     "Pebble Bricks",
    tier:    "Tier 1 · Rock family (processed)",
    desc:    "Compact bricks made from compressed pebbles. Surprisingly solid.",
    produce: "Assign a Cat to a Pebble Bricks recipe in Work. The slot gathers 10 Pebbles first.",
    usage:   "Used to construct buildings like Facilities."
  },
  "inv-res-rocks": {
    nom:     "Rocks",
    tier:    "Tier 2 · Rock family",
    desc:    "Dense stones hauled from deeper in the yard. Much heavier than pebbles.",
    produce: "Gathered by a Cat assigned to a Rock Bricks recipe.",
    usage:   "Used inside that recipe slot (10 rocks per brick). It is never stored globally."
  },
  "inv-res-rock-brick": {
    nom:     "Rock Bricks",
    tier:    "Tier 2 · Rock family (processed)",
    desc:    "Solid bricks forged from dense rock. Built to last.",
    produce: "Assign a Cat to a Rock Bricks recipe in Work. The slot gathers 10 Rocks first.",
    usage:   "Used in advanced construction."
  },
  "inv-res-human-leftovers": {
    nom:     "Human Leftovers",
    tier:    null,
    desc:    "Bits and pieces left behind by humans. One human's trash is another cat's treasure.",
    produce: "Found by sending cats on Exploration campaigns.",
    usage:   "Feed to a Cat in the Gang tab to give them +1 XP."
  },
  "inv-res-human-workers-food": {
    nom:     "Workers Food",
    tier:    null,
    desc:    "Packed lunches left behind by the construction workers. Still good.",
    produce: "Found by scouting the basement in A1 (unlocks after both A1 campaigns).",
    usage:   "Feed to a Cat in the Gang tab to give them +15 XP."
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
    emoji:        '<img class="inv-item-sprite" src="img/resources/Compass_Final.png?v=0.0040" alt="Compass">',
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
  dailyPurpose: {
    id:           "dailyPurpose",
    nom:          "The Daily Purpose",
    emoji:        LIVRE_ICONE,
    description:  "A human self-help book about building a daily routine and becoming the best version of yourself. The kind of advice that sounds profound before breakfast.",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "Rise with ",
        ", honor your ",
        ", and unlock the ",
        " ",
        " of ",
        ", one tiny ",
        " at a time!"
      ],
      answers: ["purpose", "routine", "best", "version", "yourself", "step"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  engineerGuide: {
    id:           "engineerGuide",
    nom:          "The Engineer's Path",
    emoji:        LIVRE_ICONE,
    description:  "A human engineering guide pointing toward a new generation of recipes and specialists.",
    unlocksLabel: "Laboratory",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "An engineer turns a ",
        " into a ",
        ", tests the ",
        ", learns from each ",
        ", and improves the final ",
        " for ",
        "."
      ],
      answers: ["problem", "design", "prototype", "failure", "solution", "everyone"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  teamworkGuide: {
    id:           "teamworkGuide",
    nom:          "The Teamwork Advantage",
    emoji:        LIVRE_ICONE,
    description:  "A human teamwork guide about combining different minds to uncover perspectives and solutions no one could find alone.",
    unlocksLabel: "Engineer rank upgrades",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "Bring different ",
        " together around one ",
        ", and their varied ",
        " can reveal ",
        " solutions that no single ",
        " could ",
        " alone."
      ],
      answers: ["minds", "challenge", "perspectives", "unexpected", "person", "find"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  sturdyHousePlans: {
    id:           "sturdyHousePlans",
    nom:          "Sturdy House Plans",
    emoji:        LIVRE_ICONE,
    description:  "Detailed human blueprints for a compact stone house, with strict instructions on foundations, load-bearing walls, and structural stability. Excessively serious, but apparently very good at keeping a roof where it belongs.",
    unlocksLabel: "Solid Stone Cathouse",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "A durable stone house depends on firm ",
        ", carefully fitted ",
        ", reinforced ",
        ", evenly distributed ",
        ", reliable ",
        ", and a properly supported ",
        "."
      ],
      answers: ["foundations", "blocks", "walls", "loads", "drainage", "roof"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
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
  "gang-leader": { id: "gang-leader", nom: "Gang Leader",  emoji: "👑", famille: null,          familleNom: "Work speed",                 duree: 0 },
  "camp-engineer": { id: "camp-engineer", nom: "Camp Engineer", emoji: "🔧", famille: "engineering", familleNom: "Passive camp systems", duree: 3600, engineer: true }
};

// ── Sphere grids (one per job, UX-only for now) ─────────────────────────────
function simpleResourceSphereGrid(prefix, resourceLabel) {
  const recipeFamilyLabel = resourceLabel === 'Rock' ? 'Rocks' : resourceLabel;
  return {
    spheres: [
      { id: prefix + '-prod-2', x: 90, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'PROD BOOST II',
        desc: 'Increases production of "' + resourceLabel + '" resources by an additional 25% (total 50%). This adds to the worker\'s level bonus.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: prefix + '-prod', x: 195, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'PROD BOOST I',
        desc: 'Increases production of "' + resourceLabel + '" resources by 25%. This adds to the worker\'s level bonus.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: prefix + '-c', x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'PROD SPEED',
        desc: 'The manager increases the production speed of the "' + resourceLabel + '" family. The base manager bonus is already active when the job is learned.',
        etat: 'learned' },
      { id: prefix + '-speed', x: 385, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST I',
        desc: 'Increases the speed boost granted to "' + resourceLabel + '" resources by 25%. This adds to the manager\'s level bonus.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: prefix + '-speed-2', x: 490, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST II',
        desc: 'Increases the speed boost granted to "' + resourceLabel + '" resources by an additional 25% (total 50%). This adds to the manager\'s level bonus.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: prefix + '-slot', x: 290, y: 460, r: 36, couleur: '#3aaecf',
        nom: 'NEW SLOT',
        desc: 'Adds one recipe slot to the ' + recipeFamilyLabel + ' family.',
        etat: 'unlocked', cout: { cannedCatFood: 3 } },
    ],
    connections: [
      [prefix + '-prod', prefix + '-prod-2'],
      [prefix + '-prod', prefix + '-c'],
      [prefix + '-c', prefix + '-speed'],
      [prefix + '-speed', prefix + '-speed-2'],
      [prefix + '-c', prefix + '-slot'],
    ]
  };
}

function complexResourceSphereGrid(prefix, resourceLabel, rawLabel) {
  return {
    spheres: [
      { id: prefix + '-cost', x: 195, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'REDUCED COST I',
        desc: 'Changes the Gathering target for the matching Processing recipe from 10 gather resources to 8.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: prefix + '-cost-2', x: 90, y: 290, r: 36, couleur: '#ffbf00',
        nom: 'REDUCED COST II',
        desc: 'Changes the Gathering target for the matching Processing recipe from 10 gather resources to 6.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: prefix + '-c', x: 290, y: 290, r: 36, couleur: '#1e5f70',
        nom: 'PROD SPEED',
        desc: 'The manager increases the production speed of the ' + resourceLabel + ' family. The base manager bonus is already active when the job is learned.',
        etat: 'learned' },
      { id: prefix + '-speed', x: 385, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST I',
        desc: 'Increases the speed boost granted to the resources by 25%.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: prefix + '-speed-2', x: 490, y: 290, r: 36, couleur: '#85d46e',
        nom: 'SPEED BOOST II',
        desc: 'Increases the speed boost granted to the resources by an additional 25% (total 50%).',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: prefix + '-slot', x: 290, y: 460, r: 36, couleur: '#3aaecf',
        nom: 'NEW SLOT',
        desc: 'Adds one recipe slot to the ' + rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1) + ' family.',
        etat: 'unlocked', cout: { cannedCatFood: 3 } },
    ],
    connections: [
      [prefix + '-cost', prefix + '-c'],
      [prefix + '-cost', prefix + '-cost-2'],
      [prefix + '-c', prefix + '-speed'],
      [prefix + '-speed', prefix + '-speed-2'],
      [prefix + '-c', prefix + '-slot'],
    ]
  };
}

function builderSphereGrid() {
  return {
    spheres: [
      { id: 'builder-c', x: 290, y: 300, r: 36, couleur: '#1e5f70',
        nom: 'PROD SPEED',
        desc: 'Wood Houses grant their base recruit-speed bonus. The builder manager bonus is already active when the job is learned.',
        etat: 'learned' },
      // Blue branch: automatic construction
      { id: 'builder-auto', x: 290, y: 190, r: 30, couleur: '#3aaecf',
        nom: 'AUTO BUILD',
        desc: 'Automatically builds Wood Houses when the next house costs less than 50% of the available Planks. Adds an On/Off toggle in the Houses tab.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'builder-perfect-1', x: 290, y: 110, r: 28, couleur: '#3aaecf',
        nom: 'PERFECT BUILD I',
        desc: 'Auto Build no longer consumes materials when it builds Cardboard Boxes.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'builder-perfect-2', x: 290, y: 35, r: 28, couleur: '#3aaecf',
        nom: 'PERFECT BUILD II',
        desc: 'Auto Build no longer consumes materials when it builds Wood Cathouses.',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      // Yellow branch: cost scaling and synergies
      { id: 'builder-cost', x: 200, y: 300, r: 30, couleur: '#ffbf00',
        nom: 'EXPO REDUCED I',
        desc: 'Changes the Wood Houses cost exponent from 1.7 to 1.6.',
        etat: 'unlocked', cout: { cannedCatFood: 2 } },
      { id: 'builder-expo-2', x: 115, y: 300, r: 28, couleur: '#ffbf00',
        nom: 'EXPO REDUCED II',
        desc: 'Changes the Wood Houses cost exponent from 1.6 to 1.55.',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      { id: 'builder-expo-3', x: 35, y: 300, r: 28, couleur: '#ffbf00',
        nom: 'EXPO REDUCED III',
        desc: 'Changes the Wood Houses cost exponent from 1.55 to 1.5.',
        etat: 'locked', cout: { cannedCatFood: 4 } },
      { id: 'builder-cost-half-1', x: 150, y: 205, r: 28, couleur: '#ffbf00',
        nom: 'COST REDUCED I',
        desc: 'Halves the cost of Wood Houses, rounded up.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'builder-cost-half-2', x: 90, y: 125, r: 28, couleur: '#ffbf00',
        nom: 'COST REDUCED II',
        desc: 'Halves the cost of Wood Houses again, rounded up.',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      { id: 'builder-box-boost', x: 155, y: 405, r: 28, couleur: '#ffbf00',
        nom: 'BOX BOOST',
        desc: 'Each Cardboard Box multiplies the recruiting-speed effect of Wood Cathouses by 1.05.',
        etat: 'locked', cout: { cannedCatFood: 5 } },
      // Green branch: recruiting-speed output
      { id: 'builder-speed', x: 380, y: 300, r: 30, couleur: '#85d46e',
        nom: 'GLOBAL SPEED I',
        desc: 'Increases the speed boost granted by Wood Houses by 25%.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'builder-speed-2', x: 465, y: 300, r: 28, couleur: '#85d46e',
        nom: 'GLOBAL SPEED II',
        desc: 'Increases the speed boost granted by Wood Houses by an additional 25% (50% total).',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'builder-speed-3', x: 545, y: 300, r: 28, couleur: '#85d46e',
        nom: 'GLOBAL SPEED III',
        desc: 'Increases the speed boost granted by Wood Houses by an additional 25% (75% total).',
        etat: 'locked', cout: { cannedCatFood: 4 } },
      { id: 'builder-box-speed', x: 420, y: 405, r: 28, couleur: '#85d46e',
        nom: 'BOX SPEED',
        desc: 'Multiplies the base recruiting speed granted by Cardboard Boxes by 3.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'builder-wood-speed', x: 500, y: 490, r: 28, couleur: '#85d46e',
        nom: 'WOOD SPEED',
        desc: 'Multiplies the base recruiting speed granted by Wood Cathouses by 2.',
        etat: 'locked', cout: { cannedCatFood: 4 } },
    ],
    connections: [
      ['builder-c', 'builder-auto'], ['builder-auto', 'builder-perfect-1'], ['builder-perfect-1', 'builder-perfect-2'],
      ['builder-c', 'builder-cost'], ['builder-cost', 'builder-expo-2'], ['builder-expo-2', 'builder-expo-3'],
      ['builder-cost', 'builder-cost-half-1'], ['builder-cost-half-1', 'builder-cost-half-2'],
      ['builder-cost', 'builder-box-boost'],
      ['builder-c', 'builder-speed'], ['builder-speed', 'builder-speed-2'], ['builder-speed-2', 'builder-speed-3'],
      ['builder-speed', 'builder-box-speed'], ['builder-box-speed', 'builder-wood-speed'],
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
      // Blue branch: Food Management and Daily Quests
      { id: 'gl-qol',   x: 290, y: 185, r: 30, couleur: '#3aaecf',
        nom: 'QOL EXP',
        desc: 'Bernardo can now manage Food for the gang. Unlocks quality-of-life options in Food Management.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'gl-daily-1', x: 290, y: 110, r: 28, couleur: '#3aaecf',
        nom: 'DAILY BOOST I',
        desc: 'Increases the Daily Quests reward from 1 Canned Cat Food to 2.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'gl-daily-2', x: 290, y: 35, r: 28, couleur: '#3aaecf',
        nom: 'DAILY BOOST II',
        desc: 'Increases the Daily Quests reward from 2 Canned Cat Food to 3.',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      // Yellow branch: recruitment
      { id: 'gl-rec',   x: 185, y: 290, r: 30, couleur: '#d4a820',
        nom: 'RECRUIT SPEED I',
        desc: "Applies half of Bernardo's leadership bonus to the global recruitment speed.",
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'gl-rec-2', x: 75, y: 290, r: 30, couleur: '#d4a820',
        nom: 'RECRUIT SPEED II',
        desc: "Applies Bernardo's full leadership bonus to the global recruitment speed.",
        etat: 'locked', cout: { cannedCatFood: 2 } },
      // Green branch: Manual Focus
      { id: 'gl-mini',  x: 400, y: 290, r: 30, couleur: '#85d46e',
        nom: 'MANUAL BOOST',
        desc: 'Increases the Manual Focus production multiplier from ×2 to ×3.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'gl-manual-power', x: 500, y: 205, r: 28, couleur: '#85d46e',
        nom: 'BOOST POWER',
        desc: 'Increases the Manual Focus production multiplier from ×3 to ×4.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'gl-manual-capacity', x: 510, y: 290, r: 28, couleur: '#85d46e',
        nom: 'CAPACITY',
        desc: 'Increases Manual Focus capacity from 30 seconds to 120 seconds.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'gl-manual-click', x: 500, y: 375, r: 28, couleur: '#85d46e',
        nom: 'CLICK POWER',
        desc: 'Increases Manual Focus charge from 0.8 seconds to 3 seconds per click.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      // Violet branch: Exploration
      { id: 'gl-explo', x: 290, y: 395, r: 30, couleur: '#d98bd2',
        nom: 'EXPLORATOR',
        desc: 'Bernardo can act as an Explorator for zone exploration missions.',
        etat: 'unlocked', cout: { cannedCatFood: 2 } },
      { id: 'gl-explo-halves', x: 170, y: 470, r: 28, couleur: '#d98bd2',
        nom: 'EXPLO HALVES',
        desc: 'Bernardo halves zone exploration, campaign and scouting mission times when he participates.',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      { id: 'gl-explo-luck', x: 410, y: 470, r: 28, couleur: '#d98bd2',
        nom: 'CHANCE DOUBLE I',
        desc: 'Gives a 15% chance to double a scouting reward when Bernardo is included.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'gl-explo-power', x: 220, y: 545, r: 28, couleur: '#d98bd2',
        nom: 'EXPLO POWER',
        desc: "Increases Bernardo's Exploration Power by 50%.",
        etat: 'locked', cout: { cannedCatFood: 3 } },
      { id: 'gl-explo-catfood', x: 360, y: 545, r: 28, couleur: '#d98bd2',
        nom: 'CAT FOOD I',
        desc: 'Increases the chance of receiving Canned Cat Food from scouting rewards by 50% when Bernardo is included.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
    ],
    connections: [
      ['gl-c', 'gl-qol'], ['gl-c', 'gl-rec'], ['gl-c', 'gl-mini'], ['gl-c', 'gl-explo'],
      ['gl-qol', 'gl-daily-1'], ['gl-daily-1', 'gl-daily-2'],
      ['gl-rec', 'gl-rec-2'],
      ['gl-mini', 'gl-manual-power'], ['gl-mini', 'gl-manual-capacity'], ['gl-mini', 'gl-manual-click'],
      ['gl-explo', 'gl-explo-halves'], ['gl-explo', 'gl-explo-luck'],
      ['gl-explo', 'gl-explo-power'], ['gl-explo', 'gl-explo-catfood'],
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
      { id: 'ex-qol',   x: 290, y: 145, r: 30, couleur: '#3aaecf',
        nom: 'QOL EXPLO',
        desc: 'Unlocks Auto Assign for Exploration missions.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-food',  x: 195, y: 290, r: 30, couleur: '#d4a820',
        nom: 'CAT FOOD I',
        desc: 'Increases the chance of receiving Canned Cat Food from scouting rewards by 50% if the Explorator is included.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-food-2', x: 85, y: 290, r: 30, couleur: '#d4a820',
        nom: 'CAT FOOD II',
        desc: 'Increases the chance of receiving Canned Cat Food from scouting rewards by an additional 50% (double the base chance) if the Explorator is included.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'ex-food-lucky', x: 145, y: 390, r: 28, couleur: '#d4a820',
        nom: 'LUCKY FOOD I',
        desc: 'Gives a 15% chance not to consume the daily scouting Canned Cat Food stock when Canned Cat Food is found.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'ex-food-lucky-2', x: 65, y: 480, r: 28, couleur: '#d4a820',
        nom: 'LUCKY FOOD II',
        desc: 'Adds another 15% chance not to consume the daily scouting Canned Cat Food stock when Canned Cat Food is found (30% total).',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      { id: 'ex-luck',  x: 395, y: 290, r: 30, couleur: '#4db84d',
        nom: 'CHANCE DOUBLE I',
        desc: 'Gives a 15% chance to double a scouting reward if the Explorator is included.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-luck-2', x: 500, y: 290, r: 30, couleur: '#4db84d',
        nom: 'CHANCE DOUBLE II',
        desc: 'Gives an additional 15% chance to double a scouting reward (30% total) if the Explorator is included.',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      { id: 'ex-triple', x: 435, y: 390, r: 28, couleur: '#4db84d',
        nom: 'CHANCE TRIPLE I',
        desc: 'When CHANCE DOUBLE applies, gives a 10% chance to triple the scouting reward instead.',
        etat: 'locked', cout: { cannedCatFood: 3 } },
      { id: 'ex-triple-2', x: 515, y: 480, r: 28, couleur: '#4db84d',
        nom: 'CHANCE TRIPLE II',
        desc: 'When CHANCE DOUBLE applies, adds another 10% chance to triple the scouting reward instead (20% total).',
        etat: 'locked', cout: { cannedCatFood: 4 } },
      { id: 'ex-power', x: 290, y: 425, r: 30, couleur: '#b85dd4',
        nom: 'EXPLO POWER I',
        desc: 'Increases Exploration Power by 25%.',
        etat: 'unlocked', cout: { cannedCatFood: 1 } },
      { id: 'ex-power-2', x: 290, y: 530, r: 30, couleur: '#b85dd4',
        nom: 'EXPLO POWER II',
        desc: 'Increases Exploration Power by an additional 25% (total 50%).',
        etat: 'locked', cout: { cannedCatFood: 2 } },
      // ── Blue branch (top) ───────────────────────────────────────────────────
      // ── Yellow branch (left) ────────────────────────────────────────────────
      // ── Green branch (right) ────────────────────────────────────────────────
      // ── Violet branch (bottom) ──────────────────────────────────────────────
    ],
    connections: [
      ['ex-c', 'ex-qol'], ['ex-c', 'ex-food'], ['ex-c', 'ex-luck'], ['ex-c', 'ex-power'],
      ['ex-food', 'ex-food-2'],
      ['ex-food', 'ex-food-lucky'], ['ex-food-lucky', 'ex-food-lucky-2'],
      ['ex-luck', 'ex-luck-2'],
      ['ex-luck', 'ex-triple'], ['ex-triple', 'ex-triple-2'],
      ['ex-power', 'ex-power-2'],
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

const KITTY_ICON = '<img src="img/interface/Gang_Final.png?v=0.0026" class="kitty-icon" alt="cat">';
const CHECK_ICON = '<img src="img/interface/✅_Final.png?v=0.0026" class="check-icon" alt="done">';

// ── Per-kitty face icons ────────────────────────────────────
const CAT_FACES = {
  bernardo: "img/Cat faces/Bernardo.png?v=0.0026",
  mochi:    "img/Cat faces/Mochi_Final.png?v=0.0026",
  luna:     "img/Cat faces/Luna_Final.png?v=0.0026",
  alt1:     "img/Cat faces/Alternative Kitty face 1_Final.png?v=0.0026",
  alt2:     "img/Cat faces/Alternative Kitty face 2_Final.png?v=0.0026",
  alt3:     "img/Cat faces/Alternative Kitty face 3_Final.png?v=0.0026",
  alt4:     "img/Cat faces/Alternative Kitty face 4_Final.png?v=0.0026"
};
const CAT_FACES_ALEATOIRES = [CAT_FACES.mochi, CAT_FACES.luna, CAT_FACES.alt1, CAT_FACES.alt2, CAT_FACES.alt3, CAT_FACES.alt4];

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
