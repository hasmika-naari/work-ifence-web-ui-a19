import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

export interface AdminApproveTrialDialogResult {
  trialDays?: number;
  trialStartDate?: string;
  trialEndDate?: string;
  adminRemarks?: string;
}

@Component({
  selector: 'app-admin-approve-trial-dialog',
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
  templateUrl: './admin-approve-trial-dialog.component.html',
})
export class AdminApproveTrialDialogComponent {
  readonly form = new FormGroup({
    mode: new FormControl<'days' | 'dates'>('days', { nonNullable: true }),
    trialDays: new FormControl<number | null>(30),
    trialStartDate: new FormControl<string | null>(null),
    trialEndDate: new FormControl<string | null>(null),
    adminRemarks: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AdminApproveTrialDialogComponent, AdminApproveTrialDialogResult | null>
  ) {}

  get mode(): 'days' | 'dates' {
    return this.form.controls.mode.value;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const { mode, trialDays, trialStartDate, trialEndDate, adminRemarks } = this.form.getRawValue();

    if (mode === 'days') {
      const days = Number(trialDays);
      if (!trialDays || isNaN(days) || days < 1 || days > 365) {
        this.form.controls.trialDays.setErrors({ invalid: true });
        this.form.controls.trialDays.markAsTouched();
        return;
      }
      this.dialogRef.close({
        trialDays: days,
        adminRemarks: adminRemarks?.trim() || undefined,
      });
    } else {
      if (!trialStartDate) {
        this.form.controls.trialStartDate.setErrors({ required: true });
        this.form.controls.trialStartDate.markAsTouched();
      }
      if (!trialEndDate) {
        this.form.controls.trialEndDate.setErrors({ required: true });
        this.form.controls.trialEndDate.markAsTouched();
      }
      if (!trialStartDate || !trialEndDate) return;

      if (trialEndDate <= trialStartDate) {
        this.form.controls.trialEndDate.setErrors({ endBeforeStart: true });
        this.form.controls.trialEndDate.markAsTouched();
        return;
      }

      this.dialogRef.close({
        trialStartDate,
        trialEndDate,
        adminRemarks: adminRemarks?.trim() || undefined,
      });
    }
  }
}
