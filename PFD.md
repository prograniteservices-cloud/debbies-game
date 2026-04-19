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
| Math — Addition mode (levels 11+) | Working & Layout audited |
| Spelling — Drag & drop / Click-to-place | Working |
| Spelling — 72-word list | Task-13 complete |
| TTS word/hint reading | Working |
| Level-up color theme system | Working |
| Character Themes (All 4) | Complete (Debbie, Bubba, Milo, Luna) |
| **Synthesized Sound System** | Custom Web Audio API engine (No external files) |
| **Procedural BGM** | Unique chiptune loops for every mascot |
| **Profile Screen** | Mobile-responsive with scroll support |
| **Supabase persistence** | Fully connected with local fallback |
| **Pattern Path mode** | Sequencing gameplay functional |
| **Memory Meadow mode** | Match-2 gameplay functional |
| **PWA / Offline support** | `vite-plugin-pwa` integrated |
| **GitHub CI/CD** | Automated lint/build on PRs |
| **Vercel Deployment** | Production live at debbies-game.vercel.app |

---

### 🚧 In Progress / Planned

| Feature | Priority | Notes |
|---------|----------|-------|
| **Mascot Hover SFX** | MEDIUM | Interactive procedural tones |
| **Magic Dust Shop** | LOW | Meta-game for island decoration |
| **Subtraction mode** | LOW | |
| **Printable certificates**| LOW | PDF generation for milestones |

---

## Milestone Map

```
Milestone 1 (Foundations):
  [x] Core Engine & Math/Spelling Basics
  [x] Visual Themes & Mascots
  [x] Supabase Integration

Milestone 2 (Polish & Sound):
  [x] Rewritten Audio Engine (Web Audio API)
  [x] Mobile UX Audit & Responsive Fixes
  [x] Achievement System (Framer Motion)

Milestone 3 (Live Operations):
  [x] PWA Support (Offline play)
  [x] CI/CD Pipeline (GitHub Actions)
  [x] Production Deployment (Vercel)
```

---

## Last Updated
2026-04-19 (Live Deployment)
