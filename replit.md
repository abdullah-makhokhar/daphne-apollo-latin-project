# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── daphnes-root/       # Daphne's Root — narrative clicker game
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Daphne's Root — Game Architecture

A narrative-driven incremental clicker game based on Ovid's Metamorphoses I.545–559.

### Key Files

- `artifacts/daphnes-root/src/config/gameConfig.ts` — **All game configuration**: story nodes (Latin lines + effects), act definitions, and GAME_CONFIG constants. Edit here to tune balance.
- `artifacts/daphnes-root/src/store/gameStore.ts` — Zustand state store with localStorage persistence. All game logic (click, tick, purchase) lives here.
- `artifacts/daphnes-root/src/pages/Game.tsx` — Main game layout: sprite, Numen display, Heat bar, tabs (Upgrades / Scroll of Ovid), stat cards.
- `artifacts/daphnes-root/src/components/` — Individual UI components:
  - `DaphneSprite.tsx` — SVG sprite with 5 transformation stages
  - `HeatBar.tsx` — Apollo's Heat progress bar with penalty warning
  - `UpgradeShop.tsx` — Purchase upgrades grouped by Act
  - `ScrollOfOvid.tsx` — Displays unlocked Latin lines with translations
  - `NumenDisplay.tsx` — Numen counter and per-click/per-second stats
  - `TriumphScreen.tsx` — Endgame victory overlay

### Easy Configuration Points

In `src/config/gameConfig.ts`:
- `GAME_CONFIG.HEAT_INCREASE_RATE` — how fast Apollo's Heat rises (default 0.08/tick)
- `GAME_CONFIG.HEAT_PENALTY_THRESHOLD` — heat % when Numen slows (default 80)
- `GAME_CONFIG.HEAT_PENALTY_SLOW` — Numen multiplier when penalised (default 0.5 = 50%)
- `GAME_CONFIG.TICK_RATE_MS` — game tick speed in ms (default 100)
- `GAME_CONFIG.REFUGIT_PUSHBACK` — heat reduction on each purchase after Refugit unlock (default 20)
- `GAME_CONFIG.SPRITE_STAGES` — thresholds for visual transformation stages
- `STORY_NODES` array — add/remove/edit Latin lines, costs, and effects

### State Persistence

Game state is saved to `localStorage` under the key `daphnes-root-save` using Zustand's `persist` middleware. Players can refresh without losing progress.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck; actual JS bundling by esbuild/tsx/vite

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/daphnes-root` (`@workspace/daphnes-root`)

React + Vite frontend-only game. State management via Zustand with localStorage persistence.
- Entry: `src/main.tsx`
- Game config: `src/config/gameConfig.ts` — tune all game balance here
- State: `src/store/gameStore.ts` — Zustand store
- `pnpm --filter @workspace/daphnes-root run dev` — run the dev server

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request/response validation.
- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- `pnpm --filter @workspace/api-server run dev` — run the dev server

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.
- `pnpm --filter @workspace/db run push` — push schema to DB

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec and Orval codegen config.
Run codegen: `pnpm --filter @workspace/api-spec run codegen`
