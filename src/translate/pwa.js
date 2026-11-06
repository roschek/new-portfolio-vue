// Makes /translate/ installable without turning the whole portfolio into a
// PWA: the manifest link is added only on translator routes and the
// service worker is scoped to /translate/.

const HEAD_TAGS = [
  ["link", { rel: "manifest", href: "/translate/manifest.webmanifest" }],
  ["link", { rel: "apple-touch-icon", href: "/translate/apple-touch-icon-180x180.png" }],
  ["meta", { name: "theme-color", content: "#0D0D0D" }],
  ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
  ["meta", { name: "mobile-web-app-capable", content: "yes" }],
  ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }],
  ["meta", { name: "apple-mobile-web-app-title", content: "Translator" }],
];

import { ref } from "vue";

let enabled = false;
let deferredPrompt = null;

const ua = navigator.userAgent;
const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);
const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

// 'prompt' — the browser gave us an install prompt (Chrome, Edge, Android);
// 'ios' / 'android' — show manual instructions; 'none' — installed or unsupported.
export const installMode = ref(isStandalone() ? "none" : isIos ? "ios" : isAndroid ? "android" : "none");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installMode.value = "prompt";
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  installMode.value = "none";
});

export async function promptInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  // A prompt can be shown only once per page load.
  installMode.value = outcome === "accepted" || !isAndroid ? "none" : "android";
}

export function enablePwa() {
  if (enabled) return;
  enabled = true;

  for (const [tag, attrs] of HEAD_TAGS) {
    const selector = `${tag}[${attrs.rel ? `rel="${attrs.rel}"` : `name="${attrs.name}"`}]`;
    if (document.head.querySelector(selector)) continue;
    const el = document.createElement(tag);
    Object.assign(el, attrs);
    if (attrs.name) el.setAttribute("name", attrs.name);
    document.head.append(el);
  }

  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/translate/" }).catch(() => {
      // Offline support is optional; the app works without it.
    });
  }
}
