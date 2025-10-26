import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStoreService } from 'src/app/services/store/user-store.service';

@Component({
  selector: 'resume-profile-summary-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="section profile-summary">
      <div *ngIf="!isEmpty; else dummySummary">
        <ng-container [ngSwitch]="data.format">
          <div *ngSwitchCase="'paragraph'" [innerHTML]="data.profile_summary"></div>
          <div *ngSwitchCase="'bulleted'" [innerHTML]="data.profile_summary"></div>
          <div *ngSwitchDefault [innerHTML]="data.profile_summary"></div>
        </ng-container>
      </div>
      <ng-template #dummySummary>
        <div class="empty-profile-summary-message" style="color: #888; font-style: italic; padding: 8px 0;">
          No profile summary provided. Add a summary to highlight your background and key skills.
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./profile-summary-section.component.scss']
})
export class ProfileSummarySectionComponent {
  @Input() data: any;
  private userStore = inject(UserStoreService);

  get isEmpty(): boolean {
    return !this.data || !this.data.profile_summary;
  }

  get defaultSummary(): string {
    // Get default summary from PROFILE_SUMMARY section
    const resume = this.userStore.state().selectedResume?.resumeForm;
    const section = resume?.sections?.find((s: any) => s.section === 'PROFILE_SUMMARY');
    return section?.items?.[0]?.data?.profile_summary || '';
  }

  /**
   * Loads the profile summary data from the store's PROFILE_SUMMARY section.
   * Returns the data object or an empty object if not found.
   * This can be used to populate a form for editing.
   */
  loadProfileSummaryFromStore(): any {
    const resume = this.userStore.state().selectedResume?.resumeForm;
    const section = resume?.sections?.find((s: any) => s.section === 'PROFILE_SUMMARY');
    return section?.items?.[0]?.data || {};
  }
}
