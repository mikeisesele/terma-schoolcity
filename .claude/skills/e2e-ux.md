# e2e-ux

UX, design, and accessibility audit for a SchoolOS screen or flow. Answers one question: *"Can every person at a Nigerian school — admin, teacher, student, parent — use this clearly, comfortably, and correctly?"*

## This skill does NOT run product flows or read code
→ For live user simulation and data consistency, invoke `e2e-product`
→ For static code analysis, invoke `e2e-code`

---

## Trigger
```
e2e-ux [screen or feature]
```
Examples:
- `e2e-ux admin students screen`
- `e2e-ux teacher leave flow`
- `e2e-ux student portal feed`

---

## Environment & startup

### Codebase locations

| Repo | Path | What it is |
|---|---|---|
| Web portals | `/Users/admin/kidtrack-web` | Admin · Principal · Class Teacher · Subject Teacher · Student · Super Admin (React 18 + Vite + TS) |
| Landing page | `/Users/admin/schoolos-landing` | Next.js marketing site |
| SchoolCity | `/Users/admin/schoolcity-web` | SchoolCity public marketplace (Next.js) |

### Starting dev servers

Use `preview_start` — **never `Bash`** — with configs from `/Users/admin/kidtrack-web/.claude/launch.json`.

| Name | URL |
|---|---|
| `portal` | `http://localhost:5173` |
| `landing` | `http://localhost:3100` |
| `schoolcity` | `http://localhost:3000` |

### Sign-in flow

1. `preview_start("portal")` → navigate to `http://localhost:5173` (redirects to `/login`)
2. Credentials: fetch the Notion dev-credentials page — `https://app.notion.com/p/SchoolOS-Dev-Credentials-38aec5fb0523807fae97e555670023ac`
3. Key test accounts: Greenfield admin `admin@greenfield.edu.ng`, class teacher `GF-ST-022`, student `GREEN-4421-ST-001` — all password `SchoolOS2025!` (verify on Notion page first)

### Portal URLs after login

| Role | URL |
|---|---|
| Admin | `http://localhost:5173/app/dashboard` |
| Principal | `http://localhost:5173/app/pdash` |
| Class Teacher | `http://localhost:5173/app/classdash` |
| Subject Teacher | `http://localhost:5173/app/classdash` |
| Student | `http://localhost:5173/app/academics` |

### Viewport for mobile checks

```
preview_resize({ preset: "mobile" })   # 375 × 812
preview_resize({ preset: "desktop" })  # 1280 × 800
```

---

## Run every check below for the target screen(s)

---

### 1 — Copy and labels

**Button labels** — are they action-oriented and specific?
- "Submit leave request" not "Submit"
- "Approve and notify teacher" not "Approve"
- "Add student" not "Add"
- A button label should tell the user exactly what happens when they click it

**Empty state messages** — are they informative and encouraging?
- Must explain what the screen is for and what action creates the first item
- "No leave requests yet — staff will see a Request leave button in their portal." not "No data"
- Never just "No data" or "Nothing here"

**Error messages** — are they specific?
- "Leave dates overlap with an existing request" not "Something went wrong"
- "Invalid email format" not "Email is invalid"
- Server error messages should be surfaced verbatim, not replaced with a generic toast

**Form labels** — do they describe what format is expected?
- Date fields: clarify DD/MM/YYYY vs MM/DD/YYYY
- Phone fields: indicate Nigerian format (+234 or 080...)
- Any field with a constraint: make the constraint visible (e.g. "Max 500 characters")

**Truncation** — is anything truncated in a way that loses meaning? Long names, long titles, addresses — verify they either wrap gracefully or have a readable truncation (ellipsis with tooltip or expandable).

---

### 2 — Feedback and confirmation

**Destructive actions** — delete, reject, archive, overwrite — must have a confirmation step before executing. The confirmation must name the thing being deleted (not just "Are you sure?").

**Success feedback** — after a successful action, the user must know what happened and what comes next:
- Toast appears with a specific message
- The list or state visibly updates to reflect the change
- A silent list refresh with no toast is a UX bug

**Loading states** — async operations must show a loading indicator. A button that fires an API call must disable and show a spinner while pending — no double-submit.

**Empty-to-populated transition** — when data arrives after loading, it should replace the loading state cleanly with no layout jump.

---

### 3 — Form UX

Test each form:

- **Auto-focus:** the first field must receive focus when the form or modal opens. Verify with a snapshot — the first field should have focus.
- **Required fields:** must be marked (asterisk or "Required" label). Optional fields may be unlabelled.
- **Inline validation:** errors must appear inline next to the field, not only as a toast. A toast-only error forces the user to hunt for which field is wrong.
- **Enter to submit:** pressing Enter in the last field (or any single-field form) must submit.
- **Escape to dismiss:** pressing Escape must close modals and drawers without submitting.
- **Tab order:** Tab must move through fields in a logical top-to-bottom, left-to-right order.

