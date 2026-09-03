import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import PortfolioPage from "../pages/PortfolioPage.vue";
import TelegramPage from "../pages/TelegramPage.vue";
import AIPage from "../pages/AIPage.vue";
import CodeLabPage from "../pages/CodeLabPage.vue";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/portfolio", component: PortfolioPage },
  // Kept so links to the old URL keep working after the rename.
  { path: "/frontend", redirect: "/portfolio" },
  { path: "/telegram", component: TelegramPage },
  { path: "/ai", component: AIPage },
  { path: "/codelab", component: CodeLabPage },
  { path: "/privacy-policy", component: PrivacyPolicyPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
