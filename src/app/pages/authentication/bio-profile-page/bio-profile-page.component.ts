import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, Signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Account } from 'src/app/services/profile.model';
import { BioProfileAddRequest } from 'src/app/services/signup.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import Validation from 'src/app/services/utilities/validation';

@Component({
    selector: 'app-register-page',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule,
       NgOptimizedImage],
    templateUrl: './bio-profile-page.component.html',
    styleUrls: ['./bio-profile-page.component.scss']
})
export class BioProfilePageComponent implements OnInit {

    isToggled = false;
    isMobile = false;
    isTablet = false;
    isDesktop = true;
    isBrowser!: boolean;
    bioProfileSubmitted = false;
    private router: Router= inject(Router);
    
    public bioProfileForm: FormGroup = new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      dob: new FormControl(''),
      gender: new FormControl(''),
      imageurl: new FormControl(''),
      phonenumber: new FormControl(''),
      });

    private formBuilder: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    private userStore: UserStoreService = inject(UserStoreService);
    userAccount: Signal<Account> = this.userStore.getUserAccount();
    
    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
      this.bioProfileForm = this.formBuilder.group(
          {
            firstname: [
              '',
              [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20),
              ],
            ],
            lastname: [
              '',
              [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20),
              ],
            ],
            dob: ['', [Validators.required]],
            gender: ['-1', [Validators.required]],
            phonenumber: ['', [Validators.required]],
            // imageurl: ['', [Validators.required]],
            validators: [Validation.match('password', 'confirmPassword')],
          }
      );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.bioProfileForm.controls;
      }
   
    
      onSubmit(): void {
        this.bioProfileSubmitted = true;
        console.log('onSubmit - 1');
        if (this.bioProfileForm.invalid) {
          return;
        }
        console.log('onSubmit - 2');

        let bioRequest = new BioProfileAddRequest();
        bioRequest.userName =  'username'; // load from the login account 
        bioRequest.firstName = this.bioProfileForm.value.firstname; 
        bioRequest.lastName = this.bioProfileForm.value.lastname;
        bioRequest.dob = this.bioProfileForm.value.dob;
        bioRequest.gender = this.bioProfileForm.value.gender;
        bioRequest.imageUrl = "assets/img/appicon.svg";

        this.authService.saveBioProfile(bioRequest).subscribe((resp) => {
          console.log('Save Bio Profile' + resp);
          this.router.navigate(['/']);
        });

        // let loginProfile : LoginProfile = Object.assign({},this.profile.login);
        // loginProfile.phoneNumber = this.bioProfileForm.value.phonenumber;
        // this.authService.saveLoginProfile(bioRequest).subscribe((resp) => {
        // });
        console.log(JSON.stringify(this.bioProfileForm.value, null, 2));
      }

      onCancel(): void {
        
        this.router.navigate(['/']);
      }

}