/**
 * Unit tests – UpgradeDrawerService
 *
 * Covers:
 *  User – eligibility
 *    1. pendingPlanCodes is empty before any requests are loaded
 *    2. pendingPlanCodes reflects only PENDING rows (not APPROVED / REJECTED)
 *    3. pendingPlanCodes stays consistent after direct set on myPlanRequests
 *
 *  User – request lifecycle (markPlanPending / refreshPendingRequests)
 *    4. markPlanPending inserts a PENDING row with the given code
 *    5. markPlanPending normalises the code to UPPERCASE
 *    6. markPlanPending replaces an existing row for the same code
 *    7. markPlanPending with an empty string is a no-op
 *    8. refreshPendingRequests calls getMyPlanRequests and populates the signal
 *    9. refreshPendingRequests is a no-op while a fetch is already in flight
 *   10. refreshPendingRequests swallows errors and preserves stale state
 *
 *  User – UI states (open / close / visible)
 *   11. visible starts false
 *   12. openForContext opens with correct scope (ENTERPRISE vs INDIVIDUAL)
 *   13. openForContext defaults to "Upgrade required" title when not supplied
 *   14. openForContext stores custom title and message
 *   15. close() sets visible to false without clearing the payload
 */

import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { UpgradeDrawerService } from './upgrade-drawer.service';
import { DashboardContextService } from '../../services/dashboard-context.service';
import { SubscriptionFacadeService } from '../../facades/subscription-facade.service';
import type { SubscriptionPlanRequestRow } from '../../models/subscription.model';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const contextStub = { context: () => 'PERSONAL' as any };

let getMyPlanRequestsSpy: jasmine.Spy;

function buildFacadeStub(rows: SubscriptionPlanRequestRow[] = []): Partial<SubscriptionFacadeService> {
  getMyPlanRequestsSpy = jasmine.createSpy('getMyPlanRequests').and.returnValue(of(rows));
  return { getMyPlanRequests: getMyPlanRequestsSpy } as any;
}

function buildFacadeErrorStub(): Partial<SubscriptionFacadeService> {
  getMyPlanRequestsSpy = jasmine.createSpy('getMyPlanRequests').and.returnValue(
    throwError(() => new Error('network'))
  );
  return { getMyPlanRequests: getMyPlanRequestsSpy } as any;
}

