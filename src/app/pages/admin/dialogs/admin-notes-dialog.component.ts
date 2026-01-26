import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AdminNotesDialogData {
  title: string;
  message?: string;
  confirmLabel?: string;
  notesRequired?: boolean;
}

export interface AdminNotesDialogResult {
  notes: string;
}

@Component({
  selector: 'app-admin-notes-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-notes-dialog.component.html',
})
export class AdminNotesDialogComponent {
  readonly notes: FormControl<string>;

  constructor(
    private readonly dialogRef: MatDialogRef<AdminNotesDialogComponent, AdminNotesDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) public readonly data: AdminNotesDialogData
  ) {
    this.notes = new FormControl<string>('', {
      nonNullable: true,
      validators: data.notesRequired ? [Validators.required] : [],
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    if (this.notes.invalid) {
      this.notes.markAsTouched();
      return;
    }

    this.dialogRef.close({ notes: this.notes.value.trim() });
  }
}
