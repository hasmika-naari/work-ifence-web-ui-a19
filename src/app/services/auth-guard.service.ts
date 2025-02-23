import { Injectable, PLATFORM_ID, Signal, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, pipe } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Account } from './profile.model';
import { UserStoreService } from './store/user-store.service';
import { isPlatformBrowser } from '@angular/common';


@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {

  private userStore: UserStoreService = inject(UserStoreService);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  browser = false;
  private platformId: object =  inject(PLATFORM_ID);

  constructor(
    private router: Router, 
    private _localStorageService: LocalStorageService
    ) {
    this.browser = isPlatformBrowser(this.platformId);
    }

  canActivateChild(): Observable<boolean> {
    
   
    // let isAuthenticated = this._localStorageService.getItem('authenticated');
    if(!this.userAccount().activated){
      this.router.navigateByUrl('/sign-in');
      return of(false);
    }else{
      return of(true);
    }

    // return this.store.pipe(select(getIsAuthenticated)).pipe(
    //   map((isAuthenticated: boolean) => {
    //     if(!isAuthenticated){
    //       this.router.navigateByUrl('/login');
    //       return true;
    //     }
    //     return true;
    //   }),
    //   take(1)
    //   );
  }

  canActivate(): Observable<boolean>{
    
    let isAuthenticated:any = false;
    if(this.browser)
    {
      isAuthenticated = this._localStorageService.getItem('authenticated');
      
    }

      if(isAuthenticated && isAuthenticated.notoken === ""){
        this.router.navigateByUrl('/');
        return of(false);
      }else{
        return of(true);
      }

    // return this.store.pipe(select(getIsAuthenticated)).pipe(
    //   map((isAuthenticated: boolean) => {
    //     if(!isAuthenticated){
    //       this.router.navigateByUrl('/login');
    //       return true;
    //     }
    //     return true;
    //   }),
    //   take(1)
    //   );
  }

  canLoad(): Observable<boolean>{
    
    let isAuthenticated = this._localStorageService.getItem('authenticated');
        if(!isAuthenticated){
          this.router.navigateByUrl('/login');
          return of(false);
        }else{
          return of(true);
        }
   
  }

}
