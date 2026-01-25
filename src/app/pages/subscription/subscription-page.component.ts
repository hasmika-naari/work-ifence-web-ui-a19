import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { SubscriptionFacadeService } from 'src/app/facades/subscription-facade.service';
import type { SubscriptionPlan, SubscriptionScope } from 'src/app/models/subscription.model';
import { UpgradeRouterService } from 'src/app/services/upgrade-router.service';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatChipsModule, MatDividerModule],
  templateUrl: './subscription-page.component.html',
  styleUrl: './subscription-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPageComponent {
  private readonly router = inject(Router);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly subscriptionFacade = inject(SubscriptionFacadeService);
  private readonly upgradeRouter = inject(UpgradeRouterService);

  readonly scope = signal<SubscriptionScope>(
    this.router.url.startsWith('/user/enterprise') ? 'ENTERPRISE' : 'INDIVIDUAL'
  );

  readonly me = this.accessFacade.accessMeSignal;
  readonly subscription = computed(() => this.me().subscription);
  readonly entitlements = computed(() => this.me().entitlements);

  readonly plans = computed(() => {
    const scope = this.scope();
    return this.subscriptionFacade.plansSignal(scope)();
  });

  readonly currentPlan = computed<SubscriptionPlan | undefined>(() => {
    const planCode = (this.subscription()?.planCode ?? '').toString();
    if (!planCode) return undefined;
    return this.plans().find(p => (p.code ?? '').toString().toUpperCase() === planCode.toUpperCase());
  });

  readonly statusLabel = computed(() => {
    const status = (this.subscription()?.status ?? 'FREE').toString().toUpperCase();
    return status || 'FREE';
  });

  readonly trialDaysRemaining = computed<number | null>(() => {
    const status = (this.subscription()?.status ?? '').toString().toUpperCase();
    if (status !== 'TRIALING') return null;

    const end = this.subscription()?.trialEndDate || this.subscription()?.currentPeriodEnd;
    if (!end) return null;

    const endMs = Date.parse(end);
    if (Number.isNaN(endMs)) return null;

    const now = Date.now();
    const diffDays = Math.ceil((endMs - now) / 86400000);
    return Math.max(0, diffDays);
  });

  goToUpgrade(): void {
    const ctx = this.scope() === 'ENTERPRISE' ? 'ENTERPRISE' : 'PERSONAL';
    this.upgradeRouter.goToPricingForContext(ctx);
  }
}
