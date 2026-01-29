import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ResumePortalPublicStore } from '../../state/resume-portal-public.store';
import type { ResumeCard } from '../../models/resume-card.model';
import { AVAILABILITY_LABELS, WORK_AUTH_LABELS } from '../../utils/resume-portal.utils';

@Component({
  selector: 'app-resume-filters-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './resume-filters-sheet.component.html',
  styleUrl: './resume-filters-sheet.component.scss',
})
export class ResumeFiltersSheetComponent {
  private readonly store = inject(ResumePortalPublicStore);
  private readonly sheetRef = inject(MatBottomSheetRef<ResumeFiltersSheetComponent>);

  readonly availabilityLabels = AVAILABILITY_LABELS;
  readonly workAuthLabels = WORK_AUTH_LABELS;
  readonly filters = this.store.filters;
  readonly roles = this.store.roles;
  readonly skills = this.store.skills;
  readonly domains = this.store.domains;

  readonly workAuthOptions: ResumeCard['workAuthorization'][] = ['US_CITIZEN', 'GC', 'H1B', 'EAD', 'OTHER'];
  readonly availabilityOptions: ResumeCard['availability'][] = ['IMMEDIATE', '2_WEEKS', '1_MONTH', 'NOT_LOOKING'];

  close(): void {
    this.sheetRef.dismiss();
  }

  clear(): void {
    this.store.resetFilters();
  }

  updateRole(value: string): void {
    this.store.patchFilters({ role: value });
  }

  updateSkills(values: string[]): void {
    this.store.patchFilters({ skills: values });
  }

  updateYearsMin(value: string): void {
    this.store.patchFilters({ yearsMin: value ? Number(value) : null });
  }

  updateYearsMax(value: string): void {
    this.store.patchFilters({ yearsMax: value ? Number(value) : null });
  }

  updateLocation(value: string): void {
    this.store.patchFilters({ location: value });
  }

  updateWorkAuth(value: string): void {
    this.store.patchFilters({ workAuthorization: value as ResumeCard['workAuthorization'] | '' });
  }

  updateAvailability(value: string): void {
    this.store.patchFilters({ availability: value as ResumeCard['availability'] | '' });
  }

  updateDomain(value: string): void {
    this.store.patchFilters({ domain: value as ResumeCard['badges']['domain'] | '' });
  }

  toggleBadge(key: 'atsOptimized' | 'verified' | 'activelyLooking', checked: boolean): void {
    this.store.patchFilters({
      badges: {
        ...this.filters().badges,
        [key]: checked,
      },
    });
  }
}
