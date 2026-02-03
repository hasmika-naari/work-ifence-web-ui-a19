import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-billing-upgrade',
  template: `
    <div style="padding: 24px; max-width: 900px; margin: 0 auto;">
      <h1>Upgrade required</h1>
      <p>This feature requires an upgraded plan.</p>
      <p>If you were redirected here, your account does not have the required entitlement.</p>
    </div>
  `,
})
export class BillingUpgradeComponent {}
