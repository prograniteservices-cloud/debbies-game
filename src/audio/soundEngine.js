// src/audio/soundEngine.js
// ─── Synthesized Sound Engine ───────────────────────────────────────────────
// All sounds are procedurally generated using Web Audio API.
// No external audio files required — everything runs in the browser.

let audioCtx = null;
let masterGain = null;
let bgmGain = null;
let bgmOscillators = [];
let bgmInterval = null;
let currentThemeId = null;
let isMuted = false;
let bgmVolume = 0.18;
let sfxVolume = 0.5;

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

// ─── Utility: play a note ──────────────────────────────────────────────────
function playNote(freq, duration, type = 'sine', volume = 0.3, startTime = 0, detune = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.value = freq;
  if (detune) osc.detune.value = detune;
  
  gain.gain.value = 0;
  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(volume * sfxVolume, ctx.currentTime + startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration + 0.05);
}

// ─── Utility: noise burst ──────────────────────────────────────────────────
function playNoise(duration, volume = 0.1, startTime = 0, filterFreq = 4000) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  filter.Q.value = 1;
  
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(volume * sfxVolume, ctx.currentTime + startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  source.start(ctx.currentTime + startTime);
  source.stop(ctx.currentTime + startTime + duration + 0.05);
}

// ─── SFX: Pop ── Bubbly click for selections ────────────────────────────────
function sfxPop() {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12);
  
  gain.gain.setValueAtTime(0.35 * sfxVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);

  // Add a tiny click layer
  playNoise(0.03, 0.08, 0, 6000);
}

// ─── SFX: Ding ── Success chime, bright and cheerful ─────────────────────────
function sfxDing() {
  if (isMuted) return;
  // Two-note rising chime with harmonics
  playNote(880, 0.3, 'sine', 0.3, 0);      // A5
  playNote(1320, 0.4, 'sine', 0.25, 0.05);  // E6
  playNote(1760, 0.15, 'triangle', 0.1, 0);  // harmonic shimmer
  // Sparkle noise layer
  playNoise(0.15, 0.04, 0.08, 8000);
}

// ─── SFX: Fail ── Descending "wrong" tone, sympathetic not harsh ─────────
function sfxFail() {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);
  osc.frequency.exponentialRampToValueAtTime(165, ctx.currentTime + 0.4);
  
  gain.gain.setValueAtTime(0.25 * sfxVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
  
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
  
  // Second tone slightly detuned for "wobble" feel
  playNote(435, 0.35, 'triangle', 0.12, 0.02);
}

// ─── SFX: Sparkle ── Ascending arpeggio + shimmer ────────────────────────────
function sfxSparkle() {
  if (isMuted) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
  notes.forEach((freq, i) => {
    playNote(freq, 0.25, 'sine', 0.2, i * 0.06);
    playNote(freq * 2, 0.15, 'sine', 0.05, i * 0.06 + 0.02); // octave shimmer
  });
  playNoise(0.3, 0.03, 0.15, 10000);
}

// ─── SFX: Level Up ── Triumphant fanfare ─────────────────────────────────────
function sfxLevelUp() {
  if (isMuted) return;
  // C major arpeggio with octave jump
  const fanfare = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  fanfare.forEach((freq, i) => {
    playNote(freq, 0.4, 'square', 0.12, i * 0.12);
    playNote(freq, 0.5, 'sine', 0.18, i * 0.12);
  });
  // Final sustain
  playNote(1046.5, 0.8, 'sine', 0.25, 0.5);
  playNote(1318.5, 0.8, 'sine', 0.15, 0.55);
  playNoise(0.5, 0.05, 0.6, 8000);
}

// ─── SFX: Click ── Subtle UI click ───────────────────────────────────────────
function sfxClick() {
  if (isMuted) return;
  playNote(800, 0.06, 'sine', 0.15, 0);
  playNoise(0.02, 0.06, 0, 5000);
}

