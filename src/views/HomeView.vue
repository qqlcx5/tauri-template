<script setup lang="ts">
import DemoUno from "../components/DemoUno.vue";
import DemoIcons from "../components/DemoIcons.vue";
import DemoElement from "../components/DemoElement.vue";
import DemoLodash from "../components/DemoLodash.vue";
</script>

<template>
  <div class="flex flex-col gap-4">
    <DemoUno />
    <DemoIcons />
    <DemoElement />
    <DemoLodash />

    <footer class="py-6 text-center text-xs text-secondary">
      所有样式由 UnoCSS 按需生成 —— 未使用的类名不会进入产物
    </footer>
  </div>
</template>
