# Tasks: Unicorn Island

## Technical Checklist

### ✅ Initialization
- [x] Copy `.agent/` structure from skillskit (2026-03-23)
- [x] Run `/SET_UP` workflow and create directives (2026-03-23)
- [x] Initialize git repository (2026-03-23)
- [x] Create README.md (2026-03-23)
- [x] Create NORTH_STAR.md, PDD.md, PFD.md, SOP.md (2026-04-04)
- [x] Install project skills into `.agents/skills/` (2026-04-04)
- [x] Create .agents/AGENT_CONTEXT.md (2026-04-04)
- [x] Populate knowledge-base/LEARNED_SOLUTIONS.md (2026-04-04)

### 🏗 Phase 1: Scaffolding
- [x] Create source code directory structure (2026-03-23)
- [x] Initialize Vite / React project in `src/` (2026-03-23)
- [x] Configure Supabase CLI (2026-04-05)
- [x] Setup Vercel Deployment (2026-04-05)

### 🎮 Phase 2: Core Gameplay (existing)
- [x] Click-driven interactive base (2026-03-23)
- [x] First Counting Level (2026-03-23)
- [x] First Spelling Level (2026-04-05)
- [x] Achievements & Parent Dashboard (2026-04-05)
- [/] Visual Polish & Animations (2026-04-05)
- [ ] Rewards and Color Themes
- [x] Addition module for levels > 10 (2026-03-23)
- [x] 3-4 letter word spelling (drag & drop) (2026-03-23)
- [x] TTS clue reading (2026-03-23)
- [x] 20-word spelling list (2026-03-23)
- [x] Unicorn asset CSS fix (mixBlendMode) (2026-03-23)

### 🐛 Sprint 1: Bug Fixes + Difficulty Rebalance + Content
- [x] **TASK-01**: Fix math answer buttons cut off at bottom of screen (CountingLevel.jsx layout) (2026-04-04)
- [ ] **TASK-02**: Change difficulty increase from every 10 → every 5 levels (App.jsx + CountingLevel.jsx)
- [ ] **TASK-03**: Expand spelling word list to 60+ words, add 5-letter and 6-letter tiers
- [x] **TASK-04**: Build PoppingLevel.jsx — tap-to-pop fun level that triggers every 5 levels (2026-04-05)
- [x] **TASK-05**: Wire PoppingLevel into App.jsx game state machine (2026-04-05)

### 🔊 Sprint 2: Sound System + Profile System
- [x] **TASK-06**: Install Howler.js, create src/audio/soundEngine.js with all SFX + BGM (2026-04-05)
- [ ] **TASK-07**: Generate all audio assets (SFX: correct, wrong, levelup, pop, letter_place, click; BGM: unicorn, werecat)
- [x] **TASK-08**: Wire sound engine into CountingLevel, SpellingGame, PoppingLevel, App (2026-04-05)
- [x] **TASK-09**: Build ProfileScreen.jsx (profile cards, add button, avatar picker) (2026-04-05)
- [ ] **TASK-10**: Build AvatarPicker.jsx (12 avatar options, grouped by theme)
- [x] **TASK-11**: Generate avatar image assets (Initial avatars done: 2026-04-05)
- [x] **TASK-12**: Wire profiles into App.jsx as first screen (2026-04-05)

### 💾 Sprint 3: Supabase Memory
- [x] **TASK-13**: Select/confirm Supabase project, get URL + anon key (2026-04-05)
- [x] **TASK-14**: Install @supabase/supabase-js, create src/utils/supabase.js (2026-04-05)
- [x] **TASK-15**: Run SQL migration to create `profiles` table with RLS (2026-04-05)
- [x] **TASK-16**: Build src/hooks/useProfile.js (CRUD, offline-first with localStorage cache) (2026-04-05)
- [x] **TASK-17**: Wire useProfile into ProfileScreen and game components (2026-04-05)
- [x] **TASK-18**: Deploy to Vercel with env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) (2026-04-05)

### ✨ Sprint 4: Visual + Animation Polish
- [x] **TASK-19**: Overhaul index.css — premium fonts (Nunito/Fredoka One), CSS custom props (2026-04-05)
- [x] **TASK-20**: Install Anime.js, create src/utils/animeEffects.js with timeline helpers (2026-04-05)
- [x] **TASK-21**: Add achievement system (10 badges) — UI & logic done (2026-04-05)
- [x] **TASK-22**: Build ParentDashboard.jsx — profile stats, level progress, session history (2026-04-05)
- [x] **TASK-23**: Visual polish pass — Apply anime.js effects to CountingLevel and SpellingGame (2026-04-05)
- [/] **TASK-24**: Generate all mascot assets (4/8 done: Happy, Thinking)
- [ ] **TASK-25**: Background art assets per theme

### 📦 Sprint 5: Extended Content + Deployment
- [ ] **TASK-26**: 5 & 6 letter word tiers in SpellingGame
- [x] **TASK-27**: Math overhaul: NumberMagnet, TargetBlast, EquationBuilder modes added (2026-04-05)
- [ ] **TASK-28**: PWA manifest + service worker for offline/install
- [ ] **TASK-29**: GitHub Actions CI pipeline (lint + build on PR)
- [x] **TASK-30**: Final production deploy + smoke test (2026-04-05)

### 🗺 Sprint 6: Future Game Modes
- [ ] **TASK-31**: Build PatternPath.jsx (logic/sequencing)
- [ ] **TASK-32**: Build MemoryMeadow.jsx (match-2)
- [ ] **TASK-33**: Build TimeTravelers.jsx (clock face)
- [ ] **TASK-34**: Add mascot hover/idle animations with Anime.js

### 🏆 Sprint 7: Engagement & Analytics
- [ ] **TASK-35**: Implement Island/Kingdom Decoration system
- [ ] **TASK-36**: Implement Daily Sparkle Quests
- [ ] **TASK-37**: Build "Pass the Tablet" local co-op mode
- [ ] **TASK-38**: Implement PDF certificate generation in ParentDashboard

---
*Updated 2026-04-05 by Antigravity*
