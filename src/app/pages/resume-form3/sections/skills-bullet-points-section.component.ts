import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillV2 } from 'src/app/services/resume.model';

@Component({
  selector: 'resume-skills-bullet-points-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section skills-bullet-points">
      <div class="skills-list" *ngIf="allSkills.length; else noSkills">
        <ul class="skills-bullets">
          <ng-container *ngFor="let skill of allSkills">
            <li>{{ skill }}</li>
          </ng-container>
        </ul>
      </div>
      <ng-template #noSkills>
        <div class="no-skills">No skills added yet. Click <i class='pi pi-plus'></i> to add your skills.</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./skills-bullet-points-section.component.scss']
})
export class SkillsBulletPointsSectionComponent {
  @Input() skills: SkillV2[] = [];
  @Input() skillsBulletPoints: string[] = [];
  @Input() isPreview: boolean = false;
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
