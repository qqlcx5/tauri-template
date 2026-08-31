# Tauri 2 + Vue 3 Starter Template

[![Tauri](https://img.shields.io/badge/Tauri-2.x-ffc131?logo=tauri&logoColor=white)](https://tauri.app)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-Wind4-333?logo=unocss&logoColor=white)](https://unocss.dev)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.14-409eff?logo=element&logoColor=white)](https://element-plus.org)
[![Pinia](https://img.shields.io/badge/Pinia-4-ffd859?logo=pinia&logoColor=black)](https://pinia.vuejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A batteries-included **desktop app template**: **Tauri 2 (Rust)** + **Vue 3 (TypeScript)** + **Vite 6**
+ **UnoCSS (Tailwind 4 preset)** + **Element Plus** + **Vue Router** + **Pinia**, with dark mode,
code-splitting, CSP hardening and the Windows toolchain issues already solved.

> Looking for the Chinese version? See [README.zh-CN.md](./README.zh-CN.md).

**Keywords:** `tauri template` · `tauri 2 vue 3` · `tauri vite starter` · `vue 3 desktop app` ·
`electron alternative` · `rust vue desktop` · `unocss element plus` · `vue router pinia tauri` ·
`tauri windows setup` · `cross-platform desktop app template`

---

## Why this template

Most Tauri starters stop at "it compiles". This one ships the config you would otherwise spend a
weekend debugging:

| Pain point | Solved here |
| --- | --- |
| Element Plus dark mode and UnoCSS `dark:` variants fighting each other | Both driven by one `<html class="dark">` toggle, held in a Pinia store and persisted to `localStorage` |
| UnoCSS reset loaded after Element Plus wipes component styles | Built-in `preflight` reset disabled (`reset: false`); a local `src/styles/reset.css` is imported first, with the `button { background-color: transparent }` rule deliberately commented out |
| Vue Router `createWebHistory` white-screens after packaging | `createWebHashHistory()` — no server exists behind Tauri's custom protocol to fall back to `index.html` |
| UnoCSS icon preset scans all of `node_modules` and hangs under pnpm | Icon collections declared explicitly (`tabler`) |
| One giant JS bundle loaded from `file://` | `manualChunks()` splits `vue` / `element-plus` / `lodash` / `vendor`, plus per-route lazy chunks |
| Sass legacy API deprecation warnings | `sass-embedded` + `api: "modern-compiler"` |
| Vite dev server breaks on LAN / physical device | `TAURI_DEV_HOST` wires up HMR host and port |
| `cargo` crawling in China | Mirror-source instructions in [Windows setup](./initialize.md) |

## Screenshots

<!-- Drop a PNG at docs/screenshot.png and uncomment:
![App screenshot](./docs/screenshot.png)
-->

Run `pnpm tauri dev`. Two routes are wired up: **Home** (four built-in demos — UnoCSS utilities ·
Iconify icons · Element Plus components · lodash-es helpers) and **Settings** (Pinia state that
survives navigation). A light/dark toggle sits in the header.

## Tech stack

| Layer | Choice | Version |
| --- | --- | --- |
| Runtime / shell | [Tauri](https://tauri.app) | 2.x (Rust, edition 2021) |
| UI framework | [Vue 3](https://vuejs.org) (`<script setup>` + TS) | 3.5 |
| Routing | [Vue Router](https://router.vuejs.org) (hash mode, lazy-loaded) | 5 |
| State | [Pinia](https://pinia.vuejs.org) (setup-store style) | 4 |
| Language | [TypeScript](https://www.typescriptlang.org) | 5.6 |
| Build tool | [Vite](https://vite.dev) | 6 |
| CSS engine | [UnoCSS](https://unocss.dev) (`presetWind4` + `presetIcons` + `presetAttributify`) | 66 |
| Component library | [Element Plus](https://element-plus.org) | 2.14 |
| Icons | [Iconify / Tabler](https://icon-sets.iconify.design/tabler/) | — |
| Utilities | [lodash-es](https://lodash.com) | 4 |
| Styles | SCSS via [sass-embedded](https://sass-lang.com) | 1.103 |
| Package manager | [pnpm](https://pnpm.io) | recommended |

## Quick start

### 1. Prerequisites

- **Node.js 20 LTS+** and **pnpm 9+**
- **Rust 1.77.2+** ([rustup](https://rustup.rs)) — Tauri 2's MSRV; verify your toolchain with `pnpm tauri info`
- **Platform build tools**
  - Windows: *Build Tools for Visual Studio 2022* with **Desktop development with C++** + Windows 10/11 SDK
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Linux: `webkit2gtk-4.1`, `libayatana-appindicator3`, `librsvg2`, `build-essential`, `pkg-config`

  Full step-by-step (including China cargo mirrors): [initialize.md](./initialize.md).

### 2. Create your project

```bash
# Option A — use as a GitHub template (click "Use this template" on the repo page), then:
git clone https://github.com/<your-name>/<your-app>.git
cd <your-app>
pnpm install

# Option B — clone this repo directly
git clone https://github.com/qqlcx5/tauri-template.git
cd tauri-template
pnpm install
```

### 3. Run

```bash
pnpm tauri dev      # desktop app with hot reload
pnpm dev            # browser only (http://localhost:1420)
```

A window titled `tauri-vue3-template` opens. Edit `src/App.vue` and it hot-reloads.

### 4. Rename it to your app

Five places hold the name `tauri-vue3-template` — missing **#4 is the #1 cause of "cannot find crate" build errors**:

1. `package.json` → `name`
2. `src-tauri/Cargo.toml` → `name` **and** `[lib].name` (`tauri_vue3_template_lib`, underscores, no dashes)
3. `src-tauri/tauri.conf.json` → `productName`, `identifier` (**must be globally unique** — the template ships `com.example.tauri-vue3-template`), window `title`
4. `src-tauri/src/main.rs` → `tauri_vue3_template_lib::run()` — **must match `[lib].name` exactly**, the compiler will not infer it
5. `index.html` → `<title>` (visible only in the dev/browser window, easy to forget)
6. `src-tauri/tauri.conf.json` → `bundle.publisher` / `bundle.copyright` (both ship as `Your Name`; required for MSI / RPM / AppImage)
7. `LICENSE` → copyright holder line

`src-tauri/Cargo.lock` updates itself on the next `cargo` run, and `src-tauri/gen/schemas/*` is generated capability JSON Schema — neither contains your app name.

Then delete the demo components (`src/components/Demo*.vue`) and their imports in `src/App.vue`, and verify with `pnpm build && pnpm tauri build`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server only |
| `pnpm build` | Type-check (`vue-tsc --noEmit`) + production bundle to `dist/` |
| `pnpm preview` | Preview the built frontend |
| `pnpm tauri dev` | Run the desktop app in dev mode |
| `pnpm tauri build` | Produce installers in `src-tauri/target/release/bundle/` |
| `pnpm tauri info` | Print environment diagnostics (paste this into issues) |

## Project structure

```
.
├── index.html
├── uno.config.ts          # presets, theme colors, shortcuts (built-in reset off)
├── vite.config.ts         # Vue + UnoCSS + manualChunks + Tauri dev server
├── src/
│   ├── main.ts            # app bootstrap: createPinia → ElementPlus → router
│   ├── App.vue            # layout shell, nav links, dark-mode toggle
│   ├── router/index.ts    # routes, hash history, lazy imports
│   ├── stores/theme.ts    # Pinia setup store (dark mode + persistence)
│   ├── views/             # HomeView / SettingsView / NotFoundView
│   ├── components/        # Demo*.vue — replace these
│   ├── styles/
│   │   ├── reset.css      # browser reset, loaded before Element Plus
│   │   └── demo.scss      # global SCSS (@apply works here)
│   └── assets/
└── src-tauri/
    ├── Cargo.toml
    ├── tauri.conf.json    # productName, identifier, window, bundle, CSP
    ├── capabilities/      # permission sets (least-privilege)
    ├── icons/             # generated from a single source PNG
    └── src/
        ├── main.rs        # binary entry
        └── lib.rs         # `run()` + `greet` command example
```

## Routing & state management

### Routing — hash mode is not optional

```ts
// src/router/index.ts
history: createWebHashHistory(),
routes: [
  { path: "/",         name: "home",      component: () => import("../views/HomeView.vue") },
  { path: "/settings", name: "settings",  component: () => import("../views/SettingsView.vue") },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../views/NotFoundView.vue") },
],
```

**Do not switch to `createWebHistory()`.** In a packaged app the frontend is served by Tauri's custom
protocol (`tauri://localhost` / `http://tauri.localhost`) with no server behind it, so there is
nothing to rewrite `/settings` back to `index.html` — you get a white screen on navigation or refresh.
Hash mode keeps every request pointed at `index.html`.

Routes use dynamic `import()`, so each view becomes its own chunk.

### State — Pinia setup store

```ts
// src/stores/theme.ts
export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(localStorage.getItem(STORAGE_KEY) === "1");
  function toggle() { isDark.value = !isDark.value; }
  watch(isDark, (dark) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "1" : "0");
  });
  return { isDark, toggle };
});
```

Read state with `storeToRefs()` so reactivity survives destructuring; call actions straight off the
store instance:

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeStore } from "../stores/theme";

const theme = useThemeStore();
const { isDark } = storeToRefs(theme);
</script>
```

Registration order in `src/main.ts` matters — **Pinia before router**, so route guards can use stores,
and **router before `mount`**, so the first render matches a route:

```ts
createApp(App).use(createPinia()).use(ElementPlus).use(router).mount("#app");
```

> `localStorage` works, but it is per-WebView and easy to lose. For real persistence swap the two
> storage lines in `src/stores/theme.ts` for `tauri-plugin-store` — no other file changes.

## Element Plus on-demand import

Element Plus is imported on demand via `unplugin-vue-components` + `unplugin-auto-import`
(the official "Auto Import" approach from the [Quick Start guide](https://element-plus.org/en-US/guide/quickstart.html)).
There is **no** `import "element-plus/dist/index.css"` and **no** `app.use(ElementPlus)`.

### Both plugins are required

| Plugin | Covers |
| --- | --- |
| `Components` | `<el-xxx>` tags in templates — injects the component import + its stylesheet |
| `AutoImport` | function calls in `<script setup>` such as `ElMessage` / `ElNotification` |

Drop `AutoImport` and message toasts lose their styles — they never appear in a template, so
`Components` cannot see them and nothing injects `el-message` CSS.

### Global config needs `el-config-provider`

`app.use(ElementPlus, { size, zIndex })` no longer exists. Wrap the root component instead:

```vue
<el-config-provider :size="'small'" :z-index="3000">
  <RouterView />
</el-config-provider>
```

### Remove `element-plus/global` from tsconfig

`tsconfig.json` must **not** list `element-plus/global` in `compilerOptions.types`. It registers
*every* component as a global type, so TypeScript stays silent even when a component was never
imported — exactly the failure mode on-demand import is supposed to catch. The generated
`src/components.d.ts` declares only the components you actually use.

### Do not call `ElMessage` from the template

`AutoImport` exposes `ElMessage` as a **global const**, which resolves in `<script setup>` but
**not** in template expressions:

```vue
<!-- ✗ TS2339: Property 'ElMessage' does not exist -->
<el-button @click="ElMessage.info('hi')">Message</el-button>
```

```ts
// ✓ bind an event, call it in script
function showMessage() { ElMessage.info("hi"); }
```

### Stylesheet order still matters

On-demand styles are injected where the component modules sit in the import graph, so
`./App.vue` and `./router` are imported **before** `virtual:uno.css` in `src/main.ts`. Otherwise
Element Plus CSS lands after the utilities and overrides them at equal specificity
(e.g. an `<el-tag class="hidden">` would become visible again).

### Measured effect

| Asset | Before | After |
| --- | --- | --- |
| `style.css` | 401.03 kB | **208.06 kB** (−48%) |
| `element-plus.js` | 769.51 kB | 767.69 kB |

Tree-shaking is confirmed: probing the chunk for components that are never used
(`ElColorPicker`, `ElUpload`, `ElTree`, `ElCarousel`, `ElCascader`, `ElTransfer`, `ElTimeline`,
`ElCalendar`, `ElBacktop`, `ElDrawer`) returns **0 matches** for all ten.

The JS barely shrinks *in this demo* because it deliberately exercises 18 of the 22 components in
use — including heavy ones like `ElTable`, `ElDatePicker` and `ElSelect`. A real app using a
handful of components will see the JS drop far more.

### A note on pnpm + dayjs

The Element Plus docs warn that `dayjs` (a CJS package used internally by `ElDatePicker`) needs
pnpm dependency hoisting, or `pnpm add dayjs`. **Verified as unnecessary here**: on Vite 6 +
pnpm 12, `dayjs` is inlined into the `element-plus_es.js` pre-bundle (212 matches) with zero
`require(` left in the output, and the production build has zero `module.exports` occurrences.
If you hit a `dayjs`-related error on a different toolchain, prefer `pnpm add dayjs` over
`shamefullyHoist` — the latter flattens `node_modules` and throws away pnpm's isolation entirely.

## Calling Rust from Vue

`src-tauri/src/lib.rs` already exposes a command:

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

Call it from the frontend:

```ts
import { invoke } from "@tauri-apps/api/core";

const message = await invoke<string>("greet", { name: "World" });
```

Add new permissions in `src-tauri/capabilities/default.json` — Tauri 2 is deny-by-default.

## Configuration notes

- **Dark mode**: `useThemeStore()` in `src/stores/theme.ts` toggles `<html class="dark">`, which drives
  both Element Plus CSS vars and UnoCSS `dark:` variants. State persists in `localStorage` under
  `demo:dark`. The store applies the saved value once at creation (a plain `watch` is not immediate,
  so the first frame would flash the wrong theme).
- **Theme colors**: `uno.config.ts` maps `primary` / `success` / `warning` / `danger` to the Element
  Plus palette, so `text-danger` and EP components stay visually consistent.
- **Shortcuts**: `flex-center`, `flex-col-center`, `bg-page`, `text-regular`, `text-secondary` — all
  bound to Element Plus CSS variables.
- **Dynamic class names**: add runtime-built utilities to `safelist` in `uno.config.ts`, otherwise
  they are never generated.
- **Fixed port**: Vite is pinned to `1420` with `strictPort: true`; `src-tauri` is excluded from the
  watcher so Rust rebuilds are not triggered by frontend saves.

## Security

- **CSP is on** — `app.security.csp` in `tauri.conf.json`, object form. Tauri injects nonces and
  hashes for bundled scripts/styles at compile time, so `script-src` needs no `'unsafe-inline'`.
- **Dev uses its own policy** — `app.security.devCsp` is deliberately looser so Vite HMR
  (`ws://localhost:1421`) keeps working. Tauri falls back to `csp` in dev when `devCsp` is unset,
  which is exactly what breaks HMR — do not delete `devCsp`.
- **`connect-src` is IPC-only** (`ipc: http://ipc.localhost`). If your app calls an external API, add
  its origin, or `fetch` will fail in the packaged app while working fine in `pnpm dev`.
- **Least-privilege permissions** — `src-tauri/capabilities/default.json` grants `core:default` +
  `opener:default` only. Tauri 2 is deny-by-default.
- **File drops are intercepted by Tauri** (`dragDropEnabled` defaults to `true`), so page content
  cannot read dropped local file paths. Leave it alone unless you need HTML5 drag & drop.

See [SECURITY.md](./SECURITY.md) for reporting vulnerabilities privately.

## Roadmap

- [x] Router (Vue Router 5, hash mode) + state management (Pinia 4) presets
- [ ] `tauri-plugin-store` persistence example
- [ ] `tauri-plugin-log` + `single-instance` wiring
- [ ] Auto-update / updater plugin example
- [ ] System tray & native menu example
- [ ] Multi-window example
- [ ] GitHub Actions cross-platform release workflow
- [ ] i18n (vue-i18n) preset

Ideas and PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

1. Fork → branch (`feat/xxx`, `fix/xxx`)
2. `pnpm install && pnpm tauri dev` — make sure it runs
3. `pnpm build` — must pass `vue-tsc` type-check
4. Commit with [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:`)
5. Open a PR describing the problem and the fix

## License

[MIT](./LICENSE) — free to use for personal and commercial projects.

---

If this template saved you time, a **star** is the cheapest way to say thanks and it helps others
find the repo.
