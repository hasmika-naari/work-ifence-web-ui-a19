import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { ResumeTemplateVm } from '../models/resume-template.model';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';

export type TemplateDenyReason = 'LOGIN_REQUIRED' | 'UPGRADE_REQUIRED' | string;

@Injectable({ providedIn: 'root' })
export class TemplateAccessService {
  private readonly access = inject(AccessFacadeService);
  private readonly upgradeDrawer = inject(UpgradeDrawerService);
  private readonly router = inject(Router);

  private readonly me = this.access.accessMeSignal;

  readonly isLoggedIn = computed(() => !!this.me().userId);
  readonly templateAccessLevel = computed(() =>
    (this.me().entitlements?.templateAccessLevel ?? '').toString().toUpperCase()
  );

  canUseTemplate(template: ResumeTemplateVm): { allowed: boolean; reason?: TemplateDenyReason } {
    if (!this.isLoggedIn()) {
      return { allowed: false, reason: 'LOGIN_REQUIRED' };
    }

    const level = this.templateAccessLevel();
    if (level === 'ALL') {
      return { allowed: true };
    }

    if (template.category === 'BASIC') {
      return { allowed: true };
    }

    if (template.category === 'PREMIUM' && (level === 'PREMIUM' || level === 'ALL')) {
      return { allowed: true };
    }

    return { allowed: false, reason: 'UPGRADE_REQUIRED' };
  }

  explainReason(reason?: TemplateDenyReason): string {
    switch ((reason ?? '').toString()) {
      case 'LOGIN_REQUIRED':
        return 'Please sign in to use a template.';
      case 'UPGRADE_REQUIRED':
        return 'Upgrade your plan to save and export resumes with premium templates.';
      default:
        return 'This template is locked.';
    }
  }

  handleDenied(reason: TemplateDenyReason | undefined, returnUrl?: string): void {
    const r = (reason ?? '').toString();
    if (r === 'LOGIN_REQUIRED') {
      void this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: returnUrl ?? this.router.url },
      });
      return;
    }

    this.upgradeDrawer.openForContext('PERSONAL', {
      title: 'Premium template access',
      message: this.explainReason(reason),
      returnUrl,
    });
  }
}
