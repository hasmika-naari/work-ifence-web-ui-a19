import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { AchievementBulletPoints, Certification, Education, Experience, IsSectionPresent, ProfileSummary, Project, Resume, ResumeContact, CertificationBulletPoints, SkillV2, Accomplishment } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { CdkDragDrop, CdkDragStart, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SectionDesc } from 'src/app/services/store/user-store';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';


@Component({
  selector: 'app-resume1-template',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatTooltipModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, DragDropModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class Resume1TemplateComponent implements OnInit, OnDestroy {

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  sectionStatus: Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  resumeForm: Signal<Resume> = this.userStore.getResumeForm();
  selectedResumeListItem: Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
  currentSections : Signal<SectionDesc[]> = this.userStore.getCurrentSections()
  

  
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

  sections  : string[]= ['PROFILE_SUMMARY','EDUCATION','RELEVANT_COURSEWORK', 'SKILLS_BULLET_POINTS', 'WORK_EXPERIENCE', 'PROJECT', 'CERTIFICATIONS', 'ACHIEVEMENTS_BULLET_POINTS']

  sectionsDesc: Array<SectionDesc> = [
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
      section: 'CERTIFICATIONS',
      title: 'Certification',
      editable_section_title: 'Certifications',
      description: 'Your certifications.',
      isAdded: true,
      isPremium: true,
      tags: 'certifications, credentials, qualifications',
      label: 'Certifications'
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

    firstHalfSkills : SkillV2[] = []
    secondHalfSkills : SkillV2[] = []
    
  isSectionsSetCount : number = 1

  constructor(
      private _formBuilder: FormBuilder, 
      private router : Router, 
      private cdr: ChangeDetectorRef,
      public dialog: MatDialog,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService) {
        effect(()=>{
          if(this.resumeForm()?.sections?.length>0 && this.isSectionsSetCount == 1 && this.currentSections()?.length == 0){
            this.sections = []
            this.resumeForm().sections.map((e : SectionDesc)=>{
              this.sections = [...this.sections, e.section]
            })
            this.userStore.setResumeSections(this.resumeForm().sections)
            this.isSectionsSetCount = this.isSectionsSetCount + 1
          }
          else if(this.currentSections()?.length == 0){
            this.userStore.setResumeSections(this.sectionsDesc)
          }
          else if(this.currentSections()?.length !== this.sections?.length){
            this.sections = []
          this.currentSections().map((e : SectionDesc)=>{
            this.sections = [...this.sections, e.section]
        })
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
      }

  ngOnDestroy(): void {
    // this.userStore.setResumeSections([])
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadHandler);
    }
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.unloadHandler);
    }
    if(this.selectedResumeListItem().id){
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
    }
    else{
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
    }

    if(this.resumeForm().skill_v2?.length>0){
    this.firstHalfSkills = [...this.resumeForm().skill_v2.slice(0, Math.ceil(this.resumeForm().skill_v2?.length/2))]
      this.secondHalfSkills = [...this.resumeForm().skill_v2.slice(Math.ceil(this.resumeForm().skill_v2?.length/2) + 1,)]
    }
  }

onDragStart(sectionName: string) {
  this.currentDraggingSection = sectionName;
  this.isDragging = true;
}

onDragEnd() {
  this.isDragging = false;
  this.currentDraggingSection = '';
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
    if(section === "EDUCATION"){
      this.userStore.setEducation(new Education())
    }
    else if(section === "PROJECT"){
      this.userStore.setProject(new Project())
    }
    else if(section === "WORK_EXPERIENCE"){
      this.userStore.setExperience(new Experience())
    }
    else if(section === "CERTIFICATIONS"){
      this.userStore.setCertification(new Certification());
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      this.userStore.setSelectedAccomplishment(new Accomplishment());
    }
    this.markDirty();
    // Trigger change detection to update arrow button states
    this.cdr.detectChanges();
    this.editSection.emit({section : section})
  }

  editSectionHandler(section : string, selectedJson : any){
    if(section == "EDUCATION"){
      this.userStore.updateEducation(selectedJson)
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
      }
  })
}

drop(event: CdkDragDrop<string[]>) {
  console.log("Before: ", this.sections, event.previousIndex, event.currentIndex);
  moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  console.log("After: ",this.sections, event.previousIndex, event.currentIndex);
  this.syncSectionsToStore();
  this.markDirty();
}

private syncSectionsToStore() {
  let formattedSections: SectionDesc[] = [];
  this.sections.forEach((e) => {
    const found = this.currentSections().filter((s) => s.section === e);
    formattedSections = [...formattedSections, ...found];
  });
  this.userStore.setResumeSections(formattedSections);
  this.cdr.detectChanges();
}

moveSectionUp(section: string) {
  const idx = this.sections.indexOf(section);
  if (idx > 0) {
    [this.sections[idx - 1], this.sections[idx]] = [this.sections[idx], this.sections[idx - 1]];
    this.syncSectionsToStore();
    this.markDirty();
    // Trigger change detection to update arrow button states
    this.cdr.detectChanges();
  }
}

moveSectionDown(section: string) {
  const idx = this.sections.indexOf(section);
  if (idx > -1 && idx < this.sections.length - 1) {
    [this.sections[idx], this.sections[idx + 1]] = [this.sections[idx + 1], this.sections[idx]];
    this.syncSectionsToStore();
    this.markDirty();
    // Trigger change detection to update arrow button states
    this.cdr.detectChanges();
  }
}

canMoveUp(section: string): boolean {
  return this.sections.indexOf(section) > 0;
}

canMoveDown(section: string): boolean {
  const idx = this.sections.indexOf(section);
  return idx > -1 && idx < this.sections.length - 1;
}

dragStarted(event: CdkDragStart) {
  const element = (event.source.element.nativeElement as HTMLElement);
  element.parentElement?.style.setProperty('--drag-placeholder-height', `${element.offsetHeight}px`);
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

isCertificationDefaultData(){
   return  this.resumeForm().certificationBulletPoints?.point == null || this.resumeForm().certificationBulletPoints?.point.length == 0 || this.resumeForm().certificationBulletPoints?.point == undefined

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
