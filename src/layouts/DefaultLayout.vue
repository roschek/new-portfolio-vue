<template>
  <div class="layout">
    <header class="layout__header">
      <h1 class="layout__title">Aleksei Kagan</h1>
      <nav class="layout__nav">
        <RouterLink to="/" class="layout__nav-link" exact-active-class="layout__nav-link--active">Home</RouterLink>
        <RouterLink to="/frontend" class="layout__nav-link" exact-active-class="layout__nav-link--active">Frontend</RouterLink>
        <RouterLink to="/telegram" class="layout__nav-link" exact-active-class="layout__nav-link--active">Telegram Bots</RouterLink>
        <RouterLink to="/ai" class="layout__nav-link" exact-active-class="layout__nav-link--active">AI Pro</RouterLink>
      </nav>
    </header>

    <main class="layout__main">
      <slot />
    </main>

    <footer class="layout__footer">
      © 2025 Aleksei Kagan
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0F172A;
  color: white;
}

.layout__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #1F2937;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.layout__title {
  font-size: 1.5rem;
  font-weight: bold;
}

.layout__nav {
  display: flex;
  gap: 1.5rem;
}

.layout__nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.layout__nav-link:hover,
.layout__nav-link--active {
  color: #38bdf8;
  font-weight: 500;
}

.layout__main {
  flex-grow: 1;  
}

.layout__footer {
  background-color: #1F2937;
  text-align: center;
  padding: 1rem;
  color: #ccc;
  font-size: 0.875rem;
}
</style>
