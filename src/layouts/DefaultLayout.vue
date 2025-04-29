<template>
  <div class="min-h-screen flex flex-col bg-[#0F172A] text-white">

    <header class="flex justify-between items-center p-4 bg-gray-900 shadow-md sticky top-0 z-10">
      <h1 class="text-2xl font-bold tracking-tight">Aleksei Kagan</h1>

      <nav class="hidden md:flex gap-6">
        <RouterLink to="/" class="nav-link" exact-active-class="active-link">
          Home
        </RouterLink>
        <RouterLink to="/frontend" class="nav-link" exact-active-class="active-link">
          Frontend
        </RouterLink>
        <RouterLink to="/telegram" class="nav-link" exact-active-class="active-link">
          Telegram Bots
        </RouterLink>
        <RouterLink to="/ai" class="nav-link" exact-active-class="active-link">
          AI Pro
        </RouterLink>
      </nav>
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden">
        <span class="sr-only">Menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>

    <div v-if="isMenuOpen"
      class="fixed inset-0 bg-gray-900 bg-opacity-90 z-20 flex items-center justify-center md:hidden">
      <div class="flex flex-col items-center gap-8 text-xl">
        <RouterLink @click="isMenuOpen = false" to="/" class="nav-link" exact-active-class="active-link">
          Home
        </RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/frontend" class="nav-link" exact-active-class="active-link">
          Frontend
        </RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/telegram" class="nav-link" exact-active-class="active-link">
          Telegram Bots
        </RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/ai" class="nav-link" exact-active-class="active-link">
          AI Pro
        </RouterLink>
        <button @click="isMenuOpen = false" class="mt-8 text-red-400">
          Close
        </button>
      </div>
    </div>


    <main class="flex-grow flex flex-col  overflow-hidden">
      <slot />
    </main>


    <footer class="bg-gray-900 p-4 text-center text-gray-400 text-sm">
      © 2025 Aleksei Kagan
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'


const isMenuOpen = ref(false)
</script>

<style scoped>
.nav-link {
  position: relative;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #38bdf8;
}

.active-link {
  color: #38bdf8;
  font-weight: 700;
}

@media (max-width: 640px) {
  main {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>