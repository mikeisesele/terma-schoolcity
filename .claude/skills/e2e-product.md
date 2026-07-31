# e2e-product

Live user simulation audit. You are a real school user — not a developer. You open the app, click everything on every screen, create data through the UI, then switch accounts and prove the data arrived for the downstream role. Bugs get fixed immediately. The audit ends with a clean, committed app.

## This skill does NOT
- Read source code or architecture → use `e2e-code`
- Audit UX copy, design, or accessibility → use `e2e-ux`
- Check PWA / offline behaviour → use `e2e-pwa`

---

## Trigger
```
e2e-product [scope]
```
Examples:
- `e2e-product admin portal`
- `e2e-product staff leave flow`
- `e2e-product student results`
- `e2e-product fee payment`

If no scope is given, ask which screens or flow to audit before starting.

### Scoping rule: one nav section at a time

When scope names a whole portal (e.g. `admin portal`) audit every section but expect it to span multiple sessions — each section is roughly one context window. The correct default for long portals is to name the section explicitly:

| Invoke as | Covers |
|---|---|
| `e2e-product admin HOME` | Dashboard, Inbox, Messages, Announcements, Calendar |
| `e2e-product admin PEOPLE` | Students, Staff, Leave, Attendance, Drivers, Parents, Vacancies |
| `e2e-product admin ACADEMICS` | Results, Timetable, CBT |
| `e2e-product admin TRANSPORT` | Transport |
| `e2e-product admin FINANCE` | Fee structure, Financials, Inventory |
| `e2e-product admin GROWTH` | Marketing, Impact report, Referrals |
| `e2e-product admin SETTINGS` | School settings, Subscription |

Auditing one section per session keeps every screen at full depth. Auditing the whole portal in one session forces shortcuts — that is what degrades quality.

---

## Environment & startup

### Codebase locations

| Repo | Path | What it is |
|---|---|---|
| Web portals | `/Users/admin/kidtrack-web` | Admin · Principal · Class Teacher · Subject Teacher · Student · Super Admin (React 18 + Vite + TS) |
| Landing page | `/Users/admin/schoolos-landing` | Next.js marketing site |
| SchoolCity | `/Users/admin/schoolcity-web` | SchoolCity public marketplace (Next.js) |
| Backend | `/Users/admin/kidtrack-backend` | Supabase Edge Functions, schema, RLS — no local server; hosted at `dpjcffgkrdhtijeyefbn.supabase.co` |
| Mobile | `/Users/admin/AndroidStudioProjects/Vela` | Compose Multiplatform — not used in web e2e audits |

### Starting dev servers

Use `preview_start` with the named configs below — **never `Bash` to start servers**. The configs are in `/Users/admin/kidtrack-web/.claude/launch.json`.

| Name | Command | URL |
|---|---|---|
| `portal` | `npm run dev` in `/Users/admin/kidtrack-web` | `http://localhost:5173` |
| `landing` | `npm run dev` in `/Users/admin/schoolos-landing` | `http://localhost:3100` |
| `schoolcity` | `npm run dev` in `/Users/admin/schoolcity-web` | `http://localhost:3000` |

For most portal audits only `portal` is needed. Start `schoolcity` only when auditing vacancy / SchoolCity cross-account flows.

### Sign-in flow

1. `preview_start("portal")` → navigate to `http://localhost:5173`
2. The app redirects to `/login` if not authenticated
3. Enter email + password from the Notion credentials page (see "Test credentials" below — always fetch it fresh)
4. Submit → app routes to the role's home screen based on the JWT
5. To switch roles: sign out via the avatar menu → confirm redirect to `/login` → sign in with the other account

### Portal URLs after login

| Role | Landing URL |
|---|---|
| Admin | `http://localhost:5173/app/dashboard` |
| Principal / School Head | `http://localhost:5173/app/pdash` |
| Class Teacher | `http://localhost:5173/app/classdash` |
| Subject Teacher | `http://localhost:5173/app/classdash` |
| Student | `http://localhost:5173/app/academics` |
| Super Admin | `http://localhost:5173/app/onboard` |

---

## Test credentials

All dev/test account credentials are in Notion:
https://app.notion.com/p/SchoolOS-Dev-Credentials-38aec5fb0523807fae97e555670023ac

Fetch this page at the start of every audit before signing in. It is the single source of truth for emails, passwords, and role assignments across all school tenants.

**If login fails:** re-fetch the credentials page to confirm current values. If the account still fails after confirming, stop and report `[BLOCKED: credential failure — role X at school Y]` — do not guess, retry blindly, or proceed with a different account.

---

## Browser tools

