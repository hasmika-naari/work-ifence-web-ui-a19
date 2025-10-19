
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AccordionModule } from 'primeng/accordion';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ContactSectionComponent } from '../sections/contact-section.component';
import { ProfileSummarySectionComponent } from '../sections/profile-summary-section.component';
import { EducationSectionComponent } from '../sections/education-section.component';
import { WorkExperienceSectionComponent } from '../sections/work-experience-section.component';
import { ProjectSectionComponent } from '../sections/project-section.component';
import { Injector } from '@angular/core';

import { AchievementBulletPoints, Certification, Education, Experience, IsSectionPresent, ProfileSummary, 
  Project, Resume, ResumeContact, CertificationBulletPoints, SkillV2, Accomplishment, courseWork } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { CdkDragDrop, CdkDragStart, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SectionDesc } from 'src/app/services/store/user-store';
import { IconsModule } from 'src/app/shared/icons.module';
import { CommonModule, NgOptimizedImage } from '@angular/common';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';

interface SectionTemplate {
  section: string;
  htmlTemplate: string;
  hasAddButton: boolean;
  hasEditButton: boolean;
  hasDeleteButton: boolean;
  hasMoveButtons: boolean;
}

const SECTION_COMPONENT_MAP: Record<string, any> = {
  // Map section keys to their corresponding Angular components
  // Extend this map if you add more section components
  CONTACT: ContactSectionComponent,
  PROFILE_SUMMARY: ProfileSummarySectionComponent,
  EDUCATION: EducationSectionComponent,
  WORK_EXPERIENCE: WorkExperienceSectionComponent,
  PROJECT: ProjectSectionComponent
};

