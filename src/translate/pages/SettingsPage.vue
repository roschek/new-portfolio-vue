<template>
  <section class="settings">
    <p class="settings__label">§ 03 · {{ t('settingsTitle') }}</p>
    <p class="settings__intro">{{ t('settingsIntro') }}</p>

    <KeyField
      :key="`soniox-${epoch}`"
      name="soniox"
      :label="t('sonioxKey')"
      key-url="https://console.soniox.com"
    />

    <fieldset class="settings__group">
      <legend class="settings__legend">{{ t('summaryProvider') }}</legend>
      <div class="settings__providers" role="radiogroup">
        <button
          v-for="(info, id) in PROVIDERS"
          :key="id"
          type="button"
          role="radio"
          :aria-checked="provider === id"
          class="settings__provider"
          :class="{ 'settings__provider--active': provider === id }"
          @click="chooseProvider(id)"
        >
          {{ info.label }}
        </button>
      </div>
      <KeyField
        :key="`${provider}-${epoch}`"
        :name="provider"
        :label="PROVIDERS[provider].label"
        :key-url="PROVIDERS[provider].keyUrl"
      />
    </fieldset>

    <label class="settings__check">
      <input type="checkbox" :checked="remember" @change="toggleRemember($event.target.checked)" />
      {{ t('remember') }}
    </label>

    <button type="button" class="settings__forget" @click="forget">{{ t('forget') }}</button>
    <p v-if="forgotten" class="settings__note" role="status">{{ t('forgotten') }}</p>

    <p class="settings__hint">{{ t('pwaHint') }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../i18n.js'
import { PROVIDERS } from '../services/llmProviders.js'
import {
  getRemember, setRemember, forgetKeys, getSummaryProvider, setSummaryProvider,
} from '../services/keyVault.js'
import KeyField from '../components/KeyField.vue'

const provider = ref(getSummaryProvider())
const remember = ref(getRemember())
const forgotten = ref(false)
// Bumped to remount key fields after keys are forgotten.
const epoch = ref(0)

function chooseProvider(id) {
  provider.value = id
  setSummaryProvider(id)
}

function toggleRemember(value) {
  setRemember(value)
  remember.value = value
}

function forget() {
  forgetKeys()
  forgotten.value = true
  epoch.value++
}
</script>

<style scoped>
.settings {
  width: min(100%, 40rem);
  margin-inline: auto;
  padding: 2rem clamp(1rem, 4vw, 2rem) 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.settings__intro,
.settings__hint {
  margin: 0;
  color: var(--text-muted);
}

.settings__hint {
  padding-block-start: 1.5rem;
  border-block-start: 1px dashed var(--line);
  font-size: 0.9rem;
}

.settings__group {
  margin: 0;
  padding: 0;
  border: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings__legend {
  margin-block-end: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.settings__providers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.settings__provider {
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  cursor: pointer;
}

.settings__provider--active {
  border-color: var(--accent);
  color: var(--text);
  background: var(--accent-dim);
}

.settings__check {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  cursor: pointer;
}

.settings__check input {
  accent-color: var(--accent);
  width: 1.1rem;
  height: 1.1rem;
}

.settings__forget {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-muted);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.settings__forget:hover {
  color: var(--accent);
}

.settings__note {
  margin: 0;
  color: var(--accent);
  font-size: 0.9rem;
}
</style>
