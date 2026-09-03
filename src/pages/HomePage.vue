<template>
  <main class="home" :class="{ 'home--ready': isReady }">

    <!-- ── Hero ────────────────────────────────────────────────────────── -->
    <section class="home__hero">
      <div class="home__hero-inner">

        <div class="home__rule home__rule--top"></div>

        <h1 class="home__name t-display">Aleksei Kagan</h1>

        <div class="home__rule home__rule--bottom"></div>

        <div class="home__tagline">
          <div class="home__typewriter">
            <span
              v-for="(role, index) in roles"
              :key="index"
              :class="['home__role', { 'home__role--active': currentRoleIndex === index }]"
            >
              {{ role }}
            </span>
          </div>
        </div>

        <p class="home__subtitle">
          <span>Creating Interfaces.</span>
          <span>Automating Workflows.</span>
          <span>Powering Ideas.</span>
        </p>

        <div class="home__availability">
          <span class="home__badge home__badge--open">Open to full-time</span>
          <span class="home__badge">Available for consulting</span>
        </div>

        <nav class="home__cta">
          <a href="#about" class="home__button home__button--primary">
            My Stack
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          <a href="/portfolio" class="home__button home__button--secondary">
            Work &amp; Projects
          </a>
        </nav>

        <ul class="home__socials">
          <li v-for="(social, index) in socials" :key="index">
            <a
              :href="social.url"
              target="_blank"
              class="home__social-link"
              :aria-label="social.name"
            >
              <span class="home__social-icon" v-html="social.icon"></span>
            </a>
          </li>
        </ul>

      </div>
    </section>

    <!-- ── About ───────────────────────────────────────────────────────── -->
    <section class="home__about-section">
      <div class="home__about-inner">
        <article class="home__about-text">
          <h2 class="home__section-title t-h1">About Me</h2>
          <p class="home__text">
            7 years building products end-to-end — React and Vue frontends, Node.js APIs,
            and AI-powered features shipped to real users.
          </p>
          <p class="home__text">
            Currently shipping three own products:
            <a href="https://play.google.com/store/apps/details?id=com.kagan.pocketpsycholog" target="_blank" rel="noopener">iSolace</a>
            — a private AI companion app with E2E encryption,
            <a href="https://app.alex-kagan-develop.com" target="_blank" rel="noopener">ProfileNexus</a>
            — an AI resume builder, and
            <a href="https://loveisdate.co.il/" target="_blank" rel="noopener">Love is Date</a>
            — a speed dating platform running live events. All in production.
          </p>
          <p class="home__text">
            Available for senior full-time roles and consulting in full-stack development
            and AI integration.
          </p>
          <div class="home__about-cta">
            <a href="mailto:roscheka@gmail.com" class="home__button home__button--primary">
              Let's talk
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
            <a href="/portfolio" class="home__button home__button--secondary">
              Work &amp; Projects
            </a>
          </div>
        </article>

        <aside id="about" class="home__stack">
          <div
            v-for="group in techStack"
            :key="group.label"
            class="home__stack-group"
          >
            <h3 class="home__stack-label t-label">{{ group.label }}</h3>
            <ul class="home__stack-tags">
              <li v-for="tag in group.tags" :key="tag" class="home__stack-tag">
                {{ tag }}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isReady = ref(false)

const roles = ['Fullstack Developer', 'Vue.js Expert', 'React Specialist', 'AI Integration Engineer', 'Node.js Engineer']
const currentRoleIndex = ref(0)
const roleInterval = ref(null)

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

function startRoleAnimation() {
  roleInterval.value = setInterval(() => {
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
  }, 3000)
}

onMounted(() => {
  // Trigger animations on next frame so CSS transitions fire
  requestAnimationFrame(() => {
    isReady.value = true
  })

  startRoleAnimation()

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const el = document.querySelector(this.getAttribute('href'))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  })
})

onBeforeUnmount(() => {
  if (roleInterval.value) clearInterval(roleInterval.value)
})
</script>

