import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    // reset 与 theme 变量对齐 Tailwind4
    presetWind4({
      // 与 Element Plus 暗黑模式对齐：EP 靠 <html class="dark"> 切换（本就是默认值，显式写出防回归）
      dark: "class",
      preflights: {
        // 内置 reset 随原子类一起排在 Element Plus 之后，会盖掉组件库样式。
        // 改由 main.ts 最先引入 @unocss/reset/tailwind-compat.css。
        // （关掉它不影响 font-mono 一类原子类，它们在规则内部自行注册 theme 变量。）
        reset: false,
        // theme 变量按需生成（默认值）：只输出真正用到的 --colors-* / --spacing 等 CSS 变量
        theme: "on-demand",
      },
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      // 图标名写错时只在构建日志里出现一行 warn，页面直接空白，务必开着
      warn: true,
      // 让图标默认内联对齐，避免作为行内元素时基线错位
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      // 显式声明集合：不写的话预设会在 node 端全盘扫描 node_modules 找 @iconify-json/*，
      // pnpm 大依赖树下会明显拖慢（甚至卡住）构建
      collections: {
        tabler: () =>
          import("@iconify-json/tabler/icons.json").then((m) => m.default),
      },
    }),
  ],

  transformers: [
    // 支持在 <style lang="scss"> 里写 @apply / --uno: / theme() / icon()
    transformerDirectives(),
    // 支持变体分组：hover:(bg-red text-white)
    transformerVariantGroup(),
  ],

  theme: {
    colors: {
      // 与 Element Plus 默认调色板对齐，方便 text-primary / bg-danger-light-9 这类写法
      primary: "#409eff",
      success: "#67c23a",
      warning: "#e6a23c",
      danger: "#f56c6c",
      error: "#f56c6c",
      info: "#909399",
    },
  },

  shortcuts: {
    // 布局
    "flex-center": "flex items-center justify-center",
    "flex-col-center": "flex flex-col items-center justify-center",
    // 与 Element Plus 变量联动的表层色
    "bg-page": "bg-[var(--el-bg-color-page)]",
    "text-regular": "text-[var(--el-text-color-regular)]",
    "text-secondary": "text-[var(--el-text-color-secondary)]",
  },

  // 默认只扫 vue/svelte/jsx/html 等；js/ts 里拼接的类名要显式纳入
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|vine\.ts|mdx?|astro|elm|php|phtml|marko|html)($|\?)/,
        "src/**/*.{js,ts}",
      ],
    },
  },

  // 运行时拼接出来的类名无法静态提取，放这里兜底
  // 例：safelist: ['text-danger', 'text-success', 'text-warning']
  safelist: [],
});
