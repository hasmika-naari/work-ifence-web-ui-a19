import { Component, OnInit, Input, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FormValidatorUtilService } from 'src/app/services/app-validators';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { EmailSubscription } from 'src/app/services/bee-compete.model';

@Component({
  selector: 'app-language-subscribe1',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressBarModule, ReactiveFormsModule],
  templateUrl: './language-subscribe.component.html',
  styleUrls: ['./language-subscribe.component.scss']
})
export class LanguageSubscribeComponent implements OnInit, OnDestroy {

  @Input() isMobile: boolean = false;

  emailFormGroup!: UntypedFormGroup;
  public email!: string;
  emaiLRegistered:any = false;
  emailRegisteredNum = 0;
  subs: Array<Subscription> = [];
  actionInProgress = false;

  private platformId: object =  inject(PLATFORM_ID);
  constructor(
      public formBuilder: UntypedFormBuilder,
      public snackBar: YeaSnackBarService,
      private _localStorageService: LocalStorageService,
      private appValidators: FormValidatorUtilService,
      public appConstants: AppConstantsService) {
        if(isPlatformBrowser(this.platformId)){
          this.emaiLRegistered = this._localStorageService.getItem('wifenceRegistered');
          ;
          }
       }

  ngOnInit(): void {
    this.emailFormGroup = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, this.appValidators.emailValidator])],
    });

    if(!this.emaiLRegistered.notoken){
      ;
      // this.subs.push(this.emaiLRegistered$.subscribe(er => {
      //   this.emaiLRegistered = er;
      //   this.actionInProgress = false;
      //   if(this.emaiLRegistered){
      //     this._localStorageService.setItem('naariRegistered', true);
      //     this.emailRegisteredNum++;
      //   }
      // }));
    }else {
      this.emailFormGroup.controls['email'].disable();
      this.emailRegisteredNum = 2;
    }
  }
  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }

  public onRegisterFormSubmit(values:Object):void {
    if (this.emailFormGroup.valid && !this.emaiLRegistered) {
      let country = this._localStorageService.getItem('wifenceCountry');
      if(country){
        country = country.replace(/\"/g, " ");
        country = country.replace(/\s+/g, '');
        country = country.replace(/\\/g, '');
      }
      let emailSub: EmailSubscription = new EmailSubscription();
         emailSub.country = country;
         emailSub.email = this.emailFormGroup.controls['email'].value;
         emailSub.createdDate = new Date().toUTCString();
         emailSub.status = 'active';
         emailSub.remarks = 'active';
      this.actionInProgress = true;
      // this.dealFacade.postSubscription(emailSub);
      // this.snackBar.openSnackBar('You registered successfully!',this.appConstants.snackbarType.SUCCESS, 3000);
    }else{
      if(!this.emaiLRegistered){
        this.snackBar.openSnackBar('Please enter valid email address!', this.appConstants.snackbarType.ERROR, 3000);
      }
    }

    if(this.emaiLRegistered){
      this.snackBar.openSnackBar('You have already registered!', this.appConstants.snackbarType.ERROR, 3000);
    }
  }
}
