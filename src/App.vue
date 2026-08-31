<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import DemoUno from "./components/DemoUno.vue";
import DemoIcons from "./components/DemoIcons.vue";
import DemoElement from "./components/DemoElement.vue";
import DemoLodash from "./components/DemoLodash.vue";

const STORAGE_KEY = "demo:dark";

// 从 localStorage 恢复，避免刷新时主题闪回
const isDark = ref(localStorage.getItem(STORAGE_KEY) === "1");

function applyDark(dark: boolean) {
  // Element Plus 与 UnoCSS 的 dark: 变体都认 <html class="dark">，一次切换同时驱动两边
  document.documentElement.classList.toggle("dark", dark);
}

applyDark(isDark.value);

function toggleDark() {
  isDark.value = !isDark.value;
  applyDark(isDark.value);
  localStorage.setItem(STORAGE_KEY, isDark.value ? "1" : "0");
  ElMessage.success(isDark.value ? "已切换到暗黑模式" : "已切换到亮色模式");
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

      <div class="ml-auto demo-row-2">
        <el-tooltip :content="isDark ? '切到亮色' : '切到暗色'" placement="bottom">
          <el-button text circle @click="toggleDark">
            <span
              class="text-xl"
              :class="isDark ? 'i-tabler-moon-stars' : 'i-tabler-sun-high'"
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

    <main class="mx-auto max-w-6xl p-4 flex flex-col gap-4">
      <DemoUno />
      <DemoIcons />
      <DemoElement />
      <DemoLodash />

      <footer class="py-6 text-center text-xs text-secondary">
        所有样式由 UnoCSS 按需生成 —— 未使用的类名不会进入产物
      </footer>
    </main>
  </div>
</template>
