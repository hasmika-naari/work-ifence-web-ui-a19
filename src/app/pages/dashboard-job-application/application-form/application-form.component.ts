import { CommonModule, DOCUMENT, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, Signal, SimpleChanges, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Certification, ClientDetails, Education, Experience, JobApplication, JobDescriptionAIResponse, JobResume, JobResumeRequest, Project, Resume, RoundDetails, TemplateVariables, VendorDetails } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { ResumeService } from 'src/app/services/resume.service';
import { SidenavService } from 'src/app/layout/sidenav/sidenav.service';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Account, BioProfile } from 'src/app/services/profile.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { ResumeTemplateDto, UserResume } from 'src/app/services/store/user-store';
import { JobApplicationRequest, JobInterviewRounds, ResumeListDataItem, VendorContact } from 'src/app/services/work-ifence-data.model';
import { ResumeAccess } from 'src/app/services/store/resume.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { Resume1TemplateComponent } from 'src/app/pages/resume-form3/template/template.component';
import { ResumeContactComponent } from 'src/app/pages/resume-form3/contact/contact.component';
import { ContextMenuComponent } from 'src/app/pages/resume-form3/context-menu/context-menu.component';
import { CertificationComponent } from 'src/app/pages/resume-form3/certification/certification.component';
import { CourseWorkComponent } from 'src/app/pages/resume-form3/course-work/course-work.component';
import { EducationComponent } from 'src/app/pages/resume-form3/education/education.component';
import { ProjectComponent } from 'src/app/pages/resume-form3/project/project.component';
import { SkillsComponent } from 'src/app/pages/resume-form3/skills/skills.component';
import { SummaryComponent } from 'src/app/pages/resume-form3/summary/summary.component';
import { ExperianceComponent } from 'src/app/pages/resume-form3/experiance/experiance.component';
import { ResumeTitleComponent } from 'src/app/pages/resume-form3/resume-title/resume-title.component';
import { ResumeTemplateListComponent } from 'src/app/pages/resume-form3/resume-template-list/resume-template-list.component';
import { ResumeTemplate2Component } from 'src/app/pages/resume-form3/template2/template2.component';
import { ResumeTemplate3Component } from 'src/app/pages/resume-form3/template3/template3.component';
import { ResumeTemplate4Component } from 'src/app/pages/resume-form3/template4/template4.component';
import { ResumeTemplate5Component } from 'src/app/pages/resume-form3/template5/template5.component';
import { ResumeTemplate6Component } from 'src/app/pages/resume-form3/template6/template6.component';
import { ResumeTemplate7Component } from 'src/app/pages/resume-form3/template7/template7.component';
import { ResumeTemplate8Component } from 'src/app/pages/resume-form3/template8/template8.component';
import { DiscardDialogComponent } from 'src/app/pages/resume-form3/discard-dialog/discard-dialog.component';
import { AchievementsComponent } from 'src/app/pages/resume-form3/achievements/achievements.component';
import { JobDescriptionComponent } from 'src/app/pages/resume-form3/job-description/job-description.component';
import { PreviewResumeComponent } from 'src/app/pages/resume-form3/preview-resume/preview-resume.component';
import { DeleteDialogComponent } from 'src/app/pages/delete-dialog/delete-dialog.component';
import { ApplicationsTabComponent } from './applications-tab/applications-tab.component';
import { VendorComponent } from './vendor/vendor.component';
import { ClientComponent } from './client/client.component';
import { RoundsComponent } from './rounds/rounds.component';
import { FeedbackComponent } from './feedback/feedback.component';
import moment from 'moment';
import { ConfirmDialogComponent } from '../../resume-form3/confirm-dialog/confirm-dialog.component';
import { getDocument, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { PdfViewerComponent } from 'src/app/shared/pdf-viewer/pdf-viewer.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { ResumeListDialogComponent } from './resume-list-dialog/resume-list-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { P } from '@angular/cdk/keycodes';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'application-form',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent, MatDialogModule, MatProgressBarModule,
    CarouselModule,FlexLayoutModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  
    MatStepperModule, MatFormFieldModule,InputTextModule,TableModule, MenuModule,Resume1TemplateComponent,
    MatInputModule,ButtonModule,OverlayPanelModule,ResumeContactComponent,ContextMenuComponent,
    MatButtonModule,AccordionModule,InputTextareaModule,CertificationComponent,CourseWorkComponent,
    EducationComponent,ProjectComponent,SkillsComponent,SummaryComponent,ProgressBarModule, MatTooltipModule,
    MatIconModule,MatExpansionModule, ExperianceComponent, ResumeTitleComponent, ResumeTemplateListComponent, ResumeTemplate2Component,ResumeTemplate3Component
  , ResumeTemplate4Component, ResumeTemplate5Component, ResumeTemplate6Component, ResumeTemplate7Component, ResumeTemplate8Component, DiscardDialogComponent, AchievementsComponent,
  JobDescriptionComponent, ApplicationsTabComponent, VendorComponent, ClientComponent, RoundsComponent, FeedbackComponent, PdfViewerComponent],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ApplicationFormComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges, AfterViewInit {

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
  skillCount : number = 0
  isResumeGiven : boolean = false
  resumeSource : any;
  isResumeDeleteConfirm : boolean = false

  default_template : string = ""

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

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  private platformId: object =  inject(PLATFORM_ID);
  private _snackBar = inject(MatSnackBar);

  userAccount: Signal<Account> = this.userStore.getUserAccount();
  selectedResume : Signal<UserResume> = this.userStore.getSelectedResume();
  selectedResumeListItem : Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  isChangeInNewResume : Signal<boolean> = this.userStore.getIsChangeInNewResume();
  jobDescAIRes : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  jobApplication : Signal<JobApplication> = this.userStore.getSelectedJobApplication();
  jobApplicationFlag : Signal<boolean> = this.userStore.getJobApplicationFlag();
  jobApplications : Signal<JobApplication[]> = this.userStore.getJobApplicationsList();




  visible = true;
  outLineButton = true;

  browser = false;

  hidePanelWindow = true;
  showPanelWindow = false;
  formLabel = 'Contact';
  isActionInProgress =  false;
  isActionInProgressNotGiven : boolean = false
  isActionInProgressGiven : boolean = false

  loadingMenu = true;
  isResumeTabSelected : boolean = false

  constructor(
      private _formBuilder: FormBuilder, 
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public zone: NgZone,
      public promptService : PromptService, 
      public appUtilService: AppUtilService,
      private sidenavService: SidenavService,
      private el: ElementRef,
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog,
      public resumeService : ResumeService,
    public pdfToImageService : PdfToImageService) {
      if(this.jobApplication().job_application_details.resume_download_link){
        this.pdfToImageService.convertPdfToImageBytesThroughUrl(this.jobApplication().job_application_details.resume_download_link).then((e)=>{
          this.resumeToImageBytes = e;
          this.isResumeGiven = true;
        })
      }
    }

  experienceForm = this._formBuilder.group({
    position_title: [''],
    company_name: [''],
    location : [''],
    start_date: [''],
    end_date: [''],
    description : ['']
  });

  skillsItems : Array<string> = []

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

  currentWorkExpIndex : number = 0;
  currentProjectIndex : number = 0;
  courseWorkCount : number = 0;


  showVendorDetailsWindow = false;
  showClientWindow = false;
  showJobDescriptionWindow = false;
  showApplicationTabWindow = false;
  showResumeTemplateList = false;
  showRoundsWindow = false;
  showFeedbackWindow = false;
  showCertificationsDetailsWindow =  false;
  showAchievementsDetailsWindow = false;
  showCourseWorkDetailsWindow = false;
  showSkillsDetailsWindow =  false;
  showSummaryDetailsWindow = false;
  isMenuVisible: boolean = false;
  selectedTemplateName : String = "TEMPLATE_2"
  isDisabled : boolean = false

  showVendorBind = this.showVendor.bind(this);
  closeOptions = 
    [{
        label: 'Back To Applications',
        icon: 'pi pi-times',
        command: ($event: any) => {
            this.goback($event);
        }
    },
  ];

  options = 
    [
    {
        label: 'SAVE',
        icon: 'pi pi-save',
        command: ($event: any) => {
            this.saveResume();
        }
    },
    ];

  items = [{
    items: [
      {
        label: 'APPLICATION',
        icon: 'pi pi-check-circle',
        command: ($event: any) => {
            this.showApplicationTab();
        }
    },{
        label: 'VENDOR',
        icon: 'pi pi-check-circle',
        command: ($event: any) => {
            this.showVendor();
        }
    },
    {
        label: 'CLIENT',
        icon: 'pi pi-check-circle',
        command: () => {
            this.showClient();
        }
    },
    {
      label: 'ROUNDS',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showRounds();
      }
    },
    {
      label: 'FEEDBACK',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showFeedback();
      }
    },
    ]}
];




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
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.subs.forEach(s => s.unsubscribe());
  }

  toggle() {
    this.overlayVisible = !this.overlayVisible;
}

