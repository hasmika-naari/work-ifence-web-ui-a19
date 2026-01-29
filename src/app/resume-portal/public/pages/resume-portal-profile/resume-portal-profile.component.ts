import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ResumePortalPublicStore } from '../../state/resume-portal-public.store';
import { AVAILABILITY_LABELS, WORK_AUTH_LABELS, formatUpdatedDays, maskLastName } from '../../utils/resume-portal.utils';
import type { ResumeCard } from '../../models/resume-card.model';

@Component({
  selector: 'app-resume-portal-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './resume-portal-profile.component.html',
  styleUrl: './resume-portal-profile.component.scss',
})
export class ResumePortalProfileComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ResumePortalPublicStore);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  readonly record = computed(() => this.store.getAll().find((item: ResumeCard) => item.id === this.id));
  readonly availabilityLabels = AVAILABILITY_LABELS;
  readonly workAuthLabels = WORK_AUTH_LABELS;

  displayName(): string {
    const record = this.record();
    if (!record) return '';
    return `${record.firstName} ${maskLastName(record.lastName)}`.trim();
  }

  updatedLabel(): string {
    const record = this.record();
    return record ? formatUpdatedDays(record.updatedAt) : '';
  }

  workAuthLabel(value: ResumeCard['workAuthorization']): string {
    return WORK_AUTH_LABELS[value];
  }

  availabilityLabel(value: ResumeCard['availability']): string {
    return AVAILABILITY_LABELS[value];
  }
}
