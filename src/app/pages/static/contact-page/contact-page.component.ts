import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LanguageSubscribeComponent } from '../../language-subscribe/language-subscribe.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { Category } from 'src/app/services/ifence.model';
import { PCategory } from 'src/app/services/bee-compete.model';
import { WorkifenceDataService } from 'src/app/services/bee-compete-data.service';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
            CommonModule, RouterLink,LanguageSubscribeComponent, MatFormFieldModule,
            ReactiveFormsModule, NgOptimizedImage, HeaderWorkIfenceComponent,
            MatSelectModule, MatProgressBarModule, MatCardModule, FormsModule,
            FooterComponent, FooterWorkifenceComponent, MatSnackBarModule,
            MatInputModule, MatButtonModule
          ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactComponent implements OnInit {
  isToggled = false;
  categories: Array<Category> = new Array<Category>();
  pCategories: Array<PCategory> = new Array<PCategory>();
	private dealsService: WorkifenceDataService= inject(WorkifenceDataService);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  public themeService: ThemeCustomizerService=  inject(ThemeCustomizerService);
  private platformId: object =  inject(PLATFORM_ID);
  private formBuilder: FormBuilder = inject(FormBuilder);
  feedbackSubmitted = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;

  loading: boolean = false;
  requestTypes = [
    { value: 'newOrg', label: 'Request for new Org Account' },
    { value: 'newFeature', label: 'Request for New Feature' },
    { value: 'loginIssue', label: 'Issue with Login' }
  ];
  feedbackForm: FormGroup<{ firstName: FormControl<string | null>; lastName: FormControl<string | null>; emailId: FormControl<string | null>; phoneNumber: FormControl<string | null>; requestType: FormControl<string | null>; requestDescription: FormControl<string | null>; }>;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
      this.browser = isPlatformBrowser(this.platformId);
      this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
    });
    this.feedbackForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      requestType: ['', Validators.required],
      requestDescription: ['', Validators.required]
    });
     }

  ngOnInit() {
    this.fetchData();
    if(this.browser){
      if(this.deviceService.isDesktop()){
        this.isDesktop = true;
        this.isMobile = false;
        this.isTablet = false;
      }else if(this.deviceService.isMobile()){
        this.isMobile = true;
        this.isDesktop = false;
        this.isTablet = false;
      }else if(this.deviceService.isTablet()){
        this.isTablet = true;
        this.isMobile = false;
        this.isDesktop = false;
      }
    } 
  }

  get f(): { [key: string]: AbstractControl } {
    return this.feedbackForm.controls;
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.loading = true; // Show progress bar

      // Simulate API request
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Feedback Submitted Successfully!', 'Close', {
          duration: 3000
        });
        this.feedbackForm.reset();
      }, 2000);
    }
  }

  // onSubmit(): void {
  //   this.feedbackSubmitted = true;
  //   console.log('onSubmit - 1');
  //   if (this.feedbackForm.invalid) {
  //     return;
  //   }
  //   console.log('onSubmit - 2');

  //   // let registerRequest = new RegisterRequest();
  //   // registerRequest.login = this.registerForm.value.username; 
  //   // registerRequest.email = this.registerForm.value.email; 
  //   // registerRequest.password = this.registerForm.value.password;
  //   // registerRequest.langKey = "en";
  //   // this.authService.signUp(registerRequest).subscribe((resp) => {
  //   //     this.activationForm.controls['username'].setValue(this.registerForm.value.username);
  //   //     this.activationForm.controls['username'].disable();

  //   //     this.showActivationForm = true;
  //   // }, (error) => {

  //   // });
  //   console.log('onSubmit - 3');

  //   console.log(JSON.stringify(this.feedbackForm.value.fullname, null, 2));
  // }

fetchData(): void{
  // this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
  //   this.categories = [...categories];
  //   /// divide into parentList
  //   // Group categories by parent and map them to the desired format
  //   this.pCategories = [..._.map(
  //       _.groupBy(categories, 'parent'),
  //       (categories, parent) => ({ parent, categories }))];
  // });
}

}
