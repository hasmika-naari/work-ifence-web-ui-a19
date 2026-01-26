import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface AdminConfirmDialogData {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-admin-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './admin-confirm-dialog.component.html',
})
export class AdminConfirmDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<AdminConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public readonly data: AdminConfirmDialogData
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
