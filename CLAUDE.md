# CLAUDE.md — work-ifence-web-ui (Frontend)

Guidance for AI coding agents working in this repository. Read this before making changes.

## What this is

`workifence` (v1.2.0) is the **Angular frontend** for WorkIfence — the user-facing web app
for the career/jobs + enterprise platform. It talks to the JHipster backend in the sibling
repo `work-ifence-web-ws` over a JWT-secured REST API.

- **Angular 21** (standalone, `@angular/*` 21.1.1) with **SSR** via `@angular/ssr`
  (Express server in `server.ts` / `server_http.ts`)
- Angular Material 21, ng-bootstrap, PrimeNG, Bootstrap 5, FullCalendar, ApexCharts/Chart.js
- Unit tests: **Karma + Jasmine**; E2E: **Playwright** (also some Cypress fixtures)
- AI helper integration: `@google/generative-ai`

## Golden rules

1. **Backend owns access; the frontend enforces defense-in-depth.** Navigation gating and
   route gating must both exist and must **match**. Assume entitlement flags can be missing
   or stale and **fail closed in production**. See `docs/navigation-gating.md`.
2. **A gated nav item must have an equally gated route, and vice versa.** Never expose a
   gated route as free in the nav.
3. **Guard contracts are deliberate:**
   - `entitlementRouteGuard` **requires** `data.entitlementKey`; missing/empty → deny (dev + prod).
   - `accessGuard` reads `data.requireFlag`; flag disabled → deny.
4. Run the nav/route audit after touching navigation or routing (`npm run audit:nav`).

## Common commands

```bash
npm install                 # install deps (Node 18+; see backend README for toolchain)

# Dev server (proxies /api to backend per proxy.config.json → port 8090)
npm start                   # ng serve on :4200

# Builds
npm run build               # production (ng build --configuration production)
npm run build:dev           # development
npm run build:ssr:dev       # SSR build (development)

# SSR run locally
npm run ssr:local           # build SSR + serve over HTTP on :4000
npm run ssr:local:watch     # rebuild + reserve on change

# Tests
npm test                    # Karma/Jasmine unit tests
npm run e2e                 # Playwright e2e
npm run e2e:ui              # Playwright UI mode
npm run e2e:ci              # build then e2e

# Audits
npm run audit:nav           # nav ↔ route gating audit (writes audit/nav-route-audit.*)
npm run audit:nav:ci        # CI mode (non-zero exit on drift)
```

The dev server expects the backend on **:8090**; the proxy config rewrites `/api`.
Environment files: `src/environments/environment.ts` (dev) and `environment.prod.ts`.

## Repository layout

```
src/
├── app/
│   ├── auth/ authentication/      Login, JWT handling, session
│   ├── guards/                    Route guards (entitlementRouteGuard, accessGuard, …)
│   ├── entitlements/ facades/     Entitlement state + feature-gating logic
│   ├── nav/ layout/ routing/      Shell, navbar, route tables (nav ↔ route gating lives here)
│   ├── core/ common/ common2/ shared/   Cross-cutting services, interceptors, utilities
│   ├── services/ api/ models/     HTTP clients + typed models for the backend API
│   ├── dashboard/ my-profile/ resume-portal/  Feature areas
│   ├── settings/ components/ widgets/ forms/ tables/ ui-elements/  UI building blocks
│   ├── ssr/                       SSR-specific helpers
│   └── apps/ pages/ starter/      Page-level feature modules
├── pages/                         Top-level pages (e.g. dashboard-app-admin)
├── @navan/                        Vendor/admin template assets
├── environments/                  environment.ts / environment.prod.ts
├── styles/ + *.scss               Global styles, theme, dark mode, UI kit
└── main.ts / main.server.ts       Browser + SSR bootstrap

server.ts / server_http.ts         Express SSR servers (HTTPS / HTTP)
cypress/ + e2e/                     E2E specs, fixtures, Playwright config
docs/                              feature-gating + nav gating checklists
tools/                             nav-route-audit, ssr-local-watch scripts
```

## Working with the API

- The frontend never decides entitlements on its own — it reflects the backend payload
  (`/api/access/me` etc.). Treat the server as authoritative.
- Typed models live under `app/models` and `app/api`; HTTP services under `app/services`.
- Auth token is attached via an HTTP interceptor; SSR code must avoid browser-only APIs
  (guard with `isPlatformBrowser`).

## Adding a new gated feature (checklist)

1. Confirm/define the entitlement on the **backend** and that it is included in the user payload.
2. Gate the **nav item** (feature flag and/or `entitlementKey`).
3. Gate the **route** identically (`data.entitlementKey` / `data.requireFlag`).
4. Run `npm run audit:nav` and resolve any drift.
5. Verify fail-closed behavior in a production build.

See `docs/navigation-gating.md` and `docs/feature-gating-checklist.md`.

## When you finish a change

- `npm test` (unit) and, for routing/nav changes, `npm run audit:nav:ci`.
- For SSR-affecting changes, build with `npm run build:ssr:dev` and smoke-test `npm run ssr:local`.
- Verify gated routes still fail closed in a prod build.

## See also

- `ARCHITECTURE.md`, `REQUIREMENTS.md`, `ROADMAP.md` (this repo's `docs/` and root)
- `../work-ifence-web-ws/CLAUDE.md` — the backend
