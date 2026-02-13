import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-locked-feature',
  template: `
    <div class="locked-feature">
      <h2><mat-icon>lock</mat-icon> Feature Locked</h2>
      <div *ngIf="feature">
        <strong>Feature:</strong> {{ feature }}
      </div>
      <div *ngIf="minPlan">
        <strong>Required Plan:</strong> {{ minPlan }}
      </div>
      <button mat-raised-button color="primary" (click)="upgrade()">Upgrade</button>
    </div>
  `,
  styles: [`
    .locked-feature { text-align: center; padding: 2rem; color: #888; }
    mat-icon { vertical-align: middle; margin-right: 8px; }
    button { margin-top: 1rem; }
  `]
})
export class LockedFeatureComponent {
  @Input() feature?: string;
  @Input() minPlan?: string;

  upgrade() {
    window.location.href = '/user/billing/upgrade';
  }
}
