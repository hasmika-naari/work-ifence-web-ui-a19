import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { SubscriptionFacadeService } from 'src/app/facades/subscription-facade.service';
import type { SubscriptionPlan, SubscriptionScope } from 'src/app/models/subscription.model';

@Component({
    selector: 'app-pricing-page',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        FeathericonsModule,
    ],
    templateUrl: './pricing-page.component.html',
    styleUrl: './pricing-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPageComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly snackBar = inject(MatSnackBar);

    private readonly accessFacade = inject(AccessFacadeService);
    private readonly subscriptionFacade = inject(SubscriptionFacadeService);

    readonly me = this.accessFacade.accessMeSignal;
    readonly isLoggedIn = computed(() => !!this.me().userId);
    readonly currentPlanCode = computed(() => (this.me().subscription?.planCode ?? '').toString());

    readonly individualPlans = this.subscriptionFacade.plansSignal('INDIVIDUAL');
    readonly enterprisePlans = this.subscriptionFacade.plansSignal('ENTERPRISE');

    readonly isUpgrading = signal(false);

    private readonly queryParamMap = toSignal(this.route.queryParamMap, {
        initialValue: this.route.snapshot.queryParamMap,
    });

    readonly selectedTabIndex = signal<number>(0);

    constructor() {
        effect(() => {
            const scopeParam = (this.queryParamMap().get('scope') ?? '').toLowerCase();
            const byQuery = scopeParam === 'enterprise' ? 1 : 0;

            // If query param not set, default from dashboard context (via facade)
            const byCtx = this.subscriptionFacade.currentScopeSignal() === 'ENTERPRISE' ? 1 : 0;
            const next = scopeParam ? byQuery : byCtx;

            this.selectedTabIndex.set(next);
        });
    }

    onTabIndexChange(index: number): void {
        this.selectedTabIndex.set(index);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                scope: index === 1 ? 'enterprise' : null,
            },
            queryParamsHandling: 'merge',
        });
    }

    sortedPlans(plans: SubscriptionPlan[]): SubscriptionPlan[] {
        return [...plans].sort((a, b) => {
            const ao = a.sortOrder ?? 0;
            const bo = b.sortOrder ?? 0;
            if (ao !== bo) return ao - bo;
            const ap = a.price ?? 0;
            const bp = b.price ?? 0;
            return ap - bp;
        });
    }

    formatPrice(plan: SubscriptionPlan): string {
        const price = plan.price;
        if (price === undefined || price === null) return 'Free';
        const currency = (plan.currency ?? 'USD').toString().toUpperCase();
        return `${currency} ${price}`;
    }

    intervalLabel(plan: SubscriptionPlan): string {
        const raw = (plan.billingInterval ?? '').toString().toUpperCase();
        if (raw === 'YEARLY' || raw === 'ANNUAL' || raw === 'YEAR') return 'per year';
        if (raw === 'MONTHLY' || raw === 'MONTH') return 'per month';
        return raw ? raw.toLowerCase() : 'per period';
    }

    isCurrentPlan(plan: SubscriptionPlan): boolean {
        const current = this.currentPlanCode();
        const code = (plan.code ?? '').toString();
        return !!current && !!code && current.toUpperCase() === code.toUpperCase();
    }

    ctaLabel(plan: SubscriptionPlan): string {
        if (!this.isLoggedIn()) return 'Sign in to start';
        if (this.isCurrentPlan(plan)) return 'Current plan';
        return (plan.trialDays ?? 0) > 0 ? 'Start trial' : 'Upgrade';
    }

    onSelectPlan(scope: SubscriptionScope, plan: SubscriptionPlan): void {
        if (!this.isLoggedIn()) {
            this.router.navigate(['/sign-in'], { queryParams: { returnUrl: this.router.url } });
            return;
        }

        if (this.isCurrentPlan(plan)) return;

        this.isUpgrading.set(true);
        this.subscriptionFacade
            .upgradeToPlan({ code: plan.code, trialDays: plan.trialDays, scope })
            .subscribe({
                next: () => {
                    this.isUpgrading.set(false);
                    this.snackBar.open('Plan updated', 'OK', { duration: 2500 });
                    this.router.navigate(['/user/dashboard']);
                },
                error: () => {
                    this.isUpgrading.set(false);
                    this.snackBar.open('Could not update plan. Please try again.', 'OK', { duration: 3500 });
                },
            });
    }
}