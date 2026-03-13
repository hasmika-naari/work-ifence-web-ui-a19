import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-education-section',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="section education">
      @if (data && data.length) {
        <div>
          @for (edu of data; track trackByEducationId(i, edu); let i = $index) {
            <div class="education-item" style="position:relative;">
              <div class="education-item-container" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; position: relative; width: 100%;">
                @if (!isPreview) {
                  <span class="education-item-actions">
                    <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
                    <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete.emit(i)"></button>
                    <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === 0" (click)="onMoveUp(i)"></button>
                    <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === data.length - 1" (click)="onMoveDown(i)"></button>
                  </span>
                }
                <div style="display: flex; align-items: flex-start; width: 100%;">
                  <div style="flex:1; min-width:0;">
                    <div style="font-weight:600;">{{ (edu.data?.degree && edu.data?.field_of_study) ? (edu.data.degree + ' in ' + edu.data.field_of_study) : (edu.data?.degree || edu.data?.field_of_study || 'Degree and Field of Study') }}</div>
                    <div style="color:#555; font-size:14px;">{{ edu.data?.school_name || 'School or University' }}</div>
                  </div>
                  <span style="margin-left:24px; text-align:right; min-width:120px;">
                    <div style="color:#888; font-size:13px;">{{ edu.data?.school_location || 'Location' }}</div>
                    <div style="color:#888; font-size:13px;">{{ edu.data?.graduation_date || 'Date Period' }}</div>
                  </span>
                </div>
                <div style="color:#888; font-size:13px; margin-left:2px;">GPA - {{ edu.data?.gpa || 'GPA/Percentage' }}</div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="education-item" style="position:relative;">
          <div class="education-item-container" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; position: relative; width: 100%;">
            @if (!isPreview) {
              <span class="education-item-actions">
                <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="onDummyEdit()"></button>
                <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" disabled></button>
              </span>
            }
            <div style="display: flex; align-items: flex-start; width: 100%;">
              <div style="flex:1; min-width:0;">
                <div style="font-weight:600;">Degree and Field of Study</div>
                <div style="color:#555; font-size:14px;">School or University</div>
              </div>
              <span style="margin-left:24px; text-align:right; min-width:120px;">
                <div style="color:#888; font-size:13px;">Location</div>
                <div style="color:#888; font-size:13px;">Date Period</div>
              </span>
            </div>
            <div style="color:#888; font-size:13px; margin-left:2px;">GPA - GPA/Percentage</div>
          </div>
        </div>
      }
    </div>
    `,
  styleUrls: ['./education-section.component.scss']
})
export class EducationSectionComponent {
  @Input() data!: any[];
  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() dummyEdit = new EventEmitter<any>();

  // Emit dummy data for the sidenav form
  onDummyEdit() {
    this.dummyEdit.emit({
      degree: '',
      field_of_study: '',
      school_name: '',
      school_location: '',
      graduation_date: '',
      gpa: ''
    });
  }

  // Move up event handler
  onMoveUp(index: number) {
    this.moveUp.emit(index);
  }

  // Move down event handler
  onMoveDown(index: number) {
    this.moveDown.emit(index);
  }

  // TrackBy function for performance optimization
  trackByEducationId(index: number, item: any): any {
    return item.id || index;
  }
}
