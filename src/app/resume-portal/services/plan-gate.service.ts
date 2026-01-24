import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { PlanType } from '../models/resume.models';
import { UpgradeDialogComponent } from '../components/upgrade-dialog.component';

export const FREE_TEMPLATE_ID = 1;
export const FREE_TEMPLATE_IDS = [1, 2] as const;

@Injectable({ providedIn: 'root' })
export class PlanGateService {
  private userStore = inject(UserStoreService);
  private dialog = inject(MatDialog);

  getPlanType(): PlanType {
    // Primary source: localStorage override for testing
    try {
      const override = globalThis?.localStorage?.getItem('planType');
      if (override === 'FREE' || override === 'SUBSCRIBED') {
        return override;
      }
    } catch {
      // ignore (SSR)
    }

    const authorities = this.userStore.state().account?.authorities ?? [];
    const isSubscribed = authorities.includes('ROLE_SUBSCRIBED') || authorities.includes('ROLE_PREMIUM');
    return isSubscribed ? 'SUBSCRIBED' : 'FREE';
  }

  isFree(): boolean {
    return this.getPlanType() === 'FREE';
  }

  canUseTemplate(templateId: number): boolean {
    if (!this.isFree()) {
      return true;
    }
    return (FREE_TEMPLATE_IDS as readonly number[]).includes(templateId);
  }

  canCreateResume(existingResumeCount: number): boolean {
    // Temporarily disabled: allow creating multiple resumes on free plan.
    // (We will re-enable plan limits once the end-to-end flow is finalized.)
    return true;
  }

  /** Returns true if allowed; otherwise opens upgrade dialog and returns false. */
  enforceOrUpgrade(allowed: boolean, reason?: string): boolean {
    if (allowed) {
      return true;
    }

    this.dialog.open(UpgradeDialogComponent, {
      width: '520px',
      data: {
        reason,
      },
    });
    return false;
  }
}
