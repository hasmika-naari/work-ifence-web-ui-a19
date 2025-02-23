import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeCustomizerService } from '@app/services/theme-customizer/theme-customizer.service';
import { FooterComponent } from '@app/components/general/footer/footer.component';
import { WorkIfenceDataService } from '@app/services/work-ifence-data.service';
import { Category, PCategory } from '@app/services/deals.model';
import * as _ from 'lodash';
import { LanguageSubscribeComponent } from '@app/components/general/language-subscribe/language-subscribe.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HeaderStyleComponent } from '../work-ifence-home/header/header.component';
import { SidenavService } from 'src/app/layout/sidenav/sidenav.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
            CommonModule, RouterLink,LanguageSubscribeComponent,
            ReactiveFormsModule, NgOptimizedImage, HeaderStyleComponent,
            FooterComponent
          ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactComponent implements OnInit {
  isToggled = false;
  categories: Array<Category> = new Array<Category>();
  pCategories: Array<PCategory> = new Array<PCategory>();
	private dealsService: WorkIfenceDataService= inject(WorkIfenceDataService);
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  public themeService: ThemeCustomizerService=  inject(ThemeCustomizerService);
  private sidenavService: SidenavService = inject(SidenavService);

  private platformId: object =  inject(PLATFORM_ID);
  private formBuilder: FormBuilder = inject(FormBuilder);
  feedbackSubmitted = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;

  public feedbackForm: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    phonenumber: new FormControl(''),
    subject: new FormControl(''),
    message: new FormControl(false),
  });

  constructor() {
      this.browser = isPlatformBrowser(this.platformId);
      this.themeService.isToggled$.subscribe((isToggled: boolean) => {
        this.isToggled = isToggled;
    });
     }

  ngOnInit() {

    this.feedbackForm = this.formBuilder.group(
      {
        fullname: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phonenumber: ['', [Validators.required]],
        subject: [
          '', 
          [
            Validators.required, 
            Validators.minLength(10),
            Validators.maxLength(128)
          ]
        ],
        message: [
          '', 
          [
            Validators.required, 
            Validators.minLength(10),
            Validators.maxLength(512)
          ]
        ],
      }
      
    );

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

      //this.sidenavService.setCollapsed(true);

    } 
  }

  get f(): { [key: string]: AbstractControl } {
    return this.feedbackForm.controls;
  }

  onSubmit(): void {
    this.feedbackSubmitted = true;
    console.log('onSubmit - 1');
    if (this.feedbackForm.invalid) {
      return;
    }
    console.log('onSubmit - 2');

    // let registerRequest = new RegisterRequest();
    // registerRequest.login = this.registerForm.value.username; 
    // registerRequest.email = this.registerForm.value.email; 
    // registerRequest.password = this.registerForm.value.password;
    // registerRequest.langKey = "en";
    // this.authService.signUp(registerRequest).subscribe((resp) => {
    //     this.activationForm.controls['username'].setValue(this.registerForm.value.username);
    //     this.activationForm.controls['username'].disable();

    //     this.showActivationForm = true;
    // }, (error) => {

    // });
    console.log('onSubmit - 3');

    console.log(JSON.stringify(this.feedbackForm.value.fullname, null, 2));
  }

fetchData(): void{
  this.dealsService.getCategoriesByCountry('usa', this.platformId).subscribe((categories) => {
    this.categories = [...categories];
    /// divide into parentList
    // Group categories by parent and map them to the desired format
    this.pCategories = [..._.map(
        _.groupBy(categories, 'parent'),
        (categories, parent) => ({ parent, categories }))];
  });
}

}
