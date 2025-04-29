<template>
  <section class="sbg-[#0F172A] text-white  flex-1 px-8">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold mb-12 text-center">Professional Experience</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(job, index) in jobs" :key="index"
          class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300 flex flex-col justify-between">
          <div class="p-6 flex flex-col justify-between h-full">
            <div>
              <h3 class="text-2xl font-semibold mb-2">{{ job.position }}</h3>
              <template v-if="job.path">
                <a :href="job.path" class="text-blue-400 mb-2" target="_blank">{{ job.company }} | {{ job.period }}</a>
              </template>
              <template v-else>
                <p class="text-blue-400 mb-2">{{ job.company }} | {{ job.period }}</p>
              </template>
              <ul class="list-disc list-inside text-gray-400 mb-4 text-sm">
                <li v-for="(achievement, idx) in job.achievements" :key="idx">{{ achievement }}</li>
              </ul>
            </div>
            <div class="mt-auto">
              <div class="flex flex-wrap gap-2">
                <span v-for="(tech, idx) in job.technologies" :key="idx"
                  class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                  {{ tech }}
                </span>
              </div>
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
