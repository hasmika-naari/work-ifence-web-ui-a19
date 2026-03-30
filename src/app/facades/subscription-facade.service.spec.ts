/**
 * Unit tests – SubscriptionFacadeService.trialStatus
 *
 * trialStatus is the single-source-of-truth computed for trial state consumed
 * by the upgrade drawer, dashboard banner, and any future component.
 *
 * Scenarios covered
 * -----------------
 *  User – eligibility
 *   1.  isTrialing is false with no subscription
 *   2.  isTrialing is true only when status === TRIALING
 *   3.  isTrialing is false when status === ACTIVE
 *   4.  trialStatus reacts to a signal update (ACTIVE → TRIALING)
 *
 *  User – expiry detection
 *   5.  isExpired is false with no status
 *   6.  isExpired is false when ACTIVE
 *   7.  isExpired is false when TRIALING
 *   8.  isExpired is true when EXPIRED
 *   9.  isExpired is true for any non-ACTIVE / non-TRIALING status value
 *
 *  User – daysRemaining
 *  10.  daysRemaining is null when not trialing
 *  11.  daysRemaining is null when trialing but no trialEndDate
 *  12.  daysRemaining is a correct positive integer for a future trialEndDate
 *  13.  daysRemaining clamps to 0 for a past trialEndDate while still TRIALING
 *
 *  User – plan code fields
 *  14.  assignedPlanCode matches subscription planCode for ACTIVE subscriptions
 *  15.  trialPlanCode is populated when TRIALING
 *  16.  trialPlanCode is undefined when not TRIALING
 *  17.  trialEndDate is surfaced through the summary when TRIALING
 */

import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { SubscriptionFacadeService } from './subscription-facade.service';
import { AccessFacadeService } from './access-facade.service';
import { SubscriptionApiService } from '../services/subscription-api.service';
import { DashboardContextService } from '../services/dashboard-context.service';
import type { AccessMeDto } from '../models/access-me.model';
import type { WifenceSubscription } from '../models/subscription.model';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

let meSignal: ReturnType<typeof signal<AccessMeDto>>;

function sub(overrides: Partial<WifenceSubscription> = {}): AccessMeDto {
  return { subscription: { status: 'ACTIVE', ...overrides } } as AccessMeDto;
}

