import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { CompetationDataItem, EmailSubscription, Merchant } from './bee-compete.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpWrapperService } from './http-wrapper.service';
import { AppConstantsService } from './app-constants.service';

@Injectable({providedIn: 'any'})
export class DealsService {

  private platformId: object =  inject(PLATFORM_ID);
  constructor(
    private http: HttpWrapperService,
    private httpClient: HttpClient,
    private appConstants: AppConstantsService,
  ) {

  }

  postDeal(deal: any) {
    // 
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-deals';

    ////console.log('postDeal: api call');
    return this.http
      .post<any>(queryUrl, deal)
      .pipe(catchError(this.handleError));
  }


  loadAmazonDeals(request: any) {
    // 
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/paapi-getdeals';

    ////console.log('loadAmazonDeals: api call');
    return this.http
      .post<any>(queryUrl, request)
      .pipe(catchError(this.handleError));
  }

  updateDeal(comp: CompetationDataItem) {
    // 
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-deals/' + comp.id;

    ////console.log('postDeal: api call');
    return this.http
      .put<any>(queryUrl, comp)
      .pipe(catchError(this.handleError));
  }

  postSubscription(subscription: EmailSubscription) {
    // 
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/email-subscriptions';

    ////console.log('postDeal: api call');
    return this.http
      .post<any>(queryUrl, subscription)
      .pipe(catchError(this.handleError));
  }


