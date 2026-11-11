<template>
  <section class="sessions">
    <p class="sessions__label">§ 02 · {{ t('navSessions') }}</p>
    <input v-if="sessions.length" v-model="query" class="sessions__search" type="search" :placeholder="t('search')" />

    <p v-if="loaded && !sessions.length" class="sessions__empty">{{ t('sessionsEmpty') }}</p>

    <ol class="sessions__list">
      <li v-for="(s, index) in filtered" :key="s.id" class="sessions__row">
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

        <button
          type="button"
          class="sessions__more"
          :aria-label="t('more')"
          :aria-expanded="openId === s.id"
          @click.stop="toggleMenu(s.id)"
        >⋯</button>

        <div v-if="openId === s.id" class="sessions__menu" role="menu" @click.stop>
          <RouterLink :to="`/translate/sessions/${s.id}?tab=summary`" class="sessions__menu-item" role="menuitem">
            ∑ {{ t('summary') }}
          </RouterLink>
          <button
            type="button"
            class="sessions__menu-item sessions__menu-item--danger"
            role="menuitem"
            :disabled="live.session.value?.id === s.id"
            @click="remove(s.id)"
          >{{ confirmingId === s.id ? t('confirmDelete') : t('delete') }}</button>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { t } from '../i18n.js'
import { listSessions, deleteSession } from '../services/sessionStore.js'
import { getLiveSession } from '../composables/useLiveSession.js'
import { formatTime } from '../services/exporter.js'

const sessions = ref([])
const loaded = ref(false)
const query = ref('')
const live = getLiveSession()
const openId = ref(null)
const confirmingId = ref(null)

function toggleMenu(id) {
  openId.value = openId.value === id ? null : id
  confirmingId.value = null
}

const closeMenu = () => {
  openId.value = null
  confirmingId.value = null
}

async function remove(id) {
  if (confirmingId.value !== id) {
    confirmingId.value = id
    return
  }
  await deleteSession(id)
  sessions.value = sessions.value.filter((s) => s.id !== id)
  closeMenu()
}

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
  document.addEventListener('click', closeMenu)
})
onBeforeUnmount(() => document.removeEventListener('click', closeMenu))
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

.sessions__row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  border-block-end: 1px dashed var(--line);
}

.sessions__more {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid transparent;
  border-radius: 50%;
  background: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
}

.sessions__more:hover,
.sessions__more[aria-expanded='true'] {
  border-color: var(--line);
  color: var(--text);
}

.sessions__menu {
  position: absolute;
  inset-block-start: calc(100% - 0.5rem);
  inset-inline-end: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  min-width: 12rem;
  padding: 0.35rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}

.sessions__menu-item {
  padding: 0.65rem 0.8rem;
  border: 0;
  border-radius: calc(var(--radius) / 2);
  background: none;
  color: var(--text);
  font: inherit;
  font-size: 0.95rem;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
}

.sessions__menu-item:hover {
  background: var(--bg);
}

.sessions__menu-item--danger {
  color: var(--accent);
}

.sessions__menu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sessions__item {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto;
  align-items: center;
  gap: 1rem;
  padding-block: 1rem;
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
