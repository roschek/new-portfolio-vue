<template>
  <section class="experience">
    <div class="experience__container">
      <h2 class="experience__title">Professional Experience</h2>
      
      <div class="experience__filters">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search skills, roles..." 
          class="experience__search"
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
            class="experience__tech-filter experience__tech-filter--reset"
            @click="resetFilters"
            v-if="selectedTech"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="experience__grid">
        <div 
          v-for="(job, index) in filteredJobs" 
          :key="index" 
          class="experience__card"
          ref="jobCards"
        >
          <div class="experience__card-content">
            <div>
              <h3 class="experience__position">{{ job.position }}</h3>
              <template v-if="job.path">
                <a :href="job.path" class="experience__company" target="_blank" rel="noopener">
                  {{ job.company }} | {{ job.period }}
                </a>
              </template>
              <template v-else>
                <p class="experience__company">{{ job.company }} | {{ job.period }}</p>
              </template>
              <ul class="experience__achievements">
                <li 
                  v-for="(achievement, idx) in getVisibleAchievements(job, index)" 
                  :key="idx" 
                  class="experience__achievement"
                >
                  {{ achievement }}
                  <span 
                    v-for="(tag, tagIdx) in extractTags(achievement)" 
                    :key="tagIdx"
                    class="experience__tag"
                  >
                    {{ tag }}
                  </span>
                </li>
              </ul>
              <button 
                v-if="job.achievements.length > 3" 
                @click="toggleJobDetails(index)"
                class="experience__toggle"
              >
                {{ expandedJobs[index] ? 'Show less' : 'Show more' }}
              </button>
            </div>
            <div class="experience__technologies">
              <span 
                v-for="(tech, idx) in job.technologies" 
                :key="idx" 
                class="experience__technology"
                :class="{ 'experience__technology--highlight': isHighlighted(tech) }"
                @click="toggleTechFilter(tech)"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredJobs.length === 0" class="experience__empty">
        <p>No matching experience found.</p>
        <button @click="resetFilters" class="experience__reset-button">Reset Filters</button>
      </div>
      
      <div class="experience__resume">
        <a href="/files/alexey-kagan-cv.docx" download class="experience__resume-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Resume
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const jobs = [
{
    position: 'Creator / Fullstack Developer',
    company: 'ProfileNexus (AI Resume Builder)',
    path: 'https://app.alex-kagan-develop.com/',
    period: '2024 - Present',
    achievements: [
      'Engineered a full-stack AI application to generate job-specific resumes and cover letters.',
      'Developed a robust Python (FastAPI) backend with asynchronous task processing for AI generation.',
      'Built a responsive and localized (i18n) web-client using Flutter/Dart.',
      'Configured and deployed the entire infrastructure using a CI/CD pipeline on Vercel and Render.',
    ],
    technologies: ['Flutter', 'Dart', 'Python', 'FastAPI', 'Gemini API', 'Vercel', 'Render', 'CI/CD'],
  },
  {
    position: 'Senior Frontend Developer',
    company: 'payouts.com',
    path: 'https://payouts.com/',
    period: 'Jan 2023 - Present',
    achievements: [
      'Led a team of 5 developers, reducing bugs by 30%',
      'Designed modular authorization system with role-based access',
      'Optimized loading time by 40% through code splitting',
      'Integrated TypeScript across the project',
      'Created reusable UI components',
    ],
    technologies: ['React', 'TypeScript', 'Redux', 'REST API', 'Jest'],
  },
  {
    position: 'Frontend Developer',
    company: 'Korus Consulting',
    path: 'https://korusconsulting.com/',
    period: 'Dec 2020 - Jan 2023',
    achievements: [
      'Developed LaModa MarketPlace client module (conversion +15%)',
      'Created interactive warehouse management system',
      'Integrated customs oil declaration system',
      'Developed analytical performance monitoring tool',
    ],
    technologies: ['Vue 2/3', 'Vuex', 'JavaScript', 'Express', 'MongoDB'],
  },
  {
    position: 'Frontend/Fullstack Developer',
    company: 'Nota.Media',
    path: 'https://notamedia.com/',
    period: 'Sep 2018 - Dec 2020',
    achievements: [
      'Built small business support system interfaces',
      'Created NFT trading platform with blockchain integration',
      'Developed marketplace backend with Nest.js and MongoDB',
      'Built cross-platform mobile app with Flutter',
    ],
    technologies: ['Vue.js', 'Flutter', 'Nest.js', 'MongoDB'],
  },
  {
    position: 'Frontend Developer',
    company: 'Webjet (Freelance Projects)',
    period: 'Freelance',
    achievements: [
      'Developed over 10 responsive web applications',
      'Optimized UIs for mobile (UX +25%)',
      'Integrated WordPress CMS for clients',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'WordPress'],
  }
]

