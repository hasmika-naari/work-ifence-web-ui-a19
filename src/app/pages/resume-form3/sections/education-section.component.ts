import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-education-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section education">
      <h3>Education</h3>
      <div *ngIf="data && data.length">
        <div *ngFor="let edu of data">
          <div>{{ edu.degree }} - {{ edu.school_name }} ({{ edu.graduation_year }})</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./education-section.component.scss']
})
export class EducationSectionComponent {
  @Input() data!: any[];
}
