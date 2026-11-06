<template>
  <div v-if="visible" class="install" role="region" :aria-label="t('installApp')">
    <button v-if="installMode === 'prompt'" type="button" class="install__button" @click="promptInstall">
      ↓ {{ t('installApp') }}
    </button>
    <p v-else class="install__text">{{ installMode === 'ios' ? t('installIos') : t('installAndroid') }}</p>
    <button type="button" class="install__close" :aria-label="t('installDismiss')" @click="dismiss">×</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../i18n.js'
import { installMode, promptInstall } from '../pwa.js'

const STORAGE_KEY = 'translate:install-dismissed'
const dismissed = ref(localStorage.getItem(STORAGE_KEY) === '1')

const visible = computed(() => !dismissed.value && installMode.value !== 'none')

function dismiss() {
  dismissed.value = true
  localStorage.setItem(STORAGE_KEY, '1')
}
</script>

<style scoped>
.install {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem clamp(1rem, 4vw, 2rem);
  border-block-end: 1px dashed var(--line);
  background: var(--bg-elevated);
  font-size: 0.85rem;
}

.install__button {
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.install__text {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.4;
}

.install__close {
  margin-inline-start: auto;
  padding: 0.2rem 0.5rem;
  border: 0;
  background: none;
  color: var(--text-faint);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.install__close:hover {
  color: var(--text);
}
</style>
