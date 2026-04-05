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
| Spelling — 20-word list (3 & 4 letter) | Implemented |
| TTS word/hint reading | Working |
| Level-up color theme system | Working |
| Unicorn theme | Complete |
| Werecat theme | Complete |
| Cursor sparkles | Working |
| Framer Motion animations | Basic |
| Summary screen between levels | Working |

---

### 🚧 In Progress / Planned

| Feature | Priority | Sprint |
|---------|----------|--------|
| **Fix: Math answer buttons cut off screen** | CRITICAL | 1 |
| **Difficulty increase every 5 levels (not 10)** | HIGH | 1 |
| **Popping Level (every 5 levels)** | HIGH | 1 |
| **Sound system (SFX + background music)** | HIGH | 2 |
| **Profile system (create/select/name/avatar)** | HIGH | 2 |
| **Supabase persistence (save progress)** | HIGH | 3 |
| **More math levels (21–50)** | MEDIUM | 3 |
| **More spelling words (30+ per tier)** | MEDIUM | 1 |
| **5-letter & 6-letter words (levels 21–30)** | MEDIUM | 3 |
| **Enhanced animations (Anime.js)** | MEDIUM | 4 |
| **Avatar picker UI** | MEDIUM | 2 |
| **Vercel deployment** | HIGH | 3 |
| **GitHub CI/CD pipeline** | MEDIUM | 3 |
| **Visual overhaul (premium look)** | MEDIUM | 4 |
| **Subtraction mode** | LOW | 5 |

---

## Milestone Map

```
Sprint 1 (Fixes + Core Design):
  [x] Fix math answer overflow bug
  [x] Difficulty increases every 5 levels
  [x] Popping Level mechanic
  [x] Extended spelling word list (3/4 letter expansion)

Sprint 2 (Sound + Profiles):
  [ ] Sound system (SFX, background music, Howler.js)
  [ ] Profile creation screen (name + avatar picker)
  [ ] Profile select on landing page
  [ ] Debbie = girl profile, Bubba = boy profile

Sprint 3 (Memory + Deployment):
  [ ] Supabase schema + tables
  [ ] Save/load profile progress
  [ ] Vercel deployment pipeline
  [ ] GitHub Actions CI

Sprint 4 (Polish + Animation):
  [ ] Anime.js enhanced animations
  [ ] Visual overhaul with premium design
  [ ] Lottie animations for mascots
  [ ] Responsive/tablet optimization

Sprint 5 (Extended Content):
  [ ] 5–6 letter words
  [ ] Subtraction game mode
  [ ] Achievement badges
```

---

## Last Updated
2026-04-04
