import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'resume-profile-summary-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="section profile-summary">
      <h3>Profile Summary</h3>
      <div *ngIf="data">
        <label for="summaryFormat">Format:</label>
        <select id="summaryFormat" [(ngModel)]="data.format">
          <option value="paragraph">Paragraph</option>
          <option value="bulleted">Bulleted</option>
        </select>
        <ng-container [ngSwitch]="data.format">
          <p *ngSwitchCase="'paragraph'">{{ data.paragraph }}</p>
          <ul *ngSwitchCase="'bulleted'">
            <li *ngFor="let item of data.bulleted">{{ item }}</li>
          </ul>
          <p *ngSwitchDefault>{{ data.paragraph || data.profile_summary }}</p>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./profile-summary-section.component.scss']
})
export class ProfileSummarySectionComponent {
  @Input() data: any;
}
