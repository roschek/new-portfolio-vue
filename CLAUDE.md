# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview production build locally
npm test         # Vitest (lecture translator logic)
npm run test:coverage  # coverage, 70% threshold on src/translate/services + composables
```

No linting is configured.

## Architecture

Vue 3 + Vite SPA portfolio site, deployed on Vercel. No TypeScript — plain JS throughout.

**Entry point:** `src/main.js` mounts the app with vue-router.

**Layout:** All pages render inside `src/layouts/DefaultLayout.vue`, which owns the sticky header, mobile hamburger menu, floating contact button, and footer. Nav links are defined as a data array directly in that component — add new routes there when adding pages.

**Routing:** `src/router/index.js` — routes map to page components in `src/pages/`. Vercel is configured with a catch-all SPA rewrite (`vercel.json`).

**Theme system:** Dark-first (#0F172A background). `src/composables/useTheme.js` holds the reactive state (persisted to `localStorage`); `src/store/theme.js` re-exports it as `useThemeStore`. Components import from the store, not directly from the composable. The `layout--light` CSS class is toggled on the root `.layout` element to switch themes.

**CSS conventions:** BEM naming (`block__element--modifier`) used throughout. Styles are `scoped` per component. Global resets and typography live in `src/assets/main.css`.

**Key third-party integrations:**
- `vanta` + `three` — animated wave background on `HomePage.vue`, initialized in `onMounted` and destroyed in `onBeforeUnmount`
- Telegram Login Widget + serverless auth — `TelegramPage.vue` embeds the official Telegram widget; `api/telegram-auth.js` is a Vercel serverless function that validates the HMAC and sends a welcome message via the Bot API. Requires `TELEGRAM_BOT_TOKEN` env var in Vercel.

**Interactive components in CodeLab (`/codelab`):**
- `AlgorithmVisualiser.vue` — animated sorting algorithm visualizer
- `ThreeModelViewer.vue` — Three.js 3D model viewer

**Lecture translator PWA (`/translate/`):** self-contained in `src/translate/`, lazy-loaded, rendered without `DefaultLayout` (`meta.bare` in the router, checked in `App.vue`). Users bring their own API keys (Soniox for speech + translation; Gemini/Anthropic/OpenAI for summaries), stored only in `localStorage`/`sessionStorage`; lectures go to IndexedDB. `useLiveSession` is a shared singleton so changing screens does not stop a recording. The service worker (`vite-plugin-pwa`) is scoped to `/translate/` and the manifest (`public/translate/manifest.webmanifest`) is linked at runtime by `src/translate/pwa.js`, so the rest of the site is not installable. Spec: `docs/superpowers/specs/2026-11-05-lecture-translator-pwa-design.md`.
