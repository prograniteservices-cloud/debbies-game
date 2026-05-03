# Debbie's Game / Unicorn Island - Agent Instructions

## Source Of Truth
- The root Vite app is the active Debbie's Game product and deploy target.
- Read `docs/NORTH_STAR.md`, `docs/PDD.md`, `docs/PFD.md`, and `docs/SOP.md` before product or code changes.
- `gemini.md` contains the active global directives for this repository.
- `games-app/` is a nested experimental Next app and is not part of the main deploy path unless explicitly revived.
- `C:\Users\heath\Desktop\Projects\Nighttime Companion` is a separate Starry/Nighttime Companion project. Do not apply its sleep, story, or ambient-companion rules here.

## Active Product Rules
- Build for young children ages 4-8 with a joyful educational game experience.
- Primary modes include math, spelling, music/color, animal hunt, art studio, profiles, achievements, and the parent dashboard.
- Difficulty increases every 5 levels. Every 5th level is a special popping/decompression level.
- Use vibrant, playful visuals; satisfying sound effects; clear progress; and mobile/touch-friendly interactions.
- Persist Debbie's Game data through Supabase `profiles` and `scores`, with localStorage fallback where the app already supports it.
- Existing Starry/Nighttime Companion migrations are historical/separate unless intentionally migrated later.
- Spelling Quest uses generated Google TTS audio for words, hints, and coaching. Do not use native browser TTS.
- Spelling Quest v1 targets 60 levels; future work should expand the curriculum beyond 60.
- Keep Spelling Quest v1 in React/Framer, but Phaser is an attractive future upgrade path if the spelling game becomes more engine-like.

## Skills State
- Active repo workflow skill: `.agents/skills/using-superpowers/SKILL.md`.
- Starry-specific skills are retained only as inactive references for the separate Nighttime Companion project:
  - `.agents/skills/sensory-engine/SKILL.md`
  - `.agents/skills/story-engine/SKILL.md`
  - `.agents/skills/ip-shield/SKILL.md`
  - `.agents/skills/saga-mode/SKILL.md`
- `.agents/skills/Pulling Updates from Skills Repository/SKILL.md` is for skills maintenance only.
- Broken ecosystem skill junctions are quarantined under `.agents/skills-quarantine/` and should not be treated as installed skills.

## File Structure
- `.agents/skills/` - Real local skill folders only.
- `.agents/skills-quarantine/` - Broken/unavailable ecosystem skill junctions.
- `docs/` - Product design, features, North Star, and SOP.
- `src/` - Active Vite/React application.
- `supabase/migrations/` - Database history; do not delete migrations during setup cleanup.
- `PROJECT_STATUS.md` - Live milestone tracking.
- `HANDOFF.md` - Session state and context transfer.

## Working Commands
- Install dependencies with `npm ci`.
- Run the development server with `npm run dev`.
- Validate source/config changes with `npm run lint` and `npm run build`.
- Use `npm.cmd` instead of `npm` in PowerShell if script execution policy blocks `npm.ps1`.
