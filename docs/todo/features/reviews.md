# Feature — Reviews (read-only)

Read moderated reviews sourced from the SchoolOS Parent App. This repo **reads** only — no review authoring here. Respect anonymity.

Spec: `SYSTEM.md §9` (Reviews from Parent App; `school_net_reviews` future, currently parent-app feedback), §3.12 · `UNWIRED_AUDIT.md` 🌐 School detail → Reviews + Parent App School hub ("Rate & review → `POST /api/schools/:id/reviews` + moderation queue") · Phase 5. Design ref: `sn-masonry.jsx → SNDetail` (`reviewsOpen`, `Stars`, review count).

> **Source-of-truth note:** Reviews are authored in the Parent App by a parent with an enrolled child (validated via `student_parents`) and pass a **moderation queue** before appearing publicly. The SchoolOS team owns submission + moderation; SchoolCity only renders approved reviews.

---

- [~] 🔴 **Rating summary on profile** — As a public visitor, I see a school's aggregate rating so that I can gauge reputation at a glance.
  - Screens: `SNDetail` header rating + review count · `Stars`
  - Spec: `SYSTEM.md §9` · `seo-ssr.md` (feeds schema.org `aggregateRating`)
  - Backend: `GET /api/schoolcity/schools/:id` → rating summary (avg + count, approved reviews only)
  - Gating/Auth: public
  - Accept: average stars + total approved-review count on profile; SSR-rendered for SEO; zero-state ("No reviews yet") when none.

- [~] 🔴 **Reviews modal — read list** — As a public visitor, I can read individual parent reviews so that I understand others' experiences.
  - Screens: `SNDetail` review count → reviews modal (`setRO`)
  - Spec: `SYSTEM.md §9` (star breakdown + parent reviews) · `UNWIRED_AUDIT.md` 🌐 Reviews ("reviews are mock data; production reads from `school_reviews`/parent-app submissions")
  - Backend: reviews read endpoint (approved + moderated only; parent-app sourced) (owned by schoolos-backend)
  - Gating/Auth: public
  - Accept: modal lists approved reviews (stars, text, date); replaces prototype mock data with real fetch; star-distribution breakdown; pagination/scroll for many; only moderated/approved shown.

- [~] 🔴 **Anonymity handling** — As a reviewing parent, my identity is protected so that I can give honest feedback safely.
  - Screens: `SNDetail` reviews modal
  - Spec: `SYSTEM.md §9` · `CLAUDE.md` rule 5 (hide name, never expose internal `student_id`)
  - Backend: reviews endpoint returns display-safe fields only
  - Gating/Auth: public
  - Accept: anonymous reviews show no name (e.g. "Verified parent"); internal `student_id`/parent identity never sent to the client or rendered; named reviews only show what the parent consented to. (verify anonymity flag against SYSTEM.md / parent-app review schema)

- [~] **No public review authoring** — As the system, I prevent review submission on SchoolCity so that the moderated, enrolled-parent-only rule holds.
  - Screens: `SNDetail` reviews modal (read-only)
  - Spec: `SYSTEM.md §9` · `CLAUDE.md` rule 5
  - Backend: none (authoring lives in Parent App)
  - Gating/Auth: public
  - Accept: no review form/POST anywhere in this repo; any "rate this school" affordance routes to a "reviews come from SchoolOS parents" explainer, not a submission form.

- [ ] **Reviews empty / loading / error states** — As a visitor, I get clear states so that an empty or failed reviews fetch doesn't look broken.
  - Screens: `SNDetail` reviews modal
  - Spec: Phase 5
  - Backend: reviews read endpoint
  - Gating/Auth: public
  - Accept: skeleton while loading; friendly empty state; retry on error.
