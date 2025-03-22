import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { FilterService, SelectItem } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FeedbackRequest, ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { ResumeService } from 'src/app/services/resume.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account } from 'src/app/services/profile.model';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { UserResume } from 'src/app/services/store/user-store';
import { expand, Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JobResume, JobResumeRequest, Resume } from 'src/app/services/resume.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { WorkIfenceDataService } from 'src/app/services/work-ifence-data.service';
import { ConfirmDialogComponent } from '../../resume-form3/confirm-dialog/confirm-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ServiceRequestItem } from 'src/app/services/store/app-store.model';

@Component({
    selector: 'request-list',
    templateUrl: './request-list.component.html',
    styleUrl : './request-list.component.scss',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink, 
        RouterOutlet, 
        RouterModule,
        FormsModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        DropdownModule,
        RatingModule,
        ButtonModule,
        MenuModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        CheckboxModule,
        MatListModule,
        MatProgressBarModule,
        ConfirmDialogComponent,
        MatCheckbox,
        MatExpansionModule,
        MatTableModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCardModule
    ]
})
export class RequestsListComponent implements OnInit, OnChanges, OnDestroy {

 
    private userStore: UserStoreService = inject(UserStoreService);
    private appUtilService: AppUtilService = inject(AppUtilService);
    
    @Input() isActionInProgress: boolean = true; 
    @Input() reqlist: Array<ServiceRequestItem> = []; 
    @Output() childEvent = new EventEmitter<boolean>();
    resumes: ResumeListDataItem[] = [];
    userAccount: Signal<Account> = this.userStore.getUserAccount();
    selectedResumeListItem : Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
    resumeDataItemList: Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
    filteredResumes: Signal<ResumeListDataItem[]> = this.userStore.getFilteredResumes();

