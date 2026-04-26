# 📋 PDD — Product Design Document
# Unicorn Island / Debbie's Game

> **Read NORTH_STAR.md first.** This document defines what we are building.

---

## 1. Game Modes

### 🔢 Math Mode — "Numbers Base"
### 🔤 Spelling Mode — "Spelling Quest"
### 🎉 Popping Level (Every 5 levels)
### 🧩 Pattern Path (Logic/Sequencing)
- **Levels**: 10 levels of increasing complexity.
- **Progression**: Simple ABAB -> ABCABC -> Palindromes -> Growing sequences.
- **Dynamic Scenery**: Backgrounds and ambient decorations change based on level.

### 🌸 Memory Meadow (Concentration)
- **Levels**: 5 levels with increasing difficulty.
- **Grid Size**: 2x2 -> 2x3 -> 3x4 -> 4x4 -> 4x5.
- **Thematic Sets**: Fruits, Animals, Space, Nature, Sweets.

---

## 2. Profile System
- **Mobile Optimized**: 2-column scrollable grid for all devices.
- **Persistence**: Profiles stored in Supabase with localStorage backup.

---

## 3. Memory / Persistence

- All progress saved to Supabase after each level.
- **🔴 KNOWN ISSUE (PROD)**: Supabase connectivity is currently unstable in the Vercel production environment, causing `Failed to fetch` errors on the Dashboard and failures in achievement recording.
- Local storage used as fallback for Parent Dashboard.

---

## 4. Sound Design
- **Audio Engine**: Powered by **Web Audio API** (Custom procedural synth).

---

## 5. Visual Design
- **Animations**: Framer Motion (Stable & Responsive)
- **Mobile**: Fully responsive layouts.

---

## 6. Future Roadmap (Backlog)
### ✨ Engagement & Meta-Game
### 👨‍👩‍👧 Parent & Social

---

## Last Updated
2026-04-19 (Post-Launch Regression Update)
