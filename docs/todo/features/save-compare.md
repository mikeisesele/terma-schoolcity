# Feature — Save · Compare · Share

Heart/save (sign-in gated, synced to `parent_saved_schools`), share (Web Share API + clipboard), compare (floating bar, up to 3).

Spec: `SYSTEM.md §9`, §2.16 (`parent_saved_schools`), §2.16 API · `DATA_SOURCES.md §7` · `UNWIRED_AUDIT.md` 🌐 School cards / Auth · Phase 5/7. Design ref: `sn-masonry.jsx → SNCard` (heart/share/compare), `SchoolNetApp` (`toggleFav`, `toggleCompare`, `doToggleFav`); `schoolnet-extras.jsx → SNFavorites`, `SNCompareModal`, `SNCompareBar`.

---

- [ ] 🔴 **Save / unsave a school (heart)** — As a signed-in parent, I can save a school so that I can revisit it later.
  - Screens: `SNCard` ♥ heart, `SNDetail` Save · gated by `SNAuthModal`
  - Spec: `UNWIRED_AUDIT.md` 🌐 School cards ("production needs `POST /api/public/me/saved-schools`") · §2.16
  - Backend: `POST /api/public/me/saved-schools` `{ school_id }`, `DELETE /api/public/me/saved-schools/:id`
  - Gating/Auth: requires Google sign-in
  - Accept: heart toggles save via real API (replacing prototype localStorage); signed-out tap opens auth modal then resumes; optimistic UI with rollback on failure; heart reflects current saved state on cards + detail.

- [ ] 🔴 **Saved schools list** — As a signed-in parent, I can view my saved schools so that I can compare my shortlist.
  - Screens: `schoolnet-extras.jsx → SNFavorites`
  - Spec: `SYSTEM.md §2.16` (`GET /api/public/me/saved-schools`) · `UNWIRED_AUDIT.md` 🌐 Auth ("syncs to `parent_saved_schools`")
  - Backend: `GET /api/public/me/saved-schools` → saved school ids → hydrate via `GET /api/schoolnet/schools/:id`
  - Gating/Auth: requires Google sign-in
  - Accept: list/grid of saved schools fetched from server; unsave from list; empty state for none saved; selecting a card opens detail; survives reload + new device (server-synced, not localStorage).

- [ ] 🔴 **Saved-schools sync on sign-in** — As a parent, my saves are tied to my account so that they persist across devices.
  - Screens: `SchoolNetApp` (`signIn` / `doToggleFav`)
  - Spec: `UNWIRED_AUDIT.md` 🌐 Auth · cross-cutting note 11
  - Backend: `GET/POST/DELETE /api/public/me/saved-schools`
  - Gating/Auth: requires Google sign-in
  - Accept: on sign-in, saved set loads from server and becomes source of truth; no localStorage divergence; sign-out clears local cache.

- [ ] 🔴 **Share a school** — As any visitor, I can share a school link so that I can send it to family/friends.
  - Screens: `SNCard` ↗ Share, `SNDetail` Share (`navigator.share` / clipboard fallback)
  - Spec: `UNWIRED_AUDIT.md` 🌐 School cards ("Web Share API ✓; clipboard fallback ✓") · §9
  - Backend: none (client share of canonical URL)
  - Gating/Auth: public
  - Accept: uses Web Share API where available (title, tagline·city, canonical `/schools/[id]` URL); clipboard copy + toast fallback otherwise; shared URL is the indexable canonical (not a `?school=` query hack).

- [ ] 🔴 **Compare — add/remove (max 3)** — As any visitor, I can add up to 3 schools to compare so that I can evaluate them side by side.
  - Screens: `SNCard` + Compare, `SchoolNetApp → toggleCompare`
  - Spec: `UNWIRED_AUDIT.md` 🌐 School cards ("Compare → prototype state ✓; no server persistence needed") · §9
  - Backend: none (client-side only)
  - Gating/Auth: public
  - Accept: toggling Compare adds/removes a school; hard cap of 3 with feedback when exceeded; card reflects in-compare state; selection persists across navigation within session.

- [ ] 🔴 **Compare — floating bar** — As any visitor, I see a floating bar of my compare selection so that I can manage it and open the comparison.
  - Screens: `schoolnet-extras.jsx → SNCompareBar`
  - Spec: `SYSTEM.md §9` ("floating bar") · `UNWIRED_AUDIT.md` 🌐
  - Backend: none
  - Gating/Auth: public
  - Accept: bar appears when ≥1 school selected; shows mini chips with remove; Clear all; "Compare" opens the modal; hidden when empty.

- [ ] 🔴 **Compare — side-by-side modal** — As any visitor, I can view selected schools in a comparison table so that differences are obvious.
  - Screens: `schoolnet-extras.jsx → SNCompareModal`
  - Spec: `SYSTEM.md §9` ("side-by-side table up to 3 schools")
  - Backend: data already loaded from list/detail
  - Gating/Auth: public
  - Accept: table compares up to 3 schools across key attributes (fees, type, level, rating, facilities, boarding, vacancies/scholarship counts); remove a column; tap a column header → school detail; responsive on mobile.