---

### 4 — Verdant brand consistency

SchoolOS uses the **Verdant** design system. Verify every screen uses it correctly:

**Components** — use `WCard`, `WBtn`, `WBadge`, `WEmpty`, `WPageHead`, `WData`, `WTable`, `WSkeleton` consistently. Raw `<div>` styling where a component exists is a brand inconsistency. Flag it.

**Gold (`#B87D20`)** — accent only. Used for the primary CTA button, key numeric highlights, and step-completion indicators. Never used as a background fill, never used for secondary/tertiary actions, never overused so it loses its accent value.

**Forest (`#1A3D2C`)** — the sidebar and primary surface colour. Should not appear as a text colour on light backgrounds (contrast concern).

**Cream (`#FAF7F0`)** — the page background. Cards sit on cream, not white, unless intentionally elevated.

**Spacing** — generous. No cramped rows, no text walls. Cards have comfortable internal padding. List items have visible breathing room between them.

**Status chips** — `WBadge` tones must be consistent in meaning across screens:
- `forest` = active / approved / present
- `gold` = pending / in-progress / warning
- `rust` = rejected / absent / error
- `sky` = informational / neutral
- `ink` = draft / inactive
Flag any chip using a tone that contradicts this meaning, or any status rendered as raw text instead of a `WBadge`.

**Typography** — DM Sans for all UI text. Cormorant Garamond only for hero / section headings / prices. No other fonts.

---

### 5 — Mobile layout

Resize the viewport to 375px wide (`preview_resize preset: "mobile"` or Chrome DevTools).

- Does the layout reflow correctly? No horizontal overflow, no elements clipped outside the viewport.
- Are touch targets at least 44px tall? Buttons, list items, tab handles.
- Do modals and drawers still open, scroll, and close correctly at this width?
- Does the sidebar collapse or convert to a bottom nav / hamburger? If not, is the content area still usable?
- Take a screenshot and note any overflow or overlap.

---

### 6 — Discoverability

- Can a first-time user understand what this screen does within 5 seconds? If not, the page header or empty state needs a subtitle.
- Are any actions hidden behind icon-only buttons with no label or tooltip? Icon buttons must have visible labels or aria-labels — an icon alone is not discoverable.
- If a feature is gated behind a plan, is the gated state clear about what plan unlocks it and how to upgrade? A hidden/disabled state with no explanation is a dead end.

---

### 7 — Accessibility

**Keyboard navigation**
- Tab through every interactive element on the page. Verify the sequence is logical (top-to-bottom, left-to-right). Verify no interactive elements are unreachable via keyboard alone.
- Enter / Space must activate the focused button or link.

**Modal focus management**
- When a modal opens, focus must move into the modal (first field or close button). Verify with `document.activeElement`.
- Focus must be trapped inside the modal while it is open — Tab must not escape to background content.
- When the modal closes, focus must return to the element that triggered it.

**Icon-only buttons**
- Every button using an icon without visible text must have an `aria-label` or `title`. Query via:
  ```js
  Array.from(document.querySelectorAll('button')).filter(b => !b.textContent.trim() && !b.getAttribute('aria-label'))
  ```
  Any result is a bug — add `aria-label` inline.

**Form labels**
- Every `<input>`, `<select>`, and `<textarea>` must have an associated `<label>` via `for`/`id`, `aria-label`, or `aria-labelledby`. A `placeholder` alone is not a label.
- Query: `document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')` and check each has a linked label.

**Colour contrast**
- Body text on cream (`#FAF7F0`): must meet 4.5:1. DM Sans regular at 16px on cream passes — verify nothing breaks this.
- Gold (`#B87D20`) as text or icon on cream: near-fail (~3.8:1). Gold must not be used for body text. If used for a label or icon, escalate — it does not meet WCAG AA.
- White text on forest (`#1A3D2C`): passes — no action needed for the sidebar.

---

### Output format

After each check, one line:

```
✅ Copy      — All button labels specific; empty states informative with next-step CTAs
❌ Feedback  — Delete action on Fee Structure has no confirmation modal — fixed inline
✅ Form UX   — Auto-focus, Enter-to-submit, Escape-to-dismiss all work; inline validation present
❌ Brand     — "Export" button uses raw <div> instead of WBtn; gold used as background on status card — fixed
✅ Mobile    — 375px layout reflows cleanly; all touch targets ≥ 44px
❌ Discover  — Three icon-only buttons in Students list have no aria-label — fixed inline
✅ A11y kbd  — Tab order logical; Enter activates buttons; focus returns after modal close
❌ A11y form — Two inputs in Add Student form missing aria-label (parent phone, emergency contact) — fixed
✅ Contrast  — DM Sans body on cream passes 4.5:1; gold not used for body text
```

Final summary:
```
e2e-ux: [screen / feature]
Checks: 9 / 9
Issues found: N  Fixed inline: N  Spawned: N
[list each issue]
```
