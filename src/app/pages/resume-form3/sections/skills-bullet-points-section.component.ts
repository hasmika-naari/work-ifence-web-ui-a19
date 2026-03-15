import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SkillV2 } from 'src/app/services/resume.model';

@Component({
  selector: 'resume-skills-bullet-points-section',
  standalone: true,
  imports: [],
  template: `
    <div class="section skills-bullet-points template1-section template1-skills-bullet-points-section">
      @if (allSkills.length) {
        <div class="skills-list">
          <ul class="skills-bullets">
            @for (skill of allSkills; track skill) {
              <li>{{ skill }}</li>
            }
          </ul>
        </div>
      } @else {
        <div class="no-skills">No skills added yet. Click <i class='pi pi-plus'></i> to add your skills.</div>
      }
    </div>
    `,
  styleUrls: ['./skills-bullet-points-section.component.scss']
})
export class SkillsBulletPointsSectionComponent {
  @Input() skills: SkillV2[] = [];
  @Input() skillsBulletPoints: string[] = [];
  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  get allSkills(): string[] {
    if (this.skillsBulletPoints && this.skillsBulletPoints.length) {
      return this.skillsBulletPoints;
    }
    if (!this.skills) return [];
    // Flatten all skills from all SkillV2 objects
    return this.skills.reduce((acc, s) => acc.concat(s.skills), [] as string[]);
  }
}
