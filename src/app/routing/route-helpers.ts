import { Route } from '@angular/router';

import { entitlementRouteGuard } from '../guards/entitlement-route.guard';
import type { EntitlementKey } from '../entitlements/entitlement-keys';

export function dashboardRouteForRole(activeRoleKey: string): string {
  const normalized = (activeRoleKey ?? '').toString().trim().toUpperCase();
  return normalized === 'ROLE_ADMIN' || normalized === 'PLATFORM_ADMIN'
    ? '/user/dashboard-admin'
    : '/user/dashboard';
}

export function entitledRoute(entitlementKey: EntitlementKey, route: Route): Route {
  const rawEntitlementKey = (entitlementKey ?? '').toString().trim();
  const currentMode = (route.data?.['requireMode'] ?? '').toString().trim().toUpperCase();
  const normalizedRequireMode = currentMode === 'ADMIN' || currentMode === 'PERSONAL'
    ? currentMode
    : (rawEntitlementKey.toUpperCase().startsWith('ADMIN_') ? 'ADMIN' : 'PERSONAL');

  const existing = Array.isArray(route.canActivate) ? route.canActivate : route.canActivate ? [route.canActivate] : [];
  const canActivate = existing.includes(entitlementRouteGuard)
    ? existing
    : [entitlementRouteGuard, ...existing];

  return {
    ...route,
    canActivate,
    data: {
      ...(route.data ?? {}),
      requireAuth: true,
      requireMode: normalizedRequireMode,
      entitlementKey: rawEntitlementKey,
    },
  };
}
