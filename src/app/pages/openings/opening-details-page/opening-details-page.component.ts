import { CommonModule, Location, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Meta, Title } from '@angular/platform-browser';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { Category, JobFeedItem } from 'src/app/services/ifence.model';
import { CompetationDataItem, PCategory } from 'src/app/services/bee-compete.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { WorkifenceDataService } from 'src/app/services/bee-compete-data.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { IfenceService } from 'src/app/services/ifence.service';
import { Subscription } from 'rxjs';
import { JobOpeningsStoreService } from 'src/app/services/store/jobs-store.service';
import { WINDOW } from 'src/app/services/window.token';

@Component({
    selector: 'app-opening-details-page',
    standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage, HeaderWorkIfenceComponent,FooterWorkifenceComponent,
    CarouselModule,MatButtonModule, MatChipsModule, MatIconModule, 
    MatMenuModule, MatCardModule, MatProgressBarModule],
    templateUrl: './opening-details-page.component.html',
    styleUrls: ['./opening-details-page.component.scss']
})
export class OpeningDetailsPageComponent implements OnInit {

    isToggled = false;
    categories: Array<Category> = new Array<Category>();
    pCategories: Array<PCategory> = new Array<PCategory>();
    selectedCompetation: CompetationDataItem = new CompetationDataItem();
    relatedCompetation: Array<CompetationDataItem> = new Array<CompetationDataItem>();

    selectedJob: JobFeedItem = new JobFeedItem();


    private appService: AppUtilService =  inject(AppUtilService);

    private dealsService: WorkifenceDataService= inject(WorkifenceDataService);
    private platformId: object =  inject(PLATFORM_ID);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private location: Location =  inject(Location);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private ifenceJobService: IfenceService = inject(IfenceService);
    subs: Array<Subscription> = new Array<Subscription>();
   

    private meta:Meta = inject(Meta);
    private title:Title = inject(Title);
    JobId: any = '';
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    public actionInProgress: boolean = true;


    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

        if(isPlatformServer(this.platformId)){
            console.log('isPlatformServer');
          }

          if(isPlatformBrowser(this.platformId)){
            console.log('isPlatformBrowser');
          }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        

        if(isPlatformBrowser(this.platformId)){
          this.browser = true;
          this.JobId = this.route.snapshot.params['id'];

          this.fetchData(this.JobId);

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
      }
    }

    // for tab click event
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    coursesSlides: OwlOptions = {
      loop: false,
      nav: true,
      dots: true,
      autoplayHoverPause: true,
      autoplay: true,
      margin: 30,
      navText: [
        "<i class='bx bx-left-arrow-alt'></i>",
        "<i class='bx bx-right-arrow-alt'></i>"
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        1200: {
          items: 3,
        }
      }
      }

    detailsImageSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
        items: 1,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		]
    }


    fetchData(competationId: string): void{

      this.subs.push(this.ifenceJobService.getJobsFeeds('Any', 'Any').subscribe((jobsFeed: any) => {
          let feed = JSON.parse(jobsFeed.response);
          let jobs:Array<any> = feed.rss.jobs.job?feed.rss.jobs.job:[];
          let jobSelected = jobs.filter((j: any) => 
            {
              if(+j.id === +this.JobId){
                return true;
              }else{
                return false;
              }
            });
          
          if(jobSelected && jobSelected.length > 0){
            this.selectedJob = jobSelected[0];
          }
          this.updateMetaTags();
          // this.jobFeedStore.updateHomeJobsFeed(feed.rss.jobs.job);
      }))

        // this.dealsService.getCompetationDetailsById(competationId, this.platformId).subscribe((comp) => {
        //     this.selectedCompetation = _.cloneDeep(comp[0]);


            // this.dealsService.getCompetitionsByCountryAndCategory(this.selectedCompetation.country, 
            //     this.selectedCompetation.ctegoryId, this.platformId).subscribe((comps) => {
            //   this.relatedCompetation = [...comps.filter((rd: CompetationDataItem) => +rd.id !== +this.selectedCompetation.id)];
            //   this.relatedCompetation = [...this.relatedCompetation.splice(this.relatedCompetation.length < 10?this.relatedCompetation.length:10)];
            //   // console.log("Related Deals: " + this.relatedDeals);
            // })

        // });
        // this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
        //   this.categories = [...categories];
        //   /// divide into parentList
        //   // Group categories by parent and map them to the desired format
        //   this.pCategories = [..._.map(
        //       _.groupBy(categories, 'parent'),
        //       (categories, parent) => ({ parent, categories }))];
        // });
     
    }


    updateMetaTags(){

      this.title.setTitle(this.selectedJob.name);
      this.selectedJob.description?this.meta.updateTag({property:"description",content:this.selectedJob.description}):'';
   
      // console.log('SERVER: ' + selectedDealTitle);
      this.selectedJob.name?this.meta.updateTag({property:"og:title",content:this.selectedJob.name}):'';
      this.selectedJob.description?this.meta.updateTag({property:"og:description",content:this.selectedJob.description}):'';
     
      let baseUrl: string = '';

      // this.selectedCompetation.imageUrl?this.meta.updateTag({property:"og:image",content: baseUrl + this.selectedCompetation.imageUrl}):'';
     
      this.selectedJob.id?this.meta.updateTag({property:"og:url",content: "https://Workifence.com/opening/" + this.selectedJob.id}):'';
  
      this.selectedJob.name?this.meta.updateTag({name:"twitter:title",content:this.selectedJob.name}):'';
      this.selectedJob.description?this.meta.updateTag({name:"twitter:description",content:this.selectedJob.description}):'';
      // this.selectedCompetation.imageUrl?this.meta.updateTag({name:"twitter:image",content: baseUrl + this.selectedCompetation.imageUrl}):'';
      this.selectedJob.id?this.meta.updateTag({name:"twitter:url",content: "https://Workifence.com/opening/" + this.selectedJob.id}):'';
    }

    convertDateFormat(dateString: string): string {
      const [day, month, year] = dateString.split('.');
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    }

    gotoJobSiteLink($event: any, selectedJob: JobFeedItem){
      this.window.open(selectedJob.link);
    }

    
  gotToShop(dealUrl: any){
    this.window.open(dealUrl);
  }

  shareOnWhatsApp($event:any, selectedCompItem: JobFeedItem){
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedCompItem);
  }

  backToHomePage($event: any){
    this.location.back();
  }
}
