import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, of, shareReplay, startWith, switchMap } from 'rxjs';
import { AccessMeDto } from '../models/access-me.model';
import { AccessApiService } from '../services/access-api.service';
import type { FeatureDeniedReason, FeatureKey, FeaturePricingScope } from '../models/feature-key.model';
import type { FeatureFlagKey } from 'src/app/models/feature-flag.model';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';

@Injectable({ providedIn: 'root' })
export class AccessFacadeService {
  private readonly injector = inject(Injector);
  private readonly api = inject(AccessApiService);
  private readonly remoteConfig = inject(RemoteConfigFacadeService);

  private readonly refresh$ = new Subject<void>();

  readonly accessMe$: Observable<AccessMeDto> = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.api.getAccessMe().pipe(
        catchError(() => of({} as AccessMeDto))
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Template-friendly access snapshot (keeps checks centralized in this facade)
  readonly accessMeSignal = toSignal(this.accessMe$, {
    injector: this.injector,
    initialValue: {} as AccessMeDto,
  });

  readonly lastDeniedReason = signal<FeatureDeniedReason | null>(null);

  readonly isLoggedIn = computed(() => !!this.accessMeSignal()?.userId);

  reload(): void {
    this.refresh$.next();
  }

  can(feature: FeatureKey, me: AccessMeDto = this.accessMeSignal()): boolean {
    const flagKey = this.featureToFlagKey(feature);
    if (flagKey && !this.remoteConfig.isFlagEnabled(flagKey)) {
      this.lastDeniedReason.set({
        feature,
        code: 'FEATURE_DISABLED_BY_ADMIN',
        message: 'This feature is temporarily disabled.',
        pricingScope: this.defaultPricingScope(feature, me),
      });
      return false;
    }

    // Note: default behavior is to require an active/trial subscription for premium features.
    // If the user is logged out, subscription is not OK and checks will return false.
    switch (feature) {
      case 'JOB_TRACKING':
        return this.isSubscriptionOk(me) && me.entitlements?.jobTrackingEnabled === true;

      case 'ALERTS':
        return this.isSubscriptionOk(me) && me.entitlements?.alertsEnabled === true;

      case 'COURSE_CENTRAL':
        return this.isSubscriptionOk(me) && me.entitlements?.courseCentralEnabled === true;

      case 'TEMPLATES_PREMIUM': {
        if (!this.isSubscriptionOk(me)) return false;
        const level = (me.entitlements?.templateAccessLevel ?? '').toString().toUpperCase();
        return level !== 'BASIC';
      }

      case 'RESUME_CREATE': {
        if (!this.isSubscriptionOk(me)) return false;
        const remaining = this.resumeLimitRemaining(me);
        if (remaining === undefined) return true;
        return remaining > 0;
      }

      case 'ENTERPRISE_INVITES':
        // Seat limits are enforced in the enterprise members page using enterpriseUsersLimit.
        // This feature gate is kept as a placeholder for consistent routing/UI patterns.
        return this.isEnterprise(me);

      default:
        return false;
    }
  }

  require(feature: FeatureKey, me: AccessMeDto = this.accessMeSignal()): boolean {
    if (this.can(feature, me)) {
      this.lastDeniedReason.set(null);
      return true;
    }

    // If can() already set a flag-denied reason, keep it.
    const existing = this.lastDeniedReason();
    if (existing?.feature === feature && existing?.code === 'FEATURE_DISABLED_BY_ADMIN') {
      return false;
    }

    this.lastDeniedReason.set({
      feature,
      message: this.denyMessage(feature, me),
      pricingScope: this.defaultPricingScope(feature, me),
    });
    return false;
  }

  denyMessage(feature: FeatureKey, me: AccessMeDto = this.accessMeSignal()): string {
    const flagKey = this.featureToFlagKey(feature);
    if (flagKey && !this.remoteConfig.isFlagEnabled(flagKey)) {
      return 'This feature is temporarily disabled.';
    }

    if (!this.isSubscriptionOk(me)) return 'Subscription required';

    switch (feature) {
      case 'JOB_TRACKING':
        return 'Upgrade to unlock Job Application Manager';
      case 'ALERTS':
        return 'Upgrade to unlock Alerts & Notifications';
      case 'COURSE_CENTRAL':
        return 'Upgrade to unlock Course Central';
      case 'TEMPLATES_PREMIUM':
        return 'Upgrade to unlock premium templates';
      case 'RESUME_CREATE':
        return 'Resume limit reached';
      case 'ENTERPRISE_INVITES':
        return 'Upgrade to invite more members';
      default:
        return 'Upgrade required';
    }
  }

  private defaultPricingScope(feature: FeatureKey, me: AccessMeDto): FeaturePricingScope {
    // Default to enterprise pricing for enterprise-specific features.
    if (feature === 'ENTERPRISE_INVITES') return 'enterprise';
    return this.isEnterprise(me) ? 'enterprise' : 'individual';
  }

  isAdmin(me: AccessMeDto = this.accessMeSignal()): boolean {
    return (me.mode ?? 'PERSONAL') === 'ADMIN';
  }

  isEnterprise(me: AccessMeDto = this.accessMeSignal()): boolean {
    const mode = me.mode ?? 'PERSONAL';
    return mode === 'ENTERPRISE_ADMIN' || mode === 'ENTERPRISE_EMPLOYEE';
  }

  canUseJobTracking(me: AccessMeDto = this.accessMeSignal()): boolean {
    return this.can('JOB_TRACKING', me);
  }

  canUseCourseCentral(me: AccessMeDto = this.accessMeSignal()): boolean {
    return this.can('COURSE_CENTRAL', me);
  }

  canUseMultipleTemplates(me: AccessMeDto = this.accessMeSignal()): boolean {
    return this.can('TEMPLATES_PREMIUM', me);
  }

  resumeLimitRemaining(me: AccessMeDto = this.accessMeSignal()): number | undefined {
    const limit = me.entitlements?.resumeLimit;
    if (typeof limit !== 'number') return undefined;
    const used = me.counts?.resumeCount ?? 0;
    return Math.max(0, limit - used);
  }

  buildToolAccess(
    toolKey: 'RESUME_BUILD' | 'JOB_APP_CREATE' | 'RESUME_MANAGE' | 'JOB_APP_MANAGE'
  ): { enabled: boolean; reason?: string } {
    const me = this.accessMeSignal();

    if (!this.isSubscriptionOk(me)) {
      return { enabled: false, reason: 'Subscription required' };
    }

    switch (toolKey) {
      case 'RESUME_BUILD': {
        const remaining = this.resumeLimitRemaining(me);
        if (remaining === undefined) return { enabled: true };
        return remaining > 0 ? { enabled: true } : { enabled: false, reason: 'Resume limit reached' };
      }
      case 'RESUME_MANAGE':
        return { enabled: true };

      case 'JOB_APP_CREATE':
      case 'JOB_APP_MANAGE':
        return this.can('JOB_TRACKING', me)
          ? { enabled: true }
          : { enabled: false, reason: this.denyMessage('JOB_TRACKING', me) };

      default:
        return { enabled: false, reason: 'Not available' };
    }
  }

  private isSubscriptionOk(me: AccessMeDto | null | undefined): boolean {
    if (!me) return false;
    const status = (me.subscription?.status ?? '').toString().toUpperCase();
    return status === 'ACTIVE' || status === 'TRIALING';
  }

  private featureToFlagKey(feature: FeatureKey): FeatureFlagKey | null {
    switch (feature) {
      case 'JOB_TRACKING':
        return 'JOB_TRACKING';
      case 'ALERTS':
        return 'ALERTS';
      case 'COURSE_CENTRAL':
        return 'COURSE_CENTRAL';
      case 'TEMPLATES_PREMIUM':
      case 'RESUME_CREATE':
        return 'RESUME_BUILDER';
      case 'ENTERPRISE_INVITES':
        return 'ENTERPRISE_CONSOLE';
      default:
        return null;
    }
  }
}
