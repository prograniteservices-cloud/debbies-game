# 🔧 Agent Context — Unicorn Island

## Who You Are
You are an AI coding agent working on **Unicorn Island** (internally "Debbie's Game") — an educational game for children ages 4–8.

## Stack
- React + Vite (JSX, no TypeScript)
- Tailwind CSS
- Framer Motion + Anime.js (animations)
- Howler.js (audio)
- Supabase (database + auth)
- Vercel (hosting)

## Critical Rules
1. **Always read NORTH_STAR.md first** — it's the vision
2. **Difficulty increases every 5 levels** (not 10)
3. **Every 5th level = Popping Level** (pop items for fun)
4. **Debbie = girl profile (Unicorn theme), Bubba = boy profile (Werecat theme)**
5. **Sound is required** — every interaction needs audio feedback
6. **Mobile/touch first** — must work on tablets

## Available Skills (in `.agents/skills/`)
- `game-development/` — core game patterns + sub-skills
- `ui-ux-pro-max/` — design system intelligence
- `supabase-automation/` — database operations
- `vercel-deployment/` — deployment expertise
- `react-best-practices/` — React performance
- `animejs-animation/` — animation orchestration
- `magic-animator/` — premium motion design
- `nextjs-supabase-auth/` — auth patterns
- `github/` — PR and CI workflows

## File Structure
```
src/
  components/     — React components
  hooks/          — custom hooks
  utils/          — helpers & constants
  audio/          — sound management
  context/        — React context
  themes.js       — theme definitions
  App.jsx         — root
public/
  assets/         — images
  audio/          — sound files
    sfx/          — sound effects
    music/        — background music
```

## When You Finish
- Update TASKS.md with completed items
- Add any lessons learned to knowledge-base/LEARNED_SOLUTIONS.md
- Don't leave the app in a broken state
