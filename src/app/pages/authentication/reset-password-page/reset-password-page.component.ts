import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Subscription, catchError, map } from 'rxjs';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import Validation from 'src/app/services/utilities/validation';
import { PasswordResetFinishRqst } from 'src/app/services/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
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

@Component({
    selector: 'app-reset-password',
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
    ReactiveFormsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent],
    templateUrl: './reset-password-page.component.html',
    styleUrls: ['./reset-password-page.component.scss']
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
    showBack = true;
    isLoading = false;
    resetPasswordFormSubmitted = false;
    isActionInProgress = false;
    hidePassword: boolean = true;
    hideConfirmPassword: boolean = true;
    username:string = '';

    resetKey: string = '';
    public resetPasswordForm: FormGroup = new FormGroup({
      password1: new FormControl('', [Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      password2: new FormControl('', [Validators.required]),
    });

    subs: Array<Subscription> = [];
    private authService: AuthService = inject(AuthService);
    private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
    private constantService: AppConstantsService  = inject(AppConstantsService);
    private localStorageService: LocalStorageService  = inject(LocalStorageService);
    private router: Router= inject(Router);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private userStore: UserStoreService = inject(UserStoreService);
    private platformId: object =  inject(PLATFORM_ID);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);

    // private readonly userStore = inject(SignalStore<UserState>);

    // readonly account = this.userStore.select(x => x.account);
    // readonly token = this.userStore.select(x => x.token);

    constructor(
        public themeService: ThemeCustomizerService,
        private formBuilder: FormBuilder
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {

        // this.subs.push(this.route.params.subscribe(params => { 
        //   this.resetKey = params['key'];
        // })); 
        this.resetKey = this.route.snapshot.queryParams['key'];

        if(isPlatformBrowser(this.platformId)){
          this.isBrowser = true;
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
      }

        this.resetPasswordForm = this.formBuilder.group(
          {
            password1: [
              '',
              [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
              ]
            ],
            password2: ['', Validators.required]
          },
          {
            validators: [Validation.match('password1', 'password2')]
          }
        );

    }

      get fpwf(): { [key: string]: AbstractControl } {
        return this.resetPasswordForm.controls;
      }

      ngOnDestroy(): void {
          this.subs.forEach(s => s.unsubscribe());
      }

      resetPasswordSubmit($event: any){
        
        this.resetPasswordFormSubmitted = true;

        if (this.resetPasswordForm.invalid) {
          return;
        }

        
        let resetRqst: PasswordResetFinishRqst = new PasswordResetFinishRqst();
        resetRqst.key = this.resetKey;
        resetRqst.newPassword = this.resetPasswordForm.value.password1;

        this.authService.finishResetPassword(resetRqst).subscribe(
           (resetFinishResponse) =>
            {
              console.log('resetResponse  == ' + resetFinishResponse);
              this.snackBarService.openSnackBar('Updated Password Successful!!', this.constantService.snackbarType.SUCCESS, 2500);
              this.router.navigateByUrl('/sign-in');
            }, (error: any) => {
              
              this.snackBarService.openSnackBar( error.error.detail, this.constantService.snackbarType.ERROR, 250000);
            });
      }

    
      onReset(): void {
        this.resetPasswordFormSubmitted = false;
        this.resetPasswordForm.reset();
      }

}