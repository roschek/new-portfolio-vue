import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import FrontendPage from "../pages/FrontendPage.vue";
import TelegramPage from "../pages/TelegramPage.vue";
import AIPage from "../pages/AIPage.vue";
import ContactPage from "../pages/ContactPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/frontend", component: FrontendPage },
  { path: "/telegram", component: TelegramPage },
  { path: "/ai", component: AIPage },
  { path: "/contact", component: ContactPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
