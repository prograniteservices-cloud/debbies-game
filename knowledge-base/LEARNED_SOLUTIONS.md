# Known Issues & Solutions

## Issue: Math answer buttons cut off at bottom of screen
**Root cause:** When addition mode activates (level > 10), the item grids grow tall, pushing the answer button bar below the viewport.
**Solution:** The outer wrapper `div` must use `h-full overflow-hidden`. The content area between the header and footer must use `flex-1 min-h-0 overflow-y-auto`. The `min-h-0` is critical in flexbox to allow the child to shrink below its content height, preventing it from pushing the footer outside the parent's `overflow-hidden` bounds. Also reduced icon sizes in `ItemGrid.jsx` to ensure 30+ items fit better.

## Issue: Voices not loaded on first TTS call (Chrome)
**Root cause:** Chrome lazy-loads speech synthesis voices. `getVoices()` returns empty array on first call.
**Solution:** Listen to `voiceschanged` event and cache the result. Use a ref (`voicesReady`) to delay first speak by 400ms.

## Issue: Drag-and-drop fires click event after drag
**Root cause:** @dnd-kit fires both drag and click events on touch/mouse up.
**Solution:** Use `PointerSensor` with `activationConstraint: { distance: 5 }` so clicks (< 5px movement) don't start a drag.

## Issue: Multiple duplicate CountingLevel initializations
**Root cause:** Multiple `useEffect` with different hooks firing on re-render.
**Solution:** Only call `startNewRound()` on mount with `useEffect(() => {}, [])`. Subsequent rounds triggered explicitly by user action.

## Issue: Production build fails with `[MISSING_EXPORT] Error: "default" is not exported by animejs`
**Root cause:** AnimeJS v4 dropped the default export in its native ESM module. Vite's production bundler (Rolldown) adheres strictly to the ESM standard, whereas the dev server allows CommonJS fallbacks.
**Solution:** Do not use `import anime from 'animejs'`. Use named exports instead: `import { animate, stagger } from 'animejs'`. Replace instances of `anime({ ... })` with `animate({ ... })` and `anime.stagger` with `stagger`.