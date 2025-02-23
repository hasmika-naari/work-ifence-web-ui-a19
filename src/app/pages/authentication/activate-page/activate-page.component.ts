import { CommonModule, isPlatformBrowser } from '@angular/common';
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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { ActivationCodeSubmitRequest } from 'src/app/services/signup.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, RouterModule, 
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent],
  templateUrl: './activate-page.component.html',
})
export class ActivatePageComponent {
  isToggled = false;
  isLoading = false;
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
      let activationCodeSubmitReqest: ActivationCodeSubmitRequest = new ActivationCodeSubmitRequest();
      activationCodeSubmitReqest.activationCode = this.activationForm.controls['code'].value; 
      activationCodeSubmitReqest.username = this.activationForm.controls['userName'].value; 

      this.authService.submitActivationCode(activationCodeSubmitReqest).subscribe((resp) => {
              this.router.navigate(['/sign-in']); 
         
      }, (error) => {
          
      });
    }
  
    onReset(): void {
    }
  
}
