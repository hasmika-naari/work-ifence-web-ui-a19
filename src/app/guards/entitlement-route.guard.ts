import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { EntitlementService } from '../services/entitlement.service';
import { PlanTier } from '../nav/nav.model';
import { environment } from '../../environments/environment';

export interface EntitlementRouteData {
  entitlementKey?: string;
  minPlan?: PlanTier | string;
}

function toPlanTier(value: PlanTier | string | undefined): PlanTier | undefined {
  if (!value) return undefined;
  // PlanTier is a string enum (e.g., 'FREE', 'PRO', ...)
  const v = value.toString().toUpperCase() as PlanTier;
  if (v === PlanTier.FREE || v === PlanTier.PRO || v === PlanTier.PREMIUM || v === PlanTier.ENTERPRISE) return v;
  return undefined;
}

export const entitlementRouteGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const entitlement = inject(EntitlementService);
  const router = inject(Router);

  const data = (route.data ?? {}) as EntitlementRouteData;
  const entitlementKey = (data.entitlementKey ?? '').toString();
  const minPlan = toPlanTier(data.minPlan);

  // CONTRACT (fail-closed):
  // If a route uses `entitlementRouteGuard`, it MUST declare `data.entitlementKey`.
  // - If `data.entitlementKey` is missing/empty: deny access.
  //   - Prod: console.error (include route path) + return false
  //   - Dev:  console.warn (misconfiguration) + return false
  // - If `data.entitlementKey` is present: preserve existing behavior.
  if (!entitlementKey) {
    const routePath =
      route.routeConfig?.path ??
      route.url?.map((u) => u.path).filter(Boolean).join('/') ??
      state.url;
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.warn(
        '[entitlementRouteGuard] Misconfigured route: missing data.entitlementKey. Denying access in dev.',
        { routePath, url: state.url },
      );
      return false;
    }

    // eslint-disable-next-line no-console
    console.error('[entitlementRouteGuard] Misconfigured route: missing data.entitlementKey. Denying access.', {
      routePath,
      url: state.url,
    });
    return false;
  }

  const ok = entitlement.canAccess(entitlementKey, minPlan);
  if (ok) return true;

  return router.createUrlTree(['/user/billing/upgrade'], {
    queryParams: {
      feature: entitlementKey,
      returnUrl: state.url,
    },
  });
};
