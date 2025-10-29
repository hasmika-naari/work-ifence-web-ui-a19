import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, Signal, effect, computed, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { Resume, ResumeContact, IsSectionPresent, ProfileSummary, Education, Project, Experience, Certification, SkillV2, Accomplishment, courseWork } from '../../../services/resume.model';
import { SectionDesc } from '../../../services/store/user-store';
import { ResumeListDataItem } from '../../../services/work-ifence-data.model';
import { UserStoreService } from '../../../services/store/user-store.service';
import { PromptService } from '../../../services/shared/prompt.service';
import { GenAIService } from '../../../services/shared/genai.service';
import { TemplatesService } from '../../../services/shared/templates.service';
import { Injector } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// Angular modules
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
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
import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { WorkExperienceSectionComponent } from '../sections/work-experience-section.component';
import { ProjectSectionComponent } from '../sections/project-section.component';
import { CertificationsSectionComponent } from '../sections/certifications-section.component';
import { AchievementsSectionComponent } from '../sections/achievements-section.component';
import { SkillsBulletPointsSectionComponent } from '../sections/skills-bullet-points-section.component';
import { SkillsCategorySectionComponent } from '../sections/skills-category-section.component';
import { RelevantCourseworkSectionComponent } from '../sections/relevant-coursework-section/relevant-coursework-section.component';

// Other components
import { FooterComponent } from '../../../pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../../pages/landing/header-wifence/header-wifence.component';


// ...existing code...

interface SectionTemplate {
  section: string;
  htmlTemplate: string;
}


