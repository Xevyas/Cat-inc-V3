(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  // Keep the newest release first. The game uses the first entry for the
  // one-time launch panel and renders the complete array in Settings.
  const releases = [
    Object.freeze({
      version: "0.0033",
      categories: Object.freeze([
        Object.freeze({
          label: "New Features",
          changes: Object.freeze([
            "In-game release notes now appear once after each update, and the complete version history is available from Settings.",
            "Manual Focus unlocks at 4 Cats. Clicks store 0.8 seconds of ×2 production speed, up to 30 seconds, and the reserve follows both phases of the selected recipe.",
            "Camp Engineers now support multiple ranks. Rank 1 extends the AFK cap, while Rank 2 improves the AFK ratio.",
            "New garden and parking campaigns provide Human Leftovers, Rock Bricks and Basic Wood Planks.",
            "A new A1 upper-floor campaign rewards Sturdy House Plans and unlocks the Solid Stone Cathouse.",
            "Bernardo's Gang Leader sphere now includes Daily Quest upgrades, global recruitment speed, Manual Focus improvements and Exploration perks.",
            "The Wood Builder sphere now includes Perfect Auto Builds, scalable cost reductions and specialized Cardboard Box and Wood Cathouse bonuses.",
            "The Explorator sphere now includes Canned Cat Food stock preservation, conditional Triple rewards and separate Doubled and Tripled scouting counters.",
            "Gathering and Processing managers now have two-level production, speed and cost branches, plus additional recipe-slot perks."
          ])
        }),
        Object.freeze({
          label: "Balancing",
          changes: Object.freeze([
            "The recruitment timer now uses ×3 growth through the first 10 steps, ×2 through step 15, then ×1.5 afterward.",
            "Pebbles now unlock at 6 Cats and Explorations at 8 Cats.",
            "Exploration missions now require an Explorator in their first slot. Bernardo can replace one after learning EXPLORATOR.",
            "All Cats now have a maximum level of 100.",
            "Camp Engineer Rank 2 adds 0.5 percentage point to the AFK ratio per Cat level.",
            "Engineer training durations now follow the 2h, 4h, 8h, 12h, 16h, 20h and 24h progression.",
            "Gathering and Processing manager perks now grant 25% per level. Their NEW SLOT perks cost 3 Canned Cat Food.",
            "The first Basic Stone Cathouse now costs 5 Basic Wood Planks and 5 Pebble Bricks.",
            "Bird pity now reduces cursor speed by 5% per failure, up to 35%. Bernardo no longer modifies Bird difficulty."
          ])
        }),
        Object.freeze({
          label: "Quality of Life",
          changes: Object.freeze([
            "Cat levels remain hidden in Gang until Catnip Salad is unlocked.",
            "Work recipes now display their complete Gathering and Processing cycle time and preserve visible Processing progress when a Cat is removed.",
            "Building costs and resource displays now use clearer Tier badges.",
            "Auto-feed selects a more efficient food combination and warns before unavoidable overfeeding.",
            "Bernardo is now visibly assigned while studying a book and cannot perform another action simultaneously.",
            "Job Center and Laboratory training now require explicit validation, show completion notifications and use the trainee's portrait in their progress bars.",
            "A one-time explanation now teaches how manager slots work after the first manager is trained.",
            "Fast simulation no longer makes interactive controls difficult to click or hold.",
            "Sphere connectors remain behind perk nodes, and learning a perk no longer visually resets the central job perk.",
            "Exploration reveals and claimed Exploration rewards now have dedicated sound effects.",
            "Completing the Tutorial now displays a short acknowledgement message."
          ])
        }),
        Object.freeze({
          label: "Other",
          changes: Object.freeze([
            "The D1 house description now correctly states that a human is still home before the evacuation event.",
            "Undiscovered zone names remain hidden in notifications and Gang activity labels.",
            "Exploration fog and Training Center backgrounds now use seamless layered cloud animations.",
            "Rock Bricks obtained before unlocking their recipe now display correctly and remain visible in Inventory.",
            "Two additional Cat portraits have been added to random recruitments.",
            "Grilled Anchovy now correctly states that it grants 10 XP."
          ])
        })
      ])
    })
  ];

  CatInc.data.changelog = Object.freeze({
    currentVersion: releases[0].version,
    releases: Object.freeze(releases)
  });
})(typeof window !== "undefined" ? window : globalThis);
