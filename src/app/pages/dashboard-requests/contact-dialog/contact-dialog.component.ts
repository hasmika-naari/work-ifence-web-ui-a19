import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { ServiceRequestItem } from 'src/app/services/store/app-store.model';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
            CommonModule, ContactFormComponent
          ],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {

  @Input() action! : string;
  @Input() serviceRequestItem! :ServiceRequestItem;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContactDialogComponent>
  )
  {
    if (data) {
      this.action = data.action;
      if(data.serviceRequestItem){
        this.serviceRequestItem = data.serviceRequestItem;
      }
    }
  }

  ngOnInit() {
    
  }

}
