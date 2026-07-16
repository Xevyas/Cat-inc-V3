(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const SOURCES = Object.freeze({
    catAssignment: "Sounds/Meow Modal.mp3"
  });

  function clampVolume(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(1, number));
  }

  function play(source, volume) {
    if (typeof root.Audio !== "function") return;
    const audio = new root.Audio(source);
    audio.preload = "auto";
    audio.volume = clampVolume(volume);
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() {});
  }

  CatInc.audio = Object.freeze({
    sources: SOURCES,
    playCatAssignment: function(volume) {
      play(SOURCES.catAssignment, volume);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
