import { Component, Input } from '@angular/core';

@Component({
  selector: 'resume-project-section',
  standalone: true,
  template: `
    <div class="section project">
      <h3>Projects</h3>
      <div *ngIf="data && data.length">
        <div *ngFor="let project of data">
          <div>{{ project.project_title }} <span *ngIf="project.project_link">(<a [href]="project.project_link" target="_blank">Link</a>)</span></div>
          <div>{{ project.description }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./project-section.component.scss']
})
export class ProjectSectionComponent {
  @Input() data!: any[];
}
