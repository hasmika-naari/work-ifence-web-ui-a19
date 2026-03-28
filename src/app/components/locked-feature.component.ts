import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';

@Component({
  selector: 'app-locked-feature',
  template: `
    <div class="locked-feature">
      <h2>Feature Locked</h2>
      @if (feature) {
      <div>
        <strong>Feature:</strong> {{ feature }}
      </div>
      }
      @if (minPlan) {
      <div>
        <strong>Required Plan:</strong> {{ minPlan }}
      </div>
      }
      <button type="button" class="locked-feature__button" (click)="upgrade()">Upgrade</button>
    </div>
  `,
  styles: [`
    .locked-feature { text-align: center; padding: 2rem; color: #888; }
    .locked-feature__button {
      margin-top: 1rem;
      border: 0;
      border-radius: 999px;
      padding: 0.75rem 1.25rem;
      background: #0f172a;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class LockedFeatureComponent {
  private readonly router = inject(Router);
  private readonly upgradeDrawer = inject(UpgradeDrawerService);

  @Input() feature?: string;
  @Input() minPlan?: string;

  upgrade() {
    const featureLabel = (this.feature ?? '').toString().trim();
    const planLabel = (this.minPlan ?? '').toString().trim();
    const reason = featureLabel
      ? `Upgrade your plan to unlock ${featureLabel}${planLabel ? ` with ${planLabel} access.` : '.'}`
      : 'Upgrade your plan to unlock this feature.';

    this.upgradeDrawer.openForCurrentContext({
      title: 'Upgrade required',
      message: reason,
      returnUrl: this.router.url,
    });
  }
}
