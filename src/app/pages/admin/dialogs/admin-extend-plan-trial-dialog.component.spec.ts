/**
 * Unit tests – AdminExtendPlanTrialDialogComponent
 *
 * Admin – extend: form validation and dialog result
 *
 *  Days mode (default, prefilled to 14)
 *   1. confirm() with a valid trialDays value (14) closes with { trialDays: 14 }
 *   2. confirm() with trialDays = 0 marks form invalid and does NOT close
 *   3. confirm() with trialDays = 366 marks form invalid and does NOT close
 *   4. confirm() with null trialDays marks form invalid and does NOT close
 *   5. optional reason is trimmed and included in the result
 *   6. empty reason is omitted from the result (undefined)
 *
 *  Date mode
 *   7. confirm() with a valid trialEndDate closes with { trialEndDate }
 *   8. confirm() without trialEndDate sets required error and does NOT close
 *   9. reason is passed through in date mode
 *
 *  Cancel
 *  10. cancel() closes with null
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminExtendPlanTrialDialogComponent } from './admin-extend-plan-trial-dialog.component';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

function setup(): { component: AdminExtendPlanTrialDialogComponent; dialogRef: jasmine.SpyObj<MatDialogRef<any>> } {
  const dialogRef = jasmine.createSpyObj<MatDialogRef<any>>('MatDialogRef', ['close']);

  TestBed.configureTestingModule({
    imports:   [AdminExtendPlanTrialDialogComponent],
    providers: [{ provide: MatDialogRef, useValue: dialogRef }],
    schemas:   [NO_ERRORS_SCHEMA],
  });

  const fixture = TestBed.createComponent(AdminExtendPlanTrialDialogComponent);
  return { component: fixture.componentInstance, dialogRef };
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

describe('AdminExtendPlanTrialDialogComponent – days mode', () => {
  it('1. confirm() with valid trialDays (14) closes with { trialDays: 14 }', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('days');
    component.form.controls.trialDays.setValue(14);
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(jasmine.objectContaining({ trialDays: 14 }));
  });

  it('2. does NOT close and marks trialDays invalid when 0', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('days');
    component.form.controls.trialDays.setValue(0);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialDays.errors).toBeTruthy();
  });

  it('3. does NOT close and marks trialDays invalid when 366 (over max)', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('days');
    component.form.controls.trialDays.setValue(366);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialDays.errors).toBeTruthy();
  });

  it('4. does NOT close and marks trialDays invalid when null', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('days');
    component.form.controls.trialDays.setValue(null);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialDays.errors).toBeTruthy();
  });

  it('5. includes trimmed reason in the result', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('days');
    component.form.controls.trialDays.setValue(30);
    component.form.controls.reason.setValue('  needs more time  ');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ reason: 'needs more time' })
    );
  });

  it('6. omits reason from the result when the field is empty', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('days');
    component.form.controls.trialDays.setValue(7);
    component.form.controls.reason.setValue('');
    component.confirm();
    const result = dialogRef.close.calls.mostRecent().args[0];
    expect(result.reason).toBeUndefined();
  });
});

describe('AdminExtendPlanTrialDialogComponent – date mode', () => {
  it('7. confirm() with valid trialEndDate closes with { trialEndDate }', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('date');
    component.form.controls.trialEndDate.setValue('2026-06-30');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(jasmine.objectContaining({ trialEndDate: '2026-06-30' }));
  });

  it('8. sets required error and does NOT close when trialEndDate is missing', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('date');
    component.form.controls.trialEndDate.setValue(null);
    component.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.form.controls.trialEndDate.errors).toBeTruthy();
  });

  it('9. passes reason through in date mode', () => {
    const { component, dialogRef } = setup();
    component.form.controls.mode.setValue('date');
    component.form.controls.trialEndDate.setValue('2026-07-31');
    component.form.controls.reason.setValue('Extended per request');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ reason: 'Extended per request' })
    );
  });
});

describe('AdminExtendPlanTrialDialogComponent – cancel', () => {
  it('10. cancel() closes with null', () => {
    const { component, dialogRef } = setup();
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledOnceWith(null);
  });
});
