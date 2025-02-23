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
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map, startWith } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { JobApplication, JobApplicationDetails, Resume, ResumeContact, RoundDetails } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ResumeAccess, ResumeCategory, ResumeRoleLevel, RoundMode, RoundStatus, RoundType } from 'src/app/services/store/resume.model';
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
  selector: 'app-rounds-tab',
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
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class RoundsComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  jobApplication : Signal<JobApplication> = this.userStore.getSelectedJobApplication();
  roundDetails : Signal<RoundDetails> = this.userStore.getSelectedRoundDetails();
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

  roundTypes: Array<RoundType> = [
    {
      id: 1,
      round_type: 'CODING_ROUND',
      description: 'Coding Round',
      tags: ''
    },
    {
      id: 2,
      round_type: 'APTITUDE_ROUND',
      description: 'Aptitude Round',
      tags: ''
    },
    {
      id: 3,
      round_type: 'TECHNICAL_ROUND',
      description: 'Technical Round',
      tags: ''
    },
    {
      id: 4,
      round_type: 'MANAGERIAL_ROUND',
      description: 'Managerial Round',
      tags: ''
    },
    {
      id: 5,
      round_type: 'HR_ROUND',
      description: 'HR Round',
      tags: ''
    },
    {
      id: 6,
      round_type: 'GROUP_DISCUSSION',
      description: 'Group Discussion',
      tags: ''
    },
    {
      id: 7,
      round_type: 'CASE_STUDY',
      description: 'Case Study',
      tags: ''
    },
    {
      id: 8,
      round_type: 'PRESENTATION',
      description: 'Presentation',
      tags: ''
    },
    {
      id: 9,
      round_type: 'DESIGN_ROUND',
      description: 'Design Round',
      tags: ''
    },
    {
      id: 10,
      round_type: 'SYSTEM_DESIGN_ROUND',
      description: 'System Design Round',
      tags: ''
    },
    {
      id: 11,
      round_type: 'BEHAVIORAL_ROUND',
      description: 'Behavioral Round',
      tags: ''
    },
    {
      id: 12,
      round_type: 'PRODUCT_MANAGEMENT_ROUND',
      description: 'Product Management Round',
      tags: ''
    },
    {
      id: 13,
      round_type: 'EXECUTIVE_ROUND',
      description: 'Executive Round',
      tags: ''
    },
    {
      id: 14,
      round_type: 'CULTURAL_FIT_ROUND',
      description: 'Cultural Fit Round',
      tags: ''
    },
    {
      id: 15,
      round_type: 'PEER_INTERVIEW',
      description: 'Peer Interview',
      tags: ''
    },
    {
      id: 16,
      round_type: 'DOMAIN_KNOWLEDGE_ROUND',
      description: 'Domain Knowledge Round',
      tags: ''
    },
    {
      id: 17,
      round_type: 'STRESS_INTERVIEW',
      description: 'Stress Interview',
      tags: ''
    }
  ];

  
  roundModes: Array<RoundMode> = [
    {
      id: 1,
      round_mode: 'ONLINE',
      description: 'Online',
      tags: ''
    },
    {
      id: 2,
      round_mode: 'OFFLINE',
      description: 'Offline',
      tags: ''
    },
    {
      id: 3,
      round_mode: 'HYBRID',
      description: 'Hybrid',
      tags: ''
    },
    {
      id: 4,
      round_mode: 'TELEPHONIC',
      description: 'Telephonic',
      tags: ''
    },
    {
      id: 5,
      round_mode: 'VIDEO_CALL',
      description: 'Video Call',
      tags: ''
    }
  ];

  roundStatuses: Array<RoundStatus> = [
    {
      id: 1,
      status: 'SCHEDULED',
      description: 'Scheduled',
      tags: ''
    },
    {
      id: 2,
      status: 'IN_PROGRESS',
      description: 'In Progress',
      tags: ''
    },
    {
      id: 3,
      status: 'COMPLETED',
      description: 'Completed',
      tags: ''
    },
    {
      id: 4,
      status: 'PASSED',
      description: 'Passed',
      tags: ''
    },
    {
      id: 5,
      status: 'FAILED',
      description: 'Failed',
      tags: ''
    },
    {
      id: 6,
      status: 'RESCHEDULED',
      description: 'Rescheduled',
      tags: ''
    },
    {
      id: 7,
      status: 'CANCELLED',
      description: 'Cancelled',
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
          this.setRoundDetails()
        })
      }

 
  subs: Array<Subscription> = [];

  roundForm = this._formBuilder.group({
    round_type: [''],
    round_date: [new Date(), []],
    status : [''],
    mode : [''],
    time : [''],
    meet_link: [''],
    notes: ['']
  })

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

    this.roundForm.valueChanges.subscribe(()=>{
      this.userStore.setJobApplicationFlag(true)
    })

    this.roundForm.controls['round_date'].setValue(new Date());
  }



  setRoundDetails(){ 
    this.roundForm.controls['round_type'].setValue(this.roundDetails().type);
    this.roundForm.controls['round_date'].setValue(new Date(this.roundDetails().date));
    this.roundForm.controls['meet_link'].setValue(this.roundDetails().meet_link);
    this.roundForm.controls['mode'].setValue(this.roundDetails().mode);
    this.roundForm.controls['notes'].setValue(this.roundDetails().notes);
    this.roundForm.controls['status'].setValue(this.roundDetails().status);
    this.roundForm.controls['time'].setValue(this.roundDetails().time);
  }

  saveAndContinue(){
    this.markFormGroupTouched(this.roundForm);
    let roundDetails : RoundDetails= new RoundDetails();
    var roundDate = this.roundForm.controls['round_date'].value;
    if (roundDate) {
      const formattedDate = moment(roundDate).format('DD-MM-YYYY');
      roundDetails.formatted_date = formattedDate;
    }
    roundDetails.type = this.roundForm.controls['round_type'].value?this.roundForm.controls['round_type'].value : "";
    roundDetails.meet_link = this.roundForm.controls['meet_link'].value?this.roundForm.controls['meet_link'].value.toString() : ''
    roundDetails.mode = this.roundForm.controls['mode'].value?this.roundForm.controls['mode'].value : ""
    roundDetails.notes = this.roundForm.controls['notes'].value?this.roundForm.controls['notes'].value : ''
    roundDetails.status = this.roundForm.controls['status'].value?this.roundForm.controls['status'].value : ''
    roundDetails.time = this.roundForm.controls['time'].value?this.roundForm.controls['time'].value : ''
    roundDetails.date = this.roundForm.controls['round_date'].value?this.roundForm.controls['round_date'].value.toString() : "";

    if(this.roundDetails().id){
      roundDetails.isNew = false
      roundDetails.unqId = ''
      roundDetails.id = this.roundDetails().id;
      roundDetails.lastModifiedDate = moment().toString();
      roundDetails.createdBy = this.userAccount().id;
      let index = this.jobApplication().round_details.findIndex(obj => obj.id === this.roundDetails().id)
      this.userStore.editRoundDetailsById(roundDetails, index);
    }
    else{
      if(this.roundDetails().unqId){
        roundDetails.isNew = true
        roundDetails.unqId = this.roundDetails().unqId
        roundDetails.id = '';
        roundDetails.createdBy = moment().toString();
        roundDetails.createdBy = this.userAccount().id;
        let index = this.jobApplication().round_details.findIndex(obj => obj.unqId === this.roundDetails().unqId)
        this.userStore.editRoundDetailsByUnqId(roundDetails, index);
      }
      else{
        roundDetails.isNew = true
        roundDetails.unqId = "ID_" + moment().toString();
        roundDetails.id = '';
        roundDetails.createdBy = moment().toString();
        roundDetails.createdBy = this.userAccount().id;
        this.userStore.addRoundDetails(roundDetails);
      }
    }

    this.roundForm.reset()
    this.userStore.setRoundDetails(new RoundDetails());
    this.contact.emit();
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



