<template>
  <main class="codelab">
    <section class="codelab__container">
      <h2 class="codelab__title">Code Lab</h2>
      <p class="codelab__description">
        Interactive technical demos — algorithms and 3D rendering, live in the browser.
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
import { ref, watch } from 'vue'
import AlgorithmVisualizer from '../components/AlgorithmVisualiser.vue'
import ThreeModelViewer from '../components/ThreeModelViewer.vue'

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

watch(activeTab, (index) => {
  document.title = `Code Lab - ${tabs[index].name}`
}, { immediate: true })
</script>

<style scoped>
.codelab {
  padding: 4rem 2rem 6rem;
  min-height: 80vh;
  background-color: var(--bg);
  color: var(--text);
}

.codelab__container {
  max-width: 1100px;
  margin: 0 auto;
}

.codelab__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text);
  margin: 0 0 0.75rem;
}

.codelab__description {
  font-family: var(--font-body);
  font-size: 1rem;
  max-width: 560px;
  margin: 0 0 2.5rem;
  color: var(--text-muted);
  line-height: 1.6;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--line);
}

.codelab__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.codelab__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  transition: border-color 0.2s, color 0.2s, background-color 0.2s;
}

.codelab__tab:hover {
  border-color: var(--bg-border);
  color: var(--text);
}

.codelab__tab--active {
  background-color: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.codelab__tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.codelab__content {
  background-color: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  padding: 2rem;
}

@media (max-width: 768px) {
  .codelab {
    padding: 3rem 1.25rem 4rem;
  }

  .codelab__tabs {
    flex-direction: column;
  }

  .codelab__content {
    padding: 1.25rem;
  }
}
</style>