import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SplitCommaPipe } from './split-comma.pipe';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'resume-project-section',
  standalone: true,
  imports: [ButtonModule, SplitCommaPipe],
  template: `
    <div class="section project template1-section template1-project-section">
      @if (items && items.length) {
        <div>
          @for (item of items; track item; let i = $index; let last = $last) {
            <div class="project-item">
              <!-- Hover action buttons -->
              @if (!isPreview) {
                <span class="project-item-actions">
                  <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit(i)"></button>
                  <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete(i)"></button>
                  <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="!canMoveUp(i)" (click)="moveUp(i)"></button>
                  <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="!canMoveDown(i)" (click)="moveDown(i)"></button>
                </span>
              }
              <div class="project-header-row">
                <div>
                  <span class="project-title">
                    {{ item.data?.project_name }}
                  </span>
                </div>
                @if (item.data?.role || item.data?.start_date || item.data?.end_date) {
                  <div class="project-meta">
                    @if (item.data?.role) {
                      <span class="project-role">{{ item.data?.role }}</span>
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
                <div class="project-tech-stack">
                  <span class="project-tech-label">Technologies:</span>
                  @for (tech of (item.data?.technologies_used | splitComma); track tech) {
                    <span class="tech-chip">{{ tech }}</span>
                  }
                </div>
              }
              @if (item.data?.description) {
                <div class="project-description">
                  {{ item.data?.description }}
                </div>
              }
              <!-- Rich text Responsibilities -->
              @if (item.data?.responsibilitiesRichText) {
                <div class="project-section-block">
                  <span class="project-section-label">Roles & Responsibilities:</span>
                  <div class="project-rich-text" [innerHTML]="item.data?.responsibilitiesRichText"></div>
                </div>
              }
              <!-- Fallback for old array -->
              @if (!item.data?.responsibilitiesRichText && item.data?.responsibilities?.length) {
                <div class="project-section-block">
                  <span class="project-section-label">Roles & Responsibilities:</span>
                  <ul class="project-rich-text">
                    @for (resp of item.data?.responsibilities; track resp) {
                      <li>{{ resp }}</li>
                    }
                  </ul>
                </div>
              }
              <!-- Rich text Highlights -->
              @if (item.data?.highlightsRichText) {
                <div class="project-section-block">
                  <span class="project-section-label">Highlights:</span>
                  <div class="project-rich-text" [innerHTML]="item.data?.highlightsRichText"></div>
                </div>
              }
              <!-- Fallback for old array -->
              @if (!item.data?.highlightsRichText && item.data?.highlights?.length) {
                <div class="project-section-block">
                  <span class="project-section-label">Highlights:</span>
                  <ul class="project-rich-text">
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
  @Input() isPrintMode: boolean = false;

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
