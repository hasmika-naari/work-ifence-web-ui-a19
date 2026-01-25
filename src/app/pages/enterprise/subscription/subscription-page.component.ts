import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'wif-enterprise-subscription-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div style="padding:24px">
      <mat-card>
        <mat-card-title>Enterprise Subscription</mat-card-title>
        <mat-card-content>
          <div class="muted">Coming soon.</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPageComponent {}
