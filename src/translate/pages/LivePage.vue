<template>
  <section class="live" :class="{ 'live--active': hasSession }">
    <div v-if="interrupted && !hasSession" class="live__banner" role="alert">
      <span>{{ t('interrupted', { title: interrupted.title || t('untitled'), time: formatTime(interrupted.durationMs) }) }}</span>
      <span class="live__banner-actions">
        <button type="button" class="live__banner-btn live__banner-btn--primary" :disabled="!sonioxKey" @click="continueInterrupted">{{ t('continue') }}</button>
        <button type="button" class="live__banner-btn" @click="dismissInterrupted">{{ t('dismiss') }}</button>
      </span>
    </div>

    <div class="live__toolbar">
      <LanguageSelect v-model="prefs.targetLang.value" :label="t('translateTo')" :disabled="hasSession" />
      <div class="live__tools">
        <button type="button" class="live__tool" :aria-label="`${t('textSize')} −`" :disabled="sizeIndex === 0" @click="stepSize(-1)">A−</button>
        <button type="button" class="live__tool" :aria-label="`${t('textSize')} +`" :disabled="sizeIndex === SIZES.length - 1" @click="stepSize(1)">A+</button>
        <button
          type="button"
          class="live__tool"
          :class="{ 'live__tool--on': prefs.showOriginal.value }"
          :aria-pressed="prefs.showOriginal.value"
          @click="prefs.showOriginal.value = !prefs.showOriginal.value"
        >{{ t('showOriginal') }}</button>
        <button v-if="canFullscreen" type="button" class="live__tool" :aria-label="t('fullscreen')" @click="toggleFullscreen">⛶</button>
      </div>
    </div>

    <!-- Before recording: key setup or lecture details. -->
    <div v-if="!hasSession" class="live__setup">
      <div v-if="!sonioxKey" class="live__card">
        <p class="live__card-label">§ 00 · Soniox</p>
        <h1 class="live__card-title">{{ t('setupTitle') }}</h1>
        <p class="live__card-text">{{ t('setupText') }}</p>
        <form class="live__key-form" @submit.prevent="saveSonioxKey">
          <input v-model="keyDraft" class="live__input" type="password" autocomplete="off" spellcheck="false" placeholder="soniox_…" />
          <button type="submit" class="live__btn" :disabled="!keyDraft.trim()">{{ t('save') }}</button>
        </form>
        <a href="https://console.soniox.com" target="_blank" rel="noopener noreferrer" class="live__card-link">{{ t('setupLink') }} ↗</a>
      </div>

      <form v-else class="live__form" @submit.prevent="start">
        <p class="live__card-label">§ 01 · {{ t('appName') }}</p>
        <label class="live__field">
          <span class="live__field-label">{{ t('title') }}</span>
          <input v-model="form.title" class="live__input" :placeholder="t('titlePlaceholder')" />
        </label>
        <label class="live__field">
          <span class="live__field-label">{{ t('topic') }}</span>
          <input v-model="form.topic" class="live__input" :placeholder="t('topicPlaceholder')" />
        </label>
        <label class="live__field">
          <span class="live__field-label">{{ t('terms') }}</span>
          <input v-model="form.terms" class="live__input" :placeholder="t('termsPlaceholder')" />
        </label>
      </form>
    </div>

    <TranscriptFeed
      v-else
      class="live__feed"
      :paragraphs="live.paragraphs.value"
      :tail="live.tail.value"
      :show-original="prefs.showOriginal.value"
      :text-size="prefs.textSize.value"
      :placeholder="t('emptyFeed')"
      follow
    />

    <div class="live__dock">
      <p v-if="live.error.value" class="live__error" role="alert">
        {{ t(errorKey(live.error.value)) }}
        <RouterLink v-if="live.error.value === 'auth'" to="/translate/settings">→ {{ t('navSettings') }}</RouterLink>
      </p>
      <p v-if="!live.storageOk.value" class="live__error" role="alert">{{ t('noStorage') }}</p>
      <div class="live__dock-row">
        <StatusLine
          :status="live.status.value"
          :elapsed-ms="live.elapsedMs.value"
          :target-lang="activeLang"
          :words="live.wordCount.value"
        />
        <RecordButton
          v-if="sonioxKey || hasSession"
          :status="live.status.value"
          :has-session="hasSession"
          :get-level="live.getLevel"
          @start="start"
          @pause="live.pause()"
          @resume="live.resume(getKey('soniox'))"
          @stop="stop"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { t, locale, errorKey } from '../i18n.js'
