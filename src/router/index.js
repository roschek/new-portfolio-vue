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
  {
    // Lecture translator PWA: lazy so site visitors never download it.
    path: "/translate",
    component: () => import("../translate/TranslateShell.vue"),
    meta: { bare: true },
    children: [
      { path: "", component: () => import("../translate/pages/LivePage.vue") },
      { path: "sessions", component: () => import("../translate/pages/SessionsPage.vue") },
      { path: "sessions/:id", component: () => import("../translate/pages/SessionPage.vue"), props: true },
      { path: "settings", component: () => import("../translate/pages/SettingsPage.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 80, behavior: "smooth" };
    return { top: 0 };
  },
});

export default router;
