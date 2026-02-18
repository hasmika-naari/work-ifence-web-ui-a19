import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PlanRow } from '../dashboard-app-admin.models';
import { DashboardRowEditStore } from '../dashboard-row-edit.store';

@Component({
  selector: 'db-plan-row-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="row-edit-form" (ngSubmit)="save()">
      <label>Enterprise</label>
      <input type="text" formControlName="enterprise" />

      <label>Plan Type</label>
      <input type="text" formControlName="planType" />

      <label>Status</label>
      <select formControlName="status">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <label>Start Date</label>
      <input type="date" formControlName="startDate" />

      <label>End Date</label>
      <input type="date" formControlName="endDate" />

      <div class="row-edit-actions">
        <button type="button" class="clear-all-btn" (click)="cancel()">Cancel</button>
        <button type="submit" class="apply-filter-btn">Save</button>
      </div>
    </form>
  `,
})
export class PlanRowEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rowEditStore = inject(DashboardRowEditStore);

  readonly form = this.fb.group({
    enterprise: [''],
    planType: [''],
    status: ['Active'],
    startDate: [''],
    endDate: [''],
  });

  constructor() {
    effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      const tab = this.rowEditStore.editingTab();
      if (!rowData || tab !== 'plans') {
        return;
      }

      this.form.patchValue(rowData as PlanRow, { emitEvent: false });
    });
  }

  save(): void {
    this.rowEditStore.submitCurrentRow(this.form.getRawValue() as PlanRow);
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }
}
