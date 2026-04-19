import { Zap, Flame, Rocket, Shield, Star, Apple, Heart, Moon, Sun, Sparkles } from 'lucide-react';

// ─── THEME DEFINITIONS ────────────────────────────────────────────────────────
// ─── THEME DEFINITIONS ────────────────────────────────────────────────────────
export const THEMES = {
  unicorn: {
    id: 'unicorn',
    name: 'Debbie',
    tagline: 'Magical Learning Awaits! ✨',
    // Character Meta
    primaryColor: '#D8B4FE',
    glowClass: 'debbie-glow',
    // UI Elements
    cardBorder: 'border-purple-200 dark:border-purple-500/30',
    titleGradient: 'from-purple-400 via-pink-400 to-indigo-400',
    mathBtn: 'from-purple-500 to-indigo-600 border-purple-700',
    spellBtn: 'from-pink-400 to-purple-500 border-pink-600',
    // Backgrounds (cycle by level)
    bgThemes: [
      'from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-950',
      'from-fuchsia-100 via-rose-50 to-amber-50 dark:from-purple-950 dark:via-pink-900/20 dark:to-rose-950',
      'from-violet-100 via-fuchsia-50 to-pink-100 dark:from-indigo-950 dark:via-violet-900/20 dark:to-fuchsia-950',
    ],
    // Assets
    mascotImg: '/assets/characters/debbie_idle.png',
    mascotAlt: 'Debbie the Unicorn',
    rewardText: 'MAGICAL!',
    rewardGradient: 'from-purple-500 to-pink-500',
    // Math icon sets
    iconSets: [
      { icon: Heart, color: 'text-pink-500 fill-pink-500' },
      { icon: Star,  color: 'text-yellow-400 fill-yellow-400' },
      { icon: Sparkles, color: 'text-purple-400 fill-purple-300' },
    ],
  },

  werecat: {
    id: 'werecat',
    name: 'Bubba',
    tagline: 'Little Dragon, Big Adventures! 🐲',
    // Character Meta
    primaryColor: '#134E4A',
    glowClass: 'bubba-glow',
    // UI Elements
    cardBorder: 'border-teal-200 dark:border-teal-500/30',
    titleGradient: 'from-teal-600 via-emerald-500 to-lime-500',
    mathBtn: 'from-teal-600 to-emerald-700 border-teal-800',
    spellBtn: 'from-lime-500 to-teal-600 border-lime-700',
    // Backgrounds
    bgThemes: [
      'from-teal-50 via-emerald-50 to-slate-100 dark:from-slate-900 dark:via-teal-900/20 dark:to-emerald-950',
      'from-slate-100 via-teal-100 to-emerald-100 dark:from-slate-950 dark:via-teal-950 dark:to-emerald-950',
    ],
    // Assets
    mascotImg: '/assets/characters/bubba_idle.png',
    mascotAlt: 'Bubba the Dragon-Unicorn',
    rewardText: 'EPIC!',
    rewardGradient: 'from-teal-500 to-lime-500',
    iconSets: [
      { icon: Flame,  color: 'text-orange-500 fill-orange-400' },
      { icon: Shield, color: 'text-teal-600 fill-teal-500' },
      { icon: Zap,    color: 'text-yellow-500 fill-yellow-400' },
    ],
  },

  milo: {
    id: 'milo',
    name: 'Milo',
    tagline: 'Heroic Quests Start Here! ⚔️',
    primaryColor: '#1E3A8A',
    glowClass: 'milo-glow',
    cardBorder: 'border-blue-200 dark:border-blue-500/30',
    titleGradient: 'from-blue-600 via-indigo-500 to-azure-500',
    mathBtn: 'from-blue-600 to-indigo-700 border-blue-800',
    spellBtn: 'from-yellow-500 to-orange-600 border-yellow-700',
    bgThemes: [
      'from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-950',
    ],
    mascotImg: '/assets/characters/milo_idle.png',
    mascotAlt: 'Milo the Explorer',
    rewardText: 'HEROIC!',
    rewardGradient: 'from-blue-500 to-indigo-500',
    iconSets: [
      { icon: Rocket, color: 'text-blue-500 fill-blue-400' },
      { icon: Shield, color: 'text-slate-600 fill-slate-500' },
      { icon: Star,   color: 'text-yellow-500 fill-yellow-400' },
    ],
  },

  luna: {
    id: 'luna',
    name: 'Luna',
    tagline: 'The Stars are the Limit! 🌙',
    primaryColor: '#4C1D95',
    glowClass: 'luna-glow',
    cardBorder: 'border-indigo-200 dark:border-indigo-500/30',
    titleGradient: 'from-indigo-600 via-purple-500 to-pink-500',
    mathBtn: 'from-indigo-600 to-purple-700 border-indigo-800',
    spellBtn: 'from-purple-500 to-pink-600 border-purple-700',
    bgThemes: [
      'from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-purple-950',
    ],
    mascotImg: '/assets/characters/luna_idle.png',
    mascotAlt: 'Luna the Star-Gazer',
    rewardText: 'STELLAR!',
    rewardGradient: 'from-indigo-500 to-purple-500',
    iconSets: [
      { icon: Moon,  color: 'text-indigo-500 fill-indigo-400' },
      { icon: Star,  color: 'text-yellow-400 fill-yellow-300' },
      { icon: Sparkles, color: 'text-fuchsia-400 fill-fuchsia-300' },
    ],
  },
};