@Component({
  selector: 'app-resume1-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  standalone: true,
  imports: [
    // Angular core modules
    CommonModule,
    NgOptimizedImage,
    
    // Angular Material modules
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatExpansionModule,
    MatTooltipModule,
    
    // Angular CDK modules
    DragDropModule,
    
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
    
    // Other components
    FooterComponent,
    HeaderWorkIfenceComponent,
    
    // Routing
    RouterModule,
    RouterLink,
    
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
  // --- Properties ---
  sidebarIconOnly!: Signal<boolean>;
  sectionStatus!: Signal<IsSectionPresent>;
  resumeForm!: Signal<Resume>;
  selectedResumeListItem!: Signal<ResumeListDataItem>;
  @Output() editSection = new EventEmitter<any>();
  @Output() saveRequested = new EventEmitter<void>();
  @Input() isPreview : boolean = false;

  // Pass isPreview to all section components
  sectionInputs = {
    isPreview: computed(() => this.isPreview)
  };
  currentDraggingSection: string = '';
  isDragging : boolean = false;
  hasUnsavedChanges = false;
  resetCourseworkForm = false;
  firstHalfSkills : SkillV2[] = [];
  secondHalfSkills : SkillV2[] = [];
  isSectionsSetCount : number = 1;
  // Single computed signal for added sections (for display and drag-and-drop)
  addedSections = computed(() => {
    const sections = this.resumeForm().sections || [];
    const added = sections.filter(s => s.isAdded);
    console.log('addedSections recomputed', added.map(s => ({section: s.section, isAdded: s.isAdded})));
    return added;
  });

  // Getter for drag and drop data binding
  get dragDropSections(): SectionDesc[] {
    return this.addedSections();
  }
  certificationsTitles = computed(() => this.getCertificationsSection().map(c => c.title || c.name || ''));
  sectionConfig: { [key: string]: SectionTemplate } = {};

   constructor(
    private _formBuilder: FormBuilder, 
    private router : Router, 
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public promptService : PromptService, 
    public genaiService : GenAIService, 
    public templateService : TemplatesService,
    private injector: Injector,
    private userStore: UserStoreService
  ) {
    console.log('🚀🚀🚀 Resume1TemplateComponent constructor invoked 🚀🚀🚀');
    // Section and unsaved change state logic simplified: only update skills arrays as needed
    // effect(() => {
    //   const skills = this.getSkillsCategorySection();
    //   if(skills?.length>0){
    //     this.firstHalfSkills = [...skills.slice(0, Math.ceil(skills?.length/2))]
    //     this.secondHalfSkills = [...skills.slice(Math.ceil(skills?.length/2),)]
    //   }
    // });

    // Reflect global unsaved-change state (e.g., edits from left-side forms)
    effect(() => {
      const changedSignal = this.userStore.getIsChangeInNewResume?.();
      const changed = typeof changedSignal === 'function' ? !!changedSignal() : false;
      this.hasUnsavedChanges = changed || this.hasUnsavedChanges; // preserve true until explicit save
    });
  }


  // --- Public Helper Methods ---
  getContactSection() {
    const section = this.resumeForm().sections?.find(s => s.section === 'CONTACT');
    return section?.data || {};
  }
  getProfileSummarySection() {
    const section = this.resumeForm().sections?.find(s => s.section === 'PROFILE_SUMMARY');
    return section?.data || {};
  }
  getCourseWorkSection() { const section = this.addedSections().find((s: any) => s.section === 'RELEVANT_COURSEWORK'); return section?.items?.map((i: any) => i.data) || []; }
  getSkillsCategorySection() { const section = this.addedSections().find((s: any) => s.section === 'SKILLS_CATEGORY'); return section?.items?.map((i: any) => i.data) || []; }
  getSkillsBulletPointsSection() { const section = this.addedSections().find((s: any) => s.section === 'SKILLS_BULLET_POINTS'); return section?.items?.map((i: any) => i.data.skill) || []; }
  getAccomplishmentSection() { const section = this.addedSections().find((s: any) => s.section === 'ACHIEVEMENT_WITH_DESC'); return section?.items?.map((i: any) => i.data) || []; }
  getAchievementBulletPointsSection() { const section = this.addedSections().find((s: any) => s.section === 'ACHIEVEMENTS_BULLET_POINTS'); return section?.items?.[0]?.data || {}; }
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

  // Handles delete event from relevant-coursework-section
  onDeleteCoursework(index: number) {
    const courseworkList = this.getSectionItems('RELEVANT_COURSEWORK');
    const item = courseworkList[index];
    if (item) {
      this.deleteSectionItem('RELEVANT_COURSEWORK', item);
    }
  }

  // Handles edit event from relevant-coursework-section
  onEditCoursework(index: number) {
    const courseworkList = this.getSectionItems('RELEVANT_COURSEWORK');
    const item = courseworkList[index];
    if (item) {
      this.editSectionHandler('RELEVANT_COURSEWORK', item);
    }
  }

  // Handles move up event from relevant-coursework-section
  onMoveUpCoursework(index: number) {
    // Implementation for moving coursework up
    console.log('Move coursework up:', index);
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

  // Handles edit event from skills section
  onEditSkills() {
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

  // Helper to get items from sections by section name
  getSectionItems(sectionName: string): any[] {
    const section = this.addedSections().find((s: any) => s.section === sectionName);
    return section?.items?.map((i: any) => ({ ...i.data, id: i.data?.id || i.id })) ?? [];
  }
 
  private unloadHandler = (e: BeforeUnloadEvent) => {
    if (this.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };


  ngOnDestroy(): void {
    // this.userStore.setResumeSections([])
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadHandler);
    }
  }

  ngOnInit() {
    console.log('🚀🚀🚀 Resume1TemplateComponent ngOnInit STARTED 🚀🚀🚀');
    this.sidebarIconOnly = this.userStore.getSidebarIconOnly();
    this.sectionStatus = this.userStore.getSectionStatus();
    this.resumeForm = this.userStore.getResumeForm();
    this.selectedResumeListItem = this.userStore.getSelectedResumeListItem();
    console.log('📝 Resume1TemplateComponent initialized. isPreview:', this.isPreview);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.unloadHandler);
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

    // Check if resume is mostly empty and could benefit from sample data
    setTimeout(() => {
      this.checkAndOfferSampleData();
    }, 500); // Add small delay to ensure all data is initialized
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
          this.userStore.deleteProject(selectedJson)
        }
        else if(section === "WORK_EXPERIENCE"){
          this.userStore.deleteExperience(selectedJson)
        }
        else if(section === "CERTIFICATIONS"){
          this.userStore.deleteCertification(selectedJson)
        }
        else if(section == 'ACHIEVEMENT_WITH_DESC'){
          this.userStore.deleteAccomplishment(selectedJson)
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
    else if(section == "PROFILE_SUMMARY"){
      // For profile summary editing, set selectedSummary to the current profile summary section data
      const profileSummarySection = this.getProfileSummarySection();
      this.userStore.setSelectedSummary(profileSummarySection);
      this.userStore.updateSummaryWithData(profileSummarySection);
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
      if (selectedJson === null) {
        this.userStore.setSelectedExperience(new Experience());
      } else {
        this.userStore.setSelectedExperience(selectedJson);
      }
      this.userStore.updateExperience(selectedJson)
    }
    else if(section == "CERTIFICATIONS"){
      this.userStore.setSelectedCertification(selectedJson);
      this.userStore.updateCertification(selectedJson)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      this.userStore.setSelectedAccomplishment(selectedJson)
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
    this.userStore.setResumeSections(sections);
    this.markDirty();
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

  shouldShowButton(sectionType: string, buttonType: string): boolean {
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
    const buttonLogic: { [key: string]: { [key: string]: () => boolean } } = {
      'edit': {
        'EDUCATION': () => false, // Individual items have edit buttons
        'WORK_EXPERIENCE': () => false,
        'PROJECT': () => false,
        'CERTIFICATIONS': () => false,
        'SKILLS_BULLET_POINTS': () => this.hasSkillsBulletPoints(),
        'SKILLS_CATEGORY': () => this.hasSkills(),
        'ACHIEVEMENTS_BULLET_POINTS': () => this.hasAchievements(),
        'default': () => true
      },
      'add': {
        'EDUCATION': () => true, // Always show add for item-based sections
        'WORK_EXPERIENCE': () => true,
        'PROJECT': () => true,
        'CERTIFICATIONS': () => true,
        'SKILLS_BULLET_POINTS': () => !this.hasSkillsBulletPoints(),
        'SKILLS_CATEGORY': () => !this.hasSkills(),
        'ACHIEVEMENTS_BULLET_POINTS': () => !this.hasAchievements(),
        'default': () => true
      },
      'delete': {
        'default': () => isButtonEnabled
      },
      'moveUp': {
        'default': () => isButtonEnabled
      },
      'moveDown': {
        'default': () => isButtonEnabled
      }
    };

    const logic = buttonLogic[buttonType]?.[sectionType] || buttonLogic[buttonType]?.['default'];
    return logic ? logic() : isButtonEnabled;
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
  const achievements = (this.getAchievementBulletPointsSection()?.ach?.length) || 0;
  const coursework = (this.getCourseWorkSection()?.length) || 0;
    console.log('📊 Current Resume Data Status:', {
      contact: {
        name: contact?.data?.fname + ' ' + contact?.data?.lname,
        email: contact?.data?.email_address || contact?.data?.emailId,
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
      this.userStore.setResumeSections(addedSections);
      this.markDirty();
      this.cdr.detectChanges();
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
    return ach?.ach == null || ach?.ach?.length == 0 || ach?.ach == undefined;
  }

  hasAchievements(): boolean {
    const ach = this.getAchievementBulletPointsSection();
    return !!(ach?.ach && ach.ach.trim().length > 0);
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
  let sectionTitle;
  this.addedSections().map((e: any) => {
    if(e.section == section){
      sectionTitle = e.editable_section_title
    }
  })
  return sectionTitle??'Section Title'
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
    const projectItem = projects[index];
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
    this.editSectionHandler('CERTIFICATIONS', certificationItem);
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
    this.editSectionHandler('WORK_EXPERIENCE', experienceItem);
  }

  deleteExperienceItem(experienceItem: any): void {
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
  
}
