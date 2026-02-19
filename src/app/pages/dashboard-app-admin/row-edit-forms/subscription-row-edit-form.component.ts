import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionRow } from '../dashboard-app-admin.models';
import { DashboardRowEditStore } from '../dashboard-row-edit.store';
import { SubscriptionStatus } from '../subscription-status.constants';

@Component({
  selector: 'db-subscription-row-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="row-edit-form" (ngSubmit)="save()">
      <label>Enterprise</label>
      <input type="text" formControlName="enterprise" />

      <label>Plan</label>
      <input type="text" formControlName="plan" />

      <label>Status</label>
      <select formControlName="status">
        <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
      </select>

      <label>Start Date</label>
      <input type="date" formControlName="startDate" />

      <label>Next Billing</label>
      <input type="date" formControlName="nextBilling" />

      <div class="row-edit-actions">
        <button type="button" class="clear-all-btn" (click)="cancel()">Cancel</button>
        <button type="submit" class="apply-filter-btn">Save</button>
      </div>
    </form>
  `,
})
export class SubscriptionRowEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rowEditStore = inject(DashboardRowEditStore);

  readonly statusOptions = [
    { value: SubscriptionStatus.TRIALING, label: 'Trial' },
    { value: SubscriptionStatus.ACTIVE, label: 'Active' },
    { value: SubscriptionStatus.PAST_DUE, label: 'Past Due' },
    { value: SubscriptionStatus.CANCELED, label: 'Canceled' },
    { value: SubscriptionStatus.EXPIRED, label: 'Expired' },
    { value: SubscriptionStatus.SUSPENDED, label: 'Suspended' },
  ];

  readonly form = this.fb.group({
    enterprise: [''],
    plan: [''],
    status: [''],
    startDate: [''],
    nextBilling: [''],
  });

  constructor() {
    effect(() => {
      const rowData = this.rowEditStore.editingRowData();
      const tab = this.rowEditStore.editingTab();
      if (!rowData || tab !== 'subscriptions') {
        return;
      }

      const row = rowData as SubscriptionRow;
      this.form.patchValue(
        {
          enterprise: row.enterprise || '',
          plan: row.plan || row.planCode || '',
          status: this.normalizeStatus(row.status),
          startDate: this.toInputDate(row.startDate),
          nextBilling: this.toInputDate(row.nextBillingDate || row.nextBilling),
        },
        { emitEvent: false },
      );
    });
  }

  save(): void {
    const raw = this.form.getRawValue();
    this.rowEditStore.submitCurrentRow({
      ...raw,
      status: this.normalizeStatus(raw.status),
      nextBillingDate: raw.nextBilling,
      nextBilling: raw.nextBilling,
    } as SubscriptionRow);
  }

  cancel(): void {
    this.rowEditStore.closeEditing();
  }

  private toInputDate(value?: string): string {
    if (!value) {
      return '';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toISOString().slice(0, 10);
  }

  private normalizeStatus(value: unknown): string {
    const normalized = String(value ?? '')
      .trim()
      .toUpperCase();

    return this.statusOptions.some((option) => option.value === normalized)
      ? normalized
      : SubscriptionStatus.ACTIVE;
  }
}
