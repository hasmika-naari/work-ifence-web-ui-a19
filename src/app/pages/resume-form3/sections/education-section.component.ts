import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-education-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="section education">
      <div *ngIf="data && data.length; else dummyEducation">
        <div *ngFor="let edu of data; let i = index" class="education-item" style="position:relative;">
          <div class="education-item-container" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; position: relative; width: 100%;">
            <span class="education-item-actions">
              <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
              <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete.emit(i)"></button>
              <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === 0" (click)="moveUp.emit(i)"></button>
              <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === data.length - 1" (click)="moveDown.emit(i)"></button>
            </span>
            <div style="display: flex; align-items: flex-start; width: 100%;">
              <div style="flex:1; min-width:0;">
                <div style="font-weight:600;">{{ edu.degree || 'Degree and Field of Study' }}</div>
                <div style="color:#555; font-size:14px;">{{ edu.school_name || 'School or University' }}</div>
              </div>
              <span style="margin-left:24px; text-align:right; min-width:120px;">
                <div style="color:#888; font-size:13px;">{{ edu.school_location || 'Location' }}</div>
                <div style="color:#888; font-size:13px;">{{ edu.graduation_date || 'Date Period' }}</div>
              </span>
            </div>
            <div style="color:#888; font-size:13px; margin-left:2px;">GPA - {{ edu.gpa || 'GPA/Percentage' }}</div>
          </div>
        </div>
      </div>
      <ng-template #dummyEducation>
        <div class="education-item" style="position:relative;">
          <div class="education-item-container" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; position: relative; width: 100%;">
            <span class="education-item-actions">
              <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="onDummyEdit()"></button>
              <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" disabled></button>
            </span>
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
      </ng-template>
    </div>
  `,
  styleUrls: ['./education-section.component.scss']
})
export class EducationSectionComponent {
  @Input() data!: any[];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() dummyEdit = new EventEmitter<any>();

  onDummyEdit() {
    // Emit dummy data for the sidenav form
    this.dummyEdit.emit({
      degree: 'Degree and Field of Study',
      school_name: 'School or University',
      location: 'Location',
      date_period: 'Date Period',
      gpa: 'GPA/Percentage'
    });
  }
}
