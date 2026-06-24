# schoolnet-web — KidTrack School Net (public directory)

> **One-liner:** The public, Google-indexable **KidTrack School Net** directory — parents discover, compare, save, enquire about, and apply for jobs at KidTrack schools. Schools appear here only as a benefit of adopting KidTrack; this repo is **public read** + a thin authenticated layer for parents (save / apply).

This file is the repo contract for any Claude Code `build-session`. Read it, then the spec (below), then scope ONE surface at a time.

---

## What this repo is (and is not)

- **IS:** A Next.js 14 (App Router) public web app. SSR for school profiles (must be in Google's index), ISR for freshness. supabase-js for reads. A separate identity (`schoolnet_users`) via Google OAuth for the small set of authed actions.
- **IS NOT:** The backend. The **`kidtrack-backend`** repo owns Supabase (Postgres, RLS, Auth, Storage, Edge Functions) and the schema/DDL. This repo **consumes** its public endpoints — never define tables or Edge Functions here. Reference endpoints; do not implement them.
- **IS NOT:** The admin / parent / teacher portals. Those live in `kidtrack-web` (React + Vite). School Net users **cannot** reach any of those surfaces.

## Stack — LOCKED

| Layer | Choice |
|---|---|
| Framework | **Next.js 14, App Router** (TypeScript, strict) |
| Rendering | **SSR** for `/schools/[id]` (indexable) · **ISR** `revalidate ≈ 60s` for directory + profiles · static for chrome |
| Data | **supabase-js** client → `kidtrack-backend` **public read** endpoints (verified + published rows only) |
| Auth | Supabase Auth **Google OAuth** → `schoolnet_users` (JWT role `schoolnet_user`) |
| Maps | **OpenStreetMap** `<iframe>` embed — **no API key**. NOT Mapbox/Google. |
| Storage | **Supabase Storage** — CV uploads via **pre-signed URL** (PDF ≤ 5MB; server holds the key) |
| Styling | Verdant design tokens (below). DM Sans (UI) + Cormorant Garamond (hero/section) |

## Non-negotiable product rules

1. **No public self-listing.** "List your school" is NOT a public feature. Schools appear only via KidTrack onboarding (a Standard+ plan benefit). Any "list your school" surface from the prototype must be removed or repurposed as **KidTrack lead capture only** (parent-led growth, ENH-2). See `SYSTEM.md §9` and §19 G.
2. **`schoolnet_users` are isolated.** Separate identity from `users` (admin/parent/teacher/driver/student). A School Net JWT (`role = schoolnet_user`) must never be accepted by admin/parent portals, and this repo must never request or render admin/parent data. Google OAuth only; no self-signup with school credentials.
3. **Public read = verified + published only.** Directory and profile data expose only schools with a `schoolnet_verifications` row and `published` status; vacancies/scholarships only when `published`/`open`. Enforced server-side by the backend — this repo must not try to surface drafts.
4. **Sign-in gate.** Browsing, search, compare, share, reading reviews, and submitting enquiries are **public**. Saving a school and applying to a vacancy **require Google sign-in**.
5. **Reviews are parent-app sourced + moderated.** Reviews come from the KidTrack Parent App (require a parent with an enrolled child, validated via `student_parents`; moderated). This repo **reads** them only — no review authoring here. Respect anonymity: hide names, never expose internal `student_id`.
6. **Verified badge** (`standard | featured | premium`) is assigned by the KidTrack team (`schoolnet_verifications.badge_level`) — display only.
7. **Enquiries require BOTH phone (E.164) AND email.**

## Brand — Verdant

- Forest `#1A3D2C` · Gold `#B87D20` · Cream `#FAF7F0`.
- Fonts: **DM Sans** (UI) + **Cormorant Garamond** (hero / section headings).
- Every screen passes the **Premium UI "Warmth + Restraint" audit** (see `VERDANT.md`). Generous whitespace, restrained accents, warm cream base.

## Where the spec lives (source of truth — read, do not invent)

Design folder: `/Users/admin/Downloads/Unzip and extract continuation(2)/`

- **Live School Net design** (rebuild as Next.js/TS — do NOT ship the Babel-in-browser prototype): `Kidtrack School Net.html` → `sn-masonry.jsx` (directory/home/find/detail), `schoolnet-extras.jsx` (auth / vacancy / favourites / compare / apply modals).
- **IGNORE** (discarded explorations): all `SN Option*.html`, `schoolnet-options.dc.html`.
- `SYSTEM.md` — **§9 School Net architecture notes** (pages, data sources, rules), schema §2.10–§2.16, API §3.8–§3.12 + §3 (auth), §19 E/F/G. *(Prompt refers to this as "§16"; the School Net content lives in §9 + §2.14–2.16 + §3.12.)*
- `DATA_SOURCES.md` — §7 School Net public endpoints.
- `UNWIRED_AUDIT.md` — the **🌐 School Net** section (every unwired tap).
- `CONTINUATION.md` — ENH-2 "Ask your school" growth widget.
- `VERDANT.md` — design system / tokens.
- Notion v3 phases (load via ToolSearch "notion" if needed): Phase 5 Screens `389ec5fb0523814fb2d4eae421c57621`, Phase 7 Nav `389ec5fb05238129b0a7e24dece7ec71`, Phase 10 Growth `389ec5fb0523815cbaafe78689977d52`. Search Notion for "School Net".

## Backend endpoints this repo consumes (owned by `kidtrack-backend`)

Public read (verified + published only):
- `GET /api/schoolnet/schools` — query `{ q, level, type, state, max_fee, special_needs, page, limit }`
- `GET /api/schoolnet/schools/:id` — full profile + published vacancies + open scholarships
- `GET /api/public/schools/:school_id/vacancies` · `GET /api/public/schools/:school_id/profile`

Public write:
- `POST /api/schoolnet/enquire` *(== `POST /api/enquiries`)* — `{ school_id, parent_name, phone, email, children_count, message }`

Auth + authed (Google sign-in required):
- `POST /api/auth/schoolnet/google` — `{ id_token }` → JWT `role: schoolnet_user`
- `GET/POST /api/public/me/saved-schools` · `DELETE /api/public/me/saved-schools/:id`
- `POST /api/public/vacancies/:id/apply` — multipart `{ name, email, phone, cover_note, cv (PDF ≤5MB) }`; 403 if not published

## Build-session scoping

- Scope ONE surface/flow per session: `00-foundation` → `01-auth` → `seo-ssr` → then per feature file under `docs/todo/features/`.
- 🔴 = MVP critical path (BUILD.md §3 step 9: School Net SSR + vacancy applications).
- Verify each task against the Phase 5 screen inventory + `SYSTEM.md §9` rules before marking complete.
- Never ship the prototype's `localStorage`/simulated channels — wire to the real backend endpoints above.

## Conventions

- TypeScript strict; App Router server components by default, client components only where interaction requires.
- No secrets in client bundles; Supabase anon key only for public reads; CV upload uses backend-issued pre-signed URLs.
- Absolute imports from `@/`. Tokens in one `theme`/`tokens` module — never hardcode hex outside it.
- Accessibility: semantic headings (SEO + a11y), alt text on photos, keyboard-navigable modals.
