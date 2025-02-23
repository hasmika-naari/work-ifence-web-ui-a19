import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { WINDOW } from '../../../services/window.token';
import { JobOpeningsStoreService } from '../../../services/store/jobs-store.service';
import { IfenceService } from '../../../services/ifence.service';
import { JobFeedItem } from '../../../services/ifence.model';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';

@Component({
    selector: 'app-active-jobs',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule, MatButtonModule,
    MatFormFieldModule, MatCardModule, MatTooltipModule, RouterLink,MessageModule,AvatarModule,
    NgxPaginationModule, MatIconModule, MatProgressBarModule],
    templateUrl: './active-jobs.component.html',
    styleUrls: ['./active-jobs.component.scss']
})
export class ActiveJobsComponent implements OnInit, OnDestroy {

    isToggled = false;
	public page:any = 0;
    public counts = [42, 84, 126];
    public count:any = 42;
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
            this.actionInProgress = true;
            this.subs.push(this.ifenceJobService.getJobsFeeds('Any', 'Any').subscribe((jobsFeed: any) => {
                
                let feed = JSON.parse(jobsFeed.response);
                this.jobFeedStore.updateHomeJobsFeed(feed.rss.jobs.job);
                this.actionInProgress = false;
            }, (error: any) => {
                this.actionInProgress = false;
            }))
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onPageChanged(event: any){
        this.page = event;
        // this.getAllProducts(); 
        // if (isPlatformBrowser(this.platformId)) {
          this.window.scrollTo(0, document.documentElement.clientHeight - 50);
        // } 
      }

    public showResumeOptimizer($event: any){
        this.router.navigateByUrl('/resume-opti-intro');
    }

    public showResumeManager($event: any){
        this.router.navigateByUrl('/resume-manager-intro');
    }

    public showJobApplicationManager($event: any){
        this.router.navigateByUrl('/job-app-manager-intro');
    }

    // convertDateFormat(dateString: string): string {
    //     const [day, month, year] = dateString.split('.');
    //     return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    //   }

    convertDateFormat(dateString: string): string {
        const [day, month, year] = dateString.split('.');
      
        // Create a Date object
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
        // Format the date using toLocaleDateString
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }

    viewJobDetails($event: any, rf: any){
        // this.ifenceFacade.setSelectedJobFeedAction(rf);
        this.router.navigateByUrl('/opening/' + rf.id);
      }
    
      getStartDate(startDate:string){
        let dateArray = startDate.split('/');
    
        return dateArray[0]  + '/' + dateArray[1] + '/' + dateArray[2];
      }
    
      shareOnWhatsApp($event: any, data: any){
        $event.stopPropagation();
      }

      removeFromWishList($event: any, rf: JobFeedItem){
        // this.ifenceFacade.removeFromToWishList(rf);
      }

      saveToWishList($event: any, rf: JobFeedItem){
        // this.ifenceFacade.saveToWishList(rf);
      }

}