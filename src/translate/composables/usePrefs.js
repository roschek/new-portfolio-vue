// UI preferences of the translator, persisted in localStorage.
import { ref, watch } from "vue";

function stored(key, fallback) {
  const raw = localStorage.getItem(key);
  const value = ref(raw === null ? fallback : JSON.parse(raw));
  watch(value, (next) => localStorage.setItem(key, JSON.stringify(next)));
  return value;
}

export function usePrefs(defaultLang = "en") {
  return {
    targetLang: stored("translate:targetLang", defaultLang),
    textSize: stored("translate:textSize", "md"),
    showOriginal: stored("translate:showOriginal", true),
  };
}
