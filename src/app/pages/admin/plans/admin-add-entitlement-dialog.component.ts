import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { WifenceServiceDto } from 'src/app/models/plan-admin.model';
import type { PlanEntitlementDto } from 'src/app/models/plan-admin.model';

export type AdminEntitlementDialogMode = 'create' | 'edit';

export interface AdminAddEntitlementDialogData {
  mode: AdminEntitlementDialogMode;
  services: WifenceServiceDto[];
  entitlement?: PlanEntitlementDto;
}

export interface AdminAddEntitlementDialogResult {
  id?: string | number;
  serviceId?: string | number;
  serviceCode?: string;
  included: boolean;
  isAddonAllowed: boolean;
  defaultQuantity: number;
  status?: string;
  notes?: string;
}

@Component({
  selector: 'app-admin-add-entitlement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-add-entitlement-dialog.component.html',
})
export class AdminAddEntitlementDialogComponent {
  readonly form = new FormGroup({
    serviceId: new FormControl<string | number>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    included: new FormControl<boolean>(true, { nonNullable: true }),
    isAddonAllowed: new FormControl<boolean>(false, { nonNullable: true }),
    defaultQuantity: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(1_000_000)],
    }),
    status: new FormControl<string>('ACTIVE', { nonNullable: true }),
    notes: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AdminAddEntitlementDialogComponent, AdminAddEntitlementDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) public readonly data: AdminAddEntitlementDialogData
  ) {
    if (data.mode === 'edit' && data.entitlement) {
      const ent = data.entitlement;
      this.form.patchValue({
        serviceId: ent.serviceId ?? ent.serviceCode ?? '',
        included: !!ent.included,
        isAddonAllowed: !!ent.isAddonAllowed,
        defaultQuantity: ent.defaultQuantity ?? 0,
        status: ent.status ?? 'ACTIVE',
        notes: ent.notes ?? '',
      });

      // In edit mode, the service is read-only.
      this.form.controls.serviceId.disable({ emitEvent: false });
    }
  }

  get mode(): AdminEntitlementDialogMode {
    return this.data.mode;
  }

  serviceLabelForReadonly(): string {
    const ent = this.data.entitlement;
    if (!ent) return '';

    const codeOrId = ent.serviceCode ?? ent.serviceId;
    const svc = this.data.services.find((s) => s.code === ent.serviceCode) ??
      this.data.services.find((s) => String(s.id) === String(ent.serviceId));

    const suffix = svc?.name ? ` — ${svc.name}` : '';
    return `${codeOrId ?? ''}${suffix}`;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const selected = this.data.services.find((s) => String(s.id) === String(raw.serviceId));

    this.dialogRef.close({
      id: this.data.entitlement?.id,
      serviceId: this.data.mode === 'create' ? selected?.id : this.data.entitlement?.serviceId,
      serviceCode: this.data.mode === 'create' ? selected?.code : this.data.entitlement?.serviceCode,
      included: raw.included,
      isAddonAllowed: raw.isAddonAllowed,
      defaultQuantity: Number(raw.defaultQuantity),
      status: raw.status || undefined,
      notes: raw.notes?.trim() || undefined,
    });
  }
}
