import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

export interface ExperienceProfileItem {
  title: string;
  companyName?: string;
  location?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isCurrent?: boolean;
  responsibilities: string;
  keySkills?: string;
}

@Component({
  selector: 'experience-profile-display',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './experience-profile-display.component.html',
  styleUrls: ['./experience-profile-display.component.scss']
})
export class ExperienceProfileDisplayComponent {
  @Input() experiences: ExperienceProfileItem[] | null = [];
  @Output() addExperience = new EventEmitter<void>();
  @Output() editExperience = new EventEmitter<number>();

  get hasExperiences(): boolean {
    return !!this.experiences && this.experiences.length > 0;
  }

  triggerAdd(): void {
    this.addExperience.emit();
  }

  triggerEdit(index: number): void {
    this.editExperience.emit(index);
  }

  buildDateRange(item: ExperienceProfileItem): string {
    const start = this.combineMonthYear(item.startMonth, item.startYear);
    const end = item.isCurrent
      ? 'Present'
      : this.combineMonthYear(item.endMonth, item.endYear);

    if (!start && !end) {
      return '';
    }

    if (!end) {
      return start;
    }

    return `${start} - ${end}`.trim();
  }

  private combineMonthYear(month?: string, year?: string): string {
    const parts = [month, year].filter((value) => !!value && value.trim().length > 0);
    return parts.join(' ');
  }

  formatResponsibilities(responsibilities: string): string {
    return (responsibilities || '')
      .split(/\r?\n|<br\s*\/?\s*>/)
      .map((line) => line.trim())
      .filter((line) => !!line)
      .map((line) => `<li>${line}</li>`)
      .join('');
  }

  splitKeySkills(keySkills?: string): string[] {
    if (!keySkills) {
      return [];
    }
    return keySkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => !!skill);
  }
}
