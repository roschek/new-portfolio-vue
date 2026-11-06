# Pages Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести Portfolio, AI (с объединённым Telegram), Code Lab и Privacy Policy на редакционный стиль главной и пересобрать содержание по спеке `docs/superpowers/specs/2026-11-06-pages-refresh-design.md`.

**Architecture:** Общие примитивы главной (`.label`, `.btn`, `.section`, появление при прокрутке) выносятся в глобальный `src/assets/editorial.css` и глобальную директиву `v-reveal`; заголовок раздела — компонент `SectionHead`. Демо Telegram-бота переезжает из страницы в компонент `TelegramDemo` без изменения логики. Страницы переписываются на этих деталях.

**Tech Stack:** Vue 3 SFC, vue-router 4, plain CSS (BEM, логические свойства), Vite.

## Global Constraints

- Факты не выдумываются; тексты кейсов — только из спеки.
- iSolace нигде не упоминается, кроме `/privacy-policy` (текст и адрес не меняются).
- Скриншоты только собственных продуктов, `public/images/work/*.webp`.
- Тексты сайта на английском.
- Автотестов для страниц нет; проверка — `npm run build` и обход в браузере.
- Всё в ветке `design/pages-refresh`; мёрдж в master только после просмотра пользователем.

---

### Task 1: Общие примитивы и главная

**Files:**
- Create: `src/assets/editorial.css`, `src/directives/reveal.js`, `src/components/SectionHead.vue`
- Modify: `src/main.js`, `src/pages/HomePage.vue`

**Interfaces:**
- Produces:
  - глобальные классы `.label`, `.label--dim`, `.label__dim`, `.btn`, `.btn--primary`, `.btn--ghost`, `.btn__arrow`, `.page`, `.section`, `.section--talk`, `.talk__title`, `.talk__text`, `.actions`, `.accent` (курсив Instrument Serif в цвете акцента), `.reveal`, `.reveal--in`;
  - директива `v-reveal` (регистрируется глобально в `main.js`);
  - `<SectionHead label="§ 01 / Cases">Title with <em>accent</em></SectionHead>`, необязательный слот `lead`; рендерит `<header class="section-head">` с меткой, `h2` (или `h1` при `level="1"`), пунктиром.

- [ ] Перенести стили `.label`/`.btn`/`.section`/talk/reveal из `HomePage.vue` в `editorial.css`, `em`-акцент — как `.accent em, .section-head em`.
- [ ] `reveal.js` — объект директивы из `HomePage.vue` (IntersectionObserver, threshold 0.12) без изменений.
- [ ] `main.js`: `import "./assets/editorial.css"`, `app.directive("reveal", reveal)`.
- [ ] `HomePage.vue`: заголовки разделов через `SectionHead`, убрать локальный `vReveal` и перенесённые стили; § 02 — удалить iSolace, добавить `payouts.com` (текст «Marketing payouts aggregator and banking — senior full-stack, team lead.», без внешней ссылки), все карточки ведут на `/portfolio#<slug>`; § 03 Running → «ProfileNexus, Love is Date and Lecture Translator in production.»
- [ ] `npm run build`; в браузере главная выглядит как до изменения (кроме § 02/§ 03).
- [ ] Commit `refactor: общие примитивы редакционного стиля; главная без iSolace`.

### Task 2: Скриншоты продуктов

**Files:** Create `public/images/work/love-is-date.webp`, `profilenexus.webp`, `lecture-translator.webp`

- [ ] Открыть https://loveisdate.co.il/, https://app.alex-kagan-develop.com/, https://www.alex-kagan-develop.com/translate/ в браузере 1440×900, снять первый экран.
- [ ] Конвертировать в WebP шириной 1200px (через `npx sharp-cli` или canvas в браузере), ≤ 150 КБ каждый.
- [ ] Если сайт требует входа или выглядит сломанным — не публиковать, показать пользователю.
- [ ] Commit `assets: скриншоты собственных продуктов`.

### Task 3: Portfolio

**Files:** Modify (переписать) `src/pages/PortfolioPage.vue`

**Interfaces:** Consumes `SectionHead`, `v-reveal`, глобальные классы. Produces якоря `#love-is-date`, `#profilenexus`, `#lecture-translator`, `#payouts`.

