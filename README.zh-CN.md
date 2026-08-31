# Tauri 2 + Vue 3 桌面应用模板

[![Tauri](https://img.shields.io/badge/Tauri-2.x-ffc131?logo=tauri&logoColor=white)](https://tauri.app)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-Wind4-333?logo=unocss&logoColor=white)](https://unocss.dev)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.14-409eff?logo=element&logoColor=white)](https://element-plus.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

开箱即用的桌面端脚手架：**Tauri 2（Rust）** + **Vue 3（TypeScript）** + **Vite 6** + **UnoCSS（Tailwind4 预设）**
+ **Element Plus**。暗黑模式联动、产物分包、Windows 工具链坑位都已预先配置好。

[English version](./README.md)

## 这个模板解决了什么

大多数 Tauri 模板只做到"能跑起来"。这个模板把你会花一个周末才调通的坑提前填了：

| 常见痛点 | 本模板的做法 |
| --- | --- |
| Element Plus 暗黑模式与 UnoCSS `dark:` 变体各管各的 | 统一由 `<html class="dark">` 驱动，状态存 `localStorage`，刷新不闪回 |
| reset 排在 Element Plus 之后，把组件样式一起重置掉 | `reset: false` 关掉内置 reset，改由 `@unocss/reset/tailwind-compat.css` 最前引入 |
| UnoCSS 图标预设全盘扫描 `node_modules`，pnpm 下构建卡死 | 显式声明 `collections`（当前为 `tabler`） |
| `file://` 场景下单个巨大 JS 包 | `manualChunks()` 拆出 `vue` / `element-plus` / `lodash` / `vendor` |
| Sass legacy API 弃用告警 | 使用 `sass-embedded` + `api: "modern-compiler"` |
| 真机 / 局域网调试 HMR 连不上 | `TAURI_DEV_HOST` 自动配置 HMR host 与端口 |
| 国内 `cargo` 拉包极慢 | 镜像源配置见 [initialize.md](./initialize.md) |

## 技术栈

| 层 | 选型 | 版本 |
| --- | --- | --- |
| 运行时 / 外壳 | Tauri（Rust，edition 2021） | 2.x |
| UI 框架 | Vue 3（`<script setup>` + TS） | 3.5 |
| 语言 | TypeScript | 5.6 |
| 构建工具 | Vite | 6 |
| CSS 引擎 | UnoCSS（`presetWind4` + `presetIcons` + `presetAttributify`） | 66 |
| 组件库 | Element Plus | 2.14 |
| 图标 | Iconify / Tabler | — |
| 工具库 | lodash-es | 4 |
| 样式 | SCSS（sass-embedded 编译） | 1.103 |
| 包管理器 | pnpm（推荐） | 9+ |

## 快速开始

### 1. 环境准备

- **Node.js 20 LTS+**、**pnpm 9+**
- **Rust 1.77.2+**（[rustup](https://rustup.rs)，Tauri 2 的 MSRV，可用 `pnpm tauri info` 校验工具链）
- **平台构建工具**
  - Windows：Visual Studio 2022 生成工具，勾选【使用 C++ 的桌面开发】+ Windows 10/11 SDK
  - macOS：`xcode-select --install`
  - Linux：`webkit2gtk-4.1`、`libayatana-appindicator3`、`librsvg2`、`build-essential`、`pkg-config`

  完整图文步骤（含国内镜像）：[initialize.md](./initialize.md)。

### 2. 安装依赖

```bash
git clone https://github.com/qqlcx5/tauri-template.git
cd tauri-template
pnpm install
```

### 3. 启动

```bash
pnpm tauri dev   # 桌面窗口 + 热更新
pnpm dev         # 仅浏览器，http://localhost:1420
```

窗口弹出即代表 Rust 后端与前端已打通。

### 4. 改成你自己的项目

改名需要动 5 处（原名 `tauri-vue3-template`），**第 4 处漏掉会直接编译失败**：

1. `package.json` → `name`
2. `src-tauri/Cargo.toml` → `name` 与 `[lib].name`（`tauri_vue3_template_lib`，下划线，不能用连字符）
3. `src-tauri/tauri.conf.json` → `productName`、`identifier`（**必须全局唯一**，模板出厂值为 `com.example.tauri-vue3-template`）、窗口 `title`
4. `src-tauri/src/main.rs` → `tauri_vue3_template_lib::run()`，**必须与 `[lib].name` 完全一致**，编译器不会自动推断
5. `index.html` → `<title>`（只在开发/浏览器窗口可见，最容易忘）
6. `src-tauri/tauri.conf.json` → `bundle.publisher` / `bundle.copyright`（出厂为 `Your Name`，MSI / RPM / AppImage 需要）
7. `LICENSE` → 版权持有人那一行

`src-tauri/Cargo.lock` 会在下次 `cargo` 执行时自动更新；`src-tauri/gen/schemas/*` 是自动生成的权限 JSON Schema，两者都不包含应用名。

改完后删掉 `src/components/Demo*.vue` 与 `src/App.vue` 里的对应 import，再用 `pnpm build && pnpm tauri build` 验证。

## 命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 仅启动 Vite 开发服务器 |
| `pnpm build` | `vue-tsc --noEmit` 类型检查 + 打包到 `dist/` |
| `pnpm preview` | 预览构建产物 |
| `pnpm tauri dev` | 开发模式运行桌面应用 |
| `pnpm tauri build` | 产出安装包，位于 `src-tauri/target/release/bundle/` |
| `pnpm tauri info` | 输出环境诊断信息（提 issue 时请附上） |

## 目录结构

```
.
├── index.html
├── uno.config.ts          # 预设、主题色、shortcuts（已关闭内置 reset）
├── vite.config.ts         # Vue + UnoCSS + 分包 + Tauri 开发服务器配置
├── src/
│   ├── main.ts            # 引入顺序：reset → Element Plus → uno.css → 全局 scss
│   ├── App.vue            # 布局外壳、暗黑模式切换
│   ├── components/        # Demo*.vue，替换为你的业务组件
│   ├── styles/demo.scss   # 全局 SCSS（可直接写 @apply）
│   └── assets/
└── src-tauri/
    ├── Cargo.toml
    ├── tauri.conf.json    # productName、identifier、窗口、打包配置
    ├── capabilities/      # 权限集合（Tauri 2 默认最小权限）
    ├── icons/             # 图标资源
    └── src/
        ├── main.rs        # 二进制入口
        └── lib.rs         # run() 与 greet 命令示例
```

## 前端调用 Rust

`src-tauri/src/lib.rs` 已提供示例命令：

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

前端调用：

```ts
import { invoke } from "@tauri-apps/api/core";

const message = await invoke<string>("greet", { name: "World" });
```

新增能力需在 `src-tauri/capabilities/default.json` 里授权，Tauri 2 默认全部拒绝。

## 配置要点

- **暗黑模式**：`src/App.vue` 的 `applyDark()` 切换 `<html class="dark">`，同时驱动 Element Plus
  的 CSS 变量与 UnoCSS 的 `dark:` 变体，状态存在 `localStorage` 的 `demo:dark` 键。
- **主题色**：`uno.config.ts` 把 `primary` / `success` / `warning` / `danger` 对齐 Element Plus 调色板，
  保证 `text-danger` 这类原子类与组件视觉一致。
- **shortcuts**：`flex-center`、`flex-col-center`、`bg-page`、`text-regular`、`text-secondary`，
  全部绑定 Element Plus 的 CSS 变量。
- **动态类名**：运行时拼接出来的类名不会被引擎静态提取，需加进 `uno.config.ts` 的 `safelist`。
- **固定端口**：Vite 固定 `1420` 且 `strictPort: true`；watcher 忽略 `src-tauri`，避免前端保存触发 Rust 重编。

## 安全

- **CSP 已开启** —— `tauri.conf.json` 的 `app.security.csp`，对象形式。Tauri 在编译期为打包的
  script/style 注入 nonce 与 hash，因此 `script-src` 无需 `'unsafe-inline'`。
- **开发模式用独立策略** —— `app.security.devCsp` 刻意放宽，保证 Vite HMR（`ws://localhost:1421`）
  可用。未设置 `devCsp` 时，Tauri 会在开发模式下回退使用 `csp`，这正是 HMR 失效的原因，**不要删掉它**。
- **`connect-src` 只允许 IPC**（`ipc: http://ipc.localhost`）。若应用要请求外部 API，需自行加入
  对应来源，否则打包后 `fetch` 失败、但 `pnpm dev` 下正常，很难排查。
- **最小权限** —— `src-tauri/capabilities/default.json` 只授予 `core:default` 与 `opener:default`，
  Tauri 2 默认是全拒绝。
- **文件拖放由 Tauri 拦截**（`dragDropEnabled` 默认 `true`），页面拿不到拖入的本地文件路径。
  除非确需 HTML5 拖放，否则不要改成 `false`。

漏洞请私下报告，见 [SECURITY.md](./SECURITY.md)。

## 路线图

- [ ] 接入 Vue Router 与 Pinia
- [ ] 自动更新（updater 插件）示例
- [ ] 系统托盘与原生菜单示例
- [ ] 多窗口示例
- [ ] GitHub Actions 三平台发布工作流
- [ ] i18n（vue-i18n）预设

欢迎提 issue 和 PR。

## 许可

[MIT](./LICENSE)，个人与商业项目均可自由使用。

---

如果这个模板帮到了你，点个 **Star** 就是最好的支持，也能让更多人找到它。
