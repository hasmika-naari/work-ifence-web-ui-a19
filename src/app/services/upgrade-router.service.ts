import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardContext, DashboardContextService } from './dashboard-context.service';

export type UpgradeErrorCode =
  | 'FEATURE_NOT_ENABLED'
  | 'SUBSCRIPTION_EXPIRED'
  | 'SEAT_LIMIT_REACHED'
  | 'RESUME_LIMIT_REACHED'
  | 'RESUME_LIMIT_EXCEEDED'
  | string;

@Injectable({ providedIn: 'root' })
export class UpgradeRouterService {
  private readonly router = inject(Router);
  private readonly ctx = inject(DashboardContextService);
  private readonly platformId = inject(PLATFORM_ID);

  goToPricingForContext(context: DashboardContext): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const queryParams = context === 'ENTERPRISE' ? { scope: 'enterprise' } : undefined;
    this.router.navigate(['/pricing'], { queryParams });
  }

  goToPricingForCurrentContext(): void {
    this.goToPricingForContext(this.ctx.context());
  }

  goToPricingForError(errorCode: UpgradeErrorCode, context?: DashboardContext): void {
    const code = (errorCode ?? '').toString().toUpperCase();

    // Seat/enterprise limits should always send to enterprise pricing.
    if (code === 'SEAT_LIMIT_REACHED') {
      this.goToPricingForContext('ENTERPRISE');
      return;
    }

    // Otherwise, use provided context or the current dashboard context.
    this.goToPricingForContext(context ?? this.ctx.context());
  }
}
