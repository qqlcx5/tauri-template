# Tauri 2 + Vue 3 Starter Template

[![Tauri](https://img.shields.io/badge/Tauri-2.x-ffc131?logo=tauri&logoColor=white)](https://tauri.app)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-Wind4-333?logo=unocss&logoColor=white)](https://unocss.dev)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.14-409eff?logo=element&logoColor=white)](https://element-plus.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A batteries-included **desktop app template**: **Tauri 2 (Rust)** + **Vue 3 (TypeScript)** + **Vite 6**
+ **UnoCSS (Tailwind 4 preset)** + **Element Plus**, with dark mode, code-splitting and Windows
toolchain issues already solved.

> Looking for the Chinese version? See [README.zh-CN.md](./README.zh-CN.md).

**Keywords:** `tauri template` · `tauri 2 vue 3` · `tauri vite starter` · `vue 3 desktop app` ·
`electron alternative` · `rust vue desktop` · `unocss element plus` · `tauri windows setup` ·
`cross-platform desktop app template`

---

## Why this template

Most Tauri starters stop at "it compiles". This one ships the config you would otherwise spend a
weekend debugging:

| Pain point | Solved here |
| --- | --- |
| Element Plus dark mode and UnoCSS `dark:` variants fighting each other | Both driven by one `<html class="dark">` toggle, persisted to `localStorage` |
| UnoCSS `presetWind4` reset wipes Element Plus button backgrounds | Inlined `preflights` patch (no extra `@unocss/reset` dependency) |
| UnoCSS icon preset scans all of `node_modules` and hangs under pnpm | Icon collections declared explicitly (`tabler`) |
| One giant JS bundle loaded from `file://` | `manualChunks()` splits `vue` / `element-plus` / `lodash` / `vendor` |
| Sass legacy API deprecation warnings | `sass-embedded` + `api: "modern-compiler"` |
| Vite dev server breaks on LAN / physical device | `TAURI_DEV_HOST` wires up HMR host and port |
| `cargo` crawling in China | Mirror-source instructions in [Windows setup](./initialize.md) |

## Screenshots

<!-- Drop a PNG at docs/screenshot.png and uncomment:
![App screenshot](./docs/screenshot.png)
-->

Run `pnpm tauri dev` to see the four built-in demos (UnoCSS utilities · Iconify icons · Element Plus
components · lodash-es helpers) with a light/dark toggle in the header.

## Tech stack

| Layer | Choice | Version |
| --- | --- | --- |
| Runtime / shell | [Tauri](https://tauri.app) | 2.x (Rust, edition 2021) |
| UI framework | [Vue 3](https://vuejs.org) (`<script setup>` + TS) | 3.5 |
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
- **Rust 1.77+** ([rustup](https://rustup.rs))
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

Four places hold the name `tauri-vue3-template`:

1. `package.json` → `name`
2. `src-tauri/Cargo.toml` → `name` **and** `[lib].name` (`tauri_vue3_template_lib`, underscores)
3. `src-tauri/tauri.conf.json` → `productName`, `identifier` (`com.<you>.<app>`), window `title`
4. `src-tauri/gen/schemas/*` if you regenerate capabilities

Then delete the demo components (`src/components/Demo*.vue`) and their imports in `src/App.vue`.

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
├── uno.config.ts          # presets, theme colors, shortcuts, preflight patch
├── vite.config.ts         # Vue + UnoCSS + manualChunks + Tauri dev server
├── src/
│   ├── main.ts            # Element Plus + dark css-vars + uno.css + global scss
│   ├── App.vue            # layout shell, dark-mode toggle
│   ├── components/        # Demo*.vue — replace these
│   ├── styles/demo.scss   # global SCSS (@apply works here)
│   └── assets/
└── src-tauri/
    ├── Cargo.toml
    ├── tauri.conf.json    # productName, identifier, window, bundle
    ├── capabilities/      # permission sets (least-privilege)
    ├── icons/             # generated from a single source PNG
    └── src/
        ├── main.rs        # binary entry
        └── lib.rs         # `run()` + `greet` command example
```

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

- **Dark mode**: `applyDark()` in `src/App.vue` toggles `<html class="dark">`, which drives both
  Element Plus CSS vars and UnoCSS `dark:` variants. State lives in `localStorage` under `demo:dark`.
- **Theme colors**: `uno.config.ts` maps `primary` / `success` / `warning` / `danger` to the Element
  Plus palette, so `text-danger` and EP components stay visually consistent.
- **Shortcuts**: `flex-center`, `flex-col-center`, `bg-page`, `text-regular`, `text-secondary` — all
  bound to Element Plus CSS variables.
- **Dynamic class names**: add runtime-built utilities to `safelist` in `uno.config.ts`, otherwise
  they are never generated.
- **Fixed port**: Vite is pinned to `1420` with `strictPort: true`; `src-tauri` is excluded from the
  watcher so Rust rebuilds are not triggered by frontend saves.

## Roadmap

- [ ] Router (Vue Router) + state management (Pinia) presets
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
