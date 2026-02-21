import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { catchError, filter, timeout } from 'rxjs/operators';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
// Removed entitlement and feature imports
import { ActiveProfileStore } from 'src/app/auth/active-profile.store';
import { AccessContextService } from 'src/app/services/access-context.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { getLandingRoute } from 'src/app/routing/landing-route.util';
import type { AccessMeDto } from 'src/app/models/access-me.model';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';
import { AccessContextStore } from 'src/app/core/store/access-context.store';
import { environment } from 'src/environments/environment';

export interface AccessGuardData {
  requireAuth?: boolean;
  requireMode?: 'ENTERPRISE' | 'PERSONAL' | 'ADMIN';
  requireProfileKey?: string;
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

function resolveHomeRoute(me: AccessMeDto, activeProfileKey: string, mode: string): string {
  const normalized = normalizeRoleKey(activeProfileKey);
  const normalizedMode = normalizeRoleKey(mode);
  if (normalized === 'ROLE_ADMIN' || normalized === 'PLATFORM_ADMIN' || normalizedMode === 'ADMIN') {
    return '/user/dashboard-admin';
  }
  if (normalized === 'ROLE_USER' || normalizedMode === 'PERSONAL') {
    return '/user/dashboard';
  }
  return getLandingRoute(normalized || 'ROLE_USER');
}

function show(snackBar: MatSnackBar | null, message: string) {
  if (!snackBar) return;
  snackBar.open(message, 'OK', { duration: 3200 });
}

// Removed navigatePricing (no longer needed)

// Removed hasAllowedEntitlementInNavbar (no longer needed)

// Removed collectAllowedEntitlementKeys (no longer needed)

function warnDeny(
  url: string,
  requireMode: AccessGuardData['requireMode'] | undefined,
  entitlementKey: string | undefined,
  activeProfileKey: string,
  mode: string,
): void {
  console.warn('[accessGuard] DENY', {
    url,
    requireMode,
    entitlementKey,
    activeProfileKey,
    mode,
  });
}

function logAccessDecision(kind: 'ALLOW' | 'DENY', payload: Record<string, unknown>): void {
  const message = '[accessGuard] decision';
  if (kind === 'ALLOW') {
    console.info(message, payload);
    return;
  }
  console.warn(message, payload);
}

function logGuardDebug(
  url: string,
  requireMode: AccessGuardData['requireMode'] | undefined,
  actualMode: string,
  allowed: boolean,
): void {
  if (environment.production) return;
  console.debug(
    `[ACCESS_ONLY] url=${url || ''}, requireMode=${(requireMode ?? '').toString()}, actualMode=${actualMode || ''}, allowed=${allowed}`,
  );
}

function logAccessGuardDecision(url: string, allow: boolean): void {
  console.log('[ACCESS_ONLY_DECISION]', {
    url,
    allow,
  });
}
export const accessGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const storage = inject(LocalStorageService);
  const platformId = inject(PLATFORM_ID);
  const profileContextStorage = inject(ProfileContextStorageService);

  const data = (route.data ?? {}) as AccessGuardData;

  console.log('[ACCESS_ONLY_START]', {
    url: state.url,
    routeData: route.data,
  });

  const profile = profileContextStorage.getCurrent();
  console.log('[ACCESS_ONLY_PROFILE]', profile);

  return of(true).pipe(
    map(() => {
      // Auth check
      if (data.requireAuth) {
        if (isPlatformBrowser(platformId)) {
          const auth = storage.getItem('authenticated');
          if (auth !== true) {
            console.warn('[DENY]', {
              guard: 'accessGuard',
              url: state.url,
              reason: 'AUTH_OR_MODE',
              requireMode: data.requireMode,
              actualMode: undefined,
            });
            logAccessGuardDecision(state.url, false);
            void router.navigateByUrl('/');
            return false;
          }
        }
      }

      // Mode check
      if (data.requireMode) {
        const actualMode = normalizeRoleKey(profile?.mode);
        const ok =
          (data.requireMode === 'ADMIN' && actualMode === 'ADMIN') ||
          (data.requireMode === 'PERSONAL' && actualMode === 'PERSONAL') ||
          (data.requireMode === 'ENTERPRISE' && actualMode.startsWith('ENTERPRISE'));

        logGuardDebug(state.url, data.requireMode, actualMode, ok);

        if (!ok) {
          console.warn('[DENY]', {
            guard: 'accessGuard',
            url: state.url,
            reason: 'AUTH_OR_MODE',
            requireMode: data.requireMode,
            actualMode,
          });
          logAccessGuardDecision(state.url, false);
          return router.createUrlTree([
            resolveHomeRoute(
              {} as AccessMeDto,
              profile?.activeProfileKey ?? '',
              actualMode ?? ''
            )
          ]);
        }
      }

      // Profile key check (optional)
      if (data.requireProfileKey) {
        const actualProfileKey = normalizeRoleKey(profile?.activeProfileKey);
        const requiredProfileKey = normalizeRoleKey(data.requireProfileKey);
        if (actualProfileKey !== requiredProfileKey) {
          console.warn('[DENY]', {
            guard: 'accessGuard',
            url: state.url,
            reason: 'AUTH_OR_MODE',
            requireMode: data.requireMode,
            actualMode: normalizeRoleKey(profile?.mode),
          });
          logAccessGuardDecision(state.url, false);
          return router.createUrlTree(['/unauthorized']);
        }
      }

      logGuardDebug(state.url, data.requireMode, normalizeRoleKey(profile?.mode), true);
      logAccessGuardDecision(state.url, true);
      return true;
    })
  );
};
