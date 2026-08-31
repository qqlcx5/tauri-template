import { defineConfig, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// 本项目未引入 @types/node，直接写 `process` 只能靠 @ts-expect-error 压制类型错误；
// 而一旦后续装上 @types/node，那条 @ts-expect-error 又会因"没有错误"变成新的编译错误。
// 通过 globalThis 做一次窄化断言，两种情况下都不会报错。
const host = (
  globalThis as {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env?.TAURI_DEV_HOST;

// https://vite.dev/config/
// 这里用同步回调而非 async：配置内没有异步操作，而 tsconfig.node.json 未指定 target/lib
// （默认 ES5，无 Promise 声明），写成 async 会报 TS2705。
export default defineConfig((): UserConfig => ({
  plugins: [
    vue(),
    UnoCSS(),
    // Element Plus 按需引入（官方 Quick Start 的 "Auto Import" 方案）。两个插件各管一半，缺一不可：
    // - Components：处理模板里的 <el-xxx> 标签，自动补组件 import + 对应样式
    // - AutoImport：处理 <script setup> 里的 ElMessage 这类函数式调用。它们不出现在模板中，
    //   Components 扫不到；漏掉这个插件，弹窗就只剩无样式的裸 div。
    //
    // importStyle 可选值（见 unplugin-vue-components/dist/resolvers.mjs 的 getSideEffects）：
    //   "css"（默认，源码里是 options.importStyle ?? "css"）取编译好的 CSS；
    //   "less" / "css-in-js" 走运行时样式；false 则完全不引样式。
    // 注意没有 "sass" 这个取值——想改 EP 主题请走官方 Theming（SCSS 变量覆盖），
    // 与本插件的 importStyle 无关。
    //
    // dts 放在 src/ 下，确保被 tsconfig 的 include 覆盖（已用 vue-tsc --listFiles 验证加载）。
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "css" })],
      dts: "src/components.d.ts",
    }),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: "css" })],
      dts: "src/auto-imports.d.ts",
    }),
  ],

  // 装了 sass-embedded 后 Vite 会自动优先用它（比 sass 快数倍）。
  // 显式声明 api 可抑制 legacy JS API 的弃用告警。
  // 注意：回调的返回类型必须显式标注为 UserConfig（见下方 export default 处），
  // 否则 `api` 会被推断成宽泛的 string，匹配不上 SassPreprocessorOptions
  // 要求的 'modern' | 'modern-compiler' 字面量联合类型。
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },

  build: {
    // Tauri 只跑在现代 WebView 上，无需向下兼容转译，可省掉降级开销、缩小产物
    target: "esnext",
    // 所有样式合并进单个 CSS 文件，顺序严格遵循 main.ts 的 import 顺序。
    // 开启分割时 CSS 各自跟着 JS chunk 成文件，顺序由 chunk 顺序决定：Element Plus
    // 分到独立 chunk 后其 CSS 会先于含 reset 的入口 CSS 加载，层叠被反转（已实测）。
    // 代价：将来上路由懒加载，异步页的 CSS 也会进首屏这一个文件。
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 用函数而不是对象形式分包：
        // 1. 对象形式列出的包若未被引用（比如哪天移除了 lodash-es），Rollup 会生成空 chunk 并告警；
        // 2. 对象形式只认精确包名，@vue/*、@element-plus/* 等子包会漏到默认 chunk 里，拆不干净。
        // 注：tsconfig.node.json 未指定 target/lib（默认 ES5），故这里避开
        // String.prototype.includes / startsWith，统一用 indexOf 判断前缀。
        manualChunks(id) {
          // Windows 下 id 是反斜杠路径，先归一化；用 lastIndexOf 取最后一段
          // node_modules/，兼容 pnpm 的 .pnpm/<pkg>@<ver>/node_modules/<pkg> 嵌套结构
          const normalized = id.replace(/\\/g, "/");
          const marker = "node_modules/";
          const at = normalized.lastIndexOf(marker);
          // 只认目录分隔符包裹的 node_modules，避免 my-node_modules-backup 这类路径误判
          if (at === -1) return;

          const rest = normalized.slice(at + marker.length);
          const segments = rest.split("/");
          const head = segments[0];
          if (!head) return "vendor";
          const scoped = segments[1];
          const pkg = head.charAt(0) === "@" && scoped ? `${head}/${scoped}` : head;

          if (pkg === "vue" || pkg.indexOf("@vue/") === 0) return "vue";
          // 路由与状态管理跟 vue 同生共死，合进同一 chunk，省一个请求
          if (pkg === "pinia" || pkg === "vue-router") return "vue";
          if (pkg.indexOf("element-plus") === 0 || pkg.indexOf("@element-plus") === 0)
            return "element-plus";
          if (pkg === "lodash-es" || pkg === "lodash") return "lodash";
          // 桌面端从本地文件加载，多请求的代价远大于单文件体积，其余依赖统一收进 vendor
          return "vendor";
        },
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
