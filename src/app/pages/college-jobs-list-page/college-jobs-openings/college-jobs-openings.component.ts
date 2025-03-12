import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, Signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { CompetationDataItem } from 'src/app/services/bee-compete.model';
import { CollegeJobItem, JobFeedItem } from 'src/app/services/ifence.model';
import { IfenceService } from 'src/app/services/ifence.service';
import { JobOpeningsStoreService } from 'src/app/services/store/jobs-store.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { WINDOW } from 'src/app/services/window.token';

@Component({
    selector: 'app-college-jobs-openings',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule, MatButtonModule,
            MatIconModule, MatProgressBarModule,
            NgxPaginationModule, MatCardModule, RouterLink],
    templateUrl: './college-jobs-openings.component.html',
    styleUrls: ['./college-jobs-openings.component.scss']
})
export class CollegeJobsOpeningsComponent implements OnInit {

    @Input() isMobile: boolean =  false;

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
    collegeJobs : Signal<Array<CollegeJobItem>> = this.jobFeedStore.getCollegeJobs();
    
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
            this.subs.push(this.ifenceJobService.getCollegeJobsFeed().subscribe((jobsFeed: any) => {
                
                this.jobFeedStore.updateCollegeJobsFeed(jobsFeed);
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
          this.window.scrollTo(0, document.documentElement.clientHeight - 800);
        // } 
      }

    convertDateFormat(dateString: string): string {
        const [year, month, day] = dateString.split('-');
        
        // Create a Date object
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Format the date using toLocaleDateString
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
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