// ─── SFX Router ─────────────────────────────────────────────────────────────
const SFX_MAP = {
  pop: sfxPop,
  ding: sfxDing,
  fail: sfxFail,
  sparkle: sfxSparkle,
  levelUp: sfxLevelUp,
  click: sfxClick,
};

export const playSound = (type) => {
  const fn = SFX_MAP[type];
  if (fn) {
    try { fn(); } catch (e) { console.warn('Sound error:', e); }
  } else {
    console.warn(`Sound type '${type}' not found.`);
  }
};

// ─── Background Music ── Procedural chiptune-style loops ──────────────────
// Each theme has a different musical mood

const MUSIC_DATA = {
  unicorn: {
    // Dreamy, sparkly, major key progression  (C major / pentatonic)
    bpm: 105,
    bassLine: [261.63, 329.63, 392, 329.63], // C4 E4 G4 E4
    melody: [
      523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
      587.33, 783.99, 1046.5, 783.99, // D5 G5 C6 G5
      523.25, 659.25, 783.99, 1046.5, // C5 E5 G5 C6
      783.99, 659.25, 523.25, 392,    // G5 E5 C5 G4
    ],
    chords: [
      [261.63, 329.63, 392],    // C
      [349.23, 440, 523.25],    // F
      [392, 493.88, 587.33],    // G
      [261.63, 329.63, 392],    // C
    ],
    waveType: 'sine',
    bassType: 'triangle',
  },
  werecat: {
    // Adventurous, slightly mysterious, minor-ish
    bpm: 120,
    bassLine: [196, 233.08, 261.63, 233.08], // G3 Bb3 C4 Bb3
    melody: [
      392, 466.16, 523.25, 587.33,   // G4 Bb4 C5 D5
      523.25, 466.16, 392, 349.23,   // C5 Bb4 G4 F4
      440, 523.25, 587.33, 659.25,   // A4 C5 D5 E5
      587.33, 523.25, 440, 392,      // D5 C5 A4 G4
    ],
    chords: [
      [196, 233.08, 293.66],    // Gm
      [233.08, 293.66, 349.23], // Bb
      [261.63, 329.63, 392],    // C
      [196, 233.08, 293.66],    // Gm
    ],
    waveType: 'square',
    bassType: 'sawtooth',
  },
  milo: {
    // Heroic, upbeat, march-like
    bpm: 130,
    bassLine: [220, 261.63, 329.63, 261.63], // A3 C4 E4 C4
    melody: [
      440, 523.25, 659.25, 523.25,   // A4 C5 E5 C5
      587.33, 659.25, 783.99, 659.25, // D5 E5 G5 E5
      440, 587.33, 659.25, 783.99,   // A4 D5 E5 G5
      659.25, 523.25, 440, 329.63,   // E5 C5 A4 E4
    ],
    chords: [
      [220, 277.18, 329.63],    // Am
      [261.63, 329.63, 392],    // C
      [293.66, 369.99, 440],    // Dm
      [329.63, 415.3, 493.88],  // E
    ],
    waveType: 'square',
    bassType: 'triangle',
  },
  luna: {
    // Ethereal, dreamy, celestial
    bpm: 90,
    bassLine: [196, 246.94, 293.66, 246.94], // G3 B3 D4 B3
    melody: [
      587.33, 659.25, 783.99, 880,   // D5 E5 G5 A5
      783.99, 659.25, 587.33, 493.88, // G5 E5 D5 B4
      523.25, 659.25, 783.99, 880,   // C5 E5 G5 A5
      783.99, 659.25, 587.33, 493.88, // G5 E5 D5 B4
    ],
    chords: [
      [293.66, 369.99, 440],    // D
      [329.63, 415.3, 493.88],  // E
      [196, 246.94, 293.66],    // G
      [220, 277.18, 329.63],    // A
    ],
    waveType: 'sine',
    bassType: 'sine',
  },
};

let bgmState = {
  beatIndex: 0,
  melodyIndex: 0,
  chordIndex: 0,
};