**Always prefer the Chrome plugin** (`mcp__claude-in-chrome__*`) — it operates at real window width. Fall back to `preview_*` only when no Chrome browser is connected.

- Check: `mcp__claude-in-chrome__list_connected_browsers`
- If connected → use Chrome tools throughout
- If not connected → use `preview_*`, note the narrower viewport

**Sign-out with Chrome active:** use `mcp__claude-in-chrome__find` to locate the sign-out button, click via `mcp__claude-in-chrome__javascript_tool`. Do NOT use `preview_eval` for sign-out when Chrome is connected. Confirm redirect to `/login` before proceeding.

---

## The audit loop

This is the complete protocol. Run it for every screen, in order, before moving on.

---

### Step 1 — Inventory the screen

Take a snapshot (`read_page` or `preview_snapshot`). List every interactive control visible:

- Tabs (names)
- Buttons (labels)
- Filters, chips, toggles
- Form fields
- Pagination controls
- List items (click for detail)

This is your checklist for steps 2–3.

---

### Step 2 — Click everything

Work through every item in your inventory. No skipping.

**Tabs** — click each one. Verify it renders without crash, blank page, or console error. If the tab is empty, verify the empty state renders correctly (no spinner forever, no uncaught error).

**Buttons** — click every button. Note what happens: modal opens, navigation triggers, action fires, confirmation appears. If a button is disabled, note why — a button that is always disabled or disabled for the wrong role is a bug.

**Filters / chips / toggles** — activate each one. Verify the list or state visibly updates. Deactivate. Verify it reverts.

**Modals and drawers** — open each one. Interact with its contents. Close via the X, via Cancel, and via Escape. Verify the modal closes correctly each way and focus returns to the page.

**Forms** — for every form:
1. Submit empty → verify required field errors appear (not just a toast, inline errors)
2. Submit invalid data (wrong format, out-of-range) → verify validation catches it
3. Submit valid data → verify success: toast appears, list updates, modal closes

**List items** — if a list has records, click one to open its detail or drawer. Inside the detail: click Edit, verify the edit form pre-fills correctly. Verify Delete exists (or confirm its absence is intentional).

**Pagination** — if present, go to page 2, verify different data, go back to page 1, verify correct data.

---

### Step 3 — Health check

After completing step 2 on a screen:

- **Console:** zero errors expected. Any JS error is a bug — investigate and fix before continuing.
- **Network:** any 4xx or 5xx is a bug — read the response body, identify the cause, fix before continuing.

---

### Step 4 — Cross-account check (MANDATORY — cannot be skipped)

After any successful form submission or action that creates or changes data for another role, you **MUST** sign out and verify from the receiving role's perspective before moving to the next screen. This is the most important confirmation in the audit. Checking the mutation and hooks alone is not sufficient — you must log in as the other user and see the effect with your own eyes.

> **"Does any other role need to see or act on what was just created?"**

**If yes** (this is the answer most of the time — treat it as yes by default):

1. Sign out of the current account — confirm redirect to `/login`
2. Sign in as the downstream role (using credentials from the Notion page)
3. Navigate to where the effect should appear
4. Verify the data is present, correctly displayed, and actionable
5. Check the notification bell — if this action should have triggered a notification, a missing badge is a bug
6. Check console on the downstream view — no errors
7. **If the data is absent or wrong: STOP. This is a blocking bug. Fix it before continuing.** Investigate (RLS, cache invalidation, status mapping, hook filters), fix, reload, re-run Account A's action, re-verify Account B sees the correct result. Only then return to Account A and continue.
8. Sign back in as the original role. Continue to the next screen.

**If no** (the mutation is provably self-contained — e.g. updating your own profile photo, changing a local display preference): note N/A and move on. Be honest — most mutations affect at least one other role.

**Which role to switch to and what to verify:**

The table below lists common cases as examples — it is **not exhaustive**. For any action not listed here, ask: *"Who in the system would see or act on this data?"* Then go be that person. The table is a thinking aid, not a permission slip to skip anything not mentioned.

