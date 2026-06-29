# Feature — Enquiries

Enquire Now modal → public enquire endpoint → SMS + email to the school. Both phone (E.164) AND email are required.

Spec: `SYSTEM.md §2.10` (`school_enquiries`, both phone+email required), §3.8 (`POST /api/enquiries`), §3.12 (`POST /api/schoolcity/enquire`), §2.14 (`source='schoolcity'`) · `DATA_SOURCES.md §7` · `UNWIRED_AUDIT.md` 🌐 School detail → Enquire Now · Phase 5. Design ref: `sn-masonry.jsx → SNDetail` (`enquireOpen`, `form {name, phone, email, message}`, `sent`).

---

- [ ] 🔴 **Enquire Now modal** — As a public visitor (parent), I can submit an enquiry to a school so that I can start a conversation about enrolling.
  - Screens: `sn-masonry.jsx → SNDetail` Enquire Now modal (`setEnqOpen`, `setF`)
  - Spec: `SYSTEM.md §3.12` (`POST /api/schoolcity/enquire`), §2.10 · `UNWIRED_AUDIT.md` 🌐 ("Submit enquiry → toast only; needs `POST /api/public/schools/:id/enquire`")
  - Backend: `POST /api/schoolcity/enquire` `{ school_id, parent_name, phone, email, children_count, message }` → `school_enquiries` (source `schoolcity`); backend sends Termii SMS + SendGrid email to school (owned by schoolos-backend)
  - Gating/Auth: public
  - Accept: modal with name, phone, email, message (and children_count if present); real POST replaces prototype toast-only; success + error states; `source=schoolcity` recorded server-side. (verify children_count field presence against SYSTEM.md §2.10 vs the prototype form)

- [ ] 🔴 **Required phone + email validation** — As the system, I require both contact channels so that the school can reply by SMS and email.
  - Screens: `SNDetail` enquiry form
  - Spec: `SYSTEM.md §2.10` ("Both phone AND email are required"), enquiry constraint
  - Backend: `POST /api/schoolcity/enquire` (server also validates)
  - Gating/Auth: public
  - Accept: client blocks submit unless phone AND email present; phone validated/normalised to **E.164**; email format validated; clear inline errors; server is the final authority.

- [ ] 🔴 **Enquiry submission success** — As a parent, I get confirmation so that I know the school received my enquiry.
  - Screens: `SNDetail` (`sent` state)
  - Spec: `SYSTEM.md §3.8` (stores record + confirmation SMS to parent)
  - Backend: `POST /api/schoolcity/enquire`
  - Gating/Auth: public
  - Accept: on success, success state shown, form cleared, modal closeable; backend handles confirmation SMS to parent + delivery to school inbox (this repo shows success only); duplicate-submit guarded.

- [ ] **Enquiry error handling** — As a parent, if my enquiry fails I can retry so that I'm not silently lost.
  - Screens: `SNDetail` enquiry modal
  - Spec: `UNWIRED_AUDIT.md` cross-cutting note 1
  - Backend: `POST /api/schoolcity/enquire` error responses
  - Gating/Auth: public
  - Accept: network/validation errors surfaced without clearing entered data; retry possible; no false success toast.
