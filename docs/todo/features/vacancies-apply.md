# Feature — Vacancies & Apply

Public jobs board + gated application with CV upload via Supabase Storage pre-signed URL (PDF ≤5MB; server holds the key).

Spec: `SYSTEM.md §2.13` (`school_vacancies`), §2.16 (`vacancy_applications`, apply API), §3.11/§3.12, §9 · `DATA_SOURCES.md §7` · `UNWIRED_AUDIT.md` 🌐 Find a Vacancy + Auth + cross-cutting note 10 · Phase 5. Design ref: `schoolcity-extras.jsx → SNFindVacancy`, `SNApplyModal`; `sn-masonry.jsx → SNDetail` (jobs tab).

---

- [ ] 🔴 **Find a Vacancy board** — As a public visitor (job seeker), I can browse all open roles across schools so that I can find a job.
  - Screens: `schoolcity-extras.jsx → SNFindVacancy`
  - Spec: `SYSTEM.md §9` (public jobs board), §2.13 (`status='published'`)
  - Backend: vacancy board read (published only, across schools) — `GET /api/schoolcity/...` or aggregate of `GET /api/public/schools/:id/vacancies` (owned by schoolos-backend; published only)
  - Gating/Auth: public
  - Accept: list of published vacancies across all verified schools (title, school, department, type, deadline, summary); only `published` shown; links to the posting school's detail. (verify board endpoint against SYSTEM.md §3.11/§16)

- [ ] 🔴 **Vacancy board filters** — As a job seeker, I can filter vacancies so that I find relevant roles fast.
  - Screens: `SNFindVacancy` filters (dept / type / state)
  - Spec: `SYSTEM.md §9` ("filterable by dept/type/state/special needs") · `UNWIRED_AUDIT.md` cross-cutting note 2
  - Backend: vacancy board read with filter params
  - Gating/Auth: public
  - Accept: filters for department, type (Full-time/Part-time/Contract/Supply-Locum), state (and special-needs where applicable) re-query the API (not client-only); result count; empty state.

- [ ] 🔴 **View school from vacancy** — As a job seeker, I can open the hiring school's profile so that I can research before applying.
  - Screens: `SNFindVacancy` "View school" (`onGoToSchool`)
  - Spec: `UNWIRED_AUDIT.md` 🌐 Find a Vacancy ("View school → navigates to school detail ✓")
  - Backend: `GET /api/schoolcity/schools/:id`
  - Gating/Auth: public
  - Accept: "View school" navigates to `/schools/[id]` (Vacancies tab).

- [ ] 🔴 **Apply behind Google sign-in** — As a job seeker, I can apply to a vacancy after signing in so that my application is tied to my identity.
  - Screens: `schoolcity-extras.jsx → SNApplyModal` (opened from board + `SNDetail` jobs tab)
  - Spec: `SYSTEM.md §9` (Apply gates behind Google sign-in), §2.16 (`vacancy_applications`) · `UNWIRED_AUDIT.md` 🌐 Find a Vacancy
  - Backend: `POST /api/public/vacancies/:id/apply` (multipart) → `vacancy_applications`; 403 if not published (owned by schoolos-backend)
  - Gating/Auth: requires Google sign-in
  - Accept: Apply opens auth modal if signed out, then resumes; form captures name, email, phone, cover_note (all required per schema); applicant_id = signed-in `schoolcity_users.id`; submit posts multipart; success/error feedback; cannot apply to unpublished vacancy.

- [ ] 🔴 **CV upload via Supabase Storage pre-signed URL** — As an applicant, I can attach my CV so that the school can review it, securely.
  - Screens: `SNApplyModal` CV file input
  - Spec: `UNWIRED_AUDIT.md` 🌐 Find a Vacancy ("CV captured but NOT uploaded; needs pre-signed URL flow") + cross-cutting note 10 · `CLAUDE.md` (Supabase Storage, PDF ≤5MB, server holds key) · §2.16 (`cv_url`)
  - Backend: backend issues pre-signed upload URL → client PUTs CV → `cv_url` saved on application (owned by schoolos-backend; server gets storage key only)
  - Gating/Auth: requires Google sign-in
  - Accept: PDF-only, ≤5MB validated client-side; obtains backend-issued pre-signed URL; uploads directly to Supabase Storage (client never sees storage secret); resulting `cv_url` attached to the application; upload progress + error handling; rejects non-PDF / oversize before upload.

- [ ] 🔴 **Application confirmation** — As an applicant, I get confirmation so that I know my application was received.
  - Screens: `SNApplyModal` success state
  - Spec: `SYSTEM.md §2.16` (apply → notify school email+FCM)
  - Backend: `POST /api/public/vacancies/:id/apply` (backend notifies school)
  - Gating/Auth: requires Google sign-in
  - Accept: on success, modal shows confirmation; form resets; duplicate-submit guarded; notification to school is backend-side (this repo just shows success).

- [ ] **Vacancy detail / requirements view** — As a job seeker, I can read full role details so that I know if I qualify before applying.
  - Screens: `SNFindVacancy` row → detail · `SNDetail` jobs tab
  - Spec: `SYSTEM.md §2.13` (summary, requirements, deadline)
  - Backend: vacancy read (published)
  - Gating/Auth: public
  - Accept: full summary, requirements, type, deadline visible before Apply; deadline-passed/closed vacancies clearly marked and not applyable.
