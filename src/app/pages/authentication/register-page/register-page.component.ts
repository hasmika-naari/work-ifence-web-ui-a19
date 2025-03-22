import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import Validation from 'src/app/services/utilities/validation';
import { RegisterRequest } from 'src/app/services/auth.models';
import { CheckUserNameRequest } from 'src/app/services/signup.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { passwordValidator, usernameValidator } from 'src/app/services/validators/username.validator';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    DropdownModule,
    FormsModule,
    MultiSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent,
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
  MatProgressBarModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  showSignUpSecondStep = false;
  maxYear: number = new Date().getFullYear();
  minYear = new Date().getFullYear() - 70;
  spinnerDiameter = 50;
  isUserNameCheckInProgress = false;
  isUserNameAvailable = false;
  isUserNameChecked = false;
  isToggled = false;
  registerRequest:RegisterRequest = new RegisterRequest();
  isLoading =  false;
  valCheck: string[] = ['remember'];
  password!: string;
  showPasswordHint = false;
  showBack = true;
  months: any = [
    {
      "title": "January",
      "value": "1"
    },
    {
      "title": "February",
      "value": "2"
    },
    {
      "title": "March",
      "value": "3"
    },
    {
      "title": "April",
      "value": "4"
    },
    {
      "title": "May",
      "value": "5"
    },
    {
      "title": "June",
      "value": "6"
    },
    {
      "title": "July",
      "value": "7"
    },
    {
      "title": "August",
      "value": "8"
    },
    {
      "title": "September",
      "value": "9"
    },
    {
      "title": "October",
      "value": "10"
    },
    {
      "title": "November",
      "value": "11"
    },
    {
      "title": "December",
      "value": "12"
    }
  ]
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  signUpError = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

    public registerForm1: FormGroup = new FormGroup({
      joinAs: new FormControl(''),
      dobMonth: new FormControl(''),
      dobDay: new FormControl(''),
      dobYear: new FormControl(''),
    });

    public registerForm2: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        userName: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
        acceptTerms: new FormControl(false),
      });

      public registerForm3: FormGroup = new FormGroup({
        firstName: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z'’\- ]+$/), // Alphabets, spaces, hyphens, and apostrophes allowed
          Validators.maxLength(32),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z'’\- ]+$/), // Same pattern as firstName
          Validators.maxLength(32),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email, // Built-in validator for email
        ]),
        userName: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern(/^[a-zA-Z0-9._-]+$/), // Ensures no spaces
        ]),
        password: new FormControl('', [
          Validators.minLength(8), 
          Validators.maxLength(30),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
        confirmPassword: new FormControl('', [
          Validators.required,
        ]),
        acceptTerms: new FormControl(false),
      });

    private subs: Array<Subscription> = [];
    hide = true;
    passwordStrength = 0;
      
    private formBuilder: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    private platformId: object =  inject(PLATFORM_ID);
    private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);

    constructor(private router: Router) {
    this.browser = isPlatformBrowser(this.platformId);

      this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
    });
    }

    isUserNameValid(): boolean {
      return this.registerForm3.get('userName')?.valid ?? false;
    }

    onPasswordInput() {
      const passwordValue = this.registerForm3.get('password')?.value;
      this.showPasswordHint = passwordValue.length > 0; // Show hint when at least one character is entered
    }
 
    ngOnInit(): void {
      this.maxYear = new Date().getFullYear();
      this.minYear = new Date().getFullYear() - 70;
      const currentYear = new Date().getFullYear();
      this.registerForm1 = this.formBuilder.group(
        {
          joinAs: [
            'student',
            [
              Validators.required
            ],
          ],
          dobMonth: ['', [Validators.required]],
          dobDay: ['', [Validators.required,this.numberRangeValidator(1, 31)]],
          dobYear: ['', [Validators.required, this.numberRangeValidator(1900, new Date().getFullYear())]],
        }
      );
        this.registerForm2 = this.formBuilder.group(
          {
            firstName: [
              '',
              [
                Validators.required,
                Validators.maxLength(32),
              ],
            ],
            lastName: [
              '',
              [
                Validators.required,
                Validators.maxLength(32),
              ],
            ],
            userName: [
              '',
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(32),
              ],
            ],
            email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            password: [
              '',
              [
                Validators.required,
                Validators.minLength(8), 
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
                Validators.maxLength(40),
              ],
            ],
            confirmPassword: ['', Validators.required],
          //   acceptTerms: [false, Validators.requiredTrue],
          },
          {
            validators: [Validation.match('password', 'confirmPassword')],
          }
        );
        this.registerForm3 = this.formBuilder.group(
          {
            firstName: [
              '',
              [
                Validators.required,
                Validators.pattern(/^[a-zA-Z'’\- ]+$/), // Alphabets, spaces, hyphens, and apostrophes allowed
                Validators.maxLength(32),
              ],
            ],
            lastName: [
              '',
              [
                Validators.required,
                Validators.pattern(/^[a-zA-Z'’\- ]+$/), // Same pattern as firstName
                Validators.maxLength(32),
              ],
            ],
            email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            userName: [
              '',
              [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(32),
                Validators.pattern(/^[a-zA-Z0-9._-]+$/), // Allows alphanumeric, dots, underscores, and hyphens
              ],
            ],
            password: [
              '',
              [
                Validators.required,
                Validators.minLength(8), 
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
                Validators.maxLength(40),
              ],
            ],
            confirmPassword: ['', Validators.required],
          //   acceptTerms: [false, Validators.requiredTrue],
          },
          {
            validators: [Validation.match('password', 'confirmPassword')],
          }
        );
       
          // Subscribe to value changes for a specific form control
      // this.subs.push(this.registerForm1.get('joinAs').valueChanges.subscribe(value => {
      //   console.log('Join As value changed:', value);
      //   // Add your custom logic here
      //      // Check if the value is 'student' and set validators accordingly
      //   if (value === 'student') {
      //     this.registerForm1.get('dobMonth')?.setValidators([Validators.required]);
      //     this.registerForm1.get('dobDay')?.setValidators([Validators.required]);
      //     this.registerForm1.get('dobYear')?.setValidators([Validators.required]);
      //   } else {
      //     // If the value is 'parent' or 'teacher', remove the validators
      //     this.registerForm1.get('dobMonth')?.clearValidators();
      //     this.registerForm1.get('dobDay')?.clearValidators();
      //     this.registerForm1.get('dobYear')?.clearValidators();
      //   }

      //   // Update the validity status of the form controls
      //   this.registerForm1.get('dobMonth')?.updateValueAndValidity();
      //   this.registerForm1.get('dobDay')?.updateValueAndValidity();
      //   this.registerForm1.get('dobYear')?.updateValueAndValidity();
      // }));

      this.registerForm3.get('userName')?.valueChanges.subscribe(value => {
          
          if(this.registerRequest.login !== value){
            this.isUserNameAvailable = false;
            this.isUserNameChecked = false;
          }
      }); 

      this.registerForm3.get('email')?.valueChanges.subscribe(value => {
        if(this.registerRequest.email !== value){
          this.signUpError = false;
        }
    }); 

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

  preventSpaces(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }
    onFirstFormSubmit(): void {
      console.log('onSubmit - 1');
      

       // Mark all form controls as touched to trigger validation
      this.markFormGroupTouched(this.registerForm1);

      if (this.registerForm1.invalid) {
        return;
      }
      console.log('onSubmit - 2');
      this.showSignUpSecondStep = true;

      this.registerRequest.userType = this.registerForm1.controls['joinAs'].value;
      const month = String(this.registerForm1.controls['dobMonth'].value).padStart(2, '0');
      const day = String(this.registerForm1.controls['dobDay'].value).padStart(2, '0');
      const year = this.registerForm1.controls['dobYear'].value;
      this.registerRequest.dob = month + '/' + day + '/' + year;
      this.registerRequest.langKey = "en";
     
      console.log('onSubmit - 3');
  
    }

    onSecondFormSubmit():void{
      console.log('onSecondFormSubmit - 1');
         // Mark all form controls as touched to trigger validation
         this.markFormGroupTouched(this.registerForm3);
      if (this.registerForm3.invalid || !this.isUserNameAvailable) {
        return;
      }
      console.log('onSecondFormSubmit - 2');
      this.isLoading = true;
      this.registerRequest.firstName = this.registerForm3.controls['firstName'].value; 
      this.registerRequest.lastName = this.registerForm3.controls['lastName'].value; 
      this.registerRequest.email = this.registerForm3.controls['email'].value; 
      this.registerRequest.password = this.registerForm3.controls['password'].value; 
      this.registerRequest.login = this.registerForm3.controls['userName'].value; 
      this.registerRequest.langKey = "en";
      this.registerForm3.disable();
      this.authService.signUp(this.registerRequest).subscribe((resp) => {

        
        // Define queryParams object with an index signature
        this.registerForm3.enable();
        const queryParams: {
          [key: string]: string; // Index signature for string keys with string values
        } = {
          userName: this.registerRequest.login// Example value
        };
        // const queryParams = { userName: this.registerRequest.login }; 

        const queryParamsString = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');
      
        const url = `/activate?${queryParamsString}`; // Replace 'your-target-route' with your actual route path

          this.router.navigateByUrl(url);
      }, (error) => {
        
        this.signUpError = true;
        this.isLoading = false;
        this.registerForm3.enable();

      });

    }

    onStudentFormSubmit(){
      console.log('onStudentFormSubmit - 1');
         // Mark all form controls as touched to trigger validation
         this.markFormGroupTouched(this.registerForm3);
      if (this.registerForm3.invalid) {
        return;
      }
      console.log('onStudentFormSubmit - 2');

      this.registerRequest.firstName = this.registerForm3.controls['firstName'].value; 
      this.registerRequest.lastName = this.registerForm3.controls['lastName'].value; 
      this.registerRequest.login = this.registerForm3.controls['userName'].value; 
      this.registerRequest.langKey = "en";
      // if(this.registerForm1.controls['joinAs'].value === 'student'){
        this.registerRequest.email = this.registerForm3.controls['email'].value; 
      // }else{
      //   this.registerRequest.personalEmialID = this.registerForm3.controls['email'].value; 
      // }
      this.registerRequest.password = this.registerForm3.controls['password'].value; 

      this.authService.signUp(this.registerRequest).subscribe((resp) => {
        // Define queryParams object with an index signature
        const queryParams: {
          [key: string]: string; // Index signature for string keys with string values
        } = {
          userName: this.registerRequest.login// Example value
        };
        // const queryParams = { userName: this.registerRequest.login }; 

        const queryParamsString = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');
      
        const url = `/activate?${queryParamsString}`; // Replace 'your-target-route' with your actual route path

          this.router.navigateByUrl(url);
      }, (error) => {

      });
    }


    checkUserName($event: any){
      $event.stopPropagation();
      
      this.isUserNameChecked = true;
      this.isUserNameCheckInProgress = true;

      let userNameRequest: CheckUserNameRequest = new CheckUserNameRequest();
      userNameRequest.login = this.registerForm3.get('userName')?.value;
      
      console.log('checkUserName = ' + userNameRequest.login);
      this.subs.push(this.authService.checkUserName(userNameRequest).subscribe((resp: any) => {
        if(resp.response === 'User Not Found'){
          this.isUserNameCheckInProgress = false;
          this.isUserNameAvailable = true;
        }else {
          this.isUserNameCheckInProgress = false;
          this.isUserNameAvailable = false;
        }
        // setTimeout(() => {
        //   this.isUserNameCheckInProgress = false;
          
        //   this.isUserNameAvailable = true;
        //   }, 1000);
        this.subs.forEach(s => s.unsubscribe());
      }));
     
    }
   
    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }
  
    onReset(): void {
      this.registerForm2.reset();
    }


  moveToNextSlide($event: any){
    this.showSignUpSecondStep = true;
  }

  backToSignUpFirstStep($event: any){
    this.showSignUpSecondStep = false;
  }


  // Custom validator to validate if the input value is a valid number and within a specified range
 numberRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = parseFloat(control.value);
    if (isNaN(value) || value < min) {
      return { 'min': { min: min } }; // Return error object with 'min' key and minimum value
    }
    if (value > max) {
      return { 'max': { max: max } }; // Return error object with 'max' key and maximum value
    }
    return null;
  };
}

/**
 * Custom validator to check if `password` and `confirmPassword` fields match.
 */
private passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { matching: true };
};
}
