import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Resume } from 'src/app/services/resume.model';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { FREE_TEMPLATE_ID } from '../services/plan-gate.service';
import { ResumePortalApiService } from '../services/resume-portal-api.service';
import { ResumeLimitService } from '../services/resume-limit.service';
import { TemplateAccessService } from '../services/template-access.service';
import { ResumeTemplateVm } from '../models/resume-template.model';
import { ResumeTemplateFacadeService } from '../data/resume-template-facade.service';
import { ResumeTemplateSelectionService } from 'src/app/services/resume-template-selection.service';
import { buildResumeTemplateIdentity } from '../utils/resume-template-key.util';

export type PortalTemplate = {
  id: number;
  name: string;
  description: string;
  category: 'Simple' | 'Modern' | 'Creative';
  isPremium: boolean;
  previewImageUrl?: string;
  templateKey: string;
  componentKey?: string;
  accessLevel?: string;
  version?: string;
  isDefault?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ResumePortalStore {
  private userStore = inject(UserStoreService);
  private templateAccess = inject(TemplateAccessService);
  private resumeLimit = inject(ResumeLimitService);
  private api = inject(ResumePortalApiService);
  private router = inject(Router);
  private templateCatalog = inject(ResumeTemplateFacadeService);
  private templateSelection = inject(ResumeTemplateSelectionService);

  private loadingMyResumes = signal(false);

  readonly isLoggedIn = computed(() => this.userStore.state().isUserLoggedIn);

  readonly templates = signal<PortalTemplate[]>([
    {
      id: FREE_TEMPLATE_ID,
      name: 'Atlantic Blue',
      description: 'Clean, modern single-column resume template.',
      category: 'Simple',
      isPremium: false,
      previewImageUrl: 'assets/img/templates/rt1.png',
      templateKey: 'TEMPLATE_1',
      componentKey: 'TEMPLATE_1',
      accessLevel: 'BASIC',
      version: '1.0',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Minimal',
      description: 'Simple minimal layout with strong readability.',
      category: 'Simple',
      isPremium: false,
      previewImageUrl: 'assets/img/templates/rt2.png',
      templateKey: 'TEMPLATE_2',
      componentKey: 'TEMPLATE_2',
      accessLevel: 'BASIC',
      version: '1.0',
    },
    {
      id: 3,
      name: 'Mono',
      description: 'Clean single-column layout with clear spacing.',
      category: 'Simple',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt3.png',
      templateKey: 'TEMPLATE_3',
      componentKey: 'TEMPLATE_3',
      accessLevel: 'PREMIUM',
      version: '1.0',
    },
    {
      id: 4,
      name: 'Modern Crisp',
      description: 'Modern typography and balanced spacing.',
      category: 'Modern',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt4.png',
      templateKey: 'TEMPLATE_4',
      componentKey: 'TEMPLATE_4',
      accessLevel: 'PREMIUM',
      version: '1.0',
    },
    {
      id: 5,
      name: 'Modern Split',
      description: 'Modern split sections for skills and experience.',
      category: 'Modern',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt5.png',
      templateKey: 'TEMPLATE_5',
      componentKey: 'TEMPLATE_5',
      accessLevel: 'PREMIUM',
      version: '1.0',
    },
    {
      id: 6,
      name: 'Creative Accent',
      description: 'Creative highlights for titles and key sections.',
      category: 'Creative',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt6.png',
      templateKey: 'TEMPLATE_6',
      componentKey: 'TEMPLATE_6',
      accessLevel: 'PREMIUM',
      version: '1.0',
    },
    {
      id: 7,
      name: 'Creative Blocks',
      description: 'Creative block layout with strong hierarchy.',
      category: 'Creative',
      isPremium: true,
      previewImageUrl: 'assets/img/templates/rt7.png',
      templateKey: 'TEMPLATE_7',
      componentKey: 'TEMPLATE_7',
      accessLevel: 'PREMIUM',
      version: '1.0',
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
    const template = this.getDefaultTemplate();
    const identity = buildResumeTemplateIdentity({
      id: template.id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.previewImageUrl,
    });
    const builderUrl = `/user/resumes/resume?templateKey=${encodeURIComponent(identity.templateKey)}`;

    const access = this.templateAccess.canUseTemplate(this.toVm(template));
    if (!access.allowed) {
      this.templateAccess.handleDenied(access.reason, builderUrl);
      return;
    }

    const limit = this.resumeLimit.canCreateResume();
    if (!limit.allowed) {
      if (limit.reason === 'LOGIN_REQUIRED') {
        this.templateAccess.handleDenied('LOGIN_REQUIRED', builderUrl);
      } else {
        this.resumeLimit.handleLimitDenied();
      }
      return;
    }

    // Reset builder state to defaults.
    this.userStore.setResumeForm(new Resume());
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.userStore.setIsChangeInNewResume(false);

    this.templateSelection.setCatalogSelection({
      templateId: template.id,
      templateKey: identity.templateKey,
      componentKey: identity.componentKey,
      version: template.version ?? '1.0',
      title: template.name,
      previewUrl: template.previewImageUrl,
      accessLevel: template.accessLevel ?? (template.isPremium ? 'PREMIUM' : 'BASIC'),
    });

    void this.router.navigate(['/user/resumes/resume'], {
      queryParams: { templateKey: identity.templateKey },
    });
  }

  createResumeFromTemplate(templateId: number): void {
    const template = this.getTemplateById(templateId);
    const identity = buildResumeTemplateIdentity({
      id: template.id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.previewImageUrl,
    });
    const builderUrl = `/user/resumes/resume?templateKey=${encodeURIComponent(identity.templateKey)}`;

    const access = this.templateAccess.canUseTemplate(this.toVm(template));
    if (!access.allowed) {
      this.templateAccess.handleDenied(access.reason, builderUrl);
      return;
    }

    const limit = this.resumeLimit.canCreateResume();
    if (!limit.allowed) {
      if (limit.reason === 'LOGIN_REQUIRED') {
        this.templateAccess.handleDenied('LOGIN_REQUIRED', builderUrl);
      } else {
        this.resumeLimit.handleLimitDenied();
      }
      return;
    }

    this.templateSelection.setCatalogSelection({
      templateId: template.id,
      templateKey: identity.templateKey,
      componentKey: identity.componentKey,
      version: template.version ?? '1.0',
      title: template.name,
      previewUrl: template.previewImageUrl,
      accessLevel: template.accessLevel ?? (template.isPremium ? 'PREMIUM' : 'BASIC'),
    });

    // Land on builder and let it initialize with templateId.
    void this.router.navigate(['/user/resumes/resume'], {
      queryParams: { templateKey: identity.templateKey },
    });
  }

  private toVm(template: PortalTemplate): ResumeTemplateVm {
    return {
      id: String(template.id),
      title: template.name,
      category: template.isPremium ? 'PREMIUM' : 'BASIC',
      previewUrl: template.previewImageUrl,
      isDefault: !!template.isDefault,
    };
  }

  private getTemplateById(templateId: number): PortalTemplate {
    return this.getAvailableTemplates().find((template) => template.id === templateId)
      ?? this.templates().find((template) => template.id === templateId)
      ?? this.getDefaultTemplate();
  }

  private getDefaultTemplate(): PortalTemplate {
    const templates = this.getAvailableTemplates();
    return templates.find((template) => template.isDefault)
      ?? templates.find((template) => !template.isPremium)
      ?? templates[0]
      ?? {
        id: FREE_TEMPLATE_ID,
        name: 'Atlantic Blue',
        description: 'Clean, modern single-column resume template.',
        category: 'Simple',
        isPremium: false,
        previewImageUrl: 'assets/img/templates/rt1.png',
        templateKey: 'TEMPLATE_1',
        componentKey: 'TEMPLATE_1',
        accessLevel: 'BASIC',
        version: '1.0',
        isDefault: true,
      };
  }

  private getAvailableTemplates(): PortalTemplate[] {
    const catalogTemplates = this.templateCatalog.templates();
    if (catalogTemplates.length === 0) {
      return this.templates();
    }

    return catalogTemplates.map((template) => ({
      id: Number(template.id ?? 0),
      name: template.title ?? 'Template',
      description: `${template.category ?? 'Resume'} template`,
      category: this.toPortalCategory(template.category),
      isPremium: this.templateCatalog.isPremium(template),
      previewImageUrl: template.imageUrl,
      templateKey: template.templateKey ?? template.componentKey ?? `TEMPLATE_${template.id ?? ''}`,
      componentKey: template.componentKey ?? template.templateKey ?? `TEMPLATE_${template.id ?? ''}`,
      accessLevel: template.accessLevel,
      version: template.version,
      isDefault: !!template.isDefault,
    }));
  }

  private toPortalCategory(category?: string): PortalTemplate['category'] {
    const normalized = (category ?? '').toString().toLowerCase();
    if (normalized === 'creative') {
      return 'Creative';
    }
    if (normalized === 'modern') {
      return 'Modern';
    }
    return 'Simple';
  }
}
