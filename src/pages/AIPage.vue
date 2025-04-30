<template>
  <section class="ai">
    <div class="ai__container">
      <h2 class="ai__title">AI Expertise</h2>      
      <div class="ai__intro">
        <p class="ai__intro-text">
          Exploring the frontiers of artificial intelligence through innovative projects and solutions. 
          From building conversational agents to creating content generation tools, I bring AI capabilities
          to solve real-world problems.
        </p>
      </div>
      <h3 class="ai__subtitle">AI Projects Timeline</h3>
      <div class="ai__timeline">
        <div 
          v-for="(item, index) in timeline" 
          :key="index" 
          class="ai__item"
          ref="timelineItems"
        >
          <div class="ai__marker"></div>
          <div class="ai__content">
            <div class="ai__item-header">
              <h4 class="ai__item-title">{{ item.title }}</h4>
              <button 
                v-if="!expandedItems[index]"
                @click="toggleItemDetails(index)" 
                class="ai__expand-button"
                aria-label="Show more details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button 
                v-else
                @click="toggleItemDetails(index)" 
                class="ai__expand-button ai__expand-button--active"
                aria-label="Show less details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <p class="ai__item-description">{{ item.description }}</p>
            
            <div v-if="expandedItems[index]" class="ai__item-details">
              <div class="ai__item-features">
                <div class="ai__item-feature">
                  <span class="ai__item-feature-icon">🔍</span>
                  <span>Advanced NLP techniques for accurate text processing</span>
                </div>
                <div class="ai__item-feature">
                  <span class="ai__item-feature-icon">⚡</span>
                  <span>Optimized for performance with efficient prompt design</span>
                </div>
                <div class="ai__item-feature">
                  <span class="ai__item-feature-icon">🔄</span>
                  <span>Continuous learning through user interactions</span>
                </div>
              </div>
            </div>
            
            <div class="ai__technologies">
              <span 
                v-for="(tech, idx) in item.technologies" 
                :key="idx" 
                class="ai__technology"
                :class="{ 'ai__technology--active': selectedTech === tech }"
                @click="toggleTechFilter(tech)"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>      
      <div class="ai__filters">
        <h4 class="ai__filters-title">Filter by technology:</h4>
        <div class="ai__filter-buttons">
          <button 
            v-for="tech in uniqueTechnologies" 
            :key="tech"
            :class="['ai__filter-button', { 'ai__filter-button--active': selectedTech === tech }]"
            @click="toggleTechFilter(tech)"
          >
            {{ tech }}
          </button>
          <button 
            v-if="selectedTech" 
            class="ai__filter-button ai__filter-button--reset"
            @click="selectedTech = null"
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div class="ai__prompt-engineering">
        <h3 class="ai__subtitle">Prompt Engineering Expertise</h3>
        
        <div class="ai__prompt-intro">
          <p>
            Prompt engineering is the art and science of crafting effective inputs for AI language models.
            The right prompt can dramatically improve AI output quality, specificity, and usefulness.
          </p>
        </div>
        
        <div class="ai__prompt-cards">
          <div class="ai__prompt-card">
            <div class="ai__prompt-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </div>
            <h4>Structured Prompting</h4>
            <p>Creating organized prompts with clear instructions, examples, and desired output format to guide AI responses effectively.</p>
          </div>
          
          <div class="ai__prompt-card">
            <div class="ai__prompt-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h4>Few-Shot Learning</h4>
            <p>Using examples within prompts to demonstrate the pattern and style you want the AI to follow in its response.</p>
          </div>
          
          <div class="ai__prompt-card">
            <div class="ai__prompt-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h4>Chain-of-Thought</h4>
            <p>Guiding AI to show its reasoning process step-by-step, improving accuracy for complex tasks and making outputs more transparent.</p>
          </div>
          
          <div class="ai__prompt-card">
            <div class="ai__prompt-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h4>Context Design</h4>
            <p>Establishing precise roles, constraints, and background information to help AI understand the specific context of your request.</p>
          </div>
        </div>
        
        <div class="ai__prompt-example">
          <h4 class="ai__prompt-example-title">Before/After Example:</h4>
          <div class="ai__prompt-comparison">
            <div class="ai__prompt-before">
              <h5>Basic Prompt</h5>
              <div class="ai__prompt-text">Write about AI.</div>
              <div class="ai__prompt-result">
                <p>AI, or artificial intelligence, refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.</p>
              </div>
            </div>
            <div class="ai__prompt-after">
              <h5>Engineered Prompt</h5>
              <div class="ai__prompt-text">
                Act as an AI researcher specializing in large language models. Write a 3-paragraph explanation of how transformer models have revolutionized NLP. Include specific examples of applications and future directions. Target audience: technical professionals with basic AI knowledge.
              </div>
              <div class="ai__prompt-result">
                <p>Transformer models have fundamentally revolutionized Natural Language Processing (NLP) by introducing a novel architecture that processes text in parallel rather than sequentially. Unlike previous RNN-based models that handled tokens one by one, transformers utilize self-attention mechanisms to weigh the importance of all words in a sequence simultaneously, capturing long-range dependencies more effectively...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

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
];

const expandedItems = ref(Array(timeline.length).fill(false));
const selectedTech = ref(null);
const timelineItems = ref([]);

