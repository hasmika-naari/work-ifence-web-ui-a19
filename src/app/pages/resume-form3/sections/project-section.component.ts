import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SplitCommaPipe } from './split-comma.pipe';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'resume-project-section',
  standalone: true,
  imports: [ButtonModule, SplitCommaPipe],
  template: `
    <div class="section project">
      @if (items && items.length) {
        <div>
          @for (item of items; track item; let i = $index; let last = $last) {
            <div class="project-item" style="margin-bottom:1.5rem; position:relative;">
              <!-- Hover action buttons -->
              @if (!isPreview) {
                <span class="project-item-actions">
                  <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit(i)"></button>
                  <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete(i)"></button>
                  <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="!canMoveUp(i)" (click)="moveUp(i)"></button>
                  <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="!canMoveDown(i)" (click)="moveDown(i)"></button>
                </span>
              }
              <div style="display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap;">
                <div>
                  <span class="project-title" style="font-size:1.15em; font-weight:600; letter-spacing:0.01em; color:#222;">
                    {{ item.data?.project_name }}
                  </span>
                </div>
                @if (item.data?.role || item.data?.start_date || item.data?.end_date) {
                  <div style="font-size:0.98em; color:#555; text-align:right; min-width:180px;">
                    @if (item.data?.role) {
                      <span><strong>{{ item.data?.role }}</strong></span>
                    }
                    @if (item.data?.role && (item.data?.start_date || item.data?.end_date)) {
                      <span> | </span>
                    }
                    @if (item.data?.start_date || item.data?.end_date) {
                      <span>
                        @if (item.data?.start_date) {
                          <span>{{ item.data?.start_date }}</span>
                        }
                        @if (item.data?.end_date) {
                          <span> - {{ item.data?.end_date }}</span>
                        }
                      </span>
                    }
                  </div>
                }
              </div>
              @if (item.data?.technologies_used) {
                <div style="margin:0.5em 0 0.5em 0;">
                  <span style="font-size:0.97em; color:#666;">Technologies:</span>
                  @for (tech of (item.data?.technologies_used | splitComma); track tech) {
                    <span style="display:inline-block; background:#f3f3f3; color:#333; border-radius:12px; padding:2px 10px; margin:0 6px 4px 0; font-size:0.93em;">{{ tech }}</span>
                  }
                </div>
              }
              @if (item.data?.description) {
                <div style="margin:0.5em 0 0.5em 0; color:#444; font-size:0.98em;">
                  {{ item.data?.description }}
                </div>
              }
              <!-- Rich text Responsibilities -->
              @if (item.data?.responsibilitiesRichText) {
                <div style="margin:0.5em 0 0.5em 0;">
                  <span style="font-weight:500; color:#333;">Roles & Responsibilities:</span>
                  <div [innerHTML]="item.data?.responsibilitiesRichText" style="font-size:0.97em; color:#444;"></div>
                </div>
              }
              <!-- Fallback for old array -->
              @if (!item.data?.responsibilitiesRichText && item.data?.responsibilities?.length) {
                <div style="margin:0.5em 0 0.5em 0;">
                  <span style="font-weight:500; color:#333;">Roles & Responsibilities:</span>
                  <ul style="margin:0.2em 0 0.2em 1.2em; padding:0; padding-left: 1.2em; font-size:0.97em; color:#444;">
                    @for (resp of item.data?.responsibilities; track resp) {
                      <li>{{ resp }}</li>
                    }
                  </ul>
                </div>
              }
              <!-- Rich text Highlights -->
              @if (item.data?.highlightsRichText) {
                <div style="margin:0.5em 0 0.5em 0;">
                  <span style="font-weight:500; color:#333;">Highlights:</span>
                  <div [innerHTML]="item.data?.highlightsRichText" style="font-size:0.97em; color:#444;"></div>
                </div>
              }
              <!-- Fallback for old array -->
              @if (!item.data?.highlightsRichText && item.data?.highlights?.length) {
                <div style="margin:0.5em 0 0.5em 0;">
                  <span style="font-weight:500; color:#333;">Highlights:</span>
                  <ul style="margin:0.2em 0 0.2em 1.2em; padding:0; padding-left: 1.2em; font-size:0.97em; color:#444;">
                    @for (hl of item.data?.highlights; track hl) {
                      <li>{{ hl }}</li>
                    }
                  </ul>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div>No projects added yet.</div>
      }
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
