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

**Theme:** Dark editorial palette (`--bg: #0D0D0D`, accent `#FF6B35`) defined as CSS variables in `src/assets/main.css`. `src/composables/useTheme.js` / `src/store/theme.js` still exist but no component toggles a light theme any more.

**CSS conventions:** BEM naming (`block__element--modifier`) used throughout. Styles are `scoped` per component. Global resets and typography live in `src/assets/main.css`.

**Editorial style (all site pages):** shared primitives live in `src/assets/editorial.css` (global classes `.page`, `.section`, `.section--first`, `.section--talk`, `.label`, `.btn--primary/--ghost`, `.actions`, `.tags`, `.accent` for the italic Instrument Serif accent). Section headers use `src/components/SectionHead.vue` (`label`, optional `note`, `level`, slot for the title with `<em>` accent, `lead` slot). `v-reveal` (`src/directives/reveal.js`, registered globally in `main.js`) fades blocks in on scroll. Inner pages wrap their top `SectionHead` in `src/components/PageHero.vue` (cursor spotlight + staggered entrance, like the home hero). The router scrolls to `#hash` anchors (e.g. `/portfolio#love-is-date`).

**Pages:** `/` home, `/portfolio` (cases + experience timeline), `/ai` (AI & Automation; the Telegram bots section is `#telegram`, and `/telegram` redirects there), `/codelab`, `/privacy-policy` (iSolace's Google Play privacy policy — keep the text and URL unchanged; iSolace itself is not shown elsewhere on the site).

**Key third-party integrations:**
- Telegram Login Widget + serverless auth — `src/components/TelegramDemo.vue` (bot chat demo + official Telegram widget, used on `/ai`); `api/telegram-auth.js` is a Vercel serverless function that validates the HMAC and sends a welcome message via the Bot API. Requires `TELEGRAM_BOT_TOKEN` env var in Vercel. The widget only renders on the production domain.

**Interactive components in CodeLab (`/codelab`):**
- `AlgorithmVisualiser.vue` — animated sorting algorithm visualizer
- `ThreeModelViewer.vue` — Three.js 3D model viewer

**Lecture translator PWA (`/translate/`):** self-contained in `src/translate/`, lazy-loaded, rendered without `DefaultLayout` (`meta.bare` in the router, checked in `App.vue`). Users bring their own API keys (Soniox for speech + translation; Gemini/Anthropic/OpenAI for summaries), stored only in `localStorage`/`sessionStorage`; lectures go to IndexedDB. `useLiveSession` is a shared singleton so changing screens does not stop a recording. The service worker (`vite-plugin-pwa`) is scoped to `/translate/` and the manifest (`public/translate/manifest.webmanifest`) is linked at runtime by `src/translate/pwa.js`, so the rest of the site is not installable. Spec: `docs/superpowers/specs/2026-11-05-lecture-translator-pwa-design.md`.
