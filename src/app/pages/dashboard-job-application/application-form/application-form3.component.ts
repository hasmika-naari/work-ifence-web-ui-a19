import { CommonModule, DOCUMENT, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, Signal, SimpleChanges, inject, signal } from '@angular/core';
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
import { AccordionModule, AccordionTab } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { Certification, ClientDetails, Education, Experience, JobApplication, JobDescriptionAIResponse, 
      JobResume, JobResumeRequest, Project, Resume, RoundDetails, TemplateVariables, 
      VendorDetails} from 'src/app/services/resume.model';
import { JobApplicationRequest, JobInterviewRounds, ResumeListDataItem } from 'src/app/services/work-ifence-data.model';

import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { ResumeService } from 'src/app/services/resume.service';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Account, BioProfile } from 'src/app/services/profile.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { ResumeTemplateDto, UserResume } from 'src/app/services/store/user-store';
import { ResumeAccess } from 'src/app/services/store/resume.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PanelModule } from 'primeng/panel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { DiscardDialogComponent } from '../../resume-form3/discard-dialog/discard-dialog.component';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { ConfirmDialogComponent } from '../../resume-form3/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
import { ResumeListDialogComponent } from './resume-list-dialog/resume-list-dialog.component';
import { ApplicationsTabComponent } from './applications-tab/applications-tab.component';
import { ClientComponent } from './client/client.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { VendorComponent } from './vendor/vendor.component';
import { RoundsComponent } from './rounds/rounds.component';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-application-form3',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, PanelModule,
     NgOptimizedImage, MatDialogModule, MatProgressBarModule,MessageModule,MessagesModule,
    CarouselModule,ReactiveFormsModule, FormsModule,   
    MatStepperModule, MatFormFieldModule,InputTextModule,TableModule, MenuModule, 
    MatInputModule,ButtonModule,OverlayPanelModule, MatButtonModule,AccordionModule,
    ProgressBarModule, MatTooltipModule, MatIconModule,MatExpansionModule,  MatExpansionModule,
    ApplicationsTabComponent, ClientComponent, FeedbackComponent, VendorComponent, RoundsComponent ],
  templateUrl: './application-form3.component.html',
  styleUrls: ['./application-form3.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApplicationForm3Component implements OnInit, OnDestroy, AfterViewChecked, OnChanges, AfterViewInit {

  readonly panelOpenState = signal(false);
  resumeForm!: FormGroup;
  contactForm! : FormGroup
  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  showProfileImage : boolean = false
  eduForm!: FormGroup;
  workForm! : FormGroup;
  userProjectForm! : FormGroup
  certificationForm! : FormGroup
  listed_skills : Array<String> = ['Java', 'Python','Angular', 'NodeJS', 'ReactJS']
  listed_coursework : Array<String> = ['Data Structures and Algorithms','Object-Oriented Programming','Database Management Systems','Computer Networks','Operating Systems','Software Engineering','Artificial Intelligence','Web Development', 'Data Structures']
  skillCount : number = 0
  custom_fileName : string = ''
  isExpanded = false; // Controls the expandable/collapsible section
  isFormPanleClosed : boolean = true;

  isLeftColumnVisible = false; 

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

  isResumeDeleteConfirm : boolean = false;
  resume_file : File | null = null;
  resumeFileName : string | undefined= '';
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  resumeDownloadUrl : string = '';
  resumeToImageBytes : string[] = [];
  isResumeGiven : boolean = false;
  resumeSource : any;

  isActionInProgressNotGiven : boolean = false
  isActionInProgressGiven : boolean = false

  visible = true;
  outLineButton = true;

  browser = false;

  hidePanelWindow = true;
  showPanelWindow = false;
  formLabel = 'Contact';
  isActionInProgress =  false;
  loadingMenu = true;
  isResumeTabSelected : boolean = false
  activeIndex = null;
  isAccordionOpened = false;

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

  private _formBuilder: FormBuilder = inject(FormBuilder);

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      @Inject(DOCUMENT) private document: Document,
      private routeActivated: ActivatedRoute,
      public zone: NgZone,
      public promptService : PromptService, 
      public appUtilService: AppUtilService,
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

  closeOptions = 
    [
      {
        label: 'Back To Applications',
        icon: 'pi pi-times',
        command: ($event: any) => {
            this.goback($event);
        }
      }
  ];

  // options = 
  //   [
  //     {
  //       label: 'JOB DESCRIPTION',
  //       icon: 'pi pi-check-circle',
  //       command: ($event: any) => {
  //           this.showJobDescription();
  //       }
  //     }
  //     ,
  //     {
  //       label: "TEMPLATE'S",
  //       icon: 'pi pi-file-o show-green',
  //       command: ($event: any) => {
  //           this.showResumeTemplates();
  //       }
  //   },
  //   {
  //       label: 'SAVE',
  //       icon: 'pi pi-save',
  //       command: ($event: any) => {
  //           this.saveResume();
  //       }
  //   },
  //   {
  //     label: 'SAVE & DOWNLOAD',
  //     icon: 'pi pi-download',
  //     command: () => {
  //         this.saveAndDownload();
  //     }
  //   }
  //   ];

  // items = [{
  //   items: [
  //     {
  //       label: 'TITLE',
  //       icon: 'pi pi-check-circle',
  //       command: ($event: any) => {
  //           this.showResumeTitle();
  //       }
  //   },{
  //       label: 'CONTACT',
  //       icon: 'pi pi-check-circle',
  //       command: ($event: any) => {
  //           this.showContact();
  //       }
  //   },
  //   {
  //       label: 'EXPERIENCE',
  //       icon: 'pi pi-check-circle',
  //       command: () => {
  //           this.showWorkExperianceDetails();
  //       }
  //   },
  //   {
  //     label: 'PROJECT',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showProjectWorkDetails();
  //     }
  //   },
  //   {
  //     label: 'EDUCATION',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showEducationDetails();
  //     }
  //   },
  //   {
  //     label: 'CERTIFICATIONS',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showCertificationsDetails();
  //     }
  //   },
  //   {
  //     label: 'COURSE WORK',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showCourseWorkDetails();
  //     }
  //   },
  //   {
  //     label: 'SKILLS',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showSkillsDetails();
  //     }
  //   },
  //   {
  //     label: 'ACHIEVEMENTS',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showAchievementsDetails();
  //     }
  //   },
  //   {
  //     label: 'SUMMARY',
  //     icon: 'pi pi-check-circle',
  //     command: () => {
  //         this.showSummaryDetails();
  //     }
  //   },
  //   // {
  //   //   label: 'FINISH UP',
  //   //   icon: 'pi pi-check-circle',
  //   //   command: () => {
  //   //       this.previewResume();
  //   //   }
  //   // }
  //   ]}
  // ];




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
        this.subs.push(this.router.events.subscribe(() => {
        }));
    }
  }

  ngAfterViewChecked(): void {
    if(this.browser){
      // this.attachEventHandlers();
      setTimeout(() => {
        // //this.sidenavService.setCollapsed(true);
        // this.sidenavService.setExpanded(false);
        }, 500);
    
    }
  }

  closePanelWindow($event: any){
    this.isFormPanleClosed = true;
    this.hidePanelWindow = true;
  }

    openResumeDialog() {
      const dialogRef = this.dialog.open(ResumeListDialogComponent, {
        width: '800px',
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

  
  toggleDescription(): void {
    this.isExpanded = !this.isExpanded;
  }

  isExpandedNote : boolean = false;

  toggleNote():void{
    this.isExpandedNote = !this.isExpandedNote;
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

    editRound(round : RoundDetails){
      this.userStore.setRoundDetails(round);
      this.showRounds();
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

      deleteVendorContact(event : any){
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '250px',
        });
      
        dialogRef.afterClosed().subscribe((result: { event: string; }) => {
          console.log(result.event);
          if(result.event == 'CONFIRM'){
            this.resumeService.deleteVendorContact(this.jobApplication().vendor_details.id).subscribe(()=>{
              let application = this.jobApplication();
              application.vendor_details = new VendorDetails();
              this.userStore.setJobApplication(application);
              // this.router.navigateByUrl("/user/job-applications")
            })
          }
        });
      }

      onAccordionToggle(isOpened: boolean): void {
        this.isAccordionOpened = isOpened;
      }
      showResumeTab(){
        this.isResumeTabSelected = true;
      }

      viewApplication(){
        this.isResumeTabSelected = false
      }

      deleteClientContact(event : any){
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '250px',
        });
      
        dialogRef.afterClosed().subscribe((result: { event: string; }) => {
          console.log(result.event);
          if(result.event == 'CONFIRM'){
            this.resumeService.deleteClientContact(this.jobApplication().client_details.id).subscribe(()=>{
              let application = this.jobApplication();
              application.client_details = new ClientDetails();
              this.userStore.setJobApplication(application);
              // this.router.navigateByUrl("/user/job-applications")
            })
          }
        });
      }

      saveContact(){
   
       this.getTemplate();
       this.hidePanelWindow = true;
       
     }
  
     getTemplate(){
      // this.default_template = this.templateService.getDefaultResumeTemplate();
      // const element = this.document.getElementById("display-resume-div");
      // if(element){
      //   element.innerHTML = this.default_template;
      // }
    
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  toggleMetadataSection(): void {
    this.isExpanded = !this.isExpanded;
  }

  downloadResume(){
    this.isActionInProgress = true;
    let fileName = this.jobApplication().job_application_details.resume_download_link.split("/")[5];
    if(this.jobApplication().job_application_details.resume_download_link.includes("wif-resume")){
      this.subs.push(this.resumeService.dowloadResumePDF(this.userAccount().login , fileName).subscribe((res : any)=>{
        var blob = new Blob([res], { type: 'application/pdf' });
  
        // Create a data URL from the Blob
        var dataUrl = URL.createObjectURL(blob);
  
        // Create a link element
        var link = document.createElement('a');
  
        // Set the href attribute with the data URL
        link.href = dataUrl;
  
        // Set the download attribute with the desired file name
        link.download = this.selectedResumeListItem().fileName;
  
        // Append the link to the document
        document.body.appendChild(link);
  
        // Trigger a click event on the link to initiate the download
        link.click();
  
        // Remove the link from the document
        document.body.removeChild(link);
        this.isActionInProgress = false;
    }))
    }
    else if(this.jobApplication().job_application_details.resume_download_link.includes("external_resume")){
      this.subs.push(this.resumeService.downloadExternalResume(this.userAccount().login , fileName).subscribe((res : any)=>{
        var blob = new Blob([res], { type: 'application/pdf' });
  
        // Create a data URL from the Blob
        var dataUrl = URL.createObjectURL(blob);
  
        // Create a link element
        var link = document.createElement('a');
  
        // Set the href attribute with the data URL
        link.href = dataUrl;
  
        // Set the download attribute with the desired file name
        link.download = this.selectedResumeListItem().fileName;
  
        // Append the link to the document
        document.body.appendChild(link);
  
        // Trigger a click event on the link to initiate the download
        link.click();
  
        // Remove the link from the document
        document.body.removeChild(link);
        this.isActionInProgress = false;
    }))
    }
  }
}
