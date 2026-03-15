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
            <div class="education-item">
              <div class="education-item-container">
                @if (!isPreview) {
                  <span class="education-item-actions">
                    <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
                    <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete.emit(i)"></button>
                    <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === 0" (click)="onMoveUp(i)"></button>
                    <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === data.length - 1" (click)="onMoveDown(i)"></button>
                  </span>
                }
                <div class="education-row">
                  <div class="education-main">
                    <div class="education-degree">{{ (edu.data?.degree && edu.data?.field_of_study) ? (edu.data.degree + ' in ' + edu.data.field_of_study) : (edu.data?.degree || edu.data?.field_of_study || 'Degree and Field of Study') }}</div>
                    <div class="education-school">{{ edu.data?.school_name || 'School or University' }}</div>
                  </div>
                  <span class="education-meta">
                    <div class="education-meta-line">{{ edu.data?.school_location || 'Location' }}</div>
                    <div class="education-meta-line">{{ edu.data?.graduation_date || 'Date Period' }}</div>
                  </span>
                </div>
                <div class="education-gpa">GPA - {{ edu.data?.gpa || 'GPA/Percentage' }}</div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="education-item">
          <div class="education-item-container">
            @if (!isPreview) {
              <span class="education-item-actions">
                <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="onDummyEdit()"></button>
                <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" disabled></button>
              </span>
            }
            <div class="education-row">
              <div class="education-main">
                <div class="education-degree">Degree and Field of Study</div>
                <div class="education-school">School or University</div>
              </div>
              <span class="education-meta">
                <div class="education-meta-line">Location</div>
                <div class="education-meta-line">Date Period</div>
              </span>
            </div>
            <div class="education-gpa">GPA - GPA/Percentage</div>
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
