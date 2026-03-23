import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, 
          OnDestroy, OnInit, Output, Signal, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { Resume } from 'src/app/services/resume.model';
import { ResumeTemplateDto } from 'src/app/services/store/user-store';
import { ResumeTemplateFacadeService } from 'src/app/resume-portal/data/resume-template-facade.service';
import { ResumeTemplateSelectionService } from 'src/app/services/resume-template-selection.service';
import type { ResumeTemplateUi } from 'src/app/resume-portal/data/resume-template.ui.model';
import {
  buildResumeTemplateIdentity,
  resolveCanonicalTemplateKey,
} from 'src/app/resume-portal/utils/resume-template-key.util';

const TEMPLATE_FILTER_TABS = [
  'All',
  'ATS-Friendly',
  'Professional',
  'Fresher',
  'Tech & Skills',
  'Creative',
] as const;

type TemplateFilterTab = typeof TEMPLATE_FILTER_TABS[number];
type TemplateSpecificFilterTab = Exclude<TemplateFilterTab, 'All'>;

interface TemplateCategoryMeta {
  primary: TemplateSpecificFilterTab;
  matches: TemplateSpecificFilterTab[];
}

const TEMPLATE_FILTER_ALIAS_MAP: Record<string, TemplateSpecificFilterTab> = {
  'ats-friendly': 'ATS-Friendly',
  'ats friendly': 'ATS-Friendly',
  ats: 'ATS-Friendly',
  professional: 'Professional',
  fresher: 'Fresher',
  'tech & skills': 'Tech & Skills',
  'tech and skills': 'Tech & Skills',
  'tech-skills': 'Tech & Skills',
  tech: 'Tech & Skills',
  skills: 'Tech & Skills',
  creative: 'Creative',
};

const TEMPLATE_CATEGORY_META_BY_KEY: Record<string, TemplateCategoryMeta> = {
  TEMPLATE_1: {
    primary: 'Professional',
    matches: ['Professional', 'ATS-Friendly'],
  },
  TEMPLATE_2: {
    primary: 'ATS-Friendly',
    matches: ['ATS-Friendly', 'Fresher'],
  },
  TEMPLATE_3: {
    primary: 'ATS-Friendly',
    matches: ['ATS-Friendly'],
  },
  TEMPLATE_4: {
    primary: 'Professional',
    matches: ['Professional'],
  },
  TEMPLATE_5: {
    primary: 'Tech & Skills',
    matches: ['Professional', 'Tech & Skills'],
  },
  TEMPLATE_6: {
    primary: 'Creative',
    matches: ['Creative'],
  },
  TEMPLATE_7: {
    primary: 'Creative',
    matches: ['Creative'],
  },
  TEMPLATE_9: {
    primary: 'Tech & Skills',
    matches: ['Professional', 'Tech & Skills'],
  },
  TEMPLATE_10: {
    primary: 'Professional',
    matches: ['Professional', 'Fresher'],
  },
};

