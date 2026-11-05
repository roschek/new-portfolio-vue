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

let enabled = false;

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
