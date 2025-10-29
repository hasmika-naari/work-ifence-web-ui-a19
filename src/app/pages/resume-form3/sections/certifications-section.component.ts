import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-certifications-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section certifications">
      <h3>Certifications</h3>
      <ul *ngIf="certifications && certifications.length; else dummyCertifications">
        <li *ngFor="let cert of certifications">{{ cert }}</li>
      </ul>
      <ng-template #dummyCertifications>
        <li>Certified Scrum Master</li>
        <li>Google Cloud Professional Developer</li>
        <li>Microsoft Azure Fundamentals</li>
      </ng-template>
    </div>
  `,
  styleUrls: ['./certifications-section.component.scss']
})
export class CertificationsSectionComponent {
  @Input() certifications: string[] = [];
  @Input() isPreview: boolean = false;
}
