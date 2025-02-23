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
import { JobApplication, JobApplicationDetails, Resume, ResumeContact } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ResumeAccess, ResumeCategory, ResumeRoleLevel } from 'src/app/services/store/resume.model';
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
  selector: 'app-vendor-tab',
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
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class VendorComponent implements OnInit, OnDestroy {

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

  vendorForm = this._formBuilder.group({
    first_name: [''],
    last_name: [''],
    email: [''],
    phone_number : [''],
    company_name: [''],
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
    this.setVendorDetails();

    this.vendorForm.valueChanges.subscribe(()=>{
      this.userStore.setJobApplicationFlag(true)
    })
  }



  setVendorDetails(){
    this.vendorForm.controls['first_name'].setValue(this.jobApplication().vendor_details.first_name);
    this.vendorForm.controls['last_name'].setValue(this.jobApplication().vendor_details.last_name);
    this.vendorForm.controls['email'].setValue(this.jobApplication().vendor_details.email);
    this.vendorForm.controls['phone_number'].setValue(this.jobApplication().vendor_details.phone_number);
    this.vendorForm.controls['company_name'].setValue(this.jobApplication().vendor_details.company_name);
  }

  saveAndContinue(){
    this.markFormGroupTouched(this.vendorForm);
    let applicationDetails = this.jobApplication();
    applicationDetails.vendor_details.first_name = this.vendorForm.controls['first_name'].value?this.vendorForm.controls['first_name'].value : "";
    applicationDetails.vendor_details.last_name = this.vendorForm.controls['last_name'].value?this.vendorForm.controls['last_name'].value : ""
    applicationDetails.vendor_details.email = this.vendorForm.controls['email'].value?this.vendorForm.controls['email'].value.toString() : ''
    applicationDetails.vendor_details.phone_number = this.vendorForm.controls['phone_number'].value?this.vendorForm.controls['phone_number'].value : ""
    applicationDetails.vendor_details.company_name = this.vendorForm.controls['company_name'].value?this.vendorForm.controls['company_name'].value : ''
    applicationDetails.vendor_details.id = this.jobApplication().vendor_details.id?this.jobApplication().vendor_details.id : '';
    if(this.jobApplication().vendor_details.id){
      applicationDetails.vendor_details.lastModifiedDate = moment().toString();
      applicationDetails.vendor_details.createdBy = this.userAccount().id;
    }
    else{
      applicationDetails.vendor_details.createdBy = moment().toString();
      applicationDetails.vendor_details.createdBy = this.userAccount().id;
    }

    this.userStore.setJobApplication(applicationDetails);
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


