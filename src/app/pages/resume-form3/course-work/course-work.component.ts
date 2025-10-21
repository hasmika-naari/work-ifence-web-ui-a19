import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, effect, inject, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
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
import { Education, IsSectionPresent, JobDescriptionAIResponse, Resume, TemplateVariables, courseWork } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { SectionDesc } from 'src/app/services/store/user-store';


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
    MatIconModule,MatExpansionModule, MatAutocompleteModule, MatChipsModule, MatTooltipModule],
  templateUrl: './course-work.component.html',
  styleUrls: ['./course-work.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class CourseWorkComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() resetFormTrigger: boolean = false;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetFormTrigger'] && !changes['resetFormTrigger'].firstChange) {
      // Reset only coursework and institution fields, not section title
      this.isEditMode = false;
      this.selectedCourseWorkForEdit = null;
      this.courseWorkForm.patchValue({
        coursework: '',
        institution: ''
      });
      this.courseWorkForm.markAsUntouched();
      this.courseWorkForm.markAsPristine();
    }
  }
 
  selectable = true;
  removable = true;
  fruits: courseWork[] = [];
  isEditMode = false;
  selectedCourseWorkForEdit: courseWork | null = null;
  private _formBuilder: FormBuilder = inject(FormBuilder);

  // Form change detection properties
  private originalFormValues: any = {};
  hasFormChanged = false;

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
    sections : Signal<SectionDesc[]> = this.userStore.getCurrentSections();
      multipleSections : Signal<SectionDesc[][]> = this.userStore.getMultipleColumnTemplateSections(); 
  selectedCourseWork: Signal<courseWork> = this.userStore.getSelectedCourseWork(); 

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
        
        // Effect to handle course work editing
        effect(() => {
          const selectedCourse = this.selectedCourseWork();
          if (selectedCourse && selectedCourse.id !== -1) {
            this.loadCourseWorkForEdit(selectedCourse);
          }
        })
      }


    ngAfterViewChecked() {}


  courseWorkForm = this._formBuilder.group({
    coursework: [''],
    institution: [''],
    section_title : ['', Validators.required] 
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

    // Setup form change detection
    this.setupFormChangeDetection();
  }

  private setupFormChangeDetection(): void {
    // Subscribe to form value changes
    this.courseWorkForm.valueChanges.subscribe(() => {
      this.checkForFormChanges();
    });

    // Capture initial form values after they are set
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }

  private captureOriginalFormValues(): void {
    this.originalFormValues = { ...this.courseWorkForm.value };
    this.hasFormChanged = false;
  }

  private checkForFormChanges(): void {
    const currentValues = this.courseWorkForm.value;
    this.hasFormChanged = JSON.stringify(currentValues) !== JSON.stringify(this.originalFormValues);
  }

  getButtonTooltip(): string {
    if (this.courseWorkForm.invalid) {
      return 'Please fill in all required fields';
    }
    if (!this.hasFormChanged && !this.isEditMode) {
      return 'No changes to save';
    }
    if (this.isEditMode && !this.isFormDirty()) {
      return 'No changes made to update';
    }
    return this.isEditMode ? 'Update Course Work' : 'Add Course Work';
  }



  setCourseWorkValues(){  
    this.fruits = [...this.resumeSignalForm().courseWork]
    let section_title;
    if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
      this.multipleSections().map((e : SectionDesc[])=>{
        e.map((section : SectionDesc)=>{
          if(section.section == 'RELEVANT_COURSEWORK'){
            section_title = section.editable_section_title
          }
        })
      })
    }
    else{
      this.sections().map((section : SectionDesc)=>{
          if(section.section == 'RELEVANT_COURSEWORK'){
            section_title = section.editable_section_title
          }
        })
    }
    this.courseWorkForm.controls['section_title'].setValue(section_title??'')
    
    // Capture original values after setting form values
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }


 

  saveAndContinue(){
    this.markFormGroupTouched(this.courseWorkForm);

    if (this.isEditMode && this.selectedCourseWorkForEdit) {
      // Update existing course work
      this.selectedCourseWorkForEdit.courseworkname = this.courseWorkForm.controls['coursework'].value?.trim() || '';
      this.selectedCourseWorkForEdit.institution = this.courseWorkForm.controls['institution'].value?.trim() || '';

      // Update the fruits array and store
      this.userStore.addCourseWork(this.fruits);

      // Reset edit mode and clear selected course work in store
      this.isEditMode = false;
      this.selectedCourseWorkForEdit = null;
      const emptyCourseWork = new courseWork();
      this.userStore.updateCourseWork(emptyCourseWork);

      // Reset only the coursework and institution fields for edit mode (not section title)
      this.courseWorkForm.patchValue({
        coursework: '',
        institution: ''
      });
      this.courseWorkForm.markAsUntouched();
      this.courseWorkForm.markAsPristine();

      // Capture new original values after reset
      setTimeout(() => {
        this.captureOriginalFormValues();
      }, 100);
    } else {
      // Add new course work from form
      const courseworkName = this.courseWorkForm.controls['coursework'].value?.trim();
      const institution = this.courseWorkForm.controls['institution'].value?.trim();
      const sectionTitle = this.courseWorkForm.controls['section_title'].value?.trim();

      if (courseworkName && institution && sectionTitle) {
        const newCourseWork = new courseWork();
        newCourseWork.id = this.fruits.length > 0 ? Math.max(...this.fruits.map(f => f.id)) + 1 : 1;
        newCourseWork.courseworkname = courseworkName;
        newCourseWork.institution = institution;
        newCourseWork.isHideSelected = false;

        this.fruits.push(newCourseWork);
        this.userStore.addCourseWork(this.fruits);
      }

      // For add mode, reset only coursework and institution fields, not section title
      this.courseWorkForm.patchValue({
        coursework: '',
        institution: ''
      });

      // Capture new original values after reset
      setTimeout(() => {
        this.captureOriginalFormValues();
      }, 100);
    }
    
    if(!this.sectionStatus().isCourseWork){
      let status = this.sectionStatus()
      status.isCourseWork = true;
      this.userStore.updateSectionStatus(status);
    }
    if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
      this.multipleSections().map((e : SectionDesc[])=>{
        e.map((section : SectionDesc)=>{
          if(section.section == 'RELEVANT_COURSEWORK'){
            section.editable_section_title = this.courseWorkForm.controls['section_title'].value?? ''
          }
        })
      })
      this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
    }
    else{
      this.sections().map((section : SectionDesc)=>{
          if(section.section == 'RELEVANT_COURSEWORK'){
            section.editable_section_title = this.courseWorkForm.controls['section_title'].value?? ''
          }
        })
        this.userStore.setResumeSections(this.sections())
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
        lowerFruits = [...lowerFruits, e.courseworkname.toLowerCase()]
      })
      if (this.courseWorkForm.controls['coursework'].value && !lowerFruits.includes(this.courseWorkForm.controls['coursework'].value.toLowerCase())) {
        const newCourseWork = new courseWork();
        newCourseWork.id = Date.now(); // Generate a unique ID
        newCourseWork.courseworkname = this.courseWorkForm.controls['coursework'].value.trim();
        newCourseWork.institution = this.courseWorkForm.controls['institution'].value?.trim() || '';
        this.fruits.push(newCourseWork);
      }
      this.courseWorkForm.controls['coursework'].setValue(null);
      this.courseWorkForm.controls['institution'].setValue(null);
      lowerFruits = []
    }

  remove(fruit: courseWork): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  isVisible(){
    return this.courseWorkForm.controls['coursework'].value?this.courseWorkForm.controls['coursework'].value.length > 0 : false 
  }

  loadCourseWorkForEdit(courseWork: courseWork): void {
    this.isEditMode = true;
    this.selectedCourseWorkForEdit = courseWork;
    
    // Preserve the current section title
    const currentSectionTitle = this.courseWorkForm.controls['section_title'].value;
    
    // Load the selected course work data into the form
    this.courseWorkForm.patchValue({
      coursework: courseWork.courseworkname,
      institution: courseWork.institution,
      section_title: currentSectionTitle || 'Relevant Coursework' // fallback if no current title
    });
    
    // Capture original values for edit mode
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }

  isFormDirty(): boolean {
    return this.courseWorkForm.dirty;
  }

}
