# AGENTS.md

## Project Overview

`zentao-api` — JS/TS SDK for ZenTao (禅道) API v2. Targets Node 18+ and browsers (bundler / CDN).

## Commands

```sh
bun test                  # Unit tests (Bun runner)
bun run test:real         # Integration tests (needs env config, see README)
bun run test:coverage     # Tests with coverage
bun run typecheck         # Type-check src
bun run typecheck:tests   # Type-check tests
bun run build             # Clean → tsc → browser bundle
bun run check             # Full CI: test + typecheck + registry + build + smoke
bun run registry:check    # Verify generated registry is current
```

Single file: `bun test tests/client.test.ts`

## Architecture

- **ZentaoClient** (`src/client/`) — HTTP client; token injection, TLS, timeout, URL construction (`/api.php/v2`), `get/post/put/delete/login`, static `init()` singleton.
- **request()** (`src/request/`) — `"module/action"` format (e.g. `"bug/list"`), resolves via registry, assembles path/query/body, normalizes into `ResponseData` with pagination.
- **Module Registry** (`src/modules/registry.ts` + `generated.ts`) — All ZenTao modules/actions with path templates, params, body schemas. `generated.ts` is **auto-generated** from `data/zentao-openapi.json` — do not edit manually.
- **Module Resolution** (`src/modules/resolve.ts`) — Path template substitution, scope inference (product > project > execution), query/body assembly.
- **Profiles** (`src/profiles/`) — Persistent profiles at `~/.config/zentao/zentao.json` (Node) / `localStorage` (browser). Keyed by `account@server`.
- **Errors** (`src/misc/errors.ts`) — `ZentaoError` with stable codes and placeholder messages.
- **Global Options** (`src/misc/global-options.ts`) — Process-level defaults (client, recPerPage, limit, timeout).
- **Environment** (`src/misc/environment.ts`) — Runtime detection, insecure TLS toggle (Node only).
- **Types** (`src/types/`) — All public TS interfaces.

## Code Generation

`src/modules/generated.ts` is produced by `scripts/update-registry.ts` from `data/zentao-openapi.json`. After updating the OpenAPI spec run `bun run scripts/update-registry.ts`. CI `check` verifies it's current.

## Browser Build

`scripts/build-browser.ts` → UMD bundle exposing `window.ZentaoAPI`. Entry: `src/browser.ts` → `src/misc/browser-global.ts`.

## Testing

Unit tests use `bun:test` with `Bun.serve()` mock HTTP servers. Real-env tests (`bun run test:real`) require a running ZenTao instance configured via `env.local` / `.env.local` (see README). Real tests are excluded from default `bun test`.

## Commit Convention

English, prefix format: `*|+|- <type>: <message>` (`*` change, `+` add, `-` remove). No emoji.
