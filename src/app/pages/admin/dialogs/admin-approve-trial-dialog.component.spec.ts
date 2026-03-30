/**
 * Unit tests – AdminApproveTrialDialogComponent
 *
 * Admin – approve: form validation and dialog result
 *
 *  Days mode (default)
 *   1. confirm() with a valid trialDays value (30) closes with { trialDays: 30 }
 *   2. confirm() with trialDays = 0 sets an invalid form error and does NOT close
 *   3. confirm() with trialDays = 366 sets an invalid form error and does NOT close
 *   4. confirm() with null trialDays sets an invalid form error and does NOT close
 *   5. optional adminRemarks is trimmed and included in the result
 *   6. empty adminRemarks is omitted from the result (undefined)
 *
 *  Dates mode
 *   7. confirm() with valid start < end closes with { trialStartDate, trialEndDate }
 *   8. confirm() with missing trialStartDate sets required error and does NOT close
 *   9. confirm() with missing trialEndDate sets required error and does NOT close
 *  10. confirm() with trialEndDate === trialStartDate sets endBeforeStart error
 *  11. confirm() with trialEndDate < trialStartDate sets endBeforeStart error
 *  12. adminRemarks is passed through in dates mode
 *
 *  Cancel
 *  13. cancel() closes with null
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminApproveTrialDialogComponent } from './admin-approve-trial-dialog.component';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

function setup(): { component: AdminApproveTrialDialogComponent; dialogRef: jasmine.SpyObj<MatDialogRef<any>> } {
  const dialogRef = jasmine.createSpyObj<MatDialogRef<any>>('MatDialogRef', ['close']);

  TestBed.configureTestingModule({
    imports:   [AdminApproveTrialDialogComponent],
    providers: [{ provide: MatDialogRef, useValue: dialogRef }],
    schemas:   [NO_ERRORS_SCHEMA],
  });

  const fixture = TestBed.createComponent(AdminApproveTrialDialogComponent);
  return { component: fixture.componentInstance, dialogRef };
}

// ---------------------------------------------------------------------------
// Common shortcuts
// ---------------------------------------------------------------------------

function setDaysMode(component: AdminApproveTrialDialogComponent, days: number | null): void {
  component.form.controls.mode.setValue('days');
  component.form.controls.trialDays.setValue(days);
}

function setDatesMode(
  component: AdminApproveTrialDialogComponent,
  start: string | null,
  end: string | null
): void {
  component.form.controls.mode.setValue('dates');
  component.form.controls.trialStartDate.setValue(start);
  component.form.controls.trialEndDate.setValue(end);
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

describe('AdminApproveTrialDialogComponent – days mode', () => {
  it('1. closes with trialDays for a valid duration (30 days)', () => {
    const { component, dialogRef } = setup();
    setDaysMode(component, 30);
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(jasmine.objectContaining({ trialDays: 30 }));
  });

  it('2. does NOT close and marks trialDays invalid when 0', () => {
    const { component, dialogRef } = setup();
    setDaysMode(component, 0);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialDays.errors).toBeTruthy();
  });

  it('3. does NOT close and marks trialDays invalid when 366 (over max)', () => {
    const { component, dialogRef } = setup();
    setDaysMode(component, 366);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialDays.errors).toBeTruthy();
  });

  it('4. does NOT close and marks trialDays invalid when null', () => {
    const { component, dialogRef } = setup();
    setDaysMode(component, null);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialDays.errors).toBeTruthy();
  });

  it('5. includes trimmed adminRemarks in the result', () => {
    const { component, dialogRef } = setup();
    setDaysMode(component, 14);
    component.form.controls.adminRemarks.setValue('  Looks good  ');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ adminRemarks: 'Looks good' })
    );
  });

  it('6. omits adminRemarks from the result when the field is empty', () => {
    const { component, dialogRef } = setup();
    setDaysMode(component, 14);
    component.form.controls.adminRemarks.setValue('');
    component.confirm();
    const result = dialogRef.close.calls.mostRecent().args[0];
    expect(result.adminRemarks).toBeUndefined();
  });
});

describe('AdminApproveTrialDialogComponent – dates mode', () => {
  it('7. closes with trialStartDate and trialEndDate when start < end', () => {
    const { component, dialogRef } = setup();
    setDatesMode(component, '2026-04-01', '2026-04-30');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ trialStartDate: '2026-04-01', trialEndDate: '2026-04-30' })
    );
  });

  it('8. sets required error on trialStartDate when missing', () => {
    const { component, dialogRef } = setup();
    setDatesMode(component, null, '2026-04-30');
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialStartDate.errors).toBeTruthy();
  });

  it('9. sets required error on trialEndDate when missing', () => {
    const { component, dialogRef } = setup();
    setDatesMode(component, '2026-04-01', null);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialEndDate.errors).toBeTruthy();
  });

  it('10. sets endBeforeStart error when trialEndDate equals trialStartDate', () => {
    const { component, dialogRef } = setup();
    setDatesMode(component, '2026-04-15', '2026-04-15');
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialEndDate.errors?.['endBeforeStart']).toBeTrue();
  });

  it('11. sets endBeforeStart error when trialEndDate is before trialStartDate', () => {
    const { component, dialogRef } = setup();
    setDatesMode(component, '2026-04-20', '2026-04-10');
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialEndDate.errors?.['endBeforeStart']).toBeTrue();
  });

  it('12. passes adminRemarks through in dates mode', () => {
    const { component, dialogRef } = setup();
    setDatesMode(component, '2026-04-01', '2026-04-30');
    component.form.controls.adminRemarks.setValue('Extended for review');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ adminRemarks: 'Extended for review' })
    );
  });
});

describe('AdminApproveTrialDialogComponent – cancel', () => {
  it('13. cancel() closes with null', () => {
    const { component, dialogRef } = setup();
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(null);
  });
});
