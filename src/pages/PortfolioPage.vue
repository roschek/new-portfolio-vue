<template>
  <main class="page portfolio">
    <PageHero>
      <SectionHead label="§ 00 / Portfolio" :level="1">
        Work, <em>case by case</em>
        <template #lead>
          Four projects told as problem, solution and result — three products I build
          myself and the fintech platform I worked on — followed by the full timeline.
        </template>
      </SectionHead>
    </PageHero>

    <!-- ── § 01 Cases ──────────────────────────────────────────────────── -->
    <section class="section portfolio__cases">
      <SectionHead label="§ 01 / Cases">Problem, solution, <em>result</em></SectionHead>

      <article
        v-for="(item, index) in cases"
        :id="item.id"
        :key="item.id"
        v-reveal
        class="case"
        :class="{ 'case--shot': item.image }"
      >
        <header class="case__head">
          <p class="label">Case · {{ pad(index + 1) }} <span class="label__dim">· {{ item.period }}</span></p>
          <h3 class="case__name">{{ item.name }}</h3>
          <p class="case__role">{{ item.role }}</p>
        </header>

        <figure v-if="item.image" class="case__shot">
          <img :src="item.image" :alt="item.imageAlt" width="1000" height="625" loading="lazy" decoding="async" />
        </figure>

        <dl class="case__story">
          <div class="case__part">
            <dt class="label label--dim">Problem</dt>
            <dd>{{ item.problem }}</dd>
          </div>
          <div class="case__part">
            <dt class="label label--dim">Solution</dt>
            <dd>{{ item.solution }}</dd>
          </div>
          <div class="case__part case__part--result">
            <dt class="label">Result</dt>
            <dd>{{ item.result }}</dd>
          </div>
        </dl>

        <footer class="case__foot">
          <ul class="tags">
            <li v-for="tech in item.stack" :key="tech" class="tags__item">{{ tech }}</li>
          </ul>
          <component
            :is="item.internal ? RouterLink : 'a'"
            v-if="item.url"
            v-bind="item.internal ? { to: item.url } : { href: item.url, target: '_blank', rel: 'noopener' }"
            class="case__link"
          >{{ item.linkText }} <span aria-hidden="true">{{ item.internal ? '→' : '↗' }}</span></component>
        </footer>
      </article>
    </section>

    <!-- ── § 02 Experience ─────────────────────────────────────────────── -->
    <section v-reveal class="section">
      <SectionHead label="§ 02 / Experience">The <em>timeline</em></SectionHead>

      <ol class="timeline">
        <li v-for="job in jobs" :key="job.company" class="timeline__row">
          <p class="timeline__period">{{ job.period }}</p>
          <div class="timeline__body">
            <h3 class="timeline__company">
              <a v-if="job.url" :href="job.url" target="_blank" rel="noopener">{{ job.company }}</a>
              <template v-else>{{ job.company }}</template>
            </h3>
            <p class="label label--dim">{{ job.role }}</p>
            <ul v-if="job.points?.length" class="timeline__points">
              <li v-for="point in job.points" :key="point">{{ point }}</li>
            </ul>
            <p v-if="job.stack?.length" class="timeline__stack">{{ job.stack.join(' · ') }}</p>
          </div>
        </li>
      </ol>

      <div class="actions portfolio__cv">
        <a href="/files/alexey-kagan-cv.pdf" download class="btn btn--ghost">
          Download CV <span class="btn__arrow" aria-hidden="true">↓</span>
        </a>
      </div>
    </section>

    <!-- ── § 03 Talk ───────────────────────────────────────────────────── -->
    <section v-reveal class="section section--talk accent">
      <p class="label">§ 03 / Talk</p>
      <h2 class="talk__title">Have a project <em>like these?</em></h2>
      <p class="talk__text">Senior full-time roles and consulting in full-stack development and AI integration.</p>
      <div class="actions">
        <a href="mailto:roscheka@gmail.com" class="btn btn--primary">roscheka@gmail.com <span class="btn__arrow" aria-hidden="true">→</span></a>
        <a href="https://t.me/roschek" target="_blank" rel="noopener" class="btn btn--ghost">Telegram</a>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import SectionHead from '../components/SectionHead.vue'
