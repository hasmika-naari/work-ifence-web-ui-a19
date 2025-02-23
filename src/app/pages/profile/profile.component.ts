import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterModule } from '@angular/router';
import { Profile } from 'src/app/services/profile.model';
import { AddressFormPage } from './address/address-form.page';
import { BioProfileFormPage } from './bio/bio-form.page';
import { LoginProfileFormPage } from './login/login-form.page';
import { Address } from 'src/app/services/contact.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { LoginFormEditorComponent } from './login-form-editor/login-form-editor.component';
import { BioFormEditorComponent } from './bio-form-editor/bio-form-editor.component';
import { AddressFormEditorComponent } from './address-form-editor/address-form-editor.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule, MatButtonModule, MatOptionModule,
    MatIconModule,PanelModule,ButtonModule,
          FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
          AddressFormPage, BioProfileFormPage, LoginProfileFormPage, LoginFormEditorComponent, BioFormEditorComponent, AddressFormEditorComponent,
        MatProgressBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  profile!: Profile;


  profileGroup: FormGroup = new FormGroup({
    fname: new FormControl('',Validators.required),
    lname: new FormControl('',Validators.required),
    mobile: new FormControl('',Validators.required),
    message: new FormControl('',Validators.required)

  })


  constructor(private userStore : UserStoreService) { }

  ngOnInit(): void {
  }
  ngOnChanges(){
    // this.profile.controls['fname'].setValue(this.details.fname);
    // this.profile.controls['lname'].setValue(this.details.lname);
    // this.profile.controls['mobile'].setValue(this.details.mobile);
    // this.profile.controls['message'].setValue(this.details.message);
  }

  submit($event: any){
    // let details: ProfileDataItem = new ProfileDataItem()
    // details.fname = this.profile.controls['fname'].value;
    // details.lname = this.profile.controls['lname'].value;
    // details.mobile = this.profile.controls['mobile'].value;
    // details.message = this.profile.controls['message'].value;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        // //this.sidenavService.setCollapsed(false);
        }, 100);
}
  // ------------------------------------------------------------------- Newly added code --------------------------
  hidePanelWindow : boolean = true;
  showLoginFormEditor : boolean = false;
  showBioFormEditor : boolean = false;
  showAddressFormEditor : boolean = false;
  formLabel : string = ''
  isActionInProgress : boolean = false;
  formClosed : boolean = false;

  closePanelWindow($event: any){
    this.hidePanelWindow = true;
    this.showAddressFormEditor = false;
    this.showBioFormEditor = false;
    this.showLoginFormEditor = false;
    this.formClosed = !this.formClosed;
    this.userStore.setSelectedAddress(new Address());
  }

  showLoginFormEditorWindow(){
    this.formLabel = 'Login Profile';
    this.hidePanelWindow = false;
    this.showLoginFormEditor = true;
    this.showBioFormEditor = false;
    this.showAddressFormEditor = false;
  }

  showBioFormEditorWindow(){
    this.formLabel = 'Bio Profile';
    this.hidePanelWindow = false;
    this.showLoginFormEditor = false;
    this.showBioFormEditor = true;
    this.showAddressFormEditor = false;
  }

  showAddressFormEditorWindow(){
    this.formLabel = 'Address Profile';
    this.hidePanelWindow = false;
    this.showLoginFormEditor = false;
    this.showBioFormEditor = false;
    this.showAddressFormEditor = true;
  }

  saveForm(){
    this.hidePanelWindow = true;
    this.isActionInProgress = false;
  }

  actionInProgressStarts(){
    this.isActionInProgress = true;
  }

}
