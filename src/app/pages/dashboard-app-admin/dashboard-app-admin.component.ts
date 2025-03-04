import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, PLATFORM_ID, Signal, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import * as moment from 'moment';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ResumeService } from 'src/app/services/resume.service';
import { Account, BioProfile, WifRole } from 'src/app/services/profile.model';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';

@Component({
  selector: 'db-app-admin',
  standalone: true,
  imports: [CommonModule ,RouterOutlet, MatCardModule ],
  templateUrl: './dashboard-app-admin.component.html',
  styleUrls: ['./dashboard-app-admin.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line

})
export class DashboardAppAdminComponent implements OnInit, AfterViewInit {

  private static isInitialLoad = true;
 
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  private platformId: object =  inject(PLATFORM_ID);
  private routerService: Router =  inject(Router);
  private router: Router =  inject(Router);
  private userStore: UserStoreService =  inject(UserStoreService);
  private resumeService: ResumeService =  inject(ResumeService);
  private pdfToImageService: PdfToImageService =  inject(PdfToImageService);
  public userRoles: Signal<Array<WifRole>> = this.userStore.getUserRoles();


  isBrowser = false;
  resumeDataItemList: Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
  subs: Array<Subscription> = [];
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  resumes : Array<ResumeListDataItem> = []

  constructor(
    // private dashboardService: DashboardService,
             ) {
    // /**
    //  * Edge wrong drawing fix
    //  * Navigate anywhere and on Promise right back
    //  */
    // if (/Edge/.test(navigator.userAgent)) {
    //   if (DashboardComponent.isInitialLoad) {
    //     this.router.navigate(['/apps/chat']).then(() => {
    //       this.router.navigate(['/']);
    //     });

    //     DashboardComponent.isInitialLoad = false;
    //   }
    // }

     effect(() => {
        let aRoles = this.userRoles();
          this.userStore.updateActiveRole(aRoles[1]);
        });

  }

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  /**
   * Everything implemented here is purely for Demo-Demonstration and can be removed and replaced with your implementation
   */
  ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.isBrowser = true;
      console.log('ITS Browser Running');
    }else{
      console.log('ITS Server Running');
    }

  //   if(this.resumeDataItemList().length == 0){
  //     this.subs.push(this.resumeService.getResumeListByOwnerId(
  //         this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
  //         data.map(async (e : ResumeListDataItem)=>{
  //         await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + e.documentUrl).then((bytes)=>{
  //             e.imageBytes = bytes;
  //             this.resumes = [...this.resumes, e]
  //         })
  //         this.userStore.setResumeDataListItems(this.resumes);
  //         this.userStore.setFilteredResumes([...this.resumes]);
  //         })
  //         }));
  // }
   
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        // //this.sidenavService.setCollapsed(true);
        }, 100);
}

tools = [
  {
    icon: 'assets/img/home/resume_animated.jpg', // Replace with your actual icon path
    title: 'Add Organization',
    description: 'Add Organization and Manage Services',
    route: '/user/org-list/add-org'
  },
  {
    icon: 'assets/img/home/resume_animated.jpg', // Replace with your actual icon path
    title: 'Add User',
    description: 'Add User and Assign Organization',
    route: '/user/user-list/add-user'
  },
  {
    icon: 'assets/jobtrackerai-icon.png', // Replace with your actual icon path
    title: 'Manage Services',
    description: 'Create and Manage Services',
    route: '/user/service-list/service'
  },
  {
    icon: 'assets/jobtrackerai-icon.png', // Replace with your actual icon path
    title: 'Manage Requests',
    description: 'Manage User Requests',
    route: '/user/request-list/service'
  }    
];

stats = [
  {
    title: "Open Requests",
    value: '25',
    sub: '',
    color: '#4285F4',
    icon: 'pi pi-folder-open', // Represents open requests
  },
  {
    title: "Organizations",
    value: '35',
    sub: '',
    color: '#9C27B0',
    icon: 'pi pi-building', // Represents organizations or institutions
  },
  {
    title: 'Registered Users',
    value: '10',
    sub: '',
    color: '#FBBC05',
    icon: 'pi pi-users', // Represents users/people
  },
  {
    title: 'Subscriptions',
    value: '1',
    sub: '',
    color: '#34A853',
    icon: 'pi pi-credit-card', // Represents a subscription or payment
  }
];

goToSelectedPage($event: any, tool: any){
  this.routerService.navigate([tool.route]);
}


}


