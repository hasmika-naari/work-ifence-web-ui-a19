import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemeCustomizerService } from '../../../services/theme-customizer/theme-customizer.service';
import { WINDOW } from '../../../services/window.token';
import AOS from 'aos';

@Component({
    selector: 'app-popular-features',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, CarouselModule, NgxPaginationModule],
    templateUrl: './popular-features.component.html',
    styleUrls: ['./popular-features.component.scss']
})
export class PopularFeaturesComponent implements OnInit, AfterViewInit {

    isToggled = false;
	public page:any = 0;
    public counts = [42, 84, 126];
    public count:any = 42;
    public viewCol: number = 14.25;
    maxSize = 5;
    autoHide= false;
    private router: Router = inject(Router);
    
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

    ngOnInit(): void {}

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

    ngAfterViewInit() {
        // AOS.refresh(); // Ensures AOS scans new elements
        AOS.init();
    }

}