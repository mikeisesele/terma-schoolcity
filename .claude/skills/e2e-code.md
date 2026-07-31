# e2e-code

Static code analysis for a SchoolOS feature or flow. Catches the class of bugs that live silently in the gap between the DB schema, TypeScript interfaces, and UI rendering — bugs that don't crash in dev but corrupt data or crash at runtime in production.

## This skill does NOT run the browser
→ For live user simulation, invoke `e2e-product`
→ For UX / design / accessibility, invoke `e2e-ux`

---

## Trigger
```
e2e-code [feature or flow]
```
Examples:
- `e2e-code staff attendance`
- `e2e-code fee payment`
- `e2e-code CBT results`

---

## Environment & backend access

### Codebase locations

| Repo | Path | What it contains |
|---|---|---|
| Web portals (source being audited) | `/Users/admin/kidtrack-web` | `src/api/hooks.ts`, `src/api/mutations.ts`, `src/screens/` |
| Backend | `/Users/admin/kidtrack-backend` | Supabase Edge Functions, schema migrations, RLS policies |

No local dev server is needed for `e2e-code` — analysis is static (source files + DB queries).

### DB access via psql

```bash
psql "postgresql://postgres.dpjcffgkrdhtijeyefbn:0wPcbisT87kCXRgZP52eKt%239@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

Useful commands:
- `\d table_name` — schema, column types, CHECK constraints, FK targets
- `SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'table_name'::regclass;` — all constraints verbatim
- `SET app.school_id = '<uuid>'; SELECT * FROM table;` — test RLS tenant isolation
- `\df app_school_id` — confirm the RLS helper function exists

### Supabase project

- **Project URL:** `https://dpjcffgkrdhtijeyefbn.supabase.co`
- **Anon key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamNmZmdrcmRodGlqZXllZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzYwMzAsImV4cCI6MjA5Nzk1MjAzMH0.GmYk0ObIEaYeEA6LsB9rju_xpkWbwSltfgMr13BN9GM`
- **Service role key** (bypasses RLS — verification only, never in shipped code): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamNmZmdrcmRodGlqZXllZmJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM3NjAzMCwiZXhwIjoyMDk3OTUyMDMwfQ.leQcGOKKKX573DNfpzDkFZtmVrVJcd-_TT72jFNyJlM`

### Fixed UUIDs for Greenfield school

| Entity | UUID |
|---|---|
| school_id | `e9d2e7d3-91d9-42d7-9bbb-fd8ef8c782de` |
| Active term_id | `7f598397-6b1c-4440-9395-88824245da5c` |
| JSS 2A class_id | `104ae2db-510e-4169-8ffe-e6a3b07529e1` |
| Mathematics subject_id | `5b7e9f8d-52a3-40a9-836c-2f41c7e8d087` |

---

## Run every check below, in order

---

### 1 — Map the full flow chain

Read `src/api/hooks.ts`, `src/api/mutations.ts`, and the relevant screen component(s) under `src/screens/`.

Document the complete chain in one line:
> `[User action] → [Component/handler] → [mutation fn] → [Edge Function action or PostgREST table] → [DB table.column] → [read hook] → [UI component]`

Identify:
- Client entry point (screen + handler)
- Mutation path: React Query mutation → Edge Function, or → direct PostgREST?
- Server entry point: Edge Function name + action string, or table name
- DB table(s) written and exact column names
- Read path: which hook, what transform it applies
- Status/enum values: what the DB stores vs what TypeScript uses vs what the UI renders

---

### 2 — DB ↔ TypeScript enum sync

**DB schema:** run `\d [table_name]` via psql to get the actual CHECK constraint values (e.g. `status IN ('present','late','absent','leave')`).

**TypeScript interface:** find the matching type in `hooks.ts` (e.g. `status: 'on_time' | 'late' | 'absent' | 'on_leave'`).

**If they differ:** a mapping dict must exist in the read hook. Find it. Verify it is complete — every DB value maps to a TS value, no DB value is missing, no bare `as` cast is used in place of a real transform.

**Bare cast audit:** search for `as SomeType['status']` or ` as 'present'` patterns without an accompanying mapping object. A bare cast silently succeeds even when the DB value doesn't match the TS value — downstream code like `STATUS_CHIP[r.status]` then returns `undefined` and crashes on `.bg` or `.label`. Replace every bare cast with an explicit mapping dict that covers every possible DB value and has a safe fallback.

**Enum completeness:** if the UI has a chip/badge lookup (`STATUS_CHIP`, `BADGE_MAP`, `tone`), verify every possible DB value maps to a defined entry. A missing key = runtime crash at the moment that value arrives from the DB.

---

### 3 — Hardcoding and fixture audit

Search the relevant hooks and screen components for:

- `FX_*` constants returned when `HAS_BACKEND` is true — stale mock data leaking into production
- `if (!HAS_BACKEND) return mockData` paths — verify the real path actually fetches from Supabase
- Hardcoded values that should come from the DB or a school policy (e.g. `100m radius` in a label when `geo_radius_m` exists in the DB; a deadline hardcoded as `7:30` when `school_settings.checkin_deadline_time` exists)
- Hardcoded school IDs, user IDs, or names in display logic
- Any `TODO`, `FIXME`, or `// mock` comment in the flow

