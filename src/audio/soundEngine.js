// src/audio/soundEngine.js
// ─── Premium Audio Engine ───────────────────────────────────────────────────
// This engine supports high-fidelity MP3/WAV files with procedural fallbacks.

let audioCtx = null;
let masterGain = null;
let bgmGain = null;
let currentThemeId = null;
let currentBGMBuffer = null;
let currentBGMSource = null;
let isMuted = false;
let bgmVolume = 0.25; // Boosted for premium tracks
let sfxVolume = 0.6;

// Preload cache for SFX buffers
const sfxCache = {};

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = sfxVolume;
    masterGain.connect(audioCtx.destination);
    bgmGain = audioCtx.createGain();
    bgmGain.gain.value = bgmVolume;
    bgmGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ─── Utility: Load Audio File ───────────────────────────────────────────────
async function loadAudio(url) {
  const ctx = getCtx();
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.warn(`Failed to load audio: ${url}`, e);
    return null;
  }
}

// ─── Procedural Fallbacks (The "Beep Boops") ────────────────────────────────
function playProceduralNote(freq, duration, type = 'sine', volume = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume * sfxVolume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.05);
}

// ─── SFX Implementation ─────────────────────────────────────────────────────
const SFX_FILES = {
  pop: '/assets/audio/pop.mp3',
  ding: '/assets/audio/ding.mp3',
  fail: '/assets/audio/fail.mp3',
  sparkle: '/assets/audio/sparkle.mp3',
  levelUp: '/assets/audio/level_up.mp3',
  click: '/assets/audio/click.mp3',
};

export const playSound = async (type, param = null) => {
  if (isMuted) return;
  const ctx = getCtx();

  // Handle Mascot Hover (Special case)
  if (type === 'mascot') {
    playProceduralNote(440 + (Math.random() * 400), 0.1, 'sine', 0.1);
    return;
  }

  const url = SFX_FILES[type];
  if (url) {
    // Try to play from file
    if (!sfxCache[type]) {
      sfxCache[type] = await loadAudio(url);
    }
    
    if (sfxCache[type]) {
      const source = ctx.createBufferSource();
      source.buffer = sfxCache[type];
      source.connect(masterGain);
      source.start();
      return;
    }
  }

  // Fallback to procedural if file missing
  switch (type) {
    case 'ding': playProceduralNote(880, 0.3, 'sine', 0.3); break;
    case 'fail': playProceduralNote(220, 0.4, 'triangle', 0.3); break;
    case 'pop': playProceduralNote(600, 0.1, 'sine', 0.2); break;
    case 'sparkle': playProceduralNote(1200, 0.5, 'sine', 0.15); break;
    case 'levelUp': playProceduralNote(440, 0.8, 'square', 0.2); break;
    default: playProceduralNote(800, 0.05, 'sine', 0.1);
  }
};

// ─── Background Music (BGM) Implementation ──────────────────────────────────
const THEME_FILES = {
  landing: '/assets/audio/landing_theme.mp3',
  unicorn: '/assets/audio/unicorn_theme.mp3',
  werecat: '/assets/audio/werecat_theme.mp3',
  milo: '/assets/audio/milo_theme.mp3',
  luna: '/assets/audio/luna_theme.mp3',
};

export const playTheme = async (themeId) => {
  if (currentThemeId === themeId) return;
  
  stopTheme();
  currentThemeId = themeId;
  const ctx = getCtx();

  const url = THEME_FILES[themeId];
  if (url) {
    const buffer = await loadAudio(url);
    if (buffer && currentThemeId === themeId) { // Check if theme didn't change during load
      currentBGMBuffer = buffer;
      currentBGMSource = ctx.createBufferSource();
      currentBGMSource.buffer = buffer;
      currentBGMSource.loop = true;
      currentBGMSource.connect(bgmGain);
      currentBGMSource.start();
      return;
    }
  }

  // Fallback BGM Logic (Simplified procedural loop)
  console.log(`Fallback BGM for ${themeId}`);
};

export const stopTheme = () => {
  if (currentBGMSource) {
    try { currentBGMSource.stop(); } catch (e) {}
    currentBGMSource = null;
  }
  currentThemeId = null;
};

// ─── Volume Controls ────────────────────────────────────────────────────────
export const setMuted = (muted) => {
  isMuted = muted;
  if (muted) stopTheme();
};

export const isSoundMuted = () => isMuted;

export const setBGMVolume = (vol) => {
  bgmVolume = Math.max(0, Math.min(1, vol));
  if (bgmGain) bgmGain.gain.setTargetAtTime(bgmVolume, getCtx().currentTime, 0.1);
};

export const setSFXVolume = (vol) => {
  sfxVolume = Math.max(0, Math.min(1, vol));
  if (masterGain) masterGain.gain.setTargetAtTime(sfxVolume, getCtx().currentTime, 0.1);
};

export const getCurrentTheme = () => currentThemeId;

export const resumeAudio = () => {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};
