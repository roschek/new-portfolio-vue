<template>
  <main class="home" :class="{ 'home--ready': isReady }">

    <!-- ── Hero ────────────────────────────────────────────────────────── -->
    <section ref="hero" class="hero" @pointermove="moveSpotlight">
      <div class="hero__spotlight" aria-hidden="true"></div>
      <div class="hero__inner">
        <p class="label hero__label">§ 00 / Index <span class="label__dim">· Israel · {{ year }}</span></p>

        <h1 class="hero__name">
          <span class="hero__line">Aleksei</span>
          <span class="hero__line hero__line--serif"><em>Kagan</em></span>
        </h1>

        <p class="hero__lede">
          Full-stack engineer who ships <em>products</em>, not just features —
          Vue and React interfaces, Node.js APIs and AI that real users touch.
        </p>

        <ul class="hero__meta">
          <li>Senior Fullstack</li>
          <li>AI integration</li>
          <li>9 years</li>
          <li>3 products live</li>
        </ul>

        <div class="hero__actions">
          <a href="mailto:roscheka@gmail.com" class="btn btn--primary">
            Let's talk <span class="btn__arrow" aria-hidden="true">→</span>
          </a>
          <RouterLink to="/portfolio" class="btn btn--ghost">Work &amp; projects</RouterLink>
        </div>

        <ul class="hero__socials">
          <li v-for="social in socials" :key="social.name">
            <a :href="social.url" target="_blank" rel="noopener" class="hero__social" :aria-label="social.name">
              <span v-html="social.icon"></span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── § 01 Services ───────────────────────────────────────────────── -->
    <section v-reveal class="section">
      <SectionHead label="§ 01 / Services">What I can <em>build</em> for you</SectionHead>
      <ol class="services">
        <li v-for="(service, index) in services" :key="service.title" class="services__item">
          <p class="label label--dim">SVC · {{ pad(index + 1) }}</p>
          <h3 class="services__title">{{ service.title }}</h3>
          <p class="services__text">{{ service.text }}</p>
          <p class="services__tags">{{ service.tags.join(' · ') }}</p>
        </li>
      </ol>
    </section>

    <!-- ── § 02 Selected work ──────────────────────────────────────────── -->
    <section v-reveal class="section">
      <SectionHead label="§ 02 / Selected work">Products in <em>production</em></SectionHead>
      <ul class="work">
        <li v-for="(item, index) in work" :key="item.name">
          <RouterLink :to="`/portfolio#${item.slug}`" class="work__item">
            <span class="work__num">{{ pad(index + 1) }}</span>
            <span class="work__body">
              <span class="work__name">{{ item.name }}</span>
              <span class="work__text">{{ item.text }}</span>
              <span class="work__tags">{{ item.tags.join(' · ') }}</span>
            </span>
            <span class="work__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- ── § 03 Now ────────────────────────────────────────────────────── -->
    <section v-reveal class="section">
      <SectionHead label="§ 03 / Now" :note="`${year} · ${month}`">What I'm doing <em>this month</em></SectionHead>
      <dl class="now">
        <div v-for="entry in nowEntries" :key="entry.term" class="now__row">
          <dt class="label label--dim">{{ entry.term }}</dt>
          <dd class="now__value">{{ entry.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── § 04 Stack ──────────────────────────────────────────────────── -->
    <section id="about" v-reveal class="section">
      <SectionHead label="§ 04 / Stack">Tools I <em>trust</em></SectionHead>
      <div class="stack">
        <div v-for="group in techStack" :key="group.label" class="stack__group">
          <p class="label label--dim">{{ group.label }}</p>
          <ul class="stack__tags">
            <li v-for="tag in group.tags" :key="tag" class="stack__tag">{{ tag }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── § 05 Talk ───────────────────────────────────────────────────── -->
    <section v-reveal class="section section--talk">
      <p class="label">§ 05 / Talk</p>
      <h2 class="talk__title">Let's build <em>something</em> real.</h2>
      <p class="talk__text">Projects and consulting in full-stack development and AI integration.</p>
      <div class="actions">
        <a href="mailto:roscheka@gmail.com" class="btn btn--primary">roscheka@gmail.com <span class="btn__arrow" aria-hidden="true">→</span></a>
        <a href="https://t.me/roschek" target="_blank" rel="noopener" class="btn btn--ghost">Telegram</a>
        <a href="https://wa.me/972539310707" target="_blank" rel="noopener" class="btn btn--ghost">WhatsApp</a>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHead from '../components/SectionHead.vue'

const isReady = ref(false)
const hero = ref(null)

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const pad = (n) => String(n).padStart(2, '0')

const socials = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/alexey-kagan',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/roschek',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/roschek',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .67 4.302l16.5 7.5a2.25 2.25 0 0 0 3.052-2.118V4.535a2.242 2.242 0 0 0-2.7-2.102z"></path><path d="M10.002 16.5L15.5 12l-5.5-4.5v9z"></path></svg>'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/972539310707',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
  },
  {
    name: 'Email',
    url: 'mailto:roscheka@gmail.com',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>'
  }
]

const techStack = [
  {
    label: 'Frontend',
    tags: ['React', 'Vue.js 3', 'TypeScript', 'Redux', 'CSS / SASS', 'Vite']
  },
  {
    label: 'Backend',
    tags: ['Node.js', 'Python', 'FastAPI', 'Nest.js', 'MongoDB', 'REST APIs']
  },
  {
    label: 'AI & APIs',
    tags: ['OpenAI API', 'Gemini API', 'LangChain', 'Stable Diffusion', 'Prompt Engineering']
  },
  {
    label: 'Mobile & Tools',
    tags: ['Flutter', 'Android', 'Vercel', 'CI/CD', 'Git', 'Docker']
  }
]

const services = [
  {
    title: 'Prototype → Production',
    text: 'Web apps from idea to a deployed product: interface, API, database, hosting and monitoring.',
    tags: ['Vue', 'React', 'Node.js', 'Vercel'],
  },
  {
    title: 'AI features that ship',
    text: 'LLM, speech and translation features wired into real products — with keys, limits and failure modes handled.',
    tags: ['OpenAI', 'Gemini', 'Claude', 'Soniox'],
  },
  {
    title: 'Consulting & audits',
    text: 'Architecture reviews, performance work and an extra senior pair of hands for your team.',
    tags: ['Architecture', 'Performance', 'Mentoring'],
  },
]

const work = [
  {
    name: 'Love is Date',
    text: 'Speed dating platform that replaced paper cards at live events.',
    tags: ['Web platform', 'Events'],
    slug: 'love-is-date',
  },
  {
    name: 'ProfileNexus',
    text: 'AI resume builder that tailors a CV to each vacancy.',
    tags: ['AI', 'Web app'],
    slug: 'profilenexus',
  },
  {
    name: 'Lecture Translator',
    text: 'Live lecture translation in five languages, installable on a phone.',
    tags: ['PWA', 'Speech AI', 'Vue'],
    slug: 'lecture-translator',
  },
  {
    name: 'payouts.com',
    text: 'Marketing payouts aggregator and banking — senior full-stack, team lead.',
    tags: ['React', 'TypeScript', 'Fintech'],
    slug: 'payouts',
  },
]

const nowEntries = [
  { term: 'Building', value: 'Lecture Translator — live translation and summaries for lectures, as a PWA.' },
  { term: 'Running', value: 'ProfileNexus, Love is Date and Lecture Translator in production.' },
  { term: 'Open to', value: 'Projects and consulting.' },
]
function moveSpotlight(event) {
  const rect = hero.value.getBoundingClientRect()
  hero.value.style.setProperty('--x', `${event.clientX - rect.left}px`)
  hero.value.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

onMounted(() => {
  requestAnimationFrame(() => (isReady.value = true))
})
</script>

<style scoped>
.home {
  background-color: var(--bg);
  color: var(--text);
}

em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
}

/* ─── Shared ─────────────────────────────────────────────────────────────── */









/* ─── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  --x: 50%;
  --y: 40%;
  position: relative;
  overflow: hidden;
  min-height: 92vh;
  display: flex;
  align-items: center;
  padding: 5rem clamp(1.25rem, 5vw, 2rem) 4rem;
}

.hero__spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(560px circle at var(--x) var(--y), rgba(255, 107, 53, 0.13), transparent 60%);
  pointer-events: none;
  transition: background 0.1s linear;
}

.hero__inner {
  position: relative;
  width: min(100%, 1000px);
  margin-inline: auto;
}

.hero__name {
  margin: 1.5rem 0 2rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.6rem, 13vw, 9.5rem);
  line-height: 0.88;
  letter-spacing: -0.035em;
}

.hero__line {
  display: block;
}

.hero__line--serif em {
  font-size: 1.08em;
  letter-spacing: -0.01em;
}

.hero__lede {
  max-width: 34ch;
  margin: 0 0 2rem;
  font-size: clamp(1.15rem, 2.4vw, 1.5rem);
  line-height: 1.45;
  color: var(--text);
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin: 0 0 2.25rem;
  padding: 1rem 0;
  list-style: none;
  border-block: 1px dashed var(--line);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.hero__meta li + li::before {
  content: '·';
  margin-inline-end: 1.25rem;
  color: var(--text-faint);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero__socials {
  display: flex;
  gap: 0.5rem;
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

.hero__social {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--text-muted);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.hero__social:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.hero__social :deep(svg) {
  width: 16px;
  height: 16px;
}

/* Staggered entrance */
@media (prefers-reduced-motion: no-preference) {
  .hero__inner > * {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  .home--ready .hero__inner > * {
    opacity: 1;
    transform: none;
  }

  .home--ready .hero__inner > :nth-child(2) { transition-delay: 0.08s; }
  .home--ready .hero__inner > :nth-child(3) { transition-delay: 0.16s; }
  .home--ready .hero__inner > :nth-child(4) { transition-delay: 0.24s; }
  .home--ready .hero__inner > :nth-child(5) { transition-delay: 0.32s; }
  .home--ready .hero__inner > :nth-child(6) { transition-delay: 0.4s; }
}

/* ─── Sections ───────────────────────────────────────────────────────────── */





/* Services */
.services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.services__item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.75rem;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg-elevated);
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.services__item:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}

