// ...existing imports...
import { WorkExperienceSectionComponent } from '../sections/work-experience-section.component';
import { ProjectSectionComponent } from '../sections/project-section.component';
import { CertificationsSectionComponent } from '../sections/certifications-section.component';
import { AchievementsSectionComponent } from '../sections/achievements-section.component';
import { SkillsBulletPointsSectionComponent } from '../sections/skills-bullet-points-section.component';
import { SkillsCategorySectionComponent } from '../sections/skills-category-section.component';


import { sections as defaultSections } from '../../../services/store/resume-sections';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, Signal, effect, computed, signal, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { Resume, ResumeContact, IsSectionPresent, ProfileSummary, Education, Project, Experience, Certification, SkillV2, Accomplishment, AchievementBulletPoints, courseWork } from '../../../services/resume.model';
import { SectionDesc } from '../../../services/store/user-store';
import { ResumeListDataItem } from '../../../services/work-ifence-data.model';
import { UserStoreService } from '../../../services/store/user-store.service';
import { PromptService } from '../../../services/shared/prompt.service';
import { GenAIService } from '../../../services/shared/genai.service';
import { TemplatesService } from '../../../services/shared/templates.service';
import { Injector } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
// Angular modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular CDK modules
import { DragDropModule, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

// PrimeNG modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AccordionModule } from 'primeng/accordion';

// Carousel module
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

// Icons module
import { IconsModule } from '../../../shared/icons.module';

// Section components
import { ContactSectionComponent } from '../sections/contact-section.component';
import { ProfileSummarySectionComponent } from '../sections/profile-summary-section.component';
import { EducationSectionComponent } from '../sections/education-section.component';

import { RelevantCourseworkSectionComponent } from '../sections/relevant-coursework-section/relevant-coursework-section.component';
import { ProfileSummaryBulletedSectionComponent } from '../sections/profile-summary-bulleted-section.component';

// Other components

interface SectionTemplate {
  section: string;
  htmlTemplate: string;
}

// Section keys (titles) used for this template, in order
export const RESUME1_TEMPLATE_SECTION_TITLES: string[] = [
  'CONTACT',
  'PROFILE_SUMMARY',
  'SKILLS_BULLET_POINTS',
  'WORK_EXPERIENCE',
  'EDUCATION',
  'ACHIEVEMENTS_BULLET_POINTS',
  'PROJECT',
];


@Component({
  selector: 'app-resume1-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  standalone: true,
  imports: [
    // Angular core modules
    CommonModule,
    // Angular Material modules
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatExpansionModule,
    MatTooltipModule,
    // Angular CDK modules
    DragDropModule, CdkDropList, CdkDrag,
    // PrimeNG modules
    InputTextModule,
    ButtonModule,
    TextareaModule,
    AccordionModule,
    // Section components
    ContactSectionComponent,
    ProfileSummarySectionComponent,
    EducationSectionComponent,
    WorkExperienceSectionComponent,
    ProjectSectionComponent,
    CertificationsSectionComponent,
    AchievementsSectionComponent,
    SkillsBulletPointsSectionComponent,
    SkillsCategorySectionComponent,
    RelevantCourseworkSectionComponent,
    ProfileSummaryBulletedSectionComponent,
    // Other components
    // Routing
    RouterModule,
    // Forms
    ReactiveFormsModule,
    FormsModule,
    // Carousel
    CarouselModule,
    // Icons
    IconsModule
  ]
})
export class Resume1TemplateComponent implements OnInit, OnDestroy {
  /**
   * Print/export mode: disables all editor-only UI, drag/drop, and actions.
   * Set to true for print/PDF export rendering.
   */
  @Input() isPrintMode: boolean = false;
  private sectionItemsCacheIntervalId: number | null = null;
  // Handles move up event from achievements section
  onMoveUpAchievement(index: number): void {
    const items = this.getSectionItems('ACHIEVEMENTS_BULLET_POINTS');
    if (!items || index == null || index <= 0) return;
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    // Update the ACHIEVEMENTS_BULLET_POINTS section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'ACHIEVEMENTS_BULLET_POINTS') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }

  // Handles move down event from achievements section
  onMoveDownAchievement(index: number): void {
    const items = this.getSectionItems('ACHIEVEMENTS_BULLET_POINTS');
    if (!items || index == null || index >= items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    // Update the ACHIEVEMENTS_BULLET_POINTS section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'ACHIEVEMENTS_BULLET_POINTS') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }
  // Handles delete event from achievements section (for (delete) output)
  onDeleteAchievement(index: number): void {
    const achievements = this.getSectionItems('ACHIEVEMENTS_BULLET_POINTS');
    const achievementItem = achievements[index];
    this.confirmDeleteItemDialog('ACHIEVEMENTS_BULLET_POINTS', achievementItem);
  }
  // Handles edit event from achievements section (for (edit) output)
  onEditAchievement(index: number): void {
    const achievements = this.getSectionItems('ACHIEVEMENTS_BULLET_POINTS');
    console.log('Editing achievement at index:', index);
    const achievementItem = achievements[index];
    console.log('Achievement item:', achievementItem);
    if (achievementItem) {
      // Always pass a new object to trigger store/effect updates
      const achievementCopy = { ...achievementItem };
      this.editSectionHandler('ACHIEVEMENTS_BULLET_POINTS', achievementCopy);
    }
  }
  // Handles delete event from certifications section (for (delete) output)
  onDeleteCertification(index: number): void {
    this.deleteCertificationItem(index);
  }
  // Handles move up event from certifications section
  onMoveUpCertification(index: number) {
    const items = this.getSectionItems('CERTIFICATIONS');
    if (!items || index == null || index <= 0) return;
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    // Update the CERTIFICATIONS section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'CERTIFICATIONS') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }

  // Handles move down event from certifications section
  onMoveDownCertification(index: number) {
    const items = this.getSectionItems('CERTIFICATIONS');
    if (!items || index == null || index >= items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    // Update the CERTIFICATIONS section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'CERTIFICATIONS') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }
  // Handles move up event from education section
  onMoveUpEducation(index: number) {
    const items = this.getSectionItems('EDUCATION');
    if (!items || index == null || index <= 0) return;
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    // Update the EDUCATION section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'EDUCATION') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }

  // Handles move down event from education section
  onMoveDownEducation(index: number) {
    const items = this.getSectionItems('EDUCATION');
    if (!items || index == null || index >= items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    // Update the EDUCATION section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'EDUCATION') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }
  // Handles edit event from relevant-coursework-section
  onEditCoursework(indexOrData: number | Object) {
    if (typeof indexOrData === 'number') {
      const courseworkList = this.getSectionItems('RELEVANT_COURSEWORK');
      const item = courseworkList[indexOrData];
      if (item) {
        this.editSectionHandler('RELEVANT_COURSEWORK', item);
      }
    } else if (indexOrData && typeof indexOrData === 'object') {
      this.editSectionHandler('RELEVANT_COURSEWORK', indexOrData);
    }
  }

  // Handles delete event from relevant-coursework-section
  onDeleteCoursework(index: number) {
    const courseworkList = this.getSectionItems('RELEVANT_COURSEWORK');
    const item = courseworkList[index];
    if (item) {
      this.deleteSectionItem('RELEVANT_COURSEWORK', item);
    }
  }

  // Handles move up event from relevant-coursework-section
  onMoveUpCoursework(index: number) {
    const items = this.getSectionItems('RELEVANT_COURSEWORK');
    if (!items || index == null || index <= 0) return;
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    // Update the RELEVANT_COURSEWORK section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'RELEVANT_COURSEWORK') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }

  // Handles profile summary bulleted section edit
  onEditProfileSummaryBulleted() {
    this.editSectionHandler('PROFILE_SUMMARY_BULLETED', this.getSectionData('PROFILE_SUMMARY_BULLETED')?.data);
  }

  // Handles edit event from skills by category section
  onEditSkillsByCategory() {
    // Open the skills component in the sidenav for SKILLS_BY_CATEGORY
    this.editSectionHandler('SKILLS_BY_CATEGORY', this.getSectionItems('SKILLS_BY_CATEGORY'));
  }
  // Delete a project item
  onDeleteProject(index: number): void {
    const items = this.getSectionItems('PROJECT');
    console.log('[onDeleteProject] items before:', items);
    if (!items || index == null || index < 0 || index >= items.length) {
      console.warn('[onDeleteProject] Invalid index or items:', { index, items });
      return;
    }
    const projectItem = items[index];
    console.log('[onDeleteProject] Deleting project at index', index, 'item:', projectItem);
    this.confirmDeleteItemDialog('PROJECT', projectItem);
    // Log after dialog (async, so may not reflect immediate state)
    setTimeout(() => {
      const itemsAfter = this.getSectionItems('PROJECT');
      console.log('[onDeleteProject] items after (timeout):', itemsAfter);
    }, 500);
  }
  // Move up a project item
  onMoveUpProject(index: number) {
    const items = this.getSectionItems('PROJECT');
    if (!items || index == null || index <= 0) return;
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    // Update the PROJECT section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'PROJECT') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }

  // Move down a project item
  onMoveDownProject(index: number) {
    const items = this.getSectionItems('PROJECT');
    if (!items || index == null || index >= items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    // Update the PROJECT section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'PROJECT') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }
  // Move up a work experience item
  onMoveUpExperience(index: number) {
    const items = this.getSectionItems('WORK_EXPERIENCE');
    if (!items || index == null || index <= 0) return;
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    // Update the WORK_EXPERIENCE section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'WORK_EXPERIENCE') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }

  // Move down a work experience item
  onMoveDownExperience(index: number) {
    const items = this.getSectionItems('WORK_EXPERIENCE');
    if (!items || index == null || index >= items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    // Update the WORK_EXPERIENCE section in the sections array
    const sections = this.resumeForm().sections?.map((section: any) => {
      if (section.section === 'WORK_EXPERIENCE') {
        return { ...section, items: [...items] };
      }
      return section;
    }) ?? [];
    this.userStore.setResumeSections(sections);
    this.updateSectionItemsCache();
    this.markDirty();
    this.cdr.detectChanges();
  }
  // --- Signals and Store Properties ---
  sidebarIconOnly!: Signal<boolean>;
  sectionStatus!: Signal<IsSectionPresent>;
  resumeForm!: Signal<Resume>;
  selectedResumeListItem!: Signal<ResumeListDataItem>;
  addedSections = computed(() => {
    // Explicitly depend on resumeForm signal for reactivity
    const resume = this.resumeForm();
    console.log(resume);
    
    const sections = resume.sections || [];
    const added = sections.filter((s: any) => s.isAdded);
    console.log('[Resume1TemplateComponent] addedSections computed:', { resume, sections, added });
    return added;
  });
  hasUnsavedChanges = false;
  isDragging: boolean = false;
  currentDraggingSection: string = '';
  sectionConfig: { [key: string]: any } = {};
  resetCourseworkForm: boolean = false;
  @Output() editSection = new EventEmitter<any>();
  @Output() saveRequested = new EventEmitter<void>();
  @Output() rendered = new EventEmitter<void>();
  @Input() isPreview: boolean = false;
  @Input() resumeId: string | null = null;
  certificationsTitles = () => this.getCertificationsSection().map((c: any) => c.title || c.name || '');
  userStore: UserStoreService;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public dialog: MatDialog,
    public promptService: PromptService,
    public genaiService: GenAIService,
    public templateService: TemplatesService,
    private injector: Injector,
    userStore: UserStoreService
  ) {
    this.userStore = userStore;
    // ...existing constructor logic...
  }
  // ...existing properties and constructor...


// ...existing code...
  logSectionItemsDebug() {
    if (!this.sectionItemsCache) {
      console.warn('[Resume1TemplateComponent] sectionItemsCache is undefined!');
      return;
    }
    console.log('[Resume1TemplateComponent] sectionItemsCache:', this.sectionItemsCache);
    console.log('[Resume1TemplateComponent] getSectionItems("PROJECT"):', this.getSectionItems('PROJECT'));
    // Also log all section keys and their item counts
    Object.keys(this.sectionItemsCache ?? {}).forEach(key => {
      const arr = this.sectionItemsCache?.[key];
      console.log(`[Resume1TemplateComponent] section '${key}' items count:`, Array.isArray(arr) ? arr.length : 'not array');
    });
  }


  // --- Public Helper Methods ---
  getContactSection() {
    const section = this.resumeForm().sections?.find(s => s.section === 'CONTACT');
    return section?.data || {};
  }
  getProfileSummarySection() {
    // Only return PROFILE_SUMMARY section's data, never PROFILE_SUMMARY_BULLETED
    const section = this.resumeForm().sections?.find(s => s.section === 'PROFILE_SUMMARY');
    // Defensive: if the section's data accidentally contains HTML bullets, strip them
    if (section?.data && typeof section.data.profile_summary === 'string' && section.section === 'PROFILE_SUMMARY_BULLETED') {
      // Should never happen, but if so, return empty
      return {};
    }
    return section?.data || {};
  }
  getCourseWorkSection() { const section = this.addedSections().find((s: any) => s.section === 'RELEVANT_COURSEWORK'); return section?.items?.map((i: any) => i.data) || []; }
  getSkillsCategorySection() { 
    const section = this.addedSections().find((s: any) => s.section === 'SKILLS_BY_CATEGORY'); 
    return section?.items?.map((i: any) => i.data) || []; 
  }
  getSkillsBulletPointsSection() { const section = this.addedSections().find((s: any) => s.section === 'SKILLS_BULLET_POINTS'); return section?.items?.map((i: any) => i.data.skill) || []; }
  
  getSkillsByCategoryNormalized() {
    const section = this.addedSections().find((s: any) => s.section === 'SKILLS_BY_CATEGORY');
    if (!section?.items) return [];
    
    return section.items
      .map((item: any) => {
        const name = (item.data?.name || '').trim();
        const skills = Array.isArray(item.data?.skills) 
          ? item.data.skills.map((s: string) => (s || '').trim()).filter((s: string) => s.length > 0)
          : [];
        return { name, skills };
      })
      .filter((cat: any) => cat.name.length > 0 || cat.skills.length > 0);
  }

  getAccomplishmentSection() { const section = this.addedSections().find((s: any) => s.section === 'ACHIEVEMENT_WITH_DESC'); return section?.items?.map((i: any) => i.data) || []; }
  getAchievementBulletPointsSection() {
    return this.getSectionItems('ACHIEVEMENTS_BULLET_POINTS');
  }
  getCertificationBulletPointsSection() { const section = this.addedSections().find((s: any) => s.section === 'CERTIFICATIONS_BULLET_POINTS'); return section?.items?.[0]?.data || {}; }
  getCertificationsSection() { const section = this.addedSections().find((s: any) => s.section === 'CERTIFICATIONS'); return section?.items?.map((i: any) => i.data) || []; }

  // Handles edit event from resume-education-section (real or dummy)
  onEditEducation(indexOrData: number | Object) {
    if (typeof indexOrData === 'number') {
      const educationList = this.getSectionItems('EDUCATION');
      const item = educationList[indexOrData];
      if (item) {
        this.editSectionHandler('EDUCATION', item);
      }
    } else if (indexOrData && typeof indexOrData === 'object') {
      this.editSectionHandler('EDUCATION', indexOrData);
    }
  }

  // Handles delete event from resume-education-section
  onDeleteEducation(index: number) {
    const educationList = this.getSectionItems('EDUCATION');
    const item = educationList[index];
    if (item) {
      this.deleteSectionItem('EDUCATION', item);
    }
  }


  // Handles move down event from relevant-coursework-section
  onMoveDownCoursework(index: number) {
    // Implementation for moving coursework down
    console.log('Move coursework down:', index);
  }

  // Handles add event from skills section
  onAddSkills() {
    this.addSectionHandler('SKILLS_BULLET_POINTS');
  }

  onAddAchievement(): void {
    this.userStore.setSelectedAccomplishment({ id: '', data: new AchievementBulletPoints() } as any);
    this.editSection.emit({ section: 'ACHIEVEMENTS_BULLET_POINTS' });
  }

  onAddCertification(): void {
    this.userStore.setSelectedCertification({ id: undefined, data: new Certification() } as any);
    this.editSection.emit({ section: 'CERTIFICATIONS' });
  }

  // Handles edit event from skills section
  onEditSkills() {
    // Handles edit for SKILLS_BULLET_POINTS
    this.editSectionHandler('SKILLS_BULLET_POINTS', this.getSectionItems('SKILLS_BULLET_POINTS'));
  }

  // Handles profile summary section edit
  onEditProfileSummary() {
    this.editSectionHandler('PROFILE_SUMMARY', this.getProfileSummarySection());
  }

  // Handles profile summary section move down
  onMoveDownProfileSummary() {
    this.moveSectionDown('PROFILE_SUMMARY');
  }

  // Handles contact section update
  onContactSectionUpdated() {
    this.markDirty();
  }

  // Called when the contact section edit icon is clicked
  showContact(contact: any) {
    // Set selectedContact in the selectedResume in the store
    const resume = this.resumeForm();
    if (resume) {
      resume.selectedContact = contact;
      this.userStore.updateResumeForm(resume);
    }
    this.editSection.emit({ section: 'CONTACT', contact });
  }
 

  // All section rendering and logic should now depend only on the sections list from the selected Resume in the store.


  // Cache for section items to avoid infinite change detection and unify logic
  sectionItemsCache: { [section: string]: any[] } = {};


  // Helper to get items from sections by section name (all item-based sections use cache)
  getSectionItems(sectionName: string): any[] {
    const liveSection = this.addedSections().find((section: any) => section.section === sectionName);
    const liveItems = Array.isArray(liveSection?.items) ? liveSection.items : [];
    const cachedItems = this.sectionItemsCache[sectionName];

    if (Array.isArray(cachedItems) && cachedItems.length === liveItems.length) {
      return cachedItems;
    }

    return liveItems;
  }


  // Update sectionItemsCache for all item-based sections whenever addedSections changes
  // This should only be called from effects or after section order/data changes, not from the template directly
  updateSectionItemsCache() {
    const cache: { [section: string]: any[] } = {};
    for (const section of this.addedSections()) {
      if (Array.isArray(section.items)) {
        cache[section.section] = section.items;
      }
    }
    this.sectionItemsCache = cache;
    // Notify print-resume component that rendering is complete
    if (this.isPrintMode) {
      setTimeout(() => {
        this.rendered.emit();
      }, 500);
    }
  }
 
  private unloadHandler = (e: BeforeUnloadEvent) => {
    if (this.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };


  ngOnDestroy(): void {
    // this.userStore.setResumeSections([])
    if (this.sectionItemsCacheIntervalId != null && typeof window !== 'undefined') {
      window.clearInterval(this.sectionItemsCacheIntervalId);
      this.sectionItemsCacheIntervalId = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadHandler);
    }
  }


  ngOnInit() {
    console.log('🚀🚀🚀 Resume1TemplateComponent ngOnInit STARTED 🚀🚀🚀');
    this.sidebarIconOnly = this.userStore.getSidebarIconOnly();
    this.sectionStatus = this.userStore.getSectionStatus();
    this.resumeForm = this.userStore.getResumeForm();
    console.log(this.resumeForm());
    
    this.selectedResumeListItem = this.userStore.getSelectedResumeListItem();
    console.log('📝 Resume1TemplateComponent initialized. isPreview:', this.isPreview);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.unloadHandler);
    }

    // If this is a new resume (no id), generate id and initialize sections for this template
    const resume = this.resumeForm();
    if (!resume?.id) {
      // Generate a new unique id for the resume
      const newId = this.generateId();
      resume.id = newId;
      this.userStore.updateResumeForm(resume); // Persist the new id
      this.loadSectionsForNewResume();
    }

    // Always set section status for new or existing resumes
    let isSection : IsSectionPresent = new IsSectionPresent();
    isSection.isContact = true;
    isSection.isSummary = true;
    isSection.isEducation = true;
    isSection.isCourseWork= true;
    isSection.isSkill = true;
    isSection.isProject = true;
    isSection.isExperience =true;
    isSection.isCertification= true;
    isSection.isAchievement = true;
    this.userStore.updateSectionStatus(isSection);

    // Update sectionItemsCache initially
    this.updateSectionItemsCache();
    this.logSectionItemsDebug();

    // Make sectionItemsCache reactive to addedSections
    if (typeof window !== 'undefined' && typeof (window as any).ngDevMode !== 'undefined') {
      console.log('[Resume1TemplateComponent] Setting up effect for sectionItemsCache reactivity');
    }
    // Use a microtask to ensure signals are set up before effect
    Promise.resolve().then(() => {
      // If using signals, use an effect to update cache when addedSections changes
      if (typeof (window as any).ngDevMode !== 'undefined' && typeof (window as any).ng === 'object') {
        // Angular signals dev mode: use effect if available
        if (typeof (window as any).ng.effect === 'function') {
          (window as any).ng.effect(() => {
            this.updateSectionItemsCache();
          });
        } else {
          // Fallback: poll for changes (for dev/test only)
          this.zone.runOutsideAngular(() => {
            this.sectionItemsCacheIntervalId = window.setInterval(() => {
              this.updateSectionItemsCache();
            }, 500);
          });
        }
      } else {
        // Production: use MutationObserver or manual trigger if needed
        // For now, just update on every tick outside Angular zone so it doesn't block SSR hydration stability.
        this.zone.runOutsideAngular(() => {
          this.sectionItemsCacheIntervalId = window.setInterval(() => {
            this.updateSectionItemsCache();
          }, 1000);
        });
      }
    });
  }

  /**
   * Loads sections for a new resume using RESUME1_TEMPLATE_SECTION_TITLES and defaultSections.
   * Sets isAdded=true in both the default list and the new list, and updates the store.
   */
  loadSectionsForNewResume() {
    // Set isAdded=true for all defaultSections that match the template titles
    RESUME1_TEMPLATE_SECTION_TITLES.forEach(sectionKey => {
      const def = defaultSections.find(s => s.section === sectionKey);
      if (def) def.isAdded = true;
    });

    // Build the new sections list for this template
    const newSections = RESUME1_TEMPLATE_SECTION_TITLES.map((sectionKey, idx, arr) => {
      const def = defaultSections.find(s => s.section === sectionKey);
      if (!def) return null;
      // Deep clone the section and set isAdded to true
      const sectionCopy = JSON.parse(JSON.stringify(def));
      sectionCopy.isAdded = true;
      // Set headerActions for moveUp/moveDown based on position
      if (!sectionCopy.headerActions) sectionCopy.headerActions = {};
      // CONTACT (first) - no arrows
      if (idx === 0) {
        sectionCopy.headerActions.moveUp = false;
        sectionCopy.headerActions.moveDown = false;
      }
      // Second item - only down arrow
      else if (idx === 1) {
        sectionCopy.headerActions.moveUp = false;
        sectionCopy.headerActions.moveDown = true;
      }
      // Last item - only up arrow
      else if (idx === arr.length - 1) {
        sectionCopy.headerActions.moveUp = true;
        sectionCopy.headerActions.moveDown = false;
      }
      // All others - both arrows
      else {
        sectionCopy.headerActions.moveUp = true;
        sectionCopy.headerActions.moveDown = true;
      }
      return sectionCopy;
    }).filter(Boolean);
    // Update the store with the new sections list
    this.userStore.setResumeSections(newSections);
  }
  // Check if resume is empty and auto-populate with sample data
  checkAndOfferSampleData(): void {
    const resume = this.resumeForm();
    const contact = this.getContactSection();
    const profile = this.getProfileSummarySection();
    const education = this.getSectionItems('EDUCATION');
    const experience = this.getSectionItems('WORK_EXPERIENCE');
    const project = this.getSectionItems('PROJECT');
    const certification = this.getSectionItems('CERTIFICATIONS');
    const skills = this.getSkillsCategorySection();
    console.log('🔍 Checking resume data:', {
      hasName: !!contact.fname,
      isDefaultContact: contact.isDefaultData,
      hasProfile: !!profile.profile_summary,
      isDefaultProfile: profile.isDefault,
      sectionsCount: {
        education: education.length || 0,
        experience: experience.length || 0,
        projects: project.length || 0,
        certifications: certification.length || 0,
        skills: skills.length || 0
      },
      isPreview: this.isPreview
    });

    const isEmpty = (!contact.fname || contact.isDefaultData) &&
                   (!profile.profile_summary || profile.isDefault) &&
                   education.length === 0 &&
                   experience.length === 0 &&
                   project.length === 0;
    
    if (isEmpty && !this.isPreview) {
      console.log('🔄 Resume is empty - sample data will be added when sections are enabled');
      // Sample data is now handled by the store's addSection method
    } else {
      console.log('ℹ️ Resume already has content or is in preview mode');
    }
  }

onDragStart(sectionName: string) {
  this.currentDraggingSection = sectionName;
  this.isDragging = true;
  
  // Add custom attribute to placeholder for dynamic content
  setTimeout(() => {
    const placeholder = document.querySelector('.cdk-drag-placeholder') as HTMLElement;
    if (placeholder) {
      placeholder.setAttribute('data-section-title', this.getSectionDisplayTitle(sectionName));
    }
  }, 50);
}

onDragEnd() {
  this.isDragging = false;
  this.currentDraggingSection = '';
  
  // Clean up dragging classes
  const draggingElements = document.querySelectorAll('.cdk-drag-dragging');
  draggingElements.forEach(el => el.classList.remove('cdk-drag-dragging'));
}

getSectionDisplayTitle(sectionKey: string): string {
  const sectionData = this.getSectionData(sectionKey);
  return sectionData?.editable_section_title || sectionData?.title || sectionKey.replace(/_/g, ' ');
}

private readonly template1DisplayTitleMap: Record<string, string> = {
  PROFILE_SUMMARY: 'PROFILE SUMMARY',
  PROFILE_SUMMARY_BULLETED: 'CAREER HIGHLIGHTS',
  SKILLS_BY_CATEGORY: 'SKILLS',
  SKILLS_BULLET_POINTS: 'CORE COMPETENCIES',
  WORK_EXPERIENCE: 'PROFESSIONAL EXPERIENCE',
  EDUCATION: 'EDUCATION',
  PROJECT: 'PROJECTS',
  CERTIFICATIONS: 'CERTIFICATIONS',
  ACHIEVEMENTS_BULLET_POINTS: 'ACHIEVEMENTS'
};

private normalizeTemplate1SectionTitle(value: string): string {
  return (value || '').trim().replace(/[_\s]+/g, ' ').toUpperCase();
}

  
formatSkills(items : string[]){
  return items.join(", ");
}

  confirmDeleteItemDialog(section: string, selectedJson : any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {name: 'confirm'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === "CONFIRM"){
        if(section === "EDUCATION"){
          this.userStore.deleteEducation(selectedJson)
        }
        else if(section === "PROJECT"){
          console.log(selectedJson);
          this.userStore.deleteProject(selectedJson);
          // Force update of sectionItemsCache and trigger change detection
          setTimeout(() => {
            this.updateSectionItemsCache();
            this.cdr.detectChanges();
            console.log('[confirmDeleteItemDialog] Forced sectionItemsCache update after PROJECT delete:', this.getSectionItems('PROJECT'));
          }, 0);
        }
        else if(section === "WORK_EXPERIENCE"){
          this.userStore.deleteExperience(selectedJson)
        }
        else if(section === "CERTIFICATIONS"){
          this.userStore.deleteCertification(selectedJson)
        }
        else if(section === 'ACHIEVEMENT_WITH_DESC'){
          this.userStore.deleteAccomplishment(selectedJson)
        }
        else if(section === 'ACHIEVEMENTS_BULLET_POINTS'){
          this.userStore.deleteAchievementItem(selectedJson);
          setTimeout(() => {
            this.updateSectionItemsCache();
            this.cdr.detectChanges();
          }, 0);
        }
        this.markDirty();
      }
    });
  }


  getDivClass(item : any){
    if(item.isHideSelected){
      return 'opacity-50'
    }
    return 'opacity-100'
  }


  hideSectionElement(section: string, selectedJson : any){
    if(section === "SUMMARY"){
      // this.userStore.deleteSummary();
    }
    else if(section === "COURSEWORK"){
      // this.userStore.deleteCourseWork()
    }
    else if(section === "SKILLS"){
      // this.userStore.deleteSkill();
    }
    else if(section === "EDUCATION"){
      selectedJson.isHideSelected = true;
      this.userStore.updateEducation(selectedJson)
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = true;
      this.userStore.updateProject(selectedJson)
    }
    else if(section === "WORK_EXPERIENCE"){
      selectedJson.isHideSelected = true;
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "CERTIFICATIONS"){
      selectedJson.isHideSelected = true;
      this.userStore.updateCertification(selectedJson)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      selectedJson.isHideSelected = true;
  let acc = this.getAccomplishmentSection();
  let index = acc.findIndex((obj: any) => obj.id === selectedJson.id)
      this.userStore.updateAccomplishmentItem(selectedJson, index);
    }
    this.markDirty();
  }

  unHideSectionElement(section: string, selectedJson : any){
    if(section === "SUMMARY"){
      // this.userStore.deleteSummary();
    }
    else if(section === "COURSEWORK"){
      // this.userStore.deleteCourseWork()
    }
    else if(section === "SKILLS"){
      // this.userStore.deleteSkill();
    }
    else if(section === "EDUCATION"){
      selectedJson.isHideSelected = false;
      this.userStore.updateEducation(selectedJson)
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = false;
      this.userStore.updateProject(selectedJson)
    }
    else if(section === "WORK_EXPERIENCE"){
      selectedJson.isHideSelected = false;
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "CERTIFICATIONS"){
      selectedJson.isHideSelected = false;
      this.userStore.updateCertification(selectedJson)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      selectedJson.isHideSelected = false;
  let acc = this.getAccomplishmentSection();
  let index = acc.findIndex((obj: any) => obj.id === selectedJson.id)
      this.userStore.updateAccomplishmentItem(selectedJson, index);
    }
    this.markDirty();
  }

  addSectionHandler(section: string) {
  // Call store method to add section and set default data
  this.userStore.addSection(section);

  if (section === 'WORK_EXPERIENCE') {
    this.userStore.setSelectedExperience(new Experience());
  }

  if (section === 'CERTIFICATIONS') {
    this.userStore.setSelectedCertification({ id: undefined, data: new Certification() } as any);
  }

  this.markDirty();
  this.cdr.detectChanges();
  this.cdr.markForCheck();
  this.editSection.emit({ section: section });
  }



  editSectionHandler(section : string, selectedJson : any){
    console.log('editSectionHandler called with section:', section, 'selectedJson:', selectedJson);
    if(section == "CONTACT"){
      // For contact editing, set selectedContact to the current contact section data
      const contactSection = this.getContactSection();
      this.userStore.setSelectedContact(contactSection);
      this.userStore.updateContact();
    }
    else if(section == "PROFILE_SUMMARY" || section == "PROFILE_SUMMARY_BULLETED"){
      // For both summary types, set selectedSummary to the current section data and open summary form
      const summarySection = section === "PROFILE_SUMMARY_BULLETED"
        ? this.getSectionData('PROFILE_SUMMARY_BULLETED')?.data
        : this.getProfileSummarySection();
      this.userStore.setSelectedSummary(summarySection);
      this.userStore.updateSummaryWithData(summarySection);
    }
    else if(section == "EDUCATION"){
      this.userStore.setSelectedEducation(selectedJson);
      this.userStore.updateEducation(selectedJson)
    }
    else if(section == "RELEVANT_COURSEWORK"){
      this.userStore.setSelectedCourseWork(selectedJson);
      this.userStore.updateCourseWork(selectedJson)
    }
    else if(section == "PROJECT"){
      this.userStore.setSelectedProject(selectedJson);
      this.userStore.updateProject(selectedJson)
    }
    else if(section == "WORK_EXPERIENCE"){
      const selectedExperience = selectedJson?.data ?? selectedJson ?? new Experience();
      this.userStore.setSelectedExperience(selectedExperience);
      this.userStore.updateExperience(selectedExperience)
    }
    else if(section == "CERTIFICATIONS"){
      this.userStore.setSelectedCertification(selectedJson);
      this.userStore.updateCertification(selectedJson)
    }
    else if(section === "ACHIEVEMENTS_BULLET_POINTS"){
      this.userStore.setSelectedAccomplishment(selectedJson)
    }
    else if(section === "SKILLS_BY_CATEGORY"){
      // Set the selected skills category in the store for editing
      this.userStore.setSelectedSkillsCategory(selectedJson);
    }
    else if(section === "SKILLS_BULLET_POINTS"){
      // Optionally, set selected skill bullet points if you have a setter
      // this.userStore.setSelectedSkillsBulletPoints(selectedJson);
      // (If not needed, you can skip this)
    }
    this.markDirty();
    this.editSection.emit({section : section})
  }

  checkEducationCondition(){
  const education = this.getSectionItems('EDUCATION');
  return education.filter((obj: any) => obj.isHideSelected === false)?.length > 0
  }

  checkProjectCondition(){
  const project = this.getSectionItems('PROJECT');
  return project.filter((obj: any) => obj.isHideSelected === false)?.length > 0
  }

  checkExperienceCondition(){
  const experience = this.getSectionItems('WORK_EXPERIENCE');
  return experience.filter((obj: any) => obj.isHideSelected === false)?.length > 0
  }

  checkCertificationCondition(){
  const certification = this.getSectionItems('CERTIFICATIONS');
  return certification.filter((obj: any) => obj.isHideSelected === false)?.length > 0
  }



  // (Removed duplicate moveObjectById definition. The correct version is below.)
  moveObjectById(section: string, id: string, direction: "up" | "down"): void {
    // Move section in the main section list (for section headers)
    const sections = this.addedSections();
    const index = sections.findIndex((s: any) => s.section === section);
    if (index === -1) return;
    if (direction === "up" && index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
    } else if (direction === "down" && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    } else {
      return;
    }
    // Update arrow button configuration after move
    this.updateSectionArrows(sections);
    this.userStore.setResumeSections(sections);
    this.markDirty();
    this.cdr.detectChanges();
  }
  removeSection(section: string) {
    this.confirmRemoveSection(section);
  }

  confirmRemoveSection(section: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: 'confirm' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.event === 'CONFIRM') {
        this.userStore.removeSection(section);
        this.markDirty();
        this.cdr.detectChanges();
      }
    });
  }

drop(event: CdkDragDrop<SectionDesc[]>) {
  const addedSections = this.addedSections();
  console.log("Before: ", addedSections, event.previousIndex, event.currentIndex);
  
  if (event.previousIndex !== event.currentIndex) {
    this.userStore.reorderSections(event.previousIndex, event.currentIndex);
    const afterSections = this.addedSections();
    console.log("After: ", afterSections, event.previousIndex, event.currentIndex);
    // Add a subtle success animation
    this.animateSuccessfulDrop(event.currentIndex);
    this.markDirty();
  }
  // Clean up any drag states
  this.onDragEnd();
}

  // Handler for cdkDropListDropped event in template
  onSectionDrop(event: CdkDragDrop<SectionDesc[]>) {
    this.drop(event);
  }

private animateSuccessfulDrop(targetIndex: number) {
  setTimeout(() => {
    const sections = document.querySelectorAll('.trigger-area');
    if (sections[targetIndex]) {
      const section = sections[targetIndex] as HTMLElement;
      section.style.transform = 'scale(1.02)';
      section.style.transition = 'all 0.2s ease-in-out';
      
      setTimeout(() => {
        section.style.transform = '';
      }, 200);
    }
  }, 50);
}



  // Template management helper methods
  getSectionTemplate(sectionType: string): SectionTemplate | null {
    return this.sectionConfig[sectionType] || null;
  }

  shouldShowSection(sectionType: string): boolean {
    const sectionDesc = this.addedSections().find((desc: any) => desc.section === sectionType);
    return !!sectionDesc;
  }

  // Helper method to check if education section has data
  hasEducationData(): boolean {
  return this.getSectionItems('EDUCATION')?.length > 0;
  }

  // Helper method to check if education section is empty
  isEducationEmpty(): boolean {
    return !this.hasEducationData();
  }

  shouldShowButton(sectionType: string, buttonType: string, isLast?: boolean): boolean {
    // Hide all buttons in preview mode for every section
    if (this.isPreview) {
      return false;
    }

    const sectionDesc = this.addedSections().find((desc: any) => desc.section === sectionType);
    if (!sectionDesc?.headerActions) return false;

    // Check if the button type is enabled in headerActions
    const isButtonEnabled = !!sectionDesc.headerActions[buttonType];
    if (!isButtonEnabled) return false;

    // Define special logic for different button types
    const buttonLogic: { [key: string]: { [key: string]: (isLast?: boolean) => boolean } } = {
      'edit': {
        'EDUCATION': () => false, // Individual items have edit buttons
        'WORK_EXPERIENCE': () => false,
        'PROJECT': () => false,
        'CERTIFICATIONS': () => false,
        'SKILLS_BULLET_POINTS': () => this.hasSkillsBulletPoints(),
        'SKILLS_BY_CATEGORY': () => this.hasSkillsByCategory(),
        'SKILLS_CATEGORY': () => this.hasSkills(),
        'ACHIEVEMENTS_BULLET_POINTS': () => false,
        'default': () => true
      },
      'add': {
        'EDUCATION': () => true, // Always show add for item-based sections
        'WORK_EXPERIENCE': () => true,
        'PROJECT': () => true,
        'CERTIFICATIONS': () => true,
        'SKILLS_BULLET_POINTS': () => !this.hasSkillsBulletPoints(),
        'SKILLS_BY_CATEGORY': () => true,
        'SKILLS_CATEGORY': () => !this.hasSkills(),
        'ACHIEVEMENTS_BULLET_POINTS': () => true,
        'default': () => true
      },
      'delete': {
        'default': () => isButtonEnabled
      },
      'moveUp': {
        'default': () => isButtonEnabled
      },
      'moveDown': {
        'PROJECT': (isLast?: boolean) => false, // Project is always last, can't move down
        'default': (isLast?: boolean) => isButtonEnabled && (!isLast)
      }
    };
    const logic = buttonLogic[buttonType]?.[sectionType] || buttonLogic[buttonType]?.['default'];
    // console.log(`Checking button visibility for section '${sectionType}', button '${buttonType}', isLast: ${isLast}`, { isButtonEnabled: isButtonEnabled, logicResult: logic ? logic(isLast) : 'N/A' });

    return logic ? logic(isLast) : isButtonEnabled;
  }

  getSectionCssClass(sectionType: string): string {
    const classMap: { [key: string]: string } = {
      'CONTACT': 'resume-contact-us',
      'PROFILE_SUMMARY': 'resume-summary',
      'EDUCATION': 'resume-education', 
      'WORK_EXPERIENCE': 'resume-experience',
      'PROJECT': 'resume-project',
      'SKILLS_BULLET_POINTS': 'resume-skills',
      'SKILLS_CATEGORY': 'resume-skills',
      'CERTIFICATIONS': 'resume-certifications',
      'ACHIEVEMENTS_BULLET_POINTS': 'resume-achievements',
      'RELEVANT_COURSEWORK': 'resume-coursework'
    };
    return classMap[sectionType] || 'resume-section';
  }

  getSectionLabel(sectionType: string): string {
    const labelMap: { [key: string]: string } = {
      'CONTACT': 'contact',
      'PROFILE_SUMMARY': 'summary',
      'EDUCATION': 'education',
      'WORK_EXPERIENCE': 'experience', 
      'PROJECT': 'project',
      'SKILLS_BULLET_POINTS': 'skills',
      'SKILLS_CATEGORY': 'skills',
      'CERTIFICATIONS': 'certifications',
      'ACHIEVEMENTS_BULLET_POINTS': 'achievements',
      'RELEVANT_COURSEWORK': 'coursework'
    };
    return labelMap[sectionType] || sectionType.toLowerCase();
  }


  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public method to check current resume data status
  public checkDataStatus(): void {
  const contact = this.getSectionData('CONTACT');
  const profileSummary = this.getSectionData('PROFILE_SUMMARY');
    const education = this.getSectionItems('EDUCATION');
    const experience = this.getSectionItems('WORK_EXPERIENCE');
    const project = this.getSectionItems('PROJECT');
    const certification = this.getSectionItems('CERTIFICATIONS');
    const skills = this.getSectionItems('SKILLS_CATEGORY');
    // For achievements and coursework, fallback to empty array if not found
  const achievements = this.getAchievementBulletPointsSection().length || 0;
  const coursework = (this.getCourseWorkSection()?.length) || 0;
    console.log('📊 Current Resume Data Status:', {
      contact: {
        name: contact?.data?.fname + ' ' + contact?.data?.lname,
        email: contact?.data?.email_address || contact?.data?.email,
        hasDefaultData: contact?.data?.isDefaultData
      },
      profileSummary: {
        hasContent: !!profileSummary?.data?.paragraph,
        isDefault: profileSummary?.data?.isDefault,
        length: profileSummary?.data?.paragraph?.length || 0
      },
      sections: {
        education: education.length,
        experience: experience.length,
        projects: project.length,
        certifications: certification.length,
        skills: skills.length,
        achievements,
        coursework
      }
    });
  }


moveSectionUp(section: string) {
  const addedSections = this.addedSections();
  const idx = addedSections.findIndex((s: any) => s.section === section);
  if (idx > 0) {
    [addedSections[idx - 1], addedSections[idx]] = [addedSections[idx], addedSections[idx - 1]];
    this.updateSectionArrows(addedSections);
    this.userStore.setResumeSections(addedSections);
    this.markDirty();
    this.cdr.detectChanges();
  }
}

  moveSectionDown(section: string) {
    const addedSections = this.addedSections();
    const idx = addedSections.findIndex((s: any) => s.section === section);
    if (idx > -1 && idx < addedSections.length - 1) {
      [addedSections[idx], addedSections[idx + 1]] = [addedSections[idx + 1], addedSections[idx]];
      this.updateSectionArrows(addedSections);
      this.userStore.setResumeSections(addedSections);
      this.markDirty();
      this.cdr.detectChanges();
    }
  }

  // Helper to update moveUp/moveDown arrow configuration for all sections
  updateSectionArrows(sections: any[]) {
    for (let i = 0; i < sections.length; i++) {
      if (!sections[i].headerActions) sections[i].headerActions = {};
      if (i === 0) {
        // First (CONTACT): no arrows
        sections[i].headerActions.moveUp = false;
        sections[i].headerActions.moveDown = false;
      } else if (i === 1) {
        // Second: only down
        sections[i].headerActions.moveUp = false;
        sections[i].headerActions.moveDown = true;
      } else if (i === sections.length - 1) {
        // Last: only up
        sections[i].headerActions.moveUp = true;
        sections[i].headerActions.moveDown = false;
      } else {
        // Middle: both
        sections[i].headerActions.moveUp = true;
        sections[i].headerActions.moveDown = true;
      }
    }
  }
  
  canMoveUp(section: string): boolean {
    const sectionDesc = this.addedSections().find((s: any) => s.section === section);
    if (!sectionDesc?.headerActions?.moveUp) return false;
    const displayedSections = this.addedSections().filter((s: any) => s.section !== 'CONTACT');
    const idx = displayedSections.findIndex((s: any) => s.section === section);
    return idx > 0;
  }

  canMoveSectionDown(section: string): boolean {
    const sectionDesc = this.addedSections().find((s: any) => s.section === section);
    if (!sectionDesc?.headerActions?.moveDown) return false;
    const displayedSections = this.addedSections().filter((s: any) => s.section !== 'CONTACT');
    const idx = displayedSections.findIndex((s: any) => s.section === section);
    return idx < displayedSections.length - 1;
  }

  getSectionData(sectionKey: string): SectionDesc | undefined {
    return this.addedSections().find((s: any) => s.section === sectionKey);
  }



  dragStarted(event: CdkDragStart) {
  const element = (event.source.element.nativeElement as HTMLElement);
  element.parentElement?.style.setProperty('--drag-placeholder-height', `${element.offsetHeight}px`);
  
  // Add dragging class for better visual feedback
  element.classList.add('cdk-drag-dragging');
  
  // Get section info for the placeholder
  const sectionElement = element.querySelector('.summary-section-title');
  if (sectionElement) {
    const sectionTitle = sectionElement.textContent?.trim() || '';
    element.setAttribute('data-section-title', sectionTitle);
  }
}

isDefaultData(data : string){
return data?.length==0
}

  isContactDefaultData(){
    const contact = this.getContactSection();
    return contact?.fname?.length>0 || contact?.lname?.length>0 || contact?.subTitle?.length>0 || contact?.phone_number?.length>0
      || contact?.email?.length>0 || contact?.github_profile?.length>0 || contact?.linkedIn_profile?.length>0;
  }

  isAchievementDefaultData(){
  const ach = this.getAchievementBulletPointsSection();
  return !ach || ach.length === 0;
  }

  hasAchievements(): boolean {
  const ach = this.getAchievementBulletPointsSection();
  return Array.isArray(ach) && ach.length > 0;
  }

  isCertificationDefaultData(){
    const cert = this.getCertificationBulletPointsSection();
    return cert?.point == null || cert?.point?.length == 0 || cert?.point == undefined;
  }

  hasCourseWork(): boolean {
    const courseWork = this.getCourseWorkSection();
    return !!courseWork.length;
  }

  hasProfileSummary(): boolean {
    const profile = this.getProfileSummarySection();
    return !!(profile?.profile_summary?.length);
  }

  hasSkills(): boolean {
    const skills = this.getSkillsCategorySection();
    return !!skills.length && !this.isSkillsCategoryDefault();
  }

  hasSkillsByCategory(): boolean {
    return this.getSkillsByCategoryNormalized().length > 0;
  }

  hasSkillsBulletPoints(): boolean {
    const skillsBP = this.getSkillsBulletPointsSection();
    return !!skillsBP.length;
  }

  formatSkillsBulletPoints(): string {
    const skillsBP = this.getSkillsBulletPointsSection();
    if (!skillsBP.length) return '';
    return skillsBP.join(', ');
  }

getProjectBulletPoints(description: string): string[] {
  if (!description) return [];
  
  // If it's HTML content, extract text from list items
  if (description.includes('<li>') || description.includes('<ul>') || description.includes('<ol>')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const listItems = tempDiv.querySelectorAll('li');
    return Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim().length > 0);
  }
  
  // Fallback to line splitting for plain text
  return description.split('\n').filter(point => point.trim().length > 0);
}

getExperienceBulletPoints(description: string): string[] {
  if (!description) return [];
  
  // If it's HTML content, extract text from list items
  if (description.includes('<li>') || description.includes('<ul>') || description.includes('<ol>')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const listItems = tempDiv.querySelectorAll('li');
    return Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim().length > 0);
  }
  
  // Fallback to line splitting for plain text
  return description.split('\n').filter(point => point.trim().length > 0);
}

hasExperienceDescription(item: Experience): boolean {
  return !!(item.description?.length);
}

hasProjectDescription(item: Project): boolean {
  return !!(item.description?.length);
}

hasGPA(item: Education): boolean {
  return !!(item.gpa?.length);
}

getSectionTitle(section : string){
  const sectionData = this.addedSections().find((entry: any) => entry.section === section);
  const defaultSection = defaultSections.find((entry: any) => entry.section === section);
  const mappedTitle = this.template1DisplayTitleMap[section] || section.replace(/_/g, ' ');
  const customTitle = (sectionData?.editable_section_title || '').trim();

  const builtInTitles = new Set([
    this.normalizeTemplate1SectionTitle(section),
    this.normalizeTemplate1SectionTitle(mappedTitle),
    this.normalizeTemplate1SectionTitle(defaultSection?.editable_section_title || ''),
    this.normalizeTemplate1SectionTitle(defaultSection?.title || ''),
    this.normalizeTemplate1SectionTitle(defaultSection?.label || '')
  ]);

  if (customTitle && !builtInTitles.has(this.normalizeTemplate1SectionTitle(customTitle))) {
    return customTitle;
  }

  return mappedTitle;
}

  isAccomplishmentDefaultData(){
    const acc = this.getAccomplishmentSection();
    return acc.length == 0 || acc == null || acc == undefined;
  }

  isSkillsCategoryDefault(){
    const skills = this.getSkillsCategorySection();
    return skills.length == 0 || skills == null || skills == undefined;
  }


  // TrackBy functions for performance optimization
  trackByEducationId(index: number, item: any): any {
    return item.id || index;
  }

  trackByCourseWorkId(index: number, item: any): any {
    return item.id || index;
  }

  // Delete individual section items
  deleteSectionItem(section: string, item: any): void {
  if(section === "EDUCATION"){
      this.userStore.deleteEducation(item);
    }
    else if(section === "RELEVANT_COURSEWORK"){
      this.userStore.deleteCourseWorkItem(item);
    }
    // Add other section types as needed
    this.markDirty();
  }

  // Project Section Methods
  hasProjectData(): boolean {
    const projects = this.getSectionItems('PROJECT');
    return projects && projects.length > 0;
  }

  editProjectItem(index: number): void {
    const projects = this.getSectionItems('PROJECT');
    let projectItem = projects[index];
    // If projectItem is a wrapper with .data, pass .data to the store for editing
    if (projectItem && projectItem.data) {
      projectItem = { ...projectItem.data, id: projectItem.id || projectItem.data.id };
    }
    // If migrating from old structure, combine responsibilities/highlights into detailsRichText
    if (!projectItem.detailsRichText) {
      let combined = '';
      if (Array.isArray(projectItem.responsibilities) && projectItem.responsibilities.length > 0) {
        combined += projectItem.responsibilities.join('\n');
      }
      if (Array.isArray(projectItem.highlights) && projectItem.highlights.length > 0) {
        if (combined.length > 0) combined += '\n';
        combined += projectItem.highlights.join('\n');
      }
      projectItem.detailsRichText = combined;
    }
    this.userStore.setSelectedProject(projectItem);
    this.editSectionHandler('PROJECT', projectItem);
  }

  deleteProjectItem(index: number): void {
    const projects = this.getSectionItems('PROJECT');
    const projectItem = projects[index];
    this.confirmDeleteItemDialog('PROJECT', projectItem);
  }

  // Certification Methods
  hasCertificationData(): boolean {
    const certifications = this.getSectionItems('CERTIFICATIONS');
    return certifications && certifications.length > 0;
  }

  editCertificationItem(index: number): void {
    const certifications = this.getSectionItems('CERTIFICATIONS');
    const certificationItem = certifications[index];
    // Always pass a new object to trigger store/effect updates
    const certificationCopy = { ...certificationItem };
    this.editSectionHandler('CERTIFICATIONS', certificationCopy);
  }

  // Handles edit event from certifications section (for (edit) output)
  onEditCertification(index: number): void {
    this.editCertificationItem(index);
  }

  deleteCertificationItem(index: number): void {
    const certifications = this.getSectionItems('CERTIFICATIONS');
    const certificationItem = certifications[index];
    this.confirmDeleteItemDialog('CERTIFICATIONS', certificationItem);
  }

  // Experience Methods
  hasExperienceData(): boolean {
    const experiences = this.getSectionItems('WORK_EXPERIENCE');
    return experiences && experiences.length > 0;
  }

  editExperienceItem(index: number): void {
    const experiences = this.getSectionItems('WORK_EXPERIENCE');
    const experienceItem = experiences[index];
    if (!experienceItem) {
      return;
    }
    this.editSectionHandler('WORK_EXPERIENCE', experienceItem);
  }

  deleteExperienceItem(index: number): void {
    const experiences = this.getSectionItems('WORK_EXPERIENCE');
    const experienceItem = experiences[index];
    if (!experienceItem) {
      return;
    }
    this.confirmDeleteItemDialog('WORK_EXPERIENCE', experienceItem);
  }

  private markDirty(): void {
    this.hasUnsavedChanges = true;
    // Ensure change detection picks this up in OnPush scenarios
    this.cdr.markForCheck?.();
  }

  onSaveChanges(): void {
    // Hook actual persistence here if needed (parent can handle via event)
    this.hasUnsavedChanges = false;
    this.saveRequested.emit();
    this.cdr.detectChanges();
  }
  
  // Handles edit event from skills by category items
onEditSkillsCategoryItem(index: number) {
  const items = this.getSectionItems('SKILLS_BY_CATEGORY');
  console.log('onEditSkillsCategoryItem called with index:', index, 'items:', items);
  const item = items[index];
  if (item) {
    this.editSectionHandler('SKILLS_BY_CATEGORY', item);
  }
}

// Move up a skills by category item
onMoveUpSkillsCategoryItem(index: number) {
  const items = this.getSectionItems('SKILLS_BY_CATEGORY');
  if (!items || index == null || index <= 0) return;
  [items[index - 1], items[index]] = [items[index], items[index - 1]];
  this.updateSectionItems('SKILLS_BY_CATEGORY', items);
}

// Move down a skills by category item
onMoveDownSkillsCategoryItem(index: number) {
  const items = this.getSectionItems('SKILLS_BY_CATEGORY');
  if (!items || index == null || index >= items.length - 1) return;
  [items[index], items[index + 1]] = [items[index + 1], items[index]];
  this.updateSectionItems('SKILLS_BY_CATEGORY', items);
}

// Delete a skills by category item
onDeleteSkillsCategoryItem(index: number) {
  const items = this.getSectionItems('SKILLS_BY_CATEGORY');
  const item = items[index];
  if (item) {
    this.deleteSectionItem('SKILLS_BY_CATEGORY', item);
  }
}

// Helper to update items for a section
updateSectionItems(sectionKey: string, items: any[]) {
  const sections = this.resumeForm().sections?.map((section: any) => {
    if (section.section === sectionKey) {
      return { ...section, items: [...items] };
    }
    return section;
  }) ?? [];
  this.userStore.setResumeSections(sections);
  this.updateSectionItemsCache();
  this.markDirty();
  this.cdr.detectChanges();
}

}