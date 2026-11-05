<template>
  <div class="keyfield">
    <label class="keyfield__label" :for="inputId">
      {{ label }}
      <a :href="keyUrl" target="_blank" rel="noopener noreferrer" class="keyfield__link">{{ t('getKey') }} ↗</a>
    </label>
    <div class="keyfield__row">
      <input
        :id="inputId"
        v-model="value"
        class="keyfield__input"
        type="password"
        autocomplete="off"
        spellcheck="false"
        @change="save"
      />
      <button type="button" class="keyfield__check" :disabled="!value.trim() || probing" @click="check">
        {{ probing ? t('checking') : t('check') }}
      </button>
    </div>
    <p v-if="result" class="keyfield__result" :class="`keyfield__result--${result}`" role="status">
      {{ t(resultKey) }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { t } from '../i18n.js'
import { getKey, setKey } from '../services/keyVault.js'
import { probeKey } from '../services/keyProbe.js'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  keyUrl: { type: String, required: true },
})

const inputId = `key-${props.name}`
const value = ref(getKey(props.name))
const result = ref(null)
const probing = ref(false)

const resultKey = computed(
  () => ({ ok: 'probeOk', invalid: 'probeInvalid', unknown: 'probeUnknown' })[result.value]
)

function save() {
  setKey(props.name, value.value)
  result.value = null
}

async function check() {
  save()
  probing.value = true
  result.value = await probeKey({ name: props.name, key: value.value.trim() })
  probing.value = false
}
</script>

<style scoped>
.keyfield {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.keyfield__label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-weight: 500;
}

.keyfield__link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
}

.keyfield__row {
  display: flex;
  gap: 0.5rem;
}

.keyfield__input {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.keyfield__input:focus {
  outline: none;
  border-color: var(--accent);
}

.keyfield__check {
  padding: 0 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: transparent;
  color: var(--text);
  font: inherit;
  cursor: pointer;
}

.keyfield__check:disabled {
  opacity: 0.4;
  cursor: default;
}

.keyfield__result {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.keyfield__result--ok {
  color: #7ccf8a;
}

.keyfield__result--invalid {
  color: var(--accent);
}

.keyfield__result--unknown {
  color: var(--text-muted);
}
</style>
