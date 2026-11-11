<template>
  <div ref="root" class="page-hero" :class="{ 'page-hero--ready': ready }" @pointermove="move">
    <div class="page-hero__spotlight" aria-hidden="true"></div>
    <section class="section section--first page-hero__inner">
      <slot />
    </section>
  </div>
</template>

<script setup>
// Top of an inner page: the same cursor spotlight and staggered entrance
// as the home hero, around the page's SectionHead.
import { ref, onMounted } from 'vue'

const root = ref(null)
const ready = ref(false)

function move(event) {
  const rect = root.value.getBoundingClientRect()
  root.value.style.setProperty('--x', `${event.clientX - rect.left}px`)
  root.value.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

onMounted(() => requestAnimationFrame(() => (ready.value = true)))
</script>

<style>
/* Not scoped: the entrance animates the children of the slotted SectionHead. */
.page-hero {
  --x: 30%;
  --y: 45%;
  position: relative;
  overflow: hidden;
}

.page-hero__spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(520px circle at var(--x) var(--y), rgba(255, 107, 53, 0.12), transparent 60%);
  pointer-events: none;
  /* Fade out before the hero's bottom edge so the glow has no visible border. */
  mask-image: linear-gradient(to bottom, #000 55%, transparent);
}

.page-hero__inner {
  position: relative;
}

@media (prefers-reduced-motion: no-preference) {
  .page-hero .section-head > * {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  .page-hero--ready .section-head > * {
    opacity: 1;
    transform: none;
  }

  .page-hero--ready .section-head > :nth-child(2) { transition-delay: 0.08s; }
  .page-hero--ready .section-head > :nth-child(3) { transition-delay: 0.16s; }
}
</style>
