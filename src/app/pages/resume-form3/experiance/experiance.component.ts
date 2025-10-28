import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, Signal, SimpleChanges, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TooltipModule } from 'primeng/tooltip';

import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Education, Experience, IsSectionPresent, JobDescriptionAIResponse, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { ResumeService } from 'src/app/services/resume.service';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EditorModule} from 'primeng/editor';
import { Editor, Toolbar } from 'ngx-editor';
import { SharedNgxEditorModule } from 'src/app/shared/shared-ngx-editor.module';


import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SectionDesc } from 'src/app/services/store/user-store';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

export interface WorkData{
  bulletPoints : string[];
  ats_score : string;
}

@Component({
  selector: 'app-resume-experience',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
    provideMomentDateAdapter(MY_FORMATS),
    MessageService
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent, MatTooltipModule,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,MatDatepickerModule,
    MatFormFieldModule,InputTextModule,TableModule,CalendarModule,DropdownModule,
    MatInputModule,ButtonModule,OverlayPanelModule,PanelModule,
    MatButtonModule,AccordionModule,TextareaModule,TooltipModule,
  SharedNgxEditorModule, FormsModule,
    MatIconModule,MatExpansionModule, MatCheckboxModule, MatCardModule, ProgressSpinnerModule, ToastModule, EditorModule],
  templateUrl: './experiance.component.html',
  styleUrls: ['./experiance.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ExperianceComponent implements OnInit, OnDestroy, OnChanges {
  get descriptionControl(): FormControl {
    return this.experienceForm.get('description') as FormControl;
  }
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  // Bullet style for AI response insertion
  selectedBulletStyle: 'disc' | 'circle' | 'square' = 'disc';

  moveExperienceUp(index: number): void {
    if (index > 0) {
      const temp = this.experience_list[index - 1];
      this.experience_list[index - 1] = this.experience_list[index];
      this.experience_list[index] = temp;
      this.hasFormChanged = true;
      this.saveExperienceListToStore();
    }
  }

  moveExperienceDown(index: number): void {
    if (index < this.experience_list.length - 1) {
      const temp = this.experience_list[index + 1];
      this.experience_list[index + 1] = this.experience_list[index];
      this.experience_list[index] = temp;
      this.hasFormChanged = true;
      this.saveExperienceListToStore();
    }
  }

  saveExperienceListToStore(): void {
    // Persist the reordered experience_list to the store, ensuring all Experience fields are present
    const mappedList = this.experience_list.map(item => ({
      id: (item.id !== undefined && item.id !== null) ? String(item.id) : '',
      position_title: item.position_title ? item.position_title.toString() : '',
      company_name: item.company_name ? item.company_name.toString() : '',
      location: item.location ? item.location.toString() : '',
      start_date: item.start_date ? item.start_date.toString() : '',
      end_date: item.end_date ? item.end_date.toString() : '',
      description: item.description ? item.description.toString() : '',
      isCurrentlyWorkHere: (item as any).isCurrentlyWorkHere ?? false,
      isHideSelected: (item as any).isHideSelected ?? false,
      bullet_points_count: (item as any).bullet_points_count ? (item as any).bullet_points_count.toString() : '',
      original_description_html: (item as any).original_description_html ? (item as any).original_description_html.toString() : ''
    }));
    const resume = { ...this.resumeSignalForm(), experience: mappedList };
    this.userStore.setResumeForm(resume);
  }

  // showCalenderIcon: boolean = true;
  resumeForm!: FormGroup;
  contactForm! : FormGroup
  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  today: Date = new Date();
  // showProfileImage : boolean = false
  // eduForm!: FormGroup;
  workForm! : FormGroup;

  leftPosition = '530px';
  width = 0;
  borderWidth = 0;
  isOpen = false;
  isPanelOpen = false; // New property for overlay state
  workExperienceAIResponses : Array<WorkData> = []
  action_taken : string = ''
  optimize_index : any = -1
  showActions: number = -1; // Track which experience item should show action buttons

  // userProjectForm! : FormGroup
  // certificationForm! : FormGroup
  // listed_skills : Array<String> = ['Java', 'Python','Angular', 'NodeJS', 'ReactJS']
  listed_coursework : Array<String> = ['Data Structures and Algorithms','Object-Oriented Programming','Database Management Systems','Computer Networks','Operating Systems','Software Engineering','Artificial Intelligence','Web Development', 'Data Structures']

  experience_list : {id : number,position_title : String | null, company_name : String | null, location : String | null, start_date : String | null, end_date : String | null, description : String | null}[] = []

  selectedExperienceItem! : {id : string | null,position_title : String | null, company_name : String | null, location : String | null, start_date : String | null, end_date : String | null, description : String | null}

  // Form change detection properties
  private originalFormValues: any = {};
  hasFormChanged = false;

  // project_list : {id : number,project_title : String | null, project_link : String | null, technologies_used : String | null, description : String | null}[] = []

  // selectedProjectItem! : {id : number | null,project_title : String | null, project_link : String | null, technologies_used : String | null, description : String | null}

  // education_list : {id : number,school_name: String | null,school_location: String | null,degree: String | null,field_of_study: String | null,gpa: String | null,graduation_year: String | null}[] = []

  // selectedEducationItem! : {id : number | null,school_name: String | null,school_location: String | null,degree: String | null,field_of_study: String | null,gpa: String | null,graduation_year: String | null}

  // certification_list : {id : number,certification_name: String | null,issued_organisation: String | null,issued_month: String | null,issued_year: String | null,certification_link: String | null,description: String | null}[] = []

  // selectedCertificationItem! : {id : number | null,certification_name: String | null,issued_organisation: String | null,issued_month: String | null,issued_year: String | null,certification_link: String | null,description: String | null}

  // Track which AI bullets have been added
  addedAIBullets = new Set<number>();

  // skills_list : {id : number, skills : String | null}[] = []

  // selectedSkillItem! : {id : number | null, skills : String | null}

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();

  selectedExperience : Signal<Experience> = this.userStore.getSelectedExperience();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  jobDescAISuggestions : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  selectedAIResponse : WorkData = {bulletPoints :[], ats_score : ""}
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  private _formBuilder: FormBuilder = inject(FormBuilder);
  sections : Signal<SectionDesc[]> = this.userStore.getCurrentSections();
  multipleSections : Signal<SectionDesc[][]> = this.userStore.getMultipleColumnTemplateSections(); 
  
  

  visible = true;
  outLineButton = true;
  @Output() contact = new EventEmitter();

  @Input() isFormPanleClosed : boolean = false;

  aiResponsePoint = new FormControl();

  @ViewChild(Editor) editorComponent!: Editor;

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog,
      public resumeService : ResumeService,
      private messageService: MessageService,
      @Inject(PLATFORM_ID) private platformId: Object) {
        
      console.log('Experience component constructor called');
        
      // Add reactive effect to watch for selectedExperience changes
      effect(() => {
        const selected = this.selectedExperience();
        console.log('Experience effect triggered, selected:', selected);
        if (selected && selected.position_title) {
          console.log('Setting experience values for:', selected.position_title);
          (this as any).setExperienceValues();
          this.selectedExperienceItem = selected; // Set the selected item for editing
          console.log('selectedExperienceItem set to:', this.selectedExperienceItem);
          // Track which AI bullets have been added
          this.addedAIBullets = new Set<number>();
        } else {
          console.log('No valid selected experience, resetting form for new entry');
          // Reset selectedExperienceItem for new entry
          this.selectedExperienceItem = {id : null,position_title : null, company_name : null, location : null, start_date : null, end_date : null, description : null};
          // Reset form for new entry
          this.experienceForm.reset();
          this.experienceForm.get('section_title')?.setValue('Experience');
        }
      }, { allowSignalWrites: true });

      // Add reactive effect to populate experience_list from store
      // effect(() => {
      //   const resume = this.resumeSignalForm();
      //   if (resume && resume.sections) {
      //     const section = resume.sections.find((s: any) => s.section === 'WORK_EXPERIENCE');
      //     const experienceItems = section?.items?.map((i: any) => i.data) || [];
      //     if (experienceItems && experienceItems.length > 0) {
      //       this.experience_list = experienceItems.map((exp: any, index: number) => ({
      //         id: exp.id,
      //         position_title: exp.position_title || null,
      //         company_name: exp.company_name || null,
      //         location: exp.location || null,
      //         start_date: exp.start_date || null,
      //         end_date: exp.end_date || null,
      //         description: exp.description || null
      //       }));
      //       console.log('Experience list updated from store:', this.experience_list);
      //     } else {
      //       this.experience_list = [];
      //     }
      //   } else {
      //     this.experience_list = [];
      //   }
      // });
      }

  experienceForm = this._formBuilder.group({
    position_title: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9 .-]+$")]],
    company_name: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9 &',.-]+$")]],
    location : [''],
    start_date: new FormControl<Date | null>(null, [Validators.required]),
    end_date: new FormControl<Date | null>(null, [Validators.required]),
    start: new FormControl<Moment | null>(null),
    end:  new FormControl<Moment | null>(null),
    description : [''],
    isCurrentlyWorkHere : [false],
    bullet_points : [''],
    content: [''], // Bind FormControl here
    section_title : ['Experience', Validators.required]
  });
  
  public sdate = new FormControl<Date>(new Date());
  public edate = new FormControl<Date>(new Date());
  
  // educationForm = this._formBuilder.group({
  //   school_name: [''],
  //   school_location: [''],
  //   degree: [''],
  //   field_of_study: [''],
  //   gpa: [''],
  //   graduation_year: ['']
  // });
  // skillsForm = this._formBuilder.group({
  //   skills: [''],
  // });
  // courseWorkForm = this._formBuilder.group({
  //   coursework : ['']
  // })
  // summaryForm = this._formBuilder.group({
  //   profile_summary: [''],
  // });
  // certificationsForm = this._formBuilder.group({
  //   certifications : [''],
  // });
  // projectForm = this._formBuilder.group({
  //     project_title: [''],
  //     technologies_used: [''],
  //     project_link : [''],
  //     description : ['']
  // });
  // certifyForm = this._formBuilder.group({
  //     certification_name : [''],
  //     issued_organisation : [''],
  //     issued_month : [''],
  //     issued_year : [''],
  //     certification_link : [''],
  //     description : ['']
  // })
  // achievementForm = this._formBuilder.group({
  //   achievement : ['']
  // })

  // summaryRequestForm = this._formBuilder.group({
  //   position_highlight : ['', Validators.required],
  //   skills_highlight : ['', Validators.required]
  // })



  workHistoryList : Array<string> = []
  educationGeminiResponse : Array<Education>  | null = null
  technical_skills_genai : Array<String> | null= null
  soft_skills_genai : Array<String> | null = null
  profile_summary_genai : Array<String> | null = null 
  projectList_genai : Array<String> | null= null
  achievement_genai : Array<String> | null = null

  is_work_history_loading : boolean = false
  is_education_loading : boolean = false
  is_skills_loading : boolean = false
  is_projects_loading : boolean = false
  is_certifications_loading : boolean = false
  is_summary_loading : boolean = false;
  is_achievement_loading : boolean = false;

  isWorkHistorySkipped : boolean = false;
  isEducationSkipped : boolean = false;
  isSkillsSkipped : boolean = false;
  isProjectsSkipped : boolean = false;
  isSummarySkipped : boolean = false;
  isAchievementsSkipped : boolean = false;

  currentWorkExpIndex : number = 0
  currentProjectIndex : number = 0

  subs: Array<Subscription> = [];
  overlayVisible = true;
  selectedTemplate : Array<TemplateVariables> = [
    {
        template_name : 'delloite_template',
        name : true,
        email : true,
        phone_number : true,
        address : false,
        linkedIn_profile : true,
        github_profile : true,
        role : true,
        profile_summary : true,
        experience : true,
        education : true,
        skills : true,
        certification : true,
        project : true,
        awards : false,
        languages : false,
        interests : false,
        volunteer_experiences : false,
        professional_memberships : false,
        publications : false,
        profile_image : true
      }
  ];

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
    this.userStore.updateExperience(new Experience());
    this.subs.forEach(s => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['isFormPanleClosed']) {
      this.closePanelWindow();
    }
  }

  editAIResponse(index : number){
    this.optimize_index = index
    this.action_taken = 'EDIT'
    this.aiResponsePoint.setValue(this.workHistoryList[index]);
  }

  updatePoint(index : number){
    this.workHistoryList[index] = this.aiResponsePoint.value;
    this.aiResponsePoint.reset();
    this.action_taken = ''
    this.optimize_index = -1
  }

  cancelPoint(index : number){
    this.aiResponsePoint.reset();
    this.action_taken = ''
    this.optimize_index = -1
  }

  toggle() {
    this.overlayVisible = !this.overlayVisible;
}

