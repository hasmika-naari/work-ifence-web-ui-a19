import { Route } from '@angular/router';

import { entitlementRouteGuard } from '../guards/entitlement-route.guard';
import type { EntitlementKey } from '../entitlements/entitlement-keys';

export function entitledRoute(entitlementKey: EntitlementKey, route: Route): Route {
  const existing = Array.isArray(route.canActivate) ? route.canActivate : route.canActivate ? [route.canActivate] : [];
  const canActivate = existing.includes(entitlementRouteGuard)
    ? existing
    : [entitlementRouteGuard, ...existing];

  return {
    ...route,
    canActivate,
    data: {
      ...(route.data ?? {}),
      entitlementKey,
    },
  };
}
