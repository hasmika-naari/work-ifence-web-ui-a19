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
      const isEnterprise = mode === 'ENTERPRISE_ADMIN' || mode === 'ENTERPRISE_EMPLOYEE';
      const isAdmin = accessFacade.isAdmin(me);

      if (data.requireFlag) {
        if (!remoteConfig.isFlagEnabled(data.requireFlag)) {
          const msg = 'This feature is temporarily disabled.';
          show(snackBar, msg);
          telemetry.recordGateDenied({
            requestPath: state.url,
            denialType: 'FLAG',
            message: msg,
            details: { requireFlag: data.requireFlag },
          });

          if (me?.userId) {
            void router.navigateByUrl('/user/dashboard');
          } else {
            void router.navigateByUrl('/');
          }

          return false;
        }
      }

      if (data.requireMode) {
        const ok =
          (data.requireMode === 'ADMIN' && isAdmin) ||
          (data.requireMode === 'PERSONAL' && mode === 'PERSONAL') ||
          (data.requireMode === 'ENTERPRISE' && isEnterprise);

        if (!ok) {
          if (data.requireMode === 'ADMIN') {
            const msg = 'Admin access required.';
            show(snackBar, msg);
            telemetry.recordGateDenied({
              requestPath: state.url,
              denialType: 'MODE',
              message: msg,
              details: { requireMode: data.requireMode, actualMode: mode },
            });
          } else {
            const msg = 'This page is not available in the current dashboard context.';
            show(snackBar, msg);
            telemetry.recordGateDenied({
              requestPath: state.url,
              denialType: 'MODE',
              message: msg,
              details: { requireMode: data.requireMode, actualMode: mode },
            });
          }
          void router.navigateByUrl('/user/dashboard');
          return false;
        }
      }

      if (data.requireEnterpriseAdmin) {
        if (mode !== 'ENTERPRISE_ADMIN') {
          const msg = 'Enterprise Admin access required.';
          show(snackBar, msg);
          telemetry.recordGateDenied({
            requestPath: state.url,
            denialType: 'ENTERPRISE_ADMIN',
            message: msg,
            details: { requireEnterpriseAdmin: true, actualMode: mode },
          });
          void router.navigateByUrl('/user/dashboard');
          return false;
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
            pricingScope: data.pricingScope ?? (isEnterprise ? 'enterprise' : 'individual'),
            message: msg,
            details: { requireEntitlement: data.requireEntitlement },
          });
          navigatePricing(router, data.pricingScope ?? (isEnterprise ? 'enterprise' : 'individual'));
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
            pricingScope: data.pricingScope ?? reason?.pricingScope ?? (isEnterprise ? 'enterprise' : 'individual'),
            message: msg,
            details: { requireFeature: data.requireFeature, deniedReason: reason ?? undefined },
          });
          navigatePricing(router, data.pricingScope ?? reason?.pricingScope ?? (isEnterprise ? 'enterprise' : 'individual'));
          return false;
        }
      }

      return true;
    })
  );
};
