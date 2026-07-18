(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  // Processed Resources Production bonus — scales at 1.05^level.
  function productionProcBonus(kitty) {
    return kitty ? Math.pow(1.05, kitty.niveau) : 1;
  }

  // Advances one self-contained recipe slot through its private Gathering and
  // Processing phases. Simple inputs never enter the shared inventory.
  function avancerRecetteSlot(state, pair, slot, dt, modifiers) {
    modifiers = modifiers || {};
    const result = {
      active: false,
      gathered: 0,
      produced: 0,
      completedCycles: 0,
      firstProducerIndex: null
    };
    if (!state || !pair || !slot || slot.kittyIndex === null || !slot.recipeId || !(dt > 0)) return result;

    const rawSeconds = Number(pair.rawSeconds);
    const processingSeconds = Number(pair.processingSeconds);
    const baseRawQuantity = Number(pair.rawQuantity);
    if (!(rawSeconds > 0) || !(processingSeconds > 0) || !(baseRawQuantity > 0)) return result;

    const positive = function(value, fallback) {
      value = Number(value);
      return Number.isFinite(value) && value > 0 ? value : fallback;
    };
    const costMultiplier = positive(modifiers.costMultiplier, 1);
    const targetRaw = baseRawQuantity * costMultiplier;
    const gatheringRate = positive(modifiers.gatheringSpeed, 1)
      * positive(modifiers.gatheringProduction, 1)
      * positive(modifiers.basicProduction, 1)
      * positive(modifiers.globalSpeed, 1)
      / rawSeconds;
    const processingRate = positive(modifiers.processingSpeed, 1)
      * positive(modifiers.globalSpeed, 1)
      / processingSeconds;
    const complexProduction = positive(modifiers.complexProduction, 1);
    const EPSILON = 1e-9;

    slot.gatheredInputs = slot.gatheredInputs && typeof slot.gatheredInputs === "object" ? slot.gatheredInputs : {};
    slot.reservedInputs = slot.reservedInputs && typeof slot.reservedInputs === "object" ? slot.reservedInputs : {};
    slot.outputCarry = Math.max(0, Number(slot.outputCarry) || 0);
    if (slot.phase !== "gathering" && slot.phase !== "processing") slot.phase = "gathering";
    result.active = true;

    let remaining = Number(dt);
    let guard = 0;
    while (remaining > EPSILON && guard++ < 100000) {
      if (slot.phase === "gathering") {
        let gathered = Math.max(0, Number(slot.gatheredInputs[pair.rawRes]) || 0);
        if (gathered > targetRaw) gathered = targetRaw;
        const missing = Math.max(0, targetRaw - gathered);
        if (missing <= EPSILON) {
          slot.gatheredInputs[pair.rawRes] = targetRaw;
          slot.phase = "processing";
          slot.phaseProgress = 0;
          continue;
        }
        const secondsNeeded = missing / gatheringRate;
        const secondsUsed = Math.min(remaining, secondsNeeded);
        const amount = Math.min(missing, gatheringRate * secondsUsed);
        gathered += amount;
        slot.gatheredInputs[pair.rawRes] = gathered;
        slot.phaseProgress = targetRaw > 0 ? Math.min(1, gathered / targetRaw) : 1;
        result.gathered += amount;
        if (pair.rawTotalKey) state[pair.rawTotalKey] = (Number(state[pair.rawTotalKey]) || 0) + amount;
        remaining -= secondsUsed;
        if (missing - amount <= EPSILON) {
          slot.gatheredInputs[pair.rawRes] = targetRaw;
          slot.phase = "processing";
          slot.phaseProgress = 0;
        }
        continue;
      }

      const progress = Math.max(0, Math.min(1, Number(slot.phaseProgress) || 0));
      const missingProgress = 1 - progress;
      const secondsNeeded = missingProgress / processingRate;
      const secondsUsed = Math.min(remaining, secondsNeeded);
      const nextProgress = Math.min(1, progress + processingRate * secondsUsed);
      slot.phaseProgress = nextProgress;
      remaining -= secondsUsed;
      if (1 - nextProgress > EPSILON) continue;

      slot.outputCarry += complexProduction;
      const wholeOutput = Math.floor(slot.outputCarry + EPSILON);
      slot.outputCarry = Math.max(0, slot.outputCarry - wholeOutput);
      if (wholeOutput > 0) {
        state[pair.outputRes] = (Number(state[pair.outputRes]) || 0) + wholeOutput;
        if (pair.procTotalKey) state[pair.procTotalKey] = (Number(state[pair.procTotalKey]) || 0) + wholeOutput;
        result.produced += wholeOutput;
        if (result.firstProducerIndex === null) result.firstProducerIndex = slot.kittyIndex;
      }
      result.completedCycles += 1;
      slot.gatheredInputs = {};
      slot.reservedInputs = {};
      slot.phase = "gathering";
      slot.phaseProgress = 0;
    }
    return result;
  }

  CatInc.production = Object.freeze({
    productionProcBonus: productionProcBonus,
    avancerRecetteSlot: avancerRecetteSlot
  });
})(typeof window !== "undefined" ? window : globalThis);
