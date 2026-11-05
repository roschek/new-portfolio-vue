<template>
  <p class="status" :class="`status--${status}`" role="status">
    <span class="status__dot" aria-hidden="true">●</span>
    <span class="status__state">{{ t(stateKey) }}</span>
    <span class="status__sep">·</span>
    <span class="status__time">{{ formatTime(elapsedMs) }}</span>
    <span class="status__sep">·</span>
    <span>auto→{{ targetLang.toUpperCase() }}</span>
    <span class="status__sep">·</span>
    <span>{{ words.toLocaleString() }} {{ t('words') }}</span>
  </p>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../i18n.js'
import { formatTime } from '../services/exporter.js'

const props = defineProps({
  status: { type: String, required: true },
  elapsedMs: { type: Number, default: 0 },
  targetLang: { type: String, required: true },
  words: { type: Number, default: 0 },
})

const stateKey = computed(() => `status${props.status[0].toUpperCase()}${props.status.slice(1)}`)
</script>

<style scoped>
.status {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.status__dot {
  color: var(--text-faint);
}

.status--recording .status__dot {
  color: var(--accent);
  animation: status-blink 1.4s ease-in-out infinite;
}

.status--recording .status__state,
.status--error .status__state {
  color: var(--accent);
}

.status--reconnecting .status__dot,
.status--connecting .status__dot {
  color: var(--accent-hi);
}

.status__time {
  color: var(--text);
}

.status__sep {
  color: var(--text-faint);
}

@keyframes status-blink {
  50% {
    opacity: 0.25;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status--recording .status__dot {
    animation: none;
  }
}
</style>
