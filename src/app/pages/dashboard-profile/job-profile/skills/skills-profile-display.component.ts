import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { Skill } from 'src/app/services/resume.model';

@Component({
  selector: 'skills-profile-display',
  standalone: true,
  imports: [CommonModule, ChipModule],
  templateUrl: './skills-profile-display.component.html',
  styleUrls: ['./skills-profile-display.component.scss']
})
export class SkillsProfileDisplayComponent {
  @Input() skills: Skill[] | null = null;
  @Output() editSkills = new EventEmitter<void>();

  get hasSkills(): boolean {
    return !!this.skills?.length;
  }

  get skillNames(): string[] {
    return (this.skills ?? []).map((skill) => skill.name).filter((name) => !!name?.trim());
  }

  onEdit(): void {
    this.editSkills.emit();
  }
}
