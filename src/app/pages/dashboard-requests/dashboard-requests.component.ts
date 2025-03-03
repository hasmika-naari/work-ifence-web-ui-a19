import { Component, OnInit, OnDestroy, inject, Signal, AfterViewInit, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA, 
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
import { ResumeList2Component } from '../resume-list2/resume-list2.component';
import { ResumeFormTabbedComponent } from '../resume-form-tabbed/resume-form-tabbed.component';
import { ResumeForm2Component } from '../resume-form2/resume-form2.component';
import { ResumeFormComponent } from '../resume-form/resume-form.component';
import { TemplatesPageComponent } from '../templates-page/templates-page.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JobApplication, Resume, RoundDetails } from 'src/app/services/resume.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ResumeService } from 'src/app/services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { JobApplicationRequest, ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import moment from 'moment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JobApplicationStatus } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { ApplicationListComponent } from '../dashboard-job-application/application-list/application-list.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { RequestsListComponent } from './request-list/request-list.component';

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
        PanelMenuModule,ResumeFormTabbedComponent,ResumeForm2Component,
        ButtonModule,TemplatesPageComponent, ResumeFormComponent, ApplicationListComponent, 
        MatMenuModule, MatIconModule, MatToolbarModule, MatSelectModule, MatMenuModule, DropdownModule
        ],
    templateUrl: './dashboard-requests.component.html',
    styleUrl : './dashboard-requests.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class DashboardRequestsComponent implements OnInit, OnDestroy, AfterViewInit {

  isActionInProgress: boolean = true;

  items!: MenuItem[];

  chartData: any;

  chartOptions: any;

  subscriptions: Array<Subscription> = [];

  showResumeGenerator = false;

  productDialog: boolean = false;

  showResumeGeneratorHeader =  false;

  searchQuery = new FormControl();

  filteredRoleCategoryValue = new FormControl()
  filteredResumeCategoryValue = new FormControl()
  roleCategories : Array<Option> = []
  resumeCategories : Array<Option> = []
  tempResumes : ResumeListDataItem[] = []

  private resumeService: ResumeService = inject(ResumeService);
  private pdfToImageService: PdfToImageService = inject(PdfToImageService);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  private platformId: object =  inject(PLATFORM_ID);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  isFilterOff : boolean = true
  isSearchOff : boolean = true
  resumeList : Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
  filteredResumesList : Signal<ResumeListDataItem[]> = this.userStore.getFilteredResumes();
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  subs: Array<Subscription> = [];
  resumes : ResumeListDataItem[] = []
  filteredResumes : ResumeListDataItem[] = []
  isFirstTimeCalling : boolean = true;

  locations = [];
  filteredLocationValue: string = '';

  constructor(private router: Router, public layoutService: LayoutService) {
      effect(()=>{
        this.setFilterValues();
        console.log(this.loginStatus());

        if(this.loginStatus() && this.isFirstTimeCalling){
          console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

          this.isFirstTimeCalling = false;
          this.loadResumeData()
        }
      })
  }

  ngOnInit() {
      // this.sidenavService.toggleCollapsed();

      this.filteredResumeCategoryValue.setValue("");
      this.filteredRoleCategoryValue.setValue("");
      this.searchQuery.setValue("");
      this.userStore.setFilteredResumes(this.resumeList());
      
      this.searchQuery.valueChanges.subscribe((e)=>{
          if(e.length == 0){
            this.isSearchOff = true
          }
          else{
            this.isSearchOff = false
          }
          this.filteredResumes = this.resumeList().filter((resume) =>
            resume.title.toLowerCase().includes(this.searchQuery.value.toLowerCase())
          );
          this.userStore.setFilteredResumes(this.filteredResumes);
        
      })

      this.items = [
          { label: 'Add New', icon: 'pi pi-fw pi-plus' },
          { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ];

      if(isPlatformBrowser(this.platformId)){
         setTimeout(() => {
           this.getResumes();
         }, 50);
      }

       
  }

  getResumes(){
    // if(this.resumeList().length == 0){
    //   this.isActionInProgress = true;
    //   this.subs.push(this.resumeService.getResumeListByOwnerId(
    //       this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
    //         console.log(data);
    //       data.map(async (e : ResumeListDataItem)=>{
    //       await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + e.documentUrl).then((bytes)=>{
    //           e.imageBytes = bytes;
    //           this.resumes = [...this.resumes, e]
    //           let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
    //           if (!roleExists && e.roleCategory.length > 0) {
    //             this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
    //           }

    //           let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
    //           if (!resumeCategoryExists && e.resumeCategory.length > 0) {
    //             this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
    //           }
    //       })
    //       this.userStore.setResumeDataListItems(this.resumes);
    //       this.userStore.setFilteredResumes([...this.resumes]);
    //       setTimeout(() => {
    //         this.isActionInProgress = false;
    //       }, 100);

    //       })
    //       }, (err: any) => {
    //          console.log("Error: " + err);
    //          debugger;
    //       }));
    // }
    // else{

    //     this.resumeList().map((e)=>{
    //       let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
    //           if (!roleExists && e.roleCategory.length > 0) {
    //             this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
    //           }

    //           let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
    //           if (!resumeCategoryExists && e.resumeCategory.length > 0) {
    //             this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
    //           }
    //     })
    //     setTimeout(() => {
    //       this.isActionInProgress = false;
    //     }, 100);
    // }   
    if(this.loginStatus() && this.isFirstTimeCalling){
      this.isFirstTimeCalling = false;
      this.loadResumeData()
    }
  }

  private async loadResumeData() {
    try {
      await this.getResumeData(); // Ensure it completes before proceeding
      console.log("Resume data loaded successfully");
    } catch (error) {
      console.error("Error loading resume data", error);
    }
  }

  getResumeData(){
    if(this.resumeList().length == 0 && this.loginStatus()){
      this.isActionInProgress = true;
      this.subs.push(this.resumeService.getResumeListByOwnerId(
          this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
            console.log(data);
          data.map(async (e : ResumeListDataItem)=>{
          await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + e.documentUrl).then((bytes)=>{
              e.imageBytes = bytes;
              this.resumes = [...this.resumes, e]
              let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
              if (!roleExists && e.roleCategory.length > 0) {
                this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
              }

              let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
              if (!resumeCategoryExists && e.resumeCategory.length > 0) {
                this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
              }
          })
          this.userStore.setResumeDataListItems(this.resumes);
          this.userStore.setFilteredResumes([...this.resumes]);
          this.isActionInProgress = false;
          })
          }));
        }
      else{
        this.resumeList().map((e)=>{
          let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
              if (!roleExists && e.roleCategory.length > 0) {
                this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
              }

              let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
              if (!resumeCategoryExists && e.resumeCategory.length > 0) {
                this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
              }
        })
        this.isActionInProgress = false;
      }      
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
          // //this.sidenavService.setCollapsed(true);
          }, 100);
  }

  receiveFromChild(isActionInProgress: boolean) {
    this.isActionInProgress = isActionInProgress; 
  }

  setFilterValues(){
    this.resumeList().map((e)=>{
      let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
          if (!roleExists && e.roleCategory.length > 0) {
            this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
          }

          let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
          if (!resumeCategoryExists && e.resumeCategory.length > 0) {
            this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
          }
    })
  }

  

  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Handles the "Add Job Application" button click.
   */
  onAddResume(): void {
    this.userStore.updateResumeForm(new Resume());
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.userStore.setIsChangeInNewResume(false);
    this.router.navigateByUrl('/user/resumes/resume');
  }

  filterApplications(){    
    this.isFilterOff = false
    this.searchQuery.disable()
    console.log(this.filteredResumeCategoryValue.value?.name, this.filteredRoleCategoryValue.value?.name);
    if((this.filteredResumeCategoryValue.value?.name?this.filteredResumeCategoryValue.value?.name.length > 0 : false) && (this.filteredRoleCategoryValue.value?.name?this.filteredRoleCategoryValue.value?.name.length > 0 : false)){
    this.filteredResumes = this.resumeList().filter(resume => (resume.roleCategory == this.filteredRoleCategoryValue.value?.name) && (resume.resumeCategory == this.filteredResumeCategoryValue.value?.name))
    }
    else if(this.filteredRoleCategoryValue.value?.name?this.filteredRoleCategoryValue.value?.name.length > 0 : false){
    this.filteredResumes = this.resumeList().filter(resume => (resume.roleCategory == this.filteredRoleCategoryValue.value?.name))
    }
    else if(this.filteredResumeCategoryValue.value?.name?this.filteredResumeCategoryValue.value?.name.length > 0 : false){
    this.filteredResumes = this.resumeList().filter(resume => (resume.resumeCategory == this.filteredResumeCategoryValue.value?.name))
    }
    this.userStore.setFilteredResumes(this.filteredResumes);
  }


  unselectFilter(){
    this.isFilterOff = true
    this.searchQuery.enable()
    this.filteredResumeCategoryValue.setValue("");
    this.filteredRoleCategoryValue.setValue("")
    this.userStore.setFilteredResumes(this.resumeList());
  }

  onSearch(){
    
  }

  onFilter(){

  }
}
