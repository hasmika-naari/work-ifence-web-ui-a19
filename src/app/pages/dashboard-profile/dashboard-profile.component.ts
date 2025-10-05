import { Component, OnInit, OnDestroy, inject, Signal, AfterViewInit, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA, 
          Output, EventEmitter, effect, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ResumeList2Component } from '../resume-list2/resume-list2.component';
import { ResumeFormTabbedComponent } from '../resume-form-tabbed/resume-form-tabbed.component';
import { ResumeForm2Component } from '../resume-form2/resume-form2.component';
import { ResumeFormComponent } from '../resume-form/resume-form.component';
import { TemplatesPageComponent } from '../templates-page/templates-page.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JobApplication, Resume, RoundDetails, Skill } from 'src/app/services/resume.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ResumeService } from 'src/app/services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { JobApplicationRequest, ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import moment from 'moment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JobApplicationStatus } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { ApplicationListComponent } from '../dashboard-job-application/application-list/application-list.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { SectionDesc } from 'src/app/services/store/user-store';
import { AddressFormPage } from './address/address-form.page';
import { BioProfileFormPage } from './bio/bio-form.page';
import { LoginProfileFormPage } from './login/login-form.page';
import { LoginFormEditorComponent } from './login-form-editor/login-form-editor.component';
import { BioFormEditorComponent } from './bio-form-editor/bio-form-editor.component';
import { AddressFormEditorComponent } from './address-form-editor/address-form-editor.component';
import { DrawerModule } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { SummaryProfileFormPage } from './job-profile/summary/summary-form.page';
import { SummaryProfileDisplayComponent } from './job-profile/summary/summary-display.component';
import { SummaryProfileEditComponent } from './job-profile/summary/summary-edit.component';
import { SkillsProfileDisplayComponent } from './job-profile/skills/skills-profile-display.component';
import { SkillsProfileEditComponent } from './job-profile/skills/skills-profile-edit.component';
import { ExperienceProfileDisplayComponent, ExperienceProfileItem } from './job-profile/experience/experience-profile-display.component';
import { ExperienceProfileEditComponent } from './job-profile/experience/experience-profile-edit.component';

interface Option {
  name : string;
  code : string;
}

