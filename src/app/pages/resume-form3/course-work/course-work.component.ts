import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
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
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Education, IsSectionPresent, JobDescriptionAIResponse, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-course-work',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, MatAutocompleteModule, MatChipsModule],
  templateUrl: './course-work.component.html',
  styleUrls: ['./course-work.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class CourseWorkComponent implements OnInit, OnDestroy, AfterViewChecked {
 
  selectable = true;
  removable = true;
  fruits: string[] = [];
  private _formBuilder: FormBuilder = inject(FormBuilder);

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();


  @Output() contact = new EventEmitter();


  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog) {
        effect(()=>{
          this.setCourseWorkValues()
        })
      }


    ngAfterViewChecked() {}


  courseWorkForm = this._formBuilder.group({
    coursework: [''],
  });

  subs: Array<Subscription> = [];
  overlayVisible = true;


  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  ngOnInit() {
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        console.log('Current route does not match the desired route');
      }
    }));
  }



  setCourseWorkValues(){  
  this.fruits = [...this.resumeSignalForm().courseWork]
}


 

  saveAndContinue(){
    this.markFormGroupTouched(this.courseWorkForm);
    this.userStore.addCourseWork(this.fruits);
    this.courseWorkForm.reset()
    if(!this.sectionStatus().isCourseWork){
      let status = this.sectionStatus()
      status.isCourseWork = true;
      this.userStore.updateSectionStatus(status);
    }
    this.contact.emit();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }



    addSkill(): void {
      let lowerFruits : string[]= []
      this.fruits.map((e)=>{
        lowerFruits = [...lowerFruits, e.toLowerCase()]
      })
      if (this.courseWorkForm.controls['coursework'].value && !lowerFruits.includes(this.courseWorkForm.controls['coursework'].value.toLowerCase())) {
        this.fruits.push(this.courseWorkForm.controls['coursework'].value.trim());
      }
      this.courseWorkForm.controls['coursework'].setValue(null);
      lowerFruits = []
    }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  isVisible(){
    return this.courseWorkForm.controls['coursework'].value?this.courseWorkForm.controls['coursework'].value.length > 0 : false 
  }

}
