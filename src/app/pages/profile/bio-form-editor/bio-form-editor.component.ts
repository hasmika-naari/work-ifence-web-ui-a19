import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
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
import { Account, BioProfile, LoginProfile } from 'src/app/services/profile.model';
import { ResumeService } from 'src/app/services/resume.service';
import { AuthService } from 'src/app/services/auth.service';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-bio-form-editor',
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
    MatCheckboxModule, MatAutocompleteModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './bio-form-editor.component.html',
  styleUrls: ['./bio-form-editor.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class BioFormEditorComponent implements OnInit, OnDestroy, OnChanges {

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
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  @Output() actionInProgress = new EventEmitter();
  @Output() formSaved = new EventEmitter();
  @Input() formClosed! : boolean

  genders : string[] = ['Male', 'Female']
  max_Date : Date;


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
        const today = new Date();
        this.max_Date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        effect(()=>{
        //   this.setContactValues()
        })
      }

 
  subs: Array<Subscription> = [];

  bioForm = this._formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    dob: [null as Date | null, Validators.required],
    gender: ['', Validators.required],
  })

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggle() {
}

  ngOnInit() {
    this.setBioForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formClosed'] && changes['formClosed'].currentValue) {
      this.imageBase64 = null
      this.change_in_profile = false
    }
  }



  setBioForm(){
    console.log(this.bioProfile());
    this.bioForm.controls['first_name'].setValue(this.bioProfile().firstName);
    this.bioForm.controls['last_name'].setValue(this.bioProfile().lastName);
    const dob = this.bioProfile().dob ? new Date(this.bioProfile().dob) : null;
    this.bioForm.controls['dob'].setValue(dob);
    if(this.bioProfile().gender == '1'){
        this.bioForm.controls['gender'].setValue('Male');
    }
    else if(this.bioProfile().gender == '0'){
        this.bioForm.controls['gender'].setValue('Female');
    }
  }

  formatDateUsingLocale(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  saveBioForm(){
    this.actionInProgress.emit()
    if(this.imageBase64){
      this.uploadImagetoAWS1()
    }
    let form : BioProfile = this.bioProfile();
    form.firstName = this.bioForm.controls['first_name'].value?this.bioForm.controls['first_name'].value : '';
    form.lastName = this.bioForm.controls['last_name'].value?this.bioForm.controls['last_name'].value : '';
    form.dob = this.bioForm.controls['dob'].value?this.formatDateUsingLocale(new Date(this.bioForm.controls['dob'].value)) : '';
    if(this.bioForm.controls['gender'].value == 'Male'){
        form.gender = 1;
    }
    else{
        form.gender = 0;
    }
    form.imageUrl = this.imageUrl?this.imageUrl : this.bioProfile().imageUrl;

    this.authService.updateBioProfile(form).subscribe((e)=>{
        this.userStore.setBioProfile(e);
        this.change_in_profile = false
        this.formSaved.emit()
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

  // ------------------------------------------- Image Upload code ---------------------------------------------

  change_in_profile : boolean = false
  image_file! : File
  uploadImageUrl : string = ''
  imageUrl : string = ''
  fileBytes: string | ArrayBuffer | null = null;


  onFileSelected(event: any) {
    this.showProfileImage = true;
    this.change_in_profile = true;
    this.image_file = event.target.files[0];
    this.uploadImageUrl = this.image_file.name;
    let fileNameSplit = this.image_file.name.split('.');
    
    // this.imageUrl = "https://workifence.s3.amazonaws.com/"+ this.bioProfile().userName + "/profile_picture/" + "profile-large." + fileNameSplit[1];
    this.imageUrl = "https://workifence.s3.amazonaws.com/"+ this.bioProfile().userName + "/profile_picture/" + this.uploadImageUrl;
    if (this.image_file) {
      this.convertImageToBase64(this.image_file);
    }
  }

  onUploadHandler($event: any){
    this.uploadImageUrl = $event.fileName;
    this.imageUrl = "https://workifence.s3.amazonaws.com/"+ this.bioProfile().userName + "/profile_picture/" + this.uploadImageUrl;
  }

  convertImageToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer: ArrayBuffer | null = reader.result as ArrayBuffer; // Get the ArrayBuffer
      if (arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer); // Create a Uint8Array view
        this.imageBase64 = this.arrayBufferToBase64(uint8Array); // Convert to base64
      }
    };
    reader.readAsArrayBuffer(file);
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    buffer.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  getImageBase64(){
    if(!this.change_in_profile){
      // const uniqueSuffix = new Date().getTime();
      // if(isPlatformBrowser(this.platformId)){
      //   return this.bioProfile().imageUrl + "?" + uniqueSuffix;
      // }else{
        return this.bioProfile().imageUrl?this.bioProfile().imageUrl : 'assets/img/home/profile_fake.png' ;
      // }
    }
    return "data:image/png;base64, " + this.imageBase64;
  }

  uploadImagetoAWS(){
    const reader = new FileReader();
    reader.onload = () => {
      this.fileBytes = reader.result;
      
      const body = {
        imageBytes: this.fileBytes,
        path: this.bioProfile().userName + '/',
        filename: "profile_picture"
      };
      let fileNameSplit = this.image_file.name.split('.');
  
      // this.resumeService.uploadProfileImage(body, this.bioProfile().userName + "/profile_picture/",  "profile-large." + fileNameSplit[1]).subscribe((resp) => {
        this.resumeService.uploadProfileImage(body, this.bioProfile().userName + "/profile_picture/",  this.uploadImageUrl, this.bioProfile().imageUrl).subscribe((resp) => {
        console.log('Image Uploaded');
        
      });
    };
    reader.readAsArrayBuffer(this.image_file);
    
   
  }

  uploadImagetoAWS1(){
    const reader = new FileReader();
    reader.onload = () => {
      const imageBytes = new Uint8Array(reader.result as ArrayBuffer);
      
      const body = {
        imageBytes: Array.from( imageBytes),
      };
      let fileNameSplit = this.image_file.name.split('.');
      // this.resumeService.uploadProfileImage(body, this.bioProfile().userName + "/profile_picture",  "profile-large." + fileNameSplit[1]).subscribe((resp: any) => {
        this.resumeService.uploadProfileImage(body, this.bioProfile().userName + "/profile_picture",  this.uploadImageUrl, this.bioProfile().imageUrl).subscribe((resp: any) => {
        console.log('Image Uploaded');
        
        this.change_in_profile = false;
      });
    };
    reader.readAsArrayBuffer(this.image_file);
    
   
  }



}

