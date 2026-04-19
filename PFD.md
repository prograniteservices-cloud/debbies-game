# 🧩 PFD — Project Feature Document
# Unicorn Island / Debbie's Game

> **Read NORTH_STAR.md and PDD.md first.** This document tracks features by completion status.

---

## Feature Registry

### ✅ Completed

| Feature | Notes |
|---------|-------|
| Core game engine (React/Vite) | Functional |
| Math — Counting levels 1–20 | Working |
| Math — Addition mode (levels 11+) | Working but layout bug with answers cut off |
| Spelling — Drag & drop mechanic | Working |
| Spelling — Click-to-place mechanic | Working |
| Spelling — 72-word list (3 to 6 letters) | Implemented (Task-13) |
| TTS word/hint reading | Working |
| Level-up color theme system | Working |
| Unicorn theme | Complete |
| Werecat theme | Complete |
| Cursor sparkles | Working |
| Framer Motion animations | Basic |
| Summary screen between levels | Working |
| **Difficulty every 5 levels** | Working (Task-12) |
| **Popping Level (every 5 levels)** | Working (Task-06) |
| **Sound system (Howler.js)** | Working with Kenney SFX (Task-11) |
| **Profile Screen (Avatar Picker)** | Working with all 4 mascots (Task-14) |
| **Supabase persistence** | Fully connected and synced (Task-17) |
| **Pattern Path mode** | Sequencing gameplay functional (Task-15) |
| **Memory Meadow mode** | Match-2 gameplay functional (Task-16) |

---

### 🚧 In Progress / Planned

| Feature | Priority | Sprint | Notes |
|---------|----------|--------|-------|
| **Fix: Math answer buttons cut off screen** | CRITICAL | 1 | |
| **PWA manifest + Service Worker** | HIGH | 5 | For offline play |
| **GitHub CI/CD pipeline** | MEDIUM | 5 | |
| **More math levels (21–50)** | MEDIUM | 3 | |
| **Enhanced animations (Anime.js)** | MEDIUM | 4 | |
| **Vercel deployment** | HIGH | 3 | |
| **Visual overhaul (premium look)** | MEDIUM | 4 | |
| **Subtraction mode** | LOW | 5 | |

---

## Milestone Map

```
Sprint 1 (Fixes + Core Design):
  [x] Fix math answer overflow bug (Partially done, needs audit)
  [x] Difficulty increases every 5 levels
  [x] Popping Level mechanic
  [x] Extended spelling word list (3/4 letter expansion)

Sprint 2 (Sound + Profiles):
  [x] Sound system (Howler.js + Kenney SFX)
  [x] Profile creation screen (name + avatar picker)
  [x] Profile select on landing page
  [x] Support for 4 mascots (Debbie, Bubba, Milo, Luna)

Sprint 3 (Memory + Deployment):
  [x] Supabase schema + tables
  [x] Save/load profile progress
  [x] Backend Recovery (Unpaused & Linked)
  [ ] Vercel production deployment pipeline
  [ ] GitHub Actions CI

Sprint 4 (Polish + Animation):
  [ ] Anime.js enhanced animations (Current focus)
  [ ] Visual overhaul with premium design
  [ ] Lottie animations for mascots
  [ ] Responsive/tablet optimization

Sprint 5 (Extended Content):
  [x] 5–6 letter words
  [ ] Subtraction game mode
  [ ] Achievement badges

Sprint 6 (Future Game Modes):
  [x] Pattern Path (sequencing) mode
  [x] Memory Meadow (match-2) mode
  [ ] Telling Time travelers (clock) mode
  [ ] Interactive Mascot idle/hover animations
```

---

## Last Updated
2026-04-19
