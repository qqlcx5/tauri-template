import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "demo:dark";

/**
 * 主题状态（Pinia setup store 写法）。
 *
 * 状态存在这里而不是 App.vue，原因：
 * 1. 路由切换 / 组件重建不会丢失，也不需要用 provide/inject 层层传递；
 * 2. 将来换成 Tauri 的 `tauri-plugin-store`（真正的本地持久化）时，
 *    只需改这个文件里的读写，所有使用方无需变动。
 */
export const useThemeStore = defineStore("theme", () => {
  // 从 localStorage 恢复，避免刷新时主题闪回
  const isDark = ref(localStorage.getItem(STORAGE_KEY) === "1");

  function apply(dark: boolean) {
    // Element Plus 与 UnoCSS 的 dark: 变体都认 <html class="dark">，一次切换同时驱动两边
    document.documentElement.classList.toggle("dark", dark);
  }

  function toggle() {
    isDark.value = !isDark.value;
  }

  // 立即应用一次，之后由 watch 同步。
  // 不能只依赖 watch：它默认非 immediate，首帧渲染时 class 还没打上。
  apply(isDark.value);

  watch(isDark, (dark) => {
    apply(dark);
    localStorage.setItem(STORAGE_KEY, dark ? "1" : "0");
  });

  return { isDark, toggle };
});
