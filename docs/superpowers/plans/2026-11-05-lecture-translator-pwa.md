# Переводчик лекций (PWA) — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Маршрут `/translate/` в портфолио: живой перевод лекций через Soniox,
библиотека расшифровок в IndexedDB, саммари через Gemini / Anthropic / OpenAI,
установка на телефон как PWA.

**Architecture:** Изолированная папка `src/translate/`. Чистая логика
(`services/`, `composables/`) покрыта Vitest. Страницы — тонкие Vue-компоненты
поверх composable `useLiveSession`. PWA через `vite-plugin-pwa` со
`scope: '/translate/'`, манифест подключается только на маршрутах переводчика.

**Tech Stack:** Vue 3, vue-router 4, Vite 6, `@soniox/client`, `idb`,
`vite-plugin-pwa`, `marked`, `dompurify`, Vitest + happy-dom + fake-indexeddb.

Спека: `docs/superpowers/specs/2026-11-05-lecture-translator-pwa-design.md`.

## Global Constraints

- Обычный JavaScript, без TypeScript. Vue — только `<script setup>`.
- CSS: БЭМ, `scoped`, только логические свойства (`margin-inline-start`,
  `inset-inline-end`, `text-align: start`). Цвета и шрифты — только токены
  из `src/assets/main.css`.
- Ключи API — только в `localStorage` / `sessionStorage`, никогда в IndexedDB
  и не на сервер.
- Языки перевода: `en`, `he`, `ru`, `de`, `es`. Языки интерфейса: `ru`, `en`.
- Покрытие ≥ 70% по `src/translate/services/**` и `src/translate/composables/**`.
- Комментарии в коде — на английском.
- Ссылки внутри приложения ведут на `/translate/` со слешем (scope PWA).

## Файлы

```
src/translate/
  languages.js                 — TARGET_LANGUAGES, languageName()
  i18n.js                      — t(key, params), locale
  TranslateShell.vue           — панель приложения, PWA-регистрация
  pwa.js                       — enablePwa(): манифест + service worker
  audio/meteredMicSource.js    — AudioSource для SDK + уровень громкости
  services/
    transcriptBuilder.js       — токены Soniox → абзацы
    exporter.js                — formatTime, toMarkdown, toText
    sessionStore.js            — IndexedDB CRUD
    keyVault.js                — ключи и выбор провайдера
    llmProviders.js            — адаптеры Gemini/Anthropic/OpenAI
    summarizer.js              — промпт, summarize, ошибки
    keyProbe.js                — проверка ключей
    sonioxStream.js            — buildSessionConfig, startStream, classifyError
  composables/
    usePrefs.js                — настройки UI в localStorage
    useLiveSession.js          — оркестратор живой записи
  components/
    RecordButton.vue, StatusLine.vue, TranscriptFeed.vue,
    LanguageSelect.vue, SummaryPanel.vue
  pages/
    LivePage.vue, SessionsPage.vue, SessionPage.vue, SettingsPage.vue
test/translate/*.spec.js
public/translate/              — manifest.webmanifest, иконки
```

Изменяются: `package.json`, `vite.config.js`, `src/main.js`, `src/App.vue`,
`src/router/index.js`, `src/layouts/DefaultLayout.vue` (ссылка в навигации),
`vercel.json` (заголовки для `sw.js`).

---

### Task 1: Тестовый стек и сборщик расшифровки

**Files:** `package.json`, `vitest.config.js`, `src/translate/languages.js`,
`src/translate/services/transcriptBuilder.js`, `test/translate/transcriptBuilder.spec.js`

**Interfaces — Produces:**
- `createTranscript(paragraphs = [])` → `{ paragraphs, tail: { original, translation } }`
- `applyTokens(state, tokens, offsetMs = 0)` → новый state (исходный не мутируется)
- `detectedLangs(paragraphs)` → `string[]`
- `countWords(paragraphs)` → число слов в переводе
- Абзац: `{ startMs, lang, original, translation, passthrough, translated, ended }`

**Правила склейки** (токен Soniox: `text, is_final, translation_status, language, start_ms`):
- `<end>` → у текущего абзаца `ended = true`, текст не добавляется.
- Нефинальные токены попадают только в `tail` и заменяются при каждом вызове.
- `translation` → в `translation` последнего абзаца с `passthrough === false`,
  `translated = true`.
- `original` → новый абзац, если текущего нет, или он `translated`, или `passthrough`.
- `none` (речь уже на целевом языке) → текст и в `original`, и в `translation`;
  новый абзац, если текущего нет, или он `ended`, или он не `passthrough`.
- `startMs = offsetMs + token.start_ms` первого токена абзаца, `lang` — его `language`.

