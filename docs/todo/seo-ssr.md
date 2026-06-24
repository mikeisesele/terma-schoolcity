# SEO · SSR · ISR

School profiles **must be Google-indexable**. This is the SEO discipline layer over the directory + detail routes.

Spec: BUILD.md §0 (SSR profiles, ISR ≈60s) · `SYSTEM.md §9`/§3.12 · Phase 5 · `CLAUDE.md`. Design ref: `Kidtrack School Net.html` (`<title>`, fonts).

---

- [ ] 🔴 **SSR school profile pages** — As a search engine, I can crawl fully-rendered school profiles so that schools rank in Google.
  - Screens: `sn-masonry.jsx → SNDetail`
  - Spec: BUILD.md §0 · `SYSTEM.md §3.12` (`GET /api/schoolnet/schools/:id`)
  - Backend: `GET /api/schoolnet/schools/:id` → profile + published vacancies + open scholarships (verified+published only)
  - Gating/Auth: public
  - Accept: `/schools/[id]` server-renders complete content (no client-only data); HTML contains name, tagline, about, fees, facilities, vacancies; passes "view source" check; slug includes readable school name segment for SEO. (verify route shape against Phase 5)

- [ ] 🔴 **ISR revalidation** — As a visitor, profiles reflect recent backend changes so that data isn't stale, without per-request cost.
  - Screens: directory + `/schools/[id]`
  - Spec: BUILD.md §0 (revalidate ≈ 60s)
  - Backend: `GET /api/schoolnet/schools[/:id]`
  - Gating/Auth: public
  - Accept: `revalidate ≈ 60`; updated marketing/vacancy data appears within the window; build does not pre-render unverified/unpublished schools.

- [~] 🔴 **Per-page dynamic metadata** — As a visitor sharing a link, the title/description/OG reflect the specific school so that shares look good and rank well.
  - Screens: `SNDetail`
  - Spec: Phase 5 · `CLAUDE.md`
  - Backend: `GET /api/schoolnet/schools/:id`
  - Gating/Auth: public
  - Accept: `generateMetadata` per school — title `"{School} · {City} | KidTrack School Net"`, description from tagline/intro, canonical URL, OG image (banner/photo), Twitter card. Directory + Find pages have their own metadata.

- [ ] 🔴 **Structured data (schema.org)** — As a search engine, I get rich structured data so that schools can show enhanced results.
  - Screens: `SNDetail`
  - Spec: Phase 5 (SEO) · `CLAUDE.md`
  - Backend: `GET /api/schoolnet/schools/:id`
  - Gating/Auth: public
  - Accept: JSON-LD `EducationalOrganization`/`School` per profile (name, address via `PostalAddress`, telephone, url, geo if available, `aggregateRating` from moderated review summary). Validates in Rich Results Test. Only published data.

- [~] 🔴 **sitemap.xml** — As a search engine, I can discover every public school so that the directory is fully indexed.
  - Screens: n/a
  - Spec: Phase 5 · `SYSTEM.md §3.12`
  - Backend: `GET /api/schoolnet/schools` (paginate all verified+published)
  - Gating/Auth: public
  - Accept: `sitemap.ts` enumerates all verified+published school URLs + key static pages; `lastmod` from profile `updated_at`; regenerates with ISR cadence. Excludes drafts/unverified.

- [~] 🔴 **robots + indexability** — As the site owner, crawlers are guided correctly so that the right pages are indexed and authed/utility pages are not.
  - Screens: n/a
  - Spec: `CLAUDE.md`
  - Backend: n/a
  - Gating/Auth: public
  - Accept: `robots.ts` allows public directory/profiles, references sitemap; auth callback / API-proxy / pre-signed-upload routes `noindex`; no accidental `noindex` on profiles.

- [ ] **OG image generation** — As a visitor sharing, a branded preview image renders so that links are visually appealing.
  - Screens: `SNDetail`
  - Spec: Phase 5
  - Backend: profile photo/banner from `school_photos`/marketing
  - Gating/Auth: public
  - Accept: dynamic OG image (Verdant-branded, school name + badge + photo) via Next OG; falls back to a default cream/forest card when no photo.

- [ ] **Performance / Core Web Vitals** — As a visitor, pages load fast so that SEO ranking and UX are strong.
  - Screens: directory, `SNDetail`
  - Spec: BUILD.md §0
  - Backend: n/a
  - Gating/Auth: public
  - Accept: `next/image` for school/facility photos with sizing; fonts via `next/font` (no layout shift); good LCP/CLS on profile + directory; OSM iframe lazy-loaded.
