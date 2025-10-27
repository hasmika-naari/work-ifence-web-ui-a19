import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStoreService } from 'src/app/services/store/user-store.service';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-profile-summary-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <div class="section profile-summary">
      <ng-container [ngSwitch]="data.format">
        <div *ngSwitchCase="'paragraph'" [innerHTML]="data.original_summary_html || data.profile_summary"></div>
        <div *ngSwitchCase="'bulleted'" [innerHTML]="data.original_summary_html || data.profile_summary"></div>
        <div *ngSwitchDefault [innerHTML]="data.original_summary_html || data.profile_summary"></div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./profile-summary-section.component.scss']
})
export class ProfileSummarySectionComponent {
  @Input() data: any;
  @Input() isPreview: boolean = false;
  @Input() canMoveDown: boolean = true;
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
