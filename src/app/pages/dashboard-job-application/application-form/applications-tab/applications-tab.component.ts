import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map, startWith } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { JobApplication, JobApplicationDetails, Resume, ResumeContact } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JobApplicationStatus, JobMode, JobType, ResumeAccess, ResumeCategory, ResumeRoleLevel } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { Account } from 'src/app/services/profile.model';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-applications-tab',
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
    MatCheckboxModule, MatAutocompleteModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,
    MatIconModule,MatExpansionModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './applications-tab.component.html',
  styleUrls: ['./applications-tab.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ApplicationsTabComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  jobApplication : Signal<JobApplication> = this.userStore.getSelectedJobApplication();
  userAccount: Signal<Account> = this.userStore.getUserAccount();




  visible = true;
  outLineButton = true;
  @Output() contact = new EventEmitter();

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
  ]

  jobTypes: Array<JobType> = [
    {
      id: 1,
      job_type: 'FULL_TIME',
      description: 'Full-Time',
      tags: ''
    },
    {
      id: 2,
      job_type: 'PART_TIME',
      description: 'Part-Time',
      tags: ''
    },
    {
      id: 3,
      job_type: 'CONTRACT',
      description: 'Contract',
      tags: ''
    },
    {
      id: 4,
      job_type: 'TEMPORARY',
      description: 'Temporary',
      tags: ''
    },
    {
      id: 5,
      job_type: 'INTERNSHIP',
      description: 'Internship',
      tags: ''
    },
    {
      id: 6,
      job_type: 'FREELANCE',
      description: 'Freelance',
      tags: ''
    },
    {
      id: 7,
      job_type: 'APPRENTICESHIP',
      description: 'Apprenticeship',
      tags: ''
    },
    {
      id: 8,
      job_type: 'VOLUNTEER',
      description: 'Volunteer',
      tags: ''
    },
    {
      id: 9,
      job_type: 'SEASONAL',
      description: 'Seasonal',
      tags: ''
    },
    {
      id: 10,
      job_type: 'REMOTE_WORK',
      description: 'Remote Work',
      tags: ''
    }
  ];

  jobModes: Array<JobMode> = [
    {
      id: 1,
      job_mode: 'ON_SITE',
      description: 'On-Site',
      tags: ''
    },
    {
      id: 2,
      job_mode: 'REMOTE',
      description: 'Remote',
      tags: ''
    },
    {
      id: 3,
      job_mode: 'HYBRID',
      description: 'Hybrid',
      tags: ''
    },
    {
      id: 4,
      job_mode: 'FLEXIBLE',
      description: 'Flexible',
      tags: ''
    },
    {
      id: 5,
      job_mode: 'SHIFT_WORK',
      description: 'Shift Work',
      tags: ''
    },
    {
      id: 6,
      job_mode: 'ROTATIONAL',
      description: 'Rotational',
      tags: ''
    },
    {
      id: 7,
      job_mode: 'NIGHT_SHIFTS',
      description: 'Night Shifts',
      tags: ''
    },
    {
      id: 8,
      job_mode: 'WEEKEND_ONLY',
      description: 'Weekend-Only',
      tags: ''
    }
  ];

  jobStatuses: Array<JobApplicationStatus> = [
    {
      id: 1,
      status: 'APPLIED',
      description: 'Applied',
      tags: ''
    },
    {
      id: 2,
      status: 'UNDER_REVIEW',
      description: 'Under Review',
      tags: ''
    },
    {
      id: 3,
      status: 'INTERVIEW_SCHEDULED',
      description: 'Interview Scheduled',
      tags: ''
    },
    {
      id: 4,
      status: 'INTERVIEW_COMPLETED',
      description: 'Interview Completed',
      tags: ''
    },
    {
      id: 5,
      status: 'HIRED',
      description: 'Hired',
      tags: ''
    },
    {
      id: 6,
      status: 'REJECTED',
      description: 'Rejected',
      tags: ''
    },
    {
      id: 13,
      status: 'OFFERED',
      description: 'Offered',
      tags: ''
    },
    {
      id: 7,
      status: 'OFFER_EXTENDED',
      description: 'Offer Extended',
      tags: ''
    },
    {
      id: 8,
      status: 'OFFER_ACCEPTED',
      description: 'Offer Accepted',
      tags: ''
    },
    {
      id: 9,
      status: 'OFFER_DECLINED',
      description: 'Offer Declined',
      tags: ''
    },
    {
      id: 10,
      status: 'ON_HOLD',
      description: 'On Hold',
      tags: ''
    },
    {
      id: 11,
      status: 'WITHDRAWN_BY_APPLICANT',
      description: 'Withdrawn by Applicant',
      tags: ''
    },
    {
      id: 12,
      status: 'POSITION_CLOSED',
      description: 'Position Closed',
      tags: ''
    }
  ];
  
  
  private _formBuilder: FormBuilder = inject(FormBuilder);

  

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog) {
        effect(()=>{
        //   this.setContactValues()
        })
      }

 
  subs: Array<Subscription> = [];

  applicationForm = this._formBuilder.group({
    job_role: ['', Validators.required],
    company_name: ['', Validators.required],
    location: [''], // No validation
    email_provided: [''], // No validation
    applied_date: [new Date(), []], // No validation
    job_type: [''], // No validation
    job_mode: [''], // No validation
    job_reference_url: [''], // No validation
    job_description: [''], // No validation
    status: ['', Validators.required],
  });
  

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggle() {
}

  ngOnInit() {
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/job-applications/application')) {
        // The current active route matches the desired route
        // console.log('Current route matches the desired route');
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/job-applications')){
        this.userStore.updateSidebar(false);
        // The current active route does not match the desired route
        console.log('Current route does not match the desired route');
      }
    }));
    this.setApplicationDetails();

    this.applicationForm.valueChanges.subscribe(()=>{
      this.userStore.setJobApplicationFlag(true)
    })

    this.applicationForm.controls['applied_date'].setValue(new Date());
  }



  setApplicationDetails(){
    this.applicationForm.controls['job_role'].setValue(this.jobApplication().job_application_details.job_role);
    this.applicationForm.controls['company_name'].setValue(this.jobApplication().job_application_details.company_name);
    this.applicationForm.controls['applied_date'].setValue(new Date(this.jobApplication().job_application_details.applied_date));
    this.applicationForm.controls['email_provided'].setValue(this.jobApplication().job_application_details.email_provided);
    this.applicationForm.controls['job_description'].setValue(this.jobApplication().job_application_details.job_description);
    this.applicationForm.controls['job_mode'].setValue(this.jobApplication().job_application_details.job_mode);
    this.applicationForm.controls['job_reference_url'].setValue(this.jobApplication().job_application_details.job_reference_url);
    this.applicationForm.controls['job_type'].setValue(this.jobApplication().job_application_details.job_type);
    this.applicationForm.controls['location'].setValue(this.jobApplication().job_application_details.location);
    this.applicationForm.controls['status'].setValue(this.jobApplication().job_application_details.status);
  }

  saveAndContinue(){
    this.markFormGroupTouched(this.applicationForm);
    let applicationDetails = this.jobApplication();
    var appliedDate = this.applicationForm.controls['applied_date'].value;
    if (appliedDate) {
      const formattedDate = moment(appliedDate).format('DD-MM-YYYY');
      applicationDetails.job_application_details.formatted_date = formattedDate;
    }
    applicationDetails.job_application_details.applied_date = this.applicationForm.controls['applied_date'].value?this.applicationForm.controls['applied_date'].value.toString() : '';
    applicationDetails.job_application_details.job_role = this.applicationForm.controls['job_role'].value?this.applicationForm.controls['job_role'].value : "";
    applicationDetails.job_application_details.company_name = this.applicationForm.controls['company_name'].value?this.applicationForm.controls['company_name'].value : ""
    applicationDetails.job_application_details.email_provided = this.applicationForm.controls['email_provided'].value?this.applicationForm.controls['email_provided'].value : ""
    applicationDetails.job_application_details.job_description = this.formatJobDescription(this.applicationForm.controls['job_description'].value?this.applicationForm.controls['job_description'].value : '');
    applicationDetails.job_application_details.job_mode = this.applicationForm.controls['job_mode'].value?this.applicationForm.controls['job_mode'].value : ''
    applicationDetails.job_application_details.job_reference_url = this.applicationForm.controls['job_reference_url'].value?this.applicationForm.controls['job_reference_url'].value : ''
    applicationDetails.job_application_details.job_type = this.applicationForm.controls['job_type'].value?this.applicationForm.controls['job_type'].value : ''
    applicationDetails.job_application_details.location = this.applicationForm.controls['location'].value?this.applicationForm.controls['location'].value : ''
    applicationDetails.job_application_details.status = this.applicationForm.controls['status'].value?this.applicationForm.controls['status'].value : ''
    applicationDetails.job_application_details.id = this.jobApplication().job_application_details.id?this.jobApplication().job_application_details.id : '';
    if(this.jobApplication().job_application_details.id){
      applicationDetails.job_application_details.lastModifiedDate = moment().toString();
      applicationDetails.job_application_details.createdBy = this.userAccount().id;
    }
    else{
      applicationDetails.job_application_details.createdBy = moment().toString();
      applicationDetails.job_application_details.createdBy = this.userAccount().id;
    }

    this.userStore.setJobApplication(applicationDetails);
    this.contact.emit();
  }

   // Format the text to replace newlines with <br> tags
   formatJobDescription(text: string): string {
    return text.replace(/\n/g, '<br/>');
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

  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

