<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="demo-card flex-col-center gap-3 py-10">
    <span class="i-tabler-error-404 text-5xl text-warning" />
    <h2 class="demo-card__title">页面不存在</h2>
    <p class="demo-card__hint">
      没有匹配到路由
      <code class="code-block">{{ route.fullPath }}</code>
    </p>
    <RouterLink
      to="/"
      class="rounded px-3 py-1.5 text-sm text-secondary no-underline transition-colors hover:bg-[var(--el-fill-color-light)]"
    >
      返回首页
    </RouterLink>
  </div>
</template>
