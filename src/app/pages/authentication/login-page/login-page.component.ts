
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, 
        FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, Router, RouterModule } from '@angular/router';
import { firstValueFrom, of, Subscription } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import * as _ from 'lodash';
import { PopoverModule } from 'primeng/popover';
import { OverlayModule } from 'primeng/overlay';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RippleModule } from 'primeng/ripple';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from 'src/app/services/auth.models';
import { Account, BioProfile, LoginProfile, PasswordResetRqst, WifRole } from 'src/app/services/profile.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { IconsModule } from 'src/app/shared/icons.module';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { EntitlementService } from 'src/app/services/entitlement.service';
import { NavStore } from 'src/app/core/nav/nav.store';
import { NavbarStoreService } from 'src/main/webapp/app/core/navbar/navbar-store.service';
import { environment } from 'src/environments/environment';
import { ActiveProfileStore } from 'src/app/auth/active-profile.store';
import { AccessContextStore } from 'src/app/core/store/access-context.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatCardModule, MatInputModule, MatCheckboxModule, MatButtonModule, FormsModule, PopoverModule, OverlayModule, InputTextModule, ButtonModule, DrawerModule, CheckboxModule, BadgeModule, PasswordModule, RadioButtonModule, ToggleSwitchModule, RippleModule, IconsModule, MatProgressBarModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl : './login-page.component.scss'
})
export class LoginPageComponent implements OnDestroy, AfterViewInit {
  private loginFinalized = false;
  isToggled = false;
  showPassword = false;
  submitted = false;
  isActionInProgress = false;
  resetErrorMessage = '';
  showBack = true;
  username:string = ''; 
  password:string = '';
  hidePassword: boolean = true; 
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });

  public forgotPasswordForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])
  });

  isForgotPassword:boolean = false;
  forgotPasswordFormSubmitted = false;


  subs: Array<Subscription> = [] ;
  isLoading = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  loginError = false;
  public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
  private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly accessFacade = inject(AccessFacadeService);
  private entitlementService: EntitlementService = inject(EntitlementService);
  private navStore: NavStore = inject(NavStore);
  private navbarStore: NavbarStoreService = inject(NavbarStoreService);
  private activeProfileStore: ActiveProfileStore = inject(ActiveProfileStore);
  private accessContextStore: AccessContextStore = inject(AccessContextStore);
  private localStorageService: LocalStorageService  = inject(LocalStorageService);
  private constantService: AppConstantsService  = inject(AppConstantsService);
  private userStore: UserStoreService = inject(UserStoreService);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  public formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private platformId: object =  inject(PLATFORM_ID);
  private loadingBarService: LoadingBarService =  inject(LoadingBarService);

  constructor() {
    this.browser = isPlatformBrowser(this.platformId);
    this.subs.push(this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
      }));

    if (!environment.production) {
      this.subs.push(
        this.router.events.subscribe((e) => {
          if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
            console.log('[ROUTER_EVT]', e);
          }
        })
      );
    }

    
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
        {
          username: [
            '',
            [
              Validators.required
            ]
          ],
          password: [
            '',
            [
              Validators.required
            ]
          ],
          remember: new FormControl(false)
        }
    );
    this.forgotPasswordForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
      }
    );
    if(this.browser){
      console.log('BROWSER: check for Device type');
      if(this.deviceService.isDesktop()){
        this.isDesktop = true;
        this.showBack = false;

        this.isMobile = false;
        this.isTablet = false;
      }else if(this.deviceService.isMobile()){
        this.isMobile = true;
        this.showBack = true;
        this.isDesktop = false;
        this.isTablet = false;
      }else if(this.deviceService.isTablet()){
        this.isTablet = true;
        this.showBack = false;

        this.isMobile = false;
        this.isDesktop = false;
      }

      this.subs.push(this.loginForm.controls['username'].valueChanges.subscribe((uName: any) => {
        this.loginError = false;
        }));

        this.subs.push(this.loginForm.controls['password'].valueChanges.subscribe((uName: any) => {
          this.loginError = false;
          }));

        const rememberMe = this.localStorageService.getItem('rememberMe') === true;
        const storedUser = this.localStorageService.getItem('userName');
        const storedPass = this.localStorageService.getItem('passWord');
        const authenticated = this.localStorageService.getItem('authenticated') === true;
        if (rememberMe && storedUser && storedPass && !authenticated) {
          this.loginForm.patchValue({
            username: storedUser,
            password: storedPass,
            remember: true,
          });
          this.onSubmit();
        }
    } 
   
  }

  get fpwf(): { [key: string]: AbstractControl } {
    return this.forgotPasswordForm.controls;
  }

  ngAfterViewInit(): void {
   
  }

  forgotPasswordSubmit($event: any){
    
    this.forgotPasswordFormSubmitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.isActionInProgress = true;

    let resetRqst: PasswordResetRqst = new PasswordResetRqst();
    resetRqst.email = this.forgotPasswordForm.value.email;
    resetRqst.language = 'en';
    resetRqst.username = this.forgotPasswordForm.value.username;

    this.authService.initiateResetPassword(resetRqst).subscribe(
       (resetResponse) =>
        {
          console.log('resetResponse  == ' + resetResponse);
          this.isActionInProgress = false;

          this.snackBarService.openMultiLineSnackBar('Reset Password ', 'Please check your email for reset link!!', this.constantService.snackbarType.SUCCESS, 3000500);
          this.router.navigateByUrl('/');
        }, (error: any) => {
          this.isActionInProgress = false;
          this.resetErrorMessage = error.error.detail;

          setTimeout(() => {
              this.resetErrorMessage = '';
          }, 3000);
        });
  }
  
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  forgotPassword($event: any){
    this.isForgotPassword = true;
  }

  switchToLogin($event: any){
    this.isForgotPassword = false;
  }

  // get f(): { [key: string]: AbstractControl } {
  //   return this.loginForm.controls;
  // }

  ngOnDestroy(): void {
      this.subs.forEach(s => s.unsubscribe());
  }

  onSubmit(): void {
    this.loginFinalized = false;

    this.submitted = true;
    this.markFormGroupTouched(this.loginForm);

    
    if (this.loginForm.invalid) {
      return;
    }
    // this.loadingBarService.start();
    this.isLoading = true;
    let loginRequest = new LoginRequest();
    loginRequest.username =  this.loginForm.value.username;
    loginRequest.password = this.loginForm.value.password;
    
    this.loginForm.disable();
    console.log('signInPre Start');
    this.authService.signInPre(loginRequest).subscribe(
       (loginResponse) =>
        {
      
      this.loginForm.enable();
          console.log('loginResponse Response  == ' + loginResponse.status);
          if(loginResponse.status === null){
            this.snackBarService.openSnackBar('You are not registered yet', this.constantService.snackbarType.ERROR, 2500);
            this.isLoading = false;
          }else if(loginResponse.status ==='not-activated'){
          console.log(' Response 1 == ' + loginResponse.status);
          this.snackBarService.openSnackBar('Your Account not Activated Please activate', this.constantService.snackbarType.ERROR, 2500);
          this.isLoading = false;

          this.router.navigateByUrl('/activate?userName=' + loginRequest.username);
          }else{
            console.log(' Response 2  == ' + loginResponse.status);
            this.authService.signIn(loginRequest).subscribe(
               (loginResponse) =>
                {
                  if(this.loginForm.value.remember){
                    this.localStorageService.setItem('userName', loginRequest.username);
                    this.localStorageService.setItem('passWord', loginRequest.password);
                    this.localStorageService.setItem('rememberMe', true);
                  } else {
                    this.localStorageService.removeItem('userName');
                    this.localStorageService.removeItem('passWord');
                    this.localStorageService.removeItem('rememberMe');
                  }
                  this.localStorageService.setItem('authToken', loginResponse.id_token);
                  this.userStore.updateToken(loginResponse.id_token);
                  if(loginResponse.id_token){
                    this.localStorageService.setItem('authenticated', true);
                    // Ensure entitlements/features update immediately after login
                    this.accessFacade.reload();
                    this.entitlementService.getEntitlements();
                    this.navStore.refresh();
                  }
                  this.authService.getAccountProfile().subscribe(
                    async (account:Account) =>
                    {
                      ;
                      console.log('account: ' + account.id);
                      this.userStore.updateAccount(account);
                      if (!environment.production) {
                        console.debug('[LoginDebug] /api/account roles', account?.authorities ?? []);
                      }

                      await firstValueFrom(this.accessContextStore.init().pipe(catchError(() => of(void 0))));
                      const resolvedRoleKey = this.accessContextStore.activeProfileKey || 'ROLE_USER';
                      const resolvedMode = this.accessContextStore.mode || 'PERSONAL';
                      const resolvedHomeRoute = this.accessContextStore.homeRoute || '';
                      const navigatingTo = resolvedHomeRoute || '/user/dashboard';
                      const storedProfileContext = this.readStoredProfileContext();

                      if (!environment.production) {
                        console.log('[LOGIN_NAV_DECISION]', {
                          accessMeActiveProfileKey: resolvedRoleKey,
                          accessMeMode: resolvedMode,
                          accessMeHomeRoute: resolvedHomeRoute,
                          storedProfileContext,
                          finalRouteToNavigate: navigatingTo,
                        });
                        console.debug(
                          `[LOGIN_NAV] activeProfileKey=${resolvedRoleKey}, mode=${resolvedMode}, homeRoute=${resolvedHomeRoute}, navigatingTo=${navigatingTo}`
                        );
                      }

                      this.activeProfileStore.setActiveRole(resolvedRoleKey);
                      this.navStore.load({ force: true });
                      this.navbarStore.loadNavbar(true);
                      this.subs.push(
                        this.accessFacade.accessMe$
                          .pipe(take(1))
                          .subscribe((me) => {
                            const roles: Array<WifRole> = [];
                            if (this.accessFacade.isAdmin(me)) {
                              roles.push({ title: 'App Admin', role: 'ROLE_ADMIN', url: '/user/dashboard-admin' });
                            } else if (this.accessFacade.isEnterprise(me)) {
                              roles.push({ title: 'Enterprise', role: 'ROLE_USER', url: '/user/enterprise' });
                            } else {
                              roles.push({ title: 'Member', role: 'ROLE_USER', url: '/user/dashboard' });
                            }

                            this.userStore.updateRoles(roles);
                          })
                      );

                      this.authService.getLoginProfile(account.login).subscribe(
                        (profile)=>{
                          this.userStore.updateLoginProfile(profile);
                          this.userStore.setUserLoginStatus(true);
                          this.authService.getBioProfile(account.login).subscribe(

                            (bioProfile: BioProfile) => {
                                if(!bioProfile.id){
                                  this.snackBarService.openSnackBar('Your Account not Activated Please activate', this.constantService.snackbarType.ERROR, 2500);
                                  if (!environment.production) {
                                    console.log('[LOGIN_NAV_DECISION]', {
                                      accessMeActiveProfileKey: resolvedRoleKey,
                                      accessMeMode: resolvedMode,
                                      accessMeHomeRoute: resolvedHomeRoute,
                                      storedProfileContext,
                                      finalRouteToNavigate: '/bio-profile',
                                    });
                                  }
                                  void this.finalizeLoginNavigation('/bio-profile');
                                }
                                else{
                                  this.userStore.updateBioProfile(bioProfile);
                                  debugger;
                                  void this.finalizeLoginNavigation(navigatingTo);
                                }
                                // bioProfile: 
                                // {...bioProfile, imageUrl: bioProfile?.imageUrl?this.constantService.BASE_AWS_S3_API_URL + bioProfile?.imageUrl:'' }}),
                              });
                        }
                      )
                          setTimeout(() => {
                            this.isLoading = false;
                          }, 500);
                      }, (error: any) => {
                          // this.loginError = true;
                          this.isLoading = false;
                      }
                  );

                },(error: any) => {
                  this.loginError = true;
                  this.isLoading = false;
                  this.handleLoginHttpError(error);
                });
          }
        }, (error: any) => {
          this.isLoading = false;
          this.loginForm.enable();
          this.handleLoginHttpError(error);
        });
  }

  private handleLoginHttpError(error: any): void {
    // Always allow retry.
    if (this.loginForm.disabled) {
      this.loginForm.enable();
    }

    const status = error?.status;
    const message =
      error?.error?.detail ||
      error?.error?.message ||
      error?.message ||
      '';

    const isBadCredentials =
      status === 401 ||
      (typeof message === 'string' && message.toLowerCase().includes('bad credentials'));

    if (isBadCredentials) {
      this.snackBarService.openSnackBar('Invalid username or password', this.constantService.snackbarType.ERROR, 2500);
      return;
    }

    // Backend sometimes returns 500 even for auth failures; show a generic but actionable message.
    this.snackBarService.openSnackBar('Login failed. Please try again.', this.constantService.snackbarType.ERROR, 2500);
  }

  hasRoleAdmin(authorities?: string[] | null): boolean {
    return (authorities ?? []).includes('ROLE_ADMIN');
  }

  private async finalizeLoginNavigation(target: string): Promise<void> {
    if (this.loginFinalized) return;
    this.loginFinalized = true;

    if (!environment.production) {
      console.debug('[LoginDebug] final navigation route', target);
    }
    await this.router.navigateByUrl(target);
  }

  private readStoredProfileContext(): unknown {
    const raw = this.localStorageService.getItemByName('profileContext');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

  closeMessage($event: any){
    this.resetErrorMessage = '';
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
