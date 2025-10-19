import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-achievements-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section achievements">
      <h3>Achievements</h3>
      <ul *ngIf="achievements && achievements.length; else dummyAchievements">
        <li *ngFor="let achievement of achievements">{{ achievement }}</li>
      </ul>
      <ng-template #dummyAchievements>
        <li>Received Employee of the Year award</li>
        <li>Published 3 research papers in top journals</li>
        <li>Led a team to win a national hackathon</li>
      </ng-template>
    </div>
  `,
  styleUrls: ['./achievements-section.component.scss']
})
export class AchievementsSectionComponent {
  @Input() achievements: string[] = [];
}
