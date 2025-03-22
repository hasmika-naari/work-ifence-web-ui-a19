import { Component, OnInit, OnDestroy, inject, Signal,           CUSTOM_ELEMENTS_SCHEMA, 
          Output, EventEmitter, effect, OnChanges, SimpleChanges } from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TemplatesPageComponent } from '../templates-page/templates-page.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Account } from 'src/app/services/profile.model';
import { FeedbackRequest } from 'src/app/services/work-ifence-data.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { ApplicationListComponent } from '../dashboard-job-application/application-list/application-list.component';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { RequestsListComponent } from './request-list/request-list.component';
import { IfenceService } from 'src/app/services/ifence.service';
import { ServiceRequestItem } from 'src/app/services/store/app-store.model';
import { AppStoreService } from 'src/app/services/store/app-store.service';

interface Option {
  name : string;
  code : string;
}

@Component({
    selector: 'app-requests-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule, 
        StyleClassModule,
        NgOptimizedImage, MenuModule, ChartModule, FormsModule,
        ChartModule, ReactiveFormsModule,
        MenuModule,DividerModule, MatFormFieldModule, MatInputModule,
        TableModule,DialogModule,InputTextModule, MatProgressBarModule,
        StyleClassModule,RequestsListComponent,
        PanelMenuModule,
        ButtonModule,TemplatesPageComponent, ApplicationListComponent, 
        MatMenuModule, MatIconModule, MatToolbarModule, MatSelectModule, MatMenuModule, DropdownModule
        ],
    templateUrl: './dashboard-requests.component.html',
    styleUrl : './dashboard-requests.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class DashboardRequestsComponent implements OnInit, OnDestroy {

  isActionInProgress: boolean = true;

  items!: MenuItem[];

  chartData: any;

  chartOptions: any;

  subscriptions: Array<Subscription> = [];


  productDialog: boolean = false;
  searchQuery = new FormControl();

  filteredRoleCategoryValue = new FormControl()
  filteredRequestCategoryValue = new FormControl()
  roleCategories : Array<Option> = [];
  resumeCategories : Array<Option> = [{
    name: 'All',
    code: 'All'
  }, {
    name: 'Request for New Org Account',
    code: 'Request for New Org Account'
  },{
    name: 'Request for New Feature',
    code: 'Request for New Feature'
  },{
    name: 'Issue with Login',
    code: 'Issue with Login'
  }];

  private ifenceService: IfenceService = inject(IfenceService);
  private appStore: AppStoreService = inject(AppStoreService);
  private userStore: UserStoreService = inject(UserStoreService);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  isFilterOff : boolean = true
  isSearchOff : boolean = true
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  serviceRequests : ServiceRequestItem[] = []
  filteredServiceRequests : ServiceRequestItem[] = []

  receivedRequests: Array<FeedbackRequest> = [
    {
      id: 1,
      dateReceived: '2024-02-28',
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john.doe@example.com',
      phoneNumber: '9876543210',
      requestType: 'Request for New Org Account',
      requestDescription: 'Need an organization account for new employees.',
      status: 'New',
      expanded: false
    },
    {
      id: 2,
      dateReceived: '2024-02-27',
      firstName: 'Jane',
      lastName: 'Smith',
      emailId: 'jane.smith@example.com',
      phoneNumber: '9876543211',
      requestType: 'Issue with Login',
      requestDescription: 'Unable to log in to the portal with my credentials.',
      status: 'Addressed',
      expanded: false
    }
  ];


  constructor(private router: Router, public layoutService: LayoutService) {

  }

  ngOnInit() {
      this.getServiceRequests()
  }

  getServiceRequests(){
    this.isActionInProgress = true;
    this.subscriptions.push(this.ifenceService.getServiceRequests().subscribe((data: ServiceRequestItem[])=> {
          console.log(data);
          this.serviceRequests = data
          this.appStore.updateServiceRequests(data);
          this.isActionInProgress = false;
        }));    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Handles the "Add Job Application" button click.
   */
  onAddServiceRequest(): void {

  }

  unselectFilter(){
    return null;
  }

  receiveFromChild(event : Boolean){
    return null;

  }

  filterApplications(){
    return null;

  }
}
