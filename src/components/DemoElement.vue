<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { invoke } from "@tauri-apps/api/core";

// —— 表单 ——
const text = ref("");
const password = ref("");
const region = ref("tauri");
const count = ref(3);
const notify = ref(true);
const volume = ref(40);
const score = ref(4);
const date = ref("");
const stacked = ref(["atomic"]);

// —— 反馈 ——
const dialogVisible = ref(false);
const progress = ref(62);

function notifyMe() {
  ElNotification({
    title: "Element Plus",
    message: "ElNotification 与 UnoCSS 共用同一套主题变量",
    type: "success",
  });
}

// —— Tauri ——
const greetMsg = ref("");
const name = ref("World");

async function greet() {
  greetMsg.value = await invoke<string>("greet", { name: name.value });
}
</script>

<template>
  <section class="demo-card">
    <h2 class="demo-card__title">
      <span class="i-tabler-layout-grid" />
      Element Plus：全量引入
    </h2>
    <p class="demo-card__hint">
      样式加载顺序为 <code class="code-block">element-plus/dist/index.css</code> →
      <code class="code-block">dark/css-vars.css</code> →
      <code class="code-block">virtual:uno.css</code>，最后加载的 UnoCSS 才能覆盖组件默认样式。
    </p>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-click" />
        按钮
      </span>
    </el-divider>

    <div class="demo-row-2">
      <el-button type="primary">
        <span class="i-tabler-check mr-1" />
        Primary
      </el-button>
      <el-button type="success" plain>Success</el-button>
      <el-button type="warning" round>Warning</el-button>
      <el-button type="danger" text>Danger</el-button>
      <el-button type="info" size="small">Small</el-button>
      <el-button :loading="true">Loading</el-button>
      <el-button disabled>Disabled</el-button>
      <el-button type="primary" circle>
        <span class="i-tabler-plus" />
      </el-button>
    </div>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-forms" />
        表单
      </span>
    </el-divider>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <el-input v-model="text" clearable placeholder="普通输入">
        <template #prefix>
          <span class="i-tabler-user text-secondary" />
        </template>
      </el-input>

      <el-input
        v-model="password"
        type="password"
        show-password
        placeholder="密码框"
      />

      <el-select v-model="region" class="w-full">
        <el-option label="Tauri" value="tauri" />
        <el-option label="Vue" value="vue" />
        <el-option label="UnoCSS" value="unocss" />
      </el-select>

      <div class="demo-row-3">
        <span class="text-sm text-secondary">数量</span>
        <el-input-number v-model="count" :min="1" :max="10" size="small" />
        <span class="text-sm text-secondary">评分</span>
        <el-rate v-model="score" />
      </div>

      <div class="demo-row-3">
        <el-switch v-model="notify" active-text="通知" />
        <el-checkbox-group v-model="stacked">
          <el-checkbox value="atomic" label="atomic">UnoCSS</el-checkbox>
          <el-checkbox value="ep" label="ep">Element Plus</el-checkbox>
        </el-checkbox-group>
      </div>

      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        class="w-full"
      />
    </div>

    <div class="mt-4 demo-row-3">
      <span class="i-tabler-volume-2 text-secondary" />
      <el-slider v-model="volume" class="flex-1 min-w-40" />
      <el-tag type="primary" effect="dark">{{ volume }}%</el-tag>
    </div>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-bell" />
        反馈
      </span>
    </el-divider>

    <div class="demo-row-2">
      <el-tooltip content="Tooltip 也是 teleported 到 body 的" placement="top">
        <el-button>Tooltip</el-button>
      </el-tooltip>

      <el-popconfirm title="确定要执行吗？" @confirm="ElMessage.success('已确认')">
        <template #reference>
          <el-button type="warning" plain>Popconfirm</el-button>
        </template>
      </el-popconfirm>

      <el-button @click="ElMessage.info('ElMessage 提示')">Message</el-button>
      <el-button type="success" @click="notifyMe">Notification</el-button>

      <!-- 关键演示：Dialog 挂载在 body 下，原子类依然要生效 -->
      <el-button type="primary" @click="dialogVisible = true">
        <span class="i-tabler-arrows-maximize mr-1" />
        打开 Dialog
      </el-button>
    </div>

    <div class="mt-4 demo-row-3">
      <el-progress :percentage="progress" :stroke-width="14" class="flex-1" />
      <el-button size="small" @click="progress = (progress + 13) % 100">
        +13%
      </el-button>
    </div>

    <el-alert
      class="mt-4"
      type="info"
      show-icon
      :closable="false"
      title="为什么不能用 important: '#app'"
      description="UnoCSS 支持把 important 设为 '#app' 来提升特异性。但 Dialog / Select 下拉 / Tooltip 等组件是 teleported 挂载到 body 下的，一旦加了 #app 前缀，这些弹层里的原子类会全部失效。本项目改用「加载顺序」解决优先级。"
    />

    <el-dialog v-model="dialogVisible" title="Teleported 弹层" width="440px">
      <div class="flex-col-center gap-3 py-2">
        <span class="i-tabler-arrows-maximize text-4xl text-primary" />
        <p class="text-center text-sm text-secondary">
          这个 DOM 被挂载到 body 下（不在 #app 内）。<br />
          下面这块的圆角与背景全部来自 UnoCSS 原子类。
        </p>
        <div class="rounded-lg bg-primary px-4 py-2 text-white">
          原子类在 teleported 元素里正常生效
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogVisible = false">好的</el-button>
      </template>
    </el-dialog>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-brand-rust" />
        Rust 命令调用
      </span>
    </el-divider>

    <div class="demo-row-2">
      <el-input v-model="name" class="max-w-60" placeholder="输入名字" />
      <el-button type="primary" @click="greet">
        <span class="i-tabler-send mr-1" />
        Greet
      </el-button>
    </div>
    <p v-if="greetMsg" class="mt-3 text-sm text-primary">{{ greetMsg }}</p>
    <p v-else class="mt-3 text-xs text-secondary">
      在 <code class="code-block">pnpm tauri dev</code> 里点击才拿得到结果；
      纯浏览器环境调用会报错（Rust 后端不存在）。
    </p>
  </section>
</template>
