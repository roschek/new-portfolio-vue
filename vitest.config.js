import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    include: ["test/**/*.spec.js"],
    coverage: {
      provider: "v8",
      include: ["src/translate/services/**", "src/translate/composables/**"],
      thresholds: { statements: 70, branches: 70, functions: 70, lines: 70 },
    },
  },
});
