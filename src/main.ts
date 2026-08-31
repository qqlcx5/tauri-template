import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
// UnoCSS 必须放在组件库样式之后，原子类才能覆盖组件默认样式
import "virtual:uno.css";
// 全局 SCSS：由 sass-embedded 编译，里头的 @apply 由 UnoCSS 的 transformerDirectives 展开
import "./styles/demo.scss";
import App from "./App.vue";

createApp(App).use(ElementPlus).mount("#app");
