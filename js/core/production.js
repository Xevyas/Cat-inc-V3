(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  // Processed Resources Production bonus — scales at 1.05^level.
  function productionProcBonus(kitty) {
    return kitty ? Math.pow(1.05, kitty.niveau) : 1;
  }

  // Advances every active slot of one raw → processed resource pair.
  // Scarce input is distributed fairly and consumption never exceeds stock.
  function avancerTransformation(state, pair, dt, multiplicateur) {
    const slots = state.workers[pair.procAction] || [];
    const slotsActifs = slots.filter(function(slot) { return slot.kittyIndex !== null; });
    const resultat = {
      actif: slotsActifs.length > 0,
      bloque: false,
      consomme: 0,
      produit: 0,
      premierProducteurIndex: null
    };
    if (!resultat.actif) return resultat;

    const secondesParSortie = pair.procCfg[pair.procSecUnite];
    const secondesParEntree = pair.procCfg[pair.procSecRaw];
    const progressionSouhaitee = multiplicateur * dt / secondesParSortie;
    const entreeParProgression = secondesParSortie / secondesParEntree;
    const besoinTotal = Math.max(0, progressionSouhaitee * entreeParProgression * slotsActifs.length);
    const stockDisponible = Math.max(0, Number(state[pair.rawRes]) || 0);
    const EPSILON_STOCK = 1e-12;

    resultat.consomme = Math.min(stockDisponible, besoinTotal);
    resultat.bloque = besoinTotal > stockDisponible + EPSILON_STOCK;

    const facteurDisponible = besoinTotal > 0 ? resultat.consomme / besoinTotal : 0;
    const progressionReelle = progressionSouhaitee * facteurDisponible;
    const stockRestant = stockDisponible - resultat.consomme;
    state[pair.rawRes] = stockRestant < EPSILON_STOCK ? 0 : stockRestant;

    slotsActifs.forEach(function(slot) {
      slot.progress = (Number(slot.progress) || 0) + progressionReelle;
      if (slot.progress < 1) return;

      const cycles = Math.floor(slot.progress);
      slot.progress -= cycles;
      const kitty = state.kittiesData[slot.kittyIndex];
      const niveau = kitty && Number.isFinite(kitty.niveau) ? kitty.niveau : 0;
      const procBonus = Math.pow(1.05, niveau);
      slot.prodFrac = (Number(slot.prodFrac) || 0) + cycles * procBonus;
      const produitSlot = Math.floor(slot.prodFrac);
      slot.prodFrac -= produitSlot;
      if (produitSlot <= 0) return;

      resultat.produit += produitSlot;
      if (resultat.premierProducteurIndex === null) resultat.premierProducteurIndex = slot.kittyIndex;
    });

    state[pair.procRes] = (Number(state[pair.procRes]) || 0) + resultat.produit;
    return resultat;
  }

  CatInc.production = Object.freeze({
    productionProcBonus: productionProcBonus,
    avancerTransformation: avancerTransformation
  });
})(typeof window !== "undefined" ? window : globalThis);
