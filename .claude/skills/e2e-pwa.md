# e2e-pwa

Student portal PWA audit. The student portal is installed on mobile devices and must work offline, install cleanly, and push notifications reliably. This audit verifies those guarantees.

## This skill only applies to the Student Portal
→ For live user flows in the student portal, run `e2e-product` first
→ For code correctness, run `e2e-code`
→ For UX and accessibility, run `e2e-ux`

---

## Trigger
```
e2e-pwa [optional: specific feature]
```
Examples:
- `e2e-pwa` (full student portal PWA audit)
- `e2e-pwa push notifications`
- `e2e-pwa offline results`

---

## Environment & startup

### Codebase location

The student portal is part of the web portals repo:

| Repo | Path |
|---|---|
| Web portals (including student portal) | `/Users/admin/kidtrack-web` |

### Starting the dev server

```
preview_start("portal")   # starts npm run dev in /Users/admin/kidtrack-web → http://localhost:5173
```

Config is in `/Users/admin/kidtrack-web/.claude/launch.json`. Use `preview_start` — never `Bash`.

### Sign-in as student

1. Navigate to `http://localhost:5173` → redirects to `/login`
2. Credentials: fetch `https://app.notion.com/p/SchoolOS-Dev-Credentials-38aec5fb0523807fae97e555670023ac`
3. Key student account: `GREEN-4421-ST-001` / `NewPass2026!` at Greenfield school (verify on Notion page first)
4. After login → app routes to `http://localhost:5173/app/academics`

### Chrome tools (required for PWA checks)

PWA inspection (service worker, cache, manifest, install prompt) requires Chrome DevTools. Use Chrome MCP tools (`mcp__claude-in-chrome__*`) — service worker state is not inspectable via `preview_*`.

Check Chrome connection: `mcp__claude-in-chrome__list_connected_browsers`

---

## Prerequisites

- Run `e2e-product` for the student portal first. The PWA audit assumes the product flows work. Auditing offline behaviour on top of broken flows produces misleading results.
- Use Chrome DevTools for this audit — service worker, cache, and install prompts are only fully inspectable in Chrome.
- The student portal must be served over HTTPS (or localhost) for service workers to register.

---

## Check 1 — Service worker registration

Open Chrome DevTools → Application → Service Workers.

- A service worker must be registered and its status must be `activated` and `running`.
- If the service worker is missing, errored, or stuck in `waiting`: that is a **Critical bug**. The PWA cannot function without it.
- Note the service worker script URL and confirm it is the correct file (not a stale or cached version from a previous build).

---

## Check 2 — Offline cache coverage

Throttle Chrome DevTools network to **Offline**. Reload the student portal.

The app shell (HTML, CSS, JS bundle) must load from cache — no blank screen, no "No internet connection" browser page. What to verify:

- The app shell renders and the navigation is usable
- Previously loaded data (results, timetable, announcements, last-viewed feed) is readable from cache
- Screens with no cached data show a clear offline indicator (`WOfflineBanner`) — not a spinner, not a blank page, not an uncaught error

Restore network. Verify the app recovers without a manual reload (or at most one reload).

---

## Check 3 — Install prompt

On a fresh Chrome session (no prior install):

- The browser must show an "Add to home screen" prompt at an appropriate time — after the user has engaged with the app (not on the very first page load).
- If the app uses a custom install button: verify it is visible, clickable, and triggers the browser's install flow correctly.
- After installing: verify the app opens in standalone mode (no browser chrome), with the correct app name and icon.

---

## Check 4 — Push notification permissions

For any feature that sends push notifications (announcements, result release, leave approval):

- The app must request notification permission on a meaningful user action (e.g. tapping "Enable notifications") — **never on page load**.
- Granting permission must store the subscription correctly (verify a record is created in the `push_subscriptions` table or equivalent).
- Denying permission must not crash the app or block any core functionality.
- If the feature sends a notification: verify the notification arrives on device with the correct title, body, and tap target (tapping opens the relevant screen).

---

## Check 5 — Background sync (if applicable)

If the student portal allows any action while offline (e.g. submitting a form, flagging content):

- The action must be queued locally when offline.
- When connectivity is restored, the action must sync automatically — not be silently dropped.
- Verify the sync result in the DB and in the UI after reconnecting.

If no offline actions are supported: mark N/A.

---

## Check 6 — App icon and metadata

Inspect the web app manifest (`/manifest.json` or `/manifest.webmanifest`):

- `name` and `short_name` are correct (SchoolOS / student's school name, not a dev placeholder)
- `icons` includes at least 192×192 and 512×512 PNG entries
- `start_url` points to the correct entry point
- `display` is `standalone` or `fullscreen`
- `theme_color` matches the Verdant forest `#1A3D2C`
- `background_color` matches cream `#FAF7F0`

---

## Output format

```
✅ Check 1 — SW  — Service worker activated and running; script: /sw.js
❌ Check 2 — Offline — App shell loads offline; results cached ✓; announcement feed shows blank with no WOfflineBanner — fixed
✅ Check 3 — Install — Custom install button visible; standalone mode confirmed after install
✅ Check 4 — Push — Permission requested on tap (not on load); subscription stored; notification arrives with correct tap target
N/A Check 5 — BG sync — No offline actions in student portal yet
❌ Check 6 — Manifest — short_name is "App" (dev placeholder) — fixed to "SchoolOS"; icons present; theme_color correct
```

Final summary:
```
e2e-pwa: student portal
Checks: 6  N/A: 1
Issues found: N  Fixed: N  Spawned: N
[list each issue]
```
