<template>
  <header class="section-head accent" :class="{ 'section-head--page': level === 1 }">
    <p class="label">
      {{ label }}<span v-if="note" class="label__dim"> · {{ note }}</span>
    </p>
    <component :is="level === 1 ? 'h1' : 'h2'" class="section-head__title"><slot /></component>
    <p v-if="$slots.lead" class="section-head__lead"><slot name="lead" /></p>
  </header>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  note: { type: String, default: '' },
  level: { type: Number, default: 2 },
})
</script>

<style scoped>
.section-head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block-end: 2.5rem;
}

.section-head::after {
  content: '';
  border-block-start: 1px dashed var(--line);
}

.section-head__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.section-head--page .section-head__title {
  font-size: clamp(2.6rem, 8vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
}

.section-head__title :slotted(em) {
  font-size: 1.1em;
}

.section-head__lead {
  max-width: 52ch;
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.55;
  color: var(--text-muted);
}
</style>
