<script setup lang="ts">
import { computed, ref } from "vue";

interface IconItem {
  // 图标名与完整类名分开存：
  // 1. 类名必须是静态字符串才能被提取，运行时拼接的 `i-tabler-${name}` 一律失效；
  // 2. 图标名单独存一份，就不必在模板里对前缀做 slice —— 一旦出现前缀字面量，
  //    提取器会把它当类名，构建时发出 failed to load icon 告警。
  name: string;
  cls: string;
}

const icons: IconItem[] = [
  { name: "rocket", cls: "i-tabler-rocket" },
  { name: "home", cls: "i-tabler-home" },
  { name: "user", cls: "i-tabler-user" },
  { name: "settings", cls: "i-tabler-settings" },
  { name: "bell", cls: "i-tabler-bell" },
  { name: "heart", cls: "i-tabler-heart" },
  { name: "star", cls: "i-tabler-star" },
  { name: "search", cls: "i-tabler-search" },
  { name: "edit", cls: "i-tabler-edit" },
  { name: "trash", cls: "i-tabler-trash" },
  { name: "check", cls: "i-tabler-check" },
  { name: "x", cls: "i-tabler-x" },
  { name: "database", cls: "i-tabler-database" },
  { name: "chart-bar", cls: "i-tabler-chart-bar" },
  { name: "code", cls: "i-tabler-code" },
  { name: "terminal-2", cls: "i-tabler-terminal-2" },
  { name: "layout-grid", cls: "i-tabler-layout-grid" },
  { name: "shield", cls: "i-tabler-shield" },
  { name: "brand-github", cls: "i-tabler-brand-github" },
  { name: "brand-vue", cls: "i-tabler-brand-vue" },
];

const query = ref("");

const matched = computed(() =>
  query.value
    ? icons.filter((i) => i.name.includes(query.value.toLowerCase()))
    : icons,
);
</script>

<template>
  <section class="demo-card">
    <h2 class="demo-card__title">
      <span class="i-tabler-category" />
      presetIcons + @iconify-json/tabler
    </h2>
    <p class="demo-card__hint">
      图标以纯 CSS 渲染（mask + currentColor），所以颜色跟着
      <code class="code-block">text-*</code> 走、大小跟着
      <code class="code-block">text-*</code> 的 em 走。集合在 uno.config.ts 里用
      <code class="code-block">collections</code> 显式声明。
    </p>

    <el-input
      v-model="query"
      clearable
      placeholder="过滤图标名，如 brand / chart"
      class="mb-4 max-w-80"
    >
      <template #prefix>
        <span class="i-tabler-search text-secondary" />
      </template>
    </el-input>

    <div class="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-10">
      <el-tooltip
        v-for="icon in matched"
        :key="icon.name"
        :content="icon.cls"
        placement="top"
      >
        <div
          class="flex-col-center h-14 rounded-lg border border-[var(--el-border-color)] transition hover:(border-primary bg-primary/10)"
        >
          <span :class="icon.cls" class="text-2xl text-regular" />
          <span class="mt-1 text-[10px] text-secondary">{{ icon.name }}</span>
        </div>
      </el-tooltip>
    </div>

    <p v-if="!matched.length" class="mt-4 text-sm text-secondary">
      没有匹配的图标。
    </p>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-palette" />
        尺寸与配色
      </span>
    </el-divider>

    <div class="demo-row-4">
      <span class="i-tabler-rocket text-lg" />
      <span class="i-tabler-rocket text-2xl" />
      <span class="i-tabler-rocket text-4xl" />
      <span class="i-tabler-rocket text-4xl text-primary" />
      <span class="i-tabler-rocket text-4xl text-success" />
      <span class="i-tabler-rocket text-4xl text-warning" />
      <span class="i-tabler-rocket text-4xl text-danger" />
    </div>

    <p class="mt-4 text-xs text-secondary">
      提示：tabler 是单色图标集，全部走 mask 模式，因此都能被
      <code class="code-block">text-*</code> 着色。彩色图标集（如 logos）默认走 bg
      模式保留原色，可加
      <code class="code-block">?mask</code> 后缀强制转为蒙版、加
      <code class="code-block">?bg</code> 强制转为背景图。
    </p>
  </section>
</template>
