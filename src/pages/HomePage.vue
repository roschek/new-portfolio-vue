<template>
  <section class="home" ref="vantaRef">
    <div class="home__content">      
      <div class="home__main">
        <div class="home__main-content">
          <h1 class="home__title">
            <span
              v-for="(letter, index) in titleArray"
              :key="index"
              class="home__title-letter"
              :style="{ animationDelay: (index * 0.05) + 's' }"
            >
              <template v-if="letter === ' '">&nbsp;</template>
              <template v-else>{{ letter }}</template>
            </span>
          </h1>

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

          <div class="home__cta">
            <a href="#about" class="home__button home__button--primary">
              My Work
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
            <a href="mailto:roscheka@gmail.com" class="home__button home__button--secondary">
              Contact Me
            </a>
          </div>

          <div class="home__socials">
            <a 
              v-for="(social, index) in socials" 
              :key="index"
              :href="social.url" 
              target="_blank" 
              class="home__social-link"
              :aria-label="social.name"
              :style="{ animationDelay: (index * 0.1 + 0.5) + 's' }"
            >
              <span class="home__social-icon" v-html="social.icon"></span>
            </a>
          </div>
        </div>

        <div class="home__profile">
          <div class="home__profile-container">
            <div class="home__profile-image-container">
              <div class="home__profile-image-backdrop"></div>
              <div class="home__profile-image"></div>
            </div>
            
            <div class="home__stats">
              <div 
                v-for="(stat, index) in stats" 
                :key="index" 
                class="home__stat"
                :style="{ animationDelay: (index * 0.1 + 0.2) + 's' }"
              >
                <div class="home__stat-value">{{ stat.value }}</div>
                <div class="home__stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="about" class="home__about">
        <div class="home__about-container">
          <div class="home__about-intro">
            <h2 class="home__section-title">About Me</h2>
            <div class="home__about-content">
              <p class="home__text">
                Hi, I'm Aleksei Kagan — Senior Frontend and Fullstack Developer with over 7 years of experience building high-performance web applications.
              </p>
              <p class="home__text">
                I specialize in creating responsive, user-friendly interfaces using modern frameworks like React and Vue.js, backed by robust Node.js solutions. My passion lies at the intersection of technology and user experience, focusing on creating applications that not only function flawlessly but also delight users.
              </p>
              <p class="home__text">
                When I'm not coding, I enjoy exploring new technologies, contributing to open source, and mentoring junior developers. I believe in continuous learning and always staying ahead of industry trends.
              </p>

              <div class="home__about-cta">
                <a href="/frontend" class="home__button home__button--secondary">
                  View My Work
                </a>
                <!-- <a href="/files/resume.pdf" download class="home__button home__button--outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download CV
                </a> -->
              </div>
            </div>
          </div>

          <div class="home__skills">
            <h3 class="home__skills-title">Core Skills</h3>
            <div class="home__skills-grid">
              <div 
                v-for="(skill, index) in skills" 
                :key="index" 
                class="home__skill"
                :style="{ animationDelay: (index * 0.05) + 's' }"
              >
                <div class="home__skill-icon" v-html="skill.icon"></div>
                <div class="home__skill-info">
                  <h4 class="home__skill-name">{{ skill.name }}</h4>
                  <div class="home__skill-level">
                    <div 
                      class="home__skill-progress" 
                      :style="{ width: skill.level + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="home__projects">
        <h2 class="home__section-title">Featured Projects</h2>
        <div class="home__projects-grid">
          <div 
            v-for="(project, index) in projects" 
            :key="index"
            class="home__project"
            :style="{ animationDelay: (index * 0.1) + 's' }"
          >
            <div class="home__project-content">
              <h3 class="home__project-title">{{ project.title }}</h3>
              <p class="home__project-description">{{ project.description }}</p>
              <div class="home__project-techs">
                <span 
                  v-for="(tech, techIndex) in project.technologies" 
                  :key="techIndex"
                  class="home__project-tech"
                >
                  {{ tech }}
                </span>
              </div>
              <a :href="project.link" class="home__project-link">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
            <div class="home__project-image" :style="{ backgroundImage: `url(${project.image})` }">
              <div class="home__project-overlay"></div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="home__scroll-indicator">
      <div class="home__scroll-mouse">
        <div class="home__scroll-wheel"></div>
      </div>
      <div class="home__scroll-text">Scroll Down</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import WAVES from 'vanta/dist/vanta.waves.min'

const vantaRef = ref(null)
const vantaEffect = ref(null)

const title = 'Hi, I am Aleksei Kagan'
const titleArray = title.split('')

const roles = ['Frontend Developer', 'Vue.js Expert', 'React Specialist', 'UI/UX Enthusiast', 'Fullstack Engineer']
const currentRoleIndex = ref(0)
const roleInterval = ref(null)

