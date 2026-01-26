import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface AdminDetailDialogData {
  title: string;
  data: unknown;
}

@Component({
  selector: 'app-admin-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './admin-detail-dialog.component.html',
})
export class AdminDetailDialogComponent {
  readonly pretty: string;

  constructor(
    private readonly dialogRef: MatDialogRef<AdminDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly dialogData: AdminDetailDialogData
  ) {
    this.pretty = JSON.stringify(dialogData.data, null, 2);
  }

  close(): void {
    this.dialogRef.close();
  }
}