- [ ] Hero страницы: `SectionHead level="1" label="§ 00 / Portfolio"` — «Work, <em>case by case</em>», лид про 4 кейса и хронологию.
- [ ] § 01 Cases: массив `cases` с полями `id, name, role, period, url, internal, image, problem, solution, result, stack`; тексты — английская версия спеки (без новых фактов). Карточка: метка `CASE · 01`, название, роль · годы, три колонки Problem / Solution / Result (на узком — столбик), стек, ссылка, `<img loading="lazy" width height alt>`.
- [ ] § 02 Experience: payouts.com, Korus Consulting, Nota.Media, Yandex — годы, роль, компания (ссылка как раньше), 1–2 текущие строки, стек; кнопка «Download CV» → `/files/alexey-kagan-cv.pdf`.
- [ ] Поиск удалить.
- [ ] `npm run build`; в браузере переход с главной на `/portfolio#love-is-date` прокручивает к кейсу (при необходимости добавить `scrollBehavior` с `el: to.hash` в router).
- [ ] Commit `feat(portfolio): кейсы и хронология в редакционном стиле`.

### Task 4: AI & Automation и Telegram

**Files:**
- Move: `src/pages/TelegramPage.vue` → `src/components/TelegramDemo.vue` (`git mv`), оставить только блок демо (телефон + виджет), скрипт и стили демо.
- Modify (переписать): `src/pages/AIPage.vue`; Modify: `src/router/index.js`, `src/layouts/DefaultLayout.vue`

- [ ] `TelegramDemo.vue`: удалить header и use-cases из шаблона и их стили; логика виджета и `/api/telegram-auth` без изменений.
- [ ] `AIPage.vue`: § 00 «AI that <em>ships</em>»; § 01 AI in production — Lecture Translator, ProfileNexus, Customer Support Automation (2023), Image Synthesis Pipeline (2022), тексты двух последних дословно из текущего файла; § 02 Telegram bots `id="telegram"` — три типа (AI Customer Support со ссылкой «see § 01» на `#ai-support`), `<TelegramDemo />`; § 03 Talk.
- [ ] Router: `/telegram` → `{ path: "/telegram", redirect: { path: "/ai", hash: "#telegram" } }`, удалить импорт TelegramPage; `scrollBehavior(to, from, saved)` — saved ‖ hash → `{ el: to.hash, top: 80 }` ‖ `{ top: 0 }`.
- [ ] Nav: убрать «Telegram Bots», «AI Pro» → «AI & Automation».
- [ ] `npm run build`; браузер: `/telegram` → раздел ботов, демо-чат отвечает на `/start`, iframe виджета Telegram появляется.
- [ ] Commit `feat(ai): страница AI & Automation с разделом Telegram-ботов`.

### Task 5: Code Lab и Privacy Policy

**Files:** Modify `src/pages/CodeLabPage.vue`, `src/pages/PrivacyPolicyPage.vue`, при необходимости цвета в `src/components/AlgorithmVisualiser.vue`, `src/components/ThreeModelViewer.vue`

- [ ] Code Lab: `SectionHead level="1" label="§ 00 / Code Lab"` — «Live <em>demos</em>», вкладки — моно-капс с подчёркиванием акцентом (как вкладки лекции переводчика).
- [ ] Privacy: колонка `max-width: 68ch`, заголовок через `SectionHead level="1" label="§ Legal / iSolace"`, h2 разделов — моно-метка + display-шрифт; текст без изменений (`git diff` по текстовым узлам пуст).
- [ ] `npm run build`; браузер: оба визуализатора работают.
- [ ] Commit `style: Code Lab и Privacy Policy в редакционном стиле`.

### Task 6: Документация и выкатка preview

**Files:** Modify `CLAUDE.md`

- [ ] CLAUDE.md: убрать vanta и `#0F172A`, описать `editorial.css`, `v-reveal`, `SectionHead`, `TelegramDemo`, редирект `/telegram`.
- [ ] Финальный обход: `/`, `/portfolio`, `/ai`, `/telegram`, `/codelab`, `/privacy-policy`, `/translate/` (не сломан); `npm test` зелёный.
- [ ] Commit, `git push -u origin design/pages-refresh`, найти preview-URL Vercel, отчитаться пользователю.