const uniqueTechnologies = computed(() => {
  const techSet = new Set();
  timeline.forEach(item => {
    item.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet);
});

const filteredTimeline = computed(() => {
  if (!selectedTech.value) return timeline;
  
  return timeline.filter(item => 
    item.technologies.includes(selectedTech.value)
  );
});

function toggleItemDetails(index) {
  expandedItems.value[index] = !expandedItems.value[index];
}

function toggleTechFilter(tech) {
  selectedTech.value = selectedTech.value === tech ? null : tech;
}

function setupScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ai__item--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  if (timelineItems.value) {
    timelineItems.value.forEach(item => {
      observer.observe(item);
    });
  }
}

onMounted(() => {
  setupScrollAnimation();
});
</script>

<style scoped>
:global(body) {
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #ffffff;
  background-color: #0F172A;
  margin: 0;
  padding: 0;
}

.ai {
  padding: 2rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #0F172A;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(28, 85, 172, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(67, 56, 202, 0.1) 0%, transparent 50%);
}

.ai__container {
  max-width: 900px;
  width: 100%;
}

.ai__title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
}

.ai__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
  border-radius: 3px;
}

.ai__subtitle {
  font-size: 1.8rem;
  margin: 2.5rem 0 1.5rem;
  color: #e2e8f0;
  text-align: center;
}

.ai__intro {
  max-width: 700px;
  margin: 0 auto 2rem;
  text-align: center;
}

.ai__intro-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #cbd5e1;
}

.ai__timeline {
  position: relative;
  border-left: 4px solid #6366f1;
  padding-left: 2rem;
  margin: 3rem 0;
}

.ai__item {
  position: relative;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.ai__item--visible {
  opacity: 1;
  transform: translateX(0);
}

.ai__marker {
  position: absolute;
  top: 0;
  left: -2.6rem;
  width: 1.2rem;
  height: 1.2rem;
  background-color: #6366f1;
  border-radius: 50%;
  border: 2px solid #0F172A;
  transition: all 0.3s ease;
}

.ai__item:hover .ai__marker {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.7);
}

.ai__content {
  background-color: rgba(31, 41, 55, 0.7);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.ai__item:hover .ai__content {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.ai__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ai__item-title {
  font-size: 1.5rem;
  margin: 0;
  color: #f1f5f9;
}

.ai__expand-button {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.ai__expand-button:hover, .ai__expand-button--active {
  background-color: rgba(99, 102, 241, 0.2);
  color: #6366f1;
}

.ai__item-description {
  font-size: 1rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.ai__item-details {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.5s ease;
}

.ai__item-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ai__item-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #e2e8f0;
}

.ai__item-feature-icon {
  font-size: 1.2rem;
}

.ai__technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ai__technology {
  background-color: rgba(99, 102, 241, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #a5b4fc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai__technology:hover, .ai__technology--active {
  background-color: rgba(99, 102, 241, 0.5);
  color: white;
  transform: translateY(-2px);
}

.ai__filters {
  margin-bottom: 3rem;
}

.ai__filters-title {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #e2e8f0;
}

.ai__filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.ai__filter-button {
  background-color: rgba(31, 41, 55, 0.5);
  color: #cbd5e1;
  border: 1px solid rgba(203, 213, 225, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai__filter-button:hover, .ai__filter-button--active {
  background-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border-color: rgba(99, 102, 241, 0.3);
}

.ai__filter-button--reset {
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.2);
}

.ai__filter-button--reset:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.ai__prompt-engineering {
  margin-top: 4rem;
}

.ai__prompt-intro {
  max-width: 700px;
  margin: 0 auto 2rem;
  text-align: center;
}

.ai__prompt-intro p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #cbd5e1;
}

.ai__prompt-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.ai__prompt-card {
  background-color: rgba(31, 41, 55, 0.7);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ai__prompt-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.ai__prompt-card-icon {
  width: 50px;
  height: 50px;
  background-color: rgba(99, 102, 241, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
}

.ai__prompt-card h4 {
  font-size: 1.2rem;
  margin: 0;
  color: #f1f5f9;
}

.ai__prompt-card p {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.ai__prompt-example {
  background-color: rgba(31, 41, 55, 0.7);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.ai__prompt-example-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #f1f5f9;
}

.ai__prompt-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ai__prompt-before, .ai__prompt-after {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ai__prompt-before h5, .ai__prompt-after h5 {
  font-size: 1.1rem;
  margin: 0;
  color: #e2e8f0;
}

.ai__prompt-text {
  background-color: rgba(31, 41, 55, 0.8);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
  font-size: 0.9rem;
  color: #a5b4fc;
  font-family: monospace;
  line-height: 1.5;
}

.ai__prompt-result {
  background-color: rgba(31, 41, 55, 0.5);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.ai__prompt-result p {
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .ai__prompt-comparison {
    grid-template-columns: 1fr;
  }
  
  .ai__title {
    font-size: 2rem;
  }
  
  .ai__subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .ai__prompt-cards {
    grid-template-columns: 1fr;
  }
  
  .ai__timeline {
    padding-left: 1.5rem;
  }
  
  .ai__marker {
    left: -2.1rem;
  }
}
</style>