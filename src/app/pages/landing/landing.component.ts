import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MainBannerComponent } from './main-banner/main-banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { PopularFeaturesComponent } from './popular-features/popular-features.component';
import { HomefourteenMainBannerComponent } from './homefourteen-main-banner/homefourteen-main-banner.component';
import { OurDashboardDemoComponent } from './our-dashboard-demo/our-dashboard-demo.component';
import { HeaderWorkIfenceComponent } from './header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from './footer-wifence/footer-wifence.component';
import { Category, CompetationDataItem, Competitionsorting, MenuListItem, PCategory, Slide } from '../../services/bee-compete.model';
import { ActiveJobsComponent } from './active-jobs/active-jobs.component';
import { FeedbackStyleTwoComponent } from './feedback-style-two/feedback-style-two.component';
import { WINDOW } from '../../services/window.token';
import { SeoService } from '../../services/seo/seo.service';
import { AppUtilService } from '../../services/app.util.service';
import { DealsService } from '../../services/deals.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { JobFeedItem } from '../../services/ifence.model';
import { ActiveCollegeJobsComponent } from './active-college-jobs/active-college-jobs.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NgOptimizedImage, HeaderWorkIfenceComponent,
    MainBannerComponent,NgxPaginationModule,HomefourteenMainBannerComponent,
    CategoriesComponent,FooterWorkifenceComponent,OurDashboardDemoComponent,
    MatButtonModule, MatChipsModule, MatIconModule,
    MatMenuModule,PopularFeaturesComponent, ActiveJobsComponent, ActiveCollegeJobsComponent,
    MatCardModule, MatProgressBarModule, FeedbackStyleTwoComponent
     ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  faWhatsapp = 'faWhatsapp';
  faHotjar = 'faHotjar';
  isActionInProgress = true;
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
    {title: 'Lowest Discount First', isSelected: false},
    {title: 'Highest Discount First', isSelected: false}
    ];
    
  competations!: Array<CompetationDataItem>;
  categories: Array<Category> = new Array<Category>();
  pCategories: Array<PCategory> = new Array<PCategory>();
  bySubjectCategories: Array<PCategory> = new Array<PCategory>();
  byAgeCategories: Array<PCategory> = new Array<PCategory>();
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
  slides!: Array<Slide>;
  dailyCompetations: Array<CompetationDataItem> = new Array<CompetationDataItem>();
  hover = true;
  browser = false;
  myCounttry: string = '';

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    
    autoplayTimeout: 11000,
    autoplay: false,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  private seoService:SeoService = inject(SeoService);
  private appUtilService: AppUtilService =  inject(AppUtilService);
  private dealsService: DealsService= inject(DealsService);
  private _localStorageService: LocalStorageService= inject(LocalStorageService);
  private router: Router= inject(Router);
  private transferState: TransferState = inject(TransferState);
  private platformId: object =  inject(PLATFORM_ID);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);



  constructor(@Inject(WINDOW) private window: Window) { 
    const content =
    'Work ifence - Career Management';

  const title = 'Work ifence - Career Management';

  this.seoService.setMetaDescription(content);
  this.seoService.setMetaTitle(title);


  }

  ngOnInit(): void {
    if(isPlatformServer(this.platformId)){
      this.fetchData();
    }else{
      this.loadFetcheddata();
    }

    if(isPlatformBrowser(this.platformId)){
      // this.loadFetcheddata();
      this.browser = true;
      // setTimeout(() => {
      //   this.isActionInProgress = false;
      // }, 10);
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
    // let userName:string = this._localStorageService.getItem("userName");
    // let passWord:string = this._localStorageService.getItem("passWord");
    // 
    // console.log('UserName: ' + userName);
    // console.log('passWord: ' + passWord);
    // this.appUtilService.loginWithCredentials(userName, passWord, '/user/dashboard');
  }
  }

  fetchData(): void{

    if(isPlatformServer(this.platformId)){
      console.log('naari-home - fetchData + ' + this.platformId);
    }
    // if(!this.dailyDeals.length){
      // this.dealsService.getCompetitionsByCountry('usa', this.platformId).subscribe((comps) => {
      //     this.competations = [...comps];
      //     this.dailyCompetations = [...comps];

      //     if(isPlatformServer(this.platformId)){
      //       this.transferState.set<CompetationDataItem[]>(
      //         makeStateKey('dealsTable'), comps
      //       );
      //     }
      // });
    // }
    // this.dealsService.getSlidesByCountryAndTag('usa', 'HOME').subscribe((slides) => {
    //   this.slides = [...slides];
    // });
    // if(isPlatformBrowser(this.platformId)){
    //   console.log('fetch Data Browser categories' + this.categories.length);
    // } 
    // if(this.categories && !this.categories.length){
      // this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
      //   // this.transferState.set<CategoryListItem[]>(
      //   //   makeStateKey('categoriesTable'), categoriesTable
      //   // );
      //   this.categories = [...categories];
      //   /// divide into parentList
      //   // Group categories by parent and map them to the desired format
      //   this.pCategories = [..._.map(
      //       _.groupBy(categories, 'parent'),
      //       (categories, parent) => ({ parent, categories }))];
      //       if(isPlatformServer(this.platformId)){
      //         console.log('naari-home - fetchData pCategories+ ' + this.platformId);
      //         this.transferState.set<CategoryListItem[]>(
      //           makeStateKey('categoriesTable'), categories
      //         );
      //       }
          
      //     // //console.log(groupedCategories);
      // });

    
    
  // }
  }

  
  gotToShop(dealUrl: any){
    this.window.open(dealUrl);
  }

  getLatestDealsdelay(i: any){
		let delayText = 'ms';
		if(i > 0){
			delayText = (+i*60).toString() + 'ms';
		}
  
		return delayText;
	}
  public onPageChanged(event: any){
    this.page = event;
    // this.getAllProducts(); 
    // if (isPlatformBrowser(this.platformId)) {
      this.window.scrollTo(0, document.documentElement.clientHeight - 50);
    // } 
  }
  public changeSorting(sort: any){
    ;

    this.selectedSorting = sort;
    if(this.selectedSorting && this.selectedSorting.title === 'Lowest Discount First'){
      ;
      this.dailyCompetations = [..._.orderBy(this.competations, d => d.startDate, ['asc'])];
    }else if(this.selectedSorting && this.selectedSorting.title === 'Highest Discount First'){
      ;
      this.dailyCompetations = [..._.orderBy(this.competations, d => d.startDate,  ['desc'])];
    }else{
      this.dailyCompetations = [...this.competations];
    }
    ;
    this.window.scrollTo(0, document.documentElement.clientHeight - 50);
  }
  public openProductDialog(deal: CompetationDataItem){   
    this._localStorageService.setItem('selectedDealKey', deal);
    this.router.navigate(['/deal', deal.id]); 
  }

  showStartDate(startDate: any){
    let dDate: Date = new Date(startDate);
    let today: Date = new Date();
    return (dDate >= today);
  }

  shareOnWhatsApp($event:any, selectedJob: JobFeedItem){
    $event.stopPropagation();
    this.appUtilService.shareOnWhatsApp(selectedJob);
  }


  loadFetcheddata(){
    console.log('This is isPlatformBrowser...');
     if(this.transferState.hasKey(makeStateKey('slideTable'))){
      this.slides = this.transferState.get(makeStateKey('slideTable'), []);
     }else{
      // this.fetchData();
     }

     if(this.transferState.hasKey(makeStateKey('dealsTable'))){
      this.competations = this.transferState.get(makeStateKey('dealsTable'), []);
      // this.dailyDeals = [...this.deals];
     }else{
      // this.fetchData();
     }
   
     if(this.transferState.hasKey(makeStateKey('categoriesTable'))){
      this.categories = this.transferState.get(makeStateKey('categoriesTable'), []);
     }else{
      // this.fetchData();
     }

     this.byAgeCategories = [
      {
        parent: 'by Age',
        categories: [
          {
            id: "0",
            parent: "by Age",
            title: "High School",
            subTitle: "98",
            description: "High School",
            imageUrl: "",
            country: "",
            code: "HIGH-SCHOOL",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Age",
            title: "Middle School",
            subTitle: "52",
            description: "Middle School",
            imageUrl: "",
            country: "",
            code: "MIDDLE-SCHOOL",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Age",
            title: "Elementary School",
            subTitle: "13",
            description: "Elementary School",
            imageUrl: "",
            country: "",
            code: "ELEMENTARY-SCHOOL",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Age",
            title: "13+",
            subTitle: "21",
            description: "13+",
            imageUrl: "",
            country: "",
            code: "13-PLUS",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Age",
            title: "25+",
            subTitle: "20",
            description: "25+",
            imageUrl: "",
            country: "",
            code: "25-PLUS",
            status: "active",
            isSelected: false
          }
        ]
      }
    ];

    this.bySubjectCategories = [
      {
        parent: 'by Subject',
        categories: [
          {
            id: "0",
            parent: "by Subject",
            title: "Essay",
            subTitle: "21",
            description: "Essay",
            imageUrl: "",
            country: "",
            code: "ESSAY",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Subject",
            title: "STEM",
            subTitle: "49",
            description: "STEM",
            imageUrl: "",
            country: "",
            code: "STEM",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Subject",
            title: "Quiz Bowl",
            subTitle: "60",
            description: "Quiz Bowl",
            imageUrl: "",
            country: "",
            code: "QUIZ-BOWL",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Subject",
            title: "Art",
            subTitle: "21",
            description: "Art",
            imageUrl: "",
            country: "",
            code: "ART-COMP",
            status: "active",
            isSelected: false
          },
          {
            id: "0",
            parent: "by Subject",
            title: "Scince",
            subTitle: "20",
            description: "Scince",
            imageUrl: "",
            country: "",
            code: "SCIENCE",
            status: "active",
            isSelected: false
          }
        ]
      }
    ]

}
}
