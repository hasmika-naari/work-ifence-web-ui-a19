import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-profile-summary-bulleted-section',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="section profile-summary-bulleted template1-section template1-profile-summary-bulleted-section">
      @if (data?.profile_summary) {
        <div>
          <div class="summary-bullets-html" [innerHTML]="data.profile_summary"></div>
        </div>
      } @else {
        @if (data?.summary_bullets?.length) {
          <div>
            <ul class="summary-bullets">
              @for (bullet of data.summary_bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
          </div>
        } @else {
          <div class="empty-bullets">No summary bullet points added yet.</div>
        }
      }
      <ng-content></ng-content>
    </div>
    `,
  styleUrls: ['./profile-summary-bulleted-section.component.scss']
})
export class ProfileSummaryBulletedSectionComponent {
  @Input() data: any;
  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
