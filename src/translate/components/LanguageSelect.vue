<template>
  <div class="langs" role="radiogroup" :aria-label="label">
    <button
      v-for="lang in TARGET_LANGUAGES"
      :key="lang.code"
      type="button"
      role="radio"
      :aria-checked="modelValue === lang.code"
      :disabled="disabled"
      class="langs__item"
      :class="{ 'langs__item--active': modelValue === lang.code }"
      :title="lang.native"
      @click="$emit('update:modelValue', lang.code)"
    >
      {{ lang.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { TARGET_LANGUAGES } from '../languages.js'

defineProps({
  modelValue: { type: String, required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.langs {
  display: inline-flex;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 2px;
}

.langs__item {
  padding: 0.35rem 0.6rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.langs__item:disabled {
  cursor: default;
}

.langs__item--active {
  background: var(--accent);
  color: var(--bg);
}
</style>
