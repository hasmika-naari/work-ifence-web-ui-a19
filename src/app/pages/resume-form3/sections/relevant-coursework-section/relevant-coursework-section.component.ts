import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { courseWork } from 'src/app/services/resume.model';

@Component({
  selector: 'app-relevant-coursework-section',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="resume-section coursework-section">
      @if (courseworkList && courseworkList.length > 0) {
        <div>
          @for (course of courseworkList; track course; let i = $index) {
            <div class="coursework-item">
              <span class="coursework-item-actions">
                <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
                <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete.emit(i)"></button>
                @if (courseworkList.length > 1) {
                  <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === 0" (click)="moveUp.emit(i)"></button>
                  <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" [disabled]="i === courseworkList.length - 1" (click)="moveDown.emit(i)"></button>
                }
              </span>
              <div class="coursework-title">{{ course.courseworkname }}</div>
              @if (course.institution) {
                <div class="coursework-institution">{{ course.institution }}</div>
              }
            </div>
          }
        </div>
      } @else {
        <p>No relevant coursework added yet.</p>
      }
    </div>
    `,
  styleUrls: ['./relevant-coursework-section.component.scss']
})
export class RelevantCourseworkSectionComponent implements OnChanges {
  @Input() courseworkList: courseWork[] = [];
  @Input() resetFormTrigger: boolean = false;
  @Input() isPreview: boolean = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetFormTrigger'] && !changes['resetFormTrigger'].firstChange) {
      // Emit a custom event to parent form to clear fields if needed
      const form = document.querySelector('app-resume-course-work form');
      if (form) {
        const courseworkInput = form.querySelector('input[formControlName=coursework]') as HTMLInputElement;
        const institutionInput = form.querySelector('input[formControlName=institution]') as HTMLInputElement;
        if (courseworkInput) courseworkInput.value = '';
        if (institutionInput) institutionInput.value = '';
      }
    }
  }
}
