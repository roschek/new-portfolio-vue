<template>
  <section class="ai">
    <div class="ai__container">
      <h2 class="ai__title">AI Projects Timeline</h2>

      <div class="ai__timeline">
        <div v-for="(item, index) in timeline" :key="index" class="ai__item">
          <div class="ai__marker"></div>
          <div class="ai__content">
            <h3 class="ai__item-title">{{ item.title }}</h3>
            <p class="ai__item-description">{{ item.description }}</p>
            <div class="ai__technologies">
              <span v-for="(tech, idx) in item.technologies" :key="idx" class="ai__technology">
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

<style scoped>
:global(body) {
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #ffffff;
  background-color: #0F172A;
  margin: 0;
  padding: 0;
}

:global(h1, h2, h3, h4, h5, h6) {
  margin: 0 0 0.5em;
  font-weight: bold;
}

:global(p) {
  margin: 0 0 1em;
  line-height: 1.6;
}

:global(a) {
  color: #38bdf8;
  text-decoration: none;
}

:global(a:hover) {
  text-decoration: underline;
}

.ai {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.ai__container {
  max-width: 900px;
  width: 100%;
}

.ai__title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.ai__timeline {
  position: relative;
  border-left: 4px solid #2563eb;
  padding-left: 2rem;
  margin-top: 2rem;
}

.ai__item {
  position: relative;
  margin-bottom: 3rem;
}

.ai__marker {
  position: absolute;
  top: 0;
  left: -0.6rem;
  width: 1.2rem;
  height: 1.2rem;
  background-color: #2563eb;
  border-radius: 50%;
  border: 2px solid #0F172A;
}

.ai__content {
  background-color: #1F2937;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.ai__item-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.ai__item-description {
  font-size: 1rem;
  color: #aaa;
  margin-bottom: 1rem;
}

.ai__technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ai__technology {
  background-color: #2563eb;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: white;
}
</style>