const socials = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/alexey-kagan',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/roschek',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/roschek',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .67 4.302l16.5 7.5a2.25 2.25 0 0 0 3.052-2.118V4.535a2.242 2.242 0 0 0-2.7-2.102z"></path><path d="M10.002 16.5L15.5 12l-5.5-4.5v9z"></path></svg>'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/972539310707',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
  },
  {
    name: 'Email',
    url: 'mailto:roscheka@gmail.com',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>'
  }
]

const stats = [
  { value: '7+', label: 'Years Experience' },
  { value: '50+', label: 'Projects' },  
]

const skills = [
  {
    name: 'JavaScript / TypeScript',
    level: 95,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
  },
  {
    name: 'React',
    level: 90,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>'
  },
  {
    name: 'Vue.js',
    level: 95,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>'
  },
  {
    name: 'Node.js',
    level: 85,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
  },
  {
    name: 'CSS / SASS',
    level: 90,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>'
  },
  {
    name: 'API Integration',
    level: 85,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
  }
]

const projects = [
  {
    title: 'Payouts Dashboard',
    description: 'A comprehensive payout management system with role-based access and real-time data visualization.',
    technologies: ['React', 'TypeScript', 'Redux'],
    link: '/frontend',
    image: '/api/placeholder/500/300'
  },
  {
    title: 'NFT Trading Platform',
    description: 'Secure blockchain-based marketplace for NFT creators and collectors with wallet integration.',
    technologies: ['Vue.js', 'Web3', 'Node.js'],
    link: '/frontend',
    image: '/api/placeholder/500/300'
  },
  {
    title: 'AI Assistant Chatbot',
    description: 'Intelligent customer support chatbot with natural language processing and learning capabilities.',
    technologies: ['OpenAI', 'Next.js', 'TailwindCSS'],
    link: '/ai',
    image: '/api/placeholder/500/300'
  },
  {
    title: 'Telegram Bot API',
    description: 'Automated notification and management system integrated with Telegram for business workflows.',
    technologies: ['Node.js', 'Telegram API', 'MongoDB'],
    link: '/telegram',
    image: '/api/placeholder/500/300'
  }
]

function startRoleAnimation() {
  roleInterval.value = setInterval(() => {
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
  }, 3000)
}

function scrollToSection(target) {
  const element = document.querySelector(target)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  
  if (!vantaEffect.value) {
    vantaEffect.value = WAVES({
      el: vantaRef.value,
      THREE,
      color: 0x38bdf8,
      shininess: 60,
      waveHeight: 15,
      waveSpeed: 1.2,
      zoom: 0.9,
      mouseControls: true,
      touchControls: true,
    })
  }

  startRoleAnimation()

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()
      scrollToSection(this.getAttribute('href'))
    })
  })
})

onBeforeUnmount(() => {  
  if (roleInterval.value) {
    clearInterval(roleInterval.value)
  }

  if (vantaEffect.value) {
    vantaEffect.value.destroy()
  }
})
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: #0F172A;
}

.home__content {
  position: relative;
  z-index: 10;
  padding: 0 2rem;
}

