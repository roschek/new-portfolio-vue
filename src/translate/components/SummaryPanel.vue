<template>
  <div class="summary">
    <div v-if="session.summary" class="summary__body" dir="auto" v-html="html"></div>

    <p v-if="!key" class="summary__note">
      {{ t('summaryNoKey', { provider: providerLabel }) }}
      <RouterLink to="/translate/settings">→ {{ t('navSettings') }}</RouterLink>
    </p>

    <template v-else>
      <p v-if="errorKind" class="summary__error" role="alert">{{ errorText }}</p>
      <div class="summary__actions">
        <button type="button" class="summary__btn" :disabled="working || !text" @click="make">
          {{ working ? t('summaryWorking') : session.summary ? t('summaryRemake') : t('summaryMake') }}
        </button>
        <span class="summary__estimate">
          {{ t('summaryEstimate', { tokens: estimateTokens(text).toLocaleString(), provider: providerLabel }) }}
        </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { t } from '../i18n.js'
import { getKey, getSummaryProvider } from '../services/keyVault.js'
import { PROVIDERS } from '../services/llmProviders.js'
import { summarize, estimateTokens } from '../services/summarizer.js'

const props = defineProps({
  session: { type: Object, required: true },
  // Start generating right away (the "Make a summary" button above the tabs).
  autostart: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

const provider = getSummaryProvider()
const key = getKey(provider)
const providerLabel = PROVIDERS[provider].label

const working = ref(false)
const errorKind = ref(null)

// The original is more accurate than the translation: no double error.
const text = computed(() => props.session.paragraphs.map((p) => p.original.trim()).filter(Boolean).join('\n\n'))

// Model output is untrusted: always sanitize before v-html.
const html = computed(() => DOMPurify.sanitize(marked.parse(props.session.summary?.markdown ?? '')))

const errorText = computed(() => {
  const name = `summaryErr${errorKind.value[0].toUpperCase()}${errorKind.value.slice(1)}`
  return t(name, { provider: providerLabel })
})

async function make() {
  working.value = true
  errorKind.value = null
  try {
    const markdown = await summarize({ provider, key, text: text.value, lang: props.session.targetLang })
    emit('update', {
      ...props.session,
      summary: { provider, model: PROVIDERS[provider].model, markdown, createdAt: Date.now() },
    })
  } catch (err) {
    errorKind.value = err.kind ?? 'other'
  } finally {
    working.value = false
  }
}

onMounted(() => {
  if (props.autostart && key && text.value && !props.session.summary) make()
})
</script>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary__body {
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 68ch;
}

.summary__body :deep(h1),
.summary__body :deep(h2),
.summary__body :deep(h3) {
  margin: 1.6em 0 0.5em;
  font-family: var(--font-display);
  font-size: 1.25rem;
}

.summary__body :deep(h1:first-child),
.summary__body :deep(h2:first-child),
.summary__body :deep(h3:first-child) {
  margin-block-start: 0;
}

.summary__body :deep(ul) {
  list-style: disc;
  padding-inline-start: 1.25rem;
}

.summary__body :deep(ol) {
  list-style: decimal;
  padding-inline-start: 1.25rem;
}

.summary__body :deep(li::marker) {
  color: var(--accent);
}

.summary__body :deep(li) {
  margin-block: 0.3rem;
}

.summary__body :deep(strong) {
  color: var(--accent-hi);
}

.summary__note,
.summary__estimate {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.summary__estimate {
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.summary__error {
  margin: 0;
  color: var(--accent-hi);
}

.summary__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.summary__btn {
  padding: 0.7rem 1.2rem;
  border: 0;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--bg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.summary__btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
