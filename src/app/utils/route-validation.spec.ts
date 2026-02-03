import { Routes } from '@angular/router';

import { entitlementRouteGuard } from '../guards/entitlement-route.guard';
import { validateEntitlementGuardRouteData } from './route-validation';

describe('validateEntitlementGuardRouteData', () => {
  it('throws when entitlementRouteGuard is present but data.entitlementKey is missing', () => {
    const routes: Routes = [
      {
        path: 'feature-x',
        canActivate: [entitlementRouteGuard],
        data: {},
      } as any,
    ];

    expect(() => validateEntitlementGuardRouteData(routes)).toThrow();
  });

  it('does not throw when entitlementRouteGuard is present and data.entitlementKey is set', () => {
    const routes: Routes = [
      {
        path: 'feature-x',
        canActivate: [entitlementRouteGuard],
        data: { entitlementKey: 'feature.x' },
      } as any,
    ];

    expect(() => validateEntitlementGuardRouteData(routes)).not.toThrow();
  });

  it('recursively scans children routes', () => {
    const routes: Routes = [
      {
        path: 'parent',
        children: [
          {
            path: 'child',
            canActivate: [entitlementRouteGuard],
            data: {},
          } as any,
        ],
      } as any,
    ];

    expect(() => validateEntitlementGuardRouteData(routes)).toThrow();
  });
});
