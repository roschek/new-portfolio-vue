// API keys live only in this browser: sessionStorage by default,
// localStorage when the user ticks "remember on this device".

export const KEY_NAMES = ["soniox", "gemini", "anthropic", "openai"];
const PREFIX = "translate:key:";
const REMEMBER = "translate:remember";
const PROVIDER = "translate:summaryProvider";

export const getRemember = () => localStorage.getItem(REMEMBER) === "1";
const storage = () => (getRemember() ? localStorage : sessionStorage);

export const getKey = (name) => storage().getItem(PREFIX + name) ?? "";

export function setKey(name, value) {
  const trimmed = value.trim();
  if (trimmed) storage().setItem(PREFIX + name, trimmed);
  else storage().removeItem(PREFIX + name);
}

export function setRemember(remember) {
  const from = storage();
  if (remember) localStorage.setItem(REMEMBER, "1");
  else localStorage.removeItem(REMEMBER);
  const to = storage();
  if (from === to) return;
  for (const name of KEY_NAMES) {
    const value = from.getItem(PREFIX + name);
    from.removeItem(PREFIX + name);
    if (value) to.setItem(PREFIX + name, value);
  }
}

export function forgetKeys() {
  for (const name of KEY_NAMES) {
    localStorage.removeItem(PREFIX + name);
    sessionStorage.removeItem(PREFIX + name);
  }
}

export const getSummaryProvider = () => localStorage.getItem(PROVIDER) ?? "gemini";
export const setSummaryProvider = (provider) => localStorage.setItem(PROVIDER, provider);
