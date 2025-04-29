<template>
  <section class="bg-[#0F172A] text-white  flex-1 px-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold mb-12 text-center">AI Projects</h2>

      <div class="relative border-l-4 border-blue-500 pl-8 space-y-12">
        <div v-for="(item, index) in timeline" :key="index" class="relative">
          <div class="absolute -left-6 top-0 bg-blue-500 rounded-full w-4 h-4"></div>
          <h3 class="text-2xl font-semibold">{{ item.title }}</h3>
          <p class="text-gray-400 mt-2">{{ item.description }}</p>
          <div class="flex flex-wrap gap-2 mt-4">
            <span v-for="(tech, idx) in item.technologies" :key="idx"
              class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const timeline = [
  {
    title: 'AI Text Generation',
    description: 'Built tools for automatic blog writing, summaries, creative content using OpenAI models.',
    technologies: ['OpenAI', 'Node.js', 'Vue'],
  },
  {
    title: 'Image Synthesis',
    description: 'Created services to generate images from text using Stable Diffusion and DALL-E.',
    technologies: ['Stable Diffusion', 'DALL-E', 'Python'],
  },
  {
    title: 'AI Customer Support',
    description: 'Developed intelligent chatbots to automate helpdesk and support tasks.',
    technologies: ['LangChain', 'OpenAI', 'Next.js'],
  },
  {
    title: 'AI Assistant Integration',
    description: 'Built assistants for scheduling, task management, and business workflows.',
    technologies: ['OpenAI API', 'Vercel', 'TypeScript'],
  }
]
</script>
