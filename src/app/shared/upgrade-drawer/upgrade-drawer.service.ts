import { Injectable, computed, inject, signal } from '@angular/core';
import type { SubscriptionScope } from 'src/app/models/subscription.model';
import type { DashboardContext } from 'src/app/services/dashboard-context.service';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';

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
}