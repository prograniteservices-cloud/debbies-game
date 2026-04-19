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
- Use functional components with hooks.
- Use `useCallback` and `useMemo` for performance-sensitive code.
- Keep components focused; extract sub-components if logic grows complex.

### Styling
- Use Tailwind CSS.
- Follow the theme system in `src/themes.js`.
- Always support dark mode via `dark:` variants.
- **Mobile First**: Always test with 320px viewport width.

### File Structure
```
src/
  components/       # UI Components
  audio/            # Sound system (Web Audio API)
  utils/            # Math/Anime engines
  themes.js         # Design tokens
  App.jsx           # State coordinator
```

---

## 3. Audio Guidelines

- **Engine**: Use the custom **Web Audio API** synthesizer in `src/audio/soundEngine.js`.
- **Procedural**: Do NOT add large WAV/MP3 files to the repo unless explicitly requested. Prefer synthesized tones.
- **Auto-Resume**: Browser policies require `resumeAudio()` to be called on user interaction (handled in `App.jsx`).
- **Mute Toggle**: Respect the global mute state.

---

## 4. Supabase & Persistence

- All DB operations through the Supabase JS client.
- **Offline First**: Cache critical data in localStorage to avoid "No Profiles Found" states when offline or during slow sync.

---

## 5. Deployment Workflow

1. Commit to `master` (triggers Vercel build).
2. GitHub CI runs automatically on PRs.
3. Production link: `debbies-game.vercel.app`.

---

## 6. Skills Available

| Skill | Purpose |
|-------|---------|
| `game-development` | Core logic and balancing |
| `ui-ux-pro-max` | Visual polish and responsiveness |
| `supabase-automation` | Persistence and schema |
| `vercel-deployment` | Live ops and CI/CD |
| `animejs-animation` | Secondary micro-animations |
| `shader-programming-glsl`| Future background effects |

---

## 7. Quality Bar

Every PR/task must:
- [ ] Work perfectly on mobile touch screens.
- [ ] Be accessible (alt text, font sizing).
- [ ] Maintain the premium "glassmorphic" aesthetic.
- [ ] Have zero console errors.

---

## Last Updated
2026-04-19