const searchQuery = ref('')
const selectedTech = ref(null)
const expandedJobs = ref(Array(jobs.length).fill(false))
const jobCards = ref([])

const topTechnologies = ['React', 'Vue.js', 'TypeScript', 'JavaScript', 'MongoDB']

const filteredJobs = computed(() => {
  let result = [...jobs]
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(job => {
      return (
        job.position.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.achievements.some(achievement => achievement.toLowerCase().includes(query)) ||
        job.technologies.some(tech => tech.toLowerCase().includes(query))
      )
    })
  }
  
  if (selectedTech.value) {
    result = result.filter(job => 
      job.technologies.some(tech => 
        tech.toLowerCase() === selectedTech.value.toLowerCase()
      )
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
  
  nextTick(() => {
    if (jobCards.value && jobCards.value.length) {
      jobCards.value.forEach((card, index) => {
        if (card) {
          card.classList.remove('experience__card--animate')
          setTimeout(() => {
            card.classList.add('experience__card--animate')
          }, index * 100)
        }
      })
    }
  })
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

function extractTags(text) {
  const keywords = ['React', 'TypeScript', 'Redux', 'Vue', 'JavaScript', 'REST API', 
                   'MongoDB', 'Express', 'Firebase', 'CI/CD', 'Flutter', 'Nest.js']
  
  return keywords.filter(keyword => 
    text.includes(keyword) || 
    text.includes(keyword.toLowerCase())
  )
}

onMounted(() => {
  if (jobCards.value && jobCards.value.length) {
    jobCards.value.forEach((card, index) => {
      setTimeout(() => {
        if (card) card.classList.add('experience__card--animate')
      }, index * 150)
    })
  }
})
</script>

<style scoped>
.experience {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #0F172A;
}

.experience__container {
  max-width: 1200px;
  width: 100%;
}

.experience__title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
  position: relative;
  padding-bottom: 0.5rem;
}

.experience__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #2563EB, transparent);
  border-radius: 3px;
}

.experience__filters {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience__search {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(107, 114, 128, 0.3);
  color: white;
  width: 100%;
  transition: all 0.3s ease;
}

.experience__search:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
}

.experience__tech-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.experience__tech-filter {
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  background-color: rgba(31, 41, 55, 0.5);
  color: #CBD5E1;
  border: 1px solid rgba(107, 114, 128, 0.2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.experience__tech-filter:hover {
  background-color: rgba(43, 55, 75, 0.8);
  color: white;
}

.experience__tech-filter--active {
  background-color: #2563EB;
  color: white;
  border-color: #2563EB;
}

.experience__tech-filter--reset {
  background-color: rgba(239, 68, 68, 0.2);
  color: #FCA5A5;
  border-color: rgba(239, 68, 68, 0.3);
}

.experience__tech-filter--reset:hover {
  background-color: rgba(239, 68, 68, 0.3);
}

.experience__grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 2rem;
}

.experience__card {
  background-color: rgba(31, 41, 55, 0.7);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
}

.experience__card--animate {
  opacity: 1;
  transform: translateY(0);
}

.experience__card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
}

.experience__card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.experience__position {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.experience__company {
  font-size: 1rem;
  color: #38bdf8;
  margin-bottom: 1rem;
  display: block;
  text-decoration: none;
}

.experience__company:hover {
  text-decoration: underline;
}

.experience__achievements {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #E2E8F0;
  font-size: 0.9rem;
}

.experience__achievement {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.experience__tag {
  display: inline-block;
  background-color: rgba(37, 99, 235, 0.2);
  color: #60A5FA;
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-weight: 500;
}

.experience__toggle {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.25rem 0;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}

.experience__toggle:hover {
  color: #93C5FD;
  text-decoration: underline;
}

.experience__technologies {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.experience__technology {
  background-color: rgba(36, 59, 85, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #94A3B8;
  transition: all 0.3s ease;
  cursor: pointer;
}

.experience__technology:hover {
  background-color: rgba(37, 99, 235, 0.3);
  color: white;
  transform: translateY(-2px);
}

.experience__technology--highlight {
  background-color: rgba(37, 99, 235, 0.4);
  color: white;
}

.experience__empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #94A3B8;
}

.experience__reset-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2563EB;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.experience__reset-button:hover {
  background-color: #1D4ED8;
}

.experience__resume {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.experience__resume-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563EB;
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.experience__resume-button:hover {
  background-color: #1D4ED8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .experience__tech-filters {
    justify-content: center;
  }
}
</style>