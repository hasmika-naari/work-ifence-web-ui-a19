import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, from, map, of, switchMap, take } from 'rxjs';
import { EntitlementService } from '../services/entitlement.service';
import { AccessFacadeService } from '../facades/access-facade.service';
import { PlanTier } from '../nav/nav.model';
import { ActiveProfileStore } from 'src/app/auth/active-profile.store';
import { AccessContextService } from 'src/app/services/access-context.service';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';
import { AccessContextStore } from 'src/app/core/store/access-context.store';
import { environment } from 'src/environments/environment';

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

function normalizeRoleKey(value: unknown): string {
  return (value ?? '').toString().trim().toUpperCase();
}

function resolveFallbackProfileKey(profileContextStorage: ProfileContextStorageService): string {
  return normalizeRoleKey(profileContextStorage.getActiveProfileKey()) || 'ROLE_USER';
}

function resolveFallbackMode(profileContextStorage: ProfileContextStorageService, activeProfileKey: string): string {
  return normalizeRoleKey(profileContextStorage.getMode(undefined, activeProfileKey)) || 'PERSONAL';
}

function normalizePath(url: string): string {
  return (url ?? '').toString().split('?')[0].split('#')[0];
}

export const entitlementRouteGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const entitlement = inject(EntitlementService);
  const accessFacade = inject(AccessFacadeService);
  const router = inject(Router);
  const activeProfileStore = inject(ActiveProfileStore);
  const accessContext = inject(AccessContextService);
  const profileContextStorage = inject(ProfileContextStorageService);
  const accessContextStore = inject(AccessContextStore);

  console.log('[ENT_GUARD_START]', {
    url: state.url,
    routeData: route.data,
  });

  const data = (route.data ?? {}) as EntitlementRouteData;
  const minPlan = toPlanTier(data.minPlan);

  // 1. Authentication Check
  if (!accessFacade.isLoggedIn()) {
    // Redirect unauthenticated users to login with returnUrl
    return router.createUrlTree(['/sign-in'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return accessContextStore.init().pipe(
    catchError(() => of(void 0)),
    switchMap(() => accessContext.ensureAccessContextLoaded()),
    take(1),
    switchMap((loadedMe) => from(entitlement.ensureLoaded()).pipe(
      catchError(() => of(void 0)),
      map(() => {
        const snapshot = entitlement.getSnapshot();
        console.log('[ENT_GUARD_SNAPSHOT]', {
          loaded: snapshot.loaded,
          planTier: snapshot.planTier,
          entitlementsCount: Object.keys(snapshot.entitlements || {}).length,
          hasAdminConsole: entitlement.canAccess('ADMIN_CONSOLE'),
        });

        const requiredKey = (route.data?.['entitlementKey'] ?? '').toString().trim();
        const entitlementValue = requiredKey ? entitlement.canAccess(requiredKey, minPlan) : true;

        if (!requiredKey) {
          return true;
        }

        if (entitlementValue) {
          return true;
        }

        // Final log before redirect
        console.warn('[DENY]', {
          guard: 'entitlementRouteGuard',
          url: state.url,
          reason: 'ENTITLEMENT',
          requiredKey,
          entitlementValue
        });
        return router.createUrlTree(['/unauthorized']);
      })
    ))
  );
};