| Action on current screen | Switch to | What to verify |
|---|---|---|
| Admin adds a student | Student portal | Student can log in, dashboard visible, profile data correct |
| Admin posts announcement | Student portal + parent app | Announcement visible in feed |
| Admin records fee payment | Parent portal | Payment appears in fee/payment history |
| Admin adds staff member | Staff portal (correct role) | Staff can log in, dashboard visible, class/subject assignment correct |
| Admin approves / enters results | Student portal | Results and report card accessible and correct |
| Admin assigns driver to route | Parent pickup screen | Route and driver name visible |
| Admin uploads / edits timetable for Class X | Class teacher portal (Class X) | Timetable shows updated slots exactly |
| Admin uploads / edits timetable for Class X | Class teacher portal (Class Y) | Class Y timetable is **unchanged** — verify no cross-contamination |
| Admin uploads / edits timetable for Class X | Student portal (student in Class X) | Student timetable reflects the change |
| Admin creates or updates fee structure | Parent portal | Fee breakdown visible and matches what admin set |
| Admin approves leave | Teacher portal | Status shows Approved, not still Pending |
| Admin approves results | Student portal | Results now visible (were hidden before approval) |
| Driver marks pickup | Parent portal | Pickup status updates to confirmed |
| Teacher submits leave request | Admin → Leave screen | Request visible for approval |
| Teacher enters scores | Admin → Results | Scores ready for approval |
| Admin posts a vacancy | SchoolCity public profile | Vacancy listing visible to unauthenticated visitors; then simulate application from SchoolCity and verify the applicant appears in Admin → Vacancies applicants tab |
| School A sends a letter / event to School B | School B admin portal | Letter / event visible in their inbox |
| School uses referral link to sign up | Referring school's Referral screen | New school appears in the referral list; verify DB records the referral and any committed subscription benefit is reflected on the referring school's next billing |
| Prospective parent submits enquiry via SchoolCity | Admin → Enquiries (or Messages) | Enquiry notification visible; parent's message present |

**Rule on second-role checks:** Where the action affects ONLY one specific class or user, also verify at least one unaffected peer to confirm no cross-contamination. For example: timetable edit for JSS 2A → check SSS 1A teacher to confirm unchanged.

**Rule on SchoolCity flows:** Any action that has a public-facing output (vacancy, school profile update, events, referral link) must be verified by navigating to the relevant SchoolCity page as an unauthenticated visitor.

---

### Per-screen output block

After completing all four steps, output this block before moving to the next screen:

```
SCREEN: [name — URL]
  TABS:    [tab1 ✓] [tab2 ✓] [tab3 ❌ crash]
  BUTTONS: [Add ✓] [Edit ✓] [Delete ✓] [Export ❌ 500]
  FILTERS: [All ✓] [Active ✓] [Inactive ✓]
  MODALS:  [Add student modal ✓] [Confirm delete ✓]
  FORMS:   [Add form — empty ✓ invalid ✓ valid ✓]
  CONSOLE: clean / [2 errors — described]
  NETWORK: clean / [POST /students 500 — fixed]
  CROSS-ACCOUNT: N/A  /  admin → student: [what was verified ✓ / bug ❌]
RESULT: ✅ clean  /  ❌ [bug found — fixed ✓ / spawned task]
```

---

### Per-screen checkpoint gate — HARD STOP before next screen

Before typing the name of the next screen, answer these 6 questions verbatim in your output. Do not paraphrase, abbreviate, or skip the block.

```
CHECKPOINT: [screen name]
  1. Navigation    Did I navigate to this screen and see it render?                   YES / NO
  2. Controls      Did I interact with every button, tab, filter, toggle listed?      YES / NO
  3. Write         Did I perform at least one CREATE / EDIT / DELETE (if available)?   YES / NO / N/A (read-only)
  4. Persistence   Did I navigate away and return to confirm the write survived?       YES / NO / N/A
  5. Cross-account Did I switch to every affected downstream role and verify?          YES / NO / N/A (self-contained)
  6. Health        Zero uncaught console errors and no 4xx/5xx responses?             YES / NO
GATE: ✅ proceed  /  ❌ [which item failed — go back and complete it]
```

**Rule:** If any answer is NO — stop. Complete that step. Do not type the next screen name until every item is YES or N/A. The gate is not a summary; it is a decision point. Writing "YES" on a step you did not actually perform is the failure mode this gate exists to prevent.

---

## Fix immediately

Every bug found is fixed before moving to the next screen. Not logged for later. Not deferred. The audit ends when the app is clean, not when the checklist is ticked.

The only exception: a bug that requires more than ~2 hours of work to fix (e.g. a missing feature, a large architectural change). For those: spawn a task chip, note it clearly in the screen output block, and continue. Everything else — fix it now.

---

## Data-gap protocol

If a screen is empty because no data exists yet, that is not a bug. Fill the data through the role-appropriate UI, then re-audit:

1. Identify which role creates this data
2. Sign out → sign in as that role
3. Create the data through their UI (the way a real user would)
4. Sign out → sign back in as the original role
5. Verify the data now appears and the full journey works

**NEVER bypass the UI.** No `psql INSERT`, no direct API calls with service-role keys, no `supabase.from(...).insert(...)` in the console. Every record in the DB during an audit must have been created by a real user action through the real UI. This is what makes the test trustworthy.

