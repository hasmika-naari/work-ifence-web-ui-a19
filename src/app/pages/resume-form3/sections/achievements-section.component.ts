
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-achievements-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section achievements">
      <div class="section-header">
        <span class="section-header-actions" *ngIf="!isPreview">
          <button class="ach-action-btn" pButton pTooltip="Add" icon="pi pi-plus" (click)="add.emit()"></button>
          <button class="ach-action-btn" pButton pTooltip="Delete Section" icon="pi pi-trash" (click)="deleteSection.emit()"></button>
          <button class="ach-action-btn" pButton pTooltip="Move Up" icon="pi pi-arrow-up" (click)="moveUp.emit()"></button>
          <button class="ach-action-btn" pButton pTooltip="Move Down" icon="pi pi-arrow-down" (click)="moveDown.emit()"></button>
        </span>
      </div>
      <ul *ngIf="achievements && achievements.length; else dummyAchievements" class="achievements-list">
        <li *ngFor="let achievement of achievements; let i = index" class="achievement-item">
          <span class="ach-icon"><i class="pi pi-star"></i></span>
          <span class="ach-details">
            <span class="ach-title">{{ achievement.title || achievement }}</span>
            <span class="ach-org" *ngIf="achievement.organization">{{ achievement.organization }}</span>
          </span>
          <span class="ach-year" *ngIf="achievement.year">{{ achievement.year }}</span>
          <span class="ach-actions" *ngIf="!isPreview">
            <button class="ach-action-btn" pButton pTooltip="Edit" icon="pi pi-pencil" (click)="edit.emit(i)"></button>
            <button class="ach-action-btn" pButton pTooltip="Delete" icon="pi pi-trash" (click)="delete.emit(i)"></button>
            <button class="ach-action-btn" pButton pTooltip="Move Up" icon="pi pi-arrow-up" (click)="moveItemUp.emit(i)"></button>
            <button class="ach-action-btn" pButton pTooltip="Move Down" icon="pi pi-arrow-down" (click)="moveItemDown.emit(i)"></button>
          </span>
        </li>
      </ul>
      <ng-template #dummyAchievements>
        <li class="achievement-item">
          <span class="ach-icon"><i class="pi pi-star"></i></span>
          <span class="ach-details">
            <span class="ach-title">Received Employee of the Year award</span>
          </span>
        </li>
        <li class="achievement-item">
          <span class="ach-icon"><i class="pi pi-star"></i></span>
          <span class="ach-details">
            <span class="ach-title">Published 3 research papers in top journals</span>
          </span>
        </li>
        <li class="achievement-item">
          <span class="ach-icon"><i class="pi pi-star"></i></span>
          <span class="ach-details">
            <span class="ach-title">Led a team to win a national hackathon</span>
          </span>
        </li>
      </ng-template>
    </div>
  `,
  styleUrls: ['./achievements-section.component.scss']
})
export class AchievementsSectionComponent {
  @Input() achievements: any[] = [];
  @Input() isPreview: boolean = false;

  // Section header actions
  @Output() add = new EventEmitter<void>();
  @Output() deleteSection = new EventEmitter<void>();
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();

  // Per-item actions
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveItemUp = new EventEmitter<number>();
  @Output() moveItemDown = new EventEmitter<number>();
}