import PageHero from '../components/PageHero.vue'

const pad = (n) => String(n).padStart(2, '0')

const cases = [
  {
    id: 'love-is-date',
    name: 'Love is Date',
    role: 'Co-founder with a partner · sole developer',
    period: '2026 – now',
    url: 'https://loveisdate.co.il/',
    linkText: 'loveisdate.co.il',
    image: '/images/work/love-is-date.webp',
    imageAlt: 'Love is Date landing page: speed dating for Russian speakers in Israel',
    problem:
      'Speed dating evenings ran on paper cards: participants signed up by hand, marked their choices on paper, and the organisers matched the cards manually after the event.',
    solution:
      'One platform built solo: a public site with event sign-up, an admin panel to create and schedule events, and an event app where participants rate each other and matches are calculated on the spot.',
    result:
      'Four events so far with 20–30 participants each. No more paper cards, matches are ready right away, and organising an evening takes less time and much less manual work.',
    stack: ['Nest.js', 'Node.js', 'Firebase'],
  },
  {
    id: 'profilenexus',
    name: 'ProfileNexus',
    role: 'Solo product — design, frontend, backend, infra',
    period: '2024 – now',
    url: 'https://app.alex-kagan-develop.com/',
    linkText: 'Open the app',
    image: '/images/work/profilenexus.webp',
    imageAlt: 'ProfileNexus: step 1 of 5, describe the vacancy',
    problem:
      'Job seekers have to adapt their resume to every vacancy. A general-purpose chatbot can help, but you have to explain everything from scratch each time.',
    solution:
      'A guided flow on Flutter and FastAPI: paste the vacancy, and Gemini generates a resume and cover letter tailored to it. Prompts and structure are already set up.',
    result:
      'A tailored resume takes less time to produce. Running in production on Vercel and Render with CI/CD and several interface languages.',
    stack: ['Flutter', 'Dart', 'Python', 'FastAPI', 'Gemini API', 'CI/CD'],
  },
  {
    id: 'lecture-translator',
    name: 'Lecture Translator',
    role: 'Solo product',
    period: '2026',
    url: '/translate/',
    internal: true,
    linkText: 'Try it',
    image: '/images/work/lecture-translator.webp',
    imageAlt: 'Lecture Translator: a saved lecture translated from Hebrew to English',
    problem:
      'Lectures in Hebrew are hard to follow for new immigrants, students and language learners — and for me.',
    solution:
      'An installable PWA: live speech recognition and translation into English, Hebrew, Russian, German or Spanish, a library of saved lectures, and summaries via Gemini, Claude or OpenAI. Users bring their own keys, so there is no server.',
    result:
      'Live on this site and installable on a phone. Core logic is covered by tests at 92%.',
    stack: ['Vue 3', 'PWA', 'Soniox', 'IndexedDB', 'Vitest'],
  },
  {
    id: 'payouts',
    name: 'payouts.com',
    role: 'Senior Fullstack Developer · team lead of 5',
    period: '2023 – 2026',
    url: 'https://payouts.com/',
    linkText: 'payouts.com',
    problem:
      'A marketing payouts aggregator with banking features, serving several product lines that each need their own access rules.',
    solution:
      'A modular role-based authorisation system shared by all product lines, a full migration to TypeScript, code splitting and lazy loading, and a code review and testing culture in the team.',
    result:
      '30% fewer bugs and 40% faster page loads. A whole class of runtime errors gone after the TypeScript migration.',
    stack: ['React', 'TypeScript', 'Redux', 'Jest', 'REST API'],
  },
]

