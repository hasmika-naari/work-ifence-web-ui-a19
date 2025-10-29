import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Experience } from 'src/app/services/resume.model';

@Component({
  selector: 'resume-work-experience-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="section work-experience">
      <div *ngIf="data && data.length" class="work-experience-list">
        <div *ngFor="let job of data; let i = index; trackBy: trackByExperienceId" class="work-experience-item">
          <div class="work-experience-item-container">
            <span class="work-experience-item-actions" *ngIf="!isPreview">
              <button pButton pTooltip="Edit" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" (click)="edit.emit(i)"></button>
              <button pButton pTooltip="Delete" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm" (click)="delete.emit(i)"></button>
            </span>
            <div class="job-header">
              <div>
                <div class="job-title">{{ job.position_title || 'Position Title' }}</div>
                <div class="company">{{ job.company_name || 'Company Name' }}</div>
              </div>
              <div class="dates">{{ formatDate(job.start_date) }} - {{ formatDate(job.end_date) }}</div>
            </div>
            <div class="job-description" [innerHTML]="job.description || 'Job description'"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./work-experience-section.component.scss']
})

export class WorkExperienceSectionComponent {
  @Input() data!: any[];
  @Input() isPreview: boolean = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  private userStore = inject(UserStoreService);

  // No dummy logic or direct store calls; emit index to parent

  // TrackBy function for performance optimization
  trackByExperienceId(index: number, item: any): any {
    return item.id || index;
  }

  formatDate(date: string): string {
    if (!date) return '';
    const presentLabels = ['present', 'current', 'now'];
    if (presentLabels.includes(date.trim().toLowerCase())) {
      return 'Present';
    }
    // Try to parse as YYYY-MM-DD, YYYY-MM, or MM/YYYY
    let d: Date | null = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      d = new Date(date);
    } else if (/^\d{4}-\d{2}$/.test(date)) {
      d = new Date(date + '-01');
    } else if (/^\d{2}[\/-]\d{4}$/.test(date)) {
      // MM/YYYY or MM-YYYY
      const [mm, yyyy] = date.split(/[\/-]/);
      d = new Date(`${yyyy}-${mm}-01`);
    } else if (/^[A-Za-z]{3} \d{4}$/.test(date)) {
      // MMM YYYY format (e.g., "Apr 2020")
      d = new Date(date + '-01');
    } else if (/^\d{4}$/.test(date)) {
      // Just a year
      return date;
    }
    if (d && !isNaN(d.getTime())) {
      return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }
    return date;
  }
}
