import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-work-experience-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section work-experience">
      <h3>Work Experience</h3>
      <div *ngIf="data && data.length; else dummyWork">
        <div *ngFor="let job of data">
          <div>{{ job.position_title }} at {{ job.company_name }} ({{ job.start_date }} - {{ job.end_date }})</div>
          <div>{{ job.description }}</div>
        </div>
      </div>
      <ng-template #dummyWork>
        <div>Software Engineer at TechCorp (2022 - 2024)</div>
        <div>Developed scalable web applications and collaborated with cross-functional teams.</div>
        <div>Intern at WebStart (2021 - 2022)</div>
        <div>Assisted in frontend development and testing.</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./work-experience-section.component.scss']
})
export class WorkExperienceSectionComponent {
  @Input() data!: any[];
}
