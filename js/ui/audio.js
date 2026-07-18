(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const SOURCES = Object.freeze({
    meowNormal: "Sounds/Meows/Meow Normal.wav",
    meowPurr: "Sounds/Meows/Meow Purr.wav",
    meowStrong: "Sounds/Meows/Meow Strong.wav",
    birdWingFlaps: "Sounds/Bird/Bird Wing Flaps.wav"
  });
  let assignmentMeowIndex = 0;

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
      var meow = assignmentMeowIndex === 0 ? SOURCES.meowNormal : SOURCES.meowStrong;
      assignmentMeowIndex = assignmentMeowIndex === 0 ? 1 : 0;
      play(meow, volume);
    },
    playCatMeow: function(volume) {
      play(SOURCES.meowPurr, volume);
    },
    playBirdWingFlaps: function(volume) {
      play(SOURCES.birdWingFlaps, volume);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
