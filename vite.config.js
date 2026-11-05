import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Service worker for the /translate/ PWA only. The manifest is a static
    // file in public/translate and is linked at runtime by src/translate/pwa.js,
    // so the rest of the portfolio is not installable.
    VitePWA({
      injectRegister: false,
      manifest: false,
      scope: "/translate/",
      workbox: {
        globPatterns: ["index.html", "assets/**/*.{js,css,woff2}", "translate/*.{png,svg,webmanifest}"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [/^\/translate/],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
