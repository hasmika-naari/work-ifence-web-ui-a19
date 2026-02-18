import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuditRow } from '../dashboard-app-admin.models';
import { DashboardRowEditStore } from '../dashboard-row-edit.store';

@Component({
  selector: 'db-audit-row-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="row-edit-form" (ngSubmit)="save()">
      <label>Enterprise</label>
      <input type="text" formControlName="enterprise" />

      <label>Event Type</label>
      <input type="text" formControlName="eventType" />

      <label>Status</label>
      <select formControlName="status">
        <option value="Success">Success</option>
        <option value="Failed">Failed</option>
      </select>

      <label>Date</label>
      <input type="date" formControlName="date" />

      <div class="row-edit-actions">
        <button type="button" class="clear-all-btn" (click)="cancel()">Cancel</button>
        <button type="submit" class="apply-filter-btn">Save</button>
      </div>
    </form>
  `,
})
export class AuditRowEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rowEditStore = inject(DashboardRowEditStore);

  readonly form = this.fb.group({
    enterprise: [''],
    eventType: [''],
    status: ['Success'],
    date: [''],
  });

  constructor() {
    effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      const tab = this.rowEditStore.editingTab();
      if (!rowData || tab !== 'audit') {
        return;
      }

      this.form.patchValue(rowData as AuditRow, { emitEvent: false });
    });
  }

  save(): void {
    this.rowEditStore.submitCurrentRow(this.form.getRawValue() as AuditRow);
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }
}
