import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { ClientContact, JobApplication, JobApplicationData, JobApplicationFeedback, JobApplicationRequest, JobInterviewRounds, ResumeListDataItem, VendorContact } from 'src/app/services/work-ifence-data.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoundsFormDialogComponent } from '../../rounds-form-dialog/rounds-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackFormDialogComponent } from '../../feedback-form-dialog/feedback-form-dialog.component';
import { Resume } from 'src/app/services/resume.model';
import { Account } from 'src/app/services/profile.model';
import { ResumeService } from 'src/app/services/resume.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { EmployerContactDialogComponent } from '../../employer-contact/employer-contact.component';
import { CurrencyFormatterModule } from 'src/app/services/shared/currency-format/currency-formatter.module';
import { NgxCurrencyDirective } from "ngx-currency";
import { urlValidator } from 'src/app/services/validators/username.validator';

const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-application-form-fields',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
    NgOptimizedImage,FooterComponent, MatMenuModule, MatRadioModule,
    MatListModule,CurrencyFormatterModule,
   CarouselModule,FlexLayoutModule,ReactiveFormsModule, FormsModule, 
   HeaderWorkIfenceComponent,  MatStepperModule,MatDatepickerModule,
   MatFormFieldModule,InputTextModule,TableModule,CalendarModule,
   MatInputModule,ButtonModule,OverlayPanelModule, MatTooltipModule,
   MatButtonModule,AccordionModule,InputTextareaModule,
   MatIconModule,MatExpansionModule, MatCheckboxModule, MatSelectModule, RoundsFormDialogComponent,FeedbackFormDialogComponent,
   EmployerContactDialogComponent, NgxCurrencyDirective],
  templateUrl: './application-form-fields.component.html',
  styleUrls: ['./application-form-fields.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ApplicationFormFieldsComponent implements OnInit {

  applicationForm! : FormGroup;

  jobTypes: any[] = [
    {value: 'fullTime', name: 'Full Time'},
    {value: 'c2c', name: 'Corp To Corp'},
    {value: 'contract', name: 'Contract'},
    {value: 'w2', name: 'W2'},
    {value: 'partTime', name: 'Part Time'},
  ];

  jobModes: any[] = [
    {value: 'onSite', name: 'On Site'},
    {value: 'remote', name: 'Remote'},
    {value: 'hybrid', name: 'Hybrid'},
  ];

  salTypes: any[] = [
    {value: 'salary', name: 'Salary'},
    {value: 'hourly', name: 'Hourly'},
    {value: 'daily', name: 'Daily'},
  ];

  jobApplicationStatusOptions = [
    { id: 0, value: 'Applied', label: 'Applied' },
    { id: 1, value: 'In Review', label: 'In Review' },
    { id: 2, value: 'Interview Scheduled', label: 'Interview Scheduled' },
    { id: 3, value: 'Interviewed', label: 'Interviewed' },
    { id: 4, value: 'Offer Extended', label: 'Offer Extended' },
    { id: 5, value: 'Offer Accepted', label: 'Offer Accepted' },
    { id: 6, value: 'Offer Accepted', label: 'Offer Accepted' },
    { id: 7, value: 'Offer Declined', label: 'Offer Declined' },
    { id: 8, value: 'Rejected', label: 'Rejected' },
    { id: 9, value: 'Withdrawn', label: 'Withdrawn' }
  ];


  jobApplicationStatusOptions1 = [
    'Applied',
    'In Review', 
     'Interview Scheduled',
     'Interviewed',
     'Offer Extended',
      'Offer Accepted',
      'Offer Accepted',
       'Offer Declined',
       'Rejected',
        'Withdrawn'
  ];
  private userStore: UserStoreService = inject(UserStoreService);
  private location: Location = inject(Location);
  // selectedAppLicationListItem : Signal<JobApplicationData> = this.userStore.getSelectedJobApplicationListItem();
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  selectedResumeForApplication : ResumeListDataItem = new ResumeListDataItem();
  interviewRounds : Array<JobInterviewRounds> = []

  constructor(private fb: FormBuilder, public dialog: MatDialog, public resumeService : ResumeService, private router : Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.applicationForm = this.fb.group({
      // Job Application Details
      jobRole: [this.selectedAppLicationListItem().jobApplication.jobRole, [ Validators.maxLength(255)]],
      jobDescription: [''],
      emailGiven: ['', [ Validators.email, Validators.maxLength(255)]],
      jobApplicationStatus: [''],
      jobType: [''],
      jobMode: [''],
      startDate: [''],
      primarySkills: [''],
      status: new FormControl(this.jobApplicationStatusOptions1[0] || 'Applied'),

      // Job Application Additional Details
      jobPostedDate: [''],
      jobAppliedDate: [''],
      jobShiftTimings: ['', [ Validators.maxLength(50)]],
      salaryType: [''],
      salaryMin: [''],
      salaryMax: [''],
      salaryExpected: [''],
      applicationReferalURL: ['', [Validators.maxLength(255)]],
      basicQualifications: [''],
      atsScore: [''],
      selectionProcess: [''],
      genderPreference: ['', [ Validators.maxLength(50)]],
      bondToBeSigned: [false],
      bondDetails: [''],
      companySize: ['', [ Validators.maxLength(255)]],

      // Vendor Details
      vendorFirstName: [''],
      vendorLastName: [''],
      vendorEmail: ['', [ Validators.email]],
      vendorPhone: [''],
      companyName: [''],
      location: [''],

      //Feedback
      userFeedback : [''],

      // Permissions
      readOnly: [''],
      writeOnly: ['']
    });

    this.setApplicationFormValues();


  }

  selectOption(option: string) {
    
    this.applicationForm.controls['status'].setValue(option);
    this.applicationForm.get('status')?.markAsDirty();
  }

  isSelected(option: string): boolean {
    return this.applicationForm.get('status')?.value === option;
  }

  setApplicationFormValues(){
    let selectedApp = this.selectedAppLicationListItem().jobApplication;
    let selectedVendor = this.selectedAppLicationListItem().vendorContact;
    let selectedRounds = this.selectedAppLicationListItem().jobInterviewRounds;
    let selectedFeedback = this.selectedAppLicationListItem().feedback;
    let selectedResume = this.selectedAppLicationListItem().resume;
    
    this.applicationForm.controls['jobRole'].setValue(selectedApp.jobRole || '');
    this.applicationForm.controls['jobDescription'].setValue(selectedApp.jobDescription || '');
    this.applicationForm.controls['emailGiven'].setValue(selectedApp.emailUsed || '');
    this.applicationForm.controls['status'].setValue(selectedApp.status || 'Applied');
    this.applicationForm.controls['jobType'].setValue(selectedApp.jobType || '');
    this.applicationForm.controls['jobMode'].setValue(selectedApp.jobMode || '');
    this.applicationForm.controls['startDate'].setValue(selectedApp.startDate || '');
    this.applicationForm.controls['primarySkills'].setValue(selectedApp.primarySkills || '');

    // Job Application Additional Details
    this.applicationForm.controls['jobPostedDate'].setValue(selectedApp.jobPostedDate || '');
    this.applicationForm.controls['jobAppliedDate'].setValue(selectedApp.jobAppliedDate || '');
    this.applicationForm.controls['jobShiftTimings'].setValue(selectedApp.jobShiftTimings || '');
    this.applicationForm.controls['salaryType'].setValue(selectedApp.salaryType || '');
    this.applicationForm.controls['salaryMin'].setValue(selectedApp.salaryMin || '');
    this.applicationForm.controls['salaryMax'].setValue(selectedApp.salaryMax || '');
    this.applicationForm.controls['salaryExpected'].setValue(selectedApp.salaryExpected || '');
    this.applicationForm.controls['applicationReferalURL'].setValue(selectedApp.companyOfficialWebsite || '');
    this.applicationForm.controls['basicQualifications'].setValue(selectedApp.basicQualifications || '');
    this.applicationForm.controls['atsScore'].setValue(selectedApp.atsScore || '');
    this.applicationForm.controls['selectionProcess'].setValue(selectedApp.selectionProcess || '');
    this.applicationForm.controls['genderPreference'].setValue(selectedApp.genderPreference || '');
    this.applicationForm.controls['bondToBeSigned'].setValue(selectedApp.bondToBeSigned || false);
    this.applicationForm.controls['bondDetails'].setValue(selectedApp.bondDetails || '');
    this.applicationForm.controls['companySize'].setValue(selectedApp.companySize || '');

    // Vendor Details
    this.applicationForm.controls['vendorFirstName'].setValue(selectedVendor.firstName || '');
    this.applicationForm.controls['vendorLastName'].setValue(selectedVendor.lastName || '');
    this.applicationForm.controls['vendorEmail'].setValue(selectedVendor.email || '');
    this.applicationForm.controls['vendorPhone'].setValue(selectedVendor.phone || '');
    this.applicationForm.controls['companyName'].setValue(selectedVendor.companyName || '');

    this.applicationForm.controls['location'].setValue(selectedApp.location || 'Not Known');

    // Permissions
    this.applicationForm.controls['readOnly'].setValue(selectedApp.readOnlyUserIds || '');
    this.applicationForm.controls['writeOnly'].setValue(selectedApp.writeUserIds || '');


}


saveAndContinue($event : any){
  console.log("Saving Application Form");
  let final_data = new JobApplicationRequest();
  let application = new JobApplication();
  let rounds = new Array<JobInterviewRounds>();

  if(this.selectedAppLicationListItem().jobApplication.id){
    application.id = this.selectedAppLicationListItem().jobApplication.id;
  }
  application.applicantId = this.userAccount().id;
  application.atsScore = this.applicationForm.controls['atsScore'].value;
  application.basicQualifications = this.applicationForm.controls['basicQualifications'].value;
  application.bondDetails = this.applicationForm.controls['bondDetails'].value;
  application.bondToBeSigned = this.applicationForm.controls['bondToBeSigned'].value;
  application.companyName = this.applicationForm.controls['companyName'].value;
  application.companyOfficialWebsite = this.applicationForm.controls['applicationReferalURL'].value;
  application.companySize = this.applicationForm.controls['companySize'].value;
  application.emailUsed = this.applicationForm.controls['emailGiven'].value;
  application.genderPreference = this.applicationForm.controls['genderPreference'].value;
  application.jobAppliedDate = this.applicationForm.controls['jobAppliedDate'].value;
  application.jobDescription = this.applicationForm.controls['jobDescription'].value;
  application.jobMode = this.applicationForm.controls['jobMode'].value;
  application.jobPostedDate = this.applicationForm.controls['jobPostedDate'].value;
  application.jobRole = this.applicationForm.controls['jobRole'].value;
  application.jobShiftTimings = this.applicationForm.controls['jobShiftTimings'].value;
  application.jobType = this.applicationForm.controls['jobType'].value;
  application.primarySkills = this.applicationForm.controls['primarySkills'].value;
  application.salaryExpected = this.applicationForm.controls['salaryExpected'].value;
  application.salaryMax= this.applicationForm.controls['salaryMax'].value;
  application.salaryMin = this.applicationForm.controls['salaryMin'].value;
  application.salaryType = this.applicationForm.controls['salaryType'].value;
  application.selectionProcess = this.applicationForm.controls['selectionProcess'].value;
  application.startDate = this.applicationForm.controls['startDate'].value;
  application.status = this.applicationForm.controls['status'].value;
  application.location = this.applicationForm.controls['location'].value;
  application.wish = false;
  application.resumeId = this.selectedResumeForApplication.id;
  application.vendorContactId = this.selectedAppLicationListItem().jobApplication.vendorContactId?this.selectedAppLicationListItem().jobApplication.vendorContactId : '';

  // Need to update the fields according to situtaion
  application.readOnlyUserIds = '';
  application.writeUserIds = '';
  application.clientContactId = '';
  application.enterPriseId = '';
  application.feedbackProvided = false;
  application.previouslyAttended = false;
  application.previouslyAttendedIds = '';
  //

  rounds = [...this.selectedAppLicationListItem().jobInterviewRounds]

  final_data.jobApplication = application;
  final_data.vendorContact = this.selectedAppLicationListItem().vendorContact;
  final_data.clientContact = this.selectedAppLicationListItem().clientContact;
  final_data.jobInterviewRounds = [...rounds];

  if(application.id){
    application.lastModifiedBy = '';
    application.lastModifiedDate = new Date().toString();
    this.resumeService.saveApplication(final_data).subscribe((e)=>{
      this.applicationForm.reset();
      this.router.navigateByUrl('/user/job-applications');
    })
  }
  else{
    application.createdBy = '';
    application.createdDate = new Date().toString();
    this.resumeService.updateApplication(final_data).subscribe((e)=>{
      this.applicationForm.reset();
      this.router.navigateByUrl('/user/job-applications');
    })
  }

}



  goBackToApplications($event: any){
    this.location.back();
  }

  addRoundItem(): void {
    let round = new JobInterviewRounds();
    const dialogRef = this.dialog.open(RoundsFormDialogComponent, {
        width: '1200px',
        height: '600px',
      data: {round: round},
    });

    dialogRef.afterClosed().subscribe(result => {
     
      
    });
  }

  addFeedbackItem(): void {
    let feedback = new JobApplicationFeedback();
    const dialogRef = this.dialog.open(FeedbackFormDialogComponent, {
      data: {feedback: feedback},
    });

    dialogRef.afterClosed().subscribe(result => {
     
      
    });
  }

  editRoundItem(round : any): void {
    
    const dialogRef = this.dialog.open(RoundsFormDialogComponent, {
      data: {round: round},
    });

    dialogRef.afterClosed().subscribe(result => {
     
      
    });
  }

  editFeedbackItem(feedback : any): void {
    const dialogRef = this.dialog.open(FeedbackFormDialogComponent, {
      data: {feedback: feedback},
    });

    dialogRef.afterClosed().subscribe(result => {
     
      
    });
  }

  addContactDetails(who : string): void {
    if(who == 'client'){
      let contact = new ClientContact();
      contact = this.selectedAppLicationListItem().clientContact;
      const dialogRef = this.dialog.open(EmployerContactDialogComponent, {
        data: { isClient : true, contact : contact},
      });
  
      dialogRef.afterClosed().subscribe(result => {
       
        
      });
    }
    else{
      let contact = new VendorContact();
      contact = this.selectedAppLicationListItem().vendorContact;
      const dialogRef = this.dialog.open(EmployerContactDialogComponent, {
        data: { isClient : false, contact : contact},
      });
  
      dialogRef.afterClosed().subscribe(result => {
       
        
      });
    }
  }

  
  
}
