import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, 
        FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayModule } from 'primeng/overlay';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from 'src/app/services/auth.models';
import { BioProfile, LoginProfile, PasswordResetRqst } from 'src/app/services/profile.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WifProgressDisplayComponent } from 'src/app/shared/wif-progress-display/wif-progress-display.component';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, 
    MatIconModule,  
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    OverlayPanelModule,
    OverlayModule,
    InputTextModule,
    ButtonModule,
    SidebarModule,
    CheckboxModule,
    BadgeModule,
    PasswordModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent,
    WifProgressDisplayComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl : './login-page.component.scss'
})
export class LoginPageComponent implements OnDestroy, AfterViewInit {
  isToggled = false;

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

          this.snackBarService.openSnackBar('Please check your email for reset link!!', this.constantService.snackbarType.SUCCESS, 3000500);
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
                  }
                  this.localStorageService.setItem('authToken', loginResponse.id_token);
                  this.userStore.updateToken(loginResponse.id_token);
                  if(loginResponse.id_token){
                    this.localStorageService.setItem('authenticated', true);
                  }
                  this.authService.getAccountProfile().subscribe(
                    (account) =>
                    {
                      ;
                      console.log('account: ' + account.id);
                      this.userStore.updateAccount(account);
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
                                  this.router.navigate(['/user/dashboard']);
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
                });
          }
        }, (error: any) => {
          // this.loginError = true;
          this.isLoading = false;
        });
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
