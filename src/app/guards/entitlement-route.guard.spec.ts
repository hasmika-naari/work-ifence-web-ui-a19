import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ENTITLEMENT_KEYS } from '../entitlements/entitlement-keys';
import { entitlementRouteGuard } from './entitlement-route.guard';
import { EntitlementService } from '../services/entitlement.service';
import { environment } from '../../environments/environment';

describe('entitlementRouteGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let entitlement: jasmine.SpyObj<EntitlementService>;
  const originalProduction = environment.production;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    entitlement = jasmine.createSpyObj<EntitlementService>('EntitlementService', ['canAccess']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: EntitlementService, useValue: entitlement },
      ],
    });
  });

  afterEach(() => {
    environment.production = originalProduction;
  });

  it('denies in dev when entitlementKey is missing (warns)', () => {
    environment.production = false;
    spyOn(console, 'warn');

    const route = { data: {} } as any;
    const state = { url: '/somewhere' } as any;

    const result = TestBed.runInInjectionContext(() => entitlementRouteGuard(route, state));

    expect(result).toBeFalse();
    expect(console.warn).toHaveBeenCalled();
  });

  it('denies in production when entitlementKey is missing (errors)', () => {
    environment.production = true;
    spyOn(console, 'error');

    const route = { data: {} } as any;
    const state = { url: '/somewhere' } as any;

    const result = TestBed.runInInjectionContext(() => entitlementRouteGuard(route, state));

    expect(result).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('allows when entitlement service grants access', () => {
    environment.production = false;
    entitlement.canAccess.and.returnValue(true);

    const route = { data: { entitlementKey: ENTITLEMENT_KEYS.JOB_TRACKING } } as any;
    const state = { url: '/feature-x' } as any;

    const result = TestBed.runInInjectionContext(() => entitlementRouteGuard(route, state));

    expect(entitlement.canAccess).toHaveBeenCalledWith(ENTITLEMENT_KEYS.JOB_TRACKING, undefined);
    expect(result).toBeTrue();
  });

  it('redirects to upgrade when entitlement service denies access', () => {
    environment.production = false;
    entitlement.canAccess.and.returnValue(false);
    const urlTree = {} as any;
    router.createUrlTree.and.returnValue(urlTree);

    const route = { data: { entitlementKey: ENTITLEMENT_KEYS.JOB_TRACKING } } as any;
    const state = { url: '/feature-x' } as any;

    const result = TestBed.runInInjectionContext(() => entitlementRouteGuard(route, state));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/user/billing/upgrade'], {
      queryParams: {
        feature: ENTITLEMENT_KEYS.JOB_TRACKING,
        returnUrl: '/feature-x',
      },
    });
    expect(result).toBe(urlTree);
  });
});
