<script setup lang="ts">
// ElMessage 无需 import：unplugin-auto-import 会自动注入组件与样式
import { computed, onBeforeUnmount, ref, watch } from "vue";
import {
  camelCase,
  chunk,
  cloneDeep,
  debounce,
  groupBy,
  meanBy,
  orderBy,
  shuffle,
  sumBy,
  throttle,
  uniq,
} from "lodash-es";

type TaskStatus = "todo" | "doing" | "done";

interface Task {
  id: number;
  title: string;
  owner: string;
  status: TaskStatus;
  hours: number;
}

// 深拷贝一份作为「初始快照」，后面 reset 时用它还原
const initialTasks: Task[] = [
  { id: 1, title: "接入 UnoCSS 预设", owner: "Ada", status: "done", hours: 4 },
  { id: 2, title: "拆分 vite chunk", owner: "Linus", status: "done", hours: 6 },
  { id: 3, title: "补齐图标集合", owner: "Grace", status: "doing", hours: 3 },
  { id: 4, title: "暗黑模式联调", owner: "Ada", status: "doing", hours: 5 },
  { id: 5, title: "表格分页交互", owner: "Ken", status: "todo", hours: 8 },
  { id: 6, title: "Tauri 打包配置", owner: "Linus", status: "todo", hours: 5 },
  { id: 7, title: "SCSS 变量收敛", owner: "Grace", status: "todo", hours: 2 },
  { id: 8, title: "首屏体积优化", owner: "Ken", status: "doing", hours: 7 },
];

const statusLabel: Record<TaskStatus, string> = {
  todo: "待办",
  doing: "进行中",
  done: "已完成",
};
const statusType: Record<TaskStatus, "info" | "primary" | "success"> = {
  todo: "info",
  doing: "primary",
  done: "success",
};

const tasks = ref<Task[]>(cloneDeep(initialTasks));

// —— debounce：输入停止 400ms 后才真正触发过滤 ——
const keyword = ref("");
const appliedKeyword = ref("");
const onSearch = debounce((v: string) => {
  appliedKeyword.value = v;
}, 400);

// —— throttle：1 秒内最多生效一次 ——
const clicked = ref(0);
const throttledCount = ref(0);
const onThrottleClick = throttle(
  () => {
    throttledCount.value += 1;
  },
  1000,
  { leading: true, trailing: false },
);
function handleClick() {
  clicked.value += 1;
  onThrottleClick();
}

// debounce / throttle 内部持有定时器，组件卸载时务必取消，否则会对已销毁组件赋值
onBeforeUnmount(() => {
  onSearch.cancel();
  onThrottleClick.cancel();
});

const filtered = computed(() => {
  const kw = appliedKeyword.value.trim().toLowerCase();
  if (!kw) return tasks.value;
  return tasks.value.filter(
    (t) =>
      t.title.toLowerCase().includes(kw) || t.owner.toLowerCase().includes(kw),
  );
});

// —— orderBy：多字段排序交给 lodash，而非组件自带排序 ——
const sortKey = ref<"hours" | "title" | "owner">("hours");
const sortOrder = ref<"asc" | "desc">("desc");
const sorted = computed(() =>
  orderBy(filtered.value, [sortKey.value], [sortOrder.value]),
);

// —— chunk：切页 ——
const pageSize = 5;
const page = ref(1);
const pages = computed(() => chunk(sorted.value, pageSize));
const currentRows = computed(() => pages.value[page.value - 1] ?? []);
watch(appliedKeyword, () => {
  page.value = 1;
});

// —— 聚合统计 ——
const byStatus = computed(() => groupBy(tasks.value, "status"));
const totalHours = computed(() => sumBy(tasks.value, "hours"));
const avgHours = computed(
  () => Math.round(meanBy(tasks.value, "hours") * 10) / 10,
);
const owners = computed(() => uniq(tasks.value.map((t) => t.owner)));
const slug = computed(() => camelCase(keyword.value));