Fix every instance found.

---

### 4 — Server-side trust

Core rule (CLAUDE.md): *"Never trust the client. PINs, pickup codes, geo-fence, fee state, results approval, CBT timing, and entitlements are all server-validated."*

For the feature being reviewed, identify every business rule that must be server-enforced and verify each:

| Rule | What to check |
|---|---|
| Geo-fence | Server fetches `geo_lat/geo_lng/geo_radius_m` from DB, computes haversine, rejects if outside — never trusts client-sent coords |
| Timing (CBT, deadlines) | Server uses `now()` to determine late/on-time/expired — never trusts a client-supplied timestamp |
| Status determination | Server writes the correct status based on its own clock and policy, not client input |
| Role / entitlement | Edge Function calls `requireRole(claims, [...])` before acting; client cannot elevate role |
| Tenant isolation | Every DB write uses `school_id` from the JWT claim, not the request body |
| Idempotency | `onConflict` target matches the actual DB unique index — verify with `\d table_name`; wrong target causes a 500 instead of a clean upsert |

To verify server enforcement: call the Edge Function directly with a bad value (e.g. coords 500km away, a past timestamp, a wrong role) via `supabase.functions.invoke`. Verify the server returns the correct error code and HTTP status, and that NO row was written to the DB.

---

### 5 — Mutation routing

Verify that mutations with business rules go through the **Edge Function**, not direct PostgREST:

- Direct PostgREST (`supabase.from('table').upsert(...)`) cannot enforce geo-fence, determine late/present from server clock, or validate entitlements.
- If a mutation with business rules uses direct PostgREST, it must be migrated to `supabase.functions.invoke('function', { body: { action: '...' } })`.

**Error body parsing:** `supabase.functions.invoke` puts non-2xx response bodies in `error.context` (a `Response`), not in `data`. The mutation must call `await error.context?.json?.()` to get the structured error object and show a human-readable message. A mutation that only inspects `data` on error will silently swallow all server errors.

---

### 6 — Hook completeness

For the read hook(s) in the flow:

- Every field the hook returns should be consumed somewhere in the UI. List returned fields that are never read — they likely indicate a missing display or a dead mapping.
- `staleTime` should be appropriate: not `0` for data that doesn't change per-second; not `Infinity` for data that changes during a session.
- If the hook queries `school_settings` for one field, check whether related fields (e.g. `geo_lat/geo_lng`) are on the `schools` table and need a separate query.

---

### 7 — RLS / tenant isolation

Pick one DB write from the flow. Verify:

1. The written row's `school_id` column derives from `app_school_id()` (or the JWT claim) — not a hardcoded UUID, not the request body.
2. The RLS policy on the table calls `app_school_id()` — verify the function exists and is called.
3. A user from school A cannot read school B's data: run a psql SELECT with `SET app.school_id = '<school_B_uuid>'` and verify 0 rows are returned.

---

### SchoolOS-specific patterns to always check

These recur across almost every flow:

- `STATUS_CHIP` / `tone` / badge map keys must match the hook's returned union type, which must map from DB CHECK values via an explicit dict — never via bare cast.
- `useAttendancePolicy` must return both deadline AND geo fields (`geoLat`, `geoLng`, `geoRadiusM`). If it only fetches `school_settings`, it is missing the `schools` table geo fields.
- Every mutation that writes a `status` must have the Edge Function determine the value — not the client.
- `supabase.functions.invoke` error body is in `error.context` (a `Response`). Always `await error.context?.json?.()`.
- `onConflict` target must match the actual DB unique index — always verify with `\d table_name`.
- `HAS_BACKEND` guard: every `if (!HAS_BACKEND) return FX_*` must have a real Supabase fetch on the else path.
- RLS policies use `app_school_id()` — never a hardcoded UUID.
- `geo_lat/geo_lng/geo_radius_m` are on the `schools` table, not `school_settings`. Deadline time is on `school_settings.checkin_deadline_time`.

---

### Output format

After each check, one line:

```
✅ Check 1 — Flow: Teacher → handleCheckIn → useClockIn (EF) → teacher/check_in → staff_attendance_log.status → useStaffAttendance → STATUS_CHIP
✅ Check 2 — DB: present|late|absent|leave → mapped to on_time|late|absent|on_leave via CLOCK_STATUS_MAP; chip complete
❌ Check 3 — radius hardcoded as 100m in Teacher.tsx label; geo_radius_m available in policy — fixed
✅ Check 4 — Geo-fence: server returns 403 outside_radius for Lagos coords; no DB row written
✅ Check 5 — Mutation routes through teacher EF; error.context?.json() parsed correctly
✅ Check 6 — All hook fields consumed in UI; staleTime: 30s appropriate
✅ Check 7 — RLS uses app_school_id(); cross-tenant query returns 0 rows
```

Final summary:
```
e2e-code: [feature]
Checks: 7 / 7
Issues found: N  Fixed: N  Spawned: N
[list each issue]
```
