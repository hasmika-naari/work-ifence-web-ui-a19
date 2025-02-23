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
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ResumeContactComponent } from './contact/contact.component';
import { ExperianceComponent } from './experiance/experiance.component';
import { CertificationComponent } from './certification/certification.component';
import { CourseWorkComponent } from './course-work/course-work.component';
import { SummaryComponent } from './summary/summary.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectComponent } from './project/project.component';
import { EducationComponent } from './education/education.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { Resume1TemplateComponent } from './template/template.component';
import { PreviewResumeComponent } from './preview-resume/preview-resume.component';
import { FooterComponent } from '../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Certification, Education, Experience, JobDescriptionAIResponse, JobResume, JobResumeRequest, Project, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { ResumeService } from 'src/app/services/resume.service';
import { ResumeTitleComponent } from './resume-title/resume-title.component';
import { ResumeTemplateListComponent } from './resume-template-list/resume-template-list.component';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Account } from 'src/app/services/profile.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { ResumeTemplateDto, UserResume } from 'src/app/services/store/user-store';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { ResumeTemplate2Component } from './template2/template2.component';
import { ResumeTemplate3Component } from './template3/template3.component';
import { ResumeTemplate4Component } from './template4/template4.component';
import { ResumeTemplate5Component } from './template5/template5.component';
import { ResumeTemplate6Component } from './template6/template6.component';
import { ResumeTemplate7Component } from './template7/template7.component';
import { ResumeTemplate8Component } from './template8/template8.component';
import { ResumeAccess } from 'src/app/services/store/resume.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiscardDialogComponent } from './discard-dialog/discard-dialog.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ResumeTemplate9Component } from './template9/template9.component';
import { ResumeTemplate10Component } from './template10/template10.component';
import { AccomplishmentsComponent } from './accomplishments/accomplishments.component';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-form3',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, PanelModule,ChipModule,
     NgOptimizedImage,FooterComponent, MatDialogModule, MatProgressBarModule,MessageModule,MessagesModule,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  
    MatStepperModule, MatFormFieldModule,InputTextModule,TableModule, MenuModule,Resume1TemplateComponent,
    MatInputModule,ButtonModule,OverlayPanelModule,ResumeContactComponent,ContextMenuComponent,
    MatButtonModule,AccordionModule,TextareaModule,CertificationComponent,CourseWorkComponent,
    EducationComponent,ProjectComponent,SkillsComponent,SummaryComponent,ProgressBarModule, MatTooltipModule,
    MatIconModule,MatExpansionModule, ExperianceComponent, ResumeTitleComponent, ResumeTemplateListComponent, ResumeTemplate2Component,ResumeTemplate3Component
  , ResumeTemplate4Component, ResumeTemplate5Component, ResumeTemplate6Component, ResumeTemplate7Component, ResumeTemplate8Component, DiscardDialogComponent, AchievementsComponent,
  JobDescriptionComponent, MatExpansionModule, ResumeTemplate9Component, ResumeTemplate10Component, AccomplishmentsComponent],
  templateUrl: './resume-form3.component.html',
  styleUrls: ['./resume-form3.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResumeForm3Component implements OnInit, OnDestroy, AfterViewChecked, OnChanges, AfterViewInit {

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
  private _snackBar = inject(MatSnackBar);
  isExpanded = false; // Controls the expandable/collapsible section
  isFormPanleClosed : boolean = true;

  isLeftColumnVisible = false; 

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
  private _formBuilder: FormBuilder =  inject(FormBuilder);

  userAccount: Signal<Account> = this.userStore.getUserAccount();
  selectedResume : Signal<UserResume> = this.userStore.getSelectedResume();
  selectedResumeListItem : Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  isChangeInNewResume : Signal<boolean> = this.userStore.getIsChangeInNewResume();
  jobDescAIRes : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  resumeDataItemList: Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();

  visible = true;
  outLineButton = true;

  browser = false;

  hidePanelWindow = true;
  showPanelWindow = false;
  formLabel = 'Contact';
  isActionInProgress =  false;
  loadingMenu = true;
  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      @Inject(DOCUMENT) private document: Document,
      public zone: NgZone,
      public promptService : PromptService, 
      public appUtilService: AppUtilService,
      private el: ElementRef,
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog,
      public resumeService : ResumeService,
      public pdfToImageService : PdfToImageService) {}

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


  showContactDetailsWindow = false;
  showWorkExperianceDetailsWindow = false;
  showJobDescriptionWindow = false;
  showResumeTitleWindow = false;
  showResumeTemplateList = false;
  showProjectWorkDetailsWindow = false;
  showEducationDetailsWindow = false;
  showCertificationsDetailsWindow =  false;
  showAchievementsDetailsWindow = false;
  showOtherDetailsWindow = false;
  showCourseWorkDetailsWindow = false;
  showSkillsDetailsWindow =  false;
  showSummaryDetailsWindow = false;
  showAccomplishmentsWindow = false;
  isMenuVisible: boolean = false;
  selectedTemplateName : String = "TEMPLATE_2"
  isDisabled : boolean = false

  // showContactBind = this.showContactDetails.bind(this);
  closeOptions = 
    [{
        label: 'Back To Resumes',
        icon: 'pi pi-times',
        command: ($event: any) => {
            this.goback($event);
        }
    },
  ];

  options = 
    [
      {
        label: 'JOB DESCRIPTION',
        icon: 'pi pi-check-circle',
        command: ($event: any) => {
            this.showJobDescription();
        }
      }
      ,
      {
        label: "TEMPLATE'S",
        icon: 'pi pi-file-o show-green',
        command: ($event: any) => {
            this.showResumeTemplates();
        }
    },
    {
        label: 'SAVE',
        icon: 'pi pi-save',
        command: ($event: any) => {
            this.saveResume();
        }
    },
    {
      label: 'SAVE & DOWNLOAD',
      icon: 'pi pi-download',
      command: () => {
          this.saveAndDownload();
      }
    }
    ];

  items = [{
    items: [
      {
        label: 'TITLE',
        icon: 'pi pi-check-circle',
        command: ($event: any) => {
            this.showResumeTitle();
        }
    },{
        label: 'CONTACT',
        icon: 'pi pi-check-circle',
        command: ($event: any) => {
            this.showContact();
        }
    },
    {
        label: 'EXPERIENCE',
        icon: 'pi pi-check-circle',
        command: () => {
            this.showWorkExperianceDetails();
        }
    },
    {
      label: 'PROJECT',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showProjectWorkDetails();
      }
    },
    {
      label: 'EDUCATION',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showEducationDetails();
      }
    },
    {
      label: 'CERTIFICATIONS',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showCertificationsDetails();
      }
    },
    {
      label: 'COURSE WORK',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showCourseWorkDetails();
      }
    },
    {
      label: 'SKILLS',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showSkillsDetails();
      }
    },
    {
      label: 'ACHIEVEMENTS',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showAchievementsDetails();
      }
    },
    {
      label: 'SUMMARY',
      icon: 'pi pi-check-circle',
      command: () => {
          this.showSummaryDetails();
      }
    },
    // {
    //   label: 'FINISH UP',
    //   icon: 'pi pi-check-circle',
    //   command: () => {
    //       this.previewResume();
    //   }
    // }
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
  this.showResumeTitle();
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
      // this.attachEventHandlers();
      setTimeout(() => {
        // //this.sidenavService.setCollapsed(true);
        // this.sidenavService.setExpanded(false);
        }, 500);
    
    }
  }

  // attachEventHandlers() {
  // const editContactElement = document.getElementById('editContact');
  //   if (editContactElement) {
  //    editContactElement.addEventListener('click', this.showContactDetails.bind(this));
  //   }
  // }
 

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
    //   editContactElement.addEventListener('click', this.showContact);
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
    this.isFormPanleClosed = true;
    this.hidePanelWindow = true;
    this.userStore.setProject(new Project());
    this.userStore.setCertification(new Certification());
    this.userStore.setEducation(new Education());
    this.userStore.setExperience(new Experience());
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

  getImageBase64(){
    return "data:image/png;base64, " + this.imageBase64;
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
      this.showResumeTitle()
    }
    if($event.section === "CONTACT"){
      console.log("**************** showEditSection ******************");
      this.showContact()
    }
    else if($event.section === "SUMMARY"){
      this.showSummaryDetails()
    }
    else if($event.section === "EDUCATION"){
      this.showEducationDetails()
    }
    else if($event.section === "COURSEWORK"){
      this.showCourseWorkDetails()
    }
    else if($event.section === "SKILLS"){
      this.showSkillsDetails()
    }
    else if($event.section === "PROJECT"){
      this.showProjectWorkDetails()
    }
    else if($event.section === "EXPERIENCE"){
      this.showWorkExperianceDetails()
    }
    else if($event.section === "CERTIFICATION"){
      this.showCertificationsDetails()
    }
    else if($event.section == "ACHIEVEMENTS"){
      this.showAchievementsDetails()
    }
    else if($event.section == "OTHER"){
      this.showSectionDetails('OTHER')
    }
    else if($event.section == "ACCOMPLISHMENT"){
      this.showAccomplishmentsDetails()
    }
  }

  showResumeTemplates(){
    this.formLabel = 'Pick a Template';
    this.hidePanelWindow = false;
    this.showResumeTemplateList = true;
    this.showJobDescriptionWindow = false;
    this.showResumeTitleWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }

  showJobDescription(){
    this.formLabel = 'Job Description';
    this.hidePanelWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = true;
    this.showResumeTitleWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }

  showResumeTitle(){
    this.formLabel = 'Meta Data';
    this.hidePanelWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showResumeTitleWindow = true;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }

  showWorkExperianceDetails(){
    this.formLabel = 'Experiance';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showJobDescriptionWindow = false;
    this.showResumeTemplateList = false;
    this.showWorkExperianceDetailsWindow = true;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.isFormPanleClosed = false;
    this.showAccomplishmentsWindow = false;
  }
  

  showContact(){
    this.formLabel = 'Contact';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = true;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }

  showProjectWorkDetails(){
    this.formLabel = 'Project';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = true;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.isFormPanleClosed = false;
    this.showAccomplishmentsWindow = false;
  }
  showEducationDetails(){
    this.formLabel = 'Education';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = true;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }
  showCertificationsDetails(){
    this.formLabel = 'Certification';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  true;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }

  showAchievementsDetails(){
    this.formLabel = 'Achievements';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= true;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = false;
  }

  showAccomplishmentsDetails(){
    this.formLabel = 'Accomplishments';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showOtherDetailsWindow = false;
    this.showAccomplishmentsWindow = true;
  }

  showSectionDetails(section : string){
    if(section == 'OTHER'){
      this.formLabel = 'Certifications';
      this.hidePanelWindow = false;
      this.showResumeTitleWindow = false;
      this.showResumeTemplateList = false;
      this.showJobDescriptionWindow = false;
      this.showWorkExperianceDetailsWindow = false;
      this.showContactDetailsWindow = false;
      this.showProjectWorkDetailsWindow = false;
      this.showEducationDetailsWindow = false;
      this.showCertificationsDetailsWindow =  false;
      this.showCourseWorkDetailsWindow = false;
      this.showSkillsDetailsWindow =  false;
      this.showSummaryDetailsWindow = false;
      this.showAchievementsDetailsWindow= false;
      this.showOtherDetailsWindow = true;
      this.showAccomplishmentsWindow = false;
    }
  }
  
  showCourseWorkDetails(){
    this.formLabel = 'Course Work';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = true;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showAccomplishmentsWindow = false;
    this.courseWorkCount = this.courseWorkCount + 1;


  }
  showSkillsDetails(){
    this.formLabel = 'Skill Details';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  true;
    this.showSummaryDetailsWindow = false;
    this.showAchievementsDetailsWindow= false;
    this.showAccomplishmentsWindow = false;
    this.skillCount = this.skillCount + 1;
  }

  showSummaryDetails(){
    this.formLabel = 'Summary';
    this.hidePanelWindow = false;
    this.showResumeTitleWindow = false;
    this.showResumeTemplateList = false;
    this.showJobDescriptionWindow = false;
    this.showWorkExperianceDetailsWindow = false;
    this.showContactDetailsWindow = false;
    this.showProjectWorkDetailsWindow = false;
    this.showEducationDetailsWindow = false;
    this.showCertificationsDetailsWindow =  false;
    this.showCourseWorkDetailsWindow = false;
    this.showSkillsDetailsWindow =  false;
    this.showSummaryDetailsWindow = true;
    this.showAchievementsDetailsWindow= false;
    this.isFormPanleClosed = false;
    this.showAccomplishmentsWindow = false;
  }

  goback($event: any){
    if(this.isChangeInNewResume()){
      this.confirmDiscardAction();
    }
    else{
      this.userStore.updateSidebar(false);
      this.userStore.setIsChangeInNewResume(false);
      this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
      this.router.navigateByUrl('/user/resumes');
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

  isResumeValid(){
    return this.selectedResume().resumeForm.title && this.selectedResume().resumeForm.role_category && this.selectedResume().resumeForm.resume_category
    && this.selectedResume().resumeForm.access_level;
  }


  saveResume(){
    if(this.isResumeValid()){
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
      this.custom_fileName = this.resumeSignalForm().title.replace(/\s+/g, "") +  this.appUtilService.generateUniqueString() + '.pdf';
      request.old_documentUrl =this.selectedResumeListItem().documentUrl;
      request.current_documentUrl = this.userAccount().login + "/wif-resume/" +  this.custom_fileName
      request.resumeJson = JSON.stringify(this.resumeSignalForm());
      request.status = this.resumeSignalForm().isActive?"ACTIVE":"IN_ACTIVE";
      request.isPrimary = this.resumeSignalForm().isPrimary;
      request.lastUpdatedDate = Date.now().toString();
      request.lastUsedFor = "";
      request.templateId = this.resumeSignalForm().template_details.id.toString();
      request.ownerId = this.userAccount().id;
      request.old_filename = this.selectedResumeListItem().fileName;
      request.current_filename = this.custom_fileName;
      request.htmlcontent = this.templateService.getFormatedResumeHTMLText(this.resumeSignalForm().template_details.template_name, this.getUnHideElements())
      request.username = this.userAccount().login;
  
      if(!this.selectedResumeListItem().id){
          request.createdDate = Date.now().toString();
        this.resumeService.saveResume(request).subscribe((e : ResumeListDataItem) => {
          this.isActionInProgress = false;
          this.isDisabled = false;
          const element = document.getElementById("actions-disable");
          if(element != null){
            element.style.zIndex = "-1000";
            element.style.display = "none";
          }
          this.userStore.setIsChangeInNewResume(false);
          this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + e.documentUrl).then((bytes)=>{
            e.imageBytes = bytes;
            this.userStore.addResumeDataListItem(e);
            this.userStore.setFilteredResumes([...this.resumeDataItemList()])
          })
          this.router.navigateByUrl('/user/resumes');
        });
      }else{
        request.id = this.selectedResumeListItem().id;
        request.createdDate = this.selectedResumeListItem().createdDate;
        this.resumeService.updateResume(request).subscribe((e : ResumeListDataItem) => {
          
          this.isActionInProgress = false;
          this.isDisabled = false;
          const element = document.getElementById("actions-disable");
          if(element != null){
            element.style.zIndex = "-1000";
            element.style.display = "none";
          }
          this.userStore.setIsChangeInNewResume(false);
          this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + e.documentUrl).then((bytes)=>{
            e.imageBytes = bytes;
            let index = this.resumeDataItemList().findIndex(obj => obj.id === e.id);
            this.userStore.updateResumeDataListItem(e, index);
            this.userStore.setFilteredResumes([...this.resumeDataItemList()])
          })
          this.router.navigateByUrl('/user/resumes');
        });
      }
    }
    else{
      this.openSnackBar("Please complete all required fields in the Meta Data form.", "Close");
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getUnHideElements(){
    let resume = this.resumeSignalForm();
    if(this.resumeSignalForm()?.certification){
    resume.certification = this.resumeSignalForm().certification.filter(e=>e.isHideSelected == false)
    }
    if(this.resumeSignalForm()?.education){
    resume.education = this.resumeSignalForm().education.filter(e=>e.isHideSelected == false)
    }
    if(this.resumeSignalForm()?.experience){
    resume.experience = this.resumeSignalForm().experience.filter(e=>e.isHideSelected == false)
    }
    if(this.resumeSignalForm()?.project){
    resume.project = this.resumeSignalForm().project.filter(e=>e.isHideSelected == false)
    }
    if(this.resumeSignalForm()?.accomplishment){
    resume.accomplishment=this.resumeSignalForm().accomplishment.filter(e=>e.isHideSelected == false);
    }
    return resume;

  }


  saveAndDownload(){
    if(this.isResumeValid()){
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
    this.custom_fileName = this.resumeSignalForm().title.replace(/\s+/g, "")+ this.appUtilService.generateUniqueString() + '.pdf';
    request.old_documentUrl =this.selectedResumeListItem().documentUrl;
    request.current_documentUrl = this.userAccount().login + "/wif-resume/" +  this.custom_fileName
    request.resumeJson = JSON.stringify(this.resumeSignalForm());
    request.status = this.resumeSignalForm().isActive?"ACTIVE":"IN_ACTIVE";
    request.isPrimary = this.resumeSignalForm().isPrimary;
    request.lastUpdatedDate = Date.now().toString();
    request.lastUsedFor = "";
    request.templateId = this.resumeSignalForm().template_details.id.toString();
    request.ownerId = this.userAccount().id;
    request.old_filename = this.selectedResumeListItem().fileName;
    request.current_filename = this.custom_fileName;
    request.htmlcontent = this.templateService.getFormatedResumeHTMLText(this.resumeSignalForm().template_details.template_name, this.getUnHideElements());
    request.username = this.userAccount().login;
    console.log(request.htmlcontent);
    if(!this.selectedResumeListItem().id){
      request.createdDate = Date.now().toString();
    }else{
    request.id = this.selectedResumeListItem().id;
    request.createdDate = this.selectedResumeListItem().createdDate;
    }
    this.resumeService.saveAndDownloadResume(request).subscribe((response : any)=>{
          const fileContent = response.file; // byte array
          const resume_response = response.metadata; // JSON object

          const byteCharacters = atob(fileContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          var blob = new Blob([byteArray], { type: 'application/pdf' });

          // Create a data URL from the Blob
          var dataUrl = URL.createObjectURL(blob);

          // Create a link element
          var link = document.createElement('a');

          // Set the href attribute with the data URL
          link.href = dataUrl;

          // Set the download attribute with the desired file name
          link.download =  this.custom_fileName;

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
          if(this.selectedResumeListItem().id){
            this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + resume_response.documentUrl).then((bytes)=>{
              resume_response.imageBytes = bytes;
              let index = this.resumeDataItemList().findIndex(obj => obj.id === resume_response.id);
              this.userStore.updateResumeDataListItem(resume_response, index);
              this.userStore.setFilteredResumes([...this.resumeDataItemList()])
            })
          }
          else{
            this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + resume_response.documentUrl).then((bytes)=>{
              resume_response.imageBytes = bytes;
              this.userStore.addResumeDataListItem(resume_response);
              this.userStore.setFilteredResumes([...this.resumeDataItemList()])
            })
          }
          this.router.navigateByUrl('/user/resumes');
      })
    }
      else{
        this.openSnackBar("Please complete all required fields in the Meta Data form.", "Close");
      }


  }

  confirmDiscardAction(): void {
    const dialogRef = this.dialog.open(DiscardDialogComponent, {
      data: {name: 'confirm'},
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === "SAVE"){
        if(this.isResumeValid()){
          this.saveResume()
          this.userStore.updateSidebar(false);
          this.userStore.setIsChangeInNewResume(false);
          this.router.navigateByUrl('/user/resumes');
        }
        else{
          this.openSnackBar("Please complete all required fields in the Meta Data form.", "Close");
        }
      }
      else{
        this.userStore.updateSidebar(false);
        this.userStore.setIsChangeInNewResume(false);
        this.router.navigateByUrl('/user/resumes');
      }
    });
  }

  // Toggle Section Visibility
  toggleMetadataSection(): void {
    this.isExpanded = !this.isExpanded;
  }
}
