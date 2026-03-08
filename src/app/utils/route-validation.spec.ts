import { Routes } from '@angular/router';

import { ENTITLEMENT_KEYS } from '../entitlements/entitlement-keys';
import { entitlementRouteGuard } from '../guards/entitlement-route.guard';
import { validateEntitlementGuardRouteData } from './route-validation';

describe('validateEntitlementGuardRouteData', () => {
  it('does not throw when entitlementRouteGuard is present and data.entitlementKey is set', () => {
    const routes: Routes = [
      {
        path: 'feature-x',
        canActivate: [entitlementRouteGuard],
        data: { entitlementKey: ENTITLEMENT_KEYS.JOB_TRACKING },
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
            data: { entitlementKey: ENTITLEMENT_KEYS.USER_DASHBOARD },
          } as any,
        ],
      } as any,
    ];

    expect(() => validateEntitlementGuardRouteData(routes)).not.toThrow();
  });
});
