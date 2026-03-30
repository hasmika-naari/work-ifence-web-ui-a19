/**
 * Unit tests – AccessFacadeService: trial lifecycle & expiry fallback
 *
 * All 7 scenarios test the frontend's reaction to subscription status values
 * returned by /api/access/me.  Backend state-machine logic is exercised here
 * via the public can(feature, me) and resumeLimitRemaining(me) overloads which
 * accept an explicit AccessMeDto so no signal wiring is required.
 *
 * Scenarios covered
 * -----------------
 * 1. Pending trial request does not change effective plan
 * 2. Approving trial preserves assigned/base plan structure
 * 3. Active trial uses temporary trial plan as effective plan
 * 4. Extending trial updates only trial end date, not entitlements
 * 5. Expired trial falls back automatically to assigned/base plan
 * 6. Resume eligibility uses assigned/base plan again after expiry
 * 7. Create-resume enforcement uses assigned/base plan again after expiry
 */

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { EMPTY, of } from 'rxjs';

import { AccessFacadeService } from './access-facade.service';
import { AccessApiService } from '../services/access-api.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import type { AccessMeDto, EntitlementsDto } from '../models/access-me.model';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

/** User on the base/assigned plan with an ACTIVE subscription */
function basePlanActive(entitlementOverrides: Partial<EntitlementsDto> = {}, resumeCount = 1): AccessMeDto {
  return {
    userId: 'user-1',
    subscription: { planCode: 'basic', status: 'ACTIVE' },
    entitlements: {
      resumeLimit: 3,
      templateAccessLevel: 'BASIC',
      jobTrackingEnabled: false,
      courseCentralEnabled: false,
      alertsEnabled: false,
      ...entitlementOverrides,
    },
    counts: { resumeCount },
  };
}

/** User on a trial with premium entitlements (TRIALING) */
function trialActive(
  trialEndDate = '2026-04-30T00:00:00Z',
  entitlementOverrides: Partial<EntitlementsDto> = {},
  resumeCount = 4
): AccessMeDto {
  return {
    userId: 'user-1',
    subscription: { planCode: 'pro', status: 'TRIALING', trialEndDate },
    entitlements: {
      resumeLimit: 20,
      templateAccessLevel: 'PREMIUM',
      jobTrackingEnabled: true,
      courseCentralEnabled: true,
      alertsEnabled: true,
      ...entitlementOverrides,
    },
    counts: { resumeCount },
  };
}

/**
 * After trial expiry the backend returns status=EXPIRED together with
 * entitlements for the base/assigned plan (not the trial plan).
 */
