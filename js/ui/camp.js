(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const GRID_WIDTH = 18;
  const GRID_HEIGHT = 12;
  const HOUSE_DECOR_HEIGHT = 4;

  const ITEM_TYPES = Object.freeze({
    cardboardBox: Object.freeze({
      id: "cardboardBox",
      label: "Cardboard Box",
      width: 2,
      height: 1,
      color: "cardboard",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Prototypes/Cardboard%20Box_Camp_TopDown_Watercolor_Game_v2.png?v=0.0001"
    }),
    jobCenter: Object.freeze({
      id: "jobCenter",
      label: "Job Center",
      width: 3,
      height: 4,
      color: "job-center",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Prototypes/Job%20Center_Camp_TopDown_Watercolor_Game_v2.png?v=0.0001"
    }),
    sawmill: Object.freeze({
      id: "sawmill",
      label: "Sawmill",
      width: 3,
      height: 2,
      color: "wood",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Prototypes/Sawmill_Camp_TopDown_Watercolor_Game_v2.png?v=0.0001"
    }),
    catchen: Object.freeze({
      id: "catchen",
      label: "Catchen",
      width: 3,
      height: 3,
      color: "food",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Prototypes/Catchen_Camp_TopDown_Watercolor_Game_v3.png?v=0.0001"
    }),
    pawsonry: Object.freeze({
      id: "pawsonry",
      label: "Pawsonry",
      width: 3,
      height: 3,
      color: "stone",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Prototypes/Pawsonry_Camp_TopDown_Watercolor_Game_v3.png?v=0.0001"
    }),
    trainingCenter: Object.freeze({
      id: "trainingCenter",
      label: "Training Center",
      width: 3,
      height: 4,
      color: "training",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Prototypes/Training%20Center_Camp_TopDown_Watercolor_Game_v1.png?v=0.0001"
    }),
    tree: Object.freeze({
      id: "tree",
      label: "Tree",
      width: 2,
      height: 2,
      color: "nature",
      category: "decoration",
      asset: "img/Buildings/Camp%20Prototypes/Tree_Camp_TopDown_Watercolor_Game_v1.png?v=0.0001"
    }),
    catToy: Object.freeze({
      id: "catToy",
      label: "Cat Toy",
      width: 1,
      height: 1,
      color: "toy",
      category: "decoration"
    }),
    road: Object.freeze({
      id: "road",
      label: "Basic Trail",
      width: 1,
      height: 1,
      color: "road",
      category: "road",
      continuous: true,
      asset: "img/Maps/Camp%20Prototypes/Basic%20Trail_Camp_TopDown_Watercolor_Game_v1.png?v=0.0001"
    })
  });
  const LEGACY_TYPE_ALIASES = Object.freeze({
    kitchen: "catchen"
  });
  const INITIAL_BUILDABLE_RECT = Object.freeze({
    x: 6,
    y: HOUSE_DECOR_HEIGHT,
    width: 6,
    height: 3
  });
  const TERRITORY_ZONES = Object.freeze({
    redGarden: Object.freeze({
      id: "redGarden",
      label: "Red house garden",
      x: 0,
      y: HOUSE_DECOR_HEIGHT,
      width: 6,
      height: GRID_HEIGHT - HOUSE_DECOR_HEIGHT
    }),
    home: Object.freeze({
      id: "home",
      label: "Blue house garden",
      x: 6,
      y: HOUSE_DECOR_HEIGHT,
      width: 6,
      height: GRID_HEIGHT - HOUSE_DECOR_HEIGHT,
      initial: true
    }),
    greenGarden: Object.freeze({
      id: "greenGarden",
      label: "Green house garden",
      x: 12,
      y: HOUSE_DECOR_HEIGHT,
      width: 6,
      height: GRID_HEIGHT - HOUSE_DECOR_HEIGHT
    })
  });
  const TERRAIN_CELL_COUNT = Object.keys(TERRITORY_ZONES).reduce(function(total, zoneId) {
    const zone = TERRITORY_ZONES[zoneId];
    return total + zone.width * zone.height;
  }, 0);
  const OBSTACLE_ASSET_ROOT = "img/Maps/Camp%20Prototypes/Obstacles/";
  const OBSTACLE_TYPES = Object.freeze([
    Object.freeze({
      id: "greenBush",
      label: "Green bush",
      width: 2,
      height: 1,
      asset: OBSTACLE_ASSET_ROOT + "Green%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    Object.freeze({
      id: "thornBush",
      label: "Thorny bramble bush",
      width: 2,
      height: 1,
      asset: OBSTACLE_ASSET_ROOT + "Thorn%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    Object.freeze({
      id: "flowerBush",
      label: "Flowering bush",
      width: 2,
      height: 1,
      asset: OBSTACLE_ASSET_ROOT + "Flower%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    Object.freeze({
      id: "pebblePile",
      label: "Pile of pebbles",
      width: 1,
      height: 1,
      asset: OBSTACLE_ASSET_ROOT + "Pebble%20Pile_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    Object.freeze({
      id: "stoneBlockPile",
      label: "Pile of stone blocks",
      width: 2,
      height: 2,
      asset: OBSTACLE_ASSET_ROOT + "Stone%20Block%20Pile_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    Object.freeze({
      id: "tallGrass",
      label: "Tall green grass",
      width: 1,
      height: 1,
      asset: OBSTACLE_ASSET_ROOT + "Tall%20Grass_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    })
  ]);

  function entier(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : NaN;
  }

  function normaliserRotation(value) {
    const angle = entier(value);
    if (!Number.isFinite(angle)) return 0;
    return ((Math.round(angle / 90) * 90) % 360 + 360) % 360;
  }

  function celluleDansGrille(x, y) {
    return Number.isFinite(entier(x))
      && Number.isFinite(entier(y))
      && entier(x) >= 0
      && entier(y) >= 0
      && entier(x) < GRID_WIDTH
      && entier(y) < GRID_HEIGHT;
  }

  function cleCellule(x, y) {
    return entier(x) + ":" + entier(y);
  }

  function lireCleCellule(value) {
    if (typeof value !== "string" || !/^\d+:\d+$/.test(value)) return null;
    const parties = value.split(":");
    const x = entier(parties[0]);
    const y = entier(parties[1]);
    return celluleDansGrille(x, y) ? { x: x, y: y } : null;
  }

  function celluleDansZone(zone, x, y) {
    return Boolean(zone)
      && x >= zone.x
      && y >= zone.y
      && x < zone.x + zone.width
      && y < zone.y + zone.height;
  }

  function zoneTerrainPourCellule(x, y) {
    const positionX = entier(x);
    const positionY = entier(y);
    if (!celluleDansGrille(positionX, positionY)) return null;
    const ids = Object.keys(TERRITORY_ZONES);
    for (let index = 0; index < ids.length; index += 1) {
      const zone = TERRITORY_ZONES[ids[index]];
      if (celluleDansZone(zone, positionX, positionY)) return zone;
    }
    return null;
  }

  function cellulesRectangle(rectangle) {
    if (!rectangle) return [];
    const cellules = [];
    for (let y = rectangle.y; y < rectangle.y + rectangle.height; y += 1) {
      for (let x = rectangle.x; x < rectangle.x + rectangle.width; x += 1) {
        if (celluleDansGrille(x, y)) cellules.push({ x: x, y: y });
      }
    }
    return cellules;
  }

  function creerLayoutObstacles() {
    const obstacles = [];
    const cellulesOccupees = new Set(cellulesRectangle(INITIAL_BUILDABLE_RECT).map(function(cellule) {
      return cleCellule(cellule.x, cellule.y);
    }));
    const zoneIds = Object.keys(TERRITORY_ZONES);
    zoneIds.forEach(function(zoneId, zoneIndex) {
      const zone = TERRITORY_ZONES[zoneId];
      for (let y = zone.y; y < zone.y + zone.height; y += 1) {
        for (let x = zone.x; x < zone.x + zone.width; x += 1) {
          if (cellulesOccupees.has(cleCellule(x, y))) continue;
          const indexInitial = Math.abs(x * 17 + y * 31 + zoneIndex * 43)
            % OBSTACLE_TYPES.length;
          let selection = null;
          for (let decalage = 0; decalage < OBSTACLE_TYPES.length; decalage += 1) {
            const type = OBSTACLE_TYPES[(indexInitial + decalage) % OBSTACLE_TYPES.length];
            const cellules = cellulesRectangle({
              x: x,
              y: y,
              width: type.width,
              height: type.height
            });
            const tientDansZone = cellules.length === type.width * type.height
              && cellules.every(function(cellule) {
                return celluleDansZone(zone, cellule.x, cellule.y)
                  && !cellulesOccupees.has(cleCellule(cellule.x, cellule.y));
              });
            if (!tientDansZone) continue;
            selection = { type: type, cellules: cellules };
            break;
          }
          if (!selection) continue;
          selection.cellules.forEach(function(cellule) {
            cellulesOccupees.add(cleCellule(cellule.x, cellule.y));
          });
          obstacles.push(Object.freeze({
            uid: zone.id + ":" + x + ":" + y,
            id: selection.type.id,
            label: selection.type.label,
            width: selection.type.width,
            height: selection.type.height,
            asset: selection.type.asset,
            zoneId: zone.id,
            x: x,
            y: y,
            cells: Object.freeze(selection.cellules.map(function(cellule) {
              return Object.freeze({ x: cellule.x, y: cellule.y });
            }))
          }));
        }
      }
    });
    return Object.freeze(obstacles);
  }

  const OBSTACLE_LAYOUT = creerLayoutObstacles();
  const OBSTACLE_BY_CELL_KEY = Object.freeze(OBSTACLE_LAYOUT.reduce(function(index, obstacle) {
    obstacle.cells.forEach(function(cellule) {
      index[cleCellule(cellule.x, cellule.y)] = obstacle;
    });
    return index;
  }, {}));

  function creerTerrainInitial() {
    return {
      version: 4,
      claimedZoneIds: ["home"],
      clearedCells: cellulesRectangle(INITIAL_BUILDABLE_RECT).map(function(cellule) {
        return cleCellule(cellule.x, cellule.y);
      })
    };
  }

  function normaliserTerrain(value) {
    const source = value && typeof value === "object" ? value : {};
    const zonesConquises = new Set(["home"]);
    if (Array.isArray(source.claimedZoneIds)) {
      source.claimedZoneIds.forEach(function(zoneId) {
        if (TERRITORY_ZONES[zoneId]) zonesConquises.add(zoneId);
      });
    }
    const cellulesLibres = new Set(creerTerrainInitial().clearedCells);
    if (Array.isArray(source.clearedCells)) {
      source.clearedCells.forEach(function(cle) {
        const cellule = lireCleCellule(cle);
        const zone = cellule && zoneTerrainPourCellule(cellule.x, cellule.y);
        if (zone && zonesConquises.has(zone.id)) cellulesLibres.add(cleCellule(cellule.x, cellule.y));
      });
    }
    Array.from(cellulesLibres).forEach(function(cle) {
      const obstacle = OBSTACLE_BY_CELL_KEY[cle];
      if (!obstacle || !zonesConquises.has(obstacle.zoneId)) return;
      obstacle.cells.forEach(function(cellule) {
        cellulesLibres.add(cleCellule(cellule.x, cellule.y));
      });
    });
    return {
      version: 4,
      claimedZoneIds: Object.keys(TERRITORY_ZONES).filter(function(zoneId) {
        return zonesConquises.has(zoneId);
      }),
      clearedCells: Array.from(cellulesLibres).sort(function(a, b) {
        const celluleA = lireCleCellule(a);
        const celluleB = lireCleCellule(b);
        return celluleA.y - celluleB.y || celluleA.x - celluleB.x;
      })
    };
  }

  function estZoneConquise(terrain, zoneId) {
    const normalise = normaliserTerrain(terrain);
    return normalise.claimedZoneIds.includes(zoneId);
  }

  function estCelluleConstructible(terrain, x, y) {
    if (!celluleDansGrille(x, y)) return false;
    const normalise = normaliserTerrain(terrain);
    const zone = zoneTerrainPourCellule(x, y);
    return Boolean(zone)
      && normalise.claimedZoneIds.includes(zone.id)
      && normalise.clearedCells.includes(cleCellule(x, y));
  }

  function cellulesVoisines(x, y) {
    return [
      { x: x, y: y - 1 },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y }
    ].filter(function(cellule) {
      return celluleDansGrille(cellule.x, cellule.y);
    });
  }

  function peutDebroussailler(terrain, x, y) {
    const positionX = entier(x);
    const positionY = entier(y);
    const zone = zoneTerrainPourCellule(positionX, positionY);
    const normalise = normaliserTerrain(terrain);
    if (!zone) return { valide: false, raison: "This cell is outside the camp." };
    if (!normalise.claimedZoneIds.includes(zone.id)) {
      return { valide: false, raison: "Conquer this territory before clearing it." };
    }
    if (normalise.clearedCells.includes(cleCellule(positionX, positionY))) {
      return { valide: false, raison: "This cell is already clear." };
    }
    const obstacle = OBSTACLE_BY_CELL_KEY[cleCellule(positionX, positionY)];
    if (!obstacle) return { valide: false, raison: "There is nothing to clear here." };
    const cellulesObstacle = new Set(obstacle.cells.map(function(cellule) {
      return cleCellule(cellule.x, cellule.y);
    }));
    const cellulesLibres = new Set(normalise.clearedCells);
    const toucheTerrainLibre = obstacle.cells.some(function(celluleObstacle) {
      return cellulesVoisines(celluleObstacle.x, celluleObstacle.y).some(function(cellule) {
        const cle = cleCellule(cellule.x, cellule.y);
        return !cellulesObstacle.has(cle) && cellulesLibres.has(cle);
      });
    });
    return toucheTerrainLibre
      ? { valide: true, raison: "", obstacle: obstacle }
      : { valide: false, raison: "Clear a neighboring cell first." };
  }

  function debroussaillerTerrain(terrain, x, y) {
    const resultat = peutDebroussailler(terrain, x, y);
    if (!resultat.valide) {
      return { valide: false, raison: resultat.raison, terrain: normaliserTerrain(terrain) };
    }
    const normalise = normaliserTerrain(terrain);
    resultat.obstacle.cells.forEach(function(cellule) {
      normalise.clearedCells.push(cleCellule(cellule.x, cellule.y));
    });
    return {
      valide: true,
      raison: "",
      obstacle: resultat.obstacle,
      terrain: normaliserTerrain(normalise)
    };
  }

  function peutConquerirZone(terrain, zoneId) {
    const zone = TERRITORY_ZONES[zoneId];
    if (!zone) return { valide: false, raison: "Unknown territory." };
    if (estZoneConquise(terrain, zoneId)) {
      return { valide: false, raison: "This territory is already part of the camp." };
    }
    const toucheFrontiereLibre = cellulesRectangle(zone).some(function(cellule) {
      return cellulesVoisines(cellule.x, cellule.y).some(function(voisine) {
        return !celluleDansZone(zone, voisine.x, voisine.y)
          && estCelluleConstructible(terrain, voisine.x, voisine.y);
      });
    });
    return toucheFrontiereLibre
      ? { valide: true, raison: "" }
      : { valide: false, raison: "Clear a path to this territory first." };
  }

  function conquerirZoneTerrain(terrain, zoneId) {
    const resultat = peutConquerirZone(terrain, zoneId);
    if (!resultat.valide) {
      return { valide: false, raison: resultat.raison, terrain: normaliserTerrain(terrain) };
    }
    const normalise = normaliserTerrain(terrain);
    normalise.claimedZoneIds.push(zoneId);
    return { valide: true, raison: "", terrain: normaliserTerrain(normalise) };
  }

  function obstacleCellule(terrain, x, y) {
    const normalise = normaliserTerrain(terrain);
    const obstacle = OBSTACLE_BY_CELL_KEY[cleCellule(x, y)];
    if (!obstacle || !normalise.claimedZoneIds.includes(obstacle.zoneId)) return null;
    const cellulesLibres = new Set(normalise.clearedCells);
    return obstacle.cells.some(function(cellule) {
      return !cellulesLibres.has(cleCellule(cellule.x, cellule.y));
    }) ? obstacle : null;
  }

  function obstaclesTerrain(terrain) {
    const normalise = normaliserTerrain(terrain);
    const zonesConquises = new Set(normalise.claimedZoneIds);
    const cellulesLibres = new Set(normalise.clearedCells);
    return OBSTACLE_LAYOUT.filter(function(obstacle) {
      return zonesConquises.has(obstacle.zoneId)
        && obstacle.cells.some(function(cellule) {
          return !cellulesLibres.has(cleCellule(cellule.x, cellule.y));
        });
    });
  }

  function adapterTerrainAuLayout(terrain, layout) {
    const normalise = normaliserTerrain(terrain);
    const zonesConquises = new Set(normalise.claimedZoneIds);
    const cellulesLibres = new Set(normalise.clearedCells);
    (Array.isArray(layout) ? layout : []).forEach(function(item) {
      const rectangle = rectangleItem(item);
      cellulesRectangle(rectangle).forEach(function(cellule) {
        const zone = zoneTerrainPourCellule(cellule.x, cellule.y);
        if (!zone) return;
        zonesConquises.add(zone.id);
        cellulesLibres.add(cleCellule(cellule.x, cellule.y));
      });
    });
    return normaliserTerrain({
      claimedZoneIds: Array.from(zonesConquises),
      clearedCells: Array.from(cellulesLibres)
    });
  }

  function dimensionsType(typeOuId, rotation) {
    const type = typeof typeOuId === "string" ? ITEM_TYPES[typeOuId] : typeOuId;
    if (!type) return null;
    const angle = type.rotatable ? normaliserRotation(rotation) : 0;
    const permute = angle === 90 || angle === 270;
    return {
      width: permute ? type.height : type.width,
      height: permute ? type.width : type.height,
      rotation: angle
    };
  }

  function rectangleItem(item) {
    const typeId = item && (LEGACY_TYPE_ALIASES[item.type] || item.type);
    const type = typeId && ITEM_TYPES[typeId];
    if (!type) return null;
    const dimensions = dimensionsType(type, item.rotation);
    return {
      x: entier(item.x),
      y: entier(item.y),
      width: dimensions.width,
      height: dimensions.height
    };
  }

  function rectanglesSeChevauchent(a, b) {
    return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
  }

  function testerPlacement(layout, typeId, x, y, ignoreUid, rotation, terrain) {
    const type = ITEM_TYPES[typeId];
    const positionX = entier(x);
    const positionY = entier(y);
    if (!type) return { valide: false, raison: "Unknown prototype item." };
    if (!Number.isFinite(positionX) || !Number.isFinite(positionY)) {
      return { valide: false, raison: "Choose a grid position." };
    }

    const dimensions = dimensionsType(type, rotation);
    const rectangle = {
      x: positionX,
      y: positionY,
      width: dimensions.width,
      height: dimensions.height
    };
    if (
      rectangle.x < 0
      || rectangle.y < 0
      || rectangle.x + rectangle.width > GRID_WIDTH
      || rectangle.y + rectangle.height > GRID_HEIGHT
    ) {
      return { valide: false, raison: "This item would extend outside the camp." };
    }
    if (
      terrain
      && cellulesRectangle(rectangle).some(function(cellule) {
        return !estCelluleConstructible(terrain, cellule.x, cellule.y);
      })
    ) {
      return { valide: false, raison: "Clear and claim every cell under this item first." };
    }

    const elements = Array.isArray(layout) ? layout : [];
    for (let index = 0; index < elements.length; index += 1) {
      const autre = elements[index];
      if (!autre || autre.uid === ignoreUid) continue;
      const autreRectangle = rectangleItem(autre);
      if (autreRectangle && rectanglesSeChevauchent(rectangle, autreRectangle)) {
        const autreType = ITEM_TYPES[autre.type];
        return {
          valide: false,
          raison: "This space is occupied by " + (autreType ? autreType.label : "another item") + "."
        };
      }
    }

    return { valide: true, raison: "" };
  }

  function normaliserLayout(value, terrain) {
    if (!Array.isArray(value)) return [];
    const layout = [];
    value.forEach(function(item, index) {
      if (!item || typeof item !== "object") return;
      const typeId = LEGACY_TYPE_ALIASES[item.type] || item.type;
      if (!ITEM_TYPES[typeId]) return;
      const uid = typeof item.uid === "string" && item.uid
        ? item.uid
        : "camp-import-" + index;
      if (layout.some(function(existing) { return existing.uid === uid; })) return;
      const x = entier(item.x);
      const y = entier(item.y);
      const type = ITEM_TYPES[typeId];
      const rotation = type.rotatable ? normaliserRotation(item.rotation) : 0;
      if (!testerPlacement(layout, typeId, x, y, null, rotation, terrain).valide) return;
      const normalise = { uid: uid, type: typeId, x: x, y: y };
      if (type.rotatable) normalise.rotation = rotation;
      layout.push(normalise);
    });
    return layout;
  }

  function connexionsRoute(layout, x, y) {
    const routes = new Set((Array.isArray(layout) ? layout : [])
      .filter(function(item) { return item && item.type === "road"; })
      .map(function(item) { return entier(item.x) + ":" + entier(item.y); }));
    const positionX = entier(x);
    const positionY = entier(y);
    const north = routes.has(positionX + ":" + (positionY - 1));
    const east = routes.has((positionX + 1) + ":" + positionY);
    const south = routes.has(positionX + ":" + (positionY + 1));
    const west = routes.has((positionX - 1) + ":" + positionY);
    return {
      north: north,
      east: east,
      south: south,
      west: west,
      mask: (north ? 1 : 0) | (east ? 2 : 0) | (south ? 4 : 0) | (west ? 8 : 0)
    };
  }

  function cellulesLigne(x0, y0, x1, y1) {
    let debutX = entier(x0);
    let debutY = entier(y0);
    const finX = entier(x1);
    const finY = entier(y1);
    if (![debutX, debutY, finX, finY].every(Number.isFinite)) return [];
    const cellules = [];
    const deltaX = Math.abs(finX - debutX);
    const pasX = debutX < finX ? 1 : -1;
    const deltaY = -Math.abs(finY - debutY);
    const pasY = debutY < finY ? 1 : -1;
    let erreur = deltaX + deltaY;

    while (true) {
      const precedente = cellules[cellules.length - 1];
      if (
        precedente
        && precedente.x !== debutX
        && precedente.y !== debutY
      ) {
        cellules.push({ x: debutX, y: precedente.y });
      }
      cellules.push({ x: debutX, y: debutY });
      if (debutX === finX && debutY === finY) break;
      const doubleErreur = 2 * erreur;
      if (doubleErreur >= deltaY) {
        erreur += deltaY;
        debutX += pasX;
      }
      if (doubleErreur <= deltaX) {
        erreur += deltaX;
        debutY += pasY;
      }
    }
    return cellules;
  }

  CatInc.camp = Object.freeze({
    GRID_WIDTH: GRID_WIDTH,
    GRID_HEIGHT: GRID_HEIGHT,
    HOUSE_DECOR_HEIGHT: HOUSE_DECOR_HEIGHT,
    TERRAIN_CELL_COUNT: TERRAIN_CELL_COUNT,
    ITEM_TYPES: ITEM_TYPES,
    INITIAL_BUILDABLE_RECT: INITIAL_BUILDABLE_RECT,
    TERRITORY_ZONES: TERRITORY_ZONES,
    OBSTACLE_TYPES: OBSTACLE_TYPES,
    OBSTACLE_LAYOUT: OBSTACLE_LAYOUT,
    normaliserRotation: normaliserRotation,
    celluleDansGrille: celluleDansGrille,
    cleCellule: cleCellule,
    zoneTerrainPourCellule: zoneTerrainPourCellule,
    cellulesRectangle: cellulesRectangle,
    creerTerrainInitial: creerTerrainInitial,
    normaliserTerrain: normaliserTerrain,
    estZoneConquise: estZoneConquise,
    estCelluleConstructible: estCelluleConstructible,
    peutDebroussailler: peutDebroussailler,
    debroussaillerTerrain: debroussaillerTerrain,
    peutConquerirZone: peutConquerirZone,
    conquerirZoneTerrain: conquerirZoneTerrain,
    obstacleCellule: obstacleCellule,
    obstaclesTerrain: obstaclesTerrain,
    adapterTerrainAuLayout: adapterTerrainAuLayout,
    dimensionsType: dimensionsType,
    rectangleItem: rectangleItem,
    rectanglesSeChevauchent: rectanglesSeChevauchent,
    testerPlacement: testerPlacement,
    normaliserLayout: normaliserLayout,
    connexionsRoute: connexionsRoute,
    cellulesLigne: cellulesLigne
  });
})(typeof window !== "undefined" ? window : globalThis);
