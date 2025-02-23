import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map, startWith } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { JobApplication, JobApplicationDetails, Resume, ResumeContact } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JobApplicationStatus, JobMode, JobType, ResumeAccess, ResumeCategory, ResumeRoleLevel } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { Account, LoginProfile } from 'src/app/services/profile.model';
import { ResumeService } from 'src/app/services/resume.service';
import { AuthService } from 'src/app/services/auth.service';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-login-form-editor',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,
    MatCheckboxModule, MatAutocompleteModule,MatProgressSpinnerModule,
    MatInputModule,ButtonModule,OverlayPanelModule,MatTooltipModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './login-form-editor.component.html',
  styleUrls: ['./login-form-editor.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class LoginFormEditorComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  jobApplication : Signal<JobApplication> = this.userStore.getSelectedJobApplication();
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  visible = true;
  outLineButton = true;
  
  emailUpdateInProgress: boolean = false;
  emailAcodeUpdateInProgress: boolean = false;
  invalidActivationCode: boolean = false;
  showCancelOption: boolean = false;
  emailValidationRequired : boolean = false;
  emailUpdateRequested : boolean = false;
  emailUpdateError: boolean = false;
  emailUpdateErrorMessage: string = ''; 
  emailValidationCodeSubmiRequired : boolean = false;
  originalEmail: string = '';
  submittedAcCode: string = '';
  phoneUpdateInProgress: boolean = false;
  phoneUpdateRequired : boolean = false;
  phoneUpdateRequested : boolean = false;
  phoneUpdateError: boolean = false;
  phoneNumberUpdateSuccess: boolean = false;
  emailUpdateSuccess: boolean = false;
  loginProfile: Signal<LoginProfile> = this.userStore.getUserLoginProfile();
  @Output() actionInProgress = new EventEmitter();
  @Output() formSaved = new EventEmitter();

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog,
      public resumeService : ResumeService,
      public authService : AuthService) {
        effect(()=>{
        //   this.setContactValues()
        })
      }

 
  subs: Array<Subscription> = [];

  actual_email : string = ''
  actual_Phone : string = ''

  loginForm = this._formBuilder.group({
    username: [''],
    password: [''],
    phone_number: ['', [ Validators.pattern('^(?:(?:\\+91|91|0)?\\d{10})$|^(?:(?:\\+1|1)?[-.\\s]?(\\d{3}|\\(\\d{3}\\))[-.\\s]?\\d{3}[-.\\s]?\\d{4})$')]],
    email: ['', [ Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    validate_code : ['']
  })

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggle() {
}

  ngOnInit() {
    this.emailUpdateInProgress = false;
    this.phoneUpdateInProgress = false;

    this.actual_email = this.loginProfile().emailId;
    this.setLoginForm();
    this.loginForm.controls['username'].disable();
    this.loginForm.controls['password'].disable();
    // this.loginForm.controls['validate_code'].disable();

    this.loginForm.controls['email'].valueChanges.subscribe((val: any) => {
        console.log(val, this.loginProfile().emailId,val === this.loginProfile().emailId, this.loginForm.controls['email'].valid);

        if((val === this.actual_email)){
            console.log("If entered");
            this.emailValidationRequired = false;
            this.emailUpdateError = false;
            this.emailUpdateErrorMessage = '';
            this.loginForm.controls['validate_code'].reset()
            // this.loginForm.controls['validate_code'].disable()
        }else if(this.loginForm.controls['email'].valid){
            console.log("If else entered");
            this.emailUpdateError = false;
            this.emailUpdateErrorMessage = '';
            this.emailValidationRequired = true;
            this.loginForm.controls['validate_code'].enable()
        }
        else{
          this.emailUpdateError = false;
          this.emailUpdateErrorMessage = '';
            // this.emailValidationRequired = false;
            // this.loginForm.controls['validate_code'].reset()
            // this.loginForm.controls['validate_code'].disable()
        }
    });

    this.loginForm.controls['validate_code'].valueChanges.subscribe((val: any) => {

      if(this.submittedAcCode !== val){
        this.invalidActivationCode = false;
      }
      
    });



    this.loginForm.controls['phone_number'].valueChanges.subscribe((val: any) => {
      
      if((val === this.actual_Phone)){
          console.log("If entered");
          this.phoneUpdateRequired = false;
      }else if(this.loginForm.controls['phone_number'].valid){
          console.log("If else entered");
          this.phoneUpdateRequired = true;
      }
      else{
          this.phoneUpdateRequired = false;
      }
  });
  }

  submitActivationCode(){
    this.emailAcodeUpdateInProgress = true;
    // call API to update email
    let neEmail : string = '';
    let acCode : string = '';
    neEmail = this.loginForm.controls['email'].value?this.loginForm.controls['email'].value : '';
    acCode = this.loginForm.controls['validate_code'].value?this.loginForm.controls['validate_code'].value : '';
    this.submittedAcCode = acCode;
    this.loginForm.controls['email'].disable();
    this.loginForm.controls['validate_code'].disable();
    
    this.authService.changeEmail(neEmail, acCode).subscribe((e)=>{
        
        this.emailAcodeUpdateInProgress = false;
        this.showCancelOption = true;

        if(e.response === 'Activation code is incorrect.'){
          this.invalidActivationCode = true;
          this.loginForm.controls['validate_code'].enable();
          // this.emailValidationCodeSubmiRequired = true;
          this.emailValidationRequired = true;
        }else if(e.response === 'Email changed successfully'){
          this.userStore.setEmailInLoginProfile(neEmail);
          this.invalidActivationCode = false;
          this.showCancelOption = false;
          this.emailValidationCodeSubmiRequired = false;
          this.loginForm.controls['email'].enable();
          this.loginForm.controls['validate_code'].enable();
          this.loginForm.controls['validate_code'].reset();
          this.emailValidationRequired = false;
          this.phoneNumberUpdateSuccess = false;
          this.emailUpdateSuccess = true;

          setTimeout(() => {
            this.emailUpdateSuccess = false;
          }, 1500);
        }
    })
  }

  updateEmail($event: any){
    this.emailUpdateInProgress = true;
    // call API to update email
    let neEmail : string = '';
    neEmail = this.loginForm.controls['email'].value?this.loginForm.controls['email'].value : '';
    this.loginForm.controls['email'].disable();
    this.authService.changeEmailVerify(neEmail).subscribe((e)=>{
        
        this.emailUpdateInProgress = false;
        this.showCancelOption = true;

        if(e.response === 'Activation code sent successfully'){
          this.emailValidationCodeSubmiRequired = true;
          this.emailValidationRequired = true;
        }else {
          this.showCancelOption = false;
          this.loginForm.controls['email'].enable();
          this.emailUpdateError = true;
          this.emailUpdateErrorMessage = e.response;
        }
    })

  }

  cancelEmailUpdate(){
    this.loginForm.controls['email'].enable();
    this.loginForm.controls['email'].setValue(this.loginProfile().emailId);
    this.emailUpdateInProgress = false;
    this.emailValidationCodeSubmiRequired = false;
    this.emailValidationRequired = false;
    this.showCancelOption = false;
  }

  updatePhoneNumber($event: any){
    this.phoneUpdateInProgress = true;
  }


  setLoginForm(){
    this.loginForm.controls['username'].setValue(this.loginProfile().userName);
    this.loginForm.controls['password'].setValue("********");
    this.loginForm.controls['phone_number'].setValue(this.loginProfile().phoneNumber);
    this.loginForm.controls['email'].setValue(this.loginProfile().emailId);
  }

  saveLoginForm(){
    this.actionInProgress.emit()
    let form : LoginProfile = this.loginProfile();
    form.phoneNumber = this.loginForm.controls['phone_number'].value?this.loginForm.controls['phone_number'].value : '';
    form.emailId = this.loginForm.controls['email'].value?this.loginForm.controls['email'].value : '';

    this.authService.saveLoginProfile(form).subscribe((e)=>{
        this.userStore.setLoginProfile(e);
        this.formSaved.emit()
    })
    
  }

  patchLoginForm(){
    let form : LoginProfile = this.loginProfile();
    form.phoneNumber = this.loginForm.controls['phone_number'].value?this.loginForm.controls['phone_number'].value : '';
    this.phoneUpdateInProgress = true;
    this.authService.patchLoginProfile(form).subscribe((e)=>{
      this.phoneUpdateInProgress = false;
      this.phoneUpdateRequired = false;
    const ulProfile : LoginProfile = this.loginProfile();
      ulProfile.emailId = this.loginProfile().emailId;
      this.userStore.setPhoneInLoginProfile(form.phoneNumber);
      this.phoneNumberUpdateSuccess = true;
      setTimeout(() => {
        this.phoneNumberUpdateSuccess = false;
      }, 1500);
    })
    
  }


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

