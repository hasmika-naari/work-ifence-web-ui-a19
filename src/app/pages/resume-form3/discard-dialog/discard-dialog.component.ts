import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

export interface DialogData {
  name: 'Confirm';
}


@Component({
  selector: 'app-discard-dialog',
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
  ],
  templateUrl: './discard-dialog.component.html',
  styleUrl : './discard-dialog.component.scss'
})
export class DiscardDialogComponent {
  isUserNameCheckInProgress = false;
  isToggled = false;

    private subs: Array<Subscription> = [];
    public dialogRef: MatDialogRef<DiscardDialogComponent> = inject( MatDialogRef<DiscardDialogComponent>);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    public data: DialogData = inject(MAT_DIALOG_DATA);

    constructor(private router: Router) {
      this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
      });
    }
 
    ngOnInit(): void {

  }

  onConfirmHandler(){
    this.dialogRef.close({event : 'SAVE'});
  }

  onNoClick(){
    this.dialogRef.close({event : 'DISCARD'});
  }

   
}
