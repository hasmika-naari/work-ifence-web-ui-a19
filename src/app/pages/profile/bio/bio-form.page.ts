import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import moment from 'moment';
import { Account, BioProfile, LoginProfile, Profile } from 'src/app/services/profile.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { BioProfileAddRequest } from 'src/app/services/signup.model';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { MatFileUploadModule } from 'src/app/services/file-upload';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { HttpHeaders } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResumeService } from 'src/app/services/resume.service';
const TOKEN_HEADER_KEY = 'Authorization';

@Component({
  selector: 'bio-profile-form',
  standalone: true,
  imports: [
            CommonModule, RouterLink, RouterModule, ReactiveFormsModule, MatButtonModule, MatOptionModule,
            MatIconModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatFileUploadModule,
            MatProgressBarModule,
            FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule
          ],
  templateUrl: './bio-form.page.html',
  styleUrls: ['./bio-form.page.scss'],
})
export class BioProfileFormPage implements OnInit, OnChanges, OnDestroy {
  
  pageTtitle = 'Bio Profile';
 htmlText ="<p>Bio Profile</p>"
 hasFocus = false;
 subject!: string;

 @Output() editBio = new EventEmitter()

  private _subscriptions: Array<Subscription> = new Array<Subscription>();
  image_file! : File
  fileBytes: string | ArrayBuffer | null = null;


  actionInProgress$!: Observable<Boolean>;;
  bioProfileSubmitted = false;
  imageUrl = 'assets/img/home/profile_fake.png';
  profileUploadUrl : string  = ''
  uploadImageUrl  = ''
  offEdit : Boolean = false
  actionInProgress =  false;
  public headers : HttpHeaders = new HttpHeaders();
  showProfileImage :boolean = false
  imageBase64: String | null = 'assets/img/home/profile_fake.png'; // Define a class property to store the image bytes
  change_in_profile : boolean = false

  genders : Array<any> = [
    {gender_id : '1', gender : 'Male'},
    {gender_id : '0', gender : 'Female'}
  ]


  public bioProfileForm!: FormGroup;
  public maxDate = moment().subtract(18, 'years').toDate();
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private constantService: AppConstantsService = inject(AppConstantsService);
  private userStore: UserStoreService = inject(UserStoreService);
  private appUtilService: AppUtilService = inject(AppUtilService);
  private platformId: object =  inject(PLATFORM_ID);

  ageLimit = 18;
  max_Date : Date;

  userAccount: Signal<Account> = this.userStore.getUserAccount();
  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  loginProfile: Signal<LoginProfile> = this.userStore.getUserLoginProfile();
  
  constructor(
    public bottomSheet : MatBottomSheet,
    public location: Location,
  public resumeService : ResumeService) {
      const today = new Date();
      this.max_Date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  ngOnDestroy(): void {
  }


  ngOnInit() {
    
    this.bioProfileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      title: [''],
      summary: [''],
      phoneNo : ['']
    });
    this.profileUploadUrl = this.constantService.BASE_AWS_API_URL +  '/api/aws-s3upload?path=merchant';
    this.headers = new HttpHeaders();
    let token: any  = window.localStorage.getItem('wifence-authToken');
      let tokenSplit = token?.split('\\');
      let tempToken = token?.replace("\\", "").replace("\\", "");
      let currentToken = tempToken?.replace("\"", "").replace("\"", "");
      let cToken = this.constantService.JWT_TOKEN;
      let bearer = "Bearer ";
      this.headers = this.headers.append(TOKEN_HEADER_KEY, bearer + cToken);

    // this.bioProfileForm.controls['dob'].disable();
      
        this.bioProfileForm.controls['firstName'].setValue(this.bioProfile().firstName);
        this.bioProfileForm.controls['lastName'].setValue(this.bioProfile().lastName);
        this.bioProfileForm.controls['title'].setValue(this.bioProfile().title);
        this.bioProfileForm.controls['summary'].setValue(this.bioProfile().summary);
        this.bioProfileForm.controls['dob'].setValue(new Date(this.bioProfile().dob));
        this.bioProfileForm.controls['phoneNo'].setValue(this.loginProfile().phoneNumber);
        this.bioProfileForm.controls['gender'].setValue(this.bioProfile().gender);
        this.imageUrl = this.bioProfile().imageUrl;

        if(isPlatformBrowser(this.platformId)){
          this._subscriptions.push(this.authService.getBioProfile(this.userAccount().login).subscribe((bio) => {
          
            this.userStore.updateBioProfile(bio);
          }));
      }
  }

ngOnChanges(changes: SimpleChanges): void {
    
}

onUploadHandler($event: any){
  this.uploadImageUrl = $event.fileName;
  this.imageUrl = "https://workifence.s3.amazonaws.com/"+ this.bioProfile().userName + "/profile_picture/" + this.uploadImageUrl;
}

