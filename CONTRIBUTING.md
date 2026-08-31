# Contributing · 贡献指南

Thanks for taking the time to contribute. 感谢你愿意贡献代码。

## 开发流程

1. Fork 本仓库，从 `main` 切分支：`feat/xxx`、`fix/xxx`、`docs/xxx`
2. 安装依赖：`pnpm install`
3. 运行：`pnpm tauri dev`（改 Rust 会自动重编，改前端走 HMR）
4. 提交前跑 `pnpm build`，必须无 `vue-tsc` 类型错误
5. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org)：
   `feat:` `fix:` `docs:` `chore:` `refactor:` `perf:` `test:`
6. 发起 PR，说明**问题是什么**、**怎么解决的**，必要时附截图或 `pnpm tauri info` 输出

## 提交范围建议

- 新增预设：请同时更新 `README.md` 与 `README.zh-CN.md` 对应章节
- 构建配置改动：请在 PR 里说明动机（性能、兼容性、体积）
- 依赖升级：给出升级前后的体积 / 构建耗时对比更好

## Issue 规范

提 bug 请提供：

- 操作系统与版本
- Node / pnpm / Rust 版本
- `pnpm tauri info` 的完整输出
- 最小复现步骤

## 行为准则

保持友善与就事论事。技术分歧摆数据，不摆情绪。
