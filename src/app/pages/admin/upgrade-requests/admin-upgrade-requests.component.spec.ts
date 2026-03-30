/**
 * Unit tests – AdminUpgradeRequestsComponent
 *
 * Tests focus on the component's business logic and action wiring.
 * Template is ignored via NO_ERRORS_SCHEMA; only the class-level
 * behaviour is exercised.
 *
 * Admin – approve
 *   1. approveTrialAction is a no-op for non-PENDING rows
 *   2. approveTrialAction opens the approve dialog
 *   3. Dialog cancel → api.approveTrial is NOT called
 *   4. Dialog confirm with trialDays → api.approveTrial called with days
 *   5. Dialog confirm with dates → api.approveTrial called with start/end dates
 *   6. Successful approve shows snackbar and triggers refresh
 *
 * Admin – reject
 *   7. rejectPlanRequestAction is a no-op for non-PENDING rows
 *   8. rejectPlanRequestAction opens the notes dialog with notesRequired:true
 *   9. Dialog cancel → api.rejectPlanRequest is NOT called
 *  10. Dialog confirm → api.rejectPlanRequest called with adminRemarks
 *  11. Successful reject shows snackbar and triggers refresh
 *
 * Admin – extend
 *  12. extendTrialAction is a no-op for non-APPROVED rows
 *  13. extendTrialAction opens the extend dialog
 *  14. Dialog cancel → api.extendPlanTrial is NOT called
 *  15. Dialog confirm with days → api.extendPlanTrial called with trialDays
 *  16. Dialog confirm with date → api.extendPlanTrial called with trialEndDate
 *  17. Successful extend shows snackbar and triggers refresh
 *
 * Filter / state helpers
 *  18. canReview returns true only for PENDING rows
 *  19. canExtendTrial returns true only for APPROVED rows
 *  20. onStatusChange resets pageIndex to 0
 *  21. onPlanChange resets pageIndex to 0
 *  22. userLabel resolution order
 *  23. isRowBusy returns false for an unknown id
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject } from 'rxjs';

import { AdminUpgradeRequestsComponent } from './admin-upgrade-requests.component';
import { AdminApiService } from '../../../services/admin-api.service';
import type {
  AdminSubscriptionPlanRequestRow,
  PagedResponse,
} from '../../../models/admin.model';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMPTY_PAGE: PagedResponse<AdminSubscriptionPlanRequestRow> = {
  content: [], totalElements: 0, number: 0, size: 20,
};

function pendingRow(id = '1'): AdminSubscriptionPlanRequestRow {
  return { id, status: 'PENDING', requestCode: 'REQ-' + id, userDisplay: 'Alice' };
}

function approvedRow(id = '2'): AdminSubscriptionPlanRequestRow {
  return { id, status: 'APPROVED', requestCode: 'REQ-' + id, userDisplay: 'Bob' };
}

function makeDialogRef<T>(result: T): Partial<MatDialogRef<unknown, T>> {
  return { afterClosed: () => of(result) };
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

describe('AdminUpgradeRequestsComponent – admin actions', () => {
  let component: AdminUpgradeRequestsComponent;
  let fixture: ComponentFixture<AdminUpgradeRequestsComponent>;
  let apiSpy: jasmine.SpyObj<AdminApiService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj<AdminApiService>('AdminApiService', [
      'listPlanRequests',
      'getPlanRequest',
      'approveTrial',
      'rejectPlanRequest',
      'extendPlanTrial',
    ]);
    apiSpy.listPlanRequests.and.returnValue(of(EMPTY_PAGE));
    apiSpy.approveTrial.and.returnValue(of(void 0));
    apiSpy.rejectPlanRequest.and.returnValue(of(void 0));
    apiSpy.extendPlanTrial.and.returnValue(of(void 0));

    dialogSpy   = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports:   [AdminUpgradeRequestsComponent],
      providers: [
        { provide: AdminApiService, useValue: apiSpy      },
        { provide: MatDialog,       useValue: dialogSpy   },
        { provide: MatSnackBar,     useValue: snackBarSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(AdminUpgradeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Approve ─────────────────────────────────────────────────────────────

  describe('Admin – approve trial', () => {
    it('1. is a no-op for a non-PENDING row (APPROVED)', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.approveTrialAction(approvedRow());
      expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('2. opens the AdminApproveTrialDialogComponent for a PENDING row', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.approveTrialAction(pendingRow());
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
    });

    it('3. does NOT call api.approveTrial when the dialog is cancelled', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.approveTrialAction(pendingRow());
      expect(apiSpy.approveTrial).not.toHaveBeenCalled();
    });

    it('4. calls api.approveTrial with trialDays in days-mode', () => {
      const result = { trialDays: 30, adminRemarks: 'Approved' };
      dialogSpy.open.and.returnValue(makeDialogRef(result) as any);

      component.approveTrialAction(pendingRow('5'));

      expect(apiSpy.approveTrial).toHaveBeenCalledOnceWith(
        '5',
        jasmine.objectContaining({ trialDays: 30, adminRemarks: 'Approved' })
      );
    });

    it('5. calls api.approveTrial with trialStartDate/trialEndDate in dates-mode', () => {
      const result = { trialStartDate: '2026-04-01', trialEndDate: '2026-04-30' };
      dialogSpy.open.and.returnValue(makeDialogRef(result) as any);

      component.approveTrialAction(pendingRow('6'));

      expect(apiSpy.approveTrial).toHaveBeenCalledOnceWith(
        '6',
        jasmine.objectContaining({ trialStartDate: '2026-04-01', trialEndDate: '2026-04-30' })
      );
    });

    it('6. shows the snackbar and calls listPlanRequests again after success', () => {
      const callsBefore = apiSpy.listPlanRequests.calls.count();
      dialogSpy.open.and.returnValue(makeDialogRef({ trialDays: 7 }) as any);

      component.approveTrialAction(pendingRow());

      expect(snackBarSpy.open).toHaveBeenCalledWith('Trial approved.', 'OK', jasmine.anything());
      expect(apiSpy.listPlanRequests.calls.count()).toBeGreaterThan(callsBefore);
    });
  });

  // ─── Reject ──────────────────────────────────────────────────────────────

  describe('Admin – reject request', () => {
    it('7. is a no-op for a non-PENDING row (APPROVED)', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.rejectPlanRequestAction(approvedRow());
      expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('8. opens AdminNotesDialogComponent with notesRequired:true', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.rejectPlanRequestAction(pendingRow());

      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      const [, config] = dialogSpy.open.calls.mostRecent().args as any[];
      expect(config?.data?.notesRequired).toBeTrue();
    });

    it('9. does NOT call api.rejectPlanRequest when the dialog is cancelled', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.rejectPlanRequestAction(pendingRow());
      expect(apiSpy.rejectPlanRequest).not.toHaveBeenCalled();
    });

    it('10. calls api.rejectPlanRequest with adminRemarks from the dialog', () => {
      const result = { notes: 'Not eligible' };
      dialogSpy.open.and.returnValue(makeDialogRef(result) as any);

      component.rejectPlanRequestAction(pendingRow('7'));

      expect(apiSpy.rejectPlanRequest).toHaveBeenCalledOnceWith(
        '7',
        jasmine.objectContaining({ adminRemarks: 'Not eligible' })
      );
    });

    it('11. shows the snackbar and triggers a refresh after successful rejection', () => {
      const callsBefore = apiSpy.listPlanRequests.calls.count();
      dialogSpy.open.and.returnValue(makeDialogRef({ notes: 'Reason' }) as any);

      component.rejectPlanRequestAction(pendingRow());

      expect(snackBarSpy.open).toHaveBeenCalledWith('Request rejected.', 'OK', jasmine.anything());
      expect(apiSpy.listPlanRequests.calls.count()).toBeGreaterThan(callsBefore);
    });
  });

  // ─── Extend ──────────────────────────────────────────────────────────────

  describe('Admin – extend trial', () => {
    it('12. is a no-op for a non-APPROVED row (PENDING)', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.extendTrialAction(pendingRow());
      expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('13. opens AdminExtendPlanTrialDialogComponent for an APPROVED row', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.extendTrialAction(approvedRow());
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
    });

    it('14. does NOT call api.extendPlanTrial when the dialog is cancelled', () => {
      dialogSpy.open.and.returnValue(makeDialogRef(null) as any);
      component.extendTrialAction(approvedRow());
      expect(apiSpy.extendPlanTrial).not.toHaveBeenCalled();
    });

    it('15. calls api.extendPlanTrial with trialDays in days-mode', () => {
      const result = { trialDays: 14, reason: 'Customer request' };
      dialogSpy.open.and.returnValue(makeDialogRef(result) as any);

      component.extendTrialAction(approvedRow('8'));

      expect(apiSpy.extendPlanTrial).toHaveBeenCalledOnceWith(
        '8',
        jasmine.objectContaining({ trialDays: 14, reason: 'Customer request' })
      );
    });

    it('16. calls api.extendPlanTrial with trialEndDate in date-mode', () => {
      const result = { trialEndDate: '2026-07-31' };
      dialogSpy.open.and.returnValue(makeDialogRef(result) as any);

      component.extendTrialAction(approvedRow('9'));

      expect(apiSpy.extendPlanTrial).toHaveBeenCalledOnceWith(
        '9',
        jasmine.objectContaining({ trialEndDate: '2026-07-31' })
      );
    });

    it('17. shows the snackbar and triggers a refresh after successful extension', () => {
      const callsBefore = apiSpy.listPlanRequests.calls.count();
      dialogSpy.open.and.returnValue(makeDialogRef({ trialDays: 7 }) as any);

      component.extendTrialAction(approvedRow());

      expect(snackBarSpy.open).toHaveBeenCalledWith('Trial extended.', 'OK', jasmine.anything());
      expect(apiSpy.listPlanRequests.calls.count()).toBeGreaterThan(callsBefore);
    });
  });

  // ─── Filter / state helpers ───────────────────────────────────────────────

  describe('Filter and state helpers', () => {
    it('18. canReview returns true only for PENDING status', () => {
      expect(component.canReview({ status: 'PENDING' })).toBeTrue();
      expect(component.canReview({ status: 'pending' })).toBeTrue();  // case-insensitive
      expect(component.canReview({ status: 'APPROVED' })).toBeFalse();
      expect(component.canReview({ status: 'REJECTED' })).toBeFalse();
      expect(component.canReview({ status: '' })).toBeFalse();
      expect(component.canReview({})).toBeFalse();
    });

    it('19. canExtendTrial returns true only for APPROVED status', () => {
      expect(component.canExtendTrial({ status: 'APPROVED' })).toBeTrue();
      expect(component.canExtendTrial({ status: 'approved' })).toBeTrue(); // case-insensitive
      expect(component.canExtendTrial({ status: 'PENDING' })).toBeFalse();
      expect(component.canExtendTrial({ status: 'REJECTED' })).toBeFalse();
      expect(component.canExtendTrial({})).toBeFalse();
    });

    it('20. onStatusChange resets pageIndex to 0', () => {
      component.pageIndex.set(5);
      component.onStatusChange('PENDING');
      expect(component.pageIndex()).toBe(0);
      expect(component.status()).toBe('PENDING');
    });

    it('21. onPlanChange resets pageIndex to 0', () => {
      component.pageIndex.set(3);
      component.onPlanChange('PRO');
      expect(component.pageIndex()).toBe(0);
      expect(component.plan()).toBe('PRO');
    });

    it('22. userLabel uses first non-empty field in priority order', () => {
      expect(component.userLabel({ userDisplay: 'Alice', userName: 'alice', userEmail: 'a@b.com' }))
        .toBe('Alice');
      expect(component.userLabel({ userName: 'alice', userEmail: 'a@b.com' }))
        .toBe('alice');
      expect(component.userLabel({ userEmail: 'a@b.com' }))
        .toBe('a@b.com');
      expect(component.userLabel({}))
        .toBe('-');
    });

    it('23. isRowBusy returns false for an id not in the busy map', () => {
      expect(component.isRowBusy('unknown-id')).toBeFalse();
      expect(component.isRowBusy(undefined)).toBeFalse();
    });
  });
});
