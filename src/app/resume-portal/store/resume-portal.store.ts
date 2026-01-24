import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Resume } from 'src/app/services/resume.model';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AuthGateService } from '../services/auth-gate.service';
import { PlanGateService, FREE_TEMPLATE_ID } from '../services/plan-gate.service';
import { ResumePortalApiService } from '../services/resume-portal-api.service';

export type PortalTemplate = {
  id: number;
  name: string;
  description: string;
  category: 'Simple' | 'Modern' | 'Creative';
  isPremium: boolean;
  previewImageUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class ResumePortalStore {
  private userStore = inject(UserStoreService);
  private authGate = inject(AuthGateService);
  private planGate = inject(PlanGateService);
  private api = inject(ResumePortalApiService);
  private router = inject(Router);

  private loadingMyResumes = signal(false);

  readonly isLoggedIn = computed(() => this.userStore.state().isUserLoggedIn);
  readonly planType = computed(() => this.planGate.getPlanType());

  readonly templates = signal<PortalTemplate[]>([
    {
      id: FREE_TEMPLATE_ID,
      name: 'Atlantic Blue',
      description: 'Clean, modern single-column resume template.',
      category: 'Simple',
      isPremium: false,
      previewImageUrl: 'assets/img/templates/rt1.png',
    },
    {
      id: 2,
      name: 'Minimal',
      description: 'Simple minimal layout with strong readability.',
      category: 'Simple',
      isPremium: false,
      previewImageUrl: 'assets/img/templates/rt2.png',
    },
    {
      id: 3,
      name: 'Mono',
      description: 'Clean single-column layout with clear spacing.',
      category: 'Simple',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt3.png',
    },
    {
      id: 4,
      name: 'Modern Crisp',
      description: 'Modern typography and balanced spacing.',
      category: 'Modern',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt4.png',
    },
    {
      id: 5,
      name: 'Modern Split',
      description: 'Modern split sections for skills and experience.',
      category: 'Modern',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt5.png',
    },
    {
      id: 6,
      name: 'Creative Accent',
      description: 'Creative highlights for titles and key sections.',
      category: 'Creative',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt6.png',
    },
    {
      id: 7,
      name: 'Creative Blocks',
      description: 'Creative block layout with strong hierarchy.',
      category: 'Creative',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt7.png',
    },
  ]);

  readonly myResumes = computed(() => this.userStore.state().resumeListItems);
  readonly isLoadingMyResumes = computed(() => this.loadingMyResumes());

  async refreshMyResumes(): Promise<void> {
    if (!this.isLoggedIn()) {
      return;
    }

    this.loadingMyResumes.set(true);
    try {
      const resumes = await this.api.getMyResumes();
      this.userStore.setResumeDataListItems(resumes);
      this.userStore.setFilteredResumes(resumes);
    } finally {
      this.loadingMyResumes.set(false);
    }
  }

  openMyResumes(): void {
    void this.router.navigateByUrl('/user/resumes');
  }

  /**
   * Start the resume builder with the default template (matches the dashboard
   * "Create Resume" flow).
   */
  createResumeDefault(): void {
    // Include templateId so the builder can initialize correctly after login.
    const builderUrl = `/user/resumes/resume?templateId=${encodeURIComponent(String(FREE_TEMPLATE_ID))}`;

    // If not logged in, show login screen, then land directly on builder.
    if (!this.authGate.requireLoginOrRedirect(builderUrl)) {
      return;
    }

    const existingCount = this.myResumes()?.length ?? 0;
    if (!this.planGate.enforceOrUpgrade(this.planGate.canCreateResume(existingCount), 'Free plan allows only one resume.')) {
      return;
    }

    // Reset builder state to defaults.
    this.userStore.setResumeForm(new Resume());
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.userStore.setIsChangeInNewResume(false);

    void this.router.navigateByUrl('/user/resumes/resume');
  }

  createResumeFromTemplate(templateId: number): void {
    const builderUrl = `/user/resumes/resume?templateId=${encodeURIComponent(String(templateId))}`;

    // If not logged in, show login screen, then land directly on builder.
    if (!this.authGate.requireLoginOrRedirect(builderUrl)) {
      return;
    }

    const existingCount = this.myResumes()?.length ?? 0;
    if (!this.planGate.enforceOrUpgrade(this.planGate.canCreateResume(existingCount), 'Free plan allows only one resume.')) {
      return;
    }

    if (!this.planGate.enforceOrUpgrade(this.planGate.canUseTemplate(templateId), 'This template requires an upgrade.')) {
      return;
    }

    // Land on builder and let it initialize with templateId.
    void this.router.navigate(['/user/resumes/resume'], {
      queryParams: { templateId },
    });
  }
}
