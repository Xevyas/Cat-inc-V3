(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const release0034Categories = Object.freeze([
      Object.freeze({
        label: "New Features",
        changes: Object.freeze([
          "The top resource bar can now be customized with persistent resource favorites and a T2+ preset.",
          "Mobile Exploration now opens selected zones in a dedicated Campaigns or Scoutings workspace after a compact map preview."
        ])
      }),
      Object.freeze({
        label: "Balancing",
        changes: Object.freeze([
          "Explorator reward perks now reach 40% Double chance and a conditional 30% Triple chance.",
          "Wood Builder BOX BOOST now adds 5% per Cardboard Box instead of compounding multiplicatively.",
          "Gang Leader Daily Boost perks now cost 3 and 5 Canned Cat Food, while the first Supermarket campaign grants 2.",
          "Bernardo's Manual Focus power upgrades now cost 2 and 4 Canned Cat Food, with 60 seconds of capacity and 2 seconds per click."
        ])
      }),
      Object.freeze({
        label: "Quality of Life",
        changes: Object.freeze([
          "The top resource rail now uses larger desktop icons, a compact two-row mobile layout and fixed Cat, Bird and management controls.",
          "Manual Focus remains active across tabs and updates Gathering, Processing, full-cycle timing and production projections while active.",
          "Manual Focus text, active outlines and animations are clearer and smoother.",
          "House, Facilities and Inventory explanations now open from compact contextual help buttons.",
          "Daily scouting Canned Cat Food stocks now reset at Paris midnight independently from Daily Quests.",
          "Recruiting details hide Wood and Stone House bonuses until the corresponding House family is unlocked.",
          "JOBLESS remains hidden in Gang until the Job Center is built.",
          "Cat portraits are now centered safely inside circular badges throughout the game.",
          "Long presses no longer select or open game icons on mobile.",
          "Release dates are now displayed in the launch notes and Settings changelog."
        ])
      }),
      Object.freeze({
        label: "Bug Fixes",
        changes: Object.freeze([
          "A Cat can no longer be assigned to more than one action, and conflicting legacy assignments are repaired when a save loads.",
          "Daily Quests now unlock only after The Daily Purpose is fully learned, and recipe objectives display their required family.",
          "The Explorations unlock notification now appears at 8 Cats instead of 6.",
          "The Houses unlock notification no longer repeats whenever Plank stock returns from 0 to 1.",
          "The Exploration fog animation no longer jumps after changing tabs or selecting a zone.",
          "Bird, Catch, Recruit and Book mini-games now share a mobile-safe foreground runtime that prevents duplicate animation loops and reduces severe iOS frame drops."
        ])
      }),
      Object.freeze({
        label: "Other",
        changes: Object.freeze([
          "Story dialogue now gives Bernardo, Mochi and Luna clearer personalities and more natural conversations.",
          "Undiscovered mobile zones no longer reveal their internal identifier before exploration.",
          "The Laboratory now uses its dedicated building artwork in Facilities."
        ])
      })
  ]);

  const release0036Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Mobile Exploration now lets players open a scouting reward summary directly from the map and claim all accumulated loot for the selected zone."
      ])
    }),
    Object.freeze({
      label: "Balancing",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Work All now uses the compact Tier and resource-icon view, leaving room for each worker's name and level.",
        "Mobile Work manager cards now place Gathering and Processing side by side, with the remove control at the top right.",
        "Gang activity labels now show only the mission type and map zone, such as Scouting: D1.",
        "Job information popups open above their mobile action when space allows, keeping the training button accessible.",
        "The AFK return flow refreshes the page once after the summary is prepared, so players receive the latest published version automatically.",
        "Tab changes and live recipe progress now use lighter, coalesced updates on mobile while mini-games keep their foreground animation lifecycle."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "The mobile map no longer shows faint grid lines caused by fractional artwork and fog-mask edges.",
        "Map scouting indicators now display the total number of loot units available, using 99+ for larger pools."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([])
    })
  ]);

  const release0037Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Balancing",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Returning from an AFK period now checks the published version without cache and reloads only when an update is actually available."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Map selection outlines, locks and unknown-zone markers are visible again above the fog layer."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([])
    })
  ]);

  const release0035Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Mobile Exploration now returns to the map when the Explorations tab or the zone Explore action is opened again.",
        "Exploration headers now expose their description through the same contextual help button used by other game panels.",
        "Mobile panels now share consistent horizontal margins, full available width and spacing below navigation rails.",
        "Facilities gains mobile Jobs, Train and Lab subtabs as each specialized building becomes available.",
        "The Training Center now opens directly in Facilities, with a compact mobile Cat picker replacing the long inline roster.",
        "Multi-resource building costs now wrap as complete resource groups on narrow mobile screens.",
        "The AFK summary now uses the game's interface and resource artwork instead of emojis."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "The Tutorial completion acknowledgement now appears even when Daily Purpose has not been learned yet.",
        "The Houses tab no longer creates a horizontal scrollbar on narrow mobile screens.",
        "Exploration assignment cards now stay aligned when the first slot carries the required Explorator label."
      ])
    })
  ]);

  // Local changes made after the latest published release live here.
  // On publication, promote this entry to `releases`, assign its version/date,
  // then replace these categories with a fresh empty pending release.
  const pendingRelease = Object.freeze({
    baseVersion: "0.0037",
    categories: Object.freeze([
      Object.freeze({ label: "New Features", changes: Object.freeze([]) }),
      Object.freeze({ label: "Balancing", changes: Object.freeze([]) }),
      Object.freeze({ label: "Quality of Life", changes: Object.freeze([]) }),
      Object.freeze({ label: "Bug Fixes", changes: Object.freeze([]) }),
      Object.freeze({ label: "Other", changes: Object.freeze([]) })
    ])
  });

  // Keep the newest release first. The game uses the first entry for the
  // one-time launch panel and renders the complete array in Settings.
  const releases = [
    Object.freeze({
      version: "0.0037",
      date: "2026-07-28",
      categories: release0037Categories
    }),
    Object.freeze({
      version: "0.0036",
      date: "2026-07-27",
      categories: release0036Categories
    }),
    Object.freeze({
      version: "0.0035",
      date: "2026-07-26",
      categories: release0035Categories
    }),
    Object.freeze({
      version: "0.0034",
      date: "2026-07-26",
      categories: release0034Categories
    }),
    Object.freeze({
      version: "0.0033",
      // ISO format keeps the release history sortable and easy to localize.
      date: "2026-07-25",
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
    releases: Object.freeze(releases),
    pendingRelease: pendingRelease
  });
})(typeof window !== "undefined" ? window : globalThis);
