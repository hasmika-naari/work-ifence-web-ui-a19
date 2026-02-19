import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserRow } from '../dashboard-app-admin.models';
import { DashboardRowEditStore } from '../dashboard-row-edit.store';

@Component({
  selector: 'db-user-row-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="row-edit-form" (ngSubmit)="save()">
      <label>Login</label>
      <input type="text" formControlName="login" />

      <label>Name</label>
      <input type="text" formControlName="name" />

      <label>Email</label>
      <input type="email" formControlName="email" />

      <label>Activated</label>
      <select formControlName="activated">
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      <label>Roles</label>
      <input type="text" formControlName="roles" />

      <div class="row-edit-actions">
        <button type="button" class="clear-all-btn" (click)="cancel()">Cancel</button>
        <button type="submit" class="apply-filter-btn">Save</button>
      </div>
    </form>
  `,
})
export class UserRowEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rowEditStore = inject(DashboardRowEditStore);

  readonly form = this.fb.group({
    login: [''],
    name: [''],
    email: [''],
    activated: ['Yes'],
    roles: [''],
  });

  constructor() {
    effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      const tab = this.rowEditStore.editingTab();
      if (!rowData || tab !== 'users') {
        return;
      }

      this.form.patchValue(rowData as UserRow, { emitEvent: false });
    });
  }

  save(): void {
    this.rowEditStore.submitCurrentRow(this.form.getRawValue() as UserRow);
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }
}
