import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, map } from 'rxjs';
import { AccessFacadeService } from './access-facade.service';
import { SubscriptionApiService } from '../services/subscription-api.service';
import { DashboardContextService } from '../services/dashboard-context.service';
import type { SubscriptionPlan, SubscriptionScope } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionFacadeService {
  private readonly injector = inject(Injector);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly api = inject(SubscriptionApiService);
  private readonly dashboardContext = inject(DashboardContextService);

  private readonly plansSignals = new Map<SubscriptionScope, ReturnType<typeof toSignal<SubscriptionPlan[]>>>();

  readonly currentScopeSignal = computed<SubscriptionScope>(() => {
    const ctx = this.dashboardContext.context();
    const me = this.accessFacade.accessMeSignal();

    if (ctx === 'ENTERPRISE' && !!me.enterpriseId) return 'ENTERPRISE';
    return 'INDIVIDUAL';
  });

  /**
   * Current subscription summary comes from /api/access/me (cached in AccessFacadeService).
   * This avoids extra API calls for the common UI.
   */
  readonly currentSubscriptionSignal = computed(() => this.accessFacade.accessMeSignal().subscription);

  plansSignal(scope: SubscriptionScope) {
    const cached = this.plansSignals.get(scope);
    if (cached) return cached;

    const sig = toSignal(this.api.getActivePlans(scope), {
      injector: this.injector,
      initialValue: [] as SubscriptionPlan[],
    });

    this.plansSignals.set(scope, sig);
    return sig;
  }

  /**
   * Upgrade/start a subscription for the current scope.
   * Prefer using upgradeToPlan when you already have the plan object (to set startTrial).
   */
  upgrade(planCode: string): Observable<unknown> {
    const scope = this.currentScopeSignal();
    const plan = this.plansSignal(scope)().find(p => (p.code ?? '').toString() === planCode);
    return this.upgradeToPlan({ ...(plan ?? {}), code: planCode, scope });
  }

  upgradeToPlan(plan: Pick<SubscriptionPlan, 'code' | 'trialDays'> & { scope?: SubscriptionScope }): Observable<unknown> {
    const scope = (plan.scope ?? this.currentScopeSignal()) as SubscriptionScope;
    const me = this.accessFacade.accessMeSignal();

    const subscriberId = scope === 'ENTERPRISE' ? me.enterpriseId : me.userId;

    return this.api
      .startSubscription({
        scope,
        subscriberId: subscriberId || undefined,
        planCode: (plan.code ?? '').toString(),
        startTrial: (plan.trialDays ?? 0) > 0 ? true : undefined,
      })
      .pipe(
        map((res) => {
          // Refresh access + entitlements snapshot after a successful upgrade.
          this.accessFacade.reload();
          return res;
        })
      );
  }
}
