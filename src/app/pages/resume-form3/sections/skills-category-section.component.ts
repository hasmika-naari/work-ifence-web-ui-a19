import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-skills-category-section',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="section skills-category template1-section template1-skills-category-section">
      @if (items && items.length) {
        <div>
          @for (item of items; track item; let i = $index) {
            <div class="skills-category-block formal-block skills-category-item">
              <div class="skills-category-item-container">
                @if (!isPreview) {
                  <span class="skills-category-item-actions">
                    <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
                    <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="deleteItem.emit(i)"></button>
                    <button pButton pTooltip="Move Up" icon="pi pi-arrow-up" class="p-button-rounded p-button-text p-button-sm" (click)="moveUp.emit(i)" [disabled]="i === 0"></button>
                    <button pButton pTooltip="Move Down" icon="pi pi-arrow-down" class="p-button-rounded p-button-text p-button-sm" (click)="moveDown.emit(i)" [disabled]="i === items.length - 1"></button>
                  </span>
                }
                <div class="skills-category-header-row">
                  <div class="skills-category-title formal-title">{{ getItemTitle(item) }}</div>
                </div>
                <div class="skills-inline-list-compact">
                  @for (skill of getItemSkills(item); track skill; let last = $last) {
                    <span>{{ skill }}</span>@if (!last) {
                    <span>, </span>
                  }
                }
              </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <p>No categorized skills added yet.</p>
    }
    </div>
    `,
  styleUrls: ['./skills-category-section.component.scss']
})
export class SkillsCategorySectionComponent {
  @Input() items: any[] = [];
  @Input() isPreview = false;
  @Input() isPrintMode: boolean = false;
  @Output() edit = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<number>();

  getItemTitle(item: any): string {
    return item?.data?.name ?? item?.data?.sub_title ?? item?.name ?? item?.sub_title ?? '';
  }

  getItemSkills(item: any): string[] {
    const skills = item?.data?.skills ?? item?.skills;
    return Array.isArray(skills) ? skills : [];
  }
}
