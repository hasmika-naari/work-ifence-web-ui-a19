import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { entitlementDenyReason, isEntitled, type EntitlementKey } from 'src/app/utils/entitlements';

export interface AccessGuardData {
  requireAuth?: boolean;
  requireMode?: 'ENTERPRISE' | 'PERSONAL' | 'ADMIN';
  requireEnterpriseAdmin?: boolean;
  requireEntitlement?: EntitlementKey;
}

function show(snackBar: MatSnackBar, message: string) {
  snackBar.open(message, 'OK', { duration: 3200 });
}

function navigatePricing(router: Router, scope?: 'enterprise' | 'personal') {
  if (scope) {
    void router.navigate(['/pricing'], { queryParams: { scope } });
    return;
  }
  void router.navigateByUrl('/pricing');
}

export const accessGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const accessFacade = inject(AccessFacadeService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const storage = inject(LocalStorageService);
  const platformId = inject(PLATFORM_ID);

  const data = (route.data ?? {}) as AccessGuardData;

  return accessFacade.accessMe$.pipe(
    take(1),
    map((me) => {
      // Auth check (best-effort). Most /user/* routes are already protected by AuthGuardService.
      if (data.requireAuth) {
        if (isPlatformBrowser(platformId)) {
          const auth = storage.getItem('authenticated');
          if (auth && auth.notoken === '') {
            show(snackBar, 'Please sign in to continue.');
            void router.navigateByUrl('/');
            return false;
          }
        }
      }

      const mode = (me?.mode ?? 'PERSONAL').toString();
      const isEnterprise = mode === 'ENTERPRISE_ADMIN' || mode === 'ENTERPRISE_EMPLOYEE';

      if (data.requireMode) {
        const ok =
          (data.requireMode === 'ADMIN' && mode === 'ADMIN') ||
          (data.requireMode === 'PERSONAL' && mode === 'PERSONAL') ||
          (data.requireMode === 'ENTERPRISE' && isEnterprise);

        if (!ok) {
          show(snackBar, 'This page is not available in the current dashboard context.');
          void router.navigateByUrl('/user/dashboard');
          return false;
        }
      }

      if (data.requireEnterpriseAdmin) {
        if (mode !== 'ENTERPRISE_ADMIN') {
          show(snackBar, 'Enterprise Admin access required.');
          void router.navigateByUrl('/user/dashboard');
          return false;
        }
      }

      if (data.requireEntitlement) {
        if (!isEntitled(me, data.requireEntitlement)) {
          show(snackBar, entitlementDenyReason(data.requireEntitlement));
          navigatePricing(router, isEnterprise ? 'enterprise' : 'personal');
          return false;
        }
      }

      return true;
    })
  );
};
