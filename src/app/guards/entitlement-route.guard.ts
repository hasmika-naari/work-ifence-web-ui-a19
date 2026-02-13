import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { EntitlementService } from '../services/entitlement.service';
import { AccessFacadeService } from '../facades/access-facade.service';
import { PlanTier } from '../nav/nav.model';
import { environment } from '../../environments/environment';
import { FeatureKey } from '../models/feature-key.model';
import { ENTITLEMENT_KEYS } from '../entitlements/entitlement-keys';

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
  const accessFacade = inject(AccessFacadeService);
  const router = inject(Router);

  const data = (route.data ?? {}) as EntitlementRouteData;
  const entitlementKey = (data.entitlementKey ?? '').toString();
  const minPlan = toPlanTier(data.minPlan);

  // 1. Authentication Check
  if (!accessFacade.isLoggedIn()) {
    // Redirect unauthenticated users to login with returnUrl
    return router.createUrlTree(['/sign-in'], {
      queryParams: { returnUrl: state.url },
    });
  }

  // CONTRACT (fail-closed):
  // If a route uses `entitlementRouteGuard`, it MUST declare `data.entitlementKey`.
  // - If `data.entitlementKey` is missing/empty: deny access.
  //   - Prod: console.error (include route path) + return false
  //   - Dev:  console.warn (misconfiguration) + return false
  // - If `data.entitlementKey` is present: preserve existing behavior.
  if (!entitlementKey) {
    // If minPlan is set, redirect to upgrade page
    if (minPlan) {
      return router.createUrlTree(['/user/billing/upgrade'], {
        queryParams: {
          feature: entitlementKey,
          minPlan,
          from: state.url
        }
      });
    }
    // Otherwise, redirect to pricing
    return router.createUrlTree(['/pricing']);
  }

  if (entitlementKey === ENTITLEMENT_KEYS.USER_DASHBOARD) {
    return true;
  }

  const ok = entitlement.canAccess(entitlementKey, minPlan);
  if (ok) return true;

  // 2. Authorization Check (Logged in but not entitled)
  // Redirect to upgrade page if minPlan is set
  if (minPlan) {
    return router.createUrlTree(['/user/billing/upgrade'], {
      queryParams: {
        feature: entitlementKey,
        minPlan,
        from: state.url
      }
    });
  }
  // Otherwise, redirect to pricing
  return router.createUrlTree(['/pricing']);
};
