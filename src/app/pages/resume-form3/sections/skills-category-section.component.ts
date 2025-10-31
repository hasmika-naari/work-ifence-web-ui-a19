import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillV2 } from 'src/app/services/resume.model';

@Component({
  selector: 'resume-skills-category-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section skills-category">
      <div *ngIf="skills && skills.length; else noSkills">
        <!-- Support both SkillV2[] and category/skills[] formats -->
        <ng-container *ngIf="isCategoryFormat(skills); else oldFormat">
          <div *ngFor="let category of skills" class="skills-category-block">
            <span class="skills-category-title">{{ category.name }}:</span>
            <span class="skills-inline-list">
              <ng-container *ngFor="let skill of category.skills; let last = last">
                {{ skill }}<span *ngIf="!last">, </span>
              </ng-container>
            </span>
          </div>
        </ng-container>
        <ng-template #oldFormat>
          <div *ngFor="let skill of skills" class="skill-category">
            <strong>{{ skill.sub_title }}</strong>
            <ul>
              <li *ngFor="let s of skill.skills">{{ s }}</li>
            </ul>
          </div>
        </ng-template>
      </div>
      <ng-template #noSkills>
        <p>No categorized skills added yet.</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./skills-category-section.component.scss']
})
export class SkillsCategorySectionComponent {
  @Input() skills: any[] = [];
  @Input() isPreview: boolean = false;

  isCategoryFormat(skills: any[]): boolean {
    // If the first item has a 'name' and 'skills' array, treat as category format
    return Array.isArray(skills) && skills.length > 0 && typeof skills[0].name === 'string' && Array.isArray(skills[0].skills);
  }
}
