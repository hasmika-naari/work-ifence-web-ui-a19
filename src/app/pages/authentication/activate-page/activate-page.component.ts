import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { ActivationCodeSubmitRequest } from 'src/app/services/signup.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IconsModule } from 'src/app/shared/icons.module';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { AppConstantsService } from 'src/app/services/app-constants.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatCardModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatSelectModule, FormsModule, ButtonModule, InputTextModule, ReactiveFormsModule, IconsModule, MatProgressBarModule],
  templateUrl: './activate-page.component.html',
  styleUrls: ['./activate-page.component.scss'],
})
export class ActivatePageComponent {
  isToggled = false;
  isLoading = false;
  activationErrorMessage = '';
  showBack = true;

  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;

  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  private platformId: object =  inject(PLATFORM_ID);

    public activationForm: FormGroup = new FormGroup({
      userName: new FormControl(''),
      code: new FormControl(''),
    });
      
    private formBuilder: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    private route: ActivatedRoute =  inject(ActivatedRoute);
    private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
    private constantService: AppConstantsService  = inject(AppConstantsService);

    constructor(private router: Router) {
    this.browser = isPlatformBrowser(this.platformId);

      this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
      });
    }
 
    ngOnInit(): void {

      const userName = this.route.snapshot.queryParams['userName'];
      const code = this.route.snapshot.queryParams['key'];
        this.activationForm = this.formBuilder.group(
          {
            userName: [
              userName,
              [
                Validators.required,
              ],
            ],
            code: [
              code,
              [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(22),
              ],
            ],
          }
        );

        this.activationForm.controls['userName'].disable();
     
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
        }
  }


    onActivationSubmit(){
          this.isLoading = true;
          this.activationErrorMessage = '';

      let activationCodeSubmitReqest: ActivationCodeSubmitRequest = new ActivationCodeSubmitRequest();
      activationCodeSubmitReqest.activationCode = this.activationForm.controls['code'].value; 
      activationCodeSubmitReqest.username = this.activationForm.controls['userName'].value; 

      this.authService.submitActivationCode(activationCodeSubmitReqest).subscribe((resp) => {
            this.isLoading = false;
              this.snackBarService.openSnackBar(
                'Account activated successfully. Please sign in.',
                this.constantService.snackbarType.SUCCESS,
                2500
              );
              setTimeout(() => {
                this.router.navigate(['/sign-in']);
              }, 600);
         
      }, (error) => {
        this.isLoading = false;
        this.activationErrorMessage =
          error?.error?.message ||
          error?.error?.title ||
          error?.message ||
          'Activation failed. Please check your code and try again.';
      });
    }
  
    onReset(): void {
    }
  
}
