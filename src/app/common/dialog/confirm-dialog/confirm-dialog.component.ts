
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog-2',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
})
export class ConfirmDialogComponent2 {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent2>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title?: string;
      message: string;
      icon?: string;
      cancelText?: string;
      confirmText?: string;
      confirmColor?: 'primary' | 'accent' | 'warn';
    }
  ) {}
}