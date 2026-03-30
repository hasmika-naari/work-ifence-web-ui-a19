import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import type { SubscriptionPlanRequestRow, SubscriptionScope } from 'src/app/models/subscription.model';
import type { DashboardContext } from 'src/app/services/dashboard-context.service';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';
import { SubscriptionFacadeService } from 'src/app/facades/subscription-facade.service';

export interface UpgradeDrawerState {
  open: boolean;
  scope: SubscriptionScope;
  title: string;
  message: string;
  returnUrl?: string;
  payload?: unknown;
}

export interface OpenUpgradeDrawerOptions {
  title?: string;
  message?: string;
  returnUrl?: string;
  payload?: unknown;
}

@Injectable({ providedIn: 'root' })
export class UpgradeDrawerService {
  private readonly dashboardContext = inject(DashboardContextService);
  private readonly subscriptionFacade = inject(SubscriptionFacadeService);

  private readonly state = signal<UpgradeDrawerState>({
    open: false,
    scope: 'INDIVIDUAL',
    title: 'Upgrade required',
    message: 'This action requires an upgraded plan.',
    returnUrl: undefined,
    payload: undefined,
  });

  readonly snapshot = computed(() => this.state());
  readonly visible = computed(() => this.state().open);

  /** Raw plan request rows for the current user. Refreshed on drawer open and after submit. */
  readonly myPlanRequests = signal<SubscriptionPlanRequestRow[]>([]);
  readonly myPlanRequestsLoading = signal<boolean>(false);
  /** Uppercase plan codes that have a PENDING request — derived, no separate management needed. */
  readonly pendingPlanCodes = computed<Set<string>>(() => new Set(
    this.myPlanRequests()
      .filter(r => (r.status ?? '').toUpperCase() === 'PENDING')
      .map(r => (r.planCode ?? '').toUpperCase())
      .filter(Boolean)
  ));

  openForContext(context: DashboardContext, options?: OpenUpgradeDrawerOptions): void {
    this.state.set({
      open: true,
      scope: context === 'ENTERPRISE' ? 'ENTERPRISE' : 'INDIVIDUAL',
      title: options?.title?.trim() || 'Upgrade required',
      message: options?.message?.trim() || 'This action requires an upgraded plan.',
      returnUrl: options?.returnUrl,
      payload: options?.payload,
    });
  }

  openForCurrentContext(options?: OpenUpgradeDrawerOptions): void {
    this.openForContext(this.dashboardContext.context(), options);
  }

  close(): void {
    this.state.update((current) => ({ ...current, open: false }));
  }

  /** Re-fetch plan requests from the server. No-op if a fetch is already in-flight. */
  refreshPendingRequests(): void {
    if (this.myPlanRequestsLoading()) return;
    this.myPlanRequestsLoading.set(true);
    this.subscriptionFacade.getMyPlanRequests().pipe(
      take(1),
      finalize(() => this.myPlanRequestsLoading.set(false)),
    ).subscribe({
      next: (rows) => { this.myPlanRequests.set(rows); },
      error: () => { /* best-effort: keep stale state on error */ },
    });
  }

  /** Optimistically inject a PENDING row for a plan, replacing any prior row for that code. */
  markPlanPending(planCode: string, row: Partial<SubscriptionPlanRequestRow> = {}): void {
    if (!planCode) return;
    const code = planCode.toUpperCase();
    this.myPlanRequests.update(rows => [
      { ...row, planCode: code, status: 'PENDING' },
      ...rows.filter(r => (r.planCode ?? '').toUpperCase() !== code),
    ]);
  }
}