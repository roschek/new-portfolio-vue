# Миграция на Nuxt 4 SSG — техническая база

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести сайт с Vue 3 SPA на Nuxt 4 со статической генерацией, поднять
тестовый стек и закрыть техническое SEO, сохранив текущий английский контент.

**Architecture:** Полная статическая генерация (`nuxt generate`) — каждый маршрут
превращается в HTML-файл с текстом, доступным без исполнения JavaScript. Vercel
раздаёт содержимое `.output/public` как статику, редиректы задаются в `vercel.json`.
Тесты проверяют сгенерированный HTML напрямую, а не DOM после гидрации.

**Tech Stack:** Nuxt 4, Vitest, `@nuxt/test-utils`, `@vue/test-utils`, happy-dom,
`@vitest/coverage-v8`, Stryker, `@nuxtjs/seo`.

## Global Constraints

- Обычный JavaScript, **без TypeScript**. Конфиги — `.js`, не `.ts`.
- Vue: только `<script setup>` и Composition API.
- CSS: только логические свойства (`margin-inline-start`, `inset-inline-start`,
  `text-align: start`). Направленные `margin-left`, `left:`, `text-align: left`
  запрещены — на следующем этапе добавляется RTL для иврита.
- Именование CSS-классов — БЭМ (`block__element--modifier`), стили `scoped`.
- Флаг `robots.blockAiBots` модуля Nuxt SEO должен оставаться **выключенным**.
- Порог покрытия: 80% по statements, branches, functions, lines.
- Канонический домен: `https://alex-kagan-develop.com`.
- Комментарии в коде — на английском, как в существующем коде.

## Область этого плана

Входит: миграция на Nuxt 4, тестовый стек, техническое SEO, редиректы.

**Не входит и делается вторым планом:** локализация RU/EN, новый продающий
контент, страницы услуг и кейсов, JSON-LD сущностей (`Person`,
`ProfessionalService`, `Service`, `FAQPage`), `llms.txt`.

Причина разделения: i18n без переведённого контента не является работающим ПО.
Сайт сейчас опубликован, и промежуточное состояние с русским URL и английским
текстом недопустимо. Английский контент в этом плане остаётся по адресам без
префикса; во втором плане он переезжает на `/en/`, русский занимает корень,
и таблица редиректов обновляется одним файлом.

---

### Task 1: Каркас Nuxt 4 и тестовый стек

**Files:**
- Modify: `package.json`
- Create: `nuxt.config.js`
- Create: `app/app.vue`
- Create: `app/pages/index.vue`
- Create: `vitest.config.js`
- Create: `vitest.prerender.config.js`
- Create: `test/utils/static-html.js`
- Create: `test/prerender/home.spec.js`
- Delete: `src/main.js`, `src/App.vue`, `src/router/index.js`, `index.html`

**Раскладка тестов.** Две независимые конфигурации, потому что у тестов разные
предусловия:

- `test/unit/**` — окружение `nuxt`, запускается всегда, считает покрытие
- `test/prerender/**` — окружение `node`, требует выполненной сборки, читает
  `.output/public` с диска и покрытие не считает

Смешивать их нельзя: обычный `npm run test` падал бы на сборе тестов из-за
отсутствия каталога сборки.

**Interfaces:**
- Produces: `readGenerated(route)` из `test/utils/static-html.js` — принимает
  путь маршрута (`'/'`, `'/about'`), возвращает строку HTML из `.output/public`.
  Используется всеми последующими задачами.

- [ ] **Step 1: Установить зависимости**

```bash
npm install nuxt@^4 vue vue-router
npm install -D vitest @nuxt/test-utils @vue/test-utils happy-dom @vitest/coverage-v8
```

- [ ] **Step 2: Заменить скрипты в `package.json`**

Заменить блок `"scripts"` на:

```json
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt generate",
    "preview": "nuxt preview",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:prerender": "nuxt generate && vitest run --config vitest.prerender.config.js"
  },
```

- [ ] **Step 3: Создать `nuxt.config.js`**

```js
export default defineNuxtConfig({
  compatibilityDate: '2026-08-07',

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: true,
    },
  },
})
```

- [ ] **Step 4: Создать `app/app.vue`**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 5: Создать вспомогательный модуль тестов `test/utils/static-html.js`**

```js
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT_DIR = join(process.cwd(), '.output', 'public')

/**
 * Reads the statically generated HTML for a route, exactly as an AI crawler
 * would receive it — no JavaScript executed, no hydration.
 */
export function readGenerated(route) {
  const relative = route === '/' ? 'index.html' : join(route.replace(/^\//, ''), 'index.html')
  return readFileSync(join(OUTPUT_DIR, relative), 'utf8')
}

/** Returns the text content of the single <h1> on the page, or null. */
export function extractH1(html) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!match) return null
  return match[1].replace(/<[^>]+>/g, '').trim()
}

/** Returns how many <h1> elements the page contains. */
export function countH1(html) {
  return (html.match(/<h1[\s>]/gi) || []).length
}
```

- [ ] **Step 6: Написать падающий тест `test/prerender/home.spec.js`**