toggleAnimation() {
  // this.isOpen = !this.isOpen;
  this.width = this.isOpen ? 450 : 0; // Toggle between expanded and collapsed
}

closePanelWindow(){
  this.isOpen = false;
  this.width = 0;
  this.borderWidth = 0;
  this.isPanelOpen = false; // Close overlay
}

openPanelWindow(){
  this.isOpen = true;
  this.width = 450;
  this.borderWidth = 3;
  this.isPanelOpen = true; // Open overlay
}

setStartDateMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  const ctrlValue = this.sdate.value ?? new Date();
  const newDate = new Date(ctrlValue);
  newDate.setMonth(normalizedMonthAndYear.month());
  newDate.setFullYear(normalizedMonthAndYear.year());
  this.sdate.setValue(newDate);
  datepicker.close();
}

setEndDateMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  const ctrlValue = this.edate.value ?? new Date();
  const newDate = new Date(ctrlValue);
  newDate.setMonth(normalizedMonthAndYear.month());
  newDate.setFullYear(normalizedMonthAndYear.year());
  this.edate.setValue(newDate);
  datepicker.close();
}

  private setupFormChangeDetection(): void {
    // Subscribe to form value changes
    this.experienceForm.valueChanges.subscribe(() => {
      this.checkForFormChanges();
    });

    // Capture initial form values after they are set
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }

  private captureOriginalFormValues(): void {
    const formValues = { ...this.experienceForm.value };
    this.originalFormValues = { ...formValues };
    this.hasFormChanged = false;
  }

  private checkForFormChanges(): void {
    const currentFormValues = this.experienceForm.value;
    this.hasFormChanged = JSON.stringify(currentFormValues) !== JSON.stringify(this.originalFormValues);
  }

  get isEditingExistingExperience(): boolean {
    return this.selectedExperienceItem && this.selectedExperienceItem.id !== null && this.selectedExperienceItem.id !== undefined;
  }

  getButtonTooltip(): string {
    if (this.experienceForm.invalid) {
      return 'Please fill in all required fields';
    }
    if (!this.hasFormChanged) {
      return 'No changes to save';
    }
    return 'Add to Resume';
  }

  ngOnInit() {
    console.log('Experience component ngOnInit called');
    // Initialize the editor instance
    this.editor = new Editor();
    // Temporarily disable router subscription and form change detection to prevent hanging
    // this.subs.push(this.router.events.subscribe(() => {
    //   const currentUrl = this.router.url;
    //   if (currentUrl.includes('/resumes/resume')) {
    //     // The current active route matches the desired route
    //     // console.log('Current route matches the desired route');
    //     this.userStore.updateSidebar(true);
    //   } else if(currentUrl.includes('/user/resumes')){
    //     this.userStore.updateSidebar(false);
    //     // The current active route does not match the desired route
    //     console.log('Current route does not match the desired route');
    //   }
    // }));

    // Setup form change detection
    this.setupFormChangeDetection();
    // Set the editor reference for getEditorData method
    // if (this.editorComponent) {
    //   this.editor = this.editorComponent.quill;
    // }
  }

  // get eduFields() {
  //   return this.eduForm.get('edu_fields') as FormArray;
  // }

  get workFields(){
    return this.workForm.get('work_fields') as FormArray;
  }

  // get projectFields(){
  //   return this.userProjectForm.get('project_fields') as FormArray;
  // }

  // get certificationFields(){
  //   return this.certificationForm.get('certification_fields') as FormArray;
  // }

  onRowSelect(event: TableRowSelectEvent, op: OverlayPanel) {
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    op.hide();
}

  setExperienceValues(){
    
    let start = this.selectedExperience().start_date;
    let endd = this.selectedExperience().end_date;
    this.experienceForm.controls['position_title'].setValue(this.selectedExperience().position_title) 
    this.experienceForm.controls['company_name'].setValue(this.selectedExperience().company_name)
    this.experienceForm.controls['location'].setValue(this.selectedExperience().location)
    this.experienceForm.controls['start_date'].setValue(moment(start).toDate());
    this.experienceForm.controls['description'].setValue(this.selectedExperience().description)
    // this.experienceForm.controls['bullet_points'].setValue(this.selectedExperience().bullet_points_count);
    if(this.selectedExperience().isCurrentlyWorkHere){
      this.experienceForm.controls['end_date'].disable();
      this.experienceForm.controls['isCurrentlyWorkHere'].setValue(true);
    } 
    else{
      this.experienceForm.controls['end_date'].setValue(moment(endd).toDate()); 
      this.experienceForm.controls['isCurrentlyWorkHere'].setValue(false)
    }
    let section_title;
    console.log(this.sections());
    
        if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
          this.multipleSections().map((e : SectionDesc[])=>{
            e.map((section : SectionDesc)=>{
              if(section.section == 'WORK_EXPERIENCE'){
                section_title = section.editable_section_title
              }
            })
          })
        }
        else{
          this.sections().map((section : SectionDesc)=>{
              if(section.section == 'WORK_EXPERIENCE'){
                section_title = section.editable_section_title
              }
            })
        }
        this.experienceForm.controls['section_title'].setValue(section_title??'Experience')
        
        // Capture original values immediately after setting form values
        this.captureOriginalFormValues();
  }

  // addEducationField() {
  //   const educationField = this._formBuilder.group({
  //     school_name: [''],
  //     school_location: [''],
  //     degree: [''],
  //     field_of_study: [''],
  //     gpa: [''],
  //     graduation_month: [''],
  //     graduation_year: [''],
  //     expanded : [true]
  //   });

  //   this.eduFields.push(educationField);
  // }

  addWorkField() {
    const workField = this._formBuilder.group({
      exp_title: 'Experience ' + this.workFields.length.toString(),
      position_title: [''],
      company_name: [''],
      location : [''],
      start_date:  new FormControl(new Date()),
      end_date:  new FormControl(new Date()),
      current_work_check : [false],
      description : ['']
    });

    this.workFields.push(workField);
  }

  // addProjectField() {
  //   const projectField = this._formBuilder.group({
  //     project_title: [''],
  //     technologies_used: [''],
  //     project_link : [''],
  //     description : ['']
  //   });

  //   this.projectFields.push(projectField);
  // }

  // addCertificationField(){
  //   const certificationField = this._formBuilder.group({
  //     certification_name : [''],
  //     issued_organisation : [''],
  //     issued_month : [''],
  //     issued_year : [''],
  //     certification_link : [''],
  //     description : ['']
  //   })

  //   this.certificationFields.push(certificationField);
  // }

  // removeEducationField(index: number) {
  //   this.eduFields.removeAt(index);
  //   this.panels = this.panels.filter((item)=>{return item.id != index})
  //   console.log(this.panels);
  // }

  removeWorkField(index: number) {
    this.workFields.removeAt(index);
    this.work_panels = this.work_panels.filter((item)=>{return item.id != index})
    console.log(this.work_panels);
  }

  // removeProjectField(index: number) {
  //   this.projectFields.removeAt(index);
  //   this.project_panels = this.project_panels.filter((item)=>{return item.id != index})
  //   console.log(this.project_panels);
  // }

  // removeCertificationField(index: number) {
  //   this.certificationFields.removeAt(index);
  //   this.certification_panels = this.certification_panels.filter((item)=>{return item.id != index})
  //   console.log(this.certification_panels);
  // }

  saveAndContinue(){
    if(this.experienceForm.invalid){
      return;
    }
    console.log("In Save");
    console.log('selectedExperienceItem:', this.selectedExperienceItem);
    console.log('Has ID:', this.selectedExperienceItem?.id);
    this.markFormGroupTouched(this.experienceForm);
    let exp = new Experience();
    exp.company_name = this.experienceForm.value.company_name?this.experienceForm.value.company_name : '';
    // exp.description = this.experienceForm.value.description?this.experienceForm.value.description.split('\n').filter((item)=>{return item != ""}) : [];
    let des = this.experienceForm.value.description || '';
    exp.description = des;
    exp.original_description_html = des;
    if(this.experienceForm.value.isCurrentlyWorkHere){
      exp.end_date = "Present"
    }
    else{
      var split_end_date = this.experienceForm.value.end_date?this.experienceForm.value.end_date?.toString().split(" ") : [];
      var end_date = ""
      if(split_end_date.length > 2){
        end_date = split_end_date[1] + " " + split_end_date[3];
        console.log(end_date);
        
      }
      else{
        end_date = this.experienceForm.value.end_date?this.experienceForm.value.end_date.toString() : ''
      }
      exp.end_date = end_date;
    }
    var split_start_date = this.experienceForm.value.start_date?this.experienceForm.value.start_date?.toString().split(" ") : [];
    var start_date = ""
    if(split_start_date.length > 2){
      start_date = split_start_date[1] + " " + split_start_date[3];
    }
    else{
      start_date = this.experienceForm.value.start_date?this.experienceForm.value.start_date.toString() : ''
    }
    exp.location = this.experienceForm.value.location?this.experienceForm.value.location : '';
    exp.position_title = this.experienceForm.value.position_title?this.experienceForm.value.position_title : '';
    exp.start_date = start_date;
    exp.isCurrentlyWorkHere = this.experienceForm.controls['isCurrentlyWorkHere'].value != null?this.experienceForm.controls['isCurrentlyWorkHere'].value : false ;
    exp.bullet_points_count = this.experienceForm.value.bullet_points?this.experienceForm.value.bullet_points : '';

    // Find the WORK_EXPERIENCE section and its items
    const resume = this.resumeSignalForm();
    if (!resume || !resume.sections) {
      console.error('Resume or sections not available');
      return;
    }
    const experienceSection = resume.sections.find((section: any) => section.section === 'WORK_EXPERIENCE');
    const experienceItems = experienceSection?.items || [];
    
    if(this.selectedExperienceItem && this.selectedExperienceItem.id !== null && this.selectedExperienceItem.id !== undefined){
      console.log('UPDATE MODE: Updating existing experience with ID:', this.selectedExperienceItem.id);
      exp.id = this.selectedExperienceItem.id;
      const index = experienceItems.findIndex((obj: any) => obj.id === this.selectedExperienceItem?.id);
      console.log('Found index in store:', index);
      this.userStore.updateExperienceItem(exp, index);
    }
    else{ 
      console.log('ADD MODE: Adding new experience');
      exp.id = (experienceItems.length + 1).toString(); // Ensure ID is string for store
      this.userStore.addExperienceItem(exp);
    }
    this.userStore.setExperience(new Experience());
    this.experienceForm.reset();
    // Reset selectedExperienceItem after save
    this.selectedExperienceItem = {id : null,position_title : null, company_name : null, location : null, start_date : null, end_date : null, description : null};
    
    // Removed default bullet_points value - form should be completely empty
    
    // Reset change tracking after save
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
    if(!this.sectionStatus().isExperience){
      let status = this.sectionStatus()
      status.isExperience = true;
      this.userStore.updateSectionStatus(status);
    }
    if(this.resumeSignalForm() && this.resumeSignalForm().template_details && this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
          const multipleSections = this.multipleSections();
          if(multipleSections && multipleSections.length > 0){
            multipleSections.map((e : SectionDesc[])=>{
              if(e && e.length > 0){
                e.map((section : SectionDesc)=>{
                  if(section && section.section == 'WORK_EXPERIENCE'){
                    section.editable_section_title = this.experienceForm.controls['section_title'].value??'Experience'
                  }
                })
              }
            })
            this.userStore.setMultipleColumnTemplateSections(multipleSections)
          }
        }
        else{
          const sections = this.sections();
          if(sections && sections.length > 0){
            sections.map((section : SectionDesc)=>{
                if(section && section.section == 'WORK_EXPERIENCE'){
                 section.editable_section_title = this.experienceForm.controls['section_title'].value??'Experience'
                }
              })
            this.userStore.setResumeSections(sections)
          }
        }
    this.closePanelWindow()
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

  onFileSelected(event: any) {
    // this.showProfileImage = true;
    const file: File = event.target.files[0];
    if (file) {
      this.convertImageToBase64(file);
    }
  }

  convertImageToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer: ArrayBuffer | null = reader.result as ArrayBuffer; // Get the ArrayBuffer
      if (arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer); // Create a Uint8Array view
        this.imageBase64 = this.arrayBufferToBase64(uint8Array); // Convert to base64
        console.log('Image converted to base64:', this.imageBase64);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  getImageBase64(){
    return "data:image/png;base64, " + this.imageBase64;
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    buffer.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  onSubmit(){

  }

  saveForm(){
    
  }

  back(){
    console.log(this.cPage);
    
    if(this.cPage == 0){
      this.router.navigateByUrl("/resume-templates")
    }
    this.cPage = this.cPage - 2;
  }
  next(){
    console.log(this.cPage);
    
    this.cPage = this.cPage + 1;
    console.log(this.cPage);

    if(this.cPage == 1 || this.cPage == 2){
      this.handleStepper("Work_History")
    }
    else if(this.cPage ==3 || this.cPage == 4){
      this.handleStepper("Education")
    }
    else if(this.cPage == 5 || this.cPage == 6){
      this.handleStepper("Skills")
    }
    else if(this.cPage == 7 || this.cPage == 8){
      this.handleStepper("Summary")
    }
    else if(this.cPage == 9 || this.cPage == 10){
      this.handleStepper("Project")
    }
    else if(this.cPage == 11 || this.cPage == 12){
      this.handleStepper("Achievement")
    }
    else if(this.cPage == 13 || this.cPage == 14){
      this.handleStepper("Finalize")
    }
  }

  isBeforeSectionsCompleted(step : any){
    if(step == 'Heading'){
      return true;
    }
    else if(step == 'Work_History'){
      return this.contactForm.valid;
    }
    // else if(step == 'Education'){
    //     return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped);
    // }
    // else if(step == 'Skills'){
    //   return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped);
    // }
    // else if(step == 'Summary'){
    //   return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped);
    // }
    // else if(step == 'Project'){
    //   return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped);
    // }
    // else if(step == 'Achievement'){
    //   return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped) && (this.projectForm.valid || this.isProjectsSkipped);
    // }
    // else if(step == 'Finalize'){
    //   return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped) && (this.projectForm.valid || this.isProjectsSkipped) && (this.achievementForm.valid || this.isAchievementsSkipped);
    // }
    else{
      return true;
    }
  }

  handleStepper(step : any){
    console.log("*************");
    
    if(step == 'Heading'){
      const element = document.getElementById("heading-circle");
      element?.classList.add("circle-selected")
      this.cPage = 0
    }
    else if(step == 'Work_History'){
      if(this.isBeforeSectionsCompleted('Work_History')){
        const element = document.getElementById("Work_History");
        element?.classList.add("circle-selected")
        this.cPage = 2
      }
    }
    else if(step == 'Education'){
      if(this.isBeforeSectionsCompleted('Education')){
        console.log("___________________________________");
        const element = document.getElementById("Education");
        element?.classList.add("circle-selected")
        this.cPage = 4
      }
    }
    else if(step == 'Skills'){
      if(this.isBeforeSectionsCompleted('Skills')){
        const element = document.getElementById("Skills");
        element?.classList.add("circle-selected")
        this.cPage = 6
      }
    }
    else if(step == 'Summary'){
      if(this.isBeforeSectionsCompleted('Summary')){
        const element = document.getElementById("Summary");
        element?.classList.add("circle-selected")
        this.cPage = 8
      }
    }
    else if(step == 'Project'){
      if(this.isBeforeSectionsCompleted('Project')){
        const element = document.getElementById("Project");
        element?.classList.add("circle-selected")
        this.cPage = 10
      }
    }
    else if(step == 'Achievement'){
      if(this.isBeforeSectionsCompleted('Achievement')){
        const element = document.getElementById("Achievement");
        element?.classList.add("circle-selected")
        this.cPage = 12
      }
    }
    else if(step == 'Finalize'){
      if(this.isBeforeSectionsCompleted('Finalize')){
        const element = document.getElementById("Finalize");
        element?.classList.add("circle-selected")
        this.cPage = 14
      }
    }
  }

  parseResponse(response : any) : any{
    try {
      // Attempt to parse the response as JSON
      return JSON.parse(response);
    } catch (error) {
      // If parsing fails, check if the response is wrapped in triple backticks and try to parse again
      const trimmedResponse = response.replaceAll('`', '').trim()
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(trimmedResponse);
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      
      
      
      if (trimmedResponse.startsWith('json')) {
        const jsonContent = trimmedResponse.slice(4,);
        console.log("-----------------------------------------------------------------------------");
        console.log(jsonContent);
        console.log("-----------------------------------------------------------------------------");
        return JSON.parse(jsonContent);
      }
      else if (trimmedResponse.startsWith('JSON')) {
        const jsonContent = trimmedResponse.slice(4, );
        console.log("-----------------------------------------------------------------------------");
        console.log(jsonContent);
        console.log("-----------------------------------------------------------------------------");
        return JSON.parse(jsonContent);
      }
      else
      {
        return JSON.parse(trimmedResponse.replaceAll('`', "").trim());
      }

    }
  }

  optimizeText(step : any) : void{
    if(step == 'Work_History'){
      // this.is_work_history_loading = true;
      // if(this.WorkHistoryFormGroup.controls['work_history'].value){
      //   const experience_prompt = this.promptService.getExperience_prompt(this.WorkHistoryFormGroup.controls['work_history'].value);
      //   this.genaiService.getGeminiProResponse(experience_prompt).then((response)=>{
      //     console.log(response);
      //     this.workHistoryList = this.parseResponse(response);
      //     this.is_work_history_loading = false;
      //   });
      // }
    }
    else if(step == 'Education'){
      // if(this.educationForm.controls['education'].value){
      //   this.is_education_loading = true;
      //   const edu_prompt = this.promptService.getEducation_Prompt(this.educationForm.controls['education'].value);
      //   this.genaiService.getGeminiProResponse(edu_prompt).then((response)=>{
      //     console.log(response);
      //     this.educationGeminiResponse = this.parseResponse(response);
      //     const element = document.getElementById("edu-card-info");
      //     if(element && this.educationGeminiResponse){
      //       element.innerHTML = this.templateService.formatEductionDevResume(this.educationGeminiResponse);
      //     }
      //     this.is_education_loading = false
      //   });
      // }
    }
    else if(step == 'Skills'){
      // if(this.skillsForm.controls['skills'].value){
      //   this.is_skills_loading = true
      //   const skills_prompt = this.promptService.getSkills_Prompt(this.skillsForm.controls['skills'].value);
      //   this.genaiService.getGeminiProResponse(skills_prompt).then((response)=>{
      //     console.log(response);
      //     this.technical_skills_genai = this.parseResponse(response)['technical_skills'];
      //     this.soft_skills_genai = this.parseResponse(response)['soft_skills'];
      //     const element = document.getElementById("skills-card-info");
      //     if(element && (this.technical_skills_genai || this.soft_skills_genai)){
      //       if(this.technical_skills_genai && this.soft_skills_genai){
      //         element.innerHTML = this.templateService.formatListItems([...this.technical_skills_genai, ...this.soft_skills_genai] );
      //       }
      //       else if(this.technical_skills_genai){
      //         element.innerHTML = this.templateService.formatListItems(this.technical_skills_genai);
      //       }
      //       else if(this.soft_skills_genai){
      //         element.innerHTML = this.templateService.formatListItems(this.soft_skills_genai);
      //       }
      //     }
      //     this.is_skills_loading = false
      //   });
      // }
    }
    else if(step == 'Summary'){
      // if(this.summaryForm.controls['profile_summary'].value){
      //   this.is_summary_loading = true;
      //   const role_input = this.contactForm.controls['role'].value?this.contactForm.controls['role'].value : "Software Engineer";
      //   const objective_prompt = this.promptService.getObjective_Propmt(role_input, this.summaryForm.controls['profile_summary'].value);
      //   this.genaiService.getGeminiProResponse(objective_prompt).then((response)=>{
      //     this.profile_summary_genai = response.split('\n').filter((item)=>{return item != ""});
      //     console.log(this.profile_summary_genai);
      //     const sheet = document.getElementById("sheet");
      //     if (sheet) {
      //       sheet.classList.toggle("open");
      //     }
      //     this.is_summary_loading = false
      //   });
      // }
    }
    else if(step == 'Project'){
      // if(this.projectForm.controls['projects'].value){
      //   this.is_projects_loading = true;
      //   const project_prompt = this.promptService.getProject_Prompt(this.projectForm.controls['projects'].value);
      //   this.genaiService.getGeminiProResponse(project_prompt).then((response)=>{
      //     console.log(response);
      //     this.projectList_genai = this.parseResponse(response);
      //     this.is_projects_loading = false;
      //   });
      // }
    }
    else if(step == 'Achievement'){
      // if(this.achievementForm.controls['achievement'].value){
      //   this.is_achievement_loading = true;
      //   const achievement_prompt = this.promptService.getAchievement_Prompt(this.achievementForm.controls['achievement'].value);
      //   this.genaiService.getGeminiProResponse(achievement_prompt).then((response)=>{
      //     console.log(response);
      //     this.achievement_genai = response.split("###").filter((item)=>{return item != ""});
      //     console.log(this.achievement_genai);
      //     const element = document.getElementById("achievement-card-info");
      //     if(element && this.achievement_genai){
      //       element.innerHTML = this.templateService.formatListItems(this.achievement_genai);
      //     }
      //     this.is_achievement_loading = false;
      //   });
      // }
    }
  }

  goback($event: any){
    this.userStore.updateSidebar(false);
    this.router.navigateByUrl('/user/resumes');
  }

  skipHandler(step : String) : void{
    if(step == 'Work_History'){
      this.workFields.disable();
      this.isWorkHistorySkipped = true;
      const element = document.getElementById("Work_History");
      if(element){
        element.classList.add("circle-skipped")
      }
      // this.WorkHistoryFormGroup.controls['work_history'].clearValidators();
      this.cPage = 2
      this.next();
    }
    else if(step == 'Education'){
      // this.eduFields.disable();
      // this.isEducationSkipped = true;
      // const element = document.getElementById("Education");
      // if(element){
      //   element.classList.add("circle-skipped")
      // }
      // // this.educationForm.controls['education'].clearValidators();
      // this.cPage = 4
      // this.next();
    }
    else if(step == 'Skills'){
      // this.skillsForm.controls['skills'].disable();
      // this.isSkillsSkipped = true;
      // const element = document.getElementById("Skills");
      // if(element){
      //   element.classList.add("circle-skipped")
      // }
      // this.skillsForm.controls['skills'].clearValidators();
      // this.cPage = 6
      // this.next();
    }
    else if(step == 'Summary'){
    //  his.summaryForm.controls['profile_summary'].disable();
    //   this.isSummarySkipped = true;
    //   const element = document.getElementById("Summary");
    //   if(element){
    //     element.classL tist.add("circle-skipped")
    //   }
    //   this.summaryForm.controls['profile_summary'].clearValidators();
    //   this.cPage = 8
    //   this.next();
    }
    else if(step == 'Project'){
      // this.projectFields.disable();
      // this.isProjectsSkipped = true;
      // const element = document.getElementById("Project");
      // if(element){
      //   element.classList.add("circle-skipped")
      // }
      // // this.projectForm.controls['projects'].clearValidators();
      // this.cPage = 10
      // this.next();
    }
    else if(step == 'Achievement'){ 
      // this.achievementForm.controls['achievement'].disable();
      // this.isAchievementsSkipped = true;
      // const element = document.getElementById("Achievement");
      // if(element){
      //   element.classList.add("circle-skipped")
      // }
      // this.achievementForm.controls['achievement'].clearValidators();
      // this.cPage = 12
      // this.next();
    }
  }

  addSectionHandler(step : String) : void{
    if(step == 'Work_History'){
      this.workFields.enable();
      this.isWorkHistorySkipped = false;
      const element = document.getElementById("Work_History");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.WorkHistoryFormGroup.controls['work_history'].addValidators([Validators.required]);
    }
    else if(step == 'Education'){
      // this.eduFields.enable();
      // this.isEducationSkipped = false;
      // const element = document.getElementById("Education");
      // if(element){
      //   element.classList.remove("circle-skipped")
      // }
      // this.educationForm.controls['education'].addValidators([Validators.required]);
    }
    else if(step == 'Skills'){
      // this.skillsForm.controls['skills'].enable();
      // this.isSkillsSkipped = false;
      // const element = document.getElementById("Skills");
      // if(element){
      //   element.classList.remove("circle-skipped")
      // }
      // this.skillsForm.controls['skills'].addValidators([Validators.required]);
    }
    else if(step == 'Summary'){
      // this.summaryForm.controls['profile_summary'].enable();
      // this.isSummarySkipped = false;
      // const element = document.getElementById("Summary");
      // if(element){
      //   element.classList.remove("circle-skipped")
      // }
      // this.summaryForm.controls['profile_summary'].addValidators([Validators.required]);
    }
    else if(step == 'Project'){
      // this.projectFields.enable();
      // this.isProjectsSkipped = false;
      // const element = document.getElementById("Project");
      // if(element){
      //   element.classList.remove("circle-skipped")
      // }
      // this.projectForm.controls['projects'].addValidators([Validators.required]);
    }
    else if(step == 'Achievement'){ 
      // this.achievementForm.controls['achievement'].enable();
      // this.isAchievementsSkipped = false;
      // const element = document.getElementById("Achievement");
      // if(element){
      //   element.classList.remove("circle-skipped")
      // }
      // this.achievementForm.controls['achievement'].addValidators([Validators.required]);
    }
  }

  handleGenAIResponse(step : String, selectedAIResponse : any){
    if(step == 'Work_History'){
      // let output = ""
      // this.workHistoryList?.map((item)=>{
      //   output = output + 
      //   `${item.job_title}
      //    ${item.company_name} | ${item.dates_of_employment}
      //    ${item.roles_and_responsibilities.map((res, index)=>{
      //      return `${index + 1}. ${res}\n`
      //    })}
      //   `
      // })
      // this.WorkHistoryFormGroup.controls['work_history'].setValue(output.trim().replace(/^\s+/gm, ''));
      // const element = document.getElementById("exp-card-info");
      //     if(element && this.educationGeminiResponse){
      //       element.classList.add("card-focused");
      //     }
      // (this.workFields.at(this.currentWorkExpIndex) as FormGroup).controls['description'].setValue(this.workHistoryList?.join('\n'));
    }
    else if(step == "Summary"){
      // this.summaryForm.controls['profile_summary'].setValue(selectedAIResponse);
    }
    else if(step == "Achievement"){
      // if(this.achievement_genai){
      //   this.achievementForm.controls['achievement'].setValue(this.achievement_genai?.join('\n'))
      // }
    }
    else if(step == "Project"){
      // (this.projectFields.at(this.currentProjectIndex) as FormGroup).controls['description'].setValue(this.projectList_genai?.join('\n'));
    }
  }

  panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: false}
  ];

  work_panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: false}
  ];

  // project_panels: { id : number, title: string, expanded: boolean}[] = [
  //   { id: 0, title: '...', expanded: false}
  // ];

  // certification_panels : { id : number, title: string, expanded: boolean}[] = [
  //   { id: 0, title: '...', expanded: false}
  // ];

  // toggleExpansion(index:number) {
  //   this.panels[index].expanded = !this.panels[index].expanded;
  // }

  toggleWorkExpansion(index : number){
    this.work_panels[index].expanded = !this.work_panels[index].expanded
  }

  // toggleProjectExpansion(index : number){
  //   this.project_panels[index].expanded = !this.project_panels[index].expanded
  // }

  // toggleCertificationExpansion(index : number){
  //   this.certification_panels[index].expanded = !this.certification_panels[index].expanded
  // }

  // addEducation(){
  //   let panel = { id : this.panels.length, title : "...", expanded : true}
  //   this.panels = [...this.panels, panel];
  //   this.addEducationField();
  // }

  addWorkExp(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.work_panels = [...this.work_panels, panel];
    this.addWorkField();
  }

  // addProject(){
  //   let panel = { id : this.panels.length, title : "...", expanded : true}
  //   this.project_panels = [...this.project_panels, panel];
  //   this.addProjectField();
  // }

  // addCertification(){
  //   let panel = { id : this.panels.length, title : "...", expanded : true}
  //   this.certification_panels = [...this.certification_panels, panel];
  //   this.addCertificationField();
  // }

  // addSkill(skill : any){
  //   if(this.skillsForm.controls['skills'].value){
  //     this.skillsForm.controls['skills'].setValue(this.skillsForm.controls['skills'].value + ', ' + skill)
  //   }
  //   else{
  //     this.skillsForm.controls['skills'].setValue(skill)
  //   }
  // }

  // addCoursework(skill : any){
  //   if(this.courseWorkForm.controls['coursework'].value){
  //     this.courseWorkForm.controls['coursework'].setValue(this.courseWorkForm.controls['coursework'].value + ', ' + skill)
  //   }
  //   else{
  //     this.courseWorkForm.controls['coursework'].setValue(skill)
  //   }
  // }

  checkHandler(index : number){
    if(this.workFields.at(index).get('current_work_check')?.value){
      (this.workFields.at(index) as FormGroup).controls['end_month'].setValue("Present");
      (this.workFields.at(index) as FormGroup).controls['end_month'].disable();
      (this.workFields.at(index) as FormGroup).controls['end_year'].disable();
    }
    else{
      (this.workFields.at(index) as FormGroup).controls['end_month'].setValue("");
      (this.workFields.at(index) as FormGroup).controls['end_month'].enable();
      (this.workFields.at(index) as FormGroup).controls['end_year'].enable();
    }
  }

  extractedStrings : string[] = []

  optimizeWorkHistory(){
    let descriptionValue = this.experienceForm.get('description')?.value;
    if (typeof descriptionValue !== 'string') {
      if (descriptionValue === null || descriptionValue === undefined) {
        descriptionValue = '';
      } else if (typeof descriptionValue === 'object') {
        try {
          descriptionValue = JSON.stringify(descriptionValue);
        } catch {
          descriptionValue = String(descriptionValue);
        }
      } else {
        descriptionValue = String(descriptionValue);
      }
    }
    // Remove HTML tags and decode HTML entities
    const text = descriptionValue.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if(text.length > 0){
      this.is_work_history_loading = true;
      const experience_prompt = this.promptService.testing_work_exp_prompt(descriptionValue);
      console.log(experience_prompt);
      this.resumeService.requestOpenAI({ "prompt" : experience_prompt}).subscribe({
        next: (res : any) => {
          console.log(res['choices'][0]['message']['content']);
          let content = res['choices'][0]['message']['content'];
          this.workHistoryList = this.handleStringInput(content);
          // Do NOT update the description form control here. Only update workHistoryList.
          // Reset the set of added AI bullets so user can add new ones
          this.addedAIBullets = new Set<number>();
          this.is_work_history_loading = false;
          this.openPanelWindow();
        },
        error: (error) => {
          console.error('Error optimizing work history:', error);
          this.is_work_history_loading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to generate AI suggestions. Please try again.',
            life: 5000
          });
        }
      });
    } else {
      // Show warning if no content to optimize
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'Please add some job description content before using BotBro.',
        life: 4000
      });
    }
  }

  handleStringInput(input: string): string[] {
    try {
      // Attempt to parse the input as JSON
      const parsed = JSON.parse(input);
  
      // Check if the parsed value is an array of strings
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      } else {
        throw new Error('Not a valid list of strings.');
      }
    } catch (error) {
      // If parsing fails or the input is plain text, handle it as plain text
      return [input]; // Wrap plain text into an array
    }
  }

  

  optimizeResponse(index : any){
  
  
  
  

  // optimizeProject(index : number){
  //   this.currentProjectIndex = index;
  //   if(this.projectFields.at(index).get('description')?.value){
  //     this.is_projects_loading = true;
  //     const project_prompt = this.promptService.get_New_Project_Prompt(this.projectFields.at(index).get('description')?.value);
  //     this.genaiService.getGeminiProResponse(project_prompt).then((response)=>{
  //     console.log(response);
  //     this.projectList_genai = response.split("###").filter((item)=>{return item != ""});
  //     const sheet = document.getElementById("sheet");
  //     if (sheet) {
  //       sheet.classList.toggle("open");
  //     }
  //     this.is_projects_loading = false;
  //   });
  //   }
  }

  getEditorData(){
  // ngx-editor v18: get HTML from the form control
  return this.experienceForm.get('description')?.value || '';
  }

  useResponse(index: number): void {
    // Only add the selected AI suggestion to the description when user clicks plus, and mark as added
    if (this.workHistoryList && this.workHistoryList[index] && !this.addedAIBullets.has(index)) {
      const selectedResponse = this.workHistoryList[index];
      // Clean the response text
      const cleanText = selectedResponse.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, ' ');
      // Use the selected bullet style
      const bulletStyle = this.selectedBulletStyle || 'disc';
      // Insert a <ul> with the chosen bullet style
      const htmlResponse = `<ul style=\"list-style-type: ${bulletStyle}; margin-left: 1.5em;\"><li>${cleanText}</li></ul>`;
      // Get current HTML from the editor (form control)
      const currentHtml = this.getEditorData();
      // Append the new bullet HTML to the existing content
      const newHtml = currentHtml ? currentHtml + htmlResponse : htmlResponse;
      // Update the form control to reflect the new content
      this.experienceForm.get('description')?.setValue(newHtml);
      // Mark this AI bullet as added
      this.addedAIBullets.add(index);
    }
  }

  setAIResponse(exp : WorkData){
    this.selectedAIResponse = exp;
    this.experienceForm.controls['description'].setValue(exp.bulletPoints.join("\n"))
  }

  closeSheet(){
    const sheet = document.getElementById("sheet");
    if (sheet) {
      sheet.classList.remove("open");
    }
  }

  currentTab = 'tab1';
  switchTab(event: MouseEvent, tab: string) {
      event.preventDefault();
      this.currentTab = tab;
  }

  saveToExperienceList(){
    console.log(this.experienceForm.value.end_date);
    var end_date = ""
    if(this.experienceForm.value.isCurrentlyWorkHere){
      end_date = "Present"
    }
    else{
      // Format Date object to "MMM YYYY" format
      if(this.experienceForm.value.end_date) {
        const endDateObj = this.experienceForm.value.end_date;
        end_date = moment(endDateObj).format('MMM YYYY');
      }
    }
    
    // Format Date object to "MMM YYYY" format
    var start_date = ""
    if(this.experienceForm.value.start_date) {
      const startDateObj = this.experienceForm.value.start_date;
      start_date = moment(startDateObj).format('MMM YYYY');
    }
    if(this.experienceForm.controls['position_title']?.value && this.experienceForm.controls['company_name']?.value){
      let new_experience = 
      {
        id : this.experience_list.length,
        position_title : this.experienceForm.controls['position_title']?.value, 
        company_name : this.experienceForm.controls['company_name']?.value, 
        location : this.experienceForm.controls['location']?.value, 
        start_date : start_date, 
        end_date : end_date, 
        description : this.experienceForm.controls['description']?.value,
        isCurrentlyWorkHere : this.experienceForm.controls['isCurrentlyWorkHere'].value != null?this.experienceForm.controls['isCurrentlyWorkHere'].value : false 
      }
      if(this.selectedExperienceItem?.id){
        this.experience_list = [...this.experience_list.slice(0,parseInt(this.selectedExperienceItem.id)), new_experience, ...this.experience_list.slice(parseInt(this.selectedExperienceItem.id) + 1,)];
      }
      else{
        this.experience_list.push(new_experience)
      }
      this.selectedExperienceItem = {id : null,position_title :   null, company_name : null, location : null, start_date : null, end_date : null, description : null}
      this.experienceForm.reset();
      // Removed default bullet_points value - form should be completely empty
      //this.saveAndContinue("Changes saved");
      }
  }

  // editExperienceItem(experience : any){
  //     this.experienceForm.controls['position_title'].setValue(experience.position_title?experience.position_title : "") 
  //     this.experienceForm.controls['company_name'].setValue(experience.company_name?experience.company_name : "")
  //     this.experienceForm.controls['location'].setValue(experience.location?experience.location : "")
  //     this.experienceForm.controls['start_date'].setValue(this.selectedExperience().start_date); 
  //     this.experienceForm.controls['description'].setValue(experience.description?experience.description : "") 
  //     if(this.selectedExperience().isCurrentlyWorkHere){
  //       this.experienceForm.controls['end_date'].disable(); 
  //       this.experienceForm.controls['isCurrentlyWorkHere'].setValue(true);
  //     }
  //     else{
  //       this.experienceForm.controls['end_date'].setValue(this.selectedExperience().end_date);
  //       this.experienceForm.controls['isCurrentlyWorkHere'].setValue(false);
  //     }
  //     this.selectedExperienceItem = experience;
  //     this.removeExperienceItem(experience);
  // }

  removeExperienceItem(experience : any){
    this.openDialog();
    console.log(experience);
    const index = this.experience_list.findIndex(exp => exp.id === experience.id);
    if (index !== -1) {
      if(this.experience_list.length === 1){
        this.experience_list = []
      }
      else{
        this.experience_list = [...this.experience_list.slice(0,index), ...this.experience_list.slice(index + 1,)];
      }
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        animal: 'panda',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // saveToProjectList(){
  //   if(this.projectForm.controls['project_title']?.value){
  //     let new_project = 
  //     {
  //       id : this.project_list.length,
  //       project_title : this.projectForm.controls['project_title']?.value, 
  //       project_link : this.projectForm.controls['project_link']?.value, 
  //       technologies_used : this.projectForm.controls['technologies_used']?.value, 
  //       description : this.projectForm.controls['description']?.value
  //     }
  //     if(this.selectedProjectItem?.id || this.selectedProjectItem?.id === 0){
  //       this.project_list = [...this.project_list.slice(0,this.selectedProjectItem.id), new_project, ...this.project_list.slice(this.selectedProjectItem.id + 1,)];
  //     }
  //     else{
  //       this.project_list.push(new_project)
  //     }
  //     this.selectedProjectItem = {id : null,project_title : null, project_link : null, technologies_used : null, description : null}
  //     this.projectForm.reset();
  //     //this.saveAndContinue("Changes saved");
  //     }
  // }

  // editProjectItem(project : any){
  //     this.projectForm.controls['project_title'].setValue(project.project_title?project.project_title : "") 
  //     this.projectForm.controls['project_link'].setValue(project.project_link?project.project_link : "")
  //     this.projectForm.controls['technologies_used'].setValue(project.technologies_used?project.technologies_used : "")
  //     this.projectForm.controls['description'].setValue(project.description?project.description : "") 
  //     this.selectedProjectItem = project;
  //     this.removeProjectItem(project);
  // }

  // removeProjectItem(project : any){
  //   this.openDialog();
  //   console.log(project);
  //   if(this.project_list.length === 1){
  //     this.project_list = []
  //   }
  //   else{
  //     this.project_list = [...this.project_list.slice(0,project.id), ...this.project_list.slice(project.id + 1,)];
  //   }
  // }

  // saveToEducationList(){
  //   if(this.educationForm.controls['degree']?.value){
  //     let new_education = 
  //     {
  //       id : this.education_list.length,
  //       school_name : this.educationForm.controls['school_name']?.value, 
  //       school_location : this.educationForm.controls['school_location']?.value, 
  //       degree : this.educationForm.controls['degree']?.value, 
  //       field_of_study : this.educationForm.controls['field_of_study']?.value,
  //       gpa : this.educationForm.controls['gpa']?.value, 
  //       graduation_year : this.educationForm.controls['graduation_year']?.value
  //     }
  //     if(this.selectedEducationItem?.id || this.selectedEducationItem?.id === 0){
  //       this.education_list = [...this.education_list.slice(0,this.selectedEducationItem.id), new_education, ...this.education_list.slice(this.selectedEducationItem.id + 1,)];
  //     }
  //     else{
  //       this.education_list.push(new_education)
  //     }
  //     this.selectedEducationItem = {id : null,school_name: null,school_location: null,degree: null,field_of_study: null,gpa: null,graduation_year: null}
  //     this.educationForm.reset();
  //     //this.saveAndContinue("Changes saved");
  //     }
  // }

  // editEducationItem(education : any){
  //     this.educationForm.controls['school_name'].setValue(education.school_name?education.school_name : "") 
  //     this.educationForm.controls['school_location'].setValue(education.school_location?education.school_location : "")
  //     this.educationForm.controls['degree'].setValue(education.degree?education.degree : "")
  //     this.educationForm.controls['field_of_study'].setValue(education.field_of_study?education.field_of_study : "") 
  //     this.educationForm.controls['gpa'].setValue(education.gpa?education.gpa : "")
  //     this.educationForm.controls['graduation_year'].setValue(education.graduation_year?education.graduation_year : "") 
  //     this.selectedEducationItem = education;
  //     this.removeEducationItem(education);
  // }

  // removeEducationItem(education : any){
  //   this.openDialog();
  //   console.log(education);
  //   if(this.education_list.length === 1){
  //     this.education_list = []
  //   }
  //   else{
  //     this.education_list = [...this.education_list.slice(0,education.id), ...this.education_list.slice(education.id + 1,)];
  //   }
  // }

  // saveToCertificationList(){
  //   if(this.certifyForm.controls['certification_name']?.value){
  //     let new_certification = 
  //     {
  //       id : this.certification_list.length,
  //       certification_name : this.certifyForm.controls['certification_name']?.value, 
  //       issued_organisation : this.certifyForm.controls['issued_organisation']?.value, 
  //       issued_month : this.certifyForm.controls['issued_month']?.value, 
  //       issued_year : this.certifyForm.controls['issued_year']?.value,
  //       certification_link : this.certifyForm.controls['certification_link']?.value, 
  //       description : this.certifyForm.controls['description']?.value
  //     }
  //     if(this.selectedCertificationItem?.id || this.selectedCertificationItem?.id === 0){
  //       this.certification_list = [...this.certification_list.slice(0,this.selectedCertificationItem.id), new_certification, ...this.certification_list.slice(this.selectedCertificationItem.id + 1,)];
  //     }
  //     else{
  //       this.certification_list.push(new_certification)
  //     }
  //     this.selectedCertificationItem = {id : null,certification_name: null,issued_organisation: null,issued_month: null,issued_year: null,certification_link: null,description: null}
  //     this.certifyForm.reset();
  //     //this.saveAndContinue("Changes saved");
  //     }
  // }

  // editCertificationItem(certification : any){
  //     this.certifyForm.controls['certification_name'].setValue(certification.certification_name?certification.certification_name : "") 
  //     this.certifyForm.controls['issued_organisation'].setValue(certification.issued_organisation?certification.issued_organisation : "")
  //     this.certifyForm.controls['issued_month'].setValue(certification.issued_month?certification.issued_month : "")
  //     this.certifyForm.controls['issued_year'].setValue(certification.issued_year?certification.issued_year : "") 
  //     this.certifyForm.controls['certification_link'].setValue(certification.certification_link?certification.certification_link : "")
  //     this.certifyForm.controls['description'].setValue(certification.description?certification.description : "") 
  //     this.selectedCertificationItem = certification;
  //     this.removeCertificationItem(certification);
  // }

  // removeCertificationItem(certification : any){
  //   this.openDialog();
  //   console.log(certification);
  //   if(this.certification_list.length === 1){
  //     this.certification_list = []
  //   }
  //   else{
  //     this.certification_list = [...this.certification_list.slice(0,certification.id), ...this.certification_list.slice(certification.id + 1,)];
  //   }
  // }

  // saveToSkillsList(){
  //   if(this.skillsForm.controls['skills']?.value){
  //     let new_skill = 
  //     {
  //       id : this.skills_list.length,
  //       skills : this.skillsForm.controls['skills']?.value
  //     }
  //     if(this.selectedSkillItem?.id || this.selectedSkillItem?.id === 0){
  //       this.skills_list = [...this.skills_list.slice(0,this.selectedSkillItem.id), new_skill, ...this.skills_list.slice(this.selectedSkillItem.id + 1,)];
  //     }
  //     else{
  //       this.skills_list.push(new_skill)
  //     }
  //     this.selectedSkillItem = {id : null,skills : null}
  //     this.skillsForm.reset();
  //     //this.saveAndContinue("Changes saved");
  //     }
  // }

  // editSkillItem(skillItem : any){
  //     this.skillsForm.controls['skills'].setValue(skillItem.skills?skillItem.skills : "") 
  //     this.selectedSkillItem = skillItem;
  //     this.removeSkillItem(skillItem);
  // }

  // removeSkillItem(skillItem : any){
  //   this.openDialog();
  //   console.log(skillItem);
  //   if(this.skills_list.length === 1){
  //     this.skills_list = []
  //   }
  //   else{
  //     this.skills_list = [...this.skills_list.slice(0,skillItem.id), ...this.skills_list.slice(skillItem.id + 1,)];
  //   }
  // }

  getSuggestionsRes(){
    return this.jobDescAISuggestions().Required_Experience.split("###").filter((item : any)=>{return item != ""});
  }

  isJobDescAISuggestionsPresent() : boolean{
    return this.jobDescAISuggestions().Required_Experience.length > 0;
  }

  isWorkExpAIRes() : boolean{
    return this.workExperienceAIResponses.length > 0;
  }

  editExperience(experience: any): void {
    console.log('editExperience called with:', experience);
    this.selectedExperienceItem = { ...experience, id: experience.id.toString() };
    console.log('selectedExperienceItem after edit:', this.selectedExperienceItem);
    
    // Populate the form with the selected experience data
    this.experienceForm.patchValue({
      position_title: experience.position_title,
      company_name: experience.company_name,
      location: experience.location,
      section_title: this.experienceForm.get('section_title')?.value,
      isCurrentlyWorkHere: experience.isCurrentlyWorkHere || experience.end_date === 'Present'
    });

    // Set dates - Handle both MM/YYYY and "MMM YYYY" formats and convert to Date objects for p-calendar
    if (experience.start_date) {
      let startMoment;
      if (experience.start_date.includes('/')) {
        // Format: MM/YYYY
        startMoment = moment(experience.start_date, 'MM/YYYY');
      } else {
        // Format: "MMM YYYY" (e.g., "Apr 2022")
        startMoment = moment(experience.start_date, 'MMM YYYY');
      }
      // Convert to Date object for p-calendar
      this.experienceForm.get('start_date')?.setValue(startMoment.toDate());
    }
    
    if (experience.end_date && experience.end_date !== 'Present') {
      let endMoment;
      if (experience.end_date.includes('/')) {
        // Format: MM/YYYY
        endMoment = moment(experience.end_date, 'MM/YYYY');
      } else {
        // Format: "MMM YYYY" (e.g., "Apr 2022")
        endMoment = moment(experience.end_date, 'MMM YYYY');
      }
      // Convert to Date object for p-calendar
      this.experienceForm.get('end_date')?.setValue(endMoment.toDate());
    }

    // Set description in the editor
    if (experience.description) {
      this.experienceForm.get('description')?.setValue(experience.description);
    }

    // Scroll to form
    const formElement = document.querySelector('.resume-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteExperience(experience: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Experience',
        message: `Are you sure you want to delete the experience at ${experience.company_name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.experience_list.findIndex(exp => exp.id === experience.id);
        if (index !== -1) {
          if(this.experience_list.length === 1){
            this.experience_list = []
          }
          else{
            this.experience_list = [...this.experience_list.slice(0,index), ...this.experience_list.slice(index + 1,)];
          }
        }
        
        // Update IDs of remaining experiences
        this.experience_list = this.experience_list.map((exp, index) => ({
          ...exp,
          id: index
        }));

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Experience deleted successfully'
        });
      }
    });
  }

  
}
