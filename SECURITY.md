# Security Policy

## Supported versions

This is a template repository, not a shipped application. Security fixes land on `main` and are
picked up by anyone who regenerates from the template / merges upstream.

| Version | Supported |
| --- | --- |
| `main` (latest) | ✅ |
| Older tags | ❌ — please rebase on `main` |

## Reporting a vulnerability

**Do not open a public issue for security problems.**

Report privately via GitHub Security Advisories:
<https://github.com/qqlcx5/tauri-template/security/advisories/new>

Include:

- affected file(s) and commit SHA
- a minimal reproduction
- impact and suggested fix (if you have one)

Expected response: acknowledgement within 72 hours, and a fix or a documented decision within 7 days.
If the report concerns an upstream crate (Tauri, a plugin, Element Plus, …), we will help you route it
upstream and track it here.

## Hardening already in this template

| Measure | Where | Notes |
| --- | --- | --- |
| Content Security Policy (object form) | `src-tauri/tauri.conf.json` → `app.security.csp` | Tauri injects nonces + hashes for bundled scripts/styles at compile time, so `script-src` needs no `'unsafe-inline'` |
| Separate dev policy | `app.security.devCsp` | Looser, keeps Vite HMR (`ws://localhost:1421`) working; `csp` alone would be reused in dev if `devCsp` were unset |
| Least-privilege capabilities | `src-tauri/capabilities/default.json` | Only `core:default` + `opener:default`; Tauri 2 is deny-by-default |
| File-drop interception | window config | `dragDropEnabled` defaults to `true`, so web content cannot read dropped local file paths |
| No remote code | — | No CDN scripts; all assets are bundled locally |

### Before you ship: what you must change

- `connect-src` is restricted to `ipc: http://ipc.localhost`. **Add your API origins** or `fetch` will
  fail in the packaged app while working fine in `pnpm dev`.
- `bundle.publisher` and `bundle.copyright` ship as `Your Name`.
- `identifier` ships as `com.example.tauri-vue3-template` — replace it.
- Enable code signing for release builds (see Tauri's [Sign](https://v2.tauri.app/distribute/sign/)
  guide). Unsigned installers trigger OS warnings and break auto-update.
