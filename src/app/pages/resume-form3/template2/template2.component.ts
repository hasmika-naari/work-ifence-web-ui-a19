import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, inject } from '@angular/core';
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
import { Resume } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';


@Component({
  selector: 'app-resume-template2',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatTooltipModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule],
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplate2Component implements OnInit, OnDestroy {

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


  
  
}
