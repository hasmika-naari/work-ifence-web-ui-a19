import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'wif-enterprise-invite-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './enterprise-invite-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseInviteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EnterpriseInviteDialogComponent>);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    userName: ['', [Validators.required]],
    role: ['ENTERPRISE_EMPLOYEE', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
