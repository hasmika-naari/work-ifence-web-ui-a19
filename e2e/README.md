# Playwright E2E (DEV-only)

This folder contains Playwright E2E tests that run the Angular dev server and use a **DEV-only** `window.__E2E__` hook to simulate auth/flags/entitlements without relying on backend APIs.

## Install

- Install npm deps: `npm install --legacy-peer-deps`
- Install Playwright browsers: `npx playwright install`

## Run

- Headless: `npm run e2e`
- UI mode (recommended for debugging): `npm run e2e:ui`

## CI run (recommended for pipelines)

Use `npm run e2e:ci` when you want a single command that:

1) Builds the app in dev mode
2) Starts `ng serve` on an available port (prefers 4200)
3) Runs Playwright against that URL
4) Always shuts down the server (even if tests fail)

Examples:

- Default CI run: `npm run e2e:ci`
- Forward Playwright args: `npm run e2e:ci -- --project=chromium`
- List tests only (still boots the server): `npm run e2e:ci -- --list`

Optional env:

- Force a specific port: `set E2E_CI_PORT=4300`

Playwright server behavior:

- For `npm run e2e` / `npm run e2e:ui`, the Playwright config will start `npm run start -- --port 4200 --host 127.0.0.1` (and reuse it if already running).
- For `npm run e2e:ci`, the Node runner starts the dev server on an available port and sets `E2E_SKIP_WEBSERVER=1` so Playwright does not start its own server.

The Playwright config also:

- Retries once on failure
- Captures trace on first retry, plus screenshots/videos on failure

You can also override the base URL (if you run the dev server elsewhere):

- PowerShell: `$env:E2E_BASE_URL = 'http://127.0.0.1:4200'; npm run e2e`

If you already have a dev server running, Playwright will reuse it (normal runs) or you can set `E2E_SKIP_WEBSERVER=1` and provide `E2E_BASE_URL`.

## DEV-only test hook

Playwright sets `window.__E2E__` **before any app code runs** via `page.addInitScript()`.

Shape:

- `window.__E2E__.auth.authenticated`: boolean
- `window.__E2E__.auth.activated`: boolean (used by `canActivateChild`)
- `window.__E2E__.flags`: `{ [flagKey: string]: boolean }`
- `window.__E2E__.entitlements.allowList`: `string[]` (entitlement keys to allow)
- `window.__E2E__.entitlements.map`: `{ [entitlementKey: string]: boolean }` (explicit map)

Notes:

- The hook is ignored in production (`environment.production === true`).
- The hook is SSR-safe (only runs when `window` exists).
- When `flags` override is present, missing keys default to `false` (fail-closed) to keep tests explicit.

## Troubleshooting

- Dependency install fails (peer deps): run `npm install --legacy-peer-deps`
- Browsers missing: run `npx playwright install`
- Port already in use: set `E2E_BASE_URL` (example: `set E2E_BASE_URL=http://127.0.0.1:4300`) and start your dev server on that port
- Debug a failing test:
	- Run UI mode: `npm run e2e:ui`
	- Or run headed with debug: set `PWDEBUG=1` and run `npm run e2e`
- View trace from a retry (when retries happen): `npx playwright show-trace <path-to-trace.zip>`
- Artifacts location: check `test-results/` (default Playwright output folder)
- Backend-less behavior: the tests stub a couple of auth-related endpoints to reduce noise; feature gating itself is validated via `window.__E2E__`.

- Console errors fail the test (except a small allowlist like favicon 404 / ResizeObserver noise). If a known benign error shows up, add it to the allowlist in `e2e/gating.spec.ts`.
