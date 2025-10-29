import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillV2 } from 'src/app/services/resume.model';

@Component({
  selector: 'resume-skills-category-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section skills-category">
      <h3>Skills (Category)</h3>
      <div *ngIf="skills && skills.length; else noSkills">
        <div *ngFor="let skill of skills" class="skill-category">
          <strong>{{ skill.sub_title }}</strong>
          <ul>
            <li *ngFor="let s of skill.skills">{{ s }}</li>
          </ul>
        </div>
      </div>
      <ng-template #noSkills>
        <p>No categorized skills added yet.</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./skills-category-section.component.scss']
})
export class SkillsCategorySectionComponent {
  @Input() skills: SkillV2[] = [];
  @Input() isPreview: boolean = false;
}
