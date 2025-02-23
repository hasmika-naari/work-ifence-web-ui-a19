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
import { JobApplicationData, JobInterviewRounds } from 'src/app/services/work-ifence-data.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';

export interface DialogData {
  round: JobInterviewRounds;
}


@Component({
  selector: 'app-rounds-form-dialog',
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
  templateUrl: './rounds-form-dialog.component.html',
  styleUrl : './rounds-form-dialog.component.scss'
})
export class RoundsFormDialogComponent {
  isUserNameCheckInProgress = false;
  isToggled = false;
  statusOptions = ['Pending', 'Completed', 'In Progress'];

    private subs: Array<Subscription> = [];
    public dialogRef: MatDialogRef<RoundsFormDialogComponent> = inject( MatDialogRef<RoundsFormDialogComponent>);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    public data: DialogData = inject(MAT_DIALOG_DATA);
    interviewRoundsForm ! : FormGroup;
    // selectedAppLicationListItem : Signal<JobApplicationData> = this.store.getSelectedJobApplicationListItem();




    constructor(private router: Router, private fb: FormBuilder, private store : UserStoreService) {
      console.log(this.data.round);
      this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
      });
    }
 
    ngOnInit(): void {
      this.interviewRoundsForm = this.fb.group({
        roundNumber: ['', [Validators.required]],
        roundType: ['', [Validators.required]],
        roundDate: ['', [Validators.required]],
        mode: ['', [Validators.required]],
        venueOrLink: [''],
        conductedBy: [''],
        status: [''],
        remindMe: [false],
        feedback: [''],
        score: [''],
        result: [''],
        roundDescription: [''],
        createdBy: [''],
        createdDate: [''],
        lastModifiedBy: [''],
        lastModifiedDate: ['']
      });

      this.setRoundValues();

  }

  onConfirmHandler(){
    this.dialogRef.close({event : 'CONFIRM'});
  }

  onNoClick(){
    this.dialogRef.close({event : 'CANCEL'});
  }

  setRoundValues(){
    this.interviewRoundsForm.controls['roundNumber'].setValue(this.data.round.roundNumber);
    this.interviewRoundsForm.controls['roundType'].setValue(this.data.round.roundType);
    this.interviewRoundsForm.controls['roundDate'].setValue(this.data.round.roundDate);
    this.interviewRoundsForm.controls['mode'].setValue(this.data.round.mode);
    this.interviewRoundsForm.controls['venueOrLink'].setValue(this.data.round.venueOrLink);
    this.interviewRoundsForm.controls['conductedBy'].setValue(this.data.round.conductedBy);
    this.interviewRoundsForm.controls['status'].setValue(this.data.round.status);
    this.interviewRoundsForm.controls['remindMe'].setValue(this.data.round.remindMe);
    this.interviewRoundsForm.controls['feedback'].setValue(this.data.round.feedback);
    this.interviewRoundsForm.controls['score'].setValue(this.data.round.score);
    this.interviewRoundsForm.controls['result'].setValue(this.data.round.result);
    this.interviewRoundsForm.controls['roundDescription'].setValue(this.data.round.roundDescription);
    this.interviewRoundsForm.controls['createdBy'].setValue(this.data.round.createdBy);
    this.interviewRoundsForm.controls['createdDate'].setValue(this.data.round.createdDate);
    this.interviewRoundsForm.controls['lastModifiedBy'].setValue(this.data.round.lastModifiedBy);
    this.interviewRoundsForm.controls['lastModifiedDate'].setValue(this.data.round.lastModifiedDate);
  }

  saveRound(){
    let round = new JobInterviewRounds();
    if(this.data.round.id){
      round.id = this.data.round.id
    }
    round.roundNumber = this.interviewRoundsForm.controls['roundNumber'].value;
    round.roundType = this.interviewRoundsForm.controls['roundType'].value;
    round.roundDate = this.interviewRoundsForm.controls['roundDate'].value;
    round.mode = this.interviewRoundsForm.controls['mode'].value;
    round.venueOrLink = this.interviewRoundsForm.controls['venueOrLink'].value;
    round.conductedBy = this.interviewRoundsForm.controls['conductedBy'].value;
    round.status = this.interviewRoundsForm.controls['status'].value;
    round.remindMe = this.interviewRoundsForm.controls['remindMe'].value;
    round.feedback = this.interviewRoundsForm.controls['feedback'].value;
    round.score = this.interviewRoundsForm.controls['score'].value;
    round.result = this.interviewRoundsForm.controls['result'].value;
    round.roundDescription = this.interviewRoundsForm.controls['roundDescription'].value;
    round.createdBy = this.interviewRoundsForm.controls['createdBy'].value;
    round.createdDate = this.interviewRoundsForm.controls['createdDate'].value;
    round.lastModifiedBy = this.interviewRoundsForm.controls['lastModifiedBy'].value;
    round.lastModifiedDate = this.interviewRoundsForm.controls['lastModifiedDate'].value;

    if(round.id){
      // this.store.addRoundDetails(round);
    }
    else{
      // this.store.editRoundDetails(round);
    }
  }

   
}
