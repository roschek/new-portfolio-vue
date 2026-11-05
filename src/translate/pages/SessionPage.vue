<template>
  <section class="lecture">
    <p v-if="loaded && !session" class="lecture__missing">{{ t('notFound') }}</p>

    <template v-if="session">
      <header class="lecture__head">
        <p class="lecture__label">
          {{ new Date(session.createdAt).toLocaleString() }} · {{ formatTime(session.durationMs) }} ·
          {{ (session.detectedLangs.length ? session.detectedLangs.join('+') : 'auto').toUpperCase() }}→{{ session.targetLang.toUpperCase() }}
        </p>
        <input
          v-if="renaming"
          ref="titleInput"
          v-model="titleDraft"
          class="lecture__title-input"
          dir="auto"
          @keydown.enter="commitRename"
          @keydown.esc="renaming = false"
          @blur="commitRename"
        />
        <h1 v-else class="lecture__title" dir="auto">{{ session.title || t('untitled') }}</h1>

        <div class="lecture__actions">
          <button type="button" class="lecture__action" @click="startRename">{{ t('rename') }}</button>
          <button type="button" class="lecture__action" @click="download('md')">↓ {{ t('exportMd') }}</button>
          <button type="button" class="lecture__action" @click="download('txt')">↓ {{ t('exportTxt') }}</button>
          <button type="button" class="lecture__action" @click="copy">{{ copied ? t('copied') : t('copy') }}</button>
          <button v-if="canShare" type="button" class="lecture__action" @click="share">{{ t('share') }}</button>
          <button
            type="button"
            class="lecture__action lecture__action--danger"
            :disabled="isRecordingThis"
            @click="remove"
          >{{ confirmingDelete ? t('confirmDelete') : t('delete') }}</button>
        </div>
      </header>

      <div class="lecture__tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="lecture__tab"
          :class="{ 'lecture__tab--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >{{ tab.label }}</button>
      </div>

      <SummaryPanel v-if="activeTab === 'summary'" :session="session" @update="persist" />
      <ol v-else class="lecture__text">
        <li v-for="(p, index) in session.paragraphs" :key="index" class="lecture__para">
          <span class="lecture__time">{{ formatTime(p.startMs) }}</span>
          <p class="lecture__para-text" dir="auto">{{ (activeTab === 'translation' ? p.translation : p.original).trim() }}</p>
        </li>
      </ol>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../i18n.js'
import { getSession, saveSession, deleteSession } from '../services/sessionStore.js'
import { formatTime, toMarkdown, toText } from '../services/exporter.js'
import { getLiveSession } from '../composables/useLiveSession.js'
import SummaryPanel from '../components/SummaryPanel.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const live = getLiveSession()

const session = ref(null)
const loaded = ref(false)
const activeTab = ref('translation')
const renaming = ref(false)
const titleDraft = ref('')
const titleInput = ref(null)
const copied = ref(false)
const confirmingDelete = ref(false)
const canShare = typeof navigator.share === 'function'

const tabs = [
  { id: 'translation', label: t('tabTranslation') },
  { id: 'original', label: t('tabOriginal') },
  { id: 'summary', label: t('tabSummary') },
]

const isRecordingThis = computed(() => live.session.value?.id === props.id)
const labels = { summary: t('summary'), transcript: t('transcript') }
const fileName = computed(() => (session.value.title || 'lecture').replace(/[\\/:*?"<>|]+/g, '_'))

async function persist(next) {
  session.value = next
  await saveSession(next)
}

async function startRename() {
  titleDraft.value = session.value.title
  renaming.value = true
  await nextTick()
  titleInput.value?.focus()
}

async function commitRename() {
  if (!renaming.value) return
  renaming.value = false
  if (titleDraft.value.trim() !== session.value.title) {
    await persist({ ...session.value, title: titleDraft.value.trim() })
  }
}

function download(kind) {
  const text = kind === 'md' ? toMarkdown(session.value, labels) : toText(session.value)
  const type = kind === 'md' ? 'text/markdown' : 'text/plain'
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const link = Object.assign(document.createElement('a'), { href: url, download: `${fileName.value}.${kind}` })
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function copy() {
  await navigator.clipboard.writeText(toMarkdown(session.value, labels))
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

async function share() {
  try {
    await navigator.share({ title: session.value.title || t('untitled'), text: toMarkdown(session.value, labels) })
  } catch {
    // The user closed the share sheet.
  }
}

async function remove() {
  if (!confirmingDelete.value) {
    confirmingDelete.value = true
    setTimeout(() => (confirmingDelete.value = false), 3000)
    return
  }
  await deleteSession(props.id)
  router.push('/translate/sessions')
}

onMounted(async () => {
  session.value = await getSession(props.id).catch(() => null)
  loaded.value = true
})
</script>

<style scoped>
.lecture {
  width: min(100%, 52rem);
  margin-inline: auto;
  padding: 2rem clamp(1rem, 4vw, 2rem) 4rem;
}

.lecture__missing {
  color: var(--text-muted);
}

.lecture__head {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-block-end: 1.5rem;
  border-block-end: 1px dashed var(--line);
}

.lecture__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.lecture__title,
.lecture__title-input {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  line-height: 1.15;
}

.lecture__title-input {
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  color: var(--text);
}

.lecture__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.lecture__action {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  cursor: pointer;
}

.lecture__action:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.lecture__action:disabled {
  opacity: 0.35;
  cursor: default;
}

.lecture__action--danger:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.lecture__tabs {
  display: flex;
  gap: 1.5rem;
  margin-block: 1.25rem 1.5rem;
}

.lecture__tab {
  padding: 0.3rem 0;
  border: 0;
  border-block-end: 2px solid transparent;
  background: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.lecture__tab--active {
  color: var(--text);
  border-block-end-color: var(--accent);
}

.lecture__text {
  list-style: none;
  margin: 0;
  padding: 0;
}

.lecture__para {
  display: grid;
  grid-template-columns: 3.6rem minmax(0, 65ch);
  gap: 1rem;
  padding-block: 0.5rem;
}

.lecture__time {
  padding-block-start: 0.3em;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.lecture__para-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  text-align: start;
}

@media (max-width: 560px) {
  .lecture__para {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.15rem;
  }
}
</style>
