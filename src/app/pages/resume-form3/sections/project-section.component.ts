import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SplitCommaPipe } from './split-comma.pipe';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'resume-project-section',
  standalone: true,
  imports: [CommonModule, ButtonModule, SplitCommaPipe],
  template: `
    <div class="section project">
      <div *ngIf="items && items.length; else noProjects">
        <div *ngFor="let item of items; let i = index; let last = last" class="project-item" style="margin-bottom:2.5rem; padding-bottom:2rem; position:relative;">
          <!-- Hover action buttons -->
          <span class="project-item-actions" *ngIf="!isPreview">
            <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit(i)"></button>
            <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete(i)"></button>
            <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="!canMoveUp(i)" (click)="moveUp(i)"></button>
            <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="!canMoveDown(i)" (click)="moveDown(i)"></button>
          </span>
          <div style="display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap;">
            <div>
              <span class="project-title" style="font-size:1.15em; font-weight:600; letter-spacing:0.01em; color:#222;">
                {{ item.data?.project_title }}
              </span>
              <span *ngIf="item.data?.project_link" style="margin-left:0.5em; font-size:0.95em;">
                <a [href]="item.data?.project_link" target="_blank" style="color:#1976d2; text-decoration:underline;">[Link]</a>
              </span>
            </div>
            <div *ngIf="item.data?.role || item.data?.start_date || item.data?.end_date" style="font-size:0.98em; color:#555; text-align:right; min-width:180px;">
              <span *ngIf="item.data?.role"><strong>{{ item.data?.role }}</strong></span>
              <span *ngIf="item.data?.role && (item.data?.start_date || item.data?.end_date)"> | </span>
              <span *ngIf="item.data?.start_date || item.data?.end_date">
                <span *ngIf="item.data?.start_date">{{ item.data?.start_date }}</span>
                <span *ngIf="item.data?.end_date"> - {{ item.data?.end_date }}</span>
              </span>
            </div>
          </div>
          <div *ngIf="item.data?.technologies_used" style="margin:0.5em 0 0.5em 0;">
            <span style="font-size:0.97em; color:#666;">Technologies:</span>
            <ng-container *ngFor="let tech of (item.data?.technologies_used | splitComma)">
              <span style="display:inline-block; background:#f3f3f3; color:#333; border-radius:12px; padding:2px 10px; margin:0 6px 4px 0; font-size:0.93em;">{{ tech }}</span>
            </ng-container>
          </div>
          <div *ngIf="item.data?.description" style="margin:0.5em 0 0.5em 0; color:#444; font-size:0.98em;">
            {{ item.data?.description }}
          </div>
          <div *ngIf="item.data?.responsibilities?.length" style="margin:0.5em 0 0.5em 0;">
            <span style="font-weight:500; color:#333;">Responsibilities:</span>
            <ul style="margin:0.2em 0 0.2em 1.2em; padding:0; font-size:0.97em; color:#444;">
              <li *ngFor="let resp of item.data?.responsibilities">{{ resp }}</li>
            </ul>
          </div>
          <div *ngIf="item.data?.highlights?.length" style="margin:0.5em 0 0.5em 0;">
            <span style="font-weight:500; color:#333;">Highlights:</span>
            <ul style="margin:0.2em 0 0.2em 1.2em; padding:0; font-size:0.97em; color:#444;">
              <li *ngFor="let hl of item.data?.highlights">{{ hl }}</li>
            </ul>
          </div>
        </div>
      </div>
      <ng-template #noProjects>
        <div>No projects added yet.</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./project-section.component.scss']
})
export class ProjectSectionComponent {
  @Input() items: any[] = [];
  @Input() isPreview: boolean = false;

  @Output() editProject = new EventEmitter<number>();
  @Output() deleteProject = new EventEmitter<number>();
  @Output() moveProjectUp = new EventEmitter<number>();
  @Output() moveProjectDown = new EventEmitter<number>();

  canMoveUp(index: number): boolean {
    return index > 0;
  }
  canMoveDown(index: number): boolean {
    return index < this.items.length - 1;
  }

  edit(index: number) { this.editProject.emit(index); }
  delete(index: number) { this.deleteProject.emit(index); }
  moveUp(index: number) { this.moveProjectUp.emit(index); }
  moveDown(index: number) { this.moveProjectDown.emit(index); }
}