@Component({
  selector: 'app-resume1-template',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatTooltipModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, IconsModule, DragDropModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Needed for p-icon web component
})
export class Resume1TemplateComponent implements OnInit, OnDestroy {
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
  ) {}

  getSectionComponent(sectionKey: string) {
    return SECTION_COMPONENT_MAP[sectionKey] || null;
  }

  createSectionInjector(section: SectionDesc) {
    return Injector.create({
      providers: [
        { provide: 'data', useValue: section }
      ],
      parent: this.injector
    });
  }
  sidebarIconOnly!: Signal<boolean>;
  sectionStatus!: Signal<IsSectionPresent>;
  resumeForm!: Signal<Resume>;
  selectedResumeListItem!: Signal<ResumeListDataItem>;
  currentSections!: Signal<SectionDesc[]>;
  

  
  @Output() editSection = new EventEmitter<any>();
  @Output() saveRequested = new EventEmitter<void>();

  @Input() isPreview : boolean = false;
  currentDraggingSection: string = '';
  isDragging : boolean = false

  hasUnsavedChanges = false;
  private unloadHandler = (e: BeforeUnloadEvent) => {
    if (this.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  sections  : string[]= ['CONTACT', 'PROFILE_SUMMARY','EDUCATION','RELEVANT_COURSEWORK', 'SKILLS_BULLET_POINTS', 'SKILLS_CATEGORY', 'WORK_EXPERIENCE', 'PROJECT', 'CERTIFICATIONS', 'ACHIEVEMENTS_BULLET_POINTS']

  sectionsDesc: Array<SectionDesc> = [
    {
      section: 'CONTACT',
      title: 'Contact Information',
      editable_section_title: 'Contact',
      description: 'Your contact details and personal information.',
      isAdded: true,
      isPremium: false,
      tags: 'contact, personal, information',
      label: 'Contact',
      canMoveUp: false,
      canMoveDown: true
    },
    {
      section: 'PROFILE_SUMMARY',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      description: 'A brief summary of your skills and experience.',
      isAdded: true,
      isPremium: false,
      tags: 'summary, profile, objective',
      label: 'Summary',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'EDUCATION',
      title: 'Education',
      editable_section_title: 'Education',
      description: 'Details about your educational background.',
      isAdded: true,
      isPremium: false,
      tags: 'education, school, degree',
      label: 'Education',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'RELEVANT_COURSEWORK',
      title: 'Relevant coursework',
      editable_section_title: 'Relevant Coursework',
      description: 'Relevant coursework you have completed.',
      isAdded: true,
      isPremium: false,
      tags: 'coursework, classes, subjects',
      label: 'Coursework',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'SKILLS_BULLET_POINTS',
      title: 'Skills with bullet points',
      editable_section_title: 'Skills',
      description: 'A list of your skills in bullet points.',
      isAdded: true,
      isPremium: false,
      tags: 'skills, abilities, competencies',
      label: 'Skills (B.P.)',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'SKILLS_CATEGORY',
      title: 'Skills category',
      editable_section_title: 'Skills',
      description: 'Categorized list of your skills.',
      isAdded: false,
      isPremium: false,
      tags: 'skills, categorized, grouped',
      label: 'Skills (Category)',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'WORK_EXPERIENCE',
      title: 'Work experience',
      editable_section_title: 'Experience',
      description: 'Your professional work experience.',
      isAdded: true,
      isPremium: false,
      tags: 'experience, work, job',
      label: 'Experience',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'PROJECT',
      title: 'Project',
      editable_section_title: 'Project',
      description: 'Projects you have worked on.',
      isAdded: true,
      isPremium: false,
      tags: 'projects, portfolio, work',
      label: 'Projects',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'CERTIFICATIONS',
      title: 'Certification',
      editable_section_title: 'Certifications',
      description: 'Your certifications.',
      isAdded: true,
      isPremium: true,
      tags: 'certifications, credentials, qualifications',
      label: 'Certifications',
      canMoveUp: true,
      canMoveDown: true
    },
    {
      section: 'ACHIEVEMENTS_BULLET_POINTS',
      title: 'Achievements with bullet points',
      editable_section_title: 'Achievements',
      description: 'Your achievements in bullet points.',
      isAdded: true,
      isPremium: false,
      tags: 'achievements, accomplishments, awards',
      label: 'Achievements',
      canMoveUp: true,
      canMoveDown: false
    }
  ]

    firstHalfSkills : SkillV2[] = []
    secondHalfSkills : SkillV2[] = []
    
  isSectionsSetCount : number = 1

  // Configuration for section button behavior
  sectionConfig: { [key: string]: SectionTemplate } = {
    'CONTACT': { section: 'CONTACT', htmlTemplate: '', hasAddButton: false, hasEditButton: true, hasDeleteButton: false, hasMoveButtons: false },
    'PROFILE_SUMMARY': { section: 'PROFILE_SUMMARY', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'EDUCATION': { section: 'EDUCATION', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'WORK_EXPERIENCE': { section: 'WORK_EXPERIENCE', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'PROJECT': { section: 'PROJECT', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'SKILLS_BULLET_POINTS': { section: 'SKILLS_BULLET_POINTS', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'SKILLS_CATEGORY': { section: 'SKILLS_CATEGORY', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'CERTIFICATIONS': { section: 'CERTIFICATIONS', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'ACHIEVEMENTS_BULLET_POINTS': { section: 'ACHIEVEMENTS_BULLET_POINTS', htmlTemplate: '', hasAddButton: true, hasEditButton: true, hasDeleteButton: true, hasMoveButtons: true },
    'RELEVANT_COURSEWORK': { section: 'RELEVANT_COURSEWORK', htmlTemplate: '', hasAddButton: true, hasEditButton: false, hasDeleteButton: true, hasMoveButtons: true }
  };

  // Removed duplicate constructor implementation. Move effect logic to ngOnInit below.

  ngOnDestroy(): void {
    // this.userStore.setResumeSections([])
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadHandler);
    }
  }

  ngOnInit() {
    this.sidebarIconOnly = this.userStore.getSidebarIconOnly();
    this.sectionStatus = this.userStore.getSectionStatus();
    this.resumeForm = this.userStore.getResumeForm();
    this.selectedResumeListItem = this.userStore.getSelectedResumeListItem();
    this.currentSections = this.userStore.getCurrentSections();

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

    // Ensure default sections are set if currentSections is empty
    if (!this.currentSections() || this.currentSections().length === 0) {
      this.userStore.setResumeSections(this.sectionsDesc);
    }

    if(this.resumeForm().skill_v2?.length>0){
      this.firstHalfSkills = [...this.resumeForm().skill_v2.slice(0, Math.ceil(this.resumeForm().skill_v2?.length/2))]
      this.secondHalfSkills = [...this.resumeForm().skill_v2.slice(Math.ceil(this.resumeForm().skill_v2?.length/2),)]
    }

    // Section and unsaved change state logic from previous constructor
    effect(() => {
      if(this.resumeForm()?.sections?.length>0 && this.isSectionsSetCount == 1 && this.currentSections()?.length == 0){
        this.sections = []
        this.resumeForm().sections.map((e : SectionDesc)=>{
          this.sections = [...this.sections, e.section]
        })
        this.userStore.setResumeSections(this.resumeForm().sections)
        this.isSectionsSetCount = this.isSectionsSetCount + 1
      }
      else if(this.currentSections()?.length == 0){
        this.updateSectionVisibilityFlags(this.sectionsDesc);
        this.userStore.setResumeSections(this.sectionsDesc)
      }
      else if(this.currentSections()?.length !== this.sections?.length){
        // Case 1: currentSections has more items than this.sections (sections were added to store)
        if(this.currentSections()?.length > this.sections?.length) {
          this.sections = []
          this.currentSections().map((e : SectionDesc)=>{
            this.sections = [...this.sections, e.section]
          })
        }
        // Case 2: this.sections has more items than currentSections (sections were added from left menu)
        else if(this.sections?.length > this.currentSections()?.length) {
          const currentSections = this.currentSections();
          const newSections: SectionDesc[] = [];
          this.sections.forEach(sectionKey => {
            // Check if section already exists in current sections
            let existingSection = currentSections.find(s => s.section === sectionKey);
            if (existingSection) {
              newSections.push(existingSection);
            } else {
              // Find template from sectionsDesc and add it
              const template = this.sectionsDesc.find(s => s.section === sectionKey);
              if (template) {
                newSections.push({ ...template });
              }
            }
          });
          // Update visibility flags and store
          this.updateSectionVisibilityFlags(newSections);
          this.userStore.setResumeSections(newSections);
          console.log('Updated sectionsDesc from sections array change:', newSections);
        }
      }
      console.log(this.currentSections());

      let skills = this.resumeForm().skill_v2
      if(skills?.length>0){
        this.firstHalfSkills = [...skills.slice(0, Math.ceil(skills?.length/2))]
        this.secondHalfSkills = [...skills.slice(Math.ceil(skills?.length/2),)]
      }
    })

    // Reflect global unsaved-change state (e.g., edits from left-side forms)
    effect(() => {
      const changedSignal = this.userStore.getIsChangeInNewResume?.();
      const changed = typeof changedSignal === 'function' ? !!changedSignal() : false;
      this.hasUnsavedChanges = changed || this.hasUnsavedChanges; // preserve true until explicit save
    });

    // Check if resume is mostly empty and could benefit from sample data
    setTimeout(() => {
      this.checkAndOfferSampleData();
    }, 500); // Add small delay to ensure all data is initialized
  }

  // Check if resume is empty and auto-populate with sample data
  checkAndOfferSampleData(): void {
    const resume = this.resumeForm();
    
    console.log('🔍 Checking resume data:', {
      hasName: !!resume.contact?.fname,
      isDefaultContact: resume.contact?.isDefaultData,
      hasProfile: !!resume.profileSummary?.profile_summary,
      isDefaultProfile: resume.profileSummary?.isDefault,
      sectionsCount: {
        education: resume.education?.length || 0,
        experience: resume.experience?.length || 0,
        projects: resume.project?.length || 0,
        certifications: resume.certification?.length || 0,
        skills: resume.skill_v2?.length || 0
      },
      isPreview: this.isPreview
    });

    const isEmpty = (!resume.contact.fname || resume.contact.isDefaultData) &&
                   (!resume.profileSummary.profile_summary || resume.profileSummary.isDefault) &&
                   resume.education.length === 0 &&
                   resume.experience.length === 0 &&
                   resume.project.length === 0;
    
  if (isEmpty && !this.isPreview) {
      console.log('🔄 Auto-populating resume with realistic sample data...');
      this.loadSampleResumeData();
      
      // Verify sample data was loaded after a brief delay
      setTimeout(() => {
        const updatedResume = this.resumeForm();
        console.log('✅ Sample data loaded:', {
          name: updatedResume.contact?.fname + ' ' + (updatedResume.contact?.lname || ''),
          email: updatedResume.contact?.email,
          hasProfile: !!updatedResume.profileSummary?.profile_summary,
          education: updatedResume.education?.length || 0,
          experience: updatedResume.experience?.length || 0
        });
        this.cdr.detectChanges(); // Force change detection
      }, 300);
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
      let index = this.resumeForm().accomplishment.findIndex(obj => obj.id === selectedJson.id)
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
      let index = this.resumeForm().accomplishment.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateAccomplishmentItem(selectedJson, index);
    }
    this.markDirty();
  }

  addSectionHandler(section : string){
    if(section === "CONTACT"){
      // Load sample contact data if not already present
      if (!this.isContactDefaultData()) {
        this.userStore.addContact(this.createSampleContact());
      }
    }
    else if(section === "PROFILE_SUMMARY"){
      this.userStore.addSummary(this.createSampleProfileSummary());
    }
    else if(section === "EDUCATION"){
      this.userStore.addEducationItem(this.createSampleEducation())
    }
    else if(section === "PROJECT"){
      // Set up add mode: clear selected project and set to add mode
      this.userStore.setProject(new Project());
      // You may need to add updateProjectAddMode() if it exists in the store
      console.log('Adding new project - set to add mode with empty form');
    }
    else if(section === "WORK_EXPERIENCE"){
      // Set up add mode: clear selected experience and set isEdit to false
      this.userStore.setExperience(new Experience());
      this.userStore.updateExperienceAddMode();
      console.log('Adding new work experience - set to add mode with empty form');
    }
    else if(section === "CERTIFICATIONS"){
      // Set up add mode: clear selected certification and set to add mode
      this.userStore.setCertification(new Certification());
      console.log('Adding new certification - set to add mode with empty form');
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      this.userStore.setSelectedAccomplishment(new Accomplishment());
    }
    else if(section === "ACHIEVEMENTS_BULLET_POINTS"){
      // Sample achievements will be handled in the comprehensive data loading
      console.log('Sample achievements section added');
    }
    else if(section === "RELEVANT_COURSEWORK"){
      // Sample coursework will be handled in the comprehensive data loading
      console.log('Sample coursework section added');
    }
    else if(section === "SKILLS_BULLET_POINTS"){
      this.userStore.addSkillV2(this.createMultipleSampleSkills());
    }

    // Add the section to the live sections list so it appears in the template
    this.addNewSectionToArray(section);

    this.markDirty();
    this.cdr.detectChanges();
    this.editSection.emit({section : section})
  }

  editSectionHandler(section : string, selectedJson : any){
    if(section == "CONTACT"){
      // For contact editing, we set the edit state
      // The current contact data will be automatically loaded in the contact component
      this.userStore.updateContact();
    }
    else if(section == "EDUCATION"){
      this.userStore.updateEducation(selectedJson)
    }
    else if(section == "RELEVANT_COURSEWORK"){
      this.userStore.updateCourseWork(selectedJson)
    }
    else if(section == "PROJECT"){
      this.userStore.updateProject(selectedJson)
    }
    else if(section == "WORK_EXPERIENCE"){
      this.userStore.updateExperience(selectedJson)
    }
    else if(section == "CERTIFICATIONS"){
      this.userStore.updateCertification(selectedJson)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      this.userStore.setSelectedAccomplishment(selectedJson)
    }
    this.markDirty();
    this.editSection.emit({section : section})
  }

  // Item-level edit and delete methods for experience
  editExperienceItem(index: number): void {
    const experienceItem = this.resumeForm().experience[index];
    this.editSectionHandler('WORK_EXPERIENCE', experienceItem);
  }

  deleteExperienceItem(index: number): void {
    const experienceItem = this.resumeForm().experience[index];
    this.confirmDeleteItemDialog('WORK_EXPERIENCE', experienceItem);
  }

  checkEducationCondition(){
      return this.resumeForm().education.filter(obj => obj.isHideSelected === false)?.length > 0
  }

  checkProjectCondition(){
    return this.resumeForm().project.filter(obj => obj.isHideSelected === false)?.length > 0
  }

  checkExperienceCondition(){
    return this.resumeForm().experience.filter(obj => obj.isHideSelected === false)?.length > 0
  }

  checkCertificationCondition(){
    return this.resumeForm().certification.filter(obj => obj.isHideSelected === false)?.length > 0
  }



  moveObjectById(section: string, id: string, direction: "up" | "down"): void {
  if(section === "EDUCATION"){
    const array = this.resumeForm().education;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateEducationList(array);
    this.markDirty();
  }
  else if(section === "PROJECT"){
    const array = this.resumeForm().project;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateProjectList(array);
    this.markDirty();
  }
  else if(section === "WORK_EXPERIENCE"){
    const array = this.resumeForm().experience;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateExperienceList(array);
    this.markDirty();
  }
  else if(section === "CERTIFICATIONS"){
    const array = this.resumeForm().certification;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateCertificationList(array);
    this.markDirty();
  }
  else if(section === "ACHIEVEMENT_WITH_DESC"){
    const array = this.resumeForm().accomplishment;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateAccomplishmentList(array);
    this.markDirty();
  }

}

removeSection(section : string){
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {name: 'confirm'},
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result.event === "CONFIRM"){
        let status = this.sectionStatus()
        let resume = this.resumeForm()
        if(section === "PROFILE_SUMMARY"){
          resume.profileSummary = new ProfileSummary()
          status.isSummary = false;
        }
        else if(section === "RELEVANT_COURSEWORK"){
          resume.courseWork = []
          status.isCourseWork = false;
        }
        else if(section === "SKILLS_BULLET_POINTS"){
          resume.skill = []
          status.isSkill = false;
        }
        else if(section === "EDUCATION"){
          resume.education = []
          status.isEducation = false;
        }
        else if(section === "PROJECT"){
          resume.project = []
          status.isProject = false;
        }
        else if(section === "WORK_EXPERIENCE"){
          resume.experience = []
          status.isExperience = false;
        }
        else if(section === "CERTIFICATIONS"){
          resume.certification = []
          status.isCertification = false
        }
        else if(section === "ACHIEVEMENTS_BULLET_POINTS"){
          resume.achievementBulletPoints = new AchievementBulletPoints()
          status.isAchievement = false
        }
        else if(section === "CERTIFICATIONS_BULLET_POINTS"){
          resume.certificationBulletPoints = new CertificationBulletPoints();
        }
        else if(section === "ACHIEVEMENT_WITH_DESC"){
          resume.accomplishment = [];
          status.isAccomplishments = false;
        }
        this.userStore.removeSection(section);
        this.userStore.updateResumeForm(resume);
        this.markDirty();
        // Update section visibility flags after removing
        this.refreshSectionVisibilityFlags();
      }
  })
}

drop(event: CdkDragDrop<SectionDesc[]>) {
  console.log("Before: ", this.currentSections(), event.previousIndex, event.currentIndex);
  
  if (event.previousIndex !== event.currentIndex) {
    this.userStore.reorderSections(event.previousIndex, event.currentIndex);
    console.log("After: ",this.currentSections(), event.previousIndex, event.currentIndex);
    
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

  private syncSectionsToStore() {
    let formattedSections: SectionDesc[] = [];
    this.sections.forEach((e) => {
      const found = this.currentSections().filter((s) => s.section === e);
      formattedSections = [...formattedSections, ...found];
    });
    this.updateSectionVisibilityFlags(formattedSections);
    this.userStore.setResumeSections(formattedSections);
    this.cdr.detectChanges();
  }

  private updateSectionVisibilityFlags(sections: SectionDesc[]) {
    sections.forEach((section, index) => {
      section.canMoveUp = index > 0;
      section.canMoveDown = index < sections.length - 1;
    });
  }

  private refreshSectionVisibilityFlags() {
    const currentSections = this.currentSections();
    this.updateSectionVisibilityFlags(currentSections);
    this.userStore.setResumeSections([...currentSections]); // Trigger update
  }

  // Template management helper methods
  getSectionTemplate(sectionType: string): SectionTemplate | null {
    return this.sectionConfig[sectionType] || null;
  }

  shouldShowSection(sectionType: string): boolean {
    const currentSections = this.currentSections();
    const sectionDesc = currentSections.find(desc => desc.section === sectionType);
    return sectionDesc ? sectionDesc.isAdded : false;
  }

  // Helper method to check if education section has data
  hasEducationData(): boolean {
    return this.resumeForm().education?.length > 0;
  }

  hasExperienceData(): boolean {
    return this.resumeForm().experience?.length > 0;
  }

  // Helper method to check if education section is empty
  isEducationEmpty(): boolean {
    return !this.hasEducationData();
  }

  shouldShowAddButton(sectionType: string): boolean {
    const template = this.getSectionTemplate(sectionType);
    if (!template || !template.hasAddButton) return false;
    
    // Special logic for EDUCATION: always show add button at header level to add new items
    if (sectionType === 'EDUCATION') {
      return true;
    }
    
    // Special logic for WORK_EXPERIENCE: always show add button at header level to add new items
    if (sectionType === 'WORK_EXPERIENCE') {
      return true;
    }
    
    // Special logic for PROJECT: always show add button at header level to add new items
    if (sectionType === 'PROJECT') {
      return true;
    }
    
    // Special logic for CERTIFICATIONS: always show add button at header level to add new items
    if (sectionType === 'CERTIFICATIONS') {
      return true;
    }
    
    // Special logic for SKILLS_BULLET_POINTS: show add button only when empty
    if (sectionType === 'SKILLS_BULLET_POINTS') {
      return !this.hasSkillsBulletPoints();
    }
    
    // Special logic for SKILLS_CATEGORY: show add button only when empty
    if (sectionType === 'SKILLS_CATEGORY') {
      return !this.hasSkills();
    }
    
    // Special logic for ACHIEVEMENTS_BULLET_POINTS: show add button only when empty
    if (sectionType === 'ACHIEVEMENTS_BULLET_POINTS') {
      return !this.hasAchievements();
    }
    
    return true;
  }

  shouldShowEditButton(sectionType: string): boolean {
    const template = this.getSectionTemplate(sectionType);
    if (!template || !template.hasEditButton) return false;
    
    // Special logic for EDUCATION: don't show edit button at header level (individual items will have edit buttons)
    if (sectionType === 'EDUCATION') {
      return false;
    }
    
    // Special logic for WORK_EXPERIENCE: don't show edit button at header level (individual items will have edit buttons)
    if (sectionType === 'WORK_EXPERIENCE') {
      return false;
    }
    
    // Special logic for PROJECT: don't show edit button at header level (individual items will have edit buttons)
    if (sectionType === 'PROJECT') {
      return false;
    }
    
    // Special logic for CERTIFICATIONS: don't show edit button at header level (individual items will have edit buttons)
    if (sectionType === 'CERTIFICATIONS') {
      return false;
    }
    
    // Special logic for SKILLS_BULLET_POINTS: show edit button only when has content
    if (sectionType === 'SKILLS_BULLET_POINTS') {
      return this.hasSkillsBulletPoints();
    }
    
    // Special logic for SKILLS_CATEGORY: show edit button only when has content
    if (sectionType === 'SKILLS_CATEGORY') {
      return this.hasSkills();
    }
    
    // Special logic for ACHIEVEMENTS_BULLET_POINTS: show edit button only when has content
    if (sectionType === 'ACHIEVEMENTS_BULLET_POINTS') {
      return this.hasAchievements();
    }
    
    return true;
  }

  shouldShowDeleteButton(sectionType: string): boolean {
    const template = this.getSectionTemplate(sectionType);
    return template ? template.hasDeleteButton : false;
  }

  shouldShowMoveButtons(sectionType: string): boolean {
    const template = this.getSectionTemplate(sectionType);
    return template ? template.hasMoveButtons : false;
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

  // Sample data generators for realistic content
  createSampleEducation(): Education {
    const education = new Education();
    education.id = this.generateId();
    education.degree = "Bachelor of Science";
    education.field_of_study = "Computer Science";
    education.school_name = "Stanford University";
    education.school_location = "Stanford, CA";
    education.graduation_date = "May 2021"; // Month and year format only
    education.gpa = "3.85";
    education.isDefault = false;
    education.isHideSelected = false;
    return education;
  }

  // Create additional sample education for demonstration
  createAdditionalSampleEducation(): Education {
    const education = new Education();
    education.id = this.generateId();
    education.degree = "Master of Science";
    education.field_of_study = "Data Science";
    education.school_name = "MIT";
    education.school_location = "Cambridge, MA";
    education.graduation_date = "Dec 2023"; // Month and year format only
    education.gpa = "3.92";
    education.isDefault = false;
    education.isHideSelected = false;
    return education;
  }

  createSampleProject(): Project {
    const project = new Project();
    project.id = this.generateId();
    project.project_name = "E-commerce Web Application";
    project.project_link = "https://github.com/johndoe/ecommerce-app";
    project.period = "Jan 2023 - Mar 2023";
    project.description = "• Built responsive e-commerce platform serving 10,000+ active users with React and TypeScript\n• Implemented secure payment processing with Stripe integration and fraud detection\n• Developed real-time inventory management system with automated stock alerts\n• Optimized database queries and caching strategies, reducing page load time by 40%\n• Integrated third-party APIs for shipping, tax calculation, and customer reviews";
    project.technologies_used = "React, TypeScript, Node.js, MongoDB, Express.js, Stripe API, Redis, AWS";
    project.isHideSelected = false;
    project.bullet_points_count = "5";
    project.original_description_html = "<ul><li>Built responsive e-commerce platform serving 10,000+ active users with React and TypeScript</li><li>Implemented secure payment processing with Stripe integration and fraud detection</li><li>Developed real-time inventory management system with automated stock alerts</li><li>Optimized database queries and caching strategies, reducing page load time by 40%</li><li>Integrated third-party APIs for shipping, tax calculation, and customer reviews</li></ul>";
    return project;
  }

  createSampleExperience(): Experience {
    const experience = new Experience();
    experience.id = this.generateId();
    experience.position_title = "Senior Software Developer";
    experience.company_name = "Tech Solutions Inc.";
    experience.location = "San Francisco, CA";
    experience.start_date = "Jun 2023";
    experience.end_date = "Present";
    experience.description = "• Led development of 8+ scalable web applications using React, TypeScript, and Node.js serving 50K+ users\n• Architected microservices infrastructure on AWS, improving system reliability by 45% and reducing deployment time by 60%\n• Implemented automated CI/CD pipelines with Jenkins and Docker, enabling daily deployments with zero downtime\n• Reduced application load time by 35% through code optimization, lazy loading, and performance monitoring\n• Mentored team of 4 junior developers on coding standards, code reviews, and modern development practices\n• Collaborated with product managers and UX designers to deliver user-centric features ahead of schedule";
    experience.isCurrentlyWorkHere = true;
    experience.isHideSelected = false;
    experience.bullet_points_count = "6";
    experience.original_description_html = "<ul><li>Led development of 8+ scalable web applications using React, TypeScript, and Node.js serving 50K+ users</li><li>Architected microservices infrastructure on AWS, improving system reliability by 45% and reducing deployment time by 60%</li><li>Implemented automated CI/CD pipelines with Jenkins and Docker, enabling daily deployments with zero downtime</li><li>Reduced application load time by 35% through code optimization, lazy loading, and performance monitoring</li><li>Mentored team of 4 junior developers on coding standards, code reviews, and modern development practices</li><li>Collaborated with product managers and UX designers to deliver user-centric features ahead of schedule</li></ul>";
    return experience;
  }

  createSampleCertification(): Certification {
    const certification = new Certification();
    certification.id = this.generateId();
    certification.certification_name = "AWS Certified Solutions Architect - Professional";
    certification.issued_organisation = "Amazon Web Services (AWS)";
    certification.certification_link = "https://aws.amazon.com/certification/certified-solutions-architect-professional/";
    certification.issued_month = "December";
    certification.issued_year = "2024";
    certification.isHideSelected = false;
    return certification;
  }

  createSampleSkill(): SkillV2 {
    const skill = new SkillV2();
    skill.sub_title = "Programming Languages";
    skill.skills = ["JavaScript", "Python", "Java", "TypeScript"];
    return skill;
  }

  createMultipleSampleSkills(): SkillV2[] {
    return [
      {
        sub_title: "Programming Languages",
        skills: ["JavaScript", "Python", "Java", "TypeScript", "C#", "Go"]
      },
      {
        sub_title: "Frontend Technologies",
        skills: ["React", "Angular", "Vue.js", "HTML5", "CSS3", "SCSS", "Bootstrap", "Tailwind CSS"]
      },
      {
        sub_title: "Backend & APIs",
        skills: ["Node.js", "Express.js", "ASP.NET Core", "Spring Boot", "FastAPI", "GraphQL", "REST APIs"]
      },
      {
        sub_title: "Databases & Storage",
        skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "DynamoDB", "Elasticsearch"]
      },
      {
        sub_title: "Cloud & DevOps",
        skills: ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform"]
      },
      {
        sub_title: "Tools & Frameworks",
        skills: ["Git", "Webpack", "Vite", "Jest", "Cypress", "Postman", "VS Code", "IntelliJ IDEA"]
      }
    ] as SkillV2[];
  }

  createSampleProfileSummary(): ProfileSummary {
    const profile = new ProfileSummary();
    profile.profile_summary = "Innovative Senior Software Developer with 4+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable web applications serving 100K+ users using React, TypeScript, Node.js, and AWS. Specialized in microservices architecture, performance optimization, and agile development practices. Passionate about mentoring teams, implementing best practices, and driving technical excellence to deliver business-critical solutions that exceed user expectations.";
    profile.position_highlight = "Senior Full-Stack Developer & Technical Lead";
    profile.skills_highlight = "React, TypeScript, Node.js, AWS, Microservices, Team Leadership";
    profile.isDefault = false;
    profile.isHideSelected = false;
    profile.original_summary_html = "<p>Innovative Senior Software Developer with 4+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable web applications serving 100K+ users using React, TypeScript, Node.js, and AWS.</p>";
    return profile;
  }

  createSampleContact(): ResumeContact {
    const contact = new ResumeContact();
    contact.fname = "Alexandra";
    contact.lname = "Rodriguez";
    contact.subTitle = "Senior Full-Stack Developer & Technical Lead";
    contact.role = "Senior Software Developer";
    contact.email = "alexandra.rodriguez@email.com";
    contact.phone_number = "+1 (415) 789-0123";
    contact.address = "San Francisco, CA";
    contact.linkedIn_profile = "https://linkedin.com/in/alexrodriguez-dev";
    contact.github_profile = "https://github.com/alexrodriguez-dev";
    contact.portfolio_link = "https://alexrodriguez.dev";
    contact.linkedIn_profile_display_name = "alexrodriguez-dev";
    contact.github_profile_display_name = "alexrodriguez-dev";
    contact.isDefaultData = false;
    contact.isHideSelected = false;
    return contact;
  }

  createSampleAchievements(): string[] {
    return [
      "Led cross-functional team of 8 engineers to deliver enterprise-scale application 3 weeks ahead of schedule, resulting in $2M+ cost savings",
      "Architected microservices infrastructure that improved system scalability by 300% and reduced deployment downtime by 95%",
      "Implemented automated testing framework that increased code coverage from 45% to 92% and reduced production bugs by 60%",
      "Received 'Technical Innovation Award' for developing AI-powered optimization tool that increased team productivity by 35%",
      "Mentored 6 junior developers, with 100% promotion rate within 18 months and consistent top performance ratings"
    ];
  }

  createSampleCoursework(): courseWork[] {
    const courseData = [
      { name: "Advanced Data Structures & Algorithms", institution: "Stanford University" }
    ];
    
    return courseData.map((data, index) => {
      const course = new courseWork();
      course.id = index + 1;
      course.courseworkname = data.name;
      course.institution = data.institution;
      return course;
    });
  }

  createAdditionalSampleProject(): Project {
    const project = new Project();
    project.id = this.generateId();
    project.project_name = "Real-time Chat Application";
    project.project_link = "https://github.com/alexrodriguez-dev/chat-app";
    project.period = "Aug 2023 - Oct 2023";
    project.description = "• Built scalable real-time chat application supporting 5,000+ concurrent users with Socket.io and React\n• Implemented end-to-end encryption for secure messaging and file sharing capabilities\n• Developed message search functionality with Elasticsearch, improving search speed by 70%\n• Created responsive mobile-first UI with React Native for iOS and Android platforms\n• Integrated push notifications and offline message synchronization features";
    project.technologies_used = "React, React Native, Node.js, Socket.io, MongoDB, Elasticsearch, Redis, AWS";
    project.isHideSelected = false;
    project.bullet_points_count = "5";
    project.original_description_html = "<ul><li>Built scalable real-time chat application supporting 5,000+ concurrent users with Socket.io and React</li><li>Implemented end-to-end encryption for secure messaging and file sharing capabilities</li><li>Developed message search functionality with Elasticsearch, improving search speed by 70%</li><li>Created responsive mobile-first UI with React Native for iOS and Android platforms</li><li>Integrated push notifications and offline message synchronization features</li></ul>";
    return project;
  }

  createAdditionalSampleExperience(): Experience {
    const experience = new Experience();
    experience.id = this.generateId();
    experience.position_title = "Full-Stack Developer";
    experience.company_name = "InnovateTech Solutions";
    experience.location = "Remote";
    experience.start_date = "Jan 2022";
    experience.end_date = "May 2023";
    experience.description = "•Developed and deployed 12+ responsive web applications using React, Angular, and Vue.js for diverse client base\n• Built robust REST APIs and GraphQL services with Node.js, serving 25K+ daily active users\n• Implemented automated testing suites achieving 95% code coverage and reducing manual testing time by 80%\n• Optimized database performance and queries, resulting in 50% faster page load times across all applications\n• Collaborated with international remote teams across 4 time zones using Agile/Scrum methodologies";
    experience.isCurrentlyWorkHere = false;
    experience.isHideSelected = false;
    experience.bullet_points_count = "5";
    experience.original_description_html = "<ul><li>Developed and deployed 12+ responsive web applications using React, Angular, and Vue.js for diverse client base</li><li>Built robust REST APIs and GraphQL services with Node.js, serving 25K+ daily active users</li><li>Implemented automated testing suites achieving 95% code coverage and reducing manual testing time by 80%</li><li>Optimized database performance and queries, resulting in 50% faster page load times across all applications</li><li>Collaborated with international remote teams across 4 time zones using Agile/Scrum methodologies</li></ul>";
    return experience;
  }

  createAdditionalSampleCertification(): Certification {
    const certification = new Certification();
    certification.id = this.generateId();
    certification.certification_name = "Google Cloud Professional Developer";
    certification.issued_organisation = "Google Cloud";
    certification.certification_link = "https://cloud.google.com/certification/cloud-developer";
    certification.issued_month = "August";
    certification.issued_year = "2024";
    certification.isHideSelected = false;
    return certification;
  }

  // Initialize entire resume with realistic sample data
  loadSampleResumeData() {
    try {
      console.log('🔄 Loading comprehensive sample resume data...');
      
      // Add sample contact info
      this.userStore.setContact(this.createSampleContact());
      
      // Add sample profile summary
      this.userStore.setSummary(this.createSampleProfileSummary());
      
      // Add sample education entry (single item) - using setEducationList with array
      this.userStore.setEducationList([this.createSampleEducation()]);
      
      // Add sample work experience
      this.userStore.setExperience(this.createSampleExperience());
      
      // Add sample projects
      this.userStore.setProject(this.createSampleProject());
      this.userStore.setProject(this.createAdditionalSampleProject());
      
      // Add additional experience
      this.userStore.setExperience(this.createAdditionalSampleExperience());
      
      // Add sample certifications
      this.userStore.setCertification(this.createSampleCertification());
      this.userStore.setCertification(this.createAdditionalSampleCertification());
      
      // Add sample skills with multiple categories
      this.userStore.setSkillV2(this.createMultipleSampleSkills());
      
      // Add sample skills bullet points
      this.populateSampleSkillsBulletPoints();
      
      // Add sample achievements
      this.populateSampleAchievements();
      
      // Add sample coursework
      this.populateSampleCoursework();
      
      // Force update skills display
      if(this.resumeForm().skill_v2?.length > 0){
        this.firstHalfSkills = [...this.resumeForm().skill_v2.slice(0, Math.ceil(this.resumeForm().skill_v2?.length/2))]
        this.secondHalfSkills = [...this.resumeForm().skill_v2.slice(Math.ceil(this.resumeForm().skill_v2?.length/2))]
      }
      
      // Ensure section visibility is updated
      this.refreshSectionVisibilityFlags();
      
      // Reset change flag since this is initialization, not user changes
      this.userStore.setIsChangeInNewResume(false);
      this.cdr.detectChanges();
      
      console.log('✅ Sample resume data loaded successfully!');
      console.log('📊 Loaded data includes:', {
        contact: !!this.resumeForm().contact.fname,
        summary: !!this.resumeForm().profileSummary.profile_summary,
        education: this.resumeForm().education.length,
        experience: this.resumeForm().experience.length,
        projects: this.resumeForm().project.length,
        certifications: this.resumeForm().certification.length,
        skills: this.resumeForm().skill_v2.length
      });
      
    } catch (error) {
      console.error('❌ Error loading sample data:', error);
    }
  }

  // Add sample data methods for other sections  
  addSampleData() {
    // Initialize with sample contact data
    this.userStore.setContact(this.createSampleContact());
    
    // Initialize with sample profile summary
    this.userStore.setSummary(this.createSampleProfileSummary());
    
    // Reset change flag since this is initialization, not user changes
    this.userStore.setIsChangeInNewResume(false);
  }

  // Sample data for achievements and coursework
  populateSampleAchievements(): void {
    // Based on the Resume model, achievementBulletPoints seems to be a single object with an array
    const resume = this.resumeForm();
    if (!resume.achievementBulletPoints.ach || resume.achievementBulletPoints.ach.length === 0) {
      // Try to update achievements if there's a method available
      console.log('Adding sample achievements...');
      // This would need the proper store method, for now we'll log the sample data
      const sampleAchievements = [
        "Led a cross-functional team of 8 members to deliver a $2M project 3 weeks ahead of schedule",
        "Increased team productivity by 45% through implementation of Agile methodologies",
        "Received 'Project Manager of the Year' award for outstanding leadership and delivery",
        "Successfully managed 15+ concurrent projects with 98% on-time delivery rate"
      ];
      console.log('Sample achievements:', sampleAchievements);
    }
  }

  populateSampleCoursework(): void {
    const resume = this.resumeForm();
    if (!resume.courseWork || resume.courseWork.length === 0) {
      console.log('Adding sample coursework...');
      const sampleCourses = this.createSampleCoursework();
      this.userStore.setCourseWorkList(sampleCourses);
    }
  }

  populateSampleSkillsBulletPoints(): void {
    const resume = this.resumeForm();
    if (!resume.skillsBulletPoints || resume.skillsBulletPoints.length === 0) {
      console.log('Adding sample skills bullet points...');
      const sampleSkills = this.createSampleSkillsBulletPoints();
      this.userStore.setSkillsBulletPoints(sampleSkills);
    }
  }

  createSampleSkillsBulletPoints(): string[] {
    return [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Node.js', 
      'Python', 'Java', 'HTML/CSS', 'MongoDB', 'PostgreSQL',
      'AWS', 'Docker', 'Git', 'Agile/Scrum', 'REST APIs'
    ];
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public method to manually load sample data (can be called from console or UI)
  public loadSampleData(): void {
    console.log('🎯 Manually loading sample resume data...');
    this.loadSampleResumeData();
  }

  // Public method to check current resume data status
  public checkDataStatus(): void {
    const resume = this.resumeForm();
    console.log('📊 Current Resume Data Status:', {
      contact: {
        name: resume.contact.fname + ' ' + resume.contact.lname,
        email: resume.contact.email,
        hasDefaultData: resume.contact.isDefaultData
      },
      profileSummary: {
        hasContent: !!resume.profileSummary.profile_summary,
        isDefault: resume.profileSummary.isDefault,
        length: resume.profileSummary.profile_summary?.length || 0
      },
      sections: {
        education: resume.education.length,
        experience: resume.experience.length,
        projects: resume.project.length,
        certifications: resume.certification.length,
        skills: resume.skill_v2.length,
        achievements: resume.achievementBulletPoints?.ach?.length || 0,
        coursework: resume.courseWork?.length || 0
      }
    });
  }

  // Force load sample data for debugging
  public forceLoadSampleData(): void {
    console.log('🚀 Force loading all sample data...');
    this.loadSampleResumeData();
    
    // Check data after loading
    setTimeout(() => {
      const updatedResume = this.resumeForm();
      console.log('✅ Data after force load:', {
        contact: updatedResume.contact,
        profileSummary: updatedResume.profileSummary.profile_summary?.substring(0, 100) + '...',
        education: updatedResume.education.length,
        experience: updatedResume.experience.length,
        projects: updatedResume.project.length
      });
    }, 100);
  }

  moveSectionUp(section: string) {
  const idx = this.sections.indexOf(section);
  if (idx > 0) {
    [this.sections[idx - 1], this.sections[idx]] = [this.sections[idx], this.sections[idx - 1]];
    this.syncSectionsToStore(); // This automatically updates visibility flags
    this.markDirty();
    this.cdr.detectChanges();
  }
}

moveSectionDown(section: string) {
  const idx = this.sections.indexOf(section);
  if (idx > -1 && idx < this.sections.length - 1) {
    [this.sections[idx], this.sections[idx + 1]] = [this.sections[idx + 1], this.sections[idx]];
    this.syncSectionsToStore(); // This automatically updates visibility flags
    this.markDirty();
    this.cdr.detectChanges();
  }
}

  canMoveUp(section: string): boolean {
    const sectionData = this.getSectionData(section);
    return sectionData?.canMoveUp ?? false;
  }

  canMoveDown(section: string): boolean {
    const sectionData = this.getSectionData(section);
    return sectionData?.canMoveDown ?? false;
  }

  getSectionData(sectionKey: string): SectionDesc | undefined {
    return this.currentSections().find(s => s.section === sectionKey);
  }

  private addNewSectionToArray(sectionKey: string) {
    // Find the section description from the initial sectionsDesc array
    const sectionTemplate = this.sectionsDesc.find(s => s.section === sectionKey);
    if (sectionTemplate) {
      const currentSections = this.currentSections();
      
      // Check if section already exists in current sections
      const existingIndex = currentSections.findIndex(s => s.section === sectionKey);
      
      if (existingIndex === -1) {
        // Create a new section with proper flags
        const newSection: SectionDesc = {
          ...sectionTemplate,
          canMoveUp: true,
          canMoveDown: false // New section becomes the last
        };
        
        // Update the current sections by adding to the end
        const updatedSections = [...currentSections, newSection];
        this.updateSectionVisibilityFlags(updatedSections);
        
        // Update store - this should trigger the effect to update this.sections
        this.userStore.setResumeSections(updatedSections);
        
        console.log(`Added section ${sectionKey} to sectionsDesc array`, updatedSections);
        console.log(`Current sections length: ${currentSections.length}, Updated length: ${updatedSections.length}`);
      } else {
        console.log(`Section ${sectionKey} already exists, updating flags only`);
        // Section exists, just update flags
        this.updateSectionVisibilityFlags(currentSections);
        this.userStore.setResumeSections([...currentSections]);
      }
    } else {
      console.warn(`Section template not found for: ${sectionKey}`);
    }
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
  return this.resumeForm().contact?.fname?.length>0 || this.resumeForm().contact?.lname?.length>0 || this.resumeForm().contact?.subTitle?.length>0 || this.resumeForm().contact?.phone_number?.length>0
  || this.resumeForm().contact?.email?.length>0 || this.resumeForm().contact?.github_profile?.length>0 || this.resumeForm().contact?.linkedIn_profile?.length>0
}

isAchievementDefaultData(){
  return this.resumeForm().achievementBulletPoints?.ach == null || this.resumeForm().achievementBulletPoints?.ach.length == 0 || this.resumeForm().achievementBulletPoints?.ach == undefined
}

hasAchievements(): boolean {
  return !!(this.resumeForm().achievementBulletPoints?.ach && this.resumeForm().achievementBulletPoints.ach.trim().length > 0);
}

isCertificationDefaultData(){
   return  this.resumeForm().certificationBulletPoints?.point == null || this.resumeForm().certificationBulletPoints?.point.length == 0 || this.resumeForm().certificationBulletPoints?.point == undefined

}

hasCourseWork(): boolean {
  return !!(this.resumeForm().courseWork?.length);
}

hasProfileSummary(): boolean {
  return !!(this.resumeForm().profileSummary?.profile_summary?.length);
}

hasSkills(): boolean {
  return !!(this.resumeForm().skill_v2?.length) && !this.isSkillsCategoryDefault();
}

hasSkillsBulletPoints(): boolean {
  return !!(this.resumeForm().skillsBulletPoints?.length);
}

formatSkillsBulletPoints(): string {
  if (!this.resumeForm().skillsBulletPoints?.length) return '';
  return this.resumeForm().skillsBulletPoints.join(', ');
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
  this.currentSections().map((e : SectionDesc)=>{
    if(e.section == section){
      sectionTitle = e.editable_section_title
    }
  })
  return sectionTitle??'Section Title'
}

isAccomplishmentDefaultData(){
  return this.resumeForm().accomplishment?.length == 0 || this.resumeForm().accomplishment == null || this.resumeForm().accomplishment == undefined
}

isSkillsCategoryDefault(){
  return this.resumeForm().skill_v2?.length == 0 || this.resumeForm().skill_v2 == null || this.resumeForm().skill_v2 == undefined
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
    return this.resumeForm().project && this.resumeForm().project.length > 0;
  }

  editProjectItem(index: number): void {
    const projectItem = this.resumeForm().project[index];
    this.editSectionHandler('PROJECT', projectItem);
  }

  deleteProjectItem(index: number): void {
    const projectItem = this.resumeForm().project[index];
    this.confirmDeleteItemDialog('PROJECT', projectItem);
  }

  // Certification Methods
  hasCertificationData(): boolean {
    return this.resumeForm().certification && this.resumeForm().certification.length > 0;
  }

  editCertificationItem(index: number): void {
    const certificationItem = this.resumeForm().certification[index];
    this.editSectionHandler('CERTIFICATIONS', certificationItem);
  }

  deleteCertificationItem(index: number): void {
    const certificationItem = this.resumeForm().certification[index];
    this.confirmDeleteItemDialog('CERTIFICATIONS', certificationItem);
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
