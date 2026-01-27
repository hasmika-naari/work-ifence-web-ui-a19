import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { ResumeTemplateAdminApiService } from 'src/app/services/resume-template-admin-api.service';
import type { ResumeTemplateRecord, ResumeTemplateUpsert } from 'src/app/models/resume-template.model';
import { AdminTableShellComponent } from '../shared/admin-table-shell.component';
import { AdminResumeTemplateDialogComponent } from './admin-resume-template-dialog.component';

@Component({
  selector: 'app-admin-resume-templates',
  standalone: true,
  imports: [
    CommonModule,
    AdminTableShellComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-resume-templates.component.html',
  styleUrls: ['./admin-resume-templates.component.scss'],
})
export class AdminResumeTemplatesComponent implements OnInit {
  private readonly api = inject(ResumeTemplateAdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly templates = signal<ResumeTemplateRecord[]>([]);

  readonly displayedColumns = [
    'preview',
    'title',
    'templateKey',
    'componentKey',
    'accessLevel',
    'status',
    'sortOrder',
    'isDefault',
    'actions',
  ];

  readonly count = computed(() => this.templates().length);

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.api
      .listTemplates()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.templates.set(Array.isArray(rows) ? rows : []),
        error: () => {
          this.errorMessage.set('Unable to load templates. Please try again.');
        },
      });
  }

  openCreate(): void {
    const ref = this.dialog.open(AdminResumeTemplateDialogComponent, {
      width: '720px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((payload: ResumeTemplateUpsert | null) => {
      if (!payload) return;

      this.loading.set(true);
      this.api
        .createTemplate(payload)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Template created.', 'OK', { duration: 2500 });
            this.loadTemplates();
          },
          error: (err) => {
            this.snackBar.open(this.extractError(err) ?? 'Failed to create template.', 'OK', { duration: 3500 });
          },
        });
    });
  }

  openEdit(template: ResumeTemplateRecord): void {
    const ref = this.dialog.open(AdminResumeTemplateDialogComponent, {
      width: '720px',
      data: { mode: 'edit', template },
    });

    ref.afterClosed().subscribe((payload: ResumeTemplateUpsert | null) => {
      if (!payload || !template.id) return;

      this.loading.set(true);
      this.api
        .updateTemplate(template.id, payload)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Template updated.', 'OK', { duration: 2500 });
            this.loadTemplates();
          },
          error: (err) => {
            this.snackBar.open(this.extractError(err) ?? 'Failed to update template.', 'OK', { duration: 3500 });
          },
        });
    });
  }

  toggleStatus(template: ResumeTemplateRecord): void {
    if (!template.id) return;
    const nextStatus = (template.status ?? '').toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.loading.set(true);
    this.api
      .patchTemplate(template.id, { status: nextStatus })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open(`Template marked ${nextStatus.toLowerCase()}.`, 'OK', { duration: 2200 });
          this.loadTemplates();
        },
        error: (err) => {
          this.snackBar.open(this.extractError(err) ?? 'Failed to update status.', 'OK', { duration: 3500 });
        },
      });
  }

  setDefault(template: ResumeTemplateRecord): void {
    if (!template.id || template.isDefault) return;

    this.loading.set(true);
    this.api
      .patchTemplate(template.id, { isDefault: true })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Default template updated.', 'OK', { duration: 2400 });
          this.loadTemplates();
        },
        error: (err) => {
          this.snackBar.open(this.extractError(err) ?? 'Failed to set default.', 'OK', { duration: 3500 });
        },
      });
  }

  duplicate(template: ResumeTemplateRecord): void {
    const title = template.title ? `Copy of ${template.title}` : 'Copy of template';
    const payload: ResumeTemplateUpsert = {
      ...template,
      id: undefined,
      title,
      isDefault: false,
      status: 'INACTIVE',
      sortOrder: Number.isFinite(Number(template.sortOrder)) ? Number(template.sortOrder) + 1 : 0,
    };

    this.loading.set(true);
    this.api
      .createTemplate(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Template duplicated.', 'OK', { duration: 2500 });
          this.loadTemplates();
        },
        error: (err) => {
          this.snackBar.open(this.extractError(err) ?? 'Failed to duplicate template.', 'OK', { duration: 3500 });
        },
      });
  }

  archive(template: ResumeTemplateRecord): void {
    if (!template.id) return;

    this.loading.set(true);
    this.api
      .patchTemplate(template.id, { status: 'ARCHIVED' })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Template archived.', 'OK', { duration: 2400 });
          this.loadTemplates();
        },
        error: (err) => {
          this.snackBar.open(this.extractError(err) ?? 'Failed to archive template.', 'OK', { duration: 3500 });
        },
      });
  }

  isPremium(template: ResumeTemplateRecord): boolean {
    return (template.accessLevel ?? '').toUpperCase() === 'PREMIUM';
  }

  private extractError(err: any): string | null {
    const message = err?.error?.message ?? err?.error?.detail ?? err?.message;
    return message ? String(message) : null;
  }
}
