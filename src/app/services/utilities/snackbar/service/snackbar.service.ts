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
    config.panelClass =  [mtype];
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;

    this.snackBar.open(message, 'OK', config);
    
  }

  openMultiLineSnackBar(title: any, messages: any, mtype: any, duration: any) {
    const snackBarDuration = duration ? duration : this.autoHide;

    this.snackBarRef = this.snackBar.openFromComponent(MultiLineSnackbarComponent, {
      duration: snackBarDuration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [mtype]
    });
    this.snackBarRef.instance.snackBarRefMultiLineComponent = this.snackBarRef;
    this.snackBarRef.instance.title = title;

    this.snackBarRef.instance.errorMessages = this.normalizeMultiLineMessages(messages);

  }

  private normalizeMultiLineMessages(messages: any): Array<{ message: string }> {
    if (Array.isArray(messages)) {
      return messages.map((message: any) => {
        if (typeof message === 'string') {
          return { message };
        }

        return {
          message: message?.message ?? String(message ?? '')
        };
      });
    }

    return [{ message: String(messages ?? '') }];
  }

}
