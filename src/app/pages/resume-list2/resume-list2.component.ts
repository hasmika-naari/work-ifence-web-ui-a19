import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { FilterService, SelectItem } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { ResumeService } from 'src/app/services/resume.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account } from 'src/app/services/profile.model';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { UserResume } from 'src/app/services/store/user-store';
import { Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JobResume, JobResumeRequest, Resume } from 'src/app/services/resume.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../resume-form3/confirm-dialog/confirm-dialog.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { WorkIfenceDataService } from 'src/app/services/work-ifence-data.service';
import { Templatesv2Service } from 'src/app/services/shared/templatev2.service';
import { DrawerModule } from 'primeng/drawer';
import { PreviewResumeComponent } from '../resume-form3/preview-resume/preview-resume.component';
import { ResumeLimitService } from 'src/app/resume-portal/services/resume-limit.service';
import { resolveResumePreviewUrl } from 'src/app/utils/resume-preview-url';

@Component({
    selector: 'resume-list2',
    templateUrl: './resume-list2.component.html',
    styleUrls: ['./resume-list2.component.scss'],
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule,
        FormsModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        SelectModule,
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
        MatCheckbox,
        MatCheckboxModule,
        DrawerModule,
        PreviewResumeComponent
    ]
})
export class ResumeList2Component implements OnInit, OnChanges, OnDestroy {


 
    private userStore: UserStoreService = inject(UserStoreService);
    private appUtilService: AppUtilService = inject(AppUtilService);
    private resumeLimit: ResumeLimitService = inject(ResumeLimitService);
    
    @Input() isActionInProgress: boolean = true; 
    @Output() childEvent = new EventEmitter<boolean>();
    resumes: ResumeListDataItem[] = [];
    userAccount: Signal<Account> = this.userStore.getUserAccount();
    selectedResumeListItem : Signal<ResumeListDataItem> = this.userStore.getSelectedResumeListItem();
    resumeDataItemList: Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
    filteredResumes: Signal<ResumeListDataItem[]> = this.userStore.getFilteredResumes();

    pdfBlob! : Blob
    previewDrawerOpen = false;
    previewTemplateName = 'TEMPLATE_1';
    previewResumeItem: ResumeListDataItem | null = null;
    readonly isResumeLimitReached = this.resumeLimit.isAtLimit;

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
    private failedResumeImageKeys = new Set<string>();

