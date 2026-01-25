import { AsyncPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { BioProfile } from 'src/app/services/profile.model';
import { DashboardFacadeService } from 'src/app/facades/dashboard-facade.service';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { AccessMeDto } from 'src/app/models/access-me.model';

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
  private dashboardFacade: DashboardFacadeService = inject(DashboardFacadeService);
  private accessFacade: AccessFacadeService = inject(AccessFacadeService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  vm$ = this.dashboardFacade.vm$;
  accessMe = this.accessFacade.accessMeSignal;

  toolsVm = computed(() => this.buildTools());
  statsVm = computed(() => this.buildStats(this.accessMe()));

  private buildTools() {
    const lockedMsg = 'Upgrade to access this feature';

    const resumeBuild = this.accessFacade.buildToolAccess('RESUME_BUILD');
    const jobAppCreate = this.accessFacade.buildToolAccess('JOB_APP_CREATE');
    const resumeManage = this.accessFacade.buildToolAccess('RESUME_MANAGE');
    const jobAppManage = this.accessFacade.buildToolAccess('JOB_APP_MANAGE');

    return [
      {
        key: 'build-resume',
        icon: 'assets/img/home/resume_animated.jpg',
        title: 'Build Your Resume',
        description: 'Create the perfect resume to land your dream job',
        route: '/user/resumes/resume',
        enabled: resumeBuild.enabled,
        disabledMessage: resumeBuild.reason ?? lockedMsg,
      },
      {
        key: 'create-job-application',
        icon: 'assets/img/home/resume_animated.jpg',
        title: 'Create Job Application',
        description: 'Create Job Application to Track',
        route: '/user/job-applications/application',
        enabled: jobAppCreate.enabled,
        disabledMessage: jobAppCreate.reason ?? lockedMsg,
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
      },
    ];
  }
  buildStats(me: AccessMeDto) {
    const resumeCount = me.counts?.resumeCount ?? 0;
    const jobApplicationCount = me.counts?.jobApplicationCount ?? 0;
    const ongoingApplicationsCount = me.counts?.ongoingApplicationsCount ?? 0;
    const offeredCount = me.counts?.offeredCount ?? 0;
    const rejectedApplicationsCount = me.counts?.rejectedApplicationsCount ?? 0;

    return [
      {
        title: 'Resumes Created',
        value: String(resumeCount),
        sub: '',
        color: '#4285F4',
        icon: 'pi pi-file',
      },
      {
        title: 'Applications Sent',
        value: String(jobApplicationCount),
        sub: '',
        color: '#9C27B0',
        icon: 'pi pi-send',
      },
      {
        title: 'Ongoing Applications',
        value: String(ongoingApplicationsCount),
        sub: '',
        color: '#FBBC05',
        icon: 'pi pi-clock',
      },
      {
        title: 'Offered',
        value: String(offeredCount),
        sub: '',
        color: '#34A853',
        icon: 'pi pi-thumbs-up',
      },
      {
        title: 'Rejected Applications',
        value: String(rejectedApplicationsCount),
        sub: '',
        color: '#EA4335',
        icon: 'pi pi-thumbs-down',
      },
    ];
  }



  onToolClick(tool: { route: string; enabled: boolean; disabledMessage?: string }) {
    if (tool.enabled) {
      this.routerService.navigate([tool.route]);
      return;
    }

    this.snackBar.open(tool.disabledMessage || 'Upgrade required', 'View plans', {
      duration: 2500,
    });
    this.routerService.navigate(['/pricing']);
  }


}


