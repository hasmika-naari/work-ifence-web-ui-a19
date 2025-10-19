import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-contact-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section contact">
      <h3>Contact Information</h3>
      <div *ngIf="data">
        <div>Name: {{ data.name }}</div>
        <div>Email: {{ data.email }}</div>
        <div>Phone: {{ data.phone }}</div>
        <!-- Add more fields as needed -->
      </div>
    </div>
  `,
  styleUrls: ['./contact-section.component.scss']
})
export class ContactSectionComponent {
  @Input() data: any;
}
