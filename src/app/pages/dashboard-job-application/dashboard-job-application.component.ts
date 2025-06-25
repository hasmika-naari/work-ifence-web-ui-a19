import { Component, OnInit, OnDestroy, inject, Signal, AfterViewInit, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation,effect, AfterContentChecked, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ResumeList2Component } from '../resume-list2/resume-list2.component';
import { ResumeFormTabbedComponent } from '../resume-form-tabbed/resume-form-tabbed.component';
import { ResumeForm2Component } from '../resume-form2/resume-form2.component';
import { ResumeFormComponent } from '../resume-form/resume-form.component';
import { TemplatesPageComponent } from '../templates-page/templates-page.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JobApplication, JobApplicationDetails, Resume, RoundDetails } from 'src/app/services/resume.model';
import { ApplicationListComponent } from './application-list/application-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ResumeService } from 'src/app/services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { JobApplicationRequest } from 'src/app/services/work-ifence-data.model';
import moment from 'moment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JobApplicationStatus } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogComponent } from '../resume-form3/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Option {
  name : string;
  code : string;
}

@Component({
    selector: 'dashboard-job-application',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule, 
        StyleClassModule,AutoCompleteModule,
        NgOptimizedImage, MenuModule, ChartModule, FormsModule,
        ChartModule, ReactiveFormsModule,
        MenuModule,DividerModule, MatFormFieldModule, MatInputModule,
        TableModule,DialogModule,InputTextModule, MatProgressBarModule,
        StyleClassModule,ResumeList2Component, MatCardModule,
        PanelMenuModule,ResumeFormTabbedComponent,ResumeForm2Component,DragDropModule ,
        ButtonModule,TemplatesPageComponent, ResumeFormComponent, ApplicationListComponent,
         MatMenuModule, MatIconModule, MatToolbarModule, MatSelectModule, MatMenuModule, DropdownModule],
    templateUrl: './dashboard-job-application.component.html',
    styleUrls: ['./dashboard-job-application.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class DashboardJobApplicationComponent implements OnInit, AfterViewInit, AfterContentInit {

  items!: MenuItem[];
  filterText: string  = '';

  chartData: any;

  chartOptions: any;

  subscriptions: Array<Subscription> = [];

  showResumeGenerator = false;

  productDialog: boolean = false;

  showResumeGeneratorHeader =  false;

  searchQuery : string = ''

  filteredJobTitleValue : Option = {name : '', code : ''};
  filteredCompanyNameValue : Option = {name : '', code : ''};
  filteredLocationValue : Option = {name : '', code : ''};
  jobTitles : Array<Option> = [];
  jobTitlesFull : Array<Option> = [];
  companies : Array<Option> =  [];
  companiesFull : Array<Option> =  [];
  locations : Array<Option> = [];
  locationsFull : Array<Option> = [];

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


  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  private platformId: object =  inject(PLATFORM_ID);
  private cdr: ChangeDetectorRef =  inject(ChangeDetectorRef);

  userAccount: Signal<Account> = this.userStore.getUserAccount();
  jobApplications: Signal<JobApplication[]> = this.userStore.getJobApplicationsList();
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  isActionInProgress = true;

  applied_applications : JobApplication[] = [];
  interview_applications : JobApplication[] = [];
  offer_applications : JobApplication[] = [];
  not_chosen_applications : JobApplication[] = [];

  isFilterOff : boolean = true;
  highlightedSection: any = null; 
  isFirstTimeCalling : boolean = true;

  searchJobApplication = new FormControl('');
  constructor(private router: Router, public layoutService: LayoutService, private resumeService : ResumeService,
    public dialog: MatDialog
  ) {
    effect(()=>{
      this.setListandDropDowns();
      if(this.loginStatus() && this.isFirstTimeCalling){
        this.isFirstTimeCalling = false;
        this.loadJobApplicationData()
      }
    })
  }

  ngOnInit() {
      // this.sidenavService.toggleCollapsed();
      this.items = [
          { label: 'Add New', icon: 'pi pi-fw pi-plus' },
          { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ];

      this.subscriptions.push(this.searchJobApplication.valueChanges.subscribe((filterText) => {
          this.filterText = filterText?filterText:'';
      }));
      debugger;
      if(isPlatformBrowser(this.platformId)){
        // alert('Calling Job Applications');
        // alert('user: ' + this.userAccount().login);
        setTimeout(() => {
        this.userAccount = this.userStore.getUserAccount();
          this.getAllJobApplications();
          if(this.loginStatus() && this.isFirstTimeCalling){
            this.isFirstTimeCalling = false;
            this.loadJobApplicationData()
          }
        }, 600);
      }

      // Select the element with the class "card"
      const cardElement = document.querySelector('.cards') as HTMLElement;
      const interviewCardElement = document.querySelector('.interview-cards') as HTMLElement;
      const offerCardElement = document.querySelector('.offer-cards') as HTMLElement;
      const notChoosenCardElement = document.querySelector('.not-choosen-cards') as HTMLElement;

      let remaingHeight = window.innerHeight - 350;
      // Check if the element exists
      if (cardElement && interviewCardElement && offerCardElement && notChoosenCardElement) {
          // Set the height style
          cardElement.style.height = remaingHeight + 'px'; // Example height
          interviewCardElement.style.height = remaingHeight + 'px'; // Example height
          offerCardElement.style.height = remaingHeight + 'px'; // Example height
          notChoosenCardElement.style.height = remaingHeight + 'px'; // Example height
      }
  }

  ngAfterViewInit(): void {
    // this.getAllJobApplications();
      setTimeout(() => {
          // //this.sidenavService.setCollapsed(false);
          }, 100);
  }

  ngAfterContentInit(): void {
    // if(isPlatformBrowser(this.platformId)){
    //   this.userAccount = this.userStore.getUserAccount();
    //   this.getAllJobApplications();
    // }
      
  }

  filterResumes(filter: string | null){
      let filteredList: any = [];

      if(filter){

      }else{
          filteredList = [...this.items];
      }

      return filteredList;
  }
  

  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
  }

  showResumeGeneratorHandler($event: any){
      // this.showResumeGenerator = true;
      let resumeForm = new Resume();
      this.userStore.updateResumeForm(resumeForm);
      this.userStore.setIsChangeInNewResume(false);
      this.router.navigateByUrl("/user/jobapplications/jobapp");
  }

  getAllJobApplications(){
    if(this.userAccount().id){
      this.isActionInProgress = true;
      this.resumeService.getAllJobApplications(this.userAccount().id).subscribe((e : JobApplicationRequest[])=>{
        // alert('Got the Job Applications');
          this.userStore.setAllJobApplicationsCompleteDetails(e);
          let jobApplications : JobApplication[] = []
          e.map((application : JobApplicationRequest)=>{
              let jobApplication : JobApplication = new JobApplication();

              jobApplication.job_application_details.email_provided = application.jobApplication.emailUsed
              jobApplication.job_application_details.company_name = application.jobApplication.companyName
              jobApplication.job_application_details.applied_date = application.jobApplication.jobAppliedDate
              jobApplication.job_application_details.job_description = application.jobApplication.jobDescription
              jobApplication.job_application_details.job_mode = application.jobApplication.jobMode
              jobApplication.job_application_details.job_role = application.jobApplication.jobRole
              jobApplication.job_application_details.job_type = application.jobApplication.jobType
              jobApplication.job_application_details.location = application.jobApplication.companySize
              jobApplication.job_application_details.status = application.jobApplication.status
              jobApplication.job_application_details.job_reference_url = application.jobApplication.companyOfficialWebsite
              jobApplication.job_application_details.createdBy = application.jobApplication.createdBy
              jobApplication.job_application_details.lastModifiedBy = application.jobApplication.lastModifiedBy
              jobApplication.job_application_details.id = application.jobApplication.id
              jobApplication.job_application_details.lastModifiedDate = application.jobApplication.lastModifiedDate
              jobApplication.job_application_details.createdDate = application.jobApplication.createdDate
              jobApplication.job_application_details.resume_download_link = application.jobApplication.resumeId;
              if (application.jobApplication.jobAppliedDate) {
                  const formattedDate = moment(application.jobApplication.jobAppliedDate).format('DD-MM-YYYY');
                  jobApplication.job_application_details.formatted_date = formattedDate;
                }
              
              if(application.clientContact?.id){
                  jobApplication.client_details.first_name = application.clientContact.firstName
                  jobApplication.client_details.last_name = application.clientContact.lastName
                  jobApplication.client_details.email = application.clientContact.email
                  jobApplication.client_details.phone_number = application.clientContact.phone
                  jobApplication.client_details.company_name = application.clientContact.companyName
                  jobApplication.client_details.createdBy = application.clientContact.createdBy
                  jobApplication.client_details.lastModifiedBy = application.clientContact.lastModifiedBy
                  jobApplication.client_details.id = application.clientContact.id
                  jobApplication.client_details.lastModifiedDate = application.clientContact.lastModifiedDate
                  jobApplication.client_details.createdDate = application.clientContact.createdDate
              }


              if(application.vendorContact?.id){
                  jobApplication.vendor_details.first_name = application.vendorContact.firstName
                  jobApplication.vendor_details.last_name = application.vendorContact.lastName
                  jobApplication.vendor_details.email = application.vendorContact.email
                  jobApplication.vendor_details.phone_number = application.vendorContact.phone
                  jobApplication.vendor_details.company_name = application.vendorContact.companyName
                  jobApplication.vendor_details.createdBy = application.vendorContact.createdBy
                  jobApplication.vendor_details.lastModifiedBy = application.vendorContact.lastModifiedBy
                  jobApplication.vendor_details.id = application.vendorContact.id
                  jobApplication.vendor_details.lastModifiedDate = application.vendorContact.lastModifiedDate
                  jobApplication.vendor_details.createdDate = application.vendorContact.createdDate
              }


              let rounds : RoundDetails[] = []
              application.jobInterviewRounds.map((e)=>{
              let round = new RoundDetails();
              round.createdBy = e.createdBy;
              round.lastModifiedBy = e.lastModifiedBy;
              round.id = e.id;
              round.lastModifiedDate = e.lastModifiedDate;
              round.createdDate = e.createdDate;
              round.isNew = false
              round.mode = e.mode;
              round.date = e.roundDate;
              if (e.roundDate) {
                  const formattedDate = moment(e.roundDate).format('DD-MM-YYYY');
                  round.formatted_date = formattedDate;
                }
              round.notes = e.roundDescription;
              round.type = e.roundType;
              round.status = e.status;
              round.meet_link = e.venueOrLink;
              round.time = e.result;
              rounds.push(round);
              })
              jobApplication.round_details = rounds;
              if(application.jobApplication.status == "Applied" || application.jobApplication.status == "Under Review"){
                  this.applied_applications = [...this.applied_applications , jobApplication];
              }
              else if(application.jobApplication.status == "Interview Scheduled" || application.jobApplication.status == "Interview Completed" || application.jobApplication.status == "On Hold"){
                  this.interview_applications = [...this.interview_applications , jobApplication];
              }
              else if(application.jobApplication.status == "Hired" || application.jobApplication.status == "Offered" || application.jobApplication.status == "Offer Extended" || application.jobApplication.status == "Offer Accepted"){
                  this.offer_applications = [...this.offer_applications , jobApplication];
              }
              else if(application.jobApplication.status == "Rejected" || application.jobApplication.status == "Offer Declined" || application.jobApplication.status == "Withdrawn by Applicant" 
                  || application.jobApplication.status == "Position Closed" || application.jobApplication.status == "Resigned"){
                  this.not_chosen_applications = [...this.not_chosen_applications , jobApplication];
              }
              jobApplications = [...jobApplications, jobApplication];
              let locationExists = this.locations.some(location => location.name.trim().toLowerCase() === application.jobApplication.companySize.trim().toLowerCase());
              
              if (!locationExists && application.jobApplication.companySize.length>0) {
                this.locations = [...this.locations , { name: application.jobApplication.companySize, code: '' }];
                this.locationsFull = [...this.locations];
                // this.locations = [];
              }
              console.log("Location: ", application.jobApplication.companySize, "LocationExist: ", locationExists, "LocationsList: ", this.locations);
              // let jobTitleExists = this.jobTitles.some(title => title.name.includes(application.jobApplication.jobRole));
              // if (!jobTitleExists && application.jobApplication.jobRole.length > 0) {
              //   this.jobTitles = [...this.jobTitles , { name: application.jobApplication.jobRole, code: '' }];
              //   this.jobTitlesFull = [...this.jobTitles];
              // }
              let jobTitleExists = this.jobTitles.some(title => title.name.trim().toLowerCase() === application.jobApplication.jobRole.trim().toLowerCase());
              if (!jobTitleExists && application.jobApplication.jobRole.length > 0) {
                this.jobTitles = [...this.jobTitles , { name: application.jobApplication.jobRole, code: '' }];
              }
              this.jobTitlesFull = [...this.jobTitles];

              console.log("Job Title: ", application.jobApplication.jobRole, "JobTitleExist: ", jobTitleExists, "JobTitleList: ", this.jobTitles);


              let companyExists = this.companies.some(company => company.name.trim().toLowerCase() === application.jobApplication.companyName.trim().toLowerCase());
                
              if (!companyExists && application.jobApplication.companyName.length >0) {
                this.companies = [...this.companies , { name: application.jobApplication.companyName, code: '' }];
                this.companiesFull = [...this.companies];
              }
              console.log("Company: ", application.jobApplication.companyName, "CompanyExist: ", companyExists, "CompaniesList: ", this.companies);
          })
          this.userStore.addJobApplicationList(jobApplications);
          this.isActionInProgress = false;
          this.cdr.detectChanges()
          // alert('Stopped progressbar' + this.isActionInProgress);
      }, (error: any) => {
          debugger;
      })
    }else{
      this.router.navigateByUrl("/sign-in");
    }
  }


  // drop(event: CdkDragDrop<any[]>, newStatus: string) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     const movedApplication = event.previousContainer.data[event.previousIndex];

  //     // Remove from old list and add to new list
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     // Update status in backend
  //     this.updateApplicationStatus(movedApplication.id, newStatus);
  //   }
  // }

  drop(event: CdkDragDrop<any[]>, movStatus: string) {
    const previousList = event.previousContainer.id;
    const currentList = event.container.id;

    if (previousList === currentList) {
      // If dragged within the same list, simply reorder
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // If moved to a different list, update its status and transfer the item
      const movedApplication: JobApplication = event.previousContainer.data[event.previousIndex];

      // Remove from old list and add to new list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update status in UI
      // movedApplication.status = newStatus;
      let astatus = movedApplication.job_application_details.status;
      let newStatus = '';
      if( movStatus === 'not_chosen' ){
        if(astatus === 'Applied' || astatus === 'Under Review'){
          newStatus = 'Rejected';
        }else if(astatus === 'Interview Scheduled' || astatus === 'Interview Completed' || astatus === 'On Hold'){
          newStatus = 'Withdrawn by Applicant';
        }else if(astatus === 'Offered'  || astatus === 'Offer Extended'){
          newStatus = 'Offer Declined'
        } else if(astatus === 'Hired'){
          newStatus = 'Resigned';
        }
      }else if (movStatus === 'Applied'){
        newStatus = 'Applied';
      }else if(movStatus === 'Interview'){
        newStatus = 'Interview Scheduled';
      }else if(movStatus === 'Offered'){
        newStatus = 'Offered';
      }

      // Call API to update the backend
      this.updateApplicationStatus(movedApplication, newStatus);
    }
    this.highlightedSection = null;
    this.cdr.detectChanges(); // Ensure UI refreshes
  }

  updateApplicationStatus(japp: JobApplication, status: string){
    this.isActionInProgress = true;
    japp.job_application_details.status = status;

    this.resumeService.updateApplicationStatus(japp.job_application_details).subscribe((e)=>{
      this.isActionInProgress = false;
      this.getAllJobApplications();
    })
  }

  private async loadJobApplicationData() {
    try {
      await this.getAllJobApplications(); // Ensure it completes before proceeding
      console.log("Resume data loaded successfully");
    } catch (error) {
      console.error("Error loading resume data", error);
    }
  }

  moveApplication(japp: JobApplication, status: string){
    this.isActionInProgress = true;

    let astatus = japp.job_application_details.status;
    let newStatus = '';
    if( status === 'not_chosen' ){
      if(astatus === 'Applied' || astatus === 'Under Review'){
        newStatus = 'Rejected';
      }else if(astatus === 'Interview Scheduled' || astatus === 'Interview Completed' || astatus === 'On Hold'){
        newStatus = 'Withdrawn by Applicant';
      }else if(astatus === 'Offered'  || astatus === 'Offer Extended'){
        newStatus = 'Offer Declined'
      } else if(astatus === 'Hired'){
        newStatus = 'Resigned';
      }
    }else if (status === 'Applied'){
      newStatus = 'Applied';
    }else if(status === 'Interview'){
      newStatus = 'Interview Scheduled';
    }else if(status === 'Offered'){
      newStatus = 'Offered';
    }

    japp.job_application_details.status = newStatus;

    this.resumeService.updateApplicationStatus(japp.job_application_details).subscribe((e)=>{
      this.isActionInProgress = false;
      this.getAllJobApplications();
    })
  }

  onDragEntered(section: string) {
    console.log(`Drag entered: ${section}`);
    this.highlightedSection = section;
    this.cdr.detectChanges();
  }

  onDragExited() {
    console.log('Drag exited');
    this.highlightedSection = null;
    this.cdr.detectChanges();
  }


  editApplication(application : JobApplication){
    this.userStore.setJobApplication(application);
    this.router.navigateByUrl('/user/job-applications/application')
  }

  onSearch(): void {
    const searchValue = this.searchQuery?.trim();
    if (searchValue) {
      console.log('Search initiated with:', searchValue);
      // Add your actual search logic here
    } else {
      console.warn('Search field is empty');
    }
  }

  /**
   * Handles the "Add Job Application" button click.
   */
  onAddJob(): void {
    this.userStore.setJobApplication(new JobApplication());
    this.router.navigateByUrl('/user/job-applications/application');
  }

  temp_applied_applications : JobApplication[] = []
  temp_interview_applications : JobApplication[] = []
  temp_offer_applications : JobApplication[] = []
  temp_not_chosen_applications : JobApplication[] = []

  filterApplications(){    
    if(this.filteredJobTitleValue.name.length>0 || this.filteredCompanyNameValue.name.length>0 || this.filteredLocationValue.name.length>0){
    this.isFilterOff = false
    if(this.temp_applied_applications.length == 0){
      this.temp_applied_applications = [...this.applied_applications];
      this.temp_interview_applications = [...this.interview_applications];
      this.temp_offer_applications = [...this.offer_applications];
      this.temp_not_chosen_applications = [...this.not_chosen_applications];
    }
    if(this.filteredJobTitleValue.name.length>0 && this.filteredCompanyNameValue.name.length>0 && this.filteredLocationValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
    }
    else if(this.filteredJobTitleValue.name.length>0 && this.filteredCompanyNameValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) )
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) )
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) )
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.company_name == this.filteredCompanyNameValue.name) )
    }
    else if(this.filteredCompanyNameValue.name.length>0 && this.filteredLocationValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
    }
    else if(this.filteredJobTitleValue.name.length>0 && this.filteredLocationValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name) && (application.job_application_details.location == this.filteredLocationValue.name))
    }
    else if(this.filteredJobTitleValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name))
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name))
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name))
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.job_role == this.filteredJobTitleValue.name))
    }
    else if(this.filteredCompanyNameValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name))
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name))
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name))
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.company_name == this.filteredCompanyNameValue.name))
    }
    else if(this.filteredLocationValue.name.length>0){
      this.applied_applications = this.applied_applications.filter(application => (application.job_application_details.location == this.filteredLocationValue.name))
      this.interview_applications = this.interview_applications.filter(application => (application.job_application_details.location == this.filteredLocationValue.name))
      this.offer_applications = this.offer_applications.filter(application => (application.job_application_details.location == this.filteredLocationValue.name))
      this.not_chosen_applications = this.not_chosen_applications.filter(application => (application.job_application_details.location == this.filteredLocationValue.name))
    }
  }
    

  }

  filterJobTitles($event: any){
    const query = $event.query.toLowerCase();
    if(query){
      this.jobTitles = this.jobTitlesFull.filter(title =>
        title.name.toLowerCase().includes(query)
      );
    }else{
      this.jobTitles = [...this.jobTitlesFull];
    }
  
  }

  filterCompany($event: any){
    const query = $event.query.toLowerCase();
    if(query){
      this.companies = this.companiesFull.filter(comp =>
        comp.name.toLowerCase().includes(query)
      );
    }else{
      this.companies = [...this.companiesFull];
    }
  }

  filterLocation($event: any){
    const query = $event.query.toLowerCase();
    if(query){
      this.locations = this.locationsFull.filter(comp =>
        comp.name.toLowerCase().includes(query)
      );
    }else{
      this.locations = [...this.locationsFull];
    }
  }


  unselectFilter(){
    this.applied_applications = [...this.temp_applied_applications];
    this.interview_applications = [...this.temp_interview_applications];
    this.offer_applications = [...this.temp_offer_applications];
    this.not_chosen_applications = [...this.temp_not_chosen_applications];
    this.filteredJobTitleValue = {name : '', code : ''};
    this.filteredCompanyNameValue = {name : '', code : ''};
    this.filteredLocationValue = {name : '', code : ''};
    this.isFilterOff = true
  }

  deleteApplication($event : any, application : JobApplication, category : string){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe((result: { event: string; }) => {
      console.log(result.event);
      if(result.event == 'CONFIRM'){
        this.resumeService.deleteApplication(application.job_application_details.id).subscribe(()=>{
          let index = this.jobApplications().findIndex(obj => obj.job_application_details.id === application.job_application_details.id)
          this.userStore.removeJobApplication(index);
        })
      }
    });
  }

  setListandDropDowns(){
    this.applied_applications = [];
    this.interview_applications = [];
    this.offer_applications = [];
    this.not_chosen_applications = [];
    this.locations = [];
    this.companies = [];
    this.jobTitles = [];

    this.jobApplications().map((application : JobApplication)=>{
      if(application.job_application_details.status == "Applied" || application.job_application_details.status == "Under Review"){
        this.applied_applications = [...this.applied_applications , application];
      }
      else if(application.job_application_details.status == "Interview Scheduled" || application.job_application_details.status == "Interview Completed" || application.job_application_details.status == "On Hold"){
          this.interview_applications = [...this.interview_applications , application];
      }
      else if(application.job_application_details.status == "Hired" || application.job_application_details.status == "Offered" || application.job_application_details.status == "Offer Extended" || application.job_application_details.status == "Offer Accepted"){
          this.offer_applications = [...this.offer_applications , application];
      }
      else if(application.job_application_details.status == "Rejected" || application.job_application_details.status == "Offer Declined" || application.job_application_details.status == "Withdrawn by Applicant" || application.job_application_details.status == "Position Closed"){
          this.not_chosen_applications = [...this.not_chosen_applications , application];
      }
      let locationExists = this.locations.some(location => location.name.trim().toLowerCase() === application.job_application_details.location.trim().toLowerCase());
      if (!locationExists && application.job_application_details.location.length > 0) {
        this.locations = [...this.locations , { name: application.job_application_details.location, code: '' }];
      }
      let jobTitleExists = this.jobTitles.some(title => title.name.trim().toLowerCase() === application.job_application_details.job_role.trim().toLowerCase());
      if (!jobTitleExists && application.job_application_details.job_role.length > 0) {
        this.jobTitles = [...this.jobTitles , { name: application.job_application_details.job_role, code: '' }];
      }
      let companyExists = this.companies.some(company => company.name.trim().toLowerCase() === application.job_application_details.company_name.trim().toLowerCase());
      if (!companyExists && application.job_application_details.company_name.length>0) {
        this.companies = [...this.companies , { name: application.job_application_details.company_name, code: '' }];
      }
    })
  }
}
