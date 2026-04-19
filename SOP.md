# 📖 SOP — Standard Operating Procedures
# Unicorn Island / Debbie's Game

> **All agents read this before touching code.** These are the rules of the road.

---

## 1. Before You Start Any Task

1. Read **NORTH_STAR.md** — understand the vision
2. Read **PDD.md** — understand what we're building
3. Read **PFD.md** — check feature status and don't duplicate work
4. Check **TASKS.md** — pick up from where we left off
5. Check **knowledge-base/LEARNED_SOLUTIONS.md** — avoid known pitfalls

---

## 2. Code Standards

### React / JavaScript
- Use functional components with hooks
- Never use class components
- Use `useCallback` and `useMemo` for performance-sensitive code
- Prefer named exports for components
- Keep components under 200 lines; extract sub-components if larger

### Styling
- Use Tailwind CSS for all styling
- No inline `style={{}}` except for dynamic values (transforms, colors from data)
- Follow the existing theme system in `src/themes.js`
- Always support dark mode via `dark:` variants

### File Structure
```
src/
  components/       # React components
  hooks/            # Custom hooks
  utils/            # Helpers, constants
  audio/            # Sound system
  context/          # React context providers
  themes.js         # Theme definitions
  App.jsx           # Root component
```

### Naming
- Components: PascalCase (`SpellingGame.jsx`)
- Hooks: camelCase starting with `use` (`useGameState.js`)
- Utils: camelCase (`generateChoices.js`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_LEVEL`)

---

## 3. Audio Guidelines

- Use **Howler.js** for all sound effects and background music.
- **Asset Pipeline**: Source premium CC0 assets from **Kenney UI Audio** (SFX) and **OpenGameArt** (BGM).
- **Note**: `fal-audio` is unavailable. Do NOT use it for generation.
- All audio requires user interaction first (browser requirement).
- Sounds load from `/public/assets/sounds/` (`sfx/`, `music/`).
- Always provide a mute/volume toggle in the UI.
- Never autoplay audio before user interaction.

---

## 4. Supabase Guidelines

- All DB operations through the Supabase JS client (`@supabase/supabase-js`)
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- NEVER expose service role key to frontend
- Use Row Level Security (RLS) on all tables
- Always handle loading and error states

---

## 5. Git Workflow

- Branch from `main` for each feature: `feature/[task-name]`
- Commit messages: `[type]: [description]` (feat, fix, chore, docs, style)
- Never commit to `main` directly
- PR before merging

---

## 6. Agent Task Guidelines

- **Each agent task should be completable in one focused session**
- After EVERY task is complete (not subtask), update TASKS.md immediately so the project's current status is known.
- Agents should update `TASKS.md` upon completion
- Agents should add any gotchas to `knowledge-base/LEARNED_SOLUTIONS.md`
- Do NOT refactor unrelated code while completing a task
- Test your changes; don't leave broken states

---

## 7. Skills Available

| Skill | Purpose |
|-------|---------|
| `game-development` | Game loop, patterns, design principles |
| `game-development/web-games` | Browser-specific game dev |
| `game-development/game-audio` | Sound design, music integration |
| `game-development/game-art` | Visual style, asset pipeline |
| `game-development/game-design` | Difficulty, balancing, player psychology |
| `ui-ux-pro-max` | Design system, color, typography, UX |
| `supabase-automation` | DB queries, schema, auth |
| `vercel-deployment` | Deploy, env vars, edge functions |
| `react-best-practices` | Performance, patterns, optimization |
| `animejs-animation` | Complex animations and timelines |
| `magic-animator` | AI-powered motion and UI animations |
| `nextjs-supabase-auth` | Auth patterns with Supabase |
| `github` | PR workflows, CI/CD |

---

## 8. Quality Bar

Every PR/task must:
- [ ] Not break existing functionality
- [ ] Work on mobile / touch screens
- [ ] Include sound feedback for interactions
- [ ] Follow the theme system
- [ ] Have no console errors
- [ ] Be visually polished (no placeholder UI)

---

## Last Updated
2026-04-19
