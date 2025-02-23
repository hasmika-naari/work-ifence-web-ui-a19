import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { FooterComponent } from '@app/components/general/footer/footer.component';
import { WorkIfenceDataService } from '@app/services/work-ifence-data.service';
import { Category, PCategory } from '@app/services/deals.model';
import * as _ from 'lodash';
import { LanguageSubscribeComponent } from '@app/components/general/language-subscribe/language-subscribe.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HeaderStyleComponent } from '../work-ifence-home/header/header.component';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterLink,LanguageSubscribeComponent,
      NgOptimizedImage, HeaderStyleComponent,FooterComponent],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent implements OnInit {
  isToggled = false;
  categories: Array<Category> = new Array<Category>();
  pCategories: Array<PCategory> = new Array<PCategory>();
	private dealsService: WorkIfenceDataService= inject(WorkIfenceDataService);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  public themeService: ThemeCustomizerService=  inject(ThemeCustomizerService);
  private platformId: object =  inject(PLATFORM_ID);

  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  constructor( ) {
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
    this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
      this.categories = [...categories];
      /// divide into parentList
      // Group categories by parent and map them to the desired format
      this.pCategories = [..._.map(
          _.groupBy(categories, 'parent'),
          (categories, parent) => ({ parent, categories }))];
    });
 
}

}
