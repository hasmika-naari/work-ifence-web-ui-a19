import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import type { ResumeCard } from '../../models/resume-card.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AVAILABILITY_LABELS,
  WORK_AUTH_LABELS,
  formatUpdatedDays,
  getDeterministicGradient,
  getInitials,
  maskLastName,
} from '../../utils/resume-portal.utils';

@Component({
  selector: 'app-resume-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: './resume-card.component.html',
  styleUrl: './resume-card.component.scss',
})
export class ResumeCardComponent {
  @Input({ required: true }) card!: ResumeCard;

  readonly availabilityLabels = AVAILABILITY_LABELS;
  readonly workAuthLabels = WORK_AUTH_LABELS;
  readonly maxSkills = 12;

  constructor(private readonly router: Router) {}

  displayName(): string {
    return `${this.card.firstName} ${maskLastName(this.card.lastName)}`.trim();
  }

  roleLine(): string {
    const specialization = this.card.headline?.split('|')[1]?.trim();
    return specialization ? `${this.card.primaryRole} | ${specialization}` : this.card.primaryRole;
  }

  skillsShownCount(): number {
    return Math.min(this.card.topSkills.length, this.maxSkills);
  }

  initials(): string {
    return getInitials(this.card.firstName, this.card.lastName);
  }

  avatarGradient(): string {
    return getDeterministicGradient(this.card.id);
  }

  updatedLabel(): string {
    return formatUpdatedDays(this.card.updatedAt);
  }

  handleMenuAction(action: 'view' | 'template' | 'share' | 'save' | 'report'): void {
    if (action === 'view') {
      this.viewProfile();
      return;
    }
    if (action === 'template') {
      this.useTemplate();
      return;
    }

    console.info(`[Resume Portal] ${action} action selected`, this.card.id);
  }

  viewProfile(): void {
    void this.router.navigate(['/resume-marketplace', this.card.id]);
  }

  useTemplate(): void {
    void this.router.navigate(['/resume-builder'], {
      queryParams: { templateKey: this.card.templateKey },
    });
  }
}