```js
import { describe, it, expect } from 'vitest'
import { readGenerated, extractH1, countH1 } from '../utils/static-html.js'

describe('prerendered HTML', () => {
  it('serves the home page with a single non-empty h1 without running JS', () => {
    const html = readGenerated('/')

    expect(countH1(html)).toBe(1)
    expect(extractH1(html)).toBeTruthy()
  })
})
```

- [ ] **Step 7: Создать обе конфигурации Vitest**

`vitest.config.js` — юнит- и интеграционные тесты:

```js
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['test/unit/**/*.spec.js'],
  },
})
```

`vitest.prerender.config.js` — тесты сгенерированного HTML. Окружение `node`:
эти тесты читают файлы с диска и Nuxt им не нужен.

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/prerender/**/*.spec.js'],
  },
})
```

- [ ] **Step 8: Запустить тест и убедиться, что он падает**

Run: `npm run test:prerender`
Expected: FAIL. Либо `nuxt generate` завершится ошибкой из-за отсутствия
`app/pages/index.vue`, либо тест упадёт с `ENOENT` на `.output/public/index.html`.

- [ ] **Step 9: Перенести CSS и создать минимальную главную**

```bash
mkdir -p app/assets/css
git mv src/assets/main.css app/assets/css/main.css
```

Создать `app/pages/index.vue`:

```vue
<template>
  <main class="home">
    <h1 class="home__name t-display">Aleksei Kagan</h1>
  </main>
</template>

<style scoped>
.home {
  background-color: var(--bg);
  color: var(--text);
  padding: 4rem 2rem;
}
</style>
```

- [ ] **Step 10: Запустить тест и убедиться, что он проходит**

Run: `npm run test:prerender`
Expected: PASS, 1 тест.

- [ ] **Step 11: Удалить точки входа Vite**

```bash
git rm src/main.js src/App.vue src/router/index.js index.html
```

- [ ] **Step 12: Убедиться, что сборка проходит**

Run: `npm run build`
Expected: успешное завершение, в `.output/public/index.html` присутствует
строка `Aleksei Kagan`.

- [ ] **Step 13: Коммит**

```bash
git add -A
git commit -m "feat: Nuxt 4 skeleton with static generation and prerender tests"
```

---

### Task 2: Общий layout

**Files:**
- Create: `app/layouts/default.vue` (перенос из `src/layouts/DefaultLayout.vue`)
- Create: `test/prerender/layout.spec.js`
- Delete: `src/layouts/DefaultLayout.vue`

**Interfaces:**
- Consumes: `readGenerated` из Task 1.
- Produces: layout `default`, применяемый ко всем страницам автоматически.
  Массив ссылок навигации `navLinks` внутри layout — единственное место,
  где объявляются пункты меню.

- [ ] **Step 1: Написать падающий тест `test/prerender/layout.spec.js`**

```js
import { describe, it, expect } from 'vitest'
import { readGenerated } from '../utils/static-html.js'