@Component({
    selector: 'app-profile-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule, 
        StyleClassModule,
        NgOptimizedImage, MenuModule, ChartModule, FormsModule,
        ChartModule, ReactiveFormsModule,
        MenuModule,DividerModule, MatFormFieldModule, MatInputModule,
        TableModule,DialogModule,InputTextModule, MatProgressBarModule,
        StyleClassModule,ResumeList2Component,SummaryProfileDisplayComponent,
        PanelMenuModule,ResumeFormTabbedComponent,ResumeForm2Component,
        ButtonModule,TemplatesPageComponent, ResumeFormComponent, ApplicationListComponent, 
        MatMenuModule, MatIconModule, MatToolbarModule, MatSelectModule, MatMenuModule, DropdownModule,
        AddressFormPage, BioProfileFormPage, LoginProfileFormPage, LoginFormEditorComponent, BioFormEditorComponent, 
  AddressFormEditorComponent, SummaryProfileFormPage, SummaryProfileEditComponent,
  SkillsProfileDisplayComponent, SkillsProfileEditComponent,
  ExperienceProfileDisplayComponent, ExperienceProfileEditComponent,
        DrawerModule,TabsModule, BadgeModule, AvatarModule
        ],
    templateUrl: './dashboard-profile.component.html',
    styleUrl : './dashboard-profile.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class DashboardProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  userStore = inject(UserStoreService);
  // Use a single jobProfile signal from the store
  jobProfileSignal: Signal<any | null> = this.userStore.getJobProfileSignal();
  resumeFormSignal: Signal<Resume> = this.userStore.getResumeForm();

  get profileSummaryHtml(): string {
    const jobProfile = this.jobProfileSignal();
    const resumeSummary = this.resumeFormSignal()?.profileSummary;
    const summary = jobProfile?.summary ?? resumeSummary;
    if (!summary) {
      return '';
    }
    const html = summary.original_summary_html?.trim();
    return html?.length ? html : (summary.profile_summary ?? '');
  }
  actionInProgressStarts() {
  this.isActionInProgress = true;
  }
  saveForm() {
  this.isActionInProgress = false;
  console.log('Form saved');
  }
  showBioFormEditor = false;
  showLoginFormEditor = false;
  showAddressFormEditor = false;

  // Controls visibility of the summary edit form in the drawer
  showSummaryFormEditor = false;
  showSkillsFormEditor = false;
  showExperienceFormEditor = false;

  private cachedSkills: Skill[] = [];
  private cachedSkillsKey = '';
  private cachedExperiences: ExperienceProfileItem[] = [];
  private cachedExperiencesKey = '';
  private placeholderDismissed = false;
  experienceEditingIndex: number | null = null;
  experienceDraft: ExperienceProfileItem | null = null;
  private readonly placeholderExperiences: ExperienceProfileItem[] = [
    {
      title: 'Senior DevOps Engineer',
      companyName: 'Placeholder Corp.',
      location: 'Remote',
      startMonth: 'January',
      startYear: '2019',
      endMonth: 'December',
      endYear: '2022',
      responsibilities: [
        'Designed and maintained cloud infrastructure observability using Azure Monitor and Grafana.',
        'Implemented GitHub Actions and Azure DevOps pipelines to cut deployment time by 40%.',
        'Partnered with security and product teams to harden CI/CD workflows and enforce compliance.'
      ].join('\n'),
      keySkills: 'Azure,Kubernetes,CI/CD,Monitoring',
      placeholder: true
    },
    {
      title: 'Lead Cloud Engineer',
      companyName: 'Fictitious Systems',
      location: 'Austin, TX',
      startMonth: 'January',
      startYear: '2015',
      endMonth: 'December',
      endYear: '2018',
      responsibilities: [
        'Led the migration of on-premise workloads to Azure, ensuring high availability and cost optimization.',
        'Automated infrastructure provisioning with Terraform and Azure DevOps release pipelines.',
        'Mentored a cross-functional engineering team to deliver resilient cloud-native services.'
      ].join('\n'),
      keySkills: 'Terraform,Azure DevOps,Cloud Architecture,Automation',
      placeholder: true
    }
  ];

  // No local summary; always use store

  isActionInProgress: boolean = true;

  get summaryDrawerWidth(): string {
    if (this.showSkillsFormEditor || this.showExperienceFormEditor) {
      return '48rem';
    }
    if (this.showSummaryFormEditor) {
      return 'fit-content';
    }
    return '31rem';
  }
  
  get summaryDrawerMinWidth(): string {
    if (this.showSkillsFormEditor || this.showExperienceFormEditor) {
      return '48rem';
    }
    return '31rem';
  }
  
  get summaryDrawerMaxWidth(): string {
    if (this.showSkillsFormEditor || this.showExperienceFormEditor) {
      return '48rem';
    }
    if (this.showSummaryFormEditor) {
      return '85vw';
    }
    return '31rem';
  }

  get drawerTitle(): string | null {
    if (!this.visible2) {
      return null;
    }
    if (this.showBioFormEditor) {
      return 'Edit Bio';
    }
    if (this.showLoginFormEditor) {
      return 'Update Login Details';
    }
    if (this.showAddressFormEditor) {
      return 'Edit Address';
    }
    if (this.showSummaryFormEditor) {
      return 'Edit Summary';
    }
    if (this.showSkillsFormEditor) {
      return 'Edit Skills';
    }
    if (this.showExperienceFormEditor) {
      return this.experienceEditingIndex !== null ? 'Edit Experience' : 'Add Experience';
    }
    return null;
  }

  get profileSkills(): Skill[] {
    const jobProfile = this.jobProfileSignal();
    const resumeSkills = this.resumeFormSignal()?.skill ?? [];
    const normalized = (jobProfile?.skills ?? resumeSkills ?? []).map((skill: any) => ({
      name: typeof skill === 'string' ? skill : skill?.name ?? '',
      selected: typeof skill === 'object' && 'selected' in skill ? skill.selected : false
    })).filter((skill: Skill) => !!skill.name?.trim());

  const key = normalized.map((skill: Skill) => `${skill.name}::${skill.selected ? '1' : '0'}`).join('|');
    if (key !== this.cachedSkillsKey) {
      this.cachedSkillsKey = key;
      this.cachedSkills = normalized;
    }

    return this.cachedSkills;
  }

  items!: MenuItem[];

  chartData: any;

  chartOptions: any;

  subscriptions: Array<Subscription> = [];

  showResumeGenerator = false;

  productDialog: boolean = false;

  showResumeGeneratorHeader =  false;

  searchQuery = new FormControl();

  filteredRoleCategoryValue = new FormControl()
  filteredResumeCategoryValue = new FormControl()
  roleCategories : Array<Option> = []
  resumeCategories : Array<Option> = []
  tempResumes : ResumeListDataItem[] = []

   visible1: boolean = false;

    visible2: boolean = false;

    visible3: boolean = false;

    visible4: boolean = false;

    // Handler for when the summary is saved from the edit form

    onSummarySaved(newSummary: string) {
      const plainText = newSummary.replace(/<[^>]+>/g, '');
      const updatedSummary = {
        ...(this.jobProfileSignal()?.summary ?? {}),
        original_summary_html: newSummary,
        profile_summary: plainText
      };

      const currentProfile = this.jobProfileSignal();
      if (!currentProfile) {
        this.userStore.setJobProfile({ summary: updatedSummary });
      } else {
        this.userStore.updateJobProfileSection('summary', updatedSummary);
      }
  this.showSummaryFormEditor = false;
  this.showExperienceFormEditor = false;
  this.visible2 = false;
    }

    // Handler to open the summary edit form in the drawer
    showSummaryFormEditorWindow() {
      this.userStore.ensureProfileSummaryInitialized();
      const resumeSummary = this.resumeFormSignal()?.profileSummary;
      if (resumeSummary) {
        const currentProfile = this.jobProfileSignal();
        const mergedProfile = {
          ...(currentProfile ?? {}),
          summary: { ...resumeSummary }
        };
        this.userStore.setJobProfile(mergedProfile);
      }
      this.showSummaryFormEditor = true;
      this.visible2 = true; // Show the drawer for summary
      // Optionally close other editors if needed
      this.showBioFormEditor = false;
      this.showLoginFormEditor = false;
      this.showAddressFormEditor = false;
      this.showSkillsFormEditor = false;
  this.showExperienceFormEditor = false;
    }

    onSkillsSaved(updatedSkills: Skill[]) {
      const normalizedSkills = updatedSkills.map((skill) => ({
        name: skill.name?.trim() ?? '',
        selected: skill.selected ?? false
      })).filter((skill) => !!skill.name);

      this.userStore.addSkill(normalizedSkills);

      const currentProfile = this.jobProfileSignal();
      if (!currentProfile) {
        this.userStore.setJobProfile({ skills: normalizedSkills });
      } else {
        this.userStore.updateJobProfileSection('skills', normalizedSkills);
      }

  this.showSkillsFormEditor = false;
  this.showExperienceFormEditor = false;
  this.visible2 = false;
    }

    showSkillsFormEditorWindow() {
      const resumeSkills = [...(this.resumeFormSignal()?.skill ?? [])].map((skill: any) => ({
        name: typeof skill === 'string' ? skill : skill?.name ?? '',
        selected: typeof skill === 'object' && 'selected' in skill ? skill.selected : false
      })).filter((skill) => !!skill.name);

      const currentProfile = this.jobProfileSignal();
      const mergedProfile = {
        ...(currentProfile ?? {}),
        skills: resumeSkills
      };
      this.userStore.setJobProfile(mergedProfile);

      this.showSkillsFormEditor = true;
      this.visible2 = true;
      this.showSummaryFormEditor = false;
      this.showBioFormEditor = false;
      this.showLoginFormEditor = false;
      this.showAddressFormEditor = false;
      this.showExperienceFormEditor = false;
    }

    get profileExperiences(): ExperienceProfileItem[] {
      const jobProfile = this.jobProfileSignal();
      const resumeExperiences = this.resumeFormSignal()?.experience ?? [];
      const source = (jobProfile?.experience ?? resumeExperiences ?? []) as any[];

      const normalized = source
        .map((exp) => this.mapExperienceToDisplay(exp))
        .filter((exp) => !!exp.title && !!exp.responsibilities);

      if (normalized.length > 0) {
        this.placeholderDismissed = true;
        return this.updateCachedExperiences(normalized);
      }

      const hasExplicitExperienceSection = Array.isArray(jobProfile?.experience);
      if (hasExplicitExperienceSection) {
        this.placeholderDismissed = true;
      }

      const fallback = this.placeholderDismissed ? [] : this.getPlaceholderExperiences();
      return this.updateCachedExperiences(fallback);
    }

    onExperienceSaved(event: { experience: ExperienceProfileItem; index: number | null }) {
  const normalized = this.mapExperienceToDisplay(event.experience);
  const currentExperiences = this.profileExperiences;
  const filtered = currentExperiences.filter((item) => !item.placeholder);

      const canUpdateExisting =
        event.index !== null &&
        event.index >= 0 &&
        !currentExperiences[event.index]?.placeholder &&
        event.index < filtered.length;

      if (canUpdateExisting && event.index !== null) {
        filtered[event.index] = normalized;
      } else {
        filtered.push(normalized);
      }

      this.persistExperiences(filtered);

      this.experienceEditingIndex = null;
      this.experienceDraft = null;
      this.showExperienceFormEditor = false;
      this.visible2 = false;
    }

    onExperienceRemoved(index: number) {
      const experiences = [...this.profileExperiences];

      if (!experiences.length || index < 0 || index >= experiences.length) {
        return;
      }

      const target = experiences[index];
      const remaining = experiences.filter((_, itemIndex) => itemIndex !== index);

      if (target?.placeholder) {
        this.placeholderDismissed = true;
      }

      this.persistExperiences(remaining);
    }

    onExperienceMoved(event: { index: number; direction: 'up' | 'down' }) {
      const experiences = [...this.profileExperiences];
      const { index, direction } = event;

      if (!experiences.length || index < 0 || index >= experiences.length) {
        return;
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= experiences.length) {
        return;
      }

      const [moved] = experiences.splice(index, 1);
      experiences.splice(targetIndex, 0, moved);

      this.persistExperiences(experiences);
    }

    startExperienceCreation() {
      this.experienceEditingIndex = null;
      this.experienceDraft = null;
      this.prepareExperienceEditor();
    }

    startExperienceEdit(index: number) {
      const experiences = this.profileExperiences;
      const target = experiences[index] ?? null;

      if (target?.placeholder) {
        this.experienceEditingIndex = null;
        this.experienceDraft = { ...target, placeholder: undefined } as ExperienceProfileItem;
      } else {
        this.experienceEditingIndex = index;
        if (target) {
          this.experienceDraft = typeof structuredClone === 'function'
            ? structuredClone(target)
            : JSON.parse(JSON.stringify(target));
        } else {
          this.experienceDraft = null;
        }
      }
      this.prepareExperienceEditor();
    }

    private prepareExperienceEditor() {
      this.ensureExperienceProfileSeeded();
      this.showExperienceFormEditor = true;
      this.visible2 = true;
      this.showSummaryFormEditor = false;
      this.showSkillsFormEditor = false;
      this.showBioFormEditor = false;
      this.showLoginFormEditor = false;
      this.showAddressFormEditor = false;
    }

    private ensureExperienceProfileSeeded() {
      const jobProfile = this.jobProfileSignal();
      if (!jobProfile?.experience) {
        const resumeExperiences = [...(this.resumeFormSignal()?.experience ?? [])];
        const mergedProfile = {
          ...(jobProfile ?? {}),
          experience: resumeExperiences
        };
        this.userStore.setJobProfile(mergedProfile);
      }
    }

    private mapExperienceToDisplay(exp: any): ExperienceProfileItem {
      if (!exp) {
        return { title: '', responsibilities: '' };
      }

      const title = this.coerceString(exp.title ?? exp.position_title ?? exp.positionTitle);
      const companyName = this.coerceOptionalString(exp.companyName ?? exp.company_name ?? exp.company);
      const location = this.coerceOptionalString(exp.location ?? exp.city ?? exp.place_of_work);

      const isCurrent = Boolean(exp.isCurrent ?? exp.isCurrentlyWorkHere ?? exp.current ?? exp.is_current);

      const { month: startMonth, year: startYear } = this.extractMonthYear(
        exp.startMonth,
        exp.startYear,
        exp.start_date ?? exp.startDate ?? exp.period_start
      );

      const { month: endMonth, year: endYear } = this.extractMonthYear(
        exp.endMonth,
        exp.endYear,
        exp.end_date ?? exp.endDate ?? exp.period_end
      );

      const responsibilitiesSource =
        exp.responsibilities ??
        exp.description ??
        exp.original_description_html ??
        exp.duties ??
        '';

      const responsibilities = Array.isArray(responsibilitiesSource)
        ? responsibilitiesSource.map((item: any) => this.coerceString(item)).filter(Boolean).join('\n')
        : this.coerceString(responsibilitiesSource);

      const keySkillsSource = exp.keySkills ?? exp.key_skills ?? exp.skills ?? exp.skillSummary;
      const keySkills = Array.isArray(keySkillsSource)
        ? keySkillsSource.map((item: any) => this.coerceString(item)).filter(Boolean).join(', ')
        : this.coerceOptionalString(keySkillsSource);

      return {
        title,
        companyName,
        location,
        startMonth: startMonth || undefined,
        startYear: startYear || undefined,
        endMonth: isCurrent ? undefined : endMonth || undefined,
        endYear: isCurrent ? undefined : endYear || undefined,
        isCurrent,
        responsibilities,
        keySkills
      };
    }

    private persistExperiences(experiences: ExperienceProfileItem[]) {
      const sanitized = experiences.filter((exp) => !exp.placeholder);
      const normalized = sanitized
        .map((exp) => this.mapExperienceToDisplay(exp))
        .filter((exp) => !!exp.title && !!exp.responsibilities);

      const currentProfile = this.jobProfileSignal();

      if (normalized.length === 0 && !this.placeholderDismissed) {
        this.updateCachedExperiences(experiences);

        if (!currentProfile?.experience || currentProfile.experience.length === 0) {
          return;
        }

        this.userStore.updateJobProfileSection('experience', undefined);
        return;
      }

      if (normalized.length > 0) {
        this.placeholderDismissed = true;
        this.updateCachedExperiences(normalized);
      } else {
        const fallback = this.placeholderDismissed ? [] : this.getPlaceholderExperiences();
        this.updateCachedExperiences(fallback);
      }

      if (!currentProfile) {
        this.userStore.setJobProfile({ experience: normalized });
      } else {
        this.userStore.updateJobProfileSection('experience', normalized);
      }
    }

    private getPlaceholderExperiences(): ExperienceProfileItem[] {
      return this.placeholderExperiences.map((exp) => ({ ...exp }));
    }

    private updateCachedExperiences(experiences: ExperienceProfileItem[]): ExperienceProfileItem[] {
      const key = JSON.stringify(experiences);
      if (key !== this.cachedExperiencesKey) {
        this.cachedExperiencesKey = key;
        this.cachedExperiences = experiences;
      }

      return this.cachedExperiences;
    }

    private extractMonthYear(
      monthInput?: unknown,
      yearInput?: unknown,
      combined?: unknown
    ): { month: string; year: string } {
      let month = this.coerceString(monthInput);
      let year = this.coerceString(yearInput);

      const combinedValue = this.coerceString(combined);

      if ((!month || !year) && combinedValue) {
        const tokens = combinedValue.split(/\s|\u2013|\-|\//).filter(Boolean);
        if (!month && tokens.length > 0) {
          month = this.normalizeMonthToken(tokens[0]);
        }
        if (!year && tokens.length > 0) {
          const last = tokens[tokens.length - 1];
          year = /\d{4}/.test(last) ? last : year;
        }
      }

      return { month, year };
    }

    private normalizeMonthToken(token: string): string {
      if (!token) {
        return '';
      }
      const lower = token.toLowerCase();
      const monthMap: Record<string, string> = {
        jan: 'January',
        january: 'January',
        feb: 'February',
        february: 'February',
        mar: 'March',
        march: 'March',
        apr: 'April',
        april: 'April',
        may: 'May',
        jun: 'June',
        june: 'June',
        jul: 'July',
        july: 'July',
        aug: 'August',
        august: 'August',
        sep: 'September',
        sept: 'September',
        september: 'September',
        oct: 'October',
        october: 'October',
        nov: 'November',
        november: 'November',
        dec: 'December',
        december: 'December'
      };

      return monthMap[lower] ?? token.charAt(0).toUpperCase() + token.slice(1);
    }

    private coerceString(value: unknown): string {
      if (value === null || value === undefined) {
        return '';
      }
      return String(value).trim();
    }

    private coerceOptionalString(value: unknown): string | undefined {
      const text = this.coerceString(value);
      return text || undefined;
    }


  template1_sections  : Array<SectionDesc> = [
      {
        section : 'PROFILE_SUMMARY',
        title : 'Profile summary',
        editable_section_title : 'Profile Summary'
      },
      {
        section : 'EDUCATION',
        title : 'Education',
        editable_section_title : "Education"
      },
      {
        section : 'RELEVANT_COURSEWORK',
        title : 'Relevant coursework',
        editable_section_title :'Relevant Coursework'
      },
      {
        section : 'SKILLS_BULLET_POINTS',
        title : 'Skills with bullet points',
        editable_section_title : 'Skills'
      },
      {
        section : 'WORK_EXPERIENCE',
        title : 'Work experience',
        editable_section_title : 'Experience'
      },
      {
        section : 'PROJECT',
        title : 'Project',
         editable_section_title : 'Project'
      },
      {
        section : 'CERTIFICATIONS',
        title : 'Certification',
        editable_section_title : 'Certifications'
      },
      {
        section : 'ACHIEVEMENTS_BULLET_POINTS',
        title : 'Achievements with bullet points',
        editable_section_title : 'Achievements'
      }
    ];

  template9right_sections  : Array<SectionDesc> = [
      {
      section : 'PROFILE_SUMMARY',
      title : 'Profile summary',
      editable_section_title : 'Profile Summary'
    },
    {
      section : 'WORK_EXPERIENCE',
      title : 'Work experience',
      editable_section_title : 'Experience'
    },
    {
      section : 'PROJECT',
      title : 'Project',
      editable_section_title : 'Project'
    }
    ];

    template9left_sections : Array<SectionDesc> = [
   
    {
      section : 'RELEVANT_COURSEWORK',
      title : 'Relevant coursework',
      editable_section_title :'Relevant Coursework'
    },
    {
      section : 'SKILLS_BULLET_POINTS',
      title : 'Skills with bullet points',
      editable_section_title : 'Skills'
    },
    {
      section : 'EDUCATION',
      title : 'Education',
      editable_section_title : "Education"
    },
    {
      section : 'CERTIFICATIONS_BULLET_POINTS',
      title : 'Certification with bullet points',
      editable_section_title : 'Certifications'
    },
    {
      section : 'ACHIEVEMENTS_BULLET_POINTS',
      title : 'Achievements with bullet points',
      editable_section_title : 'Achievements'
    }
  ];

  template10_sections : Array<SectionDesc> = [
    {
      section : 'PROFILE_SUMMARY',
      title : 'Profile summary',
      editable_section_title : 'Profile Summary'
    },
   {
      section : 'EDUCATION',
      title : 'Education',
      editable_section_title : "Education"
    },
   {
      section : 'SKILLS_CATEGORY',
      title : 'Skills category',
      editable_section_title : 'Skills'
    },
     {
      section : 'WORK_EXPERIENCE',
      title : 'Work experience',
      editable_section_title : 'Experience'
    },
    {
      section : 'PROJECT',
      title : 'Project',
      editable_section_title : 'Project'
    },
{
      section : 'ACHIEVEMENT_WITH_DESC',
      title : 'Accomplishments',
      editable_section_title : 'Accomplishments'
    }
  ];

  private resumeService: ResumeService = inject(ResumeService);
  private pdfToImageService: PdfToImageService = inject(PdfToImageService);
  // (removed duplicate userStore declaration)
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  private platformId: object =  inject(PLATFORM_ID);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  isFilterOff : boolean = true
  isSearchOff : boolean = true
  resumeList : Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
  filteredResumesList : Signal<ResumeListDataItem[]> = this.userStore.getFilteredResumes();
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  subs: Array<Subscription> = [];
  resumes : ResumeListDataItem[] = []
  filteredResumes : ResumeListDataItem[] = []
  isFirstTimeCalling : boolean = true;

  locations = [];
  filteredLocationValue: string = '';

  constructor(private router: Router, public layoutService: LayoutService) {
      effect(()=>{
        this.setFilterValues();
        console.log(this.loginStatus());

        if(this.loginStatus() && this.isFirstTimeCalling){
          console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

          this.isFirstTimeCalling = false;
          this.loadResumeData()
        }
      })
  }

  ngOnInit() {
      // this.sidenavService.toggleCollapsed();

      this.filteredResumeCategoryValue.setValue("");
      this.filteredRoleCategoryValue.setValue("");
      this.searchQuery.setValue("");
      this.userStore.setFilteredResumes(this.resumeList());
      
      this.searchQuery.valueChanges.subscribe((e)=>{
          if(e.length == 0){
            this.isSearchOff = true
          }
          else{
            this.isSearchOff = false
          }
          this.filteredResumes = this.resumeList().filter((resume) =>
            resume.title.toLowerCase().includes(this.searchQuery.value.toLowerCase())
          );
          this.userStore.setFilteredResumes(this.filteredResumes);
        
      })

      this.items = [
          { label: 'Add New', icon: 'pi pi-fw pi-plus' },
          { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ];

      if(isPlatformBrowser(this.platformId)){
         setTimeout(() => {
           this.getResumes();
         }, 50);
      }
  }

  // Handler for address-profile-form edit event
  showAddressFormEditorWindow() {
    this.showBioFormEditor = false;
    this.showLoginFormEditor = false;
    this.showAddressFormEditor = true;
    this.showSummaryFormEditor = false;
    this.visible2 = true;
  }

  // Handler for login-profile-form edit event
  showLoginFormEditorWindow() {
    this.showBioFormEditor = false;
    this.showLoginFormEditor = true;
    this.showAddressFormEditor = false;
    this.showSummaryFormEditor = false;
    this.visible2 = true;
  }
  showBioFormEditorWindow() {
    this.showBioFormEditor = true;
    this.showLoginFormEditor = false;
    this.showAddressFormEditor = false;
    this.showSummaryFormEditor = false;
    this.visible2 = true;
  }

  // (removed duplicate empty showSummaryFormEditorWindow)
  closeFormEditor() {
  this.showBioFormEditor = false;
  this.showLoginFormEditor = false;
  this.showAddressFormEditor = false;
  this.showSummaryFormEditor = false;
  this.showSkillsFormEditor = false;
  this.showExperienceFormEditor = false;
  this.experienceEditingIndex = null;
  this.experienceDraft = null;
  this.visible2 = false;
  this.isActionInProgress = false;
  }

  getResumes(){
    // if(this.resumeList().length == 0){
    //   this.isActionInProgress = true;
    //   this.subs.push(this.resumeService.getResumeListByOwnerId(
    //       this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
    //         console.log(data);
    //       data.map(async (e : ResumeListDataItem)=>{
    //       await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.us-east-1.amazonaws.com/" + e.documentUrl).then((bytes)=>{
    //           e.imageBytes = bytes;
    //           this.resumes = [...this.resumes, e]
    //           let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
    //           if (!roleExists && e.roleCategory.length > 0) {
    //             this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
    //           }

    //           let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
    //           if (!resumeCategoryExists && e.resumeCategory.length > 0) {
    //             this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
    //           }
    //       })
    //       this.userStore.setResumeDataListItems(this.resumes);
    //       this.userStore.setFilteredResumes([...this.resumes]);
    //       setTimeout(() => {
    //         this.isActionInProgress = false;
    //       }, 100);

    //       })
    //       }, (err: any) => {
    //          console.log("Error: " + err);
    //          debugger;
    //       }));
    // }
    // else{

    //     this.resumeList().map((e)=>{
    //       let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
    //           if (!roleExists && e.roleCategory.length > 0) {
    //             this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
    //           }

    //           let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
    //           if (!resumeCategoryExists && e.resumeCategory.length > 0) {
    //             this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
    //           }
    //     })
    //     setTimeout(() => {
    //       this.isActionInProgress = false;
    //     }, 100);
    // }   
    if(this.loginStatus() && this.isFirstTimeCalling){
      this.isFirstTimeCalling = false;
      this.loadResumeData()
    }
  }

  private async loadResumeData() {
    try {
      await this.getResumeData(); // Ensure it completes before proceeding
      console.log("Resume data loaded successfully");
    } catch (error) {
      console.error("Error loading resume data", error);
    }
  }

  getResumeData(){
    if(this.resumeList().length == 0 && this.loginStatus()){
      this.isActionInProgress = true;
      this.subs.push(this.resumeService.getResumeListByOwnerId(
          this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
            console.log(data);
            if(data.length>0){
              data.map(async (e : ResumeListDataItem)=>{
          await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.us-east-1.amazonaws.com/" + e.documentUrl).then((bytes)=>{
              e.imageBytes = bytes;
              let resume : Resume = JSON.parse(e.resumeJson);
              if(!resume?.sections && !resume?.multipleSections){
                if(resume.template_details.template_name == 'TEMPLATE_1'){
                  resume.sections= this.template1_sections
                  resume.multipleSections = []
                }
                else if(resume.template_details.template_name == 'TEMPLATE_9'){
                  resume.multipleSections = [[...this.template9right_sections], [...this.template9left_sections]]
                  resume.sections = []
                }
                else if(resume.template_details.template_name == 'TEMPLATE_10'){
                  resume.sections= this.template10_sections
                  resume.multipleSections = []
                }
              }
              console.log(resume);
              
              e.resumeJson = JSON.stringify(resume)
              this.resumes = [...this.resumes, e]
              let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
              if (!roleExists && e.roleCategory.length > 0) {
                this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
              }

              let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
              if (!resumeCategoryExists && e.resumeCategory.length > 0) {
                this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
              }
          },
         (error : any)=>{
          if(error.status == 403){
            console.log("PDF Fetching Error");
          }
         })
          this.userStore.setResumeDataListItems(this.resumes);
          this.userStore.setFilteredResumes([...this.resumes]);
          this.isActionInProgress = false;
          })
            }
          else{
            this.isActionInProgress = false;
          }
          
          }));
        }
      else{
        this.resumeList().map((e)=>{
          let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
              if (!roleExists && e.roleCategory.length > 0) {
                this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
              }

              let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
              if (!resumeCategoryExists && e.resumeCategory.length > 0) {
                this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
              }
        })
        this.isActionInProgress = false;
      }      
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
          // //this.sidenavService.setCollapsed(true);
          }, 100);
  }

  receiveFromChild(isActionInProgress: boolean) {
    this.isActionInProgress = isActionInProgress; 
  }

  setFilterValues(){
    this.resumeList().map((e)=>{
      let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
          if (!roleExists && e.roleCategory.length > 0) {
            this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
          }

          let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
          if (!resumeCategoryExists && e.resumeCategory.length > 0) {
            this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
          }
    })
  }

  

  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Handles the "Add Job Application" button click.
   */
  onAddResume(): void {
    this.userStore.updateResumeForm(new Resume());
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.userStore.setIsChangeInNewResume(false);
    this.router.navigateByUrl('/user/resumes/resume');
  }

  filterApplications(){    
    this.isFilterOff = false
    this.searchQuery.disable()
    console.log(this.filteredResumeCategoryValue.value?.name, this.filteredRoleCategoryValue.value?.name);
    if((this.filteredResumeCategoryValue.value?.name?this.filteredResumeCategoryValue.value?.name.length > 0 : false) && (this.filteredRoleCategoryValue.value?.name?this.filteredRoleCategoryValue.value?.name.length > 0 : false)){
    this.filteredResumes = this.resumeList().filter(resume => (resume.roleCategory == this.filteredRoleCategoryValue.value?.name) && (resume.resumeCategory == this.filteredResumeCategoryValue.value?.name))
    }
    else if(this.filteredRoleCategoryValue.value?.name?this.filteredRoleCategoryValue.value?.name.length > 0 : false){
    this.filteredResumes = this.resumeList().filter(resume => (resume.roleCategory == this.filteredRoleCategoryValue.value?.name))
    }
    else if(this.filteredResumeCategoryValue.value?.name?this.filteredResumeCategoryValue.value?.name.length > 0 : false){
    this.filteredResumes = this.resumeList().filter(resume => (resume.resumeCategory == this.filteredResumeCategoryValue.value?.name))
    }
    this.userStore.setFilteredResumes(this.filteredResumes);
  }


  unselectFilter(){
    this.isFilterOff = true
    this.searchQuery.enable()
    this.filteredResumeCategoryValue.setValue("");
    this.filteredRoleCategoryValue.setValue("")
    this.userStore.setFilteredResumes(this.resumeList());
  }

  onSearch(){
    
  }

  onFilter(){

  }
}
