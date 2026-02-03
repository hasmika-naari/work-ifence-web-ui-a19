import { Injectable, PLATFORM_ID, Signal, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, pipe } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Account } from './profile.model';
import { UserStoreService } from './store/user-store.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';


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

  private getE2EAuthOverride(): { authenticated?: boolean; activated?: boolean } | null {
    // DEV-only: allow Playwright to override auth state.
    // Must be SSR-safe and must not change production behavior.
    if (environment.production) return null;
    if (typeof window === 'undefined') return null;

    const e2e = (window as any).__E2E__ as any;
    if (!e2e?.auth) return null;
    return {
      authenticated: typeof e2e.auth.authenticated === 'boolean' ? e2e.auth.authenticated : undefined,
      activated: typeof e2e.auth.activated === 'boolean' ? e2e.auth.activated : undefined,
    };
  }

  canActivateChild(): Observable<boolean> {
    // SSR-safe: never touch localStorage or navigate on server.
    if (!this.browser) {
      return of(true);
    }

    const e2e = this.getE2EAuthOverride();

    // 1) Auth check (same as canActivate/canLoad)
    let isAuthenticated: any = false;
    if (e2e && typeof e2e.authenticated === 'boolean') {
      isAuthenticated = e2e.authenticated;
    } else {
      isAuthenticated = this._localStorageService.getItem('authenticated');
    }

    if (!isAuthenticated) {
      this.router.navigateByUrl('/sign-in');
      return of(false);
    }

    // 2) Activation check
    const activated = e2e?.activated ?? this.userAccount()?.activated;
    if (!activated) {
      this.router.navigateByUrl('/sign-up');
      return of(false);
    }

    return of(true);

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

    // SSR-safe: never touch localStorage or navigate on server.
    if (!this.browser) {
      return of(true);
    }

    let isAuthenticated:any = false;
    const e2e = this.getE2EAuthOverride();
    if (e2e && typeof e2e.authenticated === 'boolean') {
      isAuthenticated = e2e.authenticated;
    } else {
      isAuthenticated = this._localStorageService.getItem('authenticated');
    }

    if(!isAuthenticated){
      this.router.navigateByUrl('/sign-in');
      return of(false);
    }
    return of(true);

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
    // SSR-safe: do not touch localStorage unless we are in the browser.
    if (!this.browser) {
      return of(true);
    }

    const e2e = this.getE2EAuthOverride();
    const isAuthenticated = (e2e && typeof e2e.authenticated === 'boolean')
      ? e2e.authenticated
      : this._localStorageService.getItem('authenticated');

    if(!isAuthenticated){
      this.router.navigateByUrl('/sign-in');
      return of(false);
    }else{
      return of(true);
    }
   
  }

}
