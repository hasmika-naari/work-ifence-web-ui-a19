import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-skills-category-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="section skills-category">
      <div *ngIf="items && items.length; else noSkills">
        <div *ngFor="let item of items; let i = index" class="skills-category-block formal-block skills-category-item">
          <div class="skills-category-item-container">
            <span class="skills-category-item-actions" *ngIf="!isPreview">
              <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
              <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="deleteItem.emit(i)"></button>
              <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" (click)="moveUp.emit(i)" [disabled]="i === 0"></button>
              <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" (click)="moveDown.emit(i)" [disabled]="i === items.length - 1"></button>
            </span>
            <div class="skills-category-header-row">
              <div class="skills-category-title formal-title">{{ item.data.name }}</div>
            </div>
            <div class="skills-inline-list-compact">
              <ng-container *ngFor="let skill of item.data.skills; let last = last">
                <span>{{ skill }}</span><span *ngIf="!last">, </span>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
      <ng-template #noSkills>
        <p>No categorized skills added yet.</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./skills-category-section.component.scss']
})
export class SkillsCategorySectionComponent {
  @Input() items: any[] = [];
  @Input() isPreview = false;
  @Output() edit = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<number>();
}
