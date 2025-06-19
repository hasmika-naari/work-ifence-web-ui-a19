import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog-2',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule,
      MatButtonModule,
      MatIconModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      MatProgressSpinnerModule,
    ],
})
export class ConfirmDialogComponent2 {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent2>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // user confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // user cancelled
  }
}