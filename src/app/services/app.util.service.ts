import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CompetationDataItem } from './bee-compete.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginRequest } from './auth.models';
import { AuthService } from './auth.service';
import { YeaSnackBarService } from './utilities/snackbar';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { AppConstantsService } from './app-constants.service';
import { UserStoreService } from './store/user-store.service';
import { Account, BioProfile, WifRole } from './profile.model';
import { UserResume } from './store/user-store';
import { JobFeedItem } from './ifence.model';
import { WINDOW } from './window.token';

@Injectable({providedIn: 'root'})
export class AppUtilService {

  private authService: AuthService = inject(AuthService);
  private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
  private router: Router = inject(Router);
  private localStorageService: LocalStorageService  = inject(LocalStorageService);
  private constantService: AppConstantsService  = inject(AppConstantsService);
  private userStore: UserStoreService = inject(UserStoreService);
  private http: HttpClient = inject(HttpClient);
  
    constructor( 
      @Inject(DOCUMENT) private document: Document,  
      @Inject(WINDOW) private window: Window,
    public deviceService: DeviceDetectorService,
    ){}

    loadStyle(styleName: string, order: string) {
        const head = this.document.getElementsByTagName('head')[0];
      
        let themeLink = this.document.getElementById(
          'client-theme'
        ) as HTMLLinkElement;
        if (themeLink) {
          themeLink.href = styleName;
        } else {
          const style = this.document.createElement('link');
          style.id = 'client-theme' + order;
          style.rel = 'stylesheet';
          style.href = `${styleName}`;
          // console.log('Loading STyle - ' + styleName);
          head.appendChild(style);
        }
      }

      getVisitorCountry(ipAddress: string): Observable<any>{
        // return this.http.get<any>("https://ipinfo.io/" + ipAddress + '?token=' + 'd46c2362144a3a');
        return this.http.get<any>("https://ipinfo.io/" + ipAddress + '?token=' + '8951d7855a2c17');
      }
      
      shareOnWhatsApp(comp: JobFeedItem){
            if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
          this.window.open(
             'whatsapp://send?text=https://Workifence.com/competation/' +
            comp.id.toString(),
            // This is what makes it
            // open in a new window.
            '_blank'
          );
        }else if (this.deviceService.isDesktop()) {
                let url =
                  'https://web.whatsapp.com/send?text=https://Workifence.com/competation/' +
          comp.id.toString();
          
          this.window.open(
                  url,
                  // This is what makes it
                  // open in a new window.
                  '_blank'
                );
              }
      }

      generateUniqueString(): string {
        const timestamp: number = Date.now(); // Get current timestamp in milliseconds
        const uniqueString: string = timestamp.toString(); // Convert timestamp to string
        return uniqueString;
    }


    loginWithCredentials(userName: string, password: string, route: string): void {
      let loginRequest = new LoginRequest();
      loginRequest.username =  userName;
      loginRequest.password = password;
      ;
      console.log('signInPre Start');
      this.authService.signInPre(loginRequest).subscribe(
         (loginResponse) =>
          {
            console.log('loginResponse Response  == ' + loginResponse.status);
            if(loginResponse.status === null){
                this.localStorageService.removeItem('authenticated');
                this.router.navigateByUrl('/');
              this.snackBarService.openSnackBar('You are not registered yet', this.constantService.snackbarType.ERROR, 2500);
            }else if(loginResponse.status ==='not-activated'){
            console.log(' Response 1 == ' + loginResponse.status);
            this.snackBarService.openSnackBar('Your Account not Activated Please activate', this.constantService.snackbarType.ERROR, 2500);
  
            this.router.navigateByUrl('/activate?userName=' + userName);
            }else{
              console.log(' Response 2  == ' + loginResponse.status);
              this.authService.signIn(loginRequest).subscribe(
                 (loginResponse) =>
                  {
                    this.localStorageService.setItem('authToken', loginResponse.id_token);
                    this.localStorageService.setItem('authenticated', true);
                    
                    this.userStore.updateToken(loginResponse.id_token);
  
                    this.authService.getAccountProfile().subscribe(
                      (account: Account) =>
                      {
                        console.log('account: ' + account.id);
                        // alert('User Account: ' + account.id);
                        this.userStore.updateAccount(account);
                          let roles: Array<WifRole> = [];
                          account.authorities.forEach(authr => {
                            roles.push({title:authr,role:authr })
                          });
                          this.userStore.updateRoles(roles);
                          this.userStore.updateActiveRole(roles[0]);
                          debugger;
                        this.authService.getLoginProfile(account.login).subscribe(
                          (profile)=>{
                            this.userStore.updateLoginProfile(profile);
                            this.userStore.setUserLoginStatus(true);
                            this.authService.getBioProfile(account.login).subscribe(
  
                              (bioProfile: BioProfile) => {
                                  if(!bioProfile.id){
                                    this.snackBarService.openSnackBar('Your Account not Activated Please activate', this.constantService.snackbarType.ERROR, 2500);
                                    this.router.navigate(['/bio-profile']);
                                  }
                                  else{
                                    this.userStore.updateBioProfile(bioProfile);
                                    // this.router.navigate(['/user/dashboard']);
                                  }
                                  // bioProfile: 
                                  // {...bioProfile, imageUrl: bioProfile?.imageUrl?this.constantService.BASE_AWS_S3_API_URL + bioProfile?.imageUrl:'' }}),
                                });
                          }, (error: any) => {

                          }
                        )
                        }, (error: any) => {

                        }
                    );
  
                  }, (error: any) => {

                  });
            }
          }, (error: any) => {

          });
    }

} 