.services__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
}

.services__text {
  margin: 0;
  flex: 1;
  color: var(--text-muted);
  line-height: 1.55;
}

.services__tags {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-faint);
}

/* Work */
.work {
  margin: 0;
  padding: 0;
  list-style: none;
  border-block-start: 1px solid var(--line);
}

.work__item {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  align-items: baseline;
  gap: 1.25rem;
  padding-block: 1.6rem;
  border-block-end: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
}

.work__num {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.work__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.work__name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.3rem);
  line-height: 1.1;
  transition: color 0.2s ease;
}

.work__text {
  color: var(--text-muted);
}

.work__tags {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-faint);
}

.work__arrow {
  font-size: 1.5rem;
  color: var(--text-faint);
  transition: transform 0.25s ease, color 0.25s ease;
}

.work__item:hover .work__name,
.work__item:hover .work__arrow {
  color: var(--accent);
}

.work__item:hover .work__arrow {
  transform: translateX(4px);
}

/* Now */
.now {
  margin: 0;
}

.now__row {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 1.5rem;
  padding-block: 1.1rem;
  border-block-end: 1px dashed var(--line);
}

.now__value {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.5;
}

/* Stack */
.stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.stack__group {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.stack__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stack__tag {
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Talk */



@media (max-width: 600px) {
  .now__row {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .work__item {
    grid-template-columns: 2rem 1fr auto;
    gap: 0.75rem;
  }
}
</style>
