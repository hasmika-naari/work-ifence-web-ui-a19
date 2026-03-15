import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { UserStoreService } from 'src/app/services/store/user-store.service';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-profile-summary-section',
  standalone: true,
  imports: [FormsModule, ButtonModule],
  template: `
    <div class="section profile-summary template1-section template1-profile-summary-section">
      @switch (data.format) {
        @case ('paragraph') {
          <div [innerHTML]="data.original_summary_html || data.profile_summary"></div>
        }
        @case ('bulleted') {
          <div [innerHTML]="data.original_summary_html || data.profile_summary"></div>
        }
        @default {
          <div [innerHTML]="data.original_summary_html || data.profile_summary"></div>
        }
      }
    </div>
    `,
  styleUrls: ['./profile-summary-section.component.scss']
})
export class ProfileSummarySectionComponent {
  @Input() data: any;
  @Input() isPreview: boolean = false;
  @Input() canMoveDown: boolean = true;
  @Input() isPrintMode: boolean = false;
  @Output() edit = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();

  private userStore = inject(UserStoreService);

  onEdit(): void {
    this.edit.emit();
  }

  onMoveDown(): void {
    this.moveDown.emit();
  }
}
