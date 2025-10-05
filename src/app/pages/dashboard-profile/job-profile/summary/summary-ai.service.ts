import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SummaryAiService {
  generateSummary(prompt: string): Observable<string> {
    const sanitized = prompt.trim();
    if (!sanitized) {
      return of('<p><strong>Professional Summary</strong></p><p>Add a prompt to generate tailored content.</p>').pipe(delay(600));
    }

    const sentences = this.extractSentences(sanitized);
    const intro = sentences.length ? sentences[0] : sanitized;
    const highlights = sentences.slice(1, 5);

    const html = [
      `<p><strong>Professional Summary</strong></p>`,
      `<p>${this.capitalize(intro)}</p>`,
      highlights.length
        ? `<ul>${highlights
            .map((item) => `<li>${this.capitalize(item)}</li>`)
            .join('')}</ul>`
        : ''
    ]
      .filter(Boolean)
      .join('');

    return of(html).pipe(delay(1200));
  }

  private extractSentences(text: string): string[] {
    return text
      .split(/[\r\n]+|(?<=[.!?])\s+/)
      .map((segment) => segment.replace(/\s+/g, ' ').trim())
      .filter((segment) => segment.length > 0);
  }

  private capitalize(value: string): string {
    if (!value) {
      return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
