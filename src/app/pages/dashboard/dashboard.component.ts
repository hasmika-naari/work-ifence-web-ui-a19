import { AsyncPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { BioProfile } from 'src/app/services/profile.model';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import type { FeatureKey } from 'src/app/models/feature-key.model';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';
import { ActiveRoleService } from 'src/app/services/active-role.service';
import { UpgradeRouterService } from 'src/app/services/upgrade-router.service';
import { DashboardSummaryFacadeService } from 'src/app/facades/dashboard-summary-facade.service';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';

@Component({
  selector: 'fury-dashboard',
  standalone: true,
  imports: [MatCardModule, MatSnackBarModule, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line

})
export class DashboardComponent {
 
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  private routerService: Router =  inject(Router);
  private userStore: UserStoreService =  inject(UserStoreService);
  private accessFacade: AccessFacadeService = inject(AccessFacadeService);
  private remoteConfig: RemoteConfigFacadeService = inject(RemoteConfigFacadeService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private dashboardContext: DashboardContextService = inject(DashboardContextService);
  private activeRoleService: ActiveRoleService = inject(ActiveRoleService);
  private upgradeRouter: UpgradeRouterService = inject(UpgradeRouterService);
  private dashboardSummaryFacade: DashboardSummaryFacadeService = inject(DashboardSummaryFacadeService);

  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  accessMe = this.accessFacade.accessMeSignal;
  dashboardCtx = this.dashboardContext.context;
  activeRole = computed(() => this.activeRoleService.getActiveRole()());
  isEnterpriseAdminView = computed(() => this.dashboardCtx() === 'ENTERPRISE' && this.activeRole()?.role === 'ENTERPRISE_ADMIN');

  summaryVm = this.dashboardSummaryFacade.currentSummaryVmSignal;
  summaryLoading = computed(() => this.summaryVm().summary === null);
  lastUpdatedText = computed(() => {
    const vm = this.summaryVm();
    const raw = vm.summary?.lastUpdated;
    if (!raw) return '';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    return `Last updated: ${date.toLocaleString()}`;
  });

  toolsVm = computed(() => this.buildTools());
  statsVm = computed(() => this.buildStats());

  private buildTools() {
    const lockedMsg = 'Upgrade to access this feature';

    const resumeBuild = this.accessFacade.buildToolAccess('RESUME_BUILD');
    const jobAppCreate = this.accessFacade.can('JOB_TRACKING')
      ? { enabled: true }
      : { enabled: false, reason: this.accessFacade.denyMessage('JOB_TRACKING') };
    const resumeManage = this.accessFacade.buildToolAccess('RESUME_MANAGE');
    const jobAppManage = this.accessFacade.can('JOB_TRACKING')
      ? { enabled: true }
      : { enabled: false, reason: this.accessFacade.denyMessage('JOB_TRACKING') };

    const base: Array<{
      key: string;
      icon: string;
      title: string;
      description: string;
      route: string;
      enabled: boolean;
      disabledMessage?: string;
      featureKey?: FeatureKey;
    }> = [
      {
        key: 'build-resume',
        icon: 'assets/img/home/resume_animated.jpg',
        title: 'Build Your Resume',
        description: 'Create the perfect resume to land your dream job',
        route: '/user/resumes/resume',
        enabled: resumeBuild.enabled,
        disabledMessage: resumeBuild.reason ?? lockedMsg,
        featureKey: 'RESUME_CREATE',
      },
      {
        key: 'create-job-application',
        icon: 'assets/img/home/resume_animated.jpg',
        title: 'Create Job Application',
        description: 'Create Job Application to Track',
        route: '/user/job-applications/application',
        enabled: jobAppCreate.enabled,
        disabledMessage: jobAppCreate.reason ?? lockedMsg,
        featureKey: 'JOB_TRACKING',
      },
      {
        key: 'manage-resumes',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Manage Resumes',
        description: 'Organize and track all Resumes',
        route: '/user/resumes',
        enabled: resumeManage.enabled,
        disabledMessage: resumeManage.reason ?? lockedMsg,
      },
      {
        key: 'manage-job-applications',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Manage Job Applications',
        description: 'Organize and track all your job applications in one place',
        route: '/user/job-applications',
        enabled: jobAppManage.enabled,
        disabledMessage: jobAppManage.reason ?? lockedMsg,
        featureKey: 'JOB_TRACKING',
      },
    ];

    // Enterprise admin gets extra shortcuts (UI-only; no backend change)
    if (this.isEnterpriseAdminView() && this.remoteConfig.isFlagEnabledSafe('ENTERPRISE_CONSOLE')) {
      base.push({
        key: 'enterprise-requests',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Manage Requests',
        description: 'Review and manage employee requests',
        route: '/user/requests',
        enabled: true,
        disabledMessage: '',
      });

      base.push({
        key: 'enterprise-org',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Enterprise Org',
        description: 'Manage enterprise profile and settings',
        route: '/user/enterprise/org',
        enabled: true,
        disabledMessage: '',
      });

      base.push({
        key: 'enterprise-members',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Enterprise Members',
        description: 'Invite and manage enterprise members',
        route: '/user/enterprise/members',
        enabled: true,
        disabledMessage: '',
      });

      base.push({
        key: 'enterprise-audit',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Audit Log',
        description: 'Review access denials and admin actions',
        route: '/user/enterprise/audit',
        enabled: true,
        disabledMessage: '',
      });
    }

    return base;
  }
  buildStats() {
    const vm = this.summaryVm();

    if (vm.type === 'ENTERPRISE') {
      const s = vm.summary ?? {};
      return [
        {
          title: 'Active Members',
          value: String(s.membersActive ?? 0),
          sub: '',
          color: '#34A853',
          icon: 'pi pi-users',
        },
        {
          title: 'Invited',
          value: String(s.membersInvited ?? 0),
          sub: '',
          color: '#4285F4',
          icon: 'pi pi-user-plus',
        },
        {
          title: 'Job Applications',
          value: String(s.jobApplicationsTotal ?? 0),
          sub: '',
          color: '#9C27B0',
          icon: 'pi pi-briefcase',
        },
        {
          title: 'Open Roles',
          value: String(s.openRolesCount ?? 0),
          sub: '',
          color: '#FBBC05',
          icon: 'pi pi-sitemap',
        },
        {
          title: 'Service Requests',
          value: String(s.serviceRequestsOpen ?? 0),
          sub: '',
          color: '#EA4335',
          icon: 'pi pi-inbox',
        },
      ];
    }

    const s = vm.summary ?? {};
    return [
      {
        title: 'Resumes Created',
        value: String(s.resumeCount ?? 0),
        sub: '',
        color: '#4285F4',
        icon: 'pi pi-file',
      },
      {
        title: 'Applications Sent',
        value: String(s.jobApplicationCount ?? 0),
        sub: '',
        color: '#9C27B0',
        icon: 'pi pi-send',
      },
      {
        title: 'Ongoing Applications',
        value: String(s.ongoingApplications ?? 0),
        sub: '',
        color: '#FBBC05',
        icon: 'pi pi-clock',
      },
      {
        title: 'Offered',
        value: String(s.offeredCount ?? 0),
        sub: '',
        color: '#34A853',
        icon: 'pi pi-thumbs-up',
      },
      {
        title: 'Rejected',
        value: String(s.rejectedCount ?? 0),
        sub: '',
        color: '#EA4335',
        icon: 'pi pi-thumbs-down',
      },
    ];
  }

  reloadSummary(): void {
    this.dashboardSummaryFacade.reload();
  }



  onToolClick(tool: { route: string; enabled: boolean; disabledMessage?: string; featureKey?: FeatureKey }) {
    if (tool.featureKey && !this.accessFacade.canOrExplain(tool.featureKey)) {
      this.snackBar.open(tool.disabledMessage || 'Upgrade required', 'View plans', {
        duration: 2500,
      });
      this.upgradeRouter.goToPricingForContext(this.dashboardCtx());
      return;
    }

    if (tool.enabled) {
      this.routerService.navigate([tool.route]);
      return;
    }

    this.snackBar.open(tool.disabledMessage || 'Upgrade required', 'View plans', {
      duration: 2500,
    });
    this.upgradeRouter.goToPricingForContext(this.dashboardCtx());
  }


}


