import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { DialogData } from "../resume-form2/resume-form2.component";

@Component({
    selector: 'dialog-elements-example-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrl : './delete-dialog.component.scss',
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  })
  export class DeleteDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){}
  }