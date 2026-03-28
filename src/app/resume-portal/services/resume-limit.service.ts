import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import type { DashboardContext } from 'src/app/services/dashboard-context.service';
import type { ResumeCreateEligibilityResponse } from 'src/app/services/resume.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';

export type ResumeLimitDenyReason = 'LOGIN_REQUIRED' | 'RESUME_LIMIT_REACHED' | string;
export type ResumeLimitAction = 'create' | 'duplicate';

export interface ResumeCreateDecision {
  allowed: boolean;
  reason?: ResumeLimitDenyReason;
  remaining?: number;
  used?: number;
  limit?: number | null;
}

@Injectable({ providedIn: 'root' })
export class ResumeLimitService {
  private readonly access = inject(AccessFacadeService);
  private readonly upgradeDrawer = inject(UpgradeDrawerService);
  private readonly userStore = inject(UserStoreService);
  private readonly router = inject(Router);
  private readonly localResumeCountOverride = signal<number | null>(null);

  private readonly me = this.access.accessMeSignal;

  constructor() {
    effect(() => {
      const override = this.localResumeCountOverride();
      const serverCount = this.me().counts?.resumeCount;

      if (override !== null && typeof serverCount === 'number' && serverCount === override) {
        this.localResumeCountOverride.set(null);
      }
    });
  }

  readonly resumeLimit = computed(() => this.me().entitlements?.resumeLimit);
  readonly hasResumeLimit = computed(() => typeof this.resumeLimit() === 'number');
  readonly resumeCount = computed(() => {
    const override = this.localResumeCountOverride();
    const fromAccess = this.me().counts?.resumeCount;
    const fromStore = this.userStore.state().resumeListItems?.length ?? 0;

    if (override !== null) {
      return Math.max(override, fromStore);
    }

    if (typeof fromAccess === 'number') return Math.max(fromAccess, fromStore);
    return fromStore;
  });
  readonly remaining = computed(() => {
    const limit = this.resumeLimit();
    if (typeof limit !== 'number') {
      return null;
    }

    return Math.max(0, limit - this.resumeCount());
  });
  readonly isAtLimit = computed(() => (this.remaining() ?? 1) <= 0);
  readonly usageLabel = computed(() => {
    const used = this.resumeCount();
    const limit = this.resumeLimit();

    if (typeof limit !== 'number') {
      return `${used} resume${used === 1 ? '' : 's'} saved`;
    }

    return `${used} of ${limit} resumes used`;
  });
  readonly usageDetail = computed(() => {
    const limit = this.resumeLimit();
    const remaining = this.remaining();

    if (typeof limit !== 'number' || remaining === null) {
      return 'Your plan currently has no published resume storage cap.';
    }

    if (remaining <= 0) {
      return 'Limit reached. Upgrade to create or duplicate more resumes.';
    }

    return `${remaining} resume slot${remaining === 1 ? '' : 's'} remaining on your current plan.`;
  });

  canCreateResume(): ResumeCreateDecision {
    if (!this.me().userId) {
      return { allowed: false, reason: 'LOGIN_REQUIRED', used: this.resumeCount(), limit: this.resumeLimit() ?? null };
    }

    const limit = this.resumeLimit();
    const used = this.resumeCount();

    if (typeof limit !== 'number') {
      return { allowed: true, used, limit: null };
    }

    const remaining = Math.max(0, limit - used);

    if (remaining <= 0) {
      return { allowed: false, reason: 'RESUME_LIMIT_REACHED', remaining, used, limit };
    }

    return { allowed: true, remaining, used, limit };
  }

  syncResumeCount(nextCount: number): void {
    this.localResumeCountOverride.set(Math.max(0, nextCount));
    this.access.reload();
  }

  openSubscriptionPlans(): void {
    this.upgradeDrawer.openForContext('PERSONAL', {
      title: 'Resume storage plan',
      message: `${this.usageDetail()} Review plans with more storage if you need additional resume slots.`,
      returnUrl: this.router.url,
    });
  }

