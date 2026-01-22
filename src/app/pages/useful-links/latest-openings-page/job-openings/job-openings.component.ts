import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, Signal, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { CompetationDataItem } from 'src/app/services/bee-compete.model';
import { JobFeedItem } from 'src/app/services/ifence.model';
import { IfenceService } from 'src/app/services/ifence.service';
import { JobOpeningsStoreService } from 'src/app/services/store/jobs-store.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { WINDOW } from 'src/app/services/window.token';

@Component({
    selector: 'app-job-openings',
    standalone: true,
    imports: [NgOptimizedImage, CarouselModule, MatButtonModule, MatIconModule, MatProgressBarModule, NgxPaginationModule, MatCardModule, RouterLink],
    templateUrl: './job-openings.component.html',
    styleUrls: ['./job-openings.component.scss']
})
export class JobOpeningsComponent implements OnInit {

    @Input() isMobile: boolean =  false;
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    isToggled = false;
	public page:any = 0;
    public counts = [100, 200, 300, 400, 500,600, 700, 800, 900, 1000];
    public count:any = 50;
    public viewCol: number = 14.25;
    maxSize = 4;
    autoHide= false;
    browser = false;
    private platformId: object =  inject(PLATFORM_ID);
    public competitions: Array<CompetationDataItem> = new Array<CompetationDataItem>();
    private router: Router = inject(Router);

    private ifenceJobService: IfenceService = inject(IfenceService);
    private jobFeedStore: JobOpeningsStoreService = inject(JobOpeningsStoreService);
    public actionInProgress: boolean = true;
    subs: Array<Subscription> = new Array<Subscription>();
    searchedJobs : Signal<Array<JobFeedItem>> = this.jobFeedStore.getSearchPageJobsFeed();
    
    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {

        if(isPlatformBrowser(this.platformId)){
            this.browser = true;

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

    // for tab click event
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    public onPageChanged(event: any){
        this.page = event;
        // this.getAllProducts(); 
        // if (isPlatformBrowser(this.platformId)) {
           this.scrollContainer.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
        // } 
      }

    convertDateFormat(dateString: string): string {
        const [day, month, year] = dateString.split('.');
        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    }
    viewJobDetails($event: any, rf: any){
        // this.ifenceFacade.setSelectedJobFeedAction(rf);
        this.router.navigateByUrl('/opening/' + rf.id);
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

}