
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
import { AchievementBulletPoints, Certification, Education, Experience, IsSectionPresent, CertificationBulletPoints, ProfileSummary, Project, Resume, ResumeContact, SkillV2, Accomplishment } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { SectionDesc } from 'src/app/services/store/user-store';
import { sections } from 'src/app/services/store/resume-sections';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Templatesv2Service } from 'src/app/services/shared/templatev2.service';
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

  // Generic helper to get section items by section name
  getSectionItems(sectionName: string): any[] {
    const sections = this.resumeForm().sections || [];
    const section = sections.find(s => s.section === sectionName);
    return section?.items?.map(i => i.data) ?? [];
  }
  // Helper to get project items from sections
  getProjectItems(): any[] {
    const section = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
    return section?.items?.map(i => i.data) || [];
  }

  // Helper to get certification items from sections
  getCertificationItems(): any[] {
    const section = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATIONS');
    return section?.items?.map(i => i.data) || [];
  }
  getContactData(): any {
    const section = this.currentSections()?.find(s => s.section === 'CONTACT');
    return section?.items?.[0]?.data || {};
  }
  getCourseWorkItems(): any[] {
    const section = this.currentSections()?.find(s => s.section === 'COURSEWORK');
    return section?.items?.map(i => i.data) || [];
  }

  getSkillItems(): any[] {
    // Try SKILLS_BULLET_POINTS first, fallback to SKILLS if needed
    let section = this.currentSections()?.find(s => s.section === 'SKILLS_BULLET_POINTS');
    if (!section) section = this.currentSections()?.find(s => s.section === 'SKILLS');
    // Some skills sections may store an array, some a string, adapt as needed
    if (section?.items?.length) {
      // If items are objects with a 'skills' array
      if (Array.isArray(section.items[0].data?.skills)) {
        return section.items[0].data.skills;
      }
      // If items are just an array of strings
      if (Array.isArray(section.items)) {
        return section.items.map(i => i.data).flat();
      }
    }
    return [];
  }

  // Section data helpers
  getEducationItems(): any[] {
    const section = this.currentSections()?.find(s => s.section === 'EDUCATION');
    return section?.items?.map(i => i.data) || [];
  }

  getCertificationBulletPoints(): any {
    const section = this.currentSections()?.find(s => s.section === 'CERTIFICATIONS_BULLET_POINTS');
    // Some templates use .point, some use .items[0].data, adapt as needed
    return section?.items?.[0]?.data || {};
  }

  getAchievementBulletPoints(): any {
    const section = this.currentSections()?.find(s => s.section === 'ACHIEVEMENTS_BULLET_POINTS');
    return section?.items?.[0]?.data || {};
  }

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  sectionStatus: Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  resumeForm: Signal<Resume> = this.userStore.getResumeForm();
  selectedResumeListItem: Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
  currentSections : Signal<SectionDesc[]> = this.userStore.getCurrentSections()
  multipleSections : Signal<SectionDesc[][]> = this.userStore.getMultipleColumnTemplateSections()

  
  @Output() editSection = new EventEmitter<any>();

  @Input() isPreview : boolean = false;

  staticSections = ['PROFILE_SUMMARY', 'WORK_EXPERIENCE', 'PROJECT'];
  dynamicSections = ['RELEVANT_COURSEWORK','SKILLS_BULLET_POINTS', 'EDUCATION', 'CERTIFICATIONS_BULLET_POINTS', 'ACHIEVEMENTS_BULLET_POINTS'];

  // Keep track of original dynamic sections
  originalDynamicSections = [...this.dynamicSections];

   sections  : string[]= ['PROFILE_SUMMARY','EDUCATION','RELEVANT_COURSEWORK', 'SKILLS_BULLET_POINTS', 'WORK_EXPERIENCE', 'PROJECT', 'CERTIFICATIONS_BULLET_POINTS', 'ACHIEVEMENTS_BULLET_POINTS']
  
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
      public templateService : Templatesv2Service) {
        effect(()=>{
            if(this.resumeForm().template_details.template_name == 'TEMPLATE_9' && this.resumeForm()?.multipleSections?.length>0 && this.isSectionsSetCount == 1 && this.multipleSections()?.length == 0){
              this.staticSections = []
              this.dynamicSections = []
              this.sectionsDesc = []
              this.resumeForm().multipleSections.map((e : SectionDesc[], index : number)=>{
                if(index == 0){
                  e.map((section)=>{
                    this.staticSections = [...this.staticSections, section.section]
                  })
                }
                else{
                  e.map((section)=>{
                    this.dynamicSections = [...this.dynamicSections, section.section]
                  })
                }
                e.map((section)=>{
                    this.sectionsDesc = [...this.sectionsDesc, section]
                })
              })
            console.log(this.resumeForm().multipleSections);
            
              this.userStore.setMultipleColumnTemplateSections(this.resumeForm().multipleSections)
              this.isSectionsSetCount = this.isSectionsSetCount + 1
            }
            else if(this.resumeForm()?.multipleSections?.length == 0 && this.currentSections()?.length != 0 && this.multipleSections()?.length == 0){
               this.staticSections = []
               this.dynamicSections = []
               this.sectionsDesc = [...this.currentSections()]
               let staticSectionsFull : SectionDesc[]= []
               let dynamicSectionsFull : SectionDesc[]= []
              this.currentSections().map((e : SectionDesc)=>{
                if(["PROFILE_SUMMARY","WORK_EXPERIENCE", "PROJECT", "SKILLS_CATEGORY", "ACHIEVEMENT_WITH_DESC", "CERTIFICATIONS"].includes(e.section)){
                  this.staticSections = [...this.staticSections , e.section]
                  staticSectionsFull = [...staticSectionsFull, e]
                  console.log(staticSectionsFull);
                }
                else{
                  this.dynamicSections= [ ...this.dynamicSections, e.section]
                  dynamicSectionsFull = [...dynamicSectionsFull, e]
                  // console.log(e);
                }
              })
              console.log(this.staticSections,  this.currentSections());
              
              this.userStore.setMultipleColumnTemplateSections([staticSectionsFull, dynamicSectionsFull])
            }
            else if(this.resumeForm()?.multipleSections?.length == 0 && this.currentSections()?.length == 0 && this.multipleSections()?.length == 0){
               let staticSectionsFull : SectionDesc[]= []
               let dynamicSectionsFull : SectionDesc[]= []
              sections.map((e : SectionDesc)=>{
                if(["PROFILE_SUMMARY","WORK_EXPERIENCE", "PROJECT", "SKILLS_CATEGORY", "ACHIEVEMENT_WITH_DESC", "CERTIFICATIONS"].includes(e.section)){
                  this.staticSections = [...this.staticSections , e.section]
                  staticSectionsFull = [...staticSectionsFull, e]
                  console.log(e);
                }
                else if(['RELEVANT_COURSEWORK','SKILLS_BULLET_POINTS', 'EDUCATION', 'CERTIFICATIONS_BULLET_POINTS', 'ACHIEVEMENTS_BULLET_POINTS'].includes(e.section)){
                  this.dynamicSections= [ ...this.dynamicSections, e.section]
                  dynamicSectionsFull = [...dynamicSectionsFull, e]
                  console.log(e);
                }
              })
              this.userStore.setMultipleColumnTemplateSections([staticSectionsFull, dynamicSectionsFull])
            }
            if(this.multipleSections()[0]?.length !== this.staticSections?.length){
              console.log(this.multipleSections()[0] , "MultipleSection");
              
              this.staticSections = []
              this.multipleSections()[0].map((e : SectionDesc)=>{
              this.staticSections = [...this.staticSections, e.section]
            })
            }
            if(this.multipleSections()[1]?.length !== this.dynamicSections?.length){
              this.dynamicSections = []
                this.multipleSections()[1].map((e : SectionDesc)=>{
                this.dynamicSections = [...this.dynamicSections, e.section]
              })
            }
          // Get skills from SKILLS_BULLET_POINTS section
          const skillsSection = this.resumeForm().sections?.find(s => s.section === 'SKILLS_BULLET_POINTS');
          const skills = skillsSection?.items?.map(i => i.data) ?? [];
          this.firstHalfSkills = [...skills.slice(0, Math.ceil(skills.length/2))];
          this.secondHalfSkills = [...skills.slice(Math.ceil(skills.length/2))];
          })
      }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    console.log(this.multipleSections()?.length == 0, this.resumeForm().multipleSections?.length>0);
    
    if(this.multipleSections()?.length == 0 && this.resumeForm().multipleSections?.length>0){
       this.userStore.setMultipleColumnTemplateSections(this.resumeForm().multipleSections)
       console.log(this.resumeForm().multipleSections);
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
        else if(section === "WORK_EXPERIENCE"){
          this.userStore.deleteExperience(selectedJson)
        }
        else if(section === "CERTIFICATIONS"){
          this.userStore.deleteCertification(selectedJson)
        }
        else if(section == 'ACHIEVEMENT_WITH_DESC'){
          this.userStore.deleteAccomplishment(selectedJson)
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
      const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
      const array = eduSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateEducationItem(selectedJson, index)
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = true;
      const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
      const array = projSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateProjectItem(selectedJson, index)
    }
    else if(section === "WORK_EXPERIENCE"){
      selectedJson.isHideSelected = true;
      const expSection = this.resumeForm().sections?.find(s => s.section === 'WORK_EXPERIENCE');
      const array = expSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateExperienceItem(selectedJson, index)
    }
    else if(section === "CERTIFICATIONS"){
      selectedJson.isHideSelected = true;
      const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATIONS');
      const array = certSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateCertificationItem(selectedJson, index)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      selectedJson.isHideSelected = true;
      const accSection = this.resumeForm().sections?.find(s => s.section === 'ACHIEVEMENT_WITH_DESC');
      const array = accSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
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
      const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
      const array = eduSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateEducationItem(selectedJson, index)
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = false;
      const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
      const array = projSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateProjectItem(selectedJson, index)
    }
    else if(section === "WORK_EXPERIENCE"){
      selectedJson.isHideSelected = false;
      const expSection = this.resumeForm().sections?.find(s => s.section === 'WORK_EXPERIENCE');
      const array = expSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateExperienceItem(selectedJson, index)
    }
    else if(section === "CERTIFICATIONS"){
      selectedJson.isHideSelected = false;
      const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATIONS');
      const array = certSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateCertificationItem(selectedJson, index)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      selectedJson.isHideSelected = false;
      const accSection = this.resumeForm().sections?.find(s => s.section === 'ACHIEVEMENT_WITH_DESC');
      const array = accSection?.items?.map(i => i.data) ?? [];
      let index = array.findIndex((obj: any) => obj.id === selectedJson.id);
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
    else if(section === "WORK_EXPERIENCE"){
      this.userStore.setExperience(new Experience())
    }
    else if(section === "CERTIFICATIONS"){
      this.userStore.setCertification(new Certification());
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      this.userStore.setSelectedAccomplishment(new Accomplishment());
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
    else if(section == "WORK_EXPERIENCE"){
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      this.userStore.setSelectedAccomplishment(selectedJson)
    }
        else if(section == "CERTIFICATIONS"){
      this.userStore.updateCertification(selectedJson)
    }

    this.editSection.emit({section : section})
  }

  checkEducationCondition(){
  const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
  if (!eduSection || !Array.isArray(eduSection.items)) return false;
  return (eduSection.items.map(i => i.data).filter((obj: any) => obj.isHideSelected === false).length > 0);
  }

  checkProjectCondition(){
  const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
  if (!projSection || !Array.isArray(projSection.items)) return false;
  return (projSection.items.map(i => i.data).filter((obj: any) => obj.isHideSelected === false).length > 0);
  }

  checkExperienceCondition(){
  const expSection = this.resumeForm().sections?.find(s => s.section === 'WORK_EXPERIENCE');
  if (!expSection || !Array.isArray(expSection.items)) return false;
  return (expSection.items.map(i => i.data).filter((obj: any) => obj.isHideSelected === false).length > 0);
  }

  checkCertificationCondition(){
  const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATIONS');
  if (!certSection || !Array.isArray(certSection.items)) return false;
  return (certSection.items.map(i => i.data).filter((obj: any) => obj.isHideSelected === false).length > 0);
  }



  moveObjectById(section: string, id: string, direction: "up" | "down"): void {
    if(section === "EDUCATION"){
      const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
      const array = eduSection?.items?.map((i: any) => i.data) ?? [];
      const index = array.findIndex((obj: any) => obj.id === id);
      if (index === -1) {
        console.log("Object with the given id not found");
        return;
      }
      if (direction === "up" && index > 0) {
        [array[index], array[index - 1]] = [array[index - 1], array[index]];
      } else if (direction === "down" && index < array.length - 1) {
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
      } else {
        console.log("Move not possible");
      }
      array.forEach((item: any, idx: number) => this.userStore.updateEducationItem(item, idx));
    }
  else if(section === "PROJECT"){
    const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
    const array = projSection?.items?.map((i: any) => i.data) ?? [];
    const index = array.findIndex((obj: any) => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    if (direction === "up" && index > 0) {
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    array.forEach((item: any, idx: number) => this.userStore.updateProjectItem(item, idx));
  }
  else if(section === "WORK_EXPERIENCE"){
    const expSection = this.resumeForm().sections?.find(s => s.section === 'WORK_EXPERIENCE');
    const array = expSection?.items?.map((i: any) => i.data) ?? [];
    const index = array.findIndex((obj: any) => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    if (direction === "up" && index > 0) {
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    array.forEach((item: any, idx: number) => this.userStore.updateExperienceItem(item, idx));
  }
  else if(section === "CERTIFICATIONS"){
    const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATIONS');
    const array = certSection?.items?.map(i => i.data) ?? [];
    const index = array.findIndex((obj: any) => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    if (direction === "up" && index > 0) {
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    // Update each item using updateCertificationItem
    array.forEach((item: any, idx: number) => this.userStore.updateCertificationItem(item, idx));
  }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
    const accSection = this.resumeForm().sections?.find(s => s.section === 'ACHIEVEMENT_WITH_DESC');
    const array = accSection?.items?.map(i => i.data) ?? [];
    const index = array.findIndex((obj: any) => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    if (direction === "up" && index > 0) {
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === "down" && index < array?.length - 1) {
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    } else {
      console.log("Move not possible");
    }
    // Update each item using updateAccomplishmentItem
    array.forEach((item: any, idx: number) => this.userStore.updateAccomplishmentItem(item, idx));
  }

}

removeSection(section : string){
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {name: 'confirm'},
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result.event === "CONFIRM"){
        let status = this.sectionStatus();
        let resume = this.resumeForm();
        // Helper to clear items in a section
        const clearSectionItems = (sectionName: string, newData?: any) => {
          const sec = resume.sections?.find(s => s.section === sectionName);
          if (sec && Array.isArray(sec.items)) {
            if (newData !== undefined) {
              sec.items = [{ id: sec.items[0]?.id || sectionName, data: newData }];
            } else {
              sec.items = [];
            }
          }
        };
        if(section === "PROFILE_SUMMARY"){
          clearSectionItems("PROFILE_SUMMARY", new ProfileSummary());
          status.isSummary = false;
        }
        else if(section === "RELEVANT_COURSEWORK"){
          clearSectionItems("RELEVANT_COURSEWORK");
          status.isCourseWork = false;
        }
        else if(section === "SKILLS_BULLET_POINTS"){
          clearSectionItems("SKILLS_BULLET_POINTS");
          status.isSkill = false;
        }
        else if(section === "EDUCATION"){
          clearSectionItems("EDUCATION");
          status.isEducation = false;
        }
        else if(section === "PROJECT"){
          clearSectionItems("PROJECT");
          status.isProject = false;
        }
        else if(section === "WORK_EXPERIENCE"){
          clearSectionItems("WORK_EXPERIENCE");
          status.isExperience = false;
        }
        else if(section === "CERTIFICATIONS_BULLET_POINTS"){
          clearSectionItems("CERTIFICATIONS_BULLET_POINTS", new CertificationBulletPoints());
          status.isSkillsCategory = false;
        }
        else if(section === "ACHIEVEMENTS_BULLET_POINTS"){
          clearSectionItems("ACHIEVEMENTS_BULLET_POINTS", new AchievementBulletPoints());
          status.isAchievement = false;
        }
        else if(section === "CERTIFICATIONS"){
          clearSectionItems("CERTIFICATIONS");
          status.isCertification = false;
        }
        else if(section === "ACHIEVEMENT_WITH_DESC"){
          clearSectionItems("ACHIEVEMENT_WITH_DESC");
          status.isAccomplishments = false;
        }
        this.userStore.removeSectionFromMultipleSectionsList(section);
        this.userStore.updateResumeForm(resume);
      }
  })
}

isDefaultData(data : string){
return data?.length==0
}

isContactNotDefaultData(){
  const contact = this.resumeForm().sections?.find(s => s.section === 'CONTACT')?.items?.[0]?.data;
  return (
    contact?.fname?.length > 0 ||
    contact?.lname?.length > 0 ||
    contact?.subTitle?.length > 0 ||
    contact?.phone_number?.length > 0 ||
    contact?.email?.length > 0 ||
    contact?.github_profile?.length > 0 ||
    contact?.linkedIn_profile?.length > 0
  );
}

isAchievementDefaultData(){
  const achSection = this.resumeForm().sections?.find(s => s.section === 'ACHIEVEMENTS_BULLET_POINTS');
  const achItem = achSection?.items?.[0]?.data;
  return achItem?.ach == null || achItem?.ach?.length === 0 || achItem?.ach == undefined;
}

isCertificationDefaultData(){
  const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATIONS_BULLET_POINTS');
  const certItem = certSection?.items?.[0]?.data;
  return certItem?.point == null || certItem?.point?.length === 0 || certItem?.point == undefined;
}

isAccomplishmentDefaultData(){
  const accSection = this.resumeForm().sections?.find(s => s.section === 'ACCOMPLISHMENTS');
  const accItems = accSection?.items?.map(i => i.data) ?? [];
  return accItems.length === 0 || accItems == null || accItems == undefined;
}

isSkillsCategoryDefault(){
  const skillV2Section = this.resumeForm().sections?.find(s => s.section === 'SKILLS_CATEGORY');
  const skillV2Items = skillV2Section?.items?.map(i => i.data) ?? [];
  return skillV2Items.length === 0 || skillV2Items == null || skillV2Items == undefined;
}



formatSkills(items : string[]){
  return items.join(", ");
}

getSectionTitle(section : string){
  let sectionTitle = null;
  this.multipleSections()[0].map((e : SectionDesc)=>{
    if(e.section == section){
      sectionTitle = e.editable_section_title
    }
  })
  if(!sectionTitle){
    this.multipleSections()[1].map((e : SectionDesc)=>{
    if(e.section == section){
      sectionTitle = e.editable_section_title
    }
  })
  }
  return sectionTitle??'Section Title'
}


  
}
