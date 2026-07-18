(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const SOURCES = Object.freeze({
    meowNormal: "Sounds/Meows/Meow Normal.mp3",
    meowPurr: "Sounds/Meows/Meow Purr.mp3",
    meowStrong: "Sounds/Meows/Meow Strong.mp3",
    birdWingFlaps: "Sounds/Bird/Bird Wing Flaps.mp3",
    music: "Sounds/Music/Base Music Test.ogg"
  });
  let assignmentMeowIndex = 0;
  let musicAudio = null;

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

  function ensureMusic(volume) {
    if (typeof root.Audio !== "function") return null;
    if (!musicAudio) {
      musicAudio = new root.Audio(SOURCES.music);
      musicAudio.preload = "auto";
      musicAudio.loop = true;
    }
    musicAudio.volume = clampVolume(volume);
    return musicAudio;
  }

  function startMusic(volume) {
    const audio = ensureMusic(volume);
    if (!audio || clampVolume(volume) <= 0) return;
    if (!audio.paused) return;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() {});
  }

  function setMusicVolume(volume) {
    const value = clampVolume(volume);
    const audio = value > 0 || musicAudio ? ensureMusic(value) : null;
    if (!audio) return;
    audio.volume = value;
    if (value <= 0) {
      audio.pause();
      return;
    }
    startMusic(value);
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
    },
    startMusic: function(volume) {
      startMusic(volume);
    },
    setMusicVolume: function(volume) {
      setMusicVolume(volume);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
