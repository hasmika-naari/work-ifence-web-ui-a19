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
import { AccordionModule } from 'primeng/accordion';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AchievementBulletPoints, Certification, Education, Experience, IsSectionPresent, CertificationBulletPoints, ProfileSummary, Project, Resume, ResumeContact, SkillV2 } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { SectionDesc } from 'src/app/services/store/user-store';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';


@Component({
  selector: 'app-resume-template9',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatTooltipModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,
    MatIconModule,MatExpansionModule, DragDropModule],
  templateUrl: './template9.component.html',
  styleUrls: ['./template9.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplate9Component implements OnInit, OnDestroy {

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  sectionStatus: Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  resumeForm: Signal<Resume> = this.userStore.getResumeForm();
  selectedResumeListItem: Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
  currentSections : Signal<SectionDesc[]> = this.userStore.getCurrentSections()

  
  @Output() editSection = new EventEmitter<any>();

  @Input() isPreview : boolean = false;

  staticSections = ['PROFILE_SUMMARY', 'WORK_EXPERIENCE', 'PROJECT'];
  dynamicSections = ['RELEVANT_COURSEWORK','SKILLS_BULLET_POINTS', 'EDUCATION', 'CERTIFICATION_BULLET_POINTS', 'ACHIEVEMENTS_BULLET_POINTS'];

  // Keep track of original dynamic sections
  originalDynamicSections = [...this.dynamicSections];

   sections  : string[]= ['PROFILE_SUMMARY','EDUCATION','RELEVANT_COURSEWORK', 'SKILLS_BULLET_POINTS', 'WORK_EXPERIENCE', 'PROJECT', 'CERTIFICATIONS', 'ACHIEVEMENTS_BULLET_POINTS']
  
    sectionsDesc  : Array<SectionDesc> = [
      {
        section : 'PROFILE_SUMMARY',
        title : 'Profile summary'
      },
      {
        section : 'EDUCATION',
        title : 'Education'
      },
      {
        section : 'RELEVANT_COURSEWORK',
        title : 'Relevant coursework'
      },
      {
        section : 'SKILLS_BULLET_POINTS',
        title : 'Skills with bullet points'
      },
      {
        section : 'WORK_EXPERIENCE',
        title : 'Work experience'
      },
      {
        section : 'PROJECT',
        title : 'Project'
      },
      {
        section : 'CERTIFICATIONS',
        title : 'Certification'
      },
      {
        section : 'ACHIEVEMENTS_BULLET_POINTS',
        title : 'Achievements with bullet points'
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
            if(this.resumeForm().sections.length>0 && this.isSectionsSetCount == 1 && this.currentSections().length == 0){
              this.sections = []
              this.resumeForm().sections.map((e : SectionDesc)=>{
              this.sections = [...this.sections, e.section]
              })
              this.userStore.setResumeSections(this.resumeForm().sections)
              this.isSectionsSetCount = this.isSectionsSetCount + 1
            }
            else if(this.resumeForm().sections.length == 0 && this.currentSections().length == 0){
              this.userStore.setResumeSections(this.sectionsDesc)
            }
            else if(this.currentSections().length !== this.sections.length){
              this.sections = []
              this.currentSections().map((e : SectionDesc)=>{
              this.sections = [...this.sections, e.section]
            })
          }
          let skills = this.resumeForm().skill_v2
          this.firstHalfSkills = [...skills.slice(0, Math.ceil(skills.length/2))]
          this.secondHalfSkills = [...skills.slice(Math.ceil(skills.length/2),)]
          })
      }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    if(this.selectedResumeListItem().id){
      let isSection : IsSectionPresent = new IsSectionPresent();
      isSection.isContact = true;
      isSection.isSummary = true;
      isSection.isEducation = true;
      isSection.isCourseWork= true;
      isSection.isSkill = true;
      isSection.isProject = true;
      isSection.isExperience =true;
      isSection.isSkillsCategory= true;
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
      isSection.isSkillsCategory= true;
      isSection.isAchievement = true;
      this.userStore.updateSectionStatus(isSection);
      }
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
        else if(section === "EXPERIENCE"){
          this.userStore.deleteExperience(selectedJson)
        }
        else if(section === "CERTIFICATION"){
          this.userStore.deleteCertification(selectedJson)
        }
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log("Before: ", this.sections, event.previousIndex, event.currentIndex);
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    console.log("After: ",this.sections, event.previousIndex, event.currentIndex);
    let formattedSections: any[] = []
    this.sections.map((e)=>{
      let section = this.currentSections().filter( s=> s.section == e)
      formattedSections = [...formattedSections, ...section]
    })
    this.userStore.setResumeSections(formattedSections)
    this.cdr.detectChanges();
  }

  onDrop(event: CdkDragDrop<string[]>, container: 'static' | 'dynamic') {
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;

    // Same list - reorder
    if (previousContainer === currentContainer) {
      moveItemInArray(currentContainer.data, event.previousIndex, event.currentIndex);
    }
    // Cross-container
    else {
      const draggedItem = previousContainer.data[event.previousIndex];

      if (
        container === 'dynamic' &&
        !this.originalDynamicSections.includes(draggedItem)
      ) {
        // Block drop if item was not originally from dynamic list
        return;
      }

      transferArrayItem(
        previousContainer.data,
        currentContainer.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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
      let index = this.resumeForm().education.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateEducationItem(selectedJson, index)
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = true;
      let index = this.resumeForm().project.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateProjectItem(selectedJson, index)
    }
    else if(section === "EXPERIENCE"){
      selectedJson.isHideSelected = true;
      let index = this.resumeForm().experience.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateExperienceItem(selectedJson, index)
    }
    else if(section === "CERTIFICATION"){
      selectedJson.isHideSelected = true;
      let index = this.resumeForm().certification.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateCertificationItem(selectedJson, index)
    }
    else if(section === "ACCOMPLISHMENT"){
      selectedJson.isHideSelected = true;
      let index = this.resumeForm().accomplishment.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateAccomplishmentItem(selectedJson, index);
    }
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
      let index = this.resumeForm().education.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateEducationItem(selectedJson, index)
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = false;
      let index = this.resumeForm().project.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateProjectItem(selectedJson, index)
    }
    else if(section === "EXPERIENCE"){
      selectedJson.isHideSelected = false;
      let index = this.resumeForm().experience.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateExperienceItem(selectedJson, index)
    }
    else if(section === "CERTIFICATION"){
      selectedJson.isHideSelected = false;
      let index = this.resumeForm().certification.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateCertificationItem(selectedJson, index)
    }
    else if(section === "ACCOMPLISHMENT"){
      selectedJson.isHideSelected = false;
      let index = this.resumeForm().accomplishment.findIndex(obj => obj.id === selectedJson.id)
      this.userStore.updateAccomplishmentItem(selectedJson, index);
    }
  }

  addSectionHandler(section : string){
    if(section === "EDUCATION"){
      this.userStore.setEducation(new Education())
    }
    else if(section === "PROJECT"){
      this.userStore.setProject(new Project())
    }
    else if(section === "EXPERIENCE"){
      this.userStore.setExperience(new Experience())
    }
    else if(section === "CERTIFICATION"){
      this.userStore.setCertification(new Certification());
    }
    
    this.editSection.emit({section : section})
  }

  editSectionHandler(section : string, selectedJson : any){
    if(section == "EDUCATION"){
      this.userStore.updateEducation(selectedJson)
    }
    else if(section == "PROJECT"){
      this.userStore.updateProject(selectedJson)
    }
    else if(section == "EXPERIENCE"){
      this.userStore.updateExperience(selectedJson)
    }

    this.editSection.emit({section : section})
  }

  checkEducationCondition(){
      return this.resumeForm().education.filter(obj => obj.isHideSelected === false).length > 0
  }

  checkProjectCondition(){
    return this.resumeForm().project.filter(obj => obj.isHideSelected === false).length > 0
  }

  checkExperienceCondition(){
    return this.resumeForm().experience.filter(obj => obj.isHideSelected === false).length > 0
  }

  checkCertificationCondition(){
    return this.resumeForm().certification.filter(obj => obj.isHideSelected === false).length > 0
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
    } else if (direction === "down" && index < array.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateEducationList(array);
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
    } else if (direction === "down" && index < array.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateProjectList(array);
  }
  else if(section === "EXPERIENCE"){
    const array = this.resumeForm().experience;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateExperienceList(array);
  }
  else if(section === "CERTIFICATION"){
    const array = this.resumeForm().certification;
    const index = array.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    
    if (direction === "up" && index > 0) {
      // Swap with the previous element
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array.length - 1) {
      // Swap with the next element
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    this.userStore.updateCertificationList(array);
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
        if(section === "CONTACT"){
          resume.contact = new ResumeContact()
          status.isContact = false;
        }
        else if(section === "SUMMARY"){
          resume.profileSummary = new ProfileSummary()
          status.isSummary = false;
        }
        else if(section === "COURSEWORK"){
          resume.courseWork = []
          status.isCourseWork = false;
        }
        else if(section === "SKILLS"){
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
        else if(section === "EXPERIENCE"){
          resume.experience = []
          status.isExperience = false;
        }
        else if(section === "CERTIFICATION_BULLET_POINTS"){
          resume.certificationBulletPoints = new CertificationBulletPoints();
          status.isSkillsCategory = false
        }
        else if(section === "ACHIEVEMENTS_BULLET_POINTS"){
          resume.achievementBulletPoints = new AchievementBulletPoints()
          status.isAchievement = false
        }
        this.userStore.updateSectionStatus(status);
        this.userStore.updateResumeForm(resume);
      }
  })
}

  
}
