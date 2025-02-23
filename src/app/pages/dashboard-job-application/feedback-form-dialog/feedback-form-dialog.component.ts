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
import { JobApplicationData, JobApplicationFeedback, JobInterviewRounds } from 'src/app/services/work-ifence-data.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';

export interface DialogData {
  feedback: JobApplicationFeedback;
}

@Component({
  selector: 'app-feedback-form-dialog',
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
   HeaderWorkIfenceComponent,  MatStepperModule,MatDatepickerModule,
   MatFormFieldModule,
   MatInputModule, MatTooltipModule,
   MatExpansionModule, MatCheckboxModule, MatSelectModule
  ],
  templateUrl: './feedback-form-dialog.component.html',
  styleUrls: ['./feedback-form-dialog.component.scss'],
})
export class FeedbackFormDialogComponent {
  feedbackForm!: FormGroup;
  isToggled = false;
  selectedAppLicationListItem: Signal<JobApplicationData> = this.store.getSelectedJobApplicationListItem();
  
  public dialogRef: MatDialogRef<FeedbackFormDialogComponent> = inject(MatDialogRef<FeedbackFormDialogComponent>);
  public data: DialogData = inject(MAT_DIALOG_DATA);

  constructor(private router: Router, private fb: FormBuilder, private store: UserStoreService) {}

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      applicationId: ['', [Validators.required]],
      applicantId: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobRole: ['', [Validators.required]],
      userFeedback: ['', [Validators.required]],
      postedDate: ['', [Validators.required]],
      createdBy: [''],
      createdDate: [''],
      lastModifiedBy: [''],
      lastModifiedDate: ['']
    });

    this.setFeedbackValues();
  }

  setFeedbackValues() {
    this.feedbackForm.controls['applicationId'].setValue(this.data.feedback.applicationId);
    this.feedbackForm.controls['applicantId'].setValue(this.data.feedback.applicantId);
    this.feedbackForm.controls['companyName'].setValue(this.data.feedback.companyName);
    this.feedbackForm.controls['jobRole'].setValue(this.data.feedback.jobRole);
    this.feedbackForm.controls['userFeedback'].setValue(this.data.feedback.userFeedback);
    this.feedbackForm.controls['postedDate'].setValue(this.data.feedback.postedDate);
    this.feedbackForm.controls['createdBy'].setValue(this.data.feedback.createdBy);
    this.feedbackForm.controls['createdDate'].setValue(this.data.feedback.createdDate);
    this.feedbackForm.controls['lastModifiedBy'].setValue(this.data.feedback.lastModifiedBy);
    this.feedbackForm.controls['lastModifiedDate'].setValue(this.data.feedback.lastModifiedDate);
  }

  saveFeedback() {
    let feedback = new JobApplicationFeedback();
    feedback.applicationId = this.feedbackForm.controls['applicationId'].value;
    feedback.applicantId = this.feedbackForm.controls['applicantId'].value;
    feedback.companyName = this.feedbackForm.controls['companyName'].value;
    feedback.jobRole = this.feedbackForm.controls['jobRole'].value;
    feedback.userFeedback = this.feedbackForm.controls['userFeedback'].value;
    feedback.postedDate = this.feedbackForm.controls['postedDate'].value;
    feedback.createdBy = this.feedbackForm.controls['createdBy'].value;
    feedback.createdDate = this.feedbackForm.controls['createdDate'].value;
    feedback.lastModifiedBy = this.feedbackForm.controls['lastModifiedBy'].value;
    feedback.lastModifiedDate = this.feedbackForm.controls['lastModifiedDate'].value;

    this.store.addFeedbackDetails(feedback);
  }

  onConfirmHandler() {
    this.dialogRef.close({ event: 'CONFIRM' });
  }

  onNoClick() {
    this.dialogRef.close({ event: 'CANCEL' });
  }
}
