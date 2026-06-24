# Feature — Growth: "Ask your school" (ENH-2)

Persistent bottom bar on every School Net page: *"Is your school on KidTrack? / Ask them to join"*. Parent-led growth loop seeded from the public web — NOT a public self-listing.

Spec: `CONTINUATION.md` ENH-2 · `SYSTEM.md §9` (KidTrack marketing section), §19 G (parent-led onboarding lead) · Phase 10 Growth (`389ec5fb0523815cbaafe78689977d52`). Design ref: `schoolnet-app.jsx` ENH-2 widget (`Is your school on KidTrack?` + `Ask them to join →`).

> **Rule:** This is **lead capture for KidTrack**, not a public directory listing. It must never create a public School Net entry. The discarded `SNListSchool` standalone listing form (`sn-masonry.jsx`, flagged HIGH in SYSTEM.md §19 G) must be removed or repurposed into this lead-capture flow only.

---

- [ ] 🔴 **Persistent "Ask your school" bottom bar** — As a parent browsing School Net, I'm prompted to nudge my school to join so that the growth loop runs from the public web.
  - Screens: `schoolnet-app.jsx` ENH-2 bar ("Is your school on KidTrack?", school-name input, "Ask them to join →")
  - Spec: `CONTINUATION.md` ENH-2 · Phase 10 Growth
  - Backend: lead-capture endpoint → warm lead to KidTrack (owned by kidtrack-backend) — submitting school name notifies KidTrack growth/admin pipeline
  - Gating/Auth: public
  - Accept: persistent bottom bar on every School Net page (Verdant styling, dismissible per session); school-name input + "Ask them to join" submits a real lead (replacing prototype confirmation-toast-only); success confirmation; no public listing is created. (verify lead endpoint against SYSTEM.md §19 G / Phase 10)

- [ ] 🔴 **Remove / repurpose public self-listing** — As the product, there is no public "list your school" so that schools only appear via KidTrack onboarding.
  - Screens: `sn-masonry.jsx → SNListSchool` (discarded standalone listing form), nav
  - Spec: `SYSTEM.md §9` ("List your school removed from nav"), §19 G (HIGH: should be KidTrack lead capture only) · `UNWIRED_AUDIT.md` v9.1 ("List your school removed")
  - Backend: none (or KidTrack lead capture only)
  - Gating/Auth: public
  - Accept: no "List your school" in nav or anywhere; `SNListSchool` is removed or rebuilt purely as the ENH-2 lead-capture flow; no path creates a public School Net entry.

- [ ] **"Tell your school about KidTrack" CTA** — As a parent who found a school, I can encourage adoption so that I get KidTrack features at that school.
  - Screens: `SNHome` / `SNDetail` KidTrack marketing section ("Tell your school about KidTrack" / "Learn more")
  - Spec: `SYSTEM.md §9` (Kidtrack marketing section) · Phase 10
  - Backend: shares the ENH-2 lead-capture endpoint where it submits a school
  - Gating/Auth: public
  - Accept: marketing CTAs link to the Ask-your-school flow / a KidTrack learn-more page; consistent messaging with the persistent bar; no self-listing.

- [ ] **Growth analytics events** — As the growth team, key School Net actions are tracked so that we can measure the parent-led loop.
  - Screens: bar submit, marketing CTA clicks, save, enquire, apply, share
  - Spec: Phase 10 Growth · prompt: `analytics_events`
  - Backend: analytics ingestion (owned by kidtrack-backend) — `analytics_events` (verify table/endpoint against Phase 10)
  - Gating/Auth: public
  - Accept: emits analytics events for ask-your-school submit, marketing CTA click, save, share, enquiry submit, vacancy apply (with non-PII context); events reach the backend analytics pipeline. (verify `analytics_events` schema/endpoint against Phase 10 — not present in SYSTEM.md, confirm before building)

- [ ] **Dismiss / session behaviour** — As a visitor, I can dismiss the bar so that it isn't intrusive, while still supporting the growth goal.
  - Screens: ENH-2 bar
  - Spec: `CONTINUATION.md` ENH-2
  - Backend: none
  - Gating/Auth: public
  - Accept: bar dismissible; stays dismissed for the session; reappears appropriately (e.g. next session); never blocks core content/CTAs.
