# 📖 SOP — Standard Operating Procedures
# Unicorn Island / Debbie's Game

> **All agents read this before touching code.** These are the rules of the road.

---

## 1. Before You Start Any Task
## 2. Code Standards
- Use functional components and hooks.
- Prefer Tailwind CSS for styling.
- **Multi-Level Scalability**: When adding game modes, always implement a level-based progression with dynamic scenery (`bgThemes`) to maintain engagement.
- All new levels must include ambient decorative elements (`motion.div` floating effects) to feel "alive".
## 3. Audio Guidelines
## 4. Supabase & Persistence
- All DB operations through the Supabase JS client.
- **🔴 CAUTION**: Always verify `TypeError: Failed to fetch` scenarios in production. Ensure environment variables are mirrored from `.env.local` to Vercel/CI.

---

## 5. Deployment Workflow
1. Commit to `master` (triggers Vercel build).
2. GitHub CI runs automatically on PRs.
3. **SMOKE TEST**: Always verify the Parent Dashboard and Achievements on the live site after deployment.

---

## 6. Skills Available
## 7. Quality Bar
Every PR/task must:
- [ ] **Data Integrity**: Verify that score upserts are actually reaching the database in the target environment.
- [ ] Work perfectly on mobile touch screens.
- [ ] Have zero console errors.

---

## Last Updated
2026-04-19
