import { CommonModule } from '@angular/common';
import {
    Component, OnInit, OnChanges, 
  } from '@angular/core';


@Component({
  standalone: true,
  imports: [CommonModule],
    selector: 'yea-multi-line-snack-bar-component',
    templateUrl: './multi-line-snackbar-component.html',
    styleUrls: ['./multi-line-snackbar-component.scss']
  })
  export class MultiLineSnackbarComponent implements OnChanges, OnInit {
    public snackBarRefMultiLineComponent: any;
    public errorMessages: Array<any>;
    public title: string = '';

    constructor(){
        this.errorMessages = new Array<any>();
    }

    ngOnInit(){
        const title = this.title;
        const message = this.errorMessages;
    }

    ngOnChanges(changes: any){

      const message: any = this.title;

    }

    public closeSnack() {
      this.snackBarRefMultiLineComponent.dismiss();
    }
   
  
  }
  