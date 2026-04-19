// src/audio/soundEngine.js
import { Howl } from 'howler';

// Using individual files instead of sprite for now, as sprite generation requires external tools.
// The Kenney UI Audio pack wav files are used as placeholders.
const sfx = {
  pop: new Howl({ src: ['/assets/audio/pop.wav'], volume: 0.8 }),
  ding: new Howl({ src: ['/assets/audio/ding.wav'], volume: 0.8 }),
  fail: new Howl({ src: ['/assets/audio/fail.wav'], volume: 0.6 }),
  sparkle: new Howl({ src: ['/assets/audio/sparkle.wav'], volume: 0.7 })
};

export const playSound = (type) => {
  if (sfx[type]) {
    sfx[type].play();
  } else {
    console.warn(`Sound type '${type}' not found.`);
  }
};

const themes = {
  unicorn: new Howl({ src: ['/assets/audio/bgm_unicorn.wav'], loop: true, volume: 0 }),
  werecat: new Howl({ src: ['/assets/audio/bgm_werecat.wav'], loop: true, volume: 0 })
};

let currentThemeId = null;

export const playTheme = (themeId) => {
  if (currentThemeId === themeId) return; // Already playing

  // Fade out current theme
  if (currentThemeId && themes[currentThemeId]) {
    const prevTheme = themes[currentThemeId];
    prevTheme.fade(prevTheme.volume(), 0, 1000);
    setTimeout(() => prevTheme.stop(), 1000);
  }

  // Play and fade in new theme
  if (themes[themeId]) {
    const newTheme = themes[themeId];
    newTheme.play();
    newTheme.fade(0, 0.5, 1000); // Fade to 50% volume
    currentThemeId = themeId;
  }
};

export const stopTheme = () => {
  if (currentThemeId && themes[currentThemeId]) {
    const activeTheme = themes[currentThemeId];
    activeTheme.fade(activeTheme.volume(), 0, 500);
    setTimeout(() => {
      activeTheme.stop();
      // Ensure volume is reset for next play if needed
      activeTheme.volume(0); 
    }, 500);
    currentThemeId = null;
  }
};
