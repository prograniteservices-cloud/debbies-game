// src/audio/soundEngine.js
// Uses Web Audio API to synthesize standard game sounds, 
// avoiding external audio file dependencies in the initial sprint.

let audioCtx;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSound = (type) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'pop':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gainNode.gain.setValueAtTime(1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    case 'ding':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
      gainNode.gain.setValueAtTime(0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
    case 'fail':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.linearRampToValueAtTime(100, now + 0.4);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;
    case 'sparkle':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(2000, now);
      oscillator.frequency.linearRampToValueAtTime(3500, now + 0.2);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
      
      // Add a slight tremolo
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(20, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.5, now);
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start(now);
      lfo.stop(now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
    default:
      oscillator.disconnect();
      gainNode.disconnect();
      return;
  }
};

let currentThemeOscillators = [];
let themeInterval = null;

export const playTheme = (themeId) => {
  stopTheme(); // Ensure any existing theme is stopped

  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  if (themeId === 'unicorn') {
    // Magical Arpeggios (high pitched sine waves)
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    let step = 0;
    
    themeInterval = setInterval(() => {
      if (ctx.state === 'suspended') return;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = notes[step % notes.length];
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      
      currentThemeOscillators.push(oscillator);
      step++;
    }, 250); 
    
  } else if (themeId === 'werecat') {
    // Spooky / Groovy Bassline (sawtooth/square waves)
    const notes = [130.81, 155.56, 130.81, 103.83]; // C3, Eb3, C3, Ab2
    let step = 0;
    
    themeInterval = setInterval(() => {
      if (ctx.state === 'suspended') return;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.value = notes[step % notes.length];
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      // Filter for a more "bass" sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
      
      currentThemeOscillators.push(oscillator);
      step++;
    }, 400);
  }
};

export const stopTheme = () => {
  if (themeInterval) {
    clearInterval(themeInterval);
    themeInterval = null;
  }
  currentThemeOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch(e) {}
  });
  currentThemeOscillators = [];
};
