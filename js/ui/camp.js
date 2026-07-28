(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 30;

  const ITEM_TYPES = Object.freeze({
    sawmill: Object.freeze({
      id: "sawmill",
      label: "Sawmill",
      width: 4,
      height: 4,
      color: "wood",
      category: "building"
    }),
    kitchen: Object.freeze({
      id: "kitchen",
      label: "Kitchen",
      width: 3,
      height: 4,
      color: "food",
      category: "building"
    }),
    trainingCenter: Object.freeze({
      id: "trainingCenter",
      label: "Training Center",
      width: 4,
      height: 3,
      color: "training",
      category: "building"
    }),
    tree: Object.freeze({
      id: "tree",
      label: "Tree",
      width: 2,
      height: 2,
      color: "nature",
      category: "decoration"
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
      label: "Road",
      width: 1,
      height: 1,
      color: "road",
      category: "road",
      continuous: true
    })
  });

  function entier(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : NaN;
  }

  function rectangleItem(item) {
    const type = item && ITEM_TYPES[item.type];
    if (!type) return null;
    return {
      x: entier(item.x),
      y: entier(item.y),
      width: type.width,
      height: type.height
    };
  }

  function rectanglesSeChevauchent(a, b) {
    return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
  }

  function testerPlacement(layout, typeId, x, y, ignoreUid) {
    const type = ITEM_TYPES[typeId];
    const positionX = entier(x);
    const positionY = entier(y);
    if (!type) return { valide: false, raison: "Unknown prototype item." };
    if (!Number.isFinite(positionX) || !Number.isFinite(positionY)) {
      return { valide: false, raison: "Choose a grid position." };
    }

    const rectangle = {
      x: positionX,
      y: positionY,
      width: type.width,
      height: type.height
    };
    if (
      rectangle.x < 0
      || rectangle.y < 0
      || rectangle.x + rectangle.width > GRID_WIDTH
      || rectangle.y + rectangle.height > GRID_HEIGHT
    ) {
      return { valide: false, raison: "This item would extend outside the camp." };
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

  function normaliserLayout(value) {
    if (!Array.isArray(value)) return [];
    const layout = [];
    value.forEach(function(item, index) {
      if (!item || typeof item !== "object" || !ITEM_TYPES[item.type]) return;
      const uid = typeof item.uid === "string" && item.uid
        ? item.uid
        : "camp-import-" + index;
      if (layout.some(function(existing) { return existing.uid === uid; })) return;
      const x = entier(item.x);
      const y = entier(item.y);
      if (!testerPlacement(layout, item.type, x, y).valide) return;
      layout.push({ uid: uid, type: item.type, x: x, y: y });
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
    ITEM_TYPES: ITEM_TYPES,
    rectangleItem: rectangleItem,
    rectanglesSeChevauchent: rectanglesSeChevauchent,
    testerPlacement: testerPlacement,
    normaliserLayout: normaliserLayout,
    connexionsRoute: connexionsRoute,
    cellulesLigne: cellulesLigne
  });
})(typeof window !== "undefined" ? window : globalThis);
