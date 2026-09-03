<template>
  <section class="experience">
    <div class="experience__container">

      <header class="experience__header">
        <h2 class="experience__title t-h1">Portfolio</h2>
        <a href="/files/alexey-kagan-cv.pdf" download class="experience__resume-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download CV
        </a>
      </header>

      <div class="experience__filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search roles, skills, companies…"
          class="experience__search"
          aria-label="Search experience"
        />
        <div class="experience__tech-filters">
          <button
            v-for="tech in topTechnologies"
            :key="tech"
            :class="['experience__tech-filter', { 'experience__tech-filter--active': selectedTech === tech }]"
            @click="toggleTechFilter(tech)"
          >
            {{ tech }}
          </button>
          <button
            v-if="selectedTech || searchQuery"
            class="experience__tech-filter experience__tech-filter--reset"
            @click="resetFilters"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="experience__list">
        <article
          v-for="(job, index) in filteredJobs"
          :key="index"
          class="experience__entry"
          :class="{ 'experience__entry--own': job.own }"
        >
          <div class="experience__entry-aside">
            <span class="experience__entry-period t-mono">{{ job.period }}</span>
            <img
              v-if="job.icon"
              :src="job.icon"
              :alt="job.company + ' logo'"
              class="experience__logo"
              loading="lazy"
            />
          </div>

          <div class="experience__entry-body">
            <div class="experience__entry-top">
              <div>
                <span v-if="job.own" class="experience__own-badge">Own product</span>
                <span class="experience__entry-role t-label">{{ job.position }}</span>
              </div>
              <template v-if="job.path">
                <a :href="job.path" class="experience__entry-company" target="_blank" rel="noopener">
                  {{ job.company }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </template>
              <template v-else>
                <h3 class="experience__entry-company experience__entry-company--plain">{{ job.company }}</h3>
              </template>
            </div>

            <ul class="experience__achievements">
              <li
                v-for="(achievement, idx) in getVisibleAchievements(job, index)"
                :key="idx"
                class="experience__achievement"
              >
                {{ achievement }}
              </li>
            </ul>
            <button
              v-if="job.achievements.length > 3"
              @click="toggleJobDetails(index)"
              class="experience__toggle"
            >
              {{ expandedJobs[index] ? 'Show less ↑' : 'Show more ↓' }}
            </button>

            <div class="experience__tags">
              <span
                v-for="(tech, idx) in job.technologies"
                :key="idx"
                class="experience__tag"
                :class="{ 'experience__tag--active': isHighlighted(tech) }"
                @click="toggleTechFilter(tech)"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </article>

        <div v-if="filteredJobs.length === 0" class="experience__empty">
          <p>No matching experience found.</p>
          <button @click="resetFilters" class="experience__reset-btn">Clear filters</button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const jobs = [
  {
    position: 'Creator / Fullstack Developer',
    company: 'Love is Date — Speed Dating Platform',
    path: 'https://loveisdate.co.il/',
    period: '2026 – Present',
    own: true,
    achievements: [
      'Built the whole platform solo: public site, admin panel, and the app that runs the events.',
      'Shipped a signup form that registers participants for upcoming events.',
      'Built an admin panel for creating and scheduling events.',
      'Implemented the event app where participants rate each other and results are calculated on the spot.',
    ],
    technologies: ['Nest.js', 'Firebase', 'Node.js'],
  },
  {
    position: 'Creator / Flutter Developer',
    company: 'iSolace: Private AI Companion',
    path: 'https://play.google.com/store/apps/details?id=com.kagan.pocketpsycholog',
    period: '2025 – Present',
    own: true,
    icon: '/images/isolace-icon.png',
    achievements: [
      'Designed and shipped a private AI companion app to Google Play — solo, from idea to production.',
      'Implemented end-to-end encryption (E2EE) for all conversations — messages never leave the device unencrypted.',
      'Built continuous session memory so the AI carries full context across conversations.',
      'Added voice and text interaction with low-latency response pipeline.',
    ],
    technologies: ['Flutter', 'Dart', 'OpenAI API', 'E2EE', 'Voice'],
  },
  {
    position: 'Creator / Fullstack Developer',
    company: 'ProfileNexus — AI Resume Builder',
    path: 'https://app.alex-kagan-develop.com/',
    period: '2024 – Present',
    own: true,
    achievements: [
      'Sole developer — built Flutter/Dart frontend, Python/FastAPI backend, and CI/CD pipeline entirely solo.',
      'Integrated Gemini API for context-aware, job-specific resume and cover letter generation.',
      'Shipped i18n support and production deployment on Vercel + Render.',
    ],
    technologies: ['Flutter', 'Dart', 'Python', 'FastAPI', 'Gemini API', 'Vercel', 'CI/CD'],
  },
  {
    position: 'Senior Fullstack Developer',
    company: 'payouts.com',
    path: 'https://payouts.com/',
    period: 'Jan 2023 – Present',
    achievements: [
      'Led a team of 5 developers — reduced bug count by 30% through code review culture and test coverage.',
      'Optimised page load time by 40% via code splitting, lazy loading, and bundle analysis.',
      'Designed modular role-based authorisation system serving multiple product lines.',
      'Migrated entire codebase to TypeScript, eliminating a class of runtime errors.',
    ],
    technologies: ['React', 'TypeScript', 'Redux', 'Jest', 'REST API'],
  },
  {
    position: 'Fullstack Developer',
    company: 'Korus Consulting',
    path: 'https://korusconsulting.com/',
    period: 'Dec 2020 – Jan 2023',
    achievements: [
      'Built LaModa Marketplace checkout module — conversion rate improved by 15%.',
      'Developed interactive warehouse management system with real-time inventory tracking.',
      'Built analytics dashboard for performance monitoring across distributed logistics systems.',
    ],
    technologies: ['Vue.js', 'Vuex', 'JavaScript', 'Express', 'MongoDB'],
  },
  {
    position: 'Fullstack Developer',
    company: 'Nota.Media',
    path: 'https://notamedia.com/',
    period: 'Sep 2018 – Dec 2020',
    achievements: [
      'Built full-stack marketplace: Vue.js frontend, Nest.js/MongoDB backend.',
      'Developed cross-platform mobile app with Flutter shipped to both iOS and Android.',
    ],
    technologies: ['Vue.js', 'Flutter', 'Nest.js', 'MongoDB'],
  },
  {
    position: 'Fullstack Developer',
    company: 'Yandex',
    period: '2016 – 2018',
    achievements: [
      'Built and maintained front-end components for Yandex products serving tens of millions of users.',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
  },
]

const searchQuery = ref('')
const selectedTech = ref(null)
const expandedJobs = ref(Array(jobs.length).fill(false))

const topTechnologies = ['React', 'Vue.js', 'TypeScript', 'OpenAI API', 'Python']

const filteredJobs = computed(() => {
  let result = [...jobs]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(job =>
      job.position.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.achievements.some(a => a.toLowerCase().includes(q)) ||
      job.technologies.some(t => t.toLowerCase().includes(q))
    )
  }

  if (selectedTech.value) {
    result = result.filter(job =>
      job.technologies.some(t => t.toLowerCase() === selectedTech.value.toLowerCase())
    )
  }

  return result
})

function toggleTechFilter(tech) {
  selectedTech.value = selectedTech.value === tech ? null : tech
}

function resetFilters() {
  searchQuery.value = ''
  selectedTech.value = null
  expandedJobs.value = Array(jobs.length).fill(false)
}

function toggleJobDetails(index) {
  expandedJobs.value[index] = !expandedJobs.value[index]
}

function getVisibleAchievements(job, index) {
  return expandedJobs.value[index] ? job.achievements : job.achievements.slice(0, 3)
}

function isHighlighted(tech) {
  return (
    (selectedTech.value && tech.toLowerCase() === selectedTech.value.toLowerCase()) ||
    (searchQuery.value && tech.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
}
</script>

<style scoped>
.experience {
  padding: 4rem 2rem 6rem;
  min-height: 80vh;
  background-color: var(--bg);
}

.experience__container {
  max-width: 900px;
  margin: 0 auto;
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.experience__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--line);
}

.experience__title {
  margin: 0;
  padding-bottom: 0;
  position: relative;
}

.experience__title::after {
  content: '';
  position: absolute;
  bottom: -1.5rem;
  left: 0;
  width: 2.5rem;
  height: 2px;
  background-color: var(--accent);
}

.experience__resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--bg-border);
  padding: 0.45rem 1rem;
  border-radius: 2rem;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.experience__resume-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ─── Filters ────────────────────────────────────────────────────────────── */
.experience__filters {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.experience__search {
  padding: 0.7rem 1rem;
  border-radius: var(--radius);
  background-color: var(--bg-elevated);
  border: 1px solid var(--line);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  width: 100%;
  transition: border-color 0.2s ease;
}

.experience__search::placeholder {
  color: var(--text-faint);
}

.experience__search:focus {
  outline: none;
  border-color: var(--accent);
}

.experience__tech-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.experience__tech-filter {
  padding: 0.3rem 0.75rem;
  border-radius: 2rem;
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid var(--line);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.experience__tech-filter:hover {
  border-color: var(--bg-border);
  color: var(--text);
}

.experience__tech-filter--active {
  background-color: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.experience__tech-filter--reset {
  border-color: transparent;
  color: var(--text-faint);
}

.experience__tech-filter--reset:hover {
  color: var(--text-muted);
  border-color: var(--line);
}

/* ─── Entry list ─────────────────────────────────────────────────────────── */
.experience__list {
  display: flex;
  flex-direction: column;
}

.experience__entry {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0 2.5rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--line);
}

.experience__entry:first-child {
  padding-top: 0;
}

/* ─── Aside (period + logo) ──────────────────────────────────────────────── */
.experience__entry-aside {
  padding-top: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.experience__entry-period {
  color: var(--text-faint);
  font-size: 0.8rem;
  white-space: nowrap;
}

.experience__logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--line);
}

/* ─── Body ───────────────────────────────────────────────────────────────── */
.experience__entry-top {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.experience__own-badge {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  background-color: var(--accent-dim);
  padding: 0.2rem 0.55rem;
  border-radius: 2rem;
  margin-bottom: 0.4rem;
}

.experience__entry-role {
  display: block;
  color: var(--accent);
  margin-bottom: 0.15rem;
}

.experience__entry-company {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.35rem;
  color: var(--text);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s ease;
  line-height: 1.2;
}

.experience__entry-company:hover {
  color: var(--accent);
}

.experience__entry-company--plain {
  margin: 0;
  font-size: 1.35rem;
}

/* ─── Achievements ───────────────────────────────────────────────────────── */
.experience__achievements {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.experience__achievement {
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-muted);
  padding-left: 1.2rem;
  position: relative;
}

.experience__achievement::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 0.8rem;
  top: 0.05em;
}

.experience__toggle {
  background: none;
  border: none;
  color: var(--text-faint);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.8rem;
  padding: 0;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}

.experience__toggle:hover {
  color: var(--accent);
}

/* ─── Tech tags ──────────────────────────────────────────────────────────── */
.experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.experience__tag {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-faint);
  border: 1px solid var(--line);
  padding: 0.2rem 0.65rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.experience__tag:hover,
.experience__tag--active {
  border-color: var(--accent);
  color: var(--accent);
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
.experience__empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-muted);
}

.experience__reset-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.25rem;
  background-color: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.experience__reset-btn:hover {
  background-color: var(--accent-hi);
}

/* ─── Own product highlight ──────────────────────────────────────────────── */
.experience__entry--own .experience__entry-company {
  font-size: 1.45rem;
}

/* ─── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .experience {
    padding: 3rem 1.25rem 4rem;
  }

  .experience__entry {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 2rem 0;
  }

  .experience__entry-aside {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0;
  }

  .experience__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