- [ ] Step 1: установить `vitest @vitest/coverage-v8 happy-dom fake-indexeddb`,
  скрипты `test` и `test:coverage`, `vitest.config.js` с порогом 70%.
- [ ] Step 2: табличные тесты: один абзац оригинал→перевод; два абзаца;
  нефинальный хвост заменяется; `<end>` в passthrough режет абзац; смена
  языка на целевой; offset; исходный state не мутирован; `detectedLangs`, `countWords`.
- [ ] Step 3: `npm test` — FAIL. Step 4: реализация. Step 5: PASS. Step 6: commit.

### Task 2: Хранилище лекций и экспорт

**Files:** `services/sessionStore.js`, `services/exporter.js`, тесты.

**Produces:**
- `createSession({ title, targetLang, context })` → сохранённая лекция
  `{ id, title, createdAt, durationMs: 0, status: 'recording', targetLang,
  detectedLangs: [], context, paragraphs: [], summary: null }`
- `saveSession(session)`, `getSession(id)`, `listSessions()` (новые сверху),
  `deleteSession(id)`, `findInterrupted()` → последняя со `status: 'recording'` или `null`
- `formatTime(ms)` → `'MM:SS'` / `'H:MM:SS'`
- `toMarkdown(session, labels)`, `toText(session)`

Тесты: CRUD на `fake-indexeddb` (новая `IDBFactory` в `beforeEach`), сортировка,
`findInterrupted`; форматы экспорта.

### Task 3: Ключи, провайдеры, саммари, проверка ключей

**Files:** `services/keyVault.js`, `services/llmProviders.js`,
`services/summarizer.js`, `services/keyProbe.js`, тесты.

**Produces:**
- keyVault: `getKey(name)`, `setKey(name, value)`, `getRemember()`,
  `setRemember(bool)` (переносит ключи между хранилищами), `forgetKeys()`,
  `getSummaryProvider()` / `setSummaryProvider(p)` (по умолчанию `'gemini'`).
  `name ∈ 'soniox' | 'gemini' | 'anthropic' | 'openai'`.
- llmProviders: `PROVIDERS[p] = { model, request({ key, system, user }) → [url, init],
  parse(json) → string, probe(key) → [url, init] }`.
  - Gemini: `POST .../v1beta/models/{model}:generateContent`, заголовок `x-goog-api-key`.
  - Anthropic: `POST https://api.anthropic.com/v1/messages`, `x-api-key`,
    `anthropic-version: 2023-06-01`, `anthropic-dangerous-direct-browser-access: true`.
  - OpenAI: `POST https://api.openai.com/v1/chat/completions`, `Authorization: Bearer`.
- summarizer: `buildPrompt({ text, lang })` → `{ system, user }`,
  `summarize({ provider, key, text, lang, fetchImpl })` → markdown,
  `estimateTokens(text)`, `SummaryError` с `kind ∈ 'auth' | 'rate' | 'network' | 'other'`.
  Gemini 400 с `API_KEY_INVALID` → `auth`.
- keyProbe: `probeKey({ name, key, fetchImpl })` → `'ok' | 'invalid' | 'unknown'`
  (`unknown`, если `fetch` бросил — например CORS у Soniox).

Тесты: подменённый `fetch` — формат запроса каждого провайдера, разбор ответа,
401 → auth, 429 → rate, сетевой сбой → network; probe ok/invalid/unknown;
перенос ключей в keyVault.

### Task 4: Поток Soniox и источник микрофона

**Files:** `services/sonioxStream.js`, `audio/meteredMicSource.js`, тест.

**Produces:**
- `buildSessionConfig({ targetLang, context })` — `model: SONIOX_MODEL`,
  `audio_format: 'auto'`, `language_hints` из `TARGET_LANGUAGES`,
  `enable_language_identification`, `enable_endpoint_detection`,
  `translation: { type: 'one_way', target_language }`, `context` только если
  есть тема/термины, `auto_reconnect: true`, `max_reconnect_attempts: 3`.
- `classifyError(err)` → `'auth' | 'balance' | 'mic-denied' | 'no-mic' | 'unsupported' | 'network' | 'other'`
- `startStream({ key, targetLang, context, source, onTokens, onState, onError, onRestart })`
  → `{ pause(), resume(), stop(): Promise, cancel() }`
- `MeteredMicSource` — `start(handlers)`, `stop()`, `pause()`, `resume()`,
  `restart()`, `getLevel()` → 0..1. Один `getUserMedia`, из него и `MediaRecorder`,
  и `AnalyserNode` (iOS плохо переносит два потока с микрофона).

