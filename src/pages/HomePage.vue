<template>
  <section ref="vantaRef"
    class="relative h-2/3 overflow-hidden flex flex-1 flex-col items-center justify-center text-center p-8 mt-10">
    <div class="relative z-10">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
        <span v-for="(letter, index) in titleArray" :key="index" class="inline-block opacity-0 animate-fade-in"
          :style="{ animationDelay: (index * 0.05) + 's' }">
          <template v-if="letter === ' '">&nbsp;</template>
          <template v-else>{{ letter }}</template>
        </span>
      </h1>

      <p class="text-lg md:text-2xl text-gray-300 mb-8">
        Creating Interfaces, Automating Workflows, Powering Ideas.
      </p>

      <!-- About Section -->
      <div class="max-w-3xl mx-auto text-gray-400 mb-12">
        <p class="text-lg mb-4">
          Hi, I'm Aleksei Kagan — Senior Frontend and Fullstack Developer.
        </p>
        <p class="text-lg">
          Experienced in building high-performance web applications with React, Vue.js, Node.js. Passionate about
          intelligent
          solutions, mentoring developers, and exploring new technologies.
        </p>
      </div>

      <!-- Contact Section -->
      <div class="flex justify-center gap-6 text-3xl text-white">
        <a href="https://www.linkedin.com/in/alexey-kagan" target="_blank" aria-label="LinkedIn" class="hover:text-blue-400">
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
        <a href="https://t.me/roschek" target="_blank" aria-label="Telegram" class="hover:text-blue-400">
          <font-awesome-icon :icon="['fab', 'telegram']" />
        </a>
        <a href="https://wa.me/972539310707" target="_blank" aria-label="WhatsApp" class="hover:text-blue-400">
          <font-awesome-icon :icon="['fab', 'whatsapp']" />
        </a>
        <a href="mailto:roscheka@gmail.com" target="_blank" aria-label="Email" class="hover:text-blue-400">
          <font-awesome-icon :icon="['fas', 'envelope']" />
        </a>
      </div>


    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import WAVES from 'vanta/dist/vanta.waves.min'

const vantaRef = ref(null)
const vantaEffect = ref(null)

const title = 'Hi, I am Aleksei Kagan.'
const titleArray = title.split('')

onMounted(() => {
  if (!vantaEffect.value) {
    vantaEffect.value = WAVES({
      el: vantaRef.value,
      THREE,
      color: 0x38bdf8,
      shininess: 50,
      waveHeight: 20,
      waveSpeed: 1,
      zoom: 0.85,
    })
  }
})

onBeforeUnmount(() => {
  if (vantaEffect.value) vantaEffect.value.destroy()
})
</script>

<style scoped>
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

.animate-fade-in {
  animation: fade-in 0.5s forwards;
}
</style>
