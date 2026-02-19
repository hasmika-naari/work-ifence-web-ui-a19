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
      <select formControlName="cycle">
        <option value="">—</option>
        <option *ngFor="let cycle of cycleOptions" [value]="cycle">{{ cycle }}</option>
      </select>

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

  readonly cycleOptions = ['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'] as const;

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

      const planRow = rowData as PlanRow;
      this.form.patchValue(
        {
          ...planRow,
          cycle: this.normalizeCycleValue(planRow.cycle ?? ''),
        },
        { emitEvent: false },
      );
    });
  }

  save(): void {
    const formValue = this.form.getRawValue();
    this.rowEditStore.submitCurrentRow({
      ...formValue,
      cycle: this.normalizeCycleValue(formValue.cycle ?? ''),
    } as PlanRow);
  }

  private normalizeCycleValue(value: string): string {
    const normalized = String(value ?? '')
      .trim()
      .toUpperCase()
      .replace(/[-\s]+/g, '_');

    switch (normalized) {
      case 'MONTHLY':
      case 'QUARTERLY':
      case 'YEARLY':
      case 'ONE_TIME':
        return normalized;
      case 'ANNUAL':
        return 'YEARLY';
      case 'ONETIME':
      case 'ONE-TIME':
        return 'ONE_TIME';
      default:
        return normalized;
    }
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }
}
