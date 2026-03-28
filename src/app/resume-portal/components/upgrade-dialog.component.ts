import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';

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
      <button mat-flat-button color="primary" mat-dialog-close (click)="goToSubscription()">View subscription</button>
    </div>
  `,
})
export class UpgradeDialogComponent {
  private upgradeDrawer = inject(UpgradeDrawerService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { reason?: string } | null) {}

  goToSubscription(): void {
    this.upgradeDrawer.openForContext('PERSONAL', {
      title: 'Upgrade required',
      message: this.data?.reason || 'This action requires an upgraded plan.',
    });
  }
}