const jobs = [
  {
    company: 'Vi-soft',
    role: 'Fullstack Developer',
    period: '2026 – now',
  },
  {
    company: 'payouts.com',
    url: 'https://payouts.com/',
    role: 'Senior Fullstack Developer',
    period: '2023 – 2026',
    points: [
      'Led a team of 5 developers — reduced bug count by 30% through code review culture and test coverage.',
      'Optimised page load time by 40% via code splitting, lazy loading, and bundle analysis.',
    ],
    stack: ['React', 'TypeScript', 'Redux', 'Jest'],
  },
  {
    company: 'Korus Consulting',
    url: 'https://korusconsulting.com/',
    role: 'Fullstack Developer',
    period: '2020 – 2023',
    points: [
      'Built LaModa Marketplace checkout module — conversion rate improved by 15%.',
      'Developed interactive warehouse management system with real-time inventory tracking.',
      'Built analytics dashboard for performance monitoring across distributed logistics systems.',
    ],
    stack: ['Vue.js', 'Vuex', 'JavaScript', 'Express', 'MongoDB'],
  },
  {
    company: 'Nota.Media',
    url: 'https://notamedia.com/',
    role: 'Fullstack Developer',
    period: '2018 – 2020',
    points: [
      'Built full-stack marketplace: Vue.js frontend, Nest.js/MongoDB backend.',
      'Developed cross-platform mobile app with Flutter shipped to both iOS and Android.',
    ],
    stack: ['Vue.js', 'Flutter', 'Nest.js', 'MongoDB'],
  },
  {
    company: 'Yandex',
    role: 'Fullstack Developer',
    period: '2016 – 2018',
    points: ['Built and maintained front-end components for Yandex products serving tens of millions of users.'],
    stack: ['HTML5', 'CSS3', 'JavaScript'],
  },
]
</script>

<style scoped>
.portfolio__cases {
  padding-block-start: clamp(2rem, 5vw, 3rem);
}

/* Case */
.case {
  display: grid;
  grid-template-areas: 'head' 'shot' 'story' 'foot';
  gap: 1.75rem;
  padding-block: 3rem;
  border-block-end: 1px dashed var(--line);
  scroll-margin-block-start: 5rem;
}

.case:first-of-type {
  padding-block-start: 0;
}

/* Screenshot sits beside the title, not across the whole column. */
.case--shot {
  grid-template-columns: minmax(0, 1fr) minmax(0, 24rem);
  grid-template-areas: 'head shot' 'story story' 'foot foot';
  column-gap: 2.5rem;
}

.case__head {
  grid-area: head;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.case__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4.5vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.case__role {
  margin: 0;
  color: var(--text-muted);
}

.case__shot {
  grid-area: shot;
  align-self: start;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: calc(var(--radius) * 2);
  background: var(--bg-elevated);
}

.case__shot img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.case:hover .case__shot img {
  transform: scale(1.02);
}

.case__story {
  grid-area: story;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  margin: 0;
}

.case__part {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--line);
}

.case__part--result {
  border-block-start-color: var(--accent);
}

.case__part dd {
  margin: 0;
  line-height: 1.6;
}

.case__foot {
  grid-area: foot;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.case__link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  color: var(--accent);
  text-decoration: none;
}

.case__link:hover {
  text-decoration: underline;
}

/* Timeline */
.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__row {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 1.5rem;
  padding-block: 1.5rem;
  border-block-end: 1px dashed var(--line);
}

.timeline__period {
  margin: 0;
  padding-block-start: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.timeline__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline__company {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
}

.timeline__company a {
  color: inherit;
  text-decoration: none;
}

.timeline__company a:hover {
  color: var(--accent);
}

.timeline__points {
  list-style: square;
  margin: 0.25rem 0 0;
  padding-inline-start: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.timeline__points ::marker {
  color: var(--accent);
}

.timeline__stack {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-faint);
}

.portfolio__cv {
  margin-block-start: 2rem;
}

@media (max-width: 760px) {
  .case--shot {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'head' 'shot' 'story' 'foot';
  }

  .case__shot img {
    aspect-ratio: 2 / 1;
    object-fit: cover;
    object-position: top;
  }

  .case__story {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  .timeline__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.4rem;
  }
}
</style>
