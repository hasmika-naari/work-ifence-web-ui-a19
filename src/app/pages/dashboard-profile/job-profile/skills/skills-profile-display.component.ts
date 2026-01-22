
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { SkillV2 } from 'src/app/services/resume.model';

export interface SkillDisplaySection extends SkillV2 {
  placeholder?: boolean;
}

@Component({
  selector: 'skills-profile-display',
  standalone: true,
  imports: [ChipModule, ButtonModule],
  templateUrl: './skills-profile-display.component.html',
  styleUrls: ['./skills-profile-display.component.scss']
})
export class SkillsProfileDisplayComponent {
  @Input() skills: SkillDisplaySection[] | null = null;
  @Output() addSkillSection = new EventEmitter<void>();
  @Output() editSkillSection = new EventEmitter<number>();
  @Output() removeSkillSection = new EventEmitter<number>();
  @Output() moveSkillSection = new EventEmitter<{ index: number; direction: 'up' | 'down' }>();

  get hasSections(): boolean {
    return !!this.skills && this.skills.length > 0;
  }

  triggerAdd(): void {
    this.addSkillSection.emit();
  }

  triggerEdit(index: number): void {
    this.editSkillSection.emit(index);
  }

  triggerRemove(index: number): void {
    if (!this.canRemove(index)) {
      return;
    }
    this.removeSkillSection.emit(index);
  }

  triggerMove(index: number, direction: 'up' | 'down'): void {
    if (!this.canMove(index, direction)) {
      return;
    }
    this.moveSkillSection.emit({ index, direction });
  }

  canMoveUp(index: number): boolean {
    return this.canMove(index, 'up');
  }

  canMoveDown(index: number): boolean {
    return this.canMove(index, 'down');
  }

  canRemove(index: number): boolean {
    if (!this.skills || !this.skills[index]) {
      return false;
    }
    return true;
  }

  private canMove(index: number, direction: 'up' | 'down'): boolean {
    if (!this.skills || !this.skills[index]) {
      return false;
    }

    if (direction === 'up') {
      return index > 0;
    }

    return index < this.skills.length - 1;
  }
}
