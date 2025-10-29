import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-project-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section project">
      <h3>Projects</h3>
      <div *ngIf="data && data.length; else dummyProjects">
        <div *ngFor="let project of data">
          <div>{{ project.project_title }} <span *ngIf="project.project_link">(<a [href]="project.project_link" target="_blank">Link</a>)</span></div>
          <div>{{ project.description }}</div>
        </div>
      </div>
      <ng-template #dummyProjects>
        <div>Resume Builder App <span>(<a href="#" target="_blank">Link</a>)</span></div>
        <div>Created a dynamic resume builder using Angular and PrimeNG.</div>
        <div>Portfolio Website <span>(<a href="#" target="_blank">Link</a>)</span></div>
        <div>Designed and deployed a personal portfolio site.</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./project-section.component.scss']
})
export class ProjectSectionComponent {
  @Input() data!: any[];
  @Input() isPreview: boolean = false;
}
