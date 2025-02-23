import { Injectable, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse, HttpHeaders, HttpHeaderResponse, HttpResponse } from '@angular/common/http';


import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { EventBusService } from './shared/event-bus.service';
import { EventData } from './shared/event.class';
import { Router } from '@angular/router';
import { AppConstantsService } from './app-constants.service';
import { YeaSnackBarService } from './utilities/snackbar';
import { LoginResponse } from './auth.models';
import { isPlatformBrowser } from '@angular/common';
// import { SignalStore } from './store/signal-store';
// import { UserState } from './store/user-store';

const TOKEN_HEADER_KEY = 'Authorization';


@Injectable({providedIn: 'root'})
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  isLoginCall = false;

    private storageService: LocalStorageService = inject(LocalStorageService);
    private platformId: object =  inject(PLATFORM_ID);
    // private readonly userStore = inject(SignalStore<UserState>);
    // readonly account = this.userStore.select(x => x.account);
    // readonly token = this.userStore.select(x => x.token);
    
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private appConstantService: AppConstantsService,
    private snackBarService: YeaSnackBarService,
  ) {
    
    afterNextRender(() => {
      
    });
  
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    let headers: HttpHeaders = new HttpHeaders();
    if (req.method === 'GET') {
      headers = headers.append('Accept', 'application/json');
      headers = headers.append('Cache-Control', 'no-cache');
      headers = headers.append('Pragma', 'no-cache');
    } else {
      if(req.url.includes("uploadExternalResumeInS3")){
        // headers = headers.append('Content-Type', 'image/jpeg');
      }else{
        headers = headers.append('Content-Type', 'application/json');
      }
    }
    let token: any  = '';
    if(isPlatformBrowser(this.platformId)){
      token = this.storageService.getItem("authToken");
    }
    
    let urlParts:any = req.url.split('/');
    if(urlParts[4] === 'authenticate'){
      this.isLoginCall = true;
    }else{
      this.isLoginCall = false;
    }
    if( req.url.includes("uploadProfileImage")){
      
    }
    if(!req.url.includes("wif-login") && !req.url.includes("authenticate") && 
        !req.url.includes("en.json") && token !== Object(token) ) {
          
        let tempToken = token.replace("\\", "").replace("\\", "");
        let currentToken = tempToken.replace("\"", "").replace("\"", "");
        let bearer = "Bearer ";
        headers = headers.append(TOKEN_HEADER_KEY, bearer + currentToken);
    }

    authReq = req.clone({ headers });

    // console.log('Request URL1: ' + req.url);
    // // Rewrite URL if it starts with '/api'
    // if (req.url.includes('/api')) {
    // console.log('Request URL2: ' + req.url);

    //   const apiUrl = 'http://Workifence.com:8090/api';
    //   const newPath = req.url.substring(req.url.indexOf('/api') + 4); // Extract remaining path after '/api'
    // console.log('Request URL3: apiUrl ' + apiUrl);
    // console.log('Request URL4: newPath ' +  newPath);
    // console.log('Request URL5: Final URL ' +  apiUrl + newPath);

    //    authReq = authReq.clone({ url: apiUrl + newPath });
    // }

    return next.handle(authReq).pipe(
      map((response: HttpEvent<any>) => {
        if (response instanceof HttpErrorResponse) {
          if (response.status === 401) {
            this.router.navigate(['login']);
          } else if (response.status === 302 || response.status === 0) {
          }else if(response.status === 400){
            
            // this.snackBarService.openSnackBar(response.title, 
            // this.appConstantService.snackbarType.ERROR, 2500);
          }else if (response.status === 500){
            let uriParts:any = authReq.url.split('/');
            if(authReq.url.includes('reset-password')){
              // this.authFacade.setPasswordResetState(PassWordResetStateEnum.RESET_KEY_REQUEST_FAILED);
            }
          }
        } else if (response instanceof HttpHeaderResponse) {
          console.log(response);
          const token: any = response.headers.get('authorization');
          this.storageService.setItem('authToken', JSON.stringify(token));
        } else if (response instanceof HttpResponse) {
          const token: LoginResponse = response.body as LoginResponse;
          if (token?.id_token && this.isLoginCall) {
            this.storageService.setItem('authToken', JSON.stringify(token.id_token));
          }else if(!token?.id_token && this.isLoginCall){
            this.snackBarService.openSnackBar('Invalid Credentials Please check and Re try again', 
            this.appConstantService.snackbarType.ERROR, 2500);
          }
        }
        
        return response;
      })
    );

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];