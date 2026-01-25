import { Injectable, Injector, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, of, shareReplay, startWith, switchMap } from 'rxjs';
import { AccessMeDto } from '../models/access-me.model';
import { AccessApiService } from '../services/access-api.service';

@Injectable({ providedIn: 'root' })
export class AccessFacadeService {
  private readonly injector = inject(Injector);
  private readonly api = inject(AccessApiService);

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

  reload(): void {
    this.refresh$.next();
  }

  isAdmin(me: AccessMeDto = this.accessMeSignal()): boolean {
    return (me.mode ?? 'PERSONAL') === 'ADMIN';
  }

  isEnterprise(me: AccessMeDto = this.accessMeSignal()): boolean {
    const mode = me.mode ?? 'PERSONAL';
    return mode === 'ENTERPRISE_ADMIN' || mode === 'ENTERPRISE_EMPLOYEE';
  }

  canUseJobTracking(me: AccessMeDto = this.accessMeSignal()): boolean {
    return this.isSubscriptionOk(me) && me.entitlements?.jobTrackingEnabled === true;
  }

  canUseCourseCentral(me: AccessMeDto = this.accessMeSignal()): boolean {
    return this.isSubscriptionOk(me) && me.entitlements?.courseCentralEnabled === true;
  }

  canUseMultipleTemplates(me: AccessMeDto = this.accessMeSignal()): boolean {
    if (!this.isSubscriptionOk(me)) return false;
    const level = (me.entitlements?.templateAccessLevel ?? '').toString().toUpperCase();
    return level !== 'BASIC';
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
        return this.canUseJobTracking(me) ? { enabled: true } : { enabled: false, reason: 'Upgrade required' };

      default:
        return { enabled: false, reason: 'Not available' };
    }
  }

  private isSubscriptionOk(me: AccessMeDto): boolean {
    const status = (me.subscription?.status ?? '').toString().toUpperCase();
    return status === 'ACTIVE' || status === 'TRIALING';
  }
}
