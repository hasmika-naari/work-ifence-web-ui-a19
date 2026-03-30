import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import type { AdminSubscriptionPlanRequestRow } from 'src/app/models/admin.model';

export interface AdminPlanRequestDetailDialogData {
  detail: AdminSubscriptionPlanRequestRow;
}

@Component({
  selector: 'app-admin-plan-request-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './admin-plan-request-detail-dialog.component.html',
  styleUrls: ['./admin-plan-request-detail-dialog.component.scss'],
})
export class AdminPlanRequestDetailDialogComponent {
  readonly detail: AdminSubscriptionPlanRequestRow;

  constructor(
    private readonly dialogRef: MatDialogRef<AdminPlanRequestDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: AdminPlanRequestDetailDialogData
  ) {
    this.detail = data.detail;
  }

  userLabel(): string {
    return this.detail.userDisplay || this.detail.userName || this.detail.userEmail || '—';
  }

  close(): void {
    this.dialogRef.close();
  }
}