showTemplate(){

}

downloadResume(){
  this.saveAndDownload()
}

editResumeTitleHandler($event:any){
  
  this.showApplicationTab();
}

editResumeTemplateHandler($event: any){
  this.showResumeTemplates()
}

ngOnChanges(changes: SimpleChanges): void {
 console.log("ngOnChanges");
}

ngAfterViewInit(): void {
  console.log('ngAfterViewInit: Called');
  setTimeout(() => {
    // //this.sidenavService.setCollapsed(true);
    // this.sidenavService.setExpanded(false);
    }, 500);
}

  ngOnInit() {
    this.browser = isPlatformBrowser(this.platformId);
    if(isPlatformBrowser(this.platformId)){
      setTimeout(() => {
      // this.sidenavService.toggleCollapsed();
      //this.sidenavService.setCollapsed(true);
      }, 50);
      // //this.sidenavService.setCollapsed(true);
      this.getTemplate();

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

    
    if(this.jobApplication().job_application_details.resume_download_link){
      this.isResumeGiven = true
      this.resumeSource = this.jobApplication().job_application_details.resume_download_link;
    }
  }

  accessCategories: Array<ResumeAccess> = [
    {
      id: 1,
      access_category: 'PUBLIC',
      access_description: 'Public',
      tags: ''
    },
    {
      id : 2,
      access_category : 'PRIVATE',
      access_description: 'Private',
      tags : ''
    },
    {
      id : 3,
      access_category : 'ONLY_EMPLOYER',
      access_description: 'Only Employer',
      tags : ''
    },
    {
      id : 4,
      access_category : 'PUBLIC_ONLY_EMPLOYER',
      access_description: 'Public & Only Employer',
      tags : ''
    },
    {
      id : 5,
      access_category : 'PRIVATE_ONLY_EMPLOYER',
      access_description: 'Private & Only Employer',
      tags : ''
    }
  ]

  getTemplate(){
    // this.default_template = this.templateService.getDefaultResumeTemplate();
    // const element = this.document.getElementById("display-resume-div");
    // if(element){
    //   element.innerHTML = this.default_template;
      
      
    // }

  
  }

  ngAfterViewChecked(): void {
    if(this.browser){
      this.attachEventHandlers();
      setTimeout(() => {
        // //this.sidenavService.setCollapsed(false);
        // this.sidenavService.setExpanded(false);
        }, 500);
    
    }
  }

  attachEventHandlers() {
  const editContactElement = document.getElementById('editContact');
    if (editContactElement) {
     editContactElement.addEventListener('click', this.showVendor.bind(this));
    }

    // const buttons = this.el.nativeElement.querySelectorAll('editContact');
    // buttons.forEach((button: any) => {
    //   button.addEventListener('click', this.showVendor.bind(this));
    //   alert('Added Event Handler');
    // });
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

showMenu() {
  alert('Show Menu');
  this.isMenuVisible = true;
}

hideMenu() {
  this.isMenuVisible = false;
}

  saveContact(){

     // Find the element by its ID
    //  const nameElement = document.getElementById('resumeName');
    //  if (nameElement) {
    //    nameElement.textContent = contact.name;
    //  }


    //   const editContactElement = document.getElementById('editContact');
    //  if (editContactElement) {
    //   editContactElement.addEventListener('click', this.showVendor);
    //  }
    

    this.getTemplate();
    this.hidePanelWindow = true;
    

       // Find the element by its ID
      //  const phoneElement = document.getElementById('resumePhoneNumber');
      //  if (phoneElement) {
      //   phoneElement.textContent = contact.phone_number;
      //  }

        // Find the element by its ID
        // const emailElement = document.getElementById('resumeEmailId');
        // if (emailElement) {
        //   emailElement.textContent = contact.email;
        // }

         // Find the element by its ID
        //  const githubLinkElement = document.getElementById('resumeGitHubUrl');
        //  if (githubLinkElement) {
        //   githubLinkElement.textContent = contact.github_profile;
        //  }

           // Find the element by its ID
          //  const linkedInElement = document.getElementById('resumeLinkedInUrl');
          //  if (linkedInElement) {
          //   linkedInElement.textContent = contact.linkedIn_profile;
          //  }
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

  closePanelWindow($event: any){
    this.hidePanelWindow = true;
    this.userStore.setRoundDetails(new RoundDetails());
  }

  saveAndContinue(display : String | null){
    const saveSuccessCard = document.getElementById("saveSuccessCard");
    if(saveSuccessCard){
      if(display){
        saveSuccessCard.innerHTML = `
          ${display}
          `
      }
      saveSuccessCard.classList.add("show");

      // Remove the card after some time (e.g., 3 seconds)
      setTimeout(() => {
        saveSuccessCard.classList.remove("show");
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  }

  // onFileSelected(event: any) {
  //   this.showProfileImage = true;
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.convertImageToBase64(file);
  //   }
  // }

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

  getImageBase64(imageBytes : any){
    return "data:image/png;base64, " + imageBytes;
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    // buffer.forEach((byte) => {
    //   binary += String.fromCharCode(byte);
    // });
    return btoa(binary);
  }

  onSubmit(){

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

  previewResume(): void {
    const dialogRef = this.dialog.open(PreviewResumeComponent, {
      data: {name: this.resumeSignalForm().template_details.template_name},
      panelClass: 'preview-resume-model-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {    
      if(result.event == 'DOWNLOAD'){
        this.saveAndDownload();
      }
    });
  }

  showEditSection($event : any){
    if($event.section === "RESUMETITLE"){
      this.showApplicationTab()
    }
    if($event.section === "CONTACT"){
      this.showVendor()
    }
    else if($event.section === "SUMMARY"){
      this.showSummaryDetails()
    }
    else if($event.section === "EDUCATION"){
      this.showFeedback()
    }
    else if($event.section === "COURSEWORK"){
      this.showCourseWorkDetails()
    }
    else if($event.section === "SKILLS"){
      this.showSkillsDetails()
    }
    else if($event.section === "PROJECT"){
      this.showRounds()
    }
    else if($event.section === "EXPERIENCE"){
      this.showClient()
    }
    else if($event.section === "CERTIFICATION"){
      this.showCertificationsDetails()
    }
    else if($event.section == "ACHIEVEMENTS"){
      this.showAchievementsDetails()
    }
  }

  showResumeTemplates(){
    this.formLabel = 'Pick a Template';
    this.hidePanelWindow = false;
    this.showResumeTemplateList = true;
    this.showJobDescriptionWindow = false;
    this.showApplicationTabWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
  }

  showJobDescription(){
    this.formLabel = 'Job Description';
    this.hidePanelWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = true;
    this.showApplicationTabWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
  }

  showApplicationTab(){
    this.formLabel = 'Application Details';
    this.isResumeTabSelected = false
    this.hidePanelWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showApplicationTabWindow = true;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;

  }

  showClient(){
    this.formLabel = 'Client Details';
    this.isResumeTabSelected = false;
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showJobDescriptionWindow = false;
    this.showResumeTemplateList = false;
    this.showClientWindow = true;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;

  }
  

  showVendor(){
    this.formLabel = 'Vendor Details';
    this.isResumeTabSelected = false;
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = true;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;

  }

  showRounds(){
    this.formLabel = 'Round Details';
    this.isResumeTabSelected = false;
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = true;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;

  }
  showFeedback(){
    this.formLabel = 'Feedback';
    this.isResumeTabSelected = false;
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = true;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
  }

  showResumeTab(){
    this.isResumeTabSelected = true;
  }

  showCertificationsDetails(){
    this.formLabel = 'Certification';
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  true;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;

  }

  showAchievementsDetails(){
    this.formLabel = 'Achievements';
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= true;
  }
  
  showCourseWorkDetails(){
    this.formLabel = 'Course Work';
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = true;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.courseWorkCount = this.courseWorkCount + 1;


  }
  showSkillsDetails(){
    this.formLabel = 'Skill Details';
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  true;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.skillCount = this.skillCount + 1;

    
  }

  showSummaryDetails(){
    this.formLabel = 'Summary';
    this.hidePanelWindow = false;
    this.showApplicationTabWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showClientWindow = false;
    this.showVendorDetailsWindow = false;
    this.showRoundsWindow = false;
    this.showFeedbackWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = true;
    this.showAchievementsDetailsWindow= false;

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

  isExpanded: boolean = false;

  toggleDescription(): void {
    this.isExpanded = !this.isExpanded;
  }

  isExpandedNote : boolean = false;

  toggleNote():void{
    this.isExpandedNote = !this.isExpandedNote;
  }

  editRound(round : RoundDetails){
    this.userStore.setRoundDetails(round);
    this.showRounds();
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
      
    }
  }

  goback($event: any){
      if(this.jobApplicationFlag()){
          const dialogRef = this.dialog.open(DiscardDialogComponent, {
            data: {name: 'confirm'},
            width: '300px',
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if(result.event === "SAVE"){
              if(this.isAllFormsValid()){
                this.saveJobApplication("")
                this.userStore.updateSidebar(false);
                this.router.navigateByUrl('/user/job-applications');
                this.userStore.setJobApplicationFlag(false);
              }
              else{
                this.openSnackBar("Please complete all required fields in the application form.", "Close");
              }
            }
            else{
              this.userStore.setJobApplicationFlag(false);
              this.userStore.updateSidebar(false);
              this.router.navigateByUrl('/user/job-applications');
            }
          })
      }
      else{
        this.userStore.setJobApplicationFlag(false);
        this.userStore.updateSidebar(false);
        this.router.navigateByUrl('/user/job-applications');
      }
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
      //this.saveAndContinue("Changes saved");
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
      //this.saveAndContinue("Changes saved");
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
      //this.saveAndContinue("Changes saved");
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
      //this.saveAndContinue("Changes saved");
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
      //this.saveAndContinue("Changes saved");
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


  saveResume(){
    
    this.isActionInProgress = true;
    this.isDisabled = true;
    const element = document.getElementById("actions-disable");
    if(element != null){
      element.style.zIndex = "1000";
      element.style.display = "none";
    }
    let request = new JobResumeRequest();
    request.title = this.resumeSignalForm().title;
    request.category = this.resumeSignalForm().resume_category;
    request.roleCategory = this.resumeSignalForm().role_category;
    this.accessCategories.map((e)=>{
      if(e.access_description == this.resumeSignalForm().access_level){
        request.access = e.access_category
      }
    })
    request.description = "Resume Description"
    let custom_fileName = this.resumeSignalForm().title.replace(/\s+/g, "") +  this.appUtilService.generateUniqueString() + '.pdf';
    request.old_documentUrl =this.selectedResumeListItem().documentUrl;
    request.current_documentUrl = this.userAccount().login + "/wif-resume/" +  custom_fileName
    request.resumeJson = JSON.stringify(this.resumeSignalForm());
    request.status = this.resumeSignalForm().isActive?"ACTIVE":"IN_ACTIVE";
    request.isPrimary = this.resumeSignalForm().isPrimary;
    request.lastUpdatedDate = Date.now().toString();
    request.lastUsedFor = "";
    request.templateId = this.resumeSignalForm().template_details.id.toString();
    request.ownerId = this.userAccount().id;
    request.old_filename = this.selectedResumeListItem().fileName;
    request.current_filename = custom_fileName;
    request.htmlcontent = this.templateService.getFormatedResumeHTMLText(this.resumeSignalForm().template_details.template_name, this.getUnHideElements())
    request.username = this.userAccount().login;

    if(!this.selectedResumeListItem().id){
        request.createdDate = Date.now().toString();
      this.resumeService.saveResume(request).subscribe(() => {
        
        this.isActionInProgress = false;
        this.isDisabled = false;
        const element = document.getElementById("actions-disable");
        if(element != null){
          element.style.zIndex = "-1000";
          element.style.display = "none";
        }
        this.userStore.setIsChangeInNewResume(false);
        this.router.navigateByUrl('/user/resumes');
      });
    }else{
      request.id = this.selectedResumeListItem().id;
      request.createdDate = this.selectedResumeListItem().createdDate;
      this.resumeService.updateResume(request).subscribe(() => {
        
        this.isActionInProgress = false;
        this.isDisabled = false;
        const element = document.getElementById("actions-disable");
        if(element != null){
          element.style.zIndex = "-1000";
          element.style.display = "none";
        }
        this.userStore.setIsChangeInNewResume(false);
        this.router.navigateByUrl('/user/resumes');
      });
    }
  }

  getUnHideElements(){
    let resume = new Resume();
    resume.achievement = this.resumeSignalForm().achievement;
    resume.award = this.resumeSignalForm().award;
    resume.certification = this.resumeSignalForm().certification.filter(e=>e.isHideSelected == false)
    resume.contact = this.resumeSignalForm().contact;
    resume.courseWork = this.resumeSignalForm().courseWork;
    resume.education = this.resumeSignalForm().education.filter(e=>e.isHideSelected == false)
    resume.experience = this.resumeSignalForm().experience.filter(e=>e.isHideSelected == false)
    resume.imageBase64Encoded = this.resumeSignalForm().imageBase64Encoded;
    resume.interest = this.resumeSignalForm().interest;
    resume.language = this.resumeSignalForm().language;
    resume.professional_membership = this.resumeSignalForm().professional_membership;
    resume.profileSummary = this.resumeSignalForm().profileSummary;
    resume.project = this.resumeSignalForm().project.filter(e=>e.isHideSelected == false)
    resume.publication = this.resumeSignalForm().publication;
    resume.skill = this.resumeSignalForm().skill;
    resume.volunteer_experience = this.resumeSignalForm().volunteer_experience;

    return resume;

  }


  saveAndDownload(){
    this.isActionInProgress = true;
    this.isDisabled = true;
    const element = document.getElementById("actions-disable");
    if(element != null){
      element.style.zIndex = "1000";
      element.style.display = "none";
    }
    let request = new JobResumeRequest();
    request.title = this.resumeSignalForm().title;
    request.category = this.resumeSignalForm().resume_category;
    request.roleCategory = this.resumeSignalForm().role_category;
    this.accessCategories.map((e)=>{
      if(e.access_description == this.resumeSignalForm().access_level){
        request.access = e.access_category
      }
    })
    request.description = "Resume Description"
    let custom_fileName = this.resumeSignalForm().title.replace(/\s+/g, "")+ this.appUtilService.generateUniqueString() + '.pdf';
    request.old_documentUrl =this.selectedResumeListItem().documentUrl;
    request.current_documentUrl = this.userAccount().login + "/wif-resume/" +  custom_fileName
    request.resumeJson = JSON.stringify(this.resumeSignalForm());
    request.status = this.resumeSignalForm().isActive?"ACTIVE":"IN_ACTIVE";
    request.isPrimary = this.resumeSignalForm().isPrimary;
    request.lastUpdatedDate = Date.now().toString();
    request.lastUsedFor = "";
    request.templateId = this.resumeSignalForm().template_details.id.toString();
    request.ownerId = this.userAccount().id;
    request.old_filename = this.selectedResumeListItem().fileName;
    request.current_filename = custom_fileName;
    request.htmlcontent = this.templateService.getFormatedResumeHTMLText(this.resumeSignalForm().template_details.template_name, this.getUnHideElements())
    request.username = this.userAccount().login;
    console.log(request.htmlcontent);
    if(!this.selectedResumeListItem().id){
      request.createdDate = Date.now().toString();
    }else{
    request.id = this.selectedResumeListItem().id;
    request.createdDate = this.selectedResumeListItem().createdDate;
    }
    this.resumeService.saveAndDownloadResume(request).subscribe((res : any)=>{
          var blob = new Blob([res], { type: 'application/pdf' });

          // Create a data URL from the Blob
          var dataUrl = URL.createObjectURL(blob);

          // Create a link element
          var link = document.createElement('a');

          // Set the href attribute with the data URL
          link.href = dataUrl;

          // Set the download attribute with the desired file name
          link.download = 'example.pdf';

          // Append the link to the document
          document.body.appendChild(link);

          // Trigger a click event on the link to initiate the download
          link.click();

          // Remove the link from the document
          document.body.removeChild(link);
          this.isActionInProgress = false;
          this.isDisabled = false;
          const element = document.getElementById("actions-disable");
          if(element != null){
            element.style.zIndex = "-1000";
            element.style.display = "none";
          }
          this.userStore.setIsChangeInNewResume(false);
          this.router.navigateByUrl('/user/resumes');
      })


  }

  confirmDiscardAction(): void {
    const dialogRef = this.dialog.open(DiscardDialogComponent, {
      data: {name: 'confirm'},
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === "SAVE"){
        this.saveResume()
      }
      this.userStore.updateSidebar(false);
      this.userStore.setIsChangeInNewResume(false);
      this.router.navigateByUrl('/user/resumes');
    });
  }


  saveJobApplication(instruction : any){
    this.isActionInProgress = true;
    this.isDisabled = true;
    const element = document.getElementById("actions-disable");
    if(element != null){
      element.style.zIndex = "1000";
      element.style.display = "none";
    }

    let application = this.jobApplication();
    let jobApplicationRequest = new JobApplicationRequest();

    jobApplicationRequest.jobApplication.applicantId = this.userAccount().id;
    jobApplicationRequest.jobApplication.emailUsed = application.job_application_details.email_provided;
    jobApplicationRequest.jobApplication.companyName = application.job_application_details.company_name;
    jobApplicationRequest.jobApplication.jobAppliedDate = application.job_application_details.applied_date;
    jobApplicationRequest.jobApplication.jobDescription = application.job_application_details.job_description;
    jobApplicationRequest.jobApplication.jobMode = application.job_application_details.job_mode;
    jobApplicationRequest.jobApplication.jobRole = application.job_application_details.job_role;
    jobApplicationRequest.jobApplication.jobType = application.job_application_details.job_type;
    jobApplicationRequest.jobApplication.companySize = application.job_application_details.location;
    jobApplicationRequest.jobApplication.status = application.job_application_details.status;
    jobApplicationRequest.jobApplication.companyOfficialWebsite = application.job_application_details.job_reference_url;
    jobApplicationRequest.jobApplication.resumeId = application.job_application_details.resume_download_link;
    jobApplicationRequest.jobApplication.createdBy = this.userAccount().id;
    jobApplicationRequest.jobApplication.lastModifiedBy =this.userAccount().id;
    if(application.job_application_details.id){
      jobApplicationRequest.jobApplication.id = application.job_application_details.id.toString();
      jobApplicationRequest.jobApplication.lastModifiedDate = moment().toString();
    }
    else{
      jobApplicationRequest.jobApplication.id = '';
      jobApplicationRequest.jobApplication.createdDate = moment().toString();
    }

    jobApplicationRequest.clientContact.firstName = application.client_details.first_name;
    jobApplicationRequest.clientContact.lastName = application.client_details.last_name;
    jobApplicationRequest.clientContact.email = application.client_details.email;
    jobApplicationRequest.clientContact.phone = application.client_details.phone_number;
    jobApplicationRequest.clientContact.companyName = application.client_details.company_name;
    jobApplicationRequest.clientContact.createdBy = this.userAccount().id;
    jobApplicationRequest.clientContact.lastModifiedBy = this.userAccount().id;
    if(application.client_details.id){
      jobApplicationRequest.clientContact.id = application.client_details.id?.toString();
      jobApplicationRequest.clientContact.lastModifiedDate = moment().toString();
    }
    else{
      jobApplicationRequest.clientContact.createdDate = moment().toString();
    }

    jobApplicationRequest.vendorContact.firstName = application.vendor_details.first_name;
    jobApplicationRequest.vendorContact.lastName = application.vendor_details.last_name;
    jobApplicationRequest.vendorContact.email = application.vendor_details.email;
    jobApplicationRequest.vendorContact.phone = application.vendor_details.phone_number;
    jobApplicationRequest.vendorContact.companyName = application.vendor_details.company_name;
    jobApplicationRequest.vendorContact.createdBy = this.userAccount().id;
    jobApplicationRequest.vendorContact.lastModifiedBy = this.userAccount().id;
    if(application.vendor_details.id){
      jobApplicationRequest.vendorContact.id = application.vendor_details.id?.toString();
      jobApplicationRequest.vendorContact.createdDate = moment().toString();
    }
    else{
      jobApplicationRequest.vendorContact.id = '';
      jobApplicationRequest.vendorContact.createdDate = moment().toString();
    }


    let rounds : JobInterviewRounds[] = []
    application.round_details.map((e)=>{
      let round = new JobInterviewRounds();
      round.createdBy = this.userAccount().id;
      round.lastModifiedBy = this.userAccount().id;
      if(application.job_application_details.id){
        round.applicationId = application.job_application_details.id.toString();
      }
      else{
        round.applicationId = '';
      }
      
      if(e.isNew){
        round.id = '';
        round.createdDate = moment().toString();
      }
      else{
        round.id = e.id?.toString();
        round.lastModifiedDate = moment().toString();
      }
      round.mode = e.mode;
      round.roundDate = e.date;
      round.roundDescription = e.notes;
      round.roundType = e.type;
      round.status = e.status;
      round.venueOrLink = e.meet_link;
      round.result = e.time;
      rounds.push(round);
    })
    jobApplicationRequest.jobInterviewRounds = rounds;

    
    if(application.job_application_details.id){
      this.resumeService.updateApplication(jobApplicationRequest).subscribe((e)=>{
        this.isActionInProgress = false;
        this.isDisabled = false;
        const element = document.getElementById("actions-disable");
        if(element != null){
          element.style.zIndex = "-1000";
          element.style.display = "none";
        }
        this.userStore.setJobApplication(new JobApplication());
        if(instruction != "DO_NOT_NAVIGATE"){
          this.router.navigateByUrl('/user/job-applications');
        }
      })
    }
    else{
      this.resumeService.saveApplication(jobApplicationRequest).subscribe((e)=>{
        this.isActionInProgress = false;
        this.isDisabled = false;
        const element = document.getElementById("actions-disable");
        if(element != null){
          element.style.zIndex = "-1000";
          element.style.display = "none";
        }
        this.userStore.setJobApplication(new JobApplication());
        if(instruction != "DO_NOT_NAVIGATE"){
          this.router.navigateByUrl('/user/job-applications');
        }
      })
    }
  }

  deleteRound($event : any, round : RoundDetails){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: { event: string; }) => {
      console.log(result.event);
      if(result.event == 'CONFIRM'){
        if(round.id){
          this.resumeService.deleteInterviewRound(round.id).subscribe(()=>{
          let index = this.jobApplication().round_details.findIndex(obj => obj.id === round.id)
          this.userStore.deleteRoundDetailsById(index);
          })
        }
        else{
          let index = this.jobApplication().round_details.findIndex(obj => obj.unqId === round.unqId)
          this.userStore.deleteRoundDetailsById(index);
        }
      }
    });
  }

  viewApplication(){
    this.isResumeTabSelected = false
  }

  onUploadClick(){

  }

  onSelectClick(){

  }

  openResumeDialog() {
    const dialogRef = this.dialog.open(ResumeListDialogComponent, {
      width: '880px',
    });

    dialogRef.afterClosed().subscribe((result : { event : any}) => {
      if (result.event == "CONFIRM") {
        console.log('Selected Resume:', result);
        let application = this.jobApplication();
        application.job_application_details.resume_download_link = "https://workifence.s3.amazonaws.com/" + this.selectedResumeListItem().documentUrl;
        this.userStore.setJobApplication(application);
        this.isResumeGiven = true;
        this.resumeToImageBytes = this.selectedResumeListItem().imageBytes;
        this.userStore.setJobApplicationFlag(true);
      }
    });
  }


  // ---------------------------------------- PDF to Image Bytes -------------------------------------------

  resume_file : File | null = null
  resumeFileName : string | undefined= ''
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  resumeDownloadUrl : string = ''
  resumeToImageBytes : string[] = []

  


  onFileSelected(event: any) {
    this.isActionInProgressNotGiven = true
    this.userStore.setJobApplicationFlag(true);
    this.resume_file = event.target.files[0];
    this.resumeFileName = this.resume_file?.name;
    this.resumeDownloadUrl = "https://workifence.s3.amazonaws.com/"+ this.bioProfile().userName + "/external_resume/" + this.resumeFileName;
    if (this.resume_file) {
      this.pdfToImageService.convertPdfToImageBytes(this.resume_file).then((e)=>{
        this.resumeToImageBytes = e
        console.log(e);
        this.isResumeGiven = true
      });
    }
  }

  convertPDFToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer: ArrayBuffer | null = reader.result as ArrayBuffer; // Get the ArrayBuffer
      if (arrayBuffer) {
        this.resumeSource = arrayBuffer
        this.isResumeGiven = true
        this.isActionInProgressNotGiven = false
        console.log('Resume ArrayBuffer', this.resumeSource);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  convertArrayBufferToBytes(arrayBuffer: ArrayBuffer): number[] {
    return Array.from(new Uint8Array(arrayBuffer));
  }

  isAllFormsValid(){
    return this.jobApplication().job_application_details.job_role && this.jobApplication().job_application_details.company_name && this.jobApplication().job_application_details.status;
  }
  

  uploadResumeToS3(){
    if(this.isAllFormsValid()){
      this.userStore.setJobApplicationFlag(false);
    if(this.resumeFileName){
      let application = this.jobApplication();
      if(this.resume_file){
        this.resumeService.postExternalResume(this.resumeFileName, this.userAccount().login +"/external_resume/"+ this.resumeFileName, this.resume_file).subscribe((e)=>{
          application.job_application_details.resume_download_link = "https://workifence.s3.amazonaws.com/" + this.userAccount().login +"/external_resume/"+ this.resumeFileName;
          this.userStore.setJobApplication(application);
          this.saveJobApplication("");
        })
      }
    }
    else if(this.selectedResumeListItem().documentUrl && !this.isResumeDeleteConfirm){
      let application = this.jobApplication();
      application.job_application_details.resume_download_link = "https://workifence.s3.amazonaws.com/" + this.selectedResumeListItem().documentUrl;
      this.userStore.setJobApplication(application);
      this.saveJobApplication("");
    }
    else{
      let application = this.jobApplication();
      application.job_application_details.resume_download_link = "";
      this.userStore.setJobApplication(application);
      this.saveJobApplication("");
    }
    }
    else{
      this.openSnackBar("Please complete all required fields in the application form.", "Close");
    }
  }

  deleteResume(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: { event: string; }) => {
      console.log(result.event);
      if(result.event == 'CONFIRM'){
        this.isResumeDeleteConfirm = true;
        this.userStore.setJobApplicationFlag(true);
        this.resumeToImageBytes = []
        this.isResumeGiven = false;
        this.resumeFileName = ""
        this.resumeDownloadUrl = ""
        this.resume_file = null
      }
    });
  }


  deleteResumeFile(){
    if(this.jobApplication().job_application_details.resume_download_link.includes("external_resume")){
      let url_split = this.jobApplication().job_application_details.resume_download_link.split("/");
      this.resumeService.deleteApplicationResume(url_split[3] + "/" + url_split[4] + "/" + url_split[5]).subscribe(()=>{})
      let application = this.jobApplication()
      application.job_application_details.resume_download_link = ''
      this.userStore.setJobApplication(application);
      this.saveJobApplication("DO_NOT_NAVIGATE");
      this.isResumeGiven =false; 
    }
    else if(this.jobApplication().job_application_details.resume_download_link.includes("wif-resume")){
      let application = this.jobApplication()
      application.job_application_details.resume_download_link = ''
      this.userStore.setJobApplication(application);
      this.saveJobApplication("DO_NOT_NAVIGATE");
      this.isResumeGiven =false; 
    }
    else if(this.resumeFileName){
      this.resumeToImageBytes = []
      this.isResumeGiven = false;
      this.resumeFileName = ""
      this.resumeDownloadUrl = ""
      this.resume_file = null
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  deleteApplication($event : any){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: { event: string; }) => {
      console.log(result.event);
      if(result.event == 'CONFIRM'){
        this.resumeService.deleteApplication(this.jobApplication().job_application_details.id).subscribe(()=>{
          let index = this.jobApplications().findIndex(obj => obj.job_application_details.id === this.jobApplication().job_application_details.id)
          this.userStore.removeJobApplication(index);
          this.router.navigateByUrl("/user/job-applications")
        })
      }
    });
  }

  deleteVendorContact(event : any){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: { event: string; }) => {
      console.log(result.event);
      if(result.event == 'CONFIRM'){
        if(this.jobApplication().vendor_details.id){
          this.resumeService.deleteVendorContact(this.jobApplication().vendor_details.id).subscribe(()=>{
            let application = this.jobApplication();
            application.vendor_details = new VendorDetails();
            this.userStore.setJobApplication(application);
            // this.router.navigateByUrl("/user/job-applications")
          })
        }
        else{
          let vendor_contact = new VendorDetails();
          this.userStore.addVendorDetails(vendor_contact);
        }
      }
    });
  }

  deleteClientContact(event : any){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: { event: string; }) => {
      console.log(result.event);
      if(result.event == 'CONFIRM'){
        if(this.jobApplication().client_details.id){
        this.resumeService.deleteClientContact(this.jobApplication().client_details.id).subscribe(()=>{
          let application = this.jobApplication();
          application.client_details = new ClientDetails();
          this.userStore.setJobApplication(application);
          // this.router.navigateByUrl("/user/job-applications")
        })
      }
      else{
        let client_contact = new ClientDetails();
        this.userStore.addClientDetails(client_contact);
      }
      }
    });
  }
}
