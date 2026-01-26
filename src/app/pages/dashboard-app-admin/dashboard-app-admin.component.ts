import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { BioProfile } from 'src/app/services/profile.model';
import { AdminOnboardingRequestsComponent } from 'src/app/pages/admin/onboarding/admin-onboarding-requests.component';
import { AdminSubscriptionsComponent } from 'src/app/pages/admin/subscriptions/admin-subscriptions.component';
import { AdminPlansEntitlementsComponent } from 'src/app/pages/admin/plans/admin-plans-entitlements.component';
import { AdminAuditLogComponent } from 'src/app/pages/admin/audit/admin-audit-log.component';
import { AdminFeatureFlagsComponent } from 'src/app/pages/admin/feature-flags/admin-feature-flags.component';

@Component({
  selector: 'db-app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AdminOnboardingRequestsComponent,
    AdminSubscriptionsComponent,
    AdminPlansEntitlementsComponent,
    AdminAuditLogComponent,
    AdminFeatureFlagsComponent,
  ],
  templateUrl: './dashboard-app-admin.component.html',
  styleUrls: ['./dashboard-app-admin.component.scss'],
})
export class DashboardAppAdminComponent {
  private readonly userStore = inject(UserStoreService);
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
}


