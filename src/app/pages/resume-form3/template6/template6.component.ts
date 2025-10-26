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
import { SectionItemsPipe } from '../pipes/section-items.pipe';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { PhoneNumberPipe } from '@app/components/shared/pipes/phone-number-pipe';


@Component({
  selector: 'app-resume-template6',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatTooltipModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule,
    SectionItemsPipe],
  templateUrl: './template6.component.html',
  styleUrls: ['./template6.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplate6Component implements OnInit, OnDestroy {

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
  const eduArray = eduSection?.items?.map(i => i.data) ?? [];
  return eduArray.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }

  checkProjectCondition(){
    const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
    const projArray = projSection?.items?.map(i => i.data) ?? [];
    return projArray.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }

  checkExperienceCondition(){
    const expSection = this.resumeForm().sections?.find(s => s.section === 'EXPERIENCE');
    const expArray = expSection?.items?.map(i => i.data) ?? [];
    return expArray.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }

  checkCertificationCondition(){
    const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATION');
    const certArray = certSection?.items?.map(i => i.data) ?? [];
    return certArray.filter((obj: any) => obj.isHideSelected === false).length > 0;
  }


  moveObjectById(section: string, id: string, direction: "up" | "down"): void {
    if(section === "EDUCATION"){
      const eduSection = this.resumeForm().sections?.find(s => s.section === 'EDUCATION');
      const eduArray = eduSection?.items?.map(i => i.data) ?? [];
      const index = eduArray.findIndex((obj: any) => obj.id === id);
      if (index === -1) {
        console.log("Object with the given id not found");
        return;
      }
      if (direction === "up" && index > 0) {
        [eduArray[index], eduArray[index - 1]] = [eduArray[index - 1], eduArray[index]];
      } else if (direction === "down" && index < eduArray.length - 1) {
        [eduArray[index], eduArray[index + 1]] = [eduArray[index + 1], eduArray[index]];
      } else {
        console.log("Move not possible");
      }
      eduArray.forEach((item: any, idx: number) => this.userStore.updateEducationItem(item, idx));
    } else if(section === "PROJECT"){
      const projSection = this.resumeForm().sections?.find(s => s.section === 'PROJECT');
      const projArray = projSection?.items?.map(i => i.data) ?? [];
      const index = projArray.findIndex((obj: any) => obj.id === id);
      if (index === -1) {
        console.log("Object with the given id not found");
        return;
      }
      if (direction === "up" && index > 0) {
        [projArray[index], projArray[index - 1]] = [projArray[index - 1], projArray[index]];
      } else if (direction === "down" && index < projArray.length - 1) {
        [projArray[index], projArray[index + 1]] = [projArray[index + 1], projArray[index]];
      } else {
        console.log("Move not possible");
      }
      projArray.forEach((item: any, idx: number) => this.userStore.updateProjectItem(item, idx));
    } else if(section === "EXPERIENCE"){
      const expSection = this.resumeForm().sections?.find(s => s.section === 'EXPERIENCE');
      const expArray = expSection?.items?.map(i => i.data) ?? [];
      const index = expArray.findIndex((obj: any) => obj.id === id);
      if (index === -1) {
        console.log("Object with the given id not found");
        return;
      }
      if (direction === "up" && index > 0) {
        [expArray[index], expArray[index - 1]] = [expArray[index - 1], expArray[index]];
      } else if (direction === "down" && index < expArray.length - 1) {
        [expArray[index], expArray[index + 1]] = [expArray[index + 1], expArray[index]];
      } else {
        console.log("Move not possible");
      }
      expArray.forEach((item: any, idx: number) => this.userStore.updateExperienceItem(item, idx));
    } else if(section === "CERTIFICATION"){
      const certSection = this.resumeForm().sections?.find(s => s.section === 'CERTIFICATION');
      const certArray = certSection?.items?.map(i => i.data) ?? [];
      const index = certArray.findIndex((obj: any) => obj.id === id);
      if (index === -1) {
        console.log("Object with the given id not found");
        return;
      }
      if (direction === "up" && index > 0) {
        [certArray[index], certArray[index - 1]] = [certArray[index - 1], certArray[index]];
      } else if (direction === "down" && index < certArray.length - 1) {
        [certArray[index], certArray[index + 1]] = [certArray[index + 1], certArray[index]];
      } else {
        console.log("Move not possible");
      }
      certArray.forEach((item: any, idx: number) => this.userStore.updateCertificationItem(item, idx));
    }

  }
}

