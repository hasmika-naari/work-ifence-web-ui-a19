import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Signal, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LanguageSubscribeComponent } from '../../language-subscribe/language-subscribe.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { Category, JobFeedItem } from 'src/app/services/ifence.model';
import { Competitionsorting, MenuListItem, PCategory } from 'src/app/services/bee-compete.model';
import { WorkifenceDataService } from 'src/app/services/bee-compete-data.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { JobOpeningsStoreService } from 'src/app/services/store/jobs-store.service';
import { IfenceService } from 'src/app/services/ifence.service';
import { AppUtilService } from 'src/app/services/app.util.service';
import { WINDOW } from 'src/app/services/window.token';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { JobOpeningsComponent } from './job-openings/job-openings.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconsModule } from 'src/app/shared/icons.module';

export interface Subject {
  title: string;
  description: string;
  courseCount: number;
}


@Component({
  selector: 'latest-openings-page',
  standalone: true,
  imports: [CommonModule, RouterLink,LanguageSubscribeComponent, MatIconModule, MatSidenavModule, IconsModule,
      MatSelectModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule,
      MatButtonModule,JobOpeningsComponent,NgxPaginationModule, MatCardModule, MatProgressBarModule,
      NgOptimizedImage, FooterWorkifenceComponent, HeaderWorkIfenceComponent],
  templateUrl: './latest-openings-page.component.html',
  styleUrls: ['./latest-openings-page.component.scss']
})
export class LatestJobOpeningsPageComponent implements OnInit {
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;
    @ViewChild('jobsStart') jobsStart!: ElementRef;

    isToggled = false;
    public page:any = 0;
    public counts = [100, 200, 300, 400, 500,600, 700, 800, 900, 1000];

    public count:any = 50;
    public viewCol: number = 14.25;
    maxSize = 5;
    autoHide= false;
    private router: Router = inject(Router);
    private jobFeedStore: JobOpeningsStoreService = inject(JobOpeningsStoreService);
    private ifenceJobService: IfenceService = inject(IfenceService);
    private platformId: object =  inject(PLATFORM_ID);
    public actionInProgress: boolean = true;
    activeJobs : Signal<Array<JobFeedItem>> = this.jobFeedStore.getHomeJobsFeed();
    subs: Array<Subscription> = new Array<Subscription>();
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    searchedJobs : Signal<Array<JobFeedItem>> = this.jobFeedStore.getSearchPageJobsFeed();

    browser = false;
    isDesktop = false;
    isMobile = false;
    isTablet = false;

    currentUrl = '';
    hdrContainer = false;
    filterForm!: FormGroup;

     subjects: Subject[] = [
        { title: 'Computer Science', description: '', courseCount: 28 },
        { title: 'Business', description: '', courseCount: 15 },
        { title: 'Health & Medicine', description: '', courseCount: 12 },
        { title: 'Data Science', description: '', courseCount: 10 },
        { title: 'Personal Development', description: '', courseCount: 8 },
        { title: 'Mathematics', description: '', courseCount: 6 },
        { title: 'Social Sciences', description: '', courseCount: 6 },
        { title: 'Humanities', description: '', courseCount: 5 },
        { title: 'Education & Teaching', description: '', courseCount: 4 },
        { title: 'Engineering', description: '', courseCount: 4 },
        { title: 'Language Learning', description: '', courseCount: 4 },
        { title: 'Science', description: '', courseCount: 3 },
        { title: 'Arts & Design', description: '', courseCount: 3 }
      ];

   constructor(
     @Inject(WINDOW) private window: Window,
     public themeService: ThemeCustomizerService,
     private fb: FormBuilder,
     private location: Location
   ) {
          this.browser = isPlatformBrowser(this.platformId);
          this.themeService.isToggled$.subscribe(isToggled => {
              this.isToggled = isToggled;
          });
     }

  ngOnInit(): void {
    this.fetchData();
    if(this.browser){
      if(this.deviceService.isDesktop()){
        this.isDesktop = true;
        this.isMobile = false;
        this.isTablet = false;
      }else if(this.deviceService.isMobile()){
        this.isMobile = true;
        this.isDesktop = false;
        this.isTablet = false;
      }else if(this.deviceService.isTablet()){
        this.isTablet = true;
        this.isMobile = false;
        this.isDesktop = false;
      }

        this.filterForm = this.fb.group({
          title: [''],
          provider: [''],
          subject: [''],
          mode: [''],
          cost: [''],
          certificate: [''],
          platform: ['']
        });

        this.actionInProgress = true;
        this.subs.push(this.ifenceJobService.getJobsFeeds('Any', 'Any').subscribe((jobsFeed: any) => {
            
            let feed = JSON.parse(jobsFeed.response);
            this.jobFeedStore.updateSearchJobFeed(feed.rss.jobs.job);
            this.actionInProgress = false;
        }, (error: any) => {
            this.actionInProgress = false;
        }))
    
    } 
  
  }

  getTitleClass(){
    let result = 'hide-on-init page-title-with-transparent-area page-title-style-course-details-desktop';

    if(!this.isDesktop){
      result = 'hide-on-init page-title-with-transparent-area page-title-style-course-details-mobile';
    }

    return result;
  }

  fetchData(): void{
    // this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
    //   this.categories = [...categories];
    //   /// divide into parentList
    //   // Group categories by parent and map them to the desired format
    //   this.pCategories = [..._.map(
    //       _.groupBy(categories, 'parent'),
    //       (categories, parent) => ({ parent, categories }))];
    // });
 
  }

  filterJobs($event: any, filterSidenav: any){
    // const filters = this.jobFeedStore.getFilterForm().value;
    // if (filterSidenav) filterSidenav.close();

    // const noFilters = Object.values(filters).every(val =>
    //   val === null ||
    //   val === undefined ||
    //   (typeof val === 'string' && val.trim() === '')
    // );

    // if (noFilters) {
    //   this.jobFeedStore.resetJobsFeed();
    // } else {
    //   this.jobFeedStore.filterJobs(filters);
    // }
  }

   public onPageChanged(event: any){
        this.page = event;
         window.scrollTo(0, document.documentElement.clientHeight - 150);
          const element = document.getElementById('jobsStart');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
   }

    convertDateFormat(dateString: string): string {
        const [day, month, year] = dateString.split('.');
        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    }
    viewJobDetails($event: any, rf: any){
        // this.ifenceFacade.setSelectedJobFeedAction(rf);
        this.router.navigateByUrl('/central/job-central/opening/' + rf.id);
      }

    removeFromWishList($event: any, rf: JobFeedItem){
        // this.ifenceFacade.removeFromToWishList(rf);
      }

      saveToWishList($event: any, rf: JobFeedItem){
        // this.ifenceFacade.saveToWishList(rf);
      }

      shareOnWhatsApp($event: any, data: any){
        $event.stopPropagation();
      }

      goBack(event: Event): void {
        event.preventDefault();
        this.location.back();
      }

}
