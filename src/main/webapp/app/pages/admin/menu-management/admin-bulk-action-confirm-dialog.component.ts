import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface AdminBulkActionConfirmDialogData {
  title: string;
  itemCount: number;
  summaryLines: string[];
  confirmText?: string;
}

@Component({
  selector: 'app-admin-bulk-action-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <div mat-dialog-content>
      <p><strong>Items selected:</strong> {{ data.itemCount }}</p>
      <p><strong>Impact summary</strong></p>
      <ul>
        <li *ngFor="let line of data.summaryLines">{{ line }}</li>
      </ul>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="confirm()">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      ul {
        margin: 0;
        padding-left: 1.2rem;
      }
    `,
  ],
})
export class AdminBulkActionConfirmDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<AdminBulkActionConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public readonly data: AdminBulkActionConfirmDialogData,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