get f(): { [key: string]: AbstractControl } {
  return this.bioProfileForm.controls;
}

setBioProfileValues(){
  this.bioProfileForm.controls['firstName'].setValue(this.bioProfile().firstName);
  this.bioProfileForm.controls['lastName'].setValue(this.bioProfile().lastName);
  this.bioProfileForm.controls['title'].setValue(this.bioProfile().title);
  this.bioProfileForm.controls['summary'].setValue(this.bioProfile().summary);
  this.bioProfileForm.controls['dob'].setValue(new Date(this.bioProfile().dob));
  this.bioProfileForm.controls['phoneNo'].setValue(this.loginProfile().phoneNumber);
  this.bioProfileForm.controls['gender'].setValue(this.bioProfile().gender);
  
  // this.offEdit = true;
  // this.change_in_profile = false
}

editBioProfile(){
  this.editBio.emit()
}

saveBioProfile(){
  if(this.imageBase64){
    this.uploadImagetoAWS1();
  }
  this.bioProfileSubmitted = true;

  console.log('onSubmit - 1');
  if (this.bioProfileForm.invalid) {
    return;
  }
    this.actionInProgress = true;
    let bioProfile: BioProfileAddRequest = new BioProfileAddRequest();
    bioProfile.dob = this.bioProfileForm.controls['dob'].value;
    bioProfile.firstName = this.bioProfileForm.controls['firstName'].value;
    bioProfile.title = this.bioProfileForm.controls['title'].value;
    bioProfile.summary = this.bioProfileForm.controls['summary'].value;
    bioProfile.gender = this.bioProfileForm.controls['gender'].value;
    // childBioProfile.imgUrl = this.childBioProfileForm.controls.imgUrl.value;
    if(this.bioProfile().imageUrl){
      bioProfile.imageUrl = this.imageUrl;
    }else{
      bioProfile.imageUrl = 'assets/img/home/profile_fake.png';
    }
    bioProfile.lastName = this.bioProfileForm.controls['lastName'].value;
    bioProfile.userName = this.userAccount().login;
    bioProfile.userId = this.userAccount().id;
    bioProfile.memberId = this.loginProfile().memberId;
    bioProfile.id = this.bioProfile().id;
    let loginProfile : LoginProfile = Object.create(this.loginProfile());
    loginProfile.phoneNumber = this.bioProfileForm.controls['phoneNo'].value;
    if(this.bioProfile().id){
      this.authService.updateBioProfile(bioProfile).subscribe((resp) => {
        console.log('Save Bio Profile' + resp);
        this.authService.getBioProfile(this.userAccount().login).subscribe((bio: BioProfile) => {
          // const uniqueSuffix = new Date().getTime();
          //  bio.imageUrl = bio.imageUrl +   "?" + uniqueSuffix;
          this.userStore.updateBioProfile(bio);

          this.offEdit = false;
          this.actionInProgress = false;
        })
      });
    } else{
      this.authService.saveBioProfile(bioProfile).subscribe((resp) => {
        console.log('Save Bio Profile' + resp);
        this.authService.getBioProfile(this.userAccount().login).subscribe((bio) => {
          this.userStore.updateBioProfile(bio);
          this.offEdit = false;
          this.actionInProgress = false;

        })
      });
    }
    // this.authFacade.saveLoginProfile(loginProfile);
    this.change_in_profile = false
}

  cancelChanges(){
    this.offEdit = false;
    this.change_in_profile = false
    // this.location.back();
  }


  openGenderSelectionBottomSheet() {
    // let sheetRef =  this.bottomSheet.open(GenderBottomSheetComponent, {
    //   data: {gender: this.bioProfileForm.controls['gender'].value}
    // });
    // sheetRef.afterDismissed().subscribe( data => {
    //   console.log('after close data :', data);
    //   // if(data && data.message=='Cancel') {
    //     // alert('Cancel was clicked in bottomsheet');
    //     if(data && data.gender){
    //       this.bioProfileForm.controls['gender'].setValue(data.gender);
    //     }

    //   // } if(data && data.message=='Status') {
    //     // this.childBioProfileForm.controls['gender'].setValue('Female');

    //     // alert('Change Status was clicked in bottomsheet');
    //   // }
    // });
  }

  dateSelected($event: any){
    this.bioProfileForm.controls['dob'].setValue(new Date($event.detail.value).toDateString());
  }



   onSelectionChanged = (event: any) =>{
     
    if(event.oldRange == null){
      this.onFocus();
    }
    if(event.range == null){
      this.onBlur();
    }
  }

  onContentChanged = (event: any) =>{
    //console.log(event.html);
  }

  onFocus = () =>{
    console.log("On Focus");
  }
  onBlur = () =>{
    console.log("Blurred");
  }

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
    return this.bioProfile().imageUrl?this.bioProfile().imageUrl : 'assets/img/home/profile_fake.png';
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
