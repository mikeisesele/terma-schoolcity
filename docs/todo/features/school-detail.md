# Feature — School Detail

The SSR school profile with tabs. Must be Google-indexable (see `seo-ssr.md`).

Spec: `SYSTEM.md §9` (School detail tabs), §3.12 (`GET /api/schoolnet/schools/:id`), §2.10/§2.13/§2.14 · `DATA_SOURCES.md §7` · `UNWIRED_AUDIT.md` 🌐 School detail · Phase 5. Design ref: `sn-masonry.jsx → SNDetail` (tabs: overview/jobs/scholarships/map; facilityList; reviews modal; enquire modal).

---

- [ ] 🔴 **Profile header + verified badge** — As a public visitor, I see a school's identity and trust signal so that I can assess it at a glance.
  - Screens: `SNDetail` header (`SNNav` back, badge, share)
  - Spec: `SYSTEM.md §9`, §2.14 (`schoolnet_verifications.badge_level`)
  - Backend: `GET /api/schoolnet/schools/:id` (verified+published only)
  - Gating/Auth: public
  - Accept: banner, name (Cormorant), city/state, tagline, rating stars, verified badge (`standard|featured|premium`) display-only; Save + Share + Compare actions; unverified/draft id → 404.

- [ ] 🔴 **About / Overview tab** — As a public visitor, I read a school's story and key facts so that I understand its fit.
  - Screens: `SNDetail` `overview` tab
  - Spec: `SYSTEM.md §2.10` (`school_marketing_profiles`: intro_text, year_established, capacity, school_type, gender_policy, boarding, mission_type, fee discounts), §9
  - Backend: `GET /api/schoolnet/schools/:id` → marketing profile
  - Gating/Auth: public
  - Accept: about text, year established, capacity, type/gender/boarding/mission, fee range + discount flags (installments/sibling/merit/needs/early), achievements (WAEC results, awards, affiliations from `achievements` JSONB). All SSR for indexability.

- [ ] 🔴 **Facilities tab — photo grid** — As a public visitor, I browse real facility photos so that I can judge the campus.
  - Screens: `SNDetail` Facilities · `facilityList` tiles → photo modal (`facilityModal`)
  - Spec: `SYSTEM.md §2.10` (`school_photos`: category, url, sort_order) · `UNWIRED_AUDIT.md` 🌐 Facilities ("replace gradient placeholder with real `school_photos`")
  - Backend: `GET /api/schoolnet/schools/:id` → `school_photos` (Supabase Storage URLs)
  - Gating/Auth: public
  - Accept: facility tiles grouped by `category`; tapping a tile opens a photo grid/lightbox of real `school_photos` (replacing prototype gradient placeholders); `next/image`; only categories with photos shown.

- [ ] 🔴 **Vacancies tab** — As a public visitor (job seeker), I see a school's open roles so that I can apply.
  - Screens: `SNDetail` `jobs` tab (`Vacancies (N)`)
  - Spec: `SYSTEM.md §2.13` (`status='published'`), §3.11 (`GET /api/public/schools/:id/vacancies`), §9
  - Backend: `GET /api/public/schools/:school_id/vacancies` (published only)
  - Gating/Auth: public to view; Apply requires Google sign-in (see `vacancies-apply.md`)
  - Accept: list of published vacancies (title, department, type, deadline, summary, requirements); Apply opens `SNApplyModal`; drafts/closed never shown.

- [ ] 🔴 **Scholarships tab** — As a public visitor (parent), I see scholarship/bursary opportunities so that I can assess affordability.
  - Screens: `SNDetail` `scholarships` tab (`Scholarships (N)`)
  - Spec: `SYSTEM.md §2.12` (`sponsorship_opportunities WHERE status='open'`), §9
  - Backend: `GET /api/schoolnet/schools/:id` → open opportunities
  - Gating/Auth: public (read only — applications happen in the Student Portal, not here)
  - Accept: cards with title, type (Scholarship/Bursary/Award), provider, value, slots/remaining, criteria, deadline, covers/eligibility; only `open` shown. No public "apply" (student-portal-only); Infrastructure type excluded from applicant flows. (verify against SYSTEM.md §2.12)

- [ ] 🔴 **Map tab — OpenStreetMap** — As a public visitor, I see the school's location so that I can judge proximity.
  - Screens: `SNDetail` `map` tab
  - Spec: `SYSTEM.md §9` (Map = OpenStreetMap) · `CLAUDE.md` (OSM iframe, no API key)
  - Backend: `GET /api/schoolnet/schools/:id` → address/coords (from `schools`)
  - Gating/Auth: public
  - Accept: OpenStreetMap `<iframe>` embed centered on the school (no Mapbox/Google, no API key); marker/pin; address text; lazy-loaded; graceful fallback (address-only) if coords missing.

- [ ] 🔴 **Reviews entry point** — As a public visitor, I can open moderated parent reviews so that I trust the listing.
  - Screens: `SNDetail` review count → reviews modal (`reviewsOpen`)
  - Spec: `SYSTEM.md §9` (Reviews from Parent App) · see `reviews.md`
  - Backend: reviews read endpoint (moderated, parent-app sourced)
  - Gating/Auth: public
  - Accept: rating summary + count clickable; opens reviews modal (detail in `reviews.md`). Read-only.

- [ ] 🔴 **Enquire Now entry point** — As a public visitor (parent), I can open the enquiry form so that I can contact the school.
  - Screens: `SNDetail` Enquire Now (`enquireOpen`)
  - Spec: see `enquiries.md` · `SYSTEM.md §3.12` (`POST /api/schoolnet/enquire`)
  - Backend: `POST /api/schoolnet/enquire`
  - Gating/Auth: public
  - Accept: Enquire Now button opens enquiry modal (full behaviour in `enquiries.md`).

- [ ] 🔴 **KidTrack marketing CTA on profile** — As a parent viewing a school, I'm prompted to encourage KidTrack adoption so that the growth loop is seeded.
  - Screens: `SNDetail` KidTrack section
  - Spec: `SYSTEM.md §9` (Kidtrack marketing section) · `CONTINUATION.md` ENH-2
  - Backend: none (static) — growth bar wired in `growth-ask-your-school.md`
  - Gating/Auth: public
  - Accept: profile shows KidTrack benefit CTA ("Tell your school about KidTrack" / "Learn more"); no public self-listing. Aligns with the persistent Ask-your-school bar.

- [ ] **Tab deep-linking** — As a visitor, I can link directly to a tab so that shares land on the right content (and tabs are crawlable).
  - Screens: `SNDetail` tabs
  - Spec: Phase 5 · `seo-ssr.md`
  - Backend: n/a
  - Gating/Auth: public
  - Accept: active tab reflected in URL (hash/segment); direct load opens that tab; primary content SSR-rendered regardless of tab for SEO.
