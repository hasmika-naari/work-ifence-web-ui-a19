import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { AccessFacadeService } from './access-facade.service';
import { SubscriptionApiService } from '../services/subscription-api.service';
import { DashboardContextService } from '../services/dashboard-context.service';
import type { CreateSubscriptionUpgradeRequest, SubscriptionPlan, SubscriptionScope } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionFacadeService {
  private readonly injector = inject(Injector);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly api = inject(SubscriptionApiService);
  private readonly dashboardContext = inject(DashboardContextService);

  private readonly plansSignals = new Map<SubscriptionScope, ReturnType<typeof toSignal<SubscriptionPlan[]>>>();
  private readonly plansRefresh = new Map<SubscriptionScope, BehaviorSubject<void>>();
  private readonly planLoadErrors = signal<Record<SubscriptionScope, string | null>>({
    INDIVIDUAL: null,
    ENTERPRISE: null,
  });

  constructor() {
    this.initializePlansSignal('INDIVIDUAL');
    this.initializePlansSignal('ENTERPRISE');
  }

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

    return this.initializePlansSignal(scope);
  }

  planLoadError(scope: SubscriptionScope): string | null {
    return this.planLoadErrors()[scope] ?? null;
  }

  reloadPlans(scope: SubscriptionScope): void {
    this.plansRefresh.get(scope)?.next();
  }

  private initializePlansSignal(scope: SubscriptionScope) {
    const refresh$ = new BehaviorSubject<void>(void 0);
    this.plansRefresh.set(scope, refresh$);

    const sig = toSignal(refresh$.pipe(
      switchMap(() => this.api.getActivePlans(scope).pipe(
        tap(() => this.setPlanLoadError(scope, null)),
        catchError((error) => {
          console.error(`Failed to load ${scope.toLowerCase()} subscription plans.`, error);
          this.setPlanLoadError(scope, this.toPlanLoadErrorMessage(error));
          return of([] as SubscriptionPlan[]);
        })
      ))
    ), {
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
  upgrade(code: string): Observable<unknown> {
    const scope = this.currentScopeSignal();
    const plan = this.plansSignal(scope)().find(p => (p.code ?? '').toString() === code);
    return this.upgradeToPlan({ ...(plan ?? {}), code: code, scope });
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

  submitUpgradeRequest(req: CreateSubscriptionUpgradeRequest): Observable<unknown> {
    return this.api.submitUpgradeRequest(req);
  }

  private setPlanLoadError(scope: SubscriptionScope, message: string | null): void {
    this.planLoadErrors.update((current) => ({
      ...current,
      [scope]: message,
    }));
  }

  private toPlanLoadErrorMessage(error: unknown): string {
    const status = (error as { status?: unknown } | null | undefined)?.status;
    if (status === 504) {
      return 'Plan options are taking too long to load. You can retry and still review your current plan details.';
    }

    if (status === 0) {
      return 'Plan options are temporarily unavailable. Check the backend connection and try again.';
    }

    return 'Plan options could not be loaded right now. Please try again.';
  }
}
