import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ClientContact, JobApplicationData, VendorContact } from 'src/app/services/work-ifence-data.model';

export interface DialogData {
  isClient : boolean;
  contact: VendorContact;
}

@Component({
  selector: 'app-employer-contact-dialog',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatProgressSpinnerModule,
    ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent, MatStepperModule, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule, MatTooltipModule,
    MatExpansionModule, MatCheckboxModule, MatSelectModule
  ],
  templateUrl: './employer-contact.component.html',
  styleUrl : './employer-contact.component.scss'
})
export class EmployerContactDialogComponent {
  isUserNameCheckInProgress = false;
  isToggled = false;

  private subs: Array<Subscription> = [];
  public dialogRef: MatDialogRef<EmployerContactDialogComponent> = inject(MatDialogRef<EmployerContactDialogComponent>);
  public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
  public data: DialogData = inject(MAT_DIALOG_DATA);
  contactForm!: FormGroup;
  who = ''
  selectedJobApplicationData : Signal<JobApplicationData> = this.store.getSelectedJobApplicationListItem();


  constructor(private router: Router, private fb: FormBuilder, private store: UserStoreService) {
    console.log(this.data.contact);
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }




  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      companyName: ['', [Validators.required]]
    });

    if(this.data.isClient){
        this.who = 'Client'
    }
    else{
        this.who = 'Vendor'
    }

    this.setContactValues();
  }

  onConfirmHandler() {
    this.dialogRef.close({ event: 'CONFIRM' });
  }

  onNoClick() {
    this.dialogRef.close({ event: 'CANCEL' });
  }

  setContactValues() {
    this.contactForm.controls['firstName'].setValue(this.data.contact.firstName);
    this.contactForm.controls['lastName'].setValue(this.data.contact.lastName);
    this.contactForm.controls['email'].setValue(this.data.contact.email);
    this.contactForm.controls['phone'].setValue(this.data.contact.phone);
    this.contactForm.controls['companyName'].setValue(this.data.contact.companyName);
  }

  saveContact() {
    if(this.data.isClient){
        let contact = new ClientContact(); 
        if(this.selectedJobApplicationData().clientContact.id){
            contact.id = this.selectedJobApplicationData().clientContact.id
        }
        contact.firstName = this.contactForm.controls['firstName'].value;
        contact.lastName = this.contactForm.controls['lastName'].value;
        contact.email = this.contactForm.controls['email'].value;
        contact.phone = this.contactForm.controls['phone'].value;
        contact.companyName = this.contactForm.controls['companyName'].value;
        contact.description = ''
        contact.createdBy = ''
        contact.createdDate = ''
        contact.lastModifiedBy = ''
        contact.lastModifiedDate=''
        this.store.addClientContactDetails(contact);
    }
    else{
        let contact = new VendorContact();
        if(this.selectedJobApplicationData().vendorContact.id){
            contact.id = this.selectedJobApplicationData().vendorContact.id
        }
        contact.firstName = this.contactForm.controls['firstName'].value;
        contact.lastName = this.contactForm.controls['lastName'].value;
        contact.email = this.contactForm.controls['email'].value;
        contact.phone = this.contactForm.controls['phone'].value;
        contact.companyName = this.contactForm.controls['companyName'].value;
        contact.description = ''
        contact.createdBy = ''
        contact.createdDate = ''
        contact.lastModifiedBy = ''
        contact.lastModifiedDate=''
        this.store.addVendorContactDetails(contact);
    }

    // You can now add or edit contact details using this.store as neede
  }
}

