import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { courseWork } from 'src/app/services/resume.model';

@Component({
  selector: 'app-relevant-coursework-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-section">
      <h2>Relevant Coursework</h2>
      <ul *ngIf="courseworkList && courseworkList.length > 0; else noCoursework">
        <li *ngFor="let course of courseworkList">
          <strong>{{ course.courseworkname }}</strong>
          <span *ngIf="course.institution"> - {{ course.institution }}</span>
        </li>
      </ul>
      <ng-template #noCoursework>
        <p>No relevant coursework added yet.</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./relevant-coursework-section.component.scss']
})
export class RelevantCourseworkSectionComponent {
  @Input() courseworkList: courseWork[] = [];
}
