import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-profile-summary-bulleted-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="section profile-summary-bulleted">
      <div *ngIf="data?.summary_bullets?.length; else noBullets">
        <ul class="summary-bullets">
          <li *ngFor="let bullet of data.summary_bullets">{{ bullet }}</li>
        </ul>
      </div>
      <ng-template #noBullets>
        <div class="empty-bullets">No summary bullet points added yet.</div>
      </ng-template>
      <!-- Header-level edit button for bulleted summary (for direct use in section, if needed) -->
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./profile-summary-bulleted-section.component.scss']
})
export class ProfileSummaryBulletedSectionComponent {
  @Input() data: any;
  @Input() isPreview: boolean = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
