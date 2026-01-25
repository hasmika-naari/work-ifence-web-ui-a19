import { isPlatformBrowser } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, Signal, SimpleChanges, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { RippleModule } from 'primeng/ripple';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { PanelModule } from 'primeng/panel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Education, IsSectionPresent, JobDescriptionAIResponse, ProfileSummary, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { ResumeService } from 'src/app/services/resume.service';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// Removed Quill import
import { MatCardModule } from '@angular/material/card';
import { SectionDesc } from 'src/app/services/store/user-store';
import { SelectModule } from 'primeng/select';
import { Editor, Toolbar } from 'ngx-editor';
import { SharedNgxEditorModule } from 'src/app/shared/shared-ngx-editor.module';
import { IconsModule } from 'src/app/shared/icons.module';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

export interface SummaryData{
  summary : string;
  ats_score : string;
}

@Component({
  selector: 'app-resume-summary',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
    MessageService
  ],
  standalone: true,
  imports: [
    RouterModule,
    SelectModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    MatCardModule,
    IconsModule,
    RippleModule,
    MatButtonModule,
    AccordionModule,
    TextareaModule,
    ToastModule,
    MatTooltipModule,
    ProgressSpinnerModule,
    MatIconModule,
    MatExpansionModule,
    PopoverModule,
    PanelModule,
    SharedNgxEditorModule
],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('slideInOut', [
      state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void <=> *', animate('320ms cubic-bezier(.77,0,.18,1)')),
    ])
  ]
})
export class SummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() sectionType: string = 'PROFILE_SUMMARY';
  // Project list and selected item for project section
  project_list: any[] = [];
  selectedProjectItem: any = {id : null, project_title : null, project_link : null, technologies_used : null, description : null};

  // Education list and selected item for education section
  education_list: any[] = [];
  selectedEducationItem: any = {id : null, school_name: null, school_location: null, degree: null, field_of_study: null, gpa: null, graduation_year: null};

  // Certification list and selected item for certification section
  certification_list: any[] = [];
  selectedCertificationItem: any = {id : null, certification_name: null, issued_organisation: null, issued_month: null, issued_year: null, certification_link: null, description: null};

  // Skills list and selected item for skills section
  skills_list: any[] = [];
  selectedSkillItem: any = {id: null, skill: null};
  // Form group properties for dynamic sections
  eduForm!: FormGroup;
  workForm!: FormGroup;
  userProjectForm!: FormGroup;
  certificationForm!: FormGroup;
  contactForm!: FormGroup;
  resumeForm!: FormGroup;

  // Other missing properties
  showProfileImage: boolean = false;
  imageBase64: string = '';
  cPage: number = 0;

  // Experience list and selected item for experience section
  experience_list: any[] = [];
  selectedExperienceItem: any = {id : null,position_title : null, company_name : null, location : null, start_date : null, end_date : null, description : null};

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['bullet_list']
  ];
  
  summaryAIList: string[] = [];
  addedAISummaries = new Set<number>();


  // (Removed duplicate resumeForm declaration above)
  // ...existing code...

  @Input() isFormPanleClosed : boolean = false;
  action_taken : string = '';

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  jobDescAIRes : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  sections : Signal<SectionDesc[]> = this.userStore.getCurrentSections();
  multipleSections : Signal<SectionDesc[][]> = this.userStore.getMultipleColumnTemplateSections();
  selectedSummary: Signal<any> = this.userStore.getSelectedSummary();
  isEdit: Signal<boolean> = this.userStore.getSelectedIsEdit(); 


  
  leftPosition = '530px';
  width = 0;
  borderWidth = 0;
  isOpen = false;

  visible = true;
  outLineButton = true;
  @Output() contact = new EventEmitter();



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
        effect(()=>{
          this.setSummaryValues()
        })
      }

  experienceForm = this._formBuilder.group({
    position_title: [''],
    company_name: [''],
    location : [''],
    start_date: [''],
    end_date: [''],
    description : ['']
  });

  educationForm = this._formBuilder.group({
    school_name: [''],
    school_location: [''],
    degree: [''],
    field_of_study: [''],
    gpa: [''],
    graduation_year: ['']
  });
  skillsForm = this._formBuilder.group({
    skills: [''],
  });
  courseWorkForm = this._formBuilder.group({
    coursework : ['']
  })
  summaryForm = this._formBuilder.group({
    profile_summary: [''],
    position_highlight : [''],
    skills_highlight : [''],
    job_description : [''],
    section_title : ['Profile Summary', Validators.required],
    format: ['paragraph']
  });
  certificationsForm = this._formBuilder.group({
    certifications : [''],
  });

  workHistoryList : Array<String>  | null= null
  educationGeminiResponse : Array<Education>  | null = null
  technical_skills_genai : Array<String> | null= null
  soft_skills_genai : Array<String> | null = null
  profile_summary_genai : string | null = null 
  projectList_genai : Array<String> | null= null
  achievement_genai : Array<String> | null = null

  selectedAIResponse : SummaryData = {summary : '', ats_score : ''}

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
  aiResponsePoint = new FormControl();
  

  currentWorkExpIndex : number = 0
  currentProjectIndex : number = 0
  summaryAIResponses : string = ''
  textChangeHandler: any = ';';
  isButtonDisabled = false;
  
  // Form change tracking
  private originalFormValues: any = null;
  public hasFormChanged: boolean = false;
  
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
    this.subs.forEach(s => s.unsubscribe());
  
  }

  toggle() {
    this.overlayVisible = !this.overlayVisible;
}

