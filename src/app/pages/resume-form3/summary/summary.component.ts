import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, Signal, SimpleChanges, ViewChild, effect, inject } from '@angular/core';
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
import { RippleModule } from 'primeng/ripple';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Education, IsSectionPresent, JobDescriptionAIResponse, ProfileSummary, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { ResumeService } from 'src/app/services/resume.service';
import { TooltipModule } from 'primeng/tooltip';
import Quill from 'quill';
import { MatCardModule } from '@angular/material/card';


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
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,TooltipModule,MatCardModule,
    MatInputModule,ButtonModule,OverlayPanelModule,PanelModule,RippleModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class SummaryComponent implements OnInit, OnDestroy, OnChanges {

  resumeForm!: FormGroup;
  contactForm! : FormGroup
  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false
  eduForm!: FormGroup;
  workForm! : FormGroup;
  userProjectForm! : FormGroup
  certificationForm! : FormGroup
  listed_skills : Array<String> = ['Java', 'Python','Angular', 'NodeJS', 'ReactJS']
  listed_coursework : Array<String> = ['Data Structures and Algorithms','Object-Oriented Programming','Database Management Systems','Computer Networks','Operating Systems','Software Engineering','Artificial Intelligence','Web Development', 'Data Structures']

  experience_list : {id : number,position_title : String | null, company_name : String | null, location : String | null, start_date : String | null, end_date : String | null, description : String | null}[] = []

  selectedExperienceItem! : {id : number | null,position_title : String | null, company_name : String | null, location : String | null, start_date : String | null, end_date : String | null, description : String | null}

  project_list : {id : number,project_title : String | null, project_link : String | null, technologies_used : String | null, description : String | null}[] = []

  selectedProjectItem! : {id : number | null,project_title : String | null, project_link : String | null, technologies_used : String | null, description : String | null}

  education_list : {id : number,school_name: String | null,school_location: String | null,degree: String | null,field_of_study: String | null,gpa: String | null,graduation_year: String | null}[] = []

  selectedEducationItem! : {id : number | null,school_name: String | null,school_location: String | null,degree: String | null,field_of_study: String | null,gpa: String | null,graduation_year: String | null}

  certification_list : {id : number,certification_name: String | null,issued_organisation: String | null,issued_month: String | null,issued_year: String | null,certification_link: String | null,description: String | null}[] = []

  selectedCertificationItem! : {id : number | null,certification_name: String | null,issued_organisation: String | null,issued_month: String | null,issued_year: String | null,certification_link: String | null,description: String | null}

  skills_list : {id : number, skills : String | null}[] = []

  selectedSkillItem! : {id : number | null, skills : String | null}

  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @Input() isFormPanleClosed : boolean = false;
  action_taken : string = ''



  public editor!: Quill;

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  jobDescAIRes : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();


  
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
    job_description : ['']
  });
  certificationsForm = this._formBuilder.group({
    certifications : [''],
  });
  projectForm = this._formBuilder.group({
      project_title: [''],
      technologies_used: [''],
      project_link : [''],
      description : ['']
  });
  certifyForm = this._formBuilder.group({
      certification_name : [''],
      issued_organisation : [''],
      issued_month : [''],
      issued_year : [''],
      certification_link : [''],
      description : ['']
  })
  achievementForm = this._formBuilder.group({
    achievement : ['']
  })

  summaryRequestForm = this._formBuilder.group({
    position_highlight : ['', Validators.required],
    skills_highlight : ['', Validators.required]
  })

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
    this.editor.off('text-change', this.textChangeHandler); // Detach the event handler
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
  //   this.productService.getProductsSmall().then((products) => {
  //     this.products = products;
  //     this.selectedProduct = products[0];
  //     this.cdr.markForCheck()
  // });
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        // The current active route matches the desired route
        // console.log('Current route matches the desired route');
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        // The current active route does not match the desired route
        console.log('Current route does not match the desired route');
      }
    }));

    // this.subs.push(this.routeActivated.url.subscribe(urlSegment => {
    //   const currentUrl = urlSegment.join('/');
    //   
    //   if (currentUrl.includes('/resumes/resume')) {
    //     // The current active route contains the specific string
    //     this.userStore.updateSidebar(true);
    //   } else {
    //     // The current active route does not contain the specific string
    //     // this.userStore.updateSidebar(false);
    //   }
    // }));  
    
    // this.userStore.updateSidebar(true);

    this.eduForm = this._formBuilder.group({
      edu_fields: this._formBuilder.array([])
    });

    this.certificationForm = this._formBuilder.group({
      certification_fields : this._formBuilder.array([])
    })

    this.workForm = this._formBuilder.group({
      work_fields : this._formBuilder.array([])
    });

    this.userProjectForm = this._formBuilder.group({
      project_fields: this._formBuilder.array([])
    });

    this.contactForm = this._formBuilder.group({
      name: [''],
      lname: [''],
      phone_number: [''],
      email_address: [''],
      address : [''],
      role: [''],
      linkedIn_profile: [''],
      github_profile: [''],
      portfolio_url : ['']
    })
    this.resumeForm = this._formBuilder.group({
      profile_summary: [''],
      experience: [``],
      education: [``],
      skills: [''],
      certifications: [``],
      projects: [``],
      award : [``],
      language : [``],
      interest : [''],
      publication : [''],
      professional_membership : [''],
      volunteer_experiences : [''],
      imageBase64Encoded : ['']
    });

    this.addEducationField();
    this.addWorkField();
    this.addProjectField();
    this.addCertificationField();
  }

  

  get eduFields() {
    return this.eduForm.get('edu_fields') as FormArray;
  }

  get workFields(){
    return this.workForm.get('work_fields') as FormArray;
  }

  get projectFields(){
    return this.userProjectForm.get('project_fields') as FormArray;
  }

  get certificationFields(){
    return this.certificationForm.get('certification_fields') as FormArray;
  }

  onRowSelect(event: TableRowSelectEvent, op: OverlayPanel) {
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    op.hide();
}

  setSummaryValues(){
    console.log(this.resumeSignalForm().profileSummary.original_summary_html);
    if(this.editor?.clipboard){
      this.editor.clipboard.dangerouslyPasteHTML(this.resumeSignalForm().profileSummary.original_summary_html);
    }
  }

  addEducationField() {
    const educationField = this._formBuilder.group({
      school_name: [''],
      school_location: [''],
      degree: [''],
      field_of_study: [''],
      gpa: [''],
      graduation_month: [''],
      graduation_year: [''],
      expanded : [true]
    });

    this.eduFields.push(educationField);
  }

  addWorkField() {
    const workField = this._formBuilder.group({
      exp_title: 'Experiance ' + this.workFields.length.toString(),
      position_title: [''],
      company_name: [''],
      location : [''],
      start_date: [''],
      end_date: [''],
      current_work_check : [false],
      description : ['']
    });

    this.workFields.push(workField);
  }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['isFormPanleClosed']) {
        this.closePanelWindow();
      }
    }

  addProjectField() {
    const projectField = this._formBuilder.group({
      project_title: [''],
      technologies_used: [''],
      project_link : [''],
      description : ['']
    });

    this.projectFields.push(projectField);
  }

  addCertificationField(){
    const certificationField = this._formBuilder.group({
      certification_name : [''],
      issued_organisation : [''],
      issued_month : [''],
      issued_year : [''],
      certification_link : [''],
      description : ['']
    })

    this.certificationFields.push(certificationField);
  }

  removeEducationField(index: number) {
    this.eduFields.removeAt(index);
    this.panels = this.panels.filter((item)=>{return item.id != index})
    console.log(this.panels);
  }

  removeWorkField(index: number) {
    this.workFields.removeAt(index);
    this.work_panels = this.work_panels.filter((item)=>{return item.id != index})
    console.log(this.work_panels);
  }

  removeProjectField(index: number) {
    this.projectFields.removeAt(index);
    this.project_panels = this.project_panels.filter((item)=>{return item.id != index})
    console.log(this.project_panels);
  }

  removeCertificationField(index: number) {
    this.certificationFields.removeAt(index);
    this.certification_panels = this.certification_panels.filter((item)=>{return item.id != index})
    console.log(this.certification_panels);
  }

  saveAndContinue(){
    this.markFormGroupTouched(this.summaryForm);

    let summary = new ProfileSummary();
    let profile_summary = this.getEditorData();
    if(profile_summary.includes('data-list="bullet"')){
      const correctedHTML = profile_summary.replace('<ol>', '<ul>').replace("</ol>", '</ul>');
      summary.profile_summary = correctedHTML.length>0? correctedHTML.trim() : "";
    }
    else{
      summary.profile_summary = profile_summary.length>0? profile_summary.trim() : "";
    }
    summary.original_summary_html = profile_summary;
    summary.position_highlight = this.summaryForm.controls['position_highlight'].value?this.summaryForm.controls['position_highlight'].value : "";
    summary.skills_highlight = this.summaryForm.controls['skills_highlight'].value?this.summaryForm.controls['skills_highlight'].value : "";
    if(profile_summary.length > 0){
      summary.isDefault = false
    }
    else{
      summary.isDefault = true
    }


    this.userStore.addSummary(summary);
    if(!this.sectionStatus().isSummary){
      let status = this.sectionStatus()
      status.isSummary = true;
      this.userStore.updateSectionStatus(status);
    }
    // this.summaryForm.reset()
    this.closePanelWindow();
    this.contact.emit();
  }

  getEditorData(){
    return this.editor.root.innerHTML;
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
    else if(step == 'Education'){
        return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped);
    }
    else if(step == 'Skills'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped);
    }
    else if(step == 'Summary'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped);
    }
    else if(step == 'Project'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped);
    }
    else if(step == 'Achievement'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped) && (this.projectForm.valid || this.isProjectsSkipped);
    }
    else if(step == 'Finalize'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped) && (this.projectForm.valid || this.isProjectsSkipped) && (this.achievementForm.valid || this.isAchievementsSkipped);
    }
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

  optimizeText() : void{
     if(this.getEditorRawData().length > 0){
      this.is_summary_loading = true;
      const objective_prompt = this.promptService.final_optimized_profile_summary_prompt(this.getEditorRawData());
      this.resumeService.requestOpenAI({ "prompt" : objective_prompt}).subscribe((res : any)=>{
        console.log(res['choices'][0]['message']['content']);
        //store OpenAI response in our Backend. Need a table to store
        let content = res['choices'][0]['message']['content'];
        this.profile_summary_genai = content;
        // this.summaryForm.controls['profile_summary'].setValue(this.profile_summary_genai)
        if(this.isJobDescAISuggestionsPresent()){
          this.summaryAIResponses = content.split("###")[0]
        }
        else{
          this.summaryAIResponses = content
        }

        this.is_summary_loading = false;
        this.openPanelWindow()
      });
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
      this.resumeService.requestOpenAI({ "prompt" : objective_prompt}).subscribe((res : any)=>{
        console.log(res['choices'][0]['message']['content']);
        //store OpenAI response in our Backend. Need a table to store
        let content = res['choices'][0]['message']['content'];
        this.profile_summary_genai = content;
        this.summaryAIResponses = content;
        this.action_taken = ''
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
      this.eduFields.disable();
      this.isEducationSkipped = true;
      const element = document.getElementById("Education");
      if(element){
        element.classList.add("circle-skipped")
      }
      // this.educationForm.controls['education'].clearValidators();
      this.cPage = 4
      this.next();
    }
    else if(step == 'Skills'){
      this.skillsForm.controls['skills'].disable();
      this.isSkillsSkipped = true;
      const element = document.getElementById("Skills");
      if(element){
        element.classList.add("circle-skipped")
      }
      this.skillsForm.controls['skills'].clearValidators();
      this.cPage = 6
      this.next();
    }
    else if(step == 'Summary'){
      this.summaryForm.controls['profile_summary'].disable();
      this.isSummarySkipped = true;
      const element = document.getElementById("Summary");
      if(element){
        element.classList.add("circle-skipped")
      }
      this.summaryForm.controls['profile_summary'].clearValidators();
      this.cPage = 8
      this.next();
    }
    else if(step == 'Project'){
      this.projectFields.disable();
      this.isProjectsSkipped = true;
      const element = document.getElementById("Project");
      if(element){
        element.classList.add("circle-skipped")
      }
      // this.projectForm.controls['projects'].clearValidators();
      this.cPage = 10
      this.next();
    }
    else if(step == 'Achievement'){ 
      this.achievementForm.controls['achievement'].disable();
      this.isAchievementsSkipped = true;
      const element = document.getElementById("Achievement");
      if(element){
        element.classList.add("circle-skipped")
      }
      this.achievementForm.controls['achievement'].clearValidators();
      this.cPage = 12
      this.next();
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
      this.eduFields.enable();
      this.isEducationSkipped = false;
      const element = document.getElementById("Education");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.educationForm.controls['education'].addValidators([Validators.required]);
    }
    else if(step == 'Skills'){
      this.skillsForm.controls['skills'].enable();
      this.isSkillsSkipped = false;
      const element = document.getElementById("Skills");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.skillsForm.controls['skills'].addValidators([Validators.required]);
    }
    else if(step == 'Summary'){
      this.summaryForm.controls['profile_summary'].enable();
      this.isSummarySkipped = false;
      const element = document.getElementById("Summary");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.summaryForm.controls['profile_summary'].addValidators([Validators.required]);
    }
    else if(step == 'Project'){
      this.projectFields.enable();
      this.isProjectsSkipped = false;
      const element = document.getElementById("Project");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.projectForm.controls['projects'].addValidators([Validators.required]);
    }
    else if(step == 'Achievement'){ 
      this.achievementForm.controls['achievement'].enable();
      this.isAchievementsSkipped = false;
      const element = document.getElementById("Achievement");
      if(element){
        element.classList.remove("circle-skipped")
      }
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
      (this.workFields.at(this.currentWorkExpIndex) as FormGroup).controls['description'].setValue(this.workHistoryList?.join('\n'));
    }
    else if(step == "Summary"){
      this.summaryForm.controls['profile_summary'].setValue(selectedAIResponse);
    }
    else if(step == "Achievement"){
      if(this.achievement_genai){
        this.achievementForm.controls['achievement'].setValue(this.achievement_genai?.join('\n'))
      }
    }
    else if(step == "Project"){
      (this.projectFields.at(this.currentProjectIndex) as FormGroup).controls['description'].setValue(this.projectList_genai?.join('\n'));
    }
  }

  panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: false}
  ];

  work_panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: false}
  ];

  project_panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: false}
  ];

  certification_panels : { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: false}
  ];

  toggleExpansion(index:number) {
    this.panels[index].expanded = !this.panels[index].expanded;
  }

  toggleWorkExpansion(index : number){
    this.work_panels[index].expanded = !this.work_panels[index].expanded
  }

  toggleProjectExpansion(index : number){
    this.project_panels[index].expanded = !this.project_panels[index].expanded
  }

  toggleCertificationExpansion(index : number){
    this.certification_panels[index].expanded = !this.certification_panels[index].expanded
  }

  addEducation(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.panels = [...this.panels, panel];
    this.addEducationField();
  }

  addWorkExp(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.work_panels = [...this.work_panels, panel];
    this.addWorkField();
  }

  addProject(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.project_panels = [...this.project_panels, panel];
    this.addProjectField();
  }

  addCertification(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.certification_panels = [...this.certification_panels, panel];
    this.addCertificationField();
  }

  addSkill(skill : any){
    if(this.skillsForm.controls['skills'].value){
      this.skillsForm.controls['skills'].setValue(this.skillsForm.controls['skills'].value + ', ' + skill)
    }
    else{
      this.skillsForm.controls['skills'].setValue(skill)
    }
  }

  addCoursework(skill : any){
    if(this.courseWorkForm.controls['coursework'].value){
      this.courseWorkForm.controls['coursework'].setValue(this.courseWorkForm.controls['coursework'].value + ', ' + skill)
    }
    else{
      this.courseWorkForm.controls['coursework'].setValue(skill)
    }
  }

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

  optimizeWorkHistory(index : number){
    this.currentWorkExpIndex = index
    if(this.workFields.at(index).get('description')?.value){
      this.is_work_history_loading = true;
      const experience_prompt = this.promptService.get_NEW_Experience_prompt(this.workFields.at(index).get('description')?.value);
      console.log(experience_prompt);
      this.genaiService.getGeminiProResponse(experience_prompt).then((response)=>{
        console.log(response);
        this.workHistoryList = response.split("###").filter((item)=>{return item != ""});
        const sheet = document.getElementById("sheet");
        if (sheet) {
          sheet.classList.toggle("open");
        }
        this.is_work_history_loading = false;
      });
    }
  }

  optimizeProject(index : number){
    this.currentProjectIndex = index;
    if(this.projectFields.at(index).get('description')?.value){
      this.is_projects_loading = true;
      const project_prompt = this.promptService.get_New_Project_Prompt(this.projectFields.at(index).get('description')?.value);
      this.genaiService.getGeminiProResponse(project_prompt).then((response)=>{
      console.log(response);
      this.projectList_genai = response.split("###").filter((item)=>{return item != ""});
      const sheet = document.getElementById("sheet");
      if (sheet) {
        sheet.classList.toggle("open");
      }
      this.is_projects_loading = false;
    });
    }
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
    if(this.experienceForm.controls['position_title']?.value && this.experienceForm.controls['company_name']?.value){
      let new_experience = 
      {
        id : this.experience_list.length,
        position_title : this.experienceForm.controls['position_title']?.value, 
        company_name : this.experienceForm.controls['company_name']?.value, 
        location : this.experienceForm.controls['location']?.value, 
        start_date : this.experienceForm.controls['start_date']?.value, 
        end_date : this.experienceForm.controls['end_date']?.value, 
        description : this.experienceForm.controls['description']?.value
      }
      if(this.selectedExperienceItem?.id || this.selectedExperienceItem?.id === 0){
        this.experience_list = [...this.experience_list.slice(0,this.selectedExperienceItem.id), new_experience, ...this.experience_list.slice(this.selectedExperienceItem.id + 1,)];
      }
      else{
        this.experience_list.push(new_experience)
      }
      this.selectedExperienceItem = {id : null,position_title :   null, company_name : null, location : null, start_date : null, end_date : null, description : null}
      this.experienceForm.reset();
      this.saveAndContinue();
      }
  }

  editExperienceItem(experience : any){
      this.experienceForm.controls['position_title'].setValue(experience.position_title?experience.position_title : "") 
      this.experienceForm.controls['company_name'].setValue(experience.company_name?experience.company_name : "")
      this.experienceForm.controls['location'].setValue(experience.location?experience.location : "")
      this.experienceForm.controls['start_date'].setValue(experience.start_date?experience.start_date : "") 
      this.experienceForm.controls['end_date'].setValue(experience.end_date?experience.end_date : "") 
      this.experienceForm.controls['description'].setValue(experience.description?experience.description : "") 
      this.selectedExperienceItem = experience;
      this.removeExperienceItem(experience);
  }

  removeExperienceItem(experience : any){
    this.openDialog();
    console.log(experience);
    if(this.experience_list.length === 1){
      this.experience_list = []
    }
    else{
      this.experience_list = [...this.experience_list.slice(0,experience.id), ...this.experience_list.slice(experience.id + 1,)];
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

  saveToProjectList(){
    if(this.projectForm.controls['project_title']?.value){
      let new_project = 
      {
        id : this.project_list.length,
        project_title : this.projectForm.controls['project_title']?.value, 
        project_link : this.projectForm.controls['project_link']?.value, 
        technologies_used : this.projectForm.controls['technologies_used']?.value, 
        description : this.projectForm.controls['description']?.value
      }
      if(this.selectedProjectItem?.id || this.selectedProjectItem?.id === 0){
        this.project_list = [...this.project_list.slice(0,this.selectedProjectItem.id), new_project, ...this.project_list.slice(this.selectedProjectItem.id + 1,)];
      }
      else{
        this.project_list.push(new_project)
      }
      this.selectedProjectItem = {id : null,project_title : null, project_link : null, technologies_used : null, description : null}
      this.projectForm.reset();
      this.saveAndContinue();
      }
  }

  editProjectItem(project : any){
      this.projectForm.controls['project_title'].setValue(project.project_title?project.project_title : "") 
      this.projectForm.controls['project_link'].setValue(project.project_link?project.project_link : "")
      this.projectForm.controls['technologies_used'].setValue(project.technologies_used?project.technologies_used : "")
      this.projectForm.controls['description'].setValue(project.description?project.description : "") 
      this.selectedProjectItem = project;
      this.removeProjectItem(project);
  }

  removeProjectItem(project : any){
    this.openDialog();
    console.log(project);
    if(this.project_list.length === 1){
      this.project_list = []
    }
    else{
      this.project_list = [...this.project_list.slice(0,project.id), ...this.project_list.slice(project.id + 1,)];
    }
  }

  saveToEducationList(){
    if(this.educationForm.controls['degree']?.value){
      let new_education = 
      {
        id : this.education_list.length,
        school_name : this.educationForm.controls['school_name']?.value, 
        school_location : this.educationForm.controls['school_location']?.value, 
        degree : this.educationForm.controls['degree']?.value, 
        field_of_study : this.educationForm.controls['field_of_study']?.value,
        gpa : this.educationForm.controls['gpa']?.value, 
        graduation_year : this.educationForm.controls['graduation_year']?.value
      }
      if(this.selectedEducationItem?.id || this.selectedEducationItem?.id === 0){
        this.education_list = [...this.education_list.slice(0,this.selectedEducationItem.id), new_education, ...this.education_list.slice(this.selectedEducationItem.id + 1,)];
      }
      else{
        this.education_list.push(new_education)
      }
      this.selectedEducationItem = {id : null,school_name: null,school_location: null,degree: null,field_of_study: null,gpa: null,graduation_year: null}
      this.educationForm.reset();
      this.saveAndContinue();
      }
  }

  editEducationItem(education : any){
      this.educationForm.controls['school_name'].setValue(education.school_name?education.school_name : "") 
      this.educationForm.controls['school_location'].setValue(education.school_location?education.school_location : "")
      this.educationForm.controls['degree'].setValue(education.degree?education.degree : "")
      this.educationForm.controls['field_of_study'].setValue(education.field_of_study?education.field_of_study : "") 
      this.educationForm.controls['gpa'].setValue(education.gpa?education.gpa : "")
      this.educationForm.controls['graduation_year'].setValue(education.graduation_year?education.graduation_year : "") 
      this.selectedEducationItem = education;
      this.removeEducationItem(education);
  }

  removeEducationItem(education : any){
    this.openDialog();
    console.log(education);
    if(this.education_list.length === 1){
      this.education_list = []
    }
    else{
      this.education_list = [...this.education_list.slice(0,education.id), ...this.education_list.slice(education.id + 1,)];
    }
  }

  saveToCertificationList(){
    if(this.certifyForm.controls['certification_name']?.value){
      let new_certification = 
      {
        id : this.certification_list.length,
        certification_name : this.certifyForm.controls['certification_name']?.value, 
        issued_organisation : this.certifyForm.controls['issued_organisation']?.value, 
        issued_month : this.certifyForm.controls['issued_month']?.value, 
        issued_year : this.certifyForm.controls['issued_year']?.value,
        certification_link : this.certifyForm.controls['certification_link']?.value, 
        description : this.certifyForm.controls['description']?.value
      }
      if(this.selectedCertificationItem?.id || this.selectedCertificationItem?.id === 0){
        this.certification_list = [...this.certification_list.slice(0,this.selectedCertificationItem.id), new_certification, ...this.certification_list.slice(this.selectedCertificationItem.id + 1,)];
      }
      else{
        this.certification_list.push(new_certification)
      }
      this.selectedCertificationItem = {id : null,certification_name: null,issued_organisation: null,issued_month: null,issued_year: null,certification_link: null,description: null}
      this.certifyForm.reset();
      this.saveAndContinue();
      }
  }

  editCertificationItem(certification : any){
      this.certifyForm.controls['certification_name'].setValue(certification.certification_name?certification.certification_name : "") 
      this.certifyForm.controls['issued_organisation'].setValue(certification.issued_organisation?certification.issued_organisation : "")
      this.certifyForm.controls['issued_month'].setValue(certification.issued_month?certification.issued_month : "")
      this.certifyForm.controls['issued_year'].setValue(certification.issued_year?certification.issued_year : "") 
      this.certifyForm.controls['certification_link'].setValue(certification.certification_link?certification.certification_link : "")
      this.certifyForm.controls['description'].setValue(certification.description?certification.description : "") 
      this.selectedCertificationItem = certification;
      this.removeCertificationItem(certification);
  }

  removeCertificationItem(certification : any){
    this.openDialog();
    console.log(certification);
    if(this.certification_list.length === 1){
      this.certification_list = []
    }
    else{
      this.certification_list = [...this.certification_list.slice(0,certification.id), ...this.certification_list.slice(certification.id + 1,)];
    }
  }

  saveToSkillsList(){
    if(this.skillsForm.controls['skills']?.value){
      let new_skill = 
      {
        id : this.skills_list.length,
        skills : this.skillsForm.controls['skills']?.value
      }
      if(this.selectedSkillItem?.id || this.selectedSkillItem?.id === 0){
        this.skills_list = [...this.skills_list.slice(0,this.selectedSkillItem.id), new_skill, ...this.skills_list.slice(this.selectedSkillItem.id + 1,)];
      }
      else{
        this.skills_list.push(new_skill)
      }
      this.selectedSkillItem = {id : null,skills : null}
      this.skillsForm.reset();
      this.saveAndContinue();
      }
  }

  editSkillItem(skillItem : any){
      this.skillsForm.controls['skills'].setValue(skillItem.skills?skillItem.skills : "") 
      this.selectedSkillItem = skillItem;
      this.removeSkillItem(skillItem);
  }

  removeSkillItem(skillItem : any){
    this.openDialog();
    console.log(skillItem);
    if(this.skills_list.length === 1){
      this.skills_list = []
    }
    else{
      this.skills_list = [...this.skills_list.slice(0,skillItem.id), ...this.skills_list.slice(skillItem.id + 1,)];
    }
  }

  // isSummaryAIRes() : boolean{
  //   if(this.summaryAIResponses.length == 0 && this.jobDescAIRes().Profile_Summary.length >0){
  //     let res : SummaryData = {summary : "", ats_score : ""}
  //     res.summary = this.jobDescAIRes().Profile_Summary.split("###")[0];
  //     res.ats_score = this.jobDescAIRes().Profile_Summary.split("###")[1]?this.jobDescAIRes().Profile_Summary.split("###")[1] : "";
  //     this.summaryAIResponses.push(res);
  //     return true
  //   }
  //   else{
  //     return this.summaryAIResponses.length > 0;
  //   }
  // }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const Quill = (await import('quill')).default; // Dynamically import Quill
      this.editor = new Quill(this.editorContainer.nativeElement, {
        theme: 'snow',
        placeholder: 'Resume Summary', // Set placeholder text
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }]
          ],
        },
      });

      // Sync editor description with FormControl
      // this.editor.on('text-change', () => {
      //   this.summaryForm.get('profile_summary')?.setValue(this.editor.root.innerHTML, { emitEvent: false });
      //   const editor = document.querySelector('.ql-editor');
      //     if(editor){
      //       if (editor.innerHTML.trim() === '<p><br></p>' || editor.innerHTML.trim() === '') {
      //           editor.classList.add('ql-blank');
      //       } else {
      //           editor.classList.remove('ql-blank');
      //       }
      //     }
      // });

      // Sync FormControl value changes with Quill
      this.summaryForm.get('profile_summary')?.valueChanges.subscribe((value) => {
        if (this.editor.root.innerHTML !== value) {
          this.editor.root.innerHTML = value || '';
        }
      });
      this.initializeEditor();
      this.setSummaryValues();

    }

  }


