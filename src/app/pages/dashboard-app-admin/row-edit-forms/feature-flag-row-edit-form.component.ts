import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FeatureFlagRow } from '../dashboard-app-admin.models';
import { DashboardRowEditStore } from '../dashboard-row-edit.store';

@Component({
  selector: 'db-feature-flag-row-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="row-edit-form" (ngSubmit)="save()">
      <label>Enterprise</label>
      <input type="text" formControlName="enterprise" />

      <label>Flag Name</label>
      <input type="text" formControlName="flagName" />

      <label>Status</label>
      <select formControlName="status">
        <option value="Enabled">Enabled</option>
        <option value="Disabled">Disabled</option>
      </select>

      <label>Enabled</label>
      <select formControlName="enabled">
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
export class FeatureFlagRowEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rowEditStore = inject(DashboardRowEditStore);

  readonly form = this.fb.group({
    enterprise: [''],
    flagName: [''],
    status: ['Enabled'],
    enabled: ['Yes'],
  });

  constructor() {
    effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      const tab = this.rowEditStore.editingTab();
      if (!rowData || tab !== 'featureFlags') {
        return;
      }

      this.form.patchValue(rowData as FeatureFlagRow, { emitEvent: false });
    });
  }

  save(): void {
    this.rowEditStore.submitCurrentRow(this.form.getRawValue() as FeatureFlagRow);
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }
}