import { getKey, setKey } from '../services/keyVault.js'
import { findInterrupted, saveSession } from '../services/sessionStore.js'
import { formatTime } from '../services/exporter.js'
import { getLiveSession } from '../composables/useLiveSession.js'
import { usePrefs } from '../composables/usePrefs.js'
import LanguageSelect from '../components/LanguageSelect.vue'
import TranscriptFeed from '../components/TranscriptFeed.vue'
import StatusLine from '../components/StatusLine.vue'
import RecordButton from '../components/RecordButton.vue'

const SIZES = ['sm', 'md', 'lg', 'xl']

const router = useRouter()
const live = getLiveSession()
const prefs = usePrefs(locale === 'ru' ? 'ru' : 'en')

const sonioxKey = ref(getKey('soniox'))
const keyDraft = ref('')
const form = reactive({ title: '', topic: '', terms: '' })
const interrupted = ref(null)

const hasSession = computed(() => Boolean(live.session.value))
const activeLang = computed(() => live.session.value?.targetLang ?? prefs.targetLang.value)
const sizeIndex = computed(() => Math.max(0, SIZES.indexOf(prefs.textSize.value)))
const canFullscreen = Boolean(document.fullscreenEnabled)

function stepSize(delta) {
  prefs.textSize.value = SIZES[sizeIndex.value + delta]
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen().catch(() => {})
}

function saveSonioxKey() {
  setKey('soniox', keyDraft.value)
  sonioxKey.value = getKey('soniox')
  keyDraft.value = ''
}

async function start() {
  interrupted.value = null
  await live.start({
    title: form.title.trim(),
    targetLang: prefs.targetLang.value,
    context: {
      topic: form.topic.trim(),
      terms: form.terms.split(',').map((term) => term.trim()).filter(Boolean),
    },
    key: getKey('soniox'),
  })
}

async function stop() {
  const id = await live.stop()
  if (id) router.push(`/translate/sessions/${id}`)
}

async function continueInterrupted() {
  const session = interrupted.value
  interrupted.value = null
  await live.continueSession(session, getKey('soniox'))
}

async function dismissInterrupted() {
  const session = interrupted.value
  interrupted.value = null
  await saveSession({ ...session, status: 'done' }).catch(() => {})
}

onMounted(async () => {
  if (hasSession.value) return
  interrupted.value = await findInterrupted().catch(() => null)
})
</script>

<style scoped>
.live {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: min(100%, 52rem);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.live__banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-block-start: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  background: var(--accent-dim);
  font-size: 0.95rem;
}

.live__banner-actions {
  display: flex;
  gap: 0.5rem;
}

.live__banner-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.live__banner-btn--primary {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg);
}

.live__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-block: 1rem;
}

.live__tools {
  display: flex;
  gap: 0.35rem;
}

.live__tool {
  min-width: 2.4rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
}

.live__tool:disabled {
  opacity: 0.35;
  cursor: default;
}

.live__tool--on {
  color: var(--text);
  border-color: var(--text-muted);
}

.live__setup {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: 1rem 2rem;
}

.live__card,
.live__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.live__card-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.live__card-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  line-height: 1.1;
}

.live__card-text {
  margin: 0;
  color: var(--text-muted);
  max-width: 50ch;
}

.live__card-link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.live__key-form {
  display: flex;
  gap: 0.5rem;
}

.live__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.live__field-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.live__input {
  flex: 1;
  min-width: 0;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  color: var(--text);
  font: inherit;
}

.live__input:focus {
  outline: none;
  border-color: var(--accent);
}

.live__btn {
  padding: 0 1.2rem;
  border: 0;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--bg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.live__btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.live__feed {
  flex: 1;
  padding-block-end: 2rem;
}

.live__dock {
  position: sticky;
  inset-block-end: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-inline: calc(-1 * clamp(1rem, 4vw, 2rem));
  padding: 0.9rem clamp(1rem, 4vw, 2rem);
  padding-block-end: max(0.9rem, env(safe-area-inset-bottom));
  border-block-start: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(12px);
}

.live__dock-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.live__error {
  margin: 0;
  color: var(--accent-hi);
  font-size: 0.9rem;
}

@media (max-width: 560px) {
  .live__dock-row {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .live__dock-row :deep(.record) {
    justify-content: center;
  }

  .live__dock-row :deep(.status) {
    justify-content: center;
  }
}
</style>
