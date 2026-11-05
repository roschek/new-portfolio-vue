import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
app.use(router);
// Wait for the first route so bare pages never flash the site layout.
router.isReady().then(() => app.mount("#app"));