const normalizeFilterToken = (value: string | null | undefined): string =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-template-list',
  standalone: true,
  imports: [RouterModule, MatSnackBarModule],
  templateUrl: './resume-template-list.component.html',
  styleUrls: ['./resume-template-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplateListComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes

  private userStore: UserStoreService = inject(UserStoreService);
  private templateFacade: ResumeTemplateFacadeService = inject(ResumeTemplateFacadeService);
  private templateSelection = inject(ResumeTemplateSelectionService);
  private snackBar = inject(MatSnackBar);
  private hostRef = inject(ElementRef<HTMLElement>);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeForm : Signal<Resume> = this.userStore.getResumeForm();

  @Output() contact = new EventEmitter();
  subs: Array<Subscription> = [];

  templates = computed(() => this.templateFacade.templates());
  readonly templateFilterTabs = TEMPLATE_FILTER_TABS;
  readonly selectedCategoryTab = signal<TemplateFilterTab>('All');
  readonly filteredTemplates = computed(() => {
    const selectedTab = this.selectedCategoryTab();
    const currentTemplates = this.templates();

    if (selectedTab === 'All') {
      return currentTemplates;
    }

    return currentTemplates.filter(template => this.resolveTemplateFilterTabs(template).includes(selectedTab));
  });

  constructor(
      private router : Router, 
      public templateService : TemplatesService) {
       
      }


  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  ngOnInit() {
    this.templateFacade.loadTemplates('available');
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        // The current active route matches the desired route
        // console.log('Current route matches the desired route');
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        // The current active route does not match the desired route
        console.log('Current route does not match the desired route');
      }
    }));
  }

  selectCategoryTab(tab: TemplateFilterTab): void {
    this.selectedCategoryTab.set(tab);
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    const { key } = event;
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) {
      return;
    }

    event.preventDefault();

    if (key === 'Home') {
      this.focusTab(0);
      return;
    }

    if (key === 'End') {
      this.focusTab(this.templateFilterTabs.length - 1);
      return;
    }

    const direction = key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + this.templateFilterTabs.length) % this.templateFilterTabs.length;
    this.focusTab(nextIndex);
  }

  selectTemplateHandler($event: Event, template: ResumeTemplateUi){
    const gate = this.templateFacade.canUseTemplate(template);
    if (!gate.allowed && gate.reason === 'LOGIN_REQUIRED') {
      this.snackBar.open(this.templateFacade.explainReason(gate.reason), 'View plans', { duration: 3200 });
      this.templateFacade.handleDenied(gate.reason, this.router.url);
      return;
    }

    const resumeTemplate = this.toResumeTemplate(template);
    this.templateSelection.setCatalogSelection({
      templateId: template.id ?? '',
      templateKey: resumeTemplate.templateKey ?? resumeTemplate.template_name,
      componentKey: resumeTemplate.componentKey ?? resumeTemplate.templateKey,
      version: template.version ?? '1.0',
      title: template.title ?? resumeTemplate.name,
      previewUrl: template.imageUrl ?? '',
      accessLevel: template.accessLevel ?? resumeTemplate.accessLevel,
    });
    this.userStore.updateResumeTemplate(resumeTemplate);
    this.userStore.setFlagOnTemplateSelected(resumeTemplate.template_name);
    this.contact.emit();

  }

  isSelected(template: ResumeTemplateUi): boolean {
    const currentTemplateKey = resolveCanonicalTemplateKey({
      id: this.resumeForm().template_details.id,
      templateKey: this.resumeForm().template_details.templateKey,
      componentKey: this.resumeForm().template_details.componentKey,
      template_name: this.resumeForm().template_details.template_name,
      imgPath: this.resumeForm().template_details.imgPath,
    });
    const selectedTemplateKey = resolveCanonicalTemplateKey({
      id: template.id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.imageUrl,
    });

    if (currentTemplateKey && selectedTemplateKey) {
      return currentTemplateKey === selectedTemplateKey;
    }

    const currentId = Number(this.resumeForm().template_details.id ?? 0);
    const templateId = Number(template.id ?? 0);
    return Number.isFinite(templateId) && templateId === currentId;
  }

  isPremium(template: ResumeTemplateUi): boolean {
    return this.templateFacade.isPremium(template);
  }

  isLocked(template: ResumeTemplateUi): boolean {
    return this.templateFacade.isLocked(template);
  }

  isUpgradeRestricted(template: ResumeTemplateUi): boolean {
    const gate = this.templateFacade.canUseTemplate(template);
    return !gate.allowed && gate.reason === 'UPGRADE_REQUIRED';
  }

  getPrimaryCategoryLabel(template: ResumeTemplateUi): TemplateSpecificFilterTab | null {
    const categoryMeta = this.resolveTemplateCategoryMeta(template);
    if (categoryMeta) {
      return categoryMeta.primary;
    }

    return TEMPLATE_FILTER_ALIAS_MAP[normalizeFilterToken(template.category)] ?? null;
  }

  getPrimaryCategoryClass(template: ResumeTemplateUi): string | null {
    const primaryCategory = this.getPrimaryCategoryLabel(template);
    if (!primaryCategory) {
      return null;
    }

    const slug = normalizeFilterToken(primaryCategory)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `template-category-chip-${slug}`;
  }

  private focusTab(index: number): void {
    const hostElement = this.hostRef.nativeElement as HTMLElement;
    const tabButtons = hostElement.querySelectorAll('[data-template-filter-tab]') as NodeListOf<HTMLButtonElement>;
    tabButtons.item(index)?.focus();
  }

  private resolveTemplateFilterTabs(template: ResumeTemplateUi): TemplateSpecificFilterTab[] {
    const mappedTabs = new Set<TemplateSpecificFilterTab>();

    for (const token of [template.category, ...(template.tags ?? [])]) {
      const mapped = TEMPLATE_FILTER_ALIAS_MAP[normalizeFilterToken(token)];
      if (mapped) {
        mappedTabs.add(mapped);
      }
    }

    const canonicalKey = resolveCanonicalTemplateKey({
      id: template.id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.imageUrl,
    });

    const explicitCategoryMeta = canonicalKey ? TEMPLATE_CATEGORY_META_BY_KEY[canonicalKey] : undefined;
    if (explicitCategoryMeta) {
      for (const tab of explicitCategoryMeta.matches) {
        mappedTabs.add(tab);
      }
    }

    const coarseCategory = normalizeFilterToken(template.category);
    if (mappedTabs.size === 0) {
      if (coarseCategory === 'creative') {
        mappedTabs.add('Creative');
      } else if (coarseCategory === 'modern') {
        mappedTabs.add('Professional');
      } else if (coarseCategory === 'simple') {
        mappedTabs.add('ATS-Friendly');
      }
    }

    return Array.from(mappedTabs);
  }

  private resolveTemplateCategoryMeta(template: ResumeTemplateUi): TemplateCategoryMeta | null {
    const canonicalKey = resolveCanonicalTemplateKey({
      id: template.id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.imageUrl,
    });

    return canonicalKey ? TEMPLATE_CATEGORY_META_BY_KEY[canonicalKey] ?? null : null;
  }

  private toResumeTemplate(template: ResumeTemplateUi): ResumeTemplateDto {
    const parsedId = Number(template.id);
    const id = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 1;
    const identity = buildResumeTemplateIdentity({
      id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.imageUrl,
    });

    return {
      id,
      name: template.title ?? `Template ${id}`,
      companyName: '',
      template_name: identity.template_name,
      imgPath: template.imageUrl ?? '',
      templateKey: identity.templateKey,
      componentKey: identity.componentKey,
      version: template.version ?? '1.0',
      accessLevel: template.accessLevel ?? '',
    } as ResumeTemplateDto;
  }

}
