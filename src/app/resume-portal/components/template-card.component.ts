import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PortalTemplate } from '../store/resume-portal.store';

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule],
  template: `
    <mat-card class="tpl-card">
      <div class="tpl-preview" *ngIf="template.previewImageUrl; else placeholder">
        <img [src]="template.previewImageUrl" [alt]="template.name" />
      </div>
      <ng-template #placeholder>
        <div class="tpl-preview placeholder">Preview</div>
      </ng-template>

      <mat-card-header>
        <mat-card-title>{{ template.name }}</mat-card-title>
        <mat-card-subtitle>{{ template.description }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <mat-chip-set>
          <mat-chip [color]="template.isPremium ? 'warn' : 'primary'" [highlighted]="true">
            {{ template.isPremium ? 'Premium' : 'Free' }}
          </mat-chip>
        </mat-chip-set>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-button (click)="details.emit()">Details</button>
        <button mat-flat-button color="primary" (click)="use.emit()">Use</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .tpl-card { height: 100%; display: flex; flex-direction: column; }
      .tpl-preview { height: 180px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
      .tpl-preview img { width: 100%; height: 100%; object-fit: cover; }
      .tpl-preview.placeholder { color: rgba(0,0,0,.54); font-weight: 600; }
      mat-card-actions { margin-top: auto; }
    `,
  ],
})
export class TemplateCardComponent {
  @Input({ required: true }) template!: PortalTemplate;
  @Output() details = new EventEmitter<void>();
  @Output() use = new EventEmitter<void>();
}
