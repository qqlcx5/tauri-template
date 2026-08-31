<script setup lang="ts">
// ElMessage 无需 import：unplugin-auto-import 会自动注入组件与样式
import { useThemeStore } from "./stores/theme";

const theme = useThemeStore();

const navItems = [
  { to: "/", label: "演示" },
  { to: "/settings", label: "设置" },
];

function toggleDark() {
  theme.toggle();
  ElMessage.success(theme.isDark ? "已切换到暗黑模式" : "已切换到亮色模式");
}
</script>

<template>
  <div class="min-h-screen bg-page text-regular">
    <header
      class="sticky top-0 z-10 h-14 flex items-center gap-3 border-b border-[var(--el-border-color)] bg-[var(--el-bg-color)]/85 px-4 backdrop-blur"
    >
      <span class="i-tabler-rocket text-2xl text-primary" />
      <h1 class="text-base font-bold">Tauri + Vue 技术栈演示</h1>
      <el-tag size="small" type="info" effect="plain" class="hidden sm:inline-flex">
        UnoCSS · Element Plus · lodash-es · sass-embedded
      </el-tag>

      <nav class="ml-auto flex items-center gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded px-3 py-1.5 text-sm text-secondary no-underline transition-colors hover:bg-[var(--el-fill-color-light)]"
          active-class="!text-primary bg-[var(--el-fill-color)]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="demo-row-2">
        <el-tooltip :content="theme.isDark ? '切到亮色' : '切到暗色'" placement="bottom">
          <el-button text circle @click="toggleDark">
            <span
              class="text-xl"
              :class="theme.isDark ? 'i-tabler-moon-stars' : 'i-tabler-sun-high'"
            />
          </el-button>
        </el-tooltip>
        <el-button
          text
          circle
          tag="a"
          href="https://github.com/tauri-apps/tauri"
          target="_blank"
        >
          <span class="i-tabler-brand-github text-xl" />
        </el-button>
      </div>
    </header>

    <main class="mx-auto max-w-6xl p-4">
      <RouterView />
    </main>
  </div>
</template>