toggleAnimation() {
  this.isOpen = !this.isOpen;
  this.width = this.isOpen ? 450 : 0; // Toggle between expanded and collapsed
}

  closePanelWindow(){
    this.isOpen = false;
    this.width = 0;
    this.borderWidth = 0;
  }

openPanelWindow(){
  this.isOpen = true;
  this.width = 450;
  this.borderWidth = 3;
}

  ngOnInit() {
    // Set format and editor content based on sectionType
    if (this.sectionType === 'PROFILE_SUMMARY_BULLETED') {
      this.summaryForm.controls['format'].setValue('bulleted', { emitEvent: false });
      const resume = this.resumeSignalForm();
      const section = resume?.sections?.find((s: any) => s.section === 'PROFILE_SUMMARY_BULLETED');
      if (section && section.data && section.data.profile_summary) {
        this.summaryForm.controls['profile_summary'].setValue(section.data.profile_summary, { emitEvent: false });
      } else if (section && section.data && Array.isArray(section.data.summary_bullets)) {
        // If only bullets array exists, convert to <ul><li>...</li></ul>
        const bullets = section.data.summary_bullets.map((b: string) => `<li>${b}</li>`).join('');
        this.summaryForm.controls['profile_summary'].setValue(`<ul>${bullets}</ul>`, { emitEvent: false });
      } else {
        // Default to a single empty bullet
        this.summaryForm.controls['profile_summary'].setValue('<ul><li></li></ul>', { emitEvent: false });
      }
    } else {
      this.summaryForm.controls['format'].setValue('paragraph', { emitEvent: false });
      const resume = this.resumeSignalForm();
      const section = resume?.sections?.find((s: any) => s.section === 'PROFILE_SUMMARY');
      if (section && section.data && section.data.profile_summary) {
        this.summaryForm.controls['profile_summary'].setValue(section.data.profile_summary, { emitEvent: false });
      } else {
        this.summaryForm.controls['profile_summary'].setValue('', { emitEvent: false });
      }
    }
  // Initialize ngx-editor instance
    // Listen for format changes to update dummy text from store
    this.summaryForm.controls['format'].valueChanges.subscribe((val) => {
      // No-op: handled above
    });
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        console.log('Current route does not match the desired route');
      }
    }));

    // Set up form change detection
    this.setupFormChangeDetection();
        // Initialize ngx-editor instance if not already created
        if (!this.editor) {
          this.editor = new Editor();
        }
        // Ensure the form control is always a string
        if (this.summaryForm.controls['profile_summary'].value == null) {
          this.summaryForm.controls['profile_summary'].setValue('');
        }
  }

  onRowSelect(event: TableRowSelectEvent, op: any) {
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    op.hide();
}

  setSummaryValues(){
    // If editing, load from selectedSummary, otherwise load from resume form
    const isEditing = this.isEdit();
    const selectedSummaryData = this.selectedSummary();
    
    if (isEditing && selectedSummaryData) {
      // Load from selectedSummary for editing
      const editorHtml = selectedSummaryData.original_summary_html?.length ? selectedSummaryData.original_summary_html : (selectedSummaryData.profile_summary ?? '');
      
      if (this.summaryForm && (editorHtml && editorHtml.trim().length > 0)) {
        this.summaryForm.patchValue({
          profile_summary: editorHtml,
          position_highlight: selectedSummaryData.position_highlight ?? '',
          skills_highlight: selectedSummaryData.skills_highlight ?? ''
        }, { emitEvent: false });
      }
    } else {
      // Load from resume form (existing logic)
      const resume = this.resumeSignalForm();
      const section = resume?.sections?.find((s: any) => s.section === 'PROFILE_SUMMARY');
      const summary = section?.items?.[0]?.data ?? new ProfileSummary();
      const editorHtml = summary.original_summary_html?.length ? summary.original_summary_html : (summary.profile_summary ?? '');

      // Only patch if there is real content, otherwise let ngOnInit's dummy text logic run
      if (this.summaryForm && (editorHtml && editorHtml.trim().length > 0)) {
        this.summaryForm.patchValue({
          profile_summary: editorHtml,
          position_highlight: summary.position_highlight ?? '',
          skills_highlight: summary.skills_highlight ?? ''
        }, { emitEvent: false });
      }
    }

    // Set section title (same logic for both cases)
    let section_title;
    const resume = this.resumeSignalForm();
    if(resume?.template_details.template_name == 'TEMPLATE_9'){
      this.multipleSections().map((e : SectionDesc[])=>{
        e.map((section : SectionDesc)=>{
          if(section.section == 'PROFILE_SUMMARY'){
            section_title = section.editable_section_title
          }
        })
      })
    }
    else{
      this.sections().map((section : SectionDesc)=>{
          if(section.section == 'PROFILE_SUMMARY'){
            section_title = section.editable_section_title
          }
        })
    }
    this.summaryForm.controls['section_title'].setValue(section_title??'Profile Summary', { emitEvent: false })
    
    // Capture original form values after form is populated
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 0);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFormPanleClosed']) {
      this.closePanelWindow();
    }
  }


  saveAndContinue(){
    this.markFormGroupTouched(this.summaryForm);

    let summary = new ProfileSummary();
    let profile_summary = this.summaryForm.controls['profile_summary'].value || '';
    if (this.sectionType === 'PROFILE_SUMMARY_BULLETED') {
      // Save as HTML, force <ul> if needed
      let html = profile_summary;
      if (html.includes('<ol>')) {
        html = html.replace('<ol>', '<ul>').replace('</ol>', '</ul>');
      }
      summary.profile_summary = html.length > 0 ? html.trim() : '';
      summary.original_summary_html = html;
      summary.summary_bullets = [];
      // Debug: Log all sections before update
      console.log('Summary Component:  [DEBUG] Sections before bulleted summary update:', JSON.parse(JSON.stringify(this.sections())));
      // Update only the PROFILE_SUMMARY_BULLETED section
      if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
        this.multipleSections().map((e : SectionDesc[], i: number)=>{
          e.map((section : SectionDesc, j: number)=>{
            if(section.section == 'PROFILE_SUMMARY_BULLETED'){
              console.log(`Summary Component:  [DEBUG] Updating PROFILE_SUMMARY_BULLETED at multi-col index [${i}][${j}]`, section);
              section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary';
              section.data = summary;
            }
          })
        })
        this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
      } else {
        this.sections().map((section : SectionDesc, idx: number)=>{
          if(section.section == 'PROFILE_SUMMARY_BULLETED'){
            console.log(`Summary Component:  [DEBUG] Updating PROFILE_SUMMARY_BULLETED at index [${idx}]`, section);
            section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary';
            section.data = summary;
          }
        })
        this.userStore.setResumeSections(this.sections())
      }
      // Debug: Log all sections after update
      console.log('Summary Component:  [DEBUG] Sections after bulleted summary update:', JSON.parse(JSON.stringify(this.sections())));
    } else {
      if(profile_summary.includes('data-list="bullet"')){
        const correctedHTML = profile_summary.replace('<ol>', '<ul>').replace("</ol>", '</ul>');
        summary.profile_summary = correctedHTML.length>0? correctedHTML.trim() : "";
      }
      else{
        summary.profile_summary = profile_summary.length>0? profile_summary.trim() : "";
      }
      summary.original_summary_html = profile_summary;
      // Update only the PROFILE_SUMMARY section
      if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
        this.multipleSections().map((e : SectionDesc[])=>{
          e.map((section : SectionDesc)=>{
            if(section.section == 'PROFILE_SUMMARY'){
              section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary';
              section.data = summary;
            }
          })
        })
        this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
      }
      else{
        this.sections().map((section : SectionDesc)=>{
            if(section.section == 'PROFILE_SUMMARY'){
             section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary';
             section.data = summary;
            }
          })
        this.userStore.setResumeSections(this.sections())
      }
    }
    summary.position_highlight = this.summaryForm.controls['position_highlight'].value?this.summaryForm.controls['position_highlight'].value : "";
    summary.skills_highlight = this.summaryForm.controls['skills_highlight'].value?this.summaryForm.controls['skills_highlight'].value : "";
    if (this.sectionType === 'PROFILE_SUMMARY_BULLETED') {
      // Only update PROFILE_SUMMARY_BULLETED section
      if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
        this.multipleSections().map((e : SectionDesc[])=>{
          e.map((section : SectionDesc)=>{
            if(section.section == 'PROFILE_SUMMARY_BULLETED'){
              section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary';
            }
          })
        })
        this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
      } else {
        this.sections().map((section : SectionDesc)=>{
          if(section.section == 'PROFILE_SUMMARY_BULLETED'){
            section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary';
          }
        })
        this.userStore.setResumeSections(this.sections())
      }
    } else {
      // Only update PROFILE_SUMMARY section
      if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
        this.multipleSections().map((e : SectionDesc[])=>{
          e.map((section : SectionDesc)=>{
            if(section.section == 'PROFILE_SUMMARY'){
              section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary'
            }
          })
        })
        this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
      }
      else{
        this.sections().map((section : SectionDesc)=>{
            if(section.section == 'PROFILE_SUMMARY'){
             section.editable_section_title = this.summaryForm.controls['section_title'].value??'Profile Summary'
            }
          })
          console.log("Summary Component: setResumeSections: Updated Sections: ", this.sections());
        this.userStore.setResumeSections(this.sections())
      }
    }
    console.log(this.sections());
    // Mark as default if empty
    if ((this.sectionType === 'PROFILE_SUMMARY_BULLETED' && summary.summary_bullets.length === 0) ||
        (this.sectionType !== 'PROFILE_SUMMARY_BULLETED' && (!summary.profile_summary || summary.profile_summary.length === 0))) {
      summary.isDefault = true;
    } else {
      summary.isDefault = false;
    }

  // Removed addSummary(summary) to prevent overwriting PROFILE_SUMMARY with bulleted summary data
    if(!this.sectionStatus().isSummary){
      let status = this.sectionStatus()
      status.isSummary = true;
      this.userStore.updateSectionStatus(status);
    }
    // Clear selectedSummary after successful save
    this.userStore.setSelectedSummary(undefined);
    // Reset form change tracking after successful save
    this.captureOriginalFormValues();
    // this.summaryForm.reset()
    this.closePanelWindow();
    this.contact.emit();
  }

  // getEditorData removed, not needed with p-editor


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Form change detection methods
  private setupFormChangeDetection(): void {
    // Subscribe to form value changes
    this.subs.push(
      this.summaryForm.valueChanges.subscribe(() => {
        this.checkForFormChanges();
      })
    );
  }

  private captureOriginalFormValues(): void {
    this.originalFormValues = { 
      ...this.summaryForm.value,
  // Removed editorContent assignment
    };
    this.hasFormChanged = false;
  }

  private checkForFormChanges(): void {
    if (!this.originalFormValues) {
      this.hasFormChanged = false;
      return;
    }

    const currentValues = {
      ...this.summaryForm.value,
    };
    
    this.hasFormChanged = JSON.stringify(this.originalFormValues) !== JSON.stringify(currentValues);
  }

  // Get appropriate tooltip message for the button
  public getButtonTooltip(): string {
    if (this.is_summary_loading) {
      return 'Please wait while AI is generating content';
    }
    if (this.summaryForm.invalid) {
      return 'Please fix form errors before saving';
    }
    if (this.isButtonDisabled) {
      return 'Please add content to your summary';
    }
    if (!this.hasFormChanged) {
      return 'Make changes to enable saving';
    }
    return 'Click to save changes to your resume';
  }

  onFileSelected(event: any) {
    this.showProfileImage = true;
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

  isScorePresent(desc : SummaryData){
    return desc.ats_score.length > 0;
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


  back(){
    console.log(this.cPage);
    
    if(this.cPage == 0){
      this.router.navigateByUrl("/resume-templates")
    }
    this.cPage = this.cPage - 2;
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

  optimizeText() : void {
    const summaryValue = this.summaryForm.controls['profile_summary'].value || '';
    if (summaryValue.length > 0) {
      this.is_summary_loading = true;
      const objective_prompt = this.promptService.final_optimized_profile_summary_prompt(summaryValue);
      this.resumeService.requestOpenAI({ "prompt": objective_prompt }).subscribe({
        next: (res: any) => {
          let content = res['choices'][0]['message']['content'];
          // Simulate multiple AI suggestions (split by line or custom logic)
          this.summaryAIList = content.split(/\n\n|\r\n\r\n|###/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          this.addedAISummaries = new Set<number>();
          this.is_summary_loading = false;
          this.openPanelWindow();
        },
        error: (error) => {
          this.is_summary_loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to generate AI suggestions. Please try again.',
            life: 5000
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter some content in the summary field before using AI optimization.',
        life: 4000
      });
    }
  }

  useSummaryResponse(index: number): void {
    if (this.summaryAIList && this.summaryAIList[index] && !this.addedAISummaries.has(index)) {
      const selectedResponse = this.summaryAIList[index];
      // Clean the response text
      const cleanText = selectedResponse.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, ' ').trim();
      let currentHtml = this.summaryForm.controls['profile_summary'].value || '';
      // Ensure we have a <ul>...</ul>
      let ulMatch = currentHtml.match(/<ul>([\s\S]*?)<\/ul>/);
      let listItems = ulMatch ? ulMatch[1] : '';
      // Append new bullet
      listItems += `<li>${cleanText}</li>`;
      const newHtml = `<ul>${listItems}</ul>`;
      this.summaryForm.controls['profile_summary'].setValue(newHtml);
      this.addedAISummaries.add(index);
    }
  }

  editAIResponse(){
    this.action_taken = 'EDIT'
    this.aiResponsePoint.setValue(this.summaryAIResponses);
  }

  updatePoint(){
    this.summaryAIResponses = this.aiResponsePoint.value;
    this.aiResponsePoint.reset();
    this.action_taken = ''
  }

  cancelPoint(){
    this.aiResponsePoint.reset();
    this.action_taken = ''
  }

  reoptimizeSummary(){
    this.action_taken = 'OPTIMIZE';
    const objective_prompt = this.promptService.final_optimized_profile_summary_prompt(this.summaryAIResponses);
    this.resumeService.requestOpenAI({ "prompt" : objective_prompt}).subscribe({
      next: (res : any) => {
        console.log(res['choices'][0]['message']['content']);
        //store OpenAI response in our Backend. Need a table to store
        let content = res['choices'][0]['message']['content'];
        this.profile_summary_genai = content;
        this.summaryAIResponses = content;
        this.action_taken = '';
        
        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Summary re-optimized successfully!',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error re-optimizing summary:', error);
        this.action_taken = '';
        
        // Show error message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to re-optimize summary. Please try again.',
          life: 5000
        });
      }
    });
  }

  isJobDescAISuggestionsPresent() : boolean{
    return this.jobDescAIRes().Responsibilities_and_Duties.length > 0;
  }

  setAIResponse(){
    this.summaryForm.controls['profile_summary'].setValue(this.summaryAIResponses)
  }

  goback($event: any){
    this.userStore.updateSidebar(false);
    this.router.navigateByUrl('/user/resumes');
  }

}  







 
















  


