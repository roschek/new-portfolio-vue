<template>
  <main class="page ai">
    <section class="section section--first">
      <SectionHead label="§ 00 / AI & Automation" :level="1">
        AI that <em>ships</em>
        <template #lead>
          Speech, language models and bots wired into real products — with keys, limits and
          failure modes handled. Below: what is in production, and the Telegram bots I build.
        </template>
      </SectionHead>
    </section>

    <!-- ── § 01 AI in production ───────────────────────────────────────── -->
    <section class="section ai__projects">
      <SectionHead label="§ 01 / AI in production">Models doing <em>real work</em></SectionHead>

      <article
        v-for="(project, index) in projects"
        :id="project.id"
        :key="project.id"
        v-reveal
        class="project"
      >
        <p class="label project__meta">
          <span>AI · {{ pad(index + 1) }}</span>
          <span class="label__dim">{{ project.year }}</span>
          <span v-if="project.own" class="project__own">Own product</span>
        </p>
        <div class="project__main">
          <h3 class="project__title">{{ project.title }}</h3>
          <p class="project__text">{{ project.description }}</p>
          <ul class="project__outcomes">
            <li v-for="outcome in project.outcomes" :key="outcome">{{ outcome }}</li>
          </ul>
          <div class="project__foot">
            <ul class="tags">
              <li v-for="tech in project.technologies" :key="tech" class="tags__item">{{ tech }}</li>
            </ul>
            <RouterLink v-if="project.caseLink" :to="project.caseLink" class="project__link">
              Full case <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>
      </article>
    </section>

    <!-- ── § 02 Telegram bots ──────────────────────────────────────────── -->
    <section id="telegram" v-reveal class="section ai__telegram">
      <SectionHead label="§ 02 / Telegram bots">Bots that <em>do the work</em>
        <template #lead>
          Production bots for payment alerts, AI-powered support and onboarding flows.
          Try the live demo below.
        </template>
      </SectionHead>

      <ol class="bots">
        <li v-for="(bot, index) in bots" :key="bot.title" class="bots__item">
          <p class="label label--dim">BOT · {{ pad(index + 1) }}</p>
          <h3 class="bots__title">{{ bot.title }}</h3>
          <p class="bots__text">
            {{ bot.text }}
            <a v-if="bot.anchor" :href="bot.anchor" class="bots__more">See § 01 →</a>
          </p>
        </li>
      </ol>

      <TelegramDemo />
    </section>

    <!-- ── § 03 Talk ───────────────────────────────────────────────────── -->
    <section v-reveal class="section section--talk accent">
      <p class="label">§ 03 / Talk</p>
      <h2 class="talk__title">Need AI in <em>your product?</em></h2>
      <p class="talk__text">LLM, speech and bot features built into real products — scoped, shipped and maintained.</p>
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
import TelegramDemo from '../components/TelegramDemo.vue'

const pad = (n) => String(n).padStart(2, '0')

const projects = [
  {
    id: 'lecture-translator',
    title: 'Lecture Translator',
    year: '2026',
    own: true,
    caseLink: '/portfolio#lecture-translator',
    description:
      'An installable PWA that listens to a lecture and translates it live into English, Hebrew, Russian, German or Spanish, then turns the transcript into a summary.',
    outcomes: [
      'Real-time speech recognition and translation over a streaming WebSocket (Soniox), with auto-reconnect and autosave every few seconds.',
      'Summaries through Gemini, Claude or OpenAI — the user picks the provider and brings their own key; no server in between.',
      'Lectures are stored on the device in IndexedDB; core logic covered by tests at 92%.',
    ],
    technologies: ['Soniox', 'Gemini', 'Claude', 'OpenAI', 'Vue 3', 'PWA'],
  },
  {
    id: 'profilenexus',
    title: 'ProfileNexus — AI Resume Builder',
    year: '2024 – now',
    own: true,
    caseLink: '/portfolio#profilenexus',
    description:
      'Full-stack AI tool that generates job-specific resumes and cover letters. Built every layer solo: Flutter frontend, FastAPI backend, and Gemini API integration for context-aware generation.',
    outcomes: [
      'Gemini API prompt chain tailors output to job description and user experience.',
      'i18n support shipped at launch; deployed on Vercel + Render with CI/CD pipeline.',
      'Sole developer across frontend, backend, infra, and AI integration.',
    ],
    technologies: ['Flutter', 'Python', 'FastAPI', 'Gemini API', 'Vercel', 'CI/CD'],
  },
  {
    id: 'ai-support',
    title: 'Customer Support Automation',
    year: '2023',
    description:
      'Built conversational helpdesk bots for enterprise clients using LangChain and OpenAI. The bots handle intent classification, ticket routing, and first-response drafts — cutting manual triage time.',
    outcomes: [
      'LangChain orchestration layer with retrieval-augmented generation over client knowledge bases.',
      'OpenAI integration for intent detection and dynamic response generation.',
      'Deployed via Next.js widget embeddable in any support portal.',
    ],
    technologies: ['LangChain', 'OpenAI', 'Next.js', 'Node.js', 'RAG'],
  },
  {
    id: 'image-pipeline',
    title: 'Image Synthesis Pipeline',
    year: '2022',
    description:
      'Built a unified REST API wrapping Stable Diffusion and DALL-E for internal content teams. Single endpoint, model routing based on task type (photo-realistic vs. illustration), result caching.',
    outcomes: [
      'Unified API surface across two model providers with transparent fallback logic.',
      'Result deduplication cache reduced API spend by ~35% on repeated prompts.',
      'Python/FastAPI service deployable as a standalone microservice or Vercel function.',
    ],
    technologies: ['Stable Diffusion', 'DALL-E', 'Python', 'FastAPI', 'REST API'],
  },
]

const bots = [
  {
    title: 'AI Customer Support',
    text: 'Retrieval-augmented bots over client knowledge bases — automated first response and ticket routing.',
    anchor: '#ai-support',
  },
  {
    title: 'Payment & Payout Alerts',
    text: 'Real-time transaction notifications integrated with payment APIs — built for the payouts.com tech stack with inline action buttons.',
  },
  {
    title: 'Onboarding & Data Collection',
    text: 'Conversational flows with inline keyboards for user onboarding, form data collection, and CRM integration via webhooks.',
  },
]
</script>

<style scoped>
.ai__projects {
  padding-block-start: clamp(2rem, 5vw, 3rem);
}

/* Projects */
.project {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 1.5rem;
  padding-block: 2.5rem;
  border-block-end: 1px dashed var(--line);
  scroll-margin-block-start: 5rem;
}

.project:first-of-type {
  padding-block-start: 0;
}

.project__meta {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: flex-start;
}

.project__own {
  padding: 0.2rem 0.55rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-size: 0.65rem;
}

.project__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
}

.project__text {
  margin: 0;
  max-width: 62ch;
  font-size: 1.05rem;
  line-height: 1.6;
}

.project__outcomes {
  margin: 0;
  padding-inline-start: 1.1rem;
  list-style: square;
  color: var(--text-muted);
  line-height: 1.6;
}

.project__outcomes li::marker {
  color: var(--accent);
}

.project__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.project__link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent);
  text-decoration: none;
}

.project__link:hover {
  text-decoration: underline;
}

/* Telegram */
.ai__telegram {
  scroll-margin-block-start: 4rem;
}

.bots {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  margin: 0 0 3.5rem;
  padding: 0;
  list-style: none;
}

.bots__item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--line);
}

.bots__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.bots__text {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.bots__more {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .project {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }

  .project__meta {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .bots {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