Тесты: `buildSessionConfig`, `classifyError` (startStream и источник —
ручная проверка, вне порога покрытия только `audio/`).

### Task 5: Оркестратор `useLiveSession` и `usePrefs`

**Produces:**
- `useLiveSession(deps?)` → `{ status, error, session, tail, elapsedMs, wordCount,
  start({ title, targetLang, context, key }), pause(), resume(key), stop(),
  continueSession(session, key), getLevel(), onParagraph(cb), dispose() }`
- `status ∈ 'idle' | 'connecting' | 'recording' | 'paused' | 'reconnecting' | 'stopping' | 'error'`
- deps для тестов: `{ store, startStream, createSource, now, autosaveMs }`
- Длительность копится только во время записи. `onRestart` → `offsetMs = elapsed`.
- Автосохранение каждые `autosaveMs` (5000) и на `visibilitychange: hidden`.
- Wake Lock на время записи, повторный захват при возвращении на вкладку.
- `stop()` на пустой лекции удаляет её, иначе `status: 'done'`.
- Ошибка потока: сохраняем, `status = 'error'`, `resume(key)` открывает новый поток.
- `onParagraph` — завершённые абзацы (задел под озвучку).
- `usePrefs()` → refs `targetLang`, `textSize`, `showOriginal`, синхронизированные с `localStorage`.

Тесты на фейковом потоке и хранилище: старт → токены → абзацы; пауза не
копит время; автосохранение по таймеру; ошибка → error, resume → новый поток;
stop пустой → delete; stop с текстом → done; onParagraph; continueSession
продолжает время и дописывает.

### Task 6: Маршруты, оболочка, i18n, ссылка в навигации

- `App.vue`: `route.meta.bare` → `<router-view />` без `DefaultLayout`.
- `main.js`: монтирование после `router.isReady()` (без мигания шапки сайта).
- Маршрут `/translate` (ленивый) с детьми `''`, `sessions`, `sessions/:id`, `settings`.
- `TranslateShell.vue`: «← сайт», вкладки «Перевод / Лекции / Настройки».
- `i18n.js`: словарь RU/EN.
- `DefaultLayout`: пункт навигации «Translator» → `/translate/`.
- Проверка: `npm run build` проходит.

### Task 7: Настройки

`SettingsPage.vue`: ключ Soniox, переключатель провайдера саммари и его ключ,
кнопки «проверить» (`probeKey`), «запомнить на устройстве», «забыть ключи»,
ссылки, где взять ключи.

### Task 8: Живой перевод

`LivePage.vue` + `RecordButton`, `StatusLine`, `TranscriptFeed`, `LanguageSelect`:
карточка настройки без ключа; поля «название», «тема», «термины»;
плашка прерванной записи; лента абзацев с хвостом; автопрокрутка, пока
пользователь не прокрутил вверх; размер текста; показ оригинала;
полноэкранный режим, если доступен; сообщения об ошибках по `error`.

### Task 9: Библиотека, просмотр, саммари, экспорт

`SessionsPage.vue` (список, поиск по названию и тексту),
`SessionPage.vue` (вкладки, переименование, удаление, экспорт MD/TXT,
копирование, Web Share), `SummaryPanel.vue` (оценка токенов, создание,
пересоздание, `marked` + `DOMPurify`).

### Task 10: PWA и деплой

- `vite-plugin-pwa`: `manifest: false`, `injectRegister: false`,
  `workbox.navigateFallback: '/index.html'`,
  `navigateFallbackAllowlist: [/^\/translate/]`,
  `maximumFileSizeToCacheInBytes: 6 МБ`, кэш шрифтов Google.
- `public/translate/manifest.webmanifest`: `id` и `scope` `/translate/`,
  `start_url: '/translate/'`, `display: standalone`, цвета `#0D0D0D`, иконки.
- Иконки из `public/translate/icon.svg` через `@vite-pwa/assets-generator`.
- `pwa.js`: добавляет `<link rel="manifest">`, `theme-color`,
  `apple-touch-icon`, регистрирует `/sw.js` со `scope: '/translate/'` (только в production).
- `vercel.json`: `Cache-Control: no-cache` для `/sw.js`.
- Проверка: `npm test`, `npm run test:coverage`, `npm run build`, `npm run preview`
  и проход по экранам в браузере; push в `master` → деплой Vercel.

### Ручной чек-лист на устройствах (после деплоя)

- [ ] Установка PWA на iOS Safari и Android Chrome
- [ ] 10 минут речи на иврите с переводом в RU
- [ ] Блокировка экрана → плашка «запись прервалась» → продолжение
- [ ] Режим полёта посреди записи → переподключение
- [ ] Саммари у каждого из трёх провайдеров
