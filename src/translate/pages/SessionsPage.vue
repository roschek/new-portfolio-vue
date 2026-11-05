<template>
  <section class="sessions">
    <p class="sessions__label">§ 02 · {{ t('navSessions') }}</p>
    <input v-if="sessions.length" v-model="query" class="sessions__search" type="search" :placeholder="t('search')" />

    <p v-if="loaded && !sessions.length" class="sessions__empty">{{ t('sessionsEmpty') }}</p>

    <ol class="sessions__list">
      <li v-for="(s, index) in filtered" :key="s.id">
        <RouterLink :to="`/translate/sessions/${s.id}`" class="sessions__item">
          <span class="sessions__num">{{ String(filtered.length - index).padStart(2, '0') }}</span>
          <span class="sessions__main">
            <span class="sessions__title" dir="auto">{{ s.title || t('untitled') }}</span>
            <span class="sessions__meta">
              {{ new Date(s.createdAt).toLocaleDateString() }} · {{ formatTime(s.durationMs) }} ·
              {{ (s.detectedLangs.length ? s.detectedLangs.join('+') : 'auto').toUpperCase() }}→{{ s.targetLang.toUpperCase() }}
              <span v-if="s.summary" class="sessions__badge">∑</span>
              <span v-if="s.status === 'recording'" class="sessions__badge sessions__badge--live">REC</span>
            </span>
          </span>
          <span class="sessions__arrow" aria-hidden="true">→</span>
        </RouterLink>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { t } from '../i18n.js'
import { listSessions } from '../services/sessionStore.js'
import { formatTime } from '../services/exporter.js'

const sessions = ref([])
const loaded = ref(false)
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return sessions.value
  return sessions.value.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.paragraphs.some((p) => p.translation.toLowerCase().includes(q) || p.original.toLowerCase().includes(q))
  )
})

onMounted(async () => {
  sessions.value = await listSessions().catch(() => [])
  loaded.value = true
})
</script>

<style scoped>
.sessions {
  width: min(100%, 48rem);
  margin-inline: auto;
  padding: 2rem clamp(1rem, 4vw, 2rem) 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sessions__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.sessions__search {
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  color: var(--text);
  font: inherit;
}

.sessions__search:focus {
  outline: none;
  border-color: var(--accent);
}

.sessions__empty {
  margin: 0;
  color: var(--text-muted);
}

.sessions__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-block-start: 1px dashed var(--line);
}

.sessions__item {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto;
  align-items: center;
  gap: 1rem;
  padding-block: 1rem;
  border-block-end: 1px dashed var(--line);
  color: var(--text);
  text-decoration: none;
}

.sessions__item:hover .sessions__arrow {
  color: var(--accent);
  transform: translateX(4px);
}

.sessions__num {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
}

.sessions__main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.sessions__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sessions__meta {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.sessions__badge {
  margin-inline-start: 0.35rem;
  color: var(--accent);
}

.sessions__arrow {
  color: var(--text-faint);
  transition: transform 0.2s ease, color 0.2s ease;
}

:dir(rtl) .sessions__arrow {
  transform: scaleX(-1);
}
</style>
