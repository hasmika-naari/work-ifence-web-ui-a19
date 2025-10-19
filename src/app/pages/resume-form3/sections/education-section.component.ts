import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-education-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section education">
      <h3>Education</h3>
      <div *ngIf="data && data.length; else dummyEducation">
        <div *ngFor="let edu of data">
          <div>{{ edu.degree }} - {{ edu.school_name }} ({{ edu.graduation_year }})</div>
        </div>
      </div>
      <ng-template #dummyEducation>
        <div>B.Sc. Computer Science - Example University (2022)</div>
        <div>M.Sc. Software Engineering - Example Institute (2024)</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./education-section.component.scss']
})
export class EducationSectionComponent {
  @Input() data!: any[];
}
