import { createApp } from "vue";
// 引入顺序即最终 CSS 的层叠顺序，不可调换：reset 打头、原子类收尾、组件库夹中间。
// presetWind4 的内置 reset 已在 uno.config.ts 关闭，否则它会随原子类一起排到最后。
// 用 tailwind-compat 版：它是官方为「与 UI 框架共存」准备的，去掉了原生 reset 中
// 把 button 背景刷成透明的那条规则，否则会破坏 Element Plus 的按钮底色。
import "@unocss/reset/tailwind-compat.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "virtual:uno.css";
// 全局 SCSS：由 sass-embedded 编译，里头的 @apply 由 UnoCSS 的 transformerDirectives 展开
import "./styles/demo.scss";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

// 注册顺序：pinia 必须在挂载前装好，否则 App.vue 的 setup 里调用
// useThemeStore() 时还没有 active pinia，会抛 "getActivePinia()" 错误。
// router 同理——App.vue 用到了 RouterLink。
createApp(App).use(createPinia()).use(ElementPlus).use(router).mount("#app");
