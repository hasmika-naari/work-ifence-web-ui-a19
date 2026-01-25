import { Injectable, computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { UpgradeRouterService } from 'src/app/services/upgrade-router.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';

export type ResumeLimitDenyReason = 'LOGIN_REQUIRED' | 'RESUME_LIMIT_REACHED' | string;

@Injectable({ providedIn: 'root' })
export class ResumeLimitService {
  private readonly access = inject(AccessFacadeService);
  private readonly upgradeRouter = inject(UpgradeRouterService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly userStore = inject(UserStoreService);

  private readonly me = this.access.accessMeSignal;

  readonly resumeLimit = computed(() => this.me().entitlements?.resumeLimit);
  readonly resumeCount = computed(() => {
    const fromAccess = this.me().counts?.resumeCount;
    if (typeof fromAccess === 'number') return fromAccess;
    return this.userStore.state().resumeListItems?.length ?? 0;
  });

  canCreateResume(): { allowed: boolean; reason?: ResumeLimitDenyReason; remaining?: number } {
    if (!this.me().userId) {
      return { allowed: false, reason: 'LOGIN_REQUIRED' };
    }

    const limit = this.resumeLimit();
    if (typeof limit !== 'number') {
      return { allowed: true };
    }

    const used = this.resumeCount();
    const remaining = Math.max(0, limit - used);

    if (remaining <= 0) {
      return { allowed: false, reason: 'RESUME_LIMIT_REACHED', remaining };
    }

    return { allowed: true, remaining };
  }

  handleLimitDenied(): void {
    this.snackBar.open('Resume limit reached. Upgrade to create more resumes.', 'View plans', {
      duration: 3500,
    });

    this.upgradeRouter.goToPricingForContext('PERSONAL');
  }
}
