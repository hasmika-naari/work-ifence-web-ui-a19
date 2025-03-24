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
import { IfenceService } from 'src/app/services/ifence.service';
import { ServiceRequestItem } from 'src/app/services/store/app-store.model';

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
  serviceRequestForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    requestType: ['', Validators.required],
    requestDescription: ['', Validators.required]
  });

  constructor(
    private snackBar: MatSnackBar,
    private ifenceService: IfenceService
  ) {
      this.browser = isPlatformBrowser(this.platformId);
      this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
    });
    
     }

  ngOnInit() {
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
    return this.serviceRequestForm.controls;
  }

  onSubmit() {
    if (this.serviceRequestForm.valid) {
      this.loading = true; // Show progress bar
      let serviceRequest = new ServiceRequestItem();
      let dateTime = new Date();
      serviceRequest.firstName = this.serviceRequestForm.controls.firstName.value? this.serviceRequestForm.controls.firstName.value : "";
      serviceRequest.lastName = this.serviceRequestForm.controls.lastName.value? this.serviceRequestForm.controls.lastName.value : "";
      serviceRequest.email = this.serviceRequestForm.controls.email.value? this.serviceRequestForm.controls.email.value : "";
      serviceRequest.phone = this.serviceRequestForm.controls.phone.value? this.serviceRequestForm.controls.phone.value: "";
      serviceRequest.requestType = this.serviceRequestForm.controls.requestType.value? this.serviceRequestForm.controls.requestType.value : "";
      serviceRequest.requestDescription = this.serviceRequestForm.controls.requestDescription.value? this.serviceRequestForm.controls.requestDescription.value : "";
      serviceRequest.createdDate = dateTime.toISOString();
      serviceRequest.lastModifiedBy = serviceRequest.email;
      serviceRequest.lastModifiedDate = serviceRequest.createdDate;
      serviceRequest.status = "New"

      this.ifenceService.saveServiceRequest(serviceRequest).subscribe(e => {
        this.loading = false;
      })

      // Simulate API request
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Feedback Submitted Successfully!', 'Close', {
          duration: 3000
        });
        this.serviceRequestForm.reset();
        Object.keys(this.serviceRequestForm.controls).forEach(key => {
          this.serviceRequestForm.get(key)?.setErrors(null);
        });
      }, 2000);
    }
  }

}
