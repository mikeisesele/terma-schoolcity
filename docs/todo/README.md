# schoolcity-web — Build Plan (PM-as-files)

The complete task layer for the **SchoolOS SchoolCity** public directory. Each task is a checkable user story scoped for a Claude Code `build-session`. Implement top-down; verify against the spec before checking a box.

## Legend

- `- [ ]` open · `- [x]` done
- 🔴 = **MVP critical path** (BUILD.md §3 step 9: *SchoolCity SSR + vacancy applications*). Ship these first.
- (no marker) = post-MVP / enhancement.
- `(verify against …)` = confirm detail against the cited spec before building.

## Build order

1. **`00-foundation.md`** — Next.js 14 scaffold, Verdant tokens, shared UI, supabase-js client, env, SEO/metadata baseline, ISR config.
2. **`01-auth.md`** — Google OAuth → `schoolcity_users`, sign-in gate, session, isolation from admin/parent JWT.
3. **`seo-ssr.md`** — SSR profiles, ISR revalidation, sitemap, structured data, OG, indexability.
4. **`features/directory-search.md`** — home/dashboard sections + Find a school + pagination.
5. **`features/school-detail.md`** — profile tabs (About/Facilities/Vacancies/Scholarships/Map/Reviews) + SchoolOS CTA.
6. **`features/save-compare.md`** — heart/save (gated), share, compare bar.
7. **`features/vacancies-apply.md`** — vacancy board + gated apply + CV pre-signed upload.
8. **`features/enquiries.md`** — Enquire Now modal → public enquire endpoint.
9. **`features/reviews.md`** — read moderated parent-app reviews; anonymity.
10. **`features/growth-ask-your-school.md`** — ENH-2 persistent growth bar + analytics.

## Source links (read, do not invent)

- Design: `/Users/admin/Downloads/Unzip and extract continuation(2)/` → **live**: `SchoolOS SchoolCity.html`, `sn-masonry.jsx`, `schoolcity-extras.jsx`. **Ignore** `SN Option*.html`, `schoolcity-options.dc.html`.
- `SYSTEM.md` — §9 (SchoolCity arch), §2.10–§2.16 (schema), §3.8–§3.12 + §3.1 (API), §19 E/F/G.
- `DATA_SOURCES.md` §7. `UNWIRED_AUDIT.md` 🌐 SchoolCity. `CONTINUATION.md` ENH-2. `VERDANT.md`.
- Notion: Phase 5 Screens `389ec5fb0523814fb2d4eae421c57621` · Phase 7 Nav `389ec5fb05238129b0a7e24dece7ec71` · Phase 10 Growth `389ec5fb0523815cbaafe78689977d52`.
- Backend endpoints + product rules: repo-root `CLAUDE.md`.

## Status checklist (top-level surfaces)

- [ ] Foundation (scaffold, tokens, supabase client, SEO baseline, ISR)
- [ ] Auth (Google OAuth, sign-in gate, isolation)
- [ ] SEO / SSR / ISR / sitemap / structured data
- [ ] Directory + Search + pagination 🔴
- [ ] School detail (all tabs) 🔴
- [ ] Save / Compare / Share
- [ ] Vacancy board + Apply + CV upload 🔴
- [ ] Enquiries
- [ ] Reviews (read-only)
- [ ] Growth — Ask your school

## Hard rules (do not violate — see CLAUDE.md)

1. No public self-listing — schools appear only via SchoolOS onboarding.
2. `schoolcity_users` isolated from admin/parent identity.
3. Public read = verified + published only.
4. Save + Apply require Google sign-in; everything else public.
5. Reviews are read-only, parent-app sourced, moderated, anonymity-respecting.
6. Maps = OpenStreetMap iframe. Storage = Supabase (pre-signed CV upload).
7. Enquiries require BOTH phone (E.164) AND email.
