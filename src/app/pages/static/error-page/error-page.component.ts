import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { Category, PCategory } from '@app/services/bee-compete.model';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WorkifenceDataService } from '@app/services/bee-compete-data.service';
import { LanguageSubscribeComponent } from '@app/components/shared/language-subscribe/language-subscribe.component';
import { FooterComponent } from '@app/components/shared/footer-bee-style-one/footer.component';
import { HeaderWorkIfenceComponent } from '@app/components/shared/header-wifence/header-wifence.component';

@Component({
    selector: 'app-error-page',
    standalone: true,
    imports: [CommonModule, RouterLink,LanguageSubscribeComponent,
        NgOptimizedImage,FooterComponent, HeaderWorkIfenceComponent],
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

    isToggled = false;
    categories: Array<Category> = new Array<Category>();
    pCategories: Array<PCategory> = new Array<PCategory>();
	private dealsService: WorkifenceDataService= inject(WorkifenceDataService);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);

    private platformId: object =  inject(PLATFORM_ID);

    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;

    constructor(
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
        this.fetchData();

        if(isPlatformBrowser(this.platformId)){
            this.browser = true;
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

    fetchData(): void{

        // this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories: Array<Category>) => {
        //   this.categories = [...categories];
        //   /// divide into parentList
        //   // Group categories by parent and map them to the desired format
        //   this.pCategories = [..._.map(
        //       _.groupBy(categories, 'parent'),
        //       (categories, parent) => ({ parent, categories }))];
        // });
     
    }

}