<template>
  <div class="record">
    <button
      v-if="hasSession"
      type="button"
      class="record__stop"
      :disabled="status === 'stopping'"
      :aria-label="t('stop')"
      @click="$emit('stop')"
    >
      <span class="record__stop-icon" aria-hidden="true"></span>
      <span class="record__stop-text">{{ t('stop') }}</span>
    </button>

    <button
      ref="main"
      type="button"
      class="record__main"
      :class="`record__main--${mode}`"
      :disabled="status === 'stopping'"
      :aria-label="label"
      @click="onMain"
    >
      <span class="record__ring" aria-hidden="true"></span>
      <span class="record__icon" :class="`record__icon--${mode}`" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { t } from '../i18n.js'

const props = defineProps({
  status: { type: String, required: true },
  hasSession: { type: Boolean, default: false },
  getLevel: { type: Function, default: () => 0 },
})
const emit = defineEmits(['start', 'pause', 'resume', 'stop'])

const main = ref(null)

// What the big button does right now.
const mode = computed(() => {
  if (['recording', 'reconnecting', 'connecting'].includes(props.status)) return 'pause'
  if (props.hasSession) return 'resume'
  return 'start'
})

const label = computed(() => t(mode.value))

function onMain() {
  emit(mode.value)
}

// Drive the ring from the microphone level without touching Vue state.
let frame = null
function tick() {
  main.value?.style.setProperty('--level', props.getLevel().toFixed(3))
  frame = requestAnimationFrame(tick)
}
function stopMeter() {
  if (frame) cancelAnimationFrame(frame)
  frame = null
  main.value?.style.setProperty('--level', '0')
}

watch(
  () => props.status === 'recording',
  (recording) => (recording ? !frame && tick() : stopMeter()),
  { immediate: true }
)
onBeforeUnmount(stopMeter)
</script>

<style scoped>
.record {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.record__main {
  --level: 0;
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  border: 0;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.15s ease, background-color 0.2s ease;
}

.record__main:active {
  transform: scale(0.95);
}

.record__main:disabled {
  opacity: 0.5;
}

.record__main--resume,
.record__main--start {
  box-shadow: 0 0 0 6px var(--accent-dim);
}

.record__ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  opacity: calc(0.25 + var(--level) * 0.75);
  transform: scale(calc(1 + var(--level) * 0.45));
  transition: transform 0.08s linear, opacity 0.08s linear;
  pointer-events: none;
}

.record__icon--start {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: var(--bg);
}

.record__icon--pause {
  width: 1.2rem;
  height: 1.4rem;
  border-inline: 0.42rem solid var(--bg);
}

.record__icon--resume {
  width: 0;
  height: 0;
  border-block: 0.8rem solid transparent;
  border-inline-start: 1.3rem solid var(--bg);
  margin-inline-start: 0.3rem;
}

/* The play triangle must point the reading direction. */
:dir(rtl) .record__icon--resume {
  margin-inline-start: 0;
  margin-inline-end: 0.3rem;
}

.record__stop {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg-elevated);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.record__stop:hover {
  border-color: var(--text-muted);
}

.record__stop-icon {
  width: 0.65rem;
  height: 0.65rem;
  background: var(--text);
  border-radius: 1px;
}

@media (prefers-reduced-motion: reduce) {
  .record__ring {
    transform: none;
    transition: none;
  }
}
</style>
