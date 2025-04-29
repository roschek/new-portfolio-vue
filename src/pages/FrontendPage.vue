<template>
  <section class="experience">
    <div class="experience__container">
      <h2 class="experience__title">Professional Experience</h2>

      <div class="experience__grid">
        <div v-for="(job, index) in jobs" :key="index" class="experience__card">
          <div class="experience__card-content">
            <div>
              <h3 class="experience__position">{{ job.position }}</h3>
              <template v-if="job.path">
                <a :href="job.path" class="experience__company" target="_blank">{{ job.company }} | {{ job.period }}</a>
              </template>
              <template v-else>
                <p class="experience__company">{{ job.company }} | {{ job.period }}</p>
              </template>
              <ul class="experience__achievements">
                <li v-for="(achievement, idx) in job.achievements" :key="idx" class="experience__achievement">
                  {{ achievement }}
                </li>
              </ul>
            </div>
            <div class="experience__technologies">
              <span v-for="(tech, idx) in job.technologies" :key="idx" class="experience__technology">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const jobs = [
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
</script>

<style scoped>

.experience {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.experience__container {
  max-width: 1200px;
  width: 100%;
}

.experience__title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.experience__grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.experience__card {
  background-color: #1F2937;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.experience__card:hover {
  transform: scale(1.05);
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
}

.experience__company {
  font-size: 1rem;
  color: #38bdf8;
  margin-bottom: 1rem;
  display: block;
}

.experience__achievements {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #ccc;
  font-size: 0.9rem;
}

.experience__achievement {
  margin-bottom: 0.5rem;
}

.experience__technologies {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.experience__technology {
  background-color: #2563eb;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: white;
}
</style>
