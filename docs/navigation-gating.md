# Navigation & Route Gating (Defense-in-Depth)

## 1) Source of truth

- **Backend owns entitlements**: the server is the authority for what a user can access.
- **Frontend enforces defense-in-depth**:
  - UI gating: hide/lock navigation items so users don’t get misleading access.
  - Route gating: prevent URL-by-paste bypasses.

The frontend must assume flags/entitlements can be missing or stale and should **fail-closed in production**.

## 2) Rules

### Nav ↔ Route must match
- If a nav item is gated by a feature flag and/or entitlement, the corresponding route must be gated the same way.
- If a route is gated, the nav must not expose it as “free/unlocked”.

### Guard contracts
- **`entitlementRouteGuard` requires `data.entitlementKey`**
  - If the guard is used and `data.entitlementKey` is missing/empty, access is denied (dev + prod). This is a deliberate contract to prevent accidental bypass.
- **`accessGuard` reads `data.requireFlag`**
  - When `requireFlag` is set and the flag is disabled, the guard denies access.

### Fail-closed in production
- Missing/unknown flags and missing/unknown entitlements must be treated as **deny** in production.

## 3) Adding a new gated feature (checklist)

1. **Define entitlement (backend)**
   - Add/confirm the entitlement exists server-side and is included in the user payload.

2. **Add/confirm frontend entitlement key**
   - Use an existing entry in `ENTITLEMENT_KEYS` (or add one if missing).

3. **Add route gating**
   - In `routes`, add `canActivate: [entitlementRouteGuard]` and set:
     - `data.entitlementKey: ENTITLEMENT_KEYS.YOUR_FEATURE`
   - If the feature is also flag-controlled, add `accessGuard` and set:
     - `data.requireFlag: 'YOUR_FLAG_KEY'`

4. **Add nav gating**
   - Add the nav item with matching metadata:
     - `entitlementKey` (and optionally `minPlan`)
     - `featureFlag` (if the route uses `requireFlag`)
   - If you want the item visible-but-locked, ensure the nav item uses the locked pattern and upgrade redirect.

5. **Run audits + tests**
   - Run `npm run audit:nav` to generate evidence.
   - Run `npm run audit:nav:ci` to ensure it will pass in CI.
   - Run unit tests.

### Common mistakes
- Adding `entitlementRouteGuard` but forgetting `data.entitlementKey` (now denied by contract).
- Gating nav but forgetting to gate the route (URL bypass).
- Gating a route but leaving nav unlocked (misleading UI).
- Using a new/typo flag key that isn’t enabled in Remote Config (production will deny).

## 4) Running the nav/route audit

- Generate the human-readable + JSON audit report:
  - `npm run audit:nav`

- CI enforcement (non-zero exit if there are mismatches/dead links/misconfigured entitlement routes):
  - `npm run audit:nav:ci`

Outputs:
- `audit/nav-route-audit.md`
- `audit/nav-route-audit.json`
