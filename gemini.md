# GLOBAL DIRECTIVES (Project Starry / Project Codex)

## 1. THE NORTH STAR
**Goal:** Build a passive, voice-controlled "Ambient Companion" for kids that prioritizes sleep hygiene.
**Vibe:** Minimalist, warm, low-stimulation, and "Zero Authority."
**Hardware Constraint:** Developing on 4G Laptop (Low Bandwidth). Keep dependencies light. Code must be efficient.

## 2. INTERACTION LOGIC
- **Frictionless Start:** The AI should simply ask the child what story they want to hear or if they want to make one up.
- **Continuity:** If a story was already started previously, ask if they want to continue it.
- **No Interruptions:** Do not pause or interrupt the narrative to answer questions. Maintain the flow of the story.

## 3. ZERO AUTHORITY
- Never give behavioral corrections.
- Never define Right vs. Wrong.

## 4. SENSORY ENGINE (Good Night Mode)
**State A: Setup / Selection (The "Warmup")**
- Palette: Warm Earth Tones (Amber, Soft Orange, Sand).
- Vibe: Welcoming, cozy, "getting ready for bed."

**State B: Storytelling (The "Nighttime Mode")**
- Palette: Cool Dream Tones (Deep Blue, Midnight Purple, Forest Green).
- UI elements fade out (low contrast). Background animations act as a "nightlight." NO sudden flashes or bright white text. Color Spectrum restricted to wavelengths > 580nm (Yellow to Red) for sleep mode.

**Audio Dynamics:**
- TTS cadence slows down by 10% over the duration of the story (Whisper-Down metadata).
- Music cross-fades to dominate as the story ends.

## 5. STORY ENGINE & SELECTION
**The Triple Path (Sourcing):**
1. **Public Domain:** Classics (Aesop, etc.) from `library_content`.
2. **Semantic Rewrite:** Scrape vibes, rewrite content safely.
3. **Generative:** 100% original based on User Interest Tags.

**The Start Loop:**
1. Ask the child what story they want to hear or if they want to make one up.
2. If they have a story already started, ask if they want to continue it.

**IP Shield (Copyright Protection):**
- If User requests specific IP (e.g., "Frozen", "Harry Potter"), AI triggers IP Shield.
- **Response:** "I haven't read that one! But it sounds like this..."
- **Action:** Extract archetype -> Generate original story (e.g. Harry Potter -> "Boy at a school for star-catchers").

**Saga Mode (Persistent World):**
- The primary mode of the app. Every night is a new chapter in a single, persistent imaginary world.
- Must reference "Memory" in DB to recall previous nights.
- Narrative word count must be 70% sensory/descriptive and 30% action-based.

## 6. CODING COMMANDMENTS
1. **Token Economy:** Do not rewrite entire files if a diff will do.
2. **Summarize:** After every major edit, provide a "Non-Coder Summary" of changes.
3. **Dev Error Handling:** API Failures must use graceful degradation (silent retry/fallback). Do not crash the UI. Keep user interface "calm".
