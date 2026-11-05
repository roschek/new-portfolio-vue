<template>
  <div class="tshell">
    <header class="tshell__bar">
      <RouterLink to="/" class="tshell__back">← {{ t('backToSite') }}</RouterLink>
      <span class="tshell__name">
        <span class="tshell__mark">§</span> {{ t('appName') }}
      </span>
      <nav class="tshell__nav">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="tshell__link"
          :class="{ 'tshell__link--active': isActive(link) }"
        >
          {{ link.label }}
          <span v-if="link.to === '/translate/' && isLive" class="tshell__live-dot" aria-hidden="true"></span>
        </RouterLink>
      </nav>
    </header>

    <main class="tshell__main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { t } from './i18n.js'
import { enablePwa } from './pwa.js'
import { getLiveSession } from './composables/useLiveSession.js'

const route = useRoute()
const live = getLiveSession()

const links = [
  { to: '/translate/', label: t('navLive'), exact: true },
  { to: '/translate/sessions', label: t('navSessions') },
  { to: '/translate/settings', label: t('navSettings') },
]

const isActive = (link) =>
  link.exact ? route.path.replace(/\/$/, '') === '/translate' : route.path.startsWith(link.to)

const isLive = computed(() => !['idle', 'error'].includes(live.status.value))

const siteTitle = document.title

onMounted(() => {
  document.title = t('appName')
  enablePwa()
})
onBeforeUnmount(() => (document.title = siteTitle))
</script>

<style scoped>
.tshell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
}

.tshell__bar {
  position: sticky;
  inset-block-start: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem clamp(1rem, 4vw, 2rem);
  padding-block-start: max(0.75rem, env(safe-area-inset-top));
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px);
  border-block-end: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
}

.tshell__back {
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
}

.tshell__back:hover {
  color: var(--accent);
}

.tshell__name {
  color: var(--text);
  text-transform: uppercase;
  white-space: nowrap;
}

.tshell__mark {
  color: var(--accent);
}

.tshell__nav {
  display: flex;
  gap: 0.25rem;
  margin-inline-start: auto;
}

.tshell__link {
  position: relative;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  color: var(--text-muted);
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.tshell__link:hover {
  color: var(--text);
}

.tshell__link--active {
  color: var(--bg);
  background: var(--text);
}

.tshell__live-dot {
  position: absolute;
  inset-block-start: 0.2rem;
  inset-inline-end: 0.2rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.tshell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 560px) {
  .tshell__name {
    display: none;
  }
}
</style>
