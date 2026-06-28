# ⚡ FitForge AI

A premium, AI-powered fitness app — personalized workouts, nutrition, progress
tracking, and an AI coach, wrapped in a dark-mode, glassmorphism UI that aims
for Apple Fitness–level polish.

> **Status: foundation / v0.1.** This repo implements the design system and the
> highest-impact screens end-to-end with a clean, scalable architecture. It is a
> production-quality starting point for the full [PRD](#-roadmap), not the
> complete product. See the [roadmap](#-roadmap) for what's built vs. planned.

---

## ✨ What's implemented

A complete, navigable **Expo Router** app with a cohesive premium design system:

| Area | Screen(s) | Highlights |
| --- | --- | --- |
| **Splash** | `app/index.tsx` | Animated logo, liquid pulse halo, auto-routes to onboarding |
| **Onboarding** | `app/onboarding.tsx` | 6-step flow, animated progress bar, single/multi-select chips, "generating plan" state |
| **Home Dashboard** | `app/(tabs)/index.tsx` | Animated calorie ring, macro/water/weight/XP stat cards, today's workout hero, AI tip, habit checklist, streak |
| **Train** | `app/(tabs)/workouts.tsx` | Category filtering (PPL, Upper/Lower, HIIT…), cards that animate into view |
| **Workout Detail** | `app/workout/[id].tsx` | Sets/reps, exercise notes, alternatives, warm-up/cool-down, **circular rest timer** with haptics, set completion tracking |
| **AI Coach** | `app/(tabs)/coach.tsx` | Chat UI with streaming-style replies, suggestion chips, typing indicator |
| **Progress** | `app/(tabs)/progress.tsx` | Animated weekly-volume & weight bar charts, measurement grid, photo timeline |
| **Profile** | `app/(tabs)/profile.tsx` | Level/XP bar, achievements, premium upsell, settings |

### Design system (`src/theme`, `src/components`)

- **Dark-first palette** with brand gradients tuned for glassmorphism
  (`colors.ts`), a 4pt **spacing/radius/shadow** scale (`spacing.ts`), and a
  typed **typography** scale (`typography.ts`).
- Reusable premium primitives: `GlassCard` (real backdrop blur via `expo-blur`),
  `GradientButton` (elastic spring + haptics), `ProgressRing` and `BarChart`
  (animated via `react-native-reanimated` + `react-native-svg`),
  `RestTimer`, `Pill`, `StatCard`, `ScreenBackground` (ambient light blooms),
  and a **floating frosted tab bar**.

### Backend scaffolding

- `supabase/schema.sql` — full Postgres schema with Row Level Security for
  profiles, exercises, workouts, session/set logs, nutrition, measurements,
  photos, habits, and coach messages.
- `src/lib/supabase.ts` — lazy client that boots in guest/demo mode when no
  credentials are set.
- `src/lib/ai.ts` — AI Coach transport that calls a Claude-backed Supabase Edge
  Function in production and falls back to a local responder offline.

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env   # optional — app runs in demo mode without it
npm start              # then press i / a / w for iOS, Android, web
```

> Requires the Expo toolchain. Without `.env` credentials the app runs fully in
> **demo mode** using the mock data in `src/data/`.

### Useful scripts

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run ios | android | web
```

---

## 🏗 Architecture

```
app/                      # expo-router routes (file-based navigation)
  _layout.tsx             # root stack + providers
  index.tsx               # splash
  onboarding.tsx
  (tabs)/                 # floating tab bar group
    _layout.tsx
    index.tsx             # home dashboard
    workouts.tsx
    coach.tsx
    progress.tsx
    profile.tsx
  workout/[id].tsx        # workout detail + rest timer
src/
  components/             # reusable premium UI primitives
  theme/                  # colors, spacing, typography tokens
  data/                   # types + seed/mock data (exercises, workouts, user)
  lib/                    # supabase + AI transport
supabase/
  schema.sql              # database schema with RLS
```

**Principles:** typed everything, design tokens over magic numbers, presentation
components decoupled from data, and a transport layer (`src/lib`) so swapping
mock data for live Supabase/Claude calls touches one place per concern.

---

## 🗺 Roadmap

Built here (✅) vs. planned per the full PRD (⬜):

- ✅ Design system, navigation, core screens, rest timer, animated charts/rings
- ✅ Supabase schema + RLS, AI coach transport abstraction
- ⬜ **Auth**: Supabase email/Google/Apple + guest mode wiring
- ⬜ **Live data**: replace `src/data` mocks with Supabase queries + offline cache
- ⬜ **AI Coach**: Claude API Edge Function with streaming + profile context
- ⬜ **Nutrition**: food database, barcode scanner, AI meal recognition, planner
- ⬜ **3D**: interactive body model (tap muscles → exercises), `react-three-fiber`
- ⬜ **Wearables**: Apple Health / Google Fit / Fitbit / Garmin sync
- ⬜ **Social**: feed, follows, leaderboards, challenges
- ⬜ **Payments**: Stripe premium subscription + paywall
- ⬜ **Notifications**: FCM smart reminders
- ⬜ **Admin dashboard** (web)

---

## 🛠 Tech stack

React Native · Expo (Router, Blur, Linear Gradient, Haptics) ·
TypeScript · Reanimated · react-native-svg · Supabase (Postgres, Auth,
Storage) · Claude API for AI coaching · Stripe · Firebase Cloud Messaging.
