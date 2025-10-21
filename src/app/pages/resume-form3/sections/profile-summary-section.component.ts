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
        <div [innerHTML]="defaultSummary"></div>
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
    // Get default summary from store only
    const resume = this.userStore.state().selectedResume?.resumeForm;
    return resume?.profileSummary?.profile_summary || '';
  }
}
