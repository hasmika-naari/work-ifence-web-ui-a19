import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upgrade-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Upgrade required</h2>
    <div mat-dialog-content>
      <p>{{ data?.reason || 'This action requires an upgraded plan.' }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Not now</button>
      <button mat-flat-button color="primary" mat-dialog-close (click)="goToPricing()">Upgrade</button>
    </div>
  `,
})
export class UpgradeDialogComponent {
  private router = inject(Router);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { reason?: string } | null) {}

  goToPricing(): void {
    void this.router.navigateByUrl('/pricing');
  }
}
