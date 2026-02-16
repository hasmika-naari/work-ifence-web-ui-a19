import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
import { entitlementDenyReason, isEntitled, type EntitlementKey } from 'src/app/utils/entitlements';
import type { FeatureKey, FeaturePricingScope } from 'src/app/models/feature-key.model';
import type { FeatureFlagKey } from 'src/app/models/feature-flag.model';

export interface AccessGuardData {
  requireAuth?: boolean;
  requireMode?: 'ENTERPRISE' | 'PERSONAL' | 'ADMIN';
  requireEnterpriseAdmin?: boolean;
  requireEntitlement?: EntitlementKey;
  requireFeature?: FeatureKey;
  requireFlag?: FeatureFlagKey;
  pricingScope?: FeaturePricingScope;
}

function show(snackBar: MatSnackBar | null, message: string) {
  if (!snackBar) return;
  snackBar.open(message, 'OK', { duration: 3200 });
}

function navigatePricing(router: Router, scope?: FeaturePricingScope) {
  if (scope === 'enterprise') {
    void router.navigate(['/pricing'], { queryParams: { scope: 'enterprise' } });
    return;
  }
  // individual: default pricing tab
  void router.navigateByUrl('/pricing');
}

export const accessGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const accessFacade = inject(AccessFacadeService);
  const router = inject(Router);
  const storage = inject(LocalStorageService);
  const platformId = inject(PLATFORM_ID);
  const telemetry = inject(GateDeniedTelemetryService);
  const remoteConfig = inject(RemoteConfigFacadeService);

  // Avoid instantiating Material overlay/snackbar on the server (prerender).
  const snackBar = isPlatformBrowser(platformId) ? inject(MatSnackBar) : null;

  const data = (route.data ?? {}) as AccessGuardData;

  return accessFacade.accessMe$.pipe(
    take(1),
    map((me) => {
      // Auth check (best-effort). Most /user/* routes are already protected by AuthGuardService.
      if (data.requireAuth) {
        if (isPlatformBrowser(platformId)) {
          const auth = storage.getItem('authenticated');
          if (auth !== true) {
            const msg = 'Please sign in to continue.';
            show(snackBar, msg);
            telemetry.recordGateDenied({
              requestPath: state.url,
              denialType: 'AUTH',
              message: msg,
              details: { requireAuth: true },
            });
            void router.navigateByUrl('/');
            return false;
          }
        }
      }

      const mode = (me?.mode ?? 'PERSONAL').toString();
      const activeProfileKey = (me?.activeProfileKey ?? '').toString();
      const isEnterpriseMode = mode === 'ENTERPRISE_ADMIN' || mode === 'ENTERPRISE_EMPLOYEE';

      // IMPORTANT: `requireMode` is used to enforce the current dashboard/profile context.
      // It must be based on the *active profile* (activeProfileKey), not just global capabilities.
      const isAdminProfile = activeProfileKey === 'ROLE_ADMIN';
      const isEnterpriseProfile =
        activeProfileKey === 'ROLE_ENTERPRISE_ADMIN' || activeProfileKey === 'ROLE_ENTERPRISE_EMPLOYEE';
      const isPersonalProfile = activeProfileKey === 'ROLE_USER' || (!activeProfileKey && mode === 'PERSONAL');

      if (data.requireFlag) {
        if (!remoteConfig.isFlagEnabledSafe(data.requireFlag)) {
          const msg = 'This feature is temporarily disabled.';
          show(snackBar, msg);
          telemetry.recordGateDenied({
            requestPath: state.url,
            denialType: 'FLAG',
            message: msg,
            details: { requireFlag: data.requireFlag },
          });
          return router.createUrlTree(['/unauthorized']);
        }
      }

      if (data.requireMode) {
        const ok =
          (data.requireMode === 'ADMIN' && isAdminProfile) ||
          (data.requireMode === 'PERSONAL' && isPersonalProfile) ||
          (data.requireMode === 'ENTERPRISE' && (isEnterpriseProfile || isEnterpriseMode));

        if (!ok) {
          const msg =
            data.requireMode === 'ADMIN'
              ? 'Admin access required.'
              : 'This page is not available in the current dashboard context.';
          show(snackBar, msg);
          telemetry.recordGateDenied({
            requestPath: state.url,
            denialType: 'MODE',
            message: msg,
            details: { requireMode: data.requireMode, actualMode: mode, activeProfileKey },
          });
          return router.createUrlTree(['/unauthorized']);
        }
      }

      if (data.requireEntitlement) {
        if (!isEntitled(me, data.requireEntitlement)) {
          const msg = entitlementDenyReason(data.requireEntitlement);
          show(snackBar, msg);
          telemetry.recordGateDenied({
            requestPath: state.url,
            denialType: 'ENTITLEMENT',
            entitlementKey: data.requireEntitlement,
            pricingScope: data.pricingScope ?? (isEnterpriseMode ? 'enterprise' : 'individual'),
            message: msg,
            details: { requireEntitlement: data.requireEntitlement },
          });
          navigatePricing(router, data.pricingScope ?? (isEnterpriseMode ? 'enterprise' : 'individual'));
          return false;
        }
      }

      if (data.requireFeature) {
        if (!accessFacade.require(data.requireFeature, me)) {
          const reason = accessFacade.lastDeniedReason();
          const msg = reason?.message ?? 'Upgrade required';
          show(snackBar, msg);
          telemetry.recordGateDenied({
            requestPath: state.url,
            denialType: 'FEATURE',
            featureKey: data.requireFeature,
            pricingScope: data.pricingScope ?? reason?.pricingScope ?? (isEnterpriseMode ? 'enterprise' : 'individual'),
            message: msg,
            details: { requireFeature: data.requireFeature, deniedReason: reason ?? undefined },
          });
          navigatePricing(router, data.pricingScope ?? reason?.pricingScope ?? (isEnterpriseMode ? 'enterprise' : 'individual'));
          return false;
        }
      }

      return true;
    })
  );
};