function setup(initialMe: AccessMeDto = {} as AccessMeDto): SubscriptionFacadeService {
  meSignal = signal<AccessMeDto>(initialMe);

  const accessFacadeStub: Partial<AccessFacadeService> = {
    accessMeSignal: meSignal as any,
    reload: jasmine.createSpy('reload'),
  };

  const apiStub: Partial<SubscriptionApiService> = {
    getActivePlans: jasmine.createSpy('getActivePlans').and.returnValue(of([])),
    getMyPlanRequests: jasmine.createSpy('getMyPlanRequests').and.returnValue(of([])),
    startSubscription: jasmine.createSpy('startSubscription').and.returnValue(of({})),
    submitUpgradeRequest: jasmine.createSpy('submitUpgradeRequest').and.returnValue(of({})),
    submitPlanRequest: jasmine.createSpy('submitPlanRequest').and.returnValue(of({})),
  };

  const dashboardContextStub = { context: () => 'PERSONAL' as any };

  TestBed.configureTestingModule({
    providers: [
      SubscriptionFacadeService,
      { provide: AccessFacadeService,      useValue: accessFacadeStub     },
      { provide: SubscriptionApiService,   useValue: apiStub               },
      { provide: DashboardContextService,  useValue: dashboardContextStub  },
    ],
  });

  return TestBed.inject(SubscriptionFacadeService);
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

describe('SubscriptionFacadeService – trialStatus: user eligibility (isTrialing)', () => {
  it('isTrialing is false when there is no subscription object', () => {
    const facade = setup({} as AccessMeDto);
    expect(facade.trialStatus().isTrialing).toBeFalse();
  });

  it('isTrialing is true when status is TRIALING', () => {
    const facade = setup(sub({ status: 'TRIALING' }));
    expect(facade.trialStatus().isTrialing).toBeTrue();
  });

  it('isTrialing is false when status is ACTIVE', () => {
    const facade = setup(sub({ status: 'ACTIVE' }));
    expect(facade.trialStatus().isTrialing).toBeFalse();
  });

  it('reacts to signal update: ACTIVE → TRIALING (single source of truth updates all consumers)', () => {
    const facade = setup(sub({ status: 'ACTIVE' }));
    expect(facade.trialStatus().isTrialing).toBeFalse();

    meSignal.set(sub({ status: 'TRIALING', trialEndDate: '2026-06-01T00:00:00Z' }));
    expect(facade.trialStatus().isTrialing).toBeTrue();
  });

  it('reacts to signal update: TRIALING → EXPIRED', () => {
    const facade = setup(sub({ status: 'TRIALING', trialEndDate: '2026-05-01T00:00:00Z' }));
    expect(facade.trialStatus().isTrialing).toBeTrue();

    meSignal.set(sub({ status: 'EXPIRED' }));
    expect(facade.trialStatus().isTrialing).toBeFalse();
    expect(facade.trialStatus().isExpired).toBeTrue();
  });
});

describe('SubscriptionFacadeService – trialStatus: user expiry detection (isExpired)', () => {
  it('isExpired is false when there is no status at all', () => {
    const facade = setup({} as AccessMeDto);
    expect(facade.trialStatus().isExpired).toBeFalse();
  });

  it('isExpired is false when ACTIVE', () => {
    const facade = setup(sub({ status: 'ACTIVE' }));
    expect(facade.trialStatus().isExpired).toBeFalse();
  });

  it('isExpired is false when TRIALING', () => {
    const facade = setup(sub({ status: 'TRIALING' }));
    expect(facade.trialStatus().isExpired).toBeFalse();
  });

  it('isExpired is true when EXPIRED', () => {
    const facade = setup(sub({ status: 'EXPIRED' }));
    expect(facade.trialStatus().isExpired).toBeTrue();
  });

  it('isExpired is true for each non-ACTIVE/non-TRIALING status value', () => {
    const statuses = ['CANCELED', 'PAST_DUE', 'SUSPENDED', 'PENDING', 'UNKNOWN'];
    for (const status of statuses) {
      const facade = setup(sub({ status }));
      expect(facade.trialStatus().isExpired)
        .withContext(`status="${status}"`)
        .toBeTrue();
    }
  });
});

describe('SubscriptionFacadeService – trialStatus: user daysRemaining', () => {
  it('daysRemaining is null when status is ACTIVE', () => {
    const facade = setup(sub({ status: 'ACTIVE' }));
    expect(facade.trialStatus().daysRemaining).toBeNull();
  });

  it('daysRemaining is null when TRIALING but no trialEndDate is set', () => {
    const facade = setup(sub({ status: 'TRIALING' }));
    expect(facade.trialStatus().daysRemaining).toBeNull();
  });

  it('daysRemaining is a correct positive integer for a future trialEndDate', () => {
    // Place end date 10 days from now; allow ±1 day for timing.
    const futureDate = new Date(Date.now() + 10 * 86_400_000).toISOString();
    const facade = setup(sub({ status: 'TRIALING', trialEndDate: futureDate }));
    const days = facade.trialStatus().daysRemaining;
    expect(days).not.toBeNull();
    expect(days!).toBeGreaterThanOrEqual(9);
    expect(days!).toBeLessThanOrEqual(11);
  });

  it('daysRemaining clamps to 0 for an already-past trialEndDate while still TRIALING', () => {
    const facade = setup(sub({ status: 'TRIALING', trialEndDate: '2020-01-01T00:00:00Z' }));
    expect(facade.trialStatus().daysRemaining).toBe(0);
  });
});

describe('SubscriptionFacadeService – trialStatus: plan code fields', () => {
  it('assignedPlanCode matches subscription planCode for an ACTIVE subscription', () => {
    const facade = setup(sub({ status: 'ACTIVE', planCode: 'basic' }));
    expect(facade.trialStatus().assignedPlanCode).toBe('basic');
  });

  it('trialPlanCode is set to planCode when TRIALING', () => {
    const facade = setup(sub({ status: 'TRIALING', planCode: 'pro', trialEndDate: '2026-06-01T00:00:00Z' }));
    expect(facade.trialStatus().trialPlanCode).toBe('pro');
  });

  it('trialPlanCode is undefined when not TRIALING', () => {
    const facade = setup(sub({ status: 'ACTIVE', planCode: 'basic' }));
    expect(facade.trialStatus().trialPlanCode).toBeUndefined();
  });

  it('trialEndDate is surfaced in the summary when TRIALING', () => {
    const end = '2026-07-01T00:00:00Z';
    const facade = setup(sub({ status: 'TRIALING', planCode: 'pro', trialEndDate: end }));
    expect(facade.trialStatus().trialEndDate).toBe(end);
  });

  it('trialEndDate is undefined when there is no subscription', () => {
    const facade = setup({} as AccessMeDto);
    expect(facade.trialStatus().trialEndDate).toBeUndefined();
  });
});
