import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Resume1TemplateComponent } from './template/template.component';

@Component({
  selector: 'app-print-resume',
  template: `
    <app-resume1-template
      [isPrintMode]="true"
      (rendered)="onRendered()"
    ></app-resume1-template>
  `,
  standalone: true,
  imports: [CommonModule, Resume1TemplateComponent]
})
export class PrintResumeComponent {
  resumeId: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.resumeId = this.route.snapshot.paramMap.get('resumeId');
  }
  onRendered() {
    (window as any).resumeRenderDone = true;
  }
}
