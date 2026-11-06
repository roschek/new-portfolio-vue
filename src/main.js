import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import reveal from "./directives/reveal.js";

import "./assets/main.css";
import "./assets/editorial.css";

const app = createApp(App);
app.use(router);
app.directive("reveal", reveal);
// Wait for the first route so bare pages never flash the site layout.
router.isReady().then(() => app.mount("#app"));
