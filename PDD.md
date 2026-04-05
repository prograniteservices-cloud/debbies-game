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
- Answers must NOT overflow off-screen (layout fix required)
- Addends scale with level tier

**Extended Math (Levels 21+) — Future:**
- Subtraction
- Simple multiplication

---

### 🔤 Spelling Mode — "Spelling Quest"

**Level Structure:**
- Levels 1–5: 3-letter words, word shown + spoken
- Levels 6–10: 4-letter words, word shown + spoken
- Levels 11–15: 3-letter words, hint only (no word displayed)
- Levels 16–20: 4-letter words, hint only
- Levels 21–25: 5-letter words (new)
- Levels 26–30: 6-letter words (new)

**Word List Requirements:**
- Minimum 30+ words per tier
- Child-friendly, age-appropriate vocabulary
- Diverse phonics coverage

**Mechanics:**
- Drag-and-drop OR click-to-place letter tiles
- Scrambled letter pool
- TTS (text-to-speech) reads word/hint aloud

---

### 🎉 Popping Level (Every 5 levels)

- Full-screen burst of floating emoji/item objects
- Player taps/clicks to pop them as fast as possible
- 15-second countdown timer
- Score displayed: "You popped X items!"
- Celebrates their speed and dexterity
- Transitions back to normal gameplay

---

## 2. Profile System

### Profile Creation
- Name input (free text)
- Avatar picker: grid of simple character illustrations (8–12 options)
- Theme auto-selected by avatar (girl avatars → Unicorn, boy avatars → Werecat, but user can override)
- Profiles stored in Supabase (linked to anonymous or authenticated session)

### Named Profiles
- **Debbie** → Default Girl profile, Unicorn Island theme
- **Bubba** → Default Boy profile, Werecat Kingdom theme
- Additional profiles can be created

### Profile Data Stored
```
profiles {
  id
  name
  avatar_id
  theme_id
  math_level
  math_score
  spelling_level
  spelling_score
  total_sessions
  created_at
  updated_at
}
```

---

## 3. Memory / Persistence

- All progress saved to Supabase after each level
- Per-game-mode level tracking (math level ≠ spelling level)
- Session statistics (correct answers, incorrect answers, time played)
- High scores per level
- Achievements / badges (future)

---

## 4. Sound Design

| Action | Sound |
|--------|-------|
| Correct answer | Cheerful chime + sparkle |
| Wrong answer | Soft boing (not punishing) |
| Level up | Fanfare + celebration |
| Letter placed | Satisfying click/pop |
| Item popped | Fun pop/burst |
| Background music | Looping cheerful ambient |
| Profile select | Magical whoosh |
| Button click | Soft tap |

---

## 5. Visual Design

- **Color system:** Per-theme, per-level rotating backgrounds
- **Typography:** Rounded, playful font (Nunito or Fredoka One)
- **Cards:** Glassmorphism with soft shadows
- **Animations:** Entrance animations, success bursts, particle effects
- **Mascots:** Visible in UI, animated bob/float

---

## 6. Future Roadmap (Backlog)

### 🎮 New Game Modes
- **Pattern Path (Logic/Sequencing):** Complete patterns (e.g., Red-Blue-Red-?) to build a magical bridge for the mascot. Uses Anime.js for bridge construction effects.
- **Memory Meadow (Concentration):** Match-2 cards where kids match digits (7) to visual quantities (7 stars).
- **Telling Time Travelers:** Interactive clock face where kids drag hands to match audio prompts (e.g., "Set the clock to 3 o'clock").

### ✨ Engagement & Meta-Game
- **Island/Kingdom Customization:** Earn "Magic Dust" or "Cat Coins" to buy decorations for the profile landing page. State persisted in Supabase.
- **Daily Sparkle Quests:** Small daily objectives (e.g., "Play 3 math rounds") that reward unique badges.
- **Interactive Mascots:** Mascots react to mouse hover and idle states (Anime.js/Lottie).

### 👨‍👩‍👧 Parent & Social
- **Co-op "Pass the Tablet" Mode:** Local turn-based mode for two kids to progress through a map together.
- **Printable Certificates:** Generate a beautiful PDF in the Parent Dashboard for major milestones (Level 25/50).

---

## Last Updated
2026-04-05