initializeEditor() {
  this.textChangeHandler = this.handleTextChange.bind(this); // Bind the handler to preserve context
  this.editor.on('text-change', this.textChangeHandler); // Attach the event handler
  const editor = document.querySelector('.ql-editor');
  const content = this.editor?.root.innerHTML.trim();
  this.isButtonDisabled = content === '<p><br></p>' || content === '';
}

handleTextChange() {
  this.summaryForm.get('profile_summary')?.setValue(this.editor.root.innerHTML, { emitEvent: false });
  const editor = document.querySelector('.ql-editor');
  if (editor) {
      const content = this.editor?.root.innerHTML.trim();
      this.isButtonDisabled = content === '<p><br></p>' || content === '';
      if (editor.innerHTML.trim() === '<p><br></p>' || editor.innerHTML.trim() === '') {
          editor.classList.add('ql-blank');
      } else {
          editor.classList.remove('ql-blank');
      }
  }
}




  getEditorRawData(): string {
    // const html = this.editor.root.innerHTML; 
    const rawText = this.editor.getText().trim(); // Plain text (removes formatting and extra whitespace)
    return rawText;
  }

  setDataInEditor(sentences: string[]): void {
    if (this.editor) {
      // Convert sentences to HTML
      const html = sentences.map((sentence) => `<p>${sentence}</p>`).join('');
      this.editor.clipboard.dangerouslyPasteHTML(html); // Set the HTML description in the editor
    }
  }
  

  logContent(): void {
    console.log(this.summaryForm.get('profile_summary')?.value);
  }
}
