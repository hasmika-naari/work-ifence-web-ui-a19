import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

export interface AdminExtendPlanTrialDialogData {
  /** ISO date string of the current trial end — new date must be strictly after this */
  currentTrialEndDate?: string;
}

export interface AdminExtendPlanTrialDialogResult {
  trialDays?: number;
  trialEndDate?: string;
  reason?: string;
}

@Component({
  selector: 'app-admin-extend-plan-trial-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  templateUrl: './admin-extend-plan-trial-dialog.component.html',
})
export class AdminExtendPlanTrialDialogComponent {
  readonly form = new FormGroup({
    mode: new FormControl<'days' | 'date'>('days', { nonNullable: true }),
    trialDays: new FormControl<number | null>(14),
    trialEndDate: new FormControl<string | null>(null),
    reason: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AdminExtendPlanTrialDialogComponent, AdminExtendPlanTrialDialogResult | null>,
    @Optional() @Inject(MAT_DIALOG_DATA) public readonly data: AdminExtendPlanTrialDialogData | null
  ) {}

  /** Earliest acceptable new-end-date: day after current trial end, or today. */
  get minDate(): string {
    if (this.data?.currentTrialEndDate) {
      const d = new Date(this.data.currentTrialEndDate);
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  }

  get mode(): 'days' | 'date' {
    return this.form.controls.mode.value;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const { mode, trialDays, trialEndDate, reason } = this.form.getRawValue();

    if (mode === 'days') {
      const days = Number(trialDays);
      if (!trialDays || isNaN(days) || days < 1 || days > 365) {
        this.form.controls.trialDays.setErrors({ invalid: true });
        this.form.controls.trialDays.markAsTouched();
        return;
      }
      this.dialogRef.close({
        trialDays: days,
        reason: reason?.trim() || undefined,
      });
    } else {
      if (!trialEndDate) {
        this.form.controls.trialEndDate.setErrors({ required: true });
        this.form.controls.trialEndDate.markAsTouched();
        return;
      }
      if (trialEndDate <= this.minDate.slice(0, 10) ||
          (this.data?.currentTrialEndDate && trialEndDate <= this.data.currentTrialEndDate)) {
        this.form.controls.trialEndDate.setErrors({ endNotForward: true });
        this.form.controls.trialEndDate.markAsTouched();
        return;
      }
      this.dialogRef.close({
        trialEndDate,
        reason: reason?.trim() || undefined,
      });
    }
  }
}
