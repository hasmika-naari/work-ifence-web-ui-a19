import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-import-resume-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Import resume</h2>
    <div mat-dialog-content>
      <p>Upload/import flow is coming next. For now, you can continue in the builder.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" mat-dialog-close>Continue</button>
    </div>
  `,
})
export class ImportResumeDialogComponent {}
