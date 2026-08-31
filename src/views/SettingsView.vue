<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeStore } from "../stores/theme";

const theme = useThemeStore();
// storeToRefs 只解构 state；函数可以（也应该）直接从 store 上取
const { isDark } = storeToRefs(theme);
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="demo-card">
      <h2 class="demo-card__title">Pinia 状态演示</h2>
      <p class="demo-card__hint">
        主题状态由 <code class="code-block">src/stores/theme.ts</code> 持有。
        切到别的路由再切回来，状态依然保留 —— 这就是把状态放进 store 而非组件的意义。
      </p>

      <div class="demo-row-2">
        <el-button type="primary" @click="theme.toggle()">
          <span class="mr-1" :class="isDark ? 'i-tabler-moon-stars' : 'i-tabler-sun-high'" />
          {{ isDark ? "切换到亮色" : "切换到暗色" }}
        </el-button>
        <el-tag :type="isDark ? 'info' : 'warning'" effect="plain">
          当前：{{ isDark ? "暗黑模式" : "亮色模式" }}
        </el-tag>
      </div>

      <p class="demo-card__hint mt-3">
        状态已写入 <code class="code-block">localStorage</code>，重启应用后依然生效。
        生产项目建议换成 <code class="code-block">tauri-plugin-store</code>：
        只需修改 store 内部的读写两行，本组件无需改动。
      </p>
    </section>

    <section class="demo-card">
      <h2 class="demo-card__title">关于路由模式</h2>
      <p class="demo-card__hint">
        本模板使用 <strong>hash 模式</strong>
        （<code class="code-block">createWebHashHistory</code>）。
        打包后页面由 Tauri 自定义协议提供，没有服务端为任意路径回退 index.html，
        因此不能用 <code class="code-block">createWebHistory</code>，否则刷新即白屏。
      </p>
    </section>
  </div>
</template>
