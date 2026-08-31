import { createApp } from "vue";
// 引入顺序即最终 CSS 的层叠顺序，不可调换：reset 打头、组件库居中、原子类收尾。
// presetWind4 的内置 reset 已在 uno.config.ts 关闭，否则它会随原子类一起排到最后。
// 用 tailwind-compat 版：它是官方为「与 UI 框架共存」准备的，去掉了原生 reset 中
// 把 button 背景刷成透明的那条规则，否则会破坏 Element Plus 的按钮底色。
import "@unocss/reset/tailwind-compat.css";
// 暗色变量是 EP 组件样式消费的 CSS 变量，需在组件样式之前定义。
import "element-plus/theme-chalk/dark/css-vars.css";

// Element Plus 按需引入：不再 import "element-plus/dist/index.css"，
// 各组件样式由 unplugin-vue-components 注入，位置就是下面两个模块的依赖图里。
// 关键：这两行必须在 virtual:uno.css *之前*。
// 若放到后面，EP 的 CSS 会排在原子类之后，同权重下反过来盖住原子类
// （例如 <el-tag class="hidden"> 会重新显示出来）。
import App from "./App.vue";
import router from "./router";

import "virtual:uno.css";
// 全局 SCSS：由 sass-embedded 编译，里头的 @apply 由 UnoCSS 的 transformerDirectives 展开
import "./styles/demo.scss";
import { createPinia } from "pinia";

// 注册顺序：pinia 必须在挂载前装好，否则 App.vue 的 setup 里调用
// useThemeStore() 时还没有 active pinia，会抛 "getActivePinia()" 错误。
// router 同理——App.vue 用到了 RouterLink。
// 不再 use(ElementPlus)：组件已按需引入，插件只负责全局默认配置（size/zIndex/locale），
// 需要时改用 <el-config-provider> 包裹根组件，见 README 的「Element Plus 按需加载」一节。
createApp(App).use(createPinia()).use(router).mount("#app");
