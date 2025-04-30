<template>
  <main class="codelab">
    <section class="codelab__container">
      <h2 class="codelab__title">Code Lab</h2>
      
      <p class="codelab__description">
        Interactive code and technical demonstrations. 
        Choose a demo and interact with it directly in the browser.
      </p>
      
      <nav class="codelab__tabs">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="codelab__tab"
          :class="{ 'codelab__tab--active': activeTab === index }"
          @click="activeTab = index"
          aria-pressed="activeTab === index"
          :aria-label="`Show ${tab.name}`"
        >
          <span class="codelab__tab-icon" aria-hidden="true" v-html="tab.icon"></span>
          <span class="codelab__tab-text">{{ tab.name }}</span>
        </button>
      </nav>
      
      <section class="codelab__content">
        <!-- Algorithm Visualizer Tab -->
        <AlgorithmVisualizer v-if="activeTab === 0" />
        
        <!-- 3D Model Viewer Tab -->
        <ThreeModelViewer v-if="activeTab === 1" />
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import AlgorithmVisualizer from '../components/AlgorithmVisualiser.vue'
import ThreeModelViewer from '../components/ThreeModelViewer.vue'

// Tabs management
const tabs = [
  {
    name: 'Algorithm Visualizer',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'
  },
  {
    name: '3D Model Viewer',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path></svg>'
  }
]

const activeTab = ref(0)

// Update title based on active tab
watch(activeTab, (newValue) => {
  document.title = `Code Lab - ${tabs[newValue].name}`
})

onMounted(() => {
  // Set initial title
  document.title = `Code Lab - ${tabs[activeTab.value].name}`
})
</script>

<style scoped>
.codelab {
  padding: 2rem;
  min-height: 80vh;
  background-color: #0F172A;
  color: white;
}

.codelab__container {
  max-width: 1200px;
  margin: 0 auto;
}

.codelab__title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
}

.codelab__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 3px;
}

.codelab__description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.codelab__tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.codelab__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(31, 41, 55, 0.5);
  color: #cbd5e1;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.codelab__tab:hover {
  background-color: rgba(59, 130, 246, 0.2);
  color: white;
}

.codelab__tab--active {
  background-color: rgba(59, 130, 246, 0.3);
  color: white;
  position: relative;
}

.codelab__tab--active::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 1px;
}

.codelab__tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.codelab__content {
  background-color: rgba(31, 41, 55, 0.5);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 2rem;
}

@media (max-width: 768px) {
  .codelab__tabs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .codelab__title {
    font-size: 2rem;
  }
  
  .codelab__content {
    padding: 1.5rem;
  }
}
</style>