.home__main {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.home__main-content {
  flex: 1;
  max-width: 600px;
  padding: 2rem 0;
}

.home__title {
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  white-space: nowrap;
}

.home__title-letter {
  display: inline-block;
  opacity: 0;
  animation: fade-in 0.5s forwards;
}

.home__tagline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.home__tagline-prefix {
  color: #94A3B8;
}

.home__typewriter {
  position: relative;
  height: 1.5em;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.home__role {
  position: absolute;
  left: 0;
  color: #38BDF8;
  font-weight: 500;
  opacity: 0;
  transform: translateY(1em);
  transition: opacity 0.5s, transform 0.5s;
}

.home__role--active {
  opacity: 1;
  transform: translateY(0);
}

/* Подзаголовок */
.home__subtitle {
  font-size: 1.25rem;
  color: #CBD5E1;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Кнопки призыва к действию */
.home__cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.home__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.home__button--primary {
  background-color: #2563EB;
  color: white;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.home__button--primary:hover {
  background-color: #1D4ED8;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
}

.home__button--secondary {
  background-color: rgba(203, 213, 225, 0.1);
  color: #CBD5E1;
  border: 1px solid rgba(203, 213, 225, 0.2);
}

.home__button--secondary:hover {
  background-color: rgba(203, 213, 225, 0.15);
  color: white;
}

.home__button--outline {
  background-color: transparent;
  color: #94A3B8;
  border: 1px solid #94A3B8;
}

.home__button--outline:hover {
  background-color: rgba(148, 163, 184, 0.1);
  color: #CBD5E1;
}

/* Социальные ссылки */
.home__socials {
  display: flex;
  gap: 1.5rem;
}

.home__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(203, 213, 225, 0.1);
  color: #94A3B8;
  transition: all 0.3s ease;
  opacity: 0;
  animation: slide-up 0.5s forwards;
}

.home__social-link:hover {
  background-color: #2563EB;
  color: white;
  transform: translateY(-3px);
}

.home__social-icon {
  display: flex;
}

/* Профиль и фото */
.home__profile {
  flex: 1;
  max-width: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.home__profile-container {
  position: relative;
  width: 100%;
}

.home__profile-image-container {
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 1rem;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.home__profile-image-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2563EB, #38BDF8);
  z-index: 1;
}

.home__profile-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/api/placeholder/400/400');
  background-size: cover;
  background-position: center;
  z-index: 2;
  mix-blend-mode: luminosity;
  transition: mix-blend-mode 0.3s ease;
}

.home__profile-image:hover {
  mix-blend-mode: normal;
}

.home__stats {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.home__stat {
  text-align: center;
  opacity: 0;
  animation: slide-up 0.5s forwards;
}

.home__stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #38BDF8;
}

.home__stat-label {
  font-size: 0.875rem;
  color: #94A3B8;
}

/* Секция "Обо мне" */
.home__about {
  max-width: 1200px;
  margin: 6rem auto;
  padding: 3rem 0;
}

.home__about-container {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.home__about-intro {
  flex: 1;
  min-width: 300px;
}

.home__section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.home__section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 50%;
  height: 3px;
  background: linear-gradient(to right, #2563EB, transparent);
  border-radius: 3px;
}

.home__about-content {
  color: #CBD5E1;
  font-size: 1rem;
  line-height: 1.7;
}

.home__text {
  margin-bottom: 1.5rem;
}

.home__about-cta {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.home__skills {
  flex: 1;
  min-width: 300px;
}

.home__skills-title {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: #E2E8F0;
}

.home__skills-grid {
  display: grid;
  gap: 1.5rem;
}

.home__skill {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  animation: slide-up 0.5s forwards;
}

.home__skill:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(36, 59, 85, 0.5);
}

.home__skill-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: rgba(37, 99, 235, 0.2);
  color: #38BDF8;
}

.home__skill-info {
  flex: 1;
}

.home__skill-name {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #E2E8F0;
}

.home__skill-level {
  height: 0.5rem;
  width: 100%;
  background-color: rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  overflow: hidden;
}

.home__skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #2563EB, #38BDF8);
  border-radius: 1rem;
  transition: width 1.5s ease-in-out;
}

.home__projects {
  max-width: 1200px;
  margin: 6rem auto;
  padding: 3rem 0;
}

.home__projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 2rem;
}

.home__project {
  position: relative;
  height: 300px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  opacity: 0;
  animation: fade-in 0.8s forwards;
}

.home__project-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);
  transform: translateY(70%);
  transition: transform 0.3s ease;
  z-index: 2;
}

.home__project:hover .home__project-content {
  transform: translateY(0);
}

.home__project-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.home__project-description {
  font-size: 0.9rem;
  color: #CBD5E1;
  margin-bottom: 1.5rem;
}

.home__project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.home__project-tech {
  background-color: rgba(37, 99, 235, 0.3);
  color: #A5F3FC;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.home__project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #38BDF8;
  font-weight: 500;
  text-decoration: none;
  transition: gap 0.3s ease;
}

.home__project-link:hover {
  gap: 0.75rem;
}

.home__project-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 1s ease;
  z-index: 1;
}

.home__project:hover .home__project-image {
  transform: scale(1.1);
}

.home__project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.5));
  z-index: 1;
}

.home__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.home__scroll-indicator:hover {
  opacity: 1;
}

.home__scroll-mouse {
  width: 30px;
  height: 50px;
  border: 2px solid #CBD5E1;
  border-radius: 15px;
  position: relative;
}

.home__scroll-wheel {
  width: 6px;
  height: 6px;
  background-color: #CBD5E1;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll-down 2s infinite;
}

.home__scroll-text {
  font-size: 0.75rem;
  color: #CBD5E1;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scroll-down {
  0% {
    opacity: 1;
    top: 10px;
  }
  50% {
    opacity: 1;
    top: 25px;
  }
  100% {
    opacity: 0;
    top: 30px;
  }
}

@media (max-width: 1024px) {
  .home__main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .home__socials {
    justify-content: center;
  }
  
  .home__cta {
    justify-content: center;
  }
  
  .home__profile {
    margin-top: 2rem;
  }
  
  .home__projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .home__title {
    font-size: 2.5rem;
  }
  
  .home__about-container {
    flex-direction: column;
  }
  
  .home__scroll-indicator {
    display: none;
  }
}

@media (max-width: 480px) {
  .home__title {
    font-size: 2rem;
  }
  
  .home__cta {
    flex-direction: column;
  }
  
  .home__profile-image-container {
    width: 280px;
    height: 280px;
  }
}
</style>