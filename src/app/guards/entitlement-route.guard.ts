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

  // Contract: if this guard is applied, route.data.entitlementKey must be set.
  // Dev: warn + allow to avoid blocking local navigation.
  // Prod: fail-closed (deny) to prevent accidental bypass.
  if (!entitlementKey) {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.warn('[entitlementRouteGuard] Missing route data (entitlementKey). Allowing in dev:', state.url);
      return true;
    }
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
