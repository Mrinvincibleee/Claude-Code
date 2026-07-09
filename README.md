# Chaye 25 Hai — چائے ۲۵ ہے

Marketing website for Chaye 25 Hai, a 24-hour chai cafe in Federal B Area
Yaseenabad, Karachi. Single static page built to convert nearby visitors
into WhatsApp orders, calls, and walk-ins.

**Stack:** Next.js 15 (App Router, SSG) · TypeScript (strict) · Tailwind
CSS v4 · Framer Motion (scroll reveals only) · Vercel Analytics.

## Development

```sh
npm install
npm run dev        # local dev server
npm run build      # production build (includes type-check + lint)
npm test           # hours-logic unit tests (vitest)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Updating content (for maintainers)

All business facts and copy that change over time live in `src/data/` —
nothing else needs touching:

- `src/data/business.ts` — name, address, phone/WhatsApp number, hours,
  rating, canonical site URL
- `src/data/menu.ts` — menu items and prices
- `src/data/reviews.ts` — the three quote cards
- `src/data/gallery.ts` — gallery image paths and alt text (files live in
  `public/gallery/`)

Search for `TODO(client)` in `src/data/` to find every placeholder that
must be confirmed with the owner before launch. Edit, commit, redeploy.

## Notable implementation details

- **Open-now badge** computes open/closed client-side in the
  Asia/Karachi timezone from the typed hours config (Saturday has
  shorter listed hours — pending owner confirmation). Logic in
  `src/lib/hours.ts`, tests in `src/lib/hours.test.ts`.
- **Urdu typography**: Noto Nastaliq Urdu is self-hosted as two hand-cut
  subsets (see `src/fonts/README.md`) so the hero lockup — the LCP
  element — needs only a ~20 KB preloaded font on slow 4G.
- **Hero choreography** is pure CSS (starts on first paint, no JS on the
  critical path); scroll reveals are progressive enhancement — content is
  server-rendered visible and only animates once hydrated.
- **Placeholder assets**: `scripts/generate-placeholders.mjs` (gallery
  JPEGs) and `scripts/generate-og.mjs` (Open Graph card, rendered via
  headless Chromium for correct Nastaliq shaping).

## Deployment

Static output, designed for Vercel free tier (zero config). After the
client buys the domain, update `siteUrl` in `src/data/business.ts` so the
canonical URL, sitemap and Open Graph tags point at it.