<style scoped>
.home {
  background-color: var(--bg);
  color: var(--text);
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
.home__hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 4rem 2rem 3rem;
}

.home__hero-inner {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

/* Ruled lines — animate on .home--ready */
.home__rule {
  height: 1px;
  background-color: var(--accent);
  width: 0;
  transition: width 0s; /* overridden below */
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__rule {
    animation: extend-rule 0.5s ease-out forwards;
  }

  .home--ready .home__rule--bottom {
    animation-delay: 0.05s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__rule {
    width: 100%;
  }
}

@keyframes extend-rule {
  from { width: 0; }
  to   { width: 100%; }
}

/* Name */
.home__name {
  margin: 1.25rem 0;
  color: var(--text);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__name {
    animation: drop-in 0.45s ease-out 0.5s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__name { opacity: 1; }
}

@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateY(-28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tagline / typewriter */
.home__tagline {
  margin-top: 1.5rem;
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__tagline {
    animation: fade-up 0.4s ease-out 0.85s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__tagline { opacity: 1; }
}

.home__typewriter {
  position: relative;
  height: 1.6em;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.home__role {
  position: absolute;
  left: 0;
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--accent);
  opacity: 0;
  transform: translateY(1em);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.home__role--active {
  opacity: 1;
  transform: translateY(0);
}

/* Subtitle */
.home__subtitle {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 1.25rem 0 0;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-muted);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__subtitle {
    animation: fade-up 0.4s ease-out 1s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__subtitle { opacity: 1; }
}

/* Availability badges */
.home__availability {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__availability {
    animation: fade-up 0.4s ease-out 0.95s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__availability { opacity: 1; }
}

.home__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--bg-border);
  padding: 0.35rem 0.8rem;
  border-radius: 2rem;
}

.home__badge--open {
  color: var(--text);
  border-color: #4ade80;
}

.home__badge--open::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #4ade80;
  flex-shrink: 0;
}

/* CTA */
.home__cta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__cta {
    animation: fade-up 0.4s ease-out 1.15s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__cta { opacity: 1; }
}

/* Socials */
.home__socials {
  display: flex;
  gap: 0.75rem;
  margin-top: 2.5rem;
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .home--ready .home__socials {
    animation: fade-up 0.4s ease-out 1.3s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home__socials { opacity: 1; }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buttons */
.home__button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.4rem;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

.home__button--primary {
  background-color: var(--accent);
  color: var(--bg);
}

.home__button--primary:hover {
  background-color: var(--accent-hi);
  color: var(--bg);
  transform: translateY(-1px);
}

.home__button--secondary {
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid var(--bg-border);
}

.home__button--secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Social links */
.home__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid var(--bg-border);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.home__social-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.home__social-icon {
  display: flex;
}

/* ─── About / Skills section ─────────────────────────────────────────────── */
.home__about-section {
  padding: 5rem 2rem 6rem;
  border-top: 1px solid var(--line);
}

.home__about-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
}

.home__section-title {
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.75rem;
}

.home__section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2.5rem;
  height: 2px;
  background-color: var(--accent);
}

.home__text {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.75;
  margin-bottom: 1.25rem;
}

.home__about-cta {
  margin-top: 2rem;
}

/* Tech stack */
.home__stack {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.home__stack-label {
  margin-bottom: 0.75rem;
}

.home__stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.home__stack-tag {
  font-family: var(--font-body);
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text-muted);
  background-color: var(--bg-elevated);
  border: 1px solid var(--line);
  padding: 0.3rem 0.75rem;
  border-radius: 2rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.home__stack-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ─── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .home__about-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .home__hero {
    padding: 3rem 1.5rem 2rem;
    min-height: 80vh;
    align-items: flex-start;
    padding-top: 5rem;
  }

  .home__about-section {
    padding: 3rem 1.5rem 4rem;
  }
}

@media (max-width: 480px) {
  .home__hero {
    padding: 3rem 1rem 2rem;
  }

  .home__socials {
    flex-wrap: wrap;
  }
}
</style>
