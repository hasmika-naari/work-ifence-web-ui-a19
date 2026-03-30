import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  Signal,
  AfterViewInit,
  PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA,
  Output,
  EventEmitter,
  effect,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { SubscriptionFacadeService } from 'src/app/facades/subscription-facade.service';
import type { SubscriptionPlanRequestRow } from 'src/app/models/subscription.model';
import { DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
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
import { JobApplication, Resume, RoundDetails } from 'src/app/services/resume.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ResumeService } from 'src/app/services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { JobApplicationRequest, ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import moment from 'moment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JobApplicationStatus } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { SelectModule } from 'primeng/select';
import { ApplicationListComponent } from '../dashboard-job-application/application-list/application-list.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { SectionDesc } from 'src/app/services/store/user-store';
import { ImportExistingResumeComponent } from '../import-existing-resume/import-existing-resume.component';
import { ResumeTemplateSelectionService } from 'src/app/services/resume-template-selection.service';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { ResumePortalApiService } from 'src/app/resume-portal/services/resume-portal-api.service';
import { ResumeLimitService } from 'src/app/resume-portal/services/resume-limit.service';
import { buildResumeTemplateIdentity } from 'src/app/resume-portal/utils/resume-template-key.util';
import { resolveResumePreviewUrl } from 'src/app/utils/resume-preview-url';

interface Option {
  name : string;
  code : string;
}

@Component({
    selector: 'app-resume-dashboard',
    standalone: true,
    imports: [DatePipe, RouterLink, RouterModule, StyleClassModule, NgOptimizedImage, MenuModule, ChartModule, FormsModule, ChartModule, ReactiveFormsModule, MenuModule, DividerModule, MatFormFieldModule, MatInputModule, TableModule, DialogModule, InputTextModule, MatProgressBarModule, StyleClassModule, ResumeList2Component, PanelMenuModule, ResumeFormTabbedComponent, ResumeForm2Component, ButtonModule, TemplatesPageComponent, ResumeFormComponent, ApplicationListComponent, MatMenuModule, MatIconModule, MatToolbarModule, MatSelectModule, MatMenuModule, SelectModule, ImportExistingResumeComponent, FooterWorkifenceComponent],
    templateUrl: './dashboard-resume.component.html',
    styleUrl : './dashboard-resume.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class DashboardResumeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('resumeHeader') private resumeHeader?: ElementRef<HTMLElement>;
  isHeaderStuck = false;
  private stickyStateListener?: () => void;

  private _isActionInProgress = true;
  isResumeDownloadInProgress = false;
  isCreateEligibilityLoading = false;

  get isActionInProgress(): boolean {
    return this._isActionInProgress;
  }

  set isActionInProgress(value: boolean) {
    this._isActionInProgress = value;
    this.syncFormControlsDisabledState();
  }

  items!: MenuItem[];

  chartData: any;

  chartOptions: any;

  subscriptions: Array<Subscription> = [];

  showResumeGenerator = false;

  productDialog: boolean = false;

  showResumeGeneratorHeader =  false;

  searchQuery = new FormControl('', { nonNullable: true });

  filteredRoleCategoryValue = new FormControl<Option | null>(null);
  filteredResumeCategoryValue = new FormControl<Option | null>(null);
  roleCategories : Array<Option> = []
  resumeCategories : Array<Option> = []
  tempResumes : ResumeListDataItem[] = []

  private syncFormControlsDisabledState(): void {
    if (!this.searchQuery || !this.filteredRoleCategoryValue || !this.filteredResumeCategoryValue) {
      return;
    }

    const controls = [this.searchQuery, this.filteredRoleCategoryValue, this.filteredResumeCategoryValue];
    for (const control of controls) {
      if (this._isActionInProgress) {
        if (!control.disabled) {
          control.disable({ emitEvent: false });
        }
      } else {
        if (control.disabled) {
          control.enable({ emitEvent: false });
        }
      }
    }
  }

  template1_sections  : Array<SectionDesc> = [
     {
        section: 'PROFILE_SUMMARY',
        description: 'A brief summary of your skills and experience.',
        isAdded: false,
        isPremium: false,
        tags: 'summary, profile, objective',
        label: 'Summary',
        title : 'Profile summary',
        editable_section_title : 'Profile Summary'
    },
    {
        section: 'EDUCATION',
        description: 'Details about your educational background.',
        isAdded: false,
        isPremium: false,
        tags: 'education, school, degree',
        label: 'Education',
        title : 'Education',
        editable_section_title : "Education"
    },
    {
        section: 'RELEVANT_COURSEWORK',
        description: 'Relevant coursework you have completed.',
        isAdded: false,
        isPremium: false,
        tags: 'coursework, classes, subjects',
        label: 'Coursework',
        title : 'Relevant coursework',
        editable_section_title :'Relevant Coursework'
    },
    {
        section: 'SKILLS_BULLET_POINTS',
        description: 'A list of your skills in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, abilities, competencies',
        label: 'Skills (B.P.)',
        title : 'Skills with bullet points',
        editable_section_title : 'Skills'
    },
    {
        section: 'SKILLS_CATEGORY',
        description: 'Categorized list of your skills.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, categorized, grouped',
        label: 'Skills (Category)',
        title : 'Skills category',
        editable_section_title : 'Skills'
    },
    {
        section: 'WORK_EXPERIENCE',
        description: 'Your professional work experience.',
        isAdded: false,
        isPremium: false,
        tags: 'experience, work, job',
        label: 'Experience',
        title : 'Work experience',
        editable_section_title : 'Experience'
    },
    {
        section: 'PROJECT',
        description: 'Projects you have worked on.',
        isAdded: false,
        isPremium: false,
        tags: 'projects, portfolio, work',
        label: 'Projects',
        title : 'Project',
        editable_section_title : 'Project'
    },
    {
        section: 'CERTIFICATIONS',
        description: 'Certifications you have earned.',
        isAdded: false,
        isPremium: false,
        tags: 'certifications, licenses, credentials',
        label: 'Certifications',
        title : 'Certification',
        editable_section_title : 'Certifications'
    },
    {
        section: 'CERTIFICATIONS_BULLET_POINTS',
        description: 'A list of your certifications in bullet points.',
        isAdded: false,
        isPremium: true,
        tags: 'certifications, bullet points, list',
        label: 'Certs (B.P.)',
        title : 'Certification with bullet points',
        editable_section_title : 'Certifications'
    },
    {
        section: 'ACHIEVEMENTS_BULLET_POINTS',
        description: 'Your achievements in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'achievements, accomplishments, awards',
        label: 'Achievements',
        title : 'Achievements with bullet points',
        editable_section_title : 'Achievements'
    },
    {
        section: 'ACHIEVEMENT_WITH_DESC',
        description: 'Detailed description of your achievements.',
        isAdded: false,
        isPremium: true,
        tags: 'achievements, description, details',
        label: 'Accomplishments',
        title : 'Accomplishments',
        editable_section_title : 'Accomplishments'
    }
  ];

  template9right_sections: Array<SectionDesc> = [
    {
      section: 'PROFILE_SUMMARY',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      description: 'A brief summary of your skills and experience.',
      isAdded: true,
      isPremium: false,
      tags: 'summary, profile, objective',
      label: 'Summary'
    },
    {
      section: 'WORK_EXPERIENCE',
      title: 'Work experience',
      editable_section_title: 'Experience',
      description: 'Your professional work experience.',
      isAdded: true,
      isPremium: false,
      tags: 'experience, work, job',
      label: 'Experience'
    },
    {
      section: 'PROJECT',
      title: 'Project',
      editable_section_title: 'Project',
      description: 'Projects you have worked on.',
      isAdded: true,
      isPremium: false,
      tags: 'projects, portfolio, work',
      label: 'Projects'
    }
  ]

    template9left_sections: Array<SectionDesc> = [
      {
        section: 'RELEVANT_COURSEWORK',
        title: 'Relevant coursework',
        editable_section_title: 'Relevant Coursework',
        description: 'Relevant coursework you have completed.',
        isAdded: true,
        isPremium: false,
        tags: 'coursework, classes, subjects',
        label: 'Coursework'
      },
      {
        section: 'SKILLS_BULLET_POINTS',
        title: 'Skills with bullet points',
        editable_section_title: 'Skills',
        description: 'A list of your skills in bullet points.',
        isAdded: true,
        isPremium: false,
        tags: 'skills, abilities, competencies',
        label: 'Skills (B.P.)'
      },
      {
        section: 'EDUCATION',
        title: 'Education',
        editable_section_title: 'Education',
        description: 'Details about your educational background.',
        isAdded: true,
        isPremium: false,
        tags: 'education, school, degree',
        label: 'Education'
      },
      {
        section: 'CERTIFICATIONS_BULLET_POINTS',
        title: 'Certification with bullet points',
        editable_section_title: 'Certifications',
        description: 'A list of your certifications in bullet points.',
        isAdded: true,
        isPremium: true,
        tags: 'certifications, bullet points, list',
        label: 'Certs (B.P.)'
      },
      {
        section: 'ACHIEVEMENTS_BULLET_POINTS',
        title: 'Achievements with bullet points',
        editable_section_title: 'Achievements',
        description: 'Your achievements in bullet points.',
        isAdded: true,
        isPremium: false,
        tags: 'achievements, accomplishments, awards',
        label: 'Achievements'
      }
    ]

  template10_sections: Array<SectionDesc> = [
    {
      section: 'PROFILE_SUMMARY',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      description: 'A brief summary of your skills and experience.',
      isAdded: true,
      isPremium: false,
      tags: 'summary, profile, objective',
      label: 'Summary'
    },
    {
      section: 'EDUCATION',
      title: 'Education',
      editable_section_title: 'Education',
      description: 'Details about your educational background.',
      isAdded: true,
      isPremium: false,
      tags: 'education, school, degree',
      label: 'Education'
    },
    {
      section: 'SKILLS_CATEGORY',
      title: 'Skills category',
      editable_section_title: 'Skills',
      description: 'A list of your skills by category.',
      isAdded: true,
      isPremium: false,
      tags: 'skills, abilities, competencies',
      label: 'Skills'
    },
    {
      section: 'WORK_EXPERIENCE',
      title: 'Work experience',
      editable_section_title: 'Experience',
      description: 'Your professional work experience.',
      isAdded: true,
      isPremium: false,
      tags: 'experience, work, job',
      label: 'Experience'
    },
    {
      section: 'PROJECT',
      title: 'Project',
      editable_section_title: 'Project',
      description: 'Projects you have worked on.',
      isAdded: true,
      isPremium: false,
      tags: 'projects, portfolio, work',
      label: 'Projects'
    },
    {
      section: 'ACHIEVEMENT_WITH_DESC',
      title: 'Accomplishments',
      editable_section_title: 'Accomplishments',
      description: 'Your accomplishments with descriptions.',
      isAdded: true,
      isPremium: false,
      tags: 'achievements, accomplishments, awards',
      label: 'Accomplishments'
    }
  ]

  private resumePortalApi: ResumePortalApiService = inject(ResumePortalApiService);
  private resumeService: ResumeService = inject(ResumeService);
  private pdfToImageService: PdfToImageService = inject(PdfToImageService);
  private userStore: UserStoreService = inject(UserStoreService);
  private resumeLimit: ResumeLimitService = inject(ResumeLimitService);
  private readonly subscriptionFacade = inject(SubscriptionFacadeService);
  readonly trialRequest = signal<SubscriptionPlanRequestRow | null>(null);
  readonly trialBannerDismissed = signal(false);
  readonly trialBannerStatus = computed<string | null>(() => {
    if (this.trialBannerDismissed()) { return null; }
    const row = this.trialRequest();
    if (!row) { return null; }
    const s = (row.status ?? '').toUpperCase();
    return (s === 'PENDING' || s === 'APPROVED' || s === 'REJECTED') ? s : null;
  });
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  private platformId: object =  inject(PLATFORM_ID);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  isFilterOff : boolean = true
  isSearchOff : boolean = true
  resumeList : Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
  filteredResumesList : Signal<ResumeListDataItem[]> = this.userStore.getFilteredResumes();
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  subs: Array<Subscription> = [];
  private readonly templateSelection = inject(ResumeTemplateSelectionService);
  readonly resumeUsageLabel = this.resumeLimit.usageLabel;
  readonly resumeUsageDetail = this.resumeLimit.usageDetail;
  readonly hasResumeLimit = this.resumeLimit.hasResumeLimit;
  readonly isResumeLimitReached = this.resumeLimit.isAtLimit;
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
      this.templateSelection.applySelectionIfPresent();
      this.subscriptionFacade.getMyPlanRequests().pipe(take(1)).subscribe({
        next: (rows) => {
          if (rows.length === 0) { return; }
          const latest = rows.reduce((a, b) =>
            (b.requestedDate ?? '') >= (a.requestedDate ?? '') ? b : a
          );
          this.trialRequest.set(latest);
        },
        error: () => { /* best-effort: silently skip */ },
      });
      // this.sidenavService.toggleCollapsed();

      this.filteredResumeCategoryValue.setValue(null);
      this.filteredRoleCategoryValue.setValue(null);
      this.searchQuery.setValue('');
      this.userStore.setFilteredResumes(this.resumeList());
      
      this.searchQuery.valueChanges.subscribe((query) => {
        const normalizedQuery = query.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
          this.isSearchOff = true;
        } else {
          this.isSearchOff = false;
        }

        this.filteredResumes = this.resumeList().filter((resume) =>
          resume.title.toLowerCase().includes(normalizedQuery)
        );
        this.userStore.setFilteredResumes(this.filteredResumes);
      });

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

  private getText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private addFilterOption(options: Array<Option>, rawValue: unknown): Array<Option> {
    const value = this.getText(rawValue);
    if (!value) {
      return options;
    }

    const exists = options.some(option => option.name === value);
    return exists ? options : [...options, { name: value, code: '' }];
  }

  private syncCategoriesForResume(item: ResumeListDataItem): void {
    this.roleCategories = this.addFilterOption(this.roleCategories, item.roleCategory);
    this.resumeCategories = this.addFilterOption(this.resumeCategories, item.resumeCategory);
  }

  private buildResumePdfUrl(documentUrl: unknown): string | null {
    return resolveResumePreviewUrl(documentUrl);
  }

  async getResumeData(){
    if(this.resumeList().length == 0 && this.loginStatus()){
      this.isActionInProgress = true;

      try {
        const data = await this.resumePortalApi.getMyResumes();
        console.log(data);

        if (data.length > 0) {
          this.resumes = await Promise.all(data.map(item => this.hydrateResumeListItem(item)));
          this.resumes.forEach(item => this.syncCategoriesForResume(item));
          this.userStore.setResumeDataListItems(this.resumes);
          this.userStore.setFilteredResumes([...this.resumes]);
        }
      } catch (error: any) {
        if(error?.status == 500){
          console.log("Internal Server Error");
        }
      } finally {
        this.isActionInProgress = false;
      }
    }
    else{
      this.resumeList().map((e)=>{
        this.syncCategoriesForResume(e);
      })
      this.isActionInProgress = false;
    }
  }

  private async hydrateResumeListItem(item: ResumeListDataItem): Promise<ResumeListDataItem> {
    const hydratedItem = { ...item };
    const pdfUrl = this.buildResumePdfUrl(hydratedItem.documentUrl);

    try {
      hydratedItem.imageBytes = await this.pdfToImageService.convertPdfToImageBytesThroughUrl(pdfUrl ?? '');

      if ((hydratedItem.imageBytes?.length ?? 0) === 0 && hydratedItem.userName && hydratedItem.fileName) {
        const pdfBytes = await firstValueFrom(
          this.resumeService.dowloadResumePDF(hydratedItem.userName, hydratedItem.fileName)
        );
        hydratedItem.imageBytes = await this.pdfToImageService.convertPdfArrayBufferToImageBytes(pdfBytes as ArrayBuffer);
      }
    } catch (error: any) {
      if (error?.status == 403) {
        console.log("PDF Fetching Error");
      }
      hydratedItem.imageBytes = Array.isArray(hydratedItem.imageBytes) ? hydratedItem.imageBytes : [];
    }

    let resume: Resume = JSON.parse(hydratedItem.resumeJson);
    if(!resume?.sections && !resume?.multipleSections){
      if(resume.template_details.template_name == 'TEMPLATE_1'){
        // resume.sections= this.template1_sections
        // resume.multipleSections = []
      }
      else if(resume.template_details.template_name == 'TEMPLATE_9'){
        // resume.multipleSections = [[...this.template9right_sections], [...this.template9left_sections]]
        // resume.sections = []
      }
      else if(resume.template_details.template_name == 'TEMPLATE_10'){
        // resume.sections= this.template10_sections
        // resume.multipleSections = []
      }
    }

    console.log(resume);
    hydratedItem.resumeJson = JSON.stringify(resume);
    return hydratedItem;
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
          // //this.sidenavService.setCollapsed(true);
          }, 100);

      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const updateStickyState = () => {
        const headerEl = this.resumeHeader?.nativeElement;
        if (!headerEl) {
          return;
        }

        const computed = getComputedStyle(headerEl);
        const offsetRaw = computed.getPropertyValue('--wf-dashboard-header-offset').trim();
        const offset = Number.parseFloat(offsetRaw || '0') || 0;

        const top = headerEl.getBoundingClientRect().top;
        this.isHeaderStuck = top <= offset + 1;
      };

      const onScrollOrResize = () => {
        requestAnimationFrame(updateStickyState);
      };

      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });
      this.stickyStateListener = () => {
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      };

      // Initialize state once the view is ready.
      updateStickyState();
  }

  receiveFromChild(isActionInProgress: boolean) {
    this.isResumeDownloadInProgress = isActionInProgress;
  }

  setFilterValues(){
    this.resumeList().map((e)=>{
      this.syncCategoriesForResume(e);
    })
  }

  

  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.stickyStateListener?.();
  }

  /**
   * Handles the "Add Job Application" button click.
   */
  async onAddResume(): Promise<void> {
    if (this.isCreateEligibilityLoading) {
      return;
    }

    const limit = this.resumeLimit.canCreateResume();
    if (!limit.allowed) {
      this.resumeLimit.handleDenied(limit, { action: 'create', returnUrl: this.router.url });
      return;
    }

    this.isCreateEligibilityLoading = true;

    try {
      const eligibility = await firstValueFrom(this.resumeService.getCreateEligibility());
      if (!this.resumeLimit.isCreateEligibilityAllowed(eligibility)) {
        this.resumeLimit.handleEligibilityDenied(eligibility, { action: 'create', returnUrl: this.router.url });
        return;
      }

      this.startNewResumeFlow();
    } catch (error) {
      console.error('Failed to verify resume create eligibility.', error);
    } finally {
      this.isCreateEligibilityLoading = false;
    }
  }

  private startNewResumeFlow(): void {
    const resume = new Resume();
    const selection = this.templateSelection.consumeCatalogSelection();
    if (selection) {
      const identity = buildResumeTemplateIdentity({
        id: selection.templateId,
        templateKey: selection.templateKey,
        componentKey: selection.componentKey,
        imageUrl: selection.previewUrl,
      });
      resume.template_details = {
        ...resume.template_details,
        id: Number.isFinite(Number(selection.templateId)) ? Number(selection.templateId) : resume.template_details.id,
        name: selection.title || selection.templateKey || resume.template_details.name,
        template_name: identity.template_name,
        templateKey: identity.templateKey,
        componentKey: identity.componentKey,
        version: selection.version,
        imgPath: selection.previewUrl || resume.template_details.imgPath,
        accessLevel: selection.accessLevel || resume.template_details.accessLevel,
      };
      this.userStore.setFlagOnTemplateSelected(identity.template_name);
    }
    this.userStore.setResumeForm(resume);
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.userStore.setIsChangeInNewResume(false);
    void this.router.navigateByUrl('/user/resumes/resume');
  }

  openSubscriptionPlans(): void {
    this.resumeLimit.openSubscriptionPlans();
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
    this.filteredResumeCategoryValue.setValue(null);
    this.filteredRoleCategoryValue.setValue(null)
    this.userStore.setFilteredResumes(this.resumeList());
  }

  resetFilters(): void {
    // Reset UI controls
    this.isFilterOff = true;
    this.isSearchOff = true;
    this.filteredResumeCategoryValue.setValue(null);
    this.filteredRoleCategoryValue.setValue(null);
    this.searchQuery.setValue('');

    // Ensure search is enabled after clearing.
    if (this.searchQuery.disabled) {
      this.searchQuery.enable({ emitEvent: false });
    }

    // Restore full list
    this.userStore.setFilteredResumes(this.resumeList());
  }

  hasActiveFilters(): boolean {
    const search = this.searchQuery?.value?.trim() ?? '';
    return (
      search.length > 0 ||
      this.filteredResumeCategoryValue?.value != null ||
      this.filteredRoleCategoryValue?.value != null
    );
  }

  onSearch(){
    
  }

  onFilter(){

  }
}