function setup(facadeOverride?: Partial<SubscriptionFacadeService>): UpgradeDrawerService {
  TestBed.configureTestingModule({
    providers: [
      UpgradeDrawerService,
      { provide: DashboardContextService, useValue: contextStub },
      { provide: SubscriptionFacadeService, useValue: facadeOverride ?? buildFacadeStub() },
    ],
  });
  return TestBed.inject(UpgradeDrawerService);
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

describe('UpgradeDrawerService – user eligibility (pendingPlanCodes)', () => {
  it('pendingPlanCodes is an empty set before any requests are loaded', () => {
    const svc = setup();
    expect(svc.pendingPlanCodes().size).toBe(0);
  });

  it('pendingPlanCodes reflects only PENDING rows after direct signal set', () => {
    const svc = setup();
    const rows: SubscriptionPlanRequestRow[] = [
      { planCode: 'PRO',   status: 'PENDING'  },
      { planCode: 'ELITE', status: 'APPROVED' },
      { planCode: 'BASIC', status: 'REJECTED' },
    ];
    svc.myPlanRequests.set(rows);

    const codes = svc.pendingPlanCodes();
    expect(codes.has('PRO')).toBeTrue();
    expect(codes.has('ELITE')).toBeFalse();
    expect(codes.has('BASIC')).toBeFalse();
  });

  it('pendingPlanCodes updates when myPlanRequests changes from empty to populated', () => {
    const svc = setup();
    expect(svc.pendingPlanCodes().size).toBe(0);
    svc.myPlanRequests.set([{ planCode: 'PRO', status: 'PENDING' }]);
    expect(svc.pendingPlanCodes().has('PRO')).toBeTrue();
  });
});

describe('UpgradeDrawerService – user request lifecycle', () => {
  describe('markPlanPending', () => {
    it('inserts a PENDING row with the correct plan code', () => {
      const svc = setup();
      svc.markPlanPending('PRO');
      expect(svc.myPlanRequests().length).toBe(1);
      expect(svc.myPlanRequests()[0].planCode).toBe('PRO');
      expect(svc.myPlanRequests()[0].status).toBe('PENDING');
    });

    it('normalises the plan code to uppercase', () => {
      const svc = setup();
      svc.markPlanPending('pro');
      expect(svc.pendingPlanCodes().has('PRO')).toBeTrue();
    });

    it('replaces an existing row for the same plan code', () => {
      const svc = setup();
      svc.markPlanPending('PRO', { requestCode: 'R1' });
      svc.markPlanPending('PRO', { requestCode: 'R2' });
      expect(svc.myPlanRequests().length).toBe(1);
      expect(svc.myPlanRequests()[0].requestCode).toBe('R2');
    });

    it('preserves unrelated rows when replacing', () => {
      const svc = setup();
      svc.myPlanRequests.set([
        { planCode: 'BASIC', status: 'PENDING' },
        { planCode: 'PRO',   status: 'PENDING' },
      ]);
      svc.markPlanPending('PRO', { requestCode: 'NEW' });
      expect(svc.myPlanRequests().length).toBe(2);
      const basic = svc.myPlanRequests().find(r => r.planCode === 'BASIC');
      expect(basic).toBeDefined();
    });

    it('is a no-op when the plan code is an empty string', () => {
      const svc = setup();
      svc.markPlanPending('');
      expect(svc.myPlanRequests()).toEqual([]);
    });
  });

  describe('refreshPendingRequests', () => {
    it('calls getMyPlanRequests and sets myPlanRequests with the result', () => {
      const rows: SubscriptionPlanRequestRow[] = [{ planCode: 'PRO', status: 'PENDING' }];
      const svc = setup(buildFacadeStub(rows));

      svc.refreshPendingRequests();

      expect(getMyPlanRequestsSpy).toHaveBeenCalledTimes(1);
      expect(svc.myPlanRequests()).toEqual(rows);
      expect(svc.myPlanRequestsLoading()).toBeFalse();
    });

    it('does not make a second call while already loading', () => {
      const svc = setup(buildFacadeStub());
      svc.myPlanRequestsLoading.set(true);

      svc.refreshPendingRequests();

      expect(getMyPlanRequestsSpy).not.toHaveBeenCalled();
      svc.myPlanRequestsLoading.set(false); // cleanup
    });

    it('swallows errors and preserves stale myPlanRequests on failure', () => {
      const svc = setup(buildFacadeErrorStub());
      const stale: SubscriptionPlanRequestRow[] = [{ planCode: 'PRO', status: 'PENDING' }];
      svc.myPlanRequests.set(stale);

      expect(() => svc.refreshPendingRequests()).not.toThrow();
      expect(svc.myPlanRequests()).toEqual(stale);
      expect(svc.myPlanRequestsLoading()).toBeFalse();
    });

    it('resets myPlanRequestsLoading to false after a successful fetch', () => {
      const svc = setup(buildFacadeStub());
      svc.refreshPendingRequests();
      expect(svc.myPlanRequestsLoading()).toBeFalse();
    });
  });
});

describe('UpgradeDrawerService – user UI states', () => {
  it('visible starts as false', () => {
    const svc = setup();
    expect(svc.visible()).toBeFalse();
  });

  it('openForContext with "ENTERPRISE" sets scope to ENTERPRISE and makes visible', () => {
    const svc = setup();
    svc.openForContext('ENTERPRISE');
    expect(svc.visible()).toBeTrue();
    expect(svc.snapshot().scope).toBe('ENTERPRISE');
  });

  it('openForContext with any non-ENTERPRISE context sets scope to INDIVIDUAL', () => {
    const svc = setup();
    svc.openForContext('PERSONAL' as any);
    expect(svc.snapshot().scope).toBe('INDIVIDUAL');
  });

  it('openForContext uses supplied title and message', () => {
    const svc = setup();
    svc.openForContext('PERSONAL' as any, { title: 'Custom title', message: 'Custom message' });
    expect(svc.snapshot().title).toBe('Custom title');
    expect(svc.snapshot().message).toBe('Custom message');
  });

  it('openForContext falls back to default title when title is not supplied', () => {
    const svc = setup();
    svc.openForContext('PERSONAL' as any);
    expect(svc.snapshot().title).toBe('Upgrade required');
  });

  it('openForContext trims whitespace from title and message', () => {
    const svc = setup();
    svc.openForContext('PERSONAL' as any, { title: '  Padded  ', message: '  Also padded  ' });
    expect(svc.snapshot().title).toBe('Padded');
    expect(svc.snapshot().message).toBe('Also padded');
  });

  it('close() sets visible to false', () => {
    const svc = setup();
    svc.openForContext('PERSONAL' as any);
    expect(svc.visible()).toBeTrue();
    svc.close();
    expect(svc.visible()).toBeFalse();
  });

  it('close() does not clear scope or other state', () => {
    const svc = setup();
    svc.openForContext('ENTERPRISE');
    svc.close();
    expect(svc.snapshot().scope).toBe('ENTERPRISE');
  });
});
