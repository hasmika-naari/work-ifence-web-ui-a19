import { Routes } from '@angular/router';

import { entitlementRouteGuard } from '../guards/entitlement-route.guard';

function hasEntitlementRouteGuard(route: any): boolean {
  const guards: unknown[] = [
    ...(route?.canActivate ?? []),
    ...(route?.canActivateChild ?? []),
  ];

  return guards.some((g) => g === entitlementRouteGuard || (typeof g === 'function' && g.name === 'entitlementRouteGuard'));
}

/**
 * DEV-ONLY SAFETY CHECK:
 * If a route uses `entitlementRouteGuard`, it MUST declare `data.entitlementKey`.
 *
 * This runs only in development (guarded by `!environment.production` at callsite)
 * and intentionally throws to surface misconfigurations early.
 */
export function validateEntitlementGuardRouteData(routes: Routes): void {
  /** @type {string[]} */
  const problems: string[] = [];

  const visit = (rs: Routes, parentPath: string) => {
    for (const r of rs) {
      const pathPart = (r.path ?? '').toString();
      const fullPath = `${parentPath}/${pathPart}`.replaceAll('//', '/');

      if (hasEntitlementRouteGuard(r)) {
        const key = (r.data as any)?.entitlementKey;
        const entitlementKey = (key ?? '').toString().trim();
        if (!entitlementKey) problems.push(fullPath || '/');
      }

      if (r.children?.length) visit(r.children, fullPath);
    }
  };

  visit(routes, '');

  if (problems.length) {
    // eslint-disable-next-line no-console
    console.error(
      '[route-validation] Misconfigured routes: entitlementRouteGuard requires data.entitlementKey',
      problems,
    );
    throw new Error(
      `Route configuration error: entitlementRouteGuard requires data.entitlementKey for: ${problems.join(', ')}`,
    );
  }
}
