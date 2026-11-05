<template>
  <div class="feed" :class="`feed--${textSize}`">
    <p v-if="!paragraphs.length && !hasTail" class="feed__empty">{{ placeholder }}</p>

    <TransitionGroup name="feed" tag="ol" class="feed__list">
      <li v-for="(p, index) in paragraphs" :key="index" class="feed__item">
        <span class="feed__time">{{ formatTime(p.startMs) }}</span>
        <div class="feed__body">
          <p class="feed__translation" dir="auto">{{ p.translation.trim() || '…' }}</p>
          <p
            v-if="showOriginal && !p.passthrough && p.original.trim()"
            class="feed__original"
            dir="auto"
          >{{ p.original.trim() }}</p>
        </div>
      </li>
    </TransitionGroup>

    <div v-if="hasTail" class="feed__item feed__item--tail" aria-live="off">
      <span class="feed__time"></span>
      <div class="feed__body">
        <p v-if="tail.translation.trim()" class="feed__translation" dir="auto">{{ tail.translation.trim() }}</p>
        <p v-if="showOriginal && tail.original.trim()" class="feed__original" dir="auto">{{ tail.original.trim() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue'
import { formatTime } from '../services/exporter.js'

const props = defineProps({
  paragraphs: { type: Array, required: true },
  tail: { type: Object, default: () => ({ original: '', translation: '' }) },
  showOriginal: { type: Boolean, default: true },
  textSize: { type: String, default: 'md' },
  placeholder: { type: String, default: '' },
  follow: { type: Boolean, default: false },
})

const hasTail = computed(() => Boolean(props.tail.original.trim() || props.tail.translation.trim()))

// Follow new text like a chat, unless the user scrolled up to re-read.
const FOLLOW_THRESHOLD = 160
let nearBottom = true
const measure = () => {
  const el = document.scrollingElement
  nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < FOLLOW_THRESHOLD
}

watch(
  () => [props.paragraphs.length, props.tail.original, props.tail.translation, props.paragraphs.at(-1)?.translation],
  async () => {
    if (!props.follow) return
    measure()
    if (!nearBottom) return
    await nextTick()
    const el = document.scrollingElement
    el.scrollTo({ top: el.scrollHeight })
  }
)
</script>

<style scoped>
.feed {
  --feed-size: 1.3rem;
  font-size: var(--feed-size);
  line-height: 1.5;
}

.feed--sm { --feed-size: 1.05rem; }
.feed--md { --feed-size: 1.3rem; }
.feed--lg { --feed-size: 1.65rem; }
.feed--xl { --feed-size: 2.1rem; }

.feed__empty {
  margin: 0;
  padding-block: 3rem;
  color: var(--text-faint);
  font-size: 1rem;
  text-align: center;
}

.feed__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.feed__item {
  display: grid;
  grid-template-columns: 3.6rem minmax(0, 65ch);
  gap: 0.25rem 1rem;
  padding-block: 0.6rem;
}

.feed__time {
  padding-block-start: 0.45em;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.feed__body {
  min-width: 0;
}

.feed__translation {
  margin: 0;
  color: var(--text);
  text-align: start;
  overflow-wrap: anywhere;
}

.feed__original {
  margin: 0.25rem 0 0;
  font-size: 0.62em;
  line-height: 1.45;
  color: var(--text-muted);
  text-align: start;
  overflow-wrap: anywhere;
}

.feed__item--tail .feed__translation,
.feed__item--tail .feed__original {
  color: var(--text-faint);
}

.feed-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.feed-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 560px) {
  .feed__item {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .feed-enter-active {
    transition: none;
  }
}
</style>
