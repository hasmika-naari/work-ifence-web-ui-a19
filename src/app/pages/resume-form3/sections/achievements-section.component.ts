
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-achievements-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="section achievements">
      <ul *ngIf="achievements && achievements.length" class="achievements-list">
        <li *ngFor="let achievement of achievements; let i = index" class="achievement-item">
          <span class="ach-icon"><i class="pi pi-star"></i></span>
          <span class="ach-details">
            <span class="ach-title">{{ achievement.data?.title }}</span>
            <span class="ach-org" *ngIf="achievement.data?.organization">{{ achievement.data.organization }}</span>
          </span>
          <span class="ach-year" *ngIf="achievement.data?.year">{{ achievement.data.year }}</span>
          <span class="ach-actions" *ngIf="!isPreview">
            <button class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Edit" icon="pi pi-pencil" (click)="edit.emit(i)"></button>
            <button class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Delete" icon="pi pi-trash" (click)="delete.emit(i)"></button>
            <button class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Move Up" icon="pi pi-arrow-up" (click)="moveItemUp.emit(i)" [disabled]="i === 0"></button>
            <button class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Move Down" icon="pi pi-arrow-down" (click)="moveItemDown.emit(i)" [disabled]="i === achievements.length - 1"></button>
          </span>
        </li>
      </ul>
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
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveItemUp = new EventEmitter<number>();
  @Output() moveItemDown = new EventEmitter<number>();
}