    constructor(
        private resumeService: ResumeService,
        private router : Router, 
        private wifenceDataService: WorkIfenceDataService,
        public templateService : Templatesv2Service,
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

        private getResumeImageKey(resume: ResumeListDataItem): string {
            return resume.id || resume.code || resume.fileName || resume.title;
        }

        getResumeImageUrl(resume: ResumeListDataItem): string {
            const imageUrl = Array.isArray(resume.imageBytes) ? resume.imageBytes[0] : '';
                    return typeof imageUrl === 'string' ? imageUrl.trim() : '';
        }

        shouldShowResumeImage(resume: ResumeListDataItem): boolean {
            const imageUrl = this.getResumeImageUrl(resume);
            return imageUrl.length > 0 && !this.failedResumeImageKeys.has(this.getResumeImageKey(resume));
        }

        handleResumeImageError(resume: ResumeListDataItem): void {
            this.failedResumeImageKeys.add(this.getResumeImageKey(resume));
        }

        getResumeImageFallbackText(resume: ResumeListDataItem): string {
            const imageUrl = resume.documentUrl || resume.fileName;

            if (!imageUrl) {
                return 'Preview unavailable';
            }

            if (imageUrl.length <= 180) {
                return imageUrl;
            }

            return `${imageUrl.slice(0, 177)}...`;
        }

        getResumeCategoryClassSuffix(category: unknown): string {
                const normalizedCategory = typeof category === 'string' ? category.trim().toLowerCase() : '';
                return normalizedCategory || 'uncategorized';
        }

        getResumeCategoryLabel(category: unknown): string {
                const normalizedCategory = typeof category === 'string' ? category.trim() : '';
                return normalizedCategory || 'Uncategorized';
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


    addToWishList($event: any, resume: ResumeListDataItem){

    }

    selectResume($event: any, resume: ResumeListDataItem){
        resume.selected =  true;
    }

    unSelectResume($event: any, resume: ResumeListDataItem){
        resume.selected =  false;
    }

    getUnHideElements(resumeForm : Resume){
                // Create a deep copy of the resumeForm
                const resumeCopy: Resume = JSON.parse(JSON.stringify(resumeForm));

                // For each section, filter out items where isHideSelected == true (if present)
                if (resumeCopy.sections && Array.isArray(resumeCopy.sections)) {
                    resumeCopy.sections = resumeCopy.sections.map(section => {
                        if (Array.isArray(section.items)) {
                            return {
                                ...section,
                                items: section.items.filter(item => !item.data?.isHideSelected)
                            };
                        }
                        return section;
                    });
                }
                return resumeCopy;
            }
    

    private downloadBlobFile(blob: Blob, fileName: string) {
        const dataUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = dataUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(dataUrl);
    }

    private downloadFileFromUrl(fileUrl: string, fileName: string) {
        const link = document.createElement('a');

        link.href = fileUrl;
        link.download = fileName;
        link.rel = 'noopener';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private getResumeDocumentDownloadUrl(item: ResumeListDataItem): string | null {
        return resolveResumePreviewUrl(item.documentUrl);
    }

    private getFileExtension(fileName: string | null | undefined): string {
        const normalizedFileName = (fileName || '').trim();
        const extensionIndex = normalizedFileName.lastIndexOf('.');

        if (extensionIndex === -1) {
            return '';
        }

        return normalizedFileName.substring(extensionIndex + 1).toLowerCase();
    }

    private getDocumentFileName(item: ResumeListDataItem): string {
        const documentUrl = (item.documentUrl || '').trim();
        const documentFileName = documentUrl.split('/').filter(Boolean).pop();

        return documentFileName || item.fileName;
    }

    private parseResumeJson(item: ResumeListDataItem): Resume | null {
        if (!item?.resumeJson) {
            return null;
        }

        try {
            return JSON.parse(item.resumeJson) as Resume;
        } catch (error) {
            console.error('Failed to parse resume JSON for preview drawer', error);
            return null;
        }
    }

    openDownloadPreview(item: ResumeListDataItem): void {
        const resume = this.parseResumeJson(item);

        if (!resume) {
            return;
        }

        this.userStore.setResumeForm(resume);
        this.userStore.updateSelectedResumeListItem(item);
        this.previewResumeItem = item;
        this.previewTemplateName = resume.template_details?.template_name || 'TEMPLATE_1';
        this.previewDrawerOpen = true;
    }

    onResumeMenuDownloadPdf(event: Event, item: ResumeListDataItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.downloadResumePdf(item);
    }

    onResumeMenuDownloadDoc(event: Event, item: ResumeListDataItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.downloadResumeDoc(item);
    }

    onResumeMenuPreview(event: Event, item: ResumeListDataItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.openDownloadPreview(item);
    }

    closePreview(): void {
        this.previewDrawerOpen = false;
        this.previewResumeItem = null;
    }

    onPreviewDownload(format: 'pdf' | 'word'): void {
        if (!this.previewResumeItem) {
            return;
        }

        if (format === 'word') {
            this.downloadResumeDoc(this.previewResumeItem);
            return;
        }

        this.downloadResumePdf(this.previewResumeItem);
    }

    downloadResumePdf(item: ResumeListDataItem) {
        this.childEvent.emit(true);
        this.subs.push(this.resumeService.dowloadResumePDF(item.userName , item.fileName).subscribe({
            next: (res : any) => {
                const blob = new Blob([res], { type: 'application/pdf' });
                this.downloadBlobFile(blob, item.fileName);
                this.childEvent.emit(false);
            },
            error: () => {
                this.childEvent.emit(false);
            }
        }));
    }

    downloadResumeDoc(item: ResumeListDataItem) {
        this.childEvent.emit(true);
        let fileName = item.fileName;
        if (!fileName) {
            this.childEvent.emit(false);
            console.error('No file name found for DOCX download.');
            return;
        }
        // Ensure we are requesting a .docx file
        const docxFileName = fileName.replace(/\.[^.]+$/, '') + '.docx';
        this.subs.push(this.resumeService.dowloadResumeDOC(item.userName, docxFileName).subscribe({
            next: (res: any) => {
                const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                this.downloadBlobFile(blob, docxFileName);
                this.childEvent.emit(false);
            },
            error: (err) => {
                console.error('DOCX download failed, trying .doc fallback', err);
                // Try .doc fallback
                const docFileName = fileName.replace(/\.[^.]+$/, '') + '.doc';
                this.resumeService.dowloadResumeDOC(item.userName, docFileName).subscribe({
                    next: (res: any) => {
                        const blob = new Blob([res], { type: 'application/msword' });
                        this.downloadBlobFile(blob, docFileName);
                        this.childEvent.emit(false);
                    },
                    error: (fallbackErr) => {
                        console.error('DOC download failed', fallbackErr);
                        this.childEvent.emit(false);
                    }
                });
            }
        }));
    }



    menuActionHandler($event: any, item: ResumeListDataItem, option: any){
        console.log(item);
        if(option.label === 'Edit'){
            
                        if(item && item.resumeJson) {
                                let resumeForm: Resume = JSON.parse(item.resumeJson);
                                // Set isDefaultData = false for CONTACT section if present
                                const contactSection = resumeForm.sections?.find(s => s.section === 'CONTACT');
                                if (contactSection && Array.isArray(contactSection.items) && contactSection.items[0]?.data) {
                                    contactSection.items[0].data.isDefaultData = false;
                                }
                                this.userStore.setResumeForm(resumeForm);
                                console.log(resumeForm, item);
                                this.userStore.updateSelectedResumeListItem(item);
                                // //this.sidenavService.setCollapsed(true);
                                // this.sidenavService.setExpanded(false);
                                this.router.navigateByUrl('/user/resumes/resume');
                        }
        }else if(option.label === 'Duplicate'){
            const limit = this.resumeLimit.canCreateResume();
            if (!limit.allowed) {
                this.resumeLimit.handleDenied(limit, { action: 'duplicate', returnUrl: this.router.url });
                return;
            }

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
                                this.resumeLimit.syncResumeCount(this.resumeDataItemList().length);
                this.childEvent.emit(false);
              }));

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
                                this.resumeLimit.syncResumeCount(this.resumeDataItemList().length);
                this.childEvent.emit(false);
            }));
          }
        });
      }
  
    showResumeGeneratorHandler($event: any){
        // this.showResumeGenerator = true;
        this.userStore.updateSidebar(true);
        let resumeForm = new Resume();
        this.userStore.setResumeForm(resumeForm);
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
