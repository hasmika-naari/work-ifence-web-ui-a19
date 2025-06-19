import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Inject, Input, OnInit, Output, Signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as _ from 'lodash';
import { LanguageSubscribeComponent } from '../../language-subscribe/language-subscribe.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
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
import { AppStoreService } from 'src/app/services/store/app-store.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account } from 'src/app/services/profile.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
            CommonModule, RouterLink,LanguageSubscribeComponent, MatFormFieldModule,
            ReactiveFormsModule, NgOptimizedImage, HeaderWorkIfenceComponent,
            MatSelectModule, MatProgressBarModule, MatCardModule, FormsModule,
            FooterComponent, FooterWorkifenceComponent, MatSnackBarModule,
            MatInputModule, MatButtonModule
          ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() action! : string;
  @Input() serviceRequestItem! : ServiceRequestItem;
  isEdit : boolean = false;
  private formBuilder: FormBuilder = inject(FormBuilder);
  private appStore: AppStoreService = inject(AppStoreService);
  private userStore: UserStoreService = inject(UserStoreService);
  userData : Signal<Account> = this.userStore.getUserAccount();
  user = this.userData()


  requestTypes = [
    { value: 'newOrg', label: 'Request for new Org Account' },
    { value: 'newFeature', label: 'Request for New Feature' },
    { value: 'loginIssue', label: 'Issue with Login' }
  ];

  statusList = [
    {value: 'New', label: 'New'},
    {value: 'InProgress', label: 'In Progress'},
    {value: 'NeedsMoreInfo', label: 'Needs More Info'},
    {value: 'Rejected', label: 'Rejected'},
    {value: 'Completed', label: 'Completed'}
  ]

  serviceRequestForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    requestType: ['', Validators.required],
    requestDescription: ['', Validators.required],
    status: ['']
  });

  constructor(
    private snackBar: MatSnackBar,
    private ifenceService: IfenceService,
  )
  {
    
  }

  ngOnInit() {
    if(this.action == "edit"){
      this.serviceRequestForm.controls.firstName.disable();
      this.serviceRequestForm.controls.lastName.disable();
      this.serviceRequestForm.controls.email.disable();
      this.serviceRequestForm.controls.phone.disable();

    }
    if(this.serviceRequestItem?.id){
      this.serviceRequestForm.setValue({
        firstName: this.serviceRequestItem.firstName,
        lastName: this.serviceRequestItem.lastName,
        email: this.serviceRequestItem.email,
        phone: this.serviceRequestItem.phone,
        requestType: this.serviceRequestItem.requestType,
        requestDescription: this.serviceRequestItem.requestDescription,
        status: this.serviceRequestItem.status
      })
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.serviceRequestForm.controls;
  }

  onSubmit() {
    if (this.serviceRequestForm.valid) {
      this.appStore.updateActionInProgress(true); // Show progress bar
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
      serviceRequest.status = this.serviceRequestForm.controls.status.value ? this.serviceRequestForm.controls.status.value : "New";

      this.ifenceService.saveServiceRequest(serviceRequest).subscribe(e => {
        setTimeout(() => {
          this.appStore.updateActionInProgress(false);
          this.snackBar.open('Service Request Saved Successfully!', 'Close', {
            duration: 3000
          });
          this.serviceRequestForm.reset();
          Object.keys(this.serviceRequestForm.controls).forEach(key => {
            this.serviceRequestForm.get(key)?.setErrors(null);
          });
        }, 2000);
      })

      // Simulate API request
      
    }
  }

  onSave(){
    if (this.serviceRequestForm.valid) {
      this.appStore.updateActionInProgress(true); // Show progress bar
      let dateTime = new Date();
      this.serviceRequestItem.requestType = this.serviceRequestForm.controls.requestType.value? this.serviceRequestForm.controls.requestType.value : "";
      this.serviceRequestItem.requestDescription = this.serviceRequestForm.controls.requestDescription.value? this.serviceRequestForm.controls.requestDescription.value : "";
      this.serviceRequestItem.lastModifiedBy = this.user.email;
      this.serviceRequestItem.lastModifiedDate = dateTime.toISOString();
      this.serviceRequestItem.status = this.serviceRequestForm.controls.status.value === "New" ? "InProgress" : this.serviceRequestForm.controls.status.value ? this.serviceRequestForm.controls.status.value : "" ;

      this.ifenceService.updateServiceRequest(this.serviceRequestItem).subscribe(e => {
        setTimeout(() => {
          this.appStore.updateActionInProgress(false);
          this.snackBar.open('Service Request Saved Successfully!', 'Close', {
            duration: 3000
          });
        }, 2000);
      })

      // Simulate API request
      
    }
  }


}
