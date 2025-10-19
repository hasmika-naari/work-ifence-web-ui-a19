import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-work-experience-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section work-experience">
      <h3>Work Experience</h3>
      <div *ngIf="data && data.length">
        <div *ngFor="let job of data">
          <div>{{ job.position_title }} at {{ job.company_name }} ({{ job.start_date }} - {{ job.end_date }})</div>
          <div>{{ job.description }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./work-experience-section.component.scss']
})
export class WorkExperienceSectionComponent {
  @Input() data!: any[];
}
