# 00 — Foundation

Scaffold, design system, data client, environment, and SEO/ISR baseline. Everything else depends on this. Build first.

Spec: `SYSTEM.md §9` · Phase 5 · `VERDANT.md` · repo `CLAUDE.md`. Design ref: `SchoolOS SchoolCity.html`, `sn-masonry.jsx`.

---

- [~] 🔴 **Next.js 14 App Router scaffold** — As a developer, I can run the app locally so that I have a foundation to build SchoolCity on.
  - Screens: n/a (project setup)
  - Spec: BUILD.md §0 (Public web = Next.js App Router) · `CLAUDE.md`
  - Backend: none (scaffold)
  - Gating/Auth: public
  - Accept: `app/` router, TypeScript strict, ESLint/Prettier, `@/` absolute imports, dev server runs, root layout renders an empty themed shell. Do NOT carry over Babel-in-browser prototype.

- [~] 🔴 **Verdant design tokens module** — As a developer, I can import one tokens source so that brand colours/fonts are consistent and never hardcoded.
  - Screens: all · derived from `VERDANT.md`
  - Spec: `VERDANT.md` · `CLAUDE.md` (forest `#1A3D2C`, gold `#B87D20`, cream `#FAF7F0`)
  - Backend: none
  - Gating/Auth: public
  - Accept: single `theme`/`tokens` exports colours, radii, spacing, shadows; DM Sans (UI) + Cormorant Garamond (hero/section) loaded via `next/font`; no raw hex outside the module. (verify palette against `VERDANT.md`)

- [~] 🔴 **Shared UI primitives** — As a developer, I can reuse SN chrome + cards so that screens stay consistent and pass the Warmth+Restraint audit.
  - Screens: `sn-masonry.jsx` → `SNNav`, `SNCard`, `SHead`, `Stars`
  - Spec: Phase 5 · `VERDANT.md`
  - Backend: none
  - Gating/Auth: public
  - Accept: TS components for top nav (logo, Find a school / Find a vacancy links, user/sign-in slot), section header (`SHead`), school card (`SNCard` with photo, badge, rating stars, fee, heart/share/compare actions), star renderer. Responsive masonry layout. Verdant-styled.

- [~] 🔴 **supabase-js public read client** — As a developer, I can fetch public SchoolCity data so that pages render real backend data.
  - Screens: n/a
  - Spec: `DATA_SOURCES.md §7` · `SYSTEM.md §3.12`
  - Backend: `GET /api/schoolcity/schools`, `GET /api/schoolcity/schools/:id` (owned by schoolos-backend; public read = verified+published only)
  - Gating/Auth: public
  - Accept: server-side data layer wraps backend public endpoints; anon key only; typed response models for school list + detail; central fetch helper with error handling. No direct table writes from client.

- [~] 🔴 **Environment & config** — As a developer, I can configure URLs/keys per environment so that the app points at the right backend.
  - Screens: n/a
  - Spec: BUILD.md §0
  - Backend: n/a
  - Gating/Auth: public
  - Accept: `.env.example` documents `NEXT_PUBLIC_SUPABASE_URL`, anon key, backend API base URL, OSM embed base, site canonical URL, Google OAuth client id. No secrets committed; CV upload uses backend-issued pre-signed URLs (no storage secret in client).

- [~] 🔴 **SEO / metadata baseline** — As a public visitor, I get correct titles/descriptions so that pages are shareable and indexable.
  - Screens: `SchoolOS SchoolCity.html` (`<title>SchoolCity · Find the perfect school for your child`)
  - Spec: Phase 5 · `CLAUDE.md` (indexable)
  - Backend: none (per-page metadata wired in `seo-ssr.md`)
  - Gating/Auth: public
  - Accept: root `metadata` (title template, description, default OG/Twitter, favicon, theme-color cream); `lang="en"`; semantic landmark structure. Detail/dynamic metadata handled in `seo-ssr.md`.

- [~] 🔴 **ISR / rendering config** — As a public visitor, I see fresh-but-fast pages so that SEO and performance are both met.
  - Screens: directory + `/schools/[id]`
  - Spec: BUILD.md §0 (SSR/ISR) · `CLAUDE.md` (revalidate ≈ 60s)
  - Backend: `GET /api/schoolcity/schools[/:id]`
  - Gating/Auth: public
  - Accept: school profile routes SSR + `revalidate ≈ 60`; directory listing ISR; static chrome cached; documented rendering strategy per route. Authed actions (save/apply) isolated to client components so they don't break static/ISR.

- [ ] **Global toast / feedback util** — As a visitor, I get confirmation/error feedback so that actions feel responsive.
  - Screens: prototype uses `window.KT_toast`
  - Spec: `UNWIRED_AUDIT.md` (many actions are toast-only in prototype)
  - Backend: none
  - Gating/Auth: public
  - Accept: app-level toast provider (success/error/info), replacing prototype global; accessible (aria-live).

- [ ] **Error / loading / not-found states** — As a visitor, I see graceful states so that failures don't show a blank page.
  - Screens: all routes
  - Spec: Phase 5
  - Backend: n/a
  - Gating/Auth: public
  - Accept: `loading.tsx`, `error.tsx`, `not-found.tsx` for directory + `/schools/[id]`; unknown/unverified school id → 404 (not draft leak).
