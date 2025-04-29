<template>
  <section class="home" ref="vantaRef">
    <div class="home__content">
      <h1 class="home__title">
        <span
          v-for="(letter, index) in titleArray"
          :key="index"
          class="home__title-letter"
          :style="{ animationDelay: (index * 0.05) + 's' }"
        >
          <template v-if="letter === ' '">&nbsp;</template>
          <template v-else>{{ letter }}</template>
        </span>
      </h1>

      <p class="home__subtitle">
        Creating Interfaces, Automating Workflows, Powering Ideas.
      </p>

      <div class="home__about">
        <p class="home__text">Hi, I'm Aleksei Kagan — Senior Frontend and Fullstack Developer.</p>
        <p class="home__text">
          Experienced in building high-performance web applications with React, Vue.js, Node.js. Passionate about intelligent solutions, mentoring developers, and exploring new technologies.
        </p>
      </div>

      <div class="home__contacts">
        <a href="https://linkedin.com/in/alexey-kagan" target="_blank" class="home__contact-link" aria-label="LinkedIn">LinkedIn</a>
        <a href="https://t.me/roschek" target="_blank" class="home__contact-link" aria-label="Telegram">Telegram</a>
        <a href="https://wa.me/972539310707" target="_blank" class="home__contact-link" aria-label="WhatsApp">WhatsApp</a>
        <a href="mailto:roscheka@gmail.com" class="home__contact-link" aria-label="Email">Email</a>
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
.home {
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  background-color: #0F172A;
  display: flex;
  justify-content: center;
  align-items: center;  
  text-align: center;
}

.home__content {
  position: relative;
  z-index: 10;
  max-width: 900px;
}

.home__title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.home__title-letter {
  display: inline-block;
  opacity: 0;
  animation: fade-in 0.5s forwards;
}

.home__subtitle {
  font-size: 1.25rem;
  color: #ccc;
  margin-bottom: 2rem;
}

.home__about {
  color: #aaa;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.home__text {
  margin-bottom: 1rem;
}

.home__contacts {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.home__contact-link {
  font-size: 1rem;
  color: #38bdf8;
  text-decoration: none;
}

.home__contact-link:hover {
  color: black;
  transition: color 0.3s ease;
}

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
</style>
