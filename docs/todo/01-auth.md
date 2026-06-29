# 01 — Auth (Google OAuth · schoolcity_users)

SchoolCity users are a **separate identity** (`schoolcity_users`, keyed by `google_sub`) used only for save + apply. They CANNOT access admin/parent portals. Browsing is anonymous.

Spec: `SYSTEM.md §2.16` (schema), `§3.1` (auth), `§9` (rules) · `UNWIRED_AUDIT.md` 🌐 SchoolCity → Auth · `DATA_SOURCES.md §7`. Design ref: `schoolcity-extras.jsx → SNAuthModal`, `sn-masonry.jsx → SchoolCityApp` (`signIn`/`signOut`).

---

- [ ] 🔴 **Google OAuth sign-in** — As a visitor, I can sign in with Google so that I can save schools and apply to vacancies.
  - Screens: `schoolcity-extras.jsx → SNAuthModal` (account picker; prototype is simulated)
  - Spec: `SYSTEM.md §3.1`/§2.16 · `UNWIRED_AUDIT.md` 🌐 Auth ("real Google OAuth 2.0 token exchange")
  - Backend: `POST /api/auth/schoolcity/google` `{ id_token }` → JWT (role `schoolcity_user`); upserts `schoolcity_users` by `google_sub` (owned by schoolos-backend)
  - Gating/Auth: public (the act of signing in)
  - Accept: real Google OAuth (Supabase Auth provider) replaces simulated accounts; id_token exchanged at backend; session JWT stored; user `{ name, email, avatar_url }` available to UI. No school-credential / self-signup path.

- [ ] 🔴 **Sign-in gate for protected actions** — As a visitor, when I save or apply I am prompted to sign in so that those actions are tied to my account.
  - Screens: `SNAuthModal` (with `reason` prop) opened from `SNCard` heart, `SNDetail` Save, `SNApplyModal`
  - Spec: `SYSTEM.md §9` (Save requires Google sign-in; Apply gates behind sign-in)
  - Backend: n/a (gate is client-side; backend also rejects unauthed writes)
  - Gating/Auth: requires Google sign-in
  - Accept: heart/save and vacancy-apply trigger auth modal when signed out, carrying a contextual `reason`; on success the original action resumes; enquiries/search/compare/share stay public.

- [ ] 🔴 **Session management** — As a signed-in user, my session persists so that I'm not re-prompted on every action/visit.
  - Screens: `SchoolCityApp` user slot in `SNNav`
  - Spec: `SYSTEM.md §3.1`
  - Backend: Supabase Auth session (refresh handled by SDK)
  - Gating/Auth: requires Google sign-in
  - Accept: session restored on reload; avatar/name in nav; token attached to authed API calls; expiry handled (silent refresh or re-prompt).

- [ ] 🔴 **Sign-out** — As a signed-in user, I can sign out so that my account is no longer active on a shared device.
  - Screens: `SchoolCityApp → signOut`; user menu in `SNNav`
  - Spec: `SYSTEM.md §9`
  - Backend: Supabase Auth signOut
  - Gating/Auth: requires Google sign-in
  - Accept: sign-out clears session + cached saved-schools; nav reverts to "Sign in"; protected UI re-gates.

- [ ] 🔴 **Identity isolation from admin/parent portals** — As the system, SchoolCity JWTs are confined so that a SchoolCity user can never reach admin/parent data.
  - Screens: n/a (architecture constraint)
  - Spec: `SYSTEM.md §2.16` ("separate from `users`"), §9 · `CLAUDE.md` rule 2
  - Backend: backend enforces role `schoolcity_user` cannot hit admin/parent endpoints (owned by schoolos-backend)
  - Gating/Auth: requires Google sign-in
  - Accept: this repo only ever calls `/api/public/*` and `/api/auth/schoolcity/*`; never requests admin/parent endpoints; documented that `schoolcity_users.id` ≠ `users.id`; no cross-portal links rendered.

- [ ] **Auth error / cancel handling** — As a visitor, if Google sign-in fails or I cancel, I get clear feedback so that I can retry without a broken state.
  - Screens: `SNAuthModal`
  - Spec: `UNWIRED_AUDIT.md` 🌐 Auth
  - Backend: `POST /api/auth/schoolcity/google` error responses
  - Gating/Auth: public
  - Accept: OAuth denial/cancel/network error shows recoverable message; modal stays open; pending protected action is dropped cleanly.
