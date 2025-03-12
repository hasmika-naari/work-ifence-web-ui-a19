import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
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
import { NgxPaginationModule } from 'ngx-pagination';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CollegeJobsOpeningsComponent } from './college-jobs-openings/college-jobs-openings.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { CompetationDataItem, Competitionsorting, MenuListItem, PCategory } from 'src/app/services/bee-compete.model';
import { Category, JobFeedItem } from 'src/app/services/ifence.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { WorkifenceDataService } from 'src/app/services/bee-compete-data.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { IfenceService } from 'src/app/services/ifence.service';
import { JobOpeningsStoreService } from 'src/app/services/store/jobs-store.service';
import { WINDOW } from 'src/app/services/window.token';

@Component({
    selector: 'app-college-jobs-list',
    standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,NgxPaginationModule,
     NgOptimizedImage, HeaderWorkIfenceComponent,FooterWorkifenceComponent,CollegeJobsOpeningsComponent,
    CarouselModule,MatButtonModule, MatChipsModule, MatIconModule, 
    MatMenuModule,MatCardModule, MatProgressBarModule],
    templateUrl: './college-jobs-list-page.component.html',
    styleUrls: ['./college-jobs-list-page.component.scss']
})
export class CollegeJobsListPageComponent implements OnInit, OnDestroy {

  public page:any = 0;
  public counts = [42, 84, 126];
  public count:any = 42;
  public viewCol: number = 14.25;
  maxSize = 5;
  autoHide= false;
  country: any = 'usa';
  selectedSorting: Competitionsorting = {title: 'Default', isSelected: true};
  public sortings = [
    {title: 'Default', isSelected: true},
    {title: 'Latest First', isSelected: false},
    {title: 'Oldest First', isSelected: false}
    ];

    menuList: Array<MenuListItem> = [
      {
        id: '1',
        parent: 'Features',
        menuItems: [
          {
            id: '1',
            title: 'AI Resume Optimizer',
            count: '31',
            code: 'AIRESUME',
            status: 'active',
            isSelected: false
          },
          {
            id: '2',
            title: 'Resume Manager',
            count: '40',
            code: 'RESUME-OPTI',
            status: 'active',
            isSelected: false
          },
          {
            id: '3',
            title: 'JOB Application Manager',
            count: '31',
            code: 'JOB-MANAGER',
            status: 'active',
            isSelected: false
          }
        ]
      },
      {
        id: '2',
        parent: 'Our Dashboard',
        menuItems:[]
      },
      {
        id: '3',
        parent: 'Resources',
        menuItems: []
      },
      {
        id: '4',
        parent: 'Trends',
        menuItems: []
      }
    ];

    isToggled = false;
    categories: Array<Category> = new Array<Category>();
    pCategories: Array<PCategory> = new Array<PCategory>();
    selectedCategory: Array<Category> = new Array<Category>();
    Competitions: Array<CompetationDataItem> = new Array<CompetationDataItem>();
    sortedCompetitions: Array<CompetationDataItem> = new Array<CompetationDataItem>();
    private appService: AppUtilService =  inject(AppUtilService);
    private location: Location =  inject(Location);

    private dealsService: WorkifenceDataService= inject(WorkifenceDataService);
    private platformId: object =  inject(PLATFORM_ID);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
    private ifenceJobService: IfenceService = inject(IfenceService);
    private jobFeedStore: JobOpeningsStoreService = inject(JobOpeningsStoreService);

    private meta:Meta = inject(Meta);
    private title:Title = inject(Title);
    public actionInProgress: boolean = true;
    
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    browser = false;
    currentUrl = '';
    subs:Array<Subscription> = new Array<Subscription>();


