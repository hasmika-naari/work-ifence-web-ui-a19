import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { PortalTemplate, ResumePortalStore } from '../store/resume-portal.store';

@Component({
  selector: 'app-template-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatChipsModule],
  template: `
    <h2 mat-dialog-title>{{ data.template.name }}</h2>
    <div mat-dialog-content>
      <p>{{ data.template.description }}</p>
      <mat-chip-set>
        <mat-chip [highlighted]="true" [color]="data.template.isPremium ? 'warn' : 'primary'">
          {{ data.template.isPremium ? 'Premium' : 'Free' }}
        </mat-chip>
        <mat-chip>ID: {{ data.template.id }}</mat-chip>
      </mat-chip-set>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-flat-button color="primary" (click)="useTemplate()">Use this template</button>
    </div>
  `,
})
export class TemplateDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { template: PortalTemplate },
    private store: ResumePortalStore,
  ) {}

  useTemplate(): void {
    this.store.createResumeDefault();
  }
}
