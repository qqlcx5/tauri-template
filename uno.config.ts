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
    // presetUno / presetWind → presetWind3 → presetWind4，后者的 reset 与 theme 变量
    // 对齐 Tailwind4，其余工具类写法与 presetWind3 完全兼容
    presetWind4({
      // 与 Element Plus 暗黑模式对齐：EP 靠 <html class="dark"> 切换（本就是默认值，显式写出防回归）
      dark: "class",
      preflights: {
        // 内置 Tailwind4 版 reset，不需要再装 @unocss/reset 或 normalize.css
        reset: true,
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

  // presetWind4 内置 reset 会把 button/input/select/textarea 的背景刷成 transparent，
  // 与 Element Plus 的按钮底色冲突。
  // 官方为此提供 @unocss/reset/tailwind-compat.css，这里用 preflights 内联等价补丁，
  // 省掉一个依赖包。
  // 注意：自定义 preflight 默认落在 order 0 层，排在 presetWind4 的 base 层（-100）之后，
  // 因此能覆盖掉上面的 reset。
  preflights: [
    {
      getCSS: () => `
button, [type='button'], [type='reset'], [type='submit'] {
  background-color: revert;
  background-image: none;
}
`,
    },
  ],

  // 运行时拼接出来的类名无法静态提取，放这里兜底
  // 例：safelist: ['text-danger', 'text-success', 'text-warning']
  safelist: [],
});
