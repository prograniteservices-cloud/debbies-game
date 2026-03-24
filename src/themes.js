import { Zap, Flame, Rocket, Shield, Star, Apple, Heart, Moon, Sun } from 'lucide-react';

// ─── THEME DEFINITIONS ────────────────────────────────────────────────────────
export const THEMES = {
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn Island',
    tagline: 'Magical Learning Awaits! ✨',
    // Landing page
    cardBorder: 'border-pink-300 dark:border-pink-500',
    titleGradient: 'from-pink-500 via-purple-500 to-indigo-500',
    mathBtn: 'from-teal-400 to-emerald-500 border-teal-600',
    spellBtn: 'from-pink-400 to-purple-500 border-pink-600',
    // Backgrounds (cycle by level)
    bgThemes: [
      'from-sky-200 via-pink-100 to-indigo-200 dark:from-slate-900 dark:via-purple-900/40 dark:to-indigo-950',
      'from-fuchsia-200 via-rose-100 to-amber-100 dark:from-purple-900 dark:via-pink-900/40 dark:to-rose-950',
      'from-teal-200 via-emerald-100 to-cyan-200 dark:from-teal-900 dark:via-emerald-900/40 dark:to-cyan-950',
      'from-violet-300 via-fuchsia-200 to-pink-300 dark:from-indigo-900 dark:via-violet-900/40 dark:to-fuchsia-950',
      'from-amber-200 via-yellow-100 to-orange-200 dark:from-amber-900 dark:via-orange-900/40 dark:to-red-950',
    ],
    // Spelling game
    spellingBg: 'from-purple-200 to-indigo-300 dark:from-slate-800 dark:to-indigo-950',
    mascotImg: '/assets/unicorn_queen.png',
    mascotAlt: 'Unicorn Queen',
    rewardImg: '/assets/flying_unicorn_rainbow.png',
    rewardAlt: 'Flying Unicorn',
    rewardText: 'MAGICAL!',
    rewardGradient: 'from-pink-500 to-yellow-500',
    // Math icon sets
    iconSets: [
      { icon: Apple, color: 'text-red-500 fill-red-500' },
      { icon: Star,  color: 'text-yellow-400 fill-yellow-400' },
      { icon: Heart, color: 'text-pink-500 fill-pink-500' },
      { icon: Moon,  color: 'text-indigo-400 fill-indigo-200' },
      { icon: Sun,   color: 'text-orange-400 fill-yellow-200' },
    ],
    // Letter tile colors
    letterBorder: 'border-pink-400 dark:border-pink-600',
    letterGradient: 'from-purple-500 to-pink-500',
    selectedGradient: 'from-orange-500 to-yellow-600',
  },

  werecat: {
    id: 'werecat',
    name: 'Werecat Kingdom',
    tagline: 'Unleash Your Inner Warrior! ⚡',
    // Landing page
    cardBorder: 'border-orange-400 dark:border-orange-500',
    titleGradient: 'from-orange-400 via-amber-500 to-teal-400',
    mathBtn: 'from-teal-500 to-cyan-600 border-teal-700',
    spellBtn: 'from-orange-400 to-amber-500 border-orange-600',
    // Backgrounds (cycle by level)
    bgThemes: [
      'from-slate-700 via-teal-900 to-slate-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-950',
      'from-slate-800 via-orange-900 to-slate-900 dark:from-slate-950 dark:via-orange-950 dark:to-slate-950',
      'from-teal-800 via-slate-900 to-cyan-900 dark:from-teal-950 dark:via-slate-950 dark:to-cyan-950',
      'from-amber-800 via-orange-900 to-slate-900 dark:from-amber-950 dark:via-orange-950 dark:to-slate-950',
      'from-slate-800 via-teal-900 to-orange-900 dark:from-slate-950 dark:via-teal-950 dark:to-orange-950',
    ],
    // Spelling game
    spellingBg: 'from-slate-700 via-teal-900 to-slate-800 dark:from-slate-950 dark:via-teal-950 dark:to-slate-950',
    mascotImg: '/assets/werecat_king.png',
    mascotAlt: 'Werecat King',
    rewardImg: '/assets/flying_werecat_lightning.png',
    rewardAlt: 'Flying Werecat',
    rewardText: 'EPIC WIN!',
    rewardGradient: 'from-orange-400 to-teal-400',
    // Math icon sets — boy shapes (lightning, flame, rocket, shield, zap)
    iconSets: [
      { icon: Zap,    color: 'text-yellow-400 fill-yellow-300' },
      { icon: Flame,  color: 'text-orange-500 fill-orange-400' },
      { icon: Rocket, color: 'text-teal-400 fill-teal-300' },
      { icon: Shield, color: 'text-blue-400 fill-blue-300' },
      { icon: Star,   color: 'text-amber-400 fill-amber-300' },
    ],
    // Letter tile colors
    letterBorder: 'border-orange-400 dark:border-orange-500',
    letterGradient: 'from-orange-400 to-teal-400',
    selectedGradient: 'from-yellow-400 to-orange-500',
  },
};
