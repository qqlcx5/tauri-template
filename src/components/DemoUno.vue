<script setup lang="ts">
// 类名写成静态字符串才能被 UnoCSS 静态提取；`i-tabler-${name}` 这类拼接会失效
const cases = [
  {
    name: "shortcuts",
    cls: "flex-center gap-2 px-4 py-2 rounded-lg bg-primary text-white",
    note: "flex-center 是 uno.config.ts 定义的 shortcut；primary 来自对齐 Element Plus 的 theme.colors",
  },
  {
    name: "变体分组",
    cls: "px-4 py-2 rounded-lg border border-[var(--el-border-color)] transition hover:(bg-primary text-white shadow-lg)",
    note: "transformerVariantGroup 把 hover:(a b c) 展开成 hover:a hover:b hover:c",
  },
  {
    name: "暗黑变体",
    cls: "px-4 py-2 rounded-lg bg-neutral-100 dark:(bg-neutral-800 text-white)",
    note: "presetWind4({ dark: 'class' })，跟随 <html class=\"dark\"> 与 Element Plus 同步",
  },
  {
    name: "任意值 + important",
    cls: "w-[220px] bg-[#ff6b9d]/20 px-4 py-2 rounded-lg font-bold !text-danger",
    note: "w-[220px]、bg-[#ff6b9d]/20 任意值；! 前缀给单条工具类加 important",
  },
];
</script>

<template>
  <section class="demo-card">
    <h2 class="demo-card__title">
      <span class="i-tabler-wand" />
      UnoCSS：原子类 / 变体分组 / 暗黑模式
    </h2>
    <p class="demo-card__hint">
      预设为 <code class="code-block">presetWind4</code>，reset 与 theme 变量对齐 Tailwind4。
      下面每个色块的类名就是它自己 —— 打开 DevTools 能看到一一对应的原子规则。
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="c in cases" :key="c.name" class="flex flex-col gap-2">
        <div :class="c.cls">{{ c.name }}</div>
        <code class="code-block">{{ c.cls }}</code>
        <span class="text-xs text-secondary">{{ c.note }}</span>
      </div>
    </div>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-sparkles" />
        presetAttributify：属性写法
      </span>
    </el-divider>

    <div flex="~ wrap" gap="3" class="items-center">
      <span class="i-tabler-heart" text="4xl danger" />
      <span class="i-tabler-star" text="3xl warning" />
      <span class="i-tabler-bolt" text="2xl success" />
      <code class="code-block">text="4xl danger"</code>
    </div>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-player-play" />
        内置动画
      </span>
    </el-divider>

    <div class="demo-row-4">
      <span class="i-tabler-loader-2 animate-spin text-2xl text-primary" />
      <span class="i-tabler-bell animate-bounce text-2xl text-info" />
      <span class="i-tabler-bolt animate-pulse text-2xl text-success" />
      <span class="i-tabler-mood-happy animate-ping text-2xl text-warning" />
    </div>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-palette" />
        @apply 与 theme()（写在 SCSS 里）
      </span>
    </el-divider>

    <p class="applied-demo">
      这段文字的样式来自 <code class="code-block">@apply</code> 和
      <code class="code-block">theme()</code>，定义在下方 style 块与 styles/demo.scss。
    </p>
  </section>
</template>

<style scoped lang="scss">
.applied-demo {
  // transformerDirectives 提供的指令，在 SCSS 里可直接复用原子类
  @apply rounded-lg px-4 py-3 text-sm;
  color: theme("colors.primary");
  background-color: var(--el-color-primary-light-9);

  &:hover {
    filter: brightness(0.98);
  }
}
</style>
