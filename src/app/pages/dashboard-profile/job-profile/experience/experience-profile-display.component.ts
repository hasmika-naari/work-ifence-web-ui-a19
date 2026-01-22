
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
  placeholder?: boolean;
}

@Component({
  selector: 'experience-profile-display',
  standalone: true,
  imports: [CardModule, ButtonModule],
  templateUrl: './experience-profile-display.component.html',
  styleUrls: ['./experience-profile-display.component.scss']
})
export class ExperienceProfileDisplayComponent {
  @Input() experiences: ExperienceProfileItem[] | null = [];
  @Output() addExperience = new EventEmitter<void>();
  @Output() editExperience = new EventEmitter<number>();
  @Output() removeExperience = new EventEmitter<number>();
  @Output() moveExperience = new EventEmitter<{ index: number; direction: 'up' | 'down' }>();

  get hasExperiences(): boolean {
    return !!this.experiences && this.experiences.length > 0;
  }

  triggerAdd(): void {
    this.addExperience.emit();
  }

  triggerEdit(index: number): void {
    this.editExperience.emit(index);
  }

  triggerRemove(index: number): void {
    if (!this.canRemove(index)) {
      return;
    }
    this.removeExperience.emit(index);
  }

  triggerMove(index: number, direction: 'up' | 'down'): void {
    if (!this.canMove(index, direction)) {
      return;
    }
    this.moveExperience.emit({ index, direction });
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

    if (!start) {
      return end;
    }

    return `${start} - ${end}`.trim();
  }

  private combineMonthYear(month?: string, year?: string): string {
    const parts = [month, year].filter((value) => !!value && value.trim().length > 0);
    return parts.join(' ');
  }

  formatResponsibilities(responsibilities: string): string {
    const value = (responsibilities || '').trim();
    if (!value) {
      return '';
    }

    if (/<[a-z][\s\S]*>/i.test(value)) {
      return value;
    }

    const bulletLines = value
      .split(/\r?\n|<br\s*\/?\s*>/)
      .map((line) => line.trim())
      .filter((line) => !!line);

    if (!bulletLines.length) {
      return value;
    }

    const items = bulletLines.map((line) => `<li>${this.escapeHtml(line)}</li>`).join('');
    return `<ul>${items}</ul>`;
  }

  private escapeHtml(value: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return value.replace(/[&<>"']/g, (char) => map[char]);
  }

  splitKeySkills(keySkills?: string | string[]): string[] {
    if (!keySkills) {
      return [];
    }
    const entries = Array.isArray(keySkills) ? keySkills : keySkills.split(',');
    return entries
      .map((skill) => (skill ?? '').trim())
      .filter((skill) => !!skill);
  }

  canMoveUp(index: number): boolean {
    return this.canMove(index, 'up');
  }

  canMoveDown(index: number): boolean {
    return this.canMove(index, 'down');
  }

  canRemove(index: number): boolean {
    if (!this.experiences || !this.experiences[index]) {
      return false;
    }
    return true;
  }

  private canMove(index: number, direction: 'up' | 'down'): boolean {
    if (!this.experiences || !this.experiences[index]) {
      return false;
    }

    if (direction === 'up') {
      return index > 0;
    }

    return index < this.experiences.length - 1;
  }
}