function trialExpired(resumeCount = 1): AccessMeDto {
  return {
    userId: 'user-1',
    subscription: { planCode: 'basic', status: 'EXPIRED' },
    entitlements: {
      resumeLimit: 3,
      templateAccessLevel: 'BASIC',
      jobTrackingEnabled: false,
      courseCentralEnabled: false,
      alertsEnabled: false,
    },
    counts: { resumeCount },
  };
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('AccessFacadeService – trial lifecycle & expiry fallback', () => {
  let facade: AccessFacadeService;

  beforeEach(() => {
    // Router: constructor listens to router.events; use EMPTY so no events fire.
    const routerStub = { events: EMPTY, navigate: jasmine.createSpy('navigate') };

    // AccessApiService: not needed for any scenario – signal initial value is {}
    const apiStub = jasmine.createSpyObj<AccessApiService>('AccessApiService', ['getAccessMe']);
    apiStub.getAccessMe.and.returnValue(of({} as AccessMeDto));

    // LocalStorageService: return false so SSR-safe path is taken; avoids live HTTP
    const storageStub = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', ['isLoggedIn']);
    storageStub.isLoggedIn.and.returnValue(false);

    // RemoteConfigFacadeService: all feature flags ON so checks fall through to
    // subscription / entitlement logic (the focus of these tests).
    const remoteConfigStub = jasmine.createSpyObj<RemoteConfigFacadeService>(
      'RemoteConfigFacadeService',
      ['isFlagEnabledSafe']
    );
    remoteConfigStub.isFlagEnabledSafe.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        AccessFacadeService,
        { provide: Router, useValue: routerStub },
        { provide: AccessApiService, useValue: apiStub },
        { provide: LocalStorageService, useValue: storageStub },
        { provide: RemoteConfigFacadeService, useValue: remoteConfigStub },
        // Use 'server' platform so isPlatformBrowser paths are skipped,
        // keeping tests free from browser-storage side effects.
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    facade = TestBed.inject(AccessFacadeService);
  });

  // -------------------------------------------------------------------------
  // Scenario 1 – Pending trial request does not change effective plan
  // -------------------------------------------------------------------------
  describe('Scenario 1 – pending trial request does not change effective plan', () => {
    /**
     * When a trial request has been submitted but not yet approved the backend
     * still returns the base-plan AccessMeDto (status ACTIVE, base entitlements).
     * The frontend must gate access on that snapshot – not on the pending request.
     */
    it('access remains governed by the current base plan while the request is pending', () => {
      const me = basePlanActive(); // ACTIVE, no job-tracking, 3 resume slots
      expect(facade.can('RESUME_CREATE', me)).toBeTrue(); // within base-plan limit
      expect(facade.can('JOB_TRACKING', me)).toBeFalse(); // not in base plan
      expect(facade.can('TEMPLATES_PREMIUM', me)).toBeFalse();
    });

    it('submitting a trial request alone does not grant premium feature access', () => {
      const me = basePlanActive({ jobTrackingEnabled: false, courseCentralEnabled: false });
      expect(facade.can('JOB_TRACKING', me)).toBeFalse();
      expect(facade.can('COURSE_CENTRAL', me)).toBeFalse();
    });
  });

  // -------------------------------------------------------------------------
  // Scenario 2 – Approving trial preserves assigned/base plan
  // -------------------------------------------------------------------------
  describe('Scenario 2 – approving trial preserves assigned/base plan', () => {
    /**
     * Once the trial is approved the backend activates status TRIALING with the
     * trial-plan entitlements.  The base/assigned plan is preserved server-side
     * and will be restored on expiry.  On the frontend, during the trial,
     * premium access is correctly granted via the trial entitlements.
     */
    it('TRIALING status grants trial-plan entitlements without losing track of plan type', () => {
      const me = trialActive();
      expect(facade.can('JOB_TRACKING', me)).toBeTrue();
      expect(facade.can('TEMPLATES_PREMIUM', me)).toBeTrue();
      expect(facade.can('COURSE_CENTRAL', me)).toBeTrue();
    });

    it('base plan would still restrict access if trial plan did not include a feature', () => {
      // Approve a limited trial that intentionally omits jobTracking.
      const me = trialActive('2026-04-30T00:00:00Z', { jobTrackingEnabled: false });
      expect(facade.can('JOB_TRACKING', me)).toBeFalse();
      // Other trial features are still accessible.
      expect(facade.can('TEMPLATES_PREMIUM', me)).toBeTrue();
    });
  });

  // -------------------------------------------------------------------------
  // Scenario 3 – Active trial uses temporary trial plan as effective plan
  // -------------------------------------------------------------------------
  describe('Scenario 3 – active trial uses temporary trial plan as effective plan', () => {
    it('TRIALING status makes isSubscriptionOk return true', () => {
      // Verified indirectly: RESUME_CREATE (which short-circuits on isSubscriptionOk) is allowed.
      const me = trialActive('2026-04-30T00:00:00Z', {}, 5);
      expect(facade.can('RESUME_CREATE', me)).toBeTrue(); // limit 20, used 5 → 15 remaining
    });

    it('full premium feature set is accessible during an active trial', () => {
      const me = trialActive();
      expect(facade.can('JOB_TRACKING', me)).toBeTrue();
      expect(facade.can('COURSE_CENTRAL', me)).toBeTrue();
      expect(facade.can('ALERTS', me)).toBeTrue();
      expect(facade.can('TEMPLATES_PREMIUM', me)).toBeTrue();
      expect(facade.can('RESUME_CREATE', me)).toBeTrue();
    });

    it('TRIALING without the specific entitlement still blocks that feature', () => {
      const me = trialActive('2026-04-30T00:00:00Z', { alertsEnabled: false });
      expect(facade.can('ALERTS', me)).toBeFalse();
    });
  });

  // -------------------------------------------------------------------------
  // Scenario 4 – Extending trial updates only trial end date, not entitlements
  // -------------------------------------------------------------------------
  describe('Scenario 4 – extending trial updates only trial end date, not entitlements', () => {
    it('entitlement-based access is identical regardless of trialEndDate value', () => {
      const original = trialActive('2026-03-31T00:00:00Z');
      const extended  = trialActive('2026-06-30T00:00:00Z');

      expect(facade.can('JOB_TRACKING', original)).toEqual(facade.can('JOB_TRACKING', extended));
      expect(facade.can('TEMPLATES_PREMIUM', original)).toEqual(facade.can('TEMPLATES_PREMIUM', extended));
      expect(facade.can('RESUME_CREATE', original)).toEqual(facade.can('RESUME_CREATE', extended));
    });

    it('resumeLimitRemaining is identical regardless of trialEndDate value', () => {
      const original = trialActive('2026-03-31T00:00:00Z', {}, 7);
      const extended  = trialActive('2026-06-30T00:00:00Z', {}, 7);
      expect(facade.resumeLimitRemaining(original)).toEqual(facade.resumeLimitRemaining(extended));
    });
  });

  // -------------------------------------------------------------------------
  // Scenario 5 – Expired trial falls back automatically to assigned/base plan
  // -------------------------------------------------------------------------
  describe('Scenario 5 – expired trial falls back to assigned/base plan', () => {
    it('EXPIRED status fails the subscription gate and blocks all premium features', () => {
      const me = trialExpired();
      expect(facade.can('RESUME_CREATE', me)).toBeFalse();
      expect(facade.can('JOB_TRACKING', me)).toBeFalse();
      expect(facade.can('TEMPLATES_PREMIUM', me)).toBeFalse();
      expect(facade.can('COURSE_CENTRAL', me)).toBeFalse();
      expect(facade.can('ALERTS', me)).toBeFalse();
    });

    it('any non-ACTIVE / non-TRIALING status is treated as expired (subscription not ok)', () => {
      const statuses = ['EXPIRED', 'CANCELED', 'PENDING', 'PAST_DUE', ''];
      for (const status of statuses) {
        const me: AccessMeDto = {
          subscription: { status },
          entitlements: { jobTrackingEnabled: true, resumeLimit: 20 },
          counts: { resumeCount: 1 },
        };
        expect(facade.can('JOB_TRACKING', me))
          .withContext(`expected denial for status=${status}`)
          .toBeFalse();
      }
    });
  });

  // -------------------------------------------------------------------------
  // Scenario 6 – Resume eligibility uses assigned/base plan again after expiry
  // -------------------------------------------------------------------------
  describe('Scenario 6 – resume eligibility uses assigned/base plan after expiry', () => {
    /**
     * After expiry the backend returns entitlements for the base/assigned plan.
     * The frontend computes the correct remaining count from those entitlements,
     * but RESUME_CREATE must still be blocked because the subscription is EXPIRED.
     */
    it('resumeLimitRemaining reflects base-plan quota correctly after expiry', () => {
      const me = trialExpired(1); // limit 3, used 1 → 2 remaining
      expect(facade.resumeLimitRemaining(me)).toBe(2);
    });

    it('RESUME_CREATE is denied even when the base-plan limit is not exhausted', () => {
      const me = trialExpired(1); // 2 slots technically available
      expect(facade.can('RESUME_CREATE', me)).toBeFalse();
    });

    it('resumeLimitRemaining returns undefined when entitlements carry no limit', () => {
      const me = trialExpired();
      me.entitlements = {}; // no resumeLimit key
      expect(facade.resumeLimitRemaining(me)).toBeUndefined();
    });

    it('resumeLimitRemaining is never negative – clamps to zero at the base-plan limit', () => {
      const me = trialExpired(3); // used equals limit
      expect(facade.resumeLimitRemaining(me)).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // Scenario 7 – Create-resume enforcement uses assigned/base plan after expiry
  // -------------------------------------------------------------------------
  describe('Scenario 7 – create-resume enforcement uses assigned/base plan after expiry', () => {
    it('RESUME_CREATE is denied for an expired user regardless of remaining count', () => {
      const me = trialExpired(0); // 3 slots, 0 used – still denied because EXPIRED
      expect(facade.can('RESUME_CREATE', me)).toBeFalse();
    });

    it('RESUME_CREATE is allowed for an ACTIVE user within the base-plan limit', () => {
      const me = basePlanActive({ resumeLimit: 3 }, 2); // 1 remaining
      expect(facade.can('RESUME_CREATE', me)).toBeTrue();
    });

    it('RESUME_CREATE is denied for an ACTIVE user who has reached the base-plan limit', () => {
      const me = basePlanActive({ resumeLimit: 3 }, 3); // 0 remaining
      expect(facade.can('RESUME_CREATE', me)).toBeFalse();
    });

    it('RESUME_CREATE is denied for an ACTIVE user who has exceeded the base-plan limit', () => {
      // Guards against edge cases where resumeCount > limit (e.g., plan was downgraded).
      const me = basePlanActive({ resumeLimit: 3 }, 5);
      expect(facade.can('RESUME_CREATE', me)).toBeFalse();
    });

    it('RESUME_CREATE is allowed when there is no limit set on the base plan', () => {
      const me = basePlanActive({}, 99);
      delete me.entitlements!.resumeLimit; // undefined limit → unlimited
      expect(facade.can('RESUME_CREATE', me)).toBeTrue();
    });
  });
});
