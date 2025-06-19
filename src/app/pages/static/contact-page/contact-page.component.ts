import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LanguageSubscribeComponent } from '../../language-subscribe/language-subscribe.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { Category } from 'src/app/services/ifence.model';
import { PCategory } from 'src/app/services/bee-compete.model';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ContactFormComponent } from '../../dashboard-requests/contact-form/contact-form.component';
import { AppStoreService } from 'src/app/services/store/app-store.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
            CommonModule, RouterLink,LanguageSubscribeComponent, MatFormFieldModule,
            ReactiveFormsModule, NgOptimizedImage, HeaderWorkIfenceComponent,
            MatSelectModule, MatProgressBarModule, MatCardModule, FormsModule,
            FooterComponent, FooterWorkifenceComponent, MatSnackBarModule,
            MatInputModule, MatButtonModule, ContactFormComponent, MatDialogModule
          ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactComponent implements OnInit {
  isToggled = false;
  private appStore: AppStoreService = inject(AppStoreService);
  categories: Array<Category> = new Array<Category>();
  pCategories: Array<PCategory> = new Array<PCategory>();
  private deviceService: DeviceDetectorService=  inject(DeviceDetectorService);
  public themeService: ThemeCustomizerService=  inject(ThemeCustomizerService);
  private platformId: object =  inject(PLATFORM_ID);
  feedbackSubmitted = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  browser = false;
  action = "create";
  loading: Signal<boolean> = this.appStore.getActionInProgress();

  constructor() {
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

}