describe('default layout', () => {
  it('renders navigation links into static HTML', () => {
    const html = readGenerated('/')

    expect(html).toContain('href="/about"')
    expect(html).toContain('href="/lab"')
  })

  it('renders the site name in the header', () => {
    const html = readGenerated('/')

    expect(html).toContain('Aleksei Kagan')
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npm run test:prerender`
Expected: FAIL — ссылок `/about` и `/lab` в разметке нет.

- [ ] **Step 3: Перенести файл layout**

```bash
mkdir -p app/layouts
git mv src/layouts/DefaultLayout.vue app/layouts/default.vue
```

- [ ] **Step 4: Привести layout к Nuxt**

В `app/layouts/default.vue` выполнить замены:

1. Заменить все `<RouterLink` на `<NuxtLink` и `</RouterLink>` на `</NuxtLink>`.
2. Заменить атрибут `exact-active-class="layout__nav-link--active"` на
   `active-class="layout__nav-link--active"` с добавлением `exact`.
3. Удалить из `<script setup>` импорты `useRoute`/`useRouter` из `vue-router` —
   в Nuxt они автоимпортируются.
4. Убедиться, что контент страницы рендерится через `<slot />`. Nuxt передаёт
   страницу в layout именно слотом. Если в файле встречается `<RouterView />`
   или `<NuxtPage />`, заменить на `<slot />` — `<NuxtPage />` внутри layout
   вызвал бы двойной рендер страницы.

5. Привести массив `navLinks` к новой структуре маршрутов:

```js
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Code Lab', path: '/lab' },
]
```

Иконки в `navLinks` сохранить как есть, если они там были.

- [ ] **Step 5: Запустить тесты**

Run: `npm run test:prerender`
Expected: PASS.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: migrate default layout to Nuxt"
```

---

### Task 3: Перенос страниц контента

**Files:**
- Create: `app/pages/index.vue` (заменяет заглушку из Task 1)
- Create: `app/pages/about.vue`
- Create: `app/pages/lab.vue`
- Create: `app/pages/telegram.vue`
- Create: `app/pages/privacy-policy.vue`
- Create: `app/components/ExperienceSection.vue`
- Create: `app/components/AiSection.vue`
- Create: `app/components/AlgorithmVisualiser.vue`
- Create: `app/components/ThreeModelViewer.vue`
- Create: `test/prerender/pages.spec.js`
- Delete: вся директория `src/`

**Interfaces:**
- Consumes: `readGenerated` из Task 1, layout `default` из Task 2.
- Produces: маршруты `/`, `/about`, `/lab`, `/telegram`, `/privacy-policy`.
  Компоненты `ExperienceSection` и `AiSection` — без пропсов, данные держат внутри.

- [ ] **Step 1: Написать падающий тест `test/prerender/pages.spec.js`**

```js
import { describe, it, expect } from 'vitest'
import { readGenerated, countH1, extractH1 } from '../utils/static-html.js'

const ROUTES = ['/', '/about', '/lab', '/telegram', '/privacy-policy']

describe('content pages', () => {
  it.each(ROUTES)('%s is prerendered with exactly one non-empty h1', (route) => {
    const html = readGenerated(route)

    expect(countH1(html)).toBe(1)
    expect(extractH1(html)).toBeTruthy()
  })

  it('about page contains the professional experience content', () => {
    const html = readGenerated('/about')

    expect(html).toContain('Professional Experience')
    expect(html).toContain('AI Integration')
  })

  it('home page does not load the three.js bundle', () => {
    const html = readGenerated('/')

    expect(html).not.toMatch(/three/i)
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npm run test:prerender`
Expected: FAIL — маршрутов `/about`, `/lab`, `/telegram`, `/privacy-policy` нет.

- [ ] **Step 3: Перенести компоненты**

```bash
mkdir -p app/components
git mv src/components/AlgorithmVisualiser.vue app/components/AlgorithmVisualiser.vue
git mv src/components/ThreeModelViewer.vue app/components/ThreeModelViewer.vue
git mv src/pages/FrontendPage.vue app/components/ExperienceSection.vue
git mv src/pages/AIPage.vue app/components/AiSection.vue
```

- [ ] **Step 4: Перенести главную страницу**

```bash
git mv -f src/pages/HomePage.vue app/pages/index.vue
```

В `app/pages/index.vue` выполнить замены:

1. Строка 45: `<a href="/frontend" class="home__button home__button--secondary">`
   заменить на `<NuxtLink to="/about" class="home__button home__button--secondary">`,
   закрывающий `</a>` — на `</NuxtLink>`.
2. Строка 94: та же замена для второй ссылки `href="/frontend"`.
3. Строка 70: заменить `<h2 class="home__section-title t-h1">About Me</h2>` на
   `<h2 class="home__section-title t-h2">About Me</h2>` — класс `t-h1` на
   заголовке второго уровня даёт неверную визуальную иерархию.
4. Удалить блок обработчика якорных ссылок из `onMounted` — Nuxt обрабатывает
   якоря штатно, а `document.querySelectorAll` в `onMounted` вешает слушатели
   без снятия. Удалить строки:

```js
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const el = document.querySelector(this.getAttribute('href'))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  })
```

Плавная прокрутка уже обеспечивается `scroll-behavior: smooth` в `main.css:27`.

- [ ] **Step 5: Создать `app/pages/about.vue`**

```vue
<template>
  <main class="about">
    <h1 class="about__title t-display">About</h1>
    <ExperienceSection />
    <AiSection />
  </main>
</template>

<style scoped>
.about {
  background-color: var(--bg);
  color: var(--text);
  padding-block: 4rem;
  padding-inline: 2rem;
}

.about__title {
  max-width: 1100px;
  margin-inline: auto;
  margin-block-end: 2rem;
}
</style>
```

В `app/components/ExperienceSection.vue` и `app/components/AiSection.vue`
заменить корневые `<h2 class="... t-h1">` на `<h2 class="... t-h2">` — на
странице теперь есть настоящий `<h1>`.

- [ ] **Step 6: Создать `app/pages/lab.vue`**

```bash
git mv -f src/pages/CodeLabPage.vue app/pages/lab.vue
```

В `app/pages/lab.vue`:

1. Заменить `<h2 class="codelab__title">Code Lab</h2>` на
   `<h1 class="codelab__title t-display">Code Lab</h1>`.
2. Заменить статические импорты компонентов на ленивые, чтобы `three` не
   попадал в общий бандл. В `<script setup>` удалить строки импорта
   `AlgorithmVisualizer` и `ThreeModelViewer` и заменить их на:

```js
const AlgorithmVisualizer = defineAsyncComponent(() =>
  import('~/components/AlgorithmVisualiser.vue')
)
const ThreeModelViewer = defineAsyncComponent(() =>
  import('~/components/ThreeModelViewer.vue')
)
```

- [ ] **Step 7: Перенести оставшиеся страницы**

```bash
git mv -f src/pages/TelegramPage.vue app/pages/telegram.vue
git mv -f src/pages/PrivacyPolicyPage.vue app/pages/privacy-policy.vue
```

В каждой из них убедиться, что корневой заголовок — `<h1>`, а не `<h2>`.
Если это `<h2>`, заменить тег на `<h1>`, класс оставить.

- [ ] **Step 8: Удалить остатки старой структуры**

```bash
git rm -r --ignore-unmatch src/composables src/store src/pages src/assets.zip
rmdir src 2>/dev/null || true
```

`src/composables/useTheme.js` и `src/store/theme.js` — мёртвый код:
`useThemeStore` не импортируется ни одним компонентом, класс `.light-theme`
не определён ни в одном CSS. Удаляются без замены.

- [ ] **Step 9: Запустить тесты**

Run: `npm run test:prerender && npx vitest run`
Expected: PASS. Если тест `three.js bundle` падает — проверить, что в
`lab.vue` использован `defineAsyncComponent`, а не статический импорт.

- [ ] **Step 10: Коммит**

```bash
git add -A
git commit -m "feat: migrate content pages to Nuxt file-based routing"
```

---

### Task 4: Логические CSS-свойства

**Files:**
- Modify: `app/pages/index.vue`, `app/pages/lab.vue`, `app/pages/privacy-policy.vue`,
  `app/layouts/default.vue`, `app/components/ExperienceSection.vue`,
  `app/components/AiSection.vue`, `app/components/ThreeModelViewer.vue`
- Create: `test/unit/css-logical-properties.spec.js`

**Interfaces:**
- Consumes: файлы после Task 3.
- Produces: отсутствие направленных CSS-свойств во всей кодовой базе.

- [ ] **Step 1: Написать падающий тест `test/unit/css-logical-properties.spec.js`**

Обход директорий написан на `readdirSync`, а не на `fs.globSync`: последний
помечен как экспериментальный и доступен не во всех поддерживаемых версиях Node.

```js
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const FORBIDDEN = {
  'margin-left': /(^|[\s;{])margin-left\s*:/,
  'margin-right': /(^|[\s;{])margin-right\s*:/,
  'padding-left': /(^|[\s;{])padding-left\s*:/,
  'padding-right': /(^|[\s;{])padding-right\s*:/,
  'border-left': /(^|[\s;{])border-left\s*:/,
  'border-right': /(^|[\s;{])border-right\s*:/,
  'text-align: left|right': /text-align\s*:\s*(left|right)\s*[;}]/,
}

function collectStyleFiles(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      collectStyleFiles(full, found)
    } else if (/\.(vue|css)$/.test(entry.name)) {
      found.push(relative(process.cwd(), full))
    }
  }
  return found
}

const files = collectStyleFiles(join(process.cwd(), 'app'))

describe('CSS uses logical properties for RTL readiness', () => {
  it('finds style files to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s has no physical direction properties', (file) => {
    const source = readFileSync(join(process.cwd(), file), 'utf8')
    const violations = Object.entries(FORBIDDEN)
      .filter(([, pattern]) => pattern.test(source))
      .map(([name]) => name)

    expect(violations).toEqual([])
  })
})
```

Первый тест страхует от ложного успеха: если обход сломается и вернёт пустой
список, `it.each([])` не выполнит ни одной проверки и набор всё равно будет зелёным.

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npx vitest run test/unit/css-logical-properties.spec.js`
Expected: FAIL на нескольких файлах, в сообщении — имена нарушенных свойств.

- [ ] **Step 3: Заменить свойства**

В каждом файле из списка нарушений применить замены:

| Было | Стало |
|---|---|
| `margin-left:` | `margin-inline-start:` |
| `margin-right:` | `margin-inline-end:` |
| `padding-left:` | `padding-inline-start:` |
| `padding-right:` | `padding-inline-end:` |
| `border-left:` | `border-inline-start:` |
| `border-right:` | `border-inline-end:` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |

Для абсолютного позиционирования внутри `position: absolute` заменить
`left:` на `inset-inline-start:` и `right:` на `inset-inline-end:`.

**Исключение:** свойство `left` в `@keyframes` и в `.home__role`
(`app/pages/index.vue`) относится к абсолютно позиционированному элементу
внутри контейнера с `overflow: hidden` — заменить на `inset-inline-start: 0`.

- [ ] **Step 4: Запустить тесты**

Run: `npx vitest run test/unit/css-logical-properties.spec.js`
Expected: PASS.

- [ ] **Step 5: Проверить, что вёрстка не сломалась**

Run: `npm run build`
Expected: сборка проходит. Открыть `npm run preview`, глазами проверить
главную, `/about` и `/lab` — отступы и выравнивание не изменились.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "refactor: switch CSS to logical properties for RTL readiness"
```

---

### Task 5: Обработчик Telegram на Nitro с мутационными тестами

**Files:**
- Create: `server/api/telegram-auth.post.js`
- Create: `server/utils/telegram-signature.js`
- Create: `test/unit/telegram-signature.spec.js`
- Create: `stryker.config.json`
- Modify: `package.json`
- Delete: `api/telegram-auth.js`

**Interfaces:**
- Produces: `verifyTelegramSignature({ data, botToken, now, maxAgeSeconds })` —
  возвращает `{ valid: boolean, reason: string | null }`. `reason` принимает
  значения `'missing_token'`, `'missing_hash'`, `'expired'`, `'bad_signature'`
  или `null` при успехе. Чистая функция без обращений к сети и окружению.

- [ ] **Step 1: Написать падающий тест `test/unit/telegram-signature.spec.js`**

```js
import { describe, it, expect } from 'vitest'
import crypto from 'node:crypto'
import { verifyTelegramSignature } from '../../server/utils/telegram-signature.js'

const BOT_TOKEN = 'test-bot-token'

function sign(data, botToken = BOT_TOKEN) {
  const secret = crypto.createHash('sha256').update(botToken).digest()
  const checkString = Object.keys(data)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n')
  return crypto.createHmac('sha256', secret).update(checkString).digest('hex')
}

const NOW = 1_800_000_000

function validPayload(overrides = {}) {
  const data = {
    id: '12345',
    first_name: 'Alex',
    auth_date: String(NOW - 10),
    ...overrides,
  }
  return { ...data, hash: sign(data) }
}

describe('verifyTelegramSignature', () => {
  it('accepts a correctly signed, fresh payload', () => {
    const result = verifyTelegramSignature({
      data: validPayload(),
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: true, reason: null })
  })

  it('rejects a payload whose hash was tampered with', () => {
    const payload = validPayload()
    payload.hash = payload.hash.replace(/^./, (c) => (c === 'a' ? 'b' : 'a'))

    const result = verifyTelegramSignature({
      data: payload,
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'bad_signature' })
  })

  it('rejects a payload whose field was changed after signing', () => {
    const payload = validPayload()
    payload.first_name = 'Mallory'

    const result = verifyTelegramSignature({
      data: payload,
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'bad_signature' })
  })

  it('rejects a payload signed with a different bot token', () => {
    const data = { id: '1', auth_date: String(NOW - 10) }
    const payload = { ...data, hash: sign(data, 'other-token') }

    const result = verifyTelegramSignature({
      data: payload,
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'bad_signature' })
  })

  it('rejects a payload older than the allowed window', () => {
    const result = verifyTelegramSignature({
      data: validPayload({ auth_date: String(NOW - 61) }),
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'expired' })
  })

  it('accepts a payload exactly at the age boundary', () => {
    const result = verifyTelegramSignature({
      data: validPayload({ auth_date: String(NOW - 60) }),
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: true, reason: null })
  })

  it('rejects a payload with a future auth_date', () => {
    const result = verifyTelegramSignature({
      data: validPayload({ auth_date: String(NOW + 120) }),
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'expired' })
  })

  it('rejects when the bot token is not configured', () => {
    const result = verifyTelegramSignature({
      data: validPayload(),
      botToken: undefined,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'missing_token' })
  })

  it('rejects a payload with no hash field', () => {
    const { hash, ...withoutHash } = validPayload()

    const result = verifyTelegramSignature({
      data: withoutHash,
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'missing_hash' })
  })

  it('rejects a payload with a non-numeric auth_date', () => {
    const result = verifyTelegramSignature({
      data: validPayload({ auth_date: 'not-a-number' }),
      botToken: BOT_TOKEN,
      now: NOW,
      maxAgeSeconds: 60,
    })

    expect(result).toEqual({ valid: false, reason: 'expired' })
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npx vitest run test/unit/telegram-signature.spec.js`
Expected: FAIL — модуль `server/utils/telegram-signature.js` не существует.

- [ ] **Step 3: Реализовать `server/utils/telegram-signature.js`**

```js
import crypto from 'node:crypto'

/**
 * Verifies a Telegram Login Widget payload.
 *
 * Kept free of environment and network access so it can be exercised
 * directly by unit and mutation tests.
 */
export function verifyTelegramSignature({ data, botToken, now, maxAgeSeconds }) {
  if (!botToken) {
    return { valid: false, reason: 'missing_token' }
  }

  if (!data || typeof data.hash !== 'string' || data.hash.length === 0) {
    return { valid: false, reason: 'missing_hash' }
  }

  const authDate = Number.parseInt(data.auth_date, 10)
  const age = now - authDate

  if (!Number.isFinite(authDate) || age > maxAgeSeconds || age < 0) {
    return { valid: false, reason: 'expired' }
  }

  const secret = crypto.createHash('sha256').update(botToken).digest()
  const checkString = Object.keys(data)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n')

  const expected = crypto.createHmac('sha256', secret).update(checkString).digest('hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  const receivedBuffer = Buffer.from(data.hash, 'hex')

  if (expectedBuffer.length !== receivedBuffer.length) {
    return { valid: false, reason: 'bad_signature' }
  }

  // Constant-time comparison: a plain !== leaks timing information about
  // how many leading bytes of a forged hash were correct.
  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return { valid: false, reason: 'bad_signature' }
  }

  return { valid: true, reason: null }
}
```

- [ ] **Step 4: Запустить тесты**

Run: `npx vitest run test/unit/telegram-signature.spec.js`
Expected: PASS, 10 тестов.

- [ ] **Step 5: Создать обработчик `server/api/telegram-auth.post.js`**

```js
import { verifyTelegramSignature } from '../utils/telegram-signature.js'

const MAX_AGE_SECONDS = 60

export default defineEventHandler(async (event) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const data = await readBody(event)

  const { valid, reason } = verifyTelegramSignature({
    data,
    botToken,
    now: Math.floor(Date.now() / 1000),
    maxAgeSeconds: MAX_AGE_SECONDS,
  })

  if (!valid) {
    const status = reason === 'missing_token' ? 500 : 403
    throw createError({ statusCode: status, statusMessage: reason })
  }

  const firstName = data.first_name || ''

  await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    body: {
      chat_id: data.id,
      text: `👋 Hello, ${firstName}! Thanks for signing in through our site.`,
    },
  })

  return { ok: true }
})
```

- [ ] **Step 6: Удалить старый обработчик**

```bash
git rm api/telegram-auth.js
rmdir api 2>/dev/null || true
```

- [ ] **Step 7: Установить и настроить Stryker**

```bash
npm install -D @stryker-mutator/core @stryker-mutator/vitest-runner
```

Создать `stryker.config.json`:

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "packageManager": "npm",
  "testRunner": "vitest",
  "reporters": ["html", "clear-text", "progress"],
  "coverageAnalysis": "perTest",
  "mutate": [
    "server/**/*.js",
    "!server/**/*.spec.js"
  ],
  "thresholds": {
    "high": 90,
    "low": 80,
    "break": 80
  }
}
```

Мутируется только `server/**` — шаблоны и презентационные компоненты
исключены намеренно: мутанты в разметке не окупают время прогона.

Добавить в `package.json` в блок `"scripts"`:

```json
    "test:mutation": "stryker run",
```

- [ ] **Step 8: Запустить мутационные тесты**

Run: `npm run test:mutation`
Expected: мутационный балл не ниже 80. Прогон не должен упасть по порогу `break`.

Если остались выжившие мутанты — прочитать отчёт `reports/mutation/index.html`
и **дописать тест, ловящий мутанта**. Не понижать порог и не удалять мутатор.

- [ ] **Step 9: Коммит**

```bash
git add -A
git commit -m "feat: move Telegram auth to Nitro with constant-time signature check"
```

---

### Task 6: Техническое SEO — robots, sitemap, метатеги

**Files:**
- Modify: `nuxt.config.js`
- Create: `app/pages/index.vue` — блок `useSeoMeta` (правка существующего файла)
- Modify: `app/pages/about.vue`, `app/pages/lab.vue`,
  `app/pages/telegram.vue`, `app/pages/privacy-policy.vue`
- Create: `test/prerender/seo.spec.js`

**Interfaces:**
- Consumes: `readGenerated` из Task 1, маршруты из Task 3.
- Produces: на каждой странице `<title>`, `<meta name="description">`,
  `<link rel="canonical">`; файлы `/robots.txt` и `/sitemap.xml` в выводе сборки.

- [ ] **Step 1: Написать падающий тест `test/prerender/seo.spec.js`**

```js
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readGenerated } from '../utils/static-html.js'

const INDEXED_ROUTES = ['/', '/about', '/lab', '/privacy-policy']
const OUTPUT_DIR = join(process.cwd(), '.output', 'public')

const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'PerplexityBot',
  'OAI-SearchBot',
  'Google-Extended',
]

describe('page metadata', () => {
  it.each(INDEXED_ROUTES)('%s has a non-empty title', (route) => {
    const html = readGenerated(route)
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)

    expect(title).not.toBeNull()
    expect(title[1].trim().length).toBeGreaterThan(10)
  })

  it.each(INDEXED_ROUTES)('%s has a meta description', (route) => {
    const html = readGenerated(route)

    expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]{50,}"/i)
  })

  it.each(INDEXED_ROUTES)('%s has a canonical link on the production domain', (route) => {
    const html = readGenerated(route)
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)

    expect(canonical).not.toBeNull()
    expect(canonical[1]).toMatch(/^https:\/\/alex-kagan-develop\.com/)
  })

  it('telegram page is excluded from indexing', () => {
    const html = readGenerated('/telegram')

    expect(html).toMatch(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i)
  })
})

describe('robots.txt', () => {
  const robots = readFileSync(join(OUTPUT_DIR, 'robots.txt'), 'utf8')

  it.each(AI_CRAWLERS)('does not disallow %s', (crawler) => {
    const block = robots.match(
      new RegExp(`User-agent:\\s*${crawler}[\\s\\S]*?(?=User-agent:|$)`, 'i')
    )

    if (block) {
      expect(block[0]).not.toMatch(/Disallow:\s*\/\s*$/m)
    }
  })

  it('points to the sitemap', () => {
    expect(robots).toMatch(/Sitemap:\s*https:\/\/alex-kagan-develop\.com\/sitemap\.xml/i)
  })
})

describe('sitemap.xml', () => {
  const sitemap = readFileSync(join(OUTPUT_DIR, 'sitemap.xml'), 'utf8')

  it.each(INDEXED_ROUTES)('lists %s', (route) => {
    expect(sitemap).toContain(`https://alex-kagan-develop.com${route === '/' ? '/' : route}`)
  })

  it('does not list the telegram page', () => {
    expect(sitemap).not.toContain('/telegram')
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npm run test:prerender`
Expected: FAIL — `robots.txt` и `sitemap.xml` отсутствуют.

- [ ] **Step 3: Установить модуль**

```bash
npm install -D @nuxtjs/seo
```

- [ ] **Step 4: Настроить `nuxt.config.js`**

Добавить в объект конфигурации:

```js
  modules: ['@nuxtjs/seo'],

  site: {
    url: 'https://alex-kagan-develop.com',
    name: 'Aleksei Kagan',
    defaultLocale: 'en',
  },

  robots: {
    // Deliberately left off: this flag blocks AI crawlers, which is the
    // opposite of what this site needs.
    blockAiBots: false,
    disallow: ['/telegram'],
  },

  sitemap: {
    exclude: ['/telegram'],
  },
```

- [ ] **Step 5: Добавить метатеги на страницы**

В `app/pages/index.vue` в начало `<script setup>`:

```js
useSeoMeta({
  title: 'Aleksei Kagan — Frontend & Fullstack Developer',
  description:
    'Frontend and fullstack developer with 7 years of experience building React and Vue interfaces, Node.js APIs and AI-powered features shipped to production.',
})
```

В `app/pages/about.vue`:

```js
useSeoMeta({
  title: 'About & Experience — Aleksei Kagan',
  description:
    'Seven years of professional experience across React, Vue, Node.js and AI integration, including two products currently live in production.',
})
```

В `app/pages/lab.vue`:

```js
useSeoMeta({
  title: 'Code Lab — Interactive Demos by Aleksei Kagan',
  description:
    'Interactive technical demos running live in the browser: sorting algorithm visualisation and a Three.js 3D model viewer.',
})
```

В `app/pages/privacy-policy.vue`:

```js
useSeoMeta({
  title: 'Privacy Policy — Aleksei Kagan',
  description:
    'How this site and its related applications collect, store and process personal data, and how to request deletion.',
})
```

В `app/pages/telegram.vue`:

```js
useSeoMeta({
  title: 'Telegram Login Demo — Aleksei Kagan',
  description:
    'A demonstration of the official Telegram Login Widget wired to a serverless signature check.',
  robots: 'noindex, nofollow',
})
```

- [ ] **Step 6: Запустить тесты**

Run: `npm run test:prerender`
Expected: PASS.

- [ ] **Step 7: Проверить глазами то, что увидит краулер**

Run: `npm run build`
Then: `head -40 .output/public/index.html`
Expected: в выводе видны `<title>`, `<meta name="description">`,
`<link rel="canonical">` и текст заголовка — без исполнения JavaScript.

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "feat: add robots, sitemap and per-page metadata"
```

---

### Task 7: Редиректы со старых URL и конфигурация Vercel

**Files:**
- Modify: `vercel.json`
- Create: `test/unit/vercel-config.spec.js`

**Interfaces:**
- Consumes: маршруты из Task 3.
- Produces: `vercel.json` без `rewrites`, с четырьмя постоянными редиректами
  и явным `outputDirectory`.

- [ ] **Step 1: Написать падающий тест `test/unit/vercel-config.spec.js`**

```js
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const config = JSON.parse(
  readFileSync(join(process.cwd(), 'vercel.json'), 'utf8')
)

const EXPECTED_REDIRECTS = {
  '/frontend': '/about',
  '/ai': '/about',
  '/codelab': '/lab',
}

describe('vercel.json', () => {
  it('has no catch-all rewrite, which would break static generation', () => {
    expect(config.rewrites).toBeUndefined()
  })

  it('serves the generated static output', () => {
    expect(config.outputDirectory).toBe('.output/public')
  })

  it.each(Object.entries(EXPECTED_REDIRECTS))(
    'redirects %s to %s permanently',
    (source, destination) => {
      const rule = config.redirects.find((r) => r.source === source)

      expect(rule).toBeDefined()
      expect(rule.destination).toBe(destination)
      expect(rule.permanent).toBe(true)
    }
  )

  it('does not redirect /privacy-policy, which keeps its URL', () => {
    const rule = config.redirects.find((r) => r.source === '/privacy-policy')

    expect(rule).toBeUndefined()
  })
})
```

- [ ] **Step 2: Запустить и убедиться, что падает**

Run: `npx vitest run test/unit/vercel-config.spec.js`
Expected: FAIL — в `vercel.json` есть `rewrites` и нет `redirects`.

- [ ] **Step 3: Переписать `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "redirects": [
    { "source": "/frontend", "destination": "/about", "permanent": true },
    { "source": "/ai", "destination": "/about", "permanent": true },
    { "source": "/codelab", "destination": "/lab", "permanent": true }
  ]
}
```

Catch-all rewrite `/(.*)` → `/` удалён: он нужен был SPA, а на статике
уничтожил бы все сгенерированные страницы, отдавая главную по любому адресу.

`/telegram` не редиректится — страница остаётся, но закрыта от индексации
в Task 6. `/privacy-policy` сохраняет свой адрес.

- [ ] **Step 4: Запустить тесты**

Run: `npx vitest run test/unit/vercel-config.spec.js`
Expected: PASS.

- [ ] **Step 5: Проверить редиректы на реальном развёртывании**

Задеплоить предпросмотр и выполнить:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://<preview-url>/frontend
```

Expected: `308 https://<preview-url>/about`

Vercel отдаёт `308` для постоянных редиректов — это корректный постоянный
редирект, поисковые системы трактуют его как `301`.

Если пришёл `200` вместо редиректа, значит Vercel использует Build Output API
и игнорирует корневой `vercel.json`. В этом случае перенести редиректы в
`routeRules` внутри `nuxt.config.js`:

```js
  routeRules: {
    '/frontend': { redirect: { to: '/about', statusCode: 301 } },
    '/ai': { redirect: { to: '/about', statusCode: 301 } },
    '/codelab': { redirect: { to: '/lab', statusCode: 301 } },
  },
```

и обновить `test/unit/vercel-config.spec.js`, чтобы он проверял `nuxt.config.js`.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: replace SPA rewrite with permanent redirects from legacy URLs"
```

---

### Task 8: Порог покрытия и приведение документации в порядок

**Files:**
- Modify: `vitest.config.js`
- Modify: `package.json`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: все тесты из Task 1–7.
- Produces: сборка падает, если покрытие ниже 80%.

- [ ] **Step 1: Замерить текущее покрытие**

Run: `npm run test:coverage`
Expected: отчёт выводится. Записать фактические проценты.

- [ ] **Step 2: Включить пороги в `vitest.config.js`**

```js
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['test/unit/**/*.spec.js'],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{js,vue}', 'server/**/*.js'],
      exclude: ['app/components/ThreeModelViewer.vue', 'app/components/AlgorithmVisualiser.vue'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

Визуализаторы исключены из покрытия: это интерактивные демо на canvas и WebGL,
их поведение проверяется глазами, а юнит-тесты на них дали бы покрытие без проверки.
Исключение зафиксировано явно, а не спрятано за общим порогом.

- [ ] **Step 3: Запустить и посмотреть, проходит ли порог**

Run: `npm run test:coverage`
Expected: если порог не достигнут — vitest завершится с ошибкой и перечислит
файлы с низким покрытием.

- [ ] **Step 4: Дописать недостающие тесты**

Для каждого файла ниже порога написать тест, проверяющий его поведение через
`mountSuspended`. Образец для страницы:

```js
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AboutPage from '../../app/pages/about.vue'

describe('about page', () => {
  it('renders both the experience and AI sections', async () => {
    const wrapper = await mountSuspended(AboutPage)

    expect(wrapper.text()).toContain('Professional Experience')
    expect(wrapper.text()).toContain('AI Integration')
  })
})
```

**Не писать тесты ради процента.** Если для достижения порога остаётся только
тестировать тривиальный геттер или строчку разметки — остановиться, оставить
покрытие ниже порога, понизить порог в конфиге до фактического значения и
записать причину комментарием рядом. Ложное покрытие вреднее низкого.

- [ ] **Step 5: Исправить `CLAUDE.md`**

Заменить разделы, описывающие несуществующее. Раздел `## Commands`:

```markdown
## Commands

```bash
npm run dev            # dev server (Nuxt, localhost:3000)
npm run build          # static generation to .output/public
npm run preview        # preview the generated output
npm run test           # unit and integration tests
npm run test:coverage  # tests with coverage thresholds
npm run test:prerender # generate, then assert the raw HTML crawlers receive
npm run test:mutation  # mutation testing over server/
```
```

Раздел `**Theme system:**` удалить целиком — описанный в нём класс
`layout--light` в коде не существует, а композабл темы удалён как мёртвый код.

В `**Key third-party integrations:**` удалить упоминание `vanta` — зависимость
удалена, на главной анимированного фона нет.

Заменить `**Routing:**` на:

```markdown
**Routing:** File-based via `app/pages/`. Nav links are defined as a data array
in `app/layouts/default.vue` — add new routes there when adding pages.
Redirects from legacy URLs live in `vercel.json`.
```

- [ ] **Step 6: Удалить мёртвую зависимость**

```bash
npm uninstall vanta
```

`vanta` не импортируется ни одним файлом — проверить перед удалением:

Run: `grep -rn "vanta" app/ server/ --include="*.vue" --include="*.js"`
Expected: пустой вывод.

- [ ] **Step 7: Полный прогон**

Run: `npm run test:prerender && npm run test:coverage && npm run test:mutation`
Expected: все три команды завершаются успешно.

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "chore: enforce coverage thresholds and correct project docs"
```

---

## Критерии готовности плана

Проверяются после Task 8, все — командой:

| # | Критерий | Команда |
|---|---|---|
| 1 | Текст есть в сыром HTML | `curl -A "GPTBot" https://<url>/ \| grep "<h1"` |
| 2 | Все маршруты пререндерены | `npm run test:prerender` |
| 3 | Метатеги и canonical на месте | `npm run test:prerender` |
| 4 | AI-краулеры не заблокированы | `curl https://<url>/robots.txt` |
| 5 | Старые URL отдают редирект | `curl -I https://<url>/frontend` |
| 6 | Покрытие не ниже 80% | `npm run test:coverage` |
| 7 | Мутационный балл не ниже 80 | `npm run test:mutation` |
| 8 | Lighthouse SEO 100, Performance > 90 | Lighthouse по мобильному профилю |

## Что дальше

Второй план — `2026-08-XX-content-repositioning.md`: локализация RU/EN
с переносом английского контента на `/en/`, новый продающий контент, страницы
услуг и кейсов, JSON-LD сущностей, `llms.txt`. Таблица редиректов из Task 7
обновляется там на префиксные адреса.
