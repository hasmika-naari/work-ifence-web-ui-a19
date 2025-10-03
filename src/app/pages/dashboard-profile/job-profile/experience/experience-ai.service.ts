import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExperienceAiService {
  generateResponsibilities(prompt: string): Observable<string> {
    const sanitizedPrompt = prompt.trim();
    const baseContext = sanitizedPrompt.length ? sanitizedPrompt : 'this role';
  const response = this.composeResponsibilities(baseContext).trim();

    return of(response).pipe(delay(800));
  }

  private composeResponsibilities(context: string): string {
    const normalizedContext = context.charAt(0).toUpperCase() + context.slice(1);

    return [
      `- Lead ${normalizedContext} initiatives with measurable milestones and clear success criteria`,
      `- Collaborate with stakeholders to translate business needs into actionable roadmaps`,
      `- Mentor teammates, review deliverables, and uplift engineering craft through feedback`,
      `- Automate status tracking and continuously improve processes to reduce delivery friction`
    ].join('\n');
  }
}