function playBGMBeat(themeData) {
  if (!audioCtx || isMuted) return;
  const ctx = audioCtx;
  const beatDuration = 60 / themeData.bpm;
  
  // Bass note (every beat)
  const bassNote = themeData.bassLine[bgmState.beatIndex % themeData.bassLine.length];
  const bassOsc = ctx.createOscillator();
  const bassGainNode = ctx.createGain();
  bassOsc.type = themeData.bassType;
  bassOsc.frequency.value = bassNote;
  bassGainNode.gain.setValueAtTime(0.12 * bgmVolume, ctx.currentTime);
  bassGainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatDuration * 0.9);
  bassOsc.connect(bassGainNode);
  bassGainNode.connect(bgmGain);
  bassOsc.start(ctx.currentTime);
  bassOsc.stop(ctx.currentTime + beatDuration);
  
  // Melody note (every beat)
  const melodyNote = themeData.melody[bgmState.melodyIndex % themeData.melody.length];
  const melOsc = ctx.createOscillator();
  const melGain = ctx.createGain();
  melOsc.type = themeData.waveType;
  melOsc.frequency.value = melodyNote;
  melGain.gain.setValueAtTime(0.08 * bgmVolume, ctx.currentTime);
  melGain.gain.setValueAtTime(0.08 * bgmVolume, ctx.currentTime + beatDuration * 0.3);
  melGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatDuration * 0.85);
  melOsc.connect(melGain);
  melGain.connect(bgmGain);
  melOsc.start(ctx.currentTime);
  melOsc.stop(ctx.currentTime + beatDuration);
  
  // Chord pad (every 4 beats)
  if (bgmState.beatIndex % 4 === 0) {
    const chord = themeData.chords[bgmState.chordIndex % themeData.chords.length];
    chord.forEach(freq => {
      const cOsc = ctx.createOscillator();
      const cGain = ctx.createGain();
      cOsc.type = 'sine';
      cOsc.frequency.value = freq;
      cGain.gain.setValueAtTime(0.04 * bgmVolume, ctx.currentTime);
      cGain.gain.setValueAtTime(0.04 * bgmVolume, ctx.currentTime + beatDuration * 3);
      cGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatDuration * 3.9);
      cOsc.connect(cGain);
      cGain.connect(bgmGain);
      cOsc.start(ctx.currentTime);
      cOsc.stop(ctx.currentTime + beatDuration * 4);
    });
    bgmState.chordIndex++;
  }
  
  bgmState.beatIndex++;
  bgmState.melodyIndex++;
}

export const playTheme = (themeId) => {
  if (currentThemeId === themeId) return;
  
  // Stop current theme
  stopTheme();
  
  const themeData = MUSIC_DATA[themeId] || MUSIC_DATA.unicorn;
  currentThemeId = themeId;
  
  // Initialize audio context
  getCtx();
  
  bgmState = { beatIndex: 0, melodyIndex: 0, chordIndex: 0 };
  
  // Start the BGM loop
  const beatInterval = (60 / themeData.bpm) * 1000; // ms per beat
  
  // Play first beat immediately
  playBGMBeat(themeData);
  
  bgmInterval = setInterval(() => {
    playBGMBeat(themeData);
  }, beatInterval);
};

export const stopTheme = () => {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  currentThemeId = null;
  bgmState = { beatIndex: 0, melodyIndex: 0, chordIndex: 0 };
};

// ─── Volume Controls ────────────────────────────────────────────────────────
export const setMuted = (muted) => {
  isMuted = muted;
  if (muted && bgmInterval) {
    stopTheme();
  }
};

export const isSoundMuted = () => isMuted;

export const setBGMVolume = (vol) => {
  bgmVolume = Math.max(0, Math.min(1, vol));
  if (bgmGain) bgmGain.gain.value = bgmVolume;
};

export const setSFXVolume = (vol) => {
  sfxVolume = Math.max(0, Math.min(1, vol));
  if (masterGain) masterGain.gain.value = sfxVolume;
};

export const getCurrentTheme = () => currentThemeId;

// ─── Resume audio context (needed for mobile browsers) ──────────────────────
export const resumeAudio = () => {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};
