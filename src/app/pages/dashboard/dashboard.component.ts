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
  selector: 'fury-dashboard',
  standalone: true,
  imports: [CommonModule ,RouterOutlet, MatCardModule ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line

})
export class DashboardComponent implements OnInit, AfterViewInit {

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


  isBrowser = false;
  resumeDataItemList: Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
  subs: Array<Subscription> = [];
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  resumes : Array<ResumeListDataItem> = []
  public userRoles: Signal<Array<WifRole>> = this.userStore.getUserRoles();




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
      this.userStore.updateActiveRole(aRoles[0]);
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
    title: 'Build Your Resume',
    description: 'Create the perfect resume to land your dream job',
    route: '/user/resumes/resume'
  },
  {
    icon: 'assets/img/home/resume_animated.jpg', // Replace with your actual icon path
    title: 'Create Job Application',
    description: 'Create Job Application to Track',
    route: '/user/job-applications/application'
  },
  {
    icon: 'assets/jobtrackerai-icon.png', // Replace with your actual icon path
    title: 'Manage Resumes',
    description: 'Organize and track all Resumes',
    route: '/user/resumes'
  },
  {
    icon: 'assets/jobtrackerai-icon.png', // Replace with your actual icon path
    title: 'Manage Job Applications',
    description: 'Organize and track all your job applications in one place',
    route: '/user/job-applications'
  }
];



stats = [
  {
    title: 'Resumes Created',
    value: '25',
    sub: '',
    color: '#4285F4',
    icon: 'pi pi-file',
  },
  {
    title: 'Applications Sent',
    value: '35',
    sub: '',
    color : '#9C27B0',
    icon: 'pi pi-send',
  },
  {
    title: 'Ongoing Applications',
    value: '10',
    sub: '',
    color: '#FBBC05',
    icon: 'pi pi-clock',
  },
  {
    title: 'Offered',
    value : '1',
    sub : '',
    color : '#34A853',
    icon : 'pi pi-thumbs-up'
  },
  {
    title: 'Rejected Applications',
    value: '5',
    sub: '',
    color: '#EA4335',
    icon: 'pi pi-thumbs-down',
  },
];



goToSelectedPage($event: any, tool: any){
  this.routerService.navigate([tool.route]);
}


}


