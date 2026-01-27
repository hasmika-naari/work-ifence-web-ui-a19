import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { ResumeTemplateRecord, ResumeTemplateUpsert } from 'src/app/models/resume-template.model';

export type AdminResumeTemplateDialogMode = 'create' | 'edit';

export interface AdminResumeTemplateDialogData {
  mode: AdminResumeTemplateDialogMode;
  template?: ResumeTemplateRecord;
}

@Component({
  selector: 'app-admin-resume-template-dialog',
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
  templateUrl: './admin-resume-template-dialog.component.html',
  styleUrls: ['./admin-resume-template-dialog.component.scss'],
})
export class AdminResumeTemplateDialogComponent {
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    templateKey: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    componentKey: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    version: new FormControl('1.0', { nonNullable: true }),
    accessLevel: new FormControl('FREE', { nonNullable: true, validators: [Validators.required] }),
    sortOrder: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    isDefault: new FormControl(false, { nonNullable: true }),
    configJson: new FormControl('', { nonNullable: true }),
    templateDocUrl: new FormControl('', { nonNullable: true }),
    tags: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    style: new FormControl('', { nonNullable: true }),
    status: new FormControl('ACTIVE', { nonNullable: true }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AdminResumeTemplateDialogComponent, ResumeTemplateUpsert | null>,
    @Inject(MAT_DIALOG_DATA) public readonly data: AdminResumeTemplateDialogData
  ) {
    if (data.mode === 'edit' && data.template) {
      const tpl = data.template;
      const tags = Array.isArray(tpl.tags)
        ? tpl.tags.join(', ')
        : typeof tpl.tags === 'string'
          ? tpl.tags
          : '';

      this.form.patchValue({
        title: tpl.title ?? '',
        templateKey: tpl.templateKey ?? '',
        componentKey: tpl.componentKey ?? '',
        version: tpl.version ?? '1.0',
        accessLevel: tpl.accessLevel ?? 'FREE',
        sortOrder: Number.isFinite(Number(tpl.sortOrder)) ? Number(tpl.sortOrder) : 0,
        isDefault: !!tpl.isDefault,
        configJson: typeof tpl.configJson === 'string' ? tpl.configJson : tpl.configJson ? JSON.stringify(tpl.configJson, null, 2) : '',
        templateDocUrl: tpl.templateDocUrl ?? '',
        tags,
        category: tpl.category ?? '',
        style: tpl.style ?? '',
        status: tpl.status ?? 'ACTIVE',
      });
    }
  }

  get mode(): AdminResumeTemplateDialogMode {
    return this.data.mode;
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
    const tags = raw.tags
      ? raw.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const payload: ResumeTemplateUpsert = {
      id: this.data.template?.id,
      title: raw.title.trim(),
      templateKey: raw.templateKey.trim(),
      componentKey: raw.componentKey.trim(),
      version: raw.version.trim() || '1.0',
      accessLevel: raw.accessLevel.trim() || 'FREE',
      sortOrder: Number(raw.sortOrder ?? 0),
      isDefault: !!raw.isDefault,
      configJson: raw.configJson?.trim() || '',
      templateDocUrl: raw.templateDocUrl?.trim() || '',
      tags,
      category: raw.category?.trim() || '',
      style: raw.style?.trim() || '',
      status: raw.status?.trim() || 'ACTIVE',
    };

    this.dialogRef.close(payload);
  }
}
