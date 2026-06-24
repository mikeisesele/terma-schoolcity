# Feature — Directory & Search

Home/dashboard discovery sections + Find a school filters + pagination. The primary public surface.

Spec: `SYSTEM.md §9` (Home/Find pages), §3.12 (`GET /api/schoolnet/schools`) · `DATA_SOURCES.md §7` · `UNWIRED_AUDIT.md` 🌐 Home · Phase 5. Design ref: `sn-masonry.jsx → SNHome`, `SNFindSchool`, `SNCard`, `SHead`, `CAROUSEL`.

---

- [ ] 🔴 **Home hero carousel** — As a public visitor, I see featured schools in a rotating carousel so that I'm drawn into the directory.
  - Screens: `sn-masonry.jsx → SNHome` (`CAROUSEL`, auto-advance ~4.5s)
  - Spec: `SYSTEM.md §9` (Home/Dashboard) · Phase 5
  - Backend: `GET /api/schoolnet/schools` (featured = `schoolnet_verifications.badge_level` featured/premium) (verified+published only)
  - Gating/Auth: public
  - Accept: auto-advancing carousel of featured schools (Cormorant headings, cream base), pauses on hover, accessible controls; cards link to `/schools/[id]`. (verify featured selection against SYSTEM.md §9)

- [~] 🔴 **Highly-rated strip** — As a public visitor, I can browse top-rated schools so that I quickly find quality options.
  - Screens: `SNHome` highly-rated section · `SHead`, `SNCard`, `Stars`
  - Spec: `SYSTEM.md §9` (highly-rated strip) · Phase 5
  - Backend: `GET /api/schoolnet/schools` (sort by rating)
  - Gating/Auth: public
  - Accept: horizontal strip of high-rating schools with star ratings; "See more →" navigates to Find a school pre-sorted by rating.

- [~] 🔴 **All Schools section** — As a public visitor, I can see the full directory so that I can browse everything available.
  - Screens: `SNHome` All Schools · `SNCard`
  - Spec: `SYSTEM.md §9` · Phase 5
  - Backend: `GET /api/schoolnet/schools?page=&limit=`
  - Gating/Auth: public
  - Accept: masonry grid of verified+published schools; each card shows photo, name, city, badge, rating, fee range, heart/share/compare; paginated via See-more.

- [~] 🔴 **Scholarships section** — As a public visitor, I can find schools offering scholarships so that affordability is visible up front.
  - Screens: `SNHome` Scholarships section
  - Spec: `SYSTEM.md §9` · §2.12 (`sponsorship_opportunities WHERE status='open'`)
  - Backend: `GET /api/schoolnet/schools` filtered to schools with open scholarships
  - Gating/Auth: public
  - Accept: section lists schools with open scholarship/bursary opportunities; "See more →" → filtered Find view; only `open` opportunities surfaced.

- [~] 🔴 **Hiring Now section** — As a public visitor (job seeker), I can find schools with open vacancies so that I can apply.
  - Screens: `SNHome` Hiring Now section
  - Spec: `SYSTEM.md §9` · §2.13 (`status='published'`)
  - Backend: `GET /api/schoolnet/schools` filtered to schools with published vacancies
  - Gating/Auth: public
  - Accept: section lists schools currently hiring; "See more →" routes to the Find a vacancy board (see `vacancies-apply.md`); only `published` vacancies counted.

- [~] 🔴 **Special Needs section** — As a public visitor (parent of a child with special needs), I can find inclusive schools so that I find a suitable match.
  - Screens: `SNHome` Special Needs section
  - Spec: `SYSTEM.md §9` · §3.12 (`special_needs` query param)
  - Backend: `GET /api/schoolnet/schools?special_needs=true`
  - Gating/Auth: public
  - Accept: section of schools flagged special-needs-friendly; "See more →" → Find filtered by special needs. (verify flag source against SYSTEM.md §2.10/§16)

- [~] 🔴 **KidTrack marketing section on home** — As a parent who found a school, I learn KidTrack benefits so that I'm primed to ask my school to adopt it.
  - Screens: `SNHome` Kidtrack marketing section
  - Spec: `SYSTEM.md §9` ("Kidtrack marketing section", 5 feature tiles, no Direct Messaging)
  - Backend: none (static content)
  - Gating/Auth: public
  - Accept: 5 tiles — Real-time bus tracking, Safety alerts, Results & report cards, Pay fees easily, Attendance & calendar; CTAs "Tell your school about KidTrack" + "Learn more". No "List your school" CTA.

- [ ] 🔴 **Find a school — filters** — As a public visitor, I can filter schools so that I narrow to ones matching my needs.
  - Screens: `sn-masonry.jsx → SNFindSchool` (sidebar `Chip` filters)
  - Spec: `SYSTEM.md §9` (filters: level, type, max fee), §3.12 query params
  - Backend: `GET /api/schoolnet/schools?level=&type=&max_fee=&special_needs=&state=`
  - Gating/Auth: public
  - Accept: sidebar filters for level, school type, max fee (and state/special-needs where applicable); selecting filters re-queries the API (NOT client-only); active filters reflected in URL for shareable/indexable filtered views; result count shown.

- [ ] 🔴 **Find a school — free-text search** — As a public visitor, I can search by name/keyword so that I jump straight to a known school.
  - Screens: `SNFindSchool` search input (+ `SNHome` search)
  - Spec: `SYSTEM.md §3.12` (`q` param) · `UNWIRED_AUDIT.md` cross-cutting note 2
  - Backend: `GET /api/schoolnet/schools?q=`
  - Gating/Auth: public
  - Accept: text query hits the API `q` param (server-side search, not local filter); debounced; combines with active filters; empty-state when no matches.

- [ ] 🔴 **Pagination — "See more"** — As a public visitor, I can load more results so that I can browse the full directory without one giant page.
  - Screens: `SNHome` / `SNFindSchool` "See more →"
  - Spec: `UNWIRED_AUDIT.md` 🌐 Home ("See more → needs paginated `GET /api/public/schools`") · §3.12 (`page`, `limit`)
  - Backend: `GET /api/schoolnet/schools?page=&limit=`
  - Gating/Auth: public
  - Accept: See-more performs real paginated fetch (replacing prototype toast); appends results / advances page; disables when no more pages; total/loaded count shown. SSR-friendly first page for SEO.

- [~] **Results grid empty + loading states** — As a visitor, I get clear feedback when results are loading or absent so that the page never looks broken.
  - Screens: `SNFindSchool` results grid
  - Spec: Phase 5
  - Backend: `GET /api/schoolnet/schools`
  - Gating/Auth: public
  - Accept: skeleton cards while loading; friendly empty state with a clear-filters action; error state with retry.
