import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WorkQueueRequestRow } from '../dashboard-app-admin.models';
import { DashboardRowEditStore } from '../dashboard-row-edit.store';

@Component({
  selector: 'db-request-row-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="row-edit-form" (ngSubmit)="save()">
      <label>Enterprise</label>
      <input type="text" formControlName="enterprise" />

      <label>Request Type</label>
      <input type="text" formControlName="requestType" />

      <label>Requested By</label>
      <input type="text" formControlName="requestedBy" />

      <label>Status</label>
      <select formControlName="status">
        <option value="Submitted">Submitted</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <label>Age</label>
      <input type="text" formControlName="age" />

      <label>Priority</label>
      <select formControlName="priority">
        <option value="Low">Low</option>
        <option value="Normal">Normal</option>
        <option value="Breached">Breached</option>
      </select>

      <label>SLA</label>
      <input type="text" formControlName="sla" />

      <div class="row-edit-actions">
        <button type="button" class="clear-all-btn" (click)="cancel()">Cancel</button>
        <button type="submit" class="apply-filter-btn">Save</button>
      </div>
    </form>
  `,
})
export class RequestRowEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rowEditStore = inject(DashboardRowEditStore);

  readonly form = this.fb.group({
    enterprise: [''],
    avatarSrc: [''],
    requestType: [''],
    requestedBy: [''],
    status: ['Submitted'],
    age: [''],
    priority: ['Normal'],
    sla: ['OK'],
  });

  constructor() {
    effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      const tab = this.rowEditStore.editingTab();
      if (!rowData || tab !== 'requests') {
        return;
      }

      this.form.patchValue(rowData as WorkQueueRequestRow, { emitEvent: false });
    });
  }

  save(): void {
    this.rowEditStore.submitCurrentRow(this.form.getRawValue() as WorkQueueRequestRow);
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }
}
