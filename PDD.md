# 📋 PDD — Product Design Document
# Unicorn Island / Debbie's Game

> **Read NORTH_STAR.md first.** This document defines what we are building.

---

## 1. Game Modes

### 🔢 Math Mode — "Numbers Base"

**Counting (Levels 1–10):**
- Levels 1–2: Count items 1–5
- Levels 3–4: Count items 1–10
- Levels 5–6: Count items 1–15
- Levels 7–10: Count items 1–20

**Addition (Levels 11+):**
- Show two groups of items visually
- Player selects correct sum from 3 choices
- Answers must NOT overflow off-screen (layout audit required)
- Addends scale with level tier

---

### 🔤 Spelling Mode — "Spelling Quest"

**Level Structure:**
- Levels 1–5: 3-letter words, word shown + spoken
- Levels 6–10: 4-letter words, word shown + spoken
- Levels 11–15: 3-letter words, hint only (no word displayed)
- Levels 16–20: 4-letter words, hint only
- Levels 21–25: 5-letter words
- Levels 26–30: 6-letter words

---

### 🎉 Popping Level (Every 5 levels)

- Full-screen burst of floating emoji/item objects
- Player taps/clicks to pop them as fast as possible
- 15-second countdown timer
- Score displayed: "You popped X items!"

---

### 🧩 Pattern Path (Logic/Sequencing)

- **Mechanic**: Complete patterns (e.g., Red-Blue-Red-?) to verify the next step in a magical bridge.
- **Complexity**: Scales from simple ABAB to more complex patterns (ABCABC, AABB).
- **Visuals**: Uses the theme-specific mascot and success sparkles.

---

### 🌸 Memory Meadow (Concentration)

- **Mechanic**: Match-2 cards featuring emojis/items.
- **Grid**: 3x4 grid for early levels.
- **Visuals**: 3D card-flip animations with success particle effects.

---

## 2. Profile System

### Profile Screen / Avatar Picker
- Name input (free text)
- Avatar picker: grid of 4 core character mascots (Debbie, Bubba, Milo, Luna).
- **Mobile Optimized**: 2-column scrollable grid for all devices.
- Theme auto-selected by mascot selection.
- Profiles stored in Supabase with localStorage backup.

---

## 3. Memory / Persistence

- All progress saved to Supabase after each level.
- Local storage used as fallback for Parent Dashboard to ensure immediate feedback.
- High scores and level tracking enabled per game mode.

---

## 4. Sound Design

| Action | Sound |
|--------|-------|
| Correct answer | Cheerful chime (Synthesized) |
| Wrong answer | Soft descending tone (Synthesized) |
| Letter placed | Satisfying click/pop |
| Item popped | Procedural pop/burst |
| Background music | Looping chiptune themes per character |

-> **Audio Engine**: Powered by **Web Audio API** (Custom procedural synth). 0-byte asset footprint, fully offline compatible, high-fidelity gaming tones.

---

## 5. Visual Design

- **Typography**: Outfit / Inter (Premium Fonts)
- **Cards**: Glassmorphism with backdrop blur
- **Animations**: Framer Motion (Stable & Responsive)
- **Mobile**: Fully responsive layouts with touch-optimized targets.

---

## 6. Future Roadmap (Backlog)

### ✨ Engagement & Meta-Game
- **Island/Kingdom Customization**: Earn "Magic Dust" to buy decorations.
- **Interactive Mascots**: Mascots react to mouse hover with procedural tones.

---

## Last Updated
2026-04-19 (Production Release)
