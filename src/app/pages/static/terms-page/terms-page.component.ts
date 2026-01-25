import { isPlatformBrowser, Location } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { Category } from 'src/app/services/ifence.model';
import { PCategory } from 'src/app/services/bee-compete.model';
import { WorkifenceDataService } from 'src/app/services/bee-compete-data.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [RouterLink, FooterWorkifenceComponent, HeaderWorkIfenceComponent, IconsModule],
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss']
})
export class TermsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  isToggled = false;
  public isSticky: boolean = false;
  private observer!: IntersectionObserver;
  @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
  @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;

  categories: Array<Category> = new Array<Category>();
  pCategories: Array<PCategory> = new Array<PCategory>();
  private location: Location = inject(Location);
  private router: Router = inject(Router);
  
  private dealsService: WorkifenceDataService= inject(WorkifenceDataService);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  public themeService: ThemeCustomizerService =  inject(ThemeCustomizerService);
  private platformId: object =  inject(PLATFORM_ID);

  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  constructor() {
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

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.sentinel && this.pageSectionRef) {
      this.observer = new IntersectionObserver(entries => {
        this.isSticky = !entries[0].isIntersecting;
      }, { root: this.pageSectionRef.nativeElement });
      this.observer.observe(this.sentinel.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  backToHomePage($event: any){
    this.location.back();
  }

  goBack($event: any){
    $event.preventDefault();
    this.location.back();
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
}
