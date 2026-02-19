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
      <label>Plan Code</label>
      <input type="text" formControlName="planCode" />

      <label>Name</label>
      <input type="text" formControlName="name" />

      <label>Price</label>
      <input type="text" formControlName="price" />

      <label>Cycle</label>
      <input type="text" formControlName="cycle" />

      <label>Active</label>
      <select formControlName="active">
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

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
    planCode: [''],
    name: [''],
    price: [''],
    cycle: [''],
    active: ['Yes'],
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
