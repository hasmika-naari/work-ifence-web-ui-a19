import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-skills-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section skills">
      <h3>Skills</h3>
      <ul *ngIf="skills && skills.length; else dummySkills">
        <li *ngFor="let skill of skills">{{ skill }}</li>
      </ul>
      <ng-template #dummySkills>
        <li>JavaScript</li>
        <li>TypeScript</li>
        <li>Angular</li>
        <li>Node.js</li>
        <li>Python</li>
      </ng-template>
    </div>
  `,
  styleUrls: ['./skills-section.component.scss']
})
export class SkillsSectionComponent {
  @Input() skills: string[] = [];
}