**If the upstream UI doesn't exist yet:** log `[BLOCKED: upstream UI missing]` and continue.
**If the upstream UI is broken:** fix it first (it is a higher-priority bug than the empty downstream view), then return to the downstream screen.
**If today's date is outside an active school term:** create the term through Admin → Academic Setup first, then proceed.

---

## Commit protocol

When every screen in scope has a ✅ result:

1. Run `npx tsc --noEmit` — must be zero errors. Fix any TypeScript errors before committing.
2. Stage only files changed during this audit. Do not bundle unrelated changes.
3. Commit:

```
fix(scope): short summary of what was fixed

- Bug: [exact description and fix]
- Bug: [exact description and fix]
- [BLOCKED: description] — spawned task #N

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Subject line: `fix(scope):` for bugs only; `feat(scope):` if new product behaviour was added. One bullet per distinct bug. No "various fixes."

---

## Self-improvement protocol

After committing, look back through the audit and extract any fact that would have been useful to know at the start. Append it to the **Nice to Know** section below, under the appropriate subsection. Update or remove entries that are now wrong.

Qualifies: credential quirks, data blockers, DB state issues, workarounds, non-obvious routes, patterns that will appear again.
Does NOT qualify: bugs fixed in code (those are in the commit), facts derivable from current code.

---

## Nice to Know — institutional memory

### Test accounts and credentials

Fetch all credentials from the Notion page before every audit. The page is the single source of truth — do not rely on what was correct in a previous session.

### Creating test data through the UI

**Adding a teacher:** Admin → Staff → "Add staff member" → 3-step wizard (personal details → role & assignment → review). On success the wizard shows the generated login ID and one-time password — copy it before closing. The teacher's portal is `/app/classdash` (class teacher) or `/app/subjectdash` (subject teacher), not `/app/dashboard`.

**Adding a student:** Admin → Students → "Add student". Wizard covers name, class, DOB, gender, parent details.

**Bulk imports:** Admin → Staff → "Import CSV" or Admin → Students → Import. Both show per-row validation previews before creating accounts.

### JWT staleness after teacher creation

After creating or reassigning a teacher, the JWT's `class_ids` / `subject_ids` claims are stale until re-login. If a teacher's class shows "—" immediately after creation, the JWT is stale — sign out and back in. For audit purposes, use `useMyTeacherAssignment` (reads directly from `teacher_assignments`) rather than JWT claims to verify assignments.

### Timetable-empty teachers

Teachers created via wizard have `teacher_assignments` records but `schedule_slots` may be empty until admin builds the timetable. Screens deriving class lists solely from `useTeacherTimetable()` will show empty/0 in this state. Look for the assignment-fallback pattern:
```ts
const myClasses = useMemo(() => {
  const fromTT = [...new Set(teacherTT.map(s => s.cls))];
  return fromTT.length ? fromTT : (assignment?.classLabels ?? []);
}, [teacherTT, assignment]);
```
If a teacher screen shows "—" when the teacher has assignments, this fallback is likely missing.

### PostgREST null UUID crash

`.eq('uuid_column', null)` sends `?col=eq.null` which Postgres rejects as an invalid UUID. Always use `.is('column', null)` for null equality on UUID columns.

### Announcement flow

Class teacher and subject teacher announcements go directly to students — no admin review gate. DB `status` is written as `'sent'` immediately. Admin announcements go through an inbox flow.

### DB constraints

- `users.section`: DB only accepts `'primary'` or `'secondary'` (or NULL). Display labels like "Primary & Nursery" are mapped before the edge function call.
- `announcements_type_scope_ck`: `type='subject'` requires `subject_id IS NOT NULL`; `type='class'` requires `class_id IS NOT NULL`.
- Subject teacher announcements must pass both `classId` and `subjectId`.

### Password change banner

`must_change_password` in `user_metadata` controls the change-password banner. Set to `true` on account creation; cleared after a successful password update. To reset for testing:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"must_change_password": true}'
WHERE email = 'teacher@school.edu.ng';
```

### Greenfield school data snapshot (July 2026)

5 students total (4 active, 1 inactive). JSS 2A: Tola Johnson (active), Zainab Bakare (active), David Okeke (inactive). Ada Nwosu and Emeka Obi are in other classes. Chidi Okonkwo (subject teacher) has no timetable slots — assignments exist only in `teacher_assignments`.

### Deriving class_id in attendance

Don't read `class_id` from the JWT `classIds` claim — it's stale for mid-term created teachers. Derive it from the already-loaded roster: `roster[0]?.classId`.
