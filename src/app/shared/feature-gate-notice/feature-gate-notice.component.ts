import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import type { FeatureDeniedReason } from 'src/app/models/feature-key.model';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';

@Component({
  selector: 'app-feature-gate-notice',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './feature-gate-notice.component.html',
  styleUrl: './feature-gate-notice.component.scss',
})
export class FeatureGateNoticeComponent {
  private readonly router = inject(Router);
  private readonly accessFacade = inject(AccessFacadeService);

  @Input() reason: FeatureDeniedReason | null = null;
  @Input() loggedIn = false;

  get title(): string {
    if (this.reason?.code === 'FEATURE_DISABLED_BY_ADMIN') return 'Temporarily disabled';
    return 'Upgrade required';
  }

  get message(): string {
    return this.reason?.message ?? "You don’t have access to this feature.";
  }

  get showLogin(): boolean {
    return !this.loggedIn;
  }

  get showOk(): boolean {
    return this.loggedIn && this.reason?.code === 'FEATURE_DISABLED_BY_ADMIN';
  }

  get showUpgrade(): boolean {
    return this.loggedIn && this.reason?.code !== 'FEATURE_DISABLED_BY_ADMIN';
  }

  close(): void {
    this.accessFacade.clearDeniedReason();
  }

  goLogin(): void {
    this.close();
    void this.router.navigateByUrl('/sign-in');
  }

  goUpgrade(): void {
    this.close();
    void this.router.navigateByUrl('/pricing');
  }
}
