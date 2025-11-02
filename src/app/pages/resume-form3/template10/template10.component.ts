

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
import { Accomplishment, AchievementBulletPoints, Certification, Education, Experience, IsSectionPresent, CertificationBulletPoints, ProfileSummary, Project, Resume, ResumeContact, SkillV2 } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { SectionDesc } from 'src/app/services/store/user-store';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Templatesv2Service } from 'src/app/services/shared/templatev2.service';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';


@Component({
  selector: 'app-resume-template10',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatTooltipModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, DragDropModule],
  templateUrl: './template10.component.html',
  styleUrls: ['./template10.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplate10Component implements OnInit, OnDestroy {
  // Helper to get contact section data
  getContactSection() {
    const section = this.currentSections().find(s => s.section === 'CONTACT');
    return section?.items?.[0]?.data || {};
  }

  // Helper to get achievement bullet points section data
  getAchievementBulletPointsSection() {
    const section = this.currentSections().find(s => s.section === 'ACHIEVEMENTS_BULLET_POINTS');
    return section?.items?.[0]?.data || {};
  }

  // Helper to get certification bullet points section data
  getCertificationBulletPointsSection() {
    const section = this.currentSections().find(s => s.section === 'CERTIFICATIONS_BULLET_POINTS');
    return section?.items?.[0]?.data || {};
  }
  // Returns the current resume form object
  resumeForm() {
    return this.userStore.getResumeForm()();
  }

  // Returns the current sections array from the resume form
  currentSections() {
    return this.resumeForm().sections || [];
  }

  // Returns the section status (add a stub if not present)
  sectionStatus() {
    if (typeof this.userStore.getSectionStatus === 'function') {
      const status = this.userStore.getSectionStatus()();
      if (status) return status;
    }
    // fallback stub
    return new (require('src/app/services/resume.model').IsSectionPresent)();
  }

  // Stubs for missing properties
  firstHalfSkills: any[] = [];
  secondHalfSkills: any[] = [];
  editSection = { emit: (_: any) => {} };
  selectedResumeListItem() { return { id: undefined }; }
  userStore: UserStoreService;

  constructor(userStore: UserStoreService, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    this.userStore = userStore;
  }

  // Helper to get section items by section name
  getSectionItems(sectionName: string): any[] {
    const sections = this.resumeForm().sections || [];
    const section = sections.find(s => s.section === sectionName);
    return section?.items?.map((i: any) => i.data) ?? [];
  }

  // Add isPreview property for template usage
  isPreview: boolean = false;


   sections  : string[]= ['PROFILE_SUMMARY','EDUCATION','SKILLS_CATEGORY', 'WORK_EXPERIENCE', 'PROJECT', 'ACHIEVEMENT_WITH_DESC']

  sectionsDesc: Array<SectionDesc> = [
    {
      section: 'PROFILE_SUMMARY',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      description: 'A brief summary of your skills and experience.',
      isAdded: true,
      isPremium: false,
      tags: '',
      label: 'Profile Summary'
    },
    // ...other section objects...
  ];
// ...existing code...

  ngOnDestroy(): void {
  }

  ngOnInit() {
    if(this.selectedResumeListItem().id){
      let isSection : IsSectionPresent = this.sectionStatus();
      isSection.isContact = true;
      isSection.isEducation = true;
      isSection.isSkillV2 = true;
      isSection.isSkill = true;
      isSection.isAccomplishments = true;
      isSection.isExperience = true;
      isSection.isProject = true;
      isSection.isSummary = true;
      this.userStore.updateSectionStatus(isSection);
      }
      else {
        let isSection : IsSectionPresent = new IsSectionPresent();
        isSection.isContact = true;
        isSection.isEducation = true;
        isSection.isSkillV2 = true;
        isSection.isSkill = true;
        isSection.isAccomplishments = true;
        isSection.isExperience = true;
        isSection.isProject = true;
        isSection.isSummary = true;
        this.userStore.updateSectionStatus(isSection);
      }
  const skills = this.getSectionItems('SKILLS_CATEGORY');
  this.firstHalfSkills = [...skills.slice(0, Math.ceil(skills?.length/2))];
  this.secondHalfSkills = [...skills.slice(Math.ceil(skills?.length/2),)];
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


  getDivClass(item : any){
    if(item.isHideSelected){
      return 'opacity-50'
    }
    return 'opacity-100'
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
      const items = this.getSectionItems('EDUCATION');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateEducationItem(selectedJson, index);
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = true;
      const items = this.getSectionItems('PROJECT');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateProjectItem(selectedJson, index);
    }
    else if(section === "WORK_EXPERIENCE"){
      selectedJson.isHideSelected = true;
      const items = this.getSectionItems('WORK_EXPERIENCE');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateExperienceItem(selectedJson, index);
    }
    else if(section === "CERTIFICATIONS"){
      selectedJson.isHideSelected = true;
      const items = this.getSectionItems('CERTIFICATION');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateCertificationItem(selectedJson, index);
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      selectedJson.isHideSelected = true;
      const items = this.getSectionItems('ACHIEVEMENT_WITH_DESC');
      let index = items.findIndex(obj => obj.id === selectedJson.id);
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
      const items = this.getSectionItems('EDUCATION');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateEducationItem(selectedJson, index);
    }
    else if(section === "PROJECT"){
      selectedJson.isHideSelected = false;
      const items = this.getSectionItems('PROJECT');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateProjectItem(selectedJson, index);
    }
    else if(section === "WORK_EXPERIENCE"){
      selectedJson.isHideSelected = false;
      const items = this.getSectionItems('WORK_EXPERIENCE');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateExperienceItem(selectedJson, index);
    }
    else if(section === "CERTIFICATIONS"){
      selectedJson.isHideSelected = false;
      const items = this.getSectionItems('CERTIFICATION');
      let index = items.findIndex((obj: any) => obj.id === selectedJson.id);
      this.userStore.updateCertificationItem(selectedJson, index);
    }
    else if(section === "ACHIEVEMENT_WITH_DESC"){
      selectedJson.isHideSelected = false;
      const items = this.getSectionItems('ACHIEVEMENT_WITH_DESC');
      let index = items.findIndex(obj => obj.id === selectedJson.id);
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
      this.userStore.setCertification({ data: new Certification() });
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
    const items = this.getSectionItems('EDUCATION');
    return items.filter(obj => obj.isHideSelected === false)?.length > 0;
  }

  checkProjectCondition(){
  const items = this.getSectionItems('PROJECT');
  return items.filter(obj => obj.isHideSelected === false)?.length > 0;
  }

  checkExperienceCondition(){
  const items = this.getSectionItems('WORK_EXPERIENCE');
  return items.filter(obj => obj.isHideSelected === false)?.length > 0;
  }

  checkCertificationCondition(){
  const items = this.getSectionItems('CERTIFICATIONS');
  return items.filter(obj => obj.isHideSelected === false)?.length > 0;
  }



  moveObjectById(section: string, id: string, direction: "up" | "down"): void {
    let sectionKey = section;
    if (section === 'CERTIFICATIONS') sectionKey = 'CERTIFICATION';
    if (section === 'ACHIEVEMENT_WITH_DESC') sectionKey = 'ACHIEVEMENT_WITH_DESC';
    const items = this.getSectionItems(sectionKey);
    const index = items.findIndex(obj => obj.id === id);
    if (index === -1) {
      console.log("Object with the given id not found");
      return;
    }
    if (direction === "up" && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === "down" && index < items?.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    } else {
      console.log("Move not possible");
    }
    // Call the correct update method for the section
    switch (section) {
      case 'EDUCATION':
        this.userStore.updateEducationItem(items[index], index);
        break;
      case 'PROJECT':
        this.userStore.updateProjectItem(items[index], index);
        break;
      case 'WORK_EXPERIENCE':
        this.userStore.updateExperienceItem(items[index], index);
        break;
      case 'CERTIFICATIONS':
        this.userStore.updateCertificationItem(items[index], index);
        break;
      case 'ACHIEVEMENT_WITH_DESC':
        this.userStore.updateAccomplishmentItem(items[index], index);
        break;
      default:
        break;
    }
  }





removeSection(section : string){
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {name: 'confirm'},
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result.event === "CONFIRM"){
  let status: import('src/app/services/resume.model').IsSectionPresent = this.sectionStatus();
        // Remove the section from the sections array
        let resume = this.resumeForm();
        resume.sections = resume.sections?.filter((s: any) => s.section !== section);
        // Update status flags as appropriate
        switch (section) {
          case "PROFILE_SUMMARY":
            status.isSummary = false;
            break;
          case "RELEVANT_COURSEWORK":
            status.isCourseWork = false;
            break;
          case "SKILLS_BULLET_POINTS":
            status.isSkill = false;
            break;
          case "EDUCATION":
            status.isEducation = false;
            break;
          case "PROJECT":
            status.isProject = false;
            break;
          case "WORK_EXPERIENCE":
            status.isExperience = false;
            break;
          case "CERTIFICATIONS_BULLET_POINTS":
            status.isSkillsCategory = false;
            break;
          case "ACHIEVEMENTS_BULLET_POINTS":
            status.isAchievement = false;
            break;
          case "ACHIEVEMENT_WITH_DESC":
            status.isAccomplishments = false;
            break;
          case "SKILLS_CATEGORY":
            status.isSkillV2 = false;
            break;
          case "CERTIFICATIONS":
            status.isCertification = false;
            break;
        }
        this.userStore.removeSection(section);
        this.userStore.updateResumeForm(resume);
      }
  })
}

formatSkills(items : string[]){
  return items.join(", ");
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

isDefaultData(data : string){
return data?.length==0
}

isContactDefaultData(){
  const contact = this.getContactSection();
  return contact?.fname?.length>0 || contact?.lname?.length>0 || contact?.subTitle?.length>0 || contact?.phone_number?.length>0
    || contact?.email?.length>0 || contact?.github_profile?.length>0 || contact?.linkedIn_profile?.length>0
}

isAchievementDefaultData(){
  const ach = this.getAchievementBulletPointsSection();
  return ach?.ach == null || ach?.ach?.length == 0 || ach?.ach == undefined
}

isCertificationDefaultData(){
  const cert = this.getCertificationBulletPointsSection();
  return cert?.point == null || cert?.point?.length == 0 || cert?.point == undefined
}

  isAccomplishmentDefaultData(){
    const items = this.getSectionItems('ACHIEVEMENT_WITH_DESC');
    return items.length == 0 || items == null || items == undefined;
  }

  isSkillsCategoryDefault(){
    const items = this.getSectionItems('SKILLS_CATEGORY');
    return items.length == 0 || items == null || items == undefined;
  }



  
}
