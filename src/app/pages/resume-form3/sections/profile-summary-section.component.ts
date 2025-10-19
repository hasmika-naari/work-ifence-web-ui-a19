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
      <div *ngIf="!isEmpty; else dummySummary">
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
      <ng-template #dummySummary>
        <label for="summaryFormat">Format:</label>
        <select id="summaryFormat" [(ngModel)]="dummy.format">
          <option value="paragraph">Paragraph</option>
          <option value="bulleted">Bulleted</option>
        </select>
        <ng-container [ngSwitch]="dummy.format">
          <p *ngSwitchCase="'paragraph'">{{ dummy.paragraph }}</p>
          <ul *ngSwitchCase="'bulleted'">
            <li *ngFor="let item of dummy.bulleted">{{ item }}</li>
          </ul>
          <p *ngSwitchDefault>{{ dummy.paragraph }}</p>
        </ng-container>
      </ng-template>
    </div>
  `,
  styleUrls: ['./profile-summary-section.component.scss']
})
export class ProfileSummarySectionComponent {
  @Input() data: any;

  get isEmpty(): boolean {
    return !this.data || (!this.data.paragraph && (!this.data.bulleted || this.data.bulleted.length === 0));
  }

  dummy = {
    format: 'paragraph',
    paragraph: 'Dynamic, results-driven professional with a proven track record in delivering impactful solutions. Adept at collaborating with cross-functional teams and adapting to fast-paced environments. Passionate about continuous learning and professional growth. (This is dummy text for preview purposes.)',
    bulleted: [
      'Skilled in project management and team leadership',
      'Excellent communication and interpersonal abilities',
      'Proficient in modern web technologies and frameworks',
      'Quick learner and adaptable to new challenges',
      '(This is dummy text for preview purposes.)'
    ]
  };
}