    pdfBlob! : Blob

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];

    public resumeActionList = [
        { title: 'Primary', activated: false, value: 'Primary' },
        { title: 'Active', activated: false, value: 'Active' },
        { title: 'Public', activated: false, value: 'Public' },
        { title: 'Employer', activated: false, value: 'Employer' }
      ];



    checkBoxBinary = true;
    menuOptionsMenuPopUp = true;
    menuOptions = 
    [{
        label: 'Edit',
        routerLink: '',
        icon: 'pi pi-pencil',
        command: ($event: any) => {
            // this.showTemplate($event);
        }
    },
    {
        label: 'Duplicate',
        routerLink: '',

        icon: 'pi pi-clone',
        command: () => {
            // this.saveResume();
        }
    },
    {
      label: 'Download',
      routerLink: '',

      icon: 'pi pi-download',
      command: () => {
        //   this.saveAndDownload();
      }
    },
    {
        label: 'Delete',
        routerLink: '',

        icon: 'pi pi-trash',
        command: () => {
          //   this.saveAndDownload();
        }
      }
    ];

    subs: Array<Subscription> = [];
    imageSrc: string | null = null;



    ////////////////////////0..

    displayedColumns: string[] = ['dateReceived', 'user', 'email', 'phone', 'requestType', 'status', 'actions'];
    dataSource = [
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
  
    requestFilter = new FormControl('');

    constructor(
        private resumeService: ResumeService,
        private router : Router, 
        private wifenceDataService: WorkIfenceDataService,
        public templateService : TemplatesService,
        public dialog: MatDialog,
        public pdfToImageService : PdfToImageService) {
         }

    ngOnInit() {
    
        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }];

        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }];

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
    }

    // async handleResumeListitems(userName: string, fileName: string){
    //     await this.handleResumeDownload(userName, fileName);
    //     return this.imageSrc;
    // }

    // handleResumeDownload(userName: string, fileName: string) {
    //     this.resumeService.dowloadResumePDF(userName, fileName).subscribe({
    //       next: async (arrayBuffer: ArrayBuffer) => {
    //         const pdfBytes = new Uint8Array(arrayBuffer);
    //         this.imageSrc = await this.pdfToImageService.convertPdfToImage(pdfBytes);
    //       },
    //       error: (error) => {
    //         console.error('Error downloading PDF:', error);
    //       }
    //     });
    //   }

      getImagePath(item : ResumeListDataItem){
        var resume = JSON.parse(item.resumeJson)
        return resume.template_details.imgPath;
      }

    ngOnChanges(changes: SimpleChanges): void {
    }


    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onVehicleSelect() {
        // this.selectedVehicles = this.premiumAutomobilesList
        //   .filter(menuitem => menuitem.activated)
        //   .map(menuitem => menuitem.title);
      }

      public onMenuKeyDown(event: KeyboardEvent, index: number) {
        // switch (event.key) {
        //   case 'ArrowUp':
        //     if (index > 0) {
        //       this.setCheckboxFocus(index - 1);
        //     } else {
        //       this.menuItemsRef.last.focus();
        //     }
        //     break;
        //   case 'ArrowDown':
        //     if (index !== this.menuItemsRef.length - 1) {
        //       this.setCheckboxFocus(index + 1);
        //     } else {
        //       this.setFocusOnFirstItem();
        //     }
        //     break;
        //    case 'Enter':
        //     event.preventDefault();
        //     this.premiumAutomobilesList[index].activated
        //       = !this.premiumAutomobilesList[index].activated;
        //     this.onVehicleSelect();
        //     setTimeout(() => this.matMenuTriggerRef.closeMenu(), 200);
        //     break; 
        // }
      }

    getFilteredData() {
    return this.requestFilter.value
        ? this.reqlist.filter(item => item.requestType === this.requestFilter.value)
        : this.reqlist;
    }

    deleteRequest(id: number) {
    this.dataSource = this.dataSource.filter(item => item.id !== id);
    }

    editRequest(id: number) {
    alert(`Edit request with ID: ${id}`);
    }  

    addToWishList($event: any, resume: ResumeListDataItem){

    }

    selectResume($event: any, resume: ResumeListDataItem){
        resume.selected =  true;
    }

    unSelectResume($event: any, resume: ResumeListDataItem){
        resume.selected =  false;
    }

    getUnHideElements(resumeForm : Resume){
        let resume = new Resume();
        resume.achievement = resumeForm.achievement;
        resume.award = resumeForm.award;
        resume.certification = resumeForm.certification.filter(e=>e.isHideSelected == false)
        resume.contact = resumeForm.contact;
        resume.courseWork = resumeForm.courseWork;
        resume.education = resumeForm.education.filter(e=>e.isHideSelected == false)
        resume.experience = resumeForm.experience.filter(e=>e.isHideSelected == false)
        resume.imageBase64Encoded = resumeForm.imageBase64Encoded;
        resume.interest = resumeForm.interest;
        resume.language = resumeForm.language;
        resume.professional_membership = resumeForm.professional_membership;
        resume.profileSummary = resumeForm.profileSummary;
        resume.project = resumeForm.project.filter(e=>e.isHideSelected == false)
        resume.publication = resumeForm.publication;
        resume.skill = resumeForm.skill;
        resume.volunteer_experience = resumeForm.volunteer_experience;
    
        return resume;
    
      }
    


    menuActionHandler($event: any, item: ResumeListDataItem, option: any){
        console.log(item);
        if(option.label === 'Edit'){
            
            if(item && item.resumeJson) {
                let resumeForm: Resume = JSON.parse(item.resumeJson);
                resumeForm.contact.isDefaultData = false;
                this.userStore.setResumeForm(resumeForm);
                console.log(resumeForm, item);
                this.userStore.updateSelectedResumeListItem(item);
                // //this.sidenavService.setCollapsed(true);
                // this.sidenavService.setExpanded(false);
                this.router.navigateByUrl('/user/resumes/resume');
            }
        }else if(option.label === 'Duplicate'){
            this.childEvent.emit(true);
            let request = new JobResumeRequest();
            request.title = 'Copy Of ' + item.title;
            request.category = item.resumeCategory;
            request.roleCategory = item.roleCategory;
            request.access = item.access;
            request.description = "Resume Description"
            let custom_fileName = 'Copy Of ' + item.title.replace(/\s+/g, "") + this.appUtilService.generateUniqueString() + '.pdf';
            request.old_documentUrl = '';
            request.current_documentUrl = this.userAccount().login + "/wif-resume/" +  custom_fileName
            let resumeForm: Resume = JSON.parse(item.resumeJson);
            resumeForm.title = 'Copy Of ' + item.title;
            request.resumeJson = JSON.stringify(resumeForm);
            request.status = item.status;
            request.isPrimary = item.priority;
            request.lastUpdatedDate = Date.now().toString();
            request.lastUsedFor = "";
            request.templateId = item.templateId;
            request.ownerId = this.userAccount().id;
            request.old_filename = item.fileName
            request.current_filename = custom_fileName;
            request.htmlcontent = this.templateService.getFormatedResumeHTMLText(resumeForm.template_details.template_name, this.getUnHideElements(JSON.parse(item.resumeJson)))
            request.username = this.userAccount().login;
            request.createdDate = Date.now().toString();
            this.subs.push(this.resumeService.saveResume(request).subscribe((e : ResumeListDataItem) => {
                e.imageBytes = item.imageBytes;
                this.userStore.addResumeDataListItem(e);
                this.userStore.setFilteredResumes([...this.resumeDataItemList()])
                this.childEvent.emit(false);
              }));

        }else if(option.label === 'Download'){
            this.childEvent.emit(true);
            this.subs.push(this.resumeService.dowloadResumePDF(item.userName , item.fileName).subscribe((res : any)=>{
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
            }))
            this.childEvent.emit(false);
        }else if(option.label === 'Delete'){
            this.confirmDeleteDialog(item);
           
        }
       
    }

    confirmDeleteDialog(item : ResumeListDataItem): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {name: 'confirm'},
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result.event === "CONFIRM"){
            this.childEvent.emit(true);
            this.subs.push(this.resumeService.deleteResume(item.id).subscribe(() => {
                let index = this.resumeDataItemList().findIndex(obj => obj.id === item.id)
                this.userStore.removeResumeDataListItem(index);
                this.userStore.setFilteredResumes([...this.resumeDataItemList()]);
                this.childEvent.emit(false);
            }));
          }
        });
      }
  
    showResumeGeneratorHandler($event: any){
        // this.showResumeGenerator = true;
        this.userStore.updateSidebar(true);
        let resumeForm = new Resume();
        this.userStore.updateResumeForm(resumeForm);
        this.userStore.setIsChangeInNewResume(false);
        this.router.navigateByUrl("/user/resumes/resume");
    }

    update($event: any, field_name : string, resume : ResumeListDataItem){
        
        if(field_name == 'PRIMARY_CHANGE'){

            if($event){
                this.resumeService.updateResumePrimaryValue(resume.id, 'true').subscribe(()=>{

                });
            }
            else{
                this.resumeService.updateResumePrimaryValue(resume.id, 'false').subscribe(()=>{

                });
            }
        }
        else if(field_name == 'ACTIVE_CHANGE'){
            if($event){
                this.resumeService.updateResumeStatusValue(resume.id, 'ACTIVE').subscribe(()=>{
                    
                });
            }
            else{
                this.resumeService.updateResumeStatusValue(resume.id, 'IN_ACTIVE').subscribe(()=>{
                    
                });
            }
        }
        else if(field_name == 'PUBLIC_CHANGE'){
            if($event){
                if(resume.access == 'ONLY_EMPLOYER'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PUBLIC_ONLY_EMPLOYER').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PUBLIC_ONLY_EMPLOYER';
                            }
                        })
                    });

                }
                else if(resume.access == 'PRIVATE_ONLY_EMPLOYER'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PUBLIC_ONLY_EMPLOYER').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PUBLIC_ONLY_EMPLOYER';
                            }
                        })
                    });
                }
                else if(resume.access == 'PRIVATE'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PUBLIC').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PUBLIC';
                            }
                        })
                    });
                }
            }
            else{
                if(resume.access == 'PUBLIC_ONLY_EMPLOYER'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PRIVATE_ONLY_EMPLOYER').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PRIVATE_ONLY_EMPLOYER';
                            }
                        })
                    });
                }
                else if(resume.access == 'PUBLIC'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PRIVATE').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PRIVATE';
                            }
                        })
                    });
                }
            }
        }
        else if(field_name == 'ONLY_EMPLOYER_CHANGE'){
            
            if($event){
                if(resume.access == 'PUBLIC'){
                    
                    this.resumeService.updateResumeAccessValue(resume.id, 'PUBLIC_ONLY_EMPLOYER').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PUBLIC_ONLY_EMPLOYER';
                            }
                        })
                    });
                }
                else if(resume.access == 'PRIVATE'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PRIVATE_ONLY_EMPLOYER').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PRIVATE_ONLY_EMPLOYER';
                            }
                        })
                    });
                }
            }
            else{
                if(resume.access == 'PUBLIC_ONLY_EMPLOYER'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PUBLIC').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PUBLIC';
                            }
                        })
                    });
                }
                else if(resume.access == 'PRIVATE_ONLY_EMPLOYER'){
                    this.resumeService.updateResumeAccessValue(resume.id, 'PRIVATE').subscribe(()=>{
                        this.filteredResumes().map((e)=>{
                            if(e.id == resume.id){
                                e.access = 'PRIVATE';
                            }
                        })
                    });
                }
            }
        }
        else if(field_name == 'PRIVATE'){
            if($event){
                this.resumeService.updateResumeAccessValue(resume.id, 'Private').subscribe(()=>{
                    
                });
            }
            else{
                this.resumeService.updateResumeAccessValue(resume.id, '-').subscribe(()=>{
                    
                });
            }
        }
    }

}