function reset() {
  tasks.value = cloneDeep(initialTasks);
  ElMessage.success("cloneDeep 已还原初始数据");
}
</script>

<template>
  <section class="demo-card">
    <h2 class="demo-card__title">
      <span class="i-tabler-brand-npm" />
      lodash-es：防抖 / 节流 / 聚合
    </h2>
    <p class="demo-card__hint">
      按需从 <code class="code-block">lodash-es</code> 具名导入，Rollup 会 tree-shake，
      产物里只留下用到的函数（见 vite.config.ts 拆出的 lodash chunk）。
    </p>

    <div class="demo-row-2">
      <el-input
        :model-value="keyword"
        clearable
        placeholder="搜索任务 / 负责人（debounce 400ms）"
        class="max-w-72"
        @input="onSearch($event)"
        @clear="onSearch('')"
      />
      <el-radio-group v-model="sortKey" size="small">
        <el-radio-button value="hours">按工时</el-radio-button>
        <el-radio-button value="title">按标题</el-radio-button>
        <el-radio-button value="owner">按负责人</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="sortOrder" size="small">
        <el-radio-button value="desc">降序</el-radio-button>
        <el-radio-button value="asc">升序</el-radio-button>
      </el-radio-group>
      <el-button size="small" @click="tasks = shuffle(tasks)">
        <span class="i-tabler-arrows-shuffle mr-1" />
        shuffle
      </el-button>
      <el-button size="small" type="primary" plain @click="reset">
        <span class="i-tabler-restore mr-1" />
        reset
      </el-button>
    </div>

    <p class="mt-2 text-xs text-secondary">
      orderBy(sortKey={{ sortKey }}, order={{ sortOrder }}) · 命中
      {{ sorted.length }} 条 · camelCase(关键词) = <b>{{ slug || "-" }}</b>
    </p>

    <el-table :data="currentRows" size="small" stripe border class="mt-3 w-full">
      <el-table-column prop="title" label="任务" min-width="180" />
      <el-table-column prop="owner" label="负责人" width="110" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType[row.status as TaskStatus]" size="small">
            {{ statusLabel[row.status as TaskStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="hours" label="工时" width="90" />
      <el-table-column label="操作" width="90">
        <template #default="{ row }">
          <el-button
            size="small"
            type="danger"
            text
            @click="tasks = tasks.filter((t) => t.id !== row.id)"
          >
            <span class="i-tabler-trash" />
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有匹配的任务" :image-size="60" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="sorted.length"
      layout="prev, pager, next"
      size="small"
      class="mt-3 justify-center"
    />

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-chart-bar" />
        groupBy / sumBy / meanBy / uniq
      </span>
    </el-divider>

    <div class="demo-row-2">
      <el-tag
        v-for="(list, status) in byStatus"
        :key="status"
        :type="statusType[status as TaskStatus]"
        effect="light"
      >
        {{ statusLabel[status as TaskStatus] }} · {{ list.length }}
      </el-tag>
      <el-tag type="warning" effect="plain">总工时 {{ totalHours }}h</el-tag>
      <el-tag type="warning" effect="plain">平均 {{ avgHours }}h</el-tag>
      <el-tag type="success" effect="plain">
        成员 {{ owners.join(" / ") }}
      </el-tag>
    </div>

    <el-divider content-position="left">
      <span class="demo-row-1 text-xs text-secondary">
        <span class="i-tabler-hand-stop" />
        throttle
      </span>
    </el-divider>

    <div class="demo-row-3">
      <el-button type="primary" @click="handleClick">快速连点我</el-button>
      <span class="text-sm">
        实际点击 <b class="text-primary">{{ clicked }}</b> 次，1 秒节流后只生效
        <b class="text-danger">{{ throttledCount }}</b> 次
      </span>
    </div>
  </section>
</template>
