# Feature Gating Checklist

Use this checklist when adding a new **feature-gated page** (route + nav) that should be controlled by:

- Entitlements (enforced via `entitlementRouteGuard` + `data.entitlementKey`)
- Feature flags (optional; enforced via `accessGuard` + `data.requireFlag`)
- Min plan tier (optional; enforced via `entitlementRouteGuard` + `data.minPlan`)

Generate a ready-to-paste checklist entry + suggested snippets:

- `node tools/new-feature-gated-page.mjs`

---

## Template (copy/paste)

```md
### <Feature Name> (<route>)

- [ ] Define/confirm entitlement exists server-side and is included in the user payload
- [ ] Add/confirm frontend entitlement constant: `ENTITLEMENT_KEYS.<NAME>` in `src/app/entitlements/entitlement-keys.ts`
- [ ] (Optional) Add/confirm frontend flag constant: `FEATURE_FLAGS.<NAME>` in `src/app/config/feature-flags.ts`
- [ ] Add route under the `/user` parent in `src/app/app.routes.ts`
  - [ ] `canActivate` includes `entitlementRouteGuard`
  - [ ] If a flag is used, `canActivate` includes `accessGuard`
  - [ ] `data.entitlementKey: ENTITLEMENT_KEYS.<NAME>`
  - [ ] (Optional) `data.requireFlag: '<FLAG_KEY>'` (string key used by remote config)
  - [ ] (Optional) `data.minPlan: PlanTier.<TIER>`
  - [ ] `data.breadcrumb` set to keep UX consistent
- [ ] Add a nav item in `src/app/nav/nav-config.service.ts`
  - [ ] Use `ENTITLEMENT_KEYS.<NAME>` (no raw strings)
  - [ ] If using a flag, use `FEATURE_FLAGS.<NAME>` (no raw strings)
  - [ ] If using a min plan, include `minPlan: PlanTier.<TIER>` (and optionally `showWhenLocked: true`)
- [ ] Run CI audit: `npm run audit:nav:ci`
```

---

## New Feature Entries

Paste a generated entry here for each new gated page.

---

## Notes / conventions

- `/user/*` routes are already protected by `AuthGuardService` at the parent route. You usually do not need `data.requireAuth` unless you want the extra telemetry/UX messaging from `accessGuard`.
- `entitlementRouteGuard` is **fail-closed** if `data.entitlementKey` is missing.
- Route flags in `app.routes.ts` typically use string keys like `requireFlag: 'RESUME_PORTAL'`.
- Nav linting in `tools/nav-route-audit.mjs --ci` will fail if nav items use raw strings for `featureFlag` / `entitlementKey`.
