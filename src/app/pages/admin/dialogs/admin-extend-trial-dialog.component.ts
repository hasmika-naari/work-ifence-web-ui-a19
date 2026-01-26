import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AdminExtendTrialDialogResult {
  days: number;
  reason: string;
}

@Component({
  selector: 'app-admin-extend-trial-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-extend-trial-dialog.component.html',
})
export class AdminExtendTrialDialogComponent {
  readonly form = new FormGroup({
    days: new FormControl<number>(7, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(365)],
    }),
    reason: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AdminExtendTrialDialogComponent, AdminExtendTrialDialogResult | null>
  ) {}

  cancel(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      days: Number(value.days),
      reason: String(value.reason).trim(),
    });
  }
}
