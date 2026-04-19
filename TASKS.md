# Tasks: Unicorn Island (Master Checklist)

## ✅ Project Foundations
- [x] Copy `.agent/` structure from skillskit (2026-03-23)
- [x] Run `/SET_UP` workflow and create directives (2026-03-23)
- [x] Initialize git repository (2026-03-23)
- [x] Create README.md, NORTH_STAR.md, PDD.md, PFD.md, SOP.md (2026-04-04)
- [x] Install initial project skills into `.agents/skills/` (2026-04-04)
- [x] Create .agents/AGENT_CONTEXT.md (2026-04-04)
- [x] Populate knowledge-base/LEARNED_SOLUTIONS.md (2026-04-04)

## 🏗 Phase 1: Environment & Tooling
- [x] **TASK-00**: Update internal SOPs/Context with the "Status Update" rule.
- [x] **TASK-01**: Copy the 20 Aesthetic Skills from Desktop to `.agents/skills/`.
- [x] **TASK-02**: Setup Stitch MCP with API Key (2026-04-05)
- [x] **TASK-03**: Generate `DESIGN.md` in Stitch (Debbie, Bubba, Milo, Luna).

## 🎨 Phase 2: Design Foundation & Visual Polish
- [x] **TASK-04**: Update `themes.js` and `index.css` with the new design system from `DESIGN.md`. (Done: 2026-04-05)
- [x] **TASK-05**: Implement premium typography (Outfit/Inter) and glassmorphic UI base. (Done: 2026-04-05)
- [x] **TASK-06**: Generate high-fidelity Character assets via `fal-generate`.
- [x] **TASK-07**: Implement entrance/exit transitions with Framer Motion. (Weightless wrappers added)
- [x] **TASK-08**: Add micro-interactions and hover effects with `animejs-animation`.
- [x] **TASK-09**: Implement background art assets per theme. (Unicorn & Bubba generated; Milo & Luna skipped due to API quota exhaustion).

## 🔊 Phase 3: Audio Transformation
- [x] **TASK-10**: Source high-quality audio assets (Kenney UI Audio pack for SFX, OpenGameArt for thematic BGM loops).
- [x] **TASK-11**: Refactor `src/audio/soundEngine.js` to use `Howler.js` for sprite-based SFX and seamless music cross-fading. (Deprecated in Phase 6)
- [x] **TASK-20**: **Procedural Audio Engine** — Completely replaced Howler with custom Web Audio API synth (2026-04-19).

## 🎮 Phase 4: Core Gameplay & Content
- [x] Counting Level, Spelling Level, Popping Level (2026-04-05)
- [x] Achievements & Parent Dashboard (2026-04-05)
- [x] **TASK-12**: Change difficulty increase from every 10 → every 5 levels.
- [x] **TASK-13**: Expand spelling word list to 60+ words (5 & 6 letter tiers).
- [x] **TASK-14**: Build AvatarPicker.jsx with the new 4 mascot characters.
- [x] **TASK-15**: Build PatternPath.jsx (logic/sequencing level).
- [x] **TASK-16**: Build MemoryMeadow.jsx (match-2 level).

## 💾 Phase 5: Persistence & Deployment
- [x] Supabase integration (profiles, RLS, offline-first) (2026-04-05)
- [x] **TASK-17**: PWA manifest + Service Worker for offline play. (Done: 2026-04-19)
- [x] **TASK-18**: GitHub Actions CI pipeline (lint + build on PR). (Done: 2026-04-19)
- [x] **TASK-19**: Final Production Deploy & Smoke Test. (Done: 2026-04-19)

## 💎 Phase 6: UX Polish & Live Operations
- [x] **TASK-21**: Fix Achievements page visibility (Framer Motion).
- [x] **TASK-22**: Mobile Responsive Scroll & Grid Audit.
- [x] **TASK-23**: Parent Dashboard Data Fallback.
- [x] **TASK-24**: Audio Toggle & Resume Interaction.

---
*Updated: 2026-04-19. Production Live on Vercel.*
