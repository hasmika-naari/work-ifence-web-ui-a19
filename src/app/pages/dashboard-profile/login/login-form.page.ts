import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs";
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { CommonModule, Location } from '@angular/common';
import { Account, BioProfile, LoginProfile, Profile } from 'src/app/services/profile.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { LoginProfileUpdateRequest } from 'src/app/services/signup.model';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'login-profile-form',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule, MatButtonModule, MatOptionModule,
    MatIconModule, MatCardModule, MatProgressBarModule,
          FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login-form.page.html',
  styleUrls: ['./login-form.page.scss'],
})
export class LoginProfileFormPage implements OnInit, OnChanges, OnDestroy {
  
  pageTtitle = 'Login Profile';
 ////////////////////////////////////////////////
 htmlText ="<p>Login Form</p>"
 hasFocus = false;
 subject: string = '';

//////////////////////////////////////////////////
  private _subscriptions: Array<Subscription> = new Array<Subscription>();
  public inputType = 'password';

  actionInProgress$!: Observable<Boolean>;;

  public visible = false;
  public loginProfileForm!: FormGroup;
  public isUserNameAvailable$!: Observable<boolean>;
  offEdit : Boolean = false
  actionInProgress =  false;

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private userStore: UserStoreService = inject(UserStoreService);
  private appUtilService: AppUtilService = inject(AppUtilService);
  private constantService: AppConstantsService  = inject(AppConstantsService);

  userAccount: Signal<Account> = this.userStore.getUserAccount();
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  loginProfile: Signal<LoginProfile> = this.userStore.getUserLoginProfile();
  private snackBarService: YeaSnackBarService  = inject(YeaSnackBarService);
  private router: Router = inject(Router);

  @Output() editLogin = new EventEmitter();

  constructor(
    public bottomSheet : MatBottomSheet,
    public location: Location,
    private cd: ChangeDetectorRef,
  ) {
   
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.loginProfileForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: [''],
      passwordConfirm: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern('^(?:(?:\\+91|91|0)?\\d{10})$|^(?:(?:\\+1|1)?[-.\\s]?(\\d{3}|\\(\\d{3}\\))[-.\\s]?\\d{3}[-.\\s]?\\d{4})$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    });
    this.authService.getLoginProfile(this.userAccount().login).subscribe(

      (loginProfile: LoginProfile) => {
          if(!loginProfile.id){
            this.snackBarService.openSnackBar('Your Account not Created', this.constantService.snackbarType.ERROR, 2500);
            this.router.navigate(['/register']);
          }
          else{
            this.userStore.updateLoginProfile(loginProfile);

            this.loginProfileForm.controls['userName'].setValue(this.loginProfile().userName);
            this.loginProfileForm.controls['userName'].disable();
            this.loginProfileForm.controls['password'].setValue("************");
            this.loginProfileForm.controls['passwordConfirm'].setValue(this.loginProfile().password);
            this.loginProfileForm.controls['phoneNumber'].setValue(this.loginProfile().phoneNumber);
            this.loginProfileForm.controls['email'].setValue(this.loginProfile().emailId);
            this.loginProfileForm.controls['email'].disable();
          }
        });
        
  }

ngOnChanges(changes: SimpleChanges): void {
    
}

editLoginProfile($event: any){
 this.editLogin.emit()
}

saveLoginProfile($event: any){

    let loginProfile: LoginProfileUpdateRequest = new LoginProfileUpdateRequest();

    loginProfile.userName = this.loginProfileForm.controls['userName'].value;
    loginProfile.phoneNumber = this.loginProfileForm.controls['phoneNumber'].value;
    loginProfile.password = this.loginProfileForm.controls['password'].value;
    loginProfile.emailId = this.loginProfileForm.controls['email'].value;;
    loginProfile.activationCode = this.loginProfile().activationCode;
    loginProfile.memberId =  this.loginProfile().memberId;
    loginProfile.status = this.loginProfile().status;
    loginProfile.userId = this.loginProfile().userId;
    loginProfile.id = this.loginProfile().id;

      this.authService.saveLoginProfile(loginProfile).subscribe((resp) => {
        console.log('Save Bio Profile' + resp);
        this.authService.getLoginProfile(this.userAccount().login).subscribe(bio => {
          this.userStore.updateLoginProfile(bio);
          this.offEdit = false;
          this.actionInProgress = false;
        })
      });

}


cancelChanges($event: any){
  this.offEdit = false;
  // this.location.back();
}

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

}
