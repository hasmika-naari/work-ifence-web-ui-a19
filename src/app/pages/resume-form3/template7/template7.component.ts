import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AccordionModule } from 'primeng/accordion';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Resume } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';


@Component({
  selector: 'app-resume-template7',
  standalone: true,
  imports: [RouterModule, CarouselModule, ReactiveFormsModule, FormsModule, MatStepperModule, MatFormFieldModule, InputTextModule, MatTooltipModule, MatInputModule, ButtonModule, MatButtonModule, AccordionModule, TextareaModule, MatIconModule, MatExpansionModule],
  templateUrl: './template7.component.html',
  styleUrls: ['./template7.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplate7Component implements OnInit, OnDestroy {
  // Helper for contact section
  getContactData(): any {
    const section = this.resumeForm().sections?.find(s => s.section === 'CONTACT');
    return section?.items?.[0]?.data || {};
  }

  // Section-based helpers for template
  getProfileSummary(): string {
    const section = this.resumeForm().sections?.find(s => s.section === 'PROFILE_SUMMARY');
    return section?.items?.[0]?.data?.profile_summary || '';
  }

  getExperienceItems(): any[] {
    const section = this.resumeForm().sections?.find(s => s.section === 'WORK_EXPERIENCE');
    return section?.items?.map(i => i.data) || [];
  }

  getSkillItems(): any[] {
    const section = this.resumeForm().sections?.find(s => s.section === 'SKILLS_BULLET_POINTS');
    return section?.items?.map(i => i.data).flat() || [];
  }

  getProjectItems(): any[] {
    const section = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
    return section?.items?.map(i => i.data) || [];
  }

  getEducationItems(): any[] {
    const section = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
    return section?.items?.map(i => i.data) || [];
  }

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();

  resumeForm: Signal<Resume> = this.userStore.getResumeForm();

  
  @Output() editSection = new EventEmitter<any>();

  @Input() isPreview : boolean = false;

  constructor(
      private _formBuilder: FormBuilder, 
      private router : Router, 
      private cdr: ChangeDetectorRef,
      public dialog: MatDialog,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService) {}

  ngOnDestroy(): void {
  }

  ngOnInit() {
 
  }

  confirmDeleteDialog(section: string, selectedJson : any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {name: 'confirm'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === "CONFIRM"){
        if(section === "SUMMARY"){
          this.userStore.deleteSummary();
        }
        else if(section === "COURSEWORK"){
          this.userStore.deleteCourseWork()
        }
        else if(section === "SKILLS"){
          this.userStore.deleteSkill();
        }
        else if(section === "EDUCATION"){
          this.userStore.deleteEducation(selectedJson)
        }
        else if(section === "PROJECT"){
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
    else if(section === "EXPERIENCE"){
      selectedJson.isHideSelected = true;
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "CERTIFICATION"){
      selectedJson.isHideSelected = true;
      this.userStore.updateCertification(selectedJson)
    }
  }

  addSectionHandler(section : string,selectedJson : any){
    if(section === "EDUCATION"){
      this.userStore.updateEducation(selectedJson)
    }
    else if(section === "PROJECT"){
      this.userStore.updateProject(selectedJson)
    }
    else if(section === "EXPERIENCE"){
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "CERTIFICATION"){
      this.userStore.updateCertification(selectedJson);
    }
    
    this.editSection.emit({section : section})
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
    else if(section === "EXPERIENCE"){
      selectedJson.isHideSelected = false;
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "CERTIFICATION"){
      selectedJson.isHideSelected = false;
      this.userStore.updateCertification(selectedJson)
    }
  }


  editSectionHandler(section : string, selectedJson : any){
    if(section === "EDUCATION"){
      this.userStore.updateEducation(selectedJson)
    }
    else if(section === "PROJECT"){
      this.userStore.updateProject(selectedJson)
    }
    else if(section === "EXPERIENCE"){
      this.userStore.updateExperience(selectedJson)
    }
    else if(section === "CERTIFICATION"){
      this.userStore.updateCertification(selectedJson)
    }
    this.editSection.emit({section : section})
  }

  checkEducationCondition(){
  const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
  const array = eduSection?.items?.map(i => i.data) ?? [];
  return array.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }

  checkProjectCondition(){
  const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
  const array = projSection?.items?.map(i => i.data) ?? [];
  return array.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }

  checkExperienceCondition(){
  const expSection = this.resumeForm().sections?.find(s => s.section === 'EXPERIENCE');
  const array = expSection?.items?.map(i => i.data) ?? [];
  return array.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }

  checkCertificationCondition(){
  const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATION');
  const array = certSection?.items?.map(i => i.data) ?? [];
  return array.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }


  moveObjectById(section: string, id: string, direction: "up" | "down"): void {
    if(section === "EDUCATION"){
    const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
    const array = eduSection?.items?.map(i => i.data) ?? [];
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
    const array = projSection?.items?.map(i => i.data) ?? [];
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
    array.forEach((item: any, idx: number) => this.userStore.updateProjectItem(item, idx));
  }
  else if(section === "EXPERIENCE"){
    const expSection = this.resumeForm().sections?.find(s => s.section === 'EXPERIENCE');
    const array = expSection?.items?.map(i => i.data) ?? [];
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
    array.forEach((item: any, idx: number) => this.userStore.updateExperienceItem(item, idx));
  }
  else if(section === "CERTIFICATION"){
    const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATION');
    const array = certSection?.items?.map(i => i.data) ?? [];
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
    array.forEach((item: any, idx: number) => this.userStore.updateCertificationItem(item, idx));
  }

}
  
  
}
