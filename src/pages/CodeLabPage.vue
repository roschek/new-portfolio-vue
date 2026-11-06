<template>
  <main class="page codelab">
    <section class="section section--first codelab__container">
      <SectionHead label="§ 00 / Code Lab" :level="1">
        Live <em>demos</em>
        <template #lead>Interactive technical demos — algorithms and 3D rendering, live in the browser.</template>
      </SectionHead>

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
import SectionHead from '../components/SectionHead.vue'
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
.codelab__container {
  padding-block-end: clamp(4rem, 10vw, 7rem);
}

.codelab__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
  margin-block-end: 1.5rem;
}

.codelab__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
  border: 0;
  border-block-end: 2px solid transparent;
  background: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.codelab__tab:hover {
  color: var(--text);
}

.codelab__tab--active {
  color: var(--text);
  border-block-end-color: var(--accent);
}

.codelab__tab-icon {
  display: flex;
  color: var(--accent);
}

.codelab__tab-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.codelab__content {
  overflow: hidden;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid var(--line);
  border-radius: calc(var(--radius) * 2);
  background-color: var(--bg-elevated);
}
</style>