    constructor(
        @Inject(WINDOW) private window: Window,
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });

        if(isPlatformServer(this.platformId)){
            ////console.log('isPlatformServer');
          }

          if(isPlatformBrowser(this.platformId)){
            ////console.log('isPlatformBrowser');
          }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnDestroy(): void {
        
    }

    backToHomePage($event: any){
      this.location.back();
    }

    ngOnInit(): void {

   
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


    fetchData(category: string): void{


      // if(!category || category === 'All'){
      //   this.dealsService.getCompetitionsByCountry('usa', this.platformId).subscribe((comps) => {
      //     this.Competitions = _.cloneDeep(comps);
      //     this.sortedCompetitions =  _.cloneDeep(comps);
      //   });
      // }else if((category && category !== 'All')){
      //   this.dealsService.getCompetitionsByCountryAndCategory('usa', category, this.platformId ).subscribe((deals) => {
      //     this.Competitions = _.cloneDeep(deals);
      //     this.sortedCompetitions =  _.cloneDeep(deals);

      //   });
      // }
      
        // this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
        //   this.categories = [...categories];
        //     /// divide into parentList
        //   // Group categories by parent and map them to the desired format
        //   if(category === 'All'){
        //     let cat: Category = new Category();
        //     cat.code = "All",
        //     cat.country = this.country,
        //     cat.description = '';
        //     cat.title = 'All Deals',
        //     cat.subTitle = 'All Deals'
        //     this.selectedCategory.push(cat);
        //   }else{
        //     this.selectedCategory = this.categories.filter((cat) => cat.code === category);
        //   }

        //     this.loadDealPageBreadgrumText(this.selectedCategory[0]);

        

        //   this.pCategories = [..._.map(
        //       _.groupBy(categories, 'parent'),
        //       (categories, parent) => ({ parent, categories }))];
        // });

       
     
    }

    loadDealPageBreadgrumText(category: Category){
      let selType = ''; 
     
      //   let selectedDealTitle =  ' 🔥 Work ifence - ' +  category?category.title  + ' for You': 'All Competation';
      //   this.meta.updateTag({property:"og:title",content:selectedDealTitle});
      //   this.meta.updateTag({property:"og:description",content:'Share & Help Friends to Save more..'});
      //   this.meta.updateTag({property:"og:url",content: "https://Workifence.com/Competitions"});
                  
      //   this.meta.updateTag({property:"twitter:title",content:selectedDealTitle});
      //   this.meta.updateTag({property:"twitter:description",content:'Share & Help Friends to Save more..'});
      //   this.meta.updateTag({property:"twitter:url",content: "https://Workifence.com/Competitions"});
      // if(category && category.code){
      //   selType = category.title;
      // }
      this.currentUrl = selType;
      
      this.title.setTitle(this.currentUrl);
  
    }
    
       
  gotToShop(dealUrl: any){
    this.window.open(dealUrl);
  }

  public onPageChanged(event: any){
    this.page = event;
    // this.getAllProducts(); 
    // if (isPlatformBrowser(this.platformId)) {
      ////console.log('Screen Height: ' + document.documentElement.clientHeight);
      if(this.isMobile){
        this.window.scrollTo(0, 275);
      }else{
        this.window.scrollTo(0, 375);
      }
    // } 
  }

  showStartDate(startDate: any){
    let dDate: Date = new Date(startDate);
    let today: Date = new Date();
    return (dDate >= today);
  }

  public changeSorting(sort: any){
    ;

    this.selectedSorting = sort;
    if(this.selectedSorting && this.selectedSorting.title === 'Latest First'){
      ;
      // this.sortedDeals = [..._.orderBy(this.jobs, d => +d.discount, ['asc'])];
      this.sortedCompetitions = [...this.Competitions];
    }else if(this.selectedSorting && this.selectedSorting.title === 'Oldest First'){
      ;
      // this.sortedDeals = [..._.orderBy(this.jobs, d => +d.discount,  ['desc'])];
      this.sortedCompetitions = [...this.Competitions];
    }else{
      ;
      this.sortedCompetitions = [...this.Competitions];
    }
    ;
    if(this.isMobile){
      this.window.scrollTo(0, 275);
    }else{
      this.window.scrollTo(0, 375);
    }
  }

  shareOnWhatsApp($event:any, selectedComp: JobFeedItem){
    $event.stopPropagation();
    this.appService.shareOnWhatsApp(selectedComp);
  }
}
