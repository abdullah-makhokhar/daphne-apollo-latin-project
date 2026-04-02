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
- **Deployment**: Vercel Serverless Functions (Node.js 24)

## 🚀 Deployment (Vercel)

**This project is production-ready for Vercel deployment (March 2026).**

### Quick Start
1. Set up PostgreSQL database (Railway, Supabase, AWS RDS, or DigitalOcean)
2. Connect repository to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy! (auto-triggers on GitHub push)

### Documentation
- **Complete Guide**: See [`VERCEL_DEPLOYMENT_COMPLETE.md`](./VERCEL_DEPLOYMENT_COMPLETE.md)
- **Checklist**: See [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
- **Environment Setup**: See [`.env.example`](./.env.example)

### Key Files for Deployment
- `api/index.ts` — Serverless function entry point (Express app)
- `vercel.json` — Vercel configuration
- `api/package.json` — Dependencies for serverless handler
- `scripts/validate-deployment.js` — Pre-deployment validation
- `scripts/check-deployment.sh` — Post-deployment health check

### Endpoints
- `GET /` — API root (returns status)
- `GET /api/healthz` — Health check for load balancers

## Structure

```text
artifacts-monorepo/
├── api/                    # ← Vercel serverless entry point
│   ├── index.ts            # Express app handler
│   ├── package.json        # Serverless dependencies
│   └── tsconfig.json       # TypeScript config
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (local dev only)
│   └── daphnes-root/       # Daphne's Root — narrative clicker game
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   ├── validate-deployment.js  # Pre-deployment validation
│   └── check-deployment.sh     # Post-deployment health check
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
├── vercel.json             # Vercel deployment config
├── package.json            # Root package with hoisted devDeps
└── .env.example            # Environment variables template
```

## Daphne's Root — Game Architecture

A narrative-driven incremental clicker game based on Ovid's Metamorphoses I.543–561.
All 18 lines in exact user-specified translations, split into Part I (The Transformation) and Part II (Apollo's Embrace). Dark Academia aesthetic. See `CONFIG.md` at the project root for the full tuning guide.

### Key Files

- `artifacts/daphnes-root/src/config/gameConfig.ts` — **All game configuration**: 18 story nodes (Latin lines + effects), PARTS metadata, and GAME_CONFIG constants. Edit here to tune balance.
- `artifacts/daphnes-root/src/store/gameStore.ts` — Zustand state store with localStorage persistence. All game logic (click, tick, purchase) lives here.
- `artifacts/daphnes-root/src/pages/Game.tsx` — Main game layout: sprite, Numen display, Heat bar, tabs (Metamorphosis / Scroll of Ovid), stat cards.
- `artifacts/daphnes-root/src/components/` — Individual UI components:
  - `DaphneSprite.tsx` — Progressive SVG sprite driven by `unlockedIds[]`, p1/p2 counters control skin/bark/branches/leaves/adornments
  - `ParticleBackground.tsx` — Canvas-rendered glowing particles (reacts to heat level)
  - `ClickFeedback.tsx` — Orange expanding ring + floating "+N numen" on each click
  - `HeatBar.tsx` — Apollo's Heat progress bar with penalty warning and dashed threshold marker
  - `UpgradeShop.tsx` — Two-section shop (Part I / Part II) with affordability highlighting
  - `ScrollOfOvid.tsx` — Unlocked lines display grouped by Part
  - `NumenDisplay.tsx` — Cookie-clicker-style counter with per-click and per-sec stats
  - `TriumphScreen.tsx` — Endgame victory overlay

### Sound System

All sound configuration is in `src/config/soundConfig.ts` — the only file needed to add/change sounds:
- `SOUND_CONFIG` — one `{ src, volume, enabled }` slot per event (click, upgrade, refugit, heatWarning, heatPenaltyLoop, heatDanger, apolloAppears, triumph, reset)
- `UPGRADE_SOUND_OVERRIDES` — per-line-id sound overrides that play instead of the generic upgrade sound
- `SOUND_ENABLED` — global mute toggle
- Sound files go in `public/sounds/` (mp3 / ogg / wav supported)
- Uses HTMLAudioElement pooling (4 instances/event) — no external libraries
- See full guide in `CONFIG.md` section 9

### Easy Configuration Points

In `src/config/gameConfig.ts` — see full guide in `CONFIG.md`:
- `GAME_CONFIG.HEAT_INCREASE_RATE` — how fast Apollo's Heat rises (0.45/tick)
- `GAME_CONFIG.HEAT_PENALTY_THRESHOLD` — heat % when Numen slows (75)
- `GAME_CONFIG.HEAT_PENALTY_SLOW` — Numen multiplier when penalised (0.5 = 50%)
- `GAME_CONFIG.TICK_RATE_MS` — game tick speed in ms (100)
- `GAME_CONFIG.REFUGIT_PUSHBACK` — heat reduction on each purchase after Refugit unlock (25)
- `STORY_NODES` array — add/remove/edit Latin lines, costs, and effects
- `PARTS` object — Part I / Part II section headers and descriptions

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