  explainDenied(decision: ResumeCreateDecision, action: ResumeLimitAction = 'create'): string {
    if (decision.reason === 'LOGIN_REQUIRED') {
      return 'Please sign in to manage resumes for your account.';
    }

    if (decision.reason === 'RESUME_LIMIT_REACHED') {
      if (typeof decision.limit === 'number' && typeof decision.used === 'number') {
        return `You've used all ${decision.used} of ${decision.limit} resume slots. Upgrade to ${action === 'duplicate' ? 'duplicate this resume and save more versions' : 'create more resumes'}.`;
      }

      return `Resume limit reached. Upgrade to ${action === 'duplicate' ? 'duplicate this resume and save more versions' : 'create more resumes'}.`;
    }

    return `You can't ${action} another resume right now.`;
  }

  handleDenied(decision: ResumeCreateDecision, options?: { action?: ResumeLimitAction; returnUrl?: string }): void {
    const action = options?.action ?? 'create';

    if (decision.reason === 'LOGIN_REQUIRED') {
      void this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: options?.returnUrl ?? this.router.url },
      });
      return;
    }

    this.upgradeDrawer.openForContext('PERSONAL', {
      title: decision.reason === 'RESUME_LIMIT_REACHED' ? 'Resume limit reached' : 'Upgrade required',
      message: this.explainDenied(decision, action),
      returnUrl: options?.returnUrl ?? this.router.url,
    });
  }

  isCreateEligibilityAllowed(response: ResumeCreateEligibilityResponse | null | undefined): boolean {
    if (!response) {
      return true;
    }

    if (typeof response.allowed === 'boolean') {
      return response.allowed;
    }

    if (typeof response.eligible === 'boolean') {
      return response.eligible;
    }

    if (typeof response.blocked === 'boolean') {
      return !response.blocked;
    }

    return true;
  }

  handleEligibilityDenied(response: ResumeCreateEligibilityResponse, options?: { action?: ResumeLimitAction; returnUrl?: string }): void {
    const action = options?.action ?? 'create';
    const title = this.getEligibilityTitle(response);
    const message = this.getEligibilityMessage(response, action);

    this.upgradeDrawer.openForContext(this.getEligibilityContext(response), {
      title,
      message,
      returnUrl: options?.returnUrl ?? this.router.url,
      payload: response,
    });
  }

  handleLimitDenied(): void {
    this.handleDenied(this.canCreateResume(), { action: 'create' });
  }

  private getEligibilityTitle(response: ResumeCreateEligibilityResponse): string {
    const explicitTitle = (response.title ?? '').toString().trim();
    if (explicitTitle) {
      return explicitTitle;
    }

    const code = (response.code ?? response.reason ?? '').toString().trim().toUpperCase();
    if (code === 'RESUME_LIMIT_REACHED' || code === 'RESUME_LIMIT_EXCEEDED') {
      return 'Resume limit reached';
    }

    return 'Upgrade required';
  }

  private getEligibilityMessage(response: ResumeCreateEligibilityResponse, action: ResumeLimitAction): string {
    const explicitMessage = (response.message ?? '').toString().trim();
    if (explicitMessage) {
      return explicitMessage;
    }

    const code = (response.code ?? response.reason ?? '').toString().trim().toUpperCase();
    if (code === 'RESUME_LIMIT_REACHED' || code === 'RESUME_LIMIT_EXCEEDED') {
      return this.explainDenied({
        allowed: false,
        reason: 'RESUME_LIMIT_REACHED',
      }, action);
    }

    return this.explainDenied({
      allowed: false,
      reason: (response.reason ?? response.code ?? 'UPGRADE_REQUIRED').toString(),
    }, action);
  }

  private getEligibilityContext(response: ResumeCreateEligibilityResponse): DashboardContext {
    const scope = (response.scope ?? '').toString().trim().toUpperCase();
    return scope === 'ENTERPRISE' ? 'ENTERPRISE' : 'PERSONAL';
  }
}
