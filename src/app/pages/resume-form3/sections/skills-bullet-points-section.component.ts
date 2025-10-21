import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillV2 } from 'src/app/services/resume.model';

@Component({
  selector: 'resume-skills-bullet-points-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section skills-bullet-points">
      <h3>Skills (Bullet Points)</h3>
      <ul *ngIf="skills && skills.length; else noSkills">
        <li *ngFor="let skill of skills">
          <strong>{{ skill.sub_title }}:</strong>
          <span>{{ skill.skills.join(', ') }}</span>
        </li>
      </ul>
      <ng-template #noSkills>
        <li>No skills added yet.</li>
      </ng-template>
    </div>
  `,
  styleUrls: ['./skills-bullet-points-section.component.scss']
})
export class SkillsBulletPointsSectionComponent {
  @Input() skills: SkillV2[] = [];
}
