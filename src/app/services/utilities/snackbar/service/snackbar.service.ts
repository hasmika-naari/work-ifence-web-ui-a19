import {Injectable} from '@angular/core';
import {
    MatSnackBar,  MatSnackBarConfig,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material/snack-bar';


import { MultiLineSnackbarComponent } from '../component/multi-line-snackbar-component';


@Injectable({providedIn: 'root'})
export class YeaSnackBarService {
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    
    actionButtonLabel = 'OK';
    action = true;
    setAutoHide = true;
    autoHide = 1000;
    addExtraClass = false;

    private snackBarRef: any;

  constructor(public snackBar: MatSnackBar) {
  }


  openSnackBar(message: any, mtype: any, duration: any) {
    const config = new MatSnackBarConfig();
    config.duration = duration ? duration : this.autoHide;
    config.panelClass =  mtype;
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;

    this.snackBar.open(message, 'OK', config);
    
  }

  openMultiLineSnackBar(title: any, messages: any, mtype: any, duration: any) {
    const config = new MatSnackBarConfig();
    config.duration = duration ? duration : this.autoHide;
    config.panelClass =  mtype;
    
    this.snackBarRef = this.snackBar.openFromComponent(MultiLineSnackbarComponent, {
      duration: this.autoHide * 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [mtype]
    });
    this.snackBarRef.instance.snackBarRefMultiLineComponent = this.snackBarRef;
    this.snackBarRef.instance.title = title;
   
    this.snackBarRef.instance.errorMessages = messages;

  }

}
