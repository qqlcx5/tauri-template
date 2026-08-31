import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  // 必须用 hash 模式，不要用 createWebHistory()。
  // 打包后页面由 Tauri 的自定义协议（tauri://localhost / http://tauri.localhost）提供，
  // 背后没有服务端，WebHistory 下访问 /settings 或按 F5 刷新会因找不到该路径的资源而白屏；
  // hash 模式把路径放在 # 后面，请求始终是 index.html，天然可用。
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
    },
    {
      // 兜底路由：放在最后，捕获所有未匹配路径
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