  getDeals(country: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?country.contains=' + country + '&page=0&size=2000&sort=id,asc';
    // 
    ////console.log('getDeals: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  
  getApprovedDeals(envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }

    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&page=0&size=2000&sort=id,asc';
    // 
    ////console.log('getDeals: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getCompetitionsByCountry(country: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&country.contains=' + country +'&page=0&size=200&sort=id,asc';
    //console.log('getDealsByCountry: URL ' + queryUrl);
    
    ////console.log('getDeals: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getDealsByCountryAndBrand(country: string, brand: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&country.contains=' + country + '&brand.contains=' + brand + '&page=0&size=200&sort=id,asc';
    // 
    ////console.log('getDealsByCountryAndBrand: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getDealsByCountryAndCategory(country: string, category: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&country.contains=' + country + '&category.equals=' + category +'&page=0&size=200&sort=id,asc';
    //console.log('getDealsByCountryAndCategory: URL ' + queryUrl);
    
    ////console.log('getDealsByCountryAndCategory: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getDealsByCountryCategoryAndDealType(country: string,type: string,category: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&country.contains=' 
          + country + '&category.equals=' + category + '&tags.contains=' + type +'&page=0&size=200&sort=id,asc';
          //console.log('getDealsByCountryCategoryAndDealType: URL ' + queryUrl);
    
    ////console.log('getDeals: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getDealsByCountryAndDealType(country: string,type: string, envi: object ) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&country.contains=' 
          + country + '&tags.contains=' + type +'&page=0&size=200&sort=id,asc';
          //console.log('getDealsByCountryAndDealType: URL ' + queryUrl);
    
    ////console.log('getDeals: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }


  getBrands(country: string) {
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/brands?country.contains=' + country +  '&sort=id,asc';
    // 
    ////console.log('getBrands: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getDealTypes(country: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/deal-types?country.contains=' + country + '&sort=id,asc';
    //console.log('getDealTypes: URL ' + queryUrl);
    
    ////console.log('getDealTypes: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getHomeSlides(country: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }  
    let queryUrl = baseUrl +  '/api/slides?country.contains=' + country + '&tags.contains=' + 'HOME' +'&page=0&size=200&sort=id,asc';
    // 
    ////console.log('getHomeSlides: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getDealsSlides(country: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/slides?country.contains=' + country + '&tags.contains=' + 'DEALS' +'&page=0&size=200&sort=id,asc';

    ////console.log('getHomeSlides: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getMerchants(envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/merchants-and-social/';
    // 
    ////console.log('getMerchants: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getMerchantsByCountryAndType(country: string, mtype: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/merchants-and-social/?type=' + mtype +'&country=' + country;
    //console.log('getMerchantsByCountryAndType: URL ' + queryUrl);
    // 
    ////console.log('getMerchants: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }


  createMerchant(merchant : Merchant,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }

    let queryUrl = baseUrl +  '/api/naari-deals/merchants-and-social';
    ////console.log('createMerchant: api call');
    return this.http
      .post<any>(queryUrl, merchant)
      .pipe(catchError(this.handleError));
  }

  updateMerchant(merchant : Merchant,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals/merchants-and-social/'+ merchant.id;
    ////console.log('updateMerchant: api call');
    return this.http
      .put<any>(queryUrl, merchant)
      .pipe(catchError(this.handleError));
  }

  deleteMerchant(merchantId : string,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals/merchants-and-social/'+ merchantId;
    ////console.log('deleteMerchant: api call');
    return this.http
      .delete<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  getSlidesByCountryAndTag(country: string, tag: string,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/slides?country.contains=' + country  + '&tags.contains=' + tag +'&sort=id,asc';
    // 
    ////console.log('getHomeSlides: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }


  getDealsByCategoryTypeAndCountry(categoryType : string, country: string,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/naari-deals?approved.equals=true&category.equals=' + categoryType +'&country.contains=' + country;
    // 
    ////console.log('getDealsByCategoryTypeAndCountry: api call');
    return this.http
      .get<any[]>(queryUrl)
      .pipe(catchError(this.handleError));
  }


  getCategoriesByCountry(country: string, envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/competation-category?country.contains=' + country;
    //console.log('getCategoriesByCountry: envi:' + envi.toString() + ' URL ' + queryUrl);
    
    ////console.log('getCategoriesByCountry: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  
  getCategoryTypesByCountry(country: string,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/nd-get-category-types-by-country?country=' + country;
    // 
    ////console.log('getCategoryTypesByCountry: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }


  getDealDetailsById(dealId: any,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    // let baseUrl = '';
    // if (isPlatformServer(this.platformId)) {
    //   baseUrl = this.appConstants.BASE_API_SSR_URL;
    //   ////console.log('getDealDetailsById: api call ' + baseUrl);

    // }else{
    //   baseUrl = this.appConstants.BASE_API_URL;
    //   ////console.log('getDealDetailsById: api call ' + baseUrl);
    // }
    let queryUrl = baseUrl + this.appConstants.GET_DEAL_DETAILS_BY_ID + "?id.equals=" + dealId + "&page=0&size=20";
    ////console.log('getDealDetailsById: api call : ' + queryUrl);
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }
  getItems(url: string): Observable<object> {
    // let baseUrl = envi === 'server'?this.appConstants.BASE_API_URL:this.appConstants.BASE_SSR_API_URL;

    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };
    return this.httpClient.get(url, httpOptions);
  }

  deleteNotification(id : any){
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/notifications' + '/' + id;

    return this.http
      .delete<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  deleteDeal(id : any){

    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-deals' + '/delete-deals-by-ids';

    let ids: Array<string> = [
      id
    ]
    return this.http
      .delete<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  deleteDeals(id : any){
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-deals' + '/delete-deals-by-ids';

    let ids: Array<string> = [
      id
    ]
    return this.http
      .post<any>(queryUrl, ids)
      .pipe(catchError(this.handleError));
  }

  deleteSelectedDeals(dIds : Array<string>){
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-deals' + '/delete-deals-by-ids';

    let ids: Array<string> = [...dIds];
    
    return this.http
      .post<any>(queryUrl, ids)
      .pipe(catchError(this.handleError));
  }

  deleteAllExipredDeals(country: string){
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-deals' + '/delete-expired-deals/' + country;

    return this.http
      .delete<any>(queryUrl)
      .pipe(catchError(this.handleError));
  }

  notificationMarkAsread(id : string){
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-notification-markasread' + '/' + id;

    ////console.log('notificationMarkAsread: api call');
    return this.http
      .put<any>(queryUrl, "")
      .pipe(catchError(this.handleError));
  }

  getNotifications(userId : string){
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/naari-get-notifications' + '/' + userId;
    return this.http
    .get<any[]>(queryUrl)
    .pipe(catchError(this.handleError));
  }

  getDealCategoriesByCountry(country: string,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.GET_DEAL_CATEGORIES_BY_COUNTRY + '?country.contains=' + country;
    return this.http.get<any[]>(queryUrl).pipe(catchError(this.handleError));
  
  }

  getDealCategoryTypesByCountry(country: string,envi: object) {
    // let baseUrl = envi.toString() === 'server'?this.appConstants.BASE_SSR_API_URL:this.appConstants.BASE_API_URL;
    ////console.log('getDealCategoryTypesByCountry API call');

    // let courseOptions = [
    //   {
    //     title: "General",
    //     type: 'General',
    //     description: "General Categories",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Mathematics",
    //     type: 'Mathematics',
    //     description: "Mathematics Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Science",
    //     type: 'Science',
    //     description: "Science Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Java",
    //     type: 'Software',
    //     description: "Java Technical",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "AI",
    //     type: 'Software',
    //     description: "AI Programming Basics",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Yoga",
    //     type: 'Wellness',
    //     description: "Free Math Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Meditation",
    //     type: 'Wellness',
    //     description: "Free Math Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Nutrition",
    //     type: 'Health',
    //     description: "Free Math Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "English",
    //     type: 'Language',
    //     description: "Free Math Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   },
    //   {
    //     title: "Telugu",
    //     type: 'Language',
    //     description: "Science Tutions",
    //     isItFree: true,
    //     icon: 'fas fa-graduation-cap',
    //     selected: false
    //   }
    // ]

    // return of(courseOptions);
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.GET_DEAL_CATEGORY_TYPES_BY_COUNTRY + '?country=' + country;
    return this.http.get<any[]>(queryUrl).pipe(catchError(this.handleError));
  
  }

  private handleError(error: any): Observable<never> {
    ////console.log('Get Playlist API: Error');
    return throwError(error || 'Get Playlist API: Error');
  }
}
