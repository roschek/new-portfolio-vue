<template>
  <section class="ai">
    <div class="ai__container">

      <header class="ai__header">
        <h2 class="ai__title t-h1">AI Integration</h2>
        <p class="ai__lead t-body">
          Shipping products that put AI to practical use — private companions, document generators,
          helpdesk automation. Not demos: production apps used by real people.
        </p>
      </header>

      <div class="ai__timeline">
        <article
          v-for="(item, index) in timeline"
          :key="index"
          class="ai__item"
          ref="timelineItems"
        >
          <div class="ai__marker"></div>
          <div class="ai__content">
            <div class="ai__item-meta">
              <span class="ai__item-year t-mono">{{ item.year }}</span>
              <span v-if="item.own" class="ai__own-badge">Own product</span>
            </div>
            <h3 class="ai__item-title">{{ item.title }}</h3>
            <p class="ai__item-description t-body">{{ item.description }}</p>
            <ul class="ai__outcomes">
              <li
                v-for="(outcome, idx) in item.outcomes"
                :key="idx"
                class="ai__outcome"
              >{{ outcome }}</li>
            </ul>
            <div class="ai__technologies">
              <span
                v-for="(tech, idx) in item.technologies"
                :key="idx"
                class="ai__technology"
              >{{ tech }}</span>
            </div>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const timeline = [
  {
    title: 'iSolace — Private AI Companion',
    year: '2025 – Present',
    own: true,
    description: 'Solo-built and shipped a Flutter AI companion app to Google Play. The core product promise: conversations stay private. Messages are end-to-end encrypted and never leave the device unencrypted.',
    outcomes: [
      'End-to-end encrypted conversation storage — zero plaintext on server.',
      'Persistent session memory: the AI carries full context across all conversations.',
      'Low-latency voice + text pipeline built on top of OpenAI API.',
    ],
    technologies: ['Flutter', 'Dart', 'OpenAI API', 'E2EE', 'Voice'],
  },
  {
    title: 'ProfileNexus — AI Resume Builder',
    year: '2024 – Present',
    own: true,
    description: 'Full-stack AI tool that generates job-specific resumes and cover letters. Built every layer solo: Flutter frontend, FastAPI backend, and Gemini API integration for context-aware generation.',
    outcomes: [
      'Gemini API prompt chain tailors output to job description and user experience.',
      'i18n support shipped at launch; deployed on Vercel + Render with CI/CD pipeline.',
      'Sole developer across frontend, backend, infra, and AI integration.',
    ],
    technologies: ['Flutter', 'Python', 'FastAPI', 'Gemini API', 'Vercel', 'CI/CD'],
  },
  {
    title: 'Customer Support Automation',
    year: '2023',
    description: 'Built conversational helpdesk bots for enterprise clients using LangChain and OpenAI. The bots handle intent classification, ticket routing, and first-response drafts — cutting manual triage time.',
    outcomes: [
      'LangChain orchestration layer with retrieval-augmented generation over client knowledge bases.',
      'OpenAI integration for intent detection and dynamic response generation.',
      'Deployed via Next.js widget embeddable in any support portal.',
    ],
    technologies: ['LangChain', 'OpenAI', 'Next.js', 'Node.js', 'RAG'],
  },
  {
    title: 'Image Synthesis Pipeline',
    year: '2022',
    description: 'Built a unified REST API wrapping Stable Diffusion and DALL-E for internal content teams. Single endpoint, model routing based on task type (photo-realistic vs. illustration), result caching.',
    outcomes: [
      'Unified API surface across two model providers with transparent fallback logic.',
      'Result deduplication cache reduced API spend by ~35% on repeated prompts.',
      'Python/FastAPI service deployable as a standalone microservice or Vercel function.',
    ],
    technologies: ['Stable Diffusion', 'DALL-E', 'Python', 'FastAPI', 'REST API'],
  },
]

const timelineItems = ref([])

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ai__item--visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  if (timelineItems.value) {
    timelineItems.value.forEach(item => observer.observe(item))
  }
})
</script>

<style scoped>
.ai {
  padding: 4rem 2rem 6rem;
  min-height: 80vh;
  background-color: var(--bg);
}

.ai__container {
  max-width: 900px;
  margin: 0 auto;
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.ai__header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--line);
}

.ai__title {
  margin: 0 0 1rem;
  color: var(--text);
}

.ai__lead {
  margin: 0;
  max-width: 600px;
  color: var(--text-muted);
}

/* ─── Timeline ───────────────────────────────────────────────────────────── */
.ai__timeline {
  position: relative;
  padding-left: 2rem;
  border-left: 1px solid var(--line);
}

.ai__item {
  position: relative;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.ai__item--visible {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .ai__item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.ai__marker {
  position: absolute;
  top: 0.35rem;
  left: -2.4rem;
  width: 10px;
  height: 10px;
  background-color: var(--accent);
  border-radius: 50%;
  border: 2px solid var(--bg);
}

.ai__content {
  background-color: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.5rem 1.75rem;
  transition: border-color 0.2s ease;
}

.ai__item:hover .ai__content {
  border-color: var(--bg-border);
}

/* ─── Item internals ─────────────────────────────────────────────────────── */
.ai__item-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.ai__item-year {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.ai__own-badge {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  background-color: var(--accent-dim);
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
}

.ai__item-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.75rem;
}

.ai__item-description {
  color: var(--text-muted);
  margin: 0 0 1.25rem;
}

/* ─── Outcomes ───────────────────────────────────────────────────────────── */
.ai__outcomes {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.ai__outcome {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  padding-left: 1.2rem;
  position: relative;
  line-height: 1.5;
}

.ai__outcome::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 0.85rem;
}

/* ─── Tech tags ──────────────────────────────────────────────────────────── */
.ai__technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.ai__technology {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  background-color: transparent;
  border: 1px solid var(--bg-border);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius);
  transition: border-color 0.2s, color 0.2s;
}

.ai__technology:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ─── Mobile ─────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .ai {
    padding: 3rem 1.25rem 4rem;
  }

  .ai__timeline {
    padding-left: 1.5rem;
  }

  .ai__marker {
    left: -2rem;
  }

  .ai__content {
    padding: 1.25rem;
  }
}
</style>
