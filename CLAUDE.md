# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Despite the repository name (`Claude-Code`), this is **FitForge AI** — an Expo / React Native fitness app (dark-mode, glassmorphism UI) at foundation stage (v0.1). The UI and design system are fully built; the backend is scaffolded but intentionally stubbed, so the app runs entirely in **demo mode** on mock data unless env credentials are configured.

## Commands

```bash
npm install
npm start              # expo dev server; press i / a / w for iOS / Android / web
npm run typecheck      # tsc --noEmit (strict mode)
npm run lint           # eslint . --ext .ts,.tsx (eslint-config-expo)
npm run ios|android|web
npx expo export --platform web   # production web build → dist/
```

There is no test suite or test runner configured.

## Architecture

### Navigation (`app/`)

Expo Router file-based routes with typed routes enabled. Flow: `index.tsx` (splash, auto-routes) → `onboarding.tsx` → `(tabs)/` group (home, workouts, coach, progress, profile) plus `workout/[id].tsx` detail. Root providers (gesture handler, safe area, stack) live in `app/_layout.tsx`; the custom floating frosted tab bar is in `app/(tabs)/_layout.tsx`.

### Layering (`src/`, alias `@/*` → `src/*`)

The core principle (from the README): presentation is decoupled from data, and each backend concern goes through one transport module, so swapping mocks for live services touches one file per concern.

- **`src/theme/`** — design tokens: `palette`/`gradients` (colors.ts), 4pt `spacing`/`radius`/`shadow` scales (spacing.ts), `typography`. Always style with these tokens via `StyleSheet.create`; no magic numbers or hard-coded colors in screens/components.
- **`src/components/`** — reusable primitives (GlassCard, GradientButton, ProgressRing, BarChart, RestTimer, Pill, StatCard, ScreenBackground, SectionHeader), re-exported through `src/components/index.ts`. Animation uses `react-native-reanimated` + `react-native-svg`; buttons/timers use `expo-haptics`.
- **`src/data/`** — shared domain types (`types.ts`: Exercise, Workout, UserProfile, etc.) and the mock/seed data that currently powers every screen.
- **`src/lib/`** — the transport layer:
  - `supabase.ts`: lazy client, **currently a stub returning `null`** — `@supabase/supabase-js` is not installed; the real implementation is in a comment to be enabled when wiring live data. `isSupabaseConfigured` gates guest/demo mode.
  - `ai.ts`: `askCoach()` POSTs to the Supabase Edge Function at `EXPO_PUBLIC_AI_COACH_URL` (which proxies the Claude API so the key never ships in the client); with no URL set it falls back to the local keyword responder in `src/data/coach.ts`.

### Backend (`supabase/schema.sql`)

Full Postgres schema with Row Level Security: per-user "own row" policies on profiles, workout_sessions, set_logs, food_logs, measurements, progress_photos, habit_logs, coach_messages; public read on exercises/foods. Not yet consumed by the app — the roadmap step is replacing `src/data` mocks with Supabase queries.

## Environment variables

Copy `.env.example` → `.env` (optional — app runs without it). Anything prefixed `EXPO_PUBLIC_` is bundled into the client, so only public values go there (Supabase URL, anon key, coach function URL). Server secrets (`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`) belong only in Supabase Edge Functions, never in `.env` or client code.

## Web deployment — important quirks

- `.github/workflows/deploy-web.yml` builds the Expo web app and deploys `dist/` to GitHub Pages (https://mrinvincibleee.github.io/Claude-Code/) on pushes to `claude/fitforge-ai-prd-bhmwep`.
- `app.json` sets `experiments.baseUrl: "/Claude-Code"` so the SPA works under the Pages subpath, and `web.output: "single"` (the workflow copies `index.html` → `404.html` as the SPA fallback).
- **The repo root also contains a committed web build** (`index.html`, `404.html`, `_expo/`, `assets/`, `metadata.json`, `.nojekyll`) published to the branch root for Pages. These are build artifacts, not source — never hand-edit them; regenerate via `npx expo export --platform web` if they need updating. In particular, root `assets/` is bundler output, not the app's source assets.

## Conventions

- TypeScript strict mode; use the `@/` import alias for everything under `src/`.
- `react-native-reanimated/plugin` must stay **last** in `babel.config.js` plugins.
- Keep screens presentation-only: new data access goes through `src/lib`, new domain shapes into `src/data/types.ts`, new visual constants into `src/theme`.
